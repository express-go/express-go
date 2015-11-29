///<reference path='./typings/tsd.d.ts'/>
///<reference path='./bootstrap.ts'/>
///<reference path='./boot/Boot.ts'/>

//import general = require("./boot/Boot.ts");

var glob  = require("glob");
var path  = require("path");
var debug = require('debug')('express-go:core');

//declare var global : any;
declare function app_modules( path? : string );
declare function app_path(path? : string );

module.exports = function( /*app : Express.Application,*/ appGlobal : any )
{
    debug("core initalizing");
    appGlobal.App     = {};
    appGlobal.Modules = {};


    debug("Express initalizing");
    var theApp = require("./express.ts");


    // Application boot
    debug("application booting");
    debug("boot path: %s", app_path());
    require("./boot/Boot.ts").Boot.Main( theApp, appGlobal.App );


    // Modules boot
    debug("application modules booting");
    var orgAppPath = appGlobal.app_path;
    var files = glob.sync( app_modules("**/module.json") );

    files.forEach(( file ) =>
    {
/*
        console.log("+++", file);
        // Overwiting application path for modules loading
        appGlobal.app_path = function( innerPath )
        {
            innerPath = typeof innerPath === 'string' ? innerPath : '';
            return path.dirname(file) + '/' + innerPath;
        };
*/


        debug("boot path: %s", path.dirname(file));

        require("./boot/Boot.ts").Boot.Main( theApp, appGlobal.Modules, path.dirname(file) );

    });

    appGlobal.app_path = orgAppPath;



//    console.log(require("./boot/Boot.ts").Boot());
//    require("./boot/Boot.ts").Boot( theApp );

    //require("./ExpressGo.ts").Main( theApp );
    //process.exit();

    //console.log(require("./boot/boot.ts"));

    //require("./boot/boot.ts")
//        .Boot( theApp );

    //require("./boot/boot.ts")
//        .Core.Boot.Boot( theApp );

    //require("./bootstrap.ts")
        //.Core.Bootstrap( theApp, appGlobal );

    return theApp;
};