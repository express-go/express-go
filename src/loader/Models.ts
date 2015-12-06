///<reference path='../typings/tsd.d.ts'/>
import {LoaderInterface} from "../typings/express-go";
//import {models_path} from "../typings/express-go";
declare function models_path( innerPath? : string, getRelative? : boolean ) : string;


var fs   = require( 'fs' );
var path = require( 'path' );
var db   = {};

var Sequelize = require( 'sequelize' );

if ( !!process.env.DB_ENV )
	var sequelize = new Sequelize( process.env.DB_ENV );
else
	var sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
		"host"    : process.env.DB_HOST,
		"port"    : process.env.DB_PORT,
		"dialect" : process.env.DB_TYPE
	} );


/**
 * Model loader
 */
export module Loaders
{
	export class Models implements LoaderInterface
	{
		constructor()
		{
		}

		/**
		 * Trigger, when booting class file
		 */
		public boot( app : any ) : void
		{
			Object.keys( sequelize.models ).forEach( ( modelName ) =>
			{
				// Models associations
				if ( sequelize.models[ modelName ].associate )
				{
					sequelize.models[ modelName ].associate( sequelize.models );
				}
			} );

			app.sequelize = sequelize;
			app.Sequelize = Sequelize;
		}

		/**
		 * Trigger, when loading class file
		 * Override here the "require"
		 *
		 * @param loadPath
		 */
		public load( loadPath? : string ) : any
		{
			console.log( "LOADPATH", loadPath, models_path() );
			return sequelize.import( loadPath );
		}

		/**
		 * Locations root path
		 * Null is global in app and modules
		 *
		 * @returns {any}
		 */
		public getLoadPath() : string
		{
			return models_path( "", true );
		}

		/**
		 * Finding files by postfix
		 *
		 * @returns {string}
		 */
		public getLoadPostfix() : string
		{
			return null;
		}

		/**
		 * Setting files by namespace
		 *
		 * @returns {string[]}
		 */
		public getLoadNamespace() : any
		{
			return [ "Models" ];
		}

	}
}
