@isTest(SeeAllData=true)
public class InvoiceTriggerTest {
    static testmethod void InvoiceCommunityUserTest(){
        test.startTest();
        
        Test.setMock(HttpCalloutMock.class, new InvoiceResourcesMockClass());
        

       		
        	CRN_Number__c TestCRN = new CRN_Number__c();
        	TestCRN.Number__c = 'CRN-11223322';
        	TestCRN.CRN_Utilize__c = false;
        	Insert TestCRN;
        	
        CRN_Number__c TestCRN2 = new CRN_Number__c();
        	TestCRN2.Number__c = 'CRN-112233222';
        	TestCRN2.CRN_Utilize__c = false;
        	Insert TestCRN2;
            
            breadwinner_qbo__Invoice__c testinvoice = new breadwinner_qbo__Invoice__c();
        	testinvoice.breadwinner_qbo__Account__c = GenAccCon(true);
        	testinvoice.breadwinner_qbo__Amount_Credited__c = 300;
        	testinvoice.breadwinner_qbo__Amount_Due__c = 100;
        	testinvoice.breadwinner_qbo__Amount_Received__c = 200;
        	testinvoice.breadwinner_qbo__Billing_City__c = 'Glasgow';
        	testinvoice.breadwinner_qbo__Billing_Country__c = 'USA';
        	testinvoice.breadwinner_qbo__Billing_Street_Address__c = '104 st New York';
        	testinvoice.breadwinner_qbo__Email__c = 'ioptime@gmail.com';
        	testinvoice.breadwinner_qbo__Email_Status__c = 'Sent';
        	testinvoice.breadwinner_qbo__Due_Date__c = date.today() + 10;
        	testinvoice.breadwinner_qbo__Invoice_Id__c = '1241754735-INV-1592';
        	testinvoice.breadwinner_qbo__Custom_Field_1_Value__c = '2020';
        	Insert testinvoice; 
        	
		 	//InvoiceResources.UpdateQBInvoice(JSON.serialize(Newdto));
        	
        	
        test.stopTest();
    }
    
    
    static testmethod void InvoiceCmmunityUserTest2(){
        test.startTest();
        
        Test.setMock(HttpCalloutMock.class, new InvoiceResourcesMockClass());
        

       		
        	CRN_Number__c TestCRN = new CRN_Number__c();
        	TestCRN.Number__c = 'CRN-22002200';
        	TestCRN.CRN_Utilize__c = false;
        	Insert TestCRN;
        	
        CRN_Number__c TestCRN2 = new CRN_Number__c();
        	TestCRN2.Number__c = 'CRN-22002211';
        	TestCRN2.CRN_Utilize__c = false;
        	Insert TestCRN2;
            
            breadwinner_qbo__Invoice__c testinvoice = new breadwinner_qbo__Invoice__c();
        	testinvoice.breadwinner_qbo__Account__c = GenAccCon(false);
        	testinvoice.breadwinner_qbo__Amount_Credited__c = 300;
        	testinvoice.breadwinner_qbo__Amount_Due__c = 100;
        	testinvoice.breadwinner_qbo__Amount_Received__c = 200;
        	testinvoice.breadwinner_qbo__Billing_City__c = 'Glasgow';
        	testinvoice.breadwinner_qbo__Billing_Country__c = 'USA';
        	testinvoice.breadwinner_qbo__Billing_Street_Address__c = '104 st New York';
        	testinvoice.breadwinner_qbo__Email__c = 'ioptime@gmail.com';
        	testinvoice.breadwinner_qbo__Email_Status__c = 'Sent';
        	testinvoice.breadwinner_qbo__Due_Date__c = date.today() + 10;
        	testinvoice.breadwinner_qbo__Invoice_Id__c = '1241754735-INV-1592';
        	testinvoice.breadwinner_qbo__Custom_Field_1_Value__c = '2020';
        	Insert testinvoice; 
        	
		 	//InvoiceResources.UpdateQBInvoice(JSON.serialize(Newdto));
        	
        	
        test.stopTest();
    }
    
    
    public static String GenAccCon(boolean CRN){
        String orgId = UserInfo.getOrganizationId();
        String dateString = String.valueof(Datetime.now()).replace(' ','').replace(':','').replace('-','');
        Integer randomInt = Integer.valueOf(math.rint(math.random()*1000000));
        String uniqueName = orgId + dateString + randomInt;
        
        List<Profile> p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        
        Account acc = new Account();
        acc.Name = 'New Account[James Davaid]';
        acc.BillingCity = 'Glasgow';
        acc.BillingPostalCode = '00125';
        acc.Website = 'https://www.test.com';
        //acc.OwnerId = u.Id;
        Insert acc;
        
        Contact con = new Contact();
        con.LastName = 'Test Contact';
        con.AccountId = acc.Id;
        con.Email = uniqueName + '@test' + orgId + '.org';
        if(CRN == true){
        	con.CRN_Number__c = '112233';
        }
        insert con;
        
        return acc.Id;
    }
    
    
}