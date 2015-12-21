///<reference path='../typings/tsd.d.ts'/>

import {ExpressGoGlobal,LoaderInterface} from "../typings/express-go";
declare var global : ExpressGoGlobal;
declare function t( path? : string );

var fs    = require( 'fs' );
var glob  = require( "glob" );
var redis = require( 'redis' ).createClient();

// TODO
var languageRedisCache = 'LANGUAGE_CACHE_REDIS';

/**
 * Controller loader
 */
export module Loaders
{
	export class Translations implements LoaderInterface
	{
		/**
		 * Constructor
		 */
		constructor()
		{
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
		 * @param loadObject
		 * @param nameObject
		 * @returns any
		 */
		public register = ( loadObject : any, nameObject : string ) : any =>
		{
			return false;
		};

		/**
		 * Boot method
		 *
		 * @param app
		 * @returns void
		 */
		public boot = ( app : any ) : void =>
		{
			app.locals.i18n = app.i18n;
			app.locals._t   = app.i18n.t;
			app.locals.__   = app.i18n.t;

			this.loadTranslations( app );
		};

		/**
		 * Loading json files
		 */
		private loadTranslations( app : any )
		{
			// Loading translation files
			try
			{
				if ( fs.statSync( global.lang_path() ) )
				{
					var files = glob.sync( global.lang_path( "**/*.json" ) );
					files.forEach( function ( file )
					{
						var partials = file.split( '.' );
						app.i18n.add( file, partials[ partials.length - 2 ] );

					} );
				}

			}
			catch ( ex )
			{
			}

		}

	}
}
