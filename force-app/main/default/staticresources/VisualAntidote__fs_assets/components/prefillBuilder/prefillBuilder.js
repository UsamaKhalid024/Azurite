var oListFieldsByObject = [];
var oListFieldsByObjectOnlyReferences = [];
var oListObjectConfiguration = [];
var PrefillLookupNewWindow = null;
var enumFSPFsource = { "RecordList": "RecordList", "MatchingCriteria": "MatchingCriteria", "loggedInUser": "loggedInUser"};
Object.freeze(enumFSPFsource);
function LoadingPrefillOnReady() {
    if (IsCommunityPrefillFormEnable) {
        getPrefillBuilder();
    }

    $('.community-prefill-toggle').click(function () {
        //If User clicks to disable, clean the Prefill 
        if ($(this).parent().hasClass('mode-active')) {
            if (vChangeDetected) {
                showMessage("Yes, disable prefill",
                    "Your prefill settings will be lost if you disable prefill. Are you sure you want to continue?",
                    function () { disablePrefillBuilder($(this)); }
                );
            } else {
                disablePrefillBuilder($(this));
            }

        } else {
            getPrefillBuilder();
        }
    });

    $('.btn-saveprefill').click(function () {
        savePrefill_CLickEvent();
    });
}

function savePrefill_CLickEvent() {
    try {
        $('.btn-saveprefill').text('Saving...');
        toggleProcessingBox(true, 'Saving Prefill configuration, please wait...<br /><br /><br />');
        var vPrefillJSON = getPrefillJSONToSave();
        var jsonPrefillJSON = JSON.stringify(vPrefillJSON);
        setPrefillBuilder(jsonPrefillJSON);
    } catch (error) {
        console.log('Method[btn-saveprefill-click] Error unexpected!');
        console.log(error);
        $('.btn-saveprefill').text('Save Prefill');
        toggleProcessingBox(false);
    }
}

/** Salesforce Remote Action **/
function getPrefillBuilder() {
    toggleProcessingBox(true, 'Retrieving Prefill configuration, please wait...<br /><br /><br />');
    console.log('[getPrefillBuilder] Starts...');
    var vURL_getPrefillBuilder = REMOTE_ACTIONS["getPrefillBuilder"];
    Visualforce.remoting.Manager.invokeAction(
        vURL_getPrefillBuilder, pRecordId,
        function (pResult, pEvent) {
            toggleProcessingBox(false);
            if (pEvent.status) {
                console.log(pResult);

                if (pResult.IsValid) {
                    var vPrefillConfiguration = JSON.parse(pResult.ResultText);
                    LoadPrefillBuilder(vPrefillConfiguration);
                    $('.btn-saveprefill').show();
                    $('.btn-saveprefill').addClass('va-disabled');

                    //If we have configuration, we don't need to validate anything because we did the validation when we saved it.
                    if (vPrefillConfiguration.PrefillConfiguration == null) {
                        validateSavePrefill('endOfGetPrefillBuilder');
                    } else {
                        validateSavePrefill('endOfGetPrefillBuilder_PrefillFilled');
                    }

                } else {
                    toggleWarningBox(true, enumPrefillMessages.Generic_Error);
                    console.log(pResult);
                }
            } else {
                console.log(" Exception- " + pEvent.message + "<br/>\n<pre>" + pEvent.where + "</pre>");
            }
        },
        {
            escape: false
        }
    );
}

function setPrefillBuilder(pPrefillJSON) {
    console.log('[setPrefillBuilder] Starts...');
    console.log(pPrefillJSON);
    var vURL_setPrefillBuilder = REMOTE_ACTIONS["setPrefillBuilder"];
    Visualforce.remoting.Manager.invokeAction(
        vURL_setPrefillBuilder, pRecordId, pPrefillJSON,
        function (pResult, pEvent) {
            toggleProcessingBox(false);
            $('.btn-saveprefill').text('Save Prefill');

            if (pEvent.status) {
                if (pResult.IsValid) {
                    vChangeDetected = false;

                    if (pResult.ResultText == 'Updated Sucessfully!') {
                        toggleSuccessMsg(true, 'Your prefill settings have been successfully saved! Your live form will now be prefilled.', 10000);
                        $('.btn-saveprefill').addClass('va-disabled');
                    } else {
                        //User has toggle to disable it, we don't show anything.
                    }

                } else {
                    toggleWarningBox(true, enumPrefillMessages.Generic_Error);
                    console.log(pResult);
                }
            } else {
                toggleWarningBox(true, enumPrefillMessages.Generic_Error);
                console.log(" Exception- " + pEvent.message + "<br/>\n<pre>" + pEvent.where + "</pre>");
            }
        },
        {
            escape: false
        }
    );
}

function disablePrefillBuilder(pThis) {
    console.log('[disablePrefillBuilder] Starts..');

    toggleProcessingBox(true, 'Disabling Prefill configuration, please wait...<br /><br /><br />');

    //Clean the PrefillConfiguration field
    setPrefillBuilder('');
    //Remove the Prefill
    $('.pf-container-community').hide();
    $('.btn-saveprefill').hide();
    $(pThis).parent().removeClass('mode-active');
    toggleComponent(false, $('.community-prefill-toggle'));
}

function LoadPrefillBuilder(pPrefillConfiguration) {
    console.log('[LoadPrefillBuilder] Starts...');
    console.log(pPrefillConfiguration);

    try {

        $('.pf-container-community').show();

        toggleComponent(true, $('.community-prefill-toggle'));

        //1. Get all the Fields
        oListFieldsByObject = pPrefillConfiguration.ListObjectsAndFields;
        //Load list of References
        loadRelationshipList();

        var vListPrefillJSON = [];
        oListObjectConfiguration = pPrefillConfiguration.ListObjectFromFormConfiguration;

        var vFirstObject = '';
        console.log('Loading List of Prefill configuration....');
        if (pPrefillConfiguration.PrefillConfiguration != null) {
            var vListPrefillJSONFromForm = JSON.parse(pPrefillConfiguration.PrefillConfiguration);
            for (var iIndexPrefillJSON = 0; iIndexPrefillJSON < vListPrefillJSONFromForm.prefillRules.length; iIndexPrefillJSON++) {
                var vPrefill = vListPrefillJSONFromForm.prefillRules[iIndexPrefillJSON];
                vListPrefillJSON.push(vPrefill);
            }

        } else {
            //If It is a new Prefill Configuration Load the Empty Structure
            for (var iIndexFormConfiguration = 0; iIndexFormConfiguration < pPrefillConfiguration.ListObjectFromFormConfiguration.length; iIndexFormConfiguration++) {
                var vFormConfiguration = pPrefillConfiguration.ListObjectFromFormConfiguration[iIndexFormConfiguration];

                vListPrefillJSON.push(getNewAutoFormPrefillJSON(vFormConfiguration, vFirstObject));
                if (vFirstObject == enumFSObjectType.Primary) {
                    vFirstObject = vFormConfiguration.SFObjectName + '.' + vFormConfiguration.RelatedField + '.' + vFormConfiguration.Letter;
                }
            }
        }
        console.log('Loading Prefill configuration is done.');
        console.log(vListPrefillJSON);
        $('.pf-container-listobject .pf-object-container').remove();
        for (var iIndexPrefillRules = 0; iIndexPrefillRules < vListPrefillJSON.length; iIndexPrefillRules++) {

            var vPrefillObject = vListPrefillJSON[iIndexPrefillRules];
            console.log('Showing vPrefillObject');
            console.log(vPrefillObject);

            var vHeader = addPFHeader(vPrefillObject);

            var vObjectContainer = fsNewDiv('pf-object-container');
            $(vObjectContainer).append(vHeader);

            var vContent = addPFContent(vPrefillObject);

            $(vObjectContainer).append(vContent);
            $('.pf-container-listobject').append(vObjectContainer);

        }

        //I can’t setup any primary object type prefill if I have selected a child object as a Logged-in User.
        showHidePFsource();

       
        if ($('.pf-container-listobject').find('a[href="#RecordList"]').parent('.pf-source.active').length > 0) {
             // disable all loggedin-user when record list is selected 
            enableDisableThisIsLoggedInUser(false, true);
        } else {
            enableDisableThisIsLoggedInUser(true, false);
        }
        console.log('Enabling Select2...Start');
        $('.pf-filter-column>select').select2();
        $('.pf-filter-value select').select2();
        $('.pf-orderby select').select2();
        console.log('Enabling Select2...End');

        showAutoPrefillTextBox();

    } catch (error) {
        console.log('Error unexpected! Method[] Ex[Below]');
        console.log(error);
    }
}
function showHidePFsource() {
    var vPrimaryObject = $('.pf-container-listobject>div:nth-child(1)');
    $('.pf-header').each(function () {
        var vfObjectName = $(this).find('.pf-object-order-name').data('sfobjectname');
        var vObjectFSType = $(this).find('.pf-object-order-name').data('objectfstype');
        var vIsThisLoggedUserChecked = $(this).find('.pf-header-loggedinuser > input:checked').prop('checked');
        if ((vObjectFSType != enumFSObjectType.Primary)) {
            if ((vfObjectName != enumSFObjectAPIName.Contact) || (vfObjectName != enumSFObjectAPIName.User)) {
                if (vIsThisLoggedUserChecked) {
                    vPrimaryObject.find('.pf-source').hide();
                    vPrimaryObject.find('.pf-sourceContainer').append(getPFsource_textElement('Related to Contact or User Object.'));
                    return true;
                }
            }
        }

    });

}
function addPFHeader(pPrefillRule) {
    console.log('[addPFHeader] Starts...');
    var vIdentifier = pPrefillRule.sfObjectName + '.' + pPrefillRule.refFieldName + '.' + pPrefillRule.letter;

    var vPFObjectOrderName = fsNewDiv('pf-object-order-name');
    vPFObjectOrderName.data('sfobjectname', pPrefillRule.sfObjectName);
    vPFObjectOrderName.data('objectformidentifier', vIdentifier);
    vPFObjectOrderName.data('objectfstype', pPrefillRule.objectFSType);
    vPFObjectOrderName.data('letter', pPrefillRule.letter);
    vPFObjectOrderName.data('refFieldName', pPrefillRule.refFieldName);//We need this information to Prefill bc the field int he form has this related field
    vPFObjectOrderName.data('prefillsource', pPrefillRule.prefillSource);
    $(vPFObjectOrderName).text(getObjectFSTypeDescription(pPrefillRule.objectFSType)); //Primary object, Child Object

    var vIconStatus = fsNewDiv('pf-icon-status');
    var vPFHeaderObjectName = fsNewDiv('pf-header-object-name');
    var vObjectName = $('<span />').append(pPrefillRule.objDisplayName);
    $(vPFHeaderObjectName).append(vObjectName);

    if (pPrefillRule.letter != '') {
        var vClass = 'color-span color-tag ' + pPrefillRule.letter;
        if (pPrefillRule.objectFSType == enumFSObjectType.Child_Repeated) {
            vClass = vClass + ' repeated';
        }
        var vSpanColor = $('<span />', { 'class': vClass });
        $(vPFHeaderObjectName).append(vSpanColor);
    }

    var vPFTitle = fsNewDiv('pf-title');
    vPFTitle.append(vIconStatus);
    vPFTitle.append(vPFHeaderObjectName);
    //Show this checkbox just if the sfobject is a Contact 



        var vPFHeaderLoggedInUser =  LoggedinUser_CheckedBox(vIdentifier,pPrefillRule);

        // show this checkbox just if the sfobject is contact
        // Lookup should not show logged-in user - jira scenario
        if ((pPrefillRule.objectFSType == enumFSObjectType.Child)) {
            if ((pPrefillRule.sfObjectName == enumSFObjectAPIName.Contact) || (pPrefillRule.sfObjectName == enumSFObjectAPIName.User)) {
                vPFHeaderLoggedInUser.removeClass('pf-header-loggedinuser-hide');
            }
        }

        vPFTitle.append(vPFHeaderLoggedInUser);  


    var vPFHeaderPrefillThisObject = fsNewDiv('pf-header-prefillthisobject');
    var vToolTip = 'Selecting this will prefill the fields that were added to your form for this object.';
    var vHelpPrefillThisObject = getHelperIconDiv('help-prefillthisobject pf-tooltip-prefillthisobject', vToolTip);
    var vCheckBoxPrefillThisObject = $('<input />', { 'class': 'ck-header-prefillthisobject fs-checkbox', 'type': 'checkbox', 'id': vIdentifier + '_pfthisobject' });
    $(vCheckBoxPrefillThisObject).change(function () {
        prefillThisObject_ClickEvent(this);
        enableDisableThisIsLoggedInUser(true, false);
        validateSavePrefill('ck-header-prefillthisobject');
    });
    $(vCheckBoxPrefillThisObject).prop('checked', pPrefillRule.isActive);
    $(vPFHeaderPrefillThisObject).append(vCheckBoxPrefillThisObject);

    var vlblPrefillThisObject = $('<label />', { 'class': 'fs-txt-checkbox fs-checkbox-label', 'for': vIdentifier + '_pfthisobject' });
    vlblPrefillThisObject.append('Prefill this object');
    $(vPFHeaderPrefillThisObject).append(vlblPrefillThisObject);
    $(vPFHeaderPrefillThisObject).append(vHelpPrefillThisObject);
    var vPFHeaderPrefillThisObjectRight = fsNewDiv('pf-header-right');
    vPFHeaderPrefillThisObjectRight.append(vPFHeaderPrefillThisObject);

    vPFTitle.append(vPFHeaderPrefillThisObjectRight);

    var vExtraCSSHeader = '';
    if (pPrefillRule.objectFSType == enumFSObjectType.Child_Repeated) {
        vExtraCSSHeader += 'pf-h-repeated';
    }

    var vPFHeader = fsNewDiv('pf-header ' + vExtraCSSHeader);

    vPFHeader.append(vPFObjectOrderName);
    vPFHeader.append(vPFTitle);

    return vPFHeader;
}
function getPFSourceElement(){
    var PFsourceContainer =  $('<ul />',{'class':'pf-sourceContainer nav nav-tabs vertical-tabs'});
    var helper = getHelperIconDiv('pf-sourceContainer-helperIcon','Configure how the primary object record is found. This record and records that have a relation to it are used to prefill your form.')
    var PFSource=$('<li />');
    var vSpan = $('<span />',{'class':'pf-sourceContainer-text'});
    vSpan.append('Prefill source:');
    PFSource.append(vSpan);
    PFsourceContainer.append(helper);
    PFsourceContainer.append(PFSource);

    return PFsourceContainer;
}
function getLoggedinUser_RadioElement(pPrefillObject) {
    var vPFLoggedinUser;
    if (pPrefillObject.prefillSource == enumFSPFsource.loggedInUser || (pPrefillObject.prefillSource == null && pPrefillObject.ThereIsFilterToLoggedInUser==true )) {
        vPFLoggedinUser = $('<li />', {
            'class': 'pf-source active'
        });
    } else {
        vPFLoggedinUser = $('<li />', {
            'class': 'pf-source'
        });
    }
    var vSpan = $('<span />', {
        'class': 'ff-radio-css'
    });
    var vLink = $('<a />', {
        'href': '#'+enumFSPFsource.loggedInUser,
        'data-toggle': 'tab'
    });
    $(vLink).click(function () {
        getLoggedinUser_RadioElement_click(this);
    });
    vLink.append(vSpan);
    vLink.append('Logged-in User');
    vPFLoggedinUser.append(vLink);
    return vPFLoggedinUser;
}
function getLoggedinUser_RadioElement_click(e){
    var vIsThisLoggedUserChecked = $(e).closest('.pf-object-container').find('.pf-header').find('.pf-header-loggedinuser > input');

    var vIsThisLoggedUser = $(e).closest('.pf-object-container').find('.pf-header').find('.pf-header-loggedinuser');
    if (vIsThisLoggedUser.data('prefillsource') != enumFSPFsource.loggedInUser) {

        vIsThisLoggedUserChecked.prop('checked',true);
        vIsThisLoggedUser.data('prefillsource', enumFSPFsource.loggedInUser);
        addLoggedInUserRow($(e));
        //Check if we should disable this object, because the Primary Object is disabled
        prefillThisObjectCheck();
        validateSavePrefill('ck-header-loggedinuser');

    }
}
function getMatchingCriteria_RadioElement(pPrefillObject) {
    var vMatchingCriteria;
    if (pPrefillObject.prefillSource == enumFSPFsource.MatchingCriteria || (pPrefillObject.prefillSource == null && pPrefillObject.ThereIsFilterToLoggedInUser==false )) {
        vMatchingCriteria = $('<li />', {
            'class': 'pf-source active'
        });
    } else {
        vMatchingCriteria = $('<li />', {
            'class': 'pf-source'
        });
    }
    var vSpan = $('<span />', {
        'class': 'ff-radio-css'
    });
    var vLink = $('<a />', {
        'href': '#'+enumFSPFsource.MatchingCriteria,
        'data-toggle': 'tab'
    });
            
    $(vLink).click(function () {
        getMatchingCriteria_RadioElement_click(this);
    });
    vLink.append(vSpan);
    vLink.append('Matching Criteria');
    vMatchingCriteria.append(vLink);
    return vMatchingCriteria;
}
function getMatchingCriteria_RadioElement_click(e){
    var vIsThisLoggedUserChecked = $(e).closest('.pf-object-container').find('.pf-header').find('.pf-header-loggedinuser > input');
    var vIsThisLoggedUser = $(e).closest('.pf-object-container').find('.pf-header').find('.pf-header-loggedinuser');
    if (vIsThisLoggedUser.data('prefillsource') != enumFSPFsource.MatchingCriteria) {

        vIsThisLoggedUserChecked.prop('checked', false);
        vIsThisLoggedUser.data('prefillsource', enumFSPFsource.MatchingCriteria);
        addLoggedInUserRow($(e));
        //Check if we should disable this object, because the Primary Object is disabled
        prefillThisObjectCheck();
        validateSavePrefill('ck-header-loggedinuser');

}
}
function getRecordList_RadioElement(pPrefillObject) {
    var vPFRecordList;

    if (pPrefillObject.prefillSource == enumFSPFsource.RecordList) {
        vPFRecordList = $('<li />', {
            'class': 'pf-source active'
        });
    } else {
        vPFRecordList = $('<li />', {
            'class': 'pf-source'
        });
    }
    var vSpan = $('<span />', {
        'class': 'ff-radio-css'
    });
    var vLink = $('<a />', {
        'href': '#RecordList',
        'data-toggle': 'tab'
    });
    $(vLink).click(function () {
        getRecordList_RadioElement_click(this);
    });
    vLink.append(vSpan);
    vLink.append('Record List');
    vPFRecordList.append(vLink);
    return vPFRecordList;
}

function getRecordList_RadioElement_click(e)
{
    console.log('createMatchingCriteria_Radio');
    addRecordListRow(e);
    var vIsThisLoggedUser = $(e).closest('.pf-object-container').find('.pf-header').find('.pf-header-loggedinuser');
    vIsThisLoggedUser.data('prefillsource', enumFSPFsource.RecordList);
}
function getPFsource_textElement(value) {
    var vPFRecordList = $('<li />', {
        'class': 'pf-source-text'
    }).append(value);;
    return vPFRecordList;
}

function LoggedinUser_CheckedBox(vIdentifier, pPrefillRule) {
    var vPFHeaderLoggedInUser = fsNewDiv('pf-header-loggedinuser pf-header-loggedinuser-hide');
    var vToolTip = 'Selecting this option will prefill this object’s fields with details from your logged-in users. ' +
        'The logged-in user record you specify will be used to find related records for the rest of the objects on your form.';

    var vHelpLoggedInuser = getHelperIconDiv('help-loggedinuser pf-tooltip-loggedinuser', vToolTip);
    var vCheckBoxLoggedInUser = $('<input />', {
        'class': 'ck-header-loggedinuser fs-checkbox',
        'type': 'checkbox',
        'id': vIdentifier + '_pfloggedinuser'
    });
    $(vCheckBoxLoggedInUser).click(function () {
        addLoggedInUserRow($(this));

        //Check if we should disable this object, because the Primary Object is disabled
        prefillThisObjectCheck();
        validateSavePrefill('ck-header-loggedinuser');
    });

    FSAutoOption_getProperlyText(pPrefillRule);

    if (pPrefillRule.IsThisLoggedInUser != null && pPrefillRule.IsThisLoggedInUser) {
        vCheckBoxLoggedInUser.prop('checked', true);
    }

    $(vPFHeaderLoggedInUser).append(vCheckBoxLoggedInUser);
    var vlblThisIsLoggedInUser = $('<label />', {
        'class': 'fs-txt-checkbox fs-checkbox-label',
        'for': vIdentifier + '_pfloggedinuser'
    });
    vlblThisIsLoggedInUser.append('This is the Logged-in User');
    $(vPFHeaderLoggedInUser).append(vlblThisIsLoggedInUser);
    $(vPFHeaderLoggedInUser).append(vHelpLoggedInuser);

    //the purpose of this value is to switch between prefill source   
    vPFHeaderLoggedInUser.data('prefillsource', pPrefillRule.prefillSource);

    return vPFHeaderLoggedInUser;
}
function addPFContent(pPrefillObject) {
    console.log('[addPFContent] Starts...');

    var pWhereClauses = pPrefillObject.whereClause;

    var vPFText = fsNewDiv('pf-text');
    setPFText(vPFText, pPrefillObject);

    //Creating Section of the Filters
    var vPFFilters = fsNewDiv('pf-filters');

    //If It is Repeated Child or Lookup doesn't show the filter.
    if (HideFilterPFFilter(pPrefillObject)) {
        $(vPFFilters).hide();
    }

    var vPFFilterRowHeader = fsNewDiv('pf-filter-row-header');
    var vSpan = $('<span />');
    vSpan.append('Object Fields');
    vPFFilterRowHeader.append(vSpan);
    vSpan = $('<span />');
    vSpan.append('Matching Values');
    vPFFilterRowHeader.append(vSpan);
    vPFFilterRowHeader.append(fsNewDiv('pf-filter-row-header-border-bt'));
    vPFFilters.append(vPFFilterRowHeader);

    var pSFObjectName = pPrefillObject.sfObjectName;
    var pObjectFormIdentifier = pPrefillObject.sfObjectName + '.' + pPrefillObject.refFieldName + '.' + pPrefillObject.letter;
    for (var iIndexWhereClause = 0; iIndexWhereClause < pWhereClauses.section.length; iIndexWhereClause++) {
        var vSection = pWhereClauses.section[iIndexWhereClause];

        for (var iIndexCondition = 0; iIndexCondition < vSection.condition.length; iIndexCondition++) {
            var vCondition = vSection.condition[iIndexCondition];
            var vPFFilterRow = addPFFilterRow(pSFObjectName, pObjectFormIdentifier, vCondition);
            vPFFilters.append(vPFFilterRow);
        }
    }

    //Creating Section of Order By
    var vPFOrderBy = fsNewDiv('pf-orderby');
    var vOrderBySelect = getOrderByDropdown(pPrefillObject.orderBy);
    vOrderBySelect.change(function () {
        validateSavePrefill('change-orderby');
    });
    vPFOrderBy.append(vOrderBySelect);
    //By Default it is hidden, and it should show just for non repeatable objects
    $(vPFOrderBy).hide();
    if (pPrefillObject.objectFSType == enumFSObjectType.Child) {
        $(vPFOrderBy).show();
        $(vPFFilters).hide();
    }

    //This attribute exist just when we load the page
    if ((pPrefillObject.ThereIsFilterToLoggedInUser != null && pPrefillObject.ThereIsFilterToLoggedInUser) || pPrefillObject.prefillSource==enumFSPFsource.RecordList) {
        $(vPFOrderBy).hide();
        $(vPFFilters).hide();
    }

    var vPFContent = fsNewDiv('pf-content');
    //Show prefill source Radio just if the sfobject is Primary
    if ((pPrefillObject.objectFSType == enumFSObjectType.Primary)) {
        var vPFsource = getPFSourceElement();
        vPFsource.append(getMatchingCriteria_RadioElement(pPrefillObject));

        //Lookup should not show Logged-In user - Jira scenario moved to prefill source
        if (pPrefillObject.sfObjectName == enumSFObjectAPIName.Contact || pPrefillObject.sfObjectName == enumSFObjectAPIName.User) {
            vPFsource.append(getLoggedinUser_RadioElement(pPrefillObject));
        }
        vPFsource.append(getRecordList_RadioElement(pPrefillObject)); 
        addRecordListRow(vPFContent);
        vPFContent.append(vPFsource); 
    }
    vPFContent.append(vPFText);
    vPFContent.append(vPFFilters);
    vPFContent.append(vPFOrderBy);

    return vPFContent;
}



function addPFFilterRow(pSFObjectName, pObjectFormIdentifier, pCondition) {

    var vPFFilterRow = fsNewDiv('pf-filter-row');

    //Object Fields
    var vPFFilterColumn = fsNewDiv('pf-filter-column');
    var vDropDown = getColumnDropDown(pSFObjectName, pCondition.operand1);
    vDropDown.change(function () {
        changeMatchingValueFieldType($(this));
        validateSavePrefill('changeObjectField');
    });
    vPFFilterColumn.append(vDropDown);
    vPFFilterRow.append(vPFFilterColumn);

    //Operator
    var vPFFilterOperator = fsNewDiv('pf-filter-operator');
    vPFFilterOperator.append('equals');
    vPFFilterRow.append(vPFFilterOperator);

    //Matching Values
    var vPFFilterValue = fsNewDiv('pf-filter-value');
    var vPFFilterValueBox = getMatchingValues(pCondition, pObjectFormIdentifier, pSFObjectName);
    vPFFilterValue.append(vPFFilterValueBox);

    //Button add and delete
    var vPFFilterValueButtons = fsNewDiv('pf-filter-value-buttons');
    var vPFBTNDelete = $('<button />', { 'class': 'btn-delete', 'type': 'button' });
    vPFBTNDelete.attr('title', 'Delete this row');
    vPFBTNDelete.click(function () {
        deleteRow($(this));
        validateSavePrefill('deleteRow');
    });
    vPFFilterValueButtons.append(vPFBTNDelete);
    var vPFBTNAdd = $('<button />', { 'class': 'btn-add', 'type': 'button' });
    vPFBTNAdd.attr('title', 'Add a new row');
    vPFBTNAdd.data('sfobjectname', pSFObjectName);
    vPFBTNAdd.data('objectformidentifier', pObjectFormIdentifier);
    vPFBTNAdd.click(function () {
        addRow($(this));
        validateSavePrefill('addRow');
    });
    vPFFilterValueButtons.append(vPFBTNAdd);
    vPFFilterValue.append(vPFFilterValueButtons);

    vPFFilterRow.append(vPFFilterValue);

    return vPFFilterRow;
}

function getMatchingValues(pCondition, pObjecFormIdentifier, pObjectName) {
    console.log('[getMatchingValues] Starts...');

    var vPFFilterValueBox = fsNewDiv('pf-filter-value-box');
    vPFFilterValueBox.data('addedby', pCondition.addedBy);
    vPFFilterValueBox.data('sfobjectname', pObjectName);
    vPFFilterValueBox.data('objectformidentifier', pObjecFormIdentifier);
    vPFFilterValueBox.data('filtertype', pCondition.operand2.otype);

    if (pCondition.operand2.otype == enumMatchingFieldType.Static_Token_Contact) {
        console.log('Adding static token contact field');
        //Adding TextBox with a Lupe
        var vPFFilterValueInput = getMF_StaticInput(pCondition, enumMatchingFieldType.Static_Token_Contact);
        vPFFilterValueInput.append(getMF_Lupe());
        vPFFilterValueBox.append(vPFFilterValueInput);

        //Adding label to switch for LoggedIn-User Contact
        var vPFFilterValueToken = getMF_LabelLoggedInUser(pObjectName, pObjecFormIdentifier, enumFSToken.User_ContactId, 'Use Logged-In User Contact');
        vPFFilterValueBox.append(vPFFilterValueToken);
        vPFFilterValueBox.append(getMF_LabelRelationship(pObjectName, pObjecFormIdentifier));

    } else if (pCondition.operand2.otype == enumMatchingFieldType.Static_Token_Email) {
        console.log('Adding static token user field');
        //Adding TextBox with a Lupe
        var vPFFilterValueInput = getMF_StaticInput(pCondition, enumMatchingFieldType.Static_Token_Email);
        vPFFilterValueBox.append(vPFFilterValueInput);

        //Adding label to switch for LoggedIn-User Email
        var vPFFilterValueToken = getMF_LabelLoggedInUser(pObjectName, pObjecFormIdentifier, enumFSToken.UserEmail, 'Use Logged-In User Email');
        vPFFilterValueBox.append(vPFFilterValueToken);

    } else if (pCondition.operand2.otype == enumMatchingFieldType.Static_Token_User) {
        console.log('Adding static token user field');
        //Adding TextBox with a Lupe
        var vPFFilterValueInput = getMF_StaticInput(pCondition, enumMatchingFieldType.Static_Token_User);
        vPFFilterValueInput.append(getMF_Lupe());
        vPFFilterValueBox.append(vPFFilterValueInput);

        //Adding label to switch for LoggedIn-User
        var vPFFilterValueToken = getMF_LabelLoggedInUser(pObjectName, pObjecFormIdentifier, enumFSToken.UserId, 'Use Logged-In User');
        vPFFilterValueBox.append(vPFFilterValueToken);
        vPFFilterValueBox.append(getMF_LabelRelationship(pObjectName, pObjecFormIdentifier));

    } else if (pCondition.operand2.otype == enumMatchingFieldType.Static_Lookup) {
        console.log('Adding static token user field');
        //Adding TextBox with a Lupe
        var vPFFilterValueInput = getMF_StaticInput(pCondition, enumMatchingFieldType.Static_Lookup);
        vPFFilterValueInput.append(getMF_Lupe());
        vPFFilterValueBox.append(vPFFilterValueInput);
        vPFFilterValueBox.append(getMF_LabelRelationship(pObjectName, pObjecFormIdentifier));

    } else if (pCondition.operand2.otype == enumMatchingFieldType.PickList) {
        console.log('Adding PickList user field');
        //Adding DropDown with Picklist Values
        var vPFFilterValueInput = getMF_PickListDropdown(pCondition, pObjectName, pObjecFormIdentifier);
        vPFFilterValueBox.append(vPFFilterValueInput);

    } else if (pCondition.operand2.otype == enumMatchingFieldType.Boolean) {
        console.log('Adding CheckBox user field');
        //Adding CheckBox
        var vPFFilterValueInput = getMF_CheckBoxInput(pCondition);
        vPFFilterValueBox.append(vPFFilterValueInput);

    } else if (pCondition.operand2.otype == enumMatchingFieldType.Date) {
        //Adding CheckBox
        var vPFFilterValueInput = getMF_StaticInput(pCondition, enumMatchingFieldType.Date);
        vPFFilterValueBox.append(vPFFilterValueInput);

    } else if (pCondition.operand2.otype == enumMatchingFieldType.DateTime) {
        //Adding DateTime
        var vPFFilterValueInput = getMF_StaticInput(pCondition, enumMatchingFieldType.DateTime);
        vPFFilterValueBox.append(vPFFilterValueInput);

    } else if (pCondition.operand2.otype == enumMatchingFieldType.Relationship) {
        console.log('Adding relationship Field');
        var vPFFilterValueInput = fsNewDiv('pf-filter-value-input');
        vPFFilterValueInput.append(getValueRelationshipDropdown(pCondition, pObjecFormIdentifier));
        vPFFilterValueBox.append(vPFFilterValueInput);

        var vPFFilterValueToken = getMF_LabelSetStaticValue(pObjectName, pObjecFormIdentifier, vMatchingFieldType);
        vPFFilterValueBox.append(vPFFilterValueToken);

    } else if (pCondition.operand2.otype == enumMatchingFieldType.Token) {
        console.log('Adding token field');
        //If the user selects Logged-in User
        var vSelectedTokenValue = pCondition.operand2.otext;

        var vPFFilterValueInput = fsNewDiv('pf-filter-value-input pf-filter-token');
        vPFFilterValueInput.data('tokenvalue', vSelectedTokenValue);

        var vInputField = $('<input />', { 'type': 'text' });
        vInputField.val(getTokenDescription(vSelectedTokenValue));//Set the Value
        vInputField.prop('disabled', true);
        vPFFilterValueInput.append(vInputField);
        vPFFilterValueBox.append(vPFFilterValueInput);

        var vMatchingFieldType = enumMatchingFieldType.Static_Token_User;
        if (vSelectedTokenValue == enumFSToken.User_ContactId) {
            vMatchingFieldType = enumMatchingFieldType.Static_Token_Contact;
        } else if (vSelectedTokenValue == enumFSToken.UserEmail) {
            vMatchingFieldType = enumMatchingFieldType.Static_Token_Email;
        }
        var vPFFilterValueToken = getMF_LabelSetStaticValue(pObjectName, pObjecFormIdentifier, vMatchingFieldType);
        vPFFilterValueBox.append(vPFFilterValueToken);
    } else {
        console.log('Adding static field');
        //Static
        var vPFFilterValueInput = getMF_StaticInput(pCondition, enumMatchingFieldType.Static);
        vPFFilterValueBox.append(vPFFilterValueInput);
    }

    return vPFFilterValueBox;
}

function getMF_LabelSetStaticValue(pObjectName, pObjecFormIdentifier, pMatchingFieldType) {
    console.log('[getMF_LabelSetStaticValue] Starts..');
    var vPFFilterValueToken = fsNewDiv('pf-filter-value-token');
    var vButtonChangeToStaticValue = fsNewButton('btn-text-blue label-below-field').append('Set a value');
    vButtonChangeToStaticValue.data('sfobjectname', pObjectName);
    vButtonChangeToStaticValue.data('objectformidentifier', pObjecFormIdentifier);
    vButtonChangeToStaticValue.click(function () {
        switchFilterValue(pMatchingFieldType, $(this));
        validateSavePrefill('click-set-a-value');
    });
    vPFFilterValueToken.append(vButtonChangeToStaticValue);

    return vPFFilterValueToken;
}

function getMF_LabelLoggedInUser(pObjectName, pObjecFormIdentifier, pTokenValue, pLabelName) {
    var vButtonChangeToLoggedInUser = fsNewButton('btn-text-blue label-below-field').append(pLabelName);
    vButtonChangeToLoggedInUser.data('sfobjectname', pObjectName);
    vButtonChangeToLoggedInUser.data('objectformidentifier', pObjecFormIdentifier);
    vButtonChangeToLoggedInUser.data('tokenvalue', pTokenValue);
    vButtonChangeToLoggedInUser.click(function () {
        switchFilterValue(enumMatchingFieldType.Token, $(this));
        validateSavePrefill('click-use-loggedInuser');
    });

    var vPFFilterValueToken = fsNewDiv('pf-filter-value-token');
    vPFFilterValueToken.append(vButtonChangeToLoggedInUser);

    return vPFFilterValueToken;
}

function getMF_CheckBoxInput(pCondition) {
    var vIndex = Math.floor(Math.random() * 26) + Date.now();
    var vInputCheckBoxField = $('<input />', { 'type': 'checkbox', 'class': 'fs-checkbox', 'id': vIndex });
    vInputCheckBoxField.prop('checked', pCondition.operand2.otext);//Set the Value
    vInputCheckBoxField.change(function () {
        $(this).parent().data('pf_value', $(this).prop('checked'));
        validateSavePrefill('blur-static-textfield');
    });

    var vCheckBoxLabel = $('<label />', { 'class': 'fs-checkbox-label', 'for': vIndex });

    var vPFFilterValueInput = fsNewDiv('pf-filter-value-input');
    vPFFilterValueInput.data('pf_value', pCondition.operand2.otext);
    vPFFilterValueInput.append(vInputCheckBoxField);
    vPFFilterValueInput.append(vCheckBoxLabel);

    return vPFFilterValueInput;
}

function getMF_StaticInput(pCondition, pFilterType) {
    var vInputField = $('<input />', { 'type': 'text' });
    vInputField.val(pCondition.operand2.otext);//Set the Value
    vInputField.blur(function () {
        $(this).parent().data('pf_value', $(this).val());
        validateSavePrefill('blur-static-textfield');
    });

    if (pFilterType == enumMatchingFieldType.Date) {
        vInputField.datetimepicker({ showTimepicker: false, changeMonth: true, changeYear: true, format: window.UserContext['dateTimeFormat'] });
        vInputField.val(setFormattedDateOrDateTime(pCondition.operand2.otext, false));
    } else if (pFilterType == enumMatchingFieldType.DateTime) {
        vInputField.datetimepicker({ showTimepicker: true, changeMonth: true, changeYear: true, format: window.UserContext['dateTimeFormat'] });
        vInputField.val(setFormattedDateOrDateTime(pCondition.operand2.otext, true));
    }

    var vPFFilterValueInput = fsNewDiv('pf-filter-value-input');
    vPFFilterValueInput.data('pf_value', pCondition.operand2.otext);
    vPFFilterValueInput.append(vInputField);

    return vPFFilterValueInput;
}

function getMF_LabelRelationship(pObjectName, pObjecFormIdentifier) {
    var vButtonChangeToRelationship = fsNewButton('btn-text-blue label-below-field').append('Use Relationship');
    vButtonChangeToRelationship.data('sfobjectname', pObjectName);
    vButtonChangeToRelationship.data('objectformidentifier', pObjecFormIdentifier);
    vButtonChangeToRelationship.click(function () {
        switchFilterValue(enumMatchingFieldType.Relationship, $(this));
        validateSavePrefill('click-use-relationship');
    });
    vButtonChangeToRelationship.hide();//Hidding this because we don't show it for the user now, This is advance - Rogerio - 20180226

    var vPFFilterButtonRelationship = fsNewDiv('pf-filter-button-relationship');
    vPFFilterButtonRelationship.append(vButtonChangeToRelationship);
    return vPFFilterButtonRelationship;
}

function getMF_Lupe() {
    console.log('[getMF_Lupe] Starts...');
    var vLupeAnchor = $('<a />', { 'class': 'sfff-lookup-link pf-lupe pf-lupe-lookup' });
    var vLupeImage = $('<img />', { 'class': 'lookupIcon', 'src': '/s.gif' });
    vLupeAnchor.append(vLupeImage);
    vLupeAnchor.prop('title', 'Search for a record');

    vLupeAnchor.click(function () {
        console.log('Lupe clicked');

        var left = (screen.width / 2) - (600 / 2);
        var top = 250

        $('.pflookupclicked').removeClass('pflookupclicked');
        $(this).addClass('pflookupclicked');

        var vPFFilter = $(this).parent().parent().parent().parent();
        var vDropDown = vPFFilter.find('.pf-filter-column select.select2-offscreen');
        var vSFObjectName = vPFFilter.find('.pf-filter-value-box').data('sfobjectname');

        var vSFObjectName_ReferenceTo = vDropDown.find(':selected').data('referenceto');

        //If dropdown is a Contact.Id the reference will be the User table
        if(vSFObjectName == enumSFObjectAPIName.Contact && vDropDown.find(':selected').val() == 'Id'){
            vSFObjectName_ReferenceTo = 'User';
        }
        
        var url = '/apex/FastFormsLookup?ltype=' + vSFObjectName_ReferenceTo + '&rtype=' + '' + '&sourcePage=cm_prefill';
        PrefillLookupNewWindow = window.open(url, 'CommunityPrefill', 'height=500,width=600,left=' + left + ',top=' + top + ',resizable=no,scrollbars=yes,toolbar=no,status=no');

    });
    return vLupeAnchor;
}

function CommunityPrefill_Lookup_LupeReturn(pId, pDescription) {
    console.log('[Lookup_LupeReturn] Starts....');

    var vPFFilterValue = $('.pflookupclicked').parent().parent().parent();
    var vInputText = vPFFilterValue.find('.pf-filter-value-input>input');
    vInputText.val(pDescription);
    vInputText.prop('title', pId + ' - ' + pDescription);
    vPFFilterValue.find('.pf-filter-value-input').data('pf_value', pId);

    if (PrefillLookupNewWindow != null) {
        PrefillLookupNewWindow.close();
    }
    validateSavePrefill('Lookup_RecordSelected');
}

function getHelperIconDiv(pContextClass, pHelperText) {
    var vHelperIcon = $('<a />', { 'class': 'help-icon blue-tooltip ' + pContextClass });
    var vSpanText = $('<span />', { 'class': 'blue-tooltip-text' }).append(pHelperText);
    var vSpanTextDraft = $('<span />', { 'class': 'draft-text helpIconCode' });
    vHelperIcon.append(vSpanText);
    vHelperIcon.append(vSpanTextDraft);
    return vHelperIcon;
}
function addRecordListRow(pThis){
    console.log('[addRecordListRow] Starts..');

    
    // change contant text
    var vPFHeader = $(pThis).closest(".pf-object-container").find('.pf-header')
    var vOtherObject_PFContent = vPFHeader.parent();
    var vPrimaryObject_Section = vOtherObject_PFContent.find('.pf-filters');
    var vContentText = vPFHeader.parent().find('.pf-content .pf-text');
    $(vPrimaryObject_Section).find('.pf-filter-row').remove();
    var vSFObjectName = vPFHeader.find('.pf-object-order-name').data('sfobjectname');
    var vObjectFormIdentifier = vPFHeader.find('.pf-object-order-name').data('objectformidentifier');
    vContentText.find('span').remove();
    vContentText.append($('<span />').append('<p>Primary object record will be found based on the record that the user selects from a Lightning Record List when your form is placed on a Lightning Record Detail page. No additional matching is needed.<br/></p> '+
     '<a href="https://sfapphelp.formstack.com/hc/en-us/articles/360018480272-Prefilling-Community-Forms-from-Record-List-Component" target="_blank">Learn how</a> to setup Record List view Prefill in you community.'));
    
    // create filter 
    var vConditionPrimary = new WhereCondition();
    vConditionPrimary.op = 'AND';
    vConditionPrimary.operand1 = 'Id';//Account.Id
    vConditionPrimary.operand2.otext = 'recordlist';
    vConditionPrimary.operand2.otype = enumMatchingFieldType.Token;
    vConditionPrimary.addedBy = enumFSAddedBy.LoggedInUser;
    var vRow = addPFFilterRow(vSFObjectName, vObjectFormIdentifier, vConditionPrimary);
    vPrimaryObject_Section.append(vRow);
    $(vPrimaryObject_Section).find('select').select2();
    vPrimaryObject_Section.hide();

    //change header icon
    vPFHeader.find('.pf-icon-status').removeClass('alert-triangle');
    vPFHeader.find('.pf-icon-status').addClass('checkmark-green');
    vPFHeader.find('.pf-icon-status').prop('title', '');
    vPFHeader.removeClass('box-shadown-blue');
    $('.btn-saveprefill').removeClass('va-disabled');

    //jira 4 hide logged-in user 
    enableDisableThisIsLoggedInUser(false, true);
}
function addLoggedInUserRow(pThis) {
    console.log('[addLoggedInUserRow] Starts..');

    //If it is a child
    ////Clean all the existing filters
    ////Add a new filter in the object using User.ContactId Token
    ////Set the Primary object to point to the child
    //If it is a Primary object
    ////Clean all the exist filters
    ////Add a new filter in the object using User.ContactId Token

    var vPFHeader = $(pThis).closest('.pf-object-container').find('.pf-header');
    var vOtherObject_PFContent = vPFHeader.parent();
    var vOtherSection = vOtherObject_PFContent.find('.pf-filters');
    var vContentText = vPFHeader.parent().find('.pf-content .pf-text');
    //Clean all the rows that were there previosly
    $(vOtherSection).find('.pf-filter-row').remove();
    var vSFObjectName = vPFHeader.find('.pf-object-order-name').data('sfobjectname');//Contact
    var vObjectFSType = vPFHeader.find('.pf-object-order-name').data('objectfstype');//Detaild, DetaildRepeated
    var vRefFieldName = vPFHeader.find('.pf-object-order-name').data('refFieldName');
    var vObjectFormIdentifier = vPFHeader.find('.pf-object-order-name').data('objectformidentifier');

    var vIsThisLoggedUserChecked = $(vPFHeader).find('.pf-header-loggedinuser > input').prop('checked');    

    enableDisableThisIsLoggedInUser(false, vIsThisLoggedUserChecked);


    if (vObjectFSType == enumFSObjectType.Child || vObjectFSType == enumFSObjectType.Child_Repeated) {

        var vPrimaryObject = $('.pf-container-listobject>div:nth-child(1)');
        var vPrimaryObject_PFObjectOrderName = vPrimaryObject.find('.pf-object-order-name');
        var vPrimaryObject_ObjectFormIdentifier = vPrimaryObject_PFObjectOrderName.data('objectformidentifier');
        var vPrimaryObject_Section = vPrimaryObject.find('.pf-filters');
        var vPrimaryObject_SFObjectName = vPrimaryObject.find('.pf-object-order-name').data('sfobjectname');

        if (vIsThisLoggedUserChecked) {
            //Getting the Primary Object
            //Change the Text
            //Clean all the Fields
            //Add the filter pointing to the child

            var vTextMessage = '';
            if (vSFObjectName == enumSFObjectAPIName.Contact) {
                vTextMessage = 'Contact';
            }

            console.log('Changing the Object Driver to Child..');
            FSAuto_AddUserContactIdInTheObjectSection(vOtherSection, vSFObjectName, vObjectFormIdentifier);
            vContentText.find('span').remove();
            vContentText.append($('<span />').append('Using Logged-In User ' + vTextMessage + ' record to prefill this object and the rest of your form.<br /No additional matching needed.'));

            vPrimaryObject.find('.pf-content .pf-text').find('span').remove();
            var vSpanPrimary = $('<span />').append('Using Logged-In User ' + vTextMessage + ' record to prefill your form. No additional matching needed.');
            vPrimaryObject.find('.pf-content .pf-text').append(vSpanPrimary);
            vPrimaryObject.find('.pf-filters .pf-filter-row').remove();
                
            vPrimaryObject.find('.pf-source').hide(); 
            vPrimaryObject.find('.pf-sourceContainer').append(getPFsource_textElement('Related to Contact or User Object.'));

            var vConditionPrimary = new WhereCondition();
            vConditionPrimary.op = 'AND';
            vConditionPrimary.operand1 = 'Id';//Account.Id
            vConditionPrimary.operand2.otext = vObjectFormIdentifier + '.' + vRefFieldName;//Contact.AccountId.A.AccountId
            vConditionPrimary.operand2.otype = enumMatchingFieldType.Relationship;
            vConditionPrimary.addedBy = enumFSAddedBy.LoggedInUser;
            var vRow = addPFFilterRow(vPrimaryObject_SFObjectName, vPrimaryObject_ObjectFormIdentifier, vConditionPrimary);

            vPrimaryObject_Section.append(vRow);
            $(vPrimaryObject_Section).find('select').select2();
            vPrimaryObject.find('.pf-filters').hide();
            vOtherObject_PFContent.find('.pf-orderby').hide();
        } else {
            console.log('Changing Back the Object Driver to Primary..');
            FSAuto_AddPrimaryObjectIdInTheObjectSection(vOtherSection, vSFObjectName, vObjectFormIdentifier, vRefFieldName, vPrimaryObject_ObjectFormIdentifier);

            if (vObjectFSType == enumFSObjectType.Child_Repeated) {
                vContentText.find('span').html('No additional matching is needed for ' + getObjectFSTypeDescription(vObjectFSType) + '.');
            } else {
                vContentText.find('span').html('Additional criteria if multiple child records are found for prefill:');
            }


            var vPrimaryObjectPFText = vPrimaryObject.find('.pf-content .pf-text');
            vPrimaryObjectPFText.find('span').remove();
            setTextPrimaryObject(vPrimaryObjectPFText);
            vPrimaryObject.find('.pf-filters .pf-filter-row').remove();

            var vPrimaryObject_EmptyRow = addEmptyStaticRow(vPrimaryObject_SFObjectName, vPrimaryObject_ObjectFormIdentifier, enumFSAddedBy.Auto);
            vPrimaryObject_Section.append(vPrimaryObject_EmptyRow);
            $(vPrimaryObject_Section).find('select').select2();

            vPrimaryObject.find('.pf-filters').show();
            vPrimaryObject.find('.pf-source').show(); // show pf source value
            //reset pf source value to MatchingCriteria
            setPrefillSource_RadioElement(vPrimaryObject,enumFSPFsource.MatchingCriteria);
            vPrimaryObject.find('.pf-source-text').remove(); //  remove pf source text 
            if (vObjectFSType == enumFSObjectType.Child) {
                vOtherObject_PFContent.find('.pf-orderby').show();
            }
        }

    } else if (vObjectFSType == enumFSObjectType.Primary) {
        if (vIsThisLoggedUserChecked) {
            vContentText.find('span').remove();
            vContentText.append($('<span />').append('Using Logged-In User Contact record to prefill the form. No additional matching needed.'));
            FSAuto_AddUserContactIdInTheObjectSection(vOtherSection, vSFObjectName, vObjectFormIdentifier);
            vOtherSection.hide();
        }
        else {
            vContentText.find('span').remove();
            setTextPrimaryObject(vContentText);

            var vOtherObject_EmptyRow = addEmptyStaticRow(vSFObjectName, vObjectFormIdentifier);
            vOtherSection.append(vOtherObject_EmptyRow);
            $(vOtherSection).find('select').select2();
            vOtherSection.find('.pf-filters').show();
            vOtherSection.show();
           
        }

    }
}

function enableDisableThisIsLoggedInUser(pCheckAll, pIsThisLoggedUserChecked) {
    console.log('[enableDisableThisIsLoggedInUser] Starts...');
    //Block all the other checkboxes

    //Check if any Logged-In user in the page is checked
    if (pCheckAll) {
        $('.ck-header-loggedinuser').each(function () {
            if ($(this).prop('checked')) {
                pIsThisLoggedUserChecked = true;
            }
        });
    }

    if (pIsThisLoggedUserChecked) {
        $('.ck-header-loggedinuser').each(function () {
            if (!$(this).prop('checked')) {
                $(this).prop('disabled', true);
                var vCheckBoxID = $(this).prop('id');
                var vLabel = $('label[for="' + vCheckBoxID + '"]');
                vLabel.parent().prop('title', enumPrefillMessages.LoggedInUserDisabled_BC_LoggedInUserIsChecked);
            }
        })
    } else {
        $('.ck-header-loggedinuser').each(function () {

            //Don't enable if the Prefill This Object is disabled
            var vPFTitle = $(this).parent().parent();
            var vCheckBox_PrefillThisObject = vPFTitle.find('.ck-header-prefillthisobject');

            if (!$(this).prop('checked')) {
                var vEnableCheckBox = true;

                //Don't enable if the Prefill This Object is disabled
                if (!vCheckBox_PrefillThisObject.prop('checked')) {
                    vEnableCheckBox = false;//Keep disable
                }

                $(this).prop('disabled', !vEnableCheckBox);
            } else {

                //Don't enable if the Prefill This Object is disabled
                if (!vCheckBox_PrefillThisObject.prop('checked')) {
                    //If it is enabled, but Prefill This Object checkbox is disabled, we uncheck the checkbox and disabled it.
                    $(this).prop('disabled', true);
                }

            }

        });
    }

}

function FSAuto_AddUserContactIdInTheObjectSection(pSection, pSFObjectName, pObjectFormIdentifier) {
    var vCondition = new WhereCondition();
    vCondition.op = 'AND';

    if (pSFObjectName == enumSFObjectAPIName.Contact) {
        vCondition.operand1 = 'FSAuto_Contact';//Identify that the matching criteria value will be automatically set up
        vCondition.operand2.otext = enumFSToken.User_ContactId;
    } else if (pSFObjectName == enumSFObjectAPIName.User) {
        vCondition.operand1 = 'FSAuto_User';//Identify that the matching criteria value will be automatically set up
        vCondition.operand2.otext = enumFSToken.UserId;
    }

    vCondition.operand2.otype = enumMatchingFieldType.Token;
    vCondition.addedBy = enumFSAddedBy.LoggedInUser;

    var vRow = addPFFilterRow(pSFObjectName, pObjectFormIdentifier, vCondition);

    pSection.append(vRow);
    $(pSection).find('select').select2();
}

function FSAuto_AddPrimaryObjectIdInTheObjectSection(pSection, pSFObjectName, pObjectFormIdentifier, pPrimaryObject_ReferenceTo, pPrimaryObject_ObjectFormIdentifier) {
    var vCondition = new WhereCondition();
    vCondition.op = 'AND';
    vCondition.operand1 = pPrimaryObject_ReferenceTo;
    vCondition.operand2.otext = pPrimaryObject_ObjectFormIdentifier + '.' + 'Id';
    vCondition.operand2.otype = enumMatchingFieldType.Relationship;
    vCondition.addedBy = enumFSAddedBy.Auto;

    var vRow = addPFFilterRow(pSFObjectName, pObjectFormIdentifier, vCondition);

    pSection.append(vRow);
    $(pSection).find('select').select2();
}

function getTokenDescription(pTokenValue) {
    if (pTokenValue == 'User.ContactId') {
        return 'Logged-in User Contact';
    } else if (pTokenValue == 'User.Email') {
        return 'Logged-in User Email';
    } else if (pTokenValue == 'User.AccountId') {
        return 'Logged-in User Account';
    } else if (pTokenValue == 'User.Id') {
        return 'Logged-in User Id';
    }

    return pTokenValue;
}

function setPFText(pPFText, pPrefillObject) {
    var vSpan = $('<span />');
    var vAutoText = FSAutoOption_getProperlyText(pPrefillObject);

    if (vAutoText != '') {
        vSpan.append(vAutoText);
    } else if (pPrefillObject.objectFSType == enumFSObjectType.Child) {
        vSpan.append('Additional criteria if multiple child records are found for Prefill:');
    } else if (HideFilterPFFilter(pPrefillObject)) {
        vSpan.append('No additional matching is needed for ' + getObjectFSTypeDescription(pPrefillObject.objectFSType) + '.');
    } else {
        setTextPrimaryObject(pPFText);
    }

    pPFText.append(vSpan);
    return vAutoText != '';
}

function setTextPrimaryObject(pPFText) {
    var vSpan = $('<span />');
    vSpan.append('Configure matching criteria to find a record to prefill this object and other related objects.<br />');
    pPFText.append(vSpan);
    vSpan = $('<span />', { 'class': 'small-text fs-italic' });
    $(vSpan).append('E.g. Use a lookup field from this object and set it <strong>equals</strong> to the Logged-in User Contact. ');
    pPFText.append(vSpan);
}

function FSAutoOption_getProperlyText(pPrefillObject) {
    console.log('[FSAutoOption_getProperlyText] Start...');

    var vTextContext = '';
    var vCheckThisIsLoggedInUser = false;
    var vProperlyTextForAutoProcessing = '';
    var pWhereClauses = pPrefillObject.whereClause;
    for (var iIndexWhereClause = 0; iIndexWhereClause < pWhereClauses.section.length; iIndexWhereClause++) {
        var vSection = pWhereClauses.section[iIndexWhereClause];

        for (var iIndexCondition = 0; iIndexCondition < vSection.condition.length; iIndexCondition++) {
            var vCondition = vSection.condition[iIndexCondition];

            //1. If it is Primary and AddedBy = LoggedInUser and Type is Token and Filter Value = User.ContactId 
            //      Then The user check this is logged-in user for the Primary object.
            if (pPrefillObject.objectFSType == enumFSObjectType.Primary && vCondition.addedBy == enumFSAddedBy.LoggedInUser && vCondition.operand2.otype == enumMatchingFieldType.Token) {
                if (vCondition.operand2.otext == enumFSToken.User_ContactId) {
                    vTextContext = 'User Contact';
                    vCheckThisIsLoggedInUser = true;
                } else if (vCondition.operand2.otext == enumFSToken.UserId) {
                    vTextContext = 'User';
                    vCheckThisIsLoggedInUser = true;
                }
            }

            //2. If it is Primary and AddedBy = LoggedInUser and Type is Relationship and Filter Value contains User or Contact
            //      Then The user check this is logged-in user for the child object
            if (pPrefillObject.objectFSType == enumFSObjectType.Primary && vCondition.addedBy == enumFSAddedBy.LoggedInUser && vCondition.operand2.otype == enumMatchingFieldType.Relationship) {
                if (vCondition.operand2.otext.indexOf(enumSFObjectAPIName.Contact) != -1) {
                    vTextContext = 'User Contact';
                } else if (vCondition.operand2.otext.indexOf(enumSFObjectAPIName.User) != -1) {
                    vTextContext = 'User';
                }
            }

            //3. If it is Child(Detaild) or Repeated Child(DetailRepeated) and AddedBy = LoggedInUser and Type is token and Filter Value = User.ContactId/User.Id 
            //   Then The user check this is logged-in user for the child object
            if ((pPrefillObject.objectFSType == enumFSObjectType.Child || pPrefillObject.objectFSType == enumFSObjectType.Child_Repeated)
                && vCondition.addedBy == enumFSAddedBy.LoggedInUser && vCondition.operand2.otype == enumMatchingFieldType.Token) {

                if (vCondition.operand2.otext == enumFSToken.User_ContactId) {
                    vTextContext = 'User Contact';
                    vCheckThisIsLoggedInUser = true;
                } else if (vCondition.operand2.otext == enumFSToken.UserId) {
                    vTextContext = 'User';
                    vCheckThisIsLoggedInUser = true;
                }
            }

            //4. If it is Child(Detaild) or Repeated Child(DetailRepeated) and AddedBy = LoggedInUser and Type is Relationship and Filter Value contains User or Contact
            //      Then The user check this is logged-in user for the child object
            //This scenario should never happens because if I check the Primary, the relation for the childs won't change

            pPrefillObject.ThereIsFilterToLoggedInUser = false;
            if (vTextContext != '') {
                if (pPrefillObject.objectFSType == enumFSObjectType.Primary) {
                    vProperlyTextForAutoProcessing = 'Using Logged-In ' + vTextContext + ' record to prefill the form. No additional matching needed.';
                } else {
                    vProperlyTextForAutoProcessing = 'Using Logged-In ' + vTextContext + ' record to prefill this object and the rest of your form.<br />No additional matching needed.';
                }
                if (vCheckThisIsLoggedInUser) {
                    pPrefillObject.IsThisLoggedInUser = true;
                    pPrefillObject.ThereIsFilterToLoggedInUser = true;
                }
                else {
                    pPrefillObject.ThereIsFilterToLoggedInUser = true;
                }
            }

            if(pPrefillObject.prefillSource==enumFSPFsource.RecordList){

                vProperlyTextForAutoProcessing='<p>Primary object record will be found based on the record that the user selects from a Lightning Record List when your form is placed on a Lightning Record Detail page. No additional matching is needed.<br/></p> '+
                '<a href="https://sfapphelp.formstack.com/hc/en-us/articles/360018480272-Prefilling-Community-Forms-from-Record-List-Component" target="_blank">Learn how</a> to setup Record List view Prefill in you community.';
                }

        }
    }
    return vProperlyTextForAutoProcessing;
}

function HideFilterPFFilter(pPrefillObject) {
    if (pPrefillObject.objectFSType == enumFSObjectType.Lookup || pPrefillObject.objectFSType == enumFSObjectType.Child_Repeated) {
        return true;
    }
    return false;
}

function switchFilterValue(pFilterValue, pThis) {

    var vPFFilterValue = $(pThis).parent().parent().parent();
    var vObjectName = $(pThis).data('sfobjectname');
    var vObjectFormIdentifier = $(pThis).data('objectformidentifier');
    var vValue = '';

    if (pFilterValue == 'token') {
        vValue = $(pThis).data('tokenvalue');
    }

    var vCondition = new WhereCondition();
    vCondition.op = 'AND';
    vCondition.operand1 = '';
    vCondition.operand2.otext = vValue;
    vCondition.operand2.otype = pFilterValue;

    var vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    vPFFilterValue.prepend(vPFFilterValueBox);
    vPFFilterValue.find('select').select2();

    //Remove old pf-filter-value-box
    $(pThis).parent().parent().remove();
}

function getColumnDropDown(pSFObjectName, pSelectedValue) {
    var vListFields = getAllFieldsByObject(pSFObjectName);
    var vSelect = $('<select />');
    var vValueSelected = getValueSelected(pSelectedValue);
    var vReferenceToAutoSelect = '';

    //Get Automatically, an object with the type Contact - Logged-In User checkbox
    if (vValueSelected == 'FSAuto_Contact' || vValueSelected == 'FSAuto_User') {
        //But if the object is a contact, so it should load the ID instead of Contact Lookup
        if (pSFObjectName == enumSFObjectAPIName.User) {
            vValueSelected = 'Id';
        } else if (pSFObjectName == enumSFObjectAPIName.Contact) {
            vValueSelected = 'Id';
        } else {
            vReferenceToAutoSelect = enumSFObjectAPIName.Contact;
            vValueSelected = '';
        }
    }

    var vOptionSelectARecord = $('<option />', { 'value': '' });
    vOptionSelectARecord.append('--- Select Field ---');
    vSelect.append(vOptionSelectARecord);

    for (var iIndexListField = 0; iIndexListField < vListFields.length; iIndexListField++) {
        var vFieldObject = vListFields[iIndexListField];
        var vSelected = false;

        //If user has checked This is Logged-In User in the object, we will get the first Contact object
        if (vValueSelected == '' && vReferenceToAutoSelect != '' && vReferenceToAutoSelect == vFieldObject.ReferenceTo) {
            vSelected = true;
        } else if (vFieldObject.FieldName == vValueSelected) {
            vSelected = true;
        }

        var vOption = $('<option />', { 'value': vFieldObject.FieldName });
        vOption.prop('selected', vSelected);
        vOption.append(vFieldObject.LabelName);
        vOption.data('sftype', vFieldObject.SFType);
        vOption.data('referenceto', vFieldObject.ReferenceTo);
        vSelect.append(vOption);
    }

    return vSelect;
}

function getMF_PickListDropdown(pCondition, pSFObjectName) {
    console.log('[getMF_PickListDropdown] Starts...pSFObjectName[' + pSFObjectName + ']');
    //1. Get Pick List for an specific object and Field
    //1.1 Go Throught the oListFieldsByObject
    //1.1.1 if the Object is the same as the Parameter pSFObjectName, Go through the List of fields
    //1.1.1.1 For each field check if the FieldName is the Same as the value selected by the user(pCondition.operand1)
    //1.1.1.2 If it is the same, get all PickListValues and check the one that is selected by the user pCondition.operand2.otext

    var vSelect = $('<select />');
    vSelect.change(function () {
        validateSavePrefill('PickList_Changed');
    });

    var vObjectFieldSelected = pCondition.operand1;
    var vValueSelected = pCondition.operand2.otext;

    var vOptionSelectARecord = $('<option />', { 'value': '' });
    vOptionSelectARecord.append('--- Select Field ---');
    vSelect.append(vOptionSelectARecord);

    //1.1 Go Throught the oListFieldsByObject
    for (var iIndexListField = 0; iIndexListField < oListFieldsByObject.length; iIndexListField++) {
        var vObject = oListFieldsByObject[iIndexListField];

        //1.1.1 if the Object is the same as the Parameter pSFObjectName, Go through the List of fields
        if (pSFObjectName == vObject.ObjectName) {
            console.log('[getMF_PickListDropdown] Same object...');
            for (var iIndexField = 0; iIndexField < vObject.ListFields.length; iIndexField++) {

                var vField = vObject.ListFields[iIndexField];

                //1.1.1.1 For each field check if the FieldName is the Same as the value selected by the user(pCondition.operand1)
                if (vField.FieldName == vObjectFieldSelected) {
                    console.log('[getMF_PickListDropdown] Same Field...');
                    //1.1.1.2 If it is the same, get all PickListValues and check the one that is selected by the user pCondition.operand2.otext
                    for (var iIndexPickListOption = 0; iIndexPickListOption < vField.ListPickListOptions.length; iIndexPickListOption++) {
                        var vPickListOption = vField.ListPickListOptions[iIndexPickListOption];
                        var vSelected = false;
                        if (vPickListOption.Value == vValueSelected) {
                            vSelected = true;
                        }

                        var vOption = $('<option />', { 'value': vPickListOption.Value });
                        vOption.prop('selected', vSelected);
                        vOption.append(vPickListOption.Label);

                        vSelect.append(vOption);
                    }
                    break;
                }
            }
            //If we got there we found the object, we don't need to check other objects
            break;
        }
    }
    return vSelect;
}

function getValueRelationshipDropdown(pCondition, pObjectFormIdentifier) {
    console.log('[getValueRelationshipDropdown] Starts...');

    console.log(pObjectFormIdentifier);
    var vSelect = $('<select />');
    var vValueSelected = pCondition.operand2.otext;

    var vOptionSelectARecord = $('<option />', { 'value': '' });
    vOptionSelectARecord.append('--- Select Field ---');
    vSelect.append(vOptionSelectARecord);

    for (var iIndexObjectConfig = 0; iIndexObjectConfig < oListObjectConfiguration.length; iIndexObjectConfig++) {
        var vObjectConfiguration = oListObjectConfiguration[iIndexObjectConfig];
        var vObjectFormIdentifierConfiguration = vObjectConfiguration.SFObjectName + '.' +
            vObjectConfiguration.RelatedField + '.' +
            vObjectConfiguration.Letter;

        //Don't show the fields from the its object
        if (vObjectFormIdentifierConfiguration == pObjectFormIdentifier) {
            continue;
        }

        for (var iIndexListField = 0; iIndexListField < oListFieldsByObjectOnlyReferences.length; iIndexListField++) {
            var vObject = oListFieldsByObjectOnlyReferences[iIndexListField];

            if (vObjectConfiguration.SFObjectName != vObject.ObjectName) {
                continue;
            }
            var vClass = 'FieldOption section ' + vObjectConfiguration.Letter;
            if (vObjectConfiguration.ObjectFSType == enumFSObjectType.Child_Repeated) {
                vClass += ' repeat';
            }
            var vOptionGroup = $('<optgroup />', { 'label': vObjectConfiguration.ObjectName, 'class': vClass });

            for (var iIndexField = 0; iIndexField < vObject.ListFields.length; iIndexField++) {
                var vSelected = false;
                var vField = vObject.ListFields[iIndexField];
                var vFieldValue = vObjectFormIdentifierConfiguration + '.' + vField.FieldName;

                if (vFieldValue == vValueSelected) {
                    vSelected = true;
                }

                var vOption = $('<option />', { 'value': vFieldValue });
                vOption.prop('selected', vSelected);
                vOption.append(vObjectConfiguration.ObjectName + ' - ' + vField.LabelName);

                vOptionGroup.append(vOption);
            }

            vSelect.append(vOptionGroup);
            break;
        }
    }

    return vSelect;
}

function getOrderByDropdown(pOrderBy) {
    console.log('[getOrderByDropdown] Starts...');
    var vSelect = $('<select />');
    var vValueSelected = getOrderByValueFromPrefillJSON(pOrderBy);

    var vListOrderBy = [];
    var vDefaultOrderByList = getListDefaultOrderBy();
    for (var vIndexOrderBy = 0; vIndexOrderBy < vDefaultOrderByList.length; vIndexOrderBy++) {
        var vOrderByClause = vDefaultOrderByList[vIndexOrderBy];
        var vNewObject = new Object();

        var vLabel = '';
        if (vOrderByClause.ascDesc == 'desc') {
            vLabel = 'Last ';
        } else {
            vLabel = 'First ';
        }

        if (vOrderByClause.expression == 'CreatedDate') {
            vLabel += 'Created';
        } else {
            vLabel += 'Updated';
        }
        vNewObject.Label = vLabel;
        vNewObject.Value = vOrderByClause.expression + '.' + vOrderByClause.ascDesc;
        vListOrderBy.push(vNewObject);
    }

    for (var iIndexListOrder = 0; iIndexListOrder < vListOrderBy.length; iIndexListOrder++) {
        var vObjectOrder = vListOrderBy[iIndexListOrder];
        var vSelected = false;
        if (vValueSelected == vObjectOrder.Value) {
            vSelected = true;
        }

        var vOption = $('<option />', { 'value': vObjectOrder.Value });
        vOption.prop('selected', vSelected);
        vOption.append(vObjectOrder.Label);
        vSelect.append(vOption);
    }
    return vSelect;
}

function getOrderByValueFromPrefillJSON(pOrderBy) {
    var vSelectedValue = 'CreatedBy.desc';
    var vListClause = pOrderBy.clause;

    if (vListClause != null && vListClause.length > 0) {
        var vOrderByClause = vListClause[0];
        vSelectedValue = vOrderByClause.expression + '.' + vOrderByClause.ascDesc;
    }
    return vSelectedValue;
}

function getValueSelected(pSelectedValue) {
    var vList = pSelectedValue.split('.');

    if (vList.length == 2) {
        return vList[1];
    } else {
        return pSelectedValue;
    }
}

function getPrefillJSONToSave() {

    removeAllRowsWithNoObjectSelected();

    var vPrefillRules = new PrefillRules();

    $('.pf-object-container').each(function () {
        var vPrefillRule = new PrefillRule();

        getPFHeader($(this), vPrefillRule);

        getPFFilterRow($(this), vPrefillRule);

        getPFOrderByRow($(this), vPrefillRule);

        vPrefillRules.prefillRules.push(vPrefillRule);
    });

    console.log(vPrefillRules);
    return vPrefillRules;
}

function getPFHeader(pObjectContainer, pPrefillRule) {

    var vPFHeader = $(pObjectContainer).find('.pf-header');

    var vObjectName = $(vPFHeader).find('.pf-header-object-name').find('span').text();
    var vSFObjectName = $(vPFHeader).find('.pf-object-order-name').data('sfobjectname');
    var vObjectfstype = $(vPFHeader).find('.pf-object-order-name').data('objectfstype');
    var vLetter = $(vPFHeader).find('.pf-object-order-name').data('letter');
    var vRefFieldName = $(vPFHeader).find('.pf-object-order-name').data('refFieldName');
    var vPrefillThisObject = $(vPFHeader).find('.ck-header-prefillthisobject').prop('checked');
    var vPrefillSource = $(vPFHeader).find('.pf-header-loggedinuser').data('prefillsource');
    pPrefillRule.objDisplayName = vObjectName;
    pPrefillRule.sfObjectName = vSFObjectName;
    pPrefillRule.objectFSType = vObjectfstype;
    pPrefillRule.isActive = vPrefillThisObject;
    pPrefillRule.letter = vLetter;
    pPrefillRule.refFieldName = vRefFieldName;
    pPrefillRule.prefillSource = vPrefillSource;
}

function getPFFilterRow(pObjectContainer, pPrefillRule) {

    var vPFFilterRow = $(pObjectContainer).find('.pf-filters');

    var vWhereClause = new WhereClauseObj();
    vWhereClause.ruleop = 'AND';

    var vSection = new SectionObj();
    vSection.condIndex = 1;
    vSection.ruleop = 'AND';

    $(vPFFilterRow).find('.pf-filter-row').each(function () {
        var vColumnValue = $(this).find('.pf-filter-column').find('select').val();
        var vFieldType = $(this).find('.pf-filter-column').find(':selected').data('sftype');
        var vOperator = $(this).find('.pf-filter-operator').text();
        var vAddedBy = $(this).find('.pf-filter-value-box').data('addedby');
        var vFilterValue_Operand2 = getFilterValue($(this));

        var vCondition = new WhereCondition();
        vCondition.op = getFilterOperator(vOperator);
        vCondition.operand1 = vColumnValue;
        vCondition.operand2.otext = vFilterValue_Operand2.otext;
        vCondition.operand2.otype = vFilterValue_Operand2.otype;
        vCondition.addedBy = vAddedBy;
        vCondition.fieldType = vFieldType;

        vSection.condition.push(vCondition);
    });

    vWhereClause.section.push(vSection);

    pPrefillRule.whereClause = vWhereClause;
}

function getPFOrderByRow(pObjectContainer, pPrefillRule) {
    var vPFOrderBy = $(pObjectContainer).find('.pf-orderby');

    $(vPFOrderBy).find('select.select2-offscreen').each(function () {
        var vSelected2Value = $(this).select2('val').toString();
        var vListOrderByFormat = vSelected2Value.toString().split('.');

        var objOrder = new OrderClauseCondition();
        objOrder.expression = vListOrderByFormat[0];
        objOrder.ascDesc = vListOrderByFormat[1];
        objOrder.clauseIndex = '1';

        pPrefillRule.orderBy.clause.push(objOrder);
    });
}

function removeAllRowsWithNoObjectSelected() {
    //Before save, remove all the filters which the user didn't select any field
    $('.pf-container-listobject .pf-object-container').each(function () {
        $(this).find('.pf-filter-row').each(function () {
            var vColumnValue = $(this).find('.pf-filter-column').find('select').val();
            if (vColumnValue == '') {
                $(this).remove();
            }
        });
    });
}

function getFilterValue(pThis) {
    var vFilterType = $(pThis).find('.pf-filter-value-box').data('filtertype');//token, static, relationship
    var operand2 = new Object();
    operand2.otype = vFilterType;

    console.log('vFilterType[' + vFilterType + ']');
    if (vFilterType == enumMatchingFieldType.Token) {
        operand2.otext = $(pThis).find('.pf-filter-value-input').data('tokenvalue');
    } else if (vFilterType == enumMatchingFieldType.Relationship) {
        operand2.otext = $(pThis).find('.pf-filter-value-input .select2-offscreen').select2('val');
    } else if ((vFilterType == enumMatchingFieldType.Static_Lookup) ||
        (vFilterType == enumMatchingFieldType.Static_Token_Email) ||
        (vFilterType == enumMatchingFieldType.Static_Token_Contact) ||
        (vFilterType == enumMatchingFieldType.Static_Token_User)) {
        operand2.otext = $(pThis).find('.pf-filter-value-input').data('pf_value');
    } else if (vFilterType == enumMatchingFieldType.PickList) {
        operand2.otext = $(pThis).find('.pf-filter-value-box .select2-offscreen').select2('val');
    } else if (vFilterType == enumMatchingFieldType.Boolean) {
        operand2.otext = $(pThis).find('.pf-filter-value-input>input').prop('checked');
    } else if ((vFilterType == enumMatchingFieldType.DateTime) || (vFilterType == enumMatchingFieldType.Date)) {
        operand2.otext = getDateISO($(pThis).find('.pf-filter-value-input>input').val());
    } else {
        operand2.otext = $(pThis).find('.pf-filter-value-input>input').val();
    }

    return operand2;
}

function getDateISO(pDate) {
    if (pDate != '') {
        var vDate = new Date(pDate);
        return vDate.toISOString();
    }
    return '';
}

function deleteRow(pThis) {
    var vRow = $(pThis).parent().parent().parent();
    vRow.remove();
}

function addRow(pThis) {
    var vRowAddButton = $(pThis).parent().parent().parent();
    var vSection = vRowAddButton.parent();

    var pSFObjectName = $(pThis).data('sfobjectname');
    var pObjectFormIdentifier = $(pThis).data('objectformidentifier');

    var vRow = addEmptyStaticRow(pSFObjectName, pObjectFormIdentifier, enumFSAddedBy.User);
    vSection.append(vRow);
    $(vSection).find('select').select2();
}

function addEmptyStaticRow(pSFObjectName, pObjectFormIdentifier, pAddedBy) {
    var vCondition = new WhereCondition();
    vCondition.op = 'AND';
    vCondition.operand1 = '';
    vCondition.operand2.otext = '';
    vCondition.operand2.otype = enumMatchingFieldType.Static;
    vCondition.addedBy = pAddedBy;

    var vRow = addPFFilterRow(pSFObjectName, pObjectFormIdentifier, vCondition);

    return vRow;
}

function getAllFieldsByObject(pSFObjectName) {
    var vListFields = [];

    for (var iIndexObject = 0; iIndexObject < oListFieldsByObject.length; iIndexObject++) {
        var vObject = oListFieldsByObject[iIndexObject];
        if (vObject.ObjectName == pSFObjectName) {
            vListFields = vObject.ListFields;
            break;
        }
    }

    return vListFields;
}

/** Helpers **/

function getFilterOperator(pOperator) {
    if (pOperator == 'equals') {
        return 'EQ';
    } else {
        return pOperator;
    }
}

function fsNewDiv(pClass) {
    return $('<div />', { 'class': pClass });
}
function fsNewButton(pClass) {
    return $('<button />', { 'class': pClass, 'type': 'button' });
}

function loadRelationshipList() {
    oListFieldsByObjectOnlyReferences = [];

    for (var iIndexObject = 0; iIndexObject < oListFieldsByObject.length; iIndexObject++) {
        var vObject = oListFieldsByObject[iIndexObject];
        var vListNewFields = [];

        for (var iIndexField = 0; iIndexField < vObject.ListFields.length; iIndexField++) {
            var vField = vObject.ListFields[iIndexField];

            var vNewField = new SF_Field();
            vNewField.FieldName = vField.FieldName;
            vNewField.LabelName = vField.LabelName;
            vNewField.ReferenceTo = vField.ReferenceTo;
            vNewField.SFType = vField.SFType;

            if (vNewField.SFType == 'REFERENCE') {
                vNewField.LabelName = vNewField.LabelName;
                vListNewFields.push(vNewField);
            } else if (vNewField.SFType == 'ID' && vNewField.FieldName == 'Id') {
                vNewField.LabelName = vNewField.LabelName;
                vListNewFields.push(vNewField);
            }
        }

        if (vListNewFields.length > 0) {
            var vNewObject = new Object();
            vNewObject.ObjectName = vObject.ObjectName;
            vNewObject.ListFields = vListNewFields;

            oListFieldsByObjectOnlyReferences.push(vNewObject);
        }
    }
}

function validateSavePrefill(pContext) {
    console.log('[validateSavePrefill] Starts...pContext[' + pContext + ']');
    //1. Check all the objects
    //1.1. For each object which is disable, remove the icon
    //1.2. If the object is enable(Prefil This Object is checked), we will check the filters
    //1.2.1. We should have at least one filter that has Object Field selected and Mathicing criteria value
    //1.2.2. If we don't have any good filter, we show the alert
    //2. If we have one alert, we won't Enable the Save Button
    //3. When we load the page and the prefill is enabled, we won't enable the save button, Context='endOfGetPrefillBuilder_PrefillFilled'
    //4. If There is no Prefill Driver enabled, disabled the save button

    //If this method was called from the first load, we won't check consider as changedetected
    if (pContext !== 'endOfGetPrefillBuilder' && pContext != 'endOfGetPrefillBuilder_PrefillFilled') {
        vChangeDetected = true;
    }

    var vEnableSavePrefill = true;//
    var vThereIsPrefillEnabled = false;

    //1. Check all the objects
    $('.pf-container-listobject .pf-object-container').each(function () {
        var vShowAlert = false;
        var vCheckBox_PrefillThisObject = $(this).find('.ck-header-prefillthisobject');
        var vFSObjectType = $(this).find('.pf-object-order-name').data('objectfstype');

        //1.1. For each object which is disable, remove the icon
        if (!vCheckBox_PrefillThisObject.prop('checked')) {
            $(this).find('.pf-icon-status').removeClass('checkmark-green');
            $(this).find('.pf-icon-status').removeClass('alert-triangle');
            $(this).find('.pf-icon-status').prop('title', '');
            $(this).removeClass('box-shadown-blue');
            return true;//Continue to the next object
        }

        vThereIsPrefillEnabled = true;

        //1.2. If the object is enable(Prefil This Object is checked), we will check the filters
        var vThereIsOneGoodFilter = false;
        $(this).find('.pf-filter-row').each(function () {

            var vObjectFieldSelected = $(this).find('.pf-filter-column select.select2-offscreen').select2('val');
            if (vObjectFieldSelected == '') {
                return true;//continue
            }

            vThereIsOneGoodFilter = true;
        });

        //1.2.1. We should have at least one filter that has Object Field selected and Mathicing criteria value
        //1.2.2. If we don't have any good filter, we show the alert
        if (!vThereIsOneGoodFilter) {
            vShowAlert = true;
            //2. If we have one alert, we won't Enable the Save Button
            vEnableSavePrefill = false;
        }

        //We show alert just if the PrefillThisObject is Enabled
        if (vShowAlert) {
            $(this).find('.pf-icon-status').removeClass('checkmark-green');
            $(this).find('.pf-icon-status').addClass('alert-triangle');
            $(this).find('.pf-icon-status').prop('title', 'Please setup matching criteria to prefill this object.');

            if (vFSObjectType == enumFSObjectType.Primary) {
                $(this).addClass('box-shadown-blue');
            }

        } else {
            $(this).find('.pf-icon-status').removeClass('alert-triangle');
            $(this).find('.pf-icon-status').addClass('checkmark-green');
            $(this).find('.pf-icon-status').prop('title', '');
            $(this).removeClass('box-shadown-blue');
        }
    });

    //3. When we load the page and the prefill is enabled, we won't enable the save button, Context='endOfGetPrefillBuilder_PrefillFilled'
    if (pContext == 'endOfGetPrefillBuilder_PrefillFilled') {
        vEnableSavePrefill = false;
    }

    //4. If There is no Prefill Driver enabled, disabled the save button
    if (!IsThereAPrefillDriverEnable()) {
        vEnableSavePrefill = false;
    }

    //2. If we have one alert, we won't Enable the Save Button
    if (vEnableSavePrefill == false) {
        $('.btn-saveprefill').addClass('va-disabled');
    } else {
        //We should have at least one Prefill Enabled
        if (vThereIsPrefillEnabled) {
            $('.btn-saveprefill').removeClass('va-disabled');
        }
    }
}

function IsThereAPrefillDriverEnable() {
    console.log('[IsThereAPrefillDriverEnable] Start...');
    //1. Check If the object is Primary, if it is, check if Prefill This Object is enabled.
    //1.1 If it is enabled return true
    //1.2 If it is not enabled, check if there is any child which has the Logged-In User checked.
    //1.2.1 If there is return true
    //2. If we don't have a primary account that is enabled and any Logged-In User checked, disabled the save button.
    var vThereIsPrefillDriver = false;
    $('.pf-container-listobject .pf-object-container').each(function () {
        var vfsobjecttype = $(this).find('.pf-object-order-name').data('objectfstype');
        var vCheckBox_PrefillThisObject = $(this).find('.ck-header-prefillthisobject');
        var vCheckBox_LoggedInUser = $(this).find('.ck-header-loggedinuser');

        console.log('[vfsobjecttype] ' + vfsobjecttype);
        if (vfsobjecttype == enumFSObjectType.Primary) {
            if (vCheckBox_PrefillThisObject.prop('checked')) {
                vThereIsPrefillDriver = true;
                return;
            }
        } else {
            if (vCheckBox_LoggedInUser.prop('checked')) {
                if (vCheckBox_PrefillThisObject.prop('checked')) {
                    vThereIsPrefillDriver = true;
                    return;
                }
            }
        }

    });

    return vThereIsPrefillDriver;
}

function toggleComponent(pEnableToggle, pToggleComponent) {
    var prefillModeParent = $(pToggleComponent).parents('.prefill-mode-box-inner');
    var prefillWrapperElement = $(pToggleComponent).parents('.prefill-wrapper');
    var publishOptionsTabElem = $(prefillWrapperElement).parents('.publish-box-main-wrapper');
    if (pEnableToggle) {
        $(prefillWrapperElement).find('.fastprefill-mode-box').removeClass('display-none');
        $(prefillModeParent).find('.prefill-mode-status').html('Dynamic Prefill Enabled');
        $(prefillModeParent).addClass('mode-active');
    }
    else {
        $(prefillWrapperElement).find('.fastprefill-mode-box').addClass('display-none');
        $(prefillModeParent).find('.prefill-mode-status').html('Dynamic Prefill Disabled');
        $(prefillModeParent).removeClass('mode-active');
    }
}

function showAutoPrefillTextBox() {
    //Hide and show the Auto Prefill Text Box
    //Show the box when there is a contact object in the Form

    //Show just if the user haven't seening this
    if (!IsCommunityPrefillFormEnable) {
        var vCountUserContactObject = 0;
        var vAutoPrefillText = '';
        $('.pf-container-listobject .pf-object-container').each(function () {
            var vObjectName = $(this).find('.pf-object-order-name').data('sfobjectname');
            var vObjectFSType = $(this).find('.pf-object-order-name').data('objectfstype');

            if (vObjectName == enumSFObjectAPIName.Contact || vObjectName == enumSFObjectAPIName.User) {
                //Just for Primary and Child, Not Lookup and Child-Repeated
                if ((vObjectFSType == enumFSObjectType.Primary) || (vObjectFSType == enumFSObjectType.Child)) {
                    vCountUserContactObject++;
                    vAutoPrefillText = vObjectName;
                }
            }
        });

        if (vCountUserContactObject == 1) {
            $('.pf-container-autoprefill').show();
            $('.btn-autoprefill').show();
            $('.btn-noautoprefill').html("No, I don't need it");
            $('.btn-noautoprefill').removeClass('vabutton1');
            $('.pf-text-autoprefill').html('We noticed you have a ' + vAutoPrefillText + ' object in your form.' +
                ' Do you want this ' + vAutoPrefillText + ' object to be prefilled with the Logged-in user details?');
        } else if (vCountUserContactObject > 1) {
            $('.pf-container-autoprefill').show();
            $('.pf-text-autoprefill').html('We noticed you have several Contact or User objects on your form. ' +
                'You can prefill one of these Contact or User objects with logged-in user details by clicking the "This is the logged-in user" checkbox. ' +
                'This will allow you to automatically prefill other objects on your form with data related to the Logged-in user.');
            $('.btn-autoprefill').hide();
            $('.btn-noautoprefill').html("Ok, got it!");
            $('.btn-noautoprefill').addClass('vabutton1');
        }

        $('.btn-noautoprefill').click(function () {
            $('.pf-container-autoprefill').hide();
        });

        $('.btn-autoprefill').click(function () {
            setAutoPrefillContactObject();
        });
    }
}

function setAutoPrefillContactObject() {
    console.log('[setAutoPrefillContactObject] Starts...');
    $('.pf-container-listobject .pf-object-container').each(function () {
        var vObjectName = $(this).find('.pf-object-order-name').data('sfobjectname');
        var vObjectFSType = $(this).find('.pf-object-order-name').data('objectfstype');
        if (((vObjectName == enumSFObjectAPIName.Contact) || (vObjectName == enumSFObjectAPIName.User)) && (vObjectFSType != enumFSObjectType.Lookup)) {
            if ($(this).find('.ck-header-loggedinuser').prop('checked') == false) {
                $(this).find('.ck-header-loggedinuser').click();

                
                setPrefillSource_RadioElement( $(this),enumFSPFsource.loggedInUser)

            }
            $('.pf-container-autoprefill').hide();
            return false;
        }
    });
}

function prefillThisObject_ClickEvent(pThis) {
    console.log('[prefillThisObject_ClickEvent] Starts...');
    //1. If Prefill is disabled, uncheck this Logged-In User
    //2. Run the addRemoveObjectContainerBlock

    var vPFObjectContainer = $(pThis).parent().parent().parent().parent().parent();
    var vFSObjectType = vPFObjectContainer.find('.pf-object-order-name').data('objectfstype');
    var vCheckBoxLoggedInUser = vPFObjectContainer.find('.ck-header-loggedinuser');

    //If user click on Prefill This Object, we will uncheck the Logged-In User
    if (vCheckBoxLoggedInUser != null && vCheckBoxLoggedInUser.prop('checked')) {
        vCheckBoxLoggedInUser.click();
    }

    prefillThisObjectCheck();

    //reset pf source value to MatchingCriteria
    setPrefillSource_RadioElement(vPFObjectContainer,enumFSPFsource.MatchingCriteria);

}
function setPrefillSource_RadioElement(container,pf_value){
    //Clear prefill selected value 
    //select loggedin_user as active
    //add prefillSource as loggedin_user
    if(pf_value==enumFSPFsource.MatchingCriteria){
        container.find('a[href="#RecordList"]').parent('.pf-source').removeClass('active');
        container.find('a[href="#MatchingCriteria"]').parent('.pf-source').addClass('active');
        container.find('a[href="#loggedInUser"]').parent('.pf-source').removeClass('active');
        container.find('.pf-header-loggedinuser').data('prefillsource', enumFSPFsource.MatchingCriteria);
        if(typeof container.find('a[href="#MatchingCriteria"]').parent('.pf-source')[0] != "undefined" && container.find('.pf-source').is(":visible")){
            addLoggedInUserRow($(container));
        }
    }else if(pf_value==enumFSPFsource.loggedInUser){
        container.find('a[href="#RecordList"]').parent('.pf-source').removeClass('active');
        container.find('a[href="#MatchingCriteria"]').parent('.pf-source').removeClass('active');
        container.find('a[href="#loggedInUser"]').parent('.pf-source').addClass('active');
        container.find('.pf-header-loggedinuser').data('prefillsource', enumFSPFsource.loggedInUser);
    }else if(pf_value==enumFSPFsource.RecordList){
        container.find('a[href="#RecordList"]').parent('.pf-source').addClass('active');
        container.find('a[href="#MatchingCriteria"]').parent('.pf-source').removeClass('active');
        container.find('a[href="#loggedInUser"]').parent('.pf-source').removeClass('active');
        container.find('.pf-header-loggedinuser').data('prefillsource', enumFSPFsource.RecordList);
        getRecordList_RadioElement_click(container);
    }
}

function prefillThisObjectCheck() {
    var bThereIsDriverEnabled = isThereAPrefillDriverEnable();
    //If there is no PrefillDriver, we will disable all Prefill in all the objects
    if (!bThereIsDriverEnabled) {
        $('.ck-header-prefillthisobject').prop('checked', false);
    }

    addRemoveObjectContainerBlock();
}

function isThereAPrefillDriverEnable() {
    var bThereIsDriverEnabled = false;
    $('.pf-container-listobject .pf-object-container').each(function () {
        var vFSObjectType_Check = $(this).find('.pf-object-order-name').data('objectfstype');

        var vCheckBox_PrefillThisObject = $(this).find('.ck-header-prefillthisobject');
        if (vCheckBox_PrefillThisObject != null && vCheckBox_PrefillThisObject.prop('checked')) {
            //If this object is enabled, and it is primary, this is the driver
            if (vFSObjectType_Check == enumFSObjectType.Primary) {
                bThereIsDriverEnabled = true;
                return;//exit loop
            } else {

                //If this object is enabled, and it is not primary, but we have loggedin-user checked, this is the driver
                var vPFObjectContainer_Check = $(this).find('.ck-header-loggedinuser');
                if (vPFObjectContainer_Check != null && vPFObjectContainer_Check.prop('checked')) {
                    bThereIsDriverEnabled = true;
                    return;//exit loop
                }
            }
        }
    });
    return bThereIsDriverEnabled;
}

function addRemoveObjectContainerBlock() {
    //1. Check All the Object container and block those which are unchecked Prefill This Object
    //1.1. Check if we have any Driver with Prefill Enable
    //1.1.2. If we have a Driver, block the container but don't block the whole container
    //1.1.3. If we don't have a Driver, block complete all the container, but the Primary don't block the whole container

    //Remove all block
    $('.pf-container-listobject .pf-object-container .pf-block-object-container').remove();
    $('.pf-note-disabledallobjects').remove();

    var bThereIsDriverEnabled = isThereAPrefillDriverEnable();

    $('.pf-container-listobject .pf-object-container').each(function () {
        var vFSObjectType_Check = $(this).find('.pf-object-order-name').data('objectfstype');
        //If this object is disabled the Prefill, we will block this object
        var vCheckBox_PrefillThisObject = $(this).find('.ck-header-prefillthisobject');
        if (vCheckBox_PrefillThisObject != null && !vCheckBox_PrefillThisObject.prop('checked')) {

            //If this object is Primary, we will block partial
            if (vFSObjectType_Check == enumFSObjectType.Primary) {
                addBlockPlaceHolder($(this), false);

                //If there are no driver and we are adding a block container, we will show a note
                if (!bThereIsDriverEnabled) {
                    var vNote = $('<p />', { 'class': 'small-text pf-note-disabledallobjects' });
                    vNote.append('Note: You are not currently prefilling any objects! You can disable prefill by clicking on the toggle above.');
                    $('.pf-container-header').append(vNote);
                }


            } else {
                //If there is a driver we disable partial
                if (bThereIsDriverEnabled) {
                    addBlockPlaceHolder($(this), false);
                } else {
                    //If there is no Driver, we disable the whole object
                    addBlockPlaceHolder($(this), true);
                }
            }
        }

    });
}

function addBlockPlaceHolder(pPFContainer, pBlockWholeContainer) {
    console.log('[addBlockPlaceHolder] Starts...');

    var vPFContent = pPFContainer.find('.pf-content');
    var vBlock = $('<div />', { 'class': 'pf-block-object-container' });
    vBlock.css('height', vPFContent.innerHeight() + 16);
    vBlock.css('width', vPFContent.innerWidth());
    vPFContent.prepend(vBlock);

    var vPFObjectOrderName = pPFContainer.find('.pf-object-order-name');
    var vBlockOrderName = $('<div />', { 'class': 'pf-block-object-container' });
    vBlockOrderName.css('height', (vPFObjectOrderName.innerHeight() / 2) + 1);
    vBlockOrderName.css('width', vPFObjectOrderName.innerWidth());
    vPFObjectOrderName.prepend(vBlockOrderName);

    var vPFHeader = pPFContainer.find('.pf-header');
    var vBlockHeader = $('<div />', { 'class': 'pf-block-object-container' });
    vBlockHeader.css('height', vPFHeader.innerHeight());
    if (pBlockWholeContainer) {
        vBlockHeader.css('width', vPFHeader.innerWidth());
    } else {
        vBlockHeader.css('width', '73%');
    }

    vPFHeader.prepend(vBlockHeader);
}

function addEmptyFilterRowInTheObjectContainer(pPFObjectContainer) {

    var vSFObjectName = pPFObjectContainer.find('.pf-object-order-name').data('sfobjectname');
    var vObjectFormIdentifier = pPFObjectContainer.find('.pf-object-order-name').data('objectformidentifier');

    var vPFFilters = pPFObjectContainer.find('.pf-filters');
    vPFFilters.find('.pf-filter-row').remove();

    var vPFFilterRowNew = addEmptyStaticRow(vSFObjectName, vObjectFormIdentifier, enumFSAddedBy.Auto);
    vPFFilters.append(vPFFilterRowNew);
    $(vPFFilters).find('select').select2();
}

var vChangeDetected = false;
function unLoadWindow() {
    if (vChangeDetected) {
        return 'Show message!'//This message doesn't show for the user, it shows a default message from the browser
    } else {
        return;
    }
}
window.onbeforeunload = unLoadWindow;

function changeMatchingValueFieldType(pThis) {
    console.log('[changeMatchingValueFieldType] Starts...');

    var vPFFilterRow = $(pThis).parent().parent();
    var vPFFilterValue = vPFFilterRow.find('.pf-filter-value');
    var vPFFilterValueBoxOld = vPFFilterValue.find('.pf-filter-value-box');
    var vOptionSelected = $(pThis).find(':selected');
    var vValueSelected = vOptionSelected.prop('value');
    var vSFFieldType = vOptionSelected.data("sftype");
    var vReferenceTo = vOptionSelected.data("referenceto");

    var vObjectName = vPFFilterValueBoxOld.data('sfobjectname');
    var vObjectFormIdentifier = vPFFilterValueBoxOld.data('objectformidentifier');
    var vPFFilterValueBox = null;

    var vCondition = new WhereCondition();
    vCondition.op = 'AND';
    vCondition.operand1 = vValueSelected;
    vCondition.operand2.otext = '';
    vCondition.fieldType = vSFFieldType;

    if (vSFFieldType == 'REFERENCE' && vReferenceTo == enumSFObjectAPIName.Contact) {
        vCondition.operand2.otype = enumMatchingFieldType.Static_Token_Contact;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    } else if (vSFFieldType == 'ID' && vValueSelected == 'Id' && vObjectName == enumSFObjectAPIName.Contact) {
        vCondition.operand2.otype = enumMatchingFieldType.Static_Token_Contact;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    } else if (vSFFieldType == 'EMAIL') {
        vCondition.operand2.otype = enumMatchingFieldType.Static_Token_Email;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    } else if (vSFFieldType == 'REFERENCE' && (vReferenceTo == enumSFObjectAPIName.User || vReferenceTo == 'Group')) {
        vCondition.operand2.otype = enumMatchingFieldType.Static_Token_User;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    } else if (vSFFieldType == 'REFERENCE') {
        vCondition.operand2.otype = enumMatchingFieldType.Static_Lookup;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    } else if (vSFFieldType == 'BOOLEAN') {
        vCondition.operand2.otype = enumMatchingFieldType.Boolean;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    } else if (vSFFieldType == 'DATE') {
        vCondition.operand2.otype = enumMatchingFieldType.Date;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    } else if (vSFFieldType == 'DATETIME') {
        vCondition.operand2.otype = enumMatchingFieldType.DateTime;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    } else if (vSFFieldType == 'PICKLIST') {
        vCondition.operand2.otype = enumMatchingFieldType.PickList;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);

    } else {
        vCondition.operand2.otype = enumMatchingFieldType.Static;
        vPFFilterValueBox = getMatchingValues(vCondition, vObjectFormIdentifier, vObjectName);
    }

    //Add new Input
    vPFFilterValue.prepend(vPFFilterValueBox);
    vPFFilterValue.find('select').select2();
    //Remove old Input there
    vPFFilterValueBoxOld.remove();

}

function showMessage(pConfirmationButtonName, pMessage, pYesFunction) {

    var vMessageBody = "<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'>";
    vMessageBody += "<div class='primary'>" + pMessage + "</div>";
    vMessageBody += "</div>";

    $("#dialog-confirm").html(vMessageBody);
    // Define the Dialog and its properties.
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: "Close",
        height: "auto",
        width: 413,
        position: { my: "center", at: "center" },
        buttons: {
            "Yes": {
                click: function () {
                    $(this).dialog('close');

                    pYesFunction();
                },
                text: pConfirmationButtonName,
                'class': 'vabutton1'
            },
            "No": {
                click: function () {
                    $(this).dialog('close');
                    return false;
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

var originalDateFormat = window.UserContext['dateTimeFormat'];

function getSTDTimeZoneOffset(dtVal) {
    var jan = new Date(dtVal.getFullYear(), 0, 1);
    var jul = new Date(dtVal.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

function isDateDST(dateVal) {
    return dateVal.getTimezoneOffset() < getSTDTimeZoneOffset(dateVal);
}

function setFormattedDateOrDateTime(pValue, pIsDateTime) {
    console.log('[setFormattedDateOrDateTime] Starts...pValue[' + pValue + ']');
    var vDateReturn = '';
    try {
        if (pValue == null || pValue == '') {
            return vDateReturn;
        }
        var dtVal = new Date(pValue);
        var localDateInstance = new Date(Date.UTC(dtVal.getUTCFullYear(), dtVal.getUTCMonth(), dtVal.getUTCDate(), dtVal.getUTCHours(), dtVal.getUTCMinutes(), dtVal.getUTCSeconds(), dtVal.getUTCMilliseconds()));

        var tzDifference = parseFloat(new Date().getTimezoneOffset());
        // checking if it is not DaylightSavingTime if so add 60 minutes in timeZoneDifference
        if (!isDateDST(dtVal)) {
            tzDifference = parseFloat(tzDifference) + 60;
        }
        localDateInstance = new Date(Date.UTC(dtVal.getUTCFullYear(), dtVal.getUTCMonth(), dtVal.getUTCDate(), dtVal.getUTCHours(), dtVal.getUTCMinutes() + tzDifference, dtVal.getUTCSeconds(), dtVal.getUTCMilliseconds()));

        if (!pIsDateTime) {
            vDateReturn = $.datepicker.formatDate('mm/dd/yy', localDateInstance);
        } else {
            var formattedDateTime = $.datepicker.formatDate('mm/dd/yy', localDateInstance);
            formattedDateTime = formattedDateTime + ' ' + getTwoDigits(dtVal.getHours()) + ':' + getTwoDigits(dtVal.getMinutes());
            vDateReturn = formattedDateTime;
        }

    } catch (err) {
        console.log('Date time formatting error.' + err.message);
    }

    console.log('vDateReturn[' + vDateReturn + ']');
    return vDateReturn;
}

function getTwoDigits(pDigit) {
    if (parseInt(pDigit) < 10) {
        return '0' + pDigit;
    }
    return pDigit;
}
