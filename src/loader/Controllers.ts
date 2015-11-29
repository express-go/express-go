///<reference path='../typings/tsd.d.ts'/>
import {LoaderInterface} from "../typings/express-go";

declare function controllers_path( path? : string, asd? : boolean );

/**
 * Controller loader
 */
export module Loaders
{
	export class Controllers implements LoaderInterface
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
			//return controllers_path("", true);
			return null;
		}

		/**
		 * Finding files by postfix
		 *
		 * @returns {string}
		 */
		public getLoadPostfix() : string
		{
			return "Controller";
		}

		/**
		 * Setting files by namespace
		 *
		 * @returns {string[]}
		 */
		public getLoadNamespace() : any
		{
			//return ["Http", "Controllers"];
			return null;
		}

	}
}
