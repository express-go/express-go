///<reference path='./typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>
var glob = require("glob");
var path = require("path");
var debug = require('debug')('express-go:core');
module.exports = function (/*app : Express.Application,*/ appGlobal) {
    debug("core initalizing");
    appGlobal.App = {};
    appGlobal.Modules = {};
    debug("Express initalizing");
    var theApp = require("./express");
    // Application boot
    debug("application booting");
    debug("boot path: %s", app_path());
    require("./boot/Boot").Boot.Main(theApp, appGlobal.App);
    // Modules boot
    debug("application modules booting");
    var files = glob.sync(app_modules("**/module.json"));
    files.forEach(function (file) {
        debug("boot module path: %s", path.dirname(file));
        var moduleName = path.dirname(file).replace(/\\\//g, "/").split('/').pop().toLowerCase();
        moduleName = moduleName.substring(0, 1).toUpperCase() + moduleName.substring(1).toLowerCase();
        debug("boot module : %s", moduleName);
        appGlobal.Modules[moduleName] = {};
        require("./boot/Boot").Boot.Main(theApp, appGlobal.Modules[moduleName], path.dirname(file));
    });
    return theApp;
};
