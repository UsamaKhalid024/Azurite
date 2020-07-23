public class LeadConverterCtrl {
	
    public static void ConvertLead(Lead CurrentLead){
        
        // ======>>>>>> This will convert lead <<<<<========
        System.debug(CurrentLead.LeadSource);
        // ======= >>>>>> Check for bolling information <<<<<<<< =======
		// =============================================================    
        Database.LeadConvert DBLead = new Database.LeadConvert();
        
        Contact emptycon = new Contact();
		String ContactId = '';
        String AccountId = '';
        if(CurrentLead.LeadSource == 'Community Booking'){
            LeadStatus ConvertLeadStatus = [SELECT MasterLabel FROM LeadStatus WHERE IsConverted=true LIMIT 1];
			
            String AccountName = CurrentLead.FirstName+' '+CurrentLead.LastName;
            
			Contact[] cons = [SELECT Id, FirstName, LastName, Account.Name, AccountId, RecordType.Name FROM Contact WHERE Email =: CurrentLead.Email];
            
            
            if(cons.isEmpty() || (!cons.isEmpty() && cons[0].RecordType.Name != null && cons[0].RecordType.Name != 'Customer')){
                system.debug('Lead converting');
                DBLead.setLeadId(CurrentLead.Id);
                DBLead.setDoNotCreateOpportunity(true);
                DBLead.setConvertedStatus(ConvertLeadStatus.MasterLabel);
                Database.LeadConvertResult lcr = Database.convertLead(DBLead);
                
                system.debug('Success ' + lcr.isSuccess());
                system.debug('Account Id ' + lcr.getAccountId());
                system.debug('Contact Id ' + lcr.getContactId());
                ContactId = lcr.getContactId();
                AccountId = lcr.getAccountId();
            	cons = new List<contact>();
                cons.add(new contact(Id = ContactId));
            	// ========= >>>>>>>>> Updating Account <<<<<<<<=====================
            	Account acc = [SELECT id, Name FROM Account where id =: AccountId];
            	acc.Name = CurrentLead.FirstName+' '+CurrentLead.LastName;
            	update acc;
            	// ==================================================================
            } else if (cons[0].RecordType.Name == null) {
                        if(cons[0].AccountId == null){
                            system.debug('this is new account');
                            Account NewAcc = New Account();
                            NewAcc.Name = AccountName;
                            NewAcc.Phone = CurrentLead.Phone;
                            Insert NewAcc;
                            cons[0].AccountId = NewAcc.Id;
                            Update cons;
                            AccountId = NewAcc.Id;
                            ContactId = cons[0].Id;
                        }else {
                            AccountId = cons[0].AccountId;
                            ContactId = cons[0].Id;
                        }
            } else {
                        if(cons[0].AccountId == null){
                            system.debug('this is new account');
                            Account NewAcc = New Account();
                            NewAcc.Name = AccountName;
                            NewAcc.Phone = CurrentLead.Phone;
                            Insert NewAcc;
                            cons[0].AccountId = NewAcc.Id;
                            Update cons;
                            AccountId = NewAcc.Id;
                            ContactId = cons[0].Id;
                        }else {
                            AccountId = cons[0].AccountId;
                            ContactId = cons[0].Id;
                        }
            }
            
			if(!cons.isEmpty())
            {
                cons[0].Birthdate = CurrentLead.Date_of_Birth__c;
                cons[0].Passport_Country__c = CurrentLead.Passport_Country__c;
                //cons[0].xxxx = CurrentLead.xxxx;
                Update cons;
            }
            
            system.debug('Current Lead Superannuation Id ====> : '+  CurrentLead.SuperannutionId__c);
            
            // ========= >>>>>>>> Create New Booking <<<<<<<<==========
            	Booking__c NewBooking = new Booking__c();
            	NewBooking.Name = 'Booking ['+CurrentLead.FirstName + ' ' + CurrentLead.LastName + ']';
            	NewBooking.Contact__c = ContactId;
            
            	NewBooking.Superannuation__c = !String.isEmpty(CurrentLead.SuperannutionId__c) && CurrentLead.SuperannutionId__c != null ? CurrentLead.SuperannutionId__c : null;
                    
            	NewBooking.Preferred_Date_of_Surgery__c = CurrentLead.Preferred_Date_of_Surgery__c;
            	NewBooking.Alternate_Date_of_Surgery__c = CurrentLead.Alternate_Date_of_Surgery__c;
            	NewBooking.Emergency_Contact_Name__c = !String.isEmpty(CurrentLead.Emergency_Contact_Name__c) && CurrentLead.Emergency_Contact_Name__c != null ? CurrentLead.Emergency_Contact_Name__c : '';
            	NewBooking.Emergency_Contact_Phone__c = !String.isEmpty(CurrentLead.Emergency_Contact_Phone__c) && CurrentLead.Emergency_Contact_Phone__c != null ? CurrentLead.Emergency_Contact_Phone__c : '';
            	NewBooking.Current_bra_size__c = !String.isEmpty(CurrentLead.Current_bra_size__c) && CurrentLead.Current_bra_size__c != null ? CurrentLead.Current_bra_size__c : '';
            	NewBooking.Desired_bra_size__c = !String.isEmpty(CurrentLead.Desired_bra_size__c) && CurrentLead.Desired_bra_size__c != null ? CurrentLead.Desired_bra_size__c : '';
            	NewBooking.Desired_placement_of_implants__c = CurrentLead.Desired_placement_of_implants__c;
            	NewBooking.Desired_Implants__c = CurrentLead.Desired_implants__c;
            	NewBooking.Desired_Incision__c = CurrentLead.Desired_incision__c;
            	//system.debug('Travel_Companion_Date_of_Birth__c is : '+CurrentLead.Travel_Companion_Date_of_Birth__c);
            	NewBooking.Companion_Date_of_Birth__c = CurrentLead.Travel_Companion_Date_of_Birth__c;
            	NewBooking.Companion_Name__c = (!String.isEmpty(CurrentLead.Travel_Companion_First_Name__c) || !String.isEmpty(CurrentLead.Travel_Companion_Last_Name__c)) && (CurrentLead.Travel_Companion_First_Name__c != null || CurrentLead.Travel_Companion_Last_Name__c != null) ? CurrentLead.Travel_Companion_First_Name__c + ' '+ CurrentLead.Travel_Companion_Last_Name__c : '';
            	NewBooking.Procedure_Type__c = !String.isEmpty(CurrentLead.Procedure_Type__c) && CurrentLead.Procedure_Type__c != null ? CurrentLead.Procedure_Type__c : '';
            	NewBooking.Procedures_Requested_Please_Specify__c = !String.isEmpty(CurrentLead.Procedures_Requested__c) && CurrentLead.Procedures_Requested__c != null ? CurrentLead.Procedures_Requested__c: '';
            	Insert NewBooking;
            // ========================================================
            
            // ========= >>>>>>>>> Creating Medical History <<<<<<<<<============
                Medical__c NewMedicalHistory = new Medical__c();
                NewMedicalHistory.Contact__c = ContactId;
            	NewMedicalHistory.Booking__c = NewBooking.Id;            	
            	NewMedicalHistory.Height__c = !String.isEmpty(CurrentLead.Height__c) && CurrentLead.Height__c != null ? CurrentLead.Height__c : '';
            	NewMedicalHistory.Weight__c = !String.isEmpty(CurrentLead.Weight__c) && CurrentLead.Weight__c != null ? CurrentLead.Weight__c : '';
            	NewMedicalHistory.Blood_Group__c = CurrentLead.Blood_Group__c;
            	NewMedicalHistory.RH__c = CurrentLead.RH__c;
            	NewMedicalHistory.Family_Medical_History__c = CurrentLead.Family_Medical_History__c;
            	NewMedicalHistory.Cancer_location_in_the_body_family__c = !String.isEmpty(CurrentLead.Cancer_location_in_the_body_family__c) && CurrentLead.Cancer_location_in_the_body_family__c != null ? CurrentLead.Cancer_location_in_the_body_family__c : '';
            	NewMedicalHistory.Medical_History__c = CurrentLead.Medical_History__c;
				NewMedicalHistory.If_cancer_specify_location_in_the_body__c = !String.isEmpty(CurrentLead.If_cancer_specify_location_in_the_body__c) && CurrentLead.If_cancer_specify_location_in_the_body__c != null ? CurrentLead.If_cancer_specify_location_in_the_body__c : '';
            	NewMedicalHistory.Major_operations_you_have_undergone__c = !String.isEmpty(CurrentLead.Major_operations_you_have_undergone__c) && CurrentLead.Major_operations_you_have_undergone__c != null ?  CurrentLead.Major_operations_you_have_undergone__c : '';
            	NewMedicalHistory.Any_underlying_diseases__c =  !String.isEmpty(CurrentLead.Any_underlying_diseases__c) && CurrentLead.Any_underlying_diseases__c != null ?  CurrentLead.Any_underlying_diseases__c : '';
            	NewMedicalHistory.Any_drug_allergies__c =  !String.isEmpty(CurrentLead.Any_drug_allergies__c) && CurrentLead.Any_drug_allergies__c != null ?  CurrentLead.Any_drug_allergies__c : '';
            	NewMedicalHistory.Any_food_allergies__c =  !String.isEmpty(CurrentLead.Any_food_allergies__c) && CurrentLead.Any_food_allergies__c != null ?  CurrentLead.Any_food_allergies__c : '';
            	NewMedicalHistory.Current_medications_being_taken__c =  !String.isEmpty(CurrentLead.Current_medications_being_taken__c) && CurrentLead.Current_medications_being_taken__c != null ?  CurrentLead.Current_medications_being_taken__c : '';
            	NewMedicalHistory.Vitamins_or_supplements_being_taken__c =  !String.isEmpty(CurrentLead.Vitamins_or_supplements_being_taken__c) && CurrentLead.Vitamins_or_supplements_being_taken__c != null ?  CurrentLead.Vitamins_or_supplements_being_taken__c : '';
            	NewMedicalHistory.If_Yes_specify_medications__c =  !String.isEmpty(CurrentLead.If_Yes_specify_medications__c) && CurrentLead.If_Yes_specify_medications__c != null ?  CurrentLead.If_Yes_specify_medications__c : '';
            	NewMedicalHistory.Do_you_smoke__c = CurrentLead.Do_you_smoke__c;
            	NewMedicalHistory.Please_specify_history_of_smoking__c =  !String.isEmpty(CurrentLead.Please_specify_history_of_smoking__c) && CurrentLead.Please_specify_history_of_smoking__c != null ?  CurrentLead.Please_specify_history_of_smoking__c : '';
            	NewMedicalHistory.Do_you_have_alcohol_dependency__c = CurrentLead.Do_you_have_alcohol_dependency__c;
            	NewMedicalHistory.Do_you_have_breast_implants__c = CurrentLead.Do_you_have_breast_implants__c;
            	NewMedicalHistory.If_Yes_please_specify_method__c =  !String.isEmpty(CurrentLead.If_YES_please_specify_method__c) && CurrentLead.If_YES_please_specify_method__c != null ?  CurrentLead.If_YES_please_specify_method__c : '';
            	NewMedicalHistory.Are_you_on_birth_control__c = CurrentLead.Are_you_on_birth_control__c;
            	NewMedicalHistory.HRT_Medications_Hormone_Patch__c = CurrentLead.HRT_Medications_Hormone_Patch__c;
            	NewMedicalHistory.Are_you_pregnant_now__c = CurrentLead.Are_you_pregnant_now__c;
            	NewMedicalHistory.Are_you_planning_for_more_pregnancies__c = CurrentLead.Are_you_planning_for_more_pregnancies__c;
            	NewMedicalHistory.Have_you_had_a_mammogram__c = CurrentLead.Have_you_had_a_mammogram__c;
            	NewMedicalHistory.Please_specify_results_patients_over_40__c =  !String.isEmpty(CurrentLead.Please_specify_results_patients_over_40__c) && CurrentLead.Please_specify_results_patients_over_40__c != null ?  CurrentLead.Please_specify_results_patients_over_40__c : '';
            	NewMedicalHistory.Last_breastfed_on_date__c =  CurrentLead.Last_breastfed_on_date__c;
            	NewMedicalHistory.Condition_Major_Accident__c = !String.isEmpty(CurrentLead.Condition_major_accident__c) && CurrentLead.Condition_major_accident__c != null ?  CurrentLead.Condition_major_accident__c : '';
            	NewMedicalHistory.Age_of_youngest_child__c = CurrentLead.Age_of_youngest_child__c;
            	Insert NewMedicalHistory;
            // ==================================================================
        }
        // ========>>>>>>>> END <<<<<<<<<============
        
    }    
}