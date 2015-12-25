///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>

import {ExpressGoGlobal} from "../typings/express-go";
declare var global : ExpressGoGlobal;

var glob  = require( "glob" );
var path  = require( "path" );
var debug = require( "debug" )( 'express-go:Boot.Provider' );


export namespace Boot
{
	export class Provider
	{
		private _providers 	= [];
		private _exports	= [];

		constructor()
		{

		}


		public bootProviders( app : any )
		{
			debug("Booting Providers");

			var indexProvider;

			for ( indexProvider in this._providers )
			{
				// Manual boot
				if ( !this._providers[ indexProvider ].manualBoot )
				{
					this.bootProvider( indexProvider, app );
				}

			}
		}

		public bootProvider( indexProvider : string, app : any )
		{
			debug( "Booting Provider: %s", indexProvider );

			var indexObject;
			var bootObject;
			var actProvider;
			var actObject;
			var actCache;

			this._providers[ indexProvider ].instance.boot( app );

			for ( indexObject in this._providers[ indexProvider ].objects )
			{
				debug("Loading Provider object: %s", indexObject);

				actProvider = this._providers[ indexProvider ];
				actObject	= actProvider.objects[ indexObject ];


				actCache = !(
					typeof actProvider.instance.loaderCache === "function" &&
					actProvider.instance.loaderCache() === false
				);

				if ( typeof actProvider.instance.loader === "function" )
				{
					bootObject = actProvider.instance.loader
					(
						actObject,
						this.parseNameFromPath( indexObject )
					);

					if ( actCache )
					{
						if ( bootObject === null )
						{
							debug("[Loading default mode]");
							if ( typeof actObject === "function" )
								actObject = actObject( app );

						}
						else
						{
							debug("[Loading loader mode]");
							actObject = bootObject;

						}
					}

				}
				else
				{
					debug("[Loading default mode]");
					if ( actCache )
					{
						if ( typeof actObject === "function" )
							actObject = actObject( app );
					}
				}


				//console.log( typeof actProvider.instance.loader );
				//process.exit();

				if ( false)
				{
					// Default method
					if ( typeof actProvider.instance.loader === "undefined" || !actProvider.instance.loader )
					{
						debug("[Loading default mode]");
						actObject = actObject( app );
					}

					// Declared method
					else if ( actProvider.instance.loader && typeof actProvider.instance.loader === "function" )
					{
						bootObject = actProvider.instance.loader
						(
							actObject,
							this.parseNameFromPath( indexObject )
						);

						debug("[Loading loader mode]");
						debug( typeof bootObject );
						actObject = bootObject;

						/*if ( typeof bootObject === "object" )
						 {
						 debug("[Loading loader mode]");
						 actObject = bootObject;
						 }
						 else if ( typeof actObject === "function" )
						 {
						 debug("[Loading default mode]");
						 actObject = actObject( app );
						 }
						 else
						 {
						 debug("[Loading keep mode]");
						 }*/
					}
				}
				// Else keep original object
				actProvider.objects[ indexObject ] = actObject;
			}

		}

		/**
		 * Initialized Providers list
		 *
		 * @returns {Array}
		 */
		public getProviders()
		{
			return this._providers;
		}


		/**
		 * Initialized Providers list modify
		 *
		 * @returns {Array}
		 */
		public setProviders( providers : any )
		{
			this._providers = providers;
		}


		/**
		 * Return providers by exportName
		 *
		 * @returns {Array}
		 */
		public getExports()
		{
			return this._exports;
		}


		/**
		 * Parse Provider name from path
		 */
		public parseNameFromPath = ( providerPath : string ) : string =>
		{
			var fileName = providerPath
					.split( /[\\/]+/ )
					.pop()
					.replace(/\.[^/.]+$/, "")
				;

			return fileName;
		};


		/**
		 * Initializing Provider object by path
		 *
		 * @param providerPath
		 */
		public initProvider = ( providerPath : string, providerName? : string ) : void =>
		{
			if ( !providerName )
				providerName = this.parseNameFromPath( providerPath );

			var providerSource 	= require( providerPath );
			var providerObject 	= typeof providerSource['loader'] !== "undefined"
					? providerSource['loader']
					: providerSource.Loaders[ providerName ]
				;

			if ( !providerObject )
				throw new Error("Provider object problem: " + providerPath);

			this.initProviderObject( providerObject, providerName );
		};


		/**
		 * Initializing Provider object by required object
		 *
		 * @param providesObject
		 */
		public initProviderObject = ( providerObject : any, providerName : string ) : void =>
		{
			//
			debug( "Initializing Provider object: %s", providerName );

			var val =
				{
					source			: null,
					instance 		: null,
					booted			: false,
					bootedFiles		: false,
					loadedFiles		: false,

					manualBoot 		: false,
					exportName		: null,
					exportNamespace	: false,
					//defineNamespace : null,

					objects  		: {},
				};

			val.source			= providerObject;
			val.instance		= typeof val.source === "function" ? new val.source() : val.source;

			this.validateProviderObject( val.instance );

			val.manualBoot		= !!(typeof val.instance.manualBoot === "function" && val.instance.manualBoot() === true);
			val.exportName		= val.instance.exportName();
			val.exportNamespace	= val.instance.exportNamespace();
			//val.defineNamespace =


			// Call "register" in provider
			val.instance.register();
			debug( "Provider register called: %s", providerName );

			if ( val.exportName && typeof val.exportName === "string" )
				this._providers[ providerName ] = this._exports[ val.exportName ] = val;
			else
				this._providers[ providerName ] = val;

		};


		/**
		 * Ordering providers by name list
		 *
		 * @param orderProviders
		 */
		public orderProviders( orderProviders : any)
		{
			var indexProvider;
			var valueProvider;
			var tmpProviders = [];
			var actProviders = this._providers;

			// Sorting by order
			for ( indexProvider in orderProviders )
			{
				valueProvider = orderProviders[ indexProvider ];
				tmpProviders[ valueProvider ] = actProviders[ valueProvider ];

				delete actProviders[ valueProvider ];
			}

			// Adding the rest
			for ( indexProvider in actProviders )
			{
				if ( valueProvider = actProviders[ indexProvider ] )
					tmpProviders[ indexProvider ] = valueProvider;

				delete actProviders[ valueProvider ];
			}

			// Setting new list
			this._providers = tmpProviders;
		}


		/**
		 * Associate files for providers
		 *
		 * @param fileList
		 */
		public associateProviders( fileList : any )
		{
			var indexFile;
			var valueFile;

			for ( indexFile in fileList )
			{
				valueFile = fileList[ indexFile ];
				this.associateProvider( valueFile );
			}
		}


		/**
		 * Associate file with provider export prefix
		 *
		 * @param filePath
		 */
		public associateProvider( filePath : any )
		{
			var fileObject  = require( filePath );

			this.associateProviderObject( fileObject, filePath )

		}


		public associateProviderObject( fileObject : any, filePath : string  )
		{
			var indexExport;

			for ( indexExport in fileObject )
			{
				if ( indexExport in this._exports )
				{
					debug("Associated file [%s]: %s", indexExport, filePath);

					// Helyette van a loader a boot után
					/*var providerRegister
					 = typeof this._exports[ indexExport ].instance.register === "function"
					 ? this._exports[ indexExport ].instance.register
					 (
					 fileObject[ indexExport ],
					 this.parseNameFromPath( filePath )
					 )
					 : false;

					 providerRegister = !!providerRegister ? providerRegister : fileObject[ indexExport ];*/

					fileObject = this._exports[ indexExport ].objects[ filePath ] = fileObject[ indexExport ];

					return {
						provider 	: this._exports[ indexExport ],
						fileObject	: fileObject
					};
				}
			}

			debug("Unprovided file: %s", filePath);
			return null;
		}
		/**
		 * Validating necessary functions
		 *
		 * @param providerObject
		 * @returns {boolean}
		 */
		public validateProviderObject( providerObject : any )
		{
			if (
				typeof providerObject["boot"] === "undefined"
				||	typeof providerObject["register"] === "undefined"
				||	typeof providerObject["exportName"] === "undefined"
				||	typeof providerObject["exportNamespace"] === "undefined"
			)
				throw new Error("Provider validate problem: " + providerObject);

			return true;
		}

	}

}