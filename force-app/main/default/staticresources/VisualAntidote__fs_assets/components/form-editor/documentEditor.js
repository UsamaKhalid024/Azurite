/**
 * @summary JS for logic to switch to Document tab and communicate with document.js from FormEditor page
 * @todo JS Unit Test, Error handling
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
        root.DocumentEditor = libObject.DocumentEditor;
        // keeping name consistent with DocB
        root.DE = libObject.DE;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var $ = fs;

    var loadDocuments = function() {
        var formId = window.getFSNSVariable('currentFormRecordId', '');
        fs.D.fetchRelatedDocumentsByProvider(formId);
    };

    /**
     * Load document tab in form editor and hide other tabs
     * @todo move functions referenced with window. to more modular setup
     */
    var loadDocumentEditorTab = function() {
        console.log('[FORM] [loadDocumentEditorTab]');
        window.sendInfoToIntercom('trackEvent', 'clicked-edit-document-tab');
        window.CallUnloadStyleEditor();
        // Eventually all these hide calls will be ported over to individual unload<Feautre>Tab i.e. unloadFormEditorTab etc..
        $('#sfff-rule-editor').hide();
        $('#sfff-form-editor').hide();
        $('#sfff-alert-editor').hide();
        $('#sfff-style-editor').hide();
        $('#sfff-document-editor').show();
        loadDocuments();
    };
    var doesDocumentTabHaveUnsavedChanges = function() {
        return fs.D.doesDocumentHaveUnsavedChanges();
    };
    var clearDocumentTabUnsavedChanges = function() {
        fs.D.clearDocumentUnsavedChanges(true);
    };
    var isConfiguredObjectUsedInDocuments = function(
        objectIdentifier,
        callbackFunction,
        callbackObject
    ) {
        fs.D.isConfiguredObjectUsedInDocuments(objectIdentifier, callbackFunction, callbackObject);
    };
    var unloadDocumentEditorTab = function() {
        //console.log('[FORM] [unloadDocumentEditorTab]');
        $('#sfff-document-editor').hide();
    };
    var _DocumentEditor = {
        loadDocumentEditorTab: loadDocumentEditorTab,
        unloadDocumentEditorTab: unloadDocumentEditorTab,
        doesDocumentTabHaveUnsavedChanges: doesDocumentTabHaveUnsavedChanges,
        clearDocumentTabUnsavedChanges: clearDocumentTabUnsavedChanges,
        isConfiguredObjectUsedInDocuments: isConfiguredObjectUsedInDocuments
    };
    return {
        DocumentEditor: _DocumentEditor,
        DE: _DocumentEditor
    };
});
