///<reference path='../typings/tsd.d.ts'/>
/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Configs = (function () {
        function Configs() {
        }
        /**
         * Trigger, when booting class file
         */
        Configs.prototype.boot = function (app) {
        };
        /**
         * Trigger, when loading class file
         * Override here the "require"
         *
         * @param loadPath
         */
        Configs.prototype.load = function (loadPath) {
        };
        /**
         * Locations root path
         * Null is global in app and modules
         *
         * @returns {any}
         */
        Configs.prototype.getLoadPath = function () {
            return global.config_path("", true);
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Configs.prototype.getLoadPostfix = function () {
            return null;
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Configs.prototype.getLoadNamespace = function () {
            return ["config"];
        };
        return Configs;
    })();
    Loaders.Configs = Configs;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
