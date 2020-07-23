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
        root.DTOs = libObject.DTOs;
    }
})(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function(
    fs,
    window
) {
    'use strict';
    if (typeof fs.DTOs === 'undefined') {
        fs.DTOs = {};
    }
    class BaseDTO {
        constructor() {
            this.IsValid = true;
            this.ErrorMessage = '';
        }
    }

    class ResponseDTO extends BaseDTO {
        constructor() {
            super();
            this.Response = '';
        }
    }
    var DTOProvider = {
        BaseDTO: BaseDTO,
        ResponseDTO: ResponseDTO
    };
    fs.DTOs['DTOProvider'] = DTOProvider;
    return {
        DTOs: fs.DTOs
    };
});
