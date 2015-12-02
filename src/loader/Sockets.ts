///<reference path='../typings/tsd.d.ts'/>
import {LoaderInterface} from "../typings/express-go";


/**
 * Controller loader
 */
export module Loaders
{
	export class Sockets implements LoaderInterface
	{
		constructor()
		{
		}

		/**
		 * Trigger, when booting class file
		 */
		public boot( app : any ) : void
		{
		}

		/**
		 * Trigger, when loading class file
		 * Override here the "require"
		 *
		 * @param loadPath
		 */
		public load( loadPath? : string ) : any
		{
		}

		/**
		 * Locations root path
		 * Null is global in app and modules
		 *
		 * @returns {any}
		 */
		public getLoadPath() : string
		{
			//return controllers_path();
			return null;
		}

		/**
		 * Finding files by postfix
		 *
		 * @returns {string}
		 */
		public getLoadPostfix() : string
		{
			return "Socket";
		}

		/**
		 * Setting files by namespace
		 *
		 * @returns {string[]}
		 */
		public getLoadNamespace() : any
		{
			//return ["Http", "Sockets"];
			return null;
		}

	}
}
