///<reference path='../typings/tsd.d.ts'/>
var Router = require('named-routes');
var router = new Router({});
/**
 * Routes loader
 */
var Loaders;
(function (Loaders) {
    var Routes = (function () {
        /**
         * Constructor
         */
        function Routes() {
            var _this = this;
            /**
             * Register method
             *
             * @param loadObject
             * @param nameObject
             * @returns any
             */
            this.register = function (loadObject, nameObject) {
                return false;
            };
            /**
             * Boot method
             *
             * @param app
             * @returns void
             */
            this.boot = function (app) {
                // Setup router
                router.extendExpress(app);
                router.registerAppHelpers(app);
                _this.app = app;
                _this.app.resource = _this.setResourceRoutes;
            };
            /**
             * REST API style resource handler for controller
             *
             * @param name
             * @param object
             */
            this.setResourceRoutes = function (name, object) {
                name = object.name || name;
                name = name.charAt(0) == '/' ? name.slice(1) : name;
                var prefix = object.prefix || '';
                var method;
                var path;
                for (var key in object) {
                    // "reserved" exports
                    if (~['name', 'prefix', 'engine'].indexOf(key))
                        continue;
                    // route exports
                    switch (key) {
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
                    if (method && path && object[key]) {
                        path = prefix + path;
                        var routeName = name + '.' + key;
                        // Module prefixing
                        //if ( this.isModule && routeName.substr(7) != "module." )
                        //routeName = "module." + routeName;
                        // Middleware
                        if (object.before)
                            _this.app[method](path, routeName, object.before);
                        // Controller
                        _this.app[method](path, routeName, object[key]);
                    }
                }
            };
        }
        /**
         * Prefix used name for components
         * Ex.: module.exports.prefix = {};
         *
         * Use "null" for disable
         *
         * @returns {string}
         */
        Routes.prototype.exportName = function () {
            return 'router';
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Routes.prototype.exportNamespace = function () {
            return false;
        };
        return Routes;
    })();
    Loaders.Routes = Routes;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
