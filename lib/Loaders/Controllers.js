///<reference path='../typings/tsd.d.ts'/>
/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Controllers = (function () {
        /**
         * Constructor
         */
        function Controllers() {
            /**
             * Register method
             *
             * @param loadObject
             * @param nameObject
             * @returns any
             */
            this.register = function () {
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
            this.loader = function (loadObject, nameObject) {
                return null;
            };
            /**
             * Boot method
             *
             * @param app
             * @returns void
             */
            this.boot = function (app) {
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
        Controllers.prototype.exportName = function () {
            return 'controller';
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
        return Controllers;
    })();
    Loaders.Controllers = Controllers;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
