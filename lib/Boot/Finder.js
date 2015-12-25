///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var debug = require("debug")('express-go:Boot.Finder  ');
var Boot;
(function (Boot) {
    var Finder = (function () {
        function Finder() {
            this._fileList = [];
            this._fileManager = new Boot.Files();
            /*			this.findCoreProviders();
                        this.findProjectProviders();
            
                        this.findProjectFiles();
                        this.findProjectProviders();*/
            //console.log( "+Haha", this._fileManager );
            //process.exit();
        }
        /**
         * Finding Core Providers
         *
         * @param coreProviders
         */
        Finder.prototype.findCoreProviders = function () {
            return this._fileManager.findFiles('./../Loaders/', true);
        };
        /**
         * Finding Project Providers
         *
         * @returns {Array}
         */
        Finder.prototype.findApplicationProviders = function () {
            return this._fileManager.findFiles(global.bootstrap_path("Loaders"));
        };
        Finder.prototype.findApplicationFiles = function () {
            return this._fileManager.findFiles(global.app_path(), false, false);
        };
        Finder.prototype.findApplicationConfigFiles = function () {
            return this._fileManager.findFiles(global.config_path(), false, false);
        };
        Finder.prototype.findModules = function () {
            return this._fileManager.findModules();
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
    /**
     * File helper class for Finder
     */
    var Files = (function () {
        function Files() {
            /**
             * Return files list from project
             **/
            this.findFiles = function (basePath, normalizeSkip, keepExtension) {
                var globPath = basePath + '/**/*(*.js|*.ts)';
                var fileList = [];
                globPath = !normalizeSkip ? path.normalize(globPath) : __dirname + globPath;
                debug("Finding files: %s", globPath);
                glob.sync(globPath).forEach(function (filePath) {
                    // Remove file extension
                    if (!keepExtension)
                        filePath = filePath.replace(/\.[^/.]+$/, "");
                    if (normalizeSkip) {
                        var indexBase = filePath.indexOf(basePath);
                        if (indexBase >= 0) {
                            filePath = filePath.substr(indexBase);
                        }
                    }
                    fileList.push(filePath);
                });
                return fileList;
            };
            // TODO
            // Legyen általános dis listázó
            // Legyen egy Modules class
            this.findModules = function (vendorSearch) {
                var fileList = [];
                var globPath = vendorSearch
                    ? global.npm_path("/**/module-go.json")
                    : global.app_modules("/**/module-go.json");
                debug("Finding modules: %s", globPath);
                glob.sync(globPath).forEach(function (modulePath) {
                    modulePath = path.dirname(modulePath);
                    var moduleName = path.basename(modulePath).replace(/\.[^/.]+$/, "");
                    moduleName = moduleName.substring(0, 1).toUpperCase()
                        + moduleName.substring(1).toLowerCase();
                    fileList[moduleName] = modulePath;
                });
                return fileList;
            };
        }
        /**
         * Detect path is exist (src, config, etc...)
         *
         * @param pathString
         * @returns {any}
         */
        Files.prototype.fileExist = function (pathString) {
            try {
                fs.statSync(pathString);
                return pathString;
            }
            catch (err) {
                return null;
            }
        };
        return Files;
    })();
    Boot.Files = Files;
})(Boot = exports.Boot || (exports.Boot = {}));
