({
	doinit : function(component, event, helper) {
        helper.GetPayabledata(component, event);
	},
    handleOnload : function(component, event, helper) {
        component.set("v.showSpinner", false);
	},
    handleSubmit : function(component, event, helper){
        component.set("v.showSpinner", true);
    },
    handleSuccess : function(component, event, helper) {
        component.set("v.showSpinner", false);
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "type" : "success",
            "title": "Success!",
            "message": "Payable is successfully created!"
        });
        resultsToast.fire();
        $A.get('e.force:refreshView').fire();
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
		dismissActionPanel.fire();
    },
    handleError : function(component, event, helper) {
        component.set("v.showSpinner", false);
        /*var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "type" : "error",
            "title": "Error!",
            "message": "There is an error while creating record!: "+event.getSource()
        });
        resultsToast.fire();
        //var dismissActionPanel = $A.get("e.force:closeQuickAction");
		//dismissActionPanel.fire();*/
    }
})