@IsTest
public class OneTeamCtrlTest {
    @IsTest static void GetPersonalAssContactsTest(){
        Test.startTest();
            Contact NewTestContact = new Contact();
            NewTestContact.FirstName = 'Test';
            NewTestContact.LastName = 'Contact';
            NewTestContact.Show_On_Home__c = true;
            NewTestContact.Profile_Picture__c = '015O0000003CMEi';
            NewTestContact.Profile_Picture_Test__c = '';
            NewTestContact.About__c = 'Anna joined our team last year as an.';
            Insert NewTestContact;
        	OneTeamCtrl.GetPersonalAssContacts();
        Test.stopTest();
    } 
}