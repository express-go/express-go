///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var debug = require('debug')('express-go:Boot.Builder');
var Boot;
(function (Boot) {
    var Builder;
    (function (Builder) {
        var Load = (function () {
            /**
             * Constructor, start loading
             *
             * @param loadLoaders - loaded Loaders
             */
            function Load(loadLoaders) {
                this._loadersPrefix = {};
                this._bootersList = [];
                debug("Builder Load constructor");
                this._loaders = loadLoaders.getList();
                this.loadLoadersPrefix();
            }
            /**
             * Return boot waiting objects
             *
             * @returns {any}
             */
            Load.prototype.getBootList = function () {
                return this._bootersList;
            };
            /**
             * Alias of loadProjectObjects
             *
             * @param theObject
             * @param nameObject
             * @returns {any}
             */
            Load.prototype.findObjectLoader = function (theObject, nameObject) {
                return this.loadProjectObjects(theObject, nameObject);
            };
            /**
             * Runtime using booted "Loaders"
             * On the fly :)
             *
             * @param theObject
             * @param nameObject
             * @returns {boolean}
             */
            Load.prototype.loadProjectObjects = function (theObject, nameObject) {
                // Prefix each
                for (var key in this._loadersPrefix) {
                    // Is object has prefix (ex: model)
                    if (theObject.hasOwnProperty(key)) {
                        var tmpObject;
                        // Detect and load default load method override
                        if (typeof this._loadersPrefix[key].instance.register === "function")
                            tmpObject = this._loadersPrefix[key].instance.register(theObject[key], nameObject);
                        // If we use manual object booting
                        if (!!tmpObject) {
                            theObject = tmpObject;
                            debug("Builded object: [%s] %s", key, nameObject);
                        }
                        else {
                            if (typeof theObject[key] === "function") {
                                theObject = theObject[key];
                                this._bootersList.push(theObject);
                                debug("Boot list object: [%s] %s", key, nameObject);
                            }
                            else {
                                theObject = theObject[key];
                                debug("Loaded object: [%s] %s", key, nameObject);
                            }
                        }
                        // Break for...
                        break;
                    }
                }
                return theObject;
            };
            /**
             * Collect object prefixes from "Loaders"
             *
             * Ex.: model => Loaders.Models
             * For: module.exports.model = ...
             */
            Load.prototype.loadLoadersPrefix = function () {
                debug("Loaders Prefix indexing");
                for (var key in this._loaders) {
                    var val = this._loaders[key];
                    if (!!val.exportName && typeof val.exportName === "string")
                        this._loadersPrefix[val.exportName] = val;
                }
            };
            return Load;
        })();
        Builder.Load = Load;
    })(Builder = Boot.Builder || (Boot.Builder = {}));
})(Boot = exports.Boot || (exports.Boot = {}));
