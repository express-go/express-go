/// <reference path="../src/typings/mocha/mocha.d.ts" />
/// <reference path="../src/typings/tsd.d.ts" />

process.env.NODE_ENV = 'test'

var asserts = require( 'assert' );

describe( 'Boot.Namespace', () =>
{
	var Boot = require( "../src/Boot/Namespace" ).Boot;
	var subject : any;

	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject = new Boot.Namespace();
	} );

	/**
	 * Converting path to array
	 */
	describe( '#pathToArray', () =>
	{
		it( 'Testing "/foo/bar/FileName" none pathBase', () =>
		{
			var arrays : any = [ "foo", "bar", "FileName" ];
			var result : any = subject.pathToArray( "/foo/bar/FileName" );

			if ( asserts.deepEqual( result, arrays ) )
			{
				throw new Error( 'Expected ["foo", "bar", "FileName"] but was ' + result );
			}
		} );

		it( 'Testing "/base/foo/bar/FileName" with pathBase', () =>
		{
			var arrays : any = [ "foo", "bar", "FileName" ];
			var result : any = subject.pathToArray( "/base/foo/bar/FileName", "/base" );

			if ( asserts.deepEqual( result, arrays ) )
			{
				throw new Error( 'Expected ["foo", "bar", "FileName"] but was ' + result );
			}
		} );

	} );

	/**
	 * Converting path array to object
	 * Use requireValue parameter for defined value, default "null"
	 */
	describe( '#pathArrayToObject', () =>
	{
		it( 'Testing ["foo", "bar", "FileName"] none requireValue', () =>
		{
			var arrays : any = [ "foo", "bar", "FileName" ];
			var result : any = subject.pathArrayToObject( arrays );
			var object : any = {
				foo : {
					bar : {
						FileName : null
					}
				}
			};

			if ( asserts.deepEqual( result, object ) )
			{
				throw new Error( 'Expected "null" but was ' + result );
			}
		} );

		it( 'Testing ["foo", "bar", "FileName"] with requireValue', () =>
		{
			var values : string = "Hello";
			var arrays : any    = [ "foo", "bar", "FileName" ];
			var result : any    = subject.pathArrayToObject( arrays, values );
			var object : any    = {
				foo : {
					bar : {
						FileName : values
					}
				}
			};

			if ( asserts.deepEqual( result, object ) )
			{
				throw new Error( 'Expected "' + values + '" but was ' + result );
			}
		} );
	} );

	/**
	 * Converting path to object
	 */
	describe( '#pathToObject', () =>
	{
		it( 'Testing "/foo/bar/FileName"', () =>
		{
			var result : any = subject.pathToObject( "/foo/bar/FileName" );
			var object : any = {
				foo : {
					bar : {
						FileName : null
					}
				}
			};

			if ( asserts.deepEqual( result, object ) )
			{
				throw new Error( 'Expected "null" but was ' + result );
			}
		} );

		it( 'Testing "/base/foo/bar/FileName" with pathBase', () =>
		{
			var result : any = subject.pathToObject( "/foo/bar/FileName", null );
			var object : any = {
				foo : {
					bar : {
						FileName : null
					}
				}
			};

			if ( asserts.deepEqual( result, object ) )
			{
				throw new Error( 'Expected "null" but was ' + result );
			}
		} );

		it( 'Testing "/base/foo/bar/FileName" with pathBase and requireValue', () =>
		{
			var values : string = "Hello";
			var result : any    = subject.pathToObject( "/base/foo/bar/FileName", "/base", values );
			var object : any    = {
				foo : {
					bar : {
						FileName : values
					}
				}
			};

			if ( asserts.deepEqual( result, object ) )
			{
				throw new Error( 'Expected "' + values + '" but was ' + result );
			}
		} );
	} );


	/**
	 * Adding object to namespace
	 * Alias of "_mergeObjectsRecursive"
	 */
	describe( '#addToNamespace', () =>
	{
		it( 'Testing { "foo" : null } and { "foo" : { "bar" : null }, "bar" : null }', () =>
		{
			var targetObject : any = {
				"foo"   : null,
				"hello" : null
			};
			var sourceObject : any = {
				"foo" : {
					"bar" : null
				},
				"bar" : null
			};

			var result : any = subject.addToNamespace( targetObject, sourceObject );
			var object : any = {
				"foo"   : {
					"bar" : null
				},
				"bar"   : null,
				"hello" : null
			};


			if ( asserts.deepEqual( result, object ) )
			{
				throw new Error( 'Expected merge ' + result );
			}
		} );
	} );


	/**
	 * Convert array to object deep helper
	 */
	describe( '#_arrayToObject', () =>
	{
		it( 'Testing ["foo", "bar", "FileName"]', () =>
		{
			var arrays : any = [ "foo", "bar", "FileName" ];
			var object : any = {};
			var result : any = {
				foo : {
					bar : {
						FileName : null
					}
				}
			};

			subject._arrayToObject( arrays, object, null );

			if ( asserts.deepEqual( result, object ) )
			{
				throw new Error( 'Expected "null" but was ' + result );
			}
		} );
	} );

	/**
	 * Merge objects recursive
	 */
	describe( '#_mergeObjectsRecursive', () =>
	{
		it( 'Testing { "foo" : null } and { "foo" : { "bar" : null }, "bar" : null }', () =>
		{
			var targetObject : any = {
				"foo"   : null,
				"hello" : null
			};
			var sourceObject : any = {
				"foo" : {
					"bar" : null
				},
				"bar" : null
			};

			var result : any = subject._mergeObjectsRecursive( targetObject, sourceObject );
			var object : any = {
				"foo"   : {
					"bar" : null
				},
				"bar"   : null,
				"hello" : null
			};


			if ( asserts.deepEqual( result, object ) )
			{
				throw new Error( 'Expected merge ' + result );
			}
		} );
	} );

} );