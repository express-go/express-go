///<reference path="../../typings/tsd.d.ts"/>

import {Worker} from "cluster";
import {ExpressGo} from "../../typings/express-go";
declare var global : ExpressGo.Global;

var cluster : any = require( "cluster" );
var watch : any   = require( "node-watch" );

var debug : any = require( "debug" )( "express-go:Www.Cluster" );


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

		public createCluster( callFunction : any ) : void
		{
			debug( "Create Cluster" );

			// Master cluster
			if ( cluster.isMaster )
			{
				/**
				 * Fork process.
				 */
				debug( "start cluster with %s workers", process.env.WORKERS );

				for ( var i = 0; i < process.env.WORKERS; i++ )
				{
					var worker : any = cluster.fork();
					debug( "worker %s started.", worker.process.pid );
				}

				/**
				 * Restart process.
				 */
				cluster.on( "death", this.onDeathWorker );
				cluster.on( "exit", this.onDeathWorker );

				this.watchChanges();

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

		// Go through all workers
		private eachWorkers( callback : any ) : void
		{
			var id;
			for ( id in cluster.workers )
			{
				callback( cluster.workers[ id ] );
			}
		}


		private restartWorkers() : void
		{
			debug( "Workers restart" );

			this.eachWorkers( function ( worker : any )
			{
				worker.kill();
				cluster.fork();
			} );

		}

		private onDeathWorker( worker : any, code : any, signal : any ) : void
		{
			debug( "worker %s died. restart...", worker.process.pid );
			cluster.fork();
		}

		private watchChanges() : void
		{

			// TODO
			// Any file change
			var timeOut : any;
			var filter = function ( pattern : any, fn : any )
			{
				return function ( filename : string )
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

					var fileExt = file.substr( file.lastIndexOf( "." ) + 1 );
					if ( fileExt !== "js" && fileExt !== "ts" )
					{
						return;
					}

					debug( " filename provided: " + file );

					timeOut = setTimeout( this.restartWorkers, 2300 );
				}
			} ) );

		}

	}

}
