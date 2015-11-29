///<reference path='../typings/tsd.d.ts'/>
import {LoaderInterface} from "../typings/express-go";

declare function lang_path( path? : string );
declare function t( path? : string );

var fs   = require('fs');
var glob = require("glob");
var redis = require('redis').createClient();

var languageRedisCache = 'LANGUAGE_CACHE_REDIS';

/**
 * Controller loader
 */
export module Loaders
{
	export class Translations implements LoaderInterface
	{
		private app : any;

		constructor()
		{
		}

		/**
		 * Trigger, when booting class file
		 */
		public boot( app : any ) : void
		{
			// Translations
			app.locals.i18n	= app.i18n;
			app.locals._t 	= app.i18n.t;
			app.locals.__ 	= app.i18n.t;

			//console.log(app._t("ars"));
			//process.exit();
			this.app = app;
		}

		/**
		 * Trigger, when loading class file
		 * Override here the "require"
		 *
		 * @param loadPath
		 */
		public load( loadPath? : string ) : any
		{
			// Loading translation files
			try
			{
				if ( fs.statSync( lang_path() ) )
				{
					var files = glob.sync( lang_path("**/*.json") );
					files.forEach(function( file )
					{
						var partials = file.split('.');
						this.app.i18n.add(file, partials[ partials.length - 2 ]);
					});
				}
			} catch(ex) {}

			//this.addMiddleware();
/*
			console.log(this.app.i18n.__("m_user_name_label"));
			console.log( this.app.i18n.getDefaultLang() );
			console.log( this.app.i18n.getCurrentLang() );
			process.exit();
*/
			return false;
		}

		/**
		 * Locations root path
		 * Null is global in app and modules
		 *
		 * @returns {any}
		 */
		public getLoadPath() : string
		{
			//return controllers_path();
			return null;
		}

		/**
		 * Finding files by postfix
		 *
		 * @returns {string}
		 */
		public getLoadPostfix() : string
		{
			return "Controller";
		}

		/**
		 * Setting files by namespace
		 *
		 * @returns {string[]}
		 */
		public getLoadNamespace() : any
		{
			//return ["Http", "Controllers"];
			return null;
		}

		private addMiddleware()
		{
			// Init
			if (this.app.get('env') == 'production')
			{
				redis.get(languageRedisCache, function (error, result)
				{
					if (result == null)
					{
						redis.set(
							languageRedisCache,
							JSON.stringify( this.app.i18n.getTranslation() ),
							redis.print
						);
					}
					else
					{
						this.app.i18n.setTranslation(result);
					}

				});
			}

		}

	}
}
