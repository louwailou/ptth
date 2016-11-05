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

	describe('enableReqWithHeader', function() {
		it('sets the _reqWithHeader flag to true', function() {
			req.enableReqWithHeader();
			expect(req._reqWithHeader).toEqual(true);
		});

		it('is sent on xhr object when it is sent', function() {
			req.enableReqWithHeader();
			req.get();
			expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual(jasmine.objectContaining({
				'X-Requested-With': "XMLHttpRequest"
			}));
		});
	});

	describe('disableReqWithHeader', function() {
		it('sets the _reqWithHeader flag to false', function() {
			req.disableReqWithHeader();
			expect(req._reqWithHeader).toEqual(false);
		});

		it('will send a request without a X-Requested-With header set', function() {
			req.disableReqWithHeader().get();
			expect(jasmine.Ajax.requests.mostRecent().requestHeaders).not.toEqual(jasmine.objectContaining({
				'X-Requested-With': 'XMLHttpRequest'
			}))
		});
	});

	describe('type', function() {

		describe('with one string param', function() {
			it('sets the Content-Type header to the provided value', function() {
				req.type('Fish');
				expect(req.headers['Content-Type']).toEqual('Fish');
			});
		});

		describe('with no params', function() {
			it('returns correct Content-Type header', function() {
				expect(req.type()).toEqual('application/json');
			});
		});

		describe('sends request', function() {
			it('with added Content-Type header', function() {
				req.type('fish').get();
				expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual(jasmine.objectContaining({
					'Content-Type': 'fish'
				}));
			});
		});

	});

	describe('accept', function() {

		describe('with one string param', function() {
			it('sets the Accept header to the provided value', function() {
				req.accept('Fish');
				expect(req.headers['Accept']).toEqual('Fish');
			});
		});

		describe('with no params', function() {
			it('returns correct Accept header', function() {
				expect(req.accept()).toEqual('application/json');
			});
		});

		describe('sends request', function() {
			it('with added accept header', function() {
				req.accept('fish').get();
				expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual(jasmine.objectContaining({
					'Accept': 'fish'
				}));
			});
		});

	});

	describe('header', function() {

		describe('with two parameters', function() {

			it('should set correct header on headers object', function() {
				req.header('header', 'value');
				expect(req.headers['header']).toEqual('value');
			});

			it('sends correct header on request', function() {
				req.header('header', 'value').get();
				expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual(jasmine.objectContaining({
					'header': 'value'
				}));
			});

		});

		describe('with single object parameter', function() {

			it('should set correct header on headers object', function() {
				req.header({ 'header': 'value' });
				expect(req.headers['header']).toEqual('value');
			});

			it('sends corret header on request', function() {
				req.header({ 'header': 'value' }).get();
				expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual(jasmine.objectContaining({
					'header': 'value'
				}));
			});

		});

		describe('with single string parameter', function() {

			it('should return correct header when it is set', function() {
				var result = req.header('Content-Type');
				expect(result).toEqual('application/json');
			});

			it('should return false when it is not set', function() {
				var result = req.header('Unset-Header');
				expect(result).toEqual(false);
			});

		});

	});

	describe('using', function() {

		describe('with one string param', function() {

			it('that corresponds to a set header to return true', function() {
				req.header('header', 'value');
				expect(req.using('header')).toEqual(true);
			});

			it('that doesnt correspond to a set header to return false', function() {
				expect(req.using('header')).toEqual(false);
			});

		});

		describe('with two string params', function() {

			it('that correspond to a set header with the provided value to return true', function() {
				req.header('header', 'value');
				expect(req.using('header', 'value')).toEqual(true);
			});

			it('that corresponds to a set header with an incorrect value to return false', function() {
				req.header('header', 'value');
				expect(req.using('header', 'eulav')).toEqual(false);
			});

			it('that corresponds to an unset header with a provided value to return false', function() {
				expect(req.using('header', 'value')).toEqual(false);
			});

		});

		describe('with a single object param', function() {

			it('that corresponds to one set header with the correct value to return true', function() {
				req.header('header', 'value');
				expect(req.using({ 'header': 'value' })).toEqual(true);
			});

			it('that corresponds to one set header with an incorrect value to return false', function() {
				req.header('header', 'value');
				expect(req.using({ 'header': 'eulav' })).toEqual(false);
			});

			it('that corresponds to multiple set headers with the correct values to return true', function() {
				req.header({
					'first': 'first',
					'second': 'second'
				});
				expect(req.using({
					'first': 'first',
					'second': 'second'
				})).toEqual(true);
			});

			it('that corresponds to multiple set headers with all incorrect values to return false', function() {
				req.header({
					'first': 'first',
					'second': 'second'
				});
				expect(req.using({
					'first': 'firsts',
					'second': 'seconds'
				})).toEqual(false);
			});

			it('that corresponds to multiple set headers with at least one correct value to return false', function() {
				req.header({
					'first': 'first',
					'second': 'second'
				});
				expect(req.using({
					'first': 'first',
					'second': 'seconds'
				})).toEqual(false);
			});

		});

	});

});