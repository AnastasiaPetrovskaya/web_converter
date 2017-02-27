/*=========================================================================================
    File Name: advance-cards.js
    Description: intialize advance cards
    ----------------------------------------------------------------------------------------
    Item Name: Robust - Responsive Admin Theme
    Version: 1.0
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
// Stacked column chart
// ------------------------------

$(window).on("load", function(){


	$('#recent-orders').perfectScrollbar({
        wheelPropagation: true
    });
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
            'echarts/chart/bar',
            'echarts/chart/pie',
            'echarts/chart/funnel',
            'echarts/chart/line'
        ],


        // Charts setup
        function(ec) {
            // Initialize chart
            // ------------------------------
            var myChart = ec.init(document.getElementById('sales-campaigns'));

            // Chart Options
            // ------------------------------
            chartOptions = {

                // Setup grid
                grid: {
                    x: 40,
                    x2: 40,
                    y: 45,
                    y2: 25
                },

                // Add tooltip
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // Axis indicator axis trigger effective
                        type: 'shadow' // The default is a straight line, optionally: 'line' | 'shadow'
                    }
                },

                // Add legend
                legend: {
                    data: ['Direct access', 'Email marketing', 'Advertising alliance', 'Video ads', 'Search engine']
                },

                // Add custom colors
                color: ['#48C9A9', '#97E1CE', '#F7C55F', '#FDDEA1', '#3BAFDA'],

                // Enable drag recalculate
                calculable: true,

                // Horizontal axis
                xAxis: [{
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }],

                // Vertical axis
                yAxis: [{
                    type: 'value',
                }],

                // Add series
                series: [{
                    name: 'Direct access',
                    type: 'bar',
                    data: [320, 332, 301, 334, 390, 330, 320]
                }, {
                    name: 'Email marketing',
                    type: 'bar',
                    stack: 'advertising',
                    data: [120, 132, 101, 134, 90, 230, 210]
                }, {
                    name: 'Advertising alliance',
                    type: 'bar',
                    stack: 'advertising',
                    data: [220, 182, 191, 234, 290, 330, 310]
                }, {
                    name: 'Video ads',
                    type: 'bar',
                    stack: 'advertising',
                    data: [150, 232, 201, 154, 190, 330, 410]
                }, {
                    name: 'Search engine',
                    type: 'bar',
                    data: [862, 1018, 964, 1026, 1679, 1600, 1570],
                    markLine: {
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    type: 'dashed'
                                }
                            }
                        },
                        data: [
                            [{ type: 'min' }, { type: 'max' }]
                        ]
                    }
                }]
            };

            // Apply options
            // ------------------------------

            myChart.setOption(chartOptions);


            // Resize chart
            // ------------------------------

            $(function() {

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

            /************************************
             *       Top Selling Phones         *
             ************************************/

            // Initialize chart
            // ------------------------------
            var topCategoryChart = ec.init(document.getElementById('top-selling-phones-doughnut'));

            // Chart Options
            // ------------------------------
            var topCategoryChartOptions = {

                // Add title
                title: {
                    text: 'Top 5 Categories',
                    // subtext: 'Top selling mobiles',
                    x: 'center',
                    textStyle: {
                        color: '#FFF'
                    },
                    subtextStyle: {
                        color: '#FFF'
                    }
                },

                // Add legend
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: ['Moto Z', 'Galaxy S7 Edge', 'One Plus 3', 'Mi 5', 'iPhone 6s'],
                    textStyle: {
                        color: '#FFF'
                    },
                },

                // Add custom colors
                color: ['#ffd322', '#ffa422', '#e89805', '#ffc107', '#fff306'],

                // Display toolbox
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    feature: {
                        magicType: {
                            show: true,
                            title: {
                                pie: 'Switch to pies',
                                funnel: 'Switch to funnel',
                            },
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    y: '20%',
                                    width: '50%',
                                    height: '70%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: {
                            show: true,
                            title: 'Restore'
                        },
                        saveAsImage: {
                            show: true,
                            title: 'Same as image',
                            lang: ['Save']
                        }
                    },
                    color: '#FFF'
                },

                // Enable drag recalculate
                calculable: true,

                // Add series
                series: [{
                    name: 'Top Categories',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '57.5%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#FFF'
                                }
                            },
                            labelLine: {
                                show: true,
                                lineStyle: {
                                    color: '#FFF'
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                formatter: '{b}' + '\n\n' + '{c} ({d}%)',
                                position: 'center',
                                textStyle: {
                                    fontSize: '17',
                                    fontWeight: '500'
                                }
                            }
                        }
                    },

                    data: [
                        { value: 335, name: 'Moto Z' },
                        { value: 618, name: 'Galaxy S7 Edge' },
                        { value: 234, name: 'One Plus 3' },
                        { value: 135, name: 'Mi 5' },
                        { value: 956, name: 'iPhone 6s' }
                    ]
                }]
            };

            // Apply options
            // ------------------------------

            topCategoryChart.setOption(topCategoryChartOptions);


            // Resize chart
            // ------------------------------

            $(function() {

                // Resize chart on menu width change and window resize
                $(window).on('resize', resize);
                $(".menu-toggle").on('click', resize);

                // Resize function
                function resize() {
                    setTimeout(function() {

                        // Resize chart
                        topCategoryChart.resize();
                    }, 200);
                }
            });

            /************************************
            *       Customer Browser Stats      *
            ************************************/
            // Initialize chart
            // ------------------------------
            var customerBrowerChart = ec.init(document.getElementById('browser-stats'));

            var idx = 1;

            // Chart Options
            // ------------------------------
            var customBrowerChartOptions = {

                // Add timeline
                timeline: {
                    x: 10,
                    x2: 10,
                    data: [
                        '2014-01-01', '2014-02-01', '2014-03-01', '2014-04-01', '2014-05-01',
                        { name:'2014-06-01', symbol: 'emptyStar2', symbolSize: 8 },
                        '2014-07-01', '2014-08-01', '2014-09-01', '2014-10-01', '2014-11-01',
                        { name:'2014-12-01', symbol: 'star2', symbolSize: 8 }
                    ],
                    label: {
                        formatter: function(s) {
                            return s.slice(0, 7);
                        },
                        textStyle: {
                            color: '#FFF'
                        },
                    },
                    checkpointStyle: {
                        color: '#6C5B7B',
                        borderColor: '#FFF',
                        label: {
                            // show: false,
                            textStyle: {
                                color: '#FFF'
                            }
                        }
                    },
                    controlStyle: {
                        normal: {
                            color: '#FFF'
                        },
                    },
                    lineStyle: {
                        color: '#FFF',
                        width: 1,
                        type: 'dashed'
                    },
                    autoPlay: true,
                    playInterval: 3000,
                },

                // Set options
                options: [
                    {

                        // Add title
                        title: {
                            text: 'Browser statistics',
                            // subtext: 'Based on shared research',
                            x: 'center',
                            textStyle: {
                                color: '#FFF'
                            },
                            subtextStyle: {
                                color: '#FFF'
                            }
                        },

                        // Add tooltip
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },

                        // Add legend
                        legend: {
                            x: 'left',
                            orient: 'vertical',
                            data: ['Chrome','Firefox','Safari','IE9+','IE8-'],
                            textStyle: {
                                color: '#FFF'
                            },
                        },

                        // Add custom colors
                        color: ['#FECEA8', '#FF847C', '#F8AC6F','#6C5B7B', '#99B898'],

                        // Display toolbox
                        toolbox: {
                            show: true,
                            orient: 'vertical',
                            feature: {
                                magicType: {
                                    show: true,
                                    title: {
                                        pie: 'Switch to pies',
                                        funnel: 'Switch to funnel',
                                    },
                                    type: ['pie', 'funnel'],
                                    option: {
                                        funnel: {
                                            x: '25%',
                                            width: '50%',
                                            funnelAlign: 'left',
                                            max: 1700
                                        }
                                    }
                                },
                                restore: {
                                    show: true,
                                    title: 'Restore'
                                },
                                saveAsImage: {
                                    show: true,
                                    title: 'Same as image',
                                    lang: ['Save']
                                }
                            },
                            color: "#FFF"
                        },

                        // Add series
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            center: ['50%', '50%'],
                            radius: '60%',
                            data: [
                                {value: idx * 128 + 80, name: 'Chrome'},
                                {value: idx * 64 + 160, name: 'Firefox'},
                                {value: idx * 32 + 320, name: 'Safari'},
                                {value: idx * 16 + 640, name: 'IE9+'},
                                {value: idx++ * 8 + 1280, name: 'IE8-'}
                            ],
                            itemStyle: {
                                normal: {
                                    label: {
                                        textStyle: {
                                            color: '#FFF'
                                        }
                                    },
                                    labelLine: {
                                        lineStyle: {
                                            color: '#FFF'
                                        }
                                    }
                                }
                            },
                        }]
                    },

                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    },
                    {
                        series: [{
                            name: 'Browser',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80,  name:'Chrome'},
                                {value: idx * 64  + 160,  name:'Firefox'},
                                {value: idx * 32  + 320,  name:'Safari'},
                                {value: idx * 16  + 640,  name:'IE9+'},
                                {value: idx++ * 8  + 1280, name:'IE8-'}
                            ]
                        }]
                    }
                ]
            };

            // Apply options
            // ------------------------------

            customerBrowerChart.setOption(customBrowerChartOptions);


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
                        customerBrowerChart.resize();
                    }, 200);
                }
            });
        }
    );

    /*******************************************
     *               Global Sales               *
     *******************************************/

    //Get the context of the Chart canvas element we want to select
    var ctx5 = document.getElementById("yearly-sales").getContext("2d");

    // Create Linear Gradient
    var white_gradient2 = ctx5.createLinearGradient(0, 0, 0, 400);
    white_gradient2.addColorStop(0, 'rgba(248, 238, 44, 1)');
    white_gradient2.addColorStop(0.6, 'rgba(255, 162, 0, 1)');
    white_gradient2.addColorStop(1, 'rgba(243, 97, 0, 1)');

    // Chart Options
    var gloablSalesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        legend: {
            display: false,
            position: 'top',
        },
        title: {
            display: false,
            text: 'Chart.js Bar Chart'
        },
        scales: {
            xAxes: [{
                display: true,
                id: "barline",
                // barPercentage: 0.9,
                categoryPercentage: 0.6,
                stacked: true,
                gridLines: {
                    display: false,
                    drawTicks: false,
                    drawBorder: false
                },
                ticks: {
                    fontSize: 14,
                    fontColor: '#FFF'
                }
            }, {
                display: true,
                type: 'category',
                id: "fmv",
                categoryPercentage: 0.6,
                gridLines: {
                    display: false,
                    offsetGridLines: true,
                    drawBorder: false
                },
                stacked: true,
                ticks: {
                    fontSize: 14,
                    fontColor: 'transparent'
                }
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    lineWidth: 1,
                    color: "rgba(255,255,255, 0.2)",
                    zeroLineWidth: 0,
                    zeroLineColor: "transparent",
                    drawTicks: false,
                    drawBorder: false
                },
                ticks: {
                    fontColor: '#FFF',
                    min: 0,
                    max: 3000
                }
            }]
        },
    };

    // Chart Data
    var globalSalesData = {
        labels: ["2011", "2012", "2013", "2014", "2015", "2016"],
        datasets: [{
            type: 'bar',
            xAxisID: 'fmv',
            label: "My First dataset",
            data: [1459, 1265, 2047, 1878, 2312, 2289],
            backgroundColor: white_gradient2,
            // backgroundColor: "rgba(255,255,255,.6)",
            hoverBackgroundColor: white_gradient2,
            // borderColor: "rgba(102,144,100,.6)"
        }, {
            type: 'bar',
            xAxisID: 'barline',
            label: "My Second dataset",
            data: [3000, 3000, 3000, 3000, 3000, 3000],
            backgroundColor: "rgba(0,0,0,0.10)",
            hoverBackgroundColor: "rgba(0,0,0,0.10)",
            // borderColor: "rgba(102,144,100,.6)"
        }]
    };

    var globalSalesConfig = {
        type: 'bar',

        // Chart Options
        options: gloablSalesOptions,

        data: globalSalesData
    };

    // Create the chart
    var globalSalesChart = new Chart(ctx5, globalSalesConfig);

    // Live chart update random data for the new entry
    setInterval(function() {
        setData(globalSalesChart.data.datasets[0].data, 1200, 2500);
    }, 3500);
    function setData(data, minValue, maxValue) {
        data.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
        data.shift();
        globalSalesChart.update();
    }

    /********************************************
    *               Vector Maps                 *
    ********************************************/
    $('#world-map-markers').vectorMap({
        // backgroundColor: '#00494F',
        backgroundColor: '#FF5F3D',
        zoomOnScroll: false,
        map: 'world_mill',
        zoomOnScroll: false,
        scaleColors: ['#C8EEFF', '#0071A4'],
        normalizeFunction: 'polynomial',
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
            initial: {
                /*fill: '#F44336',
                stroke: '#F44336',*/
                fill: '#91EBD4',
                stroke: '#37BC9B',
                'stroke-width': 2
                /*'stroke-opacity': 0.3,
                'stroke-width': 8,*/
            },
            hover: {
                fill: '#37BC9B',
                stroke: '#37BC9B',
            },
            selected: {
                fill: '#37BC9B',
                stroke: '#37BC9B',
            },
            selectedHover: {
                fill: '#37BC9B',
                stroke: '#37BC9B',
            }
        },
        regionStyle: {
            initial: {
                // fill: '#B9E6E1',
                fill: '#FFF0ED',
            },
            hover: {
                fill: '#FFCBC0'
            },
            selected: {
                fill: '#FFCBC0'
            },
            selectedHover: {
                fill: '#FFB4A4'
            }
        },
        // backgroundColor: '#37474F',
        markers: [
            {latLng: [51.52, -0.14], name: 'London'},
            {latLng: [48.87, 2.34], name: 'Paris'},
            {latLng: [47.36, 8.53], name: 'Switzerland'},
            {latLng: [40.54, -3.77], name: 'Spain'},
            {latLng: [39.59, -105.19], name: 'USA'},
            {latLng: [19.67, -99.12], name: 'Mexico'},
            {latLng: [-8.37, -56.06], name: 'Brazil'},
            {latLng: [-31.17, -64.14], name: 'Argentina'},
            {latLng: [-26.20, 28.02], name: 'Johanesburg'},
            {latLng: [19.05, 72.87], name: 'Mumbai'},
            {latLng: [40.03, 116.46], name: 'Beijing'},
            {latLng: [31.27, 121.47], name: 'Shanghai'},
            {latLng: [35.739, 139.75], name: 'Japan'},
            {latLng: [-34.83, 138.60], name: 'Adelaide'},
            {latLng: [-37.77, 144.97], name: 'Melbourne'},
            {latLng: [1.3, 103.8], name: 'Singapore'},
            {latLng: [26.02, 50.55], name: 'Bahrain'},
        ]
    });

    /*********************************************
    *               Total Products               *
    *********************************************/
    Morris.Line({
        element: 'map-total-orders',
        data: [{y: '1', a: 14, }, {y: '2', a: 12 }, {y: '3', a: 4 }, {y: '4', a: 13 }, {y: '5', a: 9 }, {y: '6', a: 14 }, {y: '7', a: 12 }, {y: '8', a: 20 }],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Likes'],
        axes: false,
        grid: false,
        behaveLikeLine: true,
        ymax: 20,
        resize: true,
        pointSize: 4,
        pointFillColors: ['#FFF'],
        pointStrokeColors: ['#FF6E40'],
        smooth: false,
        numLines: 6,
        lineWidth: 2,
        lineColors: ['#FF6E40'],
        hideHover: 'auto',
    });

    /*******************************************
    *               Total Profit               *
    *******************************************/
    Morris.Line({
        element: 'map-total-profit',
        data: [{y: '1', a: 14, }, {y: '2', a: 12 }, {y: '3', a: 4 }, {y: '4', a: 13 }, {y: '5', a: 7 }, {y: '6', a: 14 }, {y: '7', a: 8 }, {y: '8', a: 20 }],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Likes'],
        axes: false,
        grid: false,
        behaveLikeLine: true,
        ymax: 20,
        resize: true,
        pointSize: 4,
        pointFillColors: ['#FFF'],
        pointStrokeColors: ['#1DE9B6'],
        smooth: false,
        numLines: 6,
        lineWidth: 2,
        lineColors: ['#1DE9B6'],
        hideHover: 'auto',
    });

	/************************************************************
    *               Social Cards Content Slider                 *
    ************************************************************/
    // RTL Support
    var rtl = false;
    if($('html').data('textdirection') == 'RTL'){
        rtl = true;
    }
    if(rtl === true)
        $(".tweet-slider").attr('dir', 'rtl');
    if(rtl === true)
        $(".fb-post-slider").attr('dir', 'rtl');

    // Tweet Slider
    $(".tweet-slider").unslider({
        autoplay: true,
        arrows: false,
        nav: false,
        infinite: true
    });

    // FB Post Slider
    $(".fb-post-slider").unslider({
        autoplay: true,
        delay: 3500,
        arrows: false,
        nav: false,
        infinite: true
    });

});
