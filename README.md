# ptth

A simple http client with middleware for the browser

## Installation
 
```javascript
npm install --save ptth
```

## Code Example

```javascript
ptth.use(function(res, next) {
	console.log(res.status);
});

ptth('http://swapi.co/api/starships')
	.header('content-type', 'application/json')
	.params('page', '2')
	.data({ 'form': 'data' })
	.post(function(res) {
		if (res.ok) {
			console.log(res.body);
		}
	});

// logs response status code and body of the response
``` 

## Motivation

Having experienced the power of the middleware pattern in Node.js and particularly Express, I wanted to replicate the workflow it encourages in a browser environment for HTTP calls.

Or grab the script from the [build folder](build/).

## API Reference

See the [docs](docs/docs.md).

## License

MIT