///<reference path='./typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>

import {ExpressGoGlobal} from "./typings/express-go";
declare var global : ExpressGoGlobal;

var glob  = require( "glob" );
var path  = require( "path" );
var debug = require( 'debug' )( 'express-go:core' );
var Boot  = require( "./boot/Boot" ).Boot;


class Core
{
	/**
	 * Founded and registered paths list with target object in namespace
	 *
	 * Ex.: "../app" => global.App
	 *
	 * @type {Array}
	 */
	private pathAndObjectList = [];


	/**
	 * Initialization and booting
	 **/
	public init( appGlobal : any, userApp? : Express.Application ) : any
	{
		//
		debug( "core initalizing" );


		// Global vars
		global			= appGlobal;
		global.App		= {};
		global.Config	= {};
		global.Modules	= {};


		// 1. Collecting application paths and modules
		// Here declaring and pairing the "namespace" objects too
		// [ "path" => Ns.Object ]
		this.pathAndObjectList[ path.normalize( global.app_path() ) ] 	 = global.App;
		this.pathAndObjectList[ path.normalize( global.config_path() ) ] = global.Config;
		this.pathAndObjectMerge
		(
			this.pathAndObjectList,
			this.getModulesPath(
				global.app_modules( "**/module-go.json" ),
				global.Modules,
				global.Config
			)
		);
		debug( "Paths list collected" );


		// 2. Registering / initializing components and files
		Boot.Init( {
			"Configs"      : true,		// Pre-boot
			"Translations" : false,
			"Models"       : false,
			"Views"        : false,
			"Controllers"  : false,
			"Middlewares"  : false,
			"Routes"       : false,
			"Sockets"      : false,
		}, this.pathAndObjectList );


		// 3. creating express-go
		var mainApp = userApp ? userApp : require( "./express" );


		// 4. Booting objects with app parameter
		Boot.Boot( mainApp );


		return mainApp;
	}


	/**
	 * Pairing (modules) paths for pathAndObjectList helper
	 *
	 * @param dest_array
	 * @param src_array
	 */
	private pathAndObjectMerge = ( dest_array : any, src_array : any  ) =>
	{
		for ( var attr in src_array)
		{
			dest_array[ attr ] = src_array[ attr ];
		}
	};


	/**
	 * Modules finder helper
	 *
	 * @param pathRoot
	 * @param pathObject
	 * @returns {Array}
	 */
	private getModulesPath( pathRoot : string, pathObject : any, configObject : any )
	{
		debug( "Searching modules paths" );

		var filesList = [];
		var files = glob.sync( pathRoot );

		files.forEach( ( file ) =>
		{
			// Realpath
			var modulePath = path.normalize( path.dirname( file ) );
			debug( "Found module path: %s", modulePath );

			// Module name
			var moduleName = path.basename( modulePath ).replace(/\.[^/.]+$/, "");
			moduleName = moduleName.substring( 0, 1 ).toUpperCase() + moduleName.substring( 1 ).toLowerCase();

			debug( "Found module name: %s", moduleName );

			// Override module path for src "root" dir
			modulePath = path.normalize( path.dirname( file ) + '/src/' );

			// Results
			filesList[ modulePath ] = pathObject[ moduleName ] = {};

			// Override module path for src "config" dir
			modulePath = path.normalize( path.dirname( file ) + '/config/' );

			// Results
			filesList[ modulePath ] = configObject[ moduleName ] = {};

		} );

		return filesList;

	}

}

module.exports = function( appGlobal : any, userApp? : any )
{
	return new Core().init( appGlobal, userApp );
};