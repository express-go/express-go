///<reference path='../../typings/tsd.d.ts'/>

import {ExpressGo,LoaderInterface} from "../../typings/express-go";
declare var global : ExpressGo.Global;

/**
 * Commands loader
 */
export module Loaders
{
	export class Commands implements LoaderInterface
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
		public exportName = () : string =>
		{
			return 'command';
		};

		/**
		 * Load object into global namespace
		 *
		 * Use "false" for disable
		 *
		 * @returns {boolean}
		 */
		public exportNamespace = () : boolean =>
		{
			return true;
		};

		/**
		 * Register method
		 *
		 * @returns void
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
		public boot = ( app : any ) : void =>
		{
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
			return null;
		};

	}
}
