///<reference path='../typings/tsd.d.ts'/>

import {ExpressGo} from "../typings/express-go";
declare var global : ExpressGo.Global;

var fs   = require( 'fs' );
var path = require( 'path' );
var glob = require( 'glob' );

var express = require( 'express' );

var bodyParser    : any = require( 'body-parser' );
var compress      : any = require( 'compression' );
var cookieParser  : any = require( 'cookie-parser' );
var csrf          : any = require( 'csurf' );
var favicon       : any = require( 'serve-favicon' );
var forceSSL      : any = require( 'express-force-ssl' );
var helmet        : any = require( 'helmet' );
var logger        : any = require( 'morgan' );
var nodalytics    : any = require( 'nodalytics' );
var session		  : any = require( 'express-session' );


var redis       = require( 'redis' );
var redisClient = redis.createClient();
var RedisStore  = require( "connect-redis" )( session );

var debug = require( 'debug' )( 'express-go:Express' );


debug( "Express object created" );
var app : any = express();


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


class ExpressGoCore
{
	constructor( app )
	{
		debug( "ExpressGo init app" );

		debug( "ExpressGo init initParsers" );
		this.initParsers();

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

module.exports = new ExpressGoCore( app );