import * as _ from './utils.js';
import Response from './response.js';

/**
 * Cache globally set request headers to be set on all requests.
 * Bool to determine whether to set RequestedWith header.
 * Default headers for all requests. Overwritten by globalheaders then request specific headers.
 */
let globalHeaders = Object.create(null);
let globalReqWithHeader = true;
const defaultHeaders = Object.create(null);
defaultHeaders['Content-Type'] = defaultHeaders['Accept'] = _.types['json'];
let globalBeforeStack = [];
let globalStack = [];

/**
 * Initialise a new Request object.
 *
 * @param {String} url
 * @param {Number} id
 * @return {Request}
 * @api public
 */
class Request {

	constructor(url) {
		this._url = url || false;
		this._data = Object.create(null);
		this.headers = _.extend(Object.create(null), defaultHeaders, globalHeaders);
		this.parameters = Object.create(null);
		this.parser = null;
		this.beforeStack = [];
		this.stack = [];
		this._reqWithHeader = !!globalReqWithHeader;
		return this;
	}

	/**
	 * Set/get header/s for next request.
	 *
	 * @param {String|Object} header|header:value pairs
	 * @param {String|Boolean} value
	 * @return {Request}
	 * @api public
	 */
	header(header, value) {
		if (_.isObject(header)) {
			_.forIn(header, function(property, _value) {
				this.header(property, _value);
			}, this);
		} else {
			if (arguments.length == 1) {
				return this.headers[header] ? this.headers[header] : false;
			} else {
				if (value === false) {
					delete this.headers[header];
				} else {
					this.headers[header] = (_.types[value] || value);
				}
			}
		}
		return this;
	}

	/**
	 * Determine if a specific header is set for current request cycle.
	 * Pass value to determine if header is also set to value.
	 *
	 * @param {String|Object} header|header:value pairs
	 * @param {String} value
	 * @return {Boolean}
	 * @api public
	 */
	using(header, value) {
		if (header && !value) {
			if (_.isObject(header)) {
				let usingAll = true;
				_.forIn(header, (prop, val) => {
					usingAll = !!this.headers[prop] && this.headers[prop] == (_.types[val] || val);
				});
				return usingAll;
			} else {
				return !!this.headers[header];
			}
		} else if (header && value) {
			return !!this.headers[header] && this.headers[header] == (_.types[value] || value);
		}
		return false;
	}

	/**
	 * Set or get url set for next request
	 *
	 * @param {String} Content Type
	 * @return {Request|Boolean}
	 * @api public
	 */
	url(url) {
		this._url = url;
		return this;
	}

	/**
	 * Set or get Content-Type header for next request.
	 *
	 * @param {String} Content Type
	 * @return {Request|Boolean}
	 * @api public
	 */
	type(type) {
		if (!arguments.length) {
			return this.header('Content-Type');
		}
		this.header('Content-Type', _.types[type] || type);
		return this;
	}

	/**
	 * Set Accept header for next request.
	 *
	 * @param {String} Content Type
	 * @return {Request}
	 * @api public
	 */
	accept(type) {
		if (!arguments.length) {
			return this.header('Accept');
		}
		this.header('Accept', _.types[type] || type);
		return this;
	}

	/**
	 * Set boolean to determine if X-Requested-With header 
	 * is set to XMLHttpRequest on current request cycle or not.
	 *
	 * @param {Boolean}
	 * @return {Request}
	 * @api public
	 */
	enableReqWithHeader() {
		this._reqWithHeader = true;
		return this;
	}

	/**
	 * Set boolean to determine if X-Requested-With header 
	 * is set to XMLHttpRequest on current request cycle or not.
	 *
	 * @param {Boolean}
	 * @return {Request}
	 * @api public
	 */
	disableReqWithHeader() {
		this._reqWithHeader = false;
		return this;
	}

	/**
	 * Pass params to be set on the current url.
	 *
	 * @param {String|Object} property
	 * @param {String} value
	 * @return {Request}
	 * @api public
	 */
	params(property, value) {
		if (_.isObject(property)) {
			_.forIn(property, function(_property, _value) {
				this.params(_property, _value);
			}, this);
		} else {
			this.parameters[property] = value;
		}
		return this;
	}

	/**
	 * Add a function to be used to parse the response to
	 * the next request.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	parse(fn) {
		this.parser = fn;
		return this;
	}

	/**
	 * Add before middleware.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	before(method, handle) {
		if (_.isFunction(method)) {
			handle = method;
			method = null;
		}
		this.beforeStack.push({ method, handle })
		return this;
	}

	/**
	 * Add middleware.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	use(method, handle) {
		if (_.isFunction(method)) {
			handle = method;
			method = null;
		}
		this.stack.push({ method, handle })
		return this;
	}

	/**
	 * Reset properties on an instance to prepare it for a new
	 * request cycle.
	 *
	 * @return {Request}
	 * @api private
	 */
	reset() {
		this.headers = Object.create(null);
		this.parameters = Object.create(null);
		this.beforeStack = [];
		this.stack = [];
		this._data = Object.create(null);
		return this;
	}

	/**
	 * Attach data to be sent as payload with the next request.
	 *
	 * @param {Object|String} data
	 * @return {Request}
	 * @api public
	 */
	data(property, value) {
		
		if (_.isObject(property) && _.isObject(this._data)) {
			this._data = _.extend(this._data, property);
		} else 

		if (_.isString(property)) {
			if (value) {
				this._data[property] = value;
			} else {
				const pairs = property.split('&');
				for (var i = 0, l = pairs.length; i < l; i++) {
					let pair = pairs[i];
					pair = pair.split('=');
					this._data[pair[0]] = pair[1];
				}
			}
		} else {
			this._data = property;
		}
		return this;
	}

	/**
	 * Helper to determine if currently set URL contains str.
	 * 
	 * @param {String} str
	 * @return {Boolean}
	 * @api public
	 */
	urlContains(str) {
		return _.stringContains(this._url, str);
	}

	/**
	 * Make and start the middleware call stack for a specific stage of the req/res cycle
	 *
	 * @param {String} Stack of middleware.
	 * @param {Function} Method type used by request.
	 * @param {Function} Request or response to be used as the callback param for middleware.
	 * @api private
	 */
	startMiddleware(stack, method, parameter, endFn) {
		let index = 0;

		function next() {
			const layer = stack[index++];
			
			// end of stack
			if (!layer) return;

			if (layer.method) {
				if (method != layer.method) {
					return next();
				}
			}

			_.callMiddleware(layer.handle, parameter, next);
		}

		next();
		endFn && endFn();
	}

	/**
	 * Abort request before it is finished
	 *
	 * @return {Request}
	 * @api public
	 */
	abort() {
		this.xhr && this.xhr.abort();
		this.aborted = true;
		return this;
	}

	/**
	 * Send GET request with current instance, passing
	 * callback to be called after request finished.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	get(url, fn) {
		const method = 'GET';
		this.end(method, url, fn);
		return this;
	}

	/**
	 * Send POST request with current instance, passing
	 * callback to be called after request finished.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	post(url, fn) {
		const method = 'POST';
		this.end(method, url, fn);
		return this;
	}

	/**
	 * Send PUT request with current instance, passing
	 * callback to be called after request finished.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	put(url, fn) {
		const method = 'PUT';
		this.end(method, url, fn);
		return this;
	}

	/**
	 * Send PATCH request with current instance, passing
	 * callback to be called after request finished.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	patch(url, fn) {
		const method = 'PATCH';
		this.end(method, url, fn);
		return this;
	}

	/**
	 * Send HEAD request with current instance, passing
	 * callback to be called after request finished.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	head(url, fn) {
		const method = 'HEAD';
		this.end(method, url, fn);
		return this;
	}

	/**
	 * Send DELETE request with current instance, passing
	 * callback to be called after request finished.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	remove(url, fn) {
		const method = 'DELETE';
		this.end(method, url, fn);
		return this;
	}

	/**
	 * Send OPTIONS request with current instance, passing
	 * callback to be called after request finished.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	options(url, fn) {
		const method = 'OPTIONS';
		this.end(method, url, fn);
		return this;
	}

	/**
	 * End the current request cycle and send the XMLHttpRequest
	 * object with specified options, data and parameters.
	 * Fn gets called on completion of request.
	 *
	 * @param {String} method
	 * @param {Function} fn
	 * @return {Request}
	 * @api private
	 */
	end(method, url, fn) {
		delete this.aborted;
		const self = this;
		const stack = Array.prototype.concat.call(new Array, globalStack, this.stack);
		const xhr = this.xhr = _.getXHR();
		const params = this.parameters;
		const type = this.type();
		this.method = method.toLowerCase();

		if (_.isFunction(url)) {
			if (_.isString(fn)) {
				let tmp = url;
				url = fn;
				fn = tmp;
			} else {
				fn = url;
			}
		}
		
		if (_.isString(url)) {
			this._url = url;
		}

		let finalUrl = _.objectSize(params) ? _.setParams(this._url, params) : this._url;
		const serializer = _.serializers[type];

		// set X-Requested-With depending on global and instance based settings
		if (this._reqWithHeader === true || (this._reqWithHeader !== false && globalReqWithHeader === true)) {
			this.header('X-Requested-With', 'XMLHttpRequest');
		}

		xhr.onreadystatechange = function() {
			if (4 !== this.readyState) return;
			
			if (!self.aborted) {
				const res = new Response(self.method, xhr, self);
				
				if (fn && _.isFunction(fn)) {
					stack.push({ handle: fn });
				}

				self.startMiddleware(stack, self.method, res);
			}

			delete self.xhr;
		};

		this.before(() => {
			let data = _.objectSize(this._data) && _.methodShouldHavePayload(this.method) ? this._data : null;
			if (serializer && data != null) data = serializer(data);
			if (type == _.types['form'] && 'get' != this.method && 'head' != this.method) {
				finalUrl += '?' + data;
				data = null;
			}
			xhr.open(this.method.toUpperCase(), finalUrl, true);
			_.setHeaders(xhr, this.headers);
			xhr.send(data);
		});

		if (this.aborted) return;
		const beforeStack = Array.prototype.concat.call(new Array, globalBeforeStack, this.beforeStack);
		this.startMiddleware(beforeStack, this.method, self, () => {
			this.beforeStack.pop();
			this.parameters = Object.create(null);
			this._data = Object.create(null);
		});
		return this;
	}

}

function ptth(url) {
	return new Request(url);
};

/**
 * Add global before middleware.
 *
 * @param {Function} fn
 * @return {Request}
 * @api public
 */
ptth.before = function(method, handle) {
	if (_.isFunction(method)) {
		handle = method;
		method = null;
	}
	globalBeforeStack.push({ method, handle });
};

/**
 * Add global middleware.
 *
 * @param {Function} fn
 * @return {Request}
 * @api public
 */
ptth.use = function(method, handle) {
	if (_.isFunction(method)) {
		handle = method;
		method = null;
	}
	globalStack.push({ method, handle });
};

/**
 * Set global headers on all requests.
 * Will be overridden if same header is set on an instance.
 *
 * @param {String} header
 * @param {String} value
 * @api public
 */
ptth.header = function(header, value) {
	if (_.isObject(header)) {
		_.forIn(header, function(_header, _value) {
			Request.header(_header, _value);
		});
	} else {
		if (arguments.length == 1) {
			return globalheaders[header] ? globalheaders[header] : false;
		} else {
			if (value === false) {
				delete globalheaders[header];
			} else {
				globalheaders[header] = (_.types[value] || value);
			}
		}
	}
};

/**
 * Set global boolean to determine if X-Requested-With header 
 * is to be set to XMLHttpRequest or not, for all requests.
 * Overridden by instance based setting.
 * Default is true.
 *
 * @api public
 */
ptth.enableReqWithHeader = function() {
	globalReqWithHeader = true;
};

/**
 * Set global boolean to determine if X-Requested-With header 
 * is to be set to XMLHttpRequest or not, for all requests.
 * Overridden by instance based setting.
 * Default is true.
 *
 * @api public
 */
ptth.disableReqWithHeader = function() {
	globalReqWithHeader = false;
};

/**
 * Reset global cached variables.
 *
 * @param {Function}
 * @api public
 */
ptth.reset = function() {
	globalHeaders = Object.create(null);
	globalReqWithHeader = true;
};

ptth.Request = Request;
ptth.Response = Response;

export default ptth;