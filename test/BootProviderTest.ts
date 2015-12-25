/// <reference path="../src/typings/mocha/mocha.d.ts" />
/// <reference path="../src/typings/tsd.d.ts" />

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
} );