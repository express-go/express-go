/**
 * Express-go declarations
 */
declare var global : any;

export interface LoaderInterface
{
    boot( app : any ) : void;
    load( loadObject? : any ) : any;
    getLoadPath() : string;
    getLoadNamespace() : any;
}


declare function app_modules( path? : string );
declare function controllers_path( path? : string );