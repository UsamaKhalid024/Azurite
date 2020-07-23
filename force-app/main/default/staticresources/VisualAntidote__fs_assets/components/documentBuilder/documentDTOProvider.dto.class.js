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

    class DocumentBaseDTO {
        constructor() {
            this.Name = '';
            this.isActive = false;
        }
    }
    class DocumentDTO extends DocumentBaseDTO {
        constructor() {
            super();
            this.RecordId = '';
            this.PlatformAccountId = '';
            this.FormId = '';
            this.DocumentKey = '';
            this.DocumentId = '';
            this.AttachToObject = '';
            this.UploadToSF = '';
            this.FieldMappingJSON = '';
        }
    }
    class DocumentUICompactDTO extends DocumentBaseDTO {
        constructor() {
            super();
            this.RecordId = '';
        }
    }

    class DocumentResponseDTO extends DTOProvider.BaseDTO {
        constructor() {
            super();
            this.Result = new DocumentDTO();
        }
    }
    class DocumentsResponseDTO extends DTOProvider.BaseDTO {
        constructor() {
            super();
            this.Result = []; //new ArrayList<DocumentUICompactDTO>();
        }
    }
    var DocumentDTOProvider = {
        DocumentDTO: DocumentDTO,
        DocumentResponseDTO: DocumentResponseDTO,
        DocumentsResponseDTO: DocumentsResponseDTO,
        DocumentUICompactDTO: DocumentUICompactDTO
    };
    fs.DTOs['DocumentDTOProvider'] = DocumentDTOProvider;
    return {
        DTOs: fs.DTOs
    };
});
