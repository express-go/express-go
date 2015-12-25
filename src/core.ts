///<reference path='./typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>

import {ExpressGoGlobal} from "./typings/express-go";
declare var global : ExpressGoGlobal;

var debug = require( "debug" )( "express-go:Core" );
var Boot  = require( "./Boot/Boot" ).Boot;


class Core
{
	constructor( appGlobal : any, userApp? : Express.Application )
	{
		debug( "Initializing Core" );

		return new Boot.Init( appGlobal );
	}

}

module.exports = Core;