///<reference path="../../typings/tsd.d.ts"/>
///<reference path="Boot.ts"/>
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var debug = require("debug")("express-go:Boot.FileManager");
/**
 * Boot namespace
 */
var Boot;
(function (Boot) {
    /**
     * File helper class for Finder
     */
    var FileManager = (function () {
        function FileManager() {
            var _this = this;
            /**
             * Finding script & typescript files
             *
             * @test BootFileManagerTest
             */
            this.findFiles = function (basePath, normalizeSkip, keepExtension) {
                var filePath;
                var globList;
                var globPath = _this.fileNormalizePath(basePath + "/**/*(*.js|*.ts)", normalizeSkip);
                debug("Finding files: %s", globPath);
                globList = _this.searchFiles(globPath);
                for (var globIndex in globList) {
                    if (globList.hasOwnProperty(globIndex)) {
                        filePath = globList[globIndex];
                        if (!keepExtension) {
                            filePath = _this.fileExtensionRemove(filePath);
                        }
                        globList[globIndex] = filePath;
                    }
                }
                return globList;
            };
            /**
             * Finding modules
             *
             * @test BootFileManagerTest
             */
            this.findModules = function (basePath) {
                var moduleList = [];
                var moduleName;
                var modulePath;
                var globList;
                var globPath = _this.fileNormalizePath(basePath + "/**/module-go.json");
                debug("Finding modules: %s", globPath);
                globList = _this.searchFiles(globPath);
                for (var globIndex in globList) {
                    if (globList.hasOwnProperty(globIndex)) {
                        modulePath = globList[globIndex];
                        modulePath = path.dirname(modulePath);
                        moduleName = path.basename(modulePath).replace(/\.[^/.]+$/, "");
                        moduleName = moduleName.substring(0, 1).toUpperCase()
                            + moduleName.substring(1).toLowerCase();
                        moduleList[moduleName] = modulePath;
                    }
                }
                return moduleList;
            };
        }
        /**
         * Searching files with Glob
         *
         * @test BootFileManagerTest
         *
         * @param globPath
         * @returns {Array}
         */
        FileManager.prototype.searchFiles = function (globPath) {
            var fileList = [];
            glob.sync(globPath).forEach(function (filePath) {
                fileList.push(filePath);
            });
            return fileList;
        };
        /**
         * Normalizing file path
         *
         * @test BootFileManagerTest
         *
         * @param filePath
         * @param normalizeSkip
         * @returns {string}
         */
        FileManager.prototype.fileNormalizePath = function (filePath, normalizeSkip) {
            return !normalizeSkip
                ? path.normalize(filePath)
                : __dirname + filePath;
        };
        /**
         * Realizing file path
         *
         * @test BootFileManagerTest
         *
         * @param filePath
         * @param basePath
         * @returns {string}
         */
        FileManager.prototype.fileRealize = function (filePath, basePath) {
            var indexBase = filePath.indexOf(basePath);
            if (indexBase > -1) {
                filePath = filePath.substr(indexBase + basePath.length);
            }
            return filePath;
        };
        /**
         * Clear file extension
         *
         * @test BootFileManagerTest
         *
         * @param filePath
         * @returns {string}
         */
        FileManager.prototype.fileExtensionRemove = function (filePath) {
            // Remove file extension
            return filePath.replace(/\.[^/.]+$/, "");
        };
        /**
         * Detect file | path is exist (src, config, etc...)
         *
         * @test BootFileManagerTest
         *
         * @param pathString
         * @returns {boolean}
         */
        FileManager.prototype.fileExist = function (pathString) {
            try {
                return !!fs.statSync(pathString);
            }
            catch (err) {
                return false;
            }
        };
        return FileManager;
    })();
    Boot.FileManager = FileManager;
})(Boot = exports.Boot || (exports.Boot = {}));
