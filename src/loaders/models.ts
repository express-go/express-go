///<reference path='./../typings/tsd.d.ts'/>
import general = require('./autoloader');

declare function models_path( path? : string );

var fs = require('fs');
var path = require('path');
var db = {};

var Sequelize = require('sequelize');

if ( !!process.env.DB_ENV )
    var sequelize = new Sequelize( process.env.DB_ENV );
else
    var sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        "host"    : process.env.DB_HOST,
        "port"    : process.env.DB_PORT,
        "dialect" : process.env.DB_TYPE
    });


/**
 * Controller loader
 */
export module Core
{
    export module Loaders
    {
        export class Models
        extends general.Core.Loaders.Autoloader
        {
            public init( app )
            {
                this.load();
                this.initSequlize( app );
            }

            private load()
            {
                this.loadPath( models_path(), ["Models"] );

            }

            private initSequlize = ( app ) =>
            {
                Object.keys( this.app.tempObject.Models ).forEach((modelName) =>
                {
                    if (this.app.tempObject.Models[modelName].associate) {
                        this.app.tempObject.Models[modelName].associate( this.app.tempObject.Models );
                    }
                });

                app.sequelize = sequelize;
                app.Sequelize = Sequelize;

            }
        }
    }
}
