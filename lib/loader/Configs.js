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
             * @param loadObject
             * @param nameObject
             * @returns any
             */
            this.register = function (loadObject, nameObject) {
                return false;
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
            return false;
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
