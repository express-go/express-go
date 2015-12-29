///<reference path='../typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>

import {ExpressGo} from "../typings/express-go";
declare var global : ExpressGo.Global;

let debug : any = require( "debug" )( "express-go:Core" );
let Boot  : any = require( "./Boot/Boot" ).Boot;


class Core
{
	constructor( appGlobal : any, userApp? : Express.Application )
	{
		debug( "Initializing Core" );

		return new Boot.Init( appGlobal );
	}

}

module.exports = Core;
