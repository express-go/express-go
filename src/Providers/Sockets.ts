'use strict';

///<reference path="../../typings/tsd.d.ts"/>

import {ExpressGo, LoaderInterface} from "../../typings/express-go";
declare var global : ExpressGo.Global;

var socketIOSession : any = require( "socket.io.session" );
var socketSession : any   = null;


/**
 * Sockets Provider
 */
export class Provider implements LoaderInterface
{
	private _io : any;

	/**
	 * Constructor
	 */
	constructor()
	{
		//
	}

	/**
	 * Manual or automatic booting
	 * Default, if not defined: false [automatic]
	 *
	 * Use: app.boot("Sockets")
	 *
	 * @returns {boolean}
	 */
	public manualBoot() : boolean
	{
		return true;
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
		return "socket";
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
	 * @returns any
	 */
	public register() : void
	{
		//
	}

	/**
	 * Boot method
	 *
	 * @param app
	 * @returns void
	 */
	public boot( app : any ) : void
	{
		this._io = app.io;

		socketSession = socketIOSession( app.sessionSettings );
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
		// Socket channel
		let socketPrefix  : string = nameObject === "index" ? "" : nameObject;

		// Channel instance with session parser
		let socketChannel : any = this._io.of( "/" + socketPrefix );
		socketChannel.use( socketSession.parser );

		// io conection
		socketChannel.on( "connection", ( socket : any ) =>
		{
			// Use original method with Socket.io object
			loadObject( socket );

		} );

	}

	/**
	 * Disable saving loader object
	 *
	 * @returns {boolean}
	 */
	public loaderCache() : boolean
	{
		return false;
	}

}
