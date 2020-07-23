function initializeFastPrefillValues(responseResult, doAction) {
    var triggerName = responseResult[0];
    console.log(" Initializing Fast Prefill Values  - " + triggerName);
    if (!isNullOrEmpty(triggerName)) {
        getInitialValuesJS(triggerName, triggerName + '_Test', doAction);
    }
    else {
        toggleProcessingBox(false);
        toggleWarningBox(true, 'Something went wrong . Please contact Formstack support Team.');
    }
}
function handlePrefillValuesResponse(responseResult, triggerName, testClassName, doAction) {
    console.log(" Handle Prefill Values Response  - " + responseResult);
    $('#preTriggerCode').attr('name', triggerName);
    $('#preTriggerTestCode').attr('name', testClassName);

    var deployed = getSafeBoolean(responseResult['ISDEPLOYED'], false);

    var fieldName = $('#ddlFieldList').val();
    if (!isNullOrEmpty(fieldName) && fieldName == '-select one-') {
        fieldName = '';
    }


    if (doAction) {

        if (!isNullOrEmpty(fieldName)) {
            deployFastPrefillTrigger();
        } else {
            undeployExistingFastPrefillTrigger();
        }
    }
}
function toggleEnableBtn(elemSource, enable) {
    if (enable) {
        $(elemSource).removeClass('va-disabled');
    }
    else {
        $(elemSource).addClass('va-disabled');
    }
}

function deployFastPrefillTrigger() {
    var triggerName = $('#preTriggerCode').attr('name');
    var testClassName = $('#preTriggerTestCode').attr('name');
    var fieldName = $('#ddlFieldList').val();
    if (!isNullOrEmpty(fieldName) && fieldName == '-select one-') {
        fieldName = '';
    }

    if (!isNullOrEmpty(fieldName) && !isNullOrEmpty(triggerName) && !isNullOrEmpty(testClassName)) {
        var triggerCode = getTriggerCodeJS(false, null, triggerName, PrimaryObjectName, fieldName, FastFormRecID);
        var triggerTestCode = getTriggerTestCodeJS(false, null, testClassName, PrimaryObjectName, fieldName, FastFormRecID);
        var packageXml = getPackageXmlJS(false, triggerName, testClassName);
        var destructiveChangesXml = getDestructiveChangesXmlJS(triggerName, testClassName);
        var triggerCodeMetadata = getTriggerCodeMetadataJS();
        var triggerTestCodeMetadata = getTriggerTestCodeMetadataJS();
        /*preparing zip package for deployment*/
        var zipFastFormsTriggerPackage = new JSZip();
        zipFastFormsTriggerPackage.file('package.xml', packageXml);
        zipFastFormsTriggerPackage.file('classes/' + testClassName + '.cls-meta.xml', triggerTestCodeMetadata);
        zipFastFormsTriggerPackage.file('classes/' + testClassName + '.cls', triggerTestCode);
        zipFastFormsTriggerPackage.file('triggers/' + triggerName + '.trigger-meta.xml', triggerCodeMetadata);
        zipFastFormsTriggerPackage.file('triggers/' + triggerName + '.trigger', triggerCode);
        var zippedDataToDeploy = zipFastFormsTriggerPackage.generate();
        /*depoly zip package to org*/
        remoteDepolyJS(zippedDataToDeploy, testClassName, true);
    }
}
function undeployExistingFastPrefillTrigger() {
    var triggerName = $('#preTriggerCode').attr('name');
    var testClassName = $('#preTriggerTestCode').attr('name');

    if (!isNullOrEmpty(triggerName) && !isNullOrEmpty(testClassName)) {
        var packageXml = getPackageXmlJS(true, triggerName, testClassName);
        var destructiveChangesXml = getDestructiveChangesXmlJS(triggerName, testClassName);
        /*preparing zip package for undeployment*/
        var zipFastFormsTriggerPackage = new JSZip();
        zipFastFormsTriggerPackage.file('package.xml', packageXml);
        zipFastFormsTriggerPackage.file('destructiveChanges.xml', destructiveChangesXml);
        var zippedDataToDeploy = zipFastFormsTriggerPackage.generate();
        /*undepoly already deployed trigger by deploy zip package having trigger\'s information to undeploy*/
        remoteDepolyJS(zippedDataToDeploy, testClassName, false);
    }
}
function getPackageXmlJS(deployed, triggerName, triggerTestName) {
    var responseBody = '';
    if (deployed) {   // package.xml for undeploy
        responseBody = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<Package xmlns="http://soap.sforce.com/2006/04/metadata">' +
            '<version>35.0</version>' +
            '</Package>';
    }
    else { // package.xml for deploy
        responseBody = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<Package xmlns="http://soap.sforce.com/2006/04/metadata">' +
            '<types>' +
            '<members>' + safeSTRValue(triggerName) + '</members>' +
            '<name>ApexTrigger</name>' +
            '</types>' +
            '<types>' +
            '<members>' + safeSTRValue(triggerTestName) + '</members>' +
            '<name>ApexClass</name>' +
            '</types>' +
            '<version>35.0</version>' +
            '</Package>';
    }
    return responseBody;
}

function getDestructiveChangesXmlJS(triggerName, triggerTestName) {
    return '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Package xmlns="http://soap.sforce.com/2006/04/metadata">' +
        '<types>' +
        '<members>' + safeSTRValue(triggerName) + '</members>' +
        '<name>ApexTrigger</name>' +
        '</types>' +
        '<types>' +
        '<members>' + safeSTRValue(triggerTestName) + '</members>' +
        '<name>ApexClass</name>' +
        '</types>' +
        '<version>35.0</version>' +
        '</Package>';
}

function getTriggerTestCodeMetadataJS() {
    return '<?xml version="1.0" encoding="UTF-8"?>' +
        '<ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">' +
        '<apiVersion>35.0</apiVersion>' +
        '<status>Active</status>' +
        '</ApexClass>';
}

function getTriggerTestCodeJS(deployed, testClassInstanceBody, triggerTestName, triggerObjectName, triggerFieldName) {
    var responseBody = '';
    if (deployed && testClassInstanceBody != null) {  // Display currently deployed code for confirmation
        responseBody = testClassInstanceBody;
    }
    else {
        // Namespace?
        var namespace = SFOrgPrefix;
        // Deploy generated code
        responseBody = '/**\n' +
            ' * Auto Generated and Deployed by Fast Prefill - Formstack\n' +
            ' **/\n' +
            '@IsTest\n' +
            'private class ' + safeSTRValue(triggerTestName) + '\n' +
            '{\n' +
            '    @IsTest\n' +
            'private static void testTrigger()\n' +
            '    {\n' +
            '  ' + triggertestBodyJS(triggerObjectName, triggerFieldName) +
            '   \n }\n' +
            '' + getPicklistApexMethodSTR() +
            '\n}';

    }
    return responseBody;
}

function getTriggerCodeMetadataJS() {
    return '<?xml version="1.0" encoding="UTF-8"?>' +
        '<ApexTrigger xmlns="http://soap.sforce.com/2006/04/metadata">' +
        '<apiVersion>35.0</apiVersion>' +
        '<status>Active</status>' +
        '</ApexTrigger>';
}

function getTriggerCodeJS(deployed, triggerInstanceBody, triggerName, triggerObjectName, triggerFieldName, recordId) {
    var responseBody = '';
    if (deployed && triggerInstanceBody != null) {
        // Display currently deployed code for confirmation
        responseBody = triggerInstanceBody;
    }
    else {
        // Namespace?
        var namespace = SFOrgPrefix;
        // Deploy generated code        
        responseBody =
            '/**\n' +
            ' * Auto Generated and Deployed by Fast Prefill - Formstack\n' +
            ' **/\n' +
            'trigger ' + safeSTRValue(triggerName) + ' on ' + safeSTRValue(triggerObjectName) + '\n' +
            '    (after insert)\n' +
            '{\n' +
            ' ' + triggerBodyJS(triggerObjectName, triggerFieldName, recordId) +
            '}\n';

    }
    return responseBody;
}
function triggerBodyJS(objectname, fieldname, formid) {
    var orgNS = '';
    if (!isNullOrEmpty(SFOrgPrefix)) {
        orgNS = SFOrgPrefix + '.';
    }
    return "if  (trigger.isAfter  &&  trigger.isInsert) { \n" +
        "List<" + safeSTRValue(objectname) + ">  newlyInsertedItems =  [SELECT  Id ,  " + safeSTRValue(fieldname) + " FROM  " + safeSTRValue(objectname) + " WHERE  Id  IN :trigger.new] ; \n" +
        "List<string> ids = new List<string>();\n" +
        " for ( " + safeSTRValue(objectname) + " e  : newlyInsertedItems) { \n" +
        "ids.add(e.id); \n" +
        "} \n" +
        " " + orgNS + "FastFormsUtilities.DoUpdateRecords( '" + safeSTRValue(objectname) + "' ,  '" + safeSTRValue(fieldname) + "' ,  '" + safeSTRValue(formid) + "' ,  ids,null );  \n" +
        " update newlyInsertedItems;}\n";
}
function triggertestBodyJS(objectname, fieldname) {
    var triggerTestClassBody = '';
    triggerTestClassBody += ' Test.startTest();\n';

    triggerTestClassBody += '  ' + getObjectInsertSTR();

    triggerTestClassBody += ' Test.stopTest(); \n System.assertNotEquals(primaryObject.Id,null);';
    return triggerTestClassBody;
}

function getObjectInsertSTR() {
    var actionMethodStr = '';
    /*reference objects*/

    $.each(objectDataMain, function (indx, objitem) {
        actionMethodStr += ' ' + objitem.type + ' refObject' + indx + ' = new ' + objitem.type + '(';
        var refObjectFields = '';
        $.each(objectRefDataMain, function (i, item) {
            if (!isNullOrEmpty(item.ref) && !isNullOrEmpty(objitem.name) && item.ref == objitem.name) {
                if (refObjectFields != '') {
                    refObjectFields += ",";
                }
                refObjectFields += '' + item.fieldnm + '=' + getDefaultValueByType(item) + '';
            }
        });
        actionMethodStr += refObjectFields + ');\n insert refObject' + indx + ' ;\n  ';

    });
    /*reference objects end*/
    actionMethodStr += ' ' + PrimaryObjectName + ' primaryObject= new ' + PrimaryObjectName + '(';
    var primaryObjectFields = '';
    var addedCount = 0;
    $.each(objectRefDataMain, function (pindx, item) {
        var lineItem = '';
        if (item.type == 'REFERENCE') {
            $.each(objectDataMain, function (indx, objitem) {
                if (!isNullOrEmpty(item.fieldnm) && item.fieldnm == objitem.name) {
                    lineItem += '' + item.fieldnm + '=refObject' + indx + '.Id';
                    addedCount++;
                }
            });
        } else if (item.name == PrimaryObjectName) {
            lineItem += ' ' + item.fieldnm + '=' + getDefaultValueByType(item) + ''; addedCount++;
        }
        if (lineItem != '') {
            if (addedCount > 1) {
                primaryObjectFields += ",";
            }
            primaryObjectFields += lineItem;
        }
    });

    actionMethodStr += primaryObjectFields + ');\n insert primaryObject;\n  ';
    return actionMethodStr;
}
function getDefaultValueByType(item) {
    var returnResponse = "";
    switch (item.type.toUpperCase()) {
        case "STRING":
            returnResponse = "'test'";
            break;
        case "EMAIL":
            returnResponse = "'test@formstack.io'";
            break;
        case "URL":
            returnResponse = "'https://formstack.io'";
            break;
        case "PHONE":
            returnResponse = "'1111111111'";
            break;
        case "NUMBER":
        case "PERCENT":
        case "CURRENCY":
        case "DECIMAL":
        case "DOUBLE":
        case "INTEGER":
            returnResponse = "1";
            break;
        case "TEXTAREA":
            returnResponse = "'test'";
            break;
        case "BOOLEAN":
            returnResponse = "true";
            break;
        case "DATE":
            returnResponse = "system.today()";
            break;
        case "DATETIME":
            returnResponse = "Datetime.now()";
            break;
        case "PICKLIST":
        case "MULTIPICKLIST":
            returnResponse = "getPickValue('" + item.name + "','" + item.fieldnm + "')";
            break;
        default:
            break;
    }
    return returnResponse;
}
function getPicklistApexMethodSTR() {
    return "\n static String getPickValue(String objName, String fld){ \n" +
        " String firstPicklistVal=''; \n " +
        " Schema.SObjectType sobjectType= Schema.getGlobalDescribe().get(objName);   \n " +
        " // Get a map of fields for the SObject \n" +
        " map<String, Schema.SObjectField> fieldMap = sobjectType.getDescribe().fields.getMap(); \n " +
        " // Get the list of picklist values for this field. \n" +
        " list<Schema.PicklistEntry> values = \n" +
        " fieldMap.get(fld).getDescribe().getPickListValues(); \n" +
        " // Add these values to the selectoption list. \n" +
        " if(values!=null && values.size()>0){ firstPicklistVal=values[0].getValue()+'';} \n" +
        " return firstPicklistVal; \n" +
        " } \n";
}

function createRefObjectItem(objname, objtype) {
    var obj = { 'name': objname, 'type': objtype };
    return obj;
}
function createFieldItem(objname, fieldtype, fieldvalue, fieldname, refid) {
    var obj = { 'name': objname, 'type': fieldtype, 'value': fieldvalue, 'fieldnm': fieldname, 'ref': refid };
    return obj;
}
function isRefFieldExists(objArr, objname, fieldname) {
    var exists = false;
    $.each(objArr, function (i, obj) {
        if (obj.name === objname && obj.fieldnm == fieldname) { exists = true; return false; }
    });
    return exists;
}
function isRefObjectExists(objArr, objname) {
    var exists = false;
    $.each(objArr, function (i, obj) {
        if (obj.name === objname) { exists = true; return false; }
    });
    return exists;
}
function safeSTRValue(strvalue) {
    var stringvalue = '';
    if (strvalue !== undefined && strvalue !== null) {
        stringvalue = strvalue;
    }
    return stringvalue;
}

function displayRemoteSiteCreationResponse(responseMsg) {
    if (!isNullOrEmpty(responseMsg)) {
        toggleWarningBox(true, 'Remote site is not added successfully. see <a href="https://help.salesforce.com/apex/HTViewHelpDoc?id=configuring_remoteproxy.htm&language=en" target="_blank">help article </a>. Please contact Formstack Support Team for further help.');
        toggleSuccessMsg(false, '',0);
    }
    else {
        toggleWarningBox(false, '');
    }
}