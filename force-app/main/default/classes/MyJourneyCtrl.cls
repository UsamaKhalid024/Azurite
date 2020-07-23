public without sharing class MyJourneyCtrl {
	@AuraEnabled
    Public static Booking__c GetBooking(String UserId){
		Booking__c BookingInfo = [SELECT Id, 
                                  Name, 
                                  createdDate, 
                                  Procedures_Requested_Please_Specify__c,
                                  Personal_Assistant__r.FirstName, 
                                  Personal_Assistant__r.LastName,
                                  Personal_Assistant__r.About__c,
                                  Personal_Assistant__r.Profile_Picture__c, 
                                  Dental__r.Account.BillingStreet,
                                  Dental__r.Account.BillingCity,
                                  Dental__r.Account.BillingCountry,
                                  Dentist_Time__c,
                                  Service__c,
                                  Contact__r.Hospital_Balance__c,
                                  Total_Medical_Balance__c
                                  FROM booking__c where contact__c in (SELECT contactId from user where Id =: UserId) order by createdDate desc limit 1];
        return BookingInfo;
    }
    
    @AuraEnabled
    public static Map<String, List<Session__c>> GetSessions(String BookId){
        system.debug('BookId : '+BookId);
        List<Session__c> Sessions = new List<Session__c>();
        Map<String, List<Session__c>> NewSess = new Map<String, List<Session__c>>();
        Sessions = [SELECT Id, Name, 
                    CreatedDate,
                    Procedures__c,
                    Medical_Balance__c,
                    Doctor__r.FirstName,
                    Doctor__r.LastName,
                    Doctor__r.About__c,
                    Doctor__r.Profile_Picture__c,
                    Start_Date__c,
                    End_Date__c,
                    Hospital__r.Name,
                    Hospital__r.BillingStreet, 
                    Hospital__r.BillingCity, 
                    Hospital__r.BillingCountry,
                    Session_days__c,
                    CurrencyISOCode
                    FROM Session__c WHERE Booking__r.Id =: BookId order by createdDate ASC];
		NewSess.put('FirstLog', Sessions);
        return NewSess;
    }
    
    
    @AuraEnabled
    public static List<Id> GetAttachments(String BookingId){
        list<Id> attachmentId = new List<Id>();
        List<Id> ContentVersionIds = new List<Id>();
        for(ContentDocumentLink conts : [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: BookingId]){
            attachmentId.add(conts.ContentDocumentId);
        }
        system.debug(attachmentId);
        for(ContentVersion ConverIds : [select id from contentversion where contentdocumentid IN : attachmentId  AND (FileType = 'PNG' OR FileType = 'JPG' OR FileType = 'JPEG' OR FileType = 'png' OR FileType = 'jpg' OR FileType = 'jpeg')]){
            ContentVersionIds.add(ConverIds.Id);
        }
        return ContentVersionIds;
    }
}