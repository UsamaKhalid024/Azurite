@isTest
public class ItenraryCtrlTest {
    @isTest static void TestItenrary(){
        Test.startTest();
        	Account NewTestHotel = New Account();
        	NewTestHotel.Name = 'Testing Hotel';
        	NewTestHotel.Phone = '+923135290107';
        	NewTestHotel.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Hotel').getRecordTypeId();
        	Insert NewTestHotel;
        
        	Account NewTestAccount = New Account();
        	NewTestAccount.Name = 'Testing Account';
        	NewTestAccount.Phone = '+923135290107';
        	NewTestAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Account').getRecordTypeId();
        	Insert NewTestAccount;
        
        	Account NewTestAccountDoc = New Account();
        	NewTestAccountDoc.Name = 'Testing Account Doc';
        	NewTestAccountDoc.Phone = '+923135290107';
        	NewTestAccountDoc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Account').getRecordTypeId();
        	Insert NewTestAccountDoc;
        
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
        
        
        	Booking__c NewTestBooking = new Booking__c();
        	NewTestBooking.Name = 'New Booking__['+NewTestContact.FirstName+' '+NewTestContact.LastName+']';
        	NewTestBooking.Status__c = 'Open';
        	NewTestBooking.Contact__c = NewTestContact.Id;
        	Insert NewTestBooking;
        	
        	Taxi_Booking__c NewTestTaxi = new Taxi_Booking__c();
        	NewTestTaxi.Name = 'Test taxi';
        	NewTestTaxi.Pickup_Date_Time__c = system.today()+2;
        	NewTestTaxi.Drop_off_Date_Time__c = system.today()+4;
        	NewTestTaxi.Booking__c = NewTestBooking.Id;
        	NewTestTaxi.Contact__c = NewTestContact.Id;
        	Insert NewTestTaxi;
        
            Itenrary__c NewTestItenrary = new Itenrary__c();
            NewTestItenrary.Name = 'Testing Itenrary';
            //NewTestItenrary.CurrencyIsoCode = 'AUD';
            NewTestItenrary.Airport_Instructions__c = 'Testing aitport instructions';
            NewTestItenrary.Customer_contact__c = NewTestContact.Id;
        	NewTestItenrary.Booking__c = NewTestBooking.Id;
            Insert NewTestItenrary;
        	
        	Datetime myDateTime = Datetime.newInstance(2019, 2, 17);
        	List<Itenrary_Line_Item__c> LineItems = new list<Itenrary_Line_Item__c>();
            for(Integer i = 0; i < 5; i++){
                Itenrary_Line_Item__c NewLineItems = new Itenrary_Line_Item__c();
                NewLineItems.Name = String.valueOf(i);
                NewLineItems.Contact__c = NewTestContact.Id;
                if(i == 2){
                	NewLineItems.Hotel__c = NewTestHotel.Id;
                }
                NewLineItems.Itenrary_Items__c = NewTestItenrary.Id;
                NewLineItems.Program_Itinerary_Info__c = '<b>Testing Info</b> for the test class';
                NewLineItems.Program_Itinerary_Details__c = '1055 Ekachai Road, Bangbon, Bangbon, Bangkok 10150';
                NewLineItems.Start_Date__c = myDateTime;
                Datetime newDateTime = myDateTime.addDays(i);
                NewLineItems.End_Date__c = newDateTime;
                NewLineItems.Booking__c = NewTestBooking.Id;
                LineItems.add(NewLineItems);
            }
        
        	List<Session__c> SessionList = new List<Session__c>();
            for(Integer i=0 ; i<5 ; i++){
                Session__c NewTestSess = new Session__c();
                NewTestSess.Start_Date__c = system.today()+i;
                NewTestSess.End_Date__c = system.today()+i+1;
                NewTestSess.Doctor__c = NewTestContactDoc.Id;
                NewTestSess.Medical_Balance__c = 120 + i;
                NewTestSess.Booking__c = NewTestBooking.Id;
                SessionList.add(NewTestSess);
            }
        	Insert SessionList;
        
        
            if(LineItems.size() > 0){
                Insert LineItems;
            }
        	
        	PageReference pageRf = Page.ItineraryPDF;
        	Test.setCurrentPage(pageRf);
        	pageRf.getParameters().put('id', NewTestItenrary.Id);
        	
        	ApexPages.StandardController scc = new ApexPages.StandardController(NewTestItenrary);
        	ItenraryCtrl CtrlTest = new ItenraryCtrl(scc);
        	
        Test.stopTest();
    }
}