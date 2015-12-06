///<reference path='../typings/tsd.d.ts'/>
import {LoaderInterface} from "../typings/express-go";
//import {routes_path} from "../typings/express-go";
declare function routes_path( innerPath? : string, getRelative? : boolean ) : string;

/**
 * Routes loader
 */
export module Loaders
{
	export class Routes implements LoaderInterface
	{
		private app;

		constructor()
		{
		}

		/**
		 * Trigger, when booting class file
		 */
		public boot( app : any ) : void
		{
			this.app          = app;
			this.app.resource = this.setResourceRoutes;
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
			return routes_path( "", true );
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
			return [ "Http", "Routes" ];
		}

		private setResourceRoutes = ( name, object ) =>
		{
			name       = object.name || name;
			name       = name.charAt( 0 ) == '/' ? name.slice( 1 ) : name;
			var prefix = object.prefix || '';
			var method;
			var path;

			for ( var key in object )
			{
				// "reserved" exports
				if ( ~[ 'name', 'prefix', 'engine' ].indexOf( key ) ) continue;

				// route exports
				switch ( key )
				{
					case 'index':
						method = 'get';
						path   = '/' + name + 's';
						break;

					case 'create':
						method = 'get';
						path   = '/' + name + '/create';
						break;

					case 'store':
						method = 'post';
						path   = '/' + name + 's';
						break;

					case 'show':
						method = 'get';
						path   = '/' + name + '/:' + name + '_id';
						break;

					case 'edit':
						method = 'get';
						path   = '/' + name + '/:' + name + '_id/edit';
						break;

					case 'update':
						method = 'put';
						path   = '/' + name + '/:' + name + '_id';
						break;

					case 'destroy':
						method = 'delete';
						path   = '/' + name + '/:' + name + '_id';
						break;
				}

				if ( method && path && object[ key ] )
				{
					path          = prefix + path;
					var routeName = name + '.' + key;

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
}
