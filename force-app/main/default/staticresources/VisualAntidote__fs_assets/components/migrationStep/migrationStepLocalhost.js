'use strict';

function localhost_getFormSelected() {
    var vListForms = [];

    var firstForm = new FormMigrationDTO();
    firstForm.FormId = '8888888';
    firstForm.FormName = 'My Form Contact';
    firstForm.Type = 'Insert';

    vListForms.push(firstForm);

    var secondForm = new FormMigrationDTO();
    secondForm.FormId = '9999999';
    secondForm.FormName = 'Lead My Second Form';
    secondForm.Type = 'Insert';

    vListForms.push(secondForm);

    return vListForms;
}

function localhost_validateLogin() {
    var sfMigrationAccess = new MigrationAccessDTO();
    sfMigrationAccess.AccessToken = 'AccessToken123';
    sfMigrationAccess.InstanceURL = 'wwww.salesforce.com';
    sfMigrationAccess.OrgId = '11111111111';
    return sfMigrationAccess;
}

function localhost_getOrgsAvailable() {
    let vListOrgsAvailable = [];

    let vProductionOrg = new OrgAvailableDTO();
    vProductionOrg.OrgId = '11111111111';
    vProductionOrg.OrgName = 'Production Org';
    vProductionOrg.IsSandbox = false;
    vProductionOrg.LoginDomain = '';
    vListOrgsAvailable.push(vProductionOrg);

    let vSandbox = new OrgAvailableDTO();
    vSandbox.OrgId = '2222222';
    vSandbox.OrgName = 'Sandbox Test';
    vSandbox.IsSandbox = true;
    vSandbox.LoginDomain = '';
    vListOrgsAvailable.push(vSandbox);

    return vListOrgsAvailable;
}


function localhost_getFormsAvailable() {
    let vListFormsAvailable = [];
    let vDestinationFormDTOContact = new DestinationFormDTO();
    vDestinationFormDTOContact.FormId = '11111111111';
    vDestinationFormDTOContact.FormName = 'Contact Form Test';
    vListFormsAvailable.push(vDestinationFormDTOContact);

    let vDestinationFormDTOAccount = new OrgAvailableDTO();
    vDestinationFormDTOAccount.FormId = '2222222';
    vDestinationFormDTOAccount.FormName = 'Account Form Test';
    vListFormsAvailable.push(vDestinationFormDTOAccount);

    return vListFormsAvailable;
}