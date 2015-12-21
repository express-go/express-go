///<reference path='../typings/tsd.d.ts'/>
///<reference path='Builder.ts'/>
///<reference path='Loaders.ts'/>
///<reference path='Project.ts'/>

var debug  = require('debug')('express-go:Boot');

var Loaders = require('./Loaders').Boot.Loaders;
var loadLoaders;

var Project = require('./Project').Boot.Project;
var loadProject;

var Builder = require('./Builder').Boot.Builder;
var loadBuilder;


export module Boot
{
    export class Init
    {
        constructor( componentsList : any, pathsList : any )
        {
            debug( "Boot Init constructor" );

            // Loaders
            loadLoaders = new Loaders.Load( componentsList );

            // Builder
            loadBuilder = new Builder.Load( loadLoaders );

            // Project files
            loadProject = new Project.Load( pathsList, loadBuilder );

        }
    }

    export class Boot
    {
        constructor( app : any )
        {
            debug( "Boot objects" );

            //this.bootLoaders( app );
            debug( "Boot Loaders objects" );
            var bootList = loadLoaders.getList();

            for ( var key in bootList )
            {
                debug( "Booting Loaders object: %s", key );
                if ( typeof bootList[ key ].instance.boot === "function" )
                {
                    bootList[ key ].instance.boot( app );
                }
            }

            //this.bootObjects( app );
            debug( "Boot Project objects" );
            var bootList = loadBuilder.getBootList();

            for( var key in bootList )
            {
                debug( "Booting Project object: %s", key );
                bootList[ key ] = bootList[key]( app );
            }
        }

        private bootLoaders( app : any )
        {
            var bootList = loadLoaders.getList();

            for ( var key in bootList )
            {
                console.log( bootList[ key ] );
                process.exit();
            }

        }

        private bootObjects( app : any )
        {
            var bootList = loadBuilder.getBootList();

            for( var key in bootList )
            {
                console.log( bootList[ key ] );
                process.exit();
                bootList[ key ] = bootList[key]( app );
            }
        }
    }

}
