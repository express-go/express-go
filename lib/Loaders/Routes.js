'use strict';
var Router = require("named-routes");
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
            //
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
            return "router";
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
        /**
         * Register method
         *
         * @param loadObject
         * @param nameObject
         * @returns any
         */
        Routes.prototype.register = function () {
            //
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
        Routes.prototype.loader = function (loadObject, nameObject) {
            return null;
        };
        /**
         * Boot method
         *
         * @param app
         * @returns void
         */
        Routes.prototype.boot = function (app) {
            // Setup router
            router.extendExpress(app);
            router.registerAppHelpers(app);
            this.app = app;
            this.app.resource = this.setResourceRoutes;
        };
        /**
         * REST API style resource handler for controller
         *
         * @param name
         * @param object
         */
        Routes.prototype.setResourceRoutes = function (name, object) {
            name = object.name || name;
            name = name.charAt(0) === "/" ? name.slice(1) : name;
            var prefix = object.prefix || "";
            var method;
            var path;
            var key;
            for (key in object) {
                // "reserved" exports
                if (["name", "prefix", "engine"].indexOf(key))
                    continue;
                // route exports
                switch (key) {
                    case "index":
                        method = "get";
                        path = "/" + name + "s";
                        break;
                    case "create":
                        method = "get";
                        path = "/" + name + "/create";
                        break;
                    case "store":
                        method = "post";
                        path = "/" + name + "s";
                        break;
                    case "show":
                        method = "get";
                        path = "/" + name + "/:" + name + "_id";
                        break;
                    case "edit":
                        method = "get";
                        path = "/" + name + "/:" + name + "_id/edit";
                        break;
                    case "update":
                        method = "put";
                        path = "/" + name + "/:" + name + "_id";
                        break;
                    case "destroy":
                        method = "delete";
                        path = "/" + name + "/:" + name + "_id";
                        break;
                    default:
                        break;
                }
                if (method && path && object[key]) {
                    path = prefix + path;
                    var routeName = name + "." + key;
                    // Module prefixing
                    //if ( this.isModule && routeName.substr(7) != "module." )
                    //routeName = "module." + routeName;
                    // Middleware
                    if (object.before)
                        this.app[method](path, routeName, object.before);
                    // Controller
                    this.app[method](path, routeName, object[key]);
                }
            }
        };
        return Routes;
    })();
    Loaders.Routes = Routes;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
