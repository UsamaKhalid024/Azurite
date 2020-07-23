({
    doinit : function(component, event, helper) {
        component.set("v.Spinner", true);
        var action = component.get("c.GetBookingValues");
		action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var response = response.getReturnValue();
                console.log(response["Contact__c"]);
                component.set("v.Spinner", false);
                // ================ Triggering Default Functionality ================
                    var createRecordEvent = $A.get("e.force:createRecord");
                    createRecordEvent.setParams({
                        "entityApiName": "Itenrary__c",
                        "defaultFieldValues": {
                            "Customer_contact__c": response["Contact__c"],
                            "Booking__c" : component.get("v.recordId")
                        }
                    });
                    createRecordEvent.fire();
                // ==================================================================
                
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
        
        
        
        
    },
    /*handleSubmit: function(component, event, helper) {
        
        component.set("v.Spinner", true);
        var airport_info = component.find("AirportInstructions").get("v.value");
        console.log("Airport Instruction: "+airport_info);
        if(airport_info == null){
            alert("Please provide airport instructions also.");
            window.setTimeout(
                $A.getCallback(function () {
                    component.find("AirportInstructions").getElement().focus();
                }), 100
            );
            component.set("v.Spinner", false);
            event.preventDefault();
        }
        
    },
    handleOnError : function(component, event, helper) {
        alert("error occured!");
        var errors = event.getParams();
        console.log("Error Response"+ JSON.stringify(errors));
        component.set("v.Spinner", false);
    },
    handleSuccess : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "type" : "success",
            "message": "The record has is created successfully."
        });
        toastEvent.fire();
        $A.get("e.force:closeQuickAction").fire();
        $A.get('e.force:refreshView').fire();
        component.set("v.Spinner", false);
    },
    submitform : function(component, event, helper) {
        component.find("NewItenraryRecordForm").submit();
    }*/   
})