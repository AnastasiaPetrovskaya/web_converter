/*=========================================================================================
    File Name: multiple-funnel1.js
    Description: echarts multiple funnel chart
    ----------------------------------------------------------------------------------------
    Item Name: Robust - Responsive Admin Theme
    Version: 1.0
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

// Multiple funnel chart
// ------------------------------
$(window).on("load", function(){

    // Set paths
    // ------------------------------

    require.config({
        paths: {
            echarts: '../../../robust-assets/js/plugins/charts/echarts'
        }
    });


    // Configuration
    // ------------------------------

    require(
        [
            'echarts',
            'echarts/chart/funnel',
            'echarts/chart/gauge'
        ],


        // Charts setup
        function (ec) {

            // Initialize chart
            // ------------------------------
            var myChart = ec.init(document.getElementById('multiple-funnel1'));

            // Chart Options
            // ------------------------------
            chartOptions = {

                // Add tooltip
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}%"
                },

                // Add legend
                 legend: {
                    data : ['Work','Eat','Commute','Watch TV','Sleep']
                },

                // Add Custom Colors
                color: ['rgba(153,184,152,0.6)', 'rgba(254,206,168,0.6)', 'rgba(255,132,124,0.6)', 'rgba(232,74,95,0.6)', 'rgba(42,54,59,0.5)'],

                // Enable drag recalculate
                calculable: true,

                // Add series
                series : [
                    {
                        name:'Expected',
                        type:'funnel',
                        x: '10%',
                        width: '80%',
                        itemStyle: {
                            normal: {
                                label: {
                                    formatter: '{b}Expected'
                                },
                                labelLine: {
                                    show : false
                                }
                            },
                            emphasis: {
                                label: {
                                    position:'inside',
                                    formatter: '{b}Expected : {c}%'
                                }
                            }
                        },
                        data:[
                            {value:60, name:'Work'},
                            {value:40, name:'Eat'},
                            {value:20, name:'Commute'},
                            {value:80, name:'Watch TV'},
                            {value:100, name:'Sleep'}
                        ]
                    },
                    {
                        name:'Actual',
                        type:'funnel',
                        x: '10%',
                        width: '80%',
                        maxSize: '80%',
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 2,
                                label: {
                                    position: 'inside',
                                    formatter: '{c}%',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            },
                            emphasis: {
                                label: {
                                    position:'inside',
                                    formatter: '{b}Actual : {c}%'
                                }
                            }
                        },
                        data:[
                            {value:30, name:'Work'},
                            {value:10, name:'Eat'},
                            {value:5, name:'Commute'},
                            {value:50, name:'Watch TV'},
                            {value:80, name:'Sleep'}
                        ]
                    }
                ]
            };

            // Apply options
            // ------------------------------

            myChart.setOption(chartOptions);



            // Resize chart
            // ------------------------------

            $(function () {

                // Resize chart on menu width change and window resize
                $(window).on('resize', resize);
                $(".menu-toggle").on('click', resize);

                // Resize function
                function resize() {
                    setTimeout(function() {

                        // Resize chart
                        myChart.resize();
                    }, 200);
                }
            });
        }
    );
});