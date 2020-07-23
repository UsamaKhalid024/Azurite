/*Helper methods for Alert/Email template feature*/
function generateAlertTemplateSelectHtml(resultFFoptionsArr) { 
    
    var fieldsStart = 0;
    var fieldEnds = false; 
    var groupIndex=0;
    var currentIndex = 0;
    var currentTemplateType = '';
    var html = ''; 
    var fieldGrpStart = false;
    
    html += '<option class="fielditem" name="field-item" value="">--select a template--</option>';
    if(resultFFoptionsArr!=null && resultFFoptionsArr.length>0){
        var totalItems = resultFFoptionsArr.length;
        $(resultFFoptionsArr).each(function (index,ffOptionItem) {
            
            var optionText = ffOptionItem.FFText;
            var optionTitle = ffOptionItem.FFTitle;
            var optionValue = ffOptionItem.FFValue;
            
            if (optionTitle != currentTemplateType) {
                fieldGrpStart = true;
                fieldsStart++;
            }
            
            if (fieldsStart > 0 && optionTitle != currentTemplateType) {
                if (fieldsStart > 0) {
                    if (fieldEnds) {
                        html += '</optgroup>';
                        fieldEnds = false;
                    }
                    fieldsStart++;
                }
                currentTemplateType=optionTitle;
                var oddEvenCounter=groupIndex%2;
                groupIndex++;
                html += '<optgroup class="FieldOption template-section-'+oddEvenCounter+'" label="'+firstCharCapitalCase(optionTitle)+' Templates">';
            }
            
            if (optionValue != '') {
                /*looping through field items */
                fieldEnds = true;
                html += '<option class="fielditem" name="field-item" value="' + optionValue + '">' + optionText + ' </option>';
            }
            
            if (index === totalItems - 1) {
                // this is the last one
                html += '</optgroup>';
            }
        });
    }
    return html;
}
function insertEmailTemplateContent(elemSource){
    var parentRowElem=$(elemSource).parents('.email-template-row');
    var featureType=safeStringValue($(parentRowElem).attr('data-feature'),'');
    var selectedval=$(elemSource).val();
    console.log('Selected template:'+selectedval);
    if(!$(elemSource).find('option:selected').hasClass('unsaved-template')){
        $(elemSource).find('option.unsaved-template').remove(); 
        initializeSelect2PlaceHolder(elemSource);
    }
    if(!isNullOrEmpty(selectedval) && selectedval!='--select a template--'){
        if(featureType=='sendbyemail'){
            /*Send by email on Publish page - email editor call*/
            remoteGetEmailTemplateInfoJS(parentRowElem,selectedval,featureType);
        }else{
            /*Payment Config- email editor call*/
            remoteGetAlertTemplateInfoJS(elemSource,selectedval);//(parentRowElem,selectedval,featureType);
        }
    }    
}
function remoteGetEmailTemplateInfoJSCallback(parentRowElem,result,featureType){
    var parentElem;
    if(featureType=='sendbyemail'){
        parentElem= parentRowElem.parents('.email-content-box');
    }
    
    var alertInfoObject= JSON.parse(result.ResultText); 
    var objectType=alertInfoObject['attributes']['type'];
    var subject ='';
    var body ='';
    if(!isNullOrEmpty(objectType) && objectType=='EmailTemplate'){
        /*Salesforce EmailTemplate object fields*/
        subject = parseSFMergeFieldsToFFMergePattern(alertInfoObject['Subject']); 
        if(isNullOrEmpty(alertInfoObject['HtmlValue'])){
            body = parseSFMergeFieldsToFFMergePattern(alertInfoObject['Body']);
            body=newlineToBr(body);
        }else{
            body = parseSFMergeFieldsToFFMergePattern(alertInfoObject['HtmlValue']);
        }
        
    }else{
        var subject_c=getPrefixedOrgFieldName(SFOrgPrefix,'Subject__c');
        var body_c=getPrefixedOrgFieldName(SFOrgPrefix,'Body__c');
        subject = alertInfoObject[subject_c]; 
        body = alertInfoObject[body_c]; 
    }
    
    $(parentElem).find('.email-subject-row input[type="text"]').val(subject);
    if (!isNullOrEmpty(body)) { 
        setContentInCKEditor($(parentElem).find('.ckeditortext').attr('id'), body);
    }
}
function parseSFMergeFieldsToFFMergePattern(content){
    if(!isNullOrEmpty(content)){
        var sfMergeFields= content.match(/{![A-Za-z0-9_.]*}/g);
        if(sfMergeFields!=null && sfMergeFields.length>0){
            $.each(sfMergeFields,function(i,item){
                console.log(' SF item'+item);
                item=item.replace('{!','').replace('}','');
                var itemTomatch = new RegExp("{!"+item+"}","g");
                content=content.replace(itemTomatch,'[['+item+']]');
            });
        }
    }
    return content;
}
function initializeCKEDITORForEmailContent(parentElem){ 
    var selectItems = []; 
    $(parentElem).find('select.form-fields-select').find('option').each(function (i, optionElem) {
        
        selectItems.push([$(optionElem).html(), $(optionElem).val()]);
        
    }); 
    try {
        $(parentElem).find('.ckeditortext').each(function (indx, editElem) {
            var ckid=$(editElem).attr('id');
            var ckinstance=CKEDITOR.instances[$(editElem).attr('id')];
            if(ckinstance){
                console.log(' CKEditor Instance: ' + ckinstance);
                CKEDITOR.remove(ckinstance);
                $(parentElem).find('#cke_'+ckid).remove();
            }
            //var dt=new Date().getTime()+'';
            $(editElem).find( '#emaileditor_'+ckid).remove();
        });
    }
    catch (err) {
        console.log(' CKEditor toolbar error: ' + err.message);
    }
    try{
        $(parentElem).find('.ckeditortext').each(function (indx, editElem) {
            
            CKEDITOR.plugins.addExternal('fftoken', FFCKEditorurlroot + '/plugins/fftoken/', 'plugin.js');
            CKEDITOR.replace($(editElem).attr('id'), {
                extraPlugins: 'fftoken',
                availableTokens: selectItems,
                customConfig: FFCKEditorurlroot + '/config.js'
                
            });
            CKEDITOR.instances[$(editElem).attr('id')].on('blur', function () {
                var selectedvalue = brTagSafe(this.getData());
                $(editElem).val(selectedvalue);
                var elemSourceId=$(editElem).attr('id');
                if(!isNullOrEmpty($('#'+elemSourceId).attr('data-pp-email'))){
                    unsavedTemplateIndicator($(editElem).parent().parent());
                }else{
                    unsavedTemplateIndicator(parentElem);
                }
            });
            
        });
    }
    catch (err) {
        console.log(' CKEditor toolbar error: ' + err.message);
    }
}
function unsavedTemplateIndicator(parentElem){
    if(!$(parentElem).parent().hasClass('.sfff-email-template-content')){
        var inputDivElem=$(parentElem).find('.email-template-row .al-alert-template-type');
        if(inputDivElem.length==0){
            inputDivElem=$(parentElem).find('.email-template-row .email-template-type');
        }
        if(inputDivElem.find('.save-as-wrapper').length>0){
            inputDivElem.find('.save-as-wrapper').removeClass('al-disabled');
        }    
        resetUnsavedTemplateItem($(inputDivElem).find('select'));
    }
}
function resetUnsavedTemplateItem(selectElem){
    if(!($(selectElem).find('option.unsaved-template').length>0 && $(selectElem).find('option.unsaved-template').is(':selected'))){
        $(selectElem).find('option.unsaved-template').remove();    
        if($(selectElem).find('optgroup').length>0){
            $(selectElem).find('optgroup').first().before('<option class="fielditem unsaved-template" name="field-item" >Unsaved Template *</option>');
        }else{
            $(selectElem).append('<option class="fielditem unsaved-template" name="field-item" >Unsaved Template *</option>');
        }
        
        $(selectElem).find('option.unsaved-template').prop('selected', true); 
        //$(selectElem).select2(); 
        initializeSelect2PlaceHolder(selectElem);
    }
}
function addCustomTemplateItem(selectElem,newItem,isNew){
    if(newItem!=null && !isNullOrEmpty(newItem.FFValue)){
        if(isNew){
            if($(selectElem).find('optgroup[label="Custom Templates"]').length>0){
                $(selectElem).find('optgroup[label="Custom Templates"]').append('<option class="fielditem" name="field-item" value="'+newItem.FFValue+'" >'+newItem.FFText+'</option>');
            }else{
                if($(selectElem).find('optgroup').length>0){
                    $(selectElem).find('optgroup').first().before('<optgroup class="FieldOption template-section-0" label="Custom Templates"><option class="fielditem" name="field-item" value="'+newItem.FFValue+'" >'+newItem.FFText+'</option></optgroup>');
                }else{
                    $(selectElem).append('<optgroup class="FieldOption template-section-0" label="Custom Templates"><option class="fielditem" name="field-item" value="'+newItem.FFValue+'" >'+newItem.FFText+'</option></optgroup>');
                }
            }
        }
        $(selectElem).find('option.unsaved-template').remove();
        $(selectElem).val(newItem.FFValue); 
        
        initializeSelect2PlaceHolder(selectElem);
    }
    
}
function validateEmailTemplateName(parentEmailBoxElem, templateName, templateId) {
    var ffEmailTemplateObj = new ffAlertTemplateEmailNS2.ffAlertTemplateEmailObject();
    var where_condition = {};
	where_condition.where = {};
    
    where_condition.where[SFOrgPrefix + 'Name__c'] = { eq: GetInputValue(templateName) };
    if (!isNullOrEmpty(templateId)) {
        where_condition.where[SFOrgPrefix + 'Name__c'] = { eq: GetInputValue(templateName) };
        where_condition.where['Id'] = { ne: templateId };
    }

    ffEmailTemplateObj.retrieve(function () {
        return (where_condition);
    }, function (error, results, eventobj) {
        
        if (eventobj.result != null && eventobj.result.records[0] !== undefined) {
            overwriteEmailTemplateInfo(parentEmailBoxElem, eventobj.result.records[0].Id);
        } else {
            saveEmailTemplateInfo(parentEmailBoxElem, templateId, templateName);
        }
    });
}
function overwriteEmailTemplateInfo(parentEmailBoxElem, templateId) {
    
    
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
                        saveEmailTemplateInfo(parentEmailBoxElem, templateId, '');
                        
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
function saveEmailTemplateInfo(parentEmailBoxElem, templateId, name) {
    
    var alertTemplateObj = {};
    var subject_c=getPrefixedOrgFieldName(SFOrgPrefix,'Subject__c');
    var body_c=getPrefixedOrgFieldName(SFOrgPrefix,'Body__c');
    var name_c=getPrefixedOrgFieldName(SFOrgPrefix,'Name__c');
    var  category_c= getPrefixedOrgFieldName(SFOrgPrefix,'Category__c');
    alertTemplateObj[subject_c] = $(parentEmailBoxElem).find('.email-subject-row input[type="text"]').val();
    alertTemplateObj[body_c] = brTagSafe(CKEDITOR.instances[$(parentEmailBoxElem).find('.ckeditortext').attr('id')].getData());
    
    if (!isNullOrEmpty(templateId)) {
        alertTemplateObj.Id = templateId;
        if (!isNullOrEmpty(name)) {
            
            alertTemplateObj[name_c] = name;
        }
        var ffUpdateTemplateAlertObj = new ffAlertTemplateEmailNS2.ffAlertTemplateEmailObject(alertTemplateObj);
        ffUpdateTemplateAlertObj.update(function (err, event, obj) {
            if (err) {
                console.log('ERROR while updating Alert_Template__c object:' + err);
                alertErrorMessage(parentEmailBoxElem, 'Something went wrong while inserting  new Email Template information. Please try again.');
            }
            else {
                console.log('Email Template updated: ID- ' + ffUpdateTemplateAlertObj.get('Id'));
                
                
                var newItem = { "FFText": name, "FFValue": ffUpdateTemplateAlertObj.get('Id') };
                addCustomTemplateItem($(parentEmailBoxElem).find('.email-template-row select'), newItem, false);
                
            }
        });
    } else {
        
        alertTemplateObj[name_c] = name;
        alertTemplateObj[category_c] = 'Custom';
        var ffEmailTemplateObj = new ffAlertTemplateEmailNS2.ffAlertTemplateEmailObject();
        ffEmailTemplateObj.create(alertTemplateObj, function (err, event, obj) {
            if (err) {
                console.log('ERROR while creating Alert_Template__c object:' + err);
                alertErrorMessage(parentEmailBoxElem, 'Something went wrong while inserting  new Email Template information. Please try again.');
            }
            else {
                console.log('New Email Template created: ID- ' + ffEmailTemplateObj.get('Id'));
                
                var newItem = { "FFText": name, "FFValue": ffEmailTemplateObj.get('Id') };
                addCustomTemplateItem($(parentEmailBoxElem).find('.email-template-row select'), newItem, true);
                
            }
        });
    }
}
function saveNewEmailTemplateInfo(elemSource) {
    var parentEmailBoxElem = $(elemSource).parents('.email-content-box');
    
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
                        validateEmailTemplateName(parentEmailBoxElem, name, '');
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