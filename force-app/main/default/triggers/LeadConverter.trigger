trigger LeadConverter on Lead (After insert) {
    
		system.debug(Trigger.New.size());
        if(Trigger.isInsert && Trigger.isAfter && Trigger.New.size() == 1){
            system.debug(Trigger.New.size());
            LeadConverterCtrl.ConvertLead(Trigger.New[0]);
        }
}