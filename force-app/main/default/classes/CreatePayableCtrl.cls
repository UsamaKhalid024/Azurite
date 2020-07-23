public class CreatePayableCtrl {
	@AuraEnabled
    public static Booking__c GetPayable(String BookingId){
        return [SELECT Id, Doctor__c FROM Booking__c WHERE Id =: BookingId];
    }
    
}