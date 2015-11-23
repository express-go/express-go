///<reference path='./../typings/tsd.d.ts'/>
import general = require('./autoloader');

declare function public_path( path? : string );
declare function views_path( path? : string );

/**
 * Views SWIG template engine
 *
 * http://paularmstrong.github.io/swig/docs/#express
 */

var fs   = require('fs');
//var hbs  = require('express-hbs');
var hbs  = require('express-handlebars');

module.exports = function(app)
{
    // Use `.hbs` for extensions and find partials in `views/partials`.
    /*app.engine('hbs', hbs.express4({
        //partialsDir   : views_path('partials'),
        //layoutsDir    : views_path('layouts'),
        //defaultLayout : views_path('layouts/default'),
        //i18n          : app.i18n,
        beautify      : 'development' === app.get('env')
    }));*/

    /*app.engine('hbs', hbs({
        defaultLayout: 'default',
        extname: '.hbs'
    }));*/

    // Assets helper
    /*hbs.registerHelper('assetPath', function(text, options)
    {
        // read in our manifest file
        var manifest = JSON.parse(
            fs.readFileSync( public_path('assets/build/rev-manifest.json'), 'utf8' )
        );

        return ['/assets/build', manifest[text]].join('/');
    });

    // register hbs helpers in res.locals' context which provides this.locale
    hbs.registerHelper('__', function () {
        return _t.apply(this, arguments);
    });
    hbs.registerHelper('t', function () {
        return _t.apply(this, arguments);
    });*/

};