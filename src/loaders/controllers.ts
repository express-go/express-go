///<reference path='./../typings/tsd.d.ts'/>
import general = require('./autoloader');

declare function controllers_path( path? : string );

/**
 * Controller loader
 */
export module Core
{
    export module Loaders
    {
        export class Controllers
            extends general.Core.Loaders.Autoloader
            //implements general.AutoloaderInterface
        {
            public init()
            {
                this.load();
            }

            private load()
            {
                this.loadPath( controllers_path(), ["Http", "Controllers"] );
            }
        }
    }
}
