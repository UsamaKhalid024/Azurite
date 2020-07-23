console.log('[FORM]source-engine-script-jquery.js');
/*JQUERY 3.2.1 LIB STARTS*/
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

    if (typeof module === "object" && typeof module.exports === "object") {

        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ?
			factory(global, true) :
			function (w) {
			    if (!w.document) {
			        throw new Error("jQuery requires a window with a document");
			    }
			    return factory(w);
			};
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

    // Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
    // throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
    // arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
    // enough that all such attempts are guarded in a try block.
    "use strict";

    var arr = [];

    var document = window.document;

    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

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



    var
        version = "3.2.1",

        // Define a local copy of jQuery
        jQuery = function (selector, context) {

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
        fcamelCase = function (all, letter) {
            return letter.toUpperCase();
        };

    jQuery.fn = jQuery.prototype = {

        // The current version of jQuery being used
        jquery: version,

        constructor: jQuery,

        // The default length of a jQuery object is 0
        length: 0,

        toArray: function () {
            return slice.call(this);
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function (num) {

            // Return all the elements in a clean array
            if (num == null) {
                return slice.call(this);
            }

            // Return just the one element from the set
            return num < 0 ? this[num + this.length] : this[num];
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function (elems) {

            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        each: function (callback) {
            return jQuery.each(this, callback);
        },

        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },

        slice: function () {
            return this.pushStack(slice.apply(this, arguments));
        },

        first: function () {
            return this.eq(0);
        },

        last: function () {
            return this.eq(-1);
        },

        eq: function (i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },

        end: function () {
            return this.prevObject || this.constructor();
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: push,
        sort: arr.sort,
        splice: arr.splice
    };

    jQuery.extend = jQuery.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
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
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
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
                    if (deep && copy && (jQuery.isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy)))) {

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

        error: function (msg) {
            throw new Error(msg);
        },

        noop: function () { },

        isFunction: function (obj) {
            return jQuery.type(obj) === "function";
        },

        isWindow: function (obj) {
            return obj != null && obj === obj.window;
        },

        isNumeric: function (obj) {

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

        isPlainObject: function (obj) {
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

        isEmptyObject: function (obj) {

            /* eslint-disable no-unused-vars */
            // See https://github.com/eslint/eslint/issues/6125
            var name;

            for (name in obj) {
                return false;
            }
            return true;
        },

        type: function (obj) {
            if (obj == null) {
                return obj + "";
            }

            // Support: Android <=2.3 only (functionish RegExp)
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;
        },

        // Evaluates a script in a global context
        globalEval: function (code) {
            DOMEval(code);
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Support: IE <=9 - 11, Edge 12 - 13
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function (string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },

        each: function (obj, callback) {
            var length, i = 0;

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
        trim: function (text) {
            return text == null ?
                "" :
                (text + "").replace(rtrim, "");
        },

        // results is for internal usage only
        makeArray: function (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArrayLike(Object(arr))) {
                    jQuery.merge(ret,
                        typeof arr === "string" ?
                        [arr] : arr
                    );
                } else {
                    push.call(ret, arr);
                }
            }

            return ret;
        },

        inArray: function (elem, arr, i) {
            return arr == null ? -1 : indexOf.call(arr, elem, i);
        },

        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function (first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },

        grep: function (elems, callback, invert) {
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
        map: function (elems, callback, arg) {
            var length, value,
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
        proxy: function (fn, context) {
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
            args = slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context || this, args.concat(slice.call(arguments)));
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
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
    function (i, name) {
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

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
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
    (function (window) {

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
            sortOrder = function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                }
                return 0;
            },

            // Instance methods
            hasOwn = ({}).hasOwnProperty,
            arr = [],
            pop = arr.pop,
            push_native = arr.push,
            push = arr.push,
            slice = arr.slice,
            // Use a stripped-down indexOf as it's faster than native
            // https://jsperf.com/thor-indexof-vs-for/5
            indexOf = function (list, elem) {
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
                "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
                "*\\]",

            pseudos = ":(" + identifier + ")(?:\\((" +
                // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
                // 1. quoted (capture 3; capture 4 or capture 5)
                "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                // 2. simple (capture 6)
                "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
                // 3. anything else (capture 2)
                ".*" +
                ")\\)|)",

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
                "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                    "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                    "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
                "bool": new RegExp("^(?:" + booleans + ")$", "i"),
                // For use in libraries implementing .is()
                // We use this for POS matching in `select`
                "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                    whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
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
            funescape = function (_, escaped, escapedWhitespace) {
                var high = "0x" + escaped - 0x10000;
                // NaN means non-codepoint
                // Support: Firefox<24
                // Workaround erroneous numeric interpretation of +"0x"
                return high !== high || escapedWhitespace ?
                    escaped :
                    high < 0 ?
                        // BMP codepoint
                        String.fromCharCode(high + 0x10000) :
                        // Supplemental Plane codepoint (surrogate pair)
                        String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
            },

            // CSS string/identifier serialization
            // https://drafts.csswg.org/cssom/#common-serializing-idioms
            rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            fcssescape = function (ch, asCodePoint) {
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
            unloadHandler = function () {
                setDocument();
            },

            disabledAncestor = addCombinator(
                function (elem) {
                    return elem.disabled === true && ("form" in elem || "label" in elem);
                },
                { dir: "parentNode", next: "legend" }
            );

        // Optimize for push.apply( _, NodeList )
        try {
            push.apply(
                (arr = slice.call(preferredDoc.childNodes)),
                preferredDoc.childNodes
            );
            // Support: Android<4.0
            // Detect silently failing push.apply
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length ?

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
                        while ((target[j++] = els[i++])) { }
                        target.length = j - 1;
                    }
            };
        }

        function Sizzle(selector, context, results, seed) {
            var m, i, elem, nid, match, groups, newSelector,
                newContext = context && context.ownerDocument,

                // nodeType defaults to 9, since context defaults to document
                nodeType = context ? context.nodeType : 9;

            results = results || [];

            // Return early from calls with invalid selector or context
            if (typeof selector !== "string" || !selector ||
                nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

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
                        if ((m = match[1])) {

                            // Document context
                            if (nodeType === 9) {
                                if ((elem = context.getElementById(m))) {

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
                                if (newContext && (elem = newContext.getElementById(m)) &&
                                    contains(context, elem) &&
                                    elem.id === m) {

                                    results.push(elem);
                                    return results;
                                }
                            }

                            // Type selector
                        } else if (match[2]) {
                            push.apply(results, context.getElementsByTagName(selector));
                            return results;

                            // Class selector
                        } else if ((m = match[3]) && support.getElementsByClassName &&
                            context.getElementsByClassName) {

                            push.apply(results, context.getElementsByClassName(m));
                            return results;
                        }
                    }

                    // Take advantage of querySelectorAll
                    if (support.qsa &&
                        !compilerCache[selector + " "] &&
                        (!rbuggyQSA || !rbuggyQSA.test(selector))) {

                        if (nodeType !== 1) {
                            newContext = context;
                            newSelector = selector;

                            // qSA looks outside Element context, which is not what we want
                            // Thanks to Andrew Dupont for this workaround technique
                            // Support: IE <=8
                            // Exclude object elements
                        } else if (context.nodeName.toLowerCase() !== "object") {

                            // Capture the context ID, setting it first if necessary
                            if ((nid = context.getAttribute("id"))) {
                                nid = nid.replace(rcssescape, fcssescape);
                            } else {
                                context.setAttribute("id", (nid = expando));
                            }

                            // Prefix every selector in the list
                            groups = tokenize(selector);
                            i = groups.length;
                            while (i--) {
                                groups[i] = "#" + nid + " " + toSelector(groups[i]);
                            }
                            newSelector = groups.join(",");

                            // Expand context for sibling selectors
                            newContext = rsibling.test(selector) && testContext(context.parentNode) ||
                                context;
                        }

                        if (newSelector) {
                            try {
                                push.apply(results,
                                    newContext.querySelectorAll(newSelector)
                                );
                                return results;
                            } catch (qsaError) {
                            } finally {
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
                return (cache[key + " "] = value);
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
                diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                    a.sourceIndex - b.sourceIndex;

            // Use IE sourceIndex if available on both nodes
            if (diff) {
                return diff;
            }

            // Check if b follows a
            if (cur) {
                while ((cur = cur.nextSibling)) {
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
                            elem.isDisabled !== !disabled &&
                                disabledAncestor(elem) === disabled;
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
                        if (seed[(j = matchIndexes[i])]) {
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
            var hasCompare, subWindow,
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
            if (preferredDoc !== document &&
                (subWindow = document.defaultView) && subWindow.top !== subWindow) {

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
                        var node = typeof elem.getAttributeNode !== "undefined" &&
                            elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };

                // Support: IE 6 - 7 only
                // getElementById is not reliable as a find shortcut
                Expr.find["ID"] = function (id, context) {
                    if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                        var node, i, elems,
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
                            while ((elem = elems[i++])) {
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
            Expr.find["TAG"] = support.getElementsByTagName ?
                function (tag, context) {
                    if (typeof context.getElementsByTagName !== "undefined") {
                        return context.getElementsByTagName(tag);

                        // DocumentFragment nodes don't have gEBTN
                    } else if (support.qsa) {
                        return context.querySelectorAll(tag);
                    }
                } :

                function (tag, context) {
                    var elem,
                        tmp = [],
                        i = 0,
                        // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                        results = context.getElementsByTagName(tag);

                    // Filter out possible comments
                    if (tag === "*") {
                        while ((elem = results[i++])) {
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

            if ((support.qsa = rnative.test(document.querySelectorAll))) {
                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function (el) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explicitly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // https://bugs.jquery.com/ticket/12359
                    docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" +
                        "<select id='" + expando + "-\r\\' msallowcapture=''>" +
                        "<option selected=''></option></select>";

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
                    el.innerHTML = "<a href='' disabled='disabled'></a>" +
                        "<select disabled='disabled'><option/></select>";

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

            if ((support.matchesSelector = rnative.test((matches = docElem.matches ||
                docElem.webkitMatchesSelector ||
                docElem.mozMatchesSelector ||
                docElem.oMatchesSelector ||
                docElem.msMatchesSelector)))) {

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
            contains = hasCompare || rnative.test(docElem.contains) ?
                function (a, b) {
                    var adown = a.nodeType === 9 ? a.documentElement : a,
                        bup = b && b.parentNode;
                    return a === bup || !!(bup && bup.nodeType === 1 && (
                        adown.contains ?
                            adown.contains(bup) :
                            a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                    ));
                } :
                function (a, b) {
                    if (b) {
                        while ((b = b.parentNode)) {
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
            sortOrder = hasCompare ?
            function (a, b) {

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
                compare = (a.ownerDocument || a) === (b.ownerDocument || b) ?
                    a.compareDocumentPosition(b) :

                    // Otherwise we know they are disconnected
                    1;

                // Disconnected nodes
                if (compare & 1 ||
                    (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {

                    // Choose the first element that is related to our preferred document
                    if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
                        return -1;
                    }
                    if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
                        return 1;
                    }

                    // Maintain original order
                    return sortInput ?
                        (indexOf(sortInput, a) - indexOf(sortInput, b)) :
                        0;
                }

                return compare & 4 ? -1 : 1;
            } :
            function (a, b) {
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
                    return a === document ? -1 :
                        b === document ? 1 :
                        aup ? -1 :
                        bup ? 1 :
                        sortInput ?
                        (indexOf(sortInput, a) - indexOf(sortInput, b)) :
                        0;

                    // If the nodes are siblings, we can do a quick check
                } else if (aup === bup) {
                    return siblingCheck(a, b);
                }

                // Otherwise we need full lists of their ancestors for comparison
                cur = a;
                while ((cur = cur.parentNode)) {
                    ap.unshift(cur);
                }
                cur = b;
                while ((cur = cur.parentNode)) {
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
                    ap[i] === preferredDoc ? -1 :
                    bp[i] === preferredDoc ? 1 :
                    0;
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

            if (support.matchesSelector && documentIsHTML &&
                !compilerCache[expr + " "] &&
                (!rbuggyMatches || !rbuggyMatches.test(expr)) &&
                (!rbuggyQSA || !rbuggyQSA.test(expr))) {

                try {
                    var ret = matches.call(elem, expr);

                    // IE 9's matchesSelector returns false on disconnected nodes
                    if (ret || support.disconnectedMatch ||
                        // As well, disconnected nodes are said to be in a document
                        // fragment in IE 9
                            elem.document && elem.document.nodeType !== 11) {
                        return ret;
                    }
                } catch (e) { }
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
                val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
                    fn(elem, name, !documentIsHTML) :
                    undefined;

            return val !== undefined ?
                val :
                support.attributes || !documentIsHTML ?
                    elem.getAttribute(name) :
                    (val = elem.getAttributeNode(name)) && val.specified ?
                        val.value :
                        null;
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
                while ((elem = results[i++])) {
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
                while ((node = elem[i++])) {
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
                "ATTR": function (match) {
                    match[1] = match[1].replace(runescape, funescape);

                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

                    if (match[2] === "~=") {
                        match[3] = " " + match[3] + " ";
                    }

                    return match.slice(0, 4);
                },

                "CHILD": function (match) {
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
                        match[5] = +((match[7] + match[8]) || match[3] === "odd");

                        // other types prohibit arguments
                    } else if (match[3]) {
                        Sizzle.error(match[0]);
                    }

                    return match;
                },

                "PSEUDO": function (match) {
                    var excess,
                        unquoted = !match[6] && match[2];

                    if (matchExpr["CHILD"].test(match[0])) {
                        return null;
                    }

                    // Accept quoted arguments as-is
                    if (match[3]) {
                        match[2] = match[4] || match[5] || "";

                        // Strip excess characters from unquoted arguments
                    } else if (unquoted && rpseudo.test(unquoted) &&
                        // Get excess from tokenize (recursively)
                        (excess = tokenize(unquoted, true)) &&
                        // advance to the next closing parenthesis
                        (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

                        // excess is a negative index
                        match[0] = match[0].slice(0, excess);
                        match[2] = unquoted.slice(0, excess);
                    }

                    // Return only captures needed by the pseudo filter method (type and argument)
                    return match.slice(0, 3);
                }
            },

            filter: {

                "TAG": function (nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return nodeNameSelector === "*" ?
                        function () { return true; } :
                        function (elem) {
                            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                        };
                },

                "CLASS": function (className) {
                    var pattern = classCache[className + " "];

                    return pattern ||
                        (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
                        classCache(className, function (elem) {
                            return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
                        });
                },

                "ATTR": function (name, operator, check) {
                    return function (elem) {
                        var result = Sizzle.attr(elem, name);

                        if (result == null) {
                            return operator === "!=";
                        }
                        if (!operator) {
                            return true;
                        }

                        result += "";

                        return operator === "=" ? result === check :
                            operator === "!=" ? result !== check :
                            operator === "^=" ? check && result.indexOf(check) === 0 :
                            operator === "*=" ? check && result.indexOf(check) > -1 :
                            operator === "$=" ? check && result.slice(-check.length) === check :
                            operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 :
                            operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
                            false;
                    };
                },

                "CHILD": function (type, what, argument, first, last) {
                    var simple = type.slice(0, 3) !== "nth",
                        forward = type.slice(-4) !== "last",
                        ofType = what === "of-type";

                    return first === 1 && last === 0 ?

                        // Shortcut for :nth-*(n)
                        function (elem) {
                            return !!elem.parentNode;
                        } :

                        function (elem, context, xml) {
                            var cache, uniqueCache, outerCache, node, nodeIndex, start,
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
                                        while ((node = node[dir])) {
                                            if (ofType ?
                                                node.nodeName.toLowerCase() === name :
                                                node.nodeType === 1) {

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
                                    uniqueCache = outerCache[node.uniqueID] ||
                                        (outerCache[node.uniqueID] = {});

                                    cache = uniqueCache[type] || [];
                                    nodeIndex = cache[0] === dirruns && cache[1];
                                    diff = nodeIndex && cache[2];
                                    node = nodeIndex && parent.childNodes[nodeIndex];

                                    while ((node = ++nodeIndex && node && node[dir] ||

                                        // Fallback to seeking `elem` from the start
                                        (diff = nodeIndex = 0) || start.pop())) {

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
                                        uniqueCache = outerCache[node.uniqueID] ||
                                            (outerCache[node.uniqueID] = {});

                                        cache = uniqueCache[type] || [];
                                        nodeIndex = cache[0] === dirruns && cache[1];
                                        diff = nodeIndex;
                                    }

                                    // xml :nth-child(...)
                                    // or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                    if (diff === false) {
                                        // Use the same loop as above to seek `elem` from the start
                                        while ((node = ++nodeIndex && node && node[dir] ||
                                            (diff = nodeIndex = 0) || start.pop())) {

                                            if ((ofType ?
                                                node.nodeName.toLowerCase() === name :
                                                node.nodeType === 1) &&
                                                ++diff) {

                                                // Cache the index of each encountered element
                                                if (useCache) {
                                                    outerCache = node[expando] || (node[expando] = {});

                                                    // Support: IE <9 only
                                                    // Defend against cloned attroperties (jQuery gh-1709)
                                                    uniqueCache = outerCache[node.uniqueID] ||
                                                        (outerCache[node.uniqueID] = {});

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
                                return diff === first || (diff % first === 0 && diff / first >= 0);
                            }
                        };
                },

                "PSEUDO": function (pseudo, argument) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args,
                        fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
                            Sizzle.error("unsupported pseudo: " + pseudo);

                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    if (fn[expando]) {
                        return fn(argument);
                    }

                    // But maintain support for old signatures
                    if (fn.length > 1) {
                        args = [pseudo, pseudo, "", argument];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
                            markFunction(function (seed, matches) {
                                var idx,
                                    matched = fn(seed, argument),
                                    i = matched.length;
                                while (i--) {
                                    idx = indexOf(seed, matched[i]);
                                    seed[idx] = !(matches[idx] = matched[i]);
                                }
                            }) :
                            function (elem) {
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

                    return matcher[expando] ?
                        markFunction(function (seed, matches, context, xml) {
                            var elem,
                                unmatched = matcher(seed, null, xml, []),
                                i = seed.length;

                            // Match elements unmatched by `matcher`
                            while (i--) {
                                if ((elem = unmatched[i])) {
                                    seed[i] = !(matches[i] = elem);
                                }
                            }
                        }) :
                        function (elem, context, xml) {
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
                            if ((elemLang = documentIsHTML ?
                                elem.lang :
                                elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {

                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                            }
                        } while ((elem = elem.parentNode) && elem.nodeType === 1);
                        return false;
                    };
                }),

                // Miscellaneous
                "target": function (elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },

                "root": function (elem) {
                    return elem === docElem;
                },

                "focus": function (elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },

                // Boolean properties
                "enabled": createDisabledPseudo(false),
                "disabled": createDisabledPseudo(true),

                "checked": function (elem) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },

                "selected": function (elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                // Contents
                "empty": function (elem) {
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

                "parent": function (elem) {
                    return !Expr.pseudos["empty"](elem);
                },

                // Element/input types
                "header": function (elem) {
                    return rheader.test(elem.nodeName);
                },

                "input": function (elem) {
                    return rinputs.test(elem.nodeName);
                },

                "button": function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },

                "text": function (elem) {
                    var attr;
                    return elem.nodeName.toLowerCase() === "input" &&
                        elem.type === "text" &&

                        // Support: IE<8
                        // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                        ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
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
        function setFilters() { }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();

        tokenize = Sizzle.tokenize = function (selector, parseOnly) {
            var matched, match, tokens, type,
                soFar, groups, preFilters,
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
                    groups.push((tokens = []));
                }

                matched = false;

                // Combinators
                if ((match = rcombinators.exec(soFar))) {
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
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
                        (match = preFilters[type](match)))) {
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
            return parseOnly ?
                soFar.length :
                soFar ?
                    Sizzle.error(selector) :
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
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            return matcher(elem, context, xml);
                        }
                    }
                    return false;
                } :

                // Check against all ancestor/preceding elements
                function (elem, context, xml) {
                    var oldCache, uniqueCache, outerCache,
                        newCache = [dirruns, doneName];

                    // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
                    if (xml) {
                        while ((elem = elem[dir])) {
                            if (elem.nodeType === 1 || checkNonElements) {
                                if (matcher(elem, context, xml)) {
                                    return true;
                                }
                            }
                        }
                    } else {
                        while ((elem = elem[dir])) {
                            if (elem.nodeType === 1 || checkNonElements) {
                                outerCache = elem[expando] || (elem[expando] = {});

                                // Support: IE <9 only
                                // Defend against cloned attroperties (jQuery gh-1709)
                                uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

                                if (skip && skip === elem.nodeName.toLowerCase()) {
                                    elem = elem[dir] || elem;
                                } else if ((oldCache = uniqueCache[key]) &&
                                    oldCache[0] === dirruns && oldCache[1] === doneName) {

                                    // Assign to newCache so results back-propagate to previous elements
                                    return (newCache[2] = oldCache[2]);
                                } else {
                                    // Reuse newcache so results back-propagate to previous elements
                                    uniqueCache[key] = newCache;

                                    // A match means we're done; a fail means we have to keep checking
                                    if ((newCache[2] = matcher(elem, context, xml))) {
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
            return matchers.length > 1 ?
                function (elem, context, xml) {
                    var i = matchers.length;
                    while (i--) {
                        if (!matchers[i](elem, context, xml)) {
                            return false;
                        }
                    }
                    return true;
                } :
                matchers[0];
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
                if ((elem = unmatched[i])) {
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
                var temp, i, elem,
                    preMap = [],
                    postMap = [],
                    preexisting = results.length,

                    // Get initial elements from seed or context
                    elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

                    // Prefilter to get matcher input, preserving a map for seed-results synchronization
                    matcherIn = preFilter && (seed || !selector) ?
                        condense(elems, preMap, preFilter, context, xml) :
                        elems,

                    matcherOut = matcher ?
                        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                        postFinder || (seed ? preFilter : preexisting || postFilter) ?

                            // ...intermediate processing is necessary
                            [] :

                            // ...otherwise use results directly
                    results :
                        matcherIn;

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
                        if ((elem = temp[i])) {
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
                                if ((elem = matcherOut[i])) {
                                    // Restore matcherIn since elem is not yet a final match
                                    temp.push((matcherIn[i] = elem));
                                }
                            }
                            postFinder(null, (matcherOut = []), temp, xml);
                        }

                        // Move matched elements from seed to results to keep them synchronized
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) &&
                                (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }

                    // Add elements to results, through postFinder if defined
                } else {
                    matcherOut = condense(
                        matcherOut === results ?
                            matcherOut.splice(preexisting, matcherOut.length) :
                            matcherOut
                    );
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }

        function matcherFromTokens(tokens) {
            var checkContext, matcher, j,
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
                    var ret = (!leadingRelative && (xml || context !== outermostContext)) || (
                        (checkContext = context).nodeType ?
                            matchContext(elem, context, xml) :
                            matchAnyContext(elem, context, xml));
                    // Avoid hanging onto element (issue #299)
                    checkContext = null;
                    return ret;
                }];

            for (; i < len; i++) {
                if ((matcher = Expr.relative[tokens[i].type])) {
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
                        return setMatcher(
                            i > 1 && elementMatcher(matchers),
                            i > 1 && toSelector(
                                // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                                tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })
                            ).replace(rtrim, "$1"),
                            matcher,
                            i < j && matcherFromTokens(tokens.slice(i, j)),
                            j < len && matcherFromTokens((tokens = tokens.slice(j))),
                            j < len && toSelector(tokens)
                        );
                    }
                    matchers.push(matcher);
                }
            }

            return elementMatcher(matchers);
        }

        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function (seed, context, xml, results, outermost) {
                    var elem, j, matcher,
                        matchedCount = 0,
                        i = "0",
                        unmatched = seed && [],
                        setMatched = [],
                        contextBackup = outermostContext,
                        // We must always have either seed elements or outermost context
                        elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                        // Use integer dirruns iff this is the outermost matcher
                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
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
                            while ((matcher = elementMatchers[j++])) {
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
                            if ((elem = !matcher && elem)) {
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
                        while ((matcher = setMatchers[j++])) {
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
                        if (outermost && !seed && setMatched.length > 0 &&
                            (matchedCount + setMatchers.length) > 1) {

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

            return bySet ?
                markFunction(superMatcher) :
                superMatcher;
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
            var i, tokens, token, type, find,
                compiled = typeof selector === "function" && selector,
                match = !seed && tokenize((selector = compiled.selector || selector));

            results = results || [];

            // Try to minimize operations if there is only one selector in the list and no seed
            // (the latter of which guarantees us context)
            if (match.length === 1) {

                // Reduce context if the leading compound selector is an ID
                tokens = match[0] = match[0].slice(0);
                if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

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
                    if (Expr.relative[(type = token.type)]) {
                        break;
                    }
                    if ((find = Expr.find[type])) {
                        // Search, expanding context for leading sibling combinators
                        if ((seed = find(
                            token.matches[0].replace(runescape, funescape),
                            rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                        ))) {

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
            (compiled || compile(selector, match))(
                seed,
                context,
                !documentIsHTML,
                results,
                !context || rsibling.test(selector) && testContext(context.parentNode) || context
            );
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
                    return elem[name] === true ? name.toLowerCase() :
                            (val = elem.getAttributeNode(name)) && val.specified ?
                            val.value :
                        null;
                }
            });
        }

        return Sizzle;

    })(window);



    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;

    // Deprecated
    jQuery.expr[":"] = jQuery.expr.pseudos;
    jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    jQuery.escapeSelector = Sizzle.escape;




    var dir = function (elem, dir, until) {
        var matched = [],
            truncate = until !== undefined;

        while ((elem = elem[dir]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
                if (truncate && jQuery(elem).is(until)) {
                    break;
                }
                matched.push(elem);
            }
        }
        return matched;
    };


    var siblings = function (n, elem) {
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
    var rsingleTag = (/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i);



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
                return (elem === qualifier) !== not;
            });
        }

        // Arraylike of elements (jQuery, arguments, Array)
        if (typeof qualifier !== "string") {
            return jQuery.grep(elements, function (elem) {
                return (indexOf.call(qualifier, elem) > -1) !== not;
            });
        }

        // Simple selector that can be filtered directly, removing non-Elements
        if (risSimple.test(qualifier)) {
            return jQuery.filter(qualifier, elements, not);
        }

        // Complex selector, compare the two sets, removing non-Elements
        qualifier = jQuery.filter(qualifier, elements);
        return jQuery.grep(elements, function (elem) {
            return (indexOf.call(qualifier, elem) > -1) !== not && elem.nodeType === 1;
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
        find: function (selector) {
            var i, ret,
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
        filter: function (selector) {
            return this.pushStack(winnow(this, selector || [], false));
        },
        not: function (selector) {
            return this.pushStack(winnow(this, selector || [], true));
        },
        is: function (selector) {
            return !!winnow(
                this,

                // If this is a positional/relative selector, check membership in the returned set
                // so $("p:first").is("p:last") won't return true for a doc with two "p".
                typeof selector === "string" && rneedsContext.test(selector) ?
                    jQuery(selector) :
                    selector || [],
                false
            ).length;
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
                if (selector[0] === "<" &&
                    selector[selector.length - 1] === ">" &&
                    selector.length >= 3) {

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
                        jQuery.merge(this, jQuery.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ));

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
                return root.ready !== undefined ?
                    root.ready(selector) :

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
        has: function (target) {
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

        closest: function (selectors, context) {
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
                        if (cur.nodeType < 11 && (targets ?
                            targets.index(cur) > -1 :

                            // Don't pass non-elements to Sizzle
                            cur.nodeType === 1 &&
                                jQuery.find.matchesSelector(cur, selectors))) {

                            matched.push(cur);
                            break;
                        }
                    }
                }
            }

            return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
        },

        // Determine the position of an element within the set
        index: function (elem) {

            // No argument, return index in parent
            if (!elem) {
                return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
            }

            // Index in selector
            if (typeof elem === "string") {
                return indexOf.call(jQuery(elem), this[0]);
            }

            // Locate the position of the desired element
            return indexOf.call(this,

                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[0] : elem
            );
        },

        add: function (selector, context) {
            return this.pushStack(
                jQuery.uniqueSort(
                    jQuery.merge(this.get(), jQuery(selector, context))
                )
            );
        },

        addBack: function (selector) {
            return this.add(selector == null ?
                this.prevObject : this.prevObject.filter(selector)
            );
        }
    });

    function sibling(cur, dir) {
        while ((cur = cur[dir]) && cur.nodeType !== 1) { }
        return cur;
    }

    jQuery.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return dir(elem, "parentNode");
        },
        parentsUntil: function (elem, i, until) {
            return dir(elem, "parentNode", until);
        },
        next: function (elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function (elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function (elem) {
            return dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
            return dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
            return dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
            return dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function (elem) {
            return siblings(elem.firstChild);
        },
        contents: function (elem) {
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
    var rnothtmlwhite = (/[^\x20\t\r\n\f]+/g);



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
        options = typeof options === "string" ?
            createOptions(options) :
            jQuery.extend({}, options);

        var // Flag to know if list is currently firing
            firing,

            // Last fire value for non-forgettable lists
            memory,

            // Flag to know if list was already fired
            fired,

            // Flag to prevent firing
            locked,

            // Actual callback list
            list = [],

            // Queue of execution data for repeatable lists
            queue = [],

            // Index of currently firing callback (modified by add/remove as needed)
            firingIndex = -1,

            // Fire callbacks
            fire = function () {

                // Enforce single-firing
                locked = locked || options.once;

                // Execute callbacks for all pending executions,
                // respecting firingIndex overrides and runtime changes
                fired = firing = true;
                for (; queue.length; firingIndex = -1) {
                    memory = queue.shift();
                    while (++firingIndex < list.length) {

                        // Run callback and check for early termination
                        if (list[firingIndex].apply(memory[0], memory[1]) === false &&
                            options.stopOnFalse) {

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
                if (locked) {

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
                add: function () {
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
                remove: function () {
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
                has: function (fn) {
                    return fn ?
                        jQuery.inArray(fn, list) > -1 :
                        list.length > 0;
                },

                // Remove all callbacks from the list
                empty: function () {
                    if (list) {
                        list = [];
                    }
                    return this;
                },

                // Disable .fire and .add
                // Abort any current/pending executions
                // Clear all callbacks and values
                disable: function () {
                    locked = queue = [];
                    list = memory = "";
                    return this;
                },
                disabled: function () {
                    return !list;
                },

                // Disable .fire
                // Also disable .add unless we have memory (since it would have no effect)
                // Abort any pending executions
                lock: function () {
                    locked = queue = [];
                    if (!memory && !firing) {
                        list = memory = "";
                    }
                    return this;
                },
                locked: function () {
                    return !!locked;
                },

                // Call all callbacks with the given context and arguments
                fireWith: function (context, args) {
                    if (!locked) {
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
                fire: function () {
                    self.fireWith(this, arguments);
                    return this;
                },

                // To know if the callbacks have already been called at least once
                fired: function () {
                    return !!fired;
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
            if (value && jQuery.isFunction((method = value.promise))) {
                method.call(value).done(resolve).fail(reject);

                // Other thenables
            } else if (value && jQuery.isFunction((method = value.then))) {
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

        Deferred: function (func) {
            var tuples = [

                    // action, add listener, callbacks,
                    // ... .then handlers, argument index, [final state]
                    ["notify", "progress", jQuery.Callbacks("memory"),
                        jQuery.Callbacks("memory"), 2],
                    ["resolve", "done", jQuery.Callbacks("once memory"),
                        jQuery.Callbacks("once memory"), 0, "resolved"],
                    ["reject", "fail", jQuery.Callbacks("once memory"),
                        jQuery.Callbacks("once memory"), 1, "rejected"]
            ],
                state = "pending",
                promise = {
                    state: function () {
                        return state;
                    },
                    always: function () {
                        deferred.done(arguments).fail(arguments);
                        return this;
                    },
                    "catch": function (fn) {
                        return promise.then(null, fn);
                    },

                    // Keep pipe for back-compat
                    pipe: function ( /* fnDone, fnFail, fnProgress */) {
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
                                        returned.promise()
                                            .progress(newDefer.notify)
                                            .done(newDefer.resolve)
                                            .fail(newDefer.reject);
                                    } else {
                                        newDefer[tuple[0] + "With"](
                                            this,
                                            fn ? [returned] : arguments
                                        );
                                    }
                                });
                            });
                            fns = null;
                        }).promise();
                    },
                    then: function (onFulfilled, onRejected, onProgress) {
                        var maxDepth = 0;
                        function resolve(depth, deferred, handler, special) {
                            return function () {
                                var that = this,
                                    args = arguments,
                                    mightThrow = function () {
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
                                        then = returned &&

                                            // Support: Promises/A+ section 2.3.4
                                            // https://promisesaplus.com/#point-64
                                            // Only check objects and functions for thenability
                                            (typeof returned === "object" ||
                                                typeof returned === "function") &&
                                            returned.then;

                                        // Handle a returned thenable
                                        if (jQuery.isFunction(then)) {

                                            // Special processors (notify) just wait for resolution
                                            if (special) {
                                                then.call(
                                                    returned,
                                                    resolve(maxDepth, deferred, Identity, special),
                                                    resolve(maxDepth, deferred, Thrower, special)
                                                );

                                                // Normal processors (resolve) also hook into progress
                                            } else {

                                                // ...and disregard older resolution values
                                                maxDepth++;

                                                then.call(
                                                    returned,
                                                    resolve(maxDepth, deferred, Identity, special),
                                                    resolve(maxDepth, deferred, Thrower, special),
                                                    resolve(maxDepth, deferred, Identity,
                                                        deferred.notifyWith)
                                                );
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
                                    process = special ?
                                    mightThrow :
                                        function () {
                                            try {
                                                mightThrow();
                                            } catch (e) {

                                                if (jQuery.Deferred.exceptionHook) {
                                                    jQuery.Deferred.exceptionHook(e,
                                                        process.stackTrace);
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
                            tuples[0][3].add(
                                resolve(
                                    0,
                                    newDefer,
                                    jQuery.isFunction(onProgress) ?
                                onProgress :
                                        Identity,
                                    newDefer.notifyWith
                                )
                            );

                            // fulfilled_handlers.add( ... )
                            tuples[1][3].add(
                                resolve(
                                    0,
                                    newDefer,
                                    jQuery.isFunction(onFulfilled) ?
                                onFulfilled :
                                        Identity
                                )
                            );

                            // rejected_handlers.add( ... )
                            tuples[2][3].add(
                                resolve(
                                    0,
                                    newDefer,
                                    jQuery.isFunction(onRejected) ?
                                onRejected :
                                        Thrower
                                )
                            );
                        }).promise();
                    },

                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function (obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
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
                promise[tuple[1]] = list.add;

                // Handle state
                if (stateString) {
                    list.add(
                        function () {

                            // state = "resolved" (i.e., fulfilled)
                            // state = "rejected"
                            state = stateString;
                        },

                        // rejected_callbacks.disable
                        // fulfilled_callbacks.disable
                        tuples[3 - i][2].disable,

                        // progress_callbacks.lock
                        tuples[0][2].lock
                    );
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
            promise.promise(deferred);

            // Call given func if any
            if (func) {
                func.call(deferred, deferred);
            }

            // All done!
            return deferred;
        },

        // Deferred helper
        when: function (singleValue) {
            var

                // count of uncompleted subordinates
                remaining = arguments.length,

                // count of unprocessed arguments
                i = remaining,

                // subordinate fulfillment data
                resolveContexts = Array(i),
                resolveValues = slice.call(arguments),

                // the master Deferred
                master = jQuery.Deferred(),

                // subordinate callback factory
                updateFunc = function (i) {
                    return function (value) {
                        resolveContexts[i] = this;
                        resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value;
                        if (!(--remaining)) {
                            master.resolveWith(resolveContexts, resolveValues);
                        }
                    };
                };

            // Single- and empty arguments are adopted like Promise.resolve
            if (remaining <= 1) {
                adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject,
                    !remaining);

                // Use .then() to unwrap secondary thenables (cf. gh-3000)
                if (master.state() === "pending" ||
                    jQuery.isFunction(resolveValues[i] && resolveValues[i].then)) {

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

        readyList
            .then(fn)

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
        ready: function (wait) {

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
    if (document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)) {

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
    var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
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
                    fn = function (elem, key, value) {
                        return bulk.call(jQuery(elem), value);
                    };
                }
            }

            if (fn) {
                for (; i < len; i++) {
                    fn(
                        elems[i], key, raw ?
                        value :
                        value.call(elems[i], i, fn(elems[i], key))
                    );
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
    var acceptData = function (owner) {

        // Accepts only:
        //  - Node
        //    - Node.ELEMENT_NODE
        //    - Node.DOCUMENT_NODE
        //  - Object
        //    - Any
        return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
    };




    function Data() {
        this.expando = jQuery.expando + Data.uid++;
    }

    Data.uid = 1;

    Data.prototype = {

        cache: function (owner) {

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
        set: function (owner, data, value) {
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
        get: function (owner, key) {
            return key === undefined ?
                this.cache(owner) :

                // Always use camelCase key (gh-2257)
                owner[this.expando] && owner[this.expando][jQuery.camelCase(key)];
        },
        access: function (owner, key, value) {

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
            if (key === undefined ||
                    ((key && typeof key === "string") && value === undefined)) {

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
        remove: function (owner, key) {
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
                    key = key in cache ?
                        [key] :
                        (key.match(rnothtmlwhite) || []);
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
        hasData: function (owner) {
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
                } catch (e) { }

                // Make sure we set the data so it isn't changed later
                dataUser.set(elem, key, data);
            } else {
                data = undefined;
            }
        }
        return data;
    }

    jQuery.extend({
        hasData: function (elem) {
            return dataUser.hasData(elem) || dataPriv.hasData(elem);
        },

        data: function (elem, name, data) {
            return dataUser.access(elem, name, data);
        },

        removeData: function (elem, name) {
            dataUser.remove(elem, name);
        },

        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function (elem, name, data) {
            return dataPriv.access(elem, name, data);
        },

        _removeData: function (elem, name) {
            dataPriv.remove(elem, name);
        }
    });

    jQuery.fn.extend({
        data: function (key, value) {
            var i, name, data,
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
            if (typeof key === "object") {
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

        removeData: function (key) {
            return this.each(function () {
                dataUser.remove(this, key);
            });
        }
    });


    jQuery.extend({
        queue: function (elem, type, data) {
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

        dequeue: function (elem, type) {
            type = type || "fx";

            var queue = jQuery.queue(elem, type),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks(elem, type),
                next = function () {
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
        _queueHooks: function (elem, type) {
            var key = type + "queueHooks";
            return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function () {
                    dataPriv.remove(elem, [type + "queue", key]);
                })
            });
        }
    });

    jQuery.fn.extend({
        queue: function (type, data) {
            var setter = 2;

            if (typeof type !== "string") {
                data = type;
                type = "fx";
                setter--;
            }

            if (arguments.length < setter) {
                return jQuery.queue(this[0], type);
            }

            return data === undefined ?
                this :
                this.each(function () {
                    var queue = jQuery.queue(this, type, data);

                    // Ensure a hooks for this queue
                    jQuery._queueHooks(this, type);

                    if (type === "fx" && queue[0] !== "inprogress") {
                        jQuery.dequeue(this, type);
                    }
                });
        },
        dequeue: function (type) {
            return this.each(function () {
                jQuery.dequeue(this, type);
            });
        },
        clearQueue: function (type) {
            return this.queue(type || "fx", []);
        },

        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function (type, obj) {
            var tmp,
                count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function () {
                    if (!(--count)) {
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
    var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

    var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");


    var cssExpand = ["Top", "Right", "Bottom", "Left"];

    var isHiddenWithinTree = function (elem, el) {

        // isHiddenWithinTree might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;

        // Inline style trumps all
        return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains(elem.ownerDocument, elem) &&

			jQuery.css(elem, "display") === "none";
    };

    var swap = function (elem, options, callback, args) {
        var ret, name,
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
            currentValue = tween ?
                function () {
                    return tween.cur();
                } :
                function () {
                    return jQuery.css(elem, prop, "");
                },
            initial = currentValue(),
            unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),

            // Starting value computation is required for potential unit mismatches
            initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) &&
                rcssNum.exec(jQuery.css(elem, prop));

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
            } while (
                scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations
            );
        }

        if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;

            // Apply relative offset (+=/-=) if specified
            adjusted = valueParts[1] ?
                initialInUnit + (valueParts[1] + 1) * valueParts[2] :
                +valueParts[2];
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
        var display, elem,
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
        show: function () {
            return showHide(this, true);
        },
        hide: function () {
            return showHide(this);
        },
        toggle: function (state) {
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
    var rcheckableType = (/^(?:checkbox|radio)$/i);

    var rtagName = (/<([a-z][^\/\0>\x20\t\r\n\f]+)/i);

    var rscriptType = (/^$|\/(?:java|ecma)script/i);



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
            dataPriv.set(
                elems[i],
                "globalEval",
                !refElements || dataPriv.get(refElements[i], "globalEval")
            );
        }
    }


    var rhtml = /<|&#?\w+;/;

    function buildFragment(elems, context, scripts, selection, ignored) {
        var elem, tmp, tag, wrap, contains, j,
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
        while ((elem = nodes[i++])) {

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
                while ((elem = tmp[j++])) {
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



    var
        rkeyEvent = /^key/,
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
        } catch (err) { }
    }

    function on(elem, types, selector, data, fn, one) {
        var origFn, type;

        // Types can be a map of types/handlers
        if (typeof types === "object") {

            // ( types-Object, selector, data )
            if (typeof selector !== "string") {

                // ( types-Object, data )
                data = data || selector;
                selector = undefined;
            }
            for (type in types) {
                on(elem, type, selector, data, types[type], one);
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
            fn = function (event) {

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

        add: function (elem, types, handler, data, selector) {

            var handleObjIn, eventHandle, tmp,
                events, t, handleObj,
                special, handlers, type, namespaces, origType,
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
                    return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
                        jQuery.event.dispatch.apply(elem, arguments) : undefined;
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
                    if (!special.setup ||
                        special.setup.call(elem, data, namespaces, eventHandle) === false) {

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
        remove: function (elem, types, handler, selector, mappedTypes) {

            var j, origCount, tmp,
                events, t, handleObj,
                special, handlers, type, namespaces, origType,
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
                tmp = tmp[2] &&
                    new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

                // Remove matching events
                origCount = j = handlers.length;
                while (j--) {
                    handleObj = handlers[j];

                    if ((mappedTypes || origType === handleObj.origType) &&
                        (!handler || handler.guid === handleObj.guid) &&
                        (!tmp || tmp.test(handleObj.namespace)) &&
                        (!selector || selector === handleObj.selector ||
                            selector === "**" && handleObj.selector)) {
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
                    if (!special.teardown ||
                        special.teardown.call(elem, namespaces, elemData.handle) === false) {

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

        dispatch: function (nativeEvent) {

            // Make a writable jQuery.Event from the native event object
            var event = jQuery.event.fix(nativeEvent);

            var i, j, ret, matched, handleObj, handlerQueue,
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
                while ((handleObj = matched.handlers[j++]) &&
                    !event.isImmediatePropagationStopped()) {

                    // Triggered event must either 1) have no namespace, or 2) have namespace(s)
                    // a subset or equal to those in the bound event (both can have no namespace).
                    if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

                        event.handleObj = handleObj;
                        event.data = handleObj.data;

                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle ||
                            handleObj.handler).apply(matched.elem, args);

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

        handlers: function (event, handlers) {
            var i, handleObj, sel, matchedHandlers, matchedSelectors,
                handlerQueue = [],
                delegateCount = handlers.delegateCount,
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
                            handleObj = handlers[i];

                            // Don't conflict with Object.prototype properties (#13203)
                            sel = handleObj.selector + " ";

                            if (matchedSelectors[sel] === undefined) {
                                matchedSelectors[sel] = handleObj.needsContext ?
                                    jQuery(sel, this).index(cur) > -1 :
                                    jQuery.find(sel, this, null, [cur]).length;
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
            if (delegateCount < handlers.length) {
                handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
            }

            return handlerQueue;
        },

        addProp: function (name, hook) {
            Object.defineProperty(jQuery.Event.prototype, name, {
                enumerable: true,
                configurable: true,

                get: jQuery.isFunction(hook) ?
                    function () {
                        if (this.originalEvent) {
                            return hook(this.originalEvent);
                        }
                    } :
                    function () {
                        if (this.originalEvent) {
                            return this.originalEvent[name];
                        }
                    },

                set: function (value) {
                    Object.defineProperty(this, name, {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: value
                    });
                }
            });
        },

        fix: function (originalEvent) {
            return originalEvent[jQuery.expando] ?
                originalEvent :
                new jQuery.Event(originalEvent);
        },

        special: {
            load: {

                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },
            focus: {

                // Fire native event if possible so blur/focus sequence is correct
                trigger: function () {
                    if (this !== safeActiveElement() && this.focus) {
                        this.focus();
                        return false;
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    if (this === safeActiveElement() && this.blur) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: "focusout"
            },
            click: {

                // For checkbox, fire native event so checked state will be right
                trigger: function () {
                    if (this.type === "checkbox" && this.click && nodeName(this, "input")) {
                        this.click();
                        return false;
                    }
                },

                // For cross-browser consistency, don't fire native .click() on links
                _default: function (event) {
                    return nodeName(event.target, "a");
                }
            },

            beforeunload: {
                postDispatch: function (event) {

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
            this.isDefaultPrevented = src.defaultPrevented ||
                    src.defaultPrevented === undefined &&

                    // Support: Android <=2.3 only
                    src.returnValue === false ?
                returnTrue :
                returnFalse;

            // Create target properties
            // Support: Safari <=6 - 7 only
            // Target should not be a text node (#504, #13143)
            this.target = (src.target && src.target.nodeType === 3) ?
                src.target.parentNode :
                src.target;

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

        preventDefault: function () {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;

            if (e && !this.isSimulated) {
                e.preventDefault();
            }
        },
        stopPropagation: function () {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;

            if (e && !this.isSimulated) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function () {
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

        which: function (event) {
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

            handle: function (event) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj;

                // For mouseenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if (!related || (related !== target && !jQuery.contains(target, related))) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            }
        };
    });

    jQuery.fn.extend({

        on: function (types, selector, data, fn) {
            return on(this, types, selector, data, fn);
        },
        one: function (types, selector, data, fn) {
            return on(this, types, selector, data, fn, 1);
        },
        off: function (types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {

                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(
                    handleObj.namespace ?
                        handleObj.origType + "." + handleObj.namespace :
                        handleObj.origType,
                    handleObj.selector,
                    handleObj.handler
                );
                return this;
            }
            if (typeof types === "object") {

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
        if (nodeName(elem, "table") &&
            nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {

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

        var fragment, first, scripts, hasScripts, node, doc,
            i = 0,
            l = collection.length,
            iNoClone = l - 1,
            value = args[0],
            isFunction = jQuery.isFunction(value);

        // We can't cloneNode fragments that contain checked, in WebKit
        if (isFunction ||
                (l > 1 && typeof value === "string" &&
                    !support.checkClone && rchecked.test(value))) {
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
                        if (rscriptType.test(node.type || "") &&
                            !dataPriv.access(node, "globalEval") &&
                            jQuery.contains(doc, node)) {

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

    function remove(elem, selector, keepData) {
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
        htmlPrefilter: function (html) {
            return html.replace(rxhtmlTag, "<$1></$2>");
        },

        clone: function (elem, dataAndEvents, deepDataAndEvents) {
            var i, l, srcElements, destElements,
                clone = elem.cloneNode(true),
                inPage = jQuery.contains(elem.ownerDocument, elem);

            // Fix IE cloning issues
            if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) &&
                    !jQuery.isXMLDoc(elem)) {

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

        cleanData: function (elems) {
            var data, elem, type,
                special = jQuery.event.special,
                i = 0;

            for (; (elem = elems[i]) !== undefined; i++) {
                if (acceptData(elem)) {
                    if ((data = elem[dataPriv.expando])) {
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
        detach: function (selector) {
            return remove(this, selector, true);
        },

        remove: function (selector) {
            return remove(this, selector);
        },

        text: function (value) {
            return access(this, function (value) {
                return value === undefined ?
                    jQuery.text(this) :
                    this.empty().each(function () {
                        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                            this.textContent = value;
                        }
                    });
            }, null, value, arguments.length);
        },

        append: function () {
            return domManip(this, arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            });
        },

        prepend: function () {
            return domManip(this, arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        },

        before: function () {
            return domManip(this, arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this);
                }
            });
        },

        after: function () {
            return domManip(this, arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        },

        empty: function () {
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

        clone: function (dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map(function () {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },

        html: function (value) {
            return access(this, function (value) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;

                if (value === undefined && elem.nodeType === 1) {
                    return elem.innerHTML;
                }

                // See if we can take a shortcut and just use innerHTML
                if (typeof value === "string" && !rnoInnerhtml.test(value) &&
                    !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

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
                    } catch (e) { }
                }

                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        },

        replaceWith: function () {
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
    var rmargin = (/^margin/);

    var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

    var getStyles = function (elem) {

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

            div.style.cssText =
                "box-sizing:border-box;" +
                "position:relative;display:block;" +
                "margin:auto;border:1px;padding:1px;" +
                "top:1%;width:50%";
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

        var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
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

        container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
            "padding:0;margin-top:1px;position:absolute";
        container.appendChild(div);

        jQuery.extend(support, {
            pixelPosition: function () {
                computeStyleTests();
                return pixelPositionVal;
            },
            boxSizingReliable: function () {
                computeStyleTests();
                return boxSizingReliableVal;
            },
            pixelMarginRight: function () {
                computeStyleTests();
                return pixelMarginRightVal;
            },
            reliableMarginLeft: function () {
                computeStyleTests();
                return reliableMarginLeftVal;
            }
        });
    })();


    function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret,

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
            ret + "" :
            ret;
    }


    function addGetHookIf(conditionFn, hookFn) {

        // Define the hook, we'll check on the first run if it's really needed.
        return {
            get: function () {
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
            Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") :
            value;
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
        valueIsBorderBox = isBorderBox &&
            (support.boxSizingReliable() || val === elem.style[name]);

        // Fall back to offsetWidth/Height when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        if (val === "auto") {
            val = elem["offset" + name[0].toUpperCase() + name.slice(1)];
        }

        // Normalize "", auto, and prepare for extra
        val = parseFloat(val) || 0;

        // Use the active box-sizing model to add/subtract irrelevant styles
        return (val +
            augmentWidthOrHeight(
                elem,
                name,
                extra || (isBorderBox ? "border" : "content"),
                valueIsBorderBox,
                styles
            )
        ) + "px";
    }

    jQuery.extend({

        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
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
        style: function (elem, name, value, extra) {

            // Don't set styles on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, hooks,
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
                type = typeof value;

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
                if (!hooks || !("set" in hooks) ||
                    (value = hooks.set(elem, value, extra)) !== undefined) {

                    if (isCustomProp) {
                        style.setProperty(name, value);
                    } else {
                        style[name] = value;
                    }
                }

            } else {

                // If a hook was provided get the non-computed value from there
                if (hooks && "get" in hooks &&
                    (ret = hooks.get(elem, false, extra)) !== undefined) {

                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[name];
            }
        },

        css: function (elem, name, extra, styles) {
            var val, num, hooks,
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
            get: function (elem, computed, extra) {
                if (computed) {

                    // Certain elements can have dimension info if we invisibly show them
                    // but it must have a current display style that would benefit
                    return rdisplayswap.test(jQuery.css(elem, "display")) &&

                        // Support: Safari 8+
                        // Table columns in Safari have non-zero offsetWidth & zero
                        // getBoundingClientRect().width unless display is changed.
                        // Support: IE <=11 only
                        // Running getBoundingClientRect on a disconnected node
                        // in IE throws an error.
                        (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ?
                            swap(elem, cssShow, function () {
                                return getWidthOrHeight(elem, name, extra);
                            }) :
                            getWidthOrHeight(elem, name, extra);
                }
            },

            set: function (elem, value, extra) {
                var matches,
                    styles = extra && getStyles(elem),
                    subtract = extra && augmentWidthOrHeight(
                        elem,
                        name,
                        extra,
                        jQuery.css(elem, "boxSizing", false, styles) === "border-box",
                        styles
                    );

                // Convert to pixels if value adjustment is needed
                if (subtract && (matches = rcssNum.exec(value)) &&
                    (matches[3] || "px") !== "px") {

                    elem.style[name] = value;
                    value = jQuery.css(elem, name);
                }

                return setPositiveNumber(elem, value, subtract);
            }
        };
    });

    jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft,
        function (elem, computed) {
            if (computed) {
                return (parseFloat(curCSS(elem, "marginLeft")) ||
                    elem.getBoundingClientRect().left -
                        swap(elem, { marginLeft: 0 }, function () {
                            return elem.getBoundingClientRect().left;
                        })
                    ) + "px";
            }
        }
    );

    // These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function (value) {
                var i = 0,
                    expanded = {},

                    // Assumes a single number if not a string
                    parts = typeof value === "string" ? value.split(" ") : [value];

                for (; i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] =
                        parts[i] || parts[i - 2] || parts[0];
                }

                return expanded;
            }
        };

        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });

    jQuery.fn.extend({
        css: function (name, value) {
            return access(this, function (elem, name, value) {
                var styles, len,
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

                return value !== undefined ?
                    jQuery.style(elem, name, value) :
                    jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        }
    });


    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
        constructor: Tween,
        init: function (elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || jQuery.easing._default;
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function () {
            var hooks = Tween.propHooks[this.prop];

            return hooks && hooks.get ?
                hooks.get(this) :
                Tween.propHooks._default.get(this);
        },
        run: function (percent) {
            var eased,
                hooks = Tween.propHooks[this.prop];

            if (this.options.duration) {
                this.pos = eased = jQuery.easing[this.easing](
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                );
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
            get: function (tween) {
                var result;

                // Use a property on the element directly when it is not a DOM element,
                // or when there is no matching style property that exists.
                if (tween.elem.nodeType !== 1 ||
                    tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
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
            set: function (tween) {

                // Use step hook for back compat.
                // Use cssHook if its there.
                // Use .style if available and use plain properties where available.
                if (jQuery.fx.step[tween.prop]) {
                    jQuery.fx.step[tween.prop](tween);
                } else if (tween.elem.nodeType === 1 &&
                    (tween.elem.style[jQuery.cssProps[tween.prop]] != null ||
                        jQuery.cssHooks[tween.prop])) {
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
        set: function (tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
                tween.elem[tween.prop] = tween.now;
            }
        }
    };

    jQuery.easing = {
        linear: function (p) {
            return p;
        },
        swing: function (p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        },
        _default: "swing"
    };

    jQuery.fx = Tween.prototype.init;

    // Back compat <1.8 extension point
    jQuery.fx.step = {};




    var
        fxNow, inProgress,
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
        return (fxNow = jQuery.now());
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
            if ((tween = collection[index].call(animation, prop, value))) {

                // We're done with this property
                return tween;
            }
        }
    }

    function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
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
            tick = function () {
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
                createTween: function (prop, end) {
                    var tween = jQuery.Tween(elem, animation.opts, prop, end,
                            animation.opts.specialEasing[prop] || animation.opts.easing);
                    animation.tweens.push(tween);
                    return tween;
                },
                stop: function (gotoEnd) {
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
                    jQuery._queueHooks(animation.elem, animation.opts.queue).stop =
                        jQuery.proxy(result.stop, result);
                }
                return result;
            }
        }

        jQuery.map(props, createTween, animation);

        if (jQuery.isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
        }

        // Attach callbacks from options
        animation
            .progress(animation.opts.progress)
            .done(animation.opts.done, animation.opts.complete)
            .fail(animation.opts.fail)
            .always(animation.opts.always);

        jQuery.fx.timer(
            jQuery.extend(tick, {
                elem: elem,
                anim: animation,
                queue: animation.opts.queue
            })
        );

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

        tweener: function (props, callback) {
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

        prefilter: function (callback, prepend) {
            if (prepend) {
                Animation.prefilters.unshift(callback);
            } else {
                Animation.prefilters.push(callback);
            }
        }
    });

    jQuery.speed = function (speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing ||
                jQuery.isFunction(speed) && speed,
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
        fadeTo: function (speed, to, easing, callback) {

            // Show any hidden elements after setting opacity to 0
            return this.filter(isHiddenWithinTree).css("opacity", 0).show()

                // Animate to the value specified
                .end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function (prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop),
                optall = jQuery.speed(speed, easing, callback),
                doAnimation = function () {

                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation(this, jQuery.extend({}, prop), optall);

                    // Empty animations, or finishing resolves immediately
                    if (empty || dataPriv.get(this, "finish")) {
                        anim.stop(true);
                    }
                };
            doAnimation.finish = doAnimation;

            return empty || optall.queue === false ?
                this.each(doAnimation) :
                this.queue(optall.queue, doAnimation);
        },
        stop: function (type, clearQueue, gotoEnd) {
            var stopQueue = function (hooks) {
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
                    if (timers[index].elem === this &&
                        (type == null || timers[index].queue === type)) {

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
        finish: function (type) {
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
            return speed == null || typeof speed === "boolean" ?
                cssFn.apply(this, arguments) :
                this.animate(genFx(name, true), speed, easing, callback);
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
        attr: function (name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
        },

        removeAttr: function (name) {
            return this.each(function () {
                jQuery.removeAttr(this, name);
            });
        }
    });

    jQuery.extend({
        attr: function (elem, name, value) {
            var ret, hooks,
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
                hooks = jQuery.attrHooks[name.toLowerCase()] ||
                    (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
            }

            if (value !== undefined) {
                if (value === null) {
                    jQuery.removeAttr(elem, name);
                    return;
                }

                if (hooks && "set" in hooks &&
                    (ret = hooks.set(elem, value, name)) !== undefined) {
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
                set: function (elem, value) {
                    if (!support.radioValue && value === "radio" &&
                        nodeName(elem, "input")) {
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

        removeAttr: function (elem, value) {
            var name,
                i = 0,

                // Attribute names can contain non-HTML whitespace characters
                // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
                attrNames = value && value.match(rnothtmlwhite);

            if (attrNames && elem.nodeType === 1) {
                while ((name = attrNames[i++])) {
                    elem.removeAttribute(name);
                }
            }
        }
    });

    // Hooks for boolean attributes
    boolHook = {
        set: function (elem, value, name) {
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
            var ret, handle,
                lowercaseName = name.toLowerCase();

            if (!isXML) {

                // Avoid an infinite loop by temporarily removing this function from the getter
                handle = attrHandle[lowercaseName];
                attrHandle[lowercaseName] = ret;
                ret = getter(elem, name, isXML) != null ?
                    lowercaseName :
                    null;
                attrHandle[lowercaseName] = handle;
            }
            return ret;
        };
    });




    var rfocusable = /^(?:input|select|textarea|button)$/i,
        rclickable = /^(?:a|area)$/i;

    jQuery.fn.extend({
        prop: function (name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
        },

        removeProp: function (name) {
            return this.each(function () {
                delete this[jQuery.propFix[name] || name];
            });
        }
    });

    jQuery.extend({
        prop: function (elem, name, value) {
            var ret, hooks,
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
                if (hooks && "set" in hooks &&
                    (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                }

                return (elem[name] = value);
            }

            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            }

            return elem[name];
        },

        propHooks: {
            tabIndex: {
                get: function (elem) {

                    // Support: IE <=9 - 11 only
                    // elem.tabIndex doesn't always return the
                    // correct value when it hasn't been explicitly set
                    // https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    // Use proper attribute retrieval(#12072)
                    var tabindex = jQuery.find.attr(elem, "tabindex");

                    if (tabindex) {
                        return parseInt(tabindex, 10);
                    }

                    if (
                        rfocusable.test(elem.nodeName) ||
                        rclickable.test(elem.nodeName) &&
                        elem.href
                    ) {
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
            get: function (elem) {

                /* eslint no-unused-expressions: "off" */

                var parent = elem.parentNode;
                if (parent && parent.parentNode) {
                    parent.parentNode.selectedIndex;
                }
                return null;
            },
            set: function (elem) {

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

    jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
    ], function () {
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
        addClass: function (value) {
            var classes, elem, cur, curValue, clazz, j, finalValue,
                i = 0;

            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).addClass(value.call(this, j, getClass(this)));
                });
            }

            if (typeof value === "string" && value) {
                classes = value.match(rnothtmlwhite) || [];

                while ((elem = this[i++])) {
                    curValue = getClass(elem);
                    cur = elem.nodeType === 1 && (" " + stripAndCollapse(curValue) + " ");

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
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

        removeClass: function (value) {
            var classes, elem, cur, curValue, clazz, j, finalValue,
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

                while ((elem = this[i++])) {
                    curValue = getClass(elem);

                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && (" " + stripAndCollapse(curValue) + " ");

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {

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

        toggleClass: function (value, stateVal) {
            var type = typeof value;

            if (typeof stateVal === "boolean" && type === "string") {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    jQuery(this).toggleClass(
                        value.call(this, i, getClass(this), stateVal),
                        stateVal
                    );
                });
            }

            return this.each(function () {
                var className, i, self, classNames;

                if (type === "string") {

                    // Toggle individual class names
                    i = 0;
                    self = jQuery(this);
                    classNames = value.match(rnothtmlwhite) || [];

                    while ((className = classNames[i++])) {

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
                        this.setAttribute("class",
                            className || value === false ?
                            "" :
                            dataPriv.get(this, "__className__") || ""
                        );
                    }
                }
            });
        },

        hasClass: function (selector) {
            var className, elem,
                i = 0;

            className = " " + selector + " ";
            while ((elem = this[i++])) {
                if (elem.nodeType === 1 &&
                    (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
                    return true;
                }
            }

            return false;
        }
    });




    var rreturn = /\r/g;

    jQuery.fn.extend({
        val: function (value) {
            var hooks, ret, isFunction,
                elem = this[0];

            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.type] ||
                        jQuery.valHooks[elem.nodeName.toLowerCase()];

                    if (hooks &&
                        "get" in hooks &&
                        (ret = hooks.get(elem, "value")) !== undefined
                    ) {
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
                get: function (elem) {

                    var val = jQuery.find.attr(elem, "value");
                    return val != null ?
                        val :

                        // Support: IE <=10 - 11 only
                        // option.text throws exceptions (#14686, #14858)
                        // Strip and collapse whitespace
                        // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                        stripAndCollapse(jQuery.text(elem));
                }
            },
            select: {
                get: function (elem) {
                    var value, option, i,
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
                                !option.disabled &&
                                (!option.parentNode.disabled ||
                                    !nodeName(option.parentNode, "optgroup"))) {

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

                set: function (elem, value) {
                    var optionSet, option,
                        options = elem.options,
                        values = jQuery.makeArray(value),
                        i = options.length;

                    while (i--) {
                        option = options[i];

                        /* eslint-disable no-cond-assign */

                        if (option.selected =
                            jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1
                        ) {
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
            set: function (elem, value) {
                if (Array.isArray(value)) {
                    return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1);
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

        trigger: function (event, data, elem, onlyHandlers) {

            var i, cur, tmp, bubbleType, ontype, handle, special,
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
            event = event[jQuery.expando] ?
                event :
                new jQuery.Event(type, typeof event === "object" && event);

            // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.rnamespace = event.namespace ?
                new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                null;

            // Clean up the event in case it is being reused
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data == null ?
                [event] :
                jQuery.makeArray(data, [event]);

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

                event.type = i > 1 ?
                    bubbleType :
                    special.bindType || type;

                // jQuery handler
                handle = (dataPriv.get(cur, "events") || {})[event.type] &&
                    dataPriv.get(cur, "handle");
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

                if ((!special._default ||
                    special._default.apply(eventPath.pop(), data) === false) &&
                    acceptData(elem)) {

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
        simulate: function (type, elem, event) {
            var e = jQuery.extend(
                new jQuery.Event(),
                event,
                {
                    type: type,
                    isSimulated: true
                }
            );

            jQuery.event.trigger(e, null, elem);
        }

    });

    jQuery.fn.extend({

        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function (type, data) {
            var elem = this[0];
            if (elem) {
                return jQuery.event.trigger(type, data, elem, true);
            }
        }
    });


    jQuery.each(("blur focus focusin focusout resize scroll click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup contextmenu").split(" "),
        function (i, name) {

            // Handle event binding
            jQuery.fn[name] = function (data, fn) {
                return arguments.length > 0 ?
                    this.on(name, null, data, fn) :
                    this.trigger(name);
            };
        });

    jQuery.fn.extend({
        hover: function (fnOver, fnOut) {
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
            var handler = function (event) {
                jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
            };

            jQuery.event.special[fix] = {
                setup: function () {
                    var doc = this.ownerDocument || this,
                        attaches = dataPriv.access(doc, fix);

                    if (!attaches) {
                        doc.addEventListener(orig, handler, true);
                    }
                    dataPriv.access(doc, fix, (attaches || 0) + 1);
                },
                teardown: function () {
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

    var rquery = (/\?/);



    // Cross-browser xml parsing
    jQuery.parseXML = function (data) {
        var xml;
        if (!data || typeof data !== "string") {
            return null;
        }

        // Support: IE 9 - 11 only
        // IE throws on parseFromString with invalid input.
        try {
            xml = (new window.DOMParser()).parseFromString(data, "text/xml");
        } catch (e) {
            xml = undefined;
        }

        if (!xml || xml.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + data);
        }
        return xml;
    };


    var
        rbracket = /\[\]$/,
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
                    buildParams(
                        prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
                        v,
                        traditional,
                        add
                    );
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
            add = function (key, valueOrFunction) {

                // If value is a function, invoke it and use its return value
                var value = jQuery.isFunction(valueOrFunction) ?
                    valueOrFunction() :
                    valueOrFunction;

                s[s.length] = encodeURIComponent(key) + "=" +
                    encodeURIComponent(value == null ? "" : value);
            };

        // If an array was passed in, assume that it is an array of form elements.
        if (Array.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {

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
        serialize: function () {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function () {
            return this.map(function () {

                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            })
            .filter(function () {
                var type = this.type;

                // Use .is( ":disabled" ) so that fieldset[disabled] works
                return this.name && !jQuery(this).is(":disabled") &&
                    rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
                    (this.checked || !rcheckableType.test(type));
            })
            .map(function (i, elem) {
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


    var
        r20 = /%20/g,
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
                while ((dataType = dataTypes[i++])) {

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
            seekingTransport = (structure === transports);

        function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport === "string" &&
                    !seekingTransport && !inspected[dataTypeOrTransport]) {

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
        var key, deep,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
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

        var ct, type, finalDataType, firstDataType,
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
        var conv2, current, conv, tmp, prev,
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
                                conv = converters[prev + " " + tmp[0]] ||
                                    converters["* " + tmp[0]];
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
        ajaxSetup: function (target, settings) {
            return settings ?

                // Building a settings object
                ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

                // Extending ajaxSettings
                ajaxExtend(jQuery.ajaxSettings, target);
        },

        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),

        // Main method
        ajax: function (url, options) {

            // If url is an object, simulate pre-1.5 signature
            if (typeof url === "object") {
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
                globalEventContext = s.context &&
                    (callbackContext.nodeType || callbackContext.jquery) ?
                        jQuery(callbackContext) :
                        jQuery.event,

                // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),

                // Status-dependent callbacks
                statusCode = s.statusCode || {},

                // Headers (they are sent all at once)
                requestHeaders = {},
                requestHeadersNames = {},

                // Default abort message
                strAbort = "canceled",

                // Fake xhr
                jqXHR = {
                    readyState: 0,

                    // Builds headers hashtable if needed
                    getResponseHeader: function (key) {
                        var match;
                        if (completed) {
                            if (!responseHeaders) {
                                responseHeaders = {};
                                while ((match = rheaders.exec(responseHeadersString))) {
                                    responseHeaders[match[1].toLowerCase()] = match[2];
                                }
                            }
                            match = responseHeaders[key.toLowerCase()];
                        }
                        return match == null ? null : match;
                    },

                    // Raw string
                    getAllResponseHeaders: function () {
                        return completed ? responseHeadersString : null;
                    },

                    // Caches the header
                    setRequestHeader: function (name, value) {
                        if (completed == null) {
                            name = requestHeadersNames[name.toLowerCase()] =
                                requestHeadersNames[name.toLowerCase()] || name;
                            requestHeaders[name] = value;
                        }
                        return this;
                    },

                    // Overrides response content-type header
                    overrideMimeType: function (type) {
                        if (completed == null) {
                            s.mimeType = type;
                        }
                        return this;
                    },

                    // Status-dependent callbacks
                    statusCode: function (map) {
                        var code;
                        if (map) {
                            if (completed) {

                                // Execute the appropriate callbacks
                                jqXHR.always(map[jqXHR.status]);
                            } else {

                                // Lazy-add the new callbacks in a way that preserves old ones
                                for (code in map) {
                                    statusCode[code] = [statusCode[code], map[code]];
                                }
                            }
                        }
                        return this;
                    },

                    // Cancel the request
                    abort: function (statusText) {
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
            s.url = ((url || s.url || location.href) + "")
                .replace(rprotocol, location.protocol + "//");

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
                    s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
                        urlAnchor.protocol + "//" + urlAnchor.host;
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
                    uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + (nonce++) + uncached;
                }

                // Put hash and anti-cache on the URL that will be requested (gh-1732)
                s.url = cacheURL + uncached;

                // Change '%20' to '+' if this is encoded form body content (gh-2658)
            } else if (s.data && s.processData &&
                (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
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
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
                    s.accepts[s.dataTypes[0]] +
                        (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
                    s.accepts["*"]
            );

            // Check for headers option
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }

            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend &&
                (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {

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
                var isSuccess, success, error, response, modified,
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
                jqXHR.statusCode(statusCode);
                statusCode = undefined;

                if (fireGlobals) {
                    globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError",
                        [jqXHR, s, isSuccess ? success : error]);
                }

                // Complete
                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

                    // Handle the global AJAX counter
                    if (!(--jQuery.active)) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            return jqXHR;
        },

        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },

        getScript: function (url, callback) {
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
        wrapAll: function (html) {
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

        wrapInner: function (html) {
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

        wrap: function (html) {
            var isFunction = jQuery.isFunction(html);

            return this.each(function (i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },

        unwrap: function (selector) {
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
        } catch (e) { }
    };

    var xhrSuccessStatus = {

        // File protocol always yields status code 0, assume 200
        0: 200,

        // Support: IE <=9 only
        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    },
        xhrSupported = jQuery.ajaxSettings.xhr();

    support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
    support.ajax = xhrSupported = !!xhrSupported;

    jQuery.ajaxTransport(function (options) {
        var callback, errorCallback;

        // Cross domain only allowed if supported through XMLHttpRequest
        if (support.cors || xhrSupported && !options.crossDomain) {
            return {
                send: function (headers, complete) {
                    var i,
                        xhr = options.xhr();

                    xhr.open(
                        options.type,
                        options.url,
                        options.async,
                        options.username,
                        options.password
                    );

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
                    callback = function (type) {
                        return function () {
                            if (callback) {
                                callback = errorCallback = xhr.onload =
                                    xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

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
                                            xhr.status,
                                            xhr.statusText
                                        );
                                    }
                                } else {
                                    complete(
                                        xhrSuccessStatus[xhr.status] || xhr.status,
                                        xhr.statusText,

                                        // Support: IE <=9 only
                                        // IE9 has no XHR2 but throws on binary (trac-11426)
                                        // For XHR2 non-text, let the caller handle it (gh-2498)
                                        (xhr.responseType || "text") !== "text" ||
                                        typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
                                        xhr.getAllResponseHeaders()
                                    );
                                }
                            }
                        };
                    };

                    // Listen to events
                    xhr.onload = callback();
                    errorCallback = xhr.onerror = callback("error");

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
                                    if (callback) {
                                        errorCallback();
                                    }
                                });
                            }
                        };
                    }

                    // Create the abort callback
                    callback = callback("abort");

                    try {

                        // Do send the request (this may raise an exception)
                        xhr.send(options.hasContent && options.data || null);
                    } catch (e) {

                        // #14683: Only rethrow if this hasn't been notified as an error yet
                        if (callback) {
                            throw e;
                        }
                    }
                },

                abort: function () {
                    if (callback) {
                        callback();
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
            script: "text/javascript, application/javascript, " +
                "application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function (text) {
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
            var script, callback;
            return {
                send: function (_, complete) {
                    script = jQuery("<script>").prop({
                        charset: s.scriptCharset,
                        src: s.url
                    }).on(
                        "load error",
                        callback = function (evt) {
                            script.remove();
                            callback = null;
                            if (evt) {
                                complete(evt.type === "error" ? 404 : 200, evt.type);
                            }
                        }
                    );

                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    document.head.appendChild(script[0]);
                },
                abort: function () {
                    if (callback) {
                        callback();
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
        jsonpCallback: function () {
            var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
            this[callback] = true;
            return callback;
        }
    });

    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

        var callbackName, overwritten, responseContainer,
            jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ?
                "url" :
                typeof s.data === "string" &&
                    (s.contentType || "")
                        .indexOf("application/x-www-form-urlencoded") === 0 &&
                    rjsonp.test(s.data) && "data"
            );

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (jsonProp || s.dataTypes[0] === "jsonp") {

            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
                s.jsonpCallback() :
                s.jsonpCallback;

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
    support.createHTMLDocument = (function () {
        var body = document.implementation.createHTMLDocument("").body;
        body.innerHTML = "<form></form><form></form>";
        return body.childNodes.length === 2;
    })();


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
        var selector, type, response,
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
        } else if (params && typeof params === "object") {
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
    jQuery.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
    ], function (i, type) {
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
        setOffset: function (elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
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
            calculatePosition = (position === "absolute" || position === "fixed") &&
                (curCSSTop + curCSSLeft).indexOf("auto") > -1;

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
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ("using" in options) {
                options.using.call(elem, props);

            } else {
                curElem.css(props);
            }
        }
    };

    jQuery.fn.extend({
        offset: function (options) {

            // Preserve chaining for setter
            if (arguments.length) {
                return options === undefined ?
                    this :
                    this.each(function (i) {
                        jQuery.offset.setOffset(this, options, i);
                    });
            }

            var doc, docElem, rect, win,
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

        position: function () {
            if (!this[0]) {
                return;
            }

            var offsetParent, offset,
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
        offsetParent: function () {
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
                    win.scrollTo(
                        !top ? val : win.pageXOffset,
                        top ? val : win.pageYOffset
                    );

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
        jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition,
            function (elem, computed) {
                if (computed) {
                    computed = curCSS(elem, prop);

                    // If curCSS returns percentage, fallback to offset
                    return rnumnonpx.test(computed) ?
                        jQuery(elem).position()[prop] + "px" :
                        computed;
                }
            }
        );
    });


    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
        jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name },
            function (defaultExtra, funcName) {

                // Margin is only for outerHeight, outerWidth
                jQuery.fn[funcName] = function (margin, value) {
                    var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                        extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

                    return access(this, function (elem, type, value) {
                        var doc;

                        if (jQuery.isWindow(elem)) {

                            // $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
                            return funcName.indexOf("outer") === 0 ?
                                elem["inner" + name] :
                                elem.document.documentElement["client" + name];
                        }

                        // Get document width or height
                        if (elem.nodeType === 9) {
                            doc = elem.documentElement;

                            // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
                            // whichever is greatest
                            return Math.max(
                                elem.body["scroll" + name], doc["scroll" + name],
                                elem.body["offset" + name], doc["offset" + name],
                                doc["client" + name]
                            );
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

        bind: function (types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function (types, fn) {
            return this.off(types, null, fn);
        },

        delegate: function (selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function (selector, types, fn) {

            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ?
                this.off(selector, "**") :
                this.off(types, selector || "**", fn);
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

    if (typeof define === "function" && define.amd) {
        define("jquery", [], function () {
            return jQuery;
        });
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
/*JQUERY 3.2.1 LIB ENDS*/
/**
*
* @license Guriddo jqGrid JS - v5.3.2 - 2019-01-11
* Copyright(c) 2008, Tony Tomov, tony@trirand.com
* 
* License: http://guriddo.net/?page_id=103334
*/

!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function($){"use strict";function _pivotfilter(a,b){var c,d,e,f=[];if(!this||"function"!=typeof a||a instanceof RegExp)throw new TypeError;for(e=this.length,c=0;c<e;c++)if(this.hasOwnProperty(c)&&(d=this[c],a.call(b,d,c,this))){f.push(d);break}return f}$.jgrid=$.jgrid||{},$.jgrid.hasOwnProperty("defaults")||($.jgrid.defaults={}),$.extend($.jgrid,{version:"5.3.2",htmlDecode:function(a){return a&&("&nbsp;"===a||"&#160;"===a||1===a.length&&160===a.charCodeAt(0))?"":a?String(a).replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,'"').replace(/&amp;/g,"&"):a},htmlEncode:function(a){return a?String(a).replace(/&/g,"&amp;").replace(/\"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):a},template:function(a){var b,c=$.makeArray(arguments).slice(1),d=c.length;return null==a&&(a=""),a.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,function(a,e){if(!isNaN(parseInt(e,10)))return c[parseInt(e,10)];for(b=0;b<d;b++)if($.isArray(c[b]))for(var f=c[b],g=f.length;g--;)if(e===f[g].nm)return f[g].v})},msie:function(){return $.jgrid.msiever()>0},msiever:function(){var a=0,b=window.navigator.userAgent,c=b.indexOf("MSIE");return c>0?a=parseInt(b.substring(c+5,b.indexOf(".",c))):navigator.userAgent.match(/Trident\/7\./)&&(a=11),a},getCellIndex:function(a){var b=$(a);return b.is("tr")?-1:(b=(b.is("td")||b.is("th")?b:b.closest("td,th"))[0],$.jgrid.msie()?$.inArray(b,b.parentNode.cells):b.cellIndex)},stripHtml:function(a){a=String(a);var b=/<("[^"]*"|'[^']*'|[^'">])*>/gi;return a?(a=a.replace(b,""),a&&"&nbsp;"!==a&&"&#160;"!==a?a.replace(/\"/g,"'"):""):a},stripPref:function(a,b){var c=$.type(a);return"string"!==c&&"number"!==c||(a=String(a),b=""!==a?String(b).replace(String(a),""):b),b},useJSON:!0,parse:function(jsonString){var js=jsonString;return"while(1);"===js.substr(0,9)&&(js=js.substr(9)),"/*"===js.substr(0,2)&&(js=js.substr(2,js.length-4)),js||(js="{}"),!0===$.jgrid.useJSON&&"object"==typeof JSON&&"function"==typeof JSON.parse?JSON.parse(js):eval("("+js+")")},parseDate:function(a,b,c,d){var e,f,g,h=/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,i=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,j=/[^-+\dA-Z]/g,k=new RegExp("^/Date\\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\\)/$"),l="string"==typeof b?b.match(k):null,m=function(a,b){for(a=String(a),b=parseInt(b,10)||2;a.length<b;)a="0"+a;return a},n={m:1,d:1,y:1970,h:0,i:0,s:0,u:0},o=0,p=function(a,b){return 0===a?12===b&&(b=0):12!==b&&(b+=12),b},q=0;if(void 0===d&&(d=$.jgrid.getRegional(this,"formatter.date")),void 0===d.parseRe&&(d.parseRe=/[#%\\\/:_;.,\t\s-]/),d.masks.hasOwnProperty(a)&&(a=d.masks[a]),b&&null!=b)if(isNaN(b-0)||"u"!==String(a).toLowerCase())if(b.constructor===Date)o=b;else if(null!==l)o=new Date(parseInt(l[1],10)),l[3]&&(q=60*Number(l[5])+Number(l[6]),q*="-"===l[4]?1:-1,q-=o.getTimezoneOffset(),o.setTime(Number(Number(o)+60*q*1e3)));else{for("ISO8601Long"===d.srcformat&&"Z"===b.charAt(b.length-1)&&(q-=(new Date).getTimezoneOffset()),b=String(b).replace(/\T/g,"#").replace(/\t/,"%").split(d.parseRe),a=a.replace(/\T/g,"#").replace(/\t/,"%").split(d.parseRe),f=0,g=a.length;f<g;f++){switch(a[f]){case"M":e=$.inArray(b[f],d.monthNames),-1!==e&&e<12&&(b[f]=e+1,n.m=b[f]);break;case"F":e=$.inArray(b[f],d.monthNames,12),-1!==e&&e>11&&(b[f]=e+1-12,n.m=b[f]);break;case"n":a[f]="m";break;case"j":a[f]="d";break;case"a":e=$.inArray(b[f],d.AmPm),-1!==e&&e<2&&b[f]===d.AmPm[e]&&(b[f]=e,n.h=p(b[f],n.h));break;case"A":e=$.inArray(b[f],d.AmPm),-1!==e&&e>1&&b[f]===d.AmPm[e]&&(b[f]=e-2,n.h=p(b[f],n.h));break;case"g":n.h=parseInt(b[f],10)}void 0!==b[f]&&(n[a[f].toLowerCase()]=parseInt(b[f],10))}if(n.f&&(n.m=n.f),0===n.m&&0===n.y&&0===n.d)return"&#160;";n.m=parseInt(n.m,10)-1;var r=n.y;r>=70&&r<=99?n.y=1900+n.y:r>=0&&r<=69&&(n.y=2e3+n.y),o=new Date(n.y,n.m,n.d,n.h,n.i,n.s,n.u),0!==q&&o.setTime(Number(Number(o)+60*q*1e3))}else o=new Date(1e3*parseFloat(b));else o=new Date(n.y,n.m,n.d,n.h,n.i,n.s,n.u);if(d.userLocalTime&&0===q&&0!==(q-=(new Date).getTimezoneOffset())&&o.setTime(Number(Number(o)+60*q*1e3)),void 0===c)return o;d.masks.hasOwnProperty(c)?c=d.masks[c]:c||(c="Y-m-d");var s=o.getHours(),t=o.getMinutes(),u=o.getDate(),v=o.getMonth()+1,w=o.getTimezoneOffset(),x=o.getSeconds(),y=o.getMilliseconds(),z=o.getDay(),A=o.getFullYear(),B=(z+6)%7+1,C=(new Date(A,v-1,u)-new Date(A,0,1))/864e5,D={d:m(u),D:d.dayNames[z],j:u,l:d.dayNames[z+7],N:B,S:d.S(u),w:z,z:C,W:B<5?Math.floor((C+B-1)/7)+1:Math.floor((C+B-1)/7)||((new Date(A-1,0,1).getDay()+6)%7<4?53:52),F:d.monthNames[v-1+12],m:m(v),M:d.monthNames[v-1],n:v,t:"?",L:"?",o:"?",Y:A,y:String(A).substring(2),a:s<12?d.AmPm[0]:d.AmPm[1],A:s<12?d.AmPm[2]:d.AmPm[3],B:"?",g:s%12||12,G:s,h:m(s%12||12),H:m(s),i:m(t),s:m(x),u:y,e:"?",I:"?",O:(w>0?"-":"+")+m(100*Math.floor(Math.abs(w)/60)+Math.abs(w)%60,4),P:"?",T:(String(o).match(i)||[""]).pop().replace(j,""),Z:"?",c:"?",r:"?",U:Math.floor(o/1e3)};return c.replace(h,function(a){return D.hasOwnProperty(a)?D[a]:a.substring(1)})},jqID:function(a){return String(a).replace(/[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g,"\\$&")},guid:1,uidPref:"jqg",randId:function(a){return(a||$.jgrid.uidPref)+$.jgrid.guid++},getAccessor:function(a,b){var c,d,e,f=[];if("function"==typeof b)return b(a);if(void 0===(c=a[b]))try{if("string"==typeof b&&(f=b.split(".")),e=f.length)for(c=a;c&&e--;)d=f.shift(),c=c[d]}catch(a){}return c},getXmlData:function(a,b,c){var d,e="string"==typeof b?b.match(/^(.*)\[(\w+)\]$/):null;return"function"==typeof b?b(a):e&&e[2]?e[1]?$(e[1],a).attr(e[2]):$(a).attr(e[2]):(d=$(b,a),c?d:d.length>0?$(d).text():void 0)},cellWidth:function(){var a=$("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable ui-common-table' style='width:5px;'><tr class='jqgrow'><td style='width:5px;display:block;'></td></tr></table></div>"),b=a.appendTo("body").find("td").width();return a.remove(),Math.abs(b-5)>.1},isLocalStorage:function(){try{return"localStorage"in window&&null!==window.localStorage}catch(a){return!1}},getRegional:function(a,b,c){var d;return void 0!==c?c:(a.p&&a.p.regional&&$.jgrid.regional&&(d=$.jgrid.getAccessor($.jgrid.regional[a.p.regional]||{},b)),void 0===d&&(d=$.jgrid.getAccessor($.jgrid,b)),d)},isMobile:function(){try{return!!/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent)}catch(a){return!1}},cell_width:!0,scrollbarWidth:function(){var a=$('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');$("body").append(a);var b=$("div",a).innerWidth();a.css("overflow-y","scroll");var c=$("div",a).innerWidth();return $(a).remove(),b-c<0?18:b-c},ajaxOptions:{},from:function(source){var $t=this,QueryObject=function(d,q){"string"==typeof d&&(d=$.data(d));var self=this,_data=d,_usecase=!0,_trim=!1,_query=q,_stripNum=/[\$,%]/g,_lastCommand=null,_lastField=null,_orDepth=0,_negate=!1,_queuedOperator="",_sorting=[],_useProperties=!0;if("object"!=typeof d||!d.push)throw"data provides is not an array";return d.length>0&&(_useProperties="object"==typeof d[0]),this._hasData=function(){return null!==_data&&0!==_data.length},this._getStr=function(a){var b=[];return _trim&&b.push("jQuery.trim("),b.push("String("+a+")"),_trim&&b.push(")"),_usecase||b.push(".toLowerCase()"),b.join("")},this._strComp=function(a){return"string"==typeof a?".toString()":""},this._group=function(a,b){return{field:a.toString(),unique:b,items:[]}},this._toStr=function(a){return _trim&&(a=$.trim(a)),a=a.toString().replace(/\\/g,"\\\\").replace(/\"/g,'\\"'),_usecase?a:a.toLowerCase()},this._funcLoop=function(a){var b=[];return $.each(_data,function(c,d){b.push(a(d))}),b},this._append=function(a){var b;for(null===_query?_query="":_query+=""===_queuedOperator?" && ":_queuedOperator,b=0;b<_orDepth;b++)_query+="(";_negate&&(_query+="!"),_query+="("+a+")",_negate=!1,_queuedOperator="",_orDepth=0},this._setCommand=function(a,b){_lastCommand=a,_lastField=b},this._resetNegate=function(){_negate=!1},this._repeatCommand=function(a,b){return null===_lastCommand?self:null!==a&&null!==b?_lastCommand(a,b):null===_lastField?_lastCommand(a):_useProperties?_lastCommand(_lastField,a):_lastCommand(a)},this._equals=function(a,b){return 0===self._compare(a,b,1)},this._compare=function(a,b,c){var d=Object.prototype.toString;return void 0===c&&(c=1),void 0===a&&(a=null),void 0===b&&(b=null),null===a&&null===b?0:null===a&&null!==b?1:null!==a&&null===b?-1:"[object Date]"===d.call(a)&&"[object Date]"===d.call(b)?a<b?-c:a>b?c:0:(_usecase||"number"==typeof a||"number"==typeof b||(a=String(a),b=String(b)),a<b?-c:a>b?c:0)},this._performSort=function(){0!==_sorting.length&&(_data=self._doSort(_data,0))},this._doSort=function(a,b){var c=_sorting[b].by,d=_sorting[b].dir,e=_sorting[b].type,f=_sorting[b].datefmt,g=_sorting[b].sfunc;if(b===_sorting.length-1)return self._getOrder(a,c,d,e,f,g);b++;var h,i,j,k=self._getGroup(a,c,d,e,f),l=[];for(h=0;h<k.length;h++)for(j=self._doSort(k[h].items,b),i=0;i<j.length;i++)l.push(j[i]);return l},this._getOrder=function(a,b,c,d,e,f){var g,h,i,j,k=[],l=[],m="a"===c?1:-1;void 0===d&&(d="text"),j="float"===d||"number"===d||"currency"===d||"numeric"===d?function(a){var b=parseFloat(String(a).replace(_stripNum,""));return isNaN(b)?Number.NEGATIVE_INFINITY:b}:"int"===d||"integer"===d?function(a){return a?parseFloat(String(a).replace(_stripNum,"")):Number.NEGATIVE_INFINITY}:"date"===d||"datetime"===d?function(a){return $.jgrid.parseDate.call($t,e,a).getTime()}:$.isFunction(d)?d:function(a){return a=a?$.trim(String(a)):"",_usecase?a:a.toLowerCase()},$.each(a,function(a,c){h=""!==b?$.jgrid.getAccessor(c,b):c,void 0===h&&(h=""),h=j(h,c),l.push({vSort:h,index:a})}),$.isFunction(f)?l.sort(function(a,b){return f.call(this,a.vSort,b.vSort,m,a,b)}):l.sort(function(a,b){return self._compare(a.vSort,b.vSort,m)}),i=0;for(var n=a.length;i<n;)g=l[i].index,k.push(a[g]),i++;return k},this._getGroup=function(a,b,c,d,e){var f,g=[],h=null,i=null;return $.each(self._getOrder(a,b,c,d,e),function(a,c){f=$.jgrid.getAccessor(c,b),null==f&&(f=""),self._equals(i,f)||(i=f,null!==h&&g.push(h),h=self._group(b,f)),h.items.push(c)}),null!==h&&g.push(h),g},this.ignoreCase=function(){return _usecase=!1,self},this.useCase=function(){return _usecase=!0,self},this.trim=function(){return _trim=!0,self},this.noTrim=function(){return _trim=!1,self},this.execute=function(){var match=_query,results=[];return null===match?self:($.each(_data,function(){eval(match)&&results.push(this)}),_data=results,self)},this.data=function(){return _data},this.select=function(a){if(self._performSort(),!self._hasData())return[];if(self.execute(),$.isFunction(a)){var b=[];return $.each(_data,function(c,d){b.push(a(d))}),b}return _data},this.hasMatch=function(){return!!self._hasData()&&(self.execute(),_data.length>0)},this.andNot=function(a,b,c){return _negate=!_negate,self.and(a,b,c)},this.orNot=function(a,b,c){return _negate=!_negate,self.or(a,b,c)},this.not=function(a,b,c){return self.andNot(a,b,c)},this.and=function(a,b,c){return _queuedOperator=" && ",void 0===a?self:self._repeatCommand(a,b,c)},this.or=function(a,b,c){return _queuedOperator=" || ",void 0===a?self:self._repeatCommand(a,b,c)},this.orBegin=function(){return _orDepth++,self},this.orEnd=function(){return null!==_query&&(_query+=")"),self},this.isNot=function(a){return _negate=!_negate,self.is(a)},this.is=function(a){return self._append("this."+a),self._resetNegate(),self},this._compareValues=function(a,b,c,d,e){var f;f=_useProperties?"jQuery.jgrid.getAccessor(this,'"+b+"')":"this",void 0===c&&(c=null);var g=c,h=void 0===e.stype?"text":e.stype;if(null!==c)switch(h){case"int":case"integer":g=isNaN(Number(g))||""===g?Number.NEGATIVE_INFINITY:g,f="parseInt("+f+",10)",g="parseInt("+g+",10)";break;case"float":case"number":case"numeric":g=String(g).replace(_stripNum,""),g=isNaN(Number(g))||""===g?Number.NEGATIVE_INFINITY:Number(g),f="parseFloat("+f+")",g="parseFloat("+g+")";break;case"date":case"datetime":g=String($.jgrid.parseDate.call($t,e.srcfmt||"Y-m-d",g).getTime()),f='jQuery.jgrid.parseDate.call(jQuery("#'+$.jgrid.jqID($t.p.id)+'")[0],"'+e.srcfmt+'",'+f+").getTime()";break;default:f=self._getStr(f),g=self._getStr('"'+self._toStr(g)+'"')}return self._append(f+" "+d+" "+g),self._setCommand(a,b),self._resetNegate(),self},this.equals=function(a,b,c){return self._compareValues(self.equals,a,b,"==",c)},this.notEquals=function(a,b,c){return self._compareValues(self.equals,a,b,"!==",c)},this.isNull=function(a,b,c){return self._compareValues(self.equals,a,null,"===",c)},this.greater=function(a,b,c){return self._compareValues(self.greater,a,b,">",c)},this.less=function(a,b,c){return self._compareValues(self.less,a,b,"<",c)},this.greaterOrEquals=function(a,b,c){return self._compareValues(self.greaterOrEquals,a,b,">=",c)},this.lessOrEquals=function(a,b,c){return self._compareValues(self.lessOrEquals,a,b,"<=",c)},this.startsWith=function(a,b){var c=null==b?a:b,d=_trim?$.trim(c.toString()).length:c.toString().length;return _useProperties?self._append(self._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+".substr(0,"+d+") == "+self._getStr('"'+self._toStr(b)+'"')):(null!=b&&(d=_trim?$.trim(b.toString()).length:b.toString().length),self._append(self._getStr("this")+".substr(0,"+d+") == "+self._getStr('"'+self._toStr(a)+'"'))),self._setCommand(self.startsWith,a),self._resetNegate(),self},this.endsWith=function(a,b){var c=null==b?a:b,d=_trim?$.trim(c.toString()).length:c.toString().length;return _useProperties?self._append(self._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+".substr("+self._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+".length-"+d+","+d+') == "'+self._toStr(b)+'"'):self._append(self._getStr("this")+".substr("+self._getStr("this")+'.length-"'+self._toStr(a)+'".length,"'+self._toStr(a)+'".length) == "'+self._toStr(a)+'"'),self._setCommand(self.endsWith,a),self._resetNegate(),self},this.contains=function(a,b){return _useProperties?self._append(self._getStr("jQuery.jgrid.getAccessor(this,'"+a+"')")+'.indexOf("'+self._toStr(b)+'",0) > -1'):self._append(self._getStr("this")+'.indexOf("'+self._toStr(a)+'",0) > -1'),self._setCommand(self.contains,a),self._resetNegate(),self},this.groupBy=function(a,b,c,d){return self._hasData()?self._getGroup(_data,a,b,c,d):null},this.orderBy=function(a,b,c,d,e){return b=null==b?"a":$.trim(b.toString().toLowerCase()),null==c&&(c="text"),null==d&&(d="Y-m-d"),null==e&&(e=!1),"desc"!==b&&"descending"!==b||(b="d"),"asc"!==b&&"ascending"!==b||(b="a"),_sorting.push({by:a,dir:b,type:c,datefmt:d,sfunc:e}),self},self};return new QueryObject(source,null)},getMethod:function(a){return this.getAccessor($.fn.jqGrid,a)},extend:function(a){$.extend($.fn.jqGrid,a),this.no_legacy_api||$.fn.extend(a)},clearBeforeUnload:function(a){var b,c=$("#"+$.jgrid.jqID(a))[0];if(c.grid){b=c.grid,$.isFunction(b.emptyRows)&&b.emptyRows.call(c,!0,!0),$(document).off("mouseup.jqGrid"+c.p.id),$(b.hDiv).off("mousemove"),$(c).off();var d,e=b.headers.length,f=["formatCol","sortData","updatepager","refreshIndex","setHeadCheckBox","constructTr","formatter","addXmlData","addJSONData","grid","p","addLocalData"];for(d=0;d<e;d++)b.headers[d].el=null;for(d in b)b.hasOwnProperty(d)&&(b[d]=null);for(d in c.p)c.p.hasOwnProperty(d)&&(c.p[d]=$.isArray(c.p[d])?[]:null);for(e=f.length,d=0;d<e;d++)c.hasOwnProperty(f[d])&&(c[f[d]]=null,delete c[f[d]])}},gridUnload:function(a){if(a){a=$.trim(a),0===a.indexOf("#")&&(a=a.substring(1));var b=$("#"+$.jgrid.jqID(a))[0];if(b.grid){var c={id:$(b).attr("id"),cl:$(b).attr("class")};b.p.pager&&$(b.p.pager).off().empty().removeClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");var d=document.createElement("table");d.className=c.cl;var e=$.jgrid.jqID(b.id);$(d).removeClass("ui-jqgrid-btable ui-common-table").insertBefore("#gbox_"+e),1===$(b.p.pager).parents("#gbox_"+e).length&&$(b.p.pager).insertBefore("#gbox_"+e),$.jgrid.clearBeforeUnload(a),$("#gbox_"+e).remove(),$(d).attr({id:c.id}),$("#alertmod_"+$.jgrid.jqID(a)).remove()}}},gridDestroy:function(a){if(a){a=$.trim(a),0===a.indexOf("#")&&(a=a.substring(1));var b=$("#"+$.jgrid.jqID(a))[0];if(b.grid){b.p.pager&&$(b.p.pager).remove();try{$.jgrid.clearBeforeUnload(a),$("#gbox_"+$.jgrid.jqID(a)).remove()}catch(a){}}}},isElementInViewport:function(a){var b=a.getBoundingClientRect();return b.left>=0&&b.right<=(window.innerWidth||document.documentElement.clientWidth)},getTextWidth:function(a,b){if(!jQuery._cacheCanvas){var c=document.createElement("canvas");document.createDocumentFragment().appendChild(c),jQuery._cacheCanvas=c.getContext("2d"),b&&(jQuery._cacheCanvas.font=b)}return jQuery._cacheCanvas.measureText($.jgrid.stripHtml(a)).width},getFont:function(a){var b=window.getComputedStyle(a,null);return b.getPropertyValue("font-style")+" "+b.getPropertyValue("font-size")+b.getPropertyValue("font-family")},styleUI:{jQueryUI:{common:{disabled:"ui-state-disabled",highlight:"ui-state-highlight",hover:"ui-state-hover",cornerall:"ui-corner-all",cornertop:"ui-corner-top",cornerbottom:"ui-corner-bottom",hidden:"ui-helper-hidden",icon_base:"ui-icon",overlay:"ui-widget-overlay",active:"ui-state-active",error:"ui-state-error",button:"ui-state-default ui-corner-all",content:"ui-widget-content"},base:{entrieBox:"ui-widget ui-widget-content ui-corner-all",viewBox:"",headerTable:"",headerBox:"ui-state-default",rowTable:"",rowBox:"ui-widget-content",stripedTable:"ui-jqgrid-table-striped",footerTable:"",footerBox:"ui-widget-content",headerDiv:"ui-state-default",gridtitleBox:"ui-widget-header ui-corner-top ui-helper-clearfix",customtoolbarBox:"ui-state-default",loadingBox:"ui-state-default ui-state-active",rownumBox:"ui-state-default",scrollBox:"ui-widget-content",multiBox:"",pagerBox:"ui-state-default ui-corner-bottom",pagerTable:"",toppagerBox:"ui-state-default",pgInput:"ui-corner-all",pgSelectBox:"ui-widget-content ui-corner-all",pgButtonBox:"ui-corner-all",icon_first:"ui-icon-seek-first",icon_prev:"ui-icon-seek-prev",icon_next:"ui-icon-seek-next",icon_end:"ui-icon-seek-end",icon_asc:"ui-icon-triangle-1-n",icon_desc:"ui-icon-triangle-1-s",icon_caption_open:"ui-icon-circle-triangle-n",icon_caption_close:"ui-icon-circle-triangle-s"},modal:{modal:"ui-widget ui-widget-content ui-corner-all ui-dialog",header:"ui-widget-header ui-corner-all ui-helper-clearfix",content:"ui-widget-content",resizable:"ui-resizable-handle ui-resizable-se",icon_close:"ui-icon-closethick",icon_resizable:"ui-icon-gripsmall-diagonal-se"},celledit:{inputClass:"ui-widget-content ui-corner-all"},inlinedit:{inputClass:"ui-widget-content ui-corner-all",icon_edit_nav:"ui-icon-pencil",icon_add_nav:"ui-icon-plus",icon_save_nav:"ui-icon-disk",icon_cancel_nav:"ui-icon-cancel"},formedit:{inputClass:"ui-widget-content ui-corner-all",icon_prev:"ui-icon-triangle-1-w",icon_next:"ui-icon-triangle-1-e",icon_save:"ui-icon-disk",icon_close:"ui-icon-close",icon_del:"ui-icon-scissors",icon_cancel:"ui-icon-cancel"},navigator:{icon_edit_nav:"ui-icon-pencil",icon_add_nav:"ui-icon-plus",icon_del_nav:"ui-icon-trash",icon_search_nav:"ui-icon-search",icon_refresh_nav:"ui-icon-refresh",icon_view_nav:"ui-icon-document",icon_newbutton_nav:"ui-icon-newwin"},grouping:{icon_plus:"ui-icon-circlesmall-plus",icon_minus:"ui-icon-circlesmall-minus"},filter:{table_widget:"ui-widget ui-widget-content",srSelect:"ui-widget-content ui-corner-all",srInput:"ui-widget-content ui-corner-all",menu_widget:"ui-widget ui-widget-content ui-corner-all",icon_search:"ui-icon-search",icon_reset:"ui-icon-arrowreturnthick-1-w",icon_query:"ui-icon-comment"},subgrid:{icon_plus:"ui-icon-plus",icon_minus:"ui-icon-minus",icon_open:"ui-icon-carat-1-sw"},treegrid:{icon_plus:"ui-icon-triangle-1-",icon_minus:"ui-icon-triangle-1-s",icon_leaf:"ui-icon-radio-off"},fmatter:{icon_edit:"ui-icon-pencil",icon_add:"ui-icon-plus",icon_save:"ui-icon-disk",icon_cancel:"ui-icon-cancel",icon_del:"ui-icon-trash"},colmenu:{menu_widget:"ui-widget ui-widget-content ui-corner-all",input_checkbox:"ui-widget ui-widget-content",filter_select:"ui-widget-content ui-corner-all",filter_input:"ui-widget-content ui-corner-all",icon_menu:"ui-icon-comment",icon_sort_asc:"ui-icon-arrow-1-n",icon_sort_desc:"ui-icon-arrow-1-s",icon_columns:"ui-icon-extlink",icon_filter:"ui-icon-calculator",icon_group:"ui-icon-grip-solid-horizontal",icon_freeze:"ui-icon-grip-solid-vertical",icon_move:"ui-icon-arrow-4",icon_new_item:"ui-icon-newwin",icon_toolbar_menu:"ui-icon-document"}},Bootstrap:{common:{disabled:"ui-disabled",highlight:"success",hover:"active",cornerall:"",cornertop:"",cornerbottom:"",hidden:"",icon_base:"glyphicon",overlay:"ui-overlay",active:"active",error:"bg-danger",button:"btn btn-default",content:""},base:{entrieBox:"",viewBox:"table-responsive",headerTable:"table table-bordered",headerBox:"",rowTable:"table table-bordered",rowBox:"",stripedTable:"table-striped",footerTable:"table table-bordered",footerBox:"",headerDiv:"",gridtitleBox:"",customtoolbarBox:"",loadingBox:"row",rownumBox:"active",scrollBox:"",multiBox:"checkbox",pagerBox:"",pagerTable:"table",toppagerBox:"",pgInput:"form-control",pgSelectBox:"form-control",pgButtonBox:"",icon_first:"glyphicon-step-backward",icon_prev:"glyphicon-backward",icon_next:"glyphicon-forward",icon_end:"glyphicon-step-forward",icon_asc:"glyphicon-triangle-top",icon_desc:"glyphicon-triangle-bottom",icon_caption_open:"glyphicon-circle-arrow-up",icon_caption_close:"glyphicon-circle-arrow-down"},modal:{modal:"modal-content",header:"modal-header",title:"modal-title",content:"modal-body",resizable:"ui-resizable-handle ui-resizable-se",icon_close:"glyphicon-remove-circle",icon_resizable:"glyphicon-import"},celledit:{inputClass:"form-control"},inlinedit:{inputClass:"form-control",icon_edit_nav:"glyphicon-edit",icon_add_nav:"glyphicon-plus",icon_save_nav:"glyphicon-save",icon_cancel_nav:"glyphicon-remove-circle"},formedit:{inputClass:"form-control",icon_prev:"glyphicon-step-backward",icon_next:"glyphicon-step-forward",icon_save:"glyphicon-save",icon_close:"glyphicon-remove-circle",icon_del:"glyphicon-trash",icon_cancel:"glyphicon-remove-circle"},navigator:{icon_edit_nav:"glyphicon-edit",icon_add_nav:"glyphicon-plus",icon_del_nav:"glyphicon-trash",icon_search_nav:"glyphicon-search",icon_refresh_nav:"glyphicon-refresh",icon_view_nav:"glyphicon-info-sign",icon_newbutton_nav:"glyphicon-new-window"},grouping:{icon_plus:"glyphicon-triangle-right",icon_minus:"glyphicon-triangle-bottom"},filter:{table_widget:"table table-condensed",srSelect:"form-control",srInput:"form-control",menu_widget:"",icon_search:"glyphicon-search",icon_reset:"glyphicon-refresh",icon_query:"glyphicon-comment"},subgrid:{icon_plus:"glyphicon-triangle-right",icon_minus:"glyphicon-triangle-bottom",icon_open:"glyphicon-indent-left"},treegrid:{icon_plus:"glyphicon-triangle-right",icon_minus:"glyphicon-triangle-bottom",icon_leaf:"glyphicon-unchecked"},fmatter:{icon_edit:"glyphicon-edit",icon_add:"glyphicon-plus",icon_save:"glyphicon-save",icon_cancel:"glyphicon-remove-circle",icon_del:"glyphicon-trash"},colmenu:{menu_widget:"",input_checkbox:"",filter_select:"form-control",filter_input:"form-control",icon_menu:"glyphicon-menu-hamburger",icon_sort_asc:"glyphicon-sort-by-alphabet",icon_sort_desc:"glyphicon-sort-by-alphabet-alt",icon_columns:"glyphicon-list-alt",icon_filter:"glyphicon-filter",icon_group:"glyphicon-align-left",icon_freeze:"glyphicon-object-align-horizontal",icon_move:"glyphicon-move",icon_new_item:"glyphicon-new-window",icon_toolbar_menu:"glyphicon-menu-hamburger"}},Bootstrap4:{common:{disabled:"ui-disabled",highlight:"table-success",hover:"table-active",cornerall:"",cornertop:"",cornerbottom:"",hidden:"",overlay:"ui-overlay",active:"active",error:"alert-danger",button:"btn btn-light",content:""},base:{entrieBox:"",viewBox:"table-responsive",headerTable:"table table-bordered",headerBox:"",rowTable:"table table-bordered",rowBox:"",stripedTable:"table-striped",footerTable:"table table-bordered",footerBox:"",headerDiv:"",gridtitleBox:"",customtoolbarBox:"",loadingBox:"row",rownumBox:"active",scrollBox:"",multiBox:"checkbox",pagerBox:"",pagerTable:"table",toppagerBox:"",pgInput:"form-control",pgSelectBox:"form-control",pgButtonBox:""},modal:{modal:"modal-content",header:"modal-header",title:"modal-title",content:"modal-body",resizable:"ui-resizable-handle ui-resizable-se",icon_close:"oi-circle-x",icon_resizable:"oi-circle-x"},celledit:{inputClass:"form-control"},inlinedit:{inputClass:"form-control"},formedit:{inputClass:"form-control"},navigator:{},grouping:{},filter:{table_widget:"table table-condensed",srSelect:"form-control",srInput:"form-control",menu_widget:""},subgrid:{},treegrid:{},fmatter:{},colmenu:{menu_widget:"",input_checkbox:"",filter_select:"form-control",filter_input:"form-control"}}},iconSet:{Iconic:{common:{icon_base:"oi"},base:{icon_first:"oi-media-step-backward",icon_prev:"oi-caret-left",icon_next:"oi-caret-right",icon_end:"oi-media-step-forward",icon_asc:"oi-caret-top",icon_desc:"oi-caret-bottom",icon_caption_open:"oi-collapse-up",icon_caption_close:"oi-expand-down"},modal:{icon_close:"oi-circle-x",icon_resizable:"oi-plus"},inlinedit:{icon_edit_nav:"oi-pencil",icon_add_nav:"oi-plus",icon_save_nav:"oi-check",icon_cancel_nav:"oi-action-undo"},formedit:{icon_prev:"oi-chevron-left",icon_next:"oi-chevron-right",icon_save:"oi-check",icon_close:"oi-ban",icon_del:"oi-delete",icon_cancel:"oi-ban"},navigator:{icon_edit_nav:"oi-pencil",icon_add_nav:"oi-plus",icon_del_nav:"oi-trash",icon_search_nav:"oi-zoom-in",icon_refresh_nav:"oi-reload",icon_view_nav:"oi-browser",icon_newbutton_nav:"oi-book"},grouping:{icon_plus:"oi-caret-right",icon_minus:"oi-caret-bottom"},filter:{icon_search:"oi-magnifying-glass",icon_reset:"oi-reload",icon_query:"oi-comment-square"},subgrid:{icon_plus:"oi-chevron-right",icon_minus:"oi-chevron-bottom",icon_open:"oi-expand-left"},treegrid:{icon_plus:"oi-plus",icon_minus:"oi-minus",icon_leaf:"oi-media-record"},fmatter:{icon_edit:"oi-pencil",icon_add:"oi-plus",icon_save:"oi-check",icon_cancel:"oi-action-undo",icon_del:"oi-trash"},colmenu:{icon_menu:"oi-list",icon_sort_asc:"oi-sort-ascending",icon_sort_desc:"oi-sort-descending",icon_columns:"oi-project",icon_filter:"oi-magnifying-glass",icon_group:"oi-list-rich",icon_freeze:"oi-spreadsheet",icon_move:"oi-move",icon_new_item:"oi-external-link",icon_toolbar_menu:"oi-menu"}},Octicons:{common:{icon_base:"octicon"},base:{icon_first:"octicon-triangle-left",icon_prev:"octicon-chevron-left",icon_next:"octicon-chevron-right",icon_end:"octicon-triangle-right",icon_asc:"octicon-triangle-up",icon_desc:"octicon-triangle-down",icon_caption_open:"octicon-triangle-up",icon_caption_close:"octicon-triangle-down"},modal:{icon_close:"octicon-x",icon_resizable:"octicon-plus"},inlinedit:{icon_edit_nav:"octicon-pencil",icon_add_nav:"octicon-plus",icon_save_nav:"octicon-check",icon_cancel_nav:"octicon-circle-slash"},formedit:{icon_prev:"octicon-chevron-left",icon_next:"octicon-chevron-right",icon_save:"octicon-check",icon_close:"octicon-x",icon_del:"octicon-trashcan",icon_cancel:"octicon-circle-slash"},navigator:{icon_edit_nav:"octicon-pencil",icon_add_nav:"octicon-plus",icon_del_nav:"octicon-trashcan",icon_search_nav:"octicon-search",icon_refresh_nav:"octicon-sync",icon_view_nav:"octicon-file",icon_newbutton_nav:"octicon-link-external"},grouping:{icon_plus:"octicon-triangle-right",icon_minus:"octicon-triangle-down"},filter:{icon_search:"octicon-search",icon_reset:"octicon-sync",icon_query:"octicon-file-code"},subgrid:{icon_plus:"octicon-triangle-right",icon_minus:"octicon-triangle-down",icon_open:"octicon-git-merge"},treegrid:{icon_plus:"octicon-triangle-right",icon_minus:"octicon-triangle-down",icon_leaf:"octicon-primitive-dot"},fmatter:{icon_edit:"octicon-pencil",icon_add:"octicon-plus",icon_save:"octicon-check",icon_cancel:"octicon-circle-slash",icon_del:"octicon-trashcan"},colmenu:{icon_menu:"octicon-grabber",icon_sort_asc:"octicon-arrow-down",icon_sort_desc:"octicon-arrow-up",icon_columns:"octicon-repo",icon_filter:"octicon-search",icon_group:"octicon-list-unordered",icon_freeze:"octicon-repo",icon_move:"octicon-git-compare",icon_new_item:"octicon-link-external",icon_toolbar_menu:"octicon-three-bars"}},fontAwesome:{common:{icon_base:"fas"},base:{icon_first:"fa-step-backward",icon_prev:"fa-backward",icon_next:"fa-forward",icon_end:"fa-step-forward",icon_asc:"fa-caret-up",icon_desc:"fa-caret-down",icon_caption_open:"fa-caret-square-up",icon_caption_close:"fa-caret-square-down "},modal:{icon_close:"fa-window-close",icon_resizable:"fa-plus"},inlinedit:{icon_edit_nav:"fa-edit",icon_add_nav:"fa-plus",icon_save_nav:"fa-save",icon_cancel_nav:"fa-replay"},formedit:{icon_prev:"fa-chevron-left",icon_next:"fa-chevron-right",icon_save:"fa-save",icon_close:"fa-window-close",icon_del:"fa-trash",icon_cancel:"fa-times"},navigator:{icon_edit_nav:"fa-edit",icon_add_nav:"fa-plus",icon_del_nav:"fa-trash",icon_search_nav:"fa-search",icon_refresh_nav:"fa-sync",icon_view_nav:"fa-sticky-note",icon_newbutton_nav:"fa-external-link-alt"},grouping:{icon_plus:"fa-caret-right",icon_minus:"fa-caret-down"},filter:{icon_search:"fa-search",icon_reset:"fa-reply",icon_query:"fa-pen-square "},subgrid:{icon_plus:"fa-arrow-circle-right",icon_minus:"fa-arrow-circle-down",icon_open:"fa-ellipsis-v"},treegrid:{icon_plus:"fa-plus",icon_minus:"fa-minus",icon_leaf:"fa-circle"},fmatter:{icon_edit:"fa-edit",icon_add:"fa-plus",icon_save:"fa-save",icon_cancel:"fa-undo",icon_del:"fa-trash"},colmenu:{icon_menu:"fa-ellipsis-v",icon_sort_asc:"fa-sort-amount-down",icon_sort_desc:"fa-sort-amount-up",icon_columns:"fa-columns",icon_filter:"fa-filter",icon_group:"fa-object-group",icon_freeze:"fa-snowflake",icon_move:"fa-expand-arrows-alt",icon_new_item:"fa-external-link-alt",icon_toolbar_menu:"fa-list"}}}}),$.fn.jqGrid=function(a){if("string"==typeof a){var b=$.jgrid.getMethod(a);if(!b)throw"jqGrid - No such method: "+a;var c=$.makeArray(arguments).slice(1);return b.apply(this,c)}return this.each(function(){function b(a,b,c,d){if(e.p.multiselect&&e.p.multiboxonly||e.p.multimail)if(b)$(e).jqGrid("setSelection",a,d,c);else if(e.p.multiboxonly&&e.p.multimail)$(e).triggerHandler("jqGridSelectRow",[a,!1,c]),e.p.onSelectRow&&e.p.onSelectRow.call(e,a,!1,c);else{var f=e.p.frozenColumns?e.p.id+"_frozen":"";$(e.p.selarrrow).each(function(a,b){var c=$(e).jqGrid("getGridRowById",b);c&&$(c).removeClass(p),$("#jqg_"+$.jgrid.jqID(e.p.id)+"_"+$.jgrid.jqID(b))[e.p.useProp?"prop":"attr"]("checked",!1),f&&($("#"+$.jgrid.jqID(b),"#"+$.jgrid.jqID(f)).removeClass(p),$("#jqg_"+$.jgrid.jqID(e.p.id)+"_"+$.jgrid.jqID(b),"#"+$.jgrid.jqID(f))[e.p.useProp?"prop":"attr"]("checked",!1))}),e.p.selarrrow=[],$(e).jqGrid("setSelection",a,d,c)}else $(e).jqGrid("setSelection",a,d,c)}if(!this.grid){var c;null!=a&&void 0!==a.data&&(c=a.data,a.data=[]);var d=$.extend(!0,{url:"",height:150,page:1,rowNum:20,rowTotal:null,records:0,pager:"",pgbuttons:!0,pginput:!0,colModel:[],rowList:[],colNames:[],sortorder:"asc",sortname:"",datatype:"xml",mtype:"GET",altRows:!1,selarrrow:[],preserveSelection:!1,savedRow:[],shrinkToFit:!0,xmlReader:{},jsonReader:{},subGrid:!1,subGridModel:[],reccount:0,lastpage:0,lastsort:0,selrow:null,beforeSelectRow:null,onSelectRow:null,onSortCol:null,ondblClickRow:null,onRightClickRow:null,onPaging:null,onSelectAll:null,onInitGrid:null,loadComplete:null,gridComplete:null,loadError:null,loadBeforeSend:null,afterInsertRow:null,beforeRequest:null,beforeProcessing:null,onHeaderClick:null,viewrecords:!1,loadonce:!1,multiselect:!1,multikey:!1,multiboxonly:!1,multimail:!1,multiselectWidth:30,editurl:null,search:!1,caption:"",hidegrid:!0,hiddengrid:!1,postData:{},userData:{},treeGrid:!1,treeGridModel:"nested",treeReader:{},treeANode:-1,ExpandColumn:null,tree_root_level:0,
prmNames:{page:"page",rows:"rows",sort:"sidx",order:"sord",search:"_search",nd:"nd",id:"id",oper:"oper",editoper:"edit",addoper:"add",deloper:"del",subgridid:"id",npage:null,totalrows:"totalrows"},forceFit:!1,gridstate:"visible",cellEdit:!1,cellsubmit:"remote",nv:0,loadui:"enable",toolbar:[!1,""],scroll:!1,deselectAfterSort:!0,scrollrows:!1,autowidth:!1,scrollOffset:$.jgrid.scrollbarWidth()+3,cellLayout:5,subGridWidth:20,gridview:!0,rownumWidth:35,rownumbers:!1,pagerpos:"center",recordpos:"right",footerrow:!1,userDataOnFooter:!1,hoverrows:!0,viewsortcols:[!1,"vertical",!0],resizeclass:"",autoencode:!1,remapColumns:[],ajaxGridOptions:{},direction:"ltr",toppager:!1,headertitles:!1,scrollTimeout:40,data:[],_index:{},grouping:!1,groupingView:{groupField:[],groupOrder:[],groupText:[],groupColumnShow:[],groupSummary:[],showSummaryOnHide:!1,sortitems:[],sortnames:[],summary:[],summaryval:[],plusicon:"",minusicon:"",displayField:[],groupSummaryPos:[],formatDisplayField:[],_locgr:!1},ignoreCase:!0,cmTemplate:{},idPrefix:"",multiSort:!1,minColWidth:33,scrollPopUp:!1,scrollTopOffset:0,scrollLeftOffset:"100%",scrollMaxBuffer:0,storeNavOptions:!1,regional:"en",styleUI:"jQueryUI",iconSet:"Iconic",responsive:!1,restoreCellonFail:!0,editNextRowCell:!1,colFilters:{},colMenu:!1,colMenuCustom:{},colMenuColumnDone:null,treeGrid_bigData:!1,treeGrid_rootParams:{otherData:{}},treeGrid_beforeRequest:null,treeGrid_afterLoadComplete:null,useNameForSearch:!1},$.jgrid.defaults,a);void 0!==c&&(d.data=c,a.data=c);var e=this,f={headers:[],cols:[],footers:[],dragStart:function(a,b,c){var f=$(this.bDiv).offset().left,g=parseInt(d.colModel[a].minResizeWidth?d.colModel[a].minResizeWidth:d.minColWidth,10);isNaN(g)&&(g=33),this.resizing={idx:a,startX:b.pageX,sOL:b.pageX-f,minW:g},this.hDiv.style.cursor="col-resize",this.curGbox=$("#rs_m"+$.jgrid.jqID(d.id),"#gbox_"+$.jgrid.jqID(d.id)),this.curGbox.css({display:"block",left:b.pageX-f,top:c[1],height:c[2]}),$(e).triggerHandler("jqGridResizeStart",[b,a]),$.isFunction(d.resizeStart)&&d.resizeStart.call(e,b,a),document.onselectstart=function(){return!1}},dragMove:function(a){if(this.resizing){var b,c,e=a.pageX-this.resizing.startX,f=this.headers[this.resizing.idx],g="ltr"===d.direction?f.width+e:f.width-e;g>this.resizing.minW&&(this.curGbox.css({left:this.resizing.sOL+e}),!0===d.forceFit?(b=this.headers[this.resizing.idx+d.nv],(c="ltr"===d.direction?b.width-e:b.width+e)>this.resizing.minW&&(f.newWidth=g,b.newWidth=c)):(this.newWidth="ltr"===d.direction?d.tblwidth+e:d.tblwidth-e,f.newWidth=g))}},dragEnd:function(a){if(this.hDiv.style.cursor="default",this.resizing){var b=this.resizing.idx,c=this.headers[b].newWidth||this.headers[b].width;c=parseInt(c,10),this.resizing=!1,$("#rs_m"+$.jgrid.jqID(d.id)).css("display","none"),d.colModel[b].width=c,this.headers[b].width=c,this.headers[b].el.style.width=c+"px",this.cols[b].style.width=c+"px",this.footers.length>0&&(this.footers[b].style.width=c+"px"),!0===d.forceFit?(c=this.headers[b+d.nv].newWidth||this.headers[b+d.nv].width,this.headers[b+d.nv].width=c,this.headers[b+d.nv].el.style.width=c+"px",this.cols[b+d.nv].style.width=c+"px",this.footers.length>0&&(this.footers[b+d.nv].style.width=c+"px"),d.colModel[b+d.nv].width=c):(d.tblwidth=this.newWidth||d.tblwidth,$("table:first",this.bDiv).css("width",d.tblwidth+"px"),$("table:first",this.hDiv).css("width",d.tblwidth+"px"),this.hDiv.scrollLeft=this.bDiv.scrollLeft,d.footerrow&&($("table:first",this.sDiv).css("width",d.tblwidth+"px"),this.sDiv.scrollLeft=this.bDiv.scrollLeft)),a&&($(e).triggerHandler("jqGridResizeStop",[c,b]),$.isFunction(d.resizeStop)&&d.resizeStop.call(e,c,b))}this.curGbox=null,document.onselectstart=function(){return!0}},populateVisible:function(){f.timer&&clearTimeout(f.timer),f.timer=null;var a=$(f.bDiv).height();if(a){var b,c,g=$("table:first",f.bDiv);if(g[0].rows.length)try{b=g[0].rows[1],c=b?$(b).outerHeight()||f.prevRowHeight:f.prevRowHeight}catch(a){c=f.prevRowHeight}if(c){f.prevRowHeight=c;var h,i,j,k=d.rowNum,l=f.scrollTop=f.bDiv.scrollTop,m=Math.round(g.position().top)-l,n=m+g.height(),o=c*k;if(n<a&&m<=0&&(void 0===d.lastpage||(parseInt((n+l+o-1)/o,10)||0)<=d.lastpage)&&(i=parseInt((a-n+o-1)/o,10)||1,n>=0||i<2||!0===d.scroll?(h=(Math.round((n+l)/o)||0)+1,m=-1):m=1),m>0&&(h=(parseInt(l/o,10)||0)+1,i=(parseInt((l+a)/o,10)||0)+2-h,j=!0),i){if(d.lastpage&&(h>d.lastpage||1===d.lastpage||h===d.page&&h===d.lastpage))return;f.hDiv.loading?f.timer=setTimeout(f.populateVisible,d.scrollTimeout):(d.page=h,d.scrollMaxBuffer>0&&(k>0&&d.scrollMaxBuffer<k&&(d.scrollMaxBuffer=k+1),d.reccount>d.scrollMaxBuffer-(k>0?k:0)&&(j=!0)),j&&(f.selectionPreserver(g[0]),f.emptyRows.call(g[0],!1,!1)),f.populate(i)),d.scrollPopUp&&null!=d.lastpage&&($("#scroll_g"+d.id).show().html($.jgrid.template($.jgrid.getRegional(e,"defaults.pgtext",d.pgtext),d.page,d.lastpage)).css({top:d.scrollTopOffset+l*((parseInt(d.height,10)-45)/(parseInt(c,10)*parseInt(d.records,10)))+"px",left:d.scrollLeftOffset}),$(this).mouseout(function(){$("#scroll_g"+d.id).hide()}))}}}},scrollGrid:function(a){if(d.scroll){var b=f.bDiv.scrollTop;void 0===f.scrollTop&&(f.scrollTop=0),b!==f.scrollTop&&(f.scrollTop=b,f.timer&&clearTimeout(f.timer),f.timer=setTimeout(f.populateVisible,d.scrollTimeout))}f.hDiv.scrollLeft=f.bDiv.scrollLeft,d.footerrow&&(f.sDiv.scrollLeft=f.bDiv.scrollLeft),d.frozenColumns&&$(f.fbDiv).scrollTop(f.bDiv.scrollTop);try{$("#column_menu").remove()}catch(a){}a&&a.stopPropagation()},selectionPreserver:function(a){var b=a.p,c=b.selrow,d=b.selarrrow?$.makeArray(b.selarrrow):null,e=a.grid.bDiv.scrollLeft,f=function(){var g;if(b.multiselect&&d&&d.length>0)for(g=0;g<d.length;g++)d[g]&&$(a).jqGrid("setSelection",d[g],!1,"_sp_");!b.multiselect&&c&&$(a).jqGrid("setSelection",c,!1,null),a.grid.bDiv.scrollLeft=e,$(a).off(".selectionPreserver",f)};$(a).on("jqGridGridComplete.selectionPreserver",f)}};if("TABLE"!==this.tagName.toUpperCase()||null==this.id)return void alert("Element is not a table or has no id!");if(void 0!==document.documentMode&&document.documentMode<=5)return void alert("Grid can not be used in this ('quirks') mode!");var g,h,i,j,k=0;for(h in $.jgrid.regional)$.jgrid.regional.hasOwnProperty(h)&&(0===k&&(g=h),k++);if(1===k&&g!==d.regional&&(d.regional=g),$(this).empty().attr("tabindex","0"),this.p=d,this.p.useProp=!!$.fn.prop,0===this.p.colNames.length)for(k=0;k<this.p.colModel.length;k++)this.p.colNames[k]=this.p.colModel[k].label||this.p.colModel[k].name;if(this.p.colNames.length!==this.p.colModel.length)return void alert($.jgrid.getRegional(this,"errors.model"));"Bootstrap4"===e.p.styleUI&&$.jgrid.iconSet.hasOwnProperty(e.p.iconSet)&&$.extend(!0,$.jgrid.styleUI.Bootstrap4,$.jgrid.iconSet[e.p.iconSet]);var l,m=$.jgrid.getMethod("getStyleUI"),n=e.p.styleUI+".common",o=m(n,"disabled",!0),p=m(n,"highlight",!0),q=m(n,"hover",!0),r=m(n,"cornerall",!0),s=m(n,"icon_base",!0),t=$.jgrid.styleUI[e.p.styleUI||"jQueryUI"].colmenu,u=$.jgrid.msie(),v=[],w=[],x=[];n=e.p.styleUI+".base",l=$("<div "+m(n,"viewBox",!1,"ui-jqgrid-view")+" role='grid'></div>"),e.p.direction=$.trim(e.p.direction.toLowerCase()),e.p._ald=!1,-1===$.inArray(e.p.direction,["ltr","rtl"])&&(e.p.direction="ltr"),i=e.p.direction,$(l).insertBefore(this),$(this).appendTo(l);var y=$("<div "+m(n,"entrieBox",!1,"ui-jqgrid")+"></div>");$(y).attr({id:"gbox_"+this.id,dir:i}).insertBefore(l),$(l).attr("id","gview_"+this.id).appendTo(y),$("<div "+m(e.p.styleUI+".common","overlay",!1,"jqgrid-overlay")+" id='lui_"+this.id+"'></div>").insertBefore(l),$("<div "+m(n,"loadingBox",!1,"loading")+" id='load_"+this.id+"'>"+$.jgrid.getRegional(e,"defaults.loadtext",this.p.loadtext)+"</div>").insertBefore(l),$(this).attr({role:"presentation","aria-multiselectable":!!this.p.multiselect,"aria-labelledby":"gbox_"+this.id});var z,A=["shiftKey","altKey","ctrlKey"],B=$.jgrid.getFont(e),C=function(a,b){return a=parseInt(a,10),isNaN(a)?b||0:a},D=function(a,b,c,d,g,h){var i,j,k=e.p.colModel[a],l=k.align,m='style="',n=k.classes,o=k.name,p=[];return l&&(m+="text-align:"+l+";"),!0===k.hidden&&(m+="display:none;"),0===b?m+="width: "+f.headers[a].width+"px;":($.isFunction(k.cellattr)||"string"==typeof k.cellattr&&null!=$.jgrid.cellattr&&$.isFunction($.jgrid.cellattr[k.cellattr]))&&(i=$.isFunction(k.cellattr)?k.cellattr:$.jgrid.cellattr[k.cellattr],(j=i.call(e,g,c,d,k,h))&&"string"==typeof j&&(j.indexOf("title")>-1&&(k.title=!1),j.indexOf("class")>-1&&(n=void 0),j=String(j).replace(/\s+\=/g,"="),p=j.split("style="),2===p.length?(p[1]=$.trim(p[1]),0!==p[1].indexOf("'")&&0!==p[1].indexOf('"')||(p[1]=p[1].substring(1)),m+=p[1].replace(/'/gi,'"')):m+='"')),p.length?p.length>2&&(p[0]=""):(p[0]="",m+='"'),m+=(void 0!==n?' class="'+n+'"':"")+(k.title&&c?' title="'+$.jgrid.stripHtml(c)+'"':""),(m+=' aria-describedby="'+e.p.id+"_"+o+'"')+p[0]},E=function(a){return null==a||""===a?"&#160;":e.p.autoencode?$.jgrid.htmlEncode(a):String(a)},F=function(a,b,c,d,f){var g,h=e.p.colModel[c];if(void 0!==h.formatter){a=""!==String(e.p.idPrefix)?$.jgrid.stripPref(e.p.idPrefix,a):a;var i={rowId:a,colModel:h,gid:e.p.id,pos:c,styleUI:e.p.styleUI};g=$.isFunction(h.formatter)?h.formatter.call(e,b,i,d,f):$.fmatter?$.fn.fmatter.call(e,h.formatter,b,i,d,f):E(b)}else g=E(b);return e.p.autoResizing&&h.autosize&&(h._maxsize||(h._maxsize=0),h._maxsize=Math.max($.jgrid.getTextWidth(g,B),h._maxsize)),g},G=function(a,b,c,d,e,f){var g;return g=F(a,b,c,e,"add"),'<td role="gridcell" '+D(c,d,g,e,a,f)+">"+g+"</td>"},H=function(a,b,c,d,f){var g='<input role="checkbox" type="checkbox" id="jqg_'+e.p.id+"_"+a+'" '+f+' name="jqg_'+e.p.id+"_"+a+'"'+(d?'checked="checked"':"")+"/>";return'<td role="gridcell" '+D(b,c,"",null,a,!0)+">"+g+"</td>"},I=function(a,b,c,d,e){var f=(parseInt(c,10)-1)*parseInt(d,10)+1+b;return'<td role="gridcell" '+e+" "+D(a,b,f,null,b,!0)+">"+f+"</td>"},J=function(a){var b,c,d=[],f=0;for(c=0;c<e.p.colModel.length;c++)b=e.p.colModel[c],"cb"!==b.name&&"subgrid"!==b.name&&"rn"!==b.name&&(d[f]="local"===a?b.name:"xml"===a||"xmlstring"===a?b.xmlmap||b.name:b.jsonmap||b.name,!1!==e.p.keyName&&!0===b.key&&(e.p.keyName=d[f],e.p.keyIndex=f),f++);return d},K=function(a){var b=e.p.remapColumns;return b&&b.length||(b=$.map(e.p.colModel,function(a,b){return b})),a&&(b=$.map(b,function(b){return b<a?null:b-a})),b},L=function(a,b){var c;this.p.deepempty?$(this.rows).slice(1).remove():(c=this.rows.length>0?this.rows[0]:null,$(this.firstChild).empty().append(c)),a&&this.p.scroll&&($(this.grid.bDiv.firstChild).css({height:"auto"}),$(this.grid.bDiv.firstChild.firstChild).css({height:"0px",display:"none"}),0!==this.grid.bDiv.scrollTop&&(this.grid.bDiv.scrollTop=0)),!0===b&&this.p.treeGrid&&!this.p.loadonce&&(this.p.data=[],this.p._index={})},M=function(){var a,b,c,d,f,g,h,i,j,k,l,m=e.p,n=m.data,o=n.length,p=m.localReader,q=m.colModel,r=p.cell,s=(!0===m.multiselect?1:0)+(!0===m.subGrid?1:0)+(!0===m.rownumbers?1:0),t=m.scroll?$.jgrid.randId():1;if("local"===m.datatype&&!0===p.repeatitems)for(j=K(s),k=J("local"),d=!1===m.keyName?$.isFunction(p.id)?p.id.call(e,n):p.id:m.keyName,a=0;a<o;a++){for(c=n[a],f=$.jgrid.getAccessor(c,d),void 0===f&&("number"==typeof d&&null!=q[d+s]&&(f=$.jgrid.getAccessor(c,q[d+s].name)),void 0===f&&(f=t+a,r&&(g=$.jgrid.getAccessor(c,r)||c,f=null!=g&&void 0!==g[d]?g[d]:f,g=null))),i={},i[p.id]=f,r&&(c=$.jgrid.getAccessor(c,r)||c),l=$.isArray(c)?j:k,b=0;b<l.length;b++)h=$.jgrid.getAccessor(c,l[b]),i[q[b+s].name]=h;n[a]=i}},N=function(){var a,b,c,d=e.p.data.length;for(a=!1===e.p.keyName||!0===e.p.loadonce?e.p.localReader.id:e.p.keyName,e.p._index=[],b=0;b<d;b++)c=$.jgrid.getAccessor(e.p.data[b],a),void 0===c&&(c=String(b+1)),e.p._index[c]=b},O=function(a,b,c,d,f){var g,h="-1",i="",j=b?"display:none;":"",k=$(e).triggerHandler("jqGridRowAttr",[d,f,a]);if("object"!=typeof k&&(k=$.isFunction(e.p.rowattr)?e.p.rowattr.call(e,d,f,a):"string"==typeof e.p.rowattr&&null!=$.jgrid.rowattr&&$.isFunction($.jgrid.rowattr[e.p.rowattr])?$.jgrid.rowattr[e.p.rowattr].call(e,d,f,a):{}),!$.isEmptyObject(k)){k.hasOwnProperty("id")&&(a=k.id,delete k.id),k.hasOwnProperty("tabindex")&&(h=k.tabindex,delete k.tabindex),k.hasOwnProperty("style")&&(j+=k.style,delete k.style),k.hasOwnProperty("class")&&(c+=" "+k.class,delete k.class);try{delete k.role}catch(a){}for(g in k)k.hasOwnProperty(g)&&(i+=" "+g+"="+k[g])}return'<tr role="row" id="'+a+'" tabindex="'+h+'" class="'+c+'"'+(""===j?"":' style="'+j+'"')+i+">"},P=function(){e.p.treeGrid&&e.p.treeGrid_bigData&&void 0!==e.p.postData.nodeid&&"string"==typeof e.p.postData.nodeid&&(""!==e.p.postData.nodeid||parseInt(e.p.postData.nodeid,10)>0)&&(e.p.postData.rows=1e4,e.p.postData.page=1,e.p.treeGrid_rootParams.otherData.nodeid=e.p.postData.nodeid)},Q=function(){e.p.treeGrid&&e.p.treeGrid_bigData&&(void 0!==e.p.treeGrid_rootParams.otherData.nodeid&&"string"==typeof e.p.treeGrid_rootParams.otherData.nodeid&&(""!==e.p.treeGrid_rootParams.otherData.nodeid||parseInt(e.p.treeGrid_rootParams.otherData.nodeid,10)>0)?void 0!==e.p.treeGrid_rootParams&&null!=e.p.treeGrid_rootParams&&(e.p.page=e.p.treeGrid_rootParams.page,e.p.lastpage=e.p.treeGrid_rootParams.lastpage,e.p.postData.rows=e.p.treeGrid_rootParams.postData.rows,e.p.postData.totalrows=e.p.treeGrid_rootParams.postData.totalrows,e.p.treeGrid_rootParams.otherData.nodeid="",e.updatepager(!1,!0)):e.p.treeGrid_rootParams={page:e.p.page,lastpage:e.p.lastpage,postData:{rows:e.p.postData.rows,totalrows:e.p.postData.totalrows},rowNum:e.p.rowNum,rowTotal:e.p.rowTotal,otherData:{nodeid:""}})},R=function(a,b,c,d){var f=new Date,g="local"!==e.p.datatype&&e.p.loadonce||"xmlstring"===e.p.datatype,h="_id_",i=e.p.xmlReader,k="local"===e.p.datatype?"local":"xml";if(g&&(e.p.data=[],e.p._index={},e.p.localReader.id=h),e.p.reccount=0,$.isXMLDoc(a)){-1!==e.p.treeANode||e.p.scroll?b=b>1?b:1:(L.call(e,!1,!0),b=1);var l,o,p,q,r,s,t,u,v,w=$(e),x=0,y=!0===e.p.multiselect?1:0,z=0,A=!0===e.p.rownumbers?1:0,B=[],D={},E=[],F=m(n,"rowBox",!0,"jqgrow ui-row-"+e.p.direction);!0===e.p.subGrid&&(z=1,q=$.jgrid.getMethod("addSubGridCell")),i.repeatitems||(B=J(k)),r=!1===e.p.keyName?$.isFunction(i.id)?i.id.call(e,a):i.id:e.p.keyName,i.repeatitems&&e.p.keyName&&isNaN(r)&&(r=e.p.keyIndex),s=-1===String(r).indexOf("[")?B.length?function(a,b){return $(r,a).text()||b}:function(a,b){return $(i.cell,a).eq(r).text()||b}:function(a,b){return a.getAttribute(r.replace(/[\[\]]/g,""))||b},e.p.userData={},e.p.page=C($.jgrid.getXmlData(a,i.page),e.p.page),e.p.lastpage=C($.jgrid.getXmlData(a,i.total),1),e.p.records=C($.jgrid.getXmlData(a,i.records)),$.isFunction(i.userdata)?e.p.userData=i.userdata.call(e,a)||{}:$.jgrid.getXmlData(a,i.userdata,!0).each(function(){e.p.userData[this.getAttribute("name")]=$(this).text()});var M=$.jgrid.getXmlData(a,i.root,!0);M=$.jgrid.getXmlData(M,i.row,!0),M||(M=[]);var N,P,Q=M.length,R=0,S=[],T=parseInt(e.p.rowNum,10),U=e.p.scroll?$.jgrid.randId():1,V=$(e).find("tbody:first"),W=!1;if(e.p.grouping&&(W=!0===e.p.groupingView.groupCollapse,N=$.jgrid.getMethod("groupingPrepare")),Q>0&&e.p.page<=0&&(e.p.page=1),M&&Q){d&&(T*=d+1);for(var X=$.isFunction(e.p.afterInsertRow),Y=A?m(n,"rownumBox",!1,"jqgrid-rownum"):"",Z=y?m(n,"multiBox",!1,"cbox"):"";R<Q;){u=M[R],v=s(u,U+R),v=e.p.idPrefix+v,e.p.preserveSelection&&(e.p.multiselect?(P=-1!==e.p.selarrrow.indexOf(v),j=P?j+1:j):P=v===e.p.selrow);var aa=E.length;if(E.push(""),A&&E.push(I(0,R,e.p.page,e.p.rowNum,Y)),y&&E.push(H(v,A,R,P,Z)),z&&E.push(q.call(w,y+A,R+b)),i.repeatitems){t||(t=K(y+z+A));var ba=$.jgrid.getXmlData(u,i.cell,!0);$.each(t,function(a){var c=ba[this];if(!c)return!1;p=c.textContent||c.text||"",D[e.p.colModel[a+y+z+A].name]=p,E.push(G(v,p,a+y+z+A,R+b,u,D))})}else for(l=0;l<B.length;l++)p=$.jgrid.getXmlData(u,B[l]),D[e.p.colModel[l+y+z+A].name]=p,E.push(G(v,p,l+y+z+A,R+b,u,D));if(E[aa]=O(v,W,F,D,u),E.push("</tr>"),e.p.grouping&&(S.push(E),e.p.groupingView._locgr||N.call(w,D,R),E=[]),(g||!0===e.p.treeGrid&&!e.p._ald)&&(D[h]=$.jgrid.stripPref(e.p.idPrefix,v),e.p.data.push(D),e.p._index[D[h]]=e.p.data.length-1),!1===e.p.gridview&&(V.append(E.join("")),w.triggerHandler("jqGridAfterInsertRow",[v,D,u]),X&&e.p.afterInsertRow.call(e,v,D,u),E=[]),D={},x++,R++,x===T)break}}if(j=e.p.multiselect&&e.p.preserveSelection&&x===j,!0===e.p.gridview&&(o=e.p.treeANode>-1?e.p.treeANode:0,e.p.grouping?g||(w.jqGrid("groupingRender",S,e.p.colModel.length,e.p.page,T),S=null):!0===e.p.treeGrid&&o>0?$(e.rows[o]).after(E.join("")):(V.append(E.join("")),e.grid.cols=e.rows[0].cells)),e.p.totaltime=new Date-f,E=null,x>0&&0===e.p.records&&(e.p.records=Q),!0===e.p.treeGrid)try{w.jqGrid("setTreeNode",o+1,x+o+1)}catch(a){}if(e.p.reccount=x,e.p.treeANode=-1,e.p.userDataOnFooter&&w.jqGrid("footerData","set",e.p.userData,!0),g&&(e.p.records=Q,e.p.lastpage=Math.ceil(Q/T)),c||e.updatepager(!1,!0),j&&_(!0),g){for(;x<Q;){if(u=M[x],v=s(u,x+U),v=e.p.idPrefix+v,i.repeatitems){t||(t=K(y+z+A));var ca=$.jgrid.getXmlData(u,i.cell,!0);$.each(t,function(a){var b=ca[this];if(!b)return!1;p=b.textContent||b.text||"",D[e.p.colModel[a+y+z+A].name]=p})}else for(l=0;l<B.length;l++)p=$.jgrid.getXmlData(u,B[l]),D[e.p.colModel[l+y+z+A].name]=p;D[h]=$.jgrid.stripPref(e.p.idPrefix,v),e.p.grouping&&N.call(w,D,x),e.p.data.push(D),e.p._index[D[h]]=e.p.data.length-1,D={},x++}e.p.grouping&&(e.p.groupingView._locgr=!0,w.jqGrid("groupingRender",S,e.p.colModel.length,e.p.page,T),S=null)}if(!0===e.p.subGrid)try{w.jqGrid("addSubGrid",y+A)}catch(a){}}},S=function(a,b,c,d){var f=new Date;if(a){-1!==e.p.treeANode||e.p.scroll?b=b>1?b:1:(L.call(e,!1,!0),b=1);var g,h;"local"===e.p.datatype?(g=e.p.localReader,h="local"):(g=e.p.jsonReader,h="json");var i,k,l,o,q,r,s,t,u,v,w,x,y,z="_id_",A="local"!==e.p.datatype&&e.p.loadonce||"jsonstring"===e.p.datatype,B=$(e),D=0,E=[],F=e.p.multiselect?1:0,M=!0===e.p.subGrid?1:0,N=!0===e.p.rownumbers?1:0,P=e.p.scroll&&"local"!==e.p.datatype?$.jgrid.randId():1,Q=parseInt(e.p.rowNum,10),R=!1,S=K(F+M+N),T=J(h),U={},V=[],W=m(n,"rowBox",!0,"jqgrow ui-row-"+e.p.direction),X=$.isFunction(e.p.afterInsertRow),Y=[],Z=!1,aa=$(e).find("tbody:first"),ba=N?m(n,"rownumBox",!1,"jqgrid-rownum"):"",ca=F?m(n,"multiBox",!1,"cbox"):"";for(A&&(e.p.data=[],e.p._index={},e.p.localReader.id=z),e.p.reccount=0,e.p.page=C($.jgrid.getAccessor(a,g.page),e.p.page),e.p.lastpage=C($.jgrid.getAccessor(a,g.total),1),e.p.records=C($.jgrid.getAccessor(a,g.records)),e.p.userData=$.jgrid.getAccessor(a,g.userdata)||{},M&&(q=$.jgrid.getMethod("addSubGridCell")),v=!1===e.p.keyName?$.isFunction(g.id)?g.id.call(e,a):g.id:e.p.keyName,g.repeatitems&&e.p.keyName&&isNaN(v)&&(v=e.p.keyIndex),u=$.jgrid.getAccessor(a,g.root),null==u&&$.isArray(a)&&(u=a),u||(u=[]),t=u.length,k=0,t>0&&e.p.page<=0&&(e.p.page=1),d&&(Q*=d+1),"local"!==e.p.datatype||e.p.deselectAfterSort||(R=!0),e.p.grouping&&(Z=!0===e.p.groupingView.groupCollapse,y=$.jgrid.getMethod("groupingPrepare"));k<t;){if(o=u[k],void 0===(x=$.jgrid.getAccessor(o,v))&&("number"==typeof v&&null!=e.p.colModel[v+F+M+N]&&(x=$.jgrid.getAccessor(o,e.p.colModel[v+F+M+N].name)),void 0===x&&(x=P+k,0===E.length&&g.cell))){var da=$.jgrid.getAccessor(o,g.cell)||o;x=null!=da&&void 0!==da[v]?da[v]:x,da=null}x=e.p.idPrefix+x,(R||e.p.preserveSelection)&&(e.p.multiselect?(r=-1!==e.p.selarrrow.indexOf(x),j=r?j+1:j):r=x===e.p.selrow);var ea=V.length;for(V.push(""),N&&V.push(I(0,k,e.p.page,e.p.rowNum,ba)),F&&V.push(H(x,N,k,r,ca)),M&&V.push(q.call(B,F+N,k+b)),s=T,g.repeatitems&&(g.cell&&(o=$.jgrid.getAccessor(o,g.cell)||o),$.isArray(o)&&(s=S)),l=0;l<s.length;l++)i=$.jgrid.getAccessor(o,s[l]),U[e.p.colModel[l+F+M+N].name]=i,V.push(G(x,i,l+F+M+N,k+b,o,U));if(V[ea]=O(x,Z,r?W+" "+p:W,U,o),V.push("</tr>"),e.p.grouping&&(Y.push(V),e.p.groupingView._locgr||y.call(B,U,k),V=[]),(A||!0===e.p.treeGrid&&!e.p._ald)&&(U[z]=$.jgrid.stripPref(e.p.idPrefix,x),e.p.data.push(U),e.p._index[U[z]]=e.p.data.length-1),!1===e.p.gridview&&(aa.append(V.join("")),B.triggerHandler("jqGridAfterInsertRow",[x,U,o]),X&&e.p.afterInsertRow.call(e,x,U,o),V=[]),U={},D++,k++,D===Q)break}if(j=e.p.multiselect&&(e.p.preserveSelection||R)&&D===j,!0===e.p.gridview&&(w=e.p.treeANode>-1?e.p.treeANode:0,e.p.grouping?A||(B.jqGrid("groupingRender",Y,e.p.colModel.length,e.p.page,Q),Y=null):!0===e.p.treeGrid&&w>0?$(e.rows[w]).after(V.join("")):(aa.append(V.join("")),e.grid.cols=e.rows[0].cells)),e.p.totaltime=new Date-f,V=null,D>0&&0===e.p.records&&(e.p.records=t),!0===e.p.treeGrid)try{B.jqGrid("setTreeNode",w+1,D+w+1)}catch(a){}if(e.p.reccount=D,e.p.treeANode=-1,e.p.userDataOnFooter&&B.jqGrid("footerData","set",e.p.userData,!0),A&&(e.p.records=t,e.p.lastpage=Math.ceil(t/Q)),c||e.updatepager(!1,!0),j&&_(!0),A){for(;D<t&&u[D];){if(o=u[D],void 0===(x=$.jgrid.getAccessor(o,v))&&("number"==typeof v&&null!=e.p.colModel[v+F+M+N]&&(x=$.jgrid.getAccessor(o,e.p.colModel[v+F+M+N].name)),void 0===x&&(x=P+D,0===E.length&&g.cell))){var fa=$.jgrid.getAccessor(o,g.cell)||o;x=null!=fa&&void 0!==fa[v]?fa[v]:x,fa=null}if(o){for(x=e.p.idPrefix+x,s=T,g.repeatitems&&(g.cell&&(o=$.jgrid.getAccessor(o,g.cell)||o),$.isArray(o)&&(s=S)),l=0;l<s.length;l++)U[e.p.colModel[l+F+M+N].name]=$.jgrid.getAccessor(o,s[l]);U[z]=$.jgrid.stripPref(e.p.idPrefix,x),e.p.grouping&&y.call(B,U,D),e.p.data.push(U),e.p._index[U[z]]=e.p.data.length-1,U={}}D++}e.p.grouping&&(e.p.groupingView._locgr=!0,B.jqGrid("groupingRender",Y,e.p.colModel.length,e.p.page,Q),Y=null)}if(!0===e.p.subGrid)try{B.jqGrid("addSubGrid",F+N)}catch(a){}}},T=function(a){function b(a){var c,d,f,g,h,i,j=0;if(null!=a.groups){for(d=a.groups.length&&"OR"===a.groupOp.toString().toUpperCase(),d&&s.orBegin(),c=0;c<a.groups.length;c++){j>0&&d&&s.or();try{b(a.groups[c])}catch(a){alert(a)}j++}d&&s.orEnd()}if(null!=a.rules)try{f=a.rules.length&&"OR"===a.groupOp.toString().toUpperCase(),f&&s.orBegin();var l;for(c=0;c<a.rules.length;c++){if(h=a.rules[c],g=a.groupOp.toString().toUpperCase(),r[h.op]&&h.field){j>0&&g&&"OR"===g&&(s=s.or()),l=h.field,e.p.useNameForSearch&&k.hasOwnProperty(h.field)&&(l=k[h.field].name);try{i=k[h.field],"date"===i.stype&&i.srcfmt&&i.newfmt&&i.srcfmt!==i.newfmt&&(h.data=$.jgrid.parseDate.call(e,i.newfmt,h.data,i.srcfmt)),s=r[h.op](s,g)(l,h.data,i)}catch(a){}}j++}f&&s.orEnd()}catch(a){alert(a)}}var c,d,f,g,h=e.p.multiSort?[]:"",i=[],j=!1,k={},l=[],m=[];if($.isArray(e.p.data)){var n,o,p,q=!!e.p.grouping&&e.p.groupingView;if($.each(e.p.colModel,function(){if("cb"===this.name||"subgrid"===this.name||"rn"===this.name)return!0;if(d=this.sorttype||"text",p=this.index||this.name,"date"===d||"datetime"===d?(this.formatter&&"string"==typeof this.formatter&&"date"===this.formatter?(c=this.formatoptions&&this.formatoptions.srcformat?this.formatoptions.srcformat:$.jgrid.getRegional(e,"formatter.date.srcformat"),f=this.formatoptions&&this.formatoptions.newformat?this.formatoptions.newformat:$.jgrid.getRegional(e,"formatter.date.newformat")):c=f=this.datefmt||"Y-m-d",k[p]={stype:d,srcfmt:c,newfmt:f,sfunc:this.sortfunc||null,name:this.name}):k[p]={stype:d,srcfmt:"",newfmt:"",sfunc:this.sortfunc||null,name:this.name},e.p.grouping)for(o=0,n=q.groupField.length;o<n;o++)this.name===q.groupField[o]&&(l[o]=k[p],m[o]=p);e.p.multiSort||j||p!==e.p.sortname||(h=p,j=!0)}),e.p.multiSort&&(h=v,i=w),e.p.treeGrid&&e.p._sort)return void $(e).jqGrid("SortTree",h,e.p.sortorder,k[h].stype||"text",k[h].srcfmt||"");var r={eq:function(a){return a.equals},ne:function(a){return a.notEquals},lt:function(a){return a.less},le:function(a){return a.lessOrEquals},gt:function(a){return a.greater},ge:function(a){return a.greaterOrEquals},cn:function(a){return a.contains},nc:function(a,b){return"OR"===b?a.orNot().contains:a.andNot().contains},bw:function(a){return a.startsWith},bn:function(a,b){return"OR"===b?a.orNot().startsWith:a.andNot().startsWith},en:function(a,b){return"OR"===b?a.orNot().endsWith:a.andNot().endsWith},ew:function(a){return a.endsWith},ni:function(a,b){return"OR"===b?a.orNot().equals:a.andNot().equals},in:function(a){return a.equals},nu:function(a){return a.isNull},nn:function(a,b){return"OR"===b?a.orNot().isNull:a.andNot().isNull}},s=$.jgrid.from.call(e,e.p.data);if(e.p.ignoreCase&&(s=s.ignoreCase()),!0===e.p.search){var t=e.p.postData.filters;if(t)"string"==typeof t&&(t=$.jgrid.parse(t)),b(t);else try{g=k[e.p.postData.searchField],"date"===g.stype&&g.srcfmt&&g.newfmt&&g.srcfmt!==g.newfmt&&(e.p.postData.searchString=$.jgrid.parseDate.call(e,g.newfmt,e.p.postData.searchString,g.srcfmt)),s=r[e.p.postData.searchOper](s)(e.p.postData.searchField,e.p.postData.searchString,k[e.p.postData.searchField])}catch(a){}}else e.p.treeGrid&&"nested"===e.p.treeGridModel&&s.orderBy(e.p.treeReader.left_field,"asc","integer","",null);if(e.p.treeGrid&&"adjacency"===e.p.treeGridModel&&(n=0,h=null),e.p.grouping)for(o=0;o<n;o++)s.orderBy(m[o],q.groupOrder[o],l[o].stype,l[o].srcfmt);e.p.multiSort?$.each(h,function(a){s.orderBy(this,i[a],k[this].stype,k[this].srcfmt,k[this].sfunc)}):h&&e.p.sortorder&&j&&("DESC"===e.p.sortorder.toUpperCase()?s.orderBy(e.p.sortname,"d",k[h].stype,k[h].srcfmt,k[h].sfunc):s.orderBy(e.p.sortname,"a",k[h].stype,k[h].srcfmt,k[h].sfunc));var u=s.select(),x=parseInt(e.p.rowNum,10),y=u.length,z=parseInt(e.p.page,10),A=Math.ceil(y/x),B={};if((e.p.search||e.p.resetsearch)&&e.p.grouping&&e.p.groupingView._locgr){e.p.groupingView.groups=[];var C,D,E,F=$.jgrid.getMethod("groupingPrepare");if(e.p.footerrow&&e.p.userDataOnFooter){for(D in e.p.userData)e.p.userData.hasOwnProperty(D)&&(e.p.userData[D]=0);E=!0}for(C=0;C<y;C++){if(E)for(D in e.p.userData)e.p.userData.hasOwnProperty(D)&&(e.p.userData[D]+=parseFloat(u[C][D]||0));F.call($(e),u[C],C,x)}}return a?u:(u=e.p.treeGrid&&e.p.search?$(e).jqGrid("searchTree",u):u.slice((z-1)*x,z*x),s=null,k=null,B[e.p.localReader.total]=A,B[e.p.localReader.page]=z,B[e.p.localReader.records]=y,B[e.p.localReader.root]=u,B[e.p.localReader.userdata]=e.p.userData,u=null,B)}},U=function(a,b){var c,d,f,g,h,i,j,k,l="",p=e.p.pager?$.jgrid.jqID(e.p.pager.substr(1)):"",r=p?"_"+p:"",s=e.p.toppager?"_"+e.p.toppager.substr(1):"";if(f=parseInt(e.p.page,10)-1,f<0&&(f=0),f*=parseInt(e.p.rowNum,10),h=f+e.p.reccount,e.p.scroll){var t=$("tbody:first > tr:gt(0)",e.grid.bDiv);h>e.p.records&&(h=e.p.records),f=h-t.length,e.p.reccount=t.length;var u=t.outerHeight()||e.grid.prevRowHeight;if(u){var v=f*u,w=parseInt(e.p.records,10)*u;$(">div:first",e.grid.bDiv).css({height:w}).children("div:first").css({height:v,display:v?"":"none"}),0===e.grid.bDiv.scrollTop&&e.p.page>1&&(e.grid.bDiv.scrollTop=e.p.rowNum*(e.p.page-1)*u)}e.grid.bDiv.scrollLeft=e.grid.hDiv.scrollLeft}if(l=e.p.pager||"",l+=e.p.toppager?l?","+e.p.toppager:e.p.toppager:""){if(j=$.jgrid.getRegional(e,"formatter.integer"),c=C(e.p.page),d=C(e.p.lastpage),$(".selbox",l)[this.p.useProp?"prop":"attr"]("disabled",!1),!0===e.p.pginput&&($("#input"+r).html($.jgrid.template($.jgrid.getRegional(e,"defaults.pgtext",e.p.pgtext)||"","<input "+m(n,"pgInput",!1,"ui-pg-input")+" type='text' size='2' maxlength='7' value='0' role='textbox'/>","<span id='sp_1_"+$.jgrid.jqID(p)+"'></span>")),e.p.toppager&&$("#input_t"+s).html($.jgrid.template($.jgrid.getRegional(e,"defaults.pgtext",e.p.pgtext)||"","<input "+m(n,"pgInput",!1,"ui-pg-input")+" type='text' size='2' maxlength='7' value='0' role='textbox'/>","<span id='sp_1_"+$.jgrid.jqID(p)+"_toppager'></span>")),$(".ui-pg-input",l).val(e.p.page),k=e.p.toppager?"#sp_1"+r+",#sp_1"+r+"_toppager":"#sp_1"+r,$(k).html($.fmatter?$.fmatter.util.NumberFormat(e.p.lastpage,j):e.p.lastpage)),e.p.viewrecords)if(0===e.p.reccount)$(".ui-paging-info",l).html($.jgrid.getRegional(e,"defaults.emptyrecords",e.p.emptyrecords));else{g=f+1,i=e.p.records,$.fmatter&&(g=$.fmatter.util.NumberFormat(g,j),h=$.fmatter.util.NumberFormat(h,j),i=$.fmatter.util.NumberFormat(i,j));var x=$.jgrid.getRegional(e,"defaults.recordtext",e.p.recordtext);$(".ui-paging-info",l).html($.jgrid.template(x,g,h,i))}!0===e.p.pgbuttons&&(c<=0&&(c=d=0),1===c||0===c?($("#first"+r+", #prev"+r).addClass(o).removeClass(q),e.p.toppager&&$("#first_t"+s+", #prev_t"+s).addClass(o).removeClass(q)):($("#first"+r+", #prev"+r).removeClass(o),e.p.toppager&&$("#first_t"+s+", #prev_t"+s).removeClass(o)),c===d||0===c?($("#next"+r+", #last"+r).addClass(o).removeClass(q),e.p.toppager&&$("#next_t"+s+", #last_t"+s).addClass(o).removeClass(q)):($("#next"+r+", #last"+r).removeClass(o),e.p.toppager&&$("#next_t"+s+", #last_t"+s).removeClass(o)))}!0===a&&!0===e.p.rownumbers&&$(">td.jqgrid-rownum",e.rows).each(function(a){$(this).html(f+1+a)}),b&&e.p.jqgdnd&&$(e).jqGrid("gridDnD","updateDnD"),$(e).triggerHandler("jqGridGridComplete"),$.isFunction(e.p.gridComplete)&&e.p.gridComplete.call(e),$(e).triggerHandler("jqGridAfterGridComplete")},V=function(){e.grid.hDiv.loading=!0,e.p.hiddengrid||$(e).jqGrid("progressBar",{method:"show",loadtype:e.p.loadui,htmlcontent:$.jgrid.getRegional(e,"defaults.loadtext",e.p.loadtext)})},W=function(){e.grid.hDiv.loading=!1,$(e).jqGrid("progressBar",{method:"hide",loadtype:e.p.loadui})},X=function(a,b,c){var d=$(e).triggerHandler("jqGridBeforeProcessing",[a,b,c]);return d=void 0===d||"boolean"!=typeof d||d,$.isFunction(e.p.beforeProcessing)&&!1===e.p.beforeProcessing.call(e,a,b,c)&&(d=!1),d},Y=function(a,b){$(e).triggerHandler("jqGridLoadComplete",[a]),b&&e.p.loadComplete.call(e,a),$(e).triggerHandler("jqGridAfterLoadComplete",[a]),e.p.datatype="local",e.p.datastr=null,W()},Z=function(a){if(!e.grid.hDiv.loading){var b,c,d=e.p.scroll&&!1===a,f={},g=e.p.prmNames;j=0,e.p.page<=0&&(e.p.page=Math.min(1,e.p.lastpage)),null!==g.search&&(f[g.search]=e.p.search),null!==g.nd&&(f[g.nd]=(new Date).getTime()),null!==g.rows&&(f[g.rows]=e.p.rowNum),null!==g.page&&(f[g.page]=e.p.page),null!==g.sort&&(f[g.sort]=e.p.sortname),null!==g.order&&(f[g.order]=e.p.sortorder),null!==e.p.rowTotal&&null!==g.totalrows&&(f[g.totalrows]=e.p.rowTotal);var h=$.isFunction(e.p.loadComplete),i=h?e.p.loadComplete:null,k=0;if(a=a||1,a>1?null!==g.npage?(f[g.npage]=a,k=a-1,a=1):i=function(b){e.p.page++,e.grid.hDiv.loading=!1,h&&e.p.loadComplete.call(e,b),Z(a-1)}:null!==g.npage&&delete e.p.postData[g.npage],e.p.grouping){$(e).jqGrid("groupingSetup");var l,m=e.p.groupingView,n="";for(l=0;l<m.groupField.length;l++){var o=m.groupField[l];$.each(e.p.colModel,function(a,b){b.name===o&&b.index&&(o=b.index)}),n+=o+" "+m.groupOrder[l]+", "}f[g.sort]=n+f[g.sort]}$.extend(e.p.postData,f);var p=e.p.scroll?e.rows.length-1:1;if($.isFunction(e.p.datatype))return void e.p.datatype.call(e,e.p.postData,"load_"+e.p.id,p,a,k);var q=$(e).triggerHandler("jqGridBeforeRequest");if(!1===q||"stop"===q)return;if($.isFunction(e.p.beforeRequest)&&(!1===(q=e.p.beforeRequest.call(e))||"stop"===q))return;switch($.isFunction(e.treeGrid_beforeRequest)&&e.treeGrid_beforeRequest.call(e),b=e.p.datatype.toLowerCase()){case"json":case"jsonp":case"xml":case"script":$.ajax($.extend({url:e.p.url,type:e.p.mtype,dataType:b,data:$.isFunction(e.p.serializeGridData)?e.p.serializeGridData.call(e,e.p.postData):e.p.postData,success:function(c,f,g){if(!X(c,f,g))return void W();"xml"===b?R(c,p,a>1,k):S(c,p,a>1,k),$(e).triggerHandler("jqGridLoadComplete",[c]),i&&i.call(e,c),$(e).triggerHandler("jqGridAfterLoadComplete",[c]),d&&e.grid.populateVisible(),e.p.treeGrid_bigData?e.p.loadonce&&(e.p.datatype="local"):(e.p.loadonce||e.p.treeGrid)&&(e.p.datatype="local"),c=null,1===a&&W(),$.isFunction(e.treeGrid_afterLoadComplete)&&e.treeGrid_afterLoadComplete.call(e)},error:function(b,c,d){$(e).triggerHandler("jqGridLoadError",[b,c,d]),$.isFunction(e.p.loadError)&&e.p.loadError.call(e,b,c,d),1===a&&W(),b=null},beforeSend:function(a,b){var c=!0;if(c=$(e).triggerHandler("jqGridLoadBeforeSend",[a,b]),$.isFunction(e.p.loadBeforeSend)&&(c=e.p.loadBeforeSend.call(e,a,b)),void 0===c&&(c=!0),!1===c)return!1;V()}},$.jgrid.ajaxOptions,e.p.ajaxGridOptions));break;case"xmlstring":if(V(),c="string"!=typeof e.p.datastr?e.p.datastr:$.parseXML(e.p.datastr),!X(c,200,null))return void W();R(c),Y(c,h);break;case"jsonstring":if(V(),c="string"==typeof e.p.datastr?$.jgrid.parse(e.p.datastr):e.p.datastr,!X(c,200,null))return void W();S(c),Y(c,h);break;case"local":case"clientside":V(),
e.p.datatype="local",e.p._ald=!0;var r=T(!1);if(!X(r,200,null))return void W();S(r,p,a>1,k),$(e).triggerHandler("jqGridLoadComplete",[r]),i&&i.call(e,r),$(e).triggerHandler("jqGridAfterLoadComplete",[r]),d&&e.grid.populateVisible(),W(),e.p._ald=!1}e.p._sort=!1}},_=function(a){$("#cb_"+$.jgrid.jqID(e.p.id),e.grid.hDiv)[e.p.useProp?"prop":"attr"]("checked",a),(e.p.frozenColumns?e.p.id+"_frozen":"")&&$("#cb_"+$.jgrid.jqID(e.p.id),e.grid.fhDiv)[e.p.useProp?"prop":"attr"]("checked",a)},aa=function(a,b){var c,d,f,g,h,j,k,l="<td class='ui-pg-button "+o+"'><span class='ui-separator'></span></td>",p="",r="<table class='ui-pg-table ui-common-table ui-paging-pager'><tbody><tr>",t="",u=function(a,b){var c;return"stop"!==(c=$(e).triggerHandler("jqGridPaging",[a,b]))&&($.isFunction(e.p.onPaging)&&(c=e.p.onPaging.call(e,a,b)),"stop"!==c&&(e.p.selrow=null,e.p.multiselect&&(e.p.preserveSelection||(e.p.selarrrow=[]),_(!1)),e.p.savedRow=[],!0))};if(a=a.substr(1),b+="_"+a,c="pg_"+a,d=a+"_left",f=a+"_center",g=a+"_right",$("#"+$.jgrid.jqID(a)).append("<div id='"+c+"' class='ui-pager-control' role='group'><table "+m(n,"pagerTable",!1,"ui-pg-table ui-common-table ui-pager-table")+"><tbody><tr><td id='"+d+"' align='left'></td><td id='"+f+"' align='center' style='white-space:pre;'></td><td id='"+g+"' align='right'></td></tr></tbody></table></div>").attr("dir","ltr"),e.p.rowList.length>0){t='<td dir="'+i+'">',t+="<select "+m(n,"pgSelectBox",!1,"ui-pg-selbox")+' size="1" role="listbox" title="'+($.jgrid.getRegional(e,"defaults.pgrecs",e.p.pgrecs)||"")+'">';var v;for(k=0;k<e.p.rowList.length;k++)v=e.p.rowList[k].toString().split(":"),1===v.length&&(v[1]=v[0]),t+='<option role="option" value="'+v[0]+'"'+(C(e.p.rowNum,0)===C(v[0],0)?' selected="selected"':"")+">"+v[1]+"</option>";t+="</select></td>"}if("rtl"===i&&(r+=t),!0===e.p.pginput&&(p="<td id='input"+b+"' dir='"+i+"'>"+$.jgrid.template($.jgrid.getRegional(e,"defaults.pgtext",e.p.pgtext)||"","<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>","<span id='sp_1_"+$.jgrid.jqID(a)+"'></span>")+"</td>"),!0===e.p.pgbuttons){var w=["first"+b,"prev"+b,"next"+b,"last"+b],x=m(n,"pgButtonBox",!0,"ui-pg-button"),y=[$.jgrid.getRegional(e,"defaults.pgfirst",e.p.pgfirst)||"",$.jgrid.getRegional(e,"defaults.pgprev",e.p.pgprev)||"",$.jgrid.getRegional(e,"defaults.pgnext",e.p.pgnext)||"",$.jgrid.getRegional(e,"defaults.pglast",e.p.pglast)||""];"rtl"===i&&(w.reverse(),y.reverse()),r+="<td id='"+w[0]+"' class='"+x+"' title='"+y[0]+"'><span "+m(n,"icon_first",!1,s)+"></span></td>",r+="<td id='"+w[1]+"' class='"+x+"'  title='"+y[1]+"'><span "+m(n,"icon_prev",!1,s)+"></span></td>",r+=""!==p?l+p+l:"",r+="<td id='"+w[2]+"' class='"+x+"' title='"+y[2]+"'><span "+m(n,"icon_next",!1,s)+"></span></td>",r+="<td id='"+w[3]+"' class='"+x+"' title='"+y[3]+"'><span "+m(n,"icon_end",!1,s)+"></span></td>"}else""!==p&&(r+=p);"ltr"===i&&(r+=t),r+="</tr></tbody></table>",!0===e.p.viewrecords&&$("td#"+a+"_"+e.p.recordpos,"#"+c).append("<div dir='"+i+"' style='text-align:"+e.p.recordpos+"' class='ui-paging-info'></div>"),$("td#"+a+"_"+e.p.pagerpos,"#"+c).append(r),j=$("#gbox_"+$.jgrid.jqID(e.p.id)).css("font-size")||"11px",$("#gbox_"+$.jgrid.jqID(e.p.id)).append("<div id='testpg' "+m(n,"entrieBox",!1,"ui-jqgrid")+" style='font-size:"+j+";visibility:hidden;' ></div>"),h=$(r).clone().appendTo("#testpg").width(),$("#testpg").remove(),h>0&&(""!==p&&(h+=50),$("td#"+a+"_"+e.p.pagerpos,"#"+c).width(h)),e.p._nvtd=[],e.p._nvtd[0]=h?Math.floor((e.p.width-h)/2):Math.floor(e.p.width/3),e.p._nvtd[1]=0,r=null,$(".ui-pg-selbox","#"+c).on("change",function(){return!!u("records",this)&&(e.p.page=Math.round(e.p.rowNum*(e.p.page-1)/this.value-.5)+1,e.p.rowNum=this.value,e.p.pager&&$(".ui-pg-selbox",e.p.pager).val(this.value),e.p.toppager&&$(".ui-pg-selbox",e.p.toppager).val(this.value),Z(),!1)}),!0===e.p.pgbuttons&&($(".ui-pg-button","#"+c).hover(function(){$(this).hasClass(o)?this.style.cursor="default":($(this).addClass(q),this.style.cursor="pointer")},function(){$(this).hasClass(o)||($(this).removeClass(q),this.style.cursor="default")}),$("#first"+$.jgrid.jqID(b)+", #prev"+$.jgrid.jqID(b)+", #next"+$.jgrid.jqID(b)+", #last"+$.jgrid.jqID(b)).click(function(){if($(this).hasClass(o))return!1;var a=C(e.p.page,1),c=C(e.p.lastpage,1),d=!1,f=!0,g=!0,h=!0,i=!0;return 0===c||1===c?(f=!1,g=!1,h=!1,i=!1):c>1&&a>=1?1===a?(f=!1,g=!1):a===c&&(h=!1,i=!1):c>1&&0===a&&(h=!1,i=!1,a=c-1),!!u(this.id.split("_")[0],this)&&(this.id==="first"+b&&f&&(e.p.page=1,d=!0),this.id==="prev"+b&&g&&(e.p.page=a-1,d=!0),this.id==="next"+b&&h&&(e.p.page=a+1,d=!0),this.id==="last"+b&&i&&(e.p.page=c,d=!0),d&&Z(),!1)})),!0===e.p.pginput&&$("#"+c).on("keypress","input.ui-pg-input",function(a){return 13===(a.charCode||a.keyCode||0)?!!u("user",this)&&($(this).val(C($(this).val(),1)),e.p.page=$(this).val()>0?$(this).val():e.p.page,Z(),!1):this})},ba=function(a,b,c){var d,f=e.p.colModel,g=e.p.frozenColumns?b:e.grid.headers[a].el,h="";$("span.ui-grid-ico-sort",g).addClass(o),$(g).attr("aria-selected","false"),d=f[a].index||f[a].name,void 0===c?f[a].lso?"asc"===f[a].lso?(f[a].lso+="-desc",h="desc"):"desc"===f[a].lso?(f[a].lso+="-asc",h="asc"):"asc-desc"!==f[a].lso&&"desc-asc"!==f[a].lso||(f[a].lso=""):f[a].lso=h=f[a].firstsortorder||"asc":f[a].lso=h=c,h?($("span.s-ico",g).show(),$("span.ui-icon-"+h,g).removeClass(o),$(g).attr("aria-selected","true")):e.p.viewsortcols[0]||$("span.s-ico",g).hide();var i=v.indexOf(d);-1===i?(v.push(d),w.push(h)):h?w[i]=h:(w.splice(i,1),v.splice(i,1)),e.p.sortorder="",e.p.sortname="";for(var j=0,k=v.length;j<k;j++)j>0&&(e.p.sortname+=", "),e.p.sortname+=v[j],j!==k-1&&(e.p.sortname+=" "+w[j]);e.p.sortorder=w[k-1]},ca=function(a,b,c,d,f){if(e.p.colModel[b].sortable&&!(e.p.savedRow.length>0)){if(c||(e.p.lastsort===b&&""!==e.p.sortname?"asc"===e.p.sortorder?e.p.sortorder="desc":"desc"===e.p.sortorder&&(e.p.sortorder="asc"):e.p.sortorder=e.p.colModel[b].firstsortorder||"asc",e.p.page=1),e.p.multiSort)ba(b,f,d);else{if(d){if(e.p.lastsort===b&&e.p.sortorder===d&&!c)return;e.p.sortorder=d}var g,h=e.grid.headers[e.p.lastsort]?e.grid.headers[e.p.lastsort].el:null,i=e.p.frozenColumns?f:e.grid.headers[b].el,j="single"===e.p.viewsortcols[1];g=$(h).find("span.ui-grid-ico-sort"),g.addClass(o),j&&$(g).css("display","none"),$(h).attr("aria-selected","false"),e.p.frozenColumns&&(g=e.grid.fhDiv.find("span.ui-grid-ico-sort"),g.addClass(o),j&&g.css("display","none"),e.grid.fhDiv.find("th").attr("aria-selected","false")),g=$(i).find("span.ui-icon-"+e.p.sortorder),g.removeClass(o),j&&g.css("display",""),$(i).attr("aria-selected","true"),e.p.viewsortcols[0]||(e.p.lastsort!==b?(e.p.frozenColumns&&e.grid.fhDiv.find("span.s-ico").hide(),$("span.s-ico",h).hide(),$("span.s-ico",i).show()):""===e.p.sortname&&$("span.s-ico",i).show()),a=a.substring(5+e.p.id.length+1),e.p.sortname=e.p.colModel[b].index||a}if("stop"===$(e).triggerHandler("jqGridSortCol",[e.p.sortname,b,e.p.sortorder]))return void(e.p.lastsort=b);if($.isFunction(e.p.onSortCol)&&"stop"===e.p.onSortCol.call(e,e.p.sortname,b,e.p.sortorder))return void(e.p.lastsort=b);if(_(!1),"local"===e.p.datatype?e.p.deselectAfterSort&&!e.p.preserveSelection&&$(e).jqGrid("resetSelection"):(e.p.selrow=null,e.p.multiselect&&(e.p.preserveSelection||(e.p.selarrrow=[])),e.p.savedRow=[]),e.p.scroll){var k=e.grid.bDiv.scrollLeft;L.call(e,!0,!1),e.grid.hDiv.scrollLeft=k}e.p.subGrid&&"local"===e.p.datatype&&$("td.sgexpanded","#"+$.jgrid.jqID(e.p.id)).each(function(){$(this).trigger("click")}),e.p._sort=!0,Z(),e.p.lastsort=b,e.p.sortname!==a&&b&&(e.p.lastsort=b)}},da=function(){var a,b,c,d,g,h=0,i=$.jgrid.cell_width?0:C(e.p.cellLayout,0),j=0,k=C(e.p.scrollOffset,0),l=!1,m=0;$.each(e.p.colModel,function(){if(void 0===this.hidden&&(this.hidden=!1),e.p.grouping&&e.p.autowidth){var a=$.inArray(this.name,e.p.groupingView.groupField);a>=0&&e.p.groupingView.groupColumnShow.length>a&&(this.hidden=!e.p.groupingView.groupColumnShow[a])}this.widthOrg=b=C(this.width,0),!1===this.hidden&&(h+=b+i,this.fixed?m+=b+i:j++)}),isNaN(e.p.width)&&(e.p.width=h+(!1!==e.p.shrinkToFit||isNaN(e.p.height)?0:k)),f.width=parseInt(e.p.width,10),e.p.tblwidth=h,!1===e.p.shrinkToFit&&!0===e.p.forceFit&&(e.p.forceFit=!1),!0===e.p.shrinkToFit&&j>0&&(c=f.width-i*j-m,isNaN(e.p.height)||(c-=k,l=!0),h=0,$.each(e.p.colModel,function(d){!1!==this.hidden||this.fixed||(b=Math.round(c*this.width/(e.p.tblwidth-i*j-m)),this.width=b,h+=b,a=d)}),d=0,g=0===Fa?-1:0,l?f.width-m-(h+i*j)!==k&&(d=f.width-m-(h+i*j)-k):l||0===Math.abs(f.width-m-(h+i*j))||(d=f.width-m-(h+i*j)-Fa),e.p.colModel[a].width+=d+g,e.p.tblwidth=h+d+i*j+m,e.p.tblwidth>e.p.width&&(e.p.colModel[a].width-=e.p.tblwidth-parseInt(e.p.width,10),e.p.tblwidth=e.p.width))},ea=function(a){var b,c=a,d=a;for(b=a+1;b<e.p.colModel.length;b++)if(!0!==e.p.colModel[b].hidden){d=b;break}return d-c},fa=function(a){var b=$(e.grid.headers[a].el),c=[b.position().left+b.outerWidth()];return"rtl"===e.p.direction&&(c[0]=e.p.width-c[0]),c[0]-=e.grid.bDiv.scrollLeft,c.push($(e.grid.hDiv).position().top),c.push($(e.grid.bDiv).offset().top-$(e.grid.hDiv).offset().top+$(e.grid.bDiv).height()),c},ga=function(a){var b,c=e.grid.headers,d=$.jgrid.getCellIndex(a);for(b=0;b<c.length;b++)if(a===c[b].el){d=b;break}return d},ha=function(a,b,c){var d,f,g=e.p.colModel,h=g.length,i=[],j=$.jgrid.getRegional(e,"colmenu"),k='<ul id="col_menu" class="ui-search-menu  ui-col-menu modal-content" role="menu" tabindex="0" style="left:'+b+'px;">';for(d=0;d<h;d++){var l=g[d].hidden?"":"checked",m=g[d].name,n=e.p.colNames[d];f="cb"===m||"subgrid"===m||"rn"===m||g[d].hidedlg?"style='display:none'":"",k+="<li "+f+' class="ui-menu-item" role="presentation" draggable="true"><a class="g-menu-item" tabindex="0" role="menuitem" ><table class="ui-common-table" ><tr><td class="menu_icon" title="'+j.reorder+'"><span class="'+s+" "+t.icon_move+' notclick"></span></td><td class="menu_icon"><input class="'+t.input_checkbox+'" type="checkbox" name="'+m+'" '+l+'></td><td class="menu_text">'+n+"</td></tr></table></a></li>",i.push(d)}k+="</ul>",$(c).append(k),$("#col_menu").addClass("ui-menu "+t.menu_widget),$.jgrid.isElementInViewport($("#col_menu")[0])||$("#col_menu").css("left",-parseInt($("#column_menu").innerWidth(),10)+"px"),$.fn.html5sortable()&&$("#col_menu").html5sortable({handle:"span",forcePlaceholderSize:!0}).on("sortupdate",function(a,b){for(i.splice(b.startindex,1),i.splice(b.endindex,0,b.startindex),$(e).jqGrid("destroyFrozenColumns"),$(e).jqGrid("remapColumns",i,!0),$(e).triggerHandler("jqGridColMenuColumnDone",[i,null,null]),$.isFunction(e.p.colMenuColumnDone)&&e.p.colMenuColumnDone.call(e,i,null,null),$(e).jqGrid("setFrozenColumns"),d=0;d<h;d++)i[d]=d}),$("#col_menu > li > a").on("click",function(a){var b,c;$(a.target).hasClass("notclick")||($(a.target).is(":input")?b=$(a.target).is(":checked"):(b=!$("input",this).is(":checked"),$("input",this).prop("checked",b)),c=$("input",this).attr("name"),$(e).triggerHandler("jqGridColMenuColumnDone",[i,c,b]),$.isFunction(e.p.colMenuColumnDone)&&e.p.colMenuColumnDone.call(e,i,c,b),b?($(e).jqGrid("showCol",c),$(this).parent().attr("draggable","true")):($(e).jqGrid("hideCol",c),$(this).parent().attr("draggable","false")))}).hover(function(){$(this).addClass(q)},function(){$(this).removeClass(q)})},ia=function(a,b,c,d){var f,g,h,i,j,k=e.p.colModel[a],l="",m="",n="",o="",p="",r="",s=["eq","ne","lt","le","gt","ge","nu","nn","in","ni"],u=["eq","ne","bw","bn","ew","en","cn","nc","nu","nn","in","ni"],v=$.jgrid.getRegional(e,"search"),w=$.jgrid.styleUI[e.p.styleUI||"jQueryUI"].common;if(k){f=!(!e.p.colFilters||!e.p.colFilters[k.name])&&e.p.colFilters[k.name],f&&!$.isEmptyObject(f)&&(l=f.oper1,m=f.value1,n=f.rule,o=f.oper2,p=f.value2),k.searchoptions||(k.searchoptions={}),g=k.searchoptions.sopt?k.searchoptions.sopt:"text"===k.sorttype?u:s,h=k.searchoptions.groupOps?k.searchoptions.groupOps:v.groupOps,j=$("<form></form>");var x="<div>"+$.jgrid.getRegional(e,"colmenu.searchTitle")+"</div>";x+='<div><select size="1" id="oper1" class="'+t.filter_select+'">',$.each(v.odata,function(a,b){i=b.oper===l?'selected="selected"':"",-1!==$.inArray(b.oper,g)&&(r+='<option value="'+b.oper+'" '+i+">"+b.text+"</option>")}),x+=r,x+="</select></div>",j.append(x);var y="";k.searchoptions.defaultValue&&(y=$.isFunction(k.searchoptions.defaultValue)?k.searchoptions.defaultValue.call(e):k.searchoptions.defaultValue),m&&(y=m);var z=$.extend(k.searchoptions,{name:k.index||k.name,id:"sval1_"+e.p.idPrefix+k.name,oper:"search"}),A=$.jgrid.createEl.call(e,k.stype,z,y,!1,$.extend({},$.jgrid.ajaxOptions,e.p.ajaxSelectOptions||{}));$(A).addClass(t.filter_input),x=$("<div></div>").append(A),j.append(x),x='<div><select size="1" id="operand" class="'+t.filter_select+'">',$.each(h,function(a,b){i=b.op===n?'selected="selected"':"",x+="<option value='"+b.op+"' "+i+">"+b.text+"</option>"}),x+="</select></div>",j.append(x),r="",$.each(v.odata,function(a,b){i=b.oper===o?'selected="selected"':"",-1!==$.inArray(b.oper,g)&&(r+='<option value="'+b.oper+'" '+i+">"+b.text+"</option>")}),x='<div><select size="1" id="oper2" class="'+t.filter_select+'">'+r+"</select></div>",j.append(x),y=p||"",z=$.extend(k.searchoptions,{name:k.index||k.name,id:"sval2_"+e.p.idPrefix+k.name,oper:"search"}),A=$.jgrid.createEl.call(e,k.stype,z,y,!1,$.extend({},$.jgrid.ajaxOptions,e.p.ajaxSelectOptions||{})),$(A).addClass(t.filter_input),x=$("<div></div>").append(A),j.append(x),x="<div>",x+="<div class='search_buttons'><a tabindex='0' id='bs_reset' class='fm-button "+w.button+" ui-reset'>"+v.Reset+"</a></div>",x+="<div class='search_buttons'><a tabindex='0' id='bs_search' class='fm-button "+w.button+" ui-search'>"+v.Find+"</a></div>",x+="</div>",j.append(x),j=$('<li class="ui-menu-item" role="presentation"></li>').append(j),j=$('<ul id="search_menu" class="ui-search-menu modal-content" role="menu" tabindex="0" style="left:'+c+'px;"></ul>').append(j),$(d).append(j),$("#search_menu").addClass("ui-menu "+t.menu_widget),$.jgrid.isElementInViewport($("#search_menu")[0])||$("#search_menu").css("left",-parseInt($("#column_menu").innerWidth(),10)+"px"),$("#bs_reset, #bs_search","#search_menu").hover(function(){$(this).addClass(q)},function(){$(this).removeClass(q)}),$("#bs_reset",j).on("click",function(a){e.p.colFilters[k.name]={},e.p.postData.filters=ja(),e.p.search=!1,$(e).trigger("reloadGrid"),$("#column_menu").remove()}),$("#bs_search",j).on("click",function(a){e.p.colFilters[k.name]={oper1:$("#oper1","#search_menu").val(),value1:$("#sval1_"+e.p.idPrefix+k.name,"#search_menu").val(),rule:$("#operand","#search_menu").val(),oper2:$("#oper2","#search_menu").val(),value2:$("#sval2_"+e.p.idPrefix+k.name,"#search_menu").val()},e.p.postData.filters=ja(),e.p.search=!0,$(e).trigger("reloadGrid"),$("#column_menu").remove()})}},ja=function(){var a="AND",b='{"groupOp":"'+a+'","rules":[], "groups" : [',c=0;for(var d in e.p.colFilters)if(e.p.colFilters.hasOwnProperty(d)){var f=e.p.colFilters[d];$.isEmptyObject(f)||(c>0&&(b+=","),b+='{"groupOp": "'+f.rule+'", "rules" : [',b+='{"field":"'+d+'",',b+='"op":"'+f.oper1+'",',f.value1+="",b+='"data":"'+f.value1.replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"}',f.value2&&(b+=',{"field":"'+d+'",',b+='"op":"'+f.oper2+'",',f.value2+="",b+='"data":"'+f.value2.replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"}'),b+="]}",c++)}return b+="]}"},ka=function(a,b){var c=e.p.colModel[a],d=e.p.groupingView;-1!==b?d.groupField.splice(b,1):d.groupField.push(c.name),$(e).jqGrid("groupingGroupBy",d.groupField),e.p.frozenColumns&&($(e).jqGrid("destroyFrozenColumns"),$(e).jqGrid("setFrozenColumns"))},la=function(a,b){var c,d=[],f=e.p.colModel.length,g=-1,h=e.p.colModel;for(c=0;c<f;c++)h[c].frozen&&(g=c),d.push(c);d.splice(a,1),d.splice(g+(b?1:0),0,a),h[a].frozen=b,$(e).jqGrid("destroyFrozenColumns"),$(e).jqGrid("remapColumns",d,!0),$(e).jqGrid("setFrozenColumns")},ma=function(a,b,c){var d=$(f.hDiv).height();$(".ui-search-toolbar",f.hDiv)[0]&&!isNaN($(".ui-search-toolbar",f.hDiv).height())&&(d-=$(".ui-search-toolbar",f.hDiv).height()),$(f.cDiv).is(":hidden")||(d+=$(f.cDiv).outerHeight()),e.p.toolbar[1]&&"bottom"!==e.p.toolbar[2]&&null!==$(f.uDiv)&&(d+=$(f.uDiv).outerHeight()),e.p.toppager&&(d+=$("#"+e.p.id+"_toppager").outerHeight()),b=parseInt(b,10),c=parseInt(c,10)+d;var g,h,i='<ul id="column_menu" role="menu" tabindex="0">',j="",k="</ul>",l="",m=e.p.colModel[a],n=$.extend({sorting:!0,columns:!0,filtering:!0,seraching:!0,grouping:!0,freeze:!0},m.coloptions),o=$.jgrid.getRegional(e,"colmenu"),p=e.p.colNames[a],r=[],u=$.trim(m.name);r.push(j),n.sorting&&(j='<li class="ui-menu-item" role="presentation"><a class="g-menu-item" tabindex="0" role="menuitem" data-value="sortasc"><table class="ui-common-table"><tr><td class="menu_icon"><span class="'+s+" "+t.icon_sort_asc+'"></span></td><td class="menu_text">'+o.sortasc+"</td></tr></table></a></li>",j+='<li class="ui-menu-item" role="presentation"><a class="g-menu-item" tabindex="0" role="menuitem" data-value="sortdesc"><table class="ui-common-table"><tr><td class="menu_icon"><span class="'+s+" "+t.icon_sort_desc+'"></span></td><td class="menu_text">'+o.sortdesc+"</td></tr></table></a></li>",r.push(j)),n.columns&&(j='<li class="ui-menu-item divider" role="separator"></li>',j+='<li class="ui-menu-item" role="presentation"><a class="g-menu-item" tabindex="0" role="menuitem" data-value="columns"><table class="ui-common-table"><tr><td class="menu_icon"><span class="'+s+" "+t.icon_columns+'"></span></td><td class="menu_text">'+o.columns+"</td></tr></table></a></li>",r.push(j)),n.filtering&&(j='<li class="ui-menu-item divider" role="separator"></li>',j+='<li class="ui-menu-item" role="presentation"><a class="g-menu-item" tabindex="0" role="menuitem" data-value="filtering"><table class="ui-common-table"><tr><td class="menu_icon"><span class="'+s+" "+t.icon_filter+'"></span></td><td class="menu_text">'+o.filter+" "+p+"</td></tr></table></a></li>",r.push(j)),n.grouping&&(g=$.inArray(m.name,e.p.groupingView.groupField),j='<li class="ui-menu-item divider" role="separator"></li>',j+='<li class="ui-menu-item" role="presentation"><a class="g-menu-item" tabindex="0" role="menuitem" data-value="grouping"><table class="ui-common-table"><tr><td class="menu_icon"><span class="'+s+" "+t.icon_group+'"></span></td><td class="menu_text">'+(-1!==g?o.ungrouping:o.grouping+" "+p)+"</td></tr></table></a></li>",r.push(j)),n.freeze&&(h=!m.frozen||!e.p.frozenColumns,j='<li class="ui-menu-item divider" role="separator"></li>',j+='<li class="ui-menu-item" role="presentation"><a class="g-menu-item" tabindex="0" role="menuitem" data-value="freeze"><table class="ui-common-table"><tr><td class="menu_icon"><span class="'+s+" "+t.icon_freeze+'"></span></td><td class="menu_text">'+(h?o.freeze+" "+p:o.unfreeze)+"</td></tr></table></a></li>",r.push(j));for(var v in e.p.colMenuCustom)if(e.p.colMenuCustom.hasOwnProperty(v)){var w=e.p.colMenuCustom[v],x=w.exclude.split(",");x=$.map(x,function(a){return $.trim(a)}),(w.colname===u||"_all_"===w.colname&&-1===$.inArray(u,x))&&(l='<li class="ui-menu-item divider" role="separator"></li>',j='<li class="ui-menu-item" role="presentation"><a class="g-menu-item" tabindex="0" role="menuitem" data-value="'+w.id+'"><table class="ui-common-table"><tr><td class="menu_icon"><span class="'+s+" "+w.icon+'"></span></td><td class="menu_text">'+w.title+"</td></tr></table></a></li>","last"===w.position?(r.push(l),r.push(j)):"first"===w.position&&(r.unshift(l),r.unshift(j)))}if(r.unshift(i),r.push(k),$("#gbox_"+e.p.id).append(r.join("")),$("#column_menu").addClass("ui-search-menu modal-content column-menu jqgrid-column-menu ui-menu "+t.menu_widget).css({left:b,top:c}),"ltr"===e.p.direction){var y=$("#column_menu").width()+26;$("#column_menu").css("left",b-y+"px")}$("#column_menu > li > a").hover(function(){$("#col_menu").remove(),$("#search_menu").remove();var b,c;"columns"===$(this).attr("data-value")&&(b=$(this).parent().width()+8,c=$(this).parent().position().top-5,ha(c,b,$(this).parent())),"filtering"===$(this).attr("data-value")&&(b=$(this).parent().width()+8,c=$(this).parent().position().top-5,ia(a,c,b,$(this).parent())),$(this).addClass(q)},function(){$(this).removeClass(q)}).click(function(){var b=$(this).attr("data-value"),c=e.grid.headers[a].el;if("sortasc"===b?ca("jqgh_"+e.p.id+"_"+m.name,a,!0,"asc",c):"sortdesc"===b?ca("jqgh_"+e.p.id+"_"+m.name,a,!0,"desc",c):"grouping"===b?ka(a,g):"freeze"===b&&la(a,h),-1===b.indexOf("sort")&&"grouping"!==b&&"freeze"!==b||$(this).remove(),e.p.colMenuCustom.hasOwnProperty(b)){var d=e.p.colMenuCustom[b];$.isFunction(d.funcname)&&(d.funcname.call(e,u),d.closeOnRun&&$(this).remove())}}),parseFloat($("#column_menu").css("left"))<0&&$("#column_menu").css("left",$(e).css("left"))};for((e.p.colMenu||e.p.menubar)&&$("body").on("click",function(a){if(!$(a.target).closest("#column_menu").length)try{$("#column_menu").remove()}catch(a){}if(!$(a.target).closest(".ui-jqgrid-menubar").length)try{$("#"+e.p.id+"_menubar").hide()}catch(a){}}),this.p.id=this.id,-1===$.inArray(e.p.multikey,A)&&(e.p.multikey=!1),e.p.keyName=!1,k=0;k<e.p.colModel.length;k++)z="string"==typeof e.p.colModel[k].template?null!=$.jgrid.cmTemplate&&"object"==typeof $.jgrid.cmTemplate[e.p.colModel[k].template]?$.jgrid.cmTemplate[e.p.colModel[k].template]:{}:e.p.colModel[k].template,e.p.colModel[k]=$.extend(!0,{},e.p.cmTemplate,z||{},e.p.colModel[k]),!1===e.p.keyName&&!0===e.p.colModel[k].key&&(e.p.keyName=e.p.colModel[k].name,e.p.keyIndex=k);if(e.p.sortorder=e.p.sortorder.toLowerCase(),$.jgrid.cell_width=$.jgrid.cellWidth(),!0===e.p.grouping&&(e.p.scroll=!1,e.p.rownumbers=!1,e.p.treeGrid=!1,e.p.gridview=!0),!0===this.p.treeGrid){try{$(this).jqGrid("setTreeGrid")}catch(a){}"local"!==e.p.datatype&&(e.p.localReader={id:"_id_"})}if(this.p.subGrid)try{$(e).jqGrid("setSubGrid")}catch(a){}this.p.multiselect&&(this.p.colNames.unshift("<input role='checkbox' id='cb_"+this.p.id+"' class='cbox' type='checkbox'/>"),this.p.colModel.unshift({name:"cb",width:$.jgrid.cell_width?e.p.multiselectWidth+e.p.cellLayout:e.p.multiselectWidth,sortable:!1,resizable:!1,hidedlg:!0,search:!1,align:"center",fixed:!0,frozen:!0,classes:"jqgrid-multibox"})),this.p.rownumbers&&(this.p.colNames.unshift(""),this.p.colModel.unshift({name:"rn",width:e.p.rownumWidth,sortable:!1,resizable:!1,hidedlg:!0,search:!1,align:"center",fixed:!0,frozen:!0})),e.p.xmlReader=$.extend(!0,{root:"rows",row:"row",page:"rows>page",total:"rows>total",records:"rows>records",repeatitems:!0,cell:"cell",id:"[id]",userdata:"userdata",subgrid:{root:"rows",row:"row",repeatitems:!0,cell:"cell"}},e.p.xmlReader),e.p.jsonReader=$.extend(!0,{root:"rows",page:"page",total:"total",records:"records",repeatitems:!0,cell:"cell",id:"id",userdata:"userdata",subgrid:{root:"rows",repeatitems:!0,cell:"cell"}},e.p.jsonReader),e.p.localReader=$.extend(!0,{root:"rows",page:"page",total:"total",records:"records",repeatitems:!1,cell:"cell",id:"id",userdata:"userdata",subgrid:{root:"rows",repeatitems:!0,cell:"cell"}},e.p.localReader),e.p.scroll&&(e.p.pgbuttons=!1,e.p.pginput=!1,e.p.rowList=[]),e.p.data.length&&(M(),N());var na,oa,pa,qa,ra,sa,ta,ua,va,wa="<thead><tr class='ui-jqgrid-labels' role='row'>",xa="",ya="",za="";if(!0===e.p.shrinkToFit&&!0===e.p.forceFit)for(k=e.p.colModel.length-1;k>=0;k--)if(!e.p.colModel[k].hidden){e.p.colModel[k].resizable=!1;break}if("horizontal"===e.p.viewsortcols[1]?(ya=" ui-i-asc",za=" ui-i-desc"):"single"===e.p.viewsortcols[1]&&(ya=" ui-single-sort-asc",za=" ui-single-sort-desc",xa=" style='display:none'",e.p.viewsortcols[0]=!1),na=u?"class='ui-th-div-ie'":"",ua="<span class='s-ico' style='display:none'>",ua+="<span sort='asc'  class='ui-grid-ico-sort ui-icon-asc"+ya+" ui-sort-"+i+" "+o+" "+s+" "+m(n,"icon_asc",!0)+"'"+xa+"></span>",ua+="<span sort='desc' class='ui-grid-ico-sort ui-icon-desc"+za+" ui-sort-"+i+" "+o+" "+s+" "+m(n,"icon_desc",!0)+"'"+xa+"></span></span>",e.p.multiSort&&e.p.sortname)for(v=e.p.sortname.split(","),k=0;k<v.length;k++)x=$.trim(v[k]).split(" "),v[k]=$.trim(x[0]),w[k]=x[1]?$.trim(x[1]):e.p.sortorder||"asc";for(k=0;k<this.p.colNames.length;k++){var Aa=e.p.headertitles?' title="'+(e.p.colModel[k].tooltip?e.p.colModel[k].tooltip:$.jgrid.stripHtml(e.p.colNames[k]))+'"':"";va=e.p.colModel[k],va.hasOwnProperty("colmenu")||(va.colmenu="rn"!==va.name&&"cb"!==va.name&&"subgrid"!==va.name),wa+="<th id='"+e.p.id+"_"+va.name+"' role='columnheader' "+m(n,"headerBox",!1,"ui-th-column ui-th-"+i+("cb"===va.name?" jqgrid-multibox":""))+" "+Aa+">",oa=va.index||va.name,wa+="<div class='ui-th-div' id='jqgh_"+e.p.id+"_"+va.name+"' "+na+">"+e.p.colNames[k],va.width?va.width=parseInt(va.width,10):va.width=150,"boolean"!=typeof va.title&&(va.title=!0),va.lso="",oa===e.p.sortname&&(e.p.lastsort=k),e.p.multiSort&&-1!==(x=$.inArray(oa,v))&&(va.lso=w[x]),wa+=ua,e.p.colMenu&&va.colmenu&&(wa+="<a class='"+("ltr"===e.p.direction?"colmenu":"colmenu-rtl")+"'><span class='colmenuspan "+s+" "+t.icon_menu+"'></span></a>"),wa+="</div></th>"}if(wa+="</tr></thead>",ua=null,va=null,$(this).append(wa),$("thead tr:first th",this).hover(function(){$(this).addClass(q)},function(){$(this).removeClass(q)}),this.p.multiselect){var Ba,Ca=[];$("#cb_"+$.jgrid.jqID(e.p.id),this).on("click",function(){e.p.preserveSelection||(e.p.selarrrow=[]);var a=!0===e.p.frozenColumns?e.p.id+"_frozen":"";this.checked?($(e.rows).each(function(b){b>0&&($(this).hasClass("ui-subgrid")||$(this).hasClass("jqgroup")||$(this).hasClass(o)||$(this).hasClass("jqfoot")||($("#jqg_"+$.jgrid.jqID(e.p.id)+"_"+$.jgrid.jqID(this.id))[e.p.useProp?"prop":"attr"]("checked",!0),$(this).addClass(p).attr("aria-selected","true"),e.p.preserveSelection?-1===e.p.selarrrow.indexOf(this.id)&&e.p.selarrrow.push(this.id):e.p.selarrrow.push(this.id),e.p.selrow=this.id,a&&($("#jqg_"+$.jgrid.jqID(e.p.id)+"_"+$.jgrid.jqID(this.id),e.grid.fbDiv)[e.p.useProp?"prop":"attr"]("checked",!0),$("#"+$.jgrid.jqID(this.id),e.grid.fbDiv).addClass(p))))}),Ba=!0,Ca=[]):($(e.rows).each(function(b){if(b>0&&!($(this).hasClass("ui-subgrid")||$(this).hasClass("jqgroup")||$(this).hasClass(o)||$(this).hasClass("jqfoot"))){if($("#jqg_"+$.jgrid.jqID(e.p.id)+"_"+$.jgrid.jqID(this.id))[e.p.useProp?"prop":"attr"]("checked",!1),$(this).removeClass(p).attr("aria-selected","false"),Ca.push(this.id),e.p.preserveSelection){var c=e.p.selarrrow.indexOf(this.id);c>-1&&e.p.selarrrow.splice(c,1)}a&&($("#jqg_"+$.jgrid.jqID(e.p.id)+"_"+$.jgrid.jqID(this.id),e.grid.fbDiv)[e.p.useProp?"prop":"attr"]("checked",!1),$("#"+$.jgrid.jqID(this.id),e.grid.fbDiv).removeClass(p))}}),e.p.selrow=null,Ba=!1),$(e).triggerHandler("jqGridSelectAll",[Ba?e.p.selarrrow:Ca,Ba]),$.isFunction(e.p.onSelectAll)&&e.p.onSelectAll.call(e,Ba?e.p.selarrrow:Ca,Ba)})}if(!0===e.p.autowidth){var Da=$(y).parent().width();va=$(window).width(),e.p.width=va-Da>3?Da:va}var Ea="",Fa=-1===e.p.styleUI.search("Bootstrap")||isNaN(e.p.height)?0:2;da(),$(y).css("width",f.width+"px").append("<div class='ui-jqgrid-resize-mark' id='rs_m"+e.p.id+"'>&#160;</div>"),e.p.scrollPopUp&&$(y).append("<div "+m(n,"scrollBox",!1,"loading ui-scroll-popup")+" id='scroll_g"+e.p.id+"'></div>"),$(l).css("width",f.width+"px"),wa=$("thead:first",e).get(0),e.p.footerrow&&(Ea+="<table role='presentation' style='width:"+e.p.tblwidth+"px' "+m(n,"footerTable",!1,"ui-jqgrid-ftable ui-common-table")+"><tbody><tr role='row' "+m(n,"footerBox",!1,"footrow footrow-"+i)+">");var Ga=$("tr:first",wa),Ha="<tr class='jqgfirstrow' role='row'>",Ia=0;if(e.p.disableClick=!1,$("th",Ga).each(function(a){va=e.p.colModel[a],pa=va.width,void 0===va.resizable&&(va.resizable=!0),va.resizable?(qa=document.createElement("span"),$(qa).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-"+i).css("cursor","col-resize"),$(this).addClass(e.p.resizeclass)):qa="",$(this).css("width",pa+"px").prepend(qa),qa=null;var b="";va.hidden&&($(this).css("display","none"),b="display:none;"),Ha+="<td role='gridcell' style='height:0px;width:"+pa+"px;"+b+"'></td>",f.headers[a]={width:pa,el:this},"boolean"!=typeof(xa=va.sortable)&&(va.sortable=!0,xa=!0);var c=va.name;"cb"!==c&&"subgrid"!==c&&"rn"!==c&&e.p.viewsortcols[2]&&$(">div",this).addClass("ui-jqgrid-sortable"),xa&&(e.p.multiSort?e.p.viewsortcols[0]?($("div span.s-ico",this).show(),va.lso&&$("div span.ui-icon-"+va.lso,this).removeClass(o).css("display","")):va.lso&&($("div span.s-ico",this).show(),$("div span.ui-icon-"+va.lso,this).removeClass(o).css("display","")):e.p.viewsortcols[0]?($("div span.s-ico",this).show(),a===e.p.lastsort&&$("div span.ui-icon-"+e.p.sortorder,this).removeClass(o).css("display","")):a===e.p.lastsort&&""!==e.p.sortname&&($("div span.s-ico",this).show(),$("div span.ui-icon-"+e.p.sortorder,this).removeClass(o).css("display",""))),e.p.footerrow&&(Ea+="<td role='gridcell' "+D(a,0,"",null,"",!1)+">&#160;</td>")}).mousedown(function(a){if(1===$(a.target).closest("th>span.ui-jqgrid-resize").length){var b,c=ga(this);return a.preventDefault(),(Ia++,setTimeout(function(){Ia=0},400),2===Ia)?(b=$(e).jqGrid("getCol",c,!1,"maxwidth"),$(e).jqGrid("resizeColumn",c,b),void(Ia=0)):(!0===e.p.forceFit&&(e.p.nv=ea(c)),f.dragStart(c,a,fa(c)),!1)}}).click(function(a){if(e.p.disableClick)return e.p.disableClick=!1,!1;var b,c,d="th>div.ui-jqgrid-sortable";e.p.viewsortcols[2]||(d="th>div>span>span.ui-grid-ico-sort");var f=$(a.target).closest(d);if(1===f.length){var g;if(e.p.frozenColumns){var h=$(this)[0].id.substring(e.p.id.length+1);$(e.p.colModel).each(function(a){if(this.name===h)return g=a,!1})}else g=ga(this);if($(a.target).hasClass("colmenuspan")){null!=$("#column_menu")[0]&&$("#column_menu").remove();var i=$.jgrid.getCellIndex(a.target);if(-1===i)return;var j=$(this).position(),k=j.left,l=j.top;return"ltr"===e.p.direction&&(k+=$(this).outerWidth()),ma(i,k,l,f),!0===e.p.menubar&&$("#"+e.p.id+"_menubar").hide(),void a.stopPropagation()}return e.p.viewsortcols[2]||(b=!0,c=f.attr("sort")),null!=g&&ca($("div",this)[0].id,g,b,c,this),!1}}),va=null,e.p.sortable&&$.fn.sortable)try{$(e).jqGrid("sortableColumns",Ga)}catch(a){}e.p.footerrow&&(Ea+="</tr></tbody></table>"),Ha+="</tr>",ta=document.createElement("tbody"),this.appendChild(ta),$(this).addClass(m(n,"rowTable",!0,"ui-jqgrid-btable ui-common-table")).append(Ha),e.p.altRows&&$(this).addClass(m(n,"stripedTable",!0,"")),Ha=null;var Ja=$("<table "+m(n,"headerTable",!1,"ui-jqgrid-htable ui-common-table")+" style='width:"+e.p.tblwidth+"px' role='presentation' aria-labelledby='gbox_"+this.id+"'></table>").append(wa),Ka=!(!e.p.caption||!0!==e.p.hiddengrid),La=$("<div class='ui-jqgrid-hbox"+("rtl"===i?"-rtl":"")+"'></div>");wa=null,f.hDiv=document.createElement("div"),f.hDiv.style.width=f.width-Fa+"px",f.hDiv.className=m(n,"headerDiv",!0,"ui-jqgrid-hdiv"),$(f.hDiv).append(La),$(La).append(Ja),Ja=null,Ka&&$(f.hDiv).hide(),e.p.pager&&("string"==typeof e.p.pager?"#"!==e.p.pager.substr(0,1)&&(e.p.pager="#"+e.p.pager):e.p.pager="#"+$(e.p.pager).attr("id"),$(e.p.pager).css({width:f.width-Fa+"px"}).addClass(m(n,"pagerBox",!0,"ui-jqgrid-pager")).appendTo(y),Ka&&$(e.p.pager).hide(),aa(e.p.pager,"")),!1===e.p.cellEdit&&!0===e.p.hoverrows&&$(e).on({mouseover:function(a){sa=$(a.target).closest("tr.jqgrow"),"ui-subgrid"!==$(sa).attr("class")&&$(sa).addClass(q)},mouseout:function(a){sa=$(a.target).closest("tr.jqgrow"),$(sa).removeClass(q)}});var Ma,Na,Oa;$(e).before(f.hDiv).on({click:function(a){if(ra=a.target,sa=$(ra,e.rows).closest("tr.jqgrow"),0===$(sa).length||sa[0].className.indexOf(o)>-1||($(ra,e).closest("table.ui-jqgrid-btable").attr("id")||"").replace("_frozen","")!==e.id)return this;var c=$(ra).filter(":enabled").hasClass("cbox"),d=$(e).triggerHandler("jqGridBeforeSelectRow",[sa[0].id,a]);if(d=!1!==d&&"stop"!==d,$.isFunction(e.p.beforeSelectRow)){var f=e.p.beforeSelectRow.call(e,sa[0].id,a);!1!==f&&"stop"!==f||(d=!1)}if("A"!==ra.tagName&&("INPUT"!==ra.tagName&&"TEXTAREA"!==ra.tagName&&"OPTION"!==ra.tagName&&"SELECT"!==ra.tagName||c))if(Ma=sa[0].id,ra=$(ra).closest("tr.jqgrow>td"),
ra.length>0&&(Na=$.jgrid.getCellIndex(ra)),!0!==e.p.cellEdit){if(ra.length>0&&(Oa=$(ra).closest("td,th").html(),$(e).triggerHandler("jqGridCellSelect",[Ma,Na,Oa,a]),$.isFunction(e.p.onCellSelect)&&e.p.onCellSelect.call(e,Ma,Na,Oa,a)),d)if(e.p.multimail&&e.p.multiselect){if(a.shiftKey){if(c){var g=$(e).jqGrid("getGridParam","selrow"),h=$(e).jqGrid("getInd",Ma),i=$(e).jqGrid("getInd",g),j="",k="";h>i?(j=g,k=Ma):(j=Ma,k=g);var l=!1,m=!1,n=!0;return $.inArray(Ma,e.p.selarrrow)>-1&&(n=!1),$.each($(this).getDataIDs(),function(a,b){return(m=b===j||m)&&$(e).jqGrid("resetSelection",b),b!==k}),n&&$.each($(this).getDataIDs(),function(a,b){return(l=b===j||l)&&$(e).jqGrid("setSelection",b,!1),b!==k}),void(e.p.selrow=h>i?k:j)}window.getSelection().removeAllRanges()}b(Ma,c,a,!1)}else e.p.multikey?a[e.p.multikey]?$(e).jqGrid("setSelection",Ma,!0,a):e.p.multiselect&&c&&(c=$("#jqg_"+$.jgrid.jqID(e.p.id)+"_"+Ma).is(":checked"),$("#jqg_"+$.jgrid.jqID(e.p.id)+"_"+Ma)[e.p.useProp?"prop":"attr"]("checked",!c)):b(Ma,c,a,!0)}else if(e.p.multiselect&&c&&d)$(e).jqGrid("setSelection",Ma,!0,a);else if(ra.length>0)try{$(e).jqGrid("editCell",sa[0].rowIndex,Na,!0,a)}catch(a){}},reloadGrid:function(a,b){if(!0===e.p.treeGrid&&(e.p.datatype=e.p.treedatatype),b=b||{},b.current&&e.grid.selectionPreserver(e),"local"===e.p.datatype?($(e).jqGrid("resetSelection"),e.p.data.length&&(M(),N())):e.p.treeGrid||(e.p.selrow=null,e.p.multiselect&&(e.p.preserveSelection||(e.p.selarrrow=[],_(!1))),e.p.savedRow=[]),e.p.scroll&&L.call(e,!0,!1),b.page){var c=b.page;c>e.p.lastpage&&(c=e.p.lastpage),c<1&&(c=1),e.p.page=c,e.grid.prevRowHeight?e.grid.bDiv.scrollTop=(c-1)*e.grid.prevRowHeight*e.p.rowNum:e.grid.bDiv.scrollTop=0}return e.grid.prevRowHeight&&e.p.scroll&&void 0===b.page?(delete e.p.lastpage,e.grid.populateVisible()):e.grid.populate(),!0===e.p.inlineNav&&$(e).jqGrid("showAddEditButtons"),!1},dblclick:function(a){if(ra=a.target,sa=$(ra,e.rows).closest("tr.jqgrow"),0!==$(sa).length){Ma=sa[0].rowIndex,Na=$.jgrid.getCellIndex(ra);var b=$(e).triggerHandler("jqGridDblClickRow",[$(sa).attr("id"),Ma,Na,a]);return null!=b?b:$.isFunction(e.p.ondblClickRow)&&null!=(b=e.p.ondblClickRow.call(e,$(sa).attr("id"),Ma,Na,a))?b:void 0}},contextmenu:function(a){if(ra=a.target,sa=$(ra,e.rows).closest("tr.jqgrow"),0!==$(sa).length){e.p.multiselect||$(e).jqGrid("setSelection",sa[0].id,!0,a),Ma=sa[0].rowIndex,Na=$.jgrid.getCellIndex(ra);var b=$(e).triggerHandler("jqGridRightClickRow",[$(sa).attr("id"),Ma,Na,a]);return null!=b?b:$.isFunction(e.p.onRightClickRow)&&null!=(b=e.p.onRightClickRow.call(e,$(sa).attr("id"),Ma,Na,a))?b:void 0}}}),f.bDiv=document.createElement("div"),u&&"auto"===String(e.p.height).toLowerCase()&&(e.p.height="100%"),$(f.bDiv).append($('<div style="position:relative;"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({height:e.p.height+(isNaN(e.p.height)?"":"px"),width:f.width-Fa+"px"}).scroll(f.scrollGrid),$("table:first",f.bDiv).css({width:e.p.tblwidth+"px"}),$.support.tbody||2===$("tbody",this).length&&$("tbody:gt(0)",this).remove(),e.p.multikey&&($.jgrid.msie()?$(f.bDiv).on("selectstart",function(){return!1}):$(f.bDiv).on("mousedown",function(){return!1})),Ka&&$(f.bDiv).hide();var Pa=s+" "+m(n,"icon_caption_open",!0),Qa=s+" "+m(n,"icon_caption_close",!0);f.cDiv=document.createElement("div");var Ra=!0===e.p.hidegrid?$("<a role='link' class='ui-jqgrid-titlebar-close HeaderButton "+r+"' title='"+($.jgrid.getRegional(e,"defaults.showhide",e.p.showhide)||"")+"' />").hover(function(){Ra.addClass(q)},function(){Ra.removeClass(q)}).append("<span class='ui-jqgrid-headlink "+Pa+"'></span>").css("rtl"===i?"left":"right","0px"):"";if($(f.cDiv).append(Ra).append("<span class='ui-jqgrid-title'>"+e.p.caption+"</span>").addClass("ui-jqgrid-titlebar ui-jqgrid-caption"+("rtl"===i?"-rtl":"")+" "+m(n,"gridtitleBox",!0)),!0===e.p.menubar){var Sa='<ul id="'+e.p.id+'_menubar" class="ui-search-menu modal-content column-menu ui-menu jqgrid-caption-menu '+t.menu_widget+'" role="menubar" tabindex="0"></ul>';$("#gbox_"+e.p.id).append(Sa),$(f.cDiv).append("<a role='link' class='ui-jqgrid-menubar menubar-"+("rtl"===i?"rtl":"ltr")+"' style=''><span class='colmenuspan "+s+" "+t.icon_toolbar_menu+"'></span></a>"),$(".ui-jqgrid-menubar",f.cDiv).hover(function(){$(this).addClass(q)},function(){$(this).removeClass(q)}).on("click",function(a){var b=$(a.target).position();$("#"+e.p.id+"_menubar").show(),"rtl"===e.p.direction&&$("#"+e.p.id+"_menubar").css({left:b.left-$("#"+e.p.id+"_menubar").width()-20})})}if($(f.cDiv).insertBefore(f.hDiv),e.p.toolbar[0]){var Ta=m(n,"customtoolbarBox",!0,"ui-userdata");f.uDiv=document.createElement("div"),"top"===e.p.toolbar[1]?$(f.uDiv).insertBefore(f.hDiv):"bottom"===e.p.toolbar[1]&&$(f.uDiv).insertAfter(f.hDiv),"both"===e.p.toolbar[1]?(f.ubDiv=document.createElement("div"),$(f.uDiv).addClass(Ta+" ui-userdata-top").attr("id","t_"+this.id).insertBefore(f.hDiv).width(f.width-Fa),$(f.ubDiv).addClass(Ta+" ui-userdata-bottom").attr("id","tb_"+this.id).insertAfter(f.hDiv).width(f.width-Fa),Ka&&$(f.ubDiv).hide()):$(f.uDiv).width(f.width-Fa).addClass(Ta+" ui-userdata-top").attr("id","t_"+this.id),Ka&&$(f.uDiv).hide()}if(e.p.toppager&&(e.p.toppager=$.jgrid.jqID(e.p.id)+"_toppager",f.topDiv=$("<div id='"+e.p.toppager+"'></div>")[0],e.p.toppager="#"+e.p.toppager,$(f.topDiv).addClass(m(n,"toppagerBox",!0,"ui-jqgrid-toppager")).width(f.width-Fa).insertBefore(f.hDiv),aa(e.p.toppager,"_t")),e.p.footerrow&&(f.sDiv=$("<div class='ui-jqgrid-sdiv'></div>")[0],La=$("<div class='ui-jqgrid-hbox"+("rtl"===i?"-rtl":"")+"'></div>"),$(f.sDiv).append(La).width(f.width-Fa).insertAfter(f.hDiv),$(La).append(Ea),f.footers=$(".ui-jqgrid-ftable",f.sDiv)[0].rows[0].cells,e.p.rownumbers&&(f.footers[0].className=m(n,"rownumBox",!0,"jqgrid-rownum")),Ka&&$(f.sDiv).hide()),La=null,e.p.caption){var Ua=e.p.datatype;!0===e.p.hidegrid&&($(".ui-jqgrid-titlebar-close",f.cDiv).click(function(a){var b,c=$.isFunction(e.p.onHeaderClick),d=".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-toppager, .ui-jqgrid-pager, .ui-jqgrid-sdiv",g=this;return!0===e.p.toolbar[0]&&("both"===e.p.toolbar[1]&&(d+=", #"+$(f.ubDiv).attr("id")),d+=", #"+$(f.uDiv).attr("id")),b=$(d,"#gview_"+$.jgrid.jqID(e.p.id)).length,"visible"===e.p.gridstate?$(d,"#gbox_"+$.jgrid.jqID(e.p.id)).slideUp("fast",function(){0===--b&&($("span",g).removeClass(Pa).addClass(Qa),e.p.gridstate="hidden",$("#gbox_"+$.jgrid.jqID(e.p.id)).hasClass("ui-resizable")&&$(".ui-resizable-handle","#gbox_"+$.jgrid.jqID(e.p.id)).hide(),$(e).triggerHandler("jqGridHeaderClick",[e.p.gridstate,a]),c&&(Ka||e.p.onHeaderClick.call(e,e.p.gridstate,a)))}):"hidden"===e.p.gridstate&&$(d,"#gbox_"+$.jgrid.jqID(e.p.id)).slideDown("fast",function(){0===--b&&($("span",g).removeClass(Qa).addClass(Pa),Ka&&(e.p.datatype=Ua,Z(),Ka=!1),e.p.gridstate="visible",$("#gbox_"+$.jgrid.jqID(e.p.id)).hasClass("ui-resizable")&&$(".ui-resizable-handle","#gbox_"+$.jgrid.jqID(e.p.id)).show(),$(e).triggerHandler("jqGridHeaderClick",[e.p.gridstate,a]),c&&(Ka||e.p.onHeaderClick.call(e,e.p.gridstate,a)))}),!1}),Ka&&(e.p.datatype="local",$(".ui-jqgrid-titlebar-close",f.cDiv).trigger("click")))}else $(f.cDiv).hide(),e.p.toppager||$(f.hDiv).addClass(m(e.p.styleUI+".common","cornertop",!0));if($(f.hDiv).after(f.bDiv).mousemove(function(a){if(f.resizing)return f.dragMove(a),!1}),$(".ui-jqgrid-labels",f.hDiv).on("selectstart",function(){return!1}),$(document).on("mouseup.jqGrid"+e.p.id,function(){return!f.resizing||(f.dragEnd(!0),!1)}),"rtl"===e.p.direction&&$(e).on("jqGridAfterGridComplete.setRTLPadding",function(){var a=f.bDiv.offsetWidth-f.bDiv.clientWidth,b=$("div:first",f.hDiv);a>0&&(a+=2),b.hasClass("ui-jqgrid-hbox-rtl")&&$("div:first",f.hDiv).css({paddingLeft:a+"px"}),f.hDiv.scrollLeft=f.bDiv.scrollLeft}),e.p.autoResizing&&$(e).on("jqGridAfterGridComplete.setAutoSizeColumns",function(){$(e.p.colModel).each(function(a){this.autosize&&this._maxsize&&this._maxsize>0&&($(e).jqGrid("resizeColumn",a,this._maxsize),this._maxsize=0)})}),e.formatCol=D,e.sortData=ca,e.updatepager=U,e.refreshIndex=N,e.setHeadCheckBox=_,e.constructTr=O,e.formatter=function(a,b,c,d,e){return F(a,b,c,d,e)},$.extend(f,{populate:Z,emptyRows:L,beginReq:V,endReq:W}),this.grid=f,e.addXmlData=function(a){R(a)},e.addJSONData=function(a){S(a)},e.addLocalData=function(a){return T(a)},e.treeGrid_beforeRequest=function(){P()},e.treeGrid_afterLoadComplete=function(){Q()},this.grid.cols=this.rows[0].cells,$.isFunction(e.p.onInitGrid)&&e.p.onInitGrid.call(e),$(e).triggerHandler("jqGridInitGrid"),Z(),e.p.hiddengrid=!1,e.p.responsive){var Va="onorientationchange"in window,Wa=Va?"orientationchange":"resize";$(window).on(Wa,function(){$(e).jqGrid("resizeGrid")})}}})},$.jgrid.extend({getGridParam:function(a,b){var c,d=this[0];if(d&&d.grid){if(void 0===b&&"string"!=typeof b&&(b="jqGrid"),c=d.p,"jqGrid"!==b)try{c=$(d).data(b)}catch(a){c=d.p}return a?void 0!==c[a]?c[a]:null:c}},setGridParam:function(a,b){return this.each(function(){if(null==b&&(b=!1),this.grid&&"object"==typeof a)if(!0===b){var c=$.extend({},this.p,a);this.p=c}else $.extend(!0,this.p,a)})},getGridRowById:function(a){var b;return this.each(function(){try{for(var c=this.rows.length;c--;)if(a.toString()===this.rows[c].id){b=this.rows[c];break}}catch(c){b=$(this.grid.bDiv).find("#"+$.jgrid.jqID(a))}}),b},getDataIDs:function(){var a,b=[],c=0,d=0;return this.each(function(){if((a=this.rows.length)&&a>0)for(;c<a;)$(this.rows[c]).hasClass("jqgrow")&&(b[d]=this.rows[c].id,d++),c++}),b},setSelection:function(a,b,c){return this.each(function(){function d(a){var b=$(l.grid.bDiv)[0].clientHeight,c=$(l.grid.bDiv)[0].scrollTop,d=$(l.rows[a]).position().top,e=l.rows[a].clientHeight;d+e>=b+c?$(l.grid.bDiv)[0].scrollTop=d-(b+c)+e+c:d<b+c&&d<c&&($(l.grid.bDiv)[0].scrollTop=d)}var e,f,g,h,i,j,k,l=this,m=$.jgrid.getMethod("getStyleUI"),n=m(l.p.styleUI+".common","highlight",!0),o=m(l.p.styleUI+".common","disabled",!0);void 0!==a&&(b=!1!==b,!(f=$(l).jqGrid("getGridRowById",a))||!f.className||f.className.indexOf(o)>-1||(!0===l.p.scrollrows&&(g=$(l).jqGrid("getGridRowById",a).rowIndex)>=0&&d(g),!0===l.p.frozenColumns&&(j=l.p.id+"_frozen"),l.p.multiselect?(l.setHeadCheckBox(!1),l.p.selrow=f.id,h=$.inArray(l.p.selrow,l.p.selarrrow),-1===h?("ui-subgrid"!==f.className&&$(f).addClass(n).attr("aria-selected","true"),e=!0,l.p.selarrrow.push(l.p.selrow)):-1!==h&&"_sp_"===c?("ui-subgrid"!==f.className&&$(f).addClass(n).attr("aria-selected","true"),e=!0):("ui-subgrid"!==f.className&&$(f).removeClass(n).attr("aria-selected","false"),e=!1,l.p.selarrrow.splice(h,1),i=l.p.selarrrow[0],l.p.selrow=void 0===i?null:i),$("#jqg_"+$.jgrid.jqID(l.p.id)+"_"+$.jgrid.jqID(f.id))[l.p.useProp?"prop":"attr"]("checked",e),j&&(-1===h?$("#"+$.jgrid.jqID(a),"#"+$.jgrid.jqID(j)).addClass(n):$("#"+$.jgrid.jqID(a),"#"+$.jgrid.jqID(j)).removeClass(n),$("#jqg_"+$.jgrid.jqID(l.p.id)+"_"+$.jgrid.jqID(a),"#"+$.jgrid.jqID(j))[l.p.useProp?"prop":"attr"]("checked",e)),b&&($(l).triggerHandler("jqGridSelectRow",[f.id,e,c]),l.p.onSelectRow&&l.p.onSelectRow.call(l,f.id,e,c))):"ui-subgrid"!==f.className&&(l.p.selrow!==f.id?(k=$(l).jqGrid("getGridRowById",l.p.selrow),k&&$(k).removeClass(n).attr({"aria-selected":"false",tabindex:"-1"}),$(f).addClass(n).attr({"aria-selected":"true",tabindex:"0"}),j&&($("#"+$.jgrid.jqID(l.p.selrow),"#"+$.jgrid.jqID(j)).removeClass(n),$("#"+$.jgrid.jqID(a),"#"+$.jgrid.jqID(j)).addClass(n)),e=!0):e=!1,l.p.selrow=f.id,b&&($(l).triggerHandler("jqGridSelectRow",[f.id,e,c]),l.p.onSelectRow&&l.p.onSelectRow.call(l,f.id,e,c)))))})},resetSelection:function(a){return this.each(function(){var b,c,d=this,e=$.jgrid.getMethod("getStyleUI"),f=e(d.p.styleUI+".common","highlight",!0),g=e(d.p.styleUI+".common","hover",!0);if(!0===d.p.frozenColumns&&(c=d.p.id+"_frozen"),void 0!==a){if(b=a===d.p.selrow?d.p.selrow:a,$("#"+$.jgrid.jqID(d.p.id)+" tbody:first tr#"+$.jgrid.jqID(b)).removeClass(f).attr("aria-selected","false"),c&&$("#"+$.jgrid.jqID(b),"#"+$.jgrid.jqID(c)).removeClass(f),d.p.multiselect){$("#jqg_"+$.jgrid.jqID(d.p.id)+"_"+$.jgrid.jqID(b),"#"+$.jgrid.jqID(d.p.id))[d.p.useProp?"prop":"attr"]("checked",!1),c&&$("#jqg_"+$.jgrid.jqID(d.p.id)+"_"+$.jgrid.jqID(b),"#"+$.jgrid.jqID(c))[d.p.useProp?"prop":"attr"]("checked",!1),d.setHeadCheckBox(!1);var h=$.inArray($.jgrid.jqID(b),d.p.selarrrow);-1!==h&&d.p.selarrrow.splice(h,1)}d.p.onUnSelectRow&&d.p.onUnSelectRow.call(d,b),b=null}else d.p.multiselect?($(d.p.selarrrow).each(function(a,b){$($(d).jqGrid("getGridRowById",b)).removeClass(f).attr("aria-selected","false"),$("#jqg_"+$.jgrid.jqID(d.p.id)+"_"+$.jgrid.jqID(b))[d.p.useProp?"prop":"attr"]("checked",!1),c&&($("#"+$.jgrid.jqID(b),"#"+$.jgrid.jqID(c)).removeClass(f),$("#jqg_"+$.jgrid.jqID(d.p.id)+"_"+$.jgrid.jqID(b),"#"+$.jgrid.jqID(c))[d.p.useProp?"prop":"attr"]("checked",!1)),d.p.onUnSelectRow&&d.p.onUnSelectRow.call(d,b)}),d.setHeadCheckBox(!1),d.p.selarrrow=[],d.p.selrow=null):d.p.selrow&&($("#"+$.jgrid.jqID(d.p.id)+" tbody:first tr#"+$.jgrid.jqID(d.p.selrow)).removeClass(f).attr("aria-selected","false"),c&&$("#"+$.jgrid.jqID(d.p.selrow),"#"+$.jgrid.jqID(c)).removeClass(f),d.p.onUnSelectRow&&d.p.onUnSelectRow.call(d,d.p.selrow),d.p.selrow=null);!0===d.p.cellEdit&&parseInt(d.p.iCol,10)>=0&&parseInt(d.p.iRow,10)>=0&&($("td:eq("+d.p.iCol+")",d.rows[d.p.iRow]).removeClass("edit-cell "+f),$(d.rows[d.p.iRow]).removeClass("selected-row "+g))})},getRowData:function(a,b){var c,d,e={},f=!1,g=0;return this.each(function(){var h,i,j=this;if(null==a)f=!0,c=[],d=j.rows.length;else{if(!(i=$(j).jqGrid("getGridRowById",a)))return e;d=1}for(b&&!0===b&&j.p.data.length>0||(b=!1);g<d;)f&&(i=j.rows[g]),$(i).hasClass("jqgrow")&&(b?e=j.p.data[j.p._index[i.id]]:$('td[role="gridcell"]',i).each(function(a){if("cb"!==(h=j.p.colModel[a].name)&&"subgrid"!==h&&"rn"!==h)if(!0===j.p.treeGrid&&h===j.p.ExpandColumn)e[h]=$.jgrid.htmlDecode($("span:first",this).html());else try{e[h]=$.unformat.call(j,this,{rowId:i.id,colModel:j.p.colModel[a]},a)}catch(a){e[h]=$.jgrid.htmlDecode($(this).html())}}),f&&(c.push(e),e={})),g++}),c||e},delRowData:function(a){var b,c,d,e=!1;return this.each(function(){var f=this;if(!(b=$(f).jqGrid("getGridRowById",a)))return!1;if(a=b.id,f.p.subGrid&&(d=$(b).next(),d.hasClass("ui-subgrid")&&d.remove()),$(b).remove(),f.p.records--,f.p.reccount--,f.updatepager(!0,!1),e=!0,f.p.multiselect&&-1!==(c=$.inArray(a,f.p.selarrrow))&&f.p.selarrrow.splice(c,1),f.p.multiselect&&f.p.selarrrow.length>0?f.p.selrow=f.p.selarrrow[f.p.selarrrow.length-1]:f.p.selrow===a&&(f.p.selrow=null),"local"===f.p.datatype){var g=$.jgrid.stripPref(f.p.idPrefix,a),h=f.p._index[g];void 0!==h&&(f.p.data.splice(h,1),f.refreshIndex())}}),e},setRowData:function(a,b,c){var d,e,f=!0;return this.each(function(){if(!this.grid)return!1;var g,h,i=this,j=typeof c,k={};if(!(h=$(this).jqGrid("getGridRowById",a)))return!1;if(b)try{if($(this.p.colModel).each(function(c){d=this.name;var f=$.jgrid.getAccessor(b,d);void 0!==f&&(k[d]=this.formatter&&"string"==typeof this.formatter&&"date"===this.formatter?$.unformat.date.call(i,f,this):f,g=i.formatter(a,k[d],c,b,"edit"),e=this.title?{title:$.jgrid.stripHtml(g)}:{},!0===i.p.treeGrid&&d===i.p.ExpandColumn?$("td[role='gridcell']:eq("+c+") > span:first",h).html(g).attr(e):$("td[role='gridcell']:eq("+c+")",h).html(g).attr(e))}),"local"===i.p.datatype){var l,m=$.jgrid.stripPref(i.p.idPrefix,a),n=i.p._index[m];if(i.p.treeGrid)for(l in i.p.treeReader)i.p.treeReader.hasOwnProperty(l)&&delete k[i.p.treeReader[l]];void 0!==n&&(i.p.data[n]=$.extend(!0,i.p.data[n],k)),k=null}}catch(a){f=!1}f&&("string"===j?$(h).addClass(c):null!==c&&"object"===j&&$(h).css(c),$(i).triggerHandler("jqGridAfterGridComplete"))}),f},addRowData:function(a,b,c,d){-1===$.inArray(c,["first","last","before","after"])&&(c="last");var e,f,g,h,i,j,k,l,m,n,o,p,q,r=!1,s="",t="",u="";return b&&($.isArray(b)?(m=!0,n=a):(b=[b],m=!1),this.each(function(){var v=this,w=b.length;i=!0===v.p.rownumbers?1:0,g=!0===v.p.multiselect?1:0,h=!0===v.p.subGrid?1:0,m||(void 0!==a?a=String(a):(a=$.jgrid.randId(),!1!==v.p.keyName&&(n=v.p.keyName,void 0!==b[0][n]&&(a=b[0][n]))));var x=0,y=$(v).jqGrid("getStyleUI",v.p.styleUI+".base","rowBox",!0,"jqgrow ui-row-"+v.p.direction),z={},A=!!$.isFunction(v.p.afterInsertRow);for(i&&(s=$(v).jqGrid("getStyleUI",v.p.styleUI+".base","rownumBox",!1,"jqgrid-rownum")),g&&(t=$(v).jqGrid("getStyleUI",v.p.styleUI+".base","multiBox",!1,"cbox"));x<w;){if(o=b[x],f=[],m)try{a=o[n],void 0===a&&(a=$.jgrid.randId())}catch(b){a=$.jgrid.randId()}for(q=a,a=v.p.idPrefix+a,i&&(u=v.formatCol(0,1,"",null,a,!0),f[f.length]='<td role="gridcell" '+s+" "+u+">0</td>"),g&&(l='<input role="checkbox" type="checkbox" id="jqg_'+v.p.id+"_"+a+'" '+t+"/>",u=v.formatCol(i,1,"",null,a,!0),f[f.length]='<td role="gridcell" '+u+">"+l+"</td>"),h&&(f[f.length]=$(v).jqGrid("addSubGridCell",g+i,1)),k=g+h+i;k<v.p.colModel.length;k++)p=v.p.colModel[k],e=p.name,z[e]=o[e],l=v.formatter(a,$.jgrid.getAccessor(o,e),k,o),u=v.formatCol(k,1,l,o,a,z),f[f.length]='<td role="gridcell" '+u+">"+l+"</td>";if(f.unshift(v.constructTr(a,!1,y,z,o)),f[f.length]="</tr>",0===v.rows.length)$("table:first",v.grid.bDiv).append(f.join(""));else switch(c){case"last":$(v.rows[v.rows.length-1]).after(f.join("")),j=v.rows.length-1;break;case"first":$(v.rows[0]).after(f.join("")),j=1;break;case"after":j=$(v).jqGrid("getGridRowById",d),j&&($(v.rows[j.rowIndex+1]).hasClass("ui-subgrid")?$(v.rows[j.rowIndex+1]).after(f):$(j).after(f.join("")),j=j.rowIndex+1);break;case"before":j=$(v).jqGrid("getGridRowById",d),j&&($(j).before(f.join("")),j=j.rowIndex-1)}!0===v.p.subGrid&&$(v).jqGrid("addSubGrid",g+i,j),v.p.records++,v.p.reccount++,$(v).triggerHandler("jqGridAfterInsertRow",[a,o,o]),A&&v.p.afterInsertRow.call(v,a,o,o),x++,"local"===v.p.datatype&&(z[v.p.localReader.id]=q,v.p._index[q]=v.p.data.length,v.p.data.push(z),z={})}v.updatepager(!0,!0),r=!0})),r},footerData:function(a,b,c){function d(a){var b;for(b in a)if(a.hasOwnProperty(b))return!1;return!0}var e,f,g=!1,h={};return void 0===a&&(a="get"),"boolean"!=typeof c&&(c=!0),a=a.toLowerCase(),this.each(function(){var i,j=this;return!(!j.grid||!j.p.footerrow)&&(("set"!==a||!d(b))&&(g=!0,void $(this.p.colModel).each(function(d){e=this.name,"set"===a?void 0!==b[e]&&(i=c?j.formatter("",b[e],d,b,"edit"):b[e],f=this.title?{title:$.jgrid.stripHtml(i)}:{},$("tr.footrow td:eq("+d+")",j.grid.sDiv).html(i).attr(f),g=!0):"get"===a&&(h[e]=$("tr.footrow td:eq("+d+")",j.grid.sDiv).html())})))}),"get"===a?h:g},showHideCol:function(a,b){return this.each(function(){var c,d=this,e=!1,f=$.jgrid.cell_width?0:d.p.cellLayout;if(d.grid){"string"==typeof a&&(a=[a]),b="none"!==b?"":"none";var g=""===b,h=d.p.groupHeader&&($.isArray(d.p.groupHeader)||$.isFunction(d.p.groupHeader));if(h&&$(d).jqGrid("destroyGroupHeader",!1),$(this.p.colModel).each(function(h){if(-1!==$.inArray(this.name,a)&&this.hidden===g){if(!0===d.p.frozenColumns&&!0===this.frozen)return!0;$("tr[role=row]",d.grid.hDiv).each(function(){$(this.cells[h]).css("display",b)}),$(d.rows).each(function(){$(this).hasClass("jqgroup")||$(this.cells[h]).css("display",b)}),d.p.footerrow&&$("tr.footrow td:eq("+h+")",d.grid.sDiv).css("display",b),c=parseInt(this.width,10),"none"===b?d.p.tblwidth-=c+f:d.p.tblwidth+=c+f,this.hidden=!g,e=!0,$(d).triggerHandler("jqGridShowHideCol",[g,this.name,h])}}),!0===e&&(!0!==d.p.shrinkToFit||isNaN(d.p.height)||(d.p.tblwidth+=parseInt(d.p.scrollOffset,10)),$(d).jqGrid("setGridWidth",!0===d.p.shrinkToFit?d.p.tblwidth:d.p.width)),h){var i=$.extend([],d.p.groupHeader);d.p.groupHeader=null;for(var j=0;j<i.length;j++)$(d).jqGrid("setGroupHeaders",i[j])}}})},hideCol:function(a){return this.each(function(){$(this).jqGrid("showHideCol",a,"none")})},showCol:function(a){return this.each(function(){$(this).jqGrid("showHideCol",a,"")})},remapColumns:function(a,b,c){function d(b){var c;c=b.length?$.makeArray(b):$.extend({},b),$.each(a,function(a){b[a]=c[this]})}function e(b,c){$(">tr"+(c||""),b).each(function(){var b=this,c=$.makeArray(b.cells);$.each(a,function(){var a=c[this];a&&b.appendChild(a)})})}var f=this.get(0);d(f.p.colModel),d(f.p.colNames),d(f.grid.headers),e($("thead:first",f.grid.hDiv),c&&":not(.ui-jqgrid-labels)"),b&&e($("#"+$.jgrid.jqID(f.p.id)+" tbody:first"),".jqgfirstrow, tr.jqgrow, tr.jqfoot"),f.p.footerrow&&e($("tbody:first",f.grid.sDiv)),f.p.remapColumns&&(f.p.remapColumns.length?d(f.p.remapColumns):f.p.remapColumns=$.makeArray(a)),f.p.lastsort=$.inArray(f.p.lastsort,a),f.p.treeGrid&&(f.p.expColInd=$.inArray(f.p.expColInd,a)),$(f).triggerHandler("jqGridRemapColumns",[a,b,c])},setGridWidth:function(a,b){return this.each(function(){if(this.grid){var c,d,e,f,g,h=this,i=0,j=$.jgrid.cell_width?0:h.p.cellLayout,k=0,l=!1,m=h.p.scrollOffset,n=0,o=-1===h.p.styleUI.search("Bootstrap")||isNaN(h.p.height)?0:2;if("boolean"!=typeof b&&(b=h.p.shrinkToFit),!isNaN(a)){if(a=parseInt(a,10),h.grid.width=h.p.width=a,$("#gbox_"+$.jgrid.jqID(h.p.id)).css("width",a+"px"),$("#gview_"+$.jgrid.jqID(h.p.id)).css("width",a+"px"),$(h.grid.bDiv).css("width",a-o+"px"),$(h.grid.hDiv).css("width",a-o+"px"),h.p.pager&&$(h.p.pager).css("width",a-o+"px"),h.p.toppager&&$(h.p.toppager).css("width",a-o+"px"),!0===h.p.toolbar[0]&&($(h.grid.uDiv).css("width",a-o+"px"),"both"===h.p.toolbar[1]&&$(h.grid.ubDiv).css("width",a-o+"px")),h.p.footerrow&&$(h.grid.sDiv).css("width",a-o+"px"),d=h.p.groupHeader&&($.isArray(h.p.groupHeader)||$.isFunction(h.p.groupHeader)),d&&$(h).jqGrid("destroyGroupHeader",!1),!1===b&&!0===h.p.forceFit&&(h.p.forceFit=!1),!0===b){if($.each(h.p.colModel,function(){!1===this.hidden&&(c=this.widthOrg,i+=c+j,this.fixed?n+=c+j:k++)}),0===k)return;h.p.tblwidth=i,f=a-j*k-n,isNaN(h.p.height)||($(h.grid.bDiv)[0].clientHeight<$(h.grid.bDiv)[0].scrollHeight||1===h.rows.length||"scroll"===$(h.grid.bDiv).css("overflow-y"))&&(l=!0,f-=m),i=0;var p=h.grid.cols.length>0;if($.each(h.p.colModel,function(a){if(!1===this.hidden&&!this.fixed){if(c=this.widthOrg,(c=Math.round(f*c/(h.p.tblwidth-j*k-n)))<0)return;this.width=c,i+=c,h.grid.headers[a].width=c,h.grid.headers[a].el.style.width=c+"px",h.p.footerrow&&(h.grid.footers[a].style.width=c+"px"),p&&(h.grid.cols[a].style.width=c+"px"),e=a}}),!e)return;if(g=0,l?a-n-(i+j*k)!==m&&(g=a-n-(i+j*k)-m):l||0===Math.abs(a-n-(i+j*k))||(g=a-n-(i+j*k)-o),h.p.colModel[e].width+=g,h.p.tblwidth=i+g+j*k+n,h.p.tblwidth>a){var q=h.p.tblwidth-parseInt(a,10);h.p.tblwidth=a,c=h.p.colModel[e].width=h.p.colModel[e].width-q}else c=h.p.colModel[e].width;h.grid.headers[e].width=c,h.grid.headers[e].el.style.width=c+"px",p&&(h.grid.cols[e].style.width=c+"px"),h.p.footerrow&&(h.grid.footers[e].style.width=c+"px")}if(h.p.tblwidth&&($("table:first",h.grid.bDiv).css("width",h.p.tblwidth+"px"),$("table:first",h.grid.hDiv).css("width",h.p.tblwidth+"px"),h.grid.hDiv.scrollLeft=h.grid.bDiv.scrollLeft,h.p.footerrow&&$("table:first",h.grid.sDiv).css("width",h.p.tblwidth+"px")),d){var r=$.extend([],h.p.groupHeader);h.p.groupHeader=null;for(var s=0;s<r.length;s++)$(h).jqGrid("setGroupHeaders",r[s]);h.grid.hDiv.scrollLeft=h.grid.bDiv.scrollLeft}}}})},setGridHeight:function(a){return this.each(function(){var b=this;if(b.grid){var c=$(b.grid.bDiv);c.css({height:a+(isNaN(a)?"":"px")}),!0===b.p.frozenColumns&&$("#"+$.jgrid.jqID(b.p.id)+"_frozen").parent().height(c.height()-16),b.p.height=a,b.p.scroll&&b.grid.populateVisible()}})},setCaption:function(a){return this.each(function(){var b=$(this).jqGrid("getStyleUI",this.p.styleUI+".common","cornertop",!0);this.p.caption=a,$(".ui-jqgrid-title, .ui-jqgrid-title-rtl",this.grid.cDiv).html(a),$(this.grid.cDiv).show(),$(this.grid.hDiv).removeClass(b)})},setLabel:function(a,b,c,d){return this.each(function(){var e=this,f=-1;if(e.grid&&null!=a&&(isNaN(a)?$(e.p.colModel).each(function(b){if(this.name===a)return f=b,!1}):f=parseInt(a,10),f>=0)){var g=$("tr.ui-jqgrid-labels th:eq("+f+")",e.grid.hDiv);if(b){var h=$(".s-ico",g);$("[id^=jqgh_]",g).empty().html(b).append(h),e.p.colNames[f]=b}c&&("string"==typeof c?$(g).addClass(c):$(g).css(c)),"object"==typeof d&&$(g).attr(d)}})},setSortIcon:function(a,b){return this.each(function(){var c=this,d=-1;if(c.grid&&null!=a&&(isNaN(a)?$(c.p.colModel).each(function(b){if(this.name===a)return d=b,!1}):d=parseInt(a,10),d>=0)){var e=$("tr.ui-jqgrid-labels th:eq("+d+")",c.grid.hDiv);"left"===b?e.find(".s-ico").css("float","left"):e.find(".s-ico").css("float","none")}})},setCell:function(a,b,c,d,e,f){return this.each(function(){var g,h,i=this,j=-1;if(i.grid&&(isNaN(b)?$(i.p.colModel).each(function(a){if(this.name===b)return j=a,!1}):j=parseInt(b,10),j>=0)){var k=$(i).jqGrid("getGridRowById",a);if(k){var l,m=0,n=[];try{l=k.cells[j]}catch(a){}if(l){if(""!==c||!0===f){if("local"===i.p.datatype)n=$(i).jqGrid("getLocalRow",a);else if(void 0!==k.cells)for(;m<k.cells.length;)g=$.unformat.call(i,$(k.cells[m]),{rowId:k.id,colModel:i.p.colModel[m]},m),n.push(g),m++;if(g=i.formatter(a,c,j,n,"edit"),h=i.p.colModel[j].title?{title:$.jgrid.stripHtml(g)}:{},i.p.treeGrid&&$(".tree-wrap",$(l)).length>0?$("span",$(l)).html(g).attr(h):$(l).html(g).attr(h),"local"===i.p.datatype){var o,p=i.p.colModel[j];c=p.formatter&&"string"==typeof p.formatter&&"date"===p.formatter?$.unformat.date.call(i,c,p):c,o=i.p._index[$.jgrid.stripPref(i.p.idPrefix,a)],void 0!==o&&(i.p.data[o][p.name]=c)}}"string"==typeof d?$(l).addClass(d):d&&$(l).css(d),"object"==typeof e&&$(l).attr(e)}}}})},getCell:function(a,b,c){var d,e=!1;return void 0===c&&(c=!1),this.each(function(){var f,g,h=this,i=-1;if(h.grid&&(f=b,isNaN(b)?$(h.p.colModel).each(function(a){if(this.name===b)return f=this.name,i=a,!1}):i=parseInt(b,10),i>=0&&(g=$(h).jqGrid("getGridRowById",a))))if(d=$("td:eq("+i+")",g),c)e=d;else{try{e=$.unformat.call(h,d,{rowId:g.id,colModel:h.p.colModel[i]},i)}catch(a){e=$.jgrid.htmlDecode(d.html())}h.p.treeGrid&&e&&h.p.ExpandColumn===f&&(e=$("<div>"+e+"</div>").find("span:first").html())}}),e},getCol:function(a,b,c){var d,e,f,g,h=[],i=0;b="boolean"==typeof b&&b,void 0===c&&(c=!1);var j=$.jgrid.getFont(this[0]);return this.each(function(){var k=this,l=-1;if(k.grid&&(isNaN(a)?$(k.p.colModel).each(function(b){if(this.name===a)return l=b,!1}):l=parseInt(a,10),l>=0)){var m=k.rows.length,n=0,o=0;if(m&&m>0){for(;n<m;)if($(k.rows[n]).hasClass("jqgrow")){if("maxwidth"===c){void 0===f&&(f=0),f=Math.max($.jgrid.getTextWidth(k.rows[n].cells[l].innerHTML,j),f);continue}try{d=$.unformat.call(k,$(k.rows[n].cells[l]),{rowId:k.rows[n].id,colModel:k.p.colModel[l]},l)}catch(a){d=$.jgrid.htmlDecode(k.rows[n].cells[l].innerHTML)}c?(g=parseFloat(d),isNaN(g)||(i+=g,void 0===f&&(f=e=g),e=Math.min(e,g),f=Math.max(f,g),o++)):b?h.push({id:k.rows[n].id,value:d}):h.push(d)}if(c)switch(c.toLowerCase()){case"sum":h=i;break;case"avg":h=i/o;break;case"count":h=m-1;break;case"min":h=e;break;case"max":h=f;break;case"maxwidth":h=f}}}}),h},clearGridData:function(a){return this.each(function(){var b=this;if(b.grid){if("boolean"!=typeof a&&(a=!1),b.p.deepempty)$("#"+$.jgrid.jqID(b.p.id)+" tbody:first tr:gt(0)").remove();else{var c=$("#"+$.jgrid.jqID(b.p.id)+" tbody:first tr:first")[0];$("#"+$.jgrid.jqID(b.p.id)+" tbody:first").empty().append(c)}b.p.footerrow&&a&&$(".ui-jqgrid-ftable td",b.grid.sDiv).html("&#160;"),b.p.selrow=null,b.p.selarrrow=[],b.p.savedRow=[],b.p.records=0,b.p.page=1,b.p.lastpage=0,b.p.reccount=0,b.p.data=[],b.p._index={},b.p.groupingView._locgr=!1,b.updatepager(!0,!1)}})},getInd:function(a,b){var c,d=!1;return this.each(function(){(c=$(this).jqGrid("getGridRowById",a))&&(d=!0===b?c:c.rowIndex)}),d},bindKeys:function(a){var b=$.extend({onEnter:null,onSpace:null,onLeftKey:null,onRightKey:null,scrollingRows:!0},a||{});return this.each(function(){var a=this;$("body").is("[role]")||$("body").attr("role","application"),a.p.scrollrows=b.scrollingRows,$(a).on("keydown",function(c){var d,e,f,g=$(a).find("tr[tabindex=0]")[0],h=a.p.treeReader.expanded_field;if(g){var i=a.p.selrow;if(f=a.p._index[$.jgrid.stripPref(a.p.idPrefix,g.id)],37===c.keyCode||38===c.keyCode||39===c.keyCode||40===c.keyCode){if(38===c.keyCode){if(e=g.previousSibling,d="",e&&$(e).hasClass("jqgrow")){if($(e).is(":hidden")){for(;e;)if(e=e.previousSibling,!$(e).is(":hidden")&&$(e).hasClass("jqgrow")){d=e.id;break}}else d=e.id;$(a).jqGrid("setSelection",d,!0,c)}$(a).triggerHandler("jqGridKeyUp",[d,i,c]),$.isFunction(b.onUpKey)&&b.onUpKey.call(a,d,i,c),c.preventDefault()}if(40===c.keyCode){if(e=g.nextSibling,d="",e&&$(e).hasClass("jqgrow")){if($(e).is(":hidden")){for(;e;)if(e=e.nextSibling,!$(e).is(":hidden")&&$(e).hasClass("jqgrow")){d=e.id;break}}else d=e.id;$(a).jqGrid("setSelection",d,!0,c)}$(a).triggerHandler("jqGridKeyDown",[d,i,c]),$.isFunction(b.onDownKey)&&b.onDownKey.call(a,d,i,c),c.preventDefault()}37===c.keyCode&&(a.p.treeGrid&&a.p.data[f][h]&&$(g).find("div.treeclick").trigger("click"),$(a).triggerHandler("jqGridKeyLeft",[a.p.selrow,c]),$.isFunction(b.onLeftKey)&&b.onLeftKey.call(a,a.p.selrow,c)),39===c.keyCode&&(a.p.treeGrid&&!a.p.data[f][h]&&$(g).find("div.treeclick").trigger("click"),$(a).triggerHandler("jqGridKeyRight",[a.p.selrow,c]),$.isFunction(b.onRightKey)&&b.onRightKey.call(a,a.p.selrow,c))}else 13===c.keyCode?($(a).triggerHandler("jqGridKeyEnter",[a.p.selrow,c]),$.isFunction(b.onEnter)&&b.onEnter.call(a,a.p.selrow,c)):32===c.keyCode&&($(a).triggerHandler("jqGridKeySpace",[a.p.selrow,c]),$.isFunction(b.onSpace)&&b.onSpace.call(a,a.p.selrow,c))}}).on("click",function(b){$(b.target).is("input, textarea, select")||$(b.target,a.rows).closest("tr.jqgrow").focus()})})},unbindKeys:function(){return this.each(function(){$(this).off("keydown")})},getLocalRow:function(a){var b,c=!1;return this.each(function(){void 0!==a&&(b=this.p._index[$.jgrid.stripPref(this.p.idPrefix,a)])>=0&&(c=this.p.data[b])}),c},progressBar:function(a){return a=$.extend({htmlcontent:"",method:"hide",loadtype:"disable"},a||{}),this.each(function(){var b,c,d="show"===a.method,e=$("#load_"+$.jgrid.jqID(this.p.id)),f=$(window).scrollTop();switch(""!==a.htmlcontent&&e.html(a.htmlcontent),a.loadtype){case"disable":break;case"enable":e.toggle(d);break;case"block":$("#lui_"+$.jgrid.jqID(this.p.id)).css(d?{top:0,left:0,height:$("#gbox_"+$.jgrid.jqID(this.p.id)).height(),width:$("#gbox_"+$.jgrid.jqID(this.p.id)).width(),"z-index":1e4,position:"absolute"}:{}).toggle(d),e.toggle(d)}e.is(":visible")&&(b=e.offsetParent(),e.css("top",""),e.offset().top<f&&(c=Math.min(10+f-b.offset().top,b.height()-e.height()),e.css("top",c+"px")))})},getColProp:function(a){var b={},c=this[0];if(!c.grid)return!1;var d,e=c.p.colModel;for(d=0;d<e.length;d++)if(e[d].name===a){b=e[d];break}return b},setColProp:function(a,b){return this.each(function(){if(this.grid&&$.isPlainObject(b)){var c,d=this.p.colModel;for(c=0;c<d.length;c++)if(d[c].name===a){$.extend(!0,this.p.colModel[c],b);break}}})},sortGrid:function(a,b,c){return this.each(function(){var d,e=this,f=-1,g=!1;if(e.grid){for(a||(a=e.p.sortname),d=0;d<e.p.colModel.length;d++)if(e.p.colModel[d].index===a||e.p.colModel[d].name===a){f=d,!0===e.p.frozenColumns&&!0===e.p.colModel[d].frozen&&(g=e.grid.fhDiv.find("#"+e.p.id+"_"+a));break}if(-1!==f){var h=e.p.colModel[f].sortable;g||(g=e.grid.headers[f].el),"boolean"!=typeof h&&(h=!0),"boolean"!=typeof b&&(b=!1),h&&e.sortData("jqgh_"+e.p.id+"_"+a,f,b,c,g)}}})},setGridState:function(a){return this.each(function(){if(this.grid){var b=this,c=$(this).jqGrid("getStyleUI",this.p.styleUI+".base","icon_caption_open",!0),d=$(this).jqGrid("getStyleUI",this.p.styleUI+".base","icon_caption_close",!0);"hidden"===a?($(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv","#gview_"+$.jgrid.jqID(b.p.id)).slideUp("fast"),b.p.pager&&$(b.p.pager).slideUp("fast"),b.p.toppager&&$(b.p.toppager).slideUp("fast"),!0===b.p.toolbar[0]&&("both"===b.p.toolbar[1]&&$(b.grid.ubDiv).slideUp("fast"),$(b.grid.uDiv).slideUp("fast")),b.p.footerrow&&$(".ui-jqgrid-sdiv","#gbox_"+$.jgrid.jqID(b.p.id)).slideUp("fast"),$(".ui-jqgrid-headlink",b.grid.cDiv).removeClass(c).addClass(d),
b.p.gridstate="hidden"):"visible"===a&&($(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv","#gview_"+$.jgrid.jqID(b.p.id)).slideDown("fast"),b.p.pager&&$(b.p.pager).slideDown("fast"),b.p.toppager&&$(b.p.toppager).slideDown("fast"),!0===b.p.toolbar[0]&&("both"===b.p.toolbar[1]&&$(b.grid.ubDiv).slideDown("fast"),$(b.grid.uDiv).slideDown("fast")),b.p.footerrow&&$(".ui-jqgrid-sdiv","#gbox_"+$.jgrid.jqID(b.p.id)).slideDown("fast"),$(".ui-jqgrid-headlink",b.grid.cDiv).removeClass(d).addClass(c),b.p.gridstate="visible")}})},setFrozenColumns:function(){return this.each(function(){if(this.grid){var a=this,b=a.p.colModel,c=0,d=b.length,e=-1,f=!1,g=$(a).jqGrid("getStyleUI",a.p.styleUI+".base","headerDiv",!0,"ui-jqgrid-hdiv"),h=$(a).jqGrid("getStyleUI",a.p.styleUI+".common","hover",!0),i="border-box"===$("#gbox_"+$.jgrid.jqID(a.p.id)).css("box-sizing"),j=i?1:0;if(!0!==a.p.subGrid&&!0!==a.p.treeGrid&&!0!==a.p.cellEdit&&!a.p.scroll){for(;c<d&&!0===b[c].frozen;)f=!0,e=c,c++;if(e>=0&&f){var k=a.p.caption?$(a.grid.cDiv).outerHeight():0,l=parseInt($(".ui-jqgrid-htable","#gview_"+$.jgrid.jqID(a.p.id)).height(),10),m=parseInt($(".ui-jqgrid-hdiv","#gview_"+$.jgrid.jqID(a.p.id)).height(),10);a.p.toppager&&(k+=$(a.grid.topDiv).outerHeight()),!0===a.p.toolbar[0]&&"bottom"!==a.p.toolbar[1]&&(k+=$(a.grid.uDiv).outerHeight()),a.grid.fhDiv=$('<div style="position:absolute;'+("rtl"===a.p.direction?"right:0;":"left:0;")+"top:"+k+"px;height:"+(m-j)+'px;" class="frozen-div '+g+'"></div>'),a.grid.fbDiv=$('<div style="position:absolute;'+("rtl"===a.p.direction?"right:0;":"left:0;")+"top:"+(parseInt(k,10)+parseInt(m,10)+1-j)+'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>'),$("#gview_"+$.jgrid.jqID(a.p.id)).append(a.grid.fhDiv);var n=$(".ui-jqgrid-htable","#gview_"+$.jgrid.jqID(a.p.id)).clone(!0);if(a.p.groupHeader){$("tr.jqg-first-row-header, tr.jqg-third-row-header",n).each(function(){$("th:gt("+e+")",this).remove()});var o,p,q=-1,r=-1;$("tr.jqg-second-row-header th",n).each(function(){if(o=parseInt($(this).attr("colspan"),10),p=parseInt($(this).attr("rowspan"),10),p&&(q++,r++),o&&(q+=o,r++),q===e)return r=e,!1}),q!==e&&(r=e),$("tr.jqg-second-row-header",n).each(function(){$("th:gt("+r+")",this).remove()})}else{var s=[];$(".ui-jqgrid-htable tr","#gview_"+$.jgrid.jqID(a.p.id)).each(function(a,b){s.push(parseInt($(this).height(),10))}),$("tr",n).each(function(){$("th:gt("+e+")",this).remove()}),$("tr",n).each(function(a){$(this).height(s[a])})}if($(n).width(1),$.jgrid.msie()||$(n).css("height","100%"),$(a.grid.fhDiv).append(n).mousemove(function(b){if(a.grid.resizing)return a.grid.dragMove(b),!1}),a.p.footerrow){var t=$(".ui-jqgrid-bdiv","#gview_"+$.jgrid.jqID(a.p.id)).height();a.grid.fsDiv=$('<div style="position:absolute;left:0px;top:'+(parseInt(k,10)+parseInt(l,10)+parseInt(t,10)+1-j)+'px;" class="frozen-sdiv ui-jqgrid-sdiv"></div>'),$("#gview_"+$.jgrid.jqID(a.p.id)).append(a.grid.fsDiv);var u=$(".ui-jqgrid-ftable","#gview_"+$.jgrid.jqID(a.p.id)).clone(!0);$("tr",u).each(function(){$("td:gt("+e+")",this).remove()}),$(u).width(1),$(a.grid.fsDiv).append(u)}$(a).on("jqGridResizeStop.setFrozenColumns",function(b,c,d){var e=i?"outerWidth":"width",f=$(".ui-jqgrid-htable",a.grid.fhDiv),g=$(".ui-jqgrid-btable",a.grid.fbDiv);if($("th:eq("+d+")",f)[e](c),$("tr:first td:eq("+d+")",g)[e](c),a.p.footerrow){var h=$(".ui-jqgrid-ftable",a.grid.fsDiv);$("tr:first td:eq("+d+")",h)[e](c)}}),$("#gview_"+$.jgrid.jqID(a.p.id)).append(a.grid.fbDiv),$(a.grid.fbDiv).on("mousewheel DOMMouseScroll",function(b){var c=$(a.grid.bDiv).scrollTop();b.originalEvent.wheelDelta>0||b.originalEvent.detail<0?$(a.grid.bDiv).scrollTop(c-25):$(a.grid.bDiv).scrollTop(c+25),b.preventDefault()}),!0===a.p.hoverrows&&$("#"+$.jgrid.jqID(a.p.id)).off("mouseover mouseout"),$(a).on("jqGridAfterGridComplete.setFrozenColumns",function(){$("#"+$.jgrid.jqID(a.p.id)+"_frozen").remove(),$(a.grid.fbDiv).height($(a.grid.bDiv)[0].clientHeight);var b=[];$("#"+$.jgrid.jqID(a.p.id)+" tr[role=row].jqgrow").each(function(){b.push($(this).outerHeight())});var c=$("#"+$.jgrid.jqID(a.p.id)).clone(!0);$("tr[role=row]",c).each(function(){$("td[role=gridcell]:gt("+e+")",this).remove()}),$(c).width(1).attr("id",a.p.id+"_frozen"),$(a.grid.fbDiv).append(c),$("tr[role=row].jqgrow",c).each(function(a,c){$(this).height(b[a])}),!0===a.p.hoverrows&&($("tr.jqgrow",c).hover(function(){$(this).addClass(h),$("#"+$.jgrid.jqID(this.id),"#"+$.jgrid.jqID(a.p.id)).addClass(h)},function(){$(this).removeClass(h),$("#"+$.jgrid.jqID(this.id),"#"+$.jgrid.jqID(a.p.id)).removeClass(h)}),$("tr.jqgrow","#"+$.jgrid.jqID(a.p.id)).hover(function(){$(this).addClass(h),$("#"+$.jgrid.jqID(this.id),"#"+$.jgrid.jqID(a.p.id)+"_frozen").addClass(h)},function(){$(this).removeClass(h),$("#"+$.jgrid.jqID(this.id),"#"+$.jgrid.jqID(a.p.id)+"_frozen").removeClass(h)})),c=null}),a.grid.hDiv.loading||$(a).triggerHandler("jqGridAfterGridComplete"),a.p.frozenColumns=!0}}}})},destroyFrozenColumns:function(){return this.each(function(){if(this.grid&&!0===this.p.frozenColumns){var a=this,b=$(a).jqGrid("getStyleUI",a.p.styleUI+".common","hover",!0);if($(a.grid.fhDiv).remove(),$(a.grid.fbDiv).remove(),a.grid.fhDiv=null,a.grid.fbDiv=null,a.p.footerrow&&($(a.grid.fsDiv).remove(),a.grid.fsDiv=null),$(this).off(".setFrozenColumns"),!0===a.p.hoverrows){var c;$("#"+$.jgrid.jqID(a.p.id)).on({mouseover:function(a){c=$(a.target).closest("tr.jqgrow"),"ui-subgrid"!==$(c).attr("class")&&$(c).addClass(b)},mouseout:function(a){c=$(a.target).closest("tr.jqgrow"),$(c).removeClass(b)}})}this.p.frozenColumns=!1}})},resizeColumn:function(a,b,c){return this.each(function(){var d,e,f=this.grid,g=this.p,h=g.colModel,i=h.length;if("string"==typeof a){for(d=0;d<i;d++)if(h[d].name===a){a=d;break}}else a=parseInt(a,10);if(void 0===c&&(c=!1),(h[a].resizable||c)&&(b=parseInt(b,10),!("number"!=typeof a||a<0||a>h.length-1||"number"!=typeof b||b<g.minColWidth))){if(g.forceFit)for(g.nv=0,d=a+1;d<i;d++)if(!0!==h[d].hidden){g.nv=d-a;break}if(f.resizing={idx:a},e=b-f.headers[a].width,g.forceFit){if(f.headers[a+g.nv].width-e<g.minColWidth)return;f.headers[a+g.nv].newWidth=f.headers[a+g.nv].width-e}f.newWidth=g.tblwidth+e,f.headers[a].newWidth=b,f.dragEnd(!1)}})},getStyleUI:function(a,b,c,d){var e="",f="";try{var g=a.split(".");switch(c||(e="class=",f='"'),null==d&&(d=""),g.length){case 1:e+=f+$.trim(d+" "+$.jgrid.styleUI[g[0]][b]+f);break;case 2:e+=f+$.trim(d+" "+$.jgrid.styleUI[g[0]][g[1]][b]+f)}}catch(a){e=""}return e},resizeGrid:function(a){return this.each(function(){var b=this;void 0===a&&(a=500),setTimeout(function(){try{var a=$(window).width(),c=$("#gbox_"+$.jgrid.jqID(b.p.id)).parent().width(),d=b.p.width;d=a-c>3?c:a,$("#"+$.jgrid.jqID(b.p.id)).jqGrid("setGridWidth",d)}catch(a){}},a)})},colMenuAdd:function(a,b){var c=this[0].p.styleUI,d=$.jgrid.styleUI[c].colmenu;return b=$.extend({title:"Item",icon:d.icon_new_item,funcname:null,position:"last",closeOnRun:!0,exclude:"",id:null},b||{}),this.each(function(){b.colname="all"===a?"_all_":a;var c=this;b.id=null===b.id?$.jgrid.randId():b.id,c.p.colMenuCustom[b.id]=b})},colMenuDelete:function(a){return this.each(function(){this.p.colMenuCustom.hasOwnProperty(a)&&delete this.p.colMenuCustom[a]})},menubarAdd:function(a){var b,c,d=this[0].p.styleUI,e=$.jgrid.styleUI[d].common;return this.each(function(){var d=this;if($.isArray(a))for(var f=0;f<a.length;f++){b=a[f],b.id||(b.id=$.jgrid.randId());var g="";b.icon&&(g='<span class="'+e.icon_base+" "+b.icon+'"></span>'),b.position||(b.position="last"),b.closeoncall||(b.closeoncall=!0),b.divider?(c='<li class="ui-menu-item divider" role="separator"></li>',b.cick=null):c='<li class="ui-menu-item" role="presentation"><a id="'+b.id+'" class="g-menu-item" tabindex="0" role="menuitem" ><table class="ui-common-table"><tr><td class="menu_icon">'+g+'</td><td class="menu_text">'+b.title+"</td></tr></table></a></li>","last"===b.position?$("#"+this.p.id+"_menubar").append(c):$("#"+this.p.id+"_menubar").prepend(c)}$("li a","#"+this.p.id+"_menubar").each(function(b,c){$(a).each(function(a,b){if(b.id===c.id&&$.isFunction(b.click))return $(c).on("click",function(a){b.click.call(d,a)}),!1}),$(this).hover(function(a){$(this).addClass(e.hover),a.stopPropagation()},function(a){$(this).removeClass(e.hover)})})})},menubarDelete:function(a){return this.each(function(){$("#"+a,"#"+this.p.id+"_menubar").remove()})}}),$.jgrid.extend({editCell:function(a,b,c,d){return this.each(function(){var e,f,g,h,i=this,j=$(this).jqGrid("getStyleUI",i.p.styleUI+".common","highlight",!0),k=$(this).jqGrid("getStyleUI",i.p.styleUI+".common","hover",!0),l=$(this).jqGrid("getStyleUI",i.p.styleUI+".celledit","inputClass",!0);if(i.grid&&!0===i.p.cellEdit){if(b=parseInt(b,10),i.p.selrow=i.rows[a].id,i.p.knv||$(i).jqGrid("GridNav"),i.p.savedRow.length>0){if(!0===c&&a==i.p.iRow&&b==i.p.iCol)return;$(i).jqGrid("saveCell",i.p.savedRow[0].id,i.p.savedRow[0].ic)}else window.setTimeout(function(){$("#"+$.jgrid.jqID(i.p.knv)).attr("tabindex","-1").focus()},1);if(h=i.p.colModel[b],"subgrid"!==(e=h.name)&&"cb"!==e&&"rn"!==e){try{g=$(i.rows[a].cells[b])}catch(c){g=$("td:eq("+b+")",i.rows[a])}if(parseInt(i.p.iCol,10)>=0&&parseInt(i.p.iRow,10)>=0&&void 0!==i.p.iRowId){var m=$(i).jqGrid("getGridRowById",i.p.iRowId);$(m).removeClass("selected-row "+k).find("td:eq("+i.p.iCol+")").removeClass("edit-cell "+j)}if(g.addClass("edit-cell "+j),$(i.rows[a]).addClass("selected-row "+k),!0!==h.editable||!0!==c||g.hasClass("not-editable-cell")||$.isFunction(i.p.isCellEditable)&&!i.p.isCellEditable.call(i,e,a,b))f=g.html().replace(/\&#160\;/gi,""),$(i).triggerHandler("jqGridCellSelect",[i.rows[a].id,b,f,d]),$.isFunction(i.p.onCellSelect)&&i.p.onCellSelect.call(i,i.rows[a].id,b,f,d);else{try{f=$.unformat.call(i,g,{rowId:i.rows[a].id,colModel:h},b)}catch(a){f=h.edittype&&"textarea"===h.edittype?g.text():g.html()}if(i.p.autoencode&&(f=$.jgrid.htmlDecode(f)),h.edittype||(h.edittype="text"),i.p.savedRow.push({id:a,ic:b,name:e,v:f,rowId:i.rows[a].id}),("&nbsp;"===f||"&#160;"===f||1===f.length&&160===f.charCodeAt(0))&&(f=""),$.isFunction(i.p.formatCell)){var n=i.p.formatCell.call(i,i.rows[a].id,e,f,a,b);void 0!==n&&(f=n)}$(i).triggerHandler("jqGridBeforeEditCell",[i.rows[a].id,e,f,a,b]),$.isFunction(i.p.beforeEditCell)&&i.p.beforeEditCell.call(i,i.rows[a].id,e,f,a,b);var o=$.extend({},h.editoptions||{},{id:a+"_"+e,name:e,rowId:i.rows[a].id,oper:"edit"}),p=$.jgrid.createEl.call(i,h.edittype,o,f,!0,$.extend({},$.jgrid.ajaxOptions,i.p.ajaxSelectOptions||{}));$.inArray(h.edittype,["text","textarea","password","select"])>-1&&$(p).addClass(l),g.html("").append(p).attr("tabindex","0"),$.jgrid.bindEv.call(i,p,o),window.setTimeout(function(){$(p).focus()},1),$("input, select, textarea",g).on("keydown",function(c){if(27===c.keyCode&&($("input.hasDatepicker",g).length>0?$(".ui-datepicker").is(":hidden")?$(i).jqGrid("restoreCell",a,b):$("input.hasDatepicker",g).datepicker("hide"):$(i).jqGrid("restoreCell",a,b)),13===c.keyCode&&!c.shiftKey)return $(i).jqGrid("saveCell",a,b),!1;if(9===c.keyCode){if(i.grid.hDiv.loading)return!1;if(c.shiftKey){!$(i).jqGrid("prevCell",a,b,c)&&i.p.editNextRowCell&&a-1>0&&i.rows[a-1]&&(a--,$(i).jqGrid("prevCell",a,i.p.colModel.length,c))}else{!$(i).jqGrid("nextCell",a,b,c)&&i.p.editNextRowCell&&i.rows[a+1]&&(a++,$(i).jqGrid("nextCell",a,0,c))}}c.stopPropagation()}),$(i).triggerHandler("jqGridAfterEditCell",[i.rows[a].id,e,f,a,b]),$.isFunction(i.p.afterEditCell)&&i.p.afterEditCell.call(i,i.rows[a].id,e,f,a,b)}i.p.iCol=b,i.p.iRow=a,i.p.iRowId=i.rows[a].id}}})},saveCell:function(a,b){return this.each(function(){var c=this,d=c.p.savedRow.length>=1?0:null,e=$.jgrid.getRegional(this,"errors"),f=$.jgrid.getRegional(this,"edit");if(c.grid&&!0===c.p.cellEdit){if(null!==d){var g,h,i=$(c).jqGrid("getGridRowById",c.p.savedRow[0].rowId),j=$("td:eq("+b+")",i),k=c.p.colModel[b],l=k.name,m=$.jgrid.jqID(l),n=$(j).offset();switch(k.edittype){case"select":if(k.editoptions.multiple){var o=$("#"+a+"_"+m,i),p=[];g=$(o).val(),g?g.join(","):g="",$("option:selected",o).each(function(a,b){p[a]=$(b).text()}),h=p.join(",")}else g=$("#"+a+"_"+m+" option:selected",i).val(),h=$("#"+a+"_"+m+" option:selected",i).text();k.formatter&&(h=g);break;case"checkbox":var q=["Yes","No"];k.editoptions&&k.editoptions.value&&(q=k.editoptions.value.split(":")),g=$("#"+a+"_"+m,i).is(":checked")?q[0]:q[1],h=g;break;case"password":case"text":case"textarea":case"button":g=$("#"+a+"_"+m,i).val(),h=g;break;case"custom":try{if(!k.editoptions||!$.isFunction(k.editoptions.custom_value))throw"e1";if(void 0===(g=k.editoptions.custom_value.call(c,$(".customelement",j),"get")))throw"e2";h=g}catch(a){"e1"===a?$.jgrid.info_dialog(e.errcap,"function 'custom_value' "+f.msg.nodefined,f.bClose,{styleUI:c.p.styleUI}):"e2"===a?$.jgrid.info_dialog(e.errcap,"function 'custom_value' "+f.msg.novalue,f.bClose,{styleUI:c.p.styleUI}):$.jgrid.info_dialog(e.errcap,a.message,f.bClose,{styleUI:c.p.styleUI})}}if(h!==c.p.savedRow[d].v){var r=$(c).triggerHandler("jqGridBeforeSaveCell",[c.p.savedRow[d].rowId,l,g,a,b]);if(r&&(g=r,h=r),$.isFunction(c.p.beforeSaveCell)){var s=c.p.beforeSaveCell.call(c,c.p.savedRow[d].rowId,l,g,a,b);s&&(g=s,h=s)}var t=$.jgrid.checkValues.call(c,g,b),u=!1;if(!0===t[0]){var v=$(c).triggerHandler("jqGridBeforeSubmitCell",[c.p.savedRow[d].rowId,l,g,a,b])||{};$.isFunction(c.p.beforeSubmitCell)&&((v=c.p.beforeSubmitCell.call(c,c.p.savedRow[d].rowId,l,g,a,b))||(v={}));var w=$(c).triggerHandler("jqGridOnSubmitCell",[c.p.savedRow[d].rowId,l,g,a,b]);if(void 0===w&&(w=!0),$.isFunction(c.p.onSubmitCell)&&void 0===(w=c.p.onSubmitCell(c.p.savedRow[d].rowId,l,g,a,b))&&(w=!0),!1===w)return;if($("input.hasDatepicker",j).length>0&&$("input.hasDatepicker",j).datepicker("hide"),"remote"===c.p.cellsubmit)if(c.p.cellurl){var x={};c.p.autoencode&&(g=$.jgrid.htmlEncode(g)),k.editoptions&&k.editoptions.NullIfEmpty&&""===g&&(g="null",u=!0),x[l]=g;var y=c.p.prmNames,z=y.id,A=y.oper;x[z]=$.jgrid.stripPref(c.p.idPrefix,c.p.savedRow[d].rowId),x[A]=y.editoper,x=$.extend(v,x),$(c).jqGrid("progressBar",{method:"show",loadtype:c.p.loadui,htmlcontent:$.jgrid.getRegional(c,"defaults.savetext")}),c.grid.hDiv.loading=!0,$.ajax($.extend({url:c.p.cellurl,data:$.isFunction(c.p.serializeCellData)?c.p.serializeCellData.call(c,x,l):x,type:"POST",complete:function(k,o){if($(c).jqGrid("progressBar",{method:"hide",loadtype:c.p.loadui}),c.grid.hDiv.loading=!1,"success"===o){var p=$(c).triggerHandler("jqGridAfterSubmitCell",[c,k,x[z],l,g,a,b])||[!0,""];!0===p[0]&&$.isFunction(c.p.afterSubmitCell)&&(p=c.p.afterSubmitCell.call(c,k,x[z],l,g,a,b)),!0===p[0]?(u&&(g=""),$(j).empty(),$(c).jqGrid("setCell",c.p.savedRow[d].rowId,b,h,!1,!1,!0),$(j).addClass("dirty-cell"),$(i).addClass("edited"),$(c).triggerHandler("jqGridAfterSaveCell",[c.p.savedRow[d].rowId,l,g,a,b]),$.isFunction(c.p.afterSaveCell)&&c.p.afterSaveCell.call(c,c.p.savedRow[d].rowId,l,g,a,b),c.p.savedRow.splice(0,1)):($(c).triggerHandler("jqGridErrorCell",[k,o]),$.isFunction(c.p.errorCell)?c.p.errorCell.call(c,k,o):$.jgrid.info_dialog(e.errcap,p[1],f.bClose,{styleUI:c.p.styleUI,top:n.top+30,left:n.left,onClose:function(){c.p.restoreCellonFail||$("#"+a+"_"+m,i).focus()}}),c.p.restoreCellonFail&&$(c).jqGrid("restoreCell",a,b))}},error:function(d,g,h){$("#lui_"+$.jgrid.jqID(c.p.id)).hide(),c.grid.hDiv.loading=!1,$(c).triggerHandler("jqGridErrorCell",[d,g,h]),$.isFunction(c.p.errorCell)?c.p.errorCell.call(c,d,g,h):$.jgrid.info_dialog(e.errcap,d.status+" : "+d.statusText+"<br/>"+g,f.bClose,{styleUI:c.p.styleUI,top:n.top+30,left:n.left,onClose:function(){c.p.restoreCellonFail||$("#"+a+"_"+m,i).focus()}}),c.p.restoreCellonFail&&$(c).jqGrid("restoreCell",a,b)}},$.jgrid.ajaxOptions,c.p.ajaxCellOptions||{}))}else try{$.jgrid.info_dialog(e.errcap,e.nourl,f.bClose,{styleUI:c.p.styleUI}),c.p.restoreCellonFail&&$(c).jqGrid("restoreCell",a,b)}catch(a){}"clientArray"===c.p.cellsubmit&&($(j).empty(),$(c).jqGrid("setCell",c.p.savedRow[d].rowId,b,h,!1,!1,!0),$(j).addClass("dirty-cell"),$(i).addClass("edited"),$(c).triggerHandler("jqGridAfterSaveCell",[c.p.savedRow[d].rowId,l,g,a,b]),$.isFunction(c.p.afterSaveCell)&&c.p.afterSaveCell.call(c,c.p.savedRow[d].rowId,l,g,a,b),c.p.savedRow.splice(0,1))}else try{$.isFunction(c.p.validationCell)?c.p.validationCell.call(c,$("#"+a+"_"+m,i),t[1],a,b):(window.setTimeout(function(){$.jgrid.info_dialog(e.errcap,g+" "+t[1],f.bClose,{styleUI:c.p.styleUI,top:n.top+30,left:n.left,onClose:function(){c.p.restoreCellonFail||$("#"+a+"_"+m,i).focus()}})},50),c.p.restoreCellonFail&&$(c).jqGrid("restoreCell",a,b))}catch(a){alert(t[1])}}else $(c).jqGrid("restoreCell",a,b)}window.setTimeout(function(){$("#"+$.jgrid.jqID(c.p.knv)).attr("tabindex","-1").focus()},0)}})},restoreCell:function(a,b){return this.each(function(){var c=this,d=c.p.savedRow.length>=1?0:null;if(c.grid&&!0===c.p.cellEdit){if(null!==d){var e=$(c).jqGrid("getGridRowById",c.p.savedRow[d].rowId),f=$("td:eq("+b+")",e);if($.isFunction($.fn.datepicker))try{$("input.hasDatepicker",f).datepicker("hide")}catch(a){}$(f).empty().attr("tabindex","-1"),$(c).jqGrid("setCell",c.p.savedRow[0].rowId,b,c.p.savedRow[d].v,!1,!1,!0),$(c).triggerHandler("jqGridAfterRestoreCell",[c.p.savedRow[d].rowId,c.p.savedRow[d].v,a,b]),$.isFunction(c.p.afterRestoreCell)&&c.p.afterRestoreCell.call(c,c.p.savedRow[d].rowId,c.p.savedRow[d].v,a,b),c.p.savedRow.splice(0,1)}window.setTimeout(function(){$("#"+c.p.knv).attr("tabindex","-1").focus()},0)}})},nextCell:function(a,b,c){var d;return this.each(function(){var e,f=this,g=!1;if(f.grid&&!0===f.p.cellEdit){for(e=b+1;e<f.p.colModel.length;e++)if(!0===f.p.colModel[e].editable&&(!$.isFunction(f.p.isCellEditable)||f.p.isCellEditable.call(f,f.p.colModel[e].name,a,e))){g=e;break}!1!==g?(d=!0,$(f).jqGrid("editCell",a,g,!0,c)):(d=!1,f.p.savedRow.length>0&&$(f).jqGrid("saveCell",a,b))}}),d},prevCell:function(a,b,c){var d;return this.each(function(){var e,f=this,g=!1;if(!f.grid||!0!==f.p.cellEdit)return!1;for(e=b-1;e>=0;e--)if(!0===f.p.colModel[e].editable&&(!$.isFunction(f.p.isCellEditable)||f.p.isCellEditable.call(f,f.p.colModel[e].name,a,e))){g=e;break}!1!==g?(d=!0,$(f).jqGrid("editCell",a,g,!0,c)):(d=!1,f.p.savedRow.length>0&&$(f).jqGrid("saveCell",a,b))}),d},GridNav:function(){return this.each(function(){function a(a,b,d){if("v"===d.substr(0,1)){var e=$(c.grid.bDiv)[0].clientHeight,f=$(c.grid.bDiv)[0].scrollTop,g=c.rows[a].offsetTop+c.rows[a].clientHeight,h=c.rows[a].offsetTop;"vd"===d&&g>=e&&($(c.grid.bDiv)[0].scrollTop=$(c.grid.bDiv)[0].scrollTop+c.rows[a].clientHeight),"vu"===d&&h<f&&($(c.grid.bDiv)[0].scrollTop=$(c.grid.bDiv)[0].scrollTop-c.rows[a].clientHeight)}if("h"===d){var i=$(c.grid.bDiv)[0].clientWidth,j=$(c.grid.bDiv)[0].scrollLeft,k=c.rows[a].cells[b].offsetLeft+c.rows[a].cells[b].clientWidth,l=c.rows[a].cells[b].offsetLeft;k>=i+parseInt(j,10)?$(c.grid.bDiv)[0].scrollLeft=$(c.grid.bDiv)[0].scrollLeft+c.rows[a].cells[b].clientWidth:l<j&&($(c.grid.bDiv)[0].scrollLeft=$(c.grid.bDiv)[0].scrollLeft-c.rows[a].cells[b].clientWidth)}}function b(a,b){var d,e;if("lft"===b)for(d=a+1,e=a;e>=0;e--)if(!0!==c.p.colModel[e].hidden){d=e;break}if("rgt"===b)for(d=a-1,e=a;e<c.p.colModel.length;e++)if(!0!==c.p.colModel[e].hidden){d=e;break}return d}var c=this;if(c.grid&&!0===c.p.cellEdit){c.p.knv=c.p.id+"_kn";var d,e,f=$("<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='"+c.p.knv+"'></div></div>");$(f).insertBefore(c.grid.cDiv),$("#"+c.p.knv).focus().keydown(function(f){switch(e=f.keyCode,"rtl"===c.p.direction&&(37===e?e=39:39===e&&(e=37)),e){case 38:c.p.iRow-1>0&&(a(c.p.iRow-1,c.p.iCol,"vu"),$(c).jqGrid("editCell",c.p.iRow-1,c.p.iCol,!1,f));break;case 40:c.p.iRow+1<=c.rows.length-1&&(a(c.p.iRow+1,c.p.iCol,"vd"),$(c).jqGrid("editCell",c.p.iRow+1,c.p.iCol,!1,f));break;case 37:c.p.iCol-1>=0&&(d=b(c.p.iCol-1,"lft"),a(c.p.iRow,d,"h"),$(c).jqGrid("editCell",c.p.iRow,d,!1,f));break;case 39:c.p.iCol+1<=c.p.colModel.length-1&&(d=b(c.p.iCol+1,"rgt"),a(c.p.iRow,d,"h"),$(c).jqGrid("editCell",c.p.iRow,d,!1,f));break;case 13:parseInt(c.p.iCol,10)>=0&&parseInt(c.p.iRow,10)>=0&&$(c).jqGrid("editCell",c.p.iRow,c.p.iCol,!0,f);break;default:return!0}return!1})}})},getChangedCells:function(a){var b=[];return a||(a="all"),this.each(function(){var c,d=this;d.grid&&!0===d.p.cellEdit&&$(d.rows).each(function(e){var f={};$(this).hasClass("edited")&&($("td",this).each(function(b){if("cb"!==(c=d.p.colModel[b].name)&&"subgrid"!==c)if("dirty"===a){if($(this).hasClass("dirty-cell"))try{f[c]=$.unformat.call(d,this,{rowId:d.rows[e].id,colModel:d.p.colModel[b]},b)}catch(a){f[c]=$.jgrid.htmlDecode($(this).html())}}else try{f[c]=$.unformat.call(d,this,{rowId:d.rows[e].id,colModel:d.p.colModel[b]},b)}catch(a){f[c]=$.jgrid.htmlDecode($(this).html())}}),f.id=this.id,b.push(f))})}),b}}),$.extend($.jgrid,{showModal:function(a){a.w.show()},closeModal:function(a){a.w.hide().attr("aria-hidden","true"),a.o&&a.o.remove()},hideModal:function(a,b){b=$.extend({jqm:!0,gb:"",removemodal:!1,formprop:!1,form:""},b||{});var c=!(!b.gb||"string"!=typeof b.gb||"#gbox_"!==b.gb.substr(0,6))&&$("#"+b.gb.substr(6))[0];if(b.onClose){var d=c?b.onClose.call(c,a):b.onClose(a);if("boolean"==typeof d&&!d)return}if(b.formprop&&c&&b.form){var e=$(a)[0].style.height,f=$(a)[0].style.width;e.indexOf("px")>-1&&(e=parseFloat(e)),f.indexOf("px")>-1&&(f=parseFloat(f));var g,h;"edit"===b.form?(g="#"+$.jgrid.jqID("FrmGrid_"+b.gb.substr(6)),h="formProp"):"view"===b.form&&(g="#"+$.jgrid.jqID("ViewGrid_"+b.gb.substr(6)),h="viewProp"),$(c).data(h,{top:parseFloat($(a).css("top")),left:parseFloat($(a).css("left")),width:f,height:e,dataheight:$(g).height(),datawidth:$(g).width()})}if($.fn.jqm&&!0===b.jqm)$(a).attr("aria-hidden","true").jqmHide();else{if(""!==b.gb)try{$(".jqgrid-overlay:first",b.gb).hide()}catch(a){}try{$(".jqgrid-overlay-modal").hide()}catch(a){}$(a).hide().attr("aria-hidden","true")}b.removemodal&&$(a).remove()},findPos:function(a){var b=$(a).offset();return[b.left,b.top]},createModal:function(a,b,c,d,e,f,g){c=$.extend(!0,{},$.jgrid.jqModal||{},c);var h=this,i="rtl"===$(c.gbox).attr("dir"),j=$.jgrid.styleUI[c.styleUI||"jQueryUI"].modal,k=$.jgrid.styleUI[c.styleUI||"jQueryUI"].common,l=document.createElement("div");g=$.extend({},g||{}),l.className="ui-jqdialog "+j.modal,l.id=a.themodal;var m=document.createElement("div");m.className="ui-jqdialog-titlebar "+j.header,m.id=a.modalhead,$(m).append("<span class='ui-jqdialog-title'>"+c.caption+"</span>");var n=$("<a class='ui-jqdialog-titlebar-close "+k.cornerall+"'></a>").hover(function(){n.addClass(k.hover)},function(){n.removeClass(k.hover)}).append("<span class='"+k.icon_base+" "+j.icon_close+"'></span>");$(m).append(n),i?(l.dir="rtl",$(".ui-jqdialog-title",m).css("float","right"),$(".ui-jqdialog-titlebar-close",m).css("left","0.3em")):(l.dir="ltr",$(".ui-jqdialog-title",m).css("float","left"),$(".ui-jqdialog-titlebar-close",m).css("right","0.3em"));var o=document.createElement("div");$(o).addClass("ui-jqdialog-content "+j.content).attr("id",a.modalcontent),$(o).append(b),l.appendChild(o),$(l).prepend(m),!0===f?$("body").append(l):"string"==typeof f?$(f).append(l):$(l).insertBefore(d),$(l).css(g),void 0===c.jqModal&&(c.jqModal=!0);var p={};if($.fn.jqm&&!0===c.jqModal){if(0===c.left&&0===c.top&&c.overlay){var q=[];q=$.jgrid.findPos(e),c.left=q[0]+4,c.top=q[1]+4}p.top=c.top+"px",p.left=c.left}else 0===c.left&&0===c.top||(p.left=c.left,p.top=c.top+"px");if($("a.ui-jqdialog-titlebar-close",m).click(function(){var b=$("#"+$.jgrid.jqID(a.themodal)).data("onClose")||c.onClose,d=$("#"+$.jgrid.jqID(a.themodal)).data("gbox")||c.gbox;return h.hideModal("#"+$.jgrid.jqID(a.themodal),{gb:d,jqm:c.jqModal,onClose:b,removemodal:c.removemodal||!1,formprop:!c.recreateForm||!1,form:c.form||""}),!1}),0!==c.width&&c.width||(c.width=300),0!==c.height&&c.height||(c.height=200),!c.zIndex){var r=$(d).parents("*[role=dialog]").filter(":first").css("z-index");c.zIndex=r?parseInt(r,10)+2:950}var s=0;if(i&&p.left&&!f&&(s=$(c.gbox).width()-(isNaN(c.width)?0:parseInt(c.width,10))-8,p.left=parseInt(p.left,10)+parseInt(s,10)),p.left&&(p.left+="px"),$(l).css($.extend({width:isNaN(c.width)?"auto":c.width+"px",height:isNaN(c.height)?"auto":c.height+"px",zIndex:c.zIndex,overflow:"hidden"},p)).attr({tabIndex:"-1",role:"dialog","aria-labelledby":a.modalhead,"aria-hidden":"true"}),void 0===c.drag&&(c.drag=!0),void 0===c.resize&&(c.resize=!0),c.drag)if($(m).css("cursor","move"),$.fn.tinyDraggable)$(l).tinyDraggable({handle:"#"+$.jgrid.jqID(m.id)});else try{$(l).draggable({handle:$("#"+$.jgrid.jqID(m.id))})}catch(a){}if(c.resize)if($.fn.jqResize)$(l).append("<div class='jqResize "+j.resizable+" "+k.icon_base+" "+j.icon_resizable+"'></div>"),$("#"+$.jgrid.jqID(a.themodal)).jqResize(".jqResize",!!a.scrollelm&&"#"+$.jgrid.jqID(a.scrollelm));else try{$(l).resizable({handles:"se, sw",alsoResize:!!a.scrollelm&&"#"+$.jgrid.jqID(a.scrollelm)})}catch(a){}!0===c.closeOnEscape&&$(l).keydown(function(b){if(27===b.which){var d=$("#"+$.jgrid.jqID(a.themodal)).data("onClose")||c.onClose;h.hideModal("#"+$.jgrid.jqID(a.themodal),{gb:c.gbox,jqm:c.jqModal,onClose:d,removemodal:c.removemodal||!1,formprop:!c.recreateForm||!1,form:c.form||""})}})},viewModal:function(a,b){b=$.extend({toTop:!0,overlay:10,modal:!1,overlayClass:"ui-widget-overlay",onShow:$.jgrid.showModal,onHide:$.jgrid.closeModal,gbox:"",jqm:!0,jqM:!0},b||{});var c="";if(b.gbox){var d=$("#"+b.gbox.substring(6))[0];try{c=$(d).jqGrid("getStyleUI",d.p.styleUI+".common","overlay",!1,"jqgrid-overlay-modal"),b.overlayClass=$(d).jqGrid("getStyleUI",d.p.styleUI+".common","overlay",!0)}catch(a){}}if(void 0===b.focusField&&(b.focusField=0),"number"==typeof b.focusField&&b.focusField>=0?b.focusField=parseInt(b.focusField,10):"boolean"!=typeof b.focusField||b.focusField?b.focusField=0:b.focusField=!1,$.fn.jqm&&!0===b.jqm)b.jqM?$(a).attr("aria-hidden","false").jqm(b).jqmShow():$(a).attr("aria-hidden","false").jqmShow();else{if(""!==b.gbox){var e=parseInt($(a).css("z-index"))-1;b.modal?($(".jqgrid-overlay-modal")[0]||$("body").prepend("<div "+c+"></div>"),$(".jqgrid-overlay-modal").css("z-index",e).show()):($(".jqgrid-overlay:first",b.gbox).css("z-index",e).show(),$(a).data("gbox",b.gbox))}if($(a).show().attr("aria-hidden","false"),b.focusField>=0)try{$(":input:visible",a)[b.focusField].focus()}catch(a){}}},info_dialog:function(a,b,c,d){var e={width:290,height:"auto",dataheight:"auto",drag:!0,resize:!1,left:250,top:170,zIndex:1e3,jqModal:!0,modal:!1,closeOnEscape:!0,align:"center",buttonalign:"center",buttons:[]};$.extend(!0,e,$.jgrid.jqModal||{},{caption:"<b>"+a+"</b>"},d||{});var f=e.jqModal,g=this,h=$.jgrid.styleUI[e.styleUI||"jQueryUI"].modal,i=$.jgrid.styleUI[e.styleUI||"jQueryUI"].common;$.fn.jqm&&!f&&(f=!1);var j,k="";if(e.buttons.length>0)for(j=0;j<e.buttons.length;j++)void 0===e.buttons[j].id&&(e.buttons[j].id="info_button_"+j),k+="<a id='"+e.buttons[j].id+"' class='fm-button "+i.button+"'>"+e.buttons[j].text+"</a>";var l=isNaN(e.dataheight)?e.dataheight:e.dataheight+"px",m="text-align:"+e.align+";",n="<div id='info_id'>";n+="<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:"+l+";"+m+"'>"+b+"</div>",n+=c?"<div class='"+h.content+"' style='text-align:"+e.buttonalign+";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a id='closedialog' class='fm-button "+i.button+"'>"+c+"</a>"+k+"</div>":""!==k?"<div class='"+h.content+"' style='text-align:"+e.buttonalign+";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>"+k+"</div>":"",n+="</div>";try{"false"===$("#info_dialog").attr("aria-hidden")&&$.jgrid.hideModal("#info_dialog",{jqm:f}),$("#info_dialog").remove()}catch(a){}var o=$(".ui-jqgrid").css("font-size")||"11px";$.jgrid.createModal({themodal:"info_dialog",modalhead:"info_head",modalcontent:"info_content",scrollelm:"infocnt"},n,e,"","",!0,{"font-size":o}),k&&$.each(e.buttons,function(a){$("#"+$.jgrid.jqID(this.id),"#info_id").on("click",function(){return e.buttons[a].onClick.call($("#info_dialog")),!1})}),$("#closedialog","#info_id").on("click",function(){return g.hideModal("#info_dialog",{jqm:f,onClose:$("#info_dialog").data("onClose")||e.onClose,gb:$("#info_dialog").data("gbox")||e.gbox}),!1}),$(".fm-button","#info_dialog").hover(function(){$(this).addClass(i.hover)},function(){$(this).removeClass(i.hover)}),$.isFunction(e.beforeOpen)&&e.beforeOpen(),$.jgrid.viewModal("#info_dialog",{onHide:function(a){a.w.hide().remove(),a.o&&a.o.remove()},modal:e.modal,jqm:f}),$.isFunction(e.afterOpen)&&e.afterOpen();try{$("#info_dialog").focus()}catch(a){}},bindEv:function(a,b){var c=this;$.isFunction(b.dataInit)&&b.dataInit.call(c,a,b),b.dataEvents&&$.each(b.dataEvents,function(){void 0!==this.data?$(a).on(this.type,this.data,this.fn):$(a).on(this.type,this.fn)})},createEl:function(a,b,c,d,e){function f(a,b,c){var d=["dataInit","dataEvents","dataUrl","buildSelect","sopt","searchhidden","defaultValue","attr","custom_element","custom_value","oper"];d=d.concat(["cacheUrlData","delimiter","separator"]),void 0!==c&&$.isArray(c)&&$.merge(d,c),$.each(b,function(b,c){-1===$.inArray(b,d)&&$(a).attr(b,c)}),b.hasOwnProperty("id")||$(a).attr("id",$.jgrid.randId())}var g="",h=this;switch(a){case"textarea":g=document.createElement("textarea"),d?b.cols||$(g).css({width:"98%"}):b.cols||(b.cols=20),b.rows||(b.rows=2),("&nbsp;"===c||"&#160;"===c||1===c.length&&160===c.charCodeAt(0))&&(c=""),g.value=c,$(g).attr({role:"textbox",multiline:"true"}),f(g,b);break;case"checkbox":if(g=document.createElement("input"),g.type="checkbox",b.value){var i=b.value.split(":");c===i[0]&&(g.checked=!0,g.defaultChecked=!0),g.value=i[0],$(g).attr("offval",i[1])}else{var j=(c+"").toLowerCase();j.search(/(false|f|0|no|n|off|undefined)/i)<0&&""!==j?(g.checked=!0,g.defaultChecked=!0,g.value=c):g.value="on",$(g).attr("offval","off")}$(g).attr("role","checkbox"),f(g,b,["value"]);break;case"select":g=document.createElement("select"),g.setAttribute("role","select");var k,l=[];if(!0===b.multiple?(k=!0,g.multiple="multiple",$(g).attr("aria-multiselectable","true")):k=!1,null!=b.dataUrl){var m=null,n=b.postData||e.postData;try{m=b.rowId}catch(a){}h.p&&h.p.idPrefix&&(m=$.jgrid.stripPref(h.p.idPrefix,m)),$.ajax($.extend({url:$.isFunction(b.dataUrl)?b.dataUrl.call(h,m,c,String(b.name)):b.dataUrl,type:"GET",dataType:"html",data:$.isFunction(n)?n.call(h,m,c,String(b.name)):n,context:{elem:g,options:b,vl:c},success:function(a){var b,c=[],d=this.elem,e=this.vl,g=$.extend({},this.options),i=!0===g.multiple,j=!0===g.cacheUrlData,k="",l=$.isFunction(g.buildSelect)?g.buildSelect.call(h,a):a;if("string"==typeof l&&(l=$($.trim(l)).html()),l){if($(d).append(l),f(d,g,n?["postData"]:void 0),void 0===g.size&&(g.size=i?3:1),i?(c=e.split(","),c=$.map(c,function(a){return $.trim(a)})):c[0]=$.trim(e),$("option",d).each(function(a){b=$(this).text(),e=$(this).val(),j&&(k+=(0!==a?";":"")+e+":"+b),0===a&&d.multiple&&(this.selected=!1),$(this).attr("role","option"),($.inArray($.trim(b),c)>-1||$.inArray($.trim(e),c)>-1)&&(this.selected="selected")}),j)if("edit"===g.oper)$(h).jqGrid("setColProp",g.name,{editoptions:{buildSelect:null,dataUrl:null,value:k}});else if("search"===g.oper)$(h).jqGrid("setColProp",g.name,{searchoptions:{dataUrl:null,value:k}});else if("filter"===g.oper&&$("#fbox_"+h.p.id)[0].p){var m,o=$("#fbox_"+h.p.id)[0].p.columns;$.each(o,function(a){if(m=this.index||this.name,g.name===m)return this.searchoptions.dataUrl=null,this.searchoptions.value=k,!1})}$(h).triggerHandler("jqGridAddEditAfterSelectUrlComplete",[d])}}},e||{}))}else if(b.value){var o;void 0===b.size&&(b.size=k?3:1),k&&(l=c.split(","),l=$.map(l,function(a){return $.trim(a)})),"function"==typeof b.value&&(b.value=b.value());var p,q,r,s,t,u,v=void 0===b.separator?":":b.separator,w=void 0===b.delimiter?";":b.delimiter;if("string"==typeof b.value)for(p=b.value.split(w),o=0;o<p.length;o++)q=p[o].split(v),
q.length>2&&(q[1]=$.map(q,function(a,b){if(b>0)return a}).join(v)),r=document.createElement("option"),r.setAttribute("role","option"),r.value=q[0],r.innerHTML=q[1],g.appendChild(r),k||$.trim(q[0])!==$.trim(c)&&$.trim(q[1])!==$.trim(c)||(r.selected="selected"),k&&($.inArray($.trim(q[1]),l)>-1||$.inArray($.trim(q[0]),l)>-1)&&(r.selected="selected");else if("[object Array]"===Object.prototype.toString.call(b.value))for(s=b.value,o=0;o<s.length;o++)2===s[o].length&&(t=s[o][0],u=s[o][1],r=document.createElement("option"),r.setAttribute("role","option"),r.value=t,r.innerHTML=u,g.appendChild(r),k||$.trim(t)!==$.trim(c)&&$.trim(u)!==$.trim(c)||(r.selected="selected"),k&&($.inArray($.trim(u),l)>-1||$.inArray($.trim(t),l)>-1)&&(r.selected="selected"));else if("object"==typeof b.value){s=b.value;for(t in s)s.hasOwnProperty(t)&&(r=document.createElement("option"),r.setAttribute("role","option"),r.value=t,r.innerHTML=s[t],g.appendChild(r),k||$.trim(t)!==$.trim(c)&&$.trim(s[t])!==$.trim(c)||(r.selected="selected"),k&&($.inArray($.trim(s[t]),l)>-1||$.inArray($.trim(t),l)>-1)&&(r.selected="selected"))}f(g,b,["value"])}break;case"image":case"file":g=document.createElement("input"),g.type=a,f(g,b);break;case"custom":g=document.createElement("span");try{if(!$.isFunction(b.custom_element))throw"e1";var x=b.custom_element.call(h,c,b);if(!x)throw"e2";x=$(x).addClass("customelement").attr({id:b.id,name:b.name}),$(g).empty().append(x)}catch(a){var y=$.jgrid.getRegional(h,"errors"),z=$.jgrid.getRegional(h,"edit");"e1"===a?$.jgrid.info_dialog(y.errcap,"function 'custom_element' "+z.msg.nodefined,z.bClose,{styleUI:h.p.styleUI}):"e2"===a?$.jgrid.info_dialog(y.errcap,"function 'custom_element' "+z.msg.novalue,z.bClose,{styleUI:h.p.styleUI}):$.jgrid.info_dialog(y.errcap,"string"==typeof a?a:a.message,z.bClose,{styleUI:h.p.styleUI})}break;default:var A;A="button"===a?"button":"textbox",g=document.createElement("input"),g.type=a,g.value=c,"button"!==a&&(d?b.size||$(g).css({width:"96%"}):b.size||(b.size=20)),$(g).attr("role",A),f(g,b)}return g},checkDate:function(a,b){var c,d=function(a){return a%4!=0||a%100==0&&a%400!=0?28:29},e={};if(a=a.toLowerCase(),c=-1!==a.indexOf("/")?"/":-1!==a.indexOf("-")?"-":-1!==a.indexOf(".")?".":"/",a=a.split(c),b=b.split(c),3!==b.length)return!1;var f,g,h=-1,i=-1,j=-1;for(g=0;g<a.length;g++){var k=isNaN(b[g])?0:parseInt(b[g],10);e[a[g]]=k,f=a[g],-1!==f.indexOf("y")&&(h=g),-1!==f.indexOf("m")&&(j=g),-1!==f.indexOf("d")&&(i=g)}f="y"===a[h]||"yyyy"===a[h]?4:"yy"===a[h]?2:-1;var l,m=[0,31,29,31,30,31,30,31,31,30,31,30,31];return-1!==h&&(l=e[a[h]].toString(),2===f&&1===l.length&&(f=1),l.length===f&&(0!==e[a[h]]||"00"===b[h])&&(-1!==j&&(l=e[a[j]].toString(),!(l.length<1||e[a[j]]<1||e[a[j]]>12)&&(-1!==i&&(l=e[a[i]].toString(),!(l.length<1||e[a[i]]<1||e[a[i]]>31||2===e[a[j]]&&e[a[i]]>d(e[a[h]])||e[a[i]]>m[e[a[j]]]))))))},isEmpty:function(a){return!(void 0!==a&&!a.match(/^\s+$/)&&""!==a)},checkTime:function(a){var b,c=/^(\d{1,2}):(\d{2})([apAP][Mm])?$/;if(!$.jgrid.isEmpty(a)){if(!(b=a.match(c)))return!1;if(b[3]){if(b[1]<1||b[1]>12)return!1}else if(b[1]>23)return!1;if(b[2]>59)return!1}return!0},checkValues:function(a,b,c,d){var e,f,g,h,i,j,k=this,l=k.p.colModel,m=$.jgrid.getRegional(this,"edit.msg"),n=function(a){var a=a.toString();if(a.length>=2){var b,c;if("-"===a[0]?(b=a[1],a[2]&&(c=a[2])):(b=a[0],a[1]&&(c=a[1])),"0"===b&&"."!==c)return!1}return"number"==typeof parseFloat(a)&&isFinite(a)};if(void 0===c)if("string"==typeof b){for(f=0,i=l.length;f<i;f++)if(l[f].name===b){e=l[f].editrules,b=f,null!=l[f].formoptions&&(g=l[f].formoptions.label);break}}else b>=0&&(e=l[b].editrules);else e=c,g=void 0===d?"_":d;if(e){if(g||(g=null!=k.p.colNames?k.p.colNames[b]:l[b].label),!0===e.required&&$.jgrid.isEmpty(a))return[!1,g+": "+m.required,""];var o=!1!==e.required;if(!0===e.number&&!(!1===o&&$.jgrid.isEmpty(a)||n(a)))return[!1,g+": "+m.number,""];if(void 0!==e.minValue&&!isNaN(e.minValue)&&parseFloat(a)<parseFloat(e.minValue))return[!1,g+": "+m.minValue+" "+e.minValue,""];if(void 0!==e.maxValue&&!isNaN(e.maxValue)&&parseFloat(a)>parseFloat(e.maxValue))return[!1,g+": "+m.maxValue+" "+e.maxValue,""];var p;if(!0===e.email&&!(!1===o&&$.jgrid.isEmpty(a)||(p=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,p.test(a))))return[!1,g+": "+m.email,""];if(!0===e.integer&&(!1!==o||!$.jgrid.isEmpty(a))){if(!n(a))return[!1,g+": "+m.integer,""];if(a%1!=0||-1!==a.indexOf("."))return[!1,g+": "+m.integer,""]}if(!0===e.date&&!(!1===o&&$.jgrid.isEmpty(a)||(l[b].formatoptions&&l[b].formatoptions.newformat?(h=l[b].formatoptions.newformat,(j=$.jgrid.getRegional(k,"formatter.date.masks"))&&j.hasOwnProperty(h)&&(h=j[h])):h=l[b].datefmt||"Y-m-d",$.jgrid.checkDate(h,a))))return[!1,g+": "+m.date+" - "+h,""];if(!0===e.time&&!(!1===o&&$.jgrid.isEmpty(a)||$.jgrid.checkTime(a)))return[!1,g+": "+m.date+" - hh:mm (am/pm)",""];if(!0===e.url&&!(!1===o&&$.jgrid.isEmpty(a)||(p=/^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i,p.test(a))))return[!1,g+": "+m.url,""];if(!0===e.custom&&(!1!==o||!$.jgrid.isEmpty(a))){if($.isFunction(e.custom_func)){var q=e.custom_func.call(k,a,g,b);return $.isArray(q)?q:[!1,m.customarray,""]}return[!1,m.customfcheck,""]}}return[!0,"",""]},validateForm:function(a){var b,c,d=!0;for(b=0;b<a.elements.length;b++)if(c=a.elements[b],("INPUT"===c.nodeName||"TEXTAREA"===c.nodeName||"SELECT"===c.nodeName)&&(void 0!==c.willValidate?("INPUT"===c.nodeName&&c.type!==c.getAttribute("type")&&c.setCustomValidity($.jgrid.LegacyValidation(c)?"":"error"),c.reportValidity()):(c.validity=c.validity||{},c.validity.valid=$.jgrid.LegacyValidation(c)),!c.validity.valid)){d=!1;break}return d},LegacyValidation:function(a){var b=!0,c=a.value,d=a.getAttribute("type"),e="checkbox"===d||"radio"===d,f=a.getAttribute("required"),g=a.getAttribute("minlength"),h=a.getAttribute("maxlength"),i=a.getAttribute("pattern");return a.disabled?b:(b=b&&(!f||e&&a.checked||!e&&""!==c),b=b&&(e||(!g||c.length>=g)&&(!h||c.length<=h)),b&&i&&(i=new RegExp(i),b=i.test(c)),b)},buildButtons:function(a,b,c){var d,e;return $.each(a,function(a,f){f.id||(f.id=$.jgrid.randId()),f.position||(f.position="last"),f.side||(f.side="left"),d=f.icon?" fm-button-icon-"+f.side+"'><span class='"+c.icon_base+" "+f.icon+"'></span>":"'>",e="<a  data-index='"+a+"' id='"+f.id+"' class='fm-button "+c.button+d+f.text+"</a>","last"===f.position?b+=e:b=e+b}),b}}),$.fn.jqFilter=function(a){if("string"==typeof a){var b=$.fn.jqFilter[a];if(!b)throw"jqFilter - No such method: "+a;var c=$.makeArray(arguments).slice(1);return b.apply(this,c)}var d=$.extend(!0,{filter:null,columns:[],sortStrategy:null,onChange:null,afterRedraw:null,checkValues:null,error:!1,errmsg:"",errorcheck:!0,showQuery:!0,sopt:null,ops:[],operands:null,numopts:["eq","ne","lt","le","gt","ge","nu","nn","in","ni"],stropts:["eq","ne","bw","bn","ew","en","cn","nc","nu","nn","in","ni"],strarr:["text","string","blob"],groupOps:[{op:"AND",text:"AND"},{op:"OR",text:"OR"}],groupButton:!0,ruleButtons:!0,uniqueSearchFields:!1,direction:"ltr",addsubgrup:"Add subgroup",addrule:"Add rule",delgroup:"Delete group",delrule:"Delete rule",autoencode:!1},$.jgrid.filter,a||{});return this.each(function(){if(!this.filter){this.p=d,null!==this.p.filter&&void 0!==this.p.filter||(this.p.filter={groupOp:this.p.groupOps[0].op,rules:[],groups:[]}),null!=this.p.sortStrategy&&$.isFunction(this.p.sortStrategy)&&this.p.columns.sort(this.p.sortStrategy);var a,b,c=this.p.columns.length,e=/msie/i.test(navigator.userAgent)&&!window.opera;if(this.p.initFilter=$.extend(!0,{},this.p.filter),c){for(a=0;a<c;a++)b=this.p.columns[a],b.stype?b.inputtype=b.stype:b.inputtype||(b.inputtype="text"),b.sorttype?b.searchtype=b.sorttype:b.searchtype||(b.searchtype="string"),void 0===b.hidden&&(b.hidden=!1),b.label||(b.label=b.name),b.index&&(b.name=b.index),b.hasOwnProperty("searchoptions")||(b.searchoptions={}),b.hasOwnProperty("searchrules")||(b.searchrules={}),void 0===b.search?b.inlist=!0:b.inlist=b.search;var f=function(){return $("#"+$.jgrid.jqID(d.id))[0]||null},g=f(),h=$.jgrid.styleUI[g.p.styleUI||"jQueryUI"].filter,i=$.jgrid.styleUI[g.p.styleUI||"jQueryUI"].common;this.p.showQuery&&$(this).append("<table class='queryresult "+h.table_widget+"' style='display:block;max-width:440px;border:0px none;' dir='"+this.p.direction+"'><tbody><tr><td class='query'></td></tr></tbody></table>");var j=function(a,b){var c=[!0,""],e=f();if($.isFunction(b.searchrules))c=b.searchrules.call(e,a,b);else if($.jgrid&&$.jgrid.checkValues)try{c=$.jgrid.checkValues.call(e,a,-1,b.searchrules,b.label)}catch(a){}c&&c.length&&!1===c[0]&&(d.error=!c[0],d.errmsg=c[1])};this.onchange=function(){return this.p.error=!1,this.p.errmsg="",!!$.isFunction(this.p.onChange)&&this.p.onChange.call(this,this.p)},this.reDraw=function(){$("table.group:first",this).remove();var a=this.createTableForGroup(d.filter,null);$(this).append(a),$.isFunction(this.p.afterRedraw)&&this.p.afterRedraw.call(this,this.p)},this.createTableForGroup=function(a,b){var c,e=this,f=$("<table class='group "+h.table_widget+" ui-search-table' style='border:0px none;'><tbody></tbody></table>"),g="left";"rtl"===this.p.direction&&(g="right",f.attr("dir","rtl")),null===b&&f.append("<tr class='error' style='display:none;'><th colspan='5' class='"+i.error+"' align='"+g+"'></th></tr>");var j=$("<tr></tr>");f.append(j);var k=$("<th colspan='5' align='"+g+"'></th>");if(j.append(k),!0===this.p.ruleButtons){var l=$("<select size='1' class='opsel "+h.srSelect+"'></select>");k.append(l);var m,n="";for(c=0;c<d.groupOps.length;c++)m=a.groupOp===e.p.groupOps[c].op?" selected='selected'":"",n+="<option value='"+e.p.groupOps[c].op+"'"+m+">"+e.p.groupOps[c].text+"</option>";l.append(n).on("change",function(){a.groupOp=$(l).val(),e.onchange()})}var o="<span></span>";if(this.p.groupButton&&(o=$("<input type='button' value='+ {}' title='"+e.p.subgroup+"' class='add-group "+i.button+"'/>"),o.on("click",function(){return void 0===a.groups&&(a.groups=[]),a.groups.push({groupOp:d.groupOps[0].op,rules:[],groups:[]}),e.reDraw(),e.onchange(),!1})),k.append(o),!0===this.p.ruleButtons){var p,q=$("<input type='button' value='+' title='"+e.p.addrule+"' class='add-rule ui-add "+i.button+"'/>");q.on("click",function(){for(void 0===a.rules&&(a.rules=[]),c=0;c<e.p.columns.length;c++){var b=void 0===e.p.columns[c].search||e.p.columns[c].search,d=!0===e.p.columns[c].hidden;if(!0===e.p.columns[c].searchoptions.searchhidden&&b||b&&!d){p=e.p.columns[c];break}}if(!p)return!1;var f;return f=p.searchoptions.sopt?p.searchoptions.sopt:e.p.sopt?e.p.sopt:-1!==$.inArray(p.searchtype,e.p.strarr)?e.p.stropts:e.p.numopts,a.rules.push({field:p.name,op:f[0],data:""}),e.reDraw(),!1}),k.append(q)}if(null!==b){var r=$("<input type='button' value='-' title='"+e.p.delgroup+"' class='delete-group "+i.button+"'/>");k.append(r),r.on("click",function(){for(c=0;c<b.groups.length;c++)if(b.groups[c]===a){b.groups.splice(c,1);break}return e.reDraw(),e.onchange(),!1})}if(void 0!==a.groups)for(c=0;c<a.groups.length;c++){var s=$("<tr></tr>");f.append(s);var t=$("<td class='first'></td>");s.append(t);var u=$("<td colspan='4'></td>");u.append(this.createTableForGroup(a.groups[c],a)),s.append(u)}void 0===a.groupOp&&(a.groupOp=e.p.groupOps[0].op);var v,w=e.p.ruleButtons&&e.p.uniqueSearchFields;if(w)for(v=0;v<e.p.columns.length;v++)e.p.columns[v].inlist&&(e.p.columns[v].search=!0);if(void 0!==a.rules)for(c=0;c<a.rules.length;c++)if(f.append(this.createTableRowForRule(a.rules[c],a)),w){var x=a.rules[c].field;for(v=0;v<e.p.columns.length;v++)if(x===e.p.columns[v].name){e.p.columns[v].search=!1;break}}return f},this.createTableRowForRule=function(a,b){var c,g,j,k,l,m=this,n=f(),o=$("<tr></tr>"),p="";o.append("<td class='first'></td>");var q=$("<td class='columns'></td>");o.append(q);var r,s=$("<select size='1' class='"+h.srSelect+"'></select>"),t=[];q.append(s),s.on("change",function(){if(m.p.ruleButtons&&m.p.uniqueSearchFields){var b=parseInt($(this).data("curr"),10),d=this.selectedIndex;b>=0&&(m.p.columns[b].search=!0,$(this).data("curr",d),m.p.columns[d].search=!1)}for(a.field=$(s).val(),j=$(this).parents("tr:first"),$(".data",j).empty(),c=0;c<m.p.columns.length;c++)if(m.p.columns[c].name===a.field){k=m.p.columns[c];break}if(k){k.searchoptions.id=$.jgrid.randId(),k.searchoptions.name=a.field,k.searchoptions.oper="filter",e&&"text"===k.inputtype&&(k.searchoptions.size||(k.searchoptions.size=10));var f=$.jgrid.createEl.call(n,k.inputtype,k.searchoptions,"",!0,m.p.ajaxSelectOptions||{},!0);$(f).addClass("input-elm "+h.srInput),g=k.searchoptions.sopt?k.searchoptions.sopt:m.p.sopt?m.p.sopt:-1!==$.inArray(k.searchtype,m.p.strarr)?m.p.stropts:m.p.numopts;var i="",l=0;for(t=[],$.each(m.p.ops,function(){t.push(this.oper)}),c=0;c<g.length;c++)-1!==(r=$.inArray(g[c],t))&&(0===l&&(a.op=m.p.ops[r].oper),i+="<option value='"+m.p.ops[r].oper+"'>"+m.p.ops[r].text+"</option>",l++);if($(".selectopts",j).empty().append(i),$(".selectopts",j)[0].selectedIndex=0,$.jgrid.msie()&&$.jgrid.msiever()<9){var o=parseInt($("select.selectopts",j)[0].offsetWidth,10)+1;$(".selectopts",j).width(o),$(".selectopts",j).css("width","auto")}$(".data",j).append(f),$.jgrid.bindEv.call(n,f,k.searchoptions),$(".input-elm",j).on("change",function(b){var c=b.target;"custom"===k.inputtype&&$.isFunction(k.searchoptions.custom_value)?a.data=k.searchoptions.custom_value.call(n,$(".customelement",this),"get"):a.data=$(c).val(),"select"===k.inputtype&&k.searchoptions.multiple&&(a.data=a.data.join(",")),m.onchange()}),setTimeout(function(){a.data=$(f).val(),m.onchange()},0)}});var u=0;for(c=0;c<m.p.columns.length;c++){var v=void 0===m.p.columns[c].search||m.p.columns[c].search,w=!0===m.p.columns[c].hidden;(!0===m.p.columns[c].searchoptions.searchhidden&&v||v&&!w)&&(l="",a.field===m.p.columns[c].name&&(l=" selected='selected'",u=c),p+="<option value='"+m.p.columns[c].name+"'"+l+">"+m.p.columns[c].label+"</option>")}s.append(p),s.data("curr",u);var x=$("<td class='operators'></td>");o.append(x),k=d.columns[u],k.searchoptions.id=$.jgrid.randId(),e&&"text"===k.inputtype&&(k.searchoptions.size||(k.searchoptions.size=10)),k.searchoptions.name=a.field,k.searchoptions.oper="filter";var y=$.jgrid.createEl.call(n,k.inputtype,k.searchoptions,a.data,!0,m.p.ajaxSelectOptions||{},!0);"nu"!==a.op&&"nn"!==a.op||($(y).attr("readonly","true"),$(y).attr("disabled","true"));var z=$("<select size='1' class='selectopts "+h.srSelect+"'></select>");for(x.append(z),z.on("change",function(){a.op=$(z).val(),j=$(this).parents("tr:first");var b=$(".input-elm",j)[0];"nu"===a.op||"nn"===a.op?(a.data="","SELECT"!==b.tagName.toUpperCase()&&(b.value=""),b.setAttribute("readonly","true"),b.setAttribute("disabled","true")):("SELECT"===b.tagName.toUpperCase()&&(a.data=b.value),b.removeAttribute("readonly"),b.removeAttribute("disabled")),m.onchange()}),g=k.searchoptions.sopt?k.searchoptions.sopt:m.p.sopt?m.p.sopt:-1!==$.inArray(k.searchtype,m.p.strarr)?m.p.stropts:m.p.numopts,p="",$.each(m.p.ops,function(){t.push(this.oper)}),c=0;c<g.length;c++)-1!==(r=$.inArray(g[c],t))&&(l=a.op===m.p.ops[r].oper?" selected='selected'":"",p+="<option value='"+m.p.ops[r].oper+"'"+l+">"+m.p.ops[r].text+"</option>");z.append(p);var A=$("<td class='data'></td>");o.append(A),A.append(y),$.jgrid.bindEv.call(n,y,k.searchoptions),$(y).addClass("input-elm "+h.srInput).on("change",function(){a.data="custom"===k.inputtype?k.searchoptions.custom_value.call(n,$(".customelement",this),"get"):$(this).val(),m.onchange()});var B=$("<td></td>");if(o.append(B),!0===this.p.ruleButtons){var C=$("<input type='button' value='-' title='"+m.p.delrule+"' class='delete-rule ui-del "+i.button+"'/>");B.append(C),C.on("click",function(){for(c=0;c<b.rules.length;c++)if(b.rules[c]===a){b.rules.splice(c,1);break}return m.reDraw(),m.onchange(),!1})}return o},this.getStringForGroup=function(a){var b,c="(";if(void 0!==a.groups)for(b=0;b<a.groups.length;b++){c.length>1&&(c+=" "+a.groupOp+" ");try{c+=this.getStringForGroup(a.groups[b])}catch(a){alert(a)}}if(void 0!==a.rules)try{for(b=0;b<a.rules.length;b++)c.length>1&&(c+=" "+a.groupOp+" "),c+=this.getStringForRule(a.rules[b])}catch(a){alert(a)}return c+=")","()"===c?"":c},this.getStringForRule=function(a){var b,c,e,f="",g="",h=["int","integer","float","number","currency"];for(b=0;b<this.p.ops.length;b++)if(this.p.ops[b].oper===a.op){f=this.p.operands.hasOwnProperty(a.op)?this.p.operands[a.op]:"",g=this.p.ops[b].oper;break}for(b=0;b<this.p.columns.length;b++)if(this.p.columns[b].name===a.field){c=this.p.columns[b];break}return void 0===c?"":(e=this.p.autoencode?$.jgrid.htmlEncode(a.data):a.data,"bw"!==g&&"bn"!==g||(e+="%"),"ew"!==g&&"en"!==g||(e="%"+e),"cn"!==g&&"nc"!==g||(e="%"+e+"%"),"in"!==g&&"ni"!==g||(e=" ("+e+")"),d.errorcheck&&j(a.data,c),-1!==$.inArray(c.searchtype,h)||"nn"===g||"nu"===g?a.field+" "+f+" "+e:a.field+" "+f+' "'+e+'"')},this.resetFilter=function(){this.p.filter=$.extend(!0,{},this.p.initFilter),this.reDraw(),this.onchange()},this.hideError=function(){$("th."+i.error,this).html(""),$("tr.error",this).hide()},this.showError=function(){$("th."+i.error,this).html(this.p.errmsg),$("tr.error",this).show()},this.toUserFriendlyString=function(){return this.getStringForGroup(d.filter)},this.toString=function(){function a(a){if(c.p.errorcheck){var b,d;for(b=0;b<c.p.columns.length;b++)if(c.p.columns[b].name===a.field){d=c.p.columns[b];break}d&&j(a.data,d)}return a.op+"(item."+a.field+",'"+a.data+"')"}function b(c){var d,e="(";if(void 0!==c.groups)for(d=0;d<c.groups.length;d++)e.length>1&&("OR"===c.groupOp?e+=" || ":e+=" && "),e+=b(c.groups[d]);if(void 0!==c.rules)for(d=0;d<c.rules.length;d++)e.length>1&&("OR"===c.groupOp?e+=" || ":e+=" && "),e+=a(c.rules[d]);return e+=")","()"===e?"":e}var c=this;return b(this.p.filter)},this.reDraw(),this.p.showQuery&&this.onchange(),this.filter=!0}}})},$.extend($.fn.jqFilter,{toSQLString:function(){var a="";return this.each(function(){a=this.toUserFriendlyString()}),a},filterData:function(){var a;return this.each(function(){a=this.p.filter}),a},getParameter:function(a){var b=null;return void 0!==a&&this.each(function(c,d){d.p.hasOwnProperty(a)&&(b=d.p[a])}),b||this[0].p},resetFilter:function(){return this.each(function(){this.resetFilter()})},addFilter:function(a){"string"==typeof a&&(a=$.jgrid.parse(a)),this.each(function(){this.p.filter=a,this.reDraw(),this.onchange()})}}),$.extend($.jgrid,{filterRefactor:function(a){var b,c,d,e,f,g={};try{if(g="string"==typeof a.ruleGroup?$.jgrid.parse(a.ruleGroup):a.ruleGroup,g.rules&&g.rules.length)for(b=g.rules,c=0;c<b.length;c++)d=b[c],$.inArray(d.filed,a.ssfield)&&(e=d.data.split(a.splitSelect),e.length>1&&(void 0===g.groups&&(g.groups=[]),f={groupOp:a.groupOpSelect,groups:[],rules:[]},g.groups.push(f),$.each(e,function(a){e[a]&&f.rules.push({data:e[a],op:d.op,field:d.field})}),b.splice(c,1),c--))}catch(a){}return g}}),$.jgrid.extend({filterToolbar:function(a){var b=$.jgrid.getRegional(this[0],"search");return a=$.extend({autosearch:!0,autosearchDelay:500,searchOnEnter:!0,beforeSearch:null,afterSearch:null,beforeClear:null,afterClear:null,onClearSearchValue:null,url:"",stringResult:!1,groupOp:"AND",defaultSearch:"bw",searchOperators:!1,resetIcon:"x",splitSelect:",",groupOpSelect:"OR",errorcheck:!0,operands:{eq:"==",ne:"!",lt:"<",le:"<=",gt:">",ge:">=",bw:"^",bn:"!^",in:"=",ni:"!=",ew:"|",en:"!@",cn:"~",nc:"!~",nu:"#",nn:"!#",bt:"..."}},b,a||{}),this.each(function(){var c=this;if(!c.p.filterToolbar){$(c).data("filterToolbar")||$(c).data("filterToolbar",a),c.p.force_regional&&(a=$.extend(a,b));var d,e,f,g=$.jgrid.styleUI[c.p.styleUI||"jQueryUI"].filter,h=$.jgrid.styleUI[c.p.styleUI||"jQueryUI"].common,i=$.jgrid.styleUI[c.p.styleUI||"jQueryUI"].base,j=function(){var b,d,e,f,g={},h=0,i={},j=!1,k=[],l=!1,m=[!0,"",""],n=!1;if($.each(c.p.colModel,function(){var o=$("#gs_"+c.p.idPrefix+$.jgrid.jqID(this.name),!0===this.frozen&&!0===c.p.frozenColumns?c.grid.fhDiv:c.grid.hDiv);if(d=this.index||this.name,f=this.searchoptions||{},e=a.searchOperators&&f.searchOperMenu?o.parent().prev().children("a").attr("soper")||a.defaultSearch:f.sopt?f.sopt[0]:"select"===this.stype?"eq":a.defaultSearch,b="custom"===this.stype&&$.isFunction(f.custom_value)&&o.length>0?f.custom_value.call(c,o,"get"):o.val(),"select"===this.stype&&f.multiple&&$.isArray(b)&&b.length&&(j=!0,k.push(d),b=1===b.length?b[0]:b),this.searchrules&&a.errorcheck&&($.isFunction(this.searchrules)?m=this.searchrules.call(c,b,this):$.jgrid&&$.jgrid.checkValues&&(m=$.jgrid.checkValues.call(c,b,-1,this.searchrules,this.label||this.name)),m&&m.length&&!1===m[0]))return this.searchrules.hasOwnProperty("validationError")&&(n=this.searchrules.validationError),!1;if("bt"===e&&(l=!0),b||"nu"===e||"nn"===e)g[d]=b,i[d]=e,h++;else try{delete c.p.postData[d]}catch(a){}}),!1!==m[0]){var o=h>0;if(!0===a.stringResult||"local"===c.p.datatype||!0===a.searchOperators){var p='{"groupOp":"'+a.groupOp+'","rules":[',q=0;$.each(g,function(a,b){q>0&&(p+=","),p+='{"field":"'+a+'",',p+='"op":"'+i[a]+'",',b+="",p+='"data":"'+b.replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"}',q++}),p+="]}";var r,s,t,u,v,w,x;if(j&&(r=$.jgrid.filterRefactor({ruleGroup:p,ssfield:k,splitSelect:a.splitSelect,groupOpSelect:a.groupOpSelect}),p=JSON.stringify(r)),l&&($.isPlainObject(r)||(r=$.jgrid.parse(p)),r.rules&&r.rules.length))for(s=r.rules,t=0;t<s.length;t++)v=s[t],"bt"===v.op&&(w=v.data.split("..."),w.length>1&&(void 0===r.groups&&(r.groups=[]),x={groupOp:"AND",groups:[],rules:[]},r.groups.push(x),$.each(w,function(a){var b=0===a?"ge":"le";(u=w[a])&&x.rules.push({data:w[a],op:b,field:v.field})}),s.splice(t,1),t--));(l||j)&&(p=JSON.stringify(r)),$.extend(c.p.postData,{filters:p}),$.each(["searchField","searchString","searchOper"],function(a,b){c.p.postData.hasOwnProperty(b)&&delete c.p.postData[b]})}else $.extend(c.p.postData,g);var y;a.url&&(y=c.p.url,$(c).jqGrid("setGridParam",{url:a.url}));var z="stop"===$(c).triggerHandler("jqGridToolbarBeforeSearch");!z&&$.isFunction(a.beforeSearch)&&(z=a.beforeSearch.call(c)),z||$(c).jqGrid("setGridParam",{search:o}).trigger("reloadGrid",[{page:1}]),y&&$(c).jqGrid("setGridParam",{url:y}),$(c).triggerHandler("jqGridToolbarAfterSearch"),$.isFunction(a.afterSearch)&&a.afterSearch.call(c)}else if($.isFunction(n))n.call(c,m[1]);else{var A=$.jgrid.getRegional(c,"errors");$.jgrid.info_dialog(A.errcap,m[1],"",{styleUI:c.p.styleUI})}},k=function(b){var d,e={},f=0;b="boolean"!=typeof b||b,$.each(c.p.colModel,function(){var a,b=$("#gs_"+c.p.idPrefix+$.jgrid.jqID(this.name),!0===this.frozen&&!0===c.p.frozenColumns?c.grid.fhDiv:c.grid.hDiv);switch(this.searchoptions&&void 0!==this.searchoptions.defaultValue&&(a=this.searchoptions.defaultValue),d=this.index||this.name,this.stype){case"select":if(b.find("option").each(function(b){if(0===b&&(this.selected=!0),$(this).val()===a)return this.selected=!0,!1}),void 0!==a)e[d]=a,f++;else try{delete c.p.postData[d]}catch(a){}break;case"text":if(b.val(a||""),void 0!==a)e[d]=a,f++;else try{delete c.p.postData[d]}catch(a){}break;case"custom":$.isFunction(this.searchoptions.custom_value)&&b.length>0&&this.searchoptions.custom_value.call(c,b,"set",a||"")}});var g=f>0;if(c.p.resetsearch=!0,!0===a.stringResult||"local"===c.p.datatype){var h='{"groupOp":"'+a.groupOp+'","rules":[',i=0;$.each(e,function(a,b){i>0&&(h+=","),h+='{"field":"'+a+'",',h+='"op":"eq",',b+="",h+='"data":"'+b.replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"}',i++}),h+="]}",$.extend(c.p.postData,{filters:h}),$.each(["searchField","searchString","searchOper"],function(a,b){c.p.postData.hasOwnProperty(b)&&delete c.p.postData[b]})}else $.extend(c.p.postData,e);var j;a.url&&(j=c.p.url,$(c).jqGrid("setGridParam",{url:a.url}));var k="stop"===$(c).triggerHandler("jqGridToolbarBeforeClear");!k&&$.isFunction(a.beforeClear)&&(k=a.beforeClear.call(c)),k||b&&$(c).jqGrid("setGridParam",{search:g}).trigger("reloadGrid",[{page:1}]),j&&$(c).jqGrid("setGridParam",{url:j}),$(c).triggerHandler("jqGridToolbarAfterClear"),$.isFunction(a.afterClear)&&a.afterClear()},l=function(){var a=$("tr.ui-search-toolbar",c.grid.hDiv);!0===c.p.frozenColumns&&$(c).jqGrid("destroyFrozenColumns"),"none"===a.css("display")?a.show():a.hide(),!0===c.p.frozenColumns&&$(c).jqGrid("setFrozenColumns")},m=function(b,d,e){$("#sopt_menu").remove(),d=parseInt(d,10),e=parseInt(e,10)+18;for(var f,i,k=$(".ui-jqgrid").css("font-size")||"11px",l='<ul id="sopt_menu" class="ui-search-menu modal-content" role="menu" tabindex="0" style="font-size:'+k+";left:"+d+"px;top:"+e+'px;">',m=$(b).attr("soper"),n=[],o=0,p=$(b).attr("colname"),q=c.p.colModel.length;o<q&&c.p.colModel[o].name!==p;)o++;var r=c.p.colModel[o],s=$.extend({},r.searchoptions);for(s.sopt||(s.sopt=[],s.sopt[0]="select"===r.stype?"eq":a.defaultSearch),$.each(a.odata,function(){n.push(this.oper)}),o=0;o<s.sopt.length;o++)-1!==(i=$.inArray(s.sopt[o],n))&&(f=m===a.odata[i].oper?h.highlight:"",l+='<li class="ui-menu-item '+f+'" role="presentation"><a class="'+h.cornerall+' g-menu-item" tabindex="0" role="menuitem" value="'+a.odata[i].oper+'" oper="'+a.operands[a.odata[i].oper]+'"><table class="ui-common-table"><tr><td width="25px">'+a.operands[a.odata[i].oper]+"</td><td>"+a.odata[i].text+"</td></tr></table></a></li>");l+="</ul>",$("body").append(l),$("#sopt_menu").addClass("ui-menu "+g.menu_widget),$("#sopt_menu > li > a").hover(function(){$(this).addClass(h.hover)},function(){$(this).removeClass(h.hover)}).click(function(){var d=$(this).attr("value"),e=$(this).attr("oper");if($(c).triggerHandler("jqGridToolbarSelectOper",[d,e,b]),$("#sopt_menu").hide(),$(b).text(e).attr("soper",d),!0===a.autosearch){var f=$(b).parent().next().children()[0];($(f).val()||"nu"===d||"nn"===d)&&j()}})},n=$("<tr class='ui-search-toolbar' role='row'></tr>");a.restoreFromFilters&&(f=c.p.postData.filters)&&("string"==typeof f&&(f=$.jgrid.parse(f)),e=!!f.rules.length&&f.rules),$.each(c.p.colModel,function(b){var f,h,k,l,m,o,p,q,r=this,s="",t="=",u=$("<th role='columnheader' class='"+i.headerBox+" ui-th-"+c.p.direction+"' id='gsh_"+c.p.id+"_"+r.name+"' ></th>"),v=$("<div></div>"),w=$("<table class='ui-search-table' cellspacing='0'><tr><td class='ui-search-oper' headers=''></td><td class='ui-search-input' headers=''></td><td class='ui-search-clear' headers=''></td></tr></table>");if(!0===this.hidden&&$(u).css("display","none"),this.search=!1!==this.search,void 0===this.stype&&(this.stype="text"),this.searchoptions=this.searchoptions||{},void 0===this.searchoptions.searchOperMenu&&(this.searchoptions.searchOperMenu=!0),f=$.extend({},this.searchoptions,{name:r.index||r.name,id:"gs_"+c.p.idPrefix+r.name,oper:"search"}),this.search){if(a.restoreFromFilters&&e){q=!1;for(var x=0;x<e.length;x++)if(e[x].field){var y=r.index||r.name;if(y===e[x].field){q=e[x];break}}}if(a.searchOperators){for(h=f.sopt?f.sopt[0]:"select"===r.stype?"eq":a.defaultSearch,a.restoreFromFilters&&q&&(h=q.op),k=0;k<a.odata.length;k++)if(a.odata[k].oper===h){t=a.operands[h]||"";break}l=null!=f.searchtitle?f.searchtitle:a.operandTitle,s=this.searchoptions.searchOperMenu?"<a title='"+l+"' style='padding-right: 0.5em;' soper='"+h+"' class='soptclass' colname='"+this.name+"'>"+t+"</a>":""}switch($("td:eq(0)",w).attr("colindex",b).append(s),void 0===f.clearSearch&&(f.clearSearch=!0),f.clearSearch?(m=a.resetTitle||"Clear Search Value",$("td:eq(2)",w).append("<a title='"+m+"' style='padding-right: 0.3em;padding-left: 0.3em;' class='clearsearchclass'>"+a.resetIcon+"</a>")):$("td:eq(2)",w).hide(),this.surl&&(f.dataUrl=this.surl),o="",f.defaultValue&&(o=$.isFunction(f.defaultValue)?f.defaultValue.call(c):f.defaultValue),a.restoreFromFilters&&q&&(o=q.data),p=$.jgrid.createEl.call(c,this.stype,f,o,!1,$.extend({},$.jgrid.ajaxOptions,c.p.ajaxSelectOptions||{})),$(p).addClass(g.srInput),$("td:eq(1)",w).append(p),$(v).append(w),null==f.dataEvents&&(f.dataEvents=[]),this.stype){case"select":!0===a.autosearch&&f.dataEvents.push({type:"change",fn:function(){return j(),!1}});break;case"text":!0===a.autosearch&&(a.searchOnEnter?f.dataEvents.push({type:"keypress",fn:function(a){return 13===(a.charCode||a.keyCode||0)?(j(),!1):this}}):f.dataEvents.push({type:"keydown",fn:function(b){switch(b.which){case 13:return!1;case 9:case 16:case 37:case 38:case 39:case 40:case 27:break;default:d&&clearTimeout(d),d=setTimeout(function(){j()},a.autosearchDelay)}}}))}$.jgrid.bindEv.call(c,p,f)}$(u).append(v),$(n).append(u),a.searchOperators&&""!==s||$("td:eq(0)",w).hide()}),$("table thead",c.grid.hDiv).append(n),a.searchOperators&&($(".soptclass",n).click(function(a){var b=$(this).offset(),c=b.left,d=b.top;m(this,c,d),a.stopPropagation()}),$("body").on("click",function(a){"soptclass"!==a.target.className&&$("#sopt_menu").remove()})),$(".clearsearchclass",n).click(function(){var b,d=$(this).parents("tr:first"),e=parseInt($("td.ui-search-oper",d).attr("colindex"),10),f=$.extend({},c.p.colModel[e].searchoptions||{}),g=f.defaultValue?f.defaultValue:"";"select"===c.p.colModel[e].stype?(b=$("td.ui-search-input select",d),g?b.val(g):b[0].selectedIndex=0):(b=$("td.ui-search-input input",d),b.val(g)),$(c).triggerHandler("jqGridToolbarClearVal",[b[0],e,f,g]),$.isFunction(a.onClearSearchValue)&&a.onClearSearchValue.call(c,b[0],e,f,g),!0===a.autosearch&&j()}),this.p.filterToolbar=!0,this.triggerToolbar=j,this.clearToolbar=k,this.toggleToolbar=l}})},destroyFilterToolbar:function(){return this.each(function(){this.p.filterToolbar&&(this.triggerToolbar=null,this.clearToolbar=null,this.toggleToolbar=null,this.p.filterToolbar=!1,$(this.grid.hDiv).find("table thead tr.ui-search-toolbar").remove())})},refreshFilterToolbar:function(a){return a=$.extend(!0,{filters:"",onClearVal:null,onSetVal:null},a||{}),this.each(function(){function b(f){if(f&&f.rules){for(g=f.rules,l=g.length,c=0;c<l;c++)if(h=g[c],-1!==(i=$.inArray(h.field,m))&&(e=$("#gs_"+j.p.idPrefix+$.jgrid.jqID(k[i].name)),e.length>0&&("select"===k[i].stype?e.find("option[value='"+$.jgrid.jqID(h.data)+"']").prop("selected",!0):"text"===k[i].stype&&e.val(h.data),$.isFunction(a.onSetVal)&&a.onSetVal.call(j,e,k[i].name),d&&d.searchOperators))){var n=e.parent().prev();n.hasClass("ui-search-oper")&&($(".soptclass",n).attr("soper",h.op),d.operands.hasOwnProperty(h.op)&&$(".soptclass",n).html(d.operands[h.op]))}if(f.groups)for(var o=0;o<f.groups.length;o++)b(f.groups[o])}}var c,d,e,f,g,h,i,j=this,k=j.p.colModel,l=j.p.colModel.length,m=[];if(j.p.filterToolbar){for(d=$(j).data("filterToolbar"),c=0;c<l;c++){switch(m.push(k[c].name),e=$("#gs_"+j.p.idPrefix+$.jgrid.jqID(k[c].name)),k[c].stype){case"select":case"text":e.val("")}$.isFunction(a.onClearVal)&&a.onClearVal.call(j,e,k[c].name)}"string"==typeof a.filters&&(a.filters.length?f=a.filters:j.p.postData.hasOwnProperty("filters")&&(f=j.p.postData.filters),f=$.jgrid.parse(f)),$.isPlainObject(f)&&b(f)}})},searchGrid:function(a){var b=$.jgrid.getRegional(this[0],"search");return a=$.extend(!0,{recreateFilter:!1,drag:!0,sField:"searchField",sValue:"searchString",sOper:"searchOper",sFilter:"filters",loadDefaults:!0,beforeShowSearch:null,afterShowSearch:null,onInitializeSearch:null,afterRedraw:null,afterChange:null,
sortStrategy:null,closeAfterSearch:!1,closeAfterReset:!1,closeOnEscape:!1,searchOnEnter:!1,multipleSearch:!1,multipleGroup:!1,top:0,left:0,jqModal:!0,modal:!1,resize:!0,width:450,height:"auto",dataheight:"auto",showQuery:!1,errorcheck:!0,sopt:null,stringResult:void 0,onClose:null,onSearch:null,onReset:null,toTop:!0,overlay:30,columns:[],tmplNames:null,tmplFilters:null,tmplLabel:" Template: ",showOnLoad:!1,layer:null,splitSelect:",",groupOpSelect:"OR",operands:{eq:"=",ne:"<>",lt:"<",le:"<=",gt:">",ge:">=",bw:"LIKE",bn:"NOT LIKE",in:"IN",ni:"NOT IN",ew:"LIKE",en:"NOT LIKE",cn:"LIKE",nc:"NOT LIKE",nu:"IS NULL",nn:"ISNOT NULL"},buttons:[]},b,a||{}),this.each(function(){function b(b){f=$(c).triggerHandler("jqGridFilterBeforeShow",[b]),void 0===f&&(f=!0),f&&$.isFunction(a.beforeShowSearch)&&(f=a.beforeShowSearch.call(c,b)),f&&($.jgrid.viewModal("#"+$.jgrid.jqID(h.themodal),{gbox:"#gbox_"+$.jgrid.jqID(c.p.id),jqm:a.jqModal,modal:a.modal,overlay:a.overlay,toTop:a.toTop}),$(c).triggerHandler("jqGridFilterAfterShow",[b]),$.isFunction(a.afterShowSearch)&&a.afterShowSearch.call(c,b))}var c=this;if(c.grid){var d,e="fbox_"+c.p.id,f=!0,g=!0,h={themodal:"searchmod"+e,modalhead:"searchhd"+e,modalcontent:"searchcnt"+e,scrollelm:e},i=$.isPlainObject(c.p_savedFilter)&&!$.isEmptyObject(c.p_savedFilter)?c.p_savedFilter:c.p.postData[a.sFilter],j=$.jgrid.styleUI[c.p.styleUI||"jQueryUI"].filter,k=$.jgrid.styleUI[c.p.styleUI||"jQueryUI"].common;if(a.styleUI=c.p.styleUI,"string"==typeof i&&(i=$.jgrid.parse(i)),!0===a.recreateFilter&&$("#"+$.jgrid.jqID(h.themodal)).remove(),void 0!==$("#"+$.jgrid.jqID(h.themodal))[0])b($("#fbox_"+$.jgrid.jqID(c.p.id)));else{var l=$("<div><div id='"+e+"' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_"+$.jgrid.jqID(c.p.id)),m="left",n="";"rtl"===c.p.direction&&(m="right",n=" style='text-align:left'",l.attr("dir","rtl"));var o,p,q=$.extend([],c.p.colModel),r="<a id='"+e+"_search' class='fm-button "+k.button+" fm-button-icon-right ui-search'><span class='"+k.icon_base+" "+j.icon_search+"'></span>"+a.Find+"</a>",s="<a id='"+e+"_reset' class='fm-button "+k.button+" fm-button-icon-left ui-reset'><span class='"+k.icon_base+" "+j.icon_reset+"'></span>"+a.Reset+"</a>",t="",u="",v=!1,w=-1,x=!1,y=[];a.showQuery&&(t="<a id='"+e+"_query' class='fm-button "+k.button+" fm-button-icon-left'><span class='"+k.icon_base+" "+j.icon_query+"'></span>Query</a>");var z=$.jgrid.buildButtons(a.buttons,t+r,k);if(a.columns.length?(q=a.columns,w=0,o=q[0].index||q[0].name):$.each(q,function(a,b){if(b.label||(b.label=c.p.colNames[a]),!v){var d=void 0===b.search||b.search,e=!0===b.hidden;(b.searchoptions&&!0===b.searchoptions.searchhidden&&d||d&&!e)&&(v=!0,o=b.index||b.name,w=a)}"select"===b.stype&&b.searchoptions&&b.searchoptions.multiple&&(x=!0,y.push(b.index||b.name))}),!i&&o||!1===a.multipleSearch){var A="eq";w>=0&&q[w].searchoptions&&q[w].searchoptions.sopt?A=q[w].searchoptions.sopt[0]:a.sopt&&a.sopt.length&&(A=a.sopt[0]),i={groupOp:"AND",rules:[{field:o,op:A,data:""}]}}v=!1,a.tmplNames&&a.tmplNames.length&&(v=!0,u="<tr><td class='ui-search-label'>"+a.tmplLabel+"</td>",u+="<td><select size='1' class='ui-template "+j.srSelect+"'>",u+="<option value='default'>Default</option>",$.each(a.tmplNames,function(a,b){u+="<option value='"+a+"'>"+b+"</option>"}),u+="</select></td></tr>"),p="<table class='EditTable' style='border:0px none;margin-top:5px' id='"+e+"_2'><tbody><tr><td colspan='2'><hr class='"+k.content+"' style='margin:1px'/></td></tr>"+u+"<tr><td class='EditButton' style='text-align:"+m+"'>"+s+"</td><td class='EditButton' "+n+">"+z+"</td></tr></tbody></table>",e=$.jgrid.jqID(e),$("#"+e).jqFilter({columns:q,sortStrategy:a.sortStrategy,filter:a.loadDefaults?i:null,showQuery:a.showQuery,errorcheck:a.errorcheck,sopt:a.sopt,groupButton:a.multipleGroup,ruleButtons:a.multipleSearch,uniqueSearchFields:a.uniqueSearchFields,afterRedraw:a.afterRedraw,ops:a.odata,operands:a.operands,ajaxSelectOptions:c.p.ajaxSelectOptions,groupOps:a.groupOps,addsubgrup:a.addsubgrup,addrule:a.addrule,delgroup:a.delgroup,delrule:a.delrule,autoencode:c.p.autoencode,onChange:function(){this.p.showQuery&&$(".query",this).html(this.toUserFriendlyString()),$.isFunction(a.afterChange)&&a.afterChange.call(c,$("#"+e),a)},direction:c.p.direction,id:c.p.id}),l.append(p),$("#"+e+"_2").find("[data-index]").each(function(){var b=parseInt($(this).attr("data-index"),10);b>=0&&$(this).on("click",function(d){a.buttons[b].click.call(c,$("#"+e),a,d)})}),v&&a.tmplFilters&&a.tmplFilters.length&&$(".ui-template",l).on("change",function(){var b=$(this).val();return"default"===b?$("#"+e).jqFilter("addFilter",i):$("#"+e).jqFilter("addFilter",a.tmplFilters[parseInt(b,10)]),!1}),!0===a.multipleGroup&&(a.multipleSearch=!0),$(c).triggerHandler("jqGridFilterInitialize",[$("#"+e)]),$.isFunction(a.onInitializeSearch)&&a.onInitializeSearch.call(c,$("#"+e)),a.gbox="#gbox_"+e;var B=$(".ui-jqgrid").css("font-size")||"11px";a.layer?$.jgrid.createModal(h,l,a,"#gview_"+$.jgrid.jqID(c.p.id),$("#gbox_"+$.jgrid.jqID(c.p.id))[0],"string"==typeof a.layer?"#"+$.jgrid.jqID(a.layer):a.layer,"string"==typeof a.layer?{position:"relative","font-size":B}:{"font-size":B}):$.jgrid.createModal(h,l,a,"#gview_"+$.jgrid.jqID(c.p.id),$("#gbox_"+$.jgrid.jqID(c.p.id))[0],null,{"font-size":B}),(a.searchOnEnter||a.closeOnEscape)&&$("#"+$.jgrid.jqID(h.themodal)).keydown(function(b){var c=$(b.target);return!a.searchOnEnter||13!==b.which||c.hasClass("add-group")||c.hasClass("add-rule")||c.hasClass("delete-group")||c.hasClass("delete-rule")||c.hasClass("fm-button")&&c.is("[id$=_query]")?a.closeOnEscape&&27===b.which?($("#"+$.jgrid.jqID(h.modalhead)).find(".ui-jqdialog-titlebar-close").click(),!1):void 0:($("#"+e+"_search").click(),!1)}),t&&$("#"+e+"_query").on("click",function(){return $(".queryresult",l).toggle(),!1}),void 0===a.stringResult&&(a.stringResult=a.multipleSearch),$("#"+e+"_search").on("click",function(){var b,f,i={};if(d=$("#"+e),d.find(".input-elm:focus").change(),x&&a.multipleSearch?(c.p_savedFilter={},f=$.jgrid.filterRefactor({ruleGroup:$.extend(!0,{},d.jqFilter("filterData")),ssfield:y,splitSelect:a.splitSelect,groupOpSelect:a.groupOpSelect}),c.p_savedFilter=$.extend(!0,{},d.jqFilter("filterData"))):f=d.jqFilter("filterData"),a.errorcheck&&(d[0].hideError(),a.showQuery||d.jqFilter("toSQLString"),d[0].p.error))return d[0].showError(),!1;if(a.stringResult){try{b=JSON.stringify(f)}catch(a){}"string"==typeof b&&(i[a.sFilter]=b,$.each([a.sField,a.sValue,a.sOper],function(){i[this]=""}))}else a.multipleSearch?(i[a.sFilter]=f,$.each([a.sField,a.sValue,a.sOper],function(){i[this]=""})):(i[a.sField]=f.rules[0].field,i[a.sValue]=f.rules[0].data,i[a.sOper]=f.rules[0].op,i[a.sFilter]="");return c.p.search=!0,$.extend(c.p.postData,i),g=$(c).triggerHandler("jqGridFilterSearch"),void 0===g&&(g=!0),g&&$.isFunction(a.onSearch)&&(g=a.onSearch.call(c,c.p.filters)),!1!==g&&$(c).trigger("reloadGrid",[{page:1}]),a.closeAfterSearch&&$.jgrid.hideModal("#"+$.jgrid.jqID(h.themodal),{gb:"#gbox_"+$.jgrid.jqID(c.p.id),jqm:a.jqModal,onClose:a.onClose}),!1}),$("#"+e+"_reset").on("click",function(){var b={},d=$("#"+e);return c.p.search=!1,c.p.resetsearch=!0,!1===a.multipleSearch?b[a.sField]=b[a.sValue]=b[a.sOper]="":b[a.sFilter]="",d[0].resetFilter(),v&&$(".ui-template",l).val("default"),$.extend(c.p.postData,b),g=$(c).triggerHandler("jqGridFilterReset"),void 0===g&&(g=!0),g&&$.isFunction(a.onReset)&&(g=a.onReset.call(c)),!1!==g&&$(c).trigger("reloadGrid",[{page:1}]),a.closeAfterReset&&$.jgrid.hideModal("#"+$.jgrid.jqID(h.themodal),{gb:"#gbox_"+$.jgrid.jqID(c.p.id),jqm:a.jqModal,onClose:a.onClose}),!1}),b($("#"+e)),$(".fm-button:not(."+k.disabled+")",l).hover(function(){$(this).addClass(k.hover)},function(){$(this).removeClass(k.hover)})}}})},filterInput:function(a,b){return b=$.extend(!0,{defaultSearch:"cn",groupOp:"OR",searchAll:!1,beforeSearch:null,afterSearch:null},b||{}),this.each(function(){var c=this;if(c.grid){var d,e,f,g='{"groupOp":"'+b.groupOp+'","rules":[',h=0;if(a+="","local"===c.p.datatype){$.each(c.p.colModel,function(){d=this.index||this.name,e=this.searchoptions||{},f=b.defaultSearch?b.defaultSearch:e.sopt?e.sopt[0]:b.defaultSearch,this.search=!1!==this.search,(this.search||b.searchAll)&&(h>0&&(g+=","),g+='{"field":"'+d+'",',g+='"op":"'+f+'",',g+='"data":"'+a.replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"}',h++)}),g+="]}",$.extend(c.p.postData,{filters:g}),$.each(["searchField","searchString","searchOper"],function(a,b){c.p.postData.hasOwnProperty(b)&&delete c.p.postData[b]});var i="stop"===$(c).triggerHandler("jqGridFilterInputBeforeSearch");!i&&$.isFunction(b.beforeSearch)&&(i=b.beforeSearch.call(c)),i||$(c).jqGrid("setGridParam",{search:!0}).trigger("reloadGrid",[{page:1}]),$(c).triggerHandler("jqGridFilterInputAfterSearch"),$.isFunction(b.afterSearch)&&b.afterSearch.call(c)}}})}});var rp_ge={};if($.jgrid.extend({editGridRow:function(a,b){var c=$.jgrid.getRegional(this[0],"edit"),d=this[0].p.styleUI,e=$.jgrid.styleUI[d].formedit,f=$.jgrid.styleUI[d].common;return b=$.extend(!0,{top:0,left:0,width:"500",datawidth:"auto",height:"auto",dataheight:"auto",modal:!1,overlay:30,drag:!0,resize:!0,url:null,mtype:"POST",clearAfterAdd:!0,closeAfterEdit:!1,reloadAfterSubmit:!0,onInitializeForm:null,beforeInitData:null,beforeShowForm:null,afterShowForm:null,beforeSubmit:null,afterSubmit:null,onclickSubmit:null,afterComplete:null,onclickPgButtons:null,afterclickPgButtons:null,editData:{},recreateForm:!1,jqModal:!0,closeOnEscape:!1,addedrow:"first",topinfo:"",bottominfo:"",saveicon:[],closeicon:[],savekey:[!1,13],navkeys:[!1,38,40],checkOnSubmit:!1,checkOnUpdate:!1,processing:!1,onClose:null,ajaxEditOptions:{},serializeEditData:null,viewPagerButtons:!0,overlayClass:f.overlay,removemodal:!0,form:"edit",template:null,focusField:!0,editselected:!1,html5Check:!1,buttons:[]},c,b||{}),rp_ge[$(this)[0].p.id]=b,this.each(function(){function c(){var a,b={};$(y).find(".FormElement").each(function(){var a=$(".customelement",this);if(a.length){var c=a[0],d=$(c).attr("name");$.each(q.p.colModel,function(){if(this.name===d&&this.editoptions&&$.isFunction(this.editoptions.custom_value)){try{if(s[d]=this.editoptions.custom_value.call(q,$("#"+$.jgrid.jqID(d),y),"get"),void 0===s[d])throw"e1"}catch(a){"e1"===a?$.jgrid.info_dialog(E.errcap,"function 'custom_value' "+rp_ge[$(this)[0]].p.msg.novalue,rp_ge[$(this)[0]].p.bClose,{styleUI:rp_ge[$(this)[0]].p.styleUI}):$.jgrid.info_dialog(E.errcap,a.message,rp_ge[$(this)[0]].p.bClose,{styleUI:rp_ge[$(this)[0]].p.styleUI})}return!0}})}else{switch($(this).get(0).type){case"checkbox":if($(this).is(":checked"))s[this.name]=$(this).val();else{var e=$(this).attr("offval");s[this.name]=e}break;case"select-one":s[this.name]=$(this).val();break;case"select-multiple":s[this.name]=$(this).val(),s[this.name]=s[this.name]?s[this.name].join(","):"";break;case"radio":if(b.hasOwnProperty(this.name))return!0;b[this.name]=void 0===$(this).attr("offval")?"off":$(this).attr("offval");break;default:s[this.name]=$(this).val()}q.p.autoencode&&(s[this.name]=$.jgrid.htmlEncode(s[this.name]))}});for(a in b)if(b.hasOwnProperty(a)){var c=$('input[name="'+a+'"]:checked',y).val();s[a]=void 0!==c?c:b[a],q.p.autoencode&&(s[a]=$.jgrid.htmlEncode(s[a]))}return!0}function d(a,b,c,d){var f,g,h,i,j,k,l,m,n=0,o=[],p=!1,r="<td class='CaptionTD'></td><td class='DataTD'></td>",s="";for(l=1;l<=d;l++)s+=r;if("_empty"!==a&&(p=$(b).jqGrid("getInd",a)),$(b.p.colModel).each(function(l){if(f=this.name,g=(!this.editrules||!0!==this.editrules.edithidden)&&!0===this.hidden,j=g?"style='display:none'":"","cb"!==f&&"subgrid"!==f&&!0===this.editable&&"rn"!==f){if(!1===p)i="";else if(f===b.p.ExpandColumn&&!0===b.p.treeGrid)i=$("td[role='gridcell']:eq("+l+")",b.rows[p]).text();else{try{i=$.unformat.call(b,$("td[role='gridcell']:eq("+l+")",b.rows[p]),{rowId:a,colModel:this},l)}catch(a){i=this.edittype&&"textarea"===this.edittype?$("td[role='gridcell']:eq("+l+")",b.rows[p]).text():$("td[role='gridcell']:eq("+l+")",b.rows[p]).html()}(!i||"&nbsp;"===i||"&#160;"===i||1===i.length&&160===i.charCodeAt(0))&&(i="")}var r=$.extend({},this.editoptions||{},{id:f,name:f,rowId:a,oper:"edit"}),t=$.extend({},{elmprefix:"",elmsuffix:"",rowabove:!1,rowcontent:""},this.formoptions||{}),u=parseInt(t.rowpos,10)||n+1,v=parseInt(2*(parseInt(t.colpos,10)||1),10);if("_empty"===a&&r.defaultValue&&(i=$.isFunction(r.defaultValue)?r.defaultValue.call(q):r.defaultValue),this.edittype||(this.edittype="text"),q.p.autoencode&&(i=$.jgrid.htmlDecode(i)),k=$.jgrid.createEl.call(q,this.edittype,r,i,!1,$.extend({},$.jgrid.ajaxOptions,b.p.ajaxSelectOptions||{})),"select"===this.edittype&&(i=$(k).val(),"select-multiple"===$(k).get(0).type&&i&&(i=i.join(","))),"checkbox"===this.edittype&&(i=$(k).is(":checked")?$(k).val():$(k).attr("offval")),$(k).addClass("FormElement"),$.inArray(this.edittype,["text","textarea","password","select","color","date","datetime","datetime-local","email","month","number","range","search","tel","time","url","week"])>-1&&$(k).addClass(e.inputClass),m=!0,D){var x=$(J).find("#"+f);x.length?x.replaceWith(k):m=!1}else{if(h=$(c).find("tr[rowpos="+u+"]"),t.rowabove){var y=$("<tr><td class='contentinfo' colspan='"+2*d+"'>"+t.rowcontent+"</td></tr>");$(c).append(y),y[0].rp=u}0===h.length&&(h=d>1?$("<tr rowpos='"+u+"'></tr>").addClass("FormData").attr("id","tr_"+f):$("<tr "+j+" rowpos='"+u+"'></tr>").addClass("FormData").attr("id","tr_"+f),$(h).append(s),$(c).append(h),h[0].rp=u),$("td:eq("+(v-2)+")",h[0]).html("<label for='"+f+"'>"+(void 0===t.label?b.p.colNames[l]:t.label)+"</label>"),$("td:eq("+(v-1)+")",h[0]).append(t.elmprefix).append(k).append(t.elmsuffix),d>1&&g&&($("td:eq("+(v-2)+")",h[0]).hide(),$("td:eq("+(v-1)+")",h[0]).hide())}(rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate)&&m&&(q.p.savedData[f]=i),"custom"===this.edittype&&$.isFunction(r.custom_value)&&r.custom_value.call(q,$("#"+f,w),"set",i),$.jgrid.bindEv.call(q,k,r),o[n]=l,n++}}),n>0){var t;D?(t="<div class='FormData' style='display:none'><input class='FormElement' id='id_g' type='text' name='"+b.p.id+"_id' value='"+a+"'/>",$(J).append(t)):(t=$("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+(2*d-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='"+b.p.id+"_id' value='"+a+"'/></td></tr>"),t[0].rp=n+999,$(c).append(t)),(rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate)&&(q.p.savedData[b.p.id+"_id"]=a)}return o}function g(a,b,c){var d,e,f,g,h,i,j=0;(rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate)&&(q.p.savedData={},q.p.savedData[b.p.id+"_id"]=a);var k=b.p.colModel;if("_empty"===a)return $(k).each(function(){d=this.name,g=$.extend({},this.editoptions||{}),(f=$("#"+$.jgrid.jqID(d),c))&&f.length&&null!==f[0]&&(h="","custom"===this.edittype&&$.isFunction(g.custom_value)?g.custom_value.call(q,$("#"+d,c),"set",h):g.defaultValue?(h=$.isFunction(g.defaultValue)?g.defaultValue.call(q):g.defaultValue,"checkbox"===f[0].type?(i=h.toLowerCase(),i.search(/(false|f|0|no|n|off|undefined)/i)<0&&""!==i?(f[0].checked=!0,f[0].defaultChecked=!0,f[0].value=h):(f[0].checked=!1,f[0].defaultChecked=!1)):f.val(h)):"checkbox"===f[0].type?(f[0].checked=!1,f[0].defaultChecked=!1,h=$(f).attr("offval")):f[0].type&&"select"===f[0].type.substr(0,6)?f[0].selectedIndex=0:f.val(h),(!0===rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate)&&(q.p.savedData[d]=h))}),void $("#id_g",c).val(a);var l=$(b).jqGrid("getInd",a,!0);l&&($('td[role="gridcell"]',l).each(function(f){if("cb"!==(d=k[f].name)&&"subgrid"!==d&&"rn"!==d&&!0===k[f].editable){if(d===b.p.ExpandColumn&&!0===b.p.treeGrid)e=$(this).text();else try{e=$.unformat.call(b,$(this),{rowId:a,colModel:k[f]},f)}catch(a){e="textarea"===k[f].edittype?$(this).text():$(this).html()}switch(q.p.autoencode&&(e=$.jgrid.htmlDecode(e)),(!0===rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate)&&(q.p.savedData[d]=e),d=$.jgrid.jqID(d),k[f].edittype){case"select":var g=e.split(",");g=$.map(g,function(a){return $.trim(a)}),$("#"+d+" option",c).each(function(){k[f].editoptions.multiple||$.trim(e)!==$.trim($(this).text())&&g[0]!==$.trim($(this).text())&&g[0]!==$.trim($(this).val())?k[f].editoptions.multiple&&($.inArray($.trim($(this).text()),g)>-1||$.inArray($.trim($(this).val()),g)>-1)?this.selected=!0:this.selected=!1:this.selected=!0}),(!0===rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate)&&(e=$("#"+d,c).val(),k[f].editoptions.multiple&&(e=e.join(",")),q.p.savedData[d]=e);break;case"checkbox":if(e=String(e),k[f].editoptions&&k[f].editoptions.value){k[f].editoptions.value.split(":")[0]===e?$("#"+d,c)[q.p.useProp?"prop":"attr"]({checked:!0,defaultChecked:!0}):$("#"+d,c)[q.p.useProp?"prop":"attr"]({checked:!1,defaultChecked:!1})}else e=e.toLowerCase(),e.search(/(false|f|0|no|n|off|undefined)/i)<0&&""!==e?($("#"+d,c)[q.p.useProp?"prop":"attr"]("checked",!0),$("#"+d,c)[q.p.useProp?"prop":"attr"]("defaultChecked",!0)):($("#"+d,c)[q.p.useProp?"prop":"attr"]("checked",!1),$("#"+d,c)[q.p.useProp?"prop":"attr"]("defaultChecked",!1));(!0===rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate)&&(e=$("#"+d,c).is(":checked")?$("#"+d,c).val():$("#"+d,c).attr("offval"),q.p.savedData[d]=e);break;case"custom":try{if(!k[f].editoptions||!$.isFunction(k[f].editoptions.custom_value))throw"e1";k[f].editoptions.custom_value.call(q,$("#"+d,c),"set",e)}catch(a){"e1"===a?$.jgrid.info_dialog(E.errcap,"function 'custom_value' "+rp_ge[$(this)[0]].p.msg.nodefined,$.rp_ge[$(this)[0]].p.bClose,{styleUI:rp_ge[$(this)[0]].p.styleUI}):$.jgrid.info_dialog(E.errcap,a.message,$.rp_ge[$(this)[0]].p.bClose,{styleUI:rp_ge[$(this)[0]].p.styleUI})}break;default:("&nbsp;"===e||"&#160;"===e||1===e.length&&160===e.charCodeAt(0))&&(e=""),$("#"+d,c).val(e)}j++}}),j>0&&($("#id_g",y).val(a),(!0===rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate)&&(q.p.savedData[b.p.id+"_id"]=a)))}function h(){$.each(q.p.colModel,function(a,b){b.editoptions&&!0===b.editoptions.NullIfEmpty&&s.hasOwnProperty(b.name)&&""===s[b.name]&&(s[b.name]="null")})}function i(){var a,c,d,e,i,j,k,l=[!0,"",""],m={},n=q.p.prmNames,o=$(q).triggerHandler("jqGridAddEditBeforeCheckValues",[s,$(w),u]);if(o&&"object"==typeof o&&(s=o),$.isFunction(rp_ge[q.p.id].beforeCheckValues)&&(o=rp_ge[q.p.id].beforeCheckValues.call(q,s,$(w),u))&&"object"==typeof o&&(s=o),rp_ge[q.p.id].html5Check&&!$.jgrid.validateForm(J[0]))return!1;for(e in s)if(s.hasOwnProperty(e)&&(l=$.jgrid.checkValues.call(q,s[e],e),!1===l[0]))break;if(h(),l[0]&&(m=$(q).triggerHandler("jqGridAddEditClickSubmit",[rp_ge[q.p.id],s,u]),void 0===m&&$.isFunction(rp_ge[q.p.id].onclickSubmit)&&(m=rp_ge[q.p.id].onclickSubmit.call(q,rp_ge[q.p.id],s,u)||{}),l=$(q).triggerHandler("jqGridAddEditBeforeSubmit",[s,$(w),u]),void 0===l&&(l=[!0,"",""]),l[0]&&$.isFunction(rp_ge[q.p.id].beforeSubmit)&&(l=rp_ge[q.p.id].beforeSubmit.call(q,s,$(w),u))),l[0]&&!rp_ge[q.p.id].processing){if(rp_ge[q.p.id].processing=!0,$("#sData",y+"_2").addClass(f.active),k=rp_ge[q.p.id].url||$(q).jqGrid("getGridParam","editurl"),d=n.oper,c="clientArray"===k?q.p.keyName:n.id,s[d]="_empty"===$.trim(s[q.p.id+"_id"])?n.addoper:n.editoper,s[d]!==n.addoper?s[c]=s[q.p.id+"_id"]:void 0===s[c]&&(s[c]=s[q.p.id+"_id"]),delete s[q.p.id+"_id"],s=$.extend(s,rp_ge[q.p.id].editData,m),!0===q.p.treeGrid){if(s[d]===n.addoper){i=$(q).jqGrid("getGridParam","selrow");var p="adjacency"===q.p.treeGridModel?q.p.treeReader.parent_id_field:"parent_id";s[p]=i}for(j in q.p.treeReader)if(q.p.treeReader.hasOwnProperty(j)){var r=q.p.treeReader[j];if(s.hasOwnProperty(r)){if(s[d]===n.addoper&&"parent_id_field"===j)continue;delete s[r]}}}s[c]=$.jgrid.stripPref(q.p.idPrefix,s[c]);var t=$.extend({url:k,type:rp_ge[q.p.id].mtype,data:$.isFunction(rp_ge[q.p.id].serializeEditData)?rp_ge[q.p.id].serializeEditData.call(q,s):s,complete:function(e,h){var j;if($("#sData",y+"_2").removeClass(f.active),s[c]=q.p.idPrefix+s[c],e.status>=300&&304!==e.status?(l[0]=!1,l[1]=$(q).triggerHandler("jqGridAddEditErrorTextFormat",[e,u]),$.isFunction(rp_ge[q.p.id].errorTextFormat)?l[1]=rp_ge[q.p.id].errorTextFormat.call(q,e,u):l[1]=h+" Status: '"+e.statusText+"'. Error code: "+e.status):(l=$(q).triggerHandler("jqGridAddEditAfterSubmit",[e,s,u]),void 0===l&&(l=[!0,"",""]),l[0]&&$.isFunction(rp_ge[q.p.id].afterSubmit)&&(l=rp_ge[q.p.id].afterSubmit.call(q,e,s,u))),!1===l[0])$(".FormError",w).html(l[1]),$(".FormError",w).show();else if(q.p.autoencode&&$.each(s,function(a,b){s[a]=$.jgrid.htmlDecode(b)}),s[d]===n.addoper?(l[2]||(l[2]=$.jgrid.randId()),null==s[c]||s[c]===q.p.idPrefix+"_empty"||""===s[c]?s[c]=l[2]:l[2]=s[c],rp_ge[q.p.id].reloadAfterSubmit?$(q).trigger("reloadGrid"):!0===q.p.treeGrid?$(q).jqGrid("addChildNode",l[2],i,s):$(q).jqGrid("addRowData",l[2],s,b.addedrow),rp_ge[q.p.id].closeAfterAdd?(!0!==q.p.treeGrid&&$(q).jqGrid("setSelection",l[2]),$.jgrid.hideModal("#"+$.jgrid.jqID(z.themodal),{gb:"#gbox_"+$.jgrid.jqID(v),jqm:b.jqModal,onClose:rp_ge[q.p.id].onClose,removemodal:rp_ge[q.p.id].removemodal,formprop:!rp_ge[q.p.id].recreateForm,form:rp_ge[q.p.id].form})):rp_ge[q.p.id].clearAfterAdd&&g("_empty",q,w)):(rp_ge[q.p.id].reloadAfterSubmit?($(q).trigger("reloadGrid"),rp_ge[q.p.id].closeAfterEdit||setTimeout(function(){$(q).jqGrid("setSelection",s[c])},1e3)):!0===q.p.treeGrid?$(q).jqGrid("setTreeRow",s[c],s):$(q).jqGrid("setRowData",s[c],s),rp_ge[q.p.id].closeAfterEdit&&$.jgrid.hideModal("#"+$.jgrid.jqID(z.themodal),{gb:"#gbox_"+$.jgrid.jqID(v),jqm:b.jqModal,onClose:rp_ge[q.p.id].onClose,removemodal:rp_ge[q.p.id].removemodal,formprop:!rp_ge[q.p.id].recreateForm,form:rp_ge[q.p.id].form})),($.isFunction(rp_ge[q.p.id].afterComplete)||$._data($(q)[0],"events").hasOwnProperty("jqGridAddEditAfterComplete"))&&(a=e,setTimeout(function(){$(q).triggerHandler("jqGridAddEditAfterComplete",[a,s,$(w),u]);try{rp_ge[q.p.id].afterComplete.call(q,a,s,$(w),u)}catch(a){}a=null},500)),(rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate)&&($(w).data("disabled",!1),"_empty"!==q.p.savedData[q.p.id+"_id"]))for(j in q.p.savedData)q.p.savedData.hasOwnProperty(j)&&s[j]&&(q.p.savedData[j]=s[j]);rp_ge[q.p.id].processing=!1;try{$(":input:visible",w)[0].focus()}catch(a){}}},$.jgrid.ajaxOptions,rp_ge[q.p.id].ajaxEditOptions);if(t.url||rp_ge[q.p.id].useDataProxy||($.isFunction(q.p.dataProxy)?rp_ge[q.p.id].useDataProxy=!0:(l[0]=!1,l[1]+=" "+E.nourl)),l[0])if(rp_ge[q.p.id].useDataProxy){var x=q.p.dataProxy.call(q,t,"set_"+q.p.id);void 0===x&&(x=[!0,""]),!1===x[0]?(l[0]=!1,l[1]=x[1]||"Error deleting the selected row!"):(t.data.oper===n.addoper&&rp_ge[q.p.id].closeAfterAdd&&$.jgrid.hideModal("#"+$.jgrid.jqID(z.themodal),{gb:"#gbox_"+$.jgrid.jqID(v),jqm:b.jqModal,onClose:rp_ge[q.p.id].onClose,removemodal:rp_ge[q.p.id].removemodal,formprop:!rp_ge[q.p.id].recreateForm,form:rp_ge[q.p.id].form}),t.data.oper===n.editoper&&rp_ge[q.p.id].closeAfterEdit&&$.jgrid.hideModal("#"+$.jgrid.jqID(z.themodal),{gb:"#gbox_"+$.jgrid.jqID(v),jqm:b.jqModal,onClose:rp_ge[q.p.id].onClose,removemodal:rp_ge[q.p.id].removemodal,formprop:!rp_ge[q.p.id].recreateForm,form:rp_ge[q.p.id].form}))}else"clientArray"===t.url?(rp_ge[q.p.id].reloadAfterSubmit=!1,s=t.data,t.complete({status:200,statusText:""},"")):$.ajax(t)}!1===l[0]&&($(".FormError",w).html(l[1]),$(".FormError",w).show())}function j(a,b){var c,d=!1;if(!(d=!($.isPlainObject(a)&&$.isPlainObject(b)&&Object.getOwnPropertyNames(a).length===Object.getOwnPropertyNames(b).length)))for(c in b)if(b.hasOwnProperty(c)){if(!a.hasOwnProperty(c)){d=!0;break}if(a[c]!==b[c]){d=!0;break}}return d}function k(){var a=!0;return $(".FormError",w).hide(),rp_ge[q.p.id].checkOnUpdate&&(s={},c(),(t=j(s,q.p.savedData))&&($(w).data("disabled",!0),$(".confirm","#"+z.themodal).show(),a=!1)),a}function l(){var b;if("_empty"!==a&&void 0!==q.p.savedRow&&q.p.savedRow.length>0&&$.isFunction($.fn.jqGrid.restoreRow))for(b=0;b<q.p.savedRow.length;b++)if(q.p.savedRow[b].id===a){$(q).jqGrid("restoreRow",a);break}}function m(a,b){var c=b[1].length-1;0===a?$("#pData",r).addClass(f.disabled):void 0!==b[1][a-1]&&$("#"+$.jgrid.jqID(b[1][a-1])).hasClass(f.disabled)?$("#pData",r).addClass(f.disabled):$("#pData",r).removeClass(f.disabled),a===c?$("#nData",r).addClass(f.disabled):void 0!==b[1][a+1]&&$("#"+$.jgrid.jqID(b[1][a+1])).hasClass(f.disabled)?$("#nData",r).addClass(f.disabled):$("#nData",r).removeClass(f.disabled)}function n(){var a,b=$(q).jqGrid("getDataIDs"),c=$("#id_g",y).val();if(q.p.multiselect&&rp_ge[q.p.id].editselected){for(var d=[],e=0,f=b.length;e<f;e++)-1!==$.inArray(b[e],q.p.selarrrow)&&d.push(b[e]);return a=$.inArray(c,d),[a,d]}return a=$.inArray(c,b),[a,b]}function o(a){var b="";return"string"==typeof a&&(b=a.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,function(a,b){return'<span id="'+b+'" ></span>'})),b}function p(){if(rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate){var a=[],b={};a=$.map(q.p.savedData,function(a,b){return b}),$(".FormElement",J).each(function(){if(-1===a.indexOf(this.name)){var c=$(this).val(),d=$(this).get(0).type;if("checkbox"===d)$(this).is(":checked")||(c=$(this).attr("offval"));else if("select-multiple"===d)c=c.join(",");else if("radio"===d){if(b.hasOwnProperty(this.name))return!0;b[this.name]=void 0===$(this).attr("offval")?"off":$(this).attr("offval")}q.p.savedData[this.name]=c}});for(var c in b)if(b.hasOwnProperty(c)){var d=$('input[name="'+c+'"]:checked',J).val();q.p.savedData[c]=void 0!==d?d:b[c]}}}var q=this;if(q.grid&&a){q.p.savedData={};var r,s,t,u,v=q.p.id,w="FrmGrid_"+v,x="TblGrid_"+v,y="#"+$.jgrid.jqID(x),z={themodal:"editmod"+v,modalhead:"edithd"+v,modalcontent:"editcnt"+v,scrollelm:w},A=!0,B=1,C=0,D="string"==typeof rp_ge[q.p.id].template&&rp_ge[q.p.id].template.length>0,E=$.jgrid.getRegional(this,"errors");rp_ge[q.p.id].styleUI=q.p.styleUI||"jQueryUI",$.jgrid.isMobile()&&(rp_ge[q.p.id].resize=!1),"new"===a?(a="_empty",u="add",b.caption=rp_ge[q.p.id].addCaption):(b.caption=rp_ge[q.p.id].editCaption,u="edit"),b.recreateForm||$(q).data("formProp")&&$.extend(rp_ge[$(this)[0].p.id],$(q).data("formProp"));var F=!0;b.checkOnUpdate&&b.jqModal&&!b.modal&&(F=!1);var G,H=isNaN(rp_ge[$(this)[0].p.id].dataheight)?rp_ge[$(this)[0].p.id].dataheight:rp_ge[$(this)[0].p.id].dataheight+"px",I=isNaN(rp_ge[$(this)[0].p.id].datawidth)?rp_ge[$(this)[0].p.id].datawidth:rp_ge[$(this)[0].p.id].datawidth+"px",J=$("<form name='FormPost' id='"+w+"' class='FormGrid' onSubmit='return false;' style='width:"+I+";height:"+H+";'></form>").data("disabled",!1);if(D?(G=o(rp_ge[$(this)[0].p.id].template),r=y):(G=$("<table id='"+x+"' class='EditTable ui-common-table'><tbody></tbody></table>"),r=y+"_2"),w="#"+$.jgrid.jqID(w),$(J).append("<div class='FormError "+f.error+"' style='display:none;'></div>"),$(J).append("<div class='tinfo topinfo'>"+rp_ge[q.p.id].topinfo+"</div>"),$(q.p.colModel).each(function(){var a=this.formoptions;B=Math.max(B,a?a.colpos||0:0),C=Math.max(C,a?a.rowpos||0:0)}),$(J).append(G),A=$(q).triggerHandler("jqGridAddEditBeforeInitData",[J,u]),void 0===A&&(A=!0),A&&$.isFunction(rp_ge[q.p.id].beforeInitData)&&(A=rp_ge[q.p.id].beforeInitData.call(q,J,u)),!1!==A){l(),d(a,q,G,B);var K="rtl"===q.p.direction,L=K?"nData":"pData",M=K?"pData":"nData",N="<a id='"+L+"' class='fm-button "+f.button+"'><span class='"+f.icon_base+" "+e.icon_prev+"'></span></a>",O="<a id='"+M+"' class='fm-button "+f.button+"'><span class='"+f.icon_base+" "+e.icon_next+"'></span></a>",P="<a id='sData' class='fm-button "+f.button+"'>"+b.bSubmit+"</a>",Q="<a id='cData' class='fm-button "+f.button+"'>"+b.bCancel+"</a>",R=$.isArray(rp_ge[q.p.id].buttons)?$.jgrid.buildButtons(rp_ge[q.p.id].buttons,P+Q,f):P+Q,S="<table style='height:auto' class='EditTable ui-common-table' id='"+x+"_2'><tbody><tr><td colspan='2'><hr class='"+f.content+"' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>"+(K?O+N:N+O)+"</td><td class='EditButton'>"+R+"</td></tr>";if(S+="</tbody></table>",C>0){var T=[];$.each($(G)[0].rows,function(a,b){T[a]=b}),T.sort(function(a,b){return a.rp>b.rp?1:a.rp<b.rp?-1:0}),$.each(T,function(a,b){$("tbody",G).append(b)})}b.gbox="#gbox_"+$.jgrid.jqID(v);var U=!1;!0===b.closeOnEscape&&(b.closeOnEscape=!1,U=!0);var V;D?($(J).find("#pData").replaceWith(N),$(J).find("#nData").replaceWith(O),$(J).find("#sData").replaceWith(P),$(J).find("#cData").replaceWith(Q),V=$("<div id="+x+"></div>").append(J)):V=$("<div></div>").append(J).append(S),$(J).append("<div class='binfo topinfo bottominfo'>"+rp_ge[q.p.id].bottominfo+"</div>");var W=$(".ui-jqgrid").css("font-size")||"11px";if($.jgrid.createModal(z,V,rp_ge[$(this)[0].p.id],"#gview_"+$.jgrid.jqID(q.p.id),$("#gbox_"+$.jgrid.jqID(q.p.id))[0],null,{"font-size":W}),K&&($("#pData, #nData",y+"_2").css("float","right"),$(".EditButton",y+"_2").css("text-align","left")),rp_ge[q.p.id].topinfo&&$(".tinfo",w).show(),rp_ge[q.p.id].bottominfo&&$(".binfo",w).show(),V=null,S=null,$("#"+$.jgrid.jqID(z.themodal)).keydown(function(a){var c=a.target;if(!0===$(w).data("disabled"))return!1;if(!0===rp_ge[q.p.id].savekey[0]&&a.which===rp_ge[q.p.id].savekey[1]&&"TEXTAREA"!==c.tagName)return $("#sData",y+"_2").trigger("click"),!1;if(27===a.which)return!!k()&&(U&&$.jgrid.hideModal("#"+$.jgrid.jqID(z.themodal),{gb:b.gbox,jqm:b.jqModal,onClose:rp_ge[q.p.id].onClose,removemodal:rp_ge[q.p.id].removemodal,formprop:!rp_ge[q.p.id].recreateForm,form:rp_ge[q.p.id].form}),!1);if(!0===rp_ge[q.p.id].navkeys[0]){if("_empty"===$("#id_g",y).val())return!0;if(a.which===rp_ge[q.p.id].navkeys[1])return $("#pData",r).trigger("click"),!1;if(a.which===rp_ge[q.p.id].navkeys[2])return $("#nData",r).trigger("click"),!1}}),b.checkOnUpdate&&($("a.ui-jqdialog-titlebar-close span","#"+$.jgrid.jqID(z.themodal)).removeClass("jqmClose"),$("a.ui-jqdialog-titlebar-close","#"+$.jgrid.jqID(z.themodal)).off("click").click(function(){return!!k()&&($.jgrid.hideModal("#"+$.jgrid.jqID(z.themodal),{gb:"#gbox_"+$.jgrid.jqID(v),jqm:b.jqModal,onClose:rp_ge[q.p.id].onClose,removemodal:rp_ge[q.p.id].removemodal,formprop:!rp_ge[q.p.id].recreateForm,form:rp_ge[q.p.id].form}),!1)})),b.saveicon=$.extend([!0,"left",e.icon_save],b.saveicon),b.closeicon=$.extend([!0,"left",e.icon_close],b.closeicon),!0===b.saveicon[0]&&$("#sData",r).addClass("right"===b.saveicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='"+f.icon_base+" "+b.saveicon[2]+"'></span>"),!0===b.closeicon[0]&&$("#cData",r).addClass("right"===b.closeicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='"+f.icon_base+" "+b.closeicon[2]+"'></span>"),rp_ge[q.p.id].checkOnSubmit||rp_ge[q.p.id].checkOnUpdate){P="<a id='sNew' class='fm-button "+f.button+"' style='z-index:1002'>"+b.bYes+"</a>",O="<a id='nNew' class='fm-button "+f.button+"' style='z-index:1002;margin-left:5px'>"+b.bNo+"</a>",Q="<a id='cNew' class='fm-button "+f.button+"' style='z-index:1002;margin-left:5px;'>"+b.bExit+"</a>";var X=b.zIndex||999;X++,$("#"+z.themodal).append("<div class='"+b.overlayClass+" jqgrid-overlay confirm' style='z-index:"+X+";display:none;position:absolute;'>&#160;</div><div class='confirm ui-jqconfirm "+f.content+"' style='z-index:"+(X+1)+"'>"+b.saveData+"<br/><br/>"+P+O+Q+"</div>"),$("#sNew","#"+$.jgrid.jqID(z.themodal)).click(function(){return i(),$(w).data("disabled",!1),$(".confirm","#"+$.jgrid.jqID(z.themodal)).hide(),!1}),$("#nNew","#"+$.jgrid.jqID(z.themodal)).click(function(){return $(".confirm","#"+$.jgrid.jqID(z.themodal)).hide(),$(w).data("disabled",!1),setTimeout(function(){$(":input:visible",w)[0].focus()},0),!1}),$("#cNew","#"+$.jgrid.jqID(z.themodal)).click(function(){return $(".confirm","#"+$.jgrid.jqID(z.themodal)).hide(),$(w).data("disabled",!1),$.jgrid.hideModal("#"+$.jgrid.jqID(z.themodal),{gb:"#gbox_"+$.jgrid.jqID(v),jqm:b.jqModal,onClose:rp_ge[q.p.id].onClose,removemodal:rp_ge[q.p.id].removemodal,formprop:!rp_ge[q.p.id].recreateForm,form:rp_ge[q.p.id].form}),!1})}$(q).triggerHandler("jqGridAddEditInitializeForm",[$(w),u]),
$.isFunction(rp_ge[q.p.id].onInitializeForm)&&rp_ge[q.p.id].onInitializeForm.call(q,$(w),u),"_empty"!==a&&rp_ge[q.p.id].viewPagerButtons?$("#pData,#nData",r).show():$("#pData,#nData",r).hide(),$(q).triggerHandler("jqGridAddEditBeforeShowForm",[$(w),u]),$.isFunction(rp_ge[q.p.id].beforeShowForm)&&rp_ge[q.p.id].beforeShowForm.call(q,$(w),u),p(),$("#"+$.jgrid.jqID(z.themodal)).data("onClose",rp_ge[q.p.id].onClose),$.jgrid.viewModal("#"+$.jgrid.jqID(z.themodal),{gbox:"#gbox_"+$.jgrid.jqID(v),jqm:b.jqModal,overlay:b.overlay,modal:b.modal,overlayClass:b.overlayClass,focusField:b.focusField,onHide:function(a){var b=$("#editmod"+v)[0].style.height,c=$("#editmod"+v)[0].style.width;b.indexOf("px")>-1&&(b=parseFloat(b)),c.indexOf("px")>-1&&(c=parseFloat(c)),$(q).data("formProp",{top:parseFloat($(a.w).css("top")),left:parseFloat($(a.w).css("left")),width:c,height:b,dataheight:$(w).height(),datawidth:$(w).width()}),a.w.remove(),a.o&&a.o.remove()}}),F||$("."+$.jgrid.jqID(b.overlayClass)).click(function(){return!!k()&&($.jgrid.hideModal("#"+$.jgrid.jqID(z.themodal),{gb:"#gbox_"+$.jgrid.jqID(v),jqm:b.jqModal,onClose:rp_ge[q.p.id].onClose,removemodal:rp_ge[q.p.id].removemodal,formprop:!rp_ge[q.p.id].recreateForm,form:rp_ge[q.p.id].form}),!1)}),$(".fm-button","#"+$.jgrid.jqID(z.themodal)).hover(function(){$(this).addClass(f.hover)},function(){$(this).removeClass(f.hover)}),$("#sData",r).click(function(){return s={},$(".FormError",w).hide(),c(),"_empty"===s[q.p.id+"_id"]?i():!0===b.checkOnSubmit?(t=j(s,q.p.savedData),t?($(w).data("disabled",!0),$(".confirm","#"+$.jgrid.jqID(z.themodal)).show()):i()):i(),!1}),$("#cData",r).click(function(){return!!k()&&($.jgrid.hideModal("#"+$.jgrid.jqID(z.themodal),{gb:"#gbox_"+$.jgrid.jqID(v),jqm:b.jqModal,onClose:rp_ge[q.p.id].onClose,removemodal:rp_ge[q.p.id].removemodal,formprop:!rp_ge[q.p.id].recreateForm,form:rp_ge[q.p.id].form}),!1)}),$(r).find("[data-index]").each(function(){var a=parseInt($(this).attr("data-index"),10);a>=0&&b.buttons[a].hasOwnProperty("click")&&$(this).on("click",function(c){b.buttons[a].click.call(q,$(w)[0],rp_ge[q.p.id],c)})}),$("#nData",r).click(function(){if(!k())return!1;$(".FormError",w).hide();var a=n();if(a[0]=parseInt(a[0],10),-1!==a[0]&&a[1][a[0]+1]){$(q).triggerHandler("jqGridAddEditClickPgButtons",["next",$(w),a[1][a[0]]]);var c;if($.isFunction(b.onclickPgButtons)&&void 0!==(c=b.onclickPgButtons.call(q,"next",$(w),a[1][a[0]]))&&!1===c)return!1;if($("#"+$.jgrid.jqID(a[1][a[0]+1])).hasClass(f.disabled))return!1;g(a[1][a[0]+1],q,w),q.p.multiselect&&rp_ge[q.p.id].editselected||$(q).jqGrid("setSelection",a[1][a[0]+1]),$(q).triggerHandler("jqGridAddEditAfterClickPgButtons",["next",$(w),a[1][a[0]]]),$.isFunction(b.afterclickPgButtons)&&b.afterclickPgButtons.call(q,"next",$(w),a[1][a[0]+1]),p(),m(a[0]+1,a)}return!1}),$("#pData",r).click(function(){if(!k())return!1;$(".FormError",w).hide();var a=n();if(-1!==a[0]&&a[1][a[0]-1]){$(q).triggerHandler("jqGridAddEditClickPgButtons",["prev",$(w),a[1][a[0]]]);var c;if($.isFunction(b.onclickPgButtons)&&void 0!==(c=b.onclickPgButtons.call(q,"prev",$(w),a[1][a[0]]))&&!1===c)return!1;if($("#"+$.jgrid.jqID(a[1][a[0]-1])).hasClass(f.disabled))return!1;g(a[1][a[0]-1],q,w),q.p.multiselect&&rp_ge[q.p.id].editselected||$(q).jqGrid("setSelection",a[1][a[0]-1]),$(q).triggerHandler("jqGridAddEditAfterClickPgButtons",["prev",$(w),a[1][a[0]]]),$.isFunction(b.afterclickPgButtons)&&b.afterclickPgButtons.call(q,"prev",$(w),a[1][a[0]-1]),p(),m(a[0]-1,a)}return!1}),$(q).triggerHandler("jqGridAddEditAfterShowForm",[$(w),u]),$.isFunction(rp_ge[q.p.id].afterShowForm)&&rp_ge[q.p.id].afterShowForm.call(q,$(w),u);var Y=n();m(Y[0],Y)}}})},viewGridRow:function(a,b){var c=$.jgrid.getRegional(this[0],"view"),d=this[0].p.styleUI,e=$.jgrid.styleUI[d].formedit,f=$.jgrid.styleUI[d].common;return b=$.extend(!0,{top:0,left:0,width:500,datawidth:"auto",height:"auto",dataheight:"auto",modal:!1,overlay:30,drag:!0,resize:!0,jqModal:!0,closeOnEscape:!1,labelswidth:"auto",closeicon:[],navkeys:[!1,38,40],onClose:null,beforeShowForm:null,beforeInitData:null,viewPagerButtons:!0,recreateForm:!1,removemodal:!0,form:"view",buttons:[]},c,b||{}),rp_ge[$(this)[0].p.id]=b,this.each(function(){function c(){!0!==rp_ge[j.p.id].closeOnEscape&&!0!==rp_ge[j.p.id].navkeys[0]||setTimeout(function(){$(".ui-jqdialog-titlebar-close","#"+$.jgrid.jqID(p.modalhead)).attr("tabindex","-1").focus()},0)}function d(a,c,d,e){var g,h,i,j,k,l,m,n,o,p=0,q=[],r=!1,s="<td class='CaptionTD form-view-label "+f.content+"' width='"+b.labelswidth+"'></td><td class='DataTD form-view-data ui-helper-reset "+f.content+"'></td>",t="",u="<td class='CaptionTD form-view-label "+f.content+"'></td><td class='DataTD form-view-data "+f.content+"'></td>",v=["integer","number","currency"],w=0,x=0;for(l=1;l<=e;l++)t+=1===l?s:u;if($(c.p.colModel).each(function(){(h=(!this.editrules||!0!==this.editrules.edithidden)&&!0===this.hidden)||"right"!==this.align||(this.formatter&&-1!==$.inArray(this.formatter,v)?w=Math.max(w,parseInt(this.width,10)):x=Math.max(x,parseInt(this.width,10)))}),m=0!==w?w:0!==x?x:0,r=$(c).jqGrid("getInd",a),$(c.p.colModel).each(function(a){if(g=this.name,n=!1,h=(!this.editrules||!0!==this.editrules.edithidden)&&!0===this.hidden,k=h?"style='display:none'":"",o="boolean"!=typeof this.viewable||this.viewable,"cb"!==g&&"subgrid"!==g&&"rn"!==g&&o){j=!1===r?"":g===c.p.ExpandColumn&&!0===c.p.treeGrid?$("td:eq("+a+")",c.rows[r]).text():$("td:eq("+a+")",c.rows[r]).html(),n="right"===this.align&&0!==m;var b=$.extend({},{rowabove:!1,rowcontent:""},this.formoptions||{}),f=parseInt(b.rowpos,10)||p+1,l=parseInt(2*(parseInt(b.colpos,10)||1),10);if(b.rowabove){var s=$("<tr><td class='contentinfo' colspan='"+2*e+"'>"+b.rowcontent+"</td></tr>");$(d).append(s),s[0].rp=f}i=$(d).find("tr[rowpos="+f+"]"),0===i.length&&(i=$("<tr "+k+" rowpos='"+f+"'></tr>").addClass("FormData").attr("id","trv_"+g),$(i).append(t),$(d).append(i),i[0].rp=f),$("td:eq("+(l-2)+")",i[0]).html("<b>"+(void 0===b.label?c.p.colNames[a]:b.label)+"</b>"),$("td:eq("+(l-1)+")",i[0]).append("<span>"+j+"</span>").attr("id","v_"+g),n&&$("td:eq("+(l-1)+") span",i[0]).css({"text-align":"right",width:m+"px"}),q[p]=a,p++}}),p>0){var y=$("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+(2*e-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='"+a+"'/></td></tr>");y[0].rp=p+99,$(d).append(y)}return q}function g(a,b){var c,d,e,f,g=0;(f=$(b).jqGrid("getInd",a,!0))&&($("td",f).each(function(a){c=b.p.colModel[a].name,d=(!b.p.colModel[a].editrules||!0!==b.p.colModel[a].editrules.edithidden)&&!0===b.p.colModel[a].hidden,"cb"!==c&&"subgrid"!==c&&"rn"!==c&&(e=c===b.p.ExpandColumn&&!0===b.p.treeGrid?$(this).text():$(this).html(),c=$.jgrid.jqID("v_"+c),$("#"+c+" span","#"+m).html(e),d&&$("#"+c,"#"+m).parents("tr:first").hide(),g++)}),g>0&&$("#id_g","#"+m).val(a))}function h(a,b){var c=b[1].length-1;0===a?$("#pData","#"+m+"_2").addClass(f.disabled):void 0!==b[1][a-1]&&$("#"+$.jgrid.jqID(b[1][a-1])).hasClass(f.disabled)?$("#pData",m+"_2").addClass(f.disabled):$("#pData","#"+m+"_2").removeClass(f.disabled),a===c?$("#nData","#"+m+"_2").addClass(f.disabled):void 0!==b[1][a+1]&&$("#"+$.jgrid.jqID(b[1][a+1])).hasClass(f.disabled)?$("#nData",m+"_2").addClass(f.disabled):$("#nData","#"+m+"_2").removeClass(f.disabled)}function i(){var a=$(j).jqGrid("getDataIDs"),b=$("#id_g","#"+m).val();return[$.inArray(b,a),a]}var j=this;if(j.grid&&a){var k=j.p.id,l="ViewGrid_"+$.jgrid.jqID(k),m="ViewTbl_"+$.jgrid.jqID(k),n="ViewGrid_"+k,o="ViewTbl_"+k,p={themodal:"viewmod"+k,modalhead:"viewhd"+k,modalcontent:"viewcnt"+k,scrollelm:l},q=!0,r=1,s=0;rp_ge[j.p.id].styleUI=j.p.styleUI||"jQueryUI",b.recreateForm||$(j).data("viewProp")&&$.extend(rp_ge[$(this)[0].p.id],$(j).data("viewProp"));var t=isNaN(rp_ge[$(this)[0].p.id].dataheight)?rp_ge[$(this)[0].p.id].dataheight:rp_ge[$(this)[0].p.id].dataheight+"px",u=isNaN(rp_ge[$(this)[0].p.id].datawidth)?rp_ge[$(this)[0].p.id].datawidth:rp_ge[$(this)[0].p.id].datawidth+"px",v=$("<form name='FormPost' id='"+n+"' class='FormGrid' style='width:"+u+";height:"+t+";'></form>"),w=$("<table id='"+o+"' class='EditTable ViewTable'><tbody></tbody></table>");if($(j.p.colModel).each(function(){var a=this.formoptions;r=Math.max(r,a?a.colpos||0:0),s=Math.max(s,a?a.rowpos||0:0)}),$(v).append(w),q=$(j).triggerHandler("jqGridViewRowBeforeInitData",[v]),void 0===q&&(q=!0),q&&$.isFunction(rp_ge[j.p.id].beforeInitData)&&(q=rp_ge[j.p.id].beforeInitData.call(j,v)),!1!==q){d(a,j,w,r);var x="rtl"===j.p.direction,y=x?"nData":"pData",z=x?"pData":"nData",A="<a id='"+y+"' class='fm-button "+f.button+"'><span class='"+f.icon_base+" "+e.icon_prev+"'></span></a>",B="<a id='"+z+"' class='fm-button "+f.button+"'><span class='"+f.icon_base+" "+e.icon_next+"'></span></a>",C="<a id='cData' class='fm-button "+f.button+"'>"+b.bClose+"</a>",D=$.isArray(rp_ge[j.p.id].buttons)?$.jgrid.buildButtons(rp_ge[j.p.id].buttons,C,f):C;if(s>0){var E=[];$.each($(w)[0].rows,function(a,b){E[a]=b}),E.sort(function(a,b){return a.rp>b.rp?1:a.rp<b.rp?-1:0}),$.each(E,function(a,b){$("tbody",w).append(b)})}b.gbox="#gbox_"+$.jgrid.jqID(k);var F=$("<div></div>").append(v).append("<table border='0' class='EditTable' id='"+m+"_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='"+b.labelswidth+"'>"+(x?B+A:A+B)+"</td><td class='EditButton'>"+D+"</td></tr></tbody></table>"),G=$(".ui-jqgrid").css("font-size")||"11px";$.jgrid.createModal(p,F,rp_ge[$(this)[0].p.id],"#gview_"+$.jgrid.jqID(j.p.id),$("#gview_"+$.jgrid.jqID(j.p.id))[0],null,{"font-size":G}),x&&($("#pData, #nData","#"+m+"_2").css("float","right"),$(".EditButton","#"+m+"_2").css("text-align","left")),b.viewPagerButtons||$("#pData, #nData","#"+m+"_2").hide(),F=null,$("#"+p.themodal).keydown(function(a){if(27===a.which)return rp_ge[j.p.id].closeOnEscape&&$.jgrid.hideModal("#"+$.jgrid.jqID(p.themodal),{gb:b.gbox,jqm:b.jqModal,onClose:b.onClose,removemodal:rp_ge[j.p.id].removemodal,formprop:!rp_ge[j.p.id].recreateForm,form:rp_ge[j.p.id].form}),!1;if(!0===b.navkeys[0]){if(a.which===b.navkeys[1])return $("#pData","#"+m+"_2").trigger("click"),!1;if(a.which===b.navkeys[2])return $("#nData","#"+m+"_2").trigger("click"),!1}}),b.closeicon=$.extend([!0,"left",e.icon_close],b.closeicon),!0===b.closeicon[0]&&$("#cData","#"+m+"_2").addClass("right"===b.closeicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='"+f.icon_base+" "+b.closeicon[2]+"'></span>"),$(j).triggerHandler("jqGridViewRowBeforeShowForm",[$("#"+l)]),$.isFunction(b.beforeShowForm)&&b.beforeShowForm.call(j,$("#"+l)),$.jgrid.viewModal("#"+$.jgrid.jqID(p.themodal),{gbox:"#gbox_"+$.jgrid.jqID(k),jqm:b.jqModal,overlay:b.overlay,modal:b.modal,onHide:function(a){$(j).data("viewProp",{top:parseFloat($(a.w).css("top")),left:parseFloat($(a.w).css("left")),width:$(a.w).width(),height:$(a.w).height(),dataheight:$("#"+l).height(),datawidth:$("#"+l).width()}),a.w.remove(),a.o&&a.o.remove()}}),$(".fm-button:not(."+f.disabled+")","#"+m+"_2").hover(function(){$(this).addClass(f.hover)},function(){$(this).removeClass(f.hover)}),c(),$("#cData","#"+m+"_2").click(function(){return $.jgrid.hideModal("#"+$.jgrid.jqID(p.themodal),{gb:"#gbox_"+$.jgrid.jqID(k),jqm:b.jqModal,onClose:b.onClose,removemodal:rp_ge[j.p.id].removemodal,formprop:!rp_ge[j.p.id].recreateForm,form:rp_ge[j.p.id].form}),!1}),$("#"+m+"_2").find("[data-index]").each(function(){var a=parseInt($(this).attr("data-index"),10);a>=0&&b.buttons[a].hasOwnProperty("click")&&$(this).on("click",function(c){b.buttons[a].click.call(j,$("#"+n)[0],rp_ge[j.p.id],c)})}),$("#nData","#"+m+"_2").click(function(){$("#FormError","#"+m).hide();var a=i();return a[0]=parseInt(a[0],10),-1!==a[0]&&a[1][a[0]+1]&&($(j).triggerHandler("jqGridViewRowClickPgButtons",["next",$("#"+l),a[1][a[0]]]),$.isFunction(b.onclickPgButtons)&&b.onclickPgButtons.call(j,"next",$("#"+l),a[1][a[0]]),g(a[1][a[0]+1],j),$(j).jqGrid("setSelection",a[1][a[0]+1]),$(j).triggerHandler("jqGridViewRowAfterClickPgButtons",["next",$("#"+l),a[1][a[0]+1]]),$.isFunction(b.afterclickPgButtons)&&b.afterclickPgButtons.call(j,"next",$("#"+l),a[1][a[0]+1]),h(a[0]+1,a)),c(),!1}),$("#pData","#"+m+"_2").click(function(){$("#FormError","#"+m).hide();var a=i();return-1!==a[0]&&a[1][a[0]-1]&&($(j).triggerHandler("jqGridViewRowClickPgButtons",["prev",$("#"+l),a[1][a[0]]]),$.isFunction(b.onclickPgButtons)&&b.onclickPgButtons.call(j,"prev",$("#"+l),a[1][a[0]]),g(a[1][a[0]-1],j),$(j).jqGrid("setSelection",a[1][a[0]-1]),$(j).triggerHandler("jqGridViewRowAfterClickPgButtons",["prev",$("#"+l),a[1][a[0]-1]]),$.isFunction(b.afterclickPgButtons)&&b.afterclickPgButtons.call(j,"prev",$("#"+l),a[1][a[0]-1]),h(a[0]-1,a)),c(),!1});var H=i();h(H[0],H)}}})},delGridRow:function(a,b){var c=$.jgrid.getRegional(this[0],"del"),d=this[0].p.styleUI,e=$.jgrid.styleUI[d].formedit,f=$.jgrid.styleUI[d].common;return b=$.extend(!0,{top:0,left:0,width:240,height:"auto",dataheight:"auto",modal:!1,overlay:30,drag:!0,resize:!0,url:"",mtype:"POST",reloadAfterSubmit:!0,beforeShowForm:null,beforeInitData:null,afterShowForm:null,beforeSubmit:null,onclickSubmit:null,afterSubmit:null,jqModal:!0,closeOnEscape:!1,delData:{},delicon:[],cancelicon:[],onClose:null,ajaxDelOptions:{},processing:!1,serializeDelData:null,useDataProxy:!1},c,b||{}),rp_ge[$(this)[0].p.id]=b,this.each(function(){var c=this;if(c.grid&&a){var d,g,h,i,j=c.p.id,k={},l=!0,m="DelTbl_"+$.jgrid.jqID(j),n="DelTbl_"+j,o={themodal:"delmod"+j,modalhead:"delhd"+j,modalcontent:"delcnt"+j,scrollelm:m};if(rp_ge[c.p.id].styleUI=c.p.styleUI||"jQueryUI",$.isArray(a)&&(a=a.join()),void 0!==$("#"+$.jgrid.jqID(o.themodal))[0]){if(l=$(c).triggerHandler("jqGridDelRowBeforeInitData",[$("#"+m)]),void 0===l&&(l=!0),l&&$.isFunction(rp_ge[c.p.id].beforeInitData)&&(l=rp_ge[c.p.id].beforeInitData.call(c,$("#"+m))),!1===l)return;$("#DelData>td","#"+m).text(a),$("#DelError","#"+m).hide(),!0===rp_ge[c.p.id].processing&&(rp_ge[c.p.id].processing=!1,$("#dData","#"+m).removeClass(f.active)),$(c).triggerHandler("jqGridDelRowBeforeShowForm",[$("#"+m)]),$.isFunction(rp_ge[c.p.id].beforeShowForm)&&rp_ge[c.p.id].beforeShowForm.call(c,$("#"+m)),$.jgrid.viewModal("#"+$.jgrid.jqID(o.themodal),{gbox:"#gbox_"+$.jgrid.jqID(j),jqm:rp_ge[c.p.id].jqModal,overlay:rp_ge[c.p.id].overlay,modal:rp_ge[c.p.id].modal}),$(c).triggerHandler("jqGridDelRowAfterShowForm",[$("#"+m)]),$.isFunction(rp_ge[c.p.id].afterShowForm)&&rp_ge[c.p.id].afterShowForm.call(c,$("#"+m))}else{var p=isNaN(rp_ge[c.p.id].dataheight)?rp_ge[c.p.id].dataheight:rp_ge[c.p.id].dataheight+"px",q=isNaN(b.datawidth)?b.datawidth:b.datawidth+"px",r="<div id='"+n+"' class='formdata' style='width:"+q+";overflow:auto;position:relative;height:"+p+";'>";r+="<table class='DelTable'><tbody>",r+="<tr id='DelError' style='display:none'><td class='"+f.error+"'></td></tr>",r+="<tr id='DelData' style='display:none'><td >"+a+"</td></tr>",r+='<tr><td class="delmsg" style="white-space:pre;">'+rp_ge[c.p.id].msg+"</td></tr><tr><td >&#160;</td></tr>",r+="</tbody></table></div>";var s="<a id='dData' class='fm-button "+f.button+"'>"+b.bSubmit+"</a>",t="<a id='eData' class='fm-button "+f.button+"'>"+b.bCancel+"</a>",u=$.isArray(rp_ge[c.p.id].buttons)?$.jgrid.buildButtons(rp_ge[c.p.id].buttons,s+t,f):s+t,v=$(".ui-jqgrid").css("font-size")||"11px";if(r+="<table class='EditTable ui-common-table' id='"+m+"_2'><tbody><tr><td><hr class='"+f.content+"' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>"+u+"</td></tr></tbody></table>",b.gbox="#gbox_"+$.jgrid.jqID(j),$.jgrid.createModal(o,r,rp_ge[c.p.id],"#gview_"+$.jgrid.jqID(c.p.id),$("#gview_"+$.jgrid.jqID(c.p.id))[0],null,{"font-size":v}),$(".fm-button","#"+m+"_2").hover(function(){$(this).addClass(f.hover)},function(){$(this).removeClass(f.hover)}),b.delicon=$.extend([!0,"left",e.icon_del],rp_ge[c.p.id].delicon),b.cancelicon=$.extend([!0,"left",e.icon_cancel],rp_ge[c.p.id].cancelicon),!0===b.delicon[0]&&$("#dData","#"+m+"_2").addClass("right"===b.delicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='"+f.icon_base+" "+b.delicon[2]+"'></span>"),!0===b.cancelicon[0]&&$("#eData","#"+m+"_2").addClass("right"===b.cancelicon[1]?"fm-button-icon-right":"fm-button-icon-left").append("<span class='"+f.icon_base+" "+b.cancelicon[2]+"'></span>"),$("#dData","#"+m+"_2").click(function(){var a,e=[!0,""],l=$("#DelData>td","#"+m).text();if(k={},k=$(c).triggerHandler("jqGridDelRowClickSubmit",[rp_ge[c.p.id],l]),void 0===k&&$.isFunction(rp_ge[c.p.id].onclickSubmit)&&(k=rp_ge[c.p.id].onclickSubmit.call(c,rp_ge[c.p.id],l)||{}),e=$(c).triggerHandler("jqGridDelRowBeforeSubmit",[l]),void 0===e&&(e=[!0,"",""]),e[0]&&$.isFunction(rp_ge[c.p.id].beforeSubmit)&&(e=rp_ge[c.p.id].beforeSubmit.call(c,l)),e[0]&&!rp_ge[c.p.id].processing){if(rp_ge[c.p.id].processing=!0,h=c.p.prmNames,d=$.extend({},rp_ge[c.p.id].delData,k),i=h.oper,d[i]=h.deloper,g=h.id,l=String(l).split(","),!l.length)return!1;for(a in l)l.hasOwnProperty(a)&&(l[a]=$.jgrid.stripPref(c.p.idPrefix,l[a]));d[g]=l.join(),$(this).addClass(f.active);var n=$.extend({url:rp_ge[c.p.id].url||$(c).jqGrid("getGridParam","editurl"),type:rp_ge[c.p.id].mtype,data:$.isFunction(rp_ge[c.p.id].serializeDelData)?rp_ge[c.p.id].serializeDelData.call(c,d):d,complete:function(a,g){var h;if($("#dData","#"+m+"_2").removeClass(f.active),a.status>=300&&304!==a.status?(e[0]=!1,e[1]=$(c).triggerHandler("jqGridDelRowErrorTextFormat",[a]),$.isFunction(rp_ge[c.p.id].errorTextFormat)&&(e[1]=rp_ge[c.p.id].errorTextFormat.call(c,a)),void 0===e[1]&&(e[1]=g+" Status: '"+a.statusText+"'. Error code: "+a.status)):(e=$(c).triggerHandler("jqGridDelRowAfterSubmit",[a,d]),void 0===e&&(e=[!0,"",""]),e[0]&&$.isFunction(rp_ge[c.p.id].afterSubmit)&&(e=rp_ge[c.p.id].afterSubmit.call(c,a,d))),!1===e[0])$("#DelError>td","#"+m).html(e[1]),$("#DelError","#"+m).show();else{if(rp_ge[c.p.id].reloadAfterSubmit&&"local"!==c.p.datatype)$(c).trigger("reloadGrid");else{if(!0===c.p.treeGrid)try{$(c).jqGrid("delTreeNode",c.p.idPrefix+l[0])}catch(a){}else for(h=0;h<l.length;h++)$(c).jqGrid("delRowData",c.p.idPrefix+l[h]);c.p.selrow=null,c.p.selarrrow=[]}if($.isFunction(rp_ge[c.p.id].afterComplete)||$._data($(c)[0],"events").hasOwnProperty("jqGridDelRowAfterComplete")){var i=a;setTimeout(function(){$(c).triggerHandler("jqGridDelRowAfterComplete",[i,d]);try{rp_ge[c.p.id].afterComplete.call(c,i,d)}catch(a){}},500)}}rp_ge[c.p.id].processing=!1,e[0]&&$.jgrid.hideModal("#"+$.jgrid.jqID(o.themodal),{gb:"#gbox_"+$.jgrid.jqID(j),jqm:b.jqModal,onClose:rp_ge[c.p.id].onClose})}},$.jgrid.ajaxOptions,rp_ge[c.p.id].ajaxDelOptions);if(n.url||rp_ge[c.p.id].useDataProxy||($.isFunction(c.p.dataProxy)?rp_ge[c.p.id].useDataProxy=!0:(e[0]=!1,e[1]+=" "+$.jgrid.getRegional(c,"errors.nourl"))),e[0])if(rp_ge[c.p.id].useDataProxy){var p=c.p.dataProxy.call(c,n,"del_"+c.p.id);void 0===p&&(p=[!0,""]),!1===p[0]?(e[0]=!1,e[1]=p[1]||"Error deleting the selected row!"):$.jgrid.hideModal("#"+$.jgrid.jqID(o.themodal),{gb:"#gbox_"+$.jgrid.jqID(j),jqm:b.jqModal,onClose:rp_ge[c.p.id].onClose})}else"clientArray"===n.url?(d=n.data,n.complete({status:200,statusText:""},"")):$.ajax(n)}return!1===e[0]&&($("#DelError>td","#"+m).html(e[1]),$("#DelError","#"+m).show()),!1}),$("#eData","#"+m+"_2").click(function(){return $.jgrid.hideModal("#"+$.jgrid.jqID(o.themodal),{gb:"#gbox_"+$.jgrid.jqID(j),jqm:rp_ge[c.p.id].jqModal,onClose:rp_ge[c.p.id].onClose}),!1}),$("#"+m+"_2").find("[data-index]").each(function(){var a=parseInt($(this).attr("data-index"),10);a>=0&&b.buttons[a].hasOwnProperty("click")&&$(this).on("click",function(d){b.buttons[a].click.call(c,$("#"+n)[0],rp_ge[c.p.id],d)})}),l=$(c).triggerHandler("jqGridDelRowBeforeInitData",[$("#"+m)]),void 0===l&&(l=!0),l&&$.isFunction(rp_ge[c.p.id].beforeInitData)&&(l=rp_ge[c.p.id].beforeInitData.call(c,$("#"+m))),!1===l)return;$(c).triggerHandler("jqGridDelRowBeforeShowForm",[$("#"+m)]),$.isFunction(rp_ge[c.p.id].beforeShowForm)&&rp_ge[c.p.id].beforeShowForm.call(c,$("#"+m)),$.jgrid.viewModal("#"+$.jgrid.jqID(o.themodal),{gbox:"#gbox_"+$.jgrid.jqID(j),jqm:rp_ge[c.p.id].jqModal,overlay:rp_ge[c.p.id].overlay,modal:rp_ge[c.p.id].modal}),$(c).triggerHandler("jqGridDelRowAfterShowForm",[$("#"+m)]),$.isFunction(rp_ge[c.p.id].afterShowForm)&&rp_ge[c.p.id].afterShowForm.call(c,$("#"+m))}!0===rp_ge[c.p.id].closeOnEscape&&setTimeout(function(){$(".ui-jqdialog-titlebar-close","#"+$.jgrid.jqID(o.modalhead)).attr("tabindex","-1").focus()},0)}})},navGrid:function(a,b,c,d,e,f,g){var h=$.jgrid.getRegional(this[0],"nav"),i=this[0].p.styleUI,j=$.jgrid.styleUI[i].navigator,k=$.jgrid.styleUI[i].common;return b=$.extend({edit:!0,editicon:j.icon_edit_nav,add:!0,addicon:j.icon_add_nav,del:!0,delicon:j.icon_del_nav,search:!0,searchicon:j.icon_search_nav,refresh:!0,refreshicon:j.icon_refresh_nav,refreshstate:"firstpage",view:!1,viewicon:j.icon_view_nav,position:"left",closeOnEscape:!0,beforeRefresh:null,afterRefresh:null,cloneToTop:!1,alertwidth:200,alertheight:"auto",alerttop:null,alertleft:null,alertzIndex:null,dropmenu:!1,navButtonText:""},h,b||{}),this.each(function(){if(!this.p.navGrid){var j,l,m,n={themodal:"alertmod_"+this.p.id,modalhead:"alerthd_"+this.p.id,modalcontent:"alertcnt_"+this.p.id},o=this;if(o.grid&&"string"==typeof a){if($(o).data("navGrid")||$(o).data("navGrid",b),m=$(o).data("navGrid"),o.p.force_regional&&(m=$.extend(m,h)),void 0===$("#"+n.themodal)[0]){m.alerttop||m.alertleft||(void 0!==window.innerWidth?(m.alertleft=window.innerWidth,m.alerttop=window.innerHeight):void 0!==document.documentElement&&void 0!==document.documentElement.clientWidth&&0!==document.documentElement.clientWidth?(m.alertleft=document.documentElement.clientWidth,m.alerttop=document.documentElement.clientHeight):(m.alertleft=1024,m.alerttop=768),m.alertleft=m.alertleft/2-parseInt(m.alertwidth,10)/2,m.alerttop=m.alerttop/2-25);var p=$(".ui-jqgrid").css("font-size")||"11px";$.jgrid.createModal(n,"<div>"+m.alerttext+"</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>",{gbox:"#gbox_"+$.jgrid.jqID(o.p.id),jqModal:!0,drag:!0,resize:!0,caption:m.alertcap,top:m.alerttop,left:m.alertleft,width:m.alertwidth,height:m.alertheight,closeOnEscape:m.closeOnEscape,zIndex:m.alertzIndex,styleUI:o.p.styleUI},"#gview_"+$.jgrid.jqID(o.p.id),$("#gbox_"+$.jgrid.jqID(o.p.id))[0],!0,{"font-size":p})}var q,r=1,s=function(){$(this).hasClass(k.disabled)||$(this).addClass(k.hover)},t=function(){$(this).removeClass(k.hover)};for(m.cloneToTop&&o.p.toppager&&(r=2),q=0;q<r;q++){var u,v,w,x=$("<table class='ui-pg-table navtable ui-common-table'><tbody><tr></tr></tbody></table>"),y="<td class='ui-pg-button "+k.disabled+"' style='width:4px;'><span class='ui-separator'></span></td>";0===q?(v=a,w=o.p.id,v===o.p.toppager&&(w+="_top",r=1)):(v=o.p.toppager,w=o.p.id+"_top"),"rtl"===o.p.direction&&$(x).attr("dir","rtl").css("float","right"),d=d||{},m.add&&(u=$("<td class='ui-pg-button "+k.cornerall+"'></td>"),$(u).append("<div class='ui-pg-div'><span class='"+k.icon_base+" "+m.addicon+"'></span>"+m.addtext+"</div>"),$("tr",x).append(u),$(u,x).attr({title:m.addtitle||"",id:d.id||"add_"+w}).click(function(){return $(this).hasClass(k.disabled)||($.isFunction(m.addfunc)?m.addfunc.call(o):$(o).jqGrid("editGridRow","new",d)),!1}).hover(s,t),u=null),c=c||{},m.edit&&(u=$("<td class='ui-pg-button "+k.cornerall+"'></td>"),$(u).append("<div class='ui-pg-div'><span class='"+k.icon_base+" "+m.editicon+"'></span>"+m.edittext+"</div>"),$("tr",x).append(u),$(u,x).attr({title:m.edittitle||"",id:c.id||"edit_"+w}).click(function(){if(!$(this).hasClass(k.disabled)){var a=o.p.selrow;a?$.isFunction(m.editfunc)?m.editfunc.call(o,a):$(o).jqGrid("editGridRow",a,c):($.jgrid.viewModal("#"+n.themodal,{gbox:"#gbox_"+$.jgrid.jqID(o.p.id),jqm:!0}),$("#jqg_alrt").focus())}return!1}).hover(s,t),u=null),g=g||{},m.view&&(u=$("<td class='ui-pg-button "+k.cornerall+"'></td>"),$(u).append("<div class='ui-pg-div'><span class='"+k.icon_base+" "+m.viewicon+"'></span>"+m.viewtext+"</div>"),$("tr",x).append(u),$(u,x).attr({title:m.viewtitle||"",id:g.id||"view_"+w}).click(function(){if(!$(this).hasClass(k.disabled)){var a=o.p.selrow;a?$.isFunction(m.viewfunc)?m.viewfunc.call(o,a):$(o).jqGrid("viewGridRow",a,g):($.jgrid.viewModal("#"+n.themodal,{gbox:"#gbox_"+$.jgrid.jqID(o.p.id),jqm:!0}),$("#jqg_alrt").focus())}return!1}).hover(s,t),u=null),e=e||{},m.del&&(u=$("<td class='ui-pg-button "+k.cornerall+"'></td>"),$(u).append("<div class='ui-pg-div'><span class='"+k.icon_base+" "+m.delicon+"'></span>"+m.deltext+"</div>"),$("tr",x).append(u),$(u,x).attr({title:m.deltitle||"",id:e.id||"del_"+w}).click(function(){if(!$(this).hasClass(k.disabled)){var a;o.p.multiselect?(a=o.p.selarrrow,0===a.length&&(a=null)):a=o.p.selrow,a?$.isFunction(m.delfunc)?m.delfunc.call(o,a):$(o).jqGrid("delGridRow",a,e):($.jgrid.viewModal("#"+n.themodal,{gbox:"#gbox_"+$.jgrid.jqID(o.p.id),jqm:!0}),$("#jqg_alrt").focus())}return!1}).hover(s,t),u=null),(m.add||m.edit||m.del||m.view)&&$("tr",x).append(y),f=f||{},m.search&&(u=$("<td class='ui-pg-button "+k.cornerall+"'></td>"),$(u).append("<div class='ui-pg-div'><span class='"+k.icon_base+" "+m.searchicon+"'></span>"+m.searchtext+"</div>"),$("tr",x).append(u),$(u,x).attr({title:m.searchtitle||"",id:f.id||"search_"+w}).click(function(){return $(this).hasClass(k.disabled)||($.isFunction(m.searchfunc)?m.searchfunc.call(o,f):$(o).jqGrid("searchGrid",f)),!1}).hover(s,t),f.showOnLoad&&!0===f.showOnLoad&&$(u,x).click(),u=null),m.refresh&&(u=$("<td class='ui-pg-button "+k.cornerall+"'></td>"),$(u).append("<div class='ui-pg-div'><span class='"+k.icon_base+" "+m.refreshicon+"'></span>"+m.refreshtext+"</div>"),$("tr",x).append(u),$(u,x).attr({title:m.refreshtitle||"",id:"refresh_"+w}).click(function(){if(!$(this).hasClass(k.disabled)){$.isFunction(m.beforeRefresh)&&m.beforeRefresh.call(o),o.p.search=!1,o.p.resetsearch=!0;try{if("currentfilter"!==m.refreshstate){var a=o.p.id;o.p.postData.filters="";try{$("#fbox_"+$.jgrid.jqID(a)).jqFilter("resetFilter")}catch(a){}$.isFunction(o.clearToolbar)&&o.clearToolbar.call(o,!1)}}catch(a){}switch(m.refreshstate){case"firstpage":$(o).trigger("reloadGrid",[{page:1}]);break;case"current":case"currentfilter":$(o).trigger("reloadGrid",[{current:!0}])}$.isFunction(m.afterRefresh)&&m.afterRefresh.call(o)}return!1}).hover(s,t),u=null),l=$(".ui-jqgrid").css("font-size")||"11px",$("body").append("<div id='testpg2' class='ui-jqgrid "+$.jgrid.styleUI[i].base.entrieBox+"' style='font-size:"+l+";visibility:hidden;' ></div>"),j=$(x).clone().appendTo("#testpg2").width(),$("#testpg2").remove(),o.p._nvtd&&(m.dropmenu?(x=null,$(o).jqGrid("_buildNavMenu",v,w,b,c,d,e,f,g)):j>o.p._nvtd[0]?(o.p.responsive?(x=null,$(o).jqGrid("_buildNavMenu",v,w,b,c,d,e,f,g)):$(v+"_"+m.position,v).append(x).width(j),o.p._nvtd[0]=j):$(v+"_"+m.position,v).append(x),o.p._nvtd[1]=j),o.p.navGrid=!0}o.p.storeNavOptions&&(o.p.navOptions=m,o.p.editOptions=c,o.p.addOptions=d,o.p.delOptions=e,o.p.searchOptions=f,o.p.viewOptions=g,o.p.navButtons=[])}}})},navButtonAdd:function(a,b){var c=this[0].p.styleUI,d=$.jgrid.styleUI[c].navigator;return b=$.extend({caption:"newButton",title:"",buttonicon:d.icon_newbutton_nav,onClickButton:null,position:"last",cursor:"pointer",internal:!1},b||{}),this.each(function(){if(this.grid){"string"==typeof a&&0!==a.indexOf("#")&&(a="#"+$.jgrid.jqID(a));var d=$(".navtable",a)[0],e=this,f=$.jgrid.styleUI[c].common.disabled,g=$.jgrid.styleUI[c].common.hover,h=$.jgrid.styleUI[c].common.cornerall,i=$.jgrid.styleUI[c].common.icon_base;if(e.p.storeNavOptions&&!b.internal&&e.p.navButtons.push([a,b]),d){if(b.id&&void 0!==$("#"+$.jgrid.jqID(b.id),d)[0])return;var j=$("<td></td>");"NONE"===b.buttonicon.toString().toUpperCase()?$(j).addClass("ui-pg-button "+h).append("<div class='ui-pg-div'>"+b.caption+"</div>"):$(j).addClass("ui-pg-button "+h).append("<div class='ui-pg-div'><span class='"+i+" "+b.buttonicon+"'></span>"+b.caption+"</div>"),b.id&&$(j).attr("id",b.id),"first"===b.position?0===d.rows[0].cells.length?$("tr",d).append(j):$("tr td:eq(0)",d).before(j):$("tr",d).append(j),$(j,d).attr("title",b.title||"").click(function(a){return $(this).hasClass(f)||$.isFunction(b.onClickButton)&&b.onClickButton.call(e,a),!1}).hover(function(){$(this).hasClass(f)||$(this).addClass(g)},function(){$(this).removeClass(g)})}else if(d=$(".dropdownmenu",a)[0]){var k=$(d).val(),l=b.id||$.jgrid.randId(),m=$('<li class="ui-menu-item" role="presentation"><a class="'+h+' g-menu-item" tabindex="0" role="menuitem" id="'+l+'">'+(b.caption||b.title)+"</a></li>");k&&("first"===b.position?$("#"+k).prepend(m):$("#"+k).append(m),$(m).on("click",function(a){return $(this).hasClass(f)||($("#"+k).hide(),$.isFunction(b.onClickButton)&&b.onClickButton.call(e,a)),!1}).find("a").hover(function(){$(this).hasClass(f)||$(this).addClass(g)},function(){$(this).removeClass(g)}))}}})},navSeparatorAdd:function(a,b){var c=this[0].p.styleUI,d=$.jgrid.styleUI[c].common;return b=$.extend({sepclass:"ui-separator",sepcontent:"",position:"last"},b||{}),this.each(function(){if(this.grid){"string"==typeof a&&0!==a.indexOf("#")&&(a="#"+$.jgrid.jqID(a));var c,e,f=$(".navtable",a)[0];this.p.storeNavOptions&&this.p.navButtons.push([a,b]),f?(c="<td class='ui-pg-button "+d.disabled+"' style='width:4px;'><span class='"+b.sepclass+"'></span>"+b.sepcontent+"</td>","first"===b.position?0===f.rows[0].cells.length?$("tr",f).append(c):$("tr td:eq(0)",f).before(c):$("tr",f).append(c)):(f=$(".dropdownmenu",a)[0],c="<li class='ui-menu-item "+d.disabled+"' style='width:100%' role='presentation'><hr class='ui-separator-li'></li>",f&&(e=$(f).val())&&("first"===b.position?$("#"+e).prepend(c):$("#"+e).append(c)))}})},_buildNavMenu:function(a,b,c,d,e,f,g,h){return this.each(function(){var i=this,j=$.jgrid.getRegional(i,"nav"),k=i.p.styleUI,l=($.jgrid.styleUI[k].navigator,$.jgrid.styleUI[k].filter),m=$.jgrid.styleUI[k].common,n="form_menu_"+$.jgrid.randId(),o=c.navButtonText?c.navButtonText:j.selectcaption||"Actions",p="<button class='dropdownmenu "+m.button+"' value='"+n+"'>"+o+"</button>";$(a+"_"+c.position,a).append(p);var q={themodal:"alertmod_"+this.p.id,modalhead:"alerthd_"+this.p.id,modalcontent:"alertcnt_"+this.p.id};(function(){var a,j,k=$(".ui-jqgrid").css("font-size")||"11px",o=$('<ul id="'+n+'" class="ui-nav-menu modal-content" role="menu" tabindex="0" style="display:none;font-size:'+k+'"></ul>');c.add&&(e=e||{},a=e.id||"add_"+b,j=$('<li class="ui-menu-item" role="presentation"><a class="'+m.cornerall+' g-menu-item" tabindex="0" role="menuitem" id="'+a+'">'+(c.addtext||c.addtitle)+"</a></li>").click(function(){return $(this).hasClass(m.disabled)||($.isFunction(c.addfunc)?c.addfunc.call(i):$(i).jqGrid("editGridRow","new",e),$(o).hide()),!1}),$(o).append(j)),c.edit&&(d=d||{},a=d.id||"edit_"+b,j=$('<li class="ui-menu-item" role="presentation"><a class="'+m.cornerall+' g-menu-item" tabindex="0" role="menuitem" id="'+a+'">'+(c.edittext||c.edittitle)+"</a></li>").click(function(){if(!$(this).hasClass(m.disabled)){var a=i.p.selrow;a?$.isFunction(c.editfunc)?c.editfunc.call(i,a):$(i).jqGrid("editGridRow",a,d):($.jgrid.viewModal("#"+q.themodal,{gbox:"#gbox_"+$.jgrid.jqID(i.p.id),jqm:!0}),$("#jqg_alrt").focus()),$(o).hide()}return!1}),$(o).append(j)),c.view&&(h=h||{},a=h.id||"view_"+b,j=$('<li class="ui-menu-item" role="presentation"><a class="'+m.cornerall+' g-menu-item" tabindex="0" role="menuitem" id="'+a+'">'+(c.viewtext||c.viewtitle)+"</a></li>").click(function(){if(!$(this).hasClass(m.disabled)){var a=i.p.selrow;a?$.isFunction(c.editfunc)?c.viewfunc.call(i,a):$(i).jqGrid("viewGridRow",a,h):($.jgrid.viewModal("#"+q.themodal,{gbox:"#gbox_"+$.jgrid.jqID(i.p.id),jqm:!0}),$("#jqg_alrt").focus()),$(o).hide()}return!1}),$(o).append(j)),c.del&&(f=f||{},a=f.id||"del_"+b,j=$('<li class="ui-menu-item" role="presentation"><a class="'+m.cornerall+' g-menu-item" tabindex="0" role="menuitem" id="'+a+'">'+(c.deltext||c.deltitle)+"</a></li>").click(function(){if(!$(this).hasClass(m.disabled)){var a
;i.p.multiselect?(a=i.p.selarrrow,0===a.length&&(a=null)):a=i.p.selrow,a?$.isFunction(c.delfunc)?c.delfunc.call(i,a):$(i).jqGrid("delGridRow",a,f):($.jgrid.viewModal("#"+q.themodal,{gbox:"#gbox_"+$.jgrid.jqID(i.p.id),jqm:!0}),$("#jqg_alrt").focus()),$(o).hide()}return!1}),$(o).append(j)),(c.add||c.edit||c.del||c.view)&&$(o).append("<li class='ui-menu-item "+m.disabled+"' style='width:100%' role='presentation'><hr class='ui-separator-li'></li>"),c.search&&(g=g||{},a=g.id||"search_"+b,j=$('<li class="ui-menu-item" role="presentation"><a class="'+m.cornerall+' g-menu-item" tabindex="0" role="menuitem" id="'+a+'">'+(c.searchtext||c.searchtitle)+"</a></li>").click(function(){return $(this).hasClass(m.disabled)||($.isFunction(c.searchfunc)?c.searchfunc.call(i,g):$(i).jqGrid("searchGrid",g),$(o).hide()),!1}),$(o).append(j),g.showOnLoad&&!0===g.showOnLoad&&$(j).click()),c.refresh&&(a=g.id||"search_"+b,j=$('<li class="ui-menu-item" role="presentation"><a class="'+m.cornerall+' g-menu-item" tabindex="0" role="menuitem" id="'+a+'">'+(c.refreshtext||c.refreshtitle)+"</a></li>").click(function(){if(!$(this).hasClass(m.disabled)){$.isFunction(c.beforeRefresh)&&c.beforeRefresh.call(i),i.p.search=!1,i.p.resetsearch=!0;try{if("currentfilter"!==c.refreshstate){var a=i.p.id;i.p.postData.filters="";try{$("#fbox_"+$.jgrid.jqID(a)).jqFilter("resetFilter")}catch(a){}$.isFunction(i.clearToolbar)&&i.clearToolbar.call(i,!1)}}catch(a){}switch(c.refreshstate){case"firstpage":$(i).trigger("reloadGrid",[{page:1}]);break;case"current":case"currentfilter":$(i).trigger("reloadGrid",[{current:!0}])}$.isFunction(c.afterRefresh)&&c.afterRefresh.call(i),$(o).hide()}return!1}),$(o).append(j)),$(o).hide(),$("body").append(o),$("#"+n).addClass("ui-menu "+l.menu_widget),$("#"+n+" > li > a").hover(function(){$(this).addClass(m.hover)},function(){$(this).removeClass(m.hover)})})(),$(".dropdownmenu",a+"_"+c.position).on("click",function(a){var b=$(this).offset(),c=b.left,d=parseInt(b.top),e=$(this).val();$("#"+e).show().css({top:d-($("#"+e).height()+10)+"px",left:c+"px"}),a.stopPropagation()}),$("body").on("click",function(a){$(a.target).hasClass("dropdownmenu")||$("#"+n).hide()})})},GridToForm:function(a,b){return this.each(function(){var c,d=this;if(d.grid){var e=$(d).jqGrid("getRowData",a);if(e)for(c in e)e.hasOwnProperty(c)&&($("[name="+$.jgrid.jqID(c)+"]",b).is("input:radio")||$("[name="+$.jgrid.jqID(c)+"]",b).is("input:checkbox")?$("[name="+$.jgrid.jqID(c)+"]",b).each(function(){$(this).val()==e[c]?$(this)[d.p.useProp?"prop":"attr"]("checked",!0):$(this)[d.p.useProp?"prop":"attr"]("checked",!1)}):$("[name="+$.jgrid.jqID(c)+"]",b).val(e[c]))}})},FormToGrid:function(a,b,c,d){return this.each(function(){var e=this;if(e.grid){c||(c="set"),d||(d="first");var f=$(b).serializeArray(),g={};$.each(f,function(a,b){g[b.name]=b.value}),"add"===c?$(e).jqGrid("addRowData",a,g,d):"set"===c&&$(e).jqGrid("setRowData",a,g)}})}}),$.jgrid.extend({groupingSetup:function(){return this.each(function(){var a,b,c,d=this,e=d.p.colModel,f=d.p.groupingView,g=$.jgrid.styleUI[d.p.styleUI||"jQueryUI"].grouping;if(null===f||"object"!=typeof f&&!$.isFunction(f))d.p.grouping=!1;else if(f.plusicon||(f.plusicon=g.icon_plus),f.minusicon||(f.minusicon=g.icon_minus),f.groupField.length){for(void 0===f.visibiltyOnNextGrouping&&(f.visibiltyOnNextGrouping=[]),f.lastvalues=[],f._locgr||(f.groups=[]),f.counters=[],a=0;a<f.groupField.length;a++)f.groupOrder[a]||(f.groupOrder[a]="asc"),f.groupText[a]||(f.groupText[a]="{0}"),"boolean"!=typeof f.groupColumnShow[a]&&(f.groupColumnShow[a]=!0),"boolean"!=typeof f.groupSummary[a]&&(f.groupSummary[a]=!1),f.groupSummaryPos[a]||(f.groupSummaryPos[a]="footer"),!0===f.groupColumnShow[a]?(f.visibiltyOnNextGrouping[a]=!0,$(d).jqGrid("showCol",f.groupField[a])):(f.visibiltyOnNextGrouping[a]=$("#"+$.jgrid.jqID(d.p.id+"_"+f.groupField[a])).is(":visible"),$(d).jqGrid("hideCol",f.groupField[a]));for(f.summary=[],f.hideFirstGroupCol&&$.isArray(f.formatDisplayField)&&!$.isFunction(f.formatDisplayField[0])&&(f.formatDisplayField[0]=function(a){return a}),b=0,c=e.length;b<c;b++)f.hideFirstGroupCol&&(e[b].hidden||f.groupField[0]!==e[b].name||(e[b].formatter=function(){return""})),e[b].summaryType&&(e[b].summaryDivider?f.summary.push({nm:e[b].name,st:e[b].summaryType,v:"",sd:e[b].summaryDivider,vd:"",sr:e[b].summaryRound,srt:e[b].summaryRoundType||"round"}):f.summary.push({nm:e[b].name,st:e[b].summaryType,v:"",sr:e[b].summaryRound,srt:e[b].summaryRoundType||"round"}))}else d.p.grouping=!1})},groupingPrepare:function(a,b){return this.each(function(){var c,d,e,f,g,h=this.p.groupingView,i=this,j=function(){$.isFunction(this.st)?this.v=this.st.call(i,this.v,this.nm,a):(this.v=$(i).jqGrid("groupingCalculations.handler",this.st,this.v,this.nm,this.sr,this.srt,a),"avg"===this.st.toLowerCase()&&this.sd&&(this.vd=$(i).jqGrid("groupingCalculations.handler",this.st,this.vd,this.sd,this.sr,this.srt,a)))},k=h.groupField.length,l=0;for(c=0;c<k;c++)d=h.groupField[c],f=h.displayField[c],e=a[d],g=null==f?null:a[f],null==g&&(g=e),void 0!==e&&(0===b?(h.groups.push({idx:c,dataIndex:d,value:e,displayValue:g,startRow:b,cnt:1,summary:[]}),h.lastvalues[c]=e,h.counters[c]={cnt:1,pos:h.groups.length-1,summary:$.extend(!0,[],h.summary)},$.each(h.counters[c].summary,j),h.groups[h.counters[c].pos].summary=h.counters[c].summary):"object"==typeof e||($.isArray(h.isInTheSameGroup)&&$.isFunction(h.isInTheSameGroup[c])?h.isInTheSameGroup[c].call(i,h.lastvalues[c],e,c,h):h.lastvalues[c]===e)?1===l?(h.groups.push({idx:c,dataIndex:d,value:e,displayValue:g,startRow:b,cnt:1,summary:[]}),h.lastvalues[c]=e,h.counters[c]={cnt:1,pos:h.groups.length-1,summary:$.extend(!0,[],h.summary)},$.each(h.counters[c].summary,j),h.groups[h.counters[c].pos].summary=h.counters[c].summary):(h.counters[c].cnt+=1,h.groups[h.counters[c].pos].cnt=h.counters[c].cnt,$.each(h.counters[c].summary,j),h.groups[h.counters[c].pos].summary=h.counters[c].summary):(h.groups.push({idx:c,dataIndex:d,value:e,displayValue:g,startRow:b,cnt:1,summary:[]}),h.lastvalues[c]=e,l=1,h.counters[c]={cnt:1,pos:h.groups.length-1,summary:$.extend(!0,[],h.summary)},$.each(h.counters[c].summary,j),h.groups[h.counters[c].pos].summary=h.counters[c].summary))}),this},groupingToggle:function(a){return this.each(function(){var b=this,c=b.p.groupingView,d=a.split("_"),e=parseInt(d[d.length-2],10);d.splice(d.length-2,2);var f,g,h,i=d.join("_"),j=c.minusicon,k=c.plusicon,l=$("#"+$.jgrid.jqID(a)),m=l.length?l[0].nextSibling:null,n=$("#"+$.jgrid.jqID(a)+" span.tree-wrap-"+b.p.direction),o=function(a){var b=$.map(a.split(" "),function(a){if(a.substring(0,i.length+1)===i+"_")return parseInt(a.substring(i.length+1),10)});return b.length>0?b[0]:void 0},p=!1,q=!1,r=!!b.p.frozenColumns&&b.p.id+"_frozen",s=!!r&&$("#"+$.jgrid.jqID(a),"#"+$.jgrid.jqID(r)),t=s&&s.length?s[0].nextSibling:null;if(n.hasClass(j)){if(m)for(;m&&!(void 0!==(f=o(m.className))&&f<=e);)h=parseInt($(m).attr("jqfootlevel"),10),q=!isNaN(h)&&(c.showSummaryOnHide&&h<=e),q||$(m).hide(),m=m.nextSibling,r&&(q||$(t).hide(),t=t.nextSibling);n.removeClass(j).addClass(k),p=!0}else{if(m)for(g=void 0;m;){if(f=o(m.className),void 0===g&&(g=void 0===f),q=$(m).hasClass("ui-subgrid")&&$(m).hasClass("ui-sg-collapsed"),void 0!==f){if(f<=e)break;f===e+1&&(q||($(m).show().find(">td>span.tree-wrap-"+b.p.direction).removeClass(j).addClass(k),r&&$(t).show().find(">td>span.tree-wrap-"+b.p.direction).removeClass(j).addClass(k)))}else g&&(q||($(m).show(),r&&$(t).show()));m=m.nextSibling,r&&(t=t.nextSibling)}n.removeClass(k).addClass(j)}$(b).triggerHandler("jqGridGroupingClickGroup",[a,p]),$.isFunction(b.p.onClickGroup)&&b.p.onClickGroup.call(b,a,p)}),!1},groupingRender:function(a,b,c,d){return this.each(function(){function e(a,b,c){var d,e=!1;if(0===b)e=c[a];else{var f=c[a].idx;if(0===f)e=c[a];else for(d=a;d>=0;d--)if(c[d].idx===f-b){e=c[d];break}}return e}function f(a,c,d,f,g){var h,i,k,l,m=e(a,c,d),n=j.p.colModel,o=m.cnt,p="",q=!1;for(i=f;i<b;i++)n[i].hidden?k="<td "+j.formatCol(i,1,"")+">&#160;</td>":!q&&g?(k=g,q=!0):k="<td "+j.formatCol(i,1,"")+">&#160;</td>",$.each(m.summary,function(){if(this.nm===n[i].name){l=n[i].summaryTpl?n[i].summaryTpl:"{0}","string"==typeof this.st&&"avg"===this.st.toLowerCase()&&(this.sd&&this.vd?this.v=this.v/this.vd:this.v&&o>0&&(this.v=this.v/o));try{this.groupCount=m.cnt,this.groupIndex=m.dataIndex,this.groupValue=m.value,h=j.formatter("",this.v,i,this)}catch(a){h=this.v}return k="<td "+j.formatCol(i,1,"")+">"+$.jgrid.template(l,h,m.cnt,m.dataIndex,m.displayValue)+"</td>",!1}}),p+=k;return p}var g,h,i,j=this,k=j.p.groupingView,l="",m="",n=k.groupCollapse?k.plusicon:k.minusicon,o=[],p=k.groupField.length,q=$.jgrid.styleUI[j.p.styleUI||"jQueryUI"].common;n=n+" tree-wrap-"+j.p.direction,$.each(j.p.colModel,function(a,b){var c;for(c=0;c<p;c++)if(k.groupField[c]===b.name){o[c]=a;break}});var r,s=0,t=$.makeArray(k.groupSummary);t.reverse(),r=j.p.multiselect?' colspan="2"':"",$.each(k.groups,function(e,u){if(k._locgr&&!(u.startRow+u.cnt>(c-1)*d&&u.startRow<c*d))return!0;s++,h=j.p.id+"ghead_"+u.idx,g=h+"_"+e,m="<span style='cursor:pointer;margin-right:8px;margin-left:5px;' class='"+q.icon_base+" "+n+"' onclick=\"jQuery('#"+$.jgrid.jqID(j.p.id)+"').jqGrid('groupingToggle','"+g+"');return false;\"></span>";try{i=$.isArray(k.formatDisplayField)&&$.isFunction(k.formatDisplayField[u.idx])?k.formatDisplayField[u.idx].call(j,u.displayValue,u.value,j.p.colModel[o[u.idx]],u.idx,k):j.formatter(g,u.displayValue,o[u.idx],u.value)}catch(a){i=u.displayValue}var v="";if(v=$.isFunction(k.groupText[u.idx])?k.groupText[u.idx].call(j,i,u.cnt,u.summary):$.jgrid.template(k.groupText[u.idx],i,u.cnt,u.summary),"string"!=typeof v&&"number"!=typeof v&&(v=i),"header"===k.groupSummaryPos[u.idx]?(l+='<tr id="'+g+'"'+(k.groupCollapse&&u.idx>0?' style="display:none;" ':" ")+'role="row" class= "'+q.content+" jqgroup ui-row-"+j.p.direction+" "+h+'">',l+=f(e,0,k.groups,""===r?0:1,'<td style="padding-left:'+12*u.idx+'px;"'+r+">"+m+v+"</td>"),l+="</tr>"):l+='<tr id="'+g+'"'+(k.groupCollapse&&u.idx>0?' style="display:none;" ':" ")+'role="row" class= "'+q.content+" jqgroup ui-row-"+j.p.direction+" "+h+'"><td style="padding-left:'+12*u.idx+'px;" colspan="'+(!1===k.groupColumnShow[u.idx]?b-1:b)+'">'+m+v+"</td></tr>",p-1===u.idx){var w,x,y=k.groups[e+1],z=0,A=u.startRow,B=void 0!==y?y.startRow:k.groups[e].startRow+k.groups[e].cnt;for(k._locgr&&(z=(c-1)*d)>u.startRow&&(A=z),w=A;w<B&&a[w-z];w++)l+=a[w-z].join("");if("header"!==k.groupSummaryPos[u.idx]){var C;if(void 0!==y){for(C=0;C<k.groupField.length&&y.dataIndex!==k.groupField[C];C++);s=k.groupField.length-C}for(x=0;x<s;x++)if(t[x]){var D="";k.groupCollapse&&!k.showSummaryOnHide&&(D=' style="display:none;"'),l+="<tr"+D+' jqfootlevel="'+(u.idx-x)+'" role="row" class="'+q.content+" jqfoot ui-row-"+j.p.direction+'">',l+=f(e,x,k.groups,0,!1),l+="</tr>"}s=C}}}),$("#"+$.jgrid.jqID(j.p.id)+" tbody:first").append(l),l=null})},groupingGroupBy:function(a,b){return this.each(function(){var c=this;"string"==typeof a&&(a=[a]);var d=c.p.groupingView;c.p.grouping=!0,d._locgr=!1,void 0===d.visibiltyOnNextGrouping&&(d.visibiltyOnNextGrouping=[]);var e;for(e=0;e<d.groupField.length;e++)!d.groupColumnShow[e]&&d.visibiltyOnNextGrouping[e]&&$(c).jqGrid("showCol",d.groupField[e]);for(e=0;e<a.length;e++)d.visibiltyOnNextGrouping[e]=$("#"+$.jgrid.jqID(c.p.id)+"_"+$.jgrid.jqID(a[e])).is(":visible");c.p.groupingView=$.extend(c.p.groupingView,b||{}),d.groupField=a,$(c).trigger("reloadGrid")})},groupingRemove:function(a){return this.each(function(){var b=this;if(void 0===a&&(a=!0),b.p.grouping=!1,!0===a){var c,d=b.p.groupingView;for(c=0;c<d.groupField.length;c++)!d.groupColumnShow[c]&&d.visibiltyOnNextGrouping[c]&&$(b).jqGrid("showCol",d.groupField);$("tr.jqgroup, tr.jqfoot","#"+$.jgrid.jqID(b.p.id)+" tbody:first").remove(),$("tr.jqgrow:hidden","#"+$.jgrid.jqID(b.p.id)+" tbody:first").show()}else $(b).trigger("reloadGrid")})},groupingCalculations:{handler:function(a,b,c,d,e,f){var g={sum:function(){return parseFloat(b||0)+parseFloat(f[c]||0)},min:function(){return""===b?parseFloat(f[c]||0):Math.min(parseFloat(b),parseFloat(f[c]||0))},max:function(){return""===b?parseFloat(f[c]||0):Math.max(parseFloat(b),parseFloat(f[c]||0))},count:function(){return""===b&&(b=0),f.hasOwnProperty(c)?b+1:0},avg:function(){return g.sum()}};if(!g[a])throw"jqGrid Grouping No such method: "+a;var h=g[a]();if(null!=d)if("fixed"===e)h=h.toFixed(d);else{var i=Math.pow(10,d);h=Math.round(h*i)/i}return h}},setGroupHeaders:function(a){return a=$.extend({useColSpanStyle:!1,groupHeaders:[]},a||{}),this.each(function(){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p=this,q=0,r=p.p.colModel,s=r.length,t=p.grid.headers,u=$("table.ui-jqgrid-htable",p.grid.hDiv),v=u.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header"),w=u.children("thead"),x=u.find(".jqg-first-row-header"),y=$.jgrid.styleUI[p.p.styleUI||"jQueryUI"].base;p.p.groupHeader||(p.p.groupHeader=[]),p.p.groupHeader.push(a),void 0===x[0]?x=$("<tr>",{role:"row","aria-hidden":"true"}).addClass("jqg-first-row-header").css("height","auto"):x.empty();var z,A=function(a,b){var c,d=b.length;for(c=0;c<d;c++)if(b[c].startColumnName===a)return c;return-1};for($(p).prepend(w),d=$("<tr>",{role:"row"}).addClass("ui-jqgrid-labels jqg-third-row-header"),b=0;b<s;b++)if(f=t[b].el,g=$(f),c=r[b],h={height:"0px",width:t[b].width+"px",display:c.hidden?"none":""},$("<th>",{role:"gridcell"}).css(h).addClass("ui-first-th-"+p.p.direction).appendTo(x),f.style.width="",(i=A(c.name,a.groupHeaders))>=0){for(j=a.groupHeaders[i],k=j.numberOfColumns,l=j.titleText,n=j.className||"",m=0,i=0;i<k&&b+i<s;i++)r[b+i].hidden||m++;e=$("<th>").attr({role:"columnheader"}).addClass(y.headerBox+" ui-th-column-header ui-th-"+p.p.direction+" "+n).html(l),m>0&&e.attr("colspan",String(m)),p.p.headertitles&&e.attr("title",e.text()),0===m&&e.hide(),g.before(e),d.append(f),q=k-1}else if(0===q)if(a.useColSpanStyle){var B=g.attr("rowspan")?parseInt(g.attr("rowspan"),10)+1:2;g.attr("rowspan",B)}else $("<th>",{role:"columnheader"}).addClass(y.headerBox+" ui-th-column-header ui-th-"+p.p.direction).css({display:c.hidden?"none":""}).insertBefore(g),d.append(f);else d.append(f),q--;o=$(p).children("thead"),o.prepend(x),d.insertAfter(v),u.append(o),a.useColSpanStyle&&(u.find("span.ui-jqgrid-resize").each(function(){var a=$(this).parent();a.is(":visible")&&(this.style.cssText="height: "+a.height()+"px !important; cursor: col-resize;")}),u.find("div.ui-jqgrid-sortable").each(function(){var a=$(this),b=a.parent();b.is(":visible")&&b.is(":has(span.ui-jqgrid-resize)")&&a.css("top",(b.height()-a.outerHeight())/2-4+"px")})),z=o.find("tr.jqg-first-row-header"),$(p).on("jqGridResizeStop.setGroupHeaders",function(a,b,c){z.find("th").eq(c)[0].style.width=b+"px"})})},destroyGroupHeader:function(a){return void 0===a&&(a=!0),this.each(function(){var b,c,d,e,f,g,h,i=this,j=i.grid,k=$("table.ui-jqgrid-htable thead",j.hDiv),l=i.p.colModel;if(j){for($(this).off(".setGroupHeaders"),b=$("<tr>",{role:"row"}).addClass("ui-jqgrid-labels"),e=j.headers,c=0,d=e.length;c<d;c++){h=l[c].hidden?"none":"",f=$(e[c].el).width(e[c].width).css("display",h);try{f.removeAttr("rowSpan")}catch(a){f.attr("rowSpan",1)}b.append(f),g=f.children("span.ui-jqgrid-resize"),g.length>0&&(g[0].style.height=""),f.children("div")[0].style.top=""}$(k).children("tr.ui-jqgrid-labels").remove(),$(k).prepend(b),!0===a&&$(i).jqGrid("setGridParam",{groupHeader:null})}})}}),$.jgrid=$.jgrid||{},$.extend($.jgrid,{saveState:function(a,b){if(b=$.extend({useStorage:!0,storageType:"localStorage",beforeSetItem:null,compression:!1,compressionModule:"LZString",compressionMethod:"compressToUTF16",debug:!1,saveData:!0},b||{}),a){var c,d,e="",f="",g=$("#"+a)[0];if(g.grid){if(d=$(g).data("inlineNav"),d&&g.p.inlineNav&&$(g).jqGrid("setGridParam",{_iN:d}),d=$(g).data("filterToolbar"),d&&g.p.filterToolbar&&$(g).jqGrid("setGridParam",{_fT:d}),e=$(g).jqGrid("jqGridExport",{exptype:"jsonstring",ident:"",root:"",data:b.saveData}),f="",b.saveData){f=$(g.grid.bDiv).find(".ui-jqgrid-btable tbody:first").html();var h=f.indexOf("</tr>");f=f.slice(h+5)}if($.isFunction(b.beforeSetItem)&&null!=(c=b.beforeSetItem.call(g,e))&&(e=c),b.debug){$("#gbox_tree").prepend('<a id="link_save" target="_blank" download="jqGrid_dump.txt">Click to save Dump Data</a>');var i,j,k=[],l={};k.push("Grid Options\n"),k.push(e),k.push("\n"),k.push("GridData\n"),k.push(f),l.type="plain/text;charset=utf-8";try{i=new File(k,"jqGrid_dump.txt",l)}catch(a){i=new Blob(k,l)}j=URL.createObjectURL(i),$("#link_save").attr("href",j).on("click",function(){$(this).remove()})}if(b.compression&&b.compressionModule)try{c=window[b.compressionModule][b.compressionMethod](e),null!=c&&(e=c,f=window[b.compressionModule][b.compressionMethod](f))}catch(a){}if(b.useStorage&&$.jgrid.isLocalStorage())try{window[b.storageType].setItem("jqGrid"+g.p.id,e),window[b.storageType].setItem("jqGrid"+g.p.id+"_data",f)}catch(a){22===a.code&&alert("Local storage limit is over!")}return e}}},loadState:function(a,b,c){if(c=$.extend({useStorage:!0,storageType:"localStorage",clearAfterLoad:!1,beforeSetGrid:null,afterSetGrid:null,decompression:!1,decompressionModule:"LZString",decompressionMethod:"decompressFromUTF16",restoreData:!0},c||{}),a){var d,e,f,g,h,i=$("#"+a)[0];if(c.useStorage)try{b=window[c.storageType].getItem("jqGrid"+i.id),f=window[c.storageType].getItem("jqGrid"+i.id+"_data")}catch(a){}if(b){if(c.decompression&&c.decompressionModule)try{d=window[c.decompressionModule][c.decompressionMethod](b),null!=d&&(b=d,f=window[c.decompressionModule][c.decompressionMethod](f))}catch(a){}if((d=$.jgrid.parseFunc(b))&&"object"===$.type(d)){i.grid&&$.jgrid.gridUnload(a),$.isFunction(c.beforeSetGrid)&&(e=c.beforeSetGrid(d))&&"object"===$.type(e)&&(d=e);var j=function(a){return a},k={reccount:d.reccount,records:d.records,lastpage:d.lastpage,shrinkToFit:j(d.shrinkToFit),data:j(d.data),datatype:j(d.datatype),grouping:j(d.grouping)};d.shrinkToFit=!1,d.data=[],d.datatype="local",d.grouping=!1,d.inlineNav&&(g=j(d._iN),d._iN=null,delete d._iN),d.filterToolbar&&(h=j(d._fT),d._fT=null,delete d._fT);var l=$("#"+a).jqGrid(d);if(c.restoreData&&""!==$.trim(f)&&l.append(f),l.jqGrid("setGridParam",k),d.storeNavOptions&&d.navGrid&&(l[0].p.navGrid=!1,l.jqGrid("navGrid",d.pager,d.navOptions,d.editOptions,d.addOptions,d.delOptions,d.searchOptions,d.viewOptions),d.navButtons&&d.navButtons.length))for(var m=0;m<d.navButtons.length;m++)"sepclass"in d.navButtons[m][1]?l.jqGrid("navSeparatorAdd",d.navButtons[m][0],d.navButtons[m][1]):l.jqGrid("navButtonAdd",d.navButtons[m][0],d.navButtons[m][1]);if(l[0].refreshIndex(),d.subGrid){var n=1===d.multiselect?1:0,o=!0===d.rownumbers?1:0;l.jqGrid("addSubGrid",n+o),$.each(l[0].rows,function(a,b){$(b).hasClass("ui-sg-expanded")&&$(l[0].rows[a-1]).find("td.sgexpanded").click().click()})}if(d.treeGrid)for(var p=1,q=l[0].rows.length,r=d.expColInd,s=d.treeReader.leaf_field,t=d.treeReader.expanded_field;p<q;)$(l[0].rows[p].cells[r]).find("div.treeclick").on("click",function(a){var b=a.target||a.srcElement,c=$.jgrid.stripPref(d.idPrefix,$(b,l[0].rows).closest("tr.jqgrow")[0].id),e=l[0].p._index[c];return l[0].p.data[e][s]||(l[0].p.data[e][t]?(l.jqGrid("collapseRow",l[0].p.data[e]),l.jqGrid("collapseNode",l[0].p.data[e])):(l.jqGrid("expandRow",l[0].p.data[e]),l.jqGrid("expandNode",l[0].p.data[e]))),!1}),!0===d.ExpandColClick&&$(l[0].rows[p].cells[r]).find("span.cell-wrapper").css("cursor","pointer").on("click",function(a){var b=a.target||a.srcElement,c=$.jgrid.stripPref(d.idPrefix,$(b,l[0].rows).closest("tr.jqgrow")[0].id),e=l[0].p._index[c];return l[0].p.data[e][s]||(l[0].p.data[e][t]?(l.jqGrid("collapseRow",l[0].p.data[e]),l.jqGrid("collapseNode",l[0].p.data[e])):(l.jqGrid("expandRow",l[0].p.data[e]),l.jqGrid("expandNode",l[0].p.data[e]))),l.jqGrid("setSelection",c),!1}),p++;d.multiselect&&$.each(d.selarrrow,function(){$("#jqg_"+a+"_"+this)[d.useProp?"prop":"attr"]("checked","checked")}),d.inlineNav&&g&&(l.jqGrid("setGridParam",{inlineNav:!1}),l.jqGrid("inlineNav",d.pager,g)),d.filterToolbar&&h&&(l.jqGrid("setGridParam",{filterToolbar:!1}),h.restoreFromFilters=!0,l.jqGrid("filterToolbar",h)),d.frozenColumns&&l.jqGrid("setFrozenColumns"),l[0].updatepager(!0,!0),$.isFunction(c.afterSetGrid)&&c.afterSetGrid(l),c.clearAfterLoad&&(window[c.storageType].removeItem("jqGrid"+i.id),window[c.storageType].removeItem("jqGrid"+i.id+"_data"))}else alert("can not convert to object")}}},isGridInStorage:function(a,b){var c={storageType:"localStorage"};c=$.extend(c,b||{});var d,e,f;try{e=window[c.storageType].getItem("jqGrid"+a),f=window[c.storageType].getItem("jqGrid"+a+"_data"),d=null!=e&&null!=f&&"string"==typeof e&&"string"==typeof f}catch(a){d=!1}return d},setRegional:function(a,b){var c={storageType:"sessionStorage"};if(c=$.extend(c,b||{}),c.regional){$.jgrid.saveState(a,c),c.beforeSetGrid=function(a){return a.regional=c.regional,a.force_regional=!0,a},$.jgrid.loadState(a,null,c);var d=$("#"+a)[0],e=$(d).jqGrid("getGridParam","colModel"),f=-1,g=$.jgrid.getRegional(d,"nav");$.each(e,function(a){if(this.formatter&&"actions"===this.formatter)return f=a,!1}),-1!==f&&g&&$("#"+a+" tbody tr").each(function(){var a=this.cells[f];$(a).find(".ui-inline-edit").attr("title",g.edittitle),$(a).find(".ui-inline-del").attr("title",g.deltitle),$(a).find(".ui-inline-save").attr("title",g.savetitle),$(a).find(".ui-inline-cancel").attr("title",g.canceltitle)});try{window[c.storageType].removeItem("jqGrid"+d.id),window[c.storageType].removeItem("jqGrid"+d.id+"_data")}catch(a){}}},jqGridImport:function(a,b){b=$.extend({imptype:"xml",impstring:"",impurl:"",mtype:"GET",impData:{},xmlGrid:{config:"root>grid",data:"root>rows"},jsonGrid:{config:"grid",data:"data"},ajaxOptions:{}},b||{});var c=(0===a.indexOf("#")?"":"#")+$.jgrid.jqID(a),d=function(a,b){var d,e,f,g=$(b.xmlGrid.config,a)[0],h=$(b.xmlGrid.data,a)[0];if($.grid.xmlToJSON){d=$.jgrid.xmlToJSON(g);for(f in d)d.hasOwnProperty(f)&&(e=d[f]);if(h){var i=d.grid.datatype;d.grid.datatype="xmlstring",d.grid.datastr=a,$(c).jqGrid(e).jqGrid("setGridParam",{datatype:i})}else setTimeout(function(){$(c).jqGrid(e)},0)}else alert("xml2json or parse are not present")},e=function(a,b){if(a&&"string"==typeof a){var d=$.jgrid.parseFunc(a),e=d[b.jsonGrid.config],f=d[b.jsonGrid.data];if(f){var g=e.datatype;e.datatype="jsonstring",e.datastr=f,$(c).jqGrid(e).jqGrid("setGridParam",{datatype:g})}else $(c).jqGrid(e)}};switch(b.imptype){case"xml":$.ajax($.extend({url:b.impurl,type:b.mtype,data:b.impData,dataType:"xml",complete:function(a,e){"success"===e&&(d(a.responseXML,b),$(c).triggerHandler("jqGridImportComplete",[a,b]),$.isFunction(b.importComplete)&&b.importComplete(a)),a=null}},b.ajaxOptions));break;case"xmlstring":if(b.impstring&&"string"==typeof b.impstring){var f=$.parseXML(b.impstring);f&&(d(f,b),$(c).triggerHandler("jqGridImportComplete",[f,b]),$.isFunction(b.importComplete)&&b.importComplete(f))}break;case"json":$.ajax($.extend({url:b.impurl,type:b.mtype,data:b.impData,dataType:"json",complete:function(a){try{e(a.responseText,b),$(c).triggerHandler("jqGridImportComplete",[a,b]),$.isFunction(b.importComplete)&&b.importComplete(a)}catch(a){}a=null}},b.ajaxOptions));break;case"jsonstring":b.impstring&&"string"==typeof b.impstring&&(e(b.impstring,b),$(c).triggerHandler("jqGridImportComplete",[b.impstring,b]),$.isFunction(b.importComplete)&&b.importComplete(b.impstring))}}}),$.jgrid.extend({jqGridExport:function(a){a=$.extend({exptype:"xmlstring",root:"grid",ident:"\t",addOptions:{},data:!0},a||{});var b=null;return this.each(function(){if(this.grid){var c=$.extend(!0,{},$(this).jqGrid("getGridParam"),a.addOptions);switch(c.rownumbers&&(c.colNames.splice(0,1),c.colModel.splice(0,1)),c.multiselect&&(c.colNames.splice(0,1),c.colModel.splice(0,1)),c.subGrid&&(c.colNames.splice(0,1),c.colModel.splice(0,1)),c.knv=null,a.data||(c.data=[],c._index={}),a.exptype){case"xmlstring":b="<"+a.root+">"+$.jgrid.jsonToXML(c,{xmlDecl:""})+"</"+a.root+">";break;case"jsonstring":b=$.jgrid.stringify(c),a.root&&(b="{"+a.root+":"+b+"}")}}}),b},excelExport:function(a){return a=$.extend({exptype:"remote",url:null,oper:"oper",tag:"excel",beforeExport:null,exporthidden:!1,exportgrouping:!1,exportOptions:{}},a||{}),this.each(function(){if(this.grid){var b;if("remote"===a.exptype){var c,d=$.extend({},this.p.postData);if(d[a.oper]=a.tag,$.isFunction(a.beforeExport)){var e=a.beforeExport.call(this,d);$.isPlainObject(e)&&(d=e)}if(a.exporthidden){var f,g=this.p.colModel,h=g.length,i=[];for(f=0;f<h;f++)void 0===g[f].hidden&&(g[f].hidden=!1),i.push({name:g[f].name,hidden:g[f].hidden});var j=JSON.stringify(i);"string"==typeof j&&(d.colModel=j)}a.exportgrouping&&"string"==typeof(c=JSON.stringify(this.p.groupingView))&&(d.groupingView=c);var k=jQuery.param(d);b=-1!==a.url.indexOf("?")?a.url+"&"+k:a.url+"?"+k,window.location=b}}})}}),$.jgrid.inlineEdit=$.jgrid.inlineEdit||{},$.jgrid.extend({editRow:function(a,b,c,d,e,f,g,h,i){var j={},k=$.makeArray(arguments).slice(1),l=this[0];return"object"===$.type(k[0])?j=k[0]:(void 0!==b&&(j.keys=b),$.isFunction(c)&&(j.oneditfunc=c),$.isFunction(d)&&(j.successfunc=d),void 0!==e&&(j.url=e),void 0!==f&&(j.extraparam=f),$.isFunction(g)&&(j.aftersavefunc=g),$.isFunction(h)&&(j.errorfunc=h),$.isFunction(i)&&(j.afterrestorefunc=i)),j=$.extend(!0,{keys:!1,keyevent:"keydown",onEnter:null,onEscape:null,oneditfunc:null,successfunc:null,url:null,extraparam:{},aftersavefunc:null,errorfunc:null,afterrestorefunc:null,restoreAfterError:!0,mtype:"POST",focusField:!0,saveui:"enable",savetext:$.jgrid.getRegional(l,"defaults.savetext")},$.jgrid.inlineEdit,j),this.each(function(){var b,c,d,e,f,g,h=0,i=null,k={},m=$(this).jqGrid("getStyleUI",l.p.styleUI+".inlinedit","inputClass",!0);if(l.grid&&!1!==(e=$(l).jqGrid("getInd",a,!0))){if(l.p.beforeAction=!0,g=$.isFunction(j.beforeEditRow)?j.beforeEditRow.call(l,j,a):void 0,void 0===g&&(g=!0),!g)return void(l.p.beforeAction=!1);d=$(e).attr("editable")||"0","0"!==d||$(e).hasClass("not-editable-row")||(f=l.p.colModel,$('td[role="gridcell"]',e).each(function(d){b=f[d].name;var e=!0===l.p.treeGrid&&b===l.p.ExpandColumn;if(e)c=$("span:first",this).html();else try{c=$.unformat.call(l,this,{rowId:a,colModel:f[d]},d)}catch(a){c=f[d].edittype&&"textarea"===f[d].edittype?$(this).text():$(this).html()}if("cb"!==b&&"subgrid"!==b&&"rn"!==b&&(l.p.autoencode&&(c=$.jgrid.htmlDecode(c)),k[b]=c,!0===f[d].editable)){null===i&&(i=d),e?$("span:first",this).html(""):$(this).html("");var g=$.extend({},f[d].editoptions||{},{id:a+"_"+b,name:b,rowId:a,oper:"edit"});f[d].edittype||(f[d].edittype="text"),("&nbsp;"===c||"&#160;"===c||1===c.length&&160===c.charCodeAt(0))&&(c="");var j=$.jgrid.createEl.call(l,f[d].edittype,g,c,!0,$.extend({},$.jgrid.ajaxOptions,l.p.ajaxSelectOptions||{}));$(j).addClass("editable inline-edit-cell"),$.inArray(f[d].edittype,["text","textarea","password","select"])>-1&&$(j).addClass(m),e?$("span:first",this).append(j):$(this).append(j),$.jgrid.bindEv.call(l,j,g),"select"===f[d].edittype&&void 0!==f[d].editoptions&&!0===f[d].editoptions.multiple&&void 0===f[d].editoptions.dataUrl&&$.jgrid.msie()&&$(j).width($(j).width()),h++}}),h>0&&(k.id=a,l.p.savedRow.push(k),$(e).attr("editable","1"),j.focusField&&("number"==typeof j.focusField&&parseInt(j.focusField,10)<=f.length&&(i=j.focusField),setTimeout(function(){var a=$("td:eq("+i+") :input:visible",e).not(":disabled");a.length>0&&a.focus()},0)),!0===j.keys&&$(e).on(j.keyevent,function(b){if(27===b.keyCode){if($.isFunction(j.onEscape))return j.onEscape.call(l,a,j,b),!0;if($(l).jqGrid("restoreRow",a,j),l.p.inlineNav)try{$(l).jqGrid("showAddEditButtons")}catch(a){}return!1}if(13===b.keyCode){if("TEXTAREA"===b.target.tagName)return!0;if($.isFunction(j.onEnter))return j.onEnter.call(l,a,j,b),!0;if($(l).jqGrid("saveRow",a,j)&&l.p.inlineNav)try{$(l).jqGrid("showAddEditButtons")}catch(a){}return!1}}),$(l).triggerHandler("jqGridInlineEditRow",[a,j]),$.isFunction(j.oneditfunc)&&j.oneditfunc.call(l,a)))}})},saveRow:function(a,b,c,d,e,f,g){var h=$.makeArray(arguments).slice(1),i={},j=this[0];"object"===$.type(h[0])?i=h[0]:($.isFunction(b)&&(i.successfunc=b),void 0!==c&&(i.url=c),void 0!==d&&(i.extraparam=d),$.isFunction(e)&&(i.aftersavefunc=e),$.isFunction(f)&&(i.errorfunc=f),$.isFunction(g)&&(i.afterrestorefunc=g)),i=$.extend(!0,{successfunc:null,url:null,extraparam:{},aftersavefunc:null,errorfunc:null,afterrestorefunc:null,restoreAfterError:!0,mtype:"POST",saveui:"enable",savetext:$.jgrid.getRegional(j,"defaults.savetext")},$.jgrid.inlineEdit,i);var k,l,m,n,o,p=!1,q={},r={},s={},t=!1,u=$.trim($(j).jqGrid("getStyleUI",j.p.styleUI+".common","error",!0));if(!j.grid)return p;if(!1===(o=$(j).jqGrid("getInd",a,!0)))return p;var v=$.jgrid.getRegional(j,"errors"),w=$.jgrid.getRegional(j,"edit"),x=$.isFunction(i.beforeSaveRow)?i.beforeSaveRow.call(j,i,a):void 0;if(void 0===x&&(x=!0),x){if(l=$(o).attr("editable"),i.url=i.url||j.p.editurl,"1"===l){var y,z,A;if($('td[role="gridcell"]',o).each(function(a){if(y=j.p.colModel[a],k=y.name,A="","cb"!==k&&"subgrid"!==k&&!0===y.editable&&"rn"!==k&&!$(this).hasClass("not-editable-cell")){switch(y.edittype){case"checkbox":var b=["Yes","No"];y.editoptions&&y.editoptions.value&&(b=y.editoptions.value.split(":")),q[k]=$("input",this).is(":checked")?b[0]:b[1],A=$("input",this);break;case"text":case"password":case"textarea":case"button":q[k]=$("input, textarea",this).val(),A=$("input, textarea",this);break;case"select":if(y.editoptions.multiple){var c=$("select",this),d=[];q[k]=$(c).val(),q[k]?q[k]=q[k].join(","):q[k]="",$("select option:selected",this).each(function(a,b){d[a]=$(b).text()}),r[k]=d.join(",")}else q[k]=$("select option:selected",this).val(),r[k]=$("select option:selected",this).text();y.formatter&&"select"===y.formatter&&(r={}),A=$("select",this);break;case"custom":try{if(!y.editoptions||!$.isFunction(y.editoptions.custom_value))throw"e1";if(q[k]=y.editoptions.custom_value.call(j,$(".customelement",this),"get"),void 0===q[k])throw"e2"}catch(a){"e1"===a?$.jgrid.info_dialog(v.errcap,"function 'custom_value' "+w.msg.nodefined,w.bClose,{styleUI:j.p.styleUI}):$.jgrid.info_dialog(v.errcap,a.message,w.bClose,{styleUI:j.p.styleUI})}}if(n=$.jgrid.checkValues.call(j,q[k],a),!1===n[0])return z=a,!1;j.p.autoencode&&(q[k]=$.jgrid.htmlEncode(q[k])),"clientArray"!==i.url&&y.editoptions&&!0===y.editoptions.NullIfEmpty&&""===q[k]&&(s[k]="null",t=!0)}}),!1===n[0]){try{if($.isFunction(j.p.validationCell))j.p.validationCell.call(j,A,n[1],o.rowIndex,z);else{var B=$(j).jqGrid("getGridRowById",a),C=$.jgrid.findPos(B);$.jgrid.info_dialog(v.errcap,n[1],w.bClose,{left:C[0],top:C[1]+$(B).outerHeight(),styleUI:j.p.styleUI,onClose:function(){z>=0&&$("#"+a+"_"+j.p.colModel[z].name).focus()}})}}catch(a){alert(n[1])}return p}var D,E=j.p.prmNames,F=a;if(D=!1===j.p.keyName?E.id:j.p.keyName,q){if(q[E.oper]=E.editoper,void 0===q[D]||""===q[D])q[D]=a;else if(o.id!==j.p.idPrefix+q[D]){var G=$.jgrid.stripPref(j.p.idPrefix,a);if(void 0!==j.p._index[G]&&(j.p._index[q[D]]=j.p._index[G],delete j.p._index[G]),a=j.p.idPrefix+q[D],$(o).attr("id",a),j.p.selrow===F&&(j.p.selrow=a),$.isArray(j.p.selarrrow)){var H=$.inArray(F,j.p.selarrrow);H>=0&&(j.p.selarrrow[H]=a)}if(j.p.multiselect){var I="jqg_"+j.p.id+"_"+a;$("input.cbox",o).attr("id",I).attr("name",I)}}void 0===j.p.inlineData&&(j.p.inlineData={}),q=$.extend({},q,j.p.inlineData,i.extraparam)}if("clientArray"===i.url){q=$.extend({},q,r),j.p.autoencode&&$.each(q,function(a,b){q[a]=$.jgrid.htmlDecode(b)});var J,K=$(j).jqGrid("setRowData",a,q);for($(o).attr("editable","0"),J=0;J<j.p.savedRow.length;J++)if(String(j.p.savedRow[J].id)===String(F)){m=J;break}$(j).triggerHandler("jqGridInlineAfterSaveRow",[a,K,q,i]),$.isFunction(i.aftersavefunc)&&i.aftersavefunc.call(j,a,K,q,i),m>=0&&j.p.savedRow.splice(m,1),p=!0,$(o).removeClass("jqgrid-new-row").off("keydown")}else $(j).jqGrid("progressBar",{method:"show",loadtype:i.saveui,htmlcontent:i.savetext}),
s=$.extend({},q,s),s[D]=$.jgrid.stripPref(j.p.idPrefix,s[D]),$.ajax($.extend({url:i.url,data:$.isFunction(j.p.serializeRowData)?j.p.serializeRowData.call(j,s):s,type:i.mtype,async:!1,complete:function(b,c){if($(j).jqGrid("progressBar",{method:"hide",loadtype:i.saveui,htmlcontent:i.savetext}),"success"===c){var d,e,f=!0;if(d=$(j).triggerHandler("jqGridInlineSuccessSaveRow",[b,a,i]),$.isArray(d)||(d=[!0,s]),d[0]&&$.isFunction(i.successfunc)&&(d=i.successfunc.call(j,b)),$.isArray(d)?(f=d[0],q=d[1]||q):f=d,!0===f){for(j.p.autoencode&&$.each(q,function(a,b){q[a]=$.jgrid.htmlDecode(b)}),t&&$.each(q,function(a){"null"===q[a]&&(q[a]="")}),q=$.extend({},q,r),$(j).jqGrid("setRowData",a,q),$(o).attr("editable","0"),e=0;e<j.p.savedRow.length;e++)if(String(j.p.savedRow[e].id)===String(a)){m=e;break}$(j).triggerHandler("jqGridInlineAfterSaveRow",[a,b,q,i]),$.isFunction(i.aftersavefunc)&&i.aftersavefunc.call(j,a,b,q,i),m>=0&&j.p.savedRow.splice(m,1),p=!0,$(o).removeClass("jqgrid-new-row").off("keydown")}else $(j).triggerHandler("jqGridInlineErrorSaveRow",[a,b,c,null,i]),$.isFunction(i.errorfunc)&&i.errorfunc.call(j,a,b,c,null),!0===i.restoreAfterError&&$(j).jqGrid("restoreRow",a,i)}},error:function(b,c,d){if($("#lui_"+$.jgrid.jqID(j.p.id)).hide(),$(j).triggerHandler("jqGridInlineErrorSaveRow",[a,b,c,d,i]),$.isFunction(i.errorfunc))i.errorfunc.call(j,a,b,c,d);else{var e=b.responseText||b.statusText;try{$.jgrid.info_dialog(v.errcap,'<div class="'+u+'">'+e+"</div>",w.bClose,{buttonalign:"right",styleUI:j.p.styleUI})}catch(a){alert(e)}}!0===i.restoreAfterError&&$(j).jqGrid("restoreRow",a,i)}},$.jgrid.ajaxOptions,j.p.ajaxRowOptions||{}))}return p}},restoreRow:function(a,b){var c=$.makeArray(arguments).slice(1),d={};return"object"===$.type(c[0])?d=c[0]:$.isFunction(b)&&(d.afterrestorefunc=b),d=$.extend(!0,{},$.jgrid.inlineEdit,d),this.each(function(){var b,c,e=this,f=-1,g={};if(e.grid&&!1!==(b=$(e).jqGrid("getInd",a,!0))){var h=$.isFunction(d.beforeCancelRow)?d.beforeCancelRow.call(e,d,a):void 0;if(void 0===h&&(h=!0),h){for(c=0;c<e.p.savedRow.length;c++)if(String(e.p.savedRow[c].id)===String(a)){f=c;break}if(f>=0){if($.isFunction($.fn.datepicker))try{$("input.hasDatepicker","#"+$.jgrid.jqID(b.id)).datepicker("hide")}catch(a){}$.each(e.p.colModel,function(){e.p.savedRow[f].hasOwnProperty(this.name)&&(g[this.name]=e.p.savedRow[f][this.name])}),$(e).jqGrid("setRowData",a,g),$(b).attr("editable","0").off("keydown"),e.p.savedRow.splice(f,1),$("#"+$.jgrid.jqID(a),"#"+$.jgrid.jqID(e.p.id)).hasClass("jqgrid-new-row")&&setTimeout(function(){$(e).jqGrid("delRowData",a),$(e).jqGrid("showAddEditButtons")},0)}$(e).triggerHandler("jqGridInlineAfterRestoreRow",[a]),$.isFunction(d.afterrestorefunc)&&d.afterrestorefunc.call(e,a)}}})},addRow:function(a){return a=$.extend(!0,{rowID:null,initdata:{},position:"first",useDefValues:!0,useFormatter:!1,addRowParams:{extraparam:{}}},a||{}),this.each(function(){if(this.grid){var b=this;b.p.beforeAction=!0;var c=$.isFunction(a.beforeAddRow)?a.beforeAddRow.call(b,a.addRowParams):void 0;if(void 0===c&&(c=!0),!c)return void(b.p.beforeAction=!1);if(a.rowID=$.isFunction(a.rowID)?a.rowID.call(b,a):null!=a.rowID?a.rowID:$.jgrid.randId(),!0===a.useDefValues&&$(b.p.colModel).each(function(){if(this.editoptions&&this.editoptions.defaultValue){var c=this.editoptions.defaultValue,d=$.isFunction(c)?c.call(b):c;a.initdata[this.name]=d}}),$(b).jqGrid("addRowData",a.rowID,a.initdata,a.position),a.rowID=b.p.idPrefix+a.rowID,$("#"+$.jgrid.jqID(a.rowID),"#"+$.jgrid.jqID(b.p.id)).addClass("jqgrid-new-row"),a.useFormatter)$("#"+$.jgrid.jqID(a.rowID)+" .ui-inline-edit","#"+$.jgrid.jqID(b.p.id)).click();else{var d=b.p.prmNames,e=d.oper;a.addRowParams.extraparam[e]=d.addoper,$(b).jqGrid("editRow",a.rowID,a.addRowParams),$(b).jqGrid("setSelection",a.rowID)}}})},inlineNav:function(a,b){var c=this[0],d=$.jgrid.getRegional(c,"nav"),e=$.jgrid.styleUI[c.p.styleUI].inlinedit;return b=$.extend(!0,{edit:!0,editicon:e.icon_edit_nav,add:!0,addicon:e.icon_add_nav,save:!0,saveicon:e.icon_save_nav,cancel:!0,cancelicon:e.icon_cancel_nav,addParams:{addRowParams:{extraparam:{}}},editParams:{},restoreAfterSelect:!0,saveAfterSelect:!1},d,b||{}),this.each(function(){if(this.grid&&!this.p.inlineNav){var e=$.jgrid.jqID(c.p.id),f=$.trim($(c).jqGrid("getStyleUI",c.p.styleUI+".common","disabled",!0));if(c.p.navGrid||$(c).jqGrid("navGrid",a,{refresh:!1,edit:!1,add:!1,del:!1,search:!1,view:!1}),$(c).data("inlineNav")||$(c).data("inlineNav",b),c.p.force_regional&&(b=$.extend(b,d)),c.p.inlineNav=!0,!0===b.addParams.useFormatter){var g,h=c.p.colModel;for(g=0;g<h.length;g++)if(h[g].formatter&&"actions"===h[g].formatter){if(h[g].formatoptions){var i={keys:!1,onEdit:null,onSuccess:null,afterSave:null,onError:null,afterRestore:null,extraparam:{},url:null},j=$.extend(i,h[g].formatoptions);b.addParams.addRowParams={keys:j.keys,oneditfunc:j.onEdit,successfunc:j.onSuccess,url:j.url,extraparam:j.extraparam,aftersavefunc:j.afterSave,errorfunc:j.onError,afterrestorefunc:j.afterRestore}}break}}b.add&&$(c).jqGrid("navButtonAdd",a,{caption:b.addtext,title:b.addtitle,buttonicon:b.addicon,id:c.p.id+"_iladd",internal:!0,onClickButton:function(){void 0===c.p.beforeAction&&(c.p.beforeAction=!0),$(c).jqGrid("addRow",b.addParams),!b.addParams.useFormatter&&c.p.beforeAction&&($("#"+e+"_ilsave").removeClass(f),$("#"+e+"_ilcancel").removeClass(f),$("#"+e+"_iladd").addClass(f),$("#"+e+"_iledit").addClass(f))}}),b.edit&&$(c).jqGrid("navButtonAdd",a,{caption:b.edittext,title:b.edittitle,buttonicon:b.editicon,id:c.p.id+"_iledit",internal:!0,onClickButton:function(){var a=$(c).jqGrid("getGridParam","selrow");a?(void 0===c.p.beforeAction&&(c.p.beforeAction=!0),$(c).jqGrid("editRow",a,b.editParams),c.p.beforeAction&&($("#"+e+"_ilsave").removeClass(f),$("#"+e+"_ilcancel").removeClass(f),$("#"+e+"_iladd").addClass(f),$("#"+e+"_iledit").addClass(f))):($.jgrid.viewModal("#alertmod_"+e,{gbox:"#gbox_"+e,jqm:!0}),$("#jqg_alrt").focus())}}),b.save&&($(c).jqGrid("navButtonAdd",a,{caption:b.savetext||"",title:b.savetitle||"Save row",buttonicon:b.saveicon,id:c.p.id+"_ilsave",internal:!0,onClickButton:function(){var a=c.p.savedRow[0].id;if(a){var d=c.p.prmNames,f=d.oper,g=b.editParams;$("#"+$.jgrid.jqID(a),"#"+e).hasClass("jqgrid-new-row")?(b.addParams.addRowParams.extraparam[f]=d.addoper,g=b.addParams.addRowParams):(b.editParams.extraparam||(b.editParams.extraparam={}),b.editParams.extraparam[f]=d.editoper),$(c).jqGrid("saveRow",a,g)&&$(c).jqGrid("showAddEditButtons")}else $.jgrid.viewModal("#alertmod_"+e,{gbox:"#gbox_"+e,jqm:!0}),$("#jqg_alrt").focus()}}),$("#"+e+"_ilsave").addClass(f)),b.cancel&&($(c).jqGrid("navButtonAdd",a,{caption:b.canceltext||"",title:b.canceltitle||"Cancel row editing",buttonicon:b.cancelicon,id:c.p.id+"_ilcancel",internal:!0,onClickButton:function(){var a=c.p.savedRow[0].id,d=b.editParams;a?($("#"+$.jgrid.jqID(a),"#"+e).hasClass("jqgrid-new-row")&&(d=b.addParams.addRowParams),$(c).jqGrid("restoreRow",a,d),$(c).jqGrid("showAddEditButtons")):($.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+e,jqm:!0}),$("#jqg_alrt").focus())}}),$("#"+e+"_ilcancel").addClass(f)),!0!==b.restoreAfterSelect&&!0!==b.saveAfterSelect||$(c).on("jqGridBeforeSelectRow.inlineNav",function(a,d){if(c.p.savedRow.length>0&&!0===c.p.inlineNav&&d!==c.p.selrow&&null!==c.p.selrow){var e=!0;c.p.selrow===b.addParams.rowID?$(c).jqGrid("delRowData",c.p.selrow):!0===b.restoreAfterSelect?$(c).jqGrid("restoreRow",c.p.selrow,b.editParams):e=$(c).jqGrid("saveRow",c.p.selrow,b.editParams),e&&$(c).jqGrid("showAddEditButtons")}})}})},showAddEditButtons:function(){return this.each(function(){if(this.grid){var a=$.jgrid.jqID(this.p.id),b=$.trim($(this).jqGrid("getStyleUI",this.p.styleUI+".common","disabled",!0));$("#"+a+"_ilsave").addClass(b),$("#"+a+"_ilcancel").addClass(b),$("#"+a+"_iladd").removeClass(b),$("#"+a+"_iledit").removeClass(b)}})},showSaveCancelButtons:function(){return this.each(function(){if(this.grid){var a=$.jgrid.jqID(this.p.id),b=$.trim($(this).jqGrid("getStyleUI",this.p.styleUI+".common","disabled",!0));$("#"+a+"_ilsave").removeClass(b),$("#"+a+"_ilcancel").removeClass(b),$("#"+a+"_iladd").addClass(b),$("#"+a+"_iledit").addClass(b)}})}}),$.jgrid.msie()&&8===$.jgrid.msiever()&&($.expr[":"].hidden=function(a){return 0===a.offsetWidth||0===a.offsetHeight||"none"===a.style.display}),$.jgrid._multiselect=!1,$.ui&&$.ui.multiselect){if($.ui.multiselect.prototype._setSelected){var setSelected=$.ui.multiselect.prototype._setSelected;$.ui.multiselect.prototype._setSelected=function(a,b){var c=setSelected.call(this,a,b);if(b&&this.selectedList){var d=this.element;this.selectedList.find("li").each(function(){$(this).data("optionLink")&&$(this).data("optionLink").remove().appendTo(d)})}return c}}$.ui.multiselect.prototype.destroy&&($.ui.multiselect.prototype.destroy=function(){this.element.show(),this.container.remove(),void 0===$.Widget?$.widget.prototype.destroy.apply(this,arguments):$.Widget.prototype.destroy.apply(this,arguments)}),$.jgrid._multiselect=!0}$.jgrid.extend({sortableColumns:function(a){return this.each(function(){function b(){d.p.disableClick=!0,d.p.frozenColumns&&($(d).jqGrid("destroyFrozenColumns"),f=!0)}function c(){setTimeout(function(){d.p.disableClick=!1,f&&($(d).jqGrid("setFrozenColumns"),f=!1)},50)}var d=this,e=$.jgrid.jqID(d.p.id),f=!1,g={tolerance:"pointer",axis:"x",scrollSensitivity:"1",items:">th:not(:has(#jqgh_"+e+"_cb,#jqgh_"+e+"_rn,#jqgh_"+e+"_subgrid),:hidden)",placeholder:{element:function(a){return $(document.createElement(a[0].nodeName)).addClass(a[0].className+" ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0]},update:function(a,b){b.height(a.currentItem.innerHeight()-parseInt(a.currentItem.css("paddingTop")||0,10)-parseInt(a.currentItem.css("paddingBottom")||0,10)),b.width(a.currentItem.innerWidth()-parseInt(a.currentItem.css("paddingLeft")||0,10)-parseInt(a.currentItem.css("paddingRight")||0,10))}},update:function(a,b){var c=$(b.item).parent(),e=$(">th",c),f=d.p.colModel,g={},h=d.p.id+"_";$.each(f,function(a){g[this.name]=a});var i=[];e.each(function(){var a=$(">div",this).get(0).id.replace(/^jqgh_/,"").replace(h,"");g.hasOwnProperty(a)&&i.push(g[a])}),$(d).jqGrid("remapColumns",i,!0,!0),$.isFunction(d.p.sortable.update)&&d.p.sortable.update(i)}};if(d.p.sortable.options?$.extend(g,d.p.sortable.options):$.isFunction(d.p.sortable)&&(d.p.sortable={update:d.p.sortable}),g.start){var h=g.start;g.start=function(a,c){b(),h.call(this,a,c)}}else g.start=b;if(g.stop){var i=g.stop;g.stop=function(a,b){c(),i.call(this,a,b)}}else g.stop=c;d.p.sortable.exclude&&(g.items+=":not("+d.p.sortable.exclude+")");var j=a.sortable(g),k=j.data("sortable")||j.data("uiSortable");null!=k&&(k.data("sortable").floating=!0)})},columnChooser:function(a){function b(a,b,c){var d,e;return b>=0?(d=a.slice(),e=d.splice(b,Math.max(a.length-b,b)),b>a.length&&(b=a.length),d[b]=c,d.concat(e)):a}function c(a,b){a&&("string"==typeof a?$.fn[a]&&$.fn[a].apply(b,$.makeArray(arguments).slice(2)):$.isFunction(a)&&a.apply(b,$.makeArray(arguments).slice(2)))}function d(){var a=q(f),b=a.container.closest(".ui-dialog-content");b.length>0&&"object"==typeof b[0].style?b[0].style.width="":b.css("width",""),a.selectedList.height(Math.max(a.selectedContainer.height()-a.selectedActions.outerHeight()-1,1)),a.availableList.height(Math.max(a.availableContainer.height()-a.availableActions.outerHeight()-1,1))}var e,f,g,h,i,j,k,l=this,m={},n=[],o=l.jqGrid("getGridParam","colModel"),p=l.jqGrid("getGridParam","colNames"),q=function(a){return $.ui.multiselect.prototype&&a.data($.ui.multiselect.prototype.widgetFullName||$.ui.multiselect.prototype.widgetName)||a.data("ui-multiselect")||a.data("multiselect")},r=$.jgrid.getRegional(this[0],"col");if(!$("#colchooser_"+$.jgrid.jqID(l[0].p.id)).length){if(e=$('<div id="colchooser_'+l[0].p.id+'" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>'),f=$("select",e),a=$.extend({width:400,height:240,classname:null,done:function(a){a&&l.jqGrid("remapColumns",a,!0)},msel:"multiselect",dlog:"dialog",dialog_opts:{minWidth:470,dialogClass:"ui-jqdialog"},dlog_opts:function(a){var b={};return b[a.bSubmit]=function(){a.apply_perm(),a.cleanup(!1)},b[a.bCancel]=function(){a.cleanup(!0)},$.extend(!0,{buttons:b,close:function(){a.cleanup(!0)},modal:a.modal||!1,resizable:a.resizable||!0,width:a.width+70,resize:d},a.dialog_opts||{})},apply_perm:function(){var c=[];$("option",f).each(function(){$(this).is(":selected")?l.jqGrid("showCol",o[this.value].name):l.jqGrid("hideCol",o[this.value].name)}),$("option[selected]",f).each(function(){c.push(parseInt(this.value,10))}),$.each(c,function(){delete m[o[parseInt(this,10)].name]}),$.each(m,function(){var a=parseInt(this,10);c=b(c,a,a)}),a.done&&a.done.call(l,c),l.jqGrid("setGridWidth",l[0].p.width,l[0].p.shrinkToFit)},cleanup:function(b){c(a.dlog,e,"destroy"),c(a.msel,f,"destroy"),e.remove(),b&&a.done&&a.done.call(l)},msel_opts:{}},r,a||{}),$.ui&&$.ui.multiselect&&$.ui.multiselect.defaults){if(!$.jgrid._multiselect)return void alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");a.msel_opts=$.extend($.ui.multiselect.defaults,a.msel_opts)}a.caption&&e.attr("title",a.caption),a.classname&&(e.addClass(a.classname),f.addClass(a.classname)),a.width&&($(">div",e).css({width:a.width,margin:"0 auto"}),f.css("width",a.width)),a.height&&($(">div",e).css("height",a.height),f.css("height",a.height-10)),f.empty(),$.each(o,function(a){if(m[this.name]=a,this.hidedlg)return void(this.hidden||n.push(a));f.append("<option value='"+a+"' "+(this.hidden?"":"selected='selected'")+">"+$.jgrid.stripHtml(p[a])+"</option>")}),g=$.isFunction(a.dlog_opts)?a.dlog_opts.call(l,a):a.dlog_opts,c(a.dlog,e,g),h=$.isFunction(a.msel_opts)?a.msel_opts.call(l,a):a.msel_opts,c(a.msel,f,h),i=$("#colchooser_"+$.jgrid.jqID(l[0].p.id));var s=$(".ui-jqgrid").css("font-size")||"11px";i.parent().css("font-size",s),i.css({margin:"auto"}),i.find(">div").css({width:"100%",height:"100%",margin:"auto"}),j=q(f),j.container.css({width:"100%",height:"100%",margin:"auto"}),j.selectedContainer.css({width:100*j.options.dividerLocation+"%",height:"100%",margin:"auto",boxSizing:"border-box"}),j.availableContainer.css({width:100-100*j.options.dividerLocation+"%",height:"100%",margin:"auto",boxSizing:"border-box"}),j.selectedList.css("height","auto"),j.availableList.css("height","auto"),k=Math.max(j.selectedList.height(),j.availableList.height()),k=Math.min(k,$(window).height()),j.selectedList.css("height",k),j.availableList.css("height",k),d()}},sortableRows:function(a){return this.each(function(){var b=this;b.grid&&(b.p.treeGrid||$.fn.sortable&&(a=$.extend({cursor:"move",axis:"y",items:" > .jqgrow"},a||{}),a.start&&$.isFunction(a.start)?(a._start_=a.start,delete a.start):a._start_=!1,a.update&&$.isFunction(a.update)?(a._update_=a.update,delete a.update):a._update_=!1,a.start=function(c,d){if($(d.item).css("border-width","0"),$("td",d.item).each(function(a){this.style.width=b.grid.cols[a].style.width}),b.p.subGrid){var e=$(d.item).attr("id");try{$(b).jqGrid("collapseSubGridRow",e)}catch(a){}}a._start_&&a._start_.apply(this,[c,d])},a.update=function(c,d){$(d.item).css("border-width",""),!0===b.p.rownumbers&&$("td.jqgrid-rownum",b.rows).each(function(a){$(this).html(a+1+(parseInt(b.p.page,10)-1)*parseInt(b.p.rowNum,10))}),a._update_&&a._update_.apply(this,[c,d])},$("tbody:first",b).sortable(a),$("tbody:first > .jqgrow",b).disableSelection()))})},gridDnD:function(a){return this.each(function(){function b(){var a=$.data(e,"dnd");$("tr.jqgrow:not(.ui-draggable)",e).draggable($.isFunction(a.drag)?a.drag.call($(e),a):a.drag)}var c,d,e=this;if(e.grid&&!e.p.treeGrid&&$.fn.draggable&&$.fn.droppable){if(void 0===$("#jqgrid_dnd")[0]&&$("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>"),"string"==typeof a&&"updateDnD"===a&&!0===e.p.jqgdnd)return void b();var f;if(a=$.extend({drag:function(a){return $.extend({start:function(b,c){var d,f;if(e.p.subGrid){f=$(c.helper).attr("id");try{$(e).jqGrid("collapseSubGridRow",f)}catch(a){}}for(d=0;d<$.data(e,"dnd").connectWith.length;d++)0===$($.data(e,"dnd").connectWith[d]).jqGrid("getGridParam","reccount")&&$($.data(e,"dnd").connectWith[d]).jqGrid("addRowData","jqg_empty_row",{});c.helper.addClass("ui-state-highlight"),$("td",c.helper).each(function(a){this.style.width=e.grid.headers[a].width+"px"}),a.onstart&&$.isFunction(a.onstart)&&a.onstart.call($(e),b,c)},stop:function(b,c){var d,f;for(c.helper.dropped&&!a.dragcopy&&(f=$(c.helper).attr("id"),void 0===f&&(f=$(this).attr("id")),$(e).jqGrid("delRowData",f)),d=0;d<$.data(e,"dnd").connectWith.length;d++)$($.data(e,"dnd").connectWith[d]).jqGrid("delRowData","jqg_empty_row");a.onstop&&$.isFunction(a.onstop)&&a.onstop.call($(e),b,c)}},a.drag_opts||{})},drop:function(a){return $.extend({accept:function(a){if(!$(a).hasClass("jqgrow"))return a;f=$(a).closest("table.ui-jqgrid-btable");var b=$(this).find("table.ui-jqgrid-btable:first")[0];if(f.length>0&&void 0!==$.data(f[0],"dnd")){var c=$.data(f[0],"dnd").connectWith;return-1!==$.inArray("#"+$.jgrid.jqID(b.id),c)}return!1},drop:function(b,c){if($(c.draggable).hasClass("jqgrow")){var d=$(c.draggable).attr("id"),e=c.draggable.parent().parent().jqGrid("getRowData",d),g=[],h=$(this).find("table.ui-jqgrid-btable:first")[0];if($.isPlainObject(e)&&(g=Object.keys(e)),!a.dropbyname){var i,j,k={},l=0,m=$("#"+$.jgrid.jqID(h.id)).jqGrid("getGridParam","colModel");try{for(i=0;i<m.length;i++)"cb"!==(j=m[i].name)&&"rn"!==j&&"subgrid"!==j&&(void 0!==g[l]&&(k[j]=e[g[l]]),l++);e=k}catch(a){}}if(c.helper.dropped=!0,$.data(f[0],"dnd").beforedrop&&$.isFunction($.data(f[0],"dnd").beforedrop)){var n=$.data(f[0],"dnd").beforedrop.call(h,b,c,e,$(f[0]),$(h));void 0!==n&&null!==n&&"object"==typeof n&&(e=n)}if(c.helper.dropped){var o;a.autoid&&($.isFunction(a.autoid)?o=a.autoid.call(h,e):(o=Math.ceil(1e3*Math.random()),o=a.autoidprefix+o)),$("#"+$.jgrid.jqID(h.id)).jqGrid("addRowData",o,e,a.droppos)}a.ondrop&&$.isFunction(a.ondrop)&&a.ondrop.call(h,b,c,e)}}},a.drop_opts||{})},onstart:null,onstop:null,beforedrop:null,ondrop:null,drop_opts:{activeClass:"ui-state-active",hoverClass:"ui-state-hover",tolerance:"intersect"},drag_opts:{revert:"invalid",helper:"clone",cursor:"move",appendTo:"#jqgrid_dnd",zIndex:5e3},dragcopy:!1,dropbyname:!1,droppos:"first",autoid:!0,autoidprefix:"dnd_"},a||{}),a.connectWith)for(a.connectWith=a.connectWith.split(","),a.connectWith=$.map(a.connectWith,function(a){return $.trim(a)}),$.data(e,"dnd",a),0===e.p.reccount||e.p.jqgdnd||b(),e.p.jqgdnd=!0,c=0;c<a.connectWith.length;c++)d=a.connectWith[c],$(d).closest(".ui-jqgrid-bdiv").droppable($.isFunction(a.drop)?a.drop.call($(e),a):a.drop)}})},gridResize:function(opts){return this.each(function(){var $t=this,gID=$.jgrid.jqID($t.p.id),req;if($t.grid&&$.fn.resizable){if(opts=$.extend({},opts||{}),opts.alsoResize?(opts._alsoResize_=opts.alsoResize,delete opts.alsoResize):opts._alsoResize_=!1,opts.stop&&$.isFunction(opts.stop)?(opts._stop_=opts.stop,delete opts.stop):opts._stop_=!1,opts.stop=function(a,b){$($t).jqGrid("setGridParam",{height:$("#gview_"+gID+" .ui-jqgrid-bdiv").height()}),$($t).jqGrid("setGridWidth",b.size.width,opts.shrinkToFit),opts._stop_&&opts._stop_.call($t,a,b),$t.p.caption&&$("#gbox_"+gID).css({height:"auto"}),$t.p.frozenColumns&&(req&&clearTimeout(req),req=setTimeout(function(){req&&clearTimeout(req),$("#"+gID).jqGrid("destroyFrozenColumns"),$("#"+gID).jqGrid("setFrozenColumns")}))},opts._alsoResize_){var optstest="{'#gview_"+gID+" .ui-jqgrid-bdiv':true,'"+opts._alsoResize_+"':true}";opts.alsoResize=eval("("+optstest+")")}else opts.alsoResize=$(".ui-jqgrid-bdiv","#gview_"+gID);delete opts._alsoResize_,$("#gbox_"+gID).resizable(opts)}})}}),$.assocArraySize=function(a){var b,c=0;for(b in a)a.hasOwnProperty(b)&&c++;return c},$.jgrid.extend({pivotSetup:function(a,b){var c=[],d=[],e=[],f=[],g=[],h={grouping:!0,groupingView:{groupField:[],groupSummary:[],groupSummaryPos:[]}},i=[],j=$.extend({rowTotals:!1,rowTotalsText:"Total",colTotals:!1,groupSummary:!0,groupSummaryPos:"header",frozenStaticCols:!1},b||{});return this.each(function(){function b(a,b,c){var d;return d=_pivotfilter.call(a,b,c),d.length>0?d[0]:null}function k(a,b){var c,d=0,e=!0;for(c in a)if(a.hasOwnProperty(c)){if(a[c]!=this[d]){e=!1;break}if(++d>=this.length)break}return e&&(p=b),e}function l(a,b,c,d,e){var f;if($.isFunction(a))f=a.call(w,b,c,d);else switch(a){case"sum":f=parseFloat(b||0)+parseFloat(d[c]||0);break;case"count":""!==b&&null!=b||(b=0),f=d.hasOwnProperty(c)?b+1:0;break;case"min":f=""===b||null==b?parseFloat(d[c]||0):Math.min(parseFloat(b),parseFloat(d[c]||0));break;case"max":f=""===b||null==b?parseFloat(d[c]||0):Math.max(parseFloat(b),parseFloat(d[c]||0));break;case"avg":f=(parseFloat(b||0)*(e-1)+parseFloat(d[c]||0))/e}return f}function m(a,b,c,e){var h,i,j,k,m,n,o=b.length,q="",r=[],s=1;for($.isArray(c)?(k=c.length,r=c):(k=1,r[0]=c),f=[],g=[],f.root=0,j=0;j<k;j++){var t,u=[];for(h=0;h<o;h++){if(m="string"==typeof b[h].aggregator?b[h].aggregator:"cust",null==c)i=$.trim(b[h].member)+"_"+m,t=i,r[0]=b[h].label||m+" "+$.trim(b[h].member);else{t=c[j].replace(/\s+/g,"");try{i=1===o?q+t:q+t+"_"+m+"_"+String(h)}catch(a){}r[j]=c[j]}i=isNaN(parseInt(i,10))?i:i+" ","avg"===b[h].aggregator&&(n=-1===p?d.length+"_"+i:p+"_"+i,D[n]?D[n]++:D[n]=1,s=D[n]),e[i]=u[i]=l(b[h].aggregator,e[i],b[h].member,a,s)}q+=c&&null!=c[j]?c[j].replace(/\s+/g,""):"",f[i]=u,g[i]=r[j]}return e}function n(a){var b,d,e,f,g;for(e in a)if(a.hasOwnProperty(e)){if("object"!=typeof a[e]){if("level"===e){if(void 0===L[a.level]&&(L[a.level]="",a.level>0&&-1===a.text.indexOf("_r_Totals")&&(i[a.level-1]={useColSpanStyle:!1,groupHeaders:[]})),L[a.level]!==a.text&&a.children.length&&-1===a.text.indexOf("_r_Totals")&&a.level>0){i[a.level-1].groupHeaders.push({titleText:a.label,numberOfColumns:0});var h=i[a.level-1].groupHeaders.length-1,k=0===h?N:M;if(a.level-1==(j.rowTotals?1:0)&&h>0){for(var l=0,m=0;m<h;m++)l+=i[a.level-1].groupHeaders[m].numberOfColumns;l&&(k=l+r)}c[k]&&(i[a.level-1].groupHeaders[h].startColumnName=c[k].name,i[a.level-1].groupHeaders[h].numberOfColumns=c.length-k),M=c.length}L[a.level]=a.text}if(a.level===s&&"level"===e&&s>0)if(t>1){var o=1;for(b in a.fields)a.fields.hasOwnProperty(b)&&(1===o&&i[s-1].groupHeaders.push({startColumnName:b,numberOfColumns:1,titleText:a.label||a.text}),o++);i[s-1].groupHeaders[i[s-1].groupHeaders.length-1].numberOfColumns=o-1}else i.splice(s-1,1)}if(null!=a[e]&&"object"==typeof a[e]&&n(a[e]),"level"===e&&a.level>0&&(a.level===(0===s?a.level:s)||-1!==L[a.level].indexOf("_r_Totals"))){d=0;for(b in a.fields)if(a.fields.hasOwnProperty(b)){g={};for(f in j.aggregates[d])if(j.aggregates[d].hasOwnProperty(f))switch(f){case"member":case"label":case"aggregator":break;default:g[f]=j.aggregates[d][f]}t>1?(g.name=b,g.label=j.aggregates[d].label||a.label):(g.name=a.text,g.label="_r_Totals"===a.text?j.rowTotalsText:a.label),c.push(g),d++}}}}var o,p,q,r,s,t,u,v,w=this,x=a.length,y=0;if(j.rowTotals&&j.yDimension.length>0){var z=j.yDimension[0].dataName;j.yDimension.splice(0,0,{dataName:z}),j.yDimension[0].converter=function(){return"_r_Totals"}}if(r=$.isArray(j.xDimension)?j.xDimension.length:0,s=j.yDimension.length,t=$.isArray(j.aggregates)?j.aggregates.length:0,0===r||0===t)throw"xDimension or aggregates optiona are not set!";var A;for(q=0;q<r;q++)A={name:j.xDimension[q].dataName,frozen:j.frozenStaticCols},null==j.xDimension[q].isGroupField&&(j.xDimension[q].isGroupField=!0),A=$.extend(!0,A,j.xDimension[q]),c.push(A);for(var B=r-1,C={},D=[];y<x;){o=a[y];var E=[],F=[];u={},q=0;do{E[q]=$.trim(o[j.xDimension[q].dataName]),u[j.xDimension[q].dataName]=E[q],q++}while(q<r);var G=0;if(p=-1,v=b(d,k,E)){if(p>=0){if(G=0,s>=1){for(G=0;G<s;G++)F[G]=$.trim(o[j.yDimension[G].dataName]),j.yDimension[G].converter&&$.isFunction(j.yDimension[G].converter)&&(F[G]=j.yDimension[G].converter.call(this,F[G],E,F));v=m(o,j.aggregates,F,v)}else 0===s&&(v=m(o,j.aggregates,null,v));d[p]=v}}else{if(G=0,s>=1){for(G=0;G<s;G++)F[G]=$.trim(o[j.yDimension[G].dataName]),j.yDimension[G].converter&&$.isFunction(j.yDimension[G].converter)&&(F[G]=j.yDimension[G].converter.call(this,F[G],E,F));u=m(o,j.aggregates,F,u)}else 0===s&&(u=m(o,j.aggregates,null,u));d.push(u)}var H,I=0,J=null,K=null;for(H in f)if(f.hasOwnProperty(H)){if(0===I)C.children&&void 0!==C.children||(C={text:H,level:0,children:[],label:H}),J=C.children;else{for(K=null,q=0;q<J.length;q++)if(J[q].text===H){K=J[q];break}K?J=K.children:(J.push({children:[],text:H,level:I,fields:f[H],label:g[H]}),J=J[J.length-1].children)}I++}y++}D=null;var L=[],M=c.length,N=M;s>0&&(i[s-1]={useColSpanStyle:!1,groupHeaders:[]}),n(C);var O;if(j.colTotals)for(var P=d.length;P--;)for(q=r;q<c.length;q++)O=c[q].name,e[O]?e[O]+=parseFloat(d[P][O]||0):e[O]=parseFloat(d[P][O]||0);if(B>0)for(q=0;q<B;q++)c[q].isGroupField&&(h.groupingView.groupField.push(c[q].name),h.groupingView.groupSummary.push(j.groupSummary),h.groupingView.groupSummaryPos.push(j.groupSummaryPos));else h.grouping=!1;h.sortname=c[B].name,h.groupingView.hideFirstGroupCol=!0}),{colModel:c,rows:d,groupOptions:h,groupHeaders:i,summary:e}},jqPivot:function(a,b,c,d){return this.each(function(){function e(a){$.isFunction(b.onInitPivot)&&b.onInitPivot.call(f),$.isArray(a)||(a=[]);var d,e,g,h,i=jQuery(f).jqGrid("pivotSetup",a,b),j=$.assocArraySize(i.summary)>0,k=$.jgrid.from.call(f,i.rows);for(b.ignoreCase&&(k=k.ignoreCase()),d=0;d<i.groupOptions.groupingView.groupField.length;d++)e=b.xDimension[d].sortorder?b.xDimension[d].sortorder:"asc",g=b.xDimension[d].sorttype?b.xDimension[d].sorttype:"text",k.orderBy(i.groupOptions.groupingView.groupField[d],e,g,"",g);if(h=b.xDimension.length,c.sortname){for(e=c.sortorder?c.sortorder:"asc",g="text",d=0;d<h;d++)if(b.xDimension[d].dataName===c.sortname){g=b.xDimension[d].sorttype?b.xDimension[d].sorttype:"text";break}k.orderBy(c.sortname,e,g,"",g)}else i.groupOptions.sortname&&h&&(e=b.xDimension[h-1].sortorder?b.xDimension[h-1].sortorder:"asc",g=b.xDimension[h-1].sorttype?b.xDimension[h-1].sorttype:"text",k.orderBy(i.groupOptions.sortname,e,g,"",g));jQuery(f).jqGrid($.extend(!0,{datastr:$.extend(k.select(),j?{userdata:i.summary}:{}),datatype:"jsonstring",footerrow:j,userDataOnFooter:j,colModel:i.colModel,viewrecords:!0,sortname:b.xDimension[0].dataName},i.groupOptions,c||{}));var l=i.groupHeaders;if(l.length)for(d=0;d<l.length;d++)l[d]&&l[d].groupHeaders.length&&jQuery(f).jqGrid("setGroupHeaders",l[d]);b.frozenStaticCols&&jQuery(f).jqGrid("setFrozenColumns"),$.isFunction(b.onCompletePivot)&&b.onCompletePivot.call(f),b.loadMsg&&$(".loading_pivot").remove()}var f=this,g=c.regional?c.regional:"en";void 0===b.loadMsg&&(b.loadMsg=!0),b.loadMsg&&$("<div class='loading_pivot ui-state-default ui-state-active row'>"+$.jgrid.getRegional(f,"regional."+g+".defaults.loadtext")+"</div>").insertBefore(f).show(),"string"==typeof a?$.ajax($.extend({url:a,dataType:"json",success:function(a){e($.jgrid.getAccessor(a,d&&d.reader?d.reader:"rows"))}},d||{})):e(a)})}}),$.jgrid.extend({setSubGrid:function(){return this.each(function(){var a,b,c=this,d=$.jgrid.styleUI[c.p.styleUI||"jQueryUI"].subgrid,e={plusicon:d.icon_plus,minusicon:d.icon_minus,openicon:d.icon_open,expandOnLoad:!1,selectOnExpand:!1,selectOnCollapse:!1,reloadOnExpand:!0};if(c.p.subGridOptions=$.extend(e,c.p.subGridOptions||{}),c.p.colNames.unshift(""),c.p.colModel.unshift({name:"subgrid",width:$.jgrid.cell_width?c.p.subGridWidth+c.p.cellLayout:c.p.subGridWidth,sortable:!1,resizable:!1,hidedlg:!0,search:!1,fixed:!0}),a=c.p.subGridModel,a[0])for(a[0].align=$.extend([],a[0].align||[]),b=0;b<a[0].name.length;b++)a[0].align[b]=a[0].align[b]||"left"})},addSubGridCell:function(a,b){var c,d,e,f="";return this.each(function(){f=this.formatCol(a,b),d=this.p.id,c=this.p.subGridOptions.plusicon,e=$.jgrid.styleUI[this.p.styleUI||"jQueryUI"].common}),'<td role="gridcell" aria-describedby="'+d+'_subgrid" class="ui-sgcollapsed sgcollapsed" '+f+"><a style='cursor:pointer;' class='ui-sghref'><span class='"+e.icon_base+" "+c+"'></span></a></td>"},addSubGrid:function(a,b){return this.each(function(){var c=this;if(c.grid){var d,e,f,g,h,i=$.jgrid.styleUI[c.p.styleUI||"jQueryUI"].base,j=$.jgrid.styleUI[c.p.styleUI||"jQueryUI"].common,k=function(a,b,d){var e=$("<td align='"+c.p.subGridModel[0].align[d]+"'></td>").html(b);$(a).append(e)},l=function(a,b){var d,e,f,g=$("<table class='"+i.rowTable+" ui-common-table'><tbody></tbody></table>"),h=$("<tr></tr>");for(e=0;e<c.p.subGridModel[0].name.length;e++)d=$("<th class='"+i.headerBox+" ui-th-subgrid ui-th-column ui-th-"+c.p.direction+"'></th>"),$(d).html(c.p.subGridModel[0].name[e]),$(d).width(c.p.subGridModel[0].width[e]),$(h).append(d);$(g).append(h),a&&(f=c.p.xmlReader.subgrid,$(f.root+" "+f.row,a).each(function(){if(h=$("<tr class='"+j.content+" ui-subtblcell'></tr>"),!0===f.repeatitems)$(f.cell,this).each(function(a){k(h,$(this).text()||"&#160;",a)});else{var a=c.p.subGridModel[0].mapping||c.p.subGridModel[0].name;if(a)for(e=0;e<a.length;e++)k(h,$.jgrid.getXmlData(this,a[e])||"&#160;",e)}$(g).append(h)}));var l=$("table:first",c.grid.bDiv).attr("id")+"_";return $("#"+$.jgrid.jqID(l+b)).append(g),c.grid.hDiv.loading=!1,$("#load_"+$.jgrid.jqID(c.p.id)).hide(),!1},m=function(a,b){var d,e,f,g,h,l,m=$("<table class='"+i.rowTable+" ui-common-table'><tbody></tbody></table>"),n=$("<tr></tr>");for(f=0;f<c.p.subGridModel[0].name.length;f++)d=$("<th class='"+i.headerBox+" ui-th-subgrid ui-th-column ui-th-"+c.p.direction+"'></th>"),$(d).html(c.p.subGridModel[0].name[f]),$(d).width(c.p.subGridModel[0].width[f]),$(n).append(d);if($(m).append(n),a&&(h=c.p.jsonReader.subgrid,void 0!==(e=$.jgrid.getAccessor(a,h.root))))for(f=0;f<e.length;f++){if(g=e[f],n=$("<tr class='"+j.content+" ui-subtblcell'></tr>"),!0===h.repeatitems)for(h.cell&&(g=g[h.cell]),l=0;l<g.length;l++)k(n,g[l]||"&#160;",l);else{var o=c.p.subGridModel[0].mapping||c.p.subGridModel[0].name;if(o.length)for(l=0;l<o.length;l++)k(n,$.jgrid.getAccessor(g,o[l])||"&#160;",l)}$(m).append(n)}var p=$("table:first",c.grid.bDiv).attr("id")+"_";return $("#"+$.jgrid.jqID(p+b)).append(m),c.grid.hDiv.loading=!1,$("#load_"+$.jgrid.jqID(c.p.id)).hide(),!1},n=function(a){var b,d,e,f;if(b=$(a).attr("id"),d={nd_:(new Date).getTime()},d[c.p.prmNames.subgridid]=b,!c.p.subGridModel[0])return!1;if(c.p.subGridModel[0].params)for(f=0;f<c.p.subGridModel[0].params.length;f++)for(e=0;e<c.p.colModel.length;e++)c.p.colModel[e].name===c.p.subGridModel[0].params[f]&&(d[c.p.colModel[e].name]=$("td:eq("+e+")",a).text().replace(/\&#160\;/gi,""));if(!c.grid.hDiv.loading)switch(c.grid.hDiv.loading=!0,$("#load_"+$.jgrid.jqID(c.p.id)).show(),c.p.subgridtype||(c.p.subgridtype=c.p.datatype),$.isFunction(c.p.subgridtype)?c.p.subgridtype.call(c,d):c.p.subgridtype=c.p.subgridtype.toLowerCase(),c.p.subgridtype){case"xml":case"json":$.ajax($.extend({type:c.p.mtype,url:$.isFunction(c.p.subGridUrl)?c.p.subGridUrl.call(c,d):c.p.subGridUrl,dataType:c.p.subgridtype,data:$.isFunction(c.p.serializeSubGridData)?c.p.serializeSubGridData.call(c,d):d,complete:function(a){"xml"===c.p.subgridtype?l(a.responseXML,b):m($.jgrid.parse(a.responseText),b),a=null}},$.jgrid.ajaxOptions,c.p.ajaxSubgridOptions||{}))}return!1},o=0;$.each(c.p.colModel,function(){!0!==this.hidden&&"rn"!==this.name&&"cb"!==this.name||o++});var p,q=c.rows.length,r=1,s=$.isFunction(c.p.isHasSubGrid);for(void 0!==b&&b>0&&(r=b,q=b+1);r<q;)$(c.rows[r]).hasClass("jqgrow")&&(c.p.scroll&&$(c.rows[r].cells[a]).off("click"),p=null,s&&(p=c.p.isHasSubGrid.call(c,c.rows[r].id)),!1===p?c.rows[r].cells[a].innerHTML="":$(c.rows[r].cells[a]).on("click",function(){var b=$(this).parent("tr")[0];if(e=c.p.id,d=b.id,h=$("#"+e+"_"+d+"_expandedContent"),$(this).hasClass("sgcollapsed")){if(g=$(c).triggerHandler("jqGridSubGridBeforeExpand",[e+"_"+d,d]),g=!1!==g&&"stop"!==g,
g&&$.isFunction(c.p.subGridBeforeExpand)&&(g=c.p.subGridBeforeExpand.call(c,e+"_"+d,d)),!1===g)return!1;!0===c.p.subGridOptions.reloadOnExpand||!1===c.p.subGridOptions.reloadOnExpand&&!h.hasClass("ui-subgrid")?(f=a>=1?"<td colspan='"+a+"'>&#160;</td>":"",$(b).after("<tr role='row' id='"+e+"_"+d+"_expandedContent' class='ui-subgrid ui-sg-expanded'>"+f+"<td class='"+j.content+" subgrid-cell'><span class='"+j.icon_base+" "+c.p.subGridOptions.openicon+"'></span></td><td colspan='"+parseInt(c.p.colNames.length-1-o,10)+"' class='"+j.content+" subgrid-data'><div id="+e+"_"+d+" class='tablediv'></div></td></tr>"),$(c).triggerHandler("jqGridSubGridRowExpanded",[e+"_"+d,d]),$.isFunction(c.p.subGridRowExpanded)?c.p.subGridRowExpanded.call(c,e+"_"+d,d):n(b)):h.show().removeClass("ui-sg-collapsed").addClass("ui-sg-expanded"),$(this).html("<a style='cursor:pointer;' class='ui-sghref'><span class='"+j.icon_base+" "+c.p.subGridOptions.minusicon+"'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded"),c.p.subGridOptions.selectOnExpand&&$(c).jqGrid("setSelection",d)}else if($(this).hasClass("sgexpanded")){if(g=$(c).triggerHandler("jqGridSubGridRowColapsed",[e+"_"+d,d]),g=!1!==g&&"stop"!==g,g&&$.isFunction(c.p.subGridRowColapsed)&&(g=c.p.subGridRowColapsed.call(c,e+"_"+d,d)),!1===g)return!1;!0===c.p.subGridOptions.reloadOnExpand?h.remove(".ui-subgrid"):h.hasClass("ui-subgrid")&&h.hide().addClass("ui-sg-collapsed").removeClass("ui-sg-expanded"),$(this).html("<a style='cursor:pointer;' class='ui-sghref'><span class='"+j.icon_base+" "+c.p.subGridOptions.plusicon+"'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed"),c.p.subGridOptions.selectOnCollapse&&$(c).jqGrid("setSelection",d)}return!1})),r++;if(!0===c.p.subGridOptions.expandOnLoad){var t=0;c.p.multiselect&&t++,c.p.rownumbers&&t++,$(c.rows).filter(".jqgrow").each(function(a,b){$(b.cells[t]).click()})}c.subGridXml=function(a,b){l(a,b)},c.subGridJson=function(a,b){m(a,b)}}})},expandSubGridRow:function(a){return this.each(function(){var b=this;if((b.grid||a)&&!0===b.p.subGrid){var c=$(this).jqGrid("getInd",a,!0);if(c){var d=$("td.sgcollapsed",c)[0];d&&$(d).trigger("click")}}})},collapseSubGridRow:function(a){return this.each(function(){var b=this;if((b.grid||a)&&!0===b.p.subGrid){var c=$(this).jqGrid("getInd",a,!0);if(c){var d=$("td.sgexpanded",c)[0];d&&$(d).trigger("click")}}})},toggleSubGridRow:function(a){return this.each(function(){var b=this;if((b.grid||a)&&!0===b.p.subGrid){var c=$(this).jqGrid("getInd",a,!0);if(c){var d=$("td.sgcollapsed",c)[0];d?$(d).trigger("click"):(d=$("td.sgexpanded",c)[0])&&$(d).trigger("click")}}})}}),$.jgrid.extend({setTreeNode:function(a,b){return this.each(function(){var c=this;if(c.grid&&c.p.treeGrid){var d,e,f,g,h,i,j,k,l=c.p.expColInd,m=c.p.treeReader.expanded_field,n=c.p.treeReader.leaf_field,o=c.p.treeReader.level_field,p=c.p.treeReader.icon_field,q=c.p.treeReader.loaded,r=$.jgrid.styleUI[c.p.styleUI||"jQueryUI"].common,s=a;for($(c).triggerHandler("jqGridBeforeSetTreeNode",[s,b]),$.isFunction(c.p.beforeSetTreeNode)&&c.p.beforeSetTreeNode.call(c,s,b);a<b;){var t=$.jgrid.stripPref(c.p.idPrefix,c.rows[a].id),u=c.p._index[t];j=c.p.data[u],"nested"===c.p.treeGridModel&&(j[n]||(d=parseInt(j[c.p.treeReader.left_field],10),e=parseInt(j[c.p.treeReader.right_field],10),j[n]=e===d+1?"true":"false",c.rows[a].cells[c.p._treeleafpos].innerHTML=j[n])),f=parseInt(j[o],10),0===c.p.tree_root_level?(g=f+1,h=f):(g=f,h=f-1),i="<div class='tree-wrap tree-wrap-"+c.p.direction+"' style='width:"+18*g+"px;'>",i+="<div style='"+("rtl"===c.p.direction?"right:":"left:")+18*h+"px;' class='"+r.icon_base+" ",void 0!==j[q]&&("true"===j[q]||!0===j[q]?j[q]=!0:j[q]=!1),"true"===j[n]||!0===j[n]?(i+=(void 0!==j[p]&&""!==j[p]?j[p]:c.p.treeIcons.leaf)+" tree-leaf treeclick",j[n]=!0,k="leaf"):(j[n]=!1,k=""),j[m]=("true"===j[m]||!0===j[m])&&(j[q]||void 0===j[q]),!1===j[m]?i+=!0===j[n]?"'":c.p.treeIcons.plus+" tree-plus treeclick'":i+=!0===j[n]?"'":c.p.treeIcons.minus+" tree-minus treeclick'",i+="></div></div>",$(c.rows[a].cells[l]).wrapInner("<span class='cell-wrapper"+k+"'></span>").prepend(i),f!==parseInt(c.p.tree_root_level,10)&&($(c).jqGrid("isVisibleNode",j)||$(c.rows[a]).css("display","none")),$(c.rows[a].cells[l]).find("div.treeclick").on("click",function(a){var b=a.target||a.srcElement,d=$.jgrid.stripPref(c.p.idPrefix,$(b,c.rows).closest("tr.jqgrow")[0].id),e=c.p._index[d];return c.p.data[e][n]||(c.p.data[e][m]?($(c).jqGrid("collapseRow",c.p.data[e]),$(c).jqGrid("collapseNode",c.p.data[e])):($(c).jqGrid("expandRow",c.p.data[e]),$(c).jqGrid("expandNode",c.p.data[e]))),!1}),!0===c.p.ExpandColClick&&$(c.rows[a].cells[l]).find("span.cell-wrapper").css("cursor","pointer").on("click",function(a){var b=a.target||a.srcElement,d=$.jgrid.stripPref(c.p.idPrefix,$(b,c.rows).closest("tr.jqgrow")[0].id),e=c.p._index[d];return c.p.data[e][n]||(c.p.data[e][m]?($(c).jqGrid("collapseRow",c.p.data[e]),$(c).jqGrid("collapseNode",c.p.data[e])):($(c).jqGrid("expandRow",c.p.data[e]),$(c).jqGrid("expandNode",c.p.data[e]))),$(c).jqGrid("setSelection",d),!1}),a++}$(c).triggerHandler("jqGridAfterSetTreeNode",[s,b]),$.isFunction(c.p.afterSetTreeNode)&&c.p.afterSetTreeNode.call(c,s,b)}})},setTreeGrid:function(){return this.each(function(){var a,b,c,d,e=this,f=0,g=!1,h=[],i=$.jgrid.styleUI[e.p.styleUI||"jQueryUI"].treegrid;if(e.p.treeGrid){e.p.treedatatype||$.extend(e.p,{treedatatype:e.p.datatype}),e.p.loadonce&&(e.p.treedatatype="local"),e.p.subGrid=!1,e.p.altRows=!1,e.p.treeGrid_bigData||(e.p.pgbuttons=!1,e.p.pginput=!1,e.p.rowList=[]),e.p.gridview=!0,null!==e.p.rowTotal||e.p.treeGrid_bigData||(e.p.rowNum=1e4),e.p.multiselect=!1,e.p.expColInd=0,a=i.icon_plus,"jQueryUI"===e.p.styleUI&&(a+="rtl"===e.p.direction?"w":"e"),e.p.treeIcons=$.extend({plus:a,minus:i.icon_minus,leaf:i.icon_leaf},e.p.treeIcons||{}),"nested"===e.p.treeGridModel?e.p.treeReader=$.extend({level_field:"level",left_field:"lft",right_field:"rgt",leaf_field:"isLeaf",expanded_field:"expanded",loaded:"loaded",icon_field:"icon"},e.p.treeReader):"adjacency"===e.p.treeGridModel&&(e.p.treeReader=$.extend({level_field:"level",parent_id_field:"parent",leaf_field:"isLeaf",expanded_field:"expanded",loaded:"loaded",icon_field:"icon"},e.p.treeReader));for(c in e.p.colModel)if(e.p.colModel.hasOwnProperty(c)){b=e.p.colModel[c].name,b!==e.p.ExpandColumn||g||(g=!0,e.p.expColInd=f),f++;for(d in e.p.treeReader)e.p.treeReader.hasOwnProperty(d)&&e.p.treeReader[d]===b&&h.push(b)}$.each(e.p.treeReader,function(a,b){b&&-1===$.inArray(b,h)&&("leaf_field"===a&&(e.p._treeleafpos=f),f++,e.p.colNames.push(b),e.p.colModel.push({name:b,width:1,hidden:!0,sortable:!1,resizable:!1,hidedlg:!0,editable:!0,search:!1}))})}})},expandRow:function(a){this.each(function(){var b=this;if(!b.p.treeGrid_bigData)var c=b.p.lastpage;if(b.grid&&b.p.treeGrid){var d=$(b).jqGrid("getNodeChildren",a),e=b.p.treeReader.expanded_field,f=a[b.p.localReader.id],g=$(b).triggerHandler("jqGridBeforeExpandTreeGridRow",[f,a,d]);void 0===g&&(g=!0),g&&$.isFunction(b.p.beforeExpandTreeGridRow)&&(g=b.p.beforeExpandTreeGridRow.call(b,f,a,d)),!1!==g&&($(d).each(function(){var a=b.p.idPrefix+$.jgrid.getAccessor(this,b.p.localReader.id);$($(b).jqGrid("getGridRowById",a)).css("display",""),this[e]&&$(b).jqGrid("expandRow",this)}),$(b).triggerHandler("jqGridAfterExpandTreeGridRow",[f,a,d]),$.isFunction(b.p.afterExpandTreeGridRow)&&b.p.afterExpandTreeGridRow.call(b,f,a,d),b.p.treeGrid_bigData||(b.p.lastpage=c))}})},collapseRow:function(a){this.each(function(){var b=this;if(b.grid&&b.p.treeGrid){var c=$(b).jqGrid("getNodeChildren",a),d=b.p.treeReader.expanded_field,e=a[b.p.localReader.id],f=$(b).triggerHandler("jqGridBeforeCollapseTreeGridRow",[e,a,c]);void 0===f&&(f=!0),f&&$.isFunction(b.p.beforeCollapseTreeGridRow)&&(f=b.p.beforeCollapseTreeGridRow.call(b,e,a,c)),!1!==f&&($(c).each(function(){var a=b.p.idPrefix+$.jgrid.getAccessor(this,b.p.localReader.id);$($(b).jqGrid("getGridRowById",a)).css("display","none"),this[d]&&$(b).jqGrid("collapseRow",this)}),$(b).triggerHandler("jqGridAfterCollapseTreeGridRow",[e,a,c]),$.isFunction(b.p.afterCollapseTreeGridRow)&&b.p.afterCollapseTreeGridRow.call(b,e,a,c))}})},getRootNodes:function(a){var b=[];return this.each(function(){var c,d,e,f=this;if(f.grid&&f.p.treeGrid)switch("boolean"!=typeof a&&(a=!1),e=a?$(f).jqGrid("getRowData",null,!0):f.p.data,f.p.treeGridModel){case"nested":c=f.p.treeReader.level_field,$(e).each(function(){parseInt(this[c],10)===parseInt(f.p.tree_root_level,10)&&(a?b.push(f.p.data[f.p._index[this[f.p.keyName]]]):b.push(this))});break;case"adjacency":d=f.p.treeReader.parent_id_field,$(e).each(function(){null!==this[d]&&"null"!==String(this[d]).toLowerCase()||(a?b.push(f.p.data[f.p._index[this[f.p.keyName]]]):b.push(this))})}}),b},getNodeDepth:function(a){var b=null;return this.each(function(){if(this.grid&&this.p.treeGrid){var c=this;switch(c.p.treeGridModel){case"nested":var d=c.p.treeReader.level_field;b=parseInt(a[d],10)-parseInt(c.p.tree_root_level,10);break;case"adjacency":b=$(c).jqGrid("getNodeAncestors",a).length}}}),b},getNodeParent:function(a){var b=null;return this.each(function(){var c=this;if(c.grid&&c.p.treeGrid)switch(c.p.treeGridModel){case"nested":var d=c.p.treeReader.left_field,e=c.p.treeReader.right_field,f=c.p.treeReader.level_field,g=parseInt(a[d],10),h=parseInt(a[e],10),i=parseInt(a[f],10);$(this.p.data).each(function(){if(parseInt(this[f],10)===i-1&&parseInt(this[d],10)<g&&parseInt(this[e],10)>h)return b=this,!1});break;case"adjacency":for(var j=c.p.treeReader.parent_id_field,k=c.p.localReader.id,l=a[k],m=c.p._index[l];m--;)if(String(c.p.data[m][k])===String($.jgrid.stripPref(c.p.idPrefix,a[j]))){b=c.p.data[m];break}}}),b},getNodeChildren:function(a,b){var c=[];return this.each(function(){var d=this;if(d.grid&&d.p.treeGrid){var e,f,g=b?this.rows.length:this.p.data.length;switch(d.p.treeGridModel){case"nested":var h=d.p.treeReader.left_field,i=d.p.treeReader.right_field,j=d.p.treeReader.level_field,k=parseInt(a[h],10),l=parseInt(a[i],10),m=parseInt(a[j],10);for(e=0;e<g;e++)(f=b?d.p.data[d.p._index[this.rows[e].id]]:d.p.data[e])&&parseInt(f[j],10)===m+1&&parseInt(f[h],10)>k&&parseInt(f[i],10)<l&&c.push(f);break;case"adjacency":var n=d.p.treeReader.parent_id_field,o=d.p.localReader.id;for(e=0;e<g;e++)(f=b?d.p.data[d.p._index[this.rows[e].id]]:d.p.data[e])&&String(f[n])===String($.jgrid.stripPref(d.p.idPrefix,a[o]))&&c.push(f)}}}),c},getFullTreeNode:function(a,b){var c=[];return this.each(function(){var d,e=this,f=e.p.treeReader.expanded_field;if(e.grid&&e.p.treeGrid)switch(null!=b&&"boolean"==typeof b||(b=!1),e.p.treeGridModel){case"nested":var g=e.p.treeReader.left_field,h=e.p.treeReader.right_field,i=e.p.treeReader.level_field,j=parseInt(a[g],10),k=parseInt(a[h],10),l=parseInt(a[i],10);$(this.p.data).each(function(){parseInt(this[i],10)>=l&&parseInt(this[g],10)>=j&&parseInt(this[g],10)<=k&&(b&&(this[f]=!0),c.push(this))});break;case"adjacency":if(a){c.push(a);var m=e.p.treeReader.parent_id_field,n=e.p.localReader.id;$(this.p.data).each(function(a){for(d=c.length,a=0;a<d;a++)if(String($.jgrid.stripPref(e.p.idPrefix,c[a][n]))===String(this[m])){b&&(this[f]=!0),c.push(this);break}})}}}),c},getNodeAncestors:function(a,b,c){var d=[];return void 0===b&&(b=!1),this.each(function(){if(this.grid&&this.p.treeGrid){c=void 0!==c&&this.p.treeReader.expanded_field;for(var e=$(this).jqGrid("getNodeParent",a);e;){if(c)try{e[c]=!0}catch(a){}b?d.unshift(e):d.push(e),e=$(this).jqGrid("getNodeParent",e)}}}),d},isVisibleNode:function(a){var b=!0;return this.each(function(){var c=this;if(c.grid&&c.p.treeGrid){var d=$(c).jqGrid("getNodeAncestors",a),e=c.p.treeReader.expanded_field;$(d).each(function(){if(!(b=b&&this[e]))return!1})}}),b},isNodeLoaded:function(a){var b;return this.each(function(){var c=this;if(c.grid&&c.p.treeGrid){var d=c.p.treeReader.leaf_field,e=c.p.treeReader.loaded;b=void 0!==a&&(void 0!==a[e]?a[e]:!!(a[d]||$(c).jqGrid("getNodeChildren",a).length>0))}}),b},setLeaf:function(a,b,c){return this.each(function(){var d=$.jgrid.getAccessor(a,this.p.localReader.id),e=$("#"+d,this.grid.bDiv)[0],f=this.p.treeReader.leaf_field;try{var g=this.p._index[d];null!=g&&(this.p.data[g][f]=b)}catch(a){}if(!0===b)$("div.treeclick",e).removeClass(this.p.treeIcons.minus+" tree-minus "+this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.leaf+" tree-leaf");else if(!1===b){var h=this.p.treeIcons.minus+" tree-minus";c&&(h=this.p.treeIcons.plus+" tree-plus"),$("div.treeclick",e).removeClass(this.p.treeIcons.leaf+" tree-leaf").addClass(h)}})},reloadNode:function(a,b){return this.each(function(){if(this.grid&&this.p.treeGrid){var c=this.p.localReader.id,d=this.p.selrow;$(this).jqGrid("delChildren",a[c]),void 0===b&&(b=!1),b||jQuery._data(this,"events").jqGridAfterSetTreeNode||$(this).on("jqGridAfterSetTreeNode.reloadNode",function(){var a=this.p.treeReader.leaf_field;if(this.p.reloadnode){var b=this.p.reloadnode,c=$(this).jqGrid("getNodeChildren",b);b[a]&&c.length?$(this).jqGrid("setLeaf",b,!1):b[a]||0!==c.length||$(this).jqGrid("setLeaf",b,!0)}this.p.reloadnode=!1});var e=this.p.treeReader.expanded_field,f=this.p.treeReader.parent_id_field,g=this.p.treeReader.loaded,h=this.p.treeReader.level_field,i=this.p.treeReader.leaf_field,j=this.p.treeReader.left_field,k=this.p.treeReader.right_field,l=$.jgrid.getAccessor(a,this.p.localReader.id),m=$("#"+l,this.grid.bDiv)[0];a[e]=!0,a[i]||$("div.treeclick",m).removeClass(this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.minus+" tree-minus"),this.p.treeANode=m.rowIndex,this.p.datatype=this.p.treedatatype,this.p.reloadnode=a,b&&(this.p.treeANode=m.rowIndex>0?m.rowIndex-1:1,$(this).jqGrid("delRowData",l)),"nested"===this.p.treeGridModel?$(this).jqGrid("setGridParam",{postData:{nodeid:l,n_left:a[j],n_right:a[k],n_level:a[h]}}):$(this).jqGrid("setGridParam",{postData:{nodeid:l,parentid:a[f],n_level:a[h]}}),$(this).trigger("reloadGrid"),a[g]=!0,"nested"===this.p.treeGridModel?$(this).jqGrid("setGridParam",{selrow:d,postData:{nodeid:"",n_left:"",n_right:"",n_level:""}}):$(this).jqGrid("setGridParam",{selrow:d,postData:{nodeid:"",parentid:"",n_level:""}})}})},expandNode:function(a){return this.each(function(){if(this.grid&&this.p.treeGrid){var b=this,c=this.p.treeReader.expanded_field,d=this.p.treeReader.parent_id_field,e=this.p.treeReader.loaded,f=this.p.treeReader.level_field,g=this.p.treeReader.left_field,h=this.p.treeReader.right_field;if(!a[c]){var i=$.jgrid.getAccessor(a,this.p.localReader.id),j=$("#"+this.p.idPrefix+$.jgrid.jqID(i),this.grid.bDiv)[0],k=this.p._index[i],l=$(b).triggerHandler("jqGridBeforeExpandTreeGridNode",[i,a]);if(void 0===l&&(l=!0),l&&$.isFunction(this.p.beforeExpandTreeGridNode)&&(l=this.p.beforeExpandTreeGridNode.call(this,i,a)),!1===l)return;$(this).jqGrid("isNodeLoaded",this.p.data[k])?(a[c]=!0,$("div.treeclick",j).removeClass(this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.minus+" tree-minus")):this.grid.hDiv.loading||(a[c]=!0,$("div.treeclick",j).removeClass(this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.minus+" tree-minus"),this.p.treeANode=j.rowIndex,this.p.datatype=this.p.treedatatype,"nested"===this.p.treeGridModel?$(this).jqGrid("setGridParam",{postData:{nodeid:i,n_left:a[g],n_right:a[h],n_level:a[f]}}):$(this).jqGrid("setGridParam",{postData:{nodeid:i,parentid:a[d],n_level:a[f]}}),$(this).trigger("reloadGrid"),a[e]=!0,"nested"===this.p.treeGridModel?$(this).jqGrid("setGridParam",{postData:{nodeid:"",n_left:"",n_right:"",n_level:""}}):$(this).jqGrid("setGridParam",{postData:{nodeid:"",parentid:"",n_level:""}})),$(b).triggerHandler("jqGridAfterExpandTreeGridNode",[i,a]),$.isFunction(this.p.afterExpandTreeGridNode)&&this.p.afterExpandTreeGridNode.call(this,i,a)}}})},collapseNode:function(a){return this.each(function(){if(this.grid&&this.p.treeGrid){var b=this.p.treeReader.expanded_field,c=this;if(a[b]){var d=$.jgrid.getAccessor(a,this.p.localReader.id),e=$("#"+this.p.idPrefix+$.jgrid.jqID(d),this.grid.bDiv)[0],f=$(c).triggerHandler("jqGridBeforeCollapseTreeGridNode",[d,a]);if(void 0===f&&(f=!0),f&&$.isFunction(this.p.beforeCollapseTreeGridNode)&&(f=this.p.beforeCollapseTreeGridNode.call(this,d,a)),a[b]=!1,!1===f)return;$("div.treeclick",e).removeClass(this.p.treeIcons.minus+" tree-minus").addClass(this.p.treeIcons.plus+" tree-plus"),$(c).triggerHandler("jqGridAfterCollapseTreeGridNode",[d,a]),$.isFunction(this.p.afterCollapseTreeGridNode)&&this.p.afterCollapseTreeGridNode.call(this,d,a)}}})},SortTree:function(a,b,c,d){return this.each(function(){if(this.grid&&this.p.treeGrid){var e,f,g,h,i,j=[],k=this,l=$(this).jqGrid("getRootNodes",k.p.search);for(h=$.jgrid.from.call(this,l),h.orderBy(a,b,c,d),i=h.select(),e=0,f=i.length;e<f;e++)g=i[e],j.push(g),$(this).jqGrid("collectChildrenSortTree",j,g,a,b,c,d);$.each(j,function(a){var b=$.jgrid.getAccessor(this,k.p.localReader.id);$("#"+$.jgrid.jqID(k.p.id)+" tbody tr:eq("+a+")").after($("tr#"+$.jgrid.jqID(b),k.grid.bDiv))}),h=null,i=null,j=null}})},searchTree:function(a){var b,c,d,e,f,g,h=a.length||0,i=[],j=[],k=[];return this.each(function(){if(this.grid&&this.p.treeGrid&&h)for(b=this.p.localReader.id;h--;)if(i=$(this).jqGrid("getNodeAncestors",a[h],!0,!0),i.push(a[h]),c=i[0][b],-1===$.inArray(c,j))j.push(c),k=k.concat(i);else for(f=0,d=i.length;f<d;f++){var l=!1;for(g=0,e=k.length;g<e;g++)if(i[f][b]===k[g][b]){l=!0;break}l||k.push(i[f])}}),k},collectChildrenSortTree:function(a,b,c,d,e,f){return this.each(function(){if(this.grid&&this.p.treeGrid){var g,h,i,j,k,l;for(j=$(this).jqGrid("getNodeChildren",b,this.p.search),k=$.jgrid.from.call(this,j),k.orderBy(c,d,e,f),l=k.select(),g=0,h=l.length;g<h;g++)i=l[g],a.push(i),$(this).jqGrid("collectChildrenSortTree",a,i,c,d,e,f)}})},setTreeRow:function(a,b){var c=!1;return this.each(function(){var d=this;d.grid&&d.p.treeGrid&&(c=$(d).jqGrid("setRowData",a,b))}),c},delTreeNode:function(a){return this.each(function(){var b,c,d,e,f,g=this,h=g.p.localReader.id,i=g.p.treeReader.left_field,j=g.p.treeReader.right_field;if(g.grid&&g.p.treeGrid){var k=g.p._index[a];if(void 0!==k){c=parseInt(g.p.data[k][j],10),d=c-parseInt(g.p.data[k][i],10)+1;var l=$(g).jqGrid("getFullTreeNode",g.p.data[k]);if(l.length>0)for(b=0;b<l.length;b++)$(g).jqGrid("delRowData",l[b][h]);if("nested"===g.p.treeGridModel){if(e=$.jgrid.from.call(g,g.p.data).greater(i,c,{stype:"integer"}).select(),e.length)for(f in e)e.hasOwnProperty(f)&&(e[f][i]=parseInt(e[f][i],10)-d);if(e=$.jgrid.from.call(g,g.p.data).greater(j,c,{stype:"integer"}).select(),e.length)for(f in e)e.hasOwnProperty(f)&&(e[f][j]=parseInt(e[f][j],10)-d)}}}})},delChildren:function(a){return this.each(function(){var b,c,d,e,f=this,g=f.p.localReader.id,h=f.p.treeReader.left_field,i=f.p.treeReader.right_field;if(f.grid&&f.p.treeGrid){var j=f.p._index[a];if(void 0!==j){b=parseInt(f.p.data[j][i],10),c=b-parseInt(f.p.data[j][h],10)+1;var k=$(f).jqGrid("getFullTreeNode",f.p.data[j]);if(k.length>0)for(var l=0;l<k.length;l++)k[l][g]!==a&&$(f).jqGrid("delRowData",k[l][g]);if("nested"===f.p.treeGridModel){if(d=$.jgrid.from(f.p.data).greater(h,b,{stype:"integer"}).select(),d.length)for(e in d)d.hasOwnProperty(e)&&(d[e][h]=parseInt(d[e][h],10)-c);if(d=$.jgrid.from(f.p.data).greater(i,b,{stype:"integer"}).select(),d.length)for(e in d)d.hasOwnProperty(e)&&(d[e][i]=parseInt(d[e][i],10)-c)}}}})},addChildNode:function(a,b,c,d){var e=this[0];if(c){var f,g,h,i,j,k,l,m,n=e.p.treeReader.expanded_field,o=e.p.treeReader.leaf_field,p=e.p.treeReader.level_field,q=e.p.treeReader.parent_id_field,r=e.p.treeReader.left_field,s=e.p.treeReader.right_field,t=e.p.treeReader.loaded,u=0,v=b;if(void 0===d&&(d=!1),null==a){if((j=e.p.data.length-1)>=0)for(;j>=0;)u=Math.max(u,parseInt(e.p.data[j][e.p.localReader.id],10)),j--;a=u+1}var w=$(e).jqGrid("getInd",b);if(l=!1,void 0===b||null===b||""===b)b=null,v=null,f="last",i=e.p.tree_root_level,j=e.p.data.length+1;else{f="after",g=e.p._index[b],h=e.p.data[g],b=h[e.p.localReader.id],i=parseInt(h[p],10)+1;var x=$(e).jqGrid("getFullTreeNode",h);x.length?(j=x[x.length-1][e.p.localReader.id],v=j,j=$(e).jqGrid("getInd",v)+1):j=$(e).jqGrid("getInd",b)+1,h[o]&&(l=!0,h[n]=!0,$(e.rows[w]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(e.p.treeIcons.leaf+" tree-leaf").addClass(e.p.treeIcons.minus+" tree-minus"),e.p.data[g][o]=!1,h[t]=!0)}if(k=j+1,void 0===c[n]&&(c[n]=!1),void 0===c[t]&&(c[t]=!1),c[p]=i,void 0===c[o]&&(c[o]=!0),"adjacency"===e.p.treeGridModel&&(c[q]=b),"nested"===e.p.treeGridModel){var y,z,A;if(null!==b){if(m=parseInt(h[s],10),y=$.jgrid.from.call(e,e.p.data),y=y.greaterOrEquals(s,m,{stype:"integer"}),z=y.select(),z.length)for(A in z)z.hasOwnProperty(A)&&(z[A][r]=z[A][r]>m?parseInt(z[A][r],10)+2:z[A][r],z[A][s]=z[A][s]>=m?parseInt(z[A][s],10)+2:z[A][s]);c[r]=m,c[s]=m+1}else{if(m=parseInt($(e).jqGrid("getCol",s,!1,"max"),10),z=$.jgrid.from.call(e,e.p.data).greater(r,m,{stype:"integer"}).select(),z.length)for(A in z)z.hasOwnProperty(A)&&(z[A][r]=parseInt(z[A][r],10)+2);if(z=$.jgrid.from.call(e,e.p.data).greater(s,m,{stype:"integer"}).select(),z.length)for(A in z)z.hasOwnProperty(A)&&(z[A][s]=parseInt(z[A][s],10)+2);c[r]=m+1,c[s]=m+2}}(null===b||$(e).jqGrid("isNodeLoaded",h)||l)&&($(e).jqGrid("addRowData",a,c,f,v),$(e).jqGrid("setTreeNode",j,k)),h&&!h[n]&&d&&$(e.rows[w]).find("div.treeclick").click()}}}),$.fn.jqDrag=function(a){return i(this,a,"d")},$.fn.jqResize=function(a,b){return i(this,a,"r",b)},$.jqDnR={dnr:{},e:0,drag:function(a){return"d"==M.k?E.css({left:M.X+a.pageX-M.pX,top:M.Y+a.pageY-M.pY}):(E.css({width:Math.max(a.pageX-M.pX+M.W,0),height:Math.max(a.pageY-M.pY+M.H,0)}),M1&&E1.css({width:Math.max(a.pageX-M1.pX+M1.W,0),height:Math.max(a.pageY-M1.pY+M1.H,0)})),!1},stop:function(){$(document).off("mousemove",J.drag).off("mouseup",J.stop)}};var J=$.jqDnR,M=J.dnr,E=J.e,E1,M1,i=function(a,b,c,d){return a.each(function(){b=b?$(b,a):a,b.on("mousedown",{e:a,k:c},function(a){var b=a.data,c={};if(E=b.e,E1=!!d&&$(d),"relative"!=E.css("position"))try{E.position(c)}catch(a){}if(M={X:c.left||f("left")||0,Y:c.top||f("top")||0,W:f("width")||E[0].scrollWidth||0,H:f("height")||E[0].scrollHeight||0,pX:a.pageX,pY:a.pageY,k:b.k},M1=!(!E1||"d"==b.k)&&{X:c.left||f1("left")||0,Y:c.top||f1("top")||0,W:E1[0].offsetWidth||f1("width")||0,H:E1[0].offsetHeight||f1("height")||0,pX:a.pageX,pY:a.pageY,k:b.k},$("input.hasDatepicker",E[0])[0])try{$("input.hasDatepicker",E[0]).datepicker("hide")}catch(a){}return $(document).mousemove($.jqDnR.drag).mouseup($.jqDnR.stop),!1})})},f=function(a){return parseInt(E.css(a),10)||!1},f1=function(a){return parseInt(E1.css(a),10)||!1};$.fn.tinyDraggable=function(a){var b=$.extend({handle:0,exclude:0},a);return this.each(function(){var a,c,d=$(this);(b.handle?$(b.handle,d):d).on({mousedown:function(e){if(!b.exclude||!~$.inArray(e.target,$(b.exclude,d))){e.preventDefault();var f=d.offset();a=e.pageX-f.left,c=e.pageY-f.top,$(document).on("mousemove.drag",function(b){d.offset({top:b.pageY-c,left:b.pageX-a})})}},mouseup:function(a){$(document).off("mousemove.drag")}})})},$.fn.jqm=function(a){var b={overlay:50,closeoverlay:!0,overlayClass:"jqmOverlay",closeClass:"jqmClose",trigger:".jqModal",ajax:F,ajaxText:"",target:F,modal:F,toTop:F,onShow:F,onHide:F,onLoad:F};return this.each(function(){if(this._jqm)return H[this._jqm].c=$.extend({},H[this._jqm].c,a);s++,this._jqm=s,H[s]={c:$.extend(b,$.jqm.params,a),a:F,w:$(this).addClass("jqmID"+s),s:s},b.trigger&&$(this).jqmAddTrigger(b.trigger)})},$.fn.jqmAddClose=function(a){return hs(this,a,"jqmHide")},$.fn.jqmAddTrigger=function(a){return hs(this,a,"jqmShow")},$.fn.jqmShow=function(a){return this.each(function(){$.jqm.open(this._jqm,a)})},$.fn.jqmHide=function(a){return this.each(function(){$.jqm.close(this._jqm,a)})},$.jqm={hash:{},open:function(a,b){var c=H[a],d=c.c,f="."+d.closeClass,g=parseInt(c.w.css("z-index"));g=g>0?g:3e3;var h=$("<div></div>").css({height:"100%",width:"100%",position:"fixed",left:0,top:0,"z-index":g-1,opacity:d.overlay/100});if(c.a)return F;if(c.t=b,c.a=!0,c.w.css("z-index",g),d.modal?(A[0]||setTimeout(function(){new L("bind")},1),A.push(a)):d.overlay>0?d.closeoverlay&&c.w.jqmAddClose(h):h=F,c.o=h?h.addClass(d.overlayClass).prependTo("body"):F,d.ajax){var i=d.target||c.w,j=d.ajax;i="string"==typeof i?$(i,c.w):$(i),j="@"===j.substr(0,1)?$(b).attr(j.substring(1)):j,i.html(d.ajaxText).load(j,function(){d.onLoad&&d.onLoad.call(this,c),f&&c.w.jqmAddClose($(f,c.w)),e(c)})}else f&&c.w.jqmAddClose($(f,c.w));return d.toTop&&c.o&&c.w.before('<span id="jqmP'+c.w[0]._jqm+'"></span>').insertAfter(c.o),d.onShow?d.onShow(c):c.w.show(),e(c),F},close:function(a){var b=H[a];return b.a?(b.a=F,A[0]&&(A.pop(),A[0]||new L("unbind")),b.c.toTop&&b.o&&$("#jqmP"+b.w[0]._jqm).after(b.w).remove(),b.c.onHide?b.c.onHide(b):(b.w.hide(),b.o&&b.o.remove()),F):F},params:{}};var s=0,H=$.jqm.hash,A=[],F=!1,e=function(a){void 0===a.c.focusField&&(a.c.focusField=0),a.c.focusField>=0&&f(a)},f=function(a){try{$(":input:visible",a.w)[parseInt(a.c.focusField,10)].focus()}catch(a){}},L=function(a){$(document)[a]("keypress",m)[a]("keydown",m)[a]("mousedown",m)},m=function(a){var b=H[A[A.length-1]],c=!$(a.target).parents(".jqmID"+b.s)[0];return c&&$(".jqmID"+b.s).each(function(){var b=$(this),d=b.offset();if(d.top<=a.pageY&&a.pageY<=d.top+b.height()&&d.left<=a.pageX&&a.pageX<=d.left+b.width())return c=!1,!1}),!c},hs=function(a,b,c){return a.each(function(){var a=this._jqm;$(b).each(function(){this[c]||(this[c]=[],$(this).click(function(){for(var a in{jqmShow:1,jqmHide:1})for(var b in this[a])H[this[a][b]]&&H[this[a][b]].w[a](this);return F})),this[c].push(a)})})};$.fmatter={},$.extend($.fmatter,{isBoolean:function(a){return"boolean"==typeof a},isObject:function(a){return a&&("object"==typeof a||$.isFunction(a))||!1},isString:function(a){return"string"==typeof a},isNumber:function(a){return"number"==typeof a&&isFinite(a)},isValue:function(a){return this.isObject(a)||this.isString(a)||this.isNumber(a)||this.isBoolean(a)},isEmpty:function(a){return!(!this.isString(a)&&this.isValue(a))&&(!this.isValue(a)||""===(a=$.trim(a).replace(/\&nbsp\;/gi,"").replace(/\&#160\;/gi,"")))}}),$.fn.fmatter=function(a,b,c,d,e){var f=b;c=$.extend({},$.jgrid.getRegional(this,"formatter"),c);try{f=$.fn.fmatter[a].call(this,b,c,d,e)}catch(a){}return f},$.fmatter.util={NumberFormat:function(a,b){if($.fmatter.isNumber(a)||(a*=1),$.fmatter.isNumber(a)){var c,d=a<0,e=String(a),f=b.decimalSeparator||".";if($.fmatter.isNumber(b.decimalPlaces)){var g=b.decimalPlaces;if(e=String(Number(Math.round(a+"e"+g)+"e-"+g)),c=e.lastIndexOf("."),g>0)for(c<0?(e+=f,c=e.length-1):"."!==f&&(e=e.replace(".",f));e.length-1-c<g;)e+="0"}if(b.thousandsSeparator){var h=b.thousandsSeparator;c=e.lastIndexOf(f),c=c>-1?c:e.length;var i,j=e.substring(c),k=-1;for(i=c;i>0;i--)k++,k%3==0&&i!==c&&(!d||i>1)&&(j=h+j),j=e.charAt(i-1)+j;e=j}return e=b.prefix?b.prefix+e:e,e=b.suffix?e+b.suffix:e}return a}},$.fn.fmatter.defaultFormat=function(a,b){return $.fmatter.isValue(a)&&""!==a?a:b.defaultValue||"&#160;"},$.fn.fmatter.email=function(a,b){return $.fmatter.isEmpty(a)?$.fn.fmatter.defaultFormat(a,b):'<a href="mailto:'+a+'">'+a+"</a>"},$.fn.fmatter.checkbox=function(a,b){var c,d=$.extend({},b.checkbox);return void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(d=$.extend({},d,b.colModel.formatoptions)),c=!0===d.disabled?'disabled="disabled"':"",($.fmatter.isEmpty(a)||void 0===a)&&(a=$.fn.fmatter.defaultFormat(a,d)),a=String(a),a=(a+"").toLowerCase(),'<input type="checkbox" '+(a.search(/(false|f|0|no|n|off|undefined)/i)<0?" checked='checked' ":"")+' value="'+a+'" offval="no" '+c+"/>"},$.fn.fmatter.link=function(a,b){var c={target:b.target},d="";return void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(c=$.extend({},c,b.colModel.formatoptions)),c.target&&(d="target="+c.target),$.fmatter.isEmpty(a)?$.fn.fmatter.defaultFormat(a,b):"<a "+d+' href="'+a+'">'+a+"</a>"},$.fn.fmatter.showlink=function(a,b){var c,d={baseLinkUrl:b.baseLinkUrl,showAction:b.showAction,addParam:b.addParam||"",target:b.target,idName:b.idName},e="";return void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(d=$.extend({},d,b.colModel.formatoptions)),d.target&&(e="target="+d.target),c=d.baseLinkUrl+d.showAction+"?"+d.idName+"="+b.rowId+d.addParam,$.fmatter.isString(a)||$.fmatter.isNumber(a)?"<a "+e+' href="'+c+'">'+a+"</a>":$.fn.fmatter.defaultFormat(a,b)},$.fn.fmatter.integer=function(a,b){var c=$.extend({},b.integer);return void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(c=$.extend({},c,b.colModel.formatoptions)),$.fmatter.isEmpty(a)?c.defaultValue:$.fmatter.util.NumberFormat(a,c)},$.fn.fmatter.number=function(a,b){var c=$.extend({},b.number);return void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(c=$.extend({},c,b.colModel.formatoptions)),$.fmatter.isEmpty(a)?c.defaultValue:$.fmatter.util.NumberFormat(a,c)},$.fn.fmatter.currency=function(a,b){var c=$.extend({},b.currency);return void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(c=$.extend({},c,b.colModel.formatoptions)),$.fmatter.isEmpty(a)?c.defaultValue:$.fmatter.util.NumberFormat(a,c)},$.fn.fmatter.date=function(a,b,c,d){var e=$.extend({},b.date);return void 0!==b.colModel&&void 0!==b.colModel.formatoptions&&(e=$.extend({},e,b.colModel.formatoptions)),e.reformatAfterEdit||"edit"!==d?$.fmatter.isEmpty(a)?$.fn.fmatter.defaultFormat(a,b):$.jgrid.parseDate.call(this,e.srcformat,a,e.newformat,e):$.fn.fmatter.defaultFormat(a,b)},$.fn.fmatter.select=function(a,b){a=String(a);var c,d,e=!1,f=[];if(void 0!==b.colModel.formatoptions?(e=b.colModel.formatoptions.value,c=void 0===b.colModel.formatoptions.separator?":":b.colModel.formatoptions.separator,d=void 0===b.colModel.formatoptions.delimiter?";":b.colModel.formatoptions.delimiter):void 0!==b.colModel.editoptions&&(e=b.colModel.editoptions.value,c=void 0===b.colModel.editoptions.separator?":":b.colModel.editoptions.separator,d=void 0===b.colModel.editoptions.delimiter?";":b.colModel.editoptions.delimiter),e){var g,h=!0==(null!=b.colModel.editoptions&&!0===b.colModel.editoptions.multiple),i=[];if(h&&(i=a.split(","),i=$.map(i,function(a){return $.trim(a)})),$.fmatter.isString(e)){var j,k=e.split(d),l=0;for(j=0;j<k.length;j++)if(g=k[j].split(c),g.length>2&&(g[1]=$.map(g,function(a,b){if(b>0)return a}).join(c)),h)$.inArray(g[0],i)>-1&&(f[l]=g[1],l++);else if($.trim(g[0])===$.trim(a)){f[0]=g[1];break}}else $.fmatter.isObject(e)&&(h?f=$.map(i,function(a){return e[a]}):f[0]=e[a]||"")}return a=f.join(", "),""===a?$.fn.fmatter.defaultFormat(a,b):a},$.fn.fmatter.rowactions=function(a){var b=$(this).closest("tr.jqgrow"),c=b.attr("id"),d=$(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/,"$1"),e=$("#"+d),f=e[0],g=f.p,h=g.colModel[$.jgrid.getCellIndex(this)],i=h.frozen?$("tr#"+c+" td:eq("+$.jgrid.getCellIndex(this)+") > div",e):$(this).parent(),j={extraparam:{}},k=function(a,b){$.isFunction(j.afterSave)&&j.afterSave.call(f,a,b),i.find("div.ui-inline-edit,div.ui-inline-del").show(),i.find("div.ui-inline-save,div.ui-inline-cancel").hide()},l=function(a){$.isFunction(j.afterRestore)&&j.afterRestore.call(f,a),i.find("div.ui-inline-edit,div.ui-inline-del").show(),i.find("div.ui-inline-save,div.ui-inline-cancel").hide()};if(void 0!==h.formatoptions){var m=$.extend(!0,{},h.formatoptions);j=$.extend(j,m)}void 0!==g.editOptions&&(j.editOptions=g.editOptions),void 0!==g.delOptions&&(j.delOptions=g.delOptions),b.hasClass("jqgrid-new-row")&&(j.extraparam[g.prmNames.oper]=g.prmNames.addoper);var n={keys:j.keys,oneditfunc:j.onEdit,successfunc:j.onSuccess,url:j.url,extraparam:j.extraparam,aftersavefunc:k,errorfunc:j.onError,afterrestorefunc:l,restoreAfterError:j.restoreAfterError,mtype:j.mtype};switch(a){case"edit":e.jqGrid("editRow",c,n),i.find("div.ui-inline-edit,div.ui-inline-del").hide(),i.find("div.ui-inline-save,div.ui-inline-cancel").show(),e.triggerHandler("jqGridAfterGridComplete");break;case"save":
e.jqGrid("saveRow",c,n)&&(i.find("div.ui-inline-edit,div.ui-inline-del").show(),i.find("div.ui-inline-save,div.ui-inline-cancel").hide(),e.triggerHandler("jqGridAfterGridComplete"));break;case"cancel":e.jqGrid("restoreRow",c,l),i.find("div.ui-inline-edit,div.ui-inline-del").show(),i.find("div.ui-inline-save,div.ui-inline-cancel").hide(),e.triggerHandler("jqGridAfterGridComplete");break;case"del":e.jqGrid("delGridRow",c,j.delOptions);break;case"formedit":e.jqGrid("setSelection",c),e.jqGrid("editGridRow",c,j.editOptions)}},$.fn.fmatter.actions=function(a,b){var c,d={keys:!1,editbutton:!0,delbutton:!0,editformbutton:!1},e=b.rowId,f="",g=$.jgrid.getRegional(this,"nav"),h=$.jgrid.styleUI[b.styleUI||"jQueryUI"].fmatter,i=$.jgrid.styleUI[b.styleUI||"jQueryUI"].common;if(void 0!==b.colModel.formatoptions&&(d=$.extend(d,b.colModel.formatoptions)),void 0===e||$.fmatter.isEmpty(e))return"";var j="onmouseover=jQuery(this).addClass('"+i.hover+"'); onmouseout=jQuery(this).removeClass('"+i.hover+"');  ";return d.editformbutton?(c="id='jEditButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); "+j,f+="<div title='"+g.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+c+"><span class='"+i.icon_base+" "+h.icon_edit+"'></span></div>"):d.editbutton&&(c="id='jEditButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); "+j,f+="<div title='"+g.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+c+"><span class='"+i.icon_base+" "+h.icon_edit+"'></span></div>"),d.delbutton&&(c="id='jDeleteButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); "+j,f+="<div title='"+g.deltitle+"' style='float:left;' class='ui-pg-div ui-inline-del' "+c+"><span class='"+i.icon_base+" "+h.icon_del+"'></span></div>"),c="id='jSaveButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); "+j,f+="<div title='"+g.savetitle+"' style='float:left;display:none' class='ui-pg-div ui-inline-save' "+c+"><span class='"+i.icon_base+" "+h.icon_save+"'></span></div>",c="id='jCancelButton_"+e+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); "+j,"<div style='margin-left:8px;'>"+(f+="<div title='"+g.canceltitle+"' style='float:left;display:none;' class='ui-pg-div ui-inline-cancel' "+c+"><span class='"+i.icon_base+" "+h.icon_cancel+"'></span></div>")+"</div>"},$.unformat=function(a,b,c,d){var e,f,g=b.colModel.formatter,h=b.colModel.formatoptions||{},i=/([\.\*\_\'\(\)\{\}\+\?\\])/g,j=b.colModel.unformat||$.fn.fmatter[g]&&$.fn.fmatter[g].unformat;if(void 0!==j&&$.isFunction(j))e=j.call(this,$(a).text(),b,a);else if(void 0!==g&&$.fmatter.isString(g)){var k,l=$.jgrid.getRegional(this,"formatter")||{};switch(g){case"integer":h=$.extend({},l.integer,h),f=h.thousandsSeparator.replace(i,"\\$1"),k=new RegExp(f,"g"),e=$(a).text().replace(k,"");break;case"number":h=$.extend({},l.number,h),f=h.thousandsSeparator.replace(i,"\\$1"),k=new RegExp(f,"g"),e=$(a).text().replace(k,"").replace(h.decimalSeparator,".");break;case"currency":h=$.extend({},l.currency,h),f=h.thousandsSeparator.replace(i,"\\$1"),k=new RegExp(f,"g"),e=$(a).text(),h.prefix&&h.prefix.length&&(e=e.substr(h.prefix.length)),h.suffix&&h.suffix.length&&(e=e.substr(0,e.length-h.suffix.length)),e=e.replace(k,"").replace(h.decimalSeparator,".");break;case"checkbox":var m=b.colModel.editoptions?b.colModel.editoptions.value.split(":"):["Yes","No"];e=$("input",a).is(":checked")?m[0]:m[1];break;case"select":e=$.unformat.select(a,b,c,d);break;case"actions":return"";default:e=$(a).text()}}return void 0!==e?e:!0===d?$(a).text():$.jgrid.htmlDecode($(a).html())},$.unformat.select=function(a,b,c,d){var e=[],f=$(a).text();if(!0===d)return f;var g=$.extend({},void 0!==b.colModel.formatoptions?b.colModel.formatoptions:b.colModel.editoptions),h=void 0===g.separator?":":g.separator,i=void 0===g.delimiter?";":g.delimiter;if(g.value){var j,k=g.value,l=!0===g.multiple,m=[];if(l&&(m=f.split(","),m=$.map(m,function(a){return $.trim(a)})),$.fmatter.isString(k)){var n,o=k.split(i),p=0;for(n=0;n<o.length;n++)if(j=o[n].split(h),j.length>2&&(j[1]=$.map(j,function(a,b){if(b>0)return a}).join(h)),l)$.inArray($.trim(j[1]),m)>-1&&(e[p]=j[0],p++);else if($.trim(j[1])===$.trim(f)){e[0]=j[0];break}}else($.fmatter.isObject(k)||$.isArray(k))&&(l||(m[0]=f),e=$.map(m,function(a){var b;if($.each(k,function(c,d){if(d===a)return b=c,!1}),void 0!==b)return b}));return e.join(", ")}return f||""},$.unformat.date=function(a,b){var c=$.jgrid.getRegional(this,"formatter.date")||{};return void 0!==b.formatoptions&&(c=$.extend({},c,b.formatoptions)),$.fmatter.isEmpty(a)?$.fn.fmatter.defaultFormat(a,b):$.jgrid.parseDate.call(this,c.newformat,a,c.srcformat,c)};var dragging,placeholders=$();$.fn.html5sortable=function(a){var b=String(a);return a=$.extend({connectWith:!1},a),this.each(function(){var c;if(/^enable|disable|destroy$/.test(b))return c=$(this).children($(this).data("items")).attr("draggable","enable"===b),void("destroy"===b&&c.add(this).removeData("connectWith items").off("dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s"));var d,e;c=$(this).children(a.items);var f=$("<"+(/^ul|ol$/i.test(this.tagName)?"li":/^tbody$/i.test(this.tagName)?"tr":"div")+' class="sortable-placeholder '+a.placeholderClass+'">').html("&nbsp;");c.find(a.handle).mousedown(function(){d=!0}).mouseup(function(){d=!1}),$(this).data("items",a.items),placeholders=placeholders.add(f),a.connectWith&&$(a.connectWith).add(this).data("connectWith",a.connectWith),c.attr("draggable","true").on("dragstart.h5s",function(b){if(a.handle&&!d)return!1;d=!1;var c=b.originalEvent.dataTransfer;c.effectAllowed="move",c.setData("Text","dummy"),e=(dragging=$(this)).addClass("sortable-dragging").index()}).on("dragend.h5s",function(){dragging&&(dragging.removeClass("sortable-dragging").show(),placeholders.detach(),e!==dragging.index()&&dragging.parent().trigger("sortupdate",{item:dragging,startindex:e,endindex:dragging.index()}),dragging=null)}).not("a[href], img").on("selectstart.h5s",function(){return this.dragDrop&&this.dragDrop(),!1}).end().add([this,f]).on("dragover.h5s dragenter.h5s drop.h5s",function(b){return!c.is(dragging)&&a.connectWith!==$(dragging).parent().data("connectWith")||("drop"===b.type?(b.stopPropagation(),placeholders.filter(":visible").after(dragging),dragging.trigger("dragend.h5s"),!1):(b.preventDefault(),b.originalEvent.dataTransfer.dropEffect="move",c.is(this)?(a.forcePlaceholderSize&&f.height(dragging.outerHeight()),dragging.hide(),$(this)[f.index()<$(this).index()?"after":"before"](f),placeholders.not(f).detach()):placeholders.is(this)||$(this).children(a.items).length||(placeholders.detach(),$(this).append(f)),!1))})})},$.extend($.jgrid,{stringify:function(a){return JSON.stringify(a,function(a,b){return"function"==typeof b?b.toString():b})},parseFunc:function(str){return JSON.parse(str,function(key,value){if("string"==typeof value&&-1!==value.indexOf("function")){var sv=value.split(" ");return sv[0]=$.trim(sv[0].toLowerCase()),0===sv[0].indexOf("function")&&"}"===value.trim().slice(-1)?eval("("+value+")"):value}return value})},encode:function(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},jsonToXML:function(a,b){var c=$.extend({xmlDecl:'<?xml version="1.0" encoding="UTF-8" ?>\n',attr_prefix:"-",encode:!0},b||{}),d=this,e=function(a,b){return"#text"===a?c.encode?d.encode(b):b:"function"==typeof b?"<"+a+"><![CDATA["+b+"]]></"+a+">\n":""===b?"<"+a+">__EMPTY_STRING_</"+a+">\n":"<"+a+">"+(c.encode?d.encode(b):b)+"</"+a+">\n"},f=function(a,b){for(var c=[],d=0;d<b.length;d++){var h=b[d];void 0===h||null==h?c[c.length]="<"+a+" />":"object"==typeof h&&h.constructor==Array?c[c.length]=f(a,h):c[c.length]="object"==typeof h?g(a,h):e(a,h)}return c.length||(c[0]="<"+a+">__EMPTY_ARRAY_</"+a+">\n"),c.join("")},g=function(a,b){var h=[],i=[];for(var j in b)if(b.hasOwnProperty(j)){var k=b[j];j.charAt(0)!==c.attr_prefix?null==k?h[h.length]="<"+j+" />":"object"==typeof k&&k.constructor===Array?h[h.length]=f(j,k):h[h.length]="object"==typeof k?g(j,k):e(j,k):i[i.length]=" "+j.substring(1)+'="'+(c.encode?d.encode(k):k)+'"'}var l=i.join(""),m=h.join("");return null==a||(m=h.length>0?m.match(/\n/)?"<"+a+l+">\n"+m+"</"+a+">\n":"<"+a+l+">"+m+"</"+a+">\n":"<"+a+l+" />\n"),m},h=g(null,a);return c.xmlDecl+h},xmlToJSON:function(root,options){var o=$.extend({force_array:[],attr_prefix:"-"},options||{});if(root){var __force_array={};if(o.force_array)for(var i=0;i<o.force_array.length;i++)__force_array[o.force_array[i]]=1;"string"==typeof root&&(root=$.parseXML(root)),root.documentElement&&(root=root.documentElement);var addNode=function(hash,key,cnts,val){if("string"==typeof val)if(-1!==val.indexOf("function"))val=eval("("+val+")");else switch(val){case"__EMPTY_ARRAY_":val=[];break;case"__EMPTY_STRING_":val="";break;case"false":val=!1;break;case"true":val=!0}__force_array[key]?(1===cnts&&(hash[key]=[]),hash[key][hash[key].length]=val):1===cnts?hash[key]=val:2===cnts?hash[key]=[hash[key],val]:hash[key][hash[key].length]=val},parseElement=function(a){if(7!==a.nodeType){if(3===a.nodeType||4===a.nodeType){if(null==a.nodeValue.match(/[^\x00-\x20]/))return;return a.nodeValue}var b,c,d,e,f={};if(a.attributes&&a.attributes.length)for(b={},c=0;c<a.attributes.length;c++)"string"==typeof(d=a.attributes[c].nodeName)&&(e=a.attributes[c].nodeValue)&&(d=o.attr_prefix+d,void 0===f[d]&&(f[d]=0),f[d]++,addNode(b,d,f[d],e));if(a.childNodes&&a.childNodes.length){var g=!0;for(b&&(g=!1),c=0;c<a.childNodes.length&&g;c++){var h=a.childNodes[c].nodeType;3!==h&&4!==h&&(g=!1)}if(g)for(b||(b=""),c=0;c<a.childNodes.length;c++)b+=a.childNodes[c].nodeValue;else for(b||(b={}),c=0;c<a.childNodes.length;c++)"string"==typeof(d=a.childNodes[c].nodeName)&&(e=parseElement(a.childNodes[c]))&&(void 0===f[d]&&(f[d]=0),f[d]++,addNode(b,d,f[d],e))}return b}},json=parseElement(root);if(__force_array[root.nodeName]&&(json=[json]),11!==root.nodeType){var tmp={};tmp[root.nodeName]=json,json=tmp}return json}},saveAs:function(a,b,c){c=$.extend(!0,{type:"plain/text;charset=utf-8"},c||{});var d,e,f=[];b=null==b||""===b?"jqGridFile.txt":b,$.isArray(a)?f=a:f[0]=a;try{d=new File(f,b,c)}catch(a){d=new Blob(f,c)}if(window.navigator&&window.navigator.msSaveOrOpenBlob)window.navigator.msSaveOrOpenBlob(d,b);else{e=URL.createObjectURL(d);var g=document.createElement("a");g.href=e,g.download=b,document.body.appendChild(g),g.click(),setTimeout(function(){document.body.removeChild(g),window.URL.revokeObjectURL(e)},0)}}}),$.jgrid=$.jgrid||{},$.extend($.jgrid,{formatCell:function(a,b,c,d,e,f){var g;if(void 0!==d.formatter){var h={rowId:"",colModel:d,gid:e.p.id,pos:b,styleUI:"",isExported:!0,exporttype:f};g=$.isFunction(d.formatter)?d.formatter.call(e,a,h,c):$.fmatter?$.fn.fmatter.call(e,d.formatter,a,h,c):a}else g=a;return g},formatCellCsv:function(a,b){a=null==a?"":String(a);try{a=a.replace(b._regexsep,b.separatorReplace).replace(/\r\n/g,b.replaceNewLine).replace(/\n/g,b.replaceNewLine)}catch(b){a=""}return b.escquote&&(a=a.replace(b._regexquot,b.escquote+b.quote)),-1!==a.indexOf(b.separator)&&-1!==a.indexOf(b.qoute)||(a=b.quote+a+b.quote),a},excelCellPos:function(a){for(var b="A".charCodeAt(0),c="Z".charCodeAt(0),d=c-b+1,e="";a>=0;)e=String.fromCharCode(a%d+b)+e,a=Math.floor(a/d)-1;return e},makeNode:function(a,b,c){var d=a.createElement(b);return c&&(c.attr&&$(d).attr(c.attr),c.children&&$.each(c.children,function(a,b){d.appendChild(b)}),c.text&&d.appendChild(a.createTextNode(c.text))),d},xmlToZip:function(a,b){var c,d,e,f,g,h,i=this,j=new XMLSerializer,k=-1===j.serializeToString($.parseXML($.jgrid.excelStrings["xl/worksheets/sheet1.xml"])).indexOf("xmlns:r"),l=[];$.each(b,function(b,m){if($.isPlainObject(m))c=a.folder(b),i.xmlToZip(c,m);else{if(k){for(d=m.childNodes[0],e=d.attributes.length-1;e>=0;e--){var n=d.attributes[e].nodeName,o=d.attributes[e].nodeValue;-1!==n.indexOf(":")&&(l.push({name:n,value:o}),d.removeAttribute(n))}for(e=0,f=l.length;e<f;e++)g=m.createAttribute(l[e].name.replace(":","_dt_b_namespace_token_")),g.value=l[e].value,d.setAttributeNode(g)}h=j.serializeToString(m),k&&(-1===h.indexOf("<?xml")&&(h='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+h),h=h.replace(/_dt_b_namespace_token_/g,":")),h=h.replace(/<row xmlns="" /g,"<row ").replace(/<cols xmlns="">/g,"<cols>").replace(/<mergeCells xmlns="" /g,"<mergeCells "),a.file(b,h)}})},excelStrings:{"_rels/.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',"xl/_rels/workbook.xml.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',"[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml" /><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Default Extension="jpeg" ContentType="image/jpeg" /><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" /><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" /></Types>',"xl/workbook.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/><workbookPr showInkAnnotation="0" autoCompressPictures="0"/><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/></bookViews><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>',"xl/worksheets/sheet1.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><sheetData/></worksheet>',"xl/styles.xml":'<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><numFmts count="7"><numFmt numFmtId="164" formatCode="#,##0.00_- [$$-45C]"/><numFmt numFmtId="165" formatCode="&quot;Â£&quot;#,##0.00"/><numFmt numFmtId="166" formatCode="[$â‚¬-2] #,##0.00"/><numFmt numFmtId="167" formatCode="0.0%"/><numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/><numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/><numFmt numFmtId="170" formatCode="yyyy/mm/dd;@"/></numFmts><fonts count="5" x14ac:knownFonts="1"><font><sz val="11" /><name val="Calibri" /></font><font><sz val="11" /><name val="Calibri" /><color rgb="FFFFFFFF" /></font><font><sz val="11" /><name val="Calibri" /><b /></font><font><sz val="11" /><name val="Calibri" /><i /></font><font><sz val="11" /><name val="Calibri" /><u /></font></fonts><fills count="6"><fill><patternFill patternType="none" /></fill><fill/><fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD99795" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="ffc6efce" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="ffc6cfef" /><bgColor indexed="64" /></patternFill></fill></fills><borders count="2"><border><left /><right /><top /><bottom /><diagonal /></border><border diagonalUp="false" diagonalDown="false"><left style="thin"><color auto="1" /></left><right style="thin"><color auto="1" /></right><top style="thin"><color auto="1" /></top><bottom style="thin"><color auto="1" /></bottom><diagonal /></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" /></cellStyleXfs><cellXfs count="67"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="left"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="fill"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment textRotation="90"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment wrapText="1"/></xf><xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="1" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="2" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="170" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0" /></cellStyles><dxfs count="0" /><tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" /></styleSheet>'},excelParsers:[{match:/^\-?\d+\.\d%$/,style:60,fmt:function(a){return a/100}},{match:/^\-?\d+\.?\d*%$/,style:56,fmt:function(a){return a/100}},{match:/^\-?\$[\d,]+.?\d*$/,style:57},{match:/^\-?Â£[\d,]+.?\d*$/,style:58},{match:/^\-?â‚¬[\d,]+.?\d*$/,style:59},{match:/^\-?\d+$/,style:65},{match:/^\-?\d+\.\d{2}$/,style:66},{match:/^\([\d,]+\)$/,style:61,fmt:function(a){return-1*a.replace(/[\(\)]/g,"")}},{match:/^\([\d,]+\.\d{2}\)$/,style:62,fmt:function(a){return-1*a.replace(/[\(\)]/g,"")}},{match:/^\-?[\d,]+$/,style:63},{match:/^\-?[\d,]+\.\d{2}$/,style:64},{match:/^\d{4}\-\d{2}\-\d{2}$/,style:67}]}),$.jgrid.extend({exportToCsv:function(a){a=$.extend(!0,{separator:",",separatorReplace:" ",quote:'"',escquote:'"',newLine:"\r\n",replaceNewLine:" ",includeCaption:!0,includeLabels:!0,includeGroupHeader:!0,includeFooter:!0,fileName:"jqGridExport.csv",mimetype:"text/csv;charset=utf-8",returnAsString:!1},a||{});var b="";if(this.each(function(){function c(a,b){function c(a,b,c){var d,e=!1;if(0===b)e=c[a];else{var f=c[a].idx;if(0===f)e=c[a];else for(d=a;d>=0;d--)if(c[d].idx===f-b){e=c[d];break}}return e}function d(a,d,e,f){var g,h,j=c(a,d,e),k=j.cnt,n=new Array(b.collen),o=0;for(h=f;h<m;h++)if(l[h]._excol){var p="{0}";$.each(j.summary,function(){if(this.nm===l[h].name){l[h].summaryTpl&&(p=l[h].summaryTpl),"string"==typeof this.st&&"avg"===this.st.toLowerCase()&&(this.sd&&this.vd?this.v=this.v/this.vd:this.v&&k>0&&(this.v=this.v/k));try{this.groupCount=j.cnt,this.groupIndex=j.dataIndex,this.groupValue=j.value,g=i.formatter("",this.v,h,this)}catch(a){g=this.v}return n[o]=$.jgrid.formatCellCsv($.jgrid.stripHtml($.jgrid.template(p,g)),b),!1}}),o++}return n}var e="",f=i.p.groupingView,g=[],h=f.groupField.length,l=i.p.colModel,m=l.length,n=0;$.each(l,function(a,b){var c;for(c=0;c<h;c++)if(f.groupField[c]===b.name){g[c]=a;break}});var o,p,q=$.makeArray(f.groupSummary);if(q.reverse(),"local"===i.p.datatype&&!i.p.loadonce){$(i).jqGrid("groupingSetup");for(var r=$.jgrid.getMethod("groupingPrepare"),s=0;s<k;s++)r.call($(i),j[s],s)}return $.each(f.groups,function(c,j){n++;try{o=$.isArray(f.formatDisplayField)&&$.isFunction(f.formatDisplayField[j.idx])?f.formatDisplayField[j.idx].call(i,j.displayValue,j.value,i.p.colModel[g[j.idx]],j.idx,f):i.formatter("",j.displayValue,g[j.idx],j.value)}catch(a){o=j.displayValue}var k="";"string"!=typeof(k=$.isFunction(f.groupText[j.idx])?f.groupText[j.idx].call(i,o,j.cnt,j.summary):$.jgrid.template(f.groupText[j.idx],o,j.cnt,j.summary))&&"number"!=typeof k&&(k=o);var m;if(m="header"===f.groupSummaryPos[j.idx]?d(c,0,f.groups,0):new Array(b.collen),m[0]=$.jgrid.formatCellCsv($.jgrid.stripHtml(k),b),e+=m.join(b.separator)+b.newLine,h-1===j.idx){var r,s,t,u=f.groups[c+1],v=0,w=j.startRow,x=void 0!==u?u.startRow:f.groups[c].startRow+f.groups[c].cnt;for(r=w;r<x&&a[r-v];r++){for(t=a[r-v],p=0,s=0;s<l.length;s++)l[s]._expcol&&(m[p]=$.jgrid.formatCellCsv($.jgrid.formatCell(t[l[s].name],s,t,l[s],i,"csv"),b),p++);e+=m.join(b.separator)+b.newLine}if("header"!==f.groupSummaryPos[j.idx]){var y;if(void 0!==u){for(y=0;y<f.groupField.length&&u.dataIndex!==f.groupField[y];y++);n=f.groupField.length-y}for(s=0;s<n;s++)q[s]&&(m=d(c,s,f.groups,0),e+=m.join(b.separator)+b.newLine);n=y}}}),e}a._regexsep=new RegExp(a.separator,"g"),a._regexquot=new RegExp(a.quote,"g");var d,e,f,g,h,i=this,j=this.addLocalData(!0),k=j.length,l=i.p.colModel,m=l.length,n=i.p.colNames,o=0,p="",q="",r="",s="",t="",u=[],v=[];if($.each(l,function(b,c){c._expcol=!0,void 0===c.exportcol?c.hidden&&(c._expcol=!1):c._expcol=c.exportcol,"cb"!==c.name&&"rn"!==c.name&&"subgrid"!==c.name||(c._expcol=!1),c._expcol&&(u.push($.jgrid.formatCellCsv(n[b],a)),v.push(c.name))}),a.includeLabels&&(t=u.join(a.separator)+a.newLine),a.collen=u.length,i.p.grouping){var w=!!i.p.groupingView._locgr;i.p.groupingView._locgr=!1,p+=c(j,a),i.p.groupingView._locgr=w}else for(;o<k;){for(e=j[o],f=[],g=0,d=0;d<m;d++)l[d]._expcol&&(f[g]=$.jgrid.formatCellCsv($.jgrid.formatCell(e[l[d].name],d,e,l[d],i,"csv"),a),g++);p+=f.join(a.separator)+a.newLine,o++}if(j=null,f=new Array(a.collen),a.includeCaption&&i.p.caption){for(o=a.collen;--o;)f[o]="";f[0]=$.jgrid.formatCellCsv(i.p.caption,a),q+=f.join(a.separator)+a.newLine}if(a.includeGroupHeader&&i.p.groupHeader&&i.p.groupHeader.length){var x=i.p.groupHeader;for(d=0;d<x.length;d++){var y=x[d].groupHeaders;for(o=0,f=[],h=0;h<v.length;h++){for(f[o]="",g=0;g<y.length;g++)y[g].startColumnName===v[h]&&(f[o]=$.jgrid.formatCellCsv(y[g].titleText,a));o++}r+=f.join(a.separator)+a.newLine}}if(a.includeFooter&&i.p.footerrow){if($(".ui-jqgrid-ftable",this.sDiv).length){var z=$(i).jqGrid("footerData","get");for(d=0,f=[];d<a.collen;){var A=v[d];z.hasOwnProperty(A)&&f.push($.jgrid.formatCellCsv($.jgrid.stripHtml(z[A]),a)),d++}s+=f.join(a.separator)+a.newLine}}b=q+r+t+p+s}),a.returnAsString)return b;$.jgrid.saveAs(b,a.fileName,{type:a.mimetype})},exportToExcel:function(a){a=$.extend(!0,{includeLabels:!0,includeGroupHeader:!0,includeFooter:!0,fileName:"jqGridExport.xlsx",mimetype:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",maxlength:40,onBeforeExport:null,replaceStr:null},a||{}),this.each(function(){function b(a){return a.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g,"")}function c(a){function b(a,b,c){var d,e=!1;if(0===b)e=c[a];else{var f=c[a].idx;if(0===f)e=c[a];else for(d=a;d>=0;d--)if(c[d].idx===f-b){e=c[d];break}}return e}function c(a,c,e,g){var h,j,k=b(a,c,e),m=k.cnt,o=d(n.header);for(j=g;j<i;j++)if(l[j]._expcol){var p="{0}";$.each(k.summary,function(){if(this.nm===l[j].name){l[j].summaryTpl&&(p=l[j].summaryTpl),"string"==typeof this.st&&"avg"===this.st.toLowerCase()&&(this.sd&&this.vd?this.v=this.v/this.vd:this.v&&m>0&&(this.v=this.v/m));try{this.groupCount=k.cnt,this.groupIndex=k.dataIndex,this.groupValue=k.value,h=f.formatter("",this.v,j,this)}catch(a){h=this.v}return o[this.nm]=$.jgrid.stripHtml($.jgrid.template(p,h)),!1}})}return o}function d(a){for(var b={},c=0;c<a.length;c++)b[a[c]]="";return b}var e=f.p.groupingView,g=[],h=e.groupField.length,i=l.length,j=0;$.each(l,function(a,b){var c;for(c=0;c<h;c++)if(e.groupField[c]===b.name){g[c]=a;break}});var k,m=$.makeArray(e.groupSummary);if(m.reverse(),"local"===f.p.datatype&&!f.p.loadonce){$(f).jqGrid("groupingSetup");for(var o=$.jgrid.getMethod("groupingPrepare"),p=0;p<n.body.length;p++)o.call($(f),n.body[p],p)}$.each(e.groups,function(b,i){j++;try{k=$.isArray(e.formatDisplayField)&&$.isFunction(e.formatDisplayField[i.idx])?e.formatDisplayField[i.idx].call(f,i.displayValue,i.value,f.p.colModel[g[i.idx]],i.idx,e):f.formatter("",i.displayValue,g[i.idx],i.value)}catch(a){k=i.displayValue}var l="";"string"!=typeof(l=$.isFunction(e.groupText[i.idx])?e.groupText[i.idx].call(f,k,i.cnt,i.summary):$.jgrid.template(e.groupText[i.idx],k,i.cnt,i.summary))&&"number"!=typeof l&&(l=k);var o;if(o="header"===e.groupSummaryPos[i.idx]?c(b,0,e.groups,0):d(n.header),o[Object.keys(o)[0]]=$.jgrid.stripHtml(new Array(5*i.idx).join(" ")+l),r(o,!0),h-1===i.idx){var p,q,s=e.groups[b+1],t=0,u=i.startRow,v=void 0!==s?s.startRow:e.groups[b].startRow+e.groups[b].cnt;for(p=u;p<v&&a[p-t];p++){var w=a[p-t];r(w,!1)}if("header"!==e.groupSummaryPos[i.idx]){var x;if(void 0!==s){for(x=0;x<e.groupField.length&&s.dataIndex!==e.groupField[x];x++);j=e.groupField.length-x}for(q=0;q<j;q++)m[q]&&(o=c(b,q,e.groups,0),r(o,!0));j=x}}})}
var d,e,f=this,g=$.jgrid.excelStrings,h=0,i=$.parseXML(g["xl/worksheets/sheet1.xml"]),j=i.getElementsByTagName("sheetData")[0],k={_rels:{".rels":$.parseXML(g["_rels/.rels"])},xl:{_rels:{"workbook.xml.rels":$.parseXML(g["xl/_rels/workbook.xml.rels"])},"workbook.xml":$.parseXML(g["xl/workbook.xml"]),"styles.xml":$.parseXML(g["xl/styles.xml"]),worksheets:{"sheet1.xml":i}},"[Content_Types].xml":$.parseXML(g["[Content_Types].xml"])},l=f.p.colModel,m=0,n={body:f.addLocalData(!0),header:[],footer:[],width:[],map:[]};for(d=0,e=l.length;d<e;d++)l[d]._expcol=!0,void 0===l[d].exportcol?l[d].hidden&&(l[d]._expcol=!1):l[d]._expcol=l[d].exportcol,"cb"!==l[d].name&&"rn"!==l[d].name&&"subgrid"!==l[d].name&&l[d]._expcol&&(n.header[m]=l[d].name,n.width[m]=5,n.map[m]=d,m++);var o,p,q=$.isFunction(a.replaceStr)?a.replaceStr:b,r=function(b,c){o=h+1,p=$.jgrid.makeNode(i,"row",{attr:{r:o}});for(var d=15,e=0;e<n.header.length;e++){var g,k,m=$.jgrid.excelCellPos(e)+""+o,r=$.isArray(b)&&c?f.p.colNames[n.map[e]]:b[n.header[e]];null==r&&(r=""),c||(r=$.jgrid.formatCell(r,n.map[e],b,l[n.map[e]],f,"excel")),n.width[e]=Math.max(n.width[e],Math.min(parseInt(r.toString().length,10),a.maxlength)),r.match&&(k=r.match(/^-?([1-9]\d+)(\.(\d+))?$/)),g=null;for(var s=0,t=$.jgrid.excelParsers.length;s<t;s++){var u=$.jgrid.excelParsers[s];if(r.match&&!r.match(/^0\d+/)&&r.match(u.match)){r=r.replace(/[^\d\.\-]/g,""),u.fmt&&(r=u.fmt(r)),g=67===u.style?$.jgrid.makeNode(i,"c",{attr:{t:"d",r:m,s:u.style},children:[$.jgrid.makeNode(i,"v",{text:r})]}):$.jgrid.makeNode(i,"c",{attr:{r:m,s:u.style},children:[$.jgrid.makeNode(i,"v",{text:r})]}),p.appendChild(g);break}}if(!g){if("number"==typeof r&&r.toString().length<=d||k&&k[1].length+(k[2]?k[3].length:0)<=d)g=$.jgrid.makeNode(i,"c",{attr:{t:"n",r:m},children:[$.jgrid.makeNode(i,"v",{text:r})]});else{var v=r.replace?q(r):r;g=$.jgrid.makeNode(i,"c",{attr:{t:"inlineStr",r:m},children:{row:$.jgrid.makeNode(i,"is",{children:{row:$.jgrid.makeNode(i,"t",{text:v})}})}})}p.appendChild(g)}}j.appendChild(p),h++};if($("sheets sheet",k.xl["workbook.xml"]).attr("name",a.sheetName),a.includeGroupHeader&&f.p.groupHeader&&f.p.groupHeader.length){var s,t,u=f.p.groupHeader,v=[],w=0;for(t=0;t<u.length;t++){var x=u[t].groupHeaders,y={};for(w++,d=0,d=0;d<n.header.length;d++){s=n.header[d],y[s]="";for(var z=0;z<x.length;z++)if(x[z].startColumnName===s){y[s]=x[z].titleText;var A=$.jgrid.excelCellPos(d)+w,B=$.jgrid.excelCellPos(d+x[z].numberOfColumns-1)+w;v.push({ref:A+":"+B})}}r(y,!0)}$("row c",i).attr("s","2");var C=$.jgrid.makeNode(i,"mergeCells",{attr:{count:v.length}});for($("worksheet",i).append(C),m=0;m<v.length;m++)C.appendChild($.jgrid.makeNode(i,"mergeCell",{attr:v[m]}))}if(a.includeLabels&&(r(n.header,!0),$("row:last c",i).attr("s","2")),f.p.grouping){var D=!!f.p.groupingView._locgr;f.p.groupingView._locgr=!1,c(n.body),f.p.groupingView._locgr=D}else for(var E=0,F=n.body.length;E<F;E++)r(n.body[E],!1);if(a.includeFooter||f.p.footerrow){n.footer=$(f).jqGrid("footerData","get");for(m in n.footer)n.footer.hasOwnProperty(m)&&(n.footer[m]=$.jgrid.stripHtml(n.footer[m]));r(n.footer,!0),$("row:last c",i).attr("s","2")}var G=$.jgrid.makeNode(i,"cols");for($("worksheet",i).prepend(G),m=0,e=n.width.length;m<e;m++)G.appendChild($.jgrid.makeNode(i,"col",{attr:{min:m+1,max:m+1,width:n.width[m],customWidth:1}}));$.isFunction(a.onBeforeExport)&&a.onBeforeExport(k,h),n=null;try{var H=new JSZip,I={type:"blob",mimeType:a.mimetype};$.jgrid.xmlToZip(H,k),H.generateAsync?H.generateAsync(I).then(function(b){$.jgrid.saveAs(b,a.fileName,{type:a.mimetype})}):$.jgrid.saveAs(H.generate(I),a.fileName,{type:a.mimetype})}catch(a){throw a}})},exportToPdf:function(a){return a=$.extend(!0,{title:null,orientation:"portrait",pageSize:"A4",description:null,onBeforeExport:null,download:"download",includeLabels:!0,includeGroupHeader:!0,includeFooter:!0,fileName:"jqGridExport.pdf",mimetype:"application/pdf"},a||{}),this.each(function(){function b(a){function b(a,b){for(var c=0,d=[],e=0;e<l.length;e++)j={text:null==a[l[e]]?"":b?$.jgrid.formatCell(a[l[e]]+"",n[c],k[m],p[n[c]],g,"pdf"):a[l[e]],alignment:q[e],style:"tableBody"},d.push(j),c++;return d}function c(a,b,c){var d,e=!1;if(0===b)e=c[a];else{var f=c[a].idx;if(0===f)e=c[a];else for(d=a;d>=0;d--)if(c[d].idx===f-b){e=c[d];break}}return e}function d(a,b,d,f){var h,i,j=c(a,b,d),k=j.cnt,m=e(l);for(i=f;i<r;i++)if(p[i]._expcol){var n="{0}";$.each(j.summary,function(){if(this.nm===p[i].name){p[i].summaryTpl&&(n=p[i].summaryTpl),"string"==typeof this.st&&"avg"===this.st.toLowerCase()&&(this.sd&&this.vd?this.v=this.v/this.vd:this.v&&k>0&&(this.v=this.v/k));try{this.groupCount=j.cnt,this.groupIndex=j.dataIndex,this.groupValue=j.value,h=g.formatter("",this.v,i,this)}catch(a){h=this.v}return m[this.nm]=$.jgrid.stripHtml($.jgrid.template(n,h)),!1}})}return m}function e(a){for(var b={},c=0;c<a.length;c++)b[a[c]]="";return b}var f=g.p.groupingView,i=[],o=f.groupField.length,p=g.p.colModel,r=p.length,s=0;$.each(p,function(a,b){var c;for(c=0;c<o;c++)if(f.groupField[c]===b.name){i[c]=a;break}});var t,u=$.makeArray(f.groupSummary);if(u.reverse(),"local"===g.p.datatype&&!g.p.loadonce){$(g).jqGrid("groupingSetup");for(var v=$.jgrid.getMethod("groupingPrepare"),w=0;w<k.length;w++)v.call($(g),k[w],w)}$.each(f.groups,function(c,j){s++;try{t=$.isArray(f.formatDisplayField)&&$.isFunction(f.formatDisplayField[j.idx])?f.formatDisplayField[j.idx].call(g,j.displayValue,j.value,g.p.colModel[i[j.idx]],j.idx,f):g.formatter("",j.displayValue,i[j.idx],j.value)}catch(a){t=j.displayValue}var k="";"string"!=typeof(k=$.isFunction(f.groupText[j.idx])?f.groupText[j.idx].call(g,t,j.cnt,j.summary):$.jgrid.template(f.groupText[j.idx],t,j.cnt,j.summary))&&"number"!=typeof k&&(k=t);var m;if(m="header"===f.groupSummaryPos[j.idx]?d(c,0,f.groups,0):e(l),m[Object.keys(m)[0]]=$.jgrid.stripHtml(new Array(5*j.idx).join(" ")+k),h.push(b(m,!1)),o-1===j.idx){var n,p,q=f.groups[c+1],r=0,v=j.startRow,w=void 0!==q?q.startRow:f.groups[c].startRow+f.groups[c].cnt;for(n=v;n<w&&a[n-r];n++){var x=a[n-r];h.push(b(x,!0))}if("header"!==f.groupSummaryPos[j.idx]){var y;if(void 0!==q){for(y=0;y<f.groupField.length&&q.dataIndex!==f.groupField[y];y++);s=f.groupField.length-y}for(p=0;p<s;p++)u[p]&&(m=d(c,p,f.groups,0),h.push(b(m,!1)));s=y}}})}var c,d,e,f,g=this,h=[],i=g.p.colModel,j={},k=g.addLocalData(!0),l=[],m=0,n=[],o=[],p=[],q={};for(c=0,d=i.length;c<d;c++)i[c]._expcol=!0,void 0===i[c].exportcol?i[c].hidden&&(i[c]._expcol=!1):i[c]._expcol=i[c].exportcol,"cb"!==i[c].name&&"rn"!==i[c].name&&"subgrid"!==i[c].name&&i[c]._expcol&&(j={text:g.p.colNames[c],style:"tableHeader"},o.push(j),l[m]=i[c].name,n[m]=c,p.push(i[c].width),q[i[c].name]=i[c].align||"left",m++);var r;if(a.includeGroupHeader&&g.p.groupHeader&&g.p.groupHeader.length)for(r=g.p.groupHeader,m=0;m<r.length;m++){var s=[],t=r[m].groupHeaders;for(e=0;e<l.length;e++){for(j={text:"",style:"tableHeader"},f=0;f<t.length;f++)t[f].startColumnName===l[e]&&(j={text:t[f].titleText,colSpan:t[f].numberOfColumns,style:"tableHeader"});s.push(j),c++}h.push(s)}if(a.includeLabels&&h.push(o),g.p.grouping){var u=!!g.p.groupingView._locgr;g.p.groupingView._locgr=!1,b(k),g.p.groupingView._locgr=u}else{var v;for(m=0,d=k.length;m<d;m++){for(f=0,o=[],v=k[m],e=0;e<l.length;e++)j={text:null==v[l[e]]?"":$.jgrid.formatCell(v[l[e]]+"",n[f],k[m],i[n[f]],g,"pdf"),alignment:q[l[e]],style:"tableBody"},o.push(j),f++;h.push(o)}}if(a.includeFooter&&g.p.footerrow){var w=$(g).jqGrid("footerData","get");for(o=[],e=0;e<l.length;e++)j={text:$.jgrid.stripHtml(w[l[e]]),style:"tableFooter",alignment:q[l[e]]},o.push(j);h.push(o)}var x={pageSize:a.pageSize,pageOrientation:a.orientation,content:[{style:"tableExample",widths:p,table:{headerRows:null!=r?0:1,body:h}}],styles:{tableHeader:{bold:!0,fontSize:11,color:"#2e6e9e",fillColor:"#dfeffc",alignment:"center"},tableBody:{fontSize:10},tableFooter:{bold:!0,fontSize:11,color:"#2e6e9e",fillColor:"#dfeffc"},title:{alignment:"center",fontSize:15},description:{}},defaultStyle:{fontSize:10}};a.description&&x.content.unshift({text:a.description,style:"description",margin:[0,0,0,12]}),a.title&&x.content.unshift({text:a.title,style:"title",margin:[0,0,0,12]}),$.isFunction(a.onBeforeExport)&&a.onBeforeExport.call(g,x);try{var y=pdfMake.createPdf(x);"open"===a.download?y.open():y.getBuffer(function(b){$.jgrid.saveAs(b,a.fileName,{type:a.mimetype})})}catch(a){throw a}})},exportToHtml:function(a){a=$.extend(!0,{title:"",onBeforeExport:null,includeLabels:!0,includeGroupHeader:!0,includeFooter:!0,tableClass:"jqgridprint",autoPrint:!1,topText:"",bottomText:"",returnAsString:!1},a||{});var b;return this.each(function(){function c(a){function b(a,b,c){var d,e=!1;if(0===b)e=c[a];else{var f=c[a].idx;if(0===f)e=c[a];else for(d=a;d>=0;d--)if(c[d].idx===f-b){e=c[d];break}}return e}function c(a,c,e,h){var j,l,m=b(a,c,e),n=m.cnt,o=d(i.header);for(l=h;l<k;l++)if(g[l]._expcol){var p="{0}";$.each(m.summary,function(){if(this.nm===g[l].name){g[l].summaryTpl&&(p=g[l].summaryTpl),"string"==typeof this.st&&"avg"===this.st.toLowerCase()&&(this.sd&&this.vd?this.v=this.v/this.vd:this.v&&n>0&&(this.v=this.v/n));try{this.groupCount=m.cnt,this.groupIndex=m.dataIndex,this.groupValue=m.value,j=f.formatter("",this.v,l,this)}catch(a){j=this.v}return o[this.nm]=$.jgrid.stripHtml($.jgrid.template(p,j)),!1}})}return o}function d(a){for(var b={},c=0;c<a.length;c++)b[a[c]]="";return b}var e=f.p.groupingView,h=[],j=e.groupField.length,k=g.length,l=0,m="";$.each(g,function(a,b){var c;for(c=0;c<j;c++)if(e.groupField[c]===b.name){h[c]=a;break}});var o,p=$.makeArray(e.groupSummary);if(p.reverse(),"local"===f.p.datatype&&!f.p.loadonce){$(f).jqGrid("groupingSetup");for(var q=$.jgrid.getMethod("groupingPrepare"),r=0;r<i.body.length;r++)q.call($(f),i.body[r],r)}return $.each(e.groups,function(b,g){l++;try{o=$.isArray(e.formatDisplayField)&&$.isFunction(e.formatDisplayField[g.idx])?e.formatDisplayField[g.idx].call(f,g.displayValue,g.value,f.p.colModel[h[g.idx]],g.idx,e):f.formatter("",g.displayValue,h[g.idx],g.value)}catch(a){o=g.displayValue}var k="";"string"!=typeof(k=$.isFunction(e.groupText[g.idx])?e.groupText[g.idx].call(f,o,g.cnt,g.summary):$.jgrid.template(e.groupText[g.idx],o,g.cnt,g.summary))&&"number"!=typeof k&&(k=o);var q,r=!1;if("header"===e.groupSummaryPos[g.idx]?q=c(b,0,e.groups,0):(q=d(i.header),r=!0),q[Object.keys(q)[0]]=new Array(5*g.idx).join(" ")+k,m+=n(q,"td",!1,1===l,r),j-1===g.idx){var s,t,u=e.groups[b+1],v=0,w=g.startRow,x=void 0!==u?u.startRow:e.groups[b].startRow+e.groups[b].cnt;for(s=w;s<x&&a[s-v];s++){var y=a[s-v];m+=n(y,"td",!1)}if("header"!==e.groupSummaryPos[g.idx]){var z;if(void 0!==u){for(z=0;z<e.groupField.length&&u.dataIndex!==e.groupField[z];z++);l=e.groupField.length-z}for(t=0;t<l;t++)p[t]&&(q=c(b,t,e.groups,0),m+=n(q,"td",!1));l=z}}}),m}var d,e,f=this,g=f.p.colModel,h=0,i={body:f.addLocalData(!0),header:[],footer:[],width:[],map:[],align:[]};for(d=0,e=g.length;d<e;d++)g[d]._expcol=!0,void 0===g[d].exportcol?g[d].hidden&&(g[d]._expcol=!1):g[d]._expcol=g[d].exportcol,"cb"!==g[d].name&&"rn"!==g[d].name&&"subgrid"!==g[d].name&&g[d]._expcol&&(i.header[h]=g[d].name,i.width[h]=g[d].width,i.map[h]=d,i.align[h]=g[d].align||"left",h++);var j=document.createElement("a"),k=function(a){var b=$(a).clone()[0];return"link"===b.nodeName.toLowerCase()&&(b.href=l(b.href)),b.outerHTML},l=function(a){j.href=a;var b=j.host;return-1===b.indexOf("/")&&0!==j.pathname.indexOf("/")&&(b+="/"),j.protocol+"//"+b+j.pathname+j.search},m=function(a,b,c){for(var d,e="<tr>",g=0,h=a.length;g<h;g++)d=!0===c?" style=width:"+i.width[g]+"px;":"",e+="<"+b+d+">"+f.p.colNames[i.map[g]]+"</"+b+">";return e+"</tr>"},n=function(a,b,c,d,e){for(var h,j,k="<tr>",l=0,m=i.header.length;l<m&&(j=e?' colspan= "'+i.header.length+'" style=text-align:left':!0===d?" style=width:"+i.width[l]+"px;text-align:"+i.align[l]+";":" style=text-align:"+i.align[l]+";",h=i.header[l],a.hasOwnProperty(h)&&(k+="<"+b+j+">"+(c?$.jgrid.formatCell(a[h],i.map[l],a,g[i.map[l]],f,"html"):a[h])+"</"+b+">"),!e);l++);return k+"</tr>"},o='<table class="'+a.tableClass+'">';if(a.includeLabels&&(o+="<thead>"+m(i.header,"th",!0)+"</thead>"),o+="<tbody>",f.p.grouping){var p=!!f.p.groupingView._locgr;f.p.groupingView._locgr=!1,o+=c(i.body),f.p.groupingView._locgr=p}else for(var h=0,e=i.body.length;h<e;h++)o+=n(i.body[h],"td",!0,0===h);if(a.includeFooter&&f.p.footerrow&&(i.footer=$(f).jqGrid("footerData","get",null,!1),o+=n(i.footer,"td",!1)),o+="</tbody>",o+="</table>",a.returnAsString)b=o;else{var q=window.open("","");q.document.close();var r=a.title?"<title>"+a.title+"</title>":"";$("style, link").each(function(){r+=k(this)});try{q.document.head.innerHTML=r}catch(a){$(q.document.head).html(r)}q.document.body.innerHTML=(a.title?"<h1>"+a.title+"</h1>":"")+"<div>"+(a.topText||"")+"</div>"+o+"<div>"+(a.bottomText||"")+"</div>",$(q.document.body).addClass("html-view"),$("img",q.document.body).each(function(a,b){b.setAttribute("src",l(b.getAttribute("src")))}),a.onBeforeExport&&a.onBeforeExport(q),Boolean(q.chrome)?a.autoPrint&&(q.print(),q.close()):setTimeout(function(){a.autoPrint&&(q.print(),q.close())},1e3)}}),b}})});
//# sourceMappingURL=jquery.jqGrid.min.js.map

/*global jQuery, define */
(function( factory ) {
	"use strict";
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"../grid.base"
		], factory );
	} else {
		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

$.jgrid = $.jgrid || {};
if(!$.jgrid.hasOwnProperty("regional")) {
	$.jgrid.regional = [];
}
$.jgrid.regional["en"] = {
	defaults : {
		recordtext: "View {0} - {1} of {2}",
		emptyrecords: "No records to view",
		loadtext: "Loading...",
		savetext: "Saving...",
		pgtext : "Page {0} of {1}",
		pgfirst : "First Page",
		pglast : "Last Page",
		pgnext : "Next Page",
		pgprev : "Previous Page",
		pgrecs : "Records per Page",
		showhide: "Toggle Expand Collapse Grid"
	},
	search : {
		caption: "Search...",
		Find: "Find",
		Reset: "Reset",
		odata: [{ oper:'eq', text:'equal'},{ oper:'ne', text:'not equal'},{ oper:'lt', text:'less'},{ oper:'le', text:'less or equal'},{ oper:'gt', text:'greater'},{ oper:'ge', text:'greater or equal'},{ oper:'bw', text:'begins with'},{ oper:'bn', text:'does not begin with'},{ oper:'in', text:'is in'},{ oper:'ni', text:'is not in'},{ oper:'ew', text:'ends with'},{ oper:'en', text:'does not end with'},{ oper:'cn', text:'contains'},{ oper:'nc', text:'does not contain'},{ oper:'nu', text:'is null'},{ oper:'nn', text:'is not null'}],
		groupOps: [{ op: "AND", text: "all" },{ op: "OR",  text: "any" }],
		operandTitle : "Click to select search operation.",
		resetTitle : "Reset Search Value"
	},
	edit : {
		addCaption: "Add Record",
		editCaption: "Edit Record",
		bSubmit: "Submit",
		bCancel: "Cancel",
		bClose: "Close",
		saveData: "Data has been changed! Save changes?",
		bYes : "Yes",
		bNo : "No",
		bExit : "Cancel",
		msg: {
			required:"Field is required",
			number:"Please, enter valid number",
			minValue:"value must be greater than or equal to ",
			maxValue:"value must be less than or equal to",
			email: "is not a valid e-mail",
			integer: "Please, enter valid integer value",
			date: "Please, enter valid date value",
			url: "is not a valid URL. Prefix required ('http://' or 'https://')",
			nodefined : " is not defined!",
			novalue : " return value is required!",
			customarray : "Custom function should return array!",
			customfcheck : "Custom function should be present in case of custom checking!"
			
		}
	},
	view : {
		caption: "View Record",
		bClose: "Close"
	},
	del : {
		caption: "Delete",
		msg: "Delete selected record(s)?",
		bSubmit: "Delete",
		bCancel: "Cancel"
	},
	nav : {
		edittext: "",
		edittitle: "Edit selected row",
		addtext:"",
		addtitle: "Add new row",
		deltext: "",
		deltitle: "Delete selected row",
		searchtext: "",
		searchtitle: "Find records",
		refreshtext: "",
		refreshtitle: "Reload Grid",
		alertcap: "Warning",
		alerttext: "Please, select row",
		viewtext: "",
		viewtitle: "View selected row",
		savetext: "",
		savetitle: "Save row",
		canceltext: "",
		canceltitle : "Cancel row editing"
	},
	col : {
		caption: "Select columns",
		bSubmit: "Ok",
		bCancel: "Cancel"
	},
	errors : {
		errcap : "Error",
		nourl : "No url is set",
		norecords: "No records to process",
		model : "Length of colNames <> colModel!"
	},
	formatter : {
		integer : {thousandsSeparator: ",", defaultValue: '0'},
		number : {decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, defaultValue: '0.00'},
		currency : {decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "", suffix:"", defaultValue: '0.00'},
		date : {
			dayNames:   [
				"Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat",
				"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			],
			monthNames: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
			],
			AmPm : ["am","pm","AM","PM"],
			S: function (j) {return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th';},
			srcformat: 'Y-m-d',
			newformat: 'n/j/Y',
			parseRe : /[#%\\\/:_;.,\t\s-]/,
			masks : {
				// see http://php.net/manual/en/function.date.php for PHP format used in jqGrid
				// and see http://docs.jquery.com/UI/Datepicker/formatDate
				// and https://github.com/jquery/globalize#dates for alternative formats used frequently
				// one can find on https://github.com/jquery/globalize/tree/master/lib/cultures many
				// information about date, time, numbers and currency formats used in different countries
				// one should just convert the information in PHP format
				ISO8601Long:"Y-m-d H:i:s",
				ISO8601Short:"Y-m-d",
				// short date:
				//    n - Numeric representation of a month, without leading zeros
				//    j - Day of the month without leading zeros
				//    Y - A full numeric representation of a year, 4 digits
				// example: 3/1/2012 which means 1 March 2012
				ShortDate: "n/j/Y", // in jQuery UI Datepicker: "M/d/yyyy"
				// long date:
				//    l - A full textual representation of the day of the week
				//    F - A full textual representation of a month
				//    d - Day of the month, 2 digits with leading zeros
				//    Y - A full numeric representation of a year, 4 digits
				LongDate: "l, F d, Y", // in jQuery UI Datepicker: "dddd, MMMM dd, yyyy"
				// long date with long time:
				//    l - A full textual representation of the day of the week
				//    F - A full textual representation of a month
				//    d - Day of the month, 2 digits with leading zeros
				//    Y - A full numeric representation of a year, 4 digits
				//    g - 12-hour format of an hour without leading zeros
				//    i - Minutes with leading zeros
				//    s - Seconds, with leading zeros
				//    A - Uppercase Ante meridiem and Post meridiem (AM or PM)
				FullDateTime: "l, F d, Y g:i:s A", // in jQuery UI Datepicker: "dddd, MMMM dd, yyyy h:mm:ss tt"
				// month day:
				//    F - A full textual representation of a month
				//    d - Day of the month, 2 digits with leading zeros
				MonthDay: "F d", // in jQuery UI Datepicker: "MMMM dd"
				// short time (without seconds)
				//    g - 12-hour format of an hour without leading zeros
				//    i - Minutes with leading zeros
				//    A - Uppercase Ante meridiem and Post meridiem (AM or PM)
				ShortTime: "g:i A", // in jQuery UI Datepicker: "h:mm tt"
				// long time (with seconds)
				//    g - 12-hour format of an hour without leading zeros
				//    i - Minutes with leading zeros
				//    s - Seconds, with leading zeros
				//    A - Uppercase Ante meridiem and Post meridiem (AM or PM)
				LongTime: "g:i:s A", // in jQuery UI Datepicker: "h:mm:ss tt"
				SortableDateTime: "Y-m-d\\TH:i:s",
				UniversalSortableDateTime: "Y-m-d H:i:sO",
				// month with year
				//    Y - A full numeric representation of a year, 4 digits
				//    F - A full textual representation of a month
				YearMonth: "F, Y" // in jQuery UI Datepicker: "MMMM, yyyy"
			},
			reformatAfterEdit : false,
			userLocalTime : false
		},
		baseLinkUrl: '',
		showAction: '',
		target: '',
		checkbox : {disabled:true},
		idName : 'id'
	}
};
}));

var _IIFE_search = (function ($, root) {
    'use strict';
    //region local methods
    var _local = {
        beforeProcessing_callback: function (data) {
            var $self = $(this),
                model = data.model,
                name, $colHeader, $sortingIcons;
            if (model) {
                for (name in model) {
                    if (model[name].hidden) {
                        $("#list").hideCol(name);
                    } else if (model.hasOwnProperty(name)) {
                        $colHeader = $("#jqgh_" + $.jgrid.jqID(this.id + "_" + name));
                        $sortingIcons = $colHeader.find(">span.s-ico");
                        $colHeader.text(model[name].label);
                        $colHeader.append($sortingIcons);
                    }
                }
            }

            if (data.css == undefined || data.css == "") {
                var fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", ffEngineUrl + "/styles/hostedform.css");
                document.getElementsByTagName("head")[0].appendChild(fileref);
            } else {
                var styleElem = data.css;
                $(styleElem).appendTo("head");
            }

        },
        onSelectRow_callback: function (id) {
            $('#list').find('tr').removeClass('rowSelected');
            $('#' + id).addClass('rowSelected');
            var celValue = $('#list').jqGrid('getCell', id, 0);
            if (celValue.indexOf("<a") > -1)
                celValue = stripLink(celValue);

            var json = '{"resultType" : "Lookup","selectedId" : "' + id + '", "selectedName" : "' + celValue + '", "sourceField" : "' + getSourceFieldName() + '"}';

            if (window.name == 'embedcode-iframe-on') {
                window.parent.frames['ffEmbedFrame'].postMessage(json, '*');
            } else {
                window.parent.postMessage(json, '*');
            }
        },
        loadError_callback: function (err) {
            $('#ffOverlay').removeClass('ff-overlay-image');
            $('.ff-form-main-lookup').before("<div>No records found.</div>")
        },
        gridComplete_callback: function (data) {

            $('#ffOverlay').removeClass('ff-overlay-image');
            $(".ui-jqgrid-btable").addClass('ff-group-row');
            $(".ui-jqgrid-btable").css('margin', '0px');
            $("td[role='gridcell']").addClass('ff-label');
            $("td[role='gridcell']").css('white-space', 'normal');
            $("td[role='gridcell']").css('word-break', 'break-all');
            $("th[role='columnheader']").addClass('ff-label');
            $("td#input_pager").addClass('ff-label');
            $(".ff-form-main-lookup").attr('id', 'dvFastForms');
            $(".ui-jqgrid-sortable").css('white-space', 'normal');
            $(".ui-jqgrid-sortable").css('word-break', 'break-all');

            $(".ff-form-main-lookup #gbox_list").addClass('ff-form-main');
            $(".ff-form-main-lookup #gbox_list").css('border', 'none');
            $(".ff-form-main-lookup #gbox_list").css('box-shadow', 'none');

            $(".ff-form-main-lookup input[type='text']").addClass("ff-input-type");
            $(".ff-form-main-lookup input[type='text']").addClass("ff-type-text");
            $(".ff-form-main-lookup input[type='text']").addClass("ff-label");
            var mainRowColor = $(".ff-group-row").css('background-color');
            var altRowColor = setAlternateColor(mainRowColor);
            // ALternate color for every other row
            $('.jqgrow:odd').css('background-color', altRowColor);

            var footerElem = $(".ff-form-main-lookup #pager");

            $(footerElem).addClass("ff-group-row");
            $(footerElem).css("cssText", "margin: 10px 0px !important; padding: 0px !important;");

            var headerElem = $(".ff-form-main-lookup .ui-jqgrid-hbox");

            $(headerElem).addClass("ff-group-row");
            $(headerElem).css("cssText", "margin: 5px 0px !important; padding: 0px !important;");

            $('.ff-form-main-lookup').show();
            $(window).trigger('resize');
        },
        searchV1: function (searchText) {
            $('#list').jqGrid('filterInput', searchText);
        },
        searchV2: function (searchText) {
            SEARCH_INFO['lookupParams']['searchText'] = searchText;
            this.fetchGridData();
        },
        buildSearchUrl: function () {
            var lookupUrl = '';
            if (getSearchInfoProp('isNative')) {
                lookupUrl = getSearchInfoProp('sitePrefix') + '/services/apexrest/' + getSearchInfoProp('namespacePrefix') + 'FFNLookupData/' + getSearchInfoProp('searchVersion');
            } else {
                // Classic web API controller
                var relativePath = '/api/FFNLookupDataV2';
                lookupUrl = getSearchInfoProp('sitePrefix') + relativePath;
            }

            if (SEARCH_INFO['lookupParams'] != null) {
                lookupUrl += '?';
                var searchInfoObj = getSearchInfoProp('lookupParams');
                var counterIndex = 0;
                for (var paramName in searchInfoObj) {
                    if (searchInfoObj.hasOwnProperty(paramName)) {
                        if (counterIndex > 0) {
                            lookupUrl += '&';
                        }
                        lookupUrl += paramName + '=' + getSearchInfoProp('lookupParams', paramName);
                        counterIndex++;
                    }
                }
            }
            SEARCH_INFO["lookupUrl"] = lookupUrl;

        },
        fetchGridData: function () {
            var lookupUrlWithSearch = getSearchInfoProp('lookupUrl') + '&searchtext=' + fixedEncodeURIComponent(getSearchInfoProp('lookupParams', 'searchText'));
            $("#list").setGridParam({ url: lookupUrlWithSearch, datatype:'json', page:1}).trigger('reloadGrid');
        }
    };
    //endregion   
    root.initLookup = function () {
        $('#ffOverlay').addClass('ff-overlay-image');
        $('.ff-form-main-lookup').hide();
        SEARCH_INFO['columnModelArray'] = getColumnModelList();
        SEARCH_INFO['columnNamesArray'] = getSearchInfoProp('columnModelArray').map(function (item) {
            return item.name;
        });
        /// GRID_LOAD
        loadGrid();
        setupSearchControl();
        $(window).on('resize', function () {
            resizeGrid();
        });
    },
        root.loadGrid = function () {
            console.log('loadGrid...Start');
            _local.buildSearchUrl();
            $("#list").jqGrid({
                url: getSearchInfoProp("lookupUrl"),
                datatype: 'json',
                colNames: getSearchInfoProp("columnNamesArray"),
                colModel: getSearchInfoProp("columnModelArray"),
                rowNum: 10,
                shrinkToFit: true,
                hoverrows: true,
                toolbar: [true, "top"],
                rowList: [],
                pager: "#pager",
                gridview: false,
                rownumbers: false,
                sortname: "c1",
                viewrecords: false,
                sortorder: "asc",
                altRows: true,
                jsonReader: {
                    root: "data"
                },
                beforeProcessing: _local.beforeProcessing_callback,
                loadonce: true,
                height: "auto",
                regional: "en",
                onSelectRow: _local.onSelectRow_callback,
                loadError: _local.loadError_callback,
                gridComplete: _local.gridComplete_callback
            });
        },

        root.getColumnModelList = function () {
            var colNamesArr = [];
            for (var index = 1; index <= 15; index++) {
                colNamesArr.push({
                    'name': 'c' + index
                });
            }
            return colNamesArr;
        },
        root.setAlternateColor = function (rgbtext) {
            var delta = 30;
            if (rgbtext.indexOf('#') != 0)
                rgbtext = rgb2hex(rgbtext);
            var r, g, b, txt;
            r = parseInt(rgbtext.substr(1, 2), 16),
                g = parseInt(rgbtext.substr(3, 2), 16),
                b = parseInt(rgbtext.substr(5, 2), 16);

            if (rgbtext == '#000000') {
                r += delta;
                if (r > 255) r = 255;
                if (r < 0) r = 0;
                g += delta;
                if (g > 255) g = 255;
                if (g < 0) g = 0;
                b += delta;
                if (b > 255) b = 255;
                if (b < 0) b = 0;
            } else {
                r -= delta;
                if (r > 255) r = 255;
                if (r < 0) r = 0;
                g -= delta;
                if (g > 255) g = 255;
                if (g < 0) g = 0;
                b -= delta;
                if (b > 255) b = 255;
                if (b < 0) b = 0;
            }

            txt = b.toString(16);
            if (txt.length < 2) txt = "0" + txt;
            txt = g.toString(16) + txt;
            if (txt.length < 4) txt = "0" + txt;
            txt = r.toString(16) + txt;
            if (txt.length < 6) txt = "0" + txt;

            return "#" + txt;
        },
        root.LookupDone = function () {
            var grid = $("#list");
            var selectedRowId = grid.jqGrid('getGridParam', 'selrow');
            var cellValue = grid.jqGrid('getCell', selectedRowId, 'columnName');
            $('#ffLookupDialog', top.document).dialog('close');
        },
        root.getSourceFieldName = function () {
            var regex = new RegExp("[\\?&]lf=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        root.setupSearchControl = function () {
            $('#t_list')
                .append($("<div><input id=\"globalSearchText\" class=\"ff-input-type ff-type-text\" type=\"text\" placeholder=\"search...\"></input>&nbsp;" +
                    "<input type=\"button\" id=\"globalSearch\" class=\"ff-btn-submit\" value=\"Search\" /></div>"));


            $("#globalSearchText").keypress(function (e) {
                var key = e.charCode || e.keyCode || 0;
                if (key === 13) { // 13
                    executeSearch($("#globalSearchText").val());
                }
            });
            $("#globalSearch").click(function () {
                // searchV1/searchV2
                executeSearch($("#globalSearchText").val());
                return false;
            });

        },
        root.executeSearch = function (searchText) {
            if (getSearchInfoProp('isSearchV2')) {
                _local.searchV2(searchText);
            } else {
                _local.searchV1(searchText);
            }
        }
    root.stripLink = function (html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        var text = div.textContent || div.innerText || "";
        return text;
    },
        root.resizeGrid = function () {
            var $grid = $("#list"),
                newWidth = $(".ff-form-main-lookup").width();
            $grid.jqGrid("setGridWidth", newWidth, true);

            var groupHeaders = $grid.jqGrid("getGridParam", "groupHeader");
            if (groupHeaders != null) {
                $grid.jqGrid("destroyGroupHeader").jqGrid("setGroupHeaders", groupHeaders);
            }
        },
        root.rgb2hex = function (rgb) {
            if (rgb == "rgba(0, 0, 0, 0)") {
                rgb = "#FFFFFF";
                return rgb;
            } else {
                rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                return (rgb && rgb.length === 4) ? "#" +
                    ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
            }
        },
        root.getSearchInfoProp = function (propName, nestedPropName) {
            if (SEARCH_INFO != null && SEARCH_INFO[propName] != null) {
                if (nestedPropName === undefined) {
                    return SEARCH_INFO[propName];
                } else {
                    return SEARCH_INFO[propName][nestedPropName];
                }
            }
            return '';
        },
        root.fixedEncodeURIComponent = function (str) {
            return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        }
})(this.jQuery = this.jQuery || {}, window = this.window || {});
// This code is used for JS Unit Test.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = _IIFE_search;
}