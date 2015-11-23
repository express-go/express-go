///<reference path='./../typings/tsd.d.ts'/>

/**
 * Application object tree
 */

export class App
{
    tempObject : Object = {};

    constructor() {}

    public addObject( namespaces, value )
    {
        this.addNamespacesRecursive( this.tempObject, namespaces, value );
    }

    public getObjects()
    {
        return this.tempObject;
    }

    private addNamespacesRecursive( obj, namespaces, val )
    {
        var key = namespaces[0];
        namespaces.shift();

        if ( typeof obj[key] === "undefined" )
            obj[key] = {};

        if ( typeof namespaces[0] === "undefined" )
        {
            obj[key] = val;
            return;
        }

        this.addNamespacesRecursive( obj[key], namespaces, val );

    }

}
