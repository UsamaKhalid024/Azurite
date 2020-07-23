'use strict';
(function ($, cke) {
	// initialize CKEditor4 and set options
	cke.env.isCompatible = true;
	cke.replace('textAreaCKEditor', {
		toolbarCanCollapse: true,
		resize_enabled: false,
		removePlugins: 'elementspath',
		disableNativeSpellChecker: false,
		customConfig: '',
		enterMode: CKEDITOR.ENTER_BR,
		autoParagraph: false,
		allowedContent: true,
		forceEnterMode: true,
		removeButtons: '',
		language: 'en',
		toolbar: [{
			name: 'document',
			items: ['NewPage', 'Preview', 'Print']
		}, {
			name: 'clipboard',
			items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
		}, {
			name: 'editing',
			items: ['Find', 'Replace', '-', 'SelectAll']
		}, {
			name: 'basicstyles',
			items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
		}, {
			name: 'paragraph',
			items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
		}, {
			name: 'insert',
			items: ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak']
		}, {
			name: 'links',
			items: ['Link', 'Unlink', 'Anchor']
		}, {
			name: 'styles',
			items: ['Styles', 'Format', 'Font', 'FontSize', 'TextColor', 'BGColor']
		}, {
			name: 'source',
			items: ['Source']
		}]
	});

	// native JavaScript
	function showErrorMessage(message) {
        $('div#conga-spinner').hide();
		$('h2#errorMessageContent').text(message);
		$('div#errorMessageContainer').show();
	}

	function hideErrorMessage(message) {
		$('div#errorMessageContainer').hide();
	}

	function initializeGlobalVariable(congaEmailData) {
		if (congaEmailData.To === undefined) {
			congaEmailData.To = {};
		}
		if (congaEmailData.To.DisplayName === undefined) {
			congaEmailData.To.DisplayName = "";
		}
		if (congaEmailData.AdditionalTo === undefined) {
			congaEmailData.AdditionalTo = "";
		}
		if (congaEmailData.Bcc === undefined) {
			congaEmailData.Bcc = "";
		}
		if (congaEmailData.Cc === undefined) {
			congaEmailData.Cc = "";
		}
		if (congaEmailData.Content === undefined) {
			congaEmailData.Content = {};
		}
		if (congaEmailData.Content.Subject === undefined) {
			congaEmailData.Content.Subject = "";
		}
		if (congaEmailData.Content.Body === undefined) {
			congaEmailData.Content.Body = "";
		}
	}

	// jQuery/JavaScript remoting
	APXTConga4.EmailPreviewController.getInitData(APP_CONGA_CKEDITOR.operationId,
		function (result, event) {
			if (event.type === 'exception') {
				showErrorMessage(event.message);
			} else if (event.status) {
				try {
                    var parsedResult = JSON.parse(result);
                    if(!parsedResult.success) {
                        $('div#conga-spinner').hide();
                        showErrorMessage(parsedResult.error.description);
                        return;
                    }
					APP_CONGA_CKEDITOR.congaEmailData = parsedResult.results[0];
					initializeGlobalVariable(APP_CONGA_CKEDITOR.congaEmailData);
					if (APP_CONGA_CKEDITOR.congaEmailData.To.DisplayName) {
						$('input#inputEmailTo').val(APP_CONGA_CKEDITOR.congaEmailData.To.DisplayName);
						$('span#pillEmailLabel').text(APP_CONGA_CKEDITOR.congaEmailData.To.DisplayName);
						$('span#pillEmailTo').show().addClass('conga-display__block');
						$('input#inputEmailTo').attr('disabled', true);
					} else {
						$('span#pillEmailTo').hide();
						$('input#inputEmailTo').attr('disabled', false).focus();
					}
					$('input#inputEmailAdditionalTo').val(APP_CONGA_CKEDITOR.congaEmailData.AdditionalTo);
					$('input#inputEmailCC').val(APP_CONGA_CKEDITOR.congaEmailData.Cc);
					$('input#inputEmailBCC').val(APP_CONGA_CKEDITOR.congaEmailData.Bcc);
					$('input#inputEmailSubject').val(APP_CONGA_CKEDITOR.congaEmailData.Content.Subject);
					cke.instances.textAreaCKEditor.setData(APP_CONGA_CKEDITOR.congaEmailData.Content.Body);
					// append the Attachemnts to the DOM
					for (var i = 0; i < APP_CONGA_CKEDITOR.congaEmailData.Attachments.length; i++) {
						$('div#attachmentsContainer').append(
							'<div class="slds-grid slds-wrap">' +
							    '<div class="conga__header">' +
							        '<h2 class="slds-form-element slds-p-vertical_x-small slds-p-horizontal_medium">Attachments</h2>' +
							    '</div>' +
                                '<div class="conga-col__header slds-col slds-size_12-of-12">' +
                                    '<div class="slds-form-element slds-p-vertical_xx-small slds-p-horizontal_medium">File Name</div>' +
                                '</div>' +
                                '<div class="conga-file__row slds-col slds-size_9-of-12">' +
                                    '<div class="slds-form-element slds-p-vertical_x-small slds-p-horizontal_medium" data-docid="' + APP_CONGA_CKEDITOR.congaEmailData.Attachments[i].DocId + '">' + APP_CONGA_CKEDITOR.congaEmailData.Attachments[i].FileName + '</div>' +
                                '</div>' +
                                '<div class="conga-file__row slds-col slds-size_3-of-12 slds-text-align_right">' +
                                    '<svg id="congaBtnDeleteAttachments" aria-hidden="true" class="slds-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                                        '<use xlink:href="/apexpages/slds/latest/assets/icons/utility-sprite/svg/symbols.svg#close"></use>' +
                                    '</svg>' +
                                '</div>' +
							'</div>'
						);
					}
					$('div#conga-spinner').hide();
				} catch (message) {
					showErrorMessage(message);
				}
			} else {
				showErrorMessage(event.message);
			}
		}, {
			buffer: false, escape: false
		}
	);

	$('input#inputEmailTo').on('keyup', function (event) {
		var inputEmailTo = $(this).val();
		if (inputEmailTo.length < 2) {
			// SOSL queries require a minimum of 2 chars
			return;
		}
		APXTConga4.EmailPreviewController.getEmailTo(inputEmailTo,
			function (result, event) {
				if (event.type === 'exception') {
					showErrorMessage(event.message);
				} else if (event.status) {
					APP_CONGA_CKEDITOR.searchResults = result;
					$('ul#inputEmailToContainer').show().children().remove();
					var icon = '';
					var iconClass = '';
					for (var i = 0; i < result.length; i++) {
						if (result[i].ContactType === 'Contact') {
							icon = 'contact';
							iconClass = 'conga-svg-icon-contact';
						} else if (result[i].ContactType === 'User') {
							icon = 'user';
							iconClass = 'conga-svg-icon-user';
						} else if (result[i].ContactType === 'Lead') {
							icon = 'lead';
							iconClass = 'conga-svg-icon-lead';
						}
						// append the search results to the DOM
						$('ul#inputEmailToContainer').append(
							'<li class="slds-lookup__item-action slds-lookup__result-text" data-id="' + result[i].Id + '">' +
                                '<svg aria-hidden="true" class="slds-icon ' + iconClass + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                                    '<use xlink:href="/apexpages/slds/latest/assets/icons/standard-sprite/svg/symbols.svg#' + icon + '"></use>' +
                                '</svg>' +
                                '<div class="slds-show_inline-block slds-m-left_small">' +
                                    '<div class="slds-text-body--regular">' + result[i].Name + '</div>' +
                                    '<div class="slds-text-heading--label-normal">' + result[i].ContactType + '</div>' +
                                '</div>' +
							'</li>'
						);
					}
				} else {
					showErrorMessage(event.message);
				}
			}, {
				buffer: false, escape: false
			}
		);
	});

	$('button#sendEmail').on('click', function (event) {
		var inputEmailTo = $('input#inputEmailTo').val();
		var inputEmailAdditionalTo = $('input#inputEmailAdditionalTo').val();
		if (!inputEmailTo && inputEmailAdditionalTo) inputEmailTo = inputEmailAdditionalTo;
		if (!inputEmailTo) {
			showErrorMessage('To send an email, please provide an Email To or Additional Email To address.');
			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 'slow');
			$('input#inputEmailTo').focus();
			return;
		}
		$('div#conga-spinner').show();
		APP_CONGA_CKEDITOR.congaEmailData.To.DisplayName = inputEmailTo;
		APP_CONGA_CKEDITOR.congaEmailData.AdditionalTo = $('input#inputEmailAdditionalTo').val();
		APP_CONGA_CKEDITOR.congaEmailData.Cc = $('input#inputEmailCC').val();
		APP_CONGA_CKEDITOR.congaEmailData.Bcc = $('input#inputEmailBCC').val();
		APP_CONGA_CKEDITOR.congaEmailData.Content.Subject = $('input#inputEmailSubject').val();
		APP_CONGA_CKEDITOR.congaEmailData.Content.Body = cke.instances.textAreaCKEditor.getData();
		APXTConga4.EmailPreviewController.sendEmail(JSON.stringify(APP_CONGA_CKEDITOR.congaEmailData), APP_CONGA_CKEDITOR.operationId,
			function (result, event) {
				if (event.type === 'exception') {
					showErrorMessage(event.message);
				} else if (event.status) {
					try {
                        var emailResult = JSON.parse(result);
                        if(!emailResult.success) {
                            $('div#conga-spinner').hide();
                            showErrorMessage(emailResult.error.description);
                            return;
                        }
						alert("Email has been sent successfully! Click OK to navigate back to the record page.")
						var redirectUrl = emailResult.results[0].RedirectUri;
						sforce.one.navigateToURL(redirectUrl, true);
					} catch (message) {
						showErrorMessage(message);
					}
					$('div#conga-spinner').hide();
				} else {
					showErrorMessage(event.message);
				}
			}, {
				buffer: false, escape: false
			}
		);
	});

	$('svg#congaBtnCloseModal').on('click', function (event) {
		hideErrorMessage();
	});

	$('svg#congaBtnClosePill').on('click', function (event) {
		$('input#inputEmailTo').val('').attr('disabled', false).focus();
		$('span#pillEmailTo').hide();
	});

	$(document).on('click', 'ul#inputEmailToContainer>li', function (event) {
		for (var i = 0; i < APP_CONGA_CKEDITOR.searchResults.length; i++) {
			if (APP_CONGA_CKEDITOR.searchResults[i].Id === $(this).data('id')) {
				APP_CONGA_CKEDITOR.congaEmailData.To.Id = APP_CONGA_CKEDITOR.searchResults[i].Id;
				APP_CONGA_CKEDITOR.congaEmailData.To.AccountName = '';
				APP_CONGA_CKEDITOR.congaEmailData.To.ContactType = APP_CONGA_CKEDITOR.searchResults[i].ContactType;
				APP_CONGA_CKEDITOR.congaEmailData.To.DisplayName = APP_CONGA_CKEDITOR.searchResults[i].Name;
				APP_CONGA_CKEDITOR.congaEmailData.To.EmailAddress = APP_CONGA_CKEDITOR.searchResults[i].EmailAddress;
				hideErrorMessage();
				$('input#inputEmailTo').val(APP_CONGA_CKEDITOR.congaEmailData.To.DisplayName).attr('disabled', true);
				$('span#pillEmailLabel').text(APP_CONGA_CKEDITOR.congaEmailData.To.DisplayName);
				$('span#pillEmailTo').show().addClass('conga-display__block');
				$('ul#inputEmailToContainer').hide();
			}
		}
	});

	$(document).on('click', 'svg#congaBtnDeleteAttachments', function (event) {
		APP_CONGA_CKEDITOR.congaEmailData.Attachments = [];
        $('div.conga-file__row').remove()
	});

	$(document).on('click', function (event) {
		$('ul#inputEmailToContainer').hide();
	});
}(window.jQuery, window.CKEDITOR));