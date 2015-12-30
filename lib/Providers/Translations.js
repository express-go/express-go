'use strict';
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var redis = require("redis").createClient();
var i18nxt = require("i18next");
var i18nxtFSB = require("i18next-node-fs-backend");
var i18nxtSprintf = require("i18next-sprintf-postprocessor");
// TODO
var languageRedisCache = "LANGUAGE_CACHE_REDIS";
var languages = [
    "dev",
    "hu",
    "en"
];
/**
 * Translations Provider
 */
var Provider = (function () {
    /**
     * Constructor
     */
    function Provider() {
        //
    }
    /**
     * Prefix used name for components
     * Ex.: module.exports.prefix = {};
     *
     * Use "null" for disable
     *
     * @returns {string}
     */
    Provider.prototype.exportName = function () {
        return null;
    };
    /**
     * Load object into global namespace
     *
     * Use "false" for disable
     *
     * @returns {boolean}
     */
    Provider.prototype.exportNamespace = function () {
        return false;
    };
    /**
     * Register method
     *
     * @returns void
     */
    Provider.prototype.register = function () {
        //
    };
    /**
     * Boot method
     *
     * @param app
     * @returns void
     */
    Provider.prototype.boot = function (app) {
        //
        this.initTranslator(app);
        this.loadTranslations(app);
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
    Provider.prototype.loader = function (loadObject, nameObject) {
        return null;
    };
    /**
     * Setup translator for express
     */
    Provider.prototype.initTranslator = function (app) {
        // Read language files for namespaces
        var langNs = ["translation"];
        var files = glob.sync(global.lang_path("**/*.json"));
        files.forEach(function (file) {
            var tmpFile = path.basename(file).split(".");
            var tmpNs = tmpFile[0] !== "new" ? tmpFile[0] : tmpFile[1];
            if (langNs.indexOf(tmpNs) === -1)
                langNs.push(tmpNs);
        });
        // i18next
        i18nxt
            .use(i18nxtFSB)
            .use(i18nxtSprintf)
            .init({
            debug: false,
            lng: "en",
            fallbackLng: ["dev"],
            ns: langNs,
            defaultNS: "translation",
            fallbackNS: "translation",
            whitelist: languages,
            preload: languages,
            keySeparator: ".",
            nsSeparator: ":",
            saveMissing: true,
            saveMissingTo: "fallback",
            // V2.x
            backend: {
                loadPath: global.lang_path("/{{lng}}/{{ns}}.json"),
                addPath: global.lang_path("/{{lng}}/new.{{ns}}.json"),
                jsonIndent: 2
            },
            ignoreRoutes: [
                "images/", "public/", "css/", "js/", "assets/", "img/"
            ]
        });
        // Global vars
        app.i18n = i18nxt;
        app.locals.i18n = app.i18n;
        app.locals._t = app.i18n.t;
        app.locals.__ = app.i18n.t;
        // Use middleware to set current language
        // ?lang=xx_yy
        app.use(function (req, res, next) {
            // Session lang init
            if (!req.session.lang) {
                req.session.lang = app.i18n.language;
            }
            // URL ignoring
            var ignore = i18nxt.options.ignoreRoutes;
            for (var i = 0, len = ignore.length; i < len; i++) {
                if (req.path.indexOf(ignore[i]) > -1) {
                    return next();
                }
            }
            // Query land settings
            if (req.query.lang !== undefined && languages.indexOf(req.query.lang) >= 0) {
                req.session.lang = req.query.lang;
            }
            // Vars
            //req.locale = req.lng /*= req.language*/ = req.session.lang;
            res.locals.i18n = app.i18n;
            res.locals._t = app.i18n.t;
            res.locals.__ = app.i18n.t;
            // Set lang if need
            if (req.session.lang !== app.i18n.language) {
                app.i18n.changeLanguage(req.session.lang, function () {
                    next();
                });
            }
            else {
                next();
            }
        });
    };
    /**
     * Loading json files
     */
    Provider.prototype.loadTranslations = function (app) {
        // Loading translation files
        try {
            if (fs.statSync(global.lang_path())) {
                var files = glob.sync(global.lang_path("**/*.json"));
                files.forEach(function (file) {
                    var partials = file.split(".");
                    app.i18n.add(file, partials[partials.length - 2]);
                });
            }
        }
        catch (err) {
        }
    };
    return Provider;
})();
exports.Provider = Provider;
