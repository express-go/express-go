///<reference path="../../typings/tsd.d.ts"/>
var socketIOAdapter = require("socket.io-redis");
var socketServer;
var debug = require("debug")("express-go:Www.Socket ");
var Www;
(function (Www) {
    var Socket = (function () {
        function Socket(app) {
            debug("Initializing");
            this.app = app;
        }
        /**
         * Socket.io service create
         */
        Socket.prototype.createSocket = function () {
            // Socket.IO instance
            if (!socketServer) {
                debug("Create Socket.IO server");
                // Initializing server
                socketServer = require("socket.io")();
                // Disabled client service (included gulp package)
                socketServer.serveClient(false);
                // Redis connections
                socketServer.adapter(socketIOAdapter({
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT
                }));
                // Socket events
                this.onSocketEvents(socketServer);
                // Booting Sockets loader
                this.app.io = socketServer;
                this.app.boot("Sockets", this.app);
                this.app.boot("Streams", this.app);
            }
        };
        /**
         * Socket.io service attach to web-server
         *
         * @param server
         */
        Socket.prototype.attachSocket = function (server) {
            // Create Socket.IO
            this.createSocket();
            debug("Attach Socket.IO server");
            // Attach Socket.IO to web server
            socketServer.attach(server);
        };
        Socket.prototype.onSocketEvents = function (io) {
            io.sockets.on("connection", function (socket) {
                debug("Connection made. socket.id=" + socket.id + " . pid = " + process.pid);
            });
            io.on("disconnect", function (socket) {
                debug("Lost a socket. socket.id=" + socket.id + " . pid = " + process.pid);
            });
        };
        return Socket;
    })();
    Www.Socket = Socket;
})(Www = exports.Www || (exports.Www = {}));
