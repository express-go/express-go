/**
 * WWW service of core package
 *
 * @param app
 */
module.exports = function( appBase, basePath, appGlobal, loadFromSource )
{
    if ( !!loadFromSource )
        var wwwObject = require("./src/www");
    else
        var wwwObject = require("./lib/www");


    return new wwwObject.Core.Www( appBase, basePath, appGlobal );

};