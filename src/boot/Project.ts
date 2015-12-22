///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>

import {ExpressGoGlobal} from "../typings/express-go";
declare var global : ExpressGoGlobal;

var glob  = require( "glob" );
var path  = require( "path" );
var debug = require( 'debug' )( 'express-go:Boot.Project' );

export namespace Boot.Project
{
	export class Load
	{
		private pathList : any;
		private loadBuilder : any;

		constructor( pathList : any, loadBuilder : any )
		{
			this.pathList = pathList;
			this.loadBuilder = loadBuilder;

			for( var key in pathList )
			{
				var val = pathList[ key ];
				this.loadFiles( key, val );
			}
		}


		/**
		 * Loading path list
		 *
		 * @returns {any}
		 */
		public getList()
		{
			return this.pathList;
		}


		/**
		 * Loading files into objects
		 */
		private loadFiles( basePath, baseObject )
		{
				basePath  = path.normalize( basePath );
			var globPath  = path.normalize( basePath + '/**/*.js' );

			debug("Loading files in directory: %s", globPath);

			glob.sync( globPath ).forEach( ( filePath ) =>
			{
				this.loadFile( filePath, basePath, baseObject );

			});

		}


		/**
		 * Loading Project file
		 *
		 * @param filePath
		 * @param basePath
		 * @param baseObject
		 */
		private loadFile( filePath, basePath, baseObject )
		{
			// Realpath
				filePath  = path.normalize( filePath );
			var fileName  = filePath.replace(/\.[^/.]+$/, "");
			var tmpObject = {};

			debug( "Loading file path: %s", filePath );

			// Loading file in to object
			var fileNamespace
						= fileName
					.replace( basePath , '' )	// Remove base path
					.split( /[\\/]+/ )			// Split slasher
					.filter(function(e){		// Remove empty items
						return e;
					});

			// Loading file source
			var fileSource = require( filePath );

			// Associating content to builder
			// Return object with need booting
			fileSource = this.loadBuilder.findObjectLoader
			(
				fileSource,
				fileNamespace[ fileNamespace.length-1 ]
			);

			// Converting array to object
			this.arrayToObject
			(
					fileNamespace,
					tmpObject,
					fileSource
			);

			// Merge tmp object to base object
			this.MergeRecursive
			(
					baseObject,
					tmpObject
			);
		}


		/**
		 * Make object from array, recursive mode
		 *
		 * @param array
		 * @param object
		 * @param value
		 */
		private arrayToObject( array, object, value )
		{
			if ( typeof object[ array[ 0 ] ] == "undefined" )
			{
				var key = array[ 0 ];
				array.shift();


				if ( array.length == 0 )
				{
					object[ key ] = value;
					return;
				}

				object[ key ] = {};

				this.arrayToObject( array, object[ key ], value );
			}
		}


		/**
		 * Recursively merge properties of two objects
		 *
		 * @param obj1
		 * @param obj2
		 * @returns {any}
		 * @constructor
		 */
		private  MergeRecursive( obj1, obj2 )
		{
			for ( var p in obj2 )
			{
				try
				{
					// Property in destination object set; update its value.
					if ( obj2[ p ].constructor == Object )
					{
						obj1[ p ] = this.MergeRecursive( obj1[ p ], obj2[ p ] );

					}
					else
					{
						obj1[ p ] = obj2[ p ];

					}

				}
				catch ( e )
				{
					// Property in destination object not set; create it and set its value.
					obj1[ p ] = obj2[ p ];

				}
			}

			return obj1;
		}

	}
}