public class NewItenraryOverrideCtrl {
	@AuraEnabled
    public static Booking__c GetBookingValues(String recordId){
        return [SELECT Name, Contact__c, Contact__r.Name FROM Booking__c WHERE Id =: recordId];
    }
    
}