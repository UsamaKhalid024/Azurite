public with sharing class PackageCalculatorCtlr {
    
    @AuraEnabled
    public static void saveDates(String startDate, String StartDate2, String endDate, String endDate2, String recordId){
        try{
            if(recordId != null && !String.isEmpty(recordId)){
                
            }
            Booking__c booking = new Booking__c();
            booking.Id = recordId;
            booking.Start_Date__c = Date.valueOf(startDate);
            booking.Start_Date_2__c = Date.valueOf(StartDate2);
            booking.End_Date__c = Date.valueOf(endDate);
            booking.End_Date_2__c = Date.valueOf(endDate2);
            
            update booking;
            
        }catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        } 
    }
}