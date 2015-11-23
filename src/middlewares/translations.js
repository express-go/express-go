/**
 * Default routes
 */

// Settings
//var languageRedisCache = 'LANGUAGE_CACHE_REDIS';
var languages = [
    'en_GB',
    'hu_HU'
];

module.exports = function( app )
{
    //console.log(i18n);
    //console.log("HÉHÉH");
    //console.log(app.i18n);
    //process.exit();

    // Use middleware to set current language
    // /lang/xx_yy
    app.use(function (req, res, next)
    {
        /*
         var match = req.url.match(/^\/lang\/(.{2,5})([\/\?].*)?$/i);
         //console.log(req.header('Referer') || '/', req.url, match);
         if (match)
         {
         req.lang = match[1];
         if ( languages.indexOf(req.lang) >= 0 )
         {
         i18n.setCurrentLang(req.query.lang);
         }
         else
         {
         i18n.setCurrentLang(i18n.getDefaultLang());
         }
         //            res.redirect( req.header('Referer') || '/' );
         //next();
         res.redirect('back');
         } else {
         next();
         }
         */
//console.log(app.i18n);
//        process.exit();

        //res.locals.i18n = app.i18n;
        //res.locals._t   = app.i18n.__;

        if (req.query.lang != undefined && languages.indexOf(req.query.lang) >= 0)
        {
            app.i18n.setCurrentLang(req.query.lang);

            // TODO
            //req.session.lang = req.query.lang;
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
        next();

    });

};
