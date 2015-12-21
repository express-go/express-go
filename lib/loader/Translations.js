///<reference path='../typings/tsd.d.ts'/>
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
        /**
         * Constructor
         */
        function Translations() {
            var _this = this;
            /**
             * Register method
             *
             * @param loadObject
             * @param nameObject
             * @returns any
             */
            this.register = function (loadObject, nameObject) {
                return false;
            };
            /**
             * Boot method
             *
             * @param app
             * @returns void
             */
            this.boot = function (app) {
                app.locals.i18n = app.i18n;
                app.locals._t = app.i18n.t;
                app.locals.__ = app.i18n.t;
                _this.loadTranslations(app);
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
        Translations.prototype.exportName = function () {
            return null;
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Translations.prototype.exportNamespace = function () {
            return false;
        };
        /**
         * Loading json files
         */
        Translations.prototype.loadTranslations = function (app) {
            // Loading translation files
            try {
                if (fs.statSync(global.lang_path())) {
                    var files = glob.sync(global.lang_path("**/*.json"));
                    files.forEach(function (file) {
                        var partials = file.split('.');
                        app.i18n.add(file, partials[partials.length - 2]);
                    });
                }
            }
            catch (ex) {
            }
        };
        return Translations;
    })();
    Loaders.Translations = Translations;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
