///<reference path='../typings/tsd.d.ts'/>

import {ExpressGoGlobal,LoaderInterface} from "../typings/express-go";
declare var global : ExpressGoGlobal;


/**
 * Controller loader
 */
export module Loaders
{
	export class Sockets implements LoaderInterface
	{
		private _io : any;

		/**
		 * Constructor
		 */
		constructor()
		{
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
			return 'socket';
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
		public register = () : void =>
		{
		};

		/**
		 * Boot method
		 *
		 * @param app
		 * @returns void
		 */
		public boot = ( appIo : any ) : void =>
		{
			this._io = appIo;
		};

		/**
		 * Loader method
		 *
		 * You can override default object initialization method
		 *
		 * @param loadObject
		 * @param nameObject
		 * @returns {any}
		 */
		public loader = ( loadObject : any, nameObject : string ) : any =>
		{
			var socketPrefix = nameObject == "index" ? "" : nameObject;

			// Use original method
			return loadObject( this._io.of("/" + socketPrefix) );
		};


		/**
		 * Disable saving loader object
		 * Disable because of multiple instance (http/https)
		 *
		 * @returns {boolean}
		 */
		public loaderCache()
		{
			return false;
		}
	}
}
