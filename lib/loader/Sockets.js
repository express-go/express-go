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
            return global.sockets_path("", true);
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Sockets.prototype.getLoadPostfix = function () {
            return null;
            //return "Socket";
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Sockets.prototype.getLoadNamespace = function () {
            return ["Http", "Sockets"];
        };
        return Sockets;
    })();
    Loaders.Sockets = Sockets;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
