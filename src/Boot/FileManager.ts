///<reference path="../../typings/tsd.d.ts"/>
///<reference path="Boot.ts"/>

import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

let fs	  : any = require( "fs" );
let glob  : any = require( "glob" );
let path  : any = require( "path" );

let debug : any = require( "debug" )( "express-go:Boot.FileManager" );


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
		public findFiles = ( basePath : string, normalizeSkip? : boolean, keepExtension? : boolean ) : any =>
		{
			let filePath : string;
			let globList : any;
			let globPath : string = this.fileNormalizePath(
				basePath + "/**/*(*.js|*.ts)",
				normalizeSkip
			);

			debug("Finding files: %s", globPath);

			globList = this.searchFiles( globPath );

			for ( let globIndex in globList )
			{
				if ( globList.hasOwnProperty( globIndex ) )
				{
					filePath = globList[ globIndex ];

					if ( !keepExtension )
					{
						filePath = this.fileExtensionRemove( filePath );
					}

					globList[ globIndex ] = filePath;
				}
			}

			return globList;
		};


		/**
		 * Finding modules
		 *
		 * @test BootFileManagerTest
		 */
		public findModules = ( basePath : string ) : any =>
		{
			let moduleList : any = [];
			let moduleName : string;
			let modulePath : string;

			let globList : any;
			let globPath : string = this.fileNormalizePath(
				basePath + "/**/module-go.json"
			);

			debug("Finding modules: %s", globPath);


			globList = this.searchFiles( globPath );

			for ( let globIndex in globList )
			{
				if ( globList.hasOwnProperty( globIndex ) )
				{
					modulePath = globList[ globIndex ];
					modulePath = path.dirname( modulePath );

					moduleName = path.basename( modulePath ).replace(/\.[^/.]+$/, "");
					moduleName = moduleName.substring( 0, 1 ).toUpperCase()
						+ moduleName.substring( 1 ).toLowerCase();

					moduleList[ moduleName ] = modulePath;
				}
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
			let fileList : any = [];

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
			let indexBase : number = filePath.indexOf( basePath );

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

			} catch ( err )
			{
				return false;
			}
		}

	}

}
