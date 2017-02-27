/*=========================================================================================
	File Name: context-menu.js
	Description: Context menu plugin for Twitter's Bootstrap framework
	----------------------------------------------------------------------------------------
	Item Name: Robust - Responsive Admin Theme
	Version: 1.0
	Author: GeeksLabs
	Author URL: http://www.themeforest.net/user/geekslabs
==========================================================================================*/
$(document).ready(function(){

	// Alert menu name when clicked on a context menu
	$('#menu-name').contextmenu({
		target: '.menu-name-dropdown',
  		onItem: function(context, e) {
    		swal({
    			type: 'success',
    			title: "Good job!",
    			text: "You clicked on <span style='color:#DA4453'>" + $(e.target).text() + "</span> menu",
    			html: true
    		});
		}
	});


	// Exclude Elements
	$('#exclude-elements').contextmenu({
	    target: '.exclude-elements-dropdown',
	    before: function(e, element, target) {
	        e.preventDefault();
	        if (e.target.tagName == 'SPAN') {
	            e.preventDefault();
	            this.closemenu();
	            return false;
	        }
	        return true;
	    }
	});
});