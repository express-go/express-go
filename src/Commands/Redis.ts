///<reference path="../../typings/tsd.d.ts"/>

var redis : any = require('redis'),
	redisClient = redis.createClient();

class Command
{
	constructor( app : any, cli : any )
	{
		return this.commands( app, cli );
	}

	public commands( app : any, cli : any ) : any
	{
		return {
			'redis' :
			{
				'list' :
				{
					'description' : "Listing redis keys",
					'callMethod'  : function(cb)
					{
						redisClient.keys('*', function (err, keys)
						{
							if (err) return console.log(err);

							for( let i = 0, len = keys.length; i < len; i++ )
							{
								cli.console(keys[i]);
							}

							cb();
						});
					}
				},
				'clear':
				{
					'description' : "Clear redis database keys",
					'callMethod'  : function(cb)
					{
						redisClient.flushdb( function (err, didSucceed)
						{
							if ( didSucceed )
							{
								cli.console("FlushDB ready!");
							} else
							{
								cli.console("FlushDB error!", err);
							}

							cb();
						});

					}

				}

			},

		};

	}

}

module.exports.Command = Command;
