@isTest(SeeAllData=false)
public class UpdateUploadFlagOnBookingTest {
	
    public static testmethod void TestUpdateUploadFlagOnBooking(){
        test.startTest();
            Contact con = new Contact();
            con.FirstName = 'Test';
            con.LastName = 'Contact';
            insert con;
            
            Booking__c TestBooking = new Booking__c();
            TestBooking.Name = 'New Booking[Test Booking]';
            TestBooking.Contact__c = con.Id;
        	TestBooking.Desired_Implants__c = 'Saline';
            Insert TestBooking;
        	
        	VisaTest(TestBooking.Id);
        	medicalTest(TestBooking.Id);
        	passportTest(TestBooking.Id);
        	flightTest(TestBooking.Id);
        	waiverTest(TestBooking.Id);
        	
        test.stopTest();
    }
    
    public static void VisaTest(String Id){
        List<String> testString = new List<String>{Id +'-'+'visa'};
        UpdateUploadFlagOnBooking.updateFlag(testString);
    }
    public static void medicalTest(String Id){
        List<String> testString = new List<String>{Id +'-'+'medical'};
        UpdateUploadFlagOnBooking.updateFlag(testString);
    }
    public static void passportTest(String Id){
        List<String> testString = new List<String>{Id +'-'+'passport'};
        UpdateUploadFlagOnBooking.updateFlag(testString);
    }
    public static void flightTest(String Id){
        List<String> testString = new List<String>{Id +'-'+'flight'};
        UpdateUploadFlagOnBooking.updateFlag(testString);
    }
    public static void waiverTest(String Id){
        List<String> testString = new List<String>{Id +'-'+'waiver'};
        UpdateUploadFlagOnBooking.updateFlag(testString);
    }
}