///<reference path='../../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>

import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

var fs	  = require( "fs" );
var glob  = require( "glob" );
var path  = require( "path" );

var debug = require( "debug" )( 'express-go:Boot.FileManager' );


/**
 * Boot namespace
 */
export namespace Boot
{

	/**
	 * File helper class for Finder
	 */
	export class FileManager
	{

		/**
		 * Finding script & typescript files
		 *
		 * @test BootFileManagerTest
		 */
		public findFiles = ( basePath : string, normalizeSkip? : boolean, keepExtension? : boolean ) =>
		{
			var filePath;
			var globIndex;
			var globList;
			var globPath = this.fileNormalizePath(
				basePath + '/**/*(*.js|*.ts)',
				normalizeSkip
			);

			debug("Finding files: %s", globPath);

			globList = this.searchFiles( globPath );

			for ( globIndex in globList )
			{
				filePath = globList[ globIndex ];

				//if ( normalizeSkip )
				//{
				//	filePath = this.fileRealize( filePath, basePath );
				//}

				if ( !keepExtension )
				{
					filePath = this.fileExtensionRemove( filePath );
				}

				globList[ globIndex ] = filePath;
			}

			return globList;
		};


		/**
		 * Finding modules
		 *
		 * @test BootFileManagerTest
		 */
		public findModules = ( basePath : string ) =>
		{
			var moduleList = [];
			var moduleName;
			var modulePath;

			var globIndex;
			var globList;
			var globPath = this.fileNormalizePath(
				basePath + '/**/module-go.json'
			);

			debug("Finding modules: %s", globPath);


			globList = this.searchFiles( globPath );

			for ( globIndex in globList )
			{
				modulePath = globList[ globIndex ];
				modulePath = path.dirname( modulePath );

				moduleName = path.basename( modulePath ).replace(/\.[^/.]+$/, "");
				moduleName = moduleName.substring( 0, 1 ).toUpperCase()
						   + moduleName.substring( 1 ).toLowerCase();

				moduleList[ moduleName ] = modulePath;
			}

			return moduleList;
		};


		/**
		 * Searching files with Glob
		 *
		 * @test BootFileManagerTest
		 *
		 * @param globPath
		 * @returns {Array}
		 */
		public searchFiles( globPath : string ) : any
		{
			var fileList = [];

			glob.sync( globPath ).forEach( ( filePath ) =>
			{
				fileList.push( filePath );
			});

			return fileList;
		}


		/**
		 * Normalizing file path
		 *
		 * @test BootFileManagerTest
		 *
		 * @param filePath
		 * @param normalizeSkip
		 * @returns {string}
		 */
		public fileNormalizePath( filePath : string, normalizeSkip? : boolean ) : string
		{
			return !normalizeSkip
				? path.normalize( filePath )
				: __dirname + filePath
			;
		}


		/**
		 * Realizing file path
		 *
		 * @test BootFileManagerTest
		 *
		 * @param filePath
		 * @param basePath
		 * @returns {string}
		 */
		public fileRealize( filePath : string, basePath : string ) : string
		{
			var indexBase = filePath.indexOf( basePath );

			if ( indexBase > -1 )
			{
				filePath = filePath.substr( indexBase + basePath.length );
			}

			return filePath;
		}


		/**
		 * Clear file extension
		 *
		 * @test BootFileManagerTest
		 *
		 * @param filePath
		 * @returns {string}
		 */
		public fileExtensionRemove( filePath : string ) : string
		{
			// Remove file extension
			return filePath.replace(/\.[^/.]+$/, "");
		}


		/**
		 * Detect file | path is exist (src, config, etc...)
		 *
		 * @test BootFileManagerTest
		 *
		 * @param pathString
		 * @returns {boolean}
		 */
		public fileExist( pathString : string ) : boolean
		{
			try
			{
				return !!fs.statSync(pathString);
			}
			catch (err)
			{
				return false;
			}
		}

	}

}