///<reference path='./typings/tsd.d.ts'/>

import {Worker} from "cluster";
import {ExpressGoGlobal} from "./typings/express-go";
declare var global : ExpressGoGlobal;

var fs       = require( 'fs' );
var cluster  = require( 'cluster' );
var http     = require( 'http' );
var https    = require( 'https' );
var spdy     = require( 'spdy' );
var traverse = require( 'traverse' );
var watch    = require( 'node-watch' );

var socketIOAdapter = require( 'socket.io-redis' );
var socketIOSession = require( "socket.io.session" );
var socketSession   = null;

var debug = require( 'debug' )( 'express-go:Www' );

export module Core
{
	export class Www
	{
		app : any;
		options =
		{
			// HTTP-specific options
			http : {},

			// HTTPS-specific options
			https : {
				// SSL-specific options for https and spdy
				cert : null,
				ca   : null,
				key  : null,

				// SPDY-specific options
				spdy : {
					//protocols: [ 'h2', 'spdy/3.1', ..., 'http/1.1' ],
					plain : false,

					connection : {
						windowSize : 1024 * 1024, // Server's window size

						// **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
						autoSpdy31 : false
					}
				}
			},
		};
		appGlobal : any;

		constructor( appBase, basePath, appGlobal )
		{
			this.app       = appBase;
			this.appGlobal = appGlobal;
			socketSession  = socketIOSession( this.app.sessionSettings );
			this.updateOptions( basePath );
		}

		private updateOptions( basePath )
		{
			// SSL
			this.options.https.cert = !!this.options.https.cert
				? this.options.https.cert
				: fs.readFileSync( basePath + '/' + process.env.SSL_CERT );

			this.options.https.ca = !!this.options.https.ca
				? this.options.https.ca
				: fs.readFileSync( basePath + '/' + process.env.SSL_CSR );

			this.options.https.key = !!this.options.https.key
				? this.options.https.key
				: fs.readFileSync( basePath + '/' + process.env.SSL_KEY );

		}

		public serveCluster = ( callFunction ) =>
		{
			// Master cluster
			if ( cluster.isMaster )
			{
				/**
				 * Fork process.
				 */
				debug( 'start cluster with %s workers', process.env.WORKERS );

				for ( var i = 0; i < process.env.WORKERS; i++ )
				{
					var worker = cluster.fork();
					debug( 'worker %s started.', worker.process.pid );
				}

				/**
				 * Restart process.
				 */
				cluster.on( 'death', function ( worker : Worker )
				{
					debug( 'worker %s died. restart...', worker.process.pid );
					cluster.fork();
				} );

				// Go through all workers
				function eachWorker( callback )
				{
					for ( var id in cluster.workers )
					{
						callback( cluster.workers[ id ] );
					}
				}

				function restartWorkers()
				{
					debug( "Workers restart" );

					eachWorker( function ( worker : Worker )
					{
						worker.kill();
						cluster.fork();
					} );

				}

				// TODO
				// Any file change
				var timeOut;
				var filter = function ( pattern, fn )
				{
					return function ( filename )
					{
						if ( pattern.test( filename ) )
						{
							fn( filename );
						}
					}
				};

				watch( global.app_path(), filter( /\.js$|\.ts$/, ( file ) =>
				{
					if ( file )
					{
						clearTimeout( timeOut );

						var fileExt = file.substr( file.lastIndexOf( '.' ) + 1 );
						if ( fileExt !== 'js' && fileExt !== 'ts' )
							return;

						debug( ' filename provided: ' + file );

						timeOut = setTimeout( restartWorkers, 2300 );
					}
				} ) );

				/*                cluster.on('exit', function(deadWorker, code, signal)
				 {
				 // Restart the worker
				 var worker = cluster.fork();

				 // Note the process IDs
				 var newPID = worker.process.pid;
				 var oldPID = deadWorker.process.pid;

				 // Log the event
				 debug('worker '+oldPID+' died.');
				 debug('worker '+newPID+' born.');
				 });*/

			}
			else
			{
				/**
				 * Model sync
				 * http://docs.sequelizejs.com/en/1.7.0/articles/heroku/
				 */
				this.app.sequelize.sync().then( function ()
				{

					/**
					 * Create HTTP server.
					 */
					callFunction();
				} );

				debug( 'Worker %d running!', cluster.worker.id );

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
				this.app.set( 'port', this.normalizePort( process.env.PORT_HTTP ) );

			var server = http.createServer( this.app );

			this.serveSocket( server );
			this.serveListen( server, process.env.PORT_HTTP )
		}

		public serveHttps()
		{
			if ( !!process.env.FORCE_HTTPS )
				this.app.set( 'port', this.normalizePort( process.env.PORT_HTTPS ) );

			var server = https.createServer( this.options.https, this.app );

			this.serveSocket( server );
			this.serveListen( server, process.env.PORT_HTTPS )
		}

		public serveSpdy()
		{
			if ( !!process.env.FORCE_HTTPS )
				this.app.set( 'port', this.normalizePort( process.env.PORT_HTTPS ) );

			var server = spdy.createServer( this.options.https, this.app );

			this.serveSocket( server );
			this.serveListen( server, process.env.PORT_HTTPS )
		};

		private serveSocket( server )
		{
			var io = require( 'socket.io' ).listen( server );

			io.adapter( socketIOAdapter( {
				host : process.env.REDIS_HOST,
				port : process.env.REDIS_PORT
			} ) );

			//parse the "/" namespace
			io.use( socketSession.parser );

			this.onSocketEvents( io );


			// Module sockets reading
			try
			{
				traverse( this.appGlobal.App.Http.Sockets ).forEach( function ( httpSocket, key )
				{
					if ( typeof httpSocket == "function" )
					{
						httpSocket( io );
					}
				} );

			}
			catch ( ex )
			{
			}

		}

		private serveListen( server, port )
		{
			//
			server.listen( port );
			server.on( 'error', () =>
			{
				this.onServeError( server, port );
			} );
			server.on( 'listening', () =>
			{
				this.onServeListening( server, port );
			} );
		}

		private normalizePort( val ) : any
		{
			var port = parseInt( val, 10 );

			if ( isNaN( port ) )
			{
				// named pipe
				return val;
			}

			if ( port >= 0 )
			{
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
			debug( 'Listening on ' + bind );
		}

		private onServeError( error, port )
		{
			if ( error.syscall !== 'listen' )
			{
				throw error;
			}

			var bind = typeof port === 'string'
				? 'Pipe ' + port
				: 'Port ' + port;

			// handle specific listen errors with friendly messages
			switch ( error.code )
			{
				case 'EACCES':
					console.error( bind + ' requires elevated privileges' );
					process.exit( 1 );
					break;
				case 'EADDRINUSE':
					console.error( bind + ' is already in use' );
					process.exit( 1 );
					break;
				default:
					throw error;
			}
		}

		private onSocketEvents( io )
		{

			io.sockets.on( "connection", function ( socket )
			{
				debug( 'Connection made. socket.id=' + socket.id + ' . pid = ' + process.pid );
			} );

			io.on( 'disconnect', function ( socket )
			{
				debug( 'Lost a socket. socket.id=' + socket.id + ' . pid = ' + process.pid );
			} );

		}
	}
}