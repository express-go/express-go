'use strict';
/**
 * Configurations Provider
 */
var Provider = (function () {
    /**
     * Constructor
     */
    function Provider() {
        //
    }
    /**
     * Prefix used name for components
     * Ex.: module.exports.prefix = {};
     *
     * Use "null" for disable
     *
     * @returns {string}
     */
    Provider.prototype.exportName = function () {
        return "config";
    };
    /**
     * Load object into global namespace
     *
     * Use "false" for disable
     *
     * @returns {boolean}
     */
    Provider.prototype.exportNamespace = function () {
        return true;
    };
    /**
     * Define namespace root in global object
     *
     * @returns {string}
     */
    Provider.prototype.defineNamespace = function () {
        return "Config";
    };
    /**
     * Register method
     *
     * @returns void
     */
    Provider.prototype.register = function () {
    };
    /**
     * Boot method
     *
     * @param app
     * @returns void
     */
    Provider.prototype.boot = function (app) {
        //
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
    Provider.prototype.loader = function (loadObject, nameObject) {
        return null;
    };
    return Provider;
})();
exports.Provider = Provider;
