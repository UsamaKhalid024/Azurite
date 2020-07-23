@isTest
public class CopyReservationsTriggerHandlerTest {
    @isTest static void CopyReservationsItenaryTesting(){
        Test.startTest();
        
        	
        
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
                NewTestContact.AccountId = GenerateAcc('Account');
                Insert NewTestContact;
        		
        		
        		Contact NewTestDoc = new Contact();
                NewTestDoc.RecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Doctor').getRecordTypeId();
                NewTestDoc.FirstName = 'Test 2';
                NewTestDoc.LastName = 'Contact';
                NewTestDoc.Passport_Country__c = 'Pakistan';
                NewTestDoc.Gender__c = 'Male';
                NewTestDoc.Birthdate = System.today();
                NewTestDoc.Phone = '923135290107';
                NewTestDoc.Email = 'Testing123@gmail.com';
                NewTestDoc.About__c = 'This is testing about information';
                NewTestDoc.Profile_Picture__c = '015O0000003CMEi';
                NewTestDoc.AccountId = GenerateAcc('Account');
                Insert NewTestDoc;
        		
        
                Booking__c NewTestBooking = new Booking__c();
                NewTestBooking.Name = 'New Booking__['+NewTestContact.FirstName+' '+NewTestContact.LastName+']';
                NewTestBooking.Status__c = 'Open';
                NewTestBooking.Contact__c = NewTestContact.Id;
                Insert NewTestBooking;
        
        			Hotel_Reservation__c NewRes = new Hotel_Reservation__c();
        			NewRes.Name = 'Hotel_[Testing Reservation]';
        			NewRes.Contact__c = NewTestContact.Id;
        			NewRes.Hotel__c = GenerateAcc('Hotel');
        			NewRes.Hotel_Details__c = 'Reservation no. 2599120 Daily Buffet Breakfast 2 persons One Bedroom Suite Unlimited Wifi CHATRIUM RESIDENCE SATHON BANGKOK 291 Soi Naradhiwas Rajanagarindra 24, New Sathon Road, Bangkok 10120, Thailand Tel: +66 (0) 2672 0200 Fax: +66 (0) 2672 0190 Email: info.crst@chatrium.com';
        			NewRes.Booking__c = NewTestBooking.Id;
                        Datetime Checkin = Datetime.newInstance(2020, 2, 17);
                        Datetime Checkout = Checkin.addDays(2);
        			NewRes.check_in__c = Checkin;
        			NewRes.Check_out__c = Checkout;
        			Insert NewRes;
        			
        				List<Taxi_Booking__c> TaxiBookingsToCreate = new List<Taxi_Booking__c>();
                        for(Integer i=0; i<4; i++){
                            Taxi_Booking__c Newtesttaxi = new Taxi_Booking__c();
                            Newtesttaxi.Name = 'New Taxi Booking_['+i+']';
                            Newtesttaxi.Contact__c = NewTestContact.Id;
                            Newtesttaxi.Booking__c = NewTestBooking.Id;
                            	Datetime pickup = Datetime.newInstance(2020, 2, 17);
                            Newtesttaxi.Pickup_Date_Time__c = pickup;
                            	Datetime Dropoff = pickup.addDays(i);
                            Newtesttaxi.Drop_off_Date_Time__c = Dropoff;
                            Newtesttaxi.Pickup_Drop_Location__c = 'Testing location for test';
                            Newtesttaxi.Route_Details__c = 'Testing Route Details for test';
                            TaxiBookingsToCreate.add(Newtesttaxi);
                        }
        
        				List<Session__c> ListSess = new List<Session__c>();
        				for(Integer i=0; i<4; i++){
                            Session__c SurgerySess = new Session__c();
                            SurgerySess.Start_Date__c = System.today();
                            SurgerySess.End_Date__c = System.today() + i;
                            
                            SurgerySess.Booking__c = NewTestBooking.Id;
                            SurgerySess.Doctor__c = NewTestDoc.Id;
                            ListSess.add(SurgerySess);
                        }
        				Insert ListSess;
        
                        if(TaxiBookingsToCreate.size() > 0){
                            Insert TaxiBookingsToCreate;
                        }
        
                        Itenrary__c NewTestItenrary = new Itenrary__c();
                        NewTestItenrary.Name = 'Testing Itenrary';
                        //NewTestItenrary.CurrencyIsoCode = 'AUD';
                        NewTestItenrary.Airport_Instructions__c = 'Testing aitport instructions';
                        NewTestItenrary.Customer_contact__c = NewTestContact.Id;
                        NewTestItenrary.Booking__c = NewTestBooking.Id;
                        Insert NewTestItenrary;
        Test.stopTest();
    }
    
    Private static Id GenerateAcc(String Acctype){
        Account NewTestAccount = New Account();
        NewTestAccount.Name = 'Testing Account';
        NewTestAccount.Phone = '+923135290107';
        NewTestAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get(Acctype).getRecordTypeId();
        if(Acctype == 'Hotel'){
            NewTestAccount.Hotel_Address__c = '401 7th Ave, New York, NY 10001, United States';
        }
        Insert NewTestAccount;
        return NewTestAccount.Id;
    }
}