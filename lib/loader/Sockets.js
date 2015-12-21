///<reference path='../typings/tsd.d.ts'/>
/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Sockets = (function () {
        /**
         * Constructor
         */
        function Sockets() {
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
        Sockets.prototype.exportName = function () {
            return 'socket';
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Sockets.prototype.exportNamespace = function () {
            return true;
        };
        return Sockets;
    })();
    Loaders.Sockets = Sockets;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
