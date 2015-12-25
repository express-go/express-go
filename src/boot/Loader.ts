///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>

import {ExpressGoGlobal} from "../typings/express-go";
declare var global : ExpressGoGlobal;

var fs	  = require( "fs" );
var glob  = require( "glob" );
var path  = require( "path" );
var debug = require( "debug" )( 'express-go:Boot.Loader' );

export namespace Boot
{
	export class Loader
	{
		constructor()
		{

		}

		public loadProvider()
		{

		}

		public loadApplication()
		{

		}

		public loadModules()
		{

		}

	}

}