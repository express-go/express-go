///<reference path='../typings/tsd.d.ts'/>

import {ExpressGoGlobal,LoaderInterface} from "../typings/express-go";
declare var global : ExpressGoGlobal;

var fs   = require( 'fs' );
var path = require( 'path' );
var cons = require( 'consolidate' );

/**
 * Controller loader
 */
export module Loaders
{
	export class Views implements LoaderInterface
	{
		constructor()
		{
		}

		/**
		 * Trigger, when booting class file
		 */
		public boot( app : any ) : void
		{
			//.setDefaults({ cache : false });
			app.engine( process.env.VIEW_FILES, cons[ process.env.VIEW_ENGINE ] );
			app.set( 'view engine', process.env.VIEW_FILES );

			// Set paths
			this.setViewsPaths( app );
			this.setViewsCache( app );

			// Assets
			app.locals.assetPath = function ( text )
			{
				// read in our manifest file
				var manifest = JSON.parse(
					fs.readFileSync( global.public_path( 'assets/build/rev-manifest.json' ), 'utf8' )
				);

				return [ process.env.CDN_ASSETS + 'assets/build', manifest[ text ] ].join( '/' );
			};
		}

		/**
		 * Trigger, when loading class file
		 * Override here the "require"
		 *
		 * @param loadPath
		 */
		public load( loadPath? : string ) : any
		{
			// Disable loader
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
			//return ["Http", "Sockets"];
			return null;
		}

		private setViewsPaths( app )
		{
			// Get actual views path
			var tmpViews = app.get( 'views' );
			var tmpPaths = [];
			if ( Array.isArray( tmpViews ) )
			{
				tmpPaths = tmpViews;
				tmpPaths.push( global.views_path() );
			}
			else if ( typeof tmpViews === "string" )
			{
				tmpPaths.push( tmpViews );
			}
			else
			{
				tmpPaths = [];
				tmpPaths.push( global.views_path() );
			}

			if ( tmpPaths.indexOf( global.views_path() ) < 0 )
				tmpPaths.push( global.views_path() );

			// Update Views path
			app.set( 'views', tmpPaths );

		}

		private setViewsCache( app )
		{
			// Setup cache
			app.set(
				'view cache',
				!!process.env.VIEW_CACHE ? true : 'production' === app.get( 'env' )
			);

		}
	}
}
