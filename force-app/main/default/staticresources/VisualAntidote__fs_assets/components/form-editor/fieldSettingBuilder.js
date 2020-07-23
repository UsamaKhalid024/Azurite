/**
 * @summary Field Setting Builder is a component that helps the FormBuilder Section in FormEditor to build the Field Setting.
 * 
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
        root.FieldSettingBuilder = libObject.FieldSettingBuilder;
        root.FISB = libObject.FISB;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var $ = fs;

    var fieldSettingFieldSubSectionContext;
    var fieldSettingSectionContext;

    var setFieldSettingSection = function(pfieldSettingSectionElement) {
        fieldSettingSectionContext = pfieldSettingSectionElement;
        setFieldSettingSubSection(pfieldSettingSectionElement);
    };

    var getFieldSettingSection = function() {
        return fieldSettingSectionContext;
    };

    var setFieldSettingSubSection = function(pFieldSettingSection) {
        fieldSettingFieldSubSectionContext = $(pFieldSettingSection).find('.fieldsettingssection');
    };

    var getFieldSettingSubSection = function() {
        return fieldSettingFieldSubSectionContext;
    };

    var addPrependRowInFieldSubSectionTable = function(pRowId, pContent) {
        var newRow = getRowWithOneColumn(pContent);
        newRow.attr('id', pRowId);
        addNewRowInFieldSettingSubSection(newRow, false);
    };

    var addNewRowInFieldSettingSubSection = function(pNewRow, pAddInTheEnd) {
        var tableInSubSection = getFieldSettingSubSection().find(
            '.fieldsettingssection-table>tbody'
        );
        if (pAddInTheEnd) {
            tableInSubSection.append(pNewRow);
        } else {
            tableInSubSection.prepend(pNewRow);
        }
    };

    var getRowWithOneColumn = function(pColumnContent) {
        var row = $('<tr />', { class: 'fieldTd fieldsettingslevel2' });
        var cell = $('<td />', { class: 'formatEditCol2', colspan: '2' });
        cell.append(pColumnContent);
        row.append(cell);
        return row;
    };

    var getRowWithTwoColumns = function(pFirstColumnContent, pSecondColumnContent) {
        var row = $('<tr />', { class: 'fieldTd fieldsettingslevel2' });

        var firstColumn = $('<td />', { class: 'formatEdit' });
        firstColumn.append(pFirstColumnContent);
        row.append(firstColumn);

        var secondColumn = $('<td />', { class: 'formatEditCol2' });
        secondColumn.append(pSecondColumnContent);
        row.append(secondColumn);

        return row;
    };

    var addLabelAndFieldInFieldSettingSubSection = function(
        pRowId,
        pLabelElement,
        pInputElement,
        pAddRowInTheEndOfTable
    ) {
        var trRow = getRowWithTwoColumns(pLabelElement, pInputElement);
        trRow.attr('id', pRowId);
        addNewRowInFieldSettingSubSection(trRow, pAddRowInTheEndOfTable);
    };

    var getNewCheckBoxField = function(pCheckBoxId, pText, pCheckBoxOnChangeFunction) {
        var ckInput = getNewCheckBoxInputElement();
        ckInput.attr('id', pCheckBoxId);
        ckInput.addClass('css-checkbox');
        ckInput.on('change', pCheckBoxOnChangeFunction);

        var lblEmptyLabel = getNewLabelElement('');
        lblEmptyLabel.addClass('css-label');
        lblEmptyLabel.attr('for', pCheckBoxId);

        var lblText = getNewLabelElement(pText);
        lblText.addClass('checkbox-label');
        lblText.attr('for', pCheckBoxId);

        var ckContainer = $('<div />', { class: 'checkbox-container' });
        ckContainer.append(ckInput);
        ckContainer.append(lblEmptyLabel);
        ckContainer.append(lblText);

        return ckContainer;
    };

    var getNewLabelElement = function(pText) {
        var labelElement = $('<label />');
        labelElement.append(pText);
        return labelElement;
    };

    var getNewTextInputElement = function() {
        var inputElement = $('<input />', { type: 'text' });
        return inputElement;
    };

    var getNewCheckBoxInputElement = function() {
        var inputElement = $('<input />', { type: 'checkbox' });
        return inputElement;
    };

    var setFieldAsError = function(pInputField) {
        pInputField.addClass('field-settings__inputfield--error');
        pInputField.focus();
    };

    var removeFieldAsError = function(pInputField) {
        pInputField.removeClass('field-settings__inputfield--error');
    };

    var getFieldErrorText = function(pErrorMessage) {
        var errorSpan = $('<span />', { class: 'field-settings__errorlabel' });
        errorSpan.append(pErrorMessage);
        return errorSpan;
    };

    var hideAllFieldsFromFieldSettingSubSection = function() {
        getFieldSettingSubSection()
            .find('.fieldsettingslevel2')
            .hide();
    };

    var showAllFieldsFromFieldSettingSubSection = function() {
        getFieldSettingSubSection()
            .find('.fieldsettingslevel2')
            .show();
    };

    var getWaitingGearContainer = function(pWaitingText, pWidth) {
        var waitingContainer = $('<div />', {
            class: 'gear-container load-status-small',
            style: 'width: ' + pWidth
        });

        var divGear = $('<div />', { class: 'gear-container__gearIcon dialogSmall' });
        waitingContainer.append(divGear);

        var divText = $('<div />', { class: 'gear-container__text primary' });
        divText.append(pWaitingText);
        waitingContainer.append(divText);

        return waitingContainer;
    };

    var addWaitingGear = function() {
        var waitingGearDiv = getWaitingGearContainer('Loading, please wait...', '200px');
        hideAllFieldsFromFieldSettingSubSection();
        addPrependRowInFieldSubSectionTable('trWaitingGear', waitingGearDiv);
    };

    var removeWaitingGear = function() {
        getFieldSettingSubSection()
            .find('#trWaitingGear')
            .remove();
        showAllFieldsFromFieldSettingSubSection();
    };

    var _fieldSettingBuilder = {
        setFieldSettingSection: setFieldSettingSection,
        getFieldSettingSection: getFieldSettingSection,
        getFieldSettingSubSection : getFieldSettingSubSection,
        addPrependRowInFieldSubSectionTable: addPrependRowInFieldSubSectionTable,
        addLabelAndFieldInFieldSettingSubSection: addLabelAndFieldInFieldSettingSubSection,
        getNewCheckBoxField: getNewCheckBoxField,
        getNewLabelElement: getNewLabelElement,
        getNewTextInputElement: getNewTextInputElement,
        setFieldAsError: setFieldAsError,
        removeFieldAsError: removeFieldAsError,
        getFieldErrorText: getFieldErrorText,
        addWaitingGear: addWaitingGear,
        removeWaitingGear: removeWaitingGear,
        hideAllFieldsFromFieldSettingSubSection: hideAllFieldsFromFieldSettingSubSection,
        showAllFieldsFromFieldSettingSubSection: showAllFieldsFromFieldSettingSubSection
    };

    return {
        FieldSettingBuilder: _fieldSettingBuilder,
        FISB: _fieldSettingBuilder
    };
});
