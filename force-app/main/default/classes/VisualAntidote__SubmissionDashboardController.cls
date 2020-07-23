/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class SubmissionDashboardController extends VisualAntidote.FormstackController {
    global static String getParsedXMLForSearch(String toParse) {
        return null;
    }
    global static String getWhereDateClause(String dateFieldName, String dateFieldString, String dateValue) {
        return null;
    }
    global static String getXMLNodeText(dom.XmlNode node) {
        return null;
    }
    global static Boolean isSearchTextFound(String searchableField, String searchvalue) {
        return null;
    }
    global static Boolean isSearchTextFoundInXML(String searchableXML, String searchvalue, Boolean addRootElement) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote.FFResultHelper> remoteDeleteSubmissions(List<String> submissionIds) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote__Submission__c> remoteGetAllFormSubmissionIDs(String orderByFieldName, String direction, List<String> formIDList, List<String> statusFilterList, List<VisualAntidote.FFHelper.FFOption> fieldsFilterArr) {
        return null;
    }
    global static List<VisualAntidote__Submission__c> remoteGetAllSubmissionIDs(String orderByFieldName, String direction, List<String> formIDList, List<String> statusFilterList) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote__Submission__c> remoteGetAllSubmissions(List<String> fieldList, Integer pageSize, List<String> submissionIdList, String orderByFieldName, String direction) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote__Fast_Forms_Dashboard_Info__c> remoteGetDashboardSettingsInfo() {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote__Submission_Dashboard_Settings__c> remoteGetDashboardSettings() {
        return null;
    }
    @RemoteAction
    global static String remoteGetFormName(String recid) {
        return null;
    }
    @RemoteAction
    global static String remoteGetFormNameList(String searchInp) {
        return null;
    }
    @RemoteAction
    global static VisualAntidote.FFResultHelper remoteNativeResubmit(String submissionIdCSV) {
        return null;
    }
    @RemoteAction
    global static Object remoteResubmitCallout(String url) {
        return null;
    }
    @RemoteAction
    global static String remoteResubmitCalloutFuture(String url) {
        return null;
    }
}
