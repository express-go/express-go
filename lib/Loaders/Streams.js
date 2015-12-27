///<reference path='../../typings/tsd.d.ts'/>
var socketStream = require('socket.io-stream');
var socketIOSession = require("socket.io.session");
var socketSession = null;
/**
 * Streams loader
 */
var Loaders;
(function (Loaders) {
    var Streams = (function () {
        /**
         * Constructor
         */
        function Streams() {
            var _this = this;
            /**
             * Register method
             *
             * @returns any
             */
            this.register = function () {
            };
            /**
             * Boot method
             *
             * @param app
             * @returns void
             */
            this.boot = function (app) {
                // Socket.io instance
                _this._io = app.io;
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
            this.loader = function (loadObject, nameObject) {
                // Socket channel
                var socketPrefix = nameObject == "index" ? "" : nameObject;
                // Channel instance with session parser
                var socketChannel = _this._io.of("/" + socketPrefix);
                socketChannel.use(socketSession.parser);
                // io conection
                socketChannel.on('connection', function (socket) {
                    // Use Socket.io with Stream
                    loadObject(socketStream(socket));
                });
            };
        }
        /**
         * Manual or automatic booting
         * Default, if not defined: false [automatic]
         *
         * Use: app.boot("Streams")
         *
         * @returns {boolean}
         */
        Streams.prototype.manualBoot = function () {
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
        Streams.prototype.exportName = function () {
            return 'stream';
        };
        /**
         * Load object into global namespace
         *
         * Use "false" for disable
         *
         * @returns {boolean}
         */
        Streams.prototype.exportNamespace = function () {
            return true;
        };
        /**
         * Disable saving loader object
         *
         * @returns {boolean}
         */
        Streams.prototype.loaderCache = function () {
            return false;
        };
        return Streams;
    })();
    Loaders.Streams = Streams;
})(Loaders = exports.Loaders || (exports.Loaders = {}));