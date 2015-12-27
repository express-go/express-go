///<reference path='../../typings/tsd.d.ts'/>
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
        Middlewares.prototype.exportName = function () {
            return 'middleware';
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
        return Middlewares;
    })();
    Loaders.Middlewares = Middlewares;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
