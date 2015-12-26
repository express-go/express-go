///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var debug = require("debug")('express-go:Boot.FileManager');
var fs = require("fs");
var glob = require("glob");
var path = require("path");
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
        FileManager.prototype.fileExist = function (pathString) {
            try {
                fs.statSync(pathString);
                return pathString;
            }
            catch (err) {
                return null;
            }
        };
        return FileManager;
    })();
    Boot.FileManager = FileManager;
})(Boot = exports.Boot || (exports.Boot = {}));
