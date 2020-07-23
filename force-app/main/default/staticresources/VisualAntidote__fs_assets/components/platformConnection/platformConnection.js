/**
 * @summary JS for Platform Connection feature core business logic
 * i.e. DOM manipulation, communication to Apex backend
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
        root.PlatformConnection = libObject.PlatformConnection;
        root.PC = libObject.PC;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var platformConnectionConfiguration = {
        connectionPickerWithFormView: '',
        connectedTitle: '',
        notConnectedTitle: '',
        detailTextTop: '',
        detailTextBottom: '',
        fieldAPIKey: '',
        fields: [],
        providerType: '',
        saveResponseCallBack: undefined,
        iconLogoConnected: '',
        iconLogoDisconnected: '',
        showAdminSettingsPanelButton: false
    };
    platformConnectionConfiguration.connectionPickerWithFormView =
        '<div class="fsPlatformConnectionBox"> <div class="fsPlatformConnectionCompact"> <div class="fsPlatformConnectionCompact__logo fsPlatformConnectionCompact__logo--document"></div><div class="fsPlatformConnectionCompact__title">Connect to Formstack Documents</div><button type="button" class="fsPlatformConnectionCompact__state">toggle</button></div><div class="fsPlatformConnectionDetail"> <div class="fsPlatformConnectionDetail__title">Let\'s start by connecting to Formstack Documents (formerly Webmerge). <a href="#">Learn More</a></div><div class="fsPlatformConnectionDetail__notification"></div><div class="fsForm fsForm--widthSM"> <div class="fsFormRow"> <label for="textAPIKey" class="fsLabel lblAPIKey">Api Key<span class="fsLabel__req">*</span></label><input id="textAPIKey" class="fsInput fsInput--text" type="password"/> </div><div class="fsFormRow"> <label for="textAPISecret" class="fsLabel lblAPISecret">Api Secret<span class="fsLabel__req">*</span></label><input id="textAPISecret" class="fsInput fsInput--text" type="password"/> </div><div class="fsFormRow fsFormButtonRow"> <button type="button" class="fsBtn fsBtn--primary fsBtn--radius-sm"><span class="fsBtn__text">Save</span></button> </div></div><div class="fsPlatformConnectionDetail__titleBottom"></div></div></div>';

    var enumProviderType = {
        FormstackDocuments: 'FormstackDocuments'
    };
    Object.freeze(enumProviderType);

    const DOCUMENT_RELATIVE_PATH = {
        API: '/api'
    };
    /**
     * get formstack document url from our global variable
     * @param {string} [relativeSubPath]
     */
    var getDocumentEndpointURL = function(relativeSubPath) {
        var endpointURL = fs.Utils.getFSNSVariable('formstackDocumentsEndpoint');
        if (!fs.Utils.isNullOrEmpty(relativeSubPath)) {
            endpointURL += relativeSubPath;
        }
        return endpointURL;
    };
    var PCAttributeInfo = function(recordId, key, secret, name) {
        this.RecordId = recordId;
        this.Key = key;
        this.Secret = secret;
        if (name !== undefined) {
            this.Name = name;
        } else {
            this.Name = '';
        }
    };
    var getSafeBoolean = function(booleanValue, defaultValue) {
        var returnBool = defaultValue;
        try {
            if (booleanValue === undefined) {
                return returnBool;
            }
            if (booleanValue.toString().toLowerCase() == 'true' || booleanValue == true) {
                returnBool = true;
            } else if (booleanValue.toString().toLowerCase() == 'false' || booleanValue == false) {
                returnBool = false;
            }
        } catch (err) {
            console.log('[FORM] [getSafeBoolean] ' + err);
        }
        return returnBool;
    };
    var getNotificationParentElem = function() {
        var parentElem = $('.pcNotification');
        if (parentElem.length == 0) {
            parentElem = $('.fsContentBox');
        }
        return parentElem;
    };
    var getNotificationWrapperElement = function() {
        var stepNotificationElement = document.createElement('div');
        stepNotificationElement.className = 'pcNotification';
        return stepNotificationElement;
    };
    var addRequiredHighlightToFields = function(pcBoxMainElem, fieldList) {
        if (fieldList.length > 0) {
            for (var elemIndex = 0; elemIndex < fieldList.length; elemIndex++) {
                var reqElem = $(pcBoxMainElem).find(fieldList[elemIndex]);
                reqElem.addClass('fsInput--fsRequired');
            }
        }
    };
    var removeRequiredHighlightByClassName = function(reqFieldClassName) {
        var reqFieldElements = $('.' + reqFieldClassName);
        if (reqFieldElements.length > 0) {
            reqFieldElements.removeClass(reqFieldClassName);
        }
    };

    var handleResponseSavePlatformConnectionCallback = function(
        response,
        platformConnectionDTOObj
    ) {
        var pcStepItemElement = $('.fsStepItem--platformConnection');
        if (response.responseJSON !== undefined && response.responseJSON.error) {
            var notificationElement = $(pcStepItemElement).find('.pcNotification');
            window.showPillMessage_Error(response.responseJSON.error, true, notificationElement);
        } else {
            // If credentials are valid
            savePlatformConnectionInSF(platformConnectionDTOObj, pcStepItemElement);
        }
    };

    var savePlatformConnectionInSF = function(pPlatformConnectionDTOObj, pcStepItemElement) {
        if (fs.Utils.isNullOrEmpty(pPlatformConnectionDTOObj.RecordId)) {
            createPlatformConnection(pPlatformConnectionDTOObj, pcStepItemElement);
        } else {
            updatePlatformConnection(pPlatformConnectionDTOObj, pcStepItemElement);
        }
    };

    var validateAndSavePlatformConnection = function(platformConnectionDTOObj) {
        if (platformConnectionDTOObj.ProviderType == enumProviderType.FormstackDocuments) {
            var documentAPI = getDocumentEndpointURL(DOCUMENT_RELATIVE_PATH.API);
            var username = platformConnectionDTOObj.Key;
            var password = platformConnectionDTOObj.Secret;
            var platformConnectionServiceObj = new fs.PlatformConnectionService(
                documentAPI,
                username,
                password
            );
            platformConnectionServiceObj.validateAPIcredentials(
                platformConnectionDTOObj,
                handleResponseSavePlatformConnectionCallback
            );
        } else {
            savePlatformConnectionInSF(platformConnectionDTOObj);
        }
    };

    /*Automatically set fields based on what's inside the config. each key represents the internal value found in "data-platformaccountfield"
    example input for configObj:
    {
        Key:"value1",
        Secret:"value2"
    }
    */
    var setFields = function(pcBoxMainElem, configObj) {
        var rows = $(pcBoxMainElem).find('.fsForm > .fsFormRow:not(.fsFormButtonRow)');

        for (var fieldName in configObj) {
            var searchResult = rows.find('[data-platformaccountfield="' + fieldName + '"]');
            if (searchResult.length) {
                var fieldValue = configObj[fieldName];
                searchResult[0].value = fieldValue;
            }
        }
    };

    var getAllRequiredInvalidField = function(pcBoxMainElem) {
        var listFieldRows = $(pcBoxMainElem).find('.fsForm > .fsFormRow:not(.fsFormButtonRow)');
        var allRequiredInvalidFields = [];

        for (let index = 0; index < listFieldRows.length; index++) {
            const fieldRow = listFieldRows[index];

            var isRequired = $(fieldRow).find('.fsLabel__req').length > 0;
            if (isRequired) {
                var inputFieldElement = $(fieldRow).find(
                    '.fsInput--text, .select2-offscreen[data-platformaccountfield]'
                );
                var fieldValue = inputFieldElement.val();
                if (fs.Utils.isNullOrEmpty(fieldValue)) {
                    allRequiredInvalidFields.push('#' + $(inputFieldElement).attr('id'));
                }
            }
        }
        return allRequiredInvalidFields;
    };

    var getRecordIdFromComponent = function() {
        var pcDataAttributesObj = getPlatformConnectionCompactViewDataAttributes(
            $('.fsPlatformConnectionCompact')
        );

        var recordId = '';

        if (pcDataAttributesObj.RecordId != undefined && pcDataAttributesObj.RecordId != null) {
            recordId = pcDataAttributesObj.RecordId;
        }

        return recordId;
    };

    var getNameFromComponent = function() {
        var pcDataAttributesObj = getPlatformConnectionCompactViewDataAttributes(
            $('.fsPlatformConnectionCompact')
        );

        var name = '';

        if (pcDataAttributesObj.Name != undefined && pcDataAttributesObj.Name != null) {
            name = pcDataAttributesObj.Name;
        }

        return name;
    };

    var savePlatformConnection = function(pcBoxMainElem) {
        removeRequiredHighlightByClassName('fsInput--fsRequired');

        var listInvalidRequiredFields = getAllRequiredInvalidField(pcBoxMainElem);
        var isSubmissionInvalid = listInvalidRequiredFields.length > 0;

        if (isSubmissionInvalid) {
            addRequiredHighlightToFields(pcBoxMainElem, listInvalidRequiredFields);
        } else {
            var platformConnectionDTOObj = new fs.DTOs.PlatformConnectionDTOProvider.PlatformConnectionDTO();
            platformConnectionDTOObj.RecordId = getRecordIdFromComponent();
            platformConnectionDTOObj.Key = getFieldValue(pcBoxMainElem, 'Key');
            platformConnectionDTOObj.Secret = getFieldValue(pcBoxMainElem, 'Secret');
            platformConnectionDTOObj.Name = getNameFromComponent();
            platformConnectionDTOObj.ProviderType = platformConnectionConfiguration.providerType;
            platformConnectionDTOObj.FieldConfiguration = generateFieldConfiguration(pcBoxMainElem);

            validateAndSavePlatformConnection(platformConnectionDTOObj);
        }
    };

    //Find all values to go inside FieldConfiguration
    var generateFieldConfiguration = function(pcBoxMainElem) {
        var resultJson = '';

        var jsonValues = $(pcBoxMainElem).find(
            '[data-platformaccountfield!=""][data-jsonval="true"]'
        );

        if (jsonValues.length) {
            var FieldConfiguration = {};
            jsonValues.each(function() {
                FieldConfiguration[this.dataset.platformaccountfield] = this.value;
            });
            resultJson = JSON.stringify(FieldConfiguration);
        }
        return resultJson;
    };

    //Placeholder code until the popup system is ready. In general this would be the connector between openLoginPopup and the popup component
    //When the popup component is done, all it takes is inserting those values into the field and then saving.
    //NOTE TO SELF - MAKE THIS PRIVATE AGAIN!
    var completePopupSave = function(fsContentBoxElem, resultFields) {
        setFields(fsContentBoxElem, resultFields);
        savePlatformConnection(fsContentBoxElem);
    };

    var convertSaveBtnToPopupBtn = function(fsContentBoxElem, integrationName) {
        var button = $(fsContentBoxElem).find('.fsBtn');
        var buttonRow = button.parents('.fsFormButtonRow')[0];
        buttonRow.classList.remove('fsFormRow');
        $(button).remove();

        var aBtnOpenDropbox = document.createElement('a');
        var linkText = 'Log in to ' + integrationName;
        var linkTextElement = document.createTextNode(linkText);
        aBtnOpenDropbox.appendChild(linkTextElement);
        aBtnOpenDropbox.title = linkText;
        aBtnOpenDropbox.id = 'btnOpenDropbox';
        aBtnOpenDropbox.target = '_blank';
        aBtnOpenDropbox.classList.add('fsBtn');
        aBtnOpenDropbox.classList.add('fsBtn--primary');
        aBtnOpenDropbox.classList.add('fsBtn--radius-sm');
        aBtnOpenDropbox.classList.add('fsbtnLinkDropbox');
        // When the user clicks on the link, we do two things:
        //  1. Open the Dropbox page, for user to go through the Oauth process
        //  2. Open an iframe that will be listen to messages that the Oauth process was finished.
        aBtnOpenDropbox.href = getDropboxURL();
        aBtnOpenDropbox.addEventListener('click', function() {
            addListenerForIntegration();
            createAuthorizeIframe(fsContentBoxElem);
        });
        buttonRow.appendChild(aBtnOpenDropbox);

        // Setting the context for tokenReceiver to use this variable after.
        componentContainer = $(fsContentBoxElem);
    };

    var getDropboxURL = function() {
        var engineRedirect = getIntegrationAuthorizedURL();
        var dropboxURL =
            'https://www.dropbox.com/oauth2/authorize?client_id=' +
            window.dropboxKey +
            '&response_type=code&redirect_uri=' +
            engineRedirect;
        return dropboxURL;
    };

    var getIntegrationAuthorizedURL = function() {
        return engineURL + '/Integration/IntegrationAuthorized';
    };

    var getAuthorizeIntegrationURL = function() {
        return engineURL + '/Integration/AuthorizeIntegration?IntegrationType=Dropbox';
    };

    // This iframe will be responsible listen for a messsage when the Oauth process is finished.
    // Once the Ouath Process finished, we will send a post to SF from this iFrame with the Token.
    // The user doesn't need to see this iframe.
    var createAuthorizeIframe = function(fsContentBoxElem) {
        var iFrame = $('<iframe />', {
            src: getAuthorizeIntegrationURL(),
            width: 400,
            heigth: 400
        });
        var divContainer = $('<div />', { class: 'integrationAuthorizeContainer' });
        divContainer.append(iFrame);
        $(divContainer).hide();
        // Removing all the IntegrationAuthorizeContainer
        $(fsContentBoxElem)
            .find('.integrationAuthorizeContainer')
            .remove();
        // Adding the IntegrationAuthorizeContainer
        $(fsContentBoxElem).append(divContainer);
    };

    var addListenerForIntegration = function() {
        $(window).off('message');
        $(window).on('message', tokenReceiver);
    };

    // We set this when user chooses dropbox.
    var componentContainer = null;
    var tokenReceiver = function(event) {
        console.log('[PlatformConnection] We got a message!');
        if (event.originalEvent.data == undefined) {
            return;
        }

        if (event.originalEvent.data.isValid == undefined) {
            return;
        }

        var response = event.originalEvent.data;
        if (response.isValid) {
            console.log('[PlatformConnection] Saving the message!');
            var fieldKey = {};
            fieldKey['Key'] = response.token;
            fieldKey['Email'] = response.userEmail;
            completePopupSave(componentContainer, fieldKey);
        } else {
            console.log('[PlatformConnection] Message is Invalid!');
            console.log(
                '[PlatformConnection] Error here errorCode[' +
                    response.errorCode +
                    '] errorMessage[' +
                    response.errorMessage +
                    ']'
            );
        }

        // Removing the iFrame that listen for message.
        $('.integrationAuthorizeContainer').remove();
        $(window).off('message');
    };

    var bindClickOnSaveConnectionButton = function(fsContentBoxElem) {
        $(fsContentBoxElem)
            .find('.fsBtn')
            .click(function() {
                savePlatformConnection(fsContentBoxElem);
                return false;
            });
    };

    var bindClickOnToggleConnectionPickerButton = function(fsContentBoxElem) {
        $(fsContentBoxElem)
            .find('.fsPlatformConnectionCompact__state')
            .click(function() {
                toggleConnectionPicker(this);
                return false;
            });
    };
    var toggleConnectionPicker = function(elemSource) {
        if ($(elemSource).hasClass('fsPlatformConnectionCompact__state--collapsed')) {
            collapseConnectionPicker(elemSource);
        } else {
            expandConnectionPicker(elemSource);
        }
    };
    var setPlatformConnectionCompactViewDataAttributes = function(
        fsPlatformConnectionCompactElem,
        pcAttributeInfoObj
    ) {
        $(fsPlatformConnectionCompactElem).attr(
            'data-platform-connection-recordid',
            pcAttributeInfoObj.RecordId
        );
        $(fsPlatformConnectionCompactElem).attr(
            'data-platform-connection-key',
            pcAttributeInfoObj.Key
        );
        $(fsPlatformConnectionCompactElem).attr(
            'data-platform-connection-secret',
            pcAttributeInfoObj.Secret
        );
        $(fsPlatformConnectionCompactElem).attr(
            'data-platform-connection-name',
            pcAttributeInfoObj.Name
        );
    };
    var getPlatformConnectionCompactViewDataAttributes = function(fsPlatformConnectionCompactElem) {
        var pcDataAttributesObj = new PCAttributeInfo('', '', '', '');
        pcDataAttributesObj.RecordId = $(fsPlatformConnectionCompactElem).attr(
            'data-platform-connection-recordid'
        );
        pcDataAttributesObj.Key = $(fsPlatformConnectionCompactElem).attr(
            'data-platform-connection-key'
        );
        pcDataAttributesObj.Secret = $(fsPlatformConnectionCompactElem).attr(
            'data-platform-connection-secret'
        );
        pcDataAttributesObj.Name = $(fsPlatformConnectionCompactElem).attr(
            'data-platform-connection-name'
        );
        return pcDataAttributesObj;
    };

    var updatePlatformConnectionDetail = function(pcBoxMainElem) {
        var detailTextTop = $(pcBoxMainElem).find('.fsPlatformConnectionDetail__title');
        $(detailTextTop).html(platformConnectionConfiguration.detailTextTop);

        var detailTextBottom = $(pcBoxMainElem).find('.fsPlatformConnectionDetail__titleBottom');
        $(detailTextBottom).html(platformConnectionConfiguration.detailTextBottom);

        addListFieldsInComponent(pcBoxMainElem, platformConnectionConfiguration.fields);
    };

    var updatePlatformConnectionCompactViewTitle = function(pcBoxMainElem) {
        var platformConnectionCompactDiv = $(pcBoxMainElem).find('.fsPlatformConnectionCompact');
        var pcDataAttributesObj = getPlatformConnectionCompactViewDataAttributes(
            platformConnectionCompactDiv
        );
        var pcCompactViewTitleElem = $(pcBoxMainElem).find('.fsPlatformConnectionCompact__title');
        console.log(pcDataAttributesObj);
        if (pcDataAttributesObj.RecordId !== undefined && pcDataAttributesObj.RecordId != '') {
            console.log('[updatePlatformConnectionCompactViewTitle] connected.');
            $(pcCompactViewTitleElem).html(platformConnectionConfiguration.connectedTitle);
            updateLogo(pcBoxMainElem, platformConnectionConfiguration.iconLogoConnected);

            if (platformConnectionConfiguration.showAdminSettingsPanelButton) {
                addAdminSettingsPanelButton(platformConnectionCompactDiv);
            }
        } else {
            console.log('[updatePlatformConnectionCompactViewTitle] Not connected.');
            $(pcCompactViewTitleElem).html(platformConnectionConfiguration.notConnectedTitle);
            updateLogo(pcBoxMainElem, platformConnectionConfiguration.iconLogoDisconnected);
        }
    };

    var addAdminSettingsPanelButton = function(pPlatformConnectionCompactDiv) {
        // Hide button to collapse
        var collpaseButton = $(pPlatformConnectionCompactDiv).find(
            '.fsPlatformConnectionCompact__state'
        );
        collpaseButton.hide();
        // Add new Link Button to go to Admin Settings Panel
        var aLinkToAdminSettingsPanel = $('<a />', {
            href:
                '/apex/AdminSettingsPanel?DefaultMenu=integrationSettings&ProviderType=' +
                platformConnectionConfiguration.providerType,
            target: '_blank',
            class: 'fsPlatformConnectionCompact__link'
        });
        aLinkToAdminSettingsPanel.append('Edit in Admin Settings Panel');
        $(collpaseButton).after(aLinkToAdminSettingsPanel);
    };

    var updateLogo = function(pPlatformConnectionMainElement, pNewLogoClass) {
        var logoDivElement = $(pPlatformConnectionMainElement).find(
            '.fsPlatformConnectionCompact__logo'
        );
        var newLogoDivElement = $('<div />', {
            class: 'fsPlatformConnectionCompact__logo ' + pNewLogoClass
        });
        $(logoDivElement).after(newLogoDivElement);
        $(logoDivElement).remove();
    };

    var expandConnectionPicker = function(elemSource) {
        $(elemSource).addClass('fsPlatformConnectionCompact__state--collapsed');
        $(elemSource)
            .parents('.fsPlatformConnectionBox')
            .find('.fsPlatformConnectionDetail')
            .show();
    };

    var collapseConnectionPicker = function(elemSource) {
        $(elemSource).removeClass('fsPlatformConnectionCompact__state--collapsed');
        $(elemSource)
            .parents('.fsPlatformConnectionBox')
            .find('.fsPlatformConnectionDetail')
            .hide();
    };

    var loadOptions = function(pOptions) {
        if (pOptions == undefined) {
            return;
        }

        platformConnectionConfiguration.connectedTitle = pOptions.layout.compactTitleConnected;
        platformConnectionConfiguration.notConnectedTitle =
            pOptions.layout.compactTitleNotConnected;
        platformConnectionConfiguration.detailTextTop = pOptions.layout.detailTextTop;
        platformConnectionConfiguration.detailTextBottom = pOptions.layout.detailTextBottom;

        platformConnectionConfiguration.fields = pOptions.fields;

        platformConnectionConfiguration.providerType = pOptions.providerType;
        platformConnectionConfiguration.saveResponseCallBack = pOptions.saveResponseCallBack;
        platformConnectionConfiguration.iconLogoConnected = pOptions.layout.iconLogoConnected;
        platformConnectionConfiguration.iconLogoDisconnected = pOptions.layout.iconLogoDisconnected;
        platformConnectionConfiguration.showAdminSettingsPanelButton =
            pOptions.layout.showAdminSettingsPanelButton;
    };

    /**
     * Otherwise render picker in collpased form based on data in platformConnectionResponseDTO.Result
     * @param {*} platformConnectionResponseDTO
     * @param {*} parentElement
     */
    var renderConnectionPickerViewWithOptions = function(
        platformConnectionResponseDTO,
        parentElement,
        pOptions
    ) {
        if (parentElement == 'undefined' || parentElement == null) {
            parentElement = $('.fsContentBox');
        }
        var pcBoxMainElem = $(parentElement);
        fs.DSB.hideInlineProcessingIcon($(parentElement).parent());
        pcBoxMainElem.html(getNotificationWrapperElement());
        if (platformConnectionResponseDTO == null || !platformConnectionResponseDTO.IsValid) {
            console.log('[renderConnectionPickerView] platformConnectionResponseDTO');
            console.log(platformConnectionResponseDTO);
            window.showPillMessage_Error(
                fs.Utils.CONSTANTS.uiMessage.somethingWentWrong,
                true,
                getNotificationParentElem()
            );
        } else {
            var isConnectionPopulated = false;
            var connectionPickerWithFormViewDiv = $('<div/>');
            connectionPickerWithFormViewDiv.html(
                platformConnectionConfiguration.connectionPickerWithFormView
            );
            var connectionPickerButtonElem = connectionPickerWithFormViewDiv.find(
                '.fsPlatformConnectionCompact__state'
            );
            collapseConnectionPicker(connectionPickerButtonElem);
            pcBoxMainElem.append(connectionPickerWithFormViewDiv.html());
            bindClickOnToggleConnectionPickerButton(pcBoxMainElem);

            loadOptions(pOptions);
            updatePlatformConnectionDetail(pcBoxMainElem);

            if (platformConnectionResponseDTO.Result != null) {
                isConnectionPopulated = true;
                var platformConnectionObj = platformConnectionResponseDTO.Result;
                var pcDataAttributesObj = new PCAttributeInfo(
                    platformConnectionObj.RecordId,
                    platformConnectionObj.Key,
                    platformConnectionObj.Secret,
                    platformConnectionObj.Name
                );
                setPlatformConnectionCompactViewDataAttributes(
                    pcBoxMainElem.find('.fsPlatformConnectionCompact'),
                    pcDataAttributesObj
                );
                setFieldValue(pcBoxMainElem, 'Key', pcDataAttributesObj.Key);
                setFieldValue(pcBoxMainElem, 'Secret', pcDataAttributesObj.Secret);
            } else {
                isConnectionPopulated = false;
                expandConnectionPicker(pcBoxMainElem.find('.fsPlatformConnectionCompact__state'));
            }

            pOptions && pOptions.layout.showPopup
                ? convertSaveBtnToPopupBtn(pcBoxMainElem, pOptions.providerType)
                : bindClickOnSaveConnectionButton(pcBoxMainElem);
            updatePlatformConnectionCompactViewTitle(pcBoxMainElem);

            if (isConnectionPopulated) {
                var platformConnectionRootElem = pcBoxMainElem.hasClass(
                    'fsStepItem--platformConnection'
                )
                    ? pcBoxMainElem
                    : pcBoxMainElem.find('.fsStepItem--platformConnection');
                if ($(platformConnectionRootElem).length > 0) {
                    console.log('[renderConnectionPickerView] - fsStepItem--platformConnection');
                    // If Platform Connection is embedded in Document Steps Wizard then trigger the document mapping specific event
                    var shouldRenderDocumentSourcemapping = $(platformConnectionRootElem)
                        .parent()
                        .hasClass('stepDetail');
                    if (getSafeBoolean(shouldRenderDocumentSourcemapping, false)) {
                        fs.DSB.renderDocumentSourceMappingSection(platformConnectionRootElem);
                    }
                } else {
                    console.log('[renderConnectionPickerView] No - fsStepItem--platformConnection');
                }
            }
        }
    };

    /**
     * Otherwise render picker in collpased form based on data in platformConnectionResponseDTO.Result
     * @param {*} platformConnectionResponseDTO
     * @param {*} parentElement
     */
    var renderConnectionPickerView = function(platformConnectionResponseDTO, parentElement) {
        var defaultFormstackDocumentOptions = getFormstackDocumentOption();
        renderConnectionPickerViewWithOptions(
            platformConnectionResponseDTO,
            parentElement,
            defaultFormstackDocumentOptions
        );
    };
    var showPlatformConnectionDetail = function(platformConnectionsResponseDTO, pcBoxMainElem) {
        if (pcBoxMainElem == 'undefined' || pcBoxMainElem == null) {
            pcBoxMainElem = $('.fsContentBox');
        }
        if (platformConnectionsResponseDTO == null || !platformConnectionsResponseDTO.IsValid) {
            console.log('[showPlatformConnectionDetail]');
            console.log(platformConnectionsResponseDTO);
            window.showPillMessage_Error(
                fs.Utils.CONSTANTS.uiMessage.somethingWentWrong,
                true,
                pcBoxMainElem
            );
        } else {
            if (platformConnectionsResponseDTO.Result.length > 0) {
                var firstPlatformConnectionObj = platformConnectionsResponseDTO.Result[0];
                fetchPlatformConnectionById(firstPlatformConnectionObj.RecordId, pcBoxMainElem);
            } else {
                var platformConnectionResponseDTOObj = new fs.DTOs.PlatformConnectionDTOProvider.PlatformConnectionResponseDTO();
                platformConnectionResponseDTOObj.IsValid = true;
                platformConnectionResponseDTOObj.Result = null;
                // this is to render form view since we don't have any platform connection
                renderConnectionPickerView(platformConnectionResponseDTOObj, pcBoxMainElem);
            }
        }
    };
    var handleRemoteErrorEvent = function(errorEventObj, pillCompElement) {
        console.log('[handleRemoteError] error below:');
        console.log(errorEventObj);
        if (errorEventObj != null && errorEventObj.type === 'exception') {
            // Display UI Error: with custom error message from back end
            window.showPillMessage_Error(errorEventObj.message, true, pillCompElement);
        } else {
            // Display UI Error: with generic error message
            window.showPillMessage_Error(
                fs.Utils.CONSTANTS.uiMessage.somethingWentWrong,
                true,
                pillCompElement
            );
        }
    };
    var handleRemoteActionCreateOrUpdatePlatformConnection = function(
        responseDTOObj,
        event,
        isUpdateAction,
        parentElement,
        callbackFunction
    ) {
        if (event.status) {
            if (responseDTOObj != null && responseDTOObj.IsValid) {
                if (platformConnectionConfiguration.saveResponseCallBack != undefined) {
                    platformConnectionConfiguration.saveResponseCallBack(
                        responseDTOObj,
                        parentElement
                    );
                } else {
                    var localCallbackFunction =
                        typeof callbackFunction === 'function'
                            ? callbackFunction
                            : remoteGetPlatformConnectionById;

                    fetchPlatformConnectionById(
                        responseDTOObj.Response,
                        parentElement,
                        localCallbackFunction
                    );
                }
            } else {
                console.log('[handleRemoteActionCreatePlatformConnection] responseDTOObj below:');
                console.log(responseDTOObj);
                window.showPillMessage_Error(
                    fs.Utils.CONSTANTS.uiMessage.somethingWentWrong,
                    true,
                    parentElement
                );
            }
        } else {
            throw event;
        }
    };
    var remoteCreatePlatformConnection = function(
        urlToRemoteFunction,
        documentDTOObj,
        parentElement
    ) {
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            documentDTOObj,
            function(result, event) {
                try {
                    handleRemoteActionCreateOrUpdatePlatformConnection(
                        result,
                        event,
                        false,
                        parentElement
                    );
                } catch (error) {
                    handleRemoteErrorEvent(error, parentElement);
                }
            },
            {
                escape: true
            }
        );
    };
    var remoteUpdatePlatformConnection = function(
        urlToRemoteFunction,
        documentDTOObj,
        parentElement
    ) {
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            documentDTOObj,
            function(result, event) {
                try {
                    handleRemoteActionCreateOrUpdatePlatformConnection(
                        result,
                        event,
                        true,
                        parentElement
                    );
                } catch (error) {
                    handleRemoteErrorEvent(error, parentElement);
                }
            },
            {
                escape: true
            }
        );
    };
    var handleRemoteActionGetPlatformConnectionsByProvider = function(
        platformConnectionsResponseDTOObj,
        event,
        parentElement
    ) {
        if (event.status) {
            showPlatformConnectionDetail(platformConnectionsResponseDTOObj, parentElement);
        } else {
            throw event;
        }
    };
    var handleRemoteActionGetPlatformConnectionById = function(
        platformConnectionResponseDTOObj,
        event,
        parentElement
    ) {
        if (event.status) {
            renderConnectionPickerView(platformConnectionResponseDTOObj, parentElement);
        } else {
            throw event;
        }
    };
    var remoteGetPlatformConnectionById = function(urlToRemoteFunction, id, parentElement) {
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            id,
            function(result, event) {
                try {
                    handleRemoteActionGetPlatformConnectionById(result, event, parentElement);
                } catch (error) {
                    handleRemoteErrorEvent(error, parentElement);
                }
            },
            {
                escape: true
            }
        );
    };
    var remoteGetPlatformConnectionsByProvider = function(
        urlToRemoteFunction,
        providerType,
        parentElement
    ) {
        window.Visualforce.remoting.Manager.invokeAction(
            urlToRemoteFunction,
            providerType,
            function(result, event) {
                try {
                    handleRemoteActionGetPlatformConnectionsByProvider(
                        result,
                        event,
                        parentElement
                    );
                } catch (error) {
                    handleRemoteErrorEvent(error, parentElement);
                }
            },
            {
                escape: true
            }
        );
    };
    /**
     * Create new Platform connection
     * @param {PlatformConnectionDTO} platformConnectionDTOObj
     * @param {*} parentElement
     * @param {Function} callbackFunction
     */
    var createPlatformConnection = function(
        platformConnectionDTOObj,
        parentElement,
        callbackFunction
    ) {
        var localCallbackFunction =
            typeof callbackFunction === 'function'
                ? callbackFunction
                : remoteCreatePlatformConnection;
        var urlCreatePlatformConnection =
            window.REMOTE_ACTIONS.PlatformConnectionController.createPlatformConnection;
        localCallbackFunction(urlCreatePlatformConnection, platformConnectionDTOObj, parentElement);
    };
    /**
     * Update Platform connection
     * @param {PlatformConnectionDTO} platformConnectionDTOObj
     * @param {Function} callbackFunction
     */
    var updatePlatformConnection = function(
        platformConnectionDTOObj,
        parentElement,
        callbackFunction
    ) {
        var localCallbackFunction =
            typeof callbackFunction === 'function'
                ? callbackFunction
                : remoteUpdatePlatformConnection;
        var urlCreatePlatformConnection =
            window.REMOTE_ACTIONS.PlatformConnectionController.updatePlatformConnection;
        localCallbackFunction(urlCreatePlatformConnection, platformConnectionDTOObj, parentElement);
    };
    /**
     * Fetch existing platform connections from Backend
     * @param {*} providerType
     * @param {Function} callbackFunction
     */
    var fetchPlatformConnectionsByProvider = function(
        providerType,
        parentElement,
        callbackFunction
    ) {
        var localCallbackFunction =
            typeof callbackFunction === 'function'
                ? callbackFunction
                : remoteGetPlatformConnectionsByProvider;
        var urlGetPlatformConnectionsByProvider =
            window.REMOTE_ACTIONS.PlatformConnectionController.getPlatformConnectionsByProvider;
        localCallbackFunction(urlGetPlatformConnectionsByProvider, providerType, parentElement);
    };
    /**
     *
     * @param {*} id
     * @param {Function} callbackFunction
     */
    var fetchPlatformConnectionById = function(id, parentElement, callbackFunction) {
        var localCallbackFunction =
            typeof callbackFunction === 'function'
                ? callbackFunction
                : remoteGetPlatformConnectionById;
        var urlGetPlatformConnectionById =
            window.REMOTE_ACTIONS.PlatformConnectionController.getPlatformConnectionById;
        localCallbackFunction(urlGetPlatformConnectionById, id, parentElement);
    };

    var setFieldValue = function(pcBoxMainElem, pPlatformAccountFieldName, pValue) {
        var fieldElement = $(pcBoxMainElem).find(
            '[data-platformaccountfield=' + pPlatformAccountFieldName + ']'
        );
        fieldElement.val(pValue);
    };

    var getFieldValue = function(pcBoxMainElem, pPlatformAccountFieldName) {
        var fieldElement = $(pcBoxMainElem).find(
            '[data-platformaccountfield=' + pPlatformAccountFieldName + ']'
        );
        if (fieldElement != null && fieldElement != undefined) {
            return fieldElement.val();
        } else {
            return '';
        }
    };

    var addListFieldsInComponent = function(pcBoxMainElem, pListFields) {
        pcBoxMainElem
            .find('.fsPlatformConnectionDetail .fsForm > .fsFormRow:not(.fsFormButtonRow)')
            .remove();
        var fieldSaveButtonRow = pcBoxMainElem
            .find('.fsPlatformConnectionDetail .fsForm .fsBtn')
            .parent();

        for (let indexField = 0; indexField < pListFields.length; indexField++) {
            const fieldConfig = pListFields[indexField];

            var newField = getNewFieldForCredentialBox(
                fieldConfig.fieldPlatformAccountFieldName,
                fieldConfig.fieldLabel,
                fieldConfig.fieldIsRequired,
                fieldConfig.fieldIsPasswordType,
                fieldConfig.fieldPlatformAccountFieldName,
                fieldConfig.jsonVal,
                fieldConfig.selectOptions,
                fieldConfig.hidden
            );

            fieldSaveButtonRow.before(newField);
            //Render Selects with $.select2()
            var selectFields = newField.find('select');
            if (selectFields.length) {
                selectFields.css({ marginLeft: '49px', width: '60.7%' });
                selectFields.select2();
            }
        }
    };

    var getNewFieldForCredentialBox = function(
        pIdentificator,
        pLabelText,
        pIsRequired,
        pIsPassword,
        pPlatformAccountField,
        pJsonVal,
        selectOptions,
        hidden
    ) {
        var inputFieldIndetificator = 'text' + pIdentificator;

        var labelField = getNewLabelElement('fsLabel lblAPIKey', pLabelText);
        labelField.attr('for', inputFieldIndetificator);
        if (pIsRequired) {
            labelField.append(getNewRequiredSpanElement());
        }

        var inputType = pIsPassword == true ? 'password' : 'text';
        var inputField = selectOptions
            ? getNewSelectElement(selectOptions)
            : getNewInputElement('fsInput fsInput--text', inputType);
        inputField.attr('id', inputFieldIndetificator);
        inputField.attr('data-platformaccountfield', pPlatformAccountField);
        inputField.attr('data-jsonval', pJsonVal);

        var newRow = getNewfsFormRow();
        newRow.append(labelField);
        newRow.append(inputField);

        if (hidden) {
            newRow[0].style.display = 'none';
        }

        return newRow;
    };

    var getNewfsFormRow = function() {
        var fsFormRow = $('<div />', { class: 'fsFormRow' });
        return fsFormRow;
    };

    var getNewInputElement = function(pClass, pType) {
        var fsInputField = $('<input />', { class: pClass, type: pType });
        return fsInputField;
    };

    var getNewLabelElement = function(pClass, pText) {
        var fsLabelElement = $('<label />', { class: pClass });
        fsLabelElement.append(pText);
        return fsLabelElement;
    };

    var getNewRequiredSpanElement = function() {
        var fsRequiredSpanElement = $('<span />', { class: 'fsLabel__req' });
        fsRequiredSpanElement.append('*');
        return fsRequiredSpanElement;
    };

    var getNewSelectElement = function(pOptions) {
        var selectElement = document.createElement('select');
        //Iterate through the pOptions argument to generate the choices:
        for (var i in pOptions) {
            selectElement.appendChild($('<option>' + pOptions[i] + '<option />').val(i)[0]);
        }
        return $(selectElement);
    };

    var getFormstackDocumentOption = function() {
        var options = {
            providerType: enumProviderType.FormstackDocuments,
            saveResponseCallBack: undefined,
            layout: {
                compactTitleConnected: 'Connect to Formstack Documents',
                compactTitleNotConnected: 'Connected to Formstack Documents',
                detailTextTop:
                    'Let\'s start by connecting to Formstack Documents (formerly Webmerge). <a href="#">Learn More</a>',
                detailTextBottom: '',
                iconLogoConnected: 'fsPlatformConnectionCompact__logo--document',
                iconLogoDisconnected: 'fsPlatformConnectionCompact__logo--document',
                showAdminSettingsPanelButton: false
            },
            fields: [
                {
                    fieldLabel: 'Api Key',
                    fieldIsRequired: true,
                    fieldIsPasswordType: true,
                    fieldPlatformAccountFieldName: 'Key'
                },
                {
                    fieldLabel: 'Api Secret',
                    fieldIsRequired: true,
                    fieldIsPasswordType: true,
                    fieldPlatformAccountFieldName: 'Secret'
                }
            ]
        };

        return options;
    };

    var _unitTesting = {
        handleRemoteActionGetPlatformConnectionById: handleRemoteActionGetPlatformConnectionById,
        handleRemoteActionGetPlatformConnectionsByProvider: handleRemoteActionGetPlatformConnectionsByProvider,
        handleRemoteActionCreateOrUpdatePlatformConnection: handleRemoteActionCreateOrUpdatePlatformConnection
    };
    var _PlatformConnection = {
        enumProviderType: enumProviderType,
        fetchPlatformConnectionById: fetchPlatformConnectionById,
        fetchPlatformConnectionsByProvider: fetchPlatformConnectionsByProvider,
        createPlatformConnection: createPlatformConnection,
        updatePlatformConnection: updatePlatformConnection,
        renderConnectionPickerView: renderConnectionPickerView,
        renderConnectionPickerViewWithOptions: renderConnectionPickerViewWithOptions,
        getPlatformConnectionCompactViewDataAttributes: getPlatformConnectionCompactViewDataAttributes,
        __testing__: _unitTesting
    };
    return {
        PlatformConnection: _PlatformConnection,
        PC: _PlatformConnection
    };
});
