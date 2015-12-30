///<reference path="../../typings/tsd.d.ts"/>

import {ExpressGo, LoaderInterface} from "../../typings/express-go";
declare var global : ExpressGo.Global;

let exec = require('child_process').exec;


/**
 * Commands loader
 */
export namespace Loaders
{
	export class Commands implements LoaderInterface
	{
		private _app : any;
		private _basePath : string = '';
		private _commands : any = {};
		private _instance : any = {};

		/**
		 * Constructor
		 */
		constructor()
		{
			this._instance =
			{
				commands : this._commands,
				console  : this._console,
				textTab  : this._textTab,
				lineTab  : this._lineTab,
				puts	 : this._puts,
				exec	 : this._exec,
				node	 : this._execNode,
			};
		}

		/**
		 * Prefix used name for components
		 * Ex.: module.exports.prefix = {};
		 *
		 * Use "null" for disable
		 *
		 * @returns {string}
		 */
		public exportName() : string
		{
			return "Command";
		}

		/**
		 * Load object into global namespace
		 *
		 * Use "false" for disable
		 *
		 * @returns {boolean}
		 */
		public exportNamespace() : boolean
		{
			return false;
		}

		/**
		 * Register method
		 *
		 * @returns void
		 */
		public register() : void
		{
			//
		}

		/**
		 * Boot method
		 *
		 * @param app
		 * @returns void
		 */
		public boot( app : any ) : void
		{
			//
			this._app = app;
		}

		/**
		 * Loader method
		 *
		 * You can override default object initialization method
		 *
		 * @param loadObject
		 * @param nameObject
		 * @returns {any}
		 */
		public loader( loadObject : any, nameObject : string ) : any
		{
			let commandObject : any;

			commandObject = typeof loadObject === "function"
				? new loadObject( this._app, this._instance )
				: loadObject;

			this._commands = this._mergeObjectsRecursive( this._commands, commandObject );

			return commandObject;
		}

		public getCommands = () : any =>
		{
			return this._commands;
		};

		public setBasePath( basePath : string )
		{
			this._basePath = basePath;
		}

		private _console = ( text : string, code? : any ) =>
		{
			console.log( text );
		};

		public _puts = ( error, stdout, stderr ) =>
		{
			//
		};

		private _exec = ( command : string, callBack : any ) =>
		{
			var tmp = exec( command, this._puts );

			tmp.stdout.on('data', (data) =>
			{
				this._console(data);
			});

			tmp.on('exit',  (code) =>
			{
				this._console('Exiting... ', code);

				callBack();
			});
		};

		private _execNode = ( command : string, parameter : string, callBack : any ) =>
		{
			command = global.npm_path( "/.bin/" + command );

			if ( parameter )
			{
				command = "\"" + command + "\" " + parameter;
			}

			return this._exec( command, callBack );
		};

		private _textTab = ( value : string, tabs : number ) =>
		{
			tabs = !tabs ? 1 : tabs;

			// +2 length need "| "
			var needTabs =  //parseInt(
				tabs - Math.floor((value.length + 3) / 8);
			//);

			for( var i = 0; i < needTabs; i++ )
				value += "\t";

			return value;
		};

		private _lineTab = ( char : string, tabs : number ) =>
		{
			tabs = !tabs ? 1 : tabs;
			tabs = tabs * 8 - 3;

			var value = '';

			for( var i = 0; i < tabs; i++ )
				value += char;

			return value;

		};

		private  _mergeObjectsRecursive( targetObject : any, sourceObject : any ) : any
		{
			for ( let keyObject in sourceObject )
			{
				try
				{
					// Property in destination object set; update its value.
					if ( sourceObject[ keyObject ].constructor === Object )
					{
						targetObject[ keyObject ] = this._mergeObjectsRecursive(
							targetObject[ keyObject ],
							sourceObject[ keyObject ]
						);

					} else
					{
						targetObject[ keyObject ] = sourceObject[ keyObject ];

					}

				} catch ( err )
				{
					// Property in destination object not set; create it and set its value.
					targetObject[ keyObject ] = sourceObject[ keyObject ];

				}
			}

			return targetObject;
		}

	}

}
