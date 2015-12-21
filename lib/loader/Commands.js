///<reference path='../typings/tsd.d.ts'/>
/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Commands = (function () {
        /**
         * Constructor
         */
        function Commands() {
            /**
             * Register method
             *
             * @param loadObject
             * @param nameObject
             * @returns any
             */
            this.register = function (loadObject, nameObject) {
                return loadObject;
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
        Commands.prototype.exportName = function () {
            return 'command';
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
        return Commands;
    })();
    Loaders.Commands = Commands;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
