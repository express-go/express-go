///<reference path='../typings/tsd.d.ts'/>
///<reference path='Loader.ts'/>
var debug = require('debug')('express-go:Boot');
var Loader = require('./Loader').Boot.Loader;
var Boot;
(function (Boot) {
    var Main = (function () {
        function Main(app, appGlobal, modulePath) {
            debug("boot init");
            var load = new Loader(app, appGlobal, modulePath);
            load.setComponents({
                "Configs": true,
                "Translations": true,
                "Models": true,
                "Views": true,
                "Controllers": true,
                "Middlewares": true,
                "Routes": true,
                "Sockets": false
            });
            load.bootComponents();
            load.loadComponents();
        }
        return Main;
    })();
    Boot.Main = Main;
})(Boot = exports.Boot || (exports.Boot = {}));
