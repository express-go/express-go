var fs = require('fs');
var glob = require("glob");
var redis = require('redis').createClient();
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
            //console.log(app._t("ars"));
            //process.exit();
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
            //this.addMiddleware();
            /*
                        console.log(this.app.i18n.__("m_user_name_label"));
                        console.log( this.app.i18n.getDefaultLang() );
                        console.log( this.app.i18n.getCurrentLang() );
                        process.exit();
            */
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
        Translations.prototype.addMiddleware = function () {
            // Init
            if (this.app.get('env') == 'production') {
                redis.get(languageRedisCache, function (error, result) {
                    if (result == null) {
                        redis.set(languageRedisCache, JSON.stringify(this.app.i18n.getTranslation()), redis.print);
                    }
                    else {
                        this.app.i18n.setTranslation(result);
                    }
                });
            }
        };
        return Translations;
    })();
    Loaders.Translations = Translations;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
