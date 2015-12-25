/// <reference path="../typings/mocha/mocha.d.ts" />
import Boot from '../src/Boot/Provider';

describe('Boot.Provider', () =>
{
	var subject : Boot.Provider;

	beforeEach(function ()
	{
		subject = new Boot.Provider();
	});

	describe('#add', () =>
	{
		it('should add two numbers together', () =>
		{
			var result : string = subject.parseNameFromPath("/foo/bar/filename.js");
			console.log(result);
			/*if (result !== 5)
			{
				throw new Error('Expected 2 + 3 = 5 but was ' + result);
			}*/
		});
	});

	/*var subject : Boot.Provider;

	beforeEach(function () {
		subject = new Boot.Provider();
	});

	describe('#add', () => {
		it('should add two numbers together', () => {
			var result : number = subject.add(2, 3);
			if (result !== 5) {
				throw new Error('Expected 2 + 3 = 5 but was ' + result);
			}
		});
	});*/
});