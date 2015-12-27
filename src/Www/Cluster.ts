///<reference path='../../typings/tsd.d.ts'/>

//import {Worker} from "Cluster";
import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

var cluster : any = require('cluster');
var watch	: any = require( 'node-watch' );

var debug = require( 'debug' )( 'express-go:Www.Cluster' );


export namespace Www
{
	export class Cluster
	{
		private app;

		constructor( app : any )
		{
			debug( "Initializing" );

			this.app = app;
		}

		public createCluster( callFunction : any )
		{
			debug( "Create Cluster" );

			// Master cluster
			if ( cluster.isMaster )
			{
				/**
				 * Fork process.
				 */
				debug( 'start cluster with %s workers', process.env.WORKERS );

				for ( var i = 0; i < process.env.WORKERS; i++ )
				{
					var worker : any = cluster.fork();
					debug( 'worker %s started.', worker.process.pid );
				}

				/**
				 * Restart process.
				 */
				cluster.on( 'death', function ( worker : any )
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

					eachWorker( function ( worker : any )
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
					};
				};

				watch( global.app_path(), filter( /\.js$|\.ts$/, ( file ) =>
				{
					if ( file )
					{
						clearTimeout( timeOut );

						var fileExt = file.substr( file.lastIndexOf( '.' ) + 1 );
						if ( fileExt !== "js" && fileExt !== "ts" )
							return;

						debug( " filename provided: " + file );

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

				debug( "Worker %d running!", cluster.worker.id );

			}
		}
	}
}