//Enums
var enumFSObjectType = { "Child_Repeated": "DetailRepeated", "Child": "Detail", "Primary": "", "Lookup": "Lookup" };
Object.freeze(enumFSObjectType);

var enumMatchingFieldType = {
    "Relationship": "relationship",
    "Token": "token",
    "Static_Token_Contact": "static_token_contact",
    "Static_Token_User": "static_token_user",
    "Static_Token_Email": "static_token_email",
    "Static_Lookup": "static_lookup",
    "PickList": "picklist",
    "Boolean": "boolean",
    "DateTime": "datetime",
    "Date": "date",
    "Static": "static"
};
Object.freeze(enumMatchingFieldType);

var enumFSToken = {
    "User_ContactId": "User.ContactId",
    "UserId": "User.Id",
    "UserEmail": "User.Email"
};
Object.freeze(enumFSToken);

var enumFSAddedBy = { "LoggedInUser": "LoggedInUser", "User": "User", "Auto": "Auto" };
Object.freeze(enumFSAddedBy);

var enumSFObjectAPIName = { "User": "User", "Contact": "Contact" };
Object.freeze(enumSFObjectAPIName);

var enumPrefillMessages = {
    "LoggedInUserDisabled_BC_PrefillThisObject": "You can't use it, if your Prefill This Object is disabled.",
    "LoggedInUserDisabled_BC_LoggedInUserIsChecked": "You can only set a single object as the Logged-in User.",
    "Generic_Error" : "An unexpected error has occured. Please try again, or contact the Formstack Support Team at sfappsupport@formstack.com if this issue persists."
};
Object.freeze(enumSFObjectAPIName);

class PrefillRules {
    constructor() {
        this.prefillRules = [];
    }
}

class PrefillRule {
    constructor() {
        this.whereClause = new WhereClauseObj();
        this.orderBy = new OrderbyClause();
        this.objDisplayName = '';//This is the Object Form Name (Salesforce name + FS Name)
        this.refFieldName = '';
        this.objectOrder = '';
        this.prefillOrder = '';
        this.isActive = true;//Prefill This object checkbox
        this.sfObjectName = '';//This is the Salesforce Object Name
        this.objectFSType = '';//This is our relationship name, Detail, DetailRepeated, Lookup, ''(empty) which is primary
        this.letter = '';//This is the letter for the display and control of objects
    }
}

class WhereClauseObj {
    constructor() {
        this.section = [];
        this.ruleop = '';
    }
}

class SectionObj {
    constructor() {
        this.condition = [];
        this.ruleop = '';
        this.condIndex = '';
    }
}

class WhereCondition {
    constructor() {
        this.operand1 = '';
        this.operand2 = new Operand2Obj();
        this.op = '';
        //User, CheckLoggedInUser - Use to identify if we should hide the filter or not
        this.addedBy = '';
        //Varchar, Boolean, DateTime, Date - Use to identify how we are going to format it when we do the where clause in PrefillLoader
        this.fieldType = '';
    }
}

class Operand2Obj {
    constructor() {
        this.otype = '';
        this.otext = '';
    }
}

class OrderbyClause {
    constructor() {
        this.clause = [];
    }
}

class OrderClauseCondition {
    constructor() {
        this.expression = "";//Field
        this.ascDesc = "";//ASC or DESC
        this.clauseIndex = "";//1 or 2 - It will control the sequence that we add in the soql statment
    }
}

class SF_Field {
    constructor(pLabelName, pFieldName, pType, pReferenceTo) {
        this.LabelName = pLabelName;
        this.FieldName = pFieldName;
        this.SFType = pType;
        this.ReferenceTo = pReferenceTo;
    }
}

class SF_Object {
    constructor(pObjectName, pListFields) {
        this.ObjectName = pObjectName;
        this.ListFields = pListFields;
    }
}