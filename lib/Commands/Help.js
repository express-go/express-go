///<reference path="../../typings/tsd.d.ts"/>
var Command = (function () {
    function Command(app, cli) {
        return this.commands(app, cli);
    }
    Command.prototype.commands = function (app, cli) {
        return {
            'help': {
                'description': "Help function",
                'callMethod': function (cb) {
                    cli.console(" | " + cli.lineTab("-", 4) + " | " + cli.lineTab("-", 4));
                    cli.console(" | " + cli.textTab("Command", 4) + " | " + cli.textTab("Description"));
                    cli.console(" | " + cli.lineTab("-", 4) + " | " + cli.lineTab("-", 4));
                    Object.keys(cli.commands).forEach(function (masterKey) {
                        var masterVal = cli.commands[masterKey];
                        if (typeof masterVal.callMethod == 'function') {
                            cli.console(" | " + cli.textTab(' ' + masterKey, 4) + " | " + cli.textTab(masterVal.description));
                        }
                        else {
                            cli.console(" | " + cli.textTab('', 4) + " | ");
                            cli.console(" | " + cli.textTab('[' + masterKey + ']', 4) + " | ");
                            Object.keys(masterVal).forEach(function (slaveKey) {
                                var slaveVal = masterVal[slaveKey];
                                if (typeof slaveVal.callMethod == 'function')
                                    cli.console(" | " + cli.textTab(' ' + masterKey + ":" + slaveKey, 4) + " | " + cli.textTab(slaveVal.description));
                            });
                        }
                    });
                    cli.console(" | " + cli.lineTab("-", 4) + "---" + cli.lineTab("-", 4));
                    cb();
                }
            }
        };
    };
    return Command;
})();
module.exports.Command = Command;
