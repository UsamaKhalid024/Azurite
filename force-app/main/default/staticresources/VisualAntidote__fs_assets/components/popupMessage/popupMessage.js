
var enumFSPopupMessageType = {
    "Info": "INFO",
    "Alert": "ALERT",
    "Success": "OK"
};
Object.freeze(enumFSPopupMessageType);


function popupMessage_ShowOneButton(confirmType, primaryMessage, secondaryMessage, btnText, confirmCallback, confirmCallbackObject) {
    var confirmButtonText = btnText;
    var divDialogMain = $('<div />');
    var dialogBody = popupMessage_getMessageContent(primaryMessage, secondaryMessage, confirmType);
    divDialogMain.html(dialogBody);
    // Define the Dialog and its properties.
    divDialogMain.dialog({
        resizable: false,
        modal: true,
        title: "Save",
        height: "auto",
        width: 413,
        buttons: {
            "NO": {
                click: function () {
                    $(this).dialog('close');
                    if (typeof confirmCallback === "function") {
                        console.log("[FORM] [popupMessage_ShowOneButton] [confirmCallback] Callback response: " + confirmCallbackObject);
                        if (confirmCallbackObject !== undefined) {
                            // Execute the positiveCallback function and pass the parameters to it​
                            confirmCallback(confirmCallbackObject);
                        } else {
                            confirmCallback();
                        }
                    } else {
                        console.log("[FORM] [popupMessage_ShowOneButton] [confirmCallback] Non-Callback response: " + confirmCallbackObject);
                    }
                },
                text: confirmButtonText,
                'class': 'vabutton2'
            }
        },
        open: function (event, ui) {
            $('.ui-dialog :button').blur();
        }
    });
}

function popupMessage_ShowTwoButtons(confirmType, primaryMessage, secondaryMessage, btnOK, positiveObject, positiveCallback, btnCancel, negativeObject, negativeCallback) {
    var divDialogMain = $('<div />');
    var dialogBody = popupMessage_getMessageContent(primaryMessage, secondaryMessage, confirmType);
    divDialogMain.html(dialogBody);
    var btnYES = btnOK == null ? "Yes" : btnOK;
    var btnNO = btnCancel == null ? "No" : btnCancel;
    
    // Define the Dialog and its properties.
    divDialogMain.dialog({
        resizable: false,
        modal: true,
        title: "Save",
        height: "auto",
        width: 413,
        buttons: {
            "Yes": {
                click: function () {
                    $(this).dialog('close');
                    if (typeof positiveCallback === "function") {
                        console.log("[FORM] [popupMessage_ShowTwoButtons] [positiveCallback] Callback response: " + positiveObject);
                        // Execute the positiveCallback function and pass the parameters to it​
                        if (positiveObject !== undefined && positiveObject !== null) {
                            positiveCallback(positiveObject);
                        } else {
                            positiveCallback();
                        }
                    } else {
                        console.log("[FORM] [popupMessage_ShowTwoButtons] [positiveCallback] Non-Callback response: " + positiveObject);
                    }
                },
                text: btnYES,
                'class': 'vabutton1'
            },
            "No": {
                click: function () {
                    $(this).dialog('close');
                    if (typeof negativeCallback === "function") {
                        console.log("[FORM] [popupMessage_ShowTwoButtons] [negativeCallback] Callback response: " + negativeObject);
                        // Execute the negativeCallback function and pass the parameters to it​
                        if (negativeObject !== undefined && negativeObject !== null) {
                            negativeCallback(negativeObject);
                        } else {
                            negativeCallback();
                        }
                    } else {
                        console.log("[FORM] [popupMessage_ShowTwoButtons] [negativeCallback] Non-Callback response: " + negativeObject);
                    }
                },
                text: btnNO,
                'class': 'vabutton2'
            }
        },

        open: function (event, ui) {
            $('.ui-dialog :button').blur();
        }
    });
}


function popupMessage_getMessageContent(primaryMessage, secondaryMessage, confirmType) {
    var confirmTypeClass = "dialog__icon--alert";
    
    if (confirmType == enumFSPopupMessageType.Success) {
        confirmTypeClass = "dialog__icon--checkmark";
    }
    else if (confirmType == enumFSPopupMessageType.Info) {
        confirmTypeClass = "dialog__icon--info";
    }

    var dialogHeaderIcon = $("<div/>", { "class": "dialog__icon" });
    dialogHeaderIcon.addClass(confirmTypeClass);
    var dialogHeader = $("<div/>", { "class": "dialogHeader" });
    dialogHeader.append(dialogHeaderIcon);
    var dialogContent = $("<div/>", { "class": "dialogFont" });
    var dialogPrimary = $("<div/>", { "class": "primary" });
    var dialogSecondary = $("<div/>", { "class": "secondary" });
    dialogPrimary.html(primaryMessage);
    dialogPrimary.append('<br /><br />');
    dialogSecondary.html(secondaryMessage);
    dialogContent.append(dialogPrimary);
    dialogContent.append(dialogSecondary);

    var dialogBody = $('<div />');
    dialogBody.html(dialogHeader);
    dialogBody.append(dialogContent);
    return dialogBody.html();
}

