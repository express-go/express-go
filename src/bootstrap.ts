///<reference path='./typings/tsd.d.ts'/>
///<reference path='./loaders/app.ts'/>
///<reference path='./loaders/models.ts'/>


declare var global : any;
declare function app_modules( path? : string );

/**
 * Bootstrap
 */
var fs 	 = require('fs');
var glob = require("glob");
var path = require('path');
var extend = require('util')._extend;

var appSrc = require('./loaders/app.ts');
//var appTs = new appSrc.App();
//var modTs = new appSrc.App();
var actTs = new appSrc.App();

export module Core
{
    export class Bootstrap
    {
        app : any;
        appGlobal : any;

        constructor( app : Express.Application, appGlobal : any )
        {
            this.app = app;
            this.appGlobal = appGlobal;

            this.init();
        }

        private init = () =>
        {
            this.loadComponents( false );
            this.loadModules();
            this.loadErrorHandlers();
        };

        // Application files only (OFFFFF)
        private reloadComponents = ( isModule ) =>
        {
            return;

            if ( !!isModule )
                return;

            //appTs = new appSrc.App();
            this.loadComponents( false )

        };

        private loadComponents = ( isModule ) =>
        {
            //var actTs = isModule ? modTs : appTs;

            /*var appTs = new appSrc.App();

            if ( isModule )
                this.appGlobal.Module = appTs.getObjects();
            else
                this.appGlobal.App    = appTs.getObjects();
                */

            this.appGlobal.App          = actTs.getObjects();
            //this.appGlobal.App.Modules  = modTs.getObjects();

            var translationsLoad= require('./loaders/translations.ts');
            var modelsLoad      = require('./loaders/models.ts');
            var viewsLoad       = require('./loaders/views.ts');
            var controllersLoad = require('./loaders/controllers.ts');
            var socketsLoad     = require('./loaders/sockets.ts');
            var routesLoad      = require('./loaders/routes.ts');

            new translationsLoad.Core.Loaders.Translations( actTs, isModule, this.reloadComponents ).init( this.app, this.appGlobal );
            new modelsLoad.Core.Loaders.Models( actTs, isModule, this.reloadComponents ).init( this.app );
            new viewsLoad.Core.Loaders.Views( actTs, isModule, this.reloadComponents ).init( this.app );
            new controllersLoad.Core.Loaders.Controllers( actTs, isModule, this.reloadComponents ).init();
            new socketsLoad.Core.Loaders.Sockets( actTs, isModule, this.reloadComponents ).init();

            //this.appendAppObject( this.app, appTs.getObjects() );

            new routesLoad.Core.Loaders.Routes( actTs, isModule, this.reloadComponents ).init( this.app );

            //console.log(this.appGlobal.App, this.appGlobal.Module);
        };

        private loadModules = () =>
        {
            // Loading modules
            try
            {
                if ( fs.statSync( app_modules() ) )
                {
                    var orgAppPath = this.appGlobal.app_path;
                    var files = glob.sync( app_modules("**/module.json") );

                    files.forEach(( file ) =>
                    {
                        // Overwiting application path for modules loading
                        this.appGlobal.app_path = function( innerPath )
                        {
                            innerPath = typeof innerPath === 'string' ? innerPath : '';
                            return path.dirname(file) + '/' + innerPath;
                        };

                        this.loadComponents( true );

                    });

                    this.appGlobal.app_path = orgAppPath;
                }
            } catch(ex) {
                //console.log(ex);
                //process.exit();
            }

        };

        private loadErrorHandlers = function ()
        {
            // catch 404 and forward to error handler
            this.app.use(function(req, res, next) {
                var err : any = new Error('Not Found');
                err.status = 404;
                next(err);
            });

            // error handlers

            // development error handler
            // will print stacktrace
            if (this.app.get('env') === 'development') {
                this.app.use(function(err, req, res, next) {
                    res.status(err.status || 500);
                    res.render('errors/error', {
                        message: err.message,
                        error: err
                    });
                });
            }

            // production error handler
            // no stacktraces leaked to user
            this.app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('errors/error', {
                    message: err.message,
                    error: {}
                });
            });
        };

        private appendAppObject = ( objTo, objFrom ) =>
        {
            for (var attributeName in objFrom)
                objTo[attributeName] = objFrom[attributeName];
        }
    }
}

