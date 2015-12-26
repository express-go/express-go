///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>

import {ExpressGo} from "../typings/express-go";
declare var global : ExpressGo.Global;

var debug = require( "debug" )( 'express-go:Boot.Finder  ' );

var Files = require( "./FileManager" ).Boot;

/**
 * Boot namespace
 */
export namespace Boot
{
	export class Finder
	{
		private _fileManager;


		private _pathApplicationProviders;
		private _pathApplicationConfig;
		private _pathApplicationFiles;
		private _pathCoreProviders;



		constructor()
		{
			this._fileManager = new Files.FileManager();

			if ( process.env.NODE_ENV !== "test" )
			{
				this._pathApplicationConfig		= global.config_path();
				this._pathApplicationFiles 		= global.app_path();
				this._pathApplicationProviders 	= global.bootstrap_path("Loaders");
				this._pathCoreProviders 		= './../Loaders/';
			}

		}

		/**
		 * Finding Core Providers
		 *
		 * @param coreProviders
		 */
		public findCoreProviders()
		{
			return this._fileManager.findFiles( this._pathCoreProviders, true );
		}

		/**
		 * Finding Project Providers
		 *
		 * @returns {Array}
		 */
		public findApplicationProviders()
		{
			return this._fileManager.findFiles( this._pathApplicationProviders );
		}

		public findApplicationFiles()
		{
			return this._fileManager.findFiles( this._pathApplicationFiles, false, false );
		}

		public findApplicationConfigFiles()
		{
			return this._fileManager.findFiles( this._pathApplicationConfig, false, false );
		}

		public findModules()
		{
			return this._fileManager.findModules();

		}

		public findModuleFiles( modulePath : string )
		{
			return this._fileManager.findFiles( modulePath );

		}

		public findModulesFiles()
		{
			var listModules = this.findModules();
			var pathIndex;
			var pathList = [];

			for ( pathIndex in listModules )
			{
				pathList[ pathIndex ] = this.findModuleFiles( listModules[ pathIndex ] );
			}

			return pathList;

		}

	}

}