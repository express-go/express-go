///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var debug = require('debug')('express-go:Boot.Namespace');
var path = require("path");
/**
 * Boot namespace
 */
var Boot;
(function (Boot) {
    /**
     * Namespace handler class
     */
    var Namespace = (function () {
        /**
         * Constructor
         *
         * @test BootNamespaceTest
         */
        function Namespace() {
            debug("Initializing Namespace");
        }
        /**
         * Converting path to array
         *
         * Ex.: "/foo/bar/FileName" => ["foo", "bar", "FileName"]
         *
         * @test BootNamespaceTest
         *
         * @param pathName
         * @param pathBase
         * @returns {string[]}
         */
        Namespace.prototype.pathToArray = function (pathName, pathBase) {
            pathName = path.normalize(pathName);
            // Remove base path
            if (pathBase) {
                pathBase = path.normalize(pathBase);
                pathName = pathName.replace(pathBase, '');
            }
            // Loading file in to object
            var pathPartials = pathName.split(/[\\/]+/); // Split slashes
            pathPartials = pathPartials.filter(function (e) {
                return !!e;
            });
            return pathPartials;
        };
        /**
         * Converting path array to object
         * Use requireValue parameter for defined value, default "null"
         *
         * Ex.: ["foo", "bar", "FileName"] => foo.bar.FileName = null
         *
         * @test BootNamespaceTest
         *
         * @param pathArray
         * @param requireValue
         * @returns {{}}
         */
        Namespace.prototype.pathArrayToObject = function (pathArray, requireValue) {
            var modelActual;
            var modelObject = {};
            var modelPrefix = pathArray[0];
            if (modelPrefix == 'src' || modelPrefix == 'app') {
                modelActual = modelObject;
                pathArray.shift();
            }
            else {
                modelActual = modelObject[modelPrefix] = {};
                pathArray.shift();
            }
            this._arrayToObject(pathArray, modelActual, requireValue ? requireValue : null);
            return modelObject;
        };
        /**
         * Converting path to object
         *
         * @test BootNamespaceTest
         *
         * @param pathName
         * @param pathBase
         * @param requireValue
         * @returns {any}
         */
        Namespace.prototype.pathToObject = function (pathName, pathBase, requireValue) {
            return this.pathArrayToObject(this.pathToArray(pathName, pathBase), requireValue);
        };
        /**
         * Adding object to namespace
         * Alias of "_mergeObjectsRecursive"
         *
         * @test BootNamespaceTest
         *
         * @param namespaceObject
         * @param newObject
         * @returns {any}
         */
        Namespace.prototype.addToNamespace = function (namespaceObject, newObject) {
            debug("Namespace object");
            return this._mergeObjectsRecursive(namespaceObject, newObject);
        };
        /**
         * Convert array to object deep helper
         *
         * @test BootNamespaceTest
         *
         * @param array
         * @param object
         * @param value
         * @private
         */
        Namespace.prototype._arrayToObject = function (array, object, value) {
            if (typeof object[array[0]] == "undefined") {
                var key = array[0];
                array.shift();
                if (array.length == 0) {
                    object[key] = value;
                    return;
                }
                object[key] = {};
                this._arrayToObject(array, object[key], value);
            }
        };
        /**
         * Merge objects recursive
         *
         * @test BootNamespaceTest
         *
         * @param targetObject
         * @param sourceObject
         * @returns {any}
         * @constructor
         */
        Namespace.prototype._mergeObjectsRecursive = function (targetObject, sourceObject) {
            var keyObject;
            for (keyObject in sourceObject) {
                try {
                    // Property in destination object set; update its value.
                    if (sourceObject[keyObject].constructor == Object) {
                        targetObject[keyObject] = this._mergeObjectsRecursive(targetObject[keyObject], sourceObject[keyObject]);
                    }
                    else {
                        targetObject[keyObject] = sourceObject[keyObject];
                    }
                }
                catch (e) {
                    // Property in destination object not set; create it and set its value.
                    targetObject[keyObject] = sourceObject[keyObject];
                }
            }
            return targetObject;
        };
        return Namespace;
    })();
    Boot.Namespace = Namespace;
})(Boot = exports.Boot || (exports.Boot = {}));
