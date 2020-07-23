(function ($, undefined) {
    $.fn.getCursorPosition = function () {
        var el = $(this).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }
})(jQuery);

function resetselect() {
    console.log(' reset select ');
    $(".MainTabContainer select.select-publish").select2();
}
var clientelement = "";
var clientelement2 = "";



function DummyOnchange(elem) {
    console.log('Value change to ' + $('.selectSBELookupObj').find(":selected").value);
    if(this.value != '')
    {
        hideAlert('alertEmailValidation');
        $('#defaultSBELookupValueHidden').val($('.selectSBELookupObj').find(":selected").value);
    }
}
function DummyELOnchange(elem) {
    console.log('Value change to ' + $('.selectELLookup').find(":selected").value);
    if(this.value != '')
    {
        hideAlert('alertExportLinkValidation');
        $('#defaultLookupValueHidden').val($('.selectELLookup').find(":selected").value);
    }
}
function validateLookupField(elemid)
{
    
    var elem=document.getElementById(elemid);
    if(elemid=='defaultLookupValue' && $(elem).val()=='')
    {
        console.log('value is empty 1');
        $('#defaultLookupValueHidden').val('');
    }
    if(elemid=='defaultSBELookupValue' && $(elem).val()=='')
    {
        console.log('value is empty 2');
        $('#defaultSBELookupValueHidden').val('');
    }
    
}
function CopyToClipBoard() {
    CopyToClipBoardForLanguages();
}
function CopyToClipBoardForLanguages() {
    
    
    
    var clipCopyCode = new ZeroClipboard($('.prefill-code-lang-tabs').find('.copy-code-text').each(function () { }), {
        moviePath: "{!URLFOR($Resource.Clipboard,'ZeroClipboard.swf')}"
    });
    var clipPublicKey = new ZeroClipboard(
        $('.PublicKeyText'), {
            moviePath: "{!URLFOR($Resource.Clipboard,'ZeroClipboard.swf')}"
        }
    );
    
    
    clipCopyCode.addEventListener('complete',function(client,text) {              
        
        
        console.log('Clipboard event ');
        $("#dialog-confirm").html("<div class='dialogHeader'><div class='dialogIcon dialogIconOK'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>Your language code was copied to the clipboard! </div></div>");
        
        
        
        // Define the Dialog and its properties.
        $("#dialog-confirm").dialog({
            resizable: false,
            modal: true,
            title: "Close",
            height: 150,
            width: 455,
            buttons: {
                "Close": {
                    click: function () {
                        $(this).dialog("close");
                    },
                    text: 'Close',
                    class: 'vabutton1'
                }
            }
        });
        
    });  
    
    
}

function openLookupPopup(Ltype, Rtype) {
    var left = (screen.width / 2) - (600 / 2);
    var top = 250
    
    
    var url = '/apex/FastFormsLookup?ltype=' + Ltype + '&rtype=' + Rtype;
    var url = '/apex/FastFormsLookup?ltype='+Ltype+'&rtype='+Rtype+'&sourcePage=publishTab';
    newWin = window.open(url, 'Popup', 'height=500,width=600,left=' + left + ',top=' + top + ',resizable=no,scrollbars=yes,toolbar=no,status=no');
}
function openLookupPopupForDynamicTrigger(Ltype, Rtype) {
    var left = (screen.width / 2) - (600 / 2);
    var top = 250
    
    
    var url = '/apex/FastFormsLookup?ltype=' + Ltype + '&rtype=' + Rtype;
    var url = '/apex/FastFormsLookup?ltype='+Ltype+'&rtype='+Rtype+'&sourcePage=fastprefill';
    newWin = window.open(url, 'Popup', 'height=500,width=600,left=' + left + ',top=' + top + ',resizable=no,scrollbars=yes,toolbar=no,status=no');
}


function lookupPick2(a, b, c, d, e, f, g, h) {
    console.log('[lookupPick2] Starts...');

    if(g == 'cm_prefill'){
        CommunityPrefill_Lookup_LupeReturn(d, e);
    }
    else {
        if($("#defaultLookupValue").attr('name') == undefined || $("#defaultValue").attr('name') == '')
        {
            $("input[id='" + c + "']").val(e);
        }
        else {
            var activetab = activeTab();
            if(activetab == 3)
            {
                $("#defaultLookupValueHidden").val(d);
                $("#defaultLookupValue").val(e);
                hideAlert('alertExportLinkValidation');
            }
            else if(activetab == 2)
            {
                $("#defaultSBELookupValueHidden").val(d);
                $("#defaultSBELookupValue").val(e);
                hideAlert('alertEmailValidation');
            }
            else {

            }
            
        }
        console.log(' active tab ' + activeTab());
    }
    
    newWin.close();
}

function activeTab()
{
    var counter = 0;
    $('.sfff-tab').each(function(index, obj) {
        
        if($(obj).hasClass('active'))
        {
            
            counter = index;
        }
    });
    return counter;
}

function exportLinks() {
    Intercom('trackEvent', 'exported-links');
    var lookupvalue = $('#defaultLookupValueHidden').val();
    console.log(' lookupval is ' + lookupvalue +' select list '+$('.vertical-tab-content .active select').length);
    
    var isprefill = true;
    var isalist = false;
    if($('#exportlinksection .vertical-tab-content .active select').length == 1)
    {
        
        lookupvalue = $('#exportlinksection .vertical-tab-content .active').find('select.selectELLookup').find(":selected").val();
        $('#defaultLookupValueHidden').val(lookupvalue);
        isalist = true;
    }
    else
    {
        isalist = false;
    }
    
    console.log(' lookupval  ' + lookupvalue + ' isalist ' + isalist + ' isprefill  ' + isprefill);
    
    if($('#defaultLookupValueHidden').val() != undefined && $('#defaultLookupValueHidden').val() != '')
    {
        ExportLinks(lookupvalue, isalist, isprefill);
    }
    else
    {
        showAlert('alertExportLinkValidation', 'Please select an audience');
    }
    
    
}

function setToolbar()
{
    
    var navListItems = $('.nav-wizard-container ul.nav-wizard li a'),
        allWells = $('#sendEmailWizard .tab-pane');
    
    /* allWells.hide();*/
    
    navListItems.click(function(e)
                       {
                           e.preventDefault();
                           var $target = $($(this).attr('href')),
                               $item = $(this).closest('li');
                           
                           if(!$item.hasClass('disabled')) {
                               navListItems.closest('li').removeClass('active');
                               $item.addClass('active');
                               allWells.hide();
                               $target.show();
                           }
                       });
    
    
}
function setEmailEditorToolbar(parentElem)
{
    
    var parentEMailBox=parentElem;//$('#email-content-editor-textarea').parent();
    $(parentEMailBox).find('#email-editor-toolbar').hide();
    //$(parentEMailBox).find('#email-editor-custom-toolbar').hide();
    $(parentEMailBox).find('#email-content-editor').hide(); 
    var selectItems=[]; 
    $('select.selectSBELookup>option').each(function(i,optionElem){
        
        selectItems.push([$(optionElem).html(),$(optionElem).val()]);
        
    });
    $('select.selectSBELookup optgroup').each(function(i,optGrpElem){
        selectItems.push([$(optGrpElem).attr('label'),'']);
        
        $(optGrpElem).find('>option').each(function(indx,optionElem){
            selectItems.push([$(optionElem).html(),$(optionElem).val()]);
        });
    });    
    initializeCKEDITORForEmailContent(parentElem);
}

function promptWebsiteLink(elementSource,linkType) {
    
    var fieldhtml = $(elementSource).attr('data-fieldname');
    
    if (linkType == 'embed'){
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
                click: function() {
                    $(this).dialog('close');
                    var websitelinkTitle = $('#dialogWebsiteLinkTitle').val();
                    if(!isNullOrEmpty(websitelinkTitle))
                    {
                        fieldhtml=fieldhtml.substring(0,fieldhtml.lastIndexOf('|'));
                        fieldhtml=  fieldhtml+'|'+websitelinkTitle+']]';
                    }                        
                    if (linkType == 'embed'){                            
                        var websitelink = $('#dialogWebsiteLink').val();
                        try{
                            if(!isNullOrEmpty(websitelink))
                            {
                                fieldhtml=  fieldhtml.replace('|localhost|','|'+websitelink+'|');
                            }
                            
                        }
                        catch(err){
                            
                        }
                    }
                    insertContentInEditor(fieldhtml);
                },
                text: 'Add Link',
                'class': 'vabutton1'
            },
            "No": {
                click: function() {
                    $(this).dialog('close');
                    
                },
                text: 'Cancel',
                'class': 'vabutton2'
            }
            
            
        },
        open: function(event, ui) {
            $('.ui-dialog :button').blur();
        }
    });
    
    
    
}      





function emailWizardbtnClick(elem)
{        
    var nextlink = $(elem).attr('data-next-link');
    var parentPublishMainWrapper=$(elem).parents('.publish-box-main-wrapper');
    
    
    if((nextlink != 'undefined' || nextlink == '') && dataprocess != 'undefined' )
    {
        var dataprocess = $(elem).attr('data-process');
        if(dataprocess != 'undefined' && dataprocess == "saveasdraft")
        {
            processEmailData(true);
        }
        else if(dataprocess != 'undefined' && dataprocess == "send")
        {
            processEmailData(false);
        }
            else if(dataprocess != 'undefined' && dataprocess == "pass-to-next")
            {
                console.log('  process first step data');
                if($('#emailfirsttab .vertical-tab-content .active select').length == 1)
                {
                    
                    var emaillookupvaluetemp = $('#emailfirsttab .vertical-tab-content .active').find('select.selectSBELookupObj').find(":selected").val();
                    $('#defaultSBELookupValueHidden').val(emaillookupvaluetemp);
                    
                }
                if(isFirstStepDataValid())
                {
                    console.log('  process first step data 1 lookup value-' + $('#defaultSBELookupValueHidden').val());
                    hideAlert('alertEmailValidation');
                    setEmailEditorToolbar(parentPublishMainWrapper);
                    emailProcessFirstStep(nextlink,parentPublishMainWrapper);
                    
                }
                else
                {
                    showAlert('alertEmailValidation', 'Please select an audience');
                    
                }
            }
                else if(dataprocess != 'undefined' && dataprocess == "go-back")
                {
                    if(nextlink!='undefined' && nextlink!='')
                    {
                        console.log(' in emailProcessGoBack');
                        emailProcessGoBack(nextlink);
                    }
                    else
                    {
                        console.log('  emailProcessGoBack nextlink undefined ');
                    }
                }
    }
}

var isemailprefill = false;
var isemaillookupisalist = false;
var emaillookupvalue = '';

function emailProcessGoBack(nextlink)
{
    $('.nav-wizard-container>.navbar>.horizontal-tab-content>.tab-pane').each(function(index, obj) {
        console.log('  emailProcessGoBack data body class  nextlink '+nextlink);
        if(nextlink != 'undefined' && nextlink != '')
        {
            console.log('  emailProcessGoBack data body class added nextlink '+nextlink);
            $(obj).removeClass('active');
            if(nextlink == index)
            {
                $(this).addClass('active');
            }
        }
        
    });
}
function refreshRelatedObjectInfo(parentPublishMainWrapper){
    
    var selectHTML =generatePublishSelectHtml('.selectSBELookupTempWrapper');
    restructurePublishSelectElement($(parentPublishMainWrapper).find('select.selectSBELookup'), selectHTML);
    var selectHTMLEmailTo =generatePublishSelectHtml('.selectSBEEmailToTEMPWrapper');
    restructurePublishSelectElement($(parentPublishMainWrapper).find('select.selectSBEEmailTo'), selectHTMLEmailTo);
    $('.mainEmailWrapperCSS').find('select.select-publish').select2();
    
}
function emailProcessFirstStep(nextlink,parentPublishMainWrapper)
{
    refreshRelatedObjectInfo(parentPublishMainWrapper);
    $('#sendemailsection .nav-wizard-container ul.nav-wizard>li').each(function(index, obj) {
        console.log('  emailProcessFirstStep data index '+index);
        if(nextlink != undefined && nextlink != '')
        {
            $(obj).removeClass('active');
            if(nextlink == index)
            {
                console.log('  emailProcessFirstStep data class added nextlink '+nextlink);
                $(this).addClass('active');
            }
        }
    }); 
    $('#sendemailsection .nav-wizard-container>.navbar>.horizontal-tab-content>.tab-pane').each(function(index, obj) {
        if(nextlink != undefined && nextlink != '')
        {
            console.log('  emailProcessFirstStep data body class added nextlink '+nextlink);
            $(obj).removeClass('active');
            if(nextlink == index)
            {
                $(this).addClass('active');
            }
        }
        
    });
    var emaillookupvalue = $(parentPublishMainWrapper).find('#defaultSBELookupValueHidden').val();
    
    if($('#emailfirsttab .vertical-tab-content .active select').length == 1)
    {
        
        emaillookupvalue = $('#emailfirsttab .vertical-tab-content .active').find('select.selectSBELookupObj').find(":selected").val();
        $('#defaultSBELookupValueHidden').val(emaillookupvalue);
        isemaillookupisalist = true;
    }
    if($('#emailfirsttab .vertical-tab-content .active .lookupInput').length == 1)
    {
        isemaillookupisalist = false;
    }
    
    //if($('#chkbxSBEEmailUpdate').prop('checked'))
    if($(parentPublishMainWrapper).find('.prefill-mode-box-inner').hasClass('mode-active'))
    {
        isemailprefill = true;
        $(parentPublishMainWrapper).find('#chkbxSBEEmailUpdateHidden').val(isemailprefill);
        
    }
    else
    {
        isemailprefill = false;
        $(parentPublishMainWrapper).find('#chkbxSBEEmailUpdateHidden').val(isemailprefill);
        
    }
    remoteGetEmailAlertTemplatesListJS($(parentPublishMainWrapper).find('.email-content-box'));
    $(parentPublishMainWrapper).find('.email-template-type select.email-template-select').select2();
    getRemoteEmailTemplateJs();
}
function resetEmailAlertTemplateList(parentEmailContentBox,ffOptionArr){
    var selecthtml = generateAlertTemplateSelectHtml(ffOptionArr,null);
    $(parentEmailContentBox).find('.email-template-type select.email-template-select').each(function (rindx, selectElement) {             
        var selectedValue = $(selectElement).val();
        var elemClass = $(selectElement).attr("class"); 
        $(selectElement).empty();
        $(selectElement).append(selecthtml);             
        initializeSelect2PlaceHolder(selectElement);
        if (!isNullOrEmpty(selectedValue)) { 
            $(selectElement).select2("val", selectedValue);
        }
        
    });
}

function processEmailData(isdraft) {
    if(isSecondStepDataValid())
    {
        var isemailtotext = false;
        emaillookupvalue = $('#defaultSBELookupValueHidden').val();
        isemailprefill = $('#chkbxSBEEmailUpdateHidden').val();
        var xmlfields = '<emailfields>';
        xmlfields += '<emailsubject>' + $('#txtbxemailsubject').val() + '</emailsubject>';
        xmlfields += '<emailcc>' + $('#txtbxemailCc').val() + '</emailcc>';
        xmlfields += '<emailbcc>' + $('#txtbxemailBcc').val() + '</emailbcc>';
        if($('#txtbxemailTo').css('display') != 'none' && ($('#txtbxemailTo').val() != undefined && $('#txtbxemailTo').val() != ''))
        {
            isemailtotext = true;
            xmlfields += '<emailto>' + $('#txtbxemailTo').val() + '</emailto>';
            xmlfields += '<isemailtotext>true</isemailtotext>';
        }
        if($('select.selectSBEEmailTo').css('display') != 'none' && (typeof($('.selectSBEEmailTo').select2("val")) !== "undefined" || $('.selectSBEEmailTo').select2("val") != ''))
        {
            isemailtotext = false;
            xmlfields += '<isemailtotext>false</isemailtotext>';
            xmlfields += '<emailto>' + $('select.selectSBEEmailTo').select2("val") + '</emailto>';
        }
        xmlfields += '</emailfields>';
        var emailtemplate = CKEDITOR.instances[$(".email-template-box .ckeditortext").attr('id')].getData(); 
        
        console.log(' processEmailData xmlfields' + xmlfields + ' isdraft-' + isdraft + ' isemailprefill- ' + isemailprefill + ' is lookuplist -' + isemaillookupisalist + ' is email lookup -' + emaillookupvalue + ' emailtemplate-' + emailtemplate);
        if($('#defaultSBELookupValueHidden').val() != undefined && $('#defaultSBELookupValueHidden').val() != '')
        {
            SendOrSaveEmail(xmlfields, emailtemplate, isdraft, isemailprefill, isemaillookupisalist, emaillookupvalue);
        }
        else
        {
            showAlert('alertEmailValidation', 'Please select an audience');
        }
    }
    else
    {
        showAlert('alertEmailValidation', 'Please select target email');
        
    }
}

function isFirstStepDataValid()
{
    if($('#emailfirsttab .vertical-tab-content .active .lookupInput').length == 1)
    {
        if($('#defaultSBELookupValueHidden').val() == undefined || $('#defaultSBELookupValueHidden').val() == '')
        {
            return false;
        }
    }
    if($('#emailfirsttab .vertical-tab-content .active select').length == 1)
    {
        
        if($('select.selectSBELookupObj').css('display') != 'none' && (typeof($('select.selectSBELookupObj').select2("val")) === "undefined" || $('select.selectSBELookupObj').select2("val") == ''))
        {
            return false;
        }
    }
    return true;
}

function isSecondStepDataValid()
{
    if($('#txtbxemailTo').css('display') != 'none' && ($('#txtbxemailTo').val() == undefined || $('#txtbxemailTo').val() == ''))
    {
        console.log(' SecondStepDataValid is not valid');
        return false;
    }
    
    if($('select.selectSBEEmailTo').css('display') != 'none' && (typeof($('.selectSBEEmailTo').select2("val")) === "undefined" || $('.selectSBEEmailTo').select2("val") == ''))
    {
        console.log(' SecondStepDataValid is not valid');
        return false;
    }
    console.log(' SecondStepDataValid is valid');
    return true;
}

function showAlert(elemid, alertmsg)
{
    $('#' + elemid).show();
    $('#' + elemid).find('.vff-alert-msg').html(alertmsg);
}

function hideParentAlert(childid)
{
    $(childid).closest(".vff-alert-msg").html('');
    $(childid).parent(".alert").hide();
}

function hideAlert(elemid)
{
    $('#' + elemid).find('.vff-alert-msg').html('');
    $('#' + elemid).hide();
}
function closeAlert(elemid)
{
    console.log('here');
    $(elemid).parent().find('.vff-alert-msg').html('');
    $(elemid).parent().hide();
}
function parsexml(xmlstr)
{
    /*parse the Emaildraft configuration xml attriutes*/
    
    if(window.DOMParser)
    {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlstr, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlstr);
    }
    console.log(' subject ' + returnSafestr(xmlDoc.getElementsByTagName("emailsubject"))); /*[0].childNodes[0].nodeValue);*/
}

function returnSafestr(elem)
{
    var returnstr = '';
    if(elem != undefined && elem[0] != undefined && elem[0].childNodes[0] != undefined)
    {
        returnstr = elem[0].childNodes[0].nodeValue;
    }
    return returnstr;
}

function previewHtml(html) {
    
    $("#previewdialog").html(html);
    
    // Define the Dialog and its properties.
    $("#previewdialog").dialog({
        resizable: false,
        modal: true,
        title: "Close",
        height: 150,
        width: 455,
        buttons: {
            "Close": function() {
                $(this).dialog('close');
            }
        }
    });
}

function previewHtml() {
    var html = $("#email-content-editor").html();
    $("#previewdialog").html(html);
    
    // Define the Dialog and its properties.
    $("#previewdialog").dialog({
        resizable: false,
        modal: true,
        title: "Close",
        height: 150,
        width: 455,
        buttons: {
            "Close": function() {
                $(this).dialog('close');
            }
        }
    });
}




var focusElement; //keep the element at which the caret was lastly
var selectionRange ;//for IE7&8

var position;


//Handle key and mouse up for the editor's HTML area in order to keep track of the caret position

$(".fresheditable").on('change', function() {
    if(this.getSelection !== undefined) {
        console.log(' focusElement defined');
        focusElement = this.getSelection().focusNode;
    } else {
        console.log(' selectionRange defined');
        selectionRange = this.selection.createRange();
    }
});
$("#email-content-editor").on('blur', function() {
    console.log(' on blur defined');
    position = $(this).getCursorPosition();
});

function insertContentInEditor(html)
{
    
    /* if(focusElement !== undefined) {
            console.log(' focusElement text added' + addedText);
            $(focusElement).after(addedText);
        } else if(selectionRange !== undefined) { //IE7 and IE8
            console.log(' selectionRange pasthtml ' + html);
            selectionRange.pasteHTML(html);
        } else {
            var currentContent = $("#email-content-editor").html();
            console.log(' currentContent ');
            $("#email-content-editor").html(currentContent + html);
        }

*/
    var editor = CKEDITOR.instances[$(".email-template-box .ckeditortext").attr('id')];
    editor.insertHtml( html );
    
}

function enableInsertField() {
    var selecttext = $('.selectSBELookup').select2("val");
    console.log(' Selected text ' + selecttext);
    if(selecttext != '')
    {
        $('#email-editor-custom-toolbar').find('#insert-field-btn').attr('data-fieldname','[[' + selecttext + ']]');
    }
    else
    {
        $('#email-editor-custom-toolbar').find('#insert-field-btn').attr('data-fieldname','');
    }
}
function insertfieldtoHtml(elem) {
    /*insert selected option from fieldlist  to html editor*/
    
    if($(elem).attr('data-fieldname') != undefined && $(elem).attr('data-fieldname') != '')
    {
        
        if($(elem).attr('data-fieldname')=='[[-FFEmbedLink-|localhost|Embed Link]]')
        {
            promptWebsiteLink(elem,'embed');
        } else if($(elem).attr('data-fieldname')=='[[-FormstackLink-|Formstack Link]]')
        {
            promptWebsiteLink(elem,'hosted');
        }
            else
            {
                insertContentInEditor($(elem).attr('data-fieldname')); 
            }
        
    }
} 

function SetBreadCrumb()
{
    var formeditorurl = "#";
    var formpublishurl = "#";
    if('FormEditor'.toLowerCase() == '{!$CurrentPage.Name}'.toLowerCase())
    {
        formeditorurl = '{!$Site.BaseUrl}' + '/apex/FormEditor?id=' + '{!ffrecord}';
    }
    
}

//selectSBELookupTempWrapper//selectSBEEmailToTEMPWrapper
function generatePublishSelectHtml(selecteElemClass) {
    
    var tempSelectElementDiv = $(selecteElemClass);
    
    
    var sectionGrp = [];
    var sectionStart = false;
    var fieldsStart = 0;
    var fieldEnds = false;
    var genfieldsStart = 0;
    var genfieldEnds = false;
    var currentIndex = 0;
    var html = '';
    var groupPrefix = 'FieldOption';
    var fieldItemPrefix = '';
    var totalItems = $(tempSelectElementDiv).find('select > option').length;
    
    
    var fieldGrpStart = false;
    var genfieldGrpStart = false;
    //html += '<option class="fielditem" name="field-item" value="">--select an item--</option>';
    
    $(tempSelectElementDiv).find('select > option').each(function (index) {
        
        var optionText = $(this).text();
        var optionValue = $(this).val();
        
        if (optionText == '--insert merge field--' || optionText == '--select an email field--') {
            html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';
            
            fieldsStart++;
        }
        
        
        if (fieldsStart >= 0 && optionText.indexOf('Fields for') >= 0) {
            
            
            if (fieldsStart > 0) {
                if (fieldEnds) {
                    // console.log('In fieldEnds - optionText :' + optionText);
                    html += '</optgroup>';
                    fieldEnds = false;
                }
                fieldsStart++;
            } 
            html += '<optgroup class="' + groupPrefix + '" label="' + optionText + '">';
            
        }
        
        
        
        if (   fieldsStart >0 && optionValue != '' && optionText.indexOf('Fields for') < 0) {
            /*looping through field items */ 
            fieldEnds = true;
            fieldItemPrefix='fielditem';
            if (optionValue=='-FormstackLink-|Formstack Link') {
                fieldItemPrefix += ' fflink' ;
                
            }
            if (optionValue=='-FFEmbedLink-|localhost|Embed Link') {
                fieldItemPrefix += ' fflink embed-link' ;
                
            }
            html += '<option class="'+fieldItemPrefix+'" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';
            
        }
        
        
        if (index === totalItems - 1) {
            // this is the last one
            html += '</optgroup>';
        }
    });
    return html;
}
function restructurePublishSelectElement(selectElement,selecthtml)
{
    var selectedValue=$(selectElement).select2("val");
    var elemClass=$(selectElement).attr("class");
    
    $(selectElement).empty();
    $(selectElement).append(selecthtml);
    $(selectElement).select2("val", selectedValue);
}
/*Dynamic porefill methods start*/

function setPrefillModeDisplay(prefillMode,elemSource)
{
    var prefillModeParent=$(elemSource).parents('.prefill-mode-box-inner');
    var prefillWrapperElement=$(elemSource).parents('.prefill-wrapper');
    var publishOptionsTabElem= $(prefillWrapperElement).parents('.publish-box-main-wrapper');
    if(prefillMode)
    {
        $(prefillWrapperElement).find('.fastprefill-mode-box').removeClass('display-none');
        $(prefillModeParent).find('.prefill-mode-status').html('Dynamic Prefill Enabled');
        $(prefillModeParent).addClass('mode-active');
        $(prefillModeParent).parents('.MainTabContainer').find('.prefill-object-list-box-outer').slideDown(500);
        remoteGetObjectNameListJS( $(prefillModeParent).parents('.MainTabContainer'));
        if(!getSafeBoolean($(prefillModeParent).parents('.sfffpublishOptionsWrapperCSS').attr('data-isnative'),false)){
            $(prefillModeParent).parents('.MainTabContainer').find('.prefill-enabled-options-block').slideDown(200);
        }
        
        CopyToClipBoardForLanguages();
        
        $(publishOptionsTabElem).find('.send-email-header').removeClass('dp-disabled');
        $(publishOptionsTabElem).find('.send-email-body').removeClass('dp-disabled');
        $(publishOptionsTabElem).find('.export-link-header').removeClass('dp-disabled');
        $(publishOptionsTabElem).find('.export-link-body').removeClass('dp-disabled');
    }
    else
    {
        $(prefillWrapperElement).find('.fastprefill-mode-box').addClass('display-none');
        
        $(prefillModeParent).find('.prefill-mode-status').html('Dynamic Prefill Disabled');
        $(prefillModeParent).parents('.MainTabContainer').find('.prefill-object-list-box-outer').slideUp(500);
        if(!getSafeBoolean($(prefillModeParent).parents('.sfffpublishOptionsWrapperCSS').attr('data-isnative'),false)){
            $(prefillModeParent).parents('.MainTabContainer').find('.prefill-enabled-options-block').slideUp(200);
        }
        $(prefillModeParent).removeClass('mode-active');
        $(publishOptionsTabElem).find('.send-email-header').addClass('dp-disabled');
        $(publishOptionsTabElem).find('.send-email-body').addClass('dp-disabled');
        $(publishOptionsTabElem).find('.export-link-header').addClass('dp-disabled');
        $(publishOptionsTabElem).find('.export-link-body').addClass('dp-disabled');
    } 
} 
function CreateOnePrefillOption(elemMainTabContainer)
{
    var prefillObjectsElement=$(elemMainTabContainer).find('.prefill-object-list-box-inner');
    $(prefillObjectsElement).html('');
    $(prefillObjectsElement).append(getNewObjectListRowHTML());
    $(prefillObjectsElement).find('select.sel-object-list').select2();
    resetPrefillOptionsRowIcon( prefillObjectsElement);
}
function addNewObjectItemRowHTML(elemSource)
{
    var prefillObjectsElement=$(elemSource).parents('.prefill-object-list-box-inner');
    if(!isNullOrEmpty($(elemSource).attr('data-prefill-link')) && $(elemSource).attr('data-prefill-link')=='first')
    {
        prefillObjectsElement=$(elemSource).parents('.prefill-objectlist').find('.prefill-object-list-box-inner');
    }
    if($('#objectItemrowHtmlTEMP').find('select option').length>1)
    {
        var tempDiv=$('<div/>').html(getNewObjectListRowHTML());
        
        $(prefillObjectsElement).append($(tempDiv).html()); 
        $(prefillObjectsElement).find('select.sel-object-list:last').select2();
        resetPrefillOptionsRowIcon( prefillObjectsElement);
    }
    else
    {
        commonAlertMessage("You do not have any other related lookup objects available in your form.","");
    }
    
    
}
function dynamicPrefillSave(elemSource,isAutoSave)
{
    var metadata = {
        object_name: elemSource.value
    };
    Intercom('trackEvent', 'added-dynamic-prefill-object', metadata);
    var objectNameArr=[];
    var prefillObjectsElement=$(elemSource).parents('.prefill-object-list-box-inner');
    dynamicPrefillSaveByParent(prefillObjectsElement);
    
}
function regenerateKey(elemSource)
{
    remoteGetPrefillKeyJS(elemSource);
}
function remoteGetPrefillKeyJSCall(result,prefillObjectsElement){
    var generatekey=false;
    var resultObject=result.ResultSObject;
    if(isNullOrEmpty(resultObject.Prefill_Key__c))
    {
        generatekey=true;
        
    }
    remoteGetPrefillKeyJS(resultObject.Id,generatekey,prefillObjectsElement);
    
}
function dynamicPrefillSaveByParent(prefillObjectsElement,isAutoSave)
{
    var objectNameArr=[];
    
    $(prefillObjectsElement).find('.sfff-object-row').each(function(indx , objectRowElem){
        var selectedValue= $(objectRowElem).find('select.sel-object-list').select2("val");
        if(!isNullOrEmpty(selectedValue))
        {
            objectNameArr.push(selectedValue);
        }
    });
    var prefillObjectListC='';
    if(objectNameArr!=null && objectNameArr.length>0)
    {
        prefillObjectListC= objectNameArr.join(",");
    }
    
    var previousFormC={};
    
    var prefill_Object_list__c=getPrefixedOrgFieldName(orgPrefix,'Prefill_Object_Info__c');
    previousFormC[prefill_Object_list__c]=prefillObjectListC; 
    if(previousFormC!=null && Object.keys(previousFormC).length !== 0)
    {
        remoteUpdateFormPrefillInfoJS(previousFormC,prefillObjectsElement);
    }
    
}
function resetPrefillOptionsRowIcon(sfffObjectRowsParentElem)
{
    resetAvailablePrefillSelectLookupOption();
    var numberOfLookupOptions=0;
    var numObjectRowElem =$(sfffObjectRowsParentElem).children().size() ;
    
    try{
        numberOfLookupOptions=  $(sfffObjectRowsParentElem).find('select').first().find('option').length-1;
    }
    catch(err){}
    $(sfffObjectRowsParentElem).find('.sfff-delete-action').show();
    // $(sfffObjectRowsParentElem).find('.sfff-addnew-action').hide();
    
    if (numObjectRowElem==0 || numObjectRowElem < numberOfLookupOptions) {
        $(sfffObjectRowsParentElem).parent().find('.sfff-addnew-action').show();
    }
    else
    {
        $(sfffObjectRowsParentElem).parent().find('.sfff-addnew-action').hide();
    }
    
}
function deleteObjectItemRowHTML(elem) {
    $('.sfff-delete-action').hide();
    var sfffObjectRowsParentElem = $(elem).parents('.prefill-object-list-box-inner');
    
    
    $(elem).parents('.sfff-object-row').fadeOut().remove();
    resetPrefillOptionsRowIcon(sfffObjectRowsParentElem);
    
    dynamicPrefillSaveByParent(sfffObjectRowsParentElem,true);
    
}
function populatePrefillOption(elemMainTabContainer,objectListCSV)
{
    if(!isNullOrEmpty(objectListCSV))
    {
        var prefillObjectsElement=$(elemMainTabContainer).find('.prefill-object-list-box-inner');
        $(prefillObjectsElement).html('');
        var objectNamesArray=objectListCSV.split(',');
        if(objectNamesArray!=undefined)
        {
            objectNamesArray.filter(Boolean);// remove empty string item from array
            $.each(objectNamesArray,function(indx,objectName){
                $(prefillObjectsElement).append(getNewObjectListRowHTML());
                $(prefillObjectsElement).find('select.sel-object-list:last').select2();
                $(prefillObjectsElement).find('select.sel-object-list:last').select2('val',objectName);
                
            });
            
        }
        resetPrefillOptionsRowIcon( prefillObjectsElement);
    }
}

function getNewObjectListRowHTML() {
    
    return $('#objectItemrowHtmlTEMP').html();
}
function resetAvailablePrefillSelectLookupOption()
{
    var lookupSelected=[];
    $('.prefill-object-list-box-inner .sfff-object-item-1 select').each(function (indx, selectElement) {
        if($(selectElement).find('option:selected'))
        {
            // lookupSelected.push({"order":indx,"svalue":$(selectElement).val()});
            lookupSelected.push($(selectElement).val());
        }
    });
    $('.prefill-object-list-box-inner .sfff-object-item-1 select option').each(function (indx, optionelem) {
        
        $(optionelem).removeAttr('disabled', 'disabled');
        $(optionelem).removeClass('display-none');
        
    });
    
    $('.prefill-object-list-box-inner .sfff-object-item-1 select').each(function (selindx, selectElement) {
        
        $(selectElement).find('option').each(function (indx, optionelem) {
            
            if((!$(optionelem).is(':selected')  && $.inArray($(optionelem).val(), lookupSelected)>=0) || isNullOrEmpty($(optionelem).val())) {
                
                
                $(optionelem).attr('disabled', 'disabled');
                $(optionelem).addClass('display-none');
                
            }
            else{
                
            }
        });
        
    });
}
/*dynamic prefill methods end*/


function showNotification(elemid, textmsg)
{
    $('#' + elemid).show();
    $('#' + elemid).find('.msg-text-div').html(textmsg);
}
function hideNotification(elemid)
{
    $('#' + elemid).find('.msg-text-div').html('');
    $('#' + elemid).hide();
}
function hideMessage(elemid)
{
    $(elemid).parent().hide();
}
function closeNotification(elemid)
{
    
    $(elemid).parent().find('.msg-text-div').html('');
    $(elemid).parent().hide();
}


