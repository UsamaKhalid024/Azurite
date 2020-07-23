/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class FormPaymentComponentController {
    @RemoteAction
    global static List<VisualAntidote.FFResultHelper> remoteDeletePaymentAccount(String paymentRecordid, String delaccid, String accType) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote.FFResultHelper> remoteGetAccountList(String paymentRecordid, String acctype) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote.FFHelper.FFOption> remoteGetAvailableFieldsListForPayment(String recordid) {
        return null;
    }
    @RemoteAction
    global static VisualAntidote__Payment_Currency__c remoteGetCurrencyInfo(String currencyid) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote.FFResultHelper> remoteGetCurrencyListWithSelectedItem(String paymentfieldrecid) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote__Payment_Currency__c> remoteGetCurrencyList() {
        return null;
    }
    @RemoteAction
    global static VisualAntidote.FFResultHelper remoteGetFieldsInfo(String paymentfieldrecid, String fieldListDSV) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote.FFResultHelper> remoteGetUpdatedAccountList(String paymentRecordid, String accountid, String accName, String accUsernm, String accPassword, String accSignature, String accType, Boolean isSandbox) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote.FFResultHelper> remoteGetUpdatedPaymentAccountList(String paymentRecordid, VisualAntidote.FormPaymentComponentController.PaymentAccountDetailsDTO pPaymentAccountDetailsDTO) {
        return null;
    }
    @RemoteAction
    global static List<String> remoteIsPaypalAccountInUse(String paypalaccid) {
        return null;
    }
    @RemoteAction
    global static VisualAntidote__Payment_Account__c remotePopulatePaymentAccountInfo(String accountid) {
        return null;
    }
    @RemoteAction
    global static VisualAntidote.FFResultHelper remotePopulatePaymentAccountInformation(String accountid) {
        return null;
    }
    @RemoteAction
    global static List<String> remotePopulatePaypalAccountInfo(String accountid) {
        return null;
    }
    @RemoteAction
    global static VisualAntidote__Payment_Field__c remoteSavePaymenfieldInfo(String paymentFieldRecId, String fieldName, String fieldValue) {
        return null;
    }
    @RemoteAction
    global static VisualAntidote.FFResultHelper remoteToggleTestMode(String paymentfieldrecid, Boolean updateTestMode) {
        return null;
    }
    global static VisualAntidote.FFResultHelper remoteToggleTestModeACCOUNTTEST(String paymentfieldrecid, Boolean updateTestMode) {
        return null;
    }
    @RemoteAction
    global static String remoteUpdatePaymenfieldInfo(VisualAntidote__Payment_Field__c paymentFieldRecord) {
        return null;
    }
    @RemoteAction
    global static List<VisualAntidote.FFResultHelper> remoteValidatePaymentInfo(String formrecid) {
        return null;
    }
global class PaymentAccountDetailsDTO {
}
}
