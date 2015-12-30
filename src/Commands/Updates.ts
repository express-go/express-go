///<reference path="../../typings/tsd.d.ts"/>

class Command
{
	constructor( app : any, cli : any )
	{
		return this.commands( app, cli );
	}

	public commands( app : any, cli : any ) : any
	{
		return {
			'update' :
			{
				'npm' :
				{
					'description' : "Npm components update",
					'callMethod'  : function(cb)
					{
						cli.exec("npm update", cb);
					}
				},

				'bower' :
				{
					'description' : "Bower components update",
					'callMethod'  : function(cb)
					{
						cli.node("bower", "update", cb);
					}
				},

				'gulp' :
				{
					'description' : "Gulp assets and bower components",
					'callMethod'  : function(cb)
					{
						cli.node("gulp", false, cb);
					}
				},
			},

			'updates' :
			{
				'description' : "All components update",
				'callMethod'  : function(cb)
				{
					// For "egyketted" :D
					cli.commands['update']['npm'].callMethod(function()
					{
						cli.commands['update']['bower'].callMethod(function()
						{
							cli.commands['update']['gulp'].callMethod(function ()
							{
								cb();

							});

						});

					});

				}

			},

		};

	}

}

module.exports.Command = Command;
