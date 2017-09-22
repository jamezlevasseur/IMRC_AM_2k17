/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
(function (global, factory) {

	"use strict";

	if (( false ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ? factory(global, true) : function (w) {
			if (!w.document) {
				throw new Error("jQuery requires a window with a document");
			}
			return factory(w);
		};
	} else {
		factory(global);
	}

	// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : undefined, function (window, noGlobal) {

	// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";

	var arr = [];

	var document = window.document;

	var getProto = Object.getPrototypeOf;

	var _slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var fnToString = hasOwn.toString;

	var ObjectFunctionString = fnToString.call(Object);

	var support = {};

	function DOMEval(code, doc) {
		doc = doc || document;

		var script = doc.createElement("script");

		script.text = code;
		doc.head.appendChild(script).parentNode.removeChild(script);
	}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module


	var version = "3.2.1",


	// Define a local copy of jQuery
	jQuery = function jQuery(selector, context) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init(selector, context);
	},


	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,


	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	    rdashAlpha = /-([a-z])/g,


	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function fcamelCase(all, letter) {
		return letter.toUpperCase();
	};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function toArray() {
			return _slice.call(this);
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function get(num) {

			// Return all the elements in a clean array
			if (num == null) {
				return _slice.call(this);
			}

			// Return just the one element from the set
			return num < 0 ? this[num + this.length] : this[num];
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function pushStack(elems) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function each(callback) {
			return jQuery.each(this, callback);
		},

		map: function map(callback) {
			return this.pushStack(jQuery.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		slice: function slice() {
			return this.pushStack(_slice.apply(this, arguments));
		},

		first: function first() {
			return this.eq(0);
		},

		last: function last() {
			return this.eq(-1);
		},

		eq: function eq(i) {
			var len = this.length,
			    j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end: function end() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function () {
		var options,
		    name,
		    src,
		    copy,
		    copyIsArray,
		    clone,
		    target = arguments[0] || {},
		    i = 1,
		    length = arguments.length,
		    deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {

			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {

				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

						if (copyIsArray) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = jQuery.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function error(msg) {
			throw new Error(msg);
		},

		noop: function noop() {},

		isFunction: function isFunction(obj) {
			return jQuery.type(obj) === "function";
		},

		isWindow: function isWindow(obj) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function isNumeric(obj) {

			// As of jQuery 3.0, isNumeric is limited to
			// strings and numbers (primitives or objects)
			// that can be coerced to finite numbers (gh-2662)
			var type = jQuery.type(obj);
			return (type === "number" || type === "string") &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN(obj - parseFloat(obj));
		},

		isPlainObject: function isPlainObject(obj) {
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if (!obj || toString.call(obj) !== "[object Object]") {
				return false;
			}

			proto = getProto(obj);

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if (!proto) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
			return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
		},

		isEmptyObject: function isEmptyObject(obj) {

			/* eslint-disable no-unused-vars */
			// See https://github.com/eslint/eslint/issues/6125
			var name;

			for (name in obj) {
				return false;
			}
			return true;
		},

		type: function type(obj) {
			if (obj == null) {
				return obj + "";
			}

			// Support: Android <=2.3 only (functionish RegExp)
			return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
		},

		// Evaluates a script in a global context
		globalEval: function globalEval(code) {
			DOMEval(code);
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE <=9 - 11, Edge 12 - 13
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function camelCase(string) {
			return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
		},

		each: function each(obj, callback) {
			var length,
			    i = 0;

			if (isArrayLike(obj)) {
				length = obj.length;
				for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android <=4.0 only
		trim: function trim(text) {
			return text == null ? "" : (text + "").replace(rtrim, "");
		},

		// results is for internal usage only
		makeArray: function makeArray(arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArrayLike(Object(arr))) {
					jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
				} else {
					push.call(ret, arr);
				}
			}

			return ret;
		},

		inArray: function inArray(elem, arr, i) {
			return arr == null ? -1 : indexOf.call(arr, elem, i);
		},

		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function merge(first, second) {
			var len = +second.length,
			    j = 0,
			    i = first.length;

			for (; j < len; j++) {
				first[i++] = second[j];
			}

			first.length = i;

			return first;
		},

		grep: function grep(elems, callback, invert) {
			var callbackInverse,
			    matches = [],
			    i = 0,
			    length = elems.length,
			    callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function map(elems, callback, arg) {
			var length,
			    value,
			    i = 0,
			    ret = [];

			// Go through the array, translating each of the items to their new values
			if (isArrayLike(elems)) {
				length = elems.length;
				for (; i < length; i++) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}

				// Go through every key on the object,
			} else {
				for (i in elems) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply([], ret);
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function proxy(fn, context) {
			var tmp, args, proxy;

			if (typeof context === "string") {
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if (!jQuery.isFunction(fn)) {
				return undefined;
			}

			// Simulated bind
			args = _slice.call(arguments, 2);
			proxy = function proxy() {
				return fn.apply(context || this, args.concat(_slice.call(arguments)));
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});

	if (typeof Symbol === "function") {
		jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
	}

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	function isArrayLike(obj) {

		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
		    type = jQuery.type(obj);

		if (type === "function" || jQuery.isWindow(obj)) {
			return false;
		}

		return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
	}
	var Sizzle =
	/*!
  * Sizzle CSS Selector Engine v2.3.3
  * https://sizzlejs.com/
  *
  * Copyright jQuery Foundation and other contributors
  * Released under the MIT license
  * http://jquery.org/license
  *
  * Date: 2016-08-08
  */
	function (window) {

		var i,
		    support,
		    Expr,
		    getText,
		    isXML,
		    tokenize,
		    compile,
		    select,
		    outermostContext,
		    sortInput,
		    hasDuplicate,


		// Local document vars
		setDocument,
		    document,
		    docElem,
		    documentIsHTML,
		    rbuggyQSA,
		    rbuggyMatches,
		    matches,
		    contains,


		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		    preferredDoc = window.document,
		    dirruns = 0,
		    done = 0,
		    classCache = createCache(),
		    tokenCache = createCache(),
		    compilerCache = createCache(),
		    sortOrder = function sortOrder(a, b) {
			if (a === b) {
				hasDuplicate = true;
			}
			return 0;
		},


		// Instance methods
		hasOwn = {}.hasOwnProperty,
		    arr = [],
		    pop = arr.pop,
		    push_native = arr.push,
		    push = arr.push,
		    slice = arr.slice,

		// Use a stripped-down indexOf as it's faster than native
		// https://jsperf.com/thor-indexof-vs-for/5
		indexOf = function indexOf(list, elem) {
			var i = 0,
			    len = list.length;
			for (; i < len; i++) {
				if (list[i] === elem) {
					return i;
				}
			}
			return -1;
		},
		    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",


		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",


		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",


		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
		    pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" + ")\\)|)",


		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp(whitespace + "+", "g"),
		    rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
		    rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
		    rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
		    rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
		    rpseudo = new RegExp(pseudos),
		    ridentifier = new RegExp("^" + identifier + "$"),
		    matchExpr = {
			"ID": new RegExp("^#(" + identifier + ")"),
			"CLASS": new RegExp("^\\.(" + identifier + ")"),
			"TAG": new RegExp("^(" + identifier + "|[*])"),
			"ATTR": new RegExp("^" + attributes),
			"PSEUDO": new RegExp("^" + pseudos),
			"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
			"bool": new RegExp("^(?:" + booleans + ")$", "i"),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
		},
		    rinputs = /^(?:input|select|textarea|button)$/i,
		    rheader = /^h\d$/i,
		    rnative = /^[^{]+\{\s*\[native \w/,


		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
		    rsibling = /[+~]/,


		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
		    funescape = function funescape(_, escaped, escapedWhitespace) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ? escaped : high < 0 ?
			// BMP codepoint
			String.fromCharCode(high + 0x10000) :
			// Supplemental Plane codepoint (surrogate pair)
			String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
		},


		// CSS string/identifier serialization
		// https://drafts.csswg.org/cssom/#common-serializing-idioms
		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
		    fcssescape = function fcssescape(ch, asCodePoint) {
			if (asCodePoint) {

				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
				if (ch === "\0") {
					return "\uFFFD";
				}

				// Control characters and (dependent upon position) numbers get escaped as code points
				return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
			}

			// Other potentially-special ASCII characters get backslash-escaped
			return "\\" + ch;
		},


		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function unloadHandler() {
			setDocument();
		},
		    disabledAncestor = addCombinator(function (elem) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		}, { dir: "parentNode", next: "legend" });

		// Optimize for push.apply( _, NodeList )
		try {
			push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
			// Support: Android<4.0
			// Detect silently failing push.apply
			arr[preferredDoc.childNodes.length].nodeType;
		} catch (e) {
			push = { apply: arr.length ?

				// Leverage slice if possible
				function (target, els) {
					push_native.apply(target, slice.call(els));
				} :

				// Support: IE<9
				// Otherwise append directly
				function (target, els) {
					var j = target.length,
					    i = 0;
					// Can't trust NodeList.length
					while (target[j++] = els[i++]) {}
					target.length = j - 1;
				}
			};
		}

		function Sizzle(selector, context, results, seed) {
			var m,
			    i,
			    elem,
			    nid,
			    match,
			    groups,
			    newSelector,
			    newContext = context && context.ownerDocument,


			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

			results = results || [];

			// Return early from calls with invalid selector or context
			if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

				return results;
			}

			// Try to shortcut find operations (as opposed to filters) in HTML documents
			if (!seed) {

				if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
					setDocument(context);
				}
				context = context || document;

				if (documentIsHTML) {

					// If the selector is sufficiently simple, try using a "get*By*" DOM method
					// (excepting DocumentFragment context, where the methods don't exist)
					if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

						// ID selector
						if (m = match[1]) {

							// Document context
							if (nodeType === 9) {
								if (elem = context.getElementById(m)) {

									// Support: IE, Opera, Webkit
									// TODO: identify versions
									// getElementById can match elements by name instead of ID
									if (elem.id === m) {
										results.push(elem);
										return results;
									}
								} else {
									return results;
								}

								// Element context
							} else {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {

									results.push(elem);
									return results;
								}
							}

							// Type selector
						} else if (match[2]) {
							push.apply(results, context.getElementsByTagName(selector));
							return results;

							// Class selector
						} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {

							push.apply(results, context.getElementsByClassName(m));
							return results;
						}
					}

					// Take advantage of querySelectorAll
					if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {

						if (nodeType !== 1) {
							newContext = context;
							newSelector = selector;

							// qSA looks outside Element context, which is not what we want
							// Thanks to Andrew Dupont for this workaround technique
							// Support: IE <=8
							// Exclude object elements
						} else if (context.nodeName.toLowerCase() !== "object") {

							// Capture the context ID, setting it first if necessary
							if (nid = context.getAttribute("id")) {
								nid = nid.replace(rcssescape, fcssescape);
							} else {
								context.setAttribute("id", nid = expando);
							}

							// Prefix every selector in the list
							groups = tokenize(selector);
							i = groups.length;
							while (i--) {
								groups[i] = "#" + nid + " " + toSelector(groups[i]);
							}
							newSelector = groups.join(",");

							// Expand context for sibling selectors
							newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
						}

						if (newSelector) {
							try {
								push.apply(results, newContext.querySelectorAll(newSelector));
								return results;
							} catch (qsaError) {} finally {
								if (nid === expando) {
									context.removeAttribute("id");
								}
							}
						}
					}
				}
			}

			// All others
			return select(selector.replace(rtrim, "$1"), context, results, seed);
		}

		/**
   * Create key-value caches of limited size
   * @returns {function(string, object)} Returns the Object data after storing it on itself with
   *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
   *	deleting the oldest entry
   */
		function createCache() {
			var keys = [];

			function cache(key, value) {
				// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
				if (keys.push(key + " ") > Expr.cacheLength) {
					// Only keep the most recent entries
					delete cache[keys.shift()];
				}
				return cache[key + " "] = value;
			}
			return cache;
		}

		/**
   * Mark a function for special use by Sizzle
   * @param {Function} fn The function to mark
   */
		function markFunction(fn) {
			fn[expando] = true;
			return fn;
		}

		/**
   * Support testing using an element
   * @param {Function} fn Passed the created element and returns a boolean result
   */
		function assert(fn) {
			var el = document.createElement("fieldset");

			try {
				return !!fn(el);
			} catch (e) {
				return false;
			} finally {
				// Remove from its parent by default
				if (el.parentNode) {
					el.parentNode.removeChild(el);
				}
				// release memory in IE
				el = null;
			}
		}

		/**
   * Adds the same handler for all of the specified attrs
   * @param {String} attrs Pipe-separated list of attributes
   * @param {Function} handler The method that will be applied
   */
		function addHandle(attrs, handler) {
			var arr = attrs.split("|"),
			    i = arr.length;

			while (i--) {
				Expr.attrHandle[arr[i]] = handler;
			}
		}

		/**
   * Checks document order of two siblings
   * @param {Element} a
   * @param {Element} b
   * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
   */
		function siblingCheck(a, b) {
			var cur = b && a,
			    diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;

			// Use IE sourceIndex if available on both nodes
			if (diff) {
				return diff;
			}

			// Check if b follows a
			if (cur) {
				while (cur = cur.nextSibling) {
					if (cur === b) {
						return -1;
					}
				}
			}

			return a ? 1 : -1;
		}

		/**
   * Returns a function to use in pseudos for input types
   * @param {String} type
   */
		function createInputPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === type;
			};
		}

		/**
   * Returns a function to use in pseudos for buttons
   * @param {String} type
   */
		function createButtonPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && elem.type === type;
			};
		}

		/**
   * Returns a function to use in pseudos for :enabled/:disabled
   * @param {Boolean} disabled true for :disabled; false for :enabled
   */
		function createDisabledPseudo(disabled) {

			// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
			return function (elem) {

				// Only certain elements can match :enabled or :disabled
				// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
				// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
				if ("form" in elem) {

					// Check for inherited disabledness on relevant non-disabled elements:
					// * listed form-associated elements in a disabled fieldset
					//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
					//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
					// * option elements in a disabled optgroup
					//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
					// All such elements have a "form" property.
					if (elem.parentNode && elem.disabled === false) {

						// Option elements defer to a parent optgroup if present
						if ("label" in elem) {
							if ("label" in elem.parentNode) {
								return elem.parentNode.disabled === disabled;
							} else {
								return elem.disabled === disabled;
							}
						}

						// Support: IE 6 - 11
						// Use the isDisabled shortcut property to check for disabled fieldset ancestors
						return elem.isDisabled === disabled ||

						// Where there is no isDisabled, check manually
						/* jshint -W018 */
						elem.isDisabled !== !disabled && disabledAncestor(elem) === disabled;
					}

					return elem.disabled === disabled;

					// Try to winnow out elements that can't be disabled before trusting the disabled property.
					// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
					// even exist on them, let alone have a boolean value.
				} else if ("label" in elem) {
					return elem.disabled === disabled;
				}

				// Remaining elements are neither :enabled nor :disabled
				return false;
			};
		}

		/**
   * Returns a function to use in pseudos for positionals
   * @param {Function} fn
   */
		function createPositionalPseudo(fn) {
			return markFunction(function (argument) {
				argument = +argument;
				return markFunction(function (seed, matches) {
					var j,
					    matchIndexes = fn([], seed.length, argument),
					    i = matchIndexes.length;

					// Match elements found at the specified indexes
					while (i--) {
						if (seed[j = matchIndexes[i]]) {
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}

		/**
   * Checks a node for validity as a Sizzle context
   * @param {Element|Object=} context
   * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
   */
		function testContext(context) {
			return context && typeof context.getElementsByTagName !== "undefined" && context;
		}

		// Expose support vars for convenience
		support = Sizzle.support = {};

		/**
   * Detects XML nodes
   * @param {Element|Object} elem An element or a document
   * @returns {Boolean} True iff elem is a non-HTML XML node
   */
		isXML = Sizzle.isXML = function (elem) {
			// documentElement is verified for cases where it doesn't yet exist
			// (such as loading iframes in IE - #4833)
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};

		/**
   * Sets document-related variables once based on the current document
   * @param {Element|Object} [doc] An element or document object to use to set the document
   * @returns {Object} Returns the current document
   */
		setDocument = Sizzle.setDocument = function (node) {
			var hasCompare,
			    subWindow,
			    doc = node ? node.ownerDocument || node : preferredDoc;

			// Return early if doc is invalid or already selected
			if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
				return document;
			}

			// Update global variables
			document = doc;
			docElem = document.documentElement;
			documentIsHTML = !isXML(document);

			// Support: IE 9-11, Edge
			// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
			if (preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {

				// Support: IE 11, Edge
				if (subWindow.addEventListener) {
					subWindow.addEventListener("unload", unloadHandler, false);

					// Support: IE 9 - 10 only
				} else if (subWindow.attachEvent) {
					subWindow.attachEvent("onunload", unloadHandler);
				}
			}

			/* Attributes
   ---------------------------------------------------------------------- */

			// Support: IE<8
			// Verify that getAttribute really returns attributes and not properties
			// (excepting IE8 booleans)
			support.attributes = assert(function (el) {
				el.className = "i";
				return !el.getAttribute("className");
			});

			/* getElement(s)By*
   ---------------------------------------------------------------------- */

			// Check if getElementsByTagName("*") returns only elements
			support.getElementsByTagName = assert(function (el) {
				el.appendChild(document.createComment(""));
				return !el.getElementsByTagName("*").length;
			});

			// Support: IE<9
			support.getElementsByClassName = rnative.test(document.getElementsByClassName);

			// Support: IE<10
			// Check if getElementById returns elements by name
			// The broken getElementById methods don't pick up programmatically-set names,
			// so use a roundabout getElementsByName test
			support.getById = assert(function (el) {
				docElem.appendChild(el).id = expando;
				return !document.getElementsByName || !document.getElementsByName(expando).length;
			});

			// ID filter and find
			if (support.getById) {
				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						return elem.getAttribute("id") === attrId;
					};
				};
				Expr.find["ID"] = function (id, context) {
					if (typeof context.getElementById !== "undefined" && documentIsHTML) {
						var elem = context.getElementById(id);
						return elem ? [elem] : [];
					}
				};
			} else {
				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
						return node && node.value === attrId;
					};
				};

				// Support: IE 6 - 7 only
				// getElementById is not reliable as a find shortcut
				Expr.find["ID"] = function (id, context) {
					if (typeof context.getElementById !== "undefined" && documentIsHTML) {
						var node,
						    i,
						    elems,
						    elem = context.getElementById(id);

						if (elem) {

							// Verify the id attribute
							node = elem.getAttributeNode("id");
							if (node && node.value === id) {
								return [elem];
							}

							// Fall back on getElementsByName
							elems = context.getElementsByName(id);
							i = 0;
							while (elem = elems[i++]) {
								node = elem.getAttributeNode("id");
								if (node && node.value === id) {
									return [elem];
								}
							}
						}

						return [];
					}
				};
			}

			// Tag
			Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
				if (typeof context.getElementsByTagName !== "undefined") {
					return context.getElementsByTagName(tag);

					// DocumentFragment nodes don't have gEBTN
				} else if (support.qsa) {
					return context.querySelectorAll(tag);
				}
			} : function (tag, context) {
				var elem,
				    tmp = [],
				    i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName(tag);

				// Filter out possible comments
				if (tag === "*") {
					while (elem = results[i++]) {
						if (elem.nodeType === 1) {
							tmp.push(elem);
						}
					}

					return tmp;
				}
				return results;
			};

			// Class
			Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
				if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
					return context.getElementsByClassName(className);
				}
			};

			/* QSA/matchesSelector
   ---------------------------------------------------------------------- */

			// QSA and matchesSelector support

			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			rbuggyMatches = [];

			// qSa(:focus) reports false when true (Chrome 21)
			// We allow this because of a bug in IE8/9 that throws an error
			// whenever `document.activeElement` is accessed on an iframe
			// So, we allow :focus to pass through QSA all the time to avoid the IE error
			// See https://bugs.jquery.com/ticket/13378
			rbuggyQSA = [];

			if (support.qsa = rnative.test(document.querySelectorAll)) {
				// Build QSA regex
				// Regex strategy adopted from Diego Perini
				assert(function (el) {
					// Select is set to empty string on purpose
					// This is to test IE's treatment of not explicitly
					// setting a boolean content attribute,
					// since its presence should be enough
					// https://bugs.jquery.com/ticket/12359
					docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";

					// Support: IE8, Opera 11-12.16
					// Nothing should be selected when empty strings follow ^= or $= or *=
					// The test attribute must be unknown in Opera but "safe" for WinRT
					// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
					if (el.querySelectorAll("[msallowcapture^='']").length) {
						rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
					}

					// Support: IE8
					// Boolean attributes and "value" are not treated correctly
					if (!el.querySelectorAll("[selected]").length) {
						rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
					}

					// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
					if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
						rbuggyQSA.push("~=");
					}

					// Webkit/Opera - :checked should return selected option elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					// IE8 throws error here and will not see later tests
					if (!el.querySelectorAll(":checked").length) {
						rbuggyQSA.push(":checked");
					}

					// Support: Safari 8+, iOS 8+
					// https://bugs.webkit.org/show_bug.cgi?id=136851
					// In-page `selector#id sibling-combinator selector` fails
					if (!el.querySelectorAll("a#" + expando + "+*").length) {
						rbuggyQSA.push(".#.+[+~]");
					}
				});

				assert(function (el) {
					el.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>";

					// Support: Windows 8 Native Apps
					// The type and name attributes are restricted during .innerHTML assignment
					var input = document.createElement("input");
					input.setAttribute("type", "hidden");
					el.appendChild(input).setAttribute("name", "D");

					// Support: IE8
					// Enforce case-sensitivity of name attribute
					if (el.querySelectorAll("[name=d]").length) {
						rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
					}

					// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
					// IE8 throws error here and will not see later tests
					if (el.querySelectorAll(":enabled").length !== 2) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					// Support: IE9-11+
					// IE's :disabled selector does not pick up the children of disabled fieldsets
					docElem.appendChild(el).disabled = true;
					if (el.querySelectorAll(":disabled").length !== 2) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					// Opera 10-11 does not throw on post-comma invalid pseudos
					el.querySelectorAll("*,:x");
					rbuggyQSA.push(",.*:");
				});
			}

			if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {

				assert(function (el) {
					// Check to see if it's possible to do matchesSelector
					// on a disconnected node (IE 9)
					support.disconnectedMatch = matches.call(el, "*");

					// This should fail with an exception
					// Gecko does not error, returns false instead
					matches.call(el, "[s!='']:x");
					rbuggyMatches.push("!=", pseudos);
				});
			}

			rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
			rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

			/* Contains
   ---------------------------------------------------------------------- */
			hasCompare = rnative.test(docElem.compareDocumentPosition);

			// Element contains another
			// Purposefully self-exclusive
			// As in, an element does not contain itself
			contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
				    bup = b && b.parentNode;
				return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
			} : function (a, b) {
				if (b) {
					while (b = b.parentNode) {
						if (b === a) {
							return true;
						}
					}
				}
				return false;
			};

			/* Sorting
   ---------------------------------------------------------------------- */

			// Document order sorting
			sortOrder = hasCompare ? function (a, b) {

				// Flag for duplicate removal
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				// Sort on method existence if only one input has compareDocumentPosition
				var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
				if (compare) {
					return compare;
				}

				// Calculate position if both inputs belong to the same document
				compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) :

				// Otherwise we know they are disconnected
				1;

				// Disconnected nodes
				if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {

					// Choose the first element that is related to our preferred document
					if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
						return -1;
					}
					if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
						return 1;
					}

					// Maintain original order
					return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
				}

				return compare & 4 ? -1 : 1;
			} : function (a, b) {
				// Exit early if the nodes are identical
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				var cur,
				    i = 0,
				    aup = a.parentNode,
				    bup = b.parentNode,
				    ap = [a],
				    bp = [b];

				// Parentless nodes are either documents or disconnected
				if (!aup || !bup) {
					return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;

					// If the nodes are siblings, we can do a quick check
				} else if (aup === bup) {
					return siblingCheck(a, b);
				}

				// Otherwise we need full lists of their ancestors for comparison
				cur = a;
				while (cur = cur.parentNode) {
					ap.unshift(cur);
				}
				cur = b;
				while (cur = cur.parentNode) {
					bp.unshift(cur);
				}

				// Walk down the tree looking for a discrepancy
				while (ap[i] === bp[i]) {
					i++;
				}

				return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck(ap[i], bp[i]) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
			};

			return document;
		};

		Sizzle.matches = function (expr, elements) {
			return Sizzle(expr, null, null, elements);
		};

		Sizzle.matchesSelector = function (elem, expr) {
			// Set document vars if needed
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			// Make sure that attribute selectors are quoted
			expr = expr.replace(rattributeQuotes, "='$1']");

			if (support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {

				try {
					var ret = matches.call(elem, expr);

					// IE 9's matchesSelector returns false on disconnected nodes
					if (ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11) {
						return ret;
					}
				} catch (e) {}
			}

			return Sizzle(expr, document, null, [elem]).length > 0;
		};

		Sizzle.contains = function (context, elem) {
			// Set document vars if needed
			if ((context.ownerDocument || context) !== document) {
				setDocument(context);
			}
			return contains(context, elem);
		};

		Sizzle.attr = function (elem, name) {
			// Set document vars if needed
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			var fn = Expr.attrHandle[name.toLowerCase()],

			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;

			return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
		};

		Sizzle.escape = function (sel) {
			return (sel + "").replace(rcssescape, fcssescape);
		};

		Sizzle.error = function (msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg);
		};

		/**
   * Document sorting and removing duplicates
   * @param {ArrayLike} results
   */
		Sizzle.uniqueSort = function (results) {
			var elem,
			    duplicates = [],
			    j = 0,
			    i = 0;

			// Unless we *know* we can detect duplicates, assume their presence
			hasDuplicate = !support.detectDuplicates;
			sortInput = !support.sortStable && results.slice(0);
			results.sort(sortOrder);

			if (hasDuplicate) {
				while (elem = results[i++]) {
					if (elem === results[i]) {
						j = duplicates.push(i);
					}
				}
				while (j--) {
					results.splice(duplicates[j], 1);
				}
			}

			// Clear input after sorting to release objects
			// See https://github.com/jquery/sizzle/pull/225
			sortInput = null;

			return results;
		};

		/**
   * Utility function for retrieving the text value of an array of DOM nodes
   * @param {Array|Element} elem
   */
		getText = Sizzle.getText = function (elem) {
			var node,
			    ret = "",
			    i = 0,
			    nodeType = elem.nodeType;

			if (!nodeType) {
				// If no nodeType, this is expected to be an array
				while (node = elem[i++]) {
					// Do not traverse comment nodes
					ret += getText(node);
				}
			} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				// Use textContent for elements
				// innerText usage removed for consistency of new lines (jQuery #11153)
				if (typeof elem.textContent === "string") {
					return elem.textContent;
				} else {
					// Traverse its children
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						ret += getText(elem);
					}
				}
			} else if (nodeType === 3 || nodeType === 4) {
				return elem.nodeValue;
			}
			// Do not include comment or processing instruction nodes

			return ret;
		};

		Expr = Sizzle.selectors = {

			// Can be adjusted by the user
			cacheLength: 50,

			createPseudo: markFunction,

			match: matchExpr,

			attrHandle: {},

			find: {},

			relative: {
				">": { dir: "parentNode", first: true },
				" ": { dir: "parentNode" },
				"+": { dir: "previousSibling", first: true },
				"~": { dir: "previousSibling" }
			},

			preFilter: {
				"ATTR": function ATTR(match) {
					match[1] = match[1].replace(runescape, funescape);

					// Move the given value to match[3] whether quoted or unquoted
					match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

					if (match[2] === "~=") {
						match[3] = " " + match[3] + " ";
					}

					return match.slice(0, 4);
				},

				"CHILD": function CHILD(match) {
					/* matches from matchExpr["CHILD"]
     	1 type (only|nth|...)
     	2 what (child|of-type)
     	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
     	4 xn-component of xn+y argument ([+-]?\d*n|)
     	5 sign of xn-component
     	6 x of xn-component
     	7 sign of y-component
     	8 y of y-component
     */
					match[1] = match[1].toLowerCase();

					if (match[1].slice(0, 3) === "nth") {
						// nth-* requires argument
						if (!match[3]) {
							Sizzle.error(match[0]);
						}

						// numeric x and y parameters for Expr.filter.CHILD
						// remember that false/true cast respectively to 0/1
						match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
						match[5] = +(match[7] + match[8] || match[3] === "odd");

						// other types prohibit arguments
					} else if (match[3]) {
						Sizzle.error(match[0]);
					}

					return match;
				},

				"PSEUDO": function PSEUDO(match) {
					var excess,
					    unquoted = !match[6] && match[2];

					if (matchExpr["CHILD"].test(match[0])) {
						return null;
					}

					// Accept quoted arguments as-is
					if (match[3]) {
						match[2] = match[4] || match[5] || "";

						// Strip excess characters from unquoted arguments
					} else if (unquoted && rpseudo.test(unquoted) && (
					// Get excess from tokenize (recursively)
					excess = tokenize(unquoted, true)) && (
					// advance to the next closing parenthesis
					excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

						// excess is a negative index
						match[0] = match[0].slice(0, excess);
						match[2] = unquoted.slice(0, excess);
					}

					// Return only captures needed by the pseudo filter method (type and argument)
					return match.slice(0, 3);
				}
			},

			filter: {

				"TAG": function TAG(nodeNameSelector) {
					var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
					return nodeNameSelector === "*" ? function () {
						return true;
					} : function (elem) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
				},

				"CLASS": function CLASS(className) {
					var pattern = classCache[className + " "];

					return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
						return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
					});
				},

				"ATTR": function ATTR(name, operator, check) {
					return function (elem) {
						var result = Sizzle.attr(elem, name);

						if (result == null) {
							return operator === "!=";
						}
						if (!operator) {
							return true;
						}

						result += "";

						return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
					};
				},

				"CHILD": function CHILD(type, what, argument, first, last) {
					var simple = type.slice(0, 3) !== "nth",
					    forward = type.slice(-4) !== "last",
					    ofType = what === "of-type";

					return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function (elem) {
						return !!elem.parentNode;
					} : function (elem, context, xml) {
						var cache,
						    uniqueCache,
						    outerCache,
						    node,
						    nodeIndex,
						    start,
						    dir = simple !== forward ? "nextSibling" : "previousSibling",
						    parent = elem.parentNode,
						    name = ofType && elem.nodeName.toLowerCase(),
						    useCache = !xml && !ofType,
						    diff = false;

						if (parent) {

							// :(first|last|only)-(child|of-type)
							if (simple) {
								while (dir) {
									node = elem;
									while (node = node[dir]) {
										if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {

											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [forward ? parent.firstChild : parent.lastChild];

							// non-xml :nth-child(...) stores cache data on `parent`
							if (forward && useCache) {

								// Seek `elem` from a previously-cached index

								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[expando] || (node[expando] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

								cache = uniqueCache[type] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = nodeIndex && cache[2];
								node = nodeIndex && parent.childNodes[nodeIndex];

								while (node = ++nodeIndex && node && node[dir] || (

								// Fallback to seeking `elem` from the start
								diff = nodeIndex = 0) || start.pop()) {

									// When found, cache indexes on `parent` and break
									if (node.nodeType === 1 && ++diff && node === elem) {
										uniqueCache[type] = [dirruns, nodeIndex, diff];
										break;
									}
								}
							} else {
								// Use previously-cached element index if available
								if (useCache) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[expando] || (node[expando] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

									cache = uniqueCache[type] || [];
									nodeIndex = cache[0] === dirruns && cache[1];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if (diff === false) {
									// Use the same loop as above to seek `elem` from the start
									while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {

										if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {

											// Cache the index of each encountered element
											if (useCache) {
												outerCache = node[expando] || (node[expando] = {});

												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

												uniqueCache[type] = [dirruns, diff];
											}

											if (node === elem) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || diff % first === 0 && diff / first >= 0;
						}
					};
				},

				"PSEUDO": function PSEUDO(pseudo, argument) {
					// pseudo-class names are case-insensitive
					// http://www.w3.org/TR/selectors/#pseudo-classes
					// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
					// Remember that setFilters inherits from pseudos
					var args,
					    fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);

					// The user may use createPseudo to indicate that
					// arguments are needed to create the filter function
					// just as Sizzle does
					if (fn[expando]) {
						return fn(argument);
					}

					// But maintain support for old signatures
					if (fn.length > 1) {
						args = [pseudo, pseudo, "", argument];
						return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
							var idx,
							    matched = fn(seed, argument),
							    i = matched.length;
							while (i--) {
								idx = indexOf(seed, matched[i]);
								seed[idx] = !(matches[idx] = matched[i]);
							}
						}) : function (elem) {
							return fn(elem, 0, args);
						};
					}

					return fn;
				}
			},

			pseudos: {
				// Potentially complex pseudos
				"not": markFunction(function (selector) {
					// Trim the selector passed to compile
					// to avoid treating leading and trailing
					// spaces as combinators
					var input = [],
					    results = [],
					    matcher = compile(selector.replace(rtrim, "$1"));

					return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
						var elem,
						    unmatched = matcher(seed, null, xml, []),
						    i = seed.length;

						// Match elements unmatched by `matcher`
						while (i--) {
							if (elem = unmatched[i]) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) : function (elem, context, xml) {
						input[0] = elem;
						matcher(input, null, xml, results);
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
				}),

				"has": markFunction(function (selector) {
					return function (elem) {
						return Sizzle(selector, elem).length > 0;
					};
				}),

				"contains": markFunction(function (text) {
					text = text.replace(runescape, funescape);
					return function (elem) {
						return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
					};
				}),

				// "Whether an element is represented by a :lang() selector
				// is based solely on the element's language value
				// being equal to the identifier C,
				// or beginning with the identifier C immediately followed by "-".
				// The matching of C against the element's language value is performed case-insensitively.
				// The identifier C does not have to be a valid language name."
				// http://www.w3.org/TR/selectors/#lang-pseudo
				"lang": markFunction(function (lang) {
					// lang value must be a valid identifier
					if (!ridentifier.test(lang || "")) {
						Sizzle.error("unsupported lang: " + lang);
					}
					lang = lang.replace(runescape, funescape).toLowerCase();
					return function (elem) {
						var elemLang;
						do {
							if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {

								elemLang = elemLang.toLowerCase();
								return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
							}
						} while ((elem = elem.parentNode) && elem.nodeType === 1);
						return false;
					};
				}),

				// Miscellaneous
				"target": function target(elem) {
					var hash = window.location && window.location.hash;
					return hash && hash.slice(1) === elem.id;
				},

				"root": function root(elem) {
					return elem === docElem;
				},

				"focus": function focus(elem) {
					return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
				},

				// Boolean properties
				"enabled": createDisabledPseudo(false),
				"disabled": createDisabledPseudo(true),

				"checked": function checked(elem) {
					// In CSS3, :checked should return both checked and selected elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					var nodeName = elem.nodeName.toLowerCase();
					return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
				},

				"selected": function selected(elem) {
					// Accessing this property makes selected-by-default
					// options in Safari work properly
					if (elem.parentNode) {
						elem.parentNode.selectedIndex;
					}

					return elem.selected === true;
				},

				// Contents
				"empty": function empty(elem) {
					// http://www.w3.org/TR/selectors/#empty-pseudo
					// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
					//   but not by others (comment: 8; processing instruction: 7; etc.)
					// nodeType < 6 works because attributes (2) do not appear as children
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						if (elem.nodeType < 6) {
							return false;
						}
					}
					return true;
				},

				"parent": function parent(elem) {
					return !Expr.pseudos["empty"](elem);
				},

				// Element/input types
				"header": function header(elem) {
					return rheader.test(elem.nodeName);
				},

				"input": function input(elem) {
					return rinputs.test(elem.nodeName);
				},

				"button": function button(elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && elem.type === "button" || name === "button";
				},

				"text": function text(elem) {
					var attr;
					return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && (

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					(attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
				},

				// Position-in-collection
				"first": createPositionalPseudo(function () {
					return [0];
				}),

				"last": createPositionalPseudo(function (matchIndexes, length) {
					return [length - 1];
				}),

				"eq": createPositionalPseudo(function (matchIndexes, length, argument) {
					return [argument < 0 ? argument + length : argument];
				}),

				"even": createPositionalPseudo(function (matchIndexes, length) {
					var i = 0;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"odd": createPositionalPseudo(function (matchIndexes, length) {
					var i = 1;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument;
					for (; --i >= 0;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument;
					for (; ++i < length;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				})
			}
		};

		Expr.pseudos["nth"] = Expr.pseudos["eq"];

		// Add button/input type pseudos
		for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
			Expr.pseudos[i] = createInputPseudo(i);
		}
		for (i in { submit: true, reset: true }) {
			Expr.pseudos[i] = createButtonPseudo(i);
		}

		// Easy API for creating new setFilters
		function setFilters() {}
		setFilters.prototype = Expr.filters = Expr.pseudos;
		Expr.setFilters = new setFilters();

		tokenize = Sizzle.tokenize = function (selector, parseOnly) {
			var matched,
			    match,
			    tokens,
			    type,
			    soFar,
			    groups,
			    preFilters,
			    cached = tokenCache[selector + " "];

			if (cached) {
				return parseOnly ? 0 : cached.slice(0);
			}

			soFar = selector;
			groups = [];
			preFilters = Expr.preFilter;

			while (soFar) {

				// Comma and first run
				if (!matched || (match = rcomma.exec(soFar))) {
					if (match) {
						// Don't consume trailing commas as valid
						soFar = soFar.slice(match[0].length) || soFar;
					}
					groups.push(tokens = []);
				}

				matched = false;

				// Combinators
				if (match = rcombinators.exec(soFar)) {
					matched = match.shift();
					tokens.push({
						value: matched,
						// Cast descendant combinators to space
						type: match[0].replace(rtrim, " ")
					});
					soFar = soFar.slice(matched.length);
				}

				// Filters
				for (type in Expr.filter) {
					if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
						matched = match.shift();
						tokens.push({
							value: matched,
							type: type,
							matches: match
						});
						soFar = soFar.slice(matched.length);
					}
				}

				if (!matched) {
					break;
				}
			}

			// Return the length of the invalid excess
			// if we're just parsing
			// Otherwise, throw an error or return tokens
			return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) :
			// Cache the tokens
			tokenCache(selector, groups).slice(0);
		};

		function toSelector(tokens) {
			var i = 0,
			    len = tokens.length,
			    selector = "";
			for (; i < len; i++) {
				selector += tokens[i].value;
			}
			return selector;
		}

		function addCombinator(matcher, combinator, base) {
			var dir = combinator.dir,
			    skip = combinator.next,
			    key = skip || dir,
			    checkNonElements = base && key === "parentNode",
			    doneName = done++;

			return combinator.first ?
			// Check against closest ancestor/preceding element
			function (elem, context, xml) {
				while (elem = elem[dir]) {
					if (elem.nodeType === 1 || checkNonElements) {
						return matcher(elem, context, xml);
					}
				}
				return false;
			} :

			// Check against all ancestor/preceding elements
			function (elem, context, xml) {
				var oldCache,
				    uniqueCache,
				    outerCache,
				    newCache = [dirruns, doneName];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if (xml) {
					while (elem = elem[dir]) {
						if (elem.nodeType === 1 || checkNonElements) {
							if (matcher(elem, context, xml)) {
								return true;
							}
						}
					}
				} else {
					while (elem = elem[dir]) {
						if (elem.nodeType === 1 || checkNonElements) {
							outerCache = elem[expando] || (elem[expando] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

							if (skip && skip === elem.nodeName.toLowerCase()) {
								elem = elem[dir] || elem;
							} else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {

								// Assign to newCache so results back-propagate to previous elements
								return newCache[2] = oldCache[2];
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[key] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if (newCache[2] = matcher(elem, context, xml)) {
									return true;
								}
							}
						}
					}
				}
				return false;
			};
		}

		function elementMatcher(matchers) {
			return matchers.length > 1 ? function (elem, context, xml) {
				var i = matchers.length;
				while (i--) {
					if (!matchers[i](elem, context, xml)) {
						return false;
					}
				}
				return true;
			} : matchers[0];
		}

		function multipleContexts(selector, contexts, results) {
			var i = 0,
			    len = contexts.length;
			for (; i < len; i++) {
				Sizzle(selector, contexts[i], results);
			}
			return results;
		}

		function condense(unmatched, map, filter, context, xml) {
			var elem,
			    newUnmatched = [],
			    i = 0,
			    len = unmatched.length,
			    mapped = map != null;

			for (; i < len; i++) {
				if (elem = unmatched[i]) {
					if (!filter || filter(elem, context, xml)) {
						newUnmatched.push(elem);
						if (mapped) {
							map.push(i);
						}
					}
				}
			}

			return newUnmatched;
		}

		function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
			if (postFilter && !postFilter[expando]) {
				postFilter = setMatcher(postFilter);
			}
			if (postFinder && !postFinder[expando]) {
				postFinder = setMatcher(postFinder, postSelector);
			}
			return markFunction(function (seed, results, context, xml) {
				var temp,
				    i,
				    elem,
				    preMap = [],
				    postMap = [],
				    preexisting = results.length,


				// Get initial elements from seed or context
				elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),


				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
				    matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || (seed ? preFilter : preexisting || postFilter) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results : matcherIn;

				// Find primary matches
				if (matcher) {
					matcher(matcherIn, matcherOut, context, xml);
				}

				// Apply postFilter
				if (postFilter) {
					temp = condense(matcherOut, postMap);
					postFilter(temp, [], context, xml);

					// Un-match failing elements by moving them back to matcherIn
					i = temp.length;
					while (i--) {
						if (elem = temp[i]) {
							matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
						}
					}
				}

				if (seed) {
					if (postFinder || preFilter) {
						if (postFinder) {
							// Get the final matcherOut by condensing this intermediate into postFinder contexts
							temp = [];
							i = matcherOut.length;
							while (i--) {
								if (elem = matcherOut[i]) {
									// Restore matcherIn since elem is not yet a final match
									temp.push(matcherIn[i] = elem);
								}
							}
							postFinder(null, matcherOut = [], temp, xml);
						}

						// Move matched elements from seed to results to keep them synchronized
						i = matcherOut.length;
						while (i--) {
							if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

								seed[temp] = !(results[temp] = elem);
							}
						}
					}

					// Add elements to results, through postFinder if defined
				} else {
					matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
					if (postFinder) {
						postFinder(null, results, matcherOut, xml);
					} else {
						push.apply(results, matcherOut);
					}
				}
			});
		}

		function matcherFromTokens(tokens) {
			var checkContext,
			    matcher,
			    j,
			    len = tokens.length,
			    leadingRelative = Expr.relative[tokens[0].type],
			    implicitRelative = leadingRelative || Expr.relative[" "],
			    i = leadingRelative ? 1 : 0,


			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator(function (elem) {
				return elem === checkContext;
			}, implicitRelative, true),
			    matchAnyContext = addCombinator(function (elem) {
				return indexOf(checkContext, elem) > -1;
			}, implicitRelative, true),
			    matchers = [function (elem, context, xml) {
				var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			}];

			for (; i < len; i++) {
				if (matcher = Expr.relative[tokens[i].type]) {
					matchers = [addCombinator(elementMatcher(matchers), matcher)];
				} else {
					matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

					// Return special upon seeing a positional matcher
					if (matcher[expando]) {
						// Find the next relative operator (if any) for proper handling
						j = ++i;
						for (; j < len; j++) {
							if (Expr.relative[tokens[j].type]) {
								break;
							}
						}
						return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
					}
					matchers.push(matcher);
				}
			}

			return elementMatcher(matchers);
		}

		function matcherFromGroupMatchers(elementMatchers, setMatchers) {
			var bySet = setMatchers.length > 0,
			    byElement = elementMatchers.length > 0,
			    superMatcher = function superMatcher(seed, context, xml, results, outermost) {
				var elem,
				    j,
				    matcher,
				    matchedCount = 0,
				    i = "0",
				    unmatched = seed && [],
				    setMatched = [],
				    contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]("*", outermost),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
				    len = elems.length;

				if (outermost) {
					outermostContext = context === document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for (; i !== len && (elem = elems[i]) != null; i++) {
					if (byElement && elem) {
						j = 0;
						if (!context && elem.ownerDocument !== document) {
							setDocument(elem);
							xml = !documentIsHTML;
						}
						while (matcher = elementMatchers[j++]) {
							if (matcher(elem, context || document, xml)) {
								results.push(elem);
								break;
							}
						}
						if (outermost) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if (bySet) {
						// They will have gone through all possible matchers
						if (elem = !matcher && elem) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if (seed) {
							unmatched.push(elem);
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if (bySet && i !== matchedCount) {
					j = 0;
					while (matcher = setMatchers[j++]) {
						matcher(unmatched, setMatched, context, xml);
					}

					if (seed) {
						// Reintegrate element matches to eliminate the need for sorting
						if (matchedCount > 0) {
							while (i--) {
								if (!(unmatched[i] || setMatched[i])) {
									setMatched[i] = pop.call(results);
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense(setMatched);
					}

					// Add matches to results
					push.apply(results, setMatched);

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {

						Sizzle.uniqueSort(results);
					}
				}

				// Override manipulation of globals by nested matchers
				if (outermost) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

			return bySet ? markFunction(superMatcher) : superMatcher;
		}

		compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
			var i,
			    setMatchers = [],
			    elementMatchers = [],
			    cached = compilerCache[selector + " "];

			if (!cached) {
				// Generate a function of recursive functions that can be used to check each element
				if (!match) {
					match = tokenize(selector);
				}
				i = match.length;
				while (i--) {
					cached = matcherFromTokens(match[i]);
					if (cached[expando]) {
						setMatchers.push(cached);
					} else {
						elementMatchers.push(cached);
					}
				}

				// Cache the compiled function
				cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

				// Save selector and tokenization
				cached.selector = selector;
			}
			return cached;
		};

		/**
   * A low-level selection function that works with Sizzle's compiled
   *  selector functions
   * @param {String|Function} selector A selector or a pre-compiled
   *  selector function built with Sizzle.compile
   * @param {Element} context
   * @param {Array} [results]
   * @param {Array} [seed] A set of elements to match against
   */
		select = Sizzle.select = function (selector, context, results, seed) {
			var i,
			    tokens,
			    token,
			    type,
			    find,
			    compiled = typeof selector === "function" && selector,
			    match = !seed && tokenize(selector = compiled.selector || selector);

			results = results || [];

			// Try to minimize operations if there is only one selector in the list and no seed
			// (the latter of which guarantees us context)
			if (match.length === 1) {

				// Reduce context if the leading compound selector is an ID
				tokens = match[0] = match[0].slice(0);
				if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

					context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
					if (!context) {
						return results;

						// Precompiled matchers will still verify ancestry, so step up a level
					} else if (compiled) {
						context = context.parentNode;
					}

					selector = selector.slice(tokens.shift().value.length);
				}

				// Fetch a seed set for right-to-left matching
				i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
				while (i--) {
					token = tokens[i];

					// Abort if we hit a combinator
					if (Expr.relative[type = token.type]) {
						break;
					}
					if (find = Expr.find[type]) {
						// Search, expanding context for leading sibling combinators
						if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {

							// If seed is empty or no tokens remain, we can return early
							tokens.splice(i, 1);
							selector = seed.length && toSelector(tokens);
							if (!selector) {
								push.apply(results, seed);
								return results;
							}

							break;
						}
					}
				}
			}

			// Compile and execute a filtering function if one is not provided
			// Provide `match` to avoid retokenization if we modified the selector above
			(compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
			return results;
		};

		// One-time assignments

		// Sort stability
		support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

		// Support: Chrome 14-35+
		// Always assume duplicates if they aren't passed to the comparison function
		support.detectDuplicates = !!hasDuplicate;

		// Initialize against the default document
		setDocument();

		// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
		// Detached nodes confoundingly follow *each other*
		support.sortDetached = assert(function (el) {
			// Should return 1, but returns 4 (following)
			return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
		});

		// Support: IE<8
		// Prevent attribute/property "interpolation"
		// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
		if (!assert(function (el) {
			el.innerHTML = "<a href='#'></a>";
			return el.firstChild.getAttribute("href") === "#";
		})) {
			addHandle("type|href|height|width", function (elem, name, isXML) {
				if (!isXML) {
					return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
				}
			});
		}

		// Support: IE<9
		// Use defaultValue in place of getAttribute("value")
		if (!support.attributes || !assert(function (el) {
			el.innerHTML = "<input/>";
			el.firstChild.setAttribute("value", "");
			return el.firstChild.getAttribute("value") === "";
		})) {
			addHandle("value", function (elem, name, isXML) {
				if (!isXML && elem.nodeName.toLowerCase() === "input") {
					return elem.defaultValue;
				}
			});
		}

		// Support: IE<9
		// Use getAttributeNode to fetch booleans when getAttribute lies
		if (!assert(function (el) {
			return el.getAttribute("disabled") == null;
		})) {
			addHandle(booleans, function (elem, name, isXML) {
				var val;
				if (!isXML) {
					return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
				}
			});
		}

		return Sizzle;
	}(window);

	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;

	// Deprecated
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;

	var dir = function dir(elem, _dir, until) {
		var matched = [],
		    truncate = until !== undefined;

		while ((elem = elem[_dir]) && elem.nodeType !== 9) {
			if (elem.nodeType === 1) {
				if (truncate && jQuery(elem).is(until)) {
					break;
				}
				matched.push(elem);
			}
		}
		return matched;
	};

	var _siblings = function _siblings(n, elem) {
		var matched = [];

		for (; n; n = n.nextSibling) {
			if (n.nodeType === 1 && n !== elem) {
				matched.push(n);
			}
		}

		return matched;
	};

	var rneedsContext = jQuery.expr.match.needsContext;

	function nodeName(elem, name) {

		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	};
	var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow(elements, qualifier, not) {
		if (jQuery.isFunction(qualifier)) {
			return jQuery.grep(elements, function (elem, i) {
				return !!qualifier.call(elem, i, elem) !== not;
			});
		}

		// Single element
		if (qualifier.nodeType) {
			return jQuery.grep(elements, function (elem) {
				return elem === qualifier !== not;
			});
		}

		// Arraylike of elements (jQuery, arguments, Array)
		if (typeof qualifier !== "string") {
			return jQuery.grep(elements, function (elem) {
				return indexOf.call(qualifier, elem) > -1 !== not;
			});
		}

		// Simple selector that can be filtered directly, removing non-Elements
		if (risSimple.test(qualifier)) {
			return jQuery.filter(qualifier, elements, not);
		}

		// Complex selector, compare the two sets, removing non-Elements
		qualifier = jQuery.filter(qualifier, elements);
		return jQuery.grep(elements, function (elem) {
			return indexOf.call(qualifier, elem) > -1 !== not && elem.nodeType === 1;
		});
	}

	jQuery.filter = function (expr, elems, not) {
		var elem = elems[0];

		if (not) {
			expr = ":not(" + expr + ")";
		}

		if (elems.length === 1 && elem.nodeType === 1) {
			return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
		}

		return jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
			return elem.nodeType === 1;
		}));
	};

	jQuery.fn.extend({
		find: function find(selector) {
			var i,
			    ret,
			    len = this.length,
			    self = this;

			if (typeof selector !== "string") {
				return this.pushStack(jQuery(selector).filter(function () {
					for (i = 0; i < len; i++) {
						if (jQuery.contains(self[i], this)) {
							return true;
						}
					}
				}));
			}

			ret = this.pushStack([]);

			for (i = 0; i < len; i++) {
				jQuery.find(selector, self[i], ret);
			}

			return len > 1 ? jQuery.uniqueSort(ret) : ret;
		},
		filter: function filter(selector) {
			return this.pushStack(winnow(this, selector || [], false));
		},
		not: function not(selector) {
			return this.pushStack(winnow(this, selector || [], true));
		},
		is: function is(selector) {
			return !!winnow(this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
		}
	});

	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,


	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	    init = jQuery.fn.init = function (selector, context, root) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if (!selector) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if (typeof selector === "string") {
			if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [null, selector, null];
			} else {
				match = rquickExpr.exec(selector);
			}

			// Match html or make sure no context is specified for #id
			if (match && (match[1] || !context)) {

				// HANDLE: $(html) -> $(array)
				if (match[1]) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));

					// HANDLE: $(html, props)
					if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
						for (match in context) {

							// Properties of context are called as methods if possible
							if (jQuery.isFunction(this[match])) {
								this[match](context[match]);

								// ...and otherwise set as attributes
							} else {
								this.attr(match, context[match]);
							}
						}
					}

					return this;

					// HANDLE: $(#id)
				} else {
					elem = document.getElementById(match[2]);

					if (elem) {

						// Inject the element directly into the jQuery object
						this[0] = elem;
						this.length = 1;
					}
					return this;
				}

				// HANDLE: $(expr, $(...))
			} else if (!context || context.jquery) {
				return (context || root).find(selector);

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor(context).find(selector);
			}

			// HANDLE: $(DOMElement)
		} else if (selector.nodeType) {
			this[0] = selector;
			this.length = 1;
			return this;

			// HANDLE: $(function)
			// Shortcut for document ready
		} else if (jQuery.isFunction(selector)) {
			return root.ready !== undefined ? root.ready(selector) :

			// Execute immediately if ready is not present
			selector(jQuery);
		}

		return jQuery.makeArray(selector, this);
	};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery(document);

	var rparentsprev = /^(?:parents|prev(?:Until|All))/,


	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

	jQuery.fn.extend({
		has: function has(target) {
			var targets = jQuery(target, this),
			    l = targets.length;

			return this.filter(function () {
				var i = 0;
				for (; i < l; i++) {
					if (jQuery.contains(this, targets[i])) {
						return true;
					}
				}
			});
		},

		closest: function closest(selectors, context) {
			var cur,
			    i = 0,
			    l = this.length,
			    matched = [],
			    targets = typeof selectors !== "string" && jQuery(selectors);

			// Positional selectors never match, since there's no _selection_ context
			if (!rneedsContext.test(selectors)) {
				for (; i < l; i++) {
					for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

						// Always skip document fragments
						if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {

							matched.push(cur);
							break;
						}
					}
				}
			}

			return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
		},

		// Determine the position of an element within the set
		index: function index(elem) {

			// No argument, return index in parent
			if (!elem) {
				return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if (typeof elem === "string") {
				return indexOf.call(jQuery(elem), this[0]);
			}

			// Locate the position of the desired element
			return indexOf.call(this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem);
		},

		add: function add(selector, context) {
			return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
		},

		addBack: function addBack(selector) {
			return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
		}
	});

	function sibling(cur, dir) {
		while ((cur = cur[dir]) && cur.nodeType !== 1) {}
		return cur;
	}

	jQuery.each({
		parent: function parent(elem) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function parents(elem) {
			return dir(elem, "parentNode");
		},
		parentsUntil: function parentsUntil(elem, i, until) {
			return dir(elem, "parentNode", until);
		},
		next: function next(elem) {
			return sibling(elem, "nextSibling");
		},
		prev: function prev(elem) {
			return sibling(elem, "previousSibling");
		},
		nextAll: function nextAll(elem) {
			return dir(elem, "nextSibling");
		},
		prevAll: function prevAll(elem) {
			return dir(elem, "previousSibling");
		},
		nextUntil: function nextUntil(elem, i, until) {
			return dir(elem, "nextSibling", until);
		},
		prevUntil: function prevUntil(elem, i, until) {
			return dir(elem, "previousSibling", until);
		},
		siblings: function siblings(elem) {
			return _siblings((elem.parentNode || {}).firstChild, elem);
		},
		children: function children(elem) {
			return _siblings(elem.firstChild);
		},
		contents: function contents(elem) {
			if (nodeName(elem, "iframe")) {
				return elem.contentDocument;
			}

			// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
			// Treat the template element as a regular one in browsers that
			// don't support it.
			if (nodeName(elem, "template")) {
				elem = elem.content || elem;
			}

			return jQuery.merge([], elem.childNodes);
		}
	}, function (name, fn) {
		jQuery.fn[name] = function (until, selector) {
			var matched = jQuery.map(this, fn, until);

			if (name.slice(-5) !== "Until") {
				selector = until;
			}

			if (selector && typeof selector === "string") {
				matched = jQuery.filter(selector, matched);
			}

			if (this.length > 1) {

				// Remove duplicates
				if (!guaranteedUnique[name]) {
					jQuery.uniqueSort(matched);
				}

				// Reverse order for parents* and prev-derivatives
				if (rparentsprev.test(name)) {
					matched.reverse();
				}
			}

			return this.pushStack(matched);
		};
	});
	var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

	// Convert String-formatted options into Object-formatted ones
	function createOptions(options) {
		var object = {};
		jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
			object[flag] = true;
		});
		return object;
	}

	/*
  * Create a callback list using the following parameters:
  *
  *	options: an optional list of space-separated options that will change how
  *			the callback list behaves or a more traditional option object
  *
  * By default a callback list will act like an event callback list and can be
  * "fired" multiple times.
  *
  * Possible options:
  *
  *	once:			will ensure the callback list can only be fired once (like a Deferred)
  *
  *	memory:			will keep track of previous values and will call any callback added
  *					after the list has been fired right away with the latest "memorized"
  *					values (like a Deferred)
  *
  *	unique:			will ensure a callback can only be added once (no duplicate in the list)
  *
  *	stopOnFalse:	interrupt callings when a callback returns false
  *
  */
	jQuery.Callbacks = function (options) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);

		var // Flag to know if list is currently firing
		firing,


		// Last fire value for non-forgettable lists
		memory,


		// Flag to know if list was already fired
		_fired,


		// Flag to prevent firing
		_locked,


		// Actual callback list
		list = [],


		// Queue of execution data for repeatable lists
		queue = [],


		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,


		// Fire callbacks
		fire = function fire() {

			// Enforce single-firing
			_locked = _locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			_fired = firing = true;
			for (; queue.length; firingIndex = -1) {
				memory = queue.shift();
				while (++firingIndex < list.length) {

					// Run callback and check for early termination
					if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if (!options.memory) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if (_locked) {

				// Keep an empty list if we have data for future add calls
				if (memory) {
					list = [];

					// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},


		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function add() {
				if (list) {

					// If we have memory from a past run, we should fire after adding
					if (memory && !firing) {
						firingIndex = list.length - 1;
						queue.push(memory);
					}

					(function add(args) {
						jQuery.each(args, function (_, arg) {
							if (jQuery.isFunction(arg)) {
								if (!options.unique || !self.has(arg)) {
									list.push(arg);
								}
							} else if (arg && arg.length && jQuery.type(arg) !== "string") {

								// Inspect recursively
								add(arg);
							}
						});
					})(arguments);

					if (memory && !firing) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function remove() {
				jQuery.each(arguments, function (_, arg) {
					var index;
					while ((index = jQuery.inArray(arg, list, index)) > -1) {
						list.splice(index, 1);

						// Handle firing indexes
						if (index <= firingIndex) {
							firingIndex--;
						}
					}
				});
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function has(fn) {
				return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function empty() {
				if (list) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function disable() {
				_locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function disabled() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function lock() {
				_locked = queue = [];
				if (!memory && !firing) {
					list = memory = "";
				}
				return this;
			},
			locked: function locked() {
				return !!_locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function fireWith(context, args) {
				if (!_locked) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];
					queue.push(args);
					if (!firing) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function fire() {
				self.fireWith(this, arguments);
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function fired() {
				return !!_fired;
			}
		};

		return self;
	};

	function Identity(v) {
		return v;
	}
	function Thrower(ex) {
		throw ex;
	}

	function adoptValue(value, resolve, reject, noValue) {
		var method;

		try {

			// Check for promise aspect first to privilege synchronous behavior
			if (value && jQuery.isFunction(method = value.promise)) {
				method.call(value).done(resolve).fail(reject);

				// Other thenables
			} else if (value && jQuery.isFunction(method = value.then)) {
				method.call(value, resolve, reject);

				// Other non-thenables
			} else {

				// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
				// * false: [ value ].slice( 0 ) => resolve( value )
				// * true: [ value ].slice( 1 ) => resolve()
				resolve.apply(undefined, [value].slice(noValue));
			}

			// For Promises/A+, convert exceptions into rejections
			// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
			// Deferred#then to conditionally suppress rejection.
		} catch (value) {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.apply(undefined, [value]);
		}
	}

	jQuery.extend({

		Deferred: function Deferred(func) {
			var tuples = [

			// action, add listener, callbacks,
			// ... .then handlers, argument index, [final state]
			["notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory"), 2], ["resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 1, "rejected"]],
			    _state = "pending",
			    _promise = {
				state: function state() {
					return _state;
				},
				always: function always() {
					deferred.done(arguments).fail(arguments);
					return this;
				},
				"catch": function _catch(fn) {
					return _promise.then(null, fn);
				},

				// Keep pipe for back-compat
				pipe: function pipe() /* fnDone, fnFail, fnProgress */{
					var fns = arguments;

					return jQuery.Deferred(function (newDefer) {
						jQuery.each(tuples, function (i, tuple) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction(fns[tuple[4]]) && fns[tuple[4]];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[tuple[1]](function () {
								var returned = fn && fn.apply(this, arguments);
								if (returned && jQuery.isFunction(returned.promise)) {
									returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
								} else {
									newDefer[tuple[0] + "With"](this, fn ? [returned] : arguments);
								}
							});
						});
						fns = null;
					}).promise();
				},
				then: function then(onFulfilled, onRejected, onProgress) {
					var maxDepth = 0;
					function resolve(depth, deferred, handler, special) {
						return function () {
							var that = this,
							    args = arguments,
							    mightThrow = function mightThrow() {
								var returned, then;

								// Support: Promises/A+ section 2.3.3.3.3
								// https://promisesaplus.com/#point-59
								// Ignore double-resolution attempts
								if (depth < maxDepth) {
									return;
								}

								returned = handler.apply(that, args);

								// Support: Promises/A+ section 2.3.1
								// https://promisesaplus.com/#point-48
								if (returned === deferred.promise()) {
									throw new TypeError("Thenable self-resolution");
								}

								// Support: Promises/A+ sections 2.3.3.1, 3.5
								// https://promisesaplus.com/#point-54
								// https://promisesaplus.com/#point-75
								// Retrieve `then` only once
								then = returned && (

								// Support: Promises/A+ section 2.3.4
								// https://promisesaplus.com/#point-64
								// Only check objects and functions for thenability
								(typeof returned === "undefined" ? "undefined" : _typeof(returned)) === "object" || typeof returned === "function") && returned.then;

								// Handle a returned thenable
								if (jQuery.isFunction(then)) {

									// Special processors (notify) just wait for resolution
									if (special) {
										then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special));

										// Normal processors (resolve) also hook into progress
									} else {

										// ...and disregard older resolution values
										maxDepth++;

										then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith));
									}

									// Handle all other returned values
								} else {

									// Only substitute handlers pass on context
									// and multiple values (non-spec behavior)
									if (handler !== Identity) {
										that = undefined;
										args = [returned];
									}

									// Process the value(s)
									// Default process is resolve
									(special || deferred.resolveWith)(that, args);
								}
							},


							// Only normal processors (resolve) catch and reject exceptions
							process = special ? mightThrow : function () {
								try {
									mightThrow();
								} catch (e) {

									if (jQuery.Deferred.exceptionHook) {
										jQuery.Deferred.exceptionHook(e, process.stackTrace);
									}

									// Support: Promises/A+ section 2.3.3.3.4.1
									// https://promisesaplus.com/#point-61
									// Ignore post-resolution exceptions
									if (depth + 1 >= maxDepth) {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if (handler !== Thrower) {
											that = undefined;
											args = [e];
										}

										deferred.rejectWith(that, args);
									}
								}
							};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if (depth) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if (jQuery.Deferred.getStackHook) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout(process);
							}
						};
					}

					return jQuery.Deferred(function (newDefer) {

						// progress_handlers.add( ... )
						tuples[0][3].add(resolve(0, newDefer, jQuery.isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith));

						// fulfilled_handlers.add( ... )
						tuples[1][3].add(resolve(0, newDefer, jQuery.isFunction(onFulfilled) ? onFulfilled : Identity));

						// rejected_handlers.add( ... )
						tuples[2][3].add(resolve(0, newDefer, jQuery.isFunction(onRejected) ? onRejected : Thrower));
					}).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function promise(obj) {
					return obj != null ? jQuery.extend(obj, _promise) : _promise;
				}
			},
			    deferred = {};

			// Add list-specific methods
			jQuery.each(tuples, function (i, tuple) {
				var list = tuple[2],
				    stateString = tuple[5];

				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				_promise[tuple[1]] = list.add;

				// Handle state
				if (stateString) {
					list.add(function () {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						_state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[3 - i][2].disable,

					// progress_callbacks.lock
					tuples[0][2].lock);
				}

				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add(tuple[3].fire);

				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[tuple[0]] = function () {
					deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
					return this;
				};

				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			_promise.promise(deferred);

			// Call given func if any
			if (func) {
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function when(singleValue) {
			var

			// count of uncompleted subordinates
			remaining = arguments.length,


			// count of unprocessed arguments
			i = remaining,


			// subordinate fulfillment data
			resolveContexts = Array(i),
			    resolveValues = _slice.call(arguments),


			// the master Deferred
			master = jQuery.Deferred(),


			// subordinate callback factory
			updateFunc = function updateFunc(i) {
				return function (value) {
					resolveContexts[i] = this;
					resolveValues[i] = arguments.length > 1 ? _slice.call(arguments) : value;
					if (! --remaining) {
						master.resolveWith(resolveContexts, resolveValues);
					}
				};
			};

			// Single- and empty arguments are adopted like Promise.resolve
			if (remaining <= 1) {
				adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject, !remaining);

				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if (master.state() === "pending" || jQuery.isFunction(resolveValues[i] && resolveValues[i].then)) {

					return master.then();
				}
			}

			// Multiple arguments are aggregated like Promise.all array elements
			while (i--) {
				adoptValue(resolveValues[i], updateFunc(i), master.reject);
			}

			return master.promise();
		}
	});

	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

	jQuery.Deferred.exceptionHook = function (error, stack) {

		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
			window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
		}
	};

	jQuery.readyException = function (error) {
		window.setTimeout(function () {
			throw error;
		});
	};

	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();

	jQuery.fn.ready = function (fn) {

		readyList.then(fn)

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch(function (error) {
			jQuery.readyException(error);
		});

		return this;
	};

	jQuery.extend({

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Handle when the DOM is ready
		ready: function ready(wait) {

			// Abort if there are pending holds or we're already ready
			if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if (wait !== true && --jQuery.readyWait > 0) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(document, [jQuery]);
		}
	});

	jQuery.ready.then = readyList.then;

	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener("DOMContentLoaded", completed);
		window.removeEventListener("load", completed);
		jQuery.ready();
	}

	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {

		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout(jQuery.ready);
	} else {

		// Use the handy event callback
		document.addEventListener("DOMContentLoaded", completed);

		// A fallback to window.onload, that will always work
		window.addEventListener("load", completed);
	}

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function access(elems, fn, key, value, chainable, emptyGet, raw) {
		var i = 0,
		    len = elems.length,
		    bulk = key == null;

		// Sets many values
		if (jQuery.type(key) === "object") {
			chainable = true;
			for (i in key) {
				access(elems, fn, i, key[i], true, emptyGet, raw);
			}

			// Sets one value
		} else if (value !== undefined) {
			chainable = true;

			if (!jQuery.isFunction(value)) {
				raw = true;
			}

			if (bulk) {

				// Bulk operations run against the entire set
				if (raw) {
					fn.call(elems, value);
					fn = null;

					// ...except when executing function values
				} else {
					bulk = fn;
					fn = function fn(elem, key, value) {
						return bulk.call(jQuery(elem), value);
					};
				}
			}

			if (fn) {
				for (; i < len; i++) {
					fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
				}
			}
		}

		if (chainable) {
			return elems;
		}

		// Gets
		if (bulk) {
			return fn.call(elems);
		}

		return len ? fn(elems[0], key) : emptyGet;
	};
	var acceptData = function acceptData(owner) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
	};

	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		cache: function cache(owner) {

			// Check if the owner object already has a cache
			var value = owner[this.expando];

			// If not, create one
			if (!value) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if (acceptData(owner)) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if (owner.nodeType) {
						owner[this.expando] = value;

						// Otherwise secure it in a non-enumerable property
						// configurable must be true to allow the property to be
						// deleted when data is removed
					} else {
						Object.defineProperty(owner, this.expando, {
							value: value,
							configurable: true
						});
					}
				}
			}

			return value;
		},
		set: function set(owner, data, value) {
			var prop,
			    cache = this.cache(owner);

			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if (typeof data === "string") {
				cache[jQuery.camelCase(data)] = value;

				// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for (prop in data) {
					cache[jQuery.camelCase(prop)] = data[prop];
				}
			}
			return cache;
		},
		get: function get(owner, key) {
			return key === undefined ? this.cache(owner) :

			// Always use camelCase key (gh-2257)
			owner[this.expando] && owner[this.expando][jQuery.camelCase(key)];
		},
		access: function access(owner, key, value) {

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undefined || key && typeof key === "string" && value === undefined) {

				return this.get(owner, key);
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function remove(owner, key) {
			var i,
			    cache = owner[this.expando];

			if (cache === undefined) {
				return;
			}

			if (key !== undefined) {

				// Support array or space separated string of keys
				if (Array.isArray(key)) {

					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map(jQuery.camelCase);
				} else {
					key = jQuery.camelCase(key);

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
				}

				i = key.length;

				while (i--) {
					delete cache[key[i]];
				}
			}

			// Remove the expando if there's no more data
			if (key === undefined || jQuery.isEmptyObject(cache)) {

				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if (owner.nodeType) {
					owner[this.expando] = undefined;
				} else {
					delete owner[this.expando];
				}
			}
		},
		hasData: function hasData(owner) {
			var cache = owner[this.expando];
			return cache !== undefined && !jQuery.isEmptyObject(cache);
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();

	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	    rmultiDash = /[A-Z]/g;

	function getData(data) {
		if (data === "true") {
			return true;
		}

		if (data === "false") {
			return false;
		}

		if (data === "null") {
			return null;
		}

		// Only convert to a number if it doesn't change the string
		if (data === +data + "") {
			return +data;
		}

		if (rbrace.test(data)) {
			return JSON.parse(data);
		}

		return data;
	}

	function dataAttr(elem, key, data) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {
			name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = getData(data);
				} catch (e) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend({
		hasData: function hasData(elem) {
			return dataUser.hasData(elem) || dataPriv.hasData(elem);
		},

		data: function data(elem, name, _data) {
			return dataUser.access(elem, name, _data);
		},

		removeData: function removeData(elem, name) {
			dataUser.remove(elem, name);
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function _data(elem, name, data) {
			return dataPriv.access(elem, name, data);
		},

		_removeData: function _removeData(elem, name) {
			dataPriv.remove(elem, name);
		}
	});

	jQuery.fn.extend({
		data: function data(key, value) {
			var i,
			    name,
			    data,
			    elem = this[0],
			    attrs = elem && elem.attributes;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					data = dataUser.get(elem);

					if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
						i = attrs.length;
						while (i--) {

							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if (attrs[i]) {
								name = attrs[i].name;
								if (name.indexOf("data-") === 0) {
									name = jQuery.camelCase(name.slice(5));
									dataAttr(elem, name, data[name]);
								}
							}
						}
						dataPriv.set(elem, "hasDataAttrs", true);
					}
				}

				return data;
			}

			// Sets multiple values
			if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
				return this.each(function () {
					dataUser.set(this, key);
				});
			}

			return access(this, function (value) {
				var data;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undefined) {

					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get(elem, key);
					if (data !== undefined) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr(elem, key);
					if (data !== undefined) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each(function () {

					// We always store the camelCased key
					dataUser.set(this, key, value);
				});
			}, null, value, arguments.length > 1, null, true);
		},

		removeData: function removeData(key) {
			return this.each(function () {
				dataUser.remove(this, key);
			});
		}
	});

	jQuery.extend({
		queue: function queue(elem, type, data) {
			var queue;

			if (elem) {
				type = (type || "fx") + "queue";
				queue = dataPriv.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || Array.isArray(data)) {
						queue = dataPriv.access(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function dequeue(elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type),
			    startLength = queue.length,
			    fn = queue.shift(),
			    hooks = jQuery._queueHooks(elem, type),
			    next = function next() {
				jQuery.dequeue(elem, type);
			};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === "fx") {
					queue.unshift("inprogress");
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function _queueHooks(elem, type) {
			var key = type + "queueHooks";
			return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
				empty: jQuery.Callbacks("once memory").add(function () {
					dataPriv.remove(elem, [type + "queue", key]);
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function queue(type, data) {
			var setter = 2;

			if (typeof type !== "string") {
				data = type;
				type = "fx";
				setter--;
			}

			if (arguments.length < setter) {
				return jQuery.queue(this[0], type);
			}

			return data === undefined ? this : this.each(function () {
				var queue = jQuery.queue(this, type, data);

				// Ensure a hooks for this queue
				jQuery._queueHooks(this, type);

				if (type === "fx" && queue[0] !== "inprogress") {
					jQuery.dequeue(this, type);
				}
			});
		},
		dequeue: function dequeue(type) {
			return this.each(function () {
				jQuery.dequeue(this, type);
			});
		},
		clearQueue: function clearQueue(type) {
			return this.queue(type || "fx", []);
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function promise(type, obj) {
			var tmp,
			    count = 1,
			    defer = jQuery.Deferred(),
			    elements = this,
			    i = this.length,
			    resolve = function resolve() {
				if (! --count) {
					defer.resolveWith(elements, [elements]);
				}
			};

			if (typeof type !== "string") {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while (i--) {
				tmp = dataPriv.get(elements[i], type + "queueHooks");
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});
	var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

	var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");

	var cssExpand = ["Top", "Right", "Bottom", "Left"];

	var isHiddenWithinTree = function isHiddenWithinTree(elem, el) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" || elem.style.display === "" &&

		// Otherwise, check computed style
		// Support: Firefox <=43 - 45
		// Disconnected elements can have computed display: none, so first confirm that elem is
		// in the document.
		jQuery.contains(elem.ownerDocument, elem) && jQuery.css(elem, "display") === "none";
	};

	var swap = function swap(elem, options, callback, args) {
		var ret,
		    name,
		    old = {};

		// Remember the old values, and insert the new ones
		for (name in options) {
			old[name] = elem.style[name];
			elem.style[name] = options[name];
		}

		ret = callback.apply(elem, args || []);

		// Revert the old values
		for (name in options) {
			elem.style[name] = old[name];
		}

		return ret;
	};

	function adjustCSS(elem, prop, valueParts, tween) {
		var adjusted,
		    scale = 1,
		    maxIterations = 20,
		    currentValue = tween ? function () {
			return tween.cur();
		} : function () {
			return jQuery.css(elem, prop, "");
		},
		    initial = currentValue(),
		    unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),


		// Starting value computation is required for potential unit mismatches
		initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));

		if (initialInUnit && initialInUnit[3] !== unit) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[3];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style(elem, prop, initialInUnit + unit);

				// Update scale, tolerating zero or NaN from tween.cur()
				// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations);
		}

		if (valueParts) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
			if (tween) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}

	var defaultDisplayMap = {};

	function getDefaultDisplay(elem) {
		var temp,
		    doc = elem.ownerDocument,
		    nodeName = elem.nodeName,
		    display = defaultDisplayMap[nodeName];

		if (display) {
			return display;
		}

		temp = doc.body.appendChild(doc.createElement(nodeName));
		display = jQuery.css(temp, "display");

		temp.parentNode.removeChild(temp);

		if (display === "none") {
			display = "block";
		}
		defaultDisplayMap[nodeName] = display;

		return display;
	}

	function showHide(elements, show) {
		var display,
		    elem,
		    values = [],
		    index = 0,
		    length = elements.length;

		// Determine new display value for elements that need to change
		for (; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}

			display = elem.style.display;
			if (show) {

				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if (display === "none") {
					values[index] = dataPriv.get(elem, "display") || null;
					if (!values[index]) {
						elem.style.display = "";
					}
				}
				if (elem.style.display === "" && isHiddenWithinTree(elem)) {
					values[index] = getDefaultDisplay(elem);
				}
			} else {
				if (display !== "none") {
					values[index] = "none";

					// Remember what we're overwriting
					dataPriv.set(elem, "display", display);
				}
			}
		}

		// Set the display of the elements in a second loop to avoid constant reflow
		for (index = 0; index < length; index++) {
			if (values[index] != null) {
				elements[index].style.display = values[index];
			}
		}

		return elements;
	}

	jQuery.fn.extend({
		show: function show() {
			return showHide(this, true);
		},
		hide: function hide() {
			return showHide(this);
		},
		toggle: function toggle(state) {
			if (typeof state === "boolean") {
				return state ? this.show() : this.hide();
			}

			return this.each(function () {
				if (isHiddenWithinTree(this)) {
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});
		}
	});
	var rcheckableType = /^(?:checkbox|radio)$/i;

	var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;

	var rscriptType = /^$|\/(?:java|ecma)script/i;

	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE <=9 only
		option: [1, "<select multiple='multiple'>", "</select>"],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

		_default: [0, "", ""]
	};

	// Support: IE <=9 only
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	function getAll(context, tag) {

		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret;

		if (typeof context.getElementsByTagName !== "undefined") {
			ret = context.getElementsByTagName(tag || "*");
		} else if (typeof context.querySelectorAll !== "undefined") {
			ret = context.querySelectorAll(tag || "*");
		} else {
			ret = [];
		}

		if (tag === undefined || tag && nodeName(context, tag)) {
			return jQuery.merge([context], ret);
		}

		return ret;
	}

	// Mark scripts as having already been evaluated
	function setGlobalEval(elems, refElements) {
		var i = 0,
		    l = elems.length;

		for (; i < l; i++) {
			dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
		}
	}

	var rhtml = /<|&#?\w+;/;

	function buildFragment(elems, context, scripts, selection, ignored) {
		var elem,
		    tmp,
		    tag,
		    wrap,
		    contains,
		    j,
		    fragment = context.createDocumentFragment(),
		    nodes = [],
		    i = 0,
		    l = elems.length;

		for (; i < l; i++) {
			elem = elems[i];

			if (elem || elem === 0) {

				// Add nodes directly
				if (jQuery.type(elem) === "object") {

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

					// Convert non-html into a text node
				} else if (!rhtml.test(elem)) {
					nodes.push(context.createTextNode(elem));

					// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild(context.createElement("div"));

					// Deserialize a standard representation
					tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
					wrap = wrapMap[tag] || wrapMap._default;
					tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while (j--) {
						tmp = tmp.lastChild;
					}

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, tmp.childNodes);

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while (elem = nodes[i++]) {

			// Skip elements already in the context collection (trac-4087)
			if (selection && jQuery.inArray(elem, selection) > -1) {
				if (ignored) {
					ignored.push(elem);
				}
				continue;
			}

			contains = jQuery.contains(elem.ownerDocument, elem);

			// Append to fragment
			tmp = getAll(fragment.appendChild(elem), "script");

			// Preserve script evaluation history
			if (contains) {
				setGlobalEval(tmp);
			}

			// Capture executables
			if (scripts) {
				j = 0;
				while (elem = tmp[j++]) {
					if (rscriptType.test(elem.type || "")) {
						scripts.push(elem);
					}
				}
			}
		}

		return fragment;
	}

	(function () {
		var fragment = document.createDocumentFragment(),
		    div = fragment.appendChild(document.createElement("div")),
		    input = document.createElement("input");

		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute("type", "radio");
		input.setAttribute("checked", "checked");
		input.setAttribute("name", "t");

		div.appendChild(input);

		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
	})();
	var documentElement = document.documentElement;

	var rkeyEvent = /^key/,
	    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE <=9 only
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}

	function _on(elem, types, selector, data, fn, one) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

			// ( types-Object, selector, data )
			if (typeof selector !== "string") {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for (type in types) {
				_on(elem, type, selector, data, types[type], one);
			}
			return elem;
		}

		if (data == null && fn == null) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if (fn == null) {
			if (typeof selector === "string") {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if (fn === false) {
			fn = returnFalse;
		} else if (!fn) {
			return elem;
		}

		if (one === 1) {
			origFn = fn;
			fn = function fn(event) {

				// Can use an empty set, since event contains the info
				jQuery().off(event);
				return origFn.apply(this, arguments);
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
		}
		return elem.each(function () {
			jQuery.event.add(this, types, fn, data, selector);
		});
	}

	/*
  * Helper functions for managing events -- not part of the public interface.
  * Props to Dean Edwards' addEvent library for many of the ideas.
  */
	jQuery.event = {

		global: {},

		add: function add(elem, types, handler, data, selector) {

			var handleObjIn,
			    eventHandle,
			    tmp,
			    events,
			    t,
			    handleObj,
			    special,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = dataPriv.get(elem);

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if (!elemData) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if (selector) {
				jQuery.find.matchesSelector(documentElement, selector);
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function (e) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// There *must* be a type, no attaching namespace-only handlers
				if (!type) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = (selector ? special.delegateType : special.bindType) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[type] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test(selector),
					namespace: namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				if (!(handlers = events[type])) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {

						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[type] = true;
			}
		},

		// Detach an event or set of events from an element
		remove: function remove(elem, types, handler, selector, mappedTypes) {

			var j,
			    origCount,
			    tmp,
			    events,
			    t,
			    handleObj,
			    special,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

			if (!elemData || !(events = elemData.events)) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// Unbind all events (on this namespace, if provided) for the element
				if (!type) {
					for (type in events) {
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = jQuery.event.special[type] || {};
				type = (selector ? special.delegateType : special.bindType) || type;
				handlers = events[type] || [];
				tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

				// Remove matching events
				origCount = j = handlers.length;
				while (j--) {
					handleObj = handlers[j];

					if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
						handlers.splice(j, 1);

						if (handleObj.selector) {
							handlers.delegateCount--;
						}
						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if (origCount && !handlers.length) {
					if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {

						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			// Remove data and the expando if it's no longer used
			if (jQuery.isEmptyObject(events)) {
				dataPriv.remove(elem, "handle events");
			}
		},

		dispatch: function dispatch(nativeEvent) {

			// Make a writable jQuery.Event from the native event object
			var event = jQuery.event.fix(nativeEvent);

			var i,
			    j,
			    ret,
			    matched,
			    handleObj,
			    handlerQueue,
			    args = new Array(arguments.length),
			    handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
			    special = jQuery.event.special[event.type] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;

			for (i = 1; i < arguments.length; i++) {
				args[i] = arguments[i];
			}

			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if (special.preDispatch && special.preDispatch.call(this, event) === false) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call(this, event, handlers);

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
				event.currentTarget = matched.elem;

				j = 0;
				while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

						if (ret !== undefined) {
							if ((event.result = ret) === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if (special.postDispatch) {
				special.postDispatch.call(this, event);
			}

			return event.result;
		},

		handlers: function handlers(event, _handlers) {
			var i,
			    handleObj,
			    sel,
			    matchedHandlers,
			    matchedSelectors,
			    handlerQueue = [],
			    delegateCount = _handlers.delegateCount,
			    cur = event.target;

			// Find delegate handlers
			if (delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!(event.type === "click" && event.button >= 1)) {

				for (; cur !== this; cur = cur.parentNode || this) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
						matchedHandlers = [];
						matchedSelectors = {};
						for (i = 0; i < delegateCount; i++) {
							handleObj = _handlers[i];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if (matchedSelectors[sel] === undefined) {
								matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
							}
							if (matchedSelectors[sel]) {
								matchedHandlers.push(handleObj);
							}
						}
						if (matchedHandlers.length) {
							handlerQueue.push({ elem: cur, handlers: matchedHandlers });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			cur = this;
			if (delegateCount < _handlers.length) {
				handlerQueue.push({ elem: cur, handlers: _handlers.slice(delegateCount) });
			}

			return handlerQueue;
		},

		addProp: function addProp(name, hook) {
			Object.defineProperty(jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,

				get: jQuery.isFunction(hook) ? function () {
					if (this.originalEvent) {
						return hook(this.originalEvent);
					}
				} : function () {
					if (this.originalEvent) {
						return this.originalEvent[name];
					}
				},

				set: function set(value) {
					Object.defineProperty(this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					});
				}
			});
		},

		fix: function fix(originalEvent) {
			return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function trigger() {
					if (this !== safeActiveElement() && this.focus) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function trigger() {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function trigger() {
					if (this.type === "checkbox" && this.click && nodeName(this, "input")) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function _default(event) {
					return nodeName(event.target, "a");
				}
			},

			beforeunload: {
				postDispatch: function postDispatch(event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undefined && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	jQuery.removeEvent = function (elem, type, handle) {

		// This "if" is needed for plain objects
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle);
		}
	};

	jQuery.Event = function (src, props) {

		// Allow instantiation without the 'new' keyword
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined &&

			// Support: Android <=2.3 only
			src.returnValue === false ? returnTrue : returnFalse;

			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;

			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;

			// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if (props) {
			jQuery.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[jQuery.expando] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function preventDefault() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if (e && !this.isSimulated) {
				e.preventDefault();
			}
		},
		stopPropagation: function stopPropagation() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function stopImmediatePropagation() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each({
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,

		which: function which(event) {
			var button = event.button;

			// Add which for key events
			if (event.which == null && rkeyEvent.test(event.type)) {
				return event.charCode != null ? event.charCode : event.keyCode;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
				if (button & 1) {
					return 1;
				}

				if (button & 2) {
					return 3;
				}

				if (button & 4) {
					return 2;
				}

				return 0;
			}

			return event.which;
		}
	}, jQuery.event.addProp);

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function (orig, fix) {
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function handle(event) {
				var ret,
				    target = this,
				    related = event.relatedTarget,
				    handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if (!related || related !== target && !jQuery.contains(target, related)) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	jQuery.fn.extend({

		on: function on(types, selector, data, fn) {
			return _on(this, types, selector, data, fn);
		},
		one: function one(types, selector, data, fn) {
			return _on(this, types, selector, data, fn, 1);
		},
		off: function off(types, selector, fn) {
			var handleObj, type;
			if (types && types.preventDefault && types.handleObj) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
				return this;
			}
			if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

				// ( types-object [, selector] )
				for (type in types) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if (selector === false || typeof selector === "function") {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function () {
				jQuery.event.remove(this, types, fn, selector);
			});
		}
	});

	var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,


	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,


	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	    rscriptTypeMasked = /^true\/(.*)/,
	    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	// Prefer a tbody over its parent table for containing new rows
	function manipulationTarget(elem, content) {
		if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {

			return jQuery(">tbody", elem)[0] || elem;
		}

		return elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript(elem) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript(elem) {
		var match = rscriptTypeMasked.exec(elem.type);

		if (match) {
			elem.type = match[1];
		} else {
			elem.removeAttribute("type");
		}

		return elem;
	}

	function cloneCopyEvent(src, dest) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if (dest.nodeType !== 1) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if (dataPriv.hasData(src)) {
			pdataOld = dataPriv.access(src);
			pdataCur = dataPriv.set(dest, pdataOld);
			events = pdataOld.events;

			if (events) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for (type in events) {
					for (i = 0, l = events[type].length; i < l; i++) {
						jQuery.event.add(dest, type, events[type][i]);
					}
				}
			}
		}

		// 2. Copy user data
		if (dataUser.hasData(src)) {
			udataOld = dataUser.access(src);
			udataCur = jQuery.extend({}, udataOld);

			dataUser.set(dest, udataCur);
		}
	}

	// Fix IE bugs, see support tests
	function fixInput(src, dest) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if (nodeName === "input" && rcheckableType.test(src.type)) {
			dest.checked = src.checked;

			// Fails to return the selected option to the default selected state when cloning options
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip(collection, args, callback, ignored) {

		// Flatten any nested arrays
		args = concat.apply([], args);

		var fragment,
		    first,
		    scripts,
		    hasScripts,
		    node,
		    doc,
		    i = 0,
		    l = collection.length,
		    iNoClone = l - 1,
		    value = args[0],
		    isFunction = jQuery.isFunction(value);

		// We can't cloneNode fragments that contain checked, in WebKit
		if (isFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
			return collection.each(function (index) {
				var self = collection.eq(index);
				if (isFunction) {
					args[0] = value.call(this, index, self.html());
				}
				domManip(self, args, callback, ignored);
			});
		}

		if (l) {
			fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
			first = fragment.firstChild;

			if (fragment.childNodes.length === 1) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if (first || ignored) {
				scripts = jQuery.map(getAll(fragment, "script"), disableScript);
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for (; i < l; i++) {
					node = fragment;

					if (i !== iNoClone) {
						node = jQuery.clone(node, true, true);

						// Keep references to cloned scripts for later restoration
						if (hasScripts) {

							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge(scripts, getAll(node, "script"));
						}
					}

					callback.call(collection[i], node, i);
				}

				if (hasScripts) {
					doc = scripts[scripts.length - 1].ownerDocument;

					// Reenable scripts
					jQuery.map(scripts, restoreScript);

					// Evaluate executable scripts on first document insertion
					for (i = 0; i < hasScripts; i++) {
						node = scripts[i];
						if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {

							if (node.src) {

								// Optional AJAX dependency, but won't run scripts if not present
								if (jQuery._evalUrl) {
									jQuery._evalUrl(node.src);
								}
							} else {
								DOMEval(node.textContent.replace(rcleanScript, ""), doc);
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function _remove(elem, selector, keepData) {
		var node,
		    nodes = selector ? jQuery.filter(selector, elem) : elem,
		    i = 0;

		for (; (node = nodes[i]) != null; i++) {
			if (!keepData && node.nodeType === 1) {
				jQuery.cleanData(getAll(node));
			}

			if (node.parentNode) {
				if (keepData && jQuery.contains(node.ownerDocument, node)) {
					setGlobalEval(getAll(node, "script"));
				}
				node.parentNode.removeChild(node);
			}
		}

		return elem;
	}

	jQuery.extend({
		htmlPrefilter: function htmlPrefilter(html) {
			return html.replace(rxhtmlTag, "<$1></$2>");
		},

		clone: function clone(elem, dataAndEvents, deepDataAndEvents) {
			var i,
			    l,
			    srcElements,
			    destElements,
			    clone = elem.cloneNode(true),
			    inPage = jQuery.contains(elem.ownerDocument, elem);

			// Fix IE cloning issues
			if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll(clone);
				srcElements = getAll(elem);

				for (i = 0, l = srcElements.length; i < l; i++) {
					fixInput(srcElements[i], destElements[i]);
				}
			}

			// Copy the events from the original to the clone
			if (dataAndEvents) {
				if (deepDataAndEvents) {
					srcElements = srcElements || getAll(elem);
					destElements = destElements || getAll(clone);

					for (i = 0, l = srcElements.length; i < l; i++) {
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				} else {
					cloneCopyEvent(elem, clone);
				}
			}

			// Preserve script evaluation history
			destElements = getAll(clone, "script");
			if (destElements.length > 0) {
				setGlobalEval(destElements, !inPage && getAll(elem, "script"));
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function cleanData(elems) {
			var data,
			    elem,
			    type,
			    special = jQuery.event.special,
			    i = 0;

			for (; (elem = elems[i]) !== undefined; i++) {
				if (acceptData(elem)) {
					if (data = elem[dataPriv.expando]) {
						if (data.events) {
							for (type in data.events) {
								if (special[type]) {
									jQuery.event.remove(elem, type);

									// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent(elem, type, data.handle);
								}
							}
						}

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataPriv.expando] = undefined;
					}
					if (elem[dataUser.expando]) {

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataUser.expando] = undefined;
					}
				}
			}
		}
	});

	jQuery.fn.extend({
		detach: function detach(selector) {
			return _remove(this, selector, true);
		},

		remove: function remove(selector) {
			return _remove(this, selector);
		},

		text: function text(value) {
			return access(this, function (value) {
				return value === undefined ? jQuery.text(this) : this.empty().each(function () {
					if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
						this.textContent = value;
					}
				});
			}, null, value, arguments.length);
		},

		append: function append() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},

		prepend: function prepend() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild);
				}
			});
		},

		before: function before() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this);
				}
			});
		},

		after: function after() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				}
			});
		},

		empty: function empty() {
			var elem,
			    i = 0;

			for (; (elem = this[i]) != null; i++) {
				if (elem.nodeType === 1) {

					// Prevent memory leaks
					jQuery.cleanData(getAll(elem, false));

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function clone(dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function () {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html: function html(value) {
			return access(this, function (value) {
				var elem = this[0] || {},
				    i = 0,
				    l = this.length;

				if (value === undefined && elem.nodeType === 1) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

					value = jQuery.htmlPrefilter(value);

					try {
						for (; i < l; i++) {
							elem = this[i] || {};

							// Remove element nodes and prevent memory leaks
							if (elem.nodeType === 1) {
								jQuery.cleanData(getAll(elem, false));
								elem.innerHTML = value;
							}
						}

						elem = 0;

						// If using innerHTML throws an exception, use the fallback method
					} catch (e) {}
				}

				if (elem) {
					this.empty().append(value);
				}
			}, null, value, arguments.length);
		},

		replaceWith: function replaceWith() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip(this, arguments, function (elem) {
				var parent = this.parentNode;

				if (jQuery.inArray(this, ignored) < 0) {
					jQuery.cleanData(getAll(this));
					if (parent) {
						parent.replaceChild(elem, this);
					}
				}

				// Force callback invocation
			}, ignored);
		}
	});

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (name, original) {
		jQuery.fn[name] = function (selector) {
			var elems,
			    ret = [],
			    insert = jQuery(selector),
			    last = insert.length - 1,
			    i = 0;

			for (; i <= last; i++) {
				elems = i === last ? this : this.clone(true);
				jQuery(insert[i])[original](elems);

				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply(ret, elems.get());
			}

			return this.pushStack(ret);
		};
	});
	var rmargin = /^margin/;

	var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

	var getStyles = function getStyles(elem) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if (!view || !view.opener) {
			view = window;
		}

		return view.getComputedStyle(elem);
	};

	(function () {

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {

			// This is a singleton, we need to execute it only once
			if (!div) {
				return;
			}

			div.style.cssText = "box-sizing:border-box;" + "position:relative;display:block;" + "margin:auto;border:1px;padding:1px;" + "top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild(container);

			var divStyle = window.getComputedStyle(div);
			pixelPositionVal = divStyle.top !== "1%";

			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";

			documentElement.removeChild(container);

			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}

		var pixelPositionVal,
		    boxSizingReliableVal,
		    pixelMarginRightVal,
		    reliableMarginLeftVal,
		    container = document.createElement("div"),
		    div = document.createElement("div");

		// Finish early in limited (non-browser) environments
		if (!div.style) {
			return;
		}

		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode(true).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" + "padding:0;margin-top:1px;position:absolute";
		container.appendChild(div);

		jQuery.extend(support, {
			pixelPosition: function pixelPosition() {
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function boxSizingReliable() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelMarginRight: function pixelMarginRight() {
				computeStyleTests();
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function reliableMarginLeft() {
				computeStyleTests();
				return reliableMarginLeftVal;
			}
		});
	})();

	function curCSS(elem, name, computed) {
		var width,
		    minWidth,
		    maxWidth,
		    ret,


		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

		computed = computed || getStyles(elem);

		// getPropertyValue is needed for:
		//   .css('filter') (IE 9 only, #12537)
		//   .css('--customProperty) (#3144)
		if (computed) {
			ret = computed.getPropertyValue(name) || computed[name];

			if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
				ret = jQuery.style(elem, name);
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" : ret;
	}

	function addGetHookIf(conditionFn, hookFn) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function get() {
				if (conditionFn()) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return (this.get = hookFn).apply(this, arguments);
			}
		};
	}

	var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	    rcustomProp = /^--/,
	    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	    cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},
	    cssPrefixes = ["Webkit", "Moz", "ms"],
	    emptyStyle = document.createElement("div").style;

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName(name) {

		// Shortcut for names that are not vendor prefixed
		if (name in emptyStyle) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[0].toUpperCase() + name.slice(1),
		    i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;
			if (name in emptyStyle) {
				return name;
			}
		}
	}

	// Return a property mapped along what jQuery.cssProps suggests or to
	// a vendor prefixed property.
	function finalPropName(name) {
		var ret = jQuery.cssProps[name];
		if (!ret) {
			ret = jQuery.cssProps[name] = vendorPropName(name) || name;
		}
		return ret;
	}

	function setPositiveNumber(elem, value, subtract) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec(value);
		return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
	}

	function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		var i,
		    val = 0;

		// If we already have the right measurement, avoid augmentation
		if (extra === (isBorderBox ? "border" : "content")) {
			i = 4;

			// Otherwise initialize for horizontal or vertical properties
		} else {
			i = name === "width" ? 1 : 0;
		}

		for (; i < 4; i += 2) {

			// Both box models exclude margin, so add it if we want it
			if (extra === "margin") {
				val += jQuery.css(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {

				// border-box includes padding, so remove it if we want content
				if (extra === "content") {
					val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
				}

				// At this point, extra isn't border nor margin, so remove border
				if (extra !== "margin") {
					val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			} else {

				// At this point, extra isn't content, so add padding
				val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

				// At this point, extra isn't content nor padding, so add border
				if (extra !== "padding") {
					val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(elem, name, extra) {

		// Start with computed style
		var valueIsBorderBox,
		    styles = getStyles(elem),
		    val = curCSS(elem, name, styles),
		    isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";

		// Computed unit is not pixels. Stop here and return.
		if (rnumnonpx.test(val)) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);

		// Fall back to offsetWidth/Height when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		if (val === "auto") {
			val = elem["offset" + name[0].toUpperCase() + name.slice(1)];
		}

		// Normalize "", auto, and prepare for extra
		val = parseFloat(val) || 0;

		// Use the active box-sizing model to add/subtract irrelevant styles
		return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
	}

	jQuery.extend({

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function get(elem, computed) {
					if (computed) {

						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function style(elem, name, value, extra) {

			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret,
			    type,
			    hooks,
			    origName = jQuery.camelCase(name),
			    isCustomProp = rcustomProp.test(name),
			    style = elem.style;

			// Make sure that we're working with the right name. We don't
			// want to query the value if it is a CSS custom property
			// since they are user-defined.
			if (!isCustomProp) {
				name = finalPropName(origName);
			}

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof value === "undefined" ? "undefined" : _typeof(value);

				// Convert "+=" or "-=" to relative numbers (#7345)
				if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
					value = adjustCSS(elem, name, ret);

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if (value == null || value !== value) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if (type === "number") {
					value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
				}

				// background-* props affect original clone's values
				if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
					style[name] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {

					if (isCustomProp) {
						style.setProperty(name, value);
					} else {
						style[name] = value;
					}
				}
			} else {

				// If a hook was provided get the non-computed value from there
				if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		css: function css(elem, name, extra, styles) {
			var val,
			    num,
			    hooks,
			    origName = jQuery.camelCase(name),
			    isCustomProp = rcustomProp.test(name);

			// Make sure that we're working with the right name. We don't
			// want to modify the value if it is a CSS custom property
			// since they are user-defined.
			if (!isCustomProp) {
				name = finalPropName(origName);
			}

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if (val === undefined) {
				val = curCSS(elem, name, styles);
			}

			// Convert "normal" to computed value
			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || isFinite(num) ? num || 0 : val;
			}

			return val;
		}
	});

	jQuery.each(["height", "width"], function (i, name) {
		jQuery.cssHooks[name] = {
			get: function get(elem, computed, extra) {
				if (computed) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test(jQuery.css(elem, "display")) && (

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function () {
						return getWidthOrHeight(elem, name, extra);
					}) : getWidthOrHeight(elem, name, extra);
				}
			},

			set: function set(elem, value, extra) {
				var matches,
				    styles = extra && getStyles(elem),
				    subtract = extra && augmentWidthOrHeight(elem, name, extra, jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles);

				// Convert to pixels if value adjustment is needed
				if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {

					elem.style[name] = value;
					value = jQuery.css(elem, name);
				}

				return setPositiveNumber(elem, value, subtract);
			}
		};
	});

	jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
		if (computed) {
			return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function () {
				return elem.getBoundingClientRect().left;
			})) + "px";
		}
	});

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function (prefix, suffix) {
		jQuery.cssHooks[prefix + suffix] = {
			expand: function expand(value) {
				var i = 0,
				    expanded = {},


				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [value];

				for (; i < 4; i++) {
					expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
				}

				return expanded;
			}
		};

		if (!rmargin.test(prefix)) {
			jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
		}
	});

	jQuery.fn.extend({
		css: function css(name, value) {
			return access(this, function (elem, name, value) {
				var styles,
				    len,
				    map = {},
				    i = 0;

				if (Array.isArray(name)) {
					styles = getStyles(elem);
					len = name.length;

					for (; i < len; i++) {
						map[name[i]] = jQuery.css(elem, name[i], false, styles);
					}

					return map;
				}

				return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
			}, name, value, arguments.length > 1);
		}
	});

	function Tween(elem, options, prop, end, easing) {
		return new Tween.prototype.init(elem, options, prop, end, easing);
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function init(elem, options, prop, end, easing, unit) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
		},
		cur: function cur() {
			var hooks = Tween.propHooks[this.prop];

			return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
		},
		run: function run(percent) {
			var eased,
			    hooks = Tween.propHooks[this.prop];

			if (this.options.duration) {
				this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
			} else {
				this.pos = eased = percent;
			}
			this.now = (this.end - this.start) * eased + this.start;

			if (this.options.step) {
				this.options.step.call(this.elem, this.now, this);
			}

			if (hooks && hooks.set) {
				hooks.set(this);
			} else {
				Tween.propHooks._default.set(this);
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function get(tween) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
					return tween.elem[tween.prop];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css(tween.elem, tween.prop, "");

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function set(tween) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if (jQuery.fx.step[tween.prop]) {
					jQuery.fx.step[tween.prop](tween);
				} else if (tween.elem.nodeType === 1 && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
					jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
				} else {
					tween.elem[tween.prop] = tween.now;
				}
			}
		}
	};

	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function set(tween) {
			if (tween.elem.nodeType && tween.elem.parentNode) {
				tween.elem[tween.prop] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function linear(p) {
			return p;
		},
		swing: function swing(p) {
			return 0.5 - Math.cos(p * Math.PI) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back compat <1.8 extension point
	jQuery.fx.step = {};

	var fxNow,
	    inProgress,
	    rfxtypes = /^(?:toggle|show|hide)$/,
	    rrun = /queueHooks$/;

	function schedule() {
		if (inProgress) {
			if (document.hidden === false && window.requestAnimationFrame) {
				window.requestAnimationFrame(schedule);
			} else {
				window.setTimeout(schedule, jQuery.fx.interval);
			}

			jQuery.fx.tick();
		}
	}

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout(function () {
			fxNow = undefined;
		});
		return fxNow = jQuery.now();
	}

	// Generate parameters to create a standard animation
	function genFx(type, includeWidth) {
		var which,
		    i = 0,
		    attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for (; i < 4; i += 2 - includeWidth) {
			which = cssExpand[i];
			attrs["margin" + which] = attrs["padding" + which] = type;
		}

		if (includeWidth) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween(value, prop, animation) {
		var tween,
		    collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
		    index = 0,
		    length = collection.length;
		for (; index < length; index++) {
			if (tween = collection[index].call(animation, prop, value)) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter(elem, props, opts) {
		var prop,
		    value,
		    toggle,
		    hooks,
		    oldfire,
		    propTween,
		    restoreDisplay,
		    display,
		    isBox = "width" in props || "height" in props,
		    anim = this,
		    orig = {},
		    style = elem.style,
		    hidden = elem.nodeType && isHiddenWithinTree(elem),
		    dataShow = dataPriv.get(elem, "fxshow");

		// Queue-skipping animations hijack the fx hooks
		if (!opts.queue) {
			hooks = jQuery._queueHooks(elem, "fx");
			if (hooks.unqueued == null) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function () {
					if (!hooks.unqueued) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function () {

				// Ensure the complete handler is called before this completes
				anim.always(function () {
					hooks.unqueued--;
					if (!jQuery.queue(elem, "fx").length) {
						hooks.empty.fire();
					}
				});
			});
		}

		// Detect show/hide animations
		for (prop in props) {
			value = props[prop];
			if (rfxtypes.test(value)) {
				delete props[prop];
				toggle = toggle || value === "toggle";
				if (value === (hidden ? "hide" : "show")) {

					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if (value === "show" && dataShow && dataShow[prop] !== undefined) {
						hidden = true;

						// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
			}
		}

		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject(props);
		if (!propTween && jQuery.isEmptyObject(orig)) {
			return;
		}

		// Restrict "overflow" and "display" styles during box animations
		if (isBox && elem.nodeType === 1) {

			// Support: IE <=9 - 11, Edge 12 - 13
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY
			opts.overflow = [style.overflow, style.overflowX, style.overflowY];

			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if (restoreDisplay == null) {
				restoreDisplay = dataPriv.get(elem, "display");
			}
			display = jQuery.css(elem, "display");
			if (display === "none") {
				if (restoreDisplay) {
					display = restoreDisplay;
				} else {

					// Get nonempty value(s) by temporarily forcing visibility
					showHide([elem], true);
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css(elem, "display");
					showHide([elem]);
				}
			}

			// Animate inline elements as inline-block
			if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
				if (jQuery.css(elem, "float") === "none") {

					// Restore the original display value at the end of pure show/hide animations
					if (!propTween) {
						anim.done(function () {
							style.display = restoreDisplay;
						});
						if (restoreDisplay == null) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}

		if (opts.overflow) {
			style.overflow = "hidden";
			anim.always(function () {
				style.overflow = opts.overflow[0];
				style.overflowX = opts.overflow[1];
				style.overflowY = opts.overflow[2];
			});
		}

		// Implement show/hide animations
		propTween = false;
		for (prop in orig) {

			// General show/hide setup for this element animation
			if (!propTween) {
				if (dataShow) {
					if ("hidden" in dataShow) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
				}

				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if (toggle) {
					dataShow.hidden = !hidden;
				}

				// Show elements before animating them
				if (hidden) {
					showHide([elem], true);
				}

				/* eslint-disable no-loop-func */

				anim.done(function () {

					/* eslint-enable no-loop-func */

					// The final step of a "hide" animation is actually hiding the element
					if (!hidden) {
						showHide([elem]);
					}
					dataPriv.remove(elem, "fxshow");
					for (prop in orig) {
						jQuery.style(elem, prop, orig[prop]);
					}
				});
			}

			// Per-property setup
			propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
			if (!(prop in dataShow)) {
				dataShow[prop] = propTween.start;
				if (hidden) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}

	function propFilter(props, specialEasing) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for (index in props) {
			name = jQuery.camelCase(index);
			easing = specialEasing[name];
			value = props[index];
			if (Array.isArray(value)) {
				easing = value[1];
				value = props[index] = value[0];
			}

			if (index !== name) {
				props[name] = value;
				delete props[index];
			}

			hooks = jQuery.cssHooks[name];
			if (hooks && "expand" in hooks) {
				value = hooks.expand(value);
				delete props[name];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for (index in value) {
					if (!(index in props)) {
						props[index] = value[index];
						specialEasing[index] = easing;
					}
				}
			} else {
				specialEasing[name] = easing;
			}
		}
	}

	function Animation(elem, properties, options) {
		var result,
		    stopped,
		    index = 0,
		    length = Animation.prefilters.length,
		    deferred = jQuery.Deferred().always(function () {

			// Don't match elem in the :animated selector
			delete tick.elem;
		}),
		    tick = function tick() {
			if (stopped) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
			    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),


			// Support: Android 2.3 only
			// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
			temp = remaining / animation.duration || 0,
			    percent = 1 - temp,
			    index = 0,
			    length = animation.tweens.length;

			for (; index < length; index++) {
				animation.tweens[index].run(percent);
			}

			deferred.notifyWith(elem, [animation, percent, remaining]);

			// If there's more to do, yield
			if (percent < 1 && length) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if (!length) {
				deferred.notifyWith(elem, [animation, 1, 0]);
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith(elem, [animation]);
			return false;
		},
		    animation = deferred.promise({
			elem: elem,
			props: jQuery.extend({}, properties),
			opts: jQuery.extend(true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function createTween(prop, end) {
				var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
				animation.tweens.push(tween);
				return tween;
			},
			stop: function stop(gotoEnd) {
				var index = 0,


				// If we are going to the end, we want to run all the tweens
				// otherwise we skip this part
				length = gotoEnd ? animation.tweens.length : 0;
				if (stopped) {
					return this;
				}
				stopped = true;
				for (; index < length; index++) {
					animation.tweens[index].run(1);
				}

				// Resolve when we played the last frame; otherwise, reject
				if (gotoEnd) {
					deferred.notifyWith(elem, [animation, 1, 0]);
					deferred.resolveWith(elem, [animation, gotoEnd]);
				} else {
					deferred.rejectWith(elem, [animation, gotoEnd]);
				}
				return this;
			}
		}),
		    props = animation.props;

		propFilter(props, animation.opts.specialEasing);

		for (; index < length; index++) {
			result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
			if (result) {
				if (jQuery.isFunction(result.stop)) {
					jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(result.stop, result);
				}
				return result;
			}
		}

		jQuery.map(props, createTween, animation);

		if (jQuery.isFunction(animation.opts.start)) {
			animation.opts.start.call(elem, animation);
		}

		// Attach callbacks from options
		animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);

		jQuery.fx.timer(jQuery.extend(tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		}));

		return animation;
	}

	jQuery.Animation = jQuery.extend(Animation, {

		tweeners: {
			"*": [function (prop, value) {
				var tween = this.createTween(prop, value);
				adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
				return tween;
			}]
		},

		tweener: function tweener(props, callback) {
			if (jQuery.isFunction(props)) {
				callback = props;
				props = ["*"];
			} else {
				props = props.match(rnothtmlwhite);
			}

			var prop,
			    index = 0,
			    length = props.length;

			for (; index < length; index++) {
				prop = props[index];
				Animation.tweeners[prop] = Animation.tweeners[prop] || [];
				Animation.tweeners[prop].unshift(callback);
			}
		},

		prefilters: [defaultPrefilter],

		prefilter: function prefilter(callback, prepend) {
			if (prepend) {
				Animation.prefilters.unshift(callback);
			} else {
				Animation.prefilters.push(callback);
			}
		}
	});

	jQuery.speed = function (speed, easing, fn) {
		var opt = speed && (typeof speed === "undefined" ? "undefined" : _typeof(speed)) === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		// Go to the end state if fx are off
		if (jQuery.fx.off) {
			opt.duration = 0;
		} else {
			if (typeof opt.duration !== "number") {
				if (opt.duration in jQuery.fx.speeds) {
					opt.duration = jQuery.fx.speeds[opt.duration];
				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}

		// Normalize opt.queue - true/undefined/null -> "fx"
		if (opt.queue == null || opt.queue === true) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function () {
			if (jQuery.isFunction(opt.old)) {
				opt.old.call(this);
			}

			if (opt.queue) {
				jQuery.dequeue(this, opt.queue);
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function fadeTo(speed, to, easing, callback) {

			// Show any hidden elements after setting opacity to 0
			return this.filter(isHiddenWithinTree).css("opacity", 0).show()

			// Animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback);
		},
		animate: function animate(prop, speed, easing, callback) {
			var empty = jQuery.isEmptyObject(prop),
			    optall = jQuery.speed(speed, easing, callback),
			    doAnimation = function doAnimation() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation(this, jQuery.extend({}, prop), optall);

				// Empty animations, or finishing resolves immediately
				if (empty || dataPriv.get(this, "finish")) {
					anim.stop(true);
				}
			};
			doAnimation.finish = doAnimation;

			return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
		},
		stop: function stop(type, clearQueue, gotoEnd) {
			var stopQueue = function stopQueue(hooks) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop(gotoEnd);
			};

			if (typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function () {
				var dequeue = true,
				    index = type != null && type + "queueHooks",
				    timers = jQuery.timers,
				    data = dataPriv.get(this);

				if (index) {
					if (data[index] && data[index].stop) {
						stopQueue(data[index]);
					}
				} else {
					for (index in data) {
						if (data[index] && data[index].stop && rrun.test(index)) {
							stopQueue(data[index]);
						}
					}
				}

				for (index = timers.length; index--;) {
					if (timers[index].elem === this && (type == null || timers[index].queue === type)) {

						timers[index].anim.stop(gotoEnd);
						dequeue = false;
						timers.splice(index, 1);
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if (dequeue || !gotoEnd) {
					jQuery.dequeue(this, type);
				}
			});
		},
		finish: function finish(type) {
			if (type !== false) {
				type = type || "fx";
			}
			return this.each(function () {
				var index,
				    data = dataPriv.get(this),
				    queue = data[type + "queue"],
				    hooks = data[type + "queueHooks"],
				    timers = jQuery.timers,
				    length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue(this, type, []);

				if (hooks && hooks.stop) {
					hooks.stop.call(this, true);
				}

				// Look for any active animations, and finish them
				for (index = timers.length; index--;) {
					if (timers[index].elem === this && timers[index].queue === type) {
						timers[index].anim.stop(true);
						timers.splice(index, 1);
					}
				}

				// Look for any animations in the old queue and finish them
				for (index = 0; index < length; index++) {
					if (queue[index] && queue[index].finish) {
						queue[index].finish.call(this);
					}
				}

				// Turn off finishing flag
				delete data.finish;
			});
		}
	});

	jQuery.each(["toggle", "show", "hide"], function (i, name) {
		var cssFn = jQuery.fn[name];
		jQuery.fn[name] = function (speed, easing, callback) {
			return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
		};
	});

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function (name, props) {
		jQuery.fn[name] = function (speed, easing, callback) {
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.timers = [];
	jQuery.fx.tick = function () {
		var timer,
		    i = 0,
		    timers = jQuery.timers;

		fxNow = jQuery.now();

		for (; i < timers.length; i++) {
			timer = timers[i];

			// Run the timer and safely remove it when done (allowing for external removal)
			if (!timer() && timers[i] === timer) {
				timers.splice(i--, 1);
			}
		}

		if (!timers.length) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function (timer) {
		jQuery.timers.push(timer);
		jQuery.fx.start();
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function () {
		if (inProgress) {
			return;
		}

		inProgress = true;
		schedule();
	};

	jQuery.fx.stop = function () {
		inProgress = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};

	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function (time, type) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue(type, function (next, hooks) {
			var timeout = window.setTimeout(next, time);
			hooks.stop = function () {
				window.clearTimeout(timeout);
			};
		});
	};

	(function () {
		var input = document.createElement("input"),
		    select = document.createElement("select"),
		    opt = select.appendChild(document.createElement("option"));

		input.type = "checkbox";

		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement("input");
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	})();

	var boolHook,
	    attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend({
		attr: function attr(name, value) {
			return access(this, jQuery.attr, name, value, arguments.length > 1);
		},

		removeAttr: function removeAttr(name) {
			return this.each(function () {
				jQuery.removeAttr(this, name);
			});
		}
	});

	jQuery.extend({
		attr: function attr(elem, name, value) {
			var ret,
			    hooks,
			    nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if (typeof elem.getAttribute === "undefined") {
				return jQuery.prop(elem, name, value);
			}

			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
				hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
			}

			if (value !== undefined) {
				if (value === null) {
					jQuery.removeAttr(elem, name);
					return;
				}

				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				elem.setAttribute(name, value + "");
				return value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			ret = jQuery.find.attr(elem, name);

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function set(elem, value) {
					if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
						var val = elem.value;
						elem.setAttribute("type", value);
						if (val) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function removeAttr(elem, value) {
			var name,
			    i = 0,


			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match(rnothtmlwhite);

			if (attrNames && elem.nodeType === 1) {
				while (name = attrNames[i++]) {
					elem.removeAttribute(name);
				}
			}
		}
	});

	// Hooks for boolean attributes
	boolHook = {
		set: function set(elem, value, name) {
			if (value === false) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr(elem, name);
			} else {
				elem.setAttribute(name, name);
			}
			return name;
		}
	};

	jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
		var getter = attrHandle[name] || jQuery.find.attr;

		attrHandle[name] = function (elem, name, isXML) {
			var ret,
			    handle,
			    lowercaseName = name.toLowerCase();

			if (!isXML) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[lowercaseName];
				attrHandle[lowercaseName] = ret;
				ret = getter(elem, name, isXML) != null ? lowercaseName : null;
				attrHandle[lowercaseName] = handle;
			}
			return ret;
		};
	});

	var rfocusable = /^(?:input|select|textarea|button)$/i,
	    rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend({
		prop: function prop(name, value) {
			return access(this, jQuery.prop, name, value, arguments.length > 1);
		},

		removeProp: function removeProp(name) {
			return this.each(function () {
				delete this[jQuery.propFix[name] || name];
			});
		}
	});

	jQuery.extend({
		prop: function prop(elem, name, value) {
			var ret,
			    hooks,
			    nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {

				// Fix name and attach hooks
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				return elem[name] = value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			return elem[name];
		},

		propHooks: {
			tabIndex: {
				get: function get(elem) {

					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr(elem, "tabindex");

					if (tabindex) {
						return parseInt(tabindex, 10);
					}

					if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
						return 0;
					}

					return -1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	});

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if (!support.optSelected) {
		jQuery.propHooks.selected = {
			get: function get(elem) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if (parent && parent.parentNode) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function set(elem) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if (parent) {
					parent.selectedIndex;

					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
		jQuery.propFix[this.toLowerCase()] = this;
	});

	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse(value) {
		var tokens = value.match(rnothtmlwhite) || [];
		return tokens.join(" ");
	}

	function getClass(elem) {
		return elem.getAttribute && elem.getAttribute("class") || "";
	}

	jQuery.fn.extend({
		addClass: function addClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).addClass(value.call(this, j, getClass(this)));
				});
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnothtmlwhite) || [];

				while (elem = this[i++]) {
					curValue = getClass(elem);
					cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		removeClass: function removeClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).removeClass(value.call(this, j, getClass(this)));
				});
			}

			if (!arguments.length) {
				return this.attr("class", "");
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnothtmlwhite) || [];

				while (elem = this[i++]) {
					curValue = getClass(elem);

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {

							// Remove *all* instances
							while (cur.indexOf(" " + clazz + " ") > -1) {
								cur = cur.replace(" " + clazz + " ", " ");
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		toggleClass: function toggleClass(value, stateVal) {
			var type = typeof value === "undefined" ? "undefined" : _typeof(value);

			if (typeof stateVal === "boolean" && type === "string") {
				return stateVal ? this.addClass(value) : this.removeClass(value);
			}

			if (jQuery.isFunction(value)) {
				return this.each(function (i) {
					jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
				});
			}

			return this.each(function () {
				var className, i, self, classNames;

				if (type === "string") {

					// Toggle individual class names
					i = 0;
					self = jQuery(this);
					classNames = value.match(rnothtmlwhite) || [];

					while (className = classNames[i++]) {

						// Check each className given, space separated list
						if (self.hasClass(className)) {
							self.removeClass(className);
						} else {
							self.addClass(className);
						}
					}

					// Toggle whole class name
				} else if (value === undefined || type === "boolean") {
					className = getClass(this);
					if (className) {

						// Store className if set
						dataPriv.set(this, "__className__", className);
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if (this.setAttribute) {
						this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
					}
				}
			});
		},

		hasClass: function hasClass(selector) {
			var className,
			    elem,
			    i = 0;

			className = " " + selector + " ";
			while (elem = this[i++]) {
				if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
					return true;
				}
			}

			return false;
		}
	});

	var rreturn = /\r/g;

	jQuery.fn.extend({
		val: function val(value) {
			var hooks,
			    ret,
			    isFunction,
			    elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

					if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
						return ret;
					}

					ret = elem.value;

					// Handle most common string cases
					if (typeof ret === "string") {
						return ret.replace(rreturn, "");
					}

					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);

			return this.each(function (i) {
				var val;

				if (this.nodeType !== 1) {
					return;
				}

				if (isFunction) {
					val = value.call(this, i, jQuery(this).val());
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if (val == null) {
					val = "";
				} else if (typeof val === "number") {
					val += "";
				} else if (Array.isArray(val)) {
					val = jQuery.map(val, function (value) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

				// If set returns undefined, fall back to normal setting
				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function get(elem) {

					var val = jQuery.find.attr(elem, "value");
					return val != null ? val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse(jQuery.text(elem));
				}
			},
			select: {
				get: function get(elem) {
					var value,
					    option,
					    i,
					    options = elem.options,
					    index = elem.selectedIndex,
					    one = elem.type === "select-one",
					    values = one ? null : [],
					    max = one ? index + 1 : options.length;

					if (index < 0) {
						i = max;
					} else {
						i = one ? index : 0;
					}

					// Loop through all the selected options
					for (; i < max; i++) {
						option = options[i];

						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ((option.selected || i === index) &&

						// Don't return options that are disabled or in a disabled optgroup
						!option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if (one) {
								return value;
							}

							// Multi-Selects return an array
							values.push(value);
						}
					}

					return values;
				},

				set: function set(elem, value) {
					var optionSet,
					    option,
					    options = elem.options,
					    values = jQuery.makeArray(value),
					    i = options.length;

					while (i--) {
						option = options[i];

						/* eslint-disable no-cond-assign */

						if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
							optionSet = true;
						}

						/* eslint-enable no-cond-assign */
					}

					// Force browsers to behave consistently when non-matching value is set
					if (!optionSet) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	});

	// Radios and checkboxes getter/setter
	jQuery.each(["radio", "checkbox"], function () {
		jQuery.valHooks[this] = {
			set: function set(elem, value) {
				if (Array.isArray(value)) {
					return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
				}
			}
		};
		if (!support.checkOn) {
			jQuery.valHooks[this].get = function (elem) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});

	// Return jQuery for attributes-only inclusion


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	jQuery.extend(jQuery.event, {

		trigger: function trigger(event, data, elem, onlyHandlers) {

			var i,
			    cur,
			    tmp,
			    bubbleType,
			    ontype,
			    handle,
			    special,
			    eventPath = [elem || document],
			    type = hasOwn.call(event, "type") ? event.type : event,
			    namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			if (type.indexOf(".") > -1) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[jQuery.expando] ? event : new jQuery.Event(type, (typeof event === "undefined" ? "undefined" : _typeof(event)) === "object" && event);

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if (!event.target) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ? [event] : jQuery.makeArray(data, [event]);

			// Allow special events to draw outside the lines
			special = jQuery.event.special[type] || {};
			if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

				bubbleType = special.delegateType || type;
				if (!rfocusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}
				for (; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(tmp.defaultView || tmp.parentWindow || window);
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

				event.type = i > 1 ? bubbleType : special.bindType || type;

				// jQuery handler
				handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");
				if (handle) {
					handle.apply(cur, data);
				}

				// Native handler
				handle = ontype && cur[ontype];
				if (handle && handle.apply && acceptData(cur)) {
					event.result = handle.apply(cur, data);
					if (event.result === false) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if (!onlyHandlers && !event.isDefaultPrevented()) {

				if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {

					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ontype];

						if (tmp) {
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[type]();
						jQuery.event.triggered = undefined;

						if (tmp) {
							elem[ontype] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function simulate(type, elem, event) {
			var e = jQuery.extend(new jQuery.Event(), event, {
				type: type,
				isSimulated: true
			});

			jQuery.event.trigger(e, null, elem);
		}

	});

	jQuery.fn.extend({

		trigger: function trigger(type, data) {
			return this.each(function () {
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler: function triggerHandler(type, data) {
			var elem = this[0];
			if (elem) {
				return jQuery.event.trigger(type, data, elem, true);
			}
		}
	});

	jQuery.each(("blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu").split(" "), function (i, name) {

		// Handle event binding
		jQuery.fn[name] = function (data, fn) {
			return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
		};
	});

	jQuery.fn.extend({
		hover: function hover(fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});

	support.focusin = "onfocusin" in window;

	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if (!support.focusin) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function handler(event) {
				jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
			};

			jQuery.event.special[fix] = {
				setup: function setup() {
					var doc = this.ownerDocument || this,
					    attaches = dataPriv.access(doc, fix);

					if (!attaches) {
						doc.addEventListener(orig, handler, true);
					}
					dataPriv.access(doc, fix, (attaches || 0) + 1);
				},
				teardown: function teardown() {
					var doc = this.ownerDocument || this,
					    attaches = dataPriv.access(doc, fix) - 1;

					if (!attaches) {
						doc.removeEventListener(orig, handler, true);
						dataPriv.remove(doc, fix);
					} else {
						dataPriv.access(doc, fix, attaches);
					}
				}
			};
		});
	}
	var location = window.location;

	var nonce = jQuery.now();

	var rquery = /\?/;

	// Cross-browser xml parsing
	jQuery.parseXML = function (data) {
		var xml;
		if (!data || typeof data !== "string") {
			return null;
		}

		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = new window.DOMParser().parseFromString(data, "text/xml");
		} catch (e) {
			xml = undefined;
		}

		if (!xml || xml.getElementsByTagName("parsererror").length) {
			jQuery.error("Invalid XML: " + data);
		}
		return xml;
	};

	var rbracket = /\[\]$/,
	    rCRLF = /\r?\n/g,
	    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	    rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams(prefix, obj, traditional, add) {
		var name;

		if (Array.isArray(obj)) {

			// Serialize array item.
			jQuery.each(obj, function (i, v) {
				if (traditional || rbracket.test(prefix)) {

					// Treat each array item as a scalar.
					add(prefix, v);
				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(prefix + "[" + ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" && v != null ? i : "") + "]", v, traditional, add);
				}
			});
		} else if (!traditional && jQuery.type(obj) === "object") {

			// Serialize object item.
			for (name in obj) {
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}
		} else {

			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function (a, traditional) {
		var prefix,
		    s = [],
		    add = function add(key, valueOrFunction) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;

			s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
		};

		// If an array was passed in, assume that it is an array of form elements.
		if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {

			// Serialize the form elements
			jQuery.each(a, function () {
				add(this.name, this.value);
			});
		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for (prefix in a) {
				buildParams(prefix, a[prefix], traditional, add);
			}
		}

		// Return the resulting serialization
		return s.join("&");
	};

	jQuery.fn.extend({
		serialize: function serialize() {
			return jQuery.param(this.serializeArray());
		},
		serializeArray: function serializeArray() {
			return this.map(function () {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop(this, "elements");
				return elements ? jQuery.makeArray(elements) : this;
			}).filter(function () {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
			}).map(function (i, elem) {
				var val = jQuery(this).val();

				if (val == null) {
					return null;
				}

				if (Array.isArray(val)) {
					return jQuery.map(val, function (val) {
						return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
					});
				}

				return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
			}).get();
		}
	});

	var r20 = /%20/g,
	    rhash = /#.*$/,
	    rantiCache = /([?&])_=[^&]*/,
	    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,


	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	    rnoContent = /^(?:GET|HEAD)$/,
	    rprotocol = /^\/\//,


	/* Prefilters
  * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
  * 2) These are called:
  *    - BEFORE asking for a transport
  *    - AFTER param serialization (s.data is a string if s.processData is true)
  * 3) key is the dataType
  * 4) the catchall symbol "*" can be used
  * 5) execution will start with transport dataType and THEN continue down to "*" if needed
  */
	prefilters = {},


	/* Transports bindings
  * 1) key is the dataType
  * 2) the catchall symbol "*" can be used
  * 3) selection will start with transport dataType and THEN go to "*" if needed
  */
	transports = {},


	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*"),


	// Anchor tag for parsing the document origin
	originAnchor = document.createElement("a");
	originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure) {

		// dataTypeExpression is optional and defaults to "*"
		return function (dataTypeExpression, func) {

			if (typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
			    i = 0,
			    dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];

			if (jQuery.isFunction(func)) {

				// For each dataType in the dataTypeExpression
				while (dataType = dataTypes[i++]) {

					// Prepend if requested
					if (dataType[0] === "+") {
						dataType = dataType.slice(1) || "*";
						(structure[dataType] = structure[dataType] || []).unshift(func);

						// Otherwise append
					} else {
						(structure[dataType] = structure[dataType] || []).push(func);
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

		var inspected = {},
		    seekingTransport = structure === transports;

		function inspect(dataType) {
			var selected;
			inspected[dataType] = true;
			jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
				var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
				if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {

					options.dataTypes.unshift(dataTypeOrTransport);
					inspect(dataTypeOrTransport);
					return false;
				} else if (seekingTransport) {
					return !(selected = dataTypeOrTransport);
				}
			});
			return selected;
		}

		return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target, src) {
		var key,
		    deep,
		    flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for (key in src) {
			if (src[key] !== undefined) {
				(flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}

		return target;
	}

	/* Handles responses to an ajax request:
  * - finds the right dataType (mediates between content-type and expected dataType)
  * - returns the corresponding response
  */
	function ajaxHandleResponses(s, jqXHR, responses) {

		var ct,
		    type,
		    finalDataType,
		    firstDataType,
		    contents = s.contents,
		    dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while (dataTypes[0] === "*") {
			dataTypes.shift();
			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		// Check if we're dealing with a known content-type
		if (ct) {
			for (type in contents) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {

			// Try convertible dataTypes
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}
				if (!firstDataType) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	/* Chain conversions given the request and the original response
  * Also sets the responseXXX fields on the jqXHR instance
  */
	function ajaxConvert(s, response, jqXHR, isSuccess) {
		var conv2,
		    current,
		    conv,
		    tmp,
		    prev,
		    converters = {},


		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if (dataTypes[1]) {
			for (conv in s.converters) {
				converters[conv.toLowerCase()] = s.converters[conv];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while (current) {

			if (s.responseFields[current]) {
				jqXHR[s.responseFields[current]] = response;
			}

			// Apply the dataFilter if provided
			if (!prev && isSuccess && s.dataFilter) {
				response = s.dataFilter(response, s.dataType);
			}

			prev = current;
			current = dataTypes.shift();

			if (current) {

				// There's only work to do if current dataType is non-auto
				if (current === "*") {

					current = prev;

					// Convert response if prev dataType is non-auto and differs from current
				} else if (prev !== "*" && prev !== current) {

					// Seek a direct converter
					conv = converters[prev + " " + current] || converters["* " + current];

					// If none found, seek a pair
					if (!conv) {
						for (conv2 in converters) {

							// If conv2 outputs current
							tmp = conv2.split(" ");
							if (tmp[1] === current) {

								// If prev can be converted to accepted input
								conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
								if (conv) {

									// Condense equivalence converters
									if (conv === true) {
										conv = converters[conv2];

										// Otherwise, insert the intermediate dataType
									} else if (converters[conv2] !== true) {
										current = tmp[0];
										dataTypes.unshift(tmp[1]);
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if (conv !== true) {

						// Unless errors are allowed to bubble, catch and return them
						if (conv && s.throws) {
							response = conv(response);
						} else {
							try {
								response = conv(response);
							} catch (e) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test(location.protocol),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",

			/*
   timeout: 0,
   data: null,
   dataType: null,
   username: null,
   password: null,
   cache: null,
   throws: false,
   traditional: false,
   headers: {},
   */

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": JSON.parse,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function ajaxSetup(target, settings) {
			return settings ?

			// Building a settings object
			ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

			// Extending ajaxSettings
			ajaxExtend(jQuery.ajaxSettings, target);
		},

		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),

		// Main method
		ajax: function ajax(url, options) {

			// If url is an object, simulate pre-1.5 signature
			if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,


			// URL without anti-cache param
			cacheURL,


			// Response headers
			responseHeadersString,
			    responseHeaders,


			// timeout handle
			timeoutTimer,


			// Url cleanup var
			urlAnchor,


			// Request state (becomes false upon send and true upon completion)
			completed,


			// To know if global events are to be dispatched
			fireGlobals,


			// Loop variable
			i,


			// uncached part of the url
			uncached,


			// Create the final options object
			s = jQuery.ajaxSetup({}, options),


			// Callbacks context
			callbackContext = s.context || s,


			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,


			// Deferreds
			deferred = jQuery.Deferred(),
			    completeDeferred = jQuery.Callbacks("once memory"),


			// Status-dependent callbacks
			_statusCode = s.statusCode || {},


			// Headers (they are sent all at once)
			requestHeaders = {},
			    requestHeadersNames = {},


			// Default abort message
			strAbort = "canceled",


			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function getResponseHeader(key) {
					var match;
					if (completed) {
						if (!responseHeaders) {
							responseHeaders = {};
							while (match = rheaders.exec(responseHeadersString)) {
								responseHeaders[match[1].toLowerCase()] = match[2];
							}
						}
						match = responseHeaders[key.toLowerCase()];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function getAllResponseHeaders() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function setRequestHeader(name, value) {
					if (completed == null) {
						name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
						requestHeaders[name] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function overrideMimeType(type) {
					if (completed == null) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function statusCode(map) {
					var code;
					if (map) {
						if (completed) {

							// Execute the appropriate callbacks
							jqXHR.always(map[jqXHR.status]);
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for (code in map) {
								_statusCode[code] = [_statusCode[code], map[code]];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function abort(statusText) {
					var finalText = statusText || strAbort;
					if (transport) {
						transport.abort(finalText);
					}
					done(0, finalText);
					return this;
				}
			};

			// Attach deferreds
			deferred.promise(jqXHR);

			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if (s.crossDomain == null) {
				urlAnchor = document.createElement("a");

				// Support: IE <=8 - 11, Edge 12 - 13
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
				} catch (e) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			// Apply prefilters
			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			// If request was aborted inside a prefilter, stop there
			if (completed) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test(s.type);

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace(rhash, "");

			// More options handling for requests with no content
			if (!s.hasContent) {

				// Remember the hash so we can put it back
				uncached = s.url.slice(cacheURL.length);

				// If data is available, append data to url
				if (s.data) {
					cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add or update anti-cache param if needed
				if (s.cache === false) {
					cacheURL = cacheURL.replace(rantiCache, "$1");
					uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++ + uncached;
				}

				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;

				// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
				s.data = s.data.replace(r20, "+");
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if (s.ifModified) {
				if (jQuery.lastModified[cacheURL]) {
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
				}
				if (jQuery.etag[cacheURL]) {
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
				}
			}

			// Set the correct header, if data is being sent
			if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);

			// Check for headers option
			for (i in s.headers) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			// Allow custom headers/mimetypes and early abort
			if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			completeDeferred.add(s.complete);
			jqXHR.done(s.success);
			jqXHR.fail(s.error);

			// Get transport
			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			// If no transport, we auto-abort
			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}

				// If request was aborted inside ajaxSend, stop there
				if (completed) {
					return jqXHR;
				}

				// Timeout
				if (s.async && s.timeout > 0) {
					timeoutTimer = window.setTimeout(function () {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					completed = false;
					transport.send(requestHeaders, done);
				} catch (e) {

					// Rethrow post-completion exceptions
					if (completed) {
						throw e;
					}

					// Propagate others as results
					done(-1, e);
				}
			}

			// Callback for when everything is done
			function done(status, nativeStatusText, responses, headers) {
				var isSuccess,
				    success,
				    error,
				    response,
				    modified,
				    statusText = nativeStatusText;

				// Ignore repeat invocations
				if (completed) {
					return;
				}

				completed = true;

				// Clear timeout if it exists
				if (timeoutTimer) {
					window.clearTimeout(timeoutTimer);
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if (responses) {
					response = ajaxHandleResponses(s, jqXHR, responses);
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert(s, response, jqXHR, isSuccess);

				// If successful, handle type chaining
				if (isSuccess) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if (s.ifModified) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if (modified) {
							jQuery.lastModified[cacheURL] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if (modified) {
							jQuery.etag[cacheURL] = modified;
						}
					}

					// if no content
					if (status === 204 || s.type === "HEAD") {
						statusText = "nocontent";

						// if not modified
					} else if (status === 304) {
						statusText = "notmodified";

						// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if (status || !statusText) {
						statusText = "error";
						if (status < 0) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = (nativeStatusText || statusText) + "";

				// Success/Error
				if (isSuccess) {
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else {
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				// Status-dependent callbacks
				jqXHR.statusCode(_statusCode);
				_statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
				}

				// Complete
				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

					// Handle the global AJAX counter
					if (! --jQuery.active) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},

		getJSON: function getJSON(url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},

		getScript: function getScript(url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		}
	});

	jQuery.each(["get", "post"], function (i, method) {
		jQuery[method] = function (url, data, callback, type) {

			// Shift arguments if data argument was omitted
			if (jQuery.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax(jQuery.extend({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject(url) && url));
		};
	});

	jQuery._evalUrl = function (url) {
		return jQuery.ajax({
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		});
	};

	jQuery.fn.extend({
		wrapAll: function wrapAll(html) {
			var wrap;

			if (this[0]) {
				if (jQuery.isFunction(html)) {
					html = html.call(this[0]);
				}

				// The elements to wrap the target around
				wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function () {
					var elem = this;

					while (elem.firstElementChild) {
						elem = elem.firstElementChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner: function wrapInner(html) {
			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function () {
				var self = jQuery(this),
				    contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);
				} else {
					self.append(html);
				}
			});
		},

		wrap: function wrap(html) {
			var isFunction = jQuery.isFunction(html);

			return this.each(function (i) {
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
			});
		},

		unwrap: function unwrap(selector) {
			this.parent(selector).not("body").each(function () {
				jQuery(this).replaceWith(this.childNodes);
			});
			return this;
		}
	});

	jQuery.expr.pseudos.hidden = function (elem) {
		return !jQuery.expr.pseudos.visible(elem);
	};
	jQuery.expr.pseudos.visible = function (elem) {
		return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
	};

	jQuery.ajaxSettings.xhr = function () {
		try {
			return new window.XMLHttpRequest();
		} catch (e) {}
	};

	var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	    xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport(function (options) {
		var _callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if (support.cors || xhrSupported && !options.crossDomain) {
			return {
				send: function send(headers, complete) {
					var i,
					    xhr = options.xhr();

					xhr.open(options.type, options.url, options.async, options.username, options.password);

					// Apply custom fields if provided
					if (options.xhrFields) {
						for (i in options.xhrFields) {
							xhr[i] = options.xhrFields[i];
						}
					}

					// Override mime type if needed
					if (options.mimeType && xhr.overrideMimeType) {
						xhr.overrideMimeType(options.mimeType);
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if (!options.crossDomain && !headers["X-Requested-With"]) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for (i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}

					// Callback
					_callback = function callback(type) {
						return function () {
							if (_callback) {
								_callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

								if (type === "abort") {
									xhr.abort();
								} else if (type === "error") {

									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if (typeof xhr.status !== "number") {
										complete(0, "error");
									} else {
										complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status, xhr.statusText);
									}
								} else {
									complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									(xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText }, xhr.getAllResponseHeaders());
								}
							}
						};
					};

					// Listen to events
					xhr.onload = _callback();
					errorCallback = xhr.onerror = _callback("error");

					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if (xhr.onabort !== undefined) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function () {

							// Check readyState before timeout as it changes
							if (xhr.readyState === 4) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout(function () {
									if (_callback) {
										errorCallback();
									}
								});
							}
						};
					}

					// Create the abort callback
					_callback = _callback("abort");

					try {

						// Do send the request (this may raise an exception)
						xhr.send(options.hasContent && options.data || null);
					} catch (e) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if (_callback) {
							throw e;
						}
					}
				},

				abort: function abort() {
					if (_callback) {
						_callback();
					}
				}
			};
		}
	});

	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter(function (s) {
		if (s.crossDomain) {
			s.contents.script = false;
		}
	});

	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function textScript(text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter("script", function (s) {
		if (s.cache === undefined) {
			s.cache = false;
		}
		if (s.crossDomain) {
			s.type = "GET";
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport("script", function (s) {

		// This transport only deals with cross domain requests
		if (s.crossDomain) {
			var script, _callback2;
			return {
				send: function send(_, complete) {
					script = jQuery("<script>").prop({
						charset: s.scriptCharset,
						src: s.url
					}).on("load error", _callback2 = function callback(evt) {
						script.remove();
						_callback2 = null;
						if (evt) {
							complete(evt.type === "error" ? 404 : 200, evt.type);
						}
					});

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild(script[0]);
				},
				abort: function abort() {
					if (_callback2) {
						_callback2();
					}
				}
			};
		}
	});

	var oldCallbacks = [],
	    rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function jsonpCallback() {
			var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
			this[callback] = true;
			return callback;
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

		var callbackName,
		    overwritten,
		    responseContainer,
		    jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if (jsonProp || s.dataTypes[0] === "jsonp") {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;

			// Insert callback into url or form data
			if (jsonProp) {
				s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
			} else if (s.jsonp !== false) {
				s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function () {
				if (!responseContainer) {
					jQuery.error(callbackName + " was not called");
				}
				return responseContainer[0];
			};

			// Force json dataType
			s.dataTypes[0] = "json";

			// Install callback
			overwritten = window[callbackName];
			window[callbackName] = function () {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always(function () {

				// If previous value didn't exist - remove it
				if (overwritten === undefined) {
					jQuery(window).removeProp(callbackName);

					// Otherwise restore preexisting value
				} else {
					window[callbackName] = overwritten;
				}

				// Save back as free
				if (s[callbackName]) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push(callbackName);
				}

				// Call if it was a function and we have a response
				if (responseContainer && jQuery.isFunction(overwritten)) {
					overwritten(responseContainer[0]);
				}

				responseContainer = overwritten = undefined;
			});

			// Delegate to script
			return "script";
		}
	});

	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = function () {
		var body = document.implementation.createHTMLDocument("").body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	}();

	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function (data, context, keepScripts) {
		if (typeof data !== "string") {
			return [];
		}
		if (typeof context === "boolean") {
			keepScripts = context;
			context = false;
		}

		var base, parsed, scripts;

		if (!context) {

			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if (support.createHTMLDocument) {
				context = document.implementation.createHTMLDocument("");

				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement("base");
				base.href = document.location.href;
				context.head.appendChild(base);
			} else {
				context = document;
			}
		}

		parsed = rsingleTag.exec(data);
		scripts = !keepScripts && [];

		// Single tag
		if (parsed) {
			return [context.createElement(parsed[1])];
		}

		parsed = buildFragment([data], context, scripts);

		if (scripts && scripts.length) {
			jQuery(scripts).remove();
		}

		return jQuery.merge([], parsed.childNodes);
	};

	/**
  * Load a url into a page
  */
	jQuery.fn.load = function (url, params, callback) {
		var selector,
		    type,
		    response,
		    self = this,
		    off = url.indexOf(" ");

		if (off > -1) {
			selector = stripAndCollapse(url.slice(off));
			url = url.slice(0, off);
		}

		// If it's a function
		if (jQuery.isFunction(params)) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if (params && (typeof params === "undefined" ? "undefined" : _typeof(params)) === "object") {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if (self.length > 0) {
			jQuery.ajax({
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			}).done(function (responseText) {

				// Save response for use in complete callback
				response = arguments;

				self.html(selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

				// Otherwise use the full result
				responseText);

				// If the request succeeds, this function gets "data", "status", "jqXHR"
				// but they are ignored because response was set above.
				// If it fails, this function gets "jqXHR", "status", "error"
			}).always(callback && function (jqXHR, status) {
				self.each(function () {
					callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
				});
			});
		}

		return this;
	};

	// Attach a bunch of functions for handling common AJAX events
	jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
		jQuery.fn[type] = function (fn) {
			return this.on(type, fn);
		};
	});

	jQuery.expr.pseudos.animated = function (elem) {
		return jQuery.grep(jQuery.timers, function (fn) {
			return elem === fn.elem;
		}).length;
	};

	jQuery.offset = {
		setOffset: function setOffset(elem, options, i) {
			var curPosition,
			    curLeft,
			    curCSSTop,
			    curTop,
			    curOffset,
			    curCSSLeft,
			    calculatePosition,
			    position = jQuery.css(elem, "position"),
			    curElem = jQuery(elem),
			    props = {};

			// Set position first, in-case top/left are set even on static elem
			if (position === "static") {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css(elem, "top");
			curCSSLeft = jQuery.css(elem, "left");
			calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (jQuery.isFunction(options)) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call(elem, i, jQuery.extend({}, curOffset));
			}

			if (options.top != null) {
				props.top = options.top - curOffset.top + curTop;
			}
			if (options.left != null) {
				props.left = options.left - curOffset.left + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);
			} else {
				curElem.css(props);
			}
		}
	};

	jQuery.fn.extend({
		offset: function offset(options) {

			// Preserve chaining for setter
			if (arguments.length) {
				return options === undefined ? this : this.each(function (i) {
					jQuery.offset.setOffset(this, options, i);
				});
			}

			var doc,
			    docElem,
			    rect,
			    win,
			    elem = this[0];

			if (!elem) {
				return;
			}

			// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if (!elem.getClientRects().length) {
				return { top: 0, left: 0 };
			}

			rect = elem.getBoundingClientRect();

			doc = elem.ownerDocument;
			docElem = doc.documentElement;
			win = doc.defaultView;

			return {
				top: rect.top + win.pageYOffset - docElem.clientTop,
				left: rect.left + win.pageXOffset - docElem.clientLeft
			};
		},

		position: function position() {
			if (!this[0]) {
				return;
			}

			var offsetParent,
			    offset,
			    elem = this[0],
			    parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if (jQuery.css(elem, "position") === "fixed") {

				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();
			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if (!nodeName(offsetParent[0], "html")) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset = {
					top: parentOffset.top + jQuery.css(offsetParent[0], "borderTopWidth", true),
					left: parentOffset.left + jQuery.css(offsetParent[0], "borderLeftWidth", true)
				};
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
				left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function offsetParent() {
			return this.map(function () {
				var offsetParent = this.offsetParent;

				while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			});
		}
	});

	// Create scrollLeft and scrollTop methods
	jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
		var top = "pageYOffset" === prop;

		jQuery.fn[method] = function (val) {
			return access(this, function (elem, method, val) {

				// Coalesce documents and windows
				var win;
				if (jQuery.isWindow(elem)) {
					win = elem;
				} else if (elem.nodeType === 9) {
					win = elem.defaultView;
				}

				if (val === undefined) {
					return win ? win[prop] : elem[method];
				}

				if (win) {
					win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
				} else {
					elem[method] = val;
				}
			}, method, val, arguments.length);
		};
	});

	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each(["top", "left"], function (i, prop) {
		jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
			if (computed) {
				computed = curCSS(elem, prop);

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
			}
		});
	});

	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
		jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
				    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

				return access(this, function (elem, type, value) {
					var doc;

					if (jQuery.isWindow(elem)) {

						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
					}

					// Get document width or height
					if (elem.nodeType === 9) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
					}

					return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css(elem, type, extra) :

					// Set width or height on the element
					jQuery.style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable);
			};
		});
	});

	jQuery.fn.extend({

		bind: function bind(types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind: function unbind(types, fn) {
			return this.off(types, null, fn);
		},

		delegate: function delegate(selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate: function undelegate(selector, types, fn) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
		}
	});

	jQuery.holdReady = function (hold) {
		if (hold) {
			jQuery.readyWait++;
		} else {
			jQuery.ready(true);
		}
	};
	jQuery.isArray = Array.isArray;
	jQuery.parseJSON = JSON.parse;
	jQuery.nodeName = nodeName;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,


	// Map over the $ in case of overwrite
	_$ = window.$;

	jQuery.noConflict = function (deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}

		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if (!noGlobal) {
		window.jQuery = window.$ = jQuery;
	}

	return jQuery;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	$.ui = $.ui || {};

	return $.ui.version = "1.12.1";
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Widget 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Widget
//>>group: Core
//>>description: Provides a factory for creating stateful widgets with a common API.
//>>docs: http://api.jqueryui.com/jQuery.widget/
//>>demos: http://jqueryui.com/widget/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	var widgetUuid = 0;
	var widgetSlice = Array.prototype.slice;

	$.cleanData = function (orig) {
		return function (elems) {
			var events, elem, i;
			for (i = 0; (elem = elems[i]) != null; i++) {
				try {

					// Only trigger remove when necessary to save time
					events = $._data(elem, "events");
					if (events && events.remove) {
						$(elem).triggerHandler("remove");
					}

					// Http://bugs.jquery.com/ticket/8235
				} catch (e) {}
			}
			orig(elems);
		};
	}($.cleanData);

	$.widget = function (name, base, prototype) {
		var existingConstructor, constructor, basePrototype;

		// ProxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		var proxiedPrototype = {};

		var namespace = name.split(".")[0];
		name = name.split(".")[1];
		var fullName = namespace + "-" + name;

		if (!prototype) {
			prototype = base;
			base = $.Widget;
		}

		if ($.isArray(prototype)) {
			prototype = $.extend.apply(null, [{}].concat(prototype));
		}

		// Create selector for plugin
		$.expr[":"][fullName.toLowerCase()] = function (elem) {
			return !!$.data(elem, fullName);
		};

		$[namespace] = $[namespace] || {};
		existingConstructor = $[namespace][name];
		constructor = $[namespace][name] = function (options, element) {

			// Allow instantiation without "new" keyword
			if (!this._createWidget) {
				return new constructor(options, element);
			}

			// Allow instantiation without initializing for simple inheritance
			// must use "new" keyword (the code above always passes args)
			if (arguments.length) {
				this._createWidget(options, element);
			}
		};

		// Extend with the existing constructor to carry over any static properties
		$.extend(constructor, existingConstructor, {
			version: prototype.version,

			// Copy the object used to create the prototype in case we need to
			// redefine the widget later
			_proto: $.extend({}, prototype),

			// Track widgets that inherit from this widget in case this widget is
			// redefined after a widget inherits from it
			_childConstructors: []
		});

		basePrototype = new base();

		// We need to make the options hash a property directly on the new instance
		// otherwise we'll modify the options hash on the prototype that we're
		// inheriting from
		basePrototype.options = $.widget.extend({}, basePrototype.options);
		$.each(prototype, function (prop, value) {
			if (!$.isFunction(value)) {
				proxiedPrototype[prop] = value;
				return;
			}
			proxiedPrototype[prop] = function () {
				function _super() {
					return base.prototype[prop].apply(this, arguments);
				}

				function _superApply(args) {
					return base.prototype[prop].apply(this, args);
				}

				return function () {
					var __super = this._super;
					var __superApply = this._superApply;
					var returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply(this, arguments);

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			}();
		});
		constructor.prototype = $.widget.extend(basePrototype, {

			// TODO: remove support for widgetEventPrefix
			// always use the name + a colon as the prefix, e.g., draggable:start
			// don't prefix for widgets that aren't DOM-based
			widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix || name : name
		}, proxiedPrototype, {
			constructor: constructor,
			namespace: namespace,
			widgetName: name,
			widgetFullName: fullName
		});

		// If this widget is being redefined then we need to find all widgets that
		// are inheriting from it and redefine all of them so that they inherit from
		// the new version of this widget. We're essentially trying to replace one
		// level in the prototype chain.
		if (existingConstructor) {
			$.each(existingConstructor._childConstructors, function (i, child) {
				var childPrototype = child.prototype;

				// Redefine the child widget using the same prototype that was
				// originally used, but inherit from the new version of the base
				$.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
			});

			// Remove the list of existing child constructors from the old constructor
			// so the old child constructors can be garbage collected
			delete existingConstructor._childConstructors;
		} else {
			base._childConstructors.push(constructor);
		}

		$.widget.bridge(name, constructor);

		return constructor;
	};

	$.widget.extend = function (target) {
		var input = widgetSlice.call(arguments, 1);
		var inputIndex = 0;
		var inputLength = input.length;
		var key;
		var value;

		for (; inputIndex < inputLength; inputIndex++) {
			for (key in input[inputIndex]) {
				value = input[inputIndex][key];
				if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {

					// Clone objects
					if ($.isPlainObject(value)) {
						target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) :

						// Don't extend strings, arrays, etc. with objects
						$.widget.extend({}, value);

						// Copy everything else by reference
					} else {
						target[key] = value;
					}
				}
			}
		}
		return target;
	};

	$.widget.bridge = function (name, object) {
		var fullName = object.prototype.widgetFullName || name;
		$.fn[name] = function (options) {
			var isMethodCall = typeof options === "string";
			var args = widgetSlice.call(arguments, 1);
			var returnValue = this;

			if (isMethodCall) {

				// If this is an empty collection, we need to have the instance method
				// return undefined instead of the jQuery instance
				if (!this.length && options === "instance") {
					returnValue = undefined;
				} else {
					this.each(function () {
						var methodValue;
						var instance = $.data(this, fullName);

						if (options === "instance") {
							returnValue = instance;
							return false;
						}

						if (!instance) {
							return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'");
						}

						if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
							return $.error("no such method '" + options + "' for " + name + " widget instance");
						}

						methodValue = instance[options].apply(instance, args);

						if (methodValue !== instance && methodValue !== undefined) {
							returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
							return false;
						}
					});
				}
			} else {

				// Allow multiple hashes to be passed on init
				if (args.length) {
					options = $.widget.extend.apply(null, [options].concat(args));
				}

				this.each(function () {
					var instance = $.data(this, fullName);
					if (instance) {
						instance.option(options || {});
						if (instance._init) {
							instance._init();
						}
					} else {
						$.data(this, fullName, new object(options, this));
					}
				});
			}

			return returnValue;
		};
	};

	$.Widget = function () /* options, element */{};
	$.Widget._childConstructors = [];

	$.Widget.prototype = {
		widgetName: "widget",
		widgetEventPrefix: "",
		defaultElement: "<div>",

		options: {
			classes: {},
			disabled: false,

			// Callbacks
			create: null
		},

		_createWidget: function _createWidget(options, element) {
			element = $(element || this.defaultElement || this)[0];
			this.element = $(element);
			this.uuid = widgetUuid++;
			this.eventNamespace = "." + this.widgetName + this.uuid;

			this.bindings = $();
			this.hoverable = $();
			this.focusable = $();
			this.classesElementLookup = {};

			if (element !== this) {
				$.data(element, this.widgetFullName, this);
				this._on(true, this.element, {
					remove: function remove(event) {
						if (event.target === element) {
							this.destroy();
						}
					}
				});
				this.document = $(element.style ?

				// Element within the document
				element.ownerDocument :

				// Element is window or document
				element.document || element);
				this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
			}

			this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);

			this._create();

			if (this.options.disabled) {
				this._setOptionDisabled(this.options.disabled);
			}

			this._trigger("create", null, this._getCreateEventData());
			this._init();
		},

		_getCreateOptions: function _getCreateOptions() {
			return {};
		},

		_getCreateEventData: $.noop,

		_create: $.noop,

		_init: $.noop,

		destroy: function destroy() {
			var that = this;

			this._destroy();
			$.each(this.classesElementLookup, function (key, value) {
				that._removeClass(value, key);
			});

			// We can probably remove the unbind calls in 2.0
			// all event bindings should go through this._on()
			this.element.off(this.eventNamespace).removeData(this.widgetFullName);
			this.widget().off(this.eventNamespace).removeAttr("aria-disabled");

			// Clean up events and states
			this.bindings.off(this.eventNamespace);
		},

		_destroy: $.noop,

		widget: function widget() {
			return this.element;
		},

		option: function option(key, value) {
			var options = key;
			var parts;
			var curOption;
			var i;

			if (arguments.length === 0) {

				// Don't return a reference to the internal hash
				return $.widget.extend({}, this.options);
			}

			if (typeof key === "string") {

				// Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
				options = {};
				parts = key.split(".");
				key = parts.shift();
				if (parts.length) {
					curOption = options[key] = $.widget.extend({}, this.options[key]);
					for (i = 0; i < parts.length - 1; i++) {
						curOption[parts[i]] = curOption[parts[i]] || {};
						curOption = curOption[parts[i]];
					}
					key = parts.pop();
					if (arguments.length === 1) {
						return curOption[key] === undefined ? null : curOption[key];
					}
					curOption[key] = value;
				} else {
					if (arguments.length === 1) {
						return this.options[key] === undefined ? null : this.options[key];
					}
					options[key] = value;
				}
			}

			this._setOptions(options);

			return this;
		},

		_setOptions: function _setOptions(options) {
			var key;

			for (key in options) {
				this._setOption(key, options[key]);
			}

			return this;
		},

		_setOption: function _setOption(key, value) {
			if (key === "classes") {
				this._setOptionClasses(value);
			}

			this.options[key] = value;

			if (key === "disabled") {
				this._setOptionDisabled(value);
			}

			return this;
		},

		_setOptionClasses: function _setOptionClasses(value) {
			var classKey, elements, currentElements;

			for (classKey in value) {
				currentElements = this.classesElementLookup[classKey];
				if (value[classKey] === this.options.classes[classKey] || !currentElements || !currentElements.length) {
					continue;
				}

				// We are doing this to create a new jQuery object because the _removeClass() call
				// on the next line is going to destroy the reference to the current elements being
				// tracked. We need to save a copy of this collection so that we can add the new classes
				// below.
				elements = $(currentElements.get());
				this._removeClass(currentElements, classKey);

				// We don't use _addClass() here, because that uses this.options.classes
				// for generating the string of classes. We want to use the value passed in from
				// _setOption(), this is the new value of the classes option which was passed to
				// _setOption(). We pass this value directly to _classes().
				elements.addClass(this._classes({
					element: elements,
					keys: classKey,
					classes: value,
					add: true
				}));
			}
		},

		_setOptionDisabled: function _setOptionDisabled(value) {
			this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!value);

			// If the widget is becoming disabled, then nothing is interactive
			if (value) {
				this._removeClass(this.hoverable, null, "ui-state-hover");
				this._removeClass(this.focusable, null, "ui-state-focus");
			}
		},

		enable: function enable() {
			return this._setOptions({ disabled: false });
		},

		disable: function disable() {
			return this._setOptions({ disabled: true });
		},

		_classes: function _classes(options) {
			var full = [];
			var that = this;

			options = $.extend({
				element: this.element,
				classes: this.options.classes || {}
			}, options);

			function processClassString(classes, checkOption) {
				var current, i;
				for (i = 0; i < classes.length; i++) {
					current = that.classesElementLookup[classes[i]] || $();
					if (options.add) {
						current = $($.unique(current.get().concat(options.element.get())));
					} else {
						current = $(current.not(options.element).get());
					}
					that.classesElementLookup[classes[i]] = current;
					full.push(classes[i]);
					if (checkOption && options.classes[classes[i]]) {
						full.push(options.classes[classes[i]]);
					}
				}
			}

			this._on(options.element, {
				"remove": "_untrackClassesElement"
			});

			if (options.keys) {
				processClassString(options.keys.match(/\S+/g) || [], true);
			}
			if (options.extra) {
				processClassString(options.extra.match(/\S+/g) || []);
			}

			return full.join(" ");
		},

		_untrackClassesElement: function _untrackClassesElement(event) {
			var that = this;
			$.each(that.classesElementLookup, function (key, value) {
				if ($.inArray(event.target, value) !== -1) {
					that.classesElementLookup[key] = $(value.not(event.target).get());
				}
			});
		},

		_removeClass: function _removeClass(element, keys, extra) {
			return this._toggleClass(element, keys, extra, false);
		},

		_addClass: function _addClass(element, keys, extra) {
			return this._toggleClass(element, keys, extra, true);
		},

		_toggleClass: function _toggleClass(element, keys, extra, add) {
			add = typeof add === "boolean" ? add : extra;
			var shift = typeof element === "string" || element === null,
			    options = {
				extra: shift ? keys : extra,
				keys: shift ? element : keys,
				element: shift ? this.element : element,
				add: add
			};
			options.element.toggleClass(this._classes(options), add);
			return this;
		},

		_on: function _on(suppressDisabledCheck, element, handlers) {
			var delegateElement;
			var instance = this;

			// No suppressDisabledCheck flag, shuffle arguments
			if (typeof suppressDisabledCheck !== "boolean") {
				handlers = element;
				element = suppressDisabledCheck;
				suppressDisabledCheck = false;
			}

			// No element argument, shuffle and use this.element
			if (!handlers) {
				handlers = element;
				element = this.element;
				delegateElement = this.widget();
			} else {
				element = delegateElement = $(element);
				this.bindings = this.bindings.add(element);
			}

			$.each(handlers, function (event, handler) {
				function handlerProxy() {

					// Allow widgets to customize the disabled handling
					// - disabled as an array instead of boolean
					// - disabled class as method for disabling individual parts
					if (!suppressDisabledCheck && (instance.options.disabled === true || $(this).hasClass("ui-state-disabled"))) {
						return;
					}
					return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
				}

				// Copy the guid so direct unbinding works
				if (typeof handler !== "string") {
					handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++;
				}

				var match = event.match(/^([\w:-]*)\s*(.*)$/);
				var eventName = match[1] + instance.eventNamespace;
				var selector = match[2];

				if (selector) {
					delegateElement.on(eventName, selector, handlerProxy);
				} else {
					element.on(eventName, handlerProxy);
				}
			});
		},

		_off: function _off(element, eventName) {
			eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
			element.off(eventName).off(eventName);

			// Clear the stack to avoid memory leaks (#10056)
			this.bindings = $(this.bindings.not(element).get());
			this.focusable = $(this.focusable.not(element).get());
			this.hoverable = $(this.hoverable.not(element).get());
		},

		_delay: function _delay(handler, delay) {
			function handlerProxy() {
				return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
			}
			var instance = this;
			return setTimeout(handlerProxy, delay || 0);
		},

		_hoverable: function _hoverable(element) {
			this.hoverable = this.hoverable.add(element);
			this._on(element, {
				mouseenter: function mouseenter(event) {
					this._addClass($(event.currentTarget), null, "ui-state-hover");
				},
				mouseleave: function mouseleave(event) {
					this._removeClass($(event.currentTarget), null, "ui-state-hover");
				}
			});
		},

		_focusable: function _focusable(element) {
			this.focusable = this.focusable.add(element);
			this._on(element, {
				focusin: function focusin(event) {
					this._addClass($(event.currentTarget), null, "ui-state-focus");
				},
				focusout: function focusout(event) {
					this._removeClass($(event.currentTarget), null, "ui-state-focus");
				}
			});
		},

		_trigger: function _trigger(type, event, data) {
			var prop, orig;
			var callback = this.options[type];

			data = data || {};
			event = $.Event(event);
			event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();

			// The original event may come from any element
			// so we need to reset the target on the new event
			event.target = this.element[0];

			// Copy original event properties over to the new event
			orig = event.originalEvent;
			if (orig) {
				for (prop in orig) {
					if (!(prop in event)) {
						event[prop] = orig[prop];
					}
				}
			}

			this.element.trigger(event, data);
			return !($.isFunction(callback) && callback.apply(this.element[0], [event].concat(data)) === false || event.isDefaultPrevented());
		}
	};

	$.each({ show: "fadeIn", hide: "fadeOut" }, function (method, defaultEffect) {
		$.Widget.prototype["_" + method] = function (element, options, callback) {
			if (typeof options === "string") {
				options = { effect: options };
			}

			var hasOptions;
			var effectName = !options ? method : options === true || typeof options === "number" ? defaultEffect : options.effect || defaultEffect;

			options = options || {};
			if (typeof options === "number") {
				options = { duration: options };
			}

			hasOptions = !$.isEmptyObject(options);
			options.complete = callback;

			if (options.delay) {
				element.delay(options.delay);
			}

			if (hasOptions && $.effects && $.effects.effect[effectName]) {
				element[method](options);
			} else if (effectName !== method && element[effectName]) {
				element[effectName](options.duration, options.easing, callback);
			} else {
				element.queue(function (next) {
					$(this)[method]();
					if (callback) {
						callback.call(element[0]);
					}
					next();
				});
			}
		};
	});

	return $.widget;
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var rStr = function rStr(length) {
  var str = '';
  for (var i = 0; i < length; i++) {
    str += String.fromCharCode(97 + Math.floor(Math.random() * 25));
  }
  return str;
};

var isEmail = function isEmail(email) {
  var atpos = email.indexOf("@");
  var dotpos = email.lastIndexOf(".");
  if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
    return false;
  }
  return true;
};

var getSize = function getSize(obj) {
  var size = 0,
      key = void 0;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

exports.rStr = rStr;
exports.isEmail = isEmail;
exports.getSize = getSize;
exports.escapeHtml = escapeHtml;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.numbersOnlyListener = exports.maxLengthListener = exports.itemNameListener = exports.emailOnlyListener = exports.alphaOnlyListener = exports.alphaNumericOnlyListener = undefined;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var numbersOnlyListener = function numbersOnlyListener(jqueryObject) {
	jqueryObject.keydown(function (event) {
		if (event.key != 'Backspace' && event.key != 'ArrowLeft' && event.key != 'ArrowRight') {
			if (!event.key.match(/^[0-9.]*$/)) {
				return false;
			}
		}
	});
};

var emailOnlyListener = function emailOnlyListener(jqueryObject) {
	jqueryObject.keydown(function (event) {
		if (!event.key.match(/^[a-zA-Z0-9.@]*$/)) {
			return false;
		}
	});
};

var alphaNumericOnlyListener = function alphaNumericOnlyListener(jqueryObject) {
	jqueryObject.keydown(function (event) {
		if (!event.key.match(/^[a-zA-Z0-9.]*$/)) {
			return false;
		}
	});
};

var alphaOnlyListener = function alphaOnlyListener(jqueryObject) {
	jqueryObject.keydown(function (event) {
		if (!event.key.match(/^[a-zA-Z.]*$/)) {
			return false;
		}
	});
};

var itemNameListener = function itemNameListener(jqueryObject) {
	jqueryObject.keydown(function (event) {
		if (event.key.match(/^[;'_]*$/)) {
			return false;
		}
	});
};

var maxLengthListener = function maxLengthListener(jqueryObject, maxLength) {
	jqueryObject.keydown(function (event) {
		if (jqueryObject.val().length >= maxLength && event.keyCode != 8) {
			return false;
		}
	});
};

exports.alphaNumericOnlyListener = alphaNumericOnlyListener;
exports.alphaOnlyListener = alphaOnlyListener;
exports.emailOnlyListener = emailOnlyListener;
exports.itemNameListener = itemNameListener;
exports.maxLengthListener = maxLengthListener;
exports.numbersOnlyListener = numbersOnlyListener;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var handleServerResponse = function handleServerResponse(r) {
	var debug = window.location.href.indexOf('imrcaccounts') == -1;

	if (debug) console.log(r);
	if (typeof r === 'string') {
		if (r.indexOf('Fatal error') != -1 && r.indexOf('Fatal error') < 32) {
			//make sure fatal error isn't some incidental text in a json strong somewhere
			alert(r.substring(r.indexOf('Uncaught Exception'), r.indexOf('in /')));
			return;
		}
	}
	try {
		var _r = JSON.parse(r);
		if (debug) console.log(_r);
		if (_r.message != '') alert(_r.status.toUpperCase() + ": " + _r.message);
		if (_r.redirect != '') window.location.href = _r.redirect;
		return _r.content;
	} catch (error) {
		console.warn(error);
		console.log('JS error occured when handling server response.');
	}
};

var handleServerError = function handleServerError(e, err) {
	console.log(e);
	console.log(err);
	alert(e.statusText + " \n Error Code:" + e.status);
};

exports.handleServerResponse = handleServerResponse;
exports.handleServerError = handleServerError;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ERinvalidTimePrompt = 'Check out/in for the Equipment Room are allowed only during business hours. You may need to change your dates or shorten the reservation period.';

var eventFallsOnWeekend = function eventFallsOnWeekend(e) {
  var dayOfWeekStart = e.start.format('ddd').toLowerCase();
  var dayOfWeekEnd = e.end.format('ddd').toLowerCase();

  //for now it ends at midnight of the following day
  return dayOfWeekStart == 'sat' || dayOfWeekStart == 'sun' || dayOfWeekEnd == 'sun' || dayOfWeekEnd == 'mon';
};

var eventIsLongerThan = function eventIsLongerThan(e, days) {
  var start = moment(e.start.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm');
  var end = moment(e.end.format('MM-DD-YYYY HH:mm'), 'MM-DD-YYYY HH:mm');
  return end.diff(start, 'days') > days;
};

exports.ERinvalidTimePrompt = ERinvalidTimePrompt;
exports.eventFallsOnWeekend = eventFallsOnWeekend;
exports.eventIsLongerThan = eventIsLongerThan;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Mouse 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Mouse
//>>group: Widgets
//>>description: Abstracts mouse-based interactions to assist in creating certain widgets.
//>>docs: http://api.jqueryui.com/mouse/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(29), __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	var mouseHandled = false;
	$(document).on("mouseup", function () {
		mouseHandled = false;
	});

	return $.widget("ui.mouse", {
		version: "1.12.1",
		options: {
			cancel: "input, textarea, button, select, option",
			distance: 1,
			delay: 0
		},
		_mouseInit: function _mouseInit() {
			var that = this;

			this.element.on("mousedown." + this.widgetName, function (event) {
				return that._mouseDown(event);
			}).on("click." + this.widgetName, function (event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

			this.started = false;
		},

		// TODO: make sure destroying one instance of mouse doesn't mess with
		// other instances of mouse
		_mouseDestroy: function _mouseDestroy() {
			this.element.off("." + this.widgetName);
			if (this._mouseMoveDelegate) {
				this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate);
			}
		},

		_mouseDown: function _mouseDown(event) {

			// don't let more than one widget handle mouseStart
			if (mouseHandled) {
				return;
			}

			this._mouseMoved = false;

			// We may have missed mouseup (out of window)
			this._mouseStarted && this._mouseUp(event);

			this._mouseDownEvent = event;

			var that = this,
			    btnIsLeft = event.which === 1,


			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false;
			if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
				return true;
			}

			this.mouseDelayMet = !this.options.delay;
			if (!this.mouseDelayMet) {
				this._mouseDelayTimer = setTimeout(function () {
					that.mouseDelayMet = true;
				}, this.options.delay);
			}

			if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
				this._mouseStarted = this._mouseStart(event) !== false;
				if (!this._mouseStarted) {
					event.preventDefault();
					return true;
				}
			}

			// Click event may never have fired (Gecko & Opera)
			if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
				$.removeData(event.target, this.widgetName + ".preventClickEvent");
			}

			// These delegates are required to keep context
			this._mouseMoveDelegate = function (event) {
				return that._mouseMove(event);
			};
			this._mouseUpDelegate = function (event) {
				return that._mouseUp(event);
			};

			this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate);

			event.preventDefault();

			mouseHandled = true;
			return true;
		},

		_mouseMove: function _mouseMove(event) {

			// Only check for mouseups outside the document if you've moved inside the document
			// at least once. This prevents the firing of mouseup in the case of IE<9, which will
			// fire a mousemove event if content is placed under the cursor. See #7778
			// Support: IE <9
			if (this._mouseMoved) {

				// IE mouseup check - mouseup happened when mouse was out of window
				if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
					return this._mouseUp(event);

					// Iframe mouseup check - mouseup occurred in another document
				} else if (!event.which) {

					// Support: Safari <=8 - 9
					// Safari sets which to 0 if you press any of the following keys
					// during a drag (#14461)
					if (event.originalEvent.altKey || event.originalEvent.ctrlKey || event.originalEvent.metaKey || event.originalEvent.shiftKey) {
						this.ignoreMissingWhich = true;
					} else if (!this.ignoreMissingWhich) {
						return this._mouseUp(event);
					}
				}
			}

			if (event.which || event.button) {
				this._mouseMoved = true;
			}

			if (this._mouseStarted) {
				this._mouseDrag(event);
				return event.preventDefault();
			}

			if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
				this._mouseStarted = this._mouseStart(this._mouseDownEvent, event) !== false;
				this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event);
			}

			return !this._mouseStarted;
		},

		_mouseUp: function _mouseUp(event) {
			this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate);

			if (this._mouseStarted) {
				this._mouseStarted = false;

				if (event.target === this._mouseDownEvent.target) {
					$.data(event.target, this.widgetName + ".preventClickEvent", true);
				}

				this._mouseStop(event);
			}

			if (this._mouseDelayTimer) {
				clearTimeout(this._mouseDelayTimer);
				delete this._mouseDelayTimer;
			}

			this.ignoreMissingWhich = false;
			mouseHandled = false;
			event.preventDefault();
		},

		_mouseDistanceMet: function _mouseDistanceMet(event) {
			return Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance;
		},

		_mouseDelayMet: function _mouseDelayMet() /* event */{
			return this.mouseDelayMet;
		},

		// These are placeholder methods, to be overriden by extending plugin
		_mouseStart: function _mouseStart() /* event */{},
		_mouseDrag: function _mouseDrag() /* event */{},
		_mouseStop: function _mouseStop() /* event */{},
		_mouseCapture: function _mouseCapture() /* event */{
			return true;
		}
	});
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	// Internal use only
	return $.ui.escapeSelector = function () {
		var selectorEscape = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
		return function (selector) {
			return selector.replace(selectorEscape, "\\$1");
		};
	}();
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Keycode 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Keycode
//>>group: Core
//>>description: Provide keycodes as keynames
//>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {
	return $.ui.keyCode = {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	};
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	return $.ui.plugin = {
		add: function add(module, option, set) {
			var i,
			    proto = $.ui[module].prototype;
			for (i in set) {
				proto.plugins[i] = proto.plugins[i] || [];
				proto.plugins[i].push([option, set[i]]);
			}
		},
		call: function call(instance, name, args, allowDisconnected) {
			var i,
			    set = instance.plugins[name];

			if (!set) {
				return;
			}

			if (!allowDisconnected && (!instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11)) {
				return;
			}

			for (i = 0; i < set.length; i++) {
				if (instance.options[set[i][0]]) {
					set[i][1].apply(instance.element, args);
				}
			}
		}
	};
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {
	return $.ui.safeBlur = function (element) {

		// Support: IE9 - 10 only
		// If the <body> is blurred, IE will switch windows, see #9420
		if (element && element.nodeName.toLowerCase() !== "body") {
			$(element).trigger("blur");
		}
	};
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {
	return $.ui.safeActiveElement = function (document) {
		var activeElement;

		// Support: IE 9 only
		// IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
		try {
			activeElement = document.activeElement;
		} catch (error) {
			activeElement = document.body;
		}

		// Support: IE 9 - 11 only
		// IE may return null instead of an element
		// Interestingly, this only seems to occur when NOT in an iframe
		if (!activeElement) {
			activeElement = document.body;
		}

		// Support: IE 11 only
		// IE11 returns a seemingly empty object in some cases when accessing
		// document.activeElement from an <iframe>
		if (!activeElement.nodeName) {
			activeElement = document.body;
		}

		return activeElement;
	};
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Focusable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :focusable Selector
//>>group: Core
//>>description: Selects elements which can be focused.
//>>docs: http://api.jqueryui.com/focusable-selector/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	// Selectors
	$.ui.focusable = function (element, hasTabindex) {
		var map,
		    mapName,
		    img,
		    focusableIfVisible,
		    fieldset,
		    nodeName = element.nodeName.toLowerCase();

		if ("area" === nodeName) {
			map = element.parentNode;
			mapName = map.name;
			if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
				return false;
			}
			img = $("img[usemap='#" + mapName + "']");
			return img.length > 0 && img.is(":visible");
		}

		if (/^(input|select|textarea|button|object)$/.test(nodeName)) {
			focusableIfVisible = !element.disabled;

			if (focusableIfVisible) {

				// Form controls within a disabled fieldset are disabled.
				// However, controls within the fieldset's legend do not get disabled.
				// Since controls generally aren't placed inside legends, we skip
				// this portion of the check.
				fieldset = $(element).closest("fieldset")[0];
				if (fieldset) {
					focusableIfVisible = !fieldset.disabled;
				}
			}
		} else if ("a" === nodeName) {
			focusableIfVisible = element.href || hasTabindex;
		} else {
			focusableIfVisible = hasTabindex;
		}

		return focusableIfVisible && $(element).is(":visible") && visible($(element));
	};

	// Support: IE 8 only
	// IE 8 doesn't resolve inherit to visible/hidden for computed values
	function visible(element) {
		var visibility = element.css("visibility");
		while (visibility === "inherit") {
			element = element.parent();
			visibility = element.css("visibility");
		}
		return visibility !== "hidden";
	}

	$.extend($.expr[":"], {
		focusable: function focusable(element) {
			return $.ui.focusable(element, $.attr(element, "tabindex") != null);
		}
	});

	return $.ui.focusable;
});

/***/ }),
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _utils = __webpack_require__(4);

var _textfieldlisteners = __webpack_require__(5);

var _serverresponse = __webpack_require__(6);

var _userfeedback = __webpack_require__(18);

var _cal = __webpack_require__(7);

var _override = __webpack_require__(19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($) {

	$(function () {
		//global vars
		var selectedBalUser,
		    eventsToDelete = [],
		    eventsModified = {},
		    eventsConfirmed = [],
		    reservationSources = [],
		    reservationSourcesMap = {},
		    lastReservationResource = '',
		    lastBalClick = null,
		    userEmails = [],
		    erRentalDays = null,
		    releventRes = null,
		    persistentRelEvent = null,
		    eventCount = 0,
		    lastequipclick = $('.iam-existing-list li[selected]'),
		    updatedAccountTypes = {},
		    updatedRentalTypes = {},
		    userBalances = {},
		    eqLateFee = null,
		    availableTags,
		    comparableTags,
		    didLoadAllRes = false,
		    releventResEventStart = null;

		var debugSuccess = function debugSuccess() {
			$('#debug-success').removeClass('iam-ninja');
			$('#debug-success').fadeOut('500', function () {
				$(this).remove();
				$('.debug-wrap').append('<h1 class="iam-ninja" id="debug-success" style=" position: fixed; top:20%; left:35%; padding:10px; margin:0; display:inline; font-size:30px; background:#0bbf56; border-radius:8px; color:white;">SUCCESS</h1>');
			});
		};

		if ($('.debug-wrap').length > 0) {
			$('.make-dummy-res input[type=submit]').click(function (event) {
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'debug_make_res', mod: $('.make-dummy-res input[name=hour-mod]').val() },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						debugSuccess();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		}

		//url reload functions

		var getUrlArg = function getUrlArg(argname) {
			var url = new URL(window.location.href);
			return url.searchParams.get(argname);
		};

		var findItemAgain = function findItemAgain(list) {
			if (window.location.href.indexOf('&finditem=') == -1) return;

			var target = getUrlArg('finditem').split('_').join(' ');

			$.each(list.children('li'), function (index, el) {
				if ($(this).html().trim() == target) {
					$(this).click();
					return false;
				}
			});
		};

		var findTableItemAgain = function findTableItemAgain(table, colNum) {
			if (window.location.href.indexOf('&finditem=') == -1) return;

			var target = getUrlArg('finditem').split('_').join(' ');

			$.each(table.find('tbody').find('tr'), function (index, el) {
				if ($(this).find('td').eq(colNum).html().trim() == target) {
					$(this).click();
					return false;
				}
			});
		};

		var reloadAndFind = function reloadAndFind(target) {
			window.location.href = window.location.href + '&finditem=' + target.trim().split(' ').join('_');
		};

		//charge table

		var initChargeTableActions = function initChargeTableActions() {
			$.each($('tr'), function (index, val) {
				if (index != 0) {
					if ($(this).children('.iam-charge-table-approver').html() == 'n/a') {
						$(this).append('<td><div class="iam-button iam-approve-charge-button" data-status="0">approve</div></td>');
					} else {
						$(this).append('<td><div class="iam-secondary-button iam-approve-charge-button" data-status="1">cancel</div></td>');
					}
				}
			});
			initApproveChargeButtonListener();
		};

		var initChargeTable = function initChargeTable() {
			$.ajax({
				url: ajaxurl,
				type: 'GET',
				data: { action: 'admin_get_charge_table_json' },
				success: function success(data) {
					data = JSON.parse(data);
					makeEditableTableHeaders(data, '#iam-table-container', 'iam-charge-table');
					initSearchWithTableDataSetListener($('.iam-search'), data['data'], ['username', 'email', 'account_type', 'certifications', 'equipment_used', 'Charge_Description', 'date', 'approver', 'Comment', 'values'], function (searchResults) {
						$('#iam-table-container').pagination({
							position: 'top',
							pageSize: 5,
							dataSource: searchResults,
							callback: function callback(pgData, pagination) {
								makeEditableTableBody(pgData, '#iam-table-container', 'iam-charge-table', chargeTableEditingCallback);
								initChargeTableActions();
							}
						});
					});
					updateSearch();
				},
				error: function error(data) {
					(0, _serverresponse.handleServerError)(data, new Error());
				}
			});
		};

		var editableTableRowData = [];

		var makeEditableTableHeaders = function makeEditableTableHeaders(json, container, tableName) {
			var table = '<table id="' + tableName + '"><thead><tr class="table-header">',
			    rowData = [];
			for (var i = 0; i < json.metadata.length; i++) {
				var editMark = json.metadata[i]['editable'] ? '<b style="color:red;">*</b>' : '';
				table += '<th>' + json.metadata[i]['label'] + editMark + '</th>';
				editableTableRowData.push(json.metadata[i]);
			}
			table += '</tr></thead><tbody></tbody></table>';
			$(container).append(table);
		};

		var makeEditableTableBody = function makeEditableTableBody(json, container, tableName, finishEditingCallback) {
			if (typeof json == 'string') {
				json = JSON.parse(json);
			}
			if (typeof finishEditingCallback === 'undefined') {
				finishEditingCallback = function finishEditingCallback() {
					//do nothing;
				};
			}
			var tbody = '',
			    rowData = [];
			for (var i = 0; i < json.length; i++) {
				tbody += '<tr data-id="' + json[i].id + '">';
				for (var k = 0; k < editableTableRowData.length; k++) {
					var d = json[i].values;
					var val = d[editableTableRowData[k].name];
					var editClass = editableTableRowData[k].editable ? 'table-editable' : '';
					switch (editableTableRowData[k].datatype) {
						case 'varchar':
							tbody += '<td class="' + tableName + '-' + editableTableRowData[k].name + ' table-varchar ' + editClass + '" data-field="' + editableTableRowData[k].name + '">' + val;
							break;
						case 'text':
							tbody += '<td class="' + tableName + '-' + editableTableRowData[k].name + ' table-text ' + editClass + '" data-field="' + editableTableRowData[k].name + '">' + val;
							break;
					}
					tbody += '</td>';
				}
				tbody += '</tr>';
			}
			$(container).find('tbody').empty();
			$(container).find('tbody').append(tbody);
			editableTableTDListener(tableName, finishEditingCallback);
		};
		var editableTableTDListener = function editableTableTDListener(tableName, finishEditingCallback) {
			$('table#' + tableName + ' td.table-editable').click(function (event) {
				$(this).off();
				if ($(this).hasClass('table-varchar')) {
					$(this).html('<input type="text" class="table-active-varchar table-active-data" value="' + $(this).html() + '">');
				} else if ($(this).hasClass('table-text')) {
					$(this).html('<textarea class="table-active-text table-active-data">' + $(this).html() + '</textarea>');
				} else {
					alert('an error occured while editing the row! :(');
					return;
				}
				$('.table-active-data').focus();
				$('.table-active-data').blur(function (event) {
					var td = $(this).parents('td'),
					    ele = td[0],
					    v = null;
					if ($(this).hasClass('table-active-varchar')) {
						v = $(this).val();
						td.html(v);
					} else if ($(this).hasClass('table-active-text')) {
						v = $(this).val();
						td.html(v);
					}
					$('table#' + tableName + ' td.table-editable').off();
					editableTableTDListener(tableName, finishEditingCallback);
					finishEditingCallback(ele, td.parents('tr').data('id'), td.data('field'), v);
				});
			});
		};
		var chargeTableEditingCallback = function chargeTableEditingCallback(ele, rowID, rowField, rowVal) {
			(0, _userfeedback.submissionStart)();
			$.ajax({
				url: ajaxurl,
				type: 'POST',
				data: { action: 'admin_update_charge_row', id: rowID, field: rowField, val: rowVal },
				success: function success(data) {
					(0, _serverresponse.handleServerResponse)(data);
					(0, _userfeedback.submissionEnd)();
				},
				error: function error(data) {
					(0, _serverresponse.handleServerError)(data, new Error());
					(0, _userfeedback.submissionEnd)();
				}
			});
		};

		var copyToClipboard = function copyToClipboard(elem) {
			// create hidden text element, if it doesn't already exist
			var targetId = "_hiddenCopyText_";
			var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
			var origSelectionStart, origSelectionEnd;
			if (isInput) {
				// can just use the original source element for the selection and copy
				target = elem;
				origSelectionStart = elem.selectionStart;
				origSelectionEnd = elem.selectionEnd;
			} else {
				// must use a temporary form element for the selection and copy
				target = document.getElementById(targetId);
				if (!target) {
					var target = document.createElement("textarea");
					target.style.position = "absolute";
					target.style.left = "-9999px";
					target.style.top = "0";
					target.id = targetId;
					document.body.appendChild(target);
				}
				target.textContent = elem.textContent;
			}
			// select the content
			var currentFocus = document.activeElement;
			target.focus();
			target.setSelectionRange(0, target.value.length);

			// copy the selection
			var succeed;
			try {
				succeed = document.execCommand("copy");
			} catch (e) {
				succeed = false;
			}
			// restore original focus
			if (currentFocus && typeof currentFocus.focus === "function") {
				currentFocus.focus();
			}

			if (isInput) {
				// restore prior selection
				elem.setSelectionRange(origSelectionStart, origSelectionEnd);
			} else {
				// clear temporary content
				target.textContent = "";
			}
			return succeed;
		};

		var eventToolTip = function eventToolTip(event, element) {
			var e = $(element);
			e.attr('title', 'Name: ' + event.fullname + '\n Email: ' + event.email + ' \n Equipment: ' + event.equipment);
		};

		var makeSubmitPopup = function makeSubmitPopup(heading, body, callback, a) {
			$('body').append('<div class="iam-popup iam-submit-popup" style="width:150px;left:30%;"><div class="iam-popup-header">' + heading + '<i style="float:right;" class="fa fa-close fa-3 iam-submit-popup-close"></i></div><div class="iam-popup-body">' + body + '<br/><input type="submit" class="iam-popup-submit iam-autheticate-submit"></div></div>');
			initClosePopupListener();
			$('.iam-submit-popup input[type=submit]').click(function (event) {
				callback(a);
				$('.iam-popup').remove();
			});
		};

		var initClosePopupListener = function initClosePopupListener() {
			$('.iam-submit-popup-close').click(function (event) {
				$('.iam-popup').remove();
			});
		};

		var unsupportedFile = function unsupportedFile(element) {
			element.value = null;
			alert('Unsupported file type!\n Supported file types: .pdf, .doc, .jpg, .jpeg, .png');
		};

		var tooManyFiles = function tooManyFiles(element) {
			element.value = null;
			alert('One file per upload field!');
		};

		var checkFile = function checkFile(element) {
			//TODO: check file size
			if (element.files.length > 1) {
				tooManyFiles();
				return false;
			}
			if (window.FileReader && window.Blob) {
				var blob = element.files[0];
				var fileReader = new FileReader();
				fileReader.onloadend = function (e) {
					var arr = new Uint8Array(e.target.result).subarray(0, 4);
					var header = "";
					for (var i = 0; i < arr.length; i++) {
						header += arr[i].toString(16);
					}
					header.toLowerCase();
					switch (header) {
						case "ffd8ffdb":
						case "ffd8ffe0":
						case "ffd8ffe1":
						case "ffd8ffe2":
							//jpeg or jpg
							break;
						case "89504E47":
						case "89504e47":
							//png
							break;
						case "25504446":
							//application/pdf
							break;
						case "d0cf11e0":
						case "D0CF11E0":
							//msoffice file
							var ext = blob.name.trim().split('.');
							ext = ext[ext.length - 1];
							if (ext.toLowerCase() !== 'doc') {
								unsupportedFile(element);
							}
							break;
						default:
							unsupportedFile(element);
							break;
					}
				};
				fileReader.readAsArrayBuffer(blob);
			} else {
				console.warn("FILE APIs not supported");
			}
		};

		var updateExistingFiles = function updateExistingFiles() {
			$.ajax({
				url: ajaxurl,
				type: 'GET',
				data: { action: 'admin_update_existing_file_list', x: $('#x').val() },
				success: function success(data) {
					data = (0, _serverresponse.handleServerResponse)(data);
					$('#iam-existing-files').empty();
					$('#iam-existing-files').append(data);
				},
				error: function error(data) {
					(0, _serverresponse.handleServerError)(data, new Error());
				}
			});
		};

		var make_id = function make_id(element_id) {
			if (element_id.substring(0, 1) != "#") element_id = "#" + element_id;
			return element_id;
		};

		var prepare_new_form = function prepare_new_form(form_name) {
			form_name = make_id(form_name);
			var children = $(form_name).children();
			for (var i = 0; i < children.length; i++) {
				var current = children[i];
				if (current.tagName == "INPUT") {
					current.attr('value', '');
				} else if (current.tagName == "TEXTAREA") {
					current.html('');
				}
			}
		};

		var image_sizer = function image_sizer(img_element) {
			if ($(img_element).attr('data-size') == 'large') {
				$(img_element).attr('data-size', 'small');
				$(img_element).width($(img_element).width() / 2);
			} else {
				$(img_element).attr('data-size', 'large');
				$(img_element).width($(img_element).width() * 2);
			}
		};

		var swap_visible_forms = function swap_visible_forms() {
			if ($('#iam-update-form').length < 1) {
				$('#iam-new-form').toggleClass('iam-ninja');
				return;
			}
			if ($('#iam-new-form').hasClass('iam-ninja')) {
				$('#iam-new-form').removeClass('iam-ninja');
				$('#iam-update-form').addClass('iam-ninja');
			} else {
				$('#iam-update-form').removeClass('iam-ninja');
				$('#iam-new-form').addClass('iam-ninja');
			}
		};

		var make_form_visible = function make_form_visible(name) {
			name = make_id(name);
			if (!$(name).hasClass('iam-ninja')) return;
			swap_visible_forms();
		};

		var loadComparableTags = function loadComparableTags() {
			$.ajax({
				url: ajaxurl,
				type: 'GET',
				async: false,
				data: { action: 'admin_get_tags', request: 'all' },
				success: function success(data) {
					availableTags = (0, _serverresponse.handleServerResponse)(data);
					comparableTags = [];
					for (var i = 0; i < availableTags.length; i++) {
						comparableTags.push(availableTags[i].toLowerCase());
					}
				},
				error: function error(data) {
					(0, _serverresponse.handleServerError)(data, new Error());
				}
			});
		};

		//MULTI-PAGE LISTENERS

		var updateSearchOnLoad = function updateSearchOnLoad() {
			if ($('.iam-search').val().length > 0) {
				$('.iam-search').keyup();
			}
		};

		var updateSearch = function updateSearch() {
			if ($('.iam-search').next('input[type=submit]').length > 0) $('.iam-search').next('input[type=submit]').click();else $('.iam-search').keyup();
		};

		var paginationRefresh = function paginationRefresh() {
			$('.paginationjs-page.active').click();
		};

		var initSearchWithTableDataSetListener = function initSearchWithTableDataSetListener(searchElement, dataset, fields, searchCallback) {
			$(searchElement).next('input[type=submit]').click(function (event) {
				(0, _userfeedback.submissionStart)();
				var targetString = $(searchElement).val();
				if (targetString == '') {
					searchCallback(dataset);
					(0, _userfeedback.submissionEnd)();
					event.preventDefault();
					return false;
				}
				var filtered = dataset.filter(function (a) {
					return dataContainsString(targetString, a, fields);
				});
				searchCallback(filtered);
				(0, _userfeedback.submissionEnd)();
				event.preventDefault();
				return false;
			});
		};

		var dataContainsString = function dataContainsString(string, data, fields) {
			var add = false;
			for (var key in data) {
				if (fields.indexOf(key) == -1 && fields.length > 0) continue;
				var val = data[key];
				if (typeof val == 'string') {
					if (val.indexOf(string) != -1) add = true;
				} else if (Array.isArray(val)) {
					add = dataContainsString(string, val, fields);
				} else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) == 'object') {
					//debugger;
					add = dataContainsString(string, val, fields);
				}
				if (add) return true;
			}
			return add;
		};

		var initSearchListener = function initSearchListener(searchElement, elementWithText, parents) {
			$(searchElement).keyup(function (event) {
				$(elementWithText).each(function (index, el) {
					if ($(this).text().toLowerCase().indexOf($(searchElement).val().toLowerCase()) == -1) {
						var hideable = $(this);
						for (var i = 0; i < parents; i++) {
							hideable = hideable.parent();
						}
						hideable.addClass('iam-ninja');
					} else {
						var hideable = $(this);
						for (var i = 0; i < parents; i++) {
							hideable = hideable.parent();
						}
						hideable.removeClass('iam-ninja');
					}
					if ($(searchElement).val().length == 0) {
						var hideable = $(this);
						for (var i = 0; i < parents; i++) {
							hideable = hideable.parent();
						}
						hideable.removeClass('iam-ninja');
					}
				});
			});
		};

		var initDeleteFormListener = function initDeleteFormListener(formtype) {
			$('.iam-delete-form').click(function (event) {
				if (confirm("Are you sure you want to delete " + $('#iam-update-form #name').val() + "?") === true) {
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: { action: 'admin_delete_form', x: $('#x').val(), type: formtype },
						success: function success(data) {
							(0, _serverresponse.handleServerResponse)(data);
							window.location.reload();
						},
						error: function error(data) {
							(0, _serverresponse.handleServerError)(data, new Error());
						}
					});
				}
			});
		};

		var initExistingFileListener = function initExistingFileListener() {
			$('.iam-existing-upload-x').click(function (event) {
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_delete_supporting_file', filename: $(this).parent().text() },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						updateExistingFiles();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var initImageListener = function initImageListener() {
			$('.iam-image').click(function (event) {
				image_sizer(this);
			});
		};

		//MAIN MENU LISTENERS

		var initRentalTypeRowListener = function initRentalTypeRowListener() {
			$('.rental-duration').off();
			(0, _textfieldlisteners.numbersOnlyListener)($('.rental-duration'));
			//detects changes in account and type
			$('.rental-duration').change(function (event) {
				var n = $(this).closest('tr').data('id');
				if (n == '') {
					return;
				}
				updatedRentalTypes[$(this).closest('tr').data('id')] = {
					'label': $(this).closest('tr').find('.rental-label').val(),
					'duration': $(this).val()
				};
			});
			$('.rental-label').change(function (event) {
				var n = $(this).closest('tr').data('id');
				if (typeof n == 'undefined' || n == '') {
					return;
				}
				updatedRentalTypes[$(this).closest('tr').data('id')] = {
					'duration': $(this).closest('tr').find('.rental-duration').val(),
					'label': $(this).val()
				};
			});
			initDeleteRentalTypeButtonListener();
		};

		var initAddRentalTypeButtonListener = function initAddRentalTypeButtonListener() {
			$('.iam-add-rental-type').click(function (event) {
				if ($('.iam-rental-type-form .iam-no-data-row').length > 0) {
					$('.iam-rental-type-form .iam-no-data-row').remove();
				}
				$('.iam-rental-type-form table tbody').append('<tr data-id=""><td><label>Label: <input type="text" class="rental-label"></label></td><td><label>Duration (in days): <input type="number" class="rental-duration"></label></td><td><i class="iam-delete-rental-type fa fa-close fa-3"></i></td></tr>');
				initRentalTypeRowListener();
			});
		};

		var initDeleteRentalTypeButtonListener = function initDeleteRentalTypeButtonListener() {
			$('.iam-delete-rental-type').off();
			$('.iam-delete-rental-type').click(function (event) {
				var toDelete = $(this).parent().parent().find('.rental-label').val();
				var list = '<select class="iam-select iam-delete-rental-type-select">';
				$('.rental-label').each(function (index, el) {
					if ($(this).val() != toDelete) {
						list += '<option value="' + $(this).closest('tr').data('id') + '">' + $(this).val() + '</option>';
					}
				});
				list += '</select>';
				deleteRentalTypeListener.bind(this);
				if ($(this).parent().parent().data('id') == '') {
					$(this).parent().parent().remove();
					return;
				}
				makeSubmitPopup('Delete Rental Type', '<p style="color:red;">Deleting: ' + toDelete + '</p><p>Select a replacement rental type for equipment that currently have ' + toDelete + '.</p>' + list, deleteRentalTypeListener, [$(this).closest('tr')]);
			});
		};

		var deleteRentalTypeListener = function deleteRentalTypeListener(a) {
			$.ajax({
				url: ajaxurl,
				type: 'POST',
				data: { action: 'admin_delete_rental_type', replacement: $('.iam-delete-rental-type-select').val(), toDelete: a[0].data('id') },
				success: function success(data) {
					(0, _serverresponse.handleServerResponse)(data);
					a[0].remove();
				},
				error: function error(data) {
					(0, _serverresponse.handleServerError)(data, new Error());
				}
			});
		};

		var initSubmitRentalTypeListener = function initSubmitRentalTypeListener() {
			$('.iam-rental-types-submit').click(function (event) {
				(0, _userfeedback.submissionStart)();
				var newTypes = [];
				$('.iam-rental-type-form table tbody tr').each(function (index, el) {
					if ($(this).data('id') == '' && $(this).find('.rental-label').val().length > 0 && $(this).find('.rental-duration').val().length > 0) {
						var duration = $(this).find('.rental-duration').val();
						newTypes.push({
							'label': $(this).find('.rental-label').val(),
							'duration': duration
						});
					}
				});
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_update_rental_type', updated_rental_types: updatedRentalTypes, new_rental_types: newTypes },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var initAccountTypeRowListener = function initAccountTypeRowListener() {
			$('.iam-account-discount').off();
			(0, _textfieldlisteners.numbersOnlyListener)($('.iam-account-discount'));
			(0, _textfieldlisteners.maxLengthListener)($('.iam-account-discount'), 3);
			//detects changes in account and type
			$('.iam-account-discount').change(function (event) {
				var n = $(this).parent().parent().data('nid');
				if (typeof n == 'undefined' || n == '') {
					return;
				}
				updatedAccountTypes[$(this).parent().parent().data('nid')] = {
					'type': $(this).parent().parent().children('td').children('.iam-account-type').val(),
					'discount': $(this).val()
				};
			});
			$('.iam-account-type').change(function (event) {
				var n = $(this).parent().parent().data('nid');
				if (typeof n == 'undefined' || n == '') {
					return;
				}
				updatedAccountTypes[$(this).parent().parent().data('nid')] = {
					'discount': $(this).parent().parent().children('td').children('.iam-account-discount').val(),
					'type': $(this).val()
				};
			});
			initDeleteAccountTypeButtonListener();
		};

		var initAddAccountTypeButtonListener = function initAddAccountTypeButtonListener() {
			$('.iam-add-account-type').click(function (event) {
				if ($('.iam-account-type-form .iam-no-data-row').length > 0) {
					$('.iam-account-type-form .iam-no-data-row').remove();
				}
				$('.iam-account-type-form table tbody').append('<tr data-nid=""><td><label>Account Type</label><br /><label>Discount (0-100)</label></td>	<td><input type="text" placeholder="example: student, faculty, alumni" class="iam-account-type"><br /><input type="number" class="iam-account-discount"></td><td><i class="iam-delete-account-type fa fa-close fa-3"></i></td></tr>');
				initAccountTypeRowListener();
			});
		};

		var initDeleteAccountTypeButtonListener = function initDeleteAccountTypeButtonListener() {
			$('.iam-delete-account-type').off();
			$('.iam-delete-account-type').click(function (event) {
				var toDeleteAccountType = $(this).parent().parent().children('td').children('.iam-account-type').val();
				var list = '<select class="iam-select iam-delete-account-type-select">';
				$('.iam-account-type').each(function (index, el) {
					if ($(this).val() != toDeleteAccountType) {
						list += '<option value="' + $(this).val() + '">' + $(this).val() + '</option>';
					}
				});
				list += '</select>';
				deleteAccountTypeListener.bind(this);
				if ($(this).parent().parent().data('nid') == '') {
					$(this).parent().parent().remove();
					return;
				}
				makeSubmitPopup('Delete Account Type', '<p style="color:red;">Deleting: ' + toDeleteAccountType + '</p><p>Select a replacement account type for users who currently have ' + toDeleteAccountType + '.</p>' + list, deleteAccountTypeListener, [$(this).parent().parent()]);
			});
		};

		var deleteAccountTypeListener = function deleteAccountTypeListener(a) {
			$.ajax({
				url: ajaxurl,
				type: 'POST',
				data: { action: 'admin_delete_account_type', replacement: $('.iam-delete-account-type-select').val(), nid: a[0].data('nid') },
				success: function success(data) {
					(0, _serverresponse.handleServerResponse)(data);
					a[0].remove();
				},
				error: function error(data) {
					(0, _serverresponse.handleServerError)(data, new Error());
				}
			});
		};

		var initSubmitAccountTypeListener = function initSubmitAccountTypeListener() {
			$('.iam-account-types-submit').click(function (event) {
				(0, _userfeedback.submissionStart)();
				var newAccountTypes = [];
				$('.iam-account-type-form table tbody tr').each(function (index, el) {
					if (typeof $(this).data('id') == 'undefined' && $(this).children('td').children('.iam-account-type').val().length > 0) {
						var discount = $(this).children('td').children('.iam-account-discount').val();
						discount = discount > 0 ? discount : 0;
						newAccountTypes.push({
							'type': $(this).children('td').children('.iam-account-type').val(),
							'discount': discount
						});
					}
				});
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_update_account_type', updated_account_types: updatedAccountTypes, new_account_types: newAccountTypes },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};
		/*
  		  	var reportBugListener = function () {
  				$('.iam-report-bug-box input[type=submit]').click(function(event) {
  					submissionStart();
  					$.ajax({
  						url: ajaxurl,
  						type: 'POST',
  						data: {action: 'admin_report_bug', from: $('.iam-report-bug-from').val(), subject: $('.iam-report-bug-subject').val(), message: $('.iam-report-bug-message').val()},
  						success: function (data) {
  							submissionEnd();
  							$('.iam-report-bug-box').html('<h1>Report a Bug</h1><input type="text" class="iam-report-bug-from" placeholder="From"><br><input type="text" class="iam-report-bug-subject" placeholder="Subject"><br><textarea class="iam-report-bug-message" placeholder="Describe the bug here." cols="50" rows="5"></textarea><br><input type="submit">');
  							reportBugListener();
  							alert("sent!");
  
  						},
  						error: function (data) {
  							handleServerError(data, new Error());
  						}
  					});
  				});
  			}*/

		var adminSettingsListener = function adminSettingsListener() {
			$('.iam-settings-submit').click(function (event) {
				(0, _userfeedback.submissionStart)();
				if (!(0, _utils.isEmail)($('.iam-training-page-email').val())) {
					alert('Please enter a valid email address.');
					(0, _userfeedback.submissionEnd)();
					return;
				}
				var newSettings = { action: 'admin_update_settings' };
				if ($('.iam-late-charge-fee').length > 0) newSettings.late_charge_fee = $('.iam-late-charge-fee').val();
				if ($('.iam-ipad-code').length > 0) newSettings.ipad_code = $('.iam-ipad-code').val();
				if ($('.iam-training-page-email').length > 0) newSettings.training_email = $('.iam-training-page-email').val();
				if ($('.iam-late-reservations-email').length > 0) newSettings.late_reservations_email = $('.iam-late-reservations-email').val();
				if ($('.iam-fab-lab-email').length > 0) newSettings.fab_lab_email = $('.iam-fab-lab-email').val();
				if ($('.iam-equipment-room-email').length > 0) newSettings.equipment_room_email = $('.iam-equipment-room-email').val();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: newSettings,
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		//EQUIPMENT LISTENERS

		var initSubmitEquipmentFormListener = function initSubmitEquipmentFormListener() {
			$('.iam-admin-submit-button').off();
			$('.iam-admin-submit-button').click(function (event) {
				(0, _userfeedback.submissionStart)();
				var form = $('form#iam-update-form').hasClass('iam-ninja') ? $('form#iam-new-form') : $('form#iam-update-form');
				var method = form.attr('id') == 'iam-new-form' ? 'n' : 'u';
				var outOfOrder = form.children('.iam-form-row').children('#out-of-order').is(':checked') ? 1 : 0;
				var slideShow = form.children('.iam-form-row').children('#slide-show').is(':checked') ? 1 : 0;
				var tagsVal = form.children('.iam-form-row').children('.tags').val().trim();
				if (tagsVal.substring(tagsVal.length - 1) == ',') {
					tagsVal = tagsVal.substring(0, tagsVal.length - 1);
				}
				var equip_tags = tagsVal == '' ? [] : tagsVal.split(',');
				var new_tags = [];
				for (var i = 0; i < equip_tags.length; i++) {
					equip_tags[i] = equip_tags[i].trim();
					if (comparableTags.indexOf(equip_tags[i].toLowerCase()) == -1) {
						new_tags.push(equip_tags[i]);
					}
				};
				var formData = new FormData();
				if (form.children('.iam-form-row').children('#photo').val() != '') {
					formData.append('photo', form.children('.iam-form-row').children('#photo').prop('files')[0]);
				}
				formData.append('method', method);
				formData.append('action', 'admin_equipment_action');
				formData.append('name', form.children('.iam-form-row').children('#name').val());

				formData.append('certification', form.children('.iam-form-row').children('#certification').val());
				formData.append('description', form.children('.iam-form-row').children('#description').val());
				formData.append('pricing-description', form.children('.iam-form-row').children('#pricing-description').val());
				formData.append('internal-comments', form.children('.iam-form-row').children('#internal-comments').val());
				formData.append('manufacturer-info', form.children('.iam-form-row').children('#manufacturer-info').val());
				if ($('.iam-rental-types-list').length > 0) formData.append('rental_type', form.find('.iam-rental-types-list').val());
				formData.append('out-of-order', outOfOrder);
				formData.append('on-slide-show', slideShow);
				formData.append('tags', equip_tags);
				formData.append('new_tags', new_tags);

				if (method == 'u') formData.append('x', form.children('.iam-form-row').children('#x').val());
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						reloadAndFind(form.children('.iam-form-row').children('#name').val());
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
						(0, _userfeedback.submissionEnd)();
					}
				});
			});
		};

		var initTagAutoCompleteListener = function initTagAutoCompleteListener() {
			//jquery ui code from http://jqueryui.com/autocomplete/#multiple
			function split(val) {
				return val.split(/,\s*/);
			}
			function extractLast(term) {
				return split(term).pop();
			}

			$('.tags').bind("keydown", function (event) {
				if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
					event.preventDefault();
				}
			}).autocomplete({
				minLength: 0,
				source: function source(request, response) {
					// delegate back to autocomplete, but extract the last term
					response($.ui.autocomplete.filter(availableTags, extractLast(request.term)));
				},
				focus: function focus() {
					// prevent value inserted on focus
					return false;
				},
				select: function select(event, ui) {
					var terms = split(this.value);
					// remove the current input
					terms.pop();
					// add the selected item
					terms.push(ui.item.value);
					// add placeholder to get the comma-and-space at the end
					terms.push("");
					this.value = terms.join(", ");
					return false;
				}
			});
		};

		var initNewEquipmentButtonListener = function initNewEquipmentButtonListener() {
			$('#iam-new-equipment-button').click(function (event) {
				make_form_visible('#iam-new-form');
				prepare_new_form('#iam-new-form');
			});
		};

		var initDuplicateEquipmentButtonListener = function initDuplicateEquipmentButtonListener() {
			$('#iam-duplicate-equipment-button').click(function (event) {
				(0, _userfeedback.submissionStart)();

				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'duplicate_equipment', nid: $('#iam-update-form').children('.iam-form-row').children('#x').val() },
					success: function success(data) {
						reloadAndFind((0, _serverresponse.handleServerResponse)(data));
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var updateEquipmentEvents = function updateEquipmentEvents(newData) {
			for (var i in newData) {
				var c = newData[i];
				$('.iam-reservations-equipment-list-item[data-nid=' + i + ']').data('calevents', c);
			}
		};

		var initCheckinCheckout = function initCheckinCheckout() {
			userEmails = $('.iam-on-load-data').data('users').split(',');
			$('.iam-er-user-emails').autocomplete({
				source: userEmails
			});

			userBalances = $('.iam-on-load-data').data('balances');

			eqLateFee = $('.iam-on-load-data').data('fee');

			$('.iam-on-load-data').remove();
		};

		var makeRelevantReservation = function makeRelevantReservation(event) {
			releventRes = event._id;
			refreshResCal();
		};

		var updateEventsModified = function updateEventsModified(event) {
			if (typeof event.nid != 'undefined') eventsModified[event.nid] = { start: event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss') };
		};

		var initRentalButton = function initRentalButton() {
			if (erRentalDays == null) {
				var erInfo = $('.iam-facility-data').data('facility');
				erRentalDays = erInfo['rental_period'];
			}
			$('.iam-er-action-button').off();
			$('.iam-er-action-button.iam-er-checkout').off();
			$('.iam-er-action-button.iam-er-checkout').click(function (event) {
				resetEvents();
				if ($('.iam-er-user-emails').val() == '') {
					alert('please enter an email.');
					return;
				}

				try {
					if (eqLateFee > userBalances[$('.iam-er-user-emails').val()]) {
						alert('This user has less than the late fee amount of $' + eqLateFee + '. They will not be able to pay late fees if they keep the equipment late. User balance: $' + userBalances[$('.iam-er-user-emails').val()]);
					}
				} catch (error) {
					//nothing
				}

				$('.modal-header .fc-event').removeClass('iam-ninja');

				$('#myModal').modal('show');

				$('#myModal .modal-footer .btn-primary').off();

				$('#myModal .modal-footer .btn-primary').click(function (event) {
					if ($('.relevant-res').length < 1) {
						alert('No Reservation Selected.');
						return;
					}

					var relRes = $('.relevant-res'),
					    chosen = null;
					if (typeof relRes.data('nid') != 'undefined') {

						chosen = { nid: relRes.data('nid'),
							equipment: equip_name.split('_').join(' ') };
					} else {
						var events = $('.iam-cal').fullCalendar('clientEvents');

						for (var i = 0; i < events.length; i++) {
							if (events[i]._id == releventRes) {
								releventResEventStart = events[i].start.format('YYYY-MM-DD');
								chosen = {
									user: useremail,
									equipment: equip_name.split('_').join(' '),
									start: events[i].start.format('YYYY-MM-DD HH:mm:ss'),
									end: events[i].end.format('YYYY-MM-DD HH:mm:ss')
								};
							}
						}
					}

					if (chosen === null || releventResEventStart === null) {
						alert("Error selecting reservation.");
						return;
					}
					console.log(releventResEventStart);
					console.log(moment().format('YYYY-MM-DD'));

					if (releventResEventStart != moment().format('YYYY-MM-DD')) {
						alert("Please choose a rental period that begins today.");
						return;
					}

					(0, _userfeedback.submissionStart)();
					$('#myModal').modal('hide');
					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: { action: 'admin_update_reservations', to_delete: eventsToDelete, modified: eventsModified, sendEmails: false, reason: '', facility: $('.iam-reservation-wrap').data('facility'), load_all: didLoadAllRes },
						success: function success(data) {
							updateEquipmentEvents((0, _serverresponse.handleServerResponse)(data));
							makeCalendarReservationsMulti();
							(0, _userfeedback.submissionEnd)();
						},
						error: function error(data) {
							(0, _serverresponse.handleServerError)(data, new Error());
						}
					});

					$.ajax({
						url: ajaxurl,
						type: 'POST',
						data: { action: 'admin_bind_rental', ev: chosen },
						success: function success(data) {
							(0, _serverresponse.handleServerResponse)(data);
							resetEvents();
							(0, _userfeedback.submissionEnd)();
							lastequipclick.data('rented-to', useremail);
							updateForRentalStatus(useremail);
						},
						error: function error(data) {
							(0, _serverresponse.handleServerError)(data, new Error());
						}
					});
				});

				$('#myModal .modal-footer .btn-secondary').off();
				$('#myModal .modal-footer .btn-secondary').click(function (event) {
					resetEvents();
				});

				$('.iam-cal').remove();
				$('.modal-body').append('<div class="iam-cal"></div>');

				var equip_name = $('#iam-update-form input#name').data('original').split(' ').join('_');
				var useremail = $('.iam-er-user-emails').val();
				var thisRentalDays = $('.iam-rental-types-list').data('onload-duration') > 0 ? $('.iam-rental-types-list').data('onload-duration') : erRentalDays;

				$('.modal-header .fc-event').each(function () {

					// store data so the calendar knows to render an event upon drop
					$(this).data('event', {
						title: "Drag Me", // use the element's text as the event title
						stick: true, // maintain when user navigates (see docs on the renderEvent method)
						editable: true,
						className: 'iam-new-event',
						allDay: true
					});

					// make the event draggable using jQuery UI
					$(this).draggable({
						zIndex: 999,
						revert: true, // will cause the event to go back to its
						revertDuration: 0 //  original position after the drag
					});
				});

				$('.iam-cal').fullCalendar({
					header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek'
					},
					droppable: true,
					eventOverlap: true,
					weekends: true,
					height: 600,
					forceEventDuration: true,
					defaultView: 'month',
					editable: true,
					durationEditable: true,
					allDay: true,
					defaultAllDayEventDuration: { days: parseInt(thisRentalDays) + 1 },
					eventLimit: true, // allow "more" link when too many events
					eventRender: function eventRender(event, element) {
						$(element).data('fullname', event.fullname);
						$(element).data('email', event.email);
						$(element).data('equipment', event.equipment);

						$(element).data('nid', event.nid);

						if (typeof event.nid == 'undefined' && typeof event.isNewbie == 'undefined') {

							$('.modal-header .fc-event').addClass('iam-ninja');
							releventRes = event._id;
							$(element).addClass('relevant-res');
						}

						if (releventRes == event._id) {
							$(element).addClass('relevant-res');
							releventResEventStart = moment(event.start.format('YYYY-MM-DD'), 'YYYY-MM-DD').format('YYYY-MM-DD');
						}

						if (event.editable == false) {
							$(element).addClass('event-not-editable');
						}

						if (eventsToDelete.indexOf(event.nid) != -1) {
							$(element).addClass('marked-for-delete');
						}

						eventToolTip(event, element);
					},
					eventAfterAllRender: function eventAfterAllRender(view) {
						var events = $('.iam-cal').fullCalendar('clientEvents');
						var toUpdate = [];
						for (var i = 0; i < events.length; i++) {
							var ev = events[i];

							if (typeof ev.nid == 'undefined' && typeof ev.isNewbie == 'undefined') {
								ev.isNewbie = 1;
								toUpdate.push(ev);
							}

							if (ev.email != useremail && typeof ev.nid != 'undefined' && (ev.editable == true || typeof ev.editable == 'undefined') || ev.status != 'upcoming' && typeof ev.status != 'undefined' && (ev.editable == true || typeof ev.editable == 'undefined')) {

								ev.editable = false;
								toUpdate.push(ev);
							}
						}
						if (toUpdate.length > 0) {
							$('.iam-cal').fullCalendar('updateEvents', toUpdate);
						}
						initContextMenu('rental');
					},
					eventDrop: function eventDrop(event, d, revert) {
						if ((0, _cal.eventFallsOnWeekend)(event)) {
							(0, _override.overridePrompt)({
								title: 'Confirm Override',
								body: _cal.ERinvalidTimePrompt,
								cancel: function cancel() {
									revert();
								},
								override: function override() {
									updateEventsModified(event);
								}
							});
						} else {
							updateEventsModified(event);
						}
					},
					eventResize: function eventResize(event, d, revert, jsevent) {
						if ((0, _cal.eventIsLongerThan)(event, parseInt(thisRentalDays) + 1)) {
							(0, _override.overridePrompt)({
								title: 'Confirm Override',
								body: _cal.ERinvalidTimePrompt, //'The maximum rental time for this equipment is ' + thisRentalDays + ' days.',
								cancel: function cancel() {
									revert();
								},
								override: function override() {
									updateEventsModified(event);
								}
							});
						} else {
							updateEventsModified(event);
						}
					},
					eventReceive: function eventReceive(e) {
						if ((0, _cal.eventFallsOnWeekend)(e)) {
							$('.iam-res-cal').fullCalendar('removeEvents', e._id);
							return false;
						}
					},
					events: ajaxurl + "?action=get_equipment_calendar&allDay=y&is=y&descriptive=y&name=" + equip_name
				});
			});

			$('.iam-er-action-button.iam-er-checkin').off();
			$('.iam-er-action-button.iam-er-checkin').click(function (event) {
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_end_rental', equipment: $('#iam-update-form #name').val() },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						lastequipclick.data('rented-to', 0);
						updateForRentalStatus(0);
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var updateForRentalStatus = function updateForRentalStatus(rentedTo) {
			if (rentedTo == 0) {
				$('.iam-er-action-button').addClass('iam-er-checkout');
				$('.iam-er-action-button').removeClass('iam-er-checkin');
				$('.iam-er-user-emails').prop('disabled', false);
				$('.iam-er-user-emails').val('');
			} else {
				$('.iam-er-action-button').removeClass('iam-er-checkout');
				$('.iam-er-action-button').addClass('iam-er-checkin');
				$('.iam-er-user-emails').prop('disabled', true);
				$('.iam-er-user-emails').val(rentedTo);
			}
			initRentalButton();
		};

		var initExistingEquipmentListItemsListener = function initExistingEquipmentListItemsListener() {
			updateForRentalStatus($('.iam-existing-list li[selected]').data('rented-to'));

			$('.iam-existing-list li').click(function (event) {
				lastequipclick = $(this);
				make_form_visible('#iam-update-form');
				//if form is already present do not make a request
				if ($(this).html() == $('#iam-update-form').children('.iam-form-row').children('#name').val()) return;
				updateForRentalStatus($(this).data('rented-to'));
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: { action: 'get_admin_forms', request: 'u_equipment', name: $(this).html() },
					success: function success(data) {
						$('#iam-update-form').replaceWith((0, _serverresponse.handleServerResponse)(data));
						initTagAutoCompleteListener();
						initSubmitEquipmentFormListener();
						initDeleteFormListener('e');
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		//CERT LISTENERS

		var initSupportingFileListeners = function initSupportingFileListeners() {
			$('#supporting0').change(function (event) {
				checkFile(this);
			});

			$('#new-supporting0').change(function (event) {
				checkFile(this);
			});
		};

		var initAddSupportingFileUploadButtonListeners = function initAddSupportingFileUploadButtonListeners() {
			//for update form
			$('#iam-add-supporting-upload-button').click(function (event) {
				$('#iam-new-supporting-upload').prepend('<input type="file" id="supporting' + supportingCount + '" name="supporting' + supportingCount + '"><br />');
				$('#supporting' + supportingCount).change(function (event) {
					checkFile(this);
				});
				supportingCount++;
			});
			//for new submit form
			$('#iam-new-add-supporting-upload-button').click(function (event) {
				$('#iam-brand-new-supporting-upload').prepend('<input type="file" id="new-supporting' + newSupportingCount + '" name="new-supporting' + newSupportingCount + '"><br />');
				$('#new-supporting' + newSupportingCount).change(function (event) {
					checkFile(this);
				});
				newSupportingCount++;
			});
		};

		var initSubmitCertificationFormListener = function initSubmitCertificationFormListener() {
			$('.iam-admin-submit-button').off();
			$('.iam-admin-submit-button').click(function (event) {
				(0, _userfeedback.submissionStart)();
				var form = $(this).parent();
				var method = form.attr('id') == 'iam-new-form' ? 'n' : 'u';
				var formData = new FormData();
				var required = form.children('.iam-form-row').children('#required').is(':checked') ? 1 : 0;
				formData.append('action', 'admin_certification_action');
				formData.append('method', method);
				formData.append('name', form.children('.iam-form-row').children('#name').val());
				formData.append('time', form.children('.iam-form-row').children('#time').val());
				formData.append('description', form.children('.iam-form-row').children('#description').val());
				formData.append('required', required);

				if (form.children('.iam-form-row').children('#photo').val() != '') {
					formData.append('photo', form.children('.iam-form-row').children('#photo').prop('files')[0]);
				}

				var sCount, sID;

				if (method == 'u') {
					sCount = supportingCount;
					sID = '#supporting';
				} else {
					sCount = newSupportingCount;
					sID = '#new-supporting';
				}

				for (var i = 0; i <= sCount; i++) {
					if ($(sID + i).length > 0) formData.append('supporting' + i, $(sID + i)[0].files[0]);
				}

				if (method == 'u') formData.append('x', form.children('.iam-form-row').children('#x').val());

				$.ajax({
					url: ajaxurl,
					type: 'POST',
					processData: false,
					contentType: false,
					data: formData,
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						reloadAndFind(form.children('.iam-form-row').children('#name').val());
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var initNewCertificationButtonListener = function initNewCertificationButtonListener() {
			$('#iam-new-certification-button').click(function (event) {
				make_form_visible('#iam-new-form');
				prepare_new_form('#iam-new-form');
			});
		};

		var initExistingCertificationListItemsListener = function initExistingCertificationListItemsListener() {
			$('.iam-existing-list li').click(function (event) {
				make_form_visible('#iam-update-form');
				//if form is already present do not make a request
				if ($(this).html() == $('#iam-update-form').children('.iam-form-row').children('#name').val()) return;
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: { action: 'get_admin_forms', request: 'u_certification', name: $(this).text() },
					success: function success(data) {
						$('#iam-update-form').replaceWith((0, _serverresponse.handleServerResponse)(data));
						initSubmitCertificationFormListener();
						initAddSupportingFileUploadButtonListeners();
						initDeleteFormListener('c');
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		//ROOM LISTENERS

		var initNewRoomButtonListener = function initNewRoomButtonListener() {
			$('#iam-new-room-button').click(function (event) {
				make_form_visible('#iam-new-form');
				prepare_new_form('#iam-new-form');
			});
		};

		var initSubmitRoomFormListener = function initSubmitRoomFormListener() {
			$('.iam-admin-submit-button').off();
			$('.iam-admin-submit-button').click(function (event) {
				(0, _userfeedback.submissionStart)();
				var form = $(this).parent();
				var method = form.attr('id') == 'iam-new-form' ? 'n' : 'u';
				var outOfOrder = form.children('.iam-form-row').children('#out-of-order').is(':checked') ? 1 : 0;
				var formData = new FormData();

				if (form.children('.iam-form-row').children('#photo').val() != '') {
					formData.append('photo', form.children('.iam-form-row').children('#photo').prop('files')[0]);
				}
				formData.append('method', method);
				formData.append('action', 'admin_room_action');
				formData.append('name', form.children('.iam-form-row').children('#name').val());
				formData.append('description', form.children('.iam-form-row').children('#description').val());
				formData.append('pricing-description', form.children('.iam-form-row').children('#pricing-description').val());
				formData.append('out-of-order', outOfOrder);

				if (method == 'u') formData.append('x', form.children('.iam-form-row').children('#x').val());
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						window.location.reload();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var initExistingRoomListItemsListener = function initExistingRoomListItemsListener() {
			$('.iam-existing-list li').click(function (event) {
				make_form_visible('#iam-update-form');
				//if form is already present do not make a request
				if ($(this).html() == $('#iam-update-form').children('.iam-form-row').children('#name').val()) return;
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: { action: 'get_admin_forms', request: 'u_room', name: $(this).html() },
					success: function success(data) {
						$('#iam-update-form').replaceWith((0, _serverresponse.handleServerResponse)(data));
						initTagAutoCompleteListener();
						initSubmitRoomFormListener();
						initDeleteFormListener('r');
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		//BAL LISTENERS

		var initBalancesButtonListener = function initBalancesButtonListener() {
			$('.iam-balances-button').click(function (event) {
				if ($('#amount').val().length < 1) {
					alert('invalid number');
					return;
				}
				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_balances_action', comment: $('#description').val(), username: $('#username').val(), amount: $('#amount').val() },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						reloadAndFind($('#username').val());
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};
		var initAddFundsButtonListener = function initAddFundsButtonListener() {
			$('.iam-add-funds-button').click(function (event) {
				$('body').append('<div class="iam-popup"><div class="iam-popup-header"><h3>Add Funds</h3><i class="fa fa-close fa-3 iam-x"></i></div><div class="iam-popup-body">' + addFundsHTML + '</div></div>');
				if (typeof selectedBalUser != 'undefined') {
					$('select#username option').each(function (index, el) {
						if ($(this).text() == selectedBalUser) {
							$(this).prop('selected', true);
						}
					});
				}
				(0, _textfieldlisteners.numbersOnlyListener)($('#amount'));
				initBalancesButtonListener();
				$('.iam-x').click(function (event) {
					$('.iam-popup').remove();
				});
			});
		};

		var initEditChargeRowListener = function initEditChargeRowListener() {
			$('#iam-bal-charges-table-container table tr').each(function (index, el) {
				//don't call on row with titles
				if ($(this).children('td').length < 5) return;
				if ($(this).children('.iam-charge-status').text() == 'Canceled' || $(this).children('.iam-charge-status').text() == 'Pending') {
					$(this).children('td').children('.iam-edit-charge-row').text('approve');
				} else {
					$(this).children('td').children('.iam-edit-charge-row').text('cancel');
				}
			});
			$('.iam-edit-charge-row').click(function (event) {
				var that = this;
				var thatId = $(this).data('relational-id');
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_switch_charge_status', nid: $(this).data('nid') },
					success: function success(data) {
						var newAmount = (0, _serverresponse.handleServerResponse)(data);
						$('.iam-bal-user-row').each(function (index, el) {
							if ($(this).data('relational-id') == thatId) {
								$($(this).children('td')[2]).text(newAmount);
								return false;
							}
						});
						fetchingChargeTable = true;
						$.ajax({
							url: ajaxurl,
							type: 'GET',
							data: { action: 'admin_get_charge_table', nid: currentBalRowNID },
							success: function success(data) {
								$('#iam-bal-charges-table-container').empty();

								$('#iam-bal-charges-table-container').append((0, _serverresponse.handleServerResponse)(data));
								initEditChargeRowListener();
								$('.iam-edit-charge-row').data('relational-id', thatId);
								fetchingChargeTable = false;
							},
							error: function error(data) {
								(0, _serverresponse.handleServerError)(data, new Error());
								fetchingChargeTable = false;
							}
						});
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		//USER CERTIFICATION LISTENERS

		var initSeeExistingCertificationsListener = function initSeeExistingCertificationsListener() {
			$('.iam-see-existing-certifications').click(function (event) {
				var that = this;
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: { action: 'admin_get_user_certifications', nid: $(this).data('nid') },
					success: function success(data) {
						$(that).parent('td').html((0, _serverresponse.handleServerResponse)(data));
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var areValuesChecked = function areValuesChecked() {
			if ($('input:checked').length < 1) return false;
			return true;
		};

		var initAddRemoveCertificationsButtonListener = function initAddRemoveCertificationsButtonListener() {
			$('#iam-add-cert-button').click(function (event) {
				(0, _userfeedback.submissionStart)();
				if ($('#iam-cert-to-apply').val() == 'Select a value') {
					alert('Please select a certification from the drop down menu.');
					return;
				}
				if (!areValuesChecked()) {
					alert("Please select some accounts for this action");
					return;
				}
				var checkedUsers = [];
				$(':checked').each(function (index, el) {
					checkedUsers.push($(this).data('user'));
				});
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_add_certifications_to_users', users: checkedUsers, certification: $('#iam-cert-to-apply').val() },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						window.location.reload();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
			$('#iam-remove-cert-button').click(function (event) {
				(0, _userfeedback.submissionStart)();
				if ($('#iam-cert-to-apply').val() == 'Select a value') {
					alert('Please select a certification from the drop down menu.');
					return;
				}
				if (!areValuesChecked()) {
					alert("Please select some accounts for this action");
					return;
				}
				var checkedUsers = [];
				$('input:checked').each(function (index, el) {
					checkedUsers.push($(this).data('user'));
				});
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_remove_certifications_to_users', users: checkedUsers, certification: $('#iam-cert-to-apply').val() },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						window.location.reload();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		//Reservation wrap

		var resetEvents = function resetEvents() {
			eventsToDelete = [];
			eventsModified = {};
			eventsConfirmed = [];
		};

		var refreshResCal = function refreshResCal() {
			var c = '.iam-cal';
			if ($('.iam-res-cal').length > 0) c = '.iam-res-cal';
			$(c).fullCalendar('removeEventSource', lastReservationResource);
			$(c).fullCalendar('addEventSource', lastReservationResource);
		};

		var initResCalSubmitListener = function initResCalSubmitListener() {
			$('.iam-res-cal-submit').click(function (event) {
				if ($('.iam-res-cal-placeholder').length > 0) return;
				if (!(0, _utils.getSize)(eventsModified) && !eventsToDelete.length) return;
				if (!confirm("Are you sure you want to make these changes?")) return;
				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_update_reservations', to_delete: eventsToDelete, modified: eventsModified, sendEmails: false, reason: '', facility: $('.iam-reservation-wrap').data('facility'), load_all: didLoadAllRes },
					success: function success(data) {
						updateEquipmentEvents((0, _serverresponse.handleServerResponse)(data));
						makeCalendarReservationsMulti();
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
			$('.iam-res-cal-cancel').click(function (event) {
				if ($('.iam-res-cal-placeholder').length > 0) return;
				refreshResCal();
			});
		};

		var handleEventToDelete = function handleEventToDelete(event, j) {
			if (j.hasClass('event-not-editable')) return;
			var index = eventsToDelete.indexOf(event.nid);
			if (index != -1) {
				eventsToDelete.splice(index, 1);
				refreshResCal();
			} else {
				eventsToDelete.push(event.nid);
				refreshResCal();
			}
		};

		var handleEventCopyEmail = function handleEventCopyEmail(event) {
			var e = $('<div>' + event.email + '</div>');
			copyToClipboard(e[0]);
			$('body').append('<div class="iam-copy-notification">Email Copied to Clipboard</div>');
			$('.iam-copy-notification').fadeOut(3500, function () {
				$('.iam-copy-notification').remove();
			});
		};

		var initContextMenu = function initContextMenu(menuToUse) {
			menuToUse = typeof menuToUse == 'undefined' ? 'default' : menuToUse;

			var menu = [{
				name: 'mark for deletion',
				title: 'delete button',
				fun: function fun(e) {
					var t = $(e.trigger);
					var event = { nid: t.data('nid') };
					handleEventToDelete(event, t);
				}
			}, {
				name: 'copy email',
				title: 'copy button',
				fun: function fun(e) {
					var t = $(e.trigger);
					var event = { email: t.data('email') };
					handleEventCopyEmail(event);
				}
			}];

			var rentalMenu = [{
				name: 'use this reservation',
				title: 'select reservation button',
				fun: function fun(e) {
					var t = $(e.trigger);
					var event = { nid: t.data('nid') };
					makeRelevantReservation(t.data('fcSeg').event);
				}
			}, {
				name: 'mark for deletion',
				title: 'delete button',
				fun: function fun(e) {
					var t = $(e.trigger);
					var event = { nid: t.data('nid') };
					handleEventToDelete(event, t);
				}
			}];

			var menuDict = { 'default': menu, 'rental': rentalMenu };
			var menuOfChoice = menuDict[menuToUse];

			$('.fc-event:not(.event-not-editable)').contextMenu(menuOfChoice, { triggerOn: 'click', mouseClick: 'right' });
		};

		var updateResSource = function updateResSource() {
			var selectedEquipment = $('.iam-reservations-equipment-list-item.iam-highlighted');
			var newEventResource = [];
			$(selectedEquipment).each(function (index, el) {
				newEventResource = newEventResource.concat($(this).data('calevents'));
			});
			lastReservationResource = newEventResource;
		};

		var makeCalendarReservationsMulti = function makeCalendarReservationsMulti() {
			(0, _userfeedback.submissionStart)();

			if ($('.iam-res-cal-placeholder').length) {
				$('.iam-res-cal-placeholder').remove();
				updateResSource();
				initAdminResCal();
			} else {
				$('.iam-res-cal').fullCalendar('removeEventSource', lastReservationResource);
				updateResSource();
				$('.iam-res-cal').fullCalendar('addEventSource', lastReservationResource);
			}
		};

		var initAdminResCal = function initAdminResCal() {

			$('.iam-res-cal').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				droppable: true,
				eventOverlap: true,
				weekends: true,
				height: 600,
				forceEventDuration: true,
				defaultView: 'month',
				editable: true,
				eventLimit: true, // allow "more" link when too many events
				eventRender: function eventRender(event, element) {
					eventToolTip(event, element);
					$(element).data('fullname', event.fullname);
					$(element).data('email', event.email);
					$(element).data('equipment', event.equipment);
					$(element).data('nid', event.nid);
					$(element).addClass('iam-status-' + event.status);
					if (eventsToDelete.indexOf(event.nid) != -1) {
						$(element).addClass('marked-for-delete');
					}
				},
				eventAfterRender: function eventAfterRender(event, element) {
					if (event.toDelete == 1) {
						$(element).css({
							'background-color': '#ef4040',
							'border': '1px solid #ef4040'
						});
					}
				},
				eventAfterAllRender: function eventAfterAllRender() {
					initContextMenu();
					initStatusHideListeners();
					(0, _userfeedback.submissionEnd)();
				},
				eventDrop: function eventDrop(event) {
					eventsModified[event.nid] = { start: event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss') };
				},
				eventResize: function eventResize(event) {
					eventsModified[event.nid] = { start: event.start.format('YYYY-MM-DD HH:mm:ss'), end: event.end.format('YYYY-MM-DD HH:mm:ss') };
				},
				eventClick: function eventClick(event, jsEvent, view) {},
				events: lastReservationResource
			});
		};

		var initStatusHideListeners = function initStatusHideListeners() {
			$('.res-toolbar input[name=upcoming]').off();
			$('.res-toolbar input[name=active]').off();
			$('.res-toolbar input[name=completed]').off();
			$('.res-toolbar input[name=no-show]').off();
			$('.res-toolbar input[name=no-pay]').off();

			$('.res-toolbar input[name=upcoming]').click(function (e) {
				if ($('.iam-res-cal-placeholder').length > 0) {
					e.preventDefault();
					return false;
				}
				$('.iam-status-upcoming').toggleClass('iam-ninja');
			});
			$('.res-toolbar input[name=active]').click(function (e) {
				if ($('.iam-res-cal-placeholder').length > 0) {
					e.preventDefault();
					return false;
				}
				$('.iam-status-active').toggleClass('iam-ninja');
			});
			$('.res-toolbar input[name=completed]').click(function (e) {
				if ($('.iam-res-cal-placeholder').length > 0) {
					e.preventDefault();
					return false;
				}
				$('.iam-status-completed').toggleClass('iam-ninja');
			});
			$('.res-toolbar input[name=no-show]').click(function (e) {
				if ($('.iam-res-cal-placeholder').length > 0) {
					e.preventDefault();
					return false;
				}
				$('.iam-status-no-show').toggleClass('iam-ninja');
			});
			$('.res-toolbar input[name=no-pay]').click(function (e) {
				if ($('.iam-res-cal-placeholder').length > 0) {
					e.preventDefault();
					return false;
				}
				$('.iam-status-no-pay').toggleClass('iam-ninja');
			});
			$('.res-toolbar input[name=is-late]').click(function (e) {
				if ($('.iam-res-cal-placeholder').length > 0) {
					e.preventDefault();
					return false;
				}
				$('.iam-status-is-late').toggleClass('iam-ninja');
			});
			$('.res-toolbar input[name=was-late]').click(function (e) {
				if ($('.iam-res-cal-placeholder').length > 0) {
					e.preventDefault();
					return false;
				}
				$('.iam-status-was-late').toggleClass('iam-ninja');
			});
		};

		//schedling wrap functions
		var initScheduleTypeListeners = function initScheduleTypeListeners() {
			/*
   $('.iam-scheduling-type select').change(function(event) {
   	var that = this;
   	var schedulingInfoElement = $(this).parent('.iam-scheduling-type').parent('.iam-scheduling-block').children('.iam-scheduling-info');
   	if ($(this).val()=='Rental') {
   		$.ajax({
   			url: ajaxurl,
   			type: 'GET',
   			data: {action: 'admin_get_rental_info_template'},
   			success: function (data) {
   				schedulingInfoElement.empty();
   				schedulingInfoElement.html(handleServerResponse(data));
   			},
   			error: function (data) {
   				handleServerError(data, new Error());
   			}
   		});
   	} else if ($(this).val()=='Appointment') {
   		$.ajax({
   			url: ajaxurl,
   			type: 'GET',
   			data: {action: 'admin_get_appointment_info_template'},
   			success: function (data) {
   				schedulingInfoElement.empty();
   				schedulingInfoElement.html(handleServerResponse(data));
   			},
   			error: function (data) {
   				handleServerError(data, new Error());
   			}
   		});
   		initIrregularHoursButtonListener();
   	} else {
   		schedulingInfoElement.empty;
   	}
   });*/
			initIrregularHoursButtonListener();
		};

		var initUpdateIrregularHoursButtonListener = function initUpdateIrregularHoursButtonListener() {
			$('.iam-irregular-hours-update-button').off();
			$('.iam-irregular-hours-update-button').click(function (event) {
				var cal = $(this).siblings('.iam-cal');
				var facilityName = $(this).parent().siblings('.iam-scheduling-name').children('h1').text().trim();
				facilityName = facilityName.split(' ').join('_');
				(0, _userfeedback.submissionStart)();
				var newEvents = [];
				var events = $(this).siblings('.iam-cal').fullCalendar('clientEvents');
				for (var i = 0; i < events.length; i++) {
					var starttime, endtime;
					if (events[i].className.length > 0) {
						newEvents.push({
							title: 'closed',
							start: events[i].start.format('YYYY-MM-DD HH:mm:ss'),
							end: events[i].end.format('YYYY-MM-DD HH:mm:ss')
						});
					}
				}

				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_update_irregular_hours', facility: facilityName, events: newEvents },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						cal.fullCalendar('removeEventSource', ajaxurl + "?action=admin_get_irregular_hours&facility=" + facilityName);
						cal.fullCalendar('removeEvents');
						cal.fullCalendar('addEventSource', ajaxurl + "?action=admin_get_irregular_hours&facility=" + facilityName);
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var initApprovalRoomSelectListener = function initApprovalRoomSelectListener() {
			$('.iam-approval-room-select').change(function (event) {
				$('.iam-approval-hours-cal').fullCalendar('removeEventSources');
				$('.iam-approval-hours-cal').fullCalendar('addEventSource', ajaxurl + "?action=admin_get_approval_hours&name=" + $(this).val());
			});
		};

		var updateApprovalCal = function updateApprovalCal() {
			//submissionStart();
			var e = $('.iam-approval-hours-cal').fullCalendar('clientEvents');
			var a = [];
			for (var i = 0; i < e.length; i++) {
				var c = e[i];
				if (typeof c != 'undefined') {
					if (c.toDelete != 1) {
						var dayOfWeek = typeof c.dow == 'undefined' ? [c.start.format('e')] : c.dow;
						if (c.end.format('e') != dayOfWeek[0]) {
							var newEvent = { start: moment.utc('1970-2-1 00:00:00'), end: c.end, dow: [c.end.format('e')] };
							e.push(newEvent);
							c.end = moment.utc('1970-2-1 23:59:59');
						}

						a.push({
							title: 'closed',
							constraint: 'businessHours',
							start: c.start.format('HH:mm:ss'),
							end: c.end.format('HH:mm:ss'),
							businessHoursMode: 'multi',
							dow: dayOfWeek
						});
					}
				}
			}
			var roomName = $('.iam-approval-room-select').val();
			$.ajax({
				url: ajaxurl,
				type: 'POST',
				data: { action: 'admin_update_approval_hours', events: a, name: roomName },
				success: function success(data) {
					(0, _serverresponse.handleServerResponse)(data);
					window.location.reload();
				},
				error: function error(data) {
					(0, _serverresponse.handleServerError)(data, new Error());
					(0, _userfeedback.submissionEnd)();
				}
			});
		};

		var initApproval = function initApproval() {
			$('#approval-external-events .fc-event').each(function () {

				// store data so the calendar knows to render an event upon drop
				$(this).data('event', {
					title: 'closed', // use the element's text as the event title
					stick: true, // maintain when user navigates (see docs on the renderEvent method)
					editable: true,
					color: '#4cad57',
					className: 'iam-new-event'
				});

				// make the event draggable using jQuery UI
				$(this).draggable({
					zIndex: 999,
					revert: true, // will cause the event to go back to its
					revertDuration: 0 //  original position after the drag
				});
			});
			var roomName = $('.iam-approval-room-select').val();
			$('.iam-approval-hours-cal').fullCalendar({
				header: {
					left: '',
					center: '',
					right: 'agendaWeek'
				},
				eventClick: function eventClick(calEvent, jsEvent, view) {
					if (jsEvent.shiftKey) {
						$(this).remove();
						calEvent.toDelete = 1;
						updateApprovalCal();
					}
				},
				droppable: true,
				eventOverlap: false,
				defaultDate: '1970-2-1',
				allDaySlot: false,
				height: 500,
				forceEventDuration: true,
				defaultView: 'agendaWeek',
				editable: false, //new events will be made editable else where
				eventLimit: true, // allow "more" link when too many events
				title: 'closed',
				events: ajaxurl + "?action=admin_get_approval_hours&name=" + roomName
			});
			initApprovalRoomSelectListener();
		};

		var initIrregularHoursButtonListener = function initIrregularHoursButtonListener() {
			$('.iam-irregular-hours-button').off();
			$('.iam-irregular-hours-button').click(function (event) {
				initUpdateIrregularHoursButtonListener();
				var sib = $(this).siblings('.iam-irregular-hours-cal');
				sib.toggleClass('iam-ninja');
				$(this).siblings('.iam-irregular-hours-update-button').toggleClass('iam-ninja');
				$(this).siblings('#external-events').toggleClass('iam-ninja');
				$(this).siblings('.iam-irregular-hours-instructions').toggleClass('iam-ninja');
				if (sib.hasClass('iam-ninja')) {
					$(this).text('set irregular hours');
				} else {
					$(this).text('collapse irregular hours');
				}
				if (!sib.hasClass('_init')) {
					sib.addClass('_init');
					$('#external-events .fc-event').each(function () {

						// store data so the calendar knows to render an event upon drop
						$(this).data('event', {
							title: 'closed', // use the element's text as the event title
							stick: true, // maintain when user navigates (see docs on the renderEvent method)
							editable: true,
							color: '#4cad57',
							className: 'iam-new-event'
						});

						// make the event draggable using jQuery UI
						$(this).draggable({
							zIndex: 999,
							revert: true, // will cause the event to go back to its
							revertDuration: 0 //  original position after the drag
						});
					});
					var facilityName = sib.parent().siblings('.iam-scheduling-name').children('h1').text().trim();

					facilityName = facilityName.split(' ').join('_');
					sib.fullCalendar({
						header: {
							left: 'prev,next today',
							center: 'title',
							right: 'month,agendaWeek,agendaDay'
						},
						eventClick: function eventClick(calEvent, jsEvent, view) {
							if (jsEvent.shiftKey) {
								$.ajax({
									url: ajaxurl,
									type: 'POST',
									data: { action: 'admin_delete_irregular_hours', nid: calEvent.nid },
									success: function success(data) {
										(0, _serverresponse.handleServerResponse)(data);
										var cal = sib;
										cal.fullCalendar('removeEventSource', ajaxurl + "?action=admin_get_irregular_hours&facility=" + facilityName);
										cal.fullCalendar('removeEvents');
										cal.fullCalendar('addEventSource', ajaxurl + "?action=admin_get_irregular_hours&facility=" + facilityName);
										(0, _userfeedback.submissionEnd)();
									},
									error: function error(data) {
										(0, _serverresponse.handleServerError)(data, new Error());
									}
								});
							}
						},
						droppable: true,
						eventOverlap: false,
						height: 500,
						forceEventDuration: true,
						defaultView: 'agendaWeek',
						editable: false, //new events will be made editable else where
						eventLimit: true, // allow "more" link when too many events
						title: 'closed',
						events: ajaxurl + "?action=admin_get_irregular_hours&facility=" + facilityName
					});
				}
			});
		};

		var initScheduleSubmitListeners = function initScheduleSubmitListeners() {
			$('.iam-scheduling-block input[type=submit]').off();
			$('.iam-scheduling-block input[type=submit]').click(function (event) {
				var block = $(this).parent('.iam-scheduling-block');
				var scheduleInfo = {};
				var validDates = true;
				var scheduleType = block.children('.iam-scheduling-type').children('select').val();
				if (scheduleType == 'Rental') {
					scheduleInfo.rental_period = block.children('.iam-scheduling-info').children('label').children('.iam-rental-period').val();
					scheduleInfo.rental_hours_description = block.children('.iam-scheduling-info').children('.iam-rental-hours-description').val();
				} else if (scheduleType == 'Appointment') {
					var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
					var full_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
					var businessHours = {};
					block.children('.iam-scheduling-info').children('table').children('tbody').children('.iam-opening-row').children('td').each(function (index, el) {
						if (index != 0) {
							if ($(this).children('label').children('.iam-closed-checkbox').is(':checked')) {
								businessHours[days[index - 1]] = { start: '', end: '' };
							} else {
								var openTime = $(this).children('.iam-open-hour').val() + ':' + $(this).children('.iam-open-min').val() + ':' + $(this).children('.iam-open-am-pm').val();
								businessHours[days[index - 1]] = { start: openTime };
							}
						}
					});
					block.children('.iam-scheduling-info').children('table').children('tbody').children('.iam-closing-row').children('td').each(function (index, el) {
						if (index != 0) {
							if (businessHours[days[index - 1]].start != '') {
								var closeTime = $(this).children('.iam-close-hour').val() + ':' + $(this).children('.iam-close-min').val() + ':' + $(this).children('.iam-close-am-pm').val();
								if (moment('2016-1-1 ' + businessHours[days[index - 1]].start).isAfter('2016-1-1 ' + closeTime)) {
									alert('Your opening time for ' + full_days[index - 1] + ' is after this closing time, please correct this.');
									validDates = false;
								}
								businessHours[days[index - 1]].end = closeTime;
							}
						}
					});
					scheduleInfo.businessHours = businessHours;
				} else if (scheduleType == 'Approval') {
					updateApprovalCal();
					return;
				} else {
					if (!confirm("This will disable reservations for this facility. Do you want to continue?")) {
						return;
					} else {
						$.ajax({
							url: ajaxurl,
							type: 'POST',
							data: { action: 'admin_facility_schedule', type: block.children('.iam-scheduling-type').children('select').val(), tag: block.children('.iam-scheduling-name').text() },
							success: function success(data) {
								(0, _serverresponse.handleServerResponse)(data);
								window.location.reload();
							},
							error: function error(data) {
								(0, _serverresponse.handleServerError)(data, new Error());
							}
						});
					}
					return;
				}
				if (!validDates) {
					return;
				}
				(0, _userfeedback.submissionStart)();

				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_facility_schedule', type: block.children('.iam-scheduling-type').children('select').val(), info: scheduleInfo, tag: block.children('.iam-scheduling-name').text() },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						window.location.reload();
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		//charge sheet wrap functions
		var initApproveChargeButtonListener = function initApproveChargeButtonListener() {
			$('.iam-approve-charge-button').off();
			$('.iam-approve-charge-button').click(function (event) {
				var that = this;
				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'approve_charge', nid: $(this).parents('tr').data('id'), status: $(this).data('status') },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						if ($(that).data('status') == 1) {
							$(that).removeClass('iam-secondary-button');
							$(that).addClass('iam-button');
							$(that).data('status', 0);
							$(that).html('approve');
						} else {
							$(that).removeClass('iam-button');
							$(that).addClass('iam-secondary-button');
							$(that).data('status', 1);
							$(that).html('cancel');
						}
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _userfeedback.submissionEnd)();
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var initCSVAJAXButtonListener = function initCSVAJAXButtonListener(ajaxaction) {
			$('.iam-csv-button').click(function (event) {
				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: ajaxaction },
					success: function success(data) {
						(0, _userfeedback.submissionEnd)();
						var encodedUri = encodeURI('data:text/csv;charset=utf-8,' + (0, _serverresponse.handleServerResponse)(data));
						window.open(encodedUri);
					},
					error: function error(data) {
						(0, _userfeedback.submissionEnd)();
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		var initCSVButtonListener = function initCSVButtonListener(ignoreColumn, id) {
			$('.iam-csv-button').click(function (event) {
				var csvText = 'data:text/csv;charset=utf-8,';
				id = typeof id === 'undefined' ? '' : '#' + id + ' ';
				$(id + 'th').each(function (index, el) {
					csvText += $(this).text().replace(/(<([^>]+)>)/ig, "") + ',';
				});
				csvText = csvText.substring(0, csvText.length - 1) + '\n';
				$(id + 'tr').each(function (index, el) {
					$(this).children('td').each(function (i, e) {
						if (i != ignoreColumn) csvText += $(this).text().replace(/(<([^>]+)>)/ig, "") + ',';
					});
					csvText = csvText.substring(0, csvText.length - 1) + '\n';
				});
				var encodedUri = encodeURI(csvText);
				window.open(encodedUri);
			});
		};

		//user registration wrap functions
		var initRegKeyButtonListener = function initRegKeyButtonListener() {
			$('.iam-reg-key-button').click(function (event) {
				var expDay = $('.iam-reg-key-day').val();
				var expMonth = $('.iam-reg-key-month').val();
				var expYear = $('.iam-reg-key-year').val();
				var dateToSend;
				if (expDay.length != 0 || expMonth.length != 0 || expYear.length != 0) {
					if (expDay.length < 1 || expMonth.length < 1 || expYear.length < 4) {
						alert('please fill out all date fields');
						return;
					}
					var exp_date = moment($('.iam-reg-key-month').val() + '-' + $('.iam-reg-key-day').val() + '-' + $('.iam-reg-key-year').val(), 'M-D-YYYY');
					if (!exp_date.isValid()) {
						alert('Please enter a valid date.');
						return;
					} else {
						dateToSend = exp_date.format('M-D-YYYY');
					}
				}
				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_make_registration_key', key: $('.iam-reg-key').val(), expiration: dateToSend },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						window.location.reload();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};
		var initDeleteRegKeyButtonListener = function initDeleteRegKeyButtonListener() {
			$('.iam-delete-key').click(function (event) {
				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_delete_registration_key', nid: $(this).data('nid') },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						window.location.reload();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		//pricing wrap functions
		var initNewMaterialButtonListener = function initNewMaterialButtonListener() {
			$.ajax({
				url: ajaxurl,
				type: 'GET',
				data: { action: 'admin_get_new_mat_row' },
				success: function success(data) {
					$('.iam-new-mat-button').click(function (event) {
						$('tbody').append((0, _serverresponse.handleServerResponse)(data));
						initAddPricingDropDownListeners();
						initDeletePricingDropDownListener();
						initPricingRowDeleteListener();
					});
				},
				error: function error(data) {
					(0, _serverresponse.handleServerError)(data, new Error());
				}
			});
		};
		var initDropDownContent = function initDropDownContent() {
			$.ajax({
				url: ajaxurl,
				type: 'GET',
				data: { action: 'admin_get_pricing_dropdowns' },
				success: function success(data) {
					data = (0, _serverresponse.handleServerResponse)(data);
					equipDropDown = data['equip'];
					tagsDropDown = data['tags'];
					initAddPricingDropDownListeners();
				},
				error: function error(data) {
					(0, _serverresponse.handleServerError)(data, new Error());
				}
			});
		};
		var initAddPricingDropDownListeners = function initAddPricingDropDownListeners() {
			if (equipDropDown == null || tagsDropDown == null) {
				initDropDownContent();
				return;
			}
			$('.iam-add-pricing-tags-drop-down-button').off();
			$('.iam-add-pricing-equipment-drop-down-button').off();
			$('.iam-add-pricing-tags-drop-down-button').click(function (event) {
				changedRows.push($(this).parent().parent().data('nid'));
				$(this).parent().prepend(tagsDropDown);
				initDeletePricingDropDownListener();
			});
			$('.iam-add-pricing-equipment-drop-down-button').click(function (event) {
				changedRows.push($(this).parent().parent().data('nid'));
				$(this).parent().prepend(equipDropDown);
				initDeletePricingDropDownListener();
			});
		};
		var initPricingChangeListeners = function initPricingChangeListeners() {
			$('input[type=text]').off();
			$('input[type=number]').off();
			$('.iam-pricing-drop-down select').change(function (event) {
				var nid = $(this).parent().parent().parent().data('nid');
				if (changedRows.indexOf(nid) != -1) return;
				changedRows.push(nid);
			});
			$('input[type=text]').change(function (event) {
				var nid = $(this).parent().parent().data('nid');
				if (changedRows.indexOf(nid) != -1) return;
				changedRows.push(nid);
			});
			$('input[type=number]').change(function (event) {
				var nid = $(this).parent().parent().parent().data('nid');
				if (changedRows.indexOf(nid) != -1) return;
				changedRows.push(nid);
			});
		};
		var initPricingRowDeleteListener = function initPricingRowDeleteListener() {
			$('.iam-pricing-row-delete-button').off();
			$('.iam-pricing-row-delete-button').click(function (event) {
				if (!confirm("Delete this row?")) return;
				var row = $(this).parent().parent();
				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_delete_material', nid: row.data('nid') },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						row.remove();
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};
		var initDeletePricingDropDownListener = function initDeletePricingDropDownListener() {
			$('.iam-delete-pricing-drop-down').off();
			$('.iam-delete-pricing-drop-down').click(function (event) {
				changedRows.push($(this).parent().parent().parent().data('nid'));
				$(this).parent().remove();
			});
		};
		var initPricingSubmitListener = function initPricingSubmitListener() {
			$('.iam-admin-submit-button').off();
			$('.iam-admin-submit-button').click(function (event) {
				var toUpdate = [];
				$('tr').each(function (index, el) {
					//skip header
					if (index == 0) return;

					if (changedRows.indexOf($(this).data('nid')) != -1 || $(this).data('nid').length == 0) {
						var associatedTags = [];
						var associatedEquipment = [];
						$($(this).children('.iam-mat-tags-data')).children('.iam-pricing-drop-down').each(function (index, el) {
							associatedTags.push($(this).children('select').children('option:selected').val());
						});
						$($(this).children('.iam-mat-equip-data')).children('.iam-pricing-drop-down').each(function (index, el) {
							associatedEquipment.push($(this).children('select').children('option:selected').val());
						});
						var matName = $(this).children('td').children('.iam-mat-name').val();
						var matPricing = $(this).children('td').find('.iam-mat-pricing').val();
						var matBasePrice = $(this).children('td').find('.iam-mat-base-price').val();
						var unitName = $(this).children('td').children('.iam-unit-name').val();
						if (matName.length < 1 || matPricing.length < 1 || unitName.length < 1) {
							alert("Please fill out Material Name, Price Per Unit, and Unit Name for each entry.");
							return;
						}
						toUpdate.push({ nid: $(this).data('nid'),
							mat_name: matName,
							mat_pricing: matPricing,
							mat_base_price: matBasePrice,
							unit_name: unitName,
							tags: associatedTags,
							equipment: associatedEquipment
						});
					}
				});
				if (toUpdate.length < 1) {
					alert("No changes or new entries.");
					return;
				}
				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_pricing', updates: toUpdate },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
		};

		//run time
		if ($('.iam-main-menu-wrap').length > 0) {

			//reportBugListener();
			(0, _textfieldlisteners.numbersOnlyListener)($('.iam-ipad-code'));

			adminSettingsListener();
			initAddAccountTypeButtonListener();
			initAccountTypeRowListener();
			initSubmitAccountTypeListener();

			initAddRentalTypeButtonListener();
			initRentalTypeRowListener();
			initSubmitRentalTypeListener();
		} else if ($('.iam-room-wrap').length > 0) {

			//listeners
			initExistingRoomListItemsListener();
			initImageListener();
			initNewRoomButtonListener();
			initSubmitRoomFormListener();
			initDeleteFormListener('r');
			initSearchListener('.iam-room-search', '#iam-room-list li', 0);
			(0, _textfieldlisteners.itemNameListener)($('#iam-new-form #name'));
			(0, _textfieldlisteners.itemNameListener)($('#iam-update-form #name'));
			updateSearchOnLoad();
			$(document).tooltip();
		} else if ($('.iam-reservation-wrap').length > 0) {
			resetEvents();

			$('.iam-load-all-reservations').click(function (event) {
				if ($('.iam-res-cal-placeholder').length > 0) return;

				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: { action: 'load_all_events_admin_res_cal', facility: $('.iam-reservation-wrap').data('facility') },
					success: function success(data) {
						var newData = (0, _serverresponse.handleServerResponse)(data);
						for (var i in newData) {
							var c = newData[i];
							$('.iam-reservations-equipment-list-item[data-nid=' + i + ']').data('calevents', c);
						}
						makeCalendarReservationsMulti();
						(0, _userfeedback.submissionEnd)();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});

			$('.iam-res-select-all').click(function (event) {
				$(this).toggleClass('iam-highlighted');
				if ($(this).hasClass('iam-highlighted')) {
					$('.iam-reservation-list div:not(.iam-highlighted)').each(function (index, el) {
						if (!$(this).hasClass('iam-ninja')) {
							$(this).addClass('iam-highlighted');
						}
					});
					makeCalendarReservationsMulti();
				} else {
					$('.iam-reservation-list div.iam-highlighted').each(function (index, el) {
						$(this).removeClass('iam-highlighted');
					});
					makeCalendarReservationsMulti();
				}
			});

			$('.iam-reservation-list div').click(function (event) {
				$(this).toggleClass('iam-highlighted');
				makeCalendarReservationsMulti();
			});

			$('label.iam-status-label input').prop('checked', true);
			initResCalSubmitListener();
			initSearchListener('.iam-search', '.iam-reservation-list div', 0);
			$(document).tooltip();
		} else if ($('.iam-user-certification-wrap').length > 0) {

			//initSeeExistingCertificationsListener();
			initAddRemoveCertificationsButtonListener();
			initSearchListener('.iam-user-certifications-search', 'tr .iam-username', 1);
			updateSearchOnLoad();
		} else if ($('.iam-scheduling-wrap').length > 0) {

			initScheduleTypeListeners();
			initApproval();
			initScheduleSubmitListeners();
		} else if ($('.iam-charge-sheet-wrap').length > 0) {
			initCSVAJAXButtonListener('admin_get_all_charges_as_csv');
			initChargeTable();
			$(document).tooltip();
		} else if ($('.iam-equipment-wrap').length > 0) {

			//on load
			loadComparableTags();

			//listeners
			initExistingEquipmentListItemsListener();
			initImageListener();
			initNewEquipmentButtonListener();
			initSubmitEquipmentFormListener();
			initDuplicateEquipmentButtonListener();
			initTagAutoCompleteListener();
			initDeleteFormListener('e');
			initSearchListener('.iam-equipment-search', '#iam-equipment-list li', 0);
			(0, _textfieldlisteners.itemNameListener)($('#iam-new-form #name'));
			(0, _textfieldlisteners.itemNameListener)($('#iam-update-form #name'));
			updateSearchOnLoad();
			if ($('.iam-er').length > 0) {
				initCheckinCheckout();
			}
			initCSVAJAXButtonListener('admin_equipment_csv');
			$(document).tooltip();
			findItemAgain($('#iam-equipment-list'));
		} else if ($('.iam-certification-wrap').length > 0) {
			//vars
			var supportingCount, newSupportingCount;
			supportingCount = newSupportingCount = 1;

			//listeners
			initSupportingFileListeners();
			initExistingFileListener();
			initNewCertificationButtonListener();
			initExistingCertificationListItemsListener();
			initSubmitCertificationFormListener();
			initAddSupportingFileUploadButtonListeners();
			initDeleteFormListener('c');
			initSearchListener('.iam-certification-search', '#iam-certifcation-list li', 0);
			(0, _textfieldlisteners.itemNameListener)($('#iam-new-form #name'));
			(0, _textfieldlisteners.itemNameListener)($('#iam-update-form #name'));
			updateSearchOnLoad();
			$(document).tooltip();
			findItemAgain($('#iam-certifcation-list'));
		} else if ($('.iam-balances-wrap').length > 0) {
			var addFundsHTML = $('.iam-add-funds').html(),
			    fetchingChargeTable = false,
			    currentBalRowNID;
			$('.iam-add-funds').remove();
			$('.iam-bal-user-row').click(function (event) {
				if (fetchingChargeTable) return;

				currentBalRowNID = $(this).data('nid');

				if (lastBalClick == currentBalRowNID) return;
				lastBalClick = currentBalRowNID;

				fetchingChargeTable = true;
				var that = this;
				selectedBalUser = $(this).children('.iam-bal-user-row-username').text();
				$('.iam-bal-user-row').removeClass('iam-selected-row');
				$(this).addClass('iam-selected-row');
				$.ajax({
					url: ajaxurl,
					type: 'GET',
					data: { action: 'admin_get_charge_table', nid: currentBalRowNID },
					success: function success(data) {
						$('#iam-bal-charges-table-container').empty();
						$('#iam-bal-charges-table-container').append((0, _serverresponse.handleServerResponse)(data));
						initEditChargeRowListener();
						var id = (0, _utils.rStr)(30);
						$(that).data('relational-id', id);
						$('.iam-edit-charge-row').data('relational-id', id);
						initCSVButtonListener(4, 'iam-user-charges-table');
						fetchingChargeTable = false;
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
						fetchingChargeTable = false;
					}
				});
			});

			initAddFundsButtonListener();
			initSearchListener('.iam-balances-search', '.iam-bal-user-row-username', 1);
			updateSearchOnLoad();

			findTableItemAgain($('#iam-balances-table'), 0);
		} else if ($('.iam-registration-wrap').length > 0) {
			$('.iam-approve-account').click(function (event) {
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_approve_new_user', user: $(this).data('user') },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						window.location.reload();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
			$('.iam-deny-account').click(function (event) {
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_deny_new_user', user: $(this).data('user') },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						window.location.reload();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
			initRegKeyButtonListener();
			initDeleteRegKeyButtonListener();
			initSearchListener('.iam-registration-search', 'tr .iam-username', 1);
		} else if ($('.iam-user-privileges-wrap').length > 0) {
			var approvedUsers = [];
			var deniedUsers = [];
			$('input[type=checkbox]').click(function (event) {
				var user = $(this).parent().prev('td').text();
				for (var i = 0; i < approvedUsers.length; i++) {
					if (approvedUsers[i] == user) {
						approvedUsers.splice(i, 1);
						return;
					}
				}
				for (var i = 0; i < deniedUsers.length; i++) {
					if (deniedUsers[i] == user) {
						deniedUsers.splice(i, 1);
						return;
					}
				}
				if ($(this).is(':checked')) {
					approvedUsers.push(user);
				} else {
					deniedUsers.push(user);
				}
			});
			$('input[type=submit]').click(function (event) {
				(0, _userfeedback.submissionStart)();
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: { action: 'admin_user_privileges', approved: approvedUsers, denied: deniedUsers },
					success: function success(data) {
						(0, _serverresponse.handleServerResponse)(data);
						window.location.reload();
					},
					error: function error(data) {
						(0, _serverresponse.handleServerError)(data, new Error());
					}
				});
			});
			initSearchListener('.iam-user-privileges-search', 'tr .iam-username', 1);
		} else if ($('.iam-pricing-wrap').length > 0) {
			var changedRows = [];
			var equipDropDown, tagsDropDown;

			initPricingSubmitListener();
			initPricingChangeListeners();
			initAddPricingDropDownListeners();
			initNewMaterialButtonListener();
			initDeletePricingDropDownListener();
			initPricingRowDeleteListener();
			initCSVAJAXButtonListener('admin_pricing_csv');
		} else if ($('.iam-room-res-wrap').length > 0) {

			resetEvents();
			initRoomResCalSubmitListener();
			$('.iam-confirmed-tab').click(function (event) {
				$(this).addClass('iam-selected-tab');
				$('.iam-pending-tab').removeClass('iam-selected-tab');
				roomResStatus = 1;
				makeCalendarRoomRes('', 1);
			});
			$('.iam-pending-tab').click(function (event) {
				$(this).addClass('iam-selected-tab');
				$('.iam-confirmed-tab').removeClass('iam-selected-tab');
				roomResStatus = 0;
				makeCalendarRoomRes('', 0);
			});
			$('.iam-room-res-list-container ul li:not(.iam-select-all-room-res)').click(function (event) {
				makeCalendarRoomRes($(this).text(), roomResStatus);
				$(this).toggleClass('iam-highlighted');
				if ($(this).hasClass('iam-highlighted')) $(this).children('input').prop('checked', true);else $(this).children('input').prop('checked', false);
			});

			//select all listener
			$('.iam-select-all-room-res').click(function (event) {
				$(this).toggleClass('iam-highlighted');
				if ($(this).hasClass('iam-highlighted')) {
					$(this).children('input').prop('checked', true);
					var lastEquip = null;
					$('.iam-room-res-list-container ul li:not(.iam-highlighted)').each(function (index, el) {
						$(this).children('input').prop('checked', true);
						$(this).addClass('iam-highlighted');
						if (lastEquip == null) {
							lastEquip = $(this).text();
						} else {
							roomResSources.push($(this).text());
							roomResSourcesMap[$(this).text()] = roomResSources.length - 1;
						}
					});
					makeCalendarRoomRes(lastEquip);
				} else {
					$(this).children('input').prop('checked', false);
					$('.iam-room-res-list-container ul li.iam-highlighted').each(function (index, el) {
						$(this).children('input').prop('checked', false);
						$(this).removeClass('iam-highlighted');
					});
					roomResSources = [];
					roomResSourcesMap = {};
					$('.iam-cal').fullCalendar('removeEventSource', lastRoomResResource);
				}
			});
			$(document).tooltip();
		}
	});
})(jQuery);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submissionEnd = exports.submissionStart = undefined;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var submissionStart = function submissionStart() {
  (0, _jquery2.default)('body').append('<div class="iam-loading-anim"><div class="iam-loading-bg"></div></div>');
};

var submissionEnd = function submissionEnd() {
  (0, _jquery2.default)('.iam-loading-anim').remove();
};

exports.submissionStart = submissionStart;
exports.submissionEnd = submissionEnd;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overridePrompt = undefined;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

__webpack_require__(20);

__webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function overridePrompt(args) {
  if ((0, _jquery2.default)('#dialog-override').length < 1) (0, _jquery2.default)('body').append('<div id="dialog-override" title="' + args.title + '" ><p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>' + args.body + '</p></div>');

  (0, _jquery2.default)("#dialog-override").dialog({
    resizable: false,
    height: "auto",
    width: 400,
    modal: true,
    buttons: {
      Override: function Override() {
        if (typeof args.override != 'undefined') args.override();
        (0, _jquery2.default)(this).dialog("close");
      },
      Cancel: function Cancel() {
        if (typeof args.cancel != 'undefined') args.cancel();
        (0, _jquery2.default)(this).dialog("close");
      }
    }
  });
}

exports.overridePrompt = overridePrompt;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

// This file is deprecated in 1.12.0 to be removed in 1.13
(function () {
	!(__WEBPACK_AMD_DEFINE_FACTORY__ = (["jquery", "./data", "./disable-selection", "./focusable", "./form", "./ie", "./keycode", "./labels", "./jquery-1-7", "./plugin", "./safe-active-element", "./safe-blur", "./scroll-parent", "./tabbable", "./unique-id", "./version"]),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})();

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Dialog 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Dialog
//>>group: Widgets
//>>description: Displays customizable dialog windows.
//>>docs: http://api.jqueryui.com/dialog/
//>>demos: http://jqueryui.com/dialog/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/dialog.css
//>>css.theme: ../../themes/base/theme.css

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(22), __webpack_require__(28), __webpack_require__(8), __webpack_require__(32), __webpack_require__(14), __webpack_require__(10), __webpack_require__(34), __webpack_require__(13), __webpack_require__(12), __webpack_require__(35), __webpack_require__(36), __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	$.widget("ui.dialog", {
		version: "1.12.1",
		options: {
			appendTo: "body",
			autoOpen: true,
			buttons: [],
			classes: {
				"ui-dialog": "ui-corner-all",
				"ui-dialog-titlebar": "ui-corner-all"
			},
			closeOnEscape: true,
			closeText: "Close",
			draggable: true,
			hide: null,
			height: "auto",
			maxHeight: null,
			maxWidth: null,
			minHeight: 150,
			minWidth: 150,
			modal: false,
			position: {
				my: "center",
				at: "center",
				of: window,
				collision: "fit",

				// Ensure the titlebar is always visible
				using: function using(pos) {
					var topOffset = $(this).css(pos).offset().top;
					if (topOffset < 0) {
						$(this).css("top", pos.top - topOffset);
					}
				}
			},
			resizable: true,
			show: null,
			title: null,
			width: 300,

			// Callbacks
			beforeClose: null,
			close: null,
			drag: null,
			dragStart: null,
			dragStop: null,
			focus: null,
			open: null,
			resize: null,
			resizeStart: null,
			resizeStop: null
		},

		sizeRelatedOptions: {
			buttons: true,
			height: true,
			maxHeight: true,
			maxWidth: true,
			minHeight: true,
			minWidth: true,
			width: true
		},

		resizableRelatedOptions: {
			maxHeight: true,
			maxWidth: true,
			minHeight: true,
			minWidth: true
		},

		_create: function _create() {
			this.originalCss = {
				display: this.element[0].style.display,
				width: this.element[0].style.width,
				minHeight: this.element[0].style.minHeight,
				maxHeight: this.element[0].style.maxHeight,
				height: this.element[0].style.height
			};
			this.originalPosition = {
				parent: this.element.parent(),
				index: this.element.parent().children().index(this.element)
			};
			this.originalTitle = this.element.attr("title");
			if (this.options.title == null && this.originalTitle != null) {
				this.options.title = this.originalTitle;
			}

			// Dialogs can't be disabled
			if (this.options.disabled) {
				this.options.disabled = false;
			}

			this._createWrapper();

			this.element.show().removeAttr("title").appendTo(this.uiDialog);

			this._addClass("ui-dialog-content", "ui-widget-content");

			this._createTitlebar();
			this._createButtonPane();

			if (this.options.draggable && $.fn.draggable) {
				this._makeDraggable();
			}
			if (this.options.resizable && $.fn.resizable) {
				this._makeResizable();
			}

			this._isOpen = false;

			this._trackFocus();
		},

		_init: function _init() {
			if (this.options.autoOpen) {
				this.open();
			}
		},

		_appendTo: function _appendTo() {
			var element = this.options.appendTo;
			if (element && (element.jquery || element.nodeType)) {
				return $(element);
			}
			return this.document.find(element || "body").eq(0);
		},

		_destroy: function _destroy() {
			var next,
			    originalPosition = this.originalPosition;

			this._untrackInstance();
			this._destroyOverlay();

			this.element.removeUniqueId().css(this.originalCss)

			// Without detaching first, the following becomes really slow
			.detach();

			this.uiDialog.remove();

			if (this.originalTitle) {
				this.element.attr("title", this.originalTitle);
			}

			next = originalPosition.parent.children().eq(originalPosition.index);

			// Don't try to place the dialog next to itself (#8613)
			if (next.length && next[0] !== this.element[0]) {
				next.before(this.element);
			} else {
				originalPosition.parent.append(this.element);
			}
		},

		widget: function widget() {
			return this.uiDialog;
		},

		disable: $.noop,
		enable: $.noop,

		close: function close(event) {
			var that = this;

			if (!this._isOpen || this._trigger("beforeClose", event) === false) {
				return;
			}

			this._isOpen = false;
			this._focusedElement = null;
			this._destroyOverlay();
			this._untrackInstance();

			if (!this.opener.filter(":focusable").trigger("focus").length) {

				// Hiding a focused element doesn't trigger blur in WebKit
				// so in case we have nothing to focus on, explicitly blur the active element
				// https://bugs.webkit.org/show_bug.cgi?id=47182
				$.ui.safeBlur($.ui.safeActiveElement(this.document[0]));
			}

			this._hide(this.uiDialog, this.options.hide, function () {
				that._trigger("close", event);
			});
		},

		isOpen: function isOpen() {
			return this._isOpen;
		},

		moveToTop: function moveToTop() {
			this._moveToTop();
		},

		_moveToTop: function _moveToTop(event, silent) {
			var moved = false,
			    zIndices = this.uiDialog.siblings(".ui-front:visible").map(function () {
				return +$(this).css("z-index");
			}).get(),
			    zIndexMax = Math.max.apply(null, zIndices);

			if (zIndexMax >= +this.uiDialog.css("z-index")) {
				this.uiDialog.css("z-index", zIndexMax + 1);
				moved = true;
			}

			if (moved && !silent) {
				this._trigger("focus", event);
			}
			return moved;
		},

		open: function open() {
			var that = this;
			if (this._isOpen) {
				if (this._moveToTop()) {
					this._focusTabbable();
				}
				return;
			}

			this._isOpen = true;
			this.opener = $($.ui.safeActiveElement(this.document[0]));

			this._size();
			this._position();
			this._createOverlay();
			this._moveToTop(null, true);

			// Ensure the overlay is moved to the top with the dialog, but only when
			// opening. The overlay shouldn't move after the dialog is open so that
			// modeless dialogs opened after the modal dialog stack properly.
			if (this.overlay) {
				this.overlay.css("z-index", this.uiDialog.css("z-index") - 1);
			}

			this._show(this.uiDialog, this.options.show, function () {
				that._focusTabbable();
				that._trigger("focus");
			});

			// Track the dialog immediately upon openening in case a focus event
			// somehow occurs outside of the dialog before an element inside the
			// dialog is focused (#10152)
			this._makeFocusTarget();

			this._trigger("open");
		},

		_focusTabbable: function _focusTabbable() {

			// Set focus to the first match:
			// 1. An element that was focused previously
			// 2. First element inside the dialog matching [autofocus]
			// 3. Tabbable element inside the content element
			// 4. Tabbable element inside the buttonpane
			// 5. The close button
			// 6. The dialog itself
			var hasFocus = this._focusedElement;
			if (!hasFocus) {
				hasFocus = this.element.find("[autofocus]");
			}
			if (!hasFocus.length) {
				hasFocus = this.element.find(":tabbable");
			}
			if (!hasFocus.length) {
				hasFocus = this.uiDialogButtonPane.find(":tabbable");
			}
			if (!hasFocus.length) {
				hasFocus = this.uiDialogTitlebarClose.filter(":tabbable");
			}
			if (!hasFocus.length) {
				hasFocus = this.uiDialog;
			}
			hasFocus.eq(0).trigger("focus");
		},

		_keepFocus: function _keepFocus(event) {
			function checkFocus() {
				var activeElement = $.ui.safeActiveElement(this.document[0]),
				    isActive = this.uiDialog[0] === activeElement || $.contains(this.uiDialog[0], activeElement);
				if (!isActive) {
					this._focusTabbable();
				}
			}
			event.preventDefault();
			checkFocus.call(this);

			// support: IE
			// IE <= 8 doesn't prevent moving focus even with event.preventDefault()
			// so we check again later
			this._delay(checkFocus);
		},

		_createWrapper: function _createWrapper() {
			this.uiDialog = $("<div>").hide().attr({

				// Setting tabIndex makes the div focusable
				tabIndex: -1,
				role: "dialog"
			}).appendTo(this._appendTo());

			this._addClass(this.uiDialog, "ui-dialog", "ui-widget ui-widget-content ui-front");
			this._on(this.uiDialog, {
				keydown: function keydown(event) {
					if (this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
						event.preventDefault();
						this.close(event);
						return;
					}

					// Prevent tabbing out of dialogs
					if (event.keyCode !== $.ui.keyCode.TAB || event.isDefaultPrevented()) {
						return;
					}
					var tabbables = this.uiDialog.find(":tabbable"),
					    first = tabbables.filter(":first"),
					    last = tabbables.filter(":last");

					if ((event.target === last[0] || event.target === this.uiDialog[0]) && !event.shiftKey) {
						this._delay(function () {
							first.trigger("focus");
						});
						event.preventDefault();
					} else if ((event.target === first[0] || event.target === this.uiDialog[0]) && event.shiftKey) {
						this._delay(function () {
							last.trigger("focus");
						});
						event.preventDefault();
					}
				},
				mousedown: function mousedown(event) {
					if (this._moveToTop(event)) {
						this._focusTabbable();
					}
				}
			});

			// We assume that any existing aria-describedby attribute means
			// that the dialog content is marked up properly
			// otherwise we brute force the content as the description
			if (!this.element.find("[aria-describedby]").length) {
				this.uiDialog.attr({
					"aria-describedby": this.element.uniqueId().attr("id")
				});
			}
		},

		_createTitlebar: function _createTitlebar() {
			var uiDialogTitle;

			this.uiDialogTitlebar = $("<div>");
			this._addClass(this.uiDialogTitlebar, "ui-dialog-titlebar", "ui-widget-header ui-helper-clearfix");
			this._on(this.uiDialogTitlebar, {
				mousedown: function mousedown(event) {

					// Don't prevent click on close button (#8838)
					// Focusing a dialog that is partially scrolled out of view
					// causes the browser to scroll it into view, preventing the click event
					if (!$(event.target).closest(".ui-dialog-titlebar-close")) {

						// Dialog isn't getting focus when dragging (#8063)
						this.uiDialog.trigger("focus");
					}
				}
			});

			// Support: IE
			// Use type="button" to prevent enter keypresses in textboxes from closing the
			// dialog in IE (#9312)
			this.uiDialogTitlebarClose = $("<button type='button'></button>").button({
				label: $("<a>").text(this.options.closeText).html(),
				icon: "ui-icon-closethick",
				showLabel: false
			}).appendTo(this.uiDialogTitlebar);

			this._addClass(this.uiDialogTitlebarClose, "ui-dialog-titlebar-close");
			this._on(this.uiDialogTitlebarClose, {
				click: function click(event) {
					event.preventDefault();
					this.close(event);
				}
			});

			uiDialogTitle = $("<span>").uniqueId().prependTo(this.uiDialogTitlebar);
			this._addClass(uiDialogTitle, "ui-dialog-title");
			this._title(uiDialogTitle);

			this.uiDialogTitlebar.prependTo(this.uiDialog);

			this.uiDialog.attr({
				"aria-labelledby": uiDialogTitle.attr("id")
			});
		},

		_title: function _title(title) {
			if (this.options.title) {
				title.text(this.options.title);
			} else {
				title.html("&#160;");
			}
		},

		_createButtonPane: function _createButtonPane() {
			this.uiDialogButtonPane = $("<div>");
			this._addClass(this.uiDialogButtonPane, "ui-dialog-buttonpane", "ui-widget-content ui-helper-clearfix");

			this.uiButtonSet = $("<div>").appendTo(this.uiDialogButtonPane);
			this._addClass(this.uiButtonSet, "ui-dialog-buttonset");

			this._createButtons();
		},

		_createButtons: function _createButtons() {
			var that = this,
			    buttons = this.options.buttons;

			// If we already have a button pane, remove it
			this.uiDialogButtonPane.remove();
			this.uiButtonSet.empty();

			if ($.isEmptyObject(buttons) || $.isArray(buttons) && !buttons.length) {
				this._removeClass(this.uiDialog, "ui-dialog-buttons");
				return;
			}

			$.each(buttons, function (name, props) {
				var click, buttonOptions;
				props = $.isFunction(props) ? { click: props, text: name } : props;

				// Default to a non-submitting button
				props = $.extend({ type: "button" }, props);

				// Change the context for the click callback to be the main element
				click = props.click;
				buttonOptions = {
					icon: props.icon,
					iconPosition: props.iconPosition,
					showLabel: props.showLabel,

					// Deprecated options
					icons: props.icons,
					text: props.text
				};

				delete props.click;
				delete props.icon;
				delete props.iconPosition;
				delete props.showLabel;

				// Deprecated options
				delete props.icons;
				if (typeof props.text === "boolean") {
					delete props.text;
				}

				$("<button></button>", props).button(buttonOptions).appendTo(that.uiButtonSet).on("click", function () {
					click.apply(that.element[0], arguments);
				});
			});
			this._addClass(this.uiDialog, "ui-dialog-buttons");
			this.uiDialogButtonPane.appendTo(this.uiDialog);
		},

		_makeDraggable: function _makeDraggable() {
			var that = this,
			    options = this.options;

			function filteredUi(ui) {
				return {
					position: ui.position,
					offset: ui.offset
				};
			}

			this.uiDialog.draggable({
				cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
				handle: ".ui-dialog-titlebar",
				containment: "document",
				start: function start(event, ui) {
					that._addClass($(this), "ui-dialog-dragging");
					that._blockFrames();
					that._trigger("dragStart", event, filteredUi(ui));
				},
				drag: function drag(event, ui) {
					that._trigger("drag", event, filteredUi(ui));
				},
				stop: function stop(event, ui) {
					var left = ui.offset.left - that.document.scrollLeft(),
					    top = ui.offset.top - that.document.scrollTop();

					options.position = {
						my: "left top",
						at: "left" + (left >= 0 ? "+" : "") + left + " " + "top" + (top >= 0 ? "+" : "") + top,
						of: that.window
					};
					that._removeClass($(this), "ui-dialog-dragging");
					that._unblockFrames();
					that._trigger("dragStop", event, filteredUi(ui));
				}
			});
		},

		_makeResizable: function _makeResizable() {
			var that = this,
			    options = this.options,
			    handles = options.resizable,


			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiDialog.css("position"),
			    resizeHandles = typeof handles === "string" ? handles : "n,e,s,w,se,sw,ne,nw";

			function filteredUi(ui) {
				return {
					originalPosition: ui.originalPosition,
					originalSize: ui.originalSize,
					position: ui.position,
					size: ui.size
				};
			}

			this.uiDialog.resizable({
				cancel: ".ui-dialog-content",
				containment: "document",
				alsoResize: this.element,
				maxWidth: options.maxWidth,
				maxHeight: options.maxHeight,
				minWidth: options.minWidth,
				minHeight: this._minHeight(),
				handles: resizeHandles,
				start: function start(event, ui) {
					that._addClass($(this), "ui-dialog-resizing");
					that._blockFrames();
					that._trigger("resizeStart", event, filteredUi(ui));
				},
				resize: function resize(event, ui) {
					that._trigger("resize", event, filteredUi(ui));
				},
				stop: function stop(event, ui) {
					var offset = that.uiDialog.offset(),
					    left = offset.left - that.document.scrollLeft(),
					    top = offset.top - that.document.scrollTop();

					options.height = that.uiDialog.height();
					options.width = that.uiDialog.width();
					options.position = {
						my: "left top",
						at: "left" + (left >= 0 ? "+" : "") + left + " " + "top" + (top >= 0 ? "+" : "") + top,
						of: that.window
					};
					that._removeClass($(this), "ui-dialog-resizing");
					that._unblockFrames();
					that._trigger("resizeStop", event, filteredUi(ui));
				}
			}).css("position", position);
		},

		_trackFocus: function _trackFocus() {
			this._on(this.widget(), {
				focusin: function focusin(event) {
					this._makeFocusTarget();
					this._focusedElement = $(event.target);
				}
			});
		},

		_makeFocusTarget: function _makeFocusTarget() {
			this._untrackInstance();
			this._trackingInstances().unshift(this);
		},

		_untrackInstance: function _untrackInstance() {
			var instances = this._trackingInstances(),
			    exists = $.inArray(this, instances);
			if (exists !== -1) {
				instances.splice(exists, 1);
			}
		},

		_trackingInstances: function _trackingInstances() {
			var instances = this.document.data("ui-dialog-instances");
			if (!instances) {
				instances = [];
				this.document.data("ui-dialog-instances", instances);
			}
			return instances;
		},

		_minHeight: function _minHeight() {
			var options = this.options;

			return options.height === "auto" ? options.minHeight : Math.min(options.minHeight, options.height);
		},

		_position: function _position() {

			// Need to show the dialog to get the actual offset in the position plugin
			var isVisible = this.uiDialog.is(":visible");
			if (!isVisible) {
				this.uiDialog.show();
			}
			this.uiDialog.position(this.options.position);
			if (!isVisible) {
				this.uiDialog.hide();
			}
		},

		_setOptions: function _setOptions(options) {
			var that = this,
			    resize = false,
			    resizableOptions = {};

			$.each(options, function (key, value) {
				that._setOption(key, value);

				if (key in that.sizeRelatedOptions) {
					resize = true;
				}
				if (key in that.resizableRelatedOptions) {
					resizableOptions[key] = value;
				}
			});

			if (resize) {
				this._size();
				this._position();
			}
			if (this.uiDialog.is(":data(ui-resizable)")) {
				this.uiDialog.resizable("option", resizableOptions);
			}
		},

		_setOption: function _setOption(key, value) {
			var isDraggable,
			    isResizable,
			    uiDialog = this.uiDialog;

			if (key === "disabled") {
				return;
			}

			this._super(key, value);

			if (key === "appendTo") {
				this.uiDialog.appendTo(this._appendTo());
			}

			if (key === "buttons") {
				this._createButtons();
			}

			if (key === "closeText") {
				this.uiDialogTitlebarClose.button({

					// Ensure that we always pass a string
					label: $("<a>").text("" + this.options.closeText).html()
				});
			}

			if (key === "draggable") {
				isDraggable = uiDialog.is(":data(ui-draggable)");
				if (isDraggable && !value) {
					uiDialog.draggable("destroy");
				}

				if (!isDraggable && value) {
					this._makeDraggable();
				}
			}

			if (key === "position") {
				this._position();
			}

			if (key === "resizable") {

				// currently resizable, becoming non-resizable
				isResizable = uiDialog.is(":data(ui-resizable)");
				if (isResizable && !value) {
					uiDialog.resizable("destroy");
				}

				// Currently resizable, changing handles
				if (isResizable && typeof value === "string") {
					uiDialog.resizable("option", "handles", value);
				}

				// Currently non-resizable, becoming resizable
				if (!isResizable && value !== false) {
					this._makeResizable();
				}
			}

			if (key === "title") {
				this._title(this.uiDialogTitlebar.find(".ui-dialog-title"));
			}
		},

		_size: function _size() {

			// If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
			// divs will both have width and height set, so we need to reset them
			var nonContentHeight,
			    minContentHeight,
			    maxContentHeight,
			    options = this.options;

			// Reset content sizing
			this.element.show().css({
				width: "auto",
				minHeight: 0,
				maxHeight: "none",
				height: 0
			});

			if (options.minWidth > options.width) {
				options.width = options.minWidth;
			}

			// Reset wrapper sizing
			// determine the height of all the non-content elements
			nonContentHeight = this.uiDialog.css({
				height: "auto",
				width: options.width
			}).outerHeight();
			minContentHeight = Math.max(0, options.minHeight - nonContentHeight);
			maxContentHeight = typeof options.maxHeight === "number" ? Math.max(0, options.maxHeight - nonContentHeight) : "none";

			if (options.height === "auto") {
				this.element.css({
					minHeight: minContentHeight,
					maxHeight: maxContentHeight,
					height: "auto"
				});
			} else {
				this.element.height(Math.max(0, options.height - nonContentHeight));
			}

			if (this.uiDialog.is(":data(ui-resizable)")) {
				this.uiDialog.resizable("option", "minHeight", this._minHeight());
			}
		},

		_blockFrames: function _blockFrames() {
			this.iframeBlocks = this.document.find("iframe").map(function () {
				var iframe = $(this);

				return $("<div>").css({
					position: "absolute",
					width: iframe.outerWidth(),
					height: iframe.outerHeight()
				}).appendTo(iframe.parent()).offset(iframe.offset())[0];
			});
		},

		_unblockFrames: function _unblockFrames() {
			if (this.iframeBlocks) {
				this.iframeBlocks.remove();
				delete this.iframeBlocks;
			}
		},

		_allowInteraction: function _allowInteraction(event) {
			if ($(event.target).closest(".ui-dialog").length) {
				return true;
			}

			// TODO: Remove hack when datepicker implements
			// the .ui-front logic (#8989)
			return !!$(event.target).closest(".ui-datepicker").length;
		},

		_createOverlay: function _createOverlay() {
			if (!this.options.modal) {
				return;
			}

			// We use a delay in case the overlay is created from an
			// event that we're going to be cancelling (#2804)
			var isOpening = true;
			this._delay(function () {
				isOpening = false;
			});

			if (!this.document.data("ui-dialog-overlays")) {

				// Prevent use of anchors and inputs
				// Using _on() for an event handler shared across many instances is
				// safe because the dialogs stack and must be closed in reverse order
				this._on(this.document, {
					focusin: function focusin(event) {
						if (isOpening) {
							return;
						}

						if (!this._allowInteraction(event)) {
							event.preventDefault();
							this._trackingInstances()[0]._focusTabbable();
						}
					}
				});
			}

			this.overlay = $("<div>").appendTo(this._appendTo());

			this._addClass(this.overlay, null, "ui-widget-overlay ui-front");
			this._on(this.overlay, {
				mousedown: "_keepFocus"
			});
			this.document.data("ui-dialog-overlays", (this.document.data("ui-dialog-overlays") || 0) + 1);
		},

		_destroyOverlay: function _destroyOverlay() {
			if (!this.options.modal) {
				return;
			}

			if (this.overlay) {
				var overlays = this.document.data("ui-dialog-overlays") - 1;

				if (!overlays) {
					this._off(this.document, "focusin");
					this.document.removeData("ui-dialog-overlays");
				} else {
					this.document.data("ui-dialog-overlays", overlays);
				}

				this.overlay.remove();
				this.overlay = null;
			}
		}
	});

	// DEPRECATED
	// TODO: switch return back to widget declaration at top of file when this is removed
	if ($.uiBackCompat !== false) {

		// Backcompat for dialogClass option
		$.widget("ui.dialog", $.ui.dialog, {
			options: {
				dialogClass: ""
			},
			_createWrapper: function _createWrapper() {
				this._super();
				this.uiDialog.addClass(this.options.dialogClass);
			},
			_setOption: function _setOption(key, value) {
				if (key === "dialogClass") {
					this.uiDialog.removeClass(this.options.dialogClass).addClass(value);
				}
				this._superApply(arguments);
			}
		});
	}

	return $.ui.dialog;
});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * jQuery UI Button 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Button
//>>group: Widgets
//>>description: Enhances a form with themeable buttons.
//>>docs: http://api.jqueryui.com/button/
//>>demos: http://jqueryui.com/button/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.theme: ../../themes/base/theme.css

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0),

		// These are only for backcompat
		// TODO: Remove after 1.12
		__webpack_require__(23), __webpack_require__(24), __webpack_require__(10), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	$.widget("ui.button", {
		version: "1.12.1",
		defaultElement: "<button>",
		options: {
			classes: {
				"ui-button": "ui-corner-all"
			},
			disabled: null,
			icon: null,
			iconPosition: "beginning",
			label: null,
			showLabel: true
		},

		_getCreateOptions: function _getCreateOptions() {
			var disabled,


			// This is to support cases like in jQuery Mobile where the base widget does have
			// an implementation of _getCreateOptions
			options = this._super() || {};

			this.isInput = this.element.is("input");

			disabled = this.element[0].disabled;
			if (disabled != null) {
				options.disabled = disabled;
			}

			this.originalLabel = this.isInput ? this.element.val() : this.element.html();
			if (this.originalLabel) {
				options.label = this.originalLabel;
			}

			return options;
		},

		_create: function _create() {
			if (!this.option.showLabel & !this.options.icon) {
				this.options.showLabel = true;
			}

			// We have to check the option again here even though we did in _getCreateOptions,
			// because null may have been passed on init which would override what was set in
			// _getCreateOptions
			if (this.options.disabled == null) {
				this.options.disabled = this.element[0].disabled || false;
			}

			this.hasTitle = !!this.element.attr("title");

			// Check to see if the label needs to be set or if its already correct
			if (this.options.label && this.options.label !== this.originalLabel) {
				if (this.isInput) {
					this.element.val(this.options.label);
				} else {
					this.element.html(this.options.label);
				}
			}
			this._addClass("ui-button", "ui-widget");
			this._setOption("disabled", this.options.disabled);
			this._enhance();

			if (this.element.is("a")) {
				this._on({
					"keyup": function keyup(event) {
						if (event.keyCode === $.ui.keyCode.SPACE) {
							event.preventDefault();

							// Support: PhantomJS <= 1.9, IE 8 Only
							// If a native click is available use it so we actually cause navigation
							// otherwise just trigger a click event
							if (this.element[0].click) {
								this.element[0].click();
							} else {
								this.element.trigger("click");
							}
						}
					}
				});
			}
		},

		_enhance: function _enhance() {
			if (!this.element.is("button")) {
				this.element.attr("role", "button");
			}

			if (this.options.icon) {
				this._updateIcon("icon", this.options.icon);
				this._updateTooltip();
			}
		},

		_updateTooltip: function _updateTooltip() {
			this.title = this.element.attr("title");

			if (!this.options.showLabel && !this.title) {
				this.element.attr("title", this.options.label);
			}
		},

		_updateIcon: function _updateIcon(option, value) {
			var icon = option !== "iconPosition",
			    position = icon ? this.options.iconPosition : value,
			    displayBlock = position === "top" || position === "bottom";

			// Create icon
			if (!this.icon) {
				this.icon = $("<span>");

				this._addClass(this.icon, "ui-button-icon", "ui-icon");

				if (!this.options.showLabel) {
					this._addClass("ui-button-icon-only");
				}
			} else if (icon) {

				// If we are updating the icon remove the old icon class
				this._removeClass(this.icon, null, this.options.icon);
			}

			// If we are updating the icon add the new icon class
			if (icon) {
				this._addClass(this.icon, null, value);
			}

			this._attachIcon(position);

			// If the icon is on top or bottom we need to add the ui-widget-icon-block class and remove
			// the iconSpace if there is one.
			if (displayBlock) {
				this._addClass(this.icon, null, "ui-widget-icon-block");
				if (this.iconSpace) {
					this.iconSpace.remove();
				}
			} else {

				// Position is beginning or end so remove the ui-widget-icon-block class and add the
				// space if it does not exist
				if (!this.iconSpace) {
					this.iconSpace = $("<span> </span>");
					this._addClass(this.iconSpace, "ui-button-icon-space");
				}
				this._removeClass(this.icon, null, "ui-wiget-icon-block");
				this._attachIconSpace(position);
			}
		},

		_destroy: function _destroy() {
			this.element.removeAttr("role");

			if (this.icon) {
				this.icon.remove();
			}
			if (this.iconSpace) {
				this.iconSpace.remove();
			}
			if (!this.hasTitle) {
				this.element.removeAttr("title");
			}
		},

		_attachIconSpace: function _attachIconSpace(iconPosition) {
			this.icon[/^(?:end|bottom)/.test(iconPosition) ? "before" : "after"](this.iconSpace);
		},

		_attachIcon: function _attachIcon(iconPosition) {
			this.element[/^(?:end|bottom)/.test(iconPosition) ? "append" : "prepend"](this.icon);
		},

		_setOptions: function _setOptions(options) {
			var newShowLabel = options.showLabel === undefined ? this.options.showLabel : options.showLabel,
			    newIcon = options.icon === undefined ? this.options.icon : options.icon;

			if (!newShowLabel && !newIcon) {
				options.showLabel = true;
			}
			this._super(options);
		},

		_setOption: function _setOption(key, value) {
			if (key === "icon") {
				if (value) {
					this._updateIcon(key, value);
				} else if (this.icon) {
					this.icon.remove();
					if (this.iconSpace) {
						this.iconSpace.remove();
					}
				}
			}

			if (key === "iconPosition") {
				this._updateIcon(key, value);
			}

			// Make sure we can't end up with a button that has neither text nor icon
			if (key === "showLabel") {
				this._toggleClass("ui-button-icon-only", null, !value);
				this._updateTooltip();
			}

			if (key === "label") {
				if (this.isInput) {
					this.element.val(value);
				} else {

					// If there is an icon, append it, else nothing then append the value
					// this avoids removal of the icon when setting label text
					this.element.html(value);
					if (this.icon) {
						this._attachIcon(this.options.iconPosition);
						this._attachIconSpace(this.options.iconPosition);
					}
				}
			}

			this._super(key, value);

			if (key === "disabled") {
				this._toggleClass(null, "ui-state-disabled", value);
				this.element[0].disabled = value;
				if (value) {
					this.element.blur();
				}
			}
		},

		refresh: function refresh() {

			// Make sure to only check disabled if its an element that supports this otherwise
			// check for the disabled class to determine state
			var isDisabled = this.element.is("input, button") ? this.element[0].disabled : this.element.hasClass("ui-button-disabled");

			if (isDisabled !== this.options.disabled) {
				this._setOptions({ disabled: isDisabled });
			}

			this._updateTooltip();
		}
	});

	// DEPRECATED
	if ($.uiBackCompat !== false) {

		// Text and Icons options
		$.widget("ui.button", $.ui.button, {
			options: {
				text: true,
				icons: {
					primary: null,
					secondary: null
				}
			},

			_create: function _create() {
				if (this.options.showLabel && !this.options.text) {
					this.options.showLabel = this.options.text;
				}
				if (!this.options.showLabel && this.options.text) {
					this.options.text = this.options.showLabel;
				}
				if (!this.options.icon && (this.options.icons.primary || this.options.icons.secondary)) {
					if (this.options.icons.primary) {
						this.options.icon = this.options.icons.primary;
					} else {
						this.options.icon = this.options.icons.secondary;
						this.options.iconPosition = "end";
					}
				} else if (this.options.icon) {
					this.options.icons.primary = this.options.icon;
				}
				this._super();
			},

			_setOption: function _setOption(key, value) {
				if (key === "text") {
					this._super("showLabel", value);
					return;
				}
				if (key === "showLabel") {
					this.options.text = value;
				}
				if (key === "icon") {
					this.options.icons.primary = value;
				}
				if (key === "icons") {
					if (value.primary) {
						this._super("icon", value.primary);
						this._super("iconPosition", "beginning");
					} else if (value.secondary) {
						this._super("icon", value.secondary);
						this._super("iconPosition", "end");
					}
				}
				this._superApply(arguments);
			}
		});

		$.fn.button = function (orig) {
			return function () {
				if (!this.length || this.length && this[0].tagName !== "INPUT" || this.length && this[0].tagName === "INPUT" && this.attr("type") !== "checkbox" && this.attr("type") !== "radio") {
					return orig.apply(this, arguments);
				}
				if (!$.ui.checkboxradio) {
					$.error("Checkboxradio widget missing");
				}
				if (arguments.length === 0) {
					return this.checkboxradio({
						"icon": false
					});
				}
				return this.checkboxradio.apply(this, arguments);
			};
		}($.fn.button);

		$.fn.buttonset = function () {
			if (!$.ui.controlgroup) {
				$.error("Controlgroup widget missing");
			}
			if (arguments[0] === "option" && arguments[1] === "items" && arguments[2]) {
				return this.controlgroup.apply(this, [arguments[0], "items.button", arguments[2]]);
			}
			if (arguments[0] === "option" && arguments[1] === "items") {
				return this.controlgroup.apply(this, [arguments[0], "items.button"]);
			}
			if (_typeof(arguments[0]) === "object" && arguments[0].items) {
				arguments[0].items = {
					button: arguments[0].items
				};
			}
			return this.controlgroup.apply(this, arguments);
		};
	}

	return $.ui.button;
});

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Controlgroup 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Controlgroup
//>>group: Widgets
//>>description: Visually groups form control widgets
//>>docs: http://api.jqueryui.com/controlgroup/
//>>demos: http://jqueryui.com/controlgroup/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/controlgroup.css
//>>css.theme: ../../themes/base/theme.css

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {
	var controlgroupCornerRegex = /ui-corner-([a-z]){2,6}/g;

	return $.widget("ui.controlgroup", {
		version: "1.12.1",
		defaultElement: "<div>",
		options: {
			direction: "horizontal",
			disabled: null,
			onlyVisible: true,
			items: {
				"button": "input[type=button], input[type=submit], input[type=reset], button, a",
				"controlgroupLabel": ".ui-controlgroup-label",
				"checkboxradio": "input[type='checkbox'], input[type='radio']",
				"selectmenu": "select",
				"spinner": ".ui-spinner-input"
			}
		},

		_create: function _create() {
			this._enhance();
		},

		// To support the enhanced option in jQuery Mobile, we isolate DOM manipulation
		_enhance: function _enhance() {
			this.element.attr("role", "toolbar");
			this.refresh();
		},

		_destroy: function _destroy() {
			this._callChildMethod("destroy");
			this.childWidgets.removeData("ui-controlgroup-data");
			this.element.removeAttr("role");
			if (this.options.items.controlgroupLabel) {
				this.element.find(this.options.items.controlgroupLabel).find(".ui-controlgroup-label-contents").contents().unwrap();
			}
		},

		_initWidgets: function _initWidgets() {
			var that = this,
			    childWidgets = [];

			// First we iterate over each of the items options
			$.each(this.options.items, function (widget, selector) {
				var labels;
				var options = {};

				// Make sure the widget has a selector set
				if (!selector) {
					return;
				}

				if (widget === "controlgroupLabel") {
					labels = that.element.find(selector);
					labels.each(function () {
						var element = $(this);

						if (element.children(".ui-controlgroup-label-contents").length) {
							return;
						}
						element.contents().wrapAll("<span class='ui-controlgroup-label-contents'></span>");
					});
					that._addClass(labels, null, "ui-widget ui-widget-content ui-state-default");
					childWidgets = childWidgets.concat(labels.get());
					return;
				}

				// Make sure the widget actually exists
				if (!$.fn[widget]) {
					return;
				}

				// We assume everything is in the middle to start because we can't determine
				// first / last elements until all enhancments are done.
				if (that["_" + widget + "Options"]) {
					options = that["_" + widget + "Options"]("middle");
				} else {
					options = { classes: {} };
				}

				// Find instances of this widget inside controlgroup and init them
				that.element.find(selector).each(function () {
					var element = $(this);
					var instance = element[widget]("instance");

					// We need to clone the default options for this type of widget to avoid
					// polluting the variable options which has a wider scope than a single widget.
					var instanceOptions = $.widget.extend({}, options);

					// If the button is the child of a spinner ignore it
					// TODO: Find a more generic solution
					if (widget === "button" && element.parent(".ui-spinner").length) {
						return;
					}

					// Create the widget if it doesn't exist
					if (!instance) {
						instance = element[widget]()[widget]("instance");
					}
					if (instance) {
						instanceOptions.classes = that._resolveClassesValues(instanceOptions.classes, instance);
					}
					element[widget](instanceOptions);

					// Store an instance of the controlgroup to be able to reference
					// from the outermost element for changing options and refresh
					var widgetElement = element[widget]("widget");
					$.data(widgetElement[0], "ui-controlgroup-data", instance ? instance : element[widget]("instance"));

					childWidgets.push(widgetElement[0]);
				});
			});

			this.childWidgets = $($.unique(childWidgets));
			this._addClass(this.childWidgets, "ui-controlgroup-item");
		},

		_callChildMethod: function _callChildMethod(method) {
			this.childWidgets.each(function () {
				var element = $(this),
				    data = element.data("ui-controlgroup-data");
				if (data && data[method]) {
					data[method]();
				}
			});
		},

		_updateCornerClass: function _updateCornerClass(element, position) {
			var remove = "ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all";
			var add = this._buildSimpleOptions(position, "label").classes.label;

			this._removeClass(element, null, remove);
			this._addClass(element, null, add);
		},

		_buildSimpleOptions: function _buildSimpleOptions(position, key) {
			var direction = this.options.direction === "vertical";
			var result = {
				classes: {}
			};
			result.classes[key] = {
				"middle": "",
				"first": "ui-corner-" + (direction ? "top" : "left"),
				"last": "ui-corner-" + (direction ? "bottom" : "right"),
				"only": "ui-corner-all"
			}[position];

			return result;
		},

		_spinnerOptions: function _spinnerOptions(position) {
			var options = this._buildSimpleOptions(position, "ui-spinner");

			options.classes["ui-spinner-up"] = "";
			options.classes["ui-spinner-down"] = "";

			return options;
		},

		_buttonOptions: function _buttonOptions(position) {
			return this._buildSimpleOptions(position, "ui-button");
		},

		_checkboxradioOptions: function _checkboxradioOptions(position) {
			return this._buildSimpleOptions(position, "ui-checkboxradio-label");
		},

		_selectmenuOptions: function _selectmenuOptions(position) {
			var direction = this.options.direction === "vertical";
			return {
				width: direction ? "auto" : false,
				classes: {
					middle: {
						"ui-selectmenu-button-open": "",
						"ui-selectmenu-button-closed": ""
					},
					first: {
						"ui-selectmenu-button-open": "ui-corner-" + (direction ? "top" : "tl"),
						"ui-selectmenu-button-closed": "ui-corner-" + (direction ? "top" : "left")
					},
					last: {
						"ui-selectmenu-button-open": direction ? "" : "ui-corner-tr",
						"ui-selectmenu-button-closed": "ui-corner-" + (direction ? "bottom" : "right")
					},
					only: {
						"ui-selectmenu-button-open": "ui-corner-top",
						"ui-selectmenu-button-closed": "ui-corner-all"
					}

				}[position]
			};
		},

		_resolveClassesValues: function _resolveClassesValues(classes, instance) {
			var result = {};
			$.each(classes, function (key) {
				var current = instance.options.classes[key] || "";
				current = $.trim(current.replace(controlgroupCornerRegex, ""));
				result[key] = (current + " " + classes[key]).replace(/\s+/g, " ");
			});
			return result;
		},

		_setOption: function _setOption(key, value) {
			if (key === "direction") {
				this._removeClass("ui-controlgroup-" + this.options.direction);
			}

			this._super(key, value);
			if (key === "disabled") {
				this._callChildMethod(value ? "disable" : "enable");
				return;
			}

			this.refresh();
		},

		refresh: function refresh() {
			var children,
			    that = this;

			this._addClass("ui-controlgroup ui-controlgroup-" + this.options.direction);

			if (this.options.direction === "horizontal") {
				this._addClass(null, "ui-helper-clearfix");
			}
			this._initWidgets();

			children = this.childWidgets;

			// We filter here because we need to track all childWidgets not just the visible ones
			if (this.options.onlyVisible) {
				children = children.filter(":visible");
			}

			if (children.length) {

				// We do this last because we need to make sure all enhancment is done
				// before determining first and last
				$.each(["first", "last"], function (index, value) {
					var instance = children[value]().data("ui-controlgroup-data");

					if (instance && that["_" + instance.widgetName + "Options"]) {
						var options = that["_" + instance.widgetName + "Options"](children.length === 1 ? "only" : value);
						options.classes = that._resolveClassesValues(options.classes, instance);
						instance.element[instance.widgetName](options);
					} else {
						that._updateCornerClass(children[value](), value);
					}
				});

				// Finally call the refresh method on each of the child widgets.
				this._callChildMethod("refresh");
			}
		}
	});
});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Checkboxradio 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Checkboxradio
//>>group: Widgets
//>>description: Enhances a form with multiple themeable checkboxes or radio buttons.
//>>docs: http://api.jqueryui.com/checkboxradio/
//>>demos: http://jqueryui.com/checkboxradio/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.structure: ../../themes/base/checkboxradio.css
//>>css.theme: ../../themes/base/theme.css

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(9), __webpack_require__(25), __webpack_require__(27), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	$.widget("ui.checkboxradio", [$.ui.formResetMixin, {
		version: "1.12.1",
		options: {
			disabled: null,
			label: null,
			icon: true,
			classes: {
				"ui-checkboxradio-label": "ui-corner-all",
				"ui-checkboxradio-icon": "ui-corner-all"
			}
		},

		_getCreateOptions: function _getCreateOptions() {
			var disabled, labels;
			var that = this;
			var options = this._super() || {};

			// We read the type here, because it makes more sense to throw a element type error first,
			// rather then the error for lack of a label. Often if its the wrong type, it
			// won't have a label (e.g. calling on a div, btn, etc)
			this._readType();

			labels = this.element.labels();

			// If there are multiple labels, use the last one
			this.label = $(labels[labels.length - 1]);
			if (!this.label.length) {
				$.error("No label found for checkboxradio widget");
			}

			this.originalLabel = "";

			// We need to get the label text but this may also need to make sure it does not contain the
			// input itself.
			this.label.contents().not(this.element[0]).each(function () {

				// The label contents could be text, html, or a mix. We concat each element to get a
				// string representation of the label, without the input as part of it.
				that.originalLabel += this.nodeType === 3 ? $(this).text() : this.outerHTML;
			});

			// Set the label option if we found label text
			if (this.originalLabel) {
				options.label = this.originalLabel;
			}

			disabled = this.element[0].disabled;
			if (disabled != null) {
				options.disabled = disabled;
			}
			return options;
		},

		_create: function _create() {
			var checked = this.element[0].checked;

			this._bindFormResetHandler();

			if (this.options.disabled == null) {
				this.options.disabled = this.element[0].disabled;
			}

			this._setOption("disabled", this.options.disabled);
			this._addClass("ui-checkboxradio", "ui-helper-hidden-accessible");
			this._addClass(this.label, "ui-checkboxradio-label", "ui-button ui-widget");

			if (this.type === "radio") {
				this._addClass(this.label, "ui-checkboxradio-radio-label");
			}

			if (this.options.label && this.options.label !== this.originalLabel) {
				this._updateLabel();
			} else if (this.originalLabel) {
				this.options.label = this.originalLabel;
			}

			this._enhance();

			if (checked) {
				this._addClass(this.label, "ui-checkboxradio-checked", "ui-state-active");
				if (this.icon) {
					this._addClass(this.icon, null, "ui-state-hover");
				}
			}

			this._on({
				change: "_toggleClasses",
				focus: function focus() {
					this._addClass(this.label, null, "ui-state-focus ui-visual-focus");
				},
				blur: function blur() {
					this._removeClass(this.label, null, "ui-state-focus ui-visual-focus");
				}
			});
		},

		_readType: function _readType() {
			var nodeName = this.element[0].nodeName.toLowerCase();
			this.type = this.element[0].type;
			if (nodeName !== "input" || !/radio|checkbox/.test(this.type)) {
				$.error("Can't create checkboxradio on element.nodeName=" + nodeName + " and element.type=" + this.type);
			}
		},

		// Support jQuery Mobile enhanced option
		_enhance: function _enhance() {
			this._updateIcon(this.element[0].checked);
		},

		widget: function widget() {
			return this.label;
		},

		_getRadioGroup: function _getRadioGroup() {
			var group;
			var name = this.element[0].name;
			var nameSelector = "input[name='" + $.ui.escapeSelector(name) + "']";

			if (!name) {
				return $([]);
			}

			if (this.form.length) {
				group = $(this.form[0].elements).filter(nameSelector);
			} else {

				// Not inside a form, check all inputs that also are not inside a form
				group = $(nameSelector).filter(function () {
					return $(this).form().length === 0;
				});
			}

			return group.not(this.element);
		},

		_toggleClasses: function _toggleClasses() {
			var checked = this.element[0].checked;
			this._toggleClass(this.label, "ui-checkboxradio-checked", "ui-state-active", checked);

			if (this.options.icon && this.type === "checkbox") {
				this._toggleClass(this.icon, null, "ui-icon-check ui-state-checked", checked)._toggleClass(this.icon, null, "ui-icon-blank", !checked);
			}

			if (this.type === "radio") {
				this._getRadioGroup().each(function () {
					var instance = $(this).checkboxradio("instance");

					if (instance) {
						instance._removeClass(instance.label, "ui-checkboxradio-checked", "ui-state-active");
					}
				});
			}
		},

		_destroy: function _destroy() {
			this._unbindFormResetHandler();

			if (this.icon) {
				this.icon.remove();
				this.iconSpace.remove();
			}
		},

		_setOption: function _setOption(key, value) {

			// We don't allow the value to be set to nothing
			if (key === "label" && !value) {
				return;
			}

			this._super(key, value);

			if (key === "disabled") {
				this._toggleClass(this.label, null, "ui-state-disabled", value);
				this.element[0].disabled = value;

				// Don't refresh when setting disabled
				return;
			}
			this.refresh();
		},

		_updateIcon: function _updateIcon(checked) {
			var toAdd = "ui-icon ui-icon-background ";

			if (this.options.icon) {
				if (!this.icon) {
					this.icon = $("<span>");
					this.iconSpace = $("<span> </span>");
					this._addClass(this.iconSpace, "ui-checkboxradio-icon-space");
				}

				if (this.type === "checkbox") {
					toAdd += checked ? "ui-icon-check ui-state-checked" : "ui-icon-blank";
					this._removeClass(this.icon, null, checked ? "ui-icon-blank" : "ui-icon-check");
				} else {
					toAdd += "ui-icon-blank";
				}
				this._addClass(this.icon, "ui-checkboxradio-icon", toAdd);
				if (!checked) {
					this._removeClass(this.icon, null, "ui-icon-check ui-state-checked");
				}
				this.icon.prependTo(this.label).after(this.iconSpace);
			} else if (this.icon !== undefined) {
				this.icon.remove();
				this.iconSpace.remove();
				delete this.icon;
			}
		},

		_updateLabel: function _updateLabel() {

			// Remove the contents of the label ( minus the icon, icon space, and input )
			var contents = this.label.contents().not(this.element[0]);
			if (this.icon) {
				contents = contents.not(this.icon[0]);
			}
			if (this.iconSpace) {
				contents = contents.not(this.iconSpace[0]);
			}
			contents.remove();

			this.label.append(this.options.label);
		},

		refresh: function refresh() {
			var checked = this.element[0].checked,
			    isDisabled = this.element[0].disabled;

			this._updateIcon(checked);
			this._toggleClass(this.label, "ui-checkboxradio-checked", "ui-state-active", checked);
			if (this.options.label !== null) {
				this._updateLabel();
			}

			if (isDisabled !== this.options.disabled) {
				this._setOptions({ "disabled": isDisabled });
			}
		}

	}]);

	return $.ui.checkboxradio;
});

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Form Reset Mixin 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Form Reset Mixin
//>>group: Core
//>>description: Refresh input widgets when their form is reset
//>>docs: http://api.jqueryui.com/form-reset-mixin/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(26), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	return $.ui.formResetMixin = {
		_formResetHandler: function _formResetHandler() {
			var form = $(this);

			// Wait for the form reset to actually happen before refreshing
			setTimeout(function () {
				var instances = form.data("ui-form-reset-instances");
				$.each(instances, function () {
					this.refresh();
				});
			});
		},

		_bindFormResetHandler: function _bindFormResetHandler() {
			this.form = this.element.form();
			if (!this.form.length) {
				return;
			}

			var instances = this.form.data("ui-form-reset-instances") || [];
			if (!instances.length) {

				// We don't use _on() here because we use a single event handler per form
				this.form.on("reset.ui-form-reset", this._formResetHandler);
			}
			instances.push(this);
			this.form.data("ui-form-reset-instances", instances);
		},

		_unbindFormResetHandler: function _unbindFormResetHandler() {
			if (!this.form.length) {
				return;
			}

			var instances = this.form.data("ui-form-reset-instances");
			instances.splice($.inArray(this, instances), 1);
			if (instances.length) {
				this.form.data("ui-form-reset-instances", instances);
			} else {
				this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset");
			}
		}
	};
});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	// Support: IE8 Only
	// IE8 does not support the form attribute and when it is supplied. It overwrites the form prop
	// with a string, so we need to find the proper form.
	return $.fn.form = function () {
		return typeof this[0].form === "string" ? this.closest("form") : $(this[0].form);
	};
});

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Labels 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: labels
//>>group: Core
//>>description: Find all the labels associated with a given input
//>>docs: http://api.jqueryui.com/labels/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	return $.fn.labels = function () {
		var ancestor, selector, id, labels, ancestors;

		// Check control.labels first
		if (this[0].labels && this[0].labels.length) {
			return this.pushStack(this[0].labels);
		}

		// Support: IE <= 11, FF <= 37, Android <= 2.3 only
		// Above browsers do not support control.labels. Everything below is to support them
		// as well as document fragments. control.labels does not work on document fragments
		labels = this.eq(0).parents("label");

		// Look for the label based on the id
		id = this.attr("id");
		if (id) {

			// We don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.eq(0).parents().last();

			// Get a full set of top level ancestors
			ancestors = ancestor.add(ancestor.length ? ancestor.siblings() : this.siblings());

			// Create a selector for the label based on the id
			selector = "label[for='" + $.ui.escapeSelector(id) + "']";

			labels = labels.add(ancestors.find(selector).addBack(selector));
		}

		// Return whatever we have found for labels
		return this.pushStack(labels);
	};
});

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Draggable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Draggable
//>>group: Interactions
//>>description: Enables dragging functionality for any element.
//>>docs: http://api.jqueryui.com/draggable/
//>>demos: http://jqueryui.com/draggable/
//>>css.structure: ../../themes/base/draggable.css

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(8), __webpack_require__(30), __webpack_require__(11), __webpack_require__(13), __webpack_require__(12), __webpack_require__(31), __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	$.widget("ui.draggable", $.ui.mouse, {
		version: "1.12.1",
		widgetEventPrefix: "drag",
		options: {
			addClasses: true,
			appendTo: "parent",
			axis: false,
			connectToSortable: false,
			containment: false,
			cursor: "auto",
			cursorAt: false,
			grid: false,
			handle: false,
			helper: "original",
			iframeFix: false,
			opacity: false,
			refreshPositions: false,
			revert: false,
			revertDuration: 500,
			scope: "default",
			scroll: true,
			scrollSensitivity: 20,
			scrollSpeed: 20,
			snap: false,
			snapMode: "both",
			snapTolerance: 20,
			stack: false,
			zIndex: false,

			// Callbacks
			drag: null,
			start: null,
			stop: null
		},
		_create: function _create() {

			if (this.options.helper === "original") {
				this._setPositionRelative();
			}
			if (this.options.addClasses) {
				this._addClass("ui-draggable");
			}
			this._setHandleClassName();

			this._mouseInit();
		},

		_setOption: function _setOption(key, value) {
			this._super(key, value);
			if (key === "handle") {
				this._removeHandleClassName();
				this._setHandleClassName();
			}
		},

		_destroy: function _destroy() {
			if ((this.helper || this.element).is(".ui-draggable-dragging")) {
				this.destroyOnClear = true;
				return;
			}
			this._removeHandleClassName();
			this._mouseDestroy();
		},

		_mouseCapture: function _mouseCapture(event) {
			var o = this.options;

			// Among others, prevent a drag on a resizable-handle
			if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
				return false;
			}

			//Quit if we're not on a valid handle
			this.handle = this._getHandle(event);
			if (!this.handle) {
				return false;
			}

			this._blurActiveElement(event);

			this._blockFrames(o.iframeFix === true ? "iframe" : o.iframeFix);

			return true;
		},

		_blockFrames: function _blockFrames(selector) {
			this.iframeBlocks = this.document.find(selector).map(function () {
				var iframe = $(this);

				return $("<div>").css("position", "absolute").appendTo(iframe.parent()).outerWidth(iframe.outerWidth()).outerHeight(iframe.outerHeight()).offset(iframe.offset())[0];
			});
		},

		_unblockFrames: function _unblockFrames() {
			if (this.iframeBlocks) {
				this.iframeBlocks.remove();
				delete this.iframeBlocks;
			}
		},

		_blurActiveElement: function _blurActiveElement(event) {
			var activeElement = $.ui.safeActiveElement(this.document[0]),
			    target = $(event.target);

			// Don't blur if the event occurred on an element that is within
			// the currently focused element
			// See #10527, #12472
			if (target.closest(activeElement).length) {
				return;
			}

			// Blur any element that currently has focus, see #4261
			$.ui.safeBlur(activeElement);
		},

		_mouseStart: function _mouseStart(event) {

			var o = this.options;

			//Create and append the visible helper
			this.helper = this._createHelper(event);

			this._addClass(this.helper, "ui-draggable-dragging");

			//Cache the helper size
			this._cacheHelperProportions();

			//If ddmanager is used for droppables, set the global draggable
			if ($.ui.ddmanager) {
				$.ui.ddmanager.current = this;
			}

			/*
    * - Position generation -
    * This block generates everything position related - it's the core of draggables.
    */

			//Cache the margins of the original element
			this._cacheMargins();

			//Store the helper's css position
			this.cssPosition = this.helper.css("position");
			this.scrollParent = this.helper.scrollParent(true);
			this.offsetParent = this.helper.offsetParent();
			this.hasFixedAncestor = this.helper.parents().filter(function () {
				return $(this).css("position") === "fixed";
			}).length > 0;

			//The element's absolute position on the page minus margins
			this.positionAbs = this.element.offset();
			this._refreshOffsets(event);

			//Generate the original position
			this.originalPosition = this.position = this._generatePosition(event, false);
			this.originalPageX = event.pageX;
			this.originalPageY = event.pageY;

			//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
			o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt);

			//Set a containment if given in the options
			this._setContainment();

			//Trigger event + callbacks
			if (this._trigger("start", event) === false) {
				this._clear();
				return false;
			}

			//Recache the helper size
			this._cacheHelperProportions();

			//Prepare the droppable offsets
			if ($.ui.ddmanager && !o.dropBehaviour) {
				$.ui.ddmanager.prepareOffsets(this, event);
			}

			// Execute the drag once - this causes the helper not to be visible before getting its
			// correct position
			this._mouseDrag(event, true);

			// If the ddmanager is used for droppables, inform the manager that dragging has started
			// (see #5003)
			if ($.ui.ddmanager) {
				$.ui.ddmanager.dragStart(this, event);
			}

			return true;
		},

		_refreshOffsets: function _refreshOffsets(event) {
			this.offset = {
				top: this.positionAbs.top - this.margins.top,
				left: this.positionAbs.left - this.margins.left,
				scroll: false,
				parent: this._getParentOffset(),
				relative: this._getRelativeOffset()
			};

			this.offset.click = {
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			};
		},

		_mouseDrag: function _mouseDrag(event, noPropagation) {

			// reset any necessary cached properties (see #5009)
			if (this.hasFixedAncestor) {
				this.offset.parent = this._getParentOffset();
			}

			//Compute the helpers position
			this.position = this._generatePosition(event, true);
			this.positionAbs = this._convertPositionTo("absolute");

			//Call plugins and callbacks and use the resulting position if something is returned
			if (!noPropagation) {
				var ui = this._uiHash();
				if (this._trigger("drag", event, ui) === false) {
					this._mouseUp(new $.Event("mouseup", event));
					return false;
				}
				this.position = ui.position;
			}

			this.helper[0].style.left = this.position.left + "px";
			this.helper[0].style.top = this.position.top + "px";

			if ($.ui.ddmanager) {
				$.ui.ddmanager.drag(this, event);
			}

			return false;
		},

		_mouseStop: function _mouseStop(event) {

			//If we are using droppables, inform the manager about the drop
			var that = this,
			    dropped = false;
			if ($.ui.ddmanager && !this.options.dropBehaviour) {
				dropped = $.ui.ddmanager.drop(this, event);
			}

			//if a drop comes from outside (a sortable)
			if (this.dropped) {
				dropped = this.dropped;
				this.dropped = false;
			}

			if (this.options.revert === "invalid" && !dropped || this.options.revert === "valid" && dropped || this.options.revert === true || $.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped)) {
				$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
					if (that._trigger("stop", event) !== false) {
						that._clear();
					}
				});
			} else {
				if (this._trigger("stop", event) !== false) {
					this._clear();
				}
			}

			return false;
		},

		_mouseUp: function _mouseUp(event) {
			this._unblockFrames();

			// If the ddmanager is used for droppables, inform the manager that dragging has stopped
			// (see #5003)
			if ($.ui.ddmanager) {
				$.ui.ddmanager.dragStop(this, event);
			}

			// Only need to focus if the event occurred on the draggable itself, see #10527
			if (this.handleElement.is(event.target)) {

				// The interaction is over; whether or not the click resulted in a drag,
				// focus the element
				this.element.trigger("focus");
			}

			return $.ui.mouse.prototype._mouseUp.call(this, event);
		},

		cancel: function cancel() {

			if (this.helper.is(".ui-draggable-dragging")) {
				this._mouseUp(new $.Event("mouseup", { target: this.element[0] }));
			} else {
				this._clear();
			}

			return this;
		},

		_getHandle: function _getHandle(event) {
			return this.options.handle ? !!$(event.target).closest(this.element.find(this.options.handle)).length : true;
		},

		_setHandleClassName: function _setHandleClassName() {
			this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element;
			this._addClass(this.handleElement, "ui-draggable-handle");
		},

		_removeHandleClassName: function _removeHandleClassName() {
			this._removeClass(this.handleElement, "ui-draggable-handle");
		},

		_createHelper: function _createHelper(event) {

			var o = this.options,
			    helperIsFunction = $.isFunction(o.helper),
			    helper = helperIsFunction ? $(o.helper.apply(this.element[0], [event])) : o.helper === "clone" ? this.element.clone().removeAttr("id") : this.element;

			if (!helper.parents("body").length) {
				helper.appendTo(o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo);
			}

			// Http://bugs.jqueryui.com/ticket/9446
			// a helper function can return the original element
			// which wouldn't have been set to relative in _create
			if (helperIsFunction && helper[0] === this.element[0]) {
				this._setPositionRelative();
			}

			if (helper[0] !== this.element[0] && !/(fixed|absolute)/.test(helper.css("position"))) {
				helper.css("position", "absolute");
			}

			return helper;
		},

		_setPositionRelative: function _setPositionRelative() {
			if (!/^(?:r|a|f)/.test(this.element.css("position"))) {
				this.element[0].style.position = "relative";
			}
		},

		_adjustOffsetFromHelper: function _adjustOffsetFromHelper(obj) {
			if (typeof obj === "string") {
				obj = obj.split(" ");
			}
			if ($.isArray(obj)) {
				obj = { left: +obj[0], top: +obj[1] || 0 };
			}
			if ("left" in obj) {
				this.offset.click.left = obj.left + this.margins.left;
			}
			if ("right" in obj) {
				this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
			}
			if ("top" in obj) {
				this.offset.click.top = obj.top + this.margins.top;
			}
			if ("bottom" in obj) {
				this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
			}
		},

		_isRootNode: function _isRootNode(element) {
			return (/(html|body)/i.test(element.tagName) || element === this.document[0]
			);
		},

		_getParentOffset: function _getParentOffset() {

			//Get the offsetParent and cache its position
			var po = this.offsetParent.offset(),
			    document = this.document[0];

			// This is a special case where we need to modify a offset calculated on start, since the
			// following happened:
			// 1. The position of the helper is absolute, so it's position is calculated based on the
			// next positioned parent
			// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't
			// the document, which means that the scroll is included in the initial calculation of the
			// offset of the parent, and never recalculated upon drag
			if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
				po.left += this.scrollParent.scrollLeft();
				po.top += this.scrollParent.scrollTop();
			}

			if (this._isRootNode(this.offsetParent[0])) {
				po = { top: 0, left: 0 };
			}

			return {
				top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
				left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
			};
		},

		_getRelativeOffset: function _getRelativeOffset() {
			if (this.cssPosition !== "relative") {
				return { top: 0, left: 0 };
			}

			var p = this.element.position(),
			    scrollIsRootNode = this._isRootNode(this.scrollParent[0]);

			return {
				top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + (!scrollIsRootNode ? this.scrollParent.scrollTop() : 0),
				left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + (!scrollIsRootNode ? this.scrollParent.scrollLeft() : 0)
			};
		},

		_cacheMargins: function _cacheMargins() {
			this.margins = {
				left: parseInt(this.element.css("marginLeft"), 10) || 0,
				top: parseInt(this.element.css("marginTop"), 10) || 0,
				right: parseInt(this.element.css("marginRight"), 10) || 0,
				bottom: parseInt(this.element.css("marginBottom"), 10) || 0
			};
		},

		_cacheHelperProportions: function _cacheHelperProportions() {
			this.helperProportions = {
				width: this.helper.outerWidth(),
				height: this.helper.outerHeight()
			};
		},

		_setContainment: function _setContainment() {

			var isUserScrollable,
			    c,
			    ce,
			    o = this.options,
			    document = this.document[0];

			this.relativeContainer = null;

			if (!o.containment) {
				this.containment = null;
				return;
			}

			if (o.containment === "window") {
				this.containment = [$(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, $(window).scrollLeft() + $(window).width() - this.helperProportions.width - this.margins.left, $(window).scrollTop() + ($(window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
				return;
			}

			if (o.containment === "document") {
				this.containment = [0, 0, $(document).width() - this.helperProportions.width - this.margins.left, ($(document).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
				return;
			}

			if (o.containment.constructor === Array) {
				this.containment = o.containment;
				return;
			}

			if (o.containment === "parent") {
				o.containment = this.helper[0].parentNode;
			}

			c = $(o.containment);
			ce = c[0];

			if (!ce) {
				return;
			}

			isUserScrollable = /(scroll|auto)/.test(c.css("overflow"));

			this.containment = [(parseInt(c.css("borderLeftWidth"), 10) || 0) + (parseInt(c.css("paddingLeft"), 10) || 0), (parseInt(c.css("borderTopWidth"), 10) || 0) + (parseInt(c.css("paddingTop"), 10) || 0), (isUserScrollable ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt(c.css("borderRightWidth"), 10) || 0) - (parseInt(c.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (isUserScrollable ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt(c.css("borderBottomWidth"), 10) || 0) - (parseInt(c.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom];
			this.relativeContainer = c;
		},

		_convertPositionTo: function _convertPositionTo(d, pos) {

			if (!pos) {
				pos = this.position;
			}

			var mod = d === "absolute" ? 1 : -1,
			    scrollIsRootNode = this._isRootNode(this.scrollParent[0]);

			return {
				top:

				// The absolute mouse position
				pos.top +

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.top * mod +

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.top * mod - (this.cssPosition === "fixed" ? -this.offset.scroll.top : scrollIsRootNode ? 0 : this.offset.scroll.top) * mod,
				left:

				// The absolute mouse position
				pos.left +

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.left * mod +

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.left * mod - (this.cssPosition === "fixed" ? -this.offset.scroll.left : scrollIsRootNode ? 0 : this.offset.scroll.left) * mod
			};
		},

		_generatePosition: function _generatePosition(event, constrainPosition) {

			var containment,
			    co,
			    top,
			    left,
			    o = this.options,
			    scrollIsRootNode = this._isRootNode(this.scrollParent[0]),
			    pageX = event.pageX,
			    pageY = event.pageY;

			// Cache the scroll
			if (!scrollIsRootNode || !this.offset.scroll) {
				this.offset.scroll = {
					top: this.scrollParent.scrollTop(),
					left: this.scrollParent.scrollLeft()
				};
			}

			/*
    * - Position constraining -
    * Constrain the position to a mix of grid, containment.
    */

			// If we are not dragging yet, we won't check for options
			if (constrainPosition) {
				if (this.containment) {
					if (this.relativeContainer) {
						co = this.relativeContainer.offset();
						containment = [this.containment[0] + co.left, this.containment[1] + co.top, this.containment[2] + co.left, this.containment[3] + co.top];
					} else {
						containment = this.containment;
					}

					if (event.pageX - this.offset.click.left < containment[0]) {
						pageX = containment[0] + this.offset.click.left;
					}
					if (event.pageY - this.offset.click.top < containment[1]) {
						pageY = containment[1] + this.offset.click.top;
					}
					if (event.pageX - this.offset.click.left > containment[2]) {
						pageX = containment[2] + this.offset.click.left;
					}
					if (event.pageY - this.offset.click.top > containment[3]) {
						pageY = containment[3] + this.offset.click.top;
					}
				}

				if (o.grid) {

					//Check for grid elements set to 0 to prevent divide by 0 error causing invalid
					// argument errors in IE (see ticket #6950)
					top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
					pageY = containment ? top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3] ? top : top - this.offset.click.top >= containment[1] ? top - o.grid[1] : top + o.grid[1] : top;

					left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
					pageX = containment ? left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2] ? left : left - this.offset.click.left >= containment[0] ? left - o.grid[0] : left + o.grid[0] : left;
				}

				if (o.axis === "y") {
					pageX = this.originalPageX;
				}

				if (o.axis === "x") {
					pageY = this.originalPageY;
				}
			}

			return {
				top:

				// The absolute mouse position
				pageY -

				// Click offset (relative to the element)
				this.offset.click.top -

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.top -

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.top + (this.cssPosition === "fixed" ? -this.offset.scroll.top : scrollIsRootNode ? 0 : this.offset.scroll.top),
				left:

				// The absolute mouse position
				pageX -

				// Click offset (relative to the element)
				this.offset.click.left -

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.left -

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.left + (this.cssPosition === "fixed" ? -this.offset.scroll.left : scrollIsRootNode ? 0 : this.offset.scroll.left)
			};
		},

		_clear: function _clear() {
			this._removeClass(this.helper, "ui-draggable-dragging");
			if (this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
				this.helper.remove();
			}
			this.helper = null;
			this.cancelHelperRemoval = false;
			if (this.destroyOnClear) {
				this.destroy();
			}
		},

		// From now on bulk stuff - mainly helpers

		_trigger: function _trigger(type, event, ui) {
			ui = ui || this._uiHash();
			$.ui.plugin.call(this, type, [event, ui, this], true);

			// Absolute position and offset (see #6884 ) have to be recalculated after plugins
			if (/^(drag|start|stop)/.test(type)) {
				this.positionAbs = this._convertPositionTo("absolute");
				ui.offset = this.positionAbs;
			}
			return $.Widget.prototype._trigger.call(this, type, event, ui);
		},

		plugins: {},

		_uiHash: function _uiHash() {
			return {
				helper: this.helper,
				position: this.position,
				originalPosition: this.originalPosition,
				offset: this.positionAbs
			};
		}

	});

	$.ui.plugin.add("draggable", "connectToSortable", {
		start: function start(event, ui, draggable) {
			var uiSortable = $.extend({}, ui, {
				item: draggable.element
			});

			draggable.sortables = [];
			$(draggable.options.connectToSortable).each(function () {
				var sortable = $(this).sortable("instance");

				if (sortable && !sortable.options.disabled) {
					draggable.sortables.push(sortable);

					// RefreshPositions is called at drag start to refresh the containerCache
					// which is used in drag. This ensures it's initialized and synchronized
					// with any changes that might have happened on the page since initialization.
					sortable.refreshPositions();
					sortable._trigger("activate", event, uiSortable);
				}
			});
		},
		stop: function stop(event, ui, draggable) {
			var uiSortable = $.extend({}, ui, {
				item: draggable.element
			});

			draggable.cancelHelperRemoval = false;

			$.each(draggable.sortables, function () {
				var sortable = this;

				if (sortable.isOver) {
					sortable.isOver = 0;

					// Allow this sortable to handle removing the helper
					draggable.cancelHelperRemoval = true;
					sortable.cancelHelperRemoval = false;

					// Use _storedCSS To restore properties in the sortable,
					// as this also handles revert (#9675) since the draggable
					// may have modified them in unexpected ways (#8809)
					sortable._storedCSS = {
						position: sortable.placeholder.css("position"),
						top: sortable.placeholder.css("top"),
						left: sortable.placeholder.css("left")
					};

					sortable._mouseStop(event);

					// Once drag has ended, the sortable should return to using
					// its original helper, not the shared helper from draggable
					sortable.options.helper = sortable.options._helper;
				} else {

					// Prevent this Sortable from removing the helper.
					// However, don't set the draggable to remove the helper
					// either as another connected Sortable may yet handle the removal.
					sortable.cancelHelperRemoval = true;

					sortable._trigger("deactivate", event, uiSortable);
				}
			});
		},
		drag: function drag(event, ui, draggable) {
			$.each(draggable.sortables, function () {
				var innermostIntersecting = false,
				    sortable = this;

				// Copy over variables that sortable's _intersectsWith uses
				sortable.positionAbs = draggable.positionAbs;
				sortable.helperProportions = draggable.helperProportions;
				sortable.offset.click = draggable.offset.click;

				if (sortable._intersectsWith(sortable.containerCache)) {
					innermostIntersecting = true;

					$.each(draggable.sortables, function () {

						// Copy over variables that sortable's _intersectsWith uses
						this.positionAbs = draggable.positionAbs;
						this.helperProportions = draggable.helperProportions;
						this.offset.click = draggable.offset.click;

						if (this !== sortable && this._intersectsWith(this.containerCache) && $.contains(sortable.element[0], this.element[0])) {
							innermostIntersecting = false;
						}

						return innermostIntersecting;
					});
				}

				if (innermostIntersecting) {

					// If it intersects, we use a little isOver variable and set it once,
					// so that the move-in stuff gets fired only once.
					if (!sortable.isOver) {
						sortable.isOver = 1;

						// Store draggable's parent in case we need to reappend to it later.
						draggable._parent = ui.helper.parent();

						sortable.currentItem = ui.helper.appendTo(sortable.element).data("ui-sortable-item", true);

						// Store helper option to later restore it
						sortable.options._helper = sortable.options.helper;

						sortable.options.helper = function () {
							return ui.helper[0];
						};

						// Fire the start events of the sortable with our passed browser event,
						// and our own helper (so it doesn't create a new one)
						event.target = sortable.currentItem[0];
						sortable._mouseCapture(event, true);
						sortable._mouseStart(event, true, true);

						// Because the browser event is way off the new appended portlet,
						// modify necessary variables to reflect the changes
						sortable.offset.click.top = draggable.offset.click.top;
						sortable.offset.click.left = draggable.offset.click.left;
						sortable.offset.parent.left -= draggable.offset.parent.left - sortable.offset.parent.left;
						sortable.offset.parent.top -= draggable.offset.parent.top - sortable.offset.parent.top;

						draggable._trigger("toSortable", event);

						// Inform draggable that the helper is in a valid drop zone,
						// used solely in the revert option to handle "valid/invalid".
						draggable.dropped = sortable.element;

						// Need to refreshPositions of all sortables in the case that
						// adding to one sortable changes the location of the other sortables (#9675)
						$.each(draggable.sortables, function () {
							this.refreshPositions();
						});

						// Hack so receive/update callbacks work (mostly)
						draggable.currentItem = draggable.element;
						sortable.fromOutside = draggable;
					}

					if (sortable.currentItem) {
						sortable._mouseDrag(event);

						// Copy the sortable's position because the draggable's can potentially reflect
						// a relative position, while sortable is always absolute, which the dragged
						// element has now become. (#8809)
						ui.position = sortable.position;
					}
				} else {

					// If it doesn't intersect with the sortable, and it intersected before,
					// we fake the drag stop of the sortable, but make sure it doesn't remove
					// the helper by using cancelHelperRemoval.
					if (sortable.isOver) {

						sortable.isOver = 0;
						sortable.cancelHelperRemoval = true;

						// Calling sortable's mouseStop would trigger a revert,
						// so revert must be temporarily false until after mouseStop is called.
						sortable.options._revert = sortable.options.revert;
						sortable.options.revert = false;

						sortable._trigger("out", event, sortable._uiHash(sortable));
						sortable._mouseStop(event, true);

						// Restore sortable behaviors that were modfied
						// when the draggable entered the sortable area (#9481)
						sortable.options.revert = sortable.options._revert;
						sortable.options.helper = sortable.options._helper;

						if (sortable.placeholder) {
							sortable.placeholder.remove();
						}

						// Restore and recalculate the draggable's offset considering the sortable
						// may have modified them in unexpected ways. (#8809, #10669)
						ui.helper.appendTo(draggable._parent);
						draggable._refreshOffsets(event);
						ui.position = draggable._generatePosition(event, true);

						draggable._trigger("fromSortable", event);

						// Inform draggable that the helper is no longer in a valid drop zone
						draggable.dropped = false;

						// Need to refreshPositions of all sortables just in case removing
						// from one sortable changes the location of other sortables (#9675)
						$.each(draggable.sortables, function () {
							this.refreshPositions();
						});
					}
				}
			});
		}
	});

	$.ui.plugin.add("draggable", "cursor", {
		start: function start(event, ui, instance) {
			var t = $("body"),
			    o = instance.options;

			if (t.css("cursor")) {
				o._cursor = t.css("cursor");
			}
			t.css("cursor", o.cursor);
		},
		stop: function stop(event, ui, instance) {
			var o = instance.options;
			if (o._cursor) {
				$("body").css("cursor", o._cursor);
			}
		}
	});

	$.ui.plugin.add("draggable", "opacity", {
		start: function start(event, ui, instance) {
			var t = $(ui.helper),
			    o = instance.options;
			if (t.css("opacity")) {
				o._opacity = t.css("opacity");
			}
			t.css("opacity", o.opacity);
		},
		stop: function stop(event, ui, instance) {
			var o = instance.options;
			if (o._opacity) {
				$(ui.helper).css("opacity", o._opacity);
			}
		}
	});

	$.ui.plugin.add("draggable", "scroll", {
		start: function start(event, ui, i) {
			if (!i.scrollParentNotHidden) {
				i.scrollParentNotHidden = i.helper.scrollParent(false);
			}

			if (i.scrollParentNotHidden[0] !== i.document[0] && i.scrollParentNotHidden[0].tagName !== "HTML") {
				i.overflowOffset = i.scrollParentNotHidden.offset();
			}
		},
		drag: function drag(event, ui, i) {

			var o = i.options,
			    scrolled = false,
			    scrollParent = i.scrollParentNotHidden[0],
			    document = i.document[0];

			if (scrollParent !== document && scrollParent.tagName !== "HTML") {
				if (!o.axis || o.axis !== "x") {
					if (i.overflowOffset.top + scrollParent.offsetHeight - event.pageY < o.scrollSensitivity) {
						scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
					} else if (event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
						scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
					}
				}

				if (!o.axis || o.axis !== "y") {
					if (i.overflowOffset.left + scrollParent.offsetWidth - event.pageX < o.scrollSensitivity) {
						scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
					} else if (event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
						scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
					}
				}
			} else {

				if (!o.axis || o.axis !== "x") {
					if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
						scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
					} else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
						scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
					}
				}

				if (!o.axis || o.axis !== "y") {
					if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
						scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
					} else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
						scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
					}
				}
			}

			if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
				$.ui.ddmanager.prepareOffsets(i, event);
			}
		}
	});

	$.ui.plugin.add("draggable", "snap", {
		start: function start(event, ui, i) {

			var o = i.options;

			i.snapElements = [];

			$(o.snap.constructor !== String ? o.snap.items || ":data(ui-draggable)" : o.snap).each(function () {
				var $t = $(this),
				    $o = $t.offset();
				if (this !== i.element[0]) {
					i.snapElements.push({
						item: this,
						width: $t.outerWidth(), height: $t.outerHeight(),
						top: $o.top, left: $o.left
					});
				}
			});
		},
		drag: function drag(event, ui, inst) {

			var ts,
			    bs,
			    ls,
			    rs,
			    l,
			    r,
			    t,
			    b,
			    i,
			    first,
			    o = inst.options,
			    d = o.snapTolerance,
			    x1 = ui.offset.left,
			    x2 = x1 + inst.helperProportions.width,
			    y1 = ui.offset.top,
			    y2 = y1 + inst.helperProportions.height;

			for (i = inst.snapElements.length - 1; i >= 0; i--) {

				l = inst.snapElements[i].left - inst.margins.left;
				r = l + inst.snapElements[i].width;
				t = inst.snapElements[i].top - inst.margins.top;
				b = t + inst.snapElements[i].height;

				if (x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains(inst.snapElements[i].item.ownerDocument, inst.snapElements[i].item)) {
					if (inst.snapElements[i].snapping) {
						inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item }));
					}
					inst.snapElements[i].snapping = false;
					continue;
				}

				if (o.snapMode !== "inner") {
					ts = Math.abs(t - y2) <= d;
					bs = Math.abs(b - y1) <= d;
					ls = Math.abs(l - x2) <= d;
					rs = Math.abs(r - x1) <= d;
					if (ts) {
						ui.position.top = inst._convertPositionTo("relative", {
							top: t - inst.helperProportions.height,
							left: 0
						}).top;
					}
					if (bs) {
						ui.position.top = inst._convertPositionTo("relative", {
							top: b,
							left: 0
						}).top;
					}
					if (ls) {
						ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: l - inst.helperProportions.width
						}).left;
					}
					if (rs) {
						ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: r
						}).left;
					}
				}

				first = ts || bs || ls || rs;

				if (o.snapMode !== "outer") {
					ts = Math.abs(t - y1) <= d;
					bs = Math.abs(b - y2) <= d;
					ls = Math.abs(l - x1) <= d;
					rs = Math.abs(r - x2) <= d;
					if (ts) {
						ui.position.top = inst._convertPositionTo("relative", {
							top: t,
							left: 0
						}).top;
					}
					if (bs) {
						ui.position.top = inst._convertPositionTo("relative", {
							top: b - inst.helperProportions.height,
							left: 0
						}).top;
					}
					if (ls) {
						ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: l
						}).left;
					}
					if (rs) {
						ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: r - inst.helperProportions.width
						}).left;
					}
				}

				if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
					inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), {
						snapItem: inst.snapElements[i].item
					}));
				}
				inst.snapElements[i].snapping = ts || bs || ls || rs || first;
			}
		}
	});

	$.ui.plugin.add("draggable", "stack", {
		start: function start(event, ui, instance) {
			var min,
			    o = instance.options,
			    group = $.makeArray($(o.stack)).sort(function (a, b) {
				return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
			});

			if (!group.length) {
				return;
			}

			min = parseInt($(group[0]).css("zIndex"), 10) || 0;
			$(group).each(function (i) {
				$(this).css("zIndex", min + i);
			});
			this.css("zIndex", min + group.length);
		}
	});

	$.ui.plugin.add("draggable", "zIndex", {
		start: function start(event, ui, instance) {
			var t = $(ui.helper),
			    o = instance.options;

			if (t.css("zIndex")) {
				o._zIndex = t.css("zIndex");
			}
			t.css("zIndex", o.zIndex);
		},
		stop: function stop(event, ui, instance) {
			var o = instance.options;

			if (o._zIndex) {
				$(ui.helper).css("zIndex", o._zIndex);
			}
		}
	});

	return $.ui.draggable;
});

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	// This file is deprecated
	return $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI :data 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :data Selector
//>>group: Core
//>>description: Selects elements which have data stored under the specified key.
//>>docs: http://api.jqueryui.com/data-selector/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {
	return $.extend($.expr[":"], {
		data: $.expr.createPseudo ? $.expr.createPseudo(function (dataName) {
			return function (elem) {
				return !!$.data(elem, dataName);
			};
		}) :

		// Support: jQuery <1.8
		function (elem, i, match) {
			return !!$.data(elem, match[3]);
		}
	});
});

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Scroll Parent 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: scrollParent
//>>group: Core
//>>description: Get the closest ancestor element that is scrollable.
//>>docs: http://api.jqueryui.com/scrollParent/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	return $.fn.scrollParent = function (includeHidden) {
		var position = this.css("position"),
		    excludeStaticParent = position === "absolute",
		    overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
		    scrollParent = this.parents().filter(function () {
			var parent = $(this);
			if (excludeStaticParent && parent.css("position") === "static") {
				return false;
			}
			return overflowRegex.test(parent.css("overflow") + parent.css("overflow-y") + parent.css("overflow-x"));
		}).eq(0);

		return position === "fixed" || !scrollParent.length ? $(this[0].ownerDocument || document) : scrollParent;
	};
});

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Resizable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Resizable
//>>group: Interactions
//>>description: Enables resize functionality for any element.
//>>docs: http://api.jqueryui.com/resizable/
//>>demos: http://jqueryui.com/resizable/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/resizable.css
//>>css.theme: ../../themes/base/theme.css

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(8), __webpack_require__(33), __webpack_require__(11), __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	$.widget("ui.resizable", $.ui.mouse, {
		version: "1.12.1",
		widgetEventPrefix: "resize",
		options: {
			alsoResize: false,
			animate: false,
			animateDuration: "slow",
			animateEasing: "swing",
			aspectRatio: false,
			autoHide: false,
			classes: {
				"ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
			},
			containment: false,
			ghost: false,
			grid: false,
			handles: "e,s,se",
			helper: false,
			maxHeight: null,
			maxWidth: null,
			minHeight: 10,
			minWidth: 10,

			// See #7960
			zIndex: 90,

			// Callbacks
			resize: null,
			start: null,
			stop: null
		},

		_num: function _num(value) {
			return parseFloat(value) || 0;
		},

		_isNumber: function _isNumber(value) {
			return !isNaN(parseFloat(value));
		},

		_hasScroll: function _hasScroll(el, a) {

			if ($(el).css("overflow") === "hidden") {
				return false;
			}

			var scroll = a && a === "left" ? "scrollLeft" : "scrollTop",
			    has = false;

			if (el[scroll] > 0) {
				return true;
			}

			// TODO: determine which cases actually cause this to happen
			// if the element doesn't have the scroll set, see if it's possible to
			// set the scroll
			el[scroll] = 1;
			has = el[scroll] > 0;
			el[scroll] = 0;
			return has;
		},

		_create: function _create() {

			var margins,
			    o = this.options,
			    that = this;
			this._addClass("ui-resizable");

			$.extend(this, {
				_aspectRatio: !!o.aspectRatio,
				aspectRatio: o.aspectRatio,
				originalElement: this.element,
				_proportionallyResizeElements: [],
				_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
			});

			// Wrap the element if it cannot hold child nodes
			if (this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)) {

				this.element.wrap($("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
					position: this.element.css("position"),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css("top"),
					left: this.element.css("left")
				}));

				this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance"));

				this.elementIsWrapper = true;

				margins = {
					marginTop: this.originalElement.css("marginTop"),
					marginRight: this.originalElement.css("marginRight"),
					marginBottom: this.originalElement.css("marginBottom"),
					marginLeft: this.originalElement.css("marginLeft")
				};

				this.element.css(margins);
				this.originalElement.css("margin", 0);

				// support: Safari
				// Prevent Safari textarea resize
				this.originalResizeStyle = this.originalElement.css("resize");
				this.originalElement.css("resize", "none");

				this._proportionallyResizeElements.push(this.originalElement.css({
					position: "static",
					zoom: 1,
					display: "block"
				}));

				// Support: IE9
				// avoid IE jump (hard set the margin)
				this.originalElement.css(margins);

				this._proportionallyResize();
			}

			this._setupHandles();

			if (o.autoHide) {
				$(this.element).on("mouseenter", function () {
					if (o.disabled) {
						return;
					}
					that._removeClass("ui-resizable-autohide");
					that._handles.show();
				}).on("mouseleave", function () {
					if (o.disabled) {
						return;
					}
					if (!that.resizing) {
						that._addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
			}

			this._mouseInit();
		},

		_destroy: function _destroy() {

			this._mouseDestroy();

			var wrapper,
			    _destroy = function _destroy(exp) {
				$(exp).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove();
			};

			// TODO: Unwrap at same DOM position
			if (this.elementIsWrapper) {
				_destroy(this.element);
				wrapper = this.element;
				this.originalElement.css({
					position: wrapper.css("position"),
					width: wrapper.outerWidth(),
					height: wrapper.outerHeight(),
					top: wrapper.css("top"),
					left: wrapper.css("left")
				}).insertAfter(wrapper);
				wrapper.remove();
			}

			this.originalElement.css("resize", this.originalResizeStyle);
			_destroy(this.originalElement);

			return this;
		},

		_setOption: function _setOption(key, value) {
			this._super(key, value);

			switch (key) {
				case "handles":
					this._removeHandles();
					this._setupHandles();
					break;
				default:
					break;
			}
		},

		_setupHandles: function _setupHandles() {
			var o = this.options,
			    handle,
			    i,
			    n,
			    hname,
			    axis,
			    that = this;
			this.handles = o.handles || (!$(".ui-resizable-handle", this.element).length ? "e,s,se" : {
				n: ".ui-resizable-n",
				e: ".ui-resizable-e",
				s: ".ui-resizable-s",
				w: ".ui-resizable-w",
				se: ".ui-resizable-se",
				sw: ".ui-resizable-sw",
				ne: ".ui-resizable-ne",
				nw: ".ui-resizable-nw"
			});

			this._handles = $();
			if (this.handles.constructor === String) {

				if (this.handles === "all") {
					this.handles = "n,e,s,w,se,sw,ne,nw";
				}

				n = this.handles.split(",");
				this.handles = {};

				for (i = 0; i < n.length; i++) {

					handle = $.trim(n[i]);
					hname = "ui-resizable-" + handle;
					axis = $("<div>");
					this._addClass(axis, "ui-resizable-handle " + hname);

					axis.css({ zIndex: o.zIndex });

					this.handles[handle] = ".ui-resizable-" + handle;
					this.element.append(axis);
				}
			}

			this._renderAxis = function (target) {

				var i, axis, padPos, padWrapper;

				target = target || this.element;

				for (i in this.handles) {

					if (this.handles[i].constructor === String) {
						this.handles[i] = this.element.children(this.handles[i]).first().show();
					} else if (this.handles[i].jquery || this.handles[i].nodeType) {
						this.handles[i] = $(this.handles[i]);
						this._on(this.handles[i], { "mousedown": that._mouseDown });
					}

					if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)) {
						axis = $(this.handles[i], this.element);

						padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

						padPos = ["padding", /ne|nw|n/.test(i) ? "Top" : /se|sw|s/.test(i) ? "Bottom" : /^e$/.test(i) ? "Right" : "Left"].join("");

						target.css(padPos, padWrapper);

						this._proportionallyResize();
					}

					this._handles = this._handles.add(this.handles[i]);
				}
			};

			// TODO: make renderAxis a prototype function
			this._renderAxis(this.element);

			this._handles = this._handles.add(this.element.find(".ui-resizable-handle"));
			this._handles.disableSelection();

			this._handles.on("mouseover", function () {
				if (!that.resizing) {
					if (this.className) {
						axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
					}
					that.axis = axis && axis[1] ? axis[1] : "se";
				}
			});

			if (o.autoHide) {
				this._handles.hide();
				this._addClass("ui-resizable-autohide");
			}
		},

		_removeHandles: function _removeHandles() {
			this._handles.remove();
		},

		_mouseCapture: function _mouseCapture(event) {
			var i,
			    handle,
			    capture = false;

			for (i in this.handles) {
				handle = $(this.handles[i])[0];
				if (handle === event.target || $.contains(handle, event.target)) {
					capture = true;
				}
			}

			return !this.options.disabled && capture;
		},

		_mouseStart: function _mouseStart(event) {

			var curleft,
			    curtop,
			    cursor,
			    o = this.options,
			    el = this.element;

			this.resizing = true;

			this._renderProxy();

			curleft = this._num(this.helper.css("left"));
			curtop = this._num(this.helper.css("top"));

			if (o.containment) {
				curleft += $(o.containment).scrollLeft() || 0;
				curtop += $(o.containment).scrollTop() || 0;
			}

			this.offset = this.helper.offset();
			this.position = { left: curleft, top: curtop };

			this.size = this._helper ? {
				width: this.helper.width(),
				height: this.helper.height()
			} : {
				width: el.width(),
				height: el.height()
			};

			this.originalSize = this._helper ? {
				width: el.outerWidth(),
				height: el.outerHeight()
			} : {
				width: el.width(),
				height: el.height()
			};

			this.sizeDiff = {
				width: el.outerWidth() - el.width(),
				height: el.outerHeight() - el.height()
			};

			this.originalPosition = { left: curleft, top: curtop };
			this.originalMousePosition = { left: event.pageX, top: event.pageY };

			this.aspectRatio = typeof o.aspectRatio === "number" ? o.aspectRatio : this.originalSize.width / this.originalSize.height || 1;

			cursor = $(".ui-resizable-" + this.axis).css("cursor");
			$("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

			this._addClass("ui-resizable-resizing");
			this._propagate("start", event);
			return true;
		},

		_mouseDrag: function _mouseDrag(event) {

			var data,
			    props,
			    smp = this.originalMousePosition,
			    a = this.axis,
			    dx = event.pageX - smp.left || 0,
			    dy = event.pageY - smp.top || 0,
			    trigger = this._change[a];

			this._updatePrevProperties();

			if (!trigger) {
				return false;
			}

			data = trigger.apply(this, [event, dx, dy]);

			this._updateVirtualBoundaries(event.shiftKey);
			if (this._aspectRatio || event.shiftKey) {
				data = this._updateRatio(data, event);
			}

			data = this._respectSize(data, event);

			this._updateCache(data);

			this._propagate("resize", event);

			props = this._applyChanges();

			if (!this._helper && this._proportionallyResizeElements.length) {
				this._proportionallyResize();
			}

			if (!$.isEmptyObject(props)) {
				this._updatePrevProperties();
				this._trigger("resize", event, this.ui());
				this._applyChanges();
			}

			return false;
		},

		_mouseStop: function _mouseStop(event) {

			this.resizing = false;
			var pr,
			    ista,
			    soffseth,
			    soffsetw,
			    s,
			    left,
			    top,
			    o = this.options,
			    that = this;

			if (this._helper) {

				pr = this._proportionallyResizeElements;
				ista = pr.length && /textarea/i.test(pr[0].nodeName);
				soffseth = ista && this._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height;
				soffsetw = ista ? 0 : that.sizeDiff.width;

				s = {
					width: that.helper.width() - soffsetw,
					height: that.helper.height() - soffseth
				};
				left = parseFloat(that.element.css("left")) + (that.position.left - that.originalPosition.left) || null;
				top = parseFloat(that.element.css("top")) + (that.position.top - that.originalPosition.top) || null;

				if (!o.animate) {
					this.element.css($.extend(s, { top: top, left: left }));
				}

				that.helper.height(that.size.height);
				that.helper.width(that.size.width);

				if (this._helper && !o.animate) {
					this._proportionallyResize();
				}
			}

			$("body").css("cursor", "auto");

			this._removeClass("ui-resizable-resizing");

			this._propagate("stop", event);

			if (this._helper) {
				this.helper.remove();
			}

			return false;
		},

		_updatePrevProperties: function _updatePrevProperties() {
			this.prevPosition = {
				top: this.position.top,
				left: this.position.left
			};
			this.prevSize = {
				width: this.size.width,
				height: this.size.height
			};
		},

		_applyChanges: function _applyChanges() {
			var props = {};

			if (this.position.top !== this.prevPosition.top) {
				props.top = this.position.top + "px";
			}
			if (this.position.left !== this.prevPosition.left) {
				props.left = this.position.left + "px";
			}
			if (this.size.width !== this.prevSize.width) {
				props.width = this.size.width + "px";
			}
			if (this.size.height !== this.prevSize.height) {
				props.height = this.size.height + "px";
			}

			this.helper.css(props);

			return props;
		},

		_updateVirtualBoundaries: function _updateVirtualBoundaries(forceAspectRatio) {
			var pMinWidth,
			    pMaxWidth,
			    pMinHeight,
			    pMaxHeight,
			    b,
			    o = this.options;

			b = {
				minWidth: this._isNumber(o.minWidth) ? o.minWidth : 0,
				maxWidth: this._isNumber(o.maxWidth) ? o.maxWidth : Infinity,
				minHeight: this._isNumber(o.minHeight) ? o.minHeight : 0,
				maxHeight: this._isNumber(o.maxHeight) ? o.maxHeight : Infinity
			};

			if (this._aspectRatio || forceAspectRatio) {
				pMinWidth = b.minHeight * this.aspectRatio;
				pMinHeight = b.minWidth / this.aspectRatio;
				pMaxWidth = b.maxHeight * this.aspectRatio;
				pMaxHeight = b.maxWidth / this.aspectRatio;

				if (pMinWidth > b.minWidth) {
					b.minWidth = pMinWidth;
				}
				if (pMinHeight > b.minHeight) {
					b.minHeight = pMinHeight;
				}
				if (pMaxWidth < b.maxWidth) {
					b.maxWidth = pMaxWidth;
				}
				if (pMaxHeight < b.maxHeight) {
					b.maxHeight = pMaxHeight;
				}
			}
			this._vBoundaries = b;
		},

		_updateCache: function _updateCache(data) {
			this.offset = this.helper.offset();
			if (this._isNumber(data.left)) {
				this.position.left = data.left;
			}
			if (this._isNumber(data.top)) {
				this.position.top = data.top;
			}
			if (this._isNumber(data.height)) {
				this.size.height = data.height;
			}
			if (this._isNumber(data.width)) {
				this.size.width = data.width;
			}
		},

		_updateRatio: function _updateRatio(data) {

			var cpos = this.position,
			    csize = this.size,
			    a = this.axis;

			if (this._isNumber(data.height)) {
				data.width = data.height * this.aspectRatio;
			} else if (this._isNumber(data.width)) {
				data.height = data.width / this.aspectRatio;
			}

			if (a === "sw") {
				data.left = cpos.left + (csize.width - data.width);
				data.top = null;
			}
			if (a === "nw") {
				data.top = cpos.top + (csize.height - data.height);
				data.left = cpos.left + (csize.width - data.width);
			}

			return data;
		},

		_respectSize: function _respectSize(data) {

			var o = this._vBoundaries,
			    a = this.axis,
			    ismaxw = this._isNumber(data.width) && o.maxWidth && o.maxWidth < data.width,
			    ismaxh = this._isNumber(data.height) && o.maxHeight && o.maxHeight < data.height,
			    isminw = this._isNumber(data.width) && o.minWidth && o.minWidth > data.width,
			    isminh = this._isNumber(data.height) && o.minHeight && o.minHeight > data.height,
			    dw = this.originalPosition.left + this.originalSize.width,
			    dh = this.originalPosition.top + this.originalSize.height,
			    cw = /sw|nw|w/.test(a),
			    ch = /nw|ne|n/.test(a);
			if (isminw) {
				data.width = o.minWidth;
			}
			if (isminh) {
				data.height = o.minHeight;
			}
			if (ismaxw) {
				data.width = o.maxWidth;
			}
			if (ismaxh) {
				data.height = o.maxHeight;
			}

			if (isminw && cw) {
				data.left = dw - o.minWidth;
			}
			if (ismaxw && cw) {
				data.left = dw - o.maxWidth;
			}
			if (isminh && ch) {
				data.top = dh - o.minHeight;
			}
			if (ismaxh && ch) {
				data.top = dh - o.maxHeight;
			}

			// Fixing jump error on top/left - bug #2330
			if (!data.width && !data.height && !data.left && data.top) {
				data.top = null;
			} else if (!data.width && !data.height && !data.top && data.left) {
				data.left = null;
			}

			return data;
		},

		_getPaddingPlusBorderDimensions: function _getPaddingPlusBorderDimensions(element) {
			var i = 0,
			    widths = [],
			    borders = [element.css("borderTopWidth"), element.css("borderRightWidth"), element.css("borderBottomWidth"), element.css("borderLeftWidth")],
			    paddings = [element.css("paddingTop"), element.css("paddingRight"), element.css("paddingBottom"), element.css("paddingLeft")];

			for (; i < 4; i++) {
				widths[i] = parseFloat(borders[i]) || 0;
				widths[i] += parseFloat(paddings[i]) || 0;
			}

			return {
				height: widths[0] + widths[2],
				width: widths[1] + widths[3]
			};
		},

		_proportionallyResize: function _proportionallyResize() {

			if (!this._proportionallyResizeElements.length) {
				return;
			}

			var prel,
			    i = 0,
			    element = this.helper || this.element;

			for (; i < this._proportionallyResizeElements.length; i++) {

				prel = this._proportionallyResizeElements[i];

				// TODO: Seems like a bug to cache this.outerDimensions
				// considering that we are in a loop.
				if (!this.outerDimensions) {
					this.outerDimensions = this._getPaddingPlusBorderDimensions(prel);
				}

				prel.css({
					height: element.height() - this.outerDimensions.height || 0,
					width: element.width() - this.outerDimensions.width || 0
				});
			}
		},

		_renderProxy: function _renderProxy() {

			var el = this.element,
			    o = this.options;
			this.elementOffset = el.offset();

			if (this._helper) {

				this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

				this._addClass(this.helper, this._helper);
				this.helper.css({
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					position: "absolute",
					left: this.elementOffset.left + "px",
					top: this.elementOffset.top + "px",
					zIndex: ++o.zIndex //TODO: Don't modify option
				});

				this.helper.appendTo("body").disableSelection();
			} else {
				this.helper = this.element;
			}
		},

		_change: {
			e: function e(event, dx) {
				return { width: this.originalSize.width + dx };
			},
			w: function w(event, dx) {
				var cs = this.originalSize,
				    sp = this.originalPosition;
				return { left: sp.left + dx, width: cs.width - dx };
			},
			n: function n(event, dx, dy) {
				var cs = this.originalSize,
				    sp = this.originalPosition;
				return { top: sp.top + dy, height: cs.height - dy };
			},
			s: function s(event, dx, dy) {
				return { height: this.originalSize.height + dy };
			},
			se: function se(event, dx, dy) {
				return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
			},
			sw: function sw(event, dx, dy) {
				return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
			},
			ne: function ne(event, dx, dy) {
				return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
			},
			nw: function nw(event, dx, dy) {
				return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
			}
		},

		_propagate: function _propagate(n, event) {
			$.ui.plugin.call(this, n, [event, this.ui()]);
			n !== "resize" && this._trigger(n, event, this.ui());
		},

		plugins: {},

		ui: function ui() {
			return {
				originalElement: this.originalElement,
				element: this.element,
				helper: this.helper,
				position: this.position,
				size: this.size,
				originalSize: this.originalSize,
				originalPosition: this.originalPosition
			};
		}

	});

	/*
  * Resizable Extensions
  */

	$.ui.plugin.add("resizable", "animate", {

		stop: function stop(event) {
			var that = $(this).resizable("instance"),
			    o = that.options,
			    pr = that._proportionallyResizeElements,
			    ista = pr.length && /textarea/i.test(pr[0].nodeName),
			    soffseth = ista && that._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height,
			    soffsetw = ista ? 0 : that.sizeDiff.width,
			    style = {
				width: that.size.width - soffsetw,
				height: that.size.height - soffseth
			},
			    left = parseFloat(that.element.css("left")) + (that.position.left - that.originalPosition.left) || null,
			    top = parseFloat(that.element.css("top")) + (that.position.top - that.originalPosition.top) || null;

			that.element.animate($.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function step() {

					var data = {
						width: parseFloat(that.element.css("width")),
						height: parseFloat(that.element.css("height")),
						top: parseFloat(that.element.css("top")),
						left: parseFloat(that.element.css("left"))
					};

					if (pr && pr.length) {
						$(pr[0]).css({ width: data.width, height: data.height });
					}

					// Propagating resize, and updating values for each animation step
					that._updateCache(data);
					that._propagate("resize", event);
				}
			});
		}

	});

	$.ui.plugin.add("resizable", "containment", {

		start: function start() {
			var element,
			    p,
			    co,
			    ch,
			    cw,
			    width,
			    height,
			    that = $(this).resizable("instance"),
			    o = that.options,
			    el = that.element,
			    oc = o.containment,
			    ce = oc instanceof $ ? oc.get(0) : /parent/.test(oc) ? el.parent().get(0) : oc;

			if (!ce) {
				return;
			}

			that.containerElement = $(ce);

			if (/document/.test(oc) || oc === document) {
				that.containerOffset = {
					left: 0,
					top: 0
				};
				that.containerPosition = {
					left: 0,
					top: 0
				};

				that.parentData = {
					element: $(document),
					left: 0,
					top: 0,
					width: $(document).width(),
					height: $(document).height() || document.body.parentNode.scrollHeight
				};
			} else {
				element = $(ce);
				p = [];
				$(["Top", "Right", "Left", "Bottom"]).each(function (i, name) {
					p[i] = that._num(element.css("padding" + name));
				});

				that.containerOffset = element.offset();
				that.containerPosition = element.position();
				that.containerSize = {
					height: element.innerHeight() - p[3],
					width: element.innerWidth() - p[1]
				};

				co = that.containerOffset;
				ch = that.containerSize.height;
				cw = that.containerSize.width;
				width = that._hasScroll(ce, "left") ? ce.scrollWidth : cw;
				height = that._hasScroll(ce) ? ce.scrollHeight : ch;

				that.parentData = {
					element: ce,
					left: co.left,
					top: co.top,
					width: width,
					height: height
				};
			}
		},

		resize: function resize(event) {
			var woset,
			    hoset,
			    isParent,
			    isOffsetRelative,
			    that = $(this).resizable("instance"),
			    o = that.options,
			    co = that.containerOffset,
			    cp = that.position,
			    pRatio = that._aspectRatio || event.shiftKey,
			    cop = {
				top: 0,
				left: 0
			},
			    ce = that.containerElement,
			    continueResize = true;

			if (ce[0] !== document && /static/.test(ce.css("position"))) {
				cop = co;
			}

			if (cp.left < (that._helper ? co.left : 0)) {
				that.size.width = that.size.width + (that._helper ? that.position.left - co.left : that.position.left - cop.left);

				if (pRatio) {
					that.size.height = that.size.width / that.aspectRatio;
					continueResize = false;
				}
				that.position.left = o.helper ? co.left : 0;
			}

			if (cp.top < (that._helper ? co.top : 0)) {
				that.size.height = that.size.height + (that._helper ? that.position.top - co.top : that.position.top);

				if (pRatio) {
					that.size.width = that.size.height * that.aspectRatio;
					continueResize = false;
				}
				that.position.top = that._helper ? co.top : 0;
			}

			isParent = that.containerElement.get(0) === that.element.parent().get(0);
			isOffsetRelative = /relative|absolute/.test(that.containerElement.css("position"));

			if (isParent && isOffsetRelative) {
				that.offset.left = that.parentData.left + that.position.left;
				that.offset.top = that.parentData.top + that.position.top;
			} else {
				that.offset.left = that.element.offset().left;
				that.offset.top = that.element.offset().top;
			}

			woset = Math.abs(that.sizeDiff.width + (that._helper ? that.offset.left - cop.left : that.offset.left - co.left));

			hoset = Math.abs(that.sizeDiff.height + (that._helper ? that.offset.top - cop.top : that.offset.top - co.top));

			if (woset + that.size.width >= that.parentData.width) {
				that.size.width = that.parentData.width - woset;
				if (pRatio) {
					that.size.height = that.size.width / that.aspectRatio;
					continueResize = false;
				}
			}

			if (hoset + that.size.height >= that.parentData.height) {
				that.size.height = that.parentData.height - hoset;
				if (pRatio) {
					that.size.width = that.size.height * that.aspectRatio;
					continueResize = false;
				}
			}

			if (!continueResize) {
				that.position.left = that.prevPosition.left;
				that.position.top = that.prevPosition.top;
				that.size.width = that.prevSize.width;
				that.size.height = that.prevSize.height;
			}
		},

		stop: function stop() {
			var that = $(this).resizable("instance"),
			    o = that.options,
			    co = that.containerOffset,
			    cop = that.containerPosition,
			    ce = that.containerElement,
			    helper = $(that.helper),
			    ho = helper.offset(),
			    w = helper.outerWidth() - that.sizeDiff.width,
			    h = helper.outerHeight() - that.sizeDiff.height;

			if (that._helper && !o.animate && /relative/.test(ce.css("position"))) {
				$(this).css({
					left: ho.left - cop.left - co.left,
					width: w,
					height: h
				});
			}

			if (that._helper && !o.animate && /static/.test(ce.css("position"))) {
				$(this).css({
					left: ho.left - cop.left - co.left,
					width: w,
					height: h
				});
			}
		}
	});

	$.ui.plugin.add("resizable", "alsoResize", {

		start: function start() {
			var that = $(this).resizable("instance"),
			    o = that.options;

			$(o.alsoResize).each(function () {
				var el = $(this);
				el.data("ui-resizable-alsoresize", {
					width: parseFloat(el.width()), height: parseFloat(el.height()),
					left: parseFloat(el.css("left")), top: parseFloat(el.css("top"))
				});
			});
		},

		resize: function resize(event, ui) {
			var that = $(this).resizable("instance"),
			    o = that.options,
			    os = that.originalSize,
			    op = that.originalPosition,
			    delta = {
				height: that.size.height - os.height || 0,
				width: that.size.width - os.width || 0,
				top: that.position.top - op.top || 0,
				left: that.position.left - op.left || 0
			};

			$(o.alsoResize).each(function () {
				var el = $(this),
				    start = $(this).data("ui-resizable-alsoresize"),
				    style = {},
				    css = el.parents(ui.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];

				$.each(css, function (i, prop) {
					var sum = (start[prop] || 0) + (delta[prop] || 0);
					if (sum && sum >= 0) {
						style[prop] = sum || null;
					}
				});

				el.css(style);
			});
		},

		stop: function stop() {
			$(this).removeData("ui-resizable-alsoresize");
		}
	});

	$.ui.plugin.add("resizable", "ghost", {

		start: function start() {

			var that = $(this).resizable("instance"),
			    cs = that.size;

			that.ghost = that.originalElement.clone();
			that.ghost.css({
				opacity: 0.25,
				display: "block",
				position: "relative",
				height: cs.height,
				width: cs.width,
				margin: 0,
				left: 0,
				top: 0
			});

			that._addClass(that.ghost, "ui-resizable-ghost");

			// DEPRECATED
			// TODO: remove after 1.12
			if ($.uiBackCompat !== false && typeof that.options.ghost === "string") {

				// Ghost option
				that.ghost.addClass(this.options.ghost);
			}

			that.ghost.appendTo(that.helper);
		},

		resize: function resize() {
			var that = $(this).resizable("instance");
			if (that.ghost) {
				that.ghost.css({
					position: "relative",
					height: that.size.height,
					width: that.size.width
				});
			}
		},

		stop: function stop() {
			var that = $(this).resizable("instance");
			if (that.ghost && that.helper) {
				that.helper.get(0).removeChild(that.ghost.get(0));
			}
		}

	});

	$.ui.plugin.add("resizable", "grid", {

		resize: function resize() {
			var outerDimensions,
			    that = $(this).resizable("instance"),
			    o = that.options,
			    cs = that.size,
			    os = that.originalSize,
			    op = that.originalPosition,
			    a = that.axis,
			    grid = typeof o.grid === "number" ? [o.grid, o.grid] : o.grid,
			    gridX = grid[0] || 1,
			    gridY = grid[1] || 1,
			    ox = Math.round((cs.width - os.width) / gridX) * gridX,
			    oy = Math.round((cs.height - os.height) / gridY) * gridY,
			    newWidth = os.width + ox,
			    newHeight = os.height + oy,
			    isMaxWidth = o.maxWidth && o.maxWidth < newWidth,
			    isMaxHeight = o.maxHeight && o.maxHeight < newHeight,
			    isMinWidth = o.minWidth && o.minWidth > newWidth,
			    isMinHeight = o.minHeight && o.minHeight > newHeight;

			o.grid = grid;

			if (isMinWidth) {
				newWidth += gridX;
			}
			if (isMinHeight) {
				newHeight += gridY;
			}
			if (isMaxWidth) {
				newWidth -= gridX;
			}
			if (isMaxHeight) {
				newHeight -= gridY;
			}

			if (/^(se|s|e)$/.test(a)) {
				that.size.width = newWidth;
				that.size.height = newHeight;
			} else if (/^(ne)$/.test(a)) {
				that.size.width = newWidth;
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} else if (/^(sw)$/.test(a)) {
				that.size.width = newWidth;
				that.size.height = newHeight;
				that.position.left = op.left - ox;
			} else {
				if (newHeight - gridY <= 0 || newWidth - gridX <= 0) {
					outerDimensions = that._getPaddingPlusBorderDimensions(this);
				}

				if (newHeight - gridY > 0) {
					that.size.height = newHeight;
					that.position.top = op.top - oy;
				} else {
					newHeight = gridY - outerDimensions.height;
					that.size.height = newHeight;
					that.position.top = op.top + os.height - newHeight;
				}
				if (newWidth - gridX > 0) {
					that.size.width = newWidth;
					that.position.left = op.left - ox;
				} else {
					newWidth = gridX - outerDimensions.width;
					that.size.width = newWidth;
					that.position.left = op.left + os.width - newWidth;
				}
			}
		}

	});

	return $.ui.resizable;
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Disable Selection 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: disableSelection
//>>group: Core
//>>description: Disable selection of text content within the set of matched elements.
//>>docs: http://api.jqueryui.com/disableSelection/

// This file is deprecated
(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	return $.fn.extend({
		disableSelection: function () {
			var eventType = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";

			return function () {
				return this.on(eventType + ".ui-disableSelection", function (event) {
					event.preventDefault();
				});
			};
		}(),

		enableSelection: function enableSelection() {
			return this.off(".ui-disableSelection");
		}
	});
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Position 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

//>>label: Position
//>>group: Core
//>>description: Positions elements relative to other elements.
//>>docs: http://api.jqueryui.com/position/
//>>demos: http://jqueryui.com/position/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {
	(function () {
		var cachedScrollbarWidth,
		    max = Math.max,
		    abs = Math.abs,
		    rhorizontal = /left|center|right/,
		    rvertical = /top|center|bottom/,
		    roffset = /[\+\-]\d+(\.[\d]+)?%?/,
		    rposition = /^\w+/,
		    rpercent = /%$/,
		    _position = $.fn.position;

		function getOffsets(offsets, width, height) {
			return [parseFloat(offsets[0]) * (rpercent.test(offsets[0]) ? width / 100 : 1), parseFloat(offsets[1]) * (rpercent.test(offsets[1]) ? height / 100 : 1)];
		}

		function parseCss(element, property) {
			return parseInt($.css(element, property), 10) || 0;
		}

		function getDimensions(elem) {
			var raw = elem[0];
			if (raw.nodeType === 9) {
				return {
					width: elem.width(),
					height: elem.height(),
					offset: { top: 0, left: 0 }
				};
			}
			if ($.isWindow(raw)) {
				return {
					width: elem.width(),
					height: elem.height(),
					offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
				};
			}
			if (raw.preventDefault) {
				return {
					width: 0,
					height: 0,
					offset: { top: raw.pageY, left: raw.pageX }
				};
			}
			return {
				width: elem.outerWidth(),
				height: elem.outerHeight(),
				offset: elem.offset()
			};
		}

		$.position = {
			scrollbarWidth: function scrollbarWidth() {
				if (cachedScrollbarWidth !== undefined) {
					return cachedScrollbarWidth;
				}
				var w1,
				    w2,
				    div = $("<div " + "style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" + "<div style='height:100px;width:auto;'></div></div>"),
				    innerDiv = div.children()[0];

				$("body").append(div);
				w1 = innerDiv.offsetWidth;
				div.css("overflow", "scroll");

				w2 = innerDiv.offsetWidth;

				if (w1 === w2) {
					w2 = div[0].clientWidth;
				}

				div.remove();

				return cachedScrollbarWidth = w1 - w2;
			},
			getScrollInfo: function getScrollInfo(within) {
				var overflowX = within.isWindow || within.isDocument ? "" : within.element.css("overflow-x"),
				    overflowY = within.isWindow || within.isDocument ? "" : within.element.css("overflow-y"),
				    hasOverflowX = overflowX === "scroll" || overflowX === "auto" && within.width < within.element[0].scrollWidth,
				    hasOverflowY = overflowY === "scroll" || overflowY === "auto" && within.height < within.element[0].scrollHeight;
				return {
					width: hasOverflowY ? $.position.scrollbarWidth() : 0,
					height: hasOverflowX ? $.position.scrollbarWidth() : 0
				};
			},
			getWithinInfo: function getWithinInfo(element) {
				var withinElement = $(element || window),
				    isWindow = $.isWindow(withinElement[0]),
				    isDocument = !!withinElement[0] && withinElement[0].nodeType === 9,
				    hasOffset = !isWindow && !isDocument;
				return {
					element: withinElement,
					isWindow: isWindow,
					isDocument: isDocument,
					offset: hasOffset ? $(element).offset() : { left: 0, top: 0 },
					scrollLeft: withinElement.scrollLeft(),
					scrollTop: withinElement.scrollTop(),
					width: withinElement.outerWidth(),
					height: withinElement.outerHeight()
				};
			}
		};

		$.fn.position = function (options) {
			if (!options || !options.of) {
				return _position.apply(this, arguments);
			}

			// Make a copy, we don't want to modify arguments
			options = $.extend({}, options);

			var atOffset,
			    targetWidth,
			    targetHeight,
			    targetOffset,
			    basePosition,
			    dimensions,
			    target = $(options.of),
			    within = $.position.getWithinInfo(options.within),
			    scrollInfo = $.position.getScrollInfo(within),
			    collision = (options.collision || "flip").split(" "),
			    offsets = {};

			dimensions = getDimensions(target);
			if (target[0].preventDefault) {

				// Force left top to allow flipping
				options.at = "left top";
			}
			targetWidth = dimensions.width;
			targetHeight = dimensions.height;
			targetOffset = dimensions.offset;

			// Clone to reuse original targetOffset later
			basePosition = $.extend({}, targetOffset);

			// Force my and at to have valid horizontal and vertical positions
			// if a value is missing or invalid, it will be converted to center
			$.each(["my", "at"], function () {
				var pos = (options[this] || "").split(" "),
				    horizontalOffset,
				    verticalOffset;

				if (pos.length === 1) {
					pos = rhorizontal.test(pos[0]) ? pos.concat(["center"]) : rvertical.test(pos[0]) ? ["center"].concat(pos) : ["center", "center"];
				}
				pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
				pos[1] = rvertical.test(pos[1]) ? pos[1] : "center";

				// Calculate offsets
				horizontalOffset = roffset.exec(pos[0]);
				verticalOffset = roffset.exec(pos[1]);
				offsets[this] = [horizontalOffset ? horizontalOffset[0] : 0, verticalOffset ? verticalOffset[0] : 0];

				// Reduce to just the positions without the offsets
				options[this] = [rposition.exec(pos[0])[0], rposition.exec(pos[1])[0]];
			});

			// Normalize collision option
			if (collision.length === 1) {
				collision[1] = collision[0];
			}

			if (options.at[0] === "right") {
				basePosition.left += targetWidth;
			} else if (options.at[0] === "center") {
				basePosition.left += targetWidth / 2;
			}

			if (options.at[1] === "bottom") {
				basePosition.top += targetHeight;
			} else if (options.at[1] === "center") {
				basePosition.top += targetHeight / 2;
			}

			atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
			basePosition.left += atOffset[0];
			basePosition.top += atOffset[1];

			return this.each(function () {
				var collisionPosition,
				    using,
				    elem = $(this),
				    elemWidth = elem.outerWidth(),
				    elemHeight = elem.outerHeight(),
				    marginLeft = parseCss(this, "marginLeft"),
				    marginTop = parseCss(this, "marginTop"),
				    collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") + scrollInfo.width,
				    collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") + scrollInfo.height,
				    position = $.extend({}, basePosition),
				    myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());

				if (options.my[0] === "right") {
					position.left -= elemWidth;
				} else if (options.my[0] === "center") {
					position.left -= elemWidth / 2;
				}

				if (options.my[1] === "bottom") {
					position.top -= elemHeight;
				} else if (options.my[1] === "center") {
					position.top -= elemHeight / 2;
				}

				position.left += myOffset[0];
				position.top += myOffset[1];

				collisionPosition = {
					marginLeft: marginLeft,
					marginTop: marginTop
				};

				$.each(["left", "top"], function (i, dir) {
					if ($.ui.position[collision[i]]) {
						$.ui.position[collision[i]][dir](position, {
							targetWidth: targetWidth,
							targetHeight: targetHeight,
							elemWidth: elemWidth,
							elemHeight: elemHeight,
							collisionPosition: collisionPosition,
							collisionWidth: collisionWidth,
							collisionHeight: collisionHeight,
							offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
							my: options.my,
							at: options.at,
							within: within,
							elem: elem
						});
					}
				});

				if (options.using) {

					// Adds feedback as second argument to using callback, if present
					using = function using(props) {
						var left = targetOffset.left - position.left,
						    right = left + targetWidth - elemWidth,
						    top = targetOffset.top - position.top,
						    bottom = top + targetHeight - elemHeight,
						    feedback = {
							target: {
								element: target,
								left: targetOffset.left,
								top: targetOffset.top,
								width: targetWidth,
								height: targetHeight
							},
							element: {
								element: elem,
								left: position.left,
								top: position.top,
								width: elemWidth,
								height: elemHeight
							},
							horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
							vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
						};
						if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
							feedback.horizontal = "center";
						}
						if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
							feedback.vertical = "middle";
						}
						if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
							feedback.important = "horizontal";
						} else {
							feedback.important = "vertical";
						}
						options.using.call(this, props, feedback);
					};
				}

				elem.offset($.extend(position, { using: using }));
			});
		};

		$.ui.position = {
			fit: {
				left: function left(position, data) {
					var within = data.within,
					    withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
					    outerWidth = within.width,
					    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
					    overLeft = withinOffset - collisionPosLeft,
					    overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
					    newOverRight;

					// Element is wider than within
					if (data.collisionWidth > outerWidth) {

						// Element is initially over the left side of within
						if (overLeft > 0 && overRight <= 0) {
							newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
							position.left += overLeft - newOverRight;

							// Element is initially over right side of within
						} else if (overRight > 0 && overLeft <= 0) {
							position.left = withinOffset;

							// Element is initially over both left and right sides of within
						} else {
							if (overLeft > overRight) {
								position.left = withinOffset + outerWidth - data.collisionWidth;
							} else {
								position.left = withinOffset;
							}
						}

						// Too far left -> align with left edge
					} else if (overLeft > 0) {
						position.left += overLeft;

						// Too far right -> align with right edge
					} else if (overRight > 0) {
						position.left -= overRight;

						// Adjust based on position and margin
					} else {
						position.left = max(position.left - collisionPosLeft, position.left);
					}
				},
				top: function top(position, data) {
					var within = data.within,
					    withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
					    outerHeight = data.within.height,
					    collisionPosTop = position.top - data.collisionPosition.marginTop,
					    overTop = withinOffset - collisionPosTop,
					    overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
					    newOverBottom;

					// Element is taller than within
					if (data.collisionHeight > outerHeight) {

						// Element is initially over the top of within
						if (overTop > 0 && overBottom <= 0) {
							newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
							position.top += overTop - newOverBottom;

							// Element is initially over bottom of within
						} else if (overBottom > 0 && overTop <= 0) {
							position.top = withinOffset;

							// Element is initially over both top and bottom of within
						} else {
							if (overTop > overBottom) {
								position.top = withinOffset + outerHeight - data.collisionHeight;
							} else {
								position.top = withinOffset;
							}
						}

						// Too far up -> align with top
					} else if (overTop > 0) {
						position.top += overTop;

						// Too far down -> align with bottom edge
					} else if (overBottom > 0) {
						position.top -= overBottom;

						// Adjust based on position and margin
					} else {
						position.top = max(position.top - collisionPosTop, position.top);
					}
				}
			},
			flip: {
				left: function left(position, data) {
					var within = data.within,
					    withinOffset = within.offset.left + within.scrollLeft,
					    outerWidth = within.width,
					    offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
					    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
					    overLeft = collisionPosLeft - offsetLeft,
					    overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
					    myOffset = data.my[0] === "left" ? -data.elemWidth : data.my[0] === "right" ? data.elemWidth : 0,
					    atOffset = data.at[0] === "left" ? data.targetWidth : data.at[0] === "right" ? -data.targetWidth : 0,
					    offset = -2 * data.offset[0],
					    newOverRight,
					    newOverLeft;

					if (overLeft < 0) {
						newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
						if (newOverRight < 0 || newOverRight < abs(overLeft)) {
							position.left += myOffset + atOffset + offset;
						}
					} else if (overRight > 0) {
						newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
						if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
							position.left += myOffset + atOffset + offset;
						}
					}
				},
				top: function top(position, data) {
					var within = data.within,
					    withinOffset = within.offset.top + within.scrollTop,
					    outerHeight = within.height,
					    offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
					    collisionPosTop = position.top - data.collisionPosition.marginTop,
					    overTop = collisionPosTop - offsetTop,
					    overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
					    top = data.my[1] === "top",
					    myOffset = top ? -data.elemHeight : data.my[1] === "bottom" ? data.elemHeight : 0,
					    atOffset = data.at[1] === "top" ? data.targetHeight : data.at[1] === "bottom" ? -data.targetHeight : 0,
					    offset = -2 * data.offset[1],
					    newOverTop,
					    newOverBottom;
					if (overTop < 0) {
						newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
						if (newOverBottom < 0 || newOverBottom < abs(overTop)) {
							position.top += myOffset + atOffset + offset;
						}
					} else if (overBottom > 0) {
						newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
						if (newOverTop > 0 || abs(newOverTop) < overBottom) {
							position.top += myOffset + atOffset + offset;
						}
					}
				}
			},
			flipfit: {
				left: function left() {
					$.ui.position.flip.left.apply(this, arguments);
					$.ui.position.fit.left.apply(this, arguments);
				},
				top: function top() {
					$.ui.position.flip.top.apply(this, arguments);
					$.ui.position.fit.top.apply(this, arguments);
				}
			}
		};
	})();

	return $.ui.position;
});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Tabbable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :tabbable Selector
//>>group: Core
//>>description: Selects elements which can be tabbed to.
//>>docs: http://api.jqueryui.com/tabbable-selector/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(14)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	return $.extend($.expr[":"], {
		tabbable: function tabbable(element) {
			var tabIndex = $.attr(element, "tabindex"),
			    hasTabindex = tabIndex != null;
			return (!hasTabindex || tabIndex >= 0) && $.ui.focusable(element, hasTabindex);
		}
	});
});

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * jQuery UI Unique ID 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: uniqueId
//>>group: Core
//>>description: Functions to generate and remove uniqueId's
//>>docs: http://api.jqueryui.com/uniqueId/

(function (factory) {
	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory(jQuery);
	}
})(function ($) {

	return $.fn.extend({
		uniqueId: function () {
			var uuid = 0;

			return function () {
				return this.each(function () {
					if (!this.id) {
						this.id = "ui-id-" + ++uuid;
					}
				});
			};
		}(),

		removeUniqueId: function removeUniqueId() {
			return this.each(function () {
				if (/^ui-id-\d+$/.test(this.id)) {
					$(this).removeAttr("id");
				}
			});
		}
	});
});

/***/ })
/******/ ]);
//# sourceMappingURL=admin.js.map