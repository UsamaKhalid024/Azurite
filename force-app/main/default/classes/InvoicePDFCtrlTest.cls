@IsTest(SeeAllData=true)
public class InvoicePDFCtrlTest {
    @IsTest static void InvoicePDFCtrlTest(){
        Test.startTest();
            breadwinner_qbo__Invoice__c NewInvoice = new breadwinner_qbo__Invoice__c();
            NewInvoice.Name = 'Testing Invoice';
            Newinvoice.breadwinner_qbo__Billing_Street_Address__c = 'testing address';
            Insert NewInvoice;
            
            CRN_Number__c crntest = new CRN_Number__c();
            crntest.Number__c = 'CRN-3355';
        	crntest.CRN_Utilize__c = false;
            Insert crntest;
        
            PageReference pageRef = Page.InvoicePDF;
            Test.setCurrentPage(pageRef);
            pageRef.getParameters().put('id',NewInvoice.Id);
            
            ApexPages.StandardController sc = new ApexPages.StandardController(NewInvoice);
            InvoicePDFCtrl Ipc = new InvoicePDFCtrl(sc);
        Test.stopTest();
    }
}