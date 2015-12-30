'use strict';
var Router = require("named-routes");
var router = new Router({});
/**
 * Routes Provider
 */
var Provider = (function () {
    /**
     * Constructor
     */
    function Provider() {
        var _this = this;
        /**
         * REST API style resource handler for controller
         *
         * @param name
         * @param object
         */
        this.setResourceRoutes = function (name, object) {
            name = object.name || name;
            name = name.charAt(0) === "/" ? name.slice(1) : name;
            var prefix = object.prefix || "";
            for (var key in object) {
                var method = void 0;
                var path = void 0;
                // "reserved" exports
                if (["name", "prefix", "engine"].indexOf(key) > -1)
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
                        _this.app[method](path, routeName, object.before);
                    // Controller
                    _this.app[method](path, routeName, object[key]);
                }
            }
        };
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
    Provider.prototype.exportName = function () {
        return "router";
    };
    /**
     * Load object into global namespace
     *
     * Use "false" for disable
     *
     * @returns {boolean}
     */
    Provider.prototype.exportNamespace = function () {
        return false;
    };
    /**
     * Register method
     *
     * @param loadObject
     * @param nameObject
     * @returns any
     */
    Provider.prototype.register = function () {
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
    Provider.prototype.loader = function (loadObject, nameObject) {
        return null;
    };
    /**
     * Boot method
     *
     * @param app
     * @returns void
     */
    Provider.prototype.boot = function (app) {
        // Setup router
        router.extendExpress(app);
        router.registerAppHelpers(app);
        this.app = app;
        this.app.resource = this.setResourceRoutes;
    };
    return Provider;
})();
exports.Provider = Provider;
