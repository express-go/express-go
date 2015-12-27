/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/tsd.d.ts" />

process.env.NODE_ENV = 'test';

var asserts = require( 'assert' );

describe( 'Boot.Provider', () =>
{
	var Boot = require( "../src/Boot/Provider" ).Boot;
	var subject : any;

	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject = new Boot.Provider();
	} );


	describe( '#bootProviders', () =>
	{

	} );

	describe( '#bootProvider', () =>
	{

	} );


	/**
	 * Parse Provider name from path
	 */
	describe( '#parseNameFromPath', () =>
	{
		it( 'Testing "/foo/bar/FileName.extension"', () =>
		{
			var result : string = subject.parseNameFromPath( "/foo/bar/FileName.extension" );

			if ( asserts.equal( result, "FileName" ) )
			{
				throw new Error( 'Expected "foo/bar/FileName.extension" is FileName but was ' + result );
			}
		} );
	} );


	describe( '#initProvider', () =>
	{

	} );

	describe( '#initProviderObject', () =>
	{

	} );

	describe( '#orderProviders', () =>
	{

	} );

	describe( '#associateProvider', () =>
	{

	} );

	describe( '#associateProviderObject', () =>
	{

	} );


	/**
	 * Validating necessary functions
	 */
	describe( '#validateProviderObject', () =>
	{
		it( 'Testing clear object', () =>
		{
			var objects =
			{
				boot			: function(){},
				register		: function(){},
				exportName		: function(){},
				exportNamespace	: function(){},
			};
			var result : boolean = subject.validateProviderObject( objects );

			if ( asserts.equal( result, true ) )
			{
				throw new Error( 'Expected Provider object but was ' + result );
			}
		} );

		it( 'Testing trashed object', () =>
		{
			var objects =
				{
					boot			: function(){},
					register		: function(){},
					exportName		: function(){},
					exportNamespace	: function(){},
					foo				: "Hello",
					bar				: null,
				};
			var result : boolean = subject.validateProviderObject( objects );

			if ( asserts.equal( result, true ) )
			{
				throw new Error( 'Expected Provider object but was ' + result );
			}
		} );

		it( 'Testing bugged object', () =>
		{
			var objects =
				{
					bootBug			: function(){},
					registerBug		: function(){},
					exportName		: function(){},
					exportNamespace	: function(){},
					foo				: "Hello",
					bar				: null,
				};
			var result : boolean;

			// Catching Exception
			try
			{
				result = subject.validateProviderObject( objects );
			}
			catch( e )
			{
				// False "false", this is Exception flag
				result = false;
			}

			if ( asserts.equal( result, false ) )
			{
				throw new Error( 'Expected false but was ' + result );
			}

		} );

	} );


} );