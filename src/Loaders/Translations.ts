'use strict';

///<reference path="../../typings/tsd.d.ts"/>

import {ExpressGo, LoaderInterface} from "../../typings/express-go";
declare var global : ExpressGo.Global;
declare function t( path? : string );

let fs    : any = require( "fs" );
let glob  : any = require( "glob" );
let path  : any = require( "path" );
let redis : any = require( "redis" ).createClient();

let i18nxt        : any = require( "i18next" );
let i18nxtFSB     : any = require( "i18next-node-fs-backend" );
let i18nxtSprintf : any = require( "i18next-sprintf-postprocessor" );

// TODO
let languageRedisCache : string = "LANGUAGE_CACHE_REDIS";
let languages : any = [
	"dev",
	"hu",
	"en"
];


/**
 * Translations loader
 */
export namespace Loaders
{
	export class Translations implements LoaderInterface
	{
		/**
		 * Constructor
		 */
		constructor()
		{
			//
		}

		/**
		 * Prefix used name for components
		 * Ex.: module.exports.prefix = {};
		 *
		 * Use "null" for disable
		 *
		 * @returns {string}
		 */
		public exportName() : string
		{
			return null;
		}

		/**
		 * Load object into global namespace
		 *
		 * Use "false" for disable
		 *
		 * @returns {boolean}
		 */
		public exportNamespace() : boolean
		{
			return false;
		}

		/**
		 * Register method
		 *
		 * @returns void
		 */
		public register() : void
		{
			//
		}

		/**
		 * Boot method
		 *
		 * @param app
		 * @returns void
		 */
		public boot( app : any ) : void
		{
			//
			this.initTranslator  ( app );
			this.loadTranslations( app );
		}

		/**
		 * Loader method
		 *
		 * You can override default object initialization method
		 *
		 * @param loadObject
		 * @param nameObject
		 * @returns {any}
		 */
		public loader( loadObject : any, nameObject : string ) : any
		{
			return null;
		}

		/**
		 * Setup translator for express
		 */
		private initTranslator( app : any ) : void
		{
			// Read language files for namespaces
			let langNs : any = [ "translation" ];
			let files  : any = glob.sync( global.lang_path( "**/*.json" ) );

			files.forEach( ( file ) =>
			{
				let tmpFile	: string = path.basename( file ).split( "." );
				let tmpNs	: string = tmpFile[ 0 ] !== "new" ? tmpFile[ 0 ] : tmpFile[ 1 ];

				if ( langNs.indexOf( tmpNs ) === -1 )
					langNs.push( tmpNs );

			} );

			// i18next
			i18nxt
				.use( i18nxtFSB )
				.use( i18nxtSprintf )
				.init( {
					debug : false,//process.env.APP_DEBUG,

					lng				: "en",
					fallbackLng		: [ "dev" ],

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
							"images/", "public/", "css/", "js/", "assets/", "img/"
						],

					// right now there is only the integrated console logger available.
					/*functions		: {
					 	log : require( "debug" )( "express-go:i18n" )
					 },*/
				});

			// Global vars
			app.i18n 		= i18nxt;
			app.locals.i18n = app.i18n;
			app.locals._t   = app.i18n.t;
			app.locals.__   = app.i18n.t;

			// Use middleware to set current language
			// ?lang=xx_yy
			app.use( ( req : ExpressGo.Request, res : ExpressGo.Response, next : Function ) =>
			{
				// Session lang init
				if ( !req.session.lang )
				{
					req.session.lang = app.i18n.language;
				}

				// URL ignoring
				let ignore : any = i18nxt.options.ignoreRoutes;
				for ( let i : number = 0, len = ignore.length; i < len; i++ )
				{
					if ( req.path.indexOf( ignore[ i ] ) > -1 )
					{
						return next();
					}
				}

				// Query land settings
				if ( req.query.lang !== undefined && languages.indexOf( req.query.lang ) >= 0 )
				{
					req.session.lang = req.query.lang;

				}

				// Vars
				//req.locale = req.lng /*= req.language*/ = req.session.lang;
				res.locals.i18n = app.i18n;
				res.locals._t   = app.i18n.t;
				res.locals.__   = app.i18n.t;

				// Set lang if need
				if ( req.session.lang !== app.i18n.language )
				{
					app.i18n.changeLanguage( req.session.lang, function ()
					{
						next();
					} );

				} else
				{
					next();
				}

			});

		}

		/**
		 * Loading json files
		 */
		private loadTranslations( app : any ) : void
		{
			// Loading translation files
			try
			{
				if ( fs.statSync( global.lang_path() ) )
				{
					let files = glob.sync( global.lang_path( "**/*.json" ) );
					files.forEach( function ( file )
					{
						let partials = file.split( "." );
						app.i18n.add( file, partials[ partials.length - 2 ] );

					} );
				}

			} catch ( ex : any )
			{
				//
			}

		}

	}

}
