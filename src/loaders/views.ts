///<reference path='./../typings/tsd.d.ts'/>
import general = require('./autoloader');

declare function public_path( path? : string );
declare function views_path( path? : string );

var fs    = require('fs');

/**
 * Controller loader
 */
export module Core
{
    export module Loaders
    {
        export class Views
        extends general.Core.Loaders.Autoloader
            //implements general.AutoloaderInterface
        {
            private engines : any =
            [
                'html',
                //'hbs',
                //'jade'
            ];

            public init( app : any )
            {
                this.load( app );
            }

            private load = ( app ) =>
            {
                // Load view engine
                require('./views_swig.ts')( app );
                //require('./views_hbs.ts')( app );

                // View default engine
                app.set(
                    'view engine',
                    this.engines.indexOf(process.env.VIEW_ENGINE) > -1
                        ? process.env.VIEW_ENGINE
                        : 'html'
                );

                // Views path
                this.setPaths( app );

                // Views cache
                this.setCache( app );

                // Assets
                app.locals.assetPath = function( text )
                {
                    // read in our manifest file
                    var manifest = JSON.parse(
                        fs.readFileSync( public_path('assets/build/rev-manifest.json'), 'utf8' )
                    );

                    return [ process.env.CDN_ASSETS + 'assets/build', manifest[text]].join('/');
                };

            };

            private setPaths( app )
            {
                // Get actual views path
                var tmpViews = app.get('views');
                var tmpPaths = [];
                if ( Array.isArray( tmpViews ) )
                {
                    tmpPaths = tmpViews;
                    tmpPaths.push( views_path() );
                }
                else if ( typeof tmpViews === "string" )
                {
                    tmpPaths.push( tmpViews );
                }
                else
                {
                    tmpPaths = [];
                    tmpPaths.push( views_path() );
                }

                if ( tmpPaths.indexOf( views_path() ) < 0 )
                    tmpPaths.push( views_path() );

                // Update Views path
                app.set('views', tmpPaths);

            }

            private setCache( app )
            {
                // Setup cache
                app.set(
                    'view cache',
                    !!process.env.VIEW_CACHE ? true : 'production' === app.get('env')
                );

            }
        }
    }
}
