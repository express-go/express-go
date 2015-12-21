///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var debug = require('debug')('express-go:Boot.Loaders');
var Boot;
(function (Boot) {
    var Loaders;
    (function (Loaders) {
        var Load = (function () {
            function Load(components) {
                this._components = {};
                debug("Components Load constructor");
                this._components = components;
                this.loadComponents();
            }
            Load.prototype.getList = function () {
                return this._components;
            };
            /**
             * Loading each defined components
             */
            Load.prototype.loadComponents = function () {
                // Each components list
                for (var key in this._components) {
                    var val = this._components[key];
                    // Load component
                    this.loadComponent(key, val);
                }
                debug("Loading ready!");
            };
            /**
             * Load component
             *
             * @param key
             * @param isLoading
             */
            Load.prototype.loadComponent = function (key, isLoading) {
                debug("Loading component: %s", key);
                var val = {
                    path: __dirname + '/../loader/' + key,
                    source: null,
                    instance: null,
                    preLoad: !!isLoading,
                    loaded: false,
                    exportName: null,
                    objects: {}
                };
                val.source = require(val.path).Loaders[key];
                val.instance = new val.source();
                val.exportName = val.instance.exportName();
                this._components[key] = val;
            };
            return Load;
        })();
        Loaders.Load = Load;
    })(Loaders = Boot.Loaders || (Boot.Loaders = {}));
})(Boot = exports.Boot || (exports.Boot = {}));
