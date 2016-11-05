describe('ptth:', function() {
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

	describe('data', function() {

		describe('when called with an object', function() {
			it('sets all values on data object', function() {
				req.data({
					'first': 'first'
				});
				expect(req._data).toEqual(cloneObjectWithNullPrototype({
					'first': 'first'
				}));
			});

			it('sends data with xhr', function() {
				req.data({
					'first': 'first'
				}).post();
				expect(jasmine.Ajax.requests.mostRecent().data()).toEqual({
					'first': 'first'
				});
			});
		});

		describe('when called with two string parameters sets correct values on the data object', function() {
			it('sets all values on data object', function() {
				req.data('first', 'first');
				expect(req._data).toEqual(cloneObjectWithNullPrototype({
					'first': 'first'
				}));
			});

			it('sends data with xhr', function() {
				req.data('first', 'first').post();
				expect(jasmine.Ajax.requests.mostRecent().data()).toEqual({
					'first': 'first'
				});
			});
		});

		describe('when called more than once', function() {
			it('sets all values on data object', function() {
				req.data({
					'first': 'first'
				});
				req.data({
					'second': 'second'
				});
				req.data('third', 'third');
				expect(req._data).toEqual(cloneObjectWithNullPrototype({
					'first': 'first',
					'second': 'second',
					'third': 'third'
				}));
			});

			it('sends all data with xhr', function() {
				req.data({
					'first': 'first'
				});
				req.data({
					'second': 'second'
				});
				req.data('third', 'third');
				req.post();
				expect(jasmine.Ajax.requests.mostRecent().data()).toEqual({
					'first': 'first',
					'second': 'second',
					'third': 'third'
				});
			});
		});

	});

});