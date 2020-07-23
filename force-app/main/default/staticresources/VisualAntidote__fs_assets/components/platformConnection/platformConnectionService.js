/** @summary platform Connection functions only to communicate to Formstack Documents API or future API connection
 * @see https://www.webmerge.me/developers/documents#developer_resources
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
        root.PlatformConnectionService = libObject.PlatformConnectionService;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var fetchAPIUserInfo = function(thisElement, callbackObject, alwaysCallbackFunction) {
        var ajaxSettings = thisElement.ajaxSettings;
        ajaxSettings['url'] = thisElement.serviceAPIPath + '/user';
        ajaxSettings['method'] = fs.CalloutService.HTTP_METHOD.GET;
        return fs.CalloutService.ajaxCall(ajaxSettings, callbackObject, alwaysCallbackFunction);
    };
    var _PlatformConnectionService = function(serviceAPIPath, key, secret) {
        this.serviceAPIPath = serviceAPIPath;
        this.key = key;
        this.secret = secret;
        this.ajaxSettings = {
            headers: {
                Authorization: 'Basic ' + btoa(key + ':' + secret)
            }
        };
    };
    _PlatformConnectionService.prototype = {
        validateAPIcredentials: function(callbackObject, alwaysCallbackFunction) {
            return fetchAPIUserInfo(this, callbackObject, alwaysCallbackFunction);
        }
    };
    return {
        PlatformConnectionService: _PlatformConnectionService
    };
});
