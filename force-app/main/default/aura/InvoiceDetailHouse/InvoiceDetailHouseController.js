({
	init : function(component, event, helper) {
        // the function that reads the url parameters
            var getUrlParameter = function getUrlParameter(sParam) {
                var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                    sURLVariables = sPageURL.split('&'),
                    sParameterName,
                    i;

                for (i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split('=');

                    if (sParameterName[0] === sParam) {
                        return sParameterName[1] === undefined ? true : sParameterName[1];
                    }
                }
            };
		component.set('v.overrideAttrib', 'https://azurite.force.com/azurite/apex/breadwinner_qbo__Invoice_RecordInfo?id='+component.get('v.recordId')+'&sfdc.override=1&isdtp=vw');
	
        
	},
    hideButton : function(component, event, helper){ 
        
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
            
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };
        
        
        var action = component.get("c.InvoiceContent");
        action.setParams({ InvoiceId : getUrlParameter('id') });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.log(state);
            if(state == "SUCCESS"){
                //console.log(response.getReturnValue());
                //var UseInformation = "data:text/html;charset=utf-8," +  escape( response.getReturnValue());
                var UseInformation = response.getReturnValue();
                console.log(UseInformation);
                component.set("v.invoiceBody", UseInformation);
                var doc = new DOMParser().parseFromString(UseInformation, "text/xml");
                document.getElementById("invoice-iframe").contentWindow.document = doc;
            }
        });
        $A.enqueueAction(action);
    }
})