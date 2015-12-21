///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var traverse = require('traverse');
var debug = require('debug')('express-go:Boot.Builder');
var Boot;
(function (Boot) {
    var Builder;
    (function (Builder) {
        var Load = (function () {
            //constructor( loadLoaders : any, loadProject : any )
            function Load(loadLoaders) {
                this._loadersPrefix = {};
                this._bootersList = [];
                debug("Builder Load constructor");
                this._loaders = loadLoaders.getList();
                this.loadLoadersPrefix();
            }
            Load.prototype.getBootList = function () {
                return this._bootersList;
            };
            Load.prototype.findObjectLoader = function (theObject, nameObject) {
                return this.loadProjectObjects(theObject, nameObject);
            };
            /**
             * Runtime loading Components
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
                        // If we use manual object booting
                        if (typeof this._loadersPrefix[key].instance.register === "function") {
                            //theObject = this._loadersPrefix[ key ].instance.register( theObject[ key ], nameObject );
                            var tmpObject = this._loadersPrefix[key].instance.register(theObject[key], nameObject);
                            theObject = !!tmpObject ? tmpObject : theObject;
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
