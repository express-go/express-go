///<reference path='./typings/tsd.d.ts'/>

declare function public_path( path? : string );

var fs = require('fs');
var path = require('path');

var express     = require('express');

var bodyParser  = require('body-parser');
var compress    = require('compression');
var cookieParser= require('cookie-parser');
var csrf        = require('seasurf');
var favicon     = require('serve-favicon');
var forceSSL    = require('express-force-ssl');
var logger      = require('morgan');
var nodalytics  = require('nodalytics');
var Router      = require('named-routes');
var router      = new Router();
var session     = require('express-session');
var i18n        = require('z-i18n');

var redis       = require('redis');
var redisClient = redis.createClient();
var RedisStore  = require("connect-redis")(session);


// Settings
var languages = [
    'en_GB',
    'hu_HU'
];


var app = express();

    // Set current
    i18n.init({
        current_lang : 'en_GB',
        default_lang : 'en_GB'
    });

    /**
     * Session Middleware for Express & Socket.io
     */
    app.sessionSettings =
    {
        store: new RedisStore({
            "client": redisClient,
            "host": process.env.REDIS_HOST,
            "port": process.env.REDIS_PORT
        }),
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            "path"      : '/',
            "secure"    : true,
            "httpOnly"  : false,
            "maxAge"    : null
        },
        key: 'connect.sid'
    };



// Setup router
    router.extendExpress(app);
    router.registerAppHelpers(app);


    // Force SSL
    if ( process.env.FORCE_HTTPS.toLowerCase() == "true" || process.env.FORCE_HTTPS == true )
    {
        app.set('forceSSLOptions', {
            //enable301Redirects : true,
            //trustXFPHeader     : false,
            httpsPort          : process.env.PORT_HTTPS,
            //sslRequiredMessage : 'SSL Required.'
        });
        app.use(forceSSL);
    }


    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


    app.disable('x-powered-by');
    app.disable('etag');


app.set('trust proxy', 1);
app.use(session(app.sessionSettings));

app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

    // Session and Security
    //app.use(cookieParser());




//app.use(csrf({ cookie: false }));

    //console.log(app.sessionSettings);

    //app.use(csrf());


    app.use((req : any, res : any, next : any) =>
    {
        //res.locals.csrfToken = req.csrfToken();
        res.locals.csrfToken = '123';
        next();
    });


/*
app.use(function (err : any, req : any, res : any, next : any)
{
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    res.status(403);
    res.send('session has expired or form tampered with')
});
*/

app.i18n = i18n;

// Use middleware to set current language
// /lang/xx_yy
app.use(function (req : any, res : any, next : any)
{

    res.locals.i18n = app.i18n;
    res.locals._t   = app.i18n.__;
    res.locals.__   = app.i18n.__;

    if (req.query.lang != undefined && languages.indexOf(req.query.lang) >= 0)
    {
        app.i18n.setCurrentLang(req.query.lang);
        req.session.lang = req.query.lang;
    }
    else
    {
        if ( req.session.lang === undefined )
        {
            app.i18n.setCurrentLang(app.i18n.getDefaultLang());
        }
        else
        {
            app.i18n.setCurrentLang(req.session.lang);
        }

    }
    return next();

});


//console.log("DáIE");
//process.exit();

if ( !!process.env.APP_UA && process.env.APP_UA.indexOf("UA-") === 0 )
    app.use( nodalytics( process.env.APP_UA ) );

if ( !process.env.CDN_ASSETS || process.env.CDN_ASSETS == '/' )
    app.use(express.static(
        public_path(),
        {
            etag    : false,
            maxAge  : '1y', //365 * 24 * 60 * 60,
            dotfiles: 'ignore',
            expires : new Date(Date.now() + (365 * 24 * 60 * 60)),
            setHeaders: function(res, path)
            {
                if (path.indexOf("download") !== -1) {
                    res.attachment(path)
                }

                res.setHeader('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString());
            }
        }
    ));



module.exports = app;