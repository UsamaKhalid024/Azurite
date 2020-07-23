var FsJSGrid = (function (global) {
    'use strict';
    var Data, DataList;
    var _eventHandlers = {};
    var FsJSGridApi = function () {};

    /**
     * @description main method to build grid 
     * @private
     */
    //#region build grid
    var BuilderGrid = function (id, noRecordMessageText, rebuild) {

        var FSGrid = document.getElementById(id);
        
        if (FSGrid == null) {
            console.log('[ERROR] FSGrid element does not exist in page');
            return;
        } else if (FSGrid.childNodes.length > 0  ) {
            // rebuild grid if pShowAddPanel is passed
            if(typeof rebuild != "undefined" && rebuild == true){
                var firstChild = FSGrid.children[0];
                firstChild.parentNode.removeChild(firstChild);
                FSGrid = document.getElementById(id);
            }
            else
            {
                return;
            }
        }

        var gridWrapperInner = document.createElement('div');
        gridWrapperInner.classList.add('grid-wrapper-inner');

        gridWrapperInner.appendChild(buildGridHeader());
        gridWrapperInner.appendChild(buildGridBody(noRecordMessageText));
        if(showAddPanel == true) // Control render add by setting showAddPanel
        {
            gridWrapperInner.appendChild(buildGridFooter());
        }

        var gridWrapper = document.createElement('div');
        gridWrapper.classList.add('grid-wrapper');

        gridWrapper.appendChild(gridWrapperInner);

        var gridWrapperOuter = document.createElement('div');
        gridWrapperOuter.classList.add('grid-wrapper-outer');

        gridWrapperOuter.appendChild(gridWrapper);

        FSGrid.appendChild(gridWrapperOuter);

    };


    //header
    var buildGridHeader = function () {

        // create div
        var gridStatusSummeryWrapperText = document.createElement('div');
        gridStatusSummeryWrapperText.classList.add('grid-status-summery-wrapper-text');

        var gridStatusSummeryText = document.createElement('span');
        gridStatusSummeryText.classList.add('grid-status-summery-text');

        var gridStatusSummeryCount = document.createElement('span');
        gridStatusSummeryCount.classList.add('grid-status-summery-count');

        gridStatusSummeryWrapperText.appendChild(gridStatusSummeryText);
        gridStatusSummeryWrapperText.appendChild(gridStatusSummeryCount);


        var secondGridStatusSummeryWrapperText = gridStatusSummeryWrapperText.cloneNode(true);

        gridStatusSummeryWrapperText.getElementsByClassName('grid-status-summery-text')[0].setAttribute('id', 'summery-text');
        gridStatusSummeryWrapperText.getElementsByClassName('grid-status-summery-count')[0].setAttribute('id', 'summery-value');

        secondGridStatusSummeryWrapperText.getElementsByClassName('grid-status-summery-text')[0].setAttribute('id', 'summery-result-text');
        secondGridStatusSummeryWrapperText.getElementsByClassName('grid-status-summery-count')[0].setAttribute('id', 'summery-result-value');

        var gridStatusSummery = document.createElement('div');
        gridStatusSummery.classList.add('grid-status-summery');

        gridStatusSummery.appendChild(gridStatusSummeryWrapperText);
        gridStatusSummery.appendChild(secondGridStatusSummeryWrapperText);


        var ProgressBar = document.createElement('div');
        ProgressBar.setAttribute('id', 'progress-bar');

        var gridStatusProgress = document.createElement('div');
        gridStatusProgress.setAttribute('id', 'grid-status-progress-bar');
        gridStatusProgress.appendChild(ProgressBar);

        var gridStatusBoxInner = document.createElement('div');
        gridStatusBoxInner.classList.add('grid-status-box-inner');

        gridStatusBoxInner.appendChild(gridStatusSummery);
        gridStatusBoxInner.appendChild(gridStatusProgress);

        var gridStatusBox = document.createElement('div');
        gridStatusBox.classList.add('grid-status-box');

        gridStatusBox.appendChild(gridStatusBoxInner);

        // TODO: config both value by pass from outside of JS 
        var btnGrid = document.createElement('button');
        btnGrid.setAttribute('type', 'button');
        btnGrid.innerHTML = 'Contact Us';
        btnGrid.setAttribute('onClick', "fsLightbox3387782.show();");
        btnGrid.classList.add('grid-button');

        var gridHeaderButton = document.createElement('div');
        gridHeaderButton.classList.add('grid-header-button');

        gridHeaderButton.appendChild(btnGrid);


        var gridHeader = document.createElement('div');
        gridHeader.classList.add('grid-header');

        gridHeader.appendChild(gridStatusBox);
        gridHeader.appendChild(gridHeaderButton);

        return gridHeader;
    };
    //body
    var buildGridBody = function (noRecordMessageText) {
        var noRecordMessage = document.createElement('center');
        noRecordMessage.setAttribute('id', 'no-record-message');
        noRecordMessage.innerHTML = (noRecordMessageText);
        noRecordMessage.classList.add('show');

        var gridTable = document.createElement('div');
        gridTable.classList.add('grid-table');
        gridTable.setAttribute('id', 'grid-content');

        gridTable.appendChild(noRecordMessage);

        var gridBody = document.createElement('div');
        gridBody.classList.add('grid-body');

        gridBody.appendChild(gridTable);

        return gridBody;
    };
    //footer
    var buildGridFooter = function () {

        var availableCountText = document.createElement('span');
        availableCountText.setAttribute('id', 'available-count-text');

        var availableCount = document.createElement('span');
        availableCount.classList.add('available-count');
        availableCount.setAttribute('id', 'available-count-value');

        var sandboxAvailable = document.createElement('div');
        sandboxAvailable.classList.add('sandbox-available');

        sandboxAvailable.appendChild(availableCount);
        sandboxAvailable.appendChild(availableCountText);



        var gridButton = document.createElement('button');
        gridButton.setAttribute('type', 'button');
        gridButton.classList.add('grid-button');
        gridButton.innerHTML = 'Add Org';
        gridButton.setAttribute('id', 'btn-add');


        var gridSearchItemInner = document.createElement('span');
        gridSearchItemInner.classList.add('grid-search-item-inner');

        gridSearchItemInner.appendChild(gridButton);

        var txtSearch = document.createElement('input');
        txtSearch.setAttribute('id', 'txt-search');
        txtSearch.classList.add('Search-textbox');
        txtSearch.setAttribute(recordIdKey.key, '');
        txtSearch.setAttribute('placeholder', 'Select a sandbox org to add');

        var autoCompleteWrapper = document.createElement('div');
        autoCompleteWrapper.classList.add('autocomplete');
        autoCompleteWrapper.appendChild(txtSearch);
        autoCompleteWrapper.appendChild(gridSearchItemInner);

        var gridSearchItem = document.createElement('div');
        gridSearchItem.classList.add('grid-search-item');



        gridSearchItem.appendChild(autoCompleteWrapper);
        gridSearchItem.appendChild(sandboxAvailable);

        var gridSearchRow = document.createElement('div');
        gridSearchRow.classList.add('grid-search-row');

        gridSearchRow.appendChild(gridSearchItem);

        var gridSearch = document.createElement('div');
        gridSearch.classList.add('grid-search');

        gridSearch.appendChild(gridSearchRow);

        var gridFooter = document.createElement('div');
        gridFooter.classList.add('grid-footer');

        gridFooter.appendChild(gridSearch);

        return gridFooter;
    };

    //#endregion

    //#region data Control
    var setList = function (dataList) {

        DataList = dataList;
    };

    var setGrid = function (data, recordIdKey, elementProperty) {
        Data = data;
        clearGrid();
        addMultiRecords(data, recordIdKey, elementProperty);
    };


    var FsJSGridAddRecordBySearch = function (inputElement, FsJSGridAddRecordEventListener) {
        var inputValueText = inputElement.attributes['selected-' + recordNameKey.key].value;;
        var inputValueId = inputElement.attributes['selected-' + recordIdKey.key].value;
        if (FsJSGridAddRecordEventListener != undefined) {
            // call to FsJSGridAddRecordEventListener 
            FsJSGridAddRecordEventListener(inputValueText, inputValueId); // Overriding #1

        } else {
            // executed in local page
            for (var index = 0; index < DataList.length; index++) {
                if (SandboxList[index][listRecordIdKey.key] == inputValueId) {
                    addSingleRecord(SandboxList[index], recordIdKey, elementProperty);
                    break;
                }
            }

        }
    };

    function addRecordHandler() {
        // get text from textbox and pass it to the Override method 
        var txtSearch = document.getElementById('txt-search');
        if (txtSearch.value != '' && typeof txtSearch.attributes['selected-' + recordIdKey.key] != "undefined")
            if (typeof FsJSGridAddRecordEventListener === 'function') {
                FsJSGridAddRecordBySearch(txtSearch, FsJSGridAddRecordEventListener);
            } else {
                FsJSGridAddRecordBySearch(txtSearch);
            }
        txtSearch.value = '';
    }
    var setEventListener = function () {
        // Set event for add Record

        var btnAdd = document.getElementById('btn-add');
        if(btnAdd != null){
            removeAllEvents(btnAdd, 'click');
            addEvent(btnAdd, 'click', addRecordHandler, false);
        }

    };

    var removeRecord = function (item) {
        // remove record from grid
        var parentRow = item.closest('.grid-content-row');
        // get element from dom
        var row = document.querySelector('[' + parentRow.attributes[0].name + '="' + parentRow.attributes[0].value + '"]');
        row.parentNode.removeChild(row);
    };

    var clearGrid = function () {
        var GridItem = document.querySelectorAll('.grid-content-row');
        for (var index = 0; index < GridItem.length; index++) {
            if (GridItem[index] != null) {
                GridItem[index].parentNode.removeChild(GridItem[index]);
            }

        }
    };

    var addSingleRecord = function (element, recordIdKey, elementProperty) {
        if (typeof element == 'object') {
            console.log('[info] addSingleRecord Start... ');
            var row = document.createElement('div');
            // assign key record 
            if (element != null && element[recordIdKey.key] != null) {
                row.setAttribute(recordIdKey.key, element[recordIdKey.key]);
            }
            row.classList.add('grid-content-row');
            toggleNoRecordMessage(false);
            // sort element property 
            if (elementProperty == null && elementProperty.length == 0) {
                elementProperty = Object.getOwnPropertyNames(element).sort();
            }
            for (var key in elementProperty) {
                key = elementProperty[key];
                if (element.hasOwnProperty(key)) {
                    var lowerCaseKey = key.toLowerCase();
                    if (lowerCaseKey.indexOf(recordIdKey.key.toLowerCase()) == -1) {

                        var item = document.createElement('div');
                        item.classList.add('grid-content-row-item');

                        var itemValue;
                        if(lowerCaseKey.indexOf(recordNameKey.id.toLowerCase()) != -1){
                            // set name with id in same column 
                            itemValue = document.createElement('span');
                            itemValue.innerHTML = element[key] + ' ('+element[recordIdKey.key]+')';

                        }
                        else if (lowerCaseKey.indexOf('icon') == -1) {
                            itemValue = document.createElement('span');
                            itemValue.innerHTML = element[key];
                        } else if (lowerCaseKey.indexOf('icon') >= 0) {
                            // if element have icon it will add it to the end of the row
                            // add event on click 
                            itemValue = document.createElement('button');
                            itemValue.setAttribute('type', 'button');
                            itemValue.classList.add(element[key]);
                            itemValue.addEventListener('click', function () {

                                if (typeof FsJSGridAddRecordEventListener === 'function') {
                                    FsJSGridRemoveRecord(this, FsJSGridRemoveRecordEventListener);
                                } else {
                                    FsJSGridRemoveRecord(this);
                                }
                            });
                        }
                        item.appendChild(itemValue);
                        row.appendChild(item);
                    }
                }
            }
        }
        var gridContentRow = document.getElementById('grid-content');
        gridContentRow.appendChild(row);
    };

    var FsJSGridRemoveRecord = function (element, FsJSGridRemoveRecordEventListener) {
        if (FsJSGridRemoveRecordEventListener != undefined) {
            // call to FsJSGridRemoveRecordEventListener 
            FsJSGridRemoveRecordEventListener(element); // Overriding #1

        } else {
            removeRecord(element);
        }
    };

    var toggleNoRecordMessage = function (show) {
        var noRecordMessage = document.getElementById('no-record-message');
        if (typeof show == "boolean" && show == true) {
            noRecordMessage.classList.add('show');
            noRecordMessage.classList.remove('hide');
        } else {
            noRecordMessage.classList.add('hide');
            noRecordMessage.classList.remove('show');
        }
    };

    var addMultiRecords = function (data, recordIdKey, elementProperty) {
        if (data != null && data.length !== null) {
            if( data.length == 0){     
                toggleNoRecordMessage(true);
            }
        }
        for (var index = 0; index < data.length; index++) {
            // for each item added in the body remove from DataList
            addSingleRecord(data[index], recordIdKey, elementProperty);
        }
    };

    //#endregion

    //#region Counter Control

    var setProgressBar = function (totalNumberOfItem , numberOfUsedItem) {
        var progressBarValue = numberOfUsedItem * 100 / totalNumberOfItem;

        if(isNaN(progressBarValue) == false){
        var element = document.getElementById("progress-bar");
        var width = 1;
        var identity = setInterval(scene, 10);

            function scene() {
                if (width >= progressBarValue) {
                    clearInterval(identity);
                } else {
                    width++;
                    element.style.width = width + '%';
                }
            }
        }
        return progressBarValue;
    };

    var setCounters = function (DataObject) {

        // Set header counter
        var item1 = document.getElementById('summery-text');
        item1.innerHTML = '';
        item1.innerHTML = (DataObject[0].text);

        var item2 = document.getElementById('summery-result-text');
        item2.innerHTML = '';
        item2.innerHTML = (DataObject[1].text);

        // Set footer counter
        if(showAddPanel){
            var item3 = document.getElementById('available-count-text');
            item3.innerHTML = '';
            item3.innerHTML = (DataObject[2].text);
        }
        updateCounterValue(DataObject);
    };

    var setShowAddPanel = function(DataObject){
        // showAddPanel
        var totalNumberOfItem = parseFloat(DataObject[0].value);
        var numberOfUsedItem = parseFloat(DataObject[1].value);

        var numberOfAvailableItem = totalNumberOfItem - numberOfUsedItem;

        if(numberOfAvailableItem > 0){
            showAddPanel = true; // update global variable 
            
        }else{
            showAddPanel = false;
        }

    }

    var updateCounterValue = function (DataObject) {
        // Unassigned X / Y - Y is purchased amount overall, X is the number that you can still add as managed
        //Z available sandboxes - Z is the number that you can still add as managed (it is the same as X)

        // Update header counter
        var totalNumberOfItem = parseFloat(DataObject[0].value);
        var numberOfUsedItem = parseFloat(DataObject[1].value);

        var numberOfAvailableItem = totalNumberOfItem - numberOfUsedItem;

        setProgressBar(totalNumberOfItem,numberOfUsedItem);
        var item1 = document.getElementById('summery-value');
        item1.innerHTML = '';
        item1.innerHTML = totalNumberOfItem;

        var item2 = document.getElementById('summery-result-value');
        item2.innerHTML = '';
        item2.innerHTML = numberOfAvailableItem + ' / ' + totalNumberOfItem;

        // Update footer counter
        var item3 = document.getElementById('available-count-value');
        if(item3 != null){
            item3.innerHTML = '';
            item3.innerHTML = (numberOfAvailableItem);
        }

    };

    //#endregion

    //#region autocomplete
    function autocomplete(inputElement, datalist, searchKey, recordIdKey) {
        setList(datalist);
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inputElement.addEventListener('input', function (event) {
            autoCompleteEventListener(event)
        });
        var autoCompleteEventListener = function (event) {
            var list, optionItem, val = event.currentTarget.value;
            if (val.length > 2) {
                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) {
                    return false;
                }
                currentFocus = -1;
                /*create a ul element that will contain the items (values):*/
                list = document.createElement('div');
                list.setAttribute('id', event.currentTarget.id + '-autocomplete-list');
                list.setAttribute('class', 'autocomplete-items');
                /*append the DIV element as a child of the autocomplete container:*/
                //this.parentNode.appendChild(list);
                var grid = document.querySelector('.grid-wrapper-inner');
                grid.appendChild(list);
                updatePosition();
                /*for each item in the array...*/
                for (var index = 0; index < DataList.length; index++) {
                    // for each item added in the body remove from DataList
                    optionItem = setAutoCompleteList(inputElement, DataList[index], searchKey, val, recordIdKey);
                    if (optionItem != null) {
                        list.appendChild(optionItem);
                    }
                }
            }
        }
        var SkipIfExist = function(DataFromGrid, element) {
            // skip if the record exist in the grid 
            if ( typeof DataFromGrid != 'undefined'){
                for (var j = 0; j < DataFromGrid.length; j++) {
                    if (DataFromGrid[j][listRecordIdKey.key] == element[recordIdKey.id]) {
                        return false;
                    }
                }
            }else{
                console.log('[ERROR] DataFromGrid does not exist');
            }
            return true;
        }

        var setAutoCompleteList = function (inputElement, element, searchByKey, val, recordIdKey) {

                /*check if the item starts with the same letters as the text field value:*/
                if ((element[searchByKey.key].toUpperCase().indexOf(val.toUpperCase()) > -1
                || element[searchByKey.id].substr(0, val.length).toUpperCase() == val.toUpperCase()) && SkipIfExist(Data, element)) {
                    /*create a DIV element for each matching element:*/
                    var optionList = document.createElement('div');
                    /*make the matching letters bold:*/
                    optionList.innerHTML = element[searchByKey.key] + ' (' + element[searchByKey.id]+')';
                    /*insert a input field that will hold the current array item's value:*/
                    var input = document.createElement('input');
                    input.setAttribute('type', 'hidden');
                    input.setAttribute('value', element[searchByKey.key]);
                    for (var itemKey in element) {
                        input.setAttribute(itemKey, element[itemKey]);
                    }
                    optionList.appendChild(input);
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    optionList.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        inputElement.value = this.getElementsByTagName('input')[0].value;
                        var selected = this.getElementsByTagName('input');

                        if (selected[0].attributes[recordIdKey.id] != null && selected[0].attributes[recordNameKey.key] != null) {
                            // copy record id and name from list items to search-textbox element
                            // attr in list item name it's same name in the DataList property
                            var idKey = selected[0].attributes[recordIdKey.id].value;
                            var nameKey =  selected[0].attributes[recordNameKey.id].value;
                            inputElement.setAttribute('selected-' + recordIdKey.key, idKey);
                            inputElement.setAttribute('selected-' + recordNameKey.key, nameKey);
                            console.log('[log] selected value:' + inputElement.value + ' key: ' + idKey);
                        }

                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    return optionList;
                }
            
        }
        /*execute a function presses a key on the keyboard:*/
        inputElement.addEventListener("keydown", function (event) {
            var itemList = document.getElementById(this.id + '-autocomplete-list');
            if (itemList) itemList = itemList.getElementsByTagName('div');
            if (event.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(itemList);
            } else if (event.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(itemList);
            } else if (event.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                event.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (itemList) itemList[currentFocus].click();
                }
            }
        });

        var addActive = function(itemList) {
            /*a function to classify an item as "active":*/
            if (!itemList) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(itemList);
            if (currentFocus >= itemList.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (itemList.length - 1);
            /*add class "autocomplete-active":*/
            itemList[currentFocus].classList.add('autocomplete-active');
        }

        var removeActive = function(itemRecord) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < itemRecord.length; i++) {
                itemRecord[i].classList.remove('autocomplete-active');
            }
        }

        var closeAllLists = function(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName('autocomplete-items');
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inputElement) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener('click', function (e) {
            closeAllLists(e.target);
        });
        window.addEventListener('scroll',  function (e) {
            closeAllLists(e.target);
        }, false);
        window.addEventListener('resize',  function (e) {
            closeAllLists(e.target);
        }, false);
        // Helper function to get an element's exact position
        function getPosition(el) {
            let rect, X = 0,
                Y = 0;
            if (el) {
                rect = el.getBoundingClientRect();
                X = rect.left + window.scrollX;
                Y = rect.top + window.scrollY;
            }
            return {
                x: X,
                y: Y
            }
        }
        
        var updatePosition = function() {
            // get position of textbox search
            var txtSearch = document.getElementById('txt-search');
            var txtSearchPosition = getPosition(txtSearch);
            var txtSearchAutoCompleteList = document.getElementById(txtSearch.id + '-autocomplete-list');
            var blueHeader= document.getElementById('AppBodyHeader');
            // If it is Classic, we will have the AppBodyHeader, otherwise(lightning Experience ON) we will calculate the dropdown different
            if(blueHeader != null){
                txtSearchAutoCompleteList.style.top = (txtSearchPosition.y + 34 - blueHeader.offsetHeight) + 'px';
                txtSearchAutoCompleteList.style.left = (txtSearchPosition.x - 9 ) + 'px';
            }else{
                txtSearchAutoCompleteList.style.top = (txtSearchPosition.y + 34) + 'px';
                txtSearchAutoCompleteList.style.left = (txtSearchPosition.x ) + 'px';
            }
        }

           // Leave this code as the last code.
        if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
            return {
                autoCompleteEventListener : autoCompleteEventListener,
                setAutoCompleteList : setAutoCompleteList,
            }
        }
    }

    //#endregion

    //#region event 
    function addEvent(node, event, handler, capture) {
        if (!(node in _eventHandlers)) {
            // _eventHandlers stores references to nodes
            _eventHandlers[node] = {};
        }
        if (!(event in _eventHandlers[node])) {
            // each entry contains another entry for each event type
            _eventHandlers[node][event] = [];
        }
        // capture reference
        _eventHandlers[node][event].push([handler, capture]);
        node.addEventListener(event, handler, capture);
    }
    function removeAllEvents(node, event) {
        if (node in _eventHandlers) {
            var handlers = _eventHandlers[node];
            if (event in handlers) {
                var eventHandlers = handlers[event];
                for (var i = eventHandlers.length; i--;) {
                    // Remove all event from node
                    var handler = eventHandlers[i];
                    node.removeEventListener(event, handler[0], handler[1]);
                }
                // Remove all event from node in _eventHandlers
                _eventHandlers[node][event] = [];
            }
        }
    }
    //#endregion

    //#region prototype functions
    FsJSGridApi.prototype.FsJSGrid = function () {

    }
    /**
     * @description 
     * @public
     */
    FsJSGridApi.prototype.init = function (id, emptyMessage, rebuild, DataList) {

        console.log('[FsJSGrid] start');
        setShowAddPanel(DataList);
        BuilderGrid(id, emptyMessage, rebuild);
        setEventListener();

    };
    /**
     * @description Set Records in grid
     * @param {data}  
     * @param {key}  
     * @public
     */
    FsJSGridApi.prototype.setData = function (data, recordIdKey, elementProperty) {
        setGrid(data, recordIdKey, elementProperty);
    }

    /**
     * @description Set AutoComplete list 
     * @param {Object}   data of list 
     * @param {string}   index key of search
     * @param {string}   index key of selected value id will be saved as {selected-"key"}
     * 
     * @public
     */
    FsJSGridApi.prototype.setAutocomplete = function (DataList, key, recordIdKey) {
        if(showAddPanel){
            autocomplete(document.getElementById("txt-search"), DataList, key, recordIdKey);
        }
    }

    /**
     * @description Set Counter text and values
     * @param {Object}  // three set of field in json object with text and value 
     * @public
     */
    FsJSGridApi.prototype.setCounter = function (DataList) {
        setCounters(DataList);
    }

    /**
     * @description update Counter values and progress bar
     * @param {Object} three set of field in json object with value
     * @public
     */
    FsJSGridApi.prototype.updateCounter = function (DataList) {
        updateCounterValue(DataList);
    }

    /**
     * @description Add Record to grid after insert into org
     * @param {string}  result record to add to the grid  
     * @public
     */
    FsJSGridApi.prototype.addRecord = function (result, recordIdKey, elementProperty) {
        if (result != null) {
            addSingleRecord(result, recordIdKey, elementProperty);
        }
    };
    /**
     * @description Remove Record to grid after insert into org
     * @param {string}  result record to add to the grid  
     * @public
     */
    FsJSGridApi.prototype.removeRecord = function (result) {
        if (result != null) {
            removeRecord(result);
        }
    };
    //#endregion

  //  return new FsJSGridApi();

        // This code is to make the method available for Mocha JS Unit Test.
    // Leave this code as the last code.
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        return {
            BuilderGrid : BuilderGrid,
            setCounters : setCounters,
            updateCounterValue : updateCounterValue,
            setProgressBar : setProgressBar,
            addSingleRecord : addSingleRecord,
            addMultiRecords : addMultiRecords,
            removeRecord : removeRecord,
            autocomplete : autocomplete,
            setShowAddPanel: setShowAddPanel
        }
    }
    return new FsJSGridApi();
    // Don't add method here. Add it above the code above.

}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function('return this')()));

// Following lines are added for unit testing compaitbility
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = FsJSGrid;
}