///<reference path='../typings/tsd.d.ts'/>
/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Configs = (function () {
        /**
         * Constructor
         */
        function Configs() {
            /**
             * Register method
             *
             * @returns void
             */
            this.register = function () {
            };
            /**
             * Boot method
             *
             * @param app
             * @returns void
             */
            this.boot = function (app) {
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
            return 'config';
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
        return Configs;
    })();
    Loaders.Configs = Configs;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
