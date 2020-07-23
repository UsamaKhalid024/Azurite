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
        root.StripePaymentHelper = libObject.StripePaymentHelper;
        root.SPH = libObject.SPH;
    }
}(typeof fs !== 'undefined' ? fs : {}, typeof window !== 'undefined' ? window : this, function (fs, window) {
    'use strict';
    var $ = fs;
    var fsQ = fs.Query;

    function renderStripeUI(redirectUrl, paymentIntentId, paymentMethodId, transactionIdValue) {
        var iframe = document.getElementById('paymentDialogIFrame');
        iframe.src = redirectUrl;
        iframe.setAttribute("payment-intent-id", paymentIntentId);
        iframe.setAttribute("payment-method-id", paymentMethodId);
        iframe.setAttribute("transaction-id-value", transactionIdValue);

        Show3DSPopup();
    };

    //Render iframe
    function Show3DSPopup() {
        try {
            enableUnloadWarning = true;
            var parentWin = window.parent;
            var ffDialogPositionOption = { my: "center", at: "center", of: parentWin };
            $('#paymentDialog').dialog({
                width: 650,
                height: 550,
                position: ffDialogPositionOption,
                autoResize: true,
                resizable: false,
                modal: true,
                show: {
                    effect: "fade",
                    duration: 350
                },
                hide: {
                    effect: "fade",
                    duration: 350
                },
            });

            $(".ff-ui-dialog-titlebar").hide();

        } catch (ex) {
            console.trace('Log:' + ex);
        }
    };

    //After authentication is completed..call this method
    function on3DSCompleteStripe() {
        var paymentIntentId = "";
        var paymentMethodId = "";
        var transactionIdValue = "";
        if ($('#paymentDialog iframe').length > 0) {
            paymentIntentId = $('#paymentDialog iframe')[0].getAttribute('payment-intent-id');
            paymentMethodId = $('#paymentDialog iframe')[0].getAttribute('payment-method-id');
            transactionIdValue = $('#paymentDialog iframe')[0].getAttribute('transaction-id-value');

            $('#paymentDialog').dialog('close');
            var formData = GenerateFormData(false);
            formData.append("PaymentIntentID", paymentIntentId)
            formData.append("PaymentMethodID", paymentMethodId)
            formData.append("TransactionIdValue", transactionIdValue)

            fs.EH.setFormValid(true);

            if (paymentIntentId !== null && paymentIntentId !== undefined && paymentIntentId !== "") {
                ConfirmPaymentToServer(formData);
                var iframe = document.getElementById('paymentDialogIFrame');
                iframe.removeAttribute("payment-intent-id");
                iframe.removeAttribute("payment-method-id");
                iframe.removeAttribute("transaction-id-value");
                iframe.src = 'about:blank';
            }
        }
    };

    //Confirm payment on server
    function ConfirmPaymentToServer(formData) {
        var validateUrl = FormBASEURL + 'EngineFrame/ConfirmPayment';
        ($).ajax({
            type: "POST",
            crossDomain: true,
            async: true,
            url: validateUrl,
            data: formData,
            dataType: "json",
            processData: false,
            tryCount: 0,
            retryLimit: 3,
            success: function (result) {
                ValidatePayment(result);
                if (fs.EH.isFormValid()) {
                    ResetSaveDraft();
                    PostFormData();
                } else {
                    console.log('Payment confirmation processing failed');
                    fs.N.ScrollToFirstError();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $('#FFPaymentToken' + currentPaymentID).remove();
                enableUnloadWarning = false;
                $('#dvFastForms #btnsubmit').prop('disabled', false);
                if (textStatus == 'timeout') {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        //try again
                        ($).ajax(this);
                        return;
                    }
                    return;
                }
            }
        }); //end ajax call
        enableUnloadWarning = false;
    }

    var _StripePaymentHelper = {
        'renderStripeUI': renderStripeUI,
        'Show3DSPopup': Show3DSPopup,
        'on3DSCompleteStripe': on3DSCompleteStripe,
        'ConfirmPaymentToServer': ConfirmPaymentToServer
    };
    return {
        'StripePaymentHelper': _StripePaymentHelper,
        'SPH': _StripePaymentHelper
    };
}));