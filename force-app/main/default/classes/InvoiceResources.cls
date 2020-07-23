global with sharing class InvoiceResources {
	
    public static HttpCalloutMock Mock = null;
    
    global static void UpdateQBInvoice(String body) {
        
        
        Http http = new Http();
		HttpRequest InvUpdate = new HttpRequest();
        //InvUpdate.setEndpoint('https://'+BaseURL+'/v3/company/'+CompanyId+'/invoice?minorversion='+minorversion);
        InvUpdate.setEndpoint('callout:QB_Authentication/invoice?minorversion=45');
        InvUpdate.setMethod('POST');
        InvUpdate.setHeader('Content-Type', 'application/json');
        InvUpdate.setHeader('UserAgent', 'QBOV3-OAuth2-Postman-Collection');
        //InvUpdate.setBody('{"SyncToken": "0", "Id": "8344",  "sparse": true, "CustomField": [{"DefinitionId" : "1","Name" : "BPAY","Type" : "StringType","StringValue" : "0091990"}]}');
    	System.debug('Body Is: '+ body);
        InvUpdate.setBody(body);
        
        HttpResponse response = http.send(InvUpdate);
        system.debug('Status Code Is: '+response.getStatusCode()+' & Status Is :' + response.getStatus());
        if (response.getStatusCode() != 201) {
            System.debug('The status code returned was not expected: ' +
                         response.getStatusCode() + ' ' + response.getStatus());
        } else {
            System.debug(response.getBody());
        }
        
        
    }
  

}