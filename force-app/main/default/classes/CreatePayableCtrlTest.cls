@IsTest
public class CreatePayableCtrlTest {
    @IsTest static void CreatePayableCtrltest(){
        Test.startTest();
        	
            Account NewTestAccount = New Account();
            NewTestAccount.Name = 'Testing Account';
            NewTestAccount.Phone = '+923135290107';
            NewTestAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Account').getRecordTypeId();
            Insert NewTestAccount;
        
        	Contact NewTestContact = new Contact();
            NewTestContact.RecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Customer').getRecordTypeId();
            NewTestContact.FirstName = 'Test';
            NewTestContact.LastName = 'Contact';
            NewTestContact.Passport_Country__c = 'Pakistan';
            NewTestContact.Gender__c = 'Male';
            NewTestContact.Birthdate = System.today();
            NewTestContact.Phone = '923135290107';
            NewTestContact.Email = 'fahad.munawar.khan@gmail.com';
            NewTestContact.About__c = 'This is testing about information';
            NewTestContact.Profile_Picture__c = '015O0000003CMEi';
        	NewTestContact.AccountId = NewTestAccount.Id;
            Insert NewTestContact;
        
        	Contact NewTestDoctor = new Contact();
            NewTestDoctor.RecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Doctor').getRecordTypeId();
            NewTestDoctor.FirstName = 'Testing new';
            NewTestDoctor.LastName = 'Contact';
            NewTestDoctor.Passport_Country__c = 'Pakistan';
            NewTestDoctor.Gender__c = 'Male';
            NewTestDoctor.Birthdate = System.today();
            NewTestDoctor.Phone = '923135290107';
            NewTestDoctor.Email = 'test@gmail.com';
            NewTestDoctor.About__c = 'This is testing about information';
            NewTestDoctor.Profile_Picture__c = '015O0000003CMEi';
        	NewTestDoctor.AccountId = NewTestAccount.Id;
            Insert NewTestDoctor;
        
        	Booking__c NewTestBooking = new Booking__c();
        	NewTestBooking.Name = 'New Booking__['+NewTestContact.FirstName+' '+NewTestContact.LastName+']';
        	NewTestBooking.Status__c = 'Open';
        	NewTestBooking.Contact__c = NewTestContact.Id;
        	NewTestBooking.Doctor__c = NewTestDoctor.Id;
        	Insert NewTestBooking;
        
        	CreatePayableCtrl.GetPayable(NewTestBooking.Id);
        Test.stopTest();
    }
}