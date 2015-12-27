/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/tsd.d.ts" />

process.env.NODE_ENV = 'test';

var asserts = require( 'assert' );
var fs      = require( "fs" );
var path    = require( "path" );

describe( 'Boot.FileManager', () =>
{
	var Boot = require( "../src/Boot/FileManager" ).Boot;
	var subject : any;
	var testFilesRelative : string;
	var testFilesNormal : string;


	/**
	 * Constructor
	 */
	beforeEach( function ()
	{
		subject           = new Boot.FileManager();
		testFilesRelative = './files';
		testFilesNormal   = fs.realpathSync( __dirname + '/files' );
	} );


	/**
	 * Finding script & typescript files
	 */
	describe( '#findFiles', () =>
	{
		it( 'Testing finding Loaders files', () =>
		{
			var result : any = subject.findFiles( testFilesNormal + '/Loaders' );

			if ( asserts.equal( result.length, 2 ) )
			{
				throw new Error( 'Expected ' + testFilesNormal );
			}
		} );

	} );


	/**
	 * Finding modules
	 */
	describe( '#findModules', () =>
	{
		it( 'Testing finding Modules', () =>
		{
			var array : any   = [];
			array[ "Module" ] = fs.realpathSync( testFilesNormal + '/module' ).split( path.sep ).join( '/' );

			var result : any = subject.findModules( testFilesNormal );

			if ( asserts.deepEqual( array, result ) )
			{
				throw new Error( 'Expected ' + testFilesNormal );
			}
		} );

	} );


	/**
	 * Searching files with Glob
	 */
	describe( '#searchFiles', () =>
	{
		it( 'Testing finding Loaders files', () =>
		{
			var result : any = subject.searchFiles( testFilesNormal + '/Loaders/*.ts' );

			if ( asserts.equal( result.length, 2 ) )
			{
				throw new Error( 'Expected ' + testFilesNormal );
			}
		} );
	} );


	/**
	 * Normalizing file path
	 */
	describe( '#fileNormalizePath', () =>
	{
		it( 'Testing none normalizeSkip', () =>
		{

			var source : string = "/foo\\./bar/";
			var normal : any    = path.normalize( source );

			var result : any = subject.fileNormalizePath( source );

			if ( asserts.deepEqual( normal, result ) )
			{
				throw new Error( 'Expected ' + testFilesNormal );
			}
		} );

		it( 'Testing with normalizeSkip false', () =>
		{

			var source : string = "/foo\\./bar/";
			var normal : any    = path.normalize( source );

			var result : any = subject.fileNormalizePath( source, false );

			if ( asserts.deepEqual( normal, result ) )
			{
				throw new Error( 'Expected ' + testFilesNormal );
			}
		} );

		it( 'Testing with normalizeSkip true', () =>
		{

			var source : string = "/foo\\./bar/";
			var result : any    = subject.fileNormalizePath( source, true );
			var dirPath         = path.join( path.normalize( __dirname + "/../" ), "src", "Boot" );

			if ( asserts.deepEqual( dirPath + source, result ) )
			{
				throw new Error( 'Expected ' + testFilesNormal );
			}

		} );

	} );


	/**
	 * Realizing file path
	 */
	describe( '#fileRealize', () =>
	{
		it( 'Testing with basePath good', () =>
		{
			var source : string = "/foo\\./bar/";
			var insert : string = __dirname + source;
			var result : any    = subject.fileRealize( insert, __dirname );

			if ( asserts.equal( source, result ) )
			{
				throw new Error( 'Expected ' + source + ' but it ' + result );
			}
		} );

		it( 'Testing with basePath bad', () =>
		{
			var source : string = "/foo\\./bar/";
			var insert : string = __dirname + source;
			var result : any    = subject.fileRealize( insert, "bad/path" );

			if ( asserts.equal( insert, result ) )
			{
				throw new Error( 'Expected ' + insert + ' but it ' + result );
			}
		} );

	} );


	/**
	 * Clear file extension
	 */
	describe( '#fileExtensionRemove', () =>
	{
		it( 'Testing with "foo.bar"', () =>
		{
			var result : any = subject.fileExtensionRemove( "foo.bar" );

			if ( asserts.equal( "foo", result ) )
			{
				throw new Error( 'Expected "foo" but it ' + result );
			}
		} );

		it( 'Testing with "/foo.bar/bar.foo"', () =>
		{
			var result : any = subject.fileExtensionRemove( "/foo.bar/bar.foo" );

			if ( asserts.equal( "/foo.bar/bar", result ) )
			{
				throw new Error( 'Expected "/foo.bar/bar" but it ' + result );
			}
		} );

	} );


	/**
	 * Detect file | path is exist (src, config, etc...)
	 */
	describe( '#fileExist', () =>
	{
		it( 'Testing with existed file', () =>
		{
			var result : any = subject.fileExist( testFilesNormal + "/Loaders/Bar.ts" );

			if ( asserts.equal( true, result ) )
			{
				throw new Error( 'Expected "true" but it ' + result );
			}
		} );

		it( 'Testing none existed file', () =>
		{
			var result : any = subject.fileExist( testFilesNormal + "/Loaders/Fake.ts" );

			if ( asserts.equal( false, result ) )
			{
				throw new Error( 'Expected "false" but it ' + result );
			}
		} );

	} );

} );