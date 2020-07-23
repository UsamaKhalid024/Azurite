console.log('[FORM]formula-validation.js -- Starts');

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
        root.FormulaValidation = libObject.FormulaValidation;
        root.FV = libObject.FV;
    }
}(typeof fs !== 'undefined' ? fs : (typeof jQuery !== 'undefined' ? jQuery : {}), typeof window !== 'undefined' ? window : this, function (fs, windowObj) {
    'use strict';
    var $ = fs;

    //TODO: Some functions are in Form_engine.js apply DRY PaymentEngine.js FF-4415

    // helper begin
    // TODO: apply DRY PaymentEngine.js FF-4415
    windowObj.ToAmount = function(item) {
        if ($.isNumeric(item)) return parseFloat(item);
        else if (item == undefined) {
            return parseFloat(0);
        } else {
            return item;
        }
    }
    windowObj.mockValueForField = function(elemId) {
        // check if field exit in the FORM
        // return 1.1 value to replace the field API name with a mock value to excute 
        // the equation 
        var field = this.document.getElementById(elemId);
        if (field == null) {
            throw 'Error: Field ' + elemId + ' may not be used in this type of formula';
        }

        return windowObj.ToAmount('1.1');
    }
    // TODO: apply DRY FF-4415
    function replaceAll(find, replace, str) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    // TODO: apply DRY FF-4415
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    }
    // TODO: apply DRY FF-4415
    windowObj.FFIf = function(expr, valIfTrue, valIfFalse) {
        var evaluated = typeof eval === 'undefined' ? expr : eval(expr);
        if (evaluated) return valIfTrue;
        else return valIfFalse;
    }

    function printFormulaCheckSyntaxMessage(element, message) {
        // catch all the error message and replace them with a generic message 
        // not all the error message have the correct error
        // change the error message style for valid and invalid formula

        var customFormulaContainer = $(element).closest('.custom-formula');
        var txtElementContainer = customFormulaContainer[0].querySelector('.txtCheckSyntax');
        var txtElement = txtElementContainer.querySelector('.text');
        var textAreaElement = customFormulaContainer[0].querySelector('textarea');
        if (message != true) {
            if (message.indexOf('error is not defined') >= 0) {
                message = 'Error: Validation error';
            }else if (message.indexOf('Unexpected token') >= 0) {
                message = 'SyntaxError: Unexpected token';
            }else if (message.indexOf('missing ) after argument list') >= 0){
                message = 'SyntaxError: missing token after argument list';
            }
            txtElement.innerHTML = message;
            textAreaElement.classList.add('textarea-syntax-errors')
            txtElementContainer.classList.remove('no-syntax-errors');
            txtElementContainer.classList.add('syntax-errors');
        } else {
            txtElement.innerHTML = 'No syntax errors.';
            textAreaElement.classList.remove('textarea-syntax-errors')
            txtElementContainer.classList.remove('syntax-errors');
            txtElementContainer.classList.add('no-syntax-errors');
        }
    }
    var validateFormulaWithRegex = function (formula) {
        // check formula if it does not match regex and throw exception if it match 
        var regex = new RegExp('(?:[-+/*,]{2}|([-+/*,]\\s){2})');
        var match;
        match = regex.exec(formula);
        if (match != null && match.length > 0) {
            throw 'SyntaxError: Unexpected token';
        }

    }
    function GetFormula(element) {
        // get the formula from payment compont 
        return element.parentElement.parentElement.querySelector('textarea').value;
    }
    // helper end

    // public begin

    // TODO: change to fs 
    var CheckSyntax = function(element){
        // main method to check if formula have syntax error or not 
        var formula = GetFormula(element);
        var result = EvaluateFormulaTest(formula);
        printFormulaCheckSyntaxMessage(element,result);
        
    }
    var EvaluateFormulaTest = function EvaluateFormulaTest(formula) {
        // inject all the methods to convert number to float and to mock the fields with fixed number
        // to be run when the formula executed to check if there is syntax error or not 
        try {
            validateFormulaWithRegex(formula);
            var jsFormula = replaceAll('IF(', 'window.FFIf(', formula);
            jsFormula = replaceAll('if(', 'window.FFIf(', jsFormula);
            jsFormula = replaceAll('["', 'window.ToAmount(window.mockValueForField("', jsFormula);
            jsFormula = replaceAll('].amount', '))', jsFormula);
            jsFormula = replaceAll('].val', '))', jsFormula);
            jsFormula = replaceAll('=', '==', jsFormula);

            jsFormula = 'window.ToAmount(' + jsFormula + ')';

            var total;
            var F = new Function('return ' + jsFormula);
            total = F();
            if($.isNumeric(total)){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log('Formula validation: '+ error);
            return (typeof error == "string"? error : error.message)
        }
    };

    //public end

    // private begin

    // private end
    var _FormulaValidation= {
        'EvaluateFormulaTest': EvaluateFormulaTest,
        'validateFormulaWithRegex' : validateFormulaWithRegex,
        'CheckSyntax':CheckSyntax
    };

    return {
        'FormulaValidation': _FormulaValidation,
        'FV': _FormulaValidation
    };
}));
