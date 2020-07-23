/**
 * @author Zachary Mitchell
 * @summary Provide some functionality for the integrationSettings in order to test via mocha and locally via the index.html page.
 */

//To use this, load it in before integrationSettings.js
fs.ISP = {};
fs.ISP.__testFunctions = function(scope) {
    this.scope = scope;
    //Obtain integrations based on "userId" field
    this.getIntegrations = function(postFunction = () => {}) {
        var resultServiceInfo = [];
        for (var i of Object.keys(this.scope.accountTypes)) {
            resultServiceInfo.push(
                JSON.parse(
                    `{
                "ProviderType":"` +
                        i +
                        `",
                "LastModified":"1/1/1970",
                "ModifiedByUserId":"theQuickBrownFox",
                "ModifiedBy":"adminUser",
                "Key":"johnDoe",
                "Secret":"accountKey",
                "FieldConfiguration":{"Region":"CACentral1","Email":"noemail@email.ca"}
                }`
                )
            );
        }
        postFunction({ httpStatus: 200, serviceInformation: resultServiceInfo });
    };

    //Make changes to the integration creds
    this.updateIntegration = function(targetIntegration) {
        var fakeDate = new Date();
        var integrationName = targetIntegration.iDivTemplate.name;

        var keysAndValues = '';
        var badValue = false;
        for (var i in targetIntegration.iDivTemplate.inputFields) {
            var domValue;
            /*Because the select2 is now in use, we need to avoid it to get the true value.
            (normally this returns 1 value, so 2 would mean the select2 is in this query.)*/
            for (var j of targetIntegration.dom.getElementsByClassName('inputField ' + i)) {
                if (!j.classList.contains('select2-container')) {
                    domValue = j.value;
                    break;
                }
            }

            keysAndValues += (keysAndValues ? ',' : '') + '"' + i + '":"' + domValue + '"';
            if (
                domValue &&
                (domValue == 'badValue' ||
                    (!domValue.split(' ').join('').length &&
                        targetIntegration.iDivTemplate.inputFields[i].required))
            )
                badValue = true;
        }

        var response =
            ['Azure Blob', 'AWS', 'Dropbox', 'Formstack Documents', 'Stash', 'Integration'].indexOf(
                integrationName
            ) > -1 && !badValue
                ? '{"httpStatus":200,"message":"Updated ' +
                  integrationName +
                  ' successfully.",' +
                  keysAndValues +
                  ',"ModifiedBy":"charleyDavid","ModifiedByUserId":"jumpsOverTheLazyDog","LastModified":"' +
                  fakeDate.getDate() +
                  '/' +
                  (fakeDate.getMonth() + 1) +
                  '/' +
                  (1900 + fakeDate.getYear()) +
                  '"}'
                : '{"httpStatus":400,"message":"Error happened while processing - ' +
                  integrationName +
                  '; Aborted update.","integrationBody":{}}';

        var result = JSON.parse(response);
        console.log(result);
        targetIntegration.updateDomInformation(result);

        var contractButton = targetIntegration.dom.getElementsByClassName('contractButton');
        if (contractButton.length) {
            contractButton[0].click();
        }
    };
    //Delete credentials for integration
    this.deleteIntegration = function(targetIntegration) {
        var integrationName = targetIntegration.iDivTemplate.name;
        var response =
            ['Azure Blob', 'AWS', 'Dropbox', 'Formstack Documents', 'Stash', 'Integration'].indexOf(
                integrationName
            ) > -1
                ? '{"httpStatus":200,"message":"Deleted ' + integrationName + ' successfully."}'
                : '{"httpStatus":400,"message":""' +
                  integrationName +
                  '" Not found; Aborted deletion."}';

        console.log(response);
        targetIntegration.delete();
    };
};
