var isCHROME = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isSAFARI = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
var isMicrosoftIE = (window.ActiveXObject || "ActiveXObject" in window);
var isFIREFOX = !(window.mozInnerScreenX == null);
var isEDGE = /Edge/.test(navigator.userAgent);
var intercomEventTrackingTypes = ['clicked-create-new-form', 'published-draft', 'clicked-hosted-form-link', 'enabled-dynamic-prefill'];
window.FS_NS = (typeof window.FS_NS == "undefined" || !window.FS_NS) ? { "Variables": {}, "Functions": {} } : FS_NS;

function getFSNSVariable(variableName, defaultValue) {
    if (FS_NS.Variables[variableName] !== undefined) {
        return FS_NS.Variables[variableName];
    }
    return defaultValue;
}
function setFSNSVariable(variableName, variableValue) {
    FS_NS.Variables[variableName] = variableValue;
}
function commonAlertMessage(primaryMessage, secondaryMessage, btnText) {
    commonConfirmDialog(primaryMessage, secondaryMessage, btnText, "ALERT");
}
function commonInfoMessage(primaryMessage, secondaryMessage, btnText) {
    commonConfirmDialog(primaryMessage, secondaryMessage, btnText, "INFO");
}
function commonSuccessMessage(primaryMessage, secondaryMessage, btnText) {
    commonConfirmDialog(primaryMessage, secondaryMessage, btnText, "OK");
}
function commonConfirmDialog(primaryMessage, secondaryMessage, btnText, confirmType, confirmCallback, confirmCallbackObject) {
    var confirmButtonText = safeStringValue(btnText, "Close");
    var divDialogMain = $('<div />');
    var dialogBody = generateDialogContent(primaryMessage, secondaryMessage, confirmType);
    divDialogMain.html(dialogBody);
    // Define the Dialog and its properties.
    divDialogMain.dialog({
        resizable: false,
        modal: true,
        title: "Save",
        height: "auto",
        width: 413,
        buttons: {
            "NO": {
                click: function () {
                    $(this).dialog('close');
                    if (typeof confirmCallback === "function") {
                        console.log("[FORM] [commonConfirmDialog] [confirmCallback] Callback response: " + confirmCallbackObject);
                        if (confirmCallbackObject !== undefined) {
                            // Execute the positiveCallback function and pass the parameters to it​
                            confirmCallback(confirmCallbackObject);
                        } else {
                            confirmCallback();
                        }
                    } else {
                        console.log("[FORM] [commonConfirmDialog] [confirmCallback] Non-Callback response: " + confirmCallbackObject);
                    }
                },
                text: confirmButtonText,
                'class': 'vabutton2'
            }

        },
        open: function (event, ui) {
            $('.ui-dialog :button').blur();
        }
    });
}
function confirmDialogWithCallback(primaryMessage, secondaryMessage, positiveObject, positiveCallback, negativeObject, negativeCallback, btnOK, btnCancel) {
    var divDialogMain = $('<div />');
    var dialogBody = generateDialogContent(primaryMessage, secondaryMessage, 'ALERT');
    divDialogMain.html(dialogBody);
    var btnYES = safeStringValue(btnOK, "Yes");
    var btnNO = safeStringValue(btnCancel, "No");
    // Define the Dialog and its properties.
    divDialogMain.dialog({
        resizable: false,
        modal: true,
        title: "Save",
        height: "auto",
        width: 413,
        buttons: {
            "Yes": {
                click: function () {
                    $(this).dialog('close');
                    if (typeof positiveCallback === "function") {
                        console.log("[FORM] [confirmDialogWithCallback] [positiveCallback] Callback response: " + positiveObject);
                        // Execute the positiveCallback function and pass the parameters to it​
                        if (positiveObject !== undefined && positiveObject !== null) {
                            positiveCallback(positiveObject);
                        } else {
                            positiveCallback();
                        }
                    } else {
                        console.log("[FORM] [confirmDialogWithCallback] [positiveCallback] Non-Callback response: " + positiveObject);
                    }
                },
                text: btnYES,
                'class': 'vabutton1'
            },
            "No": {
                click: function () {
                    $(this).dialog('close');
                    if (typeof negativeCallback === "function") {
                        console.log("[FORM] [confirmDialogWithCallback] [negativeCallback] Callback response: " + negativeObject);
                        // Execute the negativeCallback function and pass the parameters to it​
                        if (negativeObject !== undefined && negativeObject !== null) {
                            negativeCallback(negativeObject);
                        } else {
                            negativeCallback();
                        }
                    } else {
                        console.log("[FORM] [confirmDialogWithCallback] [negativeCallback] Non-Callback response: " + negativeObject);
                    }
                },
                text: btnNO,
                'class': 'vabutton2'
            }
        },

        open: function (event, ui) {
            $('.ui-dialog :button').blur();
        }
    });
}
function generateDialogContent(primaryMessage, secondaryMessage, confirmType) {
    /*Different class types shows different icons: dialogIconAlert, dialogIconOK, dialogIconInfo */
    var confirmTypeClass = "dialogIconAlert";
    if (confirmType == "OK") {
        confirmTypeClass = "dialogIconOK";
    }
    else if (confirmType == "INFO") {
        confirmTypeClass = "dialogIconInfo";
    }
    var dialogHeaderIcon = $("<div/>", { "class": "dialogIcon" });
    dialogHeaderIcon.addClass(confirmTypeClass);
    var dialogHeader = $("<div/>", { "class": "dialogHeader" });
    dialogHeader.append(dialogHeaderIcon);
    var dialogContent = $("<div/>", { "class": "dialogFont" });
    var dialogPrimary = $("<div/>", { "class": "primary" });
    var dialogSecondary = $("<div/>", { "class": "secondary" });
    dialogPrimary.html(primaryMessage);
    dialogPrimary.append('<br /><br />');
    dialogSecondary.html(secondaryMessage);
    dialogContent.append(dialogPrimary);
    dialogContent.append(dialogSecondary);

    var dialogBody = $('<div />');
    dialogBody.html(dialogHeader);
    dialogBody.append(dialogContent);
    return dialogBody.html();
}

function setupFormRemoteSite(sessionId, sitename, siteurl, description, createOrUpsert, responseCallbackObject, responseCallback) {
    var metaDataType = 'create';
    var validMetadataTypes = ['create', 'upsert'];
    if ($.inArray(createOrUpsert, validMetadataTypes) >= 0) {
        metaDataType = createOrUpsert;
    }
    console.log('[FORM] setupFormRemoteSite Starts...' + metaDataType);

    // Calls the Metdata API from JavaScript to create the Remote Site Setting to permit Apex callouts
    var binding = new XMLHttpRequest();
    var payloadSOAP =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<env:Header>' +
        '<urn:SessionHeader xmlns:urn="http://soap.sforce.com/2006/04/metadata">' +
        '<urn:sessionId>' + sessionId + '</urn:sessionId>' +
        '</urn:SessionHeader>' +
        '</env:Header>' +
        '<env:Body>' +
        '<' + metaDataType + 'Metadata xmlns="http://soap.sforce.com/2006/04/metadata">' +
        '<metadata xsi:type="RemoteSiteSetting">' +
        '<fullName>' + sitename + '</fullName>' +
        '<description>' + description + '</description>' +
        '<disableProtocolSecurity>false</disableProtocolSecurity>' +
        '<isActive>true</isActive>' +
        '<url>' + siteurl + '</url>' +
        '</metadata>' +
        '</' + metaDataType + 'Metadata>' +
        '</env:Body>' +
        '</env:Envelope>';
    deployMetaDataSOAP(payloadSOAP, GetWindowURL(), responseCallbackObject, responseCallback);
}

function deployMetaDataSOAP(payloadSOAP,endpoint,responseCallbackObject,responseCallback)
{ 
    if(endpoint===undefined || endpoint===null || endpoint===''){
        endpoint=GetWindowURL();
    }
    console.log('[FORM] deployMetaDataSOAP Starts...');
    
    // Calls the Metdata API from JavaScript to create the Remote Site Setting to permit Apex callouts
    var binding = new XMLHttpRequest();
    var request = payloadSOAP;  
    ///TODO: add/use API version from FS_NS namespace		
    binding.open('POST', endpoint+'/services/Soap/m/35.0');
    binding.setRequestHeader('SOAPAction','""');
    binding.setRequestHeader('Content-Type', 'text/xml');
    binding.onreadystatechange = function() {
        if(this.readyState==4) {
            console.log('[FORM] [deployMetaDataSOAP] Results');
            console.log(this.response);
            var parser = new DOMParser();
            var doc  = parser.parseFromString(this.response, 'application/xml');
            var errors = doc.getElementsByTagName('errors');
            var resultRecords = doc.getElementsByTagName('records');
            var returnObject = {};
            if (errors.length > 0) {
                returnObject["isValid"] = false;
                returnObject["errors"]=[];
            } else {
                returnObject["isValid"] = true;
                returnObject["results"]=[];
            }
            for (var errorIdx = 0; errorIdx < errors.length; errorIdx++) {
                returnObject["errors"].push(errors.item(errorIdx).getElementsByTagName('message').item(0).innerHTML);
            }
            $.each(resultRecords, function (index, objElement) {
                if (objElement.hasChildNodes()) { 
                    returnObject["results"].push(xmlDocToString(objElement));
                }
            });
            if (typeof responseCallback === "function") {
                console.log("[FORM] [deployMetaDataSOAP] Callback response");
                // Execute the responseCallback function and pass the parameters to it​
                responseCallback(responseCallbackObject, returnObject);
            } else {
                console.log("[FORM] [deployMetaDataSOAP] Non-Callback response");
            }
        } 
    }
    binding.send(request);
}
function getXMLStringFromXMLNode(node) {
    try {
        if (typeof (XMLSerializer) !== 'undefined') {
            var serializer = new XMLSerializer();
            return serializer.serializeToString(node);
        } else if (node.xml) {
            return node.xml;
        }
    } catch (err) { }
    return '';
}

function messageLogToIntercom(message) {
    try {
        message = $('<div/>').html(message).text();
        var logdata = {
            Log: message
        };
        Intercom('trackEvent', 'debug-log', logdata);
    } catch (ee) {
        console.log('Intercom Log Exception- ' + ee);
    }
}

function sendInfoToIntercom(eventType, eventLabel, metaData) {
    try {
        if (window.formsPackageTier != 'NativeCloud' && eventType == 'trackEvent' && $.inArray(eventLabel, intercomEventTrackingTypes) > -1) {
            if (typeof metaData !== "undefined") {
                Intercom(eventType, eventLabel, metaData);
            } else {
                Intercom(eventType, eventLabel);
            }
        }
    } catch (ee) {
        console.log('Intercom Info Exception- ' + ee);
    }

}

function getInnerXMLStringFromXMLNode(node) {
    var returnXMLstr = '';
    if (node.childNodes.length > 0) {
        $.each(node.childNodes, function (indx, childNode) {
            returnXMLstr += getXMLStringFromXMLNode(childNode);
        })
    }

    return returnXMLstr;
}

function upgradeNowMessage(primaryMessage, secondaryMessage, newPageUrl) {
    var dialogBody = "<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>" + primaryMessage + "<br /></div><div class='secondary'>" + secondaryMessage + "</div></div>";
    $("#dialog-confirm").html(dialogBody);

    // Define the Dialog and its properties.
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: "Save",
        height: "auto",
        width: 413,
        buttons: {
            "YES": {
                click: function () {
                    $(this).dialog('close');
                    if (isNullOrEmpty(newPageUrl)) {
                        newPageUrl = "https://www.formstack.com/salesforce#Subscribe";
                    }
                    window.open(newPageUrl, '_blank');
                },
                text: 'Upgrade Now!',
                'class': 'vabutton1'
            },
            "NO": {
                click: function () {
                    $(this).dialog('close');

                },
                text: 'No Thanks',
                'class': 'vabutton2'
            }


        },
        open: function (event, ui) {
            $('.ui-dialog :button').blur();
        }
    });
}

function validObjects() {
    var data = [];
    data.push("Contact");
    data.push("Account");
    data.push("Lead");
    data.push("Case");
    return data;
}

function brTagSafe(htmlsrc) {
    var cleanHtml = safeStringValue(htmlsrc, '');
    cleanHtml = cleanHtml.replace(/<br><br\/>/g, '<br/>');
    cleanHtml = cleanHtml.replace(/<br>/g, '<br/>');
    return cleanHtml;
}

function newlineToBr(str) {
    try {
        str = str.replace(/(?:\r\n|\r|\n)/g, '<br />')
    } catch (err) { }
    return str;
}

function isNullOrEmpty(strvalue) {
    if (strvalue !== undefined && strvalue !== null && strvalue != '') {
        return false;
    }
    return true;
}

function safeStringValue(strvalue, defaultvalue) {
    if (strvalue !== undefined && strvalue !== null && strvalue != '') {
        return strvalue;
    }
    return defaultvalue;
}

function safeInt(intValue, defaultValue) {
    if (!isNaN(parseInt(intValue))) {
        return parseInt(intValue);
    }
    return defaultValue;
}

function safeHTMLValue(strvalue, defaultvalue, escapeHtml) {
    if (strvalue !== undefined && strvalue !== null && strvalue != '') {
        if (escapeHtml) {

            return escapeHtmlString(unescapeHTMLString(strvalue));

        } else {
            return strvalue;
        }
    }
    return defaultvalue;
}
function getXmlSafeHTML(strvalue, defaultvalue) {
    if (strvalue !== undefined && strvalue !== null && strvalue != '') {
        return escapeXML(he.decode(GetInputValueAsHTML(strvalue)));
    }
    return defaultvalue;
}

function toggleDetailBlock(elemSource) {
    $(elemSource).parents('.ff-detail-block-wrap').find('.ff-detail-block').slideToggle();
}

function isNotNullOrUndefined(objvalue) {
    if (objvalue !== undefined && objvalue !== null) {
        return true;
    }
    return false;
}

function formatAmountTo2Decimal(actualamount, defaultvalue) {
    var amount = defaultvalue;
    try {
        amount = parseFloat(actualamount);

        if (isNaN(amount)) {
            amount = 0;
        }
        amount = amount.toFixed(2);
    } catch (err) {
        amount = parseFloat(defaultvalue);
        console.log(' Error formatting amount value');
    }
    return amount;
}

function escapeHTMLElementId(elementId) {
    var elemId = elementId;
    if (elementId !== undefined && elementId !== '') {
        elemId = elementId.replace(/\./g, "\\.");
    }
    return elemId;
}

function getPrefixedOrgFieldName(prefixstr, fieldname) {
    if (prefixstr !== undefined && prefixstr !== '' && fieldname != undefined && fieldname != '' && fieldname.indexOf('__c') > 0 && fieldname.indexOf(prefixstr) != 0) {
        if (prefixstr.indexOf('__') > 0) {
            fieldname = prefixstr + fieldname;
        } else {
            fieldname = prefixstr + '__' + fieldname;
        }
    }
    return fieldname;
}

function isValid3Digits(elemSource) {
    var isvalid = false;
    var $numeric = $(elemSource);
    var regex = /^\d{0,3}$/;
    if (regex.test($numeric.val())) {
        $numeric.css("border-color", "#aaa");
        $numeric.next(".validation-message").remove();
        isvalid = true;
    } else {
        $numeric.css("border-color", "#FF0000");
        if ($numeric.next(".validation-message").length < 1) {
            var newDiv = $('<div />', {
                'class': 'validation-message'
            });
            $numeric.after(newDiv);
            $numeric.next(".validation-message").html('Please provide only numeric value of max 3 digits');
        }
    }
    return isvalid;
}

function msieversion() {
    var ua = window.navigator.userAgent;

    if (ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident") > 0) // If Internet Explorer, return version number
        return 1;
    else // If another browser, return 0
        return 0;
}

function isValueNumeric(elemSource) {
    var isnumeric = false;
    var $numeric = $(elemSource);
    var numericval = $numeric.val();
    var regex = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
    if (regex.test(numericval)) {
        $numeric.css("border-color", "#aaa");
        isnumeric = true;
    } else {
        $numeric.css("border-color", "#FF0000");
    }
    return isnumeric;
}

function isValueNumericOrEmpty(elemSource) {
    var isnumeric = false;
    var $numeric = $(elemSource);
    var numericval = $numeric.val();
    var regex = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
    if (numericval == '' || regex.test(numericval)) {
        $numeric.css("border-color", "#aaa");
        isnumeric = true;
    } else {
        $numeric.css("border-color", "#FF0000");

    }
    return isnumeric;
}

function isEmailValid(elemSource) {
    var isvalid = false;
    var $emailelem = $(elemSource);
    var regex = /^[^\s.|@]+[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var emailtext = $emailelem.val();
    var bIsValidEmail = true;

    var vEmailValueParsed = ParseEmailString(emailtext);
    var vListEmails = vEmailValueParsed.split(',');

    for (i = 0; i < vListEmails.length; i++) {
        var vEmail = vListEmails[i].trim();

        //If it is Token we don't validate
        if (!(vEmail.indexOf('[[') != -1 && vEmail.indexOf(']]') != -1)) {
            if ((vEmail != '') && (!regex.test(vEmail))) {
                bIsValidEmail = false;
            }
        }
    }

    if (bIsValidEmail) {
        $emailelem.css("border-color", "#aaa");
        $emailelem.next(".validation-message").remove();
        isvalid = true;
    } else {
        $emailelem.css("border-color", "#FF0000");
        if ($emailelem.next(".validation-message").length < 1) {
            var newDiv = $('<div />', {
                'class': 'validation-message'
            });
            $emailelem.after(newDiv);
            $emailelem.next(".validation-message").html('Please provide a valid email address');
        }
    }
    return isvalid;
}

function ParseEmailString(pEmailString) {
    if (isNullOrEmpty(pEmailString)) {
        return '';
    }
    var vEmailStringParsed = "";
    pEmailString = ReplaceAll(pEmailString, ";", ",");
    var vListEmails = pEmailString.split(',');

    for (i = 0; i < vListEmails.length; i++) {
        var vEmail = vListEmails[i];

        if (!isNullOrEmpty(vEmail)) {
            if (!isNullOrEmpty(vEmailStringParsed)) {
                vEmailStringParsed += ",";
            }

            vEmailStringParsed += vEmail.trim();
        }
    }

    if (isNullOrEmpty(vEmailStringParsed)) {
        vEmailStringParsed = pEmailString.trim();
    }

    return vEmailStringParsed;
}

function validatedHTML(html) {
    var d = document.createElement('div');
    if (html == '')
        html = '&nbsp;';
    d.innerHTML = html;
    return d.innerHTML;
}

function getFreemiumHTML(partialmessage, optionalMainCssClass, optionalSubCssClass) {
    var mainMsg = 'This feature is';
    var cssClass = 'freemium-icon'; //freemium-edit-block
    var cssSubClass = '-marginLT';
    if (!isNullOrEmpty(optionalMainCssClass)) {
        cssClass = optionalMainCssClass + ' ' + cssClass;
    }
    if (!isNullOrEmpty(optionalSubCssClass)) {
        cssSubClass = cssSubClass + ' ' + optionalSubCssClass;
    }
    if (!isNullOrEmpty(partialmessage)) {
        mainMsg = partialmessage;
    }
    var htmlmsg = '<span class="' + cssClass + ' blue-tooltip" ><span class="blue-tooltip-text ' + cssSubClass + '"><div class="freemium-tooltip-header">Premium Feature</div>' + mainMsg + ' only available for paid subscriptions.<a class="upgrade-now" href="https://www.formstack.com/salesforce?orgid={!$Organization.Id}#Subscribe" target="_blank">Upgrade Now!</a></span></span>';
    return htmlmsg;

}

function lengthSplitId(elemSourceId) {
    var idItems = 0;
    try {
        if (!isNullOrEmpty(elemSourceId) && typeof elemSourceId === 'string') {
            idItems = elemSourceId.split('.').length;
        }
    } catch (err) {
        console.log(' Id check exception ');
    }
    return idItems;
}

function OpenInNewTab(urlstr) {
    event.stopPropagation();
    window.open(urlstr, '_blank');

}

function resetPrimaryForFreemium(selectElement) {
    $(selectElement).find('>option').each(function (indx, optionelem) {
        if ($(optionelem).val() != '' && $.inArray($(optionelem).val(), validObjects()) < 0) {
            $(optionelem).addClass('free-icon');
        } else {
            $(optionelem).removeClass('free-icon');
        }

    });
}

function closeFreemiumNotification(elem, pageType) {

    $(elem).parent().parent().hide();
    /*if(pageType=='formeditor')
                {
                resetEditorFreemiumNotificationJS(false);
                }
                else if(pageType=='formmenu')
                 {
               resetDashboardFreemiumNotificationJS(false);
                }
                 */
}

function closeNotification(elemid) {

    $(elemid).parent().find('.msg-text-div').html('');
    $(elemid).parent().hide();
}

function EncodeJSTag(pText) {
    //console.log('[EncodeJSTag] Start...');
    //return &lt;script&gt;test&lt;/script&gt;
    try {
        pText = parseJavascriptCode(pText, true);
    } catch (error) {
        console.log('Error unexpected! Method[EncodeJSTag] Ex[error below]');
        console.log(error);
    }

    return pText;
}

function DecodeJSTag(pText) {
    //console.log('[DecodeJSTag] Start...');
    //return <script>test</script>
    try {
        pText = parseJavascriptCode(pText, false);
    } catch (error) {
        console.log('Error unexpected! Method[DecodeJSTag] Ex[error below]');
        console.log(error);
    }
    //return <script>test</script>
    return pText;
}

function parseJavascriptCode(pText, bDecode) {
    try {
        if ((pText != null) && (typeof pText.indexOf === 'function') && (typeof pText.toUpperCase === 'function')) {
            if (bDecode) {
                pText = FS_SecureHTML(pText, true);
            }
            else {
                if ((pText.toLowerCase().indexOf('&lt;\/script&gt;') != -1) || (pText.toLowerCase().indexOf('&lt;script') != -1) ||
                    (pText.toUpperCase().indexOf('[JAVASCRIPT]:') != -1)) {
                    pText = pText.replace('&lt;\/script&gt;', '<\/script>');
                    pText = pText.replace('&lt;script', '<script');
                    pText = pText.replace('[javascript]:', 'javascript:');
                }
            }
        }
    } catch (error) {
        console.log('Error unexpected! Method[parseJavascriptCode] Ex[error below]');
        console.log(error);
    }
    return pText;
}

var vListIgnoredTags = ["script", "style", "applet", "body", "embed", "form", "frame", "frameset", "html", "iframe", "object", "meta"];

function GetInputValue(pHTML) {
    //console.log('[GetInputValue] Start['+pHTML+']');
    pHTML = FS_SecureHTML(pHTML, false);
    pHTML = secureFilters.html(pHTML);
    //console.log('[GetInputValue] End['+pHTML+']');
    return pHTML;
}

function GetInputValueAsHTML(pHTML) {
    //console.log('[GetInputValueAsHTML] Start['+pHTML+']');
    pHTML = FS_SecureHTML(pHTML, true);
    //console.log('[GetInputValueAsHTML] AfterParse['+pHTML+']');
    pHTML = secureFilters.html(pHTML);
    //console.log('[GetInputValueAsHTML] End['+pHTML+']');
    return pHTML;
}

function SetInputValue(pHTML) {
    //console.log('[SetInputValue] Start['+pHTML+']');
    var vDocument = document.implementation.createHTMLDocument('Title');
    vDocument.body.innerHTML = pHTML;
    pHTML = vDocument.body.innerText;
    //console.log('[SetInputValue] End['+pHTML+']');
    return pHTML;
}

function EscapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function ReplaceAll(str, find, replace) {
    return str.replace(new RegExp(EscapeRegExp(find), 'g'), replace);
}

function FS_SecureHTML(pHTML, bReturnHTML) {
    //This block make sure that if there is any already escaped HTML characters make sure that it is unescaped so that we can parse through all HTML tags 
    pHTML = unescapeHTMLString(pHTML);
    // Following blocks creates a virtual document and append html provided to itself and pars through all the HTML tags and make sure to strip out unsecured events (starts with on ) and tags listed in vListNodesToRemove
    var vDocument = document.implementation.createHTMLDocument('Title');
    vDocument.body.innerHTML = pHTML;

    var vChildNodes = vDocument.body.childNodes;
    var vListNodesToRemove = [];
    //Checking Nodes
    for (var vIndexChildNodes = 0; vIndexChildNodes < vChildNodes.length; vIndexChildNodes++) {
        FS_SecureNestedNodes(vChildNodes[vIndexChildNodes]);
    }

    if (bReturnHTML) {
        var vHTML = vDocument.body.innerHTML;
        vHTML = ReplaceAll(vHTML, '&amp;', '&');
        vHTML = ReplaceAll(vHTML, '&lt;', '<');
        vHTML = ReplaceAll(vHTML, '&gt;', '>');
        return vHTML;
    }
    else {
        return vDocument.body.innerText;
    }
}

function FS_SecureNestedNodes(vNode) {
    if (vNode.tagName != null && ($.inArray(vNode.tagName.toLowerCase(), vListIgnoredTags) !== -1)){
        console.log("Removing Tag  [" + vNode.tagName + "]");
        vNode.remove();
    }
    else{
        //Checking Attributes
        if (vNode.attributes != null) {
            for (var indexAttr = 0; indexAttr < vNode.attributes.length; indexAttr++) {
                var pAttribute = vNode.attributes[indexAttr];
                //Removing Attributes that starts with On
                if (FSIgnoreEvent(pAttribute)) {
                    console.log("Removing because Attribute [" + pAttribute.nodeName + "]");
                    vNode.attributes.removeNamedItem(pAttribute.nodeName);
                }
            }
        }
        if(vNode.hasChildNodes()){
            //recursive call to the calling function to loop through nested nodes if current node has childnodes
            for (var vIndexNestedChild = 0; vIndexNestedChild < vNode.childNodes.length; vIndexNestedChild++) {
                FS_SecureNestedNodes(vNode.childNodes[vIndexNestedChild]);
            }
        }
    }
}

function FSIgnoreEvent(pAttribute) {
    if (
        pAttribute.nodeName != null &&
        ((pAttribute.nodeName.toString().length >= 2 &&
            pAttribute.nodeName.toLowerCase().substr(0, 2) == "on") ||
            pAttribute.nodeName.toLowerCase() == "fscommand" ||
            pAttribute.nodeName.toLowerCase() == "seeksegmenttime")
    ) {
        return true;
    } else if (
        pAttribute.value.toLowerCase().indexOf("javascript:") != -1 ||
        pAttribute.value.toLowerCase().indexOf("(") != -1 ||
        pAttribute.value.toLowerCase().indexOf("<") != -1
    ) {
        return true;
    } else {
        return false;
    }
}

function escapeXML(unsafe) {
    if (!isNullOrEmpty(unsafe)) {
        return unsafe.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    } else {
        return '';
    }

}

function unescapeXML(unsafe) {
    if (!isNullOrEmpty(unsafe)) {
        return unsafe.replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, "\"")
            .replace(/&#39;/g, "'")
            .replace(/&#34;/g, "\"");
    } else {
        return '';
    }

}

function escapeHtmlString(unsafe) {
    if (!isNullOrEmpty(unsafe)) {
        return unsafe.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    } else {
        return '';
    }

}

function firstElementByTagName(xmlNodeElement, tagName, fetchElemHtml) {
    return Get_firstElementByTagName(xmlNodeElement, tagName, fetchElemHtml, false);
}

function firstElementByTagName_ContentHTML(xmlNodeElement, tagName, fetchElemHtml) {
    return Get_firstElementByTagName(xmlNodeElement, tagName, fetchElemHtml, true);
}

function Get_firstElementByTagName(xmlNodeElement, tagName, fetchElemHtml, bInnerHTML) {
    var firstElement;
    var elements = xmlNodeElement.getElementsByTagName(tagName);
    try {
        if (elements.length > 0) {

            if (fetchElemHtml) {
                if (bInnerHTML) {
                    firstElement = getXMLElemInnerHTMLContent(elements[0], '');
                }
                else {
                    firstElement = getXMLElemInnerContent(elements[0], '');
                }

            } else {
                firstElement = elements[0];
            }
        }
    } catch (err) {

        if (fetchElemHtml) {
            firstElement = '';
        } else {

            firstElement = undefined;
        }
    }
    return firstElement;
}

function getXMLElemInnerContent(xmlElem, defaultvalue) {
    var returnVal = defaultvalue;

    if (isSAFARI || isEDGE) {
        returnVal = xmlElem.textContent;
    } else if (isMicrosoftIE) {
        returnVal = xmlElem.text;
    } else if (isCHROME) {
        returnVal = xmlElem.textContent;
    } else {
        returnVal = xmlElem.textContent;
    }

    return returnVal;
}

function getXMLElemInnerHTMLContent(xmlElem, defaultvalue) {
    var returnVal = defaultvalue;

    if (isSAFARI || isEDGE) {
        returnVal = xmlElem.textContent;
    } else if (isMicrosoftIE) {
        returnVal = xmlElem.text;
    } else if (isCHROME) {
        returnVal = xmlElem.innerHTML;
    } else {
        returnVal = xmlElem.textContent;
    }

    return returnVal;
}

function firstBooleanElementByTagName(xmlNodeElement, tagName, defaultBool) {
    return Get_firstBooleanElementByTagName(xmlNodeElement, tagName, defaultBool, false);
}

function firstBooleanElementByTagName_ContentHTML(xmlNodeElement, tagName, defaultBool) {
    return Get_firstBooleanElementByTagName(xmlNodeElement, tagName, defaultBool, true);
}

function Get_firstBooleanElementByTagName(xmlNodeElement, tagName, defaultBool, bInnerHTML) {
    var firstElement = defaultBool;
    var elements = xmlNodeElement.getElementsByTagName(tagName);
    try {
        if (elements.length > 0) {

            var booleanvalue = false;

            if (bInnerHTML) {
                booleanvalue = getXMLElemInnerHTMLContent(elements[0], defaultBool);
            }
            else {
                booleanvalue = getXMLElemInnerContent(elements[0], defaultBool);
            }

            if (!isNullOrEmpty(booleanvalue) && (booleanvalue == true || booleanvalue + ''.toLowerCase() == 'true')) {
                firstElement = true;
            }
        } else {
            firstElement = defaultBool;
        }
    } catch (err) {

        firstElement = defaultBool;

    }
    return firstElement;
}

function subsstringWithReadmoreDots(text, size, dots) {
    if (!isNullOrEmpty(text) && text.length > size) {
        text = text.substring(0, size);
        text = text + dots;
    }
    return text;
}
//// he- library reference : https://github.com/mathiasbynens/he
function unescapeHTMLString(value) {
    if (!isNullOrEmpty(value)) {
        return he.decode(value)
    }
    return '';
}
function getXmlElementFromStrNoParse(xmlstring) {

    var xmlstr = xmlstring;

    if (msieversion() < 1) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlstr, "text/xml");
    } else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlstr);
    }
    return xmlDoc;
}


function getXmlElementFromStr(xmlstring) {

    var xmlstr = safeStringForXML(xmlstring);

    if (msieversion() < 1) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlstr, "text/xml");
    } else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlstr);
    }
    return xmlDoc;
}

function safeStringForXML(value) {
    var returnstr = '';
    try {
        if (!isNullOrEmpty(value)) {
            returnstr = value.replace(/&/g, "&amp;");
        } else {
            returnstr = '';
        }
    } catch (err) {
        console.log('Safe  XML function error- ' + err.message);
    }
    return returnstr;

}

function decodeHTMLString(value) {
    return $('<div/>').html(value).text();
}

function getXMLElemFirstNode(xmlElemParent, tagName) {
    var xmlElem;
    if (xmlElemParent.getElementsByTagName(tagName).length > 0) {
        xmlElem = xmlElemParent.getElementsByTagName(tagName)[0];
    }
    return xmlElem;
}

function getInnerHTML(xmlElem, defaultValue) {
    var nodeValue = defaultValue;
    if (xmlElem !== undefined) {
        nodeValue = xmlElem.innerHTML;
    }
    return nodeValue;
}

function getSafeBoolean(booleanValue, defaultValue) {
    var returnBool = defaultValue;
    try {
        if (booleanValue !== undefined) {
            if ((booleanValue + '').toLowerCase() == 'true') {
                returnBool = true;
            } else if ((booleanValue + '').toLowerCase() == 'false') {
                returnBool = false;
            }
        }
    } catch (err) { 
        console.log('Error unexpected! Method[getSafeBoolean] Ex[Below]');
        console.log(err);
    }
    return returnBool;
}

function xmlDocToString(xmlData) {

    var xmlString;
    //IE
    if (window.ActiveXObject) {
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else {
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}

function getBrowserInfo() {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {
            name: 'IE',
            version: (tem[1] || '')
        };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) {
            return {
                name: 'Opera',
                version: tem[1]
            };
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return {
        name: M[0],
        version: M[1]
    };
}

function showFFErrorMessage(message) {
    if (isNullOrEmpty(message)) {
        message = 'Something went wrong please contact Formstack support team';
    }
    showFFNotification("errorActionBox", message);
}

function showFFSuccessMessage(message) {
    if (isNullOrEmpty(message)) {
        message = 'Something went wrong please contact Formstack support team';
    }
    showFFNotification("successActionBox", message);
}

function hideFFNotification(elemid) {
    $('#' + elemid).find('.msg-text-div').html('');
    $('#' + elemid).fadeOut(250);
}

function showFFNotification(elemid, textmsg) {
    $('#' + elemid).fadeIn(250);
    $('#' + elemid).find('.msg-text-div').html(textmsg);
}

function hideFFNotificationElem(elem) {
    if (elem !== undefined) {
        $(elem).find('.msg-text-div').html('');
        $(elem).fadeOut(250);
    }
}

function hideFFParentNotificationElem(elem) {
    var parentElem = $(elem).parent();
    if (parentElem !== undefined) {
        $(parentElem).find('.msg-text-div').html('');
        $(parentElem).hide();
    }
}

function showFFNotificationElem(elem, textmsg) {
    if (elem !== undefined) {
        $(elem).fadeIn(250);
        $(elem).find('.msg-text-div').html(SetInputValue(GetInputValue(textmsg)));
    }
}

function getFormattedDateTime(ticks) {
    var tickDate = new Date(ticks); //ticksToMicrotime - epochMicrotimeDiff);

    //dd/MM/yyyy h:mm a
    var yyyy = tickDate.getFullYear();
    var yy = yyyy + ''.substring(2);
    var MM = tickDate.getMonth() + 1;
    var dd = tickDate.getDate();
    var hh = tickDate.getHours();
    var mm = tickDate.getMinutes();
    var sss = tickDate.getSeconds();
    var ampm = 'AM';
    //var hours = (hh+24-2)%24; 
    //  hh=hours;
    if (hh == 0) { //At 00 hours we need to show 12 am
        hh = 12;
    } else if (hh > 12) {
        hh = hh % 12;
        ampm = 'PM';
    }

    var formatForDateTime = window.UserContext['dateTimeFormat'];

    var formmateddatetime = formatForDateTime.replace('yyyy', yyyy);
    formmateddatetime = formmateddatetime.replace('HH', 'hh');
    formmateddatetime = formmateddatetime.replace('H', 'h');
    try {
        formmateddatetime = formmateddatetime.replace('yy', yy);
        formmateddatetime = formmateddatetime.replace('MM', formatWithZeroIfOneDigit(MM));
        formmateddatetime = formmateddatetime.replace('M', formatWithZeroIfOneDigit(MM));
        formmateddatetime = formmateddatetime.replace('dd', formatWithZeroIfOneDigit(dd));
        formmateddatetime = formmateddatetime.replace('d', formatWithZeroIfOneDigit(dd));
        formmateddatetime = formmateddatetime.replace('hh', formatWithZeroIfOneDigit(hh));
        formmateddatetime = formmateddatetime.replace('h', formatWithZeroIfOneDigit(hh));
        formmateddatetime = formmateddatetime.replace('mm', formatWithZeroIfOneDigit(mm));
        formmateddatetime = formmateddatetime.replace('sss', sss);
        formmateddatetime = formmateddatetime.replace('a', ampm);
        formmateddatetime = formmateddatetime.replace('p', ampm);
    } catch (err) {
        console.log(' Date format is not good' + err.message);
    }

    return formmateddatetime;
}

function formatWithZeroIfOneDigit(integerNumber) {
    return (integerNumber < 10 ? '0' : '') + integerNumber;
}

function firstCharCapitalCase(txt) {
    var txtstr = txt;
    if (!isNullOrEmpty(txt) && txt.length > 1) {
        txtstr = txt.slice(0, 1).toUpperCase()
        txtstr += txt.slice(1).toLowerCase();
    }
    return txtstr;
}

function getTrimmedSTR(strToTrim, maxLength, moreStr) {
    var returnstr = strToTrim;
    if (!isNullOrEmpty(returnstr) && returnstr.length > maxLength) {
        returnstr = returnstr.substring(0, maxLength) + moreStr;
    }
    return returnstr;
}

function resetFastFormsHREFLinks(parentElem, pNamespace) {

    if (isFFLightningEnabled()) {

        pNamespace = FF_CheckNamespace(pNamespace);

        $(parentElem).find('a.vfns-link').each(function (indx, aLink) {
            var hreflink = $(aLink).attr('href');
            if (!isNullOrEmpty(hreflink) && hreflink.indexOf(pNamespace) == -1) {
                if (hreflink.toLowerCase().indexOf('/apex/form') >= 0 || hreflink.toLowerCase().indexOf('/apex/submission') >= 0) {
                    hreflink = hreflink.replace('/apex/', '/apex/' + pNamespace + '');
                    $(aLink).attr('href', hreflink);
                }
            }
        });
    }
}

function getQueryStringSafeURL(url) {
    if (!isNullOrEmpty(url)) {
        if (url.indexOf('?') > 0) {
            url = url.substring(0, url.indexOf('?'));
        }
    }
    return url;
}

function FF_CheckNamespace(pNamespace) {
    if (!isNullOrEmpty(pNamespace)) {
        pNamespace = pNamespace.indexOf('__') == -1 ? pNamespace + '__' : pNamespace;
    }
    return pNamespace;
}

function isFFLightningEnabled() {
    var returnFlag = false;
    if ((typeof sforce != 'undefined') && sforce && (!!sforce.one)) {
        returnFlag = true;
    }
    return returnFlag;
}

function ffNavigateToUrl(navigationUrl, ffnamespace) {
    if (isFFLightningEnabled()) {
        navigationUrl = navigationUrl.replace('/apex/', '/apex/' + ffnamespace);
        sforce.one.navigateToURL(navigationUrl);
    } else {

        window.location.href = navigationUrl;
    }
}

function FF_GetVisualforcePageFullURL(pPage, pNamespace) {
    var vLightning = '';

    pNamespace = FF_CheckNamespace(pNamespace);

    if (isFFLightningEnabled()) {
        vLightning = '/one/one.app#/alohaRedirect'
    }

    return GetWindowURL() + vLightning + '/apex/' + pNamespace + pPage
}

function GetWindowURL() {

    if (this.document.location.origin === undefined) {
        return this.document.location.protocol + '//' + this.document.location.hostname
    }
    else {
        return this.document.location.origin;
    }
}

function handleFFClick(elemSource, ev) {
    if ($(elemSource).parent().hasClass('dp-disabled')) {
        ev.preventDefault();
    }
}

function generateFormFieldsSelectHtml(resultFFoptionsArr, mergeFields) {

    var sectionGrp = [];
    var sectionStart = false;
    var fieldsStart = 0;
    var fieldEnds = false;
    var genfieldsStart = 0;
    var genfieldEnds = false;
    var currentIndex = 0;
    var html = '';
    var childObjectPrefix = '';

    var pageGrpStart = false;
    var sectionGrpStart = false;
    var fieldGrpStart = false;
    var genfieldGrpStart = false;
    html += '<option class="fielditem" name="field-item" value="">--select an item--</option>';
    if (mergeFields != null && (mergeFields instanceof Array) && mergeFields.length > 0) {
        html += '<optgroup class="FieldOption ff-merge-grp" label="Formstack Fields">';
        $(mergeFields).each(function (index, ffOptionItem) {

            html += '<option class="fielditem ff-merge-field" name="field-item" value="' + ffOptionItem.FFValue + '">' + ffOptionItem.FFText + ' </option>';
        });
        html += '</optgroup>';
    }
    if (resultFFoptionsArr != null && resultFFoptionsArr.length > 0) {
        var totalItems = resultFFoptionsArr.length;
        $(resultFFoptionsArr).each(function (index, ffOptionItem) {

            var optionText = ffOptionItem.FFText;
            if (!isNullOrEmpty(optionText)) {
                try {
                    optionText = SetInputValue(optionText);
                } catch (err) { }
            }
            var optionValue = ffOptionItem.FFValue;
            if (optionText == '--select a page--') {
                pageGrpStart = true;
                html += '<optgroup class="PageOption" label="Pages">';
            }
            if (optionText == '--select a section--') {
                sectionGrpStart = true;
                if (pageGrpStart) {
                    pageGrpStart = false;
                    html += '</optgroup>';
                }
                html += '<optgroup class="SectionOption" label="Sections">';
            }
            if (optionText == '--select a field--' || optionText == '--select an item--') {
                if (sectionGrpStart) {
                    sectionGrpStart = false;
                    html += '</optgroup>';
                }
                fieldGrpStart = true;
                fieldsStart++;
            }
            if (optionText == '--select a general field--') {
                if (fieldGrpStart || sectionGrpStart) {
                    fieldGrpStart = false;
                    sectionGrpStart = false;
                    html += '</optgroup>';
                }
                genfieldGrpStart = true;



            }
            if (fieldsStart > 0 && optionText.indexOf('Fields for') >= 0) {
                if (optionValue.length >= 1) {
                    childObjectPrefix = 'FieldOption ' + optionValue;
                    //  if(excludeSections){
                    var sectionInfoArr = optionValue.split(' ');
                    // && optionValue.split(' ').length>0 && optionValue.split(' ').length){
                    if (sectionInfoArr.length == 3 && sectionInfoArr[2] == 'repeat') {
                        childObjectPrefix += ' repeat-disabled';
                    }
                    // }
                    //.substring(optionValue.length - 1);

                }

                if (fieldsStart > 0) {
                    if (fieldEnds) {
                        // console.log('In fieldEnds - optionText :' + optionText);
                        html += '</optgroup>';
                        fieldEnds = false;
                    }
                    fieldsStart++;
                }
                html += '<optgroup class="' + childObjectPrefix + '" label="' + optionText + '">';

            }
            if (genfieldGrpStart && optionText.indexOf('--select a general field--') >= 0) {


                if (fieldsStart > 0) {
                    if (fieldEnds) {
                        // console.log('IN fieldEnds - optionText :' + optionText);
                        html += '</optgroup>';
                        fieldEnds = false;
                    }

                    genfieldsStart++;
                }
                html += '<optgroup class="FieldOption" label="General Fields">';

            }
            if (pageGrpStart && !sectionGrpStart && optionValue != '' && fieldsStart == 0) {
                /*looping through section items */
                html += '<option class="pageitem" name="page-item" value="' + optionValue + '">' + optionText + ' </option>';
            }
            if (!pageGrpStart && sectionGrpStart && optionValue != '' && fieldsStart == 0) {
                /*looping through section items */
                html += '<option class="sectionitem" name="section-item" value="' + optionValue + '">' + optionText + ' </option>';
            }
            if (!pageGrpStart && !sectionGrpStart && fieldGrpStart && fieldsStart > 0 && optionValue != '' && optionText.indexOf('Fields for') < 0) {
                /*looping through field items */
                fieldEnds = true;
                var elemType = getFieldTypeByElemId(optionValue);
                if (elemType != 'undefined') {
                    html += '<option class="fielditem" data-type="' + elemType + '" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';
                } else {
                    html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';
                }

            }
            if (!pageGrpStart && !sectionGrpStart && !fieldGrpStart && genfieldsStart > 0 && optionValue != '') {
                /*looping through field items */
                //  console.log('In gen  fields loop - optionText :' + optionText);
                fieldEnds = true;
                var elemType = getFieldTypeByElemId(optionValue);
                if (elemType != 'undefined') {
                    html += '<option class="fielditem" data-type="' + elemType + '" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';
                } else {
                    html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';
                }
            }

            if (index === totalItems - 1) {
                // this is the last one
                html += '</optgroup>';
            }
        });
    }
    return html;
}

function getFieldTypeByElemId(elemId) {
    var elemType = '';
    if (!isNullOrEmpty(elemId)) {
        elemId = elemId.replace("[[", "").replace("]]", "").replace(/\./g, "\\.");
        if ($('#mainMultiPageWrapper').find('.fieldLi #' + elemId).length > 0) {
            elemType = $('#mainMultiPageWrapper').find('.fieldLi #' + elemId).attr('vatt');
        }
    }
    return elemType;
}

function isFieldExistOnForm(elemId) {
    var elemType = '';
    if (!isNullOrEmpty(elemId)) {
        elemId = elemId.replace("[[", "").replace("]]", "").replace(/\./g, "\\.");
        if ($('#mainMultiPageWrapper').find('.fieldLi #' + elemId).length > 0) {
            return true;
        }

    }
    return false;
}

function parseStringToMergeFieldArr(stringWithMergeFields) {
    var mergeFieldsArr = [];
    if (typeof stringWithMergeFields != "string") {
        return mergeFieldsArr;
    }
    if (!isNullOrEmpty(stringWithMergeFields)) {
        var returnArr = stringWithMergeFields.match(/\[\[[A-Za-z0-9_.]*\]\]/g);
        if (returnArr != null && returnArr.length > 0) {
            $.each(returnArr, function (indx, item) {
                if (item != '') {
                    item = item.replace('[[', '').replace(']]', '');
                    mergeFieldsArr.push(item);
                }
            });
        }
    }
    return mergeFieldsArr;
}

function insertContentInCKEditor(elemSourceId, html) {

    var editor = CKEDITOR.instances[elemSourceId];
    editor.insertHtml(html);

}

function setContentInCKEditor(elemSourceId, html) {

    var editor = CKEDITOR.instances[elemSourceId];
    editor.setData(html);

}

function toggleAccordionContent(elemSource) {
    var targetclass = $(elemSource).attr('data-targetclass');
    var expand = false;
    var parentAccElem = $(elemSource).parents('.ff-accordion')[0];
    if ($(elemSource).parents('.accordion-wrapper').find('>.acc-content').hasClass('f-collapse')) {
        expand = true;
    }

    $(parentAccElem).find('>.accordion-wrapper>.acc-content').slideUp(300, 'linear', function () {
        $(this).addClass('f-collapse');
    });
    $(parentAccElem).find('>.accordion-wrapper>.accordion-header').removeClass('acc-expanded');
    if (!isNullOrEmpty(targetclass) && expand) {

        $(parentAccElem).find('>.accordion-wrapper>.' + targetclass).slideDown(300, 'linear', function () {
            $(this).removeClass('f-collapse');
            $(elemSource).parent().addClass('acc-expanded');
            if (accordionHeaderScrollToTop !== undefined && accordionHeaderScrollToTop) {
                try {
                    scrollToElement($(elemSource).parent().parent().find('.accordion-header').first());
                } catch (err) { }
            }
        });

    }
}

function initializeSelect2PlaceHolder(slectElem) {
    if ($(slectElem).find('option').length > 0 && $(slectElem).find('option').first().val() == '') {
        $(slectElem).select2({
            placeholderOption: 'first'
        });
    } else {
        $(slectElem).select2();
    }
}

function getInstanceSafeFullURL(fullURL, instanceurl) {
    if (fullURL !== undefined && fullURL.indexOf('.salesforce.com') > 0) {
        fullURL = instanceurl + fullURL.substr(fullURL.indexOf('.salesforce.com') + 15);

    }
    return fullURL;
}
function escapePicklistValueForSelector(picklistItemValue,needAdvancedEscape) {
    // Use this method, when we are finding an option item based on value attribute in select element
    //// for example : $('#dvFastForms #' + fieldId.replace(/\./g, "\\.") + " option[value='" + _escapePicklistValueForSelector(e) + "']")
    // If you are populating option's value then escape " with &quot;
    //// for example: $(elem1).append('<option value="' + e.replace(/\"/g, '&quot;') + '">' + e + '</option>');
    if (picklistItemValue != undefined && picklistItemValue != '') {
        var picklistValue = '';
        if (picklistItemValue instanceof Array && picklistItemValue.length>0) {
            picklistValue = picklistItemValue[0];
        } else {
            picklistValue=picklistItemValue+'';
        }
        var escapedVal = picklistValue.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/\'/g, '\\\'');
        if(needAdvancedEscape!==undefined && needAdvancedEscape){
            escapedVal= escapedVal.replace(/\:/g, '\\:');
        }
        return escapedVal;
    }
    return '';
}


