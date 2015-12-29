///<reference path='../typings/tsd.d.ts'/>
///<reference path='./boot/Boot.ts'/>

import {ExpressGo} from "../typings/express-go";
declare var global : ExpressGo.Global;

let debug : any = require( "debug" )( "express-go:Core" );
let Boot  : any = require( "./Boot/Boot" ).Boot;

var readline = require('readline'),
	rl = readline.createInterface(process.stdin, process.stdout);

class Cli
{
	private commands : any;

	constructor( app : any, basePath : string )
	{
		debug( "Initializing CLI" );

		this.commands = app.provider("Commands").getCommands();

		this.start( app, basePath );
	}

	private start( app : any, basePath : string )
	{
		let commands = this.commands;

		commands['help'].callMethod(function(){
			rl.setPrompt('APP> ');
			rl.prompt();
		});


		rl.on('line', function(line)
		{
			line = line.trim();
			var cmd = line.split(":");

			var masterCommand = cmd[0];
			var slaveCommand  = cmd[1];

			if ( commands[masterCommand] !== undefined )
			{
				if ( typeof commands[masterCommand].callMethod == 'function' )
					commands[masterCommand].callMethod(function(){
						rl.prompt();
					});
				else
				{
					if ( commands[masterCommand][slaveCommand] !== undefined )
					{
						if ( typeof commands[masterCommand][slaveCommand].callMethod == 'function' )
							commands[masterCommand][slaveCommand].callMethod(function(){
								rl.prompt();
							});
						else
							commands['help'].callMethod(function(){
								rl.prompt();
							});
					}
					else
					{
						console.log("Command list:");
						console.log(Object.keys(commands[masterCommand]));
						rl.prompt();
					}
				}
			}
			else
			{
				console.log("Unknow command: " + line);
				console.log("Use \"help\" for listing commands.");
				rl.prompt();
			}




		}).on('close', function() {
			console.log('Have a great day!');
			process.exit(0);
		});

	}

}

module.exports = Cli;
