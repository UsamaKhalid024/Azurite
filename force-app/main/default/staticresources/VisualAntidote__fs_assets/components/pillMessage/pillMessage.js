
var enumFSPillMessageType = {
    "Error": "Error",
    "Success": "Success"
};
Object.freeze(enumFSPillMessageType);


function showPillMessage_Error(pMessage, pShowCloseButton, pPillComponentElem) {
    showPillMessage(pMessage, enumFSPillMessageType.Error, pShowCloseButton,pPillComponentElem);
}

function showPillMessage_Success(pMessage, pShowCloseButton,pPillComponentElem) {
    showPillMessage(pMessage, enumFSPillMessageType.Success, pShowCloseButton,pPillComponentElem);
}

function showPillMessage(pMessage, pMessageType, pShowCloseButton, pPillComponentElem) {

    var cssMessageType = 'wrong_error_type';
    switch (pMessageType) {
        case enumFSPillMessageType.Error:
            cssMessageType = 'fs_pillmessage--error';
            break;
        case enumFSPillMessageType.Success:
            cssMessageType = 'fs_pillmessage--success';
            break;
    }

    var pillMessage = $('<div />');
    $(pillMessage).addClass('fs_pillmessage');
    $(pillMessage).hide();
    $(pillMessage).addClass(cssMessageType);

    var pillMessage__Text = $('<div />');
    $(pillMessage__Text).addClass('fs_pillmessage__text');
    $(pillMessage__Text).append(pMessage);
    if ($(pillMessage__Text).text().length > 75) {
        $(pillMessage__Text).addClass('fs_pillmessage__text--right');
    } else {
        $(pillMessage__Text).addClass('fs_pillmessage__text--center');
    }
    $(pillMessage).append(pillMessage__Text);

    if (pShowCloseButton != false) {
        var pillMessage__CloseIcon = $('<button />', { 'type': 'button' });
        $(pillMessage__CloseIcon).addClass('fs_pillmessage__closeIcon');
        $(pillMessage__CloseIcon).click(function () {
            hidePillMessage(this);
        });
        $(pillMessage).append(pillMessage__CloseIcon);
    }
    var pillComponentElem = $('.fs_pillmessage_cmp');
    if(pPillComponentElem!='undefined' && pPillComponentElem!=null){
        pillComponentElem = pPillComponentElem;
    }else{
        pillComponentElem= $('.fs_pillmessage_cmp');
    }
    $(pillComponentElem).html('');
    $(pillComponentElem).append(pillMessage);
    $(pillComponentElem).find('.fs_pillmessage').slideDown();

}

function hidePillMessage(thisElem) {
    var pillMessageElem = $('.fs_pillmessage');
    if(pillMessageElem.length>1){
        // if there are more then one then get the parent one
        var pillMessageElemAsParent = $(thisElem).parents('.fs_pillmessage');
        if(pillMessageElemAsParent.length==1){
            $(pillMessageElemAsParent).slideUp();
        }
    }else{
        $(pillMessageElem).slideUp();
    }
}


