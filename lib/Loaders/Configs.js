///<reference path="../../typings/tsd.d.ts"/>
/**
 * Configurations loader
 */
var Loaders;
(function (Loaders) {
    var Configs = (function () {
        /**
         * Constructor
         */
        function Configs() {
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
        Configs.prototype.exportName = function () {
            return "config";
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Configs.prototype.exportNamespace = function () {
            return true;
        };
        /**
         * Define namespace root in global object
         *
         * @returns {string}
         */
        Configs.prototype.defineNamespace = function () {
            return "Config";
        };
        /**
         * Register method
         *
         * @returns void
         */
        Configs.prototype.register = function () {
        };
        /**
         * Boot method
         *
         * @param app
         * @returns void
         */
        Configs.prototype.boot = function (app) {
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
        Configs.prototype.loader = function (loadObject, nameObject) {
            return null;
        };
        return Configs;
    })();
    Loaders.Configs = Configs;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
