'use strict';
/**
 * Controllers loader
 */
var Loaders;
(function (Loaders) {
    var Controllers = (function () {
        /**
         * Constructor
         */
        function Controllers() {
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
        Controllers.prototype.exportName = function () {
            return "controller";
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Controllers.prototype.exportNamespace = function () {
            return true;
        };
        /**
         * Register method
         *
         * @param loadObject
         * @param nameObject
         * @returns any
         */
        Controllers.prototype.register = function () {
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
        Controllers.prototype.loader = function (loadObject, nameObject) {
            return null;
        };
        /**
         * Boot method
         *
         * @param app
         * @returns void
         */
        Controllers.prototype.boot = function (app) {
            //
        };
        return Controllers;
    })();
    Loaders.Controllers = Controllers;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
