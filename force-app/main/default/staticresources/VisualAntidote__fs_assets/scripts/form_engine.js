console.log('[FORM]form_engine.js -- Starts');
/** MAIN Classic/Native FORM LIB STARTS
 * TODO: move calls to window["FS_FormConfiguration"] parameters to fs.Utils.setFSFormConfigProperty/fs.Utils.getFSFormConfigProperty
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
        factoryMethod(root, window);
    }
}(typeof fs !== 'undefined' ? fs: {}, typeof window !== 'undefined' ? window : this, function (fs, window) {
    'use strict';
    var jQuery = fs;
    var $ =fs;
    (function ($) {
        Main($);
    })(fs);
    var fsQ = fs.Query;
    var XDR_TIMEOUT_MILLISECONDS = 60000;
    fs.EH.setFormValid(false);
    var hasGeneralError = false;
    var ff_SectionRepeatMinCount = 1;
    var ff_SectionRepeatMaxCount = 100;
    var jqXHRData;
    
    var validUserLocals = { 'en_CA': 'dd/mm/yy', 'en_US': 'mm/dd/yy', 'default': 'mm/dd/yy' };

    // This is the format that we are going to use to submit to our app/engine - conversion to UTC happens inside of our engine
    var formDateSubmission = 'MM/DD/YYYY';
    var formTimeSubmission = 'hh:mm:ss A';
    var formDateFormatForNativeSubmission = 'YYYY-MM-DD';

    // Users can change this usig before_render
    // We use the American time as default
    window.fs_formLocalejQueryDate = 'mm/dd/yy';
    window.fs_formLocalejQueryTime = 'hh:mm:ss TT';
    window.fs_formLocaleDate = 'MM/DD/YYYY';
    window.fs_formLocaleTime = 'hh:mm:ss A';

    ////////* ERROR MESSAGES *//////////
    window.formLoggerActive = true;
    window.ffDialogPositionOption = {};
    window.ffErr_SignatureFullNameTyped = 'Please enter your first and last name in the provided field.';
    window.ffErr_SignatureInitialsTyped = 'Please enter your initials in the provided field.';
    window.ffErr_SignatureFullNameDrawn = 'Please sign your first and last name in the provided field.';
    window.ffErr_SignatureInitialsDrawn = 'Please sign your initials in the provided field.';
    window.ffErr_SignatureDateTyped = 'Please select today\'s date in the provided field.';
    window.ffErr_SignatureDateDrawn = 'Please sign today\'s date in the provided field.';
    window.ffErr_SignatureAcceptTerms = 'You must accept the provided terms before continuing.';
    window.ffErr_SignatureValidEmail = 'Please provide a valid email address.';

    window.ffErr_FormatValidDecimal = 'Please enter a valid decimal value.';
    window.ffErr_FormatValidNumber = 'Please enter a valid numeric value.';
    window.ffErr_FormatDecimalSize = 'Value is too large.';
    window.ffErr_FormatValidEmail = 'Please enter a valid email address.';
    window.ffErr_FormatValidPhone = 'Please enter a valid phone number.';
    window.ffErr_FormatValidUrl = 'Please enter a valid URL.';
    window.ffErr_InvalidDate = 'Please enter a valid date.';
    window.ffErr_InvalidDateTime = 'Please enter a valid date time.';

    // File Upload - Start
    var maxFileSize = 5000000;
    window.ffErr_FileUploadSize = 'Maximum file size is [[FileSize]] MB';
    window.ffErr_FileUploadType = 'Only the following file types are allowed: ';
    window.fs_fileUpload_disableDragDropInHTMLDocument = true;
    // File Upload - End

    window.ffErr_CaptchaIncorrect = 'The text you have entered is incorrect. Please try again.';

    window.ff_AddAnotherSectionLink = '+ add item';
    window.ff_RemoveSectionLink = '- remove';

    /** localization for ffPrompt_EnterSaveEmail
     * @todo FF-4703 - right now HTML is not supported, only text is supported. we need to plugin secure-filters.js and html-encoder.js into engine build process to allow customize HTML in secure way 
     */
    window.ffPrompt_EnterSaveEmail = 'Please provide your email address below. You will receive an email with a link to allow you to retrieve your saved form at a later date.';
    
    window.ffPrompt_SaveEmailConfirm = 'Thank you! You will receive an email shortly with a link to your saved form.';
    window.ffPrompt_InvalidSavedForm = "The saved form you are attempting to retrieve is invalid or has already been submitted.";
    window.ffPrompt_SavedFormDiscarded = "Your saved form has been discarded.";
    window.ffPrompt_SFLChangesSaved = "Your changes have been saved! To retrieve your saved form at any time, simply click on the link provided to you by email.";
    window.ffPrompt_PaymentInProcessWarning = "Your payment is still being processed. Leaving the page now will cause your payment to not get processed. Are you sure you want to do this?";
    window.ffPaymentError_InvalidCountry = "Please provide a valid country name";
    window.evaluateRulesIfPrefillEnabled = false;

    var enumEndpoint = {
        "INDEX": "1",
        "LOOKUP": "2",
        "CHECK_CAPTCHA": "3",
        "GENERATE_CAPTCHA": "4",
        "SAVE_CONTENT": "5",
        "SAVE_DRAFT": "6",
        "DISCARD_DRAFT": "7",
        "PAYMENT": "8",
        "UPLOAD_FILE": "9",
        "REMOVE_FILE": "10",
        "LOG_EVENT": "11",
    };
    Object.freeze(enumEndpoint);

    window.FFSetValidationMessage = function FFSetValidationMessage(item, msg) {
        window[item] = msg;
    };
    ////////* END ERROR MESSAGES *//////////
    //region RuleEngine Public methods
    window.FFCompare = fs.RE.FFCompare;
    window.FFEqualTo = fs.RE.FFEqualTo;
    window.FFLessThan = fs.RE.FFLessThan;
    window.FFLessThanOrEqualTo = fs.RE.FFLessThanOrEqualTo;
    window.FFGreaterThan = fs.RE.FFGreaterThan;
    window.FFGreaterThanOrEqualTo = fs.RE.FFGreaterThanOrEqualTo;
    window.FFStartsWith = fs.RE.FFStartsWith;
    window.FFEndsWith = fs.RE.FFEndsWith;
    window.FFContains = fs.RE.FFContains;
    
    window.FFHideField = fs.RE.FFHideField;
    window.FFShowField = fs.RE.FFShowField;
    window.FFMakeReadOnly = fs.RE.FFMakeReadOnly;
    window.FFMakeEditable = fs.RE.FFMakeEditable;
    window.FFMakeRequired = fs.RE.FFMakeRequired;
    window.FFMakeNotRequired = fs.RE.FFMakeNotRequired;
    window.FFHideSection = fs.RE.FFHideSection;
    window.FFShowSection = fs.RE.FFShowSection;
    window.FFShowPage = fs.RE.FFShowPage;
    window.FFHidePage = fs.RE.FFHidePage;
    window.FFPopulate = fs.RE.FFPopulate;
    window.FFPopulateLookup = fs.RE.FFPopulateLookup;
    window.FFSetPicklistValues = fs.RE.FFSetPicklistValues;
    //endregion
 
    //region EngineHelper Public methods
    window.ResetValidation = fs.EH.ResetFormValidation;
    window.InitializeIframe = fs.EH.InitializeIframe;
    //endregion

    //region Navigation Public methods
    window.ShowHideBreadcrumbNav = fs.N.ShowHideBreadcrumbNav;
    window.FFMoveBreadcrumbRight = fs.N.FFMoveBreadcrumbRight;
    window.FFMoveBreadcrumbLeft = fs.N.FFMoveBreadcrumbLeft;
    window.FFPrevPage = fs.N.FFPrevPage;
    window.FFNextPage = fs.N.FFNextPage;
    //endregion

    //region eSignature methods
    window.clearSignatures = fs.ES.clearSignatures;
    window.clearDrawnElements = fs.ES.clearDrawnElements;
    //endregion
    /**
     * @todo remove this and use fs.EH.isClassic
     */
    function isClassic() {
        return !isNativeCloud();
    }
    /**
     * @todo remove this and use fs.EH.isNativeCloud
     */
    function isNativeCloud() {
        var vIsNative = false;
        if (fs.Utils.getFormstackFormType() == 'NativeLightning' || fs.Utils.getFormstackFormType() == 'NativeRegular') {
            vIsNative = true;
        }
        return vIsNative;
    }
    /**
     * @todo remove this and use fs.EH.isCommunityForm
     */
    function isCommunityForm() {
        var vIsCommunityForm = false;
        if (fs.Utils.getFormstackFormType() == 'NativeLightning' || fs.Utils.getFormstackFormType() == 'ClassicLightning') {
            vIsCommunityForm = true;
        }
        return vIsCommunityForm;
    }

    function isLivePreviewMode() {
        if (_SafeBoolean(window.FS_FormConfiguration["isCommunityPreviewMode"], false)) {
            return true;
        } else {
            return false;
        }
    }

    function getURLEndPoint(pEndpoint) {
        console.log('[getURLEndPoint] Starts...pEndpoint[' + pEndpoint + ']');
        var vURL = window.FormBASEURL;

        if (isNativeCloud()) {

            if (isCommunityForm()) {

                //If It is Preview Mode and it is Community Form, All endpoints for NE should use Preview builder url
                if (isLivePreviewMode()) {
                    vURL = window.FS_FormConfiguration["PreviewBuilderURL"];
                }

                // Only for NC community Captcha apply Azure Captcha logic
                if (pEndpoint == enumEndpoint.GENERATE_CAPTCHA || pEndpoint == enumEndpoint.CHECK_CAPTCHA) {
                    vURL = window.FormBASEURLEngine + 'EngineFrame/';

                    if (pEndpoint == enumEndpoint.GENERATE_CAPTCHA) {
                        vURL += 'GenerateCaptcha';
                    } else if (pEndpoint == enumEndpoint.CHECK_CAPTCHA) {
                        vURL += 'CheckCaptcha';
                    }
                    console.log('[vURL]......[' + vURL + ']');
                    return vURL;
                }
            }

            vURL += 'apex/' + GetFormNamespace('__');
            switch (pEndpoint) {
                case enumEndpoint.INDEX:
                    vURL += 'FormEnginePage';
                    break;
                case enumEndpoint.LOOKUP:
                    vURL += 'EFDoLookup';
                    break;
                case enumEndpoint.GENERATE_CAPTCHA:
                    vURL += 'EFGenerateCaptcha';
                    break;
                case enumEndpoint.CHECK_CAPTCHA:
                    vURL += 'FFNCaptcha';
                    break;
                case enumEndpoint.SAVE_CONTENT:
                    vURL += 'FFNSubmitEndpoint';
                    break;
                case enumEndpoint.SAVE_DRAFT:
                    vURL += 'FFNSaveDraft';
                    break;
                case enumEndpoint.DISCARD_DRAFT:
                    vURL += 'FFNDiscardDraft';
                    break;
                case enumEndpoint.PAYMENT:
                    vURL += 'EFCheckPayment';
                    break;
                case enumEndpoint.UPLOAD_FILE:
                    vURL += 'CheckPayment';
                    break;
                case enumEndpoint.REMOVE_FILE:
                    vURL += 'EFRemoveFile';
                    break;
                case enumEndpoint.LOG_EVENT:
                    vURL += '';
                    break;
                default:
                    break;
            }
        } else {
            vURL += 'EngineFrame/';

            switch (pEndpoint) {
                case enumEndpoint.INDEX:
                    vURL += 'Index';
                    break;
                case enumEndpoint.LOOKUP:
                    vURL += 'DoLookup';
                    break;
                case enumEndpoint.GENERATE_CAPTCHA:
                    vURL += 'GenerateCaptcha';
                    break;
                case enumEndpoint.CHECK_CAPTCHA:
                    vURL += 'CheckCaptcha';
                    break;
                case enumEndpoint.SAVE_CONTENT:
                    vURL += 'SaveContent';
                    break;
                case enumEndpoint.SAVE_DRAFT:
                    vURL += 'SaveDraft';
                    break;
                case enumEndpoint.DISCARD_DRAFT:
                    vURL += 'DiscardDraft';
                    break;
                case enumEndpoint.PAYMENT:
                    vURL += 'CheckPayment';
                    break;
                case enumEndpoint.UPLOAD_FILE:
                    vURL += 'UploadFile';
                    break;
                case enumEndpoint.REMOVE_FILE:
                    vURL += 'RemoveFile';
                    break;
                case enumEndpoint.LOG_EVENT:
                    vURL += 'LogEvent';
                    break;
                default:
                    break;
            }
        }

        console.log('[vURL]......[' + vURL + ']');
        return vURL;
    }

    function ExecBeforeRender() {
        var result = true;
        try {
            var fsIdentifier = window.FS_FormConfiguration["formIdentifier"];
            if (typeof FF_OnBeforeRender === "function") {
                result = FF_OnBeforeRender();
            } else if (fs.Utils.isAPIMethodExist("FF_OnBeforeRender")) {
                result = window["fscore"]['ID' + fsIdentifier]["FF_OnBeforeRender"]();
            }
        } catch (error) {
            console.log(error);
        }
        return result;
    }

    function ExecAfterRender() {
        try {
            var fsIdentifier = window.FS_FormConfiguration["formIdentifier"];
            if (typeof FF_OnAfterRender === "function") {
                FF_OnAfterRender();
            } else if (fs.Utils.isAPIMethodExist("FF_OnAfterRender")) {
                window["fscore"]['ID' + fsIdentifier]["FF_OnAfterRender"]();
            }
        } catch (error) {
            console.log(error);
        }
    }

    function ExecBeforeSave() {
        var result = true;
        try {
            var fsIdentifier = window.FS_FormConfiguration["formIdentifier"];
            if (typeof FF_OnBeforeSave === "function") {
                result = FF_OnBeforeSave();
            } else if (fs.Utils.isAPIMethodExist("FF_OnBeforeSave")) {
                result = window["fscore"]['ID' + fsIdentifier]["FF_OnBeforeSave"]();
            }
        } catch (error) {
            console.log(error);
        }
        return result;
    }

    function ExecOnInitSave() {
        try {
            var fsIdentifier = window.FS_FormConfiguration["formIdentifier"];
            if (typeof FF_OnInitSave === "function") {
                FF_OnInitSave();
            } else if (fs.Utils.isAPIMethodExist("FF_OnInitSave")) {
                window["fscore"]['ID' + fsIdentifier]["FF_OnInitSave"]();
            }
        } catch (error) {
            console.log(error);
        }
    }

    function ExecAfterSave() {
        try {
            var fsIdentifier = window.FS_FormConfiguration["formIdentifier"];
            if (typeof FF_OnAfterSave === "function") {
                FF_OnAfterSave();
            } else if (fs.Utils.isAPIMethodExist("FF_OnAfterSave")) {
                window["fscore"]['ID' + fsIdentifier]["FF_OnAfterSave"]();
            }
        } catch (error) {
            console.log(error);
        }
    }

    function _UniqueArrayFromCSV(csvStr) {
        var result = [];
        if (csvStr != 'undefined') {
            var list = [];
            list = csvStr.split(",");
            $.each(list, function (i, e) {
                if ($.inArray(e, result) == -1) result.push(e);
            });
        }
        return result;
    }

    function BindPaymentRulesEvents() {

        if (isNativeCloud()) {
            return;
        }

        var paymentRulesMap = $('#paymentRulesMap').val();
        if (paymentRulesMap !== undefined) {
            try {
                var jsonObjectArr = JSON.parse(paymentRulesMap);
                fsQ.forEach(jsonObjectArr, function (paymentFieldItem) {
                    fsQ.forEach(paymentFieldItem.Rules, function (ruleItem) {
                        switch (ruleItem.MethodName) {
                            case "UpdatePaymentAmount":
                                var fieldId = ruleItem.FieldIds[0].replace(/\./g, '\\\.');
                                UpdatePaymentAmountCall($('#' + fieldId).val(), ruleItem.MethodParameters[1], ruleItem.AmountType);
                                break;
                            case "EvaluatePaymentAmount":
                                EvaluatePaymentAmount(ruleItem.MethodParameters[0], ruleItem.MethodParameters[1], ruleItem.MethodParameters[2]);
                                break;
                        }
                        fsQ.forEach(ruleItem.FieldIds, function (field) {
                            var fieldId = field.replace(/\./g, '\\\.');
                            if ($('#' + fieldId) !== undefined) {
                                $('#' + fieldId).bind("change", function (indx, elem) {
                                    console.log('On Payment rule element change');
                                    switch (ruleItem.MethodName) {
                                        case "UpdatePaymentAmount":
                                            UpdatePaymentAmountCall(this.value, ruleItem.MethodParameters[1], ruleItem.AmountType);
                                            break;
                                        case "EvaluatePaymentAmount":
                                            EvaluatePaymentAmount(ruleItem.MethodParameters[0], ruleItem.MethodParameters[1], ruleItem.MethodParameters[2]);
                                            break;
                                    }

                                });
                            }
                        });
                    });
                });
            } catch (err) {
                console.log('Payment Rule binding error:' + err);
            }
        }
    }
    /**
     * @todo Move to engine helper class (fs.EngineHelper) since it is being used by ruleEngine.js
     * @private
     */
    window.RebindPaymentRulesEvents = function (elementId) {
        var paymentRulesMap = $('#paymentRulesMap').val();
        if (paymentRulesMap !== undefined) {
            try {
                var jsonObjectArr = JSON.parse(paymentRulesMap);
                $.each(jsonObjectArr, function (index, paymentFieldItem) {
                    $.each(paymentFieldItem.Rules, function (ruleIndex, ruleItem) {
                        $.each(ruleItem.FieldIds, function (findex, field) {
                            console.log('RebindPaymentRulesEvents ' + elementId + ' fieldId ' + field);
                            if (elementId === field) {
                                var fieldId = field.replace(/\./g, '\\\.');
                                if ($('#' + fieldId) !== undefined) {
                                    $('#' + fieldId).bind("change", function (indx, elem) {
                                        console.log('On Payment rule element change');
                                        switch (ruleItem.MethodName) {
                                            case "UpdatePaymentAmount":
                                                UpdatePaymentAmountCall(this.value, ruleItem.MethodParameters[1], ruleItem.AmountType);
                                                break;
                                            case "EvaluatePaymentAmount":
                                                EvaluatePaymentAmount(ruleItem.MethodParameters[0], ruleItem.MethodParameters[1], ruleItem.MethodParameters[2]);
                                                break;
                                        }

                                    });
                                }
                            }
                        });
                    });
                });
            } catch (err) {
                console.log('Payment Rule binding error:' + err);
            }
        }
    }

    function BindRuleEvents() {
        var ruleMap = $('#ruleFieldsMap').val();
        var submitRulesArr = [];
        if (ruleMap !== undefined && ruleMap != '') {
            if (ruleMap != '') {
                try {
                    var jsonObject = JSON.parse(ruleMap);
                    for (var property in jsonObject) {
                        var fieldId = property;
                        var ruleNumbersArr = [];
                        var ruleBindingInfoArr = _UniqueArrayFromCSV(jsonObject[property]);
                        $.each(ruleBindingInfoArr, function (indx, item) {
                            if (item !== undefined && item.indexOf('||') > 0) {
                                var ruleInfoObj = item.split('||');

                                if (_SafeBoolean(ruleInfoObj[1], false)) {
                                    submitRulesArr.push(parseInt(ruleInfoObj[0], 10));
                                    console.log("[EvaluateOnSubmitRule]:" + ruleInfoObj[0]);
                                } else {
                                    ruleNumbersArr.push(parseInt(ruleInfoObj[0], 10));
                                    console.log("[EvaluateInline]:" + ruleInfoObj[0]);
                                }
                            }
                        });

                        console.log(property + ': ' + jsonObject[property]);
                        fieldId = GetInitialFieldIdIfRepeated(fieldId, fieldId.replace(/\./g, '\\\.'));

                        if (ruleNumbersArr.length > 0) {
                            var ruleArrStr = $('#' + fieldId).attr("data-rules");
                            if (ruleArrStr !== undefined && ruleArrStr !== "") {
                                ruleArrStr += "," + ruleNumbersArr.toString();
                                $('#' + fieldId).attr("data-rules", _UniqueArrayFromCSV(ruleArrStr).toString());
                            } else {
                                $('#' + fieldId).attr("data-rules", ruleNumbersArr.toString());
                            }
                        }
                    }

                    $("[data-rules]").bind("change", function () {
                        var rules = $(this).attr("data-rules");
                        console.log('INFO:onchange triggered.' + rules);
                        var ruleArr = rules.split(',').map(function (item) { return parseInt(item, 10); });
                        console.log("[EvaluateInlineARR]:" + ruleArr);
                        ExecEvaluateRules(ruleArr, this);
                    });
                    if (submitRulesArr != null && submitRulesArr.length > 0) {
                        $('#submitRules').val(submitRulesArr.toString());
                    }
                } catch (err) {
                    console.log('ERROR:[BindRuleEvents]-' + err);
                }
            }
        }

    }

    //END RULE BINDING//
    ///RULE HELPER METHODS//
    function GetInitialFieldIdIfRepeated(fieldId, escapedFieldId) {
        if (fieldId != 'undefined' && fieldId != '' && $('#dvFastForms').find('#' + escapedFieldId).length == 0 && fieldId.split('.').length == 4) {
            var fieldIdasArr = fieldId.split('.');
            if (fieldIdasArr.length === 4) {
                var tempId = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2] + '_1_.' + fieldIdasArr[3];
                tempId = tempId.replace(/\./g, '\\\.');
                if ($('#dvFastForms').find('#' + tempId).length == 1 && $('#dvFastForms').find('#' + tempId).parents('.ff-item-row').parent().hasClass('ff-sec-repeat-wrapper')) {
                    /*Field is repeated*/
                    fieldId = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2] + '_1_.' + fieldIdasArr[3];
                }
            }
        }
        return fieldId.replace(/\./g, '\\\.');
    }

    function getRepeatedFieldElem(fieldId, repeatIndex) {
        if (fieldId != 'undefined' && fieldId != '' && fieldId.split('.').length == 4 && repeatIndex > 0) {
            var fieldIdasArr = fieldId.split('.');
            var tempId = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2] + '_' + repeatIndex + '_.' + fieldIdasArr[3];
            tempId = tempId.replace(/\./g, '\\\.');
            if ($('#dvFastForms').find('#' + tempId).length == 1) {
                /*Field is repeated*/
                fieldId = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2] + '_' + repeatIndex + '_.' + fieldIdasArr[3];
            }
        }
        fieldId = fieldId.replace(/\./g, '\\\.');
        return $('#dvFastForms').find('#' + fieldId);
    }
    ///RULE HELPER METHODS END//
    //CONDITIONAL RULES FUNCTIONS - IF//
    window.ExecEvaluateRules = function (ruleArr, elem) {
        try {
            var fsIdentifier = window.FS_FormConfiguration["formIdentifier"];
            if (typeof evaluateRules === "function") {
                if (typeof ruleArr != "undefined") {
                    if (typeof elem != "undefined") {
                        evaluateRules(ruleArr, elem);
                    } else {
                        evaluateRules(ruleArr);
                    }
                } else {
                    evaluateRules();
                }
            } else if (fs.Utils.isAPIMethodExist("evaluateRules")) {
                if (typeof ruleArr != "undefined" && typeof elem != "undefined") {
                    window["fscore"]['ID' + fsIdentifier]["evaluateRules"](ruleArr, elem);
                } else {
                    window["fscore"]['ID' + fsIdentifier]["evaluateRules"]();
                }
            }
        } catch (error) {
            console.error('[FORM] [ExecEvaluateRules] Log Below:');
            console.error(error);
        }
    }

    window.FFEvaluateRules = function FFEvaluateRules() {
        var fsIdentifier = window.FS_FormConfiguration["formIdentifier"];
        if (typeof parent.evaluateRules != "undefined") {
            $('#dvFastForms .ff-item-row input[data-rules],#dvFastForms .ff-item-row select[data-rules],#dvFastForms .ff-item-row textarea[data-rules]').each(function (indx, elem) {
                var rules = $(elem).attr('data-rules');
                var ruleArr = rules.split(',').map(function (item) { return parseInt(item, 10); });
                parent.evaluateRules(ruleArr, elem);
            });
        } else if (fs.Utils.isAPIMethodExist("evaluateRules")) {
            $('#dvFastForms .ff-item-row input[data-rules],#dvFastForms .ff-item-row select[data-rules],#dvFastForms .ff-item-row textarea[data-rules]').each(function (indx, elem) {
                var rules = $(elem).attr('data-rules');
                var ruleArr = rules.split(',').map(function (item) { return parseInt(item, 10); });
                window["fscore"]['ID' + fsIdentifier]["evaluateRules"](ruleArr, elem);
            });
        }
    }    
    window.EvaluateCustomFormula = fs.EH.EvaluateCustomFormula;
    window.initFlexControl = fs.EH.initFlexControl;
    
    window.FFShowGeneralError = function FFShowGeneralError(msg) {
        fs.EH.ResetFormValidation();
        fs.EH.setFormValid(true);
        ValidateFields(true);
        hasGeneralError = true;

        ShowValidationMessage($('#dvFastForms #btnsubmit'), "GENERAL", msg);
        fs.EH.InitializeIframe();
    }

    window.FFToday = function FFToday() {
        var dt = new Date();
        var year = dt.getFullYear();
        var month = (1 + dt.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = dt.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return month + '/' + day + '/' + year;
    }
    window.TDAY = function TDAY() {
        return FFToday();
    }

    window.FFIf = function FFIf(expr, valIfTrue, valIfFalse) {
        var evaluated = typeof eval === "undefined" ? expr : eval(expr);
        if (evaluated)
            return valIfTrue;
        else
            return valIfFalse;
    }

    /////////ESIGNATURE FUNCTIONS////////

    function getAttributeNameIfExists(elemSource, attrName, defaultvalue) {
        var stringReturn = defaultvalue;
        if (!isNullOrEmpty($(elemSource).attr(attrName))) {
            stringReturn = $(elemSource).attr(attrName);
        }
        return stringReturn;
    }

    window.InitializeSignature = function InitializeSignature() {
        var signature = $(fsQ.S('#dvFastForms .ff-esignature-wrapper'));
        if (signature.length === 0) { return; }

        fsQ.forEach(signature,function (currentItem) {
            InitializeSignatureElement(currentItem);
        });

        //temporary workaround for duplicate names
        //should be fixed in form editor
        var i = 0;
        $('#dvFastForms input[name="ffdate"]').each(function () {
            $(this).attr("name", "ffdate" + i);
            i++;
        });

        i = 0;
        $('#dvFastForms input[name="ffsignature"]').each(function () {
            $(this).attr("name", "ffsignature" + i);
            i++;
        });

    }


    window.InitializeSignatureElement = function InitializeSignatureElement(signatureWrapElement) {
        
        if(document.getElementsByClassName('ffd-esignature-input').length == 0){
            return;
        }

        var signType = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signtype', 'full');
        var signOptions = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signoptions', 'typed');
        var signLabel = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signlabel', 'Full Name');
        var signDate = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signdate', 'Date');
        var signDateHide = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signdatehide', 'false');
        var signAgreeHide = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signagreehide', 'true');
        var signAgree = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signagree', 'I agree to terms and services');
        var signEmailLabel = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-emaillabel', 'Email');
        var signEmailEnabled = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-emailenabled', 'false');

        $(signatureWrapElement).find('.outputSignedName').attr('data-isrequired', true);
        $(signatureWrapElement).find('.docsignWrapper .ffsignature.ff-input-type.ff-type-text').attr('data-isrequired', true);
        
        if (signEmailEnabled == true || signEmailEnabled == 'true') {
            $(signatureWrapElement).find('.ff-email-verification > input').attr('data-isrequired', true);
            $(signatureWrapElement).find('.ff-email-verification').slideDown();
            $(signatureWrapElement).find(".ff-email-verification .ffsign-label>label").html(signEmailLabel);
            $(signatureWrapElement).find('.ff-email-verification .ffsign-label').append('<span class="ff-required-mark">*</span>');
        } else {
            $(signatureWrapElement).find('.ff-email-verification').slideUp();
            $(signatureWrapElement).find('.ff-email-verification').hide();
            $(signatureWrapElement).find('.ff-email-verification > input').attr('data-isrequired', false);
        }

        var options = {
            name: '.ffsignature',
            penColour: '#000',
            drawOnly: false,
            lineWidth: 2,
            typed: '.typedSignName',
            output: '.outputSignedName',
            drawIt: '.ffdrawIt a',
            sig: 'docsignWrapper',
            clear: '.ffclearButton a',
            canvas: '.signPadName',
            onBeforeValidate: 'validateDocSign',
            errorMessage: (signType == 'full' ? ffErr_SignatureFullNameTyped : ffErr_SignatureInitialsTyped),
            errorMessageDraw: (signType == 'full' ? ffErr_SignatureFullNameDrawn : ffErr_SignatureInitialsDrawn),
            errorClass: 'ff-col-1 ff-error ff-signature-error ff-invalid-msg',
            validateFields: false
        };
        var optionsDate = {
            name: '.ffdate',
            penColour: '#000',
            drawOnly: false,
            lineWidth: 2,
            typed: '.typedSignDate',
            output: '.outputSignedDate',
            drawIt: '.ffdrawIt a',
            sig: 'docsignWrapper',
            clear: '.ffclearButton a',
            canvas: '.signPadDate',
            onBeforeValidate: 'validateDocSign',
            errorMessage: ffErr_SignatureDateTyped,
            errorMessageDraw: ffErr_SignatureDateDrawn,
            errorClass: 'ff-col-1 ff-error ff-signature-error ff-invalid-msg',
            validateFields: false
        };
        if (signType == 'initials') {

            $(signatureWrapElement).find('.ff-signwrapper.ff-typed .doc-sign-name .ffsignature').attr('maxlength', 6);
            $(signatureWrapElement).find('.ff-signwrapper.ff-typed .doc-sign-name .docsignWrapper .signPadName').attr('width', '120');
            $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-name .docsignWrapper .signPadName').attr('width', '120');
        } else {
            $(signatureWrapElement).find('.ff-signwrapper.ff-typed .doc-sign-name .ffsignature').removeAttr('maxlength');
            $(signatureWrapElement).find('.ff-signwrapper.ff-typed .doc-sign-name .docsignWrapper .signPadName').attr('width', '232');
            $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-name .docsignWrapper .signPadName').attr('width', '232');
        }

        // Getting the data before call signaturePad method which will restart the drawing fields.
        var outputSignedNameTyped = $(signatureWrapElement).find(".ff-signwrapper.ff-typed .doc-sign-name input.ff-type-text").val();
        var outputSignedNameValue = $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-name .outputSignedName').val();
        var outputSignedDateValue = $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-date .outputSignedDate').val();

        var signInstance = $(signatureWrapElement).find('.ff-signwrapper.ff-typed .doc-sign-name').signaturePad(options);

        var signInstanceDate = $(signatureWrapElement).find('.ff-signwrapper.ff-typed .doc-sign-date').signaturePad(optionsDate);
        options['drawOnly'] = true;
        signInstance = $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-name').signaturePad(options);

        optionsDate['drawOnly'] = true;
        signInstanceDate = $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-date').signaturePad(optionsDate);

        if (!isNullOrEmpty(outputSignedNameValue) && !isNullOrEmpty(outputSignedDateValue)) {
            $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-name .outputSignedName').val(outputSignedNameValue);
            $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-date .outputSignedDate').val(outputSignedDateValue);
            signInstanceDraw.regenerate(outputSignedNameValue);
            signInstanceDateDraw.regenerate(outputSignedDateValue);
        }

        /*Updating properties*/
        $(signatureWrapElement).find('.ff-chkagree > label').html(signAgree);
        $(signatureWrapElement).find('.ff-signwrapper').each(function (ind, signElement) {
            $(signElement).find('.doc-sign-name .ffsign-label>label').html(signLabel);
            $(signElement).find('.doc-sign-date .ffsign-label>label').html(signDate);
            if (signDateHide == true || signDateHide == 'true') {
                $(signElement).find('.doc-sign-date input').attr('data-isrequired', false);
                $(signElement).find('.doc-sign-date').hide();
            } else {
                $(signElement).find('.doc-sign-date input').attr('data-isrequired', true);
                $(signElement).find('.doc-sign-date').show();
            }
        });
        $(signatureWrapElement).find('.main-docsign-wrapper').removeClass('ffs-typed');
        $(signatureWrapElement).find('.main-docsign-wrapper').removeClass('ffs-both');
        $(signatureWrapElement).find('.main-docsign-wrapper').removeClass('ffs-drawn');
        $(signatureWrapElement).find('.main-docsign-wrapper').addClass('ffs-' + signOptions);
        $(signatureWrapElement).find('.main-docsign-wrapper').removeClass('ffs-full');
        $(signatureWrapElement).find('.main-docsign-wrapper').removeClass('ffs-initials');
        $(signatureWrapElement).find('.main-docsign-wrapper').addClass('ffs-' + signType);

        if (signOptions == 'drawn') {
            switchSignTab($(signatureWrapElement).find('.main-docsign-wrapper').find('li.ffdrawIt>a')); 
        } else {
            switchSignTab($(signatureWrapElement).find('.main-docsign-wrapper').find('li.fftypeIt>a'));
        }

        // If Esignature name field on Type side is empty but Esignature name field on drawn side has value, we will show by default the Drawn Tab.
        if (outputSignedNameTyped === "" && outputSignedNameValue !== "") {
            switchSignTab($(signatureWrapElement).find('.main-docsign-wrapper').find('li.ffdrawIt>a'));
        }

        if (signAgreeHide == true || signAgreeHide == 'true') {
            $(signatureWrapElement).find('.ff-chkagree > input').attr('data-isrequired', false);
            $(signatureWrapElement).find('.ff-chkagree').hide();
        } else {
            $(signatureWrapElement).find('.ff-chkagree').show();
            $(signatureWrapElement).find('.ff-chkagree > input').attr('data-isrequired', true);
        }
        $(signatureWrapElement).find('.main-docsign-wrapper').find('li>a').each(function (indx, aElem) {
            //bind on click event
            $(aElem).removeAttr("onclick");
            $(aElem).bind("click", function () {
                switchSignTab(this);
            });
        });
        var clearAElem = $(signatureWrapElement).find('.main-docsign-wrapper').find('.ffclearButton>a');
        //bind on click event
        $(clearAElem).removeAttr("onclick");
        $(clearAElem).bind("click", function () {
            fs.ES.clearSignatures($(this).parents('.main-docsign-wrapper'));
        });

        ReRenderCalendar($(signatureWrapElement).find('.main-docsign-wrapper .ffdate'));
    }


    function isNullOrEmpty(strvalue) {
        if (strvalue !== undefined && strvalue !== null && strvalue != '') {
            return false;
        }
        return true;
    }

    window.switchSignTab = function switchSignTab(elemSource) {

        $(elemSource).parents('.main-docsign-wrapper').find('.ff-sign-ul li a').removeClass('current');
        $(elemSource).addClass('current');
        $(elemSource).parents('.main-docsign-wrapper').find('.ff-signwrapper').addClass('display-none');
        if ($(elemSource).attr('data-signed') == 'drawn') {
            LogEvent("TOGGLED_SIGNATURE_TAB", "DRAWN");
            $(elemSource).parents('.main-docsign-wrapper').find('.ff-signwrapper.ff-drawn').removeClass('display-none');
            $(elemSource).parents('.main-docsign-wrapper').find('.ff-sign-div .ffclearButton').css('visibility', 'visible');
        } else {
            LogEvent("TOGGLED_SIGNATURE_TAB", "TYPED");
            $(elemSource).parents('.main-docsign-wrapper').find('.ff-signwrapper.ff-typed').removeClass('display-none');
            $(elemSource).parents('.main-docsign-wrapper').find('.ff-sign-div .ffclearButton').css('visibility', 'hidden');
        }
    }

    /////////////////////////////////////


    function ValidateForm() {

        if (isOlderBrowser()) {

            //for IE8 and lower, we need to do an iframe post
            //so we can get the results back from the server

            //before we submit back to the server, we need to record how many captcha fields to create
            if ($('#dvFastForms .ff-captcha').length > 0) {
                $('#ffOverlay').addClass('ff-overlay-image');
                $('#dvFastForms form#form1').attr('action', getURLEndPoint(enumEndpoint.GENERATE_CAPTCHA));
                $('#dvFastForms form#form1').trigger('submit');
            } else {
                fs.EH.ResetFormValidation();
                ValidateFields(true);

                if ($('#dvFastForms .ff-payment-wrapper').length > 0 && $('#dvFastForms .ff-creditcard').filter(function () { return this.value.length > 0; }).length > 0) {
                    $('#dvFastForms form#form1').attr('action', getURLEndPoint(enumEndpoint.PAYMENT));
                    $('#dvFastForms form#form1').trigger('submit');
                } else {
                    if (fs.EH.isFormValid()) {
                        $('#ffOverlay').removeClass('ff-overlay-image');
                        ResetSaveDraft();
                        PostFormData();
                    }
                }


            }


        } else {
            fs.EH.ResetFormValidation();
            ValidateFields(true);
            if (fs.EH.isFormValid()) {
                SendCaptchaToServer();
            }
        }
    }
    /**
     * @todo Move to engine helper class since it is being used by navigation.js
     * @private
     */
    window.ValidateFields = function (isSubmit) {
        //Checking Payment fields
        ValidateFields_CheckingAutoPaymentFields();

        //Standard fields
        if (fs.N.isPageTypeValidation() && !isSubmit) {
            var visibleFirstPageRow = fsQ.S("#dvFastForms .ff-page-row").filter(":visible:first");
            var fieldsToCheck = fsQ.find('input[type!="hidden"],textarea,select',visibleFirstPageRow);
            var uploadsToCheck = $(visibleFirstPageRow).find(".ff-fileupload-drop-area:visible");
        } else {
            var fieldsToCheck = fsQ.find('input[type!="hidden"],textarea,select',fsQ.S("#dvFastForms"));
            var uploadsToCheck = fsQ.S("#dvFastForms .ff-fileupload-drop-area");
        }
        $(fieldsToCheck).each(function () {

            var fieldType = $(this).attr("data-vatt");
            if (typeof fieldType != 'undefined') {
                fieldType.split('(')[0].toUpperCase();
            }

            //Ignore required field, if the field(section field) is hidden.
            if ($(this).data('isrequired') == true && $(this).parents('.ff-item-row').css("display") == "none") {
                formLogger("[ValidateFields][" + $(this).attr("id") + "][Ignoring Validation because the field is hidden.]");
                return true;
            }

            if ($(this).parents('div.ff-esignature-wrapper')[0] != undefined) {
                formLogger("[ValidateFields][" + $(this).attr("id") + "][Ignoring Validation because it's wrapper]");
                return true;
            }

            switch ($(this).prop('type')) {
                case "text":
                case "textarea":

                    if ($(this).data('isrequired') == true && (fieldType == 'REFERENCE')) {
                        var refFieldId = $(this).attr('id').replace('input', '').replace(/\./g, "\\.");
                        if ($('#' + refFieldId).val() == '') {
                            fs.EH.setFormValid(false);
                            ShowValidationMessage(this, "REQUIRED");
                        }
                    } else if ($(this).data('isrequired') == true && ($(this).val() == '')) {
                        fs.EH.setFormValid(false);
                        ShowValidationMessage(this, "REQUIRED");
                    } else if (($(this).prop('maxlength') != '-1' && $(this).val().length > $(this).prop('maxlength') && fieldType != "DATE" && fieldType != "DATETIME") || (fs.Patch.KI_1(this))) {
                        fs.EH.setFormValid(false);
                        ShowValidationMessage(this, "LENGTH");
                        IsValidFormat(this);
                    } else if (($(this).val() != '') && !IsValidFormat(this)) {
                        fs.EH.setFormValid(false);
                    }


                    break;
                case "select-one":
                    if ($(this).data('isrequired') == true) {
                        if ($(this).find(":selected").val() == '' || $(this).find(":selected").val() == null || !$(this).find(":selected").val()) {
                            fs.EH.setFormValid(false);

                            if ($(this).data('pp-name') == 'FFExpiryMM' || $(this).data('pp-name') == 'FFExpiryYYYY') {
                                ShowValidationMessage($(this), "PAYMENTEXPIRYREQUIRED");
                            } else {
                                ShowValidationMessage(this, "REQUIRED");
                            }
                        }
                    }
                    break;
                case "select-multiple":
                    if ($(this).data('isrequired') == true) {
                        var selectedValues = "";
                        $(this).find(":selected").each(function () {
                            if ($(this).val() != "")
                                selectedValues += ";" + $(this).val();
                        });
                        if (selectedValues.length == 0) {
                            fs.EH.setFormValid(false);
                            ShowValidationMessage(this, "REQUIRED");
                        }
                    }
                    break;
                //ignore known not needed inputs            
                case "checkbox":
                    if ($(this).data('isrequired') == true && (!$(this).is(':checked'))) {
                        fs.EH.setFormValid(false);
                        ShowValidationMessage(this, "REQUIRED");
                    }
                case "radio":
                case "hidden":
                case "submit":
                case "button":
                case "reset":
                default:
                    break;
            }
        });
        //file upload fields
        $(uploadsToCheck).each(function () {
            if ( (isNativeCloud() && fs.FileService.isFileServiceOn(this) && !fs.FileService.isNativeOptionSelected($(this))) || 
                (isCommunityForm() && !isNativeCloud())) {
                var numUploads = $(this).find("[id$='_Label']").length;
            }
            else if (isNativeCloud()) {
                var numUploads = $(this).find("div.file-item").length;
            }
            if ($(this).data('isrequired') && $(this).parent().parent().css("display") == "none") 
            {
                ///ignore the required  validation because file upload is hidden
                return true;
            } 
            if ($(this).data('isrequired') && numUploads == 0) {
                fs.EH.setFormValid(false);
                ShowValidationMessage(this, "REQUIRED");
            }
        });
        var signaturesValid = ValidateSignatures();
        if (fs.EH.isFormValid() && !signaturesValid) {
            fs.EH.setFormValid(false);
        }
        if (!fs.EH.isFormValid()){
            fs.N.ScrollToFirstError();
        }

        $('#txtSendSizeChange').click();
        fs.EH.InitializeIframe();
    }
    function ValidateFields_CheckingAutoPaymentFields() {
        //This methods just add the Payment fields as Required if one of the fields is filled. - By RH - 20161214
        fsQ.S(".ff-payment-wrapper").each(function () {
            try {
                var vSetRequire = false;
                var creditCardElem = fsQ.S(".ff-creditcard",this);
                var cvvElem = fsQ.S(".ff-cvv",this);
                var expiryMonthElem = fsQ.S(".ff-mm",this);
                var expiryYearElem = fsQ.S(".ff-yyyy",this);
                if (!fs.Utils.isNullOrEmpty($(creditCardElem).val())) {
                    vSetRequire = true;
                } else if (!fs.Utils.isNullOrEmpty($(cvvElem).val())) {
                    vSetRequire = true;
                } else if (!fs.Utils.isNullOrEmpty($(expiryMonthElem).val())) {
                    vSetRequire = true;
                } else if (!fs.Utils.isNullOrEmpty($(expiryYearElem).val())) {
                    vSetRequire = true;
                }
                if (vSetRequire == false &&
                    $(creditCardElem).attr("data-isrequired") == "true" &&
                    $(creditCardElem).attr("data-automatic-required") != "true") {
                    vSetRequire = true;
                }
                if (vSetRequire) {

                    if ($(creditCardElem).attr("data-isrequired") == "false") {
                        $(creditCardElem).attr("data-automatic-required", "true");
                    }

                    $(creditCardElem).data("isrequired", true);
                    $(cvvElem).data("isrequired", true);
                    $(expiryMonthElem).data("isrequired", true);
                    $(expiryYearElem).data("isrequired", true);
                } else {

                    $(creditCardElem).data("isrequired", false);
                    $(cvvElem).data("isrequired", false);
                    $(expiryMonthElem).data("isrequired", false);
                    $(expiryYearElem).data("isrequired", false);
                }
            } catch (err) {
                console.log("Error unexpected! Method[ValidateFields_CheckingAutoPaymentFields] Ex[" + err.message + "]");
            }

        });
    }

    window.ValidateSignatures = function ValidateSignatures() {
        var signaturesValid = true;

        if (fsQ.S('#dvFastForms #pageValType').val() == 'page') {
            var visibleFirstPageRow = fsQ.S("#dvFastForms .ff-page-row").filter(":visible:first");
            var signaturesToCheck = $(visibleFirstPageRow).find(".ff-esignature-wrapper");
        } else {
            //var signaturesToCheck = $('#dvFastForms .ff-esignature-wrapper:visible'); -- It should check all the e-signatures in the page
            var signaturesToCheck = fsQ.S('#dvFastForms .ff-esignature-wrapper');
        }

        var vIndex = 0;
        $(signaturesToCheck).each(function () {
            try {

                //Checking if the Page that has e-signature is hidden by rules.
                if ($(this).parent().parent().attr("page-ishidden") == "true" || $(this).parent().parent().attr("data-page-ishidden") == "true") {
                    return true;
                }

                //Checking if the Section that has e-signature is hidden by rules.
                if ($(this).parent().css("display") == "none") {
                    return true;
                }

                //Checking if the E-signature is hidden by rules.
                if ($(this).css("display") == "none") {
                    return true;
                }

                var isNameValid = true;
                var isDateValid = true;
                var isEmailValid = true;
                var areTermsAgreedTo = true;
                var nameElement = $(this).find('.ff-signwrapper:not(.display-none) .doc-sign-name');
                var nameInput = $(this).find('.ff-signwrapper:not(.display-none) .doc-sign-name').find('input');
                var emailElement = $(this).find('.ff-email-verification');
                var emailInput = $(this).find('.ff-email-verification').find('input');
                var dateElement = $(this).find('.ff-signwrapper:not(.display-none) .doc-sign-date');
                var dateInput = $(this).find('.ff-signwrapper:not(.display-none) .doc-sign-date').find('input');
                var termsElement = $(this).find('.ff-chkagree');
                var termsCheckbox = $(this).find('.ff-chkagree input');

                vIndex++;


                if (($(nameElement).css("display") != "none" )) {
                    if ($(nameInput).attr("data-isrequired") == 'true') {
                        isNameValid = $(nameElement).signaturePad().validateForm();
                    }
                }


                if (($(termsElement).css("display") != "none")) {
                    if ($(termsCheckbox).attr("data-isrequired") == 'true') {
                        areTermsAgreedTo = $(termsCheckbox).is(':checked');
                        if (!areTermsAgreedTo) {
                            var id = "reqdv" + $(termsCheckbox).attr('id');
                            $(termsCheckbox).addClass('ff-input-type-invalid');
                            $(termsCheckbox).parent().append("<div class='ff-invalid-msg ff-col-1 ff-signature-error' id='" + id + "'>" + ffErr_SignatureAcceptTerms + "</div>");
                        }
                    }
                }
                
                if (($(emailElement).css("display") != "none" )) {
                    if ($(emailInput).attr("data-isrequired") == 'true') {
                        var emailField = $((emailElement).find('.ff-type-text'));
                        isEmailValid = IsValidEmail($(emailField).val()) || $(emailField).val() != "";
                        if (!isEmailValid) {
                            var id = "reqdv" + $(emailField).attr('id');
                            $(emailField).addClass('ff-input-type-invalid');
                            $(emailField).parent().after("<div class='ff-invalid-msg ff-col-1 ff-signature-error' id='" + id + "'>" + ffErr_SignatureValidEmail + "</div>");
                        }
                    }
                }
                

                if (($(dateElement).css("display") != "none" )) {
                    if ($(dateInput).attr("data-isrequired") == 'true') {
                        isDateValid = $(dateElement).signaturePad().validateForm();
                    }
                }

                formLogger("ValidateSignatures - Checking [" + vIndex + "] isNameValid[" + isNameValid + "]isDateValid[" + isDateValid + "]areTermsAgreedTo[" + areTermsAgreedTo + "]isEmailValid[" + isEmailValid + "] ");
                if (!isNameValid || !isDateValid || !areTermsAgreedTo || !isEmailValid) {
                    signaturesValid = false;
                }

            } catch (e) {
                console.log("Error unexpected! Method[ValidateSignatures] Ex[" + e.message + "]");
                signaturesValid = false;
            }
        });

        return signaturesValid;
    }
    window.ShowValidationMessage = function ShowValidationMessage(th, valType, appendMsg, showInPopup) {
        var nm = GetName($(th));
        var id = $(th).attr("id");
        var msg = "";
        var isPaymentExpiry = false;

        switch (valType) {
            case "DECIMALFORMAT":
                msg = ffErr_FormatValidDecimal;
                break;
            case "NUMERICFORMAT":
                msg = ffErr_FormatValidNumber;
                break;
            case "DECIMALSIZE":
                msg = ffErr_FormatDecimalSize;
                break;
            case "EMAILFORMAT":
                msg = ffErr_FormatValidEmail;
                break;
            case "PHONEFORMAT":
                msg = ffErr_FormatValidPhone;
                break;
            case "URLFORMAT":
                msg = ffErr_FormatValidUrl;
                break;
            case "FILESIZECUSTOM":
                msg = ffErr_FileUploadSize.replace('[[FileSize]]', appendMsg);
                break;
            case "FILESIZE":
                msg = ffErr_FileUploadSize.replace('[[FileSize]]', '2.5');
                break;
            case "FILEREQUIREDEXTENSION":
                msg = window.ffErr_FileUploadExtensionRequired;
                break;
            case "FILETYPE":
                msg = ffErr_FileUploadType + appendMsg;
                break;
            case "REQUIRED":
                msg = $(th).data("requiredmessage");
                if (msg == "" || !msg) {
                    msg = "required"
                }
                break;
            case "PAYMENTEXPIRYREQUIRED":
                msg = $(th).data("requiredmessage");
                if (msg == "" || !msg) {
                    msg = "required"
                }
                isPaymentExpiry = true;
                break;
            case "LENGTH":
                msg = $(th).data("maxlengthmessage");
                break;
            case "CAPTCHA":
                msg = ffErr_CaptchaIncorrect;
                break;
            case "DATE":
                msg = window.ffErr_InvalidDate;
                break;
            case "DATETIME":
                msg = window.ffErr_InvalidDateTime;
                break;
            case "GENERAL":
            case "PAYMENT":
                msg = appendMsg;
                break;
            default:
        }

        if (showInPopup) {
            ShowErrorPopup(msg)
        } else {
            if (isPaymentExpiry) {
                id = "reqdvFFExpiry";
                var yyElem = $(th).parent().find('[data-pp-name="FFExpiryYYYY"]');
                if ($("#" + id).length == 0) {
                    $(yyElem).after("<div class='ff-invalid-msg' id='" + id + "'>" + msg + "</div>")
                }
                $(th).toggleClass("ff-input-type-invalid")
            } else {
                var newid = "reqdv" + id;
                var i = 0;
                while ($("#" + newid).length > 0) {
                    newid = "reqdv" + id + i;
                    i++
                }
                if (valType == "PAYMENT") {
                    $(th).before("<div class='ff-invalid-msg general-payment-err' id='" + newid + "'>" + msg + "</div>");
                } else {
                    if($(th).siblings().hasClass('matrix-control-container') == false){
                        $(th).parent().append("<div class='ff-invalid-msg' id='" + newid + "'>" + msg + "</div>");
                        $(th).toggleClass("ff-input-type-invalid")
                    }else if($(th).siblings().hasClass('matrix-control-container') == true){
                        $(th).siblings('.matrix-control-container').append("<div class='ff-invalid-msg' id='" + newid + "'>" + msg + "</div>");
                        $(th).toggleClass("ff-input-type-invalid");
                    }
                }
            }
        }
    }

    function GetMaxValue(valLen) {
        var maxVal = "1";
        for (var i = 0; i < valLen; i++) {
            maxVal += "0";
        }
        return maxVal;
    }

    function isDataTypeExist(elemSource, dataTypesToCheckArr) {
        var vatt = $(elemSource).attr('data-vatt');
        if (!fs.Utils.isNullOrEmpty(vatt) && dataTypesToCheckArr !== undefined) {
            if (dataTypesToCheckArr instanceof Array && dataTypesToCheckArr.length > 0) {
                var indx = 0;
                for (indx = 0; indx < dataTypesToCheckArr.length; indx++) {
                    var dataType = dataTypesToCheckArr[indx].toUpperCase();
                    if (vatt.indexOf(dataType.toUpperCase()) == 0) {
                        return true;
                    }
                }
            } else {
                if (vatt.indexOf(dataTypesToCheckArr.toUpperCase()) == 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function IsValidEmail(email) {
        var reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reEmail.test(email);
    }

    function isPaymentField(pHTMLElement){
        if ($(pHTMLElement).hasClass('ff-creditcard') || $(pHTMLElement).hasClass('ff-cvv')) {
            return true;
        } else {
            return false;
        }
    }

    function IsValidFormat(th) {
        var fieldType = $(th).attr("data-vatt");
        if (typeof fieldType != 'undefined') {

            switch (fieldType.split('(')[0].toUpperCase()) {
                case "EMAIL":

                    if (!IsValidEmail($(th).val())) {
                        ShowValidationMessage(th, "EMAILFORMAT");
                        return false;
                    } else {
                        return true;
                    }
                case "INTEGER":
                    var reCur = /^(\d+)$/;
                    if (reCur.test($(th).val())) {
                        return true;
                    } else {
                        ShowValidationMessage(th, "NUMERICFORMAT");
                        return false;
                    }
                case "CURRENCY":
                case "DOUBLE":
                case "PERCENT":
                    var reCur = /^-?(\d+|\d{1,3}(,\d{3})*)(\.\d+)?$/;
                    if (reCur.test($(th).val())) {
                        var precision = fieldType.split('(')[1].split(',')[0];
                        var scale = fieldType.split('(')[1].split(',')[1].replace(')', '');
                        var maxVal = GetMaxValue(precision);
                        if (parseFloat($(th).val()) >= maxVal) {
                            ShowValidationMessage(th, "DECIMALSIZE");
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        ShowValidationMessage(th, "DECIMALFORMAT");
                        return false;
                    }
                case "PHONE":
                    var re = /\+?[\d- )\(]{8,}/;
                    var isValid = re.test($(th).val());
                    if (!isValid) {
                        ShowValidationMessage(th, "PHONEFORMAT");
                        return false;
                    } else {
                        return true;
                    }
                case "URL":
                    var reUrl = /((http:\/\/)|(https:\/\/))?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,63}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/ig;
                    if (reUrl.test($(th).val())) {
                        return true;
                    } else {
                        ShowValidationMessage(th, "URLFORMAT");
                        return false;
                    }
                case "DATE":
                    return isValidDate($(th));
                case "DATETIME":
                    return isValidDateTime($(th));
                default:
                    return true;
            }
        } else {
            return true;
        }

    }
// TODO: add unit test
    window.ResetFormData = function ResetFormData(clearAll) {
        console.log('[ResetFormData] Starts... clearAll[' + clearAll + ']');
        var dvFSQElem = fsQ.S('#dvFastForms');
        var formElementsArr =  $(fsQ.find('input,textarea,select',dvFSQElem));
        fsQ.forEach(formElementsArr, function (currentItem) {
            var elementVisible = false;
            if ($(currentItem).parent().parent().css('display') != 'none')
                elementVisible = true;
            switch ($(currentItem).prop('type')) {
                case "file":
                    if ((clearAll && elementVisible) || GetName($(currentItem)) == $(currentItem).val()) {
                        $(currentItem).val('');
                        clearFileElements(currentItem);
                    }
                    break;
                case "text":
                case "textarea":
                    RenderCalendar(currentItem);
                    if ((clearAll && elementVisible) || GetName($(currentItem)) == $(currentItem).val())
                        $(currentItem).val('');
                    fs.EH.initFlexControl(currentItem, false);
                    break;
                case "reset":
                    $(tcurrentItemhis).click(function (event) {
                        event.preventDefault();
                        ResetFormData(true);
                    });
                    break;
                case "radio":
                case "checkbox":
                    if ((clearAll && elementVisible)){
                        $(currentItem).prop('checked', false);
                        if($(currentItem).siblings('.radio-checkmark').hasClass('ff-ext-selected')){
                            $(currentItem).siblings('.radio-checkmark').removeClass('ff-ext-selected');
                        }}
                    break;
                case "select-one":
                    if (clearAll && elementVisible)
                        $(currentItem).prop('selectedIndex', 0);

                    fs.EH.initFlexControl(currentItem, false);

                    break;
                case "select-multiple":
                    if (clearAll && elementVisible)
                        $(currentItem).prop('selectedIndex', -1);

                    fs.EH.initFlexControl(currentItem, false);

                    break;
            }
        });

        if (isNativeCloud()) {
            if (isCommunityForm()) {
                // only for NC community Captcha apply Azure Captcha logic
                $(fsQ.find('div[data-vatt=FILEUPLOAD]>div',dvFSQElem)).remove();
            } else {
                $(fsQ.find('div[name=FileUploadLabel]',dvFSQElem)).remove();
            }
        } else {
            $(fsQ.find('div[data-vatt=FILEUPLOAD]>div',dvFSQElem)).remove();
        }

        $(fsQ.S('#dvFastForms .ff-type-file')).each(function () {
            $(this).replaceWith($(this).clone(true));
        });

        if (clearAll) {
            if (isNativeCloud() && !isCommunityForm()) {
                if ($(fsQ.find('div[data-vatt=\'CAPTCHA\']',dvFSQElem)).length >= 1) {
                    grecaptcha.reset();
                }
            }
            fs.ES.clearSignatures();
            $(fsQ.find('#formHtml',dvFSQElem)).val('');
            ExecEvaluateRules();
        }

    }

    function CompleteFormSubmission(url, msg) {
        ExecAfterSave();

        //Should reset the Form only if Prefill is not enable
        // In case of Dynamic prefill txtObjId is not empty
        // In case of Community prefill comPrefillObj is not empty
        var shouldResetFormInCaseOfPrefill = false;
        if (isNullOrEmpty($("#dvFastForms #txtObjId").val()) &&
            isNullOrEmpty($("#dvFastForms #comPrefillObj").val())) {
            shouldResetFormInCaseOfPrefill = true;
        }

        ResetFormData(shouldResetFormInCaseOfPrefill);
        $('#dvFastForms #btnsubmit').prop('disabled', false);
        if (url)
            RedirectToUrl(url);
        else if (msg)
            ShowConfirmationPopup(msg);
    }

    window.openLookupPopup = function openLookupPopup(elem) {
        LogEvent("OPENED_LOOKUP", "");
        try {

            var embedCodeParamArray = getEmbedCodeParams();

            var formWidth = $('#dvFastForms .ff-form-main').css('max-width').replace('px', '');
            var formHeight = 575;

            var target = $("#ffLookupDialog");

            var vClassiFrame = '';

            if (inIframe() && fs.EH.isParentAccessible()) {

                //Getting the Window on Top of the Iframe, this is not the Top Window, it is the Frame that you pasted the iFrame Code
                var parentWin = window.parent;

                target = parent.document.getElementById('ffLookupDialog');

                console.log(target);
                if (typeof target !== 'undefined' && target !== null) {
                    console.log('We found Dialog outside of iFrame');

                    vClassiFrame = 'embedcode-iframe-on';
                    ffDialogPositionOption = { my: "top right", at: "top right", of: parentWin };

                    formWidth = parentWin.innerWidth;
                    formHeight = parentWin.innerHeight;

                }
                else {
                    target = $("#ffLookupDialog");

                    formWidth = window.innerWidth;
                    formHeight = window.innerHeight;
                }

                if (formHeight > 575) {
                    formHeight = 575;
                }
                if (formWidth > 500) {
                    formWidth = 500;
                }
            }

            try {

                //Force the popup to load and get context for position
                $(target).dialog({
                    height: formHeight,
                    width: formWidth,
                    position: ffDialogPositionOption,
                });
                $(target).dialog('close');


                //Opening the popup again with the position
                $(target).dialog({
                    height: formHeight,
                    width: formWidth,
                    position: ffDialogPositionOption,
                    modal: true,
                    id: 'dvFastForms',
                    dialogClass: 'ff-form-main',
                    buttons: {
                        "Done": {
                            click: function () {
                                $(this).dialog('close');
                            },
                            text: 'Done',
                            'class': 'ff-btn-submit'
                        }
                    }
                });
            } catch (err) {
                console.trace('Lookup Dialog error log trace:');
            }

            var vCommunityUserAccessToken = "";
            var vCommunityUserInstanceURL = "";
            var vCommunityPreviewURL = "";

            if (isCommunityForm()) {
                if ($("#dvFastForms #CommunityInstanceURL").val() != '') {
                    if (isNativeCloud()) {
                        vCommunityUserInstanceURL = "&iu=" + fixedEncodeURIComponent($("#dvFastForms #CommunityInstanceURL").val());
                    } else {
                        vCommunityUserInstanceURL = "&iu=" + $("#dvFastForms #CommunityInstanceURL").val();
                    }
                }
                //If It is Preview Mode we don't send User Context because we will use Admin Context
                if ($("#dvFastForms #CommunityViewMode").val() != "") {
                    vCommunityUserAccessToken = "&cviewmode=" + $("#dvFastForms #CommunityViewMode").val();

                } else {
                    if ($("#dvFastForms #CommunitySessioID").val() != "") {
                        if (isNativeCloud()) {
                            vCommunityUserAccessToken = "&cut=" + fixedEncodeURIComponent($("#dvFastForms #CommunitySessioID").val());
                        } else {
                            vCommunityUserAccessToken = "&cut=" + $("#dvFastForms #CommunitySessioID").val();
                        }
                    }

                }

                if (isNativeCloud() && isLivePreviewMode() && window.FS_FormConfiguration["PreviewBuilderURL"] != null) {
                    vCommunityPreviewURL = "&cpreviewurl=" + fixedEncodeURIComponent(window.FS_FormConfiguration["PreviewBuilderURL"].slice(0, -1));
                }
            }

            var hiddenLookupElem = $(elem).parent().find('input[type=hidden]');
            var listViewId = $(hiddenLookupElem).attr('data-lookup-value');
            var lookupObject = fs.Patch.LC_ShouldUseNewCode(hiddenLookupElem, 'data-lookup-object') ? $(hiddenLookupElem).attr('data-lookup-object') : $(hiddenLookupElem).attr('data-vaobj');
            var vURL = getURLEndPoint(enumEndpoint.LOOKUP);

            if (isNativeCloud()) {
                vURL += '?lo=' + lookupObject +
                    "&lf=" + $(elem).attr('id').replace('input', '') +
                    "&listid=" + listViewId +
                    "&form=" + $('#dvFastForms #formId').val();
            } else {
                vURL += "?lf=" + $(elem).attr('id').replace('input', '') +
                    "&htmlId=" + $('#dvFastForms #txtHtmlId').val() +
                    "&lo=" + lookupObject +
                    "&lv=" + listViewId;
                    if(fs.Utils.getFSFormConfigProperty("IsSourceLightning",false)){
                        // add ffengine static resource link so that we don't need to render assets from external CDN because of CSP restriction in lightning communities
                        var staticResourceFFEnginePrefix = getRootUrlFromUrlWithPath(fs.Utils.getFSFormConfigProperty('PreviewBuilderURL'))+CDNResourceRoot;
                        vURL+="&sfEngineResourceRoot=" +staticResourceFFEnginePrefix;
                    }
            }

            $(target).html($('<iframe/>', {
                'src': vURL +
                    vCommunityUserAccessToken +
                    vCommunityUserInstanceURL +
                    vCommunityPreviewURL +
                    "&hasCustomCSS=" + $('#dvFastForms #hasCustomCSS').val(),
                'style': 'width:100%; height:100%; border:none;',
                'id': 'ffLookupFrame',
                'name': vClassiFrame
            }));

            $(".ff-ui-dialog-titlebar").hide();
            $(".ff-ui-dialog").attr('id', 'dvFastForms');

        } catch (ex) {
            console.log("[FORM] Error unexpected! Method[openLookupPopup] Ex[" + ex + "]");
            console.log(ex);
        }

        return false;
    }

    window.closeLookupPopup = function closeLookupPopup() {
        $("#dvFastForms #ffLookupDialog").dialog('close');
        return false;
    }
    function getRootUrlFromUrlWithPath(urlWithPath){
        var returnRootUrl = '';
        if(urlWithPath!==undefined && urlWithPath.indexOf('/')>0){
            var urlSplitbySlashArr = urlWithPath.split('/');
            if(urlSplitbySlashArr.length>=3){
                // urlSplitbySlashArr[0] protocol , urlSplitbySlashArr[2] domain
                returnRootUrl=urlSplitbySlashArr[0]+'//'+urlSplitbySlashArr[2];
            }
        }
        return returnRootUrl;
    }
    window.PostFormData = function PostFormData() {
        console.log('[PostFormData] Starts...');

        ExecOnInitSave();
        var btnSubmit = $("#dvFastForms #btnsubmit");
        var url = $(btnSubmit).attr('data-btnurl');
        var msg = $(btnSubmit).attr('data-btnmessage');
        var isDraft = $('#dvFastForms #isDraft').val().toLowerCase() == "true";
        if (isDraft)
            var saveUrl = getURLEndPoint(enumEndpoint.SAVE_DRAFT);
        else
            var saveUrl = getURLEndPoint(enumEndpoint.SAVE_CONTENT);

        ($).support.cors = true;
        var formData;

        if (isNullOrEmpty($('#dvFastForms #txtUserContentId').val()) && !isDraft && !isNativeCloud()) {
            SetFormPDFHTML();
        }

        if (window.XDomainRequest) {
            console.log('[PostFormData] window.XDomainRequest - Starts...');

            formData = GenerateFormData(true);

            // Use Microsoft XDR
            var xdr = new XDomainRequest();
            //IE9 needs these 4 method and 1 attribute even if we don't use them
            xdr.timeout = XDR_TIMEOUT_MILLISECONDS;
            xdr.onerror = function () { console.log('Error unexpected on XDR! Method[PostFormData].') };
            xdr.ontimeout = function () { console.log('Time out error on XDR! Method[PostFormData].') };
            xdr.onprogress = function () { };
            xdr.onload = function () {
                var submissionResponse = $('<div/>').html(xdr.responseText);
                successSubmission(isDraft, url, msg, submissionResponse);
            };
            xdr.open("POST", parseURLForXDR(saveUrl));
            xdr.send(formData);

            $('#dvFastForms #btnsubmit').prop('disabled', false);
        } else if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
            console.log('[PostFormData][IE11-SF][XMLHttpRequest]');
            //To process ajax post in Salesforce pages in IE 11
            formData = GenerateFormData(false);
            var oReq = null;
            if (Sarissa && Sarissa.originalXMLHttpRequest) {
                oReq = new Sarissa.originalXMLHttpRequest();
            } else if (window.XMLHttpRequest) {
                oReq = new XMLHttpRequest();
            }

            oReq.open("POST", saveUrl, true);
            oReq.onreadystatechange = function () {
                if (oReq.readyState == 4 && oReq.status == 200) {
                    var submissionResponse = $('<div/>').html(oReq.responseText);
                    successSubmission(isDraft, url, msg, submissionResponse);
                } else if (oReq.readyState == 4 && oReq.status != 200) {
                    console.log(' Service call exception' + oReq.responseText);
                }
            }
            oReq.send(formData);

        } else {
            formData = GenerateFormData(false);
            // Make $ AJAX call.
            $.ajax({
                global: false,
                type: "POST",
                crossDomain: true,
                url: saveUrl,
                data: formData,
                contentType: false,
                mimeType: "multipart/form-data",
                dataType: "text",//TODO: Test this method in NC and Classic and in Different Browsers with special character
                processData: false,
                success: function (data) {
                    var submissionResponse = $('<div/>').html(data);
                    successSubmission(isDraft, url, msg, submissionResponse);
                },
                error: function (request, status, error) {
                    console.log(' data-posted error: ' + error);

                    if (!isDraft) {
                        CompleteFormSubmission(url, msg);
                    } else {
                        if (getNullSafeLowerCase($('#dvFastForms #draftSaved').val()) == 'true')
                            ShowConfirmationPopup(ffPrompt_SFLChangesSaved);
                        $('#dvFastForms #draftSaved').val("True");
                        $('#dvFastForms #btndiscard').show();
                    }
                }
            });
        }
    }

    function parseURLForXDR(pURL) {
        //We need that for IE9 otherwise we will get access denied
        if (window.location.protocol == "http:" && pURL.lastIndexOf("https:", 0) === 0)
            pURL = pURL.replace("https:", "http:");
        return pURL;
    }

    function successSubmission(isDraft, url, msg, submissionResponse) {
        if (!isDraft) {
            CompleteFormSubmission(url, msg);
            if (isClassic()) {
                if ($(submissionResponse).find('#newSessionUID').length > 0 && $('#txtSessionID') !== undefined) {
                    var sessionUID = $(submissionResponse).find('#newSessionUID').text();
                    if (!isNullOrEmpty(sessionUID)) {
                        $('#txtSessionID').val(sessionUID);
                    }
                }
            }
        } else {
            if (getNullSafeLowerCase($('#dvFastForms #draftSaved').val()) == 'true')
                ShowConfirmationPopup(ffPrompt_SFLChangesSaved);
            $('#dvFastForms #draftSaved').val("True");
            $('#dvFastForms #btndiscard').show();
            if (isNativeCloud()) {
                var draftSubmissionResponse = $($(submissionResponse).clone().wrap('<p>').parent().html());
                if (draftSubmissionResponse !== undefined && draftSubmissionResponse != '') {
                    try {
                        var resultHelper = $.parseJSON(draftSubmissionResponse.find('#postResponse').html());
                        if (resultHelper != null && resultHelper.IsValid) {
                            $('#dvFastForms #txtSessionID').val(resultHelper.ResultText);
                        }
                    } catch (err) {
                        console.log('Error while getting session:' + err);
                    }
                }
            }
        }
    }

    function SetFormPDFHTML() {
        try {
            var isLightning = fs.Utils.getFSFormConfigProperty("IsSourceLightning",false);
            if (isLightning) {
                $("#dvFastForms .ff-form-main input,#dvFastForms .ff-form-main select,#dvFastForms .ff-form-main textarea,#dvFastForms .main-docsign-wrapper").each(function () {
                    var attrId = $(this).attr('id');
                    if (typeof attrId !== typeof undefined && attrId !== false) {
                        $(this).attr('data-id', $(this).attr('id'));
                    }
                    var attrName = $(this).attr('name');
                    if (typeof attrName !== typeof undefined && attrName !== false) {
                        $(this).attr('data-name', $(this).attr('name'));
                    }
                });
            }
            var newDiv;
            var cssLinkHtml = "";

            if ($(".ff-form").length > 0) {
                newDiv = $('<div/>').html($(".ff-form").html());
            } else {
                if (isLightning) {
                    var html = $("#dvFastForms").parent().html();
                    newDiv = $('<div/>').html(html);
                } else {
                    newDiv = $('<div/>').html($("#dvFastForms").html());
                }
            }
            // this block will add all the CSS files we are using for our form and add it to the HTML we are using for PDF
            if ($("#dvFastForms").parent().find('>link').length > 0) {
                $("#dvFastForms").parent().find('>link').each(function () {
                    cssLinkHtml += "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + $(this).attr("href") + "\"></link>";
                });
            }
            if (isLightning) {
                $(newDiv).find(".ff-form-main input,.ff-form-main select,.ff-form-main textarea,.main-docsign-wrapper").each(function () {
                    var attrId = $(this).attr('data-id');
                    if (typeof attrId !== typeof undefined && attrId !== false) {
                        $(this).attr('id', $(this).attr('data-id'));
                    }
                    var attrName = $(this).attr('data-name');
                    if (typeof attrName !== typeof undefined && attrName !== false) {
                        $(this).attr('name', $(this).attr('data-name'));
                    }
                });
            }

            $(newDiv).find('#jsFastForms').remove();
            $(newDiv).find('#ffOverlay').remove();
            $(newDiv).find('.ff-esignature-wrapper .ffsignature').remove();
            $(newDiv).find('.ff-esignature-wrapper .ffdate').remove();
            $(newDiv).find('.ff-esignature-wrapper .ff-sign-div').remove();
            $(newDiv).find('.ff-esignature-wrapper .typedSignName').addClass('typedSignNamePrintable');
            $(newDiv).find('.ff-esignature-wrapper .typedSignDate').addClass('typedSignDatePrintable');

            $(newDiv).find('.ff-payment-wrapper').each(function () {
                var cardElem = $(this).find('.ff-creditcard');
                var cvvElem = $(this).find('.ff-cvv')
                var cardNum = $(cardElem).val();
                var cvv = $(cvvElem).val();
                var lastDigits = cardNum.substring(cardNum.Length - 3, 3);
                var requiredMaskCard = new String('*', cardNum.Length - lastDigits.Length);
                var maskedStringCVV = new String('*', cvv.Length);
                var maskedStringCard = requiredMaskCard.concat(lastDigits);
                $(cardElem).val(maskedStringCard);
                $(cvvElem).val(maskedStringCVV);
            });

            var imgList = [];
            var imgObj = {};
            var i = 0;

            $('#dvFastForms').find('.main-docsign-wrapper.ffs-drawn').each(function () {
                var api = $(this).find('.ff-signwrapper.ff-drawn .doc-sign-name').signaturePad();
                var image = new Image();
                imgObj[i] = api.getSignatureImage();
                imgList.push(imgObj);
                image.src = "ffSignatureImage" + i;
                $(newDiv).find('#' + $(this).attr('id') + ' .ff-signwrapper.ff-drawn .doc-sign-name .docsignWrapper').replaceWith(image);
                i++;

                var api = $(this).find('.ff-signwrapper.ff-drawn .doc-sign-date').signaturePad();
                var image = new Image();
                imgObj[i] = api.getSignatureImage();
                imgList.push(imgObj);
                image.src = "ffSignatureImage" + i;
                $(newDiv).find('#' + $(this).attr('id') + ' .ff-signwrapper.ff-drawn .doc-sign-date .docsignWrapper').replaceWith(image);
                i++;
            });

            $('#dvFastForms').find('.main-docsign-wrapper.ffs-both').each(function () {
                var api = $(this).find('.ff-signwrapper.ff-drawn .doc-sign-name').signaturePad();
                var image = new Image();
                imgObj[i] = api.getSignatureImage();
                imgList.push(imgObj);
                image.src = "ffSignatureImage" + i;
                $(newDiv).find('#' + $(this).attr('id') + ' .ff-signwrapper.ff-drawn .doc-sign-name .docsignWrapper').replaceWith(image);
                i++;

                var api = $(this).find('.ff-signwrapper.ff-drawn .doc-sign-date').signaturePad();
                var image = new Image();
                imgObj[i] = api.getSignatureImage();
                imgList.push(imgObj);
                image.src = "ffSignatureImage" + i;
                $(newDiv).find('#' + $(this).attr('id') + ' .ff-signwrapper.ff-drawn .doc-sign-date .docsignWrapper').replaceWith(image);
                i++;
            });

            $('#dvFastForms').find('.main-docsign-wrapper.ffs-full').each(function () {
                var api = $(this).find('.ff-signwrapper.ff-drawn .doc-sign-name').signaturePad();
                var image = new Image();
                imgObj[i] = api.getSignatureImage();
                imgList.push(imgObj);
                image.src = "ffSignatureImage" + i;
                $(newDiv).find('#' + $(this).attr('id') + ' .ff-signwrapper.ff-drawn .doc-sign-name .docsignWrapper').replaceWith(image);
                i++;

                var api = $(this).find('.ff-signwrapper.ff-drawn .doc-sign-date').signaturePad();
                var image = new Image();
                imgObj[i] = api.getSignatureImage();
                imgList.push(imgObj);
                image.src = "ffSignatureImage" + i;
                $(newDiv).find('#' + $(this).attr('id') + ' .ff-signwrapper.ff-drawn .doc-sign-date .docsignWrapper').replaceWith(image);
                i++;
            });

            //multi-select regualr picklist pdf rendering starts
            var regularPicklistSelectedItemsMap = {};
            $('.ff-item-row select.ff-multipicklist[data-flexcontrol=""]').each(function () {
                var elemId = fs(this).attr('id');
                // populating selected values for non-flex multi-picklist
                regularPicklistSelectedItemsMap[elemId] = fs(this).val();
            });
            $(newDiv).find('.ff-item-row select.ff-multipicklist[data-flexcontrol=""]').each(function () {
                /// [data-flexcontrol=""] filter make sure to get only non-flex controls
                var selectContainer = $('<div/>', { 'class': 'select2-container ' + $(this).attr('class') });
                $(this).hide();
                var elemId = $(this).attr('id');
                var optionSelectedArray;
                if (regularPicklistSelectedItemsMap[elemId] !== undefined) {
                    optionSelectedArray = regularPicklistSelectedItemsMap[elemId];
                }
                var selectUL = $('<ul/>', { 'class': 'select2-container-multi select2-choices' });
                $(this).find('option').each(function (index, optionElement) {
                    var selectLI = $('<li/>', { 'class': 'select2-choices-item' });
                    if ($.inArray($(optionElement).text().trim(), optionSelectedArray) !== -1) {
                        // if current option text exists in selected values array (regularPicklistSelectedItemsMap) then add a class which will be rendered as selected in PDF
                        selectLI.addClass('item-selected');
                    }
                    selectLI.html($(optionElement).text());
                    selectUL.append(selectLI);
                });
                $(selectContainer).append(selectUL);
                $(this).parent().prepend(selectContainer);
            });
            //multi-select regualr picklist pdf rendering ends

            //multipage accommodation
            $(newDiv).find('.ff-page-row').filter("[page-ishidden!=true],[data-page-ishidden!=true]").show();
            $(newDiv).find('.ff-page-bread-header').remove();
            $(newDiv).find('.ff-page-header-row').remove();
            $(newDiv).find('#btnprev').hide();
            $(newDiv).find('#btnnext').hide();
            $(newDiv).find('#btnsubmit').hide();

            $(newDiv).find('#formHtml').remove();
            $(newDiv).find("[class*='ff-ui-dialog']").remove();

            $(newDiv).find('script').remove();

            //temporary CSS workaround for half-width general text labels
            $(newDiv).find('.ff-general-text-label').parent().css('max-width', '100%');

            var finalHtml = $('<div/>').text($(newDiv).html()).html();

            $.each(imgList, function (i, val) {
                finalHtml = finalHtml.replace(new RegExp("ffSignatureImage" + i, "gi"), encodeURIComponent(val[i]));
            });
            finalHtml = LZString.compressToEncodedURIComponent(cssLinkHtml + finalHtml);
            finalHtml = finalHtml.replace(/>[\n\t ]+</g, "><");
            $('#dvFastForms #formHtml').val(finalHtml);
        } catch (err) {
            console.log('ERROR []' + err);
        }
    }

    function isDateOrDateTimeField(elemSource) {
        var vatt = $(elemSource).attr('data-vatt');
        if (vatt != null && vatt != undefined &&
            vatt != 'undefined' && vatt != ''
            && (vatt.toUpperCase() == 'DATE' || vatt.toUpperCase() == 'DATETIME')) {
            return true;
        }
        return false;
    }

    function isDateField(elemSource) {
        var vatt = $(elemSource).attr('data-vatt');
        if (vatt != null && vatt != undefined &&
            vatt != 'undefined' && vatt != '' && (vatt.toUpperCase() == 'DATE')) {
            return true;
        }
        return false;
    }

    window.GenerateFormData = function GenerateFormData(isXDR) {
        console.log("[FS] [GenerateFormData] Starts... ");
        var now = new Date();
        var formData;
        var dataArr = [];

        try {
            AddToArray(dataArr, "inputdate", (now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
            $("#dvFastForms input,#dvFastForms textarea,#dvFastForms select").each(function () {
                var val = $(this).val();
                var include = true;
                if (!isNullOrEmpty($(this).attr('readonly')) && isNativeCloud()) {
                    include = false;
                }
                var isESignField = false;
                if ($(this).parents('.main-docsign-wrapper').length > 0 && isNativeCloud()) {
                    isESignField = true;
                }
                if (include) {
                    switch ($(this).prop('type')) {
                        case "text":
                        case "textbox":
                            if (isESignField && isNativeCloud()) {
                                if ($(this).parents('.ff-signwrapper').hasClass('ff-typed')) {
                                    AddToArray(dataArr, $(this).attr('id'), fixedEncodeURIComponent(val));
                                }
                            } else {

                                if (isDateOrDateTimeField(this)) {
                                    val = getDateOrDateTimeToSubmit(this);
                                } else if(isDataTypeExist(this, ["CURRENCY", "DOUBLE"]) && !isPaymentField(this)){
                                    /// Clearing out commas to save 1,000.00 as 1000.00
                                    val = fs.Utils.getSafeFloatValue(val);
                                }
                                AddToArray(dataArr, GetName($(this)), fixedEncodeURIComponent(val));
                            }
                            break;
                        case "radio":
                            /// ignoring matrix radio buttons values which are for display purposes only
                            if ($(this).prop('checked') && !($(this).hasClass('matrix-likert'))) {
                                AddToArray(dataArr, GetName($(this)), fixedEncodeURIComponent(val));
                            }
                            break;
                        case "checkbox":
                            AddToArray(dataArr, GetName($(this)), $(this).prop('checked'));
                            break;
                        case "textarea":
                            AddToArray(dataArr, GetName($(this)), fixedEncodeURIComponent(val));
                            break;
                        case "select-one":
                            var selectedValue = "";
                            if ($(this).val() !== undefined && $(this).val() !== null) {
                                selectedValue = $(this).val();
                            }
                            AddToArray(dataArr, GetName($(this)), fixedEncodeURIComponent(selectedValue));
                            break;
                        case "select-multiple":
                            var selectedValues = "";
                            $(this).find(":selected").each(function () {
                                selectedValues += ";" + fixedEncodeURIComponent($(this).val());
                            });
                            if (selectedValues.length > 1) {
                                selectedValues = selectedValues.substr(1, selectedValues.length - 1);
                            }
                            AddToArray(dataArr, GetName($(this)), selectedValues);
                            break;
                        case "hidden":
                            if (isNativeCloud()) {
                                if (!isESignField) {
                                    AddToArray(dataArr, GetName($(this)), val);
                                }
                            } else {
                                AddToArray(dataArr, GetName($(this)), val);
                            }
                            break;
                        case "submit":
                        case "button":
                        case "reset":
                            //ignore known not needed inputs
                            break;
                        case "file":
                            if (isNativeCloud()) {
                                var fileElemName = GetName($(this));
                                var attachto = 1;
                                if (!isNullOrEmpty($(this).parent().attr('data-attachto'))) {
                                    attachto = $(this).parent().attr('data-attachto');
                                }
                                var dataChatter = $(this).parent().attr('data-uploadtochatter');
                                var isChatter = (dataChatter !== undefined && dataChatter == 'true') ? true : false;
                                $(this).parent().find('.file-item').each(function (indx, fileItem) {
                                    var fileDataItem = $(fileItem).find('label'); //.attr('data-file');

                                    if (fileDataItem !== undefined && $(fileDataItem).attr('data-file-sid') !== undefined && $(fileDataItem).attr('data-file-sid') != '') {
                                        AddToArray(dataArr, fileElemName + '_' + indx + '||' + $(fileDataItem).attr('data-fileext') + '||FILE||' + $(fileDataItem).attr('data-filename') + '||' + isChatter + '||' + attachto, $(fileDataItem).attr('data-file-sid'));
                                    }
                                });
                            }
                            break;
                        default:
                            AddToArray(dataArr, "Unknown_InputType_" + GetName($(this)), $(this).prop('type'));
                    }
                }
            });
            /*Submit Repeated Object Ids in case of prefill */
            $("#dvFastForms .ff-sec-repeat-wrapper").each(function (indx, ritem) {
                var repeatedObjId = $(ritem).attr('data-rid');
                if (repeatedObjId !== undefined && repeatedObjId != '') {
                    AddToArray(dataArr, repeatedObjId, fixedEncodeURIComponent($(ritem).attr('data-rval')));
                }
            });

            if (isNativeCloud()) {
                /*NATIVE Change
                -Added code to get the signature as image and pass it as submitted data
                */
                $("#dvFastForms .ff-esignature-wrapper .ff-drawn input").each(function () {
                    var jsonVal = $(this).val();
                    if (jsonVal !== undefined && jsonVal != '') {
                        var dataImg = $(this).parents('.ff-sign-block').signaturePad().getSignatureImage();
                        AddToArray(dataArr, GetName($(this)), fixedEncodeURIComponent(dataImg));
                    } else {
                        console.log('Signature is not provided');
                    }
                });
            }

            if (isXDR) {
                formData = "";
                //XDR does not support FormData, so we have to generate a string
                for (var i = 0; i < dataArr.length; i++) {
                    if (formData != "")
                        formData += "&";
                    formData += dataArr[i][0] + "=" + dataArr[i][1];
                }
            } else {
                formData = new FormData;

                for (var i = 0; i < dataArr.length; i++)
                    formData.append(dataArr[i][0], dataArr[i][1]);
            }

        } catch (error) {
            console.log('Error unexpected! Method[GenerateFormData] Ex[Below]');
            console.log(error);
        }
        return formData;
    }

    function getFileUploadExtension(fileName) {
        var fileExtension = '';
        try {
            fileExtension = fileName.replace(/^.*\./, '');
        } catch (err) { };
        return fileExtension;
    }

    function createFormDataItem(fieldName, fieldValue) {

        var data = {};
        data[fieldName] = fieldValue;
        return data;
    }

    function GetSaveDraftEmail() {
        var target = $("#ffLookupDialog");

        if (inIframe() && fs.EH.isParentAccessible()) {
            var email = prompt(fs.Utils.getSecureValueAsText(ffPrompt_EnterSaveEmail));
            if (email != null && email != "") {
                alert(ffPrompt_SaveEmailConfirm);
                $('#dvFastForms #draftEmail').val(email);
                PostFormData();
            }
        } else {


            var formWidth = $('#dvFastForms .ff-form-main').css('max-width').replace('px', '');

            $(target).dialog({
                position: ffDialogPositionOption,
                height: 300,
                width: formWidth,
                modal: true,
                id: 'dvFastForms',
                dialogClass: 'ff-form-main',
                show: {
                    effect: "fade",
                    duration: 350
                },
                hide: {
                    effect: "fade",
                    duration: 350
                },
                buttons: {
                    "OK": {
                        click: function () {
                            var email = $(this).find('#ffSaveDraftEmail').val();
                            if (email != "") {
                                $(this).dialog('close');
                                ShowConfirmationPopup(ffPrompt_SaveEmailConfirm);
                                $('#dvFastForms #draftEmail').val(email);                                
                                PostFormData();
                            } else {
                                ShowValidationMessage($(this).find('#ffSaveDraftEmail'), "REQUIRED");
                            }
                        },
                        text: 'OK',
                        'class': 'ff-btn-submit'
                    },
                    "Cancel": {
                        click: function () {
                            $(this).dialog('close');
                        },
                        text: 'Cancel',
                        'class': 'ff-btn-submit'
                    }
                }
            }).siblings('.ui-dialog-titlebar').remove();

            $(target).html($('<div class="ff-item-row">' +
                '   <div class="ff-col-1 ff-label-col">' +
                '        <label data-vatt="STRING" class="ff-label">'+fs.Utils.getSecureValueAsText(ffPrompt_EnterSaveEmail)+'</label>' +
                '   </div>' +
                '</div>' +
                '<div class="ff-item-row">' +
                '   <div class="ff-col-1 ff-label-col">' +
                '       <label data-vatt="STRING" for="ffSaveDraftEmail" class="ff-label" id="lblSaveDraftEmail">' +
                '         E-mail Address:' +
                '       </label>' +
                '       <span class="requiredSpan ff-required-mark">*</span>' +
                '   </div>' +
                '   <div class="ff-col-2 ff-field-col">' +
                '       <input type="textbox" id="ffSaveDraftEmail" name="ffSaveDraftEmail" data-vatt="STRING" class="ff-input-type ff-type-text" maxlength="50" value="" />' +
                '   </div>' +
                '</div>'));
            $(".ff-ui-dialog-titlebar").hide();
            $(".ff-ui-dialog").attr('id', 'dvFastForms');
        }
    }


    window.DiscardDraft = function DiscardDraft() {
        var target = $("#dialog");

        if (inIframe() && fs.EH.isParentAccessible()) {
            var res = confirm("Are you sure you want to discard this saved form? This action cannot be undone.");
            if (res == true) {
                $('#dvFastForms #isDraft').val('False');
                $('#dvFastForms #draftSaved').val('False');
                DiscardFormData();
            }
        } else {

            $(target).dialog({
                position: ffDialogPositionOption,
                autoResize: true,
                modal: true,
                id: 'dvFastForms',
                dialogClass: 'ff-form-main',
                show: {
                    effect: "fade",
                    duration: 350
                },
                hide: {
                    effect: "fade",
                    duration: 350
                },
                buttons: {
                    "Yes": {
                        click: function () {
                            $(this).dialog('close');
                            $('#dvFastForms #isDraft').val('False');
                            $('#dvFastForms #draftSaved').val('False');
                            DiscardFormData();
                        },
                        text: 'Yes',
                        'class': 'ff-btn-submit'
                    },
                    "No": {
                        click: function () {
                            $(this).dialog('close');
                        },
                        text: 'No',
                        'class': 'ff-btn-submit'
                    }
                }
            }).siblings('.ui-dialog-titlebar').remove();

            $(target).html("Are you sure you want to discard this saved form?<br /> This action cannot be undone.");
            $(".ff-ui-dialog-titlebar").hide();
            $(".ff-ui-dialog").attr('id', 'dvFastForms');
        }
    }

    function GetFormNamespace(endsWith) {
        var nsprefix = '';
        if (window.FS_FormConfiguration["FormNSPrefix"] !== undefined) {
            if (window.FS_FormConfiguration["FormNSPrefix"] != '') {
                nsprefix = window.FS_FormConfiguration["FormNSPrefix"] + endsWith;
            }
        } else {
            nsprefix = 'VisualAntidote' + endsWith;;
        }
        return nsprefix;
    }

    function DiscardFormData() {
        formLogger('[DiscardFormData]');
        ($).support.cors = true;
        var sessionId = $("#dvFastForms #txtSessionID").val();
        if (isNativeCloud()) {
            sessionId = encodeURIComponent(sessionId);
        }
        var discardUrl = getURLEndPoint(enumEndpoint.DISCARD_DRAFT) + '?sid=' + sessionId;
        if (window.XDomainRequest) {
            // Use Microsoft XDR
            formLogger('[DiscardFormData][XDomainRequest]');
            var xdr = new XDomainRequest();
            //IE9 needs these 4 method and 1 attribute even if we don't use them
            xdr.timeout = XDR_TIMEOUT_MILLISECONDS;
            xdr.onerror = function () { console.log('Error unexpected on XDR! Method[DiscardFormData].') };
            xdr.ontimeout = function () { console.log('Time out error on XDR! Method[DiscardFormData].') };
            xdr.onprogress = function () { };
            xdr.onload = function () {
                formLogger('[DiscardFormData][XDomainRequest][onload]');

                ShowConfirmationPopup(ffPrompt_SavedFormDiscarded);
                $('#dvFastForms #draftSaved').val('False');
                $('#dvFastForms #isDraft').val('False');
                $('#dvFastForms #btndiscard').hide();
                ResetFormData(true);
            };
            xdr.open("POST", parseURLForXDR(discardUrl));
            xdr.send();

        } else if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
            //To process ajax post in Salesforce pages in IE 11 
            console.log('[DiscardFormData][IE11-SF][XMLHttpRequest]');
            var oReq = null;
            if (Sarissa && Sarissa.originalXMLHttpRequest) {
                oReq = new Sarissa.originalXMLHttpRequest();
            } else if (window.XMLHttpRequest) {
                oReq = new XMLHttpRequest();
            }

            oReq.open("POST", discardUrl, true);
            oReq.onreadystatechange = function () {

                if (oReq.readyState == 4 && oReq.status == 200) {
                    formLogger('[DiscardFormData][IE11-SF][XMLHttpRequest][result]');
                    ShowConfirmationPopup(ffPrompt_SavedFormDiscarded);
                    $('#dvFastForms #draftSaved').val('False');
                    $('#dvFastForms #isDraft').val('False');
                    $('#dvFastForms #btndiscard').hide();
                } else if (oReq.readyState == 4 && oReq.status != 200) {
                    console.log(' Service call status:' + oReq.status);
                }
            }
            oReq.send();

        } else {
            // Make $ AJAX call.
            $.ajax({
                global: false,
                type: "POST",
                crossDomain: true,
                url: discardUrl,
                processData: false,
                success: function (data) {
                    ShowConfirmationPopup(ffPrompt_SavedFormDiscarded);
                    $('#dvFastForms #draftSaved').val('False');
                    $('#dvFastForms #isDraft').val('False');
                    $('#dvFastForms #btndiscard').hide();

                },
                error: function (request, status, error) {
                    ShowConfirmationPopup(ffPrompt_SavedFormDiscarded);
                    $('#dvFastForms #draftSaved').val('False');
                    $('#dvFastForms #isDraft').val('False');
                    $('#dvFastForms #btndiscard').hide();
                }
            });
        }


    }


    window.SubmitData = function SubmitData(isDraft) {

        if (isDraft == true) {
            $('#dvFastForms #isDraft').val('True');

            if (getNullSafeLowerCase($('#dvFastForms #draftSaved').val()) != 'true') {
                GetSaveDraftEmail();
            } else {
                PostFormData();
            }
        } else {

            if ($('#submitRules') !== undefined) {
                var rules = $('#submitRules').val();
                if (rules !== undefined && rules !== "") {
                    var ruleArr = rules.split(',').map(function (item) { return parseInt(item, 10); });
                    ExecEvaluateRules(ruleArr);
                }
            }

            if (!hasGeneralError) {
                $('#dvFastForms #btnsubmit').prop('disabled', true);
                fs.EH.setFormValid(true);

                var result = ExecBeforeSave();

                if (result == true)
                    ValidateForm();



            } else {
                hasGeneralError = false;
            }
        }
    }

    function ShowConfirmationPopup(msg) {

        try {
            var target = $("#dialog");

            if (inIframe() && fs.EH.isParentAccessible()) {
                target = parent.$('#dialog');
            }

            $(target).dialog({
                position: { my: "center", at: "center", of: "#dvBannerHTML" },
                autoResize: true,
                modal: true,
                id: 'dvFastForms',
                dialogClass: 'ff-form-main',
                show: {
                    effect: "fade",
                    duration: 350
                },
                hide: {
                    effect: "fade",
                    duration: 350
                },
                buttons: {
                    "OK": {
                        click: function () {
                            $(this).dialog('close');
                        },
                        text: 'OK',
                        'class': 'ff-btn-submit'
                    }
                }
            }).siblings('.ff-ui-dialog-titlebar').remove();

            $(target).html(msg);
            $(".ff-ui-dialog-titlebar").hide();
            $(".ff-ui-dialog").attr('id', 'dvFastForms');

        } catch (ex) {
            alert(msg);
        }
    }

    function ShowErrorPopup(msg) {
        try {
            var target = $("#dialog");

            if (inIframe() && fs.EH.isParentAccessible()) {
                target = parent.$('#dialog');
            }

            $(target).html(msg);
            $(target).dialog({
                position: ffDialogPositionOption,
                title: "Error",
                show: {
                    effect: "fade",
                    duration: 500
                },
                hide: {
                    effect: "fade",
                    duration: 500
                },
                buttons: {
                    OK: function () {
                        $(this).dialog("close");
                    }
                }
            });
        } catch (ex) {
            formLogger('[ShowErrorPopup] ' + msg);
            alert(msg);
        }
    }

    function RenderCalendar(th) {
        switch ($(th).attr("data-vatt")) {
            case "date":
            case "datetime":
            case "DATE":
            case "DATETIME":
                if (!$(th).prop('disabled')) {
                    if ($(th).data('datepicker') !== undefined) {
                        $(th).datetimepicker('destroy');
                    }
                    $(th).removeClass('hasDatepicker');

                    var nm = GetName($(th));

                    if ($(th).attr("data-vatt").toLowerCase() == 'datetime') {
                        $(th).datetimepicker({
                            addSliderAccess: true,
                            sliderAccessArgs: { touchonly: false },
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: window.fs_formLocalejQueryDate,
                            timeFormat: window.fs_formLocalejQueryTime,
                            yearRange: "-100:+10",
                            onSelect: function () {
                                $(this).trigger('keyup');
                                $(this).blur();
                            },
                            beforeShow: function () {
                                setTimeout(function () {
                                    fs.EH.InitializeIframe();
                                }, 100);
                            }
                        });
                    } else {
                        $(th).datetimepicker({
                            showTimepicker: false,
                            addSliderAccess: true,
                            sliderAccessArgs: { touchonly: false },
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: window.fs_formLocalejQueryDate,
                            yearRange: "-100:+10",
                            onSelect: function () {
                                $(this).trigger('keyup');
                                $(this).blur();
                            },
                            beforeShow: function () {
                                setTimeout(function () {
                                    fs.EH.InitializeIframe();
                                }, 100);
                            }
                        });
                    }
                }
                break;
        }
    }
    // Utility methods start
    function _SafeBoolean(booleanValue, defaultValue) {
        var returnBool = defaultValue;
        try {

            if (booleanValue == "true" || booleanValue == 'True' || booleanValue == true) {
                returnBool = true;
            } else if (booleanValue == "false" || booleanValue == 'False' || booleanValue == false) {
                returnBool = false;
            }
        } catch (err) { }
        return returnBool;
    }
    function _SafeString(stringValue, defaultValue) {
        var returnString = defaultValue;
        try {

            if (stringValue !== undefined && stringValue !== '') {
                returnString = stringValue;
            }
        } catch (err) { }
        return returnString;
    }
    // Utility methods end
    function InitializeJSCode() {

        if (isClassic()) {
            return;
        }

        if ($('#jsCode').val() !== undefined && $('#jsCode').val() != '') {
            var JS = document.createElement('script');
            JS.setAttribute("id", "FF_JSAPI");
            var JStext = safeJSCode($('#jsCode').val());
            if (typeof customSafeJSCode == 'function') {
                JStext = customSafeJSCode(JStext);
            }

            if (JStext.indexOf('fsDisableNoConflict=true') == -1) {
                JStext = "if (!window.jQuery){ console.log('External jQuery not found. Loading FS4SF jQuery.'); " +
                    "try{ $ = fs; }catch(error){ console.log(error) }; try{ jQuery = fs; }catch(error){ console.log(error) }; } " +
                    JStext;
            }

            JS.text = JStext;

            if (JStext !== undefined && JStext != '') {
                document.body.appendChild(JS);
            }
        }
    }

    function safeJSCode(JStext) {
        if (JStext !== undefined && JStext != '') {
            JStext = JStext.replace(/&#39;/g, "'");
            JStext = JStext.replace(/&quot;/g, '"');
            JStext = JStext.replace(/&amp;/g, '&');
            JStext = JStext.replace(/&gt;/g, '>');
            JStext = JStext.replace(/&lt;/g, '<');
            JStext = JStext.replace(/&apos;/g, "'");
            JStext = JStext.replace(/&#38;/g, "&");
        } else {
            JStext = '';
        }
        return JStext;
    }

    function InitializeForm() {
        
        try {
            InitializeJSCode();
            if (!ExecBeforeRender()) {
                return;
            }
            if ($('#isHostedForm').val() == "True") {
                //set page title for hosted form
                $(document).prop('title', $('#dvFastForms #formName').val());
            }

            $('.ff-form-main').prepend('<div id="ffOverlay"></div>');

            $('#dvLoading').hide();
            $(document).ajaxStart(function () {
                //$('#dvLoadingSubmit').show();
                $('#ffOverlay').addClass('ff-overlay-image');
            }).ajaxStop(function () {
                //$('#dvLoadingSubmit').hide();
                $('#ffOverlay').removeClass('ff-overlay-image');
            });

            $(window).off('message');
            $(window).on('message', function (event) {
                HandlePostMessage(event);
            });
            $("#userTimeZone").val(new Date().getTimezoneOffset());
            try {

                var dtFormat = '';
                var userlcl = $('#userLocal').val();
                if (userlcl === undefined || userlcl == '') {
                    userlcl = 'default';
                }
                if (validUserLocals[userlcl] !== undefined && validUserLocals[userlcl] !== '') {
                    dtFormat = validUserLocals[userlcl];
                }
                $('#dateFormat').val(dtFormat);

            } catch (err) { }
            $("#dvFastForms").show();
            fs.Utils.addPolyfill();
            BindPaymentRulesEvents();
            ResetFormData(false);
            $("#userTimeZone").val(new Date().getTimezoneOffset());
            InitializeLookupFields();
            InitializeRepeatableSections();
            InitializePrefillOptions();
            fs.EH.initializeCheckboxes();
            InitializeStaticPrefillOptions();
            InitializeInformationFromSavedDraft();
            InitializeFileUpload();
            InitializePayment();
            InitializeSignature();
            InitializeFooter();
            fs.EH.InitializeLogo();
            InitializePages();
            $(fsQ.S('#dvFastForms .ff-page-bread-header')).remove();
            fs.N.InitializeBreadcrumbs();
            fs.N.SetBreadcrumbWidth();
            BindRuleEvents();
            ExecuteInitialJS();
            fs.EH.InitializeIframe();
            setTimeout(function () {
                fs.EH.InitializeIframe();
            }, 100);

            if (getNullSafeLowerCase($('#dvFastForms #saveForLaterEnabled').val()) == "true" && getNullSafeLowerCase($('#dvFastForms #draftSaved').val()) == "true") {
                if(isNativeCloud()){
                    var fsListFileUploaded =  $('#fsListFileUploadedJSON').val();
                    if (typeof fsListFileUploaded !== 'undefined' ){
                        fsListFileUploaded = $.parseJSON(fsListFileUploaded);
                    }
                }
                
                if (typeof ffFileUploadJson !== 'undefined') {
                    ValidateFileUploads(ffFileUploadJson);
                }
                
                if (typeof fsListFileUploaded !== 'undefined') {
                    fs.FileService.loadFileUploadedFieldOnPageLoad(fsListFileUploaded);
                }

                ExecEvaluateRules();
            }


            if (!isNullOrEmpty($('#txtUserContentId').val())) {

                $('.ff-form-main .btnDiv').remove();
                $('.ff-form-main').find('.ff-page-row').filter("[page-ishidden=true],[data-page-ishidden=true]").show();
                $('.ff-form-main').find('.ff-page-bread').remove();
                $('.ff-form-main').css('pointer-events', 'none');
                ExecEvaluateRules();
                //show SF validation errors

                $(".ff-form-main input, textarea, select").each(function () {
                    if ($(this).data('sferr')) {
                        ShowValidationMessage(this, "GENERAL", $(this).data('sferr'));
                    }
                });

            }

            if (getNullSafeLowerCase($('#dvFastForms #saveForLaterEnabled').val()) == "true" && getNullSafeLowerCase($('#dvFastForms #isDraft').val()) != "true" && getNullSafeLowerCase($('#dvFastForms #draftSaved').val()) == "true") {
                setTimeout(function () {
                    ShowConfirmationPopup(ffPrompt_InvalidSavedForm);
                }, 100);

            }
            //evaluate any custom formulas within default values
            $(".ff-form-main input, textarea, select").each(function () {
                if ($(this).val() != null && $(this).val().length > 0)
                    $(this).val(fs.EH.EvaluateCustomFormula($(this).val()));
            });
        } catch (err) {
            console.trace('Log InitializeForm :' + err);
            throw Error('ERROR [InitializeForm]' + err);
        }
    }

    function getNullSafeLowerCase(valueTolowercase) {
        return (valueTolowercase !== undefined && valueTolowercase != null) ? valueTolowercase.toLowerCase() : '';
    }

    function getSafeBoolean(booleanValue, defaultValue) {
        var returnBool = defaultValue;
        try {

            if (booleanValue !== undefined) {
                if (booleanValue + ''.toLowerCase() == 'true') {
                    returnBool = true;
                } else if (booleanValue + ''.toLowerCase() == "false") {
                    returnBool = false;
                }
            }
        }
        catch (err) { }
        return returnBool;
    }

    function InitializeFooter() {        
        var dvFSQElem = fsQ.S('#dvFastForms');
        if (fsQ.find('#btnsubmit',dvFSQElem).length==0) {
            //if there is already a submit button, we're working with a legacy form
            //no need to render the footer
            var ffFooterGroup = $('<div class="ff-footer-group"></div>');
            var ffFooterRow = $('<div class="ff-item-row ff-footer-row"></div>');
            var ffSubmitDiv = $('<div class="ff-submit-btn">');
            var footnoteDiv = $('<div class="footnoteDiv"></div>');
            var requiredSpan = $('<span class="requiredSpan  ff-footnote ff-required-mark">*</span>');
            var ffFootnoteLabel = $('<label class="ff-footnote-label ff-label">- required</label>');
            var btnDiv = $('<div class="btnDiv">');
            var btnSubmit = $('<input type="button" class="sectionHeader ff-btn-submit" id="btnsubmit">');
            $(btnSubmit).attr("value", fsQ.S('#dvFastForms #submitBtnText').val());
            $(btnSubmit).attr("data-btnmessage", fsQ.S('#dvFastForms #submitMessage').val());
            $(btnSubmit).attr("data-btnurl", fsQ.S('#dvFastForms #submitUrl').val());

            $(btnDiv).append(btnSubmit);

            if (getNullSafeLowerCase(fsQ.S('#dvFastForms #saveForLaterEnabled').val()) == "true") {

                var btnDiscard = $('<input type="button" class="sectionHeader ff-btn-submit" id="btndiscard">')
                $(btnDiscard).attr("value", fsQ.S('#dvFastForms #discardBtnText').val());
                $(btnDiv).prepend(btnDiscard);
                if (fsQ.S('#dvFastForms #isDraft').val().toLowerCase() != "true") {
                    $(btnDiscard).hide();
                }
                var btnSave = $('<input type="button" class="sectionHeader ff-btn-submit" id="btnsave">')
                $(btnSave).attr("value", fsQ.S('#dvFastForms #saveBtnText').val());
                $(btnDiv).prepend(btnSave);

            }
            $(footnoteDiv).append(requiredSpan);
            $(footnoteDiv).append(ffFootnoteLabel);
            $(ffSubmitDiv).append(footnoteDiv);
            $(ffSubmitDiv).append(btnDiv);

            $(ffFooterRow).append(ffSubmitDiv);
            $(ffFooterGroup).append(ffFooterRow);
            fsQ.S('#dvFastForms .ff-form-main').append(ffFooterGroup);
            fs(fsQ.S('#btnsubmit')).bind("click", function () {
                console.log('INFO [SubmitData]');
                SubmitData(false);
            });
            if (fsQ.S('#dvFastForms #saveForLaterEnabled').val().toLowerCase() == "true") {
                fs(fsQ.S('#btnsave')).bind("click", function () {
                    SubmitData(true);
                });
                fs(fsQ.S('#btndiscard')).bind("click", function () {
                    DiscardDraft();
                });
            }
        }        
    }

    function AddLegacyAttributesToPageRootElements() {
        /// add data-page-ishidden attribute and set to false by default. New code will use data-page-ishidden instead of legacy page-ishidden attribute since the release of LockerService 
        var dvFSQElem = fsQ.S('#dvFastForms');
        $(fsQ.find('.ff-page-row',dvFSQElem)).each(function (indx, elem) {
            console.log('ELEMENT FF :' + $(elem));
            if ($(elem).attr("page-ishidden") === undefined && $(elem).attr("data-page-ishidden") === undefined) {
                console.log('elem:' + $(elem).attr("id"));
                $(elem).attr("data-page-ishidden", false);
            }
        });
    }

    function InitializePages() {
        var dvFSQElem = fsQ.S('#dvFastForms');
        if (fs.N.isMultiPageEnabled(dvFSQElem)) {
            AddLegacyAttributesToPageRootElements();
            var allVisiblePages = fs.N.allFormPagesWithLegacyCheck(null, true, false);
            //hiding all but the first page  
            $(allVisiblePages).filter(':not(:first)').hide();
    
            //hiding all default hidden pages
            $(fsQ.find('.ff-page-row',dvFSQElem)).filter("[page-ishidden=true],[data-page-ishidden=true]").hide();
    
            var btnPrev = $('<input type="button" class="sectionHeader ff-btn-submit ff-btn-prev" id="btnprev">')
            var btnNext = $('<input type="button" class="sectionHeader ff-btn-submit ff-btn-next" id="btnnext">')
    
            
            $(btnPrev).val($(fsQ.find('#prevBtnText',dvFSQElem)).val());
            $(btnNext).val($(fsQ.find('#nextBtnText',dvFSQElem)).val());
    
            var btnDivElem = fsQ.find('.btnDiv',dvFSQElem);
            $(btnDivElem).append(btnPrev);
            $(btnDivElem).append(btnNext);

            var btnPrevElem = fsQ.find('#btnprev',dvFSQElem);
            var btnNextElem = fsQ.find('#btnnext',dvFSQElem);
            $(btnPrevElem).hide();
            $(btnNextElem).hide();
            $(btnPrevElem).bind('click', function () {
                console.log('INFO [FFPrevPage]');
                fs.N.FFPrevPage();
            });
            $(btnNextElem).bind('click', function () {
                console.log('INFO [FFNextPage]');
                fs.N.FFNextPage();
            });
            var numPages = $(allVisiblePages).length;
            if (numPages > 1) {
                $(fsQ.find('#btnsubmit',dvFSQElem)).hide();
                $(btnNextElem).show();
            }
    
        } else {
            fsQ.S('#dvFastForms .ff-page-bread-header').remove();
            fsQ.S('#dvFastForms .ff-page-header-row').remove();
        }
    }
    function InitializePayment() {

        if (isNativeCloud() || document.getElementsByClassName('ff-payment-wrapper').length == 0) {
            return;
        }

        if (document.location.protocol != 'https:' && !$('#dvFastForms .ff-payment-wrapper').hasClass('ff-test-mode')) {
            $('#dvFastForms .ff-payment-wrapper').remove();
            //TODO: Notify the admin via email about the form not being secure
        } else {
            //set expiry years
            $("#dvFastForms .ff-yyyy").each(function () {
                var currYear = (new Date).getFullYear();

                for (var i = 0; i < 15; i++) {
                    $(this)
                        .append($('<option>', { value: currYear + i })
                            .text(currYear + i));
                }
            });
            //set expiry months
            $("#dvFastForms .ff-mm").each(function () {
                for (var i = 1; i <= 12; i++) {
                    if (i < 10) {
                        $(this)
                            .append($('<option>', { value: "0" + i })
                                .text("0" + i));
                    } else {
                        $(this)
                            .append($('<option>', { value: i })
                                .text(i));
                    }
                }
            });

            //add onblur event to CC
            //to show credit card type
            $("#dvFastForms .ff-creditcard").blur(function () {
                ShowCardType(this);
            });

            $("#dvFastForms .ff-taxes").each(function () {
                var fieldNum = $(this).attr('id').replace('FFTaxes', '');
                var subtotalVal = ToAmount($('#FFAmount' + fieldNum).text());
                var taxVal = ToAmount($(this).data('taxes'));
                $(this).text(ToAmount(subtotalVal * (taxVal / 100)));
            });

            UpdatePaymentTotals();
        }
    }

    function ShowCardType(elem) {
        var cardType = '';
        $(elem).parent().find('.imgCardType').remove();

        // visa
        var re = new RegExp("^4");
        if ($(elem).val().match(re) != null)
            cardType = "visa";

        // Mastercard
        re = new RegExp("^5[1-5]");
        if ($(elem).val().match(re) != null)
            cardType = "mastercard";

        // AMEX
        re = new RegExp("^3[47]");
        if ($(elem).val().match(re) != null)
            cardType = "amex";

        // Discover
        re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
        if ($(elem).val().match(re) != null)
            cardType = "discover";

        // Diners
        re = new RegExp("^36");
        if ($(elem).val().match(re) != null)
            cardType = "diners";

        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if ($(elem).val().match(re) != null)
            cardType = "diners";

        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if ($(elem).val().match(re) != null)
            cardType = "jcb";

        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if ($(elem).val().match(re) != null)
            cardType = "visaelectron";

        if (cardType != "")
            $(elem).after($('<img>', { src: window.FormBASEURL + 'Styles/images/' + cardType + '.png' }).addClass('imgCardType'));
    }

    function InitializeLookupFields(list) {
        //List can either be a single element, or an array of elements.
        if(typeof(list) == 'undefined'){
            list = document.getElementsByClassName('lookup-link');
        }
        else if(list.length === undefined){
            list = [list]; //We iterate through an array later.
        }

        for(var i = 0; i < list.length; i++) {
            //Insert this function only if this field is NOT readonly.
            if($(list[i].parentElement).find('input[type=hidden]')[0].getAttribute('readonly') !== 'readonly'){
                $(list[i]).removeAttr("onclick");
                ResetLookupFieldEvent(list[i]);
            }
            else{
                list[i].classList.add('ll-readonly');
            }
        }
        
    }

    function ResetLookupFieldEvent(lookupElemLink) {
        $(lookupElemLink).bind("click", function () {
            openLookupPopup(this);
        });
    }

    /*Functions to initialize repeatable sections starts*/
    function InitializeRepeatableSections() {
        window.DataMatrixArrayMap = $.FFMatrixHelper.getUniqueDataMatrixArrayMap();

        var repeatableSection = $(fsQ.S('#dvFastForms .ff-sec-repeat-wrapper')).parent();
        if (repeatableSection.length === 0) { return; }


        fsQ.forEach(repeatableSection, function (parentRepeatElem) {
            var repeatableSectionWrapper = $(fsQ.find('.ff-sec-repeat-wrapper', parentRepeatElem));
            $(repeatableSectionWrapper).each(function (rindex, repeatElem) {

                var resetID = true;

                if($('#dvFastForms #isDraft').val().toLowerCase() == "true" && isClassic()){
                    resetID = false;
                }

                SetRepeatableSectionIDs(repeatElem, rindex + 1, resetID);
                ResetRepeatedSectionItem(repeatElem, true);
            });

            var minItems = safeInt($(parentRepeatElem).data('min'), ff_SectionRepeatMinCount);
            var initialCount = 1;
            if ($(parentRepeatElem).find('.ff-sec-repeat-wrapper').length > 1) {
                initialCount = $(parentRepeatElem).find('.ff-sec-repeat-wrapper').length;
            }
            for (var i = initialCount; i < minItems; i++) {
                AddToRepeatableSection($(parentRepeatElem).find('.ff-sec-repeat-wrapper').last().find('a.ff-add'));
            }
            var numItems = $(parentRepeatElem).find('.ff-sec-repeat-wrapper').length;
            if (numItems === minItems)
                $(parentRepeatElem).find('.ff-sec-repeat-wrapper').last().find('a.ff-remove,.link-divider').hide();

        });
    }

    function SetRepeatableSectionIDs(repeatElem, num, resetId) {
        console.log('resetting repeated section ids');
        // We only want to set the IDs if we're not doing a first load of a draft
        // because they'll already be set.
        if (resetId === true) {
            
            if (isNullOrEmpty($(this).attr("data-rid"))) {
                
                var repeatElements = $(fsQ.find('.ff-item-row .ff-col-2>input,'
                +'.ff-item-row  .ff-col-2>textarea,'
                +'.ff-item-row  .ff-col-2>select,'
                +'.ff-item-row  .ff-col-2>.lookup-link,'
                +'.ff-item-row div[data-vatt="CAPTCHA"]', repeatElem));
                
                fsQ.forEach(repeatElements,function (currentItem) {
                    var inputId = $(currentItem).attr('id');
                    var label = $(currentItem).parent().parent().find("label[for='" + inputId + "']");
                    var newId = inputId;
                    var arr = inputId.split(".");
                    if (arr.length == 4) {
                        arr[2] = arr[2][0] + "_" + num + "_";
                        newId = arr.join('.');
                    } else if (arr.length == 1) {
                        arr = inputId.split("__");
                        newId = arr[0] + "__" + num;
                    }
                    
                    $(currentItem).attr('id', newId);
                    $(currentItem).attr('name', newId);

                    $(label).attr('for', newId);
                    $(label).attr('id', $(label).attr('id') + "_" + num);

                });
                console.log('[SetRepeatableSectionIDs] resetting repeated section ids');
            }
            if ($(repeatElem).find(".ff-esignature-wrapper").length >= 1) {
                $(repeatElem).find(".ff-esignature-wrapper").each(function (indx, signWrapElement) {
                    assignSignatureElementIds(signWrapElement, num);
                    InitializeSignatureElement(signWrapElement);
                });
            }
            
        }
        var repeatElemParent = $(repeatElem).parent();
        var addLinkText = ff_AddAnotherSectionLink;
        var removeLinkText = ff_RemoveSectionLink;
        if (!isNullOrEmpty($(repeatElemParent).attr('data-addlink'))) {
            addLinkText = $(repeatElemParent).attr('data-addlink');
        }
        if (!isNullOrEmpty($(repeatElemParent).attr('data-removelink'))) {
            removeLinkText = $(repeatElemParent).attr('data-removelink');
        }
        $(repeatElem).find('.rsec-footer-row').remove();
        $(repeatElem).append(getRepeatableSectionFooterHTML(addLinkText, removeLinkText));
        resetAddRemoveLinksForRepeatedSections(repeatElem, false);
    }
    
    function resetAddRemoveLinksForRepeatedSections(repeatElem, isParentElem) {
        /*it hide/show the add/remove links from all the repeated section items accordingly*/
        var targetElem = $(repeatElem);

        if (!isParentElem) {
            targetElem = $(repeatElem).parent();
        }
        var maxItems = safeInt($(targetElem).data('max'), ff_SectionRepeatMaxCount);
        var minItems = safeInt($(targetElem).data('min'), 1);
        var currNumItems = $(targetElem).find('.ff-sec-repeat-wrapper').length;
        $(targetElem).find('.ff-sec-repeat-wrapper').find('.ff-add,.link-divider').hide();
        if ($(targetElem).find('.ff-sec-repeat-wrapper').length > 1) {
            $(targetElem).find('.ff-sec-repeat-wrapper').each(function (rindx, repElem) {
                if (rindx >= minItems) {

                    $(repElem).find('.ff-remove').show();
                } else {

                    $(repElem).find('.ff-remove').hide();
                    $(repElem).find('.link-divider').hide();
                }
            });
        }
        if (currNumItems < maxItems) {
            $(targetElem).find('.ff-sec-repeat-wrapper:last-child').find('.ff-add,.link-divider').removeAttr('style');
            if (!$(targetElem).find('.ff-sec-repeat-wrapper:last-child').find('.ff-remove').is(':visible'))
                $(targetElem).find('.ff-sec-repeat-wrapper:last-child').find('.link-divider').hide();
        }

        if (currNumItems <= minItems) {

            $(targetElem).find('.ff-sec-repeat-wrapper').find('.ff-remove').hide();
            $(targetElem).find('.ff-sec-repeat-wrapper').find('.link-divider').hide();
        }

    }


    window.AddToRepeatableSection = function AddToRepeatableSection(elemSource, init) {
        var section = $(elemSource).parents('.ff-sec-repeat-wrapper'); //$('#dvFastForms #' + sectionId);
        var maxItems = safeInt($(section).parent().data('max'), ff_SectionRepeatMaxCount);
        var minItems = safeInt($(section).parent().data('min'), 1);
        var currNumItems = $(section).parent().find('.ff-sec-repeat-wrapper').length;

        if (maxItems == "" || currNumItems < maxItems) {
            var lastItem = $(section).parent().find('.ff-sec-repeat-wrapper').eq(currNumItems - 1);
            var newItem = $(lastItem).clone().appendTo($(section).parent());
            if ($(newItem).find('.ff-esignature-wrapper').length > 0) {
                clearSignatureCanvas($(newItem).find('.ff-signwrapper.ff-drawn .doc-sign-name'));
                clearSignatureCanvas($(newItem).find('.ff-signwrapper.ff-drawn .doc-sign-date'));
                clearSignatureCanvas($(newItem).find('.ff-signwrapper.ff-typed .doc-sign-name'));
                clearSignatureCanvas($(newItem).find('.ff-signwrapper.ff-typed .doc-sign-date'));
                $(newItem).find('.docsignWrapper .typedSignName').html('');
                $(newItem).find('.docsignWrapper .typedSignDate').html('');
                $(newItem).find('.docsignWrapper .ffsignature').val('');
                $(newItem).find('.docsignWrapper .ffdate').val('');

            }
            if (init === undefined) {
                $(newItem).removeAttr('data-rid');
                $(newItem).removeAttr('data-rval');                
            }
            $.FFMatrixHelper.resetMatrixDataOnElements(newItem,window.DataMatrixArrayMap);
            SetRepeatableSectionIDs($(section).parent().find('.ff-sec-repeat-wrapper').last(), currNumItems + 1, true);
            ResetRepeatedSectionItem($(section).parent().find('.ff-sec-repeat-wrapper').last(), false);
            currNumItems++;
        }

        if (currNumItems > minItems) {
            $(section).parent().find('.ff-sec-repeat-wrapper').each(function (dindx, ritem) {
                if (minItems < (dindx + 1)) {
                    $(ritem).find('.ff-remove').show();
                } else {
                    $(ritem).find('.ff-remove').hide();
                }
            });
        }

        fs.EH.InitializeIframe();
    }

    function clearSignatureCanvas(elem) {
        if (elem !== undefined) {
            try {
                $(elem).signaturePad().clearCanvas();
            } catch (err) {
                //	console.log(' Trying to clear signature canvas:'+err);
            }
        }

    }
    window.RemoveFromRepeatableSection = function RemoveFromRepeatableSection(elemSource) {
        var section = $(elemSource).parents('.ff-sec-repeat-wrapper');
        var minItems = safeInt($(section).parent().data('min'), ff_SectionRepeatMinCount);
        var currNumItems = $(section).parent().find('.ff-sec-repeat-wrapper').length;
        var parentElem = $(section).parent();
        if ((minItems == "" || currNumItems > minItems) && currNumItems > 1) {
            $(section).remove();
            $(parentElem).find('.ff-sec-repeat-wrapper').each(function (rindex, repeatElem) {
                SetRepeatableSectionIDs(repeatElem, rindex + 1, true);
            });
        }
        BindRepeatedSectionEvents(parentElem);
        fs.EH.InitializeIframe();
    }

    function BindRepeatedSectionEvents(repeatElem) {
        $(repeatElem).find(".lookup-link").each(function () {
            $(this).removeAttr("onclick");
            $(this).unbind("click");
            InitializeLookupFields(this);
        });
        $(repeatElem).find("input[data-rules],select[data-rules]").each(function () {
            if ($(this).attr("change") === undefined) {
                $(this).unbind("change");
                $(this).bind("change", function () {
                    var rules = $(this).attr("data-rules");
                    var ruleArr = rules.split(',').map(function (item) { return parseInt(item, 10); });
                    console.log("[EvaluateInlineARR]:" + ruleArr);
                    ExecEvaluateRules(ruleArr, this);
                });
            }
        });
        $(repeatElem).find(".ff-alink").each(function (indx, item) {
            $(this).removeAttr("onclick");
            $(this).unbind("click");
            if ($(item).hasClass("ff-remove")) {
                $(this).bind("click", function () {
                    RemoveFromRepeatableSection(this);
                });
            } else {
                $(this).bind("click", function () {
                    AddToRepeatableSection(this);
                });
            }
        });
    }

    function getRepeatableSectionFooterHTML(addtext, removetext) {
        return '<div class="ff-item-row rsec-footer-row"><a class="ff-alink ff-remove" href="javascript:" title="' + removetext + '">' + removetext + '</a><span class="link-divider">/</span><a class="ff-alink ff-add" href="javascript:" title="' + addtext + '">' + addtext + '</a></div>';
    }
    /*Functions to initialize repeatable sections ends*/

    /*Repeatable section Helper methods start*/
    window.ReRenderCalendar = function ReRenderCalendar(elem) {
        if ($(elem).attr("data-vatt") != undefined && ($(elem).attr("data-vatt").toLowerCase() == 'datetime' || $(elem).attr("data-vatt").toLowerCase() == 'date')) {
            RenderCalendar(elem);
        }
    }
    window.ResetRepeatedSectionItem = function ResetRepeatedSectionItem(repeatElem, initialLoad) {
        $(repeatElem).find(".ff-item-row .ff-col-2>input,.ff-item-row .ff-col-2>textarea,.ff-item-row .ff-col-2>select").each(function () {
            var elementVisible = false;
            if ($(this).parent().parent().css('display') != 'none') { elementVisible = true; }
            switch ($(this).prop('type')) {
                case "file":
                    if (isNativeCloud()) {
                        clearFileElements(this);
                    } else {
                        if ($('#dvFastForms #isDraft').val().toLowerCase() != "true" && isNullOrEmpty($('#dvFastForms #txtUserContentId').val())) {
                            clearFileElements(this);
                        }
                    }
                    break;
                case "text":
                case "textbox":
                case "textarea":
                    $(this).parent().find('.custom-flex-control-container').remove();
                    $(this).parent().find('.select2-container').remove();
                    ReRenderCalendar(this);
                    fs.EH.initFlexControl(this, false);
                    break;
                case "radio":
                case "checkbox":
                    break;
                case "select-one":
                    $(this).parent().find('.custom-flex-control-container').remove();
                    $(this).parent().find('.select2-container').remove();
                    fs.EH.initFlexControl(this, false);
                    break;
                case "select-multiple":
                    $(this).parent().find('.custom-flex-control-container').remove();
                    $(this).parent().find('.select2-container').remove();
                    fs.EH.initFlexControl(this, false);
                    break;
            }
        });

        $(repeatElem).find("div[name=FileUploadLabel]").remove();
        /*Native Cloud only starts*/
        if (!initialLoad) {
            if ($(repeatElem).find("div[data-vatt='CAPTCHA']").length >= 1) {
                var recaptchaSiteKey = $('#recaptchaSiteKey').val();
                $(repeatElem).find('.ff-captcha').each(function (indx, colItem) {
                    $(colItem).find('div[data-vatt="CAPTCHA"]').find('>div').first().remove();
                    var cId = $(colItem).find('div[data-vatt="CAPTCHA"]').attr('id');
                    grecaptcha.render(cId, { 'sitekey': recaptchaSiteKey, 'callback': verifyCallback });
                });
            }
        }
        /*Native Cloud only ends*/
        BindRepeatedSectionEvents(repeatElem);
    }

    function setSignatureElementIdWithIndx(elemSource, elemIndx, prefix) {
        if (!isNullOrEmpty($(elemSource).attr('id'))) {
            var currentAttr = $(elemSource).attr('id').split('__')[0];
            currentAttr = currentAttr.replace(prefix, '');
            $(elemSource).attr('id', prefix + currentAttr + '__' + elemIndx);
        }
    }

    function setSignatureElementNameWithIndx(elemSource, elemIndx, prefix) {
        if (!isNullOrEmpty($(elemSource).attr('name'))) {
            var currentAttr = $(elemSource).attr('name').split('__')[0];
            currentAttr = currentAttr.replace(prefix, '');
            $(elemSource).attr('name', prefix + currentAttr + '__' + elemIndx);
        }
    }

    function assignSignatureElementIds(parentElement, signatureIndex) {
        setSignatureElementIdWithIndx($(parentElement).find('.main-docsign-wrapper'), signatureIndex, '');
        setSignatureElementIdWithIndx($(parentElement).find('>input'), signatureIndex, '');
        setSignatureElementIdWithIndx($(parentElement).find('.main-docsign-wrapper .ff-chkagree input'), signatureIndex, '');
        setSignatureElementIdWithIndx($(parentElement).find('.main-docsign-wrapper .ff-email-verification .ff-col-2 .ff-type-text'), signatureIndex, '');
        $(parentElement).find('.ff-signwrapper').each(function (ind, signElement) {
            var signoptclass = 'signT';
            if ($(signElement).hasClass('ff-drawn')) {
                signoptclass = 'signD';
            }
            setSignatureElementIdWithIndx($(signElement).find('.docsignWrapper .ffsignature'), signatureIndex, signoptclass);
            setSignatureElementIdWithIndx($(signElement).find('.docsignWrapper .ffdate'), signatureIndex, signoptclass);
            setSignatureElementIdWithIndx($(signElement).find('.docsignWrapper .outputSignedName'), signatureIndex, signoptclass);
            setSignatureElementIdWithIndx($(signElement).find('.docsignWrapper .outputSignedDate'), signatureIndex, signoptclass);
            setSignatureElementNameWithIndx($(signElement).find('.docsignWrapper .ffsignature'), signatureIndex, signoptclass);
            setSignatureElementNameWithIndx($(signElement).find('.docsignWrapper .ffdate'), signatureIndex, signoptclass);
            setSignatureElementNameWithIndx($(signElement).find('.docsignWrapper .outputSignedName'), signatureIndex, signoptclass);
            setSignatureElementNameWithIndx($(signElement).find('.docsignWrapper .outputSignedDate'), signatureIndex, signoptclass);
        });
    }

    function replaceLegacyAttributes(dvFastFormsElement) {
        try {
            ['vatt','page-ishidden'].forEach(function(target){
                $(dvFastFormsElement).find('input['+target+'],textarea['+target+'],select['+target+'],span['+target+'],div['+target+']').each(function (indx, elem) {
                    var oldProperty = elem.getAttribute(target);
                    if(oldProperty !== null && oldProperty !== ''){
                        elem.setAttribute('data-'+target,oldProperty);
                    }
                });

            });

            //Legacy lookup "a" tag - swap from using <a>'s to the input tag instead.
            var lookupATags = $(dvFastFormsElement).find('a.lookup-link');
            lookupATags.each(function(){
                var lookupTextbox = $(this.parentElement).find('input[type=textbox]')[0];
                lookupTextbox.classList.add('lookup-link');
                lookupTextbox.title = 'Lookup';
            });
            //Remove a tags when done
            for(var i = 0;i<lookupATags.length;i++){
                lookupATags[i].parentElement.removeChild(lookupATags[i]);
            }

        } catch (err) {
            console.error('Error unexpected! Method[replaceLegacyAttributes] Ex[below]');
            console.error(err);
        }
    }

    function makeDvFastFormsInnerHtml(responseTextIn){
        var vDocument = document.implementation.createHTMLDocument('Title');
        vDocument.body.innerHTML = responseTextIn;
        replaceLegacyAttributes(vDocument);
        return vDocument;
    }

    function safeInt(intValue, defaultValue) {
        if (!isNaN(parseInt(intValue))) {
            return parseInt(intValue);
        }
        return defaultValue;
    }


    function GetHTML(htmlFrame) {
        var submittedData = null;
        if ($('#submittedData').length) {
            submittedData = $('#submittedData').val();
        }
        ($).support.cors = true;
        if (window.XDomainRequest) {
            // Use Microsoft XDR
            var xdr = new XDomainRequest();
            //IE9 needs these 4 method and 1 attribute even if we don't use them
            xdr.timeout = XDR_TIMEOUT_MILLISECONDS;
            xdr.onerror = function () { console.log('Error unexpected on XDR! Method[GetHTML].') };
            xdr.ontimeout = function () { console.log('Time out error on XDR! Method[GetHTML].') };
            xdr.onprogress = function () { };
            xdr.onload = function () {
                //See ajax function for why some text is being replaced
                if (isClassic()) {
                    $("#dvFastForms").html(makeDvFastFormsInnerHtml(xdr.responseText).body.innerHTML);
                } else {
                    var divhtml = $('<div/>').html(resultResponse);
                    if ($(divhtml).find('script:not([data-js="fastforms"])').length > 0) {
                        $(divhtml).find('script:not([data-js="fastforms"])').remove();
                    }
                    replaceLegacyAttributes(divhtml);
                    $("#dvFastForms").html($(divhtml).html());
                }
                InitializeForm();
                InitializeCaptcha();
            };
            xdr.open("post", parseURLForXDR(htmlFrame));
            xdr.send(submittedData);

        } else if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
            //To process ajax post in Salesforce pages in IE 11 
            console.log('[GetHTML][IE11-SF][XMLHttpRequest]');
            var oReq = null;
            if (Sarissa && Sarissa.originalXMLHttpRequest) {
                oReq = new Sarissa.originalXMLHttpRequest();
            } else if (window.XMLHttpRequest) {
                oReq = new XMLHttpRequest();
            }

            oReq.open("POST", htmlFrame, true);
            oReq.onreadystatechange = function () {

                if (oReq.readyState == 4 && oReq.status == 200) {
                    if (oReq.responseText && oReq.responseText.length > 0) {
                        //See ajax function for why some text is being replaced
                        if (isClassic()) {
                            $("#dvFastForms").html(makeDvFastFormsInnerHtml(oReq.responseText).body.innerHTML);
                        } else {
                            formLogger('[GetHTML][IE11-SF][XMLHttpRequest][Result]');

                            var divhtml = $('<div/>').html(oReq.responseText);

                            if ($(divhtml).find('script:not([data-js="fastforms"])').length > 0) {
                                $(divhtml).find('script:not([data-js="fastforms"])').remove();
                            }
                            replaceLegacyAttributes(divhtml);
                            $("#dvFastForms").html($(divhtml).html());
                        }
                        InitializeForm();
                        InitializeCaptcha();
                    } else {
                        console.log(' Service call exception' + oReq.responseText);
                    }
                } else if (oReq.readyState == 4 && oReq.status != 200) {
                    formLogger("[GetHTML][IE11-SF][XMLHttpRequest][Error][" + oReq.status + "][" + oReq.responseText + "]");
                }
            }
            oReq.send(submittedData);

        } else {
            ($).ajax({
                async: true,
                global: false,
                data: submittedData,
                type: "POST",
                url: htmlFrame,
                tryCount: 0,
                retryLimit: 3,
                context: document.body,
                success: function (responseText) {
                    /*Salesforce communities is blocking and removing non-standard attributes in tags (like page-ishidden)
                    modifying the text to use our modern attribute should work.
                    While the source of this problem was repaired, these lines are here for existing forms that won't be changed by the customer*/
                    var vDocument = makeDvFastFormsInnerHtml(responseText);
                    if (!isClassic()) {
                        if ($(vDocument).find('script:not([data-js="fastforms"])').length > 0) {
                            $(vDocument).find('script:not([data-js="fastforms"])').remove();
                        }
                    }
                    $("#dvFastForms").html(vDocument.body.innerHTML);
                    if(fs.Utils.getFSFormConfigProperty("IsSourceLightning",false)){
                        addInlineStyleFromHTML(vDocument.body.innerHTML);
                    }
                    InitializeForm();
                    InitializeCaptcha();
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (textStatus == 'timeout') {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            ($).ajax(this);
                            return;
                        }
                        return;
                    }
                }
            }); //ajax end
        }
    }

    function HandlePostMessage(e) {
        var vSendMessage = false;
        if (isClassic()) {
            var isFormstackDomain = e.originalEvent.origin === window.FormBASEURL.replace('/FormEngine/', '');
            var isStripeDomain = e.originalEvent.origin === 'https://hooks.stripe.com';

            if ((isFormstackDomain && e.originalEvent.data === '3DS-authentication-complete') ||
                (isStripeDomain && e.originalEvent.data.type === 'stripe-3ds-fallback')){
                fs.SPH.on3DSCompleteStripe();
                vSendMessage = false;
            } else if(isFormstackDomain){
                vSendMessage = true;
            }

        } else {
            var FormBASEURLTemp = window.FormBASEURL + 'endofurl';
            if (e.originalEvent.origin === FormBASEURLTemp.replace("/endofurl", "") || FormBASEURLTemp.indexOf(e.originalEvent.origin + '/') === 0) {
                vSendMessage = true;
            } else if (isCommunityForm()) {
                if (e.originalEvent.origin.indexOf('.livepreview.salesforce') != -1 || e.originalEvent.origin.indexOf('.preview.salesforce') != -1) {
                    vSendMessage = true;
                }
            }
        }

        if (vSendMessage) {
            var data = e.originalEvent.data || e.originalEvent.message;
            var json = $.parseJSON(data);
            switch (json.resultType) {
                case "CheckCaptcha":
                    fs.EH.setFormValid(true);
                    fs.EH.ResetFormValidation();
                    ValidateCaptcha(json.resultData);
                    ValidateFields(true);
                    if (fs.EH.isFormValid()) {
                        if ($('#dvFastForms .ff-payment-wrapper').length > 0 && $('#dvFastForms .ff-creditcard').filter(function () { return this.value.length > 0; }).length > 0) {
                            $('#dvFastForms form#form1').attr('action', getURLEndPoint(enumEndpoint.PAYMENT));
                            $('#dvFastForms form#form1').trigger('submit');
                        } else {
                            $('#ffOverlay').removeClass('ff-overlay-image');
                            PostFormData();
                        }

                    } else {
                        $('#ffOverlay').removeClass('ff-overlay-image');
                    }
                    break;
                case "CheckPayment":
                    fs.EH.setFormValid(true);
                    //ResetValidation();
                    ValidatePayment(json.resultData);
                    //ValidateFields();

                    if (fs.EH.isFormValid()) {
                        $('#ffOverlay').removeClass('ff-overlay-image');
                        PostFormData();
                    } else {
                        $('#ffOverlay').removeClass('ff-overlay-image');
                    }
                    break;
                case "GenerateCaptcha":
                    RenderCaptcha(json.resultData);
                    break;
                case "FileUpload":
                    ValidateFileUploads(json.resultData);
                    break;
                case "Lookup":
                    PopulateLookup(json);
                    break;
                default:
            }
        }
    }
    /**
     * @description it parses html provided and find STYLE element in html if there is one it gets its content and append it to our form html
     * @param {string} html 
     */
    function addInlineStyleFromHTML(html){
        try{
        var css = document.createElement('style');
        css.type = 'text/css';
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        
        var styles = '';
        if(fs(doc).find('style').length>0){
            styles=fs(doc).find('style').html();
            if (css.styleSheet){
                css.styleSheet.cssText = styles;
            }
            else {
                css.appendChild(document.createTextNode(styles));
            }
            document.getElementById("dvBannerHTML").appendChild(css);
        }
    
        }catch(err){
            console.log('FORM [addInlineStyleFromHTML]');
            console.log(err);
        }
    }
    window.PopulateLookup = function PopulateLookup(json) {
        if (json.selectedId != undefined && json.sourceField != undefined) {
            LogEvent("SELECTED_LOOKUP_VALUE", "");

            //to be reversed
            $('#dvFastForms #' + json.sourceField.replace(/\./g, "\\.")).val(json.selectedId);
            $('#dvFastForms #input' + json.sourceField.replace(/\./g, "\\.")).val(json.selectedName);
            $('#dvFastForms #' + json.sourceField.replace(/\./g, "\\.")).trigger('change');
        }
    }

    /********** File upload functions ************/
    function DeleteSFFile(removeFileElem) {
        console.log('[DeleteSFFile] Starts...');
        var fileInfo = '';
        var fileItemElement = $(removeFileElem).parent();

        var formData = [];
        var currentFileElemId = $(fileItemElement).find('.file-item-data').attr('data-file-sid');


        ($).support.cors = true;
        var result = false;
        var postUrl = window.FormBASEURL + 'services/apexrest/' + GetFormNamespace('/') + 'FFNFileUpload/v1/processGetRequest?did=' + currentFileElemId + '&accessToken=' + encodeURIComponent($('#accessToken').val());
        if (window.location.protocol == "http:" && postUrl.lastIndexOf("https:", 0) === 0) { postUrl = postUrl.replace("https:", "http:"); }
        if (currentFileElemId !== undefined && currentFileElemId != '') {


            if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
                formLogger('[UploadFile][IE11-SF][XMLHttpRequest]');
                //To process ajax post in Salesforce pages in IE 11
                var oReq = null;
                if (Sarissa && Sarissa.originalXMLHttpRequest) {
                    oReq = new Sarissa.originalXMLHttpRequest();
                } else if (window.XMLHttpRequest) {
                    oReq = new XMLHttpRequest();
                }

                oReq.open("GET", postUrl, true);
                oReq.onreadystatechange = function () {
                    formLogger('[UploadFile][IE11-SF][XMLHttpRequest][Result]');
                    if (oReq.readyState == 4 && oReq.status == 200) {

                        fileLoadingSpinner(fileItemElement, false);
                        RemoveFileItemCallback(removeFileElem);
                    } else if (oReq.readyState == 4 && oReq.status != 200) {
                        formLogger("[UploadFile][IE11-SF][Error][" + oReq.responseText + "][" + oReq.status + "]");

                        fileLoadingSpinner(fileItemElement, false);
                        RemoveFileItemCallback(removeFileElem);
                    }
                }
                oReq.setRequestHeader("Content-type", "text/plain");
                oReq.send();

            } else {

                $.ajax({
                    global: false,
                    type: "GET",
                    crossDomain: true,
                    url: postUrl,
                    contentType: 'text/plain',
                    /*beforeSend: function (jqXHR) {
                        // set request headers here rather than in the ajax 'headers' object
                        jqXHR.setRequestHeader('Authorization', 'Bearer '+$('#accessToken').val()); 
                        },*/
                    processData: false,
                    success: function (data) {
                        fileLoadingSpinner(fileItemElement, false);
                        RemoveFileItemCallback(removeFileElem);
                    },
                    error: function (request, status, error) {
                        console.log(' file deleted error: ' + error);
                        fileLoadingSpinner(fileItemElement, false);
                        RemoveFileItemCallback(removeFileElem);

                    }
                });
            }

        } else {
            console.log(' file id not found');
        }
    }

    function UploadFile(fileElement) {
        var fileInfo = '';
        var dataArr = GenerateFileData($(fileElement));
        var formData = [];
        var attachto = 1;
        var currentFileElemId = '';
        var fnDoc;
        for (var i = 0; i < dataArr.length; i++) {
            fileInfo = dataArr[i][0];

            //FileUpload189_1||jpg||FILE||VSL_Support_Doc_Mobile||false||1
            var fileInfoArr = fileInfo.split('||');
            currentFileElemId = fileInfoArr[0];
            var isEsign = (fileInfoArr[2] == 'FILE') ? false : true;
            var fnItem = { 'FKey': dataArr[i][0], 'FContent': dataArr[i][1], 'elemId': fileInfoArr[0], 'type': fileInfoArr[1], 'isESign': isEsign, 'name': fileInfoArr[3], 'isChatter': getSafeBoolean(fileInfoArr[4], false), 'attachTo': fileInfoArr[5] };
            fnDoc = { 'fnDoc': fnItem };

        }

        ($).support.cors = true;
        var result = false;
        var postUrl = '';
        postUrl = window.FormBASEURL + 'services/apexrest/' + GetFormNamespace('/') + 'FFNFileUpload/v1/processPOSTRequest?accessToken=' + encodeURIComponent($('#accessToken').val());
        if (window.location.protocol == "http:" && postUrl.lastIndexOf("https:", 0) === 0) { postUrl = postUrl.replace("https:", "http:"); }

        if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
            formLogger('[UploadFile][IE11-SF][XMLHttpRequest]');
            //To process ajax post in Salesforce pages in IE 11
            var oReq = null;
            if (Sarissa && Sarissa.originalXMLHttpRequest) {
                oReq = new Sarissa.originalXMLHttpRequest();
            } else if (window.XMLHttpRequest) {
                oReq = new XMLHttpRequest();
            }

            oReq.open("POST", postUrl, true);
            oReq.onreadystatechange = function () {
                formLogger('[UploadFile][IE11-SF][XMLHttpRequest][Result]');
                if (oReq.readyState == 4 && oReq.status == 200) {

                    if (oReq.responseText != "") {
                        try {
                            var resultHelper = $.parseJSON(oReq.responseText);
                            if (resultHelper != null && resultHelper.IsValid) {
                                console.log(' File Result:' + resultHelper.ResultText);
                                $('#dvFastForms #' + currentFileElemId).find('label').attr('data-file-sid', resultHelper.ResultText);
                            } else {
                                console.log(' File Result Invalid:' + resultHelper.OtherText);
                            }
                        } catch (err) {
                            console.log('Error while getting session:' + err);
                        }
                    }
                    fileLoadingSpinner(fileElement, false);
                } else if (oReq.readyState == 4 && oReq.status != 200) {
                    formLogger("[UploadFile][IE11-SF][Error][" + oReq.responseText + "][" + oReq.status + "]");

                    $('#dvFastForms #' + currentFileElemId).remove();
                    fileLoadingSpinner(fileElement, false);
                }
            }
            oReq.setRequestHeader("Content-type", "application/json");
            oReq.send(JSON.stringify(fnDoc));

        } else {

            $.ajax({
                global: false,
                type: "POST",
                crossDomain: true,
                url: postUrl,
                data: JSON.stringify(fnDoc),
                contentType: 'application/json',
                processData: false,
                success: function (data) {
                    // console.log(' file uploaded successfully');					 
                    if (data !== undefined && data != '') {
                        try {
                            var resultHelper = $.parseJSON(data);
                            if (resultHelper != null && resultHelper.IsValid) {
                                console.log(' File Result:' + resultHelper.ResultText);
                                $('#dvFastForms #' + currentFileElemId).find('label').attr('data-file-sid', resultHelper.ResultText);
                            } else {
                                console.log(' File Result Invalid:' + resultHelper.OtherText);
                            }
                        } catch (err) {
                            console.log('Error while getting session:' + err);
                        }
                    }
                    fileLoadingSpinner(fileElement, false);
                },
                error: function (request, status, error) {
                    console.log(' file upload error: ' + error);
                    $('#dvFastForms #' + currentFileElemId).remove();
                    fileLoadingSpinner(fileElement, false);

                }
            });
        }
    }

    function GenerateFileData(fileElement) {
        var formData;
        var dataArr = [];
        var fileElemName = GetName(fileElement);
        var dataChatter = $(fileElement).parent().attr('data-uploadtochatter');
        var dataAttachTo = $(fileElement).parent().attr('data-attachto');
        var attachTo = isNullOrEmpty(dataAttachTo) ? '1' : dataAttachTo;
        var isChatter = (dataChatter !== undefined && dataChatter == 'true') ? true : false;
        $(fileElement).parent().find('.file-item').each(function (indx, fileItem) {
            var fileDataItem = $(fileItem).find('label');
            if (fileDataItem !== undefined && ($(fileDataItem).attr('data-fileid') === undefined || $(fileDataItem).attr('data-file-sid') === '') && $(fileDataItem).attr('data-file') !== undefined && $(fileDataItem).attr('data-file') != '') {
                AddToArray(dataArr, fileElemName + '_' + indx + '||' + $(fileDataItem).attr('data-fileext') + '||FILE||' + $(fileDataItem).attr('data-filename') + '||' + isChatter + '||' + attachTo, $(fileDataItem).attr('data-file'));
            }
        });
        return dataArr;
    }

    function RemoveFile(file, id, fieldID) {
        ($).support.cors = true;
        var removeFileParameters = "fileName=" + fixedEncodeURIComponent(file) + "&sessionId=" + id + "&fieldid=" + fieldID;
        var result = false;
        var removeUrl = getURLEndPoint(enumEndpoint.REMOVE_FILE);
        if (window.location.protocol == "http:" && removeUrl.lastIndexOf("https:", 0) === 0)
            removeUrl = removeUrl.replace("https:", "http:");
        if (window.XDomainRequest) {
            // Use Microsoft XDR
            var xdr = new XDomainRequest();
            //IE9 needs these 4 method and 1 attribute even if we don't use them
            xdr.timeout = XDR_TIMEOUT_MILLISECONDS;
            xdr.onerror = function () { console.log('Error unexpected on XDR! Method[RemoveFile].') };
            xdr.ontimeout = function () { console.log('Time out error on XDR! Method[RemoveFile].') };
            xdr.onprogress = function () { };
            xdr.onload = function () { };
            xdr.open("POST", parseURLForXDR(removeUrl), true);
            xdr.send(removeFileParameters);

        } else if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
            //To process ajax post in Salesforce pages in IE 11 
            console.log('[RemoveFile][IE11-SF][XMLHttpRequest]');
            var oReq = null;
            if (Sarissa && Sarissa.originalXMLHttpRequest) {
                oReq = new Sarissa.originalXMLHttpRequest();
            } else if (window.XMLHttpRequest) {
                oReq = new XMLHttpRequest();
            }

            oReq.open("POST", removeUrl, true);
            oReq.onreadystatechange = function () {

                if (oReq.readyState == 4 && oReq.status == 200) {
                    if (oReq.responseText && oReq.responseText.length > 0) {
                        result = oReq.responseText;
                    } else {
                        console.log(' Service call exception' + oReq.responseText);
                    }
                } else if (oReq.readyState == 4 && oReq.status != 200) {
                    console.log(' Service call status:' + oReq.status);
                }
            }
            oReq.send(removeFileParameters);

        } else {
            ($).ajax({
                global: false,
                type: "POST",
                url: removeUrl,
                crossDomain: true,
                data: removeFileParameters,
                dataType: "text",
                processData: false,
                tryCount: 0,
                retryLimit: 3,
                success: function (responseText) {
                    result = responseText;
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (textStatus == 'timeout') {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            //try again
                            ($).ajax(this);
                            return;
                        }
                        return;
                    }
                }
            }); //ajax end
            return result;
        }
    }

    function CheckFileUploadLimits(area) {
        var maxUploads = $(area).data('maxfiles');
        var currentNumUploads = $(area).find("[id$='_Label']").length;
        if (currentNumUploads >= maxUploads) {
            $(area).find("[id$='_Select']").hide();
        } else {
            $(area).find("[id$='_Select']").show();
        }
    }

    window.ValidateFileUploads = function ValidateFileUploads(json) {
        fs.EH.ResetFormValidation();
        var fileArea;

        var uploadSucceeded = false;
        $.each(json.results, function (index, value) {
            var fileElement = $('#dvFastForms #' + value.elementID);
            fileArea = $(fileElement).closest(".ff-fileupload-drop-area");

            var numFiles = $(fileArea).find("[id$='_Label']").length;
            if (value.message == 'Success') {
                var fileExtension = value.fileName.substring(value.fileName.lastIndexOf('.'));

                var allowedFileTypes = "";
                if ($(fileArea).data('allowedfiletypes') != null) {
                    allowedFileTypes = $(fileArea).data('allowedfiletypes');
                    allowedFileTypes = allowedFileTypes.toLowerCase();
                }
                if (fileExtension != undefined && fileExtension != "") {
                    fileExtension = fileExtension.toLowerCase();
                }
                if (allowedFileTypes != "" && $.inArray(fileExtension, allowedFileTypes.split(',')) == -1) {
                    ShowValidationMessage(fileArea, "FILETYPE", allowedFileTypes);
                    RemoveFile(value.fileName, $("#dvFastForms #txtSessionID").val(), $(fileElement).attr('id'));
                } else {
                    var vImageSource = window.FormBASEURL;
                    var labelCloseButton = '#' + value.elementID + numFiles + '_Remove';
                    if (isNativeCloud()) {
                        vImageSource = baseStaticUrl;
                    }

                    fileArea.prepend('<div name="FileUploadLabel" id="' + value.elementID + numFiles +
                        '_Label"><a title="Remove" href="" id="' + value.elementID + numFiles + '_Remove"><img src="' + vImageSource +
                        'Styles/images/remove.png" title="Remove" border="0" /></a>&nbsp;<label style="font-weight:bold">' +
                        value.fileName + '</label></div>');

                    $(labelCloseButton).click(function (event) {
                        event.preventDefault();
                        if($(fileElement).attr('disabled') != 'disabled'){
                            RemoveFile(value.fileName, $("#dvFastForms #txtSessionID").val(), $(fileElement).attr('id'));
                            $('#' + value.elementID + numFiles + '_Label').remove();
                            fs.FileService.checkFileUploadLimits(fileArea);
                        }
                        return false;
                    });
                    $(labelCloseButton).mouseover(function(){
                        $(this).css({cursor:$(fileElement).attr('disabled') == 'disabled'?'not-allowed':'pointer'});
                    });
                    uploadSucceeded = true;

                    fs.FileService.checkFileUploadLimits(fileArea);

                    // I am not sure why this code was here, FF-4414, 
                    // this was blocking the file upload from upload second time using drag and drop.
                    // If we see this code after FF-4414 is relased and no issues with file upload, remove this code and comment.
                    //fileElement.replaceWith(fileElement = fileElement.val('').clone(true));
                }
            } else if (value.message == 'MaxSizeExceeded') {
                ShowValidationMessage(fileArea, "FILESIZE");
            } else if (value.message == 'MaxRequestLengthExceeded') {
                //we show this message in a popup since there is no way of knowing which control had triggered it         
                ShowValidationMessage(fileArea, "FILESIZE", "", true);
            }

        });

        //$('#dvFastForms #dvLoadFile').remove();

    }
    window.GetXmlElementInstance = function GetXmlElementInstance(xmlstring) {
        var xmlDoc;
        var xmlstr = xmlstring.replace(/&amp;/g, "&");//unescaping first so that if it is already escaped we are not double escaping in next line
        xmlstr = xmlstr.replace(/&/g, "&amp;");
        if (msieversion() < 1) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlstr, "text/xml");
        } else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(xmlstr);
        }
        return xmlDoc;
    }

    function msieversion() {
        var ua = window.navigator.userAgent;


        if (ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident") > 0) // If Internet Explorer, return version number
            return 1;
        else // If another browser, return 0
            return 0;

    }

    function firstElementByTagName(xmlNodeElement, tagName, fetchElemHtml) {
        var firstElement;
        var elements = xmlNodeElement.getElementsByTagName(tagName);
        try {
            if (elements.length > 0) {

                if (fetchElemHtml) {
                    firstElement = getXMLElemInnerContent(elements[0], '');

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
            returnVal = xmlElem.innerHTML;
        } else {
            returnVal = xmlElem.innerHTML;
        }

        return returnVal;
    }

    function InitializeInformationFromSavedDraft() {

        if (isClassic()) {
            return;
        }

        var savedDraftValue = $('#dvFastForms #txtSubmittedData').val();
        if (savedDraftValue === undefined || savedDraftValue == '') {
            return;
        }

        var xmlDoc = GetXmlElementInstance('<ffroot>' + savedDraftValue + '</ffroot>');
        
        loadFieldsFromXML(xmlDoc);

        loadFileUploadFieldsFromXML(xmlDoc);
    }

    function loadFieldsFromXML(pXMLDoc) {
        var submittedXmlElem = firstElementByTagName(pXMLDoc, "submittedXml", false);
        
        if (submittedXmlElem === undefined || submittedXmlElem.childNodes.length <= 0) {
            return;
        }

        var listOfFields = submittedXmlElem.childNodes[0].childNodes;
        $.each(listOfFields, function (indx, xNode) {
            var elemid = xNode.tagName;
            if (isIdASalesforceField(elemid)) {
                var fieldId = elemid.replace(/\./g, '\\.');
                var fieldValue = getXMLElemInnerContent(xNode, '');

                if (isFieldIdInTheForm(fieldId)) {
                    setFFHtmlFieldValue(elemid, fieldValue);
                } else {
                    fillLookupOrChildFields(elemid, fieldValue);
                }
            }
        });
    }

    function fillLookupOrChildFields(pFieldId, pFieldValue){
        var fieldIdasArr = pFieldId.split('.');
        if (fieldIdasArr.length === 4) {
            if (fieldIdasArr[2].length >= 4 && fieldIdasArr[2].split('_').length >= 2) {
                var fieldIdWithDot = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_' + fieldIdasArr[2].split('_')[1] + '_.' + fieldIdasArr[3];
                
                var newFieldId = fieldIdWithDot.replace(/\./g, '\\.');
                if (isFieldIdInTheForm(newFieldId)) {
                    setFFHtmlFieldValue(newFieldId, pFieldValue);
                } else {
                    //create new repeat section
                    var prevRepeatIndex = safeInt(fieldIdasArr[2].split('_')[1], -1);
                    if (prevRepeatIndex > 1) {
                        var prevfieldIdWithDot = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_' + (prevRepeatIndex - 1) + '_.' + fieldIdasArr[3];
                        var prevfieldId = prevfieldIdWithDot.replace(/\./g, '\\.');
                        if ($('#dvFastForms').find('#' + prevfieldId).length > 0) {
                            //$('#dvFastForms').find('#'+prevfieldId).parents('.ff-sec-repeat-wrapper').find('.ff-add').click();
                            AddToRepeatableSection($('#dvFastForms').find('#' + prevfieldId).parents('.ff-sec-repeat-wrapper').find('.ff-add'), true);
                            var newRepeatIndex = prevRepeatIndex;
                            var repeatfieldIdWithDot = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_' + newRepeatIndex + '_.' + fieldIdasArr[3];
                            var repeatfieldId = repeatfieldIdWithDot.replace(/\./g, '\\.');
                            if ($('#dvFastForms').find('#' + repeatfieldId).length > 0) {
                                setFFHtmlFieldValue(pFieldId, pFieldValue);
                            }
                        }
                    }
                }
            }
        } else {
            formLogger('Error unexpected! Method[fillLookupOrChildFields] Message[Seems we don\'t have a ID with only 3 dots]');
        }
    }

    function isIdASalesforceField(pId){
        if(pId !== undefined && pId != '' && pId.split('.').length > 1){
            return true;
        }
        return false;
    }

    function isFieldIdInTheForm(pFieldId){
        if($('#dvFastForms').find('#' + pFieldId).length > 0){
            return true;
        }
        return false;
    }

    function loadFileUploadFieldsFromXML(pXMLDoc){
        var documentInfoXmlElem = firstElementByTagName(pXMLDoc, "documentInfoXml", false);
        if (documentInfoXmlElem !== undefined && documentInfoXmlElem.childNodes.length > 0) {
            $.each(documentInfoXmlElem.childNodes, function (indx, xNode) {
                //FileUpload500_0
                var refId = firstElementByTagName(xNode, "refId", true);
                var recId = firstElementByTagName(xNode, "id", true);
                var ext = firstElementByTagName(xNode, "ext", true);
                var refName = firstElementByTagName(xNode, "refName", true);
                var refIdArr = refId.split('_');
                if (refIdArr.length == 2) {
                    initializeFileUploadItems($('#dvFastForms #' + refIdArr[0]), ext, refName, recId);
                }
            });
        }
    }

    function unescapeHTMLString(value) {
        if (value !== undefined && value != null) {
            value = value + "".replace(/&amp;/g, "&");
            return value.replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, "\"")
                .replace(/&apos;/g, "'")
                .replace(/&#039;/g, "'")
                .replace(/&#38;/g, "&")
                .replace(/&#39;/g, "'");
        } else {
            return '';
        }
    }

    function initializeFileUploadItems(fileElem, fileExt, fileName, fileRecId) {
        console.log('[initializeFileUploadItems] Starts...');

        var fileUploadParent = $(fileElem).parent();
        var fileItemRow = $('<div/>', { 'class': 'file-item' })
        var aItem = $('<span/>', { 'title': 'Remove', 'class': 'remove-fitem' });
        fileUploadItemHandle(aItem,fileElem);
        var fileNameLabel = fileName;
        if (fileExt !== undefined && fileExt != '') {
            fileNameLabel += '.' + fileExt;
        }
        var dataItem = $('<label/>', { 'html': fileNameLabel, 'class': 'file-item-data', 'data-filename': fileName, 'data-file-sid': fileRecId, 'data-fileext': fileExt, 'data-fileuploaded': true });
        fileItemRow.append(aItem);
        fileItemRow.append(dataItem);
        $(fileUploadParent).prepend(fileItemRow);
    }

    function InitializeStaticPrefillOptions() {

        if (isClassic()) {
            return;
        }

        var prefillValue = $('#dvFastForms #staticPrefillParams').val();
        if (prefillValue !== undefined && prefillValue != '') {
            var prefillJSONObj = $.parseJSON(prefillValue);
            for (var property in prefillJSONObj) {
                var fieldVal = prefillJSONObj[property];
                var elemid = property;
                setFFHtmlFieldValue(elemid, fieldVal);

            }

        }
    }
    function ExecuteInitialJS() {
        ExecAfterRender();
        if (evaluateRulesIfPrefillEnabled) {
            FFEvaluateRules();
        }
    }
    /*COMMUNITY PREFILL HELPER METHODS*/
    function PopulatePrefillResultSet() {
        $('#comPrefillDataset').val(document.getElementById('prefillDataset').value);
    }

    function InitializePrefillOptions_Native() {
        var prefillFieldObj = {};
        var repeatedChildIdMap = [];
        var processPrefill = false;
        var primaryObjectName = '';
        var relatedObjectInfo = {};
        var prefillValue = $('#prefillObj').val();
        try {
            if ($('#relatedFieldsMapJSON').val() !== undefined && $('#relatedFieldsMapJSON').val() != '') {
                relatedObjectInfo = JSON.parse($('#relatedFieldsMapJSON').val());
                if (prefillValue !== undefined && prefillValue != '') {
                    var resultHelperList = $.parseJSON(prefillValue);
                    for (var i = 0; i < resultHelperList.length; i++) {
                        var resultHelper = resultHelperList[i];
                        if (resultHelper !== undefined && resultHelper !== null && (typeof resultHelper == 'object')) {
                            if (resultHelper.IsValid) {
                                if (resultHelper.ResultText !== undefined) {
                                    var prefillResponse = $.parseJSON(resultHelper.OtherText);


                                    if (prefillResponse !== undefined && prefillResponse !== null && (typeof prefillResponse == 'object') && prefillResponse.records !== undefined && prefillResponse.records !== null && prefillResponse.records.length > 0) {
                                        processPrefill = true;
                                        if (resultHelper.ResultText == '') {
                                            //in case of Primary object prefill information
                                            primaryObjectName = prefillResponse.records[0].attributes['type'];
                                            var sObjectRecord = prefillResponse.records[0];
                                            for (var property in sObjectRecord) {
                                                prefillFieldObj[property] = sObjectRecord[property];
                                            }
                                        } else {

                                            for (var indexPrefil = 0; indexPrefil < prefillResponse.records.length; indexPrefil++) {
                                                var sRecord = prefillResponse.records[indexPrefil];
                                                for (var sproperty in sRecord) {
                                                    var idArr = resultHelper.ResultText.split('\.');
                                                    var fieldName = idArr[0] + '.' + idArr[1] + '_' + (indexPrefil + 1) + '_.';
                                                    if (typeof sRecord[sproperty] != 'object' && sproperty != 'attributes') {
                                                        fieldName += sproperty;
                                                        prefillFieldObj[fieldName] = sRecord[sproperty];
                                                    } else if (sproperty == 'attributes') {
                                                        var idval = sRecord.attributes.url.substring(1);
                                                        fieldName += 'Id';
                                                        prefillFieldObj[fieldName] = idval;
                                                        repeatedChildIdMap.push(fieldName);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    // console.log('Response ResultText:'+resultHelper.ResultText);
                                }

                            } else {
                                // console.log('Response IsValid:'+resultHelper.IsValid);
                            }

                        }
                    }
                }
            }
        } catch (err) {
            console.log('[InitializePrefillOptions] Exception:' + err);
            console.log(err);
        }
        if (processPrefill) {
            var relatedPrefillFieldsObj = {};
            for (var property in prefillFieldObj) {
                if (typeof prefillFieldObj[property] == 'object' && property != 'attributes') {
                    var nestedSObject = prefillFieldObj[property];
                    var fieldPrefix = '';
                    for (var relProp in relatedObjectInfo) {
                        if (property == relatedObjectInfo[relProp]) {
                            fieldPrefix = relProp + '.';
                        }
                    }
                    for (var nestedprop in nestedSObject) {
                        var fieldVal = nestedSObject[nestedprop];
                        nestedSObject[fieldPrefix + nestedprop] = fieldVal;
                    }
                }
            }

            for (var property in prefillFieldObj) {
                if (typeof prefillFieldObj[property] == 'object' && property != 'attributes') {
                    /*process Lookup objects fields*/
                    var nestedSObject = prefillFieldObj[property];
                    for (var nestedprop in nestedSObject) {
                        if (nestedprop != 'attributes') {
                            var fieldVal = nestedSObject[nestedprop];
                            if (nestedprop.split('.').length > 1) {
                                var elemid = primaryObjectName + '.' + nestedprop;
                                setFFHtmlFieldValue(elemid, fieldVal);

                            }
                        }
                    }
                } else if (property == 'attributes') {

                } else {
                    /*process Primary Object and repeated child object fields*/
                    var fieldVal = prefillFieldObj[property];
                    var elemid = primaryObjectName + '.' + property;
                    var fieldIdasArr = elemid.split('.');
                    var fieldId = elemid.replace(/\./g, '\\.');
                    if ($('#dvFastForms').find('#' + fieldId).length > 0) {
                        setFFHtmlFieldValue(fieldId, fieldVal);
                        if (fieldIdasArr.length == 4 && $.inArray(fieldIdasArr[1] + '.' + fieldIdasArr[2] + '.Id', repeatedChildIdMap) >= 0) {
                            var repeatedElemId = fieldIdasArr[1] + '.' + fieldIdasArr[2] + '.Id';
                            var repeatIndx = parseFloat(fieldIdasArr[2].split('_')[1]);
                            var sectionelemid = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_' + repeatIndx + '_.' + fieldIdasArr[3];
                            sectionelemid = sectionelemid.replace(/\./g, '\\.');
                            var secWrapElem = $('#dvFastForms').find('#' + sectionelemid).parents('.ff-sec-repeat-wrapper');
                            $(secWrapElem).attr('data-rid', fieldIdasArr[0] + '.' + repeatedElemId);
                            $(secWrapElem).attr('data-rval', prefillFieldObj[repeatedElemId]);
                            repeatedChildIdMap = $.grep(repeatedChildIdMap, function (n, i) { return (n !== property); });
                        }

                    } else if (fieldIdasArr.length == 4 && fieldIdasArr[3].toLowerCase() != 'id') {
                        /*create new repeat section based on prefill values fetched from salesforce*/
                        var prevRepeatIndex = safeInt(fieldIdasArr[2].split('_')[1], -1);

                        if (prevRepeatIndex > 1) {
                            var prevfieldIdWithDot = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_1_.' + fieldIdasArr[3];
                            var prevfieldId = prevfieldIdWithDot.replace(/\./g, '\\.');
                            if ($('#dvFastForms').find('#' + prevfieldId).length > 0) {
                                var lowerCount = $('#dvFastForms').find('#' + prevfieldId).parents('.ff-sec-repeat-wrapper').parent().find('div.ff-sec-repeat-wrapper').length;
                                for (var rindx = prevRepeatIndex; rindx > lowerCount; rindx--) {
                                    //$('#dvFastForms').find('#'+prevfieldId).parents('.ff-sec-repeat-wrapper').find('.ff-add').click();
                                    AddToRepeatableSection($('#dvFastForms').find('#' + prevfieldId).parents('.ff-sec-repeat-wrapper').find('.ff-add'), true);
                                }
                                var newRepeatIndex = prevRepeatIndex;
                                var repeatfieldIdWithDot = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_' + newRepeatIndex + '_.' + fieldIdasArr[3];
                                var repeatfieldId = repeatfieldIdWithDot.replace(/\./g, '\\.');
                                if ($('#dvFastForms').find('#' + repeatfieldId).length > 0) {
                                    setFFHtmlFieldValue(repeatfieldId, fieldVal);
                                    fieldIdasArr = repeatfieldIdWithDot.split('.');
                                    if (fieldIdasArr.length == 4 && $.inArray(fieldIdasArr[1] + '.' + fieldIdasArr[2] + '.Id', repeatedChildIdMap) >= 0) {
                                        var repeatIndx = parseFloat(fieldIdasArr[2].split('_')[1]);
                                        var repeatedElemId = fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_' + repeatIndx + '_.Id';
                                        var sectionelemid = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_' + repeatIndx + '_.' + fieldIdasArr[3];
                                        sectionelemid = sectionelemid.replace(/\./g, '\\.');
                                        var secWrapElem = $('#dvFastForms').find('#' + sectionelemid).parents('.ff-sec-repeat-wrapper');
                                        $(secWrapElem).attr('data-rid', fieldIdasArr[0] + '.' + repeatedElemId);
                                        $(secWrapElem).attr('data-rval', prefillFieldObj[repeatedElemId]);
                                        repeatedChildIdMap = $.grep(repeatedChildIdMap, function (n, i) { return (n !== property); });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function InitializePrefillOptions() {
        if (isNativeCloud() && !isCommunityForm()) {
            InitializePrefillOptions_Native();
            return;
        }

        PopulatePrefillResultSet();
        fs('.ff-sec-repeat-wrapper').each(function () { console.log('ID-' + fs(this).attr('data-rid')); })
        /// this variable holds information of object identifiers,its type <primary/lookup/child>,if it is repeated and the whole record information to be prefilled
        var prefillObjectsArr = [];
        var processPrefill = false;
        var primaryObjectName = '';
        var relatedObjectInfo = {};
        var prefillValue = $('#comPrefillDataset').val();
        try {
            if (prefillValue !== undefined && prefillValue != '') {
                evaluateRulesIfPrefillEnabled = true;
                var resultHelperObj = $.parseJSON(prefillValue);
                var otherTextObj = $.parseJSON(resultHelperObj.OtherText);
                var resultTextObj = $.parseJSON(resultHelperObj.ResultText);
                for (var objProp in otherTextObj) {
                    processPrefill = true;
                    if (objProp.toLowerCase() == 'primary') {
                        primaryObjectName = otherTextObj[objProp];
                    }
                }
                /// this variable holds information of object identifiers,its type <primary/lookup/child> and their ids only
                var relatedObjectRecordIdMap = [];
                for (var objProp in resultTextObj) {
                    /// prop is object identifier e.g. Case.A or AccountId
                    /// in case of primary object and child (repeated/non-repeated) it would be objectname e.g. Case.A for child cases and Contact for primary
                    /// in case of lookup it would be Lookup reference field on primary object e.g. AccountId

                    console.log(resultTextObj[objProp].objectName + " Object => " + resultTextObj[objProp].jsonListResults);

                    var vObjectInJSONFormat = resultTextObj[objProp].jsonListResults;
                    if (vObjectInJSONFormat == null || vObjectInJSONFormat == '' || vObjectInJSONFormat == '[]') {
                        continue;
                    }

                    var objectArr = $.parseJSON(vObjectInJSONFormat);
                    if (resultTextObj[objProp].objectName === primaryObjectName) {
                        var primaryRecordId = objectArr[0]["Id"];
                        relatedObjectRecordIdMap.push(getPrefillRecordMapItem(primaryObjectName, "primary", "ids", [primaryRecordId]));
                        prefillObjectsArr.push(getPrefillRecordMapItem(resultTextObj[objProp].objectName, "lookup", "records", objectArr, primaryObjectName));
                    } else {
                        if (resultTextObj[objProp].objectName.indexOf('.') > 0) {
                            var childIds = [];
                            $.each(objectArr, function (indx, item) {
                                childIds.push(item["Id"]);
                            });
                            relatedObjectRecordIdMap.push(getPrefillRecordMapItem(resultTextObj[objProp].objectName, "child", "ids", childIds, primaryObjectName));
                            prefillObjectsArr.push(getPrefillRecordMapItem(resultTextObj[objProp].objectName, "lookup", "records", objectArr, primaryObjectName));
                        } else {
                            /// TODO: check if objProp is Object name or Lookup fieldname on primary. We need lookup fieldname
                            relatedObjectRecordIdMap.push(getPrefillRecordMapItem(resultTextObj[objProp].objectName, "lookup", "ids", [objectArr[0]["Id"]]));
                            prefillObjectsArr.push(getPrefillRecordMapItem(resultTextObj[objProp].objectName, "lookup", "records", objectArr, primaryObjectName));
                        }
                    }
                }
                /// POPULATE map of recordids involved in prefill to hidden element which will be processed by Backend
                document.getElementById("comPrefillObj").value = JSON.stringify(relatedObjectRecordIdMap);
            }
        } catch (err) {
            console.log('[InitializePrefillOptions] Exception:' + err);
            console.log(err);
        }
        if (processPrefill) {
            var relatedPrefillFieldsObj = {};
            if (prefillObjectsArr.length > 0) {
                var repeatedChildObjectArr = $.grep(prefillObjectsArr, function (prop) { return prop.isrepeated; });
                if (repeatedChildObjectArr.length > 0) {
                    ///Let's make sure we have as many as repeated section added on the form as we have in prefill dataset if not add to the form.
                    $.each(repeatedChildObjectArr, function (pindx, repeatedObject) {
                        var objIdentifier = repeatedObject['identifier'];
                        var repetedObjectDataArr = repeatedObject['records'];
                        var recordCount = repetedObjectDataArr.length;
                        $.each(repetedObjectDataArr, function (indx, dataRecord) {
                            var repeatedIndex = indx + 1;
                            var nextRepeatedIndex = repeatedIndex + 1;
                            var recordId = dataRecord['Id'];
                            console.log(' Repeated record id:' + recordId);
                            var prevElemIdPrefix = primaryObjectName + '.' + objIdentifier + '_' + repeatedIndex + '_.';
                            prevElemIdPrefix = prevElemIdPrefix.replace(/\./g, '\\.');
                            var newElemIdPrefix = primaryObjectName + '.' + objIdentifier + '_' + nextRepeatedIndex + '_.';
                            newElemIdPrefix = newElemIdPrefix.replace(/\./g, '\\.');
                            if (repeatedIndex < recordCount && $('#dvFastForms').find('[id^="' + prevElemIdPrefix + '"]').length > 0 && $('#dvFastForms').find('[id^="' + newElemIdPrefix + '"]').length == 0) {
                                // Code enters to this section if below three conditions met
                                //// 1 repeatedIndex should be less then recordCount: we do not want extra sections because we add one section by default always as per our HTML configured in Form builder
                                //// 2 Atleast one element starting with prevElemIdPrefix id should exists: so that we can identify which section's add link we need to pass as first parameter to the method being called below 
                                ///// so that we can trigger AddToRepeatableSection method  which basically copy previous section html and add to the form to the parent element
                                //// 3 No element starting with newElemIdPrefix id should exists: if there is one that means we already added a section with that repeated index.
                                AddToRepeatableSection($($('#dvFastForms').find('[id^="' + prevElemIdPrefix + '"]')[0]).parents('.ff-sec-repeat-wrapper').find('.ff-add'), true);
                            }

                        });
                    });
                }

                $.each(prefillObjectsArr, function (pindx, prefillObject) {
                    var objIdentifier = prefillObject['identifier'];
                    var prefillObjectDataArr = prefillObject['records'];
                    var isRepeated = prefillObject['isrepeated'];
                    /// objIdentifier : e.g. Case.A or AccountId 
                    $.each(prefillObjectDataArr, function (indx, dataRecord) {
                        // dataRecord is one individual record to prefill information from 
                        var repeatedIndex = indx + 1;
                        if (typeof dataRecord == 'object') {
                            /*process objects */
                            console.log('[InitializePrefillOptions]  populate object : ' + objIdentifier);
                            if (isRepeated) {
                                /// Set rid and rval attributes of repeated section which will be pass along when we submit the form. 
                                ///// Usually we submit only html form elements not divs or spans etc. 
                                var elemId = primaryObjectName + '.' + objIdentifier + '_' + repeatedIndex + '_.';
                                var elemIdPrefix = elemId.replace(/\./g, '\\.');
                                var secWrapElem = $($('#dvFastForms').find('[id^="' + elemIdPrefix + '"]')[0]).parents('.ff-sec-repeat-wrapper');
                                $(secWrapElem).attr('data-rid', elemId + 'Id');
                                $(secWrapElem).attr('data-rval', dataRecord["Id"]);
                            }
                            var nestedSObject = dataRecord;
                            for (var nestedprop in nestedSObject) {
                                if (nestedprop != 'attributes') {
                                    var fieldVal = nestedSObject[nestedprop];
                                    if (typeof fieldVal !== 'object') {

                                        var elemid = objIdentifier + '.' + nestedprop;
                                        if (isRepeated) {
                                            elemid = objIdentifier + '_' + repeatedIndex + '_.' + nestedprop;
                                        }
                                        if (primaryObjectName !== objIdentifier) {
                                            elemid = primaryObjectName + '.' + elemid;
                                        }
                                        setFFHtmlFieldValue(elemid, fieldVal);
                                    }
                                }
                            }
                        }

                    });
                });
            }
        }
    }

    function getPrefillRecordMapItem(objectIdentifier, relationType, propKey, propValue, primaryObjectName) {
        var obj = { "identifier": objectIdentifier, "rtype": relationType };
        /// propKey would be ids or records
        obj[propKey] = propValue;
        obj["isrepeated"] = false;
        if (primaryObjectName !== undefined && objectIdentifier.indexOf('.') > 0) {
            /// it is a child object .
            /// Let's check if it is repeated by checking if there is any element exists with a prefix of first occurence of this object's field
            /// i.e. in case of Case.A as objectIdentifier and COntact as primary we will check if there is an element with id starting with Contact.Case.A_1_
            var fieldIdPrefix = primaryObjectName + '.' + objectIdentifier + '_1_';
            fieldIdPrefix = fieldIdPrefix.replace(/\./g, '\\.');
            if ($('#dvFastForms').find('[id^="' + fieldIdPrefix + '"]').length > 0) {
                obj["isrepeated"] = true;
            }
        }
        return obj;
    }

    function setFormattedDateOrDateTime(thisElement) {
        try {
            var vDateType = $(thisElement).attr('data-vatt').toString().toUpperCase();
            var vDateValue = $(thisElement).val();

            if (vDateValue == "") {
                return;
            }

            if ((vDateType != 'DATE') && (vDateType != 'DATETIME')) {
                return;
            }

            var vValueFormatted = '';

            console.log('[setFormattedDateOrDateTime] vDateType[' + vDateType + '] vDateValue[' + vDateValue + ']');

            if (vDateType == 'DATE') {
                vValueFormatted = moment(vDateValue, "YYYY-MM-DD").format(window.fs_formLocaleDate);
            } else if (vDateType == 'DATETIME') {
                vValueFormatted = moment(vDateValue, "YYYY-MM-DDThh:mm:ss Z").format(window.fs_formLocaleDate + ' ' + window.fs_formLocaleTime);
            }

            $(thisElement).val(vValueFormatted);

        } catch (err) {
            console.log('[setFormattedDateOrDateTime] Date time formatting error.' + err.message);
        }
    }

    var enumFlexControl = {
        "PicklistComboBox": "picklist-combobox",
        "PicklistRadioButton": "picklist-radiobutton",
        "PicklistRadiobuttonVertical": "picklist-radiobutton-vertical",
        "PicklistRadiobuttonHorizontal": "picklist-radiobutton-horizontal",
        "MultipicklistMultiTags": "multipicklist-multi-tags",
        "MultipicklistMultiTagsCheck": "multipicklist-multi-tags-check",
        "MultipicklistCheckboxVertical": "multipicklist-checkbox-vertical",
        "MultipicklistCheckboxHorizontal": "multipicklist-checkbox-horizontal",
        "MultipicklistDefault": "multipicklist-default",
        "IntegerStarrating": "integer-starrating",
        "IntegerNpsrating": "integer-npsrating",
        "IntegerMatrixLikert": "integer-matrixlikert"
    };
    Object.freeze(enumFlexControl);

    var enumFieldTypeControl = {
        "SelectOne": "select-one",
        "SelectMultiple": "select-multiple",
        "Checkbox": "checkbox",
        "Text": "text",
        "Textarea": "textarea",
        "Radio": "radio",
        "Hidden": "hidden",
        "Submit": "submit",
        "Button": "button",
        "Reset": "reset"
    };
    Object.freeze(enumFieldTypeControl);

    function getJSElementId(pElementId) {
        if (pElementId.indexOf('\\.') < 0) {
            pElementId = pElementId.replace(/\./g, '\\.');
        }
        return pElementId;
    }

    function setFFHtmlFieldValue(pElementID, pFieldValue) {
        try {
            pElementID = getJSElementId(pElementID);
            pFieldValue = unescapeHTMLString(pFieldValue);

            var vHTMLElement = $('#dvFastForms').find('#' + pElementID);
            if (vHTMLElement == null || vHTMLElement[0] == null) {
                return;
            }

            var vFieldTypeControl = vHTMLElement[0].type;
            var vFlexControl = $(vHTMLElement).data('flexcontrol');

            console.log('pElementID[' + pElementID + ']pFieldValue[' + pFieldValue + '] vFieldTypeControl[' + vFieldTypeControl + '] vFlexControl[' + vFlexControl + ']');

            switch (vFieldTypeControl) {
                case enumFieldTypeControl.SelectOne:
                    setSelectOneField(vHTMLElement, vFlexControl, pFieldValue);
                    break;
                case enumFieldTypeControl.SelectMultiple:
                    setSelectMultipleField(vHTMLElement, vFlexControl, pFieldValue);
                    break;
                case enumFieldTypeControl.Checkbox:
                    setCheckBoxField(vHTMLElement, vFlexControl, pFieldValue);
                    break;
                case enumFieldTypeControl.Textarea:
                case enumFieldTypeControl.Text:
                    setTextField(vHTMLElement, vFlexControl, pFieldValue);
                    break;
                case enumFieldTypeControl.Hidden:
                    setHiddenField(vHTMLElement, vFlexControl, pFieldValue);
                    break;
                default:
                    console.log('[setFFHtmlFieldValue] Field Type not Identified. vFieldTypeControl[' + vFieldTypeControl + '] vFlexControl[' + vFlexControl + ']');
                    break;
            }

        } catch (err) {
            console.log('Error unexpected! Method[setFFHtmlFieldValue] Ex[Below]');
            console.log(err);
        }
    }

    function setSelectOneField(pHTMLElement, pFlexControl, pFieldValue) {
        switch (pFlexControl) {
            case enumFlexControl.PicklistRadiobuttonHorizontal:
            case enumFlexControl.PicklistRadiobuttonVertical:
                //Removing SelectToRadio and SelectToRadio
                $(pHTMLElement).SelectToRadio('destroy');
                //Setting the value
                $(pHTMLElement).val(pFieldValue);
                //Adding Select2 and SelectToRadio back
                fs.EH.initFlexControl(pHTMLElement, false);
                break;
            case enumFlexControl.PicklistComboBox:
                $(pHTMLElement).select2('val', pFieldValue);
                break;
            default:
                $(pHTMLElement).val(pFieldValue);
                break;
        }
    }

    function setSelectMultipleField(pHTMLElement, pFlexControl, pFieldValue) {
        var vListOfValues = pFieldValue.split(';');
        switch (pFlexControl) {
            case enumFlexControl.MultipicklistCheckboxHorizontal:
            case enumFlexControl.MultipicklistCheckboxVertical:
                //Removing SelectToRadio and SelectToRadio
                $(pHTMLElement).SelectToRadio('destroy');
                //Setting the value
                $(pHTMLElement).val(vListOfValues);
                //Adding Select2 and SelectToRadio back
                fs.EH.initFlexControl(pHTMLElement, false);
                break;
            case enumFlexControl.MultipicklistMultiTags:
            case enumFlexControl.MultipicklistMultiTagsCheck:
                $(pHTMLElement).select2('val', vListOfValues);
                break;
            case enumFlexControl.MultipicklistDefault:
                $(pHTMLElement).val(vListOfValues);
                break;
            default:
                $(pHTMLElement).val(vListOfValues);
                break;
        }
    }

    function setCheckBoxField(pHTMLElement, pFlexControl, pFieldValue) {
        var isCheckedByDefault = $(pHTMLElement).is(':checked');
        $(pHTMLElement).prop('checked', getSafeBoolean(pFieldValue, isCheckedByDefault));
    }

    function setTextField(pHTMLElement, pFlexControl, pFieldValue) {
        switch (pFlexControl) {
            case enumFlexControl.IntegerNpsrating:
            case enumFlexControl.IntegerStarrating:
                $(pHTMLElement).ffrating('destroy');
                $(pHTMLElement).val(pFieldValue);
                fs.EH.initFlexControl(pHTMLElement, false);
                break;
            case enumFlexControl.IntegerMatrixLikert:
                $(pHTMLElement).val(pFieldValue);
                fs.EH.initFlexControl(pHTMLElement, false);
                break;
            case undefined:
                var vVATT = $(pHTMLElement).attr('data-vatt');

                if (isDateOrDateTimeField($(pHTMLElement))) {
                    if (pFieldValue != '') {
                        $(pHTMLElement).val(pFieldValue);
                        setFormattedDateOrDateTime(pHTMLElement);
                    }
                } else if (vVATT == 'REFERENCE') {
                    $(pHTMLElement).next().val(pFieldValue);
                    $(pHTMLElement).val(pFieldValue);
                } else {
                    $(pHTMLElement).val(pFieldValue);
                }
                break;
            default:
                $(pHTMLElement).val(pFieldValue);
                break;
        }
    }

    function setHiddenField(pHTMLElement, pFlexControl, pFieldValue) {
        var vVATT = $(pHTMLElement).attr('data-vatt');
        if (vVATT == 'DATETIME' || vVATT == 'DATE') {
            if (pFieldValue != '') {
                $(pHTMLElement).val(pFieldValue);
                setFormattedDateOrDateTime(pHTMLElement);
            }
        } else if (vVATT == 'REFERENCE') {
            $(pHTMLElement).next().val(pFieldValue);
            $(pHTMLElement).val(pFieldValue);
        } else {
            $(pHTMLElement).val(pFieldValue);
        }
    }


    /*COMMUNITY PREFILL HELPER METHODS END*/

    function InitializeFileUpload() {
        'use strict';

        if (isNativeCloud()) {
            InitializeFileUpload_Native();
            return;
        }

        var fileUploadElement = $(fsQ.S("#dvFastForms .ff-fileupload-drop-area"));
        
        if (fileUploadElement.length === 0) { return; }

        if (isOlderBrowser() == false && window.fs_fileUpload_disableDragDropInHTMLDocument) {
            // Disable File Upload from into the Page, there is an option that enables it to our section
            $(document).bind('drop dragover', function (e) {
                e.preventDefault();
            });
        }

         fsQ.forEach(fileUploadElement,function (currentItem) {
            var fileArea = $(currentItem);
            var fileUpload = $(currentItem).find(":file");

            if (fs.FileService.isFileServiceOn(fileArea)) {
                fs.FileService.loadFileUploadField(fileArea, fileUpload);
                // If File Service is not On, we will do the old logic below.
            } else if (isOlderBrowser()) {
                //for IE8 and lower, we need to do an iframe post
                //so we can get the results back from the server
                $(fileUpload).change(function (event) {
                    //$(fileArea).append("<div id='dvLoadFile' class='ff-load-img'></div>");
                    formLogger("[InitializeFileUpload][IE8][change]");
                    $('#ffOverlay').addClass('ff-overlay-image');
                    $('#dvFastForms form#form1').attr('action', window.FormBASEURL + 'EngineFrame/UploadFile');
                    $('#dvFastForms form#form1').trigger('submit');
                });
            } else {
                //for all other browsers, ajax will do
                $(fileUpload).fileupload({});
                $(fileUpload).fileupload({
                    url: window.FormBASEURL + '/EngineFrame/UploadFile',
                    type: "POST",
                    // Enable drag and drop on file upload area
                    dropZone: fileArea,
                    // Identify which file upload it should look
                    fileInput: fileUpload,
                    autoUpload: true,
                    // This is needed for drag and drop, on second time we need to send these info, so we now send all the time.
                    formData: function () {
                        // Sending Required Fields for File Upload Endpoint.
                        // Added here because we need to get a SessionID everytime we upload, in case that we have submitted and got a new session id.
                        // We are not using the normal post, because on drag and drop on second time, it doesn't get all the fields.
                        var listFieldAndValue = [];
                        fs.FileService.addNameAndValueInArray(listFieldAndValue, "txtOrgId", $("#txtOrgId").val());
                        fs.FileService.addNameAndValueInArray(listFieldAndValue, "txtSessionID", $("#txtSessionID").val());
                        return listFieldAndValue;
                    },
                    dataType: 'json',
                    xhr: function () {
                        var pXHR = null;
                        if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
                            //To process ajax post in Salesforce pages in IE 11 
                            console.log('[InitializeFileUpload][IE11-SF][xhr]');

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
                        formLogger("[InitializeFileUpload][Add]");
                        if(e.target.disabled){
                            formLogger('[InitializeFileUpload][Abort]');
                            return;
                        }
                        fs.EH.ResetFormValidation();
                        var fileSize = data.originalFiles[0]['size'];
                        var allowedFileTypes = $(fileArea).data('allowedfiletypes');
                        var fileName = data.originalFiles[0]['name'];
                        var fileExtension = "";
                        if (fileName != null && fileName.indexOf('.') > -1)
                            fileExtension = fileName.substring(fileName.lastIndexOf('.'));

                        if (fileSize != null && fileSize > maxFileSize) {
                            ShowValidationMessage(fileArea, "FILESIZE");
                        } else if (allowedFileTypes != "" && allowedFileTypes != null && $.inArray(fileExtension, allowedFileTypes.split(',')) == -1) {
                            ShowValidationMessage(fileArea, "FILETYPE", allowedFileTypes);
                        } else {
                            //$(fileArea).append("<div id='dvLoadFile' class='ff-load-img'></div>");
                            jqXHRData = data;
                            jqXHRData.submit();
                        }
                    },
                    done: function (event, data) {
                        formLogger("[InitializeFileUpload][Done]");
                        var json = $.parseJSON(data.result);
                        ValidateFileUploads(json);
                    },
                    fail: function (event, data) {
                        formLogger("[InitializeFileUpload][fail]");
                        //$('#dvFastForms #dvLoadFile').remove();
                    }
                });
            }
        });
    }

    function addNameAndValueInArray(pListFieldAndValue, pFieldName, pFieldValue) {
        pListFieldAndValue.push({
            name: pFieldName,
            value: pFieldValue
        });

        return pListFieldAndValue;
    }

    function InitializeFileUpload_Native() {
        'use strict';
        var fileUploadElement = $(fsQ.S("#dvFastForms .ff-fileupload-drop-area"));
        
        if (fileUploadElement.length === 0) { return; }

        fsQ.forEach(fileUploadElement,function (currentItem) {
            var fileArea = $(currentItem);
            var fileUpload = $(currentItem).find(":file");

            //Check if the the new method of file uploading is enabled.
            if(!fs.FileService.isNativeOptionSelected(fileArea) && fs.FileService.isFileServiceOn(fileArea)){
                fs.FileService.loadFileUploadField(fileArea,fileUpload);
            }
            else {
                $(fileUpload).change(function (event) {

                    var fileUploadElem = this;
                    var parentFileUpload = $(fileUploadElem).parent().parent();
                    $(parentFileUpload).find('.ff-fileupload-drop-area').removeClass('ff-input-type-invalid');
                    $(parentFileUpload).find('.ff-invalid-msg').remove();
                    var allowedFileTypes = $(fileUploadElem).parent().data('allowedfiletypes');
                    var maxNumberOfFiles = $(fileUploadElem).parent().data('maxfiles');

                    $(this).parent().find('.fake-path').remove();
                    //$(this).parent().find('.ff-fileupload-select').after('<span class="fake-path">'+$(this).val()+'</span>');
                    var formData = !!window.FormData ? new FormData() : null;
                    if (this.files[0] != undefined) {
                        var file = this.files[0];

                        var attachmentName = file.name;
                        var fileReader = new FileReader();
                        var setloading = true;
                        fileReader.onprogress = function (e) {
                            if (setloading) {
                                fileLoadingSpinner(fileUploadElem, true);
                                setloading = false;
                            }
                        }
                        fileReader.onloadend = function (e) {

                            var binary = "";
                            var bytes = new Uint8Array(e.target.result);
                            var length = bytes.byteLength;
                            for (var i = 0; i < length; i++) {
                                binary += String.fromCharCode(bytes[i]);
                            }
                            var attachment = (btoa(binary)).toString();
                            var fileExtension = getFileUploadExtension(attachmentName);
                            allowedFileTypes = allowedFileTypes.toLowerCase();

                            if (fileExtension != undefined && fileExtension != "") {
                                fileExtension = fileExtension.toLowerCase();
                            }
                            var fileSize = attachment.length;
                            var fileExtensionDot = '.' + fileExtension;
                            if (fileSize > maxFileSize) {
                                var additionalmsg = '';
                                try {
                                    additionalmsg = " Your file size is " + (Math.floor(fileSize / 1024 / 10) / 100);
                                } catch (err) { }
                                ShowValidationMessage(fileArea, "FILESIZE");
                                fileLoadingSpinner(fileUploadElem, false);
                            } else if (allowedFileTypes != "" && allowedFileTypes != null && $.inArray(fileExtensionDot, allowedFileTypes.split(',')) == -1) {
                                ShowValidationMessage(fileArea, "FILETYPE", allowedFileTypes);
                                fileLoadingSpinner(fileUploadElem, false);
                            } else if ($(fileArea).find('.file-item').length >= maxNumberOfFiles) {
                                fileLoadingSpinner(fileUploadElem, false);
                                ShowValidationMessage(fileArea, "GENERAL", "Maximum number of files allowed to upload is " + maxNumberOfFiles + ".");
                            } else {
                                addFileUploadItems(fileUploadElem, fileExtension, getSafeFileName(attachmentName), attachment);
                                fileLoadingSpinner(fileUploadElem, true);
                                UploadFile(fileUploadElem);

                            }
                            //ValidateMaxNumberOfFiles(fileUploadElem);			
                        }
                        fileReader.onerror = function (e) {
                            fileLoadingSpinner(fileUploadElem, false);
                            ShowValidationMessage(fileArea, "GENERAL", "There was an error reading the file.  Please try again.");
                        }
                        fileReader.onabort = function (e) {
                            fileLoadingSpinner(fileUploadElem, false);
                            ShowValidationMessage(fileArea, "GENERAL", "There was an error reading the file.  Please try again.");
                        }

                        fileReader.readAsArrayBuffer(file); //Read the body of the file
                    }
                });

            }

        });
    }

    window.ValidateMaxNumberOfFiles = function ValidateMaxNumberOfFiles(fileElem) {
        var maxNumberOfFiles = $(fileElem).parent().data('maxfiles');
        var parentFileUpload = $(fileElem).parent().parent();
        $(parentFileUpload).find('.ff-fileupload-drop-area').removeClass('ff-input-type-invalid');
        $(parentFileUpload).find('.ff-invalid-msg').remove();
        if ($(fileElem).parent().find('.file-item').length > maxNumberOfFiles) {
            ShowValidationMessage(fileElem, "GENERAL", "Maximum number of files allowed to upload is " + maxNumberOfFiles + ".");
        } else if ($(fileElem).parent().find('.file-item').length < maxNumberOfFiles) {
            //setEnableDisableFileUpload($(fileUploadElem).parent());
        }


    }

    function setEnableDisableFileUpload(fileUploadParent) {
        var maxNumberOfFiles = $(fileUploadParent).data('maxfiles');
        $(fileUploadParent).find('.ff-fileupload-select').removeClass('disabled');
        $(fileUploadParent).find('input[type="file"]').prop('disabled', false);
        if ($(fileUploadParent).find('.file-item').length > maxNumberOfFiles) {
            $(fileUploadParent).find('.ff-fileupload-select').removeClass('disabled');
            $(fileUploadParent).find('input[type="file"]').prop('disabled', false);
        }

    }

    function fileUploadItemHandle(aItem,fileElem){
        aItem.click(function () {
            if($(fileElem).attr('disabled') != 'disabled'){
                RemoveFileItem(this);
            }
        });
        $(aItem).mouseover(function(){
            $(this).css({cursor:$(fileElem).attr('disabled') == 'disabled'?'not-allowed':'pointer'});
        });
    }

    function addFileUploadItems(fileElem, fileExt, fileName, uploadedFile) {
        var fileUploadParent = $(fileElem).parent();
        var index = $(fileUploadParent).find('.file-item').length;
        var fileItemRow = $('<div/>', { 'class': 'file-item', 'id': $(fileElem).attr('id') + '_' + index })
        var aItem = $('<span/>', { 'title': 'Remove', 'class': 'remove-fitem' });
        fileUploadItemHandle(aItem,fileElem)
        var fileNameLabel = fileName;
        if (fileExt !== undefined && fileExt != '') {
            fileNameLabel += '.' + fileExt;
        }
        var dataItem = $('<label/>', { 'html': fileNameLabel, 'class': 'file-item-data', 'data-filename': fileName, 'data-fileext': fileExt, 'data-file': uploadedFile });
        fileItemRow.append(aItem);
        fileItemRow.append(dataItem);
        $(fileItemRow).insertBefore($(fileUploadParent).find('label.ff-fileupload-select'));
        //$(fileUploadParent).prepend(fileItemRow);
    }
    window.RemoveFileItem = function RemoveFileItem(fileItemElem) {
        console.log('[RemoveFileItem] Starts...');
        DeleteSFFile(fileItemElem);

    }

    function RemoveFileItemCallback(fileItemElem) {
        var fileElem = $(fileItemElem).parent().parent().find('input[type="file"]');
        $(fileItemElem).parent().remove();
        try {
            ValidateMaxNumberOfFiles(fileElem);
        } catch (err) { }
    }

    function fileLoadingSpinner(fileElem, showLoading) {

        if (showLoading) {
            if (!$(fileElem).parent().find('.file-item').hasClass('file-loading'))
                $(fileElem).parent().find('.file-item').addClass('file-loading'); //.append($('<i/>',{'class':'file-loading'}));//.remove();
        } else {
            $(fileElem).parent().find('.file-item').removeClass('file-loading');
        }

    }

    function clearFileElements(fileElem) {
        $(fileElem).parent().find('.file-item').remove();
    }

    function getSafeFileName(filename) {
        var safefilename = '';
        if (filename !== undefined && filename != '' && filename.indexOf('.') > 0) {
            safefilename = filename.substring(0, filename.lastIndexOf('.'));
        }
        return safefilename;
    }

    /********** Captcha functions ************/

    function LoadCaptcha(cnt) {

        if (isNativeCloud() && !isCommunityForm()) {
            return;
        }

        console.log('[LoadCaptcha] Starts...');
        var captchaUrl = getURLEndPoint(enumEndpoint.GENERATE_CAPTCHA);

        if (window.XDomainRequest) {
            // Use Microsoft XDR
            formLogger('[LoadCaptcha][IE][XDomainRequest]');
            var xdr = new XDomainRequest();
            //IE9 needs these 4 method and 1 attribute even if we don't use them
            xdr.timeout = XDR_TIMEOUT_MILLISECONDS;
            xdr.onerror = function () { console.log('Error unexpected on XDR! Method[LoadCaptcha].') };
            xdr.ontimeout = function () { console.log('Time out error on XDR! Method[LoadCaptcha].') };
            xdr.onprogress = function () { };
            xdr.onload = function () {
                formLogger('[LoadCaptcha][IE][XDomainRequest]');
                var json = $.parseJSON(xdr.responseText);
                RenderCaptcha(json);
            };
            xdr.open("POST", parseURLForXDR(captchaUrl), true);
            xdr.send("captchaCnt=" + cnt);

        } else if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
            //To process ajax post in Salesforce pages in IE 11 
            formLogger('[LoadCaptcha][IE11-SF][XMLHttpRequest]');
            var oReq = null;
            if (Sarissa && Sarissa.originalXMLHttpRequest) {
                oReq = new Sarissa.originalXMLHttpRequest();
            } else if (window.XMLHttpRequest) {
                oReq = new XMLHttpRequest();
            }

            oReq.open("POST", captchaUrl, true);
            oReq.onreadystatechange = function () {

                if (oReq.readyState == 4 && oReq.status == 200) {
                    if (oReq.responseText && oReq.responseText.length > 0) {
                        formLogger('[LoadCaptcha][IE11-SF][XMLHttpRequest][Result]');
                        var json = $.parseJSON(oReq.responseText);
                        json = $.parseJSON(json);
                        RenderCaptcha(json);
                    } else {
                        formLogger('Service call exception' + oReq.responseText);
                    }
                } else if (oReq.readyState == 4 && oReq.status != 200) {
                    formLogger('Service call status:' + oReq.status);
                }
            }
            oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            oReq.send("captchaCnt=" + cnt);

        } else {

            ($).ajax({
                global: false,
                type: 'POST',
                url: captchaUrl,
                crossDomain: true,
                data: "captchaCnt=" + cnt,
                dataType: "json",
                cache: false,
                success: function (data) {
                    var json = $.parseJSON(data);
                    RenderCaptcha(json);
                },
                error: function (data) { }
            });
        }
    }

    function RenderCaptcha(json) {
        console.log('[RenderCaptcha] Starts...');
        var i = 0;
        $('#dvFastForms div[data-vatt="CAPTCHA"]').each(function () {
            var id = $(this).attr('id');
            var captchaID = json[i].captchaID;
            var image = json[i].image;

            $('#lbl' + id).attr('for', captchaID + '_Captcha');

            $('#' + id + '_Wrapper').remove();
            $(this).append('<div id="' + id + '_Wrapper" name="' + id + '_Wrapper"><img id="' + id + '_Image" alt="Captcha image" src="data:image/png;base64,' + image + '" /><br /><input type="text" class="ff-input-type ff-type-text" name="' + captchaID + '_Captcha" data-captchaid="' + captchaID + '" data-isrequired="true" id="' + captchaID + '_Captcha" /></div>');

            i++;
        });
        fs.EH.InitializeIframe();
    }

    function InitializeCaptcha() {
        console.log('[InitializeCaptcha] Starts...');

        if (isNativeCloud() && !isCommunityForm()) {
            return;
        }

        var captchaCnt = $('#dvFastForms div[data-vatt="CAPTCHA"]').length;

        console.log('[InitializeCaptcha] Starts...[' + captchaCnt + ']');
        if (captchaCnt > 0) {
            if (isOlderBrowser()) {
                //for IE8 and lower, we need to do an iframe post
                //so we can get the results back from the server
                //before we submit back to the server, we need to record how many captcha fields to create

                $('#dvFastForms #captchaCnt').remove();
                $('#dvFastForms form#form1').prepend('<INPUT name="captchaCnt" id="captchaCnt" type=hidden value="' + captchaCnt + '" />');
                $('#dvFastForms form#form1').attr('action', window.FormBASEURL + 'EngineFrame/GenerateCaptcha');
                $('#dvFastForms form#form1').trigger('submit');
            } else {
                LoadCaptcha(captchaCnt);
            }
        }
    }

    function SendCaptchaToServer() {
        console.log('[FORM][SendCaptchaToServer] Starts..');

        if (isNativeCloud() && !isCommunityForm()) {
            SendCaptchaToServer_Native();
            return;
        }

        if ($('#dvFastForms .ff-captcha').length > 0) {
            ($).support.cors = true;
            var result = false;
            var validateUrl = getURLEndPoint(enumEndpoint.CHECK_CAPTCHA);
            var formData = GenerateFormData(false);

            if (window.XDomainRequest) {
                // Use Microsoft XDR
                console.log('[SendCaptchaToServer][IE][XDomainRequest]');
                var xdr = new XDomainRequest();
                xdr.timeout = XDR_TIMEOUT_MILLISECONDS;
                xdr.onerror = function () { console.log('Error unexpected on XDR! Method[SendCaptchaToServer].') };
                xdr.ontimeout = function () { console.log('Time out error on XDR! Method[SendCaptchaToServer].') };
                xdr.onprogress = function () { };
                xdr.onload = function () {
                    result = xdr.responseText;
                    //result is a list of captchas and their validation results from the server
                    //need to iterate through them and show validation messages as necessary
                    ValidateCaptcha(result);
                    if (fs.EH.isFormValid())
                        SendPaymentToServer();
                };
                xdr.open("POST", parseURLForXDR(validateUrl), true);
                xdr.send(formData);

            } else if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
                //To process ajax post in Salesforce pages in IE 11 
                console.log('[SendCaptchaToServer][IE11-SF][XMLHttpRequest]');
                var oReq = null;
                if (Sarissa && Sarissa.originalXMLHttpRequest) {
                    oReq = new Sarissa.originalXMLHttpRequest();
                } else if (window.XMLHttpRequest) {
                    oReq = new XMLHttpRequest();
                }

                oReq.open("POST", validateUrl, true);
                oReq.onreadystatechange = function () {

                    if (oReq.readyState == 4 && oReq.status == 200) {
                        if (oReq.responseText && oReq.responseText.length > 0) {
                            result = oReq.responseText;
                            console.log('[SendCaptchaToServer][IE11-SF][XMLHttpRequest][result]');
                            console.log(result);
                            var json = $.parseJSON(result);
                            //result is a list of captchas and their validation results from the server
                            //need to iterate through them and show validation messages as necessary
                            ValidateCaptcha(json);
                            if (fs.EH.isFormValid())
                                SendPaymentToServer();
                        } else {
                            console.log(' Service call exception' + oReq.responseText);
                        }
                    } else if (oReq.readyState == 4 && oReq.status != 200) {
                        console.log(' Service call status:' + oReq.status);
                    }
                }
                oReq.send(formData);

            } else {
                ($).ajax({
                    global: false,
                    type: "POST",
                    crossDomain: true,
                    async: true,
                    url: validateUrl,
                    data: formData,
                    dataType: "json",
                    processData: false,
                    tryCount: 0,
                    retryLimit: 3,
                    success: function (responseText) {

                        result = responseText;
                        //result is a list of captchas and their validation results from the server
                        //need to iterate through them and show validation messages as necessary
                        ValidateCaptcha(result);
                        if (fs.EH.isFormValid())
                            SendPaymentToServer();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $('#dvFastForms #btnsubmit').prop('disabled', false);
                        if (textStatus == 'timeout') {
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                ($).ajax(this);
                                return;
                            }
                            return;
                        }
                        if (xhr.status == 500) { } else { }

                    }
                }); //ajax end
            }

        } else {
            SendPaymentToServer();
        }
    }

    function SendCaptchaToServer_Native() {
        if ($('#dvFastForms .ff-captcha').length > 0) {
            var isCaptchaProvided = true;
            $('#dvFastForms .ff-captcha .ff-invalid-msg').remove();
            var gRecaptchaResponse = '';
            var sendWithoutOptionalCaptcha = false;
            var optionalCaptchas = 0;
            $('#dvFastForms .ff-captcha').each(function (i, captchaElem) {
                var captchaInputElem = $(captchaElem).find('div[data-vatt="CAPTCHA"]');
                var gResponseElem = $(captchaElem).find('.g-recaptcha-response');
                var sResponseText = $(gResponseElem).val();
                if (sResponseText != 'undefined' && sResponseText != '') {
                    gRecaptchaResponse += (gRecaptchaResponse!=''?';':'') + $(gResponseElem).val();
                } else if(captchaInputElem[0].dataset.isrequired === "true"){
                    isCaptchaProvided = false;
                    sendWithoutOptionalCaptcha = false;
                    var requiredMessage = 'Required';
                    try {
                        requiredMessage = $(captchaInputElem).attr('data-requiredmessage');
                    } catch (err) { }
                    $(captchaElem).append('<div class="ff-invalid-msg">' + requiredMessage + '</div>');
                    return;
                }
                else if(captchaInputElem[0].dataset.isrequired === "false"){ // Captcha is optional as of FF-4482:
                    if(isCaptchaProvided){
                        sendWithoutOptionalCaptcha = true;
                    }
                    optionalCaptchas++;
                }

            });
            ($).support.cors = true;
            
            if (isCaptchaProvided && gRecaptchaResponse != '') {
                var result = false;
                var validateUrl = getURLEndPoint(enumEndpoint.CHECK_CAPTCHA);
                var formData = new FormData;
    
                formData.append("captcharesponse", gRecaptchaResponse);

                if (window.XDomainRequest) {
                    // Use Microsoft XDR
                    console.log('[SendCaptchaToServer][IE][XDomainRequest]');
                    var xdr = new XDomainRequest();
                    xdr.open("POST", validateUrl, true);
                    xdr.onload = function () {
                        result = xdr.responseText;
                        //result is a list of captchas and their validation results from the server
                        //need to iterate through them and show validation messages as necessary
                        ValidateCaptcha(result);
                        if (fs.EH.isFormValid())
                            SendPaymentToServer();
                    };
                    xdr.send(formData);

                } else if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
                    //To process ajax post in Salesforce pages in IE 11 
                    console.log('[SendCaptchaToServer][IE11-SF][XMLHttpRequest]');
                    var oReq = null;
                    if (Sarissa && Sarissa.originalXMLHttpRequest) {
                        oReq = new Sarissa.originalXMLHttpRequest();
                    } else if (window.XMLHttpRequest) {
                        oReq = new XMLHttpRequest();
                    }

                    oReq.open("POST", validateUrl, true);
                    oReq.onreadystatechange = function () {

                        if (oReq.readyState == 4 && oReq.status == 200) {
                            if (oReq.responseText && oReq.responseText.length > 0) {

                                console.log('[SendCaptchaToServer][IE11-SF][XMLHttpRequest][result]');

                                fs.EH.setFormValid(false);
                                var responseElem = $('<div/>').html(oReq.responseText);
                                var responseObj = $.parseJSON($(responseElem).find('#postResponse').html());
                                //console.log(' reCaptcha response');
                                if (responseObj.success) {
                                    fs.EH.setFormValid(true);
                                }
                                if (fs.EH.isFormValid()) {
                                    SendPaymentToServer();
                                } else {
                                    showCaptchaErrors();
                                }

                            } else {
                                console.log(' Service call exception' + oReq.responseText);
                            }
                        } else if (oReq.readyState == 4 && oReq.status != 200) {
                            console.log(' Service call status:' + oReq.status);
                            $('#dvFastForms #btnsubmit').prop('disabled', false);
                            console.log('CAPTCHA ERROR:' + oReq.status + oReq.readyState);
                            showCaptchaErrors();
                        }
                    }
                    oReq.send(formData);

                } else {

                    ($).ajax({
                        global: false,
                        type: "POST",
                        crossDomain: true,
                        async: true,
                        url: validateUrl,
                        data: formData,

                        processData: false,
                        contentType: false,
                        mimeType: "multipart/form-data",
                        success: function (responseText) {
                            fs.EH.setFormValid(false);
                            var responseElem = $('<div/>').html(responseText);
                            var responseObj = $.parseJSON($(responseElem).find('#postResponse').html());
                            if (responseObj.success) {
                                fs.EH.setFormValid(true);
                            }
                            if (fs.EH.isFormValid()) {
                                SendPaymentToServer();
                            } else {
                                showCaptchaErrors();
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $('#dvFastForms #btnsubmit').prop('disabled', false);
                            console.log('CAPTCHA ERROR:' + textStatus + errorThrown);
                            showCaptchaErrors();
                            if (xhr.status == 500) { } else { }

                        }
                    }); //ajax end
                }

            }
            /*If Captcha is optional, and there's only optional captchas in the form,
                proceed to the next step in the submission process:*/
            else if(sendWithoutOptionalCaptcha && optionalCaptchas > 0){
                SendPaymentToServer();
            }
            else {
                $('#dvFastForms #btnsubmit').prop('disabled', false);
            }
        } else {
            SendPaymentToServer();
        }
    }

    function showCaptchaErrors() {
        if ($('#dvFastForms .ff-captcha').length == 1) {
            ShowValidationMessage($('#dvFastForms .ff-captcha'), "GENERAL", "Captcha field is expired or not valid. Please try again.");
        } else if ($('#dvFastForms .ff-captcha').length > 1) {
            $('#dvFastForms .ff-captcha').each(function (i, captchaElem) {
                ShowValidationMessage(captchaElem, "GENERAL", "One or more of the captcha fields are expired or not valid. Please try again.");
            });
        }
    }
    /*************Payment functions*************/

    function UnloadWarning() {
        if (enableUnloadWarning) {
            return ffPrompt_PaymentInProcessWarning;
        } else {
            return;

        }

    }
    
    function stripeResponseHandler(response) {
        console.log('[FORM] [stripeResponseHandler] Starts..');

        var paymentId = '#FFPAYMENT' + currentPaymentID + ', #lblFFPAYMENT' + currentPaymentID;

        $(paymentId).find(".ff-creditcard").removeAttr("data-stripe");
        $(paymentId).find(".ff-cvv").removeAttr("data-stripe");
        $(paymentId).find(".ff-mm").removeAttr("data-stripe");
        $(paymentId).find(".ff-yyyy").removeAttr("data-stripe");

        if (response.error) {
            FFShowGeneralError(response.error.message);
            $('#dvFastForms #btnsubmit').prop('disabled', false);
        } else {
            var token = response.id;
            $(paymentId).append($('<input type="hidden" id="FFPaymentToken' + currentPaymentID + '" name="FFPaymentToken' + currentPaymentID + '">').val(token));
            SendPaymentToServer();
        }
    };

    window.enableUnloadWarning = false;
    window.currentPaymentID = "";

    function SendPaymentToServer() {
        console.log('[FORM] [SendPaymentToServer] Starts..');

        if ($('#dvFastForms .ff-payment-wrapper').length > 0 && $('#dvFastForms .ff-creditcard').filter(function () { return this.value.length > 0; }).length > 0) {
            var paymentReady = false;

            if ($('#dvFastForms #paymentType').val().toLowerCase() == "stripe") {
                $('#dvFastForms .ff-payment-wrapper').each(function () {
                    if ($(this).data('apikey') != null && $(this).data('apikey') != "" && $(this).find('.ff-creditcard').filter(function () { return this.value.length > 0; }).length > 0) {
                        currentPaymentID = $(this).attr('id').replace("lblFFPAYMENT", "").replace("FFPAYMENT", "");
                        var token = $('#FFPaymentToken' + currentPaymentID);
                        paymentReady = true;
                    }
                });
            } else {
                paymentReady = true;
            }

            if (paymentReady) {

                enableUnloadWarning = true;
                while (!paymentReady)
                    ($).support.cors = true;
                var result = false;
                var validateUrl = window.FormBASEURL + 'EngineFrame/CheckPayment';
                var formData = GenerateFormData(false);
                formData.append("ReturnUrl", window.location.href)

                if (window.XDomainRequest) {
                    // Use Microsoft XDR
                    console.log('[SendPaymentToServer][IE][XDomainRequest]');
                    var xdr = new XDomainRequest();
                    //IE9 needs these 4 method and 1 attribute even if we don't use them
                    xdr.timeout = XDR_TIMEOUT_MILLISECONDS;
                    xdr.onerror = function () { console.log('Error unexpected on XDR! Method[SendPaymentToServer].') };
                    xdr.ontimeout = function () { console.log('Time out error on XDR! Method[SendPaymentToServer].') };
                    xdr.onprogress = function () { };
                    xdr.onload = function () {
                        $('#FFPaymentToken' + currentPaymentID).remove();
                        enableUnloadWarning = false;
                        result = xdr.responseText;
                        //result is a list of captchas and their validation results from the server
                        //need to iterate through them and show validation messages as necessary
                        ValidatePayment(result);
                        if (fs.EH.isFormValid()) {
                            ResetSaveDraft();
                            PostFormData();
                        }
                    };
                    xdr.open("POST", parseURLForXDR(validateUrl), true);
                    xdr.send(formData);

                } else if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
                    //To process ajax post in Salesforce pages in IE 11 
                    formLogger('[SendPaymentToServer][IE11-SF][XMLHttpRequest]');
                    var oReq = null;
                    if (Sarissa && Sarissa.originalXMLHttpRequest) {
                        oReq = new Sarissa.originalXMLHttpRequest();
                    } else if (window.XMLHttpRequest) {
                        oReq = new XMLHttpRequest();
                    }

                    oReq.open("POST", validateUrl, true);
                    oReq.onreadystatechange = function () {
                        if (oReq.readyState == 4 && oReq.status == 200) {
                            if (oReq.responseText && oReq.responseText.length > 0) {
                                formLogger('[SendPaymentToServer][IE11-SF][XMLHttpRequest][result]');
                                $('#FFPaymentToken' + currentPaymentID).remove();
                                enableUnloadWarning = false;
                                result = oReq.responseText;
                                //result is a list of captchas and their validation results from the server
                                //need to iterate through them and show validation messages as necessary
                                var json = $.parseJSON(result);
                                ValidatePayment(json);
                                if (fs.EH.isFormValid()) {
                                    ResetSaveDraft();
                                    PostFormData();
                                }
                            } else {
                                console.log(' Service call exception' + oReq.responseText);
                            }
                        } else if (oReq.readyState == 4 && oReq.status != 200) {
                            console.log(' Service call status:' + oReq.status);
                        }
                    }
                    oReq.send(formData);

                } else {
                    ($).ajax({
                        type: "POST",
                        crossDomain: true,
                        async: true,
                        url: validateUrl,
                        data: formData,
                        dataType: "json",
                        processData: false,
                        tryCount: 0,
                        retryLimit: 3,
                        success: function (responseText) {
                            $('#FFPaymentToken' + currentPaymentID).remove();
                            enableUnloadWarning = false;
                            result = responseText;
                            //result is a list of captchas and their validation results from the server
                            //need to iterate through them and show validation messages as necessary
                            ValidatePayment(result);
                            if (fs.EH.isFormValid()) {
                                ResetSaveDraft();
                                PostFormData();
                            }else{
                                console.log('Payment processing failed let\'s move to first error');
                                fs.N.ScrollToFirstError();
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $('#FFPaymentToken' + currentPaymentID).remove();
                            enableUnloadWarning = false;
                            $('#dvFastForms #btnsubmit').prop('disabled', false);
                            if (textStatus == 'timeout') {
                                this.tryCount++;
                                if (this.tryCount <= this.retryLimit) {
                                    //try again
                                    ($).ajax(this);
                                    return;
                                }
                                return;
                            }
                        }
                    }); //end ajax call
                }
            }
        } else {
            ResetSaveDraft();
            PostFormData();
        }
    }

    window.ResetSaveDraft = function ResetSaveDraft() {
        $('#dvFastForms #isDraft').val('False');
        $('#dvFastForms #draftSaved').val('False');
        $('#dvFastForms #btndiscard').hide();
        if ($('#submitRules').length) {
            var rules = $('#submitRules').val();
            var ruleArr = rules.split(',').map(function (item) { return parseInt(item, 10); });
            ExecEvaluateRules(ruleArr);
        }
    }

    function UpdatePaymentAmountCall(thisVal, fieldNum, amountType) {
        switch (amountType) {
            case "FFRECURRINGFEE":
                UpdatePaymentAmount(thisVal, "FFRecurringFee" + fieldNum);
                break;
            case "FFAMOUNT":
                UpdatePaymentAmount(thisVal, "FFAmount" + fieldNum);
                break;
            case "FFTAXES":
                UpdatePaymentAmount(thisVal, "FFTaxes" + fieldNum);
                break;
            case "FFSHIPPING":
                UpdatePaymentAmount(thisVal, "FFShipping" + fieldNum);
                break;
        }
    }
    window.UpdatePaymentAmount = function UpdatePaymentAmount(sourceVal, targetElem) {
        if ($('#' + targetElem).length > 0) {
            if (sourceVal != null && sourceVal != "") {
                if (targetElem.lastIndexOf("FFTaxes", 0) === 0) {
                    var amountVal = ToAmount($('#' + targetElem.replace("Taxes", "Amount")).text());
                    var taxVal = ToAmount(sourceVal);
                    if ($.isNumeric(amountVal) && $.isNumeric(taxVal))
                        $('#' + targetElem).text(ToAmount(amountVal * (taxVal / 100)));
                    else
                        $('#' + targetElem).text("0.00");
                } else {
                    $('#' + targetElem).text(ToAmount(sourceVal).toFixed(2));
                }
            } else {
                $('#' + targetElem).text("0.00");
            }
        }
        UpdatePaymentTotals();
    }


    window.UpdatePaymentTotals = function UpdatePaymentTotals() {
        var creditcard = $(fsQ.S("#dvFastForms .ff-creditcard"));
        fsQ.forEach(creditcard, function (currentItem) {
            var fieldNum = $(currentItem).attr('id').replace('FFCreditCard', '');

            var shippingAmount = ToAmount($('#FFShipping' + fieldNum).text());
            var taxesAmount = ToAmount($('#FFTaxes' + fieldNum).text());
            var initialAmount = ToAmount($('#FFRecurringFee' + fieldNum).text());
            var amount = ToAmount($('#FFAmount' + fieldNum).text());
            var subtotalAmount = ToAmount($('#FFSubTotalAmount' + fieldNum).text());
            var taxVal = ToAmount($('#FFTaxes' + fieldNum).data('taxes'));
            if (taxVal > 0) {
                taxVal = ToAmount(amount * (taxVal / 100));
                taxesAmount = (isNaN(taxVal) ? 0 : taxVal);
                $('#FFTaxes' + fieldNum).text(taxesAmount.toFixed(2));

            }
            subtotalAmount = ToAmount(ToAmount(amount, 2) + ToAmount(shippingAmount, 2) + ToAmount(taxesAmount, 2), 2).toFixed(2);
            var totalAmount = ToAmount(ToAmount(amount, 2) + ToAmount(shippingAmount, 2) + ToAmount(taxesAmount, 2) + ToAmount(initialAmount, 2)).toFixed(2);
            $('#FFSubTotalAmount' + fieldNum).text((isNaN(subtotalAmount) ? ToAmount(0, 2) : subtotalAmount));
            $('#FFTotalAmount' + fieldNum).text((isNaN(totalAmount) ? ToAmount(0, 2).toFixed(2) : totalAmount));
        });
    }



    window.EvaluatePaymentAmount = function EvaluatePaymentAmount(type, fieldNum, formula) {
        //example: 5+["Contact.Level__c"].amount+["Contact.TestCheckbox__c"].amount+["Contact.Case.A.Status"].val
        var jsFormula = replaceAll("IF(", "FFIf(", formula);
        jsFormula = replaceAll("if(", "FFIf(", jsFormula);
        jsFormula = replaceAll("[\"", "ToAmount(GetPaymentAmount(\"", jsFormula);
        jsFormula = replaceAll("].amount", "," + fieldNum + "))", jsFormula);
        jsFormula = replaceAll("].val", "))", jsFormula);
        jsFormula = replaceAll("=", "==", jsFormula);

        jsFormula = "ToAmount(" + jsFormula + ")";
        switch (type) {
            case "SUBTOTAL":
                var totalField = $('#dvFastForms #FFAmount' + fieldNum);
                break;
            case "SHIPPING":
                var totalField = $('#dvFastForms #FFShipping' + fieldNum);
                break;
            case "TAXES":
                var totalField = $('#dvFastForms #FFTaxes' + fieldNum);
                break;
            case "INITIALAMOUNT":
                var totalField = $('#dvFastForms #FFRecurringFee' + fieldNum);
                break;
        }
        var total;
        if (typeof jsep === 'undefined') {
            var F = new Function("return " + jsFormula);
            total = F();
        } else {
            var jsepRuleObj = jsep(jsFormula)
            total = CallEvaluateFunction(jsepRuleObj);
        }
        if (type == 'TAXES') {
            $(totalField).text(ToAmount($('#dvFastForms #FFAmount' + fieldNum, 2).text() * (ToAmount(total, 2) / 100)));
            var taxPctLabel = $('#dvFastForms #FFPAYMENT' + fieldNum + ', #dvFastForms #lblFFPAYMENT' + fieldNum).find('.ff-tax-percentage');
            if (taxPctLabel != undefined && parseFloat(total) > 0) {
                $(taxPctLabel).text(' (' + ToAmount(total, 2) + '%)');
                $(totalField).data("taxes", ToAmount(total, 1));
            } else {
                $(taxPctLabel).text('');
                $(totalField).data("taxes", "0.00");
            }
        } else
            $(totalField).text((isNaN(total) ? ToAmount(0, 2) : total.toFixed(2)));

        UpdatePaymentTotals();

    }
    /*Payment Formulas evaluation helper method block starts*/
    function CallEvaluateFunction(funcObj) {
        return EvaluateFunction(funcObj);
    }

    function EvaluateFunction(funcObj) {
        try {
            switch (funcObj.type) {
                case 'CallExpression':
                    return EvaluateCallExpression(funcObj);
                    break;
                case 'BinaryExpression':
                    return EvaluateBinaryExpression(funcObj);
                    break;
                case 'Literal':
                    return EvaluateLiteralExpression(funcObj);
                    break;
            }
        } catch (err) {
            console.log('Exception [EvaluateFunction]:', funcObj, err);
        }
        return false;
    }

    function EvaluateCallExpression(funcObj) {
        var argumentsArr = funcObj.arguments;
        switch (funcObj.callee.name) {
            case "ToAmount":
                return ToAmount(EvaluateFunction(argumentsArr[0]));
                break;
            case "GetPaymentAmount":
                if (argumentsArr.length == 1) {
                    return GetPaymentAmount(argumentsArr[0].value);
                } else {
                    return GetPaymentAmount(argumentsArr[0].value, argumentsArr[1].value);
                }

                break;
            case "FFIf":
                return FFIf(EvaluateFunction(argumentsArr[0]), EvaluateFunction(argumentsArr[1]), EvaluateFunction(argumentsArr[2]));
                break;
        }
    }

    function EvaluateBinaryExpression(funcObj) {
        switch (funcObj.operator) {
            case "+":
                return EvaluateLeftArgumentExpression(funcObj.left) + EvaluateRightArgumentExpression(funcObj.right);
                break;
            case "-":
                return EvaluateLeftArgumentExpression(funcObj.left) - EvaluateRightArgumentExpression(funcObj.right);
                break;
            case "*":
                return EvaluateLeftArgumentExpression(funcObj.left) * EvaluateRightArgumentExpression(funcObj.right);
                break;
            case "/":
                return EvaluateLeftArgumentExpression(funcObj.left) / EvaluateRightArgumentExpression(funcObj.right);
                break;
            case "==":
                return EvaluateLeftArgumentExpression(funcObj.left) == EvaluateRightArgumentExpression(funcObj.right);
                break;
        }
        return false;
    }

    function EvaluateLeftArgumentExpression(funcObj) {
        return EvaluateFunction(funcObj);
    }

    function EvaluateRightArgumentExpression(funcObj) {
        return EvaluateFunction(funcObj);
    }

    function EvaluateLiteralExpression(funcObj) {
        var returnVal = funcObj.value;
        if (!isSFNumeric(funcObj.value) && returnVal.split('\\.').length > 1) {
            var fieldId = funcObj.value.replace(/\\\\/g, '');
            returnVal = document.getElementById(fieldId).value;
            console.log('returnVal:' + returnVal);
        }
        return returnVal;
    }

    function isSFNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    /*Payment Formulas evaluation helper method block ends */
    window.GetPaymentAmount = function GetPaymentAmount(elemId, fieldNum) {
        var elem = document.getElementById(elemId.replace(/\\/g, ''));
        if (fieldNum == null) {
            if ($(elem).prop('tagName') == 'SELECT' && $(elem).attr("multiple") != 'undefined') {
                var sum = 0;
                var strResult = "";
                $('option:selected', elem).each(function () {
                    if ($.isNumeric($(this).val()))
                        sum += ToAmount($(this).val());
                    else
                        strResult += $(this).val();
                });
                if (strResult != "")
                    return strResult;
                else
                    return ToAmount(sum);
            } else {
                var elemVal = $(elem).val();
                return ($.isNumeric(elemVal) ? ToAmount(elemVal) : elemVal);
            }
        } else {
            if ($(elem).prop('tagName') == 'SELECT' && $(elem).attr("multiple") == 'undefined') {
                return ToAmount($('option:selected', elem).attr('data-amount-' + fieldNum), 2);
            } else if ($(elem).prop('tagName') == 'SELECT' && $(elem).attr("multiple") != 'undefined') {
                var sum = 0;
                $('option:selected', elem).each(function () {
                    sum += ToAmount($(this).attr('data-amount-' + fieldNum));
                });
                return ToAmount(sum);
            } else if ($(elem).attr("data-vatt") == 'BOOLEAN' && $(elem).is(':checked')) {
                return ToAmount($(elem).attr('data-true-amount' + fieldNum), 2);
            } else if ($(elem).attr("data-vatt") == 'BOOLEAN' && !$(elem).is(':checked')) {
                return ToAmount($(elem).attr('data-false-amount' + fieldNum), 2);
            } else {
                return ToAmount($(elem).attr('data-amount-' + fieldNum));
            }
        }
    }

    Number.prototype.round = function (p) {
        p = p || 10;
        return parseFloat(this.toFixed(p));
    };

    window.GetValue = function GetValue(itm) {
        if (itm != undefined) {
            var val = itm;
            if (jQuery.type(itm) == "array") {
                val = 0;
                for (var i = 0; i < itm.length; i++) {
                    val += ToAmount(itm[i]);
                }
            }
            return ToAmount(val);
        } else {
            return 0;
        }
    }

    window.GetElem = function GetElem(elem) {
        if ($(elem).prop('tagName') == 'SELECT')
            return $('option:selected', elem);
        else
            return elem;
    }

    window.ToAmount = function ToAmount(itm, places) {
        if ($.isNumeric(itm))
            return parseFloat(itm).round(places);
        else if (itm == undefined) {
            return parseFloat(0).round(places);
        } else {
            return itm;
        }
    }

    window.escapeRegExp = function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    window.replaceAll = function replaceAll(find, replace, str) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function ValidateCaptcha(json) {
        for (var i = 0; i < json.length; i++) {
            if (!json[i].isValid) {
                var elem = $('#dvFastForms #' + json[i].captchaID + '_Captcha');
                ShowValidationMessage($(elem).parent().parent(), "CAPTCHA");
                $('#dvFastForms #btnsubmit').prop('disabled', false);
                InitializeCaptcha();
                fs.EH.setFormValid(false);
            }
        }
    }

    window.ValidatePayment = function ValidatePayment(json) {
        for (var i = 0; i < json.length; i++) {
            var elem = $('#dvFastForms #' + json[i].paymentFieldId + ', #dvFastForms #lbl' + json[i].paymentFieldId);
            var enabled3DS = true;
              if (!json[i].success) {
                if ($('#dvFastForms #paymentType').val().toLowerCase() == "stripe" && enabled3DS && json[i].stripePaymentResult.stripeStatus == "requires_action") {
                    fs.EH.setFormValid(false);
                    fs.SPH.renderStripeUI(json[i].stripePaymentResult.redirectUrl, json[i].stripePaymentResult.paymentIntentId, json[i].stripePaymentResult.paymentMethodID, json[i].transactionIdValue);
                }else {
                    var errorMsg = json[i].errorMessage;
                    if (!isNullOrEmpty(errorMsg) && errorMsg == "INVALID_COUNTRY") {
                        errorMsg = ffPaymentError_InvalidCountry
                    }
                    if (json[i].errorSource !== undefined && json[i].errorSource == "FormCustom") {
                        elem = $("#dvFastForms #" + json[i].paymentFieldId.replace(/\./g, "\\."));
                        ShowValidationMessage($(elem), "GENERAL", errorMsg);
                    } else {
                        ShowValidationMessage($(elem), "PAYMENT", errorMsg);
                    }
                    fs.EH.setFormValid(false);
                    $('#dvFastForms #btnsubmit').prop('disabled', false);
                } 
			} else {
                if (json[i].transactionIdField != "" && json[i].transactionIdField != null) {
                    var transIdElem = $('#dvFastForms #' + json[i].transactionIdField.replace(/\./g, "\\."));
                    if (transIdElem.length > 0) {
                        $(transIdElem).val(json[i].transactionIdValue);
                    }
                }
                if (json[i].totalAmountField != "" && json[i].totalAmountField != null) {
                    var totalAmountElem = $('#dvFastForms #' + json[i].totalAmountField.replace(/\./g, "\\."));
                    if (totalAmountElem.length > 0) {
                        $(totalAmountElem).val(json[i].totalAmountValue);
                    }
                }
            }
        }
    }

    /**********Logging functions ***********/
    function LogEvent(eventName, details) {

        if (isNativeCloud()) {
            return;
        }

        ($).support.cors = true;
        var result = false;
        var logUrl = window.FormBASEURL + 'EngineFrame/LogEvent';
        if (window.location.protocol == "http:" && logUrl.lastIndexOf("https:", 0) === 0)
            logUrl = logUrl.replace("https:", "http:");
        if (window.XDomainRequest) {
            // Use Microsoft XDR
            var xdr = new XDomainRequest();
            //IE9 needs these 4 method and 1 attribute even if we don't use them
            xdr.timeout = XDR_TIMEOUT_MILLISECONDS;
            xdr.onerror = function () { console.log('Error unexpected on XDR! Method[LogEvent].') };
            xdr.ontimeout = function () { console.log('Time out error on XDR! Method[LogEvent].') };
            xdr.onprogress = function () { };
            xdr.onload = function () { };
            xdr.open("POST", parseURLForXDR(logUrl), true);
            xdr.send("orgId=" + $("#dvFastForms #txtOrgId").val() + "&sessionId=" + $("#dvFastForms #txtSessionID").val() + "&eventName=" + encodeURIComponent(eventName) + "&details=" + encodeURIComponent(details));

        } else if (("ActiveXObject" in window) && window.XMLHttpRequest && (typeof (Sarissa) !== "undefined")) {
            //To process ajax post in Salesforce pages in IE 11 
            console.log('[LogEvent][IE11-SF][XMLHttpRequest]');
            var oReq = null;
            if (Sarissa && Sarissa.originalXMLHttpRequest) {
                oReq = new Sarissa.originalXMLHttpRequest();
            } else if (window.XMLHttpRequest) {
                oReq = new XMLHttpRequest();
            }

            oReq.open("POST", logUrl, true);
            oReq.send("orgId=" + $("#dvFastForms #txtOrgId").val() + "&sessionId=" + $("#dvFastForms #txtSessionID").val() + "&eventName=" + encodeURIComponent(eventName) + "&details=" + encodeURIComponent(details));

        } else {
            ($).ajax({
                global: false,
                async: true,
                type: "POST",
                url: logUrl,
                crossDomain: true,
                data: "orgId=" + $("#dvFastForms #txtOrgId").val() + "&sessionId=" + $("#dvFastForms #txtSessionID").val() + "&eventName=" + encodeURIComponent(eventName) + "&details=" + encodeURIComponent(details),
                dataType: "text",
                processData: false,
                tryCount: 0,
                retryLimit: 3
            }); //ajax end
        }
    }

    /********** Helper functions ***********/
    function isOlderBrowser() {
        var browser = ($('#browser').attr('class'));
        return (browser == 'ie6' || browser == 'ie7' || browser == 'ie8' || browser == 'ie9');
    }

    function RedirectToUrl(url) {
        var target = window;
        if (inIframe() && fs.EH.isParentAccessible()) {
            target = parent.window;
        }
        if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
            target.location.href = url;
        } else {
            target.location.href = 'http://' + url;
        }
    }
    function GetName(elem) {
        var name = elem.attr('name');
        if (name == undefined || name == null)
            name = elem.attr('id');
        if (name == undefined || name == null)
            name = elem.attr('class');
        return name;
    }


    function AddToArray(arr, name, val) {
        var i = arr.length;
        arr[i] = [];
        arr[i][0] = name;
        arr[i][1] = val;
    }


    function GetParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function LoadCSS(href) {
        var loadCssLink = document.createElement('link');
        loadCssLink.rel = 'stylesheet';
        loadCssLink.type = 'text/css';
        loadCssLink.href = href;
        if ($('#' + window.FS_FormConfiguration.RootElementId).length > 0) {
            //we use two types of root elements so far to render form
            //1 SCRIPT tag- we append the CSS file as LINK element as next node in dom to script tag
            //2 DIV tag- we prepend CSS file right within this DIV element at first index as LINK element
            if ($('#' + window.FS_FormConfiguration.RootElementId)[0].nodeName == 'SCRIPT') {
                //When root element is SCRIPT tag           
                $($("#" + window.FS_FormConfiguration.RootElementId)).after(loadCssLink);
            } else {
                //When root element is DIV tag
                $("#" + window.FS_FormConfiguration.RootElementId).prepend(loadCssLink);
            }
        }
    }

    function LoadJS(src) {
        var jsLink = document.createElement('script');
        jsLink.type = 'text/javascript';
        jsLink.src = src;
        var isLightning = fs.Utils.getFSFormConfigProperty("IsSourceLightning",false);
        if (isLightning) {
            var parentElem = document.getElementById(window.FS_FormConfiguration.RootElementId);
            parentElem.appendChild(jsLink);
        } else {
            $("#" + window.FS_FormConfiguration.RootElementId).prepend(jsLink);
        }
    };

    function getEmbedCodeParamsRegular() {
        var embedCodeParamArray = {};
        var embedCodeQueryString = $("#jsFastForms").attr("src").split('?');
        if (embedCodeQueryString.length == 2) {
            var itemArr = embedCodeQueryString[1].split('&');
            var i = 0;
            for (i; i < itemArr.length; i++) {
                var qArr = itemArr[i].split('=');
                embedCodeParamArray[qArr[0]] = decodeURIComponent(qArr[1]);
            }
        }
        return embedCodeParamArray;
    }

    function getSFSrcAttribute(elemId, attributeName) {
        var srcElem = $('#' + elemId);
        return srcElem !== undefined && $(srcElem).attr(attributeName) === undefined ? "" : $(srcElem).attr(attributeName);
    }

    function getEmbedCodeParams() {
        var embedCodeParamArray = {};
        var embedCodeQueryString = getSFSrcAttribute("jsFastFormsWrapper", "data-ffparam");
        var jsSrc = getSFSrcAttribute("jsFastForms", "src");
        if (jsSrc != '' && jsSrc.toLowerCase().indexOf('.salesforce.com') < 0) {
            embedCodeParamArray = getEmbedCodeParamsRegular();
        }
        if (embedCodeQueryString !== undefined && embedCodeQueryString != '') {
            var itemArr = embedCodeQueryString.split('&');
            var i = 0;
            for (i; i < itemArr.length; i++) {
                var qArr = itemArr[i].split('=');
                embedCodeParamArray[qArr[0]] = decodeURIComponent(qArr[1]);
            }
        } else {
            console.log('Formstack Parameters' + embedCodeQueryString);
        }
        return embedCodeParamArray;
    }

    function inIframe() {
        try {
            if (typeof window.FSEnableOldFrameCheck != 'undefined') {
                return window.self !== window.top;
            }
            else {
                return window.self.name == 'ffEmbedFrame';
            }
        } catch (e) {
            return true;
        }
    }

    window.formLogger = function formLogger(pDescription) {
        if (window.formLoggerActive != null && window.formLoggerActive) {
            console.log(pDescription);
        }
    }
    
    function GetFormInfo() {
        GetHTML(window.FS_FormConfiguration["GetHTMLUrl"]);
    }
    window.IsFormJSReady = function () {
        if (window.FS_FormConfiguration["JSReady"] != null && window.FS_FormConfiguration["JSReady"]) {
            console.log('[FORM] [IsFormJSReady] TRUE ' + window.FS_FormConfiguration["JSReady"]);
            return true;
        }
        console.log('[FORM] [IsFormJSReady] FALSE ' + window.FS_FormConfiguration["JSReady"]);
        return false;
    }
    window.callbackFormJSReady = function () {
        console.log('[FORM] [callbackFormJSReady] ' + window.FS_FormConfiguration["GetHTMLUrl"]);
        GetFormInfo();
    }

    /******** Our main function ********/
    function Main($) {

        $(document).ready(function ($) {

            window.onbeforeunload = UnloadWarning;
            var isSourceLightning = false;
            if (window.FS_FormConfiguration !== null && window.FS_FormConfiguration.IsSourceLightning !== undefined && window.FS_FormConfiguration.IsSourceLightning) {
                ffDialogPositionOption = { my: "left top", at: "left top", of: "#dvBannerHTML" };
                isSourceLightning = true;
            }
            LoadCSS(window.CDNResourceRoot + "styles/jquery-ui.css");
            LoadCSS(window.CDNResourceRoot + "styles/jquery-ui-timepicker-addon.css");
            LoadCSS(window.CDNResourceRoot + "styles/select2.css");
            LoadCSS(window.CDNResourceRoot + "styles/ui.jqgrid.css");

            var htmlFrame = getURLEndPoint(enumEndpoint.INDEX);
            window.FS_FormConfiguration["JSReady"] = true;
            var embedCodeParamArray = getEmbedCodeParams();
            if (embedCodeParamArray["d"] != undefined && embedCodeParamArray["d"] != "") {
                if (isSourceLightning) {
                    if (isClassic() && _SafeBoolean(window.FS_FormConfiguration["hasRuleOrScript"], true)) {
                        LoadJS(window.FormBASEURL + 'EngineFrame/JSResource/' + embedCodeParamArray["d"]);
                    }
                    else if (_SafeBoolean(window.FS_FormConfiguration["hasRuleOrScript"], false)) {
                        window.FS_FormConfiguration["JSReady"] = false;
                        LoadJS(window.FormBASEURL + 'services/apexrest/' + GetFormNamespace('/') + 'FFNResource/v1/' + window.FS_FormConfiguration["formIdentifier"]);
                    }
                }
                var url = htmlFrame + '?d=' + encodeURIComponent(embedCodeParamArray["d"]);

                if (embedCodeParamArray["dp"] != undefined && embedCodeParamArray["dp"] != "") {
                    url += "&dp=" + encodeURIComponent(embedCodeParamArray["dp"]);
                }

                if (embedCodeParamArray["ucId"] != undefined && embedCodeParamArray["ucId"] != "") {
                    url += "&ucId=" + encodeURIComponent(embedCodeParamArray["ucId"]);
                }

                if (embedCodeParamArray["ft"] != undefined && embedCodeParamArray["ft"] != "") {
                    url += "&ft=" + encodeURIComponent(embedCodeParamArray["ft"]);
                }

                if (embedCodeParamArray["iu"] != undefined && embedCodeParamArray["iu"] != "") {
                    url += "&iu=" + encodeURIComponent(embedCodeParamArray["iu"]);
                }

                if (embedCodeParamArray["cut"] != undefined && embedCodeParamArray["cut"] != "") {
                    url += "&cut=" + encodeURIComponent(embedCodeParamArray["cut"]);
                }

                if (embedCodeParamArray["cid"] != undefined && embedCodeParamArray["cid"] != "") {
                    url += "&cid=" + encodeURIComponent(embedCodeParamArray["cid"]);
                }

                if (embedCodeParamArray["ctype"] != undefined && embedCodeParamArray["ctype"] != "") {
                    url += "&ctype=" + encodeURIComponent(embedCodeParamArray["ctype"]);
                }

                if (embedCodeParamArray["cviewmode"] != undefined && embedCodeParamArray["cviewmode"] != "") {
                    url += "&cviewmode=" + encodeURIComponent(embedCodeParamArray["cviewmode"]);
                }

                if (isSourceLightning && embedCodeParamArray["ls"] != undefined && embedCodeParamArray["ls"] != "") {
                    ///if script is being served from Lighting component and is hosted as static resource in SF client's instance then the following parameter should be set to true
                    url += "&ls=" + encodeURIComponent(embedCodeParamArray["ls"]);
                }
                //add the hosting page's URL parameters
                url += location.search.replace('?', '&');
                window.FS_FormConfiguration["GetHTMLUrl"] = url;
                if (IsFormJSReady()) {
                    GetFormInfo();
                }

            } else {
                //we are in preview mode
                InitializeForm();
                InitializeCaptcha();
            }

        });
    }

    function fixedEncodeURIComponent(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    }

    function isValidationOff(pInputElement, pValidatioTypeName) {
        if ($(pInputElement).attr('data-validatefieldtype') === pValidatioTypeName) {
            return false;
        } else {
            return true;
        }
    }

    function isValidDate(pDateInputElement) {

        if (isValidationOff(pDateInputElement, 'date')) {
            return true;
        }

        var vValue = $(pDateInputElement).val();
        if (vValue === '') {
            return true;
        }

        if ((moment(vValue, window.fs_formLocaleDate, true).isValid()) ||
            (moment(vValue, getFlexibleFormatForDate(), true).isValid())) {
            return true;
        } else {
            window.ShowValidationMessage(pDateInputElement, "DATE");
            return false;
        }
    }

    function isValidDateTime(pDateTimeInputElement) {

        if (isValidationOff(pDateTimeInputElement, 'datetime')) {
            return true;
        }

        var vValue = $(pDateTimeInputElement).val();
        if (vValue === '') {
            return true;
        }

        if ((moment(vValue, window.fs_formLocaleDate + ' ' + window.fs_formLocaleTime, true).isValid()) ||
            (moment(vValue, window.fs_formLocaleDate, true).isValid()) ||
            (moment(vValue, getFlexibleFormatForDate(), true).isValid()) ||
            (moment(vValue, window.fs_formLocaleDate + ' ' + 'HH:mm', true).isValid()) ||
            (moment(vValue, getFlexibleFormatForDate() + ' ' + 'HH:mm', true).isValid()) ||
            (moment(vValue, getFlexibleFormatForDate() + ' ' + window.fs_formLocaleTime, true).isValid())) {
            return true;
        } else {
            window.ShowValidationMessage(pDateTimeInputElement, "DATETIME");
            return false;
        }
    }

    function getFlexibleFormatForDate() {
        return window.fs_formLocaleDate.replace('MM', 'M').replace('DD', 'D');
    }
    function getValidDateToSubmit(pInputElement,vValue){
        var dateValue = vValue;
        var formatForDateSubmission = isClassic()?formDateSubmission:formDateFormatForNativeSubmission;
        var localFormatForDate = (moment(dateValue, window.fs_formLocaleDate, true).isValid())?window.fs_formLocaleDate:'';
        if(localFormatForDate===''){
            localFormatForDate = getFlexibleFormatForDate();
        }
        if (moment(dateValue, localFormatForDate, true).isValid()) {
            dateValue = moment(dateValue, localFormatForDate, true).format(formatForDateSubmission);
        } else {
            if (isValidationOff(pInputElement, 'date')) {
                dateValue = '';
            } else {
                dateValue = 'InvalidDate[' + dateValue + ']';
            }
        }
        return dateValue;
    }
    function getDateOrDateTimeToSubmit(pInputElement) {
        var vValue = $(pInputElement).val();
        console.log('[getDateOrDateTimeToSubmit] input-vValue[' + vValue + ']');
        if (!isNullOrEmpty(vValue)) {
            if (isDateField(pInputElement)) {
                vValue = getValidDateToSubmit(pInputElement,vValue);
                console.log('[getDateOrDateTimeToSubmit] output-vValue[' + vValue + '][Date]');
            } else {
                var vMaxLength = $(pInputElement).attr('maxlength');

                if (moment(vValue, window.fs_formLocaleDate + ' ' + window.fs_formLocaleTime, true).isValid()) {
                    //In order to not break ClassicLightning, we will send as ISO only if the user has removed the field and add again with the new length
                    //Back-end won't be responsible for convert the date to ISO.
                    if (isClassic() && vMaxLength != '22') {
                        vValue = moment(vValue, window.fs_formLocaleDate + ' ' + window.fs_formLocaleTime, true).format(formDateSubmission + ' ' + formTimeSubmission);
                    } else {
                        vValue = moment(vValue, window.fs_formLocaleDate + ' ' + window.fs_formLocaleTime, true).toISOString();
                    }
                } else if (moment(vValue, window.fs_formLocaleDate, true).isValid()) {
                    // Code to support whatever they user sets on fs_formLocaleDate like dd/mm/yyyy hh:mm:ss
                    if (isClassic() && vMaxLength != '22') {
                        vValue = moment(vValue, window.fs_formLocaleDate, true).format(formDateSubmission + ' ' + formTimeSubmission);
                    } else {
                        vValue = moment(vValue, window.fs_formLocaleDate, true).toISOString();
                    }
                } else if (moment(vValue, getFlexibleFormatForDate() + ' ' + window.fs_formLocaleTime, true).isValid()) {
                    // Code to support flexible date like 1/1/2018 which is the same as 01/01/2018
                    if (isClassic() && vMaxLength != '22') {
                        vValue = moment(vValue, getFlexibleFormatForDate() + ' ' + window.fs_formLocaleTime, true).format(formDateSubmission + ' ' + formTimeSubmission);
                    } else {
                        vValue = moment(vValue, getFlexibleFormatForDate() + ' ' + window.fs_formLocaleTime, true).toISOString();
                    }
                } else if (moment(vValue, getFlexibleFormatForDate(), true).isValid()) {
                    // Code to support flexible date like 1/1/2018 which is the same as 01/01/2018
                    if (isClassic() && vMaxLength != '22') {
                        vValue = moment(vValue, getFlexibleFormatForDate(), true).format(formDateSubmission + ' ' + formTimeSubmission);
                    } else {
                        vValue = moment(vValue, getFlexibleFormatForDate(), true).toISOString();
                    }
                } else if (moment(vValue, window.fs_formLocaleDate + ' ' + 'HH:mm', true).isValid()) {
                    // Code to support flexible hour like 20:30 or 18:30 even if the user has set to HH:mm which is 08:30 PM
                    if (isClassic() && vMaxLength != '22') {
                        vValue = moment(vValue, window.fs_formLocaleDate + ' ' + 'HH:mm', true).format(formDateSubmission + ' ' + formTimeSubmission);
                    } else {
                        vValue = moment(vValue, window.fs_formLocaleDate + ' ' + 'HH:mm', true).toISOString();
                    }
                } else if (moment(vValue, getFlexibleFormatForDate() + ' ' + 'HH:mm', true).isValid()) {
                    // Code to support after hour like 20:30 or 18:30 even if the user has set to HH:mm which is 08:30 PM plus flexible date like 1/1/2018 which is the same as 01/01/2018
                    if (isClassic() && vMaxLength != '22') {
                        vValue = moment(vValue, getFlexibleFormatForDate() + ' ' + 'HH:mm', true).format(formDateSubmission + ' ' + formTimeSubmission);
                    } else {
                        vValue = moment(vValue, getFlexibleFormatForDate() + ' ' + 'HH:mm', true).toISOString();
                    }
                } else {
                    if (isValidationOff(pInputElement, 'datetime')) {
                        vValue = '';
                    } else {
                        vValue = 'InvalidDateTime[' + vValue + ']';
                    }
                }

                console.log('[getDateOrDateTimeToSubmit] output-vValue[' + vValue + '][DateTime]');
            }
        }

        return vValue;
    }

    // This code is to make the method available for Mocha JS Unit Test.
    // Leave this code as the last code.
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        return {
            isSFNumeric: isSFNumeric,
            getDateOrDateTimeToSubmit: getDateOrDateTimeToSubmit,
            IsValidFormat: IsValidFormat,
            isValidDate: isValidDate,
            isValidDateTime: isValidDateTime,
            isValidationOff: isValidationOff
        }
    }
}));