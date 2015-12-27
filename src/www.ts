///<reference path='../typings/tsd.d.ts'/>

import {Worker} from "cluster";
import {ExpressGo} from "../typings/express-go";
declare var global : ExpressGo.Global;

var Cluster	: any = require( "./Www/Cluster" ).Www.Cluster;
var Server	: any = require( "./Www/Server" ).Www.Server;
var Socket	: any = require( "./Www/Socket" ).Www.Socket;

var debug = require( 'debug' )( 'express-go:Www' );


class Www
{
	private app		: any;
	private Cluster	: any;
	private Server	: any;
	private Socket	: any;

	constructor( appBase, basePath )
	{
		this.app       = appBase;

		this.Cluster= new Cluster( appBase );
		this.Server	= new Server ( appBase );
		this.Socket = new Socket ( appBase );

		this.Server.updateOptions( basePath );

	}

	/**
	 * Cluster service start
	 *
	 * @param callFunction
	 */
	public serveCluster = ( callFunction ) =>
	{
		this.Cluster.createCluster( callFunction );
	};


	/**
	 * Automatic service start
	 * HTTP / HTTPS | SPDY
	 */
	public serveService()
	{
		this.Server.createAuto(
			this.Socket
		);
	}


	/**
	 * HTTP service start
	 */
	public serveHttp()
	{
		this.Socket.attachSocket
		(
			this.Server.createHttp()
		);
	}


	/**
	 * HTTPS service start
	 */
	public serveHttps()
	{
		this.Socket.attachSocket
		(
			this.Server.createHttps()
		);
	}


	/**
	 * SPDY service start
	 */
	public serveSpdy()
	{
		this.Socket.attachSocket
		(
			this.Server.createSpdy()
		);
	}

}

module.exports = Www;