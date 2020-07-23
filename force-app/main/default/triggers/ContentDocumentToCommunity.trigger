trigger ContentDocumentToCommunity on ContentDocumentLink (before insert) {
	
    Schema.DescribeSObjectResult r = Booking__c.sObjectType.getDescribe();
    String keyPrefix = r.getKeyPrefix();

      for(ContentDocumentLink cdl : Trigger.New){
        if((String.valueOf(cdl.LinkedEntityId)).startsWith(keyPrefix)){
          //cdl.ShareType = 'I';
          cdl.Visibility = 'AllUsers';
          } 
       }
    
}