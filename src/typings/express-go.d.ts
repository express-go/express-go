/**
 * Express-go declarations
 */
export interface LoaderInterface
{
    boot( app : any )   : void;
    exportName()        : string;
    exportNamespace()   : boolean;
    register( loadObject : any, nameObject : string ) : any;
}

/**
 * Express-go-project declarations
 */
export interface ExpressGoGlobal extends NodeJS.Global
{
	/**
     * Global engine vars
     */
    App     : any;
    Modules : any;

    /**
     * Framework helpers
     */
    base_path       (innerPath?: string) : string;
    bower_path      (innerPath?: string) : string;
    npm_path        (innerPath?: string) : string;

    /**
     * Storage helpers
     */
    storage_path    (innerPath?: string, getRelative?: boolean) : string;
    cache_path      (innerPath?: string, getRelative?: boolean) : string;
    logs_path       (innerPath?: string, getRelative?: boolean) : string;

    /**
     * Application helpers
     */
    app_path        (innerPath?: string, getRelative?: boolean) : string;
    app_modules     (innerPath?: string, getRelative?: boolean) : string;
    assets_path     (innerPath?: string, getRelative?: boolean) : string;
    config_path     (innerPath?: string, getRelative?: boolean) : string;
    controllers_path(innerPath?: string, getRelative?: boolean) : string;
    lang_path       (innerPath?: string, getRelative?: boolean) : string;
    middlewares_path(innerPath?: string, getRelative?: boolean) : string;
    models_path     (innerPath?: string, getRelative?: boolean) : string;
    public_path     (innerPath?: string, getRelative?: boolean) : string;
    resources_path  (innerPath?: string, getRelative?: boolean) : string;
    routes_path     (innerPath?: string, getRelative?: boolean) : string;
    sockets_path    (innerPath?: string, getRelative?: boolean) : string;
    views_path      (innerPath?: string, getRelative?: boolean) : string;
}

declare var global : ExpressGoGlobal;