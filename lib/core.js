///<reference path='./typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>
var glob = require("glob");
var path = require("path");
var debug = require('debug')('express-go:core');
var Boot = require("./boot/Boot").Boot;
var Core = (function () {
    function Core() {
        /**
         * Founded and registered paths list with target object in namespace
         *
         * Ex.: "../app" => global.App
         *
         * @type {Array}
         */
        this.pathAndObjectList = [];
        /**
         * Pairing (modules) paths for pathAndObjectList helper
         *
         * @param dest_array
         * @param src_array
         */
        this.pathAndObjectMerge = function (dest_array, src_array) {
            for (var attr in src_array) {
                dest_array[attr] = src_array[attr];
            }
        };
    }
    /**
     * Initialization and booting
     **/
    Core.prototype.init = function (appGlobal, userApp) {
        //
        debug("core initalizing");
        // Global vars
        global = appGlobal;
        global.App = {};
        global.Modules = {};
        // 1. Collecting application paths and modules
        // Here declaring and pairing the "namespace" objects too
        // [ "path" => Ns.Object ]
        this.pathAndObjectList[path.normalize(global.app_path())] = global.App;
        this.pathAndObjectMerge(this.pathAndObjectList, this.getModulesPath(global.app_modules("**/module-go.json"), global.Modules));
        debug("Paths list collected");
        // 2. Registering / initializing components and files
        Boot.Init({
            "Configs": true,
            "Translations": false,
            "Models": false,
            "Views": false,
            "Controllers": false,
            "Middlewares": false,
            "Routes": false,
            "Sockets": false
        }, this.pathAndObjectList);
        // 3. creating express-go
        var mainApp = userApp ? userApp : require("./express");
        // 4. Booting objects with app parameter
        Boot.Boot(mainApp);
        return mainApp;
    };
    /**
     * Modules finder helper
     *
     * @param pathRoot
     * @param pathObject
     * @returns {Array}
     */
    Core.prototype.getModulesPath = function (pathRoot, pathObject) {
        debug("Searching modules paths");
        var filesList = [];
        var files = glob.sync(pathRoot);
        files.forEach(function (file) {
            // Realpath
            var modulePath = path.normalize(path.dirname(file));
            debug("Found module path: %s", modulePath);
            // Module name
            var moduleName = path.basename(modulePath).replace(/\.[^/.]+$/, "");
            moduleName = moduleName.substring(0, 1).toUpperCase() + moduleName.substring(1).toLowerCase();
            debug("Found module name: %s", moduleName);
            // Override module path for src "root" dir
            modulePath = path.normalize(path.dirname(file) + '/src/');
            // Results
            filesList[modulePath] = pathObject[moduleName] = {};
        });
        return filesList;
    };
    return Core;
})();
module.exports = function (appGlobal, userApp) {
    return new Core().init(appGlobal, userApp);
};
