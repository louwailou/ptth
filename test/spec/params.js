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

	describe('params', function() {
		
		describe('with one object param', function() {
			it('sets the param and value in the params object', function() {
				req.params({
					'first': 'first'
				});
				expect(req.parameters).toEqual(cloneObjectWithNullPrototype({
					'first': 'first'
				}));
			});
		});

		describe('with two string params', function() {
			it ('sets the param and value in the params object', function() {
				req.params('first', 'first');
				expect(req.parameters).toEqual(cloneObjectWithNullPrototype({
					'first': 'first'
				}));
			});
		});

		describe('with one object param with multiple params', function() {
			it('sets correct parameters', function() {
				req.params({'first': 'second', 'third': 'fourth'});
				expect(req.parameters).toEqual(cloneObjectWithNullPrototype({'first': 'second', 'third': 'fourth'}));
			});

		});

		describe('sends to correct url', function() {
			
			it('set with two strings', function() {
				req.params('page', 2).get();
				expect(jasmine.Ajax.requests.mostRecent().url).toEqual('http://swapi.co/api?page=2');
			});

			it('set with object', function() {
				req.params({'page': 2}).get();
				expect(jasmine.Ajax.requests.mostRecent().url).toEqual('http://swapi.co/api?page=2');
			});

			it('set multiple times', function() {
				req.params('page', 2).params('name', 'Fergus').get();
				expect(jasmine.Ajax.requests.mostRecent().url).toEqual('http://swapi.co/api?page=2&name=Fergus');
			});

		});

	});

	describe('params', function() {
		it('set with two strings', function() {
			req.params('page', 2).get();
			expect(jasmine.Ajax.requests.mostRecent().url).toEqual('http://swapi.co/api?page=2');
		});
		it('set with object', function() {
			req.params({'page': 2}).get();
			expect(jasmine.Ajax.requests.mostRecent().url).toEqual('http://swapi.co/api?page=2');
		});
		it('set multiple times', function() {
			req.params('page', 2).params('name', 'Fergus').get();
			expect(jasmine.Ajax.requests.mostRecent().url).toEqual('http://swapi.co/api?page=2&name=Fergus');
		});
	});

});