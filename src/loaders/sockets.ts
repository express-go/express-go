///<reference path='./../typings/tsd.d.ts'/>
import general = require('./autoloader');

declare function sockets_path( path? : string );

/**
 * Controller loader
 */
export module Core
{
    export module Loaders
    {
        export class Sockets
            extends general.Core.Loaders.Autoloader
            //implements general.AutoloaderInterface
        {
            public init()
            {
                this.load();
            }

            private load()
            {
                this.loadPath( sockets_path(), ["Http", "Sockets"] );
            }
        }
    }
}
