var fs = require('fs');
var path = require('path');
var db = {};
var Sequelize = require('sequelize');
if (!!process.env.DB_ENV)
    var sequelize = new Sequelize(process.env.DB_ENV);
else
    var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "dialect": process.env.DB_TYPE
    });
/**
 * Model loader
 */
var Loaders;
(function (Loaders) {
    var Models = (function () {
        function Models() {
        }
        /**
         * Trigger, when booting class file
         */
        Models.prototype.boot = function (app) {
            Object.keys(sequelize.models).forEach(function (modelName) {
                // Models associations
                if (sequelize.models[modelName].associate) {
                    sequelize.models[modelName].associate(sequelize.models);
                }
            });
            app.sequelize = sequelize;
            app.Sequelize = Sequelize;
        };
        /**
         * Trigger, when loading class file
         * Override here the "require"
         *
         * @param loadPath
         */
        Models.prototype.load = function (loadPath) {
            return sequelize.import(loadPath);
        };
        /**
         * Locations root path
         * Null is global in app and modules
         *
         * @returns {any}
         */
        Models.prototype.getLoadPath = function () {
            return models_path("", true);
        };
        /**
         * Finding files by postfix
         *
         * @returns {string}
         */
        Models.prototype.getLoadPostfix = function () {
            return null;
        };
        /**
         * Setting files by namespace
         *
         * @returns {string[]}
         */
        Models.prototype.getLoadNamespace = function () {
            return ["Models"];
        };
        return Models;
    })();
    Loaders.Models = Models;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
