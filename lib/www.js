///<reference path="../typings/tsd.d.ts"/>
var Cluster = require("./Www/Cluster").Www.Cluster;
var Server = require("./Www/Server").Www.Server;
var Socket = require("./Www/Socket").Www.Socket;
var debug = require("debug")("express-go:Www");
var Www = (function () {
    function Www(appBase, basePath) {
        var _this = this;
        /**
         * Cluster service start
         *
         * @param callFunction
         */
        this.serveCluster = function (callFunction) {
            _this.Cluster.createCluster(callFunction);
        };
        debug("Initializing");
        this.app = appBase;
        this.Cluster = new Cluster(appBase);
        this.Server = new Server(appBase);
        this.Socket = new Socket(appBase);
        this.Server.updateOptions(basePath);
    }
    /**
     * Automatic service start
     * HTTP / HTTPS | SPDY
     */
    Www.prototype.serveService = function () {
        this.Server.createAuto(this.Socket);
    };
    /**
     * HTTP service start
     */
    Www.prototype.serveHttp = function () {
        this.Socket.attachSocket(this.Server.createHttp());
    };
    /**
     * HTTPS service start
     */
    Www.prototype.serveHttps = function () {
        this.Socket.attachSocket(this.Server.createHttps());
    };
    /**
     * SPDY service start
     */
    Www.prototype.serveSpdy = function () {
        this.Socket.attachSocket(this.Server.createSpdy());
    };
    return Www;
})();
module.exports = Www;
