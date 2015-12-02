var express_go_1 = require("../typings/express-go");
/**
 * Routes loader
 */
var Loaders;
(function (Loaders) {
    var Routes = (function () {
        function Routes() {
            var _this = this;
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
         * Trigger, when booting class file
         */
        Routes.prototype.boot = function (app) {
            this.app = app;
            this.app.resource = this.setResourceRoutes;
        };
        /**
         * Trigger, when loading class file
         * Override here the "require"
         *
         * @param loadPath
         */
        Routes.prototype.load = function (loadPath) {
        };
        /**
         * Locations root path
         * Null is global in app and modules
         *
         * @returns {any}
         */
        Routes.prototype.getLoadPath = function () {
            return express_go_1.routes_path("", true);
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Routes.prototype.getLoadPostfix = function () {
            return null;
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Routes.prototype.getLoadNamespace = function () {
            return ["Http", "Routes"];
        };
        return Routes;
    })();
    Loaders.Routes = Routes;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
