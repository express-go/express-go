///<reference path="../../typings/tsd.d.ts"/>

import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

let debug  		: any = require("debug")("express-go:Boot");

let Finder 		: any = require("./Finder").Boot.Finder;
let Provider	: any = require("./Provider").Boot.Provider;
let Namespace	: any = require("./Namespace").Boot.Namespace;

let loadFinder : any;
let loadProvider : any;
let loadNamespace : any;
let sortProvider  : any =
[
	"Configs",
	"Translations",
	"Models",
	"Views",
	"Controllers",
	"Middlewares",
	"Routes",
	"Sockets",
];
let loadUnknownFiles : boolean = true;

/**
 * Boot namespace
 */
export namespace Boot
{
	/**
	 * Initialization class
	 */
	export class Init
	{
		/**
		 * Loading components, objects
		 *
		 * @param appGlobal
		 * @param pathsList
		 */
		constructor( appGlobal : any, pathsList? : any )
		{
			debug( "Initializing Boot" );

			loadFinder    = new Finder();
			loadProvider  = new Provider();
			loadNamespace = new Namespace();

			global = appGlobal;

			global.App     = {};
			global.Modules = {};
			global.Config  = {};


			this.initProviders( sortProvider );
			this.initApplication();
			this.initModules();

			let mainApp : any = require( "../express" );

			this.boot( mainApp );

			mainApp.boot = function ( nameProvider : string, userApp? : any )
			{
				debug("Booting Manual Provider");

				loadProvider.bootProvider(
					nameProvider,
					userApp ? userApp : mainApp
				);
			};

			return mainApp;

		}

		private initProviders( orderList : any )
		{
			debug( "Initializing Providers" );

			let pathsProviders	: any = [].concat
			(
				loadFinder.findCoreProviders(),
				loadFinder.findApplicationProviders()
			);

			for ( let indexProvider in pathsProviders )
			{
				if ( pathsProviders.hasOwnProperty( indexProvider ) )
				{
					loadProvider.initProvider( pathsProviders[ indexProvider ] );
				}
			}

			loadProvider.orderProviders( orderList );

		}

		private initApplication()
		{
			debug( "Initializing Application" );

			let appFiles	: any;
			let appPath		: string;
			let fileSource	: any;
			let fileObject	: any;
			let providerObject	: any;
			let needNamespace	: boolean;

			global.App.config = {};

			// Config files
			appFiles          = loadFinder.findApplicationConfigFiles();

			for ( let appIndex in appFiles )
			{
				if ( appFiles.hasOwnProperty( appIndex ) )
				{
					appPath			= appFiles[ appIndex ];
					fileSource		= require( appPath );
					needNamespace	= loadUnknownFiles;
					providerObject	= loadProvider.associateProviderObject( fileSource, appPath );

					if ( providerObject )
					{
						needNamespace = providerObject.provider.exportNamespace;
						fileSource    = providerObject.fileObject;
					}

					fileObject = loadNamespace.pathToObject
					(
						appPath,
						global.config_path(),
						fileSource
					);

					global.App.config = loadNamespace.addToNamespace( global.App.config, fileObject );
				}
			}

			// Application files
			appFiles = loadFinder.findApplicationFiles();
			for ( let appIndex in appFiles )
			{
				if ( appFiles.hasOwnProperty( appIndex ) )
				{
					appPath		  = appFiles[ appIndex ];
					fileSource	  = require( appPath );
					needNamespace = loadUnknownFiles;

					if ( providerObject = loadProvider.associateProviderObject( fileSource, appPath ) )
					{
						needNamespace = providerObject.provider.exportNamespace;
						fileSource    = providerObject.fileObject;
					}

					// Object in Provider, but non namespace
					if ( needNamespace )
					{
						fileObject = loadNamespace.pathToObject
						(
							appPath,
							global.app_path(),
							fileSource
						);

						global.App = loadNamespace.addToNamespace( global.App, fileObject );
					}
				}
			}


			//loadProvider.associateProviders(
			//	loadFinder.findApplicationFiles()
			//);

		}

		private initModules()
		{
			debug( "Initializing Modules" );

			let listModules : any = loadFinder.findModules();
			let appFiles	: any;
			let appIndex	: any;
			let appPath		: any;
			let fileSource	: any;
			let fileObject	: any;
			let providerObject	: any;
			let needNamespace	: any;

			for ( let indexModules in listModules )
			{
				if ( listModules.hasOwnProperty( indexModules ) )
				{
					appFiles                       = loadFinder.findModuleFiles( listModules[ indexModules ] );
					global.Modules[ indexModules ] = {};

					for ( appIndex in appFiles )
					{
						if ( listModules.hasOwnProperty( indexModules ) )
						{
							appPath       = appFiles[ appIndex ];
							fileSource    = require( appPath );
							needNamespace = loadUnknownFiles;

							if ( providerObject = loadProvider.associateProviderObject( fileSource, appPath ) )
							{
								needNamespace = providerObject.provider.exportNamespace;
								fileSource    = providerObject.fileObject;
							}

							if ( needNamespace )
							{
								fileObject = loadNamespace.pathToObject
								(
									appPath,
									listModules[ indexModules ],
									fileSource
								);

								global.Modules[ indexModules ] = loadNamespace.addToNamespace(
									global.Modules[ indexModules ],
									fileObject
								);
							}

						}

					}

				}

			}

		}

		private boot( app : any )
		{
			loadProvider.bootProviders( app );
		}

	}

}
