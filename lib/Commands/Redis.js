///<reference path="../../typings/tsd.d.ts"/>
var redis = require('redis'), redisClient = redis.createClient();
var Command = (function () {
    function Command() {
        //
    }
    Command.prototype.commands = function (app, cmd) {
        return {
            'redis': {
                'list': {
                    'description': "Listing redis keys",
                    'callMethod': function (cb) {
                        redisClient.keys('*', function (err, keys) {
                            if (err)
                                return console.log(err);
                            for (var i = 0, len = keys.length; i < len; i++) {
                                cmd.console(keys[i]);
                            }
                            cb();
                        });
                    }
                },
                'clear': {
                    'description': "Clear redis database keys",
                    'callMethod': function (cb) {
                        redisClient.flushdb(function (err, didSucceed) {
                            if (didSucceed) {
                                cmd.console("FlushDB ready!");
                            }
                            else {
                                cmd.console("FlushDB error!", err);
                            }
                            cb();
                        });
                    }
                }
            }
        };
    };
    return Command;
})();
module.exports.Command = Command;
