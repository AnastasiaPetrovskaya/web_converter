/*=========================================================================================
    File Name: 3-columns-sidebar.js
    Description: Invoices list datables configurations
    ----------------------------------------------------------------------------------------
    Item Name: Robust - Responsive Admin Theme
    Version: 1.0
    Author: GeeksLabs
    Author URL: http://www.themeforest.net/user/geekslabs
==========================================================================================*/

$(document).ready(function() {
    /***********************************
    *        js of small Slider        *
    ************************************/

    var sm_options = {
        start: [30,70],
        behaviour: 'drag',
        connect: true,
        range: {
            'min': 20,
            'max': 80
        }
    };
    var smallSlider = document.getElementById('small-slider');
    noUiSlider.create(smallSlider, sm_options);


    /*************************************
    *        Default Score Rating        *
    **************************************/
    $.fn.raty.defaults.path = '../../../robust-assets/images/raty/';

    $('#score-rating').raty({
        score: 3
    });

    if($(".sidebar-sticky").length){
        var headerNavbarHeight,
            footerNavbarHeight;

        //No offset for content layout
        if($("body").hasClass('vertical-content-menu')){
            headerNavbarHeight = 0;
            footerNavbarHeight = 0;
        }
        // Header & Footer offset only for right & left sticky sidebar
        else if($("body").hasClass('3-columns-right-sidebar') || $("body").hasClass('3-columns-left-sidebar')){
            headerNavbarHeight = $('.header-navbar').height();
            footerNavbarHeight = $('footer.footer').height();
        }
        // Header & Footer offset with padding for detached right & left dsticky sidebar
        else{
            headerNavbarHeight = $('.header-navbar').height()+24;
            footerNavbarHeight = $('footer.footer').height()+10;
        }

        $(".sidebar-sticky").sticky({
            topSpacing: headerNavbarHeight,
            bottomSpacing: footerNavbarHeight
        });
    }
});