/// <reference path="../src/typings/mocha/mocha.d.ts" />
/// <reference path="../src/typings/tsd.d.ts" />

process.env.NODE_ENV = 'test'

var asserts = require( 'assert' );

describe( 'Boot.Finder', () =>
{
	var Boot = require( "../src/Boot/Finder" ).Boot;
	var subject : any;

	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject = new Boot.Finder();
	} );


	describe( '#findCoreProviders', () =>
	{
		it( 'Testing actual Loaders list', () =>
		{
			subject._pathCoreProviders = './../Loaders/';

			var arrays : any = [
				"./../Loaders/Commands",
				"./../Loaders/Configs",
				"./../Loaders/Controllers",
				"./../Loaders/Middlewares",
				"./../Loaders/Models",
				"./../Loaders/Routes",
				"./../Loaders/Sockets",
				"./../Loaders/Translations",
				"./../Loaders/Views"
			];
			var result : any = subject.findCoreProviders();

			if ( asserts.deepEqual( result, arrays ) )
			{
				throw new Error( 'Expected ' + result );
			}
		} );

	} );

	describe( '#findApplicationProviders', () =>
	{

	} );

} );