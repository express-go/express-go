/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Controllers = (function () {
        function Controllers() {
        }
        /**
         * Trigger, when booting class file
         */
        Controllers.prototype.boot = function (app) {
        };
        /**
         * Trigger, when loading class file
         * Override here the "require"
         *
         * @param loadPath
         */
        Controllers.prototype.load = function (loadPath) {
        };
        /**
         * Locations root path
         * Null is global in app and modules
         *
         * @returns {any}
         */
        Controllers.prototype.getLoadPath = function () {
            //return controllers_path("", true);
            return null;
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Controllers.prototype.getLoadPostfix = function () {
            return "Controller";
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Controllers.prototype.getLoadNamespace = function () {
            //return ["Http", "Controllers"];
            return null;
        };
        return Controllers;
    })();
    Loaders.Controllers = Controllers;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
