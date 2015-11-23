///<reference path='./../typings/tsd.d.ts'/>
import general = require('./autoloader');

'use strict';

/**
 * Router handler
 *
 * http://stackoverflow.com/questions/6059246/how-to-include-route-handlers-in-multiple-files-in-express
 */


declare function routes_path( path? : string );
declare function middlewares_path( path? : string );

/**
 * Controller loader
 */
export module Core
{
    export module Loaders
    {
        export class Routes
        extends general.Core.Loaders.Autoloader
        //implements general.AutoloaderInterface
        {
            private orgApp : any;

            public init( app? : any )
            {
                this.orgApp = app;
                this.load();
            }

            private load()
            {
                this.orgApp.resource = this.setResourceRoutes;

                //this.loadPath( __dirname +  '/../middlewares',  ["Core", "Middlewares"], this.orgApp );
                this.loadPath( middlewares_path(),  ["Http", "Middlewares"], this.orgApp );
                this.loadPath( routes_path(),       ["Http", "Routes"],      this.orgApp );
            }

            private setResourceRoutes = ( name, object ) =>
            {
                name    = object.name   || name;
                name    = name.charAt(0) == '/' ? name.slice(1) : name;
                var prefix  = object.prefix || '';
                var method;
                var path;

                for (var key in object)
                {
                    // "reserved" exports
                    if (~['name', 'prefix', 'engine'].indexOf(key)) continue;

                    // route exports
                    switch ( key )
                    {
                        case 'index':
                            method = 'get';
                            path = '/' + name + 's';
                            break;

                        case 'create':
                            method = 'get';
                            path = '/' + name + '/create';
                            break;

                        case 'store':
                            method = 'post';
                            path = '/' + name + 's';
                            break;

                        case 'show':
                            method = 'get';
                            path = '/' + name + '/:' + name + '_id';
                            break;

                        case 'edit':
                            method = 'get';
                            path = '/' + name + '/:' + name + '_id/edit';
                            break;

                        case 'update':
                            method = 'put';
                            path = '/' + name + '/:' + name + '_id';
                            break;

                        case 'destroy':
                            method = 'delete';
                            path = '/' + name + '/:' + name + '_id';
                            break;
                    }

                    if ( method && path && object[key] )
                    {
                        path = prefix + path;
                        var routeName = name + '.' + key;

                        // Module prefixing
                        if ( this.isModule && routeName.substr(7) != "module." )
                            routeName = "module." + routeName;

                        // Middleware
                        if (object.before)
                            this.orgApp[method](path, routeName, object.before);

                        // Controller
                        this.orgApp[method](path, routeName, object[key]);
                    }
                }

            }

        }
    }
}
