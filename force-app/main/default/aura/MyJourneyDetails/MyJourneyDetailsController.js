({
	doInit : function(component, event, helper) {
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        component.set("v.UserId", userId);
        helper.GetLatestBooking(component, event);
	},
    
    UploadPassport : function(component, event, helper){
        //console.log('a0JO000000B6Y7yMAF');
        component.set("v.isOpen", true);
        component.set("v.UploadsHeading", "Upload Passport");
        var flow = component.find("UploadVisa");
        var inputVariables = [
            {
                name : "recordId",
                type : "String",
                value : component.get("v.CurrentBookingId")
            }
        ];
        flow.startFlow("Passport_Upload_Flow", inputVariables);
        //console.log(component.get("v.CurrentBookingId"));
        
    }, 
    
    UploadMedicalTests : function(component, event, helper){
        component.set("v.isOpen", true);
        component.set("v.UploadsHeading", "Upload Medical Tests");
        var flow = component.find("UploadMedTests");
        var inputVariables = [
            {
                name : "recordId",
                type : "String",
                value : component.get("v.CurrentBookingId")
            }
        ];
        flow.startFlow("Medical_Upload_Flow", inputVariables);
    },
    
    UploadFlightInfo : function (component, event, helper){
        component.set("v.isOpen", true);
        component.set("v.UploadsHeading", "Upload Flight Info");
        var flow = component.find("UploadFlightInfo");
        var inputVariables = [
            {
                name : "recordId",
                type : "String",
                value : component.get("v.CurrentBookingId")
            }
        ];
        flow.startFlow("Flight_Upload_Flow", inputVariables);
    },
    
    UploadWaiver : function (component, event, helper){
        var menuValue = event.detail.menuItem.get("v.value");
        switch(menuValue){
            case "Upload_Waiver" : {
                    component.set("v.isOpen", true);
                    component.set("v.UploadsHeading", "Upload Waiver");
                    var flow = component.find("UploadWaiver");
                    var inputVariables = [
                        {
                            name : "recordId",
                            type : "String",
                            value : component.get("v.CurrentBookingId")
                        }
                    ];
                    flow.startFlow("Waiver_Upload_Flow", inputVariables);
                    break;
            }
        }
    },
    
    statuschangeWaiver : function (component, event, helper){
        if (event.getParam('status') === "FINISHED") {
            component.set("v.isOpen", false);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Success!",
                message: "Waiver Uploaded Successfully.!",
                type: "success"
            });
            toastEvent.fire();
            this.doInit(component, event, helper);
        }
    },
    
    statuschangeVisa : function (component, event, helper){
        if (event.getParam('status') === "FINISHED") {
            component.set("v.isOpen", false);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Success!",
                message: "Visa Uploaded Successfully.!",
                type: "success"
            });
            toastEvent.fire();
            this.doInit(component, event, helper);
        }
    },
    
    statuschangeMedTests : function (component, event, helper){
        if (event.getParam('status') === "FINISHED") {
            component.set("v.isOpen", false);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Success!",
                message: "Medical Tests Uploaded Successfully.!",
                type: "success"
            });
            toastEvent.fire();
            this.doInit(component, event, helper);
        }
    },
    
    statuschangeflight  : function (component, event, helper){
        if (event.getParam('status') === "FINISHED") {
            component.set("v.isOpen", false);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Success!",
                message: "Flight Info Uploaded Successfully.!",
                type: "success"
            });
            toastEvent.fire();
            this.doInit(component, event, helper);
        }
    },
    
    closeModel : function(component, event, helper){
        component.set("v.isOpen", false);
    }
    
    
})