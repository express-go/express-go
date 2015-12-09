///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var debug = require('debug')('express-go:Boot.Loader');
var Boot;
(function (Boot) {
    var Loader = (function () {
        /**
         * Constructor
         * Start boot and load
         *
         * @param app
         * @param appGlobal
         * @param modulePath
         */
        function Loader(app, appGlobal, modulePath) {
            /**
             * Components list
             *
             * @type {{Configs: null, Translations: null, Models: null, Views: null, Controllers: null, Sockets: null, Middlewares: null, Routes: null}}
             * @private
             */
            this._components = {};
            debug("Boot Loader init %s", modulePath || global.app_path());
            this.app = app;
            this.global = appGlobal;
            this.modulePath = modulePath;
        }
        /**
         * Set load components list
         *
         * @param components
         */
        Loader.prototype.setComponents = function (components) {
            this._components = components;
        };
        /**
         * Boot component
         *
         * @param key
         * @param isLoading
         */
        Loader.prototype.bootComponent = function (key, isLoading) {
            var val = {
                path: __dirname + '/../loader/' + key,
                source: null,
                instance: null,
                loading: !!isLoading,
                loaded: false,
                objects: {}
            };
            val.source = require(val.path).Loaders[key];
            val.instance = new val.source();
            val.instance.boot(this.app);
            this._components[key] = val;
            debug("Booted: %s", key);
        };
        /**
         * Load booted component
         *
         * @param key
         * @param val
         */
        Loader.prototype.loadComponent = function (key, val) {
            var _this = this;
            val = !val ? this._components[key] : val;
            var loadPath = !!this.modulePath
                ? this.modulePath + '/' + (!!val.instance.getLoadPath() ? val.instance.getLoadPath() : '')
                : global.app_path() + '/' + (!!val.instance.getLoadPath() ? val.instance.getLoadPath() : '');
            var files;
            debug("Load path: %s", loadPath);
            try {
                if (fs.statSync(loadPath)) {
                    var realPath = fs.realpathSync(loadPath);
                    files = this.readFilesByPostfix(realPath, val.instance.getLoadPostfix());
                }
            }
            catch (e) {
                files = [];
            }
            if (files.length > 0) {
                files.forEach(function (filePath) {
                    // Manual loader function
                    var tempObjects = {};
                    var loadFunction = (typeof val.instance.load === "function")
                        ? val.instance.load(filePath)
                        : null;
                    // File path => namespace array
                    filePath = path.normalize(filePath);
                    var ns = filePath.replace(path.normalize(loadPath), "");
                    ns = ns.replace(/\\\\|\\/g, '/');
                    debug("File path: %s", ns);
                    ns = ns.split("/");
                    // Filename parameters
                    var fileElem = ns[ns.length - 1];
                    var fileExt = fileElem.substr(fileElem.lastIndexOf('.') + 1);
                    var fileName = fileElem.substr(0, fileElem.indexOf('.'));
                    // File path => Class name
                    ns.pop();
                    ns.push(fileName);
                    // Remove empty prefix
                    if (!ns[0] || ns[0] == '') {
                        ns.shift();
                    }
                    // Append ns prefix
                    var nsPrefix = val.instance.getLoadNamespace();
                    if (nsPrefix && typeof nsPrefix == "object" && nsPrefix.length > 0) {
                        ns = nsPrefix.concat(ns);
                    }
                    // Loading objects
                    if (!!loadFunction) {
                        _this.arrayToObject(ns, tempObjects, loadFunction);
                        debug("Loaded by loadFunction");
                    }
                    else if (loadFunction !== false) {
                        var tmpObject = require(filePath);
                        tmpObject = (typeof tmpObject === "function")
                            ? tmpObject(_this.app)
                            : tmpObject;
                        _this.arrayToObject(ns, tempObjects, tmpObject);
                        debug("Loaded by require");
                    }
                    _this.MergeRecursive(val.objects, tempObjects);
                    _this.MergeRecursive(_this.global, val.objects);
                });
                val.loaded = true;
                this._components[key] = val;
            }
        };
        /**
         * Booting each defined components
         */
        Loader.prototype.bootComponents = function () {
            // Each components list
            for (var key in this._components) {
                debug("Boot %s", key);
                var val = this._components[key];
                // Boot component
                this.bootComponent(key, val);
            }
            debug("Boot ready!");
        };
        /**
         * Loading booted components
         */
        Loader.prototype.loadComponents = function () {
            // Each components list
            for (var key in this._components) {
                debug("Load %s", key);
                var val = this._components[key];
                // Load component
                if (val.loading === true)
                    this.loadComponent(key, val);
            }
            debug("Load ready!");
        };
        /**
         * Reading files by declared postfix
         */
        Loader.prototype.readFilesByPostfix = function (loadPath, filePostfix) {
            try {
                filePostfix = typeof filePostfix !== "string" ? '' : filePostfix;
                var globPath = loadPath + "/**/*" + filePostfix + ".js";
                debug("Load glob: %s", globPath);
                return glob.sync(globPath);
            }
            catch (ex) {
            }
            return [];
        };
        /**
         * Make object from array, recursive mode
         *
         * @param array
         * @param object
         * @param value
         */
        Loader.prototype.arrayToObject = function (array, object, value) {
            if (typeof object[array[0]] == "undefined") {
                var key = array[0];
                array.shift();
                if (array.length == 0) {
                    object[key] = value;
                    return;
                }
                object[key] = {};
                this.arrayToObject(array, object[key], value);
            }
        };
        /**
         * Recursively merge properties of two objects
         *
         * @param obj1
         * @param obj2
         * @returns {any}
         * @constructor
         */
        Loader.prototype.MergeRecursive = function (obj1, obj2) {
            for (var p in obj2) {
                try {
                    // Property in destination object set; update its value.
                    if (obj2[p].constructor == Object) {
                        obj1[p] = this.MergeRecursive(obj1[p], obj2[p]);
                    }
                    else {
                        obj1[p] = obj2[p];
                    }
                }
                catch (e) {
                    // Property in destination object not set; create it and set its value.
                    obj1[p] = obj2[p];
                }
            }
            return obj1;
        };
        return Loader;
    })();
    Boot.Loader = Loader;
})(Boot = exports.Boot || (exports.Boot = {}));
