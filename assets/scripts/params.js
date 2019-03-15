/**
 * @file params.js
 * @date 6-25-2015
 *
 * Decorates the global object with methods for reading and modifying the
 * browser's URL parameter set, translating between the serialized 'search'
 * string and a structured map of parameters. These methods can be used to
 * update the URL as it appears after a page loads.
 */
(function(window, location, history, document, undefined) {

	function hasValue(value) {
		
		if(typeof value === 'undefined') {
			return false;
		}
		
		if(value === null) {
			return false;
		}
		
		if((typeof value === 'string' || value instanceof Array) && value.length === 0) {
			return false;
		}
		
		return true;
		
	}

	function getUrlParameters() {
		
		var hash = location.search,
			parameters = {};
		
		// @NOTE Hash length ignores leading '?' character
		if(!hash.length) {
			return parameters;
		}
		
		var pairs = hash.substr(1).split('&');
		
		for(var i = pairs.length; i--;) {
			
			var pair = pairs[i].split('=');
			
			pair[1] = decodeURIComponent(pair[1]); // Decode URI string
			
			parameters[pair[0]] = pair[1];
			
		}
		
		return parameters;
		
	}

	function setUrlParameters(params) {
		
		var items = [];
		
		for(var param in params) {
			
			if(params.hasOwnProperty(param)) {
			
				// Pass over empty strings, empty arrays, and null or undefined values
				if(!hasValue(params[param])) {
					continue;
				}
			
				if(params[param] instanceof Array) {
					params[param] = params[param].join(',');
				}
			
				items.push(param.toString() + '=' + params[param].toString());
				
			}
			
		}
		
		var url = location.origin + location.pathname;
		
		if(items.length) {
			 url += '?' + items.join('&');
		}
		
		history.replaceState({}, document.title, url);
		
	}
  
	// @NOTE Native window.location (and __proto__ property) is non-configurable

	if(!window.hasOwnProperty('getUrlParameters')) {
		Object.defineProperty(window, 'getUrlParameters', {
			value: getUrlParameters,
			writeable: false,
			configurable: true,
			enumerable: true
		});
	}

	if(!window.hasOwnProperty('setUrlParameters')) {
		Object.defineProperty(window, 'setUrlParameters', {
			value: setUrlParameters,
			writeable: false,
			configurable: true,
			enumerable: true
		});
	}

	// @NOTE See HTML5 File API specification (experimental)
	// https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL

}(window, window.location, window.history, window.document));

