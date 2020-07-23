
    var elementProperty = ['SandboxName', 'AppInstalled', 'Icon', 'RecordId'];
    var recordIdKey = { 'id': 'Id', 'key': 'RecordId' };
    var listRecordIdKey = { 'id': 'SandboxOrganization', 'key': 'RecordId' };
    var recordNameKey = {'id':'SandboxName','key':'SandboxName'};
    var  searchBy  = { 'id':'SandboxOrganization', 'key':'SandboxName'}
    var showAddPanel = false;
$(function () {
    initializeSandboxPageComponents(false);
});

function initializeSandboxPageComponents(afterAddRemove) {
    console.log('[initializeSandboxPageComponents] Start...');

    var remoteUrlForMethod = REMOTE_ACTIONS["initializeSandboxPage"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            if (event.status) {
                console.log(result);
                console.log(event);

                var listSandboxOrg = result.listSandboxOrgDto;
                var listSandboxesAvailable = result.listSandboxesAvailableDto.records;
                var assignedSandbox = result.assignedSandbox; // number of sandbox seat are used 
                var allocatedSandbox = result.allocatedSandbox; // number of sandboxSeat in FMA
                var availableSandbox = result.availableSandbox; // number of sandbox org have
                var rebuild = true;
                
                var gridHeaders = [{
                    text: "Managed Sandboxes",
                    value: allocatedSandbox 
                }, {
                    text: "Unassigned",
                    value: assignedSandbox 
                }, {
                    text: "available sandbox",
                    value: '0' //unused value
                }];

                if(afterAddRemove){
                    FsJSGrid.init('FSGrid-sandbox','You don’t have any Sandboxes added.', rebuild, gridHeaders);
                }else{
                    rebuild = false;
                    FsJSGrid.init('FSGrid-sandbox','You don’t have any Sandboxes added.', rebuild, gridHeaders);
                }

                FsJSGrid.setData(listSandboxOrg, recordIdKey, elementProperty);
                FsJSGrid.setCounter(gridHeaders);
                FsJSGrid.setAutocomplete(listSandboxesAvailable, searchBy , listRecordIdKey);

            } else {
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        }, {
            escape: true
        }
    );

}

function getListOfOrgs() {
    console.log('[getListOfOrgs] Start...');

    var remoteUrlForMethod = REMOTE_ACTIONS["GetListOfOrgs"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            if (event.status) {
                console.log(result);
                console.log(event);

                FsJSGrid.setData(result, recordIdKey,elementProperty);

            } else {
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        }, {
            escape: true
        }
    );

}

var FsJSGridAddRecordEventListener = function (inputValueText,inputValueId) {
    console.log('[getListOfOrgs] Start...');

    // get text search and id
    var remoteUrlForMethod = REMOTE_ACTIONS["AddOrg"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod, inputValueText, inputValueId,
        function (result, event) {
            if (event.status && result.ResultText == '') {
                console.log(result);
                console.log(event);

                FsJSGrid.addRecord(result, recordIdKey, elementProperty);
                var callbackObject = {
                    "uiMessage": "Sandbox added successfully!"
                };
                resetSandboxCountResponse(callbackObject);
                initializeSandboxPageComponents(true);
            } else {
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        }, {
            escape: true
        }
    );

};

var FsJSGridRemoveRecordEventListener = function(inputElement) {
    if (inputElement != null) {
        var primaryMessage = "Are you sure you want to remove this Sandbox?"
        var secondaryMessage = "This Sandbox will no longer be able to access Formstack App.";
        var positiveObject = inputElement;
        //commonJSHelper method
        confirmDialogWithCallback(primaryMessage, secondaryMessage, positiveObject, removeSandbox, "", "");
    }
}

function resetSandboxCountResponse(responseObject) {

    var vMessageType = safeStringValue(responseObject["uiMessageType"], '')
    var vMessage1 = safeStringValue(responseObject["uiMessage"], '');
    var vMessage2 = safeStringValue(responseObject["uiMessage2"], '');
    var vButtonText = safeStringValue(responseObject["uiButtonText"], 'Close');

    if (vMessageType == enumMessageType.Alert) {
        popupMessage_ShowOneButton(enumFSPopupMessageType.Alert, vMessage1, vMessage2, vButtonText);
    } else if (vMessageType == enumMessageType.Info) {
        commonInfoMessage(vMessage1, vMessage2, vButtonText);
    } else {
        popupMessage_ShowOneButton(enumFSPopupMessageType.Success, vMessage1, vMessage2, vButtonText);
    }
    initializeSandboxPageComponents(true);
}

function removeSandbox(inputElement) {
    console.log('[removeSandbox] Start...');

    // get text search and id
    var parentRow = inputElement.parentNode.parentNode;
    var recordId = parentRow.attributes[recordIdKey.key].value;
    var remoteUrlForMethod = REMOTE_ACTIONS["RemoveOrg"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod, recordId,
        function (result, event) {
            if (event.status) {
                console.log(result);
                console.log(event);
                if (result.IsValid) {
                    FsJSGrid.removeRecord(inputElement);
                    var callbackObject = {
                        "uiMessage": "Sandbox successfully removed!"
                    };
                    resetSandboxCountResponse(callbackObject);
                } else {
                    //TODO : show Error message
                }
            } else {
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        }, {
            escape: true
        }
    );

}