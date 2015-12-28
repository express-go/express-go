///<reference path="../../typings/tsd.d.ts"/>
var socketIOSession = require("socket.io.session");
var socketSession = null;
/**
 * Sockets loader
 */
var Loaders;
(function (Loaders) {
    var Sockets = (function () {
        /**
         * Constructor
         */
        function Sockets() {
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
        Sockets.prototype.manualBoot = function () {
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
        Sockets.prototype.exportName = function () {
            return "socket";
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Sockets.prototype.exportNamespace = function () {
            return true;
        };
        /**
         * Register method
         *
         * @param app
         * @returns any
         */
        Sockets.prototype.register = function () {
            //
        };
        /**
         * Boot method
         *
         * @param app
         * @returns void
         */
        Sockets.prototype.boot = function (app) {
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
        Sockets.prototype.loader = function (loadObject, nameObject) {
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
        Sockets.prototype.loaderCache = function () {
            return false;
        };
        return Sockets;
    })();
    Loaders.Sockets = Sockets;
})(Loaders = exports.Loaders || (exports.Loaders = {}));
