///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>

import {ExpressGoGlobal} from "../typings/express-go";
declare var global : ExpressGoGlobal;

var fs	  = require( "fs" );
var glob  = require( "glob" );
var path  = require( "path" );
var debug = require( "debug" )( 'express-go:Boot.Finder  ' );

export namespace Boot
{
	export class Finder
	{
		private _fileManager : Boot.Files;


		private _pathApplicationProviders;
		private _pathApplicationConfig;
		private _pathApplicationFiles;
		private _pathCoreProviders;



		constructor()
		{
			this._fileManager = new Boot.Files();

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

	/**
	 * File helper class for Finder
	 */
	export class Files
	{

		/**
		 * Return files list from project
		 **/
		public findFiles = ( basePath : string, normalizeSkip? : boolean, keepExtension? : boolean ) =>
		{
			var globPath = basePath + '/**/*(*.js|*.ts)';
			var fileList = [];

			globPath = !normalizeSkip ? path.normalize( globPath ) : __dirname + globPath;

			debug("Finding files: %s", globPath);

			glob.sync( globPath ).forEach( ( filePath ) =>
			{
				// Remove file extension
				if ( !keepExtension )
					filePath = filePath.replace(/\.[^/.]+$/, "");

				if ( normalizeSkip )
				{
					var indexBase = filePath.indexOf( basePath );
					if ( indexBase >= 0 )
					{
						filePath = filePath.substr( indexBase );
					}
				}

				fileList.push( filePath );
			});

			return fileList;
		};

		// TODO
		// Legyen általános dis listázó
		// Legyen egy Modules class
		public findModules = ( vendorSearch? : boolean ) =>
		{
			var fileList = [];
			var globPath = vendorSearch
						 ? global.npm_path( "/**/module-go.json" )
						 : global.app_modules( "/**/module-go.json" );

			debug("Finding modules: %s", globPath);

			glob.sync( globPath ).forEach( ( modulePath ) =>
			{
					modulePath = path.dirname( modulePath );
				var moduleName = path.basename( modulePath ).replace(/\.[^/.]+$/, "");
					moduleName = moduleName.substring( 0, 1 ).toUpperCase()
							   + moduleName.substring( 1 ).toLowerCase();

				fileList[ moduleName ] = modulePath;
			});

			return fileList;
		};

		/**
		 * Detect path is exist (src, config, etc...)
		 *
		 * @param pathString
		 * @returns {any}
		 */
		private fileExist( pathString : string ) : string
		{
			try
			{
				fs.statSync(pathString);
				return pathString;
			}
			catch (err)
			{
				return null;
			}

		}

	}
}