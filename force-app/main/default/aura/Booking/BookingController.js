({
	doInit : function(component, event, helper) {

        //action.setParams({ firstName : cmp.get("v.firstName") });
       	var userId = $A.get( "$SObjectType.CurrentUser.Id" );
        //console.log(userId);
        if(userId != null){
            
            var action = component.get("c.UserInfo");
            action.setParams({ UserId : userId });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                //console.log(state);
                if(state == "SUCCESS"){
                    console.log(response.getReturnValue()[0]);
                    var UseInformation = response.getReturnValue();
                    component.set("v.mLead.first_name", UseInformation[0].FirstName);
                    component.set("v.mLead.last_name", UseInformation[0].LastName);
                    component.set("v.mLead.passportCountry", UseInformation[0]["Account"].BillingCountry);
                    component.set("v.mLead.street", UseInformation[0]["Account"].BillingStreet);
                    component.set("v.mLead.city", UseInformation[0]["Account"].BillingCity);
                    component.set("v.mLead.state" , UseInformation[0]["Account"].BillingState);
                    component.set("v.mLead.zip", UseInformation[0]["Account"].BillingPostalCode);
                    component.set("v.mLead.country",UseInformation[0]["Account"].BillingCountry);
                    component.set("v.mLead.email", UseInformation[0]["Contact"].Email);
                    component.set("v.mLead.phone", UseInformation[0]["Contact"].Phone);
                    component.set("v.mLead.gender", UseInformation[0]["Contact"].Gender__c);
                }
            });
            $A.enqueueAction(action);
        } else {
            console.log("this is logged out");
        }
		
	},
    onChange: function(component, event, helper){
        console.log("test");
        var CurrentDate = component.get("v.companion_DOB");
        console.log("CurrentDate " + CurrentDate);
        
        let dateSplit = CurrentDate.split('-');
        
         let newDate = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0];
        console.log("newDate " + newDate);
        component.set("v.mLead.companionDOB", newDate);
    },
    
    DateOfSurgery: function(component, event, helper){
        var CurrentDate = component.get("v.prefDateOfSurgery");
        console.log("CurrentDate " + CurrentDate);
        
        let dateSplit = CurrentDate.split('-');
        
         let newDate = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0];
        component.set("v.mLead.prefDateOfSurgery", newDate);
    },
    
    AltDateOfSurgery : function(component, event, helper){
        var CurrentDate = component.get("v.altDateOfSurgery");
        console.log("CurrentDate " + CurrentDate);
        
        let dateSplit = CurrentDate.split('-');
        
         let newDate = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0];
        component.set("v.mLead.altDateOfSurgery", newDate);
    },
    
    DOB : function(component, event, helper){
        var CurrentDate = component.get("v.dob");
        console.log("CurrentDate " + CurrentDate);
        
        let dateSplit = CurrentDate.split('-');
        
         let newDate = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0];
        component.set("v.mLead.dob", newDate);
        
    },
	
    breastfedDate : function(component, event, helper){
        var CurrentDate = component.get("v.breastfedDate");
        console.log("CurrentDate " + CurrentDate);
        
        let dateSplit = CurrentDate.split('-');
        
         let newDate = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0];
        component.set("v.mLead.breastfedDate", newDate);
        
    },
    
    goToStep: function(component, event, helper){
        var step = event.currentTarget.id;
        var currStep = component.get("v.currentStep");
        if(step > currStep)
        {
            helper.validateFields(component)
            .then(
                $A.getCallback(function(result){
                    return result;
                }),
                $A.getCallback(function(error){
                    return error;
                }))
            .then(
                $A.getCallback(function(isValidated){
                    if(isValidated)
                    {
                        if(step == 3){
                            var checksupperannuation = component.get("v.SuperannuationCheck");
                            if(checksupperannuation == false){
                                if(component.find("fileId").get("v.files") != null){
                                    if (component.find("fileId").get("v.files").length > 0) {
                                        component.set("v.SpinnerCheck", true);
                                        helper.uploadGPfile(component,event);   
                                    }
                                }
                            }
                        }
                        component.set("v.currentStep", parseInt(step));
                        helper.updatePath(component);
                    }
                })
            );
        }
        else
        {
            component.set("v.currentStep", parseInt(step));
            helper.updatePath(component);
        }
    },
    handleChange: function(component, event, helper){
        
    },
    goToNext: function(component, event, helper){
        
        helper.validateFields(component)
        .then(
            $A.getCallback(function(result){
                return result;
            }),
            $A.getCallback(function(error){
                return error;
            }))
        .then(
            $A.getCallback(function(isValidated){
                if(isValidated)
                {
                    var step = component.get("v.currentStep");
                    step = step + 1;
                    console.log(step);
                    if(step == 3){
                        var checksupperannuation = component.get("v.SuperannuationCheck");
                        if(checksupperannuation == false){
                            if(component.find("fileId").get("v.files") != null){
                                if (component.find("fileId").get("v.files").length > 0) {
                                    component.set("v.SpinnerCheck", true);
                                    helper.uploadGPfile(component,event);   
                                }
                            }
                        }
                    }
                    component.set("v.currentStep", parseInt(step));
                    helper.updatePath(component);
                }
                else
                {
                    alert('Please update the invalid form entries and try again.');
                }
            })
        );
    },
    goBack: function(component, event, helper){
        var step = component.get("v.currentStep");
        step = step - 1;
        component.set("v.currentStep", parseInt(step));
        helper.updatePath(component);
    },
    fileuploadcheck : function(component, event, helper){
        component.set("v.attachmentname", event.getSource().get("v.files")[0]['name']);
    }
})