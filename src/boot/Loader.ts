///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>


declare function app_path( path? : string );

var fs    = require( "fs" );
var glob  = require( "glob" );
var path  = require( "path" );
var debug = require( 'debug' )( 'express-go:Boot.Loader' );

export namespace Boot
{
	export class Loader
	{
		/**
		 * Components list
		 *
		 * @type {{Configs: null, Translations: null, Models: null, Views: null, Controllers: null, Sockets: null, Middlewares: null, Routes: null}}
		 * @private
		 */
		private _components =
		{
			//"Configs"		: null,
			"Translations"	: null,
			"Models"       	: null,
			"Views"        	: null,
			"Controllers"  	: null,
			"Sockets"      	: null,
			"Middlewares"  	: null,
			"Routes"       	: null
		};


		private app 		: any;
		private global 		: any;
		private modulePath 	: string;

		/**
		 * Constructor
		 * Start boot and load
		 *
		 * @param app
		 * @param appGlobal
		 * @param modulePath
		 */
		constructor( app, appGlobal, modulePath? : string )
		{
			debug( "Boot Loader init %s", modulePath || app_path() );

			this.app        = app;
			this.global     = appGlobal;
			this.modulePath = modulePath;

			this.bootComponents();
			this.loadComponents();

		}

		/**
		 * Booting each defined components
		 */
		private bootComponents()
		{
			for ( var key in this._components )
			{
				var val = {
					path     : __dirname + '/../loader/' + key,
					source   : null,
					instance : null,
					objects  : {}
				};

				val.source   = require( val.path ).Loaders[ key ];
				val.instance = new val.source();

				val.instance.boot( this.app );

				this._components[ key ] = val;

				debug( "Booted: %s", key );
			}
		}

		/**
		 * Loading booted components
		 */
		private loadComponents()
		{
			for ( var key in this._components )
			{
				debug( "Load %s", key );

				var val      = this._components[ key ];
				var loadPath = !!this.modulePath
					? this.modulePath + '/' + (!!val.instance.getLoadPath() ? val.instance.getLoadPath() : '')
					: app_path() + '/' + (!!val.instance.getLoadPath() ? val.instance.getLoadPath() : '');

				var files : any;

				debug( "Load path: %s", loadPath );

				try
				{
					if ( fs.statSync( loadPath ) )
					{
						var realPath = fs.realpathSync( loadPath );
						files        = this.readFilesByPostfix(
							realPath,
							val.instance.getLoadPostfix()
						);
					}

				}
				catch ( e )
				{
					files = [];
				}


				if ( files.length > 0 )
				{
					files.forEach( ( filePath ) =>
					{
						// Manual loader function
						var tempObjects  = {};
						var loadFunction = ( typeof val.instance.load === "function" )
							? val.instance.load( filePath )
							: null;

						// File path => namespace array
						filePath = path.normalize( filePath );
						var ns   = filePath.replace( path.normalize( loadPath ), "" );
						ns       = ns.replace( /\\\\|\\/g, '/' );

						debug( "File path: %s", ns );

						ns = ns.split( "/" );

						// Filename parameters
						var fileElem = ns[ ns.length - 1 ];
						var fileExt  = fileElem.substr( fileElem.lastIndexOf( '.' ) + 1 );
						var fileName = fileElem.substr( 0, fileElem.indexOf( '.' ) );

						// File path => Class name
						ns.pop();
						ns.push( fileName );

						// Loading objects
						if ( !!loadFunction )
						{
							this.arrayToObject( ns, tempObjects, loadFunction );

							debug( "Loaded by loadFunction" );
						}
						else if ( loadFunction !== false )
						{
							var tmpObject = require( filePath );
							tmpObject     = (typeof tmpObject === "function")
								? tmpObject( this.app )
								: tmpObject;

							this.arrayToObject( ns, tempObjects, tmpObject );

							debug( "Loaded by require" );
						}

						this.MergeRecursive( val.objects, tempObjects );
						this.MergeRecursive( this.global, val.objects )


					} );

					this._components[ key ] = val;
				}
			}

			debug( "Load ready!" );
		}

		/**
		 * Reading files by declared postfix
		 */
		private readFilesByPostfix( loadPath : string, filePostfix : string )
		{
			try
			{
				filePostfix  = typeof filePostfix !== "string" ? '' : filePostfix;
				var globPath = loadPath + "/**/*" + filePostfix + ".js";

				debug( "Load glob: %s", globPath );

				return glob.sync( globPath );

			}
			catch ( ex )
			{
			}

			return [];
		}

		private setNamespaces( object, namespaces, src )
		{

		}

		private readFilesByNamespace()
		{

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