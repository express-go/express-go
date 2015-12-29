///<reference path="../../typings/tsd.d.ts"/>

import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

let fs		: any = require( "fs" );
let path    : any = require( "path" );
let http    : any = require( "http" );
let https   : any = require( "https" );
let spdy    : any = require( "spdy" );

let debug = require( "debug" )( "express-go:Www.Server " );


export namespace Www
{
	export class Server
	{
		private _app		 : any;
		private _serverHttp	 : any;
		private _serverHttps : any;
		private _serverSpdy	 : any;

		private options		 : any;


		constructor( app : any )
		{
			debug( "Initializing" );

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
						//protocols: [ "h2", "spdy/3.1", ..., "http/1.1" ],
						plain : false,

						connection : {
							windowSize : 1024 * 1024, // Server"s window size

							// **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
							autoSpdy31 : false,
						},
					},
				},
			};

		}

		/**
		 * Automatic Server creator
		 */
		public createAuto( socket? : any )
		{
			if ( socket )
			{
				debug( "Create AUTO server with Socket" );

				if ( !!process.env.PORT_HTTP )
				{
					socket.attachSocket( this.createHttp() );
				}

				if ( !!process.env.PORT_HTTPS )
				{
					if ( !!process.env.SPDY_HTTPS )
					{
						socket.attachSocket( this.createSpdy() );

					} else
					{
						socket.attachSocket( this.createHttps() );
					}

				}

			} else
			{
				debug( "Create AUTO server" );

				if ( !!process.env.PORT_HTTP )
				{
					this.createHttp();
				}

				if ( !!process.env.PORT_HTTPS )
				{
					if ( !!process.env.SPDY_HTTPS )
					{
						this.createSpdy();

					} else
					{
						this.createHttps();
					}

				}

			}

		}

		/**
		 * Server HTTP
		 */
		public createHttp() : any
		{
			debug( "Create HTTP server" );

			this._serverHttp = http.createServer( this._app );
			this._serverHttp = this._serverListen( this._serverHttp, process.env.PORT_HTTP );

			return this._serverHttp;
		}

		/**
		 * Server HTTPS
		 */
		public createHttps() : any
		{
			debug( "Create HTTPS server" );

			this._serverHttps = https.createServer( this.options.https, this._app );
			this._serverHttps = this._serverListen( this._serverHttps, process.env.PORT_HTTPS );

			return this._serverHttps;
		}

		/**
		 * Server SPDY
		 */
		public createSpdy() : any
		{
			debug( "Create SPDY server" );

			this._serverSpdy = spdy.createServer( this.options.https, this._app );
			this._serverSpdy = this._serverListen( this._serverSpdy, process.env.PORT_HTTPS );

			return this._serverSpdy;
		}

		/**
		 * Normalize port number
		 *
		 * @param val
		 * @returns {any}
		 */
		public normalizePort( val : any ) : number
		{
			let port : number = parseInt( val, 10 );

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
		 * @returns {any}
		 * @private
		 */
		private _serverListen( server : any, port : number ) : any
		{
			//
			server.listen( port );

			server.on( "error", ( error ) =>
			{
				this._onServerError( error, port );
			} );

			server.on( "listening", () =>
			{
				this._onServerListening( server, port );
			} );

			return server;

		}

		private _onServerError( error : any, port : number ) : void
		{
			if ( error.syscall !== "listen" )
			{
				throw error;
			}

			let bind : string = typeof port === "string"
				? "Pipe " + port
				: "Port " + port;

			// handle specific listen errors with friendly messages
			switch ( error.code )
			{
				case "EACCES":
					console.error( bind + " requires elevated privileges" );
					process.exit( 1 );

					break;

				case "EADDRINUSE":
					console.error( bind + " is already in use" );
					process.exit( 1 );

					break;

				default:
					throw error;
			}
		}

		private _onServerListening( server : any, port : number ) : void
		{
			let addr : any = server.address();
			let bind : string = typeof addr === "string"
				? "pipe " + addr
				: "port " + addr.port;

			debug( "Listening on " + bind );
		}

		public updateOptions( basePath )
		{
			// SSL
			this.options.https.cert = !!this.options.https.cert
				? this.options.https.cert
				: fs.readFileSync( basePath + "/" + process.env.SSL_CERT );

			this.options.https.ca = !!this.options.https.ca
				? this.options.https.ca
				: fs.readFileSync( basePath + "/" + process.env.SSL_CSR );

			this.options.https.key = !!this.options.https.key
				? this.options.https.key
				: fs.readFileSync( basePath + "/" + process.env.SSL_KEY );

		}

	}

}
