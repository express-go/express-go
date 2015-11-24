///<reference path='./typings/tsd.d.ts'/>

declare function sockets_path( path? : string );

var fs      = require('fs');
var cluster = require('cluster');
var http    = require('http');
var https   = require('https');
var spdy    = require('spdy');
var traverse = require('traverse');

var socketIOAdapter = require('socket.io-redis');
var socketIOSession = require("socket.io.session");
var socketSession   = null;

export module Core
{
    export class Www
    {
        app : any;
        options =
        {
            // HTTP-specific options
            http :
            {

            },

            // HTTPS-specific options
            https:
            {
                // SSL-specific options for https and spdy
                cert : null,
                ca   : null,
                key  : null,

                // SPDY-specific options
                spdy :
                {
                    //protocols: [ 'h2', 'spdy/3.1', ..., 'http/1.1' ],
                    plain: false,

                    connection:
                    {
                        windowSize: 1024 * 1024, // Server's window size

                        // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
                        autoSpdy31: false
                    }
                }
            },
        };
        appGlobal : any;

        constructor( appBase, basePath, appGlobal )
        {
            this.app = appBase;
            this.appGlobal = appGlobal;
            socketSession = socketIOSession( this.app.sessionSettings );
            this.updateOptions( basePath );
        }

        private updateOptions( basePath )
        {
            // SSL
            this.options.https.cert  = !!this.options.https.cert
                ? this.options.https.cert
                : fs.readFileSync( basePath + '/' + process.env.SSL_CERT );

            this.options.https.ca    = !!this.options.https.ca
                ? this.options.https.ca
                : fs.readFileSync( basePath + '/' + process.env.SSL_CSR  );

            this.options.https.key   = !!this.options.https.key
                ? this.options.https.key
                : fs.readFileSync( basePath + '/' + process.env.SSL_KEY  );

        }

        public serveCluster = ( callFunction ) =>
        {
            // Master cluster
            if (cluster.isMaster)
            {
                /**
                 * Fork process.
                 */
                console.log('start cluster with %s workers', process.env.WORKERS);

                for (var i = 0; i < process.env.WORKERS; ++i)
                {
                    var worker = cluster.fork();
                    console.log('worker %s started.', worker.process.pid);
                }

                /**
                 * Restart process.
                 */
                cluster.on('death', function(worker)
                {
                    console.log('worker %s died. restart...', worker.process.pid);
                    cluster.fork();
                });

/*                cluster.on('exit', function(deadWorker, code, signal)
                {
                    // Restart the worker
                    var worker = cluster.fork();

                    // Note the process IDs
                    var newPID = worker.process.pid;
                    var oldPID = deadWorker.process.pid;

                    // Log the event
                    console.log('worker '+oldPID+' died.');
                    console.log('worker '+newPID+' born.');
                });*/

            }
            else
            {
                /**
                 * Model sync
                 */
                this.app.sequelize.sync().then(function ()
                {

                    /**
                     * Create HTTP server.
                     */
                    callFunction();
                });

                console.log('Worker %d running!', cluster.worker.id);

            }
        };

        public serveService()
        {
            if ( !!process.env.PORT_HTTP )
                this.serveHttp();

            if ( !!process.env.PORT_HTTPS )
            {
                if ( !!process.env.SPDY_HTTPS )
                    this.serveSpdy();
                else
                    this.serveHttps();
            }

        }

        public serveHttp()
        {
            if ( !process.env.FORCE_HTTPS )
                this.app.set('port', this.normalizePort( process.env.PORT_HTTP ) );

            var server = http.createServer( this.app );

            this.serveSocket( server );
            this.serveListen( server, process.env.PORT_HTTP )
        }

        public serveHttps()
        {
            if ( !!process.env.FORCE_HTTPS )
                this.app.set('port', this.normalizePort( process.env.PORT_HTTPS ) );

            var server = https.createServer( this.options.https, this.app );

            this.serveSocket( server );
            this.serveListen( server, process.env.PORT_HTTPS )
        }

        public serveSpdy()
        {
            if ( !!process.env.FORCE_HTTPS )
                this.app.set('port', this.normalizePort( process.env.PORT_HTTPS ) );

            var server = spdy.createServer( this.options.https, this.app );

            this.serveSocket( server );
            this.serveListen( server, process.env.PORT_HTTPS )
        };

        private serveSocket( server )
        {
            var io = require('socket.io').listen( server );

            io.adapter(socketIOAdapter({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }));

            //parse the "/" namespace
            io.use( socketSession.parser );

            this.onSocketEvents( io );


            // Module sockets reading
            try
            {
                traverse(this.appGlobal.App.Http.Sockets).forEach(function ( httpSocket, key )
                {
                    if ( typeof httpSocket == "function" )
                    {
                        httpSocket( io );
                    }
                });

            } catch(ex) {}

        }

        private serveListen( server, port )
        {
            //
            server.listen(port);
            server.on('error', () =>{
                this.onServeError( server, port );
            });
            server.on('listening', () =>
            {
                this.onServeListening( server, port );
            });
        }

        private normalizePort(val) : any
        {
            var port = parseInt(val, 10);

            if (isNaN(port)) {
                // named pipe
                return val;
            }

            if (port >= 0) {
                // port number
                return port;
            }

            return false;
        }

        private onServeListening( server, port )
        {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;

            //debug('Listening on ' + bind);
            console.log('Listening on ' + bind);
        }

        private onServeError( error, port )
        {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        private onSocketEvents( io )
        {

            io.sockets.on("connection", function(socket)
            {
                console.log('Connection made. socket.id='+socket.id+' . pid = '+process.pid);
            });

            io.on('disconnect', function(socket)
            {
                console.log('Lost a socket. socket.id='+socket.id+' . pid = '+process.pid);
            });

        }
    }
}