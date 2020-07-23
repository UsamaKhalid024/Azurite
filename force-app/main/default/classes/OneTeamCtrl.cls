public without sharing class OneTeamCtrl {
	@AuraEnabled
    public static Contact[] GetPersonalAssContacts(){
        return [SELECT Id, FirstName, LastName, Show_On_Home__c, Profile_Picture__c, Profile_Picture_Test__c, About__c FROM Contact WHERE Show_On_Home__c = true];
    }
}