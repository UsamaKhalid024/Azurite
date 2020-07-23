/**
 * @summary File Settings Builder is a component that contains all the methods that the Files uses to show in the Field Settings.
 *
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
        root.FileSettingBuilder = libObject.FileSettingBuilder;
        root.FSB = libObject.FSB;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var $ = fs;

    var enumProviderType = {
        Salesforce: 'Salesforce',
        SalesforceNativeCloud: 'SalesforceNativeCloud',
        Stash: 'Stash',
        Azure: 'Azure',
        AWSS3: 'AWSS3',
        Dropbox: 'Dropbox'
    };
    Object.freeze(enumProviderType);

    var hideFileSettingsSubSection = function() {
        $('#trForFileUploadFileSettingsSubSection').hide();
    };

    var showFileSettingsSubSection = function() {
        $('#trForFileUploadFileSettingsSubSection').show();
    };

    var isNativeForm = function() {
        return window.isFormNative;
    };

    var isAllowIntegrationsInNativeCloudOn = function() {
        return window.isIntegrationsAllowed == true;
    };

    var loadDropdownIntegration = function(pFieldSettingSection) {
        fs.FieldSettingBuilder.setFieldSettingSection(pFieldSettingSection);
        ddlIntegrationLoadElement();
        sfFileRadioSectionStart();
    };

    var ddlIntegrationLoadElement = function() {
        ddlIntegrationAddAllOptions();
        ddlIntegrationGetElement().select2();
        ddlIntegrationAddOnChangeEvent();
    };

    var ddlIntegrationAddOnChangeEvent = function() {
        ddlIntegrationGetElement().on('change', function() {
            var getPlatformConnection = true;
            ddlIntegrationOnChangeEvent(this, getPlatformConnection);
        });
    };

    var ddlIntegrationRemoveOnChangeEvent = function() {
        ddlIntegrationGetElement().off('change');
    };

    var ddlIntegrationGetElement = function() {
        return fs.FieldSettingBuilder.getFieldSettingSection().find('#ddlIntegrations');
    };

    var ddlIntegrationGetSelectedValue = function() {
        return ddlIntegrationGetElement().val();
    };

    var ddlIntegrationsGetSelectedGuiLabel = function() {
        var selectElement = ddlIntegrationGetElement()[0];
        return selectElement.children[selectElement.selectedIndex].innerText;
    };

    var ddlIntegrationSetSelectedValue = function(pValue) {
        ddlIntegrationGetElement()
            .val(pValue)
            .select2();
        ddlIntegrationGetElement().change();
    };

    var ddlIntegrationAddAllOptions = function() {
        var ddlIntegration = ddlIntegrationGetElement();

        // Clean all the options
        ddlIntegration.find('option').remove();

        // Adding the new options for Native
        if (isNativeForm()) {
            var optionSFNative = getNewOption(
                enumProviderType.SalesforceNativeCloud,
                'Salesforce (Native)'
            );
            ddlIntegration.append(optionSFNative);

            var optionSF = getNewOption(
                enumProviderType.Salesforce,
                'Salesforce (Non-Native)'
            );
            ddlIntegration.append(optionSF);
        } else {
            var optionSFClassic = getNewOption(
                enumProviderType.Salesforce,
                'Salesforce'
            );
            ddlIntegration.append(optionSFClassic);
        }

        ddlIntegration.append(
            getNewOption(enumProviderType.Azure, 'Azure Blob'),
            getNewOption(enumProviderType.AWSS3, 'AWS S3'),
            getNewOption(enumProviderType.Dropbox, 'Dropbox'),
            getNewOption(enumProviderType.Stash, 'Stash')
        );
    };

    var getNewOption = function(pValue, pText) {
        var optionValue = $('<option />');
        optionValue.attr('value', pValue);
        optionValue.append(pText);
        return optionValue;
    };

    var autoSaveForFileUpload = function() {
        var fileUploadFieldSection = fs.FieldSettingBuilder.getFieldSettingSubSection();
        window.updateFieldConfigByElem(fileUploadFieldSection);
    };

    var ddlIntegrationOnChangeEvent = function(pSelectElement, pGetPlatformConnection) {
        console.log('[ddlIntegrationOnChangeEvent] Starts...');
        var dropdownSelectedValue = $(pSelectElement).val();

        if (
            isNativeForm() &&
            isAllowIntegrationsInNativeCloudOn() == false &&
            dropdownSelectedValue != enumProviderType.SalesforceNativeCloud
        ) {
            // If FMA for Native is Off, we should not allow them to choose any other Integration that is not native.
            fs.FieldSettingBuilder.hideAllFieldsFromFieldSettingSubSection();
            addNonNativeFeatureMessageWithNoAccessInSubSection();
            return;
        } else {
            fs.FieldSettingBuilder.showAllFieldsFromFieldSettingSubSection();
        }

        if (
            dropdownSelectedValue == enumProviderType.Salesforce ||
            dropdownSelectedValue == enumProviderType.SalesforceNativeCloud
        ) {
            showFileUploadToSalesforceOptions();
            ddlAttachToObjectShow();
            removeDestinationFolderFromFieldSettingsSubSection();
            removePlatformConnectionComponentElement();
            removeAllFieldIntegrationByFormFieldId();
            removeOverwriteFileFromFieldSettingsSubSection();
            // Set Default if we change to Salesforce
            setSelectedValueInSfFileRadioSection('sffiles');
            sfFileRadioSectionChangeLabelName(dropdownSelectedValue);

            if (isNativeForm()) {
                sfFileRadioLegacyChatterApiHide();
            } else {
                sfFileRadioLegacyChatterApiShow();
            }

            if (dropdownSelectedValue == enumProviderType.Salesforce) {
                addNonNativeFeatureMessageInSubSection();
            } else {
                addNativeFeatureMessageInSubSection();
                // Native is always 2.5 MB
                fileUploadSizeHideField();
            }

            autoSaveForFileUpload();
        } else {
            // Others Integration
            setSelectedValueInSfFileRadioSection('');
            hideFieldsThatAreNotUsedInIntegration();

            if (existOverwriteFileFieldInFieldSettingsSubSection() == false) {
                addOverwriteFileFieldInFieldSettingsSubSection();
            }

            // On Field Load we don't need to call the Integration Change, because we have the Integration Values already.
            if (pGetPlatformConnection) {
                loadIntegrationBoxOnIntegrationChange(dropdownSelectedValue);
            } else {
                addNonNativeFeatureMessageInSubSection();
            }
        }
    };

    var getCustomFileNameValue = function() {
        return fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#ffFileName')
            .val();
    };

    var setCustomFileNameValue = function(pValue) {
        fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#ffFileName')
            .val(pValue);
    };

    var getSelectedValueInSfFileRadioSection = function() {
        var sfRadioSection = fs.FieldSettingBuilder.getFieldSettingSubSection().find(
            '.salesforce-file-radio'
        );
        var selectedRadio = sfRadioSection.find('li.active');
        var selectedRadioIdentifier = selectedRadio.find('a').attr('href');

        if (selectedRadioIdentifier == '#radio-files-sffiles') {
            var sfChatterChecked = selectedRadio.find('#sffiles-chatter').prop('checked');
            if (sfChatterChecked) {
                return 'sffileswithchatter';
            } else {
                return 'sffiles';
            }
        } else if (selectedRadioIdentifier == '#radio-files-sffiles-notes-and-attachments') {
            return 'notesandattachments';
        } else if (selectedRadioIdentifier == '#radio-files-oldchatter') {
            return 'oldchatter';
        } else {
            return '';
        }
    };

    var getDestinationFolderLabelText = function() {
        //No breaks in the switch-case because the result is returned immediately
        switch (ddlIntegrationGetSelectedValue()) {
            case enumProviderType.Azure:
                return 'container';
            case enumProviderType.AWSS3:
                return 'bucket';
            case enumProviderType.Stash:
            case enumProviderType.Dropbox:
                return 'folder';
            default:
                return 'folder';
        }
    };

    var getNewDestinationFolderLabel = function() {
        var destinationText = 'Destination ' + getDestinationFolderLabelText() + ':';
        var lblDestinationFolder = fs.FieldSettingBuilder.getNewLabelElement(destinationText);
        lblDestinationFolder.attr('id', 'lblDestinationFolder');
        return lblDestinationFolder;
    };

    var getNewDestinationFolderInput = function() {
        var txtDestinationFolderInput = fs.FieldSettingBuilder.getNewTextInputElement();
        txtDestinationFolderInput.attr('id', 'txtDestinationFolder');
        txtDestinationFolderInput.on('change', function() {
            saveFieldIntegration();
            autoSaveForFileUpload();
        });
        return txtDestinationFolderInput;
    };

    var addDestinationFolderInFieldSettingsSubSection = function(pFolderInputValue) {
        var lblDestinationFolder = getNewDestinationFolderLabel();
        var txtDestinationFolder = getNewDestinationFolderInput();
        txtDestinationFolder.val(pFolderInputValue);
        txtDestinationFolder.focus();

        fs.FieldSettingBuilder.addLabelAndFieldInFieldSettingSubSection(
            'trForFieldUploadDestinationFolder',
            lblDestinationFolder,
            txtDestinationFolder,
            false
        );
    };

    var removeDestinationFolderFromFieldSettingsSubSection = function() {
        fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#trForFieldUploadDestinationFolder')
            .remove();
    };

    var getDestinationFolderInputValue = function() {
        return fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#txtDestinationFolder')
            .val();
    };

    var existOverwriteFileFieldInFieldSettingsSubSection = function() {
        return (
            fs.FieldSettingBuilder.getFieldSettingSubSection().find('#trOverwriteFile').length > 0
        );
    };

    var addOverwriteFileFieldInFieldSettingsSubSection = function() {
        var lblOverwriteFile = getNewOverwriteFileLabel();
        var ckOverWriteFile = addOverwriteFilesCheckBox();
        fs.FieldSettingBuilder.addLabelAndFieldInFieldSettingSubSection(
            'trOverwriteFile',
            lblOverwriteFile,
            ckOverWriteFile,
            true
        );
    };

    var removeOverwriteFileFromFieldSettingsSubSection = function() {
        fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#trOverwriteFile')
            .remove();
    };

    var getOverwriteFileCheckboxValue = function() {
        return fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#ckOverwriteFile')
            .prop('checked');
    };

    var setOverwriteFileCheckboxValue = function(pValue) {
        fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#ckOverwriteFile')
            .prop('checked', pValue);
    };

    var getNewOverwriteFileLabel = function() {
        var labelText = 'Overwrite files:';
        var lblOverwriteFile = fs.FieldSettingBuilder.getNewLabelElement(labelText);
        lblOverwriteFile.attr('id', 'lblOverwriteFile');
        return lblOverwriteFile;
    };

    var addOverwriteFilesCheckBox = function() {
        var ckOverwriteFile = fs.FieldSettingBuilder.getNewCheckBoxField(
            'ckOverwriteFile',
            '',
            overwriteFileCheckboxOnChange
        );
        return ckOverwriteFile;
    };

    var overwriteFileCheckboxOnChange = function() {
        saveFieldIntegration();
        autoSaveForFileUpload();
    };

    var loadIntegrationBoxOnFieldOnLoading = function() {
        var pFormFieldId = getFormFileFieldId();
        getIntegrationDataAndFillIntegrationBox(pFormFieldId);
    };

    var loadIntegrationBoxOnIntegrationChange = function(pIntegrationName) {
        getPlatformConnectionAndFillIntegrationBox(pIntegrationName);
    };

    var getPlatformConnectionAndFillIntegrationBox = function(pProviderType) {
        console.log(
            '[getPlatformConnectionAndFillIntegrationBox] Starts...pProviderType[' +
                pProviderType +
                ']'
        );

        fs.FieldSettingBuilder.addWaitingGear();
        Visualforce.remoting.Manager.invokeAction(
            getRemoteActionURL(
                'PlatformConnectionController',
                'getListPlatformConnectionByProvider'
            ),
            pProviderType,
            function(result, event) {
                console.log('[getPlatformConnectionAndFillIntegrationBox] Result...');
                console.log(result);
                console.log(event);
                if (event.status && result.IsValid) {
                    fs.FieldSettingBuilder.removeWaitingGear();
                    fillIntegrationBoxOnIntegrationChange(result);
                } else {
                    //validateOrg_AfterAPICall_OnError(event);
                    // TODO: Rogerio Manage error
                }
            },
            {
                escape: true
            }
        );
    };

    var getEmptyPlatFormConnectionResponseDTO = function() {
        var platformConnectionResponseDTO = {
            Result: {
                Key: '',
                ProviderType: '',
                RecordId: '',
                Secret: '',
                IsActive: true,
                Name: ''
            },
            ErrorMessage: '',
            IsValid: true
        };

        return platformConnectionResponseDTO;
    };

    var fillIntegrationBoxOnIntegrationChange = function(pPlatformConnectionResult) {
        console.log('[fillIntegrationBoxOnIntegrationChange] Starts...');
        console.log(pPlatformConnectionResult);

        // Load the Destination Folder when we change Integration
        var destinationFolderValue = getDestinationFolderInputValue();
        removeDestinationFolderFromFieldSettingsSubSection();
        addDestinationFolderInFieldSettingsSubSection(destinationFolderValue);

        var platformConnectionResponseDTO = getEmptyPlatFormConnectionResponseDTO();
        // Component doesn't support more then one PlatformAccount
        platformConnectionResponseDTO.Result = pPlatformConnectionResult.Result[0];
        buildPlatformConnectionComponent(platformConnectionResponseDTO);
        hideFieldsThatAreNotUsedInIntegration();
        addNonNativeFeatureMessageInSubSection();
        saveFieldIntegration();
        autoSaveForFileUpload();
    };

    var getFormFileFieldId = function() {
        return fs.FieldSettingBuilder.getFieldSettingSection().find('.fieldDiv input')[0].id;
    };

    var saveFieldIntegration = function() {
        var formId = fs.FormBuilder.getDraftFormId();
        var formFieldId = getFormFileFieldId();
        var recordId = ddlIntegrationGetFieldIntegrationIdAttr();
        var platformAccountId = getPlatFormConnectionComponentRecordId();
        var fieldConfiguration = getFieldConfigurationJSONFromFieldSettings();

        var fieldIntegrationRequest = {
            RecordId: recordId,
            PlatformAccountId: platformAccountId,
            FormId: formId,
            FormFieldId: formFieldId,
            FieldConfiguration: JSON.stringify(fieldConfiguration)
        };

        var listFieldIntegration = [];
        listFieldIntegration.push(fieldIntegrationRequest);

        console.log(fieldIntegrationRequest);

        var pListFieldIntegrationResponseDTO = {
            Result: listFieldIntegration
        };

        Visualforce.remoting.Manager.invokeAction(
            getRemoteActionURL('FieldIntegrationController', 'saveListFieldIntegration'),
            pListFieldIntegrationResponseDTO,
            function(result, event) {
                console.log('[saveFieldIntegration] Result...');
                console.log(result);
                console.log(event);
                if (event.status && result.IsValid) {
                    callbackFromSaveFieldIntegration(result);
                } else {
                    //validateOrg_AfterAPICall_OnError(event);
                    // TODO: Rogerio Manage error
                }
            },
            {
                escape: true
            }
        );
    };

    var callbackFromSaveFieldIntegration = function(pResponse) {
        // We will set the new Field Integration ID
        ddlIntegrationSetFieldIntegrationIdAttr(pResponse.Result[0].RecordId);
    };

    var removeAllFieldIntegrationByFormFieldId = function() {
        var pFormFieldId = getFormFileFieldId();
        removeAllFieldIntegrationByFormFieldIdByFormFieldId(pFormFieldId);
    };

    var removeAllFieldIntegrationByFormFieldIdByFormFieldId = function(pFormFieldId) {
        console.log('[removeAllFieldIntegrationByFormFieldIdByFormFieldId] Starts...');
        var pFormId = fs.FormBuilder.getDraftFormId();

        Visualforce.remoting.Manager.invokeAction(
            getRemoteActionURL(
                'FieldIntegrationController',
                'removeListFieldIntegrationByFormFieldId'
            ),
            pFormId,
            pFormFieldId,
            function(result, event) {
                console.log('[removeAllFieldIntegrationByFormFieldIdByFormFieldId] Result...');
                console.log(result);
                console.log(event);
                if (event.status) {
                    // Remove the old ID, bc if we change back, we will create a new Field integration.
                    ddlIntegrationSetFieldIntegrationIdAttr('');
                } else {
                    //validateOrg_AfterAPICall_OnError(event);
                    // TODO: Rogerio Manage error
                }
            },
            {
                escape: true
            }
        );
    };

    var getFieldConfigurationObjectFromJSON = function(pFieldConfigurationInJSONFormat) {
        if (
            pFieldConfigurationInJSONFormat == undefined ||
            pFieldConfigurationInJSONFormat == '' ||
            pFieldConfigurationInJSONFormat
                .replace('{', '')
                .replace('}', '')
                .trim() == ''
        ) {
            return FieldConfiguration('', '');
        } else {
            return JSON.parse(window.unescapeHTMLString(pFieldConfigurationInJSONFormat));
        }
    };

    var getFieldConfigurationJSONFromFieldSettings = function() {
        return FieldConfiguration(
            getDestinationFolderInputValue(),
            getOverwriteFileCheckboxValue()
        );
    };

    var FieldConfiguration = function(pFolder, pOverwriteFile) {
        return {
            Folder: pFolder,
            OverwriteFile: pOverwriteFile
        };
    };

    var ddlAttachToObjectHide = function() {
        fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#trForAttachFileToList')
            .hide();
    };

    var ddlAttachToObjectShow = function() {
        fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#trForAttachFileToList')
            .show();
    };

    var showFileUploadToSalesforceOptions = function() {
        fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#trForFileUploadFileTosSalesforce')
            .show();
    };

    var hideFileUploadToSalesforceOptions = function() {
        fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#trForFileUploadFileTosSalesforce')
            .hide();
    };

    var fillIntegrationBoxOnFieldLoading = function(pFieldIntegrationResult) {
        console.log('[fillIntegrationBoxOnFieldLoading] Starts...');
        console.log(pFieldIntegrationResult);

        // For now we always have one Field Integration per field.
        var fieldIntegration = pFieldIntegrationResult[0];
        var platformConnection = fieldIntegration.PlatformConnection;

        var objFieldConfiguration = getFieldConfigurationObjectFromJSON(
            fieldIntegration.FieldConfiguration
        );

        // Loading Destination Folder
        removeDestinationFolderFromFieldSettingsSubSection();
        addDestinationFolderInFieldSettingsSubSection(objFieldConfiguration.Folder);

        // Loading
        if (existOverwriteFileFieldInFieldSettingsSubSection() == false) {
            addOverwriteFileFieldInFieldSettingsSubSection();
        }
        setOverwriteFileCheckboxValue(objFieldConfiguration.OverwriteFile);

        // Loading FieldsComponent
        var platformConnectionResponseDTO = getEmptyPlatFormConnectionResponseDTO();
        platformConnectionResponseDTO.Result = platformConnection;
        buildPlatformConnectionComponent(platformConnectionResponseDTO);

        // Settings Other Values
        ddlIntegrationSetValueOnLoading(platformConnection.ProviderType);
        ddlIntegrationSetFieldIntegrationIdAttr(fieldIntegration.RecordId);
        hideFieldsThatAreNotUsedInIntegration();
    };

    var hideFieldsThatAreNotUsedInIntegration = function() {
        ddlAttachToObjectHide();
        hideFileUploadToSalesforceOptions();
    };

    var ddlIntegrationSetValueOnLoading = function(pIntegrationName) {
        // On Loading we don't want to execute the same event as when the dropdown changes
        // We should not do a call to get the PlatformConnection because we had that when we load the field.
        ddlIntegrationRemoveOnChangeEvent();
        ddlIntegrationSetSelectedValue(pIntegrationName);
        var getPlatformConnection = false;
        var ddlIntegration = ddlIntegrationGetElement();
        ddlIntegrationOnChangeEvent(ddlIntegration, getPlatformConnection);

        // Adding events
        ddlIntegrationAddOnChangeEvent();
    };

    var ddlIntegrationSetFieldIntegrationIdAttr = function(pFieldIntegrationId) {
        ddlIntegrationGetElement().prop('data-fieldintegrationid', pFieldIntegrationId);
    };

    var ddlIntegrationGetFieldIntegrationIdAttr = function() {
        return ddlIntegrationGetElement().prop('data-fieldintegrationid');
    };

    var ddlIntegrationHideEntireRow = function() {
        $('#trForFileUploadFileToIntegration').hide();
    };

    var ddlIntegrationShowEntireRow = function() {
        $('#trForFileUploadFileToIntegration').show();
    };

    var buildPlatformConnectionComponent = function(platformConnectionResponseDTO) {
        var platformConnectionComponent = $('<div />', { class: 'fs-platformconnection-cmp' });

        removePlatformConnectionComponentElement();
        // Build the empty Component
        var option = getOption(platformConnectionResponseDTO);
        fs.PC.renderConnectionPickerViewWithOptions(
            platformConnectionResponseDTO,
            platformConnectionComponent,
            option
        );
        // Add the Component into the File Subsection
        fs.FieldSettingBuilder.addPrependRowInFieldSubSectionTable(
            'filePlatformConnectionRow',
            platformConnectionComponent
        );
    };

    var getOption = function(pPlatformConnectionResponseDTO) {
        // If we load a PlatformConnection that is new, we get provider type from ddl
        var providerType = ddlIntegrationGetSelectedValue();

        // If Platformconnection exist, we get it from the reseponse.
        if (
            pPlatformConnectionResponseDTO != undefined &&
            pPlatformConnectionResponseDTO.Result != undefined &&
            pPlatformConnectionResponseDTO.Result.ProviderType != undefined
        ) {
            providerType = pPlatformConnectionResponseDTO.Result.ProviderType;
        }
        //Accept any providerType as long as it exists here
        var targetOption = getOptionObj[providerType];
        if (targetOption) {
            return targetOption;
        }
        //Return nothing otherwise
    };

    var savePlatformConnectionCallBack = function(pResponse, pParentElement) {
        console.log('[savePlatformConnectionCallBack] Starts...');
        console.log(pResponse);
        console.log(pParentElement);

        var selectedIntegrationValue = ddlIntegrationGetSelectedValue();
        getPlatformConnectionAndFillIntegrationBox(selectedIntegrationValue);
    };

    //Here due to "this" in the current scope directing to undefined...
    var getOptionObj = {
        AWSS3: {
            providerType: enumProviderType.AWSS3,
            saveResponseCallBack: savePlatformConnectionCallBack,
            layout: {
                compactTitleConnected: 'Connected to Amazon Web Services',
                compactTitleNotConnected: 'Connect to Amazon Web Services',
                detailTextTop:
                    '<label>Get started by connection to your AWS account. <a href="https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#AWSAccount" target="_blank">Learn more</a></label>',
                detailTextBottom:
                    '<label class="text--bold">Important:</label> <label>Publish the form and make a test submission to verify that the integration works correctly.</label>',
                iconLogoConnected: 'fsPlatformConnectionCompact__logo--integrationActive',
                iconLogoDisconnected: 'fsPlatformConnectionCompact__logo--integrationInactive',
                showAdminSettingsPanelButton: true
            },
            fields: [
                {
                    fieldLabel: 'Access Key ID',
                    fieldIsRequired: true,
                    fieldIsPasswordType: false,
                    fieldPlatformAccountFieldName: 'Key'
                },
                {
                    fieldLabel: 'Secret Access Key',
                    fieldIsRequired: true,
                    fieldIsPasswordType: true,
                    fieldPlatformAccountFieldName: 'Secret'
                },
                {
                    fieldLabel: 'Region',
                    fieldIsRequired: true,
                    fieldIsPasswordType: false,
                    fieldPlatformAccountFieldName: 'Region',
                    jsonVal: true,
                    //Add this to generate a select, left is the value we put into SF, right is the end-user view:
                    selectOptions: {
                        APEast1: 'Asia Pacific (Hong Kong)',
                        APNortheast1: 'Asia Pacific (Tokyo)',
                        APNortheast2: 'Asia Pacific (Seoul)',
                        APNortheast3: 'Asia Pacific (Osaka-Local)',
                        APSouth1: 'Asia Pacific (Mumbai)',
                        APSoutheast1: 'Asia Pacific (Singapore)',
                        APSoutheast2: 'Asia Pacific (Sydney)',
                        CACentral1: 'Canada (Central)',
                        CNNorth1: 'China (Beijing)',
                        CNNorthWest1: 'China (Ningxia)',
                        EUCentral1: 'EU Central (Frankfurt)',
                        EUNorth1: 'EU North (Stockholm)',
                        EUWest1: 'EU West (Ireland)',
                        EUWest2: 'EU West (London)',
                        EUWest3: 'EU West (Paris)',
                        MESouth1: 'Middle East (Bahrain)',
                        SAEast1: 'South America (Sao Paulo)',
                        USEast1: 'US East (Virginia)',
                        USEast2: 'US East (Ohio)',
                        USGovCloudEast1: 'US GovCloud East (Virginia)',
                        USGovCloudWest1: 'US GovCloud East (Oregon)',
                        USWest1: 'US West (N. California)',
                        USWest2: 'US West (Oregon)'
                    }
                }
            ]
        },

        Azure: {
            providerType: enumProviderType.Azure,
            saveResponseCallBack: savePlatformConnectionCallBack,
            layout: {
                compactTitleConnected: 'Connected to Azure',
                compactTitleNotConnected: 'Connect to Azure',
                detailTextTop:
                    '<label>Get started by connection to your Azure account. <a href="https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#AzureAccount" target="_blank">Learn more</a></label>',
                detailTextBottom:
                    '<label class="text--bold">Important:</label> <label>Publish the form and make a test submission to verify that the integration works correctly.</label>',
                iconLogoConnected: 'fsPlatformConnectionCompact__logo--integrationActive',
                iconLogoDisconnected: 'fsPlatformConnectionCompact__logo--integrationInactive',
                showAdminSettingsPanelButton: true
            },
            fields: [
                {
                    fieldLabel: 'Account Name',
                    fieldIsRequired: true,
                    fieldIsPasswordType: false,
                    fieldPlatformAccountFieldName: 'Secret'
                },
                {
                    fieldLabel: 'Account Key',
                    fieldIsRequired: true,
                    fieldIsPasswordType: true,
                    fieldPlatformAccountFieldName: 'Key'
                }
            ]
        },
        Dropbox: {
            //TODO: It would be good to have another field that shows the GUI label (For use in places like buttons)
            providerType: enumProviderType.Dropbox,
            saveResponseCallBack: savePlatformConnectionCallBack,
            layout: {
                compactTitleConnected: 'Connected to Dropbox',
                compactTitleNotConnected: 'Connect to Dropbox',
                detailTextTop:
                    '<label>You have to grant Formstack access to your Dropbox account first. To do this, just click the “Log in to Dropbox” button. <a href="https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#DropboxAccount" target="_blank">Learn more</a></label>',
                detailTextBottom:
                    '<label class="text--bold">Important:</label> <label>Publish the form and make a test submission to verify that the integration works correctly.</label>',
                iconLogoConnected: 'fsPlatformConnectionCompact__logo--integrationActive',
                iconLogoDisconnected: 'fsPlatformConnectionCompact__logo--integrationInactive',
                showAdminSettingsPanelButton: true,
                //If this setting is enabled, we need a popup (third-party login prompt) in order to create this integration.
                showPopup: true
            },
            fields: [
                {
                    fieldLabel: 'Key Generated By Oathflow',
                    fieldIsRequired: true,
                    fieldIsPasswordType: true,
                    fieldPlatformAccountFieldName: 'Key',
                    hidden: true
                },
                {
                    fieldLabel: 'Email from response.',
                    fieldIsRequired: false,
                    fieldIsPasswordType: false,
                    fieldPlatformAccountFieldName: 'Email',
                    jsonVal: true,
                    hidden: true
                }
            ]
        },

        Stash: {
            providerType: enumProviderType.Stash,
            saveResponseCallBack: savePlatformConnectionCallBack,
            layout: {
                compactTitleConnected: 'Connected to Stash (by Formstack)',
                compactTitleNotConnected: 'Connect to Stash (by Formstack)',
                detailTextTop:
                    '<label>Get started by connection to your Stash account. <a href="https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#StashAccount" target="_blank">Learn more</a></label>',
                detailTextBottom:
                    '<label class="text--bold">Important:</label> <label>Publish the form and make a test submission to verify that the integration works correctly.</label>',
                iconLogoConnected: 'fsPlatformConnectionCompact__logo--integrationActive',
                iconLogoDisconnected: 'fsPlatformConnectionCompact__logo--integrationInactive',
                showAdminSettingsPanelButton: true
            },
            fields: [
                {
                    fieldLabel: 'Account Name',
                    fieldIsRequired: true,
                    fieldIsPasswordType: false,
                    fieldPlatformAccountFieldName: 'Secret'
                },
                {
                    fieldLabel: 'Secret Key',
                    fieldIsRequired: true,
                    fieldIsPasswordType: true,
                    fieldPlatformAccountFieldName: 'Key'
                }
            ]
        }
    };

    var removePlatformConnectionComponentElement = function() {
        getPlatFormConnectionComponentElement()
            .parent()
            .parent()
            .remove();
    };

    var getPlatFormConnectionComponentElement = function() {
        return fs.FieldSettingBuilder.getFieldSettingSubSection().find(
            '.fs-platformconnection-cmp'
        );
    };

    var getPlatFormConnectionComponentRecordId = function() {
        var component = fs.FieldSettingBuilder.getFieldSettingSubSection().find(
            '.fs-platformconnection-cmp .fsPlatformConnectionCompact'
        );
        return component.first().attr('data-platform-connection-recordid');
    };

    var getIntegrationDataAndFillIntegrationBox = function(pFormFieldId) {
        // If Integration is enabled, we have to call sf endpoint to get Integration Data
        console.log('[getIntegrationDataAndFillIntegrationBox] Starts... [' + pFormFieldId + ']');
        var pFormId = fs.FormBuilder.getDraftFormId();

        fs.FieldSettingBuilder.addWaitingGear();
        Visualforce.remoting.Manager.invokeAction(
            getRemoteActionURL(
                'FieldIntegrationController',
                'getListFieldIntegrationByFormFieldId'
            ),
            pFormId,
            pFormFieldId,
            function(result, event) {
                console.log('[getIntegrationDataAndFillIntegrationBox] Result...');
                console.log(result);
                console.log(event);
                if (event.status && result.IsValid) {
                    fs.FieldSettingBuilder.removeWaitingGear();
                    fillIntegrationBoxOnFieldLoading(result.Result);
                } else {
                    //validateOrg_AfterAPICall_OnError(event);
                    // TODO: Rogerio Manage error
                }
            },
            {
                escape: true
            }
        );

        return '';
    };

    var getFileRadioSelectedValueFromInputElement = function(
        pSfFileHtmlValue,
        pSfChatterHtmlValue,
        pUploadToIntegrationHtmlValue
    ) {
        if (pSfFileHtmlValue == 'true') {
            if (pSfChatterHtmlValue == 'true') {
                return 'sffileswithchatter';
            } else {
                return 'sffiles';
            }
        } else if (pSfChatterHtmlValue == 'true') {
            return 'oldchatter';
        } else if (pUploadToIntegrationHtmlValue == 'true') {
            return '';
        } else {
            return 'notesandattachments';
        }
    };

    var hideSFFilesValueInSFFileRadioSection = function() {
        var sfRadioSection = fs.FieldSettingBuilder.getFieldSettingSubSection().find(
            '.salesforce-file-radio'
        );
        var liRadioToBeActivated = sfRadioSection.find('a[href="#radio-files-sffiles"]').parent();
        liRadioToBeActivated.hide();
    };

    var setSelectedValueInSfFileRadioSection = function(pValue) {
        var sfRadioSection = fs.FieldSettingBuilder.getFieldSettingSubSection().find(
            '.salesforce-file-radio'
        );
        // Disabling all the options selected.
        var sfChatterCheckbox = sfRadioSection.find('#sffiles-chatter');
        sfChatterCheckbox.prop('checked', false);
        var selectedRadio = sfRadioSection.find('li.active');
        selectedRadio.removeClass('active');

        if (pValue === 'sffileswithchatter' || pValue === 'sffiles') {
            var liRadioToBeActivated = sfRadioSection
                .find('a[href="#radio-files-sffiles"]')
                .parent();
            liRadioToBeActivated.addClass('active');

            if (pValue === 'sffileswithchatter') {
                sfChatterCheckbox.prop('checked', true);
            } else {
                // Do nothing, bc will be only sfFiles.
            }
        } else if (pValue == 'notesandattachments') {
            var liRadioToBeActivated = sfRadioSection
                .find('a[href="#radio-files-sffiles-notes-and-attachments"]')
                .parent();
            liRadioToBeActivated.addClass('active');
        } else if (pValue == 'oldchatter') {
            var liRadioToBeActivated = sfRadioSection
                .find('a[href="#radio-files-oldchatter"]')
                .parent();
            liRadioToBeActivated.addClass('active');
        } else {
            // Will disable all the Radio the Options
        }
    };

    var sfFileRadioLegacyChatterApiHide = function() {
        var sfRadioSection = fs.FieldSettingBuilder.getFieldSettingSubSection().find(
            '.salesforce-file-radio'
        );
        sfRadioSection
            .find('a[href="#radio-files-oldchatter"]')
            .parent()
            .hide();
    };

    var sfFileRadioLegacyChatterApiShow = function() {
        var sfRadioSection = fs.FieldSettingBuilder.getFieldSettingSubSection().find(
            '.salesforce-file-radio'
        );
        sfRadioSection
            .find('a[href="#radio-files-oldchatter"]')
            .parent()
            .show();
    };

    var sfFileRadioSectionChangeLabelName = function(ddlIntegrationSelectedValue) {
        var sufixLabel = '';

        if (isNativeForm()) {
            if (
                ddlIntegrationSelectedValue == enumProviderType.SalesforceNativeCloud
            ) {
                sufixLabel = '<i>(Native)</i>';
            } else {
                sufixLabel = '<i>(Non-Native)</i>';
            }
        }

        sfFileRadioSetLabelOption(
            'a[href="#radio-files-sffiles"]',
            'Salesforce Files ' + sufixLabel
        );
        sfFileRadioSetLabelOption(
            'a[href="#radio-files-sffiles-notes-and-attachments"]',
            'Notes and Attachments ' + sufixLabel
        );
        sfFileRadioSetLabelOption(
            'a[href="#radio-files-oldchatter"]',
            'Legacy Chatter API ' + sufixLabel
        );
        sfFileRadioSetLabelOptionForChatterCheckBox('Share as Chatter Feed Item ' + sufixLabel);
    };

    var sfFileRadioSetLabelOption = function(pIdentifier, pNewLabel) {
        var sfRadioSection = fs.FieldSettingBuilder.getFieldSettingSubSection().find(
            '.salesforce-file-radio'
        );
        var sfRadioSectionLabelOption = sfRadioSection.find(pIdentifier).find('label');
        sfRadioSectionLabelOption.html(pNewLabel);
    };

    var sfFileRadioSetLabelOptionForChatterCheckBox = function(pNewLabel) {
        var sfRadioSection = fs.FieldSettingBuilder.getFieldSettingSubSection().find(
            '.salesforce-file-radio'
        );
        var sfRadioSectionLabelOption = sfRadioSection
            .find('#sffiles-chatter')
            .parent()
            .find('.checkbox-label');
        sfRadioSectionLabelOption.html(pNewLabel);
    };

    var sfFileRadioSectionStart = function() {
        setSelectedValueInSfFileRadioSection('sffiles');
        sfFileRadioSectionAddEvent();
    };

    var sfFileRadioSectionAddEvent = function() {
        var checkboxSfSalesforceFilesWithChatter = fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('.salesforce-file-radio')
            .find('#sffiles-chatter');
        checkboxSfSalesforceFilesWithChatter.on('change', function() {
            if ($(this).prop('checked') == true) {
                setSelectedValueInSfFileRadioSection('sffileswithchatter');
            }
            autoSaveForFileUpload();
        });

        var sfSalesforceFiles = fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('.salesforce-file-radio')
            .find('a[href="#radio-files-sffiles"]');
        sfSalesforceFiles.on('click', function() {
            setSelectedValueInSfFileRadioSection('sffiles');
            autoSaveForFileUpload();
        });

        var sfNotesAndAttachmentRadioSectionClick = fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('.salesforce-file-radio')
            .find('a[href="#radio-files-sffiles-notes-and-attachments"]');
        sfNotesAndAttachmentRadioSectionClick.on('click', function() {
            setSelectedValueInSfFileRadioSection('notesandattachments');
            autoSaveForFileUpload();
        });

        var sfOldChatterRadioSectionClick = fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('.salesforce-file-radio')
            .find('a[href="#radio-files-oldchatter"]');
        sfOldChatterRadioSectionClick.on('click', function() {
            setSelectedValueInSfFileRadioSection('oldchatter');
            autoSaveForFileUpload();
        });
    };

    var isUploadToChatterChecked = function(sfRadioSelectedValue) {
        if (sfRadioSelectedValue == 'oldchatter') {
            return true;
        } else if (sfRadioSelectedValue == 'sffileswithchatter') {
            return true;
        } else {
            return false;
        }
    };

    var isUploadToSFFileChecked = function(sfRadioSelectedValue) {
        if (sfRadioSelectedValue == 'sffiles') {
            return true;
        } else if (sfRadioSelectedValue == 'sffileswithchatter') {
            return true;
        } else {
            return false;
        }
    };

    var isIntegrationSelected = function(selectedIntegrationValue) {
        var isSalesforceIntegrationSelected = false;
        if (
            selectedIntegrationValue == enumProviderType.Salesforce ||
            selectedIntegrationValue == enumProviderType.SalesforceNativeCloud
        ) {
            // Salesforce is not considered one integration, on this scenario
            isSalesforceIntegrationSelected = true;
        }

        return !isSalesforceIntegrationSelected;
    };

    var isNativeUploadOptionSelected = function(selectedIntegrationValue) {
        var isSalesforceNativeCloudIntegrationSelected =
            selectedIntegrationValue == enumProviderType.SalesforceNativeCloud;
        return isSalesforceNativeCloudIntegrationSelected;
    };

    var fileUploadSizeLimitAddEventOnChange = function() {
        fileUploadSizeGetElement().on('change', function() {
            fileUploadSizeCleanError();

            var valueTyped = $(this).val();
            var selectedIntegrationValue = ddlIntegrationGetSelectedValue();
            var selectedIntegrationGuiLabel = ddlIntegrationsGetSelectedGuiLabel();

            var sizeErrMsg = ' integration max file size is ';
            var resultError = '';
            if (
                valueTyped > 25 &&
                [
                    enumProviderType.Azure, 
                    enumProviderType.Stash, 
                    enumProviderType.Dropbox,
                    enumProviderType.Salesforce,
                    enumProviderType.AWSS3
                ].indexOf(selectedIntegrationValue) > -1
            ) {
                resultError += selectedIntegrationGuiLabel + sizeErrMsg + '25';
            }

            //If we have an error to show, let's display it:
            if (resultError.length) {
                fileUploadSizeShowError(resultError + 'MB');
            }

            autoSaveForFileUpload();
        });
    };

    var fileUploadSizeShowError = function(pErrorMessage) {
        var fileUploadSizeLimitField = fileUploadSizeGetElement();
        fs.FieldSettingBuilder.setFieldAsError(fileUploadSizeLimitField);

        var lastElementFromFileUploadSizeLimit = fileUploadSizeGetElement()
            .parent()
            .find('.blue-tooltip');
        lastElementFromFileUploadSizeLimit.after(
            fs.FieldSettingBuilder.getFieldErrorText(pErrorMessage)
        );
    };

    var fileUploadSizeCleanError = function() {
        var fileUploadSizeLimitField = fileUploadSizeGetElement();
        fs.FieldSettingBuilder.removeFieldAsError(fileUploadSizeLimitField);
        fileUploadSizeLimitField
            .parent()
            .find('.field-settings__errorlabel')
            .remove();
    };

    var getFileFeatureMessageContainer = function(pIconClass, pMessage) {
        var featureMessageIcon = $('<div />', { class: 'fs-feature-message-icon' });
        featureMessageIcon.addClass(pIconClass);

        var featureMessageTextContainer = $('<div />', {
            class: 'fs-feature-message-text-container'
        });
        featureMessageTextContainer.append(pMessage);

        var featureMessageContainer = $('<div />', { class: 'fs-feature-message-container' });
        featureMessageContainer.append(featureMessageIcon);
        featureMessageContainer.append(featureMessageTextContainer);

        return featureMessageContainer;
    };

    var fileUploadSizeGetElement = function() {
        return fs.FieldSettingBuilder.getFieldSettingSubSection().find('#maxFileSize');
    };

    var fileUploadSizeShowField = function() {
        fileUploadSizeGetElement()
            .parent()
            .parent()
            .show();
    };

    var fileUploadSizeHideField = function() {
        fileUploadSizeGetElement()
            .parent()
            .parent()
            .hide();
    };

    var loadFileUploadSubSectionOnFieldLoad = function(
        pUploadToIntegration,
        pUploadToSFFile,
        pUploadtochatter,
        pIsNativeOptionSelected,
        pIsFileServiceOn
    ) {
        if (pIsFileServiceOn == 'false') {
            // Old File Upload Fields in Classic or Native
            ddlIntegrationHideEntireRow();
            hideSFFilesValueInSFFileRadioSection();
            fileUploadSizeHideField();
            // Adding temporary space till we implement the Native Dropdown.
            $('#trForMsgField')
                .find('td')
                .css('padding-bottom', '10px');

            // Loading the RadioBox for the Old Options which are Chatter or Attachments and Documents.
            var radioBoxSelected = getFileRadioSelectedValueFromInputElement(
                pUploadToSFFile,
                pUploadtochatter,
                pUploadToIntegration
            );
            setSelectedValueInSfFileRadioSection(radioBoxSelected);
            // We will not proceed if the FileService is not on for this Field.
            return;
        }

        ddlIntegrationShowEntireRow();
        fileUploadSizeShowField();

        if (pUploadToIntegration == 'true') {
            loadIntegrationBoxOnFieldOnLoading();
        } else {
            // We remove the event, since it is a loading, we don't need to save anything.
            ddlIntegrationRemoveOnChangeEvent();
            
            if (pIsNativeOptionSelected == 'true') {
                ddlIntegrationSetSelectedValue(enumProviderType.SalesforceNativeCloud);
                addNativeFeatureMessageInSubSection();
                // Native is always 2.5 MB
                fileUploadSizeHideField();
                // We also should not show the Legacy
                sfFileRadioLegacyChatterApiHide();
            } else {
                // Classic
                ddlIntegrationSetSelectedValue(enumProviderType.Salesforce);
                addNonNativeFeatureMessageInSubSection();
            }

            // This logic should be after the Integration is selected.
            var radioBoxSelected = getFileRadioSelectedValueFromInputElement(
                pUploadToSFFile,
                pUploadtochatter,
                pUploadToIntegration
            );
            setSelectedValueInSfFileRadioSection(radioBoxSelected);

            // We add the event back, if the user change then we will save the information.
            ddlIntegrationAddOnChangeEvent();
        }
    };

    var addNativeFeatureMessageInSubSection = function() {
        if (isNativeForm() == false) {
            return;
        }

        var iconClass = 'feature-message-icon__cloudNative';
        var contentMessage =
            '<div class="feature-message-text__title"><span>Salesforce Native Feature</span></div>';
        contentMessage +=
            '<div class="feature-message-text__body">This feature is built on native Salesforce functionality in your org. ';
        contentMessage +=
            '<a class="a--blue" href="https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#SalesforceNativeFeature" target="_blank">Learn more</a></div>';
        contentMessage +=
            '<div class="feature-message-text__bottom"><span>Note:</span> Supported file size upload limit is up to 2.5MB.</div>';

        var featureMessageContainer = getFileFeatureMessageContainer(iconClass, contentMessage);
        addFeatureMessageInSubSection(featureMessageContainer);
    };

    var addNonNativeFeatureMessageInSubSection = function() {
        if (isNativeForm() == false) {
            return;
        }

        var iconClass = 'feature-message-icon__nonCloudNative';
        var contentMessage =
            '<div class="feature-message-text__title"><span>Non-Native Feature</span></div>';
        contentMessage +=
            '<div class="feature-message-text__body">This feature is not built on native Salesforce functionality in your org. ';
        contentMessage += 'Data is routed through a secure Formstack system. ';
        contentMessage +=
            '<a class="a--blue" href="https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#SalesforceNonNativeFeature" target="_blank">Learn more</a></div>';
        contentMessage +=
            '<div class="feature-message-text__bottom"><span>Note:</span> Supported file size upload limit is up to 25MB.</div>';

        var featureMessageContainer = getFileFeatureMessageContainer(iconClass, contentMessage);
        addFeatureMessageInSubSection(featureMessageContainer);
    };

    var addNonNativeFeatureMessageWithNoAccessInSubSection = function() {
        if (isNativeForm() == false) {
            return;
        }

        var iconClass = 'feature-message-icon__nonCloudNative';
        var contentMessage =
            '<div class="feature-message-text__title"><span>Non-Native Feature</span></div>';
        contentMessage +=
            '<div class="feature-message-text__body"><div>This feature is not built on native Salesforce functionality in your org. ';
        contentMessage += 'Data is routed through a secure Formstack system.';
        contentMessage +=
            '<a class="a--blue" href="https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#SalesforceNonNativeFeature" target="_blank">Learn more</a></div>';
        contentMessage +=
            '<div style="padding-top: 7px;">This feature has been disabled because it may not meet your organization\'s security or compliance requirements. ';
        contentMessage += 'Please contact Formstack Support to activate it.</div></div>';
        contentMessage +=
            '<div class="feature-message-text__bottom"><span>Note:</span> Supported file size upload limit is up to 25MB.</div>';

        var featureMessageContainer = getFileFeatureMessageContainer(iconClass, contentMessage);
        addFeatureMessageInSubSection(featureMessageContainer);
    };

    var addFeatureMessageInSubSection = function(pMessageContainer) {
        // Clean any message in the Section
        fs.FieldSettingBuilder.getFieldSettingSubSection()
            .find('#fileFeatureMessage')
            .remove();

        // Add Message
        fs.FieldSettingBuilder.addPrependRowInFieldSubSectionTable(
            'fileFeatureMessage',
            pMessageContainer
        );
    };

    var _fileSettingBuilder = {
        getSelectedValueInSfFileRadioSection: getSelectedValueInSfFileRadioSection,
        hideSFFilesValueInSFFileRadioSection: hideSFFilesValueInSFFileRadioSection,
        hideFileSettingsSubSection: hideFileSettingsSubSection,
        showFileSettingsSubSection: showFileSettingsSubSection,
        fileUploadSizeLimitAddEventOnChange: fileUploadSizeLimitAddEventOnChange,
        ddlIntegrationHideEntireRow: ddlIntegrationHideEntireRow,
        ddlIntegrationShowEntireRow: ddlIntegrationShowEntireRow,
        ddlIntegrationGetSelectedValue: ddlIntegrationGetSelectedValue,
        loadDropdownIntegration: loadDropdownIntegration,
        isUploadToChatterChecked: isUploadToChatterChecked,
        isUploadToSFFileChecked: isUploadToSFFileChecked,
        isIntegrationSelected: isIntegrationSelected,
        removeAllFieldIntegrationByFormFieldIdByFormFieldId: removeAllFieldIntegrationByFormFieldIdByFormFieldId,
        isNativeUploadOptionSelected: isNativeUploadOptionSelected,
        loadFileUploadSubSectionOnFieldLoad: loadFileUploadSubSectionOnFieldLoad
    };
    return {
        FileSettingBuilder: _fileSettingBuilder,
        FSB: _fileSettingBuilder
    };
});
