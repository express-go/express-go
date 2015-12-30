'use strict';
var fs = require("fs");
var cons = require("consolidate");
/**
 * Views Provider
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
     * Boot method
     *
     * @param app
     * @returns void
     */
    Provider.prototype.boot = function (app) {
        //.setDefaults({ cache : false });
        app.engine(process.env.VIEW_FILES, cons[process.env.VIEW_ENGINE]);
        app.set("view engine", process.env.VIEW_FILES);
        // Set paths
        this.setViewsPaths(app);
        this.setViewsCache(app);
        // Assets
        app.locals.assetPath = function (text) {
            // read in our manifest file
            var manifest = JSON.parse(fs.readFileSync(global.public_path("assets/build/rev-manifest.json"), "utf8"));
            return [process.env.CDN_ASSETS + "assets/build", manifest[text]].join("/");
        };
    };
    /**
     * Views path
     *
     * @param app
     */
    Provider.prototype.setViewsPaths = function (app) {
        // Get actual views path
        var tmpViews = app.get("views");
        var tmpPaths = [];
        if (Array.isArray(tmpViews)) {
            tmpPaths = tmpViews;
            tmpPaths.push(global.views_path());
        }
        else if (typeof tmpViews === "string") {
            tmpPaths.push(tmpViews);
        }
        else {
            tmpPaths = [];
            tmpPaths.push(global.views_path());
        }
        if (tmpPaths.indexOf(global.views_path()) < 0) {
            tmpPaths.push(global.views_path());
        }
        // Update Views path
        app.set("views", tmpPaths);
    };
    /**
     * Views cache
     *
     * @param app
     */
    Provider.prototype.setViewsCache = function (app) {
        process.env.VIEW_CACHE
            = process.env.VIEW_CACHE === "true" || process.env.VIEW_CACHE === true
                ? true
                : "production" === app.get("env");
        // Setup cache
        app.set("view cache", process.env.VIEW_CACHE);
        // TODO
        // Doesn"t work
        if (!process.env.VIEW_CACHE) {
            app.use(function (req, res, next) {
                cons.clearCache();
                next();
            });
        }
    };
    return Provider;
})();
exports.Provider = Provider;
