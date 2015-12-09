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
		private app : any;

		constructor()
		{
		}

		/**
		 * Trigger, when booting class file
		 */
		public boot( app : any ) : void
		{
			// Translations
			app.locals.i18n = app.i18n;
			app.locals._t   = app.i18n.t;
			app.locals.__   = app.i18n.t;

			this.app = app;
		}

		/**
		 * Trigger, when loading class file
		 * Override here the "require"
		 *
		 * @param loadPath
		 */
		public load( loadPath? : string ) : any
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
						this.app.i18n.add( file, partials[ partials.length - 2 ] );
					} );
				}
			}
			catch ( ex )
			{
			}

			return false;
		}

		/**
		 * Locations root path
		 * Null is global in app and modules
		 *
		 * @returns {any}
		 */
		public getLoadPath() : string
		{
			return null;
		}

		/**
		 * Finding files by postfix
		 *
		 * @returns {string}
		 */
		public getLoadPostfix() : string
		{
			return null;
		}

		/**
		 * Setting files by namespace
		 *
		 * @returns {string[]}
		 */
		public getLoadNamespace() : any
		{
			return null;
		}

	}
}
