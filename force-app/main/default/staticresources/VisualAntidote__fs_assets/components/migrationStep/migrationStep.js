'use strict';

class OrgAvailableDTO {
    constructor() {
        this.OrgId = 0;
        this.OrgName = '';
        this.IsSandbox = false;
        this.LoginDomain = '';
    }
}

class SalesforceAuthorizationDTO {
    constructor() {
        this.Username = '';
        this.Password = '';
        this.OrgType = '';
        this.OrgId = '';
        this.LoginDomain = '';
    }
}

class MigrationAccessDTO {
    constructor() {
        this.AccessToken = '';
        this.InstanceURL = '';
        this.OrgId = '';
    }
}

class FormMigrationDTO {
    constructor() {
        this.FormId = '';
        this.FormName = '';
        this.Type = '';
        this.FormIdToUpdate = '';
        this.isFormStyleEnabledToMigrate = false;
    }
}

class DestinationFormDTO {
    constructor() {
        this.FormId = '';
        this.FormName = '';
        this.Type = '';
    }
}

var rootElement = null;
var developmentEnviroment = 'localhost';
var migrationAccess = null;
var listFormIdsFromURL = '';
var formMenu_URL = '';
var manageSandbox_URL = '';
var learnMoreSandbox_URL = 'https://sfapphelp.formstack.com/hc/en-us/articles/360025602871';
var isProductionOrg = false;

var label_btnMigration_MigrateForms =
    '<span class="icon-square-arrowup">&nbsp;</span><span class="btn-text">Migrate Forms</span>';
var label_btnMigration_Migrating =
    '<span class="icon-square-arrowup">&nbsp;</span><span class="btn-text">Migrating...</span>';
var label_btnMigration_Done =
    '<span class="icon-square-arrowup">&nbsp;</span><span class="btn-text">Done</span>';
var label_btnValidate_ValidateOrg = '<span class="btn-text" >Validate Org</span>';
var label_btnValidate_Validating = '<span class="btn-text" >Validating...</span>';
var label_btnManageSandbox_ManageSandbox = 'Manage Sandbox';

function load() {
    console.log('Getting root element');
    rootElement = $('.fs_migrationstep_cmp');

    callAPI_getListOfOrgsToMigrate();
    callAPI_getListForms();

    setDefaultValues();
    addEvents();
}

function setDefaultValues() {
    hideValidationSucessfullBadge();
    showStep(1);
    hideStep(2);
    disableButton(getElement('.btnmigrateform'), label_btnMigration_MigrateForms);
    addFormOptionSection_RadioElement();
}

function addEvents() {
    getElement('.btnvalidateorg').click(function() {
        validateOrgClick();
    });

    getElement('.migrationstep-title').click(function() {
        var migrationStepComponent = $(this)
            .parent()
            .parent()
            .parent();

        var migrationStepBody = migrationStepComponent.find('.migrationstep-body');

        var vArrow = migrationStepComponent.find('.icon-arrow');

        if (migrationStepBody.css('display') == 'none') {
            migrationStepBody.show();
            collapse(vArrow);
        } else {
            migrationStepBody.hide();
            expand(vArrow);
        }
    });

    getElement('#ddllistOrgAvailableToMigrate').change(function() {
        destinationOrgDropdownChange();
    });

    getElement('.btnmigrateform').click(function() {
        console.log('[btnmigrateform] Click...');
        migrateClick();
    });
}

function destinationOrgDropdownChange() {
    var selectedOption = getElement('#ddllistOrgAvailableToMigrate option:selected').val();

    if (selectedOption == '') {
        disableCredentialsField();
        disableButton(getElement('.btnvalidateorg'), label_btnValidate_ValidateOrg);
    } else {
        enableCredentialsField();
        enableButton(getElement('.btnvalidateorg'), label_btnValidate_ValidateOrg);
    }
}

function validateOrgClick() {
    disableButton(getElement('.btnvalidateorg'), label_btnValidate_Validating);
    validateOrg();
}

function showStep(pStepNumber) {
    var vStep = getElement('.step' + pStepNumber);
    vStep.find('.migrationstep-body').show();
    var vArrow = vStep.find('.icon-arrow');
    collapse(vArrow);
}

function hideStep(pStepNumber) {
    var vStep = getElement('.step' + pStepNumber);
    vStep.find('.migrationstep-body').hide();
    var vArrow = vStep.find('.icon-arrow');
    expand(vArrow);
}

function validateLoginFields(pUsernameField, pPasswordField) {
    disableRequiredInput(pUsernameField);
    disableRequiredInput(pPasswordField);
    var bIsValid = true;

    if (pPasswordField.val() == '') {
        enableRequiredInput(pPasswordField);
        bIsValid = false;
    }

    if (pUsernameField.val() == '') {
        enableRequiredInput(pUsernameField);
        bIsValid = false;
    }

    return bIsValid;
}

function validateOrg() {
    console.log('[validateOrg] Starts...');
    hidePillMessage();

    var username = getElement('#txtUsername');
    var password = getElement('#txtPassword');
    var securitytokenField = getElement('#txtSecuritytoken');
    var targetOrg = getElement('#ddllistOrgAvailableToMigrate option:selected');

    if (!validateLoginFields(username, password)) {
        enableButton(getElement('.btnvalidateorg'), label_btnValidate_ValidateOrg);
        return;
    }

    var sfAuthorization = new SalesforceAuthorizationDTO();
    sfAuthorization.Username = username.val();
    sfAuthorization.Password = password.val() + securitytokenField.val();
    sfAuthorization.OrgType =
        targetOrg.attr('data-is-sandbox') == 'true' ? 'Sandbox' : 'Production';
    sfAuthorization.OrgId = getElement('#ddllistOrgAvailableToMigrate option:selected')[0].value;
    var loginDomainUrl = targetOrg.attr('data-login-domain-url');
    sfAuthorization.LoginDomain = (loginDomainUrl!='undefined')?loginDomainUrl:'';
    console.log('[validateOrg] Starts...');

    callAPI_validate(sfAuthorization);
}

function validateOrg_AfterAPICall_OnError(pEvent) {
    enableButton(getElement('.btnvalidateorg'), label_btnValidate_ValidateOrg);
    generalErrorHandling(pEvent);
}

function validateOrg_AfterAPICall(sfMigrationAccess) {
    enableButton(getElement('.btnvalidateorg'), label_btnValidate_ValidateOrg);
    migrationAccess = sfMigrationAccess;

    showValidationSucessfullBadge();
    enableButton(getElement('.btnmigrateform'), label_btnMigration_MigrateForms);
    showStep(2);
    hideStep(1);

    disableCredentialsField();
    disableDestinationDropdownField();
    getListOfDestinationForms();
}

function showValidationSucessfullBadge() {
    getElement('.btnvalidateorg').hide();
    getElement('.validation-successfull').show();
}

function hideValidationSucessfullBadge() {
    getElement('.btnvalidateorg').show();
    getElement('.validation-successfull').hide();
}

function callAPI_validate(pSalesforceAuthorization) {
    if (isLocalhost()) {
        validateOrg_AfterAPICall(localhost_validateLogin(pSalesforceAuthorization));
    } else {
        var pRemoteEndpoint = REMOTE_ACTIONS['validateLogin'];
        Visualforce.remoting.Manager.invokeAction(
            pRemoteEndpoint,
            pSalesforceAuthorization,
            function(result, event) {
                console.log('[callAPI_validate] Result...');
                console.log(result);
                console.log(event);
                if (event.status) {
                    validateOrg_AfterAPICall(result);
                } else {
                    validateOrg_AfterAPICall_OnError(event);
                }
            },
            {
                escape: true
            }
        );
    }
}

function callAPI_getListOfOrgsToMigrate() {
    console.log('loadDropdown');
    if (isLocalhost()) {
        fillDropdown_AfterAPICall(localhost_getOrgsAvailable());
    } else {
        var pRemoteEndpoint = REMOTE_ACTIONS['getListOfOrgsToMigrate'];
        callSalesforce(pRemoteEndpoint, fillDropdown_AfterAPICall);
    }
}

function fillDropdown_AfterAPICall(pListOrgAvailable) {
    var vDropdown = getElement('#ddllistOrgAvailableToMigrate');

    let option = $('<option />', {
        value: '',
        text: '-- Select Destination Org --'
    });

    vDropdown.append(option);

    // No Orgs to Migrate we will show a message
    if (pListOrgAvailable.length == 0) {
        showNoOrgAvailableMessage();
        return;
    }

    for (var iIndexOrg = 0; iIndexOrg < pListOrgAvailable.length; iIndexOrg++) {
        var orgAvailable = pListOrgAvailable[iIndexOrg];
        console.log(orgAvailable);
        let option = $('<option />', {
            value: orgAvailable.OrgId,
            text: orgAvailable.OrgName + ' (' + orgAvailable.OrgId + ')',
            'data-is-sandbox': orgAvailable.IsSandbox,
            'data-login-domain-url': orgAvailable.LoginDomain
        });

        vDropdown.append(option);
    }

    try {
        $(vDropdown).select2();
    } catch (error) {
        //nothing to display, this is for localhost, select2 for some reason doesn't work on localhost
    }

    // run logic on Designation Org Dropdown
    destinationOrgDropdownChange();
}

function loadSelectedForm_AfterAPICall(pListForms) {
    
    
    for (var vIndexForm = 0; vIndexForm < pListForms.length; vIndexForm++) {
        var vForm = pListForms[vIndexForm];

        var vStep2Body = getElement('.step2 .migrationstep-body');
        var vFormName = vStep2Body.find('.form-name');
        var vFormId = vStep2Body.find('.form-id');

        vFormName.text(vForm.FormName);
        vFormId.val(vForm.FormId);
    }
}

function callAPI_getListForms() {
    if (isLocalhost()) {
        loadSelectedForm_AfterAPICall(localhost_getFormSelected());
    } else {
        var pRemoteEndpoint = REMOTE_ACTIONS['getListForms'];

        Visualforce.remoting.Manager.invokeAction(
            pRemoteEndpoint,
            listFormIdsFromURL,
            function(result, event) {
                console.log('[callAPI_getListForms] Result...');
                console.log(result);
                console.log(event);
                if (event.status) {
                    loadSelectedForm_AfterAPICall(result);
                } else {
                    generalErrorHandling(event);
                }
            },
            {
                escape: true
            }
        );
    }
}

function migrateForm_AfterAPICall_OnError(pEvent) {
    enableButton(getElement('.btnmigrateform'), label_btnMigration_MigrateForms);
    generalErrorHandling(pEvent);
}

function migrateForm_AfterAPICall(pResult) {
    console.log('[migrateForm_AfterAPICall] Start...');

    setTimeout(function() {
        disableButton(getElement('.btnmigrateform'), label_btnMigration_Done);
    }, 2000);

    setTimeout(function() {
        window.location.href = formMenu_URL;
    }, 4000);

}

function generalErrorHandling(pEvent) {
    var errorMessage = trimExceptionMessage(pEvent.message);
    showPillMessage_Error(errorMessage);
}

//Cleans up error message if such is returned with location info. Example: line48 column1: Invalid Password
function trimExceptionMessage(pMessage){
    var errorMessage = pMessage;
    if(errorMessage.length>0){
        errorMessage = errorMessage.substring(errorMessage.indexOf(':')+1, errorMessage.length);
    }
    console.log(errorMessage);
    return errorMessage;
}

function migrateClick() {
    hidePillMessage();
    var vListForms = [];
    var vStep2Body = getElement('.step2 .migrationstep-body');
    var vFormName = vStep2Body.find('.form-name');
    var vFormId = vStep2Body.find('.form-id');
    var formMigrationOption = getElement('.form-option-section > .active').hasClass('option-update') ? 'Update' : 'Insert';
    var checkboxValue = getElement('.fs-checkbox');
    var isFormStyleEnabledToMigrate = checkboxValue[0].checked;
    
    disableButton(getElement('.btnmigrateform'), label_btnMigration_Migrating);
    $(getElement('.btnmigrateform')).blur();

    let formMigration = new FormMigrationDTO();
    formMigration.FormName = vFormName.text();
    formMigration.FormId = vFormId.val();
    formMigration.isFormStyleEnabledToMigrate = isFormStyleEnabledToMigrate;
        if (formMigrationOption == 'Update') {
            formMigration.Type = 'Update';
            var chosenForm = getElement('#listOfFormsAvailableToMigrateInto option:selected').val();
            formMigration.FormIdToUpdate = chosenForm;
        }else if (formMigrationOption == 'Insert') {
            formMigration.Type = 'Insert';
            formMigration.FormIdToUpdate = '';

        }

    vListForms.push(formMigration);

    callAPI_migrate(vListForms, migrationAccess);
}

function callAPI_migrate(pListFormsToMigrate, pMigrationAccessDTO) {
    console.log('[callAPI_migrate] Starts...');
    console.log(pListFormsToMigrate);

    if (isLocalhost()) {
        migrateForm_AfterAPICall(pListFormsToMigrate);
    } else {
        // Apex Controller
        var pRemoteEndpoint = REMOTE_ACTIONS['migrate'];
        Visualforce.remoting.Manager.invokeAction(
            pRemoteEndpoint,
            pListFormsToMigrate,
            pMigrationAccessDTO,
            function(result, event) {
                console.log('[callAPI_migrate] Result...');
                console.log(result);
                console.log(event);
                if (event.status) {
                    migrateForm_AfterAPICall(result);
                } else {
                    migrateForm_AfterAPICall_OnError(event);
                }
            },
            {
                escape: true
            }
        );
    }
}

function collapse(pElement) {
    pElement.removeClass('icon-arrow--expand');
    pElement.addClass('icon-arrow--collapse');
}

function expand(pElement) {
    pElement.removeClass('icon-arrow--collapse');
    pElement.addClass('icon-arrow--expand');
}

function manageSandboxClick() {
    window.location.href = manageSandbox_URL;
}

function getTextBodyForSandboxNoOrgAvailable() {
    var vTextBody =
        '<span>Looks like this sandbox is not connected to a production org! ' +
        'To be able to migrate forms from this sandbox, navigate to your ' +
        'production org and add this sandbox as a managed org on ' +
        'the Sandbox Management page in Admin Settings.</span>';

    var vLearnMore = anchor('a--blue', 'Learn More', learnMoreSandbox_URL);

    var vDivMessage = div('no-org-available-text');
    vDivMessage.append(vTextBody);
    vDivMessage.append(vLearnMore);

    vDivMessage.append(vDivMessage);

    return vDivMessage;
}

function getTextBodyForProductionNoOrgAvailable() {
    var vTextBody =
        "<span>Looks like you haven't configured any managed sandboxes! " +
        'To be able to migrate forms between orgs, these orgs must be ' +
        'configured as managed sandboxes on the Sandbox Management page in Admin Settings.</span>';

    var vDivMessage = div('no-org-available-text');
    vDivMessage.append(vTextBody);

    var btnManageSandbox = button(
        'btnManageSandbox vabutton3',
        label_btnManageSandbox_ManageSandbox
    );
    btnManageSandbox.click(function() {
        manageSandboxClick();
    });
    vDivMessage.append(btnManageSandbox);

    return vDivMessage;
}

function showNoOrgAvailableMessage() {
    var vStep1 = $('.migrationstep.step1').find('.migrationstep-body');
    vStep1.html('');
    var vColumn100 = div('column100');
    vColumn100.append(getSection(isProductionOrg));
    vStep1.append(vColumn100);
    disableButton(getElement('.btnvalidateorg'), label_btnValidate_ValidateOrg);
}

function getSection(pIsProductionMessage) {
    var vNoOrgAvailableBody = div('no-org-available-body');
    var vSpanImage = span('icon-square-add-more');
    var vImageSection = div('image-section');
    vImageSection.append(vSpanImage);
    vNoOrgAvailableBody.append(vImageSection);

    var vTextSection = div('no-org-available-text-section');
    var vTitle = span('no-org-available-title');
    vTitle.append('No Orgs Configured for Migration');
    vTextSection.append(vTitle);

    var vTextContent = '';
    if (pIsProductionMessage) {
        vTextContent = getTextBodyForProductionNoOrgAvailable();
    } else {
        vTextContent = getTextBodyForSandboxNoOrgAvailable();
    }

    vTextSection.append(vTextContent);
    vNoOrgAvailableBody.append(vTextSection);

    return vNoOrgAvailableBody;
}

function button(pClass, pText) {
    var buttonElement = $('<button />', { class: pClass, title: pText, type: 'button' });
    var buttonText = span('btn-text', pText);
    buttonElement.append(buttonText);
    return buttonElement;
}

function anchor(pClass, pText, pHREF) {
    var vAnchor = $('<a />', { class: pClass, href: pHREF, target: '_blank' });
    vAnchor.append(pText);
    return vAnchor;
}

function span(pClass, pText) {
    var spanElement = $('<span />', { class: pClass });
    spanElement.append(pText);
    return spanElement;
}

function div(pClass) {
    return $('<div />', { class: pClass });
}

/** Helper Classes **/

function enableRequiredInput(pElement) {
    pElement.focus();
    pElement.addClass('required');
}

function disableRequiredInput(pElement) {
    pElement.removeClass('required');
}

function disableInput(pElement) {
    pElement.prop('disabled', true);
    pElement.attr('title', 'disabled');
    pElement.addClass('disabled');
}

function enableInput(pElement) {
    pElement.prop('disabled', false);
    pElement.attr('title', '');
    pElement.removeClass('disabled');
}

function disableButton(pElement, pMessage) {
    pElement.html(pMessage);
    pElement.addClass('disabled');
}

function enableButton(pElement, pMessage) {
    pElement.html(pMessage);
    pElement.removeClass('disabled');
}

function isLocalhost() {
    return developmentEnviroment == 'localhost';
}

function getElement(pFindFilter) {
    return $(rootElement).find(pFindFilter);
}

function callSalesforce(pRemoteMethodURL, pSuccessCallback, pFailureCallback) {
    console.log('[callSalesforce] Starts...');
    Visualforce.remoting.Manager.invokeAction(
        pRemoteMethodURL,
        function(result, event) {
            console.log('[callSalesforce] Result...');
            console.log(result);
            console.log(event);

            if (event.status) {
                pSuccessCallback(result, event);
            } else {
                generalErrorHandling(event);
            }
        },
        {
            escape: true
        }
    );
}
//disable Username and Password Field
function disableCredentialsField(){
    var usernameField = getElement('#txtUsername');
    var passwordField = getElement('#txtPassword');
    var securitytokenField = getElement('#txtSecuritytoken');
    
    disableInput(usernameField);
    disableInput(passwordField);
    disableInput(securitytokenField);
}
//enable Username and Password Field
function enableCredentialsField() {
    var usernameField = getElement('#txtUsername');
    var passwordField = getElement('#txtPassword');
    var securitytokenField = getElement('#txtSecuritytoken');

    enableInput(usernameField);
    enableInput(passwordField);
    enableInput(securitytokenField);
}

//disable Destination Org Dropdown
function disableDestinationDropdownField(){
    var destinationDropdownField = getElement('#ddllistOrgAvailableToMigrate');
    disableInput(destinationDropdownField);
}

//get list of forms in selected org available to migrate into
function getListOfDestinationForms(){
    console.log('loadFormsDropdown');
    callAPI_getListOfDestinationForms(migrationAccess);
}

function callAPI_getListOfDestinationForms(pMigrationAccessDTO) {
    console.log('[callAPI_getListOfDestinationForms] Starts...');
    if (isLocalhost()) {
        fillFormDropdown_AfterAPICall(localhost_getFormsAvailable());
    } else {
        // Apex Controller
        var pRemoteEndpoint = REMOTE_ACTIONS['getListOfDestinationForms'];
        Visualforce.remoting.Manager.invokeAction(
            pRemoteEndpoint,
            pMigrationAccessDTO,
            function(result, event) {
                console.log('[callAPI_getListOfDestinationForms] Result...');
                console.log(result);
                console.log(event);
                if (event.status) {
                    fillFormDropdown_AfterAPICall(result);
                } else {
                    //it is fine to use the same function
                    migrateForm_AfterAPICall_OnError(event); 
                }
            },
            {
                escape: true
            }
        );
    }
}

function fillFormDropdown_AfterAPICall(pListFormsAvailable) {
    var vFormDropdown = getElement('#listOfFormsAvailableToMigrateInto');

    let option = $('<option />', {
        value: '',
        text: '-- Select Destination Form --'
    }); //if no options available will show empty dropdown

    vFormDropdown.append(option);

    for (var iIndexOrg = 0; iIndexOrg < pListFormsAvailable.length; iIndexOrg++) {
        var formAvailable = pListFormsAvailable[iIndexOrg];
        console.log(formAvailable);
        let option = $('<option  />', {
            value: formAvailable.FormId,
            text: formAvailable.FormName
        });

        vFormDropdown.append(option);
    }

    try {
        $(vFormDropdown).select2();
    } catch (error) {
        //nothing to display, this is for localhost, select2 doesn't work on localhost
    }
  
}

function addFormOptionSection_RadioElement() {
    var formOptionSection = getElement('.form-option-section');
    
    addFormOptionInsert_RadioElement(formOptionSection);
    addFormOptionUpdate_RadioElement(formOptionSection);
}

function addFormOptionInsert_RadioElement(formOptionSection) {
    var vPFRecordList;
    vPFRecordList = $('<li />', {
        'class': 'option-insert active'
    });

    var vSpan = $('<span />', {
        'class': 'ff-radio-css'
    });
    var vLink = $('<a />', {
        'href': '#insert',
        'data-toggle': 'tab'
    });
    $(vLink).click(function () {
        radioButtonInsertClick(this);
    });
    vLink.append(vSpan);
    vLink.append('Create a new form');
    vPFRecordList.append(vLink);
    formOptionSection.append(vPFRecordList);
    
}

function radioButtonInsertClick(pThis){
    var insertRadioButton = getElement(pThis);
    insertRadioButton.parent().addClass('active');
    var updateRadioButton = insertRadioButton.parent().parent().find('.option-update');
    updateRadioButton.removeClass('active');
    var formDropDown = getElement('.dropdownListOfFormsAvailable');
    formDropDown.addClass('visibility-hidden');
}

function addFormOptionUpdate_RadioElement(formOptionSection) {
    var vPFRecordList;
    vPFRecordList = $('<li />', {
        'class': 'option-update'
    });
    var vSpan = $('<span />', {
        'class': 'ff-radio-css'
    });
    var vLink = $('<a />', {
        'href': '#update',
        'data-toggle': 'tab'
    });
    $(vLink).click(function () {
        radioButtonUpdateClick(this);
    });
    vLink.append(vSpan);
    vLink.append('Update an existing form');
    vPFRecordList.append(vLink);
    formOptionSection.append(vPFRecordList);
    
}

function radioButtonUpdateClick(pThis){
    var updateRadioButton = getElement(pThis);
    updateRadioButton.parent().addClass('active');
    var insertRadioButton = updateRadioButton.parent().parent().find('.option-insert');
    insertRadioButton.removeClass('active');
    
    var formDropDown = getElement('.dropdownListOfFormsAvailable');
    formDropDown.removeClass('visibility-hidden');
}