({
	validateFields : function(component) {
        
        return new Promise($A.getCallback(function(resolve, reject) {
            if(!component.get('v.validationEnabled'))
            {
                resolve(true);
            }
            var allValid = component.find('inputField').reduce(function (validSoFar, inputCmp) {
                inputCmp.showHelpMessageIfInvalid();
                return validSoFar && inputCmp.get('v.validity').valid;
            }, true);
            
            if (!allValid) {
                reject(false);
                //alert('Please update the invalid form entries and try again.');
            }
            else
            {
                resolve(true);
            }
        }));		
	},
    updatePath: function(component){
        var totalSteps = component.get('v.totalSteps');
        var currStep = component.get('v.currentStep');
        var i = 1;
        for(i = 1 ; i <= totalSteps ; i++)
        {
            var item = component.find(''+i);
            $A.util.removeClass(item, 'slds-is-active');
            $A.util.removeClass(item, 'slds-is-current');
            $A.util.removeClass(item, 'slds-is-incomplete');
            $A.util.removeClass(item, 'slds-is-complete');
            $A.util.removeClass(item, 'slds-path__item');
            if(i==currStep)
            {
                $A.util.toggleClass(item, 'slds-path__item slds-is-current slds-is-active');
                /*
				$A.util.removeClass(item, 'slds-is-complete');
                $A.util.removeClass(item, 'slds-is-incomplete');
                
                $A.util.addClass(item, 'slds-is-Active');
                $A.util.addClass(item, 'slds-is-current');*/
            }
            else if(i<currStep)
            {
                $A.util.toggleClass(item, 'slds-path__item slds-is-current slds-is-active');
                /*
                $A.util.removeClass(item, 'slds-is-Active');
                $A.util.removeClass(item, 'slds-is-current');
                $A.util.removeClass(item, 'slds-is-incomplete');
                
                $A.util.addClass(item, 'slds-is-complete');*/
            }
            else
            {
                $A.util.toggleClass(item, 'slds-path__item slds-is-incomplete');
                /*
                $A.util.removeClass(item, 'slds-is-Active');
                $A.util.removeClass(item, 'slds-is-current');
                $A.util.removeClass(item, 'slds-is-complete');
                
                $A.util.addClass(item, 'slds-is-incomplete');*/
            }
        }
        
    },
    
    MAX_FILE_SIZE: 4500000, //Max file size 4.5 MB 
    CHUNK_SIZE: 750000,      //Chunk Max size 750Kb
    uploadGPfile : function(component, event){
        var fileInput = component.find("fileId").get("v.files");
        var file = fileInput[0];
        var self = this;
		
        console.log(file.size);
        if (file.size > self.MAX_FILE_SIZE) {
            alert("File size is exceded");
            return;
        }
        
        // create a FileReader object 
        var objFileReader = new FileReader();
        // set onload function of FileReader object   
        objFileReader.onload = $A.getCallback(function() {
            var fileContents = objFileReader.result;
            var base64 = 'base64,';
            var dataStart = fileContents.indexOf(base64) + base64.length;
 
            fileContents = fileContents.substring(dataStart);
            // call the uploadProcess method 
            self.uploadProcess(component, file, fileContents);
        });
        objFileReader.readAsDataURL(file);
    },
    
    uploadProcess: function(component, file, fileContents) { 
        var startPosition = 0;   
        var endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
        //console.log(fileContents);
        //console.log(file);
        //console.log("startPosition: "+startPosition+ "endPosition:" + endPosition);
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '');
    },
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId) {
        var getchunk = fileContents.substring(startPosition, endPosition);
                
        var action = component.get("c.saveChunk");
        action.setParams({
            fileName: file.name,
            base64Data: encodeURIComponent(getchunk),
            contentType: file.type,
            fileId: attachId
        });
        
        // set call back 
        action.setCallback(this, function(response) {
            // store the response / Attachment Id   
            attachId = response.getReturnValue();
            var state = response.getState();
            console.log(attachId);
            if (state === "SUCCESS") {
                // update the start position with end postion
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                console.log(endPosition);
                // check if the start postion is still less then end postion 
                // then call again 'uploadInChunk' method , 
                // else, diaply alert msg and hide the loading spinner
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId);
                } else {
                    console.log('your File is uploaded successfully');
                }
                component.set("v.mLead.SuperannutionId", attachId);
                component.set("v.SuperannuationCheck", true);
                component.set("v.SpinnerCheck", false);
                // handel the response errors        
            } else if (state === "INCOMPLETE") {
                alert("From server: " + response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        // enqueue the action
        $A.enqueueAction(action);
    }
})