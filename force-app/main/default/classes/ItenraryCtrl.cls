public class ItenraryCtrl {
	
    private string itenraryId {set;get;}
    public Itenrary__c ItenraryObj {set;get;}
    public Contact ConObj {set;get;}
    public Contact PersonalAssObj {set;get;}
    public Account AirportInfo {set;get;}
    public string detectuser {set;get;}
    public double timezone {set;get;}
    public Datetime az_arrive {set;get;}
    public Datetime az_depart {set;get;}
    public List<Session__c> SessInfo {set;get;}
    public String SessProcedure {set;get;}
    public String SessSurgonNames {set;get;}
    public Datetime SessStartDateRange {set;get;}
    public Datetime SessEndDateRange {set;get;}
    public Integer ItiSize {set;get;}
    public Map<String, Decimal> CurrencyRates {set; get;}
    Public String MedIsoCode {set; get;}
    Public Decimal TotalAmount = 0;
    Public Decimal TotalMedBalance {set; get;}
    public DateTime arrival{get;set;}
    public DateTime depart{get;set;}
    
    public ItenraryCtrl(Apexpages.StandardController sc){
        itenraryId = ApexPages.currentPage().getParameters().get('Id');
        ItenraryObj = [SELECT id, Airport__c, Booking__r.Procedures_Requested_Please_Specify__c, Customer_contact__c, Airport_Instructions__c,
                       Azurite_Arrive__c, Azurite_Depart__c, Booking__r.Personal_Assistant__c, Booking__r.Total_Medical_Balance__c, Booking__r.Doctor__r.FirstName, CurrencyIsoCode,
                       (SELECT id, Name, Program_Itinerary_Info__c, Program_Itinerary_Details__c, Start_Date__c, End_Date__c FROM Itenrary_Line_Items__r ORDER BY Start_Date__c, name ASC),
                       Booking__r.Id
                       FROM Itenrary__c WHERE Id =: itenraryId];
        
        

        ItiSize = ItenraryObj.Itenrary_Line_Items__r.size();
        GetContactInfo(ItenraryObj.Customer_contact__c);
        GetPersonalAssistant(ItenraryObj.Booking__r.Personal_Assistant__c);
        GetAirportInstructions(ItenraryObj.Airport__c);
        GetSessionInfo(ItenraryObj.Booking__r.Id);
        UpdateLineItemsDateTime();
        TotalMedBalance = TotalMedBalance(ItenraryObj.Booking__r.Id);
        
        Profile pfile = [Select Name from Profile where Id =: userinfo.getProfileid()];
        String pname = pfile.name;
        detectuser = pfile.name;
        
        //System.debug(ItenraryObj.Azurite_Depart__c + '|' + ItenraryObj.Azurite_Arrive__c);
        arrival = ItenraryObj.Azurite_Arrive__c + GetOffset(ItenraryObj.Azurite_Arrive__c);
        depart = ItenraryObj.Azurite_Depart__c + GetOffset(ItenraryObj.Azurite_Depart__c);
    }
    
    
    public Double GetOffset(Datetime DateTimeValue){
        TimeZone tz = UserInfo.getTimeZone();
        //Milliseconds to Day
        timezone = tz.getOffset(DateTimeValue) / (1000 * 3600 * 24.0);
        return timezone;
    }
    
    public List<Itenrary_Line_Item__c> UpdateLineItemsDateTime(){
        for(Itenrary_Line_Item__c LineItemInfo : ItenraryObj.Itenrary_Line_Items__r){
            LineItemInfo.Start_Date__c = LineItemInfo.Start_Date__c + getOffset(LineItemInfo.Start_Date__c);
            LineItemInfo.End_Date__c = LineItemInfo.End_Date__c + getOffset(LineItemInfo.End_Date__c);
        }
      
        return ItenraryObj.Itenrary_Line_Items__r;
    }
    
    
    public List<Session__c> GetSessionInfo(String BookingId){
        SessInfo = new List<Session__c>();
        SessSurgonNames = '';
        if(! String.isEmpty(BookingId)){
			SessInfo = [SELECT Id, Name, 
                        		Booking__r.Id, 
                        		CreatedDate,
                        		Procedures__c,
                        		Medical_Balance__c,
                        		Doctor__r.FirstName,
                        		Doctor__r.LastName,
                        		Start_Date__c,
                        		End_Date__c
                        FROM Session__c WHERE Booking__r.Id =: BookingId order by createdDate ASC];
            if(SessInfo.size() > 0){
                SessProcedure = SessInfo[0].Procedures__c;
                Set<String> SurgonNames = new Set<String>();
                for(Session__c sessdet : SessInfo){
                    String Name = sessdet.Doctor__r.FirstName + ' ' + sessdet.Doctor__r.LastName;
                    SurgonNames.add(Name);
                }
                SessSurgonNames = String.join((Iterable<String>)SurgonNames, ',');
                
                
                SessStartDateRange = SessInfo[SessInfo.size()-1].Start_Date__c;
                SessEndDateRange = SessInfo[0].End_Date__c;
                system.debug('Start:' + SessStartDateRange + 'End: '+ SessEndDateRange);
            }
        }
        return SessInfo;
    }
    public Contact GetContactInfo(String ContactId){
        ConObj = new Contact();
        if(! String.isempty(ContactId) )
        {
            ConObj = [SELECT FirstName, LastName, Email, Phone, Hospital_Balance__c, Profile_Picture__c FROM Contact WHERE Id =:ContactId];
        }
        return ConObj;
    }
    public Contact GetPersonalAssistant(String ContactId){
        PersonalAssObj = new Contact();
        if(! String.isempty(ContactId) )
        {
            PersonalAssObj = [SELECT FirstName, LastName, Email, Phone, Profile_Picture__c FROM Contact WHERE Id =:ContactId];
        }
        return PersonalAssObj;
    }
    public Account GetAirportInstructions(String AccountId){
        AirportInfo = new Account();
        if(!String.isEmpty(AccountId)){
            AirportInfo = [SELECT Name, Airport_Details__c FROM Account Where Id =: AccountId];
        }
        return AirportInfo;
    }
    public Decimal TotalMedBalance(String BookingId){
        
        List<Session__c> SessionListCheck = new List<Session__c>();
        SessionListCheck = [SELECT Id FROM Session__c Where Booking__c =: BookingId];
        
        if(SessionListCheck.size() > 0){
        	MedIsoCode = [SELECT CurrencyIsoCode FROM Session__c Where Booking__c =: BookingId Order By Createddate ASC Limit 1].CurrencyIsoCode;
        } else{ 
        	MedIsoCode = UserInfo.getDefaultCurrency();
        }
        system.debug(MedIsoCode);
        system.debug([SELECT Medical_Balance__c FROM Session__c Where Booking__c =: BookingId AND CurrencyISOCode =: MedIsoCode]);
        For(Session__c SessMedBal : [SELECT Medical_Balance__c FROM Session__c Where Booking__c =: BookingId AND CurrencyISOCode =: MedIsoCode]){
            TotalAmount = TotalAmount + SessMedBal.Medical_Balance__c;
        }
        System.debug(MedIsoCode+' '+TotalAmount);
        
        return TotalAmount;
        
    }
    
}