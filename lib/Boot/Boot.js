///<reference path="../../typings/tsd.d.ts"/>
var debug = require("debug")("express-go:Boot");
var Finder = require("./Finder").Boot.Finder;
var Provider = require("./Provider").Boot.Provider;
var Namespace = require("./Namespace").Boot.Namespace;
var loadFinder;
var loadProvider;
var loadNamespace;
var sortProvider = [
    "Configs",
    "Translations",
    "Models",
    "Views",
    "Controllers",
    "Middlewares",
    "Routes",
    "Sockets",
    "Streams",
    "Commands"
];
var loadUnknownFiles = true;
/**
 * Boot namespace
 */
var Boot;
(function (Boot) {
    /**
     * Initialization class
     */
    var Init = (function () {
        /**
         * Loading components, objects
         *
         * @param appGlobal
         * @param pathsList
         */
        function Init(appGlobal, pathsList) {
            debug("Initializing Boot");
            loadFinder = new Finder();
            loadProvider = new Provider();
            loadNamespace = new Namespace();
            global = appGlobal;
            global.App = {};
            global.Modules = {};
            global.Config = {};
            this.initProviders(sortProvider);
            this.initApplication();
            this.initModules();
            var mainApp = require("../express");
            this.boot(mainApp);
            mainApp.boot = function (nameProvider, userApp) {
                debug("Booting Manual Provider");
                loadProvider.bootProvider(nameProvider, userApp ? userApp : mainApp);
            };
            mainApp.provider = function (nameProvider) {
                debug("Getting " + nameProvider + " Provider");
                return loadProvider.providerByName(nameProvider).instance;
            };
            return mainApp;
        }
        Init.prototype.initProviders = function (orderList) {
            debug("Initializing Providers");
            var pathsProviders = [].concat(loadFinder.findCoreProviders(), loadFinder.findApplicationProviders());
            for (var indexProvider in pathsProviders) {
                if (pathsProviders.hasOwnProperty(indexProvider)) {
                    loadProvider.initProvider(pathsProviders[indexProvider]);
                }
            }
            loadProvider.orderProviders(orderList);
        };
        Init.prototype.initApplication = function () {
            debug("Initializing Application");
            var appFiles;
            var appPath;
            var fileSource;
            var fileObject;
            var providerObject;
            var needNamespace;
            global.App.config = {};
            // Config files
            appFiles = loadFinder.findApplicationConfigFiles();
            for (var appIndex in appFiles) {
                if (appFiles.hasOwnProperty(appIndex)) {
                    appPath = appFiles[appIndex];
                    fileSource = require(appPath);
                    needNamespace = loadUnknownFiles;
                    providerObject = loadProvider.associateProviderObject(fileSource, appPath);
                    if (providerObject) {
                        needNamespace = providerObject.provider.exportNamespace;
                        fileSource = providerObject.fileObject;
                    }
                    fileObject = loadNamespace.pathToObject(appPath, global.config_path(), fileSource);
                    global.App.config = loadNamespace.addToNamespace(global.App.config, fileObject);
                }
            }
            // Application files
            appFiles = loadFinder.findApplicationFiles();
            // Core Commands
            appFiles = appFiles.concat(loadFinder.findCoreCommands());
            for (var appIndex in appFiles) {
                if (appFiles.hasOwnProperty(appIndex)) {
                    appPath = appFiles[appIndex];
                    fileSource = require(appPath);
                    needNamespace = loadUnknownFiles;
                    if (providerObject = loadProvider.associateProviderObject(fileSource, appPath)) {
                        needNamespace = providerObject.provider.exportNamespace;
                        fileSource = providerObject.fileObject;
                    }
                    // Object in Provider, but non namespace
                    if (needNamespace) {
                        fileObject = loadNamespace.pathToObject(appPath, global.app_path(), fileSource);
                        global.App = loadNamespace.addToNamespace(global.App, fileObject);
                    }
                }
            }
            //loadProvider.associateProviders(
            //	loadFinder.findApplicationFiles()
            //);
        };
        Init.prototype.initModules = function () {
            debug("Initializing Modules");
            var listModules = loadFinder.findModules();
            var appFiles;
            var appIndex;
            var appPath;
            var fileSource;
            var fileObject;
            var providerObject;
            var needNamespace;
            for (var indexModules in listModules) {
                if (listModules.hasOwnProperty(indexModules)) {
                    appFiles = loadFinder.findModuleFiles(listModules[indexModules]);
                    global.Modules[indexModules] = {};
                    for (appIndex in appFiles) {
                        if (listModules.hasOwnProperty(indexModules)) {
                            appPath = appFiles[appIndex];
                            fileSource = require(appPath);
                            needNamespace = loadUnknownFiles;
                            if (providerObject = loadProvider.associateProviderObject(fileSource, appPath)) {
                                needNamespace = providerObject.provider.exportNamespace;
                                fileSource = providerObject.fileObject;
                            }
                            if (needNamespace) {
                                fileObject = loadNamespace.pathToObject(appPath, listModules[indexModules], fileSource);
                                global.Modules[indexModules] = loadNamespace.addToNamespace(global.Modules[indexModules], fileObject);
                            }
                        }
                    }
                }
            }
        };
        Init.prototype.boot = function (app) {
            loadProvider.bootProviders(app);
        };
        return Init;
    })();
    Boot.Init = Init;
})(Boot = exports.Boot || (exports.Boot = {}));
