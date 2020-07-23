<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>VisualAntidote__Copy_Type_to_One_Primary_User</fullName>
        <description>Enforce one primary user constraint</description>
        <field>VisualAntidote__One_Primary_User__c</field>
        <formula>IF(ISPICKVAL(VisualAntidote__Type__c, &quot;Primary&quot;), &quot;Primary&quot;, VisualAntidote__User__c)</formula>
        <name>Copy Type to One Primary User</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>VisualAntidote__Copy_User_to_User_Is_Unique</fullName>
        <description>Enforce unique User constraint</description>
        <field>VisualAntidote__User_Is_Unique__c</field>
        <formula>VisualAntidote__User__c</formula>
        <name>Copy User to User Is Unique</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>VisualAntidote__User Changed</fullName>
        <actions>
            <name>VisualAntidote__Copy_User_to_User_Is_Unique</name>
            <type>FieldUpdate</type>
        </actions>
        <active>false</active>
        <formula>ISCHANGED(VisualAntidote__User__c) ||  ISNEW()</formula>
        <triggerType>onAllChanges</triggerType>
    </rules>
    <rules>
        <fullName>VisualAntidote__User or Type Changed</fullName>
        <actions>
            <name>VisualAntidote__Copy_Type_to_One_Primary_User</name>
            <type>FieldUpdate</type>
        </actions>
        <active>false</active>
        <formula>ISCHANGED(VisualAntidote__Type__c) || ISCHANGED(VisualAntidote__User__c) ||  ISNEW()</formula>
        <triggerType>onAllChanges</triggerType>
    </rules>
</Workflow>
