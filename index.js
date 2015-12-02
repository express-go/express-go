/**
 * Index of core package
 *
 * @param app
 */
module.exports = function( appGlobal, loadFromSource )
{
    if ( !!loadFromSource )
        return require("./src/core")( appGlobal );

    return require("./bin/core")( appGlobal );
};