function getListDefaultOrderBy() {
    var vListOrderByClauses = [];

    var objOrder = new OrderClauseCondition();
    objOrder.expression = 'CreatedDate';
    objOrder.ascDesc = 'desc';
    objOrder.clauseIndex = '1';
    vListOrderByClauses.push(objOrder);

    objOrder = new OrderClauseCondition();
    objOrder.expression = 'CreatedDate';
    objOrder.ascDesc = 'asc';
    objOrder.clauseIndex = '1';
    vListOrderByClauses.push(objOrder);

    objOrder = new OrderClauseCondition();
    objOrder.expression = 'LastModifiedDate';
    objOrder.ascDesc = 'desc';
    objOrder.clauseIndex = '1';
    vListOrderByClauses.push(objOrder);

    objOrder = new OrderClauseCondition();
    objOrder.expression = 'LastModifiedDate';
    objOrder.ascDesc = 'asc';
    objOrder.clauseIndex = '1';
    vListOrderByClauses.push(objOrder);

    return vListOrderByClauses;
}

function getObjectFSTypeDescription(pObjectFSType) {
    var pNameOrder = 'primary object'

    if (pObjectFSType == enumFSObjectType.Child) {
        pNameOrder = 'child object';
    } else if (pObjectFSType == enumFSObjectType.Lookup) {
        pNameOrder = 'lookup object';
    } else if (pObjectFSType == enumFSObjectType.Child_Repeated) {
        pNameOrder = 'repeated child';
    }

    return pNameOrder;
}

//This class creates a new PrefillJSON with all the filters in the objects, 
//same way that we are doing when we create the Form.
function getNewAutoFormPrefillJSON(pFS_Object_FormConfiguration, pPrimarySFObject) {

    var vPrefillRule = new PrefillRule();
    vPrefillRule.isActive = true;
    vPrefillRule.objectOrder = 1;
    vPrefillRule.objDisplayName = pFS_Object_FormConfiguration.ObjectName;
    vPrefillRule.sfObjectName = pFS_Object_FormConfiguration.SFObjectName;
    vPrefillRule.objectFSType = pFS_Object_FormConfiguration.ObjectFSType;
    vPrefillRule.letter = pFS_Object_FormConfiguration.Letter;
    vPrefillRule.refFieldName = pFS_Object_FormConfiguration.RelatedField;
    vPrefillRule.prefillSource = pFS_Object_FormConfiguration.prefillSource;
    var vWhereClause = new WhereClauseObj();
    vWhereClause.ruleop = 'AND';

    var vSection = new SectionObj();
    vSection.condIndex = 1;
    vSection.ruleop = 'AND';

    var vCondition = new WhereCondition();
    vCondition.op = 'AND';

    if (pPrimarySFObject != '') {
        if (pFS_Object_FormConfiguration.ObjectFSType == enumFSObjectType.Lookup) {
            vCondition.operand1 = 'Id';
            vCondition.operand2.otext = pPrimarySFObject + '.' + pFS_Object_FormConfiguration.RelatedField;
            vCondition.operand2.otype = enumMatchingFieldType.Relationship;
            vCondition.addedBy = enumFSAddedBy.Auto;
        } else {
            //Details - Child
            vCondition.operand1 = pFS_Object_FormConfiguration.RelatedField;
            vCondition.operand2.otext = pPrimarySFObject + '.' + 'Id';
            vCondition.operand2.otype = enumMatchingFieldType.Relationship;
            vCondition.addedBy = enumFSAddedBy.Auto;
        }

    } else {
        vCondition.operand1 = '';
        vCondition.operand2.otext = '';
        vCondition.operand2.otype = enumMatchingFieldType.Static;
        vCondition.addedBy = enumFSAddedBy.User;
    }
    vSection.condition.push(vCondition);

    vWhereClause.section.push(vSection);

    vPrefillRule.whereClause = vWhereClause;

    return vPrefillRule;
}

//This class creates a new PrefillJSOn with no filters
function getNewPrefillJSON(pFS_Object_FormConfiguration) {

    var vPrefillRule = new PrefillRule();
    vPrefillRule.isActive = true;
    vPrefillRule.objectOrder = 1;
    vPrefillRule.objDisplayName = pFS_Object_FormConfiguration.ObjectName;
    vPrefillRule.sfObjectName = pFS_Object_FormConfiguration.SFObjectName;
    vPrefillRule.objectFSType = pFS_Object_FormConfiguration.ObjectFSType;
    vPrefillRule.letter = pFS_Object_FormConfiguration.Letter;
    vPrefillRule.refFieldName = pFS_Object_FormConfiguration.RelatedField;
    vPrefillRule.prefillSource = pFS_Object_FormConfiguration.prefillSource;

    var vWhereClause = new WhereClauseObj();
    vWhereClause.ruleop = 'AND';

    var vSection = new SectionObj();
    vSection.condIndex = 1;
    vSection.ruleop = 'AND';

    var vCondition = new WhereCondition();
    vCondition.op = 'AND';
    vCondition.operand1 = '';
    vCondition.operand2.otext = '';
    vCondition.operand2.otype = enumMatchingFieldType.Static;
    vCondition.addedBy = enumFSAddedBy.User;
    vSection.condition.push(vCondition);


    vWhereClause.section.push(vSection);

    vPrefillRule.whereClause = vWhereClause;

    return vPrefillRule;
}
