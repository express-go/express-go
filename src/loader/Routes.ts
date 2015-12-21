///<reference path='../typings/tsd.d.ts'/>

import {ExpressGoGlobal,LoaderInterface} from "../typings/express-go";
declare var global : ExpressGoGlobal;

/**
 * Routes loader
 */
export module Loaders
{
	export class Routes implements LoaderInterface
	{
		private app;

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
			return 'router';
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
		public register = ( loadObject : any, nameObject : string ) : any =>
		{
			return false;
		};

		/**
		 * Boot method
		 *
		 * @param app
		 * @returns void
		 */
		public boot = ( app : any ) : void =>
		{
			this.app          = app;
			this.app.resource = this.setResourceRoutes;
		};

		/**
		 * REST API style resource handler for controller
		 *
		 * @param name
		 * @param object
		 */
		public setResourceRoutes = ( name, object ) =>
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
