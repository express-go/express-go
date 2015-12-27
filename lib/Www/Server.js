///<reference path='../../typings/tsd.d.ts'/>
var http = require('http');
var https = require('https');
var spdy = require('spdy');
var debug = require('debug')('express-go:Www.Server');
var Www;
(function (Www) {
    var Server = (function () {
        function Server(app) {
            this._app = app;
            // Environment correcting if need
            process.env.PORT_HTTP = this.normalizePort(process.env.PORT_HTTP);
            process.env.PORT_HTTPS = this.normalizePort(process.env.PORT_HTTPS);
            process.env.SPDY_HTTPS = !!process.env.SPDY_HTTPS;
            process.env.FORCE_HTTPS = !!process.env.FORCE_HTTPS;
            // Options
            this.options =
                {
                    // HTTP-specific options
                    http: {},
                    // HTTPS-specific options
                    https: {
                        // SSL-specific options for https and spdy
                        cert: null,
                        ca: null,
                        key: null,
                        // SPDY-specific options
                        spdy: {
                            //protocols: [ 'h2', 'spdy/3.1', ..., 'http/1.1' ],
                            plain: false,
                            connection: {
                                windowSize: 1024 * 1024,
                                // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
                                autoSpdy31: false
                            }
                        }
                    }
                };
        }
        /**
         * Automatic Server creator
         */
        Server.prototype.createAuto = function () {
            if (!!process.env.PORT_HTTP)
                this.createHttp();
            if (!!process.env.PORT_HTTPS) {
                if (!!process.env.SPDY_HTTPS)
                    this.createSpdy();
                else
                    this.createHttps();
            }
        };
        /**
         * Server HTTP
         */
        Server.prototype.createHttp = function () {
            this._serverHttp = http.createServer(this._app);
            this._serverListen(this._serverHttp, process.env.PORT_HTTP);
            //			if ( !process.env.FORCE_HTTPS )
            //				this._app.set( 'port', this.normalizePort( process.env.PORT_HTTP ) );
            //this._serveSocket( server );
            //this._serveListen( server, process.env.PORT_HTTP )
        };
        /**
         * Server HTTPS
         */
        Server.prototype.createHttps = function () {
            this._serverHttps = https.createServer(this.options.https, this._app);
            this._serverListen(this._serverHttps, process.env.PORT_HTTPS);
            /*			if ( !!process.env.FORCE_HTTPS )
                            this.app.set( 'port', this.normalizePort( process.env.PORT_HTTPS ) );
            
                        var server = https.createServer( this.options.https, this.app );
            
                        this.serveSocket( server );
                        this.serveListen( server, process.env.PORT_HTTPS )*/
        };
        /**
         * Server SPDY
         */
        Server.prototype.createSpdy = function () {
            this._serverHttps = spdy.createServer(this.options.https, this._app);
            this._serverListen(this._serverHttps, process.env.PORT_HTTPS);
            /*			if ( !!process.env.FORCE_HTTPS )
                            this.app.set( 'port', this.normalizePort( process.env.PORT_HTTPS ) );
            
                        var server = spdy.createServer( this.options.https, this.app );
            
                        this.serveSocket( server );
                        this.serveListen( server, process.env.PORT_HTTPS )*/
        };
        /**
         * Normalize port number
         *
         * @param val
         * @returns {any}
         */
        Server.prototype.normalizePort = function (val) {
            var port = parseInt(val, 10);
            if (isNaN(port)) {
                // named pipe
                return val;
            }
            if (port >= 0) {
                // port number
                return port;
            }
            return null;
        };
        /**
         * Listening server creator
         *
         * @param server
         * @param port
         */
        Server.prototype._serverListen = function (server, port) {
            var _this = this;
            //
            server.listen(port);
            server.on('error', function (error) {
                _this._onServerError(error, port);
            });
            server.on('listening', function () {
                _this._onServerListening(server, port);
            });
        };
        Server.prototype._onServerError = function (error, port) {
            if (error.syscall !== 'listen') {
                throw error;
            }
            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    {
                        console.error(bind + ' requires elevated privileges');
                        process.exit(1);
                        break;
                    }
                case 'EADDRINUSE':
                    {
                        console.error(bind + ' is already in use');
                        process.exit(1);
                        break;
                    }
                default:
                    throw error;
            }
        };
        Server.prototype._onServerListening = function (server, port) {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug('Listening on ' + bind);
        };
        return Server;
    })();
    Www.Server = Server;
})(Www = exports.Www || (exports.Www = {}));
