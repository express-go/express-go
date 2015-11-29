///<reference path='../typings/tsd.d.ts'/>
///<reference path='Loader.ts'/>

var debug  = require('debug')('express-go:Boot');

var Loader = require('./Loader.ts').Boot.Loader;

export module Boot
{
    export class Main
    {
        constructor( app, appGlobal, modulePath? )
        {
            debug("boot init");

            new Loader( app, appGlobal, modulePath );
        }
    }
}
