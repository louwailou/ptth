describe('ptth', function() {
	var req;
	var swapiUrl = 'http://swapi.co/api';

	var OKResp = {
		'status': 200,
		'statusText': 'ok',
		'contentType': 'application/json',
		'responseText': 'ok response'
	};

	beforeEach(function() {
		req = new ptth(swapiUrl);
		jasmine.Ajax.install();
	});

	afterEach(function() {
		ptth.reset();
		jasmine.Ajax.uninstall();
	});
	
	describe('before', function() {
			
		it('adds a callback to the before stack', function() {
			var callback = function() {};
			req.before(callback);
			expect(req.beforeStack[0]).toEqual({
				method: null,
				handle: callback
			});
		});

		it('adds a callback that gets called', function() {
			var doneFn = jasmine.createSpy("success");
			req.before(doneFn);
			req.get();
			expect(doneFn).toHaveBeenCalled();
		});

		it('adds a callback for a specific method', function() {
			var doneFn = jasmine.createSpy("success");
			req.before('get', doneFn);
			req.get();
			expect(doneFn).toHaveBeenCalled();
		});

		it('doesnt call the method when added for a specific method that doesnt get called', function() {
			var doneFn = jasmine.createSpy("success");
			req.before('get', doneFn);
			req.post();
			expect(doneFn).not.toHaveBeenCalled();
		});

	});

	describe('use', function() {
		
		it('adds a callback to the middleware stack', function() {
			var callback = function() {};
			req.use(callback);
			expect(req.stack[0]).toEqual({
				method: null,
				handle: callback
			});
		});

		it('adds a callback that gets called', function() {
			var doneFn = jasmine.createSpy("success");
			req.use(doneFn);
			req.get();
			expect(doneFn).not.toHaveBeenCalled();
			jasmine.Ajax.requests.mostRecent().respondWith(OKResp);
			expect(doneFn).toHaveBeenCalled();
		});

		it('adds a callback for a specific method that gets called', function() {
			var doneFn = jasmine.createSpy("success");
			req.use('get', doneFn);
			req.get();
			expect(doneFn).not.toHaveBeenCalled();
			jasmine.Ajax.requests.mostRecent().respondWith(OKResp);
			expect(doneFn).toHaveBeenCalled();
		});

		it('doesnt call the method when added for a specific method that doesnt get called', function() {
			var doneFn = jasmine.createSpy("success");
			req.use('get', doneFn);
			req.post();
			expect(doneFn).not.toHaveBeenCalled();
			jasmine.Ajax.requests.mostRecent().respondWith(OKResp);
			expect(doneFn).not.toHaveBeenCalled();
		});
	});

});