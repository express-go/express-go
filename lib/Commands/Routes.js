///<reference path="../../typings/tsd.d.ts"/>
var Command = (function () {
    function Command() {
        //
    }
    Command.prototype.commands = function (app, cmd) {
        return {
            'route': {
                'list': {
                    'description': "Listing routes",
                    'callMethod': function (cb) {
                        cmd.console(" | " + cmd.lineTab("-", 8) + " | -" + cmd.lineTab("-", 1) + " | " + cmd.lineTab("-", 4));
                        cmd.console(" | " + cmd.textTab("Name", 8) + " | " + cmd.textTab("Method", 1) + " | " + cmd.textTab("Path"));
                        cmd.console(" | " + cmd.lineTab("-", 8) + " | -" + cmd.lineTab("-", 1) + " | " + cmd.lineTab("-", 4));
                        Object.keys(app.namedRoutes.routesByNameAndMethod).forEach(function (routeName) {
                            var routeVal = app.namedRoutes.routesByNameAndMethod[routeName];
                            Object.keys(routeVal).forEach(function (routeMethod) {
                                var routeData = app.namedRoutes.routesByNameAndMethod[routeName][routeMethod];
                                cmd.console(" | " + cmd.textTab(routeName, 8) + " | " + cmd.textTab(routeMethod.toUpperCase(), 1) + "  | " + cmd.textTab(routeData.path));
                            });
                        });
                        cmd.console(" | " + cmd.lineTab("-", 8) + "---" + cmd.lineTab("-", 1) + "---" + cmd.lineTab("-", 4));
                        cb();
                    }
                }
            },
            'routes': {
                'description': "Alias of route:list",
                'callMethod': function (cb) {
                    cmd.commands['route']['list'].callMethod(cb);
                }
            }
        };
    };
    return Command;
})();
module.exports.Command = Command;
