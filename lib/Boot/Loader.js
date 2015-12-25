///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var debug = require("debug")('express-go:Boot.Loader');
var Boot;
(function (Boot) {
    var Loader = (function () {
        function Loader() {
        }
        Loader.prototype.loadProvider = function () {
        };
        Loader.prototype.loadApplication = function () {
        };
        Loader.prototype.loadModules = function () {
        };
        return Loader;
    })();
    Boot.Loader = Loader;
})(Boot = exports.Boot || (exports.Boot = {}));
