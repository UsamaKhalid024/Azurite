/**
 * @File Name          : CopyReservationsTriggerHandler.cls
 * @Description        : 
 * @Author             : ChangeMeIn@UserSettingsUnder.SFDoc
 * @Group              : 
 * @Last Modified By   : ChangeMeIn@UserSettingsUnder.SFDoc
 * @Last Modified On   : 27/11/2019, 1:57:53 pm
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    27/11/2019   ChangeMeIn@UserSettingsUnder.SFDoc     Initial Version
**/
public class CopyReservationsTriggerHandler {
	
    public static void CopyReservationsItenary(List<Itenrary__c> NewItenrary){
		Map<id, id> BookToIts = new Map<id, id>();
        Map<Id, List<Hotel_Reservation__c>> BookToHotelreservation = new Map<Id, List<Hotel_Reservation__c>>();
        Map<Id, List<Taxi_Booking__c>> BookToTaxiBooking = new Map<Id, List<Taxi_Booking__c>>();
        Map<Id, List<Session__c>> BookingToSessions = new Map<Id, List<Session__c>>();
        List<Itenrary_Line_Item__c> LineItemsToCreate = new List<Itenrary_Line_Item__c>();
        List<Itenrary_Line_Item__c> LineItemsToUpdate = new List<Itenrary_Line_Item__c>();

        String test;
        String ItenraryId;
        String Hotel_Address = '';
        
        
        List<id> Bookings = new List<id>();
        for(Itenrary__c its : NewItenrary){
            BookToIts.put(its.Booking__c, its.Id);
            Bookings.add(its.Booking__c);
        }
        
        for(Booking__c book : [SELECT id, 
                               	(SELECT id, Name, Contact__c, Hotel__r.Name, Hotel__r.Hotel_Address__c, Hotel_Details__c, CurrencyIsoCode, Booking__c, check_in__c, Check_out__c FROM Hotel_Reservations__r),
                               	(SELECT id, Name, Contact__c, CurrencyIsoCode, Booking__c, Pickup_Date_Time__c, Drop_off_Date_Time__c, Pickup_Drop_Location__c, Route_Details__c  FROM Taxi_Bookings__r),
                               	(SELECT Id, Name, Booking__c, Start_Date__c, End_Date__c, CurrencyIsoCode, Medical_Balance__c, Doctor__c, Doctor__r.FirstName, Doctor__r.LastName, Hospital__r.BillingCountry, Hospital__r.BillingCity, Hospital__r.BillingStreet, Procedures__c FROM Sessions__r)
                               FROM Booking__c WHERE Id IN : Bookings]){
            if( BookToIts.ContainsKey(book.Id) ){
            	BookToHotelreservation.put(book.Id, book.Hotel_Reservations__r);
                BookToTaxiBooking.put(book.Id, book.Taxi_Bookings__r);
                BookingToSessions.put(book.Id, book.Sessions__r);
        	}
        }
        //try{
            for(Itenrary__c ComingIts : NewItenrary){
                //test = BookToIts.get(ComingIts.Booking__c);
                if(BookToHotelreservation.get(ComingIts.Booking__c).size() > 0){
                    for(Hotel_Reservation__c resForIts : BookToHotelreservation.get(ComingIts.Booking__c)){
                        Itenrary_Line_Item__c LineItems = new Itenrary_Line_Item__c();
                        LineItems.Name = resForIts.Name;
                        LineItems.Contact__c = resForIts.Contact__c;
                        LineItems.Hotel__c = resForIts.Hotel__c;
                        LineItems.CurrencyIsoCode = resForIts.CurrencyIsoCode;
                        LineItems.Booking__c = resForIts.Booking__c; 
                        LineItems.Start_Date__c = resForIts.check_in__c;
                        LineItems.End_Date__c = resForIts.Check_out__c;
                        if(!String.isEmpty(resForIts.Hotel__r.Hotel_Address__c)){
                            Hotel_Address =  ' - ['+resForIts.Hotel__r.Hotel_Address__c+']';
                        }
                        LineItems.Program_Itinerary_Info__c = '<b>'+resForIts.Hotel__r.Name+'</b>'+Hotel_Address;
                        LineItems.Program_Itinerary_Details__c = resForIts.Hotel_Details__c;
                        LineItems.Itenrary_Items__c = BookToIts.get(ComingIts.Booking__c);
                        LineItemsToCreate.add(LineItems);
                    }
                }
                if(BookToTaxiBooking.get(ComingIts.Booking__c).size() > 0){
                    for(Taxi_Booking__c TaxiToBooks : BookToTaxiBooking.get(ComingIts.Booking__c)){
                        Itenrary_Line_Item__c LineItems = new Itenrary_Line_Item__c();
                        LineItems.Name = TaxiToBooks.Name;
                        LineItems.Contact__c = TaxiToBooks.Contact__c;
                        LineItems.CurrencyIsoCode = TaxiToBooks.CurrencyIsoCode;
                        LineItems.Booking__c = TaxiToBooks.Booking__c;
                        LineItems.Start_Date__c = TaxiToBooks.Pickup_Date_Time__c;
                        LineItems.End_Date__c = TaxiToBooks.Drop_off_Date_Time__c;
                        LineItems.Program_Itinerary_Info__c = TaxiToBooks.Pickup_Drop_Location__c;
                        LineItems.Program_Itinerary_Details__c = TaxiToBooks.Route_Details__c;
                        LineItems.Itenrary_Items__c = BookToIts.get(ComingIts.Booking__c);
                        LineItemsToCreate.add(LineItems);
                    }
                }
                if(BookingToSessions.get(ComingIts.Booking__c).size() > 0){
                    for(Session__c SessionToBooks : BookingToSessions.get(ComingIts.Booking__c)){
                        String BillingStreet = '';
                        String BillingCity = '';
                        String BillingCountry = '';
                        String Procedures = '';
                        Decimal Balance;
                        Itenrary_Line_Item__c LineItems = new Itenrary_Line_Item__c();
                        LineItems.Name = SessionToBooks.Name;
                        LineItems.Contact__c = SessionToBooks.Doctor__c;
                        LineItems.CurrencyIsoCode = SessionToBooks.CurrencyIsoCode;
                        LineItems.Booking__c = SessionToBooks.Booking__c;
                        LineItems.Start_Date__c = SessionToBooks.Start_Date__c;
                        LineItems.End_Date__c = SessionToBooks.End_Date__c;
                        
                        if(!String.isEmpty(SessionToBooks.Hospital__r.BillingStreet)){
                            BillingStreet = SessionToBooks.Hospital__r.BillingStreet+'<br/>';
                        }
                        if(!String.isEmpty(SessionToBooks.Hospital__r.BillingCity)){
                            BillingCity = SessionToBooks.Hospital__r.BillingCity+'<br/>';
                        }
                        if(!String.isEmpty(SessionToBooks.Hospital__r.BillingCountry)){
                            BillingCountry = SessionToBooks.Hospital__r.BillingCountry+'<br/>';
                        }
                        if(!String.isEmpty(SessionToBooks.Procedures__c)){
                            Procedures = SessionToBooks.Procedures__c;
                        }
                        if(SessionToBooks.Medical_Balance__c != null){
                            Balance = SessionToBooks.Medical_Balance__c;
                        }
                        
                        //LineItems.Program_Itinerary_Info__c = BillingStreet+BillingCity+BillingCountry;
                        LineItems.Program_Itinerary_Info__c = 'Surgery';
                       	LineItems.Program_Itinerary_Details__c = Procedures+'<br/>'+ SessionToBooks.Doctor__r.FirstName+' '+SessionToBooks.Doctor__r.LastName+'<br/>'+Balance;
                        LineItems.Itenrary_Items__c = BookToIts.get(ComingIts.Booking__c);
                        LineItemsToCreate.add(LineItems);
                    }
                }
                // ======== >>>> Get Line Items <<<< ==========
                ItenraryId = BookToIts.get(ComingIts.Booking__c);
                // ============================================
            }
        //} catch (Exception e){
            //throw new AuraHandledException('Error Message' + e.getMessage()+e.getStackTraceString());
        //}
        
        if(LineItemsToCreate.size() > 0){
            Insert LineItemsToCreate;
        }
        
        
        System.debug('Created Itenrary Id: '+ItenraryId);
        Integer counter = 1;
        for(Itenrary_Line_Item__c ItsLineItems : [SELECT Name FROM Itenrary_Line_Item__c WHERE Itenrary_Items__c =: ItenraryId ORDER BY Start_Date__c ASC]){
            ItsLineItems.Name = String.valueOf(counter);
            counter++;
            LineItemsToUpdate.add(ItsLineItems);
        }
        if(LineItemsToUpdate.size() > 0){
            Update LineItemsToUpdate;
        }
    }
}