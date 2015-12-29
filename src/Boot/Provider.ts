///<reference path="../../typings/tsd.d.ts"/>
///<reference path="Boot.ts"/>

import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

let debug : any = require( "debug" )( "express-go:Boot.Provider " );


/**
 * Boot namespace
 */
export namespace Boot
{
	export class Provider
	{
		private _providers	: any = [];
		private _exports	: any = [];

		/**
		 * Constructor
		 *
		 * @test BootProviderTest
		 */
		constructor()
		{
			//
		}


		/**
		 * Booting providers
		 *
		 * @param app
		 */
		public bootProviders( app : any )
		{
			debug("Booting Providers");

			for ( let indexProvider in this._providers )
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

			let bootObject	: any;
			let actProvider	: any;
			let actObject	: any;
			let actCache	: any;

			this._providers[ indexProvider ].instance.boot( app );

			for ( let indexObject in this._providers[ indexProvider ].objects )
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
							debug("Loading Provider default mode");
							if ( typeof actObject === "function" )
								actObject = actObject( app );

						} else
						{
							debug("Loading Provider manual mode");
							actObject = bootObject;

						}
					}

				} else
				{
					debug("[Loading default mode]");
					if ( actCache )
					{
						if ( typeof actObject === "function" )
							actObject = actObject( app );
					}
				}

				// Else keep original object
				actProvider.objects[ indexObject ] = actObject;
				
			}

		}

		public providerByName( providerName : string ) : any
		{
			if ( this._providers.hasOwnProperty( providerName ) )
			{
				return this._providers[ providerName ];
			}
		}

		/**
		 * Parse Provider name from path
		 *
		 * @test BootProviderTest
		 *
		 * @param providerPath
		 * @returns {*}
		 */
		public parseNameFromPath = ( providerPath : string ) : string =>
		{
			let fileName : string = providerPath
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
			{
				providerName = this.parseNameFromPath( providerPath );
			}

			let providerSource 	: any = require( providerPath );
			let providerObject 	: any = typeof providerSource["loader"] !== "undefined"
					? providerSource["loader"]
					: providerSource.Loaders[ providerName ]
				;

			if ( !providerObject )
			{
				throw new Error("Provider object problem: " + providerPath);
			}

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

			let val : any =
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
			{
				this._providers[ providerName ] = this._exports[ val.exportName ] = val;

			} else
			{
				this._providers[ providerName ] = val;

			}

		};


		/**
		 * Ordering providers by name list
		 *
		 * @param orderProviders
		 */
		public orderProviders( orderProviders : any)
		{
			let valueProvider	: any;
			let tmpProviders	: any = [];
			let actProviders	: any = this._providers;

			// Sorting by order
			for ( let indexProvider in orderProviders )
			{
				valueProvider = orderProviders[ indexProvider ];
				tmpProviders[ valueProvider ] = actProviders[ valueProvider ];

				delete actProviders[ valueProvider ];
			}

			// Adding the rest
			for ( let indexProvider in actProviders )
			{
				if ( valueProvider = actProviders[ indexProvider ] )
					tmpProviders[ indexProvider ] = valueProvider;

				delete actProviders[ valueProvider ];
			}

			// Setting new list
			this._providers = tmpProviders;
		}


		/**
		 * Associate file with provider export prefix
		 *
		 * @param filePath
		 */
		public associateProvider( filePath : any )
		{
			let fileObject : any = require( filePath );

			this.associateProviderObject( fileObject, filePath )

		}


		public associateProviderObject( fileObject : any, filePath : string  )
		{
			for ( let indexExport in fileObject )
			{
				if ( indexExport in this._exports )
				{
					debug("Associated file [%s]: %s", indexExport, filePath);

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
		 * @test BootProviderTest
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
