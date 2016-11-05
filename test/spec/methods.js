describe('ptth', function() {
	var req;
	var swapiUrl = 'http://swapi.co/api';

	beforeEach(function() {
		req = new ptth(swapiUrl);
		jasmine.Ajax.install();
	});

	afterEach(function() {
		ptth.reset();
		jasmine.Ajax.uninstall();
	});

	describe('sends correct method on request from corresponding ptth.method:', function() {
		it('get', function() {
			req.get();
			expect(jasmine.Ajax.requests.mostRecent().method).toEqual('GET');
		});
		it('post', function() {
			req.post();
			expect(jasmine.Ajax.requests.mostRecent().method).toEqual('POST');
		});
		it('put', function() {
			req.put();
			expect(jasmine.Ajax.requests.mostRecent().method).toEqual('PUT');
		});
		it('patch', function() {
			req.patch();
			expect(jasmine.Ajax.requests.mostRecent().method).toEqual('PATCH');
		});
		it('head', function() {
			req.head();
			expect(jasmine.Ajax.requests.mostRecent().method).toEqual('HEAD');
		});
		it('delete with remove method', function() {
			req.remove();
			expect(jasmine.Ajax.requests.mostRecent().method).toEqual('DELETE');
		});
		it('options', function() {
			req.options();
			expect(jasmine.Ajax.requests.mostRecent().method).toEqual('OPTIONS');
		});
	});

});