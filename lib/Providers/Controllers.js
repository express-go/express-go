'use strict';
/**
 * Controllers Provider
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
        return "controller";
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
     * Register method
     *
     * @param loadObject
     * @param nameObject
     * @returns any
     */
    Provider.prototype.register = function () {
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
    /**
     * Boot method
     *
     * @param app
     * @returns void
     */
    Provider.prototype.boot = function (app) {
        //
    };
    return Provider;
})();
exports.Provider = Provider;
