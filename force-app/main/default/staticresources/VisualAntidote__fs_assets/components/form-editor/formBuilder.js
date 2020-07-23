/**
 * @summary core logic for FormEditor page
 * @todo eventually we would like to move all js files
 * which are not using namespace (i.e. fs.DE or fs.FE whatever)
 * and being used in FormEditor page to some feature/component folder (i.e. alert/style/rule etc)
 * or this file's folder i.e. form-editor
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
        root.FormBuilder = libObject.FormBuilder;
        root.FB = libObject.FB;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var $ = fs;
    // executing this as we load but we check the actual logic when onbeforeunload is called i.e. before navigating away/refreshing the page
    window.onbeforeunload = fs.Utils.unLoadWindow;
    var CONSTANTS = {
        uiMessage: {
            relatedObjectChangeWarning: {
                Title: "This object can't be changed or deleted.",
                Description:
                    'There are one or more documents configured and associated with this form. If you want to change this object, remove any corresponding document configurations from the Documents tab first.'
            }
        }
    };
    var shouldContinueWithToggleAction = function(currentToggleElem) {
        var doesTabHaveUnsavedChanges = fs.DE.doesDocumentTabHaveUnsavedChanges();
        if (doesTabHaveUnsavedChanges) {
            if (!confirm(fs.Utils.CONSTANTS.uiMessage.unsavedChanges)) {
                return false;
            } else {
                fs.DE.clearDocumentTabUnsavedChanges();
            }
        }
        $(currentToggleElem).tab('show');
        return true;
    };
    var isConfiguredObjectInUse = function(objectIndex, callbackFunction, callbackObject) {
        var objectIdentifier = parseFloat(fs.Utils.getSafeString(objectIndex, '0'));
        objectIdentifier = objectIdentifier + 1;
        fs.DE.isConfiguredObjectUsedInDocuments(objectIdentifier, callbackFunction, callbackObject);
    };

    var getDraftFormId = function() {
        return window.getFSNSVariable('currentFormRecordId', '');
    };

    var _FormBuilder = {
        CONSTANTS: CONSTANTS,
        shouldContinueWithToggleAction: shouldContinueWithToggleAction,
        isConfiguredObjectInUse: isConfiguredObjectInUse,
        getDraftFormId: getDraftFormId
    };
    return {
        FormBuilder: _FormBuilder,
        FB: _FormBuilder
    };
});
