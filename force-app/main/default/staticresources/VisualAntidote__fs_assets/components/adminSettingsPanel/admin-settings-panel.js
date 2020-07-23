//// TODO: Need Content Approval (Marketing/Ennis) for Authentication Failure notification messages
var userSearchText = '';
var userIds = [];
var orderByField = 'Name';
var orderByDirection = 'ASC';
var pageSize = 10;
var currentPage = 1;
var checkCurrentUserAuthorizationStatus = false;
var authStatusTimer;
var authStatusCheckCount = 0;
var authStatusCheckMaxCount = 10;
var ResubmitFailedSubmissionIsChecked = false;


var enumMessageType = {
    "Alert": "Alert",
    "Success": "Success",
    "Info": "Info",
    "Error": "Error"
};
Object.freeze(enumMessageType);

//Execute certain loading routines depending on what id is discovered:
var panelLoadInformation = {
    'userManagement':{
        divId:'user-management',
        loadPanel:function(){
            initializePageComponents();
            onFormPageLoad();
        }
    },
    'sandboxManagement':{
        divId:'sandbox-management',
        loadPanel:function(){
            initializeSandboxPageComponents(false);
        }
    },
    'integrationSettings':{
        divId:'integration-settings',
        loadPanel:function(){
            if(!document.getElementById('FSGrid-integration').getElementsByClassName('integrationTitle').length){
                //There's an equivelent call being done in AdminSettingsPanel for the initial load.
                //In the event there was a connection issue or no integrations available, the page refreshes automatically.
                fs.ISP.refreshIntegrations(function(resultElements){
                    var outputElement = document.getElementById('FSGrid-integration');
                    resultElements.forEach(function(element){outputElement.appendChild(element)});
                },true,false,engineEndpoint);
            }
        }
    }
}
// Object.freeze(panelLoadInformation);

var enumPackageTier = {
    "NativeCloud": "NativeCloud"
};
Object.freeze(enumPackageTier);

// setup controlPanel selector
function setPanelControl(element) {
        // clear all selector and hide all panels
        var panelSelector = document.querySelectorAll('.li-left-panel');

        console.log('[log] panel' + element);
        for (var i = 0; i < panelSelector.length; i++) {
            panelSelector[i].classList.remove('li-left-panel-selected');
        }

        // show panel
        element.classList.add('li-left-panel-selected');
        if (element.hasAttribute('PanelId')) {
            var PanelId = element.attributes['PanelId'].value;
            //controlPanel(PanelId);

            var domElements = {};
            for(var i in panelLoadInformation){
                domElements[i] = document.getElementById(panelLoadInformation[i].divId);
                domElements[i].style.display = 'none';
            }

            //Load the panel and display it:
            if(panelLoadInformation[PanelId]){
                domElements[PanelId].style.display = '';
                panelLoadInformation[PanelId].loadPanel();
            }
        }
    }

// First method to call on Page load
function initializePageComponents() {
    console.log('Set progressbar to ' + assignedUserLicensePercent);
    $('#assignedUserLicenseProgress').progressbar({ value: assignedUserLicensePercent });
    if ($("#inputTextUserNames").length > 0) {
        $("#inputTextUserNames").autocomplete({
            minLength: 3,
            appendTo: '#suggestionList',
            source: function (request, response) {
                getUsersByName(response, request.term);
            },
            focus: function (event, ui) {
                $('#inputTextUserNames').val(ui.item.Name);
                return false;
            },
            select: function (event, ui) {
                var datarecid = ui.item.Id;
                if (!isNullOrEmpty(datarecid)) {
                    $('#inputTextUserNames').val(ui.item.Name);
                    $('#inputTextUserNames').attr('data-userid', ui.item.Id);
                }
                console.log('Set ui.item.Id = ' + ui.item.Id);
                return false;
            },
        })

        if ($("#inputTextUserNames").data('ui-autocomplete') != null) {
            $("#inputTextUserNames").data('ui-autocomplete')._renderItem = function (ul, item) {
                var entry = '<a>' + item.Name + ' (' + item.Username + ')' + '</a>'
                return $('<li></li>')
                    .data('item.autocomplete', item)
                    .append(entry)
                    .appendTo(ul);
            };
        }

    }

    // remove Salesforce styling form apex:commandbutton
    $(".fsform .btn").removeClass('btn');
    checkTokenNotificationMessages(null);

    // initialize SharingSetting
    isSharingRuleEnable();
}

function onFormPageLoad() {
    // making sure current user has Formstacdk permission
    makeSureCurrentUserHasFormstackPermission();
    var remoteSitesInfoArray = ["FormstackMDAPIEndpoint", "FastFormsMDAPIEndpoint"];
    // FormstackMDAPIEndpoint--- current one
    // FastFormsMDAPIEndpoint--- legacy
    ///TODO: Use browser cookie or similar mechanism to not do these checks on subsequent page loads only in new session if make sense.
    checkFormRemoteSitesInfoForMDAPI(getFSNSVariable('SessionKey', ''), remoteSitesInfoArray, getCurrentPageUrl(), true, checkFormRemoteSitesInfoForMDAPICallback);
}

function checkTokenNotificationMessages(elem) {
    console.log('[checkTokenNotificationMessages] Starts...');

    var remoteUrlForMethod = REMOTE_ACTIONS["checkTokenNotifications"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            if (event.status) {
                console.log(result);
                console.log(event);
                if (result.IsValid) {
                    console.log('[FORM] [checkTokenNotificationMessages] no error token notifications');
                    if (elem != null) {
                        stopCheckingAuthStatus(elem, 'Updating...');
                        authStatusCheckCount = 0;
                        if (packageTier != enumPackageTier.NativeCloud) {
                            updateEngineToken(elem, "token");
                        } else {
                            $('#adminNotificationBox').removeClass('notification---error');
                            $('#adminNotificationBox').html('');
                            showTokenMessageAsBar(FSCONSTANTS.AdminSettings.AuthSuccess, true);
                        }
                    }
                } else {
                    if (elem == null) {
                        if ($('.announcement-box .announcement-box__header').length == 1) {
                            // if there is no license assigned do not show Error message and show Welcome message which directs user to assign license.
                            $('#adminNotificationBox').removeClass('notification---error');
                            $('#adminNotificationBox').html('');
                        } else {
                            var detailMessage = '';
                            var disableBtn = (isCurrentUserLicensed() && isCurrentUserAPrimaryUser()) ? false : true;
                            if (isCurrentUserLicensed() && !isCurrentUserAPrimaryUser() && !isPrimaryUserInactive()) {
                                detailMessage = $('<p/>').append(FSCONSTANTS.AdminSettings.AuthErrorNonPrimaryUser);
                            } else if (isCurrentUserLicensed() && !isPrimaryUserInactive()) {
                                let vMessage = $('<p/>').append(FSCONSTANTS.AdminSettings.AuthErrorPrimaryUser);

                                let vCheckBoxResubmit = $('<input/>', {
                                    'id': 'ckResubmitFailedSubmission',
                                    'type': 'checkbox',
                                    'class': 'fs-checkbox fs-checkbox-red',
                                });

                                let vLabelResubmit = $('<label />', {
                                    'for': 'ckResubmitFailedSubmission',
                                    'class': 'fs-txt-checkbox fs-checkbox-label'
                                });

                                vLabelResubmit.append(FSCONSTANTS.AdminSettings.ResubmitFaileSubmission);
                                let vDivCheckBox = $('<div />', { 'class': 'resend-submission-container' });
                                vDivCheckBox.append(vCheckBoxResubmit).append(vLabelResubmit);

                                let vDivMessage = $('<div />').append(vMessage);

                                if (packageTier != enumPackageTier.NativeCloud) {
                                    vDivMessage.append(vDivCheckBox);
                                }

                                detailMessage = vDivMessage;

                            } else {
                                detailMessage = $('<p/>').append(FSCONSTANTS.AdminSettings.AuthErrorNoActivePrimaryUser);
                            }
                            var errorMessage = getDetailNotificationBox('Warning! Authentication Token Error', detailMessage, disableBtn, 'Refresh Token');
                            $(errorMessage).find('.notification-box__body').after()
                            $('#adminNotificationBox').hide().html($(errorMessage).html());
                            $('#adminNotificationBox').find('.vabutton2').click(function () {
                                var positiveObject = { "authUrl": result.ResultText, "elemSource": this, "progressText": "Refreshing...", "actionType": "token" };
                                console.log('[FORM] checkTokenNotificationMessages positiveObject ');
                                console.log(positiveObject);

                                if ($('#ckResubmitFailedSubmission').prop('checked')) {
                                    ResubmitFailedSubmissionIsChecked = true;
                                } else {
                                    ResubmitFailedSubmissionIsChecked = false;
                                }

                                assignToMePositiveCallback(positiveObject);
                            });
                            $('#adminNotificationBox').addClass('notification---error');
                            $('#adminNotificationBox').slideDown();
                        }

                    } else {
                        if (authStatusCheckCount == authStatusCheckMaxCount) {
                            stopCheckingAuthStatus(elem, 'Failed');
                            showTokenMessageAsBar(FSCONSTANTS.Common.SomethingWentWrong, false);
                        } else {
                            authStatusCheckCount++;
                        }
                    }

                }
            } else {
                if (elem != null) {
                    clearInterval(authStatusTimer);
                    checkCurrentUserAuthorizationStatus = false;
                    toggleActionBtn(elem, true, 'Refresh Token');
                    authStatusCheckCount = 0;
                }
                $('#adminNotificationBox').removeClass('notification---error');
                $('#adminNotificationBox').html('');
                commonAlertMessage("Something went wrong.", "Please contact support if the issue persists.");
            }
        },
        { escape: true }
    );
}
function stopCheckingAuthStatus(elem, pButtonTextStatus) {
    clearInterval(authStatusTimer);
    checkCurrentUserAuthorizationStatus = false;
    toggleActionBtn(elem, true, pButtonTextStatus);
    authStatusCheckCount = 0;
}

function makeSureCurrentUserHasFormstackPermission() {
    var remoteUrlForMethod = REMOTE_ACTIONS["assignPermissionSetToUser"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            if (event.status) {
                console.log(result);
                console.log(event);
                if (result.IsValid) {

                    //If It is valid and text is Reload the Page, means that user didn't have permission 
                    //and we add the permission set and we need to reload the page.
                    if (result.OtherText == 'RELOAD') {
                        window.location = window.location.href;
                    }
                    console.log('[FORM] [makeSureCurrentUserHasFormstackPermission] Permission set status: ' + result.ResultText);
                } else {
                    console.log('[FORM] [makeSureCurrentUserHasFormstackPermission] Something went wrong: ' + result.ResultText);
                }
            } else {
                commonAlertMessage("Something went wrong.", "Please contact support if the issue persists.");
            }
        },
        { escape: true }
    );
}

function checkFormRemoteSitesInfoForMDAPICallback(createIfnotfound, remoteSitesInfoResponseObject) {
    console.log(remoteSitesInfoResponseObject);
    var isRemoteSiteWhitelistedForMDAPI = false;
    if (remoteSitesInfoResponseObject.IsValid) {

        $.each(remoteSitesInfoResponseObject.results, function (indx, remoteSite) {
            var objElement = getXmlElementFromStr(remoteSite);
            var url = firstElementByTagName(objElement, "url", true);
            if (url == GetWindowURL()) {
                isRemoteSiteWhitelistedForMDAPI = true;
                return false;
            }
        });
    }
    if (!isRemoteSiteWhitelistedForMDAPI) {
        // MDAPI remote site settings is not there then let's add new one.        
        if (createIfnotfound) {
            console.log(' Let\'s add a remote site setting for current url ');
            setupFormMDAPIRemoteSite(getFSNSVariable('SessionKey', ''), "FormstackMDAPIEndpoint", GetWindowURL(), 'Allow to use Metadata API from APEX', "upsert", false, checkFormRemoteSitesInfoForMDAPICallback)
        } else {
            console.log('[FORM] We tried once');
        }
    } else {
        //Current url is already there in remote site settings
    }
}

function addRemoteSitesForApexCallouts(elemSource) {
    var remoteUrlForMethod = REMOTE_ACTIONS["updateRemoteSitesettingsForCallouts"];
    toggleAddSitesBtn(elemSource, true, 'Updating...');
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            if (event.status) {
                console.log('[FORM] [updateRemoteSitesettingsForCallouts]');
                console.log(result);
                console.log(event);
                var isSuccess = true;
                if (result != null && result.length > 0) {
                    $.each(result, function (indx, resultHelper) {
                        if (!resultHelper.IsValid) {
                            isSuccess = false;
                        }
                    })
                }
                if (isSuccess) {
                    toggleAddSitesBtn(elemSource, true, 'Done');
                } else {
                    commonAlertMessage("Something went wrong", "Please contact support if the issue persists. <a class=\"a--blue\" href=\"https://sfapphelp.formstack.com/hc/en-us/articles/360018480252-Prefilling-Community-Forms-from-Logged-in-User\" title=\"Learn more\">Learn more</a>");
                    toggleAddSitesBtn(elemSource, false, 'Update Sites');
                }
            } else {
                console.log(event.message);
                toggleAddSitesBtn(elemSource, false, 'Update Sites');
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        },
        { escape: true }
    );
}


function addSharingRules(element){
    toggleActionBtn(element,true,'Create Sharing Rules');
    addSharingRuleApexCallout();
}

function addCommunitySharingRules(element){
    toggleActionBtn(element,true,'Create Sharing Rules');
    addCommunitySharingRuleApexCallout();
}
function addCommunitySharingRuleApexCallout() {
    var remoteUrlForMethod = REMOTE_ACTIONS["createCommunitySharingRules"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            var btnSharingRules = document.getElementById('btnCommunitySharingRules');
            if (event.status && result.IsValid) {
                console.log('[FORM] [createCommunitySharingRules]');
                toggleActionBtn(btnSharingRules,true,'Done.');
                console.log(result);
                console.log(event);
            } else {
                console.log('[FORM] [createCommunitySharingRules]');
                console.log(event.message);
                console.log(result.ResultText);
                toggleActionBtn(btnSharingRules,false,'Create Sharing Rules');
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        },
        { escape: true }
    );
}

function addSharingRuleApexCallout() {
    var remoteUrlForMethod = REMOTE_ACTIONS["createSharingRules"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            var btnSharingRules = document.getElementById('btnSharingRules');
            if (event.status && result.IsValid) {
                console.log('[FORM] [createSharingRules]');
                toggleActionBtn(btnSharingRules,true,'Done.');
                console.log(result);
                console.log(event);
            } else {
                console.log(event.message);
                console.log(result.ResultText);
                toggleActionBtn(btnSharingRules,false,'Create Sharing Rules');
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        },
        { escape: true }
    );
}

function isSharingRuleEnable() {
    var remoteUrlForMethod = REMOTE_ACTIONS["hasSharingSettingRulesRecordsExist"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            var btnSharingRules = document.getElementById('btnSharingRules');
            if (event.status && result.indexOf('Formstack') != -1) {
                console.log('[FORM] [Error isSharingRuleEnable]');
                toggleActionBtn(btnSharingRules,false,'Create Sharing Rules');
                console.log(result);
                console.log(event);
            } else {
                console.log('[FORM] [isSharingRuleEnable]');
                toggleActionBtn(btnSharingRules,true,'Create Sharing Rules');
                console.log(event.message);
                console.log(result);
            }
        },
        { escape: true }
    );
}

function toggleActionBtn(elemSource, disable, btnText) {
    if (disable) {
        if (!$(elemSource).hasClass('va-disabled')) {
            $(elemSource).addClass('va-disabled');
        }
    } else {
        $(elemSource).removeClass('va-disabled');
    }
    $(elemSource).text(btnText);
}
function toggleAddSitesBtn(elemSource, disable, btnText) {
    if (disable) {
        if (!$(elemSource).hasClass('va-disabled')) {
            $(elemSource).addClass('va-disabled');
        }
    } else {
        $(elemSource).removeClass('va-disabled');
    }
    $(elemSource).text(btnText);
}

function addUser(elemSource) {
    addUserRemote("addUser", elemSource);
}

function addUserRemote(remote_action, elemSource) {
    console.log('[addUserRemote] Start...');
    var userId = $('#inputTextUserNames').attr('data-userid');
    $('#inputTextUserNames').attr('data-userid', '');

    if (userId) {
        var remoteUrlForMethod = REMOTE_ACTIONS[remote_action];
        Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
            userId,
            function (result, event) {
                if (event.status) {
                    addFSPermissionSet(userId);
                } else {
                    console.log(result);
                    console.log(event);
                    commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
                }
            },
            { escape: true }
        );
    } else {
        commonAlertMessage("Something went wrong", "Please select a user from the search list.");
    }
}

function addFSPermissionSet(userId) {
    console.log('[addFSPermissionSet] Start...');
    if (userId != null) {
        var remoteUrlForMethod = REMOTE_ACTIONS["addFSPermissionSet"];
        Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
            userId,
            function (result, event) {
                if (event.status) {
                    if (result.IsValid && result.OtherText != '') {
                        var vMessage = 'User added successfully.';
                        var vMessage2 = '<b>Note:</b> The Salesforce license type for this user does not allow additional apps to be added to the application launcher. ';
                        vMessage2 += '<a tabindex="-1" href="https://sfapphelp.formstack.com/hc/en-us/articles/360018996751-License-Management" target="__blank" class="a--blue" >Learn more</a>.';
                        var callbackObject = { "uiMessage": vMessage, "uiMessage2": vMessage2, "uiMessageType": enumMessageType.Success };
                        remoteResetAssignedSeatsCount(callbackObject, resetLicenseCountResponse);
                        console.log(result);
                        console.log(event);
                    } else if (!result.IsValid) {
                        //If we failed to add Formstack Permission set, we don't add the User in Formstack_User_License, we have to remove it.
                        removeUserPositiveCallback(userId, true);
                        showPillMessage_Error('<span>Something went wrong! Couldn\'t assign a critical permission set to selected user. <a href="https://sfapphelp.formstack.com/hc/en-us/articles/360018690572-Couldn-t-assign-Critical-Permission-set-to-Selected-User" target="_blank" class="a--white">Learn more.</a></span>');
                        console.log(result);
                        console.log(event);
                    } else {
                        var callbackObject = { "uiMessage": "User successfully added!" };
                        remoteResetAssignedSeatsCount(callbackObject, resetLicenseCountResponse);
                    }

                } else {
                    commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
                    console.log(result);
                    console.log(event);
                }
            }
        );
    }
}

function removeFSPermissionSet(userId) {
    console.log('[removeFSPermissionSet] Start...');
    if (userId != null) {
        var remoteUrlForMethod = REMOTE_ACTIONS["removeFSPermissionSet"];
        Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
            userId,
            function (result, event) {
                if (event.status) {
                    console.log(result);
                    console.log(event);
                } else {
                    commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
                }
            },
            { escape: true }
        );
    } else {
        commonAlertMessage("Something went wrong", "Please select a user from the search list.");
    }
}

function resetLicenseCountResponse(responseObject) {

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

    reRenderUserLicenseBlocks();
}
function remoteResetAssignedSeatsCount(callbackObject, callbackFunction) {
    var remoteUrlForMethod = REMOTE_ACTIONS["resetAssignedSeatsCount"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            if (event.status) {
                console.log(result);
                console.log(event);
                if (result.IsValid) {
                    if (typeof callbackFunction === "function") {
                        console.log("[FORM] [remoteResetAssignedSeatsCount] [positiveCallback] Callback response: " + callbackObject);
                        if (callbackObject !== undefined) {
                            callbackFunction(callbackObject);
                        } else {
                            callbackFunction();
                        }
                    }
                } else {
                    console.log("[FORM] remoteResetAssignedSeatsCount");
                    commonAlertMessage("Something went wrong while processing your request.", "Please contact support if the issue persists.");
                }
            } else {
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        },
        { escape: true }
    );
}
function confirmAndAssignPermissionSetToMe(elem) {
    console.log('[FORM] [confirmAndAssignPermissionSetToMe]');

    var remoteUrlForMethod = REMOTE_ACTIONS["getAuthorizationLink"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            if (event.status) {
                console.log("confirmAndAssignPermissionSetToMe result: " + result);
                console.log(event);
                if (isNullOrEmpty(result)) {
                    commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
                } else {
                    var authUrl = result;
                    var primaryMessage = "Assign Yourself as the Primary User?"
                    var secondaryMessage = "After you become a Primary User, you will be the default owner of new Salesforce records created through form submissions.";
                    var positiveObject = { "authUrl": authUrl, "elemSource": elem, "progressText": "Assigning...", "actionType": "assignment" };
                    var btnPositiveText = "Assign to me";
                    var btnNegativeText = "Cancel";
                    //commonJSHelper method
                    confirmDialogWithCallback(primaryMessage, secondaryMessage, positiveObject, assignToMePositiveCallback, "", "", btnPositiveText, btnNegativeText);
                }
            } else {
                console.log(event.message);
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        },
        { escape: false }
    );
}
// TODO:Mohammed move to commonJSHelper
function assignToMePositiveCallback(callbackObject) {
    console.log('[assignToMePositiveCallback] Starts...');

    checkCurrentUserAuthorizationStatus = true;
    var authUrl = callbackObject.authUrl;
    if (authUrl !== undefined && authUrl !== '') {
        authUrl = authUrl.replace(/&amp;/g, '&');
    }
    var elem = callbackObject.elemSource;
    var progressText = callbackObject.progressText;
    toggleActionBtn(elem, true, progressText);
    if (callbackObject.actionType == 'token') {
        authStatusTimer = setInterval(function () { checkTokenRefreshStatus(elem); }, 3000);
    } else {
        authStatusTimer = setInterval(function () { checkPrimaryUserAssignmentStatus(elem); }, 3000);
    }
    console.log('[FORM] [assignToMePositiveCallback]');
    console.log(authUrl);
    return !window.open(authUrl);
}

function checkTokenRefreshStatus(elem) {
    if (checkCurrentUserAuthorizationStatus) {
        console.log('[FORM] [checkPrimaryUserAssignmentStatus]');
        checkTokenNotificationMessages(elem);
    }
}
function checkPrimaryUserAssignmentStatus(elem) {
    if (checkCurrentUserAuthorizationStatus) {
        console.log('[FORM] [checkPrimaryUserAssignmentStatus]');
        var remoteUrlForMethod = REMOTE_ACTIONS["isUserPrimaryLicenseHolder"];
        Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
            SFCurrentUserId,
            function (result, event) {
                if (event.status) {
                    console.log(result);
                    console.log(event);
                    if (result.IsValid) {
                        // clearing out the timer so that it doesn't execute checkPrimaryUserAssignmentStatus function again.
                        clearInterval(authStatusTimer);
                        checkCurrentUserAuthorizationStatus = false;
                        $('.ticker-error--dark').hide();
                        if (packageTier != 'NativeCloud') {
                            updateEngineToken(elem, "assignment");
                        } else {
                            toggleActionBtn(elem, true, 'Done');//Just for display. The whole list of users will be refreshed once User confirms the following Popup message.
                            var primaryMessage = "Success! You are now a Primary User.";
                            var secondaryMessage = "You are now the default owner of all records created through form submissions. You are also the only person who can refresh the Formstack authentication token if there is an issue.";
                            var btnText = "You are all set to start building forms!";
                            popupMessage_ShowOneButton(enumFSPopupMessageType.Success, primaryMessage, secondaryMessage, btnText, reRenderUserLicenseBlocks);
                        }
                    } else {
                        ///keep the timeout function on
                        console.log('[FORM] [checkPrimaryUserAssignmentStatus] checking status of primary user assignment');
                    }
                } else {
                    console.log(event.message);
                    clearInterval(authStatusTimer);
                    checkCurrentUserAuthorizationStatus = false;
                    toggleActionBtn(elem, true, 'Assign To Me');
                    commonAlertMessage("Something went wrong", "Please contact support if issue persist.");
                }
            },
            { escape: true }
        );
    }
}
function reRenderUserLicenseBlocks() {
    ///VF actionFunctionCall to reset licenses
    resetLicenseListJs();
}
function removeUser(userId) {
    if (userId) {
        var primaryMessage = "Are you sure you want to remove this user?"
        var secondaryMessage = "This user will no longer be able to build forms and review form submissions.";
        var positiveObject = userId;
        //commonJSHelper method
        confirmDialogWithCallback(primaryMessage, secondaryMessage, positiveObject, removeUserPositiveCallback, "", "");
    }
}
function removeUserPositiveCallback(userId, pRollback) {
    var remoteUrlForMethod = REMOTE_ACTIONS["removeUser"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        userId,
        function (result, event) {
            if (event.status) {
                console.log(result);
                console.log(event);
                if (result == true) {

                    if (pRollback) {
                        //If it is rollback doesn't do anything.
                    } else {
                        removeFSPermissionSet(userId);

                        var callbackObject = { "uiMessage": "User successfully removed!" };
                        remoteResetAssignedSeatsCount(callbackObject, resetLicenseCountResponse);
                    }
                }
            } else {
                console.log(event.message);
                commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
            }
        },
        { escape: true }
    );
}

function submitFailedSubmissions() {
    console.log('[submitFailedSubmissions] Starts...');

    var remoteUrlForMethod = REMOTE_ACTIONS["submitFailedSubmissions"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            console.log('[submitFailedSubmissions] return....');

            if (event.status) {
                console.log(result);
                console.log(event);
            } else {
                console.log(event.message);
            }
        },
        { escape: true }
    );
}

function updateEngineToken(elem, actionType) {
    var remoteUrlForMethod = REMOTE_ACTIONS["updateEngineToken"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        function (result, event) {
            if (event.status) {
                console.log(result);
                console.log(event);
                if (result != null && result.IsValid) {
                    console.log("Updated engine token!");
                    if (actionType == 'token') {
                        showTokenMessageAsBar(FSCONSTANTS.AdminSettings.AuthSuccess, true);

                        if (ResubmitFailedSubmissionIsChecked) {
                            ResubmitFailedSubmissionIsChecked = false;
                            submitFailedSubmissions();
                        }

                    } else {
                        toggleActionBtn(elem, true, 'Done');//Just for display. The whole list of users will be refreshed once User confirms the following Popup message.     
                        var primaryMessage = "Success! You are now a Primary User.";
                        var secondaryMessage = "You are now the default owner of all records created through form submissions. You are also the only person who can refresh the Formstack authentication token if there is an issue.";
                        var btnText = "You are all set to start building forms!";
                        popupMessage_ShowOneButton(enumFSPopupMessageType.Success, primaryMessage, secondaryMessage, btnText, reRenderUserLicenseBlocks);
                    }
                } else {
                    if (actionType == 'token') {
                        showTokenMessageAsBar(FSCONSTANTS.Common.SomethingWentWrong, false);
                    } else {
                        toggleActionBtn(elem, true, 'Assign To Me');
                        commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
                    }
                }
            } else {
                console.log(event.message);
                if (actionType == 'token') {
                    showTokenMessageAsBar(FSCONSTANTS.Common.SomethingWentWrong, false);
                } else {
                    toggleActionBtn(elem, true, 'Assign To Me');
                    commonAlertMessage("Something went wrong", "Please contact support if the issue persists.");
                }
            }
        },
        { escape: true }
    );
}

function showTokenMessageAsBar(message, isSuccess) {
    var messageDiv = getShortNotificationBox(message);
    $('#adminNotificationBox').hide().html($(messageDiv).html());
    $('#adminNotificationBox').removeClass('notification---success');
    $('#adminNotificationBox').removeClass('notification---error');
    if (isSuccess) {
        $('#adminNotificationBox').addClass('notification---success');
    } else {
        $('#adminNotificationBox').addClass('notification---error');
    }
    $('#adminNotificationBox').slideDown();
}

function focusInputFilter(elemSource) {
    var sortOrder = $(elemSource).val();
    if (!isNullOrEmpty(sortOrder) && sortOrder.split('-').length > 1) {
        orderByDirection = safeStringValue(sortOrder.split('-')[1], 'DESC');
        orderByField = safeStringValue(sortOrder.split('-')[0], 'LastModifiedDate');
    }
    callToRemoteGetFormIDs();
}

function callToRemoteGetFormIDs() {
    remoteGetAllFormIDsJS();
}

function remoteGetAllFormIDsJS() {
    resetInlineLoadingBar(true);
    var remoteUrlForMethod = REMOTE_ACTIONS["getAllUsers"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        userSearchText, orderByField, orderByDirection,
        function (result, event) {

            if (event.status) {
                resetInlineLoadingBar(false);
                if (result != null) {
                    userIds = result;
                    initializePagination(1, pageSize);
                    resetCurrentPageData(1, true);

                }
                else {

                }
            } else {
                resetInlineLoadingBar(false);
                console.log(' Fail-' + result);
            }

        },
        { buffer: true, escape: true, timeout: 30000 }
    );
}

function resetInlineLoadingBar(show) {
    if (show) {
        $('.ffactions-wrapper-outer .inline-loading').fadeIn();
    }
    else {
        $('.ffactions-wrapper-outer .inline-loading').fadeOut();
    }
}
function getCurrentPageUrl() {

    if (this.document.location.origin === undefined) {
        return this.document.location.protocol + '//' + this.document.location.hostname
    }
    else {
        return this.document.location.origin;
    }
}

function getUsersByName(response, param) {
    var remoteUrlForMethod = REMOTE_ACTIONS["getUsersByName"];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod,
        param,
        function (result, event) {
            if (event.status) {
                console.log(event);
                console.log(result);
                response(result);
            } else {
                alert(event.message);
            }
        },
        { escape: true }
    );
}
function checkFormRemoteSitesInfoForMDAPI(sessionId, siteNames, currentWindowHostName, responseCallbackObject, responseCallback) {

    var siteNamesXml = '';
    if (siteNames instanceof Array) {
        $.each(siteNames, function () {
            siteNamesXml += '<fullNames>' + this + '</fullNames>';
        });
    } else {
        siteNamesXml += '<fullNames>' + siteNames + '</fullNames>';
    }
    console.log('[FORM] checkFormRemoteSitesInfoForMDAPI Starts...');

    // Calls the Metdata API from JavaScript to get Remote Site Setting info
    var binding = new XMLHttpRequest();
    var payloadSOAP =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<env:Header>' +
        '<urn:SessionHeader xmlns:urn="http://soap.sforce.com/2006/04/metadata">' +
        '<urn:sessionId>' + sessionId + '</urn:sessionId>' +
        '</urn:SessionHeader>' +
        '</env:Header>' +
        '<env:Body>' +
        '<readMetadata xmlns="http://soap.sforce.com/2006/04/metadata">' +
        '<type>RemoteSiteSetting</type>' +
        siteNamesXml +
        '</readMetadata>' +
        '</env:Body>' +
        '</env:Envelope>';
    deployMetaDataSOAP(payloadSOAP, GetWindowURL(), responseCallbackObject, responseCallback);

}
function setupFormMDAPIRemoteSite(sessionId, sitename, siteurl, description, createOrUpsert, responseCallbackObject, responseCallback) {
    var metaDataType = 'create';
    var validMetadataTypes = ['create', 'upsert'];
    if ($.inArray(createOrUpsert, validMetadataTypes) >= 0) {
        metaDataType = createOrUpsert;
    }
    console.log('[FORM] setupFormMDAPIRemoteSite Starts...' + metaDataType);

    // Calls the Metdata API from JavaScript to create the Remote Site Setting to permit Apex callouts
    var binding = new XMLHttpRequest();
    var payloadSOAP =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<env:Header>' +
        '<urn:SessionHeader xmlns:urn="http://soap.sforce.com/2006/04/metadata">' +
        '<urn:sessionId>' + sessionId + '</urn:sessionId>' +
        '</urn:SessionHeader>' +
        '</env:Header>' +
        '<env:Body>' +
        '<' + metaDataType + 'Metadata xmlns="http://soap.sforce.com/2006/04/metadata">' +
        '<metadata xsi:type="RemoteSiteSetting">' +
        '<fullName>' + sitename + '</fullName>' +
        '<description>' + description + '</description>' +
        '<disableProtocolSecurity>false</disableProtocolSecurity>' +
        '<isActive>true</isActive>' +
        '<url>' + siteurl + '</url>' +
        '</metadata>' +
        '</' + metaDataType + 'Metadata>' +
        '</env:Body>' +
        '</env:Envelope>';
    deployMetaDataSOAP(payloadSOAP, GetWindowURL(), responseCallbackObject, responseCallback);

}
function getRemoteSiteObject(objElement) {
    var site = {};
    site["fullName"] = firstElementByTagName(objElement, 'fullName', true);
    site["description"] = firstElementByTagName(objElement, 'description', true);
    site["isActive"] = firstElementByTagName(objElement, 'isActive', true);
    site["url"] = firstElementByTagName(objElement, 'url', true);
    return site;
}
function getDetailNotificationBox(title, message, btnDisabled, btnText) {
    var notificationeBox = $("<div/>", { "class": "notification-box" });
    var nBoxCol9 = $("<div/>", { "class": "notification-box---col9" });
    var nBoxCol3 = $("<div/>", { "class": "notification-box---col3" });
    var nBoxTitle = $("<div/>", { "class": "notification-box__title" });
    var nBoxBody = $("<div/>", { "class": "notification-box__body" });
    var nBoxBtn = $("<button/>", { "type": "button", "class": "vabutton2 btn2---warning", "title": btnText });
    var nBoxTitleGraphic = $("<div/>", { "class": "notification-box__title--graphic" });
    var nBoxTitleText = $("<div/>", { "class": "notification-box__title--text" });
    var nBoxBodyMessage = $("<div/>");
    nBoxBodyMessage.html(message);
    nBoxTitleText.html(title);
    nBoxBtn.text(btnText);
    if (btnDisabled) {
        console.log('[FORM] btn disabled:' + btnDisabled);
        nBoxBtn.addClass('va-disabled');
    }
    nBoxTitle.html(nBoxTitleGraphic);
    nBoxTitle.append(nBoxTitleText);
    nBoxBody.html(nBoxBodyMessage);
    nBoxCol9.html(nBoxTitle);
    nBoxCol9.append(nBoxBody);
    nBoxCol3.html(nBoxBtn);
    notificationeBox.html(nBoxCol9);
    notificationeBox.append(nBoxCol3);
    return notificationeBox.clone().wrap('<div>').parent();
}
function getShortNotificationBox(message) {
    var notificationeBox = $("<div/>", { "class": "notification-box" });
    var nBoxBtn = $("<button/>", { "type": "button", "class": "close-icon", "title": "Close", "onclick": "closeNotificationBox(this);" });
    var nBoxCol9 = $("<div/>", { "class": "notification-box---col9" });
    var nBoxCol3 = $("<div/>", { "class": "notification-box---col3" });
    var nBoxBodyMessage = $("<div/>");
    nBoxBodyMessage.html(message);
    nBoxCol9.html(nBoxBodyMessage);
    nBoxCol3.html(nBoxBtn);
    notificationeBox.html(nBoxCol9);
    notificationeBox.append(nBoxCol3);
    return notificationeBox.clone().wrap('<div>').parent();
}
function closeNotificationBox(elem) {
    $(elem).parents('.notification-box').remove();
}
function isCurrentUserAPrimaryUser() {
    if ($('.assigned-primary-license').find('.primary-license').length == 1) {
        var userid = $('.assigned-primary-license').find('.primary-license').attr('data-userid');
        if (userid !== undefined && userid !== '') {
            return true;
        }
    }
    return false;
}
function isCurrentUserLicensed() {
    if ($('.assigned-primary-license').find('.user-' + SFCurrentUserId).length == 1) {
        return true;
    }
    return false;
}
function isPrimaryUserInactive() {
    if ($('.assigned-primary-license').find('.primary-license').length == 1) {
        return $('.assigned-primary-license').find('.primary-license').parent().parent().hasClass('inactive');
    }
    return false;
}

function addEventClickOnMenu(){
    $('li.li-left-panel').click(function () {
        setPanelControl(this);
    });
}

$(function () {
    console.log('Loading Page...');
    addEventClickOnMenu();

    var defaultMenuUrlParameter = getParameterByName('DefaultMenu');
    if(defaultMenuUrlParameter != ''){
        $('[panelid="' + defaultMenuUrlParameter + '"]').click();
    } else {
        $('[panelid="userManagement"]').click();
    }
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/*FSCONSTANTS starts*/
// TODO: move it to its own file and use this pattern for other functionality like Utility methods, Helper methods
(function (FSCONSTANTS, $) {
    //Private Property
    //var privateProp = true;   
    //Public Property
    FSCONSTANTS.AdminSettings = {
        "AuthSuccess": "Formstack's authentication token has been updated successfully.",
        "AuthErrorNonPrimaryUser": "Formstack's authentication token is invalid and submissions will not be processed! Please contact the Primary User to update the authentication token or assign yourself as the Primary User to avoid submission data loss.",
        "AuthErrorPrimaryUser": "Formstack's authentication token is invalid and submissions will not be processed! Please update the authentication token.",
        "AuthErrorNoActivePrimaryUser": "Your Primary User has been deactivated. Please assign another license to be the Primary User. Otherwise, you will no longer be able to create new Salesforce records with your form submissions and you will lose all data from your form submissions. <strong>To proceed, we recommend you assign this license to yourself.</strong> <br/>If you don't want to be the Primary User, please ask another user to assign themselves the role.",
        "ResubmitFaileSubmission": "Resubmit affected submissions after the token refresh."
    };
    FSCONSTANTS.Common = {
        "SomethingWentWrong": "Something went wrong. Please contact support if the issue persists."
    }
    //Public Method
    /*
    FSCONSTANTS.publicMethod = function() {
        console.log( 'publicMethod ');
    };
    */

    //Private Method
    /*
    function privateMethod() {
        console.log( 'privateMethod ');
    }
    */

}(window.FSCONSTANTS = window.FSCONSTANTS || {}, jQuery));
   /*FSCONSTANTS ends*/