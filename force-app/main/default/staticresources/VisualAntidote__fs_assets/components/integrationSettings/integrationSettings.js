/**
 * @author Zachary Mitchell
 * @summary In order to handle files larger then 2.6MB (salesforce limitation), we need an interface that will let users use other services like dropbox to store files. This will also support modifying credentials for the documents integration as well.
 */

(function(root, window, factoryMethod) {
    //This is used to communicate to node.js & mocha for testing:
    if (typeof module == 'object' && typeof module.exports == 'object') {
        module.exports = function(externalRoot, externalWindow) {
            //Since module.exports is a function here, we can use that to return some bonus variables for testing:
            return (externalRoot.integrationSettings = externalRoot.ISP = factoryMethod(
                externalRoot,
                externalWindow,
                true
            ));
        };
    } else {
        //Root is where our jQuery lives. In other files, we also seem to use this as a way to hide values like a namespace.
        //Window is here for whenever we run test cases; we use JSDOM as our primary window there.
        root.integrationSettings = root.ISP = factoryMethod(root, window); //Run things in this scope once. Some things can be called by external sources such as event listeners.
    }
})(
    typeof fs == 'undefined' ? {} : fs,
    typeof window == 'undefined' ? this : window,
    (root, window, isModuleExports) => {
        //If there are values that need to be moved to another scope, place them here:
        var localScope = {
            //Define all types of accounts here. If this gets too large in the future, keep it portable enough to extract via JSON instead!
            accountTypes: {
                //Azure
                Azure: {
                    name: 'Azure Blob',
                    //What will show as the header. The name value above is like a "short name". Inserting null here will just use name.
                    header: null,
                    //The name we use on the salesforce side to define this integration. null means to look at the "name" value (see header)
                    internalName: 'Azure',
                    //A pre-determined icon found in integrationSettings.css (this component's stylesheet) Setting to null will render default icon.
                    icon: 'azureIcon',
                    // to hide the element from page without disable it
                    showUpdateButton: true,
                    supportUrl:
                        'https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#AzureAccount',
                    /*Define as many fields as you need the user to fill in here. The order defined here will match where it goes in the gui.
                        --Note-- Booleans are optional, by default if it doesn't exist, it will be considered "false"
                        <object key>: This is what salesforce needs to update this field. (See PlatformConnectionDTOProvider.cls for a reference)
                        guiLabel: The user see's this label to identify what to insert (e.g "Api key")
                        fieldType: The HTML attribute "type" for the input box. In other words, anything as defined here: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types
                        required: prevent the end-user from submitting the information without this field
                        jsonVal: Determines if the value goes into "PlatformConnectionDTO.FieldConfiguration". Not all configs need this, just ones that go beyond key & secret*/
                    inputFields: {
                        Secret: {
                            guiLabel: 'Account Name',
                            fieldType: '',
                            required: true,
                            jsonVal: false
                        },
                        Key: {
                            guiLabel: 'Secret Key',
                            fieldType: 'password',
                            required: true,
                            jsonVal: false
                        }
                    }
                },
                //Amazon Web Services
                AWSS3: {
                    name: 'AWS',
                    header: 'Amazon Web Services',
                    internalName: null,
                    icon: 'awsIcon',
                    supportUrl:
                        'https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#AWSAccount',
                    inputFields: {
                        Key: {
                            guiLabel: 'Access Key ID',
                            fieldType: '',
                            required: true,
                            jsonVal: false
                        },
                        Secret: {
                            guiLabel: 'Secret Access Key',
                            fieldType: 'password',
                            required: true,
                            jsonVal: false
                        },
                        Region: {
                            guiLabel: 'Region',
                            fieldType: 'select',
                            required: true,
                            jsonVal: true,
                            options:
                                '{ "options": [{ "value": "APEast1", "name": "Asia Pacific (Hong Kong)" }, { "value": "APNortheast1", "name": "Asia Pacific (Tokyo)" }, { "value": "APNortheast2", "name": "Asia Pacific (Seoul)" },{ "value": "APNortheast3", "name": "Asia Pacific (Osaka-Local)" }, { "value": "APSouth1", "name": "Asia Pacific (Mumbai)" }, { "value": "APSoutheast1", "name": "Asia Pacific (Singapore)" }, { "value": "APSoutheast2", "name": "Asia Pacific (Sydney)" }, { "value": "CACentral1", "name": "Canada (Central)" },{ "value": "CNNorth1", "name": "China (Beijing)" },{ "value": "CNNorthWest1", "name": "China (Ningxia)" }, { "value": "EUCentral1", "name": "EU (Frankfurt)" }, { "value": "EUNorth1", "name": "EU (Stockholm)" }, { "value": "EUWest1", "name": "EU (Ireland)" }, { "value": "EUWest2", "name": "EU (London)" }, { "value": "EUWest3", "name": "EU (Paris)" }, { "value": "MESouth1", "name": "Middle East (Bahrain)" }, { "value": "SAEast1", "name": "South America (Sao Paulo)" }, { "value": "USEast1", "name": "US East (N. Virginia)" }, { "value": "USEast2", "name": "US East (Ohio)" }, { "value": "USGovCloudEast1", "name": "US GovCloud East (Virginia)" }, { "value": "USGovCloudWest1", "name": "US GovCloud West (Oregon)" }, { "value": "USWest1", "name": "US West (N. California)" }, { "value": "USWest2", "name": "US West (Oregon)" }] }'
                        }
                    }
                },
                //Dropbox
                Dropbox: {
                    name: 'Dropbox',
                    header: null,
                    internalName: null,
                    icon: 'dropbox',
                    supportUrl:
                        'https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#DropBoxAccount',
                    inputFields: {
                        Email: {
                            guiLabel: 'You have granted Formstack access to your Dropbox account:',
                            fieldType: 'label',
                            required: false,
                            jsonVal: true
                        },
                        Key: {
                            guiLabel: '',
                            fieldType: 'hidden',
                            required: false,
                            jsonVal: false
                        }
                    },
                    showUpdateButton: false,
                    button: {
                        ButtonText: 'Log in with a different account',
                        id: 'btn2233',
                        class: 'fsbutton flotLeft',
                        onClick: 'fsLightbox2233.reload();',
                        type: 'hyperlink',
                        href: '',
                        fsFunction:
                            'window.addEventListener("message", (event)=>{ fs.ISP.tokenReceiver(this,event);});',
                        javascript: {
                            type: 'fsLightbox',
                            functionName: 'fsLightbox2233',
                            form: '2233',
                            handleText: 'Connected to Dropbox',
                            handlePosition: 'left',
                            handleImage: '',
                            handle: null,
                            iframe: {
                                id: '2233',
                                src: '',
                                title: 'Connected to Dropbox'
                            }
                        }
                    }
                },
                //Formstack Documents
                FormstackDocuments: {
                    name: 'Formstack Documents',
                    header: null,
                    internalName: 'FormstackDocuments',
                    icon: 'formstackDocuments',
                    showUpdateButton: true,
                    supportUrl:
                        'https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#FormstackDocumentAccount',
                    inputFields: {
                        Key: {
                            guiLabel: 'Api Key',
                            fieldType: 'password',
                            required: true,
                            jsonVal: false
                        },
                        Secret: {
                            guiLabel: 'Api Secret',
                            fieldType: 'password',
                            required: true,
                            jsonVal: false
                        }
                    }
                },
                //Formstack Stash
                Stash: {
                    name: 'Stash',
                    header: 'Stash (By Formstack)',
                    internalName: null,
                    icon: 'stashIcon',
                    showUpdateButton: true,
                    supportUrl:
                        'https://sfapphelp.formstack.com/hc/en-us/articles/360018681752-File-Upload-Field#StashAccount',
                    inputFields: {
                        Secret: {
                            guiLabel: 'Account Name',
                            fieldType: '',
                            required: true,
                            jsonVal: false
                        },
                        Key: {
                            guiLabel: 'Secret Key',
                            fieldType: 'password',
                            required: true,
                            jsonVal: false
                        }
                    }
                },
                //If there's no configuration for an integration yet, we can display this:
                default: {
                    name: 'Integration',
                    header: null,
                    internalName: null,
                    icon: '',
                    supportUrl: '',
                    showUpdateButton: true,
                    inputFields: {
                        Key: { guiLabel: 'Account Id', fieldType: '', required: true },
                        Secret: {
                            guiLabel: 'Password',
                            fieldType: 'password',
                            required: true,
                            jsonVal: false
                        }
                    }
                }
            }
        };
        function setDropboxEngineEndpoint(endpoint) {
            localScope.accountTypes.Dropbox.button.href =
                'https://www.dropbox.com/oauth2/authorize?client_id=' +
                window.dropboxKey +
                '&response_type=code&redirect_uri=' +
                endpoint +
                '/Integration/IntegrationAuthorized';
            localScope.accountTypes.Dropbox.button.javascript.iframe.src =
                endpoint + '/Integration/AuthorizeIntegration?IntegrationType=Dropbox';
        }

        var tokenReceiver = function(componentContainer, event) {
            console.log('[AdminSetting] We got a message!');
            if (event.data == undefined) {
                return;
            }

            if (event.data.isValid == undefined) {
                return;
            }

            var response = event.data;
            if (response.isValid) {
                console.log('Saving the Code!');
                var fieldKey = {};
                fieldKey['Key'] = response.token;
                fieldKey['Email'] = response.userEmail;
                setFields(componentContainer, fieldKey);
            } else {
                console.log('message is Invalid!');
                console.log('response[' + response + ']');
            }

            $(window).off('message');
        };
        //It's possible to reference the integration objects through a private context so they can be hidden. Whenever a new integration is defined, it can be obtained here.
        var loadedIntegrations = new Map();

        function makeAccountDom(targetObj) {
            var fieldStr = '';
            for (var i in targetObj.inputFields) {
                var currField = targetObj.inputFields[i];
                if (currField.fieldType == 'select') {
                    var jsonOptions = JSON.parse(currField.options);
                    var options = getSelectFieldOptions(jsonOptions);
                    fieldStr +=
                        '<tr><td class="credentialTable__labelColumn">' +
                        currField.guiLabel +
                        (currField.required ? '<span class="ff-required-mark">*</span>' : '') +
                        '</td><td ><select class="inputField ' +
                        i +
                        '"/>' +
                        options +
                        '</select></td></tr>';
                } else if (currField.fieldType == 'label') {
                    fieldStr +=
                        '<tr><td>' +
                        currField.guiLabel +
                        (currField.required ? '<span class="ff-required-mark">*</span>' : '') +
                        '</td><td><label class="readOnly inputField ' +
                        i +
                        '" type="' +
                        currField.fieldType +
                        '" readonly /></td></tr>';
                } else if (currField.fieldType == 'hidden') {
                    fieldStr +=
                        '<tr style="display:none"><td>' +
                        currField.guiLabel +
                        (currField.required ? '<span class="ff-required-mark">*</span>' : '') +
                        '</td><td><input class="inputField ' +
                        i +
                        '" type="' +
                        currField.fieldType +
                        '"/></td></tr>';
                } else {
                    fieldStr +=
                        '<tr><td class="credentialTable__labelColumn">' +
                        currField.guiLabel +
                        (currField.required ? '<span class="ff-required-mark">*</span>' : '') +
                        '</td><td><input class="inputField ' +
                        i +
                        '" type="' +
                        currField.fieldType +
                        '"/></td></tr>';
                }
            }

            var result = window.document.createElement('div');
            var headerStr = targetObj.header ? targetObj.header : targetObj.name;
            result.className = 'integrationBlockContainer';
            result.innerHTML =
                `<div class="integrationDiv">
                <table>
                    <tbody>
                        <tr>
                            <td title="` +
                headerStr +
                `" class="iDivIcon ` +
                (targetObj.icon ? targetObj.icon : 'default') +
                `"></td>
                            <td class='connectionMsg'>Connected to ` +
                headerStr +
                `</td>
                            <td class='arrowBtn expandButton' tabindex="0"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="rightHandContainer">
                    <span class="lastUpdated"></span>
                    <div class='iDivIcon delete' tabindex="0"></div>
                </div>
            </div>
            <div class="integrationExpandBox" style='display:none'>
                ` +
                (targetObj.supportUrl
                    ? "<div class='supportPageInfo'>For more information on " +
                      targetObj.name +
                      " integration check out the <a href='" +
                      targetObj.supportUrl +
                      "' target='_blank'>support page</a></div>"
                    : '') +
                `<table class='credentialTable'>
                    <tbody>` +
                fieldStr +
                `
                    </tbody>
                </table>
                ` +
                addButtonInComponent(targetObj) +
                `
            </div>
            
        </div>`;
            //Show/hide credential window:
            result
                .getElementsByClassName('arrowBtn')[0]
                .addEventListener('click', domListeners.arrowBtnClick);
            result.dataset.integrationName = targetObj.name;
            return result;
        }
        var getSelectFieldOptions = function(jsonOptions) {
            var options = '';
            var index, jsonLength;
            jsonLength = jsonOptions.options.length;
            for (index = 0; index < jsonLength; index++) {
                options +=
                    '<option value = ' +
                    jsonOptions.options[index].value +
                    '> ' +
                    jsonOptions.options[index].name +
                    ' </option>';
            }
            return options;
        };

        var addButtonInComponent = function(targetObj) {
            if (!!targetObj) {
                var fieldStr = '';

                if (targetObj.showUpdateButton == false) {
                    fieldStr += `<button type="button" class='displaynone fsbutton fsbuttonUpdate ' tabindex="0">Update</button>`;
                } else {
                    fieldStr += `<button type="button" class='fsbutton fsbuttonUpdate' tabindex="0">Update</button>`;
                }

                if (!!targetObj.button) {
                    fieldStr += getNewButtonForCredentialBox(targetObj.button);
                }

                return fieldStr;
            }
        };
        var getNewButtonForCredentialBox = function(pButton) {
            if (pButton) {
                var fieldStr = '';
                if (pButton.type == 'hyperlink') {
                    var buttonField = $('<a />', { class: pButton.class });
                    var buttonText = $('<span />', {
                        class: 'fsBtn__text',
                        text: pButton.ButtonText
                    });
                    buttonField.attr('id', pButton.id);
                    buttonField.attr('href', pButton.href);
                    buttonField.attr('onClick', pButton.onClick);
                    buttonField.append(buttonText);
                    buttonField.attr('target', '_blank');

                    if (pButton.javascript.type == 'fsLightbox') {
                        // create iframe
                        var iFrame = initIframe(pButton.javascript.iframe);
                        delete pButton.javascript.iframe;
                        var fsLightboxObject = JSON.stringify(pButton.javascript);
                        buttonField.attr('fsEvent', fsLightboxObject);
                        buttonField.attr('fsFunction', pButton.fsFunction);

                        fieldStr += iFrame.outerHTML;
                    }
                    fieldStr += buttonField[0].outerHTML;
                }
                return fieldStr;
            }
        };

        /*Each listener will reference their origin in order to get things like retrieval url and service responses.
     In order to test this offline, two versions of the listeners exist: prod and test.*/
        var eventListeners = {
            //Prod functions are intended to be run on "AdminSettingsPanel.page". As such, you will see references pertaining to functionality there.
            prod: {
                getIntegrations: function(postFunction = () => {}) {
                    window.Visualforce.remoting.Manager.invokeAction(
                        window.REMOTE_ACTIONS.getAllIntegrations,
                        function(responseBody, statusInfo) {
                            var responseInfo = {
                                httpStatus: 0,
                                serviceInformation: []
                            };
                            if (statusInfo.status) {
                                responseInfo.httpStatus = statusInfo.statusCode;
                                for (var i in responseBody.Result) {
                                    if (typeof responseBody.Result[i] == 'object') {
                                        responseInfo.serviceInformation.push(
                                            responseBody.Result[i]
                                        );
                                    }
                                }
                            } else responseInfo.message = statusInfo.message;

                            postFunction(responseInfo);
                        }
                    );
                },
                updateIntegration: function(targetIntegration) {
                    //Create an object to send:
                    var fieldList = Object.keys(targetIntegration.iDivTemplate.inputFields);
                    var updatedIntegration = {
                        RecordId: targetIntegration.serviceInformation.RecordId,
                        ProviderType: targetIntegration.serviceInformation.ProviderType,
                        IsActive: targetIntegration.serviceInformation.IsActive
                    };

                    var requiredStr = '';
                    let fieldConfiguration = {};
                    /*clone FieldConfiguration to  remove all JsonValue == false element to create a json value for
                    field configuration with less logic*/
                    if (typeof updatedIntegration['FieldConfiguration'] == 'undefined') {
                        updatedIntegration['FieldConfiguration'] = '';
                    }
                    //Iterate through input fields to grab values. This ensures they will stay the same if tampered with.
                    for (var index = 0; index < fieldList.length; index++) {
                        var fieldname = fieldList[index];
                        var iDivTemplate = targetIntegration.iDivTemplate.inputFields[fieldname];

                        if (isJsonVal(iDivTemplate) == false) {
                            updatedIntegration[
                                fieldname
                            ] = targetIntegration.dom.getElementsByClassName(
                                'inputField ' + fieldname
                            )[0].value;
                        } else {
                            if (iDivTemplate.fieldType == 'select') {
                                // If it is jSON, it should be a select, select should use select2, which we should get the select2-offscreen.
                                fieldConfiguration[
                                    fieldname
                                ] = targetIntegration.dom.getElementsByClassName(
                                    'inputField ' +
                                        fieldname +
                                        (iDivTemplate.jsonVal ? ' select2-offscreen' : '')
                                )[0].value;
                            } else {
                                fieldConfiguration[
                                    fieldname
                                ] = targetIntegration.dom.getElementsByClassName(
                                    'inputField ' + fieldname
                                )[0].value;
                            }
                        }

                        //This block checks if the field is empty or is simply the spacebar hit x amount of times.
                        if (
                            (typeof updatedIntegration[fieldname] != 'undefined' &&
                                !updatedIntegration[fieldname].split(' ').join('').length &&
                                iDivTemplate.required) ||
                            (typeof fieldConfiguration[fieldname] != 'undefined' &&
                                !fieldConfiguration[fieldname].split(' ').join('').length &&
                                iDivTemplate.required)
                        ) {
                            requiredStr += (requiredStr.length ? ', ' : '') + iDivTemplate.guiLabel;
                        }
                    }

                    updatedIntegration['FieldConfiguration'] = JSON.stringify(fieldConfiguration);
                    if (!!updatedIntegration['FieldConfiguration'].length) {
                        // to load the value after the response comes through
                        fieldList.push('FieldConfiguration');
                    }
                    if (requiredStr.length) {
                        //The user didn't place everything in yet, so the function ends here:
                        var statusMessage =
                            'The following fields are required to update ' +
                            targetIntegration.iDivTemplate.name +
                            ': ' +
                            requiredStr;
                        updatedIntegration.message = statusMessage;
                        updatedIntegration.httpStatus = 400;
                        targetIntegration.updateDomInformation(updatedIntegration);

                        window.showPillMessage_Error(
                            statusMessage,
                            true,
                            window.document.getElementsByClassName('integrationPillMessage')[0]
                        );
                        return;
                    }

                    window.Visualforce.remoting.Manager.invokeAction(
                        window.REMOTE_ACTIONS.updateIntegration,
                        updatedIntegration,
                        function(responseBody, statusInfo) {
                            var updatedServiceInfo = {
                                httpStatus: statusInfo.status ? statusInfo.statusCode : false,
                                message: statusInfo.message
                            };
                            //After the response comes through, insert the correct values back:
                            fieldList.forEach(e => (updatedServiceInfo[e] = updatedIntegration[e]));

                            if (responseBody) {
                                updatedServiceInfo.ModifiedBy = responseBody.Result.ModifiedBy;
                                updatedServiceInfo.LastModified = responseBody.Result.LastModified;
                                updatedServiceInfo.ModifiedByUserId =
                                    responseBody.Result.ModifiedByUserId;
                            }

                            targetIntegration.updateDomInformation(
                                updatedServiceInfo,
                                !responseBody
                            );

                            if (responseBody) {
                                if (isNativeCloudTier()) {
                                    // Native we don't send any info to .net, bc we use the object info.
                                    showSavedSuccessMessage(targetIntegration);
                                } else {
                                    console.log('Integration saved in Salesforce, saving in Azure');
                                    targetIntegration.listenerCollection.publishIntegration(
                                        targetIntegration
                                    );
                                }
                            } else {
                                showSavedErrorMessage(targetIntegration);
                            }
                        }
                    );
                },
                publishIntegration: function(targetIntegration) {
                    window.Visualforce.remoting.Manager.invokeAction(
                        window.REMOTE_ACTIONS.publishIntegration,
                        targetIntegration.serviceInformation.RecordId,
                        function(responseBody, statusInfo) {
                            console.log('[publishIntegration] Response[' + responseBody + ']');
                            if (responseBody) {
                                showSavedSuccessMessage(targetIntegration);
                            } else {
                                showSavedErrorMessage(targetIntegration);
                            }
                        }
                    );
                },
                deleteIntegration: function(targetIntegration) {
                    window.Visualforce.remoting.Manager.invokeAction(
                        window.REMOTE_ACTIONS.deleteIntegration,
                        targetIntegration.serviceInformation.RecordId,
                        function(responseBody, statusInfo) {
                            if (responseBody) {
                                if (responseBody.IsValid == false) {
                                    //Integration is in Use by other forms
                                    var sentences = responseBody.ErrorMessage.replace(
                                        /([.?!])\s*(?=[A-Z])/g,
                                        '$1|'
                                    ).split('|');

                                    window.commonAlertMessage(sentences[0], sentences[1], 'OK');
                                } else if (responseBody.IsValid == true) {
                                    //It was deleted, update the GUI to reflect that
                                    var integrationName = targetIntegration.iDivTemplate.name;
                                    targetIntegration.delete();
                                    window.showPillMessage_Success(
                                        'Successfully removed ' + integrationName,
                                        true,
                                        window.document.getElementsByClassName(
                                            'integrationPillMessage'
                                        )[0]
                                    );
                                }
                            } else
                                window.showPillMessage_Error(
                                    'There was a problem deleting the integration, please try again later.',
                                    true,
                                    window.document.getElementsByClassName(
                                        'integrationPillMessage'
                                    )[0]
                                );
                        }
                    );
                }
            },

            //These can be used offline to make development faster.
            test:
                typeof root.ISP == 'object' && typeof root.ISP.__testFunctions == 'function'
                    ? new root.ISP.__testFunctions(localScope)
                    : {}
        };

        //Start from any element inside an "integrationContainer", and go up the parent tree until we find it.
        function getIntegrationObjectByDom(targetElement) {
            var rootBlockContainer = targetElement;
            while (
                rootBlockContainer.className.indexOf('integrationContainer') == -1 ||
                rootBlockContainer.tagName == 'BODY'
            ) {
                rootBlockContainer = rootBlockContainer.parentElement;
            }

            return rootBlockContainer.tagName == 'BODY'
                ? undefined
                : loadedIntegrations.get(rootBlockContainer);
        }

        //Listners that involve the displaying of the dom:
        var domListeners = {
            arrowBtnClick: function() {
                var expand = this.className.indexOf('expandButton') > -1;
                this.classList.remove(expand ? 'expandButton' : 'contractButton');
                this.classList.add(!expand ? 'expandButton' : 'contractButton');

                //Copy of getIntegrationObjectByDom but just for getting the dom itself
                var rootBlockContainer = this.parentElement;
                while (
                    rootBlockContainer.className.indexOf('integrationContainer') == -1 ||
                    rootBlockContainer.tagName == 'BODY'
                ) {
                    rootBlockContainer = rootBlockContainer.parentElement;
                }

                rootBlockContainer.getElementsByClassName(
                    'integrationExpandBox'
                )[0].style.display = expand ? 'block' : 'none';
                getIntegrationObjectByDom(this)
                    .dom.getElementsByClassName('integrationDiv')[0]
                    .classList[expand ? 'add' : 'remove']('iDivExpanded');
            },
            integrationUpdateBtn: function(evt) {
                //This wound up being in a form tag, so this will avoid the "form" from being submitted
                evt.preventDefault();
                domListeners.integrationUpdate(getIntegrationObjectByDom(this));
            },
            inputFieldChangeIntegrationUpdate: function(evt) {
                if (evt.key == 'Enter') {
                    domListeners.integrationUpdate(getIntegrationObjectByDom(this));
                }
            },

            //The keydown listener and button listeners were fragmented before... time to merge the logic into one!
            integrationUpdate: function(targetIntegration) {
                /*The reason the function is wired this way is because of a few things
                1. It makes sure we're launching the correct set of functions, whether that be testing or production functions.
                2. The scope here should work as long as the function is defined here and not while the dom element isn't being initialized.
                    This also stops people from executing the updateIntegration() without permission and inserting random values.
                3. Defining it here allows the function to be referenced and not accumulate memory.*/
                var updateBtn = targetIntegration.dom.getElementsByClassName('fsbuttonUpdate')[0];
                var isUpdated = false;
                if (updateBtn.className.indexOf('disabled') == -1) {
                    //check to see if any of the fields were updated:
                    for (var i in targetIntegration.iDivTemplate.inputFields) {
                        if (
                            isJsonVal(targetIntegration.iDivTemplate.inputFields[i]) == false &&
                            typeof targetIntegration.serviceInformation[i] != 'undefined' &&
                            targetIntegration.serviceInformation[i] !=
                                targetIntegration.dom.getElementsByClassName('inputField ' + i)[0]
                                    .value
                        ) {
                            isUpdated = true;
                        } else if (
                            isJsonVal(targetIntegration.iDivTemplate.inputFields[i]) == true
                        ) {
                            var jsonFieldConfiguration;
                            if (
                                typeof targetIntegration.serviceInformation['FieldConfiguration'] ==
                                'string'
                            ) {
                                jsonFieldConfiguration = JSON.parse(
                                    unescapeHTMLString(
                                        targetIntegration.serviceInformation['FieldConfiguration']
                                    )
                                );
                            } else {
                                // TODO: For testing
                                jsonFieldConfiguration =
                                    targetIntegration.serviceInformation['FieldConfiguration'];
                            }
                            if (
                                typeof jsonFieldConfiguration[i] == undefined ||
                                typeof jsonFieldConfiguration == 'undefined' || // to insert new Field config
                                (typeof jsonFieldConfiguration != 'undefined' &&
                                    jsonFieldConfiguration[i] !=
                                        targetIntegration.dom.getElementsByClassName(
                                            'inputField ' + i
                                        )[0].value)
                            ) {
                                isUpdated = true;
                            }
                        }
                    }
                }
                var updateBtn = targetIntegration.dom.getElementsByClassName('fsbutton')[0];

                if (updateBtn.className.indexOf('disabled') != -1) {
                    // If button is disabled we don't do anything.
                    return;
                }

                //Do this first, or the button will be disbaled forever :(
                if (isUpdated == true) {
                    updateBtn.classList.add('disabled');
                    //Find the root object:
                    targetIntegration.listenerCollection.updateIntegration(targetIntegration);
                }
            },
            integrationDeleteBtn: function() {
                //Two methods are available in the event the standard callback isn't there:
                var message = 'Are you sure you want to delete this integration account?';
                var yesAction = () => {
                    var targetIntegration = getIntegrationObjectByDom(this);
                    targetIntegration.listenerCollection.deleteIntegration(targetIntegration);
                };
                if (typeof confirmDialogWithCallback == 'function') {
                    confirmDialogWithCallback(message, '', {}, yesAction);
                } else if (confirm(message)) {
                    yesAction();
                }
            },
            //Some "buttons" arn't real, this restores some functionality:
            pseudoButton: function(evt) {
                if (['Enter', ' '].indexOf(evt.key) > -1) {
                    evt.preventDefault();
                    evt.target.click();
                }
            }
        };

        /*The serviceInformation Object is the response that was received by salesforce; specifically our query for a Platform_Account__c.
        It has many variables that are not directly referenced here, so here's a description of the important stuff:
        
        ProviderType - Name of the integration being rendered (e.g Dropbox, Stash)
        LastModified - The platform account's last modified date provided by the SObject itself.
        ModifiedByUserId - an SObject Id linking to the salesforce user that last changed the account.
        ModifiedBy - Name of the user that changed the account

        Other variables that can be retrieved are also polled for based on the iDivTemplate configuration.
        These will become fields that can be changed by the user. (See "localScope.accountTypes.Azure.inputFields" for more info)*/
        function integrationObject(iDivTemplate, serviceInformation, useTestListeners = false) {
            this.iDivTemplate = iDivTemplate;
            this.serviceInformation = serviceInformation;

            //Based on this, there will be a DOM element that we will have full control over from here:
            this.dom = makeAccountDom(this.iDivTemplate);

            //This container holds the name of the integration. It's also a query point for getIntegrationObjectByDom()
            this.domContainer = window.document.createElement('div');
            this.domContainer.className = 'integrationContainer';
            this.domContainer.innerHTML =
                '<h3 class="integrationTitle">' + this.iDivTemplate.name + '</h3>';
            this.domContainer.appendChild(this.dom);

            //This ID will be used in the "loadedIntegrations" map. it will provide a link between the DOM and this object, allowing for transparency (kindof like a private method)
            loadedIntegrations.set(this.domContainer, this);

            //Setting up listeners:
            this.listenerCollection = eventListeners[useTestListeners ? 'test' : 'prod'];

            this.updateDomInformation = function(
                serviceInformation = this.serviceInformation,
                enableUpdateBtn = true
            ) {
                //Find the new values from the serviceInformation argument and apply it to the old one:
                for (var i in serviceInformation) {
                    this.serviceInformation[i] = serviceInformation[i];
                }

                //Insert values based on what was defined in iDivTemplate
                var integrationBody = this.serviceInformation;
                for (var i in this.iDivTemplate.inputFields) {
                    if (!integrationBody[i] && this.iDivTemplate.inputFields[i].jsonVal) {
                        var jsonFieldConfiguration;
                        if (typeof integrationBody['FieldConfiguration'] == 'string') {
                            jsonFieldConfiguration = JSON.parse(
                                unescapeHTMLString(integrationBody['FieldConfiguration'])
                            );
                        } else {
                            // TODO: For testing
                            jsonFieldConfiguration = integrationBody['FieldConfiguration'];
                        }
                        if (this.iDivTemplate.inputFields[i].fieldType == 'select') {
                            var selectElement = this.dom.getElementsByClassName(
                                'inputField ' + i
                            )[0];

                            //Get the options.
                            var selectOptions = selectElement.options;

                            if (selectOptions == undefined) {
                                // If we didn't find the options is because we got the select2 list, we need to get a select2-offscreen
                                selectElement = this.dom.getElementsByClassName(
                                    'inputField ' + i + ' select2-offscreen'
                                )[0];

                                selectOptions = selectElement.options;
                            }

                            //Loop through these options using a for loop.
                            var optionLength = selectOptions.length;
                            for (var j = 0; j < optionLength; j++) {
                                var opt = selectOptions[j];
                                //If the option of value is equal to the option we want to select.
                                if (opt.value == jsonFieldConfiguration[i]) {
                                    //Select the option and break out of the for loop.
                                    selectElement.selectedIndex = j;
                                    break;
                                }
                            }
                        } else if (this.iDivTemplate.inputFields[i].fieldType == 'label') {
                            if (typeof jsonFieldConfiguration == 'undefined') {
                                this.dom.getElementsByClassName(
                                    'inputField ' + i
                                )[0].parentElement.parentElement.style.display = 'none';
                            } else {
                                this.dom.getElementsByClassName('inputField ' + i)[0].innerHTML =
                                    jsonFieldConfiguration[i];
                            }
                        }
                    } else if (integrationBody[i]) {
                        this.dom.getElementsByClassName('inputField ' + i)[0].value =
                            integrationBody[i];
                    }
                }

                //Last updated string:
                var lastUpdateStr = ['Last updated', '', ' on '];
                var lastUpdateDisplay = false;

                if (integrationBody.ModifiedBy) {
                    //If we have a userId, turn this into a link:
                    var userString = integrationBody.ModifiedBy;
                    if (integrationBody.ModifiedByUserId) {
                        userString =
                            '<a href="/' +
                            integrationBody.ModifiedByUserId +
                            '">' +
                            userString +
                            '</a>';
                    }

                    lastUpdateStr[1] += ': by ' + userString;
                    lastUpdateDisplay = true;
                }
                if (integrationBody.LastModified) {
                    lastUpdateStr[2] += integrationBody.LastModified;
                    lastUpdateDisplay = true;
                }

                if (lastUpdateDisplay) {
                    this.dom.getElementsByClassName(
                        'lastUpdated'
                    )[0].innerHTML = lastUpdateStr.join('');
                }

                if (
                    this.serviceInformation.httpStatus == 400 ||
                    this.serviceInformation.httpStatus === false
                ) {
                    //Something went wrong...
                    this.dom.classList.add('error');
                    if (this.serviceInformation.message) {
                        console.error(
                            '[IntegrationSettings] Integration not updated: ' +
                                this.serviceInformation.message
                        );
                    }
                } else {
                    this.dom.classList.remove('error');
                }

                //Re-enable the update button if disabled
                if (enableUpdateBtn) {
                    var fsbuttonUpdate = this.dom.getElementsByClassName('fsbuttonUpdate')[0];
                    if (fsbuttonUpdate) {
                        fsbuttonUpdate.classList.remove('disabled');
                    }
                }
            };

            //Remove all references to use this object:
            this.delete = function() {
                loadedIntegrations.delete(this.domContainer);
                if (this.domContainer.parentElement)
                    this.domContainer.parentElement.removeChild(this.domContainer);
            };

            var fsbuttonUpdate = this.dom
                .getElementsByClassName('integrationExpandBox')[0]
                .getElementsByClassName('fsbuttonUpdate')[0];
            if (fsbuttonUpdate) {
                fsbuttonUpdate.addEventListener('click', domListeners.integrationUpdateBtn);
            }

            this.dom
                .getElementsByClassName('iDivIcon delete')[0]
                .addEventListener('click', domListeners.integrationDeleteBtn);

            //Emulate the update button when hitting enter on one of the input boxes:
            var inputFields = this.dom.getElementsByClassName('inputField');
            for (var i = 0; i < inputFields.length; i++) {
                inputFields[i].addEventListener(
                    'keydown',
                    domListeners.inputFieldChangeIntegrationUpdate
                );
            }

            //Apply pseudo button listener to specific points:
            var pseudoButtons = ['fsbuttonUpdate', 'expandButton', 'iDivIcon delete'];
            for (var i = 0; i < pseudoButtons.length; i++) {
                var btnList = this.dom.getElementsByClassName(pseudoButtons[i]);
                for (var j = 0; j < btnList.length; j++) {
                    btnList[j].addEventListener('keydown', domListeners.pseudoButton);
                }
            }

            this.updateDomInformation();
        }

        //In case something goes wrong, there's an error page for that
        var errorMessage = window.document.createElement('div');
        errorMessage.className = 'integrationBlockContainer error';
        errorMessage.innerHTML =
            "<div class='fs_pillmessage fs_pillmessage--error' style='text-align:center'><span class='fs_pillmessage__text'>Something went wrong when loading the integration settings. <a class='tryAgainLink'>Please try again.</a></span></div>";
        errorMessage
            .getElementsByClassName('tryAgainLink')[0]
            .addEventListener('click', () => refreshIntegrations('previous'));

        //If there were no integrations found, show this:
        var noIntegrationMessage = window.document.createElement('div');
        noIntegrationMessage.className = 'integrationBlockContainer';
        noIntegrationMessage.innerHTML =
            "<div class='integrationDiv' style='text-align:center'>No Formstack integrations are in use on this org.</div>";

        var refreshIntegrationsLastPostFunction = () => {};
        //Prevent duplicate intgration options by stopping multiple executions
        var refreshIsRunning = false;

        /*The outside scope will get a function to reset the integration objects, but that's it.
    When resetting, the function will return all the dom elements for the other side to implement, whether that be functionally or to display through the DOM*/
        function refreshIntegrations(postFunction, clearIntegrations, isTest, pEngineEndPoint) {
            if (!refreshIsRunning) {
                refreshIsRunning = true;
                //If for some reason loading failed, we can run the last-used function to attempt a reload:
                if (postFunction == 'previous') {
                    postFunction = refreshIntegrationsLastPostFunction;
                } else {
                    refreshIntegrationsLastPostFunction = postFunction;
                }

                // set localScope engineEndpoint
                setDropboxEngineEndpoint(pEngineEndPoint);
                try {
                    if (errorMessage.parentElement) {
                        errorMessage.parentElement.removeChild(errorMessage);
                    }
                    if (noIntegrationMessage.parentElement) {
                        noIntegrationMessage.parentElement.removeChild(noIntegrationMessage);
                    }
                    if (clearIntegrations) {
                        loadedIntegrations.forEach(e => e.delete());
                    }
                    //Grab information for all available integrations:
                    var resultDomElements = [];
                    refreshIntegrationsLastPostFunction = postFunction;

                    eventListeners[isTest ? 'test' : 'prod'].getIntegrations(e => {
                        if (e.httpStatus == 200) {
                            for (var i in e.serviceInformation) {
                                //Getting rid of the if statement will cause non-object results to pass through
                                if (typeof e.serviceInformation[i] == 'object') {
                                    var accountType = localScope.accountTypes[
                                        e.serviceInformation[i].ProviderType
                                    ]
                                        ? localScope.accountTypes[
                                              e.serviceInformation[i].ProviderType
                                          ]
                                        : localScope.accountTypes['default'];
                                    var newIntegration = new integrationObject(
                                        accountType,
                                        e.serviceInformation[i],
                                        isTest
                                    );
                                    resultDomElements.push(newIntegration.domContainer);
                                }
                            }
                            if (!e.serviceInformation.length) {
                                resultDomElements.push(noIntegrationMessage);
                            }
                        } else {
                            resultDomElements.push(errorMessage);
                            console.error(
                                '[integrationSettings] failed to load integrations: - ',
                                e.message
                            );
                        }

                        postFunction(resultDomElements);
                        refreshIsRunning = false;
                        EventsAfterPageIsRendered(resultDomElements);

                        //If the library is available, use select2:
                        if (typeof window.$ == 'function' && window.$().select2) {
                            window.$('select.inputField').select2();
                        }
                    });
                } catch (e) {
                    console.error('[integrationSettings] ', e);
                    postFunction([errorMessage]);
                    refreshIsRunning = false;
                }
            }
        }

        function setFields(currentCountiner, configObj) {
            var rootBlockContainer = currentCountiner.parentElement;
            while (
                rootBlockContainer.className.indexOf('integrationContainer') == -1 ||
                rootBlockContainer.tagName == 'BODY'
            ) {
                rootBlockContainer = rootBlockContainer.parentElement;
            }

            for (var fieldName in configObj) {
                var searchResult = rootBlockContainer.getElementsByClassName(
                    'inputField ' + fieldName + ''
                );
                if (searchResult.length) {
                    var fieldValue = configObj[fieldName];
                    searchResult[0].value = fieldValue;
                }
            }
            domListeners.integrationUpdate(getIntegrationObjectByDom(rootBlockContainer));
        }

        // used to excute method after dom is rederd
        function EventsAfterPageIsRendered() {
            var fsEvent = document.querySelectorAll('[fsEvent]');
            for (var index = 0; index < fsEvent.length; index++) {
                var strfsEvent = fsEvent[index].getAttribute('fsEvent');
                var objfsEvent = JSON.parse(strfsEvent);
                // create function
                if (!!objfsEvent && objfsEvent.type == 'fsLightbox') {
                    var functionName = objfsEvent.functionName;
                    window[functionName] = new FSLightbox(objfsEvent);
                }
            }

            var fsFunction = document.querySelectorAll('[fsFunction]');

            for (var index = 0; index < fsFunction.length; index++) {
                var strfsFunction = fsFunction[index].getAttribute('fsFunction');
                // create function
                if (strfsFunction) {
                    var F = new Function('return ' + strfsFunction);
                    fsFunction[index].addEventListener('click', F);
                }
            }

            $('select.inputField').select2();
        }
        function unescapeHTMLString(value) {
            if (value !== undefined && value != null) {
                value = value + ''.replace(/&amp;/g, '&');
                return value
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&apos;/g, "'")
                    .replace(/&#039;/g, "'")
                    .replace(/&#38;/g, '&')
                    .replace(/&#39;/g, "'");
            } else {
                return '';
            }
        }

        var isJsonVal = function(inputObject) {
            var isJsonValResult = false;
            if (typeof inputObject.jsonVal !== 'undefined') {
                if (inputObject.jsonVal == true) {
                    isJsonValResult = true;
                }
            }
            return isJsonValResult;
        };

        var isNativeCloudTier = function() {
            if (window.packageTier == 'NativeCloud') {
                return true;
            } else {
                return false;
            }
        };

        var showSavedSuccessMessage = function(pTargetIntegration) {
            window.showPillMessage_Success(
                'Successfully updated ' + pTargetIntegration.iDivTemplate.name,
                true,
                window.document.getElementsByClassName('integrationPillMessage')[0]
            );

            var contractButton = pTargetIntegration.dom.getElementsByClassName('contractButton');
            if (contractButton.length) {
                contractButton[0].click();
            }

            enableUpdateButton(pTargetIntegration);
        };

        var showSavedErrorMessage = function(pTargetIntegration) {
            window.showPillMessage_Error(
                'Something went wront when trying to update ' +
                    pTargetIntegration.iDivTemplate.name +
                    ', please try again later.',
                true,
                window.document.getElementsByClassName('integrationPillMessage')[0]
            );

            enableUpdateButton(pTargetIntegration);
        };

        var disableUpdateButton = function(pTargetIntegration) {
            pTargetIntegration.dom
                .getElementsByClassName('fsbuttonUpdate')[0]
                .classList.add('disabled');
        };

        var enableUpdateButton = function(pTargetIntegration) {
            pTargetIntegration.dom
                .getElementsByClassName('fsbuttonUpdate')[0]
                .classList.remove('disabled');
        };

        var returnObj = {
            refreshIntegrations: refreshIntegrations,
            tokenReceiver: tokenReceiver
        };

        if (isModuleExports) {
            returnObj.loadedIntegrations = loadedIntegrations;
            returnObj.eventListeners = eventListeners.test;
            returnObj.localScope = localScope;
        }
        //After this line; it will impossible to directly call __testFunctions; (only through this scope :D)
        return returnObj;
    }
);
