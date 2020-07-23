public class InvoicePDFCtrl {
    private String InvoiceId {set;get;}
    public breadwinner_qbo__Invoice__c InvoiceObj {set;get;}
    public breadwinner_qbo__Line_Item__c[] InvoiceLineItems {set;get;}

    
        
    public InvoicePDFCtrl(ApexPages.StandardController sc){
        InvoiceId = ApexPages.currentPage().getParameters().get('Id');
        try{	
            InvoiceObj = [SELECT Id, Name, 
                          			breadwinner_qbo__Customer_Name__c, 
                          			CreatedDate, CRN_Number__c, 
                          			breadwinner_qbo__Billing_Street_Address__c, 
                          			breadwinner_qbo__Billing_City__c, 
                          			breadwinner_qbo__Total__c,
                          			breadwinner_qbo__Due_Date__c,
                          			breadwinner_qbo__Sub_Total__c,
                          			breadwinner_qbo__Discount_Amount__c
                      FROM breadwinner_qbo__Invoice__c WHERE Id =: InvoiceId];
    		

           }catch(exception e){}
        try{
            InvoiceLineItems = [SELECT Id, breadwinner_qbo__Service_Date__c, breadwinner_qbo__Product_Service__c, breadwinner_qbo__Description__c, breadwinner_qbo__Amount__c
                            FROM breadwinner_qbo__Line_Item__c WHERE breadwinner_qbo__Invoice__r.Id =: InvoiceId];
            }catch(exception e){}
    }
    

}