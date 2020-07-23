trigger CopyReservationsTrigger on Itenrary__c (After insert) {
	
    if(Trigger.isInsert && Trigger.isAfter){
       	CopyReservationsTriggerHandler.CopyReservationsItenary(Trigger.New);
    }
    
}