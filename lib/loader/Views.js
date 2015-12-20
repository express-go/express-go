///<reference path='../typings/tsd.d.ts'/>
var fs = require('fs');
var path = require('path');
var cons = require('consolidate');
/**
 * Controller loader
 */
var Loaders;
(function (Loaders) {
    var Views = (function () {
        function Views() {
        }
        /**
         * Trigger, when booting class file
         */
        Views.prototype.boot = function (app) {
            //.setDefaults({ cache : false });
            app.engine(process.env.VIEW_FILES, cons[process.env.VIEW_ENGINE]);
            app.set('view engine', process.env.VIEW_FILES);
            // Set paths
            this.setViewsPaths(app);
            this.setViewsCache(app);
            // Assets
            app.locals.assetPath = function (text) {
                // read in our manifest file
                var manifest = JSON.parse(fs.readFileSync(global.public_path('assets/build/rev-manifest.json'), 'utf8'));
                return [process.env.CDN_ASSETS + 'assets/build', manifest[text]].join('/');
            };
        };
        /**
         * Trigger, when loading class file
         * Override here the "require"
         *
         * @param loadPath
         */
        Views.prototype.load = function (loadPath) {
            // Disable loader
            return false;
        };
        /**
         * Locations root path
         * Null is global in app and modules
         *
         * @returns {any}
         */
        Views.prototype.getLoadPath = function () {
            return null;
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Views.prototype.getLoadPostfix = function () {
            return null;
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Views.prototype.getLoadNamespace = function () {
            //return ["Http", "Sockets"];
            return null;
        };
        Views.prototype.setViewsPaths = function (app) {
            // Get actual views path
            var tmpViews = app.get('views');
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
            if (tmpPaths.indexOf(global.views_path()) < 0)
                tmpPaths.push(global.views_path());
            // Update Views path
            app.set('views', tmpPaths);
        };
        Views.prototype.setViewsCache = function (app) {
            process.env.VIEW_CACHE
                = process.env.VIEW_CACHE == "true"
                    ? true
                    : 'production' === app.get('env');
            // Setup cache
            app.set('view cache', process.env.VIEW_CACHE);
            // TODO
            // Doesn't work
            if (!process.env.VIEW_CACHE) {
                app.use(function (req, res, next) {
                    cons.clearCache();
                    next();
                });
            }
        };
        return Views;
    })();
    Loaders.Views = Views;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
