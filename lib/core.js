///<reference path='./typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>
var glob = require("glob");
var path = require("path");
var debug = require('debug')('express-go:core');
module.exports = function (/*app : Express.Application,*/ appGlobal) {
    global = appGlobal;
    debug("core initalizing");
    global.App = {};
    global.Modules = {};
    debug("Express initalizing");
    var theApp = require("./express");
    // Application boot
    debug("application booting");
    debug("boot path: %s", global.app_path());
    require("./boot/Boot").Boot.Main(theApp, global.App);
    // Modules boot
    debug("application modules booting");
    var files = glob.sync(global.app_modules("**/module-go.json"));
    files.forEach(function (file) {
        debug("boot module path: %s", path.dirname(file));
        var moduleName = path.dirname(file).replace(/\\\//g, "/").split('/').pop().toLowerCase();
        moduleName = moduleName.substring(0, 1).toUpperCase() + moduleName.substring(1).toLowerCase();
        debug("boot module : %s", moduleName);
        global.Modules[moduleName] = {};
        require("./boot/Boot").Boot.Main(theApp, global.Modules[moduleName], path.dirname(file));
    });
    // Modules boot from node_modules
    debug("application node_modules booting");
    var files = glob.sync(global.base_path("node_modules/**/module-go.json"));
    files.forEach(function (file) {
        debug("boot module path: %s", path.dirname(file));
        var moduleName = path.dirname(file).replace(/\\\//g, "/").split('/').pop().toLowerCase();
        moduleName = moduleName.substring(0, 1).toUpperCase() + moduleName.substring(1).toLowerCase();
        debug("boot module : %s", moduleName);
        global.Modules[moduleName] = {};
        require("./boot/Boot").Boot.Main(theApp, global.Modules[moduleName], path.dirname(file));
    });
    return theApp;
};
