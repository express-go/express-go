///<reference path='../typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>
var debug = require("debug")("express-go:Core");
var Boot = require("./Boot/Boot").Boot;
var readline = require('readline'), rl = readline.createInterface(process.stdin, process.stdout);
var Cli = (function () {
    function Cli(app, basePath) {
        debug("Initializing CLI");
        this.commands = app.provider("Commands").getCommands();
        this.start(app, basePath);
    }
    Cli.prototype.start = function (app, basePath) {
        var commands = this.commands;
        commands['help'].callMethod(function () {
            rl.setPrompt('APP> ');
            rl.prompt();
        });
        rl.on('line', function (line) {
            line = line.trim();
            var cmd = line.split(":");
            var masterCommand = cmd[0];
            var slaveCommand = cmd[1];
            if (commands[masterCommand] !== undefined) {
                if (typeof commands[masterCommand].callMethod == 'function')
                    commands[masterCommand].callMethod(function () {
                        rl.prompt();
                    });
                else {
                    if (commands[masterCommand][slaveCommand] !== undefined) {
                        if (typeof commands[masterCommand][slaveCommand].callMethod == 'function')
                            commands[masterCommand][slaveCommand].callMethod(function () {
                                rl.prompt();
                            });
                        else
                            commands['help'].callMethod(function () {
                                rl.prompt();
                            });
                    }
                    else {
                        console.log("Command list:");
                        console.log(Object.keys(commands[masterCommand]));
                        rl.prompt();
                    }
                }
            }
            else {
                console.log("Unknow command: " + line);
                console.log("Use \"help\" for listing commands.");
                rl.prompt();
            }
        }).on('close', function () {
            console.log('Have a great day!');
            process.exit(0);
        });
    };
    return Cli;
})();
module.exports = Cli;
