///<reference path='../typings/tsd.d.ts'/>

import {ExpressGo,LoaderInterface} from "../typings/express-go";
declare var global : ExpressGo.Global;

var fs   = require( 'fs' );
var path = require( 'path' );
var cons = require( 'consolidate' );

/**
 * Views loader
 */
export module Loaders
{
	export class Views implements LoaderInterface
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
		 * @returns void
		 */
		public register = () : void =>
		{
		};

		/**
		 * Loader method
		 *
		 * You can override default object initialization method
		 *
		 * @param loadObject
		 * @param nameObject
		 * @returns {any}
		 */
		public loader = ( loadObject : any, nameObject : string ) : any =>
		{
			return null;
		};

		/**
		 * Boot method
		 *
		 * @param app
		 * @returns void
		 */
		public boot = ( app : any ) : any =>
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
		};

		/**
		 * Views path
		 *
		 * @param app
		 */
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

		/**
		 * Views cache
		 *
		 * @param app
		 */
		private setViewsCache( app )
		{
			process.env.VIEW_CACHE
					= process.env.VIEW_CACHE == "true"
					? true
					: 'production' === app.get( 'env' );

			// Setup cache
			app.set(
				'view cache',
				process.env.VIEW_CACHE
			);

			// TODO
			// Doesn't work
			if ( !process.env.VIEW_CACHE )
			{
				app.use( function ( req : any, res : any, next : any )
				{
					cons.clearCache();
					next();

				});
			}

		}
	}
}
