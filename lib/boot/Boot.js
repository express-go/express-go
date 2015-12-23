///<reference path='../typings/tsd.d.ts'/>
///<reference path='Builder.ts'/>
///<reference path='Loaders.ts'/>
///<reference path='Project.ts'/>
var debug = require('debug')('express-go:Boot');
var Loaders = require('./Loaders').Boot.Loaders;
var loadLoaders;
var Project = require('./Project').Boot.Project;
var loadProject;
var Builder = require('./Builder').Boot.Builder;
var loadBuilder;
var Boot;
(function (Boot_1) {
    /**
     * Initialization class
     */
    var Init = (function () {
        /**
         * Loading components, objects
         *
         * @param componentsList
         * @param pathsList
         */
        function Init(componentsList, pathsList) {
            debug("Boot Init constructor");
            // Loaders
            loadLoaders = new Loaders.Load(componentsList);
            // Builder
            loadBuilder = new Builder.Load(loadLoaders);
            // Project files
            loadProject = new Project.Load(pathsList, loadBuilder);
        }
        return Init;
    })();
    Boot_1.Init = Init;
    /**
     * Boot class
     */
    var Boot = (function () {
        /**
         * Booting objects
         *
         * @param app
         */
        function Boot(app) {
            /**
             * Booting object parsers, providers
             *
             * @param app
             */
            this.bootLoaders = function (app) {
                debug("Boot Loaders objects");
                var bootList = loadLoaders.getList();
                for (var key in bootList) {
                    debug("Booting Loaders object: %s", key);
                    if (typeof bootList[key].instance.boot === "function") {
                        bootList[key].instance.boot(app);
                    }
                }
            };
            /**
             * Boot project loaded objects
             * These objects are booted by "Loaders"
             *
             * @param app
             */
            this.bootObjects = function (app) {
                debug("Boot Project objects");
                var bootList = loadBuilder.getBootList();
                for (var key in bootList) {
                    debug("Booting Project object: %s", key);
                    bootList[key] = bootList[key](app);
                }
            };
            debug("Boot objects");
            this.bootLoaders(app);
            this.bootObjects(app);
        }
        return Boot;
    })();
    Boot_1.Boot = Boot;
})(Boot = exports.Boot || (exports.Boot = {}));
