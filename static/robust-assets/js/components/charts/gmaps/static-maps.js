/*=========================================================================================
    File Name: static-maps.js
    Description: google static maps
    ----------------------------------------------------------------------------------------
    Item Name: Robust - Responsive Admin Theme
    Version: 1.0
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

$(window).on("load", function(){

    // Static Maps
    // ------------------------------

    url = GMaps.staticMapURL({
        size: [610, 400],
        lat: -12.043333,
        lng: -77.028333,
        styles: [{"stylers":[{"hue":"#dd0d0d"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]}]
    });

    $('<img/>').attr('src', url)
      .appendTo('#static-maps');


    // Static Maps With Markers
    // ------------------------------

    url = GMaps.staticMapURL({
        size: [610, 400],
        lat: -12.043333,
        lng: -77.028333,
        markers: [
            {lat: -12.043333, lng: -77.028333},
            {lat: -12.045333, lng: -77.034, size: 'small'},
            {lat: -12.045633, lng: -77.022, color: 'blue'}
        ]
    });

    $('<img/>').attr('src', url)
      .appendTo('#static-maps-markers');


    // Static Maps With Polylines
    // ------------------------------

    var path = [
        [-12.040397656836609,-77.03373871559225],
        [-12.040248585302038,-77.03993927003302],
        [-12.050047116528843,-77.02448169303511],
        [-12.044804866577001,-77.02154422636042],
        [-12.040397656836609,-77.03373871559225],
    ];

    url = GMaps.staticMapURL({
        size: [610, 400],
        lat: -12.043333,
        lng: -77.028333,

        polyline: {
            path: path,
            strokeColor: '#131540',
            strokeOpacity: 0.6,
            strokeWeight: 6
            // fillColor: '#ffaf2ecc'
        }
    });

    $('<img/>').attr('src', url).appendTo('#static-maps-polylines');

});

// Resize Map
// ------------------------------

/*$(function () {

    // Resize map on menu width change and window resize
    $(window).on('resize', resize);
    $(".menu-toggle").on('click', resize);

    // Resize function
    function resize() {
        drawLine();
    }
});*/