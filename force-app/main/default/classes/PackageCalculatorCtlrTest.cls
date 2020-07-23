@isTest
public class PackageCalculatorCtlrTest {
    @isTest static void PackageCtrlTest(){
        Test.startTest();
        	String StartDate = string.valueOfGmt(system.today());
        	String StartDate2 = string.valueOfGmt(system.today());
        	String endDate = string.valueOfGmt(system.today()+2);
        	String endDate2 = string.valueOfGmt(system.today()+3);
        	
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
        
        	Booking__c NewTestBooking = new Booking__c();
        	NewTestBooking.Name = 'New Booking__['+NewTestContact.FirstName+' '+NewTestContact.LastName+']';
        	NewTestBooking.Status__c = 'Open';
        	NewTestBooking.Contact__c = NewTestContact.Id;
        	Insert NewTestBooking;
        	

        	PackageCalculatorCtlr.saveDates(StartDate, StartDate2, endDate, endDate2, NewTestBooking.Id);
        Test.stopTest();
    }
}