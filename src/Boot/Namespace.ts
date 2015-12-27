///<reference path='../../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>

import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

var debug = require( 'debug' )( 'express-go:Boot.Namespace' );

var path  = require( "path" );

/**
 * Boot namespace
 */
export namespace Boot
{
	/**
	 * Namespace handler class
	 */
	export class Namespace
	{
		/**
		 * Constructor
		 *
		 * @test BootNamespaceTest
		 */
		constructor()
		{
			debug( "Initializing Namespace" );
		}


		/**
		 * Converting path to array
		 *
		 * Ex.: "/foo/bar/FileName" => ["foo", "bar", "FileName"]
		 *
		 * @test BootNamespaceTest
		 *
		 * @param pathName
		 * @param pathBase
		 * @returns {string[]}
		 */
		public pathToArray( pathName : string, pathBase? : string ) : any
		{
			pathName = path.normalize( pathName );

			// Remove base path
			if ( pathBase )
			{
				pathBase = path.normalize( pathBase );
				pathName = pathName.replace( pathBase, '' );
			}

			// Loading file in to object
			var pathPartials = pathName.split( /[\\/]+/ ); 		// Split slashes
			pathPartials = pathPartials.filter( ( e ) =>
			{	// Remove empty items
				return !!e;
			} );

			return pathPartials;
		}


		/**
		 * Converting path array to object
		 * Use requireValue parameter for defined value, default "null"
		 *
		 * Ex.: ["foo", "bar", "FileName"] => foo.bar.FileName = null
		 *
		 * @test BootNamespaceTest
		 *
		 * @param pathArray
		 * @param requireValue
		 * @returns {{}}
		 */
		public pathArrayToObject( pathArray : any, requireValue? : any ) : any
		{
			var modelActual;
			var modelObject = {};
			var modelPrefix = pathArray[ 0 ];

			if ( modelPrefix == 'src' || modelPrefix == 'app' )
			{
				modelActual = modelObject;
				pathArray.shift();
			}
			else
			{
				modelActual = modelObject[ modelPrefix ] = {};
				pathArray.shift();
			}

			this._arrayToObject(
				pathArray,
				modelActual,
				requireValue ? requireValue : null
			);


			return modelObject;
		}


		/**
		 * Converting path to object
		 *
		 * @test BootNamespaceTest
		 *
		 * @param pathName
		 * @param pathBase
		 * @param requireValue
		 * @returns {any}
		 */
		public pathToObject( pathName : string, pathBase? : string, requireValue? : string ) : any
		{
			return this.pathArrayToObject
			(
				this.pathToArray( pathName, pathBase ),
				requireValue
			);
		}


		/**
		 * Adding object to namespace
		 * Alias of "_mergeObjectsRecursive"
		 *
		 * @test BootNamespaceTest
		 *
		 * @param namespaceObject
		 * @param newObject
		 * @returns {any}
		 */
		public addToNamespace( namespaceObject : any, newObject : any ) : any
		{
			debug( "Namespace object" );

			return this._mergeObjectsRecursive( namespaceObject, newObject );
		}


		/**
		 * Convert array to object deep helper
		 *
		 * @test BootNamespaceTest
		 *
		 * @param array
		 * @param object
		 * @param value
		 * @private
		 */
		private _arrayToObject( array : any, object : any, value : any ) : any
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

				this._arrayToObject( array, object[ key ], value );
			}
		}


		/**
		 * Merge objects recursive
		 *
		 * @test BootNamespaceTest
		 *
		 * @param targetObject
		 * @param sourceObject
		 * @returns {any}
		 * @constructor
		 */
		public  _mergeObjectsRecursive( targetObject : any, sourceObject : any ) : any
		{
			var keyObject;

			for ( keyObject in sourceObject )
			{
				try
				{
					// Property in destination object set; update its value.
					if ( sourceObject[ keyObject ].constructor == Object )
					{
						targetObject[ keyObject ] = this._mergeObjectsRecursive(
							targetObject[ keyObject ],
							sourceObject[ keyObject ]
						);

					}
					else
					{
						targetObject[ keyObject ] = sourceObject[ keyObject ];

					}

				}
				catch ( e )
				{
					// Property in destination object not set; create it and set its value.
					targetObject[ keyObject ] = sourceObject[ keyObject ];

				}
			}

			return targetObject;
		}

	}

}
