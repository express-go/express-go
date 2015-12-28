///<reference path="../../typings/tsd.d.ts"/>
/**
 * Commands loader
 */
var Loaders;
(function (Loaders) {
    var Commands = (function () {
        /**
         * Constructor
         */
        function Commands() {
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
        Commands.prototype.exportName = function () {
            return "command";
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Commands.prototype.exportNamespace = function () {
            return true;
        };
        /**
         * Register method
         *
         * @returns void
         */
        Commands.prototype.register = function () {
            //
        };
        /**
         * Boot method
         *
         * @param app
         * @returns void
         */
        Commands.prototype.boot = function (app) {
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
        Commands.prototype.loader = function (loadObject, nameObject) {
            return null;
        };
        return Commands;
    })();
    Loaders.Commands = Commands;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
