/**
 * Globals.
 */
const payloadMethods = ['post', 'patch', 'put'];

/**
 * Regexes.
 */
const leadingSlash = /^\//;
const httpBegins = /^https?:\/\//i;

/**
 * Cached types.
 */
export const types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  form: 'application/x-www-form-urlencoded'
};

/**
 * Serializer functions.
 */
export const serializers = {
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
export function isAbsoluteUrl(str) {
	return httpBegins.test(str);
}

/**
 * Throw Error err
 *
 * @param {String} Error message
 * @api private
 */
export function throwError(err) {
 	throw new Error(err);
}

/**
 * @param {Mixed} obj
 * @return {String}
 * @api private
 */
export function toString(obj) {
	return Object.prototype.toString.call(obj);
}

/**
 * Type check for object.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
export function isObject(obj) {
	return toString(obj) === '[object Object]';
}

/**
 * Type check for function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
export function isFunction(obj) {
	return obj && typeof obj === 'function';
}

/**
 * Type check for string.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
export function isString(obj) {
	return toString(obj) === '[object String]';
}

/**
 * Serialize data into URLEncoded format
 *
 * @param {Object} data
 * @return {String}
 * @api private
 */
export function serialize(data) {
  if (!isObject(data)) return data;
  const values = [];
  for (let key in data) {
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
export function hasProp(obj, property) {
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
export function extend(obj) {
	for (let i = 1, l = arguments.length; i < l; i++) {
		const source = arguments[i];
		for (const prop in source) {
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
export function forIn(obj, fn, ctx) {
	ctx = ctx || obj;
	for (let property in obj) {
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
export function objectSize(obj) {
	let size = 0, key;
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
export function endsWith(str, suffix) {
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
export function stringContains(str, substr) {
	return ~str.indexOf(substr);
}

/**
 * Find XHR object in window.
 * See superagent
 * https://github.com/visionmedia/superagent/blob/master/lib/client.js#L50
 */
export function getXHR() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else {
		try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
		try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
		try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
		try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
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
export function setHeaders(xhr, header, value) {
	if (isObject(header)) {
		forIn(header, function(_header, _value) {
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
export function setParams(url, params) {
	let str;
	if (objectSize(params) && !endsWith(url, '?')){
		url += '?';
	}
	forIn(params, function(property, value) {
		str = property + '=' + value + '&';
		url += str;
	});
	if (endsWith(url, '&')) 
		url = url.slice(0, -1);
	return url;
}

/**
 * Determines if an XMLHttpRequest has returned successfully or not.
 *
 * @param {String} status
 * @return {Boolean}
 * @api private
 */
export function isSuccess(status) {
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
export function parseResponseText(request) {
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
export function parseHeaders(headers) {
	const lines = headers.split(/\r?\n/);
	const result = Object.create(null);
	let prop, value;
	for (let i = 0, l = lines.length; i < l; i++) {
		let values = lines[i].split(':');
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
export function methodShouldHavePayload(method) {
	return payloadMethods.indexOf(method) >= -1; 
}

/**
 * Forces a redirect to provided url
 *
 * @param {String} Url to redirect to
 * @api private
 */
export function replaceWindowLocation(url) {
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
export function callMiddleware(handle, parameter, next) {
	return handle.call(parameter, parameter, next);
}