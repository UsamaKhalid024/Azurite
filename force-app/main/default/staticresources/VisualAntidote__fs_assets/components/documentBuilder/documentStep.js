/**
 * @summary JS to create steps with pre-formatted options
 * @todo remove unnecessary debug logs with FORM_DEV
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
        root.DocumentStep = libObject.DocumentStep;
        root.DS = libObject.DocumentStep;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    var enumEventType = {
        Click: 'click',
        Change: 'change',
        Blur: 'blur'
    };
    var enumControlType = {
        Text: 'text',
        SingleSelect: 'select-one',
        Radio: 'radio'
    };
    /**
     * function for callback capabilites
     */
    var onChangeEventOnEventDataAttrItems = function() {
        return true;
    };
    /**
     * function for callback capabilites
     */
    var onStepClickBefore = function() {
        return true;
    };
    /**
     * function for callback capabilites
     */
    var onStepClickAfter = function() {};
    /**
     * default settings - optionally can be overriden by passing *options* by calling - new fs.DS.Step(1,options)
     */
    var defaultSettings = {
        title: 'Title',
        titlePrefix: 'Step',
        isEditMode: false,
        showBadgeTitle: true,
        showToggleBtn: false,
        buttonText: 'Next',
        showStepBtn: true,
        initialActiveStep: false,
        eventDataAttributeName: '',
        showStepBtnAlways: false,
        isLastStep: false,
        lastStepNote: 'Save your settings if you are done with the setup',
        lastButtonText: 'Save Setup',
        onStepClickBefore: onStepClickBefore,
        onStepClickAfter: onStepClickAfter,
        onChangeEventOnEventDataAttrItems: onChangeEventOnEventDataAttrItems
    };
    var getSafeBoolean = function(booleanValue, defaultValue) {
        var returnBool = defaultValue;
        try {
            if (booleanValue === undefined) {
                return returnBool;
            }
            if (booleanValue.toString().toLowerCase() == 'true' || booleanValue == true) {
                returnBool = true;
            } else if (booleanValue.toString().toLowerCase() == 'false' || booleanValue == false) {
                returnBool = false;
            }
        } catch (err) {
            console.log('[FORM] [getSafeBoolean] ' + err);
        }
        return returnBool;
    };
    var mergeOptions = function(defaultOptions, customOptions) {
        var responseObj = {};
        for (var defaultOptionsKey in defaultOptions) {
            responseObj[defaultOptionsKey] = defaultOptions[defaultOptionsKey];
        }
        for (var customOptionsKey in customOptions) {
            responseObj[customOptionsKey] = customOptions[customOptionsKey];
        }
        return responseObj;
    };
    var expandDetailStepSection = function(elemSource) {
        $(elemSource).addClass('stepCompact__toggleBtn--collapsed');
        $(elemSource)
            .parents('.fsStep')
            .find('.stepDetail')
            .show();
    };
    var collapseDetailStepSection = function(elemSource) {
        $(elemSource).removeClass('stepCompact__toggleBtn--collapsed');
        $(elemSource)
            .parents('.fsStep')
            .find('.stepDetail')
            .hide();
    };
    var collapseAllSteps = function(elemSource) {
        var fsStepsParentElement = $(elemSource)
            .parents('.fsStep')
            .parent();
        $(fsStepsParentElement)
            .find('.stepCompact__toggleBtn')
            .removeClass('stepCompact__toggleBtn--collapsed');
        $(fsStepsParentElement)
            .find('.stepDetail')
            .hide();
    };
    var toggleDetailStepSection = function(elemSource) {
        if ($(elemSource).hasClass('stepCompact__toggleBtn--collapsed')) {
            collapseDetailStepSection(elemSource);
        } else {
            collapseAllSteps(elemSource);
            expandDetailStepSection(elemSource);
        }
    };
    var gotoNextStep = function(elemSource, thisStep) {
        // collapse all panels
        collapseAllSteps(elemSource);
        var fsStepNextElem = $(elemSource)
            .parents('.fsStep')
            .next();
        var nextBtnElem = $(fsStepNextElem).find('.stepCompact__Btn');
        if (nextBtnElem.length > 0) {
            $(nextBtnElem).removeClass('fsBtn--disabled');
            $(nextBtnElem)[0].removeAttribute('disabled');
            if (thisStep !== undefined && !getSafeBoolean(thisStep.isEditMode, true)) {
                // show next button
                $(nextBtnElem).removeClass('stepCompact__Btn--hidden');
            }
        }
        var toggleBtnElem = fsStepNextElem.find('.stepCompact__toggleBtn');
        if (toggleBtnElem.length > 0) {
            $(toggleBtnElem).removeClass('stepCompact__toggleBtn--disabled');
            $(toggleBtnElem)[0].removeAttribute('disabled');
            expandDetailStepSection(toggleBtnElem);
        }
        if (!thisStep.isEditMode) {
            enableStepCompactHeader(fsStepNextElem.find('.stepCompact'));
        }
    };
    var bindClickOnToggleStepButton = function(stepCompactElem, thisStep) {
        $(stepCompactElem)
            .find('.stepCompact__toggleBtn')
            .click(function() {
                toggleDetailStepSection(this);
                return false;
            });
    };
    var bindChangeOnStepElementEventTrigger = function(thisStep, fsStepElement) {
        var elementsNeedChangeEventBinding = $(fsStepElement).find(
            'input[' +
                thisStep.eventDataAttributeName +
                '],select[' +
                thisStep.eventDataAttributeName +
                ']'
        );
        var elementsCount = elementsNeedChangeEventBinding.length;
        for (var index = 0; index < elementsCount; index++) {
            var elementToBind = elementsNeedChangeEventBinding[index];
            var eventType = '';
            if (elementToBind.type == enumControlType.Text) {
                eventType = enumEventType.Blur;
            } else if (
                elementToBind.type == enumControlType.Radio ||
                elementToBind.type == enumControlType.SingleSelect
            ) {
                eventType = enumEventType.Change;
            }
            if (eventType != '') {
                $(elementToBind).change(function(e, isTriggered) {
                    var isOnChangeEventValid = true;
                    if (typeof thisStep.onChangeEventOnEventDataAttrItems === 'function') {
                        isOnChangeEventValid = thisStep.onChangeEventOnEventDataAttrItems(
                            e,
                            isTriggered
                        );
                    }
                    if (!isOnChangeEventValid) {
                        disableStepButtonByStepIndex($(fsStepElement).attr('data-step-index'));
                    } else {
                        enableStepButtonByStepIndex($(fsStepElement).attr('data-step-index'));
                    }
                });
            }
        }
    };
    var bindClickOnNextStepButton = function(stepCompactElem, thisStep) {
        //gotoNextStep
        var stepCompactBtnElem = $(stepCompactElem).find('.stepCompact__Btn');
        $(stepCompactBtnElem).click(function() {
            var isBeforeEventValid = true;
            if (typeof thisStep.onStepClickBefore === 'function') {
                isBeforeEventValid = thisStep.onStepClickBefore(thisStep);
            }
            if (!isBeforeEventValid) {
                return false;
            }
            if (!$(stepCompactElem).hasClass('stepCompact--last')) {
                stepCompactBtnElem[0].setAttribute('data-stepbtn-wizard-done', true);
                gotoNextStep(this, thisStep);
                stepCompactBtnElem[0].classList.add('stepCompact__Btn--hidden');
            }
            if (typeof thisStep.onStepClickAfter === 'function') {
                thisStep.onStepClickAfter(thisStep);
            }
        });
    };
    var _Step = function(stepNumber, options) {
        var initOptions = defaultSettings;
        if (options) {
            initOptions = mergeOptions(defaultSettings, options);
        }
        var stepIndex = -1;
        if (stepNumber !== undefined && stepNumber != null && stepNumber != '') {
            stepIndex = parseFloat(stepNumber);
        }
        if (stepIndex == -1) {
            this.showBadgeTitle = false;
        } else {
            this.showBadgeTitle = initOptions.showBadgeTitle;
        }
        this.stepIndex = stepIndex;
        this.compactElement = document.createElement('div');
        this.title = initOptions.title;
        this.isEditMode = initOptions.isEditMode;
        this.badgeTitle = initOptions.titlePrefix + ' ' + stepIndex + '.';
        this.buttonText = initOptions.buttonText;
        this.showToggleBtn = initOptions.showToggleBtn;
        this.isLastStep = initOptions.isLastStep;
        this.lastStepNote = initOptions.lastStepNote;
        this.lastButtonText = initOptions.lastButtonText;
        this.showStepBtn = initOptions.showStepBtn;
        this.initialActiveStep = initOptions.initialActiveStep;
        this.eventDataAttributeName = initOptions.eventDataAttributeName;
        this.showStepBtnAlways = initOptions.showStepBtnAlways;
        this.detailElement = document.createElement('div');
        this.onStepClickBefore = initOptions.onStepClickBefore;
        this.onStepClickAfter = initOptions.onStepClickAfter;
        this.onChangeEventOnEventDataAttrItems = initOptions.onChangeEventOnEventDataAttrItems;
        return this;
    };

    var disableStepCompactHeader = function(stepCompactElement) {
        if ($(stepCompactElement).length > 0) {
            $(stepCompactElement).addClass('stepCompact--disabled');
        }
    };
    var enableStepCompactHeader = function(stepCompactElement) {
        if ($(stepCompactElement).length > 0) {
            $(stepCompactElement).removeClass('stepCompact--disabled');
        }
    };

    var getLastStepElement = function(thisStep) {
        var compactElementDiv = document.createElement('div');
        compactElementDiv.className = 'stepCompact stepCompact--last';
        var titleElem = document.createElement('div');
        titleElem.className = 'stepCompact__title stepCompact__title--last';
        titleElem.innerHTML = thisStep.title;
        compactElementDiv.appendChild(titleElem);
        if (thisStep.lastStepNote !== '') {
            var badgeTitleElem = document.createElement('div');
            badgeTitleElem.className = 'stepCompact__note';
            badgeTitleElem.innerHTML = thisStep.lastStepNote;
            compactElementDiv.appendChild(badgeTitleElem);
        }
        var stepBtnElem = document.createElement('button');
        stepBtnElem.className =
            'stepCompact__Btn fsBtn fsBtn--primary fsBtn--radius-sm fsBtn--disabled';
        stepBtnElem.setAttribute('type', 'button');
        stepBtnElem.setAttribute('disabled', 'disabled');
        stepBtnElem.innerHTML = thisStep.lastButtonText;
        compactElementDiv.appendChild(stepBtnElem);
        bindClickOnNextStepButton(compactElementDiv, thisStep);
        if (!thisStep.isEditMode) {
            disableStepCompactHeader(compactElementDiv);
        }
        return compactElementDiv;
    };
    var getStepCompactElement = function(thisStep) {
        var compactElementDiv = document.createElement('div');
        compactElementDiv.className = 'stepCompact';
        if (thisStep.showBadgeTitle) {
            var badgeTitleElem = document.createElement('div');
            badgeTitleElem.className = 'stepCompact__badgeTitle';
            badgeTitleElem.innerHTML = thisStep.badgeTitle;
            compactElementDiv.appendChild(badgeTitleElem);
        }
        var titleElem = document.createElement('div');
        titleElem.className = 'stepCompact__title';
        titleElem.innerHTML = thisStep.title;
        compactElementDiv.appendChild(titleElem);
        if (thisStep.showToggleBtn) {
            var toggleBtnClassName = 'stepCompact__toggleBtn';
            var toggleBtnElem = document.createElement('button');
            if (!thisStep.initialActiveStep) {
                toggleBtnClassName += ' stepCompact__toggleBtn--disabled';
                toggleBtnElem.setAttribute('disabled', 'disabled');
                if (!thisStep.isEditMode) {
                    disableStepCompactHeader(compactElementDiv);
                }
            }
            toggleBtnElem.setAttribute('type', 'button');
            toggleBtnElem.className = toggleBtnClassName;
            toggleBtnElem.innerHTML = 'toggle step ' + thisStep.stepIndex;
            compactElementDiv.appendChild(toggleBtnElem);
            bindClickOnToggleStepButton(compactElementDiv, thisStep);
        }
        if (thisStep.showStepBtn) {
            var stepBtnElem = document.createElement('button');
            var btnClassName = 'stepCompact__Btn fsBtn fsBtn--primary fsBtn--radius-sm';
            if (!thisStep.showStepBtnAlways) {
                btnClassName += ' fsBtn--disabled';
                stepBtnElem.setAttribute('disabled', 'disabled');
            }
            if (
                !thisStep.showStepBtnAlways &&
                (thisStep.isEditMode || !thisStep.initialActiveStep)
            ) {
                btnClassName += ' stepCompact__Btn--hidden';
            }
            if (thisStep.isEditMode) {
                stepBtnElem.setAttribute('data-stepbtn-wizard-done', true);
            }
            stepBtnElem.setAttribute('type', 'button');
            stepBtnElem.className = btnClassName;
            stepBtnElem.innerHTML = thisStep.buttonText;
            compactElementDiv.appendChild(stepBtnElem);
            bindClickOnNextStepButton(compactElementDiv, thisStep);
        }
        return compactElementDiv;
    };

    var initCompactComponent = function(thisStep) {
        if (thisStep.isLastStep) {
            thisStep.compactElement = getLastStepElement(thisStep);
        } else {
            thisStep.compactElement = getStepCompactElement(thisStep);
        }
    };
    var initDetailComponent = function(thisStep) {
        if (!thisStep.isLastStep) {
            var detailElementDiv = document.createElement('div');
            detailElementDiv.className = 'stepDetail';
            detailElementDiv.style.display = 'none';
            thisStep.detailElement = detailElementDiv;
        } else {
            thisStep.detailElement = null;
        }
    };
    var addNewComponentToStepDetail = function(thisStep, component) {
        console.log(component);
        if (thisStep.detailElement != null) {
            thisStep.detailElement.appendChild(component);
        }
    };
    var removeComponentFromStepDetail = function(thisStep, elementClassName) {
        if (thisStep.detailElement != null) {
            thisStep.detailElement.getElementsByClassName(elementClassName).remove();
        }
    };
    var isStepMarkedDone = function(stepBtnElem) {
        return (
            typeof stepBtnElem !== 'undefined' &&
            getSafeBoolean(stepBtnElem.getAttribute('data-stepbtn-wizard-done'), false)
        );
    };
    var enableStepButtonByStepIndex = function(stepIndex) {
        if (typeof stepIndex !== 'undefined' && stepIndex != '') {
            var stepElem = document.getElementsByClassName('fsStep--' + stepIndex)[0];
            var stepBtnElem = stepElem.getElementsByClassName('stepCompact__Btn')[0];
            if (!isStepMarkedDone(stepBtnElem)) {
                stepBtnElem.classList.remove('fsBtn--disabled');
                stepBtnElem.removeAttribute('disabled');
                if (!getSafeBoolean(stepElem.getAttribute('data-show-step-btn-always'), false)) {
                    stepBtnElem.classList.remove('stepCompact__Btn--hidden');
                }
            } else {
                // let's enable last step button since step type wizard is already done.
                var lastStepIndex = $(stepElem)
                    .parent()
                    .find('.fsStep').length;
                enableStepButtonByStepIndex(lastStepIndex);
            }
        }
    };
    var disableStepButtonByStepIndex = function(stepIndex) {
        if (typeof stepIndex !== 'undefined' && stepIndex != '') {
            var stepElem = document.getElementsByClassName('fsStep--' + stepIndex)[0];
            var stepBtnElem = stepElem.getElementsByClassName('stepCompact__Btn')[0];
            stepBtnElem.classList.add('fsBtn--disabled');
            stepBtnElem.setAttribute('disabled', 'disabled');
            if (
                !getSafeBoolean(stepElem.getAttribute('data-show-step-btn-always'), false) &&
                isStepMarkedDone(stepBtnElem)
            ) {
                var existingClassNames = stepBtnElem.classList;
                if (!existingClassNames.contains('stepCompact__Btn--hidden')) {
                    stepBtnElem.classList.add('stepCompact__Btn--hidden');
                }
            }
        }
    };

    _Step.prototype = {
        /**
         * build the component elements using Step initial properties
         */
        build: function() {
            initCompactComponent(this);
            initDetailComponent(this);
            return this;
        },
        /**
         * append any HTML element to step detail section
         * @param {Element} component
         */
        addNewComponentToStepDetail: function(component) {
            addNewComponentToStepDetail(this, component);
            return this;
        },
        /**
         * to remove component item from detail section by classname
         * @param {*} elementClassName
         */
        removeComponentFromStepDetailByClassName: function(elementClassName) {
            removeComponentFromStepDetail(this, elementClassName);
            return this;
        },
        getRootComponent: function() {
            var fsStepElement = document.createElement('div');
            fsStepElement.setAttribute('data-step-index', this.stepIndex);
            fsStepElement.setAttribute('data-show-step-btn-always', this.showStepBtnAlways);
            fsStepElement.className = 'fsStep fsStep--' + this.stepIndex;
            fsStepElement.appendChild(this.compactElement);
            if (this.detailElement != null) {
                fsStepElement.appendChild(this.detailElement);
            }
            if (!this.showStepBtnAlways && this.eventDataAttributeName != '') {
                bindChangeOnStepElementEventTrigger(this, fsStepElement);
            }
            return fsStepElement;
        }
    };
    var _DocumentStep = {
        Step: _Step
    };
    return {
        DocumentStep: _DocumentStep,
        DS: _DocumentStep
    };
});
