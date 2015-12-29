///<reference path="../../typings/tsd.d.ts"/>
var Command = (function () {
    function Command() {
        //
    }
    Command.prototype.commands = function (app, cmd) {
        return {
            'help': {
                'description': "Help function",
                'callMethod': function (cb) {
                    cmd.console(" | " + cmd.lineTab("-", 4) + " | " + cmd.lineTab("-", 4));
                    cmd.console(" | " + cmd.textTab("Command", 4) + " | " + cmd.textTab("Description"));
                    cmd.console(" | " + cmd.lineTab("-", 4) + " | " + cmd.lineTab("-", 4));
                    Object.keys(cmd.commands).forEach(function (masterKey) {
                        var masterVal = cmd.commands[masterKey];
                        if (typeof masterVal.callMethod == 'function') {
                            cmd.console(" | " + cmd.textTab(' ' + masterKey, 4) + " | " + cmd.textTab(masterVal.description));
                        }
                        else {
                            cmd.console(" | " + cmd.textTab('', 4) + " | ");
                            cmd.console(" | " + cmd.textTab('[' + masterKey + ']', 4) + " | ");
                            Object.keys(masterVal).forEach(function (slaveKey) {
                                var slaveVal = masterVal[slaveKey];
                                if (typeof slaveVal.callMethod == 'function')
                                    cmd.console(" | " + cmd.textTab(' ' + masterKey + ":" + slaveKey, 4) + " | " + cmd.textTab(slaveVal.description));
                            });
                        }
                    });
                    cmd.console(" | " + cmd.lineTab("-", 4) + "---" + cmd.lineTab("-", 4));
                    cb();
                }
            }
        };
    };
    return Command;
})();
module.exports.Command = Command;
