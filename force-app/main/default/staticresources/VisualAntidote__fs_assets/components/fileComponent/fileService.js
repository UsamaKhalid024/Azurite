/* @summary This library is for the new File Service logic
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
        root.FileService = libObject.FileService;
        root.FS = libObject.FS;
    }
}(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function (fs, window) {
    'use strict';
    var $ = fs;
    var fsQ = fs.Query;

    // Messages
    window.ffErr_FileUploadLimitReached = 'File limit reached.';
    window.ffErr_GeneralFileErrorMessage = 'Something went wrong. Please contact support if the issue persists.';
    window.ffErr_FileUploadExtensionRequired = 'File with an extension is required.';

    var isFileServiceOn = function (fileArea) {
        return $(fileArea).attr("data-fileserviceon") === "true" &&
            ($("#hfIsFileServiceOn").val() == "1" || $("#hfIsFileServiceOn").val() == "true");
    }

    var isNativeOptionSelected = function (fileArea) {
        return fileArea[0].dataset.isnativeoptionselected == 'true';
    }

    var getFileServiceEndpoint = function () {
        return $("#hfFileServiceEndpoint").val();
    }

    var getFileServiceApiKey = function () {
        return $("#hfFileServiceApiKey").val();
    }

    var loadFileUploadField = function (fileUploadArea, fileUploadInputElement) {

        var endpointURL = getFileServiceEndpoint() + '/api/File';

        $(fileUploadInputElement).fileupload({
            url: endpointURL,
            type: "POST",
            // Enable drag and drop on file upload area
            dropZone: fileUploadArea,
            // Identify which file upload it should look
            fileInput: fileUploadInputElement,
            autoUpload: true,
            // This is needed for drag and drop, on second time we need to send these info, so we now send all the time.
            formData: function () {
                // Sending Required Fields for File Upload Endpoint.
                // Added here because we need to get a SessionID everytime we upload, in case that we have submitted and got a new session id.
                // We are not using the normal post, because on drag and drop on second time, it doesn't get all the fields.
                var listFieldAndValue = [];
                addNameAndValueInArray(listFieldAndValue, "txtOrgId", $("#txtOrgId").val());
                addNameAndValueInArray(listFieldAndValue, "txtSessionID", $("#txtSessionID").val());
                return listFieldAndValue;
            },
            beforeSend: function (e, options) {
                window.formLogger("[loadFileUploadField][beforeSend] Starts...");
                e.setRequestHeader("ApiKey", getFileServiceApiKey());
            },
            dataType: 'json',
            xhr: function () {
                var pXHR = null;
                if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
                    //To process ajax post in Salesforce pages in IE 11 
                    console.log('[loadFileUploadField][IE11-SF][xhr]');

                    if (Sarissa && Sarissa.originalXMLHttpRequest) {
                        pXHR = new Sarissa.originalXMLHttpRequest();
                    } else if (window.XMLHttpRequest) {
                        pXHR = new XMLHttpRequest();
                    }
                } else {
                    pXHR = $.ajaxSettings.xhr();
                }
                return pXHR;
            },
            add: function (e, data) {
                window.formLogger("[loadFileUploadField][Add]");
                if (e.target.disabled) {
                    window.formLogger('[loadFileUploadField][Abort]');
                    return;
                }
              
                if (isFileValid(data, fileUploadArea)) {
                    var jqXHRData = data;
                    jqXHRData.submit();
                } else {
                    // If not Valid, we will not submit the file.
                    return;
                }
            },
            done: function (event, data) {
                window.formLogger("[loadFileUploadField][Done]");
                fileServiceReturn(event, data.result);
            },
            fail: function (event, data) {
                window.formLogger("[loadFileUploadField][fail]");
                var response = data.jqXHR.responseText;
                console.error(response);
                window.ShowValidationMessage(fileUploadArea, "GENERAL", window.ffErr_GeneralFileErrorMessage);
            }
        });
    }

    var removeAllFileValidationMessages = function (fileUploadArea) {
        var fileRow = $(fileUploadArea).parent();
        // Removing all Validation Message that shows in the row.
        // This is for Required Message and General Messages and Validation Messages.
        fileRow.find('.ff-invalid-msg').remove();

        // Removing the border if there is a border.
        $(fileUploadArea).removeClass('ff-input-type-invalid');
    }

    var isFileValid = function (data, fileUploadArea) {
        removeAllFileValidationMessages(fileUploadArea);
            
        // Validating File Limit(Amount of Files that we can upload).
        if (hasFileLimitExceed(fileUploadArea)) {
            showMessageInsideFileUploadArea(fileUploadArea);
            return false;
        }

        // Validating File Extension Type
        if (isFileExtensionInvalid(data, fileUploadArea)) {
            return false;
        }

        // Validating File Size
        if (isFileSizeInvalid(data, fileUploadArea)) {
            return false;
        }

        return true;
    }

    var isFileExtensionInvalid = function (data, fileUploadArea) {
        var isFileExtensionInvalid = false;
        var fileExtension = '';
        var fileName = data.originalFiles[0]['name'];
        if (fileName.indexOf('.') > -1) {
            fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        }

        if (fileExtension == '') {
            window.ShowValidationMessage(fileUploadArea, "FILEREQUIREDEXTENSION");
            isFileExtensionInvalid = true;
            return isFileExtensionInvalid;
        }

        var allowedFileTypes = $(fileUploadArea).data('allowedfiletypes').toLowerCase();
        if (allowedFileTypes != "" && allowedFileTypes != null && $.inArray(fileExtension, allowedFileTypes.split(',')) == -1) {
            window.ShowValidationMessage(fileUploadArea, "FILETYPE", allowedFileTypes);
            isFileExtensionInvalid = true;
        }

        return isFileExtensionInvalid;
    }

    var isFileSizeInvalid = function (data, fileUploadArea) {
        var isFileSizeInvalid = false;
        var fileSize = data.originalFiles[0]['size'];
        var sizeLimitPermittedInMB = getFileSizeLimitFromFileUploadArea(fileUploadArea);
        var sizeLimitPermittedInBytes = sizeLimitPermittedInMB * 1000000;
        if (fileSize > sizeLimitPermittedInBytes) {
            window.ShowValidationMessage(fileUploadArea, "FILESIZECUSTOM", sizeLimitPermittedInMB);
            isFileSizeInvalid = true;
        }

        return isFileSizeInvalid;
    }

    var showMessageInsideFileUploadArea = function (fileUploadArea) {
        var divErrorContainer = $('<div />', { 'class': 'temporary-file-error-message' });
        divErrorContainer.append(window.ffErr_FileUploadLimitReached);
        $(fileUploadArea).append(divErrorContainer);

        var fadeTimeInMilliseconds = 3000;// 3 Seconds
        $(divErrorContainer).fadeOut(fadeTimeInMilliseconds, function () {
            fs(this).remove();
        });
    }

    var getFileSizeLimitFromFileUploadArea = function (fileUploadArea) {
        var maxFileSizeDefault = 5;//in MB
        var fieldMaxFileSize = getAttribute(fileUploadArea, "maxfilesize", maxFileSizeDefault);
        return fieldMaxFileSize;
    }

    var getAttribute = function (pHtmlElement, pAttributeName, pDefaultValue) {
        if ($(pHtmlElement) != null && $(pHtmlElement).attr("data-" + pAttributeName) !== undefined) {
            return $(pHtmlElement).attr("data-" + pAttributeName);
        } else {
            return pDefaultValue;
        }
    }

    var addNameAndValueInArray = function (pListFieldAndValue, pFieldName, pFieldValue) {
        pListFieldAndValue.push({
            name: pFieldName,
            value: pFieldValue
        });

        return pListFieldAndValue;
    }

    var getFileInfo = function (fileKey, fileFieldName) {
        $.ajax({
            type: "GET",
            crossDomain: true,
            async: true,
            url: getFileServiceEndpoint() + '/api/file/' + fileKey,
            headers: {
                "ApiKey": getFileServiceApiKey(),
            },
            retryLimit: 3,
            success: function (responseText) {
                console.log("[FORM] [getFileInfo][ajax] Success Returned");
                console.log(responseText);
                loadFileInfo(responseText, fileFieldName);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("[FORM] [getFileInfo][ajax] Error Returned");
                console.log(xhr.responseJSON);
            }
        });
    }

    var deleteFile = function (fileKey) {
        $.ajax({
            type: "DELETE",
            crossDomain: true,
            async: true,
            url: getFileServiceEndpoint() + '/api/file/' + fileKey,
            headers: {
                "ApiKey": getFileServiceApiKey(),
            },
            retryLimit: 3,
            success: function (responseText) {
                console.log("[FORM] [deleteFile][ajax] Success Returned");
                console.log(responseText);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("[FORM] [deleteFile][ajax] Error Returned");
                console.log(xhr.responseJSON);
            }
        });
    }

    var createFileNameLabel = function (fileId, fileName, fileKey) {
        var fileNameLabel = $('<label />', {
            'id': fileId + '_Label',
            'style': 'font-weight:bold'
        });
        fileNameLabel.append(fileName);

        var removeIconImage = $('<div />', {
            'title': 'Remove',
            'border': '0',
            'class': 'fileServiceRemoveBtn'
        });

        var removeButttonAnchor = $('<a />', {
            'title': 'Remove',
            'id': fileId + '_Remove',
            'data-fs-filekey': fileKey,
            'style': 'padding-right: 5px;'
        });

        removeButttonAnchor.click(function (event) {
            event.preventDefault();
            removeFileOnClick(this);
            return false;
        });

        removeButttonAnchor.append(removeIconImage);

        var hiddenFileUploadKey = $('<input />', {
            'type': 'hidden',
            'id': 'fs_fileId_' + fileId,
            'name': 'fs_fileId_' + fileId,
            'value': fileKey
        });

        var divFileUploadLabel = $('<div />', {
            'id': fileId,
            'name': 'FileUploadLabel'
        });

        divFileUploadLabel.append(hiddenFileUploadKey);
        divFileUploadLabel.append(removeButttonAnchor);
        divFileUploadLabel.append(fileNameLabel);

        return divFileUploadLabel;
    }

    var removeFileOnClick = function (removeAnchorElement) {

        var fileKey = $(removeAnchorElement).attr('data-fs-filekey');
        deleteFile(fileKey);

        var fileRemoveLabel = $(removeAnchorElement).parent();
        var fileUploadArea = fileRemoveLabel.parent();
        fileRemoveLabel.remove();
        checkFileUploadLimits(fileUploadArea);
    }

    var addFileUploadLabel = function (fileUploadInputId, newFileData) {

        var fileArea = $('#' + fileUploadInputId).closest(".ff-fileupload-drop-area");
        var fileId = fileUploadInputId + '_' + getRandomInt(1000);
        var fileName = newFileData.fileName;
        var fileKey = newFileData.fileKey;

        var newFileLabel = createFileNameLabel(fileId, fileName, fileKey);

        fileArea.append(newFileLabel);
        checkFileUploadLimits(fileArea);
    }

    var getRandomInt = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    var loadFileInfo = function (fileInformation, fileFieldName) {
        // E.g.: fileFieldName = fs_fileId_FileUpload532_935
        // fileUploadInputId = FileUpload532
        var fileUploadInputId = fileFieldName.split('_')[2];
        var newFileData = {
            fileKey: fileInformation.FileKey,
            fileName: fileInformation.Name
        };

        addFileUploadLabel(fileUploadInputId, newFileData);
    }

    var fileServiceReturn = function (event, result) {
        window.formLogger('[fileServiceReturn] Starts...');

        var newFileData = {
            fileKey: result.FileKey,
            fileName: result.Name
        }

        var fileUploadInputId = $(event.target).attr('id');

        addFileUploadLabel(fileUploadInputId, newFileData);
        
    }

    var loadFileUploadedFieldOnPageLoad = function (listFileUploaded) {
        listFileUploaded.forEach(function (fileUploaded) {
            getFileInfo(fileUploaded.FileKey, fileUploaded.FileFieldName);
        });
    }

    var checkFileUploadLimits = function (area) {
        var maxUploads = $(area).data('maxfiles');
        var currentNumUploads = $(area).find("[id$='_Label']").length;
        if (currentNumUploads >= maxUploads) {
            $(area).find("[id$='_Select']").hide();
        } else {
            $(area).find("[id$='_Select']").show();
        }
    }

    var hasFileLimitExceed = function (fileUploadArea) {
        var isAddFileButtonInvisible = $(fileUploadArea).find("[id$='_Select']").css('display') == 'none';
        if (isAddFileButtonInvisible) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @todo functions marked as private means they were never made available as public methods (e.g. window.FunctionName)
     * even though with this library they might be accessible as fs.EH.FunctionName but we will make it private down the road when our libraries are more modular.
     */
    var _FileService = {
        'getFileServiceEndpoint': getFileServiceEndpoint,
        'getFileServiceApiKey': getFileServiceApiKey,
        'getFileInfo': getFileInfo,
        'addNameAndValueInArray': addNameAndValueInArray,
        'loadFileUploadField': loadFileUploadField,
        'isFileServiceOn': isFileServiceOn,
        'isNativeOptionSelected': isNativeOptionSelected,
        'loadFileUploadedFieldOnPageLoad': loadFileUploadedFieldOnPageLoad,
        'checkFileUploadLimits': checkFileUploadLimits
    };

    return {
        'FileService': _FileService,
        'FS': _FileService
    };
}));