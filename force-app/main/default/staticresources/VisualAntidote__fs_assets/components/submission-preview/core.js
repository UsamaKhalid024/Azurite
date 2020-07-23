var ff_AddAnotherSectionLink = '+ add another';
var ff_RemoveSectionLink = '- remove';
var ff_SectionRepeatMinCount = 1;
var ff_SectionRepeatMaxCount = 100;

var ffErr_SignatureFullNameTyped = 'Please enter your first and last name in the provided field.';
var ffErr_SignatureInitialsTyped = 'Please enter your initials in the provided field.';
var ffErr_SignatureFullNameDrawn = 'Please sign your first and last name in the provided field.';
var ffErr_SignatureInitialsDrawn = 'Please sign your initials in the provided field.';
var ffErr_SignatureDateTyped = 'Please select today\'s date in the provided field.';
var ffErr_SignatureDateDrawn = 'Please sign today\'s date in the provided field.';
var ffErr_SignatureAcceptTerms = 'You must accept the provided terms before continuing.';
var ffErr_SignatureValidEmail = 'Please provide a valid email address.';

function initializeFormValues() {
    console.log('initializeFormValues()' + $('#submittedData').val());
    var submittedData = $('#submittedData').val();
    if (submittedData !== undefined && submittedData != '') {
        var submittedJSON = JSON.parse(submittedData);
        for (var i = 0, keys = Object.keys(submittedJSON), l = keys.length; i < l; i++) {
            var property = keys[i];
            var fieldId = property.replace(/\./g, '\\.');
            if (fieldId.indexOf('ESIGNsignD') == 0) {
                console.log(' Esignature found- fieldId:' + fieldId + ' fieldval:' + submittedJSON[property]);

                if (fieldId.indexOf('ESIGNsignDoutputSignedName') == 0 || fieldId.indexOf('ESIGNsignDffSignedName') == 0) {
                    var esignInput = fieldId.replace('ESIGNsignDoutputSignedName', 'inputESIGNATURE');
                    esignInput = fieldId.replace('ESIGNsignDffSignedName', 'inputESIGNATURE');
                    $('#dvFastForms #' + esignInput).attr('data-currenttab', 'drawn');
                }

                var esignElemId = fieldId.replace('ESIGNsignDoutputSigned', 'signDffSigned');
                if(fieldId.indexOf('ESIGNsignDffSigned') == 0){
                    esignElemId = fieldId.replace('ESIGN', '');
                }

                var imageUrl = instanceURL + '/servlet/servlet.ImageServer?id=' + submittedJSON[property] + '&oid=' + salesforceOrgId;
                $('#dvFastForms #' + esignElemId).parent().prepend($('<img/>', {
                    'src': imageUrl,
                    'class': 'img-esign'
                }));

            } else if ($('#dvFastForms').find('#' + fieldId).length > 0) {
                setFFFieldValue(fieldId, submittedJSON[property]);
            } else {
                var fieldIdasArr = property.split('.');
                if (fieldIdasArr.length === 4 || fieldIdasArr.length === 1) {
                    if (fieldIdasArr.length === 1) {
                        if ($('#dvFastForms').find('#' + fieldId).length > 0) {
                            setFFFieldValue(fieldId, submittedJSON[property]);
                        } else {
                            //create new repeat section
                            var prevRepeatIndex = safeInt(fieldId.split('__')[1], -1);
                            if (prevRepeatIndex > 1) {
                                var prevfieldId = fieldId.split('__')[0] + '__1';
                                if ($('#dvFastForms').find('#' + prevfieldId).length > 0) {
                                    for (var rindx = 2; rindx <= prevRepeatIndex; rindx++) {
                                        $('#dvFastForms').find('#' + prevfieldId).parents('.ff-sec-repeat-wrapper').find('.ff-add').click();
                                    }
                                    var newRepeatIndex = prevRepeatIndex;
                                    var repeatfieldId = fieldId.split('__')[0] + '__' + newRepeatIndex;
                                    if ($('#dvFastForms').find('#' + repeatfieldId).length > 0) {
                                        setFFFieldValue(repeatfieldId, submittedJSON[property]);
                                    }
                                }
                            }
                        }
                    } else if (fieldIdasArr[2].length >= 4 && fieldIdasArr[2].split('_').length >= 2) {
                        var fieldIdWithDot = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_' + fieldIdasArr[2].split('_')[1] + '_.' + fieldIdasArr[3];
                        var fieldId = fieldIdWithDot.replace(/\./g, '\\.');
                        if ($('#dvFastForms').find('#' + fieldId).length > 0) {
                            setFFFieldValue(fieldId, submittedJSON[property]);
                        } else {
                            //create new repeat section

                            var prevRepeatIndex = safeInt(fieldIdasArr[2].split('_')[1], -1);
                            console.log(' RepeatIndex: ' + prevRepeatIndex);
                            if (prevRepeatIndex > 1) {
                                var prevfieldIdWithDot = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_1_.' + fieldIdasArr[3];
                                var prevfieldId = prevfieldIdWithDot.replace(/\./g, '\\.');
                                if ($('#dvFastForms').find('#' + prevfieldId).length > 0) {
                                    for (var rindx = 2; rindx <= prevRepeatIndex; rindx++) {
                                        $('#dvFastForms').find('#' + prevfieldId).parents('.ff-sec-repeat-wrapper').find('.ff-add').click();
                                    }
                                    var newRepeatIndex = prevRepeatIndex;
                                    var repeatfieldIdWithDot = fieldIdasArr[0] + '.' + fieldIdasArr[1] + '.' + fieldIdasArr[2].split('_')[0] + '_' + newRepeatIndex + '_.' + fieldIdasArr[3];
                                    var repeatfieldId = repeatfieldIdWithDot.replace(/\./g, '\\.');
                                    if ($('#dvFastForms').find('#' + repeatfieldId).length > 0) {
                                        setFFFieldValue(repeatfieldId, submittedJSON[property]);
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
    }
}

function setFFFieldValue(fieldId, submittedValue) {
    var isElemMultiSelect = false;
    var multiSelectVal = [];
    /// we were using double decode before which was throwing exception if value has restricted url characters like % 
    /// we removed double decoing for JIRA: 1302 
    /// Old code in following line : decodeURIComponent(decodeURIComponent(submittedValue));
    var safeValue = decodeURIComponent(submittedValue);
    try {
        var ctrlType = $('#dvFastForms').find('#' + fieldId)[0].type;
        if (ctrlType == 'select-multiple') {
            isElemMultiSelect = true;
            multiSelectVal = safeValue.split(';');
            $('#dvFastForms').find('#' + fieldId).val(multiSelectVal);
        } else if (ctrlType == 'checkbox') {
            console.log('Boolean:' + safeValue);
            if (getSafeBoolean(safeValue, false)) {
                $('#dvFastForms').find('#' + fieldId).prop('checked', safeValue);
            }
        } else {
            $('#dvFastForms').find('#' + fieldId).val(safeValue);
            var vatt = $('#dvFastForms').find('#' + fieldId).attr('vatt');
            if (!isNullOrEmpty(vatt) && vatt == 'REFERENCE') {
                $('#dvFastForms').find('#' + fieldId).next().val(safeValue);
            }
        }
    } catch (err) {
        console.log('FORM [setFFFieldValue] ERROR:' + err);
    }
}

function InitializeBreadcrumbs() {
    var breadcrumbEnabledElem = $('#dvFastForms #breadcrumbEnabled');
    if ($(breadcrumbEnabledElem).val() !== undefined && $(breadcrumbEnabledElem).val() != '' && $(breadcrumbEnabledElem).val().toLowerCase() == "true") {
        //generating breadcrumbs
        var i = 0;
        var breadHeaderDiv = $("<div />").addClass('ff-page-bread-header');
        var breadWrapperDiv = $("<div />").addClass('ff-page-bread-wrapper');
        var breadDiv = $("<div />").addClass('ff-page-bread');

        var nextBreadBtn = $("<div>></div>").addClass('ff-page-bread-next ff-page-bread-item').attr('onclick', 'FFMoveBreadcrumbRight();');
        var prevBreadBtn = $("<div><</div>").addClass('ff-page-bread-prev ff-page-bread-item').attr('onclick', 'FFMoveBreadcrumbLeft();');

        $(prevBreadBtn).css('visibility', 'hidden');




        $(breadDiv).appendTo(breadWrapperDiv);
        $(breadWrapperDiv).appendTo(breadHeaderDiv);

        $('#dvFastForms .ff-form-main').prepend(breadHeaderDiv);
        $(breadWrapperDiv).before(prevBreadBtn);
        $(breadWrapperDiv).after(nextBreadBtn);
        var totalWidth = 0;
        $('#dvFastForms .ff-page-row[page-ishidden!=true]').each(function () {
            var setPageFunction = "FFSetPage(" + i + ");"
            var breadPrefix = $('#dvFastForms #breadcrumbPrefix').val();

            if (breadPrefix == "") {
                var title = ($('#dvFastForms #breadcrumbNumbered').val().toLowerCase() == "true" ? (i + 1) + ". " : "") + $(this).data('pagetitle');
            } else {
                var title = (breadPrefix == "" ? "" : breadPrefix + " ") + ($('#dvFastForms #breadcrumbNumbered').val().toLowerCase() == "true" ? (i + 1) + ": " : "") + $(this).data('pagetitle');
            }

            var breadItem = $("<div data-pageid='" + $(this).attr('id') + "'/>").html(title).addClass('ff-page-bread-item').attr("onclick", setPageFunction);
            if (i == 0) {
                $(breadItem).addClass('item-selected');
            }
            $(breadItem).appendTo(breadDiv);
            i++;

        });

    }
}

function InitializePages() {
    var multipageEnabledElem = $('#dvFastForms #multipageEnabled');
    if ($(multipageEnabledElem).val() !== undefined && $(multipageEnabledElem).val() != '' && $(multipageEnabledElem).val().toLowerCase() == "true") {
        var startPage = $('#dvFastForms .ff-page-row[page-ishidden!=true]:first');
        //hiding all but the first page        
        $('#dvFastForms .ff-page-row[page-ishidden!=true]:not(:first)').hide();

        //hiding all default hidden pages
        $('#dvFastForms .ff-page-row[page-ishidden=true]').hide();

        var btnPrev = $('<input type="button" class="sectionHeader ff-btn-submit ff-btn-prev" id="btnprev" onclick="FFPrevPage();">')
        var btnNext = $('<input type="button" class="sectionHeader ff-btn-submit ff-btn-next" id="btnnext" onclick="FFNextPage();">')

        $(btnPrev).val($('#dvFastForms #prevBtnText').val());
        $(btnNext).val($('#dvFastForms #nextBtnText').val());

        $('#dvFastForms .btnDiv').append(btnPrev);
        $('#dvFastForms .btnDiv').append(btnNext);

        $('#dvFastForms #btnprev').hide();
        $('#dvFastForms #btnnext').hide();

        var numPages = $('#dvFastForms .ff-page-row[page-ishidden!=true]').length;
        if (numPages > 1) {
            $('#dvFastForms #btnsubmit').hide();
            $('#dvFastForms #btnnext').show();
        }

    } else {
        $('#dvFastForms .ff-page-bread-header').remove();
        $('#dvFastForms .ff-page-header-row').remove();
    }
}

function InitializeFooter() {
    if (!$('#dvFastForms #btnsubmit').length) {
        //if there is already a submit button, we're working with a legacy form
        //no need to render the footer

        var ffFooterGroup = $('<div class="ff-footer-group"></div>');
        var ffFooterRow = $('<div class="ff-item-row ff-footer-row"></div>');
        var ffSubmitDiv = $('<div class="ff-submit-btn">');
        var footnoteDiv = $('<div class="footnoteDiv"></div>');
        var requiredSpan = $('<span class="requiredSpan  ff-footnote ff-required-mark">*</span>');
        var ffFootnoteLabel = $('<label class="ff-footnote-label ff-label">- required</label>');
        var btnDiv = $('<div class="btnDiv">');

        var btnSubmit = $('<input type="button" class="sectionHeader ff-btn-submit" id="btnsubmit" onclick="SubmitData();">')

        $(btnSubmit).attr("value", $('#dvFastForms #submitBtnText').val());
        $(btnSubmit).attr("btnmessage", $('#dvFastForms #submitMessage').val());
        $(btnSubmit).attr("btnurl", $('#dvFastForms #submitUrl').val());

        $(btnDiv).append(btnSubmit);
        var saveForLaterElem = $('#dvFastForms #saveForLaterEnabled');
        if ($(saveForLaterElem).val() !== undefined && $(saveForLaterElem).val() != '') {
            if ($(saveForLaterElem).val().toLowerCase() == "true") {
                var btnDiscard = $('<input type="button" class="sectionHeader ff-btn-submit" id="btndiscard" onclick="DiscardDraft();">')
                $(btnDiscard).attr("value", $('#dvFastForms #discardBtnText').val());
                $(btnDiv).prepend(btnDiscard);
                if ($('#dvFastForms #isDraft').val().toLowerCase() != "true") {
                    $(btnDiscard).hide();
                }
                var btnSave = $('<input type="button" class="sectionHeader ff-btn-submit" id="btnsave" onclick="SubmitData(true);">')
                $(btnSave).attr("value", $('#dvFastForms #saveBtnText').val());
                $(btnDiv).prepend(btnSave);
            }
        }

        $(footnoteDiv).append(requiredSpan);
        $(footnoteDiv).append(ffFootnoteLabel);
        $(ffSubmitDiv).append(footnoteDiv);
        $(ffSubmitDiv).append(btnDiv);

        $(ffFooterRow).append(ffSubmitDiv);
        $(ffFooterGroup).append(ffFooterRow);

        $('#dvFastForms .ff-form-main').append(ffFooterGroup);
    }



}

function InitializeSignature() {

    $('#dvFastForms .ff-esignature-wrapper').each(function () {

        var signType = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-signtype', 'full');
        var signOptions = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-signoptions', 'typed');
        var activeTab = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-currenttab', 'typed');
        var signLabel = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-signlabel', 'Full Name');
        var signDate = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-signdate', 'Date');
        var signDateHide = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-signdatehide', 'false');
        var signAgreeHide = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-signagreehide', 'true');
        var signAgree = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-signagree', 'I agree to terms and services');
        var signEmailLabel = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-emaillabel', 'Email');
        var signEmailEnabled = getAttributeNameIfExists($(this).find('.ffd-esignature-input'), 'data-emailenabled', 'false');

        if (signEmailEnabled == true || signEmailEnabled == 'true') {
            $(this).find('.ff-email-verification > input').attr('data-isrequired', true);
            $(this).find('.ff-email-verification').slideDown();
            $(this).find('.ff-email-verification .ffsign-label').append('<span class="ff-required-mark">*</span>');
        } else {
            $(this).find('.ff-email-verification').slideUp();
            $(this).find('.ff-email-verification').hide();
            $(this).find('.ff-email-verification > input').attr('data-isrequired', false);
        }

        var options = {
            name: '.ffsignature',
            penColour: '#000',
            drawOnly: false,
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

        var signInstance = $(this).find('.ff-signwrapper.ff-typed .doc-sign-name').signaturePad(options);

        var signInstanceDate = $(this).find('.ff-signwrapper.ff-typed .doc-sign-date').signaturePad(optionsDate);
        options['drawOnly'] = true;
        var signInstance = $(this).find('.ff-signwrapper.ff-drawn .doc-sign-name').signaturePad(options);

        optionsDate['drawOnly'] = true;
        var signInstanceDate = $(this).find('.ff-signwrapper.ff-drawn .doc-sign-date').signaturePad(optionsDate);
        /*Updating properties*/
        $(this).find('.ff-chkagree > label').html(signAgree);
        $(this).find('.ff-signwrapper').each(function (ind, signElement) {
            $(signElement).find('.doc-sign-name .ffsign-label>label').html(signLabel);
            $(signElement).find('.doc-sign-date .ffsign-label>label').html(signDate);
            if (signDateHide == true || signDateHide == 'true') {
                $(signElement).find('.doc-sign-date input[type="hidden"]').attr('data-isrequired', false);
                $(signElement).find('.doc-sign-date').hide();
            } else {
                $(signElement).find('.doc-sign-date input[type="hidden"]').attr('data-isrequired', true);
                $(signElement).find('.doc-sign-date').show();
            }
        });
        $(this).find('.main-docsign-wrapper').removeClass('ffs-typed');
        $(this).find('.main-docsign-wrapper').removeClass('ffs-both');
        $(this).find('.main-docsign-wrapper').removeClass('ffs-drawn');
        $(this).find('.main-docsign-wrapper').addClass('ffs-' + signOptions);
        $(this).find('.main-docsign-wrapper').removeClass('ffs-full');
        $(this).find('.main-docsign-wrapper').removeClass('ffs-initials');
        $(this).find('.main-docsign-wrapper').addClass('ffs-' + signType);
        if (signOptions == 'drawn') {
            switchSignTab($(this).find('.main-docsign-wrapper').find('li.ffdrawIt>a'));
        } else {
            switchSignTab($(this).find('.main-docsign-wrapper').find('li.fftypeIt>a'));
        }
        if (signAgreeHide == true || signAgreeHide == 'true') {
            $(this).find('.ff-chkagree > input').attr('data-isrequired', false);
            $(this).find('.ff-chkagree').hide();
        } else {
            $(this).find('.ff-chkagree').show();
            $(this).find('.ff-chkagree > input').prop('checked', true);
            $(this).find('.ff-chkagree > input').attr('data-isrequired', true);
        }
        if (signOptions == 'both' && activeTab == 'drawn') {
            switchSignTab($(this).find('.main-docsign-wrapper').find('li.ffdrawIt>a'));
        }
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

    });
    $('.ff-typed .ff-type-text').blur();

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

function getAttributeNameIfExists(elemSource, attrName, defaultvalue) {
    var stringReturn = defaultvalue;
    if (!isNullOrEmpty($(elemSource).attr(attrName))) {
        stringReturn = $(elemSource).attr(attrName);
    }
    return stringReturn;
}

function isNullOrEmpty(strvalue) {
    if (strvalue !== undefined && strvalue !== null && strvalue != '') {
        return false;
    }
    return true;
}

function resetFlexInputForFormElementsDraft() {

    $('#dvFastForms .ff-col-2 input[type="textbox"]').each(function (i, inputElement) {

        var attrDataFlexControl = $(inputElement).attr('data-flexcontrol');
        if (typeof attrDataFlexControl !== typeof undefined && attrDataFlexControl !== false && attrDataFlexControl != '') {
            switch (attrDataFlexControl) {
                case "integer-starrating":
                    var noofitems = $(inputElement).attr('data-flex-max');
                    var minlabel = $(inputElement).attr('data-flex-minlabel');
                    var maxlabel = $(inputElement).attr('data-flex-maxlabel');

                    setRatingInput($(inputElement), noofitems, minlabel, '', maxlabel, attrDataFlexControl);
                    // $('.rating-range-block').removeClass('display-none');
                    //   $('.rating-range-block .star-rating-range').removeClass('display-none'); 
                    break;
                case "integer-npsrating":
                    var minlabel = $(inputElement).attr('data-flex-minlabel');
                    var maxlabel = $(inputElement).attr('data-flex-maxlabel');
                    var middlelabel = $(inputElement).attr('data-flex-middlelabel');
                    setRatingInput($(inputElement), '', minlabel, middlelabel, maxlabel, attrDataFlexControl);
                    //$('.rating-range-block').removeClass('display-none');
                    // $('.rating-range-block .nps-rating-range').removeClass('display-none'); 
                    break;
                case "integer-matrixlikert":
                    console.log('[start] integer-matrix');
                    $(inputElement).ffmatrix('create', {
                        isBuilder: false,
                        isLoading: true
                    });
                    break;
                default:
                    setRatingInput($(inputElement), '', '', '', '', attrDataFlexControl);
                    break;
            }
        }
    });

}

function resetSelect2ForFormElementsDraft() {

    $('#dvFastForms .ff-col-2>select').each(function (i, selectelement) {

        var attrDataFlexControl = $(selectelement).attr('data-flexcontrol');
        if (typeof attrDataFlexControl !== typeof undefined && attrDataFlexControl !== false && attrDataFlexControl != '') {
            switch (attrDataFlexControl) {
                case "picklist-default":
                    break;
                case "picklist-combobox":
                case "multipicklist-multi-tags":
                    $(selectelement).select2();
                    console.log('combo select or simple multi select2');
                    break;
                case "multipicklist-multi-tags-check":
                    $(selectelement).select2({
                        closeOnSelect: false,
                        dropdownCssClass: 'ff-multi-checkbox'
                    });
                    break;
                case "picklist-radiobutton-vertical":
                    reinitializeSelectToRadioElementDraft($(selectelement).parent(), false, false);
                    break;
                case "picklist-radiobutton-horizontal":
                    reinitializeSelectToRadioElementDraft($(selectelement).parent(), false, false);
                    break;
                case "multipicklist-checkbox-horizontal":
                    reinitializeSelectToRadioElementDraft($(selectelement).parent(), false, false);
                    break;
                case "multipicklist-checkbox-vertical":
                    reinitializeSelectToRadioElementDraft($(selectelement).parent(), false, false);
                    break;
                default:
                    break;
            }
        }
    });

}


function setRatingInput(inputElement, noofitems, minlabel, middlelabel, maxlabel, controltype) {


    var readOnly = false;
    switch (controltype) {
        case "integer-starrating":
            if (noofitems == '') {
                noofitems = 5;
                $('#noOfStars').val('5');
            }
            $(inputElement).ffrating('destroy');
            $(inputElement).attr('data-flexcontrol', controltype);
            $(inputElement).attr('data-flex-min', 1);
            $(inputElement).attr('data-flex-max', noofitems);
            $(inputElement).attr('data-flex-minlabel', minlabel);
            $(inputElement).attr('data-flex-maxlabel', maxlabel);
            if ($(inputElement).is('[readonly]')) {
                readOnly = true;
            }
            $(inputElement).ffrating('show', {
                readonly: true,
                showSelectedRating: true
            });
            break;
        case "integer-npsrating":
            $(inputElement).ffrating('destroy');
            $(inputElement).attr('data-flexcontrol', controltype);
            $(inputElement).attr('data-flex-min', 0);
            $(inputElement).attr('data-flex-middle', 5);
            $(inputElement).attr('data-flex-max', 10);
            $(inputElement).attr('data-flex-minlabel', minlabel);
            $(inputElement).attr('data-flex-middlelabel', middlelabel);
            $(inputElement).attr('data-flex-maxlabel', maxlabel);

            if ($(inputElement).is('[readonly]')) {
                readOnly = true;
            }
            $(inputElement).ffrating('show', {
                readonly: true,
                isStar: false
            });
            break;
        default:
            $(inputElement).ffrating('destroy');
            if ($(inputElement).hasClass('custom-flexcontrol-offscreen')) {
                $(inputElement).removeClass('custom-flexcontrol-offscreen');
            }

            break;
    }

}

function reinitializeSelectToRadioElementDraft(selectElementParent, readOnly, destroyOnly) {
    var controltype = '';
    var displaytype = '';
    var controlalignment = '';
    $(selectElementParent).find('select:first').SelectToRadio('destroy');
    /* just remove custom style list if destroy doesn't work just in case*/
    $(selectElementParent).find('div.custom-flex-control-container').remove();
    $(selectElementParent).find('select:first').removeClass('custom-select-offscreen');
    if (!destroyOnly) {
        controltype = $(selectElementParent).find('select:first').attr('data-flexcontrol');
        if (controltype.indexOf('multipicklist-') >= 0) {
            controlalignment = controltype.replace('multipicklist-checkbox-', '');
        } else {
            controlalignment = controltype.replace('picklist-radiobutton-', '');
        }
        if (controltype.indexOf('multipicklist-') >= 0) {
            displaytype = 'ff-ext-checkbox';
        } else {
            displaytype = 'ff-ext-radio';
        }

        $(selectElementParent).find('select:first').SelectToRadio({
            controlType: displaytype,
            alignment: controlalignment,
            readonly: readOnly
        });
        $(selectElementParent).find('select:first').attr('data-flexcontrol', controltype);
    }
}

function initializeCaptcha() {
    if ($('#dvFastForms').find('.ff-col-2.ff-captcha').length > 0) {

        $('#dvFastForms').find('.ff-col-2.ff-captcha').append($('<img/>', {
            'src': ffengineResourceBaseURL + '/styles/images/reCaptcha.png'
        }));
    }
}
/*Functions to initialize repeatable sections starts*/
function InitializeRepeatableSections() {
    window.DataMatrixArrayMap = $.FFMatrixHelper.getUniqueDataMatrixArrayMap();
    $('#dvFastForms .ff-sec-repeat-wrapper').each(function (index, repeatElem) {
        var parentRepeatElem = $(repeatElem).parent();
        SetRepeatableSectionIDs(repeatElem, 1);
        ResetRepeatedSectionItem(repeatElem, true);
        var minItems = safeInt($(parentRepeatElem).data('min'), ff_SectionRepeatMinCount);
        for (var i = 1; i <= minItems; i++) {
            if (i > 1) {
                $(parentRepeatElem).find('.ff-sec-repeat-wrapper').last().find('a.ff-add').click();
                //SetRepeatableSectionIDs(repeatElem, i);
            }
            $(parentRepeatElem).find('.ff-sec-repeat-wrapper').last().find('a.ff-remove,.link-divider').hide();
        }

    });
}

function SetRepeatableSectionIDs(repeatElem, num) {

    $(repeatElem).find('.ff-item-row  .ff-col-2>input,.ff-item-row  .ff-col-2>textarea,.ff-item-row  .ff-col-2>select,.ff-item-row  .ff-col-2>.lookup-link,.ff-item-row div[vatt="CAPTCHA"]').each(function () {
        var inputId = $(this).attr('id');
        var inputName = $(this).attr('name');
        var label = $(this).parent().parent().find("label[for='" + inputId + "']");
        var newId;
        var arr = inputId.split(".");
        if (arr.length == 4) {
            arr[2] = arr[2][0] + "_" + num + "_";
            newId = arr.join('.');
        } else {
            arr = inputId.split("__");
            newId = arr[0] + "__" + num;
        }
        $(this).attr('id', newId);
        $(this).attr('name', newId);

        $(label).attr('for', newId);
        $(label).attr('id', $(label).attr('id') + "_" + num);
    });
    if ($(repeatElem).find(".ff-esignature-wrapper").length >= 1) {
        $(repeatElem).find(".ff-esignature-wrapper").each(function (indx, signWrapElement) {
            assignSignatureElementIds(signWrapElement, num);
            InitializeSignatureElement(signWrapElement);
        });
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
    if (isParentElem) {
        $(repeatElem).find('.ff-sec-repeat-wrapper').find('.ff-add,.link-divider').hide();
        if ($(repeatElem).find('.ff-sec-repeat-wrapper').length < safeInt($(repeatElem).data('max'), ff_SectionRepeatMaxCount)) {
            $(repeatElem).find('.ff-sec-repeat-wrapper:last-child').find('.ff-add,.link-divider').removeAttr('style');
        }
    } else {
        $(repeatElem).parent().find('.ff-sec-repeat-wrapper').find('.ff-add,.link-divider').hide();
        if ($(repeatElem).parent().find('.ff-sec-repeat-wrapper').length < safeInt($(repeatElem).parent().data('max'), ff_SectionRepeatMaxCount)) {
            $(repeatElem).parent().find('.ff-sec-repeat-wrapper:last-child').find('.ff-add,.link-divider').removeAttr('style');
        }
    }
}


function AddToRepeatableSection(elemSource) {
    var section = $(elemSource).parents('.ff-sec-repeat-wrapper'); //$('#dvFastForms #' + sectionId);
    var maxItems = safeInt($(section).parent().data('max'), ff_SectionRepeatMaxCount);
    var currNumItems = $(section).parent().find('.ff-sec-repeat-wrapper').length;

    if (maxItems == "" || currNumItems < maxItems) {
        var lastItem = $(section).parent().find('.ff-sec-repeat-wrapper').eq(currNumItems - 1);
        var newItem = $(lastItem).clone().appendTo($(section).parent());
        if ($(newItem).find('.ff-esignature-wrapper').length > 0) {


            clearSignatureCanvas($(newItem).find('.ff-signwrapper.ff-drawn .doc-sign-date'));
            clearSignatureCanvas($(newItem).find('.ff-signwrapper.ff-drawn .doc-sign-date'));
            clearSignatureCanvas($(newItem).find('.ff-signwrapper.ff-typed .doc-sign-date'));
            clearSignatureCanvas($(newItem).find('.ff-signwrapper.ff-typed .doc-sign-date'));
            $(newItem).find('.docsignWrapper .typedSignName').html('');
            $(newItem).find('.docsignWrapper .typedSignDate').html('');
            $(newItem).find('.docsignWrapper .ffsignature').val('');
            $(newItem).find('.docsignWrapper .ffdate').val('');

        }
        $.FFMatrixHelper.resetMatrixDataOnElements(newItem,window.DataMatrixArrayMap);
        SetRepeatableSectionIDs($(section).parent().find('.ff-sec-repeat-wrapper').last(), currNumItems + 1);
        ResetRepeatedSectionItem($(section).parent().find('.ff-sec-repeat-wrapper').last(), false);
    }
}

function clearSignatureCanvas(elem) {
    if (elem !== undefined) {
        try {
            $(elem).signaturePad().clearCanvas();
        } catch (err) {
            //  console.log(' Trying to clear signature canvas:'+err);
        }
    }

}

function RemoveFromRepeatableSection(elemSource) {
    var section = $(elemSource).parents('.ff-sec-repeat-wrapper'); //$('#dvFastForms #' + sectionId);
    var minItems = safeInt($(section).parent().data('min'), ff_SectionRepeatMinCount);
    var currNumItems = $(section).parent().find('.ff-sec-repeat-wrapper').length;
    var parentElem = $(section).parent();
    if ((minItems == "" || currNumItems > minItems) && currNumItems > 1) {
        var lastItem = $(section).parent().find('.ff-sec-repeat-wrapper').eq(currNumItems - 1);
        $(lastItem).remove();
        resetAddRemoveLinksForRepeatedSections(parentElem, true);
    }
}

function getRepeatableSectionFooterHTML(addtext, removetext) {
    return '<div class="ff-item-row rsec-footer-row"><a class="ff-alink ff-remove" onclick="RemoveFromRepeatableSection(this);" href="javascript:" title="' + removetext + '">' + removetext + '</a><span class="link-divider">/</span><a class="ff-alink ff-add" onclick="AddToRepeatableSection(this);" href="javascript:" title="' + addtext + '">' + addtext + '</a></div>';
}

function safeInt(intValue, defaultValue) {
    if (!isNaN(parseInt(intValue))) {
        return parseInt(intValue);
    }
    return defaultValue;
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
        console.log('[Error] unexpected! Method[getSafeBoolean] Ex[Below]');
        console.log(err);
    }
    return returnBool;
}

function ResetRepeatedSectionItem(repeatElem, initialLoad) {
    $(repeatElem).find(".ff-item-row .ff-col-2>input,.ff-item-row .ff-col-2>textarea,.ff-item-row .ff-col-2>select").each(function () {
        var elementVisible = false;
        if ($(this).parent().parent().css('display') != 'none') {
            elementVisible = true;
        }
        switch ($(this).prop('type')) {
            case "file":

                break;
            case "text":
            case "textbox":
            case "textarea":
                $(this).parent().find('.custom-flex-control-container').remove();
                $(this).parent().find('.select2-container').remove();
                //$(this).val('');

                initFlexControl(this, false);
                break;
            case "radio":
            case "checkbox":
                // $(this).prop('checked', false);
                break;
            case "select-one":
                $(this).parent().find('.custom-flex-control-container').remove();
                $(this).parent().find('.select2-container').remove();
                //$(this).prop('selectedIndex', -1);
                initFlexControl(this, false);
                break;
            case "select-multiple":
                $(this).parent().find('.custom-flex-control-container').remove();
                $(this).parent().find('.select2-container').remove();
                // $(this).prop('selectedIndex', -1);
                initFlexControl(this, false);
                break;
        }
    });

    $(repeatElem).find("div[name=FileUploadLabel]").remove();
    if (!initialLoad) {
        if ($(repeatElem).find("div[vatt='CAPTCHA']").length >= 1) {
            var recaptchaSiteKey = $('#recaptchaSiteKey').val();
            $(repeatElem).find('.ff-captcha').each(function (indx, colItem) {
                $(colItem).find('div[vatt="CAPTCHA"]').find('>div').first().remove();
                var cId = $(colItem).find('div[vatt="CAPTCHA"]').attr('id');
                grecaptcha.render(cId, {
                    'sitekey': recaptchaSiteKey,
                    'callback': verifyCallback
                });
            });
        }
    }

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

function InitializeSignatureElement(signatureWrapElement) {
    ///// signatureWrapElement .ff-esignature-wrapper
    var signType = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signtype', 'full');
    var signOptions = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signoptions', 'typed');
    var signLabel = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signlabel', 'Full Name');
    var signDate = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signdate', 'Date');
    var signDateHide = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signdatehide', 'false');
    var signAgreeHide = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signagreehide', 'true');
    var signAgree = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-signagree', 'I agree to terms and services');
    var signEmailLabel = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-emaillabel', 'Email');
    var signEmailEnabled = getAttributeNameIfExists($(signatureWrapElement).find('.ffd-esignature-input'), 'data-emailenabled', 'false');

    if (signEmailEnabled == true || signEmailEnabled == 'true') {
        $(signatureWrapElement).find('.ff-email-verification input').attr('data-isrequired', true);
        $(signatureWrapElement).find('.ff-email-verification').slideDown();
        $(signatureWrapElement).find(".ff-email-verification .ffsign-label>label").html(signEmailLabel);
        $(signatureWrapElement).find('.ff-email-verification .ffsign-label').append('<span class="ff-required-mark">*</span>');
    } else {
        $(signatureWrapElement).find('.ff-email-verification').slideUp();
        $(signatureWrapElement).find('.ff-email-verification').hide();
        $(signatureWrapElement).find('.ff-email-verification input').attr('data-isrequired', false);
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
    var signInstance = $(signatureWrapElement).find('.ff-signwrapper.ff-typed .doc-sign-name').signaturePad(options);

    var signInstanceDate = $(signatureWrapElement).find('.ff-signwrapper.ff-typed .doc-sign-date').signaturePad(optionsDate);
    options['drawOnly'] = true;
    var signInstance = $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-name').signaturePad(options);

    optionsDate['drawOnly'] = true;
    var signInstanceDate = $(signatureWrapElement).find('.ff-signwrapper.ff-drawn .doc-sign-date').signaturePad(optionsDate);
    /*Updating properties*/
    $(signatureWrapElement).find('.ff-chkagree > label').html(signAgree);
    $(signatureWrapElement).find('.ff-signwrapper').each(function (ind, signElement) {
        $(signElement).find('.doc-sign-name .ffsign-label>label').html(signLabel);
        $(signElement).find('.doc-sign-date .ffsign-label>label').html(signDate);
        if (signDateHide == true || signDateHide == 'true') {
            $(signElement).find('.doc-sign-date input[type="hidden"]').attr('data-isrequired', false);
            $(signElement).find('.doc-sign-date').hide();
        } else {
            $(signElement).find('.doc-sign-date input[type="hidden"]').attr('data-isrequired', true);
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
    if (signAgreeHide == true || signAgreeHide == 'true') {
        $(signatureWrapElement).find('.ff-chkagree > input').attr('data-isrequired', false);
        $(signatureWrapElement).find('.ff-chkagree').hide();
    } else {
        $(signatureWrapElement).find('.ff-chkagree').show();
        $(signatureWrapElement).find('.ff-chkagree > input').attr('data-isrequired', true);
    }

}

function initFlexControl(elem, isReadOnly) {

    switch ($(elem).data('flexcontrol')) {
        case "picklist-combobox":
            try {
                $(elem).select2('destroy');
                if ($(elem).prop("disabled") == false)
                    $(elem).prop("disabled", isReadOnly);
                $(elem).select2();
            } catch (err) {}
            break;
        case "picklist-radiobutton":
            break;
        case "picklist-radiobutton-vertical":
            $(elem).SelectToRadio('destroy');
            if ($(elem).attr('disabled') == 'disabled' || isReadOnly) {
                $(elem).SelectToRadio({
                    controlType: 'ff-ext-radio',
                    alignment: 'vertical',
                    readonly: true
                });
            } else {
                $(elem).SelectToRadio({
                    controlType: 'ff-ext-radio',
                    alignment: 'vertical'
                });
            }
            break;
        case "picklist-radiobutton-horizontal":
            $(elem).SelectToRadio('destroy');
            $(elem).removeClass('custom-select-offscreen');
            $(elem).prev().remove();
            if ($(elem).attr('disabled') == 'disabled' || isReadOnly) {
                $(elem).SelectToRadio({
                    controlType: 'ff-ext-radio',
                    alignment: 'horizontal',
                    readonly: true
                });
            } else {
                $(elem).SelectToRadio({
                    controlType: 'ff-ext-radio',
                    alignment: 'horizontal'
                });
            }
            break;
        case "multipicklist-multi-tags":
            try {
                $(elem).select2('destroy');
                if ($(elem).prop("disabled") == false)
                    $(elem).prop("disabled", isReadOnly);

                $(elem).select2();
            } catch (err) {}
            break;
        case "multipicklist-multi-tags-check":
            try {
                $(elem).select2('destroy');
                if ($(elem).prop("disabled") == false)
                    $(elem).prop("disabled", isReadOnly);

                $(elem).select2({
                    closeOnSelect: false,
                    dropdownCssClass: 'ff-multi-checkbox'
                });
            } catch (err) {}

            break;
        case "multipicklist-checkbox-vertical":
            $(elem).SelectToRadio('destroy');
            $(elem).removeClass('custom-select-offscreen');
            $(elem).prev().remove();
            if ($(elem).attr('disabled') == 'disabled' || isReadOnly) {
                $(elem).SelectToRadio({
                    controlType: 'ff-ext-checkbox',
                    alignment: 'vertical',
                    readonly: true
                });
            } else {
                $(elem).SelectToRadio({
                    controlType: 'ff-ext-checkbox',
                    alignment: 'vertical'
                });
            }
            break;
        case "multipicklist-checkbox-horizontal":
            $(elem).SelectToRadio('destroy');
            $(elem).removeClass('custom-select-offscreen');
            $(elem).prev().remove();
            if ($(elem).attr('disabled') == 'disabled' || isReadOnly) {
                $(elem).SelectToRadio({
                    controlType: 'ff-ext-checkbox',
                    alignment: 'horizontal',
                    readonly: true
                });
            } else {
                $(elem).SelectToRadio({
                    controlType: 'ff-ext-checkbox',
                    alignment: 'horizontal'
                });
            }
            break;
        case "integer-starrating":
            var minRating = $(elem).attr('data-flex-min');
            var maxRating = $(elem).attr('data-flex-max');
            var minLabel = $(elem).attr('data-flex-minlabel');
            var maxLabel = $(elem).attr('data-flex-maxlabel');

            $(elem).ffrating('destroy');
            if ($(elem).val() != '' && $(elem).val() != undefined)
                $(elem).val(Math.round($(elem).val()));
            var readOnly = $(elem).attr('readonly');
            $(elem).attr('data-flex-min', minRating);
            $(elem).attr('data-flex-max', maxRating);
            $(elem).attr('data-flex-minlabel', minLabel);
            $(elem).attr('data-flex-maxlabel', maxLabel);

            if ($(elem).attr('onchange') == null) {
                $(elem).ffrating('show', {
                    readonly: readOnly,
                    showSelectedRating: true
                });
            } else {
                $(elem).ffrating('show', {
                    readonly: readOnly,
                    showSelectedRating: true,
                    onSelect: function (value, text) {

                        $(elem).trigger('change');
                    }
                });
            }

            break;
        case "integer-npsrating":
            var minRating = $(elem).attr('data-flex-min');
            var midRating = $(elem).attr('data-flex-middle');
            var maxRating = $(elem).attr('data-flex-max');
            var minLabel = $(elem).attr('data-flex-minlabel');
            var midLabel = $(elem).attr('data-flex-middlelabel');
            var maxLabel = $(elem).attr('data-flex-maxlabel');

            $(elem).ffrating('destroy');
            if ($(elem).val() != '' && $(elem).val() != undefined)
                $(elem).val(Math.round($(elem).val()));
            var readOnly = $(elem).attr('readonly');
            $(elem).attr('data-flex-min', minRating);
            $(elem).attr('data-flex-middle', midRating);
            $(elem).attr('data-flex-max', maxRating);
            $(elem).attr('data-flex-minlabel', minLabel);
            $(elem).attr('data-flex-middlelabel', midLabel);
            $(elem).attr('data-flex-maxlabel', maxLabel);


            if ($(elem).attr('onchange') == null) {
                $(elem).ffrating('show', {
                    readonly: readOnly,
                    isStar: false
                });
            } else {
                $(elem).ffrating('show', {
                    readonly: readOnly,
                    isStar: false,
                    onSelect: function (value, text) {

                        $(elem).trigger('change');
                    }
                });
            }


            break;
        default:
            break;
    }
}

function safeInt(intValue, defaultValue) {
    if (!isNaN(parseInt(intValue))) {
        return parseInt(intValue);
    }
    return defaultValue;
}

function LoadCSS(hrefLink) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", hrefLink);
    document.getElementsByTagName("head")[0].appendChild(fileref);
}
/*Functions to initialize repeatable sections ends*/