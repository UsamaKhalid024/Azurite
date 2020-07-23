

function getFormStyleList() {
    console.log('[getFormStyleList] Starts...');
    formStyleListCall();
    FS_EnableClick();
}

/*Polpulate form poreview in Preview pane on left side of the style editor*/
function populatePreviewPage(formpreviewurl, cssLinksArray) {
    
    loadingDeafultView(true);
    
    CreateIframe('stylePreviewDiv', 'fastformsiframeWrapper', 'fastformsiframe', formpreviewurl, cssLinksArray);
    CreateIframe('stylePreviewMobileDiv', 'fastformsiframeMobileWrapper', 'fastformsiframeMobile', formpreviewurl, cssLinksArray);
    
    
    applyDefaultTheme(true, true);
    
    loadingDeafultView(false);
}
/*Create firame for mobile and desktop preview*/
function CreateIframe(containerDivid, iframeWrapperid, iframeid, formpreviewurl, cssLinksArray) {
    $('#' + containerDivid).append('<div   id="' + iframeWrapperid + '"    />');
    
    var iframeMobile = $('<iframe   id="' + iframeid + '" src="' + formpreviewurl + '"   />').appendTo($('#' + iframeWrapperid)).on('load', function () {
        
        setTimeout(function () { iResize(iframeid); }, 50);
        $(this).contents().find('body').find('link').remove();
        $(this).contents().find('body').find("#dvFastForms").wrap("<div class='ff-iframe-container'></div>");
        if (cssLinksArray !== undefined && cssLinksArray.length > 0) {
            var iframeElement = $(this);
            $.each(cssLinksArray, function (index, linkurl) {
                $(iframeElement).contents().find('head').append($("<link/>", {
                    rel: "stylesheet",
                    href: linkurl,
                    type: "text/css"
                }));
            });
        }
        
    });
    
    resetIframeLayoutInitial(iframeid, containerDivid);
    
}
function iResize(iframeid) {
    document.getElementById(iframeid).style.height =
        document.getElementById(iframeid).contentWindow.document.body.offsetHeight + 'px';
    
}


/*populate tiles in available theme list */
function populateAvailableThemeList(themeObjectList) {
    var adHocAvailable = false;
    var customThemesAvailable = false;
    var $seperatorDiv = $('<div />', {
        'class': 'div-theme-list-seperator'
    });
    var $ulItemStandard = $('<ul />', {
        'class': 'standard-theme-list-ul sfff-theme-list'
    });
    var $ulItemCustom = $('<ul />', {
        'class': 'custom-theme-list-ul sfff-theme-list'
    });
    var $ulItemAdhoc = $('<ul />', {
        'class': 'adhoc-theme-list-ul sfff-theme-list'
    });
    
    themeObjectList = sortJsonResults(themeObjectList, 'type', true);

    var classicDefaultStyleName = 'Formstack Light (Default)';
    if (themeObjectList != 'undefined' && themeObjectList.length > 0) {
        $.each(themeObjectList, function (index, theme) {
            if (theme != 'undefined') {
                var vThemeName = SetInputValue(theme.name);
                var liItem = $('#tempTemplateTile').clone();
                
                var longthemename = '';
                var shortthemename = '' + vThemeName;
                if (shortthemename.length > 0) {
                    if (shortthemename.length > 9) {
                        $(liItem).find(".template-name").addClass("blue-tooltip");
                        
                        longthemename = shortthemename;
                        shortthemename = shortthemename.substring(0, 7) + '...';
                        $(liItem).find(".template-name").html("<span class='blue-tooltip-text mt0'>" + longthemename + "</span>" + shortthemename);
                    }
                    else {
                        $(liItem).find(".template-name").html(shortthemename);
                    }
                }
                if (theme.isselected) {
                    $(liItem).find('>ul>li').addClass('ff-template-selected');
                }
                else {
                    $(liItem).find('>ul>li').removeClass('ff-template-selected');
                }
                if (theme.tile != undefined) {
                    $(liItem).find('.rectangular-tile').html(theme.tile);
                }
                
                $(liItem).find('.rectangular-tile').attr('data-theme-id', theme.id);
                
                if(theme.type == 'Standard' && vThemeName == classicDefaultStyleName){
                    $(liItem).find('.template-tile-delete').remove();
                    $ulItemStandard.prepend($(liItem).find('>ul').html());
                } else if (theme.type == 'Standard') {
                    $(liItem).find('.template-tile-delete').remove();
                    $ulItemStandard.append($(liItem).find('>ul').html());
                } else if (theme.type == 'Custom' ) {
                    customThemesAvailable = true;
                    $(liItem).find('.template-tile-delete').attr('data-theme-id', theme.id);
                    $(liItem).find('.template-tile-delete').attr('data-theme-name', vThemeName);
                    $(liItem).find('.template-tile-delete').attr('data-theme-type', theme.type);
                    $ulItemCustom.append($(liItem).find('>ul').html());
                } else {
                    adHocAvailable = true;
                    $(liItem).find('.template-tile-delete').attr('data-theme-id', theme.id);
                    $(liItem).find('.template-tile-delete').attr('data-theme-name', vThemeName);
                    $(liItem).find('.template-tile-delete').attr('data-theme-type', theme.type);
                    $ulItemAdhoc.append($(liItem).find('>ul').html());
                }
            }
        });
    }
    destroyJspScrollpane('.available-themes-main-wrapper');
    $('.available-themes-main-wrapper').html('');
    if (adHocAvailable) {
        console.log('  debug js 136');
        
        $('.available-themes-main-wrapper').append($ulItemAdhoc);
        $('.available-themes-main-wrapper').append($('<div />', { 'class': 'div-theme-list-seperator' }));
        $('.available-themes-main-wrapper').append($ulItemCustom);
        $('.available-themes-main-wrapper').append($seperatorDiv);
    }
    else if (customThemesAvailable) {
        $('.available-themes-main-wrapper').append($ulItemCustom);
        $('.available-themes-main-wrapper').append($seperatorDiv);
    }
        else {
            
        }
    $('.available-themes-main-wrapper').append($ulItemStandard);
    
    
    $('.sfff-expand-template-list').slideDown(100, function () {
        
        $('.available-themes-main-wrapper').jScrollPane({
            
            stickToBottom: true,
            maintainPosition: true,
            verticalGutter: 0,
            mouseWheelSpeed: 60
        });
        
        $('.available-themes-main-wrapper').find('.jspContainer').css("width", 348);
    });
}

function createJSONThemeObject(themeid, themename, themetype) {
    var dataobj = {
        "id": themeid,
        "name": themename,
        "type": themetype
    };
    
    
    return dataobj;
}
function themeObjectJSON(themeid, themename, themetype, isselected, tilepreview) {
    var dataobj = {
        "id": themeid,
        "name": themename,
        "type": themetype,
        "isselected": isselected,
        "tile": tilepreview
        
    };
    
    
    return dataobj;
}

/*expand available template list block by calling remoteAvailabeleThemeLists method */
function expandTemplateList(elementSource, remoteCall) {
    if ($(elementSource).hasClass('expanded')) {
        collapseAvailableThemeList();
        
    } else {
        
        collapseAccordionPanels();
        $(elementSource).addClass('expanded');
        if (remoteCall) {
            console.log(' Calling remote method...');
            remoteAvailabeleThemeLists();
        }
    }
}
function collapseAvailableThemeList() {
    $('a.expand-templates-trigger').removeClass('expanded');
    $('.sfff-expand-template-list').slideUp(100);
    
    $('.sfff-expand-template-list').find('.available-themes-main-wrapper').html('');
}
/* show and hide the loading gear */
function loadingDeafultView(isloading) {
    if (isloading) {
        
        $('#stylePreviewDiv').fadeOut(function () {
            
            $('#stylePreviewDivLoading').fadeIn();
        });
    } else {
        $('#stylePreviewDivLoading').fadeOut(function () {
            
            $('#stylePreviewDiv').fadeIn();
        });
    }
}
function resetIframeLayoutInitial(iframeid, containerid) {
    
    
    
    var height = $('#' + iframeid).contents().find("body").outerHeight();
    $('#' + iframeid).contents().find("body").find('#dvBannerHTML >style').remove();
    
    var width = $('#' + containerid).width();//
    
    setIframeLayout(iframeid, width, height);
}



function changeLayout(elementSource) {
    if ($(elementSource).hasClass('desktop-icon')) {
        /*show desktop view */
        $(elementSource).addClass('mobile-icon');
        $(elementSource).removeClass('desktop-icon');
        $(elementSource).find('span.blue-tooltip-text').text("Mobile View");
        $('#stylePreviewMobileDiv').hide();
        $('#stylePreviewDiv').show();
        
    } else {
        /*show Mobile view */
        
        $(elementSource).removeClass('mobile-icon');
        $(elementSource).addClass('desktop-icon');
        $(elementSource).find('span.blue-tooltip-text').text("Desktop View");
        
        $('#stylePreviewMobileDiv').show();
        $('#stylePreviewDiv').hide();
        
    }
    
}


/* destroy custom scroll bar */
function destroyJspScrollpane(element) {
    
    var container = $(element);
    var api = container.data('jsp');
    if (api !== null && api !== undefined) {
        api.destroy();
    }
}

function setIframeLayout(id, containerWidth, containerHeight) {
    var ifrm = document.getElementById(id);
    var doc = ifrm.contentDocument ? ifrm.contentDocument :
    ifrm.contentWindow.document;
    ifrm.style.visibility = 'hidden';
    
    ifrm.style.height = containerHeight + "px";
    ifrm.style.width = containerWidth + "px";
    ifrm.style.visibility = 'visible';
}
/* trigger template change action - prompt for confirmation if current template is an Ad-hoc template*/

/* change template and apply theme accordingly */
function templateClickCallBack(elementSource, override) {
    if (override) {
        var addClass = true;
        if ($(elementSource).parents('.tile-li').hasClass('ff-template-selected')) {
            
            addClass = false;
        }
        
        
        
        $('ul.sfff-theme-list>li.tile-li').each(function (index, liElement) {
            $(liElement).removeClass('ff-template-selected');
            
        });
        
        if (addClass) {
            $(elementSource).parents('.tile-li').addClass('ff-template-selected');
            currentThemeId = $(elementSource).attr('data-theme-id');
            if ($(elementSource).parents('.tile-li').find('.template-tile-delete').length > 0 && $(elementSource).parents('.tile-li').find('.template-tile-delete').attr('data-theme-type').toLowerCase() == 'ad-hoc') {
                isCurrentThemeAdhoc = true;
                
            }
            if (!(currentThemeId === undefined || currentThemeId === '')) {
                applyStyle(currentThemeId, elementSource, true);
            }
        } else {
            applyDefaultTheme(true, false);
        }
    }
}


/* call to remote method to get theme css and apply to preview pane */
function applyStyle(themeid, elementSource, autoSave) {
    
    getRemoteThemeByIdJs(themeid, elementSource, autoSave);
    
    
}
/* trigger action to change autosave indicator and refresh recent template list (recent 3 templates) */
function callAutoSaveStyle(noTheme, themeid, themedata, iscsstext, isDefault) {
    if (noTheme || themeid == null) {
        console.log(' No theme saved ');
        autoSaveStyle('', '', false, false);
    }
    else {
        console.log('  theme saved - themeid ' + themeid + ' iscsstext ' + iscsstext + '  isDefault ' + isDefault);
        
        autoSaveStyle(themeid, htmlSafeCSS(themedata), iscsstext, isDefault);
    }
    /* refreshformStyleList();*/
    
    
    
}
function htmlSafeCSS(csstext)
{
    if(!isNullOrEmpty(csstext))
    {
        csstext =  csstext.replace(/&amp;/g, "&");
    }
    return csstext;
}
function triggerAutoSaveStyle() {
    draftchanges(false);
}
/* Main method to apply theme to both mobile and desktop view */
function applyTheme(customThemeStyle, iframeCssLink, customThemeStyleIsaLink, isDefault, elementSource, themeid, autoSave) {
    
    $('#fastformsiframe, #fastformsiframeMobile').contents().find("body").find('style').remove();
    $('#fastformsiframe, #fastformsiframeMobile').contents().find("head").find('style').remove();
    $('#fastformsiframe, #fastformsiframeMobile').contents().find("head").find('link').each(function (i, cssLinkElement) {
        var cssLinkhref = $(cssLinkElement).attr('href');
        
        if (cssLinkhref !== undefined && cssLinkhref.length > 0 && cssLinkhref.indexOf('/') >= 0) {
            var cssLinkhref = cssLinkhref.substring(cssLinkhref.lastIndexOf('/') + 1);
            
            
            if (cssLinkhref == "styleeditor_iframecss") {
                $(cssLinkElement).remove();
                // console.log(' css link removed ' + cssLinkhref);
            }
            if (customThemeStyleIsaLink && cssLinkhref == "ffdefaulttheme.css") {
                $(cssLinkElement).remove();
            }
        }
    });
    
    
    
    if (customThemeStyle !== undefined && customThemeStyle != '') {
        customThemeStyle = htmlUnescape(customThemeStyle); 
    }
    else {
        customThemeStyle = '';
    }
    
    $('#fastformsiframe, #fastformsiframeMobile').contents().find("head").append($("<link/>", {
        rel: "stylesheet",
        href: iframeCssLink,
        type: "text/css"
    }));
    if (customThemeStyleIsaLink) {
        console.log(' Theme is a link-themeid' + themeid);
        $('#fastformsiframe, #fastformsiframeMobile').contents().find("head").append($("<link/>", {
            rel: "stylesheet",
            href: customThemeStyle,
            type: "text/css"
        }));
        
        if (themeid != null) {
            
            resetTemplateInAvailabelList(themeid);
            
        }
        if (autoSave) {
            callAutoSaveStyle(true, themeid, '', false, isDefault);
        }
    } else {
        console.log(' Theme is a style block');
        
        
        var customtheme = "<style type='text/css'> " + unescapeCSS(customThemeStyle )+ " </style>";
        $('#fastformsiframe, #fastformsiframeMobile').contents().find("head").append(customtheme);
        
        if (themeid != null) {
            
            resetTemplateInAvailabelList(themeid);
            
        }
        if (autoSave) {
            callAutoSaveStyle(false, themeid, unescapeCSS(customThemeStyle ), true, isDefault);
        }
    }
    
    
    
    
}
/*reset available list to show currently selected theme */
function resetTemplateInAvailabelList(themeid) {
    
    $('.available-themes-main-wrapper ul.sfff-theme-list > li.tile-li').removeClass('ff-template-selected');
    $('.available-themes-main-wrapper ul.sfff-theme-list > li.tile-li').each(function (index, liElement) {
        if ($(liElement).find('div.rectangular-tile').length > 0 && $(liElement).find('div.rectangular-tile').attr('data-theme-id') == themeid) {
            
            currentThemeId = $(liElement).find('.rectangular-tile').attr('data-theme-id');
            
            console.log(' theme type -' + $(liElement).find('.template-tile-delete').attr('data-theme-type'));
            if ($(liElement).find('.template-tile-delete').length > 0 && $(liElement).find('.template-tile-delete').attr('data-theme-type').toLowerCase() == 'ad-hoc') {
                isCurrentThemeAdhoc = true;
                
            }
            $(liElement).addClass('ff-template-selected');
            return;
        }
        
    });
    
}


/* sort available theme list  by theme type to show standard themes at the bottom  - json array-*/
function sortJsonResults(jsonObj, prop, asc) {
    jsonObj = jsonObj.sort(function (a, b) {
        if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    });
    return jsonObj;
}

function removeThemeFromList(themeid) {
    $('.custom-theme-list-ul > li.tile-li,.adhoc-theme-list-ul > li.tile-li').each(function (index, liElement) {
        if ($(liElement).find('span.delete-icon').length > 0 && $(liElement).find('span.delete-icon').attr('data-theme-id') == themeid) {
            console.log('removed from list');
            $(this).remove();
            
            return;
        }
        
    });
    cleanEmptyUlinThemeList();
    refreshformStyleList();
}
/*remove ul element when there is no li element in there */
function cleanEmptyUlinThemeList() {
    $('.custom-theme-list-ul,.adhoc-theme-list-ul').each(function (index, ulElement) {
        if ($(ulElement).find('>li.tile-li').length == 0) {
            $(ulElement).nextAll('.div-theme-list-seperator:first').remove();
            $(ulElement).remove();
        }
    });
}


function editCssClick(elementSource) {
    
    var action = '';
    if (isCSSCustom) {
        action = ' Custom CSS ';
    } else {
        action = ' Style Editor';
    }
    /// If condition removed on May 12 2015
    //Before May 12 2015
    //not showing a popup when user switches to CSS editing mode
    //this will change once styling options are offered
    //
    if ($(elementSource).text() == 'Discard Changes')
    {
        
        var dialogBody = "<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>This will discard any CSS changes made to this template.<br /><br />Are you sure you want to do this?<br /></div><div class='secondary'></div></div>";
        
        
        
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
                        var csstoggleflag = true;
                        if ($(elementSource).attr('data-iscsscustom') == 'false') {
                            csstoggleflag = false;
                        }
                        if (isCSSCustom) {
                            /// revert back the custom css changes to default css
                            
                            console.log('revert back the default css changes');
                            // remoteSaveOrSaveAsThemeJs(currentThemeId, false, '',false,'');
                            remoteSaveThemeJs(currentThemeId, false, '', false, false, '', true, generateTileHtml());
                            
                        }
                        else {
                            
                            if (isCurrentThemeAdhoc) {
                                remoteGetCustomThemeByIdJs(currentThemeId, elementSource, true, false, csstoggleflag);
                            }
                            
                            else {
                                remoteCreateThemeJS('Unsaved Template', 'Ad-hoc', '', true, isCSSCustom, true, elementSource, false, generateTileHtml());
                            }
                        }
                        
                        
                        
                    },
                    text: 'Yes',
                    'class': 'vabutton1'
                },
                "No": {
                    click: function () {
                        $(this).dialog('close');
                        
                        editCssCallBack(false, isCSSCustom, '');
                    },
                    text: 'No',
                    'class': 'vabutton2'
                }
                
            },
            open: function (event, ui) {
                $('.ui-dialog :button').blur();
            }
        });
    } else {
        var csstoggleflag = true;
        if ($(elementSource).attr('data-iscsscustom') == 'false') {
            csstoggleflag = false;
        }
        if (isCSSCustom) {
            /// revert back the custom css changes to default css
            
            console.log('revert back the default css changes');
            // remoteSaveOrSaveAsThemeJs(currentThemeId, false, '',false,'');
            remoteSaveThemeJs(currentThemeId, false, '', false, false, '', true, generateTileHtml());
            
        }
        else {
            
            if (isCurrentThemeAdhoc) {
                remoteGetCustomThemeByIdJs(currentThemeId, elementSource, true, false, csstoggleflag);
            }
            
            else {
                remoteCreateThemeJS('Unsaved Template', 'Ad-hoc', '', true, isCSSCustom, true, elementSource, false, generateTileHtml());
            }
        }
    }
    
    
}
/** confirm popup to warn CSS change action*/
function confirmTemplateChange(elementSource) {
    var action = '';
    if (isCSSCustom) {
        action = ' Custom CSS ';
    } else {
        action = ' Style Editor';
    }
    var dialogBody = "<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>Your current template has not been saved. Changing to another template will cause your current unsaved template to be lost. <br /><br />Are you sure you want to do this?<br /></div><div class='secondary'></div></div>";
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
                    var dodelete = false;
                    var tempcurrentThemeId = currentThemeId;
                    if (isThemeIdValid() && isCurrentThemeAdhoc) {
                        dodelete = true;
                    }
                    templateClickCallBack(elementSource, true);
                    
                    deleteCallBack(dodelete, tempcurrentThemeId);
                    
                    
                },
                text: 'Yes',
                'class': 'vabutton1'
            },
            "No": {
                click: function () {
                    $(this).dialog('close');
                    templateClickCallBack(elementSource, false);
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

function editCssCallBack(action, customcssflag, themecss) {
    if (action) {
        if ($('.sfff-style-edit-css').hasClass('display-none')) {
            
            
            if (customcssflag) {
                resetCSSEditor(formatCSS(themecss));
                //$('#styleEditCss').val(formatCSS(themecss));
            }
            customCSSEnable(customcssflag);
        } else {
            customCSSEnable(customcssflag);
            
        }
    } else {
        /// do nothing
        
    }
    
}

function formatCSS(origcss){
    var newcss = origcss.replaceAll("\n","") ;
    newcss=newcss.replace(/&amp;/g,'&');
    newcss=newcss.replace(/&quot;/g,'"');
    
    newcss=newcss.replace(/&#39;/g,'\'');
    newcss=newcss.replace(/&#34;/g,'"');
    newcss=newcss.replace(/&gt;/g,'>');
    
    newcss=newcss.replaceAll('  ',' ');
    newcss = newcss.replaceAll('{'," {\n   ");
    newcss = newcss.replaceAll(';',";\n   ");
    newcss = newcss.replaceAll('}',"}\n");
    return newcss;
    
}

function customCSSEnable(isEnabled) {
    $('.style-editcss-link').attr('data-iscsscustom', isEnabled);
    
    if (isEnabled) {
        
        $('.style-editcss-link').text('Discard Changes');
        $('.sfff-style-settings').addClass('display-none');
        $('.sfff-style-edit-css').removeClass('display-none');
        var csstext=$('#styleEditCss').val();
        //$('#styleEditCss').hide();
        if(CSSEditor===undefined){
            var csstext=$('#styleEditCss').val();
            resetCSSEditor(csstext);
        }
        else{
            
        }
        
    } else {
        $('.style-editcss-link').text('Edit CSS');
        $('.sfff-style-edit-css').addClass('display-none');
        $('.sfff-style-settings').removeClass('display-none');
        
    }
}
function resetCSSEditor(css)
{
    
    if($('#styleEditCss').length>0){
        ace.require("ace/ext/language_tools");
        CSSEditor = ace.edit("styleEditCss");
        CSSEditor.session.setMode("ace/mode/css");
        CSSEditor.setTheme("ace/theme/tomorrow");
        CSSEditor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        CSSEditor.on("blur", function(obj,evt){ 
            
            Intercom('trackEvent', 'edited-css');
            var customcss=evt.getValue();
            console.log('customcss---');
            remoteSaveThemeJs(currentThemeId, false, '',true,false,customcss,true,'');
            
        });
    }
    if(css!==undefined){
        CSSEditor.setValue(css);//
    }
}
function getCSSFromEditor(){
    
    var css='';
    if($('#styleEditCss').length>0){
        ace.require("ace/ext/language_tools");
        CSSEditor = ace.edit("styleEditCss");
        CSSEditor.session.setMode("ace/mode/css");
        CSSEditor.setTheme("ace/theme/tomorrow");
        CSSEditor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        CSSEditor.on("blur", function(obj,evt){ 
            
            Intercom('trackEvent', 'edited-css');
            var customcss=evt.getValue();
            console.log('customcss---');
            remoteSaveThemeJs(currentThemeId, false, '',true,false,customcss,true,'');
            
        });
    }
    css=CSSEditor.getValue();
    return css;
}
function resetRecentTilePreview() {
    
}
function resetAvailableTilePreview() {
    
}

/* Style setting functions starts*/

/*this function is for checkbox list showing as radio button list- to uncheck all other checkboxes from current list  */
function singleSelectCheckElementChange(elemeSource) {
    $(elemeSource).parents('.ffse-propname').find('input[type="checkbox"]').not(elemeSource).prop('checked', false);
    
    styleSettingElementChange(elemeSource);
}
/*to enable/disable width to auto,fixed,full*/
function widthSettingElementChange(elemSource){
    var selectedVal=$(elemSource).select2('val');
    if(!isNullOrEmpty(selectedVal)){
        
        var parentElement=$(elemSource).parents('.ffse-SC-property');
        $(parentElement).find('input.ffse-rangeslider').parent().removeClass('ff-disabled');
        if(selectedVal=='auto'){
            //$(parentElement).find('.ffse-propname').hide();
            $(parentElement).find('input.ffse-rangeslider').val('0');
            $(parentElement).find('input.ffse-rangeslider').parent().addClass('ff-disabled');
            $(parentElement).find('input.ffse-rangeslider').rangeslider('update', true);
        }else if(selectedVal=='full'){
            //$(parentElement).find('.ffse-propname').hide();
            $(parentElement).find('input.ffse-rangeslider').val('0');
            $(parentElement).find('input.ffse-rangeslider').parent().addClass('ff-disabled');
            $(parentElement).find('input.ffse-rangeslider').rangeslider('update', true);
        }else if(selectedVal=='fixed'){
            $(parentElement).find('input.ffse-rangeslider').rangeslider('update', true);
            //$(parentElement).find('.ffse-propname').show();
        }
        styleSettingElementChange(elemSource);
    }
}
/*style settings element change - which calls a callback function to hit autosave for style changes */
function styleSettingElementChange(elemeSource) {    
    var metadata = {
        style_option:$(elemeSource).attr('data-ffstyle-selector') + ' ' + $(elemeSource).attr('data-ffstyle-prop')
    };
    Intercom('trackEvent', 'edited-style-option', metadata);
    if (isThemeIdValid() && isCurrentThemeAdhoc) {
        styleSettingsChangeCallBack(elemeSource);
    }
    else {
        
        var themeid = currentThemeId;
        
        /*var dialogBody = "<div class='dialogHeader'><div class='dialogIcon dialogIconAlert'>&nbsp;</div></div><div class='dialogFont'><div class='primary'>Any change made to this template will create a new Ad-hoc template and new changes will be assigned to that template.</div><div class='secondary'> </div></div>";
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
                    click: function() {
                        $(this).dialog('close');

                        remoteCreateThemeJS('Unsaved Template', 'Ad-hoc', '', true, false, false, elemeSource,true, generateTileHtml());

                    },
                    text: 'Save Template',
                    'class': 'vabutton1'
                },
                "No": {
                    click: function() {
                        $(this).dialog('close');

                    },
                    text: 'Cancel',
                    'class': 'vabutton2'
                }

            },
            open: function(event, ui) {
                $('.ui-dialog :button').blur();
            }
        });
        */
        remoteCreateThemeJS('Unsaved Template', 'Ad-hoc', '', true, false, false, elemeSource, true, generateTileHtml());
    }
    
    
    
}
/* main function which parse the style elements and current theme's CSS to further call autosave */
function styleSettingsChangeCallBack(elemeSource) {
    console.log(' Style Change hit');
    /*var selector=$(elemeSource).attr('data-ffstyle-selector');
        var directive=$(elemeSource).attr('data-ffstyle-prop');
        var propvalue=$(elemeSource).val();
      */
    var jsonCSS = [];
 $(elemeSource).parents('.sfff-theme-accordion').find('.ffse-propname input.ffse-colorpicker,.ffse-propname input.ffse-rangeslider,.ffse-propname input.ffse-prop-chk,.ffse-propname input.ffse-prop-radiochk,.ffse-propname select.ffse-prop-fontstyle,.ffse-propname select.ffse-prop-borderstyle,.ffse-propname input.ffse-fileUpload-control,  .ffse-propname input.ffse-img-hidden').each(function (index, styleelement) {
        
        var selector = $(styleelement).attr('data-ffstyle-selector');
        var directive = $(styleelement).attr('data-ffstyle-prop');
        var propvalue;//=$(styleelement).val();
        var removeProp = false;
        var checkvalue = false;
        console.log('selector- ' + selector + ' directive- ' + directive);
        /*if (directive=="background-image-removed")
        {
            propvalue='';
            removeProp=true;
            directive = "background-image";
            $(styleelement).remove();
        }*/
        
        if (styleelement.type == 'checkbox') {
            checkvalue = true;
            if ($(styleelement).is(":checked")) {
                propvalue = $(styleelement).val();
            }
            else {
                propvalue = $(styleelement).val();
                removeProp = true;
            }
        }
        else if ($(styleelement).hasClass('ffse-fileUpload-control')) {
            var imgElement = $(styleelement).parents('.ffse-file-upload-container').find('img.ffse-uploaded-img');
            if ($(imgElement) != undefined && $(imgElement).length > 0 && $(imgElement).attr('src') != '') {
                var url = $(imgElement).attr('src');
                url=url.replace(/&amp;/g, '&');
                console.log(' Image url-' + url);
                propvalue = "url(" + url + ")";
            }
            else {
                propvalue = '';
                removeProp = true;
            }
            console.log('Element is an image' + propvalue);
        }
            else if ($(styleelement).hasClass('ffse-img-hidden')) {
                
                propvalue = $(styleelement).val();
                console.log(' reset image width and height property'+directive+'  -- '+propvalue);
                if (propvalue != null && propvalue != '' )
                {
                    removeProp = false;
                }
                else
                {
                    propvalue = '';
                    removeProp = true;
                }
            }
                else if (styleelement.type == 'select-multiple' || styleelement.type == 'select-one') {
                    console.log(' Select option ');
                    if ($(styleelement).find('option:selected').attr('value') != undefined) {
                        var  propvalueArr = $(styleelement).val();
                        if(propvalueArr instanceof Array)
                        {
                            if($(styleelement).select2('data').length>0){
                                var optionArr=[];
                                $.each($(styleelement).select2('data'),function(si,objElem){
                                    optionArr.push(objElem.id);
                                });
                                propvalue= arrayToStringRemoveWhiteSpaces(optionArr);
                            }else{
                                propvalue= arrayToStringRemoveWhiteSpaces(propvalueArr);
                            }
                        }else{
                            propvalue= propvalueArr;
                        }
                    }
                    else {
                        propvalue = '';
                    }
                }
                    else {
                        
                        
                        propvalue = $(styleelement).val();
                        if ($(styleelement).hasClass('ffse-rangeslider') && $(styleelement).attr('data-slider-nonzero') != undefined && $(styleelement).attr('data-slider-nonzero') == 'true' && propvalue == $(styleelement).attr('min')) {
                            console.log(' Remove non-zero value if it is zero- Element-  ' + selector + ' prop- ' + directive + '-- value- ' + $(styleelement).val());
                            removeProp = true;
                            var selectElement=$(styleelement).parents('.ffse-SC-property').find('select');
                            if($(selectElement).length>0)
                            {
                                var selectedval=$(selectElement).select2('val');
                                if(!isNullOrEmpty(selectedval) && selectedval=='full'){
                                    removeProp = false;
                                    propvalue='100%';
                                }
                            }
                            
                        }
                        else {
                            console.log(' Do not Remove non-zero value if it is zero- Element- ' + propvalue);
                            removeProp = false;
                        }
                    }
        
        var cssProperty = null;
        if (propvalue != null && propvalue != '' && propvalue != '#' && !removeProp) {
            console.log(' add directive-' + directive);
            cssProperty = createCSSProperty(selector, directive, propvalue, false, checkvalue);
            
        }
        else if (propvalue != null && removeProp) {
            console.log(' Remove directive-' + directive);
            cssProperty = createCSSProperty(selector, directive, propvalue, true, checkvalue);
            
        }
        if (cssProperty != null) {
            
            jsonCSS.push(cssProperty);
        }
    });
    
    
    var jsonstr = '';
    var jsonStyleTemp = groupByCSS(jsonCSS);
    //var currentThemeJsonDataTemp = groupByCSS(currentThemeJsonData);
    //mergeStyleJSON(currentThemeJsonDataTemp, jsonStyleTemp);

    //var themeDataTemp = $.merge($.merge([], currentThemeJsonDataTemp), jsonStyleTemp);
    
    var finalJSONArr =getUniqueArray(jsonStyleTemp); //getUniqueArray(groupByCSS(themeDataTemp));// removed on June 19 to just save the new CSS instead of updating css in salesforce
    var styleElementSTR = '';
    $.each(finalJSONArr, function (index, jsonCSSelement) {
        
        
        
        var cssProp = '';
        $.each(jsonCSSelement.rules, function (index, jsonCSSrule) {
            if (!jsonCSSrule.remove) {
                console.log(' rule value - '+jsonCSSrule.value);
                cssProp += ' ' + jsonCSSrule.directive + ':' + unescapeCSS(jsonCSSrule.value) + ';';
                console.log(' unescaped - rule value - '+unescapeCSS(jsonCSSrule.value));
            }
        });
        if (cssProp != '') {
            styleElementSTR += ' ' + jsonCSSelement.selector + ' {';
            styleElementSTR += cssProp;
            styleElementSTR += ' }';
        }
        
        
    });
    
    var tileHtml = generateTileHtml();
    
    /*call to save theme method which save the theme with provided css and then a callback function in remoteSaveThemeJs response calls to applytheme which then apply style to preview pane */
    remoteSaveThemeJs(currentThemeId, false, '', false, true, styleElementSTR, true, tileHtml);
}
function arrayToStringRemoveWhiteSpaces(actual)
{
    try{
        var newArray = new Array();
        for(var i = 0; i<actual.length; i++)
        {
            if (actual[i])
            {
                newArray.push(actual[i]);
            }
        }
        return newArray.join(',');
    }
    catch(err){
        
    }
    return '';
}
function unescapeCSS(cssstr)
{
    var safecss= cssstr;
    if(!isNullOrEmpty(cssstr))
    {
        safecss= cssstr.replace(/&#39;/g, '\'');
        safecss=safecss.replace(/&#34;/g, '"');
        safecss=safecss.replace(/&quot;/g, '"'); 
        safecss=safecss.replace(/&amp;/g,'&');
        safecss=safecss.replace(/&quot;/g,'"'); 
        safecss=safecss.replace(/&gt;/g,'>');
    }
    return safecss;
}

function createCSSProperty(propselectorSTR, propdirective, propval, removed, checkvalue) {
    var propselector = '';
    var cssProperty = null;
    if (propselectorSTR.indexOf('dvFastForms') < 1 && propselectorSTR.indexOf('.ff-form') < 0 && propselectorSTR.indexOf('.ff-header') < 0 && propselectorSTR.indexOf('.ff-logo') < 0) {
        if (propselectorSTR.indexOf(',') > 0) {
            var propselectorarr = propselectorSTR.split(',');
            $.each(propselectorarr, function (index) {
                if (index > 0) {
                    propselector += ",";
                }
                
                propselector += '#dvFastForms ' + propselectorarr[index];
                
                
            });
        }
        else {
            propselector = '#dvFastForms ' + propselectorSTR;
        }
    }
    else {
        propselector = propselectorSTR;
    }
    
    var cssrules = [];
    var directivearr = propdirective.split(';');
    var propvalarr = propval.split(';');
    if (directivearr.length > 0 && propvalarr.length > 0 && propvalarr.length == directivearr.length) {
        /* this block checks for multiple css rule directives and values then parse them  and generate an array of rules */
        $.each(directivearr, function (index) {
            cssrules.push(createCSSRule(directivearr[index], propvalarr[index], removed, checkvalue));
            
        });
        
        
        
        cssProperty = { "selector": propselector, "rules": cssrules };
    }
    return cssProperty;
}
function createCSSRule(propdirective, propval, removed, checkValue) {
    propval = addPXToCssElements(propdirective, propval);
    var cssRule = { "directive": propdirective, "value": propval, "remove": removed, "checkvalue": checkValue };
    return cssRule;
}
function addPXToCssElements(pdirective, pvalue) {
    
    if ((pdirective == 'margin'  &&  isInt(pvalue)) || pdirective == 'padding' || (pdirective.match(/width$/) != null  &&  isInt(pvalue))  || pdirective.match(/height$/) != null || (pdirective.match(/size$/) != null && pdirective != 'background-size')) {
        
        pvalue = pvalue + 'px';
    }
    
    return pvalue;
}
function removePXFromCssElements(pdirective, pvalue) {
    var defaultvalue = pvalue;
    
    if ((pdirective == 'margin' && pvalue.indexOf('px')>0) || pdirective == 'padding' || (pdirective.match(/width$/) != null  &&  isInt(pvalue)) || pdirective.match(/height$/) != null || (pdirective.match(/size$/) != null && pdirective != 'background-size')) {
        defaultvalue = defaultvalue.replace('px', '');
    }
    return defaultvalue;
}
/*decides if css property value is displayed as range slider  */
function isSliderJSON(elementSource, pdirective, pvalue) {
    var returnValueJSON = {};
    var israngeslider = false;
    if ($(elementSource).hasClass('ffse-rangeslider')) {
        israngeslider = true;
    }
    
    if (israngeslider && (pdirective == 'margin'    || pdirective == 'padding' || pdirective.match(/width$/) != null || pdirective.match(/height$/) != null || (pdirective.match(/size$/) != null && pdirective != 'background-size'))) {
        pvalue = pvalue.replace('px', '');
        
        returnValueJSON = { "isSlider": true, "isValueInPX": false, "value": pvalue };
    }
    else {
        returnValueJSON = { "isSlider": false, "isValueInPX": true, "value": pvalue };
    }
    
    return returnValueJSON;
}

function isInt(value){ 
    if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
        return true;
    } else { 
        return false;
    } 
}
function arrayUnique(jsonarrRules) {
    var uniqueRules = [];
    
    $.each(jsonarrRules, function (idx, jsonRuleelement) {
        var notmerged = true;
        for (i = 0; i < uniqueRules.length; i++) {
            if (jsonRuleelement.directive == uniqueRules[i].directive) {
                if ((jsonRuleelement.checkvalue === undefined) || (!jsonRuleelement.checkvalue)) {
                    notmerged = false;
                }
            }
            
        }
        if (notmerged) {
            uniqueRules.push(jsonRuleelement);
        }
    });
    
    return uniqueRules;
}

/**merge currentheme css array and new style changes array - also set a flag if any property needs to be removed*/

function mergeStyleJSON(mainStyle, styleChanges) {
    
    $.each(mainStyle, function (index, jsonCSSelement) {
        
        
        $.each(styleChanges, function (index, styleElement) {
            if (jsonCSSelement.selector.toLowerCase() == styleElement.selector.toLowerCase() && jsonCSSelement.rules != undefined) {
                
                
                
                
                var itemToberemoved = [];
                for (var i = jsonCSSelement.rules.length - 1; i--;) {
                    itemToberemoved.push(i);
                    
                    
                    $.each(styleElement.rules, function (index, styleElementRule) {
                        if (jsonCSSelement.rules[i] != undefined && jsonCSSelement.rules[i].directive == styleElementRule.directive && jsonCSSelement.rules[i].value == styleElementRule.value) {
                            
                            if (styleElementRule.remove) {
                                console.log('Removing:' + jsonCSSelement.rules[i].directive + '(' + itemToberemoved[i] + ')');
                                jsonCSSelement.rules.splice(i, 1);
                                //i--;
                            }
                            
                            
                        }
                        else if (jsonCSSelement.rules[i] != undefined && jsonCSSelement.rules[i].directive == styleElementRule.directive && jsonCSSelement.rules[i].value != styleElementRule.value && !styleElementRule.checkvalue) {
                            console.log(' Updating prop value- ' + jsonCSSelement.rules[i].directive);
                            jsonCSSelement.rules[i].value = styleElementRule.value;
                        }
                    });
                }
            }
            else {
                
            }
        });
        
    });
    
    $.each(styleChanges, function (index, styleElement) {
        for (var i = styleElement.rules.length - 1; i--;) {
            
            if (styleElement.rules[i].remove) {
                
                styleElement.rules.splice(i, 1);
            }
        }
    });
    
}

function getUniqueArray(mainStyle) {
    var uniqueStyle = [];
    $.each(mainStyle, function (index, jsonCSSelement) {
        
        var cssrules = [];
        for (var i = 0; i < jsonCSSelement.rules.length; i++) {
            
            if (jsonCSSelement.rules[i] != undefined) {
                
                if (!checkIfJsonObjExists(jsonCSSelement.rules[i], cssrules)) {
                    cssrules.push(jsonCSSelement.rules[i]);
                }
                
                
            }
        }
        var cssProperty = { "selector": jsonCSSelement.selector, "rules": cssrules };
        uniqueStyle.push(cssProperty);
        
    });
    return uniqueStyle;
}
function checkIfJsonObjExists(obj, objs) {
    var objStr = JSON.stringify(obj);
    
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].directive == obj.directive && objs[i].value == obj.value) {
            return true;
        }
    }
    
    return false;
}
/*group css property rules to one single selector css property */
function groupByCSS(jsonCSS) {
    var jsonarr = [];
    var jsonarrRules = [];
    var addProp = true;
    
    $.each(jsonCSS, function (index, jsonCSSelement) {
        addProp = true;
        var cssrules = [];
        if (jsonarr.length > 0) {
            $.each(jsonarr, function (idx, jsonArrelement) {
                if (jsonArrelement.selector != undefined && jsonArrelement.selector == jsonCSSelement.selector) {
                    //if same selector exists
                    $.each(jsonCSSelement.rules, function (idx, jsonCSSrule) {
                        jsonArrelement.rules.push(jsonCSSrule);
                    });
                    addProp = false;
                }
                
            });
        }
        
        if (addProp) {
            cssrules = jsonCSSelement.rules;
            var cssProperty = { "selector": jsonCSSelement.selector, "rules": cssrules };
            jsonarr.push(cssProperty);
        }
    });
    return jsonarr;
}

function resetAllStyleElements() {
    $('.ffse-setting-card-container').find('.ffse-setting-card').find('.ffse-propname input.ffse-colorpicker,.ffse-propname input.ffse-rangeslider,.ffse-propname input.ffse-prop-chk,.ffse-propname input.ffse-prop-radiochk,.ffse-propname select.ffse-prop-fontstyle,.ffse-propname select.ffse-prop-borderstyle, .ffse-propname input.ffse-fileUpload-control,.ffse-propname input.ffse-img-hidden').each(function (index, elementSource) {
        var directive = $(elementSource).attr('data-ffstyle-prop');
        if (elementSource.type == 'select-multiple' || elementSource.type == 'select-one') {
            $(elementSource).select2('destroy');
            $(elementSource).val('');
        }
        else if (elementSource.type == 'checkbox') {
            $(elementSource).prop('checked', false);
        } else if (elementSource.type == 'file') {
            
            console.log(' File type reset ');
            var parentElement = $(elementSource).parents('.ffse-file-upload-container');
            resetFileTypeControls(parentElement);
            $(elementSource).replaceWith($(elementSource).clone(true).val(''));
            
        }  else {
            
            var elementDataJson = isSliderJSON(elementSource, directive, '');
            if (elementDataJson.isSlider) {
                destroyRandgeSlider(elementSource);
            }
            else if ($(elementSource).hasClass('ffse-colorpicker')) {
                //console.log(' Color picker reset ');
                $(elementSource).removeAttr('style');
                $(elementSource).val('');
            } else {
                
                $(elementSource).val('');
            }
        }
    });
    
    populateFontFamily();
    populateBorderStyle();
    intializeNumericSliders();
}

function resetFileTypeControls(elementSourceParent) {
    $(elementSourceParent).find('.ffse-img-uploaded').hide();
    $(elementSourceParent).find('.ffse-img-uploading').hide();
    $(elementSourceParent).find('.ffse-img-input-container').show();
    $(elementSourceParent).find('.ffse-img-upload-placeholder').html('');
    $(elementSourceParent).find('.ffse-img-upload-placeholder').hide();
    resetImageDimensions(elementSourceParent, '', '');
}
function destroyRandgeSlider(elementSource) {
    $(elementSource).removeAttr('style');
    $(elementSource).parents('.ffse-propname').find('.rangeslidercontainer').remove();
}
/** main function to populate style settings elements */

function populateFormStyleSettings(themeObj, elementSource, autoSave) {

    $('.sfff-theme-accordion').find('.fs-width-controls select.ffse-sel-element').each(function (index, elementSource) {
        $(elementSource).select2();
    });

    resetAllStyleElements();
    var themescss = themeObj.ThemeCSS;
    if (themescss != undefined) {
        themescss = themescss.replace(/&amp;/g, '&');
    }
    else {
        themescss = '';
    }
    var parser = new cssjs();
    //parse css string to JSON array
    var jsonCSS = parser.parseCSS(themescss);
    currentThemeJsonData = jsonCSS;
    $.each(jsonCSS, function (index, jsonCSSelement) {
        
        $('.sfff-theme-accordion').find('.ffse-setting-card').find('.ffse-propname input.ffse-colorpicker,.ffse-propname input.ffse-rangeslider,.ffse-propname input.ffse-prop-chk,.ffse-propname input.ffse-prop-radiochk,.ffse-propname select.ffse-prop-fontstyle,.ffse-propname select.ffse-prop-borderstyle, .ffse-propname input.ffse-fileUpload-control,.ffse-propname input.ffse-img-hidden').each(function (index, elementSource) {
            var selector = '';
            var selectortemp = $(elementSource).attr('data-ffstyle-selector');
            if (selectortemp.indexOf(',') > 0) {
                var propselectorarr = selectortemp.split(',');
                $.each(propselectorarr, function (index) {
                    if (index > 0) {
                        selector += ",";
                    }
                    
                    selector += '#dvFastForms ' + propselectorarr[index];
                    
                    
                });
            }
            else {
                selector = selectortemp;
            }
            var escapedselector=selector.replace(/>/g,'&gt;');
            if (!isNullOrEmpty(selector) && (jsonCSSelement.selector == selector || jsonCSSelement.selector == '#dvFastForms ' + selector || jsonCSSelement.selector == escapedselector || jsonCSSelement.selector == '#dvFastForms ' + escapedselector) ){
                
                $.each(jsonCSSelement.rules, function (index, jsonCSSrule) {
                    var directive = $(elementSource).attr('data-ffstyle-prop');
                    if (jsonCSSrule != undefined && jsonCSSrule.directive != undefined) {
                        if (hasMultipleRules(elementSource)) {
                            /*multi rule css condition */
                            
                            var directivearr = directive.split(';');
                            $.each(directivearr, function (index) {
                                processSingleCssRule(elementSource, jsonCSSrule, directivearr[index]);
                            });
                        } else {
                            processSingleCssRule(elementSource, jsonCSSrule, directive);
                        }
                    }
                });
            }
            else{
                /*selector is empty*/
            }
        });
    });
}
function processSingleCssRule(elementSource, jsonCSSrule, directive) {

    if (jsonCSSrule.directive != undefined && jsonCSSrule.directive == directive) {
        
        //console.log(" Element----"+$(elementSource).attr('class'));
        var rulevaluewithoutPX = removePXFromCssElements(directive, jsonCSSrule.value);
        if (directive.toLowerCase() == 'padding') {
            
            //console.log(' Property Padding jsonCSSrule.value ---' + jsonCSSrule.value + ' selector--' + $(elementSource).attr('data-ffstyle-selector'));
            if (jsonCSSrule.value.split(' ').length >= 2) {
                //console.log('initialize slider value split ' + jsonCSSrule.value + ' -- without px-' + rulevaluewithoutPX);
            }
            else {
                var elementDataJson = isSliderJSON(elementSource, directive, jsonCSSrule.value);
                if (elementDataJson.isSlider) {
                    //console.log('initialize slider' + elementDataJson.value);
                    $(elementSource).val(elementDataJson.value);
                    
                    $(elementSource).rangeslider('update', true);
                    
                }
                else {
                    //console.log('initialize slider false ' + rulevaluewithoutPX);
                    $(elementSource).val(rulevaluewithoutPX);
                }
            }
            //console.log(' Property Padding ---' + rulevaluewithoutPX);
        }
        else {
            
            if (elementSource.type == 'select-multiple') {
                var valuesArr = [];
                var values = jsonCSSrule.value;
                if (values != '')
                { valuesArr = values.split(","); }
                $(elementSource).val(valuesArr);
                //  console.log(' Property value  ---'+jsonCSSrule.value);
                
                
            }
            else if (elementSource.type == 'select-one') {
                $(elementSource).val(jsonCSSrule.value);
                populateStyleSelect2(elementSource, jsonCSSrule.value, true);
            } else if (elementSource.type == 'checkbox') {
                
                if (hasMultipleRules(elementSource)) {
                    setBooleanForMultiRules(elementSource, directive, jsonCSSrule.value);
                }  else {
                    setBooleanControls(elementSource, directive, jsonCSSrule.value);
                }
                // console.log(' Property value  ---'+jsonCSSrule.value);
            } else if (elementSource.type == 'file') {
                
                setFileTypeControls(elementSource, directive, jsonCSSrule.value);
                // console.log('File Property value  ---'+jsonCSSrule.value);
            } else {
                
                var elementDataJson = isSliderJSON(elementSource, directive, jsonCSSrule.value);
                if (elementDataJson.isSlider) {
                    //console.log('initialize slider' + elementDataJson.value);
                    if($(elementSource).parents('.fs-width-controls').length>0){
                        var numericval=elementDataJson.value;
                        
                        var selval=jsonCSSrule.value;
                        $(elementSource).parent().removeClass('ff-disabled');
                        if(selval=='100%'){
                            $(elementSource).parents('.ffse-SC-property').find('select').select2('val','full');
                            $(elementSource).parent().addClass('ff-disabled');
                        } else {
                            if( numericval>0){
                                $(elementSource).parents('.ffse-SC-property').find('select').select2('val','fixed');
                            } else{
                                
                                $(elementSource).parents('.ffse-SC-property').find('select').select2('val','auto');
                                $(elementSource).parent().addClass('ff-disabled');
                            } 
                            $(elementSource).val(numericval);
                            
                            $(elementSource).rangeslider('update', true);
                            
                        }
                        
                    } else {
                        $(elementSource).val(elementDataJson.value);
                        $(elementSource).rangeslider('update', true);
                    }
                }  else {
                    $(elementSource).val(rulevaluewithoutPX);
                }
            }
        }
    }
}
/* populate checkboxlist and radiobuttonlist(single checkbox list) */
function setBooleanControls(elementSource, propname, propvalue) {
    if (isMatchIgnoreCase(propname, 'font-weight') && isMatchIgnoreCase(propvalue, 'bold')) {
        $(elementSource).prop('checked', true);
    }
    else if (isMatchIgnoreCase(propname, 'font-style') && isMatchIgnoreCase(propvalue, 'italic')) {
        $(elementSource).prop('checked', true);
    }
        else if (isMatchIgnoreCase(propname, 'text-decoration') && isMatchIgnoreCase(propvalue, 'underline')) {
            $(elementSource).prop('checked', true);
        }
            else if (isMatchIgnoreCase(propname, 'border-radius') && isMatchIgnoreCase(propvalue, $(elementSource).val())) {
                $(elementSource).prop('checked', true);
            }
                else if (isMatchIgnoreCase(propname, 'margin') && isMatchIgnoreCase(propvalue, $(elementSource).val())) {
                    $(elementSource).prop('checked', true);
                }
                    else if (isMatchIgnoreCase(propvalue, $(elementSource).val())) {
                        $(elementSource).prop('checked', true);
                    }
                        else {
                            
                            $(elementSource).prop('checked', false);
                        }
    
}
function hasMultipleRules(elementSource) {
    var isMulti = false;
    var rules = $(elementSource).attr('data-ffstyle-prop').split(';');
    if (rules.length > 1) {
        isMulti = true;
    }
    return isMulti;
}
function setBooleanForMultiRules(elementSource, propname, propvalue) {
    var tempValuesArr = [];
    var cssrulearr = $(elementSource).val().split(';');
    var currentValueTemp = $(elementSource).attr('data-ffstyle-prop-temp');
    if (currentValueTemp != undefined && currentValueTemp != '') {
        tempValuesArr = currentValueTemp.split(';');
        if (cssrulearr.length != tempValuesArr.length) {
            
            currentValueTemp = currentValueTemp + ';' + propvalue;
            $(elementSource).attr('data-ffstyle-prop-temp', currentValueTemp);
            
        }
        
    }
    else {
        console.log(' Element propvalue-' + propvalue);
        $(elementSource).attr('data-ffstyle-prop-temp', propvalue);
    }
    currentValueTemp = $(elementSource).attr('data-ffstyle-prop-temp');
    if (currentValueTemp != undefined && currentValueTemp != '') {
        tempValuesArr = currentValueTemp.split(';');
    }
    if (arrayEquals(cssrulearr, tempValuesArr)) {
        
        console.log(' Element checked');
        $(elementSource).prop('checked', true);
    }
    else {
        console.log(' Element unchecked');
        $(elementSource).prop('checked', false);
    }
}
function arrayEquals(arr1, arr2) {
    var isEqual = false;
    if ($(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0) {
        isEqual = true;
    }
    return isEqual;
}
function setFileTypeControls(elementSource, propname, propvalue) {
    var indexofstr = "imageserver?id=";
    
    if (isMatchIgnoreCase(propname, 'background-image') && propvalue != undefined && propvalue != null && propvalue != '' && propvalue.toLowerCase().indexOf(indexofstr) > 1 && propvalue.indexOf('&') > 1) {
        var imgsrc = propvalue;
        imgsrc = imgsrc.replace("url('", "").replace("url(", "").replace("')", "").replace(")", "");
        var objid = propvalue.substring((propvalue.toLowerCase().indexOf(indexofstr) + indexofstr.length), propvalue.indexOf('&'));
        var elementSourceParent = $(elementSource).parents('.ffse-file-upload-container');
        
        var fileUploadElement = $(elementSourceParent).find('.ffse-fileUpload-control');
        var cssSelector = $(fileUploadElement).attr('data-ffstyle-selector');
        var cssRuleDirective = $(fileUploadElement).attr('data-ffstyle-prop');
        
        var $removeImage = $('<span/>', { 'class': 'ffse-remove-uploadedimg', html: 'Remove', 'data-imgdoc-id': objid });
        var $img = $('<img/>', { 'src': imgsrc, 'class': 'ffse-uploaded-img', 'data-ffstyle-selector': cssSelector, 'data-ffstyle-prop': cssRuleDirective });
        $(elementSourceParent).find('.ffse-img-upload-placeholder').show();
        $(elementSourceParent).find('.ffse-img-upload-placeholder').html($img);
        $(elementSourceParent).find('.ffse-img-upload-placeholder').append($removeImage);
        var imgWidth = '80';
        var imgHeight = '50';
        $("<img/>").attr("src", $img.attr("src")).load(function () {
            
            
            setImageDimensions(elementSourceParent, this.width, this.height,false);
        });
        
        uploadSuccess(elementSourceParent, false, 'StyleEditor');
        $(elementSourceParent).find('.ffse-img-upload-placeholder .ffse-remove-uploadedimg').on("click", (function () {
            
            removeImageCallBack(this, cssSelector, cssRuleDirective);
        }));
        
    }
    else {
        console.log(' In Set filetype control- in else propvalue-' + propvalue);
    }
    
}
function resetFileUploadControls(elementSourceParent) {
    $(elementSourceParent).find('.ffse-img-upload-placeholder').html('');
    $(elementSourceParent).find('.ffse-img-upload-placeholder').hide();
    $(elementSourceParent).find('.ffse-fileUpload-control').show();
    
}
function isMatchIgnoreCase(stringvalue, tocompare) {
    
    if (stringvalue != '' && stringvalue.toLowerCase() == tocompare) {
        return true;
    }
    return false;
}

function appendNewThemeTileToList(themeid, themename, themetype, isselected, expandAvailabelList, tileHtml) {
    $('.available-themes-main-wrapper').find('.adhoc-theme-list-ul').remove();
    if(!isThemeExistsAlready(themeid))
    {
        
        var $seperatorDiv = $('<div />', {
            'class': 'div-theme-list-seperator'
        });
        var liItem = $('#tempTemplateTile').clone();
        // $(liItem).find(".template-name").html(themename);
        
        $(liItem).find('>ul>li').addClass('ff-template-selected');
        var longthemename='';
        var shortthemename=''+themename;
        if(shortthemename.length>0 )
        {
            if(shortthemename.length>9)
            {
                $(liItem).find(".template-name").addClass("blue-tooltip");
                
                longthemename= shortthemename;
                shortthemename=shortthemename.substring(0,7)+'...';
                $(liItem).find(".template-name").html("<span class='blue-tooltip-text mt0'>"+longthemename+"</span>"+shortthemename);
            }
            else
            {
                $(liItem).find(".template-name").html(shortthemename);
            }
        }
        
        $(liItem).find('.rectangular-tile').attr('data-theme-id', themeid);
        $(liItem).find('.template-tile-delete').attr('data-theme-id', themeid);
        $(liItem).find('.template-tile-delete').attr('data-theme-name', themename);
        $(liItem).find('.template-tile-delete').attr('data-theme-type', themetype);
        $(liItem).find('.rectangular-tile').html(tileHtml);
        if (themetype == 'Standard') {
        }
        else if (themetype == 'Custom') {
            appendUlToAvailableList('custom-theme-list-ul',liItem);
        }
            else
            { 
                appendUlToAvailableList('adhoc-theme-list-ul',liItem);
            }
    }
    if (expandAvailabelList) {
        expandTemplateList($('.expand-templates-trigger'), true);
        resetTemplateInAvailabelList(themeid);
    }
}
/** toggle style settings accordion panels  */
function expandAccordionPanel(elementSource) {
    var addClass = false;
    if (!$(elementSource).parents('.panel-default').find('.panel-collapse').hasClass('in')) {
        addClass = true;
    }
    var elementid = $(elementSource).attr('data-target');
    var accordionContainerId = $(elementSource).attr('data-parent');
    $('' + accordionContainerId).find('.panel-default').find('.panel-heading').removeClass('accordion-active');
    $('' + accordionContainerId).find('.panel-default').find('.panel-heading').removeClass('processing-graphic');
    $('' + accordionContainerId).find('.panel-collapse.collapse.in').each(function (i, panelBodyElement) {
        
        $(panelBodyElement).collapse('hide');
    });
    if (addClass) {
        collapseAvailableThemeList();
        
        console.log('Element id to show- ' + elementid);
        $('' + elementid).collapse('show');
        if (!$(elementSource).parents('.panel-heading').hasClass('accordion-active')) {
            $(elementSource).parents('.panel-heading').addClass('accordion-active');
        }
        resetAccordionJScrollPane(elementSource);
    }
    else {
        $('' + elementid).collapse('hide');
    }
}
function resetAccordionJScrollPane(elementSource) {
    
    destroyJspScrollpane($(elementSource).parents('.panel-default').find('.panel-body'));
    
    
    $(elementSource).parents('.panel-default').find('.panel-body').jScrollPane({
        
        stickToBottom: true,
        maintainPosition: true,
        verticalGutter: 0,
        mouseWheelSpeed: 60
    });
    
    $(elementSource).parents('.panel-default').find('.panel-body').find('.jspContainer').css("width", 348);
    
}
function collapseAccordionPanels() {
    $('#sfff-style-accordion').find('.panel-default').show();
    $('#sfff-style-accordion').find('.panel-collapse.collapse.in').each(function (i, panelBodyElement) {
        console.log(' Remove class');
        $(panelBodyElement).parents('.panel-default').find('.panel-heading').removeClass('accordion-active');
        $(panelBodyElement).parents('.panel-default').removeClass('activeItem');
        $(panelBodyElement).collapse('hide');
    });
    
}

function isThemeExistsAlready(themeid)
{
    var returnflag=false;
    $('.available-themes-main-wrapper ul.sfff-theme-list > li.tile-li').each(function(i, obj) {
        if(    $(obj).find('div.rectangular-tile').attr('data-theme-id')==themeid)
        {  
            returnflag= true;
            return false;
        }
    });
    return returnflag;
}
function appendUlToAvailableList(ULClassName,liitem)
{
    
    
    if($('.available-themes-main-wrapper').find('.'+ULClassName).length>0)
    {
        
        $('.available-themes-main-wrapper').find('.'+ULClassName);
        $('.available-themes-main-wrapper').find('.'+ULClassName).prepend($(liitem).find('>ul').html());
    }
    else
    {
        var $seperatorDiv = $('<div />', {
            'class': 'div-theme-list-seperator'
        });
        var $ulItem = $('<ul />', { 'class': ''+ULClassName+' sfff-theme-list' });
        $ulItem.append($(liitem).find('>ul').html());
        $('.available-themes-main-wrapper').prepend($seperatorDiv);
        $('.available-themes-main-wrapper').prepend($ulItem);
        
    }
    
    
}



function deleteTheme(elementSource) {
    var themename = $(elementSource).attr('data-theme-name');
    
    var themeid = $(elementSource).attr('data-theme-id');
    if (themeid != undefined && themeid != '') {
        
        remoteIsThemeInUseJs(themeid, themename);
    } else {
        console.log(' Theme id is not defined ');
    }
}
function populateFontFamily() {
    
    $('.ffse-setting-card-container').find('.ffse-setting-card').find('.ffse-propname select.ffse-prop-fontstyle').each(function (index, elementSource) {
        
        populateFontFamilySelect(elementSource, '');
        
        
    });
    
    
}
function populateBorderStyle() {
    $('.ffse-setting-card-container').find('.ffse-setting-card').find('.ffse-propname select.ffse-prop-borderstyle').each(function (index, elementSource) {
        
        populateStyleSelect2(elementSource, '', false);
    });
}
function intializeNumericSliders() {
    
    $('.ffse-setting-card-container').find('.ffse-setting-card').find('.ffse-propname input.ffse-rangeslider').each(function (index, elementSource) {
        
        $(elementSource).rangeslider('destroy');
        rangeSliderIntialization(elementSource, "");
        
    });
    
    
}

/**initialize range slider by element */
function rangeSliderIntialization(elementSource, integervalue) {
    
    
    if ($.isNumeric(integervalue)) {
        console.log(' integervalue ' + integervalue);
        $(elementSource).val(integervalue);
    }
    else {
        var defaultvalue = '0';
        
        if ($(elementSource).attr('data-slider-default') != undefined) {
            defaultvalue = $(elementSource).attr('data-slider-default');
        }
        $(elementSource).val(defaultvalue);
    }
    
    // Basic rangeslider initialization
    $(elementSource).rangeslider({
        
        // Deactivate the feature detection
        polyfill: false,
        
        // Callback function
        onInit: function () { rangeSliderOnInitCallBack(this); },
        
        // Callback function
        onSlide: function (position, value) {
            
            rangeSliderOnSlideCallBack(this, value);
        },
        
        // Callback function
        onSlideEnd: function (position, value) {
            
            rangeSliderOnSlideEndCallBack(this, value);
            
        }
    });
}
function rangeSliderOnInitCallBack(elem) {
    var initialvalue = '';
    if ($(elem.$element).val() != undefined) {
        initialvalue = $(elem.$element).val();
    }
    var targetInput = $(elem.$element)[0].parentElement.getElementsByClassName('ff-rangeslider-input')[0];
    if(targetInput.value == 0){
        targetInput.style.visibility = 'hidden';
    }
    
    setInputElement(elem, initialvalue, $(elem.$element).next().find('.rangeslider__outputelement'));
    
}

function rangeSliderOnSlideCallBack(elem, value) {
    setInputElement(elem, value, $(elem.$element).next().find('.rangeslider__outputelement'));
}

function rangeSliderOnSlideEndCallBack(elem, value) {
    if ($(elem.$element).parent().parent().parent().hasClass('fs-width-controls')){
        var selval=value;
        if (!$.isNumeric(selval)){
            selval=0;
        }
        setInputElement(elem, selval, $(elem.$element).next().find('.rangeslider__outputelement'));
        if(selval>0){
            $(elem.$element).parents('.ffse-SC-property').find('select').select2('val','fixed');
        }
        else if(selval==0){
            $(elem.$element).parents('.ffse-SC-property').find('select').select2('val','auto');
        }
        $(elem.$element).val(selval).change();
    }
}
/*trigger onchange event for inout element bind with range slider */
function rangeSliderOnValueChangeCallBack(elem, value, parentElement) {
    
    $(elem.$element).val(value).change();
    
}
/** set the input element value and bind onblur functions to that input element on double click right besides the range slider controls */
function setInputElement(elem, value, parentElement) {
    var $input = $('<input />', { 'class': 'ff-rangeslider-input' });
    $input.val(value);

    if($(parentElement).find('input')[0] && $(parentElement).find('input')[0].style.visibility == 'hidden' && value == 0){
        $input[0].style.visibility = 'hidden';
    }

    $(parentElement).html('');
    $(parentElement).append($input);
    $(parentElement).append('px');
    $(parentElement).bind("dblclick", (function () {
        var targetElement = $(this).find('input');
        targetElement.prop('disabled', false);
        if(targetElement[0].style.visibility == 'hidden'){
            targetElement[0].style.visibility = '';
        }

        console.log('Double click');
    }));
    $(parentElement).find('input').on("blur", (function () {
        
        rangeSliderOnValueChangeCallBack(elem, $(this).val());
        $(this).prop('disabled', true);
        console.log('Blur hit');
    }));
    $(parentElement).find('input').prop('disabled', true);
    
}

function setFontFamily() {
    
    $('.ffse-setting-card-container').find('.ffse-setting-card').find('.ffse-propname select.ffse-prop-fontstyle').each(function (index, elementSource) {
        
        setSelect2Element(elementSource, '', true);
        
        
    });
}
function populateColorPicker() {
    $('.ffse-setting-card-container').find('.ffse-setting-card').find('.ffse-propname input.ffse-colorpicker').each(function (index, elementSource) {
        setColPickerElement(elementSource, '', true);
    });
}
/**initializes/set color picker controls */
function setColPickerElement(inputElement, colorcode, populateDefaultFromInput) {
    
    var  ffcolor = '';
    if (colorcode != '' && colorcode.length > 2  ) {
        ffcolor = colorcode;
    }
    else {
        var inputvalue = $(inputElement).val();
        //console.log(' inputvalue ---' + inputvalue);
        if (populateDefaultFromInput && inputvalue != undefined && inputvalue != '') {
            ffcolor = inputvalue.replace('!important', '').trim();
        }
    }
    $(inputElement).attr('data-colpicker-hex', ffcolor);
    $(inputElement).val(ffcolor);
    var isColorSpan=false;
    if($(inputElement).parent().find('span.color-span').length>0){
        $(inputElement).parent().find('span.color-span').css('background-color', ffcolor);
        isColorSpan=true;
    }else{$(inputElement).css('background-color', ffcolor);
         }
    
    $(inputElement).colorpicker(
        {
            horizontal: 'true'            
        }).on('showPicker.colorpicker', function(event){
        $(event.target).parent().addClass('color-picker-enabled');
    }).on('hidePicker.colorpicker', function(event){
        var colorvalue='';
        
        if( event.color!=undefined){
            colorvalue=event.color.toHex();
            try{
                // if(event.color.origFormat=='rgba'){
                var RGBA=event.color.toRGB();
                if(RGBA!=undefined){
                    var r=RGBA.r;
                    var g=RGBA.g;
                    var b=RGBA.b;
                    var a=RGBA.a;
                    colorvalue='rgba('+r+','+g+','+b+','+a+')';
                    console.log('in RGBa '+ colorvalue);
                }
                // }
            }catch(err){}
            
        }
        if(colorvalue===undefined){
            colorvalue='';
        }
        $(event.target).attr('data-colpicker-hex',colorvalue);
        $(event.target).val(colorvalue);
        if(isColorSpan){
            $(event.target).parent().find('span.color-span').css('background-color',colorvalue);
        }else{
            $(event.target).css('background-color',colorvalue);
        }
        $(event.target).parent().removeClass('color-picker-enabled');
        setColPickerCallBack(event.target, colorvalue);
    });
    
}
function toggleColorPicker(elemSource){
    $(elemSource).parent().toggleClass( "color-picker-enabled" );
}
function setColPickerElementORIGINAL2(inputElement, colorcode, populateDefaultFromInput) {
    
    var  ffcolor = '';
    if (colorcode != '' && colorcode.length > 2  ) {
        ffcolor = colorcode;
    }
    else {
        var inputvalue = $(inputElement).val();
        console.log(' inputvalue ---' + inputvalue);
        if (populateDefaultFromInput && inputvalue != undefined && inputvalue != '') {
            ffcolor = inputvalue.replace('!important', '').trim();
        }
    }
    $(inputElement).attr('data-colpicker-hex', ffcolor);
    $(inputElement).val(ffcolor);
    $(inputElement).css('background-color', ffcolor);
    
    $(inputElement).colorpicker(
        {
            horizontal: 'true'            
        }).on('hidePicker.colorpicker', function(event){
        var colorvalue='';
        
        if( event.color!=undefined){
            colorvalue=event.color.toHex();
            try{
                // if(event.color.origFormat=='rgba'){
                var RGBA=event.color.toRGB();
                if(RGBA!=undefined){
                    var r=RGBA.r;
                    var g=RGBA.g;
                    var b=RGBA.b;
                    var a=RGBA.a;
                    colorvalue='rgba('+r+','+g+','+b+','+a+')';
                    console.log('in RGBa '+ colorvalue);
                }
                // }
            }catch(err){}
            
        }
        if(colorvalue===undefined){
            colorvalue='';
        }
        $(event.target).attr('data-colpicker-hex',colorvalue);
        $(event.target).val(colorvalue);
        $(event.target).css('background-color',colorvalue);
        setColPickerCallBack(event.target, colorvalue);
    });
    
}

function setColPickerCallBack(inputElement, hexcolor) {
    styleSettingElementChange(inputElement);
}
function uploadSuccessStyleEditorCallBack(elementParent, autoSave) {
    console.log(' uploadSuccessStyleEditorCallBack');
    if (autoSave) {
        console.log(' resetAccordionJScrollPane ');
        resetAccordionJScrollPane(elementParent);
    }
    
}
function populateFontFamilySelect(selectElement, selectedValue) {
    var selecthtml = '';
    selecthtml += "<option value='' >--select--</option>";
    selecthtml += "<option value='Arial' >Arial</option>";
    selecthtml += "<option value='Arial Black' >Arial Black</option>";
    selecthtml += "<option value='Courier' >Courier</option>";
    selecthtml += "<option value='Courier New' >Courier New</option>";
    selecthtml += "<option value='Georgia' >Georgia</option>";
    selecthtml += "<option value='Helvetica' >Helvetica</option>";
    selecthtml += "<option value='Impact' >Impact</option>";
    selecthtml += "<option value='Lucida Grande' >Lucida Grande</option>";
    selecthtml += "<option value='Lucida Grande' >Lucida Console</option>"; 
    selecthtml += "<option value='Sans' >Sans</option>";
    selecthtml += "<option value='sans-serif' >Sans serif</option>";
    
    selecthtml += "<option value='Tahoma' >Tahoma</option>";
    selecthtml += "<option value='Times' >Times</option>";
    selecthtml += "<option value='Times New Roman' >Times New Roman</option>";
    selecthtml += "<option value='Trebuchet MS' >Trebuchet MS</option>";
    
    selecthtml += "<option value='Verdana' >Verdana</option>";
    
    $(selectElement).empty();
    $(selectElement).append(selecthtml);
    $(selectElement).select2();
    
    
    
}
function populateStyleSelect2(selectElement, selectedValue, assignValues) {
    if (assignValues) {
        $(selectElement).select2("val", selectedValue);
    }
    else {
        $(selectElement).select2();
    }
    
    
}
function setSelect2Element(selectElement, selectedValue, populateFromDefault) {
    if (populateFromDefault) {
        selectedValue = $(selectElement).val();
    }
    
    $(selectElement).select2("val", selectedValue);
    
}

function setImageDimensions(elementSourceParent, imgWidth, imgHeight,autoSave) {
    var fileElement = $(elementSourceParent).find('input.ffse-fileUpload-control');
    if ($(fileElement).attr('data-ffstyle-selector') == '.ff-logo') {
        
        if (imgWidth != null && imgWidth != '') {
            $(elementSourceParent).find('input.ffse-img-width').val(imgWidth);
        }
        if (imgHeight != null && imgHeight != '') {
            $(elementSourceParent).find('input.ffse-img-height').val(imgHeight);
        }
        
        
    }
    if(autoSave)
    {  
        
        styleSettingElementChange(elementSourceParent);
    }
}
function resetImageDimensions(elementSourceParent, imgWidth, imgHeight) {
    var fileElement = $(elementSourceParent).find('input.ffse-fileUpload-control');
    if ($(fileElement).attr('data-ffstyle-selector') == '.ff-logo') {
        
        
        $(elementSourceParent).find('input.ffse-img-width').val(imgWidth);
        
        $(elementSourceParent).find('input.ffse-img-height').val(imgHeight);
        
        
        
    }
}
function removeImageStyleEditorCallBack(elementParent, cssSelector, cssruledirective, uploadType) {
    resetImageDimensions(elementParent, '', '');
    styleSettingElementChange(elementParent);
}

function toggleElementHighlight(elemName,showHighlight)
{
    if (showHighlight == true){
        switch(elemName) {
            case 'form':
                $('#fastformsiframe, #fastformsiframeMobile').contents().find(".ff-form").addClass("highlight-form");
                break;
            case 'fields':
                $('#fastformsiframe, #fastformsiframeMobile').contents().find(".ff-item-row:not('.ff-footer-row'):not(:has(>.ff-section-col))").addClass("highlight-fields");
                break;
            case 'buttons':
                $('#fastformsiframe, #fastformsiframeMobile').contents().find(".ff-btn-submit").addClass("highlight-buttons");
                break;
            default:
                break;
        }
    } else {
        switch(elemName) {
            case 'form':
                $('#fastformsiframe, #fastformsiframeMobile').contents().find(".ff-form").removeClass("highlight-form");
                break;
            case 'fields':
                $('#fastformsiframe, #fastformsiframeMobile').contents().find(".ff-item-row:not('.ff-footer-row'):not(:has(>.ff-section-col))").removeClass("highlight-fields");
                break;
            case 'buttons':
                $('#fastformsiframe, #fastformsiframeMobile').contents().find(".ff-btn-submit").removeClass("highlight-buttons");
                break;
            default:
                break;
        }
    }
    return false;
    
}

function generateTileHtml()
{
    var formBGColor = $('.ffse-colorpicker[data-ffstyle-selector=".ff-form-main"][data-ffstyle-prop="background-color"]').css('background-color');
    var sectionBGColor = $('.ffse-colorpicker[data-ffstyle-selector=".ff-group-row"][data-ffstyle-prop="background-color"]').css('background-color');
    var sectionBorderColor = $('.ffse-colorpicker[data-ffstyle-selector=".ff-group-row"][data-ffstyle-prop="border-color"]').css('background-color');
    var sectionBorderRadius = '';
    if ($('#chkffseborderradius0').prop('checked'))
        sectionBorderRadius = '0px';
    else if ($('#chkffseborderradius5').prop('checked'))
        sectionBorderRadius = '5px';        
        else if ($('#chkffseborderradius10').prop('checked'))
            sectionBorderRadius = '10px';     
    
    var sectionTitleFontBold = '';
    if ($('#chkffsebold').prop('checked'))
        sectionTitleFontBold = 'bold';
    else
        sectionTitleFontBold = 'normal';
    
    var sectionTitleFontItalic = '';
    if ($('#chkffseitalic').prop('checked'))
        sectionTitleFontItalic = 'italic';
    else
        sectionTitleFontItalic = 'normal';        
    
    var sectionTitleFontUnderline = '';
    if ($('#chkffseunderline').prop('checked'))
        sectionTitleFontUnderline = 'underline';
    else
        sectionTitleFontUnderline = 'none';  
    
    
    var sectionBorderStyle = $('.ffse-prop-borderstyle[data-ffstyle-selector=".ff-group-row"]').val();
    var sectionTitleFontColor = $('.ffse-colorpicker[data-ffstyle-selector=".ff-section-header"][data-ffstyle-prop="color"]').css('background-color');
    var sectionTitleFontFamily = $('.ffse-prop-fontstyle[data-ffstyle-selector=".ff-section-header"]').val();
    
    var tileHtml = '<div class="tile-preview-box" style="padding:8px 0px 0px 8px;background-color:' + formBGColor + '  "><span class="tile-preview-section" style="background-color:' + sectionBGColor + ';border-radius:' + sectionBorderRadius + ' 0px 0px 0px;border-left: 2px ' + sectionBorderStyle + ' ' + sectionBorderColor + ' ;border-top: 2px ' + sectionBorderStyle + ' ' + sectionBorderColor + ' ;"><span class="tile-preview-section-label" style="font-weight: ' + sectionTitleFontBold + ';text-decoration:' + sectionTitleFontUnderline + ';font-style:' + sectionTitleFontItalic + ';color:' + sectionTitleFontColor + ';font-family:' + sectionTitleFontFamily + '">Title</span></span> </div>'
    
    return tileHtml;
}