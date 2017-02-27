/*=========================================================================================
    File Name: button-ladda.js
    Description: Ladda buttons js used for animation buttons
    ----------------------------------------------------------------------------------------
    Item Name: Robust - Responsive Admin Theme
    Version: 1.0
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
(function(window, document, $) {
	'use strict';
	Ladda.bind( 'div:not(.progress-demo) button', { timeout: 2000 } );

	// Bind progress buttons and simulate loading progress
	Ladda.bind( '.progress-demo button', {
		callback: function( instance ) {
			var progress = 0;
			var interval = setInterval( function() {
				progress = Math.min( progress + Math.random() * 0.1, 1 );
				instance.setProgress( progress );

				if( progress === 1 ) {
					instance.stop();
					clearInterval( interval );
				}
			}, 200 );
		}
	} );
})(window, document, jQuery);