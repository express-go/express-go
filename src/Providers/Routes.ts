'use strict';

///<reference path="../../typings/tsd.d.ts"/>

import {ExpressGo, LoaderInterface} from "../../typings/express-go";
declare var global : ExpressGo.Global;

var Router : any = require( "named-routes" );
var router : any = new Router( {} );


/**
 * Routes Provider
 */
export class Provider implements LoaderInterface
{
	private app : any;

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
		return "router";
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
		return false;
	}

	/**
	 * Register method
	 *
	 * @param loadObject
	 * @param nameObject
	 * @returns any
	 */
	public register() : void
	{
		//
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
		return null;
	}

	/**
	 * Boot method
	 *
	 * @param app
	 * @returns void
	 */
	public boot( app : any ) : void
	{
		// Setup router
		router.extendExpress( app );
		router.registerAppHelpers( app );

		this.app          = app;
		this.app.resource = this.setResourceRoutes;

	}

	/**
	 * REST API style resource handler for controller
	 *
	 * @param name
	 * @param object
	 */
	public setResourceRoutes = ( name : string, object : any ) : void =>
	{
		name       = object.name || name;
		name       = name.charAt( 0 ) === "/" ? name.slice( 1 ) : name;
		let prefix = object.prefix || "";

		for ( let key in object )
		{
			let method;
			let path;

			// "reserved" exports
			if ( [ "name", "prefix", "engine" ].indexOf( key ) > -1 ) continue;

			// route exports
			switch ( key )
			{
				case "index":
					method = "get";
					path   = "/" + name + "s";
					break;

				case "create":
					method = "get";
					path   = "/" + name + "/create";
					break;

				case "store":
					method = "post";
					path   = "/" + name + "s";
					break;

				case "show":
					method = "get";
					path   = "/" + name + "/:" + name + "_id";
					break;

				case "edit":
					method = "get";
					path   = "/" + name + "/:" + name + "_id/edit";
					break;

				case "update":
					method = "put";
					path   = "/" + name + "/:" + name + "_id";
					break;

				case "destroy":
					method = "delete";
					path   = "/" + name + "/:" + name + "_id";
					break;

				default:
					break;
			}

			if ( method && path && object[ key ] )
			{
				path          = prefix + path;
				var routeName = name + "." + key;

				// Module prefixing
				//if ( this.isModule && routeName.substr(7) != "module." )
				//routeName = "module." + routeName;

				// Middleware
				if ( object.before )
					this.app[ method ]( path, routeName, object.before );

				// Controller
				this.app[ method ]( path, routeName, object[ key ] );
			}

		}

	}

}
