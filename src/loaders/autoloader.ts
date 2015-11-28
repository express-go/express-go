///<reference path='./../typings/tsd.d.ts'/>

/**
 * Controller loader
 */
var fs = require("fs");

export interface AutoloaderInterface
{
    init( app? ) : void;
    load( app? ) : void;
}


export module Core
{
    export module Loaders
    {
        export class Autoloader
        {
            app : any;
            isModule : boolean;
            loadComponents : any;
            loadOverrideCb : any;

            constructor( app : any, isModule? : boolean, loadComponents? : any )
            {
                this.app = app;
                this.isModule = isModule;
                this.loadComponents = loadComponents;
            }

            public loadOverride( callBack : any )
            {
                this.loadOverrideCb = callBack;
                return this;
            }

            public loadPath( loadPath: string, namespaces: any, paramObject? : any )
            {
                // Module prefix
                if ( this.isModule )
                    namespaces = ["Modules"].concat(namespaces);

                // Reading controllers
                try
                {
                    if ( fs.statSync( loadPath ) )
                    {
                        var readFiles = () =>
                        {
                            fs.readdirSync( loadPath ).forEach((file) =>
                            {
                                var fileExt = file.substr(file.lastIndexOf('.') + 1);
                                if (fileExt !== 'js' && fileExt !== 'ts')
                                    return;

                                var name = file.substr(0, file.indexOf('.'));

                                if ( typeof this.loadOverrideCb == "function")
                                {
                                        this.app.addObject( namespaces.concat([name]), this.loadOverrideCb( loadPath + '/' + file ) );
                                }
                                else
                                {
                                    if ( paramObject )
                                        this.app.addObject( namespaces.concat([name]), require( loadPath + '/' + file )( paramObject ) );
                                    else
                                        this.app.addObject( namespaces.concat([name]), require( loadPath + '/' + file ) );
                                }


                            });

                            //console.log(this.app);
                        };
                        readFiles();

                        // TODO
                        // Any file change
                        fs.watch(loadPath,  (event, file) =>
                        {
                            if (file)
                            {
                                var fileExt = file.substr(file.lastIndexOf('.') + 1);
                                if (fileExt !== 'js' && fileExt !== 'ts')
                                    return;

                                console.log(event + ' filename provided: ' + file);
                                this.loadComponents( this.isModule );
                            }
                            else {
                                //console.log(event + ' filename not provided');
                            }
                        });
                    }

                } catch(ex) {
                    //console.log("+++HOPPP");
                    //console.log(ex);
                    //console.log("---HOPPP");
                    //process.exit();
                }

            }

            private createObjectNamespace()
            {

            }

            private loadObjectNamespace()
            {

            }
        }
    }
}
