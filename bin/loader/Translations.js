var fs = require('fs');
var glob = require("glob");
var redis = require('redis').createClient();
// TODO
var languageRedisCache = 'LANGUAGE_CACHE_REDIS';
/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Translations = (function () {
        function Translations() {
        }
        /**
         * Trigger, when booting class file
         */
        Translations.prototype.boot = function (app) {
            // Translations
            app.locals.i18n = app.i18n;
            app.locals._t = app.i18n.t;
            app.locals.__ = app.i18n.t;
            this.app = app;
        };
        /**
         * Trigger, when loading class file
         * Override here the "require"
         *
         * @param loadPath
         */
        Translations.prototype.load = function (loadPath) {
            // Loading translation files
            try {
                if (fs.statSync(lang_path())) {
                    var files = glob.sync(lang_path("**/*.json"));
                    files.forEach(function (file) {
                        var partials = file.split('.');
                        this.app.i18n.add(file, partials[partials.length - 2]);
                    });
                }
            }
            catch (ex) { }
            return false;
        };
        /**
         * Locations root path
         * Null is global in app and modules
         *
         * @returns {any}
         */
        Translations.prototype.getLoadPath = function () {
            //return controllers_path();
            return null;
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Translations.prototype.getLoadPostfix = function () {
            return "Controller";
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Translations.prototype.getLoadNamespace = function () {
            //return ["Http", "Controllers"];
            return null;
        };
        return Translations;
    })();
    Loaders.Translations = Translations;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
