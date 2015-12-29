///<reference path="../../typings/tsd.d.ts"/>
///<reference path="Boot.ts"/>

import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

let Files : any = require( "./FileManager" ).Boot;

let debug : any = require( "debug" )( "express-go:Boot.Finder  " );


/**
 * Boot namespace
 */
export namespace Boot
{
	export class Finder
	{
		private _fileManager : any;


		private _pathApplicationProviders	: any;
		private _pathApplicationConfig		: any;
		private _pathApplicationFiles		: any;
		private _pathCoreProviders			: any;
		private _pathCoreCommands			: any;



		constructor()
		{
			this._fileManager = new Files.FileManager();

			if ( process.env.NODE_ENV !== "test" )
			{
				this._pathApplicationConfig		= global.config_path();
				this._pathApplicationFiles 		= global.app_path();
				this._pathApplicationProviders 	= global.bootstrap_path("Loaders");
				this._pathCoreProviders 		= "./../Loaders/";
				this._pathCoreCommands			= "./../Commands/";
			}

		}

		/**
		 * Finding Core Providers
		 *
		 * @param coreProviders
		 */
		public findCoreProviders() : any
		{
			return this._fileManager.findFiles( this._pathCoreProviders, true );
		}

		/**
		 * Finding Core Commands
		 *
		 * @param coreProviders
		 */
		public findCoreCommands() : any
		{
			return this._fileManager.findFiles( this._pathCoreCommands, true );
		}

		/**
		 * Finding Project Providers
		 *
		 * @returns {Array}
		 */
		public findApplicationProviders() : any
		{
			return this._fileManager.findFiles( this._pathApplicationProviders );
		}

		public findApplicationFiles() : any
		{
			return this._fileManager.findFiles( this._pathApplicationFiles, false, false );
		}

		public findApplicationConfigFiles() : any
		{
			return this._fileManager.findFiles( this._pathApplicationConfig, false, false );
		}

		public findModules() : any
		{
			return this._fileManager.findModules(
				global.app_modules()
			);
		}

		public findVendorModules() : any
		{
			return this._fileManager.findModules(
				global.npm_path()
			);
		}

		public findModuleFiles( modulePath : string ) : any
		{
			return this._fileManager.findFiles( modulePath );

		}

		public findModulesFiles() : any
		{
			let listModules = this.findModules();
			let pathList = [];

			for ( let pathIndex in listModules )
			{
				if ( listModules.hasOwnProperty( pathIndex ) )
				{
					pathList[ pathIndex ] = this.findModuleFiles( listModules[ pathIndex ] );
				}
			}

			return pathList;

		}

	}

}
