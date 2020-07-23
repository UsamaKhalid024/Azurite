/** Add utility methods in this file which are to be used by Form Builder process:
 ** which does not include business logic
 ** primarily being used to do writing/reading data to/from fs variables, performing string manipulations, Null refrence checks etc
 * @todo: Move existing private utility methods to this library.
 */
(function(root, window, factoryMethod) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['fs', 'window'], factoryMethod);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function(root, window) {
            return factoryMethod(root, window);
        };
    } else {
        var libObject = factoryMethod(root, window);
        root.Utils = libObject.Utils;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var document = window.document;
    var $ = fs;
    var CONSTANTS = {
        uiMessage: {
            somethingWentWrong:
                'Something went wrong. Please contact support if the issue persists.',
            unsavedChanges:
                'You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?'
        }
    };
    var enumDataVariable = {
        currentFormRecordId: 'currentFormRecordId',
        isWindowSafeToUnload: 'isWindowSafeToUnload'
    };
    var getFilteredArr = function(classList) {
        var ignoreSectionLevelClassNameArr = ['FieldOption', 'section'];
        var optGrpClassNameArr = [].map.call(classList, function(el) {
            return el;
        });
        var classNamesForOptionItemArr = optGrpClassNameArr.filter(function(el) {
            return ignoreSectionLevelClassNameArr.indexOf(el) < 0;
        });
        return classNamesForOptionItemArr;
    };
    /**
     * utility methods
     */
    var _Utils = {
        CONSTANTS: CONSTANTS,
        DATA_VARIABLE: enumDataVariable,
        setFSNSVariable: function(variableName, value) {
            if (typeof window.FS_NS === 'undefined') {
                window.FS_NS = {
                    Variables: {}
                };
            }
            window.FS_NS.Variables[variableName] = value;
        },
        getFSNSVariable: function(variableName, defaultValue) {
            if (
                typeof window.FS_NS !== 'undefined' &&
                typeof window.FS_NS.Variables !== 'undefined' &&
                typeof window.FS_NS.Variables[variableName] !== 'undefined'
            ) {
                return window.FS_NS.Variables[variableName];
            }
            return defaultValue;
        },
        isNullOrEmpty: function(strvalue) {
            if (strvalue !== undefined && strvalue !== null && strvalue != '') {
                return false;
            }
            return true;
        },
        isNullOrUndefined: function(pObject) {
            return pObject === null || pObject === undefined;
        },
        /**
         *
         * @param {*} booleanValue
         * @param {boolean} defaultValue
         */
        getSafeBoolean: function(booleanValue, defaultValue) {
            var returnBool = defaultValue;
            try {
                if (booleanValue === undefined) {
                    return returnBool;
                }
                if (booleanValue.toString().toLowerCase() == 'true' || booleanValue == true) {
                    returnBool = true;
                } else if (
                    booleanValue.toString().toLowerCase() == 'false' ||
                    booleanValue == false
                ) {
                    returnBool = false;
                }
            } catch (err) {
                console.log('[FORM] [getSafeBoolean] ' + err);
            }
            return returnBool;
        },
        getSafeString: function(stringValue, defaultValue) {
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
        setSecureInputValue: function(pHTML) {
            var vDocument = window.document.implementation.createHTMLDocument('Title');
            vDocument.body.innerHTML = pHTML;
            // innerText is not supported in JSDOM.
            // We have a workaround for this in its test file.
            // Actual issue: https://github.com/jsdom/jsdom/issues/1245
            pHTML = vDocument.body.innerText;
            return pHTML;
        },
        unLoadWindow: function() {
            if (
                _Utils.getSafeBoolean(
                    _Utils.getFSNSVariable(enumDataVariable.isWindowSafeToUnload, true),
                    true
                )
            ) {
                return;
            } else {
                return 'Show message!'; //This message doesn't show for the user, it shows a default message from the browser
            }
        },
        generateFormFieldsSelectHtml: function(resultFFoptionsArr, mergeFields) {
            var fieldsStart = 0;
            var fieldEnds = false;
            var genfieldsStart = 0;
            var html = '';
            var childObjectPrefix = '';
            var pageGrpStart = false;
            var sectionGrpStart = false;
            var fieldGrpStart = false;
            var genfieldGrpStart = false;
            html +=
                '<option class="fielditem" name="field-item" value="">--select an item--</option>';
            if (mergeFields != null && mergeFields instanceof Array && mergeFields.length > 0) {
                html += '<optgroup class="FieldOption ff-merge-grp" label="Formstack Fields">';
                $(mergeFields).each(function(index, ffOptionItem) {
                    html +=
                        '<option class="fielditem ff-merge-field" name="field-item" value="' +
                        ffOptionItem.FFValue +
                        '">' +
                        ffOptionItem.FFText +
                        ' </option>';
                });
                html += '</optgroup>';
            }
            if (resultFFoptionsArr != null && resultFFoptionsArr.length > 0) {
                var totalItems = resultFFoptionsArr.length;
                for (var optionItemIndex = 0; optionItemIndex < totalItems; optionItemIndex++) {
                    var ffOptionItem = resultFFoptionsArr[optionItemIndex];
                    var optionText = ffOptionItem.FFText;
                    if (!_Utils.isNullOrEmpty(optionText)) {
                        try {
                            optionText = _Utils.setSecureInputValue(optionText);
                        } catch (err) {
                            console.log('[generateFormFieldsSelectHtml] ERROR:' + err);
                        }
                    }
                    var optionValue = ffOptionItem.FFValue;
                    if (optionText == '--select a page--') {
                        pageGrpStart = true;
                        html += '<optgroup class="PageOption" label="Pages">';
                    }
                    if (optionText == '--select a section--') {
                        sectionGrpStart = true;
                        if (pageGrpStart) {
                            pageGrpStart = false;
                            html += '</optgroup>';
                        }
                        html += '<optgroup class="SectionOption" label="Sections">';
                    }
                    if (optionText == '--select a field--' || optionText == '--select an item--') {
                        if (sectionGrpStart) {
                            sectionGrpStart = false;
                            html += '</optgroup>';
                        }
                        fieldGrpStart = true;
                        fieldsStart++;
                    }
                    if (optionText == '--select a general field--') {
                        if (fieldGrpStart || sectionGrpStart) {
                            fieldGrpStart = false;
                            sectionGrpStart = false;
                            html += '</optgroup>';
                        }
                        genfieldGrpStart = true;
                    }
                    if (fieldsStart > 0 && optionText.indexOf('Fields for') >= 0) {
                        if (optionValue.length >= 1) {
                            childObjectPrefix = 'FieldOption';
                            var sectionInfoWithoutEmptyStringsArr = optionValue
                                .split(' ')
                                .filter(function(str) {
                                    return str != null && str != '';
                                });
                            if (sectionInfoWithoutEmptyStringsArr.length >= 2) {
                                childObjectPrefix += ' item--childdetail';
                            }
                            childObjectPrefix += ' ' + optionValue;
                        }

                        if (fieldsStart > 0) {
                            if (fieldEnds) {
                                html += '</optgroup>';
                                fieldEnds = false;
                            }
                            fieldsStart++;
                        }
                        html +=
                            '<optgroup class="' +
                            childObjectPrefix +
                            '" label="' +
                            optionText +
                            '">';
                    }
                    if (genfieldGrpStart && optionText.indexOf('--select a general field--') >= 0) {
                        if (fieldsStart > 0) {
                            if (fieldEnds) {
                                html += '</optgroup>';
                                fieldEnds = false;
                            }

                            genfieldsStart++;
                        }
                        html += '<optgroup class="FieldOption" label="General Fields">';
                    }
                    if (pageGrpStart && !sectionGrpStart && optionValue != '' && fieldsStart == 0) {
                        /*looping through section items */
                        html +=
                            '<option class="pageitem" name="page-item" value="' +
                            optionValue +
                            '">' +
                            optionText +
                            ' </option>';
                    }
                    if (!pageGrpStart && sectionGrpStart && optionValue != '' && fieldsStart == 0) {
                        /*looping through section items */
                        html +=
                            '<option class="sectionitem" name="section-item" value="' +
                            optionValue +
                            '">' +
                            optionText +
                            ' </option>';
                    }
                    if (
                        !pageGrpStart &&
                        !sectionGrpStart &&
                        fieldGrpStart &&
                        fieldsStart > 0 &&
                        optionValue != '' &&
                        optionText.indexOf('Fields for') < 0
                    ) {
                        /*looping through field items */
                        fieldEnds = true;
                        html +=
                            '<option class="fielditem" name="field-item" value="' +
                            optionValue +
                            '">' +
                            optionText +
                            ' </option>';
                    }
                    if (
                        !pageGrpStart &&
                        !sectionGrpStart &&
                        !fieldGrpStart &&
                        genfieldsStart > 0 &&
                        optionValue != ''
                    ) {
                        /*looping through field items */
                        fieldEnds = true;
                        html +=
                            '<option class="fielditem" name="field-item" value="' +
                            optionValue +
                            '">' +
                            optionText +
                            ' </option>';
                    }

                    if (optionItemIndex === totalItems - 1) {
                        // this is the last one
                        html += '</optgroup>';
                    }
                }
            }
            return html;
        },
        /**
         * it add the classes (with some exceptions) from selected option element to select2 main div's span tag (.select2-chosen) on select/initialize
         * @param {*} optionElem select2 object which has information regarding the selected option tag
         * @param {*} containerElem select2 main div's span tag (.select2-chosen)
         */
        select2FormatCSSClassSelection: function(optionElem, containerElem) {
            if (_Utils.isNullOrUndefined(containerElem)) {
                // Nothing to do here
                return '';
            } else {
                containerElem[0].className = 'select2-chosen';
                var selectedOptionValue = optionElem.id;
                if (selectedOptionValue == '') {
                    // first item with --select an item--
                    return '';
                }

                var selectedOptionClass = optionElem.css;
                var targetSelectElement = containerElem
                    .parent()
                    .parent()
                    .next();
                var parentOptGrp = fs(targetSelectElement)
                    .find('option[value="' + selectedOptionValue + '"]')
                    .closest('optgroup');
                if ($(parentOptGrp).length == 0) {
                    // Nothing to do here
                    return '';
                } else {
                    var classList = fs(parentOptGrp)[0].classList;
                    var classNamesForOptionItemArr = getFilteredArr(classList);
                    classNamesForOptionItemArr.unshift(selectedOptionClass);
                    return classNamesForOptionItemArr.length > 0
                        ? classNamesForOptionItemArr.join(' ')
                        : '';
                }
            }
        }
    };

    return {
        Utils: _Utils
    };
});
