describe('ptth response', function () {
    var req;
    var OKResp = {
		'status': 200,
		'statusText': 'ok',
		'contentType': 'application/json',
		'responseText': 'ok response'
	};
	var NotFoundResp = {
		'status': 404,
		'statusText': 'not found',
		'contentType': 'application/json',
		'responseText': '404 not found',
	};
	var depthResp = {
		'status': 200,
		'statusText': 'ok',
		'contentType': 'application/json',
		'responseText': {
			'results': ['resultOne', 'resultTwo', 'resultThree'],
			'length': 3
		},
	};

    beforeEach(function () {
        jasmine.Ajax.install();
        req = new ptth('http://swapi.co/api/');
    });

    afterEach(function () {
    	ptth.reset();
        jasmine.Ajax.uninstall();
    });

    describe('should call callback', function() {
    	
    	var doneFn;
    	
    	beforeEach(function() {
    		doneFn = jasmine.createSpy("success");
    		req.get(doneFn);
    		jasmine.Ajax.requests.mostRecent().respondWith(OKResp);
    	});

    	it('correctly', function() {
    		expect(doneFn).toHaveBeenCalled();
    	});

    	it('with ptth.Response', function() {
    		var res = doneFn.calls.mostRecent().args[0];
    		expect(res).toEqual(jasmine.any(ptth.Response));
    	});

    });

    describe('on get success', function() {
    	
    	var doneFn, res;

    	beforeEach(function() {
    		doneFn = jasmine.createSpy("success");
    		req.get(doneFn);
    		jasmine.Ajax.requests.mostRecent().respondWith(OKResp);
    		res = doneFn.calls.mostRecent().args[0];
    	});

    	it('should have correct body', function() {
    		expect(res.body).toEqual('ok response');
    	});

    	it('should have correct status', function() {
    		expect(res.status).toEqual(200);
    	});

    	it('should have correct statusText', function() {
    		expect(res.statusText).toEqual('ok');
    	});

    	it('should have xhr object as property', function() {
    		expect(res.xhr).toEqual(jasmine.any(XMLHttpRequest));
    	});

    	it('should have correct method', function() {
    		expect(res.get).toEqual(true);
    		expect(res.post).toEqual(false);
    		expect(res.put).toEqual(false);
    		expect(res.patch).toEqual(false);
    		expect(res.head).toEqual(false);
    		expect(res.del).toEqual(false);
    		expect(res.options).toEqual(false);
    	});

    	it('should have correct status helper attributes', function() {
    		expect(res.ok).toEqual(true);
    		expect(res.info).toEqual(false);
    		expect(res.clientError).toEqual(false);
    		expect(res.serverError).toEqual(false);
    		expect(res.error).toEqual(false);
    		expect(res.notFound).toEqual(false);
    		expect(res.accepted).toEqual(false);
    		expect(res.forbidden).toEqual(false);
    		expect(res.badRequest).toEqual(false);
    		expect(res.unauthorized).toEqual(false);
    		expect(res.notAcceptable).toEqual(false);
    		expect(res.noContent).toEqual(false);
    	});

    });

	describe('on get error', function() {

		var doneFn, res;

    	beforeEach(function() {
    		doneFn = jasmine.createSpy("success");
    		req.get(doneFn);
    		jasmine.Ajax.requests.mostRecent().respondWith(NotFoundResp);
    		res = doneFn.calls.mostRecent().args[0];
    	});

    	it('should have correct body', function() {
    		expect(res.body).toEqual('404 not found');
    	});

    	it('should have correct method', function() {
    		expect(res.get).toBe(true);
    		expect(res.post).toBe(false);
    		expect(res.put).toBe(false);
    		expect(res.patch).toBe(false);
    		expect(res.head).toBe(false);
    		expect(res.del).toBe(false);
    		expect(res.options).toBe(false);
    	});

    	it('should have correct status helper attributes', function() {
    		expect(res.ok).toBe(false);
    		expect(res.info).toBe(false);
    		expect(res.clientError).toBe(true);
    		expect(res.serverError).toBe(false);
    		expect(res.error).toBe(true);
    		expect(res.notFound).toBe(true);
    		expect(res.accepted).toBe(false);
    		expect(res.forbidden).toBe(false);
    		expect(res.badRequest).toBe(false);
    		expect(res.unauthorized).toBe(false);
    		expect(res.notAcceptable).toBe(false);
    		expect(res.noContent).toBe(false);
    	});

	});

	describe('parsing', function() {

		var doneFn, res;

		beforeEach(function() {
    		doneFn = jasmine.createSpy("success");
    		req.parse(function(response) {
    			return response.results;
    		}).get(doneFn);
    		jasmine.Ajax.requests.mostRecent().respondWith(depthResp);
    		res = doneFn.calls.mostRecent().args[0];
		});

		it('should create correct result in res.body', function() {
			expect(res.body).toEqual(['resultOne', 'resultTwo', 'resultThree']);
		});

	});

});