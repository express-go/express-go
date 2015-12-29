///<reference path="../../typings/tsd.d.ts"/>
///<reference path="Boot.ts"/>
var debug = require("debug")("express-go:Boot.Provider ");
/**
 * Boot namespace
 */
var Boot;
(function (Boot) {
    var Provider = (function () {
        /**
         * Constructor
         *
         * @test BootProviderTest
         */
        function Provider() {
            var _this = this;
            this._providers = [];
            this._exports = [];
            /**
             * Parse Provider name from path
             *
             * @test BootProviderTest
             *
             * @param providerPath
             * @returns {*}
             */
            this.parseNameFromPath = function (providerPath) {
                var fileName = providerPath
                    .split(/[\\/]+/)
                    .pop()
                    .replace(/\.[^/.]+$/, "");
                return fileName;
            };
            /**
             * Initializing Provider object by path
             *
             * @param providerPath
             */
            this.initProvider = function (providerPath, providerName) {
                if (!providerName) {
                    providerName = _this.parseNameFromPath(providerPath);
                }
                var providerSource = require(providerPath);
                var providerObject = typeof providerSource["loader"] !== "undefined"
                    ? providerSource["loader"]
                    : providerSource.Loaders[providerName];
                if (!providerObject) {
                    throw new Error("Provider object problem: " + providerPath);
                }
                _this.initProviderObject(providerObject, providerName);
            };
            /**
             * Initializing Provider object by required object
             *
             * @param providesObject
             */
            this.initProviderObject = function (providerObject, providerName) {
                //
                debug("Initializing Provider object: %s", providerName);
                var val = {
                    source: null,
                    instance: null,
                    booted: false,
                    bootedFiles: false,
                    loadedFiles: false,
                    manualBoot: false,
                    exportName: null,
                    exportNamespace: false,
                    //defineNamespace : null,
                    objects: {}
                };
                val.source = providerObject;
                val.instance = typeof val.source === "function" ? new val.source() : val.source;
                _this.validateProviderObject(val.instance);
                val.manualBoot = !!(typeof val.instance.manualBoot === "function" && val.instance.manualBoot() === true);
                val.exportName = val.instance.exportName();
                val.exportNamespace = val.instance.exportNamespace();
                //val.defineNamespace =
                // Call "register" in provider
                val.instance.register();
                debug("Provider register called: %s", providerName);
                if (val.exportName && typeof val.exportName === "string") {
                    _this._providers[providerName] = _this._exports[val.exportName] = val;
                }
                else {
                    _this._providers[providerName] = val;
                }
            };
            //
        }
        /**
         * Booting providers
         *
         * @param app
         */
        Provider.prototype.bootProviders = function (app) {
            debug("Booting Providers");
            for (var indexProvider in this._providers) {
                // Manual boot
                if (!this._providers[indexProvider].manualBoot) {
                    this.bootProvider(indexProvider, app);
                }
            }
        };
        Provider.prototype.bootProvider = function (indexProvider, app) {
            debug("Booting Provider: %s", indexProvider);
            var bootObject;
            var actProvider;
            var actObject;
            var actCache;
            this._providers[indexProvider].instance.boot(app);
            for (var indexObject in this._providers[indexProvider].objects) {
                debug("Loading Provider object: %s", indexObject);
                actProvider = this._providers[indexProvider];
                actObject = actProvider.objects[indexObject];
                actCache = !(typeof actProvider.instance.loaderCache === "function" &&
                    actProvider.instance.loaderCache() === false);
                if (typeof actProvider.instance.loader === "function") {
                    bootObject = actProvider.instance.loader(actObject, this.parseNameFromPath(indexObject));
                    if (actCache) {
                        if (bootObject === null) {
                            debug("Loading Provider default mode");
                            if (typeof actObject === "function")
                                actObject = actObject(app);
                        }
                        else {
                            debug("Loading Provider manual mode");
                            actObject = bootObject;
                        }
                    }
                }
                else {
                    debug("[Loading default mode]");
                    if (actCache) {
                        if (typeof actObject === "function")
                            actObject = actObject(app);
                    }
                }
                // Else keep original object
                actProvider.objects[indexObject] = actObject;
            }
        };
        Provider.prototype.providerByName = function (providerName) {
            if (this._providers.hasOwnProperty(providerName)) {
                return this._providers[providerName];
            }
        };
        /**
         * Ordering providers by name list
         *
         * @param orderProviders
         */
        Provider.prototype.orderProviders = function (orderProviders) {
            var valueProvider;
            var tmpProviders = [];
            var actProviders = this._providers;
            // Sorting by order
            for (var indexProvider in orderProviders) {
                valueProvider = orderProviders[indexProvider];
                tmpProviders[valueProvider] = actProviders[valueProvider];
                delete actProviders[valueProvider];
            }
            // Adding the rest
            for (var indexProvider in actProviders) {
                if (valueProvider = actProviders[indexProvider])
                    tmpProviders[indexProvider] = valueProvider;
                delete actProviders[valueProvider];
            }
            // Setting new list
            this._providers = tmpProviders;
        };
        /**
         * Associate file with provider export prefix
         *
         * @param filePath
         */
        Provider.prototype.associateProvider = function (filePath) {
            var fileObject = require(filePath);
            this.associateProviderObject(fileObject, filePath);
        };
        Provider.prototype.associateProviderObject = function (fileObject, filePath) {
            for (var indexExport in fileObject) {
                if (indexExport in this._exports) {
                    debug("Associated file [%s]: %s", indexExport, filePath);
                    fileObject = this._exports[indexExport].objects[filePath] = fileObject[indexExport];
                    return {
                        provider: this._exports[indexExport],
                        fileObject: fileObject
                    };
                }
            }
            debug("Unprovided file: %s", filePath);
            return null;
        };
        /**
         * Validating necessary functions
         *
         * @test BootProviderTest
         *
         * @param providerObject
         * @returns {boolean}
         */
        Provider.prototype.validateProviderObject = function (providerObject) {
            if (typeof providerObject["boot"] === "undefined"
                || typeof providerObject["register"] === "undefined"
                || typeof providerObject["exportName"] === "undefined"
                || typeof providerObject["exportNamespace"] === "undefined")
                throw new Error("Provider validate problem: " + providerObject);
            return true;
        };
        return Provider;
    })();
    Boot.Provider = Provider;
})(Boot = exports.Boot || (exports.Boot = {}));
