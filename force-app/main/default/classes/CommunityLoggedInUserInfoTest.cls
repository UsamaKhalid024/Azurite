@IsTest
public class CommunityLoggedInUserInfoTest {
    @IsTest static void UserInfoTest(){
        
	Test.startTest();
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User']; 
        
        String orgId = UserInfo.getOrganizationId();
        String dateString = 
            String.valueof(Datetime.now()).replace(' ','').replace(':','').replace('-','');
        Integer randomInt = Integer.valueOf(math.rint(math.random()*1000000));
        String uniqueName = orgId + dateString + randomInt;
        User TestUser = new User(  firstname = 'Test',
                              lastName = 'User',
                              email = uniqueName + '@test' + orgId + '.org',
                              Username = uniqueName + '@test' + orgId + '.org',
                              EmailEncodingKey = 'ISO-8859-1',
                              Alias = uniqueName.substring(18, 23),
                              TimeZoneSidKey = 'America/Los_Angeles',
                              LocaleSidKey = 'en_US',
                              LanguageLocaleKey = 'en_US',
                              ProfileId = p.Id);
        
        System.runAs(TestUser) {
            Account NewTestAccount = New Account();
            NewTestAccount.Name = 'Testing Account';
            NewTestAccount.Phone = '+923135290107';
            NewTestAccount.BillingCountry = 'Pakistan';
            NewTestAccount.BillingPostalCode = '00125';
            NewTestAccount.BillingState = 'Punjab';
            NewTestAccount.BillingCity = 'NA';
            NewTestAccount.BillingStreet = 'Dubai Plaza, Islamabad';
            NewTestAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Account').getRecordTypeId();
            Insert NewTestAccount;
            CommunityLoggedInUserInfo.UserInfo(NewTestAccount.OwnerId);
        }
	Test.stopTest();        
		        
    }
    @IsTest static void saveChunkTest(){
        
        Test.startTest();
        	String fileName = 'File_[Testing File]';
        	String base64Data = 'This is testing base64Data';
        	String contentType = '.pdf';
        	String fileId = '';
        	CommunityLoggedInUserInfo.saveChunk(fileName, base64Data, contentType, fileId);
        Test.stopTest();
        
    }
}