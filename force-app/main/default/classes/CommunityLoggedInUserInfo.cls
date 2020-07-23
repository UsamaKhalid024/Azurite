public class CommunityLoggedInUserInfo {
	@AuraEnabled
    public static List<User> UserInfo(String UserId){
        List<User> userinfo = [SELECT Id, FirstName, LastName, Account.BillingCountry, Contact.Gender__c, Account.BillingStreet, Account.BillingCity,
                               Account.BillingState, Account.BillingPostalCode, Contact.Email, Contact.Phone FROM User Where Id =: UserId ];
        return userinfo;
    }
    
    @AuraEnabled
    public static string saveChunk(String fileName, String base64Data, String contentType, String fileId) {
        String SuperanuationId = '';
        if(fileId == ''){
        	   SuperanuationId = createSuperannuation(fileName, base64Data, contentType);
        }
        return SuperanuationId;
    }
    private static String createSuperannuation(String fileName, String base64Data, String contentType){
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        Superannuation__c NewSuperannuation = new Superannuation__c();
        Insert NewSuperannuation;
        
        // ===== >>> Creating Superanuation Attachment <<< ======
        Attachment oAttachment = new Attachment();
        oAttachment.parentId = NewSuperannuation.Id;
        
        oAttachment.Body = EncodingUtil.base64Decode(base64Data);
        oAttachment.Name = fileName;
        oAttachment.ContentType = contentType;
        
        insert oAttachment;
        // ======================================================
        
        return NewSuperannuation.Id;
    }
}