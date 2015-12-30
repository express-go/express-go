'use strict';
var socketStream = require("socket.io-stream");
var socketIOSession = require("socket.io.session");
var socketSession = null;
/**
 * Streams Provider
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
     * Use: app.boot("Streams")
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
        return "stream";
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
        // Socket.io instance
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
            // Use Socket.io with Stream
            loadObject(socketStream(socket));
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
