///<reference path="../../typings/tsd.d.ts"/>
var Command = (function () {
    function Command(app, cli) {
        return this.commands(app, cli);
    }
    Command.prototype.commands = function (app, cli) {
        return {
            'route': {
                'list': {
                    'description': "Listing routes",
                    'callMethod': function (cb) {
                        cli.console(" | " + cli.lineTab("-", 8) + " | -" + cli.lineTab("-", 1) + " | " + cli.lineTab("-", 4));
                        cli.console(" | " + cli.textTab("Name", 8) + " | " + cli.textTab("Method", 1) + " | " + cli.textTab("Path"));
                        cli.console(" | " + cli.lineTab("-", 8) + " | -" + cli.lineTab("-", 1) + " | " + cli.lineTab("-", 4));
                        Object.keys(app.namedRoutes.routesByNameAndMethod).forEach(function (routeName) {
                            var routeVal = app.namedRoutes.routesByNameAndMethod[routeName];
                            Object.keys(routeVal).forEach(function (routeMethod) {
                                var routeData = app.namedRoutes.routesByNameAndMethod[routeName][routeMethod];
                                cli.console(" | " + cli.textTab(routeName, 8) + " | " + cli.textTab(routeMethod.toUpperCase(), 1) + "  | " + cli.textTab(routeData.path));
                            });
                        });
                        cli.console(" | " + cli.lineTab("-", 8) + "---" + cli.lineTab("-", 1) + "---" + cli.lineTab("-", 4));
                        cb();
                    }
                }
            },
            'routes': {
                'description': "Alias of route:list",
                'callMethod': function (cb) {
                    cli.commands['route']['list'].callMethod(cb);
                }
            }
        };
    };
    return Command;
})();
module.exports.Command = Command;
