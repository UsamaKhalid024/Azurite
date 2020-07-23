var sortableIDForGeneralFieldMenu = '#generalSortableForFields.dropfields';
var sortableIDForObjectFieldSearchMenu = '.list-toggle-div .dropfields';
var sortableIDForFormPage = '.form-canvas-multi-page-inner';
var sortableIDForFormSection = '.formSectionUlWrap';
var sortableIDForFormItemSection = '.formFieldUl';
var sortableIDForMatrixSection = '.matrix-section.matrix-section-holder';

/*Refresh child records start*/
function refreshChildRecordsFieldLi() {
    $('.list-toggle-div-wrap').each(function (indx, wrapperDiv) {

        if ($(wrapperDiv).attr('data-childclass') != undefined && $(wrapperDiv).attr('data-childclass') != "") {
            var sortableClassName = '';
            var clsName = safeStringValue($(wrapperDiv).attr('data-childclass'), '');
            var relListId = $(wrapperDiv).attr('id');
            var classnameindx = "";
            if (!isNullOrEmpty(relListId)) {
                classnameindx = relListId.replace('ListMainRel', '');
                if (!isNullOrEmpty(classnameindx)) {

                    sortableClassName = 'sortableForRelFields' + classnameindx;
                }
            }
            if (!isNullOrEmpty(sortableClassName)) {
                $("#mainMultiPageWrapper .formFieldUl li." + sortableClassName).each(function () {

                    var colorcode = $(this).find('.obj-info').attr('data-colorcode');

                    if (!isNullOrEmpty(colorcode)) {
                        $(this).find('.obj-info').attr('data-listname', sortableClassName);
                        RemoveAllClassColorCodes(this);
                        var previousClass = colorcode;
                        $(this).removeClass(previousClass);
                        $(this).addClass(clsName);
                        var elemId = $(this).find(".fieldDiv").find('>select,>input,input.ff-input-type,>textarea').attr('id');
                        console.log(' previousClass:' + previousClass + ' clsName:' + clsName);

                        var newelemId = elemId.replace('.' + previousClass + '.', '.' + clsName + '.');
                        var finalElemId = newelemId;
                        var newelemIdWODot = newelemId.replace(/\./g, '');


                        $(this).find('.obj-info').attr('data-colorcode', clsName);
                        var newElemIdWOCodenDot = replaceAllColorCodeFromId(newelemId);
                        newElemIdWOCodenDot = newElemIdWOCodenDot.replace(/\./g, '');
                        $(this).find(".labelDiv label.ff-label").attr('id', 'lbl' + newElemIdWOCodenDot);
                        var mainFieldElement = $(this).find(".fieldDiv").find('>select,>input,input.ff-input-type,input[type=hidden],>textarea');

                        $(mainFieldElement).each(function (indx, inputElem) {
                            if ($(inputElem).attr('type') == 'hidden') {
                                $(inputElem).attr('id', finalElemId + 'hidden');
                                $(inputElem).attr('name', finalElemId + 'hidden');
                            } else {
                                $(inputElem).attr('id', finalElemId);
                                $(inputElem).attr('name', finalElemId);
                            }
                        });


                        $(this).attr('id', 'lblli' + newelemIdWODot);


                    }

                });
            }

        }
    });

    $('.form-information .secName-wrap').each(function (indx, objItem) {
        if ($(objItem).hasClass('object-detail')) {
            var isMatrixExist = false;
            var relIndex = indx + 2;
            if ($(objItem).hasClass('is-repeat')) {
                var ulItem = $('<ul/>');
                if ($("#mainMultiPageWrapper .formFieldUl li.sortableForRelFields" + relIndex).first().length > 0 && !$("#mainMultiPageWrapper .formFieldUl li.sortableForRelFields" + relIndex).first().parents('.formSectionUl').hasClass('section-repeat')) {
                    var parentULElem = $("#mainMultiPageWrapper .formFieldUl li.sortableForRelFields" + relIndex).first().parent();
                    $("#mainMultiPageWrapper .formFieldUl li.sortableForRelFields" + relIndex).each(function (id, liItem) {
                        
                        // clone non-matrix field
                        if($(liItem).parents('.matrix-section-container').length == 0){
                            $(ulItem).append($(liItem).clone());
                            $(this).remove();
                        } else if ($(liItem).parents('.matrix-section-container').length > 0 && $(liItem).find('.matrix-elem').attr('data-matrix-isPrimary') === 'true'){
                            // if field is primary clone the matrix section with it's fields and remove it from form
                            // then skip next matrix field if it's not primary matrix
                            matrixSection = $(liItem).parents('.matrix-section-container');
                            $(ulItem).append($(matrixSection).clone());
                            $(matrixSection).remove();
                            isMatrixExist = true;
                        }
                    });

                    var lastFieldUlLiItem = $("#mainMultiPageWrapper .form-canvas-multi-page-inner .formSectionUl:last-child .formFieldUl").last();
                    if ($("#mainMultiPageWrapper .form-canvas-multi-page-inner .formSectionUl:last-child .formFieldUl").last().find('>li.fieldLi').length > 0) {
                        addNewSectionItem($(lastFieldUlLiItem).parents('.fc-multi-page-item').find('>.add-newsection-box>a'), false);
                    }

                    var sectionUlElem = $('#mainMultiPageWrapper .form-canvas-multi-page-inner .formSectionUl').last();
                    var childIndx = $(objItem).attr('data-relobj');
                    $(sectionUlElem).attr('data-childclass', colorTagArray[childIndx]);
                    $(sectionUlElem).attr('data-sortableclass', 'sortableForRelFields' + relIndex);
                    $(sectionUlElem).addClass('section-repeat')
                    $(sectionUlElem).find('.formFieldUl').append($(ulItem).html());
                    
                    if (isMatrixExist) {
                        makeMatrixSortable();
                    }
                }
            } else {
                if ($("#mainMultiPageWrapper .formFieldUl li.sortableForRelFields" + relIndex).first().length > 0) {
                    var formSectionUlElem = $("#mainMultiPageWrapper .formFieldUl li.sortableForRelFields" + relIndex).first().parents('.formSectionUl');
                    $(formSectionUlElem).removeClass('section-repeat');
                    $(formSectionUlElem).removeAttr('data-childclass');
                    $(formSectionUlElem).removeAttr('data-sortableclass');
                }
            }
            isChangesMadeInForm = true;
        }
    });
    $("#mainMultiPageWrapper .formFieldUl li.fieldLi:not(.generalSortableForFields)").each(function (index, fieldLiElem) {

        for (indx = $('.list-toggle-div-wrap').length + 1; indx < 25; indx++) {
            var sortableClassName = 'sortableForRelFields' + indx;
            if ($(fieldLiElem).hasClass(sortableClassName)) {
                /*to remove extra li items  which are not belong to any related object anymore */
                $(fieldLiElem).remove();
            }
        }
    });
    $("#mainMultiPageWrapper .formFieldUl li.fieldLi:not(.generalSortableForFields)").each(function (index, fieldLiElem) {
        var fieldLiClass = $(fieldLiElem).attr("class");

        var liIsChildObject = false;
        if (!isNullOrEmpty($(fieldLiElem).find('.obj-info').attr('data-colorcode'))) {
            liIsChildObject = true;
        }
        var listid = $(fieldLiElem).find('.obj-info').attr('data-listname');

        if (!isNullOrEmpty(listid)) {
            if (liIsChildObject) {
                var datachildclass = $('#' + listid).parents('.list-toggle-div-wrap').attr('data-childclass');
                var elemid = $(fieldLiElem).find('.fieldDiv').find('>select,>input,input.ff-input-type,input[type=hidden],>textarea').attr('id');
                if (!isNullOrEmpty(datachildclass) && $(fieldLiElem).hasClass(datachildclass) && !isNullOrEmpty(elemid) && elemid.split('.').length == 3 && elemid.split('.')[1] != $('#' + listid).parents('.list-toggle-div-wrap').find('.objName').attr('id')) {
                    /*to remove li items  which are not belong to any related child object */
                    $(fieldLiElem).remove();
                }
            } else if (!liIsChildObject) {

                var elementName = $(fieldLiElem).attr("title");
                var lookupobjid = $('#' + listid).parents('.list-toggle-div-wrap').find('.objName').attr('id');
                if (!isNullOrEmpty(elementName) && $('#' + listid).parents('.list-toggle-div-wrap').find('.objName').text() == elementName.replace('(Lookup)', "(" + lookupobjid + ")")) {
                    /*to remove li items  which are not belong to any related lookup object */
                    $(fieldLiElem).remove();
                }

            }
        }
    });

    $('.availableHeaderDiv').removeClass('activeTab');
    $('.genlist-toggle-div-wrap').show();
    refreshRelatedObjectInfo('.select-secondary-element-wrapper');

}
/*Refresh child records end*/
function refreshRelatedObjectInfo(parentMainWrapper) {

    var selectHTML = getRelatedObjSelectOptionHTML();
    $(parentMainWrapper).find('.secondary-object-block').each(function (indx, selectParentDiv) {
        restructureRelatedObjSelectElement($(selectParentDiv).find('select.select-secondary-element'), selectHTML);
        $(selectParentDiv).find('.select2-container.select-secondary-element a.select2-choice').removeClass('ff-repeat');
        var dataRelIndex = $(selectParentDiv).find('select.select-secondary-element').attr('data-detail-index');
        if (!isNullOrEmpty(dataRelIndex) && $('.form-information').find('.object-detail.relobj-' + dataRelIndex).hasClass('is-repeat')) {
            $(selectParentDiv).find('input.chkbx-repeating').prop('checked', true);
        }
    });

    setColorTag();
}

function disableSelectLookupOption() {
    var lookupSelected = [];
    $('.select-secondary-element-wrapper .secondary-object-block select').each(function (indx, selectElement) {
        if ($(selectElement).find('option:selected').attr('name') == 'lookup') {
            // lookupSelected.push({"order":indx,"svalue":$(selectElement).val()});
            lookupSelected.push($(selectElement).val());
        }
    });
    $('.select-secondary-element-wrapper .secondary-object-block select option').each(function (indx, optionelem) {
        var optgrpclass = $(optionelem).parent().attr('class');
        if (!isNullOrEmpty(optgrpclass) && optgrpclass == 'LookupOption') {
            $(optionelem).removeAttr('disabled', 'disabled');
            $(optionelem).removeClass('display-none');
        }
    });

    $('.select-secondary-element-wrapper .secondary-object-block select').each(function (selindx, selectElement) {
        $(selectElement).find('optgroup').each(function (index, optgroup) {
            var optgrpclass = $(optgroup).attr('class');
            if (!isNullOrEmpty(optgrpclass) && optgrpclass == 'LookupOption') {
                $(optgroup).find('option').each(function (indx, optionelem) {

                    if (!$(optionelem).is(':selected') && $.inArray($(optionelem).val(), lookupSelected) >= 0) {


                        $(optionelem).attr('disabled', 'disabled');
                        $(optionelem).addClass('display-none');

                    } else {

                    }
                });
            }
        });

    });
}

function createRelJSONObj(relatedObjectName) {
    var data = {
        "object": relatedObjectName
    };
    return data;
}

function selectSecNameIdByIndex(senderCount) {
    var idstr = "";

    $(".ObjectName span.secName").each(function (index) {
        if (index == senderCount) {

            idstr = $(this).attr('id');
        }

    });
    return idstr;
}

function selectSecNameTextByIndex(senderCount) {
    var idstr = "";

    $(".ObjectName span.secName").each(function (index) {
        if (index == senderCount) {

            idstr = $(this).text();
        }

    });
    return idstr;
}

function selectRelObjIdByIndex(senderCount) {
    var idstr = "";

    $(".ObjectName span.secName").each(function (index) {
        if ((index + 1) == senderCount) {

            idstr = $(this).attr('id');
        }

    });
    return idstr;
}

function getSafeRelObjAttribute(senderCount, attrName, defaultValue) {
    var returnvalue = defaultValue;
    try {
        var index = senderCount;

        if ($($(".ObjectName span.secName")[index]).length > 0) {
            returnvalue = $($(".ObjectName span.secName")[index]).attr(attrName);
        }
    } catch (err) {
        console.log('Attribute value not found');
    }
    return returnvalue;
}

function selectRelObjTextByIndex(senderCount) {
    var idstr = "";

    $(".ObjectName span.secName").each(function (index) {
        if ((index + 1) == senderCount) {

            idstr = $(this).text();
        }

    });
    return idstr;
}

function selectSecNameHtmlByIndex(senderCount) {
    var idstr = "";

    $(".ObjectName span.secName").each(function (index) {
        if (index == senderCount) {

            idstr = $(this).html();
        }

    });
    return idstr;
}

function selectRelObjDataAttrByIndex(senderCount, attrName) {
    var idstr = "";

    $(".ObjectName span.secName").each(function (index) {
        if ((index + 1) == senderCount) {

            idstr = $(this).attr(attrName);
        }

    });
    return idstr;
}

function isSecNameElemExistsByIndex(senderCount) {
    var isexists = false;

    if ($(".ObjectName span.secName").length > senderCount) {
        isexists = true;
    }


    return isexists;
}

function RemoveAllClassColorCodes(elem) {
    $(elem).removeClass('A');
    $(elem).removeClass('B');
    $(elem).removeClass('C');
    $(elem).removeClass('D');
    $(elem).removeClass('E');
    $(elem).removeClass('F');
    $(elem).removeClass('G');
    $(elem).removeClass('H');
    $(elem).removeClass('I');
    $(elem).removeClass('J');
    $(elem).removeClass('K');
    $(elem).removeClass('L');
    $(elem).removeClass('M');
    $(elem).removeClass('N');
}

function replaceAllColorCodeFromId(elemId) {
    // replcae child class characters from id
    var returnId = elemId;
    if (!isNullOrEmpty(returnId)) {

        returnId = returnId.replace('.A.', '.');
        returnId = returnId.replace('.B.', '.');
        returnId = returnId.replace('.C.', '.');
        returnId = returnId.replace('.D.', '.');
        returnId = returnId.replace('.E.', '.');
        returnId = returnId.replace('.F.', '.');
        returnId = returnId.replace('.G.', '.');
        returnId = returnId.replace('.H.', '.');
        returnId = returnId.replace('.I.', '.');
        returnId = returnId.replace('.J.', '.');
        returnId = returnId.replace('.K.', '.');
        returnId = returnId.replace('.L.', '.');
        returnId = returnId.replace('.M.', '.');
        returnId = returnId.replace('.N.', '.');
    }
    return returnId;
}

function removeColorCodes(elemtext) {
    var elemtxt = elemtext;
    if (!isNullOrEmpty(elemtext)) {
        elemtxt = elemtxt.replace(' A', ' ');
        elemtxt = elemtxt.replace(' B', ' ');
        elemtxt = elemtxt.replace(' C', ' ');
        elemtxt = elemtxt.replace(' D', ' ');
        elemtxt = elemtxt.replace(' E', ' ');
        elemtxt = elemtxt.replace(' F', ' ');
        elemtxt = elemtxt.replace(' G', ' ');
        elemtxt = elemtxt.replace(' H', ' ');
        elemtxt = elemtxt.replace(' I', ' ');
        elemtxt = elemtxt.replace(' J', ' ');
        elemtxt = elemtxt.replace(' K', ' ');
        elemtxt = elemtxt.replace(' L', ' ');
        elemtxt = elemtxt.replace(' M', ' ');
        elemtxt = elemtxt.replace(' N', ' ');
    }
    return elemtxt;
}

function isIdHasChildColorCode(elemtext) {
    console.log('listname-- ' + elemtext);
    var returnflag = false;
    if (!isNullOrEmpty(elemtext) && colorTagArray.indexOf(elemtext + '') >= 0) {
        returnflag = true;
    }
    return returnflag;
}

function resetSavedButton() {
    isChangesMadeInForm = true;
}

function isNumber(n) {
    return (parseFloat(n) == n);
}

function fancydropdowntoggle(dv) {
    $('#limitValue').focus();
    var myRegExp = /\.[0-9a-z]+$/i;
    if ($('#customfltype').val() == "") {
        $(dv).next().toggle();
        $(dv).next().next().toggle();
    } else {
        if (myRegExp.test($('#customfltype').val())) {
            $(dv).next().toggle();
            $(dv).next().next().toggle();
            //isChangesMadeInForm = true;    
        } else {
            $('.ExCol').attr('src', ffcommonResuorceUrl + '/iconimages/SelectArrowDown.png');
            $("#customfltype").next().remove();
            $("#selectedfiletypes").val('');
            $("#customfltype").after('<span style="color:red;">Please provide comma-separated extensions (e.g. .doc, .txt)</span>');
            $("#customfltype").css('border', '1px solid red');
            $("#customfltype").focus();
        }
    }

    if ($('.fancydropdown').css('display') != 'none') {
        $('.fancyheader').addClass('addFancy');
        $('.fancydropdown').addClass('addFancyTop');
        $('.fancydropdownbottom').addClass('addFancyBottom');
        $('.ExCol').attr('src', ffcommonResuorceUrl + '/iconimages/SelectArrowUp.png');
    } else {
        $('.fancyheader').removeClass('addFancy');
        $('#trForFileField td').removeAttr('style');
        $('.fancyheader').attr('title', $("#selectedfiletypes").val());
        $('.ExCol').attr('src', ffcommonResuorceUrl + '/iconimages/SelectArrowDown.png');
    }


    //Dropdown
    $(".flChk").click(function () {
        var ck = '';
        var totCheck = 0;
        var getCheck = 0;
        $(".flChk").each(function () {
            totCheck += 1;
            if ($(this).is(":checked")) {
                ck += $(this).val() + ",";
            } else {
                getCheck += 1;
            }
        });
        if ($('#customfltype').val() == "") {
            $("#selectedfiletypes").val(ck.slice(0, -1));
            $('.fancyheader span').text(ck.slice(0, -1))
        } else {
            ck += $("#customfltype").val();
            $("#selectedfiletypes").val(ck);
            $('.fancyheader span').text(ck)
        }
        if (totCheck == getCheck) {
            $('.fancyheader span').text("All");
            $("#customfltype").val('');
        }
        addLabel($(this));
        resetSavedButton();

    });
    $("#customfltype").bind("change", function () {

        $("#selectedfiletypes").val($(this).val());
        $("#customfltype").css('border', 'none');
        $("#customfltype").next().remove();
        var ck = '';
        var isGet = false;
        $(".flChk").each(function () {
            if ($(this).is(":checked")) {
                ck += $(this).val() + ",";
                isGet = true;
            }
        });
        if ($('.fancyheader span').text() == "") {
            $('.fancyheader span').text("All");
        }
        var myRegExp = /\.[0-9a-z]+$/i;
        if ($('#customfltype').val() == "") {
            $("#selectedfiletypes").val(ck.slice(0, -1));
        } else {
            if (myRegExp.test($('#customfltype').val())) {
                ck += $("#customfltype").val() + ',';
                $("#selectedfiletypes").val(ck.slice(0, -1));
                $('.fancyheader span').text($("#selectedfiletypes").val());
                isFFValid = true;

                addLabel($(this));

            } else {
                $("#selectedfiletypes").val('');
                $("#customfltype").after('<span style="color:red;">Please provide comma-separated extensions (e.g. .doc, .txt)</span>');
                $("#customfltype").css('border', '1px solid red');
                $("#customfltype").focus();
                isFFValid = false;

            }
        }
    });

}

function resetFloat() {
    resetScroll();

}

function scrollAvailableDiv() {
    var margintop = 140;
    if (msieversion() > 0 && !$("#mainDiv").hasClass('msIE')) {
        $("#mainDiv").addClass('msIE');
    }
    $(window).scroll(function () {

        var legendOffset = $('.form-editor-title-box').offset().top + $('.form-editor-title-box').height(); ///$('#headerPanel').offset().top+$('#headerPanel').height()+100;
        var headerLegendOffset = $('#sfff-form-editor').offset().top;
        var scroll = $(this).scrollTop();
        var formCanvasBottom = $('#sfff-form-editor .main-content-holder').offset().top + $('.main-content-holder').height();
        var availableFieldBottom = $('#availableFieldBox').offset().top + $('#availableFieldBox').height() - 1;

        if (scroll <= legendOffset || legendOffset == 0) {

            if ($('#sfff-form-editor .main-content-holder').hasClass('floating-sidebar')) {
                $('#availableFieldBox').css({
                    'position': 'relative',
                    'top': 'auto',
                    'margin-top': 0
                });
                $('.form-floating-actions').hide();
                $('#sfff-form-editor .main-content-holder').removeClass('floating-sidebar');
            }

        } else {
            if (scroll > headerLegendOffset) {



                $('#availableFieldBox').css({
                    'position': 'fixed',
                    'top': 0,
                    'margin-top': 1
                });
            } else {
                $('#availableFieldBox').css({
                    'position': 'relative',
                    'top': 'auto',
                    'margin-top': 0
                });
            }

            if (!$('#sfff-form-editor .main-content-holder').hasClass('floating-sidebar')) {


                $('#sfff-form-editor .main-content-holder').addClass('floating-sidebar');
                $('.form-floating-actions').show();
            }

        }
    });
}

function setElementIdWithIndx(pID, elemSource, elemIndx, prefix) {
    $(elemSource).attr('id', prefix + pID + elemIndx);
}

function setElementNameWithIndx(pName, elemSource, elemIndx, prefix) {
    $(elemSource).attr('name', prefix + pName + elemIndx);
}

function assignSignatureElementIds(parentElement, signatureIndex) {

    // Agreed Field
    setIDAndName('chkffsignagree', $(parentElement).find('.ff-chkagree input[type="checkbox"]'), signatureIndex, '');

    // Email Field
    setIDAndName('ffsignEmail', $(parentElement).find('.ff-email-verification .ff-input-type'), signatureIndex, '');

    $(parentElement).find('.ff-signwrapper').each(function (ind, signElement) {

        // ID changes according if user selection, Drawing or text
        var signoptclass = 'signT';
        if ($(signElement).hasClass('ff-drawn')) {
            signoptclass = 'signD';
        }

        // Full Name Field
        setIDAndName('ffsignature', $(signElement).find('.docsignWrapper .ffsignature'), signatureIndex, signoptclass);

        // Date Field
        setIDAndName('ffdate', $(signElement).find('.docsignWrapper .ffdate'), signatureIndex, signoptclass);

        // Drawing Full Name Field
        setIDAndName('ffSignedName', $(signElement).find('.docsignWrapper .outputSignedName'), signatureIndex, signoptclass);

        // Drawaing Date Field
        setIDAndName('ffSignedDate', $(signElement).find('.docsignWrapper .outputSignedDate'), signatureIndex, signoptclass);
    });
}

function setIDAndName(pID, pField, pSignatureIndex, pSignoptclass) {
    setElementIdWithIndx(pID, pField, pSignatureIndex, pSignoptclass);
    setElementNameWithIndx(pID, pField, pSignatureIndex, pSignoptclass);
}

function setDefaultSignatureElementValues(inputSignatureElement) {
    // var inputSignatureElement=ui.item.find('.eSignatureFieldDiv .ffd-esignature-input');
    setInputAttributeName(inputSignatureElement, 'data-signtype', 'full');
    setInputAttributeName(inputSignatureElement, 'data-signoptions', 'typed');
    setInputAttributeName(inputSignatureElement, 'data-signlabel', 'Full Name');
    setInputAttributeName(inputSignatureElement, 'data-signdate', 'Date');
    setInputAttributeName(inputSignatureElement, 'data-signdatehide', 'false');
    setInputAttributeName(inputSignatureElement, 'data-signagreehide', 'true');
    setInputAttributeName(inputSignatureElement, 'data-signagree', 'I agree to terms and services');
    setInputAttributeName(inputSignatureElement, 'data-emailenabled', 'false');
    setInputAttributeName(inputSignatureElement, 'data-emaillabel', 'Email');
}

function getAttributeNameIfExists(elemSource, attrName, defaultvalue) {
    var stringReturn = defaultvalue;
    if (!isNullOrEmpty($(elemSource).attr(attrName))) {
        stringReturn = $(elemSource).attr(attrName);
    }
    return stringReturn;
}

function setInputAttributeName(elemSource, attrName, elemvalue) {
    $(elemSource).attr(attrName, elemvalue);
}

function resetESignatureElement(elemSource, isAutoSave) {
    var inputSignatureElement = $(elemSource).find('.eSignatureFieldDiv .ffd-esignature-input');
    var signType = getAttributeNameIfExists(inputSignatureElement, 'data-signtype', 'full');

    var signOptions = getAttributeNameIfExists(inputSignatureElement, 'data-signoptions', 'typed');
    var signLabel = getAttributeNameIfExists(inputSignatureElement, 'data-signlabel', 'Full Name');
    var signDate = getAttributeNameIfExists(inputSignatureElement, 'data-signdate', 'Date');
    var signDateHide = getAttributeNameIfExists(inputSignatureElement, 'data-signdatehide', 'false');
    var signAgreeHide = getAttributeNameIfExists(inputSignatureElement, 'data-signagreehide', 'true');
    var signAgree = getAttributeNameIfExists(inputSignatureElement, 'data-signagree', 'I agree to terms and services');
    var signEmailLabel = getAttributeNameIfExists(inputSignatureElement, 'data-emaillabel', 'Email');
    var signEmailEnabled = getAttributeNameIfExists(inputSignatureElement, 'data-emailenabled', 'false');
    var options = {
        name: '.ffsignature',
        penColour: '#052942',
        drawOnly: false,
        typed: '.typedSignName',
        output: '.outputSignedName',
        drawIt: '.ffdrawIt a',
        sig: 'docsignWrapper',
        clear: '.ffclearButton a',
        canvas: '.signPadName',
        onBeforeValidate: 'validateDocSign',
        errorMessage: 'please provide a signature',
        errorMessageDraw: 'please sign in this block',
        errorClass: 'ff-error',
        validateFields: false
    };
    var optionsDate = {
        name: '.ffdate',
        penColour: '#052942',
        drawOnly: false,
        typed: '.typedSignDate',
        output: '.outputSignedDate',
        drawIt: '.ffdrawIt a',
        sig: 'docsignWrapper',
        clear: '.ffclearButton a',
        canvas: '.signPadDate',
        onBeforeValidate: 'validateDocSign',
        errorMessage: 'please provide a date',
        errorMessageDraw: 'please provide a date',
        errorClass: 'ff-error',
        validateFields: false
    };
    if (signType == 'initials') {

        $(elemSource).find('.ff-signwrapper.ff-typed .doc-sign-name .ffsignature').attr('maxlength', 6);
        $(elemSource).find('.ff-signwrapper.ff-typed .doc-sign-name .docsignWrapper .signPadName').attr('width', '120');
        $(elemSource).find('.ff-signwrapper.ff-drawn .doc-sign-name .docsignWrapper .signPadName').attr('width', '120');
    } else {
        $(elemSource).find('.ff-signwrapper.ff-typed .doc-sign-name .ffsignature').removeAttr('maxlength');
        $(elemSource).find('.ff-signwrapper.ff-typed .doc-sign-name .docsignWrapper .signPadName').attr('width', '232');
        $(elemSource).find('.ff-signwrapper.ff-drawn .doc-sign-name .docsignWrapper .signPadName').attr('width', '232');
    }

    var signInstance = $(elemSource).find('.ff-signwrapper.ff-typed .doc-sign-name').signaturePad(options);

    var signInstanceDate = $(elemSource).find('.ff-signwrapper.ff-typed .doc-sign-date').signaturePad(optionsDate);
    options['drawOnly'] = true;
    var signInstance = $(elemSource).find('.ff-signwrapper.ff-drawn .doc-sign-name').signaturePad(options);

    optionsDate['drawOnly'] = true;
    var signInstanceDate = $(elemSource).find('.ff-signwrapper.ff-drawn .doc-sign-date').signaturePad(optionsDate);
    /*Updating properties*/


    $(elemSource).find('.ff-chkagree > label').html(signAgree);
    $(elemSource).find('.ff-email-verification  label.ff-label').html(signEmailLabel);
    $(elemSource).find('.ff-signwrapper').each(function (ind, signElement) {
        $(signElement).find('.doc-sign-name .ffsign-label>label').html(signLabel);
        $(signElement).find('.doc-sign-date .ffsign-label>label').html(signDate);

        if (signDateHide == true || signDateHide == 'true') {
            $(signElement).find('.doc-sign-date input[type="hidden"]').attr('data-isrequired', false);
            $(signElement).find('.doc-sign-date').slideUp();
        } else {
            $(signElement).find('.doc-sign-date input[type="hidden"]').attr('data-isrequired', true);
            $(signElement).find('.doc-sign-date').slideDown();
        }
    });
    $(elemSource).find('.main-docsign-wrapper').removeClass('ffs-typed');
    $(elemSource).find('.main-docsign-wrapper').removeClass('ffs-both');
    $(elemSource).find('.main-docsign-wrapper').removeClass('ffs-drawn');
    $(elemSource).find('.main-docsign-wrapper').addClass('ffs-' + signOptions);
    $(elemSource).find('.main-docsign-wrapper').removeClass('ffs-full');
    $(elemSource).find('.main-docsign-wrapper').removeClass('ffs-initials');
    $(elemSource).find('.main-docsign-wrapper').addClass('ffs-' + signType);


    if (signOptions == 'drawn') {
        switchSignTab($(elemSource).find('.main-docsign-wrapper').find('li.ffdrawIt>a'));
    } else {
        switchSignTab($(elemSource).find('.main-docsign-wrapper').find('li.fftypeIt>a'));
    }
    if (signAgreeHide == true || signAgreeHide == 'true') {
        $(elemSource).find('.ff-chkagree > input').attr('data-isrequired', false);
        $(elemSource).find('.ff-chkagree').slideUp();
        $(elemSource).find('.ff-chkagree').hide();

    } else {
        $(elemSource).find('.ff-chkagree').slideDown();
        $(elemSource).find('.ff-chkagree > input').attr('data-isrequired', true);
    }
    $(elemSource).find('.ff-email-verification .ff-required-mark').remove();
    if (signEmailEnabled == true || signEmailEnabled == 'true') {
        $(elemSource).find('.ff-email-verification > input').attr('data-isrequired', true);
        $(elemSource).find('.ff-email-verification').slideDown();
        $(elemSource).find('.ff-email-verification .ffsign-label').append('<span class="ff-required-mark">*</span>');
    } else {
        $(elemSource).find('.ff-email-verification').slideUp();
        $(elemSource).find('.ff-email-verification').hide();
        $(elemSource).find('.ff-email-verification > input').attr('data-isrequired', false);
    }
    $(elemSource).find('input.hasDate').datetimepicker({
        showTimepicker: false,
        addSliderAccess: true,
        sliderAccessArgs: {
            touchonly: false
        },
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+10",
        onSelect: function (dateText) {
            $(elemSource).find('.ff-signwrapper.ff-typed .typedSignDate').text(dateText);
        },
        constrainInput: false
    });
    $(elemSource).find('input.hasDate').attr('maxlength', 10);
    $(elemSource).find('input.hasDate').attr('vatt', 'DATE');
    if (isAutoSave) {
        isChangesMadeInForm = true;
        autosaveTriggered();
    }
}

function clearDrawnElements(elemSource) {

    $(elemSource).parents('.main-docsign-wrapper').find('.ff-signwrapper.ff-drawn .doc-sign-name').signaturePad().clearCanvas();
    $(elemSource).parents('.main-docsign-wrapper').find('.ff-signwrapper.ff-drawn .doc-sign-date').signaturePad().clearCanvas();
}

function switchSignTab(elemSource) {
    $(elemSource).parents('.main-docsign-wrapper').find('.ff-sign-ul li a').removeClass('current');
    $(elemSource).addClass('current');
    $(elemSource).parents('.main-docsign-wrapper').find('.ff-signwrapper').addClass('display-none');
    if ($(elemSource).attr('data-signed') == 'drawn') {
        $(elemSource).parents('.main-docsign-wrapper').find('.ff-signwrapper.ff-drawn').removeClass('display-none');
        $(elemSource).parents('.main-docsign-wrapper').find('.ff-sign-div .ffclearButton').css('visibility', 'visible');
    } else {
        $(elemSource).parents('.main-docsign-wrapper').find('.ff-signwrapper.ff-typed').removeClass('display-none');
        $(elemSource).parents('.main-docsign-wrapper').find('.ff-sign-div .ffclearButton').css('visibility', 'hidden');
    }
}

function bindLabelDoubleClick(parentElementSource) {
    var labelElement = (parentElementSource).find('label.ff-label:first');

    $(labelElement).bind("dblclick", (function () {
        var $input = $('<input />', {
            'class': 'ff-label ff-label-input'
        });
        $input.val($(this).text());

        $(labelElement).html('');
        $(labelElement).append($input);

    }));
    $(labelElement).find('input').on("blur", (function () {
        $(labelElement).text($(this).val());

    }));

}

function editFFLabel(elemSource) {
    console.log('[FORM] [editFFLabel] Starts');

    try {

        var metadata = {
            field_name: ''
        };
        sendInfoToIntercom('trackEvent', 'changed-label', metadata);
    } catch (err) {
        console.log('Warning:' + err.message);
    }
    var elem = $(elemSource);
    var parentClass = $(elemSource).attr('class');
    if ($(elem).find('.ff-label-input').length < 1) {

        var $input = $('<textarea />', {
            'class': 'ff-label ff-label-input',
            'onblur': 'backToFFLabel(this,false);',
            'data-parentclass': 'ff-label',
            'data-parentclassnames': parentClass
        });
        var labelVal = GetInputValueAsHTML($(elem).html());
        if ($(elem).text() == String.fromCharCode(160))
            labelVal = '';

        $input.val(SetInputValue(labelVal));

        $(elem).attr('data-text', $(elem).text());
        $(elem).html('');

        $(elem).append($input);
        $(elem).find('.ff-label-input').focus();
    }
}

function editFFPage(elemSource) {
    var elemLabel = $(elemSource); //.find('label.ff-section-header');
    var elemid = $(elemLabel).attr('id');

    var elem = $(elemLabel);
    if ($(elem).find('.ff-label-input').length < 1) {

        var $input = $('<textarea />', {
            'class': 'ff-page-header ff-label-input',
            'onblur': 'backToFFLabel(this,false);',
            'data-parentclass': 'ff-page-header'
        });

        var vElementHTML = SetInputValue(GetInputValueAsHTML($(elem).html()));
        var vElementText = $(elem).text();

        console.log(vElementHTML);
        console.log(vElementText);

        $input.val(vElementHTML);

        $(elem).attr('data-text', vElementText);
        $(elem).html('');

        $(elem).append($input);
        $(elem).find('.ff-label-input').focus();
    }
}

function editFFSection(elemSource) {
    var elemLabel = $(elemSource); //.find('label.ff-section-header');
    var elemid = $(elemLabel).attr('id');

    var elem = $(elemLabel);
    if ($(elem).find('.ff-label-input').length < 1) {

        var $input = $('<textarea />', {
            'class': 'ff-section-header ff-label-input',
            'onblur': 'backToFFLabel(this,false);',
            'data-parentclass': 'ff-section-header'
        });
        $input.val(SetInputValue(GetInputValueAsHTML($(elem).html())));

        $(elem).attr('data-text', $(elem).text());
        $(elem).html('');

        $(elem).append($input);
        $(elem).find('.ff-label-input').focus();
        // $(elem).find('.ff-label-input').autogrow({onInitialize: true});
    }
}

function editPaymentFFLabel(elem) {

    if ($(elem).find('.ff-label-input').length < 1) {
        var $input = $('<textarea />', {
            'class': 'ff-label ff-label-input',
            'onblur': 'backToFFLabel(this,true);',
            'data-parentclass': 'ff-label'
        });
        $input.val(SetInputValue(GetInputValueAsHTML($(elem).html())));

        $(elem).attr('data-text', $(elem).text());
        $(elem).html('');

        $(elem).append($input);
        $(elem).find('.ff-label-input').focus();
    }
}

function editESignLabel(elem, isSignOrDate, pSource) {
    var mainSignatureParent = $(elem).parents('.main-docsign-wrapper');

    try {

        var metadata = {
            field_name: ''
        };
        sendInfoToIntercom('trackEvent', 'changed-label', metadata);
    } catch (err) {
        console.log('Warning:' + err.message);
    }

    if ($(elem).find('.ff-label-input').length < 1 && $(elem).parents('.fieldLi').find('.ExpandDivESignature').length < 1) {

        var $input = $('<textarea />', {
            'class': 'ff-label ff-label-input',
            'onblur': 'backToESignLabel(this,' + isSignOrDate + ',\'' + pSource + '\');',
            'data-parentclass': 'ff-label'
        });
        var labelVal = SetInputValue(GetInputValueAsHTML($(elem).html()));
        if ($(elem).text() == String.fromCharCode(160)) {
            labelVal = '';
        }
        $input.val(labelVal);

        $(elem).attr('data-text', SetInputValue(GetInputValueAsHTML($(elem).text())));
        $(elem).html('');

        $(elem).append($input);
        $(elem).find('.ff-label-input').focus();
    }
}

function backToESignLabel(elem, isSignOrDate, pSource) {

    var labelElement;
    var parentElementBlock = $(elem).parents('.ff-signwrapper-outer');
    if (isSignOrDate) {
        parentElementBlock = $(elem).parents('.ff-sign-block');
    }
    var parentClass = $(elem).attr('data-parentclass');
    if (!isNullOrEmpty($(elem).attr('data-parentclass'))) {
        labelElement = $(elem).parents('label.' + parentClass + '');
    }
    var newvalue = GetInputValueAsHTML($(labelElement).find('.ff-label-input').val());

    $(labelElement).find('.ff-label-input').remove();
    $(labelElement).html(SetInputValue(newvalue));

    switch (pSource) {
        case 'Agree':
            $(parentElementBlock).parents('.eSignatureFieldDiv').find('>input.ffd-esignature-input').attr('data-signagree', SetInputValue(newvalue));
            break;
        case 'Email':
            $(parentElementBlock).parents('.eSignatureFieldDiv').find('>input.ffd-esignature-input').attr('data-emaillabel', SetInputValue(newvalue));
            break;
        case 'Date1':
        case 'Date2':
            $(parentElementBlock).parents('.eSignatureFieldDiv').find('>input.ffd-esignature-input').attr('data-signdate', SetInputValue(newvalue));
            break;
        case 'Signature1':
        case 'Signature2':
            $(parentElementBlock).parents('.eSignatureFieldDiv').find('>input.ffd-esignature-input').attr('data-signlabel', SetInputValue(newvalue));
            break;
    }

    resetESignatureElement($(parentElementBlock).parents('.fieldLi'), true);
}

function backToFFLabel(elem, isPaymentFieldLabel) {
    var labelElement;
    var parentClass = $(elem).attr('data-parentclass');
    if (!isNullOrEmpty($(elem).attr('data-parentclass'))) {
        labelElement = $(elem).parents('label.' + parentClass + '');
    }
    var newvalue = GetInputValueAsHTML($(labelElement).find('textarea.ff-label-input').val());
    $(labelElement).find('textarea.ff-label-input').remove();
    if (parentClass.indexOf('ff-page-header') >= 0) {
        $(labelElement).parents('.fc-multi-page-item').find('.ff-page-info .ff-page-title').html(SetInputValue(newvalue));
    }
    $(labelElement).html(SetInputValue(newvalue));
    if (isPaymentFieldLabel) {
        updatePaymentFieldLabels(labelElement);
    } else {
        isChangesMadeInForm = true;
        autosaveTriggered();
    }
}

function setHover() {
    $('.fc-multi-page-item  ul.formFieldUl li:not(".matrix-section-container"),  ul.matrix-section li').hover(
        function () {
            $(this).find('.obj-info').show();

        },
        function () {
            $(this).find('.obj-info').hide();
        }
    );
}

/*Methods from Form Editor page ends*/
function resetFlexInputForFormElements() {

    $('.fieldDiv>input[type="textbox"]').each(function (i, inputElement) {

        var attrDataFlexControl = $(inputElement).attr('data-flexcontrol');
        if (typeof attrDataFlexControl !== typeof undefined && attrDataFlexControl !== false && attrDataFlexControl != '') {
            switch (attrDataFlexControl) {
                case "integer-starrating":
                    var noofitems = $(inputElement).attr('data-flex-max');
                    var minlabel = $(inputElement).attr('data-flex-minlabel');
                    var maxlabel = $(inputElement).attr('data-flex-maxlabel');

                    setRatingInput($(inputElement), noofitems, minlabel, '', maxlabel, attrDataFlexControl);

                    break;
                case "integer-npsrating":
                    var minlabel = $(inputElement).attr('data-flex-minlabel');
                    var maxlabel = $(inputElement).attr('data-flex-maxlabel');
                    var middlelabel = $(inputElement).attr('data-flex-middlelabel');
                    setRatingInput($(inputElement), '', minlabel, middlelabel, maxlabel, attrDataFlexControl);

                    break;
                default:
                    setRatingInput($(inputElement), '', '', '', '', attrDataFlexControl);
                    break;
            }
        }
    });

}

function initializeSignatureElements() {
    $('#parentUlForm li ul li[id^="lblliESIGNATURE"]').each(function (inx, fieldLi) {
        if ($(fieldLi).hasClass('generalSortableForFields')) {
            resetESignatureElement(fieldLi, false);
        }
    });
}

function populateFooterFromFormHTML(sendBtnElem, footnote) {
    try {
        $("#btnTxt").val($(sendBtnElem).val());
        $("#txtbxSubmitButtonLabel").val($(sendBtnElem).val());
        $("#BtnMessage").val($(sendBtnElem).attr('btnmessage'));
        $("#txtareaThankyoumsg").val($(sendBtnElem).attr('btnmessage'));
        $("#btnFootnote").val('' + footnote);
        $("#btnUrl").val($(sendBtnElem).attr('btnurl'));
        $("#txtbxRedirectUrl").val($(sendBtnElem).attr('btnurl'));

        if ($("#txtbxRedirectUrl").val() != "") {
            $('a[href$="#formconfirmationRadio1"]').parent().removeClass('active');
            $('a[href$="#formconfirmationRadio2"]').parent().addClass('active')
            $('#formconfirmationRadio1').removeClass('active in');
            $('#formconfirmationRadio2').addClass('active in');
        }

        footerBtnHTMLPopulated = true;
    } catch (err) {
        console.log(' Error in populating footerHtml ' + err);
    }
}

function createHtml() {

    $('.list-toggle-div-wrap ul.dropfields').each(function (indx, sortableUL) {
        $(sortableUL).find('li').each(function () {
            $(this).find('div.fieldDiv').each(function (index) {
                if ($(this).text().indexOf('<') >= 0) {
                    $(this).html($(this).text());
                }

            });
        });
    });
}

function hideAllAvailableFieldLists() {
    $('.availableHeaderDiv').removeClass('activeTab');
    $('.list-toggle-div').slideUp(100);
    $('.list-toggle-div-wrap').hide();
}

function getColorCode(liElement) {
    var childElemClass = '';
    if ($(liElement).hasClass('A')) {
        childElemClass = 'A';
    } else if ($(liElement).hasClass('B')) {
        childElemClass = 'B';
    } else if ($(liElement).hasClass('C')) {
        childElemClass = 'C';
    } else if ($(liElement).hasClass('D')) {
        childElemClass = 'D';
    } else if ($(liElement).hasClass('E')) {
        childElemClass = 'E';
    } else if ($(liElement).hasClass('F')) {
        childElemClass = 'F';
    } else if ($(liElement).hasClass('G')) {
        childElemClass = 'G';
    } else if ($(liElement).hasClass('H')) {
        childElemClass = 'H';
    } else if ($(liElement).hasClass('I')) {
        childElemClass = 'I';
    } else if ($(liElement).hasClass('J')) {
        childElemClass = 'J';
    } else if ($(liElement).hasClass('K')) {
        childElemClass = 'K';
    } else if ($(liElement).hasClass('L')) {
        childElemClass = 'L';
    } else if ($(liElement).hasClass('M')) {
        childElemClass = 'M';
    } else if ($(liElement).hasClass('N')) {
        childElemClass = 'N';
    }

    return childElemClass;
}

function getFormattedElemId(liElement) {
    var childElemClass = getColorCode(liElement);
    var elementName = '';

    var fieldDivElement = $(liElement).find('.fieldDiv');

    var finalElemId;
    if ($(liElement).hasClass('generalSortableForFields')) {
        var dataOType = $(liElement).attr('data-otype');
        var lblLi = $(liElement).attr('id');
        if (!isNullOrEmpty(dataOType) && dataOType.indexOf('Payment') > 0) {
            lblLi = lblLi.replace('FASTFORMSPAYMENT', 'FFPAYMENT');
        }

        finalElemId = lblLi.replace('lblli', '');

    } else if ($(fieldDivElement).length > 0) {

        if ($(fieldDivElement).first().hasClass('lookupInput')) {
            elementName = $(fieldDivElement).find('input').last().attr('name');
        } else {
            elementName = $(fieldDivElement).find('>select,>input,input.ff-input-type,>textarea').last().attr('name');
        }
        finalElemId = elementName;
        if (childElemClass != '' && elementName.split('.').length>=3) {
            console.log('FORM [getFormattedElemId] ' + finalElemId);
            var arrayElemIdSeperatedbyDot = elementName.split('.');
            finalElemId = arrayElemIdSeperatedbyDot[0]+'.'+arrayElemIdSeperatedbyDot[1];
            if(arrayElemIdSeperatedbyDot.length==4){
                finalElemId = finalElemId + '.' + childElemClass + '.' +arrayElemIdSeperatedbyDot[3];
            }else{
                finalElemId = finalElemId + '.' + childElemClass + '.' +arrayElemIdSeperatedbyDot[2];
            }
        }
    } else {
        finalElemId = $(liElement).find('.labelDiv>label.ff-label').attr('id');
        finalElemId = finalElemId.replace('lbl', '');
    }

    return finalElemId;
}

function getFieldIdInputElement(pFieldLiElementId){
    var inputElement = $('#' + pFieldLiElementId).find('.fieldDiv input')[0];
    if(inputElement != undefined){
        return inputElement.id;
    }
    return undefined;
}

function getElementObjectType(liElement) {
    var objectType = '';

    if ($(liElement).hasClass('sortableForRelFields1')) {
        objectType = 'PRIMARY';
    } else {

        objectType = 'LOOKUP';

        $.each(colorTagArray, function (indx, tagValue) {
            if ($(liElement).hasClass(tagValue + '')) {
                objectType = 'DETAIL';
            }
        });
    }

    return objectType;
}

function createJSONSectionObj(sectionlabelid, sectionclass) {
    var dataobj = {
        "id": sectionlabelid,
        "class": sectionclass
    };


    return dataobj;
}



function fetchHiddenObjectValues() {
    var hiddenObjects = '';
    var seperator = "";
    $('.select-secondary-element-wrapper').find('.secondary-object-block').each(function (indx, selectParentElem) {
        var selectedValue = $(selectParentElem).find('select.select-secondary-element').val();
        if (!isNullOrEmpty(selectedValue)) {
            var objtype = $(selectParentElem).find('select.select-secondary-element').children().children(':selected').attr('name');
            console.log(' selectedValue  ' + selectedValue + '  objtype-' + objtype);
            hiddenObjects += seperator + selectedValue + '##' + objtype;
            seperator = ",";
        }

    });
    return hiddenObjects;
}



function IsSelectVisible(selectlevelID) {

    var returnflag = true;
    if ($('#' + selectlevelID + ' .scroll-parent').css('display') == 'none') {
        returnflag = false;
    }
    return returnflag;
}

function isSelectedItemIsvalid(selectlevelID) {

    var returnflag = true;
    if ($('#' + selectlevelID + ' .scroll-parent .select2-container a.select2-choice .select2-chosen').text() == '----Select Object----') {
        returnflag = false;
    }
    return returnflag;
}

function vaildateLookupEdit(liElementId) {
    var infoIsValid = true;
    var firstLabel = $('#' + liElementId).find('>div:first > label:first');
    if (!isNullOrEmpty($(firstLabel).attr('vatt')) && $(firstLabel).attr('vatt') == 'REFERENCE') {
        if (!$('#' + liElementId).find('#trForHideField input[type="checkbox"]').is(':checked') && !$('#' + liElementId).find('#trForReadOnlyField input[type="checkbox"]').is(':checked') && $('#' + liElementId).find('#trForLookupView').is(':visible')) {
            var selectedOptionElem = $('#' + liElementId).find('#trForLookupView select.lookup-select option:selected');
            if (!isNotNullOrUndefined(selectedOptionElem) || isNullOrEmpty($(selectedOptionElem).attr('value')) || $(selectedOptionElem).val() == '000000000000000AAA') {
                infoIsValid = false;
                var validationMsg = 'Please select a view';
                if ($(selectedOptionElem).val() == '000000000000000AAA') {
                    validationMsg = 'List View is null';
                }
                var lookupViewTr = $('#' + liElementId).find('#trForLookupView');

                $(lookupViewTr).find('select.lookup-select').select2('focus');
                if ($(lookupViewTr).find('.formatEditCol2 .edit-validation-err').length < 1) {
                    $(lookupViewTr).find('.formatEditCol2 a.lookup-edit-link').after('<span class="edit-validation-err">' + validationMsg + '<span>');
                } else {
                    $(lookupViewTr).find('.formatEditCol2 .edit-validation-err').text(validationMsg);
                }


            }


        }
    }
    return infoIsValid;
}
/*form editor old functions ends*/

function generateLookupListViewHtml(listViewOptionsMap) {
    var returnHtml = '<option>-select a view-</option>';
    for (var objectName in listViewOptionsMap) {
        if (listViewOptionsMap.hasOwnProperty(objectName)) {
            var resultSelectOptions = listViewOptionsMap[objectName];
            if (resultSelectOptions != null && resultSelectOptions.length > 0) {
                if (resultSelectOptions.length > 1 || resultSelectOptions[0].FFValue != '000000000000000AAA') {
                    var optionGroupItem = $('<optgroup />', { 
                        'label': getObjectLabelByName(objectName),
                        'data-api-object-name' : objectName,
                        'class': 'FieldOption section'
                    });
                    $.each(resultSelectOptions, function (index, item) {
                        var optionItem = $('<option />', { 'value': item.FFValue, 'text': item.FFText });
                        optionGroupItem.append(optionItem);
                    });
                    returnHtml += optionGroupItem.clone().wrap('<div>').parent().html();
                }
            }
        }
    }

    return returnHtml;
}
function getObjectLabelByName(objName) {
    try {
        var objLabel = safeStringValue($("option[value=\"" + objName + "\"]", $('#dropSelectPrimary')).html(), objName);
        return unescapeHTMLString(GetInputValue(objLabel));
    } catch (err) {
        console.log('FORM [getObjectLabelByName] see error below');
        console.log(err);
    }
    return objName;
}

function lookupListViewChange(elemSource) {
    var parentFieldLi = $(elemSource).parents('.fieldLi');
    var hiddenElem = $(parentFieldLi).find('.fieldDiv .lookupInput input[type=hidden]');
    var textboxElem = $(parentFieldLi).find('.fieldDiv .lookupInput input[type=textbox]');
    /*var refObjectname = '';
    refObjectname = $(parentFieldLi).find('div:first label:first').attr('vaobj');
    if (!isNullOrEmpty(refObjectname)) {
        $(hiddenElem).attr('data-vaobj', refObjectname);
    }*/
    var selectedValue = $(elemSource).select2('val');
    if (!isNullOrEmpty(selectedValue) && selectedValue != '-select a view-') {
        $(hiddenElem).attr('data-lookup-value-type', 'list');
        $(hiddenElem).attr('data-lookup-value', selectedValue);
        
        if ($(elemSource)[0].selectedIndex > 0) {
            $(hiddenElem).attr('data-lookup-object', $(elemSource).find("option:eq(" + $(elemSource)[0].selectedIndex + ")").parent('.FieldOption').attr('data-api-object-name'));
        }

        $(parentFieldLi).find('.ExpandDiv  a.lookup-edit-link').show();
        $(parentFieldLi).find('.ExpandDiv .edit-validation-err').remove();
    } else {
        $(hiddenElem).attr('data-lookup-value-type', '');
        $(hiddenElem).attr('data-lookup-value', '');
        $(parentFieldLi).find('.ExpandDiv  a.lookup-edit-link').hide();
    }

}

function populateLookupSelect(parentFieldLiElement, result) {
    /*var listViewResult;
    var lookupObject;                           
    for (var key in result) {
        // TODO: Support more then one type of object for Listview selection.
        if (result.hasOwnProperty(key)) {
            lookupObject=key;
            listViewResult= result[key];
        }
    }*/
    var lookupHtml = generateLookupListViewHtml(result);

    $(parentFieldLiElement).find('select.lookup-select').html(lookupHtml);
    $(parentFieldLiElement).find('select.lookup-select').select2();
    var hiddenElem = $(parentFieldLiElement).find('.ExpandDiv .lookupInput input[type=hidden]');
    var lookupType = $(hiddenElem).attr('data-lookup-value-type');
    var lookupSelectedValue = $(hiddenElem).attr('data-lookup-value');
    if (!isNullOrEmpty(lookupType) && !isNullOrEmpty(lookupSelectedValue)) {
        $(parentFieldLiElement).find('select.lookup-select').select2('val', lookupSelectedValue);
        $(parentFieldLiElement).find('.ExpandDiv a.lookup-edit-link').show();
    } else {
        $(parentFieldLiElement).find('.ExpandDiv a.lookup-edit-link').hide();
    }
}

function openLookupEditPage(elemSource) {
    sfdcHostName = window.location.host;
    var liId = $(elemSource).parents('.fieldLi').attr('id');
    var filterPageUrl = 'https://' + sfdcHostName + '/ui/list/FilterEditPage';
    var returnUrl = 'https://' + sfdcHostName + '/apex/FastFormListViewRet?itemid=' + liId;
    /*  path for editor page  /ui/list/FilterEditPage?id=00Bo0000003iSba&retURL=returnurl  */
    var selectedvalue = $(elemSource).parent().find('select.lookup-select').select2('val');
    if (!isNullOrEmpty(selectedvalue)) {
        filterPageUrl += "?id=" + selectedvalue;
        var strWindowFeatures = "location=no,height=570,width=520,scrollbars=yes,status=no";
        var URL = filterPageUrl + "&retURL=" + returnUrl;
        var win = window.open(URL, "_blank", strWindowFeatures);




    }
}

function CallBackFromFilterPage(fieldliiElement) {
    var refObjectname = '';
    var lookupTextboxElement = $('#' + fieldliiElement).find('.fieldDiv .lookupInput input[type=textbox]');
    refObjectname = safeStringValue(lookupTextboxElement.attr("data-lobj"), "");
    if (!isNullOrEmpty(refObjectname)) {
        remoteGetSObjectListViewJS(refObjectname, $('#' + fieldliiElement));
    }
}

function hideWarning(elemid) {
    $(elemid).parents('.vff-alert').hide();
}

function doSearch(thisElem) {
    var txtToSearch = $(thisElem).parent().find('input[type="textbox"]').val();
    doFieldSearch(txtToSearch);
}

function doDynamicSearch(thisElem) {
    var txtToSearch = $(thisElem).val();
    if (!isNullOrEmpty(txtToSearch) && txtToSearch.length > 1) {
        doFieldSearch(txtToSearch);
    } else {
        resetSearch();
    }
}

function doFieldSearch(textToSearch) {
    $('#availableFieldBox .availableHeaderDiv').find('.result-text').remove();
    //var textToSearch=$(thisElem).parent().find('input[type="textbox"]').val();
    if (!isNullOrEmpty(textToSearch)) {
        $('#availableFieldBox').find('.list-toggle-div .fieldLi').each(function (indx, elemLi) {
            var titlestr = $(elemLi).attr('title');
            if (!isNullOrEmpty(titlestr) && titlestr.toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0) {
                $(elemLi).removeClass('display-none');
            } else {
                $(elemLi).addClass('display-none');
            }
        });
        $('#availableFieldBox').find('.list-toggle-div').each(function (indx, divElem) {
            var parentDiv = $(divElem).parent();

            if (!isNullOrEmpty($(divElem).find('.fieldLi:not(.display-none):not([style])').length)) {
                $(parentDiv).addClass('search-enable');
                var objnamehtml = $(parentDiv).find('.objName').html();
                $(parentDiv).find('.availableHeaderDiv').append('<span class="result-text">' + $(divElem).find(".fieldLi:not(.display-none):not([style])").length + ' Results</span>');
            } else {
                $(parentDiv).addClass('search-enable');
                $(parentDiv).find('.availableHeaderDiv').append('<span class="result-text">0 Result</span>');
            }
        });
    } else {
        $('#availableFieldBox').find('.list-toggle-div .fieldLi').removeClass('display-none');
    }
}

function clearSearch(thisElem) {
    $(thisElem).parent().find('input[type="textbox"]').val('');
    resetSearch();
}

function resetSearch() {

    $('#availableFieldBox').find('.list-toggle-div .fieldLi').removeClass('display-none');
    $('#availableFieldBox .availableHeaderDiv').find('.result-text').remove();
    $('#availableFieldBox').find('.list-toggle-div-wrap').removeClass('search-enable');
    if ($('#availableFieldBox').find('.availableHeaderDiv.activeTab').length > 0) {
        var fieldListElem = $('#availableFieldBox').find('.availableHeaderDiv.activeTab').parent().find('.list-toggle-div');
        if (msieversion() <= 0) {
            $(fieldListElem).jScrollPane({
                mouseWheelSpeed: 100
            });
        }
    }
}

function toggleSearchBox(elemSource) {
    if ($(elemSource).parents('.availablefields-wrapper').hasClass('hideSearch')) {
        $(elemSource).parents('.availablefields-wrapper').removeClass('hideSearch')
    } else {
        $(elemSource).parents('.availablefields-wrapper').addClass('hideSearch');
    }
}

function flexControlDisplayName(flextypecode, defaulttype) {
    var returnStr = defaulttype;
    switch (flextypecode) {
        case 'integer-npsrating':
            returnStr = 'NPS Rating';
            break;
        case 'integer-starrating':
            returnStr = 'Star Rating';
            break;
        case 'picklist-combobox':
            returnStr = 'Searchable Picklist';
            break;
        case 'picklist-radiobutton-vertical':
            returnStr = 'Radio Button List (Vertical)';
            break;
        case 'picklist-radiobutton-horizontal':
            returnStr = 'Radio Button List (Horizontal)';
            break;
        case 'multipicklist-multi-tags':
            returnStr = 'Multi-Select Tag List';
            break;
        case 'multipicklist-multi-tags-check':
            returnStr = 'Multi-Select Checkbox Tag List';
            break;
        case 'multipicklist-checkbox-horizontal':
            returnStr = 'Checkbox List (Vertical)';
            break;
        case 'multipicklist-checkbox-vertical':
            returnStr = 'Checkbox List (Vertical)';
            break;
        case 'integer-matrixlikert':
            returnStr = 'Matrix field';
            break;
        default:
            break;
    }
    return returnStr;
}

/*Picklist management methods start*/
function setupPicklistManagementElement(elemSource, picklistValuesJsonArr) {
    setHiddenSelectDataSet(elemSource);
    var picklistBoxElement = $('#trForformFieldsPicklistdOptions .picklist-box');
    var ulElem = $('<ul/>', {
        'class': 'sortable-picklist'
    });

    $.each(picklistValuesJsonArr, function (indx, jsonItem) {

        var pval = safeStringValue(jsonItem.pval, '');
        if (!isNullOrEmpty(pval)) {
            var pItemElem = $('<span/>', {
                'class': 'pitem',
                'onclick': 'toggleItemSelection(this,true);'
            });
            var spanValueElem = $('<span/>', {
                'class': 'pick-t',
                'html': jsonItem.ptxt,
                'data-txt': jsonItem.ptxt,
                'data-val': pval
            });
            var delElem = $('<span/>', {
                'class': 'del-icon',
                'onclick': 'removeCustomLi(this);'
            });
            var chkElem = $('<span/>', {
                'class': 'chk-icon'
            });
            var dragElem = $('<span/>', {
                'class': 'drag-ic'
            });
            var selected = jsonItem.psel;
            var isCustom = getSafeBoolean(jsonItem.pcustom, false);
            var liElem = $('<li/>', {
                'class': 'pick-item '
            });
            if (!getSafeBoolean(jsonItem.pdisabled, false)) {
                $(liElem).addClass('selected');
            }
            if (isCustom) {

                $(liElem).addClass('custom-li');
                $(spanValueElem).append($('<span/>').html(' (custom)'));
            }

            $(liElem).html(dragElem);
            $(pItemElem).append(chkElem);
            $(pItemElem).append(spanValueElem);
            $(liElem).append(pItemElem);
            if (isCustom) {
                $(liElem).append(delElem);
            }
            $(ulElem).append(liElem);
        }
    });
    $(picklistBoxElement).html(ulElem);
    $(picklistBoxElement).find('ul').sortable({
        axis: 'y',
        handle: '.drag-ic',
        update: function (event, ui) {
            changePicklistItem(ui.item);
        }
    });
    //   setHoverEventsForMultiPick($(elemSource).parents('.picklist-options-toggle').parent().find('.picklist-options-wrapper .picklist-footer-2'));
}

function filterPicklistItems(elemSource) {
    var txtToSearch = $(elemSource).val();

    doPicklistItemSearch(elemSource, txtToSearch);

}

function doPicklistItemSearch(elemSource, txtToSearch) {
    if (!isNullOrEmpty(txtToSearch) && txtToSearch.length > 0) {
        $(elemSource).parents('.picklist-box-wrapper').find('ul.sortable-picklist>li').each(function (indx, elemLi) {
            var datatext = $(elemLi).find('.pick-t').attr('data-txt');
            if (!isNullOrEmpty(datatext) && datatext.toLowerCase().indexOf(txtToSearch.toLowerCase()) >= 0) {
                $(elemLi).removeClass('display-none');
            } else {
                $(elemLi).addClass('display-none');
            }
        });
    } else {
        $(elemSource).parents('.picklist-box-wrapper').find('ul.sortable-picklist>li').each(function (indx, elemLi) {
            $(elemLi).removeClass('display-none');
        });
    }
}

function resetPicklistSearch(elemSource) {

}

function sortPicklistItems(elemSource) {
    var sortOrderAsc = true;
    var elementText = $(elemSource).text();
    if (!isNullOrEmpty(elementText) && elementText.toLowerCase() == 'sort z-a') {
        sortOrderAsc = false;
        $(elemSource).text('Sort A-Z');
    } else {
        $(elemSource).text('Sort Z-A');
    }
    var ulSortableElem = $(elemSource).parents('.picklist-box-wrapper').find('ul.sortable-picklist');
    $(ulSortableElem).html($(ulSortableElem).find('li').sort(function (a, b) {
        if (sortOrderAsc) {
            return $(a).find('.pick-t').attr('data-txt').toUpperCase().localeCompare($(b).find('.pick-t').attr('data-txt').toUpperCase());
        } else {
            return $(b).find('.pick-t').attr('data-txt').toUpperCase().localeCompare($(a).find('.pick-t').attr('data-txt').toUpperCase());
        }
    }));
    changePicklistItem(elemSource);
}

function resetPicklistItems(elemSource) {
    var expandDivElem = $(elemSource).parents('.ExpandDiv');
    var fieldLiElem = $(expandDivElem).parent();
    var defaultSelectElement = $('#tblForRequirdBlock').find('#defaultValue');
    if ($(fieldLiElem).find('.fieldDiv .selectDataSet select').length > 0) {
        defaultSelectElement = $(elemSource).parents('.fieldLi').find('.fieldDiv .selectDataSet select');
    }
    var selectOptions = [];

    $(defaultSelectElement).find('option').each(function (indx, optionElem) {
        if (!isNullOrEmpty($(optionElem).attr('value'))) {


            var isCustom = getSafeBoolean($(optionElem).attr('data-iscustom'), false);
            if (!isCustom) {
                var optionItem = {
                    'pval': $(optionElem).attr('value'),
                    'ptxt': $(optionElem).text()
                };
                optionItem['pcustom'] = false;
                optionItem['pdisabled'] = false;
                optionItem['psel'] = getSafeBoolean($(optionElem).is(':selected'), false);
                selectOptions.push(optionItem);
            }
        }

    });
    setupPicklistManagementElement(elemSource, selectOptions);
    changePicklistItem(elemSource);
}

function togglePickItemSelection(elemSource) {
    var elementText = $(elemSource).text();
    if (!isNullOrEmpty(elementText)) {
        if (elementText.toLowerCase() == 'select all') {
            $(elemSource).text('Deselect all');
            resetAllPicklistItems(elemSource, true, true);
        } else {
            $(elemSource).text('Select all');
            resetAllPicklistItems(elemSource, false, true);
        }
    }
}

function resetAllPicklistItems(elemSource, checkVal, isAutoSave) {
    $(elemSource).parents('.picklist-box-wrapper').find('ul.sortable-picklist li').each(function (indx, liElem) {
        if (checkVal) {
            if (!$(liElem).hasClass('selected')) {
                $(liElem).addClass('selected');
            }
        } else {
            if ($(liElem).hasClass('selected')) {
                $(liElem).removeClass('selected');
            }

        }
    });
    if (isAutoSave) {
        changePicklistItem(elemSource);
    }
}

function toggleToSingleOptionState(elemSource, isAutoSave) {
    toggleSingleOptionState(elemSource, true);
}

function toggleSingleOptionState(elemSource, setInitialState) {
    var parentElem = $(elemSource).parents('.picklist-box-wrapper');
    $(parentElem).find('.picklist-box-footer').removeClass('multi-state-add');
    $(parentElem).find('.picklist-box-footer').removeClass('single-state-add');
    $(parentElem).find('.picklist-box').removeClass('multi-line-enabled');
    if (setInitialState) {
        $(parentElem).find('.multi-line-pick').hide();
        if (isNullOrEmpty($(elemSource).val())) {
            clearPicklistErrorMessage(parentElem);
            $(parentElem).find('.multi-icon-hide').fadeIn("slow");
            $(parentElem).find('.add-pick-icon').hide();
        } else {
            $(parentElem).find('.picklist-box-footer').addClass('single-state-add');
        }
    } else {
        $(parentElem).find('.picklist-box-footer').addClass('single-state-add');

        $(parentElem).find('.multi-icon-hide').hide();
        $(parentElem).find('.add-pick-icon').fadeIn("slow");
    }
}

function showMultiPickItems(elemSource) { }

function toggleMultiPickTextArea(elemSource, isAutoSave) {
    var parentElem = $(elemSource).parents('.picklist-box-wrapper').find('.picklist-box-footer');
    var newtext = $(parentElem).parent().find('textarea.multi-line-pick').val();
    if (isNullOrEmpty(newtext) || !$(parentElem).hasClass('multi-state-add')) {
        $(parentElem).removeClass('single-state-add');
        if ($(parentElem).hasClass('multi-state-add')) {
            $(elemSource).parents('.picklist-box-wrapper').removeClass('multi-line-enabled');
            $(parentElem).removeClass('multi-state-add');
            $(parentElem).parent().find('textarea').slideUp();
        } else {
            $(elemSource).parents('.picklist-box-wrapper').find('.picklist-box').addClass('multi-line-enabled');
            $(parentElem).addClass('multi-state-add');
            $(parentElem).find('.add-mpick-icon').fadeIn("slow");
            $(parentElem).parent().find('textarea').slideDown();
        }
    }
}

function addPickItems(elemSource) {
    var parentElem = $(elemSource).closest('.picklist-box-wrapper');
    resetPicklistValidationError(parentElem);
    var picklistType=isNullOrEmpty($(elemSource).closest('.fieldLi').attr('data-otype'))?'':$(elemSource).closest('.fieldLi').attr('data-otype');
    var newtext;
    var isMultipleItemsAdded=($(elemSource).hasClass('add-mpick-icon'))?true:false;
    if(isMultipleItemsAdded){
        newtext = $(parentElem).find('textarea.multi-line-pick').val();
    }else{
        newtext=$(parentElem).find('.picklist-footer-1 input.search-box').val();
    }
    if (!isNullOrEmpty(newtext)) {
        var isValid=true;
        var newValuesArr = [];
        var newtextLines = isMultipleItemsAdded?newtext.split('\n'):[newtext];
        $.each(newtextLines, function (indx, txt) {            
            isValid=(!isValid || (txt.indexOf(';')>=0))?false:true;
            txt = GetInputValue(txt);
            newValuesArr.push({
                'pval': txt,
                'ptxt': txt
            });
        });
        if(picklistType=='OSinglePicklist' || (isValid && picklistType=='OMultiPicklist')){
            clearPicklistErrorMessage(parentElem);
            if(isMultipleItemsAdded){
                $(parentElem).find('textarea.multi-line-pick').val('');
                $(parentElem).find('textarea.multi-line-pick').slideUp();
            }else{
                $(parentElem).find('.picklist-footer-1 input.search-box').val('');
            }
            addNewPicklistItems(elemSource, newValuesArr, true);
        }else{
            // show validation error message
            showPicklistValidationError(parentElem);
        }
    } else {
        toggleSingleOptionState(elemSource, true);
    }
}

function clearPicklistErrorMessage(parentElem){
    $(parentElem).find('.edit-validation-err').remove();
}

function resetPicklistValidationError(parentElem){
    $(parentElem).find('.validation-error').removeClass('validation-error');
}

function showPicklistValidationError(parentElem){
    var validationErrorMsg='";" symbol cannot be used in multi-select picklists.';
    var errorDivElem=$('<div/>',{"class":"edit-validation-err","html":validationErrorMsg});
    if($(parentElem).find('.multi-state-add').length>0){
        // multi-line picklist add
        $(parentElem).find('.picklist-footer-2').addClass('validation-error');
        $(parentElem).find('.multi-line-pick').addClass('validation-error');
    }else{
        // single-line picklist add
        $(parentElem).find('.picklist-footer-1').addClass('validation-error');
    }    
    clearPicklistErrorMessage(parentElem);
    $(parentElem).append(errorDivElem);
}

function addNewPicklistItems(elemSource, newItems, isAutoSave) {
    var parentElem = $(elemSource).parents('.picklist-box-wrapper');
    if (newItems != undefined && newItems.length > 0) {

        var ulElem = $(parentElem).find('ul.sortable-picklist');
        $.each(newItems, function (indx, jsonItem) {
            var spanCustomText = $('<span/>', {
                'html': ' (custom)'
            });
            var pItemElem = $('<span/>', {
                'class': 'pitem',
                'onclick': 'toggleItemSelection(this,true);'
            });
            var spanValueElem = $('<span/>', {
                'class': 'pick-t',
                'html': jsonItem.ptxt,
                'data-txt': jsonItem.ptxt,
                'data-val': jsonItem.pval
            });
            $(spanValueElem).append(spanCustomText);
            var delElem = $('<span/>', {
                'class': 'del-icon',
                'onclick': 'removeCustomLi(this);'
            });
            var chkElem = $('<span/>', {
                'class': 'chk-icon'
            });
            var dragElem = $('<span/>', {
                'class': 'drag-ic'
            });
            var liElem = $('<li/>', {
                'class': 'pick-item selected custom-li'
            });
            $(liElem).html(dragElem);
            $(pItemElem).html(chkElem);
            $(pItemElem).append(spanValueElem);
            $(liElem).append(pItemElem);
            $(liElem).append(delElem);
            $(ulElem).append(liElem);
        });
    }
    $(parentElem).find('.picklist-box-footer').removeClass('single-state-add');
    $(parentElem).find('.picklist-box-footer').removeClass('multi-state-add');
    /*scroll to last li item starts*/
    var scrollableDiv = $(parentElem).find('.picklist-box');
    if (scrollableDiv.length > 0) {
        scrollableDiv.scrollTop(scrollableDiv[0].scrollHeight);
    }
    /*scroll to last item ends*/
    $(elemSource).hide();
    toggleSingleOptionState(elemSource, true);
    changePicklistItem(elemSource);
}

function removeCustomLi(elemSource) {
    var parentUl = $(elemSource).parent().parent();
    $(elemSource).parent().remove();
    changePicklistItem(parentUl);
}

function toggleMultiPickBox(elemSource, hideText) {
    var parentElem = $(elemSource).parents('.picklist-box-footer');
    $(parentElem).removeClass('multi-state-enabled');
    $(parentElem).removeClass('single-state-add');
    if (!hideText) {
        $(parentElem).addClass('multi-state-enabled');
    }

}

function setHoverEventsForMultiPick(elemSource) {
    $(elemSource).hover(
        function () {
            toggleMultiPickBox(elemSource, false);
        },
        function () {
            toggleMultiPickBox(elemSource, true);
        }
    );
}

function toggleItemSelection(elemSource, isAutoSave) {
    var parentLi = $(elemSource).parent();
    if ($(parentLi).hasClass('selected')) {
        $(parentLi).removeClass('selected');
    } else {
        $(parentLi).addClass('selected');
    }
    changePicklistItem(elemSource);
}

function changePicklistItem(elemSource) {
    var expandDivElem = $(elemSource).parents('.ExpandDiv');
    var fieldLiElem = $(expandDivElem).parent();
    var selectDataSetElement = $(fieldLiElem).find('.fieldDiv .selectDataSet select');
    var selectDefaultElement = $(expandDivElem).find('#trForDefaultValue select.ff-select-type');
    var selectElement = $(expandDivElem).parent().find('div.fieldDiv select.ff-select-type');
    var selectedVal = safeStringValue($(selectElement).val(), '');
    $(selectDataSetElement).empty();

    var optionDatasetHtml = $('<div/>');
    var optionHtml = $('<div/>');
    if ($(selectElement).hasClass('ff-singlepicklist')) {
        $(optionHtml).html('<option value="">--select an item--</option>');
        $(optionDatasetHtml).html('<option value="">--select an item--</option>');
    }

    $(expandDivElem).find('.picklist-options-wrapper .picklist-box ul>li').each(function (indx, liItem) {
        var opthtm = $(liItem).find('.pick-t').attr('data-txt');
        var optval = $(liItem).find('.pick-t').attr('data-val');
        if (!isNullOrEmpty(optval)) {
            opthtm = opthtm.replace(' (custom)', '');
            optval = optval.replace(/\"/g, '&quot;');
            var isCustom = false;
            var isDisabled = true;
            if ($(liItem).hasClass('custom-li')) {
                isCustom = true;
            }
            if ($(liItem).hasClass('selected')) {
                isDisabled = false;
                $(optionHtml).append('<option value="' + optval + '">' + opthtm + '</option>');
            }

            $(optionDatasetHtml).append('<option data-iscustom="' + isCustom + '" data-disabled="' + isDisabled + '" value="' + optval + '">' + opthtm + '</option>');
        }

    });


    updateSelectElementsWithCustomData(selectDefaultElement, $(optionHtml).html(), selectedVal);
    updateSelectElementsWithCustomData(selectElement, $(optionHtml).html(), selectedVal);
    updateSelectElementsWithCustomData(selectDataSetElement, $(optionDatasetHtml).html(), selectedVal);

    $(expandDivElem).find('.flex-ctrl-display-as:not(.display-none) select').change();

}

function updateSelectElementsWithCustomData(selectElem, htmlData, selVal) {
    $(selectElem).empty();
    $(selectElem).append(htmlData);
    $(selectElem).val(selVal);
}

function setHiddenSelectDataSet(elemSource) {
    var expandDivElem = $(elemSource).parents('.ExpandDiv');
    var fieldLiElem = $(expandDivElem).parent();

    if ($(fieldLiElem).find('.fieldDiv .selectDataSet').length == 0) {
        $(fieldLiElem).find('.fieldDiv').append($('<div/>', {
            'class': 'selectDataSet display-none'
        }));
        $(fieldLiElem).find('.fieldDiv .selectDataSet').html($(expandDivElem).find('#trForDefaultValue select.ff-select-type').clone().wrap('<p>').parent().html());
        $(fieldLiElem).find('.fieldDiv>select.ff-select-type').attr('data-customset', true);
        var selectId = $(fieldLiElem).find('.fieldDiv>select.ff-select-type').attr('id');
        $(fieldLiElem).find('.fieldDiv .selectDataSet select').removeAttr('class');
        $(fieldLiElem).find('.fieldDiv .selectDataSet select').attr('id', 'vadataset__' + selectId);
    }

}

function testPicklist(elemsource) {
    $(elemsource).SelectToPicklist({
        controlType: 'ff-ext-checkbox',
        alignment: 'horizontal'
    });
}
/*Picklist management methods end*/
/*Multi payment sprint methods starts*/
function safeLegacyPAYPALPAYMENT(paymentStr) {
    if (!isNullOrEmpty(paymentStr) && paymentStr.indexOf('PAYPALPAYMENT') >= 0) {

        paymentStr = paymentStr.replace('PAYPALPAYMENT', 'FASTFORMSPAYMENT');

    }
    return paymentStr;
}

function getOPaymentTypeVal(paymentType, defaultval, paypalval, iatsval, stripeval, authorizeNetval) {
    var returnResponse = defaultval;
    switch (paymentType) {
        case 'OPayPalPayment':
            returnResponse = paypalval;
            break;
        case 'OiATSPayment':
            returnResponse = iatsval;
            break;
        case 'OStripePayment':
            returnResponse = stripeval;
            break;
        case 'OAuthorizeNetPayment':
            returnResponse = authorizeNetval;
            break;
        default:
            break;
    }
    return returnResponse;
}

function getOTypeFromPaymentVal(paymentType, defaultval, paypalval, iatsval, stripeval, authorizeNetval) {
    var returnResponse = defaultval;
    switch (paymentType.toUpperCase()) {
        case 'PAYPAL PRO':
            returnResponse = paypalval;
            break;
        case 'IATS':
            returnResponse = iatsval;
            break;
        case 'STRIPE':
            returnResponse = stripeval;
            break;
        case 'AUTHORIZENET':
            returnResponse = authorizeNetval;
            break;
        default:
            break;
    }
    return returnResponse;
}
/*Multi payment sprint methods ends*/

/*Repeatable Section methods starts*/
function changeSectionConfig(elemSource) {
    var sectionElemDiv = $(elemSource).parents('.formSectionUl');
    $(sectionElemDiv).attr('data-add-link', $('#txtsecrepAddLink').val());
    $(sectionElemDiv).attr('data-remove-link', $('#txtsecrepRemoveLink').val());
    $(sectionElemDiv).attr('data-min-count', $('#txtsecrepMin').val());
    $(sectionElemDiv).attr('data-max-count', $('#txtsecrepMax').val());
    resetRepeatableSectionFooter(sectionElemDiv);
}

function populateRepeatableSectionConfigInfo(sectionElemDiv) {
    $(sectionElemDiv).find('#txtsecrepAddLink').val(GetInputValue($(sectionElemDiv).attr('data-add-link'), '+ add another', true));
    $(sectionElemDiv).find('#txtsecrepRemoveLink').val(GetInputValue($(sectionElemDiv).attr('data-remove-link'), '- remove', true));
    $(sectionElemDiv).find('#txtsecrepMin').val(safeStringValue($(sectionElemDiv).attr('data-min-count'), '1'));
    $(sectionElemDiv).find('#txtsecrepMax').val(safeStringValue($(sectionElemDiv).attr('data-max-count'), ''));
}

function resetRepeatableSectionFooter(sectionElemDiv) {
    $(sectionElemDiv).find('.ff-section-footer').find('a.ff-add').html(GetInputValueAsHTML($(sectionElemDiv).attr('data-add-link'), '+Add Another', true));
    $(sectionElemDiv).find('.ff-section-footer').find('a.ff-remove').html(GetInputValueAsHTML($(sectionElemDiv).attr('data-remove-link'), '-Remove', true));
}
/*Repeatable Section methods ends*/
function onFormSettingsChange(elemSource, isAutoSave) {
    if (isAutoSave) {
        setTimeout(function () {
            var saveGroupNumber = '';
            try {
                if ($(elemSource).hasClass('form-row-group')) {
                    saveGroupNumber = $(elemSource).attr('data-savegroup');
                } else {
                    saveGroupNumber = $(elemSource).parents('.form-row-group').attr('data-savegroup');
                }
            } catch (err) { }
            if (!isNullOrEmpty(saveGroupNumber)) {
                updateFormSettingsInfo(saveGroupNumber);
            }
        }, 1000);
    }
}

function onFormNameChange(elemSource, isAutoSave) {
    var formname = $(elemSource).val();
    if (!isNullOrEmpty(formname)) {
        var previousFormRecord = {};
        previousFormRecord.Id = FastFormsRecordId;
        previousFormRecord["Name"] = $(elemSource).val();
        updateFormSettingsInfo(1);
    }
}

function updateFormSettingsInfo(saveGroupNumber) {
    var saveData = false;
    var previousFormRecord = {};
    previousFormRecord.Id = FastFormsRecordId;
    switch (saveGroupNumber) {
        case '1':
            var formOptionsXML = '';
            $('.form-setting-wrapper').find('div.form-row-group[data-savegroup="1"],div.form-row-group[data-savegroup="1"] .col-inputs input[data-ff-prop],div.form-row-group[data-savegroup="1"] .col-inputs select[data-ff-prop],div.form-row-group[data-savegroup="1"] .col-inputs textarea[data-ff-prop],div.form-row-group[data-savegroup="1"] .col-inputs pre[data-ff-prop]').each(function (indx, elem) {
                var dataProp = $(elem).attr('data-ff-prop');
                if (!isNullOrEmpty(dataProp)) {
                    saveData = true;
                    if (dataProp == 'Form_Options__c') {
                        var dataSubProp = $(elem).attr('data-ff-sub');
                        switch (dataSubProp) {
                            case 'submitInfo':
                                formOptionsXML += getSubmitInfo();
                                break;
                            case 'saveForLaterInfo':
                                formOptionsXML += getSaveForLaterInfo()

                                break;
                            case 'multiPageInfo':
                                formOptionsXML += getMultiPageInfo();
                                break;
                            default:

                        }
                    } else if (dataProp == 'JSCode__c') {
                        var jseditor = ace.edit("javascriptEditor");
                        if (jseditor != null && jseditor !== undefined) {
                            //previousFormRecord[dataProp] =  jseditor.getValue();
                            getOrSetJavascriptCodeJS(true, jseditor.getValue());
                            //saveData=true;
                        }
                    } else if (!$(elem).hasClass('form-row-group')) {
                        saveData = true;
                        var ctrlType = $(elem)[0].type;
                        if (ctrlType == 'checkbox') {
                            previousFormRecord[dataProp] = $(elem).is(':checked');
                        } else {
                            previousFormRecord[dataProp] = $(elem).val();
                        }
                    }
                }
            });
            if (!isNullOrEmpty(formOptionsXML)) {
                formOptionsXML = '<formOptions>' + formOptionsXML + '</formOptions>';
                previousFormRecord['Form_Options__c'] = formOptionsXML;
            }
            break;
        case '2':
            $('.form-setting-wrapper').find('div.form-row-group[data-savegroup="2"] .col-inputs input[data-ff-prop],div.form-row-group[data-savegroup="2"] .col-inputs select[data-ff-prop],div.form-row-group[data-savegroup="2"] .col-inputs textarea[data-ff-prop]').each(function (indx, elem) {
                var dataProp = $(elem).attr('data-ff-prop');
                if (!isNullOrEmpty(dataProp)) {
                    saveData = true;
                    var ctrlType = $(elem)[0].type;
                    if (ctrlType == 'checkbox') {
                        previousFormRecord[dataProp] = $(elem).is(':checked');
                    } else {
                        previousFormRecord[dataProp] = $(elem).val();
                    }
                }
            });
            break;
        default:
    }

    if (saveData) {
        draftchanges(true);
        previousFormRecord['Draft_Status__c'] = 'Unpublished';
        remoteUpdateFormSettingsInfoJS(previousFormRecord);
    }
}

function resetFormFooterInfo(formOptionXML) {
    $('#formOptionsHidden').val(formOptionXML);
    var formOptionsElem = getXmlElementFromStr(formOptionXML);
    var btnMessage = firstElementByTagName(formOptionsElem, "btnMessage", true); // getXMLElemFirstNode(submitOptions, "btnMessage");
    var btnText = firstElementByTagName(formOptionsElem, "btnText", true);
    var btnUrl = firstElementByTagName(formOptionsElem, "btnUrl", true);
    var redirectEnabled = firstBooleanElementByTagName(formOptionsElem, "redirectEnabled", false);
    var breadcrumbEnabled = firstBooleanElementByTagName(formOptionsElem, "breadcrumbEnabled", false);
    var breadcrumbPrefix = firstElementByTagName(formOptionsElem, "breadcrumbPrefix", true);
    var breadcrumbPrefixEnabled = firstBooleanElementByTagName(formOptionsElem, "breadcrumbPrefixEnabled", false);
    var breadcrumbNumbered = firstBooleanElementByTagName(formOptionsElem, "breadcrumbNumbered", false);

    var pageValidationType = firstElementByTagName(formOptionsElem, "pageValidationType", true);
    var isFooterCustomized = firstBooleanElementByTagName(formOptionsElem, "isFooterCustomized", false);
    var prevBtnText = firstElementByTagName(formOptionsElem, "prevBtnText", true);
    var nextBtnText = firstElementByTagName(formOptionsElem, "nextBtnText", true);

    var isSaveForLaterEnabled = firstBooleanElementByTagName(formOptionsElem, "saveForLaterEnabled", false);
    var saveBtnText = safeStringValue(firstElementByTagName(formOptionsElem, "saveBtnText", true), 'Save');
    var discardBtnText = safeStringValue(firstElementByTagName(formOptionsElem, "discardBtnText", true), 'Discard');
    resetFooterNavigationBtns(btnText, prevBtnText, nextBtnText, saveBtnText, isSaveForLaterEnabled);
    resetFooterNavigation();
}

function getMultiPageInfo() {
    var formoptions = '<multiPageInfo>';
    if ($('#mainMultiPageWrapper').find('.form-canvas-multi-page-inner').find('.fc-multi-page-item').length > 1) {
        formoptions += '<multiPageEnabled>true</multiPageEnabled>';
    } else {
        formoptions += '<multiPageEnabled>false</multiPageEnabled>';
    }
    formoptions += '<breadcrumbEnabled>' + getFFCheckBoxElemValue($("#chkFormNavigationBar"), false) + '</breadcrumbEnabled>';
    formoptions += '<breadcrumbPrefixEnabled>' + getFFCheckBoxElemValue($("#chkPrefixNumber"), false) + '</breadcrumbPrefixEnabled>';

    if (getFFCheckBoxElemValue($("#chkPrefixNumber"), false) === false) {
        formoptions += '<breadcrumbPrefix></breadcrumbPrefix>';
    } else {
        formoptions += '<breadcrumbPrefix>' + GetInputValueAsHTML(safeStringValue($("#inputPrefixNumber").val(), "Back")) + '</breadcrumbPrefix>';
    }


    formoptions += '<breadcrumbNumbered>' + getFFCheckBoxElemValue($("#chkPagenumberInNavigation"), false) + '</breadcrumbNumbered>';
    var validationtype = safeStringValue($('#selFormValidationType').select2("val"), "");
    if (validationtype == 'page') {
        formoptions += '<pageValidationType>' + validationtype + '</pageValidationType>';
    } else {
        formoptions += '<pageValidationType>form</pageValidationType>';
    }
    formoptions += '<isFooterCustomized>' + getFFCheckBoxElemValue($("#chkCustomizeFooterNavigation"), false) + '</isFooterCustomized>';
    formoptions += '<prevBtnText>' + GetInputValueAsHTML(safeStringValue($("#inputBtnPrev").val(), "Back")) + '</prevBtnText>';
    formoptions += '<nextBtnText>' + GetInputValueAsHTML(safeStringValue($("#inputBtnNext").val(), "Next")) + '</nextBtnText>';
    formoptions += '</multiPageInfo>';
    return formoptions;
}

function getSaveForLaterInfo() {
    var formoptions = '<saveForLaterInfo>';
    formoptions += '<saveForLaterEnabled>' + getFFCheckBoxElemValue($("#chkCustomizeSaveForLater"), false) + '</saveForLaterEnabled>';
    formoptions += '<saveBtnText>' + GetInputValueAsHTML(safeStringValue($("#inputBtnSFLSave").val(), "Save")) + '</saveBtnText>';
    formoptions += '<discardBtnText>' + GetInputValueAsHTML(safeStringValue($("#inputBtnSFLDiscard").val(), "Discard")) + '</discardBtnText>';
    formoptions += '</saveForLaterInfo>';
    return formoptions;
}

function getSubmitInfo() {
    var formoptions = '<submitInfo>';

    formoptions += '<btnMessage>' + GetInputValueAsHTML(safeStringValue($("#txtareaThankyoumsg").val(), "")) + '</btnMessage>';
    formoptions += '<btnText>' + GetInputValueAsHTML(safeStringValue($("#txtbxSubmitButtonLabel").val(), "Send")) + '</btnText>';

    if ($('a[href$="#formconfirmationRadio2"]').parent().hasClass('active')) {
        formoptions += '<redirectEnabled>true</redirectEnabled>';
        formoptions += '<btnUrl>' + GetInputValueAsHTML(safeStringValue($("#txtbxRedirectUrl").val(), "")) + '</btnUrl>';
    } else {
        formoptions += '<redirectEnabled>false</redirectEnabled>';
        formoptions += '<btnUrl></btnUrl>';
    }
    formoptions += '</submitInfo>';
    return formoptions;
}

function setFastFormName(origName) {
    if (!isNullOrEmpty(origName)) {
        $('#formTitle').html(GetInputValue(origName));
        $('#breadcrumb-formeditor>span').text(getTruncatedFormName(origName));
    }
}

function getTruncatedFormName(origName) {
    if (!isNullOrEmpty(origName)) {
        if (origName.length > 23)
            return origName.substring(0, 23) + '...';
        else
            return origName;
    } else {
        return '';
    }
}
/*Edit Alert JAVASCRIPT starts*/
function toggleAlertsTab(elemSource, sourceevent, isClicked) {
    if (isClicked && isAlertInfoChanged()) {
        sourceevent.stopPropagation();
        var dialogBody = "<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>All the changes will be lost. Are you sure you want to close this without saving? <br /><br /></div></div>";
        $("#dialog-confirm").html(dialogBody);

        var dialogOptions = commonDialogOptions;
        dialogOptions["buttons"] = {
            "Yes": {
                click: function () {
                    $(this).dialog('close');
                    resetAlertChangeIndicator();
                    toggleAlertTab(elemSource);
                    toggleAlertsTab(elemSource, sourceevent, false)
                },
                text: 'Yes',
                'class': 'vabutton1'
            },
            "No": {
                click: function () {
                    $(this).dialog('close');

                },
                text: 'No',
                'class': 'vabutton2'
            }
        };
        $("#dialog-confirm").dialog(dialogOptions);
    } else {
        toggleAlertsTabCallForward(elemSource);
    }
}

function toggleAlertTab(elemSource) {
    var currentLiElem = $(elemSource).parent();
    $(currentLiElem).parent().find('.active').removeClass('active');
    $(currentLiElem).addClass('active');
    var toggleTabId = $(elemSource).attr('href');
    var mainAlertTab = $(elemSource).parents('.sfff-alert-editor-body');
    $(mainAlertTab).find('.tab-pane').removeClass('active');
    $(mainAlertTab).find('.tab-pane').removeClass('in');
    $(mainAlertTab).find('' + toggleTabId).addClass('active in');
}

function toggleAlertsTabCallForward(elemSource) {
    if ($(elemSource).parents('.sfff-alert-editor-body').find('#selectTypeOfAlertTEMP option').length <= 0) {
        setAlertTypeDropdownElem(elemSource);
    }
    if (!isNullOrEmpty($(elemSource).attr('id'))) {
        if ($(elemSource).attr('id') == 'systemAlert') {
            remoteGetSystemAlertsInfoJS(elemSource);
        } else if ($(elemSource).attr('id') == 'emailTemplates') {
            remoteGetAlertTemplatesInfoJS(elemSource);
        } else if ($(elemSource).attr('id') == 'customAlert') {
            remoteobjGetCustomAlertsInfo(elemSource);
        }
    }
}

function setAlertTypeDropdownElem(elemSource) {
    var selectAlertTypeHTML = '<option value="">--select an alert type--</option>';
    for (var key in systemAlertTypeMap) {
        if (systemAlertTypeMap.hasOwnProperty(key)) {
            selectAlertTypeHTML += '<option value="' + key + '">' + systemAlertTypeMap[key] + '</option>';

        }
    }
    $(elemSource).parents('.sfff-alert-editor-body').find('#selectTypeOfAlertTEMP').html(selectAlertTypeHTML);
}

function populateEmailTemplatesTab(elemSource, alertListInfo) {
    var alertContentHolderElem = $($(elemSource).attr('href')).find('.alert-content-holder');
    if (alertListInfo.ResultText == 'NORESULT') {
        var newalertHtml = '<div class="create-alert-header-block" data-tabtype="emailtemplate" id="pnlForNewalertBlock"><div class="no-alert-block no-alert-block-show"><h2 class="no-alert-text"  >You haven\'t created any custom templates yet.</h2><h4>Want to get started with first one?</h4><a class="vabuttonB1" data-alert-data="noalert" id="btn1" onclick="switchAlertNewBox(this,true); return false;"><span class="btn-icon-plus"></span><span class="btn-text">New Template</span></a></div></div>';
        $(alertContentHolderElem).html(newalertHtml);
    } else {

        var alertInfoArr = JSON.parse(alertListInfo.ResultText);
        var headerInfoArr = [];
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'Name__c', 'Name'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'Subject__c', 'Subject'));
        headerInfoArr.push(createHeaderInfoObj('CreatedDate', 'Created'));
        headerInfoArr.push(createHeaderInfoObj('ACTION', ''));
        renderAlertTable(alertContentHolderElem, headerInfoArr, alertInfoArr, false);

    }

}

function populateCustomAlertTab(elemSource, alertListInfo) {
    if (alertListInfo != null && alertListInfo instanceof Object) {
        try {
            alertListInfo = Object.keys(alertListInfo).map(function (k) {
                return alertListInfo[k]
            });
        } catch (err) {

        }
    }
    var alertContentHolderElem = $($(elemSource).attr('href')).find('.alert-content-holder');
    if (alertListInfo == null || alertListInfo.length <= 0) {
        var newalertHtml = '<div class="create-alert-header-block" data-tabtype="customalert" id="pnlForNewalertBlock"><div class="no-alert-block no-alert-block-show"><h2 class="no-alert-text"  >You haven\'t created any custom alert yet.</h2><h4>Want to get started with first one?</h4><a class="vabuttonB1" data-alert-data="noalert" id="btn1" onclick="switchAlertNewBox(this,false); return false;"><span class="btn-icon-plus"></span><span class="btn-text">New Alert</span></a></div></div>';
        $(alertContentHolderElem).html(newalertHtml);
    } else {

        var alertInfoArr = alertListInfo;

        var headerInfoArr = [];
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'Alert_Type__c', 'Alert Type'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'To__c', 'To'));
        headerInfoArr.push(createHeaderInfoObj('CreatedDate', 'Created'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'Subject__c', 'Subject'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'Status__c', 'Status'));

        headerInfoArr.push(createHeaderInfoObj('ACTION', ''));
        renderAlertTable(alertContentHolderElem, headerInfoArr, alertInfoArr, false);

    }

}

function populateSystemAlertTab(elemSource, alertListInfo) {
    var alertContentHolderElem = $($(elemSource).attr('href')).find('.alert-content-holder');
    var standardAlertTypesArr = systemAlertTypes.slice();
    if (alertListInfo.ResultText == 'NORESULT') {

    } else {

        var alertInfoArr = JSON.parse(alertListInfo.ResultText);
        var headerInfoArr = [];
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'Alert_Type__c', 'Alert Type'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'To__c', 'To'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'From__c', 'From'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'Subject__c', 'Subject'));
        headerInfoArr.push(createHeaderInfoObj('ACTION', ''));
        renderAlertTable(alertContentHolderElem, headerInfoArr, alertInfoArr);


        $.each(alertInfoArr, function (indx, alertItem) {
            var itemIndex = $.inArray(alertItem[SFOrgPrefix + 'Alert_Type__c'], standardAlertTypesArr);
            if (itemIndex >= 0) {
                standardAlertTypesArr.splice(itemIndex, 1);
            }
        });

    }
    if (standardAlertTypesArr != null && standardAlertTypesArr.length > 0) {
        remoteGetStandardAlertsInfoJS(elemSource, standardAlertTypesArr);
    }
}

function remoteobjGetCustomAlertsInfo(elemSource) {
    var ct = new ffAlertNS.ffAlertObj();
    var where_condition = {};
    where_condition.where = {};
    where_condition.where[SFOrgPrefix + 'Category__c'] = { eq: 'Custom' };
    where_condition.where[SFOrgPrefix + 'Form__c'] = { eq: FastFormsRecordId };

    ct.retrieve(function () {
        return (where_condition);
    }, function (error, results, eventobj) {

        if (eventobj.result != null) {
            populateCustomAlertTab(elemSource, eventobj.result.records);
        }
    });
}

function remoteobjValidateAlertInfo(alertContentHolderElem, alertInfoObj, alertTab) {
    console.log(alertContentHolderElem);
    console.log(alertInfoObj);
    console.log(alertTab);

    var vListEmailFields = [SFOrgPrefix + 'From__c', SFOrgPrefix + 'To__c', SFOrgPrefix + 'CC__c', SFOrgPrefix + 'BCC__c'];
    var vListRequiredFields = [SFOrgPrefix + 'From__c', SFOrgPrefix + 'To__c', SFOrgPrefix + 'Subject__c', SFOrgPrefix + 'Alert_Type__c', SFOrgPrefix + 'Body__c'];

    var vMessage = '';

    for (var vPropName in alertInfoObj) {

        var vValue = alertInfoObj[vPropName];

        if (vValue == '[[]]' || vValue == '[[null]]' || vValue == null) {
            vValue = '';
            alertInfoObj[vPropName] = vValue;
        }

        if (vListRequiredFields.includes(vPropName) && isNullOrEmpty(vValue)) {
            vMessage = 'Please provide values for all the fields marked as <b>*</b>.';
        }
        else if (vListEmailFields.includes(vPropName) && !isEmailValid($('<input />').val(vValue))) {
            vMessage = 'Please provide a valid email address. Value ' + vValue + ' is not a valid email address.';
        }
    }

    if (!isNullOrEmpty(vMessage)) {
        alertValidationMessage(alertContentHolderElem, vMessage);
        return true;
    }

    return false;
}

function remoteobjCreateAlertInfo(alertContentHolderElem, alertInfoObj, alertTab) {
    console.log('[remoteobjCreateAlertInfo] - Starting...');

    var ffalert = new ffAlertNS.ffAlertObj();

    ffalert.create(alertInfoObj, function (err, event, obj) {
        if (err) {
            console.log('ERROR while creating Alert__c object:' + err);
            alertErrorMessage(alertContentHolderElem, 'Something went wrong while inserting  ' + getObjDisplayTypeByAlertTab(alertTab) + ' information. Please try again.');
        } else {
            console.log(ffalert.get('Id')); // Id is set when create completes
            saveAlertInfoCallback(alertContentHolderElem, true);
            updatePreviousFormObjForPublishToggle('Unpublished');
        }
    });
}

function populateStandardAlertInfo(elemSource, alertListInfo) {
    var alertContentHolderElem = $($(elemSource).attr('href')).find('.alert-content-holder');
    if (alertListInfo.ResultText == 'NORESULT') {
        console.log('Populate Standard Alert Info  No Result');
    } else {
        var vParse = JSON.parse(alertListInfo.ResultText);
        var alertInfoArr = vParse;
        var headerInfoArr = [];
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'Alert_Type__c', 'Alert Type'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'To__c', 'To'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'From__c', 'From'));
        headerInfoArr.push(createHeaderInfoObj(SFOrgPrefix + 'Subject__c', 'Subject'));
        headerInfoArr.push(createHeaderInfoObj('ACTION', ''));
        if ($(alertContentHolderElem).find('.fscontent-table').length > 0 && $(alertContentHolderElem).find('.fscontent-table .oar-content-row[data-category="Standard"]').length == 0) {
            renderAlertTable(alertContentHolderElem, headerInfoArr, alertInfoArr, true);
        } else {
            renderAlertTable(alertContentHolderElem, headerInfoArr, alertInfoArr, false);
        }
    }
}

function getAlertTabType(alertTabId) {
    var alertTab = 'system';
    if (!isNullOrEmpty(alertTabId)) {
        switch (alertTabId) {
            case 'sfff-custom-alert':
                alertTab = 'custom';
                break;
            case 'sfff-email-template':
                alertTab = 'emailtemplate';
                break;
            default:
                break;

        }
    }
    return alertTab;
}

function renderAlertTable(mainOuterElem, headerInfoArr, rowInfoArr, isAppend) {
    var alertTab = getAlertTabType($(mainOuterElem).parent().attr('id'));

    var actionExists = false;
    var mainTable;
    if (!isAppend) {
        mainTable = $('<div/>', {
            'class': 'fscontent-table',
            'id': 'oarContentTable'
        });
        var thRow = $('<div/>', {
            'class': 'oar-header-row'
        });


        $.each(headerInfoArr, function (indx, item) {
            if (item.displayName == 'Status') {
                var thItem = $('<div/>', {
                    'class': 'oar-th fixed130'
                });
                thItem.html('<span class="oar-title" data-name="' + item.name + '">' + item.displayName + '</span>');
                thRow.append(thItem.clone().wrap('<p>').parent().html());
            } else if (item.name != 'ACTION') {
                var thItem = $('<div/>', {
                    'class': 'oar-th'
                });
                thItem.html('<span class="oar-title" data-name="' + item.name + '">' + item.displayName + '</span>');
                thRow.append(thItem.clone().wrap('<p>').parent().html());

            } else {
                actionExists = true;
            }
        });

        if (actionExists) {
            var thItem = $('<div/>', {
                'class': 'oar-th action-th'
            });
            thItem.html('');
            thRow.append(thItem.clone().wrap('<p>').parent().html());
        }
        mainTable.append(thRow);
    } else {
        mainTable = $(mainOuterElem).find('.fscontent-table');
    }

    var vBlockSaveForLater = '';
    var vIsSaveForLater = false;
    var vBlockEditButton = false;

    if (isCommunityForm) {
        vBlockSaveForLater = '<span id="pg:frm:j_id405" style="margin-top:0px" class="freemium-icon blue-tooltip">';
        vBlockSaveForLater += '<span class="blue-tooltip-text -marginLT lines2-onlytxt">';
        vBlockSaveForLater += '<span class="freemium-tooltip-msg">Save for Later is not available for Community forms at the moment.</span>';
        vBlockSaveForLater += '</span></span>';
    }

    if (rowInfoArr != null && (rowInfoArr instanceof Array) && rowInfoArr.length > 0) {
        $.each(rowInfoArr, function (rindx, resultItem) {
            var tdRow = $('<div/>', {
                'class': 'oar-content-row'
            });
            if (resultItem[SFOrgPrefix + 'Category__c'] != null && resultItem[SFOrgPrefix + 'Category__c'] != "undefined") {
                tdRow.attr('data-category', resultItem[SFOrgPrefix + 'Category__c']);
            }
            if (resultItem['Id'] != null) {
                tdRow.attr('data-recid', resultItem['Id']);
            }
            $.each(headerInfoArr, function (tindx, tditem) {

                if (tditem.name != 'ACTION') {

                    var isDynamic = false;
                    var text = resultItem[tditem.name];
                    var fieldvalue = resultItem[tditem.name];
                    var fieldValueArr = parseStringToMergeFieldArr(fieldvalue);

                    if (text == 'SAVE_FOR_LATER') {
                        vIsSaveForLater = true;
                    }
                    else {
                        vIsSaveForLater = false;
                    }

                    if (fieldValueArr != null && fieldValueArr.length == 1 && isFieldExistOnForm(fieldValueArr[0])) {
                        isDynamic = true;
                    }

                    if (tditem.name == SFOrgPrefix + 'To__c' || tditem.name == SFOrgPrefix + 'From__c' || tditem.name == SFOrgPrefix + 'CC__c' || tditem.name == SFOrgPrefix + 'BCC__c') {
                        if (isFormNative && tditem.name == SFOrgPrefix + 'From__c') {
                            text = 'User:' + FFUserFullName;
                        } else {
                            if (isDynamic) {
                                text = 'Field Id:' + fieldValueArr[0];
                            } else {
                                if (text.indexOf('[[') >= 0) {
                                    text = text.replace(/\[\[/g, '').replace(/\]\]/g, '');
                                }
                                text = 'Email:' + text;
                            }
                        }
                    } else if (SFOrgPrefix + 'Alert_Type__c' == tditem.name) {
                        var alertType = resultItem[tditem.name];
                        text = safeStringValue(systemAlertTypeMap[alertType], alertType);
                        text = SetInputValue(GetInputValueAsHTML(text));

                        if (vIsSaveForLater && vBlockSaveForLater != '') {
                            text += vBlockSaveForLater;
                            vBlockEditButton = true;
                        }

                    } else if (tditem.name == 'CreatedDate') {
                        try {
                            var dt = new Date(resultItem[tditem.name]);
                            text = dt.toLocaleString();
                        } catch (Err) {

                        }
                    } else if (SFOrgPrefix + 'Subject__c' == tditem.name) {
                        text = subsstringWithReadmoreDots(SetInputValue(GetInputValueAsHTML(text)), 40, '...');
                    } else if (SFOrgPrefix + 'Status__c' == tditem.name) {
                        var recId = resultItem['Id'];
                        var isActive = getSafeBoolean(resultItem[tditem.name], false);
                        if (isActive) {
                            text = '<div class="toggle-mode-box-inner mode-active"><div class="toggle-mode-link" data-toggle-id="' + recId + '" "><div class="toggle-mode-switch">&nbsp;</div></div><div class="toggle-mode-status">Active</div></div>';
                        } else {
                            text = '<div class="toggle-mode-box-inner"><div class="toggle-mode-link" data-toggle-id="' + recId + '" "><div class="toggle-mode-switch">&nbsp;</div></div><div class="toggle-mode-status">Inactive</div></div>';
                        }
                    } else {
                        if (tditem.name.split('.').length == 2) {
                            var tdArrName = tditem.name.split('.');
                            text = resultItem[tdArrName[0]][tdArrName[1]];
                        } else if (tditem.name.split('.').length == 3) {
                            var tdArrName = tditem.name.split('.');
                            text = resultItem[tdArrName[0]][tdArrName[1]][tdArrName[2]];
                        }
                    }
                    var tdItem = $('<div/>', {
                        'class': 'oar-td'
                    });
                    tdItem.html('<span class="oar-text" data-name="' + tditem.name + '">' + SetInputValue(GetInputValueAsHTML(text)) + '</span>');
                    tdRow.append(tdItem.clone().wrap('<p>').parent().html());

                } else {
                    actionExists = true;
                }
            });

            if (actionExists) {
                var tdItem = $('<div/>', {
                    'class': 'oar-td action-td'
                });

                if (alertTab == 'emailtemplate') {
                    tdItem.html('<span class="oar-text blue-tooltip edit-icon" onclick="editAlertTemplate(this);"><span class="blue-tooltip-text -ml20">Edit</span></span>');
                    tdItem.append('<span class="oar-text blue-tooltip duplicate-icon" onclick="duplicateAlertTemplate(this);"><span class="blue-tooltip-text  -ml30">Duplicate</span></span>');
                    tdItem.append('<span class="oar-text blue-tooltip delete-icon"  onclick="deleteAlertTemplate(this);"><span class="blue-tooltip-text  -ml20">Delete</span></span>');
                } else {

                    if (!vBlockEditButton) {
                        tdItem.html('<span class="oar-text blue-tooltip edit-icon " onclick="editAlert(this);"><span class="blue-tooltip-text -ml20">Edit</span></span>');
                    }

                    tdItem.append('<span class="oar-text blue-tooltip duplicate-icon" onclick="duplicateAlert(this);"><span class="blue-tooltip-text -ml30">Duplicate</span></span>');
                    tdItem.append('<span class="oar-text blue-tooltip delete-icon" onclick="deleteAlert(this);"><span class="blue-tooltip-text -ml20">Delete</span></span>');
                }

                vBlockEditButton = false;
                tdRow.append(tdItem.clone().wrap('<p>').parent().html());

            }
            mainTable.append(tdRow);
        });

        // Adding Alert Enable/Disable event
        $('div.toggle-mode-link', mainTable).click(function(){
            toggleAlertStatus(this, true);
        });
    }
    if (!isAppend) {
        var mainTableWrapper = $('<div/>', {
            'class': 'fscontent-wrapper-inner'
        });
        mainTableWrapper.html(mainTable);
        if ($(mainOuterElem).find('.alert-msg-wrapper').length > 0) {
            $(mainOuterElem).html($(mainOuterElem).find('.alert-msg-wrapper').clone().wrap('<p>').parent().html());
        } else {
            $(mainOuterElem).html('');
        }
        $(mainOuterElem).append(mainTableWrapper);
    }
    if (alertTab == 'emailtemplate') {
        var newTemplateHTML = '<span class="alert-divider"></span><div class="create-alert-block"><div class="create-alert-inner bottom-link-create-alert"><a class="vabuttonB1" data-alert-data="noalert" onclick="switchAlertNewBox(this,true); return false;" data-alert-index="2"><span class="btn-icon-plus"></span><span class="btn-text">New Template</span></a></div></div>';
        $(mainOuterElem).find('.fscontent-wrapper-inner').append(newTemplateHTML);
    } else if (alertTab == 'custom') {
        var newAlertHTML = '<span class="alert-divider"></span><div class="create-alert-block"><div class="create-alert-inner bottom-link-create-alert"><a class="vabuttonB1" data-alert-data="noalert" onclick="switchAlertNewBox(this,false); return false;" data-alert-index="2"><span class="btn-icon-plus"></span><span class="btn-text">New Alert</span></a></div></div>';
        $(mainOuterElem).find('.fscontent-wrapper-inner').append(newAlertHTML);
    }
}
//var xmlDocElement=getEmailDisplayText(getXmlElementFromStr(xmlstr));
function getEmailDisplayText(xmlDocElement, tagName, defaultValue) {

    var elem = xmlDocElement.getElementsByTagName(tagName);
    if (elem != 'undefined') {
        defaultValue = $(elem[0]).text();
    }

    return defaultValue;
}

function createHeaderInfoObj(name, displayname) {
    return {
        'name': name,
        'displayName': displayname
    };
}

function editAlert(elemSource) {
    var recId = $(elemSource).parents('.oar-content-row').attr('data-recid');
    if (!isNullOrEmpty(recId)) {
        remoteGetAlertInfoToEditJS(elemSource, recId);

    }
}

function editAlertTemplate(elemSource) {
    var recId = $(elemSource).parents('.oar-content-row').attr('data-recid');
    if (!isNullOrEmpty(recId)) {
        remoteGetAlertTemplateInfoToEditJS(elemSource, recId);
    }
}


function populateAlertEditInfo(elemSource, editAlertInfo) {
    console.log('[FORM] [populateAlertEditInfo] Start');
    console.log(editAlertInfo);
    console.log(elemSource);

    var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');
    var alertInfoObject;
    try {
        alertInfoObject = JSON.parse(editAlertInfo.ResultText);
    } catch (err) {
        alertInfoObject = JSON.parse(SetInputValue(editAlertInfo.ResultText));
    }
    $(alertContentHolderElem).find('.email-edit-content').remove();
    var editEmailContentElem = $('<div/>', {
        'class': 'email-edit-content'
    });
    var alertType = alertInfoObject[SFOrgPrefix + 'Alert_Type__c'];
    $(editEmailContentElem).attr('data-alerttype', alertType);
    $(editEmailContentElem).attr('data-alert-recid', alertInfoObject['Id']);
    //$(editEmailContentElem).attr('data-alerttemplate-recid', alertInfoObject[SFOrgPrefix + 'Alert_Template__c']);
    $(editEmailContentElem).html('<h3>Edit System Alert</h3><div class="silver-line-separator"></div>');
    $(editEmailContentElem).append($('#emailConfigSectionTEMP').html());
    $(editEmailContentElem).append($('#emailTemplateBoxTEMP').html());
    if (isFormNative) {
        $(editEmailContentElem).find('.al-email-to-fields').addClass('native-form');
    }
    $(editEmailContentElem).find('.alert-type-row .attachment-group').remove();
    $(editEmailContentElem).find('.alert-type-row .attachment-group').hide();
    $(editEmailContentElem).find('.alert-type-row .input-fields').append('<div class="attachment-group"><div class="pdf-row"><input class="vff-checkbox" id="chkbxAttachPDF"  type="checkbox"><label class="vff-check-label txt-label" for="chkbxAttachPDF">Attach PDF copy of submission</label></div><div class="pdf-row attach-files"><input class="vff-checkbox" id="chkbxAttachFile"  type="checkbox"><label class="vff-check-label txt-label" for="chkbxAttachFile">Attach uploaded files</label></div></div>');

    var templateListRow = '<div class="form-row email-template-row"><label class="label-for">Insert a template</label> <div class="input-fields al-alert-template-type"><select  class="select-elem alert-select sel-340" onchange="insertTemplateContent(this)" id="selectAlertTemplates" ><option>-select a template</option></select><div class="save-as-wrapper al-disabled"><span class="save-as-link" onclick="saveNewAlertTemplateAs(this);">Save as new template</span></div></div></div>';
    $(editEmailContentElem).hide();
    $(editEmailContentElem).find('.al-email-content-box').prepend(templateListRow);
    $(alertContentHolderElem).append($(editEmailContentElem).clone().wrap('<p>').parent().html());
    $(alertContentHolderElem).find('.fscontent-wrapper-inner').fadeOut(function () {
        $(alertContentHolderElem).find('.alert-msg-wrapper').fadeOut();
        $(alertContentHolderElem).find('.email-edit-content').fadeIn();
    });
    $(alertContentHolderElem).find('.remove-temp').each(function (ind, elem) {
        if (!isNullOrEmpty($(elem).attr('id'))) {
            var elemId = $(elem).attr('id').replace('TEMP', '');
            $(elem).attr('id', elemId);
            $(elem).attr('name', elemId);
        }
    });

    remoteAvailableFormFieldsSortedJS(alertContentHolderElem, alertInfoObject, false);
}

function populateCustomAlertEditInfo(elemSource, editAlertInfo, isNew) {

    var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');

    var alertInfoObject;
    var headerHTML = '<h3>Edit Custom Alert</h3><div class="silver-line-separator"></div>';
    if (isNew) {
        alertInfoObject = editAlertInfo;
        headerHTML = '<h3>New Custom Alert</h3><div class="silver-line-separator"></div>';
    } else {
        try {
            alertInfoObject = JSON.parse(editAlertInfo.ResultText);
        } catch (err) {
            alertInfoObject = JSON.parse(SetInputValue(editAlertInfo.ResultText));
        }
    }

    $(alertContentHolderElem).find('.email-edit-content').remove();
    var editEmailContentElem = $('<div/>', {
        'class': 'email-edit-content'
    });

    $(editEmailContentElem).html(headerHTML);
    $(editEmailContentElem).append($('#emailConfigSectionTEMP').html());
    $(editEmailContentElem).append($('#emailTemplateBoxTEMP').html());
    if (isFormNative) {
        $(editEmailContentElem).find('.al-email-to-fields').addClass('native-form');
    }

    $(editEmailContentElem).find('.alert-type-row .attachment-group').remove();
    $(editEmailContentElem).find('.alert-type-row .attachment-group').hide();
    $(editEmailContentElem).find('.alert-type-row .input-fields').append('<div class="attachment-group"><div class="pdf-row"><input class="vff-checkbox" id="chkbxAttachPDF"  type="checkbox"><label class="vff-check-label txt-label" for="chkbxAttachPDF">Attach PDF copy of submission</label></div><div class="pdf-row attach-files"><input class="vff-checkbox" id="chkbxAttachFile"  type="checkbox"><label class="vff-check-label txt-label" for="chkbxAttachFile">Attach uploaded files</label></div></div>');
    if (!isNew) {
        var alertType = alertInfoObject[SFOrgPrefix + 'Alert_Type__c'];
        $(editEmailContentElem).attr('data-alerttype', alertType);
        $(editEmailContentElem).attr('data-alert-recid', alertInfoObject['Id']);


    }

    var templateListRow = '<div class="form-row email-template-row"><label class="label-for">Insert a template</label> <div class="input-fields al-alert-template-type"><select  class="select-elem alert-select sel-340" onchange="insertTemplateContent(this)" id="selectAlertTemplates" ><option>-select a template</option></select><div class="save-as-wrapper al-disabled"><span class="save-as-link" onclick="saveNewAlertTemplateAs(this);">Save as new template</span></div></div></div>';
    $(editEmailContentElem).hide();
    $(editEmailContentElem).find('.al-email-content-box').prepend(templateListRow);
    $(alertContentHolderElem).append($(editEmailContentElem).clone().wrap('<p>').parent().html());

    var existingViewElem;
    if ($(alertContentHolderElem).find('.fscontent-wrapper-inner').length > 0) {
        existingViewElem = $(alertContentHolderElem).find('.fscontent-wrapper-inner');
    } else if ($(alertContentHolderElem).find('.create-alert-header-block').length > 0) {
        existingViewElem = $(alertContentHolderElem).find('.create-alert-header-block');
    }
    $(existingViewElem).fadeOut(function () {
        $(alertContentHolderElem).find('.alert-msg-wrapper').fadeOut();
        $(alertContentHolderElem).find('.email-edit-content').fadeIn();
    });
    $(alertContentHolderElem).find('.remove-temp').each(function (ind, elem) {
        if (!isNullOrEmpty($(elem).attr('id'))) {
            var elemId = $(elem).attr('id').replace('TEMP', '');
            $(elem).attr('id', elemId);
            $(elem).attr('name', elemId);
        }
    });
    $(alertContentHolderElem).find('#selectTypeOfAlert').html('<option>--select an alert type--</option><option value="SUCCESSFUL_SUBMISSION">Successful Submission</option>');
    initializeSelect2PlaceHolder($(alertContentHolderElem).find('#selectTypeOfAlert'));
    remoteAvailableFormFieldsSortedJS(alertContentHolderElem, alertInfoObject, false);
}

function populateAlertTemplateEditInfo(elemSource, editAlertInfo, isNew) {

    var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');
    var alertInfoObject;
    var headerHTML = '<h3>Edit Email Template</h3><div class="silver-line-separator"></div>';
    if (isNew) {
        alertInfoObject = editAlertInfo;
        headerHTML = '<h3>New Email Template</h3><div class="silver-line-separator"></div>';
    } else {
        try {
            alertInfoObject = JSON.parse(editAlertInfo.ResultText);
        } catch (err) {
            alertInfoObject = JSON.parse(SetInputValue(editAlertInfo.ResultText));
        }
    }

    $(alertContentHolderElem).find('.email-edit-content').remove();
    var editEmailContentElem = $('<div/>', {
        'class': 'email-edit-content'
    });
    var categoryType = alertInfoObject[SFOrgPrefix + 'Category__c'];
    $(editEmailContentElem).attr('data-category', categoryType);
    $(editEmailContentElem).html(headerHTML);
    if (!isNew) {
        $(editEmailContentElem).attr('data-alert-recid', alertInfoObject['Id']);
    }



    $(editEmailContentElem).append($('#emailTemplateBoxTEMP').html());

    var templateListRow = '<div class="form-row email-template-row"><label class="label-for">Insert a template</label> <div class="input-fields al-alert-template-type"><select  class="select-elem alert-select sel-340" onchange="insertTemplateContent(this)" id="selectAlertTemplates" ><option>-select a template</option></select></div></div>';
    var nameRow = '<div class="form-row al-name-row"><label class="label-for">Name<span class="f-req">*</span></label><input type="text" data-isrequired="true" id="txtbxAlertTemplateName"  onblur="onAlertInfoChange(this);" class="al-text-box" name="txtbxAlertTemplateName"></div>';
    $(editEmailContentElem).hide();
    $(editEmailContentElem).find('.al-email-content-box').prepend(templateListRow);
    $(editEmailContentElem).find('.al-email-content-box').prepend(nameRow);
    $(alertContentHolderElem).append($(editEmailContentElem).clone().wrap('<p>').parent().html());
    var existingViewElem;
    if ($(alertContentHolderElem).find('.fscontent-wrapper-inner').length > 0) {
        existingViewElem = $(alertContentHolderElem).find('.fscontent-wrapper-inner');
    } else if ($(alertContentHolderElem).find('.create-alert-header-block').length > 0) {
        existingViewElem = $(alertContentHolderElem).find('.create-alert-header-block');
    }

    $(existingViewElem).fadeOut(function () {
        $(alertContentHolderElem).find('.alert-msg-wrapper').fadeOut();
        $(alertContentHolderElem).find('.email-edit-content').fadeIn();
    });
    $(alertContentHolderElem).find('.remove-temp').each(function (ind, elem) {
        if (!isNullOrEmpty($(elem).attr('id'))) {
            var elemId = $(elem).attr('id').replace('TEMP', '');
            $(elem).attr('id', elemId);
            $(elem).attr('name', elemId);
        }
    });

    remoteAvailableFormFieldsSortedJS(alertContentHolderElem, alertInfoObject, isNew);
}

function resetAlertTemplateList(parentElem, ffOptionArr) {


    var selecthtml = generateAlertTemplateSelectHtml(ffOptionArr, null);
    $(parentElem).find('.al-alert-template-type select.alert-select,.email-template-row select.email-template-select').each(function (rindx, selectElement) {

        var selectedValue = $(selectElement).val();
        var elemClass = $(selectElement).attr("class");
        $(selectElement).empty();
        $(selectElement).append(selecthtml);
        //$(selectElement).select2();
        initializeSelect2PlaceHolder(selectElement);
        if (!isNullOrEmpty(selectedValue)) {
            $(selectElement).select2("val", selectedValue);
        }

    });

}

function populateEditAlertTemplateInfoInputValues(alertContentHolderElem, alertTemplateInfoObject) {


    try {
        remoteGetAlertTemplatesListJS(alertContentHolderElem);
        var name = alertTemplateInfoObject[SFOrgPrefix + 'Name__c'];
        var emailSubject = alertTemplateInfoObject[SFOrgPrefix + 'Subject__c'];
        var emailBody = alertTemplateInfoObject[SFOrgPrefix + 'Body__c'];
        if (!isNullOrEmpty(name)) {
            $(alertContentHolderElem).find('.al-name-row input.al-text-box').val(SetInputValue(name));
        }
        if (!isNullOrEmpty(emailSubject)) {
            $(alertContentHolderElem).find('.al-subject-row input.al-text-box').val(SetInputValue(emailSubject));
        }
        if (!isNullOrEmpty(emailBody)) {
            setContentInCKEditor($(alertContentHolderElem).find('.ckeditortext').attr('id'), emailBody);
        }
    } catch (err) {
        console.log('JS error while populating email subject or body' + err.message);
    }
}

function populateEditAlertInfoInputValues(alertContentHolderElem, alertInfoObject) {
    var alertTab = getAlertTabType($(alertContentHolderElem).parent().attr('id'));
    if (isFormNative) {
        $(alertContentHolderElem).find('.al-alert-to .help-icon').remove();
        $(alertContentHolderElem).find('.al-alert-from .al-toggle-links').remove();
    }
    $(alertContentHolderElem).find('.al-email-to-fields input.el-text-box,.al-email-to-fields select').each(function (indx, inputElem) {
        var dtProp = $(inputElem).attr('data-prop');
        var isDynamic = false;
        var fieldvalue = alertInfoObject[SFOrgPrefix + dtProp];
        var fieldValueArr = parseStringToMergeFieldArr(fieldvalue);
        if (fieldValueArr != null && fieldValueArr.length == 1 && isFieldExistOnForm(fieldValueArr[0])) {
            isDynamic = true;
        }
        if ($(inputElem)[0].type == 'text' && !isDynamic) {

            if (dtProp == 'To__c' || dtProp == 'From__c' || dtProp == 'CC__c' || dtProp == 'BCC__c') {
                if (!isNullOrEmpty(fieldvalue)) {
                    $(inputElem).val(SetInputValue(alertInfoObject[SFOrgPrefix + dtProp]));

                }

                if (dtProp == 'To__c' && alertTab == 'system') {
                    var originalText = $(inputElem).val();
                    if (originalText.indexOf('[[') >= 0) {
                        originalText = originalText.replace(/\[\[/g, '').replace(/\]\]/g, '');
                    }
                    var attrs = {};
                    attrs['html'] = originalText;
                    $.each($(inputElem)[0].attributes, function (idx, attr) {
                        attrs[attr.nodeName] = attr.nodeValue;
                    });
                    $(inputElem).replaceWith(function () {
                        return $("<label />", attrs).append($(this).contents());
                    });
                } else if (dtProp == 'From__c' && isFormNative) {
                    $(inputElem).replaceWith(function () {
                        return $("<label />", {
                            "data-prop": "From__c"
                        }).html('User: ' + FFUserFullName);
                    });


                }
            } else {
                $(inputElem).val(SetInputValue(alertInfoObject[SFOrgPrefix + dtProp]));
            }
        } else if ($(inputElem)[0].type == 'select-one' && isDynamic) {
            $(inputElem).parent().find('.dynamic-alink a.toggle-field-behaviour').click();
            $(inputElem).select2('val', fieldValueArr[0]);
        } else if ($(inputElem).hasClass('alert-select')) {
            $(inputElem).val('val', alertInfoObject[SFOrgPrefix + dtProp]);
            $(inputElem).select2({
                placeholderOption: 'first'
            });
            $(inputElem).select2('val', alertInfoObject[SFOrgPrefix + dtProp]);
        } else if ($(inputElem)[0].type == 'checkbox') {
            $(inputElem).prop('checked', getSafeBoolean(alertInfoObject[SFOrgPrefix + dtProp], false));
        }
    });
    try {
        if (getSafeBoolean(alertInfoObject[SFOrgPrefix + 'Attach_Files__c'], false)) {
            $(alertContentHolderElem).find('.attachment-group #chkbxAttachFile').prop('checked', true);
        }
        if (getSafeBoolean(alertInfoObject[SFOrgPrefix + 'Attach_PDF__c'], false)) {
            $(alertContentHolderElem).find('.attachment-group #chkbxAttachPDF').prop('checked', true);
        }
        if (alertTab == 'system' && $(alertContentHolderElem).find('.attachment-group').length > 0) {
            $(alertContentHolderElem).find('.attachment-group #chkbxAttachPDF').prop('disabled', true);

        }

        var alertType = $(alertContentHolderElem).find('select.alert-select').val();
        if ($.inArray(alertType, PDFEnabledAlertTypeArr) < 0) {
            $(alertContentHolderElem).find('.attachment-group').hide();
        } else {
            $(alertContentHolderElem).find('.attachment-group').show();
        }
        var emailSubject = alertInfoObject[SFOrgPrefix + 'Subject__c'];
        var emailBody = alertInfoObject[SFOrgPrefix + 'Body__c'];

        if (!isNullOrEmpty(emailSubject)) {
            $(alertContentHolderElem).find('.al-subject-row input.al-text-box').val(SetInputValue(emailSubject));
        }
        if (!isNullOrEmpty(emailBody)) {
            setContentInCKEditor($(alertContentHolderElem).find('.ckeditortext').attr('id'), emailBody);
        }
    } catch (err) {
        console.log('JS error while populating email subject or body' + err.message);
    }
}

function populateFormFieldsSelectElem(alertContentHolderElem, ffOptionArr, alertInfoObject, isNew) {

    var alertTab = getAlertTabType($(alertContentHolderElem).parent().attr('id'));
    var mergeFields = [];
    var alertType = $(alertContentHolderElem).find('.email-edit-content').attr('data-alerttype');
    if (!isNullOrEmpty(alertType)) {
        if (fastformsAlertTypeMergeFieldsMap[alertType] != null) {
            var alertTypeMergeFields = fastformsAlertTypeMergeFieldsMap[alertType];
            $.each(alertTypeMergeFields, function (indx, item) {
                mergeFields.push({
                    'FFText': item,
                    'FFValue': item
                });
            });
        }
    }

    var bRemoveField = false;
    var vListFields = [];
    for (var vFieldIndex in ffOptionArr) {
        var vField = ffOptionArr[vFieldIndex];

        if (vField.FFValue != null) {
            if ((vField.FFValue.toString().indexOf("section ") != -1) && (vField.FFText.toString().indexOf("Fields for") != -1)) {
                if (vField.FFValue.toString().indexOf(' repeat') != -1) {
                    bRemoveField = true;
                } else {
                    bRemoveField = false;
                }
            }

            if (!bRemoveField) {
                vListFields.push(vField);
            }
        }
    }

    var selecthtml = generateFormFieldsSelectHtml(vListFields, mergeFields);
    $(alertContentHolderElem).find('select.form-fields-select').each(function (rindx, selectElement) {
        $(selectElement).addClass('pps-261');
        var selectedValue = $(selectElement).val();
        var elemClass = $(selectElement).attr("class");
        $(selectElement).empty();
        $(selectElement).append(selecthtml);
        // $(selectElement).select2();
        initializeSelect2PlaceHolder(selectElement);
        if (!isNullOrEmpty(selectedValue)) {
            $(selectElement).select2("val", selectedValue);
        }

    });

    initializeSelect2PlaceHolder($(alertContentHolderElem).find('select.alert-select'));
    var selectHTMLEmailOnlyWrapper = $('<div/>').html(selecthtml);
    $(selectHTMLEmailOnlyWrapper).find('option').each(function (rindx, optionElem) {
        if (rindx > 0 && $(optionElem).attr('data-type') != 'EMAIL') {
            $(optionElem).attr('disabled', true);
            if ($(optionElem).parent().hasClass('ff-merge-grp')) {
                $(optionElem).parent().addClass('display-none');
            }
        }
    });

    $(alertContentHolderElem).find('select.email-only').each(function (rindx, selectElement) {
        $(selectElement).empty();
        $(selectElement).append($(selectHTMLEmailOnlyWrapper).html());
    });

    setAlertEditorToolbar(alertContentHolderElem);
    if (!isNew) {
        if (alertTab == 'emailtemplate') {
            populateEditAlertTemplateInfoInputValues(alertContentHolderElem, alertInfoObject);
        } else {
            populateEditAlertInfoInputValues(alertContentHolderElem, alertInfoObject);
            remoteGetAlertTemplatesListJS(alertContentHolderElem);
        }
    } else {
        if (alertTab == 'emailtemplate') {
            remoteGetAlertTemplatesListJS(alertContentHolderElem);
        } else {
            populateEditAlertInfoInputValues(alertContentHolderElem, alertInfoObject);
            remoteGetAlertTemplatesListJS(alertContentHolderElem);
        }
    }
}

function setAlertEditorToolbar(alertContentHolderElem) {
    var selectItems = [];



    $(alertContentHolderElem).find('select.form-fields-select').find('option').each(function (i, optionElem) {

        selectItems.push([$(optionElem).html(), $(optionElem).val()]);

    });



    try {
        $(alertContentHolderElem).find('.ckeditortext').each(function (indx, editElem) {
            $(editElem).attr('id', 'alerteditor_' + (new Date().getTime()));
            var ckinstance = CKEDITOR.instances[$(editElem).attr('id')];
            if (ckinstance) {
                console.log(' CKEditor Instance: ' + ckinstance);
                CKEDITOR.remove(ckinstance);
            }
        });
        $(alertContentHolderElem).find('.ckeditortext').each(function (indx, editElem) {

            CKEDITOR.plugins.addExternal('fftoken', FFCKEditorurlroot + '/plugins/fftoken/', 'plugin.js');
            CKEDITOR.replace($(editElem).attr('id'), {
                extraPlugins: 'fftoken',
                availableTokens: selectItems,
                customConfig: FFCKEditorurlroot + '/config.js'

            });
            CKEDITOR.instances[$(editElem).attr('id')].on('blur', function () {
                var selectedvalue = brTagSafe(this.getData());
                $(editElem).val(selectedvalue);
                unsavedTemplateIndicator(alertContentHolderElem);

            });

        });
    } catch (err) {
        console.log(' CKEditor toolbar error: ' + err.message);
    }


}

function insertFieldToEmailEditor(elemSource) {
    var parentElemnt = $(elemSource).parents('.al-email-content-box');
    var textareaElem = $(parentElemnt).find('textarea');
    var selectedVal = $(parentElemnt).find('.al-email-body-box select.select-elem').select2('val');
    if (!isNullOrEmpty(selectedVal)) {

        selectedVal = '[[' + selectedVal + ']]';


    }
    if (selectedVal != undefined && selectedVal != '') {
        insertContentInCKEditor($(textareaElem).attr('id'), selectedVal);
    }
}

function cancelAlert(elemSource) {
    var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');
    var alertTab = getAlertTabType($(alertContentHolderElem).parent().attr('id'));
    $(alertContentHolderElem).find('.email-edit-content').fadeOut(function () {

        if ($(alertContentHolderElem).find('.fscontent-wrapper-inner').length > 0) {
            $(alertContentHolderElem).find('.fscontent-wrapper-inner').fadeIn();
        } else if ((alertTab != 'sfff-system-alert') && $(alertContentHolderElem).find('.create-alert-header-block').length > 0) {
            $(alertContentHolderElem).find('.create-alert-header-block').fadeIn();
            $(alertContentHolderElem).find('.no-alert-block').addClass('no-alert-block-show');

        }
    });
    resetAlertChangeIndicator();
}

function saveAlert(elemSource) {
    var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');
    saveAlertInfo(alertContentHolderElem);

}

function saveAlertInfo(alertContentHolderElem) {
    var currentAlertRecId = $(alertContentHolderElem).find('.email-edit-content').attr('data-alert-recid');
    var alertTab = getAlertTabType($(alertContentHolderElem).parent().attr('id'));

    var alertInfoObject = {};
    if (!isNullOrEmpty(currentAlertRecId)) {
        alertInfoObject.Id = currentAlertRecId;
    }

    if (alertTab != 'emailtemplate') {
        $(alertContentHolderElem).find('.al-email-to-fields input.el-text-box:not(.display-none),.al-email-to-fields select:not(.display-none)').each(function (indx, inputElem) {
            var dtProp = $(inputElem).attr('data-prop');
            if (!isNullOrEmpty(dtProp)) {
                if ($(inputElem)[0].type == 'text') {
                    alertInfoObject[SFOrgPrefix + dtProp] = $(inputElem).val();

                } else if ($(inputElem)[0].type == 'select-one') {
                    if ($(inputElem).hasClass('alert-select')) {
                        alertInfoObject[SFOrgPrefix + dtProp] = $(inputElem).select2('val');
                    } else {
                        alertInfoObject[SFOrgPrefix + dtProp] = '[[' + $(inputElem).select2('val') + ']]';
                    }

                } else if ($(inputElem)[0].type == 'checkbox') {
                    alertInfoObject[SFOrgPrefix + dtProp] = $(inputElem).is(':checked');
                }
            }
        });
    }

    try {
        if (alertTab == 'emailtemplate') {
            alertInfoObject[SFOrgPrefix + 'Name__c'] = GetInputValue($(alertContentHolderElem).find('.al-name-row input.al-text-box').val());
        } else {
            if ($(alertContentHolderElem).find('.attachment-group').length > 0) {
                alertInfoObject[SFOrgPrefix + 'Attach_PDF__c'] = $(alertContentHolderElem).find('.attachment-group #chkbxAttachPDF').is(':checked');
                alertInfoObject[SFOrgPrefix + 'Attach_Files__c'] = $(alertContentHolderElem).find('.attachment-group #chkbxAttachFile').is(':checked');
            }
        }
        alertInfoObject[SFOrgPrefix + 'Subject__c'] = GetInputValue($(alertContentHolderElem).find('.al-subject-row input.al-text-box').val());
        alertInfoObject[SFOrgPrefix + 'Body__c'] = brTagSafe(CKEDITOR.instances[$(alertContentHolderElem).find('.ckeditortext').attr('id')].getData());

    } catch (err) {
        console.log('JS error while saving email subject or body' + err.message);
    }


    var vShowError = remoteobjValidateAlertInfo(alertContentHolderElem, alertInfoObject, alertTab);

    if (vShowError) {
        resetAlertChangeIndicator();
        return;
    }


    if (!isNullOrEmpty(currentAlertRecId)) {

        if (alertTab == 'emailtemplate') {
            var templateName = GetInputValue($(alertContentHolderElem).find('.al-name-row input.al-text-box').val());
            validateAlertTemplateName(alertContentHolderElem, templateName, currentAlertRecId);

        } else if (alertTab == 'custom' || alertTab == 'system') {
            remoteUpdateAlertInfoJS(alertContentHolderElem, alertInfoObject, false);
        } else {
            alertErrorMessage(alertContentHolderElem, 'Something went wrong while updating   ' + getObjDisplayTypeByAlertTab(alertTab) + ' information. Please try again.');
        }

    } else {

        if (alertTab == 'emailtemplate') {
            var templateName = GetInputValue($(alertContentHolderElem).find('.al-name-row input.al-text-box').val());
            validateAlertTemplateName(alertContentHolderElem, templateName, '');
        } else if (alertTab == 'custom') {
            console.log(' Custom alert created with form id:' + FastFormsRecordId);
            alertInfoObject[SFOrgPrefix + 'Form__c'] = FastFormsRecordId;
            alertInfoObject[SFOrgPrefix + 'Category__c'] = 'Custom';
            remoteobjCreateAlertInfo(alertContentHolderElem, alertInfoObject, alertTab);
        } else {
            alertErrorMessage(alertContentHolderElem, 'Something went wrong while inserting   ' + getObjDisplayTypeByAlertTab(alertTab) + ' information. Please try again.');
        }
    }

    resetAlertChangeIndicator();
}

function getObjDisplayTypeByAlertTab(alertTab) {
    var returnmsg = 'Alert';
    if (alertTab == 'emailtemplate') {
        returnmsg = 'Alert Template';
    }
    return returnmsg;
}

function saveAlertInfoCallback(alertContentHolderElem, isNew) {
    var toggleTabId = $(alertContentHolderElem).parent().attr('id');
    var successMSG = 'Alert successfully updated!';
    if (isNew) {
        successMSG = 'Alert successfully created!';
    }
    if ($(alertContentHolderElem).find('.email-edit-content').length > 0) {
        $(alertContentHolderElem).find('.email-edit-content').fadeOut(function () {

            var alertMsgWrapper = $('<div/>', {
                'class': 'alert-msg-wrapper'
            });

            alertMsgWrapper.html('<div class="vff-success " id="successAlertActionBox" ><div class="vff-success-msg msg-text-div" onclick="closeNotification(this);">' + successMSG + '</div></div>');
            $(alertContentHolderElem).html($(alertMsgWrapper).clone().wrap('<p>').parent().html());
            toggleTabId = $('#sfff-alert-editor').find('.alert-pills a[href="#' + toggleTabId + '"]').attr('id');
            if (!isNullOrEmpty(toggleTabId)) {
                toggleAlertsTab($('#' + toggleTabId), null, false);
            }
        });
    } else {
        var alertMsgWrapper = $('<div/>', {
            'class': 'alert-msg-wrapper'
        });

        alertMsgWrapper.html('<div class="vff-success " id="successAlertActionBox" ><div class="vff-success-msg msg-text-div" onclick="closeNotification(this);">' + successMSG + '</div></div>');
        $(alertContentHolderElem).html($(alertMsgWrapper).clone().wrap('<p>').parent().html());
        toggleTabId = $('#sfff-alert-editor').find('.alert-pills a[href="#' + toggleTabId + '"]').attr('id');
        if (!isNullOrEmpty(toggleTabId)) {
            toggleAlertsTab($('#' + toggleTabId), null, false);
        }
    }
}

function toggleALFieldBlock(elem, elementState, isAutoSave) {
    var parentElement = $(elem).parents('.input-fields');
    if (elementState == 'dynamic') {
        $(parentElement).find('>div.select2-container').remove();
        $(parentElement).find('.el-text-box').addClass('display-none');
        $(parentElement).find('select').removeClass('display-none');
        $(parentElement).find('select').removeClass('select2-offscreen');
        $(parentElement).find('.validation-message').remove();

        initializeSelect2PlaceHolder($(parentElement).find('select'));
    } else {
        $(parentElement).find('.el-text-box').removeClass('display-none');
        $(parentElement).find('select').addClass('display-none');
    }
    $(elem).parents('.al-toggle-links').find('li').each(function (indx, liElement) {
        if ($(liElement).hasClass(elementState + '-alink')) {
            $(liElement).addClass('display-none');
        } else {
            $(liElement).removeClass('display-none');

        }
    });
}

function switchAlertNewBox(elem, isTemplate) {
    if ($(elem).attr('data-alert-data') != undefined && $(elem).attr('data-alert-data') == 'noalert') {
        $(elem).attr('data-alert-data', 'alertexists');
        //$(elem).parents('.create-alert-header-block').find('.no-alert-text').fadeOut('slow');
        $(elem).parents('.create-alert-header-block').find('.no-alert-block').removeClass("no-alert-block-show", 500);
        if (isTemplate) {
            showCreateNewAlertTemplateBox(elem);
        } else {
            showCreateNewAlertBox(elem);
        }
    } else if ($(elem).attr('data-alert-data') != undefined && $(elem).attr('data-alert-data') == 'alertexists') {
        if (isTemplate) {
            showCreateNewAlertTemplateBox(elem);
        } else {
            showCreateNewAlertBox(elem);
        }
    }
}

function saveAlertTemplateInfoCallback(alertContentHolderElem, isNew) {
    var toggleTabId = $(alertContentHolderElem).parent().attr('id');
    var successMSG = 'Email template successfully updated!';
    if (isNew) {
        successMSG = 'Email template successfully created!';
    }
    if ($(alertContentHolderElem).find('.email-edit-content').length > 0) {
        $(alertContentHolderElem).find('.email-edit-content').fadeOut(function () {

            var alertMsgWrapper = $('<div/>', {
                'class': 'alert-msg-wrapper'
            });

            alertMsgWrapper.html('<div class="vff-success " id="successAlertActionBox" ><div class="vff-success-msg msg-text-div" onclick="closeNotification(this);">' + successMSG + '</div></div>');
            $(alertContentHolderElem).html($(alertMsgWrapper).clone().wrap('<p>').parent().html());
            toggleTabId = $('#sfff-alert-editor').find('.alert-pills a[href="#' + toggleTabId + '"]').attr('id');
            if (!isNullOrEmpty(toggleTabId)) {
                toggleAlertsTab($('#' + toggleTabId), null, false);
            }
        });
    } else {
        var alertMsgWrapper = $('<div/>', {
            'class': 'alert-msg-wrapper'
        });

        alertMsgWrapper.html('<div class="vff-success " id="successAlertActionBox" ><div class="vff-success-msg msg-text-div" onclick="closeNotification(this);">' + successMSG + '</div></div>');
        $(alertContentHolderElem).html($(alertMsgWrapper).clone().wrap('<p>').parent().html());
        toggleTabId = $('#sfff-alert-editor').find('.alert-pills a[href="#' + toggleTabId + '"]').attr('id');
        if (!isNullOrEmpty(toggleTabId)) {
            toggleAlertsTab($('#' + toggleTabId), null, false);
        }
    }
}

function showCreateNewAlertTemplateBox(elemSource) {
    var propname = SFOrgPrefix + 'Category__c';
    var newAlertInfo = {};
    newAlertInfo[propname] = 'Custom';
    populateAlertTemplateEditInfo(elemSource, newAlertInfo, true)

}

function showCreateNewAlertBox(elemSource) {
    var propname = SFOrgPrefix + 'Category__c';
    var newAlertInfo = {};
    newAlertInfo[propname] = 'Custom';
    populateCustomAlertEditInfo(elemSource, newAlertInfo, true)

}

function insertTemplateContent(elemSource) {
    var selectedval = $(elemSource).val();

    if (!$(elemSource).find('option:selected').hasClass('unsaved-template')) {
        $(elemSource).find('option.unsaved-template').remove();

        initializeSelect2PlaceHolder(elemSource);
    }
    if (!isNullOrEmpty(selectedval) && selectedval != '--select a template--') {
        remoteGetAlertTemplateInfoJS(elemSource, selectedval);
    }
    onAlertInfoChange(elemSource);
}

function remoteGetAlertTemplateInfoJSCallback(elemSource, result) {
    var parentElem = $(elemSource).parents('.alert-content-holder');
    var isFeatureAlertType = true;
    var featureType = safeStringValue($(elemSource).parent().parent().attr('data-feature'), '');
    if (!isNullOrEmpty(featureType) && featureType.indexOf('payment') == 0) {
        parentElem = $(elemSource).parents('.email-to-fields-wrapper');
        isFeatureAlertType = false;
    }
    var alertInfoObject = JSON.parse(result.ResultText);
    var objectType = alertInfoObject['attributes']['type'];
    var subject = '';
    var body = '';
    if (!isNullOrEmpty(objectType) && objectType == 'EmailTemplate') {
        /*Salesforce EmailTemplate object fields*/
        subject = parseSFMergeFieldsToFFMergePattern(alertInfoObject['Subject']);
        if (isNullOrEmpty(alertInfoObject['HtmlValue'])) {
            body = parseSFMergeFieldsToFFMergePattern(alertInfoObject['Body']);
            body = newlineToBr(body);
        } else {
            body = parseSFMergeFieldsToFFMergePattern(alertInfoObject['HtmlValue']);
        }


    } else {
        subject = alertInfoObject[SFOrgPrefix + 'Subject__c'];
        body = alertInfoObject[SFOrgPrefix + 'Body__c'];
    }

    var parentSectionElem = $(elemSource).parents('.al-email-content-box');
    if (!isFeatureAlertType) {
        parentSectionElem = $(elemSource).parents('.email-content-box');
        $(parentSectionElem).find('.email-subject-row input[type="textbox"]').val(SetInputValue(subject));
    } else {
        $(parentSectionElem).find('.al-subject-row input[type="text"]').val(SetInputValue(subject));
    }

    if (!isNullOrEmpty(body)) {
        setContentInCKEditor($(parentElem).find('.ckeditortext').attr('id'), body);
        var elemSourceId = $(parentElem).find('.ckeditortext').attr('id');
        if (!isNullOrEmpty($('#' + elemSourceId).attr('data-pp-email'))) {
            paymentSetupChange($('#' + elemSourceId));
        }
    }
}

function deleteAlertTemplate(elemSource) {
    var contentRowElem = $(elemSource).parents('.oar-content-row');
    var alertContentHolderElem = $(contentRowElem).parents('.alert-content-holder');
    $(contentRowElem).addClass('ff-loading');
    var recId = $(contentRowElem).attr('data-recid');
    if (!isNullOrEmpty(recId)) {
        var alertTemplate = new ffAlertTemplateNS.ffAlertTemplateDelObj();
        alertTemplate.del(recId, function (err, ids, objevent) {
            if (err) {
                console.log('Delte Callback error:' + err);
                alertErrorMessage(alertContentHolderElem, 'Something went wrong while deleting the email template. Please try again.');
            } else {
                $(contentRowElem).fadeOut(200, function () {
                    $(this).remove();
                    resetContentTableVisibility(alertContentHolderElem);
                });
            }
        });
    } else {
        alertErrorMessage(alertContentHolderElem, 'Email template record id not found. Please try again.');
    }
}

function deleteAlert(elemSource) {
    var contentRowElem = $(elemSource).parents('.oar-content-row');
    var alertContentHolderElem = $(contentRowElem).parents('.alert-content-holder');
    $(contentRowElem).addClass('ff-loading');
    var recId = $(contentRowElem).attr('data-recid');
    if (!isNullOrEmpty(recId)) {
        var ffalert = new ffAlertNS.ffAlertObj();
        ffalert.del(recId, function (err, ids, objevent) {
            if (err) {
                console.log('Delete Callback error:' + err);
                alertErrorMessage(alertContentHolderElem, 'Something went wrong while deleting the email template. Please try again.');
            } else {
                $(contentRowElem).fadeOut(200, function () {
                    $(this).remove();
                    resetContentTableVisibility(alertContentHolderElem);
                });
            }
        });
    } else {
        alertErrorMessage(alertContentHolderElem, 'Alert record id not found. Please try again.');
    }
}

function resetContentTableVisibility(alertContentHolderElem) {
    if ($(alertContentHolderElem).find('.fscontent-wrapper-inner .oar-content-row').length < 1) {
        $(alertContentHolderElem).find('.fscontent-wrapper-inner').remove();
        var toggleTabId = $(alertContentHolderElem).parent().attr('id');
        toggleTabId = $('#sfff-alert-editor').find('.alert-pills a[href="#' + toggleTabId + '"]').attr('id');
        toggleAlertsTab($('#' + toggleTabId), null, false);

    }
}

function duplicateAlertTemplate(elemSource) {
    var contentRowElem = $(elemSource).parents('.oar-content-row');
    var alertContentHolderElem = $(contentRowElem).parents('.alert-content-holder');
    var recId = $(contentRowElem).attr('data-recid');
    if (!isNullOrEmpty(recId)) {
        $(contentRowElem).addClass('ff-loading');
        remoteDuplicateAlertTemplateInfoJS(alertContentHolderElem, recId);
    }
}

function duplicateAlert(elemSource) {
    var contentRowElem = $(elemSource).parents('.oar-content-row');
    var alertContentHolderElem = $(contentRowElem).parents('.alert-content-holder');
    var recId = $(contentRowElem).attr('data-recid');
    if (!isNullOrEmpty(recId)) {
        $(contentRowElem).addClass('ff-loading');
        remoteDuplicateAlertInfoJS(alertContentHolderElem, recId);
    }
}

function onAlertTypeChange(elemSource) {
    var alertType = $(elemSource).val();
    var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');
    if (!isNullOrEmpty(alertType) && alertType != '--select an alert type--' && $.inArray(alertType, PDFEnabledAlertTypeArr) >= 0) {

        $(alertContentHolderElem).find('.attachment-group').slideDown();
    } else {
        $(alertContentHolderElem).find('.attachment-group').slideUp();
    }
}

function alertSuccessMessage(alertContentHolderElem, msg) {

    var alertMsgWrapper = $('<div/>', {
        'class': 'alert-msg-wrapper'
    });

    alertMsgWrapper.html('<div class="vff-success " id="successAlertActionBox" ><div class="vff-success-msg msg-text-div" onclick="closeNotification(this);">' + msg + '</div></div>');
    $(alertContentHolderElem).find('.alert-msg-wrapper').remove();
    $(alertContentHolderElem).prepend($(alertMsgWrapper).clone().wrap('<p>').parent().html());
}

function alertValidationMessage(alertContentHolderElem, msg) {
    var alertMsgWrapper = $('<div/>', {
        'class': 'alert-msg-wrapper'
    });

    alertMsgWrapper.html('<div class="vff-alert " id="errorAlertActionBox" ><div class="vff-alert-msg msg-text-div" onclick="closeNotification(this);">' + msg + '</div></div>');
    $(alertContentHolderElem).find('.alert-msg-wrapper').remove();
    $(alertContentHolderElem).find('.al-email-content-box').append($(alertMsgWrapper).clone().wrap('<p>').parent().html());
}

function alertErrorMessage(alertContentHolderElem, msg) {

    var alertMsgWrapper = $('<div/>', {
        'class': 'alert-msg-wrapper'
    });

    alertMsgWrapper.html('<div class="vff-alert " id="errorAlertActionBox" ><div class="vff-alert-msg msg-text-div" onclick="closeNotification(this);">' + msg + '</div></div>');
    $(alertContentHolderElem).find('.alert-msg-wrapper').remove();
    $(alertContentHolderElem).prepend($(alertMsgWrapper).clone().wrap('<p>').parent().html());
}

function hideAlertNotifications() {
    $('.sfff-alert-editor-body').find('.alert-msg-wrapper').remove();
}

function toggleAlertStatus(elemSource, isAutoSave) {
    var toggleStatusParent = $(elemSource).parents('.toggle-mode-box-inner');
    if ($(toggleStatusParent).hasClass('mode-active')) {
        remoteobjToggleAlertStatus(elemSource, isAutoSave, false);
    } else {
        remoteobjToggleAlertStatus(elemSource, isAutoSave, true);
    }

}

function setAlertStatusToggle(elemSource, alertstatus) {
    var toggleStatusParent = $(elemSource).parents('.toggle-mode-box-inner');

    if (alertstatus) {

        $(toggleStatusParent).find('.toggle-mode-status').html('Active');
        $(toggleStatusParent).addClass('mode-active');
    } else {

        $(toggleStatusParent).find('.toggle-mode-status').html('Inactive');

        $(toggleStatusParent).removeClass('mode-active');

    }
}

function remoteobjToggleAlertStatus(elemSource, isAutoSave, alertstatus) {

    var contentRowElem = $(elemSource).parents('.oar-content-row');
    var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');
    var recId = $(elemSource).attr('data-toggle-id');
    if (!isNullOrEmpty(recId)) {
        var statusField
        var ffalert;
        if (isNullOrEmpty(SFOrgPrefix)) {
            ffalert = new ffAlertNS.ffAlertObj({
                Id: recId,
                Status__c: alertstatus
            });
        } else {
            ffalert = new ffAlertNS.ffAlertObj({
                Id: recId,
                VisualAntidote__Status__c: alertstatus
            });
        }
        ffalert.update(function (err, ids, objevent) {
            if (err) {
                console.log('Update Callback error:' + err);
                alertErrorMessage(alertContentHolderElem, 'Something went wrong while changing the alert status. Please try again.');
            } else {
                setAlertStatusToggle($(contentRowElem).find('.toggle-mode-link'), alertstatus);
                draftchanges(true);
                updatePreviousFormObjForPublishToggle('Unpublished');
            }
        });
    } else {
        alertErrorMessage(alertContentHolderElem, 'Alert record id not found. Please try again.');
    }
}



function saveasAlertTemplate(alertContentHolderElem, alertRecId, name) {
    var alertTab = getAlertTabType($(alertContentHolderElem).parent().attr('id'));
    var alertTemplateObj = {};

    alertTemplateObj[SFOrgPrefix + 'Subject__c'] = GetInputValue($(alertContentHolderElem).find('.al-subject-row input.al-text-box').val());
    alertTemplateObj[SFOrgPrefix + 'Body__c'] = brTagSafe(CKEDITOR.instances[$(alertContentHolderElem).find('.ckeditortext').attr('id')].getData());

    if (!isNullOrEmpty(alertRecId)) {
        alertTemplateObj.Id = alertRecId;
        if (!isNullOrEmpty(name)) {
            alertTemplateObj[SFOrgPrefix + 'Name__c'] = name;
        }
        var ffUpdateTemplateAlertObj = new ffAlertTemplateNS2.ffAlertTemplateCreateObj(alertTemplateObj);
        ffUpdateTemplateAlertObj.update(function (err, event, obj) {
            if (err) {
                console.log('ERROR while updating Alert_Template__c object:' + err);
                alertErrorMessage(alertContentHolderElem, 'Something went wrong while inserting  new Email Tmeplate information. Please try again.');
            } else {
                console.log('Alert template updated: ID- ' + ffUpdateTemplateAlertObj.get('Id'));
                if (alertTab == 'emailtemplate') {
                    saveAlertTemplateInfoCallback(alertContentHolderElem, false);
                } else {
                    var newItem = {
                        "FFText": name,
                        "FFValue": ffUpdateTemplateAlertObj.get('Id')
                    };
                    addCustomTemplateItem($(alertContentHolderElem).find('.email-template-row select'), newItem, false);
                }
            }
        });
    } else {

        alertTemplateObj[SFOrgPrefix + 'Name__c'] = name;
        alertTemplateObj[SFOrgPrefix + 'Category__c'] = 'Custom';
        var ffTemplateAlertObj = new ffAlertTemplateNS2.ffAlertTemplateCreateObj();
        ffTemplateAlertObj.create(alertTemplateObj, function (err, event, obj) {
            if (err) {
                console.log('ERROR while creating Alert_Template__c object:' + err);
                alertErrorMessage(alertContentHolderElem, 'Something went wrong while inserting  new Email Tmeplate information. Please try again.');
            } else {
                console.log('New alert template created: ID- ' + ffTemplateAlertObj.get('Id'));
                if (alertTab == 'emailtemplate') {
                    saveAlertTemplateInfoCallback(alertContentHolderElem, true);
                } else {
                    var newItem = {
                        "FFText": SetInputValue(name),
                        "FFValue": ffTemplateAlertObj.get('Id')
                    };
                    addCustomTemplateItem($(alertContentHolderElem).find('.email-template-row select'), newItem, true);
                }
            }
        });
    }
}

function saveNewAlertTemplateAs(elemSource) {
    var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');
    var alertRecId = $(elemSource).parents('.email-edit-content').attr('data-alert-recid');

    var dialogBody = "<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>Save new template as:<br /><br /></div><div class='secondary'>Name:<input style='margin-left:20px;' id='dialogAlertTemplatename' type='text'></div></div>";
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
                click: function () {

                    var name = GetInputValue($('#dialogAlertTemplatename').val());
                    if (!isNullOrEmpty(name)) {
                        $(this).dialog('close');
                        validateAlertTemplateName(alertContentHolderElem, name, '');
                    } else {

                    }
                },
                text: 'Save Template',
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

function overwriteAlertTemplate(alertContentHolderElem, templateId) {

    //var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');
    if (!isNullOrEmpty(templateId)) {
        var dialogBody = "<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>A  template already exists with this name. Do you want to overwrite the existing template?<br /><br /></div></div>";
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
                    click: function () {
                        $(this).dialog('close');
                        saveasAlertTemplate(alertContentHolderElem, templateId, '');
                    },
                    text: 'Yes',
                    'class': 'vabutton1'
                },
                "No": {
                    click: function () {
                        $(this).dialog('close');

                    },
                    text: 'No',
                    'class': 'vabutton2'
                }

            },
            open: function (event, ui) {
                $('.ui-dialog :button').blur();
            }
        });
    }


}

function validateAlertTemplateName(alertContentHolderElem, templateName, templateId) {
    var ffTemplateAlertObj = new ffAlertTemplateNS2.ffAlertTemplateCreateObj();
    var where_condition = {};
    where_condition.where = {};

    where_condition.where[SFOrgPrefix + 'Name__c'] = { eq: templateName };
    if (!isNullOrEmpty(templateId)) {
        where_condition.where[SFOrgPrefix + 'Name__c'] = { eq: templateName };
        where_condition.where['Id'] = { ne: templateId };
    }

    ffTemplateAlertObj.retrieve(function () {
        return (where_condition);
    }, function (error, results, eventobj) {

        if (eventobj.result != null && eventobj.result.records[0] !== undefined) {
            overwriteAlertTemplate(alertContentHolderElem, eventobj.result.records[0].Id);
        } else {
            saveasAlertTemplate(alertContentHolderElem, templateId, templateName);
        }
    });
}

function validateAlertEmail(pElement) {
    return isEmailValid(pElement);
}



function onAlertInfoChange(elemSource) {
    var alertContentHolderElem = $(elemSource).parents('.alert-content-holder');
    var tabId = $(alertContentHolderElem).parent().attr('id');
    var tabTitleElem = $('#sfff-alert-editor').find('.alert-pills a[href="#' + tabId + '"] .tab-title');
    if ($(tabTitleElem).find('.alert-changed').length == 0) {
        $(tabTitleElem).append('<i class="alert-changed">*</i>');
    }

    var vListEmailFields = ['From__c', 'To__c', 'CC__c', 'BCC__c'];
    var vDataProp = $(elemSource).attr('data-prop');
    if (vListEmailFields.includes(vDataProp) && $(elemSource)[0].type == 'text') {
        validateAlertEmail($(elemSource));
    }

}

function isAlertInfoChanged() {
    if ($('#sfff-alert-editor .nav-pills').find('.alert-changed').length > 0) {
        return true;
    }
    return false;
}

function resetAlertChangeIndicator() {
    $('#sfff-alert-editor .nav-pills').find('.alert-changed').remove();
}

/*Edit Alert JAVASCRIPT ends*/

function getFFPageXML(formPageUlElem, pageOrder) {
    var pageLabel = $(formPageUlElem).find(">li.pageLi .ff-page-header");
    var returnXML = '';
    returnXML += '<ffPage>';

    returnXML += '<name>' + getXmlSafeHTML($(pageLabel).html(), "") + '</name>';
    returnXML += '<pageOrder>' + pageOrder + '</pageOrder>';
    returnXML += '<isHidden>' + getSafeBoolean($(formPageUlElem).attr('data-ishidden'), false) + '</isHidden>';
    returnXML += '<pageId>' + safeStringValue($(pageLabel).attr("id"), "") + '</pageId>';
    var sectionElementXML = '';
    $(formPageUlElem).find(">li.formSectionUlWrap  .formSectionUl").each(function (sectionIndx, formSectionUlElem) {
        sectionElementXML += getFFOSectionXML(formSectionUlElem, sectionIndx);
    });
    returnXML += '<sectionList>';
    if (!isNullOrEmpty(sectionElementXML)) {
        returnXML += sectionElementXML;
    }
    returnXML += '</sectionList>';
    returnXML += '</ffPage>';

    return returnXML;
}
function getFFOSectionXML(formSectionUlElem, sectionOrder) {

    var sectionLabel = $(formSectionUlElem).find(">li.sectionLi .ff-section-header");
    var returnXML = '';
    returnXML += '<OSection>';
    returnXML += '<name>' + getXmlSafeHTML($(sectionLabel).html(), "") + '</name>';
    returnXML += '<sectionOrder>' + sectionOrder + '</sectionOrder>';
    returnXML += '<isHidden>' + getSafeBoolean($(formSectionUlElem).attr('data-ishidden'), false) + '</isHidden>';
    var isSectionRepeat = getSafeBoolean($(formSectionUlElem).hasClass('section-repeat'), false);
    returnXML += '<repeat>' + isSectionRepeat + '</repeat>';
    if (isSectionRepeat) {
        returnXML += '<addLink>' + safeStringValue($(formSectionUlElem).attr('data-add-link'), "") + '</addLink>';
        returnXML += '<removeLink>' + safeStringValue($(formSectionUlElem).attr('data-remove-link'), "") + '</removeLink>';
        returnXML += '<minCount>' + safeStringValue($(formSectionUlElem).attr('data-min-count'), "") + '</minCount>';
        returnXML += '<maxCount>' + safeStringValue($(formSectionUlElem).attr('data-max-count'), "") + '</maxCount>';
    }
    returnXML += '<sectionId>' + safeStringValue($(sectionLabel).attr("id"), "") + '</sectionId>';
    //OLookup,OMultiPicklist,OSinglePicklist,OCurrency,ONumeric,OSField,OGeneralText,OCaptcha,OFileUpload,OImage,OPayPalPayment,OESignature 
    var fieldElementXML = '';
    $(formSectionUlElem).find(">li.formFieldUlWrap  .formFieldUl>.fieldLi , >li.formFieldUlWrap  .formFieldUl>li>.matrix-section>.fieldLi ").each(function (indx, fieldLiElement) {
        var elemType = safeStringValue($(fieldLiElement).attr('data-otype'), '');
        switch (elemType) {
            case 'OLookup':
                fieldElementXML += getFFOLookupXML(fieldLiElement);
                break;
            case 'OMultiPicklist':
                fieldElementXML += getFFOMultiPicklistXML(fieldLiElement);
                break;
            case 'OSinglePicklist':
                fieldElementXML += getFFOSinglePicklistXML(fieldLiElement);
                break;
            case 'OCurrency':
                fieldElementXML += getFFOCurrencyXML(fieldLiElement);
                break;
            case 'ONumeric':
                fieldElementXML += getFFONumericXML(fieldLiElement);
                break;
            case 'OSField':
                fieldElementXML += getFFOSFieldXML(fieldLiElement);
                break;
            case 'OGeneralText':
                fieldElementXML += getFFOGeneralTextXML(fieldLiElement);
                break;
            case 'OCaptcha':
                fieldElementXML += getFFOCaptchaXML(fieldLiElement);
                break;
            case 'OFileUpload':
                fieldElementXML += getFFOFileUploadXML(fieldLiElement);
                break;
            case 'OImage':
                fieldElementXML += getFFOImageXML(fieldLiElement);
                break;
            case 'OPayPalPayment':
            case 'OiATSPayment':
            case 'OStripePayment':
            case 'OAuthorizeNetPayment':
                fieldElementXML += getFFPaymentXML(fieldLiElement, elemType);
                break;
            case 'OESignature':
                fieldElementXML += getFFOESignatureXML(fieldLiElement);
                break;

            default:
        }
    });
    returnXML += '<fieldList>';
    if (!isNullOrEmpty(fieldElementXML)) {
        returnXML += fieldElementXML;
    }
    returnXML += '</fieldList>';
    returnXML += '</OSection>';
    return returnXML;
}
function getFFOSFieldXML(fieldLiElement) {
    var labelElem = $(fieldLiElement).find('.labelDiv label.ff-label');
    var inputElem = $(fieldLiElement).find('.fieldDiv input,textarea');
    var elementId = $(inputElem).attr('id');
    var colorCode = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-colorcode'), "");
    var listname = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-listname'), "");
    var objectType = '';
    var objectName = '';
    var dataObj = getObjectConfigFromElemId(elementId, colorCode);
    if (dataObj != null) {
        objectType = dataObj["objectType"] + "";
        objectName = dataObj["objectName"] + "";
    }
    var defaultvalue = '';
    var returnXML = '';
    var ctrltype = 'textbox';
    if ($(inputElem).length > 0) {
        if ($(inputElem)[0].type == 'checkbox') {
            defaultvalue = false;
            ctrltype = 'checkbox';
            if ($(inputElem).prop("checked")) {
                defaultvalue = true;
            }
        } else if ($(inputElem)[0].type == 'textarea') {
            ctrltype = 'textarea';
            defaultvalue = $(inputElem).val();
        } else {
            defaultvalue = $(inputElem).val();
        }
    }
    returnXML += '<OField type="OSField">';
    returnXML += '<sortableObject>' + listname + '</sortableObject>';
    returnXML += '<objectName>' + objectName + '</objectName>';
    returnXML += '<objectType>' + objectType + '</objectType>';
    returnXML += '<controlType>' + ctrltype + '</controlType>';
    returnXML += '<label>' + getXmlSafeHTML($(labelElem).html(), "") + '</label>';
    returnXML += '<elemId>' + elementId + '</elemId>';
    returnXML += '<name>' + getSafeApiName(fieldLiElement) + '</name>';
    returnXML += '<type>' + safeStringValue($(inputElem).attr("vatt"), "") + '</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(inputElem).attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required>' + getSafeBoolean($(inputElem).attr('data-isrequired'), false) + '</required>';
    returnXML += '<placeholder>' + safeStringValue($(inputElem).attr('placeholder'), "") + '</placeholder>';
    returnXML += '<colorCode>' + colorCode + '</colorCode>';
    returnXML += '<readOnly>' + getSafeBoolean($(inputElem).attr('data-isreadonly'), false) + '</readOnly>';
    returnXML += '<upsert>' + getSafeBoolean($(inputElem).attr('data-isupsert'), false) + '</upsert>';
    returnXML += '<defaultValue>' + defaultvalue + '</defaultValue>';
    returnXML += '<maxLength>' + safeStringValue($(inputElem).attr('maxLength'), "") + '</maxLength>';
    returnXML += '<maxLengthMessage>' + safeStringValue($(inputElem).attr('data-maxlengthmessage'), "") + '</maxLengthMessage>';
    returnXML += '<validatefieldtype>' + safeStringValue($(inputElem).attr('data-validatefieldtype'), "") + '</validatefieldtype>';
    if (ctrltype == 'textarea') {
        returnXML += '<isHtmlFormatted>' + getSafeBoolean($(inputElem).attr('data-ishtmlformatted'), false) + '</isHtmlFormatted>';
    }
    returnXML += '<isDefaultReq>' + getSafeBoolean($(inputElem).attr('data-isdefaultreq'), false) + '</isDefaultReq>';
    returnXML += '<isUserReq>' + getSafeBoolean($(inputElem).attr('data-isuserreq'), false) + '</isUserReq>';
    returnXML += '<requiredMessage>' + safeStringValue($(inputElem).attr('data-requiredmessage'), "") + '</requiredMessage>';
    returnXML += '<vatt>' + safeStringValue($(inputElem).attr("vatt"), "") + '</vatt>';
    returnXML += '<flexControlEnabled>false</flexControlEnabled>';
    returnXML += '<formatMessage/>';
    returnXML += '</OField>';

    return returnXML;
}
function getFFOCurrencyXML(fieldLiElement) {
    var labelElem = $(fieldLiElement).find('.labelDiv label.ff-label');
    var inputElem = $(fieldLiElement).find('.fieldDiv input[type="textbox"]');
    var elementId = $(inputElem).attr('id');
    var colorCode = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-colorcode'), "");
    var listname = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-listname'), "");
    var objectType = '';
    var objectName = '';
    var defaultvalue = $(inputElem).val();
    var dataObj = getObjectConfigFromElemId(elementId, colorCode);
    if (dataObj != null) {
        objectType = dataObj["objectType"] + "";
        objectName = dataObj["objectName"] + "";
    }
    var returnXML = '';
    returnXML += '<OField  type="OCurrency">';
    returnXML += '<sortableObject>' + listname + '</sortableObject>';
    returnXML += '<objectName>' + objectName + '</objectName>';
    returnXML += '<objectType>' + objectType + '</objectType>';
    returnXML += '<controlType>textbox</controlType>';
    returnXML += '<label>' + getXmlSafeHTML($(labelElem).html(), "") + '</label>';
    returnXML += '<elemId>' + elementId + '</elemId>';
    returnXML += '<name>' + getSafeApiName(fieldLiElement) + '</name>';
    returnXML += '<type>CURRENCY</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(inputElem).attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required>' + getSafeBoolean($(inputElem).attr('data-isrequired'), false) + '</required>';
    returnXML += '<placeholder>' + safeStringValue($(inputElem).attr('placeholder'), "") + '</placeholder>';
    returnXML += '<colorCode>' + colorCode + '</colorCode>';
    returnXML += '<readOnly>' + getSafeBoolean($(inputElem).attr('data-isreadonly'), false) + '</readOnly>';
    returnXML += '<upsert>' + getSafeBoolean($(inputElem).attr('data-isupsert'), false) + '</upsert>';
    returnXML += '<defaultValue>' + defaultvalue + '</defaultValue>';
    returnXML += '<maxLength>' + safeStringValue($(inputElem).attr('maxLength'), "") + '</maxLength>';
    returnXML += '<maxLengthMessage>' + safeStringValue($(inputElem).attr('data-maxlengthmessage'), "") + '</maxLengthMessage>';
    returnXML += '<isDefaultReq>' + getSafeBoolean($(inputElem).attr('data-isdefaultreq'), false) + '</isDefaultReq>';
    returnXML += '<isUserReq>' + getSafeBoolean($(inputElem).attr('data-isuserreq'), false) + '</isUserReq>';
    returnXML += '<requiredMessage>' + safeStringValue($(inputElem).attr('data-requiredmessage'), "") + '</requiredMessage>';
    returnXML += '<vatt>' + safeStringValue($(inputElem).attr("vatt"), "") + '</vatt>';
    returnXML += '<flexControlEnabled>false</flexControlEnabled>';
    returnXML += '<formatMessage/>';
    returnXML += '<currencyLabel>' + safeStringValue($(fieldLiElement).find('.fieldDiv .ff-currency').html(), "") + '</currencyLabel>';
    returnXML += '</OField>';
    return returnXML;
}
function getFFONumericXML(fieldLiElement) {
    var labelElem = $(fieldLiElement).find('.labelDiv label.ff-label');
    var inputElem = $(fieldLiElement).find('.fieldDiv input[type="textbox"]');
    var elementId = $(inputElem).attr('id');
    var colorCode = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-colorcode'), "");
    var listname = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-listname'), "");
    var defaultvalue = $(inputElem).val();
    var objectType = '';
    var objectName = '';
    var dataObj = getObjectConfigFromElemId(elementId, colorCode);
    if (dataObj != null) {
        objectType = dataObj["objectType"] + "";
        objectName = dataObj["objectName"] + "";
    }
    var returnXML = '';
    returnXML += '<OField  type="ONumeric">';
    returnXML += '<sortableObject>' + listname + '</sortableObject>';
    returnXML += '<objectName>' + objectName + '</objectName>';
    returnXML += '<objectType>' + objectType + '</objectType>';
    returnXML += '<controlType>textbox</controlType>';
    returnXML += '<label>' + getXmlSafeHTML($(labelElem).html(), "") + '</label>';
    returnXML += '<elemId>' + elementId + '</elemId>';
    returnXML += '<name>' + getSafeApiName(fieldLiElement) + '</name>';
    returnXML += '<type>NUMERIC</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(inputElem).attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required>' + getSafeBoolean($(inputElem).attr('data-isrequired'), false) + '</required>';
    returnXML += '<placeholder>' + safeStringValue($(inputElem).attr('placeholder'), "") + '</placeholder>';
    returnXML += '<colorCode>' + colorCode + '</colorCode>';
    returnXML += '<readOnly>' + getSafeBoolean($(inputElem).attr('data-isreadonly'), false) + '</readOnly>';
    returnXML += '<upsert>' + getSafeBoolean($(inputElem).attr('data-isupsert'), false) + '</upsert>';
    returnXML += '<defaultValue>' + defaultvalue + '</defaultValue>';
    returnXML += '<maxLength>' + safeStringValue($(inputElem).attr('maxLength'), "") + '</maxLength>';
    returnXML += '<maxLengthMessage>' + safeStringValue($(inputElem).attr('data-maxlengthmessage'), "") + '</maxLengthMessage>';
    returnXML += '<isDefaultReq>' + getSafeBoolean($(inputElem).attr('data-isdefaultreq'), false) + '</isDefaultReq>';
    returnXML += '<isUserReq>' + getSafeBoolean($(inputElem).attr('data-isuserreq'), false) + '</isUserReq>';
    returnXML += '<requiredMessage>' + safeStringValue($(inputElem).attr('data-requiredmessage'), "") + '</requiredMessage>';
    returnXML += '<vatt>' + safeStringValue($(inputElem).attr("vatt"), "") + '</vatt>';
    returnXML += '<flexControlEnabled>true</flexControlEnabled>';
    returnXML += '<formatMessage/>';
    var flexctrltype = safeStringValue($(inputElem).attr('data-flexcontrol'), "");
    returnXML += '<flexControlType>' + flexctrltype + '</flexControlType>';
    var XML;
    if (!isNullOrEmpty(flexctrltype) && flexctrltype.toLowerCase() != 'integer-default') {
            XML = getFFNumFlexXML(inputElem);
        if (!isNullOrEmpty(XML) && flexctrltype.toLowerCase() != 'integer-matrixlikert') {
            returnXML += '<flexControlXML>' + XML + '</flexControlXML>';
        } else if (flexctrltype.toLowerCase() == 'integer-matrixlikert') {
            XML = getFFNumMatrixXML(inputElem);
            if (!isNullOrEmpty(XML)) {
                returnXML += '<matrixControlXML>' + XML + '</matrixControlXML>';
            }
        }
    }

    returnXML += '</OField>';
    return returnXML;
}
function getFFNumFlexXML(inputElem) {
    var returnXML = '';

    returnXML += '<data_flex_min>' + getXmlSafeHTML($(inputElem).attr('data-flex-min'), "") + '</data_flex_min>';
    returnXML += '<data_flex_middle>' + getXmlSafeHTML($(inputElem).attr('data-flex-middle'), "") + '</data_flex_middle>';
    returnXML += '<data_flex_max>' + getXmlSafeHTML($(inputElem).attr('data-flex-max'), "") + '</data_flex_max>';
    returnXML += '<data_flex_minlabel>' + getXmlSafeHTML($(inputElem).attr('data-flex-minlabel'), "") + '</data_flex_minlabel>';
    returnXML += '<data_flex_middlelabel>' + getXmlSafeHTML($(inputElem).attr('data-flex-middlelabel'), "") + '</data_flex_middlelabel>';
    returnXML += '<data_flex_maxlabel>' + getXmlSafeHTML($(inputElem).attr('data-flex-maxlabel'), "") + '</data_flex_maxlabel>';

    return returnXML;
}

function getFFNumMatrixXML(inputElem) {
    var returnXML = '';

    returnXML += '<data_matrix_value_steps>' + getXmlSafeHTML($(inputElem).attr('data-matrix-value-steps'), "") + '</data_matrix_value_steps>';
    returnXML += '<data_matrix_label_isshownlabel>' + getXmlSafeHTML($(inputElem).attr('data-matrix-label-isshownlabel'), "") + '</data_matrix_label_isshownlabel>';
    returnXML += '<data_matrix_columns>' + getXmlSafeHTML($(inputElem).attr('data-matrix-columns'), "") + '</data_matrix_columns>';
    returnXML += '<data_matrix>' + getXmlSafeHTML($(inputElem).attr('data-matrix'), "") + '</data_matrix>';
    returnXML += '<data_matrix_labels>' + getXmlSafeHTML($(inputElem).attr('data-matrix-labels'), "") + '</data_matrix_labels>';
    return returnXML;
}


function getObjectConfigFromElemId(elementId, colorCode) {
    var dataObj;
    if (!isNullOrEmpty(elementId)) {
        var idToArray = elementId.split('\.');

        if (idToArray.length == 2) {

            dataObj = createJSONObjInfo("PRIMARY", idToArray[0] + '');
        }
        else if (idToArray.length > 2) {
            if (isNullOrEmpty(colorCode)) {

                dataObj = createJSONObjInfo("LOOKUP", idToArray[1].replace("Id", ""));
            }
            else {
                dataObj = createJSONObjInfo("DETAIL", idToArray[1].replace("Id", ""));
            }
        }
    }
    return dataObj;
}
function getFFOLookupXML(fieldLiElement) {
    var labelElem = $(fieldLiElement).find('.labelDiv label.ff-label');
    var inputHiddenElem = $(fieldLiElement).find('.fieldDiv input[type="hidden"]');
    var inputElem = $(fieldLiElement).find('.fieldDiv input[type="textbox"]');
    var elementId = $(inputElem).attr('id');
    var colorCode = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-colorcode'), "");
    var listname = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-listname'), "");
    var objectType = '';
    var objectName = '';
    var dataObj = getObjectConfigFromElemId(elementId, colorCode);
    if (dataObj != null) {
        objectType = dataObj["objectType"] + "";
        objectName = dataObj["objectName"] + "";
    }
    var returnXML = '';
    returnXML += '<OField  type="OLookup">';
    returnXML += '<sortableObject>' + listname + '</sortableObject>';
    returnXML += '<objectName>' + objectName + '</objectName>';
    returnXML += '<objectType>' + objectType + '</objectType>';
    returnXML += '<controlType>lookupinput</controlType>';
    returnXML += '<label>' + getXmlSafeHTML($(labelElem).html(), "") + '</label>';
    returnXML += '<elemId>' + elementId + '</elemId>';
    returnXML += '<name>' + getSafeApiName(fieldLiElement) + '</name>';
    returnXML += '<type>LOOKUP</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(inputElem).attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required>' + getSafeBoolean($(inputElem).attr('data-isrequired'), false) + '</required>';
    returnXML += '<placeholder>' + safeStringValue($(inputElem).attr('placeholder'), "") + '</placeholder>';
    returnXML += '<colorCode>' + colorCode + '</colorCode>';
    returnXML += '<readOnly>' + getSafeBoolean($(inputElem).attr('data-isreadonly'), false) + '</readOnly>';
    returnXML += '<upsert>' + getSafeBoolean($(inputElem).attr('data-isupsert'), false) + '</upsert>';
    returnXML += '<defaultValue>' + $(inputElem).val() + '</defaultValue>';
    returnXML += '<maxLength>' + safeStringValue($(inputElem).attr('maxLength'), "") + '</maxLength>';
    returnXML += '<maxLengthMessage>' + safeStringValue($(inputElem).attr('data-maxlengthmessage'), "") + '</maxLengthMessage>';
    returnXML += '<isDefaultReq>' + getSafeBoolean($(inputElem).attr('data-isdefaultreq'), false) + '</isDefaultReq>';
    returnXML += '<isUserReq>' + getSafeBoolean($(inputElem).attr('data-isuserreq'), false) + '</isUserReq>';
    returnXML += '<requiredMessage>' + safeStringValue($(inputElem).attr('data-requiredmessage'), "") + '</requiredMessage>';
    returnXML += '<vatt>REFERENCE</vatt>';
    returnXML += '<flexControlEnabled>false</flexControlEnabled>';
    returnXML += '<formatMessage/>';
    if (safeStringValue($(inputHiddenElem).attr('data-lookup-value'), "") == 'list') {
        returnXML += '<listViewType>list</listViewType>';
    }
    else {
        returnXML += '<listViewType></listViewType>';
    }
    returnXML += '<listViewId>' + safeStringValue($(inputHiddenElem).attr('data-lookup-value'), "") + '</listViewId>';
    returnXML += '<listViewObject>' + safeStringValue($(inputHiddenElem).attr('data-lookup-object'), "") + '</listViewObject>';
    returnXML += '<defaultValueId>' + $(inputHiddenElem).val() + '</defaultValueId>';
    returnXML += '<ltypeObj>' + safeStringValue($(inputElem).attr('data-lobj'), "") + '</ltypeObj>';
    returnXML += '<rtypeObj>' + safeStringValue($(inputElem).attr('data-robj'), "") + '</rtypeObj>';
    returnXML += '</OField>';



    return returnXML;
}
function getFFOSinglePicklistXML(fieldLiElement) {
    var labelElem = $(fieldLiElement).find('.labelDiv label.ff-label');
    var inputElem = $(fieldLiElement).find('.fieldDiv select');
    var elementId = $(inputElem).attr('id');
    var colorCode = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-colorcode'), "");
    var listname = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-listname'), "");
    var objectType = '';
    var objectName = '';
    var dataObj = getObjectConfigFromElemId(elementId, colorCode);
    if (dataObj != null) {
        objectType = dataObj["objectType"] + "";
        objectName = dataObj["objectName"] + "";
    }
    var selectedValue = $(inputElem).val();
    var defaultValue = '';
    if (!isNullOrEmpty(selectedValue)) {

        defaultValue = selectedValue;

    }
    defaultValue = escapeHtmlString(defaultValue);
    var returnXML = '';
    returnXML += '<OField  type="OSinglePicklist">';
    returnXML += '<sortableObject>' + listname + '</sortableObject>';
    returnXML += '<objectName>' + objectName + '</objectName>';
    returnXML += '<objectType>' + objectType + '</objectType>';
    returnXML += '<controlType>select-one</controlType>';
    returnXML += '<label>' + getXmlSafeHTML($(labelElem).html(), "") + '</label>';
    returnXML += '<elemId>' + elementId + '</elemId>';
    returnXML += '<dtCustom>' + getSafeBoolean($(inputElem).attr('data-customset'), false) + '</dtCustom>';
    returnXML += '<name>' + getSafeApiName(fieldLiElement) + '</name>';
    returnXML += '<type>PICKLIST</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(inputElem).attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required>' + getSafeBoolean($(inputElem).attr('data-isrequired'), false) + '</required>';
    returnXML += '<colorCode>' + colorCode + '</colorCode>';
    returnXML += '<readOnly>' + getSafeBoolean($(inputElem).attr('data-isreadonly'), false) + '</readOnly>';
    returnXML += '<upsert>' + getSafeBoolean($(inputElem).attr('data-isupsert'), false) + '</upsert>';
    returnXML += '<defaultValue>' + defaultValue + '</defaultValue>';
    returnXML += '<maxLength>' + safeStringValue($(inputElem).attr('maxLength'), "") + '</maxLength>';
    returnXML += '<maxLengthMessage>' + safeStringValue($(inputElem).attr('data-maxlengthmessage'), "") + '</maxLengthMessage>';
    returnXML += '<isDefaultReq>' + getSafeBoolean($(inputElem).attr('data-isdefaultreq'), false) + '</isDefaultReq>';
    returnXML += '<isUserReq>' + getSafeBoolean($(inputElem).attr('data-isuserreq'), false) + '</isUserReq>';
    returnXML += '<requiredMessage>' + safeStringValue($(inputElem).attr('data-requiredmessage'), "") + '</requiredMessage>';
    returnXML += '<vatt>PICKLIST</vatt>';
    returnXML += '<flexControlEnabled>true</flexControlEnabled>';
    returnXML += '<formatMessage/>';
    var picklistvalues = getFFPicklistValues(inputElem);
    returnXML += '<picklistValues>' + picklistvalues + '</picklistValues>';
    returnXML += '<flexControlType>' + safeStringValue($(inputElem).attr('data-flexcontrol'), "") + '</flexControlType>';

    returnXML += '</OField>';
    return returnXML;
}
function getFFOMultiPicklistXML(fieldLiElement) {
    var labelElem = $(fieldLiElement).find('.labelDiv label.ff-label');

    var inputElem = $(fieldLiElement).find('.fieldDiv select');
    var elementId = $(inputElem).attr('id');
    var colorCode = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-colorcode'), "");
    var listname = safeStringValue($(fieldLiElement).find('.labelDiv .obj-info').attr('data-listname'), "");
    var objectType = '';
    var objectName = '';
    var dataObj = getObjectConfigFromElemId(elementId, colorCode);
    if (dataObj != null) {
        objectType = dataObj["objectType"] + "";
        objectName = dataObj["objectName"] + "";
    }
    var selectedValue = $(inputElem).val();
    var defaultValue = '';
    if (selectedValue != null && selectedValue !== undefined) {
        if (selectedValue instanceof Array) {
            defaultValue = selectedValue.join(';');
        }
        else {

            defaultValue = selectedValue;
        }
    }
    defaultValue = escapeHtmlString(defaultValue);
    var returnXML = '';
    returnXML += '<OField  type="OMultiPicklist">';
    returnXML += '<sortableObject>' + listname + '</sortableObject>';
    returnXML += '<objectName>' + objectName + '</objectName>';
    returnXML += '<objectType>' + objectType + '</objectType>';
    returnXML += '<controlType>select-multi</controlType>';
    returnXML += '<label>' + getXmlSafeHTML($(labelElem).html(), "") + '</label>';
    returnXML += '<elemId>' + elementId + '</elemId>';
    returnXML += '<dtCustom>' + getSafeBoolean($(inputElem).attr('data-customset'), false) + '</dtCustom>';
    returnXML += '<name>' + getSafeApiName(fieldLiElement) + '</name>';
    returnXML += '<type>MULTIPICKLIST</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(inputElem).attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required>' + getSafeBoolean($(inputElem).attr('data-isrequired'), false) + '</required>';
    returnXML += '<colorCode>' + colorCode + '</colorCode>';
    returnXML += '<readOnly>' + getSafeBoolean($(inputElem).attr('data-isreadonly'), false) + '</readOnly>';
    returnXML += '<upsert>' + getSafeBoolean($(inputElem).attr('data-isupsert'), false) + '</upsert>';
    returnXML += '<defaultValue>' + defaultValue + '</defaultValue>';
    returnXML += '<maxLength>' + safeStringValue($(inputElem).attr('maxLength'), "") + '</maxLength>';
    returnXML += '<maxLengthMessage>' + safeStringValue($(inputElem).attr('data-maxlengthmessage'), "") + '</maxLengthMessage>';
    returnXML += '<isDefaultReq>' + getSafeBoolean($(inputElem).attr('data-isdefaultreq'), false) + '</isDefaultReq>';
    returnXML += '<isUserReq>' + getSafeBoolean($(inputElem).attr('data-isuserreq'), false) + '</isUserReq>';
    returnXML += '<requiredMessage>' + safeStringValue($(inputElem).attr('data-requiredmessage'), "") + '</requiredMessage>';
    returnXML += '<vatt>MULTIPICKLIST</vatt>';
    returnXML += '<flexControlEnabled>true</flexControlEnabled>';
    returnXML += '<formatMessage/>';
    var picklistvalues = getFFPicklistValues(inputElem);
    returnXML += '<picklistValues>' + picklistvalues + '</picklistValues>';
    returnXML += '<flexControlType>' + safeStringValue($(inputElem).attr('data-flexcontrol'), "") + '</flexControlType>';

    returnXML += '</OField>';
    return returnXML;
}

function getFFPicklistValues(selectElement) {


    var picklistValuesXML = '';
    var customDataSet = getSafeBoolean($(selectElement).attr('data-customset'), false);
    if (customDataSet && $(selectElement).parent().find('.selectDataSet select').length > 0) {
        selectElement = $(selectElement).parent().find('.selectDataSet select');
    }
    $.each($(selectElement).find('option'), function (index, optionElem) {

        var optionValue = escapeHtmlString($(optionElem).val());
        var optionText = escapeHtmlString($(optionElem).text());
        var isCustom = getSafeBoolean($(optionElem).attr('data-iscustom'), false);
        var isDisabled = getSafeBoolean($(optionElem).attr('data-disabled'), false);
        var isSelected = false;
        if ($(optionElem).is(':selected')) {
            isSelected = true;
        }
        var customAttr = '';
        if (isDisabled) {
            customAttr = 'ignore="true" ';
        }
        if (isCustom) {
            customAttr += 'custom="true" ';
        }
        picklistValuesXML += '<picklistValue ' + customAttr + 'value="' + optionValue + '" selected="' + isSelected + '">' + optionText + '</picklistValue>';

    });


    return picklistValuesXML;
}
//var generalFields = ['generaltext', 'esignature', 'payment', 'fileupload', 'image', 'captcha'];
function getFFOGeneralTextXML(fieldLiElement) {
    var labelElement = $(fieldLiElement).find('.labelDiv label.ff-label');

    var returnXML = '';
    returnXML += '<OField  type="OGeneralText">';
    returnXML += '<sortableObject/>';
    returnXML += '<objectName>General</objectName>';
    returnXML += '<objectType>GENERAL</objectType>';
    returnXML += '<controlType>GENERALTEXT</controlType>';
    returnXML += '<label>' + getXmlSafeHTML($(labelElement).html(), "") + '</label>';
    returnXML += '<elemId>' + safeStringValue($(labelElement).attr("id"), "").replace(/lbl/g, "") + '</elemId>';
    returnXML += '<name>' + safeStringValue($(labelElement).attr("id"), "").replace(/lbl/g, "") + '</name>';
    returnXML += '<type>STRING</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(labelElement).attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required/>';
    returnXML += '</OField>';
    return returnXML;
}
function getFFOESignatureXML(fieldLiElement) {
    var inputSignatureElement = $(fieldLiElement).find('.eSignatureFieldDiv input.ffd-esignature-input');
    var signatureElemId = safeStringValue($(inputSignatureElement).attr("id"), "");
    signatureElemId = signatureElemId.replace('input', '');
    var returnXML = '';
    returnXML += '<OField  type="OESignature">';
    returnXML += '<sortableObject/>';
    returnXML += '<objectName>General</objectName>';
    returnXML += '<objectType>GENERAL</objectType>';
    returnXML += '<controlType>ESIGNATURE</controlType>';
    returnXML += '<elemId>' + signatureElemId + '</elemId>';
    returnXML += '<name>' + signatureElemId + '</name>';
    returnXML += '<type>ESIGNATURE</type>';
    returnXML += '<hiddenField>false</hiddenField>';
    returnXML += '<required>true</required>';
    returnXML += '<signType>' + safeStringValue($(inputSignatureElement).attr("data-signtype"), "") + '</signType>';
    returnXML += '<signOptions>' + safeStringValue($(inputSignatureElement).attr("data-signoptions"), "") + '</signOptions>';
    returnXML += '<signLabel>' + safeStringValue($(inputSignatureElement).attr("data-signlabel"), "") + '</signLabel>';
    returnXML += '<signDate>' + safeStringValue($(inputSignatureElement).attr("data-signdate"), "") + '</signDate>';
    returnXML += '<isDateHidden>' + safeStringValue($(inputSignatureElement).attr("data-signdatehide"), "false") + '</isDateHidden>';
    returnXML += '<signAgreeText>' + safeStringValue($(inputSignatureElement).attr("data-signagree"), "") + '</signAgreeText>';
    returnXML += '<isAgreeHidden>' + safeStringValue($(inputSignatureElement).attr("data-signagreehide"), "true") + '</isAgreeHidden>';
    returnXML += '<emailEnabled>' + safeStringValue($(inputSignatureElement).attr("data-emailenabled"), "false") + '</emailEnabled>';
    returnXML += '<emailLabel>' + safeStringValue($(inputSignatureElement).attr("data-emaillabel"), "Email") + '</emailLabel>';
    returnXML += '</OField>';
    return returnXML;
}

function getFFPaymentXML(fieldLiElement, paymentType) {
    var oDataType = $(fieldLiElement).attr("data-otype");
    var fieldDivPayment = $(fieldLiElement).find('.field-div-payment');
    var paymentElemId = safeStringValue($(fieldDivPayment).attr("id"), "");
    var paymentElemIndex = paymentElemId.replace('FASTFORMSPAYMENT', '');
    paymentElemIndex = paymentElemIndex.replace('divLabel', '');
    var returnXML = '';
    returnXML += '<OField  type="' + oDataType + '">';
    returnXML += '<sortableObject/>';
    returnXML += '<objectName>General</objectName>';
    returnXML += '<objectType>GENERAL</objectType>';
    returnXML += '<controlType>PAYMENT</controlType>';
    returnXML += '<label/>';
    switch (paymentType) {
        case 'OPayPalPayment':
            returnXML += '<elemId>PAYPALPAYMENT' + paymentElemIndex + '</elemId>';
            returnXML += '<type>PAYPALPAYMENT</type>';
            break;
        case 'OiATSPayment':
            returnXML += '<elemId>IATSPAYMENT' + paymentElemIndex + '</elemId>';
            returnXML += '<type>IATSPAYMENT</type>';
            break;
        case 'OStripePayment':
            returnXML += '<elemId>STRIPEPAYMENT' + paymentElemIndex + '</elemId>';
            returnXML += '<type>STRIPEPAYMENT</type>';
            break;
        case 'OAuthorizeNetPayment':
            returnXML += '<elemId>AUTHORIZENETPAYMENT' + paymentElemIndex + '</elemId>';
            returnXML += '<type>AUTHORIZENETPAYMENT</type>';
            break;
        default:
            returnXML += '<elemId>PAYPALPAYMENT' + paymentElemIndex + '</elemId>';
            returnXML += '<type>PAYPALPAYMENT</type>';
            break;
    }

    returnXML += '<hiddenField>' + safeStringValue($(fieldDivPayment).attr("data-ishidden"), "false") + '</hiddenField>';
    returnXML += '<required>' + getSafeBoolean($(fieldDivPayment).attr('data-paymentrequired'), false) + '</required>';
    returnXML += '<paymentFieldId>' + safeStringValue($(fieldDivPayment).attr("data-paymentfield-record-id"), "") + '</paymentFieldId>';
    returnXML += '<testMode>' + getSafeBoolean($(fieldDivPayment).attr('data-test-mode'), false) + '</testMode>';
    returnXML += '</OField>';
    return returnXML;
}

function getFFOFileUploadXML(fieldLiElement) {
    var labelElement = $(fieldLiElement).find('.labelDiv label.ff-label');
    var fielUploadDivElem = $(fieldLiElement).find('.fieldDiv .ff-fileupload-drop-area');

    var returnXML = '';
    returnXML += '<OField  type="OFileUpload">';
    returnXML += '<sortableObject/>';
    returnXML += '<objectName>General</objectName>';
    returnXML += '<objectType>GENERAL</objectType>';
    returnXML += '<controlType>FILEUPLOAD</controlType>';
    returnXML += '<label>' + getXmlSafeHTML($(labelElement).html(), "") + '</label>';
    returnXML += '<elemId>' + safeStringValue($(fielUploadDivElem).attr("id"), "") + '</elemId>';
    returnXML += '<name/>';
    returnXML += '<type>FILE</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(fielUploadDivElem).attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required>' + getSafeBoolean($(fielUploadDivElem).attr('data-isrequired'), false) + '</required>';
    returnXML += '<uploadToChatter>' + getSafeBoolean($(fielUploadDivElem).attr('data-uploadtochatter'), false) + '</uploadToChatter>';
    returnXML += '<uploadToSFFile>' + getSafeBoolean($(fielUploadDivElem).attr('data-uploadtosffile'), false) + '</uploadToSFFile>';
    returnXML += '<uploadToIntegration>' + getSafeBoolean($(fielUploadDivElem).attr('data-uploadtointegration'), false) + '</uploadToIntegration>';
    returnXML += '<fileServiceOn>' + getSafeBoolean($(fielUploadDivElem).attr('data-fileserviceon'), false) + '</fileServiceOn>';
    returnXML += '<isNativeOptionSelected>' + getSafeBoolean($(fielUploadDivElem).attr('data-isnativeoptionselected'), false) + '</isNativeOptionSelected>';
    returnXML += '<allowedFileTypes>' + safeStringValue($(fielUploadDivElem).attr('data-allowedfiletypes'), "") + '</allowedFileTypes>';
    returnXML += '<maxFiles>' + safeStringValue($(fielUploadDivElem).attr('data-maxfiles'), "3") + '</maxFiles>';
    returnXML += '<maxFileSize>' + safeStringValue($(fielUploadDivElem).attr('data-maxfilesize'), "5") + '</maxFileSize>';
    returnXML += '<attachTo>' + safeStringValue($(fielUploadDivElem).attr('data-attachto'), 1) + '</attachTo>';
    returnXML += '<requiredMessage>' + safeStringValue($(fielUploadDivElem).attr('data-requiredmessage'), "required") + '</requiredMessage>';
    returnXML += '<fileName>' + escapeXML(unescapeXML($(fielUploadDivElem).attr('data-filename'))) + '</fileName>';
    returnXML += '</OField>';
    return returnXML;
}

function getFFOImageXML(fieldLiElement) {
    var imageFieldDiv = $(fieldLiElement).find('.imageGeneralFieldDiv');

    var imgAlignment = '';
    var styleValue = $(imageFieldDiv).attr('style');
    if (!isNullOrEmpty(styleValue)) {
        if (styleValue.toLowerCase().indexOf('right') > 0) {
            imgAlignment = 'right';
        }
        else if (styleValue.toLowerCase().indexOf('left') > 0) {
            imgAlignment = 'left';
        }
        else if (styleValue.toLowerCase().indexOf('center') > 0) {
            imgAlignment = 'center';
        }
    }
    var returnXML = '';
    returnXML += '<OField  type="OImage">';
    returnXML += '<sortableObject/>';
    returnXML += '<objectName>General</objectName>';
    returnXML += '<objectType>GENERAL</objectType>';
    returnXML += '<controlType>IMAGE</controlType>';
    returnXML += '<label/>';
    var elemid = safeStringValue($(imageFieldDiv).find('.ffse-img-upload-placeholder-editor>img').attr('id'), "");
    if (isNullOrEmpty(elemid)) {
        var lblliid = $(fieldLiElement).attr('id');
        elemid = lblliid.replace('lblli', 'img');
    }
    returnXML += '<elemId>' + elemid + '</elemId>';
    returnXML += '<name/>';
    returnXML += '<type>IMAGE</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(fieldLiElement).find('.ff-image-label').attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required/>';
    returnXML += '<imgSrc>' + safeStringValue($(imageFieldDiv).find('.ffse-img-upload-placeholder-editor>img').attr('src'), "") + '</imgSrc>';
    returnXML += '<imgWidth>' + safeStringValue($(imageFieldDiv).find('.ffse-img-upload-placeholder-editor>img').attr('width'), "") + '</imgWidth>';
    returnXML += '<imgHeight>' + safeStringValue($(imageFieldDiv).find('.ffse-img-upload-placeholder-editor>img').attr('height'), "") + '</imgHeight>';
    returnXML += '<alt>' + safeStringValue($(imageFieldDiv).find('.ffse-img-upload-placeholder-editor>img').attr('alt'), "") + '</alt>';
    returnXML += '<alignment>' + imgAlignment + '</alignment>';
    returnXML += '</OField>';
    return returnXML;
}

function getFFOCaptchaXML(fieldLiElement) {
    var inputElem = $(fieldLiElement).find('.fieldDiv input.ff-type-captcha');
    var labelElement = $(fieldLiElement).find('.labelDiv label.ff-label');
    var returnXML = '';
    returnXML += '<OField  type="OCaptcha">';
    returnXML += '<sortableObject/>';
    returnXML += '<objectName>General</objectName>';
    returnXML += '<objectType>GENERAL</objectType>';
    returnXML += '<controlType>CAPTCHA</controlType>';
    returnXML += '<label>' + getXmlSafeHTML($(labelElement).html(), "") + '</label>';
    returnXML += '<elemId>' + safeStringValue($(inputElem).attr('id'), "") + '</elemId>';
    returnXML += '<name>Captcha</name>';
    returnXML += '<type>CAPTCHA</type>';
    returnXML += '<hiddenField>' + getSafeBoolean($(inputElem).attr('data-ishidden'), false) + '</hiddenField>';
    returnXML += '<required>true</required>';
    returnXML += '</OField>';
    return returnXML;
}

function createJSONObjInfo(objecttype, objectname) {
    var dataobj = { "objectType": objecttype, "objectName": objectname };


    return dataobj;
}


function generateFormHTML(pageElemDiv, pageItemXML) {

    var pagename = getXmlSafeHTML($(pageElemDiv).find('>ul.formPageUl>li .ff-page-header').html(), "");//pageItem["pTitle"];
    var pageorder = safeStringValue($(pageElemDiv).find('.ff-page-header-box .page-tag-number').text(), "");  //pageItem["pOrder"];
    var pageid = safeStringValue($(pageElemDiv).attr("data-pageid"), "");
    var pagelabelid = safeStringValue($(pageElemDiv).find('>ul.formPageUl>li .ff-page-header').attr('id'), "");
    var pageishidden = getSafeBoolean($(pageElemDiv).attr("data-ishidden"), false);

    var pageInfoJSONarr = [];
    pageInfoJSONarr.push(createJSONPageObj(pageid, pagelabelid, pagename, pageorder, pageItemXML, '', pageishidden));

    var renderHTML = getRenderedFormHTML(pageInfoJSONarr[0]);
    ////console.log(' Render html'+renderHTML);
    return renderHTML;
}
function getRenderedFormHTML(pageItem) {

    var returnHTML = '';
    var xmlDocElement = getXmlElementFromStr(pageItem["pXML"]);
    var pageElements = xmlDocElement.getElementsByTagName("ffPage");
    var formHtml = $('<div/>');
    $.each(pageElements, function (pageIndx, pageElement) {

        if (pageElement.childNodes.length > 0) {

            var pageishidden = getSafeBoolean(pageItem["pHidden"], false);//firstBooleanElementByTagName(pageElement, "isHidden", false);
            var pageorder = safeStringValue(pageItem["pOrder"], '');//firstElementByTagName(pageElement, "pageOrder", true);
            var pagetitle = safeStringValue(pageItem["pTitle"], '');//firstElementByTagName(pageElement, "name", true);
            var pagenameHTML = unescapeHTMLString(GetInputValueAsHTML(pagetitle));
            var pageId = safeStringValue(pageItem["pFormPageId"], '');
            if (isNullOrEmpty(pageId)) {
                pageId = '';
            }
            else {
                pageId = pageId.replaceAll('pageFFLabel', 'ffPage');
            }
            var pageElemDiv = $('<div/>', { 'id': pageId, 'class': 'ff-page-row page-' + pageorder });
            $(pageElemDiv).attr('data-pagetitle', pagetitle);

            if (pageishidden) {
                $(pageElemDiv).attr('data-page-ishidden', true);
            }
            /*Page title item row starts*/
            var ffPageItemRow = $('<div/>', { 'class': 'ff-page-header-row' });
            var pagelabelElemDiv = $('<div/>', { 'class': 'ff-col-1 ff-page-col' });
            var pagelabelElem = $('<label />', { 'class': 'ff-page-header', 'html': pagenameHTML });
            pagelabelElemDiv.append(pagelabelElem);
            ffPageItemRow.append($('<div/>', { 'class': 'ff-item-row' }).append(pagelabelElemDiv));
            if ($('#mainMultiPageWrapper').find('.form-canvas-multi-page-inner .fc-multi-page-item').length > 1) {
                pageElemDiv.append(ffPageItemRow);
            }
            /*Page  title item row ends*/

            var sectionlistElem = firstElementByTagName(pageElement, "sectionList", false);
            $.each(sectionlistElem.getElementsByTagName("OSection"), function (sectionIndex, sectionElement) {
                // var sectionElemDiv = $('<div/>').addClass('ff-group-row group-' + sectionIndex);

                var sectionname = firstElementByTagName(sectionElement, "name", true);
                var sectionorder = firstElementByTagName(sectionElement, "sectionOrder", true);
                var sectionid = firstElementByTagName(sectionElement, "sectionId", true);
                var sectionnameHTML = unescapeHTMLString(GetInputValueAsHTML(sectionname));
                var sectionishidden = firstBooleanElementByTagName(sectionElement, "isHidden", false);
                var sectionCounter = safeSectionCounter(sectionid);
                var sectionElemDiv = $('<div/>', { 'class': 'ff-group-row group-' + sectionIndex, 'id': 'ffSection' + sectionCounter });
                if (sectionishidden) {
                    $(sectionElemDiv).hide();
                }
                var isSectionRepeat = firstBooleanElementByTagName(sectionElement, "repeat", false);
                if (isSectionRepeat) {
                    $(sectionElemDiv).attr('data-repeat', true);
                    $(sectionElemDiv).attr('data-addlink', firstElementByTagName(sectionElement, "addLink", true));
                    $(sectionElemDiv).attr('data-removelink', firstElementByTagName(sectionElement, "removeLink", true));
                    $(sectionElemDiv).attr('data-min', firstElementByTagName(sectionElement, "minCount", true));
                    $(sectionElemDiv).attr('data-max', firstElementByTagName(sectionElement, "maxCount", true));
                }
                var ffSectionItemRowDiv = $('<div/>', { 'class': 'ff-item-row' });
                var fieldlistElem = firstElementByTagName(sectionElement, "fieldList", false);
                var labelElemDiv = $('<div/>', { 'class': 'ff-col-1 ff-section-col' });
                var sectionlabelElem = $('<label />', { 'class': 'ff-section-header', id: 'sectionLabel' + sectionCounter, 'html': sectionnameHTML });
                labelElemDiv.append(sectionlabelElem);
                ffSectionItemRowDiv.append(labelElemDiv);


                var fieldlistElem = firstElementByTagName(sectionElement, "fieldList", false);
                $.each(fieldlistElem.getElementsByTagName("OField"), function (fieldIndex, fieldElement) {

                    var fieldAttrType = '';
                    if (!isNullOrEmpty(fieldElement.getAttribute('type'))) {
                        fieldAttrType = fieldElement.getAttribute('type');
                    }

                    var ffItemRowDiv = $('<div/>', { 'class': 'ff-item-row' });
                    var elemId = firstElementByTagName(fieldElement, "elemId", true);
                    var elemIdWOdot = elemId.replace(/\./g, '');

                    var labelElemDiv = $('<div/>', { 'class': 'ff-col-1 ff-label-col' });
                    var fieldElemDiv = $('<div/>', { 'class': 'ff-col-2 ff-field-col' });

                    var controltype = firstElementByTagName(fieldElement, "controlType", true);
                    var labeltext = firstElementByTagName(fieldElement, "label", true);
                    var labelHTML = unescapeHTMLString(GetInputValueAsHTML(labeltext));
                    var fieldtype = firstElementByTagName(fieldElement, "type", true);
                    var isfieldhidden = firstBooleanElementByTagName(fieldElement, "hiddenField", false);
                    var labelclass = 'ff-label';
                    if (isfieldhidden) {
                        $(ffItemRowDiv).hide();
                    }

                    var addSField = false;
                    var generalFields = ['generaltext', 'esignature', 'payment', 'fileupload', 'image', 'captcha'];

                    /*field parsing starts*/
                    if (controltype.toLowerCase() != '' && $.inArray(controltype.toLowerCase(), generalFields) < 0) {

                        /*Salesforce object fields*/
                        var vatttype = firstElementByTagName(fieldElement, "vatt", true);
                        var vattUpperCase = safeStringValue(vatttype.toUpperCase(), '');
                        var colorcode = firstElementByTagName(fieldElement, "colorCode", true);

                        var sortableobject = firstElementByTagName(fieldElement, "sortableObject", true);


                        var labelElem = $('<label />', { 'vatt': vatttype, 'for': elemId, 'class': labelclass, id: 'lbl' + elemIdWOdot, 'html': labelHTML });

                        labelElemDiv.html(labelElem);

                        var fieldrequiredmessage = firstElementByTagName(fieldElement, "requiredMessage", true);

                        if (isNullOrEmpty(fieldrequiredmessage)) {
                            fieldrequiredmessage = 'required';
                        }
                        var isrequiredEmpty = firstElementByTagName(fieldElement, "required", true);
                        if (isNullOrEmpty(isrequiredEmpty)) {
                            isrequiredEmpty = true;
                        }
                        var isdatarequired = firstBooleanElementByTagName(fieldElement, "required", false);
                        var isfieldupsert = firstBooleanElementByTagName(fieldElement, "upsert", false);
                        var isfieldreadonly = firstBooleanElementByTagName(fieldElement, "readOnly", false);

                        var isdefaultreq = firstBooleanElementByTagName(fieldElement, "isDefaultReq", false);
                        var isuserreq = firstBooleanElementByTagName(fieldElement, "isUserReq", false);



                        switch (controltype.toLowerCase()) {
                            /// create LOOKUP elements
                            case 'lookupinput':
                                labelElemDiv.find('.ff-label').attr('for', 'input' + elemId);
                                var listviewid = firstElementByTagName(fieldElement, "listViewId", true);
                                var listviewobject = firstElementByTagName(fieldElement, "listViewObject", true);
                                var defaultvalueid = firstElementByTagName(fieldElement, "defaultValueId", true);
                                var defaultvalue = firstElementByTagName(fieldElement, "defaultValue", true);
                                var placeholdertext = firstElementByTagName(fieldElement, "placeholder", true);
                                //vaObj is replaced by ltypeObj node element in xml
                                var ltypeObj = (firstElementByTagName(fieldElement, "vaObj", true) !== undefined) ? safeStringValue(firstElementByTagName(fieldElement, "vaObj", true), "") : safeStringValue(firstElementByTagName(fieldElement, "ltypeObj", true), "");
                                var rtypeobj = firstElementByTagName(fieldElement, "rtypeObj", true);
                                var spanLookupElem = $('<span />', { 'class': 'lookupInput' });
                                var inputHiddenElem = $('<input />', { 'type': 'hidden', 'id': elemId + '', 'vatt': 'REFERENCE' });
                                var inputElem = $('<input />', { 'type': 'textbox', 'id': 'input' + elemId, 'title':'Lookup', 'placeholder': placeholdertext, 'name': 'input' + elemId, 'class': 'ff-input-type ff-type-text lookup-link', 'readonly': 'readonly', 'vatt': 'REFERENCE', value: defaultvalue, 'data-lobj': ltypeObj, 'data-robj': rtypeobj });
                                updateElementProp(inputHiddenElem, 'data-lookup-object', listviewobject, false);
                                updateElementProp(inputHiddenElem, 'data-lookup-value', listviewid, false);
                                if (!isNullOrEmpty(listviewid)) {
                                    updateElementProp(inputHiddenElem, 'data-lookup-value-type', 'list', true);
                                }
                                if (isfieldreadonly) {
                                    updateElementProp(inputHiddenElem, 'readonly', 'readonly', false);
                                }
                                updateElementProp(inputHiddenElem, 'value', defaultvalueid, false);


                                fieldElemDiv.html(inputHiddenElem);
                                fieldElemDiv.append(inputElem);
                                addSField = true;
                                break;
                            /// create TEXTBOX elements
                            case 'textbox':

                                var placeholdertext = firstElementByTagName(fieldElement, "placeholder", true);
                                var fieldmaxlength = firstElementByTagName(fieldElement, "maxLength", true);
                                var fieldmaxlengthmessage = firstElementByTagName(fieldElement, "maxLengthMessage", true);
                                var validatefieldtype = firstElementByTagName(fieldElement, "validatefieldtype", true);

                                var inputElem = $('<input />', {
                                    'type': 'textbox', 'id': elemId + '', 'placeholder': placeholdertext, 'name': elemId + '',
                                    'vatt': vatttype, 'class': 'ff-input-type ff-type-text', 'data-maxlengthmessage': fieldmaxlengthmessage,
                                    'maxlength': fieldmaxlength,
                                    'data-validatefieldtype': validatefieldtype
                                });

                                var inputdefaultvalue = firstElementByTagName(fieldElement, "defaultValue", true);
                                inputElem.val(inputdefaultvalue);
                                inputElem.attr('value', inputdefaultvalue);

                                if (fieldtype == 'CURRENCY') {
                                    inputElem.attr('data-formatmessage', 'Please enter a valid currency value');
                                    var currencylbl = firstElementByTagName(fieldElement, "currencyLabel", true);
                                    //inputElem.attr('data-currencylabel', currencylbl);
                                    fieldElemDiv.html("<span class='ff-currency-lbl'>" + currencylbl + "</span>");
                                    fieldElemDiv.append(inputElem);

                                } else if (vatttype.indexOf('PERCENT') >= 0) {

                                    inputElem.attr('data-formatmessage', 'Please enter a valid percentage');

                                    //inputElem.attr('data-percentlabel', '%');
                                    fieldElemDiv.html(inputElem);
                                    fieldElemDiv.append("<span class='ff-percent-lbl'>%</span>");
                                } else if (fieldtype == 'NUMERIC') {

                                    pareseNumericInfoIntoinput(inputElem,fieldElement);
                                    fieldElemDiv.html(inputElem);
                                }
                                else {
                                    fieldElemDiv.html(inputElem);
                                }

                                addSField = true;
                                break;
                            /// create TEXTAREA elements
                            case 'textarea':
                                var placeholdertext = firstElementByTagName(fieldElement, "placeholder", true);
                                var fieldmaxlength = firstElementByTagName(fieldElement, "maxLength", true);
                                var fieldmaxlengthmessage = firstElementByTagName(fieldElement, "maxLengthMessage", true);
                                var isHtmlFormatted = firstBooleanElementByTagName(fieldElement, "isHtmlFormatted", false);
                                var inputElem = $('<textarea />', { 'id': elemId + '', 'placeholder': placeholdertext, 'name': elemId + '', 'vatt': vatttype, 'class': 'ff-textarea', 'data-maxlengthmessage': fieldmaxlengthmessage, 'maxlength': fieldmaxlength, 'data-ishtmlformatted': isHtmlFormatted });
                                var inputdefaultvalue = unescapeHTMLString(GetInputValue(firstElementByTagName(fieldElement, "defaultValue", true)));
                                inputElem.val(inputdefaultvalue);
                                inputElem.text(inputdefaultvalue);
                                inputElem.attr('value', inputdefaultvalue);
                                fieldElemDiv.html(inputElem);
                                addSField = true;
                                break;

                            /// create BOOLEAN elements
                            case 'checkbox':
                                var inputElem = $('<input />', { 'type': 'checkbox', 'id': elemId + '', 'name': elemId + '', 'vatt': vatttype, 'class': 'ff-checkbox' });
                                //var labelForElem = $('<label />', { 'for': elemId + '', 'vatt': vatttype, 'class': 'css-label' });
                                var inputdefaultvalue = firstBooleanElementByTagName(fieldElement, "defaultValue", false);
                                if (inputdefaultvalue) {
                                    inputElem.prop('checked', true);
                                    inputElem.attr("checked", true);
                                }
                                else {
                                    inputElem.prop('checked', false);
                                    inputElem.removeAttr("checked");
                                }

                                fieldElemDiv.html(inputElem);
                                // fieldElemDiv.append(labelForElem);
                                addSField = true;
                                break;

                            /// create SINGLEPICKLIST elements
                            case 'select-one':
                                var selectcontroltype = firstElementByTagName(fieldElement, "flexControlType", true);
                                var selectElem = $('<select />', { 'name': elemId, 'id': elemId + '', 'vatt': vatttype, 'class': 'ff-select-type ff-singlepicklist', 'data-flexcontrol': selectcontroltype });

                                var picklistValuesElem = firstElementByTagName(fieldElement, "picklistValues", false);

                                $.each(picklistValuesElem.getElementsByTagName("picklistValue"), function (index, picklistValueElem) {
                                    var optionValue = picklistValueElem.getAttribute('value');
                                    optionValue = unescapeHTMLString(GetInputValue(optionValue));
                                    var optiontext = unescapeHTMLString(GetInputValue($(picklistValueElem).text()));
                                    var isDisabled = getSafeBoolean(picklistValueElem.getAttribute('ignore'), false);
                                    var isSelected = getSafeBoolean(picklistValueElem.getAttribute('selected'), false);
                                    if (!isDisabled) {
                                        if (isSelected) {
                                            $("<option />", { value: optionValue, text: optiontext, 'selected': 'true' }).appendTo(selectElem);
                                        }
                                        else {
                                            $("<option />", { value: optionValue, text: optiontext }).appendTo(selectElem);
                                        }
                                    }

                                });
                                fieldElemDiv.html(selectElem);
                                addSField = true;
                                break;

                            /// create SINGLEPICKLIST elements
                            case 'select-multi':
                                var selectcontroltype = firstElementByTagName(fieldElement, "flexControlType", true);
                                var selectElem = $('<select  />', { 'name': elemId, 'id': elemId + '', 'vatt': vatttype, 'class': 'ff-select-type ff-multipicklist', 'data-flexcontrol': selectcontroltype, 'multiple': 'multiple' });

                                var picklistValuesElem = firstElementByTagName(fieldElement, "picklistValues", false);

                                $.each(picklistValuesElem.getElementsByTagName("picklistValue"), function (index, picklistValueElem) {
                                    var optionValue = picklistValueElem.getAttribute('value');
                                    optionValue = unescapeHTMLString(GetInputValue(optionValue));
                                    var optiontext = unescapeHTMLString(GetInputValue($(picklistValueElem).text()));
                                    var isDisabled = getSafeBoolean(picklistValueElem.getAttribute('ignore'), false);
                                    var isSelected = getSafeBoolean(picklistValueElem.getAttribute('selected'), false);
                                    if (!isDisabled) {
                                        if (isSelected) {
                                            $("<option />", { value: optionValue, text: optiontext, 'selected': 'true' }).appendTo(selectElem);
                                        }
                                        else {
                                            $("<option />", { value: optionValue, text: optiontext }).appendTo(selectElem);
                                        }
                                    }

                                });
                                fieldElemDiv.html(selectElem);
                                addSField = true;
                                break;
                            default:
                        }
                        if (addSField) {
                            //fieldrequiredmessage, isfieldupsert, isfieldreadonly, isfieldhidden, isdefaultreq, isuserreq 

                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-requiredmessage', SetInputValue(fieldrequiredmessage));
                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').removeAttr('data-isdefaultreq');
                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').removeAttr('data-isuserreq');

                            if (isrequiredEmpty) {
                                if (isdefaultreq || isuserreq) {
                                    fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-isrequired', true);
                                    labelElemDiv.append($('<span/>', { 'class': 'requiredSpan ff-required-mark', 'html': '*' }));
                                }
                            } else if (isdatarequired) {
                                fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-isrequired', true);
                                labelElemDiv.append($('<span/>', { 'class': 'requiredSpan ff-required-mark', 'html': '*' }));
                            }


                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-isupsert', isfieldupsert);
                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-ishidden', isfieldhidden);
                            if (controltype.toLowerCase() != 'lookupinput') {
                                if (isfieldreadonly) {
                                    if (fieldElemDiv.find('select').length > 0) {
                                        fieldElemDiv.find('select').attr('disabled', true);
                                    }
                                    else if (vattUpperCase == 'DATE' || vattUpperCase == 'DATETIME') {
                                        fieldElemDiv.find('input').attr('disabled', true);
                                    }
                                    else {
                                        fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('readonly', true);
                                    }
                                }
                                else {
                                    fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').removeAttr('readonly');
                                }
                            }

                            ffItemRowDiv.html(labelElemDiv);
                            ffItemRowDiv.append(fieldElemDiv);

                            sectionElemDiv.append(ffItemRowDiv);
                        }
                    }
                    else if (controltype.toLowerCase() != '') {
                        var addGenField = false;
                        var isPaymentField = false;
                        var onlyLabelDiv = false;

                        var testModeBlock = $('<input />', { 'class': 'payment-test-mode', html: 'Test Mode' });
                        var istestmode = false;


                        /*general fields*/
                        switch (controltype.toLowerCase()) {
                            /// create GENERALTEXT elements
                            case 'generaltext':
                                ffItemRowDiv.addClass('fw-row');
                                var labelElem = $('<label />', { 'id': elemId, 'lblname': 'text', 'class': 'ff-label ff-general-text-label', 'html': labelHTML, 'data-ishidden': isfieldhidden });


                                labelElemDiv.html(labelElem);

                                onlyLabelDiv = true;
                                addGenField = true;

                                break;

                            /// create ESIGNATURE elements
                            case 'esignature':

                                var signtype = firstElementByTagName_ContentHTML(fieldElement, "signType", true);
                                var signoptions = firstElementByTagName_ContentHTML(fieldElement, "signOptions", true);
                                var signlabel = firstElementByTagName_ContentHTML(fieldElement, "signLabel", true);
                                var signdate = firstElementByTagName_ContentHTML(fieldElement, "signDate", true);
                                var signdatehide = firstElementByTagName_ContentHTML(fieldElement, "isDateHidden", true);
                                var signagree = firstElementByTagName_ContentHTML(fieldElement, "signAgreeText", true);
                                var signagreehide = firstElementByTagName_ContentHTML(fieldElement, "isAgreeHidden", true);
                                var emailverifenabled = firstBooleanElementByTagName_ContentHTML(fieldElement, "emailEnabled", false);
                                var emaillabel = firstElementByTagName_ContentHTML(fieldElement, "emailLabel", true);
                            

                                var inputElem = $('<input />', {
                                    'id': 'input' + elemId, 'type': 'hidden', 'lblname': 'Signature', 'class': 'ffd-esignature-input',
                                    'data-signtype': signtype, 'data-signoptions': signoptions, 'data-signlabel': signlabel,
                                    'data-signdate': signdate, 'data-signdatehide': signdatehide,
                                    'data-signagree': signagree, 'data-signagreehide': signagreehide, 'data-emailenabled': emailverifenabled,
                                    'data-emaillabel': emaillabel
                                });
                                
                                fieldElemDiv.html(inputElem);
                                var signatureComponentItem = $('#DocSignHTMLTemp').clone().html();
                                var signatureIndex = elemId.replace('ESIGNATURE', '');

                                fieldElemDiv.append(signatureComponentItem);

                                fieldElemDiv.find('.ffd-esignature-input').attr('id', 'input' + elemId);
                                fieldElemDiv.find('.ffd-esignature').show();
                                fieldElemDiv.find('.main-docsign-wrapper').attr('id', 'elem' + elemId);
                                fieldElemDiv.find('.ff-label').removeAttr('ondblclick');

                                fieldElemDiv.find('.main-docsign-wrapper .ff-typed .docsignWrapper .ffdate').attr('vatt', 'DATE');


                                assignSignatureElementIds(fieldElemDiv, signatureIndex);
                                /*WCAG changes*/
                                fieldElemDiv.find('.ff-chkagree label.ff-label').attr('for', fieldElemDiv.find('.ff-chkagree input').attr('id'));

                                fieldElemDiv.find('.ff-sign-block').each(function (indx, signBlockElem) {
                                    var inputId = $(signBlockElem).find('.ff-col-2 input.ff-type-text').attr('id');
                                    $(signBlockElem).find('.ff-col-1 label.ff-label').attr('for', inputId);
                                });

                                ffItemRowDiv.attr('class', 'ff-esignature-wrapper ff-item-row');
                                ffItemRowDiv.html(fieldElemDiv.html());
                                sectionElemDiv.append(ffItemRowDiv);
                                break;

                            /// create PAYMENT elements
                            case 'payment':

                                ffItemRowDiv.attr('class', 'ff-payment-wrapper');
                                var tempPaymentIndex = elemId.substring(elemId.indexOf('PAYMENT') + 7);
                                var paymentTypePrefixToReplace = getOPaymentTypeVal(fieldAttrType, 'PayPal', 'PayPal', 'IATS', 'Stripe', 'AuthorizeNet');
                                var paymentTypePrefix = getOPaymentTypeVal(fieldAttrType, 'FF', 'FF', 'FF', 'FF', 'FF');
                                ffItemRowDiv.attr('id', 'FFPAYMENT' + tempPaymentIndex);
                                istestmode = firstBooleanElementByTagName(fieldElement, "testMode", false);

                                if (istestmode) {
                                    ffItemRowDiv.addClass('ff-test-mode')

                                }
                                var paymentItem = $('<div/>').html($('#mainMultiPageWrapper').find('#lblliFASTFORMSPAYMENT' + tempPaymentIndex).html());

                                var paymentItemDiv = paymentItem.find('.field-div-payment');
                                $($(paymentItemDiv).find('.payment-item-row')).each(function (i, ppitemrow) {

                                    if ($(ppitemrow).find('.ff-line-seperator').length > 0) {
                                        if ($(ppitemrow).css('display') != 'none') {
                                            var paymentItemRowDiv = $('<div/>', { 'class': 'ff-item-row payment-seperator-item' });

                                            paymentItemRowDiv.append($(ppitemrow).html());
                                            ffItemRowDiv.append(paymentItemRowDiv);
                                        }
                                    }
                                    else {
                                        var paymentItemRowDiv = $('<div/>', { 'class': 'ff-item-row payment-field-item' });
                                        var labelHtmlDiv = $('<div/>', { 'class': 'ff-col-1 ff-label-col' });
                                        var fieldHtmlDiv = $('<div/>', { 'class': 'ff-col-2 ff-field-col' });
                                        $(ppitemrow).find('.PPGeneralLabelDiv').find('label.ff-label').removeAttr('data-label-prop');
                                        $(ppitemrow).find('.PPGeneralLabelDiv').find('label.ff-label').removeAttr('ondblclick');
                                        var lblid = $(ppitemrow).find('.PPGeneralLabelDiv').find('label.ff-label').attr('id');
                                        lblid = lblid.replace('FFPayment', paymentTypePrefix);
                                        lblid = lblid.replace(paymentTypePrefixToReplace, paymentTypePrefix);
                                        $(ppitemrow).find('.PPGeneralLabelDiv').find('label.ff-label').attr('id', lblid);
                                        $(ppitemrow).find('.PPGeneralLabelDiv').find('label.ff-label').attr('for', lblid.replace('lbl', ''));

                                        labelHtmlDiv.html($(ppitemrow).find('.PPGeneralLabelDiv').html());
                                        var fieldHtml = '';
                                        if ($(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label').length > 0) {
                                            var inputElem = $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label');
                                            var lid = $(inputElem).attr('id');
                                            lid = lid.replace('FFPayment', paymentTypePrefix);
                                            lid = lid.replace(paymentTypePrefixToReplace, paymentTypePrefix);
                                            $(inputElem).attr('id', lid);
                                            $(inputElem).attr('name', lid);
                                            if ($(inputElem).attr('data-pp-name')) {
                                                $(inputElem).attr('data-pp-name', lid);
                                            }
                                        }


                                        if ($(ppitemrow).hasClass('pp-expiry')) {
                                            $(ppitemrow).find('.PPGeneralFieldDiv select').each(function (index, selectElem) {
                                                var lid = $(selectElem).attr('id');
                                                lid = lid.replace('FFPayment', paymentTypePrefix);
                                                lid = lid.replace(paymentTypePrefixToReplace, paymentTypePrefix);
                                                $(selectElem).attr('id', lid);
                                                $(selectElem).attr('name', lid);
                                                if ($(selectElem).attr('data-pp-name')) {
                                                    $(selectElem).attr('data-pp-name', lid);
                                                }
                                                $(selectElem).find('option').each(function (indx, optionelem) {
                                                    if (indx == 0) {
                                                        $(optionelem).attr('value', '');
                                                    }
                                                });
                                            });
                                        }

                                        fieldHtmlDiv.html($(ppitemrow).find('.PPGeneralFieldDiv').html());

                                        if ($(ppitemrow).css('display') == 'none') {

                                            paymentItemRowDiv.hide();
                                        }
                                        paymentItemRowDiv.append(labelHtmlDiv);
                                        paymentItemRowDiv.append(fieldHtmlDiv);
                                        ffItemRowDiv.append(paymentItemRowDiv);
                                    }

                                });

                                addGenField = true;
                                isPaymentField = true;
                                break;

                            /// create FILEUPLOAD elements
                            case 'fileupload':
                                setFileUploadHtmlAttributes(elemId, fieldElement, ffItemRowDiv, 
                                    fieldElemDiv, labelHTML, labelElemDiv, isfieldhidden);

                                addGenField = true;
                                break;

                            /// create IMAGE elements
                            case 'image':

                                labelElemDiv.attr('class', 'ff-col-1 ff-image');
                                var labelElem = $('<label />', { 'id': 'lbl' + elemId, 'for': elemId, 'lblname': 'Image', 'class': 'ff-label ff-image-label', 'data-ishidden': isfieldhidden });
                                labelElemDiv.html();

                                var imageComponentItem = $('#generalFieldBox .imageGeneralFieldDiv').clone().html();
                                $ImageComponentWrapper = $('<div />', { 'class': 'imageGeneralFieldDiv', 'id': 'imageField' + elemId });
                                $ImageComponentWrapper.append(imageComponentItem);
                                var imgSrc = firstElementByTagName(fieldElement, "imgSrc", true);
                                labelElemDiv.append($ImageComponentWrapper);
                                if (!isNullOrEmpty(imgSrc)) {
                                    imgSrc = unescapeHTMLString(GetInputValueAsHTML(imgSrc));
                                    var imgwidth = firstElementByTagName(fieldElement, "imgWidth", true);
                                    var imgHeight = firstElementByTagName(fieldElement, "imgHeight", true);
                                    var imgAlignment = firstElementByTagName(fieldElement, "alignment", true);
                                    var imgAltTag = firstElementByTagName(fieldElement, "alt", true);

                                    labelElemDiv.find('.ffse-img-upload-placeholder-editor').show();

                                    var imagElem = $('<img />', { 'id': elemId, 'src': imgSrc });
                                    if (!isNullOrEmpty(imgwidth)) {
                                        imagElem.attr('width', imgwidth);
                                    }
                                    if (!isNullOrEmpty(imgHeight)) {
                                        imagElem.attr('height', imgHeight);
                                    }
                                    if (!isNullOrEmpty(imgAlignment)) {
                                        labelElemDiv.css('text-align', imgAlignment);
                                    }
                                    if (!isNullOrEmpty(imgAltTag)) {
                                        imagElem.attr('alt', imgAltTag);
                                    }

                                    labelElemDiv.html(imagElem);

                                    addGenField = true;
                                    onlyLabelDiv = true;
                                }
                                break;

                            /// create CAPTCHA elements
                            case 'captcha':
                                ffItemRowDiv.attr('title', 'Captcha');

                                var labelElem = $('<label />', { 'id': 'lbl' + elemId, 'for': elemId, 'lblname': 'Captcha', 'class': 'ff-label ff-captcha-label', 'html': labelHTML });
                                labelElemDiv.html(labelElem);
                                labelElemDiv.append($('<span/>', { 'class': 'requiredSpan ff-required-mark', 'html': '*' }));

                                var isreq = firstBooleanElementByTagName(fieldElement, "required", true);
                                var ishidden = firstBooleanElementByTagName(fieldElement, "hiddenField", false);


                                var inputElem = $('<div />', { 'id': elemId + '', 'name': 'Captcha', 'vatt': fieldtype, 'data-requiredmessage': 'Please enter the text shown in the image above', 'data-isrequired': isreq, 'data-ishidden': isfieldhidden });
                                // fieldElemDiv.html(imgElem);
                                //fieldElemDiv.append('<br/>');
                                fieldElemDiv.addClass('ff-captcha');
                                fieldElemDiv.append(inputElem);

                                addGenField = true;
                                break;

                            default:
                        }
                        if (addGenField) {
                            if (!isPaymentField) {
                                ffItemRowDiv.html(labelElemDiv);
                                if (!onlyLabelDiv) {
                                    ffItemRowDiv.append(fieldElemDiv);
                                }

                            }
                            if (ffItemRowDiv.hasClass('ff-test-mode')) {
                                sectionElemDiv.append(testModeBlock);
                            }
                            sectionElemDiv.append(ffItemRowDiv);
                        }
                    }
                    /*field parsing ends*/

                });
                if (isSectionRepeat) {
                    var sectionRepeatWrapper = $('<div/>', { 'class': 'ff-sec-repeat-wrapper' });
                    sectionRepeatWrapper.html(sectionElemDiv.html());
                    sectionElemDiv.html(sectionRepeatWrapper);
                }
                sectionElemDiv.prepend(ffSectionItemRowDiv);
                pageElemDiv.append(sectionElemDiv);

            });
            var pageHTML = $('<div/>').append(pageElemDiv);
            formHtml.append(pageHTML.html());
        }
    });

    var vHTML = formHtml.html();
    return vHTML;
}

function setFileUploadHtmlAttributes(pElementId, pFieldElement, pFFItemRowDiv, pFieldElementDiv, pLabelHTML, pLabelElemDiv, pIsFieldHidden){
    pFFItemRowDiv.attr('title', 'File Upload');

    var fileIndxId = pElementId.replace('FileUploadArea', '');
    var isrequired = firstBooleanElementByTagName(pFieldElement, "required", false);
    var uploadtochatter = firstBooleanElementByTagName(pFieldElement, "uploadToChatter", false);
    var uploadToSFFile = firstBooleanElementByTagName(pFieldElement, "uploadToSFFile", false);
    var uploadToIntegration = firstBooleanElementByTagName(pFieldElement, "uploadToIntegration", false);
    var isNativeOptionSelected = firstBooleanElementByTagName(pFieldElement, "isNativeOptionSelected", false);
    var fileServiceOn = firstBooleanElementByTagName(pFieldElement, "fileServiceOn", false);
    var fieldrequiredmessage = firstElementByTagName(pFieldElement, "requiredMessage", true);
    var allowedfiletypes = firstElementByTagName(pFieldElement, "allowedFileTypes", true);
    var maxfiles = firstElementByTagName(pFieldElement, "maxFiles", true);
    var maxFileSize = firstElementByTagName(pFieldElement, "maxFileSize", true);
    var attachto = firstElementByTagName(pFieldElement, "attachTo", true);
    var filename = firstElementByTagName(pFieldElement, "fileName", true);


    var labelElem = $('<label />', {
        'id': 'lblFileUpload' + fileIndxId + '',
        'for': 'FileUpload' + fileIndxId,
        'lblname': 'File Upload',
        'class': 'ff-label ff-fileupload-label',
        html: pLabelHTML
    });

    if (pIsFieldHidden) {
        labelElem.addClass('grayLabel');
    }

    pLabelElemDiv.html(labelElem);
    if (isrequired) {
        $(pLabelElemDiv).find('.ff-label').after($('<span/>', { 'class': 'ff-required-mark', 'html': '*' }));
    }

    var fielUploadItem = $('#generalFieldBox #lblliFILEUPLOADAREA .fieldDiv').clone().html();
    pFieldElementDiv.append(fielUploadItem);
    
    var fileUploadArea = pFieldElementDiv.find('.ff-fileupload-drop-area');
    fileUploadArea.attr('data-requiredmessage', fieldrequiredmessage);
    fileUploadArea.attr('data-isrequired', isrequired);
    fileUploadArea.attr('data-ishidden', pIsFieldHidden);
    fileUploadArea.attr('data-filename', filename);
    fileUploadArea.attr('data-attachto', attachto);
    fileUploadArea.attr('data-maxfiles', maxfiles);
    fileUploadArea.attr('data-maxfilesize', maxFileSize);
    fileUploadArea.attr('data-allowedfiletypes', allowedfiletypes);
    fileUploadArea.attr('data-uploadtochatter', uploadtochatter);
    fileUploadArea.attr('data-uploadtosffile', uploadToSFFile);
    fileUploadArea.attr('data-uploadtointegration', uploadToIntegration);
    fileUploadArea.attr('data-isnativeoptionselected', isNativeOptionSelected);
    fileUploadArea.attr('data-fileserviceon', fileServiceOn);
    
    fileUploadArea.attr('id', 'FileUploadArea' + fileIndxId);
    fileUploadArea.attr('name', 'FileUploadArea' + fileIndxId);
    
    var fileUploadAreaLabel = fileUploadArea.find('label');
    fileUploadAreaLabel.attr('id', 'lblFileUpload' + fileIndxId + '_Select');
    fileUploadAreaLabel.attr('name', 'FileUpload' + fileIndxId + '_Select');
    fileUploadAreaLabel.attr('for', 'FileUpload' + fileIndxId);

    var fileUploadAreaInput = fileUploadArea.find('input');
    fileUploadAreaInput.attr('id', 'FileUpload' + fileIndxId);
    fileUploadAreaInput.attr('name', 'FileUpload' + fileIndxId);
}

function getSFieldName(elementId) {
    var fieldName = '';
    if (!isNullOrEmpty(elementId) && elementId.indexOf('.') > 0) {
        fieldName = elementId.substring(elementId.lastIndexOf('.') + 1);
    }
    return fieldName;
}

function getFieldXMLFromFieldElement(pFieldElement, fieldAttrType){
    
    var fieldsObjectXml = '<field>';
    fieldsObjectXml += '<name>' + getSFieldName(getSafeFirstElementText(pFieldElement, "elemId")) + '</name>';
    fieldsObjectXml += '<type>' + getSafeFirstElementText(pFieldElement, "vatt") + '</type>';
    fieldsObjectXml += '<hiddenField>' + getSafeFirstElementText(pFieldElement, "hiddenField") + '</hiddenField>';
    fieldsObjectXml += '<readOnly>' + getSafeFirstElementText(pFieldElement, "readOnly") + '</readOnly>';
    fieldsObjectXml += '<upsert>' + getSafeFirstElementText(pFieldElement, "upsert") + '</upsert>';
    if (pFieldElement.getElementsByTagName("listViewId").length > 0) {
        fieldsObjectXml += '<listViewId>' + getSafeFirstElementText(pFieldElement, "listViewId") + '</listViewId>';
    }
    if (pFieldElement.getElementsByTagName("listViewObject").length > 0) {
        fieldsObjectXml += '<listViewObject>' + getSafeFirstElementText(pFieldElement, "listViewObject") + '</listViewObject>';
    }
    if (fieldAttrType == 'olookup') {
        fieldsObjectXml += '<defaultValue>' + getSafeFirstElementText(pFieldElement, "defaultValueId") + '</defaultValue>';
    } else {
        fieldsObjectXml += '<defaultValue>' + getSafeFirstElementText(pFieldElement, "defaultValue") + '</defaultValue>';
    }
    fieldsObjectXml += '<maxLength>' + getSafeFirstElementText(pFieldElement, "maxLength") + '</maxLength>';
    fieldsObjectXml += '<required>' + getSafeFirstElementText(pFieldElement, "required") + '</required>';
    fieldsObjectXml += '<requiredMessage>' + getSafeFirstElementText(pFieldElement, "requiredMessage") + '</requiredMessage>';
    fieldsObjectXml += '<picklistValues>';
    var picklistElements = pFieldElement.getElementsByTagName('picklistValue');
    for (i = 0; i < picklistElements.length; i++) {
        fieldsObjectXml += '<picklistValue><value>' + $(picklistElements[i]).attr('value') + '</value></picklistValue>';
    }
    fieldsObjectXml += '</picklistValues>';
    fieldsObjectXml += '<flexControlType>' + getSafeFirstElementText(pFieldElement, "flexControlType") + '</flexControlType>';
    fieldsObjectXml += '</field>';

    return fieldsObjectXml;
}

function getFieldsObjectXML(fieldsXml) {

    var data = safeStringForXML(fieldsXml);
    var $xmlDoc = ($.parseXML('<root>' + data + '</root>'));

    var fieldsObjectXml = '';
    //Reference fields XML
    fieldsObjectXml += '<object>';
    fieldsObjectXml += '<objectOrder>1</objectOrder>';
    fieldsObjectXml += '<name>' + $('#priName').attr('class') + '</name>';
    fieldsObjectXml += '<objectType>Primary</objectType>';
    fieldsObjectXml += '<relationshipType></relationshipType>';
    fieldsObjectXml += '<relatedField></relatedField>';
    //Add fieldsXml String
    fieldsObjectXml += '<fields>';

    $($xmlDoc.getElementsByTagName("OField")).each(function (indx, fieldElement) {
        //check if the object name matches so we know where to put the field
        //we also check if there is no object name - this denotes a general field e.g. file upload
        //which should be included with the primary object anyway            
        var fieldAttrType = '';
        if (!isNullOrEmpty(fieldElement.getAttribute('type'))) {
            fieldAttrType = fieldElement.getAttribute('type').toLowerCase();
        }
        if (getSafeFirstElementText(fieldElement, 'sortableObject').trim() == "sortableForRelFields1") {
            fieldsObjectXml += getFieldXMLFromFieldElement(fieldElement, fieldAttrType);
        }
        if (getSafeFirstElementText(fieldElement, 'sortableObject') == '') {
            if (getSafeFirstElementText(fieldElement, 'type') == "CAPTCHA") {
                fieldsObjectXml += '<field>';
                fieldsObjectXml += '<name>' + getSafeFirstElementText(fieldElement, "elemId") + '</name>';
                fieldsObjectXml += '<type>CAPTCHA</type>';
                fieldsObjectXml += '<required>' + getSafeFirstElementText(fieldElement, "required") + '</required>';
                fieldsObjectXml += '<requiredMessage>' + getSafeFirstElementText(fieldElement, "requiredMessage") + '</requiredMessage>';
                fieldsObjectXml += '</field>';
            }
            else if (getSafeFirstElementText(fieldElement, 'controlType') == "PAYMENT") {
                var paymentFieldName = getSafeFirstElementText(fieldElement, "elemId");
                var tempPaymentIndex = '';
                try {
                    tempPaymentIndex = paymentFieldName.substring(paymentFieldName.indexOf('PAYMENT') + 7);
                } catch (err) {
                    tempPaymentIndex = tempPaymentIndex.replace('PAYPALPAYMENT', '');
                    tempPaymentIndex = tempPaymentIndex.replace('IATSPAYMENT', '');
                    tempPaymentIndex = tempPaymentIndex.replace('AUTHORIZENETPAYMENT', '');
                    tempPaymentIndex = tempPaymentIndex.replace('STRIPEPAYMENT', '');
                    tempPaymentIndex = tempPaymentIndex.replace('FASTFORMSPAYMENT', '');
                }
                fieldsObjectXml += '<field>';
                fieldsObjectXml += '<name>FFPAYMENT' + tempPaymentIndex + '</name>';
                fieldsObjectXml += '<type>PAYMENT</type>';
                fieldsObjectXml += '<required>' + getSafeFirstElementText(fieldElement, "required") + '</required>';
                fieldsObjectXml += '<requiredMessage>' + getSafeFirstElementText(fieldElement, "requiredMessage") + '</requiredMessage>';
                fieldsObjectXml += '</field>';
            }
            else if (getSafeFirstElementText(fieldElement, 'type') == "ESIGNATURE") {
                fieldsObjectXml += '<field>';
                fieldsObjectXml += '<name>' + getSafeFirstElementText(fieldElement, "elemId") + '</name>';
                fieldsObjectXml += '<type>ESIGNATURE</type>';
                fieldsObjectXml += '<emailVerificationEnabled>' + getSafeBoolean(getSafeFirstElementText(fieldElement, "emailEnabled"), false) + '</emailVerificationEnabled>';
                fieldsObjectXml += '<signatureEmailFrom>' + FFUserEmail + '</signatureEmailFrom>';
                fieldsObjectXml += '<required>' + getSafeFirstElementText(fieldElement, "required") + '</required>';
                fieldsObjectXml += '<requiredMessage>' + getSafeFirstElementText(fieldElement, "requiredMessage") + '</requiredMessage>';
                fieldsObjectXml += '</field>';
            }
            else if (getSafeFirstElementText(fieldElement, 'type') == 'FILE') {
                var elemId = firstElementByTagName(fieldElement, "elemId", true);
                var isrequired = firstBooleanElementByTagName(fieldElement, "required", false);
                var uploadtochatter = firstBooleanElementByTagName(fieldElement, "uploadToChatter", false);
                var uploadToSFFile = firstBooleanElementByTagName(fieldElement, "uploadToSFFile", false);
                var uploadToIntegration = firstBooleanElementByTagName(fieldElement, "uploadToIntegration", false);
                var isNativeOptionSelected = firstBooleanElementByTagName(fieldElement, "isNativeOptionSelected", false);
                var fileServiceOn = firstBooleanElementByTagName(fieldElement, "fileServiceOn", false);
                var fieldrequiredmessage = firstElementByTagName(fieldElement, "requiredMessage", true);
                var allowedfiletypes = firstElementByTagName(fieldElement, "allowedFileTypes", true);
                var attachto = firstElementByTagName(fieldElement, "attachTo", true);
                var maxfiles = firstElementByTagName(fieldElement, "maxFiles", true);
                var fileName = firstElementByTagName(fieldElement, "fileName", true);
                var fieluploadname = elemId.replace('Area', '');
                fieldsObjectXml += '<field>';
                fieldsObjectXml += '<name>' + fieluploadname + '</name>';
                fieldsObjectXml += '<type>FILEUPLOAD</type>';
                fieldsObjectXml += '<allowedFileTypes>' + allowedfiletypes + '</allowedFileTypes>';
                fieldsObjectXml += '<attachTo>' + attachto + '</attachTo>';
                fieldsObjectXml += '<uploadToChatter>' + uploadtochatter + '</uploadToChatter>';
                fieldsObjectXml += '<uploadToSFFile>' + uploadToSFFile + '</uploadToSFFile>';
                fieldsObjectXml += '<uploadToIntegration>' + uploadToIntegration + '</uploadToIntegration>';
                fieldsObjectXml += '<isNativeOptionSelected>' + isNativeOptionSelected + '</isNativeOptionSelected>';
                fieldsObjectXml += '<fileServiceOn>' + fileServiceOn + '</fileServiceOn>';
                fieldsObjectXml += '<maxFiles>' + maxfiles + '</maxFiles>';
                fieldsObjectXml += '<required>' + isrequired + '</required>';
                fieldsObjectXml += '<requiredMessage>' + fieldrequiredmessage + '</requiredMessage>';
                fieldsObjectXml += '<fileName>' + fileName + '</fileName>';
                fieldsObjectXml += '</field>';
            }

        }
    });
    fieldsObjectXml += '</fields>';
    fieldsObjectXml += '</object>';

    $('.available-fields-block-wrapper .list-toggle-div-wrap').each(function (indx, wrapperDiv) {
        var relindx = indx;
        relindx++;
        var secondaryObjectId = selectRelObjIdByIndex(relindx);
        var ListRelVarElem = $('#' + $(wrapperDiv).attr('id'));
        var sortableFieldClassName = safeStringValue($(ListRelVarElem).find('ul.dropfields').attr('id'), '');
        fieldsObjectXml += '<object>';
        fieldsObjectXml += '<objectOrder>' + $(wrapperDiv).find(".obj-tab-number").text() + '</objectOrder>';
        fieldsObjectXml += '<objectType>Secondary</objectType>';

        var childObjectClass = '';
        if ($(wrapperDiv).attr('data-childclass') != undefined && $(wrapperDiv).attr('data-childclass') != "") {
            childObjectClass = safeStringValue($(wrapperDiv).attr('data-childclass'), '');
            childObjectClass = childObjectClass.trim();
        }

        if (childObjectClass != '') {
            var childObjName = getSafeRelObjAttribute(indx, 'data-objname', '');
            fieldsObjectXml += '<name>' + childObjName + '</name>';
            fieldsObjectXml += '<relationshipType>Detail</relationshipType>';
            var childObjFieldName = getSafeRelObjAttribute(indx, 'data-refidname', '');
            fieldsObjectXml += '<relatedField>' + childObjFieldName + '</relatedField>';
            if ($(wrapperDiv).hasClass('repeat')) {
                fieldsObjectXml += '<repeat>true</repeat>';
            } else {
                fieldsObjectXml += '<repeat>false</repeat>';
            }
        } else {
            var lookupObjName = getSafeRelObjAttribute(indx, 'data-reftorectrim', '');
            fieldsObjectXml += '<name>' + lookupObjName + '</name>';
            fieldsObjectXml += '<relationshipType>Lookup</relationshipType>';
            var lookupObjFieldName = getSafeRelObjAttribute(indx, 'data-objname', '');
            fieldsObjectXml += '<relatedField>' + lookupObjFieldName + '</relatedField>';
        }

        var relatedFieldType = getSafeRelObjAttribute(indx, 'data-relatedFieldType', '');
        fieldsObjectXml += '<relatedFieldType>' + relatedFieldType + '</relatedFieldType>';

        //Add fieldsXml String
        fieldsObjectXml += '<fields>';
        $($xmlDoc.getElementsByTagName("OField")).each(function (indx, fieldElement) {
            var fieldAttrType = '';
            if (!isNullOrEmpty(fieldElement.getAttribute('type'))) {
                fieldAttrType = fieldElement.getAttribute('type').toLowerCase();
            }
            if (!isNullOrEmpty(getSafeFirstElementText(fieldElement, 'sortableObject').trim()) && getSafeFirstElementText(fieldElement, 'sortableObject').trim() == sortableFieldClassName) {

                var colorcode = getSafeFirstElementText(fieldElement, "colorCode");
                if (childObjectClass != '') {
                    if (!isNullOrEmpty(colorcode)) {
                        colorcode = colorcode.trim();
                    }
                    if (childObjectClass == colorcode) {
                        fieldsObjectXml += getFieldXMLFromFieldElement(fieldElement, fieldAttrType);
                    }
                } else {
                    fieldsObjectXml += getFieldXMLFromFieldElement(fieldElement, fieldAttrType);
                }
            }
        });

        fieldsObjectXml += '</fields>';
        fieldsObjectXml += '</object>';

    });
    return fieldsObjectXml;
}
function getSafeFirstElementText(element, tagName) {
    var returnText = '';
    returnText = firstElementByTagName(element, tagName, true);
    if (returnText === undefined) {
        returnText = '';
    }
    return returnText;
}
/**@name populateMultiPageHtml
 * @description This function parse information from pageItem and append to main Div element in 'Edit Form' tab and kick off some other initialization process
 * @param [pageElemDiv] temporary div element with some HTML as template
 * @param [pageItem] Form_Page__c object's JS wrapper 
 * @returns {void} appends html to #mainMultiPageWrapper
 */
function populateMultiPageHtml(pageElemDiv, pageItem) {

    var xmlDocElement = getXmlElementFromStr(pageItem["pXML"]);
    var pageElements = xmlDocElement.getElementsByTagName("ffPage");
    var pagename = pageItem["pTitle"];
    var pagenameHTML = unescapeHTMLString(GetInputValueAsHTML(pagename));
    var pageorder = safeStringValue(pageItem["pOrder"], '');
    var pageid = safeStringValue(pageItem["pId"], '');
    var pageishidden = getSafeBoolean(pageItem["pHidden"], false);
    $(pageElemDiv).find('.ff-page-header-box .page-tag-number').html(pageorder);
    $(pageElemDiv).attr('data-pageid', pageid);
    $(pageElemDiv).attr('data-ishidden', pageishidden);
    if (isNullOrEmpty(pagename)) {
        pagename = 'New Page Title';
    }
    $(pageElemDiv).find('>ul.formPageUl>li .ff-page-header').html(pagenameHTML);
    var pagelabelid = safePageLabel(safeStringValue(pageItem["pFormPageId"], ''));
    if (!isNullOrEmpty(pagelabelid)) {
        $(pageElemDiv).find('.ff-page-header').attr('id', pagelabelid);
    }

    $.each(pageElements, function (pageIndx, pageElement) {

        if (pageElement.childNodes.length > 0) {

            //var pageishidden = firstElementByTagName(pageElement, "isHidden", true);
            var sectionlistElem = firstElementByTagName(pageElement, "sectionList", false);
            $.each(sectionlistElem.getElementsByTagName("OSection"), function (sectionIndex, sectionElement) {
                var sectionElemDiv = $('<div/>').addClass('ff-section-item');
                sectionElemDiv.append($('#pageNewSectionTEMP').html());

                var sectionname = firstElementByTagName(sectionElement, "name", true);
                var sectionnameHTML = unescapeHTMLString(GetInputValueAsHTML(sectionname));
                var sectionorder = firstElementByTagName(sectionElement, "sectionOrder", true);
                var sectionid = firstElementByTagName(sectionElement, "sectionId", true);
                var sectionishidden = firstBooleanElementByTagName(sectionElement, "isHidden", false);
                var sectionRepeat = firstBooleanElementByTagName(sectionElement, "repeat", false);
                var sectionCounter = safeSectionCounter(sectionid);//sectionid.replace(/sectionFFLabel/g, '');
                sectionElemDiv.find('label.ff-section-header').attr('id', 'sectionLabel' + sectionCounter);
                sectionElemDiv.find('>ul>li .deleteField').attr('id', 'deletedField' + sectionCounter);
                sectionElemDiv.find('>ul>li .deleteField').attr('onclick', 'deleteSection(this,true);');
                sectionElemDiv.find('>ul>li.sectionLi').attr('id', 'sortableForSectionLabelli' + sectionCounter);
                sectionElemDiv.find('>ul.formSectionUl').attr('id', 'labelSectionformUl' + sectionCounter);
                sectionElemDiv.attr('data-ishidden', sectionishidden);
                sectionElemDiv.find('label.ff-section-header').html(sectionnameHTML);

                sectionElemDiv.find('>ul.formSectionUl').removeClass('hideFullSection');
                var setRepeatSectionInfo = false;
                if (sectionishidden) {
                    sectionElemDiv.find('>ul.formSectionUl').addClass('hideFullSection');
                    sectionElemDiv.find('>ul.formSectionUl').attr('data-ishidden', true);
                }
                else {
                    sectionElemDiv.find('>ul.formSectionUl').attr('data-ishidden', false);
                }
                if (sectionRepeat) {
                    setRepeatSectionInfo = true;

                    var sectionUlElemDiv = sectionElemDiv.find('>ul.formSectionUl');
                    $(sectionUlElemDiv).addClass('section-repeat');
                    $(sectionUlElemDiv).attr('data-add-link', firstElementByTagName(sectionElement, "addLink", true));
                    $(sectionUlElemDiv).attr('data-remove-link', firstElementByTagName(sectionElement, "removeLink", true));
                    $(sectionUlElemDiv).attr('data-min-count', firstElementByTagName(sectionElement, "minCount", true));
                    $(sectionUlElemDiv).attr('data-max-count', firstElementByTagName(sectionElement, "maxCount", true));
                    resetRepeatableSectionFooter(sectionUlElemDiv);
                }

                var fieldlistElem = firstElementByTagName(sectionElement, "fieldList", false);
                $.each(fieldlistElem.getElementsByTagName("OField"), function (fieldIndex, fieldElement) {
                    var lockhtmlDiv = $('<div />');
                    var lockhtml = '';
                    var islockenabled = false;
                    var fieldAttrType = '';
                    if (!isNullOrEmpty(fieldElement.getAttribute('type'))) {
                        fieldAttrType = fieldElement.getAttribute('type');
                    }

                    var fieldLiElemDiv = $('<li/>').addClass('fieldLi');
                    var elemId = firstElementByTagName(fieldElement, "elemId", true);
                    var elemIdWOdot = elemId.replace(/\./g, '');

                    var labelElemDiv = $('<div/>', { 'class': 'labelDiv' });
                    var fieldElemDiv = $('<div/>', { 'class': 'fieldDiv' });
                    var editDelElemDiv = $('<div/>', { 'class': 'editDelDiv' });
                    var imgEditDiv = $('<div/>', { 'class': 'editImg' });
                    var imgDelDiv = $('<div/>', { 'class': 'deleteField' });
                    var controltype = firstElementByTagName(fieldElement, "controlType", true);
                    var objecttype = firstElementByTagName(fieldElement, "objectType", true);
                    var objectname = firstElementByTagName(fieldElement, "objectName", true);
                    var labeltext = firstElementByTagName(fieldElement, "label", true);
                    var labelHTML = unescapeHTMLString(GetInputValueAsHTML(labeltext));
                    var fieldtype = firstElementByTagName(fieldElement, "type", true);
                    var isfieldhidden = firstBooleanElementByTagName(fieldElement, "hiddenField", false);
                    var labelclass = 'ff-label';
                    if (isfieldhidden) {
                        labelclass = 'ff-label grayLabel';
                    }

                    fieldLiElemDiv.attr('id', 'lblli' + elemIdWOdot);
                    fieldLiElemDiv.attr('data-otype', fieldAttrType);



                    var addSField = false;
                    var generalFields = ['generaltext', 'esignature', 'payment', 'fileupload', 'image', 'captcha'];

                    /*field parsing starts*/
                    if (controltype.toLowerCase() != '' && $.inArray(controltype.toLowerCase(), generalFields) < 0) {
                        /*Salesforce object fields*/

                        var vatttype = firstElementByTagName(fieldElement, "vatt", true);
                        var colorcode = firstElementByTagName(fieldElement, "colorCode", true);
                        if (!isNullOrEmpty(colorcode)) {
                            colorcode = colorcode.trim();
                            if (setRepeatSectionInfo) {
                                var sortableClass = firstElementByTagName(fieldElement, "sortableObject", true);
                                sectionElemDiv.find('>ul.formSectionUl').attr('data-childclass', colorcode);
                                sectionElemDiv.find('>ul.formSectionUl').attr('data-sortableclass', sortableClass);
                                setRepeatSectionInfo = false;
                            }
                        }
                        fieldLiElemDiv.addClass(colorcode);
                        var sortableobject = firstElementByTagName(fieldElement, "sortableObject", true);
                        fieldLiElemDiv.addClass(sortableobject);
                        fieldLiElemDiv.attr('title', labelHTML + ' (' + firstCharCap(fieldtype) + ')');
                        labelElemDiv.attr('id', 'divLabel' + elemIdWOdot);

                        labelElemDiv.attr('lblname', firstElementByTagName(fieldElement, "label", true));

                        var fieldapiname = getSFieldName(elemId);
                        var labelElem = $('<label />', {
                            'vatt': vatttype, 'class': labelclass, id: 'lbl' + fieldapiname, 'html': labelHTML,
                            'data-apiname': fieldapiname
                        });

                        labelElemDiv.html(labelElem);

                        var fieldrequiredmessage = firstElementByTagName(fieldElement, "requiredMessage", true);

                        if (isNullOrEmpty(fieldrequiredmessage)) {
                            fieldrequiredmessage = 'required';
                        }
                        var isfieldupsert = firstBooleanElementByTagName(fieldElement, "upsert", false);
                        var isfieldreadonly = firstBooleanElementByTagName(fieldElement, "readOnly", false);

                        var isdefaultreq = firstBooleanElementByTagName(fieldElement, "isDefaultReq", false);
                        var isuserreq = firstBooleanElementByTagName(fieldElement, "isUserReq", false);

                        if (!isNullOrEmpty(objectname) && $.inArray(objectname, validObjects()) < 0) {
                            islockenabled = true;
                            lockHtml = getFreemiumHTML('Only Case, Account, Contact and Lead fields are', 'freemium-edit-block', '');
                        }

                        if (objecttype.toLowerCase() != 'primary') {
                            islockenabled = true;
                            lockHtml = getFreemiumHTML('Related object fields are', 'freemium-edit-block', '');
                        }

                        switch (controltype.toLowerCase()) {
                            /// create LOOKUP elements
                            case 'lookupinput':

                                if (fieldtype == "LOOKUP") {
                                    fieldLiElemDiv.attr('title', labeltext + ' (Lookup)');
                                }
                                else {
                                    fieldLiElemDiv.attr('title', labeltext);
                                }
                                islockenabled = true;
                                lockHtml = getFreemiumHTML('Reference fields are', 'freemium-edit-block', '');
                                var listviewid = firstElementByTagName(fieldElement, "listViewId", true);
                                var listviewobject = firstElementByTagName(fieldElement, "listViewObject", true);
                                var defaultvalueid = firstElementByTagName(fieldElement, "defaultValueId", true);
                                var placeholdertext = firstElementByTagName(fieldElement, "placeholder", true);
                                var defaultvalue = firstElementByTagName(fieldElement, "defaultValue", true);
                                //vaObj is replaced by ltypeObj node element in xml
                                var ltypeObj = (firstElementByTagName(fieldElement, "vaObj", true) !== undefined) ? safeStringValue(firstElementByTagName(fieldElement, "vaObj", true), "") : safeStringValue(firstElementByTagName(fieldElement, "ltypeObj", true), "");
                                var rtypeobj = firstElementByTagName(fieldElement, "rtypeObj", true);
                                var spanLookupElem = $('<span />', { 'class': 'lookupInput' });
                                var inputHiddenElem = $('<input />', { 'type': 'hidden', 'id': elemId + 'hidden', 'vatt': 'REFERENCE' });
                                var inputElem = $('<input />', { 'type': 'textbox', 'id': elemId + '', 'placeholder': placeholdertext, 'name': elemId + '', 'class': 'ff-input-type ff-type-text', 'vatt': 'REFERENCE', 'value': defaultvalue, 'data-lobj': ltypeObj, 'data-robj': rtypeobj });
                                updateElementProp(inputHiddenElem, 'data-lookup-object', listviewobject, false);
                                updateElementProp(inputHiddenElem, 'data-lookup-value', listviewid, false);
                                if (!isNullOrEmpty(listviewid)) {
                                    updateElementProp(inputHiddenElem, 'data-lookup-value-type', 'list', true);
                                }
                                updateElementProp(inputHiddenElem, 'value', defaultvalueid, false);
                                var aLookupElem = $('<a />', { 'onclick': 'openLookupRefPopup(this,\'' + ltypeObj + '\',\'' + rtypeobj + '\');', 'id': elemId + '_lkwgt' });
                                var imgElem = $('<img />', { src: '/s.gif', 'class': 'lookupIcon' });
                                aLookupElem.append(imgElem);
                                spanLookupElem.append(inputHiddenElem);
                                spanLookupElem.append(inputElem);
                                spanLookupElem.append(aLookupElem);
                                fieldElemDiv.html(spanLookupElem);
                                addSField = true;
                                break;
                            /// create TEXTBOX elements
                            case 'textbox':

                                if (vatttype == 'STRING') {
                                    fieldLiElemDiv.attr('title', labeltext + ' (Textbox)');
                                }

                                var fieldmaxlength = firstElementByTagName(fieldElement, "maxLength", true);
                                var fieldmaxlengthmessage = firstElementByTagName(fieldElement, "maxLengthMessage", true);
                                var placeholdertext = firstElementByTagName(fieldElement, "placeholder", true);
                                var validatefieldtype = firstElementByTagName(fieldElement, "validatefieldtype", true);

                                var inputElem = $('<input />', {
                                    'type': 'textbox', 'id': elemId + '', 'placeholder': placeholdertext, 'name': elemId + '',
                                    'vatt': vatttype, 'class': 'ff-input-type ff-type-text', 'data-maxlengthmessage': fieldmaxlengthmessage,
                                    'maxlength': fieldmaxlength,
                                    'data-validatefieldtype': validatefieldtype
                                });

                                var inputdefaultvalue = firstElementByTagName(fieldElement, "defaultValue", true);

                                inputElem.val(SetInputValue(inputdefaultvalue));
                                inputElem.attr('value', SetInputValue(inputdefaultvalue));

                                if (vatttype.indexOf('CURRENCY') >= 0) {
                                    inputElem.attr('data-formatmessage', 'Please enter a valid currency value');
                                    var currencylbl = firstElementByTagName(fieldElement, "currencyLabel", true);
                                    inputElem.attr('data-currencylabel', currencylbl);

                                }
                                else if (vatttype.indexOf('PERCENT') >= 0) {

                                    inputElem.attr('data-formatmessage', 'Please enter a valid percentage');
                                    inputElem.attr('data-percentlabel', '%');

                                } else if (fieldtype == 'NUMERIC') {

                                    pareseNumericInfoIntoinput(inputElem,fieldElement);
                                }
                                fieldElemDiv.html(inputElem);
                                addSField = true;
                                break;
                            /// create TEXTAREA elements
                            case 'textarea':

                                var fieldmaxlength = firstElementByTagName(fieldElement, "maxLength", true);
                                var fieldmaxlengthmessage = firstElementByTagName(fieldElement, "maxLengthMessage", true);
                                var isHtmlFormatted = firstBooleanElementByTagName(fieldElement, "isHtmlFormatted", false);
                                var placeholdertext = firstElementByTagName(fieldElement, "placeholder", true);
                                var inputElem = $('<textarea />', { 'id': elemId + '', 'placeholder': placeholdertext, 'name': elemId + '', 'vatt': vatttype, 'class': 'ff-textarea', 'data-maxlengthmessage': fieldmaxlengthmessage, 'maxlength': fieldmaxlength, 'data-ishtmlformatted': isHtmlFormatted });
                                var inputdefaultvalue = firstElementByTagName(fieldElement, "defaultValue", true);
                                inputElem.val(inputdefaultvalue);
                                inputElem.attr('value', inputdefaultvalue);
                                inputElem.text(inputdefaultvalue);

                                console.log(' TEXTAREA value' + inputdefaultvalue + ' Eleme value-' + inputElem.val());
                                fieldElemDiv.html(inputElem);
                                addSField = true;
                                break;

                            /// create BOOLEAN elements
                            case 'checkbox':
                                var inputElem = $('<input />', { 'type': 'checkbox', 'id': elemId + '', 'name': elemId + '', 'vatt': vatttype, 'class': 'ff-checkbox' });
                                var labelForElem = $('<label />', { 'for': elemId + '', 'vatt': vatttype, 'class': 'css-label' });
                                var inputdefaultvalue = firstBooleanElementByTagName(fieldElement, "defaultValue", false);
                                if (inputdefaultvalue) {
                                    inputElem.prop('checked', true);
                                    inputElem.attr("checked", true);
                                }
                                else {
                                    inputElem.prop('checked', false);
                                    inputElem.removeAttr("checked");
                                }

                                fieldElemDiv.html(inputElem);
                                fieldElemDiv.append(labelForElem);
                                addSField = true;
                                break;

                            /// create SINGLEPICKLIST elements
                            case 'select-one':
                                var selectcontroltype = firstElementByTagName(fieldElement, "flexControlType", true);
                                var isDataSetCustom = firstElementByTagName(fieldElement, "dtCustom", false);
                                var selectElem = $('<select />', { 'name': elemId, 'id': elemId + '', 'vatt': vatttype, 'class': 'ff-select-type ff-singlepicklist', 'data-flexcontrol': selectcontroltype });
                                var selectDataSetWrapper = $('<div/>', { 'class': 'selectDataSet display-none' });
                                if (isDataSetCustom) {
                                    $(selectElem).attr('data-customset', true);
                                    $(selectDataSetWrapper).html($(selectElem).clone().wrap('<p>').parent().html());
                                    $(selectDataSetWrapper).find('select').attr('id', 'vadataset__' + elemId);
                                    $(selectDataSetWrapper).find('select').removeAttr('class');
                                }
                                var picklistValuesElem = firstElementByTagName(fieldElement, "picklistValues", false);

                                $.each(picklistValuesElem.getElementsByTagName("picklistValue"), function (index, picklistValueElem) {
                                    var optionValue = picklistValueElem.getAttribute('value');
                                    optionValue = unescapeHTMLString(GetInputValue(optionValue));
                                    var optiontext = unescapeHTMLString(GetInputValue($(picklistValueElem).text()));
                                    var isCustom = getSafeBoolean(picklistValueElem.getAttribute('custom'), false);
                                    var isDisabled = getSafeBoolean(picklistValueElem.getAttribute('ignore'), false);
                                    var isSelected = getSafeBoolean(picklistValueElem.getAttribute('selected'), false);
                                    if (isSelected) {
                                        if (!isDisabled) {
                                            $("<option />", { value: optionValue, text: optiontext, 'selected': 'true', 'data-disabled': isDisabled, 'data-iscustom': isCustom }).appendTo(selectElem);
                                        } $("<option />", { value: optionValue, text: optiontext, 'selected': 'true', 'data-disabled': isDisabled, 'data-iscustom': isCustom }).appendTo($(selectDataSetWrapper).find('select'));
                                    }
                                    else {
                                        if (!isDisabled) {
                                            $("<option />", { value: optionValue, text: optiontext, 'data-disabled': isDisabled, 'data-iscustom': isCustom }).appendTo(selectElem);
                                        } $("<option />", { value: optionValue, text: optiontext, 'data-disabled': isDisabled, 'data-iscustom': isCustom }).appendTo($(selectDataSetWrapper).find('select'));
                                    }

                                });
                                fieldElemDiv.html(selectElem);
                                if (isDataSetCustom) {
                                    fieldElemDiv.append(selectDataSetWrapper);
                                }
                                addSField = true;
                                break;

                            /// create MULTIPICKLIST elements
                            case 'select-multi':
                                var selectcontroltype = firstElementByTagName(fieldElement, "flexControlType", true);
                                var isDataSetCustom = firstElementByTagName(fieldElement, "dtCustom", false);
                                var selectElem = $('<select  />', { 'name': elemId, 'id': elemId + '', 'vatt': vatttype, 'class': 'ff-select-type ff-multipicklist', 'data-flexcontrol': selectcontroltype, 'multiple': 'multiple' });
                                var selectDataSetWrapper = $('<div/>', { 'class': 'selectDataSet display-none' });
                                if (isDataSetCustom) {
                                    $(selectElem).attr('data-customset', true);
                                    $(selectDataSetWrapper).html($(selectElem).clone().wrap('<p>').parent().html());
                                    $(selectDataSetWrapper).find('select').attr('id', 'vadataset__' + elemId);
                                    $(selectDataSetWrapper).find('select').removeAttr('class');
                                }
                                var picklistValuesElem = firstElementByTagName(fieldElement, "picklistValues", false);
                                $.each(picklistValuesElem.getElementsByTagName("picklistValue"), function (index, picklistValueElem) {
                                    var optionValue = picklistValueElem.getAttribute('value');
                                    optionValue = unescapeHTMLString(GetInputValue(optionValue));
                                    var optiontext = unescapeHTMLString(GetInputValue($(picklistValueElem).text()));
                                    var isCustom = getSafeBoolean(picklistValueElem.getAttribute('custom'), false);
                                    var isDisabled = getSafeBoolean(picklistValueElem.getAttribute('ignore'), false);
                                    var isSelected = getSafeBoolean(picklistValueElem.getAttribute('selected'), false);
                                    if (isSelected) {
                                        if (!isDisabled) {
                                            $("<option />", { value: optionValue, text: optiontext, 'selected': 'true', 'data-disabled': isDisabled, 'data-iscustom': isCustom }).appendTo(selectElem);
                                        }
                                        $("<option />", { value: optionValue, text: optiontext, 'selected': 'true', 'data-disabled': isDisabled, 'data-iscustom': isCustom }).appendTo($(selectDataSetWrapper).find('select'));
                                    }
                                    else {
                                        if (!isDisabled) {
                                            $("<option />", { value: optionValue, text: optiontext, 'data-disabled': isDisabled, 'data-iscustom': isCustom }).appendTo(selectElem);
                                        } $("<option />", { value: optionValue, text: optiontext, 'data-disabled': isDisabled, 'data-iscustom': isCustom }).appendTo($(selectDataSetWrapper).find('select'));
                                    }


                                });
                                fieldElemDiv.html(selectElem);
                                if (isDataSetCustom) {
                                    fieldElemDiv.append(selectDataSetWrapper);
                                }
                                addSField = true;
                                break;
                            default:
                        }

                        if (addSField) {
                            labelElemDiv.find('.ff-label').attr('ondblclick', 'editFFLabel(this);');
                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-requiredmessage', SetInputValue(GetInputValueAsHTML(fieldrequiredmessage)));
                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-isdefaultreq', isdefaultreq);
                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-isuserreq', isuserreq);
                            if (isdefaultreq || isuserreq) {
                                fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-isrequired', true);
                                labelElemDiv.append($('<span/>', { 'class': 'ff-required-mark', 'html': '*' }));
                            }

                            addObjectInfoOnLabel(labelElemDiv, sortableobject, colorcode);
                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-isupsert', isfieldupsert);
                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-ishidden', isfieldhidden);
                            fieldElemDiv.find('select,input,textarea').not(':input[type=hidden]').attr('data-isreadonly', isfieldreadonly);
                            fieldLiElemDiv.html(labelElemDiv);
                            fieldLiElemDiv.append(fieldElemDiv);
                            imgEditDiv.attr('onclick', "openEditDialog(this,'field');");

                            if (islockenabled && getFSNSVariable("isFreemium", false)) {
                                console.log('LOCKHTML--' + lockHtml);
                                lockhtmlDiv.html(lockHtml);
                                editDelElemDiv.addClass('fm-enabled');
                                editDelElemDiv.html(lockhtmlDiv);
                            }
                            else {
                                editDelElemDiv.html(imgEditDiv);
                            }


                            if (!isdefaultreq) {
                                imgDelDiv.attr('onclick', "deleteField(this,true);");
                                editDelElemDiv.append(imgDelDiv);
                            }

                            fieldLiElemDiv.append(editDelElemDiv);
                            sectionElemDiv.find('ul.formFieldUl').append(fieldLiElemDiv);
                        }
                    } else if (controltype.toLowerCase() != '') {
                        var addGenField = false;
                        var isPaymentField = false;
                        var onlyLabelDiv = false;
                        fieldLiElemDiv.addClass('generalSortableForFields');
                        imgEditDiv.attr('onclick', "openEditDialog(this,'field');");
                        imgDelDiv.attr('onclick', "deleteField(this,true);");
                        var isfieldhidden = firstBooleanElementByTagName(fieldElement, "hiddenField", false);
                        /*general fields*/
                        switch (controltype.toLowerCase()) {
                            /// create GENERALTEXT elements
                            case 'generaltext':
                                fieldLiElemDiv.attr('title', 'Text');
                                labelElemDiv.attr('id', 'divLabel' + elemId);
                                var labelElem = $('<label />', {
                                    'id': 'lbl' + elemId, 'lblname': 'text', 'class': 'ff-label ff-general-text-label',
                                    'html': labelHTML, 'data-ishidden': isfieldhidden
                                });
                                if (isfieldhidden) {
                                    labelElem.addClass('grayLabel');
                                }
                                labelElemDiv.html(labelElem);
                                imgEditDiv.attr('onclick', "openEditDialog(this,'field');");
                                imgDelDiv.attr('onclick', "deleteField(this,true);");
                                addGenField = true;

                                break;

                            /// create ESIGNATURE elements
                            case 'esignature':
                                islockenabled = true;
                                lockHtml = getFreemiumHTML('Signature fields are', 'freemium-edit-block', 'lines-3');
                                fieldLiElemDiv.attr('title', 'Signature');
                                labelElemDiv.attr('id', 'divLabel' + elemId);
                                labelElemDiv.hide();
                                fieldElemDiv.attr('class', 'eSignatureFieldDiv');
                                fieldElemDiv.attr('id', 'field' + elemId);
                                var signtype = firstElementByTagName_ContentHTML(fieldElement, "signType", true);
                                var signoptions = firstElementByTagName_ContentHTML(fieldElement, "signOptions", true);
                                var signlabel = firstElementByTagName_ContentHTML(fieldElement, "signLabel", true);
                                var signdate = firstElementByTagName_ContentHTML(fieldElement, "signDate", true);
                                var signdatehide = firstElementByTagName_ContentHTML(fieldElement, "isDateHidden", true);
                                var signagree = firstElementByTagName_ContentHTML(fieldElement, "signAgreeText", true);
                                var signagreehide = firstElementByTagName_ContentHTML(fieldElement, "isAgreeHidden", true);
                                var emailverifednabled = firstBooleanElementByTagName_ContentHTML(fieldElement, "emailEnabled", false);
                                var emaillabel = safeStringValue(firstElementByTagName_ContentHTML(fieldElement, "emailLabel", true), 'Email');

                                var inputElem = $('<input />', {
                                    'id': 'input' + elemId, 'type': 'hidden', 'lblname': 'Signature', 'class': 'ffd-esignature-input',
                                    'data-signtype': signtype, 'data-signoptions': signoptions, 'data-signlabel': signlabel,
                                    'data-signdate': signdate, 'data-signdatehide': signdatehide, 'data-signagree': signagree,
                                    'data-signagreehide': signagreehide, 'data-emailenabled': emailverifednabled, 'data-emaillabel': emaillabel
                                });

                                fieldElemDiv.html(inputElem);
                                var signatureComponentItem = $('#DocSignHTMLTemp').clone().html();
                                var signatureIndex = elemId.replace('ESIGNATURE', '');
                                //fieldElemDiv.html(inputElem);
                                fieldElemDiv.append(signatureComponentItem);
                                fieldElemDiv.find('.ffd-esignature-input').attr('id', 'input' + elemId);
                                fieldElemDiv.find('.ffd-esignature').show();
                                fieldElemDiv.find('.main-docsign-wrapper').attr('id', 'elem' + elemId);

                                assignSignatureElementIds(fieldElemDiv, signatureIndex);
                                imgEditDiv.attr('onclick', "openEditSignatureDialog(this,true);");
                                imgDelDiv.attr('onclick', "deleteSignatureField(this,true);");
                                addGenField = true;

                                break;

                            /// create PAYMENT elements
                            case 'payment':
                                var istestmode = firstBooleanElementByTagName(fieldElement, "testMode", false);

                                var paymentTypeText = getOPaymentTypeVal(fieldAttrType, 'PayPal Pro', 'PayPal Pro', 'iATS', 'Stripe', 'Authorize.Net');
                                var paymentTypePrefix = getOPaymentTypeVal(fieldAttrType, 'PayPal', 'PayPal', 'IATS', 'Stripe', 'AuthorizeNet');
                                var paymentAccType = paymentTypeText.replace('.', '');
                                islockenabled = true;
                                lockHtml = getFreemiumHTML('Payment fields are', 'freemium-edit-block', 'lines-3');


                                fieldLiElemDiv.attr('title', '');
                                var tempPaymentIndex = safeLegacyPAYPALPAYMENT(elemId);
                                try {
                                    tempPaymentIndex = tempPaymentIndex.substring(tempPaymentIndex.indexOf('PAYMENT') + 7);
                                } catch (err) {
                                    tempPaymentIndex = tempPaymentIndex.replace('PAYPALPAYMENT', '');
                                    tempPaymentIndex = tempPaymentIndex.replace('IATSPAYMENT', '');
                                    tempPaymentIndex = tempPaymentIndex.replace('AUTHORIZENETPAYMENT', '');
                                    tempPaymentIndex = tempPaymentIndex.replace('STRIPEPAYMENT', '');
                                    tempPaymentIndex = tempPaymentIndex.replace('FASTFORMSPAYMENT', '');
                                }


                                var labelLiId = 'lblliFASTFORMSPAYMENT' + tempPaymentIndex;
                                fieldLiElemDiv.attr('id', labelLiId);


                                var paymentItem = $('<div/>').html($('#generalFieldBox').find('#lblliFASTFORMSPAYMENT').html());

                                if (istestmode) {
                                    paymentItem.addClass('test-mode-active')
                                }
                                var originaldivId = paymentItem.find('.field-div-payment').attr('id');
                                paymentItem.find('.field-div-payment').attr('title', paymentTypeText + ' payment');
                                var newPaymentDivid = originaldivId + tempPaymentIndex;
                                paymentItem.find('.field-div-payment').attr('id', newPaymentDivid);
                                $(paymentItem.find('.payment-item-row')).each(function (indx, ppitemrow) {

                                    if (!$(ppitemrow).hasClass('pp-default-hide')) {
                                        $(ppitemrow).show();
                                    }

                                    if ($(ppitemrow).hasClass('pp-expiry')) {

                                        var ppexpirylblid = $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id');
                                        ppexpirylblid.replace(i, '');
                                        $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id', ppexpirylblid + tempPaymentIndex);
                                        $($(ppitemrow).find('select')).each(function (index, ppitemrowselect) {
                                            var orginalselElemId = $(ppitemrowselect).attr('data-pp-name');
                                            // orginalselElemId=orginalselElemId.replace('FFPayment', paymentTypePrefix);
                                            $(ppitemrowselect).attr('data-pp-name', orginalselElemId);
                                            $(ppitemrowselect).attr('id', orginalselElemId + tempPaymentIndex);
                                            $(ppitemrowselect).attr('name', orginalselElemId + tempPaymentIndex);
                                        });
                                    }
                                    else {
                                        var inputElem = $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label');
                                        if ($(inputElem).length > 0) {

                                            var originalElemId = $(inputElem).attr('id');
                                            //  originalElemId=originalElemId.replace('FFPayment', paymentTypePrefix);
                                            $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('id', originalElemId + tempPaymentIndex);
                                            $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('name', originalElemId + tempPaymentIndex);
                                            $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('data-pp-name', originalElemId);
                                            $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id', 'lbl' + originalElemId + tempPaymentIndex);
                                        }
                                    }
                                });
                                var paymentFieldRecId = firstElementByTagName(fieldElement, "paymentFieldId", true);
                                if (paymentFieldRecId !== undefined && paymentFieldRecId !== '') {
                                    resetPaymentField(paymentItem, fieldAttrType, true, true);
                                    paymentItem.find('.field-div-payment').attr('data-paymentfield-record-id', paymentFieldRecId);

                                }
                                else {
                                    resetPaymentField(paymentItem, fieldAttrType, false, true);
                                }
                                console.log('Payment field rec id ' + paymentFieldRecId);

                                //tempLiHtml  += 
                                if (paymentFieldRecId !== undefined && paymentFieldRecId !== '') {

                                    initializePaymentFieldsInfo(paymentFieldRecId, newPaymentDivid, paymentAccType);
                                }

                                imgEditDiv.attr('onclick', "openEditPaymentDialog(this);");
                                imgDelDiv.attr('onclick', "deletePaymentField(this,true);");
                                if (islockenabled && getFSNSVariable("isFreemium", false)) {
                                    lockhtmlDiv.html(lockHtml);
                                    editDelElemDiv.addClass('fm-enabled');
                                    editDelElemDiv.html(lockhtmlDiv);
                                }
                                else {
                                    editDelElemDiv.html(imgEditDiv);
                                }

                                editDelElemDiv.append(imgDelDiv);
                                paymentItem.find('.field-div-payment .editDelDiv').remove();
                                paymentItem.find('.field-div-payment').append(editDelElemDiv);
                                fieldLiElemDiv.append(paymentItem.html());
                                addGenField = true;
                                isPaymentField = true;
                                break;

                            /// create FILEUPLOAD elements
                            case 'fileupload':
                                islockenabled = true;
                                lockHtml = getFreemiumHTML('File Upload fields are', 'freemium-edit-block', 'lines-3');

                                setFileUploadHtmlAttributes(elemId, fieldElement, fieldLiElemDiv, 
                                    fieldElemDiv, labelHTML, labelElemDiv, isfieldhidden);

                                addGenField = true;
                                break;

                            /// create IMAGE elements
                            case 'image':
                                fieldLiElemDiv.attr('title', 'Image');
                                var fieldLiId = elemId.replace('img', '');
                                fieldLiElemDiv.attr('id', 'lblli' + fieldLiId);
                                labelElemDiv.attr('id', 'divLabel' + elemId);
                                var labelElem = $('<label />', { 'id': 'lbl' + elemId, 'lblname': 'Image', 'class': 'ff-label ff-image-label', 'data-ishidden': isfieldhidden });
                                if (isfieldhidden) {
                                    labelElem.addClass('grayLabel');
                                }
                                labelElemDiv.html(labelElem);

                                var imageComponentItem = $('#generalFieldBox .imageGeneralFieldDiv').clone().html();
                                $ImageComponentWrapper = $('<div />', { 'class': 'imageGeneralFieldDiv', 'id': 'imageField' + elemId });
                                $ImageComponentWrapper.append(imageComponentItem);
                                var imgSrc = firstElementByTagName(fieldElement, "imgSrc", true);
                                labelElemDiv.append($ImageComponentWrapper);
                                if (!isNullOrEmpty(imgSrc)) {
                                    labelElemDiv.find('.ffse-img-input-container-editor').hide();
                                    var imgwidth = firstElementByTagName(fieldElement, "imgWidth", true);
                                    var imgHeight = firstElementByTagName(fieldElement, "imgHeight", true);
                                    var imgAlignment = firstElementByTagName(fieldElement, "alignment", true);
                                    var imgAltTag = firstElementByTagName(fieldElement, "alt", true);
                                    if (!isNullOrEmpty(imgAlignment)) {
                                        labelElemDiv.find('.imageGeneralFieldDiv').attr('style', 'text-align:' + imgAlignment);
                                    }
                                    labelElemDiv.find('.ffse-img-upload-placeholder-editor').show();

                                    var imagElem = $('<img />', { 'id': elemId });
                                    labelElemDiv.find('.ffse-img-upload-placeholder-editor').html(imagElem);
                                    labelElemDiv.find('.ffse-img-upload-placeholder-editor img').attr('width', imgwidth);
                                    labelElemDiv.find('.ffse-img-upload-placeholder-editor img').attr('height', imgHeight);
                                    labelElemDiv.find('.ffse-img-upload-placeholder-editor img').attr('alt', imgAltTag);
                                    labelElemDiv.find('.ffse-img-upload-placeholder-editor img').attr('src', htmlUnescape(htmlUnescape(imgSrc)));
                                }
                                else {
                                    labelElemDiv.find('.ffse-img-upload-placeholder-editor').hide();
                                    labelElemDiv.find('.ffse-img-input-container-editor').show();
                                }
                                addGenField = true;
                                onlyLabelDiv = true;
                                break;

                            /// create CAPTCHA elements
                            case 'captcha':
                                fieldLiElemDiv.attr('title', 'Captcha');
                                labelElemDiv.attr('id', 'divLabel' + elemId);
                                var labelElem = $('<label />', {
                                    'id': elemId, 'lblname': 'Captcha', 'class': 'ff-label ff-captcha-label',
                                    'html': labelHTML
                                });
                                if (isfieldhidden) {
                                    labelElem.addClass('grayLabel');
                                }
                                labelElemDiv.html(labelElem);
                                var captchaImg = GetWindowURL() + ffcommonResuorceUrl + "/images/captcha.png";
                                if (getFSNSVariable("isNative", false)) {
                                    captchaImg = GetWindowURL() + ffcommonResuorceUrl + "/images/reCaptcha.png";
                                }
                                var imgElem = $('<img/>', { 'src': captchaImg });
                                var isreq = firstBooleanElementByTagName(fieldElement, "required", true);
                                if (isreq) {
                                    $(labelElemDiv).find('.ff-label').after($('<span/>', { 'class': 'ff-required-mark', 'html': '*' }));
                                }
                                var inputElem = $('<input />', { 'type': 'textbox', 'id': elemId + '', 'name': elemId + '', 'vatt': fieldtype, 'class': 'ff-input-type ff-type-text ff-type-captcha', 'data-maxlengthmessage': 'Maximum 50 characters', 'maxlength': '50', 'data-isrequired': isreq, 'data-ishidden': isfieldhidden });
                                fieldElemDiv.html(imgElem);
                                fieldElemDiv.append('<br/>');
                                if (getFSNSVariable("isNative", false)) {
                                    inputElem.addClass('display-none');
                                }
                                fieldElemDiv.append(inputElem);
                                imgEditDiv.attr('onclick', "openEditDialog(this,'field');");
                                imgDelDiv.attr('onclick', "deleteField(this,true);");
                                addGenField = true;
                                break;

                            default:
                        }
                        if (addGenField) {
                            if (!isPaymentField) {
                                if (labelElemDiv.find('.ff-label').length > 0) {
                                    labelElemDiv.find('.ff-label').attr('ondblclick', 'editFFLabel(this);');
                                }
                                fieldLiElemDiv.html(labelElemDiv);
                                if (!onlyLabelDiv) {
                                    fieldLiElemDiv.append(fieldElemDiv);
                                }

                                if (islockenabled && getFSNSVariable("isFreemium", false)) {
                                    lockhtmlDiv.html(lockHtml);
                                    editDelElemDiv.addClass('fm-enabled');
                                    editDelElemDiv.html(lockhtmlDiv);
                                }
                                else {
                                    editDelElemDiv.html(imgEditDiv);
                                }

                                editDelElemDiv.append(imgDelDiv);
                                fieldLiElemDiv.append(editDelElemDiv);
                            }
                            sectionElemDiv.find('ul.formFieldUl').append(fieldLiElemDiv);
                        }
                    }

                    /*field parsing ends*/
                });

                pageElemDiv.find('.formSectionUlWrap').append(sectionElemDiv.html());

            });
        }
    });

    $('#mainMultiPageWrapper').find('.form-canvas-multi-page-inner').append(pageElemDiv);

    initializeESignatureElements();
    resetFlexInputElements();
    resetSelect2FormElements();
}

function pareseNumericInfoIntoinput(inputElem,fieldElement)
{
        var dataflexmin = firstElementByTagName(fieldElement, "data_flex_min", true);
        var dataflexmax = firstElementByTagName(fieldElement, "data_flex_max", true);
        var dataflexminlabel = firstElementByTagName(fieldElement, "data_flex_minlabel", true);
        var dataflexmaxlabel = firstElementByTagName(fieldElement, "data_flex_maxlabel", true);

        var flexcontroltype = firstElementByTagName(fieldElement, "flexControlType", true);
        inputElem.attr('data-flexcontrol', flexcontroltype);
        if (flexcontroltype == 'integer-npsrating') {
            var dataflexmiddle = firstElementByTagName(fieldElement, "data_flex_middle", true);
            var dataflexmiddlelabel = firstElementByTagName(fieldElement, "data_flex_middlelabel", true);
            inputElem.attr('data-flex-min', dataflexmin);
            inputElem.attr('data-flex-max', dataflexmax);
            inputElem.attr('data-flex-middle', dataflexmiddle);
            inputElem.attr('data-flex-minlabel', dataflexminlabel);
            inputElem.attr('data-flex-maxlabel', dataflexmaxlabel);
            inputElem.attr('data-flex-middlelabel', dataflexmiddlelabel);
        }
        else if (flexcontroltype == 'integer-starrating') {
            inputElem.attr('data-flex-min', dataflexmin);
            inputElem.attr('data-flex-max', dataflexmax);
            inputElem.attr('data-flex-minlabel', dataflexminlabel);
            inputElem.attr('data-flex-maxlabel', dataflexmaxlabel);
        }
        else if (flexcontroltype == 'integer-matrixlikert') {

            var valueSteps = firstElementByTagName(fieldElement, "data_matrix_value_steps", true);
            var labelIsShownLabel = firstElementByTagName(fieldElement, "data_matrix_label_isshownlabel", true);
            var columns = firstElementByTagName(fieldElement, "data_matrix_columns", true);
            var dataMatrix = firstElementByTagName(fieldElement, "data_matrix", true);
            var labels = firstElementByTagName(fieldElement, "data_matrix_labels", true);

            inputElem.attr('data-matrix-value-steps', valueSteps);
            inputElem.attr('data-matrix-label-isshownlabel', labelIsShownLabel);
            inputElem.attr('data-matrix-columns', columns);
            inputElem.attr('data-matrix', dataMatrix);
            inputElem.attr('data-matrix-labels', labels);
        }
}


// Multi page js file starts
function safePageLabel(pagerecordid) {
    var returnId = pagerecordid;
    if (!isNullOrEmpty(returnId)) {
        returnId = returnId.replace('FFP-', '');
        returnId = returnId.replace(/^0+/, '');
    }
    return 'pageFFLabel' + returnId;
}
function safeSectionLabel(sectionid) {
    var returnId = sectionid;
    if (!isNullOrEmpty(returnId)) {

        returnId = returnId.replace(/sectionFFLabel/g, '');
        returnId = returnId.replace(/sectionLabel/g, '');
    }
    return 'sectionLabel' + returnId;
}
function getSafeApiName(formLiElem) {
    var apiname = $(formLiElem).find('div.labelDiv label.ff-label').attr('data-apiname');
    if (isNullOrEmpty(apiname) || apiname.indexOf(' ') > 0) {
        apiname = getSFieldName($(formLiElem).find('.fieldDiv').find('>select,>input,input.ff-input-type,>textarea').attr('id'));
    }
    return apiname;
}
function safeSectionCounter(sectionid) {
    var returnId = sectionid;
    if (!isNullOrEmpty(returnId)) {

        returnId = returnId.replace(/sectionFFLabel/g, '');
        returnId = returnId.replace(/sectionLabel/g, '');
    }
    return returnId;
}

function getSafeAttr(inputElem, dataAttr) {
    var defaultvalue="";
    try {
        defaultvalue = $(inputElem).attr(dataAttr);
        if (defaultvalue === undefined) {
            defaultvalue = "";
        }
    }
    catch (err) {
        defaultvalue = defaultvalue;
        console.log("FF log " + err.message);
    }
    return defaultvalue;
}

function firstCharCap(txt) {
    var txtstr = txt;
    if (!isNullOrEmpty(txt) && txt.length > 1) {
        txtstr = txt.slice(0, 1).toUpperCase()
        txtstr += txt.slice(1).toLowerCase();
    }
    return txtstr;
}
function refreshPagesOrder() {
    draftchanges(true);
    var multiPageOrderObjList = [];
    $('#mainMultiPageWrapper .fc-multi-page-item').each(function (indx, pageItem) {
        var pageid = $(pageItem).attr('data-pageid');
        if (!isNullOrEmpty(pageid)) {
            var pageorder = 0;
            pageorder = indx;
            pageorder++;
            $(pageItem).find('.ff-page-header-box .page-tag-number').html(pageorder);

            var pageObj = { 'Id': pageid };
            var pageorder_c = getPrefixedOrgFieldName(SFOrgPrefix, 'Page_Order__c');
            pageObj[pageorder_c] = pageorder;
            multiPageOrderObjList.push(pageObj);
        }
    });
    resetFooterNavigation();
    resetPageDeleteOption();
    remoteUpdateFormPagesOrderJs(multiPageOrderObjList);
}
function resetPageDeleteOption() {
    if ($('#mainMultiPageWrapper .fc-multi-page-item').length < 2) {
        if ($('#mainMultiPageWrapper .fc-multi-page-item').hasClass('hide-visibility')) {
            togglePageBlock($('#mainMultiPageWrapper .fc-multi-page-item .ff-page-header-box .expand-icon'));
        }
        $('#mainMultiPageWrapper .fc-multi-page-item .ff-page-header-box').fadeOut();
        $('#mainMultiPageWrapper .fc-multi-page-item').attr('data-ishidden', false);
        $('#mainMultiPageWrapper .fc-multi-page-item li.pageLi').fadeOut();

    }
    else {
        $('#mainMultiPageWrapper .fc-multi-page-item .ff-page-header-box').fadeIn();
        $('#mainMultiPageWrapper .fc-multi-page-item li.pageLi').fadeIn();
        $('#mainMultiPageWrapper .fc-multi-page-item').each(function (indx, pageItem) {
            $(pageItem).find('.ff-page-header-box  .ff-page-edit-box .delete-icon').show();
        });

    }
}
function refreshPagesOrderCallBack(err, results, objevent) {
    if (err) {
        console.log('Error  Refreshed page orders-' + err.message);
        draftchanges(false);
    }
    else {
        $(results).each(function (indx, pageitem) {
            console.log(' Refreshed page orders-' + pageitem.Id);
        });
        draftchanges(false);
    }

}

function addFFPage(mainPageElemWrapper, pageItem) {
    var pagename = pageItem["pTitle"];
    var pageorder = safeStringValue(pageItem["pOrder"], '');
    var pageid = safeStringValue(pageItem["pId"], '');
    var pageishidden = getSafeBoolean(pageItem["pHidden"], false);


    if ($(mainPageElemWrapper).find('.form-canvas-multi-page-inner').find('.fc-multi-page-item').length > 0) {

        $(mainPageElemWrapper).find('.form-canvas-multi-page-inner').append($('#pageAddNewTEMP').html());
    }
    var pageDiv = $('<div/>').addClass('fc-multi-page-item');
    pageDiv.append($('#pageHeaderTEMP').html());
    pageDiv.append($('#pageTitleTEMP').html());
    //pageDiv.find('.formSectionUl').append($('#pageNewSectionTEMP').html());
    var pagelabelid = safePageLabel(safeStringValue(pageItem["pFormPageId"], ''));
    if (!isNullOrEmpty(pagelabelid)) {
        pageDiv.find('.ff-page-header').attr('id', pagelabelid);
    }

    pageDiv.append($('#pageFooterTEMP').html());
    pageDiv.append($('#pageNewSectionBoxTEMP').html());
    pageDiv.find('.ff-page-header-box .page-tag-number').html(pageorder);
    pageDiv.attr('data-pageid', pageid);
    pageDiv.attr('data-ishidden', pageishidden);
    if (isNullOrEmpty(pagename)) {
        pagename = 'New Page Title';
    }
    pageDiv.find('>ul.formPageUl>li .ff-page-header').html(pagename);
    addNewSectionItem(pageDiv.find('.add-newsection-box'), false);
    $(mainPageElemWrapper).find('.form-canvas-multi-page-inner').append(pageDiv);

}
function resetFooterNavigation() {
    var isSaveForLaterEnabled = false;
    var totalPages = $('.form-canvas-multi-page-inner .fc-multi-page-item').length;
    $('.form-canvas-multi-page-inner .fc-multi-page-item').each(function (indx, pageElement) {
        if (indx == 0) {
            isSaveForLaterEnabled = getSafeBoolean($(pageElement).find('.Ulbtn .ff-btn-save').attr('data-saveenabled'), false);
            $(pageElement).find('.Ulbtn .ff-btn-prev').hide();
            if (totalPages > 1) {
                $(pageElement).find('.Ulbtn .ff-btn-next').show();
                $(pageElement).find('.Ulbtn .ff-btn-submit').hide();
            }
            else {
                $(pageElement).find('.Ulbtn .ff-btn-next').hide();
                $(pageElement).find('.Ulbtn .ff-btn-submit').show();
            }
        }
        else if (indx == totalPages - 1) {//last page-hide back button
            $(pageElement).find('.Ulbtn .ff-btn-next').hide();
            if (totalPages > 1) {
                $(pageElement).find('.Ulbtn .ff-btn-prev').show();
                $(pageElement).find('.Ulbtn .ff-btn-submit').show();
            }
            else {
                $(pageElement).find('.Ulbtn .ff-btn-prev').hide();
                $(pageElement).find('.Ulbtn .ff-btn-submit').show();
            }
        }
        else {
            $(pageElement).find('.Ulbtn .ff-btn-submit').hide();
            $(pageElement).find('.Ulbtn .ff-btn-prev').show();
            $(pageElement).find('.Ulbtn .ff-btn-next').show();
        }
        if (isSaveForLaterEnabled) {
            $(pageElement).find('.Ulbtn .ff-btn-save').show();
        } else {
            $(pageElement).find('.Ulbtn .ff-btn-save').hide();
        }

    });
}
function getFFPage(addSection) {

    var pageDiv = $('<div/>').addClass('fc-multi-page-item');
    pageDiv.append($('#pageHeaderTEMP').html());
    pageDiv.append($('#pageTitleTEMP').html());
    //pageDiv.find('.formSectionUl').append($('#pageNewSectionTEMP').html());


    pageDiv.append($('#pageFooterTEMP').html());
    pageDiv.append($('#pageNewSectionBoxTEMP').html());
    if (addSection) {
        addNewSectionItem(pageDiv.find('.add-newsection-box'), false);
    }
    return pageDiv;
}
function addLastNewPageElement() {
    if ($('#mainMultiPageWrapper').find('>.add-newpage-box').length < 1) {
        var addNewPageElem = $('<div/>').html($('#pageAddNewTEMP').html());
        addNewPageElem.find('.page-divider.item-last').remove();
        $('#mainMultiPageWrapper').append(addNewPageElem.html());
    }
}
function toggleNextElements(elemSource) {
    //toggleNextElement(elemSource,true);
}
function toggleNextElement(elemSource, checkEdition, isAutoSave) {
    var processAction = true;
    if (checkEdition) {
        var editionFlagEnabled = getSafeBoolean($(elemSource).attr('data-featuredisabled'), false);
        if (editionFlagEnabled) {
            var primaryMessage = safeStringValue($(elemSource).attr('data-upgradetitle'), 'Premium feature');
            var secMessage = safeStringValue($(elemSource).attr('data-upgrademsg'), 'This feature is not available in your edition of Fast Forms');
            upgradeNowMessage(primaryMessage, secMessage, '');
            processAction = false;

        }

    }
    if (processAction) {
        if ($(elemSource).prop('checked')) {

            $(elemSource).closest('.toggle-div-parent').find('>.toggle-div-child').slideDown();
        }
        else {
            $(elemSource).closest('.toggle-div-parent').find('>.toggle-div-child').slideUp();
        }
        onFormSettingsChange(elemSource, isAutoSave);
    }
    else {
        if ($(elemSource).is(':checked')) {
            $(elemSource).prop('checked', false);
        }
    }

}
function formOptionsConfigXML() {

    var formoptions = '<formOptions>'
    formoptions += '<submitInfo>';

    formoptions += '<btnMessage>' + GetInputValueAsHTML(safeStringValue($("#txtareaThankyoumsg").val(), "")) + '</btnMessage>';
    formoptions += '<btnText>' + GetInputValueAsHTML(safeStringValue($("#txtbxSubmitButtonLabel").val(), "Send")) + '</btnText>'; 
    
    if ($('a[href$="#formconfirmationRadio2"]').parent().hasClass('active')) {
        formoptions += '<redirectEnabled>true</redirectEnabled>';
        formoptions += '<btnUrl>' + GetInputValueAsHTML(safeStringValue($("#txtbxRedirectUrl").val(), "")) + '</btnUrl>';
    }
    else {
        formoptions += '<redirectEnabled>false</redirectEnabled>';
        formoptions += '<btnUrl></btnUrl>';
    }
    formoptions += '</submitInfo>';
    formoptions += '<multiPageInfo>';
    if ($('#mainMultiPageWrapper').find('.form-canvas-multi-page-inner').find('.fc-multi-page-item').length > 1) {
        formoptions += '<multiPageEnabled>true</multiPageEnabled>';
    }
    else {
        formoptions += '<multiPageEnabled>false</multiPageEnabled>';
    }
    formoptions += '<breadcrumbEnabled>' + getFFCheckBoxElemValue($("#chkFormNavigationBar"), false) + '</breadcrumbEnabled>';
    formoptions += '<breadcrumbPrefixEnabled>' + getFFCheckBoxElemValue($("#chkPrefixNumber"), false) + '</breadcrumbPrefixEnabled>';
    formoptions += '<breadcrumbPrefix>' + GetInputValueAsHTML(safeStringValue($("#inputPrefixNumber").val(), "Back")) + '</breadcrumbPrefix>';
    formoptions += '<breadcrumbNumbered>' + getFFCheckBoxElemValue($("#chkPagenumberInNavigation"), false) + '</breadcrumbNumbered>';
    var validationtype = safeStringValue($('#selFormValidationType').select2("val"), "");
    if (validationtype == 'page') {
        formoptions += '<pageValidationType>' + validationtype + '</pageValidationType>';
    }
    else {
        formoptions += '<pageValidationType>form</pageValidationType>';
    }
    formoptions += '<isFooterCustomized>' + getFFCheckBoxElemValue($("#chkCustomizeFooterNavigation"), false) + '</isFooterCustomized>';
    formoptions += '<prevBtnText>' + GetInputValueAsHTML(safeStringValue($("#inputBtnPrev").val(), "Back")) + '</prevBtnText>';
    formoptions += '<nextBtnText>' + GetInputValueAsHTML(safeStringValue($("#inputBtnNext").val(), "Next")) + '</nextBtnText>';
    formoptions += '</multiPageInfo>';
    formoptions += '<saveForLaterInfo>';
    formoptions += '<saveForLaterEnabled>' + getFFCheckBoxElemValue($("#chkCustomizeSaveForLater"), false) + '</saveForLaterEnabled>';
    formoptions += '<saveBtnText>' + GetInputValueAsHTML(safeStringValue($("#inputBtnSFLSave").val(), "Save")) + '</saveBtnText>';
    formoptions += '<discardBtnText>' + GetInputValueAsHTML(safeStringValue($("#inputBtnSFLDiscard").val(), "Discard")) + '</discardBtnText>';
    formoptions += '</saveForLaterInfo>';
    formoptions += '</formOptions>';
    return formoptions;

}
function populateSubmitOptions(formOptionsElem, onlyFormCanvasElements) {

    $('#selFormValidationType').select2();
    var btnMessage = firstElementByTagName(formOptionsElem, "btnMessage", true);// getXMLElemFirstNode(submitOptions, "btnMessage");
    var btnText = firstElementByTagName(formOptionsElem, "btnText", true);
    var btnUrl = firstElementByTagName(formOptionsElem, "btnUrl", true);
    var redirectEnabled = firstBooleanElementByTagName(formOptionsElem, "redirectEnabled", false);
    var breadcrumbEnabled = firstBooleanElementByTagName(formOptionsElem, "breadcrumbEnabled", false);
    var breadcrumbPrefix = firstElementByTagName(formOptionsElem, "breadcrumbPrefix", true);
    var breadcrumbPrefixEnabled = firstBooleanElementByTagName(formOptionsElem, "breadcrumbPrefixEnabled", false);
    var breadcrumbNumbered = firstBooleanElementByTagName(formOptionsElem, "breadcrumbNumbered", false);

    var pageValidationType = firstElementByTagName(formOptionsElem, "pageValidationType", true);
    var isFooterCustomized = firstBooleanElementByTagName(formOptionsElem, "isFooterCustomized", false);
    var prevBtnText = firstElementByTagName(formOptionsElem, "prevBtnText", true);
    var nextBtnText = firstElementByTagName(formOptionsElem, "nextBtnText", true);

    var isSaveForLaterEnabled = firstBooleanElementByTagName(formOptionsElem, "saveForLaterEnabled", false);
    var saveBtnText = safeStringValue(firstElementByTagName(formOptionsElem, "saveBtnText", true), 'Save');
    var discardBtnText = safeStringValue(firstElementByTagName(formOptionsElem, "discardBtnText", true), 'Discard');


    try {

        if (!onlyFormCanvasElements) {

            $("#txtbxSubmitButtonLabel").val(SetInputValue(btnText));
            $("#txtareaThankyoumsg").val(SetInputValue(btnMessage));
            $("#txtbxRedirectUrl").val(SetInputValue(btnUrl));
            $('#inputPrefixNumber').val(SetInputValue(breadcrumbPrefix));
            $('#inputBtnPrev').val(SetInputValue(prevBtnText));
            $('#inputBtnNext').val(SetInputValue(nextBtnText));
            $('#inputBtnSFLDiscard').val(SetInputValue(discardBtnText));
            $('#inputBtnSFLSave').val(SetInputValue(saveBtnText));

            if (redirectEnabled) {
                $('a[href$="#formconfirmationRadio1"]').parent().removeClass('active');
                $('a[href$="#formconfirmationRadio2"]').parent().addClass('active')
                $('#formconfirmationRadio1').removeClass('active in');
                $('#formconfirmationRadio2').addClass('active in');
            }

            setFFCheckBoxElem($('#chkFormNavigationBar'), breadcrumbEnabled);
            setFFCheckBoxElem($('#chkPagenumberInNavigation'), breadcrumbNumbered);
            setFFCheckBoxElem($('#chkPrefixNumber'), breadcrumbPrefixEnabled);
            setFFCheckBoxElem($('#chkCustomizeFooterNavigation'), isFooterCustomized);
            setFFCheckBoxElem($('#chkCustomizeSaveForLater'), isSaveForLaterEnabled);
            if (!isNullOrEmpty(pageValidationType)) {
                $('#selFormValidationType').select2('val', pageValidationType);
            }
            $('.form-row-group .toggle-trigger').each(function (indx, chkBoxElem) {
                toggleNextElement(chkBoxElem, false, false);
            });
        }

        resetFooterNavigationBtns(btnText, prevBtnText, nextBtnText, saveBtnText, isSaveForLaterEnabled);
    }
    catch (err) {
        console.log(' Error in populating footerHtml ' + err);
    }
}
function resetFooterNavigationBtns(submitBtnText, prevBtnText, nextBtnText, saveText, isSaveForLaterEnabled) {
    $('#mainMultiPageWrapper').find('.form-canvas-multi-page-inner .fc-multi-page-item').each(function (indx, pageElem) {
        $(pageElem).find('.Ulbtn').find('.ff-btn-prev').val(SetInputValue(prevBtnText));
        $(pageElem).find('.Ulbtn').find('.ff-btn-next').val(SetInputValue(nextBtnText));
        $(pageElem).find('.Ulbtn').find('.ff-btn-submit').val(SetInputValue(submitBtnText));
        $(pageElem).find('.Ulbtn').find('.ff-btn-save').val(SetInputValue(saveText));
        $(pageElem).find('.Ulbtn').find('.ff-btn-save').attr('data-saveenabled', isSaveForLaterEnabled);

    });
}
function createJSONPageObj(pageid, formpageid, pageTitle, pageOrder, pageFieldsXml, pagehtml, pagehidden) {
    var dataobj = { 'pId': pageid, 'pFormPageId': formpageid, 'pTitle': pageTitle, 'pOrder': pageOrder, 'pXML': pageFieldsXml, 'pHTML': pagehtml, 'pHidden': pagehidden };


    return dataobj;
}
function createJSONFormPageObj(pageid, pageTitle, pageOrder, pageFieldsXml, pagehtml, pageFieldsObjectXml, pagehidden) {
    var pagexml_c = getPrefixedOrgFieldName(SFOrgPrefix, 'Fields_xml__c');
    var pagefieldsobjectxml_c = getPrefixedOrgFieldName(SFOrgPrefix, 'FieldsObjectXml__c');
    var formhtml_c = getPrefixedOrgFieldName(SFOrgPrefix, 'Html__c');
    var pageorder_c = getPrefixedOrgFieldName(SFOrgPrefix, 'Page_Order__c');
    var pagetitle_c = getPrefixedOrgFieldName(SFOrgPrefix, 'Page_Title__c');
    var ishidden = getPrefixedOrgFieldName(SFOrgPrefix, 'Is_Hidden__c');

    var dataobj = { 'Id': pageid };
    dataobj[pagetitle_c] = pageTitle;
    dataobj[pageorder_c] = pageOrder;
    dataobj[pagexml_c] = pageFieldsXml;
    dataobj[pagefieldsobjectxml_c] = pageFieldsObjectXml;
    dataobj[formhtml_c] = pagehtml;
    dataobj[ishidden] = pagehidden;
    return dataobj;
}


function updateElemProps(elemSource, classnm, elemid, text) {
    $(elemSource).attr('class', classnm);
    $(elemSource).attr('id', elemid);
    $(elemSource).html(text);
    return $(elemSource)

}
function isStringTrue(stringBooleanFlag, defaultBool) {
    var returnflag = defaultBool;
    if (!isNullOrEmpty(stringBooleanFlag) && (stringBooleanFlag == true || stringBooleanFlag + ''.toLowerCase() == 'true')) {
        returnflag = true;
    }
    return returnflag;
}
function updateElementProp(elemSource, attrName, attrValue, includeIfBlankValue) {
    if (elemSource !== undefined) {
        if (!isNullOrEmpty(attrValue)) {
            $(elemSource).attr(attrName, attrValue);
        }
        else if (includeIfBlankValue) {
            $(elemSource).attr(attrName, '');
        }
    }

}

function initializeESignatureElements() {
    $('#mainMultiPageWrapper .formFieldUl li.fieldLi[data-otype="OESignature"]').each(function (inx, fieldLi) {
        if ($(fieldLi).hasClass('generalSortableForFields')) {
            resetESignatureElement(fieldLi, false);
        }
    });
}
function htmlUnescape(value) {
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}
function objectInfoDisplay() {
    $('.formFieldUl li .labelDiv').each(function (i, labelDiv) {
        if ($(labelDiv).find('.obj-info').length > 0) {
            var listname = $(labelDiv).find('.obj-info').attr('data-listname');
            var labeltext = $('#' + listname).parents('.list-toggle-div-wrap').find('.objName').text();
            var labeltext = '';
            if (listname == 'sortableForRelFields1') {
                labeltext = $("#priName").text();
            }
            else {
                labeltext = $('#' + listname).parents('.list-toggle-div-wrap').find('.objName').text();
            }
            if (!isNullOrEmpty(labeltext)) {
                $(labelDiv).find('.obj-info').html('From: ' + labeltext);
            }

        }
    });
}
function addObjectInfoOnLabel(labelElemDiv, sortableclass, colorcode) {
    $(labelElemDiv).find('.obj-info').remove();
    if (!isNullOrEmpty(colorcode)) {
        colorcode = colorcode.trim();
    }
    $(labelElemDiv).append($('<div/>', { 'class': 'obj-info', 'data-listname': sortableclass, 'data-colorcode': colorcode }));
    $(labelElemDiv).find('.obj-info').hide();

    var labeltext = '';
    if (sortableclass == 'sortableForRelFields1') {
        labeltext = $("#priName").text();
    }
    else {
        labeltext = $('#' + sortableclass).parents('.list-toggle-div-wrap').find('.objName').text();
    }
    if (!isNullOrEmpty(labeltext)) {
        $(labelElemDiv).find('.obj-info').html('From: ' + labeltext);
    }
}
function resetFlexInputElements() {

    $('.formFieldUl li .fieldDiv>input[type="textbox"]').each(function (i, inputElement) {

        var attrDataFlexControl = $(inputElement).attr('data-flexcontrol');
        if (typeof attrDataFlexControl !== typeof undefined && attrDataFlexControl !== false && attrDataFlexControl != '') {
            switch (attrDataFlexControl) {
                case "integer-starrating":
                    var noofitems = $(inputElement).attr('data-flex-max');
                    var minlabel = $(inputElement).attr('data-flex-minlabel');
                    var maxlabel = $(inputElement).attr('data-flex-maxlabel');

                    setRatingInput($(inputElement), noofitems, minlabel, '', maxlabel, attrDataFlexControl);

                    break;
                case "integer-npsrating":
                    var minlabel = $(inputElement).attr('data-flex-minlabel');
                    var maxlabel = $(inputElement).attr('data-flex-maxlabel');
                    var middlelabel = $(inputElement).attr('data-flex-middlelabel');
                    setRatingInput($(inputElement), '', minlabel, middlelabel, maxlabel, attrDataFlexControl);

                    break;
                case "integer-matrixlikert":
            
                    resetMatrixInput($(inputElement),false,false,true);
                    break;
                default:
                    break;
            }
        }
        $(inputElement).parents('.fieldDiv').find('.ff-currency').remove();
        $(inputElement).parents('.fieldDiv').find('.ff-percent').remove();
        var vatttype = $(inputElement).attr('vatt');
        if (!isNullOrEmpty(vatttype) && vatttype.indexOf('CURRENCY') >= 0) {
            var currencylabel = $(inputElement).attr('data-currencylabel');
            if (isNullOrEmpty(currencylabel)) {
                currencylabel = '$';
            }
            $(inputElement).parents('.fieldDiv').prepend("<div class='ff-currency'>" + currencylabel + "</div>");

        }
        else if (!isNullOrEmpty(vatttype) && vatttype.indexOf('PERCENT') >= 0) {
            var percentlabel = $(inputElement).attr('data-percentlabel');
            if (isNullOrEmpty(percentlabel)) {
                percentlabel = '%';
            }
            $(inputElement).parents('.fieldDiv').append("<div class='ff-percent'>" + percentlabel + "</div>");

        }
    });
}

function overFormItemSectionReorderMatrixPlaceHolder(sortableEvent, ui){
    console.log('[overFormItemSectionReorderMatrixPlaceHolder] starts...');
    var placeholderInsideMatrix = $(sortableIDForMatrixSection).find('.ui-sortable-placeholder.ui-state-highlight');

    // when Matrix is the last field and we try to move the last field outside of matrix, is extremally hard, 
    // this code removes the Placeholder from matrix and adds it as next field after matrix.
    if(placeholderInsideMatrix.length > 0){
        var matrixSection = $(placeholderInsideMatrix).parents('.matrix-section-container');
        var isMatrixLastField = matrixSection.next().length == 0;
        
        if(isMatrixLastField){
            console.log('[overFormItemSectionReorderMatrixPlaceHolder] moving placeholder outside of matrix.');
        	$(matrixSection).after(placeholderInsideMatrix);    
        }
    }
}

function setDragAndDropToDisable(ui){
    console.log('[setDragAndDropToDisable] Setting as restricted.');
    ui.helper.addClass('ui-restricted');
    ui.item.addClass('ui-restricted');
}

function blockDragAndDropInMatrixSection(sortableEvent, ui){
    if(ui.item.attr('data-otype') != 'ONumeric' || 
        !isFieldGoodToDrop(sortableEvent, ui) || 
        !isFieldInSameFormSection(ui.item)){
        return true;
    }

    return false;
}

function makeMatrixSortable() {
    $(sortableIDForMatrixSection).sortable({
        items: '> li:not(.sectionLi)',
        cancel: 'select,option,textarea,input,.isFieldEdit,.editDelDiv',
        placeholder: 'ui-state-highlight',
        dropOnEmpty: true,
        revert: 300,
        zIndex: 1004,
        connectWith:
            sortableIDForObjectFieldSearchMenu +
            ',' +
            sortableIDForFormItemSection +
            ',' +
            sortableIDForMatrixSection,
        receive: function(sortableEvent, ui) {
            console.log('[makeMatrixSortable.receive]...');

            if(blockDragAndDropInMatrixSection(sortableEvent, ui)){
                $(this).sortable("cancel");
                if(ui.sender){
                    ui.sender.sortable("cancel");
                }
                return;
            }
        },
        activate: function(sortableEvent, ui) {
            console.log('[makeMatrixSortable.activate]...');
        },
        deactivate: function(sortableEvent, ui) {
            console.log('[makeMatrixSortable.deactivate]...');
        },
        update: function(sortableEvent, ui) {
            console.log('[makeMatrixSortable.update]...');

            if(blockDragAndDropInMatrixSection(sortableEvent, ui)){
                return;
            }

            // create matrix field when field come from same form
            createMatrixOnReceive(sortableEvent, ui);

            // update matrix when matrix field move in/between matrix
            movingFieldInMatrixSectionOnUpdate(sortableEvent, ui);

            // destroy matrix field when it's drop out side of matrix
            destroyMatrixOnReceive(ui.item);
        },
        out: function(sortableEvent, ui) {
            console.log('[makeMatrixSortable.out]...');
        },
        over: function(sortableEvent, ui) {
            console.log('[makeMatrixSortable.over]...');

            if(ui.item.attr('data-otype') != 'ONumeric' || 
               !isFieldGoodToDrop(sortableEvent, ui)){
                setDragAndDropToDisable(ui);
            }

        },
        start: function(sortableEvent, ui) {
            console.log('[makeMatrixSortable.start]...');
            // Add start with to track the drop point for matrix
            trackMatrixOnStart(sortableEvent, ui);
        },
        stop: function(sortableEvent, ui) {
            console.log('[makeMatrixSortable.stop]...');
        },
        sort: function(sortableEvent, ui) {
            console.log('[makeMatrixSortable.sort]...');

            if (isNumberFieldForMatrix(ui) == false || 
                !isFieldGoodToDrop(sortableEvent, ui)) {
                setDragAndDropToDisable(ui);
            }
        }
    });
}

function isNumberFieldForMatrix(ui){
    var isNumeric, hasMatrixParent;
    hasMatrixParent = ui.item.parents('.matrix-section').length > 0 ? true : false;
    isNumeric = ui.item.attr('data-otype') == 'ONumeric' ? true : false;
    if (hasMatrixParent && !isNumeric) {
        return false;
    } else {
        return true;
    }
}

function getElementIDFromMainFieldElement(mainFieldElement){
    var elementID = $(mainFieldElement).attr('id');
    $(mainFieldElement).each(function (indx, inputElem) {
        if ($(inputElem).attr('type') != 'hidden') {
            elementID = $(inputElem).attr('id');
        }
    });
    return elementID;
}

function getNewElementId(pElementId, pColorBar, pWithoutDot){
    var finalElemId = pElementId;
    if(pColorBar != ''){
        finalElemId = pElementId.substring(0, pElementId.lastIndexOf('.'));
        finalElemId = finalElemId + '.' + pColorBar + '.' + pElementId.substring(pElementId.lastIndexOf('.') + 1);
    }

    if(pWithoutDot){
        finalElemId = finalElemId.replace(/\./g, '');
    }
    return finalElemId;
}

function changeElementIDandNameFromMainFieldElement(pElementID, pMainFieldElement, pIsParentCanvas){
    if (!pIsParentCanvas) {
        $(pMainFieldElement).each(function (indx, inputElem) {
            if ($(inputElem).attr('type') == 'hidden') {
                $(inputElem).attr('id', pElementID + 'hidden');
                $(inputElem).attr('name', pElementID + 'hidden');
            }
            else {
                $(inputElem).attr('id', pElementID);
                $(inputElem).attr('name', pElementID);
            }
        });
    }
}

function processDragAndDropFieldForChildAndLookup(ui, isParentCanvas){
    console.log('[processDragAndDropFieldForChildAndLookup] starts...');

    var ListMainVarRel = ui.sender.parents('.list-toggle-div-wrap');
    var sortableFieldClassName = $(ListMainVarRel).find('ul.dropfields').attr('id');
    var colorBar = safeStringValue($(ListMainVarRel).attr('data-childclass'), '');
    ui.item.find('.labelDiv').removeAttr('style');
    ui.item.removeAttr('style');

    var mainFieldElement = ui.item.find('.fieldDiv').find('>select,>input,input.ff-input-type,input[type=hidden],>textarea');
    var elemId = getElementIDFromMainFieldElement(mainFieldElement);
    var finalElemId = getNewElementId(elemId, colorBar, false);
    var elemIdWODot = getNewElementId(elemId, colorBar, true);

    if (colorBar != undefined && colorBar != '') {
        addObjectInfoOnLabel(ui.item.find('>div.labelDiv'), sortableFieldClassName, colorBar);

        ui.item.addClass(colorBar);
        ui.item.find('.editImg').attr('onclick', "openEditDialog(this,'field');");

        changeElementIDandNameFromMainFieldElement(finalElemId, mainFieldElement, isParentCanvas);

    } else {
        RemoveAllClassColorCodes(ui.item);
        addObjectInfoOnLabel(ui.item.find('>div.labelDiv'), sortableFieldClassName, '');
        var midName = '';
        var str = elemId;
        var idArr = str.split('\.');
        if (idArr.length > 2) {
            midName = idArr[1];
        }
        $("#sortableForRelFields1").find('li').each(function () {
            if (isNullOrEmpty($(ListMainVarRel).attr('data-ischild'))) {
                if (($(this).attr("title") == "REFERENCE" || $(this).attr("title").match(/\(Lookup\)$/g) != null) && 
                    $(this).find('div.labelDiv').attr('lblname') == $(ListMainVarRel).find('.objName').text().substring(0, $(ListMainVarRel).find('.objName').text().indexOf('(') - 1)) {
                    midName = $(this).find('>div:first-child label').attr('id').replace('lbl', '');
                }
            }
        });

        var priObj = str.substring(0, str.indexOf('.') + 1);
        var fldObj = str.substring(str.lastIndexOf('.'));
        var inputIdStr = priObj + midName + fldObj;

        changeElementIDandNameFromMainFieldElement(inputIdStr, mainFieldElement, isParentCanvas);
    }

    ui.item.attr('id', 'lblli' + elemIdWODot);
    ui.item.addClass(sortableFieldClassName);
    if (getSafeBoolean($(mainFieldElement).attr('data-isdefaultreq'), false)) {
        $(mainFieldElement).attr('data-isrequired', true);
        ui.item.find('.deleteField').remove();
        ui.item.find('.labelDiv .ff-required-mark').remove();
        ui.item.find('.labelDiv .ff-label').after($('<span/>', { 'class': 'ff-required-mark', 'html': '*' }));
    }

    if (ui.item.find('.labelDiv .ff-label').length > 0) {
        ui.item.find('.labelDiv .ff-label').attr('ondblclick', "editFFLabel(this);");
    }
}

/* MakeMulti page form sortable*/
function makeMultiPageFormSortable(fmEditEnabled, onlyProfEnterprise, onlyEnterpriseEdit) {
    console.log('in   makeMultiPageFormSortable ');

    makeMatrixSortable();

    $(sortableIDForFormItemSection).sortable({
        items: "> li:not(.sectionLi)",
        connectWith: 
            sortableIDForObjectFieldSearchMenu
            + ',' + 
            sortableIDForFormItemSection
            + ',' + 
            sortableIDForMatrixSection,
        dropOnEmpty: true,
        zIndex: 1003,
        cancel: 'select,option,textarea,input,.isFieldEdit,.editDelDiv',
        revert: 300,
        placeholder: 'ui-state-highlight',
        receive: function (ev, ui) {
            console.log('[sortableIDForFormItemSection.receive]...');
            goToNextTourStop();
            var isParentCanvas = false;
            var isSectionRepeatItem = false;
            var isAllowed = true;
            
            // ui-restricted is added by our logic on 'over' and 'sort' events based on some conditions
            if (ui.item.hasClass("ui-restricted")) {
                isAllowed = false;
                ui.item.removeClass("ui-restricted");
                ui.sender.sortable("cancel");
            }

            // Exist the receive function when matrix section is moving
            // Or when we move from matrix to FormFieldSection, 
            // On destroy we have build the field, don't need to go through this receive.
            if(ui.item.hasClass("matrix-section-container") || 
               ui.item.hasClass("matrix-field") ||
               (ui.sender != null && ui.sender && $(ui.sender).parents('.matrix-section-container').length > 0)){
                return;
            }

            if (ui.sender === null) {
                isParentCanvas = true;
            }

            if (isAllowed && !isParentCanvas && ui.sender && $(ui.sender).parents('.list-toggle-div-wrap').length > 0) {
                if ($(ui.sender).parents('.list-toggle-div-wrap').hasClass('repeat')) {
                    isSectionRepeatItem = true;
                }
            }

            console.log('Recieving li item on sortable recieve event');
            var validField = true;

            if (ui.item.hasClass("Ulbtn") || ui.item.hasClass("lbl") || ui.item.hasClass("sectionHeader")) {
                alert('Oops! Fields can only be added to sections. Please drop your field into an section or create a new section.');
                ui.sender.sortable("cancel");
                validField = false;
            }

            if (fmEditEnabled) {
                if (ui.sender && ui.sender.parents('.list-toggle-div-wrap').length > 0 && ui.sender.attr('id') != 'sortableForRelFields1' && ui.sender.attr('id') != 'generalSortableForFields') {
                    console.log(' Sender List id- ' + ui.sender.attr('id'));
                    upgradeNowMessage('Multi-object forms are only available for paid subscriptions..', '', '');
                    ui.sender.sortable("cancel");
                    validField = false;
                }
                else if (ui.sender && ui.sender.parents('.list-toggle-div-wrap').length > 0 && ui.sender.attr('id') == 'sortableForRelFields1') {
                    var objname = ui.sender.parents('.list-toggle-div-wrap').find('span.objName').text();
                    var vatt = ui.item.find('>div:first-child > label').attr('vatt');
                    if ($.inArray(objname, validObjects()) < 0) {
                        upgradeNowMessage("Only Case, Account, Contact and Lead fields are available in Fast Forms free edition.", "", "");
                        ui.sender.sortable("cancel");
                        validField = false;
                    }
                    else if (!isNullOrEmpty(vatt) && vatt == 'REFERENCE') {
                        upgradeNowMessage("Reference fields are only available for paid subscriptions.", "", "");
                        ui.sender.sortable("cancel");
                        validField = false;
                    }
                }
            }

            if (isAllowed) {
                //Run this code whenever an item is dragged and dropped into this list 
                if (validField) {
                    if (ui.sender && isSectionRepeatItem) {
                        $(ev.target).parents('.formSectionUl').addClass('section-repeat');
                        $(ev.target).parents('.formSectionUl').attr('data-sortableclass', ui.sender.attr("id"));
                        $(ev.target).parents('.formSectionUl').attr('data-childclass', ui.sender.parents('.list-toggle-div-wrap').attr('data-childclass'));
                    }
                    console.log(' Drag and drop Item lentgh -' + ui.item.length);
                    var isGen = false;
                    ui.item.removeAttr('style');
                    if (ui.item.length > 0) {


                        var itemid = ui.item.attr('id');
                        //var str ='';  
                        var ispaymentfield = false;
                        var isESignaturefield = false;
                        itemid = safeLegacyPAYPALPAYMENT(itemid);
                        if (itemid !== undefined && itemid.indexOf('FASTFORMSPAYMENT') > 0) {
                            ispaymentfield = true;
                        }
                        else if (itemid !== undefined && itemid.indexOf('ESIGNATURE') > 0) {
                            isESignaturefield = true;
                        }
                        if (ispaymentfield) {
                            ui.item.find('.payment-item-header').hide();

                            $(ui.item.find('.payment-item-row')).each(function (i, ppitemrow) {

                                if (!$(ppitemrow).hasClass('pp-default-hide')) {
                                    $(ppitemrow).find('.PPGeneralFieldDiv').show();
                                    $(ppitemrow).show();
                                }
                                // $(ppitemrow).find('.PPGeneralFieldDiv').css('width','40%');

                            });
                            ui.item.find('.alert-payment-setup').show();

                        }
                        else if (isESignaturefield) {
                            ui.item.find('.ffd-esignature').html($('#DocSignHTMLTemp').html());
                            isGen = true;
                        }
                        else {
                            ui.item.find('div').show();
                        }

                        ui.item.removeClass('tooltip');
                        $(".formUlLabel").children().removeClass('ui-state-default');
                        ui.item.find('.deleteField').show();
                        var dropLiId = ui.item.attr('id');
                        ui.item.removeClass('ui-state-default');

                        // str = str.substring(0, str.indexOf("."));
                        ui.item.removeAttr('style');
                        if (ui.sender && ui.sender.hasClass('formUlLabel') && ui.item.find('.fieldDiv').find('>select,>:input').length > 0) {
                            if (ui.item.find('.fieldDiv').find('>select').length > 0) {
                                var controlType = ui.item.find('.fieldDiv').find('>select').attr('data-flexcontrol');
                                if (controlType !== undefined && controlType != '') {
                                    if (controlType.indexOf('picklist-radiobutton') >= 0) {
                                        var alignment = controlType.replace('picklist-radiobutton', '');
                                        reinitializeSelectToRadioElement(controlType, ui.item.find('.fieldDiv'), false, false, 'ff-ext-radio', alignment);
                                    }
                                    else if (controlType.indexOf('multipicklist-checkbox') >= 0) {
                                        var alignment = controlType.replace('multipicklist-checkbox', '');
                                        reinitializeSelectToRadioElement(controlType, ui.item.find('.fieldDiv'), false, false, 'ff-ext-radio', alignment);
                                    }
                                    else if (controlType = 'picklist-combobox') {
                                        destroySelect2(ui.item.find('.fieldDiv'));
                                        ui.item.find('.fieldDiv').find('>select').select2();
                                    }
                                    else {

                                    }
                                }
                            }
                            else if (ui.item.find('.fieldDiv').find('>:input[type="textbox"]').length > 0) {

                                var controlType = ui.item.find('.fieldDiv').find('>:input[type="textbox"]:first').attr('data-flexcontrol');
                                var attrDataFlexControl = ui.item.find('.fieldDiv').find('>:input[type="textbox"]:first').attr('data-flexcontrol');
                                if (typeof attrDataFlexControl !== typeof undefined && attrDataFlexControl !== false && attrDataFlexControl != '') {
                                    switch (attrDataFlexControl) {
                                        case "integer-starrating":
                                            reinitializeRatingElement(ui.item.find('.fieldDiv'));
                                            break;
                                        case "integer-npsrating":
                                            reinitializeRatingElement(ui.item.find('.fieldDiv'));
                                            break;
                                        default:
                                            setRatingInput(ui.item.find('.fieldDiv'), '', '', '', '', attrDataFlexControl);
                                            break;
                                    }
                                }
                            }
                        }
                        ui.item.unbind();

                        var sortableFieldClassName = '';
                        if (ui.sender && ui.sender.attr("id") == 'sortableForRelFields1') {
                            sortableFieldClassName = 'sortableForRelFields1';

                            addObjectInfoOnLabel(ui.item.find('>div.labelDiv'), sortableFieldClassName, '');

                        }
                        else if (ui.sender && ui.sender.attr("id") == 'generalSortableForFields') {
                            sortableFieldClassName = 'generalSortableForFields';
                            ui.item.addClass(sortableFieldClassName);
                        }
                        else if (!isNullOrEmpty(ui.sender.attr("id")) && ui.sender.attr("id").indexOf('sortableForRelFields') >= 0 && ui.sender.hasClass('dropfields')) {
                            processDragAndDropFieldForChildAndLookup(ui, isParentCanvas);
                        }

                        var isPaymentField = false;
                        if (dropLiId == "lblliGENERALTEXT") {
                            var i = Math.floor((Math.random() * 1000) + 1);
                            dropLiId = dropLiId + i;
                            ui.item.attr('id', dropLiId);
                            ui.item.find('.labelDiv label').attr('id', 'lblGENERALTEXT' + i);
                            isGen = true;
                        }

                        if (dropLiId == "lblliIMAGE") {
                            var i = Math.floor((Math.random() * 1000) + 1);
                            dropLiId = dropLiId + i;
                            ui.item.attr('id', dropLiId);
                            ui.item.find('label').attr('id', 'lblIMAGE' + i);
                            ui.item.find('label').hide();
                            isGen = true;
                            ui.item.find('div:first').css('width', '100%');
                            ui.item.addClass('fieldLiImage');
                        }
                        dropLiId = safeLegacyPAYPALPAYMENT(dropLiId);
                        if (dropLiId == "lblliFASTFORMSPAYMENT") {

                            if (!onlyEnterpriseEdit) {
                                upgradeNowMessage('Payment fields are only available in the Enterprise edition of Fast Forms.', '', '');
                                deletePaymentFieldByParentFieldLi(ui.item, true);
                            }

                            if (onlyEnterpriseEdit) {
                                var i = Math.floor((Math.random() * 1000) + 1);
                                dropLiId = dropLiId + i;
                                ui.item.attr('id', dropLiId);
                                var originaldivId = ui.item.find('.field-div-payment').attr('id');
                                ui.item.find('.field-div-payment').attr('id', originaldivId + i);

                                $(ui.item.find('.payment-item-row')).each(function (index, ppitemrow) {

                                    if ($(ppitemrow).hasClass('pp-expiry')) {

                                        var ppexpirylblid = $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id');
                                        ppexpirylblid.replace(i, '');
                                        $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id', ppexpirylblid + i);
                                        $($(ppitemrow).find('select')).each(function (index, ppitemrowselect) {
                                            var orginalselElemId = $(ppitemrowselect).attr('data-pp-name');
                                            $(ppitemrowselect).attr('id', orginalselElemId + i);
                                            $(ppitemrowselect).attr('name', orginalselElemId + i);
                                        });
                                    }
                                    else {
                                        var orginalElemId = $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('data-pp-name');
                                        orginalElemId = orginalElemId;
                                        $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('id', orginalElemId + i);
                                        $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('name', orginalElemId + i);
                                        $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id', 'lbl' + orginalElemId + i);
                                    }

                                });
                                isPaymentField = true;
                                isGen = true;
                            }
                        }

                        if (dropLiId == "lblliCAPTCHA") {
                            var i = Math.floor((Math.random() * 1000) + 1);
                            dropLiId = dropLiId + i;
                            ui.item.attr('id', dropLiId);
                            ui.item.find('.labelDiv label').attr('id', 'lblCAPTCHA' + i);
                            ui.item.find('.fieldDiv .ff-type-captcha').attr('id', 'Captcha' + i);
                            isGen = true;
                        }

                        if (dropLiId == "lblliFILEUPLOADAREA") {

                            if (!onlyProfEnterprise) {
                                upgradeNowMessage('File uploads are only available in Professional or Enterprise editions of Fast Forms.', '', '');
                                deleteFieldByParentFieldLi(ui.item, true);
                            }

                            if (onlyProfEnterprise) {
                                var i = Math.floor((Math.random() * 1000) + 1);
                                dropLiId = dropLiId + i;
                                ui.item.attr('id', dropLiId);
                                dragAndDropGenericFileUploadFieldEvent(i, ui.item);
                                isGen = true;
                            }
                        }

                        if (/RecordTypeId/i.test(dropLiId)) {
                            ui.item.find('label').addClass('grayLabel');
                        }

                        var editDelDivHtml = '<div class="editDelDiv">';

                        if (ui.item.find('.deleteField').length == 0 && ui.item.find('.editImg').length == 0) {

                            if (isGen) {
                                if (isPaymentField) {
                                    editDelDivHtml += '<img class="editImg" src="' + imgUrl + '" onclick="openEditPaymentDialog(this);" />';
                                    editDelDivHtml += '<img id="' + dropLiId + '" src="' + deleteImgUrl + '" class="deleteField" onclick="deletePaymentField(this,true);"/>';
                                }
                                else if (isESignaturefield) {
                                    editDelDivHtml += '<img class="editImg" src="' + imgUrl + '" onclick="openEditSignatureDialog(this);" />';
                                    editDelDivHtml += '<img id="' + dropLiId + '" src="' + deleteImgUrl + '" class="deleteField" onclick="deleteSignatureField(this,true);"/>';
                                }
                                else {
                                    editDelDivHtml += '<img class="editImg" src="' + imgUrl + '" onclick="openEditDialog(this,\'field\');" />';
                                    editDelDivHtml += '<img id="' + dropLiId + '" src="' + deleteImgUrl + '" class="deleteField" onclick="deleteField(this,true);"/>';
                                }
                            } else {
                                editDelDivHtml += '<img class="editImg" src="' + imgUrl + '" onclick="openEditDialog(this,\'field\');" />';
                                editDelDivHtml += '<img id="' + ui.item.attr('id') + '" src="' + deleteImgUrl + '" class="deleteField" onclick="deleteField(this,true);"/>';
                            }
                        }
                        editDelDivHtml += '</div >';
                        if (isPaymentField) {
                            ui.item.find('.editDelDiv').remove();
                            ui.item.find('.field-div-payment').append(editDelDivHtml);
                        }
                        else if (isESignaturefield) {
                            if (!onlyEnterpriseEdit) {
                                upgradeNowMessage('Signature fields are only available in the Enterprise edition of Formstack.', '', '');
                                deleteFieldByParentFieldLi(ui.item, true);
                            }
                            if (onlyEnterpriseEdit) {
                                if (!isParentCanvas) {
                                    var signatureIndex = Math.floor((Math.random() * 1000) + 1);
                                    dropLiId = dropLiId + signatureIndex;
                                    ui.item.attr('id', dropLiId);
                                    var eSignatureId = dropLiId.replace('lblli', '');
                                    ui.item.append(editDelDivHtml);
                                    ui.item.find('.labelDiv').hide();
                                    ui.item.find('.eSignatureFieldDiv').attr('id', 'field' + eSignatureId);
                                    ui.item.find('.eSignatureFieldDiv .ffd-esignature-input').attr('id', 'input' + eSignatureId);
                                    ui.item.find('.eSignatureFieldDiv').show();
                                    ui.item.find('.eSignatureFieldDiv .ffd-esignature').show();
                                    ui.item.find('.eSignatureFieldDiv .main-docsign-wrapper').attr('id', 'elem' + eSignatureId);
                                    assignSignatureElementIds(ui.item, signatureIndex);

                                    setDefaultSignatureElementValues(ui.item.find('.eSignatureFieldDiv .ffd-esignature-input'));
                                    resetPDFRequiredOption(true);
                                }
                                resetESignatureElement(ui.item, false);
                            }
                        }
                        else {

                            if (ui.item.find('.labelDiv .ff-label').length > 0) {
                                ui.item.find('.labelDiv .ff-label').attr('ondblclick', "editFFLabel(this);");
                            }
                            if (!isParentCanvas) {
                                ui.item.append(editDelDivHtml);
                            }
                        }
                        if (ui.item.find('.fieldDiv').find('>select,>input,input.ff-input-type,>textarea').length > 0) {
                            setCurrencyOrPercentLabels(ui.item.find('.fieldDiv').find('>select,>input,input.ff-input-type,>textarea'));
                        }
                        if (!isParentCanvas) {
                            addRequiredOnLabel(ui.item);
                        }
                        if (isFirstTimeFormEdit == "true") {
                            $(".dragDropInfoDiv").hide();
                            $(".arrowUpper").hide();
                            $(".addNewSection").css('margin-top', '0%');
                        }

                        if (ui.sender && ui.sender.attr('id') == 'labelformUlForAddNewSection') {

                            var bottomMostSection = $("#parentUlForm [id^='labelformUl']:not(#labelformUlForAddNewSection)").last();
                            $(bottomMostSection).append($("#labelformUlForAddNewSection").html());
                            $("#labelformUlForAddNewSection").html('');
                        }
                    }

                    $(this).parent().find('.ui-sortable-placeholder').removeClass('addNewSectionIcon');
                    $(this).parent().find('.ui-sortable-placeholder').remove('plusIcon');
                    setHover();

                    var metadata = {
                        field_name: dropLiId
                    };
                    Intercom('trackEvent', 'added-field', metadata);
                }
            }/*isAllowed ends */
        },
        activate: function (event, ui) {
            console.log('[sortableIDForFormItemSection.activate]...');
            ui.item.css('height', 'auto');
        },
        deactivate: function (event, ui) {
            console.log('[sortableIDForFormItemSection.deactivate]...');
            resetSavedButton();
            $('#addSectionPlus').hide();
            ui.item.removeClass('grabCursor');
        },
        update: function(event,ui){
            console.log('[sortableIDForFormItemSection.update]...');
        },
        out: function(event,ui){
            console.log('[sortableIDForFormItemSection.out]...');
        },
        over: function (event, ui) {
            console.log('[sortableIDForFormItemSection.over]...');
            
            overFormItemSectionReorderMatrixPlaceHolder();

            var isNumeric, hasMatrixParent;
            hasMatrixParent = (ui.item.parents('.matrix-section').length > 0) ? true : false;
            isNumeric = (ui.item.attr('data-otype') == 'ONumeric') ? true : false;
            var isFieldGood = false;
            var isParentCanvas = false;
            if (ui.sender === null || ui.item.parent().hasClass('formFieldUl')) {
                // it means we are moving fields on edit form tab between sections, not adding from field list from right side panel
                isParentCanvas = true;
            }
            if (isParentCanvas) {
                // Source is Form Canvas (i.e. Edit Form tab section)
                if ($(event.target).parents('.formSectionUl').attr('id') == ui.item.parents('.formSectionUl').attr('id')) {
                    // moving field between same section (including repeatable section)
                    isFieldGood = true;
                } else if (ui.item.parents('.formSectionUl').hasClass('section-repeat')) {
                    // field's source element is repeated section i.e. 
                    // moving repeatable section field to to any other section
                    isFieldGood = false;
                } else if ($(event.target).parents('.formSectionUl').hasClass('section-repeat')) {
                    // field's source element is repeated section i.e. 
                    // moving any field to a repeatable section
                    isFieldGood = false;
                } else {
                    console.log('FORM isParentCanvas 4');
                    isFieldGood = true;

                }

            } else {
                /*if Source is available field list*/
                var senderUlId = '';
                if (ui.sender) { senderUlId = ui.sender.attr('id'); }
                console.log('senderUlId ' + senderUlId);
                if ($(event.target).parents('.formSectionUl').find('li.fieldLi:not(.ui-sortable-placeholder)').length == 0) {
                    if ($('.formSectionUl.section-repeat[data-sortableclass="' + senderUlId + '"]').length > 0) {
                        isFieldGood = false;
                        console.log('FORM Section repeat already exist');
                    } else {
                        isFieldGood = true;
                    }
                } else {
                    isFieldGood = isFieldGoodToDrop(event, ui);
                }
            }
            
            if (!isFieldGood && $(event.target).parents('.formSectionUl').length > 0 && $.inArray(safeStringValue($(ui.item).attr('data-otype'), ''), availableGenFieldsInRepSecArr) < 0) {
                setDragAndDropToDisable(ui);
            } else {
                ui.helper.removeClass('ui-restricted');
                ui.item.removeClass('ui-restricted');
            }
            
            if (ui.helper.hasClass('ui-restricted')) {
                $(this).parent().find('.ui-sortable-placeholder').addClass('restricted-placeholder');
            } else {
                $(this).parent().find('.ui-sortable-placeholder').removeClass('restricted-placeholder');
            }
        },
        start: function(event, ui){
            console.log('[sortableIDForFormItemSection.start]...');
            // add start with to track the drop point for matrix
            trackMatrixOnStart(event, ui);
        },
        stop: function(event, ui){
            console.log('[sortableIDForFormItemSection.stop]...');
            trackMatrixOnStop(event, ui);
        },
        sort: function(event, ui){
            console.log('[sortableIDForFormItemSection.sort]...');
        }

    });
}

function isFieldGoodToDrop(sortableEvent, ui){
    if(ui.sender == null){
        return true;
    }
    
    var isFieldGood = false;
    var targetSortableClass = $(sortableEvent.target).parents('.formSectionUl').attr('data-sortableclass');
    var isTargetRepeatable = $(sortableEvent.target).parents('.formSectionUl').hasClass('section-repeat');
    var senderFormSection = ui.sender.parents('.formSectionUl');
    var senderObjectFieldSearchMenu = ui.sender.parents('.list-toggle-div-wrap');

    var isSenderRepeatable = false;
    var isSenderFromObjectFieldSearchMenu = senderObjectFieldSearchMenu.length > 0;
    var isSendFromFormSection = senderFormSection.length > 0;
    var senderSortableClass = '';
    if(isSenderFromObjectFieldSearchMenu){
        isSenderRepeatable = senderObjectFieldSearchMenu.hasClass('repeat');
        senderSortableClass = ui.sender.attr('id');
    } else if(isSendFromFormSection){
        isSenderRepeatable = senderFormSection.hasClass('section-repeat');
        senderSortableClass = senderFormSection.attr('data-sortableclass');
    }

    if (isTargetRepeatable && isSenderRepeatable && senderSortableClass == targetSortableClass) {
        isFieldGood = true;
    } else if (!isTargetRepeatable && !(isSenderRepeatable)) {
        isFieldGood = true;
    } else {
        if ($(sortableEvent.target).parents('.formSectionUl').find('li.fieldLi:not(.ui-sortable-placeholder)').length == 0) {
            isFieldGood = true;
        } else {
            isFieldGood = false;
        }
    }

    return isFieldGood;
}

/**
 * @description When we move fields around within Regular Section (ul.formSectionUl)
 * @todo move all sortableEvent to one place
 * @param {*} ui 
 */
function sortableFieldSortEvent(ui){
    var isAllowed = true;
    if (ui.placeholder.parents('.formSectionUl').attr('id') != ui.item.parents('.formSectionUl').attr('id')) {
        // source and target formSectionUl is different
        if(ui.item.parents('.formSectionUl').hasClass('section-repeat') || ui.placeholder.parents('.formSectionUl').hasClass('section-repeat')){
            // if we are adding a field to repeatable or moving from repeatable
            isAllowed = false;
        }
        if (!isAllowed && $.inArray(safeStringValue($(ui.item).attr('data-otype'), ''), availableGenFieldsInRepSecArr) >= 0) {
            // if item is general field then make it droppable
            isAllowed = true;
        }
    }
    if ((ui.placeholder.parents('.matrix-section').length > 0) && !(ui.item.attr('data-otype') == 'ONumeric')) {
        isAllowed = false;
    }
    if (isAllowed){
        ui.helper.removeClass('ui-restricted');
        ui.item.removeClass('ui-restricted');
        ui.placeholder.removeClass('ui-restricted');
    }else{
        ui.placeholder.addClass('ui-restricted');
        ui.helper.addClass('ui-restricted');
        ui.item.addClass('ui-restricted');
    }
}
/* matrix helper  start*/
// FormUl-Matrix logic  0-1 
// dependent on the parent item we will do a digital math 01 AND logic to move items between formUI and matrix
// we will consider the start point and the update 
// start - over - update - deactive - stop = result
//  0              0                         movment inside formFieldUl
//  0              1                         moving from formFieldUl to Matrix = Create matrix if numaric OR moving from list-toggle-div to matrix
//  1              0                         moving from matrix to formFieldUl = destroy if matrix 
//  1              1                         movment inside matrix   
//will use start-with Attr to know from where the field came from

function trackMatrixOnStart(event, ui) {
    console.log('[trackMatrixOnStart] Starts...');
    var isNumeric = (ui.item.attr('data-otype') == 'ONumeric') ? true : false;
    
    // creates a temporary attribute on the element with the old index
    if (!isNumeric) {
        return;
    }
    
    var hasMatrixParent = (ui.item.parents('.matrix-section').length > 0) ? true : false;
    var isFromFieldSearchPanel = ui.item.parents('.list-toggle-div').length > 0 ? true : false;
    
    // By default is from FormBuilder.
    var startWithClass = 'formFieldUl'; 
    if(isFromFieldSearchPanel){
        startWithClass = 'list-toggle-div';
    } else if(hasMatrixParent){
        startWithClass = 'matrix-section';
    }
    
    $(ui.item).attr('data-previndex', ui.item.index());
    try {
        $(ui.item).attr('data-startwith', startWithClass);
        if(hasMatrixParent){
            $(ui.item).attr('data-prevdatamatrix', ui.item.attr('data-matrix').split('.')[0]);    
        }
    } catch (error) {
        console.log('Error unexpected! Method[trackMatrixOnStart] Ex[Below]');
        console.log(error)
    }
    console.log('start : ' + ui.item.index());
}

function trackMatrixOnStop(event, ui) {
    console.log('[trackMatrixOnStop] Starts...');

    var isNumeric, hasMatrixParent;
    hasMatrixParent = (ui.item.parents('.matrix-section').length > 0) ? true : false;
    isNumeric = (ui.item.attr('data-otype') == 'ONumeric') ? true : false;

    if (hasMatrixParent && !isNumeric) {
        return;
    }

    $(ui.item).attr('data-previndex', ui.item.index());
    try {
        if(hasMatrixParent){
            $(ui.item).attr('data-prevdatamatrix', ui.item.attr('data-matrix').split('.')[0]);
        }
    } catch (error) {
        console.log('Error unexpected! Method[] Ex[Below]');
        console.log(error);
    }
}

function createMatrixOnReceive(event, ui) {
    // moving from formFieldUl to Matrix = Create matrix if numeric OR moving from list-toggle-div to matrix
    console.log('[createMatrixOnReceive] Starts...');
    var startWithClass =  $(ui.item).attr('data-startwith');
    var newIndex = ui.item.index();
    var isNumeric, hasMatrixParent;
    hasMatrixParent = (ui.item.parents('.matrix-section').length > 0) ? true : false;
    isNumeric = (ui.item.attr('data-otype') == 'ONumeric') ? true : false;

    // cancel drop if it's not a number
    if (hasMatrixParent && !isNumeric) {
        if (ui.sender != null) {
            console.log('[createMatrixOnReceive] cancelling the drop...');
            ui.sender.sortable("cancel");
            return;
        } else {
            return;
        }
    }

    if ((startWithClass == 'formFieldUl' || startWithClass == 'list-toggle-div') && isNumeric && hasMatrixParent){

        // check if the received item have matrix-field attr
        // true -> check if section id match
        // false destroy field and recreate to matrix with isNew:true if numeric 
        var inputElem;
        var litem = $(ui.item);
        // isNumeric = false;
        inputElem = litem.find('.fieldDiv').find('input');

        //  prepare field for the form 
        // if sender from field list
        if (startWithClass == 'list-toggle-div') {

            if (ui.sender && ui.sender.attr("id") == 'sortableForRelFields1') {
                inputElem.parent().removeAttr('style');
                addObjectInfoOnLabel(litem.find('>div.labelDiv'), 'sortableForRelFields1', '');

            } else if (!isNullOrEmpty(ui.sender.attr("id")) && ui.sender.attr("id").indexOf('sortableForRelFields') >= 0 && ui.sender.hasClass('dropfields')) {
                var isParentCanvas = false;
                if (ui.sender === null) {
                    isParentCanvas = true;
                }
                processDragAndDropFieldForChildAndLookup(ui, isParentCanvas);
            }

            litem = itemAdd(litem);
        }

        if (litem.hasClass('matrix-field')) {
            dataMatrix = litem.attr('data-matrix');

        } else if (isNumeric) {
            var controltype = $(inputElem).attr('data-flexcontrol');
            console.log('[info] createMatrixOnReceive controltype: ' + controltype);
            if (controltype == 'integer-starrating' || controltype == 'integer-npsrating') {
                $(inputElem).ffrating('destroy');
            }

            inputElem.ffmatrix('create', {
                isBuilder: true,
                isNew: true
            });
        }
        
        if(newIndex == 0){
            var  sectionDataMatrix = ui.item.parents('.matrix-section').attr('data-matrix');
            // get old prime from new matrix section 
            // remove prime attr
            $section = $('[data-matrix="' + sectionDataMatrix + '"]');
            $primeItem = $section.find('[data-matrix-isprimary="true"]');
            disablePrimeFromMatrixField ($primeItem);

            // set drag element to prime
            setPrimeMatrixField(ui.item);
        }
    }
}

function movingFieldInMatrixSectionOnUpdate(event, ui) {
    console.log('[movingFieldInMatrixSectionOnUpdate] Start...');
    // logic for matrix fields in matrix sections
    var startWithClass =  $(ui.item).attr('data-startwith');
    var hasMatrixParent = (ui.item.parents('.matrix-section').length > 0) ? true : false;
    var isNumeric = (ui.item.attr('data-otype') == 'ONumeric') ? true : false;
    
    if (startWithClass == 'matrix-section'  && hasMatrixParent && isNumeric) {
        var $primeItem, sectionDataMatrix, $newPrime;
        var newIndex = ui.item.index();

        var oldIndex = $(ui.item).attr('data-previndex');
        var oldSection = $(ui.item).attr('data-prevdatamatrix');
        sectionDataMatrix = ui.item.parents('.matrix-section').attr('data-matrix');
        if (ui.item.parents('.matrix-section').length != 0) {
            if (newIndex == 0 && (oldSection == sectionDataMatrix && oldIndex != 0)) {
                // trigger when move non-prime matrix to prime index
                $primeItem = ui.item.parents('.matrix-section').find('[data-matrix-isprimary="true"]');

                //old prime remove label from prev prime
                disablePrimeFromMatrixField($primeItem);

                //new prime show label, change to prime
                setPrimeMatrixField(ui.item);

            } else if (oldIndex == 0 && newIndex != 0) {
                // trigger when move prime matrix 
                // old prime remove label from prev prime  
                $primeItem =  ui.item.find('.matrix-elem');
                disablePrimeFromMatrixField($primeItem);

                if(oldSection != sectionDataMatrix){
                    // if differnt section
                    // get old section first field and set to prime
                    var dataMatrix = ui.item.find('.matrix-elem').attr('data-matrix').split('.');
                    var $section = $('[data-matrix="' + dataMatrix[0] + '"]');
                    $newPrime = $section.find('.matrix-field:first-child');
                }else{
                    $newPrime = ui.item.parents('.matrix-section').find('.matrix-field:first-of-type');
                }

                //new prime show label and set to prime 
                setPrimeMatrixField($newPrime);

            }
            
            // if it have diferent data-matrix section
            // true then destroy current field and create new matrix field
            // AND
            // check number of matrix field from sender matrix section
            // if zero destroy matrix section
            if (oldSection != undefined && oldSection != sectionDataMatrix) {
                var inputElement = ui.item.find('.matrix-elem');
                $(inputElement).ffmatrix('destroy',{isNeedAttr:false,isBuilder:true});          
                $(inputElement).ffmatrix('create', {
                    isBuilder: true,
                    isNew: true
                });
                                    
                // check number of matrix in section if zero destroy
                var $section = $('[data-matrix="' + oldSection + '"]');
                $section.ffmatrix('removeSectionIf', {});
            }

            if(oldSection != sectionDataMatrix && newIndex == 0){
                // set prime for the first section
                var $section = $('[data-matrix="' + oldSection + '"]');
                $newPrime = $section.find('.matrix-field:first-child');
                setPrimeMatrixField($newPrime);


                // get old prime from new matrix section 
                // remove prime attr
                $section = $('[data-matrix="' + sectionDataMatrix + '"]');
                $primeItem = $section.find('.matrix-field:nth-child(2)').find('.matrix-elem');
                disablePrimeFromMatrixField ($primeItem);

                
                // set drag element to prime (set prime for the second section)
                setPrimeMatrixField(ui.item);
            }
        }
    }
}

function disablePrimeFromMatrixField (item){
    var matrixField = item;
    if($(item).is("input")){
        matrixField = item.parents('.matrix-field');
    }

    matrixField.find('.matrix-elem').attr('data-matrix-isprimary', false);
    matrixField.find('.matrix-elem').attr('data-matrix-label-isshownlabel', false);
    matrixField.find('.matrix-label-container').addClass('custom-flexcontrol-offscreen');
    matrixField.find('.matrix-label-container').removeClass('hasLabel');
    matrixField.find('.matrix-label-container').find('.matrixEditImg').removeClass('editImg');
}
function setPrimeMatrixField(item){
    var matrixField = item;
    if($(item).is("input")){
        matrixField = item.parents('.matrix-field');
    }

    matrixField.find('.matrix-elem').attr('data-matrix-isprimary', true);
    matrixField.find('.matrix-elem').attr('data-matrix-label-isshownlabel', true);
    matrixField.find('.matrix-label-container').removeClass('custom-flexcontrol-offscreen');
    matrixField.find('.matrix-label-container').addClass('hasLabel');
    matrixField.find('.matrixEditImg').addClass('editImg');

    // set Number Of field for the new prime
    matrixField.find('.matrix-elem').ffmatrix('updateNumberOfFields', {});
}

function isFieldInSameFormSection(matrixLiItem){
    var formSectionSourceSortableClass = matrixLiItem.parents('.formSectionUl').attr('data-sortableclass');
    var primaryOrLookupSortableClass = undefined;
    if(formSectionSourceSortableClass === primaryOrLookupSortableClass || matrixLiItem.hasClass(formSectionSourceSortableClass)){
        return true;
    }

    return false;
}

function destroyMatrixOnReceive(liItem) {
    // moving from matrix to formFieldUl = destroy if matrix
    console.log('[destroyMatrixOnReceive] start');

    var startWithClass =  $(liItem).attr('data-startwith');
    var hasformFieldUlParent = (liItem.parents('.formFieldUl').length > 0)? true : false;
    var hasMatrixParent = (liItem.parents('.matrix-section').length > 0)? true : false;
    
    if(startWithClass == 'matrix-section' && hasformFieldUlParent && !hasMatrixParent){
        console.log('[destroyMatrixOnReceive] destroy matrix item on sortable recieve event'); 
        changePrimeMatrixFieldAndDestroy(liItem);
    }
}

function changePrimeMatrixFieldAndDestroy(item) {
    // if the deleted/display type of element is prime
    // get matrix section
    // find the first item in the matrix section
    // set to prime

    var matrixField = item;
    if ($(item).is("input")) {
        matrixField = item.parents('.matrix-field');
    }

    if ($(matrixField).hasClass("matrix-field")) {

        var matrixElem = $(matrixField).find('.matrix-elem');
        console.log('change prime header in matrix section');

        var isprimary = matrixElem.attr('data-matrix-isprimary');
        var dataMatrix = matrixElem.attr('data-matrix').split('.');
        var $section = $('[data-matrix="' + dataMatrix[0] + '"]');
        var $firstitem = $section.find('.matrix-field:first-child');

        if (matrixElem.attr('data-matrix') == $firstitem.attr('data-matrix')) {
            $firstitem = $section.find('.matrix-field:nth-child(2)')
        }

        // if the draged element is prime
        // set second field element to prime
        if (isprimary == 'true' && $firstitem.size() != 0) {
            //new prime show label and set to prime 
            setPrimeMatrixField($firstitem);
        }

        // change to normal textbox
        $(matrixElem).ffmatrix('destroy', {
            isNeedAttr: false,
            isRemoved: true,
            isBuilder:true
        });
    }
}
/* matrix helper end */

/**/
function setCurrencyOrPercentLabels(inputElement) {
    var vatttype = $(inputElement).attr('vatt');
    if (!isNullOrEmpty(vatttype) && vatttype.indexOf('CURRENCY') >= 0) {
        var currencylabel = $(inputElement).attr('data-currencylabel');
        if (isNullOrEmpty(currencylabel)) {
            currencylabel = '$';
        }
        $(inputElement).parents('.fieldDiv').prepend("<div class='ff-currency'>" + currencylabel + "</>");

    }
    else if (!isNullOrEmpty(vatttype) && vatttype.indexOf('PERCENT') >= 0) {
        var percentlabel = $(inputElement).attr('data-percentlabel');
        if (isNullOrEmpty(percentlabel)) {
            percentlabel = '%';
        }
        $(inputElement).parents('.fieldDiv').append("<div class='ff-percent'>" + percentlabel + "</>");

    }
}

function resetMultiPageSortable(fmEditEnabled, onlyProfEnterprise, onlyEnterpriseEdit) {
    console.log('reset resetMultiPageSortable');
    var blockSort = false;
    $(sortableIDForObjectFieldSearchMenu).sortable({
        connectWith: 
            sortableIDForFormItemSection
            + ',' + 
            sortableIDForMatrixSection,
        dropOnEmpty: true,
        revert: 300,
        placeholder: 'ui-state-highlight',
        appendTo: document.body,
        helper: "clone",
        start : function(event,ui){
            console.log('[sortableIDForObjectFieldSearchMenu.start]...');
            // add start with to track the drop point for matrix
            trackMatrixOnStart(event, ui);
        },
        receive: function (event, ui) {
            console.log('[sortableIDForObjectFieldSearchMenu.receive]...');
            var liId = ui.item.attr('id');
            if (getSafeBoolean($('#' + liId + ' .fieldDiv').find('>select,>input,input.ff-input-type,>textarea').attr('data-isdefaultreq'), false)) {
                /// deletefield method added to fix the issue drag and drop issue from main form to fields list [it was adding the dragged item to first list fields]- balinder

                $(this).sortable('cancel');
                if (ui.sender) {
                    $(ui.sender).sortable('cancel');
                }
                showError("<div class='primary'>The field you are attempting to remove is a required field.</div> <br/> <br /><div class='secondary'>Required fields cannot be removed from your form.</div>");

            } else {
                console.log(' Item is removed from canvas');
                deleteFieldByParentFieldLi(ui.item, true);
            }
        },
        activate: function (event, ui) {
            console.log('[sortableIDForObjectFieldSearchMenu.activate]...');
            ui.item.css('height', 'auto');
            ui.item.addClass('grabCursor');
        },
        deactivate: function (event, ui) {
            console.log('[sortableIDForObjectFieldSearchMenu.deactivate]...');
            ui.item.removeClass('grabCursor');
        }
    });

    /* General Fields Sortable */
    var dropCount = 0;
    $(sortableIDForGeneralFieldMenu).sortable({
        connectWith: sortableIDForFormItemSection,
        helper: 'clone',
        appendTo: document.body,
        placeholder: 'ui-state-highlight',
        stop: function (event, ui) {
            console.log('[sortableIDForGeneralFieldMenu.stop]...');
            var $uiItem = $(ui.item);

            if ($uiItem.parent().is('#generalSortableForFields.dropfields')) $uiItem.remove();
            $('#generalFieldBox li').unbind('dblclick');
            $('#generalFieldBox li').dblclick(function () {

                resetSavedButton();
                var isPaymentField = false;
                var isESignaturefield = false;
                var litem = $(this).clone();
                litem = itemAdd(litem);

                var dropLiId = litem.attr('id');
                dropLiId = safeLegacyPAYPALPAYMENT(dropLiId);
                /*following line will append html item to the last section on form canvas */
                // litem.appendTo($("#parentUlForm li:nth-last-child(2) .mainTable tr td ul.formUlLabel"));
                var randomId = Math.floor((Math.random() * 1000) + 1);
                if (dropLiId == "lblliCAPTCHA") {

                    dropLiId = dropLiId + randomId;
                    litem.attr('id', dropLiId);
                    litem.find('label').attr('id', 'lblCAPTCHA' + randomId);
                    litem.find('.labelDiv label').attr('id', 'lblCAPTCHA' + randomId);
                    litem.find('.fieldDiv .ff-type-captcha').attr('id', 'Captcha' + randomId);
                    litem.find('.deleteField').attr('id', 'lblliCAPTCHA' + randomId);
                    litem.find('.fieldDiv').removeAttr('style');

                }
                else if (dropLiId == "lblliGENERALTEXT") {

                    dropLiId = dropLiId + randomId;
                    litem.attr('id', dropLiId);
                    litem.find('.labelDiv label').attr('id', 'lblGENERALTEXT' + randomId);
                    litem.find('.deleteField').attr('id', 'lblliGENERALTEXT' + randomId);

                }
                else if (dropLiId == "lblliIMAGE") {

                    dropLiId = dropLiId + randomId;
                    litem.attr('id', dropLiId);
                    litem.find('label').attr('id', 'lblIMAGE' + randomId);
                    litem.find('.deleteField').attr('id', 'lblliIMAGE' + randomId);
                    litem.find('label').hide();
                    litem.addClass('fieldLiImage');
                }
                else if (dropLiId !== undefined && dropLiId.indexOf('ESIGNATURE') > 0) {
                    if (!onlyEnterpriseEdit) {
                        upgradeNowMessage('E-Signature fields are only available in the Enterprise edition of Fast Forms.', '', '');
                        deleteSignatureField(litem, true);

                    }
                    else {
                        isESignaturefield = true;
                        signatureIndex = randomId;
                        dropLiId = dropLiId + signatureIndex;
                        litem.attr('id', dropLiId);
                        var eSignatureId = dropLiId.replace('lblli', '');

                        //litem.removeClass('grabCursor');
                        litem.addClass('generalSortableForFields');
                        litem.find('.ffd-esignature').html($('#DocSignHTMLTemp').html());
                        litem.find('.labelDiv').hide();
                        litem.find('.eSignatureFieldDiv').attr('id', 'field' + eSignatureId);
                        litem.find('.eSignatureFieldDiv .ffd-esignature-input').attr('id', 'input' + eSignatureId);
                        litem.find('.eSignatureFieldDiv').show();
                        litem.find('.eSignatureFieldDiv .ffd-esignature').show();
                        litem.find('.eSignatureFieldDiv .main-docsign-wrapper').attr('id', 'elem' + eSignatureId);
                        assignSignatureElementIds(litem, signatureIndex);

                        setDefaultSignatureElementValues(litem.find('.eSignatureFieldDiv .ffd-esignature-input'));
                        resetESignatureElement(litem, false);
                        resetPDFRequiredOption(true);

                    }
                }
                else if (dropLiId == "lblliFASTFORMSPAYMENT") {
                    if (!onlyEnterpriseEdit) {
                        upgradeNowMessage('Payment fields are only available in the Enterprise edition of Fast Forms.', '', '');
                        deletePaymentFieldByParentFieldLi(litem, true);
                    }
                    else {

                        isPaymentField = true;
                        var i = randomId;
                        dropLiId = dropLiId + i;
                        litem.attr('id', dropLiId);
                        var originaldivId = litem.find('.field-div-payment').attr('id');
                        litem.find('.field-div-payment').attr('id', originaldivId + i);
                        $(litem.find('.payment-item-row')).each(function (index, ppitemrow) {
                            if ($(ppitemrow).hasClass('pp-expiry')) {

                                var ppexpirylblid = $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id');
                                ppexpirylblid.replace(i, '');
                                $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id', ppexpirylblid + i);
                                $($(ppitemrow).find('select')).each(function (index, ppitemrowselect) {
                                    var orginalselElemId = $(ppitemrowselect).attr('data-pp-name');
                                    $(ppitemrowselect).attr('id', orginalselElemId + i);
                                    $(ppitemrowselect).attr('name', orginalselElemId + i);
                                });
                            }
                            else {
                                var orginalElemId = $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('data-pp-name');
                                orginalElemId = orginalElemId;
                                $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('id', orginalElemId + i);
                                $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('name', orginalElemId + i);
                                $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id', 'lbl' + orginalElemId + i);
                            }

                        });
                        litem.find('.deleteField').attr('id', 'lblliFASTFORMSPAYMENT' + i);
                    }
                } 
                else if (dropLiId == "lblliFILEUPLOADAREA") {
                    var i = randomId;
                    dropLiId = dropLiId + i;
                    litem.attr('id', dropLiId);
                    if (!onlyProfEnterprise) {
                        upgradeNowMessage('File uploads are only available in Professional or Enterprise editions of Fast Forms.', '', '');
                        deleteFieldByParentFieldLi(litem, true);
                    } else {
                        dragAndDropGenericFileUploadFieldEvent(randomId, litem);
                    }
                }

                litem.addClass('generalSortableForFields');
                litem.removeAttr('style');

                if (isPaymentField) {
                    litem.find('.editImg').attr('onclick', "openEditPaymentDialog(this);");
                }
                else if (isESignaturefield) {
                    litem.find('.editImg').attr('onclick', "openEditSignatureDialog(this);");
                    litem.find('.deleteField').attr('onclick', "deleteSignatureField(this,true);");
                }
                else {

                    if (litem.find('.labelDiv .ff-label').length > 0) {
                        litem.find('.labelDiv .ff-label').attr('ondblclick', "editFFLabel(this);");
                    }
                    litem.find('.editImg').attr('onclick', "openEditDialog(this,'field');");

                }

                addRequiredOnLabel(litem);

                setHover();
                var metadata = {
                    field_name: dropLiId
                };
                Intercom('trackEvent', 'added-field', metadata);
                var lastFieldUlLiItem = $("#mainMultiPageWrapper .form-canvas-multi-page-inner .formSectionUl:last-child .formFieldUl").last();
                if ($(lastFieldUlLiItem).parents('.formSectionUl').hasClass('section-repeat') && $.inArray(safeStringValue($(litem).attr('data-otype'), ''), availableGenFieldsInRepSecArr) < 0) {
                    addNewSectionItem($(lastFieldUlLiItem).parents('.fc-multi-page-item').find('>.add-newsection-box>a'), false);
                    $("#mainMultiPageWrapper .form-canvas-multi-page-inner .formSectionUl:last-child .formFieldUl").last().append(litem);
                } else {
                    $(lastFieldUlLiItem).append(litem);
                }
            });
            $("#generalSortableForFields > li").each(function () {
                if ($(this).html() == $(this).next().html()) {
                    $(this).remove();
                }
                else {
                    $(this).show();
                }
            });


        }
    });

    $('#generalSortableForFields.dropfields').bind('sortstart', function (event, ui) {
        var $uiItem = $(ui.item);
        $uiItem.clone().hide().insertBefore($uiItem);
    });
    $(".formFieldUl").bind('sortreceive', function () {
        blockSort = false;
    });
    var blockSortRequired = false;

    //Keep the editor hidden until the user selects an object in the 'Select Object' list
    if ($('[id$="mergeTypeSelect"]').val() != '')
        $('[id$="pb2"]').show();
    else
        $('[id$="pb2"]').hide();

    makeAllLiHeightEqual();
    /*addNewSectionLi();*/
    makeMultiPageFormSortable(fmEditEnabled, onlyProfEnterprise, onlyEnterpriseEdit);

    if (RunOnces == 0) {

        if (isSecNameElemExistsByIndex(0)) {
            console.log('First Related object added Secondary objects count-' + $(".ObjectName span.secName").length);
            setTitleSortable();

        }
        else {
            console.log('No Related object added');
            setTitleSortable();
        }

    }


    console.log(' RunOnces-' + RunOnces);
    //fieldsToggleBind  ();
    RunOnces++;


    var isAlreadyAdd = false;
    $('#generalFieldBox li').unbind('dblclick');
    $('#generalFieldBox li').dblclick(function () {
        resetSavedButton();
        var itemAllowedToAdd = true;
        var isPayAllowed = true;
        var isFileAllowed = true;
        var isSignAllowed = true;
        var litem = $(this).clone();

        litem = itemAdd(litem);
        isAlreadyAdd = true;
        var isPaymentField = false;
        var isESignaturefield = false;
        var randomId = Math.floor((Math.random() * 1000) + 1);
        /*following line will append html item to the last section on form canvas */

        var dropLiId = litem.attr('id');
        dropLiId = safeLegacyPAYPALPAYMENT(dropLiId);
        if (dropLiId == "lblliCAPTCHA") {

            dropLiId = dropLiId + randomId;
            litem.attr('id', dropLiId);
            litem.find('label').attr('id', 'lblCAPTCHA' + randomId);
            litem.find('.labelDiv label').attr('id', 'lblCAPTCHA' + randomId);
            litem.find('.fieldDiv .ff-type-captcha').attr('id', 'Captcha' + randomId);
            litem.find('.deleteField').attr('id', 'lblliCAPTCHA' + randomId);
            litem.find('.fieldDiv').removeAttr('style');
        }
        else if (dropLiId == "lblliGENERALTEXT") {
            dropLiId = dropLiId + randomId;
            litem.attr('id', dropLiId);
            litem.find('.labelDiv label').attr('id', 'lblGENERALTEXT' + randomId);
            litem.find('.deleteField').attr('id', 'lblliGENERALTEXT' + randomId);

        }
        else if (dropLiId == "lblliIMAGE") {

            dropLiId = dropLiId + randomId;
            litem.attr('id', dropLiId);
            litem.find('label').attr('id', 'lblIMAGE' + randomId);
            litem.find('.deleteField').attr('id', 'lblliIMAGE' + randomId);
            litem.find('label').hide();
            litem.addClass('fieldLiImage');
        }
        else if (dropLiId !== undefined && dropLiId.indexOf('ESIGNATURE') > 0) {
            if (!onlyEnterpriseEdit) {
                upgradeNowMessage('E-Signature fields are only available in the Enterprise edition of Fast Forms.', '', '');

                itemAllowedToAdd = false;
            }
            else {
                isESignaturefield = true;

                dropLiId = dropLiId + randomId;
                litem.attr('id', dropLiId);
                var eSignatureId = dropLiId.replace('lblli', '');
                var signatureIndex = randomId;
                //litem.removeClass('grabCursor');
                litem.addClass('generalSortableForFields');
                litem.find('.ffd-esignature').html($('#DocSignHTMLTemp').html());
                litem.find('.labelDiv').hide();
                litem.find('.eSignatureFieldDiv').attr('id', 'field' + eSignatureId);
                litem.find('.eSignatureFieldDiv .ffd-esignature-input').attr('id', 'input' + eSignatureId);
                litem.find('.eSignatureFieldDiv').show();
                litem.find('.eSignatureFieldDiv .ffd-esignature').show();
                litem.find('.eSignatureFieldDiv .main-docsign-wrapper').attr('id', eSignatureId);
                assignSignatureElementIds(litem, signatureIndex);

                setDefaultSignatureElementValues(litem.find('.eSignatureFieldDiv .ffd-esignature-input'));
                resetESignatureElement(litem, false);
                resetPDFRequiredOption(true);
            }
        }
        else if (dropLiId == "lblliFASTFORMSPAYMENT") {
            if (!onlyEnterpriseEdit) {
                upgradeNowMessage('Payment fields are only available in the Enterprise edition of Fast Forms.', '', '');

                itemAllowedToAdd = false;
            }
            else {
                isPaymentField = true;

                var i = Math.floor((Math.random() * 1000) + 1);
                dropLiId = dropLiId + i;
                litem.attr('id', dropLiId);
                var originaldivId = litem.find('.field-div-payment').attr('id');
                litem.find('.field-div-payment').attr('id', originaldivId + i);
                $(litem.find('.payment-item-row')).each(function (index, ppitemrow) {

                    if ($(ppitemrow).hasClass('pp-expiry')) {

                        var ppexpirylblid = $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id');
                        ppexpirylblid.replace(i, '');
                        $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id', ppexpirylblid + i);
                        $($(ppitemrow).find('select')).each(function (index, ppitemrowselect) {
                            var orginalselElemId = $(ppitemrowselect).attr('data-pp-name');
                            $(ppitemrowselect).attr('id', orginalselElemId + i);
                            $(ppitemrowselect).attr('name', orginalselElemId + i);
                        });
                    }
                    else {
                        var orginalElemId = $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('data-pp-name');
                        orginalElemId = orginalElemId;
                        $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('id', orginalElemId + i);
                        $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv label.ff-label').attr('name', orginalElemId + i);
                        $(ppitemrow).find('.PPGeneralLabelDiv label').attr('id', 'lbl' + orginalElemId + i);
                    }
                });
                litem.find('.deleteField').attr('id', 'lblliFASTFORMSPAYMENT' + i);
            }

        }
        else if (dropLiId == "lblliFILEUPLOADAREA") {
            var i = randomId;
            dropLiId = dropLiId + i;
            litem.attr('id', dropLiId);
            if (!onlyProfEnterprise) {
                upgradeNowMessage('File uploads are only available in Professional or Enterprise editions of Fast Forms.', '', '');
                deleteFieldByParentFieldLi(litem, true);
                itemAllowedToAdd = false;
            } else {
                dragAndDropGenericFileUploadFieldEvent(randomId, litem);
            }

        }
        //litem.css('height','auto');
        litem.addClass('generalSortableForFields');
        litem.addClass('grabCursor');
        if (isPaymentField) {
            litem.find('.editImg').attr('onclick', "openEditPaymentDialog(this);");
        } else if (isESignaturefield) {
            litem.find('.editImg').attr('onclick', "openEditSignatureDialog(this);");
            litem.find('.deleteField').attr('onclick', "deleteSignatureField(this,true);");

        }
        else {

            // litem.attr('ondblclick' , "editFFLabel('"+ litem.attr('id')+"');");                
            if (litem.find('.labelDiv .ff-label').length > 0) {
                litem.find('.labelDiv .ff-label').attr('ondblclick', "editFFLabel(this);");
            }
            litem.find('.editImg').attr('onclick', "openEditDialog(this,'field');");
        }
        addRequiredOnLabel(litem);
        if (itemAllowedToAdd) {

            //$("#mainMultiPageWrapper .form-canvas-multi-page-inner .formSectionUl:last-child .formFieldUl").last().append(litem); 
            var lastFieldUlLiItem = $("#mainMultiPageWrapper .form-canvas-multi-page-inner .formSectionUl:last-child .formFieldUl").last();
            if ($(lastFieldUlLiItem).parents('.formSectionUl').hasClass('section-repeat') && $.inArray(safeStringValue($(litem).attr('data-otype'), ''), availableGenFieldsInRepSecArr) < 0) {
                addNewSectionItem($(lastFieldUlLiItem).parents('.fc-multi-page-item').find('>.add-newsection-box>a'), false);
                $("#mainMultiPageWrapper .form-canvas-multi-page-inner .formSectionUl:last-child .formFieldUl").last().append(litem);
            } else {
                $(lastFieldUlLiItem).append(litem);
            }
            setHover();
        }
    });
    activeClick();
    var sectionLabel = $('.sectionLi').find('label.ff-section-header');
    if (sectionLabel !== undefined) {
        $(sectionLabel).unbind('dblclick');
        $(sectionLabel).dblclick(function () {


            editFFSection(this);

        });
    }
}

function dragAndDropGenericFileUploadFieldEvent(pRandomId, pLiItem){
    var fieldElementDiv = pLiItem.find('.fieldDiv');

    pLiItem.find('.labelDiv label.ff-label').attr('id', 'lblFileUpload' + pRandomId);;
    
    fieldElementDiv.find('.ff-fileupload-drop-area').attr('id', 'FileUploadArea' + pRandomId);
    fieldElementDiv.find('.ff-fileupload-drop-area label').attr('id', 'lblFileUpload' + pRandomId + '_Select');
    fieldElementDiv.find('.ff-fileupload-drop-area label').attr('name', 'FileUpload' + pRandomId + '_Select');
    fieldElementDiv.find('.ff-fileupload-drop-area label').attr('for', 'FileUpload' + pRandomId);
    fieldElementDiv.find('.ff-fileupload-drop-area input').attr('id', 'FileUpload' + pRandomId);
    fieldElementDiv.find('.ff-fileupload-drop-area input').attr('name', 'FileUpload' + pRandomId);

    // Classic and Native
    // Default Salesforce Files
    fieldElementDiv.find('.ff-fileupload-drop-area').attr('data-fileserviceon', 'true');
    fieldElementDiv.find('.ff-fileupload-drop-area').attr('data-uploadtosffile', 'true');

    // Default for Native will be Salesforce Files (Native)
    if(isFormNative){
        fieldElementDiv.find('.ff-fileupload-drop-area').attr('data-isnativeoptionselected', 'true');
    }
}

function nextSectionItemCounter() {
    var numberofsections = 0;
    var sectionIdArray = [];
    $("#multiPageUlForm label.ff-section-header").each(function (indx, sectionLabel) {
        var sectionId = $(sectionLabel).attr('id');
        if (!isNullOrEmpty(sectionId)) {
            sectionId = sectionId.replace(/sectionFFLabel/g, '');
            sectionId = sectionId.replace(/sectionLabel/g, '');
            if (!isNullOrEmpty(sectionId)) {
                sectionIdArray.push(parseInt(sectionId));
            }
        }
        numberofsections++;
        console.log(' numberofsections ' + numberofsections);
    });
    //if there were multiple sections created previously,
    //this ID might already be in use
    //let's continue to add until we get another one
    while (jQuery.inArray(numberofsections, sectionIdArray) >= 0) {
        numberofsections++;
    }

    return numberofsections;
}
function nextPageItemCounter() {
    var numberofpages = 0;
    var pageIdArray = [];
    $("#multiPageUlForm label.ff-page-header").each(function (indx, pageLabel) {
        var pageLabelId = $(pageLabel).attr('id');
        if (!isNullOrEmpty(pageLabelId)) {
            pageLabelId = pageLabelId.replace('pageFFLabel', '');
            if (!isNullOrEmpty(pageLabelId)) {
                pageIdArray.push(pageLabelId);
            }
        }
        numberofpages++;
        console.log(' numberofsections ' + numberofpages);
    });
    //if there were multiple sections created previously,
    //this ID might already be in use
    //let's continue to add until we get another one
    while (jQuery.inArray(pageIdArray, sectionIdArray) >= 0) {
        numberofpages += 1;
    }

    return numberofpages;
}
function addNewSectionItem(elemSource, isAutoSave) {


    var idCounter = nextSectionItemCounter();
    var liId = idCounter + 'sortableForLabelli';

    var pageMainElem = $(elemSource).parents('.fc-multi-page-item');

    var ulHtml = $('<div/>').html($('#pageNewSectionTEMP').html());
    ulHtml.find('>ul.formSectionUl').attr('id', 'labelSectionformUl' + idCounter);
    ulHtml.find('>ul>li.sectionLi').attr('id', 'sortableForSectionLabelli' + idCounter);
    ulHtml.find('>ul>li>label.ff-section-header').attr('id', 'sectionLabel' + idCounter);

    $(pageMainElem).find('.formSectionUlWrap').append(ulHtml.html());
    makeSectionsSortable();
    resetMultiPageSortableCall();
    if (isAutoSave) {
        isChangesMadeInForm = true;
        autosaveTriggered();
    }
}
function addNewRepeatableSectionItem(elemSource, isAutoSave) {


    var idCounter = nextSectionItemCounter();
    var liId = idCounter + 'sortableForLabelli';

    var pageMainElem = $(elemSource).parents('.fc-multi-page-item');

    var ulHtml = $('<div/>').html($('#pageNewSectionTEMP').html());
    ulHtml.addClass('section-repeat');
    ulHtml.find('>ul.formSectionUl').attr('id', 'labelSectionformUl' + idCounter);
    ulHtml.find('>ul>li.sectionLi').attr('id', 'sortableForSectionLabelli' + idCounter);
    ulHtml.find('>ul>li>label.ff-section-header').attr('id', 'sectionLabel' + idCounter);

    $(pageMainElem).find('.formSectionUlWrap').append(ulHtml.html());
    makeSectionsSortable();
    resetMultiPageSortableCall();
    if (isAutoSave) {
        isChangesMadeInForm = true;
        autosaveTriggered();
    }
}

function makeSectionsSortable() {
    $(sortableIDForFormSection).sortable({
        dropOnEmpty: true,
        revert: 300,
        zIndex: 1002,
        placeholder: "sortable-section-placeholder",
        connectWith: sortableIDForFormSection,
        items: 'ul.formSectionUl',
        cancel: "select,option,textarea,input,.isFieldEdit,.editDelDiv,.editImg, .deleteField",
        update: function (event, ui) {
            console.log('[sortableIDForFormSection.update]...');
            isChangesMadeInForm = true;
        },
        activate: function (event, ui) {
            console.log('[sortableIDForFormSection.activate]...');
            ui.item.css('height', 'auto');
            ui.item.addClass('grabCursor');
            ui.item.show();
        },
        deactivate: function (event, ui) {
            console.log('[sortableIDForFormSection.deactivate]...');
            ui.item.removeClass('grabCursor');
        }
    });
}


function makePagesSortable() {
    $(sortableIDForFormPage).sortable({
        dropOnEmpty: true,
        revert: 300,
        zIndex: 1001,
        placeholder: "sortable-page-placeholder",
        connectWith: sortableIDForFormPage,
        items: 'div.fc-multi-page-item',
        cancel: ".ui-page-state-disabled",
        receive: function (ev, ui) {
            console.log('[sortableIDForFormPage.receive]...');
            if (!(ui.item.hasClass("hide-visibility"))) { ui.sender.sortable("cancel"); }
        },
        stop: function (ev, ui) {
            console.log('[sortableIDForFormPage.stop]...');
            if (!(ui.item.hasClass('hide-visibility'))) {
                $(this).sortable('cancel');
            }
            else {
                refreshAddNewPagesLink();
            }
        },
        activate: function (event, ui) {
            console.log('[sortableIDForFormPage.activate]...');
            ui.item.css('height', 'auto');
            ui.item.addClass('grabCursor');
            ui.item.show();
        },
        deactivate: function (event, ui) {
            console.log('[sortableIDForFormPage.deactivate]...');
            ui.item.removeClass('grabCursor');
        }

    });
    $('.form-canvas-multi-page-inner').bind('sortstart', function (event, ui) {


        var prevElemSame = isPlaceholderElemIsSame($('.sortable-page-placeholder').prev(), ui.item)
        var nextElemSame = isPlaceholderElemIsSame($('.sortable-page-placeholder').next(), ui.item);

        if (prevElemSame && $('.sortable-page-placeholder').prev().hasClass('fc-multi-page-item')) {
            $('.sortable-page-placeholder').html('<span class="vert-line-prev">move here</span>');
        }
        else if (nextElemSame && $('.sortable-page-placeholder').next().hasClass('fc-multi-page-item')) {
            $('.sortable-page-placeholder').html('<span class="vert-line-next">move here</span>');
        }


    });


}
function isPlaceholderElemIsSame(sourceElem, uiItem) {
    var returnFlag = false;
    if (sourceElem.length > 0 && uiItem.length > 0 && sourceElem[0] == uiItem[0]) {
        returnFlag = true;
    }
    return returnFlag;
}
function toggleSortableOption(disbleDragNDrop) {

    $(".formFieldUl").sortable("option", "disabled", disbleDragNDrop);
    $(".formSectionUlWrap").sortable("option", "disabled", disbleDragNDrop);
    $("#multiPageUlForm").sortable("option", "disabled", disbleDragNDrop);

}

function addRequiredOnLabel(elemSourceFieldLi) {

    if ($(elemSourceFieldLi).hasClass('lbl') == false) {
        var lblLiId = $(elemSourceFieldLi).attr('id');

        var isRequired = false;
        if ($(elemSourceFieldLi).find('.labelDiv>label.ff-label').attr('id') !== undefined) {


            var defreq = getSafeBoolean($(elemSourceFieldLi).find('.fieldDiv').find('>select,>input,input.ff-input-type,>textarea').attr('data-isdefualtreq'), false);
            var userreq = getSafeBoolean($(elemSourceFieldLi).find('.fieldDiv').find('>select,>input,input.ff-input-type,>textarea').attr('data-isuserreq'), false);
            isRequired = defreq;
            if (userreq) {
                isRequired = defreq;
            }
        }
        var isPaymentField = false;
        if (lblLiId.indexOf('FASTFORMSPAYMENT') > 0) {
            isPaymentField = true;
        }
        var isSignatureField = false;
        if (lblLiId.indexOf('ESIGNATURE') > 0) {

            isSignatureField = true;
        }
        //Required Label Add onload                       
        if (!isPaymentField && !isSignatureField) {

            $(elemSourceFieldLi).find('.labelDiv .ff-required-mark').remove();
        }


        if (lblLiId.indexOf('lblliCAPTCHA') >= 0) {
            $(elemSourceFieldLi).find('.labelDiv>label.ff-label').after('<span class="ff-required-mark"  >*</span>');
        }
        else if (lblLiId.indexOf('lblliFileUploadArea') >= 0) {
            var fieldUploadDiv = $(elemSourceFieldLi).find('.fieldDiv .ff-fileupload-drop-area');
            if ($(fieldUploadDiv).attr('data-isrequired') || $(fieldUploadDiv).attr('data-isrequired') == 'true') {
                $(elemSourceFieldLi).find('.labelDiv>label.ff-label').after('<span class="ff-required-mark"  >*</span>');
            }
            else if ($(fieldUploadDiv).attr('data-isrequired') == false || $(fieldUploadDiv).attr('data-isrequired') == "false") {
                $(elemSourceFieldLi).find('.labelDiv .ff-required-mark').remove();
            }
        }
        else if (isRequired == "true" || isRequired == true) {
            $(elemSourceFieldLi).find('.labelDiv>label.ff-label').after('<span class="ff-required-mark"  >*</span>');
        }
        if (isPaymentField) {
            var ispaymentreq = false;
            if ($(elemSourceFieldLi).find('.field-div-payment').attr('data-paymentrequired')) {
                ispaymentreq = true;
            }
            $($(elemSourceFieldLi).find('.payment-item-row')).each(function (i, ppitemrow) {
                $(ppitemrow).find('label.ff-required-mark').remove();
                var isdatarequired = $(ppitemrow).find('.PPGeneralFieldDiv input,.PPGeneralFieldDiv select').attr('data-isrequired');
                if (isdatarequired !== undefined && ispaymentreq && (isdatarequired == "true" || isdatarequired == true)) {
                    if ($(ppitemrow).find('span.requiredSpan').length < 1) {
                        $(ppitemrow).find('label.ff-label').after('<span class="ff-required-mark"  >*</span>');
                    }
                }

            });
        }
    }

}

function updateDefaultConfig(elemFieldLi, isAutoSave) {
    console.log('[updateDefaultConfig] Starts...');

    var fieldLabelHtml = GetInputValueAsHTML($('#defaultLabel').val());
    $("#tempBlockQuotesHide").html(SetInputValue(fieldLabelHtml));
    $("blockquote").contents().unwrap();
    fieldLabelHtml = GetInputValueAsHTML($("#tempBlockQuotesHide").html());
    var liId = $(elemFieldLi).attr('id');
    $("#labelDiv").html(SetInputValue(fieldLabelHtml));
    if ($("#labelDiv").has("h1,h2,h3").length) {
        if ($("#labelDiv").find("h1,h2,h3").attr('align') != undefined)
            $(elemFieldLi).css("text-align", $("#labelDiv").find("h1,h2,h3").attr('align'));
        else if ($("#labelDiv").find("h1,h2,h3").css('text-align') != "undefined")
            $(elemFieldLi).css("text-align", $("#labelDiv").find("h1,h2,h3").css('text-align'));
    } else {
        $(elemFieldLi).css("text-align", '');
    }

    /*lblliIMAGE check added to fix #190 issue on Sep 17 2015*/
    if (!(/lblliIMAGE/i.test(liId)) && (fieldLabelHtml == "" || fieldLabelHtml == "<br>" || fieldLabelHtml == "Please enter a label.")) {
        isFFValid = false;
    } else if (/lblUPLOAD/i.test(liId)) {
        if ($('#selectedfiletypes').val() == '' || $("#limitValue").val() == '') {
            isFFValid = false;
        }
    } else {

        if ($("#hiddenLiId").val() != "") {
            if (/lblliFILEUPLOADAREA/i.test(liId)) {

                var fieldElemDiv = $(elemFieldLi).find('.fieldDiv');
                var labelElemDiv = $(elemFieldLi).find('.labelDiv');

                $(labelElemDiv).find('.ff-required-mark').remove();
                if ($('#requiredChk').prop("checked")) {
                    $(labelElemDiv).find('.ff-label').after($('<span/>', { 'class': 'ff-required-mark', 'html': '*' }));
                }

                var selectedIntegrationValue = fs.FileSettingBuilder.ddlIntegrationGetSelectedValue();
                var selectedValueInSFRadioSection = fs.FileSettingBuilder.getSelectedValueInSfFileRadioSection();

                var fileUploadDropArea = fieldElemDiv.find('.ff-fileupload-drop-area');
                fileUploadDropArea.attr('data-requiredmessage', GetInputValueAsHTML($("#errMsgForRequiredField").val()));
                fileUploadDropArea.attr('data-isrequired', $('#requiredChk').prop("checked"));
                fileUploadDropArea.attr('data-maxfiles', $("#limitValue").val());
                fileUploadDropArea.attr('data-maxfilesize', $("#maxFileSize").val());
                fileUploadDropArea.attr('data-allowedfiletypes', $("#selectedfiletypes").val());
                fileUploadDropArea.attr('data-uploadtochatter', fs.FileSettingBuilder.isUploadToChatterChecked(selectedValueInSFRadioSection));
                fileUploadDropArea.attr('data-uploadtosffile', fs.FileSettingBuilder.isUploadToSFFileChecked(selectedValueInSFRadioSection));
                fileUploadDropArea.attr('data-uploadtointegration', fs.FileSettingBuilder.isIntegrationSelected(selectedIntegrationValue));
                fileUploadDropArea.attr('data-isnativeoptionselected', fs.FileSettingBuilder.isNativeUploadOptionSelected(selectedIntegrationValue));
                fileUploadDropArea.attr('data-attachto', safeStringValue($('#ddlObjListForAttachment').val(), 1));
                var filename = $('#ffFileName').val();
                filename = filename.replace(/'/g, "&#39;");
                filename = filename.replace(/"/g, "&quot;");
                fileUploadDropArea.attr('data-filename', filename);

            } else if (/lblliIMAGE/i.test(liId)) {

                var imgAlignment = $("#ddlImageAlignment").val();
                var labelElemDiv = $(elemFieldLi).find('.labelDiv');
                if (!isNullOrEmpty(imgAlignment)) {
                    labelElemDiv.find('.imageGeneralFieldDiv').attr('style', 'text-align:' + imgAlignment);
                }
                labelElemDiv.find('.ffse-img-upload-placeholder-editor img').attr('width', $("#imgWidthValue").val());
                labelElemDiv.find('.ffse-img-upload-placeholder-editor img').attr('height', $("#imgHeightValue").val());
                labelElemDiv.find('.ffse-img-upload-placeholder-editor img').attr('alt', $("#imgAltTag").val());
            }
            else if ($(elemFieldLi).find('.fieldDiv').find('>select,>input,input.ff-input-type,>textarea').length > 0) {

                $(elemFieldLi).find('.labelDiv .ff-label').html(SetInputValue(fieldLabelHtml));

                var defaultValue, upsertValue;
                if ($('#defaultValue').attr('type') == 'checkbox') {
                    defaultValue = $('#defaultValue').prop('checked');
                } else if ($('#defaultValue').attr('multiple') == 'multiple' && $('#defaultValue').val() != '' && $('#defaultValue').val() != null) {
                    defaultValue = $('#defaultValue').val();
                } else {
                    defaultValue = $('#defaultValue').val();
                }

                if ($('#upsertField').attr('type') == 'checkbox') {
                    upsertValue = $('#upsertField').prop('checked');
                } else {
                    upsertValue = $('#upsertField').val();
                }
                var mainFieldElement = $(elemFieldLi).find('.fieldDiv').find('>select,>input,input.ff-input-type,>textarea');//.attr('data-isuserreq'), false);
                var labelElemDiv = $(elemFieldLi).find('.labelDiv');

                $(labelElemDiv).find('.ff-required-mark').remove();

                $(mainFieldElement).each(function (indx, inputElem) {
                    if ($(inputElem).attr('type') == 'hidden') {
                        // $(inputElem).attr('id', finalElemId + 'hidden');
                        // $(inputElem).attr('name', finalElemId + 'hidden');
                    }
                    else {
                        $(labelElemDiv).find('.ff-required-mark').remove();
                        $(inputElem).attr('placeholder', SetInputValue(GetInputValue($('#placeholderText').val())));
                        $(inputElem).attr('data-requiredmessage', GetInputValueAsHTML($('#errMsgForRequiredField').val()));
                        $(inputElem).attr('data-isdefaultreq', $('#requiredChk').prop("disabled"));
                        $(inputElem).attr('data-isuserreq', $('#requiredChk').prop("checked"));
                        if ($('#requiredChk').prop("checked")) {
                            $(inputElem).attr('data-isrequired', true);
                            $(labelElemDiv).find('.ff-label').after($('<span/>', { 'class': 'ff-required-mark', 'html': '*' }));
                        }
                        else {
                            $(inputElem).attr('data-isrequired', false);
                        }
                        $(inputElem).attr('data-isupsert', upsertValue);
                        $(inputElem).attr('data-ishidden', $('#hideField').prop("checked"));
                        $(inputElem).attr('data-isreadonly', $('#readOnlyField').prop("checked"));
                    }
                });


                if ($(elemFieldLi).find('.fieldDiv > input[type="checkbox"]').length > 0) {
                    if (defaultValue == 'true' || defaultValue) {
                        $(elemFieldLi).find('.fieldDiv > input[type="checkbox"]').attr('checked', 'checked');
                    }
                    else { $(elemFieldLi).find('.fieldDiv > input[type="checkbox"]').removeAttr('checked'); }
                }
                else if ($(elemFieldLi).find('.fieldDiv > select').length > 0) {
                    var selectElement = $(elemFieldLi).find('.fieldDiv > select');
                    if (defaultValue instanceof Array && defaultValue.length > 0) {
                        $.each(defaultValue, function (key, value) {
                            $(selectElement).find('option[value="' + value + '"]').attr('selected', 'selected');
                        });
                    }
                    else {
                        $(selectElement).find('option[value="' + defaultValue + '"]').attr('selected', 'selected');
                    }
                } else if ($(elemFieldLi).find('.fieldDiv > textarea').length > 0) {
                    $(elemFieldLi).find('.fieldDiv > textarea').text(defaultValue);
                } else if ($(elemFieldLi).find('.fieldDiv .lookupInput > input[type="hidden"]').length > 0) {
                    $(elemFieldLi).find('.fieldDiv .lookupInput > input[type="hidden"]').attr('value', $('#defaultValueHidden').val());
                    $(elemFieldLi).find('.fieldDiv .lookupInput > input[type="textbox"]').attr('value', defaultValue);
                } else {
                    if ($(elemFieldLi).find('.fieldDiv > input[type="hidden"]').length > 0) {
                        $(elemFieldLi).find('.fieldDiv > input[type="hidden"]').attr('value', $('#defaultValueHidden').val());
                        $(elemFieldLi).find('.fieldDiv > input[type="textbox"]').attr('value', defaultValue);
                    }
                }
            }
        }

        if (isAutoSave) {
            isChangesMadeInForm = true;
        }
    }
}
function togglePageBlock(elemSource) {
    togglePageBlockElement(elemSource, false);
}
function expandFirstPage() {

    $('#mainMultiPageWrapper').find('.fc-multi-page-item').each(function (indx, pageElementMain) {
        if (indx == 0) {
            $(pageElementMain).find('.Ulbtn').slideDown('300');
            $(pageElementMain).find('.formPageUl').slideDown('300');
            $(pageElementMain).removeClass('hide-visibility');
            if (!$(pageElementMain).hasClass('ui-page-state-disabled')) {
                $(pageElementMain).addClass('ui-page-state-disabled');
            }
        }
        else {
            $(pageElementMain).find('.Ulbtn').slideUp('300');
            $(pageElementMain).find('.formPageUl').slideUp('300');
            $(pageElementMain).addClass('hide-visibility');
            $(pageElementMain).removeClass('ui-page-state-disabled');
            var pagetitle = GetInputValueAsHTML($(pageElementMain).find('.ff-page-header').html());
            if (!isNullOrEmpty(pagetitle)) {
                $(pageElementMain).find('.ff-page-info .ff-page-title').html(SetInputValue(pagetitle));
            }
        }
    });

}
function togglePageBlockElement(elemSource, firstChild) {
    var collapsePageDiv = false;
    if (!firstChild && !$(elemSource).parents('.fc-multi-page-item').hasClass('hide-visibility')) {
        collapsePageDiv = true;
    }

    if (firstChild) {
        $('#mainMultiPageWrapper').find('.fc-multi-page-item:first-child').removeClass('hide-visibility');
        $('#mainMultiPageWrapper').find('.fc-multi-page-item:first-child').addClass('ui-page-state-disabled');
        $('#mainMultiPageWrapper').find('.fc-multi-page-item:first-child').find('.Ulbtn').slideDown('300');
        $('#mainMultiPageWrapper').find('.fc-multi-page-item:first-child').find('.formPageUl').slideDown('300');
    }
    else {
        if (collapsePageDiv) {

            $(elemSource).parents('.fc-multi-page-item').find('.Ulbtn').slideUp('300');
            $(elemSource).parents('.fc-multi-page-item').find('.formPageUl').slideUp('300');
            $(elemSource).parents('.fc-multi-page-item').addClass('hide-visibility');
            $(elemSource).parents('.fc-multi-page-item').removeClass('ui-page-state-disabled');
            var pagetitle = GetInputValueAsHTML($(elemSource).parents('.fc-multi-page-item').find('.ff-page-header').html());
            if (!isNullOrEmpty(pagetitle)) {
                $(elemSource).parents('.fc-multi-page-item').find('.ff-page-info .ff-page-title').html(SetInputValue(pagetitle));
            }
        }
        else {
            $(elemSource).parents('.fc-multi-page-item').removeClass('hide-visibility');
            $(elemSource).parents('.fc-multi-page-item').addClass('ui-page-state-disabled');
            $(elemSource).parents('.fc-multi-page-item').find('.Ulbtn').slideDown('300');
            $(elemSource).parents('.fc-multi-page-item').find('.formPageUl').slideDown('300');
        }
    }

}
function refreshAddNewPagesLink() {
    var pageDiv = $('<div/>').html($('#pageAddNewTEMP').html());
    $('#mainMultiPageWrapper').find('.form-canvas-multi-page-inner .add-newpage-box').remove();
    var totalPages = $('#mainMultiPageWrapper').find('.form-canvas-multi-page-inner .fc-multi-page-item').length;
    $('#mainMultiPageWrapper').find('.form-canvas-multi-page-inner .fc-multi-page-item').each(function (indx, pageElem) {
        if (indx < (totalPages - 1)) {
            $(pageElem).after(pageDiv.html());
        }
    });
    refreshPagesOrder();
}
// Multi page js file ends