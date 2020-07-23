global class InvoiceTriggerHandler {
    global static void ProcessOwnerAndCRN()
    {
        Set<String> accIds = new Set<String>();
        Set<String> CommunityUser = new Set<String>();
        Integer CRNList = 0;
        List<CRN_Number__c> CRNToUpdate = new List<CRN_Number__c>();
        Map<Id, String> AccToCon = new Map<Id, String>();
        Integer TotalCRNToGet;
        
        for(breadwinner_qbo__Invoice__c invoiceinfo : (List<breadwinner_qbo__Invoice__c>)Trigger.New){
            accIds.add(invoiceinfo.breadwinner_qbo__Account__c);
        }
        Map<Id,Id> accountToUser = new Map<Id,Id>();
        system.debug('Ids: '+accIds);
        system.debug([SELECT Id, Name, AccountId FROM User WHERE AccountId in : accIds]);
        for(User UserInfo : [SELECT Id, Name, AccountId FROM User WHERE AccountId in : accIds]){
            system.debug('test: '+UserInfo.AccountId);
            if (string.isNotBlank(UserInfo.AccountId)) {
                accountToUser.put(UserInfo.AccountId, UserInfo.Id);
            }
        }
		
        List<String> CRNsassigned = new List<String>();
        for(Contact ConInfo : [SELECT Id, AccountId,CRN_Number__c
                               FROM Contact Where AccountId IN : accIds ORDER BY CreatedDate DESC Limit 1]){
                 if(!String.isEmpty(ConInfo.CRN_Number__c) || ConInfo.CRN_Number__c != null){                 
                        AccToCon.put(ConInfo.AccountId, ConInfo.CRN_Number__c);
                     	CRNsassigned.add(ConInfo.CRN_Number__c);
                 } 
        }
        
        if(Trigger.New.size() > CRNsassigned.Size()){
            TotalCRNToGet = Trigger.New.size() - CRNsassigned.Size();
        } else {
            TotalCRNToGet = Trigger.New.size();
        }
        
        List<CRN_Number__c> CRN = [SELECT Id, Name, Number__c, CRN_Utilize__c FROM CRN_Number__c WHERE CRN_Utilize__c = false ORDER BY Name ASC LIMIT  :TotalCRNToGet];
        if(CRN.size() != TotalCRNToGet && CRNsassigned.size() == 0){
             throw new CustomException('CRN Numbers found are not sufficient: '+CRN.size());
        }
        
        
        for(breadwinner_qbo__Invoice__c invoiceinfo : (List<breadwinner_qbo__Invoice__c>)Trigger.New){
            if(accountToUser.containsKey(invoiceinfo.breadwinner_qbo__Account__c)){
                invoiceinfo.OwnerId = accountToUser.get(invoiceinfo.breadwinner_qbo__Account__c);
            }
            invoiceinfo.breadwinner_qbo__Custom_Field_1_Name__c = 'BPAY';
            if(AccToCon.containsKey(invoiceinfo.breadwinner_qbo__Account__c) && AccToCon.get(invoiceinfo.breadwinner_qbo__Account__c) != null){
                invoiceinfo.CRN_Number__c = AccToCon.get(invoiceinfo.breadwinner_qbo__Account__c);
                invoiceinfo.breadwinner_qbo__Custom_Field_1_Value__c = AccToCon.get(invoiceinfo.breadwinner_qbo__Account__c);
            }  else {
                invoiceinfo.CRN_Number__c = CRN[CRNList].Number__c;
                invoiceinfo.breadwinner_qbo__Custom_Field_1_Value__c = CRN[CRNList].Number__c;
                CRN[CRNList].CRN_Utilize__c = true;
                CRNToUpdate.add(CRN[CRNList]);
                CRNList++; 
            }
        }
        
        // Update used....please
        /*for(CRN_Number__c CrnInfo : CRN){
            CrnInfo.CRN_Utilize__c = true;
            CRNToUpdate.add(CrnInfo);
        }*/
        if(CRNToUpdate.size() > 0){
            update CRNToUpdate;
        }
       
    }
    public class CustomException extends Exception{}
	
   
    
    
    public static void syncInvoiceWithQBO(List<breadwinner_qbo__Invoice__c> NewList, Map<id, breadwinner_qbo__Invoice__c> OldMap, Boolean isInsert)
    {
        
        InvoiceDTO Newdto;
        for(breadwinner_qbo__Invoice__c inv : NewList){
            if(inv.breadwinner_qbo__Invoice_Id__c != null && inv.breadwinner_qbo__Custom_Field_1_Value__c != null && 
              			(isInsert || (!isInsert && 
                                              		(OldMap.get(inv.Id).breadwinner_qbo__Invoice_Id__c != inv.breadwinner_qbo__Invoice_Id__c 
                                                     || OldMap.get(inv.Id).breadwinner_qbo__Custom_Field_1_Value__c != inv.breadwinner_qbo__Custom_Field_1_Value__c ))))
            {
                Newdto = new InvoiceDTO();
                Newdto.SyncToken = '0';
                Newdto.Id = inv.breadwinner_qbo__Invoice_Id__c.split('-', 4)[2];
                Newdto.sparse = true;
                //system.debug('Newdto.Id : '+ Newdto.Id);
                List<CustomField> Fields = new List<CustomField>();
                CustomField CusField = new CustomField();
                CusField.DefinitionId = '1';
                CusField.Name = 'BPAY';
                CusField.Type = 'StringType';
                CusField.StringValue = inv.breadwinner_qbo__Custom_Field_1_Value__c;
                Fields.add(CusField);
                
                Newdto.CustomField = Fields;
            }
            if(Newdto != null){
                 UpdateInvoiceAPI(JSON.serialize(Newdto));   
            }
        }
    }
       
	@Future(callout=true)   
    global static void UpdateInvoiceAPI(String body){
        InvoiceResources.UpdateQBInvoice(body);
    }
    
    
    public String CRNGenerator(){
        return '';
    }
    
    
    //{"SyncToken": "0", "Id": "2183",  "sparse": true, "CustomField": [{"DefinitionId" : "1","Name" : "BPAY","Type" : "StringType","StringValue" : "0091990"}]}
    public class CustomField
    {
        public string DefinitionId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string StringValue { get; set; }
    }
    
    public class InvoiceDTO
    {
        public string SyncToken { get; set; }
        public string Id { get; set; }
        public boolean sparse { get; set; }
        public List<CustomField> CustomField { get; set; }
    }
}