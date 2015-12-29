/**
 * Command-line interface
 */
process.env.NODE_ENV = process.env.APP_ENV     || process.env.NODE_ENV;
process.env.DEBUG    = process.env.APP_DEBUG   || process.env.DEBUG;
process.env.DEBUG    = process.env.NODE_ENV == 'production' ? false : process.env.DEBUG;


module.exports = function( app, basePath, loadFromSource )
{
    if ( !!loadFromSource )
        var cliObject = require("./src/cli");
    else
        var cliObject = require("./lib/cli");


    return new cliObject( app, basePath );
};