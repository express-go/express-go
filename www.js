/**
 * WWW service of core package
 *
 * @param app
 */
module.exports = function( appBase, basePath, appGlobal )
{
    var wwwObject = require("./src/www.ts");

    return new wwwObject.Core.Www( appBase, basePath, appGlobal );

};