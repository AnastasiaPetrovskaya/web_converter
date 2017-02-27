/*=========================================================================================
    File Name: donut.js
    Description: Morris donut chart
    ----------------------------------------------------------------------------------------
    Item Name: Robust - Responsive Admin Theme
    Version: 1.0
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

// Donut chart
// ------------------------------
$(window).on("load", function(){

    Morris.Donut({
        element: 'donut-chart',
        data: [{
            label: "Custard",
            value: 25
        }, {
            label: "Frosted",
            value: 40
        }, {
            label: "Jam",
            value: 25
        }, {
            label: "Sugar",
            value: 10
        }, ],
        resize: true,
        colors: ['#3F51B5', '#4CAF50', '#CDDC39', '#FFC107']
    });
});