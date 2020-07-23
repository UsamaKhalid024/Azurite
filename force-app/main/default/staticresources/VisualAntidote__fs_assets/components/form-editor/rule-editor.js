function parseXMLForJSON(resultXML) {
    var xmlstr = $('<div/>').html(resultXML).text();

    xmlstr = '<root>' + xmlstr + '</root>';
    var xmlDocElement = getXmlElementFromStr(xmlstr);
    jsonFieldsData = returnJson(xmlDocElement.getElementsByTagName("ffPage"));

    $('.pnlFormainRuleRepeaterCSS select.select-if-first-select').each(function(i, selectelement) {
        resetOperatorAndFilter(selectelement, false);
    });
    $('.pnlFormainRuleRepeaterCSS .sfff-then-block-rule-statement-').each(function(i, selectelement) {
        resetThenOperatorAndFilter(selectelement, false);
    });

    $('.sfff-rule-box-container- ').each(function(i, ruleElem) {
        var numIfs = $(ruleElem).find('.sfff-if-block-rule-statement-').size();
        var numActions = $(ruleElem).find('.sfff-then-block-rule-statement-').size();
        if (numIfs == 1) {
            $(ruleElem).find('.sfff-if-block-rule-statement-').eq(0).find('.sfff-rule-delete').hide();
        }
        if (numActions == 1) {
            $(ruleElem).find('.sfff-then-block-rule-statement-').eq(0).find('.sfff-rule-then-delete').hide();
        }
    });


}

function returnJson(pageElems) {
    var data = [];
    var returnstr = '';
    $.each(pageElems, function(index, pageElem) {
        var sectionElements = xmlDoc.getElementsByTagName("OSection");
        $.each(sectionElements, function(index, sectionElement) {

            var fieldElementList = sectionElement.getElementsByTagName("fieldList");
            if (fieldElementList.length > 0) {
                var fieldElement = fieldElementList[0];


                $.each(fieldElement.getElementsByTagName("OField"), function(index, item) {

                    if (item.childNodes.length > 0) {
                        var label = '';
                        var elemid = '';
                        var name = '';
                        var datatype = '';
                        var picklistvalues = [];
                        var listViewObject = '';
                        var lookupTypeObjects = '';
                        var recordTypeObject = '';
                        $.each(item.getElementsByTagName("label"), function(index, subitem) {

                            label = $(subitem).text();
                        });
                        $.each(item.getElementsByTagName("elemId"), function(index, subitem) {

                            elemid = $(subitem).text();
                        });
                        $.each(item.getElementsByTagName("name"), function(index, subitem) {

                            name = $(subitem).text();
                        });
                        $.each(item.getElementsByTagName("vatt"), function(index, subitem) {

                            datatype = $(subitem).text();
                        });
                        $.each(item.getElementsByTagName("listViewObject"), function(index, subitem) {

                            listViewObject = $(subitem).text();
                        });
                        /*Legacy code starts: vaObj is deprecated*/
                        if(!isNullOrEmpty(listViewObject) && item.getElementsByTagName("vaObj").length>0){
                            $.each(item.getElementsByTagName("vaObj"), function(index, subitem) {
                                listViewObject = $(subitem).text();
                            });
                        }
                        /*Legacy code ends */
                        $.each(item.getElementsByTagName("ltypeObj"), function(index, subitem) {
                            lookupTypeObjects = $(subitem).text();
                        });
                        $.each(item.getElementsByTagName("rtypeObj"), function(index, subitem) {
                            recordTypeObject = $(subitem).text();
                        });

                        $.each(item.getElementsByTagName("picklistValues"), function(index, subitem) {
                            if (subitem.childNodes.length > 0) {
                                $.each(subitem.getElementsByTagName("picklistValue"), function(i, valueitem) {
                                    var picklistvalue = $(valueitem).attr('value');
                                    var ignoreItem = getSafeBoolean($(valueitem).attr('ignore'), false);
                                    if (!ignoreItem && !isNullOrEmpty(picklistvalue)) {
                                        picklistvalues.push(picklistvalue);
                                    }

                                });
                            }
                        });
                        data.push(createJSONFieldObj(label, elemid, name, datatype, picklistvalues, listViewObject, lookupTypeObjects, recordTypeObject));
                    }
                });
            }

        });
    });

    return data;
}

function getDataTypeByElemId(elementid) {
    var returnstr = '';
    $.each(jsonFieldsData, function(index, jsonitem) {
        if (jsonFieldsData[index].elemId == elementid) {
            returnstr = '' + jsonFieldsData[index].datatype;
        }
    });
    return returnstr;
}

function getFieldValueByFieldName(elementid, tagname) {
    var returnstr = '';
    $.each(jsonFieldsData, function(index, jsonitem) {
        if (jsonFieldsData[index].elemId == elementid) {
            returnstr = jsonFieldsData[index][tagname];
        }
    });
    return returnstr;
}

function createJSONFieldObj(label, elemId, name, dataType, picklistValues, listViewObject,lookupTypeObjects, rectypeobj) {
    var dataobj = {
        "label": label,
        "elemId": elemId,
        "name": name,
        "datatype": dataType,
        "picklistvalues": picklistValues,
        "listViewObject": listViewObject,
        "lookupTypeObjects": lookupTypeObjects,
        "recordTypeObject": rectypeobj
    };


    return dataobj;
}

function switchFieldsDynamicStatic(elem, targetDynamicOrStatic) {
    if (targetDynamicOrStatic == 'dynamic') {
        $(elem).parents('.rule-st-3').removeClass("static-field");
        $(elem).parents('.rule-st-3').addClass("dynamic-field");
        $(elem).parent().addClass('display-none');
        $(elem).parents('.rule-st-3').find('.sfff-rule-st-existing-field-box').removeClass('display-none');

    } else {

        $(elem).parents('.rule-st-3').removeClass("dynamic-field");
        $(elem).parents('.rule-st-3').addClass("static-field");
        $(elem).parent().addClass('display-none');
        $(elem).parents('.rule-st-3').find('.sfff-rule-st-static-value-box').removeClass('display-none');

    }
}

function switchFieldsThenDynamicStatic(elem, targetDynamicOrStatic) {
    if (targetDynamicOrStatic == 'dynamic') {
        $(elem).parents('.rule-st-3').removeClass("static-field");
        $(elem).parents('.rule-st-3').addClass("dynamic-field");
        $(elem).parent().addClass('display-none');
        $(elem).parents('.rule-st-3').find('.sfff-rule-then-existing-field-box').removeClass('display-none');

    } else {

        $(elem).parents('.rule-st-3').removeClass("dynamic-field");
        $(elem).parents('.rule-st-3').addClass("static-field");
        $(elem).parent().addClass('display-none');
        $(elem).parents('.rule-st-3').find('.sfff-rule-then-static-value-box').removeClass('display-none');

    }
}

function DeleteRule(elemSource) {
    var delId = $(elemSource).parents('.sfff-rule-box-container-').attr('id');
    if (!isNullOrEmpty(delId)) {
        delId = delId.replace('sfff-rule-', '');
        console.log('FORM Rule id to be deleted- ' + delId);
        $("#dialog-confirm").html("<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>Are you sure you want to delete this rule?<br /><br /></div><div class='secondary'>This action cannot be undone.</div></div>");
        // Define the Dialog and its properties.
        $("#dialog-confirm").dialog({
            resizable: false,
            modal: true,
            title: "Save",
            height: "auto",
            width: 413,
            buttons: {
                "Yes": {
                    click: function() {
                        $(this).dialog('close');
                        callback(true);
                    },
                    text: 'Yes',
                    'class': 'vabutton1'
                },
                "No": {
                    click: function() {
                        $(this).dialog('close');
                        callback(false);
                    },
                    text: 'No',
                    'class': 'vabutton2'
                }
            },

            open: function(event, ui) {
                $('.ui-dialog :button').blur();
            }
        });
        $('.ui-dialog :button').blur();
        $('#dialog-confirm').dialog('option', 'position', 'center');

        function callback(value) {
            if (value) {
                remoteDeleteRuleJS(delId);
            }
        }
    }

}
//need to be improve we are re-structure DDL 3 times
/*this is the main function to reset style and show hide elements of then Condition block of particular rule called on rule editor load as well as onchange of then action select options*/
function resetThenOperatorAndFilter(mainThenConditionElem, isAutoSave) {
    var elemSource;

    // Call stack from UI Page
    if(mainThenConditionElem instanceof jQuery == false){
        mainThenConditionElem = $(mainThenConditionElem);
    }

    if($(mainThenConditionElem).is('select.select-then-fields-action')){
        elemSource = $(mainThenConditionElem);
    }else if($(mainThenConditionElem).is('.sfff-then-block-rule-statement-')){
        elemSource = $(mainThenConditionElem).find('select.select-then-fields-action');
    }

    // Call stack from UI Page
    if($(mainThenConditionElem).is('.sfff-then-block-rule-statement-') == false){
        mainThenConditionElem = $(mainThenConditionElem).parents('.sfff-then-block-rule-statement-');
    }

    removeOnChangeBlur_CallSaveRule_elements(mainThenConditionElem);
    resetOptionsForRepeatedFieldRule(elemSource, isAutoSave);
    if (!isAutoSave) {
        populateBlockSelect(mainThenConditionElem, false);
    }
    var selectedelement = $(elemSource).val();
    if (selectedelement == 'displaymessage') {
        $(mainThenConditionElem).find(".sfff-rule-then-field-list").addClass('display-none');
        $(mainThenConditionElem).find(".rule-st-2").find('.sfff-rule-then-show-error-msg').removeClass("display-none");

    } else {
        hideBlock($(mainThenConditionElem).find(".rule-st-2").find('.sfff-rule-then-show-error-msg'));
        showBlock($(mainThenConditionElem).find('.sfff-rule-then-field-list'));
        if(selectedelement!='setpicklistvalues'){
            hideBlock($(mainThenConditionElem).find('.sfff-rule-then-setpicklistoptions'));
        }

        switch(selectedelement){
            case 'populate':
                populateThenFields($(mainThenConditionElem).find(".rule-st-2"), $(mainThenConditionElem).find(".rule-st-3"), selectedelement, false);
                //Break missing on purpose to perform the next case's actions:
            case 'readonly': case 'required': case 'notrequired':
                toggleThenSections(mainThenConditionElem, false, selectedelement);
            break;
            case 'setpicklistvalues':
                showBlock($(mainThenConditionElem).find('.sfff-rule-then-setpicklistoptions'));
                toggleThenPicklistFieldsOnly(mainThenConditionElem);
                populateThenPicklistFields($(mainThenConditionElem).find(".rule-st-2"), $(mainThenConditionElem).find(".rule-st-3"), selectedelement, false);
            break;
            default:
                toggleThenSections(mainThenConditionElem, true, selectedelement);
            break;
        }
    }
    if(selectedelement!='populate'){
        hideBlock($(mainThenConditionElem).find('.sfff-rule-then-populate-field'));
    }

    $(mainThenConditionElem).find("select.select-color-").each(function(indx, selectTobeColored) {
        setSelectColorTag(selectTobeColored);
    });

    callSaveRule(elemSource, isAutoSave);
    setOnChangeBlur_CallSaveRule_elements(mainThenConditionElem);
}

function setOnChangeBlur_CallSaveRule_elements(e){
    e.find(".onChangeCallSaveRule").change(function(){callSaveRule(this,true);return false;});
    e.find(".blurCallSaveRule").blur(function(){
        //See populateThenValueFields() for the listener for fields with datepicker. It's blocked here for duplicate functionality if the widget is active.
        if(this.className.indexOf('hasDatepicker') == -1 || window['ui-datepicker-div'].style.display == 'none'){
            callSaveRule(this, true);
        }
        return false;
    });
}
function removeOnChangeBlur_CallSaveRule_elements(e){
   e.find(".onChangeCallSaveRule").off('change');
   e.find(".blurCallSaveRule").off('blur');
                                            
}
/* to enable/disable sections and general fields for select element accordingly */
function toggleThenSections(mainThenConditionElem, enableSectionsAndPages, selectedelement) {
    var resetSelect = false;
    $(mainThenConditionElem).find(".rule-st-2").find('select.select-then-fields  optgroup').each(function(indx, optgroup) {
        if (!$(optgroup).hasClass('repeat-disabled')) {
            if ($(optgroup).attr("label").indexOf("Section") == 0 || $(optgroup).attr("label").indexOf("Pages") == 0) {
                if (enableSectionsAndPages) {
                    $(optgroup).removeClass('display-none');
                } else {
                    if (!$(optgroup).hasClass('display-none')) {
                        $(optgroup).addClass('display-none');
                    }
                }
            }
            $(optgroup).find('option').each(function(indx, optionelem) {
                $(optionelem).removeAttr('disabled');
                $(optionelem).removeClass('display-none');
                if ($(optionelem).attr("name") == "section-item" || isGeneralFieldElement($(optionelem).val(),['PAYMENT','ESIGNATURE','CAPTCHA','GENERALTEXT']) ) {
                    if (enableSectionsAndPages) {
                        $(optionelem).removeAttr('disabled');
                        if (isGeneralFieldElement($(optionelem).val(),['PAYMENT','ESIGNATURE','CAPTCHA','GENERALTEXT']) && $(optionelem).hasClass('display-none')) {
                            $(optionelem).removeClass('display-none');
                        }

                    } else {

                        if (isGeneralFieldElement($(optionelem).val()) && ((!$(optionelem).hasClass('display-none')) || $(optionelem).is(':disabled'))) {
                            $(optionelem).addClass('display-none');
                            $(optionelem).attr('disabled', 'disabled');
                        }
                        if ($(optionelem).is(':selected')) {
                            console.log(' Selected option removed' + $(optionelem).val());
                            $(optionelem).removeAttr("selected");
                            resetSelect = true;
                        }
                    }

                }
                //hide File upload when 'Then -> required/not required/hide/show' are not selected 
                else if (hideFieldBasedOnSelectedElement($(optionelem).val(),selectedelement)){
                
                    $(optionelem).addClass('display-none');
                    $(optionelem).attr('disabled', 'disabled');
                
                    if ($(optionelem).is(':selected')) {
                        console.log('Selected option removed' + $(optionelem).val());
                        $(optionelem).removeAttr("selected");
                        resetSelect = true;
                    }
                }
            });
        }
    });

    if (resetSelect) {
        var selectElement = $(mainThenConditionElem).find(".rule-st-2").find('select.select-then-fields');
        var firstvalue = $(mainThenConditionElem).find(".rule-st-2").find('select.select-then-fields optgroup').children(':enabled:first').val();
        console.log(' First value-' + firstvalue);
        $(selectElement).select2("val", firstvalue);
    } else {
        $(mainThenConditionElem).find(".rule-st-2").find('select.select-then-fields').select2();
    }
}

// used to show some specific field based on selected element Then XXX|----|----
// ex show payment with hide/show and hide payment with populate
function hideFieldBasedOnSelectedElement(fieldTypeValue, selectedElement){
    var isHide = false;
    selectedElement = selectedElement.toUpperCase();
    fieldTypeValue = fieldTypeValue.toUpperCase();

    if(selectedElement == 'POPULATE'){
        if((fieldTypeValue.indexOf('FILEUPLOADAREA') > -1 || isPaymentField(fieldTypeValue) || fieldTypeValue.indexOf('ESIGNATURE') > -1 || fieldTypeValue.indexOf('CAPTCHA') > -1 || fieldTypeValue.indexOf('IMAGE') > -1)){
            isHide = true;
        }
    }else if ((selectedElement =='SETPICKLISTVALUES') && fieldTypeValue.indexOf('FILEUPLOADAREA') > -1) {
        isHide = true;
    }

    return isHide;
}

function toggleThenPicklistFieldsOnly(mainThenConditionElem) {
    var resetSelect = false;


    $(mainThenConditionElem).find(".rule-st-2").find('select.select-then-fields  optgroup').each(function(indx, optgroup) {
        if ($(optgroup).attr("label").indexOf("Section") == 0 || $(optgroup).attr("label").indexOf("Pages") == 0) {
            $(optgroup).addClass('display-none');
        }
        $(optgroup).find('option').each(function(indx, optionelem) {

            if (!isSingleOrMultiPicklistElement($(optionelem).val())) {


                $(optionelem).attr('disabled', 'disabled');
                if (!isSingleOrMultiPicklistElement($(optionelem).val()) && (!$(optionelem).hasClass('display-none'))) {
                    $(optionelem).addClass('display-none');
                }
                if ($(optionelem).is(':selected')) {

                    $(optionelem).removeAttr("selected");
                    resetSelect = true;
                }


            }
        });
    });

    if (resetSelect) {
        var selectElement = $(mainThenConditionElem).find(".rule-st-2").find('select.select-then-fields');
        var firstvalue = $(mainThenConditionElem).find(".rule-st-2").find('select.select-then-fields optgroup').children(':enabled:first').val();
        console.log(' First value-' + firstvalue);
        $(selectElement).select2("val", firstvalue);
    } else {
        $(mainThenConditionElem).find(".rule-st-2").find('select.select-then-fields').select2();
    }


}


/**
 *
 *
 * @param {*} elementvalue
 * @param {*} option : '' => include all , PAYMENT => skip payment from general field, ALL => skip all
 * ALL, '', GENERALTEXT, CAPTCHA, PAYMENT, ESIGNATURE
 * @returns
 */
function isGeneralFieldElement(elementValue, option) {
    //FileUpload is not include in the logic because we are showing it when we select 'THEN -> required/not required/hide/show'
    // return false to show General field in the DDL 
    var elemValue = elementValue.toUpperCase();

    var GeneralFieldElement = ['GENERALTEXT', 'CAPTCHA', 'ESIGNATURE', 'PAYMENT'];
    var index;
    // If we check the field is a General field from the begin of the method it will skip all non-general fields from running indexOf 
    // as we know we only will loop on 4 elements from the Array 
    // if we don't filter on General fields before find indexOf <6 times that will increase the performance to find indexOf non-general fields 

    var isGeneralField = false;
    for (index = 0; index < 4; index++){
        if(elemValue.indexOf(GeneralFieldElement[index]) == -1){
            continue;
        }else{
            isGeneralField = true;
            break;
        }
    }
    if(isGeneralField==false){
        return false;
    }


    var isOptionDefined = typeof option !== "undefined" ;
    var isGeneral = false;
    option = isOptionDefined == false ? [] : option;

    if (isOptionDefined && option.indexOf('ALL') >= 0) {
        isGeneral = false;
        return isGeneral;
    }

    if (elemValue !== "undefined" ) {
        if (elemValue.indexOf('GENERALTEXT') == 0 &&  option.indexOf('GENERALTEXT') == -1) {
            isGeneral = true;
        } else if (elemValue.indexOf('CAPTCHA') == 0 && option.indexOf('CAPTCHA') == -1) {
            isGeneral = true;
        } else if (elemValue.indexOf('ESIGNATURE') == 0 && option.indexOf('ESIGNATURE') == -1) {
            isGeneral = true;
        } else if ( 
            (isPaymentField(elemValue) &&
            option.indexOf('PAYMENT') == -1))
        {
            isGeneral = true;
        }
    }

    return isGeneral;
}

function isPaymentField(fieldType) {
    if ((fieldType.indexOf('PAYPALPAYMENT') == 0 || fieldType.indexOf('IATSPAYMENT') == 0 ||
            fieldType.indexOf('STRIPEPAYMENT') == 0 || fieldType.indexOf('AUTHORIZENETPAYMENT') == 0)) {
        return true;
    } else {
        return false;
    }
}
function isHideFileUpLoadElement(elementvalue, elemSource) {
    var elemValue = elementvalue.toUpperCase();
    var isHide = false;
    if (!isNullOrEmpty(elemValue)) {
        if (elemValue.indexOf('FILEUPLOADAREA') == 0 && (elemSource == 'populate' || elemSource =='setpicklistvalues')) {
            isHide = true;
        }
    }
    return isHide;
}

function isSingleOrMultiPicklistElement(elementvalue) {
    var fieldid = elementvalue;
    var vattDatatype = 'STRING';
    vattDatatype = getFieldValueByFieldName(fieldid, "datatype");
    if (vattDatatype.indexOf('(') > 0) {
        vattDatatype = vattDatatype.substring(0, vattDatatype.indexOf('(')).trim();
    }
    var ispicklist = false;
    if (vattDatatype.toUpperCase() == 'PICKLIST' || vattDatatype.toUpperCase() == 'MULTIPICKLIST') {
        ispicklist = true;
    }
    return ispicklist;
}
/* General helper function*/

function hideBlock(mainElem) {
    if (!$(mainElem).hasClass('display-none')) {
        $(mainElem).addClass("display-none");
    }
}
/* General helper function*/
function showBlock(mainElem) {
    $(mainElem).removeClass("display-none");
}

function hasSetValueOption(ThenValue){

    if(ThenValue==='setpicklistvalues' || ThenValue==='populate')
    {
         return true;
    }
}
function resetOptionsForRepeatedFieldRule(elemSource, isAutoSave) {

        var isIFRepeatEnabled = false;
        var repeatClass = '';
        var ruleMainParent;
        var ruleIfParent = $(elemSource).parents('.sfff-rule-box-if-block');
        if (ruleIfParent.length == 0) {
            var ruleThenParent = $(elemSource).parents('.sfff-rule-box-then-block');
            if (ruleThenParent.length > 0) {
                ruleIfParent = $(ruleThenParent).parent().find('>.sfff-rule-box-if-block').first();
            }
        }
        ruleMainParent = $(ruleIfParent).parent();
        $(ruleMainParent).find('.sfff-if-block-rule-statement- .rule-st-1 select.select-elem').each(function(indx, selectElem) {
            if ($(selectElem).find('option:selected').parent().hasClass('repeat')) {
                isIFRepeatEnabled = true;
                var selectedVal = $(selectElem).val();
                if (!isNullOrEmpty(selectedVal) && selectedVal.split('.').length == 4) {
                    repeatClass = selectedVal.split('.')[2];
                }
            }
        });

        var blockSelector=[];

        // select block and go thought it row by row 
        if($(elemSource).hasClass('select-then-fields-action'))
        {
            //update Then -----|------|xxxxxx
            blockSelector.push($(ruleMainParent).find('.sfff-then-block-rule-statement-'));

        }else if($(elemSource).hasClass('select-if-first-select'))
        {
            //update IF -----|------|xxxxxx
            blockSelector.push($(ruleMainParent).find('.sfff-if-block-rule-statement-'));

            //update Then -----|------|xxxxxx or/and //Then -----|xxxxxx|-------
            blockSelector.push($(ruleMainParent).find('.sfff-then-block-rule-statement-'));
        }
    // isAutoSave is true when a call root is an Event 'OnChange' or if it's repeated 
    if(isAutoSave || isIFRepeatEnabled){
        console.log($(elemSource).attr("class"));
        while(blockSelector.length!=0){
            blockSelectorValue = blockSelector.pop();
            var $blocksSelectorValueThen = $(blockSelectorValue);
            var blockSelectorValueThenLength = $blocksSelectorValueThen.length;
            var blockSelectorValueThenIndex;
            for( blockSelectorValueThenIndex = 0 ; blockSelectorValueThenIndex < blockSelectorValueThenLength ; blockSelectorValueThenIndex++){
                var thenRow = $blocksSelectorValueThen[blockSelectorValueThenIndex];
                
                resetThenRow(thenRow, isIFRepeatEnabled, repeatClass);
                
            };
    
        }
    
    }
    
}

function resetThenRow(thenRow, isIFRepeatEnabled, repeatClass){
    var selectedVal = $(thenRow).find('option:selected').val();

    var selector='';

    if(thenRow.className.indexOf('sfff-then-block-rule-statement-')){

        var $operatorSelect = $(thenRow).find('.rule-st-1 select.select-elem');
        if(hasSetValueOption(selectedVal)){
            //update Then -----|------|xxxxxx
            selector=  $(thenRow).find('.rule-st-2 select.select-elem,.rule-st-3 select.select-elem');
        }else
        {   //update Then -----|xxxxxx|-------
            selector=  $(thenRow).find('.rule-st-2 select.select-elem');
        }
    }else if($(thenRow).hasClass('sfff-if-block-rule-statement-'))
    {   //update IF -----|------|xxxxxx
        selector=  $(thenRow).find('.rule-st-3 select.select-elem')
    }
    var $selector = $(selector);
    var selectIndex, selectorLength; 
    selectorLength = $selector.length;
    for( selectIndex = 0; selectIndex < selectorLength ; selectIndex++){
        

        var selectElem = $selector[selectIndex];
        resetThenRowOptionGroup(selectElem, isIFRepeatEnabled, repeatClass, selectedVal);

    };

    var $operatorSelectOptions = $($operatorSelect).find('option');
    var operatorSelectOptionsLength  =  $operatorSelectOptions.length;
    for( selectIndex = 0 ; selectIndex < operatorSelectOptionsLength ; selectIndex++){
        
        var optionelem = $operatorSelectOptions[selectIndex];
        $(optionelem).removeAttr('disabled');
        $(optionelem).removeClass('display-none');
            if (isIFRepeatEnabled && $(optionelem).val() == "displaymessage") {
                $(optionelem).attr('disabled');
                $(optionelem).addClass('display-none');
                if ($(optionelem).is(':selected')) {
                    $(optionelem).removeAttr("selected");
                    resetSelectoption(true, $operatorSelect);
                }
            } else {

            $(optionelem).removeAttr('disabled', 'disabled');
            $(optionelem).removeClass('display-none');

        }      

    };


}
function resetSelectoption(resetSelect, selectElem){
    if (resetSelect) {
        var firstvalue;
        if($(selectElem).is('select')){
            firstvalue = $(selectElem).children(':enabled:first').val();
        }else{
            firstvalue = $(selectElem).find('optgroup').children(':enabled:first').val();
        }
        $(selectElem).select2("val", firstvalue);
    } else {
        $(selectElem).select2();
    }
}
function resetThenRowOptionGroup(selectElem, isIFRepeatEnabled, repeatClass, selectedVal){

    resetSelect = false;
    var $optGroups = $(selectElem).find('optgroup');
    var optGroupsLength = $optGroups.length;
    var optgroupIndex;
    for(optgroupIndex = 0 ; optgroupIndex < optGroupsLength ; optgroupIndex++){
        
        var optGroup = $optGroups[optgroupIndex];     
        resetSelect = resetThenRowOptionGroupOptions(optGroup, isIFRepeatEnabled, repeatClass, selectedVal);

    };
    resetSelectoption(resetSelect, selectElem);
    return resetSelect;
}

function resetThenRowOptionGroupOptions(optGroup, isIFRepeatEnabled, repeatClass, selectedVal){
    var resetSelect = false;
    if(!isIFRepeatEnabled){
        $(optgroup).removeAttr('disabled');
        $(optgroup).removeClass('display-none');
        $(optgroup).removeClass('repeat-disabled');

    }
    else if (optgroup.className.indexOf('repeat') && optgroup.className.indexOf(repeatClass) && isIFRepeatEnabled) {
        $(optgroup).removeClass('repeat-disabled');
        $(optgroup).removeClass('display-none');
    } 
    else if (isIFRepeatEnabled) {
        if (!$(optgroup).hasClass('display-none')) {
            $(optgroup).addClass('display-none');
            $(optgroup).addClass('repeat-disabled');
        }
    }

    var $optgroupOption = $(optgroup).find('option');
    var $optionelemParentClass = $optgroupOption.parent();
    var optgroupOptionIndex;
    var optgroupOptionLength = $optgroupOption.length;
    for(optgroupOptionIndex = 0 ; optgroupOptionIndex < optgroupOptionLength ; optgroupOptionIndex++){
    
        var optionelem = $optgroupOption[optgroupOptionIndex];
        var optionValue = $(optionelem).val();
        if (!isGeneralFieldElement(optionValue,['PAYMENT','ESIGNATURE','GENERALTEXT'])) {
            $(optionelem).removeAttr('disabled');
            $(optionelem).removeClass('display-none'); 
        
            if(isHideFileUpLoadElement(optionValue,selectedVal) ){
                $(optionelem).addClass('display-none');
                $(optionelem).attr('disabled', 'disabled');
            }
        }
        if ($optionelemParentClass[0].className.indexOf('repeat') && $optionelemParentClass[0].className.indexOf(repeatClass) && isIFRepeatEnabled) {
            $(optionelem).removeAttr('disabled');
            $(optionelem).removeClass('display-none');

        }else if (isIFRepeatEnabled) {
            $(optionelem).attr('disabled', 'disabled');

            if ($(optionelem).is(':selected')) {
                $(optionelem).removeAttr("selected");
                resetSelect = true;
            }
        }
        if(!isIFRepeatEnabled && optionValue.toUpperCase().indexOf('FILEUPLOADAREA') != -1 && selectedVal == 'readonly'){
            $(optionelem).removeAttr('disabled');
            $(optionelem).removeClass('display-none');
        }

    };

    return resetSelect;
}

/*this is the main function to reset style and show hide elements of If Condition block of particular rule called on rule editor load as well as onchange of If first  select options*/
function resetOperatorAndFilter(elemSource, isAutoSave) {
    var selectedelemenid = $(elemSource).val();

    var mainConditionElem = $(elemSource).parents('.sfff-if-block-rule-statement-');
    removeOnChangeBlur_CallSaveRule_elements(mainConditionElem);

    var ruleXml = "";


    if (!isAutoSave) {

        populateBlockSelect(mainConditionElem, true);
    }


    //  console.log(' selected value '+selectedelemenid);
    var datatype = getFieldValueByFieldName(selectedelemenid, "datatype");
    console.log(' selected datatype ' + datatype);
    if (datatype.indexOf('(') > 0) {
        datatype = datatype.substring(0, datatype.indexOf('(')).trim();
    }
    var validCSVoperators = getValidOperators(datatype);
    resetSelectOperatorList(mainConditionElem, validCSVoperators);

    populateValueFields($(mainConditionElem).find(".rule-st-3"), selectedelemenid, datatype, isAutoSave);


    $(mainConditionElem).find("select.select-color-").each(function(indx, selectTobeColored) {
        setSelectColorTag(selectTobeColored);
    });
    resetOptionsForRepeatedFieldRule(elemSource, isAutoSave);
    callSaveRule(elemSource, isAutoSave);
    setOnChangeBlur_CallSaveRule_elements(mainConditionElem);

}
/*return colortag (A,B,C) based on the select element's option selected*/
function getSelectedOptionColorTag(elemsource) {
    var colortag = '';
    var selected = $("option:selected", elemsource);
    if (selected.attr("value") !== undefined) {
        var optionValueToArr = selected.attr("value").split('.');
        if (optionValueToArr.length = 4) {
            colortag = optionValueToArr[2];
        }
        var isRepeat = false;
        if ($(selected).parents('.FieldOption').length > 0 && $(selected).parents('.FieldOption').hasClass('repeat')) {
            isRepeat = true;
            colortag += ' repeat';
        }

    }
    return "select2-choice color-tag " + colortag;
}
/* reset selectoperator list - second select element in if block- according to the datatype of first select element of if condition block */
function resetSelectOperatorList(mainConditionElem, validCSVoperators) {
    var resetSelect = false;
    $(mainConditionElem).find(".rule-st-2 .select-elem > option").each(function(indx, optionelem) {
        $(optionelem).attr('disabled', 'disabled');

        for (var a in validCSVoperators) {
            var variable = validCSVoperators[a];
            if ($(optionelem).val() == variable) {
                $(optionelem).removeAttr('disabled');
            } else {

            }
        }
        var disableAttr = $(optionelem).attr('disabled');
        if (typeof disableAttr !== typeof undefined && disableAttr !== false) {
            if ($(optionelem).is(":selected")) {
                $(optionelem).removeAttr('selected');
                resetSelect = true;
            }

        }

    });
    if (resetSelect) {
        /* set first option element if old selected options is disabled now*/
        var selectElement = $(mainConditionElem).find(".rule-st-2").find('select.select-elem');
        var firstvalue = $(mainConditionElem).find(".rule-st-2").find('select.select-elem').children(':enabled:first').val();
        $(selectElement).select2("val", firstvalue);
    }


}

function populateThenPicklistFields(mainRuleStSecondElement, mainRuleStThirdElement, selectedelemen, isAutoSave) {

    $(mainRuleStThirdElement).find('.sfff-rule-then-populate-field').addClass("display-none");
    $(mainRuleStThirdElement).find('.sfff-rule-then-setpicklistoptions').removeClass("display-none");
    var selectTargetFieldelement = $(mainRuleStSecondElement).find('select.select-then-fields');
    populateThenValueFields(selectTargetFieldelement, isAutoSave);
    if ($(mainRuleStThirdElement).hasClass('dynamic-field')) {
        populateThenDynamicFields(mainRuleStThirdElement);
    }

}

function populateThenFields(mainRuleStSecondElement, mainRuleStThirdElement, selectedelemen, isAutoSave) {

    $(mainRuleStThirdElement).find('.sfff-rule-then-populate-field').removeClass("display-none");
    $(mainRuleStThirdElement).find('.sfff-rule-then-setpicklistoptions').addClass("display-none");

    hideBlock($(mainRuleStThirdElement).find('.sfff-rule-then-populate-field .sfff-rule-then-existing-field-box'));
    var selectTargetFieldelement = $(mainRuleStSecondElement).find('select.select-then-fields');
    populateThenValueFields(selectTargetFieldelement, isAutoSave);


    if ($(mainRuleStThirdElement).hasClass('dynamic-field')) {
        populateThenDynamicFields(mainRuleStThirdElement);
    }

}

function populateThenDynamicFields(ruleThirdElement) {

    hideBlock($(ruleThirdElement).find('.sfff-rule-then-static-value-box'));
    showBlock($(ruleThirdElement).find('.sfff-rule-then-existing-field-box'));
}

function populateThenValueFields(elemSource, isAutoSave) {
    var isSetPicklist = false;
    var mainThenConditionElem = $(elemSource).parents('.sfff-then-block-rule-statement-');
    var mainRuleStFirstElement = $(mainThenConditionElem).find(".rule-st-1");
    var actionVal = $(mainRuleStFirstElement).find('select.select-then-fields-action').val();
    if (!isNullOrEmpty(actionVal) && actionVal == 'setpicklistvalues') {
        isSetPicklist = true;
    }
    var selectedelemenid = $(elemSource).val();
    var parentRuleColumn = $(elemSource).parents(".rule-st-2");
    var colortag = getSelectedOptionColorTag(elemSource);
    $(parentRuleColumn).find("div.select2-container a.select2-choice").attr("class", colortag);

    var fieldid = $(elemSource).val();
    var vattDatatype = 'STRING';
    vattDatatype = getFieldValueByFieldName(fieldid, "datatype");
    if (vattDatatype.indexOf('(') > 0) {
        vattDatatype = vattDatatype.substring(0, vattDatatype.indexOf('(')).trim();
    }
    var mainRuleStThirdElement = $(mainThenConditionElem).find(".rule-st-3");
    $(mainRuleStThirdElement).find('.sfff-rule-then-populate-field .sfff-rule-then-static-value-box').find('input[type=textbox],input[type=text],input[type=checkbox],textarea,select,label.css-check-label').each(function(indx, htmlElem) {
        if (!$(htmlElem).hasClass('display-none')) {
            $(htmlElem).addClass("display-none");
        }
    });
    var textBoxStaticElement = $(mainRuleStThirdElement).find('.sfff-rule-then-populate-field .sfff-rule-then-static-value-box .sfff-textbox');
    $(mainRuleStThirdElement).find('.sfff-rule-then-populate-field .sfff-rule-then-static-value-box .sfff-then-value-field-wrapper a').hide();
    $(mainRuleStThirdElement).find('.sfff-rule-then-populate-field .sfff-rule-then-static-value-box .sfff-then-value-field-wrapper img').hide();
    if (isSetPicklist) {
        if (!isNullOrEmpty(fieldid)) {
            $(mainRuleStThirdElement).find('.sfff-rule-then-setpicklistoptions .sfff-rule-then-static-value-box .sfff-select-element').removeClass("display-none");
            var picklistValuesJSON = getFieldValueByFieldName(fieldid, "picklistvalues");
            var multiselectElement = $(mainRuleStThirdElement).find('.sfff-rule-then-setpicklistoptions .sfff-rule-then-static-value-box select.sfff-picklist-elem');
            if (picklistValuesJSON != '') {
                populatePicklist(multiselectElement, picklistValuesJSON, true, '.sfff-rule-then-static-value-box');
            }
        } else {
            $(mainRuleStThirdElement).find('.sfff-rule-then-setpicklistoptions .sfff-rule-then-static-value-box').addClass("display-none");
            var toggleElem = $(mainRuleStThirdElement).find('.sfff-rule-then-setpicklistoptions .sfff-rule-then-static-value-box   .toggle-field-behaviour-link-then');
            switchFieldsThenDynamicStatic(toggleElem, 'dynamic');
        }

    } else {
        /*populate field starts*/
        switch (vattDatatype) {
            case "STRING":
            case "EMAIL":
            case "URL":
            case "PHONE":
            case "NUMBER":
            case "PERCENT":
            case "CURRENCY":
            case "DECIMAL":
            case "DOUBLE":
            case "INTEGER":
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').removeClass("display-none");
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').datetimepicker("destroy");
                if (isAutoSave) {
                    $(textBoxStaticElement).val("");
                    $(textBoxStaticElement).attr("data-refId", "");
                }
                break;
            case "TEXTAREA":
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textarea').removeClass("display-none");      
                break;
            case "BOOLEAN":
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box label.css-check-label').removeClass("display-none");
                console.log(' checkbox class' + $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-value-field-box  .sfff-then-value-field-.sfff-checkbox').attr('class'));
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-value-field-box  .sfff-then-value-field-.sfff-checkbox').removeClass("display-none");

                if (!isAutoSave) {
                    var booleanValue = $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').val();
                    if (booleanValue != 'undefined' && booleanValue == 'true') {
                        $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-checkbox').prop('checked', true);
                    }
                }
                break;
            case "DATE":
            case "DATETIME":
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').datetimepicker("destroy");
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').removeClass("display-none");            
                if (isAutoSave) {
                    $(textBoxStaticElement).val("");
                    $(textBoxStaticElement).attr("data-refId", "");
                }
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').datetimepicker({
                    showTimepicker: vattDatatype == "DATETIME", //Only show this is we're using datetime.
                    yearRange: "-100:+100",
                    changeMonth: true,
                    changeYear: true,
                    onSelect:function(){
                        //We call the save rule here because the texbox blur listener accidentally is called before anything is changed.
                        callSaveRule(this, true);
                    }
                });
                break;
            case "PICKLIST":
            case "MULTIPICKLIST":
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-select-element').removeClass("display-none");
                var picklistValuesJSON = getFieldValueByFieldName(fieldid, "picklistvalues");
                var selectElement = $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box select.sfff-select-element');
                if (picklistValuesJSON != '') {
                    populatePicklist(selectElement, picklistValuesJSON, vattDatatype == 'MULTIPICKLIST', '.sfff-rule-then-static-value-box');
                }
                break;
            case "REFERENCE":
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').removeClass("display-none");
                console.log(' in reference class- display none removed ');
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-then-value-field-wrapper a').show();
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-then-value-field-wrapper img').show();
                var lookupTypeObjects = getFieldValueByFieldName(selectedelemenid, "lookupTypeObjects");
                var recTypeObj = getFieldValueByFieldName(selectedelemenid, "recordTypeObject");
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-then-value-field-wrapper a').bind("click", function() {
                    openLookupPopupForRule(this, lookupTypeObjects, recTypeObj);
                });
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').datetimepicker("destroy");
                if (isAutoSave) {
                    $(textBoxStaticElement).val("");
                    $(textBoxStaticElement).attr("data-refId", "");
                }
                break;
            default:
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').removeClass("display-none");
                $(mainRuleStThirdElement).find('.sfff-rule-then-static-value-box .sfff-textbox').datetimepicker("destroy");
                if (isAutoSave) {
                    $(textBoxStaticElement).val("");
                    $(textBoxStaticElement).attr("data-refId", "");
                }
                break;
        } /*switch statement ends*/
    } /*populate field ends*/
    callSaveRule(elemSource, isAutoSave);
}

function populateValueFields(mainRuleStThirdElement, fieldid, vattDatatype, isAutoSave) {
    $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box').find('input[type=textbox],input[type=text],input[type=checkbox],textarea,select,label.css-check-label').each(function(indx, htmlElem) {
        /*initially hide all elements in static value block*/
        if ($(htmlElem).hasClass('display-none')) {} else {

            $(htmlElem).addClass("display-none");
        }
    });
    var textBoxStaticElement = $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox');
    $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-st-value-field-wrapper a').hide();
    $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-st-value-field-wrapper img').hide();

    switch (vattDatatype) {
        case "STRING":
        case "EMAIL":
        case "URL":
        case "PHONE":
        case "NUMBER":
        case "PERCENT":
        case "CURRENCY":
        case "DECIMAL":
        case "DOUBLE":
        case "INTEGER":
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').removeClass("display-none");

            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').datetimepicker("destroy");

            if (isAutoSave) {
                $(textBoxStaticElement).val("");
                $(textBoxStaticElement).attr("data-refId", "");
            }
            break;
        case "TEXTAREA":
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textarea').removeClass("display-none");
            break;
        case "BOOLEAN":
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-checkbox,.sfff-rule-st-static-value-box label.css-check-label').removeClass("display-none");
            if (!isAutoSave) {
                var booleanValue = $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').val();
                if (booleanValue != 'undefined' && booleanValue == 'true') {
                    $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-checkbox').prop('checked', true);
                }
            }
            break;
        case "DATE":

            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').datetimepicker("destroy");
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').removeClass("display-none");
            if (isAutoSave) {
                $(textBoxStaticElement).val("");
                $(textBoxStaticElement).attr("data-refId", "");
            }
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').datetimepicker({
                showTimepicker: false,
                yearRange: "-100:+100",
                changeMonth: true,
                changeYear: true
            });

            break;
        case "DATETIME":

            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').datetimepicker("destroy");
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').removeClass("display-none");
            if (isAutoSave) {
                $(textBoxStaticElement).val("");
                $(textBoxStaticElement).attr("data-refId", "");
            }
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').datetimepicker({
                showTimepicker: true,
                yearRange: "-100:+100",
                changeMonth: true,
                changeYear: true
            });
            break;
        case "PICKLIST":
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-select-element').removeClass("display-none");
            var picklistValuesJSON = getFieldValueByFieldName(fieldid, "picklistvalues");
            var selectElement = $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box select.sfff-select-element');
            if (picklistValuesJSON != '') {
                populatePicklist(selectElement, picklistValuesJSON, false, '.sfff-rule-st-static-value-box');
            }
            break;
        case "MULTIPICKLIST":
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-select-element').removeClass("display-none");
            var picklistValuesJSON = getFieldValueByFieldName(fieldid, "picklistvalues");
            var multiselectElement = $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box select.sfff-select-element');
            if (picklistValuesJSON != '') {
                populatePicklist(multiselectElement, picklistValuesJSON, true, '.sfff-rule-st-static-value-box');
            }
            break;
        case "REFERENCE":
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-st-value-field-wrapper a').show();
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-st-value-field-wrapper img').show();
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').removeClass("display-none");
            var lookupTypeObjects = getFieldValueByFieldName(fieldid, "lookupTypeObjects");
            var recTypeObj = getFieldValueByFieldName(fieldid, "recordTypeObject");

            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-st-value-field-wrapper a').bind("click", function() {
                openLookupPopupForRule(this, lookupTypeObjects, recTypeObj);
            });
            $(textBoxStaticElement).datetimepicker("destroy");
            if (isAutoSave) {
                $(textBoxStaticElement).val("");
                $(textBoxStaticElement).attr("data-refId", "");
            }
            break;
        default:
            $(mainRuleStThirdElement).find('.sfff-rule-st-static-value-box .sfff-textbox').removeClass("display-none");
            break;

    } /*switch statement ends*/

}
function openLookupPopupForRule(elemSource,Ltype,Rtype){
    var lookupTypeArray=[];
    if(!isNullOrEmpty(Ltype)){
        lookupTypeArray=Ltype.split(',');
    }else{
        lookupTypeArray.push(Ltype);
    }
    if(($.inArray('Group',lookupTypeArray)>=0)|| ($.inArray('Queue',lookupTypeArray)>=0))
    {
        var elemeId=$(elemSource).parents('.sfff-then-block-rule-statement-').find('.rule-st-2 .sfff-rule-then-field-list select option:selected').val();
        if(!isNullOrEmpty(elemeId))
        {
            var idItems=lengthSplitId(elemeId);
            if(idItems==2)
            {
                //primary
                Rtype=  elemeId.split('.')[0];
            }
            else if(idItems==3)
            {
                //lookup
                var referenceFieldAPIName=elemeId.split('.')[1];
                Rtype=$('.secName-wrap.object-lookup').find('[data-objname="'+referenceFieldAPIName+'"]').attr('data-reftorectrim');
            }
            else if(idItems==4)
            {
                //child
                Rtype=  elemeId.split('.')[1];
            }
        }
    }
    lookupFieldInput=$(elemSource).parent().find('input[type="text"]');
    openLookupPopup(lookupTypeArray.join(","),Rtype,'rule');
}
function populatePicklist(selectElement, strValues, isMultiPicklist, parentValueboxClass) {
    var arrValues =[];
    if(!isNullOrEmpty(strValues) && strValues instanceof Array){
        $.each(strValues, function(n, val) {                        
            if (!isNullOrEmpty(val)) {
                arrValues.push(unescapeHTMLString(val));
            }
        });
    }
    $(selectElement).empty();
    $(selectElement).removeAttr('multiple');
    if (isMultiPicklist) {
        $(selectElement).attr('multiple', 'multiple');
    }
    $(selectElement).append($('<option value="">-select an item-</option>'));
    $.each(arrValues, function(n, val) {
        $(selectElement).append($("<option></option>").attr("value", val).html(val));
    });
    if ($(selectElement).hasClass('sfff-picklist-elem')) {
        var selectedItems = [];
        if ($(selectElement).parent().find('.picklist-hidden').length > 0) {
            if ($(selectElement).parent().find('.picklist-hidden option').length > 0) {
                $(selectElement).parent().find('.picklist-hidden option').each(function(indx, optionElem) {
                    if (!isNullOrEmpty($(optionElem).attr('value'))) {
                        selectedItems.push($(optionElem).attr('value'));
                    }
                });

                $.each(selectedItems, function(i, val) {
                    val=escapePicklistOptionVal(val);
                    $(selectElement).find("option[value='" + val + "']").prop("selected", true);
                });
            }
            $(selectElement).parent().find('.picklist-hidden').remove();
        } else {
            /*set all values selected if select is populated first time- added by new row click*/
            $(selectElement).find('option').each(function(indx, optionElem) {
                if (!isNullOrEmpty($(optionElem).attr('value'))) {
                    $(optionElem).prop("selected", true);
                }
            });
        }
        if ($(selectElement).parent().find('.custom-picklist-control-container').length > 0) {
            $(selectElement).SelectToPicklist('destroy');
            $(selectElement).parent().find('.custom-picklist-control-container').remove();
        }

        $(selectElement).SelectToPicklist();

    } else {
        $(selectElement).select2();

        var selectedData = [];
        var initialvalues = $(selectElement).parents(parentValueboxClass).find('.sfff-textbox').val();

        if (initialvalues != 'undefined' && initialvalues != '') {
            
            if(isMultiPicklist){
                var initialValueArr;
                var isLegacy=false;
                try{
                    initialValueArr=JSON.parse(initialvalues);
                }
                catch(err){
                    isLegacy=true;
                    console.log('FORM legacy code does not use array. It uses csv.');
                    initialValueArr=unescapeHTMLString(initialvalues).split(',');
                }
                if (initialValueArr instanceof Array){
                    $.each(initialValueArr, function(n, val) {                        
                        if (!isNullOrEmpty(val)) {
                            if(!isLegacy){
                                val=unescapeHTMLString(val);
                            }
                            selectedData.push({
                                id: val,
                                text: val
                            });
                        }
                    });
                }
            }else{
                initialvalues=unescapeHTMLString(initialvalues);
                $(selectElement).select2("val", initialvalues);
            }
        }
        if (selectedData.length > 0) {
            $(selectElement).select2("data", selectedData);
        }
    }
}
// Escape double qoutes and single qotes
var escapePicklistOptionVal = function (picklistItemValue) {
    if (picklistItemValue != undefined && picklistItemValue != '') {
        var escapedVal = picklistItemValue.replace(/\"/g, '\\"');
        return escapedVal.replace(/\'/g, '\\\'');
    }
    return '';
};
function getValidOperators(vatt) {
    var validoperatorstring = '';
    $.each(validOperators, function(index, jsonitem) {
        if (validOperators[index][vatt] != undefined) {
            validoperatorstring = validOperators[index][vatt];
        }
    });
    var validoperators = validoperatorstring.split(',');
    return validoperators;
}

function callSaveRule(elemSource, isAutosave) {
    Intercom('trackEvent', 'edited-rule');
    if (($(elemSource).parent().hasClass('sfff-rule-st-existing-field-box') || $(elemSource).parent().hasClass('sfff-rule-then-existing-field-box')) && (elemSource.type == 'select-one' || elemSource.type == 'select-multiple')) {
        console.log("[FORM]  [callSaveRule] Select box change event for 3rd column ");
        setSelectColorTag(elemSource);
    }
    if (isAutosave) {
        var ruleXml = "";
        var mainRuleElem = $(elemSource).parents('.sfff-rule-box-container-');
        var ruleid = $(mainRuleElem).attr("id").replace("sfff-rule-", "");
        ruleXml = generateXML(mainRuleElem);
        console.log('[FORM]  [callSaveRule] rule id' + ruleid);
        console.log(ruleXml);
        saveRule(ruleid, ruleXml);
    }
}

function setSelectColorTag(elemSource) {

    var parentRuleColumn = $(elemSource).parent();
    var colortag = getSelectedOptionColorTag(elemSource);

    $(parentRuleColumn).find("div.select2-container a.select2-choice").attr("class", colortag);

}

function callSaveRuleByMainElem(mainRuleElem, isAutosave) {
    if (isAutosave) {
        var mainruleid = $(mainRuleElem).attr("id");
        var ruleid = $(mainRuleElem).attr("id").replace("sfff-rule-", "");
        var rulexml = generateXML($('#' + mainruleid));
        console.log('FORM Call callSaveRuleByMainElem rule xml ------\n rule id' + ruleid + ' \n xml--\n' + rulexml);
        saveRule(ruleid, rulexml);
    }
}

function isFirstOperandValid() {
    var returnflag = true;
    $('.pnlFormainRuleRepeaterCSS select.select-if-first-select').each(function(i, selectelement) {

        if ($(selectelement).val() == 'undefined' || $(selectelement).val() == '') {
            returnflag = false;

        }
    });
    console.log(' Select isFirstOperandValid- ' + returnflag);
    return returnflag;
}

function ifThenBlockIsValid() {
    var returnflag = true;
    $('.pnlFormainRuleRepeaterCSS .sfff-then-block-rule-statement-').each(function(i, thenBlockElement) {
        if (!$(thenBlockElement).find('.sfff-rule-then-field-list').hasClass('display-none')) {
            console.log(' Then section list is visible ');
            if ($(thenBlockElement).find('select.select-then-fields').val() == 'undefined' || $(thenBlockElement).find('select.select-then-fields').val() == '') {
                console.log(' Then section list value is null ');
                returnflag = false;
            } else {
                console.log(' Then section list value is - ' + $(thenBlockElement).find('select.select-then-fields').val());
            }
        } else {
            console.log(' Then section list has class display-none');
        }

    });
    return returnflag;
}

function ruleSaved() {
    /* alert('rule save hit ');*/
}
//generate XML to update the Rule object in salesforce
function generateXML(mainRuleElem) {

    var ruleid = $(mainRuleElem).attr("id").replace("sfff-rule-", "");
    var ruleXML = '<rule id="' + ruleid + '">';

    $(mainRuleElem).find('.sfff-rule-box-if-block').each(function(indexifBlock, ifblockElem) {

        ruleXML += '<if>';
        $(ifblockElem).find('.sfff-if-block-inner').each(function(indexInner, ifblockInnerElem) {

            $(ifblockInnerElem).find('.sfff-if-block-section-').each(function(indexSection, ifblockSectionElem) {
                var attrCondRule = '';
                var attrOP = '';
                var selectAndOr = $(ifblockSectionElem).find('.sfff-if-block-container select.sfff-select-and-or');
                if ($(selectAndOr) != 'undefined' && $(selectAndOr).length > 0) {
                    /* value from select and-or dropdown*/
                    attrOP = $(selectAndOr).select2("val");

                }
                var selectCondRule = $(ifblockSectionElem).find('.sfff-if-block-container select.sfff-select-any-all');
                if ($(selectCondRule) != 'undefined' && $(selectCondRule).length > 0) {
                    /* value from select any-all dropdown*/
                    attrCondRule = $(selectCondRule).select2("val");

                }
                //  console.log(' INDEX- '+indexInner);
                ruleXML += '<section op="' + attrOP + '" index="' + indexInner + '"  condrule="' + attrCondRule + '"  >';


                $(ifblockSectionElem).find('.sfff-if-block-rule-statements .sfff-if-block-rule-statement-').each(function(indexRuleSt, ifblockRuleStElem) {
                    var valOperand1 = '';
                    var valOperand2 = '';
                    var valOperand2RefId = '';
                    var conditionOperator = '';
                    var attrIsDynamic = 'true';
                    var ifOtherDataSourceItems=[];
                    var ifOtherDataSourceType='';

                    var selectOperand1 = $(ifblockRuleStElem).find('.rule-st-1 select.select-elem');
                    if ($(selectOperand1) != 'undefined') {
                        valOperand1 = $(selectOperand1).select2("val");
                    }
                    var selectOperater = $(ifblockRuleStElem).find('.rule-st-2 select.select-elem');
                    if ($(selectOperater) != 'undefined') {
                        conditionOperator = $(selectOperater).select2("val");
                    }
                    var selectOperand2 = $(ifblockRuleStElem).find('.rule-st-3>div').each(function(i, ifblockRuleSt3) {
                        if ($(ifblockRuleSt3).hasClass('display-none')) {

                        } else {
                            /* Visible Rule control for operand2 */
                            if ($(ifblockRuleSt3).hasClass('sfff-rule-st-existing-field-box')) {
                                /*Operand2 value is dynamic- fieldid */
                                var selectOperandSt3 = $(ifblockRuleSt3).find('select.select-elem');
                                if ($(selectOperandSt3) != undefined) {
                                    valOperand2 = $(selectOperandSt3).select2("val");
                                }
                                attrIsDynamic = 'true';
                            } else {
                                /*Operand2 value is static- value*/
                                attrIsDynamic = 'false';
                                var selectOperandstatic = $(ifblockRuleSt3).find('input[type=text],input[type=checkbox],textarea,select').each(function() {

                                    if (this.type == 'text' && (!$(this).hasClass('display-none'))) {
                                        if ($(this).val() != '') {
                                            valOperand2 = $(this).val();

                                            console.log(' textbox- ' + valOperand2);
                                        }
                                        if (!isNullOrEmpty($(this).attr('data-refid'))) {
                                            valOperand2RefId = $(this).attr('data-refid');
                                            valOperand2 = $(this).attr('data-refid');
                                            console.log(' textbox- ' + valOperand2);
                                        }
                                    }
                                    if (this.type == 'textarea' && (!$(this).hasClass('display-none'))) {
                                        if ($(this).val() != '') {
                                            valOperand2 = $(this).val();

                                            console.log(' textarea- ' + valOperand2);
                                        }
                                    }
                                    if (this.type == 'checkbox' && (!$(this).hasClass('display-none'))) {
                                        console.log(' Type - ' + this.type + ' value ' + $(this).is(":checked"));
                                        if ($(this).is(":checked")) {
                                            valOperand2 = 'true';
                                        } else {
                                            valOperand2 = 'false';
                                        }

                                    }

                                    if ((this.type == 'select-one' || this.type == 'select-multiple') && (!$(this).hasClass('display-none'))) {
                                        console.log(' Select2 values- ' + $(this).val());
                                        if(this.type == 'select-multiple'){
                                            ifOtherDataSourceItems=getDataItemsXMLForPicklist($(this).val());
                                            ifOtherDataSourceType = 'picklist';
                                        }else{
                                            valOperand2 = safeStringValue($(this).val(),'');
                                        }
                                    }


                                }); /*static element search  ends */

                            }
                        }
                    }); /*rule-st-3 ends */


                    ruleXML += '<condition operator="' + conditionOperator + '">';

                    ruleXML += '<operand1>' + escapeHtmlString(valOperand1) + '</operand1>';
                    /* we won't be using it
                    *** var valOperand2STR = '';
                    if (valOperand2 instanceof Array) {
                        $.each(valOperand2, function(index, value) {
                            if (index > 0) {
                                valOperand2STR += ",";
                            }
                            valOperand2STR += value; //.replace(/'/g, "\\'");
                        });
                    } else {
                        valOperand2STR = valOperand2; //.replace(/'/g, "\\'");
                    }*/
                    ruleXML += '<operand2 dtType="'+ifOtherDataSourceType+'" refId="' + valOperand2RefId + '" isdynamic="' + attrIsDynamic + '">' + escapeHtmlString(valOperand2) + '</operand2>';
                    if (!isNullOrEmpty(ifOtherDataSourceItems)) {
                        ruleXML += ifOtherDataSourceItems;
                    }
                    ruleXML += '</condition>';


                }); /*sfff-if-block-rule-statement- ends */
                ruleXML += '</section>';

            }); /*sfff-if-block-section- ends */

        }); /*sfff-if-block-inner ends */

        ruleXML += '</if>';

    }); /*sfff-rule-box-if-block ends */

    /*then block starts */
    ruleXML += '<then>';
    $(mainRuleElem).find('.sfff-rule-box-then-block .sfff-then-block-rule-statement-').each(function(indexRuleSt, thenblockRuleStElem) {



        /*then block update*/
        var thenAction = '';
        var thenTarget = '';
        var thenTargetIsDynamic = 'true';
        var thenOther = '';
        var thenOtherPopulate = 'false';
        var thenOtherRefId = '';
        var thenOtherIsDynamic = '';
        var thenOtherDataSourceType = '';
        var thenOtherDataSourceItems = '';


        var selectAction = $(thenblockRuleStElem).find('.rule-st-1 select.select-elem');
        if ($(selectAction) != 'undefined') {
            if (!isNullOrEmpty($(selectAction).val()) && $(selectAction).val() != '--select an item--') {
                thenAction = $(selectAction).val();
            }
        }
        if (thenAction == "displaymessage") {
            var textareatxt = $(thenblockRuleStElem).find('.rule-st-2 .sfff-rule-then-show-error-msg').find('.sfff-textarea').val();
            thenTarget = textareatxt;
            thenTargetIsDynamic = false;
        } else {
            thenTargetIsDynamic = true;
            var selectTarget = $(thenblockRuleStElem).find('.rule-st-2 select.select-elem');
            if ($(selectTarget) != 'undefined') {
                thenTarget = $(selectTarget).val();
            }
        }
        if (thenAction == 'populate') {
            thenOtherPopulate = 'true';
            /* Visible Rule control for populate target */
            if ($(thenblockRuleStElem).find('.rule-st-3').hasClass('dynamic-field')) {
                var thenblockRuleSt3 = $(thenblockRuleStElem).find('.rule-st-3 .sfff-rule-then-populate-field .sfff-rule-then-existing-field-box');
                /*Target other value is dynamic- fieldid */
                var selectOperandSt3 = $(thenblockRuleSt3).find('select.select-elem');
                if ($(selectOperandSt3) != undefined) {
                    thenOther = $(selectOperandSt3).val();
                }
                thenOtherIsDynamic = 'true';
            } else if ($(thenblockRuleStElem).find('.rule-st-3').hasClass('static-field')) {
                /* Target other value is static- value*/
                var thenblockRuleSt3 = $(thenblockRuleStElem).find('.rule-st-3 .sfff-rule-then-populate-field .sfff-rule-then-static-value-box');
                thenOtherIsDynamic = 'false';
                $(thenblockRuleSt3).find('input[type=text],input[type=checkbox],textarea,select').each(function() {
                    if (this.type == 'text' && (!$(this).hasClass('display-none'))) {
                        if ($(this).val() != '') {
                            thenOther = $(this).val();
                            console.log(' textbox thenOther- ' + thenOther);
                        }
                        if (!isNullOrEmpty($(this).attr('data-refid'))) {
                            thenOtherRefId = $(this).attr('data-refid');
                        }
                    }
                    if (this.type == 'checkbox' && (!$(this).hasClass('display-none'))) {
                        console.log(' Type - ' + this.type + ' value ' + $(this).is(":checked"));
                        if ($(this).is(":checked")) {
                            thenOther = 'true';
                        } else {
                            thenOther = 'false';
                        }

                    }
                    if (this.type == 'textarea' && (!$(this).hasClass('display-none'))) {
                        if ($(this).val() != '') {
                            thenOther = $(this).val();

                            console.log('thenOther  textarea- ' + thenOther);
                        }
                    }

                    if ((this.type == 'select-one' || this.type == 'select-multiple') && (!$(this).hasClass('display-none'))) {
                        if(this.type == 'select-multiple'){
                            thenOtherDataSourceItems=getDataItemsXMLForPicklist($(this).val());
                            thenOtherDataSourceType = 'picklist';
                        }else{
                            thenOther = safeStringValue($(this).val(),'');
                        }
                    }
                }); /*static element search  ends */
            } else {

            }
            /*thenTarget=='populate'  ends */
        } else if (thenAction == 'setpicklistvalues') {
            thenOtherPopulate = 'false';
            thenOtherDataSourceType = 'setpicklist';
            if ($(thenblockRuleStElem).find('.rule-st-3').hasClass('dynamic-field')) {
                var thenblockRuleSt3 = $(thenblockRuleStElem).find('.rule-st-3 .sfff-rule-then-setpicklistoptions .sfff-rule-then-existing-field-box');
                /*Target other value is dynamic- fieldid */
                var selectOperandSt3 = $(thenblockRuleSt3).find('select.select-elem');
                if ($(selectOperandSt3) != undefined) {
                    thenOther = $(selectOperandSt3).select2("val");
                }
                thenOtherIsDynamic = 'true';
            } else if ($(thenblockRuleStElem).find('.rule-st-3').hasClass('static-field')) {
                thenOtherIsDynamic = 'false';
                thenOtherDataSourceItems=getDataItemsXMLForPicklist($(thenblockRuleStElem).find('.rule-st-3 select.sfff-picklist-elem').val());
            }
        }

        ruleXML += '<result>';
        ruleXML += '<action>' + thenAction + '</action>';

        ruleXML += '<target isdynamic="' + thenTargetIsDynamic + '">' + escapeHtmlString(thenTarget) + '</target>';

        /* we won't be using the following code anymore since array type values, we get from select elemtns will be sotred in xml format instead of csv
        *** var thenOtherSTR = '';
        if (thenOther instanceof Array) {
            $.each(thenOther, function(index, value) {
                if (index > 0) {
                    thenOtherSTR += ",";
                }
                thenOtherSTR += value;
            });
        } else {
            thenOtherSTR = thenOther;
        }*/

        ruleXML += '<other dtType="' + thenOtherDataSourceType + '" refId="' + thenOtherRefId + '" isdynamic="' + thenOtherIsDynamic + '"   populate="' + thenOtherPopulate + '">' + escapeHtmlString(thenOther) + '</other>';
        if (!isNullOrEmpty(thenOtherDataSourceItems)) {
            ruleXML += thenOtherDataSourceItems;
        }
        ruleXML += '</result>';



        /*then block update ends*/

    }); /*then block ends */
    ruleXML += '</then>';

    ruleXML += '</rule>';
    return ruleXML;
}

function getDataItemsXMLForPicklist(picklistValues){
    var dataItems = [];
    var dataitemXMLStr = '';
    if(picklistValues!=null && picklistValues!==undefined){
        dataItems = picklistValues;
        if (dataItems instanceof Array) {
            $.each(dataItems, function(index, value) {
                if (!isNullOrEmpty(value)) {
                    dataitemXMLStr += '<item>' + escapeHtmlString(value) + '</item>';
                }
            });
        } else {
            // Legacy code before FF-2225
            if (!isNullOrEmpty(dataItems.split(','))) {
                dataitemXMLStr += '<item>' + escapeHtmlString(dataItems) + '</item>';
            }
        }
        if (!isNullOrEmpty(dataitemXMLStr)) {
            return  '<dataItems>' + dataitemXMLStr + '</dataItems>';
        }
    }
    return '';
}

function resetSelect2() {
    /*Reset select2 elements*/
    $(".pnlFormainRuleRepeaterCSS select.select-elem").select2();

}
/*Reset select2 elements of one condition block*/
function resetSelect2Element(mainConditionElem) {
    $(mainConditionElem).find('select.select-elem').select2();
}

$.fn.slideFadeToggle = function(speed, easing, callback) {
    return this.animate({
        height: 'toggle',
        opacity: 'toggle'
    }, speed, easing, callback);
};




function addNewRuleHTML(elem) {
    Intercom('trackEvent', 'added-rule');
    var ruleindex = '1';
    if ($(elem).attr('data-rule-index') != 'undefined') {
        console.log(' Rule Index=  ' + $(elem).attr('data-rule-index'));
        ruleindex = '' + $(elem).attr('data-rule-index') + '';
    }
    remoteCreateNewRuleJS(ruleindex);
}




function addNewRuleIfHTML(elem) {
    var newElem = getNewIfRuleHTML();
    $(elem).parent().parent().after(newElem).fadeIn('slow');
    $(newElem).find('.sfff-rule-delete').css('display', '');
    //show top-most delete icon
    var ruleSection = $(elem).parent().parent().parent();
    $(ruleSection).find('.sfff-rule-delete').eq(0).css('display', '');


    resetSelect2Element(newElem);
    populateBlockSelect(newElem, true);
    resetOptionsForRepeatedFieldRule(elem, false);
    callSaveRule(elem, true);
}

function deleteRuleIfHTML(elem) {
    $('.rule-add-delete-box').hide();
    var isTopMostSection = ($(elem).parent().parent().parent().parent().parent().index() == 0);
    var ruleSection = $(elem).parent().parent().parent();
    var numIfsInSection = $(ruleSection).children().size() - 1;
    var mainRuleElem = $(elem).parents('.sfff-rule-box-container-');


    $(elem).parents('.sfff-if-block-rule-statement-').fadeOut().remove();
    $('.rule-add-delete-box').show();
    if (isTopMostSection && numIfsInSection == 1) {
        //hide the delete button for top-most if statement
        $(ruleSection).find('.sfff-rule-delete').eq(0).hide();
    } else if (!isTopMostSection && numIfsInSection == 0) {
        $(ruleSection).parent().eq(0).remove();
    }

    callSaveRuleByMainElem(mainRuleElem, true);

}



function addNewRuleThenHTML(elem) {
    var newElem = getNewThenRuleHTML();
    $(elem).parent().parent().after(newElem).fadeIn('slow');

    $(newElem).find('.sfff-rule-then-delete').css('display', '');
    //show top-most delete icon
    var thenSection = $(elem).parent().parent().parent();
    $(thenSection).find('.sfff-rule-then-delete').eq(0).css('display', '');

    var mainThenConditionElem = $(elem).parents('.sfff-then-block-rule-statement-');

    resetSelect2Element(newElem);
    populateBlockSelect(newElem, false);
    resetOptionsForRepeatedFieldRule(elem, false);
    callSaveRule(elem, true);
}

function deleteRuleThenHTML(elem) {
    $('.rule-add-delete-box').hide();
    var actionSection = $(elem).parent().parent().parent();
    var numActionsInSection = $(actionSection).children().size() - 1;

    var mainRuleElem = $(elem).parents('.sfff-rule-box-container-');


    $(elem).parents('.sfff-then-block-rule-statement-').fadeOut().remove();
    $('.rule-add-delete-box').show();
    if (numActionsInSection == 1) {
        //hide the delete button for top-most then statement
        $(actionSection).find('.sfff-rule-then-delete').eq(0).hide();
    }

    callSaveRuleByMainElem(mainRuleElem, true);


}



/* return HTML for one complete If section which includes and/Or and Any/all operator dropdowns as well*/
function getNewIfRuleSectionHTML() {
    var selectAndOrHTML = generateAndOrSelectHTML();
    var newDiv = $('<div/>').addClass('sfff-if-block-inner');

    newDiv.append($('#ruleBoxHtml').find('.sfff-if-block-inner').html());
    $(newDiv).find('.sfff-if-block-container').prepend(selectAndOrHTML);
    return newDiv;
}
/* return HTML for one If condition block*/
function getNewIfRuleHTML() {
    var newDiv = $('<div/>').addClass('sfff-if-block-rule-statement-');

    newDiv.append($('#ruleBoxHtml').find('.sfff-if-block-rule-statement-').html());

    return newDiv;
}

/* return HTML for one Then condition block*/
function getNewThenRuleHTML() {
    var newDiv = $('<div/>').addClass('sfff-then-block-rule-statement-');

    newDiv.append($('#ruleBoxHtml').find('.sfff-then-block-rule-statement-').html());
    return newDiv;
}

/*generate HTML for AndOr button*/
function generateAndOrSelectHTML() {
    var selectAndorElem = '<select class="select-elem sfff-select-and-or" onchange="callSaveRule(this,true);"   ><option value="and">And</option><option value="or">Or</option></select>';



    return selectAndorElem;
}



/* populate Custom select html. Assign HTML to select element which consists of Fields or sections or both*/
function populateBlockSelect(mainConditionElem, isIfblock) {


    if (isIfblock) {
        /* IF condition second column dropdown*/
        var selectHTML = generateSelectHtml(true);
        restructureSelectElement($(mainConditionElem).find('select.select-if-first-select'), selectHTML);
        restructureSelectElement($(mainConditionElem).find('.rule-st-3 .sfff-rule-st-existing-field-box select.select-elem'), selectHTML);

    } else {
        /* Then condition second column dropdown*/
        var selectHTML = generateSelectHtml(false);
        restructureSelectElement($(mainConditionElem).find('select.select-then-fields'), selectHTML);
        selectHTML = generateSelectHtml(true);
        restructureSelectElement($(mainConditionElem).find('.rule-st-3 .sfff-rule-then-existing-field-box select.select-color-'), selectHTML);

    }



}
/* this method generate HTML for select elements 
it gets data from dummy Select elements and then restructure the list according to sections 
and fields then assign to specific select elements 
e.g. tempThenAvailableFieldsSelectCSS has data with sections and tempIfAvailableFieldsSelectCSS has only object fields and general fields
*/
function generateSelectHtml(excludeSections) {

    var tempSelectElementDiv = $('.tempThenAvailableFieldsSelectCSS');

    if (excludeSections) {
        tempSelectElementDiv = $('.tempIfAvailableFieldsSelectCSS');
    }
    var HTMLregex=  new RegExp('<.*?(\\s+).*?>',["i"]);
    var fieldsStart = 0;
    var fieldEnds = false;
    var genfieldsStart = 0;
    var html = '';
    var childObjectPrefix = '';
    var totalItems = $(tempSelectElementDiv).find('select.select-elem > option').length;
    var pageGrpStart = false;
    var sectionGrpStart = false;
    var fieldGrpStart = false;
    var genfieldGrpStart = false;
    html += '<option class="fielditem" name="field-item" value="">--select an item--</option>';

    $(tempSelectElementDiv).find('select.select-elem > option').each(function(index) {

        var optionText = $(this).text();
        if (!isNullOrEmpty(optionText)) {
            try {
                
                optionText = $('<div/>').html($('<div/>').html(optionText).text()).text();  
                  //check for Html tags
                 if(HTMLregex.test(optionText)){
                    optionText =  optionText.replace(/<.*?(\s+).*?>/g, '').replace(/\s/g, '')
                }
            } catch (err) {}
        }
        var optionValue = $(this).val();
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
                childObjectPrefix = 'FieldOption ' + optionValue;
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
        if(optionText.length>30){

            optionText=optionText.substring(0,23)+'...';
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

            //this block will replace the text with id in case Enduser enter random html tags 
           if(optionText !=='')
            {  
                  html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';

            }else
            {
                 html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionValue + ' </option>';
            }

        }
        if (!pageGrpStart && !sectionGrpStart && !fieldGrpStart && genfieldsStart > 0 && optionValue != '') {
            /*looping through field items */
            fieldEnds = true;

          //this block will replace the text with id in case Enduser enter random html tags 
            if(optionText !=='')
            {  
                  html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';

            }else
            {
                 html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionValue + ' </option>';
            }
        
        }

        if (index === totalItems - 1) {
            // this is the last one
            html += '</optgroup>';
        }
    });
    return html;
}

function generateSelectHtmlORIGINAL(excludeSections) {

    var tempSelectElementDiv = $('.tempThenAvailableFieldsSelectCSS');
    if (excludeSections) {

        tempSelectElementDiv = $('.tempIfAvailableFieldsSelectCSS');
    }

    var sectionGrp = [];
    var sectionStart = false;
    var fieldsStart = 0;
    var fieldEnds = false;
    var genfieldsStart = 0;
    var genfieldEnds = false;
    var currentIndex = 0;
    var html = '';
    var childObjectPrefix = '';
    var totalItems = $(tempSelectElementDiv).find('select.select-elem > option').length;

    var sectionGrpStart = false;
    var fieldGrpStart = false;
    var genfieldGrpStart = false;
    html += '<option class="fielditem" name="field-item" value="">--select an item--</option>';

    $(tempSelectElementDiv).find('select.select-elem > option').each(function(index) {

        var optionText = $(this).text();
        var optionValue = $(this).val();
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
            /*looping through section items */
            html += '<option class="sectionitem" name="section-item" value="' + optionValue + '">' + optionText + ' </option>';
        }
        if (!sectionGrpStart && fieldGrpStart && fieldsStart > 0 && optionValue != '' && optionText.indexOf('Fields for') < 0) {
            /*looping through field items */
            //console.log('IN fields loop - optionText :' + optionText);
            fieldEnds = true;
            html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';

        }
        if (!sectionGrpStart && !fieldGrpStart && genfieldsStart > 0 && optionValue != '') {
            /*looping through field items */
            //  console.log('In gen  fields loop - optionText :' + optionText);
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

function restructureSelectElement(selectElement, selecthtml) {
    var selectedValue = $(selectElement).select2("val");
    var elemClass = $(selectElement).attr("class");
    console.log('Select Class:' + elemClass);
    $(selectElement).empty();
    $(selectElement).append(selecthtml);
    $(selectElement).select2("val", selectedValue);
}
/**/
/*To switch rule xml to formula editor and vie-versa*/
function switchRuleEditor(elemSource, isAutoSave) {
    if (isAutoSave) {
        var isFormulaEnabled = false;
        var warningMessage = 'Changing mode will discard any changes made in Formula Editor';
        if ($(elemSource).text() == 'Edit Formula') {
            isFormulaEnabled = true;
            warningMessage = 'Changing mode will populate Formula Editor with current rule.';
        }

        var dialogBody = "<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>" + warningMessage + "<br /><br />Are you sure you want to do this?<br /></div><div class='secondary'></div></div>";




        $("#dialog-confirm").html(dialogBody);

        // Define the Dialog and its properties.
        $("#dialog-confirm").dialog({
            resizable: false,
            modal: true,
            title: "Save",
            height: "auto",
            width: 413,
            buttons: {
                "Yes": {
                    click: function() {
                        $(this).dialog('close');
                        if (isFormulaEnabled) {} else {
                            //remotePopulateRuleScriptJs(elemSource);        
                        }
                    },
                    text: 'Yes',
                    'class': 'vabutton1'
                },
                "No": {
                    click: function() {
                        $(this).dialog('close');

                    },
                    text: 'No',
                    'class': 'vabutton2'
                }

            },
            open: function(event, ui) {
                $('.ui-dialog :button').blur();
            }
        });
    } else {
        switchRuleLinks(elemSource);

    }
}

function switchRuleLinks(elemSource) {
    if ($(elemSource).parents('.sfff-rule-box-container-').find('.sfff-formula-box').is(':visible')) {
        $(elemSource).parents('.sfff-rule-box-container-').find('.sfff-formula-box').fadeOut("fast", function() {
            $(elemSource).parents('.sfff-rule-box-container-').find('.sfff-rule-editor-box').fadeIn("fast");
        });
        $(elemSource).text('Edit Rule');
    } else {
        $(elemSource).parents('.sfff-rule-box-container-').find('.sfff-rule-editor-box').fadeOut("fast", function() {
            $(elemSource).parents('.sfff-rule-box-container-').find('.sfff-formula-box').fadeIn("fast");

        });
        $(elemSource).text('Edit Formula');
    }
}

function calculateNumberOfLIItemsAfterRowIndexInUL(ulElement, rowIndex) {
    var numberOfLiItems = 0;
    var numberOfRows = 0;
    $(ulElement).find('>li').each(function() {
        if ($(this).prev().length > 0) {
            if ($(this).position().top != $(this).prev().position().top) {
                numberOfRows++;
            }
            if (numberOfRows > rowIndex) {
                numberOfLiItems++;
            }
        } else {
            numberOfRows++;
        }
    });
    return numberOfLiItems;
}

function calculateNumberOfRowsInUL(ulElement) {
    var numberOfRows = 0;
    $(ulElement).find('>li').each(function() {
        if ($(this).prev().length > 0) {
            if ($(this).position().top != $(this).prev().position().top) {
                numberOfRows++;
            }
        } else {
            numberOfRows++;
        }
    });
    return numberOfRows;
}
/*pagination methods start*/
function initializeRuleEditorPagination(curpage, pagesize) {
    var totalRecords = ruleRecordIDs.length;


    var paginationElemMain = $('.ff-pagination-box');
    var totalPages = Math.ceil(totalRecords / pagesize);
    var ulElem = $('<ul/>', {
        'class': 'ff-pagination ul-nav-item'
    });
    console.log('totalPages:' + totalPages);
    if (totalPages > 0) {
        if (totalPages > 5) {
            //var ulElem = $('<ul/>',{'class':'ff-pagination ul-nav-item'});
            var aTag = $('<a/>', {
                'class': 'nav-link first-link',
                'data-page': '1',
                'html': '<',
                'onclick': 'navREPageClick(this);'
            });
            var liElem = $('<li/>', {
                'class': 'first-item'
            });
            liElem.append(aTag);
            ulElem.append(liElem);
        }
        for (var indx = 1; indx <= totalPages; indx++) {
            var htmltext
            var aTag = $('<a/>', {
                'class': 'nav-link',
                'data-page': indx,
                'html': indx,
                'onclick': 'navREPageClick(this);'
            });

            if (indx == curpage) {
                // aTag = $('<span/>',{'class':'nav-link' ,'html':indx});
                aTag.addClass('active');
            }
            var liElem = $('<li/>', {
                'class': 'nav-item'
            });
            liElem.append(aTag);
            ulElem.append(liElem);
        }
        if (totalPages > 5) {
            // var ulElem = $('<ul/>',{'class':'ff-pagination ul-nav-item'});
            var aTag = $('<a/>', {
                'class': 'nav-link last-link',
                'data-page': totalPages,
                'html': '>',
                'onclick': 'navREPageClick(this);'
            });
            var liElem = $('<li/>', {
                'class': 'last-item'
            });
            liElem.append(aTag);
            ulElem.append(liElem);
        }
    }
    //var navulElem = $('<nav/>' );
    // navulElem.append(ulElem);
    paginationElemMain.html(ulElem);
    if (totalPages < 2) {
        paginationElemMain.addClass('display-none');
    } else {
        paginationElemMain.removeClass('display-none');
    }
}

function navREPageClick(elemSource) {
    if ($(elemSource).hasClass('active') || $(elemSource).hasClass('disabled')) {

    } else {
        $(elemSource).parents('.ff-pagination').find('.nav-link').removeClass('active');
        if ($(elemSource).hasClass('first-link')) {
            $(elemSource).parent().next().find('.nav-link').addClass('active');
        } else if ($(elemSource).hasClass('last-link')) {
            $(elemSource).parent().prev().find('.nav-link').addClass('active');
        } else {
            $(elemSource).addClass('active');
        }
        resetRECurrentPageData($(elemSource).attr('data-page'), false);
        // $('html, body').animate({scrollTop: 0}, 500);

    }
}

function resetREPaginationLinks() {
    var totalRecords = ruleRecordIDs.length;
    var totalPages = Math.ceil(totalRecords / REPageSize);
    if (RECurrentPage == 1) {
        $('.ul-nav-item').find('.first-link').addClass('disabled');
    } else {
        $('.ul-nav-item').find('.first-link').removeClass('disabled');
    }
    if (RECurrentPage == totalPages) {
        $('.ul-nav-item').find('.last-link').addClass('disabled');
    } else {
        $('.ul-nav-item').find('.last-link').removeClass('disabled');
    }
    $('.ul-nav-item .nav-item').each(function(indx, navItem) {
        var pageNumber = $(navItem).find('.nav-link').attr('data-page')
        if (!isNullOrEmpty(pageNumber)) {
            $(navItem).find('.nav-link').text(pageNumber);
        }

    });
    var leastNumToShow = 0;
    var numRangePlus = 0;
    var leastNumRange = 3;
    var maxNumRange = 3;
    var maxNumToShow = 4;
    var maxRecAvailable = parseInt(totalPages);
    var intPage = parseInt(RECurrentPage);

    var pageDiff = maxRecAvailable - intPage;

    if (intPage < 4) {
        maxNumToShow = 6;
    } else if (intPage >= 4) {
        maxNumToShow = intPage + maxNumRange;

    }

    if (pageDiff < 4) {

        leastNumToShow = intPage - ((leastNumRange + leastNumRange) - pageDiff);

    } else if (intPage >= 4) {
        leastNumToShow = intPage - leastNumRange;
    }

    $('.ul-nav-item .nav-item').each(function(indx, navItem) {
        var pageNumber = $(navItem).find('.nav-link').attr('data-page')
        if (pageNumber < leastNumToShow || pageNumber > maxNumToShow) {
            $(navItem).hide();
        } else {
            if (pageNumber !== RECurrentPage && (pageNumber == leastNumToShow || pageNumber == maxNumToShow)) {
                $(navItem).find('a').text('...');
                $(navItem).find('a').addClass('ls2');
            } else {
                $(navItem).find('a').text(pageNumber);
                $(navItem).find('a').removeClass('ls2');
            }
            $(navItem).show();

        }

    });

    var htmlPageInfo = 'Page ' + RECurrentPage + ' of ' + totalPages;
    var divPageInfo = $('<div/>', {
        'class': 'ff-page-info',
        'html': htmlPageInfo
    });
    $('.ff-pagination-box').find('.ff-page-info').remove();
    $('.ff-pagination-box').append(divPageInfo);

}

function resetRECurrentPageData(curpage, initialLoad) {

    RECurrentPage = curpage;
    resetREPaginationLinks();
    var startRec = Math.max(RECurrentPage - 1, 0) * REPageSize;
    var endRec = startRec + REPageSize;
    var currentIdObjs = ruleRecordIDs.slice(startRec, endRec);
    var currentIds = [];
    $.each(currentIdObjs, function(indx, item) {
        currentIds.push(item.Id);
    });
    var csvIds = currentIds.join();
    console.log('csvIds-----' + csvIds);

    getRemoteRuleXMLListJS(currentIds);


}

function resetREInlineLoadingBar(show) {
    if (show) {
        $('.sfff-rule-editor-content .inline-loading').fadeIn();
    } else {
        $('.sfff-rule-editor-content .inline-loading').fadeOut();
    }
}

function resetREOverlayLoading(show) {
    if (show) {
        $('.sfff-rule-editor-content .overlay-loading').show();
    } else {
        $('.sfff-rule-editor-content .overlay-loading').hide();
    }
}
/*pagination methods end*/
/*RULE XML list parsing starts*/

function initializeRulesInformation(resultXML) {
    var xmlstr = $('<div/>').html(resultXML).text();

    xmlstr = '<root>' + xmlstr + '</root>';
    var xmlDocElement = getXmlElementFromStr(xmlstr);
    jsonFieldsData = returnJson(xmlDocElement.getElementsByTagName("ffPage"));

    getRemoteAllRuleRecIdsJS('INITIALIZE');
}

function resetDeleteRowActionHover() {
    $('.sfff-rule-box-container- ').each(function(i, ruleElem) {
        $(ruleElem).find('.sfff-rule-delete').css("display", "");
        $(ruleElem).find('.sfff-rule-then-delete').css("display", "");
        var numIfs = $(ruleElem).find('.sfff-if-block-rule-statement-').size();
        var numActions = $(ruleElem).find('.sfff-then-block-rule-statement-').size();
        if (numIfs == 1) {
            $(ruleElem).find('.sfff-if-block-rule-statement-').eq(0).find('.sfff-rule-delete').hide();
        }
        if (numActions == 1) {
            $(ruleElem).find('.sfff-then-block-rule-statement-').eq(0).find('.sfff-rule-then-delete').hide();
        }
    });
}

function handleResponseRuleList(responseObjList) {
    var mainRuleWrapperElem = $('.pnlFormainRuleRepeaterCSS');
    mainRuleWrapperElem.html('');
    showMainRuleRepeater(true);
    mainRuleWrapperElem.show();
    $.each(responseObjList, function(indx, item) {

        var ruleDiv = getRuleSetUpInformationElem(item);
        mainRuleWrapperElem.append(ruleDiv);
    });
    if (responseObjList != null && responseObjList.length > 0) {
        $('#pnlForNewRuleBlock').find('.no-rule-block .no-rule-text').hide();
        $('#pnlForNewRuleBlock').find('.no-rule-block').removeClass('no-rule-block-show');
        $('#pnlForNewRuleBlock').find('.no-rule-block .vabuttonB1').attr('data-rule-data', 'ruleexists');
        //.show( "drop", {direction: "right"}, 300 );

        $('.pnlFormainRuleRepeaterCSS .sfff-then-block-rule-statement-').each(function(i, selectelement) {
            resetThenOperatorAndFilter(selectelement, false);
        });
        $('.pnlFormainRuleRepeaterCSS select.select-if-first-select').each(function(i, selectelement) {
            resetOperatorAndFilter(selectelement, false);
        });

        resetDeleteRowActionHover();

    } else {
        $('#pnlForNewRuleBlock').fadeIn();
        $('#pnlForNewRuleBlock').find('.no-rule-block .no-rule-text').fadeIn();
        $('#pnlForNewRuleBlock').find('.no-rule-block').addClass('no-rule-block-show');
        $('#pnlForNewRuleBlock').find('.no-rule-block .vabuttonB1').attr('data-rule-data', 'norule');
        $('.pnlFormainRuleRepeaterCSS').fadeOut();
    }


    resetREOverlayLoading(false);

}

function getRuleSetUpInformationElem(ruleItem) {
    var ruleIndex = ruleItem.RuleOrder;
    var ruleDiv = $('<div/>').html($('#ruleWrapperTEMPHTML').clone().html());
    ruleDiv.find('.rule-tag-number').html(ruleItem.RuleOrder);
    var tempId = ruleDiv.find('#sfff-rule-').attr('id');
    ruleDiv.find('#sfff-rule-').attr('id', tempId + ruleItem.RuleId);

    /*if-section items loop starts*/
    $.each(ruleItem.RuleIfSectionList, function(indx, sectionItem) {
        /*in loop - sectionItem consists of following items:
        -rsConditionalRule : "string" [any/all]
        -rsConditionList:[] array of if condition statements
        -rsIndex :int   
        -rsOperator : "string" [and/or]
        */
        var newSectionElem = getNewIfRuleSectionHTML();
        newSectionElem.find('.sfff-select-any-all').val(sectionItem.rsConditionalRule);

        if (isNullOrEmpty(sectionItem.rsOperator)) {
            newSectionElem.find('.sfff-select-and-or').remove();
        } else {
            newSectionElem.find('select.sfff-select-and-or').val(sectionItem.rsOperator);
        }
        newSectionElem.find('.sfff-if-block-rule-statement-').remove();
        if (sectionItem.rsConditionList != null && sectionItem.rsConditionList.length > 0) {
            /*condition items loop starts*/
            $.each(sectionItem.rsConditionList, function(cIndx, conditionItem) {
                /**in loop - conditionItem consists of following items:
                rcDataItems : array
                rcDataSourceType : "string" [picklist]
                rcFieldType : "string"
                rcIsOperand2Dynamic : bool [false/true]
                rcOperand1 : "string"
                rcOperand2 : "string"
                rcOperator : "string" [atw/eqt etc]
                rcRefId : "string"
                */

                var newIfConditionElem = getIfSectionElemConfig(conditionItem);
                newSectionElem.find('.sfff-if-block-rule-statements').append(newIfConditionElem).fadeIn('slow');


            }); /*condition items loop ends*/
        } else {
            var newIfConditionElem = getIfSectionElemConfig(null);
            newSectionElem.find('.sfff-if-block-rule-statements').html(newIfConditionElem).fadeIn('slow');
        }

        /*New if block header with any/all and and/or elements and one if statements row added*/
        ruleDiv.find('.sfff-rule-box-if-block').append(newSectionElem).fadeIn('slow');
        resetSelect2Element(newSectionElem);
        //  populateBlockSelect(newSectionElem,true);

    }); /*if-section items loop ends*/

    var andOrLinkHTML = $('#ruleBoxHtml .sff-and-or-link-box').clone().wrap('<p>').parent().html();
    ruleDiv.find('.sfff-rule-box-if-block').append(andOrLinkHTML).fadeIn('slow');

    if (ruleItem.RuleThenSectionList != null && ruleItem.RuleThenSectionList.length > 0) {
        /*then section items loop starts*/
        $.each(ruleItem.RuleThenSectionList, function(indx, conditionItem) {
            /*in loop - sectionItem consists of following items:
            -rrAction : "string" [show/hide/populate/displaymessage/readonly/required/notrequired/setpicklistvalues]
            -rrDataItems:array
            -rrDataSourceType : "string" [setpicklist/picklist]
            -rrIsOtherDynamic :bool
            -rrIsTargetDynamic : bool
            -rrOther : "string"
            -rrPopulateOther : bool
            -rrRefId : "string"
            -rrTarget : "string"
            */
            var newThenConditionElem = getThenSectionElemConfig(conditionItem);
            ruleDiv.find('.sfff-rule-box-then-block').find('.sfff-then-block-rule-statements').append(newThenConditionElem).fadeIn('slow');

        }); /*then section items loop ends*/
    } else {
        var newThenConditionElem = getThenSectionElemConfig(null);
        ruleDiv.find('.sfff-rule-box-then-block').find('.sfff-then-block-rule-statements').html(newThenConditionElem).fadeIn('slow');
    }

    ruleIndex = parseInt(ruleIndex) + 1;
    ruleDiv.find('.create-rule-sibling-block .vabuttonA1').attr('data-rule-index', ruleIndex);
    return ruleDiv;
}

function getCustomPicklistOptionsWrapper(optionsArr) {
    var selectElem = $('<select/>', {
        'class': 'picklist-hidden display-none',
        'onchange': 'callSaveRule(this,true)',
        'multiselect': 'false'
    });
    if (optionsArr != null && optionsArr.length > 0) {
        $.each(optionsArr, function(indx, optionItem) {
            optionItem=unescapeHTMLString(GetInputValue(optionItem));
            selectElem.append($('<option/>', {
                'value': optionItem
            }).html(optionItem));
        });
    }
    return selectElem;
}

function handleActionResponse(responseObj, errMsg, actionResponse, resetCurrentPageToFirst) {
    if (responseObj != null && responseObj.length > 0) {
        var errorMessage='';
        $.each( responseObj, function( index, resultItem ){
            if(!resultItem.IsValid){
            errorMessage+=resultItem.OtherText;
            }
        });
        if (errorMessage=='') {
            if (resetCurrentPageToFirst) {
                RECurrentPage = 1;
            }

            getRemoteAllRuleRecIdsJS(actionResponse);
        } else {
            resetREOverlayLoading(false);
            commonAlertMessage(errMsg, errorMessage);

        }
    } else {
        resetREOverlayLoading(false);
    }

}

function getIfSectionElemConfig(conditionItem) {
    var rcOperand1 = '';
    var rcOperand2 = '';
    var rcOperator = '';
    var rcIsOperand2Dynamic = false;
    var isOperand2DatasourceTypePicklist=false;
    var rcDataItems=[];
    if (conditionItem != null) {
        rcOperand1 = unescapeHTMLString(conditionItem.rcOperand1);
        rcOperand2 = unescapeHTMLString(conditionItem.rcOperand2);
        rcOperator = conditionItem.rcOperator;
        rcIsOperand2Dynamic = getSafeBoolean(conditionItem.rcIsOperand2Dynamic, false);
        rcDataItems = conditionItem.rcDataItems;
        isOperand2DatasourceTypePicklist = getSafeBoolean(conditionItem.rcDataSourceType == 'picklist', false);
    }
    var newIfConditionElem = getNewIfRuleHTML();
    newIfConditionElem.find('.rule-st-1 select').val(rcOperand1);
    newIfConditionElem.find('.rule-st-2 select').val(rcOperator);

    var thirdColElem = newIfConditionElem.find('.rule-st-3');

    if (rcIsOperand2Dynamic) {
        thirdColElem.addClass('dynamic-field');
        thirdColElem.find('.sfff-rule-st-existing-field-box').removeClass('display-none');
        thirdColElem.find('.sfff-rule-st-static-value-box').addClass('display-none');
        thirdColElem.find('.sfff-rule-st-existing-field-box select').val(rcOperand2);

    } else {
        thirdColElem.addClass('static-field');
        thirdColElem.find('.sfff-rule-st-static-value-box').removeClass('display-none');
        thirdColElem.find('.sfff-rule-st-existing-field-box').addClass('display-none');        
        if(isOperand2DatasourceTypePicklist){
            if (!isNullOrEmpty(rcDataItems)) {
                thirdColElem.find('.sfff-rule-st-static-value-box').find('.sfff-textbox').val(JSON.stringify(rcDataItems));
            }
        }else{
            thirdColElem.find('.sfff-rule-st-static-value-box').find('.sfff-textbox').val(rcOperand2);
            thirdColElem.find('.sfff-rule-st-static-value-box').find('.sfff-textarea').val(rcOperand2);
        }
    }
    return newIfConditionElem;

}

function getThenSectionElemConfig(conditionItem) {
    var rrAction = '';
    var rrTarget = '';
    var rrOther = '';
    var rrIsTargetDynamic = false;
    var rrIsOtherDynamic = false;
    var rrRefId = '';
    var rrDataItems = null;
    var rrDataSourceType='';
    if (conditionItem != null) {
        rrAction = conditionItem.rrAction;
        rrTarget = unescapeHTMLString(conditionItem.rrTarget);
        rrOther = unescapeHTMLString(conditionItem.rrOther);
        rrIsTargetDynamic = getSafeBoolean(conditionItem.rrIsTargetDynamic, false);
        rrIsOtherDynamic = getSafeBoolean(conditionItem.rrIsOtherDynamic, false);
        rrRefId = conditionItem.rrRefId;
        rrDataItems = conditionItem.rrDataItems;
        rrDataSourceType=conditionItem.rrDataSourceType;
    }
    var newThenConditionElem = getNewThenRuleHTML();
    if (!isNullOrEmpty(rrAction)) {
        newThenConditionElem.find('.rule-st-1 select').val(rrAction);
    }
    var isActionSetPicklist = getSafeBoolean(rrAction == 'setpicklistvalues', false);
    var isActionDatasourceTypePicklist = getSafeBoolean(rrDataSourceType == 'picklist', false);
    var isActionPopulate = getSafeBoolean(rrAction == 'populate', false);
    

    var secColElem = newThenConditionElem.find('.rule-st-2');

    if (rrIsTargetDynamic) {
        secColElem.addClass('dynamic-field');
        secColElem.find('.sfff-rule-then-field-list').removeClass('display-none');
        secColElem.find('.sfff-rule-then-show-error-msg').addClass('display-none');
        secColElem.find('.sfff-rule-then-field-list select').val(rrTarget);

    } else {
        secColElem.addClass('static-field');
        secColElem.find('.sfff-rule-then-show-error-msg').removeClass('display-none');
        secColElem.find('.sfff-rule-then-field-list').addClass('display-none');
        secColElem.find('.sfff-rule-then-show-error-msg').find('.sfff-textarea').val(rrTarget);
    }

    var thirdColElem = newThenConditionElem.find('.rule-st-3');
    if (rrIsOtherDynamic) {
        thirdColElem.addClass('dynamic-field');

        thirdColElem.find('.sfff-rule-then-existing-field-box').removeClass('display-none');
        thirdColElem.find('.sfff-rule-then-static-value-box').addClass('display-none');
        thirdColElem.find('.sfff-rule-then-existing-field-box select').val(rrOther);

    } else {
        thirdColElem.addClass('static-field');
        thirdColElem.find('.sfff-rule-then-static-value-box').removeClass('display-none');
        thirdColElem.find('.sfff-rule-then-existing-field-box').addClass('display-none');
        if(isActionDatasourceTypePicklist){
            if (!isNullOrEmpty(rrDataItems)) {
                thirdColElem.find('.sfff-rule-then-static-value-box').find('.sfff-textbox').val(JSON.stringify(rrDataItems));
            }
        }else{
            thirdColElem.find('.sfff-rule-then-static-value-box').find('.sfff-textbox').val(rrOther);
        }
        thirdColElem.find('.sfff-rule-then-static-value-box').find('.sfff-textbox').removeClass('display-none');
        thirdColElem.find('.sfff-rule-then-static-value-box').find('.sfff-textbox').attr('data-refid', rrRefId);
        thirdColElem.find('.sfff-rule-then-static-value-box').find('.sfff-textarea').val(rrOther);
    }
    if (isActionSetPicklist) {
        thirdColElem.find('.sfff-rule-then-setpicklistoptions').removeClass('display-none');
        if (!isNullOrEmpty(rrDataItems)) {
            var customPicklistElem = getCustomPicklistOptionsWrapper(rrDataItems);
            $(customPicklistElem).insertAfter(thirdColElem.find('.sfff-rule-then-setpicklistoptions select.sfff-picklist-elem'));
        }
        thirdColElem.find('.sfff-rule-then-populate-field').addClass('display-none');
    } else if (isActionPopulate) {
        thirdColElem.find('.sfff-rule-then-populate-field').removeClass('display-none');
    } else {
        thirdColElem.find('.sfff-rule-then-setpicklistoptions').addClass('display-none');
        thirdColElem.find('.sfff-rule-then-populate-field').addClass('display-none');
    }
    resetSelect2Element(newThenConditionElem);
    return newThenConditionElem;
}

/*RULE XML list parsing ends*/