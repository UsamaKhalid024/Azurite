function deletePaypalAccount(elementSource) {
    var accid = $(elementSource).attr('data-acc-id');

    var elementSourceFieldLi = $(elementSource).parents('.fieldLi');
    var paymentRecordid = $(elementSourceFieldLi).find('.field-div-payment').attr('data-paymentfield-record-id');
    if (accid !== undefined && accid != '' && !isNullOrEmpty(paymentRecordid)) {
        var paymentType = 'OPayPalPayment';
        try {
            paymentType = $(elementSourceFieldLi).attr('data-otype');

        } catch (err) { }
        $(elementSource).parents('.payment-account-item-container').addClass('vff-faded');
        paymentType = getOPaymentTypeVal(paymentType, 'PayPal Pro', 'PayPal Pro', 'IATS', 'Stripe', 'AuthorizeNet');
        remoteIsPaypalAccountInUseJS(elementSourceFieldLi, paymentRecordid, accid, paymentType);
    }
}

function populatePaypalAccountFields(elementSource, resultPAccountObj) {
	
    /*possible fields (non-namespace): AccountType,IsSandbox,Name,Password,paymentAccountId,Signature,UserName*/
    var accountname = resultPAccountObj['Name'];
    var accusername = resultPAccountObj['UserName'];
    var accpassword = resultPAccountObj['Password'];
    var accsignature = resultPAccountObj['Signature'];
	var accCardinalAPIIdentifier = resultPAccountObj['CardinalAPIIdentifier'];
	var accCardinalAPIKey = resultPAccountObj['CardinalAPIKey'];
	var accCardinalMerchantID = resultPAccountObj['CardinalMerchantId'];
	var accCardinalOrgUnitID = resultPAccountObj['CardinalOrgUnitId'];
	var accCardinalProcessorID = resultPAccountObj['CardinalProcessorId'];
    var acctype = resultPAccountObj['AccountType'];
    var issandbox = getSafeBoolean(resultPAccountObj['IsSandbox'], false);
    var parentElemSource = $(elementSource).parents('.payment-item-wrapper');
    $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accountname').val(accountname);
    $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-username').val(accusername);
    $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-password').val(accpassword);
	$(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accCardinalAPIIdentifier').val(accCardinalAPIIdentifier);
	$(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-acccardinalapikey').val(accCardinalAPIKey);
	$(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-acccardinalmerchantid').val(accCardinalMerchantID);
	$(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-acccardinalorgunitid').val(accCardinalOrgUnitID);
	$(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-acccardinalprocessorid').val(accCardinalProcessorID);
    if (acctype == 'PayPal Pro') {
        $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').val(accsignature);
    } else if (acctype == 'IATS') {
        $(parentElemSource).find('.payment-account-element-wrapper').find('select.iats-region').parent().find('div.iats-region').remove();
        $(parentElemSource).find('.payment-account-element-wrapper').find('select.iats-region').val(accsignature);
        $(parentElemSource).find('.payment-account-element-wrapper').find('select.iats-region').select2();
    }
    var paymentPrefix = getOTypeFromPaymentVal(acctype, 'PayPal', 'PayPal', 'iATS', 'Stripe', 'AuthorizeNet');
    // resetPaymentAccountLabels($(parentElemSource).parent().parent(),paymentPrefix.toLowerCase());

    if (issandbox) {
        $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-issandbox').prop('checked', true);
    }
    else {
        $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-issandbox').prop('checked', false);
    }
    if(isCommunityForm == true){
        $(parentElemSource).find('#divCardinalPanel').hide();
    }
    $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().removeClass('f-required');
    $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().hide();
    if (acctype == 'PayPal Pro') {
        $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().show();
        $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().addClass('f-required');
    }


}
function createPaypalAccount(elementSource, accid, isEditAction) {
    var accountType = 'OPayPalPayment';
    try {
        accountType = $(elementSource).parents('.fieldLi').attr('data-otype');
    } catch (err) { }
    /*following methods params
    -payment type:e.g. OPayPalPayment,OiATSPayment etc.
    -defaultval: PayPal Pro, Stripe etc.
    -paypalval:if Paypal then use this
    -iatsval: if IATS use this
    -stripeval: if Stripe use this
    */
    var objPaymentAccountDetailsDTO = Object.create(PaymentAccountDetailsDTO);
    objPaymentAccountDetailsDTO.accountType = getOPaymentTypeVal(accountType, 'PayPal Pro', 'PayPal Pro', 'IATS', 'Stripe', 'AuthorizeNet');
    var parentElemSource = $(elementSource).parents('.payment-item-wrapper');
    $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().removeClass('f-required');
	
    objPaymentAccountDetailsDTO.paymentAccountId = accid;//  $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accountname').val();
    objPaymentAccountDetailsDTO.name = $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accountname').val();
    objPaymentAccountDetailsDTO.userName = $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-username').val();
    objPaymentAccountDetailsDTO.password = $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-password').val();
	objPaymentAccountDetailsDTO.cardinalAPIIdentifier = $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accCardinalAPIIdentifier').val();
    objPaymentAccountDetailsDTO.cardinalAPIKey = $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-acccardinalapikey').val();
    objPaymentAccountDetailsDTO.cardinalMerchantId = $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-acccardinalmerchantid').val();
    objPaymentAccountDetailsDTO.cardinalOrgUnitId = $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-acccardinalorgunitid').val();
    objPaymentAccountDetailsDTO.cardinalProcessorId = $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-acccardinalprocessorid').val();

    objPaymentAccountDetailsDTO.signature = '';// $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').val();
    if (objPaymentAccountDetailsDTO.accountType == 'PayPal Pro') {
        objPaymentAccountDetailsDTO.signature = $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').val();
    } else if (objPaymentAccountDetailsDTO.accountType == 'IATS') {

        objPaymentAccountDetailsDTO.signature = $(parentElemSource).find('.payment-account-element-wrapper').find('select.iats-region').val();
    }
    objPaymentAccountDetailsDTO.isSandbox = false;
    if ($(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-issandbox').is(':checked')) {
        objPaymentAccountDetailsDTO.isSandbox = true;
    }
    if (objPaymentAccountDetailsDTO.accountType == 'PayPal Pro') {
        $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().addClass('f-required');
    }

    var isinputvalid = true;
    var isusernamexist = usernameExists(objPaymentAccountDetailsDTO.userName, parentElemSource);
    $(parentElemSource).find('.payment-account-element-wrapper').find('.pp-field-row.f-required .pp-field-right>input').each(function (indx, inputElement) {
        var noClass = 'no-' + objPaymentAccountDetailsDTO.accountType.toLowerCase();
        noClass = noClass.replace(' ', '');
        if (isNullOrEmpty($(inputElement).val()) && !$(inputElement).parents('.pp-field-row').hasClass(noClass)) {
            isinputvalid = false;
            return false;
        }
    });
    if (isinputvalid && !isusernamexist) {
        $(parentElemSource).find('.error-message').hide();
        var fieldLiElem = $(elementSource).parents('.fieldLi');
        var paymentRecordid = $(fieldLiElem).find('.field-div-payment').attr('data-paymentfield-record-id');
        remoteCreateOrUpdatePayPalAccountJS(fieldLiElem, paymentRecordid, objPaymentAccountDetailsDTO, isEditAction);
        hideNewAccountDiv(elementSource, true);
    }
    else if (isusernamexist) {
        $(parentElemSource).find('.error-message>p').text('Username already exists');
        $(parentElemSource).find('.error-message').show();
        addCollapseIcon(elementSource);
    }
    else {
        $(parentElemSource).find('.error-message>p').text('* required fields');
        $(parentElemSource).find('.error-message').show();
        addCollapseIcon(elementSource);

    }
}

function addCollapseIcon(elementSource) {
    if (!$(elementSource).hasClass('collapse-icon')) {
        $(elementSource).addClass('collapse-icon');
    }

}
function usernameExists(usernamestr, parentElement) {
    var exists = false;
    $(parentElement).parent().find('>div.payment-item-wrapper').not(parentElement).find('.pp-account-name').each(function (indx, inputElement) {
        if ($(inputElement).find('span.pp-username').text().trim().toLowerCase() == usernamestr.toLowerCase()) {
            exists = true;
            return true;
        }
    });
    return exists;
}
function resetPaymentAccountLabels(parentElemSource, paymentTypeL) {
    $(parentElemSource).find('.pp-labelchange').each(function (indx, divElem) {
        var dataLabel = $(divElem).find('>label').attr('data-' + paymentTypeL);
        if (!isNullOrEmpty(dataLabel)) {
            $(divElem).find('>label').html('' + dataLabel);
        }
    });

}
function resetPaymentLabels(elemSourceParent, dataOType) {
    var paymentPrefix = getOPaymentTypeVal(dataOType, 'PAYPAL', 'PayPal', 'iATS', 'Stripe', 'Authorize.Net');
    $(elemSourceParent).find('.payment-options-container .pp-label-change').each(function (indx, elem) {
        var elemHtml = $(elem).html();
        if (!isNullOrEmpty(elemHtml)) {
            elemHtml = elemHtml.replace('Paypal', paymentPrefix);
            $(elem).html(elemHtml);
        }
    });
    if (paymentPrefix == 'iATS') {
        $(elemSourceParent).find('#transactionResultIdDiv > .pp-field-left').attr('data-recurring-payment', 'Save Customer Code To');
    } else if (paymentPrefix == 'Stripe') {        
        $(elemSourceParent).find('#transactionResultIdDiv > .pp-field-left').attr('data-single-payment', 'Save Charge ID To');
        $(elemSourceParent).find('#transactionResultIdDiv > .pp-field-left').attr('data-recurring-payment', 'Save Plan ID To');
    }
}
function expandPaypalAccountDiv(elementSource, isEditAction) {

    var accid = $(elementSource).attr('data-acc-id');

    var parentElemSource = $(elementSource).parents('.payment-item-wrapper');
    var expanded = false;
    if ($(elementSource).hasClass('collapse-icon')) {
        expanded = true;
    }
    $('.edit-pp-account').removeClass('collapse-icon');
    if (expanded) {

        if (accid !== undefined && accid != '') {
            createPaypalAccount(elementSource, accid, isEditAction);
        }
        else {
            console.log('payment accounts object id is null');
        }
    }
    else {
        $('.payment-account-wrap-container').slideUp(500);
        $('.payment-account-wrap-container').find('.payment-account-element-wrapper').html('');
        if (isEditAction) {

            $(elementSource).addClass('collapse-icon');
        }



        $(parentElemSource).find('.payment-account-element-wrapper').html($('.payment-account-temp-box').html());
        var paymentType = $(elementSource).parents('.fieldLi').attr('data-otype');
        var paymentPrefix = getOPaymentTypeVal(paymentType, 'PAYPAL', 'PayPal', 'iATS', 'Stripe', 'AuthorizeNet');
        /*reset labels */
        resetPaymentAccountLabels($(parentElemSource).find('.payment-account-element-wrapper'), paymentPrefix.toLowerCase());

        $(parentElemSource).find('.payment-account-wrap-container').slideDown(500);
        $(parentElemSource).find('.payment-account-wrap-container').find('.error-message').hide();
        if (isEditAction && accid !== undefined && accid != '') {
            remotePopulatePaypalAccountInfoJS(elementSource, accid);
        }
        else {

            if (!isNullOrEmpty(paymentType) && (paymentType != 'OPayPalPayment')) {
                $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().removeClass('f-required');
                $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().hide();
                if (paymentType == 'OiATSPayment') {
                    $(parentElemSource).find('.payment-account-element-wrapper').find('select.iats-region').parent().find('div.iats-region').remove();

                    $(parentElemSource).find('.payment-account-element-wrapper').find('select.iats-region').select2();
                }
            } else {

                $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().show();
                $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-accsignature').parent().parent().addClass('f-required');
            }
            $(parentElemSource).find('.payment-account-element-wrapper').find('input.pp-issandbox').removeAttr('disabled');
            $(parentElemSource).find('.payment-account-element-wrapper').find('label.pp-check-sandbox').removeClass('checkboxdisabled');
        }
    }
}

function hideNewAccountDiv(elementSource, resetInputs) {
    var parentElemSource = $(elementSource).parents('.payment-account-wrap-container');
    $('.edit-pp-account').removeClass('collapse-icon');
    if (resetInputs) {

        $(parentElemSource).find('.payment-account-element-wrapper').find('input').each(function (indx, inputElement) {
            $(inputElement).val('');
        });
        $(parentElemSource).find('.error-message').hide();
    }
    $(parentElemSource).slideUp(500);
}
function radioPPAccountChange(elementSource) {
    var paymentAccountid = '';

    $(elementSource).parents('.payment-accounts-list').find('input.ff-radio-input').removeClass('acc-selected');
    var parentElemSource = $(elementSource).parents('.ExpandDivPayment');
    var paymentFieldRecId = $(parentElemSource).attr('data-paymentfield-record-id');
    if ($(elementSource).prop('checked') == true) {
        $(elementSource).addClass('acc-selected');
        var accidSTR = $(elementSource).attr('id');
        if (accidSTR !== undefined && accidSTR != '') {
            paymentAccountid = accidSTR.replace('ppacccheck-', '');

        }
    }
    if (!isNullOrEmpty(paymentFieldRecId)) {
        remoteSavePaymenfieldInfoJS(paymentFieldRecId, 'Account__c', paymentAccountid)
    }
}
function populatePFieldsMappingTab(elemSourceParent) {
    processPaymentData(elemSourceParent);

}

// remoteGetAvailableFieldsListForPaymentJS('fieldsmappingsection');
function changeCurrencyLabel(currencySymbol, elemSourceTabsContainer) {
    console.log(' change Currency csymbol' + currencySymbol);

    $(elemSourceTabsContainer).find('.pp-form-fields .pp-currency-span').text(currencySymbol);
    $(elemSourceTabsContainer).parents('.fieldLi').find('.field-div-payment .ff-currency').text(currencySymbol);
}
function setPaymentCurrencyLabel(currencySymbol, fieldLi) {
    console.log(' set Currency csymbol' + currencySymbol);
    $(fieldLi).find('.field-div-payment .ff-currency').text(currencySymbol);
    /*$(fieldLi).find('.field-div-payment .ff-currency').each(function(indx,elem){
    $(elem).text(currencySymbol);
    });*/
}
function populatePaymentAmountInfo(paymentFieldObj, elemParentFieldLi) {

    var display_Amount_Charged__c = getPrefixedOrgFieldName(SFOrgPrefix, 'Display_Amount_Charged__c');
    var subtotal_fieldType__c = getPrefixedOrgFieldName(SFOrgPrefix, 'Subtotal_Amount_Field_Type__c');
    var subtotal_static = getPrefixedOrgFieldName(SFOrgPrefix, 'Subtotal_Amount__c');
    var subtotal_dynamic = getPrefixedOrgFieldName(SFOrgPrefix, 'Subtotal_Field_ID__c');
    //var subtotalAmount_fieldType__c=getPrefixedOrgFieldName(SFOrgPrefix,'Subtotal_Amount_Formula2__c');


    var taxes_fieldType__c = getPrefixedOrgFieldName(SFOrgPrefix, 'Taxes_Field_Type__c');
    var taxes_static = getPrefixedOrgFieldName(SFOrgPrefix, 'Taxes_Fixed_Percentage__c');
    var taxes_dynamic = getPrefixedOrgFieldName(SFOrgPrefix, 'Taxes_Field_ID__c');
    //var taxes_fieldType__c=getPrefixedOrgFieldName(SFOrgPrefix,'Taxes_Formula2__c');

    var shipping_fieldType__c = getPrefixedOrgFieldName(SFOrgPrefix, 'Shipping_Field_Type__c');
    var shipping_static = getPrefixedOrgFieldName(SFOrgPrefix, 'Shipping_Fixed_Amount__c');
    var shipping_dynamic = getPrefixedOrgFieldName(SFOrgPrefix, 'Shipping_Field_ID__c');
    //var shipping_fieldType__c=getPrefixedOrgFieldName(SFOrgPrefix,'Shipping_Formula2__c');

    var recurring_fieldType__c = getPrefixedOrgFieldName(SFOrgPrefix, 'Recurring_Payment_Field_Type__c');
    var recurring_static = getPrefixedOrgFieldName(SFOrgPrefix, 'Recurring_Payment_Initial_Fixed_Amount__c');
    var recurring_dynamic = getPrefixedOrgFieldName(SFOrgPrefix, 'Recurring_Payment_Initial_Amt_Field_ID__c');
    //var recurring_fieldType__c=getPrefixedOrgFieldName(SFOrgPrefix,'Recurring_Initial_Amount_Formula2__c');
    var payment_type__c = getPrefixedOrgFieldName(SFOrgPrefix, 'Payment_Type__c');

    /* amount field*/
    var amountData = setSelectedAmountVal(paymentFieldObj[subtotal_fieldType__c], paymentFieldObj[subtotal_static], paymentFieldObj[subtotal_dynamic], '', elemParentFieldLi, 'amount');
    var taxesData = setSelectedAmountVal(paymentFieldObj[taxes_fieldType__c], paymentFieldObj[taxes_static], paymentFieldObj[taxes_dynamic], '', elemParentFieldLi, 'taxes');
    var shippingData = setSelectedAmountVal(paymentFieldObj[shipping_fieldType__c], paymentFieldObj[shipping_static], paymentFieldObj[shipping_dynamic], '', elemParentFieldLi, 'shipping');
    var recurringData = setSelectedAmountVal(paymentFieldObj[recurring_fieldType__c], paymentFieldObj[recurring_static], paymentFieldObj[recurring_dynamic], '', elemParentFieldLi, 'recurringfee');
    var staticValueObjWithRecArr = [];
    if (amountData != null) {
        staticValueObjWithRecArr.push(amountData);
    }
    if (taxesData != null) {
        staticValueObjWithRecArr.push(taxesData);
    }
    if (shippingData != null) {
        staticValueObjWithRecArr.push(shippingData);
    }
    if (recurringData != null) {
        staticValueObjWithRecArr.push(recurringData);
    }
    var paymnettype = 'single';
    paymenttype = paymentFieldObj[payment_type__c];
    if (!isNullOrEmpty(paymenttype)) {
        paymenttype = paymenttype.toLowerCase();
    }
    var displayamount = false;

    if (paymentFieldObj[display_Amount_Charged__c] != null) {
        displayamount = paymentFieldObj[display_Amount_Charged__c]
    }
    calculateSubAndTotalAmount(elemParentFieldLi, paymenttype, staticValueObjWithRecArr, displayamount);

}
function setSelectedAmountVal(fieldtype, staticval, dynamicval, formulaval, elemParentFieldLi, cssPrefix) {
    var jsonDataObj;
    if (!isNullOrEmpty(fieldtype)) {
        switch (fieldtype.toLowerCase()) {
            case 'dynamic':

                jsonDataObj = amountJsonObject(cssPrefix, '', 'dynamic');
                populatePaymentLabelValue(dynamicval, elemParentFieldLi, 'dynamic', cssPrefix);
                break;
            case 'formula':

                jsonDataObj = amountJsonObject(cssPrefix, '', 'formula');
                populatePaymentLabelValue(formulaval, elemParentFieldLi, 'formula', cssPrefix);
                break;
            default:
                if (isNullOrEmpty(staticval)) {
                    staticval = '';
                }
                jsonDataObj = amountJsonObject(cssPrefix, staticval, 'static');
                populatePaymentLabelValue(staticval, elemParentFieldLi, 'static', cssPrefix);

        }
    }
    return jsonDataObj;
}
function populatePaymentLabelValue(elemValue, elemParentFieldLi, sourceType, classSuffix) {
    var paymentAmountElement = $(elemParentFieldLi).find('.field-div-payment .pp-' + classSuffix + ' .PPGeneralFieldDiv .ff-' + classSuffix + '')

    if (sourceType.toLowerCase() == 'dynamic') {
        $(paymentAmountElement).text('0.00');
        $(paymentAmountElement).attr('data-fieldtype', 'dynamic');
    }
    else if (sourceType.toLowerCase() == 'static') {
        $(paymentAmountElement).attr('data-fieldtype', 'static');
        // $(paymentAmountElement).text(formatAmountTo2Decimal(elemValue,'0.00'));
        if (!isNullOrEmpty(elemValue)) {
            console.log(' classSuffix ' + classSuffix);
            $(paymentAmountElement).text(formatAmountTo2Decimal(elemValue, '0.00'));
        }
        else {

            $(paymentAmountElement).text('0');
        }
    }
    else {
        $(paymentAmountElement).attr('data-fieldtype', 'formula');
        $(paymentAmountElement).text('0.00');

    }
}
function setPaymentAmountText(elemValue, elemParentFieldLi, sourceType, classSuffix) {

    var paymentAmountElement = $(elemParentFieldLi).find('.field-div-payment .pp-' + classSuffix + ' .PPGeneralFieldDiv .ff-' + classSuffix + '')

    if (sourceType.toLowerCase() == 'dynamic') {
        $(paymentAmountElement).text('0.00');
        $(paymentAmountElement).attr('data-fieldtype', 'dynamic');

        setUpdatePaymentAmountEvent(true, elemValue, paymentAmountElement, elemParentFieldLi, classSuffix);
    }
    else if (sourceType.toLowerCase() == 'static') {
        $(paymentAmountElement).attr('data-fieldtype', 'static');
        if (!isNullOrEmpty(elemValue)) {
            $(paymentAmountElement).text(formatAmountTo2Decimal(elemValue, '0.00'));
        }
        else {
            $(paymentAmountElement).text('0');
        }

        setUpdatePaymentAmountEvent(false, '', paymentAmountElement, elemParentFieldLi, classSuffix);
    }
    else {
        $(paymentAmountElement).text('0.00');
        $(paymentAmountElement).attr('data-fieldtype', 'formula');
        setUpdatePaymentAmountEvent(false, '', paymentAmountElement, elemParentFieldLi, classSuffix);
    }
}
function refreshPaymentUpdateEvents(onchangeEventsArr) {
    /* clear old payment dynamic fields events which are not in use*/
    var onchangeEventsArrTemp = onchangeEventsArr;
    onchangeEventsArr = [];
    if (onchangeEventsArrTemp != null && onchangeEventsArrTemp.length > 0) {
        var paymentFieldIds = [];
        $('#mainMultiPageWrapper .formFieldUl  .fieldLi[id^="lblliFASTFORMSPAYMENT"]').each(function (indx, elem) {
            var dataOType = $(elem).attr('data-otype');
            if (!isNullOrEmpty(dataOType)) {
                var paymentLiId = liPaymentElementId.replace('lblliFASTFORMS', '');
                var paymentPrefix = getOPaymentTypeVal(dataOType, 'PAYPAL', 'PAYPAL', 'IATS', 'STRIPE', 'AUTHORIZENET');
                if (!isNullOrEmpty(paymentPrefix + paymentLiId)) {
                    paymentFieldIds.push(paymentPrefix + paymentLiId);
                }

            }

        });
        for (aindex = 0; aindex < paymentFieldIds.length; aindex += 1) {
            // if(paymentIdExists('paymentLblId',paymentFieldIds[aindex],onchangeEventsArrTemp)){
            for (var i = 0; i < onchangeEventsArrTemp.length; i++) {
                if (onchangeEventsArrTemp[i]['paymentLblId'] == paymentFieldIds[aindex]) {
                    onchangeEventsArr.push(onchangeEventsArrTemp[i]);
                }
            }
            //}
        }
    }
    return onchangeEventsArr;
}
function setUpdatePaymentAmountEvent(enable, elementId, targetElement, elemParentFieldLi, classSuffix) {

    var targetElementId = $(targetElement).attr('id');
    var paypalLblId = $(elemParentFieldLi).find('.field-div-payment').attr('id');
    paypalLblId = paypalLblId.replace('divLabel', '');
    var onchangeEvents = [];

    $("#mainMultiPageWrapper .formFieldUl  .fieldDiv").find('input[data-payment-num^="PAYPAL"],select[data-payment-num^="PAYPAL"],input[data-payment-num^="IATS"],select[data-payment-num^="IATS"],input[data-payment-num^="STRIPE"],select[data-payment-num^="STRIPE"]').each(function (indx, elementWithEvent) {
        var targeElemArr = [];
        var paymenLblArr = $(elementWithEvent).attr('data-payment-num').split(',');
        var onchangeEventsArr = $(elementWithEvent).attr('onchange').split(';');
        if (onchangeEventsArr != undefined) {
            onchangeEventsArr.filter(Boolean);// remove empty string item from array
            $.each(onchangeEventsArr, function (indx, item) {
                var targetpaypalid = '';
                try {
                    targetpaypalid = item.substring(item.indexOf("'") + 1, item.lastIndexOf("'"));
                }
                catch (err) { }
                if (targetpaypalid !== '') {
                    targeElemArr.push(targetpaypalid);
                }
            });

        }

        for (aindex = 0; aindex < paymenLblArr.length && aindex < targeElemArr.length; aindex += 1) {
            var eventStr = onchangeEventsArr[aindex];

            //var targetAmountElemId= $('#divLabel'+paymenLblArr[aindex]).find('.pp-'+classSuffix+' .ff-'+classSuffix+'').attr('id');
            var elemId = $($(elementWithEvent)).attr("id");

            elemId = getRenderFormFriendlyID(elemId);
            if (paypalLblId == paymenLblArr[aindex] && targetElementId == targeElemArr[aindex]) {
                /// match with current payment event
                console.log(' Match  paypalLblId ' + paypalLblId + ' targetElementId ' + targetElementId);
            }
            else {
                var paymenttargetelemid = targeElemArr[aindex];
                if (paymenttargetelemid !== '') {
                    var ppAttr = $('#' + paymenttargetelemid).attr('data-pp-name');
                    if (!isNullOrEmpty(ppAttr)) {
                        ppAttr = ppAttr.replace('FFPayment', '');
                        ppAttr = ppAttr.replace('PayPal', '');
                        ppAttr = ppAttr.replace('Stripe', '');
                        ppAttr = ppAttr.replace('iATS', '');
                        ppAttr = ppAttr.toLowerCase();
                        if (!paymentElementExists('paymentLblId', paymenLblArr[aindex], 'sourcesuffix', ppAttr, onchangeEvents)) {

                            console.log(' Match  paypalLblId ' + paypalLblId + ' ppAttr ' + ppAttr);
                            console.log('   here ')
                            onchangeEvents.push(createJSONEventObj(paymenLblArr[aindex], elemId, targeElemArr[aindex], ppAttr));
                        }
                    }

                }
            }
        }


    });
    onchangeEvents = refreshPaymentUpdateEvents(onchangeEvents);
    if (enable && !isNullOrEmpty(elementId)) {
        onchangeEvents.push(createJSONEventObj(paypalLblId, elementId, targetElementId, classSuffix));
    }
    $("#mainMultiPageWrapper .formFieldUl  .fieldDiv").find('input[data-payment-num^="PAYPAL"],select[data-payment-num^="PAYPAL"],input[data-payment-num^="IATS"],select[data-payment-num^="IATS"],input[data-payment-num^="STRIPE"],select[data-payment-num^="STRIPE"]').removeAttr("onchange");
    $("#mainMultiPageWrapper .formFieldUl  .fieldDiv").find('input[data-payment-num^="PAYPAL"],select[data-payment-num^="PAYPAL"],input[data-payment-num^="IATS"],select[data-payment-num^="IATS"],input[data-payment-num^="STRIPE"],select[data-payment-num^="STRIPE"]').removeAttr("data-payment-num");

    $.each(onchangeEvents, function (index, jsonElem) {
        var elementid = jsonElem["sourceElemId"];
        // elementid = getFormCanvasFriendlyID(elementid);
        var escapedElemId = elementid.replace(/\./g, "\\.");
        var ppid = jsonElem["paymentLblId"];
        var targetid = jsonElem["targetElemId"];
        if (!isNullOrEmpty(escapedElemId)) {
            var mainElement = $('#mainMultiPageWrapper .formFieldUl  .fieldDiv').find("#" + escapedElemId);
            if ($(mainElement).attr("data-payment-num") !== undefined && $(mainElement).attr("data-payment-num") !== '') {
                var dtAttr = mainElement.attr("data-payment-num");
                dtAttr += "," + ppid;
                onchangeAttr = $(mainElement).attr("onchange");
                onchangeAttr += "UpdatePaymentAmount(this.value,'" + targetid + "');";
                $(mainElement).attr("data-payment-num", dtAttr);
                $(mainElement).attr("onchange", onchangeAttr);
            }
            else {
                $(mainElement).attr("data-payment-num", ppid);
                $(mainElement).attr("onchange", "UpdatePaymentAmount(this.value,'" + targetid + "');");
            }
        }
    });

}
function paymentIdExists(propname, propvalue, objs) {

    for (var i = 0; i < objs.length; i++) {
        if (objs[i][propname] == propvalue) {
            return 1;
        }
    }

    return 0;
}
function paymentElementExists(propname, propvalue, propname2, propvalue2, objs) {

    for (var i = 0; i < objs.length; i++) {
        if (objs[i][propname] == propvalue && objs[i][propname2] == propvalue2) {
            return 1;
        }
    }

    return 0;
}

function createJSONEventObj(paymenlblid, elemid, tragetid, sourceSuffix) {
    var dataobj = { "paymentLblId": paymenlblid, "sourceElemId": elemid, "targetElemId": tragetid, "sourcesuffix": sourceSuffix };


    return dataobj;
}
function setPaymentFormulaEvents(fieldtype, elemSource) {

}
function setPaymentAmountRequired(ispaymentreq, elemParentFieldLi) {

    $(elemParentFieldLi).find('.field-div-payment').attr('data-paymentrequired', ispaymentreq);
    $($(elemParentFieldLi).find('.payment-item-row')).each(function (i, ppitemrow) {
        var isdatarequired = $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv select').attr('data-isrequired');
        $(ppitemrow).find('span.ff-required-mark').remove();
        $(ppitemrow).find('span.requiredSpan').remove();
        if (isdatarequired !== undefined && ispaymentreq) {

            $(ppitemrow).find('.PPGeneralLabelDiv label.ff-label').after('<span class="requiredSpan ff-required-mark"  >*</span>');

            $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv select').attr('data-isrequired', true);
        }
        else {
            $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv select').attr('data-isrequired', false);

        }

    });
}
function setPaymentHidden(isHide, elemParentFieldLi) {

    $(elemParentFieldLi).find('.field-div-payment').attr('data-ishidden', isHide);
    $($(elemParentFieldLi).find('.payment-item-row')).each(function (i, ppitemrow) {
        if (isHide) {

            $(ppitemrow).addClass('grayLabel');
        }
        else {
            $(ppitemrow).removeClass('grayLabel');

        }

    });
}
function setPaymentAmountDisplayFlag(displayamount, elemParentFieldLi) {
    if (displayamount !== undefined && displayamount) {
        $(elemParentFieldLi).find('.field-div-payment .pp-amount').show();
        $(elemParentFieldLi).find('.field-div-payment .pp-shipping').show();
        $(elemParentFieldLi).find('.field-div-payment .pp-taxes').show();
        $(elemParentFieldLi).find('.field-div-payment .ff-line-seperator').parent().show();
        $(elemParentFieldLi).find('.field-div-payment .pp-recurringfee').show();
        $(elemParentFieldLi).find('.field-div-payment .pp-stamount').show();
        $(elemParentFieldLi).find('.field-div-payment .pp-tamount').show();
    }
    else {
        $(elemParentFieldLi).find('.field-div-payment .pp-amount').hide();
        $(elemParentFieldLi).find('.field-div-payment .pp-shipping').hide();
        $(elemParentFieldLi).find('.field-div-payment .pp-taxes').hide();
        $(elemParentFieldLi).find('.field-div-payment .ff-line-seperator').parent().hide();
        $(elemParentFieldLi).find('.field-div-payment .pp-recurringfee').hide();
        $(elemParentFieldLi).find('.field-div-payment .pp-stamount').hide();
        $(elemParentFieldLi).find('.field-div-payment .pp-tamount').hide();
    }
    var selectedPaymenttype = $('input[name=radio-paymenttype]:checked', $(elemParentFieldLi).find('.pp-radiochklist')).val();
    restructurePaymentLabels(elemParentFieldLi, selectedPaymenttype, displayamount);
}
function restructurePaymentLabels(elemParentFieldLi, paymenttype, displayamount) {

    if (!isNullOrEmpty(paymenttype) && paymenttype.toLowerCase() == 'recurring' && displayamount) {
        // $(elemParentFieldLi).find('.field-div-payment .pp-recurringfee').show();
        //$(elemParentFieldLi).find('.field-div-payment .pp-tamount').show();
    }
    else {
        // $(elemParentFieldLi).find('.field-div-payment .pp-recurringfee').hide();
        // $(elemParentFieldLi).find('.field-div-payment .pp-tamount').hide();
    }
}
function amountJsonObject(fieldtype, staticval, valuetype) {
    /*var floatval=parseFloat(staticval);
    if(isNaN(floatval))
    {
      floatval=0;
    }*/
    var dataObj = { "field": fieldtype, "staticValue": staticval, "fieldValueType": valuetype }
    return dataObj;
}
function resetUpdateAmountEvents(parentFieldLiElement) {
    var staticValueObjArr = [];//{"amount":false,"taxes":false,"shipping":false};
    $(parentFieldLiElement).find('.expandable-borders .pp-field-type-div select.pp-sel-fields,.expandable-borders .pp-field-type-div input.pp-textbox').each(function (indx, targetElement) {
        var datatargetsuffix = $(targetElement).attr('data-target-suffix');

        if (!isNullOrEmpty(datatargetsuffix)) {
            var dataToggleClass = $(targetElement).parent().attr('data-toggleclass');
            if (!isNullOrEmpty(dataToggleClass)) {
                dataToggleClass = dataToggleClass.replace("-alink", "");

                var paymentAmountElement = $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-' + datatargetsuffix + '');

                if (dataToggleClass.toLowerCase() == 'dynamic') {
                    var selectedval = $(targetElement).select2('val');

                    if ($(targetElement).parents('.field-type-target').hasClass('display-none')) {
                        setUpdatePaymentAmountEvent(false, '', paymentAmountElement, parentFieldLiElement, datatargetsuffix);
                    }
                    else {
                        $(paymentAmountElement).text('0.00');
                        setUpdatePaymentAmountEvent(true, selectedval, paymentAmountElement, parentFieldLiElement, datatargetsuffix);
                    }
                }
                else if (dataToggleClass.toLowerCase() == 'static') {

                    $(paymentAmountElement).text($(targetElement).val());
                    if (!$(targetElement).parents('.field-type-target').hasClass('display-none')) {
                        //staticValueObj[dataToggleClass.toLowerCase()]=true;
                        // staticValueObjArr.push(amountJsonObject(datatargetsuffix,$(targetElement).val(),'static'));
                    }
                }
                else {
                    $(paymentAmountElement).text('0.00');
                }
            }

        }
    });
    var selectedPaymenttype = $('input[name=radio-paymenttype]:checked', $(parentFieldLiElement).find('.pp-radiochklist')).val();
    var displayamount = $('input[name=chkbxDisplayAmountCharged]:checked', $(parentFieldLiElement).find('.payment-setting-body').find('.pp-form-fields')).val();
    calculateSubAndTotalAmount(parentFieldLiElement, selectedPaymenttype, null, displayamount);

}
/*calculateSubAndTotalAmount starts*/

function calculateSubAndTotalAmount(parentFieldLiElement, paymenttype, staticValueObjWithRecArr, displayamount) {


    if (staticValueObjWithRecArr == null) {
        staticValueObjWithRecArr = [];

        $(parentFieldLiElement).find('.expandable-borders .pp-toggle-links>ul>li.display-none >a').each(function (indx, aElement) {
            var divtoggleclass = $(aElement).attr('data-val') + '-alink';
            var dataSourceToggleElem = $(aElement).attr('data-source-toggle');
            var targetElement;
            if (!isNullOrEmpty(dataSourceToggleElem)) {
                targetElement = $(aElement).parents('.expandable-borders .' + dataSourceToggleElem).find(' div[data-toggleclass="' + divtoggleclass + '"]');
            } else {
                targetElement = $(aElement).parents('.expandable-borders').find(' div[data-toggleclass="' + divtoggleclass + '"]');
            }
            if (divtoggleclass != 'formula-alink') {
                targetElement = $(targetElement).find('input.pp-textbox,select.pp-sel-fields');
            }
            var dataToggleClass = divtoggleclass;//$(targetElement).parent().attr('data-toggleclass');
            var datatargetsuffix = $(targetElement).attr('data-target-suffix');


            if (!isNullOrEmpty(dataToggleClass)) {
                dataToggleClass = dataToggleClass.replace("-alink", "");
                console.log(' dataToggleClass ' + dataToggleClass);
                if (dataToggleClass.toLowerCase() == 'static') {

                    if ((datatargetsuffix == 'recurringfee' || datatargetsuffix == 'recurringplan') && paymenttype == 'recurring') {
                        populatePaymentLabelValue($(targetElement).val(), $(targetElement).parents('.fieldLi'), dataToggleClass, datatargetsuffix);
                        staticValueObjWithRecArr.push(amountJsonObject(datatargetsuffix, $(targetElement).val(), 'static'));
                    }
                    else if ((datatargetsuffix == 'recurringfee' || datatargetsuffix == 'recurringplan') && paymenttype == 'single') {
                        staticValueObjWithRecArr.push(amountJsonObject(datatargetsuffix, '', 'static'));
                    }
                    else {
                        populatePaymentLabelValue($(targetElement).val(), $(targetElement).parents('.fieldLi'), dataToggleClass, datatargetsuffix);
                        staticValueObjWithRecArr.push(amountJsonObject(datatargetsuffix, $(targetElement).val(), 'static'));
                    }
                }
                else if (dataToggleClass.toLowerCase() == 'dynamic') {
                    console.log(' Calculation info dataToggleClass dynamic- ' + dataToggleClass + ' target suffix-' + datatargetsuffix);
                    populatePaymentLabelValue($(targetElement).select2("val"), $(targetElement).parents('.fieldLi'), dataToggleClass, datatargetsuffix);
                    staticValueObjWithRecArr.push(amountJsonObject(datatargetsuffix, '', 'dynamic'));
                }
                else if (dataToggleClass.toLowerCase() == 'formula') {
                    console.log(' Calculation info dataToggleClass- ' + dataToggleClass);
                    populatePaymentLabelValue('', $(targetElement).parents('.fieldLi'), dataToggleClass, datatargetsuffix);
                    staticValueObjWithRecArr.push(amountJsonObject(datatargetsuffix, '', 'formula'));
                }
            }
        });
    }

    if (staticValueObjWithRecArr.length > 0) {
        var amountCharged = 0;
        var recurringAmount = 0;
        var totalAmountCharged = 0;




        var recurringIsStatic = false;
        var amountIsStatic = false;
        var shippingIsStatic = false;
        var taxesIsStatic = false;

        var recurringIsenabled = true;
        var amountIsenabled = true;
        var shippingIsenabled = true;
        var taxesIsenabled = true;



        $.each(staticValueObjWithRecArr, function (index) {
            if (staticValueObjWithRecArr[index]["field"] == 'amount') {
                var staticValue = staticValueObjWithRecArr[index]["staticValue"];
                var fieldtypevalue = staticValueObjWithRecArr[index]["fieldValueType"];
                if (!isNullOrEmpty(staticValue)) {
                    amountIsStatic = true;
                    amountCharged = formatAmountTo2Decimal(staticValue, '0.00');
                }
                else {
                    amountCharged = formatAmountTo2Decimal(0, '0.00');
                    if (!isNullOrEmpty(fieldtypevalue) && fieldtypevalue == 'static') {
                        amountIsenabled = false;
                    }
                }
            }
        });

        $.each(staticValueObjWithRecArr, function (index) {
            if (staticValueObjWithRecArr[index]["field"] == 'taxes') {
                var staticValue = staticValueObjWithRecArr[index]["staticValue"];
                var fieldtypevalue = staticValueObjWithRecArr[index]["fieldValueType"];

                console.log(' tax staticValue  ' + staticValue);
                $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-taxes').attr('data-taxes', staticValue);
                if ($(parentFieldLiElement).find('.field-div-payment  .pp-taxes .PPGeneralLabelDiv .ff-tax-percentage').length < 1) {
                    var newSpan = $('<span/>').addClass('ff-tax-percentage');
                    $(parentFieldLiElement).find('.field-div-payment  .pp-taxes .PPGeneralLabelDiv').append(newSpan);
                }
                if (!isNullOrEmpty(staticValue)) {
                    taxesIsStatic = true;
                    var calculatedtaxWOrec = parseFloat(amountCharged * (parseFloat(staticValue) / 100)).toFixed(2);
                    console.log(' calculatedtaxWOrec ' + calculatedtaxWOrec);
                    amountCharged = parseFloat(parseFloat(amountCharged) + parseFloat(calculatedtaxWOrec));
                    $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-taxes').text(calculatedtaxWOrec);


                    $(parentFieldLiElement).find('.field-div-payment  .pp-taxes .PPGeneralLabelDiv .ff-tax-percentage').text(' (' + staticValue + '%)');
                }
                else {

                    amountCharged = parseFloat(amountCharged);
                    if (!isNullOrEmpty(fieldtypevalue) && fieldtypevalue == 'static') {
                        $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-taxes').text('0');
                        taxesIsenabled = false;

                    }
                    else {
                        $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-taxes').text('0.00');
                    }
                    $(parentFieldLiElement).find('.field-div-payment  .pp-taxes .PPGeneralLabelDiv .ff-tax-percentage').remove();
                }
            }

        });
        $.each(staticValueObjWithRecArr, function (index) {
            if (staticValueObjWithRecArr[index]["field"] == 'shipping') {
                var staticValue = staticValueObjWithRecArr[index]["staticValue"];
                var fieldtypevalue = staticValueObjWithRecArr[index]["fieldValueType"];
                if (!isNullOrEmpty(staticValue)) {
                    shippingIsStatic = true;
                    amountCharged = parseFloat(amountCharged + parseFloat(staticValue));
                    $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-shipping').text(formatAmountTo2Decimal(staticValue, '0.00'));
                }
                else {
                    if (!isNullOrEmpty(fieldtypevalue) && fieldtypevalue == 'static') {
                        $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-shipping').text('0');
                        shippingIsenabled = false;
                    }
                    else {
                        $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-shipping').text('0.00');
                    }

                }
            }

        });


        if (paymenttype != 'single') {
            $.each(staticValueObjWithRecArr, function (index) {
                if (staticValueObjWithRecArr[index]["field"] == 'recurringfee') {
                    var staticValue = staticValueObjWithRecArr[index]["staticValue"];
                    var fieldtypevalue = staticValueObjWithRecArr[index]["fieldValueType"];
                    if (!isNullOrEmpty(staticValue)) {
                        recurringAmount = formatAmountTo2Decimal(staticValue, '0.00');
                        recurringIsStatic = true;
                        totalAmountCharged = parseFloat(parseFloat(amountCharged) + parseFloat(staticValue));
                    }
                    else {
                        recurringAmount = formatAmountTo2Decimal(0, '0.00');
                        if (!isNullOrEmpty(fieldtypevalue) && fieldtypevalue == 'static') {
                            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-recurringfee').text('0');
                            recurringIsenabled = false;
                            recurringAmount = 0;
                        }
                        else {
                            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-recurringfee').text('0.00');
                        }
                    }
                }
            });
        }
        else {
            recurringIsenabled = false;
            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-recurringfee').text('0');
        }
        amountCharged = formatAmountTo2Decimal(amountCharged, '0.00');
        totalAmountCharged = formatAmountTo2Decimal(totalAmountCharged, '0.00');


        var isAmountVariable = false;
        if (amountIsenabled && !amountIsStatic) {
            isAmountVariable = true;
        }
        if (shippingIsenabled && !shippingIsStatic) {
            isAmountVariable = true;
        }
        if (taxesIsenabled && !taxesIsStatic) {
            isAmountVariable = true;
        }
        if (isAmountVariable) {
            amountCharged = formatAmountTo2Decimal('0.0', '0.00');
        }
        if (!taxesIsenabled && !shippingIsenabled) {
            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-amount').attr('data-payhide', true);
            // $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-amount').text('0');
        }
        else {
            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-amount').attr('data-payhide', false);
            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .pp-amount').show();
        }
        if (recurringIsenabled && !recurringIsStatic && isAmountVariable) {
            totalAmountCharged = formatAmountTo2Decimal('0.0', '0.00');
        }
        if (!recurringIsenabled && recurringIsStatic && paymenttype != 'single' && recurringAmount == 0) {
            //totalAmountCharged = formatAmountTo2Decimal('0', '0.00');
        }

        if (paymenttype == 'recurring') {

            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-stamount').text(amountCharged);
            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-tamount').text(totalAmountCharged);

        }
        else {

            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-stamount').text(amountCharged);
            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-recurringfee').text('0');
            $(parentFieldLiElement).find('.field-div-payment   .PPGeneralFieldDiv .ff-tamount').text('0');

        }


    }


    $(parentFieldLiElement).find('.field-div-payment .payment-item-row').each(function (indx, divElement) {
        var elementtext = $(divElement).find('label.ff-input-label').text();
        var valuetype = $(divElement).find('label.ff-input-label').attr('data-payhide');
        if ($(divElement).find('label.ff-input-label').length > 0 && (isNullOrEmpty(elementtext) || elementtext == '0' || valuetype == "true")) {
            $(divElement).hide();
        }


    });

    restructurePaymentLabels(parentFieldLiElement, paymenttype, displayamount);
    var isRecurringNotEnabled = isCSSDisplayNone($(parentFieldLiElement).find('.field-div-payment .payment-item-row.pp-recurringfee'));

    var isAmountNotEnabled = isCSSDisplayNone($(parentFieldLiElement).find('.field-div-payment .payment-item-row.pp-amount'));

    var isTaxesNotEnabled = isCSSDisplayNone($(parentFieldLiElement).find('.field-div-payment .payment-item-row.pp-taxes'));

    var isShippingNotEnabled = isCSSDisplayNone($(parentFieldLiElement).find('.field-div-payment .payment-item-row.pp-shipping'));


    var recurringElement = $(parentFieldLiElement).find('.field-div-payment .payment-item-row.pp-recurringfee');

    if (isAmountNotEnabled && isShippingNotEnabled && isTaxesNotEnabled) {
        $(parentFieldLiElement).find('.field-div-payment .payment-item-row.pp-stamount').prev().hide();
    }

    if (isRecurringNotEnabled) {
        $(recurringElement).next().hide();

        $(parentFieldLiElement).find('.field-div-payment').find('.payment-item-row.pp-tamount').hide();
        // $(parentFieldLiElement).find('.field-div-payment').find('.payment-item-row.pp-tamount').next().hide();
    }
    else {


        $(recurringElement).next().show();
        $(parentFieldLiElement).find('.field-div-payment').find('.payment-item-row.pp-tamount').show();
        //$(parentFieldLiElement).find('.field-div-payment').find('.payment-item-row.pp-tamount').next().show();
    }
    //var selectedPaymenttype = $('input[name=radio-paymenttype]:checked', $(parentFieldLiElement).find('.pp-radiochklist')).val();



}
/*calculateSubAndTotalAmount ends*/
function isCSSDisplayNone(elem) {
    var returnflag = true;
    if (elem !== undefined && $(elem).length > 0 && $(elem).css('display') != 'none') {
        returnflag = false;
    }
    return returnflag;
}
function paymentSetupChange(elemSource) {
    if ($(elemSource).hasClass('pp-type-currency') && !isValueNumericOrEmpty(elemSource)) {

        $(elemSource).focus();
        return;
    }
    else if ($(elemSource).hasClass('el-email') && !isNullOrEmpty($(elemSource)) && !isEmailValid(elemSource)) {
        $(elemSource).focus();
        return;
    }
    else if ($(elemSource).hasClass('el-3digit') && !isValid3Digits(elemSource)) {
        $(elemSource).focus();
        return;
    }

    var parentTabElement = $(elemSource).parents('.payment-option-content').find('.tab-pane.active');
    /* paypal setting body specific elements manipulation starts*/
    if ($(elemSource).parents('.tab-pane').hasClass('payment-setting-body')) {
        if ($(elemSource).hasClass('pp-currency-select')) {

            var currencySymbol = $('option:selected', $(elemSource)).attr('csymbol');
            changeCurrencyLabel(currencySymbol, parentTabElement);
        }
        else if ($(elemSource).attr('data-pp-prop') == 'Is_Payment_Required__c') {
            var ispaymentreq = false;
            if ($(elemSource).is(":checked")) {
                ispaymentreq = true;
            }
            setPaymentAmountRequired(ispaymentreq, $(elemSource).parents('.fieldLi'));
        } else if ($(elemSource).attr('data-pp-prop') == 'Is_Payment_Hidden__c') {
            var ispaymenthidden = false;
            if ($(elemSource).is(":checked")) {
                ispaymenthidden = true;
            }
            setPaymentHidden(ispaymenthidden, $(elemSource).parents('.fieldLi'));
        }

        else if ($(elemSource).attr('data-pp-prop') == 'Subtotal_Base_Amount__c') {
            resetFormulaElem($(elemSource).parents('.expandable-borders'));
        }


        var displayamount = false;
        if ($(parentTabElement).find('input[name=chkbxDisplayAmountCharged]').is(":checked")) {
            displayamount = true;
        }
        setPaymentAmountDisplayFlag(displayamount, $(parentTabElement).parents('.fieldLi'));
        resetUpdateAmountEvents($(elemSource).parents('.fieldLi'));
        var dtformula = $(elemSource).attr("data-pp-formula");
        if (!isNullOrEmpty(dtformula) && dtformula == 'amount') {
            setPaymentFormulaEvents('amount', elemSource);
        }
    }
    /* paypal setting body specific elements manipulation ends*/

    var paymentFieldId = '';

    var elemSourceParent = $(elemSource).parents('.ExpandDivPayment');
    if ($(elemSourceParent).length > 0 && !isNullOrEmpty($(elemSourceParent).attr('data-paymentfield-record-id'))) {
        paymentFieldId = $(elemSourceParent).attr('data-paymentfield-record-id');
    }
    if (!isNullOrEmpty(paymentFieldId)) {
        var paymentFieldRecord = {};
        paymentFieldRecord.Id = paymentFieldId;

        var providerFieldMappingXML = '';
        if ($(elemSource).parents('.tab-pane').hasClass('fields-mapping-body')) {
            /*paypal field mapping tab only starts*/
            $(parentTabElement).find('.pp-field-row').each(function (indx, divElement) {
                var mainprop = $(divElement).find('.pp-form-fields select.pp-sel-fields').attr('data-pp-prop');

                if (mainprop != undefined && mainprop != '') {

                    if (mainprop == 'FieldMapping') {
                        var selectedvalue = $(divElement).find('.pp-form-fields>select').select2('val');
                        var subprop = $(divElement).find('.pp-form-fields>select.pp-sel-fields').attr('data-pp-sub-prop');
                        if (subprop != undefined && subprop != '' && (typeof selectedvalue == 'string' || selectedvalue instanceof String)) {
                            providerFieldMappingXML += '<providerFieldMapping>';
                            providerFieldMappingXML += '<providerFieldName>' + subprop + '</providerFieldName>';
                            providerFieldMappingXML += '<formFieldId>' + selectedvalue + '</formFieldId>';
                            providerFieldMappingXML += '<fixedValue></fixedValue>';
                            providerFieldMappingXML += '</providerFieldMapping>';
                        }
                    }
                    else if (mainprop == 'FieldMappingAdvanced') {
                        var selectedVal = '';
                        var isDynamic = false;
                        var firstElem = $(divElement).find('.pp-form-fields .pp-field-type-div:not(.display-none) select.pp-sel-fields,.pp-form-fields .pp-field-type-div:not(.display-none) input.ff-input-text');
                        if ($(firstElem).length > 0 && $(firstElem)[0].type == 'select-one') {
                            selectedVal = $(firstElem).select2('val');
                            isDynamic = true;
                        }
                        else {
                            selectedVal = $(firstElem).val();
                            isDynamic = false;
                        }
                        var subprop = $(divElement).find('.pp-form-fields select.pp-sel-fields').attr('data-pp-sub-prop');
                        if (subprop != undefined && subprop != '' && (typeof selectedVal == 'string' || selectedVal instanceof String)) {
                            providerFieldMappingXML += '<providerFieldMapping>';
                            providerFieldMappingXML += '<providerFieldName>' + subprop + '</providerFieldName>';
                            if (isDynamic) {
                                providerFieldMappingXML += '<formFieldId>' + selectedVal + '</formFieldId>';
                                providerFieldMappingXML += '<fixedValue></fixedValue>';
                            }
                            else {
                                providerFieldMappingXML += '<formFieldId></formFieldId>';
                                providerFieldMappingXML += '<fixedValue>' + selectedVal + '</fixedValue>';
                            }

                            providerFieldMappingXML += '</providerFieldMapping>';
                        }
                    }

                }

            });
            if (providerFieldMappingXML != null && providerFieldMappingXML != '') {
                paymentFieldRecord['Provider_Field_Mapping_XML__c'] = '' + providerFieldMappingXML + '';
            }

        }  /*paypal field mapping tab only ends*/
        if ($(elemSource).parents('.tab-pane').hasClass('payment-setting-body')) {
            /*paypal setting tab only*/
            var amountMappingData = getAmountMappingData(elemSource, paymentFieldId);
            if (amountMappingData != null) {

                paymentFieldRecord['Subtotal_Amount_Mapping_XML__c'] = amountMappingData;
            }


            var updateElemValue = true;
            $(parentTabElement).find('.pp-field-row .pp-form-fields input.pp-textbox,.pp-field-row .pp-form-fields select.pp-sel-fields,.pp-field-row .pp-form-fields select.pp-currency-select, .pp-field-row .pp-form-fields input.pp-checkbox,.pp-formula-block-.step-1  .pp-textbox, .expandable-borders .content-editor-textarea,.expandable-borders .pp-block-a.display-none .change-trigger,.pp-formula-block-outer .pp-radiochklist input[name="radio-sub-total-amount-formula"],.pp-recurring-row .pp-form-fields input[name="radio-paymenttype"],.pp-recurring-row .pp-form-fields input.pp-textbox,.pp-recurring-row .pp-form-fields select.select-elem,.pp-recurring-row .pp-form-fields input.pp-checkbox').each(function (indx, targetElement) {
                updateElemValue = true;
                var mainprop = $(targetElement).attr('data-pp-prop');
                var selectedvalue = '';
                if (mainprop != undefined && mainprop != '' && mainprop != 'FieldMapping' && mainprop != 'FieldMappingAdvanced' && mainprop != 'subtotalAmountMapping') {
                    if (targetElement.type == 'checkbox') {
                        if ($(targetElement).is(":checked")) {
                            selectedvalue = true;
                        }
                        else {
                            selectedvalue = false;
                        }
                    }
                    else if (targetElement.type == 'select-one' || targetElement.type == 'select-multiple') {
                        selectedvalue = $(targetElement).select2('val');
                    }
                    else if (targetElement.type == 'textarea') {
                        if (!$(targetElement).parents('.pp-formula-block-outer').hasClass('display-none')) {

                            selectedvalue = $(targetElement).val();
                            console.log('textarea value ' + selectedvalue);
                        }
                    }
                    else if (targetElement.type == 'radio') {

                        updateElemValue = false;
                        var valueSelected = $(targetElement).val();

                        if ($(targetElement).is(':checked')) {
                            console.log(" Radio type elements updated-" + valueSelected);
                            paymentFieldRecord[mainprop] = valueSelected;
                        }

                    }
                    else {
                        console.log(" Element type---" + targetElement.type);
                        if ($(targetElement).hasClass('change-trigger')) {

                            selectedvalue = $(targetElement).attr('data-val');
                        }
                        else {

                            selectedvalue = $(targetElement).val();
                            console.log(' mainprop ' + mainprop + ' slected value - ' + selectedvalue);
                        }
                    }

                    if (updateElemValue) {
                        paymentFieldRecord[mainprop] = selectedvalue;
                    }
                }

            });
        }
        if ($(elemSource).parents('.tab-pane').hasClass('email-confirmation-body')) {
            if ($(elemSource).attr('data-email') != undefined) {
                setEmailStructureField(elemSource);
            }

            /* EMail Confirmation tab*/
            $(elemSource).parents('.accordion-wrapper').find('.email-content-box div.email-template-box textarea,.email-content-box input.el-text-box, .email-to-fields select.pp-email-fields,.email-to-fields input.el-text-box ,.email-to-fields textarea.el-struc-email').each(function (indx, targetElement) {
                var mainprop = $(targetElement).attr('data-pp-email');
                var selectedvalue = '';
                if (mainprop != undefined && mainprop != '') {
                    var processData = true;
                    if (targetElement.type == 'select-one' || targetElement.type == 'select-multiple') {
                        selectedvalue = $(targetElement).select2('val');
                    }
                    else if (targetElement.type == 'text') {
                        selectedvalue = escapeXML($(targetElement).val());
                    }
                    else if (targetElement.type == 'textarea' && $(targetElement).hasClass("el-struc-email")) {
                        selectedvalue = $(targetElement).val();
                    } else if (targetElement.type == 'textarea' && $(targetElement).hasClass("el-struc-email") == false) {
                        var textareaId = $(targetElement).attr('id');
                        selectedvalue = brTagSafe(CKEDITOR.instances[textareaId].getData());
                    }
                    else {
                        processData = false;
                    }
                    if (processData) {
                        paymentFieldRecord[mainprop] = selectedvalue;
                    }

                }
            });
        }
        if (paymentFieldRecord != null && Object.keys(paymentFieldRecord).length !== 0) {
            console.log(' Update payment field is triggered');
            remoteUpdatePaymenfieldInfoJS(paymentFieldRecord);
            draftchanges(false);
        }
        else {
            console.log(' Update payment field is not triggered');
        }
    }
    else {
        console.log(' Update payment field is not triggered. Payment field record is not defined');
    }

}


function populatePaypalTabInfo(jsonFieldsData, parentTabelemSource) {

    var fieldMappingData = [];
    var fetchFieldmapping = false;

    var jsonObject = jsonFieldsData.ResultSObject;
    if (isNotNullOrUndefined(jsonObject)) {
        var fieldmapPrefixed = getPrefixedOrgFieldName(SFOrgPrefix, 'Provider_Field_Mapping_XML__c');
        var amountmapPrefixed = getPrefixedOrgFieldName(SFOrgPrefix, 'Subtotal_Amount_Mapping_XML__c');
        for (var itemkey in jsonObject) {
            if (jsonObject.hasOwnProperty(itemkey)) {
                ;
                if (itemkey == fieldmapPrefixed) {


                    fieldMappingData.push({ 'providerFieldMapping': jsonFieldMappingObject(jsonObject[fieldmapPrefixed]) });

                }
                else if (itemkey == amountmapPrefixed) {

                    fieldMappingData.push({ 'subtotalAmountMapping': getSubTotalMappingJSON(jsonObject[amountmapPrefixed]) });
                }
                else {
                    //var itemkeyPrefixed=getPrefixedOrgFieldName(SFOrgPrefix,itemkey);
                    var propObj = {};
                    propObj[itemkey] = jsonObject[itemkey];
                    fieldMappingData.push(propObj);

                }
            }
        }
    }


    if ($(parentTabelemSource).find('.tab-pane.active').hasClass('email-confirmation-body')) {
        /*populate email confirmation columns only*/

        $(parentTabelemSource).find('.tab-pane.active .email-content-box textarea,.tab-pane.active  .email-content-box input.el-text-box,.tab-pane.active .email-to-fields select.pp-email-fields,.tab-pane.active .email-to-fields input.el-text-box,.email-to-fields textarea.el-struc-email,.confirmation-enabled-box-inner div.el-enabled-email').each(function (index, targetElement) {
            var mainprop = $(targetElement).attr('data-pp-email');
            var itemProp = '';
            mainprop = getPrefixedOrgFieldName(SFOrgPrefix, mainprop);
            if (mainprop != undefined && mainprop != '') {
                itemProp = getMatchedField(fieldMappingData, mainprop, '');
                if (itemProp != null && itemProp[mainprop] != undefined) {
                    if (targetElement.type == 'select-one' || targetElement.type == 'select-multiple') {
                        $(targetElement).select2('val', itemProp[mainprop]);

                    }
                    else if (targetElement.type == 'text') {
                        $(targetElement).val(unescapeXML(itemProp[mainprop]));
                    }
                    else if (targetElement.type == 'textarea') {
                        $(targetElement).val(itemProp[mainprop]);

                    }
                    else {
                        $(targetElement).html(itemProp[mainprop]);
                    }
                }
            }

            mainprop = $(targetElement).attr('data-email');


            if (mainprop != undefined && mainprop != '') {

                if ($(targetElement).parents('.email-success')[0] != undefined) {
                    itemProp = getMatchedField(fieldMappingData, getPrefixedOrgFieldName(SFOrgPrefix, 'Success_Email__c'), '');

                } else if ($(targetElement).parents('.email-failure')[0] != undefined) {
                    itemProp = getMatchedField(fieldMappingData, getPrefixedOrgFieldName(SFOrgPrefix, 'Failure_Email__c'), '');
                } else if ($(targetElement).parents('.email-notification')[0] != undefined) {
                    itemProp = getMatchedField(fieldMappingData, getPrefixedOrgFieldName(SFOrgPrefix, 'Notification_Email__c'), '');
                }

                if ((itemProp[Object.keys(itemProp)[0]] != '' && itemProp[Object.keys(itemProp)[0]] != undefined)) {
                    var jsonData = JSON.parse(itemProp[Object.keys(itemProp)[0]]);
                    var fieldvalue = jsonData[mainprop];

                    if (fieldvalue != null) {
                        if (targetElement.type == 'text') {
                            $(targetElement).val(unescapeXML(fieldvalue));
                        } else if ($(targetElement).attr('data-email') == 'email_enabled') {
                            if (fieldvalue == true) { setPaymentconfirmationEmailDisplay(true, targetElement) }
                            else {
                                setPaymentconfirmationEmailDisplay(false, targetElement)
                            }
                        }

                    }
                }
            }
        });
    }
    else {

        $(parentTabelemSource).find('.tab-pane.active .field-type-target').each(function (indx, targetElement) {

            if (!$(targetElement).hasClass('display-none')) {

                $(targetElement).addClass('display-none');
            }
        });
        $(parentTabelemSource).find('.tab-pane.active .fields-mapping-advanced-options .pp-field-type-div').each(function (indx, targetElement) {

            if (!$(targetElement).hasClass('display-none') && !$(targetElement).hasClass('pp-def-show')) {

                $(targetElement).addClass('display-none');
                var datatoggleclass = $(targetElement).attr('data-toggleclass');
                $(targetElement).parents('.pp-form-fields').find('.pp-toggle-links li').each(function (indx, liElement) {
                    if (!$(liElement).hasClass('display-none')) {
                        $(liElement).addClass('display-none');
                    }
                });
                $(targetElement).parents('.pp-form-fields').find('.' + datatoggleclass).removeClass('display-none');
            }
        });


        var showCustomAmountFormula = false;
        var populateAmountXml = false;
        $(parentTabelemSource).find('.tab-pane.active .pp-field-row .pp-form-fields input.pp-textbox,.tab-pane.active .pp-field-row .pp-form-fields select.pp-sel-fields,.tab-pane.active .pp-field-row .pp-form-fields select.pp-currency-select,.tab-pane.active  .pp-field-row .pp-form-fields input.pp-checkbox,.tab-pane.active .pp-formula-block-.step-1  input.pp-textbox,.tab-pane.active .expandable-borders .content-editor-textarea,.tab-pane.active .pp-block-a .change-trigger,.tab-pane.active .pp-recurring-row .pp-form-fields input[name="radio-paymenttype"],  .tab-pane.active .pp-formula-block-outer .pp-radiochklist input[name="radio-sub-total-amount-formula"] ,.tab-pane.active .pp-recurring-row .pp-form-fields input.pp-textbox,.tab-pane.active .pp-recurring-row .pp-form-fields select.select-elem,.tab-pane.active  .pp-recurring-row .pp-form-fields input.pp-checkbox').each(function (indx, targetElement) {
            var mainprop = $(targetElement).attr('data-pp-prop');
            mainprop = getPrefixedOrgFieldName(SFOrgPrefix, mainprop);
            if (mainprop != undefined && mainprop != '') {
                if (mainprop == 'FieldMapping' || mainprop == 'FieldMappingAdvanced') {
                    var subprop = $(targetElement).attr('data-pp-sub-prop');
                    if (subprop != undefined && subprop != '') {
                        var subItemProp = getMatchedField(fieldMappingData, 'providerFieldMapping', subprop);
                        if (subItemProp != null) {
                            var selVal = subItemProp['formFieldId'];
                            if (mainprop == 'FieldMapping') {
                                $(targetElement).select2('val', selVal);
                            }
                            else {
                                var elemType = $(targetElement).attr('data-pp-elem-prop');
                                var selectedVal = subItemProp[elemType];

                                if (!isNullOrEmpty(elemType) && elemType == 'fixedValue' && selectedVal != '') {
                                    $(targetElement).val(selectedVal);
                                    var divtoggleclass = $(targetElement).parent().attr('data-toggleclass');
                                    var parentRowElement = $(targetElement).parents('.pp-form-fields');
                                    var fieldTargetA = $(parentRowElement).find('.pp-block-a.' + divtoggleclass + ' a.toggle-field-behaviour');
                                    togglePPFieldBlock(fieldTargetA, 'static', false);
                                }
                                else if (!isNullOrEmpty(elemType) && selectedVal != '') {
                                    $(targetElement).select2('val', selectedVal);
                                    var divtoggleclass = $(targetElement).parent().attr('data-toggleclass');
                                    var parentRowElement = $(targetElement).parents('.pp-form-fields');
                                    var fieldTargetA = $(parentRowElement).find('.pp-block-a.' + divtoggleclass + ' a.toggle-field-behaviour');
                                    togglePPFieldBlock(fieldTargetA, 'dynamic', false);
                                }
                                else {

                                }
                            }
                        }
                    }
                }
                else if (mainprop == 'subtotalAmountMapping' || mainprop == 'Subtotal_Amount_Formula2__c') {
                    console.log(' Subtoal amount fieldmapping');
                    var itemProp = getMatchedField(fieldMappingData, mainprop, '');
                    if (itemProp != null && itemProp[mainprop] != undefined) {
                        if (mainprop == 'Subtotal_Amount_Formula2__c') {
                            showCustomAmountFormula = true;
                            $(targetElement).val(itemProp[mainprop]);
                        }

                    }
                }
                else {

                    var itemProp = getMatchedField(fieldMappingData, mainprop, '');

                    if (itemProp != null && itemProp[mainprop] != undefined) {
                        var targetParentExpandableElem = $(targetElement).parents('.expandable-borders');

                        if (targetElement.type == 'checkbox') {
                            if (itemProp[mainprop] || itemProp[mainprop] == 'true') {
                                $(targetElement).prop("checked", true);
                            }
                            else {
                                $(targetElement).prop("checked", false);
                            }
                        }
                        else if (targetElement.type == 'select-one' || targetElement.type == 'select-multiple') {
                            $(targetElement).select2('val', itemProp[mainprop]);

                        }
                        else if (targetElement.type == 'radio') {
                            console.log('radio elements ');
                            var radioValue = $(targetElement).val();
                            var dbValue = itemProp[mainprop] + '';
                            if (!isNullOrEmpty(radioValue) && dbValue.toLowerCase() == radioValue.toLowerCase()) {
                                $(targetElement).prop("checked", true);
                                if (radioValue.toLowerCase() == 'recurring' || radioValue.toLowerCase() == 'single') {
                                    radioRecurringChange(targetElement, false);
                                }
                                if (radioValue.toLowerCase() == 'default' || radioValue.toLowerCase() == 'custom') {
                                    radioFormulaElemChange(targetElement, false);
                                }
                            }
                            else {
                                $(targetElement).prop("checked", false);
                            }

                        }
                        else {
                            console.log(" Element type loading---" + targetElement.type);
                            if ($(targetElement).hasClass('change-trigger') && itemProp[mainprop].toLowerCase() == $(targetElement).attr('data-val').toLowerCase()) {

                                var divtoggleclass = $(targetElement).attr('data-val') + '-alink';
                                var dataSourceToggleElem = $(targetElement).attr('data-source-toggle');
                                var fieldTargetDiv;
                                if (!isNullOrEmpty(dataSourceToggleElem)) {
                                    fieldTargetDiv = $(targetElement).parents('.expandable-borders .' + dataSourceToggleElem).find(' div[data-toggleclass="' + divtoggleclass + '"]');
                                } else {
                                    fieldTargetDiv = $(targetElement).parents('.expandable-borders').find(' div[data-toggleclass="' + divtoggleclass + '"]');
                                }
                                //var fieldTargetDiv = $(targetElement).parents('.expandable-borders').find(' div[data-toggleclass="' + divtoggleclass + '"]')
                                $(targetParentExpandableElem).find('.field-type-target').not(fieldTargetDiv).each(function (indx, elem) {

                                    if (!$(elem).hasClass('display-none')) {

                                        $(elem).addClass('display-none');
                                    }
                                });
                                $(fieldTargetDiv).removeClass('display-none');
                                var togglesclass = $(fieldTargetDiv).attr('data-toggleclass');

                                $(targetParentExpandableElem).find('.pp-block-a').removeClass('display-none');
                                $(targetParentExpandableElem).find('.' + togglesclass).addClass('display-none');
                                if (mainprop == getPrefixedOrgFieldName(SFOrgPrefix, 'Subtotal_Amount_Field_Type__c') && itemProp[mainprop].toLowerCase() == 'formula') {
                                    populateAmountXml = true;
                                    /*toggle amount formula*/
                                    togglePPFieldBlock(targetElement, 'formula', false);
                                }
                                else if (mainprop == getPrefixedOrgFieldName(SFOrgPrefix, 'Shipping_Field_Type__c') && itemProp[mainprop].toLowerCase() == 'formula') {
                                    /*toggle shipping formula*/
                                    togglePPFieldBlock(targetElement, 'formula', false);
                                }
                                else if (mainprop == getPrefixedOrgFieldName(SFOrgPrefix, 'Taxes_Field_Type__c') && itemProp[mainprop].toLowerCase() == 'formula') {
                                    /*toggle taxes formula*/
                                    togglePPFieldBlock(targetElement, 'formula', false);
                                }
                                else if (mainprop == getPrefixedOrgFieldName(SFOrgPrefix, 'Recurring_Payment_Field_Type__c') && itemProp[mainprop].toLowerCase() == 'formula') {
                                    /*toggle recurring amount formula*/
                                    togglePPFieldBlock(targetElement, 'formula', false);
                                }
                                else if (mainprop == getPrefixedOrgFieldName(SFOrgPrefix, 'Recurring_Plan_Name_Type__c') && itemProp[mainprop].toLowerCase() == 'formula') {
                                    /*toggle recurring amount formula*/
                                    togglePPFieldBlock(targetElement, 'formula', false);
                                }

                            }
                            else if ($(targetElement).hasClass('change-trigger') && itemProp[mainprop].toLowerCase() == 'advancedfieldmapping') {

                            }
                            else {
                                console.log(' prop value------- ' + itemProp[mainprop]);
                                $(targetElement).val(itemProp[mainprop]);
                            }
                        }
                    }
                }
            }

        });
        $(parentTabelemSource).find('.tab-pane.active .fields-mapping-advanced-options .pp-form-fields').each(function (indx, fieldDivElem) {
            var hiddenClassCount = 0;
            var actualCount = $(fieldDivElem).find('.pp-field-type-div').length;
            $(fieldDivElem).find('.pp-field-type-div').each(function (indx, targetElement) {
                if ($(targetElement).hasClass('display-none')) {
                    hiddenClassCount++;
                }
            });
            if (actualCount == hiddenClassCount) {
                /*if all divs are hidden then show dynamic one*/
                var targetElem = $(fieldDivElem).find('.pp-dynamic-block');
                $(targetElem).removeClass('display-none');
                var datatoggleclass = $(targetElem).attr('data-toggleclass');
                $(targetElem).parents('.pp-form-fields').find('.pp-toggle-links li').each(function (indx, liElement) {
                    if (!$(liElement).hasClass('display-none')) {
                        $(liElement).addClass('display-none');
                    }
                });
                $(targetElem).parents('.pp-form-fields').find('.' + datatoggleclass).removeClass('display-none');
            }

        });
        if ($(parentTabelemSource).find('.tab-pane.active').attr('id') == "paymentsettingsection" && populateAmountXml) {
            populateAmountMapping(fieldMappingData, $(parentTabelemSource).find('.tab-pane.active'), showCustomAmountFormula);
        }
    }
}

function toggleEmailBody(elemSource, isAutoSave) {
    var toggleclass = $(elemSource).attr('data-toggleclass');
    var expand = false;
    if ($(elemSource).parents('.accordion-wrapper').find('.email-to-fields-wrapper').hasClass('collapse')) {
        expand = true;
    }
    $(elemSource).parents('.email-accordion').find('.email-to-fields-wrapper').addClass("collapse", 500, "easeInQuart");
    $(elemSource).parents('.email-accordion').find('.accordion-header').removeClass('pp-expanded');
    if (!isNullOrEmpty(toggleclass) && expand) {
        $(elemSource).parents('.email-accordion').find('.' + toggleclass).removeClass("collapse", 500, "easeInQuart");
        $(elemSource).parent().addClass('pp-expanded');
        resetEmailBodyHTML($(elemSource).parents('.accordion-wrapper').find('.email-to-fields-wrapper .email-template-box textarea'));
    }
    if (isAutoSave && !expand) {
        paymentSetupChange(elemSource);
    }
}
function resetEmailBodyHTML(elemTextArea) {

    setContentInEmailEditor($(elemTextArea).attr('id'), $(elemTextArea).val());
}
function setEmailBodyToolbar(elemSourceParent) {
    remoteGetAlertTemplatesListJS(elemSourceParent);
    initializeCKEDITORForEmailContent(elemSourceParent);
    /* var parentEMailBox = $(elemSourceParent).find('.email-template-box textarea').parent();
     var textareaElements = $(parentEMailBox).find('textarea');
     var selectItems = [];
 
 
 
 
     try {
         $(textareaElements).each(function (indx, editElem) {
             CKEDITOR.plugins.addExternal('fftoken', FFCKEditorurlroot + '/plugins/fftoken/', 'plugin.js');
             CKEDITOR.replace($(editElem).attr('id'), {
                 extraPlugins: 'fftoken',
                 availableTokens: selectItems,
                 customConfig: FFCKEditorurlroot + '/config.js'
 
             });
             CKEDITOR.instances[$(editElem).attr('id')].on('blur', function () {
                 var selectedvalue = brTagSafe(this.getData());
                 $(editElem).val(selectedvalue);
                 paymentSetupChange(editElem);
             });
         });
 
     }
     catch (err) {
         console.log(' CKEditor toolbar error: ' + err.message);
     }*/
    var selecthtml = '';
    if (availableFieldsListForPayment != null) {
        selecthtml = generatePaymentSelectHtmlFromData(availableFieldsListForPayment, false);
        var selectElement = $(elemSourceParent).find('.tab-pane.active select.pp-email-fields');
        $(selectElement).select2('destroy');
        $(selectElement).parent().find('div.select-elem').remove();
        restructurePaymentSelectElement($(selectElement), selecthtml);

    }


}
function insertFieldToEditor(elem, isAutoSave) {
    /*insert selected option from fieldlist  to html editor*/
    var parentElemnt = $(elem).parents('.email-template-box');
    var textareaElem = $(parentElemnt).find('textarea');
    var selectedVal = $(parentElemnt).find('.select-elem').select2('val');
    if (!isNullOrEmpty(selectedVal)) {

        selectedVal = '[[' + selectedVal + ']]';


    }
    if (selectedVal != undefined && selectedVal != '') {

        if (selectedVal == '[[-FFEmbedLink-|localhost|Embed Link]]') {
            promptWebsiteLink($(textareaElem).attr('id'), 'embed');
        } else if (selectedVal == '[[-FormstackLink-|Formstack Link]]') {
            promptWebsiteLink($(textareaElem).attr('id'), 'hosted');
        }
        else {
            insertContentInEmailEditor($(textareaElem).attr('id'), selectedVal);
        }

    }
    if (isAutoSave) {
        paymentSetupChange(elem);
    }
}
var focusElement; //keep the element at which the caret was lastly
var selectionRange;//for IE7&8
function insertContentInEmailEditor(elemSourceId, html) {

    var editor = CKEDITOR.instances[elemSourceId];
    editor.insertHtml(html);

}
function setContentInEmailEditor(elemSourceId, html) {
    var editor = CKEDITOR.instances[elemSourceId];
    editor.setData(html);
}
function promptEmbedWebsiteLink(elemSourceId, linkType, fieldhtml) {



    if (linkType == 'embed') {
        var dialogBody = "<div class='dialogHeader'></div><div class='dialogFont'><div class='primary'></div><div class='secondary'>Please provide your link details below:<br /><br /><div class='form-block'><div class='dialog-row-group pb20'><div class='form-col-1' style='line-height:30px;'>Link text:</div><div class='form-col-2'><input class='dialogTextbox' style='margin-left:20px;' id='dialogWebsiteLinkTitle' type='text'></div></div><div class='dialog-row-group pb20'><div class='form-col-1' style='line-height:30px;'>Your page URL: <span></span></div><div class='form-col-2'><input class='dialogTextbox' style='margin-left:20px;' id='dialogWebsiteLink' type='text' value='https://formstack.io/'></div></div></div></div></div>";
    } else {
        var dialogBody = "<div class='dialogHeader'></div><div class='dialogFont'><div class='primary'></div><div class='secondary'>Please provide your link details below:<br /><br /><div class='form-block'><div class='dialog-row-group pb20'><div class='form-col-1' style='line-height:30px;'>Link text:</div><div class='form-col-2'><input class='dialogTextbox' style='margin-left:20px;' id='dialogWebsiteLinkTitle' type='text'></div></div></div></div></div>";
    }
    $("#dialog-confirm").html(dialogBody);

    // Define the Dialog and its properties.
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: "Save",
        height: "auto",
        width: 435,
        buttons: {
            "Yes": {
                click: function () {
                    $(this).dialog('close');
                    var websitelinkTitle = $('#dialogWebsiteLinkTitle').val();
                    if (!isNullOrEmpty(websitelinkTitle)) {
                        fieldhtml = fieldhtml.substring(0, fieldhtml.lastIndexOf('|'));
                        fieldhtml = fieldhtml + '|' + websitelinkTitle + ']]';
                    }
                    if (linkType == 'embed') {
                        var websitelink = $('#dialogWebsiteLink').val();
                        try {
                            if (!isNullOrEmpty(websitelink)) {
                                fieldhtml = fieldhtml.replace('|localhost|', '|' + websitelink + '|');
                            }

                        }
                        catch (err) {

                        }
                    }
                    insertContentInEmailEditor(elemSourceId, fieldhtml);
                },
                text: 'Add Link',
                'class': 'vabutton1'
            },
            "No": {
                click: function () {
                    $(this).dialog('close');

                },
                text: 'Cancel',
                'class': 'vabutton2'
            }


        },
        open: function (event, ui) {
            $('.ui-dialog :button').blur();
        }
    });



}
function populateAmountMapping(mappedData, parentElement, showCustom) {
    var subtotalAmountData = getMatchedField(mappedData, 'subtotalAmountMapping', '');
    var addRowElement;
    var showExpandedAmount = false;
    clearAllOptionsRowsAndFields(parentElement);
    if (subtotalAmountData["subtotalAmountMapping"] != null) {
        $.each(subtotalAmountData["subtotalAmountMapping"], function (index, jsonObject) {

            if (!isNullOrEmpty(jsonObject['fieldId'])) {
                showExpandedAmount = true;
                var selectElement;
                if (index == 0) {


                    addRowElement = $(parentElement).find('.pp-formula-fields .pp-options-fields .pp-options-fields-row').last().find('.pp-option-add');
                }
                else {
                    if (addRowElement !== undefined) {
                        addFieldOptionRowHTML(addRowElement, false);
                    }
                }
                var lastRow = $(parentElement).find('.pp-formula-fields .pp-options-fields .pp-options-fields-row').last();
                selectElement = $(lastRow).find('.pp-options-fields-col-1>select');
                $(selectElement).select2("val", jsonObject['fieldId']);
                availableFieldOptionChange(selectElement, false);

                $.each(jsonObject['option'], function (optionindex, optionObject) {
                    var valuestr = optionObject['optionValue'];
                    var amountstr = optionObject['optionAmount'];
                    if(!isNullOrEmpty(valuestr)){
                        valuestr=valuestr.replace(/\"/g, '\\"');
                        var inputelement = $(lastRow).find('input.ff-type-text[data-optionname="' + valuestr + '"]');
                        if (isNotNullOrUndefined(inputelement)) {
                            $(inputelement).val(amountstr);
                        }
                    }
                });

            }
        });

        var formulaLink = $(parentElement).find('.payment-amount-block .payment-amount-block-inner').find('.pp-block-a.formula-alink');
        togglePPFieldBlock(formulaLink, 'formula', false);
        // var radiodefaultFormulaElem=$(parentElement).find('.payment-amount-block').find('#radioffppsubtotalamountdefault');

        // $(radiodefaultFormulaElem)[0].checked = true;





    }


}

function clearAllOptionsRowsAndFields(parentElement) {

    if ($(parentElement).find('.pp-formula-block-.step-2 .pp-options-fields .pp-options-fields-row').length > 1) {
        $(parentElement).find('.pp-formula-block-.step-2 .pp-options-fields .pp-options-fields-row').not(":eq(0)").remove();
    }
    $(parentElement).find('.pp-formula-block-.step-2 .pp-options-fields-info').remove();
}
function getMatchedField(fieldMappingData, propname, subpropname) {
    var data = {};
    $.each(fieldMappingData, function (index, subitem) {

        if (subitem[propname] !== undefined) {
            if (propname == 'providerFieldMapping' && subitem['providerFieldMapping'].length > 0) {
                $.each(subitem['providerFieldMapping'], function (index, subitemitem) {
                    if (subitemitem['providerFieldName'] == subpropname) {
                        data = subitemitem;
                    }
                });

            }
            else if (propname != 'providerFieldMapping') {
                data = subitem;
            }

        }
    });
    return data;
}
function jsonFieldMappingObject(xmlstr) {
    xmlstr = '<root>' + xmlstr + '</root>';
    var xmlDoc;
    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlstr, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlstr);
    }
    var elements = xmlDoc.getElementsByTagName("providerFieldMapping");
    var jsonFieldsData = [];
    if (elements.length > 0) {
        for (var elemindx = 0; elemindx < elements.length; elemindx++) {
            if (elements[elemindx] !== undefined) {
                var $xmlNodeTemp = $(elements[elemindx]).clone();
                var xmlNode = $.parseXML($('<root/>').html($xmlNodeTemp).html());
                var pfieldname = safeStringValue($(xmlNode.getElementsByTagName("providerFieldName")).text(), '');
                var formfieldid = safeStringValue($(xmlNode.getElementsByTagName("formFieldId")).text(), '');
                var fixedvalue = safeStringValue($(xmlNode.getElementsByTagName("fixedValue")).text(), '');


                jsonFieldsData.push(createJSONFieldMapObj(pfieldname, formfieldid, fixedvalue));
            }
            else {
                console.log('Field element is null or undefined ');
            }
        }
    }
    // var propObj={};
    // propObj['providerFieldMapping']=jsonFieldsData;
    return jsonFieldsData;
}
function createJSONFieldMapObj(pfieldname, formelemid, fixedval) {
    var dataobj = { "providerFieldName": pfieldname, "formFieldId": formelemid, "fixedValue": fixedval };


    return dataobj;
}

function populatePaymentAccountTab(elemSourceParent) {
    /*populate first tab*/
    var paymentFieldId = '';
    if (!isNullOrEmpty($(elemSourceParent).parents('.ExpandDivPayment').attr('data-paymentfield-record-id'))) {
        paymentFieldId = $(elemSourceParent).parents('.ExpandDivPayment').attr('data-paymentfield-record-id');
        remoteToggleTestModeJS(paymentFieldId, false, $(elemSourceParent).parents('.fieldLi'))
    }
}
function populatePaymentSettingTab(elemSourceParent) {
    populateCurrencyList(elemSourceParent);
    processPaymentData(elemSourceParent);
    $(elemSourceParent).find('.pp-recurring-row .pp-form-fields select.sel-rec').select2();
}
function populatePEmailConfirmationTab(elemSourceParent) {
    /*populate fourth- email confirmation tab*/
    setEmailBodyToolbar(elemSourceParent);
    processPaymentData(elemSourceParent);
}
function processPaymentData(elemSourceParent) {
    var jsonFieldList = [];
    /*populate third- mapping fields tab*/
    var paymentFieldId = '';
    if (!isNullOrEmpty($(elemSourceParent).parents('.ExpandDivPayment').attr('data-paymentfield-record-id'))) {
        paymentFieldId = $(elemSourceParent).parents('.ExpandDivPayment').attr('data-paymentfield-record-id');


        var fetchFieldmapping = false;
        var fetchAdvancedFieldmapping = false;

        //$(elemSourceParent).find('.tab-pane.active select.pp-sel-fields').each( function (index, selectElement) {
        if ($(elemSourceParent).find('.tab-pane.active').hasClass('email-confirmation-body')) {
            /*populate email confirmation columns only*/

            $(elemSourceParent).find('.email-to-fields textarea.el-struc-email, .tab-pane.active .email-content-box .email-template-box textarea,.tab-pane.active .email-content-box input.el-text-box,.tab-pane.active .email-to-fields select.pp-email-fields,.tab-pane.active .email-to-fields input.el-text-box').each(function (index, targetElement) {

                var fieldName = $(targetElement).attr('data-pp-email');
                if (!isNullOrEmpty(fieldName) && $.inArray(fieldName, jsonFieldList) === -1) {
                    jsonFieldList.push(fieldName);
                }
            });
        }
        else {
            /*populate field mapping and payment settings tab columns only*/
            $(elemSourceParent).find('.tab-pane.active .pp-field-row .pp-form-fields input.pp-textbox,.tab-pane.active .pp-field-row .pp-form-fields select.pp-sel-fields,.tab-pane.active .pp-field-row .pp-form-fields select.pp-currency-select,.tab-pane.active  .pp-field-row .pp-form-fields input.pp-checkbox, .tab-pane.active .pp-formula-block-.step-1  .pp-textbox,.tab-pane.active .expandable-borders textarea.content-editor-textarea,.tab-pane.active .pp-block-a .change-trigger,.tab-pane.active .pp-recurring-row .pp-form-fields input[name="radio-paymenttype"], .tab-pane.active .pp-formula-block-outer .pp-radiochklist input[name="radio-sub-total-amount-formula"], .tab-pane.active .pp-recurring-row .pp-form-fields input.pp-textbox,.tab-pane.active .pp-recurring-row .pp-form-fields select.select-elem,.tab-pane.active  .pp-recurring-row .pp-form-fields input.pp-checkbox').each(function (index, targetElement) {

                var fieldName = $(targetElement).attr('data-pp-prop');
                if (!isNullOrEmpty(fieldName) && fieldName != 'advancedfieldmapping') {
                    if (fieldName == 'FieldMapping' || fieldName == 'FieldMappingAdvanced') {
                        console.log('Get  Field mapping and/or advanced field mapping ');
                        fetchFieldmapping = true;
                    }
                    else {

                        if ($.inArray(fieldName, jsonFieldList) === -1) {
                            jsonFieldList.push(fieldName);
                        }
                    }
                }

            });

            if (fetchFieldmapping) {
                jsonFieldList.push('Provider_Field_Mapping_XML__c');

            }
            jsonFieldList.push('Subtotal_Amount_Mapping_XML__c');
        }

        if (jsonFieldList.length > 0) {
            remoteGetFieldsInfoJS(paymentFieldId, jsonFieldList, elemSourceParent)
        }
    }
}

function refreshAvailableFieldList() {
    var elemSourceParent = $('#mainMultiPageWrapper .formFieldUl li').find('.ExpandDivPayment');

}

function changePaymentActiveTab(elemSource) {
    var paymenttab = '';

    var targetId = $(elemSource).attr('href');
    var elemSourceParent = $(elemSource).parents('.nav-tabs').parent();
    $(elemSourceParent).find('.nav-tabs>li.sfff-tab').removeClass('active');
    $(elemSource).parents('.sfff-tab').addClass('active');
    $(elemSourceParent).find('.tab-pane').removeClass('active').removeClass('in');
    $(elemSourceParent).find('' + targetId).addClass('active').addClass('in');
    paymenttab = targetId.replace('#', '');
    remoteRefreshAvailableFieldsListJS(paymenttab, elemSourceParent)
}
function changePaymentActiveTabCallBack(paymenttab, elemSourceParent) {
    switch (paymenttab) {
        case 'paymentaccountsection':
            populatePaymentAccountTab(elemSourceParent);
            break;
        case 'paymentsettingsection':
            populatePaymentSettingTab(elemSourceParent);
            break;
        case 'fieldsmappingsection':
            populatePFieldsMappingTab(elemSourceParent);
            break;
        case 'emailconfirmationsection':
            populatePEmailConfirmationTab(elemSourceParent);
            break;

        default:
            populatePaymentAccountTab(elemSourceParent);
    }

}


function customTabIndexForEmailFields(elemSource, eventSource) {
    if (eventSource.keyCode == 9) {
        var tabindx = $(elemSource).attr('tabindex');
        if (!isNullOrEmpty(tabindx)) {
            tabindx = parseFloat(tabindx) + 1;
        }
        if ($(elemSource).parents('.email-to-fields-wrapper').find('input[tabindex=' + tabindx + '],div[tabindex=' + tabindx + ']') !== undefined) {
            $(elemSource).parents('.email-to-fields-wrapper').find('input[tabindex=' + tabindx + '],div[tabindex=' + tabindx + ']').focus();
        }
        eventSource.preventDefault();
    }
}
function populateAvailableFieldsListForPaymentCallBack(elemSourceParent, availableFieldsData) {
    var selecthtml = '';
    availableFieldsListForPayment = availableFieldsData;
    selecthtml = generatePaymentSelectHtmlFromData(availableFieldsData, false);
    $(elemSourceParent).find(' select.pp-sel-fields').each(function (index, selectElement) {
        $(selectElement).select2('destroy');
        $(selectElement).parent().find('div.pp-sel-fields').remove();
        restructurePaymentSelectElement($(selectElement), selecthtml);
    });
    selecthtml = generatePaymentSelectHtmlFromData(availableFieldsData, true);
    $(elemSourceParent).find(' select.sel-merge-field').each(function (index, selectElement) {
        $(selectElement).select2('destroy');
        $(selectElement).parent().find('div.sel-merge-field').remove();
        restructurePaymentSelectElement($(selectElement), selecthtml);
    });


}
function generatePaymentSelectHtmlFromData(availableFieldData, addMergeFieldOptions) {
    var sectionGrp = [];
    var sectionStart = false;
    var fieldsStart = 0;
    var fieldEnds = false;
    var genfieldsStart = 0;
    var genfieldEnds = false;
    var currentIndex = 0;
    var html = '';
    var childObjectPrefix = '';
    var totalItems = availableFieldData.length;
    var sectionGrpStart = false;
    var fieldGrpStart = false;
    var genfieldGrpStart = false;
    html += '<option class="fielditem" name="field-item" value="">--select an item--</option>';

    $.each(availableFieldData, function (index, availableField) {

        var optionText = unescapeHTMLString(GetInputValue(availableField.FFText));
        var optionValue = GetInputValue(availableField.FFValue);
        var dataType = availableField.FFTitle;
        if (optionText == '--select a section--') {
            sectionGrpStart = true;
            html += '<optgroup class="SectionOption" label="Sections">';
        }
        if (optionText == '--select a field--') {
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
                childObjectPrefix = 'FieldOption ' + optionValue.substring(optionValue.length - 1);

            }

            if (fieldsStart > 0) {
                if (fieldEnds) {
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
                    html += '</optgroup>';
                    fieldEnds = false;
                }

                genfieldsStart++;
            }
            html += '<optgroup class="FieldOption" label="General Fields">';

        }

        if (sectionGrpStart && optionValue != '' && fieldsStart == 0) {

            html += '<option class="sectionitem" name="section-item" value="' + optionValue + '">' + optionText + ' </option>';
        }
        if (!sectionGrpStart && fieldGrpStart && fieldsStart > 0 && optionValue != '' && optionText.indexOf('Fields for') < 0) {
            fieldEnds = true;
            if (addMergeFieldOptions && !isNullOrEmpty(dataType) && (dataType == 'PICKLIST' || dataType == 'BOOLEAN' || dataType == 'MULTIPICKLIST')) {
                html += '<option data-dtype="' + dataType + '" class="fielditem"  data-optiontype="val" name="field-item" value="' + optionValue + '">' + optionText + '(Val) </option>';
                html += '<option data-dtype="' + dataType + '" data-optiontype="amount" class="fielditem" name="field-item" value="FFAMOUNT' + optionValue + '">' + optionText + '(Amount) </option>';
            }
            else {
                html += '<option data-dtype="' + dataType + '" class="fielditem" data-optiontype="val" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';
            }

        }
        if (!sectionGrpStart && !fieldGrpStart && genfieldsStart > 0 && optionValue != '') {
            fieldEnds = true;
            html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';

        }

        if (index === totalItems - 1) {
            // this is the last one
            html += '</optgroup>';
        }
    });
    return html;
}
function restructurePaymentSelectElement(selectElement, selecthtml) {
    $(selectElement).empty();

    $(selectElement).append(selecthtml);
    if ($(selectElement).hasClass('sel-option-field')) {
        $(selectElement).find('option').each(function (indx, optionElem) {
            var dataType = $(optionElem).attr('data-dtype');
            if (!isNullOrEmpty(dataType) && (dataType == 'PICKLIST' || dataType == 'BOOLEAN' || dataType == 'MULTIPICKLIST')) {
                $(optionElem).removeAttr('disabled');
            }
            else if ($(optionElem).text().indexOf('--select') == 0) {
            }
            else {
                $(optionElem).attr('disabled', 'disabled');
            }

        });
    }

    $(selectElement).select2();
}

function populateCurrencyList(elemSourceTabsContainer) {
    if (currencyList != null && currencyList.length > 0) {
        populateCurrencyListCallBack(currencyList, elemSourceTabsContainer);
    }
    else {
        var paymentFieldId = '';
        var elemSourceParent = $(elemSourceTabsContainer).parents('.ExpandDivPayment');
        if ($(elemSourceParent).length > 0 && !isNullOrEmpty($(elemSourceParent).attr('data-paymentfield-record-id'))) {
            paymentFieldId = $(elemSourceParent).attr('data-paymentfield-record-id');
        }
        remoteGetCurrencyListWithSelectedItemJS(paymentFieldId, elemSourceTabsContainer);
    }
}

function populateCurrencyListCallBack(currencyListData, elemSourceTabsContainer) {
    $('select.pp-currency-select').select2('destroy');
    $('select.pp-currency-select').parent().find('div.pp-currency-select').remove();
    var selectedvalue = '';
    var selectElement = $(elemSourceTabsContainer).find('select.pp-currency-select');
    var selecthtml = '';
    selecthtml += "<option value='' >--select a currency--</option>";
    $.each(currencyListData, function (index, currencyObj) {
        selecthtml += "<option csymbol='" + currencyObj.csymbol + "' value='" + currencyObj.id + "' >" + currencyObj.cname + "</option>";
        if (currencyObj.selected) {
            selectedvalue = currencyObj.id;
            changeCurrencyLabel(currencyObj.csymbol, elemSourceTabsContainer);
        }
    });

    $(selectElement).empty();
    $(selectElement).append(selecthtml);
    $(selectElement).select2().select2('val', selectedvalue);
}
function createJSONCurrencyObject(currencyid, name, code, symbol, isselected) {
    var dataobj = {
        "id": currencyid,
        "cname": name,
        "ccode": code,
        "csymbol": symbol,
        "selected": isselected
    };


    return dataobj;
}
function resetPaymentSettings() {
    if ($('#mainMultiPageWrapper .formFieldUl li').find('.ExpandDivPayment').length > 0 && $('#mainMultiPageWrapper .formFieldUl li').find('.ExpandDivPayment').attr('data-paymentfield-record-id') != undefined) {
        var elemSourceParent = $('#mainMultiPageWrapper .formFieldUl li').find('.ExpandDivPayment');
        var paymentFieldId = $(elemSourceParent).attr('data-paymentfield-record-id');
        var paymentType = 'OPayPalPayment';
        try {
            paymentType = $(elemSourceParent).parents('.fieldLi').attr('data-otype');

        } catch (err) { }
        if (paymentFieldId != '') {
            paymentType = getOPaymentTypeVal(paymentType, 'PayPal Pro', 'PayPal Pro', 'iATS', 'Stripe', 'AuthorizeNet');
            resetPaymentSettingsJS(paymentFieldId, elemSourceParent, paymentType);
        }
    }
}
function resetPaymentSettingsCallBack(jsonPaymentFieldObj, elemSourceParent) {
    if (jsonPaymentFieldObj.Account__c !== undefined && jsonPaymentFieldObj.Account__c != '') {
        var paymentaccid = jsonPaymentFieldObj.Account__c;
        $(elemSourceParent).find('#pp-account-' + paymentaccid + ' input[type=radio]').prop('checked', true);
    }
}
function toggleAdvanceOptions(elemSource) {
    $(elemSource).parents('.tab-pane').find('.fields-mapping-advanced-options').slideToggle(300);
}
function togglePPFieldBlock(elem, elementState, isAutoSave) {
    var parentElement;
    var dataToggleElem = $(elem).attr('data-source-toggle');
    var triggeredBySecondTabElems = true;
    if (!isNullOrEmpty($(elem).attr('data-parentelem')) && $(elem).attr('data-parentelem') == 'advancedfieldmapping') {
        triggeredBySecondTabElems = false;
        parentElement = $(elem).parents('.pp-field-row');
        $(parentElement).find('.pp-field-type-div').each(function (indx, divElement) {
            if (!$(divElement).hasClass('display-none')) {
                $(divElement).addClass('display-none');
            }
        });
    }
    else {
        parentElement = $(elem).parents('.expandable-borders');
        $(parentElement).find('.field-type-target').each(function (indx, divElement) {
            if (!$(divElement).hasClass('display-none')) {
                $(divElement).addClass('display-none');

            }
        });
    }

    var tempActiveElement;
    switch (elementState) {
        case 'dynamic':
            $(parentElement).find('.pp-field-type-div.pp-dynamic-block').removeClass('display-none');
            if (triggeredBySecondTabElems) {
                addClassIfNotExist($(parentElement).find('.pp-formula-block-outer'), 'pp-collapsed');
            }
            tempActiveElement = $(parentElement).find('.pp-field-type-div.pp-dynamic-block').find('select.pp-sel-fields');
            break;
        case 'formula':
            if (triggeredBySecondTabElems) {
                var formulaBlockElement;
                if (!isNullOrEmpty(dataToggleElem)) {
                    formulaBlockElement = $(parentElement).find('.pp-formula-block-outer[data-target-toggle="' + dataToggleElem + '"]');
                } else {
                    formulaBlockElement = $(parentElement).find('.pp-formula-block-outer');
                }
                $(formulaBlockElement).removeClass('display-none');
                $(formulaBlockElement).removeClass('pp-collapsed', 500);
                var optionsArr = [];
                $(formulaBlockElement).find('select.pp-sel-fields option').each(function (indx, optionelem) {
                    if ($(optionelem).val() !== undefined && $(optionelem).val() !== '') {
                        var tempOptionsArr = createAutoCompleteFormulaList(optionelem);
                        for(var i=0 ; i<tempOptionsArr.length;i++){
                            optionsArr.push(tempOptionsArr[i]);
                        }

                    }
                });
                var formulaElement = $(formulaBlockElement).find('textarea');
                initializeTextareaAutoComplete(formulaElement, optionsArr);
                tempActiveElement = formulaElement;
            }
            break;

        default:
            if (triggeredBySecondTabElems) {
                if (!isNullOrEmpty(dataToggleElem)) {
                    addClassIfNotExist($(parentElement).find('.pp-formula-block-outer[data-target-toggle="' + dataToggleElem + '"]'), 'collapsed');
                } else {
                    addClassIfNotExist($(parentElement).find('.pp-formula-block-outer'), 'collapsed');
                }
            }
            $(parentElement).find('.pp-field-type-div.pp-static-block').removeClass('display-none');
            tempActiveElement = $(parentElement).find('.pp-static-block input.pp-textbox');
    }

    $(elem).parents('.pp-toggle-links').find('li').each(function (indx, liElement) {
        if ($(liElement).hasClass(elementState + '-alink')) {
            $(liElement).addClass('display-none');
        }
        else {
            $(liElement).removeClass('display-none');

        }
    });
    if (isAutoSave) {
        if (tempActiveElement !== undefined) {
            if ($(tempActiveElement).length > 0 && $(tempActiveElement)[0].type == 'select-one') {
                $(tempActiveElement).select2("focus");
            }
            else {
                $(tempActiveElement).focus();
            }
        }

        paymentSetupChange(elem);

    }
}
function addClassIfNotExist(elemSource, className) {
    if (!$(elemSource).hasClass(className)) {
        $(elemSource).addClass(className, 500);
    }
}
function mergeFieldChange(elemSource, isAutoSave) {
    var isIfIncluded = false;
    if(elemSource.classList.contains('subtotal')){
        isIfIncluded = $('#radioIfStatmentCustomAmount')[0].checked;
    }else if(elemSource.classList.contains('shipping')){
        isIfIncluded = $('#radioIfStatmentShip')[0].checked;
    } else if(elemSource.classList.contains('tax')){
        isIfIncluded = $('#radioIfStatmentTax')[0].checked;
    }
    var ifStatmentStart = "";
    var ifStatmentEnd = "";
    

    var parentBlock = $(elemSource).parents('.merge-field-block');
    var endTag = 'val';
    if (!isNullOrEmpty($(parentBlock).find('select.sel-merge-field option:selected').attr('data-optiontype')) && $(parentBlock).find('select.sel-merge-field option:selected').attr('data-optiontype') == 'amount') {
        endTag = 'amount';
    }
    var selectedVal = $(parentBlock).find('select.sel-merge-field').select2("val");
    var originalVal = $(parentBlock).parent().find('textarea').val();
    if (endTag == 'amount') {
        if (!isNullOrEmpty(selectedVal) && selectedVal.indexOf("FFAMOUNT") == 0) {
            selectedVal = selectedVal.replace("FFAMOUNT", "");
        }
    }

    if(isIfIncluded){
        ifStatmentStart = 'IF(';
        ifStatmentEnd = '="",0,'+ '["' + selectedVal + '"].' + endTag +')';
    }

    if (originalVal == '') {

        originalVal = ifStatmentStart + '["' + selectedVal + '"].' + endTag + '' + ifStatmentEnd;
    }
    else {
        originalVal = originalVal + '+ ' + ifStatmentStart + '["' + selectedVal + '"].' + endTag + '' + ifStatmentEnd;
    }

    $(parentBlock).parent().find('textarea').val(originalVal);
    $(parentBlock).parent().find('textarea').focus();
    if (isAutoSave) {
        paymentSetupChange(elemSource);
    }
}
function resetFormulaElem(parentElement) {

    var formulaSTR = '';
    var baseAmount = $(parentElement).find('.step-1').find('.pp-formula-fields .pp-textbox').val();
    formulaSTR = baseAmount;
    $(parentElement).find('.step-2 .pp-options-fields-info-header').each(function (indx, headerDivElement) {
        var selectElem = $(headerDivElement).find('.pp-options-fields-col-1>select');
        var elemId = $(selectElem).select2("val");
        var datatype = $('option:selected', $(selectElem)).attr('data-dtype');
        if (!isNullOrEmpty(datatype)) {
            if (formulaSTR != '') {
                formulaSTR += '+';
            }
            if (datatype == 'PICKLIST' || datatype == 'MULTIPICKLIST' || datatype == 'BOOLEAN') {
                formulaSTR += '["' + elemId + '"].amount';
            }
            else {
                formulaSTR += '["' + elemId + '"].val';
            }
        }

    });
    $(parentElement).find('.step-3 .default-formula .content-editor-textarea.text-disabled').val(formulaSTR);
    var radiodefaultFormulaElem = $(parentElement).find('.step-3').find('#radioffppsubtotalamountdefault');
    $(radiodefaultFormulaElem)[0].checked = true;
    radioFormulaElemChange(radiodefaultFormulaElem, false);
    // $(parentElement).find('.step-3 .default-formula').removeClass('display-none');
}

function availableFieldOptionChange(elemSource, isAutoSave) {
    var parentRowDivElement = $(elemSource).parents('.pp-options-fields-row');
    var elemOptionsObj = {};
    var selectedVal = $(elemSource).select2("val");
    if (!isNullOrEmpty(selectedVal)) {
        var elementType = 'STRING';
        console.log(' Selected merge field value not empty-' + selectedVal);
        var elementId = selectedVal;


        //elementId = getFormCanvasFriendlyID(elementId);
        var escapedElemId = escapeHTMLElementId(elementId);
        var selectedElem;
        if (!isNullOrEmpty(escapedElemId)) {
            selectedElem = $("#mainMultiPageWrapper .formFieldUl  .fieldDiv").find('#' + escapedElemId);
        }
        if ($(selectedElem).length > 0) {
            var elemOptions = [];



            var elementype = $(selectedElem)[0].type;
            if (elementype == 'select-one' || elementype == 'select-multiple') {
                elementType = "PICKLIST";
                $(selectedElem).find('option').each(function (indx, optionElem) {
                    if ($(optionElem) !== undefined && !isNullOrEmpty($(optionElem).attr('value'))) {
                        elemOptions.push(createOptionItem($(optionElem).attr('amount'), $(optionElem).attr('value')));
                    }

                });
            }
            else if (elementype == 'checkbox' || elementype == 'radio') {
                elementType = "BOOLEAN";
                elemOptions.push(createOptionItem("", "True"));
                elemOptions.push(createOptionItem("", "False"));
            }
            else if (elementype == 'text' || elementype == 'textbox' || elementype == 'textarea') {
                elemOptions.push(createOptionItem("", "Value"));

            }
            else {

            }
            elemOptionsObj["ControlId"] = selectedVal;
            elemOptionsObj["DataType"] = elementType;
            elemOptionsObj["Options"] = elemOptions;
            var removeInfo = true;

            if ($(parentRowDivElement).find('.pp-options-fields-info').length > 0) {
                $(parentRowDivElement).find('.pp-options-fields-info').fadeOut().remove();
                // removeInfo=false;
            }

            $.each(elemOptionsObj["Options"], function (index, optionElement) {
                var newHTML = getNewOptionsFieldsHtml(selectedVal);


                $(newHTML).find('.pp-col-1>span').text(optionElement["value"]);
                $(newHTML).find('input').attr('data-optionname', optionElement["value"]);
                $(parentRowDivElement).append(newHTML).fadeIn('slow');

            });
            //resetFormulaElem($(parentRowDivElement).parents('.expandable-borders'));
        }
    }
    else {
        // if selected item is empty then clear the following input elemtent

        if ($(parentRowDivElement).find('.pp-options-fields-info').length > 0) {
            $(parentRowDivElement).find('.pp-options-fields-info').fadeOut().remove();

        }

    }

    console.log(' Selected merge field value-' + selectedVal);
    if (isAutoSave) {
        resetFormulaElem($(parentRowDivElement).parents('.expandable-borders'));
        paymentSetupChange(elemSource);
    }
}
function radioFormulaElemChange(elemSource, isAutoSave) {
    var selectedval = $(elemSource).val();
    var parentStep = $(elemSource).parents('.pp-formula-block-');
    if (selectedval == 'default') {
        $(parentStep).find('.custom-formula').addClass('display-none');
        $(parentStep).find('.default-formula').removeClass('display-none');

    }
    else {
        $(parentStep).find('.default-formula').addClass('display-none');
        $(parentStep).find('.custom-formula').removeClass('display-none');
    }
    if (isAutoSave) {
        paymentSetupChange(elemSource);
    }
}
function radioRecurringChange(elemSource, isAutoSave) {
    var selectedval = $(elemSource).val();
    var parentStep = $(elemSource).parents('.pp-recurring-row-outer');
    var recurringBlock = $(parentStep).parents('.payment-setting-body').find('.payment-item-row.pp-recurringfee');
    if (selectedval == 'single') {
        $(parentStep).find('.payment-recurring-block').addClass('display-none');
        $(recurringBlock).hide();
    }
    else {
        $(parentStep).find('.payment-recurring-block').removeClass('display-none');
        $(recurringBlock).show();
    }
    resetTransactionLabels($(parentStep).parents('.payment-setting-body'), selectedval);

    var displayamount = $('input[name=chkbxDisplayAmountCharged]:checked', $(parentStep).parents('.payment-setting-body').find('.pp-form-fields')).val();
    restructurePaymentLabels($(parentStep).parents('.fieldLi'), selectedval, displayamount);
    if (isAutoSave) {
        paymentSetupChange(elemSource);
    }
}
function resetTransactionLabels(parentPaymentDiv, paymenttype) {
    var dataAttr = 'data-single-payment';
    if (paymenttype == 'recurring') {
        dataAttr = 'data-recurring-payment';
    }

    $(parentPaymentDiv).find('.multi-label-elem').each(function (indx, labelElem) {
        var textstr = $(labelElem).attr(dataAttr);

        if (!isNullOrEmpty(textstr)) {
            $(labelElem).text(textstr);
        }
    });

}
function createAutoCompleteFormulaList(optionelem){
      
    var optionsArr = [];
     if(optionelem.dataset !== undefined && optionelem.dataset.dtype == 'PICKLIST'|| optionelem.dataset.dtype == 'BOOLEAN' || optionelem.dataset.dtype == 'MULTIPICKLIST'){
         optionsArr.push($(optionelem).val() + '(Val)');
         optionsArr.push($(optionelem).val() +'(Amount)');
     }else{
         optionsArr.push($(optionelem).val());
     }

 return optionsArr
}

function initializeTextareaAutoComplete(textareaElem, optionsData) {
    $(textareaElem).textcomplete([
        { // html
            mentions: optionsData,
            match: /\B\[\"(\w*)$/,
            search: function (term, callback) {
                callback($.map(this.mentions, function (mention) {
                    return mention.indexOf(term) === 0 ? mention : null;                       
                }));
            },
            index: 1,
            replace: function (elemid) {
                var result = elemid;
                if(elemid.indexOf('(Val)') != -1 || elemid.indexOf('(Amount)') == -1){
                    result = '["' +elemid.replace('(Amount)','')+ '"].val';
                }else if(elemid.indexOf('(Amount)') != -1){
                    result = '["' + elemid.replace('(Amount)','') + '"].amount';
                }
                return result;
            }
        }
    ], { appendTo: 'body' });
}


function getAmountMappingData(elemSource, paymentfieldid) {
    var optionsArr = [];
    var paymentLblIdSuffix = '';
    var paymentLblId = $(elemSource).parents('.fieldLi').attr('id');
    if (!isNullOrEmpty(paymentLblId)) {
        var tempPaymentIndex = safeLegacyPAYPALPAYMENT(paymentLblId);
        paymentLblIdSuffix = tempPaymentIndex.replace('lblliFASTFORMSPAYMENT', '');
        // paymentLblIdSuffix = paymentLblId.replace('lblliPAYPALPAYMENT', '');
    }
    var amountMapping = '';

    var elemSourceParent = $(elemSource).parents('.ExpandDivPayment');


    // paymentFieldRecord.Id=paymentFieldId;

    var subtotalAmountMappingXML = '';

    subtotalAmountMappingXML += '<subtotalAmountMapping>';

    var fieldList = [];//fieldList.push({'fieldId':optionAmount,'dataExists':optionValue});
    var elemSourceOptionsMain = $(elemSourceParent).find('.pp-options-fields');

    // subtotalAmountMappingXML+='<paymentFieldId>'+paymentfieldid+'</paymentFieldId>';
    $(elemSourceOptionsMain).find('.pp-options-fields-row').each(function (indx, fieldRowElement) {
        var fieldId = '';
        if ($(fieldRowElement).find('.pp-options-fields-info').length > 0 && !isNullOrEmpty($(fieldRowElement).find('.pp-options-fields-info').first().attr('data-elem-id'))) {
            fieldId = $(fieldRowElement).find('.pp-options-fields-info').attr('data-elem-id');
        }
        var isDataExist = false;
        subtotalAmountMappingXML += '<mapping>';
        subtotalAmountMappingXML += '<fieldId>' + fieldId + '</fieldId>';
        $(fieldRowElement).find('.pp-options-fields-info').each(function (index, fieldInfoElement) {


            var optionValue = $(fieldInfoElement).find('.pp-col-1>span').text();
            var optionAmount = $(fieldInfoElement).find('.pp-col-2>input').val();
            if (!isNullOrEmpty(optionAmount)) {
                isDataExist = true;

                subtotalAmountMappingXML += '<option>';
                subtotalAmountMappingXML += '<amount>' + optionAmount + '</amount>';
                subtotalAmountMappingXML += '<value>' + escapeXML(optionValue) + '</value>';
                subtotalAmountMappingXML += '</option>';
                optionsArr.push({ 'amount': optionAmount, 'value': optionValue, 'fieldId': fieldId });
            }
            else {
                optionsArr.push({ 'amount': '', 'value': optionValue, 'fieldId': fieldId });
            }
            fieldList.push({ 'fieldId': fieldId, 'dataExists': isDataExist });
        });
        subtotalAmountMappingXML += '</mapping>';
    });
    subtotalAmountMappingXML += '</subtotalAmountMapping>';

    if (fieldList != null && fieldList.length > 0) {
        amountMapping = subtotalAmountMappingXML;
    }
    return amountMapping;
}
function clearAllOccurenceOfAttribute(attributename) {
    if (!isNullOrEmpty(attributename)) {
        $('#mainMultiPageWrapper .formFieldUl  .fieldDiv').each(function (inx, divElement) {
            $(divElement).find('>select[' + attributename + ']').removeAttr(attributename);
            $(divElement).find('>select[' + attributename + '] option[' + attributename + ']').removeAttr(attributename);
            $(divElement).find('>input[' + attributename + ']').removeAttr(attributename);
        });
    }
}
function getFormCanvasFriendlyID(elemid) {
    var elementid = elemid;
    if (elementid.split('.').length == 4) {
        var lastindex = elementid.lastIndexOf('.');
        var colorCode = elementid.substring(lastindex - 1, lastindex);
        elementid = elementid.replace(".A.", ".").replace(".B.", ".").replace(".C.", ".") + colorCode;
    }
    return elementid;
}
function getRenderFormFriendlyID(elementId) {
    var elemId = elementId;
    if (elemId.split('.').length == 3) {
        var colorcode = elemId.slice(-1);
        colorcode = colorcode.trim();

        if ($.inArray(colorcode, colorTagArray) >= 0) {
            elemId = elemId.substring(0, elemId.length - 1);
            var lastindex = elemId.lastIndexOf('.');
            var firstpart = elemId.substring(0, lastindex);
            var secondpart = elemId.substring(lastindex);
            elemId = firstpart + '.' + colorcode + '' + secondpart;
        }
    }
    return elemId;
}
function getSubTotalMappingJSON(xmlstr) {
    xmlstr = '<root>' + xmlstr + '</root>';
    var xmlDoc;
    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlstr, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlstr);
    }
    var jsonFieldsData = [];
 
    $.each(xmlDoc.getElementsByTagName("subtotalAmountMapping"), function(itemIndex, subtotalAmountMappingItem) {
                var propObj = {};
                $.each(subtotalAmountMappingItem.getElementsByTagName("mapping"), function (index, item) {
                    if (item.childNodes.length > 0) {
                        /// var optionamt=safeStringValue($(item.getElementsByTagName("optionAmount")).text(),'');
                        var formfieldid = safeStringValue($(item.getElementsByTagName("fieldId")).text(), '');
                        //var optionAmounts=item.getElementsByTagName("optionAmount");
                        var optionValues = item.getElementsByTagName("option");
                        var propObjArr = [];
                        for (var itemindx = 0; itemindx < optionValues.length; itemindx++) {
                            var optionamt = $(optionValues[itemindx].getElementsByTagName("amount")).text();
                            var optval = $(optionValues[itemindx].getElementsByTagName("value")).text();
                            propObjArr.push(createJSONSubTotalOptionObj(optval, optionamt));

                        }
                        if (propObjArr.length > 0) {
                            jsonFieldsData.push(createJSONSubTotalMapObj(formfieldid, propObjArr));
                        }
                    }
                });
        });
    return jsonFieldsData;
}
function createJSONSubTotalMapObj(formfieldid, optvalArr) {
    var dataobj = { "fieldId": formfieldid, "option": optvalArr };


    return dataobj;
}
function createJSONSubTotalOptionObj(optval, optionamt) {
    var dataobj = { "optionValue": optval, "optionAmount": optionamt };


    return dataobj;
}
function addFieldOptionRowHTML(elemSource, isAutoSave) {
    var newElem = getNewOptionFieldRowHTML();
    $(elemSource).parents('.pp-options-fields').append(newElem).fadeIn('slow');
    $(newElem).find('.pp-option-delete').css('display', '');
    var selectHtml = $(elemSource).parents('.pp-options-fields-info-header').find('select').html();

    $(newElem).find('.pp-options-fields-col-1 > select').html(selectHtml);
    $(newElem).find('.pp-options-fields-col-1 > select').select2();
}
function getNewOptionsFieldsHtml(elementId) {
    //var newDiv = $('<div/>').addClass('pp-options-fields-info');
    var newDiv = $('<div />', {
        'class': 'pp-options-fields-info', 'data-elem-id': '' + elementId
    });
    newDiv.append($('#optionsFieldsHtml').html());


    return newDiv;
}
function getNewOptionFieldRowHTML() {
    var newDiv = $('<div/>').addClass('pp-options-fields-row');
    newDiv.append($('#optionFieldRowHtml').html());
    return newDiv;

}
function deleteFieldOptionRowHTML(elem, isAutoSave) {
    var expandableParent = $(elem).parents('.expandable-borders');
    $('.pp-option-add-delete-box').hide();
    var optionSection = $(elem).parents('.pp-options-fields');
    var numoptionInSection = $(optionSection).children().size() - 1;



    $(elem).parents('.pp-options-fields-row').fadeOut().remove();
    $('.pp-option-add-delete-box').show();
    if (numoptionInSection == 1) {
        //hide the delete button for top-most statement
        $(optionSection).find('.pp-option-delete').eq(0).hide();
    }
    resetFormulaElem(expandableParent);

    if (isAutoSave) {
        paymentSetupChange(optionSection);
    }
}
function toggleTestMode(elemSource, isAutoSave) {
    var testModeParent = $(elemSource).parents('.test-mode-box-inner');

    if (!$(testModeParent).hasClass('mode-active')) {
        setPaymentTestModeDisplay(true, elemSource);

    }
    else {
        setPaymentTestModeDisplay(false, elemSource);
    }

    var parentFieldLi = $(elemSource).parents('.fieldLi');
    var paymentRecId = $(elemSource).parents('.ExpandDivPayment').attr('data-paymentfield-record-id')
    if (!isNullOrEmpty(paymentRecId)) {
        remoteToggleTestModeJS(paymentRecId, true, parentFieldLi)
    }
}
function setPaymentTestModeDisplay(testMode, elemSource) {
    var testModeParent = $(elemSource).parents('.test-mode-box-inner');

    if (testMode) {
        $(testModeParent).find('.test-mode-status').html('Test Mode On');
        $(testModeParent).addClass('mode-active');
    }
    else {
        $(testModeParent).find('.test-mode-status').html('Test Mode Off');
        $(testModeParent).removeClass('mode-active');
    }
}
function setPaymentTestModeHTML(elemSourceFieldLi, testMode) {
    if ($(elemSourceFieldLi).find('.payment-test-mode').length > 0) {
        $(elemSourceFieldLi).find('.payment-test-mode').remove();
    }
    if (testMode) {
        var spanTestMode = $('<span />', { 'class': 'payment-test-mode' });
        $(spanTestMode).html('Test Mode');
        $(elemSourceFieldLi).find('.field-div-payment').before(spanTestMode);


        $(elemSourceFieldLi).find('.field-div-payment').addClass('test-mode-active');
    }
    else {
        $(elemSourceFieldLi).find('.field-div-payment').removeClass('test-mode-active');
    }
}
function createOptionItem(amountstr, opval) {
    var dataobj = {
        amount: amountstr,
        value: opval

    };


    return dataobj;
}
function createAmountFormulaItem(operandElem, opStr, datatype, symbol, outputJsonArr) {
    var dataobj = {
        operand: operandElem,
        operator: opStr,
        dataType: datatype,
        output: outputJsonArr
    };


    return dataobj;
}
function getFormulaOutputItemArr(dataJsonArr, optname, optval) {
    if (dataJsonArr === undefined || dataJsonArr === null) {
        dataJsonArr = [];
    }
    var dataobj = {};
    dataobj[optname] = optval;
    dataJsonArr.push(dataobj)


    return dataJsonArr;
}
/*Payment functions added in multi payment options support*/
function initializePaymentAccountsList(fieldLiElem, acctype) {
    if (isNullOrEmpty(acctype)) { acctype = 'PayPal Pro'; }
    console.log(' acctype---' + acctype);
    var paymentlabel = getOTypeFromPaymentVal(acctype.toUpperCase(), 'PayPal', 'PayPal', 'iATS', 'Stripe', 'Authorize.Net');
    if (paymentlabel == 'iATS' || paymentlabel == 'Authorize.Net') {
        $(fieldLiElem).find('.pp-account-type').text('Select an ' + paymentlabel + ' Account');
    } else {
        $(fieldLiElem).find('.pp-account-type').text('Select a ' + paymentlabel + ' Account');
    }

    remoteInitializeAccountListJS(fieldLiElem, acctype);
}
/**
 * Get list of Payment Account records along with currently selected one for the payment field
 * @param {div} fielLiElem Payment main div element in edit mode with attr data-paymentfield-record-id
 * @param {FFResultHelper[]} itemArr if response is valid it returns list of payment accounts else it returns error detail information
 * @todo FF-4321 add warning/error message for end user in case of failure
 */
function resetAccountListItems(fielLiElem, itemArr) {
    if (itemArr != null && itemArr.length > 0) {
        var ffResultObjFirstItem = itemArr[0];
        if (getSafeBoolean(ffResultObjFirstItem.IsValid, false)) {
            /*possible fields (non-namespace): AccountType,IsSandbox,Name,Password,paymentAccountId,Signature,UserName*/
            var selectedAccId = '';
            $(fielLiElem).find('#mainPaypalAccountsPanel').html('');
            if (itemArr != null && itemArr.length > 0) {
                var mainAccWrapperElem = $('<div />');

                $.each(itemArr, function (indx, ffResultObj) {
                    var accItem = {};
                    if (ffResultObj.OtherText !== undefined && ffResultObj.OtherText != '') {
                        accItem = JSON.parse(ffResultObj.OtherText);
                    }
                    if (accItem != null) {
                        var isSandbox = getSafeBoolean(accItem['isSandbox'], false);
                        var sandboxtxt = 'Live';
                        if (isSandbox) { sandboxtxt = 'sandbox'; }
                        var username = accItem['userName'];
                        var accid = accItem['paymentAccountId'];
                        var accname = accItem['name'];
                        $(mainAccWrapperElem).html($('#mainPaypalAccountsWrapperTEMP').html());
                        $(mainAccWrapperElem).find('.pp-sandbox').text(sandboxtxt);
                        $(mainAccWrapperElem).find('.payment-item-wrapper').attr('id', 'pp-acc-' + accid);
                        $(mainAccWrapperElem).find('.pp-checkbox-box').attr('id', 'pp-account-' + accid);
                        $(mainAccWrapperElem).find('.ff-radio-css').attr('for', 'ppacccheck-' + accid);
                        $(mainAccWrapperElem).find('.ff-radio-input').attr('id', 'ppacccheck-' + accid);
                        if (!isNullOrEmpty(ffResultObj.ResultText)) {
                            selectedAccId = ffResultObj.ResultText;
                            //$(mainAccWrapperElem).find('.ff-radio-input').prop('checked',true);
                        }
                        $(mainAccWrapperElem).find('.pp-account-name>h1').text(accname);
                        $(mainAccWrapperElem).find('.pp-username').text(username);

                        $(mainAccWrapperElem).find('.edit-pp-account').attr('data-acc-id', accid);
                        $(mainAccWrapperElem).find('.delete-pp-account').attr('data-acc-id', accid);
                        $(fielLiElem).find('#mainPaypalAccountsPanel').append($(mainAccWrapperElem).html());
                    }
                });
                if ($(fielLiElem).find('#ppacccheck-' + selectedAccId).length > 0) {
                    $(fielLiElem).find('#ppacccheck-' + selectedAccId).prop('checked', true);
                }
            }
            $(fielLiElem).find('.payment-account-item-container').removeClass('vff-faded');
        } else {           
            if(ffResultObjFirstItem!=null && !isNullOrEmpty(ffResultObjFirstItem.ResultText)){
                if (ffResultObjFirstItem.ResultText.indexOf('FFERROR') >= 0) {
                    var fieldIdlist = ffResultObjFirstItem.ResultText.substring(ffResultObjFirstItem.ResultText.indexOf(':') + 1);
                    var fieldIdArr = fieldIdlist.split(',');
                    var fieldlist = '<ul>';
                    var listCount = 0;
                    var fieldlistDetail = '<ul>';
                    if (fieldIdArr instanceof Array) {
                        listCount = fieldIdArr.length;
                        for (i = 0; i < fieldIdArr.length; i++) {
                            if (i < 5) {
                                fieldlist += '<li>' + fieldIdArr[i] + '</li>';
                            } else {
                                fieldlistDetail += '<li>' + fieldIdArr[i] + '</li>';
                            }

                        }
                    }
                    else {
                        fieldlist += '<li>' + fieldIdArr + '</li>';
                    }
                    fieldlist += '</ul>';
                    fieldlistDetail += '</ul>';
                    var secondaryMessage = 'Please modify/delete the following payment fields  before deleting this account:<br/>' + fieldlist + '';
                    if (listCount >= 5) {
                        secondaryMessage = getMessageinDetail('Please modify/delete the following payment fields  before deleting this account:<br/>' + fieldlist, fieldlistDetail, 'More');
                    }
                    commonAlertMessage('This account is associated with other payment fields which are not in use anymore.', secondaryMessage);
                }else if(ffResultObjFirstItem.ResultText=='SF_SECURITY'){
                    console.log('Warning! Permission error:'+ffResultObjFirstItem.OtherText);
                    // TODO/TBD: add warning/error message for end user
                    // commonAlertMessage('Warning! Permission error',ffResultObjFirstItem.OtherText);
                }else{
                    console.log('Unexpected error below:');
                    console.log(ffResultObjFirstItem);
                    // TODO/TBD: add warning/error message for end user
                    // commonAlertMessage('Something went wrong', 'Please contact support if issue persist.');
                }
            }
            return;
        }
    } else {
        console.log('No payment Account record found ');
    }
}
function getMessageinDetail(shortmessage, detailmessage, morelink) {
    $simpleDiv = $('<div />', { html: shortmessage, 'class': 'ff-detail-block-wrap' });
    $simpleDiv.css("max-height", "300px");
    $simpleDiv.css("overflow-y", "auto");
    $simpleDivWrapper = $('<div />', {});
    $span = $('<span />', { html: morelink, 'onclick': 'toggleDetailBlock(this)', 'class': 'ff-detail-block-link' });
    $errorDiv = $('<div />', { html: detailmessage, 'class': 'ff-detail-block' });

    $errorDiv.hide();
    $simpleDiv.append($span);
    $simpleDiv.append($errorDiv);
    $simpleDivWrapper.append($simpleDiv);
    return $simpleDivWrapper.html();
}
function getRecurringIntervalSelectOptionsHTML(paymentType) {
    var recurringIntervalData = getRecurringIntervalByPaymentProvider(paymentType);
    var selectOptionsHTML = '';
    if (recurringIntervalData != null && recurringIntervalData.length > 0) {

        $.each(recurringIntervalData, function (indx, item) {

            selectOptionsHTML += '<option value="' + item.value + '">' + item.label + '</option>';

        });
        ///selectHTML+='</select>';
    }
    return selectOptionsHTML;
}
function getRecurringIntervalByPaymentProvider(paymentType) {
    var data = [];
    switch (paymentType) {
        case 'OPayPalPayment':
            data.push({ 'value': 'Day', 'label': 'Daily' });
            data.push({ 'value': 'Week', 'label': 'Weekly' });
            data.push({ 'value': 'Month', 'label': 'Monthly' });
            data.push({ 'value': 'SemiMonth', 'label': 'Semi-Monthly' });
            data.push({ 'value': 'Year', 'label': 'Yearly' });
            break;
        case 'OiATSPayment':
            data.push({ 'value': 'Weekly', 'label': 'Weekly' });
            data.push({ 'value': 'Monthly', 'label': 'Monthly' });
            data.push({ 'value': 'Quarterly', 'label': 'Quarterly' });
            data.push({ 'value': 'Annually', 'label': 'Annually' });
            break;
        case 'OStripePayment':
            data.push({ 'value': 'Day', 'label': 'Daily' });
            data.push({ 'value': 'Week', 'label': 'Weekly' });
            data.push({ 'value': 'Month', 'label': 'Monthly' });
            data.push({ 'value': 'Quarter', 'label': 'Quarterly' });
            data.push({ 'value': 'Year', 'label': 'Yearly' });
            break;
        case 'OAuthorizeNetPayment':
            data.push({ 'value': 'Week', 'label': 'Weekly' });
            data.push({ 'value': 'Month', 'label': 'Monthly' });
            data.push({ 'value': 'Quarter', 'label': 'Quarterly' });
            data.push({ 'value': 'Year', 'label': 'Yearly' });
            break;
        default:
            break;
    }
    return data;
}
function toggleConfirmationEmail(elemSource, isAutoSave) {
    var confirmationEmailParent = $(elemSource).parents('.confirmation-enabled-box-inner');

    if (!$(confirmationEmailParent).hasClass('mode-active')) {
        setPaymentconfirmationEmailDisplay(true, elemSource);

    }
    else {
        setPaymentconfirmationEmailDisplay(false, elemSource);
        toggleEmailBody(elemSource, false);
    }

}
function setPaymentconfirmationEmailDisplay(confirmationEnabled, elemSource) {
    var confirmationEmailParent = $(elemSource).parents('.confirmation-enabled-box-inner');

    if (confirmationEnabled) {
        $(confirmationEmailParent).find('.confirmation-enabled-status').html('enabled');
        $(confirmationEmailParent).addClass('mode-active');
        $(confirmationEmailParent).parent('.email-to-fields-wrapper').find('.email-to-fields-wrapper-sub').removeClass('display-none');
        $(confirmationEmailParent).parents('.accordion-wrapper').find('[data-email="email_enabled_icon"]').addClass('email_enabled_icon');

    }
    else {
        $(confirmationEmailParent).find('.confirmation-enabled-status').html('disabled');
        $(confirmationEmailParent).removeClass('mode-active');
        $(confirmationEmailParent).parent('.email-to-fields-wrapper').find('.email-to-fields-wrapper-sub').addClass('display-none');
        $(confirmationEmailParent).parents('.accordion-wrapper').find('[data-email="email_enabled_icon"]').removeClass('email_enabled_icon');
    }
}
function setEmailStructureField(element) {
    // email_struc=enable+'&'+email_from+'&'+email_to+'&'+email_cc+'&'+email_bcc;

    var enable;
    var email_cc = '';
    var email_bcc = '';
    var email_to = '';
    var email_from = '';

    enabled = $(element).parents('.email-to-fields-wrapper').find('.confirmation-enabled-box-inner').hasClass('mode-active');
    email_cc = $(element).parents('.email-to-fields-wrapper').find('[data-email="email_cc"]').val();
    email_bcc = $(element).parents('.email-to-fields-wrapper').find('[data-email="email_bcc"]').val();
    email_to = $(element).parents('.email-to-fields-wrapper').find('[data-email="email_to"]').val();
    email_from = $(element).parents('.email-to-fields-wrapper').find('[data-email="email_from"]').val();

    var dataObj = { "email_enabled": enabled, "email_cc": email_cc, "email_bcc": email_bcc, "email_to": email_to, "email_from": email_from };

    $(element).parents('.email-to-fields-wrapper').find('.el-struc-email').val(JSON.stringify(dataObj));

}
var PaymentAccountDetailsDTO = {
    paymentAccountId :'',
    cardinalAPIIdentifier:'',
    cardinalAPIKey:'',
    CardinalMerchantId:'',
    cardinalOrgUnitId: '',
    cardinalProcessorId:'',
    isSandbox:'',
    accountType:'',
    name : '',
    password:'',
    userName:'',
    signature:'',
};


