({
	GetLatestBooking : function(component, event) {
        
                let action = component.get("c.GetBooking");
                action.setParams({
                    UserId : $A.get("$SObjectType.CurrentUser.Id")
                });
                
                action.setCallback(this,function(response){
                    let state = response.getState();
                    console.log("State is : "+ state);
                    if(state == "SUCCESS"){
                        
                        var result = response.getReturnValue();
                        if(result['Personal_Assistant__r'] == null){
                            component.set("v.PersonalAssis", true);
                        }
                        if(result['Dental__r'] == null){
                            component.set("v.DentalDet", true);
                        }
                        component.set("v.BookingInfo",response.getReturnValue());
                        component.set("v.checkbooking", true);
                        console.log("Booking is : "+ result['Id']);
                        component.set("v.CurrentBookingId", result['Id']);
                        this.GetAttach(component, event, result['Id']);
                        this.GetSessionsInfo(component, event, result['Id']);
                        
                    }else if(state == "ERROR"){
                        
                        component.set("v.checkbooking", false);
                        console.log('ERROR==>');
                        console.log(response.getError());
                    }
                });
                $A.enqueueAction(action);
    },
    
    GetSessionsInfo : function(component, event, Id){
        let action = component.get("c.GetSessions");
        console.log("Ida: "+Id);
        action.setParams({
            BookId : Id
        });
        
        action.setCallback(this,function(response){
            let state = response.getState();
            console.log(state);
            if(state == "SUCCESS"){
              
                if(response.getReturnValue()['FirstLog'].length == 0){
                    component.set("v.AssSurgon", true);
                    component.set("v.HospandMed", true);
                }
                
                if(response.getReturnValue()['FirstLog'][0]['Hospital__r'] == null){
                    component.set("v.HospandMed", true);
                }
                
                var Profilepic = typeof response.getReturnValue()['FirstLog'][0]['Doctor__r']['Profile_Picture__c'];
                if(Profilepic === "undefined"){
                    component.set("v.ImageError", true);
                }
                
                component.set("v.AssignedSugeon", response.getReturnValue()['FirstLog'][0]['Doctor__r']);
                component.set("v.HospitalDetails", response.getReturnValue()['FirstLog'][0]['Hospital__r']);
                component.set("v.FirstSessionDetails", response.getReturnValue()['FirstLog']);
                component.set("v.SurgeryStartDate", response.getReturnValue()['FirstLog'][0]['Start_Date__c']);
                component.set("v.SurgeryEndDate", response.getReturnValue()['FirstLog'][response.getReturnValue()['FirstLog'].length-1]['End_Date__c']);
				
				               
                component.set("v.SessionsInfo", response.getReturnValue()['FirstLog']);
                console.log(component.get("v.SessionsInfo"));
            }else if(state == "ERROR"){
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    
    GetAttach : function(component, event, Id){

        let action = component.get("c.GetAttachments");
        console.log("Ida: "+Id);
        action.setParams({
            BookingId : Id
        });
        
        action.setCallback(this,function(response){
            let state = response.getState();
            console.log(state);
            if(state == "SUCCESS"){
                console.log(response.getReturnValue());
                component.set("v.attachmentpicturesId", response.getReturnValue());
            }else if(state == "ERROR"){
                console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})