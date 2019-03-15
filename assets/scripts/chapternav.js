(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var BrowserData = require('./ac-browser/BrowserData');
var webkitRegExp = /applewebkit/i;
var IE = require('./ac-browser/IE');

/**
 * Reports information about the user's browser and device
 * based on the userAgent string and feature detection.
 * @reference http://www.quirksmode.org/js/detect.html
 * @name module:ac-browser
 * @kind namespace
 */
var browser = BrowserData.create();

/**
 * Returns true/false whether the browser is WebKit based
 * @param  {String}  userAgentString
 * @return {Boolean}
 * @name module:ac-browser.isWebKit
 * @kind function
 */
browser.isWebKit = function(userAgentString) {
	var userAgent = userAgentString || window.navigator.userAgent;
	return userAgent ? !! webkitRegExp.test(userAgent) : false;
};

/**
 * @type {String}
 * @name module:ac-browser.lowerCaseUserAgent
 */
browser.lowerCaseUserAgent = navigator.userAgent.toLowerCase();

if (browser.name === 'IE') {
	/**
	 * Only available in Internet Explorer
	 * @name module:ac-browser.IE
	 * @kind namespace
	 */
	browser.IE = {
		/**
		 * The emulated Internet Explorer version, which may not match actual version
		 * @name module:ac-browser.IE.documentMode
		 * @type {Number}
		 */
		documentMode: IE.getDocumentMode()
	};
}

module.exports = browser;

// ac-browser@0.5.0

},{"./ac-browser/BrowserData":2,"./ac-browser/IE":3}],2:[function(require,module,exports){
'use strict';

require('@marcom/ac-polyfills/Array/prototype.filter');
require('@marcom/ac-polyfills/Array/prototype.some');

var _data = require('./data');

function BrowserData() { }

BrowserData.prototype = {
	/**
	 * Parses string (such as userAgent) and returns the browser version
	 * @param  {String} stringToSearch
	 * @return {Number}
	 */
	__getBrowserVersion: function(stringToSearch, identity) {
		var version;

		if (!stringToSearch || !identity) {
			return;
		}

		// Filters data.browser for the members with identities equal to identity
		var filteredData = _data.browser.filter(function(item) {
			return item.identity === identity;
		});

		filteredData.some(function (item) {
			var versionSearchString = item.versionSearch || identity;
			var index = stringToSearch.indexOf(versionSearchString);

			if (index > -1) {
				version = parseFloat(stringToSearch.substring(index + versionSearchString.length + 1));
				return true;
			}
		});

		return version;
	},

	/**
	 * Alias for __getIdentityStringFromArray
	 * @param  {Array} browserData | Expects data.browser
	 * @return {String}
	 */
	__getName: function(dataBrowser) {
		return this.__getIdentityStringFromArray(dataBrowser);
	},

	/**
	 * Expects single member of data.browser or data.os
	 * and returns a string to be used in os or name.
	 * @param  {Object} item
	 * @return {String}
	 */
	__getIdentity: function(item) {
		if (item.string) {
			return this.__matchSubString(item);
		} else if (item.prop) {
			return item.identity;
		}
	},

	/**
	 * Iterates through data.browser or data.os returning the correct
	 * browser or os identity
	 * @param  {Array} dataArray
	 * @return {String}
	 */
	__getIdentityStringFromArray: function(dataArray) {
		for (var i = 0, l = dataArray.length, identity; i < l; i++) {
			identity = this.__getIdentity(dataArray[i]);
			if (identity) {
				return identity;
			}
		}
	},

	/**
	 * Alias for __getIdentityStringFromArray
	 * @param  {Array} OSData | Expects data.os
	 * @return {String}
	 */
	__getOS: function(dataOS) {
		return this.__getIdentityStringFromArray(dataOS);
	},

	/**
	 * Parses string (such as userAgent) and returns the operating system version
	 * @param {String} stringToSearch
	 * @param {String} osIdentity
	 * @return {String|Number} int if not a decimal delimited version
	 */
	__getOSVersion: function(stringToSearch, osIdentity) {

		if (!stringToSearch || !osIdentity) {
			return;
		}

		// Filters data.os returning the member with an identity equal to osIdentity
		var filteredData = _data.os.filter(function(item) {
			return item.identity === osIdentity;
		})[0];

		var versionSearchString = filteredData.versionSearch || osIdentity;
		var regex = new RegExp(versionSearchString + ' ([\\d_\\.]+)', 'i');
		var version = stringToSearch.match(regex);

		if (version !== null) {
			return version[1].replace(/_/g, '.');
		}
	},

	/**
	 * Regular expression and indexOf against item.string using item.subString as the pattern
	 * @param  {Object} item
	 * @return {String}
	 */
	__matchSubString: function(item) {
		var subString = item.subString;
		if (subString) {
			var matches = subString.test ? !!subString.test(item.string) : item.string.indexOf(subString) > -1;
			if (matches) {
				return item.identity;
			}
		}
	}
};

BrowserData.create = function () {
	var instance = new BrowserData();
	var out = {};
	/**
	 * @type {String}
	 * @name module:ac-browser.name
	 */
	out.name      = instance.__getName(_data.browser);
	/**
	 * @type {String}
	 * @name module:ac-browser.version
	 */
	out.version   = instance.__getBrowserVersion(_data.versionString, out.name);
	/**
	 * @type {String}
	 * @name module:ac-browser.os
	 */
	out.os        = instance.__getOS(_data.os);
	/**
	 * @type {String}
	 * @name module:ac-browser.osVersion
	 */
	out.osVersion = instance.__getOSVersion(_data.versionString, out.os);
	return out;
};

module.exports = BrowserData;

// ac-browser@0.5.0

},{"./data":4,"@marcom/ac-polyfills/Array/prototype.filter":68,"@marcom/ac-polyfills/Array/prototype.some":76}],3:[function(require,module,exports){
'use strict';

module.exports = {
	/**
	 * Detect what version or document/standards mode IE is rendering the page as.
	 * Accounts for later versions of IE rendering pages in earlier standards modes. E.G. it is
	 * possible to set the X-UA-Compatible tag to tell IE9 to render pages in IE7 standards mode.//
	 * Based on Microsoft test
	 * @see http://msdn.microsoft.com/en-us/library/jj676915(v=vs.85).aspx
	 */
	getDocumentMode: function () {
		var ie;

		// IE8 or later
		if (document.documentMode) {
			ie = parseInt(document.documentMode, 10);
		// IE 5-7
		} else {
			// Assume quirks mode unless proven otherwise
			ie = 5;
			if (document.compatMode) {
				// standards mode
				if (document.compatMode === "CSS1Compat") {
					ie = 7;
				}
			}
			// There is no test for IE6 standards mode because that mode
			// was replaced by IE7 standards mode; there is no emulation.
		}
		return ie;
	}
};

// ac-browser@0.5.0

},{}],4:[function(require,module,exports){
'use strict';

module.exports = {
	// Used to test getName
	browser: [
		{
			string: window.navigator.userAgent,
			subString: "Edge",
			identity: "Edge"
		},
		{
			string: window.navigator.userAgent,
			subString: /silk/i,
			identity: "Silk"
		},
		{
			string: window.navigator.userAgent,
			subString: /(android).*(version\/[0-9+].[0-9+])/i,
			identity: "Android"
		},
		{
			string: window.navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{
			string: window.navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: window.navigator.userAgent,
			subString: /mobile\/[^\s]*\ssafari\//i,
			identity: "Safari Mobile",
			versionSearch: "Version"
		},
		{
			string: window.navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: window.navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: window.navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: window.navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: window.navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{ // for newer Netscapes (6+)
			string: window.navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		// IE < 11
		{
			string: window.navigator.userAgent,
			subString: "MSIE",
			identity: "IE",
			versionSearch: "MSIE"
		},
		// IE >= 11
		{
			string: window.navigator.userAgent,
			subString: "Trident",
			identity: "IE",
			versionSearch: "rv"
		},
		{
			string: window.navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ // for older Netscapes (4-)
			string: window.navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	// Used to test getOS
	os: [
		{
			string: window.navigator.platform,
			subString: "Win",
			identity: "Windows",
			versionSearch: "Windows NT"
		},
		{
			string: window.navigator.platform,
			subString: "Mac",
			identity: "OS X"
		},
		{
			string: window.navigator.userAgent,
			subString: "iPhone",
			identity: "iOS",
			versionSearch: "iPhone OS"
		},
		{
			string: window.navigator.userAgent,
			subString: "iPad",
			identity: "iOS",
			versionSearch: "CPU OS"
		},
		{
			string: window.navigator.userAgent,
			subString: /android/i,
			identity: "Android"
		},
		{
			string: window.navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	],
	// Used to test version and osVersion
	versionString: window.navigator.userAgent || window.navigator.appVersion || undefined
};

// ac-browser@0.5.0

},{}],5:[function(require,module,exports){
/**
 * @copyright 2016 Apple Inc. All rights reserved.
 */
'use strict';

var defaults = require('@marcom/ac-object/defaults');
var getStyle = require('@marcom/ac-dom-styles/getStyle');
var children = require('@marcom/ac-dom-traversal/children');
var getPosition = require('@marcom/ac-dom-metrics/getPosition');
var Clip = require('@marcom/ac-clip').Clip;
var touchAvailable = require('@marcom/ac-feature/touchAvailable');

var defaultOptions = {
	itemsSelector: '.chapternav-items',
	leftPaddleSelector: '.chapternav-paddle-left',
	rightPaddleSelector: '.chapternav-paddle-right',
	scrollEasing: 'ease-out',
	scrollDuration: 0.4 // in secounds
};

/**
 * @name module:ac-chapternav.ChapterNav
 * @class
 */
function ChapterNav(el, options) {
	this.el = el;
	this._options = defaults(defaultOptions, options || {});

	if (touchAvailable()) {
		// no paddles on touch
		return;
	}

	// determine text and scroll direction
	this._isRightToLeft = getStyle(this.el, 'direction').direction === 'rtl';
	this._inlineStart = (this._isRightToLeft) ? 'right' : 'left';
	this._inlineEnd = (this._isRightToLeft) ? 'left' : 'right';
	this._scrollType = this._scrollDirection();

	// query elements
	var paddleStartSelector = this._isRightToLeft ? this._options.rightPaddleSelector : this._options.leftPaddleSelector;
	var paddleEndSelector = this._isRightToLeft ? this._options.leftPaddleSelector : this._options.rightPaddleSelector;

	this._wrapper = this.el.querySelector(this._options.itemsSelector);
	this._paddleStart = this.el.querySelector(paddleStartSelector);
	this._paddleEnd = this.el.querySelector(paddleEndSelector);
	this._children = children(this._wrapper);
	this._childCount = this._children.length;

	// pre-bind clip methods
	this._onScrollClipUpdate = this._onScrollClipUpdate.bind(this);
	this._onScrollClipComplete = this._onScrollClipComplete.bind(this);

	// attach event listeners
	this._onPaddleStartClick = this._onPaddleStartClick.bind(this);
	this._paddleStart.addEventListener('click', this._onPaddleStartClick);

	this._onPaddleEndClick =  this._onPaddleEndClick.bind(this);
	this._paddleEnd.addEventListener('click', this._onPaddleEndClick);

	this._onScroll = this._onScroll.bind(this);
	this._wrapper.addEventListener('scroll', this._onScroll);

	this._updateElementMetrics = this._updateElementMetrics.bind(this);
	window.addEventListener('resize',  this._updateElementMetrics);
	window.addEventListener('orientationchange',  this._updateElementMetrics);

	// initialize metrics
	this._updateElementMetrics();
}

var proto = ChapterNav.prototype;

proto._updateElementMetrics = function () {
	this._scrollStart = this._wrapper.scrollLeft;
	this._wrapperWidth = this._wrapper.offsetWidth;
	this._contentWidth = this._wrapper.scrollWidth;
	this._paddleWidth = this._paddleStart.offsetWidth;

	this._updatePaddleDisplay();
};

proto._onScroll = function () {
	if (this._lockPaddles) {
		// don't update paddles during smooth scrolling
		return;
	}

	this._scrollStart = this._wrapper.scrollLeft;
	this._updatePaddleDisplay();
};

proto._updatePaddleDisplay = function () {
	var scrollEnd = this._getNormalizedScroll(this._scrollStart) + this._wrapperWidth;

	// 1px threshold due to rounding errors in Chrome
	var threshold = 1;

	this._paddleStart.disabled = (this._getNormalizedScroll(this._scrollStart) <= threshold);
	this._paddleEnd.disabled = (scrollEnd >= this._contentWidth - threshold);
};

proto._onPaddleStartClick = function (evt) {
	this._smoothScrollTo(this._getPaddleStartScrollDestination());
};

proto._getPaddleStartScrollDestination = function () {
	var threshold = this._getNormalizedScroll(this._scrollStart);
	var position;
	var i;

	// check elements from the end
	for (i = this._childCount - 1; i > 0; i--) {
		position = this._normalizePosition(getPosition(this._children[i]));

		// if it's clipped on the start
		if (position[this._inlineStart] < threshold) {
			// scroll it to the end
			return position[this._inlineEnd] - this._wrapperWidth;
		}
	}

	return 0;
};

proto._onPaddleEndClick = function (evt) {
	this._smoothScrollTo(this._getPaddleEndScrollDestination());
};

proto._getPaddleEndScrollDestination = function () {
	var threshold = this._getNormalizedScroll(this._scrollStart) + this._wrapperWidth;
	var position;
	var i;

	// check elements from the start
	for (i = 0; i < this._childCount; i++) {
		position = this._normalizePosition(getPosition(this._children[i]));

		// if it's clipped on the end
		if (position[this._inlineEnd] > threshold) {
			// scroll it to the start
			return (position[this._inlineStart]);
		}
	}

	return this._contentWidth;
};

proto._getBoundedScrollX = function (x) {
	var max = this._contentWidth - this._wrapperWidth;

	return Math.max(Math.min(x, max), 0);
};

proto._smoothScrollTo = function (x) {
	this._updateElementMetrics();

	if (this._lockPaddles || x === this._scrollStart) {
		return;
	}

	// only update paddles after scroll
	this._lockPaddles = true;

	var props = {
		scrollLeft: this._wrapper.scrollLeft
	};

	var propsTo = {
		scrollLeft: this._setNormalizedScroll(this._getBoundedScrollX(x))
	};

	var options = {
		ease: this._options.scrollEasing,
		onUpdate: this._onScrollClipUpdate,
		onComplete: this._onScrollClipComplete
	};

	Clip.to(props, this._options.scrollDuration, propsTo, options);
};

proto._onScrollClipUpdate = function (clip) {
	this._scrollStart = this._wrapper.scrollLeft = Math.round(clip.target().scrollLeft);
};

proto._onScrollClipComplete = function () {
	this._updatePaddleDisplay();
	this._lockPaddles = false;
};

/**
 * @name module:ac-chapternav.ChapterNav#_scrollDirection
 * @function
 * @private
 * @todo Replace with ac-scroll
 */
/** @ignore */
proto._scrollDirection = function () {
	var scrollType = 'reverse';
	var scrollTest = document.createElement('div');
	scrollTest.style.cssText = 'width:2px; height:1px; position:absolute; top:-1000px; overflow:scroll; font-size: 14px;';
	scrollTest.style.direction = 'rtl';
	scrollTest.innerHTML = 'test';
	document.body.appendChild(scrollTest);

	if (scrollTest.scrollLeft > 0) {
		scrollType = 'default';
	} else {
		scrollTest.scrollLeft = 1;
		if (scrollTest.scrollLeft === 0) {
			scrollType = 'negative';
		}
	}

	document.body.removeChild(scrollTest);
	return scrollType;
};

proto._getNormalizedScroll = function (scroll) {
	if (!this._isRightToLeft) {
		return scroll;
	}

	var normalizedScroll = Math.abs(scroll);

	if (this._scrollType === 'default') {
		normalizedScroll = this._contentWidth - this._wrapperWidth - normalizedScroll;
	}

	return normalizedScroll;
};

proto._setNormalizedScroll = function (scroll) {
	if (!this._isRightToLeft || this._scrollType === 'reverse') {
		return scroll;
	}

	if (this._scrollType === 'negative') {
		return -scroll;
	}

	return -(scroll - this._contentWidth + this._wrapperWidth);
};

proto._normalizePosition = function (position) {
	// account for paddle width and ordering
	if (!this._isRightToLeft) {
		return {
			top: position.top,
			right: position.right - this._paddleWidth,
			bottom: position.bottom,
			left: position.left - this._paddleWidth
		}
	}

	return {
		top: position.top,
		right: this._wrapperWidth - position.right + this._paddleWidth,
		bottom: position.bottom,
		left: this._wrapperWidth - position.left + this._paddleWidth
	};
};

module.exports = ChapterNav;

// ac-chapternav@3.0.1

},{"@marcom/ac-clip":13,"@marcom/ac-dom-metrics/getPosition":20,"@marcom/ac-dom-styles/getStyle":34,"@marcom/ac-dom-traversal/children":35,"@marcom/ac-feature/touchAvailable":55,"@marcom/ac-object/defaults":62}],6:[function(require,module,exports){
/**
 * @module ac-chapternav
 * @copyright 2016 Apple Inc. All rights reserved.
 */
'use strict';

var ChapterNav = require('./ChapterNav');
var el = document.getElementById('chapternav');

if (el) {
	module.exports = new ChapterNav(el);
}

// ac-chapternav@3.0.1

},{"./ChapterNav":5}],7:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.slice');
require('@marcom/ac-polyfills/Element/prototype.classList');

/** @ignore */
var classNameAdd = require('./className/add');

/**
 * @name module:ac-classlist.add
 *
 * @function
 *
 * @desc Adds one or more tokens to an Element's classList.
 *       Accounts for browsers without classList support.
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {...String} token
 *        One or more classes to be added
 */
module.exports = function add() {
	var tokens = Array.prototype.slice.call(arguments);
	var el = tokens.shift(tokens);
	var i;

	if (el.classList && el.classList.add) {
		el.classList.add.apply(el.classList, tokens);
		return;
	}

	for (i = 0; i < tokens.length; i++) {
		classNameAdd(el, tokens[i]);
	}
};

// ac-classlist@1.3.0

},{"./className/add":8,"@marcom/ac-polyfills/Array/prototype.slice":75,"@marcom/ac-polyfills/Element/prototype.classList":83}],8:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var classNameContains = require('./contains');

/**
 * @name module:ac-classlist/className.add
 *
 * @function
 *
 * @desc Adds a token to an Element's className
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The class to be added
 */
module.exports = function add(el, token) {
	if (!classNameContains(el, token)) {
		el.className += ' ' + token;
	}
};

// ac-classlist@1.3.0

},{"./contains":9}],9:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getTokenRegExp = require('./getTokenRegExp');

/**
 * @name module:ac-classlist/className.contains
 *
 * @function
 *
 * @desc Checks if an Element's className contains a specific token
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The token to be checked
 *
 * @returns {Boolean} `true` if className contains token, otherwise `false`
 */
module.exports = function classNameAdd(el, token) {
	return getTokenRegExp(token).test(el.className);
};


// ac-classlist@1.3.0

},{"./getTokenRegExp":10}],10:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name getTokenRegExp
 * @memberOf module:ac-classlist/className
 *
 * @function
 * @private
 *
 * @desc Creates a RegExp that matches the token within a className.
 *
 * @returns {RegExp}
 */
module.exports = function getTokenRegExp(token) {
	return new RegExp('(\\s|^)' + token + '(\\s|$)');
};

// ac-classlist@1.3.0

},{}],11:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var classNameContains = require('./contains');
var getTokenRegExp = require('./getTokenRegExp');

/**
 * @name module:ac-classlist/className.remove
 *
 * @function
 *
 * @desc Removes a token from an Element's className
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The class to be removed
 */
module.exports = function remove(el, token) {
	if (classNameContains(el, token)) {
		el.className = el.className.replace(getTokenRegExp(token), '$1').trim();
	}
};


// ac-classlist@1.3.0

},{"./contains":9,"./getTokenRegExp":10}],12:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.slice');
require('@marcom/ac-polyfills/Element/prototype.classList');

/** @ignore */
var classNameRemove = require('./className/remove');

/**
 * @name module:ac-classlist.remove
 *
 * @function
 *
 * @desc Remove one or more tokens from an Element's classList.
 *       Accounts for browsers without classList support.
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {...String} token
 *        One or more classes to be removed
 */
module.exports = function remove() {
	var tokens = Array.prototype.slice.call(arguments);
	var el = tokens.shift(tokens);
	var i;

	if (el.classList && el.classList.remove) {
		el.classList.remove.apply(el.classList, tokens);
		return;
	}

	for (i = 0; i < tokens.length; i++) {
		classNameRemove(el, tokens[i]);
	}
};

// ac-classlist@1.3.0

},{"./className/remove":11,"@marcom/ac-polyfills/Array/prototype.slice":75,"@marcom/ac-polyfills/Element/prototype.classList":83}],13:[function(require,module,exports){
/**
 * @module ac-clip
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	Clip: require('./ac-clip/Clip')
};

// ac-clip@3.1.0

},{"./ac-clip/Clip":14}],14:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/Array/isArray');
var create = require('@marcom/ac-object/create');
var createPredefined = require('@marcom/ac-easing').createPredefined;

/** @ignore */
var Clock = require('@marcom/ac-clock');
var Ease = require('@marcom/ac-easing').Ease;
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;

/** @ignore */
var DEFAULT_EASE = 'ease';

/**
 * @name module:ac-clip.Clip
 * @class
 *
 * @param {Object} target
 *        The `Object` whose properties Clip will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsTo
 *        An `Object` containing the end state of the properties you wish to
 *        transition on target.
 *
 * @param {Number} [options.delay=0]
 *        Delay in seconds before a clip will start after play has been called.
 *
 * @param {String|Function} [options.ease='ease']
 *        The ease used for transitions.
 *
 * @param {Clock} [options.clock=Clock]
 *        An instance of `ac-clock.Clock` to be used. Defaults to global singleton.
 *
 * @param {Object} [options.propsFrom={}]
 *        An `Object` containing the start state of the properties you wish to
 *        transition on target.
 *
 * @param {Number} [options.loop=0]
 *        Amount of times the clip will loop and replay upon completion.
 *
 * @param {Number} [options.yoyo=false]
 *        When `true` the clip will play in reverse upon completion until it returns
 *        to it’s original state.
 *
 * @param {Boolean} [options.destroyOnComplete=null]
 *        When true the clip will self destruct - call destroy on itself upon
 *        completion.
 *
 * @param {Function} [options.onStart=null]
 *        A callback `Function` called when the clip starts to play.
 *
 * @param {Function} [options.onUpdate=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used if you require to do further calculations with the
 *        properties and not for rendering. Use `onDraw` for rendering.
 *
 * @param {Function} [options.onDraw=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used for rendering, e.g. drawing something to a `canvas`
 *        element.
 *
 * @param {Function} [options.onComplete=null]
 *        A callback `Function` called when the clip has finished playing.
 */
function Clip(target, duration, propsTo, options) {

	// options
	options = options || {};
	this._options = options;

	// features
	this._isYoyo = options.yoyo;
	this._direction = 1;
	this._timeScale = 1;
	this._loop = options.loop || 0;
	this._loopCount = 0;

	// object / timing
	this._target = target;
	this.duration(duration);
	this._delay = (options.delay || 0) * 1000;
	this._remainingDelay = this._delay;
	this._progress = 0;
	this._clock = options.clock || Clock;
	this._playing = false;
	this._getTime = Date.now || function() { return new Date().getTime(); };

	// properties
	this._propsTo = propsTo || {};
	this._propsFrom = options.propsFrom || {};

	// callbacks
	this._onStart = options.onStart || null;
	this._onUpdate = options.onUpdate || null;
	this._onDraw = options.onDraw || null;
	this._onComplete = options.onComplete || null;

	// easing
	var ease = options.ease || DEFAULT_EASE;
	this._ease = (typeof ease === 'function') ? new Ease(ease) : createPredefined(ease);

	//bind
	this._start = this._start.bind(this);
	this._update = this._update.bind(this);
	this._draw = this._draw.bind(this);

	// further prep work to be done in _prepareProperties
	this._isPrepared = false;

	Clip._add(this);

	// call super
	EventEmitterMicro.call(this);
}

var proto = Clip.prototype = create(EventEmitterMicro.prototype);

/** Events */
Clip.COMPLETE = 'complete';
Clip.PAUSE = 'pause';
Clip.PLAY = 'play';


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-clip.Clip#play
 * @function
 *
 * @desc Starts the clip.
 *
 * @returns {Clip} A reference to this clip.
 */
proto.play = function () {
	if (!this._playing) {
		this._playing = true;

		if (this._delay === 0 || this._remainingDelay === 0) {
			this._start();
		}
		else {
			if (!this._isPrepared) {
				this._setDiff();
				this._updateProps();
			}
			this._startTimeout = setTimeout(this._start, this._remainingDelay / this._timeScale);
			this._delayStart = this._getTime();
		}
	}
	return this;
};

/**
 * @name module:ac-clip.Clip#pause
 * @function
 *
 * @desc Pauses the clip.
 *
 * @fires Clip#pause
 *
 * @returns {Clip} A reference to this clip.
 */
proto.pause = function () {
	if (this._playing) {
		if (this._startTimeout) {
			this._remainingDelay = this._getTime() - this._delayStart;
			clearTimeout(this._startTimeout);
		}

		this._stop();

		/**
		 * Pause event.
		 * @event Clip#pause
		 */
		this.trigger(Clip.PAUSE, this);
	}
	return this;
};

/**
 * @name module:ac-clip.Clip#destroy
 * @function
 *
 * @desc Immediately stop the clip and make it eligible for garbage collection.
 *       A clip can not be reused after it has been destroyed.
 *
 * @returns {Clip} A reference to this clip.
 */
proto.destroy = function () {
	this.pause();

	this._options = null;
	this._target = null;
	this._storeTarget = null;
	this._ease = null;
	this._clock = null;
	this._propsTo = null;
	this._propsFrom = null;
	this._storePropsTo = null;
	this._storePropsFrom = null;
	this._propsDiff = null;
	this._propsEase = null;
	this._onStart = null;
	this._onUpdate = null;
	this._onDraw = null;
	this._onComplete = null;

	Clip._remove(this);

	// call Super destroy method
	EventEmitterMicro.prototype.destroy.call(this);

	return this;
};

/**
 * @name module:ac-clip.Clip#reset
 * @function
 *
 * @desc Resets the clip and target properties.
 *
 * @returns {Clip} A reference to this clip.
 */
proto.reset = function () {
	if (!this._isPrepared) {
		// nothing to reset
		return;
	}

	this._stop();

	this._resetLoop(this._target, this._storeTarget);

	this._direction = 1;
	this._loop = this._options.loop || 0;
	this._loopCount = 0;
	this._propsFrom = this._storePropsFrom;
	this._propsTo = this._storePropsTo;

	this._progress = 0;
	this._setStartTime();

	if (this._onUpdate) {
		this._onUpdate.call(this, this);
	}
	if (this._onDraw) {
		this._onDraw.call(this, this);
	}

	return this;
};

/**
 * @name module:ac-clip.Clip#playing
 * @function
 *
 * @desc Returns the clips current play stat as a `Boolean` true / false.
 *
 * @returns {Boolean} The current play stat.
 */
proto.playing = function () {
	return this._playing;
};

/**
 * @name module:ac-clip.Clip#target
 * @function
 *
 * @desc Gets the target `Object`.
 *
 * @returns {Object} The target.
 */
proto.target = function () {
	return this._target;
};

/**
 * @name module:ac-clip.Clip#duration
 * @function
 *
 * @desc Gets or sets the duration of the transition.
 *
 * @param {Number} [duration]
 *        Optional new duration for the transition.
 *
 * @returns {Number} The current duration.
 */
proto.duration = function (duration) {

	if (duration !== undefined) {
		this._duration = duration;
		this._durationMs = (duration * 1000) / this._timeScale;

		if (this._playing) {
			this._setStartTime();
		}
	}

	return this._duration;
};

/**
 * @name module:ac-clip.Clip#timeScale
 * @function
 *
 * @desc Gets or sets the timeScale of the transition. TimeScale is the rate at
 *       which the transition will play. For example, a Clip with a duration of
 *       1 second and timeScale of 0.5 will play over 2 seconds.
 *
 * @param {Number} [timeScale]
 *        Optional new timeScale for the transition.
 *
 * @returns {Number} The current timeScale.
 */
proto.timeScale = function (timeScale) {

	if (timeScale !== undefined) {
		this._timeScale = timeScale;
		this.duration(this._duration);
	}

	return this._timeScale;
};

/**
 * @name module:ac-clip.Clip#currentTime
 * @function
 *
 * @desc Gets or sets the current time of the transition.
 *
 * @param {Number} [time]
 *        Optional new time for the Clip to jump to.
 *
 * @returns {Number} The current time.
 */
proto.currentTime = function (time) {

	if (time !== undefined) {
		return this.progress(time / this._duration) * this._duration;
	}

	return (this.progress() * this._duration);
};

/**
 * @name module:ac-clip.Clip#progress
 * @function
 *
 * @desc Gets or sets the current progress of the transition.
 *
 * @param {Number} progress
 *        Accepts a Number between 0 and 1 and will change the position of the clip.
 *
 * @returns {Number} The current progress.
 */
proto.progress = function (progress) {

	if (progress !== undefined) {

		this._progress = Math.min(1, Math.max(0, progress));
		this._setStartTime();

		if (!this._isPrepared) {
			this._setDiff();
		}

		if (this._playing && progress === 1) {
			this._completeProps();
			if (this._onUpdate) {
				this._onUpdate.call(this, this);
			}
			if (this._onDraw) {
				this._onDraw.call(this, this);
			}
			this._complete();
		}
		else {
			this._updateProps();
			if (this._onUpdate) {
				this._onUpdate.call(this, this);
			}
			if (this._onDraw) {
				this._onDraw.call(this, this);
			}
		}
	}

	return this._progress;
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-clip.Clip#_resetLoop
 * @function
 * @private
 */
/** @ignore */
proto._resetLoop = function (target, stored) {
	var prop;
	for (prop in stored) {
		if (stored.hasOwnProperty(prop)) {
			if (stored[prop] !== null) {
				if (typeof stored[prop] === 'object') {
					this._resetLoop(target[prop], stored[prop]);
				}
				else {
					target[prop] = stored[prop];
				}
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_cloneObjects
 * @function
 * @private
 *
 * @returns {Object}
 */
/** @ignore */
proto._cloneObjects = function () {
	var cloneTarget = {};
	var clonePropsTo = {};
	var clonePropsFrom = {};
	this._cloneObjectsLoop(this._target, this._propsTo, this._propsFrom, cloneTarget, clonePropsTo, clonePropsFrom);
	return {
		target: cloneTarget,
		propsTo: clonePropsTo,
		propsFrom: clonePropsFrom
	};
};

/**
 * @name module:ac-clip.Clip#_cloneObjectsLoop
 * @function
 * @private
 *
 * @returns {Object}
 */
/** @ignore */
proto._cloneObjectsLoop = function (target, to, from, cloneTarget, clonePropsTo, clonePropsFrom) {
	var type;
	var prop;

	// loops through propsFrom and if there isn't a matching propsTo
	// adds propsTo property to match the current state of target
	for (prop in from) {
		if (from.hasOwnProperty(prop) && to[prop] === undefined && target[prop] !== undefined) {
			cloneTarget[prop] = target[prop];
			clonePropsTo[prop] = target[prop];
			clonePropsFrom[prop] = from[prop];
		}
	}

	for (prop in to) {
		if (target.hasOwnProperty(prop)) {
			type = typeof target[prop];
			if (target[prop] !== null && type === 'object') {

				if (Array.isArray(target[prop])) {
					// array
					cloneTarget[prop] = [];
					clonePropsTo[prop] = [];
					clonePropsFrom[prop] = [];
				}
				else {
					// object
					cloneTarget[prop] = {};
					clonePropsTo[prop] = {};
					clonePropsFrom[prop] = {};
				}

				this._cloneObjectsLoop(target[prop], to[prop] || {}, from[prop] || {}, cloneTarget[prop], clonePropsTo[prop], clonePropsFrom[prop]);
			}
			else if (to[prop] !== null && type === 'number') {
				cloneTarget[prop] = target[prop];
				clonePropsTo[prop] = to[prop];

				if (from && from[prop] !== undefined) {
					clonePropsFrom[prop] = from[prop];
				}
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_prepareProperties
 * @function
 * @private
 */
/** @ignore */
proto._prepareProperties = function () {
	if (!this._isPrepared) {
		// create clones of main objects
		var clones = this._cloneObjects();
		// we need to clone the target so we can use it for reset, yoyo and loop etc
		this._storeTarget = clones.target;
		// we clone / override the propsTo as we don't want to manipulate / change the
		// object passed to Clip on instantiation as it might be used by something else
		this._propsTo = clones.propsTo;
		this._storePropsTo = this._propsTo;
		// same as propsTo - clone so we don't mess with object that might be used elsewhere
		this._propsFrom = clones.propsFrom;
		this._storePropsFrom = this._propsFrom;

		this._isPrepared = true;
	}
};

/**
 * @name module:ac-clip.Clip#_setStartTime
 * @function
 * @private
 */
/** @ignore */
proto._setStartTime = function () {
	this._startTime = this._getTime() - (this.progress() * this._durationMs);
};

/**
 * @name module:ac-clip.Clip#_setDiff
 * @function
 * @private
 */
/** @ignore */
proto._setDiff = function () {

	// this is the last moment to prep any props
	if (!this._isPrepared) {
		this._prepareProperties();
	}

	this._propsDiff = {};
	this._setDiffLoop(this._propsTo, this._propsFrom, this._target, this._propsDiff);
};

/**
 * @name module:ac-clip.Clip#_setDiffLoop
 * @function
 * @private
 */
/** @ignore */
proto._setDiffLoop = function (to, from, target, diff) {
	var type;
	var prop;
	for (prop in to) {
		if (to.hasOwnProperty(prop)) {
			type = typeof to[prop];
			if (to[prop] !== null && type === 'object') {
				from[prop] = from[prop] || {};
				diff[prop] = diff[prop] || {};
				this._setDiffLoop(to[prop], from[prop], target[prop], diff[prop]);
			}
			else if (type === 'number' && target[prop] !== undefined) {
				if (from[prop] !== undefined) {
					target[prop] = from[prop];
				}
				else {
					from[prop] = target[prop];
				}
				diff[prop] = to[prop] - target[prop];
			}
			else {
				to[prop] = null;
				from[prop] = null;
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_start
 * @function
 * @private
 *
 * @fires Clip#play
 */
/** @ignore */
proto._start = function () {
	this._startTimeout = null;
	this._remainingDelay = 0;

	this._setStartTime();

	this._clock.on('update', this._update);
	this._clock.on('draw', this._draw);

	if (!this._clock.isRunning()) {
		this._clock.start();
	}

	this._setDiff();

	this._playing = true;
	this._running = true;

	if (this._onStart) {
		this._onStart.call(this, this);
	}

	/**
     * Play event.
     * @event Clip#play
     */
	this.trigger(Clip.PLAY, this);
};

/**
 * @name module:ac-clip.Clip#_stop
 * @function
 * @private
 */
/** @ignore */
proto._stop = function () {
	this._playing = false;
	this._running = false;
	this._clock.off('update', this._update);
	this._clock.off('draw', this._draw);
};

/**
 * @name module:ac-clip.Clip#_updateProps
 * @function
 * @private
 */
/** @ignore */
proto._updateProps = function () {
	var eased;
	if (this._direction === 1) {
		eased = this._ease.getValue(this._progress);
	}
	else {
		eased = 1 - this._ease.getValue(1 - this._progress);
	}

	this._updatePropsLoop(this._propsTo, this._propsFrom, this._target, this._propsDiff, eased);
};

/**
 * @name module:ac-clip.Clip#_updateProps
 * @function
 * @private
 */
/** @ignore */
proto._updatePropsLoop = function (to, from, target, diff, eased) {
	var prop;
	for (prop in to) {
		if (to.hasOwnProperty(prop) && to[prop] !== null) {
			if (typeof to[prop] !== 'number') {
				this._updatePropsLoop(to[prop], from[prop], target[prop], diff[prop], eased);
			}
			else {
				target[prop] = from[prop] + (diff[prop] * eased);
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_completeProps
 * @function
 * @private
 */
/** @ignore */
proto._completeProps = function () {
	this._completePropsLoop(this._propsTo, this._target);
};

/**
 * @name module:ac-clip.Clip#_completePropsLoop
 * @function
 * @private
 */
/** @ignore */
proto._completePropsLoop = function (to, target) {
	var prop;
	for (prop in to) {
		if (to.hasOwnProperty(prop) && to[prop] !== null) {
			if (typeof to[prop] !== 'number') {
				this._completePropsLoop(to[prop], target[prop]);
			}
			else {
				target[prop] = to[prop];
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_complete
 * @function
 * @private
 *
 * @fires Clip#complete
 */
/** @ignore */
proto._complete = function () {
	if (this._isYoyo && ((this._loop > 0 && this._loopCount <= this._loop) || (this._loop === 0 && this._loopCount === 0))) {
		this._propsFrom = (this._direction === 1) ? this._storePropsTo : this._storePropsFrom;
		this._propsTo = (this._direction === 1) ? this._storePropsFrom : this._storePropsTo;
		this._direction *= -1;
		if (this._direction === -1) {
			++this._loopCount;
		}
		this.progress(0);
		this._start();
	}
	else if (this._loopCount < this._loop) {
		++this._loopCount;
		this.progress(0);
		this._start();
	}
	else {
		/**
		 * Complete event.
		 * @event Clip#complete
		 */
		this.trigger(Clip.COMPLETE, this);

		if (this._onComplete) {
			this._onComplete.call(this, this);
		}

		if (this._options && this._options.destroyOnComplete) {
			this.destroy();
		}
	}
};

/**
 * @name module:ac-clip.Clip#_update
 * @function
 * @private
 *
 * @param {Object} [evt=undefined]
 */
/** @ignore */
proto._update = function (evt) {
	if (this._running) {
		this._progress = (evt.timeNow - this._startTime) / this._durationMs;

		if (this._progress >= 1) {
			this._progress = 1;
			this._running = false;
			this._completeProps();
		}
		else {
			this._updateProps();
		}

		if (this._onUpdate) {
			this._onUpdate.call(this, this);
		}
	}
};

/**
 * @name module:ac-clip.Clip#_draw
 * @function
 * @private
 *
 * @param {Object} [evt=undefined]
 */
/** @ignore */
proto._draw = function (evt) {
	if (this._onDraw) {
		this._onDraw.call(this, this);
	}

	if (!this._running) {
		this._stop();

		if (this._progress === 1) {
			this._complete();
		}
	}
};


////////////////////////////////////////
//////////  STATIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-clip.Clip#_instantiate
 * @function
 * @private
 * @static
 */
/** @ignore */
Clip._instantiate = function () {
	this._clips = [];
	return this;
};

/**
 * @name module:ac-clip.Clip#_add
 * @function
 * @private
 * @static
 *
 * @param {Clip} clip
 */
/** @ignore */
Clip._add = function (clip) {
	this._clips.push(clip);
};

/**
 * @name module:ac-clip.Clip#_remove
 * @function
 * @private
 * @static
 *
 * @param {Clip} clip
 */
/** @ignore */
Clip._remove = function (clip) {
	var index = this._clips.indexOf(clip);
	if (index > -1) {
		this._clips.splice(index, 1);
	}
};

/**
 * @name module:ac-clip.Clip#getAll
 * @function
 * @static
 *
 * @desc Returns an Array of all Clip instances. Will filter to only
 *       instances using target param when supplied.
 *
 * @param {Object} [target=null]
 *        An optional target options. If supplied this function will
 *        return only Clip instances who use this target.
 *
 * @returns {Array} An array of Clip instances.
 */
Clip.getAll = function (target) {
	if (target !== undefined) {
		var clips = [];
		var i = this._clips.length;
		while (i--) {
			if (this._clips[i].target() === target) {
				clips.push(this._clips[i]);
			}
		}
		return clips;
	}
	return Array.prototype.slice.call(this._clips);
};

/**
 * @name module:ac-clip.Clip#destroyAll
 * @function
 * @static
 *
 * @desc Destroys all Clip instances. Will filter to only
 *       instances using target param when supplied.
 *
 * @param {Object} [target=null]
 *        An optional target options. If supplied this function will
 *        destroy only Clip instances who use this target.
 *
 * @returns {Array} An array of all Clips destroyed.
 */
Clip.destroyAll = function (target) {
	var clips = this.getAll(target);
	if (this._clips.length === clips.length) {
		// if all clips then empty array to prevent splice
		this._clips = [];
	}
	var i = clips.length;
	while (i--) {
		clips[i].destroy();
	}
	return clips;
};

/**
 * @name module:ac-clip.Clip#to
 * @function
 * @static
 *
 * @desc Creates and returns an instance of a Clip that will autostart and destroy
 *       itself upon completetion. Ideal for creating throw away instances of Clip
 *       and not having to worry about memory / destroying them.
 *
 * @param {Object} target
 *        The `Object` whose properties Clip will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsTo
 *        An `Object` containing the end state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} options
 *        See Clip instantiation docs for full list of options.
 *
 * @returns {Clip} An new instance of Clip.
 */
Clip.to = function (target, duration, propsTo, options) {
	options = options || {};
	if (options.destroyOnComplete === undefined) {
		options.destroyOnComplete = true;
	}
	return new Clip(target, duration, propsTo, options).play();
};

/**
 * @name module:ac-clip.Clip#from
 * @function
 * @static
 *
 * @desc Creates and returns an instance of a Clip that will autostart and destroy
 *       itself upon completetion. Ideal for creating throw away instances of Clip
 *       and not having to worry about memory / destroying them. Unlike the static
 *       `to` method this method takes propsFrom as the third argument and will
 *       transition an Object back to it's original state.
 *
 * @param {Object} target
 *        The `Object` whose properties Clip will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsFrom
 *        An `Object` containing the start state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} options
 *        See Clip instantiation docs for full list of options. The one difference
 *        here is no `propsFrom` object can be passed in options but instead a `propsTo`
 *        option is accepted that works in a similar way - listing end states for props.
 *
 * @returns {Clip} An new instance of Clip.
 */
Clip.from = function (target, duration, propsFrom, options) {
	options = options || {};
	options.propsFrom = propsFrom;
	if (options.destroyOnComplete === undefined) {
		options.destroyOnComplete = true;
	}
	return new Clip(target, duration, options.propsTo, options).play();
};


module.exports = Clip._instantiate();

// ac-clip@3.1.0

},{"@marcom/ac-clock":15,"@marcom/ac-easing":43,"@marcom/ac-event-emitter-micro":51,"@marcom/ac-object/create":61,"@marcom/ac-polyfills/Array/isArray":66}],15:[function(require,module,exports){
var Clock = require("./ac-clock/Clock"),
	ThrottledClock = require("./ac-clock/ThrottledClock"),
	sharedClockInstance = require("./ac-clock/sharedClockInstance");

// expose parent constructor on global instance (in case we want to create private versions of this later)
sharedClockInstance.Clock = Clock;
sharedClockInstance.ThrottledClock = ThrottledClock;

module.exports = sharedClockInstance;

// ac-clock@1.1.2

},{"./ac-clock/Clock":16,"./ac-clock/ThrottledClock":17,"./ac-clock/sharedClockInstance":18}],16:[function(require,module,exports){
/*global module */
"use strict";

require('@marcom/ac-polyfills/Function/prototype.bind');
require('@marcom/ac-polyfills/requestAnimationFrame');

var proto;

var EventEmitter = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;
var pageLoadTime = new Date().getTime();

/**
 * @name .Clock
 * @class Clock
 * <pre>Clock = require('/Clock');</pre>
 */
function Clock() {
	// initialize EventEmitter scope on this object
	EventEmitter.call( this );

	// create variables to house state information and animationFrame location
	this.lastFrameTime = null;
	this._animationFrame = null;
	this._active = false;
	this._startTime = null;
	this._boundOnAnimationFrame = this._onAnimationFrame.bind( this );
	this._getTime = Date.now || function() { return new Date().getTime(); };
}

// force EventEmitter prototype on Clock
proto = Clock.prototype = new EventEmitter( null );

// start running the animationFrame loop
proto.start = function() {
	// prevent the clock from running more than once
	if ( this._active ) {
		return;
	}
	this._tick();
};

// stop running the animationFrame loop
proto.stop = function() {
	if ( this._active ) {
		// cancel a previous animation frame if we're catching it off its refresh cycle
		window.cancelAnimationFrame( this._animationFrame );
	}

	// set the animationFrame to null and remove active state
	this._animationFrame = null;
	this.lastFrameTime = null;
	this._active = false;
};

// stop running the Clock and ensure that the object can be garbage collected
proto.destroy = function() {
	this.stop();
	this.off();

	var i;
	for ( i in this ) {
		if ( this.hasOwnProperty( i ) ) {
			this[ i ] = null;
		}
	}
};

// API to determine whether or not the clock is currently running
proto.isRunning = function() {
	return this._active;
};

// internally called start method to allow it to run continuously without triggering a new run cycle
proto._tick = function() {
	if ( !this._active ) {
		this._active = true;
	}

	// request the next animation frame to run
	this._animationFrame = window.requestAnimationFrame( this._boundOnAnimationFrame );
};

// method that gets called on each animationFrame render
proto._onAnimationFrame = function( time ) {
	if ( this.lastFrameTime === null ) {
		this.lastFrameTime = time;
	}

	// calculate delta and default fps
	var delta = time - this.lastFrameTime;
	var fps = 0;

	if (delta >= 1000) {
		// ignore very long deltas
		// e.g., after App Nap
		delta = 0;
	}

	// if we can actually determine the FPS, calcaluate that here
	if ( delta !== 0 ) {
		fps = 1000 / delta;
	}

	// reset delta to 0 if this is the first frame
	if (this._firstFrame === true) {
		delta = 0;
		this._firstFrame = false;
	}

	if (fps === 0) {
		// wait for FPS to trigger events
		this._firstFrame = true;

	} else {

		// set data object
		var data = {
			time : time,
			delta : delta,
			fps : fps,
			naturalFps : fps,
			timeNow : this._getTime()
		};

		// trigger the 'update' event, which modules should bind to if they have values that should be synced before 'draw'
		this.trigger( 'update', data );
		// trigger the 'draw' event, which modules should call when drawing to the page
		this.trigger( 'draw', data );
	}

	// remove reference for this._animationFrame
	this._animationFrame = null;
	// set lastFrameTime
	this.lastFrameTime = time;
	// restart the animation frame loop

	// If the clock wasn't stopped in the update or draw cycles
	if (this._active !== false) {
		this._tick();
	} else {
		this.lastFrameTime = null;
	}
};

module.exports = Clock;

// ac-clock@1.1.2

},{"@marcom/ac-event-emitter-micro":51,"@marcom/ac-polyfills/Function/prototype.bind":87,"@marcom/ac-polyfills/requestAnimationFrame":105}],17:[function(require,module,exports){
/*global module */
"use strict";

require('@marcom/ac-polyfills/requestAnimationFrame');

var proto;

var sharedClockInstance = require('./sharedClockInstance'),
	EventEmitter = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;

/**
 * @name .ThrottledClock
 * @class ThrottledClock
 * <pre>ThrottledClock = require('/ThrottledClock');</pre>
 */
function ThrottledClock( fps, options ) {
	// if being extended by another module, return false here;
	if ( fps === null ) {
		return;
	}

	EventEmitter.call( this );
	options = options || {};

	this._fps = fps || null;
	this._clock = options.clock || sharedClockInstance;
	this._lastThrottledTime = null;
	this._clockEvent = null;

	this._boundOnClockDraw = this._onClockDraw.bind(this);
	this._boundOnClockUpdate = this._onClockUpdate.bind(this);

	this._clock.on( 'update', this._boundOnClockUpdate );
}

proto = ThrottledClock.prototype = new EventEmitter( null );

proto.setFps = function( fps ) {
	this._fps = fps;
	return this;
};

proto.getFps = function() {
	return this._fps;
};

proto.start = function() {
	this._clock.start();
	return this;
};

proto.stop = function() {
	this._clock.stop();
	return this;
};

proto.isRunning = function() {
	return this._clock.isRunning();
};

proto.destroy = function() {
	this._clock.off( 'update', this._boundOnClockUpdate );
	this._clock.destroy.call( this );
};

proto._onClockUpdate = function( e ) {
	// get the last throttled time if DNE
	if ( this._lastThrottledTime === null ) {
		this._lastThrottledTime = this._clock.lastFrameTime;
	}

	var delta = e.time - this._lastThrottledTime;

	if ( !this._fps ) {
		throw new TypeError('FPS is not defined.');
	}

	// if the delta is less than the lastThrottledTime, return early
	if ( Math.ceil( 1000 / delta ) >= this._fps + 2 ) {
		return;
	}

	// pass the updated delta to object
	this._clockEvent = e;

	// set new delta and fps values
	this._clockEvent.delta = delta;
	this._clockEvent.fps = 1000 / delta;

	// set the lastThrottledTime to the current time
	this._lastThrottledTime = this._clockEvent.time;

	// ensure that _onClockDraw gets called on the next draw event from this._clock
	this._clock.once( 'draw', this._boundOnClockDraw );

	this.trigger( 'update', this._clockEvent );
};

proto._onClockDraw = function() {
	this.trigger( 'draw', this._clockEvent );
};

module.exports = ThrottledClock;

// ac-clock@1.1.2

},{"./sharedClockInstance":18,"@marcom/ac-event-emitter-micro":51,"@marcom/ac-polyfills/requestAnimationFrame":105}],18:[function(require,module,exports){
'use strict';

var Clock = require('./Clock');

module.exports = new Clock();
// ac-clock@1.1.2

},{"./Clock":16}],19:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getBoundingClientRect = require('./utils/getBoundingClientRect');

/**
 * @name module:ac-dom-metrics.getDimensions
 *
 * @function
 *
 * @desc Get the width and height of an Element.
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @returns {Dimensions} The Element dimensions.
 */
module.exports = function getDimensions(el, rendered) {
	var rect;

	if (rendered) {
		rect = getBoundingClientRect(el);

		return {
			width: rect.width,
			height: rect.height
		};
	}

	return {
		width: el.offsetWidth,
		height: el.offsetHeight
	};
};

// ac-dom-metrics@2.4.0

},{"./utils/getBoundingClientRect":21}],20:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getDimensions = require('./getDimensions');
var getBoundingClientRect = require('./utils/getBoundingClientRect');

/**
 * @name module:ac-dom-metrics.getPosition
 *
 * @function
 *
 * @desc Get the layout position of an Element, relative to it's offset parent.
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @returns {Position} The Element position.
 */
module.exports = function getPosition(el, rendered) {
	var rect;
	var parentRect;
	var dimensions;

	if (rendered) {
		rect = getBoundingClientRect(el);

		if (el.offsetParent) {
			// Fixed position Elements don't have an offsetParent in WebKit
			parentRect = getBoundingClientRect(el.offsetParent);
			rect.top -= parentRect.top;
			rect.left -= parentRect.left;
		}
	} else {
		dimensions = getDimensions(el, rendered);

		rect = {
			top: el.offsetTop,
			left: el.offsetLeft,
			width: dimensions.width,
			height: dimensions.height
		};
	}

	return {
		top: rect.top,
		right: rect.left + rect.width,
		bottom: rect.top + rect.height,
		left: rect.left
	};
};

// ac-dom-metrics@2.4.0

},{"./getDimensions":19,"./utils/getBoundingClientRect":21}],21:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-metrics/utils.getBoundingClientRect
 *
 * @function
 *
 * @deprecated since version 2.4.0
 *  Use native [Element.getBoundingClientRect()]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect} instead.
 */
module.exports = function getBoundingClientRect(el) {
	var rect = el.getBoundingClientRect();

	return {
		top: rect.top,
		right: rect.right,
		bottom: rect.bottom,
		left: rect.left,
		width: rect.width || rect.right - rect.left,
		height: rect.height || rect.bottom - rect.top
	};
};

// ac-dom-metrics@2.4.0

},{}],22:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.COMMENT_NODE
 *
 * @constant
 *
 * @desc nodeType value for Comment
 */
module.exports = 8;

// ac-dom-nodes@1.7.0

},{}],23:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.DOCUMENT_FRAGMENT_NODE
 *
 * @constant
 *
 * @desc nodeType value for DocumentFragment
 */
module.exports = 11;

// ac-dom-nodes@1.7.0

},{}],24:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.DOCUMENT_NODE
 *
 * @constant
 *
 * @desc nodeType value for Document
 */
module.exports = 9;

// ac-dom-nodes@1.7.0

},{}],25:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.ELEMENT_NODE
 *
 * @constant
 *
 * @desc nodeType value for Element
 */
module.exports = 1;

// ac-dom-nodes@1.7.0

},{}],26:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.TEXT_NODE
 *
 * @constant
 *
 * @desc nodeType value for TextNode
 */
module.exports = 3;

// ac-dom-nodes@1.7.0

},{}],27:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.slice');
require('@marcom/ac-polyfills/Array/prototype.filter');

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var ELEMENT_NODE = require('./ELEMENT_NODE');

/**
 * @name module:ac-dom-nodes.filterByNodeType
 *
 * @function
 *
 * @desc Filters an Array of Nodes by nodeType.
 *
 * @param {Array|NodeList} nodes
 *
 * @param {Integer} [nodeType={@link module:ac-dom-nodes.ELEMENT_NODE ELEMENT_NODE}]
 *
 * @returns {Array} An new Array of Nodes of the specified nodeType
 */
module.exports = function filterByNodeType(nodes, nodeType) {
	nodeType = nodeType || ELEMENT_NODE;
	nodes = Array.prototype.slice.call(nodes);

	return nodes.filter(function (node) {
		return isNodeType(node, nodeType);
	});
};

// ac-dom-nodes@1.7.0

},{"./ELEMENT_NODE":25,"./internal/isNodeType":28,"@marcom/ac-polyfills/Array/prototype.filter":68,"@marcom/ac-polyfills/Array/prototype.slice":75}],28:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNode = require('/isNode');

module.exports = function isNodeType(node, nodeType) {
	if (!isNode(node)) {
		return false;
	}

	if (typeof nodeType === 'number') {
		return (node.nodeType === nodeType);
	}

	return (nodeType.indexOf(node.nodeType) !== -1);
};

// ac-dom-nodes@1.7.0

},{"/isNode":32}],29:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./isNodeType');
var COMMENT_NODE = require('/COMMENT_NODE');
var DOCUMENT_FRAGMENT_NODE = require('/DOCUMENT_FRAGMENT_NODE');
var ELEMENT_NODE = require('/ELEMENT_NODE');
var TEXT_NODE = require('/TEXT_NODE');

/** @ignore */
var VALID_INSERT_NODE = [
	ELEMENT_NODE,
	TEXT_NODE,
	COMMENT_NODE,
	DOCUMENT_FRAGMENT_NODE
];

/** @ignore */
var ERR_INVALID_INSERT_NODE = ' must be an Element, TextNode, Comment, or Document Fragment';

/** @ignore */
var VALID_CHILD_NODE = [
	ELEMENT_NODE,
	TEXT_NODE,
	COMMENT_NODE
];

/** @ignore */
var ERR_INVALID_CHILD_NODE = ' must be an Element, TextNode, or Comment';

/** @ignore */
var VALID_PARENT_NODE = [
	ELEMENT_NODE,
	DOCUMENT_FRAGMENT_NODE
];

/** @ignore */
var ERR_INVALID_PARENT_NODE = ' must be an Element, or Document Fragment';

/** @ignore */
var ERR_NO_PARENT_NODE = ' must have a parentNode';

module.exports = {

	/** @ignore */
	parentNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'target';

		if ((node || required) && !isNodeType(node, VALID_PARENT_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_PARENT_NODE);
		}
	},

	/** @ignore */
	childNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'target';

		if (!node && !required) {
			return;
		}

		if (!isNodeType(node, VALID_CHILD_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_CHILD_NODE);
		}
	},

	/** @ignore */
	insertNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'node';

		if (!node && !required) {
			return;
		}

		if (!isNodeType(node, VALID_INSERT_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_INSERT_NODE);
		}
	},

	/** @ignore */
	hasParentNode: function (node, funcName, paramName) {
		paramName = paramName || 'target';

		if (!node.parentNode) {
			throw new TypeError(funcName + ': ' + paramName + ERR_NO_PARENT_NODE);
		}
	}

};

// ac-dom-nodes@1.7.0

},{"/COMMENT_NODE":22,"/DOCUMENT_FRAGMENT_NODE":23,"/ELEMENT_NODE":25,"/TEXT_NODE":26,"./isNodeType":28}],30:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var DOCUMENT_FRAGMENT_NODE = require('./DOCUMENT_FRAGMENT_NODE');

/**
 * @name module:ac-dom-nodes.isDocumentFragment
 *
 * @function
 *
 * @desc Test whether or not an Object is a DocumentFragment.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isDocumentFragment(obj) {
 	return isNodeType(obj, DOCUMENT_FRAGMENT_NODE);
};

// ac-dom-nodes@1.7.0

},{"./DOCUMENT_FRAGMENT_NODE":23,"./internal/isNodeType":28}],31:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var ELEMENT_NODE = require('./ELEMENT_NODE');

/**
 * @name module:ac-dom-nodes.isElement
 *
 * @function
 *
 * @desc Test whether or not an Object is an Element.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isElement (obj) {
 	return isNodeType(obj, ELEMENT_NODE);
};

// ac-dom-nodes@1.7.0

},{"./ELEMENT_NODE":25,"./internal/isNodeType":28}],32:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.isNode
 *
 * @function
 *
 * @desc Test whether or not an Object is a Node.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isNode (obj) {
 	return !!(obj && obj.nodeType);
};

// ac-dom-nodes@1.7.0

},{}],33:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-nodes.remove
 *
 * @deprecated since version 1.7.0
 * Use ac-polyfills [`elementNode.remove()`](https://interactive-git.apple.com/interactive-frameworks/ac-polyfills/blob/master/src/Element/prototype.remove.js) instead; see [MDN ChildNode.remove()](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove) for additional information.
 *
 * @function
 *
 * @desc Remove a Node from it's parentNode
 *
 * @param {Node} node
 *        The Node to remove
 *
 * @returns {Node} The removed Node
 */
module.exports = function remove (node) {
	validate.childNode(node, true, 'remove');

	if (!node.parentNode) {
		return node;
	}

	return node.parentNode.removeChild(node);
};

// ac-dom-nodes@1.7.0

},{"./internal/validate":29}],34:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getStyleProperty = require('@marcom/ac-prefixer/getStyleProperty');
var stripPrefixes = require('@marcom/ac-prefixer/stripPrefixes');

/**
 * @name module:ac-dom-styles.getStyle
 *
 * @function
 *
 * @desc Get one or more CSS styles on an Element.
 *       Uses `window.getComputedStyle` to get styles set in CSS and/or inline.
 *       Automatically handles vendor prefixed properties and values.
 *
 * @param {Element} target
 *        The DOM element to get the style(s) on.
 *
 * @param {...String|String[]} properties
 *        One or more properties as multiple arguments, or an Array.
 *
 * @returns {Object} An Object with multiple domProperty:value pairs.
 */
module.exports = function getStyle() {
	var properties = Array.prototype.slice.call(arguments);
	var target = properties.shift(properties);
	var computed = window.getComputedStyle(target);
	var styles = {};
	var property;
	var prefixed;
	var value;
	var i;

	if (typeof properties[0] !== 'string') {
		properties = properties[0];
	}

	for (i = 0; i < properties.length; i++) {
		property = properties[i];
		prefixed = getStyleProperty(property);

		if (prefixed) {
			property = stripPrefixes(prefixed);
			value = computed[prefixed];

			if (!value || value === 'auto') {
				value = null;
			}

			if (value) {
				value = stripPrefixes(value);
			}
		} else {
			value = null;
		}

		styles[property] = value;
	}

	return styles;
};

// ac-dom-styles@3.1.2

},{"@marcom/ac-prefixer/getStyleProperty":106,"@marcom/ac-prefixer/stripPrefixes":110}],35:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var filterByNodeType = require('@marcom/ac-dom-nodes/filterByNodeType');
var filterBySelector = require('./filterBySelector');
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-traversal.children
 *
 * @function
 *
 * @desc Returns an Array of Elements that are direct children of the specified Node, matching an optional CSS selector.
 *
 * @param {Node} node
 *        The parent Element, Document, or Document Fragment.
 *
 * @param {String} [selector]
 *        Optional CSS selectors, separated by commas, to filter children Elements by.
 *
 * @returns {Element[]} Array of matching child Elements, in DOM order.
 */
module.exports = function children(node, selector) {
	var els;

	validate.parentNode(node, true, 'children');
	validate.selector(selector, false, 'children');

	els = node.children || node.childNodes;
	els = filterByNodeType(els);

	if (selector) {
		els = filterBySelector(els, selector);
	}

	return els;
};

// ac-dom-traversal@2.2.0

},{"./filterBySelector":36,"./internal/validate":38,"@marcom/ac-dom-nodes/filterByNodeType":27}],36:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.slice');
require('@marcom/ac-polyfills/Array/prototype.filter');

/** @ignore */
var matchesSelector = require('./matchesSelector');
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-traversal.filterBySelector
 *
 * @function
 *
 * @desc Filter an Array of Elements by a given CSS selector.
 *
 * @param {Node[]|NodeList} nodes
 *        The Elements to be filtered.
 *
 * @param {String} selector
 *        CSS selectors, separated by commas, to check Elements against.
 *
 * @returns {Element[]} A new Array of matching Elements.
 */
module.exports = function filterBySelector(nodes, selector) {
	validate.selector(selector, true, 'filterBySelector');

	nodes = Array.prototype.slice.call(nodes);

	return nodes.filter(function (el) {
		return matchesSelector(el, selector);
	});
};

// ac-dom-traversal@2.2.0

},{"./internal/validate":38,"./matchesSelector":39,"@marcom/ac-polyfills/Array/prototype.filter":68,"@marcom/ac-polyfills/Array/prototype.slice":75}],37:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
module.exports = window.Element ? (function (proto) {
	return proto.matches ||
		proto.matchesSelector ||
		proto.webkitMatchesSelector ||
		proto.mozMatchesSelector ||
		proto.msMatchesSelector ||
		proto.oMatchesSelector;
}(Element.prototype)) : null;

// ac-dom-traversal@2.2.0

},{}],38:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.indexOf');

/** @ignore */
var isNode = require('@marcom/ac-dom-nodes/isNode');
var COMMENT_NODE = require('@marcom/ac-dom-nodes/COMMENT_NODE');
var DOCUMENT_FRAGMENT_NODE = require('@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE');
var DOCUMENT_NODE = require('@marcom/ac-dom-nodes/DOCUMENT_NODE');
var ELEMENT_NODE = require('@marcom/ac-dom-nodes/ELEMENT_NODE');
var TEXT_NODE = require('@marcom/ac-dom-nodes/TEXT_NODE');

/** @ignore */
var isNodeType = function (node, nodeType) {
	if (!isNode(node)) {
		return false;
	}

	if (typeof nodeType === 'number') {
		return (node.nodeType === nodeType);
	}

	return (nodeType.indexOf(node.nodeType) !== -1);
};

/** @ignore */
var VALID_PARENT_NODE = [
	ELEMENT_NODE,
	DOCUMENT_NODE,
	DOCUMENT_FRAGMENT_NODE
];

/** @ignore */
var ERR_INVALID_PARENT_NODE = ' must be an Element, Document, or Document Fragment';

/** @ignore */
var VALID_CHILD_NODE = [
	ELEMENT_NODE,
	TEXT_NODE,
	COMMENT_NODE
];

/** @ignore */
var ERR_INVALID_CHILD_NODE = ' must be an Element, TextNode, or Comment';

/** @ignore */
var ERR_INVALID_SELECTOR = ' must be a string';

module.exports = {

	/** @ignore */
	parentNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'node';

		if ((node || required) && !isNodeType(node, VALID_PARENT_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_PARENT_NODE);
		}
	},

	/** @ignore */
	childNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'node';

		if (!node && !required) {
			return;
		}

		if (!isNodeType(node, VALID_CHILD_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_CHILD_NODE);
		}
	},

	/** @ignore */
	selector: function (selector, required, funcName, paramName) {
		paramName = paramName || 'selector';

		if ((selector || required) && typeof selector !== 'string') {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_SELECTOR);
		}
	}

};

// ac-dom-traversal@2.2.0

},{"@marcom/ac-dom-nodes/COMMENT_NODE":22,"@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE":23,"@marcom/ac-dom-nodes/DOCUMENT_NODE":24,"@marcom/ac-dom-nodes/ELEMENT_NODE":25,"@marcom/ac-dom-nodes/TEXT_NODE":26,"@marcom/ac-dom-nodes/isNode":32,"@marcom/ac-polyfills/Array/prototype.indexOf":70}],39:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isElement = require('@marcom/ac-dom-nodes/isElement');
var validate = require('./internal/validate');
var nativeMatches = require('./internal/nativeMatches');
var matchesSelectorShim = require('./shims/matchesSelector');

/**
 * @name module:ac-dom-traversal.matchesSelector
 *
 * @deprecated since version 2.2.0
 *  Use [ac-polyfills](https://interactive-git.apple.com/interactive-frameworks/ac-polyfills) `Element.prototype.matches` instead.
 *
 * @function
 *
 * @desc Returns whether or not an Element matches a given CSS selector.
 *
 * @param {Node} node
 *        The Element to be checked.
 *
 * @param {String} selector
 *        CSS selectors, separated by commas, to check Element against.
 *
 * @returns {Boolean} `true` if the Element matches the selector, otherwise `false`
 */
module.exports = function matchesSelector(node, selector) {
 	validate.selector(selector, true, 'matchesSelector');

 	if (!isElement(node)) {
 		return false;
 	}

 	if (!nativeMatches) {
 		return matchesSelectorShim(node, selector);
 	}

	return nativeMatches.call(node, selector);
};

// ac-dom-traversal@2.2.0

},{"./internal/nativeMatches":37,"./internal/validate":38,"./shims/matchesSelector":41,"@marcom/ac-dom-nodes/isElement":31}],40:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.slice');

/** @ignore */
var validate = require('./internal/validate');
var querySelectorAllShim = require('./shims/querySelectorAll');
var querySelectorAllAvailable = ('querySelectorAll' in document);

/**
 * @name module:ac-dom-traversal.querySelectorAll
 *
 * @deprecated since version 2.2.0
 *  Use native [Element.querySelectorAll()]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll} instead.
 *
 * @function
 *
 * @desc Returns an Array of Elements within the specified context that match given CSS selector(s).
 *
 * @param {String} selector
 *        One or more CSS selectors separated by commas.
 *
 * @param {Node} [context=document]
 *        An optional ParentNode to scope the selector to. Defaults to `document`.
 *
 * @returns {Element[]} Array of matching Elements
 */
module.exports = function querySelectorAll(selector, context) {
	context = context || document;

	validate.parentNode(context, true, 'querySelectorAll', 'context');
	validate.selector(selector, true, 'querySelectorAll');

	if (!querySelectorAllAvailable) {
		return querySelectorAllShim(selector, context);
	}

	return Array.prototype.slice.call(context.querySelectorAll(selector));
};

// ac-dom-traversal@2.2.0

},{"./internal/validate":38,"./shims/querySelectorAll":42,"@marcom/ac-polyfills/Array/prototype.slice":75}],41:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var querySelectorAll = require('/querySelectorAll');

/**
 * module:ac-dom-traversal.matchesSelector shim for IE < 8
 */
module.exports = function matchesSelector(node, selector) {
	var context = node.parentNode || document;
	var nodes = querySelectorAll(selector, context);
	var i;

	for (i = 0; i < nodes.length; i++) {
		if (nodes[i] === node) {
			return true;
		}
	}

	return false;
};

// ac-dom-traversal@2.2.0

},{"/querySelectorAll":40}],42:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.indexOf');

/** @ignore */
var isElement = require('@marcom/ac-dom-nodes/isElement');
var isDocumentFragment = require('@marcom/ac-dom-nodes/isDocumentFragment');
var removeElement = require('@marcom/ac-dom-nodes/remove');
var COLLECTION_PREFIX = '_ac_qsa_';

var isElementInContext = function (el, context) {
	var parent;

	if (context === document) {
		return true;
	}

	parent = el;
	while ((parent = parent.parentNode) && isElement(parent)) {
		if (parent === context) {
			return true;
		}
	}

	return false;
};

var recalcStyles = function (context) {
	if ('recalc' in context) {
		context.recalc(false);
	} else {
		document.recalc(false);
	}

	window.scrollBy(0, 0);
};

/**
 * module:ac-dom-traversal.querySelectorAll shim for IE < 8
 */
module.exports = function querySelectorAll(selector, context) {
	var style = document.createElement('style');
	var id = COLLECTION_PREFIX + (Math.random() + '').slice(-6);
	var els = [];
	var el;

	// default context
	context = context || document;

	// prepare the collection
	document[id] = [];

	if (isDocumentFragment(context)) {
		context.appendChild(style);
	} else {
		document.documentElement.firstChild.appendChild(style);
	}

	// prepare style tag
	// ac-qsa:expression() adds matching elements to the collection
	// display:recalc; is invalid, but forces display:none; elements to recalc
	style.styleSheet.cssText = '*{display:recalc;}' + selector + '{ac-qsa:expression(document["' + id + '"] && document["' + id + '"].push(this));}';

	// recalc styles
	recalcStyles(context);

	// cleanup and collect matched elements
	while (document[id].length) {
		el = document[id].shift();
		el.style.removeAttribute('ac-qsa');

		// don't repeat elements
		// and enforce the current context
		if (els.indexOf(el) === -1 && isElementInContext(el, context)) {
			els.push(el);
		}
	}

	// reset collection and styles
	document[id] = null;
	removeElement(style);
	recalcStyles(context);

	// done!
	return els;
};

// ac-dom-traversal@2.2.0

},{"@marcom/ac-dom-nodes/isDocumentFragment":30,"@marcom/ac-dom-nodes/isElement":31,"@marcom/ac-dom-nodes/remove":33,"@marcom/ac-polyfills/Array/prototype.indexOf":70}],43:[function(require,module,exports){
/**
 * @module ac-easing
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	createBezier: require('./ac-easing/createBezier'),
	createPredefined: require('./ac-easing/createPredefined'),
	createStep: require('./ac-easing/createStep'),
	Ease: require('./ac-easing/Ease')
};

// ac-easing@1.1.1

},{"./ac-easing/Ease":44,"./ac-easing/createBezier":45,"./ac-easing/createPredefined":46,"./ac-easing/createStep":47}],44:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ERR_FUNCTION_REQUIRE = 'Ease expects an easing function.';

/**
 * @name module:ac-easing.Ease
 * @class
 *
 * @param {Function} func
 *        An easing function.
 *
 * @param {String} [cssString=null]
 *        The CSS equivelant of the easing function.
 *        e.g. ease-in would be 'cubic-bezier(0.42, 0.0, 1.00, 1.0)'
 */
function Ease(func, cssString) {
	if (typeof func !== 'function') {
		throw new TypeError(ERR_FUNCTION_REQUIRE);
	}

	/**
	 * @name module:ac-easing.Ease#easingFunction
	 * @type {Function}
	 *
	 * @desc The easing function.
	 */
	this.easingFunction = func;

	/**
	 * @name module:ac-easing.Ease#cssString
	 * @type {String}
	 *
	 * @desc The CSS equivilant of the easing function.
	 */
	this.cssString = cssString || null;
}

var proto = Ease.prototype;

/**
 * @name module:ac-easing.Ease#getValue
 * @function
 *
 * @desc Returns the eased equivilant of the number passed.
 *
 * @param {Number} value
 *        A number between 0-1.
 *
 * @returns {Number} The eased equivilant of the number passed.
 */
proto.getValue = function (value) {
	return this.easingFunction(value, 0, 1, 1);
};

module.exports = Ease;

// ac-easing@1.1.1

},{}],45:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/Array/prototype.every');

/** @ignore */
var Ease = require('./Ease');
var KeySpline = require('./helpers/KeySpline');

/** @ignore */
var ERR_BEZIER_VALUES = 'Bezier curve expects exactly four (4) numbers. Given: ';

/**
 * @name module:ac-easing.createBezier
 *
 * @function
 *
 * @desc Create an easing function from a set of bezier curve points.
 *
 * @param {Number} x1
 *        The x-coordinate of the first Bézier control point.
 *
 * @param {Number} y1
 *        The y-coordinate of the first Bézier control point.
 *
 * @param {Number} x2
 *        The x-coordinate of the second Bézier control point.
 *
 * @param {Number} y2
 *        The y-coordinate of the second Bézier control point.
 *
 * @returns {Ease} A new instance of an Ease object.
 */
module.exports = function createBezier (x1, y1, x2, y2) {
	var pts = Array.prototype.slice.call(arguments);
	var allNums = pts.every(function (pt) {
		return (typeof pt === 'number');
	});

	if (pts.length !== 4 || !allNums) {
		throw new TypeError(ERR_BEZIER_VALUES + pts);
	}

	var keySpline = new KeySpline(x1, y1, x2, y2);

	var easingFn = function(time, begin, change, duration) {
		return keySpline.get(time / duration) * change + begin;
	};

	var cssString = 'cubic-bezier(' + pts.join(', ') + ')';

	return new Ease(easingFn, cssString);
};

// ac-easing@1.1.1

},{"./Ease":44,"./helpers/KeySpline":48,"@marcom/ac-polyfills/Array/prototype.every":67}],46:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var createStep = require('./createStep');
var cssAliases = require('./helpers/cssAliases');
var easingFunctions = require('./helpers/easingFunctions');

/** @ignore */
var Ease = require('./Ease');

/** @ignore */
var ERR_PREDEFINED = 'Easing function "%TYPE%" not recognized among the following: ' + Object.keys(easingFunctions).join(', ');

/**
 * @name module:ac-easing.createPredefined
 *
 * @function
 *
 * @desc Create an easing function from a set of predefined.
 *
 * @param {String} type
 *        The name of the ease, e.g. 'easeIn'.
 *
 * @returns {Ease} A new instance of an Ease object.
 */
module.exports = function createPredefined (type) {
	var easingFn;

	if (type === 'step-start') {
		return createStep(1, 'start');
	}
	else if (type === 'step-end') {
		return createStep(1, 'end');
	}
	else {
		easingFn = easingFunctions[type];
	}

	if (!easingFn) {
		throw new Error(ERR_PREDEFINED.replace('%TYPE%', type));
	}

	return new Ease(easingFn, cssAliases[type]);
};

// ac-easing@1.1.1

},{"./Ease":44,"./createStep":47,"./helpers/cssAliases":49,"./helpers/easingFunctions":50}],47:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var Ease = require('./Ease');

/** @ignore */
var ERR_STEP_TYPE = 'Step function expects a numeric value greater than zero. Given: ';
var ERR_STEP_DIRECTION = 'Step function direction must be either "start" or "end" (default). Given: ';

/**
 * @name module:ac-easing.createStep
 *
 * @function
 *
 * @desc Create a step easing function.
 *
 * @param {Number} steps
 *        Amount of steps.
 *
 * @param {String} [direction='end']
 *        Direction of ease.
 *
 * @returns {Ease} A new instance of an Ease object.
 */
module.exports = function createStep (steps, direction) {
	direction = direction || 'end';

	if (typeof steps !== 'number' || steps < 1) {
		throw new TypeError(ERR_STEP_TYPE + steps);
	}

	if (direction !== 'start' && direction !== 'end') {
		throw new TypeError(ERR_STEP_DIRECTION + direction);
	}

	var easingFn = function (time, begin, change, duration) {
		var length = change / steps;
		var step = Math[(direction === 'start') ? 'floor' : 'ceil'](time / duration * steps);
		return begin + length * step;
	};

	var cssString = 'steps(' + steps + ', ' + direction + ')';

	return new Ease(easingFn, cssString);
};

// ac-easing@1.1.1

},{"./Ease":44}],48:[function(require,module,exports){
/*! MIT License
 *
 * KeySpline - use bezier curve for transition easing function
 * Copyright (c) 2012 Gaetan Renaudeau <renaudeau.gaetan@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
* KeySpline - use bezier curve for transition easing function
* is inspired from Firefox's nsSMILKeySpline.cpp
* Usage:
* var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
* spline.get(x) => returns the easing value | x must be in [0, 1] range
*/

/* jshint newcap:false */


function KeySpline (mX1, mY1, mX2, mY2) {

  this.get = function(aX) {
    if (mX1 === mY1 && mX2 === mY2) { return aX; } // linear
    return CalcBezier(GetTForX(aX), mY1, mY2);
  };

  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C(aA1)      { return 3.0 * aA1; }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function CalcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function GetSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function GetTForX(aX) {
    // Newton raphson iteration
    var aGuessT = aX;
    for (var i = 0; i < 4; ++i) {
      var currentSlope = GetSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) { return aGuessT; }
      var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
}

module.exports = KeySpline;

// ac-easing@1.1.1

},{}],49:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

var aliases = {

	'linear': 'cubic-bezier(0, 0, 1, 1)',

	// ease
	'ease':        'cubic-bezier(0.25, 0.1, 0.25, 1)',
	'ease-in':     'cubic-bezier(0.42, 0, 1, 1)',
	'ease-out':    'cubic-bezier(0, 0, 0.58, 1)',
	'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',

	// cubic
	'ease-in-cubic':     'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
	'ease-out-cubic':    'cubic-bezier(0.215, 0.61, 0.355, 1)',
	'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',

	// quad
	'ease-in-quad':     'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
	'ease-out-quad':    'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	'ease-in-out-quad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

	// quart
	'ease-in-quart':     'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
	'ease-out-quart':    'cubic-bezier(0.165, 0.84, 0.44, 1)',
	'ease-in-out-quart': 'cubic-bezier(0.77, 0, 0.175, 1)',

	// quint
	'ease-in-quint':     'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
	'ease-out-quint':    'cubic-bezier(0.23, 1, 0.32, 1)',
	'ease-in-out-quint': 'cubic-bezier(0.86, 0, 0.07, 1)',

	// sine
	'ease-in-sine':     'cubic-bezier(0.47, 0, 0.745, 0.715)',
	'ease-out-sine':    'cubic-bezier(0.39, 0.575, 0.565, 1)',
	'ease-in-out-sine': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',

	// expo
	'ease-in-expo':     'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
	'ease-out-expo':    'cubic-bezier(0.19, 1, 0.22, 1)',
	'ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',

	// circ
	'ease-in-circ':     'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
	'ease-out-circ':    'cubic-bezier(0.075, 0.82, 0.165, 1)',
	'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',

	// back
	'ease-in-back':     'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
	'ease-out-back':    'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
	'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'

};

// ease
aliases['easeIn'] = aliases['ease-in'];
aliases['easeOut'] = aliases['ease-out'];
aliases['easeInOut'] = aliases['ease-in-out'];

// cubic
aliases['easeInCubic'] = aliases['ease-in-cubic'];
aliases['easeOutCubic'] = aliases['ease-out-cubic'];
aliases['easeInOutCubic'] = aliases['ease-in-out-cubic'];

// quad
aliases['easeInQuad'] = aliases['ease-in-quad'];
aliases['easeOutQuad'] = aliases['ease-out-quad'];
aliases['easeInOutQuad'] = aliases['ease-in-out-quad'];

// quart
aliases['easeInQuart'] = aliases['ease-in-quart'];
aliases['easeOutQuart'] = aliases['ease-out-quart'];
aliases['easeInOutQuart'] = aliases['ease-in-out-quart'];

// quint
aliases['easeInQuint'] = aliases['ease-in-quint'];
aliases['easeOutQuint'] = aliases['ease-out-quint'];
aliases['easeInOutQuint'] = aliases['ease-in-out-quint'];

// sine
aliases['easeInSine'] = aliases['ease-in-sine'];
aliases['easeOutSine'] = aliases['ease-out-sine'];
aliases['easeInOutSine'] = aliases['ease-in-out-sine'];

// expo
aliases['easeInExpo'] = aliases['ease-in-expo'];
aliases['easeOutExpo'] = aliases['ease-out-expo'];
aliases['easeInOutExpo'] = aliases['ease-in-out-expo'];

// circ
aliases['easeInCirc'] = aliases['ease-in-circ'];
aliases['easeOutCirc'] = aliases['ease-out-circ'];
aliases['easeInOutCirc'] = aliases['ease-in-out-circ'];

// back
aliases['easeInBack'] = aliases['ease-in-back'];
aliases['easeOutBack'] = aliases['ease-out-back'];
aliases['easeInOutBack'] = aliases['ease-in-out-back'];

module.exports = aliases;

// ac-easing@1.1.1

},{}],50:[function(require,module,exports){
'use strict';

/** @ignore */
var createBezier = require('/createBezier');

var ease = createBezier(0.25, 0.1, 0.25, 1.0).easingFunction;
var easeIn = createBezier(0.42, 0.0, 1.00, 1.0).easingFunction;
var easeOut = createBezier(0.00, 0.0, 0.58, 1.0).easingFunction;
var easeInOut = createBezier(0.42, 0.0, 0.58, 1.0).easingFunction;

var linear = function (time, begin, change, duration) {
	return change * time / duration + begin;
};

var easeInQuad = function (time, begin, change, duration) {
	return change * (time /= duration) * time + begin;
};

var easeOutQuad = function (time, begin, change, duration) {
	return -change * (time /= duration) * (time - 2) + begin;
};

var easeInOutQuad = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return change / 2 * time * time + begin;
	}
	return -change / 2 * ((--time) * (time - 2) - 1) + begin;
};

var easeInCubic = function (time, begin, change, duration) {
	return change * (time /= duration) * time * time + begin;
};

var easeOutCubic = function (time, begin, change, duration) {
	return change * ((time = time / duration - 1) * time * time + 1) + begin;
};

var easeInOutCubic = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return change / 2 * time * time * time + begin;
	}
	return change / 2 * ((time -= 2) * time * time + 2) + begin;
};

var easeInQuart = function (time, begin, change, duration) {
	return change * (time /= duration) * time * time * time + begin;
};

var easeOutQuart = function (time, begin, change, duration) {
	return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
};

var easeInOutQuart = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return change / 2 * time * time * time * time + begin;
	}
	return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
};

var easeInQuint = function (time, begin, change, duration) {
	return change * (time /= duration) * time * time * time * time + begin;
};

var easeOutQuint = function (time, begin, change, duration) {
	return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
};

var easeInOutQuint = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return change / 2 * time * time * time * time * time + begin;
	}
	return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;
};

var easeInSine = function (time, begin, change, duration) {
	return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
};

var easeOutSine = function (time, begin, change, duration) {
	return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
};

var easeInOutSine = function (time, begin, change, duration) {
	return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
};

var easeInExpo = function (time, begin, change, duration) {
	return (time === 0) ? begin : change * Math.pow(2, 10 * (time / duration - 1)) + begin;
};

var easeOutExpo = function (time, begin, change, duration) {
	return (time === duration) ? begin + change : change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
};

var easeInOutExpo = function (time, begin, change, duration) {
	if (time === 0) {
		return begin;
	}
	else if (time === duration) {
		return begin + change;
	}
	else if ((time /= duration / 2) < 1) {
		return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
	}
	return change / 2 * (-Math.pow(2, -10 * --time) + 2) + begin;
};

var easeInCirc = function (time, begin, change, duration) {
	return -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + begin;
};

var easeOutCirc = function (time, begin, change, duration) {
	return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
};

var easeInOutCirc = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
	}
	return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
};

var easeInElastic = function (time, begin, change, duration) {
	var shootover = 1.70158;
	var period = 0;
	var amplitude = change;
	if (time === 0) {
		return begin;
	}
	else if ((time /= duration) === 1) {
		return begin + change;
	}
	if (!period) {
		period = duration * 0.3;
	}
	if (amplitude < Math.abs(change)) {
		amplitude = change;
		shootover = period / 4;
	}
	else {
		shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
	}
	return -(amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period)) + begin;
};

var easeOutElastic = function (time, begin, change, duration) {
	var shootover = 1.70158;
	var period = 0;
	var amplitude = change;
	if (time === 0) {
		return begin;
	}
	else if ((time /= duration) === 1) {
		return begin + change;
	}
	if (!period) {
		period = duration * 0.3;
	}
	if (amplitude < Math.abs(change)) {
		amplitude = change;
		shootover = period / 4;
	}
	else {
		shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
	}
	return amplitude * Math.pow(2, -10 * time) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period) + change + begin;
};

var easeInOutElastic = function (time, begin, change, duration) {
	var shootover = 1.70158;
	var period = 0;
	var amplitude = change;
	if (time === 0) {
		return begin;
	}
	else if ((time /= duration / 2) === 2) {
		return begin + change;
	}
	if (!period) {
		period = duration * (0.3 * 1.5);
	}
	if (amplitude < Math.abs(change)) {
		amplitude = change;
		shootover = period / 4;
	}
	else {
		shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
	}
	if (time < 1) {
		return -0.5 * (amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period)) + begin;
	}
	return amplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period) * 0.5 + change + begin;
};


var easeInBack = function (time, begin, change, duration, shootover) {
	if (shootover === undefined) {
		shootover = 1.70158;
	}
	return change * (time /= duration) * time * ((shootover + 1) * time - shootover) + begin;
};

var easeOutBack = function (time, begin, change, duration, shootover) {
	if (shootover === undefined) {
		shootover = 1.70158;
	}
	return change * ((time = time / duration - 1) * time * ((shootover + 1) * time + shootover) + 1) + begin;
};

var easeInOutBack = function (time, begin, change, duration, shootover) {
	if (shootover === undefined) {
		shootover = 1.70158;
	}
	if ((time /= duration / 2) < 1) {
		return change / 2 * (time * time * (((shootover *= (1.525)) + 1) * time - shootover)) + begin;
	}
	return change / 2 * ((time -= 2) * time * (((shootover *= (1.525)) + 1) * time + shootover) + 2) + begin;
};

var easeOutBounce = function (time, begin, change, duration) {
	if ((time /= duration) < (1 / 2.75)) {
		return change * (7.5625 * time * time) + begin;
	}
	else if (time < (2 / 2.75)) {
		return change * (7.5625 * (time -= (1.5 / 2.75)) * time + 0.75) + begin;
	}
	else if (time < (2.5 / 2.75)) {
		return change * (7.5625 * (time -= (2.25 / 2.75)) * time + 0.9375) + begin;
	}
	return change * (7.5625 * (time -= (2.625 / 2.75)) * time + 0.984375) + begin;
};

var easeInBounce = function (time, begin, change, duration) {
	return change - easeOutBounce(duration - time, 0, change, duration) + begin;
};

var easeInOutBounce = function (time, begin, change, duration) {
	if (time < duration / 2) {
		return easeInBounce(time * 2, 0, change, duration) * 0.5 + begin;
	}
	return easeOutBounce(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;
};

/**
 * @name module:ac-easing.easingFunctions
 * @function
 * @param {Float} time
 *        Current position in time. Can be frames/seconds/milliseconds. ('t' in original Penner functions)
 * @param {Float} begin
 *        Start value. ('b' in original Penner functions)
 * @param {Float} change
 *        Change in value. ('c' in original Penner functions)
 * @param {Float} duration
 *        Duration. Can be frames/seconds/milliseconds. ('d' in original Penner functions)
 * @param {Float} [shootover=1.70158]
 *        Functions with 'Back' in their names take an additional optional parameter 'shootover', which
 *        controls the amount of overshoot. A higher value means greater overshoot. 'shootover' has a default
 *        value of 1.70158, which produces an overshoot of 10 percent. shootover==0 produces cubic easing with
 *        no overshoot. ('s' in original Penner functions)
 * @returns {Function}
 */
module.exports = {

	'linear': linear,

	// ease
	'ease':        ease,
	'easeIn':      easeIn,
	'ease-in':     easeIn,
	'easeOut':     easeOut,
	'ease-out':    easeOut,
	'easeInOut':   easeInOut,
	'ease-in-out': easeInOut,

	// cubic
	'easeInCubic':       easeInCubic,
	'ease-in-cubic':     easeInCubic,
	'easeOutCubic':      easeOutCubic,
	'ease-out-cubic':    easeOutCubic,
	'easeInOutCubic':    easeInOutCubic,
	'ease-in-out-cubic': easeInOutCubic,

	// quad
	'easeInQuad':       easeInQuad,
	'ease-in-quad':     easeInQuad,
	'easeOutQuad':      easeOutQuad,
	'ease-out-quad':    easeOutQuad,
	'easeInOutQuad':    easeInOutQuad,
	'ease-in-out-quad': easeInOutQuad,

	// quart
	'easeInQuart':       easeInQuart,
	'ease-in-quart':     easeInQuart,
	'easeOutQuart':      easeOutQuart,
	'ease-out-quart':    easeOutQuart,
	'easeInOutQuart':    easeInOutQuart,
	'ease-in-out-quart': easeInOutQuart,

	// quint
	'easeInQuint':       easeInQuint,
	'ease-in-quint':     easeInQuint,
	'easeOutQuint':      easeOutQuint,
	'ease-out-quint':    easeOutQuint,
	'easeInOutQuint':    easeInOutQuint,
	'ease-in-out-quint': easeInOutQuint,

	// sine
	'easeInSine':       easeInSine,
	'ease-in-sine':     easeInSine,
	'easeOutSine':      easeOutSine,
	'ease-out-sine':    easeOutSine,
	'easeInOutSine':    easeInOutSine,
	'ease-in-out-sine': easeInOutSine,

	// expo
	'easeInExpo':       easeInExpo,
	'ease-in-expo':     easeInExpo,
	'easeOutExpo':      easeOutExpo,
	'ease-out-expo':    easeOutExpo,
	'easeInOutExpo':    easeInOutExpo,
	'ease-in-out-expo': easeInOutExpo,

	// circ
	'easeInCirc':       easeInCirc,
	'ease-in-circ':     easeInCirc,
	'easeOutCirc':      easeOutCirc,
	'ease-out-circ':    easeOutCirc,
	'easeInOutCirc':    easeInOutCirc,
	'ease-in-out-circ': easeInOutCirc,

	// back
	'easeInBack':       easeInBack,
	'ease-in-back':     easeInBack,
	'easeOutBack':      easeOutBack,
	'ease-out-back':    easeOutBack,
	'easeInOutBack':    easeInOutBack,
	'ease-in-out-back': easeInOutBack,

	// elastic
	'easeInElastic':       easeInElastic,
	'ease-in-elastic':     easeInElastic,
	'easeOutElastic':      easeOutElastic,
	'ease-out-elastic':    easeOutElastic,
	'easeInOutElastic':    easeInOutElastic,
	'ease-in-out-elastic': easeInOutElastic,

	// bounce
	'easeInBounce':       easeInBounce,
	'ease-in-bounce':     easeInBounce,
	'easeOutBounce':      easeOutBounce,
	'ease-out-bounce':    easeOutBounce,
	'easeInOutBounce':    easeInOutBounce,
	'ease-in-out-bounce': easeInOutBounce

};

// ac-easing@1.1.1

},{"/createBezier":45}],51:[function(require,module,exports){
/**
 * @module ac-event-emitter-micro
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	EventEmitterMicro: require('./ac-event-emitter-micro/EventEmitterMicro')
};

// ac-event-emitter-micro@1.1.0

},{"./ac-event-emitter-micro/EventEmitterMicro":52}],52:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';


/**
 * A performance focused minimal event emitter.
 * @constructor
 * @class
 */
function EventEmitterMicro() {
	this._events = {};
}
/** @lends EventEmitterMicro.prototype */
var proto = EventEmitterMicro.prototype;

/**
 * Adds an event listener, which will fire `callback` when `eventName` is triggered
 * @param {String} eventName
 * @param {Function} callback
 */
proto.on = function(eventName, callback) {
	this._events[eventName] = this._events[eventName] || [];
	this._events[eventName].unshift(callback);
};

/**
 * Same as `on` however event will be removed after first trigger
 * @param {String} eventName
 * @param {Function} callback
 */
proto.once = function(eventName, callback){
	var that = this;
	function fn(data){
		that.off(eventName, fn);

		if(data !== undefined) callback(data);
		else callback();
	}

	this.on(eventName, fn);
};

/**
 * Removes an event listener, listening for `eventName` with `callback
 * @param {String} eventName
 * @param {Function} callback
 */
proto.off = function(eventName, callback) {
	if (!this.has(eventName)) return;

	var index = this._events[eventName].indexOf(callback);
	if( index === -1 ) return;

	this._events[eventName].splice(index, 1);
};

/**
 * Dispatches an event with the name `eventName`, optionally passing in additional data
 * @param {String} eventName
 * @param {*=} data	Optional data that will be passed to the callback -
 */
proto.trigger = function(eventName, data) {
	if (!this.has(eventName)) return;

	for(var i = this._events[eventName].length -1; i >= 0 ; i--) {
		// Don't pass `undefined` to functions which don't expect a value
		if(data !== undefined) this._events[eventName][i](data);
		else this._events[eventName][i]();
	}
};

/**
 * Returns true if there are any listeners for `eventName`
 * @param {String} eventName
 */
proto.has = function(eventName) {
	if (eventName in this._events === false || this._events[eventName].length === 0) {
		return false;
	}

	return true;
};

/**
 * Clears this EventEmitterMicro instance for GC
 * It is no longer usable once this is called
 */
proto.destroy = function(){
	for(var eventName in this._events) {
		this._events[eventName] = null;
	}
	this._events = null;
};

/** @type {EventEmitterMicro} */
module.exports = EventEmitterMicro;

// ac-event-emitter-micro@1.1.0

},{}],53:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:globals
 * @private
 */
module.exports = {
	/**
	 * @name module.globals.getWindow
	 *
	 * @function
	 *
	 * @desc Get the window object.
	 *
	 * @returns {Window}
	 */
	getWindow: function () {
		return window;
	},

	/**
	 * @name module.globals.getDocument
	 *
	 * @function
	 *
	 * @desc Get the document object.
	 *
	 * @returns {Document}
	 */
	getDocument: function () {
		return document;
	},

	/**
	 * @name module.globals.getNavigator
	 *
	 * @function
	 *
	 * @desc Get the navigator object.
	 *
	 * @returns {Navigator}
	 */
	getNavigator: function () {
		return navigator;
	}
};

// ac-feature@2.5.0

},{}],54:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var globalsHelper = require('./helpers/globals');
var once = require('@marcom/ac-function/once');

/**
 * @name module:ac-feature.svgAvailable
 *
 * @function
 *
 * @desc Returns the availability of SVG for <img> tags and background images.
 *
 * @returns {Boolean} `true` if SVG is supported, otherwise `false`.
 */
function svgAvailable() {
	var documentObj = globalsHelper.getDocument();

	return !!documentObj.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');
}

module.exports = once(svgAvailable);
module.exports.original = svgAvailable;

// ac-feature@2.5.0

},{"./helpers/globals":53,"@marcom/ac-function/once":56}],55:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var globalsHelper = require('./helpers/globals');
var once = require('@marcom/ac-function/once');

/**
 * @name module:ac-feature.touchAvailable
 *
 * @function
 *
 * @desc Returns the availability of touch events.
 *
 * @returns {Boolean} `true` if touch events are supported, otherwise `false`.
 */
function touchAvailable() {
	var windowObj = globalsHelper.getWindow();
	var documentObj = globalsHelper.getDocument();
	var navigatorObj = globalsHelper.getNavigator();

	// DocumentTouch is specific to Firefox <25 support.
	// navigator.maxTouchPoints and navigator.msMaxTouchPoints are specific to IE10 & 11
	return !!(('ontouchstart' in windowObj) ||
		(windowObj.DocumentTouch && documentObj instanceof windowObj.DocumentTouch) ||
		(navigatorObj.maxTouchPoints > 0) ||
		(navigatorObj.msMaxTouchPoints > 0));
}

module.exports = once(touchAvailable);
module.exports.original = touchAvailable;

// ac-feature@2.5.0

},{"./helpers/globals":53,"@marcom/ac-function/once":56}],56:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-function.once
 *
 * @function
 *
 * @desc Creates a function that executes `func` only once
 *
 * @param {Function} func
 *        The function to be executed once
 *
 * @returns {Function}
 */
module.exports = function once(func) {
	var result;

	return function () {
		if (typeof result === 'undefined') {
			result = func.apply(this, arguments);
		}

		return result;
	};
};

// ac-function@1.2.0

},{}],57:[function(require,module,exports){
/**
 * @module ac-headjs
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var addClass = require('@marcom/ac-classlist/add');
var removeClass = require('@marcom/ac-classlist/remove');
var extend = require('@marcom/ac-object/extend');

var FeatureDetect = function (targetElement, tests) {
	this._target = targetElement;
	this._tests = {};
	this.addTests(tests);
};

var proto = FeatureDetect.prototype;

proto.addTests = function (tests) {
	this._tests = extend(this._tests, tests || {});
};

proto._supports = function (feature) {
	if (typeof this._tests[feature] === 'undefined') {
		return false;
	}

	if (typeof this._tests[feature] === 'function') {
		// only run each test once
		this._tests[feature] = this._tests[feature]();
	}

	return this._tests[feature];
};

proto._addClass = function (feature, failure_prefix) {
	failure_prefix = failure_prefix || 'no-';

	if (this._supports(feature)) {
		addClass(this._target, feature);
	} else {
		addClass(this._target, failure_prefix + feature);
	}
};

proto.htmlClass = function () {
	var key;

	removeClass(this._target, 'no-js');
	addClass(this._target, 'js');

	for (key in this._tests) {
		if (this._tests.hasOwnProperty(key)) {
			this._addClass(key);
		}
	}
};

module.exports = FeatureDetect;

// ac-headjs@2.2.0

},{"@marcom/ac-classlist/add":7,"@marcom/ac-classlist/remove":12,"@marcom/ac-object/extend":63}],58:[function(require,module,exports){
'use strict';

var DEFAULT_ATTR = 'data-focus-method';

var ATTR_TOUCH = 'touch';
var ATTR_MOUSE = 'mouse';
var ATTR_KEY = 'key';

function FocusManager(target, attr) {
	this._target = target || document.body;
	this._attr = attr || DEFAULT_ATTR;
	this._focusMethod = this._lastFocusMethod = false;

	this._onKeyDown = this._onKeyDown.bind(this);
	this._onMouseDown = this._onMouseDown.bind(this);
	this._onTouchStart = this._onTouchStart.bind(this);
	this._onFocus = this._onFocus.bind(this);
	this._onBlur = this._onBlur.bind(this);
	this._onWindowBlur = this._onWindowBlur.bind(this);

	this._bindEvents();
}

var proto = FocusManager.prototype;

proto._bindEvents = function () {
	if (this._target.addEventListener) {
		this._target.addEventListener('keydown', this._onKeyDown, true);
		this._target.addEventListener('mousedown', this._onMouseDown, true);
		this._target.addEventListener('touchstart', this._onTouchStart, true);
		this._target.addEventListener('focus', this._onFocus, true);
		this._target.addEventListener('blur', this._onBlur, true);
		window.addEventListener('blur', this._onWindowBlur);
	}
};

proto._onKeyDown = function (evt) {
	this._focusMethod = ATTR_KEY;
};

proto._onMouseDown = function (evt) {
	if (this._focusMethod === ATTR_TOUCH) {
		return;
	}

	this._focusMethod = ATTR_MOUSE;
};

proto._onTouchStart = function (evt) {
	this._focusMethod = ATTR_TOUCH;
};

proto._onFocus = function (evt) {
	if (!this._focusMethod) {
		this._focusMethod = this._lastFocusMethod;
	}

	evt.target.setAttribute(this._attr, this._focusMethod);

	this._lastFocusMethod = this._focusMethod;
	this._focusMethod = false;
};

proto._onBlur = function (evt) {
	evt.target.removeAttribute(this._attr);
};

proto._onWindowBlur = function (evt) {
	this._focusMethod = false;
};

module.exports = FocusManager;

// ac-headjs@2.2.0

},{}],59:[function(require,module,exports){
/**
 * @module ac-headjs
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills');

var FeatureDetect = require('./FeatureDetect');
var defaultTests = require('./defaultTests');

module.exports = new FeatureDetect(document.documentElement, defaultTests);
module.exports.FeatureDetect = FeatureDetect;

// focus manager
var FocusManager = require('./FocusManager');

if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded', function () {
		new FocusManager();
	});
}

// ac-headjs@2.2.0

},{"./FeatureDetect":57,"./FocusManager":58,"./defaultTests":60,"@marcom/ac-polyfills":98}],60:[function(require,module,exports){
/**
 * @module ac-headjs
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var ac_browser = require('@marcom/ac-browser');
var touchAvailable = require('@marcom/ac-feature/touchAvailable');
var svgAvailable = require('@marcom/ac-feature/svgAvailable');

var ie8Test = function () {
	return (ac_browser.IE && ac_browser.IE.documentMode === 8);
};

module.exports = {
	touch: touchAvailable,
	svg: svgAvailable,
	ie8: ie8Test,
	'progressive-image': true
};

// ac-headjs@2.2.0

},{"@marcom/ac-browser":1,"@marcom/ac-feature/svgAvailable":54,"@marcom/ac-feature/touchAvailable":55}],61:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var F = function () {};

/**
 * @name module:ac-object.create
 *
 * @function
 *
 * @desc Create a new Object who’s prototype is the object passed
 *
 * @see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 *
 * @param {Object} proto
 *        The prototype for the new Object
 *
 * @returns {Object} The new Object
 */
module.exports = function create(proto) {
	// Don’t support second argument because it is not possible to accurately polyfill
	if (arguments.length > 1) {
		throw new Error('Second argument not supported');
	}

	// Prototype object is required
	if (proto === null || typeof proto !== 'object') {
		throw new TypeError('Object prototype may only be an Object.');
	}

	// If native Object.create exists, use it!
	if (typeof Object.create === 'function') {
		return Object.create(proto);

	// Otherwise create a new Object F with the prototype provided assigned to it
	} else {
		F.prototype = proto;
		return new F();
	}
};

// ac-object@1.3.1

},{}],62:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var extend = require('./extend');

/**
 * @name module:ac-object.defaults
 *
 * @function
 *
 * @desc Combines defaults and options into a new object and returns it.
 *
 * @param {Object} defaultsObj
 *        The defaults object.
 *
 * @param {Object} options
 *        The options object.
 *
 * @returns {Object} An object resulting from the combination of defaults and options.
 */
module.exports = function defaults (defaultsObj, options) {
	if (typeof defaultsObj !== 'object'){
		throw new TypeError('defaults: must provide a defaults object');
	}
	options = options || {};
	if (typeof options !== 'object'){
		throw new TypeError('defaults: options must be a typeof object');
	}
	return extend({}, defaultsObj, options);
};

// ac-object@1.3.1

},{"./extend":63}],63:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.forEach');

/** @ignore */
var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @name module:ac-object.extend
 *
 * @function
 *
 * @desc Add properties from one object into another. Not a deep copy.
 *
 * @param {Object} destination
 *        The object where the properties will end up. Properties in this Object
 *        that have the same key as properties in the source object will be
 *        overwritten with the source property’s value. If destination is not
 *        provided a blank object is created.
 *
 * @param {Object} source
 *        The properties to add / overwrite in the destination Object. An infinite
 *        number of source paramaters may be passed.
 *
 * @returns {Object} The extended object.
 */
module.exports = function extend () {
	var args;
	var dest;

	if (arguments.length < 2) {
		args = [{}, arguments[0]];
	} else {
		args = [].slice.call(arguments);
	}

	dest = args.shift();

	args.forEach(function (source) {
		if (source != null) {
			for (var property in source) {
				// Anything that does not prototype Object will not have this method
				if (hasOwnProp.call(source, property)) {
					dest[property] = source[property];
				}
			}
		}
	});

	return dest;
};

// ac-object@1.3.1

},{"@marcom/ac-polyfills/Array/prototype.forEach":69}],64:[function(require,module,exports){
'use strict';

require('./Array/from');
require('./Array/isArray');
require('./Array/prototype.every');
require('./Array/prototype.filter');
require('./Array/prototype.forEach');
require('./Array/prototype.indexOf');
require('./Array/prototype.lastIndexOf');
require('./Array/prototype.map');
require('./Array/prototype.reduce');
require('./Array/prototype.reduceRight');
require('./Array/prototype.slice');
require('./Array/prototype.some');

// ac-polyfills@2.6.0

},{"./Array/from":65,"./Array/isArray":66,"./Array/prototype.every":67,"./Array/prototype.filter":68,"./Array/prototype.forEach":69,"./Array/prototype.indexOf":70,"./Array/prototype.lastIndexOf":71,"./Array/prototype.map":72,"./Array/prototype.reduce":73,"./Array/prototype.reduceRight":74,"./Array/prototype.slice":75,"./Array/prototype.some":76}],65:[function(require,module,exports){
if (!Array.from) {
	Array.from = (function () {
		var toStr = Object.prototype.toString;
		var isCallable = function (fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function (value) {
			var number = Number(value);
			if (isNaN(number)) { return 0; }
			if (number === 0 || !isFinite(number)) { return number; }
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		// The length property of the from method is 1.
		return function from(arrayLike/*, mapFn, thisArg */) {
			// 1. Let C be the this value.
			var C = this;

			// 2. Let items be ToObject(arrayLike).
			var items = Object(arrayLike);

			// 3. ReturnIfAbrupt(items).
			if (arrayLike == null) {
				throw new TypeError("Array.from requires an array-like object - not null or undefined");
			}

			// 4. If mapfn is undefined, then let mapping be false.
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			// 10. Let lenValue be Get(items, "length").
			// 11. Let len be ToLength(lenValue).
			var len = toLength(items.length);

			// 13. If IsConstructor(C) is true, then
			// 13. a. Let A be the result of calling the [[Construct]] internal method
			// of C with an argument list containing the single item len.
			// 14. a. Else, Let A be ArrayCreate(len).
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			// 16. Let k be 0.
			var k = 0;
			// 17. Repeat, while k < len… (also steps a - h)
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			// 18. Let putStatus be Put(A, "length", len, true).
			A.length = len;
			// 20. Return A.
			return A;
		};
	}());
}

// ac-polyfills@2.6.0

},{}],66:[function(require,module,exports){
if (!Array.isArray) {
    /**
     * Returns true if an object is an array, false if it is not.
     * @param {Object} object Object to test against.
     * @name Array.isArray
     */
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
// ac-polyfills@2.6.0

},{}],67:[function(require,module,exports){
if (!Array.prototype.every) {
/**
	Behaving in a similar yet opposite fashion to Array.prototype.some, Array.prototype.every tests whether
	all elements in the array pass the test implemented by the provided function. A return of false by the
	callback will immediately return false for the whole method.
	@param {Function} callback Function to test against. The callback should return a boolean value. Please
	note that 'falsy' values, e.g. no return, will evaluate to false.
	@param {Object} thisObj Object to use as `this` when executing the callback.
	@returns {Boolean} Returns true if all objects pass the test implemented by the provided function.
	@reference https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every
*/
	Array.prototype.every = function every(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObject.length >>> 0;
		var i;

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObject && !callback.call(thisObj, arrayObject[i], i, arrayObject)) {
				return false;
			}
		}
		return true;
	};
}
// ac-polyfills@2.6.0

},{}],68:[function(require,module,exports){
if (!Array.prototype.filter) {
/**
	Tests all elements in an array and returns a new array filled with elements that pass the test.
	@param {Function} callback Function to test against. The callback must return a boolean value.
	@param {Object} thisObj Object to use as `this` when executing the callback.
	@returns {Array} Returns a new array populated with values from the original array that passed the test implemented by the provided function.
	@reference https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter
*/
	Array.prototype.filter = function filter(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObject.length >>> 0;
		var i;
		var results = [];

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObject && callback.call(thisObj, arrayObject[i], i, arrayObject)) {
				results.push(arrayObject[i]);
			}
		}

		return results;
	};
}
// ac-polyfills@2.6.0

},{}],69:[function(require,module,exports){
if (!Array.prototype.forEach) {
/**
	Executes a provided function once per array element.
	@param callback {Function} Object to test against.
	@param thisObj {Object} What the callback method is bound to.
*/
	Array.prototype.forEach = function forEach(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var i;
		var currentValue;

		if (typeof callback !== 'function') {
			throw new TypeError('No function object passed to forEach.');
		}

		var length = this.length

		for (i = 0; i < length; i += 1) {
			currentValue = arrayObject[i];
			callback.call(thisObj, currentValue, i, arrayObject);
		}
	};
}
// ac-polyfills@2.6.0

},{}],70:[function(require,module,exports){
if (!Array.prototype.indexOf) {
/**
	Returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found.
	@param searchElement {Object} Element to locate in the array.
	@param fromIndex {Number} Optional; the index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
*/
	Array.prototype.indexOf = function indexOf(searchElement, fromIndex) {
		var startIndex = fromIndex || 0;
		var currentIndex = 0;

		if (startIndex < 0) {
			startIndex = this.length + fromIndex - 1;
			if (startIndex < 0) {
				throw 'Wrapped past beginning of array while looking up a negative start index.';
			}
		}

		for (currentIndex = 0; currentIndex < this.length; currentIndex++) {
			if (this[currentIndex] === searchElement) {
				return currentIndex;
			}
		}

		return (-1);
	};
}
// ac-polyfills@2.6.0

},{}],71:[function(require,module,exports){
if (!Array.prototype.lastIndexOf) {
/**
	<p>Returns thelast index at which a given element can be found in the array, or -1 if it is not present.
	The array is searched backwards, starting at fromIndex.</p>
	<p><em>It should be noted that the Prototype library also implementes a version of this polyfill that doesn't behave
	according exactly to the ECMA-262 5.1 spec. Where this version will default the `fromIndex` paramater to the
	array's length if `fromIndex > array.length`, the Prototype version will not and as a result will return a different value.
	Care should be taken when using this library in conjunction with Prototype as Prototype's version will override
	this version in non-supporting browsers if it is included in the application ahead of ac_base.js.</em></p>

	@param {Object} value The element to locate in the array.
	@param {Number} fromIndex Optional; The index at which to start searching backwards. Defaults to the array's length.
		If negative, it is taken as the offset from the end of the array. If the index is 0, -1 is returned; the array
		will not be searched.
	@returns {Number} Returns the last index at which the element can be found. Else, returns -1.
*/
	Array.prototype.lastIndexOf = function lastIndexOf(value, fromIndex) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i;
		fromIndex = parseInt(fromIndex, 10);

		// Return -1 if the array has no length
		if (len <= 0) {
			return -1;
		}

		// Is fromIndex provided? Set i accordingly if it is
		i = (typeof fromIndex === 'number') ? Math.min(len - 1, fromIndex) : len - 1;

		// Handle negative indices
		i = i >= 0 ? i : len - Math.abs(i);

		// Search backwards through array
		for (; i >= 0; i -= 1) {
			if (i in arrayObj && value === arrayObj[i]) {
				return i;
			}
		}

		return -1;

	};
}
// ac-polyfills@2.6.0

},{}],72:[function(require,module,exports){
if (!Array.prototype.map) {
/**
	<p>Calls a provided callback function once for each element in an array, in order, and constructs a new array from the results</p>
	<p>Usage:<p>
	<pre>
	var mapArray = ['foo', 'bar', 'baz'];
	var mapFunction = function (value) {
		return value + '_cat';
	}
	console.log(mapArray.map(mapFunction));
	</pre>
	@param {Function} callback The function to execute on each element in the array
	@param {Object} thisObj Optional; The object to use as `this` when executing the callback
	@returns {Object} A new array containing the results from the callback function.
		Array elements will be in the same order as the original array.
*/
	Array.prototype.map = function map(callback, thisObj) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i;
		var result = new Array(len);

		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObj) {
				result[i] = callback.call(thisObj, arrayObj[i], i, arrayObj);
			}
		}

		return result;
	};
}
// ac-polyfills@2.6.0

},{}],73:[function(require,module,exports){
if (!Array.prototype.reduce) {
/**
	<p>Applies an accumulation function to every value in an array from left to right and returns a single value.</p>
	<p>Usage:</p>
	<pre>
	var reduceArray = [1, 2, 3, 4, 5];
	var reduceFunction = function (previousValue, currentValue, index, array) {
		return previousValue + currentValue;
	};
	console.log(reduceArray.reduce(reduceFunction));
	</pre>
	@param {Function} callback The function to execute on each value in the array.
		<p><code>callback</code> takes four arguments:</p>
		<dl>
			<dt><strong>previousValue</strong></dt>
			<dd>The value previously returned by the last invocation of the callback, or <code>initialValue</code>, if supplied.</dd>
			<dt><strong>currentValue</strong></dt>
			<dd>The current array value being processed.</dd>
			<dt><strong>index</strong></dt>
			<dd>The index of the current array value being processed in the array.</dd>
			<dt><strong>array</strong></dt>
			<dd>The array <code>reduce</code> was called upon.</dd>
		</dl>
	@param {Mixed} initialValue Optional; If provided, then the first time the callback is called <code>initialValue</code> will be used
		as the value for <code>previousValue</code> and <code>currentValue</code> will be equal to the first value in the array. If not
		provided then <code>previousValue</code> will be equal to the first value in the array and <code>currentValue</code> will be
		equal to the second.
	@returns {Mixed} Reduce returns a single value that is the result of the accumulation function applied to each array element.
*/
	Array.prototype.reduce = function reduce(callback, initialValue) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i = 0;
		var result;

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		if (typeof initialValue === 'undefined') {
			if (!len) {
				// No value to return if we have an empty array and no initialValue
				throw new TypeError('Reduce of empty array with no initial value');
			}
			result = arrayObj[0];
			// Start at second element when initialValue is not provided
			i = 1;
		} else {
			result = initialValue;
		}

		while (i < len) {
			if (i in arrayObj) {
				result = callback.call(undefined, result, arrayObj[i], i, arrayObj);
				i += 1;
			}
		}

		return result;
	};
}
// ac-polyfills@2.6.0

},{}],74:[function(require,module,exports){
if (!Array.prototype.reduceRight) {
/**
	<p>Applies an accumulation function to every element in an array from right to left and returns a single value.</p>
	<p>Usage:</p>
	<pre>
	var reduceRightArray = ['foo', 'bar', 'baz'];
	var reduceRightFn = function (previousValue, currentValue, index, array) {
		return previousValue + '_' + currentValue;
	}
	console.log(reduceRightArray.reduceRight(reduceRightFn));
	</pre>
	@param {Function} callback The function to execute on each value in the array.
		<p><code>callback</code> takes four arguments:</p>
		<dl>
			<dt><strong>previousValue</strong></dt>
			<dd>The value previously returned by the last invocation of the callback, or <code>initialValue</code>, if supplied.</dd>
			<dt><strong>currentValue</strong></dt>
			<dd>The current element being processed in the array.</dd>
			<dt><strong>index</strong></dt>
			<dd>The index of the current element being processed in the array.</dd>
			<dt><strong>array</strong></dt>
			<dd>The array <code>reduce</code> was called upon.</dd>
		</dl>
	@param {Mixed} initialValue Optional; If provided, then the first time the callback is called <code>initialValue</code> will be used
		as the value for <code>previousValue</code> and <code>currentValue</code> will be equal to the last value in the array. If not
		provided then <code>previousValue</code> will be equal to the last value in the array and <code>currentValue</code> will be
		equal to the second to last value.
	@returns {Mixed} Reduce returns a single value that is the result of the accumulation function applied to each array element.
*/
	Array.prototype.reduceRight = function reduceRight(callback, initialValue) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i = len - 1;
		var result;

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		if (initialValue === undefined) {
			if (!len) {
				// No value to return if we have an empty array and no initialValue
				throw new TypeError('Reduce of empty array with no initial value');
			}
			result = arrayObj[len - 1];
			// Start at second to last element when initialValue is not provided
			i = len - 2;
		} else {
			result = initialValue;
		}

		while (i >= 0) {
			if (i in arrayObj) {
				result = callback.call(undefined, result, arrayObj[i], i, arrayObj);
				i -= 1;
			}
		}

		return result;
	};
}
// ac-polyfills@2.6.0

},{}],75:[function(require,module,exports){
/**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES6, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when
 * called on other DOM objects.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 */
(function () {
    'use strict';
    var _slice = Array.prototype.slice;

    try {
        // Can't be used with DOM elements in IE < 9
        _slice.call(document.documentElement);
    } catch (e) { // Fails in IE < 9
        // This will work for genuine arrays, array-like objects,
        // NamedNodeMap (attributes, entities, notations),
        // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
        // and will not fail on other DOM objects (as do DOM elements in IE < 9)
        Array.prototype.slice = function (begin, end) {
            // IE < 9 gets unhappy with an undefined end argument
            end = (typeof end !== 'undefined') ? end : this.length;

            // For native Array objects, we use the native slice function
            if (Object.prototype.toString.call(this) === '[object Array]'){
                return _slice.call(this, begin, end);
            }

            // For array like object we handle it ourselves.
            var i, cloned = [],
                size, len = this.length;

            // Handle negative value for "begin"
            var start = begin || 0;
            start = (start >= 0) ? start: len + start;

            // Handle negative value for "end"
            var upTo = (end) ? end : len;
            if (end < 0) {
                upTo = len + end;
            }

            // Actual expected size of the slice
            size = upTo - start;

            if (size > 0) {
                cloned = new Array(size);
                if (this.charAt) {
                    for (i = 0; i < size; i++) {
                        cloned[i] = this.charAt(start + i);
                    }
                } else {
                    for (i = 0; i < size; i++) {
                        cloned[i] = this[start + i];
                    }
                }
            }

            return cloned;
        };
    }
}());
// ac-polyfills@2.6.0

},{}],76:[function(require,module,exports){
if (!Array.prototype.some) {
/**
	Essentially the opposite of Array.prototype.every, Array.prototype.some calls a provided callback function once
	for each element in an array, until the callback function returns true.
	@param {Function} callback The fucntion to execute on each element in the array. The return value must evaluate to
	a boolean true in order for the entire method to return true.
	@param {Object} thisObj Optional; The object to use as `this` when executing the callback
	@returns {Boolean} true if the callback returns a true value, otherwise false.
*/
	Array.prototype.some = function some(callback, thisObj) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i;

		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObj && callback.call(thisObj, arrayObj[i], i, arrayObj) === true) {
				return true;
			}
		}

		return false;
	};
}
// ac-polyfills@2.6.0

},{}],77:[function(require,module,exports){
/**
 * The DOM CustomEvent are events initialized by an application for any purpose.
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 *
 * This is not compatible with IE < 9.
 *
 * @return {Function} CustomEvent constructor
 */

if (document.createEvent) {
	try {
		new window.CustomEvent('click');
	} catch (err) {
		window.CustomEvent = (function () {
			function CustomEvent(event, params) {
				params = params || {bubbles: false, cancelable: false, detail: undefined};
				var evt = document.createEvent('CustomEvent');
				evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
				return evt;
			}
			CustomEvent.prototype = window.Event.prototype;
			return CustomEvent;
		}());
	}
}
// ac-polyfills@2.6.0

},{}],78:[function(require,module,exports){
'use strict';

require('./Date/now');
require('./Date/prototype.toISOString');
require('./Date/prototype.toJSON');

// ac-polyfills@2.6.0

},{"./Date/now":79,"./Date/prototype.toISOString":80,"./Date/prototype.toJSON":81}],79:[function(require,module,exports){
if (!Date.now) {
/**
	Returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
	@returns {Integer} The number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
*/
	Date.now = function now() {
		return new Date().getTime();
	};
}
// ac-polyfills@2.6.0

},{}],80:[function(require,module,exports){
if (!Date.prototype.toISOString) {
/**
	<p>Returns a string from a Date object formatted per the ISO 8601 Extended Format.</p>
	<p><em>Please note that the Prototype library also polyfills this method. However their polyfill
	does not entirely adhere to the ES5 spec. The Prototype version fails to include the milliseconds
	and does not provide support for the extended year format. Be aware that if the Prototype library
	is included ahead of ac_base.js in your application, Prototype's version will take precedence
	on non-supporting browsers.</em></p>
	@returns {String} Returns a date string formatted per the ISO 8601 Extended format.
*/
	Date.prototype.toISOString = function toISOString() {
		if (!isFinite(this)) {
			throw new RangeError('Date.prototype.toISOString called on non-finite value.');
		}

		var parts = {
			'year': this.getUTCFullYear(),
			'month': this.getUTCMonth() + 1,
			'day': this.getUTCDate(),
			'hours': this.getUTCHours(),
			'minutes': this.getUTCMinutes(),
			'seconds': this.getUTCSeconds(),
			'mseconds': (this.getUTCMilliseconds() / 1000).toFixed(3).substr(2, 3)
		};
		var prop;
		var prefix;

		// Pad single digits with a leading 0
		for (prop in parts) {
			if (parts.hasOwnProperty(prop) && prop !== 'year' && prop !== 'mseconds') {
				parts[prop] = String(parts[prop]).length === 1 ? '0' + String(parts[prop]) : String(parts[prop]);
			}
		}

		// Support for extended years per 15.9.1.15.1 (http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)
		if (parts.year < 0 || parts.year > 9999) {
			prefix = parts.year < 0 ? '-' : '+';
			parts.year = prefix + String(Math.abs(parts.year / 1000000)).substr(2, 6);
		}

		return parts.year + '-' + parts.month + '-' + parts.day + 'T' + parts.hours + ':' + parts.minutes + ':' + parts.seconds + '.' + parts.mseconds + 'Z';
	};

}
// ac-polyfills@2.6.0

},{}],81:[function(require,module,exports){
if (!Date.prototype.toJSON) {
/**
	<p>Provides a String representation of a Date object for use by JSON.stringify</p>
	<p><strong>Note 1:</strong> The toJSON method is intentionally generic; it does not require that its `this` value be a Date object.
	Therefore, it can be transferred to other kinds of objects for use as a method. However, it does require that
	any such object have a <code>toISOString</code> method. Full info can be found in the ES5 spec (15.9.5.44):
	http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf</p>
	<p><strong>Note 2:</strong> The Prototype library also polyfills this method. However their polyfill
	does not adhere to the ES5 spec. The Prototype version fails to include the ignored <code>key</code> argument,
	and only returns a call to <code>Date.toISOString()</code>. This is quite different from the behavior defined in the ES5 spec.
	Be aware that if the Prototype library is included ahead of ac_base.js in your application, Prototype's version
	will take precedence on non-supporting browsers.</p>
	@param {Mixed} key The key argument is ignored, however an object is free to use the <code>key</code>
		argument to filter its stringification.
	@returns {String} Returns a date string formatted per the ISO 8601 Extended format for use with JSON.stringify
*/
	Date.prototype.toJSON = function (key) {
		var obj = Object(this);
		var prim;

		// These primitive related functions simulate the required call to the internal ToPrimitive() construct per the ES5 spec.
		var isPrimitive = function (input) {
			var type = typeof input;

			var types = [null, 'undefined', 'boolean', 'string', 'number'].some(function (value) {
				return value === type;
			});

			if (types) {
				return true;
			}

			return false;
		};

		var toPrimitive = function (input) {
			var value;

			if (isPrimitive(input)) {
				return input;
			}

			value = (typeof input.valueOf === 'function') ? input.valueOf() : (typeof input.toString === 'function') ? input.toString() : null;

			if (value && isPrimitive(value)) {
				return value;
			}

			throw new TypeError(input + ' cannot be converted to a primitive');
		};

		prim = toPrimitive(obj);

		if (typeof prim === 'number' && !isFinite(prim)) {
			return null;
		}

		if (typeof obj.toISOString !== 'function') {
			throw new TypeError('toISOString is not callable');
		}

		return obj.toISOString.call(obj);
	};
}
// ac-polyfills@2.6.0

},{}],82:[function(require,module,exports){
'use strict';

require('./Element/prototype.classList');
require('./Element/prototype.matches');
require('./Element/prototype.remove');

// ac-polyfills@2.6.0

},{"./Element/prototype.classList":83,"./Element/prototype.matches":84,"./Element/prototype.remove":85}],83:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}

// ac-polyfills@2.6.0

},{}],84:[function(require,module,exports){
'use strict';

/**
 * @name module:ac-polyfills.Element.prototype.matches
 *
 * @function
 *
 * @desc https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill}
 */

if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function(s) {
			var matches = (this.document || this.ownerDocument).querySelectorAll(s),
				i = matches.length;
			while (--i >= 0 && matches.item(i) !== this) {}
			return i > -1;
		};
}

// ac-polyfills@2.6.0

},{}],85:[function(require,module,exports){
'use strict';

/**
 * @name module:ac-polyfills.Element.prototype.remove
 *
 * @function
 *
 * @desc https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
 */

module.exports = (function () {
	if (!('remove' in Element.prototype)) {
		Element.prototype.remove = function() {
			if (this.parentNode) {
				this.parentNode.removeChild(this);
			}
		};
	}
});

// ac-polyfills@2.6.0

},{}],86:[function(require,module,exports){
'use strict';

require('./Function/prototype.bind');

// ac-polyfills@2.6.0

},{"./Function/prototype.bind":87}],87:[function(require,module,exports){
if (!Function.prototype.bind) {
/**
	Creates a new function that, when called, itself calls this function in the context of the provided
	this value, with a given sequence of arguments preceding any provided when the new function was called.
	Arguments may be passed to bind as separate arguments following `thisObj`.
	@param {Object} thisObj The object that will provide the context of `this` for the called function.
*/
	Function.prototype.bind = function(originalContext){
		if (typeof this !== 'function') {
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}
		var applicableArgs = Array.prototype.slice.call(arguments, 1);
		var functionToBind = this;
		var fnOriginalPrototype = function(){ };
		var fnBound = function() {
			return functionToBind.apply(
				(this instanceof fnOriginalPrototype && originalContext) ? this : originalContext,
				applicableArgs.concat(Array.prototype.slice.call(arguments))
			);
		}
		fnOriginalPrototype.prototype = this.prototype;
		fnBound.prototype = new fnOriginalPrototype();
		return fnBound;
	};
}

// ac-polyfills@2.6.0

},{}],88:[function(require,module,exports){
/*
    json2.js
    2014-02-04
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
    This file creates a global JSON object containing two methods: stringify
    and parse.
        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.
            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.
            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.
            This method produces a JSON text from a JavaScript value.
            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value
            For example, this would serialize Dates as ISO strings.
                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }
                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };
            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.
            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.
            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.
            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.
            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.
            Example:
            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'
            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'
        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.
            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.
            Example:
            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.
            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });
            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });
    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
// ac-polyfills@2.6.0

},{}],89:[function(require,module,exports){
'use strict';

require('./Object/assign');
require('./Object/create');
require('./Object/is');
require('./Object/keys');

// ac-polyfills@2.6.0

},{"./Object/assign":90,"./Object/create":91,"./Object/is":92,"./Object/keys":93}],90:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill

if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}
// ac-polyfills@2.6.0

},{}],91:[function(require,module,exports){
if (!Object.create) {
    /** @ignore */
    var F = function () {};

    Object.create = function (proto) {
        // Don’t support second argument because it is not possible to accurately polyfill
        if (arguments.length > 1) {
            throw new Error('Second argument not supported');
        }
        // Prototype object is required
        if (proto === null || typeof proto !== 'object') {
            throw new TypeError('Object prototype may only be an Object.');
        }
        F.prototype = proto;
        return new F();
    };
}
// ac-polyfills@2.6.0

},{}],92:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
if (!Object.is) {
  Object.is = function(v1, v2) {
    if (v1 === 0 && v2 === 0) {
      return 1 / v1 === 1 / v2;
    }
    if (v1 !== v1) {
      return v2 !== v2;
    }
    return v1 === v2;
  };
}
// ac-polyfills@2.6.0

},{}],93:[function(require,module,exports){
if (!Object.keys) {
/**
	Returns an array of strings representing all the enumerable property names of the object.
	@param {Object} Object who's keys to return.
*/
	Object.keys = function keys(obj) {
		var keysArray = [];
		var currentKey;

		if ((!obj) || (typeof obj.hasOwnProperty !== 'function')) {
			throw 'Object.keys called on non-object.';
		}

		for (currentKey in obj) {
			if (obj.hasOwnProperty(currentKey)) {
				keysArray.push(currentKey);
			}
		}

		return keysArray;
	};
}
// ac-polyfills@2.6.0

},{}],94:[function(require,module,exports){
/*@ignore*/
module.exports = require('es6-promise').polyfill();
// ac-polyfills@2.6.0

},{"es6-promise":114}],95:[function(require,module,exports){
'use strict';

require('./String/prototype.trim');

// ac-polyfills@2.6.0

},{"./String/prototype.trim":96}],96:[function(require,module,exports){
if (!String.prototype.trim) {
/**
	Removes whitespace from both ends of the string.
*/
	String.prototype.trim = function trim() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}
// ac-polyfills@2.6.0

},{}],97:[function(require,module,exports){
window.XMLHttpRequest = window.XMLHttpRequest || function () {
	var request;
	try {
		request = new ActiveXObject("Msxml2.XMLHTTP");
	// Couldn’t get newer MS-proprietary ActiveX object
	} catch (exception) {
		try {
			request = new ActiveXObject("Microsoft.XMLHTTP");
		// Total XMLHTTP fail
		} catch (exception) {
			request = false;
		}
	}
	return request;
};
// ac-polyfills@2.6.0

},{}],98:[function(require,module,exports){
'use strict';

require('./Array');
require('./console.log');
require('./CustomEvent');
require('./Date');
require('./Element');
require('./Function');
require('./getComputedStyle');
require('./html5shiv');
require('./JSON');
require('./matchMedia');
require('./Object');
require('./performance');
require('./Promise');
require('./requestAnimationFrame');
require('./String');
require('./XMLHttpRequest');

// ac-polyfills@2.6.0

},{"./Array":64,"./CustomEvent":77,"./Date":78,"./Element":82,"./Function":86,"./JSON":88,"./Object":89,"./Promise":94,"./String":95,"./XMLHttpRequest":97,"./console.log":99,"./getComputedStyle":100,"./html5shiv":101,"./matchMedia":102,"./performance":103,"./requestAnimationFrame":105}],99:[function(require,module,exports){
require('console-polyfill');
// ac-polyfills@2.6.0

},{"console-polyfill":113}],100:[function(require,module,exports){
// https://raw.githubusercontent.com/jonathantneal/polyfill/master/source/Window.prototype.getComputedStyle.ie8.js
// Window.prototype.getComputedStyle
if (!window.getComputedStyle) {

	function getComputedStylePixel(element, property, fontSize) {
		element.document; // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.

		var
			value = element.currentStyle[property].match(/(-?[\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
			size = value[1],
			suffix = value[2],
			rootSize;

		fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
		rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

		return suffix == '%' ? size / 100 * rootSize :
			suffix == 'cm' ? size * 0.3937 * 96 :
			suffix == 'em' ? size * fontSize :
			suffix == 'in' ? size * 96 :
			suffix == 'mm' ? size * 0.3937 * 96 / 10 :
			suffix == 'pc' ? size * 12 * 96 / 72 :
			suffix == 'pt' ? size * 96 / 72 :
			size;
	}

	function setShortStyleProperty(style, property) {
		var
			borderSuffix = property == 'border' ? 'Width' : '',
			t = property + 'Top' + borderSuffix,
			r = property + 'Right' + borderSuffix,
			b = property + 'Bottom' + borderSuffix,
			l = property + 'Left' + borderSuffix;

		style[property] = (style[t] == style[r] && style[t] == style[b] && style[t] == style[l] ? [style[t]] :
			style[t] == style[b] && style[l] == style[r] ? [style[t], style[r]] :
			style[l] == style[r] ? [style[t], style[r], style[b]] :
			[style[t], style[r], style[b], style[l]]).join(' ');
	}

	// <CSSStyleDeclaration>
	function CSSStyleDeclaration(element) {
		var
			style = this,
			currentStyle = element.currentStyle,
			fontSize = getComputedStylePixel(element, 'fontSize'),
			unCamelCase = function(match) {
				return '-' + match.toLowerCase();
			},
			property;

		for (property in currentStyle) {
			Array.prototype.push.call(style, property == 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));

			if (property == 'width') {
				style[property] = element.offsetWidth + 'px';
			} else if (property == 'height') {
				style[property] = element.offsetHeight + 'px';
			} else if (property == 'styleFloat') {
				style['float'] = currentStyle[property];
				style.cssFloat = currentStyle[property];
			} else if (/margin.|padding.|border.+W/.test(property) && style[property] != 'auto') {
				style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
			} else if (/^outline/.test(property)) {
				// errors on checking outline
				try {
					style[property] = currentStyle[property];
				} catch (error) {
					style.outlineColor = currentStyle.color;
					style.outlineStyle = style.outlineStyle || 'none';
					style.outlineWidth = style.outlineWidth || '0px';
					style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
				}
			} else {
				style[property] = currentStyle[property];
			}
		}

		setShortStyleProperty(style, 'margin');
		setShortStyleProperty(style, 'padding');
		setShortStyleProperty(style, 'border');

		style.fontSize = Math.round(fontSize) + 'px';
	}

	CSSStyleDeclaration.prototype = {
		constructor: CSSStyleDeclaration,
		// <CSSStyleDeclaration>.getPropertyPriority
		getPropertyPriority: function() {
			throw new Error('NotSupportedError: DOM Exception 9');
		},
		// <CSSStyleDeclaration>.getPropertyValue
		getPropertyValue: function(property) {
			return this[property.replace(/-\w/g, function(match) {
				return match[1].toUpperCase();
			})];
		},
		// <CSSStyleDeclaration>.item
		item: function(index) {
			return this[index];
		},
		// <CSSStyleDeclaration>.removeProperty
		removeProperty: function() {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		// <CSSStyleDeclaration>.setProperty
		setProperty: function() {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		// <CSSStyleDeclaration>.getPropertyCSSValue
		getPropertyCSSValue: function() {
			throw new Error('NotSupportedError: DOM Exception 9');
		}
	};

	// <window>.getComputedStyle
	window.getComputedStyle = function(element) {
		return new CSSStyleDeclaration(element);
	};

}
// ac-polyfills@2.6.0

},{}],101:[function(require,module,exports){
/* istanbul ignore next */
/*@ignore*/
require('html5shiv/src/html5shiv');
// ac-polyfills@2.6.0

},{"html5shiv/src/html5shiv":124}],102:[function(require,module,exports){
require('matchmedia-polyfill');
require('matchmedia-polyfill/matchMedia.addListener');

// ac-polyfills@2.6.0

},{"matchmedia-polyfill":126,"matchmedia-polyfill/matchMedia.addListener":125}],103:[function(require,module,exports){
'use strict';

require('./performance/now');

// ac-polyfills@2.6.0

},{"./performance/now":104}],104:[function(require,module,exports){
/*! MIT License
 *
 * performance.now polyfill
 * copyright Paul Irish 2015
 *
 */

require('/Date/now');
(function(){

  if ("performance" in window == false) {
      window.performance = {};
  }

  if ("now" in window.performance == false){

    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
  }

})();
// ac-polyfills@2.6.0

},{"/Date/now":79}],105:[function(require,module,exports){
/**
	http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	requestAnimationFrame polyfill by Erik Möller
	fixes from Paul Irish and Tino Zijdel
	Modified to implement Date.now()
*/
(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
		var currTime = Date.now();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function () {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};

	if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
}());
// ac-polyfills@2.6.0

},{}],106:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var cache = require('./shared/stylePropertyCache');
var getStyleTestElement = require('./shared/getStyleTestElement');
var toCSS = require('./utils/toCSS');
var toDOM = require('./utils/toDOM');
var prefixHelper = require('./shared/prefixHelper');

/**
 * @name memoizeStyleProperty
 *
 * @function
 * @private
 *
 * @desc Memoize the results of getStyleProperty
 *
 * @param {String} property
 *        The unprefixed property name in DOM form.
 *
 * @param {String} prefixed
 *        The properly prefixed property name in DOM form.
 */
var memoizeStyleProperty = function (property, prefixed) {
	var cssProperty = toCSS(property);
	var cssPrefixed = (prefixed === false) ? false : toCSS(prefixed);

	cache[property] =
	cache[prefixed] =
	cache[cssProperty] =
	cache[cssPrefixed] = {
		dom: prefixed,
		css: cssPrefixed
	};

	return prefixed;
};

/**
 * @name module:ac-prefixer.getStyleProperty
 *
 * @function
 *
 * @desc Returns the property in DOM form with vendor prefix, as needed.
 *
 * @param {String} property
 *        The unprefixed property name in CSS or DOM form.
 *
 * @returns {String|Boolean} The property in DOM form, or `false` if not available.
 */
module.exports = function getStyleProperty(property) {
	var properties;
	var ucProperty;
	var el;
	var i;

	property += '';

	if (property in cache) {
		return cache[property].dom;
	}

	el = getStyleTestElement();

	property = toDOM(property);
	ucProperty = property.charAt(0).toUpperCase() + property.substring(1);

	if (property === 'filter') {
		// Chrome has both prefixed and unprefixed `filter`
		// but only the prefixed version is fully implemented.
		// Firefox isn't prefixed, so we drop it here.
		properties = ['WebkitFilter', 'filter'];
	} else {
		properties = (property + ' ' + prefixHelper.dom.join(ucProperty + ' ') + ucProperty).split(' ');
	}

	for (i = 0; i < properties.length; i++) {
		if (typeof el.style[properties[i]] !== 'undefined') {

			if (i !== 0) {
				prefixHelper.reduce(i - 1);
			}

			return memoizeStyleProperty(property, properties[i]);
		}
	}

	return memoizeStyleProperty(property, false);
};

// ac-prefixer@3.1.1

},{"./shared/getStyleTestElement":107,"./shared/prefixHelper":108,"./shared/stylePropertyCache":109,"./utils/toCSS":111,"./utils/toDOM":112}],107:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var el;

/**
 * @name getStyleTestElement
 * @memberOf module:ac-prefixer/shared
 *
 * @function
 * @private
 *
 * @desc Creates the test Element and/or resets it's style properties.
 */
 module.exports = function getStyleTestElement() {
	if (!el) {
		el = document.createElement('_');
	} else {
		el.style.cssText = '';
		el.removeAttribute('style');
	}

	return el;
};

/*
 * @name getStyleTestElement.resetElement
 *
 * @function
 * @private
 *
 * @desc Reset the test Element. Exposed for testing.
 */
module.exports.resetElement = function () {
	el = null;
};

// ac-prefixer@3.1.1

},{}],108:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var CSS_PREFIXES = ['-webkit-', '-moz-', '-ms-'];
var DOM_PREFIXES = ['Webkit', 'Moz', 'ms'];
var EVT_PREFIXES = ['webkit', 'moz', 'ms'];

var PrefixeHelper = function () {
	this.initialize();
};

var proto = PrefixeHelper.prototype;

proto.initialize = function () {
	this.reduced = false;
	this.css = CSS_PREFIXES;
	this.dom = DOM_PREFIXES;
	this.evt = EVT_PREFIXES;
};

proto.reduce = function (index) {
	if (!this.reduced) {
		this.reduced = true;
		this.css = [this.css[index]];
		this.dom = [this.dom[index]];
		this.evt = [this.evt[index]];
	}
};

module.exports = new PrefixeHelper();

// ac-prefixer@3.1.1

},{}],109:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
module.exports = {};

// ac-prefixer@3.1.1

},{}],110:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var RE_PREFIXES = /(-webkit-|-moz-|-ms-)|^(webkit|moz|ms)/gi;

/**
 * @name module:ac-prefixer.stripPrefixes
 *
 * @function
 *
 * @desc Strips vendor prefixes from a property or value.
 *
 * @param {String} str
 *        The property or value in CSS or DOM form.
 *
 * @returns {String} String in original form with vendor prefixes removed.
 */
module.exports = function stripPrefixes(str) {
	str = String.prototype.replace.call(str, RE_PREFIXES, '');
	return str.charAt(0).toLowerCase() + str.substring(1);
};

// ac-prefixer@3.1.1

},{}],111:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var RE_DOM_PREFIXES = /^(webkit|moz|ms)/gi;

/**
 * @name toCSS
 * @memberOf module:ac-prefixer/utils
 *
 * @function
 *
 * @desc Converts a property or value to CSS form (i.e., "-webkit-property-name").
 *
 * @param {String} str
 *        The property or value in CSS or DOM form.
 *
 * @returns {String} String in CSS form.
 */
module.exports = function toCSS(str) {
	var i;

	if (str.toLowerCase() === 'cssfloat') {
		return 'float';
	}

	if (RE_DOM_PREFIXES.test(str)) {
		str = '-' + str;
	}

	return str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
};

// ac-prefixer@3.1.1

},{}],112:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var RE_CSS_WORD = /-([a-z])/g;

/**
 * @name toDOM
 * @memberOf module:ac-prefixer/utils
 *
 * @function
 *
 * @desc Converts a property to DOM form (i.e., "WebkitPropertyName").
 *
 * @param {String} str
 *        The property in CSS or DOM form.
 *
 * @returns {String} String in DOM form.
 */
module.exports = function toDOM(str) {
	var i;

	if (str.toLowerCase() === 'float') {
		return 'cssFloat';
	}

	str = str.replace(RE_CSS_WORD, function (str, m1) {
		return m1.toUpperCase();
	});

	if (str.substr(0, 2) === 'Ms') {
		str = 'ms' + str.substring(2);
	}

	return str;
};

// ac-prefixer@3.1.1

},{}],113:[function(require,module,exports){
// Console-polyfill. MIT license.
// https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function(global) {
  'use strict';
  if (!global.console) {
    global.console = {};
  }
  var con = global.console;
  var prop, method;
  var dummy = function() {};
  var properties = ['memory'];
  var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
     'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
  while (prop = properties.pop()) if (!con[prop]) con[prop] = {};
  while (method = methods.pop()) if (typeof con[method] !== 'function') con[method] = dummy;
  // Using `this` for web workers & supports Browserify / Webpack.
})(typeof window === 'undefined' ? this : window);

},{}],114:[function(require,module,exports){
"use strict";
var Promise = require("./promise/promise").Promise;
var polyfill = require("./promise/polyfill").polyfill;
exports.Promise = Promise;
exports.polyfill = polyfill;
},{"./promise/polyfill":118,"./promise/promise":119}],115:[function(require,module,exports){
"use strict";
/* global toString */

var isArray = require("./utils").isArray;
var isFunction = require("./utils").isFunction;

/**
  Returns a promise that is fulfilled when all the given promises have been
  fulfilled, or rejected if any of them become rejected. The return promise
  is fulfilled with an array that gives all the values in the order they were
  passed in the `promises` array argument.

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.resolve(2);
  var promise3 = RSVP.resolve(3);
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `RSVP.all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.reject(new Error("2"));
  var promise3 = RSVP.reject(new Error("3"));
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @for RSVP
  @param {Array} promises
  @param {String} label
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
*/
function all(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to all.');
  }

  return new Promise(function(resolve, reject) {
    var results = [], remaining = promises.length,
    promise;

    if (remaining === 0) {
      resolve([]);
    }

    function resolver(index) {
      return function(value) {
        resolveAll(index, value);
      };
    }

    function resolveAll(index, value) {
      results[index] = value;
      if (--remaining === 0) {
        resolve(results);
      }
    }

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && isFunction(promise.then)) {
        promise.then(resolver(i), reject);
      } else {
        resolveAll(i, promise);
      }
    }
  });
}

exports.all = all;
},{"./utils":123}],116:[function(require,module,exports){
(function (process,global){
"use strict";
var browserGlobal = (typeof window !== 'undefined') ? window : {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

// node
function useNextTick() {
  return function() {
    process.nextTick(flush);
  };
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function() {
    node.data = (iterations = ++iterations % 2);
  };
}

function useSetTimeout() {
  return function() {
    local.setTimeout(flush, 1);
  };
}

var queue = [];
function flush() {
  for (var i = 0; i < queue.length; i++) {
    var tuple = queue[i];
    var callback = tuple[0], arg = tuple[1];
    callback(arg);
  }
  queue = [];
}

var scheduleFlush;

// Decide what async method to use to triggering processing of queued callbacks:
if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else {
  scheduleFlush = useSetTimeout();
}

function asap(callback, arg) {
  var length = queue.push([callback, arg]);
  if (length === 1) {
    // If length is 1, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    scheduleFlush();
  }
}

exports.asap = asap;
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":127}],117:[function(require,module,exports){
"use strict";
var config = {
  instrument: false
};

function configure(name, value) {
  if (arguments.length === 2) {
    config[name] = value;
  } else {
    return config[name];
  }
}

exports.config = config;
exports.configure = configure;
},{}],118:[function(require,module,exports){
(function (global){
"use strict";
/*global self*/
var RSVPPromise = require("./promise").Promise;
var isFunction = require("./utils").isFunction;

function polyfill() {
  var local;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof window !== 'undefined' && window.document) {
    local = window;
  } else {
    local = self;
  }

  var es6PromiseSupport =
    "Promise" in local &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    "resolve" in local.Promise &&
    "reject" in local.Promise &&
    "all" in local.Promise &&
    "race" in local.Promise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new local.Promise(function(r) { resolve = r; });
      return isFunction(resolve);
    }());

  if (!es6PromiseSupport) {
    local.Promise = RSVPPromise;
  }
}

exports.polyfill = polyfill;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./promise":119,"./utils":123}],119:[function(require,module,exports){
"use strict";
var config = require("./config").config;
var configure = require("./config").configure;
var objectOrFunction = require("./utils").objectOrFunction;
var isFunction = require("./utils").isFunction;
var now = require("./utils").now;
var all = require("./all").all;
var race = require("./race").race;
var staticResolve = require("./resolve").resolve;
var staticReject = require("./reject").reject;
var asap = require("./asap").asap;

var counter = 0;

config.async = asap; // default async is asap;

function Promise(resolver) {
  if (!isFunction(resolver)) {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  if (!(this instanceof Promise)) {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  this._subscribers = [];

  invokeResolver(resolver, this);
}

function invokeResolver(resolver, promise) {
  function resolvePromise(value) {
    resolve(promise, value);
  }

  function rejectPromise(reason) {
    reject(promise, reason);
  }

  try {
    resolver(resolvePromise, rejectPromise);
  } catch(e) {
    rejectPromise(e);
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value, error, succeeded, failed;

  if (hasCallback) {
    try {
      value = callback(detail);
      succeeded = true;
    } catch(e) {
      failed = true;
      error = e;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (handleThenable(promise, value)) {
    return;
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    resolve(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

var PENDING   = void 0;
var SEALED    = 0;
var FULFILLED = 1;
var REJECTED  = 2;

function subscribe(parent, child, onFulfillment, onRejection) {
  var subscribers = parent._subscribers;
  var length = subscribers.length;

  subscribers[length] = child;
  subscribers[length + FULFILLED] = onFulfillment;
  subscribers[length + REJECTED]  = onRejection;
}

function publish(promise, settled) {
  var child, callback, subscribers = promise._subscribers, detail = promise._detail;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    invokeCallback(settled, child, callback, detail);
  }

  promise._subscribers = null;
}

Promise.prototype = {
  constructor: Promise,

  _state: undefined,
  _detail: undefined,
  _subscribers: undefined,

  then: function(onFulfillment, onRejection) {
    var promise = this;

    var thenPromise = new this.constructor(function() {});

    if (this._state) {
      var callbacks = arguments;
      config.async(function invokePromiseCallback() {
        invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
      });
    } else {
      subscribe(this, thenPromise, onFulfillment, onRejection);
    }

    return thenPromise;
  },

  'catch': function(onRejection) {
    return this.then(null, onRejection);
  }
};

Promise.all = all;
Promise.race = race;
Promise.resolve = staticResolve;
Promise.reject = staticReject;

function handleThenable(promise, value) {
  var then = null,
  resolved;

  try {
    if (promise === value) {
      throw new TypeError("A promises callback cannot return that same promise.");
    }

    if (objectOrFunction(value)) {
      then = value.then;

      if (isFunction(then)) {
        then.call(value, function(val) {
          if (resolved) { return true; }
          resolved = true;

          if (value !== val) {
            resolve(promise, val);
          } else {
            fulfill(promise, val);
          }
        }, function(val) {
          if (resolved) { return true; }
          resolved = true;

          reject(promise, val);
        });

        return true;
      }
    }
  } catch (error) {
    if (resolved) { return true; }
    reject(promise, error);
    return true;
  }

  return false;
}

function resolve(promise, value) {
  if (promise === value) {
    fulfill(promise, value);
  } else if (!handleThenable(promise, value)) {
    fulfill(promise, value);
  }
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = value;

  config.async(publishFulfillment, promise);
}

function reject(promise, reason) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = reason;

  config.async(publishRejection, promise);
}

function publishFulfillment(promise) {
  publish(promise, promise._state = FULFILLED);
}

function publishRejection(promise) {
  publish(promise, promise._state = REJECTED);
}

exports.Promise = Promise;
},{"./all":115,"./asap":116,"./config":117,"./race":120,"./reject":121,"./resolve":122,"./utils":123}],120:[function(require,module,exports){
"use strict";
/* global toString */
var isArray = require("./utils").isArray;

/**
  `RSVP.race` allows you to watch a series of promises and act as soon as the
  first promise given to the `promises` argument fulfills or rejects.

  Example:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 2");
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // result === "promise 2" because it was resolved before promise1
    // was resolved.
  });
  ```

  `RSVP.race` is deterministic in that only the state of the first completed
  promise matters. For example, even if other promises given to the `promises`
  array argument are resolved, but the first completed promise has become
  rejected before the other promises became fulfilled, the returned promise
  will become rejected:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error("promise 2"));
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // Code here never runs because there are rejected promises!
  }, function(reason){
    // reason.message === "promise2" because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  @method race
  @for RSVP
  @param {Array} promises array of promises to observe
  @param {String} label optional string for describing the promise returned.
  Useful for tooling.
  @return {Promise} a promise that becomes fulfilled with the value the first
  completed promises is resolved with if the first completed promise was
  fulfilled, or rejected with the reason that the first completed promise
  was rejected with.
*/
function race(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to race.');
  }
  return new Promise(function(resolve, reject) {
    var results = [], promise;

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && typeof promise.then === 'function') {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    }
  });
}

exports.race = race;
},{"./utils":123}],121:[function(require,module,exports){
"use strict";
/**
  `RSVP.reject` returns a promise that will become rejected with the passed
  `reason`. `RSVP.reject` is essentially shorthand for the following:

  ```javascript
  var promise = new RSVP.Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  var promise = RSVP.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @for RSVP
  @param {Any} reason value that the returned promise will be rejected with.
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become rejected with the given
  `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Promise = this;

  return new Promise(function (resolve, reject) {
    reject(reason);
  });
}

exports.reject = reject;
},{}],122:[function(require,module,exports){
"use strict";
function resolve(value) {
  /*jshint validthis:true */
  if (value && typeof value === 'object' && value.constructor === this) {
    return value;
  }

  var Promise = this;

  return new Promise(function(resolve) {
    resolve(value);
  });
}

exports.resolve = resolve;
},{}],123:[function(require,module,exports){
"use strict";
function objectOrFunction(x) {
  return isFunction(x) || (typeof x === "object" && x !== null);
}

function isFunction(x) {
  return typeof x === "function";
}

function isArray(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

// Date.now is not available in browsers < IE9
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
var now = Date.now || function() { return new Date().getTime(); };


exports.objectOrFunction = objectOrFunction;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.now = now;
},{}],124:[function(require,module,exports){
/**
* @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.7.3-pre';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */
  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;
    if(typeof elements != 'string'){
      elements = elements.join(' ');
    }
    if(typeof newElements != 'string'){
      newElements = newElements.join(' ');
    }
    html5.elements = elements +' '+ newElements;
    shivDocument(ownerDocument);
  }

   /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,

    //extends list of elements
    addElements: addElements
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  if(typeof module == 'object' && module.exports){
    module.exports = html5;
  }

}(typeof window !== "undefined" ? window : this, document));

},{}],125:[function(require,module,exports){
/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function(){
    // Bail out for browsers that have addListener support
    if (window.matchMedia && window.matchMedia('all').addListener) {
        return false;
    }

    var localMatchMedia = window.matchMedia,
        hasMediaQueries = localMatchMedia('only all').matches,
        isListening     = false,
        timeoutID       = 0,    // setTimeout for debouncing 'handleChange'
        queries         = [],   // Contains each 'mql' and associated 'listeners' if 'addListener' is used
        handleChange    = function(evt) {
            // Debounce
            clearTimeout(timeoutID);

            timeoutID = setTimeout(function() {
                for (var i = 0, il = queries.length; i < il; i++) {
                    var mql         = queries[i].mql,
                        listeners   = queries[i].listeners || [],
                        matches     = localMatchMedia(mql.media).matches;

                    // Update mql.matches value and call listeners
                    // Fire listeners only if transitioning to or from matched state
                    if (matches !== mql.matches) {
                        mql.matches = matches;

                        for (var j = 0, jl = listeners.length; j < jl; j++) {
                            listeners[j].call(window, mql);
                        }
                    }
                }
            }, 30);
        };

    window.matchMedia = function(media) {
        var mql         = localMatchMedia(media),
            listeners   = [],
            index       = 0;

        mql.addListener = function(listener) {
            // Changes would not occur to css media type so return now (Affects IE <= 8)
            if (!hasMediaQueries) {
                return;
            }

            // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
            // There should only ever be 1 resize listener running for performance
            if (!isListening) {
                isListening = true;
                window.addEventListener('resize', handleChange, true);
            }

            // Push object only if it has not been pushed already
            if (index === 0) {
                index = queries.push({
                    mql         : mql,
                    listeners   : listeners
                });
            }

            listeners.push(listener);
        };

        mql.removeListener = function(listener) {
            for (var i = 0, il = listeners.length; i < il; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                }
            }
        };

        return mql;
    };
}());

},{}],126:[function(require,module,exports){
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

},{}],127:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],128:[function(require,module,exports){
'use strict';

var ac_headjs = require('@marcom/ac-headjs');
var chapterNav = require('@marcom/ac-chapternav');

var Main = (function() {
	return {
		initialize: function() {
			ac_headjs.htmlClass();
			return this;
		}
	};
}());

module.exports = Main.initialize();

},{"@marcom/ac-chapternav":6,"@marcom/ac-headjs":59}]},{},[128]);
