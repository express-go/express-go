///<reference path='./typings/tsd.d.ts'/>
///<reference path='./bootstrap.ts'/>

module.exports = function( /*app : Express.Application,*/ appGlobal : any )
{
    var theApp = require("./express.ts");

    require("./bootstrap.ts")
        .Core.Bootstrap( theApp, appGlobal );

    return theApp;
};