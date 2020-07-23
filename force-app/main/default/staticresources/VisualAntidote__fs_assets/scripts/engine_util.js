/** Add utility methods in this file which are to be used by Form Engine process:
 ** which does not include business logic
 ** primarily being used to do writing/reading data to/from fs variables, performing string manipulations, Null refrence checks etc 
 * @todo: Move existing private utility methods to this library.
 * @summary Some methods are not being used by Classic Engine right now (fscore stuff). Leave it as it is to keep both sfapp engine and classic engine side same for now.
 */
(function (root, window, factoryMethod) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['fs', 'window'], factoryMethod);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function (root, window) {
            return factoryMethod(root, window);
        };
    } else {
        var libObject = factoryMethod(root, window);
        root.Utils = libObject.Utils;

    }
}(typeof fs !== 'undefined' ? fs: {}, typeof window !== 'undefined' ? window : this, function (fs, window) {
    'use strict';
    var document = window.document;
    var $ = fs;
    if (window["fscore"] == null) {
        window["fscore"] = {};
    }
    /**
     * Pollyfill some native methods which are not available in IE or older browsers
     * @todo move to its own file
     */
    if (!''.trimLeft) {
        String.prototype.trimLeft = function () {
            return this.replace(/^\s+/, '');
        };
        String.prototype.trimRight = function () {
            return this.replace(/\s+$/, '');
        };
        if (!''.trim) {
            String.prototype.trim = function () {
                return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            };
        }
    }
    /**
     * get current browser name [chrome,safari,firefox,msie,msedge,opera]
     * @private
     */
    var getCurrentBrowser = function(){
        var browserName='';
        var ua = window.navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (window.navigator.userAgent.match(/Edge/i) || window.navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
            browserName = 'msedge';
        }
        else {
            if(ua!=null && ua.length>0){
                browserName = ua[1].toLowerCase();
            }
        }
        return browserName;
    };
    var BROWSER_NAME= getCurrentBrowser();

    var _Utils ={};
    var FORM_TYPE = {
        'CLASSIC_REGULAR': 'ClassicRegular',
        'CLASSIC_LIGHTNING': 'ClassicLightning',
        'NATIVE_REGULAR': 'NativeRegular',
        'NATIVE_LIGHTNING': 'NativeLightning'
    };
    Object.freeze(FORM_TYPE);
    
    /**
     * utility methods
     */
    _Utils = {
        FORM_TYPE: FORM_TYPE,
        isCHROME : (BROWSER_NAME=='chrome')?true:false,
        isSAFARI : (BROWSER_NAME=='safari')?true:false,
        isMSIE :(BROWSER_NAME=='msie')?true:false,
        isFIREFOX :(BROWSER_NAME=='firefox')?true:false,
        isMSEDGE  : (BROWSER_NAME=='msedge')?true:false,
        isOPERA  : (BROWSER_NAME=='opera')?true:false,
        isFSDebugModeOn : (typeof isFSDebugModeOn !== 'undefined') ? this.getSafeBoolean(isFSDebugModeOn,false):false,
        initialize: function () {
            window["fscore"] = {};
        },
        isFSCoreExist: function () {
            return (window["fscore"] != null) ? true : false;
        },
        setFSCoreProperty: function (propName, propValue) {
            if (window["fscore"] == null) {
                window["fscore"] = {};
            }
            window["fscore"][propName] = propValue;
        },
        getFSCoreProperty: function (propName, defaultValue) {
            return ((window["fscore"] != null) ? (window["fscore"][propName] != null ? window["fscore"][propName] : defaultValue) : defaultValue);
        },
        setFSFormConfigProperty: function (propName, propValue) {
            if (window["FS_FormConfiguration"] == null) {
                window["FS_FormConfiguration"] = {};
            }
            window["FS_FormConfiguration"][propName] = propValue;
        },
        getFSFormConfigProperty: function (propName, defaultValue) {
            return ((window["FS_FormConfiguration"] != null) ? (window.FS_FormConfiguration[propName] != null ? window.FS_FormConfiguration[propName] : defaultValue) : defaultValue);
        },
        isAPIMethodExist: function (methodName) {
            // Method to check if Javascript API method or Evaluate Rule exist.
            if (this.isFSConfigPropertyExist("formIdentifier") && window["fscore"] != null) {
                var formIdentifier = window.FS_FormConfiguration["formIdentifier"];
                return (typeof window["fscore"]['ID' + formIdentifier + '']['' + methodName + ''] === "function") ? true : false;
            }
            return false;
        },
        isFSConfigPropertyExist: function (propName) {
            return (window.FS_FormConfiguration != null && window.FS_FormConfiguration[propName] != null) ? true : false;
        },
        isFSConfigExist: function () {
            return (window.FS_FormConfiguration != null) ? true : false;
        },
        getSafeFloatValue: function (numericValue) {
            // Current support: period (.) is the seperator for decimal point values and comma (,) is a delimiter for formatting.
            // for now we do not support localization for currency i.e. period (.) is the only seperator for  decimal point values.
            // But comma could be the seperator as well in some currencies.
            // There is a native API for modern browser and a pollyfil as well.
            // Resources: 
            // Native API: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
            // Pollyfill: https://github.com/andyearnshaw/Intl.js/      
            if (!this.isNullOrEmpty(numericValue)) {
                if (numericValue.indexOf(",") >= 0) {
                    var valueAfterDecimal = '';
                    var valueBeforeDecimal = '';
                    if (numericValue.indexOf(".") > 0) {
                        valueBeforeDecimal = numericValue.split(".")[0];
                        valueAfterDecimal = numericValue.split(".")[1];
                    } else if (numericValue.indexOf(".") == 0) {
                        valueBeforeDecimal = numericValue.split(".")[0];
                        valueAfterDecimal = numericValue.split(".")[1];
                    } else {
                        valueBeforeDecimal = numericValue;
                    }
                    valueBeforeDecimal = valueBeforeDecimal.replace(/,/g, '');
                    if (!this.isNullOrEmpty(valueAfterDecimal)) {
                        return parseFloat(valueBeforeDecimal + "." + valueAfterDecimal);
                    } else {
                        return parseFloat(valueBeforeDecimal);
                    }
                }
                return parseFloat(numericValue);
            }
            return 0;
        },
        isNullOrEmpty: function (strvalue) {
            if (strvalue !== undefined && strvalue !== null && strvalue != '') {
                return false;
            }
            return true;
        },
        isValidJSONStrOrNull: function (jsonStr) {
            // purpose of this method to provide forward compatibility since we change the data structure for picklist/ multipicklist management after the implementation of FF-2225
            try {
                JSON.parse(jsonStr);
            } catch (err) {
                return false;
            }
            return true;
        },
        isNullOrUndefined: function (pObject) {
            return pObject === null || pObject === undefined;
        },
        getArrayFromJSONorString: function (pValue) {
            var newArray = [];
            if (this.isValidJSONStrOrNull(pValue)) {
                newArray = JSON.parse(pValue);
            } else {
                newArray = pValue.split(',');
            }
            return newArray;
        },
        compareArrays: function (array1, array2) {
            // if the other array is a falsy value, return
            console.log('[FORM] [compareArrays] ' + array1 + ' and ' + array2);
            if (!(array1 instanceof Array) || !(array2 instanceof Array)){
                return false;
            }
            // compare lengths - can save a lot of time 
            if (array1.length != array2.length){
                return false;
            }

            for (var i = 0; i < array1.length; i++) {
                if ($.inArray(array1[i], array2) == -1) {
                    return false;
                }
            }
            return true;
        },
        /**
         * 
         * @param {*} booleanValue 
         * @param {boolean} defaultValue 
         */
        getSafeBoolean: function (booleanValue, defaultValue) {
            var returnBool = defaultValue;
            try {
                if (booleanValue === undefined) {
                    return returnBool;
                }
                if (booleanValue.toString().toLowerCase() == "true" || booleanValue == true) {
                    returnBool = true;
                } else if (booleanValue.toString().toLowerCase() == "false" || booleanValue == false) {
                    returnBool = false;
                }
            } catch (err) {
                console.log('[FORM] [getSafeBoolean] ' + err);
            }
            return returnBool;
        },
        getSafeString: function (stringValue, defaultValue) {
            var returnString = defaultValue;
            try {
                if (stringValue !== undefined && stringValue !== '') {
                    returnString = stringValue;
                }
            } catch (err) {
                console.log('[FORM] [getSafeString] ' + err);
            }
            return returnString;
        },
        /**
         * @param {string} resourceLink 
         * @example https://<sf-sub-daomain>.gus.force.com/fs/services/apexrest/<namespace>/FFNEngine/v1/?d=ETC
         * @example /formstack/resource/1549555022000/<namespace__>ffengine/styles/images/lookupicon.png
         * @param {string} resourceNamePattern 
         * @example ffnengine/v1 or ffengine/styles
         */
        doesNamespaceExistsInPath: function (resourceLink, resourceNamePattern) {
            if (resourceLink !== null && resourceLink != '') {
                var resourceSubpath = resourceLink.substring(0, resourceLink.toLowerCase().indexOf(resourceNamePattern));
                var apexrestPattern = '/\/apexrest\/$/';
                var apexrestIndex = resourceSubpath.indexOf('/apexrest/');
                if (apexrestIndex > 0 && !resourceSubpath.match(apexrestPattern)) {
                    // if resourceLink is a rest resource and has namespace then we hit this block
                    // BEFORE resourceSubpath :https://<sf-sub-domain>.gus.force.com/fs/services/apexrest/namespace/
                    resourceSubpath = resourceSubpath.substring(0, apexrestIndex + apexrestPattern.length - 1);
                    // AFTER resourceSubpath :https://<sf-sub-domain>.gus.force.com/fs/services/apexrest
                }
                if (resourceSubpath.lastIndexOf('/') + 1 == resourceSubpath.length) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        },
        /**
         * @description To reset value of a predfined property of fs.Utils object
         * @param {string} propName property name of fs.Utils
         * @param {*} newValue new value of the property
         * @example fs.Utils.setUtilProperty('isFSDebugOn',true);
         */
        setUtilProperty:function (propName,newValue){
            if(_Utils[propName] != null){
                 _Utils[propName]=newValue;
            }
        },
        isDataTypeExist:function(elemSource, dataTypesToCheckArr) {
            var vatt = $(elemSource).attr('data-vatt');
            if (!_Utils.isNullOrEmpty(vatt) && dataTypesToCheckArr !== undefined) {
                if (dataTypesToCheckArr instanceof Array && dataTypesToCheckArr.length > 0) {
                    var indx = 0;
                    for (indx = 0; indx < dataTypesToCheckArr.length; indx++) {
                        var dataType = dataTypesToCheckArr[indx].toUpperCase();
                        if (vatt.indexOf(dataType.toUpperCase()) == 0) {
                            return true;
                        }
                    }
                } else {
                    if (vatt.indexOf(dataTypesToCheckArr.toUpperCase()) == 0) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * Get what kind of form it is : FORM_TYPE
         */
        getFormstackFormType : function () {
            var vFormType = FORM_TYPE.CLASSIC_REGULAR;
            return this.getFSFormConfigProperty('formType',vFormType);
        },
        /**
         * Add polyfill
         */
        addPolyfill: function () {

            if ((_Utils.isMSIE == false) && (_Utils.isMSEDGE == false)) {
                return;
            }

            // remove() function
            // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
            (function (arr) {
                arr.forEach(function (item) {
                    if (item.hasOwnProperty('remove')) {
                        return;
                    }
                    Object.defineProperty(item, 'remove', {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        value: function remove() {
                            if (this.parentNode === null) {
                                return;
                            }
                            this.parentNode.removeChild(this);
                        }
                    });
                });
            })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
        },
        /**
         * parse html as secure text and removing any html entities to avoid XSS attack
         * @param {*} pHTML
         * @todo FF-4703 - add capability to parse as secure HTML by using secure-filters.js and html-encoder.js functionality
         */
        getSecureValueAsText : function (pHTML) {
            var vDocument = document.implementation.createHTMLDocument('Title');
            vDocument.body.innerHTML = pHTML;
            pHTML = vDocument.body.innerText;
            return pHTML;
        }
    };
    /**
     * @todo Move this to its own logging library if needed
     * @see {@link https://github.com/pimterry/loglevel|loglevel}
     */
    _Utils.log = {
        /**
         * @description trigger console.time if if 'isFSDebugModeOn' property is set to true
         * @param {string} label - The name to give the new timer. This will identify the timer; use the same name when calling console.timeEnd() to stop the timer and get the time output to the console.
         * @todo Not in use right now. Keep it until we are done with community performance improvements
         */
        consoleTimeStart: function (label) {
            if (_Utils.isFSDebugModeOn) {
                if(_Utils.isCHROME || _Utils.isFIREFOX || _Utils.isSAFARI){
                    console.time('Performance-' + label);
                }
            }
        },
        /**
         * @description trigger console.timeLog if 'isFSDebugModeOn' property is set to true
         * @param {string} label - The name the current timer. This will log the time so far consumed for given timer started by console.time
         * @todo Not in use right now. Keep it until we are done with community performance improvements
         */
        consoleTimeLog: function (label) {
            if (_Utils.isFSDebugModeOn) {
                if(_Utils.isCHROME || _Utils.isFIREFOX){
                    console.timeLog('Performance-' + label);
                }
            }
        },
        /**
         * @description trigger console.timeEnd if 'isFSDebugModeOn' property is set to true
         * @param {string} label The name of the timer to stop. Once stopped, the elapsed time is automatically displayed in the Web Console.
         * @todo Not in use right now. Keep it until we are done with community performance improvements
         */
        consoleTimeEnd: function (label) {
            if (_Utils.isFSDebugModeOn) {
                if(_Utils.isCHROME || _Utils.isFIREFOX || _Utils.isSAFARI){
                    console.timeEnd('Performance-' + label);
                }
            }
        },
        /**
         * @description trigger console.log if 'isFSDebugModeOn' property is set to true
         * @param {string} msg message needs to be logged
         */
        debug: function (msg) {
            if (_Utils.isFSDebugModeOn) {
                console.log(msg);
            }
        }
    };

    return {
        "Utils": _Utils
    };
}));