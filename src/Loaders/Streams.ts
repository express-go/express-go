'use strict';

///<reference path="../../typings/tsd.d.ts"/>

import {ExpressGo, LoaderInterface} from "../../typings/express-go";
declare var global : ExpressGo.Global;

var socketStream	: any = require( "socket.io-stream" );
var socketIOSession : any = require( "socket.io.session" );
var socketSession 	: any = null;


/**
 * Streams loader
 */
export namespace Loaders
{
	export class Streams implements LoaderInterface
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
		 * Use: app.boot("Streams")
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
			return "stream";
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
			// Socket.io instance
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
			var socketChannel : any = this._io.of("/" + socketPrefix);
			socketChannel.use( socketSession.parser );

			// io conection
			socketChannel.on("connection", ( socket : any ) =>
			{
				// Use Socket.io with Stream
				loadObject( socketStream( socket ) );

			});

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

}
