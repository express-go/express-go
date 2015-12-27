///<reference path='../typings/tsd.d.ts'/>

import {Worker} from "cluster";
import {ExpressGo} from "../typings/express-go";
declare var global : ExpressGo.Global;

var http     : any = require( 'http' );
var https    : any = require( 'https' );
var spdy     : any = require( 'spdy' );

var debug = require( 'debug' )( 'express-go:Www.Server' );


export namespace Www
{
	export class Server
	{
		private _app		 : any;
		private _serverHttp	 : any;
		private _serverHttps : any;

		private options		 : any;


		constructor( app : any )
		{
			this._app = app;

			// Environment correcting if need
			process.env.PORT_HTTP   = this.normalizePort( process.env.PORT_HTTP );
			process.env.PORT_HTTPS  = this.normalizePort( process.env.PORT_HTTPS );
			process.env.SPDY_HTTPS  = !!process.env.SPDY_HTTPS;
			process.env.FORCE_HTTPS = !!process.env.FORCE_HTTPS;

			// Options
			this.options =
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

		}

		/**
		 * Automatic Server creator
		 */
		public createAuto()
		{
			if ( !!process.env.PORT_HTTP )
				this.createHttp();

			if ( !!process.env.PORT_HTTPS )
			{
				if ( !!process.env.SPDY_HTTPS )
					this.createSpdy();
				else
					this.createHttps();
			}
		}

		/**
		 * Server HTTP
		 */
		public createHttp()
		{
			this._serverHttp = http.createServer( this._app );
			this._serverListen( this._serverHttp, process.env.PORT_HTTP );

//			if ( !process.env.FORCE_HTTPS )
//				this._app.set( 'port', this.normalizePort( process.env.PORT_HTTP ) );

			//this._serveSocket( server );
			//this._serveListen( server, process.env.PORT_HTTP )
		}

		/**
		 * Server HTTPS
		 */
		public createHttps()
		{
			this._serverHttps = https.createServer( this.options.https, this._app );
			this._serverListen( this._serverHttps, process.env.PORT_HTTPS );

/*			if ( !!process.env.FORCE_HTTPS )
				this.app.set( 'port', this.normalizePort( process.env.PORT_HTTPS ) );

			var server = https.createServer( this.options.https, this.app );

			this.serveSocket( server );
			this.serveListen( server, process.env.PORT_HTTPS )*/
		}

		/**
		 * Server SPDY
		 */
		public createSpdy()
		{
			this._serverHttps = spdy.createServer( this.options.https, this._app );
			this._serverListen( this._serverHttps, process.env.PORT_HTTPS );



/*			if ( !!process.env.FORCE_HTTPS )
				this.app.set( 'port', this.normalizePort( process.env.PORT_HTTPS ) );

			var server = spdy.createServer( this.options.https, this.app );

			this.serveSocket( server );
			this.serveListen( server, process.env.PORT_HTTPS )*/
		}

		/**
		 * Normalize port number
		 *
		 * @param val
		 * @returns {any}
		 */
		public normalizePort( val : any ) : number
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

			return null;
		}

		/**
		 * Listening server creator
		 *
		 * @param server
		 * @param port
		 */
		private _serverListen( server : any, port : number ) : void
		{
			//
			server.listen( port );

			server.on( 'error', ( error ) =>
			{
				this._onServerError( error, port );
			} );

			server.on( 'listening', () =>
			{
				this._onServerListening( server, port );
			} );

		}

		private _onServerError( error : any, port : number ) : void
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
				{
					console.error( bind + ' requires elevated privileges' );
					process.exit( 1 );

					break;
				}

				case 'EADDRINUSE':
				{
					console.error( bind + ' is already in use' );
					process.exit( 1 );

					break;
				}

				default:
					throw error;
			}
		}

		private _onServerListening( server : any, port : number ) : void
		{
			var addr = server.address();
			var bind = typeof addr === 'string'
				? 'pipe ' + addr
				: 'port ' + addr.port;

			debug( 'Listening on ' + bind );
		}

	}
}