///<reference path='typings/tsd.d.ts'/>

import {ExpressGoGlobal} from "./typings/express-go";
declare var global : ExpressGoGlobal;

var fs   = require( 'fs' );
var path = require( 'path' );
var glob = require( 'glob' );

var express = require( 'express' );

var bodyParser    = require( 'body-parser' );
var compress      = require( 'compression' );
var cookieParser  = require( 'cookie-parser' );
var csrf          = require( 'csurf' );
var favicon       = require( 'serve-favicon' );
var forceSSL      = require( 'express-force-ssl' );
var helmet        = require( 'helmet' );
var logger        = require( 'morgan' );
var nodalytics    = require( 'nodalytics' );
var session       = require( 'express-session' );
var i18nxt        = require( 'i18next' );
var i18nxtFSB     = require( 'i18next-node-fs-backend' );
var i18nxtSprintf = require( 'i18next-sprintf-postprocessor' );

var redis       = require( 'redis' );
var redisClient = redis.createClient();
var RedisStore  = require( "connect-redis" )( session );

var debug = require( 'debug' )( 'express-go:Express' );

// Settings
var languages = [
	'dev',
	'hu',
	'en'
];


debug( "Express object created" );
var app = express();


/**
 * Session Middleware for Express & Socket.io
 */
app.sessionSettings =
{
	store             : new RedisStore( {
		"client" : redisClient,
		"host"   : process.env.REDIS_HOST,
		"port"   : process.env.REDIS_PORT
	} ),
	secret            : process.env.SECRET,
	resave            : true,
	saveUninitialized : false,
	proxy             : true,
	cookie            : {
		"path"     : '/',
		"secure"   : true,
		"httpOnly" : true,
		"maxAge"   : null
	},
	key               : 's3ss10n'
};


class ExpressGo
{
	constructor( app )
	{
		debug( "ExpressGo init app" );


		debug( "ExpressGo init initParsers" );
		this.initParsers();

		debug( "ExpressGo init initTranslator" );
		this.initTranslator();

		debug( "ExpressGo init initStatics" );
		this.initStatics();

		return app;
	}

	/**
	 * Default parsers and middlewares
	 */
	private initParsers()
	{
		// Force SSL
		app.enable( 'trust proxy' );
		this.initForceSSL();

		// Source manipulation
		app.use( compress( {} ) );
		app.use( logger( 'dev' ) );
		app.use( bodyParser.json() );
		app.use( bodyParser.urlencoded( { extended : false } ) );

		// Security
		app.disable( 'x-powered-by' );
		app.disable( 'etag' );
		app.use( helmet.noSniff() );
		app.use( helmet.frameguard() );
		app.use( helmet.xssFilter() );

		// Session and CSRF
		app.use( cookieParser() );
		app.use( session( app.sessionSettings ) );
		app.use( csrf( {} ) );
		app.use( ( req : any, res : any, next : any ) =>
		{
			res.locals.csrfToken = req.csrfToken();
			next();
		} );

	}

	/**
	 * Translator i18next
	 */
	private initTranslator()
	{
		// Read language files for namespaces
		var langNs = [ "translation" ];
		var files  = glob.sync( global.lang_path( "**/*.json" ) );

		files.forEach( ( file ) =>
		{
			var tmpFile = path.basename( file ).split( '.' );
			var tmpNs   = tmpFile[ 0 ] != 'new' ? tmpFile[ 0 ] : tmpFile[ 1 ];

			if ( langNs.indexOf( tmpNs ) === -1 )
				langNs.push( tmpNs );

		} );

		// i18next
		i18nxt
			.use( i18nxtFSB )
			.use( i18nxtSprintf )
			.init( {
				debug : process.env.APP_DEBUG,

				lng				: 'en',
				fallbackLng		: [ 'dev' ],

				ns				: langNs,
				defaultNS		: "translation",
				fallbackNS		: "translation",

				whitelist		: languages,
				preload			: languages,

				keySeparator	: ".",
				nsSeparator		: ":",

				saveMissing		: true,
				saveMissingTo	: "fallback",	// all, fallback, current

				// V2.x
				backend			:
				{
					loadPath	: global.lang_path( "/{{lng}}/{{ns}}.json" ),
					addPath		: global.lang_path( "/{{lng}}/new.{{ns}}.json" ),
					jsonIndent	: 2
				},
				ignoreRoutes 	:
				[
					'images/', 'public/', 'css/', 'js/', 'assets/', 'img/'
				],

				// right now there is only the integrated console logger available.
				/*functions		: {
				 log : require( 'debug' )( 'express-go:i18n' )
				 },*/
			} );


		app.i18n = i18nxt;

		// Use middleware to set current language
		// ?lang=xx_yy
		app.use( function ( req : any, res : any, next : any )
		{
			// Session lang init
			if ( !req.session.lang )
			{
				req.session.lang = app.i18n.language;
			}

			// URL ignoring
			var ignore = i18nxt.options.ignoreRoutes;
			for ( var i = 0, len = ignore.length; i < len; i++ )
			{
				if ( req.path.indexOf( ignore[ i ] ) > -1 )
				{
					return next();
				}
			}

			// Query land settings
			if ( req.query.lang != undefined && languages.indexOf( req.query.lang ) >= 0 )
			{
				req.session.lang = req.query.lang;

			}

			// Vars
			//req.locale = req.lng /*= req.language*/ = req.session.lang;
			res.locals.i18n = app.i18n;
			res.locals._t   = app.i18n.t;
			res.locals.__   = app.i18n.t;

			// Set lang if need
			if ( req.session.lang != app.i18n.language )
			{
				app.i18n.changeLanguage( req.session.lang, function ()
				{
					next();
				} );

			}
			else
			{
				next();
			}

		} );

	}


	/**
	 * Force SSL redirect from HTTP
	 */
	private initForceSSL()
	{
		//
		if ( process.env.FORCE_HTTPS.toLowerCase() == "true" || process.env.FORCE_HTTPS == true )
		{
			app.set( 'forceSSLOptions', {
				//enable301Redirects : true,
				//trustXFPHeader     : false,
				httpsPort : process.env.PORT_HTTPS,
				//sslRequiredMessage : 'SSL Required.'
			} );
			app.use( forceSSL );
		}
	}

	/**
	 * Static files serving
	 */
	private initStatics()
	{
		//
		if ( !!process.env.APP_UA && process.env.APP_UA.indexOf( "UA-" ) === 0 )
			app.use( nodalytics( process.env.APP_UA ) );

		// Favicon
		try
		{
			if ( fs.statSync( global.public_path( "favicon.ico" ) ) )
			{
				app.use( favicon( global.public_path( "favicon.ico" ) ) );
			}
		}
		catch ( e )
		{
		}

		// Static files
		if ( !process.env.CDN_ASSETS || process.env.CDN_ASSETS == '/' )
		{
			app.use( express.static(
				global.public_path(),
				{
					etag       : false,
					maxAge : '1y', //365 * 24 * 60 * 60,
					dotfiles : 'ignore',
					expires  : new Date( Date.now() + (365 * 24 * 60 * 60) ),
					setHeaders : function ( res, path )
					{
						if ( path.indexOf( "download" ) !== -1 )
						{
							res.attachment( path )
						}

						res.setHeader( 'Expires', new Date( Date.now() + 31536000 * 1000 ).toUTCString() );
					}
				}
			) );
		}

	}

}

module.exports = new ExpressGo( app );