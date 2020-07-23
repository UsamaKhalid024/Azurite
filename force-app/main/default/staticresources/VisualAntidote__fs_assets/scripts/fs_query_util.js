/** Add JQuery utility methods in this file which are to be used by Form Engine/Builder process:
 ** which does not include business logic
 ** primarily being used to do writing/reading data to/from fs variables, performing string manipulations, Null refrence checks etc 
 * @summary 
 */
(function (root, window, factoryMethod) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['fs', 'window'], factoryMethod);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function (root, window) {
            return factoryMethod(root, window);
        };
    } else {
        var libObject = factoryMethod(root, window);
        root.Query = libObject.Query;
        root.Q = libObject.Query;
    }
}(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function (fs, window) {
    'use strict';
    var document = window.document;
    var $ = fs;
    if (window["fscore"] == null) {
        window["fscore"] = {};
    }

    /** repalce _Utils
     * utility methods
     */
    var _Utils ={};
    _Utils = {
        isCHROME : (BROWSER_NAME=='chrome')?true:false,
        isSAFARI : (BROWSER_NAME=='safari')?true:false,
        isMSIE :    (BROWSER_NAME=='msie')?true:false,
        isFIREFOX :(BROWSER_NAME=='firefox')?true:false,
        isMSEDGE  : (BROWSER_NAME=='msedge')?true:false,
        isOPERA  : (BROWSER_NAME=='opera')?true:false,
        isFSDebugModeOn : (typeof isFSDebugModeOn !== 'undefined') ? this.getSafeBoolean(isFSDebugModeOn,false):false,
        initialize: function () {
            window["fscore"] = {};
        },
        getFSCoreProperty: function (propName, defaultValue) {
            return ((window["fscore"] != null) ? (window["fscore"][propName] != null ? window["fscore"][propName] : defaultValue) : defaultValue);
        }
    };
    /**
     * get current browser name [chrome,safari,firefox,msie,msedge,opera]
     * @private
     */
    var getCurrentBrowser = function(){
        var browserName='';
        var ua = window.navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (window.navigator.userAgent.match(/Edge/i) || window.navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
            browserName = 'msedge';
        }
        else {
            if(ua!=null && ua.length>0){
                browserName = ua[1].toLowerCase();
            }
        }
        return browserName;
    };
    var BROWSER_NAME= getCurrentBrowser();

    /**
     * custom selector to select dom elements by an element id,class or tag  using Javascript instead of jQuery
     */
    var _Query = {};
    /**
     * @description validate if passed parameter is a supported selector for our custom selector function if not return
     * @param {string} selector  an element id,class or tag or group of those
     * @example #dvFastForms .ff-item-row or #dvFastForms OR #dvFastForms #btnprev OR #dvFastForms .ff-item-row li
     * @private
     */
    var isCurrentSelectorNotSupported = function (selector) {
        if (selector === undefined || selector === '' || selector.lastIndexOf('#') > 0 || selector.indexOf(':') > 0 || selector.indexOf('>') >= 0) {
            return true; // i.e. current selector is not supported
        }
        return false;
    };
    var shouldUseJQueryAsSelector = function () {
        if (_Utils.getFSCoreProperty('UseJQuery', false)) {
            return true;
        } else if (_Utils.isMSIE) {
            // Lightning slow performance issues are not impacting IE because Locker strict plocies are disabled in IE
            // So let's keep using jQuery since our custom selector uses document.querySelectorAll as fallback which is not supported in IE browsers
            return true;
        }
        return false;
    };
    /**
     * get element by using querySelectorAll or jQuery selection methods
     * @summary it is a fallback to our custom element selector method fs.Q
     * @see {@link _Query} for further information.
     * @param {string} selector an element id,class or tag or group of those
     * @private
     * @returns 
     * a non-live NodeList from {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll|Document.querySelectorAll} 
     * OR formstack jQuery object (fs) in case FallbackToQuerySelectorAll is false. It is FALSE by default for now
     */
    var defaultSelector = function (selector) {
        selector = selector.trim();
        var selectorItemsArray = selector.split(' ');
        if (selectorItemsArray.length >= 2) {
            var firstSelector = selectorItemsArray[0];
            firstSelector = selector.substr(0, firstSelector.length);
            var nestedSelector = selector.substr(firstSelector.length + 1);
           
            if (_Utils.getFSCoreProperty('FallbackToQuerySelectorAll', false)) {
                return document.querySelectorAll(selector);
            } else {
                //_Utils.log.debug('falling back to jQuery');
                // fs.find  will make our query more selective then simply using fs(selector)
                return fs(firstSelector).find(nestedSelector.trim());
            }
        } else {
            if (_Utils.getFSCoreProperty('FallbackToQuerySelectorAll', false)) {
                return document.querySelectorAll(selector);
            } else {
                //_Utils.log.debug('falling back to jQuery');
                return fs(selector);
            }
        }
    };
    /**
     * Internal helper to bind a function known to have 3 arguments
     * to a given context.
     */
    var bindInternal3 = function bindInternal3(func, thisContext) {
        return function (a, b, c) {
            return func.call(thisContext, a, b, c);
        };
    };
    /**
     * # For Each
     *
     * A object `.forEach()` implementation.
     *
     * @param  {Object}   subject     The object to iterate over.
     * @param  {Function} fn          The visitor function.
     * @param  {Object}   thisContext The context for the visitor.
     */
    var forEachObject = function ForEachObject(subject, fn, thisContext) {
        var keys = Object.keys(subject),
            length = keys.length,
            iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
            key, i;
        for (i = 0; i < length; i++) {
            key = keys[i];
            if (typeof (subject[key]) !== "object"| key === 'prevObject' ) {
                continue;
            }
            iterator(subject[key], key, subject);
        }
    };
    /**
     * # For Each
     *
     * A Array `.forEach()` implementation.
     *
     * @param  {Array}    subject     The array (or array-like) to iterate over.
     * @param  {Function} fn          The visitor function.
     * @param  {Object}   thisContext The context for the visitor.
     */
    var forEachArray = function ForEach(subject, fn, thisContext) {
        var length = subject.length,
            iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
            i;
        for (i = 0; i < length; i++) {
            iterator(subject[i], i, subject);
        }
    };
    _Query = {
        /**
         * @description fs.Q function will be our custom selector to select elements using Javascript instead of jQuery
         * @todo some selectors are not supported see examples below. So for those we will be falling back to jQuery for now
         * @param {string} selector element id,class or tag
         * @example fs.Q.S('#dvFastForms') or fs.Q.S('#dvFastForms .ff-item-row')
         * @example //Multiple Id elements e.g. 
         * fs.Q.S('#dvFastForms #btnprev') 
         * //Or Id element is not first selector e.g. 
         * fs.Q.S('.ff-footer-row #btnnext')
         * //Or other complex selectors like 
         * $('.ff-footer-row> ul >li') 
         * //etc for those we will fallback to jQUERY
         * @param {element} rootElement element passed by nested call.
         * @param {string} originalSelector original selector even in nested call. In nested call, first param 'selector' becomes the individual selector in case of multiple selector string.
         * @example //In following example : 
         * fs.Q.S('#dvFastForms .ff-item-row .ff-item-label')
         * // In first call selector param will be `#dvFastForms` and then in nested call it will be `.ff-item-row and` in last nested call it will be `.ff-item-label` . Whereas originalSelector will be #dvFastForms .ff-item-row .ff-item-label
         */
        S: function (selector, rootElement, originalSelector) {
            var selectorType = 'querySelectorAll';
            try {
                if (shouldUseJQueryAsSelector()) {
                    return fs(selector);
                }
                if (selector.indexOf(',') >= 0) {
                    _Utils.log.debug('[fs.Q.S] more then 1 selectors found:' + selector);
                    var selectorList = selector.split(',');
                    var selectorListItemsCount = selectorList.length;
                    var elementsArrayBySelector = [];
                    for (var itemIndex = 0; itemIndex < selectorListItemsCount; itemIndex++) {
                        _Utils.log.debug('[fs.Q.S] selector item on index ' + itemIndex + ':' + selectorList[itemIndex]);
                        elementsArrayBySelector.push(_Query.S(selectorList[itemIndex]));
                    }
                    return elementsArrayBySelector;
                }
                if (isCurrentSelectorNotSupported(selector)) {
                    return defaultSelector(selector);
                }
                var selectorItemsArray = selector.split(' ');
                var firstSelector = selectorItemsArray[0];
                if (selector.indexOf('#') === 0) {
                    selectorType = 'getElementById';
                    firstSelector = selector.substr(1, firstSelector.length - 1);
                } else if (selector.indexOf('.') === 0) {
                    selectorType = 'getElementsByClassName';
                    firstSelector = selector.substr(1, firstSelector.length - 1);
                } else if (originalSelector !== undefined && originalSelector !== null) {
                    return defaultSelector(originalSelector);
                } else {
                    throw 'Something went wrong while finding element by [fs.Q.S].';
                }
                if (firstSelector.trim().lastIndexOf('.') > 0) {
                    // if we have selector with multiple classnames like .ff-item-row.ff-label-col let's use querySelectorAll 
                    // In that case
                    // let's put back the first character of original selector 
                    // which we removed thinking of there is only one selector in getElementById and getElementByClassName filter above
                    // so that it goes back to .ff-item-row.ff-label-col from ff-item-row.ff-label-col
                    firstSelector = selector.substr(0, 1) + firstSelector;
                    // and use querySelectorAll
                    selectorType = 'querySelectorAll';
                }
                if (selectorItemsArray.length >= 2) {
                    var nestedSelector = selector.substr(firstSelector.length + 1);
                    rootElement = document[selectorType](firstSelector);
                    _Utils.log.debug('[fs.Q.S] nestedSelector:' + nestedSelector.trimLeft());
                    return _Query.S(nestedSelector.trimLeft(), rootElement, selector);
                } else if (rootElement !== undefined && rootElement !== null) {
                    // rootElement could be single element or array of elements
                    _Utils.log.debug('[fs.Q.S] rootElement -> firstSelector:' + firstSelector);
                    if (rootElement[selectorType] instanceof Function) {
                        return fs(rootElement[selectorType](firstSelector));
                    } else if (rootElement.length !== undefined) {
                        // if we get an array of elements then let's loop through items
                        var nodeElements = [];
                        var rootElementsCount = rootElement.length;
                        var indx = 0;
                        for (indx; indx < rootElementsCount; indx++) {
                            var elem = rootElement[indx][selectorType](firstSelector);
                            if (elem) {
                                nodeElements.push(fs(rootElement[indx][selectorType](firstSelector)));
                            }
                        }
                        return nodeElements;
                    }
                } else if (originalSelector === undefined) {
                    // If there is single selector we will hit this code 
                    // e.g. _Query.S('.ff-item-row') i.e. it is not being called recursively by _Query.S()
                    // We need this check (originalSelector===undefined) 
                    // because otherwise if root element is null from recursive call 
                    // then this code block will be executed which will remove the root element context
                    // Check following unit test to understand that: GetFFItemRowWithGoodFastFormsId,NoFFItemRowWithBadfastFormsId
                    _Utils.log.debug('[fs.Q.S] firstSelector:' + firstSelector);
                    if (selectorType == 'getElementById') {
                        return document[selectorType](firstSelector);
                    } else {
                        return fs(document[selectorType](firstSelector));
                    }
                }
            } catch (err) {
                _Utils.log.debug('[fs.Q.S] Error Below:' + selectorType);
                _Utils.log.debug(err);
                return null;
            }
            return fs();
        },
        getFirstElementByTagNames: function (tagNamesCSV) {
            try {
                if (shouldUseJQueryAsSelector()) {
                    return $(tagNamesCSV);

                } else {
                    return document.querySelectorAll(tagNamesCSV); //Only works in IE9+ 
                }
            } catch (err) {
                _Utils.log.debug('[getFirstElementByTagNames] Not supported method, falling back to jQuery.');
                _Utils.log.debug(err);
            }
            // falling back to jQuery
            return $(tagNamesCSV);
        },
        /**
         * find elements based on selector
         * @param {string} selector element id,class or tag 
         * @param {element} rootElement element to be used as scope to select elements. 
         */
        find: function (selector, rootElement) {
            try {
                if (!shouldUseJQueryAsSelector()) {
                    if (rootElement === undefined) {
                        return document.querySelectorAll(selector); //Only works in IE9+ 
                    } else if (rootElement.length > 0) {
                        if (rootElement instanceof $) {
                            return rootElement[0].querySelectorAll(selector);
                        } else {
                            return rootElement.querySelectorAll(selector);
                        }
                    } else if (rootElement != null && rootElement.querySelectorAll instanceof Function) {
                        return rootElement.querySelectorAll(selector);
                    }
                }
            } catch (err) {
                _Utils.log.debug('[getElementsByTagNames] Not supported method, falling back to jQuery.');
                _Utils.log.debug(err);
            }
            // falling back to jQuery
            if (rootElement === undefined) {
                return $(selector);
            } else {
                return $(rootElement).find(selector);
            }
        },
        // TODO Mohammed: Add unit test to capture JS node in Proxy subject and jQuery 
        /**
         * # ForEach
         *https://github.com/codemix/fast.js
         * A  `.forEach()` implementation.
         *
         * @param  {Array|Object} subject     The array or object to iterate over.
         * @param  {Function}     fn          The visitor function.
         * @param  {Object}       thisContext The context for the visitor.
         * @returns 
         */
        forEach: function fastForEach(subject, fn, thisContext) {
            if (subject.length === 0) {
                return;
            }

            if (subject instanceof Array) {
                return forEachArray(subject, fn, thisContext);
            } else {
                return forEachObject(subject, fn, thisContext);
            }
        }
    };


        /**
     * @todo Move this to its own logging library if needed
     * @see {@link https://github.com/pimterry/loglevel|loglevel}
     */
    _Utils.log = {
        /**
         * @description trigger console.time if if 'isFSDebugModeOn' property is set to true
         * @param {string} label - The name to give the new timer. This will identify the timer; use the same name when calling console.timeEnd() to stop the timer and get the time output to the console.
         * @todo Not in use right now. Keep it until we are done with community performance improvements
         */
        consoleTimeStart: function (label) {
            if (_Utils.isFSDebugModeOn) {
                if(_Utils.isCHROME || _Utils.isFIREFOX || _Utils.isSAFARI){
                    console.time('Performance-' + label);
                }
            }
        },
        /**
         * @description trigger console.timeLog if 'isFSDebugModeOn' property is set to true
         * @param {string} label - The name the current timer. This will log the time so far consumed for given timer started by console.time
         * @todo Not in use right now. Keep it until we are done with community performance improvements
         */
        consoleTimeLog: function (label) {
            if (_Utils.isFSDebugModeOn) {
                if(_Utils.isCHROME || _Utils.isFIREFOX){
                    console.timeLog('Performance-' + label);
                }
            }
        },
        /**
         * @description trigger console.timeEnd if 'isFSDebugModeOn' property is set to true
         * @param {string} label The name of the timer to stop. Once stopped, the elapsed time is automatically displayed in the Web Console.
         * @todo Not in use right now. Keep it until we are done with community performance improvements
         */
        consoleTimeEnd: function (label) {
            if (_Utils.isFSDebugModeOn) {
                if(_Utils.isCHROME || _Utils.isFIREFOX || _Utils.isSAFARI){
                    console.timeEnd('Performance-' + label);
                }
            }
        },
        /**
         * @description trigger console.log if 'isFSDebugModeOn' property is set to true
         * @param {string} msg message needs to be logged
         */
        debug: function (msg) {
            if (_Utils.isFSDebugModeOn) {
                console.log(msg);
            }
        }
    };

    return {
        "Query": _Query
    };
}));