/*matrix library - custom library created by Formstack
- Used to generate controls for matrix
- create-by: Mohammed
*/

var fsJSMatrix = (function ($) {
    'use strict';
    var FFMatrix, root;
    root = typeof window !== 'undefined' && window !== null ? window : global;
    /**
     * FFMatrixHelper method code starts
     * TBD: move this to seperate file if it looks too crowded
     * @description add utility methods for matrix field (not the plugin methods)
     */
    $.FFMatrixHelper = (function ($) {
        /**
         * @description get value of attribute (dataAttr) of given element (inputElem)
         * @param {*} inputElem 
         * @param {*} dataAttr 
         * @private
         */
        var getSafeAttr = function (inputElem, dataAttr) {
            var defaultvalue = "";
            try {
                defaultvalue = $(inputElem).attr(dataAttr);
                if (defaultvalue === undefined) {
                    defaultvalue = "";
                }
            } catch (err) {
                defaultvalue = defaultvalue;
                console.log("FF log " + err.message);
            }
            return defaultvalue;
        };

        /**
         * @description a temporary function by Balinder as a replacement for "Object.values()" . We could get rid of this after December 2020.
         * @param {Object} objIn
         */
        function getObjectValues(objIn){
            return Object.keys(objIn).map(function(key) {
              return objIn[key];
            });
          }

        /**
         * @description destroy individual matrix field and assign new data-matrix id to the input element
         * @param {*} inputElement 
         * @param {*} newMatrixSectionId 
         * @param {*} matrixFieldIndex 
         * @private
         */
        var resetMatrixInput = function (inputElement, newMatrixSectionId, matrixFieldIndex) {
            // save attr value
            var $inputELement = $(inputElement);
            var stepsValue = getSafeAttr($inputELement, "data-matrix-value-steps");
            var isShownLabel = getSafeAttr($inputELement, "data-matrix-label-isshownlabel");
            var columns = getSafeAttr($inputELement, "data-matrix-columns");
            var labels = getSafeAttr($inputELement, "data-matrix-labels");
            var isPrimary = getSafeAttr($inputELement, "data-matrix-isprimary");
            $inputELement.ffmatrix('destroy', {
                isBuilder: false
            });
            // restore attr values
            $inputELement.attr('data-matrix-value-steps', stepsValue);
            $inputELement.attr('data-matrix-label-isshownlabel', isShownLabel);
            $inputELement.attr('data-matrix-isprimary', isPrimary);
            $inputELement.attr('data-matrix', newMatrixSectionId + '.' + matrixFieldIndex);
            $inputELement.attr('data-matrix-columns', columns);
            $inputELement.attr('data-matrix-labels', labels);
        };
        // private methods ends

        return {
            /**
             *  @description This method is only needed in Classic because we generate additional section for repeated object from back end (.net) when we do prefill
             * i.e. all data-matrix elements in repeated sections will have the same data-matrix index as it has in its first repeated section (e.g. 1.0,1.1 etc)
             * so for that in this method we are going to generate new data-matrix ids for those duplicate data-matrix fields in repeated section
             * @public
             * @summary it is being used only for Classic Regular form
             */
            resetMatrixInputElementsInRepeatedSections: function () {
                // We find all matrix sections on the form and filter out duplicates so that we can initialize initialDataMatrixArrayMap - 6 matrix sections from 0-5.
                //// dataMatrixIndexArray - "["0","2","1","4","3","5"]"
                // We find all fields matrix id so that we can use it next step
                //// allDataMatrixIndexArray - "["0.1","2.0","2.1","1.0","1.1","4.0","4.1","1.0","1.1","4.0","4.1","1.0","1.1","4.0","4.1","1.0","1.1","4.0","4.1","1.0","1.1","4.0","4.1","1.0","1.1","4.0","4.1","3.1","3.0","5.0","5.1","5.2"]"
                // We fetch duplicate ids
                //// duplicateDataMatrixIdArray - "["1.0","1.1","4.0","4.1"]"
                // We fetch only the duplicate section
                //// duplicateSectionIdArray - "["1","4"]"
                ///
                var initialDataMatrixArrayMap = {};
                var dataMatrixFields = $('#dvFastForms').find('.ff-input-type[data-matrix]');

                if (dataMatrixFields.length == 0) { return; }

                var dataMatrixIndexArray = $(dataMatrixFields).map(function () {
                    return ($(this).attr('data-matrix') !== undefined && $(this).attr('data-matrix') != '') ? $(this).attr('data-matrix').split('.')[0] : '';
                }).get().filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });
                for (var i = 0; i < dataMatrixIndexArray.length; i++) {
                    var itemVal = dataMatrixIndexArray[i];
                    initialDataMatrixArrayMap[itemVal] = [];
                }
                var allDataMatrixIndexArray = $('#dvFastForms').find('.ff-input-type[data-matrix]').map(function () {
                    return ($(this).attr('data-matrix') !== undefined && $(this).attr('data-matrix') != '') ? $(this).attr('data-matrix') : null;
                }).get();
                var duplicateDataMatrixIdArray = allDataMatrixIndexArray.reduce(function (acc, el, i, arr) {
                    if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
                }, []);
                var duplicateSectionIdArray = duplicateDataMatrixIdArray.reduce(function (acc, el, i, arr) {
                    var currentValue = el.split('.')[0];
                    if (arr.indexOf(currentValue) !== i && acc.indexOf(currentValue) < 0) acc.push(currentValue); return acc;
                }, []);
                // Now we need to generate new data-matrix ids for those duplicate data-matrix section in repeated objects
                //// in the example dataset those sections are 1 and 4
                $('#dvFastForms').find('.ff-input-type[data-matrix]').each(function () {
                    var existingMatrixId = getSafeAttr($(this), "data-matrix");
                    if (duplicateDataMatrixIdArray.indexOf(existingMatrixId) >= 0) {
                        if (existingMatrixId.indexOf('.') > 0) {
                            var existingMatrixIdArray = existingMatrixId.split('.');
                            var existingMatrixSectionId = existingMatrixIdArray[0];
                            if (duplicateSectionIdArray.indexOf(existingMatrixSectionId) >= 0) {
                                // only loop through elements with duplicate data-matrix ids so that we can generate new section ids for those elements
                                var existingMatrixFieldId = existingMatrixIdArray[1];
                                var existingMatrixSectionIdArray = initialDataMatrixArrayMap[existingMatrixSectionId];
                                var newMatrixSectionId = '';
                                if (existingMatrixFieldId == '0' || existingMatrixFieldId == 0) {
                                    // generate new section id only if field id is 0 because we generate field ids starting from 0
                                    if (existingMatrixSectionIdArray.length == 0) {
                                        newMatrixSectionId = $(this).ffmatrix().generateUniqueDataMatrix(existingMatrixId, 'section');
                                    } else {
                                        newMatrixSectionId = existingMatrixSectionIdArray[existingMatrixSectionIdArray.length - 1];
                                    }
                                    /*following while-loop checks for duplicate matrix ids for sections.
                                      for example for dataset (i.e. initialDataMatrixArrayMap) :{ "0":[], "1":[6, 8, 10, 12, 14, 16], "2":[], "3":[], "4":[7, 9, 11, 13, 15, 17], "5":[] }
                                      first condition checks for top level keys 0,1,2,3,4 in above case
                                      and then second condition checks for nested array item like 6,7... 17 etc in above case
                                      if we find*/
                                    while (Object.keys(initialDataMatrixArrayMap).indexOf(newMatrixSectionId + "") >= 0 || getObjectValues(initialDataMatrixArrayMap).reduce(function (acc, nestedArray, i, arr) {
                                        if (nestedArray.length > 0 && $.inArray(newMatrixSectionId, nestedArray) >= 0) acc.push(nestedArray); return acc;
                                    }, []).length > 0) {
                                        newMatrixSectionId++;
                                    }
                                    // now we add newly generated unique matrix section id (newMatrixSectionId) to the map as nested array item so that next time if we need to generate section id we know this one exist already
                                    initialDataMatrixArrayMap[existingMatrixSectionId].push(newMatrixSectionId);
                                }
                                else if (existingMatrixSectionIdArray.length > 0) {
                                    // getting the last newly generated section id.
                                    newMatrixSectionId = existingMatrixSectionIdArray[existingMatrixSectionIdArray.length - 1];
                                }
                                $(this).attr('data-matrix', newMatrixSectionId + '.' + existingMatrixFieldId);
                            }

                        }
                    }
                });
                /*initialDataMatrixArrayMap: it contains section id of all data-matrix fields (already exist in html and re-generated)
                  top-level keys in following example are the section ids which were there already in HTML as part of form publishing process.
                  nested array items are the section id we generated for corresponding duplicate section ids.
                  for example key "1" has [6, 8, 10, 12, 14, 16] i.e. we found 6 duplicate section ids with prefix 1 (because of 6 repeated section of a repeatable object which has matrix section)
                   { "0":[], "1":[6, 8, 10, 12, 14, 16], "2":[], "3":[], "4":[7, 9, 11, 13, 15, 17], "5":[] }*/
            },
            /**
             * @description get initial state of data matrix id in an array
             * @public
             * @returns {Object} an object with unique data-matrix section ids as keys and blank as values
             * @example {0:"",1:"",2:""}
             */
            getUniqueDataMatrixArrayMap: function () {
                var dataMatrixArrayMap = {};
                var jsdataMatrixIndexArray  = document.querySelectorAll('#dvFastForms > .ff-input-type[data-matrix]');
                var dataMatrixIndexArray = $(jsdataMatrixIndexArray).map(function () {
                    return ($(this).attr('data-matrix') !== undefined && $(this).attr('data-matrix') != '') ? $(this).attr('data-matrix').split('.')[0] : '';
                }).get().filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });
                for (var i = 0; i < dataMatrixIndexArray.length; i++) {
                    var itemVal = dataMatrixIndexArray[i];
                    dataMatrixArrayMap[itemVal] = '';
                }
                return dataMatrixArrayMap;
            },
            /**
             * @description In engine to reset data-matrix elements back to textbox but with new data-matrix ids so that it can be re-initialized using ffmatrix('create',options) later
             * @param {*} repeatElem 
             * @param {*} dataMatrixArrayMap
             * @public
             */
            resetMatrixDataOnElements: function (repeatElem, dataMatrixArrayMap) {
                if ($(repeatElem)[0].querySelectorAll('.ff-input-type[data-flexcontrol="integer-matrixlikert"]').length > 0) {
                    $.each($(repeatElem).find('.ff-input-type[data-flexcontrol="integer-matrixlikert"]'), function () {
                        var existingMatrixId = getSafeAttr($(this), 'data-matrix');
                        if (existingMatrixId.indexOf('.') > 0) {
                            var existingMatrixIdArray = existingMatrixId.split('.');
                            var existingMatrixSectionId = existingMatrixIdArray[0];
                            var existingMatrixFieldId = existingMatrixIdArray[1];
                            var newMatrixSectionId = dataMatrixArrayMap[existingMatrixSectionId];
                            if (newMatrixSectionId === undefined || newMatrixSectionId == null || newMatrixSectionId == '') {
                                newMatrixSectionId = $(this).ffmatrix().generateUniqueDataMatrix(existingMatrixId, 'section');
                                while (Object.keys(dataMatrixArrayMap).indexOf(newMatrixSectionId + "") >= 0 || getObjectValues(dataMatrixArrayMap).indexOf(newMatrixSectionId) >= 0) {
                                    newMatrixSectionId++;
                                }
                                dataMatrixArrayMap[existingMatrixSectionId] = newMatrixSectionId;
                            }
                            resetMatrixInput($(this), newMatrixSectionId, existingMatrixFieldId);
                        }
                    });
                }
                //return dataMatrixArrayMap;
            }
        };
    })($);
    /// FFMatrixHelper method code ends
    root.FFMatrix = FFMatrix = (function () {

        // locally scoped Object
        console.log('setMatrix start...');

        function FFMatrix() {

            this.getDataMatrix = function (key) {
                //  get the data-matrix from element if doesn't exist create new unique data-matrix
                var id, result, sectionId, fieldId, $section, uniqueDataMatrix;

                if (this.$elem.attr('data-matrix') != undefined && this.$elem.attr('data-matrix') != '') {
                    id = this.$elem.attr('data-matrix').split('.');
                    switch (key) {
                        case 'section' || '0':
                            result = id[0];
                            break;
                        case 'field' || '1':
                            if (id.length >= 2) {
                                result = id[0] + '.' + id[1];
                                break;
                            } else {
                                console.error('// new field '); //TODO: know why this logic exist!!!!!
                                // Balinder notes: We hit this if matrix-field on input element ($elem) does not have good format
                                //// good format 2.0 , 2.1 i.e. n.n
                                //// bad format 2 i.e. n . It does not work very well at-least in engine side
                                fieldId = this.$ffItemRow[0].querySelectorAll('.matrix-field').length;
                                result = id[0] + '.' + fieldId;
                                uniqueDataMatrix = this.generateUniqueDataMatrix(result, 'field');
                                result = uniqueDataMatrix;
                                break;
                            }
                        default:
                            break;
                    }
                } else {
                    // new field in the form
                    // search if key exist in the form if not generate new id for the key
                    switch (key) {
                        case 'section' || '0':
                            // check if the element in section or not
                            if (this.isInMatrixSection()) {
                                // get section  when numeric field dropped/exist but not save in section
                                if (this.options.isBuilder) {
                                    sectionId = this.$fieldLi.parent().attr('data-matrix');
                                } else {
                                    /**
                                     * @todo investigate why we need this in engine and refactor (see example)
                                     * @example
                                     * // this.$ffItemRow.attr('data-matrix')
                                     */
                                    sectionId = this.$ffItemRow.parent().attr('data-matrix');
                                }
                                result = sectionId;
                            } else {
                                // new section id when field display type change to matrix
                                $section = $('.matrix-section');
                                sectionId = $section.length;
                                result = sectionId;
                                uniqueDataMatrix = this.generateUniqueDataMatrix(result, 'section');
                                result = uniqueDataMatrix;
                            }
                            break;
                        case 'field' || '1':
                            $section = this.$elem.closest('.matrix-section');
                            fieldId = $section.find('.matrix-field');
                            sectionId = $section.attr('data-matrix');
                            // generate data-matrix
                            result = sectionId + '.' + fieldId.length;
                            // check if new data-matrix exist if not generate new one
                            uniqueDataMatrix = this.generateUniqueDataMatrix(result, 'field');
                            // reassign new data-matrix
                            result = uniqueDataMatrix;
                            break;
                        default:
                            break;
                    }
                }

             return result;
            };

            this.generateUniqueDataMatrix = function (newDataMatrix, type) {

                var getInteger, dataMatrixArray;
                while ($('[data-matrix="' + newDataMatrix + '"]').length != 0) {
                    dataMatrixArray = newDataMatrix;
                    if (type == 'section') {
                        // check if section get first value from dataMatrixArray
                        getInteger = parseInt(dataMatrixArray);
                        getInteger += 1;
                        // create data-matrix unique number
                        newDataMatrix = getInteger;
                    } else if (type == 'field') {
                        // check if field split 0.01 get second value from dataMatrixArray
                        if (dataMatrixArray.indexOf('.') != -1) {
                            dataMatrixArray = dataMatrixArray.split('.');
                            getInteger = parseInt(dataMatrixArray[1]);
                            getInteger += 1;
                            // create data-matrix unique number
                            newDataMatrix = dataMatrixArray[0] + '.' + getInteger;
                        }
                    }
                }


                console.log('data-matrix for ' + type + ': ' + newDataMatrix);
                return newDataMatrix;
            };

            this.isInMatrixSection = function () {
                var result;
                if (this.options.isBuilder) {
                    result = this.$fieldLi.parent().hasClass('matrix-section');
                } else {
                    /**
                     * @todo investigate why we need this in engine and refactor (see example)
                     * @example
                     * // this.$ffItemRow.attr('matrix-section')
                     */
                    result = this.$ffItemRow.parent().hasClass('matrix-section');
                }
                return result;
            };

            this.elementHasSectionMatrix = function () {
                // check if there is Section for the current field or not

                var result;
                var sectionId = this.getDataMatrix('section');
                var length = root.window.document.querySelectorAll('.matrix-section[data-matrix="' + sectionId + '"]').length;

                if (length != undefined && length > 0) {
                    result = true;
                } else {
                    result = false;
                }
                console.log('[End] isInMatrixSection Result: ' + result);
                return result;
            };

            this.getCurrentSection = function () {
                var result, sectionId;

                sectionId = this.getDataMatrix('section');
                result = root.window.document.querySelectorAll('[data-matrix="' + sectionId + '"]');

                if (result.length == 0) {
                    // if triggered then improve the logic here
                    console.log('[Error] undefined Current Section for matrix field');
                }

                return $(result);
            };

            this.getCurrentMatrixField = function () {
                var result;

                var fieldId = this.getDataMatrix('field');
                result = root.window.document.querySelectorAll('.matrix-field[data-matrix="' + fieldId + '"]');

                if (result.length == 0) {
                    // if triggered then improve the logic here
                    console.log('[Error] undefined Current matrix field');
                }

                return $(result);

            };

            this.isPrime = function (elem) {
                var result = false;

                if (getSafeBoolean($(elem).attr('data-matrix-isprimary'))) {
                    result = true;
                    return result;
                }

                return result;
            };

            this.getPrimaryField = function () {
                console.log('[Start] getPrimaryField');
                var result;

                var $section = this.getCurrentSection();
                result = $section.find('[data-matrix-isprimary="true"]');

                return result;
            };

            this.getLastMatrixField = function () {
                var lastMatrix, result;

                var $section = this.getCurrentSection();
                lastMatrix = $section.find('.matrix-field').last();
                result = lastMatrix.find('.ff-input-type');
                return result;
            };

            this.getNumberOfFieldInSection = function () {
                // return number of matrix fields in the current matrix section

                var result;

                var section = this.getCurrentSection();
                result = section[0].getElementsByClassName('matrix-field').length;

                return result;
            };

            this.getNumberOfFieldsIshiddenFalseInSection = function (options) {
                // return number of matrix fields in the current matrix section

                var result;

                var section = this.getCurrentSection();
                if(section.length > 0){
                    if (options.isBuilder == false) {
                        result = section[0].querySelectorAll('.matrix-elem[data-ishidden=false]').length;
                    } else {
                        result = section[0].querySelectorAll('.fieldDiv>.matrix-elem[data-ishidden=false]').length;
                    }
                }
                return result;
            };

            this.updateNumberOfFields = function (options) {
                // get prime field
                // increase NumberOfField by 1 
                var $prime = this.getPrimaryField();
                if ($prime.length != 0) {
                    $prime.attr('data-matrix-numberofshownfields', this.getNumberOfFieldsIshiddenFalseInSection(options));
                } else {
                    this.$elem.attr('data-matrix-numberofshownfields', this.getNumberOfFieldsIshiddenFalseInSection(options));
                }
            };

            this.getNumberOfShownFieldsFromPrimeAttr = function () {
                var $prime = this.getPrimaryField();
                if ($prime.length != 0) {
                    return $prime.attr('data-matrix-numberofshownfields');
                } else {
                    return this.$elem.attr('data-matrix-numberofshownfields');
                }
            };

            this.CheckAndHideHeaderLabel = function () {

                if (this.getNumberOfShownFieldsFromPrimeAttr() == 0) {
                    // hide section when number of fields are equal of number of hidden fields
                    this.getCurrentSection().hide();
                } else {
                    this.getCurrentSection().show();
                }
            };

            this.setData = function (userOptions) {
                console.log('[Start] setData value:' + userOptions);
                var initialOption, currentMatrixValue, originalMatrixValue;

                if (userOptions.initialMatrix) {
                    initialOption = userOptions.initialMatrix;
                } else {
                    initialOption = this.$elem.val();
                }

                this.$elem.data('ffmatrix', {

                    userOptions: userOptions,

                    // initial matrix based on the OPTION value
                    currentMatrixValue: initialOption,

                    // matrix will be restored by calling clear method
                    originalMatrixValue: initialOption,

                });

            };

            this.setAttribute = function (options) {

                // add the matrix attributes for the current input field
                var $elem = this.$elem;

                $elem.attr('data-flexcontrol', 'integer-matrixlikert');
                $elem.attr('data-matrix-isprimary', options.isPrimary);
                $elem.attr('data-matrix-value-steps', options.stepsValue);
                $elem.attr('data-matrix-label-isshownlabel', options.isShownLabel);
                $elem.attr('data-matrix-labels', options.labels);
                $elem.attr('data-matrix-columns', options.columns);

            };

            this.setOption = function (options, elem) {

                // get all the matrix attributes from elem to set options
                options.isPrimary = getSafeBoolean(safeAttr($(elem), 'data-matrix-isprimary', $.fn.ffmatrix.defaults.isPrimary, true), true);
                options.matrix = safeAttr($(elem), 'data-matrix', $.fn.ffmatrix.defaults.matrix, true);
                options.stepsValue = safeAttr($(elem), 'data-matrix-value-steps', $.fn.ffmatrix.defaults.minValue, true);
                options.isShownLabel = getSafeBoolean(safeAttr($(elem), 'data-matrix-label-isshownlabel', $.fn.ffmatrix.defaults.isShownLabel, true), true);
                options.labels = getSafeArry(safeAttr($(elem), 'data-matrix-labels', $.fn.ffmatrix.defaults.labels, true));
                options.columns = safeAttr($(elem), 'data-matrix-columns', $.fn.ffmatrix.defaults.columns, true);
                options.readonly = safeAttr($(elem), 'data-isreadonly', safeAttr($(elem), 'readonly', $.fn.ffmatrix.defaults.isreadonly, true), true);
                options.isFieldHidden = getSafeBoolean(safeAttr($(elem), 'data-ishidden', $.fn.ffmatrix.defaults.isFieldHidden, false), false);

                return options;
            };

            this.cloneMatrixAttr = function (options) {
                // does not support prime object
                // if it's a second matrix field get first child in section and copy it's attributes to the current child
                if (this.getNumberOfFieldInSection() > 0) {
                    var lastElem = this.getLastMatrixField();

                    this.setOption(options, lastElem);
                    // check if the return field is primary then set showLabel to false and set isPrimary to false
                    if (this.isPrime(lastElem)) {
                        options.isShownLabel = false;
                        options.isPrimary = false;
                    }
                    // set an empty value for data-matrix
                    options.matrix = '';
                    this.setAttribute(options);
                }
            };

            this.reAssignDataMatrix = function (option) {
                // get new data-matrix
                var newDataField = this.generateUniqueDataMatrix(option.matrix, 'field');
                // change data-matrix for input holder
                this.$fieldLi.attr('data-matrix', newDataField);
                // change data-matrix for input field
                this.$fieldLi.find('.matrix-elem').attr('data-matrix', newDataField);

            };

            this.addSection = function (options) {


                var $elem = this.$elem;
                var row, $ul, field, $header, $li;
                var sectionId = this.getDataMatrix('section');
                console.log('[Start] addSection sectionId:' + sectionId);
                if (options.isBuilder) {
                    // new field change the element to match builder form

                    field = $elem.closest('.fieldLi');

                    $header = $("<span class='section-header'><p class='section-header-text'>Matrix</p></span>");

                    $li = $('<li />', {
                        'class': 'matrix-section-container',
                        'id': 'matrix' + sectionId
                    });

                    $ul = $('<ul />', {
                        'class': 'matrix-section matrix-section-holder',
                        'data-matrix': sectionId
                    });
                    $li.append($ul);
                    $(field).wrap($li);
                    // add header section 
                    field.parent().parent().append($header);

                } else {
                    row = $elem.closest('.ff-item-row');
                    $ul = $('<div />', {
                        'class': 'ff-item-row matrix-section matrix-section-holder-scroll',
                        'data-matrix': sectionId
                    });
                    $(row).wrap($ul);
                }

                console.log('[End] addSection data-matrix: ' + sectionId);
            };

            this.removeSectionIf = function () {
                //if last standing matrix finish him and remove the section

                var $section = $(this.$elem);
                var numberOfField = $section[0].getElementsByClassName('matrix-field').length;
                if (numberOfField == 0) {
                    $section.parent('.matrix-section-container').off().remove();
                }


            };

            this.initField = function (options) {


                var $elem = this.$elem;
                // create  div to contain matrix likert in section  
                var id = this.getDataMatrix('field', true);

                var labelId = id.replace('.', '') + '1';
                var likertId = id.replace('.', '') + '2';
                var $section = this.getCurrentSection();
                // show label for the next field next spilling 
                var $labelContainer = $('<div />', {
                    'class': 'matrix-label-container hasLabel',
                    'id': labelId
                });
                var $likertContainer = $('<div />', {
                    'class': 'matrix-likert-container',
                    'id': likertId
                });
                var $matrixField;
                if (options.isBuilder) {

                    // make li element matrix field  .fieldLi
                    $matrixField = $elem.closest('li[data-otype="ONumeric"]');
                    $matrixField.addClass('matrix-field').attr('data-matrix', id);
                    // add data-matrix in input field 
                    this.$elem.attr('data-matrix', id);

                } else {
                    $matrixField = $('<div />', {
                        'class': 'matrix-field',
                        'data-matrix': id
                    });
                }
                // add tag on input TextBox
                $elem.addClass('matrix-elem');

                $matrixField.prepend($likertContainer);
                $matrixField.prepend($labelContainer);

                if (options.isLoading == true) {
                    $section.append($matrixField);
                }
            };

            this.getCSSColumnSize = function (numberOfColumns) {
                var cssMatrixColumnLength = 'matrix-big-column';
                if (numberOfColumns > 5) {
                    cssMatrixColumnLength = 'matrix-small-column';
                }
                return cssMatrixColumnLength;
            };

            this.getCSSSmallLetterForTopHeaderLabel = function (numberOfColumns, isBuilder) {
                var cssMatrixSmallLetterTopHeaderLabel = '';
                if (numberOfColumns >= 9 && isBuilder) {
                    cssMatrixSmallLetterTopHeaderLabel = 'matrix-small-letter-topheaderlabel';
                }
                return cssMatrixSmallLetterTopHeaderLabel;
            };

            this.addLabel = function (options) {

                var $labels, $cellContainer, valueId, $editHTML;

                //add edit label div
                $editHTML = $('<div class="editDelDiv">').append($('<div class="matrixEditImg" onclick="openEditDialog(this,\'matrixlabel\');">'));

                // get matrix-field
                var $matrixField = this.getCurrentMatrixField();
                var $labelContainer = $matrixField.find('.matrix-label-container');
                var $matrixFieldId = this.getDataMatrix('field'); // TODO:replace it with $matrixField.attr('data-matrix');

                if (!options.isShownLabel) {
                    $labelContainer.addClass('custom-flexcontrol-offscreen');
                    $labelContainer.removeClass('hasLabel');
                }
                if (options.isPrimary) {
                    // show edit label icon
                    $editHTML.find('.matrixEditImg').addClass('editImg');
                }


                var $col1, $col2, $col3;
                if (options.isBuilder) {
                    $col1 = $('<div />', {
                        'class': 'labelDiv'
                    });
                    $col2 = $('<div />', {
                        'class': 'matrix-labelDiv'
                    });
                    $col3 = $editHTML;
                    $labelContainer.append($col3);
                } else {
                    $col1 = $('<div />', {
                        'class': 'ff-col-1 ff-label-col'
                    });
                    $col2 = $('<div />', {
                        'class': 'ff-col-2 ff-label-col'
                    });
                }
                var $table = $('<div />', {
                    'class': 'container-table matrix-control-container'
                });
                var $row = $('<div />', {
                    'class': 'container-row'
                });
                var numberOfLabel = parseInt(options.columns);

                var cssMatrixColumnSize = this.getCSSColumnSize(numberOfLabel);

                var cssMatrixSmallLetterForTopHeaderLabel = this.getCSSSmallLetterForTopHeaderLabel(numberOfLabel, options.isBuilder);

                for (var i = 0; i < numberOfLabel; i++) {
                    valueId = $matrixFieldId + '.' + i; // section123.44.1
                    $cellContainer = $('<div />', {
                        'class': 'container-cell ' + cssMatrixColumnSize + ' ' + cssMatrixSmallLetterForTopHeaderLabel
                    });
                    $labels = $('<label/>', {
                        'class': 'matrix-label',
                        'data-matrix': valueId,
                        'for': valueId
                    }).text(options.labels[i]);
                    $cellContainer.append($labels);
                    $row.append($cellContainer);
                }
                $table.append($row);
                $col2.append($table);
                $labelContainer.prepend($col2);
                $labelContainer.prepend($col1);

                if (options.isBuilder == false) {
                    //  remove style builder in engine
                    $labelContainer.removeClass('matrix-label-container');
                    $labelContainer.removeClass('hasLabel');
                }

            };

            this.addlikert = function (options) {

                var valueId, $label, $cellContainer, $radio,
                    $span, $row, $table, value, $col1, $col2, $col3;

                var fieldId = this.getDataMatrix('field');
                var $matrixField = this.getCurrentMatrixField();
                var $matrixFieldId = this.getDataMatrix('field');
                var fieldContainerId = fieldId + '.' + this.getNumberOfFieldInSection(); // section123.44
                var $likertContainer = $matrixField.find('.matrix-likert-container');
                var $spanRepeatableColor = $('<span />',{'class':'repeatable-color'});
                if (options.isBuilder) {
                    // add repeatable color container 
                    // move edit delete icon into matrix field row and add matrix class to hide/show 
                    $likertContainer.append($spanRepeatableColor);
                    $col3 = this.$elem.parent().siblings('.editDelDiv');
                    $col3.find('.editImg').addClass('matrixEditImg');
                    $col3.find('.deleteField').addClass('matrixDeleteField');
                    $col3.find('.editImg').attr('onclick', 'openEditDialog(this,\'matrixfield\');');
                    $col3.find('.deleteField').attr('onclick', 'deleteField(this,\'field\');');
                    $likertContainer.append($col3);
                    $col1 = this.$elem.parent().siblings('.labelDiv'); // get text field label div 
                } else {
                    // Engine
                    $col1 = this.$elem.parent().siblings('.ff-col-1'); // get text field label  
                    $likertContainer.removeClass('matrix-likert-container');
                }

                $col2 = this.$elem.parent(); // get text field div
                $table = $('<div />', {
                    'class': 'container-table matrix-control-container'
                });
                $row = $('<div />', {
                    'class': 'container-row'
                });
                var numberOfLabel = parseInt(options.columns);

                var cssMatrixColumnSize = this.getCSSColumnSize(numberOfLabel);

                for (var i = 0; i < numberOfLabel; i++) {
                    value = i + parseInt(options.stepsValue);
                    valueId = $matrixFieldId + '.' + i; // section123.44.1
                    $cellContainer = $('<div />', {
                        'class': 'container-cell ' + cssMatrixColumnSize
                    });
                    $label = $('<label />', {
                        'class': 'radio-container ff-radio-li'
                    });
                    $radio = $('<input/>', {
                        'class': 'matrix-likert',
                        'type': 'radio',
                        'name': fieldContainerId,
                        'data-matrix': valueId,
                        'id': valueId,
                        'data-value': value
                    });
                    $span = '<span class="radio-checkmark ff-ext-radio-css"></span>';
                    $label.append($radio);
                    $label.append($span);
                    $cellContainer.append($label);
                    $row.append($cellContainer);
                }

                if (options.readonly == 'true' || options.readonly == 'readonly') {
                    $table.attr('readonly', 'true');
                }


                if (this.$elem.data('ffmatrix') != undefined) {
                    // set current value
                    this.setDefault($row);
                }

                $table.append($row);
                $col2.append($table);
                $likertContainer.prepend($col2);
                $likertContainer.prepend($col1);

                return $likertContainer;
            };

            this.setReadOnly = function (fieldLi, options) {

                if (fieldLi.length > 0 && (options.readonly == 'true' || options.readonly == 'readonly')) {
                    fieldLi.find('.matrix-control-container').attr('readonly', 'true');

                }

            };

            this.setDefault = function (elem) {
                var currentValue = (this.options.isBuilder) ? this.$elem.data('ffmatrix').currentMatrixValue : '';
                if (currentValue == '' || currentValue == undefined) {
                    currentValue = this.$elem.val();
                }

                try {
                    var $allRadioContiner = this.getCurrentMatrixField().find(
                        '.container-row > div.container-cell > label.radio-container > span.radio-checkmark');
                    $allRadioContiner.removeClass('ff-ext-selected');
                    if (currentValue != undefined) {
                        // For now we only accept Integer as Value, if we get decimal we will convert to Int
                        if (currentValue != '') {
                            currentValue = parseInt(currentValue);
                        }
                        var $selectedElem = elem.find('[data-value="' + currentValue + '"]');
                        if ($selectedElem != undefined) {
                            $selectedElem.prop('checked', true);
                            $selectedElem.siblings('.radio-checkmark').addClass('ff-ext-selected');
                        }
                    }
                } catch (err) {
                    console.log('Error unexpected! Method[Likert.setDefault]');
                    console.log(err);
                }
                console.log('[End] setDefault value:' + currentValue);
            };

            this.triggers = function (options) {
                var $all, $elem, $allRadioContiner;


                // fire when radio button click
                $all = this.getCurrentMatrixField().find('.matrix-likert');
                $allRadioContiner = this.getCurrentMatrixField().find('.container-row > div.container-cell > label.radio-container > span.radio-checkmark');
                $elem = this.$elem;
                $all.on('click', function (event) {
                    var $a = $(this),
                        value = $a.data('value'),
                        elem = $a.siblings('.radio-checkmark');
                    if (elem.parents('.matrix-control-container').is('[readonly]') == false) {
                        // remove class from all radio
                        $allRadioContiner.removeClass('ff-ext-selected');
                        // add class to the current radio

                        elem.addClass('ff-ext-selected');

                        // onSelect callback
                        options.onSelect.call(
                            this,
                            value
                        );
                        $elem.val(value);
                        //to trigger trigger rule onchange 
                        $elem.trigger("change");
                    }
                });


            };

            this.onLabelValueChangeTrigger = function () {
                // change header label text value
                // get input label vml-label 
                // sync label matrix-label 
                // no save will apply here

                var $all, self, $elem, $fieldLi;
                $elem = this.$elem;
                $fieldLi = this.$fieldLi;
                self = this;

                $fieldLi.find('.vml-label').on('input', function (event) {

                    var $current = $(this);
                    var valueFor, text;
                    valueFor = $current.attr('for');
                    text = $current.val();

                    // change label value
                    var $label = $fieldLi.find('.matrix-label[data-matrix="' + valueFor + '"]');
                    $label.text(text);

                });

            };
            this.onNumberOfColumnChange = function () {
                //  get new number of columns
                //  get all input labels
                // add/remove input fields 
                // run loadLabels 
                // no save will apply here


                var self, $elem, $fieldLi, options;
                $elem = this.$elem;
                $fieldLi = this.$fieldLi;
                self = this;
                options = this.options;

                var $matrixFieldId = this.getDataMatrix('field');
                $fieldLi.find('#numberOfColumns').on('input', function (event) {
                    var $tdValue, $tdMatchingLabel, $tr, $valueLabel, $matchingLabelInput, valueId, value;
                    var currentNumberOfColumns = $(this).val();

                    var $valueMatchingLabelContainer = $fieldLi.find('#vml-container');
                    // get all new label values  
                    var newLabels = $fieldLi.find('.vml-label').map(function () {
                        return $(this).val();
                    }).get();

                    // destroy labels inputs
                    $('#vml-container').empty();

                    // create new labels input
                    for (var i = 0; i < currentNumberOfColumns; i++) {
                        valueId = $matrixFieldId + '.' + i; // section123.44.1
                        value = i + parseInt(options.stepsValue);
                        $tr = $('<tr />');
                        $tdValue = $('<td />', {
                            'class': 'mtx-col'
                        });
                        $valueLabel = $('<span />', {
                            'class': 'mtx-value-circle'
                        }).html(value);
                        $tdValue.append($valueLabel);

                        $tdMatchingLabel = $('<td />', {
                            'class': 'mtx-col-2'
                        });
                        $matchingLabelInput = $('<input />', {
                            'class': 'vml-label',
                            'type': 'text',
                            'for': valueId,
                            'value': newLabels[(i)]
                        });
                        $tdMatchingLabel.append($matchingLabelInput);
                        $tr.append($tdValue);
                        $tr.append($tdMatchingLabel);

                        $valueMatchingLabelContainer.append($tr);
                    }

                });
            };

            // start dialog label setup
            this.onLabelReset = function () {
                var $fieldLi, $elem, $options, $self;
                $elem = this.$elem;
                $fieldLi = this.$fieldLi;
                $options = this.options;
                $self = this;
                $('#mtx-reset').on('click', function () {
                    // destroy labels inputs
                    $('#vml-container').empty();

                    $options.columns = $.fn.ffmatrix.defaults.columns;
                    $options.labels = $.fn.ffmatrix.defaults.labels;

                    // load
                    $self.loadLabels($options);
                });
            };

            this.destroyLabelTriggers = function () {
                // clear all trigger from dialog labels

                var $fieldLi = this.$fieldLi;
                $('#mtx-reset').off('click');
                $('#mtx-clearAll').off('click');
                $fieldLi.find('#numberOfColumns').off('change, mouseup, keyup, blur', 'input');
                $fieldLi.find('.vml-label').off('input');
                $('#chkMatrixValuesAndLabels').off('change');
            };

            this.onLabelClear = function () {
                var $fieldLi;
                $fieldLi = this.$fieldLi;


                $('#mtx-clearAll').on('click', function () {
                    // clear labels inputs
                    $fieldLi.find('.vml-label').val(' ');

                });
            };

            this.onShowHideLabel = function (target) {
                var $fieldLi = this.$fieldLi;
                var $matrixElem = this.$elem;
                var $labelContainer = $fieldLi.find('.matrix-label-container');
                var matrixEditImg = $labelContainer.find('.matrixEditImg');
                var $section = this.getCurrentSection();
                var $allMatrixElements = $section.find('.matrix-elem');
                $(target).on('change', function () {
                    // hide label
                    // save value in field matrix attr

                    var isChecked = $(this).prop('checked');
                    if (isChecked) {
                        $labelContainer.removeClass('custom-flexcontrol-offscreen');
                        $labelContainer.addClass('hasLabel');
                        $matrixElem.attr('data-matrix-label-isshownlabel', isChecked);
                    } else {
                        $matrixElem.attr('data-matrix-label-isshownlabel', isChecked);

                        openEditDialog(matrixEditImg, 'matrixlabel');
                        $(matrixEditImg).ffmatrix().resetHeaderLabelAndFields($fieldLi,$allMatrixElements);

                    }
                });
            };
            this.resetHeaderLabelAndFields = function($fieldLi,$allMatrixElements){
                // get all new label values  
                var newLabels = $fieldLi.find('.vml-label').map(function () {
                    return $(this).val();
                }).get();

                var columns = $fieldLi.find('#numberOfColumns').val();

                $allMatrixElements.each(function (i, obj) {

                    var $matrixElem = $(obj);
                    // add new value
                    $matrixElem.attr('data-matrix-labels', newLabels);
                    $matrixElem.attr('data-matrix-columns', columns);

                    // clear label and matrix field form FieldLi
                    $matrixElem.ffmatrix('destroy', {
                            isNeedAttr: true,
                            isBuilder: true
                    });


                    // Recreate labels and matrix 
                    $matrixElem.ffmatrix('create', {
                        isBuilder: true,
                        isEditMode: true
                    });

                });

                $fieldLi.find('.matrixEditImg').off('click');
            };
            this.savePanelChanges = function () {
                // get new values from panel
                // set new values in field matrix
                // note: isshownlabel not in the logic 


                var $section, $allMatrixElements, $fieldLi;
                $fieldLi = this.$fieldLi;
                $section = this.getCurrentSection();
                $allMatrixElements = $section.find('.matrix-elem');

                $fieldLi.find('.matrix-label-container>.editDelDiv>.matrixEditImg').on('click', function () {
                    $(this).ffmatrix().resetHeaderLabelAndFields($fieldLi,$allMatrixElements);
                });
            };

            this.loadLabels = function (options) {
                // load labels into dialog text field
                // bind all triggers
                // save changes on close 
                var labels = options.labels;
                var $tdValue, $tdMatchingLabel, $tr, $valueLabel, $matchingLabelInput, valueId, value;
                var $valueMatchingLabelContainer = this.$fieldLi.find('#vml-container');
                var numberOfColumns = parseInt(options.columns);
                var $matrixFieldId = this.getDataMatrix('field');
                // set show label checkboxx
                $('#chkMatrixValuesAndLabels').prop('checked', options.isShownLabel);
                $('#numberOfColumns').val(numberOfColumns);
                for (var i = 0; i < numberOfColumns; i++) {
                    valueId = $matrixFieldId + '.' + i; // section123.44.1
                    value = i + parseInt(options.stepsValue);
                    $tr = $('<tr />');
                    $tdValue = $('<td />', {
                        'class': 'mtx-col'
                    });
                    $valueLabel = $('<span />', {
                        'class': 'mtx-value-circle'
                    }).html(value);
                    $tdValue.append($valueLabel);

                    $tdMatchingLabel = $('<td />', {
                        'class': 'mtx-col-2'
                    });
                    $matchingLabelInput = $('<input />', {
                        'class': 'vml-label',
                        'type': 'text',
                        'for': valueId,
                        'value': labels[(i)]
                    });
                    $tdMatchingLabel.append($matchingLabelInput);
                    $tr.append($tdValue);
                    $tr.append($tdMatchingLabel);

                    $valueMatchingLabelContainer.append($tr);
                }

                this.destroyLabelTriggers();
                // setup triggers
                this.onLabelValueChangeTrigger();
                this.onNumberOfColumnChange();
                this.onLabelClear();
                this.onLabelReset();
                this.onShowHideLabel('#chkMatrixValuesAndLabels');
                this.savePanelChanges();

            };
            // End dialog label setup

            this.create = function () {

                var $elem = this.$elem,
                    userOptions = this.options;

                // create a Matrix section remove custom-flexcontrol-offscreen
                if (!$elem.hasClass('hasSection')) {

                    if (userOptions.isEditMode == false) {

                        // add matrix section
                        if (!this.elementHasSectionMatrix()) {

                            this.addSection(userOptions);

                            if (userOptions.isPrimary != true) {
                                // check if it's from a load flow if true take same value from userOptions else change isShownLabel to true  
                                if (userOptions.isLoading != true) {
                                    userOptions.isShownLabel = true;
                                }
                            }
                            userOptions.isPrimary = true; // set primary
                        }

                        // fire when moving new numeric field into matrix section
                        if (userOptions.isNew) {
                            //clone Attr if not matrix field
                            this.cloneMatrixAttr(userOptions);
                        }
                    }


                    // set default value 
                    this.setData(userOptions);
                    this.$elem.addClass('custom-flexcontrol-offscreen');
                    this.initField(userOptions);
                    this.addLabel(userOptions);
                    var $likertContainer = this.addlikert(userOptions);
                    this.triggers(userOptions);
                    this.$elem.addClass('hasSection'); // just for testing
                    //this.sortableMatrixToSection();

                    // set Attr for the current field
                    this.setAttribute(userOptions);
                    // update number of field attr in prime field
                    this.updateNumberOfFields(userOptions);
                    // hide row when it's load in the engine and have hide attr
                    if (userOptions.isBuilder == false && userOptions.isFieldHidden == true) {
                        // hide field when number of field is more than number of hidden fields in section
                        $likertContainer.hide();
                        this.CheckAndHideHeaderLabel();

                    } else if (userOptions.isFieldHidden == false) {
                        // show matrix if the field is not hidden 
                        this.getCurrentSection().show();
                    }
                } else {
                    if (userOptions.isLoading == true) {
                        this.setDefault($elem.parent());
                        this.setReadOnly(this.$fieldLi, userOptions);
                    }
                }
                console.log('[End] Create');
            };

            this.destroy = function (options) {

                // move element from matrix0lier-container out 
                // destroy matrix-likert-container and matrix-label-container
                // remove data-matrix from fieldLi
                // remove section if last matrix
                try {
                    this.$elem.removeData('ffmatrix');
                    this.$elem.removeClass('custom-flexcontrol-offscreen');
                    if (options.isBuilder) {
                        // in builder
                        // remove matrix-label-container 
                        this.$label.off().remove();
                        // move out labelDiv fieldDiv Edit
                        var fieldDiv = this.$fieldLi.find('.fieldDiv');
                        var labelDiv = this.$fieldLi.find('.labelDiv');
                        var editDiv = this.$fieldLi.find('.editDelDiv');

                        this.$fieldLi.prepend(editDiv);
                        this.$fieldLi.prepend(fieldDiv);
                        this.$fieldLi.prepend(labelDiv);

                        //  remove matrix-likert-container
                        $(fieldDiv).find('.container-table').off().remove();
                        this.$widget.off().remove();
                        // change back to normal flow
                        this.$fieldLi.find('.editImg').attr('onclick', 'openEditDialog(this,\'field\');');
                        this.$fieldLi.find('.deleteField').attr('onclick', 'deleteField(this,\'field\');');
                        this.$elem.removeClass('hasSection');

                        if (options.isNeedAttr == false) {
                            var isRemoveSection = false;
                            // check if it's matrix field 
                            // check if it's last field in matrix section // used when moving last field from matrix
                            // or have option isRemoved // used when icon delete is clicked
                            // check again if it's last field in section to enable delete section 
                            if (this.options.isPrimary || this.$elem.attr('data-flexcontrol') != 'integer-matrixlikert') {
                                if (this.getNumberOfFieldInSection() == 0 || options.isRemoved == true) {

                                    this.$fieldLi.insertAfter(this.$section);

                                    if (this.getNumberOfFieldInSection() == 0) {
                                        isRemoveSection = true;
                                    }

                                }
                            }

                            this.$fieldLi.removeClass('matrix-field');
                            // update number of field attr in prime field
                            this.updateNumberOfFields(options);
                            // remove data-matrix attr from FieldLi
                            this.$fieldLi.removeAttr('data-matrix');
                            this.$elem.removeClass('matrix-elem');
                            // remove matrix class from edit delete icons
                            this.$fieldLi.find('.matrixEditImg').removeClass('matrixEditImg');
                            this.$fieldLi.find('.matrixDeleteField').removeClass('matrixDeleteField');

                            this.$elem.removeAttributes(['data-matrix-numberofshownfields', 'data-flexcontrol', 'data-matrix', 'data-matrix-value-steps', 'data-matrix-label-isshownlabel', 'data-matrix-labels', 'data-matrix-columns', 'data-matrix-isprimary']);
                            // show the select box
                            this.$elem.show();

                            if (isRemoveSection == true) {
                                this.$section.off().remove();
                            }
                        }
                    } else {
                        // Destroying matrix elements on engine side
                        destroyEngine(this);

                    }
                    console.log('FORM [End] destroy');
                } catch (err) {
                    console.log('FORM [destroy] Unexpected error');
                    console.log(err);
                }
            };
        }

        function destroyEngine(thisElem) {
            // Destroying matrix elements on engine side
            if (thisElem.$ffItemRow !== undefined) {
                // remove data-matrix attr from ff-item-row
                thisElem.$ffItemRow.removeAttr('data-matrix');
                thisElem.$elem.removeClass('matrix-elem');
                thisElem.$elem.removeClass('hasSection');
                // show the main input element
                thisElem.$elem.show();
                var matrixSectionElem = thisElem.$elem.closest('.matrix-section');
                var $matrixField = thisElem.$elem.closest('.matrix-field');
                var $divWrapper = $('<div/>', {
                    'class': 'ff-item-row'
                });
                var ffCol1 = $matrixField.find('.ff-col-1').last();
                var ffCol2 = $matrixField.find('.ff-col-2').last();
                ffCol2.find('.container-table').off().remove();
                $divWrapper.html(ffCol1);
                $divWrapper.append(ffCol2);
                // move out ff-col-1 ff-col-2
                thisElem.$ffItemRow.before($divWrapper);
                if ($(matrixSectionElem).find('.ff-col-2>input').length == 0) {
                    // remove matrix section if there is no matrix input field anymore
                    $(matrixSectionElem).off().remove();
                }
            }

        }

        function safeAttr(inputElem, dataAttr, defaultValue, setDefaultIfEmpty) {
            var defaultvalue = defaultValue;
            try {
                defaultvalue = $(inputElem).attr(dataAttr);
                if (defaultvalue === undefined) {
                    defaultvalue = '';
                }
                if (setDefaultIfEmpty && !defaultvalue) {
                    defaultvalue = defaultValue;
                }
            } catch (err) {
                defaultvalue = defaultValue;
                console.log("FF log (ffmatrix.js):" + err.message);
            }
            return defaultvalue;
        }

        function getSafeBoolean(booleanValue, defaultValue) {
            var returnBool = defaultValue;
            try {
                if (booleanValue !== undefined) {
                    if ((booleanValue + '').toLowerCase() == 'true') {
                        returnBool = true;
                    } else if ((booleanValue + '').toLowerCase() == 'false') {
                        returnBool = false;
                    }
                }
            } catch (err) {
                console.log('[Error] unexpected! Method[getSafeBoolean] Ex[Below]');
                console.log(err);
            }
            return returnBool;
        }

        function getSafeArry(stringValue) {
            var arrayValue;
            if (stringValue.indexOf(',') != -1) {
                arrayValue = stringValue.split(',');
            }
            return arrayValue;
        }

        FFMatrix.prototype.init = function (options, elem) {
            var self;
            self = this;
            self.elem = elem;
            self.$elem = $(elem);

            if (options !== undefined) {
                this.setOption(options, elem);
            }

            return self.options = $.extend({}, $.fn.ffmatrix.defaults, options);
        };
        return FFMatrix;
    })();

    $.fn.ffmatrix = function (method, options) {
        // Following lines are added for unit testing compatibility
        if (typeof method === 'object' || !method) {
            var plugin = new FFMatrix();
            plugin.$elem = this;
            plugin.$fieldLi = $(this).closest('.fieldLi');
            options = method;
            plugin.init(options, this);
            return plugin;

        }
        var objsThis = this;
        for (var i=0; i<objsThis.length; i++) {
            var currentThisObj = objsThis[i];
            try {
                var plugin = new FFMatrix();
                plugin.$elem = currentThisObj;
                plugin.$fieldLi = $(currentThisObj).closest('.fieldLi');
                try {
                    if (options && options.isBuilder == false) {
                        plugin.$ffItemRow = $(currentThisObj).closest('.ff-item-row');
                    }
                } catch (err) {
                    console.log('FORM [ffmatrix] Matrix is instantiated as in builder');
                    console.log(err);
                }

                // plugin works with select fields
                if (!$(currentThisObj).is('input') && !$(currentThisObj).hasClass('matrix-section')) {
                    $.log('Sorry, this plugin only works with input fields.');
                } else if ($(currentThisObj).hasClass('matrix-section')) {
                    console.log('has matrix section');
                    return plugin.removeSectionIf();
                }

                // method supplied
                if (plugin.hasOwnProperty(method)) {
                    plugin.init(options, currentThisObj);

                    if (options.isLoading == true && plugin.$fieldLi.length == 0) {
                        plugin.$fieldLi = $(currentThisObj).closest('.matrix-field');
                    }
                    if (method === 'create') {
                        return plugin.create(options);
                    } else {
                        if (!$(currentThisObj).hasClass('custom-flexcontrol-offscreen')) {
                            $(currentThisObj).addClass('custom-flexcontrol-offscreen');
                        }

                        // Used in after create method
                        plugin.$section = $(currentThisObj).parents('.matrix-section').parent('.matrix-section-container');
                        if (plugin.$section.length == 0 && $(currentThisObj).attr('data-matrix') != undefined) {
                            var dataMatrix = $(currentThisObj).attr('data-matrix').split('.');
                            plugin.$section = $('[data-matrix="' + dataMatrix[0] + '"]').parent('.matrix-section-container');
                        }
                        plugin.$widget = plugin.$fieldLi.find('.matrix-likert-container');
                        plugin.$label = plugin.$fieldLi.find('.matrix-label-container');


                        // widget exists?
                        if (plugin.$widget) {
                            return plugin[method](options);
                        }
                    }

                    // no method supplied or only options supplied
                } else if (typeof method === 'object' || !method) {
                    options = method;
                    plugin.init(options, this);
                    return plugin.create();

                } else {
                    $.log('[ERROR] Method' + method + 'does not exist on jQuery.ffmatrix');
                }
            } catch (err) {
                console.log('[ERROR] Matrix plugin crashed with error:' + err);
                console.log(err);
            }
        };
        return objsThis;
    };
    return $.fn.ffmatrix.defaults = {
        initialMatrix: null, // initial matrix
        matrix: '', // to determine what section it belongs (s#.f#)
        stepsValue: 1, // to identify the start value for first likert
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], //it will contain the labels name
        isShownLabel: false, //  true/false to show label above value
        columns: 5, // number of columns
        readonly: false, // make the matrix ready-only?
        isFieldHidden: false,
        isBuilder: false,
        isNew: false, // true is the field is new to the matrix section to enable clone attr
        isPrimary: false, // the first field of the matrix that have the matrix control 
        isEditMode: false, // false: Add section/set prime/clone attr |true: used in setDefault/moving between section
        isNeedAttr: false, // true:keep matrix section alive used with destroy when we need to reset all labels and matrix
        isLoading: false, // true: used to when page is loeaded in builder to add matrix in matrix section
        isRemoved: false, // true: remove prime field from matrix section
        onSelect: function (value, text) { }, // callback fired when a likert is selected
        onClear: function (value, text) { }, // callback fired when a likert is cleared
        onDestroy: function (value, text) { }, // callback fired when a likert is destroyed
        onChange: function ($elem, options) { } // callback fired when label text change
    };

})((typeof fs !== 'undefined') ? fs : (typeof jQuery !== 'undefined') ? jQuery : {});
