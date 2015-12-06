/**
 * Middlewares loader
 */
var Loaders;
(function (Loaders) {
    var Middlewares = (function () {
        function Middlewares() {
        }
        /**
         * Trigger, when booting class file
         */
        Middlewares.prototype.boot = function (app) {
        };
        /**
         * Trigger, when loading class file
         * Override here the "require"
         *
         * @param loadPath
         */
        Middlewares.prototype.load = function (loadPath) {
        };
        /**
         * Locations root path
         * Null is global in app and modules
         *
         * @returns {any}
         */
        Middlewares.prototype.getLoadPath = function () {
            return null;
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Middlewares.prototype.getLoadPostfix = function () {
            return "Middleware";
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Middlewares.prototype.getLoadNamespace = function () {
            return null;
        };
        return Middlewares;
    })();
    Loaders.Middlewares = Middlewares;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
