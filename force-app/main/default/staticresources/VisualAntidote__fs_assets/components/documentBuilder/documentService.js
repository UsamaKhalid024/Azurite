/** @summary document functions only to communicate to Formstack Documents API
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
        root.DocumentService = libObject.DocumentService;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var fetchAPIDocumentList = function(thisElement, callbackObject, callbackFunction) {
        var ajaxSettings = thisElement.ajaxSettings;
        ajaxSettings['url'] = thisElement.serviceAPIPath + '/documents';
        ajaxSettings['method'] = fs.CalloutService.HTTP_METHOD.GET;
        return fs.CalloutService.ajaxCall(ajaxSettings, callbackObject, callbackFunction);
    };
    var fetchAPIDocumentDetail = function(
        thisElement,
        documentId,
        callbackObject,
        callbackFunction
    ) {
        var ajaxSettings = thisElement.ajaxSettings;
        ajaxSettings['url'] = thisElement.serviceAPIPath + '/documents/' + documentId;
        ajaxSettings['method'] = fs.CalloutService.HTTP_METHOD.GET;
        return fs.CalloutService.ajaxCall(ajaxSettings, callbackObject, callbackFunction);
    };
    var _DocumentService = function(serviceAPIPath, key, secret) {
        this.serviceAPIPath = serviceAPIPath;
        this.key = key;
        this.secret = secret;
        this.ajaxSettings = {
            headers: {
                Authorization: 'Basic ' + btoa(key + ':' + secret)
            }
        };
    };
    _DocumentService.prototype = {
        fetchAPIDocumentList: function(callbackObject, callbackFunction) {
            return fetchAPIDocumentList(this, callbackObject, callbackFunction);
        },
        fetchAPIDocumentDetail: function(documentId, callbackObject, callbackFunction) {
            return fetchAPIDocumentDetail(this, documentId, callbackObject, callbackFunction);
        }
    };
    return {
        DocumentService: _DocumentService
    };
});
