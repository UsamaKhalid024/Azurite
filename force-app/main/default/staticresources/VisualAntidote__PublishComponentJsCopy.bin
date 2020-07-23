
			
    function resetselect() {
    console.log(' reset select ');
        $(".MainTabContainer select").select2();
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
        var hostedformtextinputid = $('.hostedFormScriptTextareaClass').attr('id');
        $('.HostedFormText').attr('data-clipboard-target', hostedformtextinputid);

        var embedcodetextinputid = $('.embedCodeTextAreaClass').attr('id');
        $('.EmbedCodeText').attr('data-clipboard-target', embedcodetextinputid);


        var clipEmbed = new ZeroClipboard(
            $('.EmbedCodeText'), {
                moviePath: "{!URLFOR($Resource.Clipboard,'ZeroClipboard.swf')}"
            }
        );

        var clipHosted = new ZeroClipboard(
            $('.HostedFormText'), {
                moviePath: "{!URLFOR($Resource.Clipboard,'ZeroClipboard.swf')}"
            }
        );
        
             clipEmbed.addEventListener('complete',function(client,text) {             	
                //message copy 
                switch(this.id) {
                    case 'clip_copyEmbedCodeText':
                        $("#dialog-confirm").html("<div class='dialogHeader'><div class='dialogIcon dialogIconOK'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>Your embed code was copied to the clipboard! </div><br /><div class='secondary'>Simply paste the code into your website using <b>Command+V</b> on Mac or <b>Ctrl+V</b> on Windows.</div></div>");
                        break;
                    case 'clip_copyHostedFormText':
                        $("#dialog-confirm").html("<div class='dialogHeader'><div class='dialogIcon dialogIconOK'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>Your hosted form link code was copied to the clipboard! </div></div>");
                        break;
                }                
                
                
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
        newWin = window.open(url, 'Popup', 'height=500,width=600,left=' + left + ',top=' + top + ',resizable=no,scrollbars=yes,toolbar=no,status=no');
    }

    function lookupPick2Original(a, b, c, d, e, f, g, h) {
        if($("#defaultLookupValue").attr('name') == undefined || $("#defaultValue").attr('name') == '')
            $("input[id='" + c + "']").val(e);
        else {
            $("#defaultLookupValueHidden").val(d);
            $("#defaultLookupValue").val(e);

        }
        newWin.close();
    }

    function lookupPick2(a, b, c, d, e, f, g, h) {
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
            else {}

        }

        console.log(' active tab ' + activeTab());
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
 var focusElement; //keep the element at which the caret was lastly
    var selectionRange ;//for IE7&8

var position;


    //Handle key and mouse up for the editor's HTML area in order to keep track of the caret position
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
   
	try{
		   $('#email-content-editor').freshereditor({
							toolbar_selector: "#email-editor-toolbar",
							excludes: ['removeFormat', 'insertheading4',  'strikethrough',   'backcolor','insertorderedlist', 'insertunorderedlist', 'insertparagraph', 'blockquote', 'code', 'superscript', 'subscript']
						});
						$("#email-content-editor").freshereditor("edit", true);
						$("#email-content-editor").on('change', function() {
       ModifySelection(this);
    });
		 }
		 catch(err)
		 {
		 console.log(' FresherEditor toolbar error: '+err.message);
		 }
		       
		 
		 
    }
    function ModifySelection (editorelement) {
           
            $(editorelement).find("*").removeAttr("style");
            $(editorelement).find("*").removeAttr("class");
        }

    
     function insertContentInEditor(html)
    {

        if(focusElement !== undefined) {
            console.log(' focusElement text added' + html);
            $(focusElement).after(html);
        } else if(selectionRange !== undefined) { //IE7 and IE8
            console.log(' selectionRange pasthtml ' + html);
            selectionRange.pasteHTML(html);
        } else {
            var currentContent = $("#email-content-editor").html();
            console.log(' currentContent ');
            $("#email-content-editor").html(currentContent + html);
        }



    }
 function enableInsertField() {
      
 
  
 var selecttext = $('.selectSBELookup').select2("val");
        console.log(' Selected text ' + selecttext);
        if(selecttext != '')
        {
          
         $('#email-editor-custom-toolbar').find('#insert-field-btn').attr('data-fieldname',' {{' + selecttext + '}} ');
        
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
            
            
            insertContentInEditor($(elem).attr('data-fieldname')); 
         
        }
    }   



     

    function emailWizardbtnClick(elem)
    {
        var nextlink = $(elem).attr('data-next-link');


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
                    emailProcessFirstStep(nextlink);

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
	function emailWizardbtnClickORIGINAL(elem)
    {
        var nextlink = $(elem).attr('data-next-link');


        if(nextlink == undefined || nextlink == '' || dataprocess != 'undefined')
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
                    emailProcessFirstStep(nextlink);

                }
                else
                {
                    showAlert('alertEmailValidation', 'Please select an audience');

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
    function emailProcessFirstStep(nextlink)
    {
        /*$('.nav-wizard-container ul.nav-wizard>li').each(function(index, obj) {
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
        });*/
        $('.nav-wizard-container>.navbar>.horizontal-tab-content>.tab-pane').each(function(index, obj) {
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
        var emaillookupvalue = $('#defaultSBELookupValueHidden').val();

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

        if($('#chkbxSBEEmailUpdate').prop('checked'))
        {
            isemailprefill = true;
            $('#chkbxSBEEmailUpdateHidden').val(isemailprefill);
              console.log(' emailProcessFirstStep isprefill true-'+isemailprefill);
        }
        else
        {
         isemailprefill = false;
            $('#chkbxSBEEmailUpdateHidden').val(isemailprefill);
             console.log(' emailProcessFirstStep isprefill false-'+isemailprefill); 
        }
        getRemoteEmailTemplateJs();
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
            var emailtemplate = $("#email-content-editor").html();

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
        $('#' + elemid).find('.alert-msg').html(alertmsg);
    }

    function hideParentAlert(childid)
    {
        $(childid).closest(".alert-msg").html('');
        $(childid).parent(".alert").hide();
    }

    function hideAlert(elemid)
    {
        $('#' + elemid).find('.alert-msg').html('');
        $('#' + elemid).hide();
    }
function closeAlert(elemid)
    {
    console.log('here');
        $(elemid).parent().find('.alert-msg').html('');
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


 


  
    function SetBreadCrumb()
    {
        var formeditorurl = "#";
        var formpublishurl = "#";
        if('FormEditor'.toLowerCase() == '{!$CurrentPage.Name}'.toLowerCase())
        {
            formeditorurl = '{!$Site.BaseUrl}' + 'FormEditor?id=' + '{!ffrecord}';
        }

    }

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

 
  