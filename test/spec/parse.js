describe('ptth', function() {
	var req;
	var swapiUrl = 'http://swapi.co/api';

	var OKResp = {
		'status': 200,
		'statusText': 'ok',
		'contentType': 'application/json',
		'responseText': {
			result: 'this is the result'
		}
	};

	beforeEach(function() {
		req = new ptth(swapiUrl);
		jasmine.Ajax.install();
	});

	afterEach(function() {
		ptth.reset();
		jasmine.Ajax.uninstall();
	});

	describe('parse', function() {

		it('sets provided function as the parser function for the resource', function() {
			var callback = function() {};
			req.parse(callback);
			expect(req.parser).toEqual(callback);
		});

		it('is called and sets result as the body property of the res object', function() {
			var doneFn = jasmine.createSpy("success");
			req.parse(function(res) {
				return res.result;
			}).get(doneFn);
			jasmine.Ajax.requests.mostRecent().respondWith(OKResp);
			expect(doneFn.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
				body: 'this is the result'
			}));
		});

	});

});