/* Add workarounds in this file which are knonw issues and we will disable these once issue is fixed
 ** Follow the instructions mentioned below regarding method name and comments:
 **** Method name starts with 'KI_' (KI stands for 'Known Issue') followed by an integer which is just an incremented number from previous method i.e. KI_1
 **** DEFAULT: Add default value which should be a value which we can return assuming Known issue is fixed or could be null in case of void
 **** JIRA : Add JIRA number
 **** DESCRIPITON: Add a description to the method which has Issue number and a link to that known issue
 **** REFERENCE : Add link to SF known issue.
 */
(function(fs) {
    'use strict';
    var isExceedingMaxLength = function(elem) {
        try {
            if (
                fs(elem).attr('data-vatt') == 'TEXTAREA' &&
                fs(elem).attr('data-ishtmlformatted') == 'false' &&
                fs(elem).prop('maxlength') -
                    (fs(elem).val().length +
                        (fs(elem)
                            .val()
                            .split(/\n/).length -
                            1)) <
                    0
            ) {
                return true;
            }
        } catch (err) {
            console.log('[fs.Patch] [isExceedingMaxLength] ' + err);
        }
        return false;
    };
    var shouldUseNewCode = function(elem, attr_lookupObject) {
        try {
            if (fs(elem).attr(attr_lookupObject) && fs(elem).attr(attr_lookupObject) !== false) {
                return true;
            }
        } catch (err) {
            console.log('[fs.Patch] [shouldUseNewCode] ' + err);
        }
        return false;
    };
    fs.Patch = {
        KI_1: function(param1) {
            // DEFAULT (if Known issue is fixed): false;
            // JIRA #: FF-3247
            // DESCRIPTION : it will return TRUE if Text Area (Long) has content with X new line characters and field max length does not have room to accomodate additional X characters because of the know issue.
            //// for example: Field length is 2000 characters and end user put 1990 characters and 6 new line characters - total 1996 characters. It will return true in this case since it does not have room to accomodate 6 more characters summing up to 2002 which will exceeds 2000 characters limit when this field is loaded in SF UI .
            // Impact: Fields of type- Text Area (Long) and Text Area
            // REFERENCE : https://success.salesforce.com/issues_view?id=a1p30000000T2oGAAS

            return isExceedingMaxLength(param1);
        },
        LC_ShouldUseNewCode: function(param1, param2) {
            // param1: element node
            // param2: new attribute
            // DEFAULT (legacy code should be used): false;
            // JIRA #: FF-3507
            // DESCRIPTION : it will return true if we should use New code (i.e. data-lookup-object) based on some parmeters but if we should use legacy code (i.e. data-vaobj) return false
            // Impact: Fields of type- LOOKUP
            // Additional information: Why we are doing this? we are deprecating data-vaobj and start using data-lookup-object instead in LOOKUP field feature

            return shouldUseNewCode(param1, param2);
        }
    };
})((this.fs = this.fs || {}));
