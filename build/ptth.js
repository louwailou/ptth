(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ptth", [], factory);
	else if(typeof exports === 'object')
		exports["ptth"] = factory();
	else
		root["ptth"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Request = __webpack_require__(/*! ./lib/request.js */ 1).default;
	
	module.exports = Request;

/***/ },
/* 1 */
/*!************************!*\
  !*** ./lib/request.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(/*! ./utils.js */ 2);
	
	var _ = _interopRequireWildcard(_utils);
	
	var _response = __webpack_require__(/*! ./response.js */ 3);
	
	var _response2 = _interopRequireDefault(_response);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Cache globally set request headers to be set on all requests.
	 * Bool to determine whether to set RequestedWith header.
	 * Default headers for all requests. Overwritten by globalheaders then request specific headers.
	 */
	var globalHeaders = Object.create(null);
	var globalReqWithHeader = true;
	var defaultHeaders = Object.create(null);
	defaultHeaders['Content-Type'] = defaultHeaders['Accept'] = _.types['json'];
	var globalBeforeStack = [];
	var globalStack = [];
	
	/**
	 * Initialise a new Request object.
	 *
	 * @param {String} url
	 * @param {Number} id
	 * @return {Request}
	 * @api public
	 */
	
	var Request = function () {
		function Request(url) {
			_classCallCheck(this, Request);
	
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
	
	
		_createClass(Request, [{
			key: 'header',
			value: function header(_header2, value) {
				if (_.isObject(_header2)) {
					_.forIn(_header2, function (property, _value) {
						this.header(property, _value);
					}, this);
				} else {
					if (arguments.length == 1) {
						return this.headers[_header2] ? this.headers[_header2] : false;
					} else {
						if (value === false) {
							delete this.headers[_header2];
						} else {
							this.headers[_header2] = _.types[value] || value;
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
	
		}, {
			key: 'using',
			value: function using(header, value) {
				var _this = this;
	
				if (header && !value) {
					if (_.isObject(header)) {
						var usingAll = true;
						_.forIn(header, function (prop, val) {
							usingAll = !!_this.headers[prop] && _this.headers[prop] == (_.types[val] || val);
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
	
		}, {
			key: 'url',
			value: function url(_url) {
				this._url = _url;
				return this;
			}
	
			/**
	   * Set or get Content-Type header for next request.
	   *
	   * @param {String} Content Type
	   * @return {Request|Boolean}
	   * @api public
	   */
	
		}, {
			key: 'type',
			value: function type(_type) {
				if (!arguments.length) {
					return this.header('Content-Type');
				}
				this.header('Content-Type', _.types[_type] || _type);
				return this;
			}
	
			/**
	   * Set Accept header for next request.
	   *
	   * @param {String} Content Type
	   * @return {Request}
	   * @api public
	   */
	
		}, {
			key: 'accept',
			value: function accept(type) {
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
	
		}, {
			key: 'enableReqWithHeader',
			value: function enableReqWithHeader() {
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
	
		}, {
			key: 'disableReqWithHeader',
			value: function disableReqWithHeader() {
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
	
		}, {
			key: 'params',
			value: function params(property, value) {
				if (_.isObject(property)) {
					_.forIn(property, function (_property, _value) {
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
	
		}, {
			key: 'parse',
			value: function parse(fn) {
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
	
		}, {
			key: 'before',
			value: function before(method, handle) {
				if (_.isFunction(method)) {
					handle = method;
					method = null;
				}
				this.beforeStack.push({ method: method, handle: handle });
				return this;
			}
	
			/**
	   * Add middleware.
	   *
	   * @param {Function} fn
	   * @return {Request}
	   * @api public
	   */
	
		}, {
			key: 'use',
			value: function use(method, handle) {
				if (_.isFunction(method)) {
					handle = method;
					method = null;
				}
				this.stack.push({ method: method, handle: handle });
				return this;
			}
	
			/**
	   * Reset properties on an instance to prepare it for a new
	   * request cycle.
	   *
	   * @return {Request}
	   * @api private
	   */
	
		}, {
			key: 'reset',
			value: function reset() {
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
	
		}, {
			key: 'data',
			value: function data(property, value) {
	
				if (_.isObject(property) && _.isObject(this._data)) {
					this._data = _.extend(this._data, property);
				} else if (_.isString(property)) {
					if (value) {
						this._data[property] = value;
					} else {
						var pairs = property.split('&');
						for (var i = 0, l = pairs.length; i < l; i++) {
							var pair = pairs[i];
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
	
		}, {
			key: 'urlContains',
			value: function urlContains(str) {
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
	
		}, {
			key: 'startMiddleware',
			value: function startMiddleware(stack, method, parameter, endFn) {
				var index = 0;
	
				function next() {
					var layer = stack[index++];
	
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
	
		}, {
			key: 'abort',
			value: function abort() {
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
	
		}, {
			key: 'get',
			value: function get(url, fn) {
				var method = 'GET';
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
	
		}, {
			key: 'post',
			value: function post(url, fn) {
				var method = 'POST';
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
	
		}, {
			key: 'put',
			value: function put(url, fn) {
				var method = 'PUT';
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
	
		}, {
			key: 'patch',
			value: function patch(url, fn) {
				var method = 'PATCH';
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
	
		}, {
			key: 'head',
			value: function head(url, fn) {
				var method = 'HEAD';
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
	
		}, {
			key: 'remove',
			value: function remove(url, fn) {
				var method = 'DELETE';
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
	
		}, {
			key: 'options',
			value: function options(url, fn) {
				var method = 'OPTIONS';
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
	
		}, {
			key: 'end',
			value: function end(method, url, fn) {
				var _this2 = this;
	
				delete this.aborted;
				var self = this;
				var stack = Array.prototype.concat.call(new Array(), globalStack, this.stack);
				var xhr = this.xhr = _.getXHR();
				var params = this.parameters;
				var type = this.type();
				this.method = method.toLowerCase();
	
				if (_.isFunction(url)) {
					if (_.isString(fn)) {
						var tmp = url;
						url = fn;
						fn = tmp;
					} else {
						fn = url;
					}
				}
	
				if (_.isString(url)) {
					this._url = url;
				}
	
				var finalUrl = _.objectSize(params) ? _.setParams(this._url, params) : this._url;
				var serializer = _.serializers[type];
	
				// set X-Requested-With depending on global and instance based settings
				if (this._reqWithHeader === true || this._reqWithHeader !== false && globalReqWithHeader === true) {
					this.header('X-Requested-With', 'XMLHttpRequest');
				}
	
				xhr.onreadystatechange = function () {
					if (4 !== this.readyState) return;
	
					if (!self.aborted) {
						var res = new _response2.default(self.method, xhr, self);
	
						if (fn && _.isFunction(fn)) {
							stack.push({ handle: fn });
						}
	
						self.startMiddleware(stack, self.method, res);
					}
	
					delete self.xhr;
				};
	
				this.before(function () {
					var data = _.objectSize(_this2._data) && _.methodShouldHavePayload(_this2.method) ? _this2._data : null;
					if (serializer && data != null) data = serializer(data);
					if (type == _.types['form'] && 'get' != _this2.method && 'head' != _this2.method) {
						finalUrl += '?' + data;
						data = null;
					}
					xhr.open(_this2.method.toUpperCase(), finalUrl, true);
					_.setHeaders(xhr, _this2.headers);
					xhr.send(data);
				});
	
				if (this.aborted) return;
				var beforeStack = Array.prototype.concat.call(new Array(), globalBeforeStack, this.beforeStack);
				this.startMiddleware(beforeStack, this.method, self, function () {
					_this2.beforeStack.pop();
					_this2.parameters = Object.create(null);
					_this2._data = Object.create(null);
				});
				return this;
			}
		}]);
	
		return Request;
	}();
	
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
	ptth.before = function (method, handle) {
		if (_.isFunction(method)) {
			handle = method;
			method = null;
		}
		globalBeforeStack.push({ method: method, handle: handle });
	};
	
	/**
	 * Add global middleware.
	 *
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	ptth.use = function (method, handle) {
		if (_.isFunction(method)) {
			handle = method;
			method = null;
		}
		globalStack.push({ method: method, handle: handle });
	};
	
	/**
	 * Set global headers on all requests.
	 * Will be overridden if same header is set on an instance.
	 *
	 * @param {String} header
	 * @param {String} value
	 * @api public
	 */
	ptth.header = function (header, value) {
		if (_.isObject(header)) {
			_.forIn(header, function (_header, _value) {
				Request.header(_header, _value);
			});
		} else {
			if (arguments.length == 1) {
				return globalheaders[header] ? globalheaders[header] : false;
			} else {
				if (value === false) {
					delete globalheaders[header];
				} else {
					globalheaders[header] = _.types[value] || value;
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
	ptth.enableReqWithHeader = function () {
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
	ptth.disableReqWithHeader = function () {
		globalReqWithHeader = false;
	};
	
	/**
	 * Reset global cached variables.
	 *
	 * @param {Function}
	 * @api public
	 */
	ptth.reset = function () {
		globalHeaders = Object.create(null);
		globalReqWithHeader = true;
	};
	
	ptth.Request = Request;
	ptth.Response = _response2.default;
	
	exports.default = ptth;

/***/ },
/* 2 */
/*!**********************!*\
  !*** ./lib/utils.js ***!
  \**********************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isAbsoluteUrl = isAbsoluteUrl;
	exports.throwError = throwError;
	exports.toString = toString;
	exports.isObject = isObject;
	exports.isFunction = isFunction;
	exports.isString = isString;
	exports.serialize = serialize;
	exports.hasProp = hasProp;
	exports.extend = extend;
	exports.forIn = forIn;
	exports.objectSize = objectSize;
	exports.endsWith = endsWith;
	exports.stringContains = stringContains;
	exports.getXHR = getXHR;
	exports.setHeaders = setHeaders;
	exports.setParams = setParams;
	exports.isSuccess = isSuccess;
	exports.parseResponseText = parseResponseText;
	exports.parseHeaders = parseHeaders;
	exports.methodShouldHavePayload = methodShouldHavePayload;
	exports.replaceWindowLocation = replaceWindowLocation;
	exports.callMiddleware = callMiddleware;
	/**
	 * Globals.
	 */
	var payloadMethods = ['post', 'patch', 'put'];
	
	/**
	 * Regexes.
	 */
	var leadingSlash = /^\//;
	var httpBegins = /^https?:\/\//i;
	
	/**
	 * Cached types.
	 */
	var types = exports.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  form: 'application/x-www-form-urlencoded'
	};
	
	/**
	 * Serializer functions.
	 */
	var serializers = exports.serializers = {
	  'application/x-www-form-urlencoded': serialize,
	  'application/json': JSON.stringify
	};
	
	/**
	 * Determine if str begins with http/s.
	 *
	 * @param {String} str
	 * @return {Boolean}
	 * @api private
	 */
	function isAbsoluteUrl(str) {
	  return httpBegins.test(str);
	}
	
	/**
	 * Throw Error err
	 *
	 * @param {String} Error message
	 * @api private
	 */
	function throwError(err) {
	  throw new Error(err);
	}
	
	/**
	 * @param {Mixed} obj
	 * @return {String}
	 * @api private
	 */
	function toString(obj) {
	  return Object.prototype.toString.call(obj);
	}
	
	/**
	 * Type check for object.
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 * @api private
	 */
	function isObject(obj) {
	  return toString(obj) === '[object Object]';
	}
	
	/**
	 * Type check for function.
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 * @api private
	 */
	function isFunction(obj) {
	  return obj && typeof obj === 'function';
	}
	
	/**
	 * Type check for string.
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 * @api private
	 */
	function isString(obj) {
	  return toString(obj) === '[object String]';
	}
	
	/**
	 * Serialize data into URLEncoded format
	 *
	 * @param {Object} data
	 * @return {String}
	 * @api private
	 */
	function serialize(data) {
	  if (!isObject(data)) return data;
	  var values = [];
	  for (var key in data) {
	    if (data[key] !== null) {
	      values.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	    }
	  }
	  return values.join('&');
	}
	
	/**
	 * Check if obj has the specified property defined.
	 * True even if value is null/undefined.
	 *
	 * @param {Object} obj
	 * @param {String} property
	 * @return {Boolean}
	 * @api private
	 */
	function hasProp(obj, property) {
	  return Object.prototype.hasOwnProperty.call(obj, property);
	}
	
	/**
	 * Extend obj with an arbitrary number of source objects.
	 *
	 * @param {Object} obj - Host to extend.
	 * @param {Object} obj - Add to host, ad infinitum.
	 * @return {Object} - Host.
	 * @api private
	 */
	function extend(obj) {
	  for (var i = 1, l = arguments.length; i < l; i++) {
	    var source = arguments[i];
	    for (var prop in source) {
	      if (hasProp(source, prop)) {
	        obj[prop] = source[prop];
	      }
	    }
	  }
	  return obj;
	}
	
	/**
	 * Enumerate over the properties of obj, calling function 'fn'
	 * for each property: value pair in turn. If ctx is provided,
	 * fn is bound to it, otherwise bound to obj.
	 *
	 * @param {Object} obj
	 * @param {Function} fn
	 * @param {Mixed} ctx
	 * @api private
	 */
	function forIn(obj, fn, ctx) {
	  ctx = ctx || obj;
	  for (var property in obj) {
	    if (hasProp(obj, property)) {
	      fn.call(ctx, property, obj[property]);
	    }
	  }
	}
	
	/**
	 * Get length of obj keys, including properties 
	 * set to null or undefined.
	 *
	 * @param {Object} obj
	 * @return {Number}
	 * @api private
	 */
	function objectSize(obj) {
	  var size = 0,
	      key = void 0;
	  for (key in obj) {
	    if (hasProp(obj, key)) size++;
	  }
	  return size;
	}
	
	/**
	 * Determine if str ends with suffix.
	 *
	 * @param {String} str
	 * @param {String} suffix
	 * @return {Boolean}
	 * @api private
	 */
	function endsWith(str, suffix) {
	  return str.slice(-suffix.length) == suffix;
	}
	
	/**
	 * Determine if str contains substr
	 * 
	 * @param {String} str
	 * @param {String} substr
	 * @return {Boolean}
	 * @api private
	 */
	function stringContains(str, substr) {
	  return ~str.indexOf(substr);
	}
	
	/**
	 * Find XHR object in window.
	 * See superagent
	 * https://github.com/visionmedia/superagent/blob/master/lib/client.js#L50
	 */
	function getXHR() {
	  if (window.XMLHttpRequest) {
	    return new XMLHttpRequest();
	  } else {
	    try {
	      return new ActiveXObject('Microsoft.XMLHTTP');
	    } catch (e) {}
	    try {
	      return new ActiveXObject('Msxml2.XMLHTTP.6.0');
	    } catch (e) {}
	    try {
	      return new ActiveXObject('Msxml2.XMLHTTP.3.0');
	    } catch (e) {}
	    try {
	      return new ActiveXObject('Msxml2.XMLHTTP');
	    } catch (e) {}
	  }
	}
	
	/**
	 * Set request headers on provided XMLHttpRequest object.
	 *
	 * @param {XMLHttpRequest} xhr
	 * @param {Object|String} header
	 * @param {String} value
	 * @return {XMLHttpRequest}
	 * @api private
	 */
	function setHeaders(xhr, header, value) {
	  if (isObject(header)) {
	    forIn(header, function (_header, _value) {
	      setHeaders(xhr, _header, _value);
	    });
	  } else {
	    xhr.setRequestHeader(header, value);
	  }
	  return xhr;
	}
	
	/**
	 * Set url parameters from provided hash map on given string.
	 *
	 * @param {String} url
	 * @param {Object} params
	 * @return {String}
	 * @api private
	 */
	function setParams(url, params) {
	  var str = void 0;
	  if (objectSize(params) && !endsWith(url, '?')) {
	    url += '?';
	  }
	  forIn(params, function (property, value) {
	    str = property + '=' + value + '&';
	    url += str;
	  });
	  if (endsWith(url, '&')) url = url.slice(0, -1);
	  return url;
	}
	
	/**
	 * Determines if an XMLHttpRequest has returned successfully or not.
	 *
	 * @param {String} status
	 * @return {Boolean}
	 * @api private
	 */
	function isSuccess(status) {
	  return status >= 200 && status < 300;
	}
	
	/**
	 * Parse provided response. Attempts JSON first, then falls back to
	 * responseText if that fails.
	 *
	 * @param {XMLHttpRequest} xhr
	 * @return {String}
	 * @api private
	 */
	function parseResponseText(request) {
	  try {
	    return JSON.parse(request.responseText);
	  } catch (e) {
	    return request.responseText;
	  }
	}
	
	/**
	 * Parse provided headers from xhr.getAllResponseHeaders()
	 *
	 * @param {String} headers
	 * @return {Object}
	 * @api private
	 */
	function parseHeaders(headers) {
	  var lines = headers.split(/\r?\n/);
	  var result = Object.create(null);
	  var prop = void 0,
	      value = void 0;
	  for (var i = 0, l = lines.length; i < l; i++) {
	    var values = lines[i].split(':');
	    prop = values[0];
	    value = values[1];
	    if (prop && value) result[prop.trim()] = value.trim();
	  }
	  return result;
	}
	
	/**
	 * Determines if a given method is a post, patch or put method
	 *
	 * @param {String} Method
	 * @return {Boolean}
	 * @api private
	 */
	function methodShouldHavePayload(method) {
	  return payloadMethods.indexOf(method) >= -1;
	}
	
	/**
	 * Forces a redirect to provided url
	 *
	 * @param {String} Url to redirect to
	 * @api private
	 */
	function replaceWindowLocation(url) {
	  if (!isAbsoluteUrl(url)) {
	    url = window.location.host + url;
	  }
	  window.location.assign(url);
	}
	
	/**
	 * Calls a middleware stack for a request cycle
	 *
	 * @param {Function} Middleware stack function to call
	 * @param {Resource/Response} Callback parameter to call handle with. 
	 * @param {Function} Next function to pass to handle.
	 * @api private
	 */
	function callMiddleware(handle, parameter, next) {
	  return handle.call(parameter, parameter, next);
	}

/***/ },
/* 3 */
/*!*************************!*\
  !*** ./lib/response.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(/*! ./utils.js */ 2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Initialise a new Reponse object.
	 *
	 * @param {String} HTTP method
	 * @param {XMLHttpRequest} xhr
	 * @param {Resource} ptth.Resource object
	 * @return {Response} self
	 * @api public
	 */
	
	var Response = function () {
		function Response(method, xhr, request) {
			_classCallCheck(this, Response);
	
			this.method = method;
			this.request = request;
			this.xhr = xhr;
			this.url = this.xhr.responseURL;
			this.statusText = this.xhr.statusText;
			this.headers = (0, _utils.parseHeaders)(this.xhr.getAllResponseHeaders());
			this.setMethod(method);
			this.setStatus(this.xhr.status);
			this.type = this.xhr.getResponseHeader('content-type');
			this.text = this.xhr.responseText;
			this.body = this.parse();
			return this;
		}
	
		/**
	  * Parse a XMLHttpRequest object's response.
	  *
	  * @return {String}
	  * @api private
	  */
	
		_createClass(Response, [{
			key: 'parse',
			value: function parse() {
				if (this.method == 'head') return this.xhr.responseText || null;
				return this.request.parser ? this.request.parser(this.xhr.responseText, this) : (0, _utils.parseResponseText)(this.xhr);
			}
	
			/**
	   * Set method helper properties on this response.
	   *
	   * @param {String} HTTP method (lowercased)
	   * @return {Response}
	   * @api private
	   */
	
		}, {
			key: 'setMethod',
			value: function setMethod(method) {
				this.get = method == 'get';
				this.post = method == 'post';
				this.put = method == 'put';
				this.patch = method == 'patch';
				this.head = method == 'head';
				this.del = method == 'delete';
				this.options = method == 'options';
				return this;
			}
	
			/**
	  * Set status helper properties on this response.
	  *
	  * @param {String} numerical HTTP status
	  * @return {Response}
	  * @api private
	  */
	
		}, {
			key: 'setStatus',
			value: function setStatus(status) {
				var type = status / 100 | 0;
				this.status = status;
				this.statusType = type;
	
				this.ok = type == 2;
				this.info = type == 1;
				this.clientError = type == 4;
				this.serverError = type == 5;
				this.error = !!this.clientError || !!this.serverError;
	
				this.notFound = this.status == 404;
				this.accepted = this.status == 202;
				this.forbidden = this.status == 403;
				this.badRequest = this.status == 400;
				this.unauthorized = this.status == 401;
				this.notAcceptable = this.status == 406;
				this.noContent = this.status == 204 || this.status == 1223;
				// http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
				return this;
			}
	
			/**
	   * Helper to redirect page to provided URL.
	   *
	   * @param {String} URL to redirect to
	   * @return {Response}
	   * @api public
	   */
	
		}, {
			key: 'redirect',
			value: function redirect(url) {
				(0, _utils.replaceWindowLocation)(url);
				return this;
			}
	
			/**
	   * Helper to determine if currently set URL contains str.
	   * 
	   * @param {String} str
	   * @return {Boolean}
	   * @api public
	   */
	
		}, {
			key: 'urlContains',
			value: function urlContains(str) {
				return (0, _utils.stringContains)(this.url, str);
			}
		}]);
	
		return Response;
	}();
	
	exports.default = Response;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ptth.js.map