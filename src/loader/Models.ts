///<reference path='../typings/tsd.d.ts'/>

import {ExpressGoGlobal,LoaderInterface} from "../typings/express-go";
declare var global : ExpressGoGlobal;


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
		/**
		 * Constructor
		 */
		constructor()
		{
		}

		/**
		 * Prefix used name for components
		 * Ex.: module.exports.prefix = {};
		 *
		 * Use "null" for disable
		 *
		 * @returns {string}
		 */
		public exportName() : string
		{
			return 'model';
		}

		/**
		 * Load object into global namespace
		 *
		 * Use "false" for disable
		 *
		 * @returns {boolean}
		 */
		public exportNamespace() : boolean
		{
			return true;
		}

		/**
		 * Register method
		 *
		 * @param loadObject
		 * @param nameObject
		 * @returns any
		 */
		public register = ( loadObject : any, nameObject : string ) : any =>
		{
			return sequelize.import( nameObject, loadObject );
		};

		/**
		 * Boot method
		 *
		 * @param app
		 * @returns void
		 */
		public boot = ( app : any ) : void =>
		{
			Object.keys( sequelize.models ).forEach( ( modelName ) =>
			{
				// Models associations
				if ( sequelize.models[ modelName ].associate )
				{
					sequelize.models[ modelName ].associate( sequelize.models );
				}

			});

			app.sequelize = sequelize;
			app.Sequelize = Sequelize;
		};

	}
}
