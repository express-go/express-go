///<reference path="../../typings/tsd.d.ts"/>
/**
 * Middlewares loader
 */
var Loaders;
(function (Loaders) {
    var Middlewares = (function () {
        /**
         * Constructor
         */
        function Middlewares() {
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
        Middlewares.prototype.exportName = function () {
            return "middleware";
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Middlewares.prototype.exportNamespace = function () {
            return true;
        };
        /**
         * Register method
         *
         * @param loadObject
         * @param nameObject
         * @returns any
         */
        Middlewares.prototype.register = function () {
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
        Middlewares.prototype.loader = function (loadObject, nameObject) {
            return null;
        };
        /**
         * Boot method
         *
         * @param app
         * @returns void
         */
        Middlewares.prototype.boot = function (app) {
            //
        };
        return Middlewares;
    })();
    Loaders.Middlewares = Middlewares;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
