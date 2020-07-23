var authStatusTimer;

function makeSureCurrentUserHasFormstackPermission() {
    var remoteUrlForMethod = REMOTE_ACTIONS['assignPermissionSetToUser'];
    Visualforce.remoting.Manager.invokeAction(
        remoteUrlForMethod,
        function(result, event) {
            if (event.status) {
                console.log(result);
                console.log(event);
                if (result.IsValid) {
                    //If It is valid and text is Reload the Page, means that user didn't have permission
                    //and we add the permission set and we need to reload the page.
                    if (result.OtherText == 'RELOAD') {
                        window.location = window.location.href;
                    }
                    console.log(
                        '[FORM] [makeSureCurrentUserHasFormstackPermission] Permission set status: ' +
                            result.ResultText
                    );
                } else {
                    console.log(
                        '[FORM] [makeSureCurrentUserHasFormstackPermission] Something went wrong: ' +
                            result.ResultText
                    );
                }
            } else {
                commonAlertMessage(
                    'Something went wrong.',
                    'Please contact support if the issue persists.'
                );
            }
        },
        { escape: true }
    );
}

function editPhoneNumber() {
    setPreferPhoneNumberToEditMode();
}

var checkCurrentUserAuthorizationStatus = false;

function confirmAndAssignPermissionSetToMe(elem) {
    console.log('[FORM] [confirmAndAssignPermissionSetToMe]');
    var authUrl = elem.getAttribute('data-authurl');

    if (authUrl != null || authUrl != '') {
        var positiveObject = {
            authUrl: authUrl,
            elemSource: elem,
            progressText: 'Assigning...',
            actionType: 'assignment'
        };
        assignToMePositiveCallback(positiveObject);
    } else {
        commonAlertMessage('Something went wrong', 'Please contact support if the issue persists.');
    }
}

function assignToMePositiveCallback(callbackObject) {
    console.log('[assignToMePositiveCallback] Starts...');

    checkCurrentUserAuthorizationStatus = true;
    var authUrl = callbackObject.authUrl;
    if (authUrl !== undefined && authUrl !== '') {
        authUrl = authUrl.replace(/&amp;/g, '&');
    }
    var elem = callbackObject.elemSource;
    var progressText = callbackObject.progressText;
    enableDisableButton(elem, true, progressText);
    if (callbackObject.actionType == 'assignment') {
        authStatusTimer = setInterval(function() {
            console.log('[FORM] [setInterval] Starts..');
            checkPrimaryUserAssignmentStatus(elem);
        }, 3000);
    }
    console.log('[FORM] [assignToMePositiveCallback]');
    console.log(authUrl);
    return !window.open(authUrl);
}

function setWelcomeToFormstackStatus(value) {
    var remoteUrlForMethod = REMOTE_ACTIONS['setWelcomeToFormstackStatus'];
    Visualforce.remoting.Manager.invokeAction(remoteUrlForMethod, value, function(result, event) {
        if (event.status) {
            console.log(result);
            rerenderTopPanel();
        } else {
            console.log(event.message);
            commonAlertMessage('Something went wrong', 'Please contact support if issue persist.');
        }
    });
}

function checkPrimaryUserAssignmentStatus(elem) {
    if (checkCurrentUserAuthorizationStatus) {
        console.log('[FORM] [checkPrimaryUserAssignmentStatus]');
        var remoteUrlForMethod = REMOTE_ACTIONS['isUserPrimaryLicenseHolder'];
        Visualforce.remoting.Manager.invokeAction(
            remoteUrlForMethod,
            SFCurrentUserId,
            function(result, event) {
                if (event.status) {
                    console.log(result);
                    console.log(event);
                    if (result.IsValid) {
                        // clearing out the timer so that it doesn't execute checkPrimaryUserAssignmentStatus function again.
                        clearInterval(authStatusTimer);
                        addRemoteSitesForApexCallouts(elem);
                    } else {
                        ///keep the timeout function on
                        console.log(
                            '[FORM] [checkPrimaryUserAssignmentStatus] checking status of primary user assignment'
                        );
                    }
                } else {
                    console.log(event.message);
                    clearInterval(authStatusTimer);
                    checkCurrentUserAuthorizationStatus = false;
                    enableDisableButton(elem, true, 'Assign to me and proceed');
                    commonAlertMessage(
                        'Something went wrong',
                        'Please contact support if issue persist.'
                    );
                }
            },
            {
                escape: true
            }
        );
    }
}

function setPreferredPhoneNumberToViewMode() {
    $('#preferPhoneNumberDisplay').show();
    $('#preferPhoneNumberTextbox').hide();
    $('#preferPhoneNumberTextbox').attr('disabled', 'disabled');
    $('#preferPhoneNumberValidationButton').hide();
    $('#preferPhoneNumberTextbox').addClass('prefer-phone-number-label');
    $('#preferPhoneNumberTextbox').removeClass('prefer-phone-number-text');
    $('#editPhoneNumberButton').css('display', '');
    $('#preferPhoneNumberConfirmButton').prop('disabled', false);
    $('#preferPhoneNumberConfirmButton').removeClass('button-disabled');
    $('#preferPhoneNumberConfirmButton').addClass('prefer-phone-number-confirm-button');
    $('#updateStatusText').removeClass('update-status-error');
    $('#updateStatusText').addClass('update-status');
    $(".prefer-phone-number-container").removeClass('edit-on-with-message');
    $(".prefer-phone-number-container").removeClass('edit-on-without-message');
    $(".prefer-phone-number-container").addClass('edit-off-with-message');
    $(".prefer-phone-number-label-empty").addClass('prefer-phone-number-label');
    $(".prefer-phone-number-label-empty").removeClass('prefer-phone-number-label-empty');

}

function setPreferPhoneNumberToEditMode() {
    $('#preferPhoneNumberDisplay').hide();
    $('#editPhoneNumberButton').hide();
    $('#preferPhoneNumberTextbox').show();
    $('#preferPhoneNumberTextbox').removeAttr('disabled', 'disabled');
    $('#preferPhoneNumberTextbox').removeClass('prefer-phone-number-label');
    $('#preferPhoneNumberTextbox').addClass('prefer-phone-number-text');
    $('#preferPhoneNumberValidationButton').css('display', '');
    $('#preferPhoneNumberConfirmButton').prop('disabled', true);
    $('#preferPhoneNumberConfirmButton').addClass('button-disabled');
    $('#preferPhoneNumberTextbox').removeClass('button-disabled');
    $('#preferPhoneNumberTextbox').focus();
    $(".prefer-phone-number-container").removeClass('edit-on-with-message');
    $(".prefer-phone-number-container").removeClass('edit-off-with-message');
    if($('#updateStatusText')[0].innerHTML.length == 0){
        $(".prefer-phone-number-container").addClass('edit-on-without-message');
    }else{
        $(".prefer-phone-number-container").addClass('edit-on-with-message');
    }
}

function validatePhoneNumber() {
    console.log("[start] validatePhoneNumber....");
    var userPreferredPhoneNumber = $('#preferPhoneNumberHiddenInput').val();
    var value = $('#preferPhoneNumberTextbox').val();

    if ($('#preferPhoneNumberTextbox').length != 0) { 
        value = value.trim(); 
    }
    // We are validating only if the user has added value in the input, like more then 5 characters
    if (value.length < 5 && value.length != 0) {
        // if user enter char in textbox
        // Then show Error message
        updateStatusText('Number you entered is not valid.');
        addErrorClass();
        return false;
    } else if (userPreferredPhoneNumber.length > 0 && value.length == 0) {
        // If user removed current value
        // Then return old value and show error massage
        $('#preferPhoneNumberTextbox').val(userPreferredPhoneNumber);
        $('#preferPhoneNumberDisplay').text(userPreferredPhoneNumber);
        setPreferredPhoneNumberToViewMode();
        updateStatusText('Cannot leave this field empty.');
        addErrorClass();
        return false;
    }else if(value.length == 0 ){
        // if the user doesn't have a phone number record or didn't enter phone number 
        setPreferPhoneNumberToEditMode();
        updateStatusText('Cannot leave this field empty.');
        addErrorClass();

        return false;
    }
    // return true when value equal number and/or special char
    setPreferredPhoneNumberToViewMode();
    if (value != userPreferredPhoneNumber) {
        $('#preferPhoneNumberDisplay').text(value);
        updateStatusText('Number updated!');
    }
    removeErrorClass();
    $('#preferPhoneNumberConfirmButton').focus();
}

function updateStatusText(message){
    $('#updateStatusText').html(message);
    if($('#preferPhoneNumberTextbox').is(':visible')){
        $(".prefer-phone-number-container").removeClass('edit-off-with-message');
        $(".prefer-phone-number-container").removeClass('edit-on-without-message');
        $(".prefer-phone-number-container").addClass('edit-on-with-message');
    }
}
function removeErrorClass() {
    $('#updateStatusText').removeClass('update-status-error');
    $('#preferPhoneNumberTextbox').removeClass('prefer-phone-number-text-error');
}

function addErrorClass() {
    $('#updateStatusText').addClass('update-status-error');
    $('#preferPhoneNumberTextbox').addClass('prefer-phone-number-text-error');
    $('#preferPhoneNumberTextbox').effect('shake');
}

function syncPhoneNumberJS() {
    if (validatePhoneNumber() == false){
        return false;
    }
    console.log('synced phone number...');
    var phoneNumber = $('#preferPhoneNumberTextbox').val();
    passToSync(phoneNumber);
    $('#preferPhoneNumberConfirmButton').prop('disabled', true);
    $('#preferPhoneNumberConfirmButton').addClass('button-disabled');
}

function addRemoteSitesForApexCallouts(elemSource) {
    var remoteUrlForMethod = REMOTE_ACTIONS['updateRemoteSitesettingsForCallouts'];
    enableDisableButton(elemSource, true, 'Updating...');
    Visualforce.remoting.Manager.invokeAction(
        remoteUrlForMethod,
        function(result, event) {
            if (event.status) {
                console.log('[FORM] [updateRemoteSitesettingsForCallouts]');
                console.log(result);
                console.log(event);
                var isSuccess = true;
                if (result != null && result.length > 0) {
                    $.each(result, function(indx, resultHelper) {
                        if (!resultHelper.IsValid) {
                            isSuccess = false;
                        }
                    });
                }
                if (isSuccess) {
                    enableDisableButton(elemSource, true, 'Done'); //Just for display. The whole list of users will be refreshed once User confirms the following Popup message.
                    // set status to step 2
                    setWelcomeToFormstackStatus('2');
                } else {
                    commonAlertMessage(
                        'Something went wrong',
                        'Please contact support if the issue persists. <a class="a--blue" href="https://sfapphelp.formstack.com/hc/en-us/articles/360018480252-Prefilling-Community-Forms-from-Logged-in-User" title="Learn more">Learn more</a>'
                    );
                    enableDisableButton(elemSource, false, 'Update Sites');
                }
            } else {
                console.log(event.message);
                enableDisableButton(elemSource, false, 'Update Sites');
                commonAlertMessage(
                    'Something went wrong',
                    'Please contact support if the issue persists.'
                );
            }
        },
        { escape: true }
    );
}

function onFormPageLoad() {
    // making sure current user has Formstacdk permission
    makeSureCurrentUserHasFormstackPermission();

    var remoteSitesInfoArray = ['FormstackMDAPIEndpoint'];
    checkFormRemoteSitesInfoForMDAPI(
        getFSNSVariable('SessionKey', ''),
        remoteSitesInfoArray,
        getCurrentPageUrl(),
        true,
        checkFormRemoteSitesInfoForMDAPICallback
    );
}

$(function() {
    onFormPageLoad();
});