/// <reference path="../src/typings/mocha/mocha.d.ts" />
/// <reference path="../src/typings/tsd.d.ts" />

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
		global.global = {
			bootstrap_app : function ()
			{
			}
		};
	} );


	describe( '#findCoreProviders', () =>
	{
		it( 'Testing actual Loaders list', () =>
		{
			process.cwd();

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
/*
		it( 'Testing "/base/foo/bar/FileName" with pathBase', () =>
		{
			var arrays : any = [ "foo", "bar", "FileName" ];
			var result : any = subject.pathToArray( "/base/foo/bar/FileName", "/base" );

			if ( asserts.deepEqual( result, arrays ) )
			{
				throw new Error( 'Expected ["foo", "bar", "FileName"] but was ' + result );
			}
		} );
*/
	} );

	describe( '#findApplicationProviders', () =>
	{
		it( 'Testing actual', () =>
		{

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
			var result : any = subject.findApplicationProviders();

			if ( asserts.deepEqual( result, arrays ) )
			{
				throw new Error( 'Expected ' + result );
			}
		} );
		/*
		 it( 'Testing "/base/foo/bar/FileName" with pathBase', () =>
		 {
		 var arrays : any = [ "foo", "bar", "FileName" ];
		 var result : any = subject.pathToArray( "/base/foo/bar/FileName", "/base" );

		 if ( asserts.deepEqual( result, arrays ) )
		 {
		 throw new Error( 'Expected ["foo", "bar", "FileName"] but was ' + result );
		 }
		 } );
		 */
	} );

} );