trigger Invoice on breadwinner_qbo__Invoice__c (before insert, after insert) {
    
    
    if(Trigger.isBefore && Trigger.isInsert){
        InvoiceTriggerHandler.ProcessOwnerAndCRN();
    }
    
    if(Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate)){
        if(Trigger.new.size() == 1)
        {
            InvoiceTriggerHandler.syncInvoiceWithQBO(Trigger.New, Trigger.OldMap, Trigger.isInsert);
        }
    }
    
}