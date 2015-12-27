///<reference path='../../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var Files = require("./FileManager").Boot;
var debug = require("debug")('express-go:Boot.Finder  ');
/**
 * Boot namespace
 */
var Boot;
(function (Boot) {
    var Finder = (function () {
        function Finder() {
            this._fileManager = new Files.FileManager();
            if (process.env.NODE_ENV !== "test") {
                this._pathApplicationConfig = global.config_path();
                this._pathApplicationFiles = global.app_path();
                this._pathApplicationProviders = global.bootstrap_path("Loaders");
                this._pathCoreProviders = './../Loaders/';
            }
        }
        /**
         * Finding Core Providers
         *
         * @param coreProviders
         */
        Finder.prototype.findCoreProviders = function () {
            return this._fileManager.findFiles(this._pathCoreProviders, true);
        };
        /**
         * Finding Project Providers
         *
         * @returns {Array}
         */
        Finder.prototype.findApplicationProviders = function () {
            return this._fileManager.findFiles(this._pathApplicationProviders);
        };
        Finder.prototype.findApplicationFiles = function () {
            return this._fileManager.findFiles(this._pathApplicationFiles, false, false);
        };
        Finder.prototype.findApplicationConfigFiles = function () {
            return this._fileManager.findFiles(this._pathApplicationConfig, false, false);
        };
        Finder.prototype.findModules = function () {
            return this._fileManager.findModules(global.app_modules());
        };
        Finder.prototype.findVendorModules = function () {
            return this._fileManager.findModules(global.npm_path());
        };
        Finder.prototype.findModuleFiles = function (modulePath) {
            return this._fileManager.findFiles(modulePath);
        };
        Finder.prototype.findModulesFiles = function () {
            var listModules = this.findModules();
            var pathIndex;
            var pathList = [];
            for (pathIndex in listModules) {
                pathList[pathIndex] = this.findModuleFiles(listModules[pathIndex]);
            }
            return pathList;
        };
        return Finder;
    })();
    Boot.Finder = Finder;
})(Boot = exports.Boot || (exports.Boot = {}));
