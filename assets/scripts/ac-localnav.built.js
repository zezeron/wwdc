(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./className/add":3,"@marcom/ac-polyfills/Array/prototype.slice":48,"@marcom/ac-polyfills/Element/prototype.classList":49}],2:[function(require,module,exports){
/**
 * @module ac-classlist/className
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	add: require('./className/add'),
	contains: require('./className/contains'),
	remove: require('./className/remove')
};

// ac-classlist@1.3.0

},{"./className/add":3,"./className/contains":4,"./className/remove":6}],3:[function(require,module,exports){
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

},{"./contains":4}],4:[function(require,module,exports){
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

},{"./getTokenRegExp":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./contains":4,"./getTokenRegExp":5}],7:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Element/prototype.classList');

/** @ignore */
var classNameContains = require('./className/contains');

/**
 * @name module:ac-classlist.contains
 *
 * @function
 *
 * @desc Checks if an Element's classList contains a specific token.
 *       Accounts for browsers without classList support.
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The token to be checked
 *
 * @returns {Boolean} `true` if classList contains token, otherwise `false`
 */
module.exports = function contains(el, token) {
	if (el.classList && el.classList.contains) {
		return el.classList.contains(token);
	}

	return classNameContains(el, token);
};

// ac-classlist@1.3.0

},{"./className/contains":4,"@marcom/ac-polyfills/Element/prototype.classList":49}],8:[function(require,module,exports){
/**
 * @module ac-classlist
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	add: require('./add'),
	contains: require('./contains'),
	remove: require('./remove'),
	toggle: require('./toggle')
};

// ac-classlist@1.3.0

},{"./add":1,"./contains":7,"./remove":9,"./toggle":10}],9:[function(require,module,exports){
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

},{"./className/remove":6,"@marcom/ac-polyfills/Array/prototype.slice":48,"@marcom/ac-polyfills/Element/prototype.classList":49}],10:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Element/prototype.classList');

/** @ignore */
var className = require('./className');

/**
 * @name module:ac-classlist.toggle
 *
 * @function
 *
 * @desc Toggles a token in an Element's classList.
 *       Accounts for browsers without classList support.
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The token to be toggled
 *
 * @param {Boolean} [force]
 *        Optionally forces add with `true` and remove with `false`
 *
 * @returns {Boolean} `true` if classList contains token after the toggle, otherwise `false`
 */
module.exports = function toggle(el, token, force) {
	var hasForce = (typeof force !== 'undefined');
	var addToken;

	if (el.classList && el.classList.toggle) {
		if (hasForce) {
			return el.classList.toggle(token, force);
		}

		return el.classList.toggle(token);
	}

	if (hasForce) {
		addToken = !!force;
	} else {
		addToken = !className.contains(el, token);
	}

	if (addToken) {
		className.add(el, token);
	} else {
		className.remove(el, token);
	}

	return addToken;
};

// ac-classlist@1.3.0

},{"./className":2,"@marcom/ac-polyfills/Element/prototype.classList":49}],11:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name addEventListener
 * @memberOf module:ac-dom-events/utils
 *
 * @function
 *
 * @desc Register the specified listener on a target.
 *       Automatically handles vendor prefixed and camel-cased event types.
 *
 * @param {Object} target
 *        The event target to listen to.
 *        Usually an Element, document, or window.
 *
 * @param {String} type
 *        A lowercase string representing the event type.
 *        e.g., "click", "transitionend"
 *
 * @param {Function} listener
 *        A Function to be called when the event type is triggered.
 *
 * @param {Boolean} [useCapture=false]
 *        `true` listens for the event in the capture phase.
 *        `false` (default) listens for the event in the bubbling phases.
 *        IE < 9 does not support useCapture
 *
 * @returns {Object} target
 */
module.exports = function addEventListener(target, type, listener, useCapture) {
	if (target.addEventListener) {
		target.addEventListener(type, listener, !!useCapture);
	} else {
		target.attachEvent('on' + type, listener);
	}

	return target;
};

// ac-dom-events@1.4.1

},{}],12:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-metrics.getScrollY
 *
 * @function
 *
 * @desc Get the scrollY of an Element or the Window
 *
 * @param {Element|Window} [el=window]
 *
 * @returns {Number} The scrollY value.
 */
module.exports = function getScrollY(el) {
	var offset;

	el = el || window;

	if (el === window) {
		offset = window.pageYOffset;

		if (!offset) {
			el = document.documentElement || document.body.parentNode || document.body;
		} else {
			return offset;
		}
	}

	return el.scrollTop;
};

// ac-dom-metrics@2.4.0

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-nodes.insertBefore
 *
 * @function
 *
 * @desc Insert a Node before a specified target
 *
 * @param {Node} node
 *        The Node to insert
 *
 * @param {Node} target
 *        The target Node
 *
 * @returns {Node} The inserted Node
 */
module.exports = function insertBefore(node, target) {
	validate.insertNode(node, true, 'insertBefore');
	validate.childNode(target, true, 'insertBefore');
	validate.hasParentNode(target, 'insertBefore');

	return target.parentNode.insertBefore(node, target);
};

// ac-dom-nodes@1.7.0

},{"./internal/validate":20}],19:[function(require,module,exports){
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

},{"/isNode":23}],20:[function(require,module,exports){
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

},{"/COMMENT_NODE":13,"/DOCUMENT_FRAGMENT_NODE":14,"/ELEMENT_NODE":16,"/TEXT_NODE":17,"./isNodeType":19}],21:[function(require,module,exports){
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

},{"./DOCUMENT_FRAGMENT_NODE":14,"./internal/isNodeType":19}],22:[function(require,module,exports){
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

},{"./ELEMENT_NODE":16,"./internal/isNodeType":19}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./internal/validate":20}],25:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isElement = require('@marcom/ac-dom-nodes/isElement');
var matchesSelector = require('./matchesSelector');
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-traversal.ancestor
 *
 * @function
 *
 * @desc Returns the closest Element that is an ancestor of the specified Node, matching an optional CSS selector, up to and including the body.
 *
 * @param {Node} node
 *        The child Element, TextNode, or Comment.
 *
 * @param {String} [selector]
 *        Optional CSS selectors, separated by commas, to filter ancestor Elements by.
 *
 * @param {Boolean} [inclusive=false]
 *        `true` to include the target node in the potential results, otherwise `false`
 *
 * @param {Boolean} [context=document.body]
 *        An optional ancestor Element to stop checking for parentNodes.
 *        Results are inclusive of this Element.
 *
 * @returns {Element|null} Closest matching ancestor Element, or `null` if no matches are found.
 */
module.exports = function ancestor(node, selector, inclusive, context) {
 	validate.childNode(node, true, 'ancestors');
 	validate.selector(selector, false, 'ancestors');

 	if (inclusive && isElement(node) && (!selector || matchesSelector(node, selector))) {
 		return node;
 	}

 	context = context || document.body;

 	if (node !== context) {
 		while ((node = node.parentNode) && isElement(node)) {
 			if (!selector || matchesSelector(node, selector)) {
 				return node;
 			}

 			if (node === context) {
 				break;
 			}
 		}
 	}

 	return null;
};

// ac-dom-traversal@2.2.0

},{"./internal/validate":28,"./matchesSelector":29,"@marcom/ac-dom-nodes/isElement":22}],26:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isElement = require('@marcom/ac-dom-nodes/isElement');
var matchesSelector = require('./matchesSelector');
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-traversal.ancestors
 *
 * @function
 *
 * @desc Returns an Array of Elements that are ancestors of the specified Node, matching an optional CSS selector, up to and including the body.
 *
 * @param {Node} node
 *        The child Element, TextNode, or Comment.
 *
 * @param {String} [selector]
 *        Optional CSS selectors, separated by commas, to filter ancestor Elements by.
 *
 * @param {Boolean} [inclusive=false]
 *        `true` to include the target node in the potential results, otherwise `false`
 *
 * @param {Boolean} [context=document.body]
 *        An optional ancestor Element to stop checking for parentNodes.
 *        Results are inclusive of this Element.
 *
 * @returns {Element[]} Array of matching ancestor Elements, with the closest ancestor first.
 */
module.exports = function ancestors(node, selector, inclusive, context) {
 	var els = [];

 	validate.childNode(node, true, 'ancestors');
 	validate.selector(selector, false, 'ancestors');

 	if (inclusive && isElement(node) && (!selector || matchesSelector(node, selector))) {
 		els.push(node);
 	}

 	context = context || document.body;

 	if (node !== context) {
	 	while ((node = node.parentNode) && isElement(node)) {
	 		if (!selector || matchesSelector(node, selector)) {
	 			els.push(node);
	 		}

	 		if (node === context) {
	 			break;
	 		}
	 	}
	}

 	return els;
};

// ac-dom-traversal@2.2.0

},{"./internal/validate":28,"./matchesSelector":29,"@marcom/ac-dom-nodes/isElement":22}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"@marcom/ac-dom-nodes/COMMENT_NODE":13,"@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE":14,"@marcom/ac-dom-nodes/DOCUMENT_NODE":15,"@marcom/ac-dom-nodes/ELEMENT_NODE":16,"@marcom/ac-dom-nodes/TEXT_NODE":17,"@marcom/ac-dom-nodes/isNode":23,"@marcom/ac-polyfills/Array/prototype.indexOf":47}],29:[function(require,module,exports){
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

},{"./internal/nativeMatches":27,"./internal/validate":28,"./shims/matchesSelector":31,"@marcom/ac-dom-nodes/isElement":22}],30:[function(require,module,exports){
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

},{"./internal/validate":28,"./shims/querySelectorAll":32,"@marcom/ac-polyfills/Array/prototype.slice":48}],31:[function(require,module,exports){
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

},{"/querySelectorAll":30}],32:[function(require,module,exports){
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

},{"@marcom/ac-dom-nodes/isDocumentFragment":21,"@marcom/ac-dom-nodes/isElement":22,"@marcom/ac-dom-nodes/remove":24,"@marcom/ac-polyfills/Array/prototype.indexOf":47}],33:[function(require,module,exports){
/**
 * @module ac-event-emitter-micro
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	EventEmitterMicro: require('./ac-event-emitter-micro/EventEmitterMicro')
};

},{"./ac-event-emitter-micro/EventEmitterMicro":34}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getStyleValue = require('@marcom/ac-prefixer/getStyleValue');
var getStyleProperty = require('@marcom/ac-prefixer/getStyleProperty');
var memoize = require('@marcom/ac-function/memoize');

/**
 * @name module:ac-feature.cssPropertyAvailable
 *
 * @function
 *
 * @desc Returns the availability of a CSS property including vendor-prefixed flavors, along with an optional value.
 *
 * @param {String} property
 *        The CSS property to test.
 *        Can be in DOM (borderRadius) or CSS (border-radius) form.
 *
 * @param {String} [value]
 *        An optional value to test.
 *
 * @returns {Boolean} `true` if the browser supports the given CSS property/value, otherwise `false`.
 */
function cssPropertyAvailable(property, value) {
	if (typeof value !== 'undefined') {
		return !!getStyleValue(property, value);
	} else {
		return !!getStyleProperty(property);
	}
}

module.exports = memoize(cssPropertyAvailable);
module.exports.original = cssPropertyAvailable;

// ac-feature@2.5.0

},{"@marcom/ac-function/memoize":38,"@marcom/ac-prefixer/getStyleProperty":54,"@marcom/ac-prefixer/getStyleValue":55}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/matchMedia');

/** @ignore */
var globalsHelper = require('./helpers/globals');
var once = require('@marcom/ac-function/once');

/**
 * @name module:ac-feature.mediaQueriesAvailable
 *
 * @function
 *
 * @desc Returns the availability of HTML5 video/audio tags
 *
 * @returns {Boolean} `true` if the browser supports video/audio tags, otherwise `false`.
 */
function mediaQueriesAvailable() {
	var windowObj = globalsHelper.getWindow();
	var mql = windowObj.matchMedia('only all');

	return !!(mql && mql.matches);
}

module.exports = once(mediaQueriesAvailable);
module.exports.original = mediaQueriesAvailable;

// ac-feature@2.5.0

},{"./helpers/globals":36,"@marcom/ac-function/once":39,"@marcom/ac-polyfills/matchMedia":53}],38:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name defaultHashFunction
 *
 * @function
 * @private
 *
 * @desc Creates a cache key based on arguments
 *
 * @param {...*}
 *
 * @returns {String} Comma-separated string of arguments
 */
var defaultHashFunction = function () {
	var key = '';
	var i;

	for (i = 0; i < arguments.length; i++) {
		if (i > 0) {
			key += ',';
		}

		key += arguments[i];
	}

	return key;
};

/**
 * @name module:ac-function.memoize
 *
 * @function
 *
 * @desc Creates a function that memoizes the result of `func`
 *
 * @param {Function} func
 *        The function to be memoized
 *
 * @param {Function} [hashFunction]
 *        A function that returns a cache key based on arguments
 *        Creates a comma-separated string of arguments by default
 *
 * @returns {Function}
 */
module.exports = function memoize(func, hashFunction) {
	hashFunction = hashFunction || defaultHashFunction;

	var memoized = function () {
		var args = arguments;
		var key = hashFunction.apply(this, args);

		if (!(key in memoized.cache)) {
			memoized.cache[key] = func.apply(this, args);
		}

		return memoized.cache[key];
	};

	memoized.cache = {};

	return memoized;
};

// ac-function@1.2.0

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ancestor = require('@marcom/ac-dom-traversal/ancestor');
var ac_classList = require('@marcom/ac-classlist');
var isElement = require('@marcom/ac-dom-nodes/isElement');
var cssPropertyAvailable = require('@marcom/ac-feature/cssPropertyAvailable');
var ViewportEmitter = require('@marcom/ac-viewport-emitter/ViewportEmitter');
var defaults = require('@marcom/ac-object/defaults');

var CheckboxMenu = require('./internal/CheckboxMenu');
var SimpleSticky = require('./internal/SimpleSticky');
var ClickAway = require('./internal/ClickAway');

var DEFAULT_OPTIONS = {
	className: 'localnav'
};

/**
 * @name Localnav
 *
 * @constructor
 *
 * @param {Element} el
 *        The element to make into a Localnav
 *
 * @param {Object} [options]
 *        Contains selectors or class name prefixes for the Localnav components
 *
 * @param {String} [options.traySelector]
 *        CSS selector for the menu tray
 *
 * @param {String} [options.viewportEmitterID]
 *        Selector for the localnav viewport emitter
 *
 * @param {String} [options.curtainID]
 *        Selector for the localnav curtain
 *
 * @param {String} [options.menuStateID]
 *        Selector for the localnav menustate (checkbox)
 *
 * @param {String} [options.menuOpeningClassName]
 *        The class name to apply to the localnav when its menu is opening
 *
 * @param {String} [options.className]
 *        The string to prefix onto traySelector, viewportEmitterID, curtainID, menustateID, and the menuOpeningClassName
 */
var Localnav = function (el, options) {
	var selector;

	options = defaults(DEFAULT_OPTIONS, options || {});

	this.el = el;

	selector = options.selector || '.' + options.className;

	this._selectors = {
		traySelector: options.traySelector || '.' + options.className + '-menu-tray',
		viewportEmitterID: options.viewportEmitterID || options.className + '-viewport-emitter',
		curtainID: options.curtainID || options.className + '-curtain',
		menuStateID: options.menuStateID || options.className + '-menustate',
		menuOpeningClassName: options.menuOpeningClassName || options.className + '-opening'
	};

	this._selectors.clickAwaySelector = selector + ', #' + this._selectors.curtainID + ', #' + this._selectors.menuStateID;

	this.tray = this.el.querySelector(this._selectors.traySelector);
	this.stickyEnabled = this._getStickyEnabled();
	this._transitionsAvailable = cssPropertyAvailable('transition');

	this._viewports = new ViewportEmitter(this._selectors.viewportEmitterID);

	if (this.stickyEnabled) {
		this._sticky = new SimpleSticky(this.el, options);
	}

	this._initializeMenu();
};

/**
 * @name Localnav#create
 *
 * @function
 * @public
 *
 * @desc The factory method to create Localnavs
 *
 * @see Localnav
 *
 * @returns {Object} The newly created Localnav object
 */
Localnav.create = function (el, options) {
	return new Localnav(el, options);
};

var proto = Localnav.prototype;

/**
 * @name Localnav#_getStickyEnabled
 *
 * @function
 * @private
 *
 * @desc Detects if sticky is enabled
 *
 * @returns {Boolean} If sticky is enabled
 */
proto._getStickyEnabled = function () {
	return this.el.hasAttribute('data-sticky');
};

/**
 * @name Localnav#_initializeMenu
 *
 * @function
 * @private
 *
 * @desc Initializes all the events for the Localnav
 */
proto._initializeMenu = function () {
	var checkbox = document.getElementById(this._selectors.menuStateID);
	var anchorOpen = document.getElementById(this._selectors.menuStateID + '-open');
	var anchorClose = document.getElementById(this._selectors.menuStateID + '-close');
	var historyEvent = ('onpopstate' in window) ? 'popstate' : 'beforeunload';
	var clickAway;

	if (checkbox && anchorOpen && anchorClose) {
		this.menu = new CheckboxMenu(checkbox, anchorOpen, anchorClose);
		this.menu.on('open', this._onMenuOpen.bind(this));

		this._viewports.on('change', this._onViewportChange.bind(this));

		window.addEventListener('scroll', this._onScroll.bind(this));
		window.addEventListener('touchmove', this._onScroll.bind(this));
		this.tray.addEventListener('click', this._onTrayClick.bind(this));

		this._closeMenu = this._closeMenu.bind(this);
		window.addEventListener(historyEvent, this._closeMenu);
		window.addEventListener('orientationchange', this._closeMenu);

		clickAway = new ClickAway(this._selectors.clickAwaySelector);
		clickAway.on('click', this._closeMenu);

		if (this._transitionsAvailable) {
			// enable scrollbar after transition
			this.tray.addEventListener('transitionend', this._enableMenuScroll.bind(this));
		}
	}
};

/**
 * @name Localnav#_onMenuOpen
 *
 * @function
 * @private
 *
 * @desc Callback function for when the menu opens
 */
proto._onMenuOpen = function () {
	this._menuCollapseOnScroll = null;

	if (this._transitionsAvailable) {
		// disable scrollbar during transition
		this._disableMenuScrollbar();
	}
};

/**
 * @name Localnav#_onScroll
 *
 * @function
 * @private
 *
 * @desc Callback function for scroll
 *
 * @param {Event} evt
 *        The scroll event
 */
proto._onScroll = function (evt) {
	var target;

	if (this.menu.isOpen()) {
		if (this._menuCollapseOnScroll === null) {
			this._menuCollapseOnScroll = (this.tray.offsetHeight >= this.tray.scrollHeight);
		}

		if (this._menuCollapseOnScroll) {
			this.menu.close();
		} else {
			target = evt.target;

			if (!isElement(target) || !ancestor(target, this._selectors.traySelector, true)) {
				evt.preventDefault();
			}
		}
	}
};

/**
 * @name Localnav#_onTrayClick
 *
 * @function
 * @private
 *
 * @desc Callback function for when the user clicks the tray
 *
 * @param {Event} evt
 *        The mouse click event
 */
proto._onTrayClick = function (evt) {
	var target = evt.target;

	if ('href' in target) {
		// close the menu when links are clicked
		// to support single-page "apps"
		this._closeMenu();
	}
};

/**
 * @name Localnav#_onViewportChange
 *
 * @function
 * @private
 *
 * @desc Callback for when the viewport changes (closes the menu if the viewport changes from small)
 *
 * @param {Object} data
 *        The viewport change data
 *
 * @param {String} [data.from]
 *        The viewport string that the window is coming from
 *        Possible values include 'large', 'medium', 'small'
 *
 * @param {String} [data.to]
 *        The viewport string that the window is going to
 *        Possible values include 'large', 'medium', 'small'
 */
proto._onViewportChange = function (data) {
	if (data.to === 'medium' || data.to === 'large') {
		this._closeMenu();
	}
};

/**
 * @name Localnav#_disableMenuScrollbar
 *
 * @function
 * @private
 *
 * @desc Disables the scroll bar on the menu
 */
proto._disableMenuScrollbar = function () {
	ac_classList.add(this.el, this._selectors.menuOpeningClassName);
};

/**
 * @name Localnav#_enableMenuScroll
 *
 * @function
 * @private
 *
 * @desc Enables scrolling on the menu
 */
proto._enableMenuScroll = function () {
	ac_classList.remove(this.el, this._selectors.menuOpeningClassName);
};

/**
 * @name Localnav#_closeMenu
 *
 * @function
 * @private
 *
 * @desc Closes the menu
 */
proto._closeMenu = function () {
	this.menu.close();
};

proto.destroy = function () {
	// @todo
};

module.exports = Localnav;

// ac-localnav@5.0.2

},{"./internal/CheckboxMenu":41,"./internal/ClickAway":42,"./internal/SimpleSticky":43,"@marcom/ac-classlist":8,"@marcom/ac-dom-nodes/isElement":22,"@marcom/ac-dom-traversal/ancestor":25,"@marcom/ac-feature/cssPropertyAvailable":35,"@marcom/ac-object/defaults":44,"@marcom/ac-viewport-emitter/ViewportEmitter":62}],41:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var EventEmitter = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;

/**
 * @name CheckboxMenu
 *
 * @class
 * @private
 *
 * @memberOf module:ac-localnav/internal
 *
 * @param {Element} el
 *        The actual check box for the menu
 *
 * @param {Element} anchorOpen
 *        The anchor tag that opens the menu
 *
 * @param {Element} anchorClose
 *        The anchor tag that closes the menu
 */
function CheckboxMenu (el, anchorOpen, anchorClose) {
	EventEmitter.call(this);

	this.el = el;
	this.anchorOpen = anchorOpen;
	this.anchorClose = anchorClose;

	this._lastOpen = this.el.checked;

	this.el.addEventListener('change', this.update.bind(this));
	this.anchorOpen.addEventListener('click', this._anchorOpenClick.bind(this));
	this.anchorClose.addEventListener('click', this._anchorCloseClick.bind(this));

	if (window.location.hash === '#' + el.id) {
		// remove hash in case user has a no-js link
		window.location.hash = '';
	}
}

/**
 * @name CheckboxMenu#create
 *
 * @function
 * @public
 *
 * @desc Factory method to create a CheckboxMenu
 *
 * @see CheckboxMenu
 *
 * @returns {Object} CheckboxMenu object
 */
CheckboxMenu.create = function (el, anchorOpen, anchorClose) {
	return new CheckboxMenu(el, anchorOpen, anchorClose);
};

var superProto = EventEmitter.prototype;
var proto = CheckboxMenu.prototype = Object.create(superProto);
CheckboxMenu.prototype.constructor = CheckboxMenu;

/**
 * @name CheckboxMenu#update
 *
 * @function
 * @public
 *
 * @desc Updates the state of the menu to either open or closed
 */
proto.update = function () {
	var open = this.isOpen();

	if (open !== this._lastOpen) {
		this.trigger(open ? 'open' : 'close');
		this._lastOpen = open;
	}
};

/**
 * @name CheckboxMenu#isOpen
 *
 * @function
 * @public
 *
 * @returns {Boolean} `true` when the checkbox Element is checked, otherwise `false`
 */
proto.isOpen = function () {
	return this.el.checked;
};

/**
 * @name CheckboxMenu#toggle
 *
 * @function
 * @public
 *
 * @desc Toggles the open/close state of the menu
 */
proto.toggle = function () {
	if (this.isOpen()) {
		this.close();
	} else {
		this.open();
	}
};

/**
 * @name CheckboxMenu#open
 *
 * @function
 * @public
 *
 * @desc Opens the checkbox menu if it is closed
 */
proto.open = function () {
	if (!this.el.checked) {
		this.el.checked = true;
		this.update();
	}
};

/**
 * @name CheckboxMenu#close
 *
 * @function
 * @public
 *
 * @desc Closes the checkbox menu if it is opened
 */
proto.close = function () {
	if (this.el.checked) {
		this.el.checked = false;
		this.update();
	}
};

/**
 * @name CheckboxMenu#_anchorOpenClick
 *
 * @function
 * @private
 *
 * @desc Callback function for an anchor tag open element
 *
 * @param {MouseEvent} evt
 *        The click event occurring on the anchor tag from the event listener
 */
proto._anchorOpenClick = function (evt) {
	evt.preventDefault();
	this.open();
	this.anchorClose.focus();
};

/**
 * @name CheckboxMenu#_anchorCloseClick
 *
 * @function
 * @private
 *
 * @desc Callback function for an anchor tag close element
 * @param {MouseEvent} evt
 *       The click event occurring on the anchor tag from the event listener
 */
proto._anchorCloseClick = function (evt) {
	evt.preventDefault();
	this.close();
	this.anchorOpen.focus();
};

module.exports = CheckboxMenu;

// ac-localnav@5.0.2

},{"@marcom/ac-event-emitter-micro":33}],42:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var EventEmitter = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;
var ancestors = require('@marcom/ac-dom-traversal/ancestors');

/**
 * @name ClickAway
 *
 * @class
 * @private
 *
 * @memberOf module:ac-localnav/internal
 *
 * @desc Listens for click events outside of an Element
 *
 * @param {String|Element} selector
 *        The Element or selector to listen for click events
 */
function ClickAway(selector) {
	EventEmitter.call(this);

	this._selector = selector;
	this._touching = false;

	document.addEventListener('click', this._onClick.bind(this));
	document.addEventListener('touchstart', this._onTouchStart.bind(this));
	document.addEventListener('touchend', this._onTouchEnd.bind(this));
}

var superProto = EventEmitter.prototype;
var proto = ClickAway.prototype = Object.create(superProto);
ClickAway.prototype.constructor = ClickAway;

/**
 * @name ClickAway#_checkTarget
 *
 * @function
 * @private
 *
 * @desc Triggers a click on the event if the ClickAway selector is not an ancestor of the event target
 *
 * @param {DOMEvent} evt
 *        The DOMEvent to check whether its target element is outside of the ClickAway selector
 */
proto._checkTarget = function (evt) {
	var target = evt.target;

	if (!ancestors(target, this._selector, true).length) {
		this.trigger('click', evt);
	}
};

/**
 * @name ClickAway#_onClick
 *
 * @function
 * @private
 *
 * @desc The callback for click events on the document
 *
 * @param {DOMEvent} evt
 */
proto._onClick = function (evt) {
	if (!this._touching) {
		this._checkTarget(evt);
	}
};

/**
 * @name ClickAway#_onTouchStart
 *
 * @function
 * @private
 *
 * @desc The callback for the 'touchstart' event
 *
 * @param {DOMEvent} evt
 */
proto._onTouchStart = function (evt) {
	this._touching = true;
	this._checkTarget(evt);
};

/**
 * @name ClickAway#_onTouchEnd
 *
 * @function
 * @private
 *
 * @desc The callback for the 'touchend' event
 */
proto._onTouchEnd = function () {
	this._touching = false;
};

module.exports = ClickAway;

// ac-localnav@5.0.2

},{"@marcom/ac-dom-traversal/ancestors":26,"@marcom/ac-event-emitter-micro":33}],43:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var EventEmitter = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;
var cssPropertyAvailable = require('@marcom/ac-feature/cssPropertyAvailable');
var insertBefore = require('@marcom/ac-dom-nodes/insertBefore');
var getScrollY = require('@marcom/ac-dom-metrics/getScrollY');
var addClass = require('@marcom/ac-classlist/add');
var removeClass = require('@marcom/ac-classlist/remove');

var NATIVE_CLASS = 'css-sticky';

/**
 * @name SimpleSticky
 *
 * @class
 * @private
 *
 * @memberOf module:ac-localnav/internal
 *
 * @param {Element} el
 *        The element to make sticky
 *
 * @param {Object} [options]
 *        Containing selectors or class name prefixes for the SimpleSticky components
 *
 * @param {String} [options.placeholderID]
 *        The id to use for the placeholder element
 *
 * @param {String} [options.stuckClassName]
 *        The class name to apply on the sticky element when it becomes sticky
 *
 * @param {String} [options.className]
 *        The string to prefix onto the placeholderID and the stuckClassName
 */
var SimpleSticky = function (el, options) {
	EventEmitter.call(this);

	this.el = el;
	this.stuck = false;

	this._selectors = {
		placeholderID: options.placeholderID || options.className + '-sticky-placeholder',
		stuckClassName: options.stuckClassName || options.className + '-sticking'
	};

	this._createPlaceholder();
	this._featureDetection();

	this._updatePosition = this._updatePosition.bind(this);
	this._updatePlaceholderOffset = this._updatePlaceholderOffset.bind(this);

	window.addEventListener('scroll', this._updatePosition);
	document.addEventListener('touchmove', this._updatePosition);

	window.addEventListener('resize', this._updatePlaceholderOffset);
	window.addEventListener('orientationchange', this._updatePlaceholderOffset);

	if ('acStore' in window) {
		window.acStore.getStorefront().then(this._updatePlaceholderOffset);
		window.acStore.on('storefrontChange', this._updatePlaceholderOffset);
	}
};

/**
 * @name SimpleSticky#create
 *
 * @function
 * @public
 *
 * @desc Factory method for creating a SimpleSticky object
 *
 * @see SimpleSticky
 *
 * @returns {Object} SimpleSticky object
 */
SimpleSticky.create = function (el, options) {
	return new SimpleSticky(el, options);
};

var superProto = EventEmitter.prototype;
var proto = SimpleSticky.prototype = Object.create(superProto);
SimpleSticky.prototype.constructor = SimpleSticky;

/**
 * @name SimpleSticky#_featureDetection
 *
 * @function
 * @private
 *
 * @desc Detects whether or not native sticky is supported and adds the appropriate class names
 */
proto._featureDetection = function () {
	var available = cssPropertyAvailable('position', 'sticky');
	var className = NATIVE_CLASS;

	if (!available) {
		className = 'no-' + className;
	}

	addClass(this.el, className);
	addClass(this.placeholder, className);
};

/**
 * @name SimpleSticky#_createPlaceholder
 *
 * @function
 * @private
 *
 * @desc Creates the placeholder element to prevent content on the page from jumping when the sticky element becomes sticky
 */
proto._createPlaceholder = function () {
	this.placeholder = document.createElement('div');
	this.placeholder.id = this._selectors.placeholderID;
	insertBefore(this.placeholder, this.el);
	this._updatePlaceholderOffset();
};

/**
 * @name SimpleSticky#_updatePlaceholderOffset
 *
 * @function
 * @private
 *
 * @desc Updates the placeholder offset value
 */
proto._updatePlaceholderOffset = function () {
	var offset = this.placeholder.offsetTop;

	// account for segment bar
	offset += document.documentElement.offsetTop + document.body.offsetTop;

	if (offset !== this._placeholderOffset) {
		this._placeholderOffset = offset;
		this._updatePosition();
	}
};

/**
 * @name SimpleSticky#_updatePosition
 *
 * @function
 * @private
 *
 * @desc Updates the position of the sticky element
 */
proto._updatePosition = function () {
	var scrollY = getScrollY();

	if (scrollY > this._placeholderOffset) {
		if (!this.stuck) {
			addClass(this.el, this._selectors.stuckClassName);
			addClass(this.placeholder, this._selectors.stuckClassName);
			this.stuck = true;
			this.trigger('stuck');
		}
	} else {
		if (this.stuck) {
			removeClass(this.el, this._selectors.stuckClassName);
			removeClass(this.placeholder, this._selectors.stuckClassName);
			this.stuck = false;
			this.trigger('unstuck');
		}
	}
};

module.exports = SimpleSticky;

// ac-localnav@5.0.2

},{"@marcom/ac-classlist/add":1,"@marcom/ac-classlist/remove":9,"@marcom/ac-dom-metrics/getScrollY":12,"@marcom/ac-dom-nodes/insertBefore":18,"@marcom/ac-event-emitter-micro":33,"@marcom/ac-feature/cssPropertyAvailable":35}],44:[function(require,module,exports){
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

},{"./extend":45}],45:[function(require,module,exports){
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

},{"@marcom/ac-polyfills/Array/prototype.forEach":46}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
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

},{}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
require('matchmedia-polyfill');
require('matchmedia-polyfill/matchMedia.addListener');

// ac-polyfills@2.6.0

},{"matchmedia-polyfill":64,"matchmedia-polyfill/matchMedia.addListener":63}],54:[function(require,module,exports){
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

},{"./shared/getStyleTestElement":56,"./shared/prefixHelper":57,"./shared/stylePropertyCache":58,"./utils/toCSS":60,"./utils/toDOM":61}],55:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getStyleProperty = require('./getStyleProperty');
var styleValueAvailable = require('./shared/styleValueAvailable');
var prefixHelper = require('./shared/prefixHelper');

var stylePropertyCache = require('./shared/stylePropertyCache');
var styleValueCache = {};

var RE_CSS_FUNCTION_PARAMS = /(\([^\)]+\))/gi;
var RE_CSS_VALUES = /([^ ,;\(]+(\([^\)]+\))?)/gi;

/**
 * @name module:ac-prefixer.getStyleValue
 *
 * @function
 *
 * @desc Returns the value for a specific property with vendor prefix(es), as needed.
 *
 * @param {String} property
 *        The unprefixed property name in CSS or DOM form.
 *
 * @param {String} value
 *        The unprefixed property value.
 *
 * @returns {String|Boolean} The value, or `false` if not available.
 */
module.exports = function getStyleValue(property, value) {
	var cssProperty;

	value += '';
	property = getStyleProperty(property);

	if (!property) {
		return false;
	}

	if (styleValueAvailable(property, value)) {
		return value;
	}

	cssProperty = stylePropertyCache[property].css;

	value = value.replace(RE_CSS_VALUES, function (match) {
		var values;
		var valueKey;
		var key;
		var i;

		// ignore colors and numbers
		if (match[0] === '#' || !isNaN(match[0])) {
			return match;
		}

		// check memoized value
		valueKey = match.replace(RE_CSS_FUNCTION_PARAMS, '');
		key = cssProperty + ':' + valueKey;
		if (key in styleValueCache) {
			if (styleValueCache[key] === false) {
				// value not supported, stripped
				return '';
			}

			return match.replace(valueKey, styleValueCache[key]);
		}

		// prepare potential prefixes
		values = prefixHelper.css.map(function (prefix) {
			return prefix + match;
		});
		values = [match].concat(values);

		// check potential prefixes
		for (i = 0; i < values.length; i++) {
			if (styleValueAvailable(property, values[i])) {
				// valid prefix found

				if (i !== 0) {
					prefixHelper.reduce(i - 1);
				}

				styleValueCache[key] = values[i].replace(RE_CSS_FUNCTION_PARAMS, '');
				return values[i];
			}
		}

		// value not supported, stripped
		styleValueCache[key] = false;
		return '';
	});

	value = value.trim();
	return (value === '') ? false : value;
};

// ac-prefixer@3.1.1

},{"./getStyleProperty":54,"./shared/prefixHelper":57,"./shared/stylePropertyCache":58,"./shared/styleValueAvailable":59}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
module.exports = {};

// ac-prefixer@3.1.1

},{}],59:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var cache = require('./stylePropertyCache');
var getStyleTestElement = require('./getStyleTestElement');
var flagsSet = false;
var supportsAvailable;
var invalidStyleThrowsError;

var prepareFlags = function () {
	var el;

	if (!flagsSet) {
		flagsSet = true;
		supportsAvailable = ('CSS' in window && 'supports' in window.CSS);
		invalidStyleThrowsError = false;

		el = getStyleTestElement();
		try {
			el.style.width = 'invalid';
		} catch (e) {
			// Old IE throws an error for invalid values
			invalidStyleThrowsError = true;
		}
	}
};

/**
 * @name styleValueAvailable
 * @memberOf module:ac-prefixer/shared
 *
 * @function
 * @private
 *
 * @desc Determine whether or not a CSS value is valid
 *
 * @param {String} property
 *        The property name in DOM form, prefixed as needed.
 *
 * @param {String} value
 *        The value to test.
 *
 * @returns {Boolean} `true` if the value is valid, otherwise `false`.
 */
module.exports = function styleValueAvailable(property, value) {
	var before;
	var el;

	prepareFlags();

	if (supportsAvailable) {
		property = cache[property].css;
		return CSS.supports(property, value);
	}

	el = getStyleTestElement();
	before = el.style[property];

	if (invalidStyleThrowsError) {
		try {
			el.style[property] = value;
		} catch (e) {
			// Old IE throws an error for invalid values
			return false;
		}
	} else {
		el.style[property] = value;
	}

	return (el.style[property] && el.style[property] !== before);
};

/*
 * @name styleValueAvailable.resetFlags
 *
 * @function
 * @private
 *
 * @desc Reset CSS.support and try/catch flags. Exposed for testing.
 */
module.exports.resetFlags = function () {
	flagsSet = false;
};

// ac-prefixer@3.1.1

},{"./getStyleTestElement":56,"./stylePropertyCache":58}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Function/prototype.bind');
require('@marcom/ac-polyfills/Object/keys');
require('@marcom/ac-polyfills/Object/create');

/** @ignore */
var EventEmitter = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;
var ac_addEventListener = require('@marcom/ac-dom-events/utils/addEventListener');
var mediaQueriesAvailable = require('@marcom/ac-feature/mediaQueriesAvailable');

var DEFAULT_ID = 'viewport-emitter';
var PSEUDO_SELECTOR = '::before';

var RETINA_QUERY = 'only screen and (-webkit-min-device-pixel-ratio: 1.5), screen and (min-resolution: 1.5dppx), screen and (min-resolution: 144dpi)';

/**
 * @name module:ac-viewport-emitter.ViewportEmitter
 *
 * @class
 *
 * @desc Fires events on viewport changes
 *
 * @param {String} [id="viewport-emitter-data"]
 *        The ID of the element with viewport data
 */
function ViewportEmitter(id) {
	EventEmitter.call(this);

	this._initializeElement(id);

	if (mediaQueriesAvailable()) {
		this._updateViewport = this._updateViewport.bind(this);
		ac_addEventListener(window, 'resize', this._updateViewport);
		ac_addEventListener(window, 'orientationchange', this._updateViewport);

		this._retinaQuery = window.matchMedia(RETINA_QUERY);
		this._updateRetina();

		if (this._retinaQuery.addListener) {
			this._updateRetina = this._updateRetina.bind(this);
			this._retinaQuery.addListener(this._updateRetina);
		}
	}

	this._updateViewport();
}

var proto = ViewportEmitter.prototype = Object.create(EventEmitter.prototype);

proto.viewport = false;

proto.retina = false;

proto._initializeElement = function (id) {
	var el;

	id = id || DEFAULT_ID;
	el = document.getElementById(id);

	if (!el) {
		el = document.createElement('div');
		el.id = id;
		el = document.body.appendChild(el);
	}

	this._el = el;
};

proto._getElementContent = function () {
	var content;

	if ('currentStyle' in this._el) {
		content = this._el.currentStyle['x-content'];
	} else {
		this._invalidateStyles();
		content = window.getComputedStyle(this._el, PSEUDO_SELECTOR).content;
	}

	if (content) {
		content = content.replace(/["']/g, '');
	}

	if (content) {
		return content;
	}

	return false;
};

proto._updateViewport = function () {
	var lastViewport = this.viewport;
	var style;
	var eventData;

	this.viewport = this._getElementContent();

	// remove namespace
	if (this.viewport) {
		this.viewport = this.viewport.split(':').pop();
	}

	if (lastViewport && this.viewport !== lastViewport) {
		eventData = {
			from: lastViewport,
			to: this.viewport
		};

		this.trigger('change', eventData);
		this.trigger('from:' + lastViewport, eventData);
		this.trigger('to:' + this.viewport, eventData);
	}
};

proto._updateRetina = function (query) {
	var lastRetina = this.retina;

	this.retina = this._retinaQuery.matches;

	if (lastRetina !== this.retina) {
		this.trigger('retinachange', {
			from: lastRetina,
			to: this.retina
		});
	}
};

proto._invalidateStyles = function () {
	// Safari has a nasty bug with getComputedStyle on `resize` and initial page load.
	// This prevents that from happening. Don't touch it.
	document.documentElement.clientWidth;
	this._el.innerHTML = (this._el.innerHTML === ' ') ? ' ' : ' ';
	document.documentElement.clientWidth;
};

module.exports = ViewportEmitter;

// ac-viewport-emitter@1.5.4

},{"@marcom/ac-dom-events/utils/addEventListener":11,"@marcom/ac-event-emitter-micro":33,"@marcom/ac-feature/mediaQueriesAvailable":37,"@marcom/ac-polyfills/Function/prototype.bind":50,"@marcom/ac-polyfills/Object/create":51,"@marcom/ac-polyfills/Object/keys":52}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
'use strict';

var Localnav = require('@marcom/ac-localnav/Localnav');

},{"@marcom/ac-localnav/Localnav":40}]},{},[65]);
