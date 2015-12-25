///<reference path='../typings/tsd.d.ts'/>

var path  = require('path');

var debug  = require('debug')('express-go:Boot.Namespace');


export module Boot
{
	/**
	 * Namespace handler class
	 */
	export class Namespace
	{

		constructor()
		{
			debug( "Initializing Namespace" );
		}

		public pathToArray( pathName : string, pathBase? : string ) : any
		{
			pathName = path.normalize( pathName );;

			// Remove base path
			if ( pathBase )
			{
				pathBase = path.normalize( pathBase );
				pathName = pathName.replace( pathBase, '' );
			}

			// Loading file in to object
			var pathPartials = pathName.split( /[\\/]+/ ); 		// Split slashes
				pathPartials = pathPartials.filter((e) => {	// Remove empty items
					return !!e;
				});

			return pathPartials;
		}

		public pathArrayToObject( pathArray : any, requireValue? : any ) : any
		{
			var modelActual;
			var modelObject = {};
			var modelPrefix = pathArray[0];

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

		private _arrayToObject( array, object, value )
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

		public pathToObject( pathName : string, pathBase? : string, requireValue? : string ) : any
		{
			return this.pathArrayToObject
			(
				this.pathToArray( pathName, pathBase ),
				requireValue
			);
		}

		public filesToNamespace( filesList : any, pathBase : string ) : any
		{
			var indexFiles;
			var valueObject = {};

			for ( indexFiles in filesList )
			{
				valueObject = this.MergeRecursive(
					valueObject,
					this.pathToObject( filesList[ indexFiles ], pathBase )
				);
			}

			return valueObject;

		}

		public addToNamespace( namespaceObject : any, newObject : any )
		{
			debug("Namespace object");

			return this.MergeRecursive( namespaceObject, newObject );
		}

		public  MergeRecursive( obj1, obj2 )
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
