/** @summary generic ajax call library to communicate to external services
 * @example see examples in documentService.js or platformConnectionService.js classes
 */
(function(root, window, factoryMethod) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['fs', 'window'], factoryMethod);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function(root, window) {
            return factoryMethod(root, window);
        };
    } else {
        var libObject = factoryMethod(root, window);
        root.CalloutService = libObject.CalloutService;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var $ = fs;
    var enumHTTPMethod = {
        GET: 'GET'
    };
    // POST or other HTTP methods for future
    var ajaxCall = function(
        ajaxSettings,
        callbackObject,
        alwaysCallbackFunction,
        successCallbackFunction,
        failCallbackFunction
    ) {
        return $.ajax(ajaxSettings)
            .done(function(response) {
                console.log('[makeAjaxCall] Success');
                console.log(response);
                if (typeof successCallbackFunction === 'function') {
                    successCallbackFunction(response, callbackObject);
                } else {
                    console.log('[makeAjaxCall] No successCallbackFunction function.');
                    console.log(response);
                }
            })
            .fail(function(response) {
                console.log('[makeAjaxCall] Error');
                if (typeof failCallbackFunction === 'function') {
                    failCallbackFunction(response, callbackObject);
                } else {
                    console.log('[makeAjaxCall] No failCallbackFunction function.');
                    console.log(response);
                }
            })
            .always(function(response) {
                console.log('[makeAjaxCall] Always');
                if (typeof alwaysCallbackFunction === 'function') {
                    alwaysCallbackFunction(response, callbackObject);
                } else {
                    console.log('[makeAjaxCall] No alwaysCallbackFunction function.');
                    console.log(response);
                }
            });
    };
    var mergeOptions = function(defaultOptions, customOptions) {
        var responseObj = {};
        for (var defaultOptionsKey in defaultOptions) {
            responseObj[defaultOptionsKey] = defaultOptions[defaultOptionsKey];
        }
        for (var customOptionsKey in customOptions) {
            responseObj[customOptionsKey] = customOptions[customOptionsKey];
        }
        return responseObj;
    };
    var defaultSettings = {
        async: true,
        method: enumHTTPMethod.GET,
        url: '',
        headers: {}
    };
    var RequestOptions = function(options) {
        var initOptions = defaultSettings;
        if (options) {
            initOptions = mergeOptions(defaultSettings, options);
        }
        this.crossDomain = true;
        this.async = initOptions.async;
        this.method = initOptions.method;
        this.url = initOptions.url;
        this.headers = initOptions.headers;
    };
    var _calloutService = {
        HTTP_METHOD: enumHTTPMethod,
        ajaxCall: function(
            options,
            callbackObject,
            alwaysCallbackFunction,
            successCallbackFunction,
            failCallbackFunction
        ) {
            var requestOptionsObject = new RequestOptions(options);
            return ajaxCall(
                requestOptionsObject,
                callbackObject,
                alwaysCallbackFunction,
                successCallbackFunction,
                failCallbackFunction
            );
        }
    };

    return {
        CalloutService: _calloutService
    };
});
