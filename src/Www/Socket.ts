///<reference path='../../typings/tsd.d.ts'/>

import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

var socketIOAdapter : any = require( 'socket.io-redis' );
var socketServer	: any;

var debug = require( 'debug' )( 'express-go:Www.Socket ' );


export namespace Www
{
	export class Socket
	{
		private app : any;

		constructor( app : any )
		{
			debug( "Initializing" );

			this.app = app;
		}

		/**
		 * Socket.io service create
		 */
		private createSocket() : void
		{
			// Socket.IO instance
			if ( !socketServer )
			{
				debug( "Create Socket.IO server" );

				// Initializing server
				socketServer = require( "socket.io" )();

				// Disabled client service (included gulp package)
				socketServer.serveClient( false );

				// Redis connections
				socketServer.adapter( socketIOAdapter( {
					host : process.env.REDIS_HOST,
					port : process.env.REDIS_PORT
				} ) );

				// Socket events
				this.onSocketEvents( socketServer );

				// Booting Sockets loader
				this.app.io = socketServer;
				this.app.boot("Sockets", this.app );
				this.app.boot("Streams", this.app );

			}
		}

		/**
		 * Socket.io service attach to web-server
		 *
		 * @param server
		 */
		public attachSocket( server : any ) : void
		{
			// Create Socket.IO
			this.createSocket();

			debug( "Attach Socket.IO server" );

			// Attach Socket.IO to web server
			socketServer.attach( server );
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