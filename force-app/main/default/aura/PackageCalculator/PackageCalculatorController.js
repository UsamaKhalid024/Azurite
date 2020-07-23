({
    doInit: function(component, event, helper){
        component.set("v.spinner", true);

        var defaultnewdate = new Date();
        defaultnewdate.setDate(defaultnewdate.getDate());
        var dd = defaultnewdate.getDate();
        var mm = defaultnewdate.getMonth() + 1;
        var y = defaultnewdate.getFullYear();
        let defaultDate = y +'-'+ ('0' + mm).slice(-2) + '-' + dd;
        component.set("v.startDate", defaultDate);
        component.set("v.startDate2", defaultDate);
        
        var date = new Date();
        var newenddate = new Date(date);
        newenddate.setDate(newenddate.getDate());
        
        var dd = newenddate.getDate();
        var mm = newenddate.getMonth() + 1;
        var y = newenddate.getFullYear();
        let endDate = y +'-'+ mm + '-' + dd;
        component.set("v.endDate2", endDate);
        component.set("v.endDate", endDate);
        
        
        let recordId = component.get("v.recordId");
        console.log('recordId ' +recordId);
        if(recordId != null && recordId != ''){
            component.set("v.showSaveButton", recordId.startsWith('a0J'));
            console.log('recordId ' +recordId.startsWith('a0J'));
        }
        component.set("v.spinner", false);
    },
    
	calculate : function(component, event, helper) {
        
        let recordId = component.get("v.recordId");
        console.log('recordId ' +recordId);
        
		var startDate = component.get("v.startDate");
        let days = component.get("v.total_days");
        
        var startDate2 = component.get("v.startDate2");
        let days2 = component.get("v.total_days_2");
        
        
        var date = new Date(startDate);
        var newdate = new Date(date);
        newdate.setDate(newdate.getDate() + parseInt(days));
        
        var dd = newdate.getDate();
        var mm = newdate.getMonth() + 1;
        var y = newdate.getFullYear();
        //console.log(newdate);
        var someFormattedDate = y + '-' + mm + '-' + dd;
        //var sDate = new Date(startDate);
        //let endDate = sDate.getFullYear() +'-'+ (sDate.getMonth() + 1) + '-' + (sDate.getDate() + parseInt(days));
        component.set("v.endDate", someFormattedDate);
        
        var date2 = new Date(startDate2);
        var newdate2 = new Date(date2);
        newdate2.setDate(newdate2.getDate() + parseInt(days2));
        
        var dd = newdate2.getDate();
        var mm = newdate2.getMonth() + 1;
        var y = newdate2.getFullYear();
        //console.log(newdate);
        var someFormattedDate2 = y + '-' + mm + '-' + dd;
        //var sDate = new Date(startDate);
        //let endDate = sDate.getFullYear() +'-'+ (sDate.getMonth() + 1) + '-' + (sDate.getDate() + parseInt(days));
        component.set("v.endDate2", someFormattedDate2);
	},
    saveRecord : function(component, event, helper){
        component.set("v.spinner", true);
        helper.saveDates(component).then(
            function(result){
                component.set("v.spinner", false);
                helper.showToast(component, "Success!", "The record has been updated successfully.", "success");
                
                $A.get('e.force:refreshView').fire();
                setTimeout(()=>{
                    var element = document.getElementsByClassName("DESKTOP uiModal forceModal");    
                    element.forEach(function(e, t) {
                    	$A.util.addClass(e, 'slds-hide');
                	});
                },1000);
                $('body').css('overflow-y','visible');
            }
        ).catch(
            function(errors){
                console.log(errors);
                component.set("v.spinner", false);
                helper.errorsHandler(component, errors);
            }
        );
    }
})