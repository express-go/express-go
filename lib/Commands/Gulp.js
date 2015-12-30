///<reference path="../../typings/tsd.d.ts"/>
var Command = (function () {
    function Command(app, cli) {
        return this.commands(app, cli);
    }
    Command.prototype.commands = function (app, cli) {
        return {
            'gulp': {
                'start': {
                    'description': "Starting default gulp process (without fonts, fast)",
                    'callMethod': function (cb) {
                        cli.node("gulp", null, cb);
                    }
                },
                'fonts': {
                    'description': "Converting TTF fonts to webfonts",
                    'callMethod': function (cb) {
                        cli.node("gulp", "fonts", cb);
                    }
                },
                'styles': {
                    'description': "Converting styles",
                    'callMethod': function (cb) {
                        cli.node("gulp", "styles", cb);
                    }
                },
                'scripts': {
                    'description': "Converting scripts",
                    'callMethod': function (cb) {
                        cli.node("gulp", "scripts", cb);
                    }
                },
                'watch': {
                    'description': "Starting watch gulp process",
                    'callMethod': function (cb) {
                        cli.node("gulp", "watch", cb);
                    }
                }
            },
            'gulps': {
                'description': "Alias of gulp:start (with fonts, slow)",
                'callMethod': function (cb) {
                    cli.node("gulp", null, cb);
                }
            }
        };
    };
    return Command;
})();
module.exports.Command = Command;
