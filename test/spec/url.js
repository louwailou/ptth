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

	describe('when sending requests', function() {

		describe('should send xhr with correct', function() {

			describe('url', function() {
				it('when set without a url', function() {
					var api = new ptth('/');
					api.get();
					expect(jasmine.Ajax.requests.mostRecent().url).toBe('/');
				});
				it('data with form content type', function() {
					req.type('form').data('name=Fergus').data('surname=Ruston').post();
					var xhr = jasmine.Ajax.requests.mostRecent();
					expect(xhr.url).toEqual("http://swapi.co/api?name=Fergus&surname=Ruston");
					expect(xhr.data()).toEqual({});
				});
			});

		});

	});

});