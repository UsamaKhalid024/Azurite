/**
 * @summary JS to build steps for Document settings setup and talk to platformConnection.js and other document js libraries
 * @todo remove unnecessary debug logs with FORM_DEV
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
        root.DocumentStepBuilder = libObject.DocumentStepBuilder;
        root.DSB = libObject.DSB;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var $ = fs;
    var external_links = {
        createDocumentInFormstackDocumentsWeb: 'https://www.webmerge.me/manage/documents',
        howToAttachFormstackDocumentInEmailAlerts: '#EMPTY_LINK'
    };
    var RELEASE1_NOTE_HTML =
        '<div class="fsRow"><div class="fsCol1"><label class="fsLabel fsLabel--bold fsLabel--fontSM">Want to create a document from scratch?</label><label class="fsLabel fsLabel--fontSM">To use this option, create a new template in Formstack Documents and use it in Existing Document option.</label></div><div class="fsCol2"><a href="' +
        external_links.createDocumentInFormstackDocumentsWeb +
        '" target="_blank" id="btnCreateInDocuments" class="fsBtn fsBtn--secondary fsBtn--radius-sm"><span class="fsBtn__text">Create in Documents</span></a></div></div>';
    // minified html of fsList.template.html section in ./index.template.html
    var BUTTON_LIST_HTML = {
        refreshDocumentList: '',
        editInDocuments: ''
    };
    BUTTON_LIST_HTML.refreshDocumentList =
        '<button type="button" id="btnRefreshDocumentList" class="fsBtn fsBtn--secondary fsBtn--radius-sm"><span class="fsBtn__icon fsBtn__icon--refresh"></span><span class="fsBtn__text">Refresh</span></button>';
    BUTTON_LIST_HTML.editInDocuments =
        '<button type="button" id="btnEditInDocuments" class="fsBtn fsBtn--secondary fsBtn--disabled fsBtn--radius-sm"><span class="fsBtn__text">Edit in Documents</span></button>';
    var RADIO_BUTTONLIST_HTML = {
        documentSourceTypeList: '',
        saveDocumentToFileTypeList: ''
    };
    RADIO_BUTTONLIST_HTML.documentSourceTypeList =
        '<ul class="fsList fsList--noListStyle"> <li class="fsLiItem"> <div class="liItemBox"> <label class="liItemBox__component"> <div class="liItemBoxControl"><input class="liItemBoxControl__input liItemBoxControl__input--radio" name="documentSource" type="radio" value="simplepdf"></div><div class="liItemBoxContent"> <div class="liItemBoxContent__header">Simple PDF from Form Submission</div><div class="liItemBoxContent__details">Generate a document that looks like your form submission.</div></div></label> </div></li><li class="fsLiItem"> <div class="liItemBox"> <label class="liItemBox__component"> <div class="liItemBoxControl"><input class="liItemBoxControl__input liItemBoxControl__input--radio" name="documentSource" type="radio" value="newformstackdocument"></div><div class="liItemBoxContent"> <div class="liItemBoxContent__header">New Document<span class="liItemBoxContent__header--documentIcon"></span></div><div class="liItemBoxContent__details">Create a new Formstack Document from .doc file. File must have merge fields inserted.</div></div></label> </div></li><li class="fsLiItem"> <div class="liItemBox"> <label class="liItemBox__component"> <div class="liItemBoxControl"><input class="liItemBoxControl__input liItemBoxControl__input--radio" name="documentSource" type="radio" value="existingformstackdocument"></div><div class="liItemBoxContent"> <div class="liItemBoxContent__header">Existing Document<span class="liItemBoxContent__header--documentIcon"></span></div><div class="liItemBoxContent__details">Use a document, already created in Formstack Documents. </div></div></label></div></li></ul>';
    RADIO_BUTTONLIST_HTML.saveDocumentToFileTypeList =
        '<ul class="fsList fsList--noListStyle"> <li class="fsLiItem"> <div class="liItem__component"><input class="liItemComp__input liItemComp__input--radio fsRadio" id="radiobtnSaveToFiles" name="savedocumentto" type="radio" value="File"><label class="liItemComp__label fsRadioLabel" for="radiobtnSaveToFiles">Save to Salesforce Files (Recommended)</label></div><div class="liItem__component liItem__component--nested"><input class="liItemComp__input liItemComp__input--checkbox fsCheckbox" id="checkboxSaveToChatter" name="savedocumentto" type="checkbox" value="Chatter"><label class="liItemComp__label fsCheckboxLabel" for="checkboxSaveToChatter">Save to Chatter files</label></div></li><li class="fsLiItem"> <div class="liItem__component"><input class="liItemComp__input liItemComp__input--radio fsRadio" id="radiobtnSaveToAttachment" name="savedocumentto" type="radio" value="Attachment"><label class="liItemComp__label fsRadioLabel" for="radiobtnSaveToAttachment">Save to Notes and Attachments (Legacy)</label></div></li></ul>';
    var EVENT_DATA_ATTRIBUTE_NAME = 'data-enable-next-btn';
    const STEP_CONSTANTS = {
        DocumentName: { Title: 'Document Name' },
        DocumentSource: { Title: 'Document Type' },
        ESignature: { Title: 'NotImplemented' },
        SaveDocumentTo: { Title: 'Save Documents To' },
        ReadyAndSave: {
            Title: 'Ready And Save',
            Button: { Initial: 'Save Document Setup', Processed: 'Saved' }
        }
    };
    const EVENT_TRIGGERED_BY_CODE = {
        isTriggeredByCode: true
    };
    var select2Options = {
        formatSelectionCssClass: fs.Utils.select2FormatCSSClassSelection
    };
    /**
     * variable names which we set/get on the go
     * @summary just to list all known variables we might be using for documents
     */
    var enumDataVariable = {
        currentDocumentDTORecord: 'currentDocumentDTORecord',
        objectListForSaveDocumentsTo: 'objectListForSaveDocumentsTo',
        formstackDocumentsEndpoint: 'formstackDocumentsEndpoint',
        availableFormFieldListSelectHTML: 'availableFormFieldListSelectHTML',
        hasDocumentChanged: 'hasDocumentChanged',
        checkDocumentEditingStateFunc: 'checkDocumentEditingStateFunc'
    };
    const DOCUMENT_RELATIVE_PATH = {
        DocumentEdit: '/manage/documents?page=edit&step=html&document_id=',
        API: '/api'
    };
    var enumFieldMappinItemType = {
        static: 'static',
        field: 'field',
        object: 'object'
    };
    var enumBuilderStep = {
        DocumentName: 'Step1',
        DocumentSource: 'Step2',
        ESignature: 'NotImplemented',
        SaveDocumentTo: 'Step3',
        ReadyAndSave: 'Step4'
    };
    var enumSaveDocumentToOption = {
        SalesforceFiles: 'File',
        Chatter: 'Chatter',
        Attachment: 'Attachment'
    };
    var enumDocumentOption = {
        SimplePDF: 'simplepdf',
        NewFormstackDocument: 'newformstackdocument',
        ExistingFormstackDocument: 'existingformstackdocument'
    };
    Object.freeze(enumBuilderStep);
    Object.freeze(enumDocumentOption);
    Object.freeze(enumSaveDocumentToOption);
    Object.freeze(enumFieldMappinItemType);

    var FieldMappingItem = function(fieldMappinItemType, text) {
        this.oType = fieldMappinItemType;
        this.oText = text;
        this.fields = [];
    };
    var DocumentIdKeyPair = function(id, key) {
        this.id = id;
        this.key = key;
    };
    var DocumentSourceData = function(documentOptionEnumObj) {
        this.type = documentOptionEnumObj;
        this.documentId = '';
        this.documentKey = '';
        this.fieldMappingJSON = '';
        this.platformAccountId = '';
    };
    var FieldFilterInfo = function(filterIdentifier, shouldFilter) {
        this.filterIdentifier = filterIdentifier;
        this.shouldFilter = shouldFilter;
    };
    var getCurrentDocumentRecordId = function() {
        var currentDocumentObj = fs.Utils.getFSNSVariable(
            enumDataVariable.currentDocumentDTORecord,
            null
        );
        if (currentDocumentObj != null && !fs.Utils.isNullOrEmpty(currentDocumentObj.RecordId)) {
            return currentDocumentObj.RecordId;
        }
        return null;
    };
    var getFilteredFieldsInSelectHTMLForRepeatedObjectOnly = function(fieldFilterInfoObj) {
        console.log('[getFilteredFieldsInSelectHTMLForRepeatedObjectOnly]');
        var allFieldsSelectHtml = fs.Utils.getFSNSVariable(
            enumDataVariable.availableFormFieldListSelectHTML,
            ''
        );
        var formFieldSelectElement = document.createElement('select');
        formFieldSelectElement.innerHTML = allFieldsSelectHtml;
        var filteredHTML = '';
        var selectOptionElementArr = $(formFieldSelectElement).find('option');
        if (selectOptionElementArr.length > 0) {
            // get first element i.e. blank value with display text as '--select an item--'
            filteredHTML = selectOptionElementArr[0].outerHTML;
        }
        var repeatedOptGrpElementArr = $(formFieldSelectElement).find('.repeat');
        var repeatedOptGrpElementArrLength = repeatedOptGrpElementArr.length;
        if (repeatedOptGrpElementArrLength > 0) {
            for (var optGrpIndex = 0; optGrpIndex < repeatedOptGrpElementArrLength; optGrpIndex++) {
                var optGroupElement = repeatedOptGrpElementArr[optGrpIndex];
                if (
                    !fs.Utils.isNullOrUndefined(fieldFilterInfoObj) &&
                    fieldFilterInfoObj.shouldFilter
                ) {
                    if (
                        doesFieldIdMatchWithObjectIdentifier(
                            $(optGroupElement)
                                .find('option')
                                .first()
                                .val(),
                            fieldFilterInfoObj.filterIdentifier
                        )
                    ) {
                        filteredHTML += optGroupElement.outerHTML;
                    }
                } else {
                    filteredHTML += optGroupElement.outerHTML;
                }
            }
        }
        return filteredHTML;
    };
    /**
     * get formstack document url from our global variable
     * @param {string} [relativeSubPath]
     */
    var getDocumentEndpointURL = function(relativeSubPath) {
        var endpointURL = fs.Utils.getFSNSVariable(enumDataVariable.formstackDocumentsEndpoint);
        if (!fs.Utils.isNullOrEmpty(relativeSubPath)) {
            endpointURL += relativeSubPath;
        }
        return endpointURL;
    };
    var getDocumentIdKeyPair = function(idKeyPairValue) {
        if (fs.Utils.isNullOrEmpty(idKeyPairValue) || idKeyPairValue.indexOf(':') < 0) {
            return null;
        }
        var idKeyPairValueArr = idKeyPairValue.split(':');
        return new DocumentIdKeyPair(idKeyPairValueArr[0], idKeyPairValueArr[1]);
    };
    /**
     * get step index by step name enum
     * @param {enumBuilderStep} stepName
     */
    var getStepIndex = function(stepName) {
        var stepIndex = -1;
        if (stepName !== undefined && stepName != null && stepName != '') {
            stepIndex = stepName.replace('Step', '');
        }
        return stepIndex;
    };
    /**
     * find step root element by step name enum
     * @param {enumBuilderStep} stepName
     * @param {*} [parentElement]
     */
    var findStepRootElement = function(stepName, parentElement) {
        var stepIndex = getStepIndex(stepName);
        if (parentElement === undefined) {
            return $('.fsStep--' + stepIndex);
        }
        if ($(parentElement).length > 0) {
            return $(parentElement).find('.fsStep--' + stepIndex);
        }
        return $('.fsStep--' + stepIndex);
    };
    var isStepMarkedDone = function(stepBtnElem) {
        return (
            typeof stepBtnElem !== 'undefined' &&
            fs.Utils.getSafeBoolean(stepBtnElem.getAttribute('data-stepbtn-wizard-done'), false)
        );
    };
    var enableStepButtonByStepIndex = function(stepIndex) {
        if (stepIndex != 'undefined' && stepIndex != '') {
            var stepElem = document.getElementsByClassName('fsStep--' + stepIndex)[0];
            var stepBtnElem = stepElem.getElementsByClassName('stepCompact__Btn')[0];
            if (!isStepMarkedDone(stepBtnElem)) {
                stepBtnElem.classList.remove('fsBtn--disabled');
                stepBtnElem.removeAttribute('disabled');
                if (
                    !fs.Utils.getSafeBoolean(
                        stepElem.getAttribute('data-show-step-btn-always'),
                        false
                    )
                ) {
                    stepBtnElem.classList.remove('stepCompact__Btn--hidden');
                }
            } else {
                // let's enable last step button since step type wizard is already done.
                var lastStepIndex = $(stepElem)
                    .parent()
                    .find('.fsStep').length;
                enableStepButtonByStepIndex(lastStepIndex);
            }
        }
    };
    var disableStepButtonByStepIndex = function(stepIndex) {
        if (stepIndex != 'undefined' && stepIndex != '') {
            var stepElem = document.getElementsByClassName('fsStep--' + stepIndex)[0];
            var stepBtnElem = stepElem.getElementsByClassName('stepCompact__Btn')[0];
            stepBtnElem.classList.add('fsBtn--disabled');
            stepBtnElem.setAttribute('disabled', 'disabled');
            if (
                !fs.Utils.getSafeBoolean(stepElem.getAttribute('data-show-step-btn-always'), false)
            ) {
                var existingClassNames = stepBtnElem.classList;
                if (!existingClassNames.contains('stepCompact__Btn--hidden')) {
                    stepBtnElem.classList.add('stepCompact__Btn--hidden');
                }
            }
        }
    };
    var updateDocumentChangesNotificationUI = function(hasUnsavedChanges) {
        var documentTabElement = $('.sfff-document-editor-li');
        if (hasUnsavedChanges) {
            if ($(documentTabElement).find('.hasUnsavedChanges').length == 0) {
                $(documentTabElement)
                    .find('a')
                    .append('<i class="hasUnsavedChanges">*</i>');
            }
        } else {
            $(documentTabElement)
                .find('.hasUnsavedChanges')
                .remove();
            fs.Utils.setFSNSVariable(enumDataVariable.hasDocumentChanged, undefined);
        }
        fs.Utils.setFSNSVariable(fs.Utils.DATA_VARIABLE.isWindowSafeToUnload, !hasUnsavedChanges);
    };
    var checkForDocumentEditingChanges = function() {
        var hasDocumentChanged = fs.Utils.getFSNSVariable(
            enumDataVariable.hasDocumentChanged,
            false
        );
        if (fs.Utils.getSafeBoolean(hasDocumentChanged, false)) {
            updateDocumentChangesNotificationUI(true);
        } else {
            updateDocumentChangesNotificationUI(false);
        }
    };

    var setDocumentEditingState = function(event, additionalEventData) {
        console.log('[setDocumentEditingState]', event, additionalEventData);
        var shouldUpdateDocumentChange = false;
        //var isAdditionalEventDataNullOrUndefined = fs.Utils.isNullOrUndefined(additionalEventData);
        // default is undefined since we only pass additionalEventData when we trigger event programmatically
        if (fs.Utils.isNullOrUndefined(additionalEventData)) {
            shouldUpdateDocumentChange = true;
        } else if (!fs.Utils.getSafeBoolean(additionalEventData.isTriggeredByCode, false)) {
            shouldUpdateDocumentChange = true;
        }
        if (shouldUpdateDocumentChange) {
            // let's set the state of the current editing view as changed
            fs.Utils.setFSNSVariable(enumDataVariable.hasDocumentChanged, true);
        }
        checkForDocumentEditingChanges();
    };
    var createNoteElement = function() {
        var labelElement = document.createElement('label');
        labelElement.className = 'fsLabel fsLabel--note';
        return labelElement;
    };
    var removeExistingDocumentSettingsSections = function(stepDetailElement) {
        $(stepDetailElement)
            .find('.fsStepItem--platformConnection')
            .remove();
        $(stepDetailElement)
            .find('.fsStepItem--documentEventsBox')
            .remove();
        $(stepDetailElement)
            .find('.fsStepItem--fieldMappingBox')
            .remove();
    };
    var removeExistingFieldMappingAndEventBoxSection = function(stepDetailElement) {
        $(stepDetailElement)
            .find('.fsStepItem--documentEventsBox')
            .remove();
        $(stepDetailElement)
            .find('.fsStepItem--fieldMappingBox')
            .remove();
    };
    var showSimplePDFDetailSection = function(elemSource) {
        var stepDetailElement = $(elemSource).parents('.stepDetail');
        // remove all other document sections as Simple PDF doesn't support any advanced options like field mapping etc.
        removeExistingDocumentSettingsSections(stepDetailElement);
    };
    var showNewDocumentFeatureDetailSection = function(elemSource) {
        var stepDetailElement = $(elemSource).parents('.stepDetail');
        // Next Releases:clear platform connection section. for now only available for existing documents
        removeExistingDocumentSettingsSections(stepDetailElement);
    };
    var showExistingDocumentFeatureDetailSection = function(elemSource) {
        var stepDetailElement = $(elemSource).parents('.stepDetail');
        // 1. fetch platform connection
        // 2.1 if no connection available
        // then load the connection picker form
        // do not show any field mapping yet
        // 2.2 if connection available
        // then show platformconnection in collpased mode
        // Load available document list.
        $(stepDetailElement)
            .find('.fsStepItem--platformConnection')
            .remove();
        var fsStepElement = document.createElement('div');
        fsStepElement.innerHTML = '';
        fsStepElement.className = 'fsStepItem fsStepItem--platformConnection';
        $(stepDetailElement).append(fsStepElement);
        fs.DSB.showInlineProcessingIcon(stepDetailElement);
        // show processing/loading icon because it might take some time
        var documentDtoRecordObj = fs.Utils.getFSNSVariable(
            enumDataVariable.currentDocumentDTORecord,
            null
        );
        if (
            documentDtoRecordObj != null &&
            !fs.Utils.isNullOrEmpty(documentDtoRecordObj.PlatformAccountId)
        ) {
            fs.PC.fetchPlatformConnectionById(
                documentDtoRecordObj.PlatformAccountId,
                stepDetailElement
            );
        } else {
            fs.PC.fetchPlatformConnectionsByProvider(
                fs.PC.enumProviderType.FormstackDocuments,
                fsStepElement
            );
        }
    };
    var refreshDocumentListElement = function(stepDetailElement) {
        var documentAPI = getDocumentEndpointURL(DOCUMENT_RELATIVE_PATH.API);
        var pcDataAttributesObj = fs.PC.getPlatformConnectionCompactViewDataAttributes(
            stepDetailElement.find('.fsPlatformConnectionCompact')
        );
        var username = pcDataAttributesObj.Key;
        var password = pcDataAttributesObj.Secret;
        var documentServiceobj = new fs.DocumentService(documentAPI, username, password);
        documentServiceobj.fetchAPIDocumentList(
            stepDetailElement,
            handleDocumentApiServiceRefreshResponse
        );
    };
    var renderDocumentSourceMappingSectionByStepElement = function(stepDetailElement) {
        console.log('[renderDocumentSourceMappingSectionByStepElement]');
        var documentAPI = getDocumentEndpointURL(DOCUMENT_RELATIVE_PATH.API);
        var pcDataAttributesObj = fs.PC.getPlatformConnectionCompactViewDataAttributes(
            stepDetailElement.find('.fsPlatformConnectionCompact')
        );
        var username = pcDataAttributesObj.Key;
        var password = pcDataAttributesObj.Secret;
        var documentServiceobj = new fs.DocumentService(documentAPI, username, password);
        documentServiceobj.fetchAPIDocumentList(
            stepDetailElement,
            handleDocumentApiServiceResponse
        );
    };
    var renderDocumentSourceMappingSection = function(platformConnectionElement) {
        console.log('[renderDocumentSourceMappingSection]');
        var stepDetailElement = $(platformConnectionElement).parents('.stepDetail');
        renderDocumentSourceMappingSectionByStepElement(stepDetailElement);
    };
    var onDocumentSelectionChanged = function(elemSource) {
        var documentOptionSelected = enumDocumentOption.ExistingFormstackDocument;
        var radioDocumentSourceValue = $(elemSource).val();
        if (radioDocumentSourceValue != 'undefined' && radioDocumentSourceValue != '') {
            documentOptionSelected = radioDocumentSourceValue;
        }
        switch (documentOptionSelected) {
            case enumDocumentOption.ExistingFormstackDocument:
                showExistingDocumentFeatureDetailSection(elemSource);
                break;
            case enumDocumentOption.NewFormstackDocument:
                showNewDocumentFeatureDetailSection(elemSource);
                break;
            case enumDocumentOption.SimplePDF:
                showSimplePDFDetailSection(elemSource);
                break;
            default:
                break;
        }
    };
    var onFormstackDocumentSelectionDDL = function(elemSource) {
        var stepDetailElement = $(elemSource).parents('.stepDetail');
        var documentAPI = getDocumentEndpointURL(DOCUMENT_RELATIVE_PATH.API);
        var pcDataAttributesObj = fs.PC.getPlatformConnectionCompactViewDataAttributes(
            stepDetailElement.find('.fsPlatformConnectionCompact')
        );
        var username = pcDataAttributesObj.Key;
        var password = pcDataAttributesObj.Secret;
        var documentIDKeyPairObj = getDocumentIdKeyPair($(elemSource).val());
        if (documentIDKeyPairObj != null) {
            $(stepDetailElement)
                .find('#btnEditInDocuments')
                .removeClass('fsBtn--disabled');
            var documentId = documentIDKeyPairObj.id;
            var documentServiceobj = new fs.DocumentService(documentAPI, username, password);
            documentServiceobj.fetchAPIDocumentDetail(
                documentId,
                $(elemSource).parents('.stepDetail'),
                handleDocumentDetailApiServiceResponse
            );
        } else {
            console.log('[onFormstackDocumentSelectionDDL] selection is null');
            var btnEditInDocumentsElem = $(stepDetailElement).find('#btnEditInDocuments');
            if (!$(btnEditInDocumentsElem).hasClass('fsBtn--disabled')) {
                $(btnEditInDocumentsElem).addClass('fsBtn--disabled');
            }
        }
    };
    var navigateToDocumentEditWindow = function(elemSource) {
        var documentIDKeyPairObj = getDocumentIdKeyPair($('#ddlFormstackDocumentList').val());
        if (documentIDKeyPairObj != null) {
            var documentEditUrl = getDocumentEndpointURL(
                DOCUMENT_RELATIVE_PATH.DocumentEdit + documentIDKeyPairObj.id
            );
            window.open(documentEditUrl, '_blank');
        }
    };
    /**
     * Delete current row of field mapping.
     * @summary It keeps at-least one row in nested loop element
     * i.e. if there are only 2 rows (one header row and one content row) then it won't delete the current row otherwise let's remove it
     * @param {HTMLButtonElement} btnElement
     */
    var deleteFieldMappingRow = function(btnElement) {
        var parentFieldMappingRowElement = $(btnElement).parents('.fmRow__item--fmRowBox');
        if ($(parentFieldMappingRowElement).find('.fmRow').length > 2) {
            // only remove the current row if there are more then one content row for mapping
            $(btnElement)
                .closest('.fmRow')
                .remove();
        } else {
            console.log(
                '[deleteFieldMappingRow] we are not deleting the only row we have in nested loop configuration section'
            );
        }
    };
    var rebindActionsForNewFieldMappingElements = function(parentFieldMappingRowElement) {
        bindChangeOnFieldMappingSelectElements(parentFieldMappingRowElement);
        bindClickOnActionBtnsInNestedRow($(parentFieldMappingRowElement).find('.actionBtn'));
    };
    var doesFieldIdMatchWithObjectIdentifier = function(fieldId, objectIndentifier) {
        if (fs.Utils.isNullOrEmpty(fieldId) || fs.Utils.isNullOrEmpty(objectIndentifier)) {
            return false;
        }
        return fieldId.indexOf(objectIndentifier) == 0;
    };
    var getFieldFilterInfoForLoopedSection = function(parentFieldMappingRowItemElement) {
        var formFieldSelectElement = $(parentFieldMappingRowItemElement).find('select');
        var objectIndentifier = fs.Utils.getSafeString($(formFieldSelectElement).val(), '');
        if (objectIndentifier.length > 0) {
            objectIndentifier = objectIndentifier.substring(0, objectIndentifier.lastIndexOf('.'));
        }
        var fieldFilterInfoObj = new FieldFilterInfo(
            objectIndentifier,
            !fs.Utils.isNullOrEmpty(objectIndentifier)
        );
        return fieldFilterInfoObj;
    };
    var addNewFieldMappingRow = function(btnElement) {
        var parentFieldMappingRowElement = $(btnElement).parents('.fmRow__item--fmRowBox');
        var parentFieldMappingRowItemElement = $(parentFieldMappingRowElement)
            .find('.fmRow__item')
            .first();
        var fieldFilterInfoObj = getFieldFilterInfoForLoopedSection(
            parentFieldMappingRowItemElement
        );
        var formFieldsSelectHTMLFromRepeatedObjectsOnly = getFilteredFieldsInSelectHTMLForRepeatedObjectOnly(
            fieldFilterInfoObj
        );
        var nestedNewRow = getFieldMappingRow(
            null,
            null,
            parentFieldMappingRowElement,
            null,
            formFieldsSelectHTMLFromRepeatedObjectsOnly
        );
        $(parentFieldMappingRowElement).append(nestedNewRow);
        rebindActionsForNewFieldMappingElements(parentFieldMappingRowElement);
    };

    var bindClickOnRefreshDocumentListButton = function(fsStepElement) {
        $(fsStepElement)
            .find('#btnRefreshDocumentList')
            .click(function(e) {
                var stepDetailElement = $(this).parents('.stepDetail');
                refreshDocumentListElement(stepDetailElement);
                return false;
            });
    };
    var bindClickOnEditInDocumentsButton = function(fsStepElement) {
        $(fsStepElement)
            .find('#btnEditInDocuments')
            .click(function(e) {
                navigateToDocumentEditWindow(this);
                return false;
            });
    };
    var bindChangeOnFormstackDocumentSelectionDDL = function(fsStepElement) {
        var ddlFormstackDocumentListElement = $(fsStepElement).find('#ddlFormstackDocumentList');
        $(ddlFormstackDocumentListElement).change(function(e, isTriggered) {
            console.log('[ddlFormstackDocumentList] value changed');
            setDocumentEditingState(e, isTriggered);
            onFormstackDocumentSelectionDDL(this);
        });
        if ($.fn.select2) {
            $(ddlFormstackDocumentListElement).select2(select2Options);
        }
    };

    var bindChangeOnFieldMappingSelectElements = function(stepRowItemElement) {
        var allSelectElementList = $(stepRowItemElement).find('select.fsSelect');
        $(allSelectElementList).select2(select2Options);
        $(allSelectElementList).change(function() {
            console.log('[bindChangeOnFieldMappingSelectElements]');
            //TODO Nice to have: set document change event
        });
    };

    var bindClickOnRadioButtonOfAttachmentType = function(radioButtonListElement) {
        $(radioButtonListElement)
            .find('.liItemComp__input--radio')
            .change(function(e, isTriggered) {
                console.log('[bindClickOnRadioButtonOfAttachmentType] value changed');
                setDocumentEditingState(e, isTriggered);
                var fsListElement = $(this).parents('.fsList');
                if ($(this).val() == enumSaveDocumentToOption.SalesforceFiles) {
                    $(fsListElement)
                        .find('.liItemComp__input--checkbox')
                        .prop('checked', true);
                } else {
                    $(fsListElement)
                        .find('.liItemComp__input--checkbox')
                        .prop('checked', false);
                }
            });
        // disabling chatter checkbox event
        // because for now we are not allowing end user to uncheck it individually as we need to upload file as SF file.
        var checkBoxElement = $(radioButtonListElement).find('.liItemComp__input--checkbox');
        $(checkBoxElement).click(function(e, isTriggered) {
            return false;
        });
        $(checkBoxElement).change(function(e, isTriggered) {
            return false;
        });
    };
    var bindClickOnRadioButtonItem = function(radioButtonListElement) {
        $(radioButtonListElement)
            .find('.liItemBoxControl__input')
            .change(function(e, isTriggered) {
                setDocumentEditingState(e, isTriggered);
                $(radioButtonListElement)
                    .find('.liItemBox')
                    .removeClass('liItemBox--selected');
                $(this)
                    .parents('.liItemBox')
                    .addClass('liItemBox--selected');
                onDocumentSelectionChanged(this);
            });
    };
    var bindChangeOnLoopCheckboxItems = function(fsStepItemFieldMappingBoxElement) {
        var loopCheckboxElementList = $(fsStepItemFieldMappingBoxElement).find(
            '.fmColumnItem__loop'
        );
        $(loopCheckboxElementList).change(function() {
            var loopCheckboxElement = $(this);
            toggleNestedFieldMappingItemsForLoop(
                loopCheckboxElement,
                $(loopCheckboxElement).is(':checked')
            );
        });
    };
    var bindClickOnActionBtnsInNestedRow = function(actionsBtns) {
        $(actionsBtns).unbind('click');
        $(actionsBtns).click(function() {
            var actionBtnElement = $(this);
            if (actionBtnElement.hasClass('actionBtn--add')) {
                addNewFieldMappingRow(actionBtnElement);
            } else if (actionBtnElement.hasClass('actionBtn--delete')) {
                deleteFieldMappingRow(actionBtnElement);
            }
        });
    };

    var rebindChangeOnStepElementEventTriggerByElement = function(
        elementToBind,
        fsStepElement,
        onChangeEventFunction
    ) {
        $(elementToBind).change(function(e, isTriggered) {
            setDocumentEditingState(e, isTriggered);
            var isOnChangeEventValid = true;
            if (typeof onChangeEventFunction === 'function') {
                isOnChangeEventValid = onChangeEventFunction();
            }
            if (!isOnChangeEventValid) {
                disableStepButtonByStepIndex($(fsStepElement).attr('data-step-index'));
            } else {
                enableStepButtonByStepIndex($(fsStepElement).attr('data-step-index'));
            }
        });
    };
    var rebindChangeOnStepElementEventTriggerByElements = function(
        stepName,
        sourceEventSelector,
        onChangeEventFunction
    ) {
        var fsStepElement = findStepRootElement(stepName);
        var elementsNeedChangeEventBinding = $(sourceEventSelector);
        var elementsCount = elementsNeedChangeEventBinding.length;
        for (var index = 0; index < elementsCount; index++) {
            var elementToBind = elementsNeedChangeEventBinding[index];
            // bind element
            rebindChangeOnStepElementEventTriggerByElement(
                elementToBind,
                fsStepElement,
                onChangeEventFunction
            );
        }
    };
    var getStepRowElement = function(childElements, additionalClassName) {
        var stepRowElement = document.createElement('div');
        stepRowElement.className = 'stepRow';
        if (additionalClassName !== undefined) {
            stepRowElement.className += ' ' + additionalClassName;
        }
        if (childElements instanceof Array && childElements.length > 0) {
            var elemIndex = 0;
            var elemCount = childElements.length;
            for (elemIndex; elemIndex < elemCount; elemIndex++) {
                stepRowElement.appendChild(childElements[elemIndex]);
            }
        } else if (childElements != 'undefined' && childElements != null) {
            stepRowElement.appendChild(childElements);
        }
        return stepRowElement;
    };
    var setStateForLoopFieldMappingDropdown = function(selectElement, shouldShow) {
        console.log('shouldShow:' + shouldShow);
        $(selectElement)
            .prop('disabled', shouldShow)
            .select2(select2Options);
    };
    var showNestedFieldMappingItemsForLoop = function(
        fieldMappingItemObjFieldList,
        fieldMappingRowElement,
        parentObjectIdentifier
    ) {
        var rowItemElement = document.createElement('div');
        rowItemElement.className = 'fmRow__item fmRow__item--fmRowBox';
        rowItemElement.innerHTML = '';
        rowItemElement.appendChild(getFieldMappingHeaderRow());

        if (fieldMappingItemObjFieldList != null && fieldMappingItemObjFieldList.length > 0) {
            var formFieldsSelectHTMLFromRepeatedObjectsOnly = '';
            for (var rootIndex = 0; rootIndex < fieldMappingItemObjFieldList.length; rootIndex++) {
                var fieldMappingItemObj = fieldMappingItemObjFieldList[rootIndex];
                var fieldList = Object.keys(fieldMappingItemObj);
                var fieldListLength = fieldList.length;
                var fieldFilterInfoObj = null;
                if (rootIndex == 0) {
                    // First row's select element will have fields from all repeated objects on the form
                    formFieldsSelectHTMLFromRepeatedObjectsOnly = getFilteredFieldsInSelectHTMLForRepeatedObjectOnly();
                }
                for (var nestedIndex = 0; nestedIndex < fieldListLength; nestedIndex++) {
                    var fieldItemKey = fieldList[nestedIndex];
                    var fieldItemOText = fs.Utils.getSafeString(
                        fieldMappingItemObj[fieldItemKey]['oText'],
                        ''
                    );

                    if (nestedIndex == 1) {
                        // subsequent row's select elements in nested looped section will have fields from single repeated object based on the selection made in first row
                        // so formFieldsSelectHTMLFromRepeatedObjectsOnly will be reset to be filtered one in second row and then reuse it in subsequent rows
                        var parentFieldMappingRowItemElement = $(rowItemElement)
                            .find('.fmRow__item')
                            .first();
                        fieldFilterInfoObj = getFieldFilterInfoForLoopedSection(
                            parentFieldMappingRowItemElement
                        );
                        formFieldsSelectHTMLFromRepeatedObjectsOnly = getFilteredFieldsInSelectHTMLForRepeatedObjectOnly(
                            fieldFilterInfoObj
                        );
                    }
                    rowItemElement.appendChild(
                        getFieldMappingRow(
                            fieldItemKey,
                            fieldItemOText,
                            fieldMappingRowElement,
                            parentObjectIdentifier,
                            formFieldsSelectHTMLFromRepeatedObjectsOnly
                        )
                    );
                }
            }
        } else {
            var formFieldsSelectHTMLFromRepeatedObjectsOnly = getFilteredFieldsInSelectHTMLForRepeatedObjectOnly();
            var nestedFirstRow = getFieldMappingRow(
                null,
                null,
                fieldMappingRowElement,
                null,
                formFieldsSelectHTMLFromRepeatedObjectsOnly
            );
            rowItemElement.appendChild(nestedFirstRow);
        }
        $(fieldMappingRowElement)
            .find('.fmRow__item--fmRowBox')
            .remove();
        $(fieldMappingRowElement).append(rowItemElement);
        rebindActionsForNewFieldMappingElements(fieldMappingRowElement);
    };

    var hideNestedFieldMappingItemsForLoop = function(fieldMappingRowElement) {
        $(fieldMappingRowElement)
            .find('.fmRow__item--fmRowBox')
            .remove();
    };
    var toggleNestedFieldMappingItemsForLoop = function(loopCheckboxElement, shouldShow) {
        var fieldMappingRowElement = $(loopCheckboxElement).parents('.fmRow');
        var ddlFieldMappingElement = $(fieldMappingRowElement)
            .find('.fmColumn--col2')
            .find('select');
        setStateForLoopFieldMappingDropdown(ddlFieldMappingElement, shouldShow);
        if (shouldShow) {
            showNestedFieldMappingItemsForLoop(null, fieldMappingRowElement);
        } else {
            hideNestedFieldMappingItemsForLoop(fieldMappingRowElement);
        }
    };

    var showInlineProcessingIcon = function(parentStepElement) {
        var stepNotificationElement = $(parentStepElement).find('.stepNotification');
        if (stepNotificationElement.length == 1) {
            stepNotificationElement[0].innerHTML =
                '<span class="stepNotification__processing fsIcon--processing"></span>';
        }
    };
    var hideInlineProcessingIcon = function(parentStepElement) {
        var stepNotificationElement = $(parentStepElement).find('.stepNotification');
        if (stepNotificationElement.length == 1) {
            stepNotificationElement[0].innerHTML = '';
        }
    };
    var getStepNotificationWrapperElement = function() {
        var stepNotificationElement = document.createElement('div');
        stepNotificationElement.className = 'stepNotification';
        return stepNotificationElement;
    };
    var getLabelInStepRowElement = function(
        labelHtml,
        additionalLabelClassName,
        additionalStepClassName
    ) {
        var labelElement = document.createElement('label');
        labelElement.className = 'fsLabel';
        if (additionalLabelClassName !== undefined) {
            labelElement.className += ' ' + additionalLabelClassName;
        }
        labelElement.innerHTML = labelHtml;
        return getStepRowElement(labelElement, additionalStepClassName);
    };
    var getDivElementForNewDocRelease1Only = function() {
        var tempElement = document.createElement('div');
        tempElement.innerHTML = RELEASE1_NOTE_HTML;
        var release1NoteElement = tempElement.children[0];
        var divElementRelease1Only = document.createElement('div');
        divElementRelease1Only.className = 'signdoc--release1';
        divElementRelease1Only.innerHTML = '';
        divElementRelease1Only.appendChild(release1NoteElement);
        return divElementRelease1Only;
    };
    var getDocumentNameSection = function() {
        var txtDocNameElement = document.createElement('input');
        txtDocNameElement.type = 'text';
        txtDocNameElement.id = 'txtDocNameElement';
        txtDocNameElement.className = 'fsInput fsInput--text';
        txtDocNameElement.setAttribute(EVENT_DATA_ATTRIBUTE_NAME, true);
        txtDocNameElement.setAttribute('data-step-required', true);
        var labelElement = document.createElement('label');
        labelElement.className = 'fsLabel fsLabel--block';
        labelElement.for = txtDocNameElement.id;
        labelElement.innerHTML = 'Create and name your document';
        var fsStepElement = document.createElement('div');
        fsStepElement.innerHTML = '';
        fsStepElement.className = 'fsStepItem';
        fsStepElement.appendChild(getStepNotificationWrapperElement());
        fsStepElement.appendChild(getStepRowElement(labelElement));
        fsStepElement.appendChild(getStepRowElement(txtDocNameElement));
        return fsStepElement;
    };
    var getESignatureComponents = function() {
        var fsStepElement = document.createElement('div');
        fsStepElement.className = 'fsStepItem';
        fsStepElement.appendChild(createNoteElement());
        var inputElement = document.createElement('label');
        inputElement.className = 'fsInput';
        inputElement.innerHTML = 'This feature is not supprted';
        fsStepElement.appendChild(inputElement);
        return fsStepElement;
    };
    var getLoopItemColumnForFMRow = function() {
        var checkboxElementRandomId =
            'checkboxIsLoop' + Math.floor(Math.random() * 10000) + Date.now();
        var labelElement = document.createElement('label');
        labelElement.className = 'fmColumnItem__label fsCheckboxLabel';
        labelElement.innerHTML = 'Loop';
        labelElement.setAttribute('for', checkboxElementRandomId);
        var checkboxElement = document.createElement('input');
        checkboxElement.className = 'fmColumnItem__loop fsCheckbox';
        checkboxElement.type = 'checkbox';
        checkboxElement.id = checkboxElementRandomId;
        var fmColumnItemElement = document.createElement('div');
        fmColumnItemElement.className = 'fmColumnItem';
        fmColumnItemElement.appendChild(checkboxElement);
        fmColumnItemElement.appendChild(labelElement);
        return fmColumnItemElement;
    };
    var getFieldMappingHeaderRow = function() {
        var rowElement = document.createElement('div');
        rowElement.className = 'fmRow fmRow--header';
        rowElement.innerHTML = '';
        var labelElement = document.createElement('label');
        labelElement.className = 'fsLabel';
        labelElement.innerHTML = 'Document Merge Field';
        var col1Element = document.createElement('div');
        col1Element.className = 'fmColumn fmColumn--col1';
        col1Element.appendChild(labelElement);

        var label2Element = document.createElement('label');
        label2Element.className = 'fsLabel';
        label2Element.innerHTML = 'Formstack Form Field';
        var col2Element = document.createElement('div');
        col2Element.className = 'fmColumn fmColumn--col2';
        col2Element.appendChild(label2Element);
        rowElement.appendChild(col1Element);
        rowElement.appendChild(col2Element);
        return rowElement;
    };

    var getElementsForFirstColumnInNestedRow = function(fieldName) {
        var tempDocFragment = document.createDocumentFragment();
        var spanPrefixElement = document.createElement('span');
        spanPrefixElement.innerHTML = '{$';
        var spanSuffixElement = document.createElement('span');
        spanSuffixElement.innerHTML = '}';
        var textboxMergeFieldTextElement = document.createElement('input');
        textboxMergeFieldTextElement.className = 'fsInput fsInput--text';
        textboxMergeFieldTextElement.type = 'text';
        textboxMergeFieldTextElement.setAttribute('placeholder', 'Type the merge field name...');
        textboxMergeFieldTextElement.value = fs.Utils.getSafeString(fieldName, '');
        tempDocFragment.appendChild(spanPrefixElement);
        tempDocFragment.appendChild(textboxMergeFieldTextElement);
        tempDocFragment.appendChild(spanSuffixElement);
        return tempDocFragment;
    };
    /**
     *
     * @param {string} fieldName
     * @param {*} fieldValue
     * @param {*} parentFieldMappingRow
     * @param {string} parentObjectIdentifier nested fieldMappingItem->oText will have only the field name after last index of '.' i.e. in case of repeated field (Contact.Case.A.Name) in available field list to be selected. oText here will be just Name and Contact.Case.A will be ised from parent element parentObjectIdentifier
     * @param {string} formFieldListSelectHTML form fields list as HTML in format of select-> option/optgroup tags
     */
    var getFieldMappingRow = function(
        fieldName,
        fieldValue,
        parentFieldMappingRow,
        parentObjectIdentifier,
        formFieldListSelectHTML
    ) {
        var rowElement = document.createElement('div');
        var isNestedRow = false;
        var rowClassName = 'fmRow';

        if (!fs.Utils.isNullOrUndefined(parentFieldMappingRow)) {
            isNestedRow = true;
            if (
                !fs.Utils.isNullOrEmpty(parentObjectIdentifier) &&
                !fs.Utils.isNullOrEmpty(fieldValue)
            ) {
                // in case we need to append a prefix for fieldValue
                fieldValue = parentObjectIdentifier + '.' + fieldValue;
            }
        }
        rowElement.className = rowClassName;
        rowElement.innerHTML = '';
        var fieldListForFormFieldSelectElementHTML = '';
        var formFieldSelectElement = document.createElement('select');
        var col1Element = document.createElement('div');
        col1Element.className = 'fmColumn fmColumn--col1';
        if (isNestedRow) {
            var firstColumnElements = getElementsForFirstColumnInNestedRow(fieldName);
            col1Element.appendChild(firstColumnElements);
            fieldListForFormFieldSelectElementHTML = formFieldListSelectHTML;
            formFieldSelectElement.className = 'fsSelect fsSelect2--selectSM';
        } else {
            fieldListForFormFieldSelectElementHTML = fs.Utils.getFSNSVariable(
                enumDataVariable.availableFormFieldListSelectHTML,
                ''
            );
            formFieldSelectElement.className = 'fsSelect fsSelect2--selectL';
            var labelElement = document.createElement('label');
            labelElement.className = 'fsLabel';
            labelElement.setAttribute('data-merge-field-name', fieldName);
            labelElement.innerHTML = fieldName;
            col1Element.appendChild(labelElement);
        }
        if (fieldListForFormFieldSelectElementHTML != '') {
            formFieldSelectElement.innerHTML = fieldListForFormFieldSelectElementHTML;
            if (!fs.Utils.isNullOrEmpty(fieldValue)) {
                formFieldSelectElement.value = fieldValue;
            }
        } else {
            formFieldSelectElement.innerHTML = '<option>--select a field--</option>';
        }
        var col2Element = document.createElement('div');
        col2Element.className = 'fmColumn fmColumn--col2';
        col2Element.appendChild(formFieldSelectElement);
        var rowItemElement = document.createElement('div');

        var col3Element = document.createElement('div');
        col3Element.className = 'fmColumn fmColumn--col3';
        if (isNestedRow) {
            rowItemElement.className = 'fmRow__item fmRow__item--level2';
            // add 'add/delete row buttons
            var actionbtns =
                '<button type="button" class="actionBtn actionBtn--delete">delete</button><button type="button" class="actionBtn actionBtn--add">add</button>';
            col3Element.innerHTML = actionbtns;
        } else {
            rowItemElement.className = 'fmRow__item fmRow__item--level1';
            col3Element.appendChild(getLoopItemColumnForFMRow());
        }
        rowItemElement.appendChild(col1Element);
        rowItemElement.appendChild(col2Element);
        rowItemElement.appendChild(col3Element);
        rowElement.appendChild(rowItemElement);
        return rowElement;
    };

    var getFieldMappingsList = function(fieldList) {
        var stepRowItemElement = document.createElement('div');
        stepRowItemElement.className = 'stepRow__item';
        var fieldListLength = fieldList.length;
        stepRowItemElement.appendChild(getFieldMappingHeaderRow());
        for (var iIndex = 0; iIndex < fieldListLength; iIndex++) {
            stepRowItemElement.appendChild(getFieldMappingRow(fieldList[iIndex], null));
        }
        if ($.fn.select2) {
            bindChangeOnFieldMappingSelectElements(stepRowItemElement);
        }
        return stepRowItemElement;
    };

    var getDocumentSourceComponents = function() {
        var tempElement = document.createElement('div');
        tempElement.innerHTML = RADIO_BUTTONLIST_HTML.documentSourceTypeList;
        var radioButtonListElement = tempElement.children[0];
        radioButtonListElement.className += radioButtonListElement.className + ' signdoc--release2';
        $(radioButtonListElement)
            .find('input')
            .attr(EVENT_DATA_ATTRIBUTE_NAME, true);
        bindClickOnRadioButtonItem(radioButtonListElement);
        var fsStepElement = document.createElement('div');
        fsStepElement.className = 'fsStepItem';
        fsStepElement.appendChild(getStepNotificationWrapperElement());
        var labelElement = document.createElement('label');
        labelElement.className = 'fsLabel fsLabel--block';
        labelElement.innerHTML =
            "Specify your document's settings to be generated with Formstack Documents.";
        fsStepElement.appendChild(labelElement);
        fsStepElement.appendChild(getStepRowElement(radioButtonListElement));
        return fsStepElement;
    };
    var enumFSObjectType = {
        Detail: 'Detail',
        Primary: '',
        Lookup: 'Lookup'
    };
    Object.freeze(enumFSObjectType);
    var FormObjectInfo = function() {
        this.order = 1;
        this.objDisplayName = '';
        this.objType = enumFSObjectType.Primary;
        this.childLetter = '';
        this.isRepeated = false;
    };
    var COLOR_TAG_ARRAY = [
        'Z',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y'
    ];
    var getObjectList = function() {
        var objectList = [];
        $('.ObjectName>h4')
            .find('>span')
            .each(function(indx, item) {
                var formObj = new FormObjectInfo();
                if ($(item).hasClass('secName-wrap')) {
                    formObj.objType = enumFSObjectType.Lookup;
                    formObj.objDisplayName = $(item)
                        .text()
                        .trim();
                    formObj.order = indx + 1;
                    var childCount = fs.Utils.getSafeString($(item).attr('data-relobj'), '');
                    if (childCount != '') {
                        formObj.objType = enumFSObjectType.Detail;
                        formObj.childLetter = COLOR_TAG_ARRAY[childCount];
                        formObj.isRepeated = $(item).hasClass('is-repeat') ? true : false;
                    }
                } else {
                    var primaryObjectElement = $(item).find('#priName');
                    formObj.objType = enumFSObjectType.Primary;
                    formObj.objDisplayName = $(primaryObjectElement).text();
                    formObj.order = 1;
                }
                objectList.push(formObj);
            });
        return objectList;
    };
    var populateDDLDocumentList = function(fsStepElement) {
        var documentDtoRecordObj = fs.Utils.getFSNSVariable(
            enumDataVariable.currentDocumentDTORecord,
            null
        );
        if (
            documentDtoRecordObj != null &&
            !fs.Utils.isNullOrEmpty(documentDtoRecordObj.PlatformAccountId)
        ) {
            var documentIdKeyPairAsString =
                documentDtoRecordObj.DocumentId + ':' + documentDtoRecordObj.DocumentKey;
            var existingSelectElement = $(fsStepElement).find('#ddlFormstackDocumentList');
            $(existingSelectElement).val(documentIdKeyPairAsString);
            $(existingSelectElement).trigger('change', EVENT_TRIGGERED_BY_CODE);
        }
    };
    var populateFieldMappingSelectElements = function(stepItemElement) {
        var documentDtoRecordObj = fs.Utils.getFSNSVariable(
            enumDataVariable.currentDocumentDTORecord,
            null
        );
        if (
            documentDtoRecordObj != null &&
            !fs.Utils.isNullOrEmpty(documentDtoRecordObj.FieldMappingJSON)
        ) {
            var fieldMappinItemArray = JSON.parse(
                fs.Utils.setSecureInputValue(documentDtoRecordObj.FieldMappingJSON)
            );
            var fieldMappinItemsCount = fieldMappinItemArray.length;
            var fieldMappingBoxElement = $(stepItemElement).find('.fsStepItem--fieldMappingBox');
            for (var index = 0; index < fieldMappinItemsCount; index++) {
                var fieldMappingItemKeyValuePairObject = fieldMappinItemArray[index];
                for (var docMergeField in fieldMappingItemKeyValuePairObject) {
                    if (fieldMappingItemKeyValuePairObject.hasOwnProperty(docMergeField)) {
                        var fieldMappingItem = fieldMappingItemKeyValuePairObject[docMergeField];
                        var fmRowElement = $(fieldMappingBoxElement)
                            .find('[data-merge-field-name="' + docMergeField + '"]')
                            .parent()
                            .parent();
                        if (fieldMappingItem.oType == enumFieldMappinItemType.field) {
                            $(fmRowElement)
                                .find('select')
                                .select2('val', fieldMappingItem.oText);
                        } else if (fieldMappingItem.oType == enumFieldMappinItemType.object) {
                            var loopCheckboxElement = $(fmRowElement).find('.fmColumnItem__loop');
                            $(loopCheckboxElement).prop('checked', true);
                            var fieldMappingRowElement = $(loopCheckboxElement).parents('.fmRow');
                            var ddlFieldMappingElement = $(fieldMappingRowElement)
                                .find('.fmColumn--col2')
                                .find('select');
                            setStateForLoopFieldMappingDropdown(ddlFieldMappingElement, true);
                            showNestedFieldMappingItemsForLoop(
                                fieldMappingItem.fields,
                                fieldMappingRowElement,
                                fieldMappingItem.oText
                            );
                        }
                    }
                }
            }
        }
    };
    var generateElementFromHtml = function(html) {
        var tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        return tempElement.children[0];
    };
    var handleDocumentDetailApiServiceResponse = function(response, stepDetailElement) {
        console.log('[handleDocumentDetailApiServiceResponse]');
        console.log(response);
        var fsStepElement = document.createElement('div');
        fsStepElement.innerHTML = '';
        fsStepElement.className = 'fsStepItem fsStepItem--fieldMappingBox';
        var elementList = getFieldMappingsList(Object.keys(response.fields));
        fsStepElement.appendChild(getStepRowElement(elementList));
        $(stepDetailElement)
            .find('.fsStepItem--fieldMappingBox')
            .remove();
        $(stepDetailElement).append(fsStepElement);
        // bind loop checkboxes
        bindChangeOnLoopCheckboxItems($(stepDetailElement).find('.fsStepItem--fieldMappingBox'));
        populateFieldMappingSelectElements(stepDetailElement);
    };
    var handleDocumentApiServiceRefreshResponse = function(response, stepDetailElement) {
        if (response.responseJSON !== undefined && response.responseJSON.error) {
            var notificationElement = $(stepDetailElement).find('.stepNotification');
            window.showPillMessage_Error(response.responseJSON.error, true, notificationElement);
        } else {
            var selectElement = getDDLElementWithDocumentTemplateObjList(response);
            console.log('[handleDocumentApiServiceRefreshResponse]');
            console.log(selectElement);
            var existingSelectElement = $(stepDetailElement).find('#ddlFormstackDocumentList');
            $(existingSelectElement).select2('destroy');
            $(existingSelectElement).html(selectElement.innerHTML);
            $(existingSelectElement).select2(select2Options);
        }
    };
    var handleDocumentApiServiceResponse = function(response, stepDetailElement) {
        if (response.responseJSON !== undefined && response.responseJSON.error) {
            var notificationElement = $(stepDetailElement).find('.stepNotification');
            window.showPillMessage_Error(response.responseJSON.error, true, notificationElement);
        } else {
            removeExistingFieldMappingAndEventBoxSection(stepDetailElement);
            var selectElement = getDDLElementWithDocumentTemplateObjList(response);
            console.log('[handleDocumentApiServiceResponse]');
            console.log(selectElement);
            var fsStepElement = document.createElement('div');
            fsStepElement.innerHTML = '';
            fsStepElement.className = 'fsStepItem fsStepItem--documentEventsBox';
            fsStepElement.appendChild(getDivElementForNewDocRelease1Only());
            var refreshButtonElement = generateElementFromHtml(
                BUTTON_LIST_HTML.refreshDocumentList
            );
            var editInDocumentsButtonElement = generateElementFromHtml(
                BUTTON_LIST_HTML.editInDocuments
            );
            var elementList = [];
            elementList.push(selectElement);
            elementList.push(refreshButtonElement);
            elementList.push(editInDocumentsButtonElement);
            var labelElementSelectDocs = 'Select a document from Formstack Documents';
            fsStepElement.appendChild(
                getLabelInStepRowElement(labelElementSelectDocs, 'fsLabel--block')
            );
            fsStepElement.appendChild(getStepRowElement(elementList));
            var fieldMappingSectionHeaderLabel = 'Field Mapping';
            var fieldMappingSectionHeaderNote =
                'Customize which data to display in your document using merge fields.';
            fsStepElement.appendChild(
                getLabelInStepRowElement(
                    fieldMappingSectionHeaderLabel,
                    'fsLabel--block fsLabel--bold',
                    'stepRow--newSectionBlock'
                )
            );
            fsStepElement.appendChild(getLabelInStepRowElement(fieldMappingSectionHeaderNote));
            bindChangeOnFormstackDocumentSelectionDDL(fsStepElement);
            bindClickOnRefreshDocumentListButton(fsStepElement);
            bindClickOnEditInDocumentsButton(fsStepElement);
            $(stepDetailElement).append(fsStepElement);
            populateDDLDocumentList(fsStepElement);
        }
    };
    var getDDLElementWithDocumentTemplateObjList = function(documentTemplateList) {
        var selectElement = document.createElement('select');
        selectElement.className = 'fsSelect2 fsSelect2--selectSM';
        selectElement.id = 'ddlFormstackDocumentList';
        var objectIndex = 0;
        var defaultOptionElement = document.createElement('option');
        defaultOptionElement.innerHTML = '--select a document--';
        defaultOptionElement.value = '';
        selectElement.setAttribute(EVENT_DATA_ATTRIBUTE_NAME, true);
        rebindChangeOnStepElementEventTriggerByElements(
            enumBuilderStep.DocumentSource,
            selectElement,
            validateStepDocumentSource
        );
        selectElement.appendChild(defaultOptionElement);
        for (objectIndex; objectIndex < documentTemplateList.length; objectIndex++) {
            var optionElement = document.createElement('option');
            var documentTemplateObj = documentTemplateList[objectIndex];
            var optionClassName = 'fsOption';
            optionElement.className = optionClassName;
            optionElement.innerHTML = documentTemplateObj.name;
            optionElement.value = documentTemplateObj.id + ':' + documentTemplateObj.key;
            selectElement.appendChild(optionElement);
        }
        return selectElement;
    };
    var getDDLElementWithObjectList = function(objectList) {
        var selectElement = document.createElement('select');
        selectElement.className = 'fsSelect2 fsSelect2--selectM';
        selectElement.id = 'ddlObjectList';
        var objectIndex = 0;
        for (objectIndex; objectIndex < objectList.length; objectIndex++) {
            var optionElement = document.createElement('option');
            var formObj = objectList[objectIndex];
            var optionClassName = '';
            if (formObj.objType == enumFSObjectType.Lookup) {
                optionClassName = 'ObjectLookupOption';
            } else if (formObj.objType == enumFSObjectType.Detail) {
                optionClassName = 'ObjectDetailOption ' + formObj.childLetter;
            }
            optionElement.className = optionClassName;
            optionElement.innerHTML = formObj.objDisplayName;
            optionElement.value = formObj.order;
            selectElement.appendChild(optionElement);
        }
        return selectElement;
    };
    var getObjectListFromGlobalVariable = function() {
        var objectList = getObjectList();
        var objectListWithoutRepeatedChild = objectList.reduce(function(result, objectItemValue) {
            if (!objectItemValue.isRepeated) {
                result.push(objectItemValue);
            }
            return result;
        }, []);
        fs.Utils.setFSNSVariable(
            enumDataVariable.objectListForSaveDocumentsTo,
            objectListWithoutRepeatedChild
        );
        // TODO: implement function to set this value on change of the form object configuration.
        return fs.Utils.getFSNSVariable(enumDataVariable.objectListForSaveDocumentsTo, null);
    };
    var getSaveDocumentToSection = function() {
        var fsStepElement = document.createElement('div');
        fsStepElement.className = 'fsStepItem';
        var label1 = 'Customize where you would like to save the generated document to.';
        var label2 = 'Choose which record to attach the document to:';
        var objectListMapForDropDownList = getObjectListFromGlobalVariable();
        var ddlObjectListElement = getDDLElementWithObjectList(objectListMapForDropDownList);
        ddlObjectListElement.setAttribute(EVENT_DATA_ATTRIBUTE_NAME, true);
        var tempElement = document.createElement('div');
        tempElement.innerHTML = RADIO_BUTTONLIST_HTML.saveDocumentToFileTypeList;
        var attachmentTypeRadioButtonListElement = tempElement.children[0];
        $(attachmentTypeRadioButtonListElement)
            .find('input')
            .attr(EVENT_DATA_ATTRIBUTE_NAME, true);
        bindClickOnRadioButtonOfAttachmentType(attachmentTypeRadioButtonListElement);
        fsStepElement.appendChild(getStepNotificationWrapperElement());
        fsStepElement.appendChild(getLabelInStepRowElement(label1, 'fsLabel--block'));
        fsStepElement.appendChild(getLabelInStepRowElement(label2, 'fsLabel--block'));
        fsStepElement.appendChild(getStepRowElement(ddlObjectListElement));
        fsStepElement.appendChild(
            getStepRowElement(attachmentTypeRadioButtonListElement, 'stepRow--attachmentTypeList')
        );
        if ($.fn.select2) {
            $(fsStepElement)
                .find('.fsSelect2')
                .select2(select2Options);
        }
        return fsStepElement;
    };
    var validateStepESignature = function() {
        var isValid = true;
        // implement validation
        return isValid;
    };
    var validateStepDocumentSource = function() {
        var responseDataObj = getDataStepDocumentSource();
        return responseDataObj == null ? false : true;
    };
    var validateStepSaveDocumentTo = function() {
        var isValid = true;
        var saveDocumentStepRootElement = findStepRootElement(enumBuilderStep.SaveDocumentTo);
        var saveDocumentToObjectVal = $(saveDocumentStepRootElement)
            .find('#ddlObjectList')
            .val();
        var saveDocumentToFileType = $(saveDocumentStepRootElement)
            .find('input[name=savedocumentto]:checked')
            .val();
        if (
            fs.Utils.isNullOrEmpty(saveDocumentToObjectVal) ||
            fs.Utils.isNullOrEmpty(saveDocumentToFileType)
        ) {
            isValid = false;
        }
        return isValid;
    };
    var getValueForMappingItem = function(value, enumFieldType, isNestedItem) {
        if (fs.Utils.isNullOrEmpty(value)) {
            return '';
        }
        if (enumFieldType == enumFieldMappinItemType.object) {
            return value.substring(0, value.lastIndexOf('.'));
        } else if (isNestedItem && enumFieldType == enumFieldMappinItemType.field) {
            return value.substring(value.lastIndexOf('.') + 1);
        }
        return value;
    };
    var getFieldMappinItemObject = function(key, value) {
        var fieldMappingItem = {};
        fieldMappingItem[key + ''] = value;
        return fieldMappingItem;
    };
    var getDataFromFieldMappingSection = function(parentRowElem, levelNumber) {
        if (fs.Utils.isNullOrUndefined(parentRowElem) || fs.Utils.isNullOrUndefined(levelNumber)) {
            return;
        }
        var levelIndex = parseFloat(levelNumber);
        var fieldMappingArr = [];
        var fieldMappingRows = $(parentRowElem).find('.fmRow__item--level' + levelIndex);
        var rowCount = fieldMappingRows.length;
        // we are only fetching 2 levels : level2 for oType==object level1 for other oType (i.e. field for now)
        var shouldContinueFetchNestedRows = levelIndex <= 1;
        for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            var rowElem = $(fieldMappingRows[rowIndex]);
            var docMergeFieldName = '';
            var isNestedRow = levelNumber > 1;
            if (isNestedRow) {
                // in nested rows we allow user to type in an input element
                docMergeFieldName = rowElem.find('>.fmColumn--col1>input').val();
            } else {
                docMergeFieldName = rowElem.find('>.fmColumn--col1>label').text();
            }
            var fieldMappingType = enumFieldMappinItemType.field;
            if (rowElem.find('.fmColumnItem__loop').is(':checked')) {
                fieldMappingType = enumFieldMappinItemType.object;
            }
            var formFieldName = '';
            if (fieldMappingType == enumFieldMappinItemType.object) {
                formFieldName = getValueForMappingItem(
                    rowElem
                        .next()
                        .find('.fmColumn--col2>select')
                        .val(),
                    fieldMappingType,
                    isNestedRow
                );
            } else {
                formFieldName = getValueForMappingItem(
                    rowElem.find('>.fmColumn--col2>select').val(),
                    fieldMappingType,
                    isNestedRow
                );
            }
            var nestedFieldMappingItemArr = [];
            if (
                shouldContinueFetchNestedRows &&
                fieldMappingType == enumFieldMappinItemType.object
            ) {
                nestedFieldMappingItemArr = getDataFromFieldMappingSection(
                    rowElem.parent(),
                    levelIndex + 1
                );
            }
            if (!fs.Utils.isNullOrEmpty(docMergeFieldName)) {
                var fieldMappingItemObj = new FieldMappingItem(fieldMappingType, formFieldName);
                fieldMappingItemObj.fields = nestedFieldMappingItemArr;
                if (isNestedRow) {
                    if (fieldMappingArr.length == 0) {
                        fieldMappingArr.push(
                            getFieldMappinItemObject(docMergeFieldName, fieldMappingItemObj)
                        );
                    } else {
                        // NOTE: only supported one type of object in one repeated object for now
                        fieldMappingArr[0][docMergeFieldName + ''] = fieldMappingItemObj;
                    }
                } else {
                    fieldMappingArr.push(
                        getFieldMappinItemObject(docMergeFieldName, fieldMappingItemObj)
                    );
                }
            }
        }
        return fieldMappingArr;
    };
    var getDataStepDocumentName = function() {
        var responseObj = {
            Name: ''
        };
        try {
            var stepRootElement = findStepRootElement(enumBuilderStep.DocumentName);
            var documentName = $(stepRootElement)
                .find('#txtDocNameElement')
                .val();
            responseObj.Name = documentName;
        } catch (err) {
            console.log('Unexpected error! [getDataStepDocumentName]' + err);
            responseObj = null;
        }
        return responseObj;
    };
    /**
     * Set default value for Document Type step
     * @param {enumDocumentOption} defaultDocumentTypeOption
     */
    var setDefaultValueForDocumentName = function(documentName) {
        var stepRootElement = findStepRootElement(enumBuilderStep.DocumentName);
        $(stepRootElement)
            .find('.fsInput--text')
            .val(documentName)
            .trigger('change', EVENT_TRIGGERED_BY_CODE);
    };
    /**
     * Set default value for Document Type step
     * @param {enumDocumentOption} defaultDocumentTypeOption
     */
    var setDefaultValueForDocumentSourceType = function(defaultDocumentTypeOption, documentDtoObj) {
        var stepRootElement = findStepRootElement(enumBuilderStep.DocumentSource);
        $(stepRootElement)
            .find('input[name=documentSource]')
            .val([defaultDocumentTypeOption])
            .trigger('change', EVENT_TRIGGERED_BY_CODE);
        if (!fs.Utils.isNullOrUndefined(documentDtoObj)) {
            fs.Utils.setFSNSVariable(enumDataVariable.currentDocumentDTORecord, documentDtoObj);
        }
    };
    /**
     * Set default value for Document Save to step
     * @param {enumSaveDocumentToOption} saveDocumentToOption
     * @param {number} attachToObject
     */
    var setDefaultValueForDocumentSaveTo = function(saveDocumentToOption, attachToObject) {
        var stepRootElement = findStepRootElement(enumBuilderStep.SaveDocumentTo);
        switch (saveDocumentToOption) {
            case enumSaveDocumentToOption.Chatter:
            case enumSaveDocumentToOption.SalesforceFiles:
                $(stepRootElement)
                    .find('#radiobtnSaveToFiles')
                    .prop('checked', true)
                    .trigger('change', EVENT_TRIGGERED_BY_CODE);
                break;
            case enumSaveDocumentToOption.Attachment:
                $(stepRootElement)
                    .find('#radiobtnSaveToAttachment')
                    .prop('checked', true)
                    .trigger('change', EVENT_TRIGGERED_BY_CODE);
                break;
            default:
        }
        if (!fs.Utils.isNullOrEmpty(attachToObject)) {
            $(stepRootElement)
                .find('#ddlObjectList')
                .select2('val', attachToObject);
        }
    };
    var getDataStepDocumentSource = function() {
        var responseObj = null;
        try {
            var stepRootElement = findStepRootElement(enumBuilderStep.DocumentSource);
            var documentTypeOption = $(stepRootElement)
                .find('input[name=documentSource]:checked')
                .val();
            if (fs.Utils.isNullOrEmpty(documentTypeOption)) {
                return null;
            }
            responseObj = new DocumentSourceData(documentTypeOption);
            if (responseObj.type == enumDocumentOption.SimplePDF) {
                return responseObj;
            }
            var documentIDKeyPairObj = getDocumentIdKeyPair($('#ddlFormstackDocumentList').val());
            if (documentIDKeyPairObj == null) {
                return null;
            }
            responseObj.documentId = documentIDKeyPairObj.id;
            responseObj.documentKey = documentIDKeyPairObj.key;
            var pcDataAttributesObj = fs.PC.getPlatformConnectionCompactViewDataAttributes(
                stepRootElement.find('.fsPlatformConnectionCompact')
            );
            responseObj.platformAccountId = pcDataAttributesObj.RecordId;
            var fieldMappingJSONOBJ = getDataFromFieldMappingSection(
                $('.fsStepItem--fieldMappingBox'),
                1
            );
            console.log('[getDataStepDocumentSource] fieldMappingJSONOBJ');
            console.log(fieldMappingJSONOBJ);
            responseObj.fieldMappingJSON = JSON.stringify(fieldMappingJSONOBJ);
        } catch (err) {
            console.log('Unexpected error! [getDataStepDocumentSource]' + err);
            responseObj = null;
        }
        return responseObj;
    };
    var getDataStepSaveDocumentTo = function() {
        var responseObj = {
            AttachToObject: '',
            UploadToSF: ''
        };
        try {
            var saveDocumentStepRootElement = findStepRootElement(enumBuilderStep.SaveDocumentTo);
            var saveDocumentToObjectVal = $(saveDocumentStepRootElement)
                .find('#ddlObjectList')
                .val();
            var saveDocumentToFileType = $(saveDocumentStepRootElement)
                .find('input[name=savedocumentto]:checked')
                .val();
            responseObj.AttachToObject = saveDocumentToObjectVal;
            if (
                saveDocumentToFileType == enumSaveDocumentToOption.SalesforceFiles &&
                $(saveDocumentStepRootElement)
                    .find('#checkboxSaveToChatter')
                    .prop('checked')
            ) {
                saveDocumentToFileType = enumSaveDocumentToOption.Chatter;
            }
            responseObj.UploadToSF = saveDocumentToFileType;
        } catch (err) {
            console.log('Unexpected error! [getDataStepSaveDocumentTo]' + err);
            responseObj = null;
        }
        return responseObj;
    };

    var validateGeneralStepRequiredElements = function(stepName) {
        var stepElement = findStepRootElement(stepName);
        var currentStepDetailElement =
            stepElement.length == 0 ? $('.stepDetail:visible') : stepElement.find('.stepDetail');
        var requiredElements = $(currentStepDetailElement).find('input[data-step-required="true"]');
        var elemIndex = 0;
        var elemCount = requiredElements.length;
        var isValid = true;
        for (elemIndex; elemIndex < elemCount; elemIndex++) {
            var reqElement = requiredElements[elemIndex];
            var reqElementValue = $(reqElement).val();
            if (reqElementValue == 'undefined' || reqElementValue == '') {
                isValid = false;
            }
        }
        return isValid;
    };
    var validateStep = function(stepName, shouldShowValidationMessage) {
        var isValid = true;
        console.log('[validateStep] stepName' + stepName);
        switch (stepName) {
            case enumBuilderStep.DocumentName:
                isValid = validateGeneralStepRequiredElements(enumBuilderStep.DocumentName);
                break;
            case enumBuilderStep.DocumentSource:
                isValid = validateStepDocumentSource();
                break;
            case enumBuilderStep.ESignature:
                isValid = validateStepESignature();
                break;
            case enumBuilderStep.SaveDocumentTo:
                isValid = validateStepSaveDocumentTo();
                break;
            default:
                console.log('STEP DEFAULT:' + stepName);
        }
        if (fs.Utils.getSafeBoolean(shouldShowValidationMessage, true)) {
            var stepRootElement = findStepRootElement(stepName);
            var errorDivElement = $(stepRootElement).find('.stepNotification');
            if (isValid) {
                window.hidePillMessage(errorDivElement);
            } else {
                var stepDetailElement = $(stepRootElement).find('.stepDetail');
                if (!$(stepDetailElement).is(':visible')) {
                    $(stepDetailElement)
                        .parent()
                        .find('.stepCompact__toggleBtn')
                        .click();
                }
                window.showPillMessage_Error(
                    'Please provide required values.',
                    true,
                    errorDivElement
                );
            }
        }
        return isValid;
    };

    var _Builder = {
        EVENT_DATA_ATTRIBUTE_NAME: EVENT_DATA_ATTRIBUTE_NAME,
        STEPS: enumBuilderStep,
        DOCUMENT_TYPE: enumDocumentOption,
        ATTACHMENT_TYPE: enumSaveDocumentToOption,
        STEP_CONSTANTS: STEP_CONSTANTS,
        DATA_VARIABLE: enumDataVariable,
        findStepRootElement: findStepRootElement,
        getCurrentDocumentRecordId: getCurrentDocumentRecordId,
        updateDocumentChangesNotificationUI: updateDocumentChangesNotificationUI,
        setDocumentEditingState: setDocumentEditingState,
        setDefaultValueForDocumentName: setDefaultValueForDocumentName,
        setDefaultValueForDocumentSourceType: setDefaultValueForDocumentSourceType,
        setDefaultValueForDocumentSaveTo: setDefaultValueForDocumentSaveTo,
        showInlineProcessingIcon: showInlineProcessingIcon,
        hideInlineProcessingIcon: hideInlineProcessingIcon,
        disableStepButtonByStepIndex: disableStepButtonByStepIndex,
        getDataStepDocumentName: getDataStepDocumentName,
        getDataStepSaveDocumentTo: getDataStepSaveDocumentTo,
        getDataStepDocumentSource: getDataStepDocumentSource,
        validateStepDocumentSource: function(shouldShowValidationMessage) {
            return validateStep(fs.DSB.STEPS.DocumentSource, shouldShowValidationMessage);
        },
        validateStepDocumentName: function(shouldShowValidationMessage) {
            return validateStep(fs.DSB.STEPS.DocumentName, shouldShowValidationMessage);
        },
        validateStepSaveDocumentTo: function(shouldShowValidationMessage) {
            return validateStep(fs.DSB.STEPS.SaveDocumentTo, shouldShowValidationMessage);
        },
        getStepComponents: function(stepName) {
            var component;
            console.log('[getStepComponents] stepName' + stepName);
            switch (stepName) {
                case enumBuilderStep.DocumentName:
                    component = getDocumentNameSection();
                    break;
                case enumBuilderStep.DocumentSource:
                    component = getDocumentSourceComponents();
                    break;
                case enumBuilderStep.ESignature:
                    component = getESignatureComponents();
                    break;
                case enumBuilderStep.SaveDocumentTo:
                    component = getSaveDocumentToSection();
                    break;
                default:
                    console.log('STEP DEFAULT:' + stepName);
            }
            return component;
        },
        renderDocumentSourceMappingSection: renderDocumentSourceMappingSection
    };
    return {
        DocumentStepBuilder: _Builder,
        DSB: _Builder
    };
});
