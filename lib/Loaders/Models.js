///<reference path='../typings/tsd.d.ts'/>
var fs = require('fs');
var path = require('path');
var db = {};
var Sequelize = require('sequelize');
var sequelize;
/**
 * Model loader
 */
var Loaders;
(function (Loaders) {
    var Models = (function () {
        /**
         * Constructor
         */
        function Models() {
            /**
             * Register method
             *
             * @param app
             * @returns void
             */
            this.register = function (app) {
                // Initializing
                if (!!process.env.DB_ENV) {
                    sequelize = new Sequelize(process.env.DB_ENV);
                }
                else {
                    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
                        "host": process.env.DB_HOST,
                        "port": process.env.DB_PORT,
                        "dialect": process.env.DB_TYPE
                    });
                }
            };
            /**
             * Loader method
             *
             * You can override default object initialization method
             *
             * @param loadObject
             * @param nameObject
             * @returns {any}
             */
            this.loader = function (loadObject, nameObject) {
                // Use sequelize method
                return sequelize.import(nameObject, loadObject);
            };
            /**
             * Boot method
             *
             * @param app
             * @returns void
             */
            this.boot = function (app) {
                // Loading relations
                Object.keys(sequelize.models).forEach(function (modelName) {
                    // Models associations
                    if (sequelize.models[modelName].associate) {
                        sequelize.models[modelName].associate(sequelize.models);
                    }
                });
                // Add for app
                app.sequelize = sequelize;
                app.Sequelize = Sequelize;
            };
        }
        /**
         * Prefix used name for components
         * Ex.: module.exports.prefix = {};
         *
         * Use "null" for disable
         *
         * @returns {string}
         */
        Models.prototype.exportName = function () {
            return 'model';
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Models.prototype.exportNamespace = function () {
            return true;
        };
        return Models;
    })();
    Loaders.Models = Models;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
