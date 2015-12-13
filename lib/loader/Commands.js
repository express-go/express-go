///<reference path='../typings/tsd.d.ts'/>
/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Commands = (function () {
        function Commands() {
        }
        /**
         * Trigger, when booting class file
         */
        Commands.prototype.boot = function (app) {
        };
        /**
         * Trigger, when loading class file
         * Override here the "require"
         *
         * @param loadPath
         */
        Commands.prototype.load = function (loadPath) {
        };
        /**
         * Locations root path
         * Null is global in app and modules
         *
         * @returns {any}
         */
        Commands.prototype.getLoadPath = function () {
            return null;
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Commands.prototype.getLoadPostfix = function () {
            return "Command";
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Commands.prototype.getLoadNamespace = function () {
            return null;
        };
        return Commands;
    })();
    Loaders.Commands = Commands;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
