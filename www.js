/**
 * WWW service of core package
 *
 * @param app
 */
module.exports = function( appBase, basePath, appGlobal, loadFromSource )
{
    if ( !!loadFromSource )
        var wwwObject = require("./lib/www");
    else
        var wwwObject = require("./bin/www");


    return new wwwObject.Core.Www( appBase, basePath, appGlobal );

};