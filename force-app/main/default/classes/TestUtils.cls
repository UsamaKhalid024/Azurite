@isTest
public class TestUtils {
    public static Booking__c createBooking(Boolean doInsert, Id contactId)
    {
        Booking__c NewBooking = new Booking__c();
        NewBooking.Name = 'Booking ';
        NewBooking.Contact__c = ContactId;
        
        //NewBooking.Superannuation__c = !String.isEmpty(CurrentLead.SuperannutionId__c) && CurrentLead.SuperannutionId__c != null ? CurrentLead.SuperannutionId__c : null;
        
        NewBooking.Preferred_Date_of_Surgery__c = Date.today()+(1);
        NewBooking.Alternate_Date_of_Surgery__c = Date.today()+(10);
        NewBooking.Emergency_Contact_Name__c = 'Fahad';
        NewBooking.Emergency_Contact_Phone__c = '123';
        NewBooking.Current_bra_size__c = 'not sure';
        NewBooking.Desired_bra_size__c = 'any';
        NewBooking.Desired_placement_of_implants__c = 'Behind of muscle';
        NewBooking.Desired_Implants__c = 'Saline';
        NewBooking.Desired_Incision__c = 'Armpits';
        
        NewBooking.Companion_Date_of_Birth__c = Date.today()+(-3000);
        NewBooking.Companion_Name__c = 'gusta';
        NewBooking.Procedure_Type__c = 'General';
        NewBooking.Procedures_Requested_Please_Specify__c = 'Any';
        
        if(doInsert)
            Insert NewBooking;
        return newBooking;
    }
    public static User createCommunityUser(Boolean doInsert)
    {
        Id p = [select id from profile where name='Azurite Customer Community User'].id;
        
        Account ac = new Account(name ='Grazitti') ;
        insert ac; 
        
        Contact con = new Contact(LastName ='testCon',AccountId = ac.Id);
        insert con;  
        
        User user = new User(alias = 'test123', email='test123@noemail.com',
                             emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                             localesidkey='en_US', profileid = p, country='United States',IsActive =true,
                             ContactId = con.Id,
                             timezonesidkey='America/Los_Angeles', username='tester@noemail.com');
        if(doInsert)
            insert user;
        return user;
    }
}