@isTest(SeeAllData=false)
public class LeadConverterCtrlTest {
	
    static testMethod void LeadConvertTest(){
        test.startTest();
        	// * Create Lead
        	// * Trigger automatically leadconevrt trigger
        	// ======== >>> Lead Generation  <<< ===========
        		CreateLead('Test123@gmail.com');
        	// =============================================
        test.stopTest();
    }
    
    static testMethod void LeadConvertTest2(){
        
        Account acc = new Account();
        acc.Name = 'New Account[James Davaid]';
        acc.BillingCity = 'Glasgow';
        acc.BillingPostalCode = '00125';
        acc.Website = 'https://www.test.com';
        Insert acc;
        	
        	Contact con = new Contact();
        	con.FirstName = 'Test';
        	con.LastName = 'Contact';
        	con.Email = 'Test123@gmail.com';
        	con.AccountId = acc.Id;
        	Insert con;
        
        	CreateLead(con.Email);
    }
    
    static testmethod void LeadConvertTest3(){
        Contact con = new Contact();
        	con.FirstName = 'Test';
        	con.LastName = 'Contact';
        	con.Email = 'Test123@gmail.com';
        	Insert con;
        	CreateLead(con.Email);
        
    }
    
    
    
    public static void CreateLead(String ConEmail){
        Lead ld = new Lead();
        		ld.FirstName = 'James';
        		ld.LastName = 'Davaid';
        		ld.Passport_Country__c = 'United Kingdom';
        		ld.Date_of_Birth__c = Date.newInstance(1993, 04, 8);
        		ld.Gender__c = 'Male';
        		ld.Street = '83 High Street KILMARNOCK KA46 9QW';
        		ld.City = 'Glasgow';
        		ld.State = 'Wales';
        		ld.Website = 'https://www.test.com';
        		ld.PostalCode = '00125';
        		ld.Country = 'United Kingdom';
        		ld.Email = ConEmail;
        		ld.Phone = '+9231312345';
        		ld.Preferred_Date_of_Surgery__c = Date.newInstance(2019, 11, 26);
        		ld.Alternate_Date_of_Surgery__c = Date.newInstance(2019, 11, 28);
        		ld.Procedure_Type__c = 'General';
        		ld.Procedures_Requested__c = 'Test procedure requested';
        		ld.Travel_Companion_First_Name__c = 'James';
        		ld.Travel_Companion_Last_Name__c = 'Brown';
        		ld.Travel_Companion_Date_of_Birth__c = Date.newInstance(1994, 08, 14);
        		ld.Emergency_Contact_Phone__c = '+923135290107';
        		ld.Emergency_Contact_Name__c = 'Bruice Wilson';
        		ld.Do_you_have_breast_implants__c = 'Yes';
        		ld.If_YES_please_specify_method__c = 'Test method applied';
        		ld.Are_you_on_birth_control__c = 'No';
        		ld.HRT_Medications_Hormone_Patch__c = 'Yes';
        		ld.Age_of_youngest_child__c = 14;
        		ld.Current_bra_size__c = '32';
        		ld.Desired_bra_size__c = '16';
        		ld.Desired_placement_of_implants__c = 'In-front of muscle';
        		ld.Desired_implants__c = 'Saline';
        		ld.Desired_incision__c = 'Armpits';
        		ld.Have_you_had_a_mammogram__c = 'Yes';
        		ld.Please_specify_results_patients_over_40__c = '20';
        		ld.Are_you_pregnant_now__c = 'No';
        		ld.Are_you_planning_for_more_pregnancies__c = 'No';
        		ld.Last_breastfed_on_date__c = Date.newInstance(2019, 11, 03);
        		ld.Company = 'Women Trust Industries';
        		ld.LeadSource = 'Community Booking';
        		Insert ld;
    }
    
    
}