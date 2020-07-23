/**
 * @summary JS for Document feature core business logic
 * i.e. DOM manipulation, communication to Apex backend and/or talk to documentService.js which make callouts to external endpoints
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
        root.Document = libObject.Document;
        root.D = libObject.D;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var $ = fs;
    // TODO: moved to seperate files and generate html using build process using some sort of templating
    var DOCUMENTLIST_TITLE_TEXT = '<h2>Your Form Documents</h2>';
    // For now minifed by - https://www.willpeavy.com/tools/minifier/
    var DOCUMENT_HTML = { newDocumentIfNoRecordFound: '', documentDetail: '', documentList: '' };
    // minified html of ./documentDetail.html
    DOCUMENT_HTML.documentDetail =
        '<div class="documentDetailView"><span class="fsIcon--processing"></span></div>';
    // minified html of ./newDocumentIfNoRecordFound.html
    DOCUMENT_HTML.newDocumentIfNoRecordFound =
        '<div class="fsNewBlock"><div class="fsNewBlock__icon fsNewBlock__icon--document"></div><h3 class="fsNewBlock__title">Start creating documents from your forms data</h3><h4 class="fsNewBlock__description"> You haven\'t added any documents yet. Want to get started with first one?</h4><div class="fsNewBlock__button fsNewBlock__button--center"> <button type="button" class="fsBtn fsBtn--primary fsBtn--radius-md"><span class="fsBtn__icon fsBtn__icon--plus"></span><span class="fsBtn__text">New Document</span></button></div></div>';
    // minified html of ./documentList.html
    DOCUMENT_HTML.documentList =
        '<div class="fsTable" id="fsTable"><div class="fsTable__row fsTable__row--header"><div class="fsColumn"><span class="fsColumn__title">Name</span></div><div class="fsColumn fsColumn--action"></div></div><div class="fsTable__row"><div class="fsColumn"><span class="fsColumn__text">Sample Document</span></div><div class="fsColumn fsColumn--action"><a class="fsColumn__text blue-tooltip fsColumn__text--edit"><span class="blue-tooltip-text -ml20">Edit</span></a><a class="fsColumn__text blue-tooltip fsColumn__text--duplicate"><span class="blue-tooltip-text -ml20">Duplicate</span></a><a class="fsColumn__text blue-tooltip fsColumn__text--delete"><span class="blue-tooltip-text -ml20">Delete</span></a></div></div></div><div class="fsVerticalBar"></div><div class="fsNewBlock__button fsNewBlock__button--center"> <button type="button" class="fsBtn fsBtn--primary fsBtn--radius-md"><span class="fsBtn__icon fsBtn__icon--plus"></span><span class="fsBtn__text">New Document</span></button></div>';

    var BUTTON_LIST_HTML = {
        detailViewBack:
            '<button type="button" class="fsBtn fsBtn--alink"><span class="fsBtn__icon fsBtn__icon--leftArrow"></span><span class="fsBtn__text">Back to Document List</span></button>'
    };
    // To provide display friendly customized value for pre-defined values
    var PROVIDER_TYPE_ENUM = { SimplePDF: 'Simple PDF', FormstackDocuments: 'Formstack Documents' };
    Object.freeze(PROVIDER_TYPE_ENUM);
    // To order of columns show up in a document list: all other fields will show up after following columns: action column render as last column
    var DOCUMENTLIST_COLUMNS_ORDER_ARRAY = ['Name', 'ProviderType', 'Created'];
    // Fixed width columns by its hader names
    var DOCUMENTLIST_FIXED_MED_COLUMNS_ARRAY = ['Created'];
    // To customize column name of the table from its original field name passed from back end
    var DOCUMENTLIST_COLUMNS_DISPLAYNAMES_MAP = {
        Name: 'Name',
        ProviderType: 'Type',
        Created: 'Created'
    };
    // To custmomize column value in the rows for some predefined fields i.e. ProviderType and/or Date fields
    var DOCUMENTLIST_FORMAT_COLUMNS_MAP = { Created: 'DateTime', ProviderType: 'ProviderTypeEnum' };
    //List of provider types
    const documentsProviderTypesArr = ['FormstackDocuments']; // empty for SimplePDF

    var formatColumnTextValue = function(fieldValue, formatType) {
        var fieldValueResponse = '';
        switch (formatType) {
            case 'DateTime':
                fieldValueResponse = window.moment(fieldValue).format('MM/DD/YYYY hh:mm:ss A');
                break;
            case 'ProviderTypeEnum':
                fieldValueResponse = PROVIDER_TYPE_ENUM[fieldValue];
                break;
            default:
                fieldValueResponse = fieldValue;
        }
        return fieldValueResponse;
    };
    var getFilteredValuesFromArray = function(arrayObj, itemValuesToInclude) {
        var resultArrayOfValues = arrayObj.reduce(function(result, arrayItemValue) {
            if (itemValuesToInclude.indexOf(arrayItemValue) > -1) {
                result.push(arrayItemValue);
            }
            return result;
        }, []);
        return resultArrayOfValues;
    };
    var replaceColumnNameWithDisplayName = function(columnArrayObj, columnsDisplayMap) {
        var columnsDisplayKeysArray = Object.keys(columnsDisplayMap);
        var resultArrayOfValues = columnArrayObj.reduce(function(result, arrayItemValue) {
            var columnDisplayIndex = columnsDisplayKeysArray.indexOf(arrayItemValue);
            if (columnDisplayIndex > -1) {
                var columnName = columnsDisplayKeysArray[columnDisplayIndex];
                result.push(columnsDisplayMap[columnName]);
            } else {
                result.push(arrayItemValue);
            }
            return result;
        }, []);
        return resultArrayOfValues;
    };
    var moveColumnsToTopInArray = function(columnArray, arrayObj) {
        var newSortedArray = arrayObj.slice(0);
        var columnArrayIndex = columnArray.length - 1;
        for (columnArrayIndex; columnArrayIndex >= 0; columnArrayIndex--) {
            if (newSortedArray.indexOf(columnArray[columnArrayIndex]) > 0) {
                newSortedArray.splice(newSortedArray.indexOf(columnArray[columnArrayIndex]), 1);
                newSortedArray.unshift(columnArray[columnArrayIndex]);
            }
        }
        return newSortedArray;
    };
    var getFilteredValuesFromObject = function(jsonObject, keysToInclude, columnsToSort) {
        var resultArrayOfValues = getFilteredValuesFromArray(
            Object.keys(jsonObject),
            keysToInclude
        );
        if (columnsToSort != 'undefined' && columnsToSort instanceof Array) {
            // let's sort the order of Columns as expected
            resultArrayOfValues = moveColumnsToTopInArray(columnsToSort, resultArrayOfValues);
        }
        var resultArrayOfObjectValues = resultArrayOfValues.reduce(function(result, key) {
            // adding values of columns from JSON object. So let's format Date
            var formatColumnIndex = Object.keys(DOCUMENTLIST_FORMAT_COLUMNS_MAP).indexOf(key);
            if (formatColumnIndex >= 0) {
                result.push(
                    formatColumnTextValue(jsonObject[key], DOCUMENTLIST_FORMAT_COLUMNS_MAP[key])
                );
            } else {
                result.push(jsonObject[key]);
            }
            return result;
        }, []);
        return resultArrayOfObjectValues;
    };
    var getDocumentRecordIdInRowElemByActionElem = function(actionElem) {
        var currentRowElem = $(actionElem).parents('.fsTable__row');
        var documentRecordId = '';
        if ($(currentRowElem).length == 1) {
            documentRecordId = $(currentRowElem).attr('data-document-recordid');
        }
        if (documentRecordId != 'undefined' || documentRecordId != '') {
            return documentRecordId;
        }
        return '';
    };
    /**
     * Navigate to document edit view
     * @todo implementation
     */
    var editDocument = function(thisElem) {
        var documentRecordId = getDocumentRecordIdInRowElemByActionElem(thisElem);
        switchToDocumentDetailView(documentRecordId);
    };
    /**
     * duplicate existing Document
     */
    var duplicateDocument = function(thisElem) {
        var documentRecordId = getDocumentRecordIdInRowElemByActionElem(thisElem);
        //Look for this element's parent (fsTable__row)
        thisElem.parentElement.parentElement.classList.add('ff-loading');
        Visualforce.remoting.Manager.invokeAction(
            window.REMOTE_ACTIONS['DocumentController']['cloneDocument'],
            { RecordId: documentRecordId },
            function(response, event) {
                //Pipe through a general function:
                documentPostInvokeAction(response, event);
            }
        );
    };
    /**
     * delete existing Document
     * @todo implementation
     */
    var deleteDocument = function(thisElem) {
        var documentRecordId = getDocumentRecordIdInRowElemByActionElem(thisElem);
        //Look for this element's parent (fsTable__row)
        confirmDialogWithCallback(
            'Are you sure you want this document deleted?',
            "We can't recover it after it's been removed from the list.",
            {},
            function() {
                thisElem.parentElement.parentElement.classList.add('ff-loading');
                Visualforce.remoting.Manager.invokeAction(
                    window.REMOTE_ACTIONS['DocumentController']['deleteDocument'],
                    { RecordId: documentRecordId },
                    function(response, event) {
                        //Perform response handling:
                        documentPostInvokeAction(response, event);
                    }
                );
            }
        );
    };

    //Run this when invokeAction when salesforce is done doing things on the back-end (or for testing purposes):
    var documentPostInvokeAction = function(response, event) {
        var success = event.statusCode == 200;
        if (success) {
            if (!response.IsValid) {
                window.showPillMessage_Error(response.ErrorMessage, true);
            } else {
                updateFormDraftPublishState();
                fetchRelatedDocumentsByProvider(
                    fs.Utils.getFSNSVariable(fs.Utils.DATA_VARIABLE.currentFormRecordId, ''),
                    documentsProviderTypesArr
                );
            }
        } else {
            handleRemoteErrorEvent(event);
        }
    };

    var saveDocumentSetup = function(thisElem) {
        console.log('[saveDocumentSetup] clicked');
        console.log(thisElem);
        var documentDTOObj = new fs.DTOs.DocumentDTOProvider.DocumentDTO();
        var documentSaveToObj = fs.DSB.getDataStepSaveDocumentTo();
        var documentSourceObj = fs.DSB.getDataStepDocumentSource();
        documentDTOObj.FormId = fs.Utils.getFSNSVariable(
            fs.Utils.DATA_VARIABLE.currentFormRecordId,
            ''
        );
        documentDTOObj.Name = fs.DSB.getDataStepDocumentName().Name;
        if (documentSourceObj != null) {
            if (documentSourceObj.type == fs.DSB.DOCUMENT_TYPE.SimplePDF) {
                // Won't hit this code until RELEASE 2
                // We don't need any document source data since we will be using form html as PDF source
            } else {
                documentDTOObj.DocumentId = documentSourceObj.documentId;
                documentDTOObj.DocumentKey = documentSourceObj.documentKey;
                documentDTOObj.FieldMappingJSON = documentSourceObj.fieldMappingJSON;
                documentDTOObj.PlatformAccountId = documentSourceObj.platformAccountId;
            }
            // if we are creating new document, then keep RecordId blank
            var currentDocumentRecordId = fs.DSB.getCurrentDocumentRecordId();
            if (currentDocumentRecordId != null) {
                documentDTOObj.RecordId = currentDocumentRecordId;
            } else {
                documentDTOObj.RecordId = '';
            }
            documentDTOObj.AttachToObject = documentSaveToObj.AttachToObject;
            documentDTOObj.UploadToSF = documentSaveToObj.UploadToSF;
            documentDTOObj.isActive = true;
            console.log('[saveDocumentSetup] documentDTOObj:');
            console.log(documentDTOObj);
            var stepElement = fs.DSB.findStepRootElement(fs.DSB.STEPS.ReadyAndSave);
            fs.DSB.disableStepButtonByStepIndex($(stepElement).attr('data-step-index'));
            if (fs.Utils.isNullOrEmpty(documentDTOObj.RecordId)) {
                createDocument(documentDTOObj, null);
            } else {
                updateDocument(documentDTOObj, null);
            }
            fs.Utils.setFSNSVariable(fs.DSB.DATA_VARIABLE.currentDocumentDTORecord, documentDTOObj);
        } else {
            window.showPillMessage_Error(fs.Utils.CONSTANTS.uiMessage.somethingWentWrong, true);
        }
    };
    var updateFormDraftPublishState = function() {
        if (typeof window.updatePreviousFormObjForPublishToggle !== 'undefined') {
            window.updatePreviousFormObjForPublishToggle('Unpublished');
        }
    };
    var doesDocumentHaveUnsavedChanges = function() {
        return $('.sfff-document-editor-li').find('.hasUnsavedChanges').length == 1;
    };
    var clearDocumentUnsavedChanges = function(clearDocumentDTO) {
        $('.sfff-document-editor-li')
            .find('.hasUnsavedChanges')
            .remove();
        if (!fs.Utils.isNullOrUndefined(clearDocumentDTO) && clearDocumentDTO) {
            fs.Utils.setFSNSVariable(fs.DSB.DATA_VARIABLE.currentDocumentDTORecord, null);
        }
        fs.Utils.setFSNSVariable(fs.DSB.DATA_VARIABLE.hasDocumentChanged, undefined);
        fs.Utils.setFSNSVariable(fs.Utils.DATA_VARIABLE.isWindowSafeToUnload, undefined);
    };
    var loadDocumentDetailView = function(documentRecordId) {
        fs.Utils.setFSNSVariable(fs.DSB.DATA_VARIABLE.currentDocumentDTORecord, null);
        if (!fs.Utils.isNullOrEmpty(documentRecordId)) {
            // fetch documentRecordDetail
            fetchDocumentById(documentRecordId);
        } else {
            loadDocumentViewWithSteps(false);
        }
    };
    var loadDocumentViewWithSteps = function(isEditMode, documentDTOObj) {
        var documentStepsRootElem = $('.documentDetailView');
        $(documentStepsRootElem).html(getDocumentDetailViewElem(isEditMode));
        var divStepDocumentNameElement = fs.DSB.getStepComponents(fs.DSB.STEPS.DocumentName);
        var stepDocumentNameOptions = {
            title: fs.DSB.STEP_CONSTANTS.DocumentName.Title,
            showToggleBtn: true,
            isEditMode: isEditMode,
            initialActiveStep: true,
            eventDataAttributeName: fs.DSB.EVENT_DATA_ATTRIBUTE_NAME,
            onChangeEventOnEventDataAttrItems: function(e, additionalEventData) {
                var isStepValidated = fs.DSB.validateStepDocumentName(false);
                if (isStepValidated) {
                    fs.DSB.setDocumentEditingState(e, additionalEventData);
                }
                return isStepValidated;
            },
            onStepClickAfter: function() {
                if (!isEditMode) {
                    fs.DSB.setDefaultValueForDocumentSourceType(
                        fs.DSB.DOCUMENT_TYPE.ExistingFormstackDocument
                    );
                }
            }
        };
        var stepDocumentSourceOptions = {
            title: fs.DSB.STEP_CONSTANTS.DocumentSource.Title,
            showToggleBtn: true,
            isEditMode: isEditMode,
            initialActiveStep: isEditMode,
            eventDataAttributeName: fs.DSB.EVENT_DATA_ATTRIBUTE_NAME,
            onChangeEventOnEventDataAttrItems: function() {
                return fs.DSB.validateStepDocumentSource(false);
            },
            onStepClickAfter: function() {
                if (!isEditMode) {
                    fs.DSB.setDefaultValueForDocumentSaveTo(
                        isEditMode ? documentDTOObj.UploadToSF : fs.DSB.ATTACHMENT_TYPE.Chatter
                    );
                }
            }
        };
        var stepSaveToDocumentOptions = {
            title: fs.DSB.STEP_CONSTANTS.SaveDocumentTo.Title,
            showToggleBtn: true,
            isEditMode: isEditMode,
            initialActiveStep: isEditMode,
            eventDataAttributeName: fs.DSB.EVENT_DATA_ATTRIBUTE_NAME,
            onChangeEventOnEventDataAttrItems: function() {
                return fs.DSB.validateStepSaveDocumentTo(false);
            }
        };
        var stepReadyAndSaveOptions = {
            title: fs.DSB.STEP_CONSTANTS.ReadyAndSave.Title,
            isLastStep: true,
            isEditMode: isEditMode,
            showStepBtnAlways: true,
            initialActiveStep: isEditMode,
            lastButtonText: fs.DSB.STEP_CONSTANTS.ReadyAndSave.Button.Initial,
            onStepClickAfter: function() {
                console.log('heading out to save the document setup');
                saveDocumentSetup(this);
            }
        };
        $(documentStepsRootElem).append(
            new fs.DS.Step(1, stepDocumentNameOptions)
                .build()
                .addNewComponentToStepDetail(divStepDocumentNameElement)
                .getRootComponent()
        );
        var divStepDocumentSourceElement = fs.DSB.getStepComponents(fs.DSB.STEPS.DocumentSource);
        $(documentStepsRootElem).append(
            new fs.DS.Step(2, stepDocumentSourceOptions)
                .build()
                .addNewComponentToStepDetail(divStepDocumentSourceElement)
                .getRootComponent()
        );
        var divStepSaveDocumentElement = fs.DSB.getStepComponents(fs.DSB.STEPS.SaveDocumentTo);
        $(documentStepsRootElem).append(
            new fs.DS.Step(3, stepSaveToDocumentOptions)
                .build()
                .addNewComponentToStepDetail(divStepSaveDocumentElement)
                .getRootComponent()
        );
        $(documentStepsRootElem).append(
            new fs.DS.Step(4, stepReadyAndSaveOptions).build().getRootComponent()
        );
        if (isEditMode) {
            fs.DSB.setDefaultValueForDocumentName(documentDTOObj.Name);
            fs.DSB.setDefaultValueForDocumentSourceType(
                fs.DSB.DOCUMENT_TYPE.ExistingFormstackDocument,
                documentDTOObj
            );
            fs.DSB.setDefaultValueForDocumentSaveTo(
                documentDTOObj.UploadToSF,
                documentDTOObj.AttachToObject
            );
        }
        // let's expand first step of document settings wizard
        var stepElement = fs.DSB.findStepRootElement(fs.DSB.STEPS.DocumentName);
        $(stepElement)
            .find('.stepCompact__toggleBtn')
            .click();
    };
    var switchToDocumentListView = function(shouldReload) {
        fs.Utils.setFSNSVariable(fs.DSB.DATA_VARIABLE.currentDocumentDTORecord, null);
        if (shouldReload) {
            var formId = fs.Utils.getFSNSVariable(fs.Utils.DATA_VARIABLE.currentFormRecordId, '');
            fs.D.fetchRelatedDocumentsByProvider(formId);
        } else {
            $('.fsContentBox')
                .find('.documentDetailView')
                .remove();
            if ($('.fsContentBox').find('.documentListView').length > 0) {
                $('.fsContentBox')
                    .find('.documentListView')
                    .fadeIn();
            } else {
                $('.fsContentBox')
                    .find('.fsNewBlock')
                    .fadeIn();
            }
        }
    };
    var switchToDocumentDetailView = function(documentRecordId) {
        // render documentDetail.html view
        if ($('.fsContentBox').find('.documentListView').length > 0) {
            // new Document list exist
            $('.fsContentBox')
                .find('.documentListView')
                .fadeOut(200, 'linear', function() {
                    $('.fsContentBox')
                        .find('.documentDetailView')
                        .remove();
                    $('.fsContentBox').append(DOCUMENT_HTML.documentDetail);
                    loadDocumentDetailView(documentRecordId);
                });
        } else {
            // new Document section exist
            $('.fsContentBox')
                .find('.fsNewBlock')
                .fadeOut(200, 'linear', function() {
                    $('.fsContentBox')
                        .find('.documentDetailView')
                        .remove();
                    $('.fsContentBox').append(DOCUMENT_HTML.documentDetail);
                    loadDocumentDetailView(documentRecordId);
                });
        }
    };
    var bindClickOnBackToDocumentListButton = function(dvNavElement) {
        $(dvNavElement)
            .find('.fsBtn--alink')
            .click(function() {
                var areChangesUnsaved = doesDocumentHaveUnsavedChanges();
                if (areChangesUnsaved) {
                    if (!confirm(fs.Utils.CONSTANTS.uiMessage.unsavedChanges)) {
                        return false;
                    } else {
                        clearDocumentUnsavedChanges(true);
                    }
                }
                fs.DSB.updateDocumentChangesNotificationUI(false);
                if ($(this).attr('data-refresh-list-view')) {
                    switchToDocumentListView(true);
                } else {
                    switchToDocumentListView(false);
                }
                return false;
            });
    };
    var bindClickOnNewDocumentButton = function(fsContentBoxElem) {
        $(fsContentBoxElem)
            .find('.fsBtn')
            .click(function() {
                switchToDocumentDetailView();
                return false;
            });
    };
    var bindClickEventsOnDocumentListView = function(documentTable) {
        var documentTableElem = $(documentTable)[0];
        var editALinkElement = documentTableElem.getElementsByClassName('fsColumn__text--edit');
        $(editALinkElement).click(function() {
            editDocument(this);
        });
        var duplicateALinkElement = documentTableElem.getElementsByClassName(
            'fsColumn__text--duplicate'
        );
        $(duplicateALinkElement).click(function() {
            duplicateDocument(this);
        });
        var deleteALinkElement = documentTableElem.getElementsByClassName('fsColumn__text--delete');
        $(deleteALinkElement).click(function() {
            deleteDocument(this);
        });
    };
    /**
     * get header elements for document detail view
     * @param {boolean} isEditMode
     */
    var getDocumentDetailViewElem = function(isEditMode) {
        var dvElement = document.createElement('div');
        dvElement.className = 'detailView detailView--document';
        var tempElement = document.createElement('div');
        tempElement.innerHTML = BUTTON_LIST_HTML.detailViewBack;
        var detailViewBackBtnElement = tempElement.children[0];
        var dvNavElement = document.createElement('div');
        dvNavElement.className = 'detailView__navLink';
        dvNavElement.appendChild(detailViewBackBtnElement);
        bindClickOnBackToDocumentListButton(dvNavElement);
        var titleElement = document.createElement('h2');
        titleElement.innerHTML = isEditMode ? 'Edit Document' : 'Create a Document';
        var dvTitleElement = document.createElement('div');
        dvTitleElement.className = 'detailView__title';
        dvTitleElement.appendChild(titleElement);
        var dvDescElement = document.createElement('div');
        dvDescElement.className = 'detailView__description';
        dvDescElement.innerHTML = 'Merge data from your submission into a designed template.';
        dvElement.appendChild(dvNavElement);
        dvElement.appendChild(dvTitleElement);
        dvElement.appendChild(dvDescElement);
        return dvElement;
    };
    /**
     * get individual column for document table view
     * @param {*} fsColumnDivForClone
     * @param {string} columnText
     * @param {boolean} isHeader
     */
    var getfsColumnElem = function(fsColumnDivForClone, columnText, isHeader) {
        var fsColumnDivElemCloned = fsColumnDivForClone.cloneNode(true);
        var fsColumnTitleDivElem = isHeader
            ? fsColumnDivElemCloned.getElementsByClassName('fsColumn__title')[0]
            : fsColumnDivElemCloned.getElementsByClassName('fsColumn__text')[0];
        fsColumnTitleDivElem.innerHTML = columnText;
        return fsColumnDivElemCloned;
    };
    /**
     * get header row element for document table view
     * @param {*} fsHeaderDivForClone initial header element to clone html from to create header row
     * @param {Array} headerColumns
     * @param {boolean} shouldIncludeActionColumn action column is a table cell contains edit/clone/delete action icons
     */
    var getfsHeaderRowElem = function(
        fsHeaderDivForClone,
        headerColumns,
        shouldIncludeActionColumn
    ) {
        var fsHeaderDivElemCloned = fsHeaderDivForClone.cloneNode(true);
        var fsHeaderDivElemNew = fsHeaderDivForClone.cloneNode(false);
        var headerColumnsFiltered = getFilteredValuesFromArray(
            headerColumns,
            DOCUMENTLIST_COLUMNS_ORDER_ARRAY
        );
        headerColumnsFiltered = moveColumnsToTopInArray(
            DOCUMENTLIST_COLUMNS_ORDER_ARRAY,
            headerColumnsFiltered
        );
        headerColumnsFiltered = replaceColumnNameWithDisplayName(
            headerColumnsFiltered,
            DOCUMENTLIST_COLUMNS_DISPLAYNAMES_MAP
        );
        var rowColumnIndex = 0;
        for (rowColumnIndex; rowColumnIndex < headerColumnsFiltered.length; rowColumnIndex++) {
            var fsColumnDivElem = fsHeaderDivElemCloned.getElementsByClassName('fsColumn')[0];
            var columnText = headerColumnsFiltered[rowColumnIndex];
            var newfsColumnElem = getfsColumnElem(
                fsColumnDivElem,
                headerColumnsFiltered[rowColumnIndex],
                true
            );
            if (DOCUMENTLIST_FIXED_MED_COLUMNS_ARRAY.indexOf(columnText) >= 0) {
                $(newfsColumnElem).addClass('fsColumn--fixedM');
            }
            fsHeaderDivElemNew.appendChild(newfsColumnElem);
        }
        if (shouldIncludeActionColumn) {
            var fsColumnTitleActionDivElem = fsHeaderDivElemCloned.getElementsByClassName(
                'fsColumn--action'
            )[0];
            fsHeaderDivElemNew.appendChild(fsColumnTitleActionDivElem);
        }
        return fsHeaderDivElemNew;
    };
    /**
     * get list of row elements for document table view
     * @param {*} fsRowDivForClone
     * @param {Array<DocumentUICompactDTO>} listDocumentUICompactDTO
     * @param {boolean} shouldIncludeActionColumn
     */
    var getfsTableRowElemList = function(
        fsRowDivForClone,
        listDocumentUICompactDTO,
        shouldIncludeActionColumn
    ) {
        var fsRowDivElemCloned = fsRowDivForClone.cloneNode(true);
        var rowList = [];
        var tRowIndex = 0;
        for (tRowIndex; tRowIndex < listDocumentUICompactDTO.length; tRowIndex++) {
            var documentUICompactDTOObj = listDocumentUICompactDTO[tRowIndex];
            var rowItemValueArr = getFilteredValuesFromObject(
                documentUICompactDTOObj,
                DOCUMENTLIST_COLUMNS_ORDER_ARRAY,
                DOCUMENTLIST_COLUMNS_ORDER_ARRAY
            );
            var fsRowDivElemNew = fsRowDivForClone.cloneNode(false);
            var rowColumnIndex = 0;
            fsRowDivElemNew.setAttribute(
                'data-document-recordid',
                documentUICompactDTOObj['RecordId']
            );
            for (rowColumnIndex; rowColumnIndex < rowItemValueArr.length; rowColumnIndex++) {
                var fsColumnDivElem = fsRowDivElemCloned.getElementsByClassName('fsColumn')[0];
                fsRowDivElemNew.appendChild(
                    getfsColumnElem(fsColumnDivElem, rowItemValueArr[rowColumnIndex], false)
                );
            }
            if (shouldIncludeActionColumn) {
                var fsColumnTitleActionDivElem = fsRowDivElemCloned
                    .getElementsByClassName('fsColumn--action')[0]
                    .cloneNode(true);
                fsRowDivElemNew.appendChild(fsColumnTitleActionDivElem);
            }
            rowList.push(fsRowDivElemNew);
        }
        return rowList;
    };
    var generateTableFromDTO = function(listDocumentUICompactDTO, shouldIncludeActionColumn) {
        var columnHeaders = [];
        var firstRecord = listDocumentUICompactDTO[0];
        columnHeaders = Object.keys(firstRecord);
        var documentListHTML = fs.D.DOCUMENT_HTML.documentList;
        var documentListHTMLCloned = $($('<div/>').html(documentListHTML))[0].cloneNode(true);
        var fsTableDivElemNew = documentListHTMLCloned.getElementsByClassName('fsTable')[0]; //.cloneNode(true);
        var fsVerticalBarDivElem = documentListHTMLCloned.getElementsByClassName(
            'fsVerticalBar'
        )[0];
        var fsNewBlockButtonDivElem = documentListHTMLCloned.getElementsByClassName(
            'fsNewBlock__button'
        )[0];
        var fsTableRowHeaderDivHTMLCloned = documentListHTMLCloned
            .getElementsByClassName('fsTable__row--header')[0]
            .cloneNode(true);
        var fsTableRowDivHTMLCloned = documentListHTMLCloned
            .getElementsByClassName('fsTable__row')[1]
            .cloneNode(true); // we are getting second row HTML which has actual action button HTML

        fsTableDivElemNew.innerHTML = '';

        fsTableDivElemNew.appendChild(
            getfsHeaderRowElem(
                fsTableRowHeaderDivHTMLCloned,
                columnHeaders,
                shouldIncludeActionColumn
            )
        );
        var tableRowList = getfsTableRowElemList(
            fsTableRowDivHTMLCloned,
            listDocumentUICompactDTO,
            true
        );
        for (var tRowIndex = 0; tRowIndex < tableRowList.length; tRowIndex++) {
            fsTableDivElemNew.appendChild(tableRowList[tRowIndex]);
        }

        return (
            fsTableDivElemNew.outerHTML +
            fsVerticalBarDivElem.outerHTML +
            fsNewBlockButtonDivElem.outerHTML
        );
    };

    var renderDocumentTabView = function(documentsResponseDTO, tableElem) {
        refreshAvailableFieldList();
        if (tableElem == 'undefined' || tableElem == null) {
            tableElem = $('.fsContentBox');
        }
        if (documentsResponseDTO == null) {
            window.showPillMessage_Error(fs.Utils.CONSTANTS.uiMessage.somethingWentWrong, true);
        } else {
            if (documentsResponseDTO.IsValid && documentsResponseDTO.Result.length > 0) {
                // render documentList.html view
                var documentListHTML = fs.D.DOCUMENT_HTML.documentList;
                var documentListViewTitleDiv = $('<div/>', { class: 'documentListView__title' });
                documentListViewTitleDiv.html(DOCUMENTLIST_TITLE_TEXT);
                var documentListViewTableDiv = $('<div/>', { class: 'documentListView__table' });
                documentListViewTableDiv.html(documentListHTML);
                var documentListViewDiv = $('<div/>', { class: 'documentListView' });
                documentListViewDiv.html(documentListViewTitleDiv);
                documentListViewDiv.append(generateTableFromDTO(documentsResponseDTO.Result, true));
                tableElem.html(documentListViewDiv);
                bindClickOnNewDocumentButton(tableElem);
                bindClickEventsOnDocumentListView(tableElem);
            } else {
                // render newDocumentIfNoRecordFound.html view
                tableElem.html(fs.D.DOCUMENT_HTML.newDocumentIfNoRecordFound);
                // bind click event for New Document button
                bindClickOnNewDocumentButton(tableElem);
            }
        }
    };
    var handleRemoteErrorEvent = function(errorEventObj) {
        console.log('[handleRemoteError] error below:');
        console.log(errorEventObj);
        if (errorEventObj != null && errorEventObj.type === 'exception') {
            // Display UI Error: with custom error message from back end
            window.showPillMessage_Error(errorEventObj.message, true);
        } else {
            // Display UI Error: with generic error message
            window.showPillMessage_Error(fs.Utils.CONSTANTS.uiMessage.somethingWentWrong, true);
        }
    };
    var handleRemoteActionGetDocumentById = function(
        documentResponseDTOObj,
        event,
        additionalParams
    ) {
        if (event.status) {
            console.log('[handleRemoteActionGetDocumentById] documentResponseDTOObj below:');
            console.log(documentResponseDTOObj);
            loadDocumentViewWithSteps(true, documentResponseDTOObj.Result);
        } else {
            throw event;
        }
    };
    var handleRemoteActionGetRelatedDocumentsByProvider = function(
        result,
        event,
        additionalParams
    ) {
        if (event.status) {
            renderDocumentTabView(result, additionalParams);
        } else {
            throw event;
        }
    };
    var handleRemoteActionCreateOrUpdateDocument = function(result, event, isUpdate) {
        if (event.status) {
            if (result != null) {
                // staying on the same page
                // change step save button text to saved for 2 seconds and then disable it
                // update back to document list with an attribute so that we refresh the document list on click
                var stepElement = fs.DSB.findStepRootElement(fs.DSB.STEPS.ReadyAndSave);
                var stepCompactBtnElement = $(stepElement).find('.stepCompact__Btn');
                $(stepCompactBtnElement).text(fs.DSB.STEP_CONSTANTS.ReadyAndSave.Button.Processed);
                $(stepElement)
                    .parent()
                    .find('.detailView__navLink>button')
                    .attr('data-refresh-list-view', true);
                setTimeout(function() {
                    $(stepCompactBtnElement).text(
                        fs.DSB.STEP_CONSTANTS.ReadyAndSave.Button.Initial
                    );
                }, 2000);
                if (!isUpdate) {
                    var documentRecordId = result.Response;
                    var currentDocumentDtoObj = fs.Utils.getFSNSVariable(
                        fs.DSB.DATA_VARIABLE.currentDocumentDTORecord,
                        null
                    );
                    if (
                        currentDocumentDtoObj != null &&
                        !fs.Utils.isNullOrEmpty(documentRecordId)
                    ) {
                        currentDocumentDtoObj.RecordId = documentRecordId;
                        fs.Utils.setFSNSVariable(
                            fs.DSB.DATA_VARIABLE.currentDocumentDTORecord,
                            currentDocumentDtoObj
                        );
                    }
                }
                updateFormDraftPublishState();
                clearDocumentUnsavedChanges(false);
            } else {
                throw event;
            }
        } else {
            throw event;
        }
    };
    var remoteGetRelatedDocumentsByProvider = function(
        urlToRemoteFunction,
        formId,
        providerTypesArr,
        additionalParams
    ) {
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            formId,
            providerTypesArr,
            function(result, event) {
                try {
                    handleRemoteActionGetRelatedDocumentsByProvider(
                        result,
                        event,
                        additionalParams
                    );
                } catch (error) {
                    handleRemoteErrorEvent(error);
                }
            },
            {
                escape: true
            }
        );
    };
    var remoteCheckIfObjectsAreInUseByRelatedDocuments = function(
        urlToRemoteFunction,
        formId,
        attachToObjectList,
        callbackFunction,
        callbackObject
    ) {
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            formId,
            attachToObjectList,
            function(result, event) {
                try {
                    if (typeof callbackFunction === 'function') {
                        callbackFunction(callbackObject, result.Response);
                    }
                } catch (error) {
                    handleRemoteErrorEvent(error);
                }
            },
            {
                escape: true
            }
        );
    };
    var remoteCreateDocument = function(urlToRemoteFunction, documentDTOObj) {
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            documentDTOObj,
            function(result, event) {
                try {
                    handleRemoteActionCreateOrUpdateDocument(result, event, false);
                } catch (error) {
                    handleRemoteErrorEvent(error);
                }
            },
            {
                escape: true
            }
        );
    };
    var remoteUpdateDocument = function(urlToRemoteFunction, documentDTOObj) {
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            documentDTOObj,
            function(result, event) {
                try {
                    handleRemoteActionCreateOrUpdateDocument(result, event, true);
                } catch (error) {
                    handleRemoteErrorEvent(error);
                }
            },
            {
                escape: true
            }
        );
    };
    var remoteGetDocumentById = function(urlToRemoteFunction, documentRecordId, additionalParams) {
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            documentRecordId,
            function(result, event) {
                try {
                    handleRemoteActionGetDocumentById(result, event, additionalParams);
                } catch (error) {
                    handleRemoteErrorEvent(error);
                }
            },
            {
                escape: true
            }
        );
    };
    /**
     * Fetch list of documents related to current form (DocumentsResponseDTO)
     * @param {string} formId record id of Template object
     * @param {Array<string>} providerTypesArr- for now it would be Empty (SimplePDF) and/or FormstackDocuments only
     * @param {Function} callbackFunction
     * @param {*} callbackObject
     */
    var fetchDocumentById = function(documentRecordId, callbackFunction, callbackObject) {
        var localCallbackFunction =
            typeof callbackFunction === 'function' ? callbackFunction : remoteGetDocumentById;
        var urlGetDocumentById = window.REMOTE_ACTIONS['DocumentController']['getDocumentById'];
        localCallbackFunction(urlGetDocumentById, documentRecordId, callbackObject);
    };
    /**
     * Fetch list of documents related to current form (DocumentsResponseDTO)
     * @param {string} formId record id of Template object
     * @param {Array<string>} providerTypesArr- for now it would be Empty (SimplePDF) and/or FormstackDocuments only
     * @param {Function} callbackFunction
     * @param {*} callbackObject
     */
    var fetchRelatedDocumentsByProvider = function(
        formId,
        providerTypesArr,
        callbackFunction,
        callbackObject
    ) {
        if (providerTypesArr == undefined) {
            providerTypesArr = documentsProviderTypesArr;
        }
        if (!fs.Utils.isNullOrEmpty(formId)) {
            var localCallbackFunction =
                typeof callbackFunction === 'function'
                    ? callbackFunction
                    : remoteGetRelatedDocumentsByProvider;
            var urlGetRelatedDocumentsByProvider =
                window.REMOTE_ACTIONS['DocumentController']['getRelatedDocumentsByProvider'];
            localCallbackFunction(
                urlGetRelatedDocumentsByProvider,
                formId,
                providerTypesArr,
                callbackObject
            );
        }
    };
    /**
     *
     * @param {documentDTO} documentDTOObj
     * @param {*} callbackFunction
     */
    var updateDocument = function(documentDTOObj, callbackFunction) {
        var localCallbackFunction =
            typeof callbackFunction === 'function' ? callbackFunction : remoteUpdateDocument;
        var urlUpdateDocument = window.REMOTE_ACTIONS['DocumentController']['updateDocument'];
        localCallbackFunction(urlUpdateDocument, documentDTOObj);
    };
    /**
     *
     * @param {documentDTO} documentDTOObj
     * @param {*} callbackFunction
     */
    var createDocument = function(documentDTOObj, callbackFunction) {
        var localCallbackFunction =
            typeof callbackFunction === 'function' ? callbackFunction : remoteCreateDocument;
        var urlCreateDocument = window.REMOTE_ACTIONS['DocumentController']['createDocument'];
        localCallbackFunction(urlCreateDocument, documentDTOObj);
    };
    /**
     *
     * @param {string} formId
     * @param {Array<string>} attachToObjectList
     * @param {Function} callbackFunction
     * @param {*} callbackObject
     */
    var checkIfObjectsAreInUseByRelatedDocuments = function(
        formId,
        attachToObjectList,
        callbackFunction,
        callbackObject
    ) {
        var urlCheckIfObjectsAreInUseByRelatedDocuments =
            window.REMOTE_ACTIONS['DocumentController']['checkIfObjectsAreInUseByRelatedDocuments'];
        remoteCheckIfObjectsAreInUseByRelatedDocuments(
            urlCheckIfObjectsAreInUseByRelatedDocuments,
            formId,
            attachToObjectList,
            callbackFunction,
            callbackObject
        );
    };
    var isConfiguredObjectUsedInDocuments = function(
        objectIdentifier,
        callbackFunction,
        callbackObject
    ) {
        console.log('FORM_DEV [isConfiguredObjectUsedInDocuments]', objectIdentifier);
        if (!fs.Utils.isNullOrEmpty(objectIdentifier)) {
            var attachToObjectList = [];
            // we are sending as string array
            attachToObjectList.push('' + objectIdentifier);
            var formId = fs.Utils.getFSNSVariable(fs.Utils.DATA_VARIABLE.currentFormRecordId, '');
            checkIfObjectsAreInUseByRelatedDocuments(
                formId,
                attachToObjectList,
                callbackFunction,
                callbackObject
            );
        } else {
            if (typeof callbackFunction === 'function') {
                callbackFunction(callbackObject);
            } else {
                console.log('[isConfiguredObjectUsedInDocuments] No callback found');
            }
        }
    };
    var handleRemoteActionRefreshAvailableFieldList = function(result, event, callbackObject) {
        if (event.status) {
            if (result != null) {
                var vListFields = [];
                for (var vFieldIndex in result) {
                    var vField = result[vFieldIndex];
                    if (vField.FFValue != null) {
                        if (!fs.Utils.isNullOrEmpty(vField.FFTitle)) {
                            vField.FFText = vField.FFValue + ' (' + vField.FFText + ')';
                        }
                        vListFields.push(vField);
                    }
                }
                var selectHTML = fs.Utils.generateFormFieldsSelectHtml(vListFields, null);
                fs.Utils.setFSNSVariable(
                    fs.DSB.DATA_VARIABLE.availableFormFieldListSelectHTML,
                    selectHTML
                );
            } else {
                console.log('[FORM] [handleRemoteActionRefreshAvailableFieldList]:' + result);
                // Display UI Error: with custom error message
            }
        } else {
            // Display UI Error: with generic error message
            throw event;
        }
    };
    var remoteRefreshAvailableFieldList = function(urlToRemoteFunction, callbackObject) {
        var formId = fs.Utils.getFSNSVariable(fs.Utils.DATA_VARIABLE.currentFormRecordId, '');
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            formId,
            function(result, event) {
                try {
                    handleRemoteActionRefreshAvailableFieldList(result, event, callbackObject);
                } catch (error) {
                    handleRemoteErrorEvent(error);
                }
            },
            {
                escape: true
            }
        );
    };
    var refreshAvailableFieldList = function(callbackFunction, callbackObject) {
        var localCallbackFunction =
            typeof callbackFunction === 'function'
                ? callbackFunction
                : remoteRefreshAvailableFieldList;
        var urlRefreshAvailableFieldList =
            window.REMOTE_ACTIONS.FormEditorController.remoteAvailableFormFieldsSorted;
        localCallbackFunction(urlRefreshAvailableFieldList, callbackObject);
    };
    var _unitTesting = {
        handleRemoteActionGetRelatedDocumentsByProvider: handleRemoteActionGetRelatedDocumentsByProvider,
        handleRemoteActionRefreshAvailableFieldList: handleRemoteActionRefreshAvailableFieldList,
        handleRemoteActionCreateOrUpdateDocument: handleRemoteActionCreateOrUpdateDocument
    };
    var _Document = {
        DOCUMENT_HTML: DOCUMENT_HTML,
        documentsProviderTypesArr: documentsProviderTypesArr,
        fetchRelatedDocumentsByProvider: fetchRelatedDocumentsByProvider,
        createDocument: createDocument,
        renderDocumentTabView: renderDocumentTabView,
        doesDocumentHaveUnsavedChanges: doesDocumentHaveUnsavedChanges,
        clearDocumentUnsavedChanges: clearDocumentUnsavedChanges,
        isConfiguredObjectUsedInDocuments: isConfiguredObjectUsedInDocuments,
        __testing__: _unitTesting
    };
    return {
        Document: _Document,
        D: _Document
    };
});
