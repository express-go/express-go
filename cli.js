/**
 * Command-line interface
 */
process.env.NODE_ENV = process.env.APP_ENV     || process.env.NODE_ENV;
process.env.DEBUG    = process.env.APP_DEBUG   || process.env.DEBUG;
process.env.DEBUG    = process.env.NODE_ENV == 'production' ? false : process.env.DEBUG;

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
var exec = require('child_process').exec;
var sys = require('sys');
var redis = require('redis'),
    redisClient = redis.createClient();

var app;

module.exports = function( appBase, basePath )
{
    app = appBase;

    function puts(error, stdout, stderr) {
        //sys.puts(stdout)
    }


    function consoleLog( text )
    {
        console.log(/*'APP< ' + */text);
    }

    function formatTab( value, tabs )
    {
        tabs = !tabs ? 1 : tabs;

        // +2 length need "| "
        var needTabs =  parseInt(
            tabs - Math.floor((value.length + 3) / 8)
        );

        for( var i = 0; i < needTabs; i++ )
            value += "\t";

        return value;
    }

    function lineTab( char, tabs )
    {
        tabs = !tabs ? 1 : tabs;
        tabs = tabs * 8 - 3;

        var value = '';

        for( var i = 0; i < tabs; i++ )
            value += char;

        return value;
    }

    var commands =
    {
        'help'  : {
            'description' : "Help function",
            'callMethod'  : function(cb)
            {
                consoleLog( " | " + lineTab("-", 4) + " | " + lineTab("-", 4) );
                consoleLog( " | " + formatTab("Command", 4) + " | " + formatTab("Description") );
                consoleLog( " | " + lineTab("-", 4) + " | " + lineTab("-", 4) );

                Object.keys(commands).forEach(function(masterKey)
                {
                    var masterVal = commands[masterKey];

                    if ( typeof masterVal.callMethod == 'function' )
                    {
                        consoleLog( " | " + formatTab(' '+masterKey, 4) + " | " + formatTab(masterVal.description) );
                        //consoleLog( " | " + formatTab('', 4) + " | " );
                    }
                    else
                    {
                        consoleLog( " | " + formatTab('', 4) + " | " );
                        consoleLog( " | " + formatTab('[' + masterKey + ']', 4) + " | " );
                        Object.keys(masterVal).forEach(function(slaveKey)
                        {
                            var slaveVal = masterVal[slaveKey];

                            if ( typeof slaveVal.callMethod == 'function' )
                                consoleLog( " | " + formatTab(' '+masterKey + ":" + slaveKey, 4) + " | " + formatTab(slaveVal.description) );

                        });
                    }
                });
                consoleLog( " | " + lineTab("-", 4) + "---" + lineTab("-", 4) );

                cb();
            }
        },
        'gulp'  : {
            'start' : {
                'description': "Starting default gulp process (without fonts, fast)",
                'callMethod': function (cb) {
                    var tmp = exec("gulp", puts);
                    tmp.stdout.on('data', function (data) {
                        console.log(data);
                    });
                    tmp.on('exit', function (code) {
                        console.log('Exiting... ', code);
                        cb();
                    });
                }
            },
            'fonts' : {
                'description' : "Converting TTF fonts to webfonts",
                'callMethod'  : function(cb)
                {
                    var tmp = exec("gulp fonts", puts);
                    tmp.stdout.on('data', function(data) {
                        console.log(data);
                    });
                    tmp.on('exit', function (code) {
                        console.log('Exiting... ', code);
                        cb();
                    });
                }
            },
            'styles' : {
                'description' : "Converting styles",
                'callMethod'  : function(cb)
                {
                    var tmp = exec("gulp styles", puts);
                    tmp.stdout.on('data', function(data) {
                        console.log(data);
                    });
                    tmp.on('exit', function (code) {
                        console.log('Exiting... ', code);
                        cb();
                    });
                }
            },
            'scripts' : {
                'description' : "Converting scripts",
                'callMethod'  : function(cb)
                {
                    var tmp = exec("gulp scripts", puts);
                    tmp.stdout.on('data', function(data) {
                        console.log(data);
                    });
                    tmp.on('exit', function (code) {
                        console.log('Exiting... ', code);
                        cb();
                    });
                }
            },
            'watch' : {
                'description' : "Starting watch gulp process",
                'callMethod'  : function(cb)
                {
                    var tmp = exec("gulp watch", puts);
                    tmp.stdout.on('data', function(data) {
                        console.log(data);
                    });
                    tmp.on('exit', function (code) {
                        console.log('Exiting... ', code);
                        cb();
                    });
                }
            }
        },
        'gulps' : {
            'description' : "Alias of gulp:start (with fonts, slow)",
            'callMethod'  : function(cb)
            {
                var tmp = exec("gulp full", puts);
                tmp.stdout.on('data', function(data) {
                    console.log(data);
                });
                tmp.on('exit', function (code) {
                    console.log('Exiting... ', code);
                    cb();
                });
            }
        },
        'redis' : {
            'list' : {
                'description' : "Listing redis keys",
                'callMethod'  : function(cb)
                {
                    redisClient.keys('*', function (err, keys)
                    {
                        if (err) return console.log(err);

                        for(var i = 0, len = keys.length; i < len; i++)
                        {
                            console.log(keys[i]);
                        }

                        cb();
                    });
                }
            },
            'clear': {
                'description' : "Clear redis database keys",
                'callMethod'  : function(cb) {
                    redisClient.flushdb( function (err, didSucceed)
                    {
                        if ( didSucceed )
                            console.log("FlushDB ready!");
                        else
                            console.log("FlushDB error!", err);

                        cb();
                    });

                }
            }
        },
        'route' : {
            'list' : {
                'description' : "Listing routes",
                'callMethod'  : function(cb)
                {
                    consoleLog( " | " + lineTab("-", 8) + " | -" + lineTab("-", 1) + " | " + lineTab("-", 4) );
                    consoleLog( " | " + formatTab("Name", 8) + " | " + formatTab("Method", 1) + " | " + formatTab("Path") );
                    consoleLog( " | " + lineTab("-", 8) + " | -" + lineTab("-", 1) + " | " + lineTab("-", 4) );
                    Object.keys(app.namedRoutes.routesByNameAndMethod).forEach(function(routeName)
                    {
                        var routeVal = app.namedRoutes.routesByNameAndMethod[routeName];
                        Object.keys(routeVal).forEach(function(routeMethod)
                        {
                            var routeData = app.namedRoutes.routesByNameAndMethod[routeName][routeMethod];
                            consoleLog( " | " + formatTab(routeName, 8) + " | " + formatTab(routeMethod.toUpperCase(), 1) + "  | " + formatTab(routeData.path) )
                        });
                    });
                    consoleLog( " | " + lineTab("-", 8) + "---" + lineTab("-", 1) + "---" + lineTab("-", 4) );

                    cb();
                }
            }
        },
        'routes' : {
            'description' : "Alias of route:list",
            'callMethod'  : function(cb)
            {
                commands['route']['list'].callMethod(cb);
            }
        },
        /*'middleware' : {
         'description' : "",
         'callMethod'  : function(cb) {cb();}
         },*/
        /*'controller' : {
         'description' : "",
         'callMethod'  : function(cb) {cb();}
         },*/
        'update' :
        {
            'npm' : {
                'description' : "Npm components update",
                'callMethod'  : function(cb)
                {
                    var tmp = exec("npm update", puts);
                    tmp.stdout.on('data', function(data) {
                        console.log(data);
                    });
                    tmp.on('exit', function (code) {
                        console.log('Exiting... ', code);
                        cb();
                    });
                }
            },
            'bower' : {
                'description' : "Bower components update",
                'callMethod'  : function(cb)
                {
                    var tmp = exec('"'+basePath+'/./node_modules/.bin/bower" update', puts);
                    tmp.stdout.on('data', function(data) {
                        console.log(data);
                    });
                    tmp.on('exit', function (code) {
                        console.log('Exiting... ', code);
                        cb();
                    });
                }
            },
            'gulp' : {
                'description' : "Gulp assets and bower components",
                'callMethod'  : function(cb)
                {
                    var tmp = exec('"'+basePath+'/./node_modules/.bin/gulp"', puts);
                    tmp.stdout.on('data', function(data) {
                        console.log(data);
                    });
                    tmp.on('exit', function (code) {
                        console.log('Exiting... ', code);
                        cb();
                    });
                }
            },
            /*'tsd' : {
             'description' : "Typescript definitions",
             'callMethod'  : function(cb)
             {
             var tmp = exec('"./node_modules/.bin/tsd" update -os', puts);
             tmp.stdout.on('data', function(data) {
             console.log(data);
             });
             tmp.on('exit', function (code) {
             console.log('Exiting... ', code);
             cb();
             });
             }
             }*/
        },
        'updates' :
        {
            'description' : "All components update",
            'callMethod'  : function(cb)
            {
                commands['update']['npm'].callMethod(function(){
                    commands['update']['bower'].callMethod(function(){
                        commands['update']['gulp'].callMethod(function () {
                            cb();
                            //commands['update']['tsd'].callMethod(function () {
                            //    cb
                            //});
                        });
                    });
                });
            }
        }
    };

    commands['help'].callMethod(function(){
        rl.setPrompt('APP> ');
        rl.prompt();
    });


    rl.on('line', function(line)
    {
        line = line.trim();
        var cmd = line.split(":");

        var masterCommand = cmd[0];
        var slaveCommand  = cmd[1];

        if ( commands[masterCommand] !== undefined )
        {
            if ( typeof commands[masterCommand].callMethod == 'function' )
                commands[masterCommand].callMethod(function(){
                    rl.prompt();
                });
            else
            {
                if ( commands[masterCommand][slaveCommand] !== undefined )
                {
                    if ( typeof commands[masterCommand][slaveCommand].callMethod == 'function' )
                        commands[masterCommand][slaveCommand].callMethod(function(){
                            rl.prompt();
                        });
                    else
                        commands['help'].callMethod(function(){
                            rl.prompt();
                        });
                }
                else
                {
                    consoleLog("Command list:");
                    console.log(Object.keys(commands[masterCommand]));
                    rl.prompt();
                }
            }
        }
        else
        {
            console.log("Unknow command: " + line);
            console.log("Use \"help\" for listing commands.");
            rl.prompt();
        }




    }).on('close', function() {
        console.log('Have a great day!');
        process.exit(0);
    });
}