/**
 * @fileOverview The "fftoken" plugin.
 *
 */

'use strict';

function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

( function() {
	CKEDITOR.plugins.add( 'fftoken', {
		requires: 'widget',
		lang: 'en',
		icons: 'fftoken',
		hidpi: true,

		onLoad: function() {
			// Register styles for fftoken widget frame.
			CKEDITOR.addCss( '.cke_fftoken{background-color:#B5F8FB}' );
		},

		init: function( editor ) {

			var lang = editor.lang.fftoken;
			var fftokenStart = '[[';
            var fftokenEnd = ']]';
            if (typeof editor.config.fftokenStart != 'undefined') {
                fftokenStart = editor.config.fftokenStart;
            }
            if (typeof editor.config.fftokenEnd != 'undefined') {
                fftokenEnd = editor.config.fftokenEnd;
            }
            var fftokenStartNum = fftokenStart.length;
            var fftokenEndNum = 0 - fftokenEnd.length;
			
			/*disabled for now dec 29 2015 - balinder*/
			// Register dialog. 
			//CKEDITOR.dialog.add( 'fftoken', this.path + 'dialogs/fftoken.js' );

			// Put ur init code here.
			 editor.widgets.add( 'fftoken', {
				// Widget code.
				//dialog: 'fftoken',
				pathName: lang.pathName,
				// We need to have wrapping element, otherwise there are issues in
				// add dialog.
				template: '<span class="cke_fftoken">' + fftokenStart + fftokenEnd + '</span>',

				downcast: function() {
					return new CKEDITOR.htmlParser.text( fftokenStart + this.data.name + fftokenEnd );
				},

				init: function() {
					// Note that fftoken markup characters are stripped for the name.
					this.setData( 'name', this.element.getText().slice( fftokenStartNum, fftokenEndNum ) );
				},

				data: function() {
					this.element.setText( fftokenStart + this.data.name + fftokenEnd );
				}
			} );

			editor.ui.addButton && editor.ui.addButton( 'ffcreatetoken', {
				label: lang.toolbar,
				command: 'fftoken',
				toolbar: 'insert,5',
				icon: 'fftoken'
			} ); 
		},

		afterInit: function( editor ) {

            var fftokenStart = '[[';
            var fftokenEnd = ']]';
            if (typeof editor.config.fftokenStart != 'undefined') {
                fftokenStart = editor.config.fftokenStart;
            }
            if (typeof editor.config.fftokenEnd != 'undefined') {
                fftokenEnd = editor.config.fftokenEnd;
            }
            var fftokenStartRegex = escapeRegExp(fftokenStart);
            var fftokenEndRegex = escapeRegExp(fftokenEnd);
			var fftokenReplaceRegex = /\[\[([^\[\]])+\]\]/g;//new RegExp(fftokenStartRegex + '([^' + fftokenStartRegex + fftokenEndRegex +'])+' + fftokenEndRegex, 'g');

			editor.dataProcessor.dataFilter.addRules( {
				text: function( text, node ) {
					var dtd = node.parent && CKEDITOR.dtd[ node.parent.name ];

					// Skip the case when fftoken is in elements like <title> or <textarea>
					// but upcast fftoken in custom elements (no DTD).
					if ( dtd && !dtd.span )
						return;

					return text.replace( fftokenReplaceRegex, function( match ) {
						// Creating widget code.
						var widgetWrapper = null,
							innerElement = new CKEDITOR.htmlParser.element( 'span', {
								'class': 'cke_fftoken'
							} );

						// Adds fftoken identifier as innertext.
						innerElement.add( new CKEDITOR.htmlParser.text( match ) );
						widgetWrapper = editor.widgets.wrapElement( innerElement, 'fftoken' );

						// Return outerhtml of widget wrapper so it will be placed
						// as replacement.
						return widgetWrapper.getOuterHtml();
					} );
				}
			} );
		}
	} );

} )();
