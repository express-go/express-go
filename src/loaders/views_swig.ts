///<reference path='./../typings/tsd.d.ts'/>
import general = require('./autoloader');

declare function public_path( path? : string );
declare function views_path( path? : string );

/**
 * Views SWIG template engine
 *
 * http://paularmstrong.github.io/swig/docs/#express
 */

var fs    = require('fs');
var swig  = require('swig');
var redis = require('redis').createClient();

module.exports = function(app)
{
    // Use `.html` for extensions and find partials in `views/partials`.
    app.engine('html', swig.renderFile);

    // Swig will cache templates for you, but you can disable
    // that and use Express's caching instead, if you like:
    app.set('view cache', 'production' === app.get('env'));

    // Cache
    swig.setDefaults({
        cache: ('production' === app.get('env') ? 'memory' : false)
    });

    /*swig.setDefaults({
     cache: ('production' === app.get('env') ?
     {
     get: function (key) {

     },
     set: function (key, val) {

     }
     } : false)
     });*/

};