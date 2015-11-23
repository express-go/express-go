///<reference path='./../typings/tsd.d.ts'/>
import general = require('./autoloader');

declare function lang_path( path? : string );
declare var global : any;

'use strict';

/**
 * Translations loader
 *
 * https://github.com/kimthangatm/node-js-z-i18n
 */

// Requires
var fs   = require('fs');
var glob = require("glob");
var redis = require('redis').createClient();
var i18n;
var languageRedisCache = 'LANGUAGE_CACHE_REDIS';

export module Core
{
    export module Loaders
    {
        export class Translations
        extends general.Core.Loaders.Autoloader
            //implements general.AutoloaderInterface
        {
            public init( app : any, global : any )
            {
                i18n = app.i18n;
                this.load();
                this.addMiddleware( app, global );
            }

            private load()
            {
                //this.loadPath( lang_path(), ["Resources", "lang"] );

                // Loading translations
                try
                {
                    if ( fs.statSync( lang_path() ) )
                    {
                        var files = glob.sync( lang_path("**/*.json") );
                        files.forEach(function( file )
                        {
                            var partials = file.split('.');
                            i18n.add(file, partials[ partials.length - 2 ]);
                        });
                    }
                } catch(ex) {}

            }

            private addMiddleware( app, global )
            {

//                return;

                // Init
                if (app.get('env') == 'development')
                {
                    app.use(function (req, res, next)
                    {
                        global.i18n = i18n;
                        global._t = i18n.__;

                        next();
                    });
                }
                else
                {
                    redis.get(languageRedisCache, function (error, result)
                    {
                        if (result == null)
                        {
                            global.i18n = i18n;
                            global._t = i18n.__;

                            redis.set(languageRedisCache, JSON.stringify(i18n.getTranslation()), redis.print);
                        }
                        else
                        {
                            i18n.setTranslation(result);
                            global.i18n = i18n;
                            global._t = i18n.__;
                        }

                    });
                }

                //app.i18n = i18n;
            }
        }
    }
}