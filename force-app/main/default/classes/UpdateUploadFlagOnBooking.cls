global without sharing class UpdateUploadFlagOnBooking {
    @InvocableMethod
    public static void updateFlag(List<String> param) {
        String recordId = param[0].split('-')[0];
        String field = param[0].split('-')[1];
        Booking__c booking = new Booking__c(Id = recordId);
        if(field == 'visa')				booking.Is_visa_uploaded__c = true;
        else if(field == 'medical')		booking.Is_medical_uploaded__c = true;
        else if(field == 'passport')	booking.Is_passport_uploaded__c = true;
        else if(field == 'flight')		booking.Is_Flight_Info_uploaded__c = true;
        else if(field == 'waiver')      booking.is_waiver_uploaded__c = true;
        update booking;
    }
}