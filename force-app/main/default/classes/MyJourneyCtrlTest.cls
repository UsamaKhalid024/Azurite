@isTest
public class MyJourneyCtrlTest {
	public static testmethod void testMyJourneyCtrl()
    {
        test.startTest();
        User u = testUtils.createCommunityUser(true);
        Booking__c book = TestUtils.createBooking(true, u.ContactId);
        
        
        
        Booking__c theBooking = MyJourneyCtrl.GetBooking(u.Id);
        
        Account NewTestAccountDoc = New Account();
        NewTestAccountDoc.Name = 'Testing Account Doc';
        NewTestAccountDoc.Phone = '+923135290107';
        NewTestAccountDoc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Account').getRecordTypeId();
        Insert NewTestAccountDoc;
        
        Contact NewTestContactDoc = new Contact();
        NewTestContactDoc.RecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Doctor').getRecordTypeId();
        NewTestContactDoc.FirstName = 'Test Doctor';
        NewTestContactDoc.LastName = 'Contact 2';
        NewTestContactDoc.Passport_Country__c = 'Pakistan';
        NewTestContactDoc.Gender__c = 'Male';
        NewTestContactDoc.Birthdate = System.today();
        NewTestContactDoc.Phone = '923135290107';
        NewTestContactDoc.Email = 'testing2@gmail.com';
        NewTestContactDoc.About__c = 'This is testing about information';
        NewTestContactDoc.Profile_Picture__c = '015O0000003CMEi';
        NewTestContactDoc.AccountId = NewTestAccountDoc.Id;
        Insert NewTestContactDoc;
        
        List<Session__c> sesstocheck = new List<Session__c>();
        for(Integer i=0; i<4; i++){
            Session__c testsess = new Session__c();
            testsess.Start_Date__c = system.today()+i;
            testsess.End_Date__c = system.today()+i+1;
            testsess.Doctor__c = NewTestContactDoc.Id;
            testsess.Booking__c = theBooking.Id;
            testsess.Medical_Balance__c = 120+i;
            sesstocheck.add(testsess);
        }
        Insert sesstocheck;
        CreateAttachments(theBooking.Id);
        MyJourneyCtrl.GetAttachments(theBooking.Id);
        MyJourneyCtrl.GetSessions(theBooking.Id);
        test.stopTest();
    }
    
    
    public static void CreateAttachments(String parentId){
        
        Blob beforeblob=Blob.valueOf('Unit Test Attachment Body');
        ContentVersion cv = new ContentVersion();
        cv.title = 'test content trigger';      
        cv.PathOnClient ='test';           
        cv.VersionData =beforeblob;          
        insert cv;         
        
        ContentVersion testContent = [SELECT id, ContentDocumentId FROM ContentVersion where Id = :cv.Id];
        
        ContentDocumentLink contentlink=new ContentDocumentLink();
        contentlink.LinkedEntityId= parentId;
        contentlink.ShareType= 'V';
        contentlink.ContentDocumentId = testContent.ContentDocumentId;
        contentlink.Visibility = 'AllUsers'; 
        insert contentlink;
    }
}