///<reference path='../typings/tsd.d.ts'/>
/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Sockets = (function () {
        function Sockets() {
        }
        /**
         * Trigger, when booting class file
         */
        Sockets.prototype.boot = function (app) {
        };
        /**
         * Trigger, when loading class file
         * Override here the "require"
         *
         * @param loadPath
         */
        Sockets.prototype.load = function (loadPath) {
        };
        /**
         * Locations root path
         * Null is global in app and modules
         *
         * @returns {any}
         */
        Sockets.prototype.getLoadPath = function () {
            //return controllers_path();
            return null;
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Sockets.prototype.getLoadPostfix = function () {
            return "Socket";
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Sockets.prototype.getLoadNamespace = function () {
            //return ["Http", "Sockets"];
            return null;
        };
        return Sockets;
    })();
    Loaders.Sockets = Sockets;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
