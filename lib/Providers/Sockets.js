'use strict';
var socketIOSession = require("socket.io.session");
var socketSession = null;
/**
 * Sockets Provider
 */
var Provider = (function () {
    /**
     * Constructor
     */
    function Provider() {
        //
    }
    /**
     * Manual or automatic booting
     * Default, if not defined: false [automatic]
     *
     * Use: app.boot("Sockets")
     *
     * @returns {boolean}
     */
    Provider.prototype.manualBoot = function () {
        return true;
    };
    /**
     * Prefix used name for components
     * Ex.: module.exports.prefix = {};
     *
     * Use "null" for disable
     *
     * @returns {string}
     */
    Provider.prototype.exportName = function () {
        return "socket";
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
     * @param app
     * @returns any
     */
    Provider.prototype.register = function () {
        //
    };
    /**
     * Boot method
     *
     * @param app
     * @returns void
     */
    Provider.prototype.boot = function (app) {
        this._io = app.io;
        socketSession = socketIOSession(app.sessionSettings);
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
        // Socket channel
        var socketPrefix = nameObject === "index" ? "" : nameObject;
        // Channel instance with session parser
        var socketChannel = this._io.of("/" + socketPrefix);
        socketChannel.use(socketSession.parser);
        // io conection
        socketChannel.on("connection", function (socket) {
            // Use original method with Socket.io object
            loadObject(socket);
        });
    };
    /**
     * Disable saving loader object
     *
     * @returns {boolean}
     */
    Provider.prototype.loaderCache = function () {
        return false;
    };
    return Provider;
})();
exports.Provider = Provider;
