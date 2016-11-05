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

	describe('method abort', function() {
		
		it('aborts request before calling callback', function() {
			var doneFn = jasmine.createSpy("success");
			req.get(doneFn);
			req.abort();
			expect(doneFn).not.toHaveBeenCalled();
		});

	});

});