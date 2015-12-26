///<reference path='typings/tsd.d.ts'/>
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var favicon = require('serve-favicon');
var forceSSL = require('express-force-ssl');
var helmet = require('helmet');
var logger = require('morgan');
var nodalytics = require('nodalytics');
var session = require('express-session');
var redis = require('redis');
var redisClient = redis.createClient();
var RedisStore = require("connect-redis")(session);
var debug = require('debug')('express-go:Express');
debug("Express object created");
var app = express();
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
            "path": '/',
            "secure": true,
            "httpOnly": true,
            "maxAge": null
        },
        key: 's3ss10n'
    };
var ExpressGoCore = (function () {
    function ExpressGoCore(app) {
        debug("ExpressGo init app");
        debug("ExpressGo init initParsers");
        this.initParsers();
        debug("ExpressGo init initStatics");
        this.initStatics();
        return app;
    }
    /**
     * Default parsers and middlewares
     */
    ExpressGoCore.prototype.initParsers = function () {
        // Force SSL
        app.enable('trust proxy');
        this.initForceSSL();
        // Source manipulation
        app.use(compress({}));
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        // Security
        app.disable('x-powered-by');
        app.disable('etag');
        app.use(helmet.noSniff());
        app.use(helmet.frameguard());
        app.use(helmet.xssFilter());
        // Session and CSRF
        app.use(cookieParser());
        app.use(session(app.sessionSettings));
        app.use(csrf({}));
        app.use(function (req, res, next) {
            res.locals.csrfToken = req.csrfToken();
            next();
        });
    };
    /**
     * Force SSL redirect from HTTP
     */
    ExpressGoCore.prototype.initForceSSL = function () {
        //
        if (process.env.FORCE_HTTPS.toLowerCase() == "true" || process.env.FORCE_HTTPS == true) {
            app.set('forceSSLOptions', {
                //enable301Redirects : true,
                //trustXFPHeader     : false,
                httpsPort: process.env.PORT_HTTPS
            });
            app.use(forceSSL);
        }
    };
    /**
     * Static files serving
     */
    ExpressGoCore.prototype.initStatics = function () {
        //
        if (!!process.env.APP_UA && process.env.APP_UA.indexOf("UA-") === 0)
            app.use(nodalytics(process.env.APP_UA));
        // Favicon
        try {
            if (fs.statSync(global.public_path("favicon.ico"))) {
                app.use(favicon(global.public_path("favicon.ico")));
            }
        }
        catch (e) {
        }
        // Static files
        if (!process.env.CDN_ASSETS || process.env.CDN_ASSETS == '/') {
            app.use(express.static(global.public_path(), {
                etag: false,
                maxAge: '1y',
                dotfiles: 'ignore',
                expires: new Date(Date.now() + (365 * 24 * 60 * 60)),
                setHeaders: function (res, path) {
                    if (path.indexOf("download") !== -1) {
                        res.attachment(path);
                    }
                    res.setHeader('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString());
                }
            }));
        }
    };
    return ExpressGoCore;
})();
module.exports = new ExpressGoCore(app);
