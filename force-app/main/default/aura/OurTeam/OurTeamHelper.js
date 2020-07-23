({
	GetPersonalAssis : function(component, event, helper) {
		var action = component.get("c.GetPersonalAssContacts");
        //action.setParams({ firstName : cmp.get("v.firstName") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
               	
                var i;
                for(i = 0; i < response.getReturnValue().length; i++){
                    if(response.getReturnValue()[i]['Profile_Picture_Test__c'] != null){
                        var elem= document.createElement("div");
                        elem.innerHTML = response.getReturnValue()[i]['Profile_Picture_Test__c'];
                        var images = elem.getElementsByTagName("img");
                        response.getReturnValue()[i]['Profile_Picture_Test__c'] = images[0].src;
                    } else {
                        response.getReturnValue()[i]['Profile_Picture_Test__c'] = "";
                    }
                }
                console.log(response.getReturnValue());
                component.set("v.Personal_Assistants", response.getReturnValue());
                
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
	}
})