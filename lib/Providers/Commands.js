///<reference path="../../typings/tsd.d.ts"/>
var exec = require('child_process').exec;
/**
 * Commands Provider
 */
var Provider = (function () {
    /**
     * Constructor
     */
    function Provider() {
        var _this = this;
        this._basePath = '';
        this._commands = {};
        this._instance = {};
        this.getCommands = function () {
            return _this._commands;
        };
        this._console = function (text, code) {
            console.log(text);
        };
        this._puts = function (error, stdout, stderr) {
            //
        };
        this._exec = function (command, callBack) {
            var tmp = exec(command, _this._puts);
            tmp.stdout.on('data', function (data) {
                _this._console(data);
            });
            tmp.on('exit', function (code) {
                _this._console('Exiting... ', code);
                callBack();
            });
        };
        this._execNode = function (command, parameter, callBack) {
            command = global.npm_path("/.bin/" + command);
            if (parameter) {
                command = "\"" + command + "\" " + parameter;
            }
            return _this._exec(command, callBack);
        };
        this._textTab = function (value, tabs) {
            tabs = !tabs ? 1 : tabs;
            // +2 length need "| "
            var needTabs = tabs - Math.floor((value.length + 3) / 8);
            //);
            for (var i = 0; i < needTabs; i++)
                value += "\t";
            return value;
        };
        this._lineTab = function (char, tabs) {
            tabs = !tabs ? 1 : tabs;
            tabs = tabs * 8 - 3;
            var value = '';
            for (var i = 0; i < tabs; i++)
                value += char;
            return value;
        };
        this._instance =
            {
                commands: this._commands,
                console: this._console,
                textTab: this._textTab,
                lineTab: this._lineTab,
                puts: this._puts,
                exec: this._exec,
                node: this._execNode
            };
    }
    /**
     * Prefix used name for components
     * Ex.: module.exports.prefix = {};
     *
     * Use "null" for disable
     *
     * @returns {string}
     */
    Provider.prototype.exportName = function () {
        return "Command";
    };
    /**
     * Load object into global namespace
     *
     * Use "false" for disable
     *
     * @returns {boolean}
     */
    Provider.prototype.exportNamespace = function () {
        return false;
    };
    /**
     * Register method
     *
     * @returns void
     */
    Provider.prototype.register = function () {
        //
    };
    /**
     * Boot method
     *
     * @param app
     * @returns void
     */
    Provider.prototype.boot = function (app) {
        //
        this._app = app;
    };
    /**
     * Loader method
     *
     * You can override default object initialization method
     *
     * @param loadObject
     * @param nameObject
     * @returns {any}
     */
    Provider.prototype.loader = function (loadObject, nameObject) {
        var commandObject;
        commandObject = typeof loadObject === "function"
            ? new loadObject(this._app, this._instance)
            : loadObject;
        this._commands = this._mergeObjectsRecursive(this._commands, commandObject);
        return commandObject;
    };
    Provider.prototype.setBasePath = function (basePath) {
        this._basePath = basePath;
    };
    Provider.prototype._mergeObjectsRecursive = function (targetObject, sourceObject) {
        for (var keyObject in sourceObject) {
            try {
                // Property in destination object set; update its value.
                if (sourceObject[keyObject].constructor === Object) {
                    targetObject[keyObject] = this._mergeObjectsRecursive(targetObject[keyObject], sourceObject[keyObject]);
                }
                else {
                    targetObject[keyObject] = sourceObject[keyObject];
                }
            }
            catch (err) {
                // Property in destination object not set; create it and set its value.
                targetObject[keyObject] = sourceObject[keyObject];
            }
        }
        return targetObject;
    };
    return Provider;
})();
exports.Provider = Provider;
