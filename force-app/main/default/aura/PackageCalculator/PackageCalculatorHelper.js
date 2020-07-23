({
	saveDates : function(component) {
		return new Promise($A.getCallback(
            function(resolve, reject){
                let action = component.get("c.saveDates");
                action.setParams({
                    startDate : component.get("v.startDate"),
                    StartDate2 : component.get("v.startDate2"),
                    endDate : component.get("v.endDate"),
                    endDate2 : component.get("v.endDate2"),
                    recordId : component.get("v.recordId")
                });
                
                action.setCallback(this, function(response){
                    let state = response.getState();
                    
                    if(state == 'SUCCESS'){
                        resolve(response.getReturnValue());
                    }else if(state == 'ERROR'){
                        reject(response.getError());
                    }
                });
                
                $A.enqueueAction(action);
            }
        ));
	},
    errorsHandler : function(component, errors){
        if (errors[0] && errors[0].message) {
            console.log('Error message: ' + errors[0].message);
            this.showToast(component, 'Error', errors[0].message);
        }
    },
    
    showToast : function(component, title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type" : type,
            "message": message
        });
        toastEvent.fire();
    },
})