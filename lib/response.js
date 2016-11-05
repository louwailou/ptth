import { isAbsoluteUrl, parseResponseText, parseHeaders, replaceWindowLocation, stringContains } from './utils.js';

/**
 * Initialise a new Reponse object.
 *
 * @param {String} HTTP method
 * @param {XMLHttpRequest} xhr
 * @param {Resource} ptth.Resource object
 * @return {Response} self
 * @api public
 */

class Response {

	constructor(method, xhr, request) {
		this.method = method;
		this.request = request;
		this.xhr = xhr;
		this.url = this.xhr.responseURL;
		this.statusText = this.xhr.statusText;
		this.headers = parseHeaders(this.xhr.getAllResponseHeaders());
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

	parse() {
		if (this.method == 'head') return (this.xhr.responseText || null);
		return this.request.parser ? this.request.parser(this.xhr.responseText, this) : parseResponseText(this.xhr);
	}	

	/**
	 * Set method helper properties on this response.
	 *
	 * @param {String} HTTP method (lowercased)
	 * @return {Response}
	 * @api private
	 */
	 setMethod(method) {
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
	setStatus(status) {
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
	redirect(url) {
		replaceWindowLocation(url);
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
		return stringContains(this.url, str);
	}

}

export default Response;