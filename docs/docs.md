# ptth

 
```javascript
npm install --save ptth
```


## Request

Create a request.

```javascript
var request = ptth();
```

### URL
Set URL for next request.

```javascript
request.url('http://swapi.co/api/');
```

The URL can also be set by passing a string parameter to the ptth function.

```javascript
var request = ptth('http://swapi.co/api/');
```

### Methods

Get, Post, Put, Patch, Head, Delete and Options calls can be sent via their corresponding, lowercase methods. Remove is used in place of Delete. If a callback function is provided it is added to the end of the middleware stack.

```javascript
request.get(function(res) {
	if (res.ok) {
		console.log(res.body);
	}
});
```

```javascript
request.remove(function(res) {
	if (res.ok) {
		console.log(res.body);
	}
});
```

A URL can also be set by providing it as the first parameter.

```javascript
request.get('http://swapi.co/api/', function(res) {
	if (res.ok) {
		console.log(res.body);
	}
});
```

### Middleware

Connect/express-like middleware for different stages in the request/response cycle. 

Bail out of a request early by omitting a call to `next()`. 

#### Before

```javascript
request.before(function(req, next) {
	const token = cookie.load('token');
    // only send request if we have a token
    if (token) {
        req.header('Authorization', token);
        next();
    } else {
        // user's token has expired and must sign in again
        // request is not sent
        window.location.href = '/login';
    }
});
```

#### Use

Define middleware to be called after the response has returned. Define logic once.

```javascript
request.use(function(res, next) {
	if (res.body.token) {
    	cookie.save('token', res.body.token);
    }
    next();
});
```

### Global middleware

Define middleware to be set on all requests.

```javascript
ptth.before(function(req, next) {
    // do something to request
    next();
});
```

```javascript
ptth.use(function(res, next) {
    // do something with response
    next();
});
```

### Data

Attach a payload for the next request.

```javascript 
request.data('parameter', 'value');
request.data({
	'parameter': 'value'
});
request.data('VariableOne=ValueOne&VariableTwo=ValueTwo');
```


### Headers

By default, all requests are created with `Content-Type` and `Accept` headers set to `application/json`.

#### Set

```javascript
request.header('Content-Type', 'application/json');

request.header({
	'Content-Type': 'application/json',
	'Accept': 'application/json'
});
```

#### Get

```javascript
const type = request.header('Content-Type');
```

#### Unset

```javascript
request.header('Content-Type', false);
```

#### Using

Check if a request has a given header set.

```javascript
request.using('Content-Type');
```

Check if a request has a given header set to a given value.

```javascript
request.using('Content-Type', 'application/json');
```

```javascript
request.using({
	'Content-Type': 'application/json',
	'Accept': 'application/json'
});
```

Only returns true if all provided property/value pairs match the request.

#### Convenience methods

```javascript
// Get 'Content-Type' header.
request.type();
// Set 'Content-Type' header.
request.type('application/json');
```

```javascript
// Get 'Accept' header.
request.accept();
// Set 'Accept' header.
request.accept('application/json');
```

#### Shorthands

```javascript
request.header('Content-Type', 'json');
// for 'application/json'

request.type('html'); 
// for 'text/html'

request.accept('xml'); 
// for 'application/xml'

request.using('Content-Type', 'form'); 
// for 'application/x-www-form-urlencoded'
```

### Params

Add url parameters.

```javascript
request.params('property', 'value');

request.params({
	'first': 'pair',
	'second': 'pair'
});
```

### Parse

Add a parser function to determine which part of the XHR's responseText is set on the response object's `body` property.

```javascript
request.parse(function(responseText) {
	return responseText.result;
});
```

### reset

Reset currently set headers, params, data and both middleware stacks.

```javascript
request.reset();
```

### X-Rquested-With header

Set/unset `X-Requested-With` header to `XMLHttpRequest`.

```javascript
request.enableReqWithHeader();

request.disableReqWithHeader();
```

### urlContains

Convenience method to test if the current url contains provided string parameter. Useful for applying middleware to requests to specific urls.

```javascript
request.get(function(req, next) {
	if (req.urlContains(string)) {
    	// do something
    }
    next();
});
```

## Response

### Properties

```javascript

request.get(function(res, next) {
	res.url // url of request
    res.method // method of request
    res.type // content-type of response
    res.status // status of response
    res.statusType // status type of response
   
   	// boolean values denoting the status of the response
    res.ok // 2** status
    res.info // 1** status
    res.clientError // 4** status
    res.serverError // 5** status
    res.error // 4** status or 5** status

    res.notFound // 404
    res.accepted // 202 
    res.forbidden // 403
    res.badRequest // 400
    res.unauthorized // 401 
    res.notAcceptable // 406
    res.noContent // 204 || 1223
    
    // boolean values denoting the method type of the request
    res.get 
    res.post
    res.put 
    res.patch
    res.head 
    res.del 
    res.options
});
```

## Example use cases

Create an instance to send all authenticated requests from.

```javascript
const authorisedRequests = ptth();

authorisedRequests.before(function(req, next) {
    const token = cookie.load('token');
    // only send request if we have a token
    if (token) {
        req.header('Authorization', token);
        next();
    } else {
        // user's token has expired and must sign in again
        // request is not sent
        window.location.href = '/login';
    }
});

authorisedRequests.use(function(res, next) {
    if (res.unauthorised) {
        // user's token has expired on the server
        // redirect them to login again
        window.location.href = '/login';
    } else 

    if (res.body.token) {
        cookie.save('token', res.body.token);
        next();
    }
});

// elsewhere in code
authorisedRequests.get('/api/endpoint', function(res) {
    // user is authenticated - do something with response. 
});

// elsewhere - use same ptth instance
authorisedRequests.get('/api/endpoint/2', function(res) {
    // user is authenticated 
});
```

Middleware stacks and headers persist between requests from each instance (middleware passed as callback functions to get, head, etc. do not persist), unless `reset` is called. Data and params are reset after each request is sent. 

