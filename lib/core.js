///<reference path='../typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>
var debug = require("debug")("express-go:Core");
var Boot = require("./Boot/Boot").Boot;
var Core = (function () {
    function Core(appGlobal, userApp) {
        debug("Initializing Core");
        return new Boot.Init(appGlobal);
    }
    return Core;
})();
module.exports = Core;
