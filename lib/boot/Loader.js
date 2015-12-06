///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var debug = require('debug')('express-go:Boot.Loader');
var Boot;
(function (Boot) {
    var Loader = (function () {
        function Loader(app, appGlobal, modulePath) {
            this._components = {
                "Translations": null,
                "Models": null,
                "Views": null,
                "Controllers": null,
                "Sockets": null,
                "Middlewares": null,
                "Routes": null
            };
            debug("Boot Loader init %s", modulePath || app_path());
            /*if ( modulePath )
            appGlobal.app_path = function( innerPath )
            {
                innerPath = typeof innerPath === 'string' ? innerPath : '';
                return path.dirname(modulePath) + '/' + innerPath;
            };*/
            this.app = app;
            this.global = appGlobal;
            this.modulePath = modulePath;
            this.bootComponents();
            this.loadComponents();
            //console.log("AAAAAAAAA", this.global);
        }
        Loader.prototype.bootComponents = function () {
            for (var key in this._components) {
                var val = {
                    path: __dirname + '/../loader/' + key,
                    source: null,
                    instance: null,
                    objects: {}
                };
                //console.log(val.path);
                val.source = require(val.path).Loaders[key];
                val.instance = new val.source();
                val.instance.boot(this.app);
                this._components[key] = val;
                debug("Booted: %s", key);
            }
        };
        Loader.prototype.loadComponents = function () {
            var _this = this;
            for (var key in this._components) {
                debug("Load %s", key);
                var val = this._components[key];
                var loadPath = !!this.modulePath
                    ? this.modulePath + '/' + (!!val.instance.getLoadPath() ? val.instance.getLoadPath() : '')
                    : app_path() + '/' + (!!val.instance.getLoadPath() ? val.instance.getLoadPath() : '');
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
                    this._components[key] = val;
                }
            }
            debug("Load ready!");
            //console.log("Boot Load", this._components.Models.objects);
            //console.log("Boot Load");
        };
        Loader.prototype.readFilesByPostfix = function (loadPath, filePostfix) {
            try {
                filePostfix = typeof filePostfix !== "string" ? '' : filePostfix;
                var globPath = loadPath + "/**/*" + filePostfix + ".js";
                debug("Load glob: %s", globPath);
                return glob.sync(globPath);
            }
            catch (ex) { }
            return [];
        };
        Loader.prototype.setNamespaces = function (object, namespaces, src) {
        };
        Loader.prototype.readFilesByNamespace = function () {
        };
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
        /*
         * Recursively merge properties of two objects
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
