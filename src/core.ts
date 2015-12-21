///<reference path='./typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>

import {ExpressGoGlobal} from "./typings/express-go";
declare var global : ExpressGoGlobal;

var glob  = require( "glob" );
var path  = require( "path" );
var debug = require( 'debug' )( 'express-go:core' );
var Boot  = require( "./boot/Boot" ).Boot;

var pathAndObjectList = [];
var getModulesPath = function( pathRoot, pathObject )
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
		//var moduleName = modulePath.replace( /\\\//g, "/" ).split( '/' ).pop().toLowerCase();
		var moduleName = path.basename( modulePath ).replace(/\.[^/.]+$/, "");
			moduleName = moduleName.substring( 0, 1 ).toUpperCase() + moduleName.substring( 1 ).toLowerCase();

		debug( "Found module name: %s", moduleName );

		// Override module path for src "root" dir
		modulePath = path.normalize( path.dirname( file ) + '/src/' );

		// Results
		filesList[ modulePath ] = pathObject[ moduleName ] = {};

	} );

	return filesList;
};

var pathAndObjectMerge = function( dest_array, src_array )
{
	for (var attr in src_array)
	{
		dest_array[attr] = src_array[attr];
	}
};

module.exports = function ( /*app : Express.Application,*/ appGlobal : any )
{
	debug( "core initalizing" );

	// Global vars
	global 			= appGlobal;
	global.App     	= {};
	global.Modules 	= {};

	// 1. Collecting application paths and modules
	// Here declaring and pairing the "namespace" objects too
	// [ "path" => Ns.Object ]
	pathAndObjectList[ path.normalize( global.app_path() ) ] = global.App;
	pathAndObjectMerge
	(
			pathAndObjectList,
			getModulesPath( global.app_modules( "**/module-go.json" ), global.Modules )
	);

	debug("Paths list collected");

	// 2. Registering / initializing components and files
	Boot.Init({
		"Configs"      : true,		// Pre-boot
		"Translations" : false,
		"Models"       : false,
		"Views"        : false,
		"Controllers"  : false,
		"Middlewares"  : false,
		"Routes"       : false,
		"Sockets"      : false,
	}, pathAndObjectList);

	// 3. creating express-go
	var mainApp = require( "./express" );

	// 4. Booting objects with app parameter
	Boot.Boot( mainApp );

	return mainApp;

};