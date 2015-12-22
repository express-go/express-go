///<reference path='../typings/tsd.d.ts'/>
///<reference path='Boot.ts'/>

import {ExpressGoGlobal} from "../typings/express-go";
declare var global : ExpressGoGlobal;

var debug = require( 'debug' )( 'express-go:Boot.Loaders' );

export namespace Boot.Loaders
{
	export class Load
	{
		private _components = {};

		constructor( components : any )
		{
			debug( "Components Load constructor" );

			this._components = components;
			this.loadComponents();
		}

		public getList()
		{
			return this._components;
		}

		/**
		 * Loading each defined components
		 */
		public loadComponents()
		{
			// Each components list
			for ( var key in this._components )
			{
				var val = this._components[ key ];

				// Load component
				this.loadComponent( key, val );
			}

			debug( "Loading ready!" );
		}

		/**
		 * Load component from "loader" dir
		 *
		 * @param key
		 * @param isLoading
		 */
		public loadComponent( key : string, isLoading : boolean )
		{
			debug( "Loading component: %s", key );

			var val = {
				path     	: __dirname + '/../loader/' + key,
				source   	: null,
				instance 	: null,
				preLoad	 	: !!isLoading,
				loaded		: false,
				exportName	: null,
				objects  	: {},
			};

			val.source		= require( val.path ).Loaders[ key ];
			val.instance	= new val.source();
			val.exportName	= val.instance.exportName();

			this._components[ key ] = val;
		}


	}

}