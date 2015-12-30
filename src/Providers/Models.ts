'use strict';

///<reference path="../../typings/tsd.d.ts"/>

import {ExpressGo, LoaderInterface} from "../../typings/express-go";
declare var global : ExpressGo.Global;

var Sequelize : any = require( "sequelize" );
var sequelize : any;


/**
 * Models Provider
 */
export class Provider implements LoaderInterface
{
	/**
	 * Constructor
	 */
	constructor()
	{
		//
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
		return "model";
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
	 * @param app
	 * @returns void
	 */
	public register() : void
	{
		// Initializing
		if ( !!process.env.DB_ENV )
		{
			sequelize = new Sequelize( process.env.DB_ENV );

		} else
		{
			sequelize = new Sequelize(
				process.env.DB_NAME,
				process.env.DB_USER,
				process.env.DB_PASS,
				{
					"host"    : process.env.DB_HOST,
					"port"    : process.env.DB_PORT,
					"dialect" : process.env.DB_TYPE,
				}
			);
		}

	}

	/**
	 * Loader method
	 *
	 * You can override default object initialization method
	 *
	 * @param loadObject
	 * @param nameObject
	 * @returns {any}
	 */
	public loader( loadObject : any, nameObject : string ) : any
	{
		// Use sequelize method
		return sequelize.import( nameObject, loadObject );
	}

	/**
	 * Boot method
	 *
	 * @param app
	 * @returns void
	 */
	public boot( app : any ) : void
	{
		// Loading relations
		Object.keys( sequelize.models ).forEach( ( modelName ) =>
		{
			// Models associations
			if ( sequelize.models[ modelName ].associate )
			{
				sequelize.models[ modelName ].associate( sequelize.models );
			}

		});

		// Add for app
		app.sequelize = sequelize;
		app.Sequelize = Sequelize;

	}

}
