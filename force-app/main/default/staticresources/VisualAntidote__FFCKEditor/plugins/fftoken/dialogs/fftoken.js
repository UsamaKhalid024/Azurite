/**
 * @fileOverview Definition for token plugin dialog.
 *
 */

'use strict';

CKEDITOR.dialog.add( 'fftoken', function( editor ) {
	var lang = editor.lang.fftoken;
	var	generalLabel = editor.lang.common.generalTab;
	var tokens = [["",""]];
	if (typeof editor.config.availableTokens != "undefined") {
		tokens = editor.config.availableTokens;
	}

	return {
		title: lang.title,
		minWidth: 300,
		minHeight: 60,
		contents: [
			{
				id: 'info',
				label: generalLabel,
				title: generalLabel,
				elements: [
					// Dialog window UI elements.
					{
						id: "name",
						type: "select",
						style: 'width: 300px;',
						label: lang.name,
						'default': ' ',
						required: true,
						items: tokens,
						setup: function( widget ) {
							//this.setValue( widget.data.name );
						},
						commit: function( widget ) {
							widget.setData( 'name', this.getValue() );
						}
					}
				]
			}
		]
	};
} );
