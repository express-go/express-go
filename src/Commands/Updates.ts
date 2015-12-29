///<reference path="../../typings/tsd.d.ts"/>

class Command
{
	constructor()
	{
		//
	}

	public commands( app : any, cmd : any ) : any
	{
		return {
			'update' :
			{
				'npm' :
				{
					'description' : "Npm components update",
					'callMethod'  : function(cb)
					{
						cmd.exec("npm update", cb);
					}
				},

				'bower' :
				{
					'description' : "Bower components update",
					'callMethod'  : function(cb)
					{
						cmd.node("bower", "update", cb);
					}
				},

				'gulp' :
				{
					'description' : "Gulp assets and bower components",
					'callMethod'  : function(cb)
					{
						cmd.node("gulp", false, cb);
					}
				},
			},

			'updates' :
			{
				'description' : "All components update",
				'callMethod'  : function(cb)
				{
					// For "egyketted" :D
					cmd.commands['update']['npm'].callMethod(function()
					{
						cmd.commands['update']['bower'].callMethod(function()
						{
							cmd.commands['update']['gulp'].callMethod(function ()
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
