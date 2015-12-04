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

/**
 * Framework helpers
 */
export declare function base_path (innerPath?: string) : string;
export declare function npm_path (innerPath?: string)  : string;
export declare function bower_path (innerPath?: string)  : string;

/**
 * Storage helpers
 */
export declare function storage_path (innerPath?: string, getRelative?: boolean)  : string;
export declare function cache_path (innerPath?: string, getRelative?: boolean)  : string;
export declare function logs_path (innerPath?: string, getRelative?: boolean)  : string;

/**
 * Application helpers
 */
export function app_path (innerPath?: string, getRelative?: boolean)  : string;
export function app_modules (innerPath?: string, getRelative?: boolean)  : string;
export function models_path (innerPath?: string, getRelative?: boolean) : string;
export function views_path (innerPath?: string, getRelative?: boolean)  : string;
export function public_path (innerPath?: string, getRelative?: boolean)  : string;
export function assets_path (innerPath?: string, getRelative?: boolean)  : string;
export function lang_path (innerPath?: string, getRelative?: boolean)  : string;
export function controllers_path (innerPath?: string, getRelative?: boolean)  : string;
export function middlewares_path (innerPath?: string, getRelative?: boolean)  : string;
export function routes_path (innerPath?: string, getRelative?: boolean)  : string;
export function sockets_path (innerPath?: string, getRelative?: boolean)  : string;
export function config_path (innerPath?: string, getRelative?: boolean)  : string;
export function resources_path (innerPath?: string, getRelative?: boolean)  : string;

