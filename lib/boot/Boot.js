///<reference path='../typings/tsd.d.ts'/>
///<reference path='Loader.ts'/>
var debug = require('debug')('express-go:Boot');
var Loader = require('./Loader').Boot.Loader;
var Boot;
(function (Boot) {
    var Main = (function () {
        function Main(app, appGlobal, modulePath) {
            debug("boot init");
            new Loader(app, appGlobal, modulePath);
        }
        return Main;
    })();
    Boot.Main = Main;
})(Boot = exports.Boot || (exports.Boot = {}));
