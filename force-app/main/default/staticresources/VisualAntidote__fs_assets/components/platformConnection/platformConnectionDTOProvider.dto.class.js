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
    // Require : DTOProvider
    if (typeof fs.DTOs === 'undefined') {
        fs.DTOs = {};
    }
    if (typeof fs.DTOs.DTOProvider === 'undefined') {
        fs.DTOs.DTOProvider = {};
    }
    var DTOProvider = fs.DTOs.DTOProvider;
    class PlatformConnectionBaseDTO {
        constructor() {
            this.Name = '';
            this.isActive = false;
        }
    }

    class PlatformConnectionDTO extends PlatformConnectionBaseDTO {
        constructor() {
            super();
            this.RecordId = '';
            this.Key = '';
            this.Secret = '';
            this.ProviderType = '';
            this.FieldConfiguration = '';
        }
    }

    class PlatformConnectionUICompactDTO extends PlatformConnectionBaseDTO {
        constructor() {
            super();
            this.RecordId = '';
            this.ProviderType = '';
        }
    }

    class PlatformConnectionResponseDTO extends DTOProvider.BaseDTO {
        constructor() {
            super();
            this.Result = new PlatformConnectionDTO();
        }
    }

    class PlatformConnectionsResponseDTO extends DTOProvider.BaseDTO {
        constructor() {
            super();
            this.Result = []; //new ArrayList<DocumentUICompactDTO>();
        }
    }
    var PlatformConnectionDTOProvider = {
        PlatformConnectionDTO: PlatformConnectionDTO,
        PlatformConnectionUICompactDTO: PlatformConnectionUICompactDTO,
        PlatformConnectionResponseDTO: PlatformConnectionResponseDTO,
        PlatformConnectionsResponseDTO: PlatformConnectionsResponseDTO
    };
    fs.DTOs['PlatformConnectionDTOProvider'] = PlatformConnectionDTOProvider;
    return {
        DTOs: fs.DTOs
    };
});
