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
            var _this = this;
            /**
             * Register method
             *
             * @param app
             * @returns any
             */
            this.register = function (app) {
            };
            /**
             * Boot method
             *
             * @param app
             * @returns void
             */
            this.boot = function (appIo) {
                _this._io = appIo;
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
                var socketPrefix = nameObject == "index" ? "" : nameObject;
                // Use original method
                return loadObject(_this._io.of("/" + socketPrefix));
            };
        }
        /**
         * Manual or automatic booting
         * Default, if not defined: false [automatic]
         *
         * Use: app.boot("Sockets")
         *
         * @returns {boolean}
         */
        Sockets.prototype.manualBoot = function () {
            return true;
        };
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
        /**
         * Disable saving loader object
         * Disable because of multiple instance (http/https)
         *
         * @returns {boolean}
         */
        Sockets.prototype.loaderCache = function () {
            return false;
        };
        return Sockets;
    })();
    Loaders.Sockets = Sockets;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
