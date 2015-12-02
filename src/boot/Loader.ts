///<reference path='Boot.ts'/>

declare function app_path( path? : string );

var fs   = require("fs");
var glob = require("glob");
var path = require("path");
var debug  = require('debug')('express-go:Boot.Loader');

export namespace Boot
{
    export class Loader
    {
        private _components =
        {
            "Translations": null,
            "Models"      : null,
            "Views"       : null,
            "Controllers" : null,
            "Sockets"     : null,
            "Middlewares" : null,
            "Routes"      : null
        };

        private app      : any;
        private global   : any;
        private modulePath : string;

        constructor( app, appGlobal, modulePath? : string )
        {
            debug("Boot Loader init %s", modulePath || app_path());

            /*if ( modulePath )
            appGlobal.app_path = function( innerPath )
            {
                innerPath = typeof innerPath === 'string' ? innerPath : '';
                return path.dirname(modulePath) + '/' + innerPath;
            };*/

            this.app    = app;
            this.global = appGlobal;
            this.modulePath = modulePath;

            this.bootComponents();
            this.loadComponents();

            //console.log("AAAAAAAAA", this.global);
        }

        private bootComponents()
        {
            for ( var key in this._components )
            {
                var val = {
                    path     : __dirname + '/../loader/'+ key, //fs.realpathSync( __dirname + '/../loader/'+ key +'.ts'),
                    source   : null,
                    instance : null,
                    objects  : {}
                };
                //console.log(val.path);
                val.source   = require( val.path ).Loaders[ key ];
                val.instance = new val.source();

                val.instance.boot( this.app );

                this._components[key] = val;

                debug("Booted: %s", key);
            }
        }

        private loadComponents()
        {
            for ( var key in this._components )
            {
                debug("Load %s", key);

                var val = this._components[key];
                var loadPath = !!this.modulePath
                    ? this.modulePath + '/' + (!!val.instance.getLoadPath() ? val.instance.getLoadPath() : '')
                    : app_path()      + '/' + (!!val.instance.getLoadPath() ? val.instance.getLoadPath() : '');

                var files : any;

                debug("Load path: %s", loadPath);

                try
                {
                    if ( fs.statSync( loadPath ) )
                    {
                        var realPath = fs.realpathSync( loadPath );
                        files = this.readFilesByPostfix(
                            realPath,
                            val.instance.getLoadPostfix()
                        );
                    }

                } catch(e)
                {
                    files = [];
                }


                if ( files.length > 0 )
                {
                    files.forEach(( filePath ) =>
                    {
                        // Manual loader function
                        var tempObjects  = {};
                        var loadFunction = ( typeof val.instance.load === "function" )
                                ? val.instance.load( filePath )
                                : null;

                        // File path => namespace array
                        filePath = path.normalize( filePath );
                        var ns = filePath.replace( path.normalize( loadPath ), "");
                            ns = ns.replace(/\\\\|\\/g, '/');

                            debug("File path: %s", ns);

                            ns = ns.split("/");

                        // Filename parameters
                        var fileElem = ns[ ns.length - 1 ];
                        var fileExt  = fileElem.substr(fileElem.lastIndexOf('.') + 1);
                        var fileName = fileElem.substr(0, fileElem.indexOf('.'));

                        // File path => Class name
                        ns.pop();
                        ns.push(fileName);

                        // Loading objects
                        if ( !!loadFunction )
                        {
                            this.arrayToObject( ns, tempObjects, loadFunction );

                            debug("Loaded by loadFunction");
                        }
                        else if ( loadFunction !== false )
                        {
                            var tmpObject = require( filePath );
                                tmpObject = (typeof tmpObject === "function")
                                    ? tmpObject( this.app )
                                    : tmpObject;

                            this.arrayToObject( ns, tempObjects, tmpObject );

                            debug("Loaded by require");
                        }

                        this.MergeRecursive( val.objects, tempObjects );
                        this.MergeRecursive( this.global, val.objects )


                    });

                    this._components[key] = val;
                }
            }

            debug("Load ready!");
            //console.log("Boot Load", this._components.Models.objects);
            //console.log("Boot Load");
        }

        private readFilesByPostfix( loadPath : string, filePostfix : string )
        {
            try
            {
                    filePostfix = typeof filePostfix !== "string" ? '' : filePostfix;
                var globPath    = loadPath + "/**/*" + filePostfix + ".js";

                debug("Load glob: %s", globPath);

                return glob.sync( globPath );

            } catch(ex) {}

            return [];
        }

        private setNamespaces( object, namespaces, src )
        {

        }

        private readFilesByNamespace()
        {

        }

        private arrayToObject( array, object, value )
        {
            if ( typeof object[ array[0] ] == "undefined" )
            {
                var key = array[0];
                array.shift();


                if ( array.length == 0 )
                {
                    object[ key ] = value;
                    return;
                }

                object[ key ] = {};

                this.arrayToObject( array, object[ key ], value );
            }
        }

        /*
         * Recursively merge properties of two objects
         */
        private  MergeRecursive(obj1, obj2)
        {
            for (var p in obj2) {
                try {
                    // Property in destination object set; update its value.
                    if ( obj2[p].constructor==Object ) {
                        obj1[p] = this.MergeRecursive(obj1[p], obj2[p]);

                    } else {
                        obj1[p] = obj2[p];

                    }

                } catch(e) {
                    // Property in destination object not set; create it and set its value.
                    obj1[p] = obj2[p];

                }
            }

            return obj1;
        }

/*

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
                    if ( !this.isModule )
                        fs.watch(loadPath,  (event, file) =>
                        {
                            if (file)
                            {
                                var fileExt = file.substr(file.lastIndexOf('.') + 1);
                                if (fileExt !== 'js' && fileExt !== 'ts')
                                    return;

                                console.log(event + ' filename provided: ' + file);
                                readFiles();
                                //this.loadComponents( this.isModule );
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
*/
    }
}