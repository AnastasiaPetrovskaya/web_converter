/*=========================================================================================
    File Name: advance-cards.js
    Description: intialize advance cards
    ----------------------------------------------------------------------------------------
    Item Name: Robust - Responsive Admin Theme
    Version: 1.0
    Author: GeeksLabs
    Author URL: http://www.themeforest.net/user/geekslabs
==========================================================================================*/
(function(window, document, $) {
    'use strict';

    /*****************************************************
    *               Grouped Card Statistics              *
    *****************************************************/
    var rtl = false;
    if($('html').data('textdirection') == 'RTL')
        rtl = true;

    $(".knob").knob({
        rtl: rtl,
        draw: function() {
            var ele = this.$;
            var style = ele.attr('style');
            style = style.replace("bold", "normal");
            var fontSize = parseInt(ele.css('font-size'), 10);
            var updateFontSize = Math.ceil(fontSize * 1.65);
            style = style.replace("bold", "normal");
            style = style + "font-size: " +updateFontSize+"px;";
            var icon = ele.attr('data-knob-icon');
            ele.hide();
            $('<i class="knob-center-icon '+icon+'"></i>').insertAfter(ele).attr('style',style);

            // "tron" case
            if (this.$.data('skin') == 'tron') {

                this.cursorExt = 0.3;

                var a = this.arc(this.cv), // Arc
                    pa, // Previous arc
                    r = 1;

                this.g.lineWidth = this.lineWidth;

                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }
    });

    /******************************************
    *               Total Likes               *
    ******************************************/
    Morris.Area({
        element: 'morris-likes',
        data: [{y: '1', a: 14, }, {y: '2', a: 12 }, {y: '3', a: 4 }, {y: '4', a: 9 }, {y: '5', a: 3 }, {y: '6', a: 6 }, {y: '7', a: 11 }, {y: '8', a: 10 }, {y: '9', a: 13 }, {y: '10', a: 9 }, {y: '11', a: 14 },{y: '12', a: 11 }, {y: '13', a: 16 }, {y: '14', a: 20 }, {y: '15', a: 15 }],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Likes'],
        axes: false,
        grid: false,
        behaveLikeLine: true,
        ymax: 20,
        resize: true,
        pointSize: 0,
        smooth: true,
        numLines: 6,
        lineWidth: 2,
        fillOpacity: 0.1,
        lineColors: ['#00BCD4'],
        hideHover: true,
        hoverCallback: function (index, options, content, row) {
            return "";
        }
    });

    /*********************************************
    *               Total Comments               *
    *********************************************/
    Morris.Area({
        element: 'morris-comments',
        data: [{y: '1', a: 15, }, {y: '2', a: 20 }, {y: '3', a: 16 }, {y: '4', a: 11 }, {y: '5', a: 14 }, {y: '6', a: 9 }, {y: '7', a: 13 }, {y: '8', a: 10 }, {y: '9', a: 11 }, {y: '10', a: 6 }, {y: '11', a: 3 },{y: '12', a: 9 }, {y: '13', a: 4 }, {y: '14', a: 12 }, {y: '15', a: 14 }],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Comments'],
        axes: false,
        grid: false,
        behaveLikeLine: true,
        ymax: 20,
        resize: true,
        pointSize: 0,
        smooth: true,
        numLines: 6,
        lineWidth: 2,
        fillOpacity: 0.1,
        lineColors: ['#FF5722'],
        hideHover: true,
        hoverCallback: function (index, options, content, row) {
            return "";
        }
    });

    /******************************************
    *               Total Views               *
    ******************************************/
    Morris.Area({
        element: 'morris-views',
        data: [{y: '1', a: 14, }, {y: '2', a: 12 }, {y: '3', a: 4 }, {y: '4', a: 9 }, {y: '5', a: 3 }, {y: '6', a: 6 }, {y: '7', a: 11 }, {y: '8', a: 10 }, {y: '9', a: 13 }, {y: '10', a: 9 }, {y: '11', a: 14 },{y: '12', a: 11 }, {y: '13', a: 16 }, {y: '14', a: 20 }, {y: '15', a: 15 }],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Views'],
        axes: false,
        grid: false,
        behaveLikeLine: true,
        ymax: 20,
        resize: true,
        pointSize: 0,
        smooth: true,
        numLines: 6,
        lineWidth: 2,
        fillOpacity: 0.1,
        lineColors: ['#E91E63'],
        hideHover: true,
        hoverCallback: function (index, options, content, row) {
            return "";
        }
    });

    /****************************************************
    *               Employee Satisfaction               *
    ****************************************************/
    //Get the context of the Chart canvas element we want to select
    var ctx1 = document.getElementById("emp-satisfaction").getContext("2d");

    // Create Linear Gradient
    var white_gradient = ctx1.createLinearGradient(0, 0, 0,400);
    white_gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
    white_gradient.addColorStop(1, 'rgba(255,255,255,0)');

    // Chart Options
    var empSatOptions = {
        responsive: true,
        maintainAspectRatio: false,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth : 4,
        tooltipFillColor: "rgba(0,0,0,0.8)",
        legend: {
            display: false,
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min: 0,
                    max: 85
                },
            }]
        },
        title: {
            display: false,
            fontColor: "#FFF",
            fullWidth: false,
            fontSize: 40,
            text: '82%'
        }
    };

    // Chart Data
    var empSatData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Employees",
            data: [28, 35, 36, 48, 46, 42, 60],
            backgroundColor: white_gradient,
            borderColor: "rgba(255,255,255,1)",
            borderWidth: 2,
            strokeColor : "#ff6c23",
            pointColor : "#fff",
            pointBorderColor: "rgba(255,255,255,1)",
            pointBackgroundColor: "#3BAFDA",
            pointBorderWidth: 2,
            pointHoverBorderWidth: 2,
            pointRadius: 5,
        }]
    };

    var empSatconfig = {
        type: 'line',

        // Chart Options
        options : empSatOptions,

        // Chart Data
        data : empSatData
    };

    // Create the chart
    var areaChart = new Chart(ctx1, empSatconfig);



    /***********************************************************
    *               New User - Page Visist Stats               *
    ***********************************************************/
    //Get the context of the Chart canvas element we want to select
    var ctx2 = document.getElementById("line-stacked-area").getContext("2d");

    // Create Linear Gradient
    var ios_gradient = ctx2.createLinearGradient(0, 0, 0, 400);
    ios_gradient.addColorStop(0, 'rgba(248, 167, 34, 0.6)');
    ios_gradient.addColorStop(1, 'rgba(248, 167, 34, 1)');

    var windows_gradient = ctx2.createLinearGradient(0, 0, 0, 400);
    windows_gradient.addColorStop(0, 'rgba(247, 229, 25, 0.6)');
    windows_gradient.addColorStop(1, 'rgba(247, 229, 25, 1)');

    var android_gradient = ctx2.createLinearGradient(0, 0, 0, 400);
    android_gradient.addColorStop(0, 'rgba(125, 199, 86, 0.6)');
    android_gradient.addColorStop(1, 'rgba(125, 199, 86, 1)');

    // Chart Options
    var userPageVisitOptions = {
        responsive: true,
        maintainAspectRatio: false,
        pointDotStrokeWidth : 4,
        legend: {
            display: false,
            labels: {
                fontColor: '#FFF',
                boxWidth: 10,
            },
            position: 'top',
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    color: "rgba(255,255,255, 0.3)",
                    drawTicks: false,
                    drawBorder: false
                },
                ticks: {
                    display: false,
                    min: 0,
                    max: 70,
                    maxTicksLimit: 4
                },
            }]
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart - Legend'
        },
    };

    // Chart Data
    var userPageVisitData = {
        labels: ["2010", "2011", "2012", "2013", "2014", "2015"],
        datasets: [{
            label: "iOS",
            data: [0, 10, 5, 26, 12, 20],
            backgroundColor: "#eeda54",
            borderColor: "#eeda54",
            pointBorderColor: "#eeda54",
            pointBackgroundColor: "#eeda54",
            pointRadius: 2,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 2,
        },{
            label: "Windows",
            data: [0, 20, 20, 30, 26, 32],
            backgroundColor: "rgba(166,100,255,0.8)",
            borderColor: "transparent",
            pointBorderColor: "transparent",
            pointBackgroundColor: "transparent",
            pointRadius: 2,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 2,
        }, {
            label: "Android",
            data: [0, 30, 15, 40, 38, 45],
            backgroundColor: "#40cae4",
            borderColor: "#40cae4",
            pointBorderColor: "#40cae4",
            pointBackgroundColor: "#40cae4",
            pointRadius: 2,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 2,
        }]
    };

    var userPageVisitConfig = {
        type: 'line',

        // Chart Options
        options : userPageVisitOptions,

        // Chart Data
        data : userPageVisitData
    };

    // Create the chart
    var stackedAreaChart = new Chart(ctx2, userPageVisitConfig);


    /*********************************************
    *               Total Earnings               *
    **********************************************/
    //Get the context of the Chart canvas element we want to select
    var ctx3 = document.getElementById("earning-chart").getContext("2d");

    // Chart Options
    var earningOptions = {
        responsive: true,
        maintainAspectRatio: false,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth : 4,
        tooltipFillColor: "rgba(0,0,0,0.8)",
        legend: {
            display: false,
            position: 'bottom',
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min: 0,
                    max: 70
                },
            }]
        },
        title: {
            display: false,
            fontColor: "#FFF",
            fullWidth: false,
            fontSize: 40,
            text: '82%'
        }
    };

    // Chart Data
    var earningData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            data: [28, 35, 36, 48, 46, 42, 60],
            backgroundColor: 'rgba(45,149,191,0.1)',
            borderColor: "transparent",
            borderWidth: 0,
            strokeColor : "#ff6c23",
            capBezierPoints: true,
            pointColor : "#fff",
            pointBorderColor: "rgba(45,149,191,1)",
            pointBackgroundColor: "#FFF",
            pointBorderWidth: 2,
            pointRadius: 4,
        }]
    };

    var earningConfig = {
        type: 'line',

        // Chart Options
        options : earningOptions,

        // Chart Data
        data : earningData
    };

    // Create the chart
    var earningChart = new Chart(ctx3, earningConfig);


    /*************************************************
    *               Posts Visits Ratio               *
    *************************************************/
    //Get the context of the Chart canvas element we want to select
    var ctx4 = $("#posts-visits");

    // Chart Options
    var PostsVisitsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'top',
            labels: {
                boxWidth: 10,
                fontSize: 14
            },
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: true,
                gridLines: {
                    lineWidth: 2,
                    color: "rgba(0, 0, 0, 0.05)",
                    zeroLineWidth: 2,
                    zeroLineColor: "rgba(0, 0, 0, 0.05)",
                    drawTicks: false,
                },
                ticks: {
                    fontSize: 14,
                }
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min: 0,
                    max: 100
                }
            }]
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart - Legend'
        }
    };

    // Chart Data
    var postsVisitsData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: "Visits",
            data: [32, 25, 45, 30, 60, 40, 72, 52, 80, 60, 92, 70],
            lineTension: 0,
            fill: false,
            // borderDash: [5, 5],
            borderColor: "#37BC9B",
            pointBorderColor: "#37BC9B",
            pointBackgroundColor: "#FFF",
            pointBorderWidth: 3,
            pointRadius: 6,
        }, {
            label: "Posts",
            data: [12, 10, 25, 15, 35, 22, 42, 28, 50, 32, 58, 28],
            lineTension: 0,
            fill: false,
            borderColor: "#967ADC",
            pointBorderColor: "#967ADC",
            pointBackgroundColor: "#FFF",
            pointBorderWidth: 3,
            pointRadius: 6,
        }]
    };

    var postsVisitsConfig = {
        type: 'line',

        // Chart Options
        options : PostsVisitsOptions,

        data : postsVisitsData
    };

    // Create the chart
    var postsVisitsChart = new Chart(ctx4, postsVisitsConfig);


    /*******************************************
    *               Global Sales               *
    *******************************************/

    //Get the context of the Chart canvas element we want to select
    var ctx5 = document.getElementById("global-sales").getContext("2d");

    // Create Linear Gradient
    var white_gradient2 = ctx1.createLinearGradient(0, 0, 0,400);
    white_gradient2.addColorStop(0, 'rgba(248, 238, 44, 1)');
    white_gradient2.addColorStop(0.6, 'rgba(255, 162, 0, 1)');
    white_gradient2.addColorStop(1, 'rgba(243, 97, 0, 1)');

    // Chart Options
    var gloablSalesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration:500,
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
            },{
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
        },{
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
        options : gloablSalesOptions,

        data : globalSalesData
    };

    // Create the chart
    var globalSalesChart = new Chart(ctx5, globalSalesConfig);


    /****************************************************
    *               Yearly Revenue Comparision          *
    ****************************************************/
    //Get the context of the Chart canvas element we want to select
    var ctx6 = $("#revenue-comparision");

    // Chart Options
    var revenueComparisionOptions = {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration:500,
        hoverMode: 'label',
        stacked: false,
        legend: {
            display: false,
            position: 'top',
        },
        title:{
            display:false,
            text:"Chart.js Bar Chart - Multi Axis"
        },
        scales: {
            xAxes: [{
                type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: "top",
                id: "x-axis-1",
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    zeroLineColor: '#FFF'
                },
                ticks:{
                    fontColor: '#FFF',
                }
            }, {
                type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: "bottom",
                id: "x-axis-2",
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    drawOnChartArea: false,
                    zeroLineColor: '#FFF'
                },
                ticks:{
                    fontColor: '#FFF',
                }
            }],
            yAxes:[{
                display: true,
                gridLines: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    drawTicks: false,
                },
                ticks:{
                    fontColor: '#FFF',
                }
            }]
        }
    };

    // Chart Data
    var revenueComparisionData = {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [{
            label: "My First dataset",
            data: [45, -19, 34, 48, -56],
            backgroundColor: "#EFD864",
            // hoverBackgroundColor: "rgba(153,184,152,.8)",
            xAxisID: "x-axis-1",
        }, {
            label: "My Second dataset",
            data: [-28, 40, -28, -56, 48],
            backgroundColor: "#F37A21",
            // hoverBackgroundColor: "rgba(254,206,168,.8)",
            xAxisID: "x-axis-2",
        }]
    };

    var revenueComparisionConfig = {
        type: 'horizontalBar',

        // Chart Options
        options : revenueComparisionOptions,

        data : revenueComparisionData
    };

    // Create the chart
    var revenueComparisionChart = new Chart(ctx6, revenueComparisionConfig);



    /************************************************
    *               Sales Growth Rate               *
    ************************************************/
    Morris.Area({
        element: 'sales-growth-chart',
        data: [{y: '2010', a: 28, }, {y: '2011', a: 40 }, {y: '2012', a: 36 }, {y: '2013', a: 48 }, {y: '2014', a: 32 }, {y: '2015', a: 42 }, {y: '2016', a: 30 }],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Sales'],
        behaveLikeLine: true,
        ymax: 60,
        resize: true,
        pointSize: 0,
        smooth: true,
        gridTextColor: '#bfbfbf',
        gridLineColor: '#c3c3c3',
        numLines: 6,
        gridtextSize: 14,
        lineWidth: 2,
        fillOpacity: 0.6,
        lineColors: ['#009688'],
        hideHover: 'auto',
    });


    /*******************************************
    *               Mobile Sales               *
    ********************************************/
    Morris.Bar({
        element: 'mobile-sales',
        data: [{device: 'iPhone 7', sales: 1835 }, {device: 'Galaxy Note 7', sales: 2356 }, {device: 'Mi5', sales: 1459 }, {device: 'Moto Z', sales: 1289 }, {device: 'Lenovo X3', sales: 1647 }, {device: 'One Plus 3', sales: 2156 }],
        xkey: 'device',
        ykeys: ['sales'],
        labels: ['Sales'],
        barGap: 6,
        barSizeRatio: 0.3,
        gridTextColor: '#FFF',
        gridLineColor: '#FFF',
        goalLineColors: '#000',
        numLines: 4,
        gridtextSize: 14,
        resize: true,
        barColors: ['#FFF'],
        xLabelAngle: 35,
        hideHover: 'auto',
    });


    /********************************************
    *               Monthly Sales               *
    ********************************************/
    Morris.Bar({
        element: 'monthly-sales',
        data: [{month: 'Jan', sales: 1835 }, {month: 'Feb', sales: 2356 }, {month: 'Mar', sales: 1459 }, {month: 'Apr', sales: 1289 }, {month: 'May', sales: 1647 }, {month: 'Jun', sales: 2156 }, {month: 'Jul', sales: 1835 }, {month: 'Aug', sales: 2356 }, {month: 'Sep', sales: 1459 }, {month: 'Oct', sales: 1289 }, {month: 'Nov', sales: 1647 }, {month: 'Dec', sales: 2156 }],
        xkey: 'month',
        ykeys: ['sales'],
        labels: ['Sales'],
        barGap: 4,
        barSizeRatio: 0.3,
        gridTextColor: '#bfbfbf',
        gridLineColor: '#e3e3e3',
        numLines: 5,
        gridtextSize: 14,
        resize: true,
        barColors: ['#967ADC'],
        hideHover: 'auto',
    });



    /*****************************************************
    *               Advertisement Expenses               *
    *****************************************************/
    //Get the context of the Chart canvas element we want to select
    var ctx7 = $("#advertisement-expense");

    // Chart Options
    var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration:500,
        legend: {
            display: false,
            position: 'bottom',
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: false,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
            }]
        },
        title: {
            display: false,
            text: 'Radar Chart'
        }
    };

    // Chart Data
    var chartData = {
        labels: ["Radio", "TV", "Movie", "Show", "Banner", "Internet", "Newspaper"],
        datasets: [{
            label: "Samsung Galaxy S7",
            borderColor: "rgba(0,188,212,1)",
            backgroundColor: "rgba(0,188,212,.7)",
            pointBackgroundColor: "rgba(0,188,212,1)",
            data: [NaN, 59, 80, 81, 56, 55, 40],
        }, {
            label: "iPhone 7",
            data: [45, 25, NaN, 36, 67, 18, 76],
            borderColor: "rgba(233,30,99,1)",
            backgroundColor: "rgba(233,30,99,.7)",
            pointBackgroundColor: "rgba(233,30,99,1)",
            hoverPointBackgroundColor: "#fff",
            pointHighlightStroke: "rgba(233,30,99,1)",
        }, {
            label: "One Plus 3",
            data: [28, 48, 40, 19, 86, 27, NaN],
            borderColor: "rgba(0,150,136,1)",
            backgroundColor: "rgba(0,150,136,.7)",
            pointBackgroundColor: "rgba(0,150,136,1)",
            hoverPointBackgroundColor: "#fff",
            pointHighlightStroke: "rgba(0,150,136,1)",
        },]
    };

    var config = {
        type: 'radar',

        // Chart Options
        options: chartOptions,

        data: chartData
    };

    // Create the chart
    var lineChart = new Chart(ctx7, config);

    /************************************************
    *               Sparkline Charts                *
    ************************************************/

    var sparkLineDraw = function() {
        /******************
        *   Line Charts   *
        ******************/
        // Total Cost
        $("#sp-line-total-cost").sparkline([14,12,4,9,3,6,11,10,13,9,14,11,16,20,15], {
            type: 'line',
            width: '100%',
            height: '100px',
            lineColor: '#FF5722',
            fillColor: '#FF5722',
            spotColor: '',
            minSpotColor: '',
            maxSpotColor: '',
            highlightSpotColor: '',
            highlightLineColor: '',
            chartRangeMin: 0,
            chartRangeMax: 20,
        });

        // Total Sales
        $("#sp-line-total-sales").sparkline([14,12,4,9,3,6,11,10,13,9,14,11,16,20,15], {
            type: 'line',
            width: '100%',
            height: '100px',
            lineColor: '#00BCD4',
            fillColor: '#00BCD4',
            spotColor: '',
            minSpotColor: '',
            maxSpotColor: '',
            highlightSpotColor: '',
            highlightLineColor: '',
            chartRangeMin: 0,
            chartRangeMax: 20,
        });

        // Total Revenue
        $("#sp-line-total-revenue").sparkline([14,12,4,9,3,6,11,10,13,9,14,11,16,20,15], {
            type: 'line',
            width: '100%',
            height: '100px',
            lineColor: '#E91E63',
            fillColor: '#E91E63',
            spotColor: '',
            minSpotColor: '',
            maxSpotColor: '',
            highlightSpotColor: '',
            highlightLineColor: '',
            chartRangeMin: 0,
            chartRangeMax: 20,
        });

        /*****************
        *   Bar Charts   *
        *****************/
        $("#sp-bar-total-cost").sparkline([5,6,7,8,9,10,12,13,15,14,13,12,10,9,8,10,12,14,15,16,17,14,12,11,10,8], {
            type: 'bar',
            width: '100%',
            height: '30px',
            barWidth: 2,
            barSpacing: 4,
            barColor: '#FF5722'
        });

        $("#sp-bar-total-sales").sparkline([5,6,7,8,9,10,12,13,15,14,13,12,10,9,8,10,12,14,15,16,17,14,12,11,10,8], {
            type: 'bar',
            width: '100%',
            height: '30px',
            barWidth: 2,
            barSpacing: 4,
            barColor: '#00BCD4'
        });

        $("#sp-bar-total-revenue").sparkline([5,6,7,8,9,10,12,13,15,14,13,12,10,9,8,10,12,14,15,16,17,14,12,11,10,8], {
            type: 'bar',
            width: '100%',
            height: '30px',
            barWidth: 2,
            barSpacing: 4,
            barColor: '#E91E63'
        });

        /*************************
        *   Stacked Bar Charts   *
        *************************/
        $("#sp-stacked-bar-total-cost").sparkline([ [8,10], [12,8], [9,14], [8,11], [10,13], [7,11], [8,14], [9,12], [10,11], [12,14], [8,12], [9,12], [9,14] ], {
            type: 'bar',
            width: '100%',
            height: '30px',
            barWidth: 4,
            barSpacing: 6,
            stackedBarColor: ['#4CAF50', '#FFEB3B']
        });

        $("#sp-stacked-bar-total-sales").sparkline([ [8,10], [12,8], [9,14], [8,11], [10,13], [7,11], [8,14], [9,12], [10,11], [12,14], [8,12], [9,12], [9,14] ], {
            type: 'bar',
            width: '100%',
            height: '30px',
            barWidth: 4,
            barSpacing: 6,
            stackedBarColor: ['#FF5722', '#009688']
        });

        $("#sp-stacked-bar-total-revenue").sparkline([ [8,10], [12,8], [9,14], [8,11], [10,13], [7,11], [8,14], [9,12], [10,11], [12,14], [8,12], [9,12], [9,14] ], {
            type: 'bar',
            width: '100%',
            height: '30px',
            barWidth: 4,
            barSpacing: 6,
            stackedBarColor: ['#E91E63', '#00BCD4']
        });

        /**********************
        *   Tristate Charts   *
        **********************/
        $("#sp-tristate-bar-total-cost").sparkline([1,1,0,1,-1,-1,1,-1,0,0,1,1,0,-1,1,-1], {
            type: 'tristate',
            height: '30',
            posBarColor: '#ffeb3b',
            negBarColor: '#4caf50',
            barWidth: 4,
            barSpacing: 5,
            zeroAxis: false
        });

        $("#sp-tristate-bar-total-sales").sparkline([1,1,0,1,-1,-1,1,-1,0,0,1,1,0,-1,1,-1], {
            type: 'tristate',
            height: '30',
            posBarColor: '#009688',
            negBarColor: '#FF5722',
            barWidth: 4,
            barSpacing: 5,
            zeroAxis: false
        });

        $("#sp-tristate-bar-total-revenue").sparkline([1,1,0,1,-1,-1,1,-1,0,0,1,1,0,-1,1,-1], {
            type: 'tristate',
            height: '30',
            posBarColor: '#00BCD4',
            negBarColor: '#E91E63',
            barWidth: 4,
            barSpacing: 5,
            zeroAxis: false
        });

        // Total Revenue
        $("#sp-line-total-profit").sparkline([14,12,4,9,3,6,11,10,13,9,14,11,16,20,15], {
            type: 'line',
            width: '100%',
            height: '50px',
            lineColor: '#E91E63',
            fillColor: '',
            spotColor: '',
            minSpotColor: '',
            maxSpotColor: '',
            highlightSpotColor: '',
            highlightLineColor: '',
            chartRangeMin: 0,
            chartRangeMax: 20,
        });
    };

    var sparkResize;

    $(window).resize(function(e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparkLineDraw, 500);
    });
    sparkLineDraw();

    /********************************************
    *               Vector Maps                 *
    ********************************************/
    $('#world-map-markers').vectorMap({
        // backgroundColor: '#00494F',
        backgroundColor: '#1DE9B6',
        zoomOnScroll: false,
        map: 'world_mill',
        scaleColors: ['#C8EEFF', '#0071A4'],
        normalizeFunction: 'polynomial',
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
            initial: {
                /*fill: '#F44336',
                stroke: '#F44336',*/
                fill: '#FF9E80',
                stroke: '#FF6E40',
                'stroke-width': 2
                /*'stroke-opacity': 0.3,
                'stroke-width': 8,*/
            },
            hover: {
                fill: '#FF6E40',
                stroke: '#FF6E40',
            },
            selected: {
                fill: '#FF3D00',
                stroke: '#FF6E40',
            },
            selectedHover: {
                fill: '#DD2C00',
                stroke: '#FF6E40',
            }
        },
        regionStyle: {
            initial: {
                // fill: '#B9E6E1',
                fill: '#A7FFEB',
            },
            hover: {
                fill: '#64FFDA'
            },
            selected: {
                fill: '#1DE9B6'
            },
            selectedHover: {
                fill: '#00BFA5'
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
        hideHover: true,
        hoverCallback: function (index, options, content, row) {
            return "";
        }
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
        hideHover: true,
        hoverCallback: function (index, options, content, row) {
            return "";
        }
    });

    /****************************************************
    *               Interactive Charts                  *
    ****************************************************/

    // Live visits from specific countries
    var seriesData = [
        [],
        [],
        [],
        []
    ];
    var random = new Rickshaw.Fixtures.RandomData(150);

    for (var i = 0; i < 150; i++) {
        random.addData(seriesData);
    }

    var liveVisits = $('#live-visits');
    var liveVisitsGraph = new Rickshaw.Graph({
        element: liveVisits.get(0),
        width: liveVisits.width(),
        height: 400,
        renderer: 'area',
        stroke: true,
        series: [{
            color: '#99B898',
            data: seriesData[0],
            name: 'Asia'
        }, {
            color: '#FECEA8',
            data: seriesData[1],
            name: 'Africa'
        }, {
            color: '#FF847C',
            data: seriesData[2],
            name: 'America'
        }, {
            color: '#6C5B7B',
            data: seriesData[3],
            name: 'Europe'
        }]
    });

    liveVisitsGraph.render();

    setInterval(function() {
        random.removeData(seriesData);
        random.addData(seriesData);
        liveVisitsGraph.update();

    }, 2000);

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: liveVisitsGraph
    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: liveVisitsGraph,
        // legend: legend
    });

    $(window).on('resize', function() {
        liveVisitsGraph.configure({
            width: liveVisits.width()
        });
        liveVisitsGraph.render();
    });

    //Get the context of the Chart canvas element we want to select
    var liveVisitsDoughnut = $("#live-visits-doughnut");

    // Chart Options
    var liveVisitsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration:500,
    };

    // Chart Data
    var liveVisitsData = {
        labels: ["Asia", "Africa", "America", "Europe"],
        datasets: [{
            label: "My First dataset",
            data: [15684, 54789, 89756, 23489],
            backgroundColor: ["#99B898","#FECEA8","#FF847C","#6C5B7B"],
        }]
    };

    var liveVisitsConfig = {
        type: 'doughnut',

        // Chart Options
        options : liveVisitsOptions,

        data : liveVisitsData
    };

    // Create the chart
    var visitsDoughnutChart = new Chart(liveVisitsDoughnut, liveVisitsConfig);


    /*************************************************
    *               Cost Revenue Stats               *
    *************************************************/
    new Chartist.Line('#cost-revenue', {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 14, 15, 16, 17, 18, 19, 20],
        series: [
            [
                {meta:'Revenue', value: 5},
                {meta:'Revenue', value: 3},
                {meta:'Revenue', value: 4},
                {meta:'Revenue', value: 3},
                {meta:'Revenue', value: 6},
                {meta:'Revenue', value: 5},
                {meta:'Revenue', value: 8},
                {meta:'Revenue', value: 12},
                {meta:'Revenue', value: 7},
                {meta:'Revenue', value: 10},
                {meta:'Revenue', value: 12},
                {meta:'Revenue', value: 10},
                {meta:'Revenue', value: 11},
                {meta:'Revenue', value: 9},
                {meta:'Revenue', value: 11},
                {meta:'Revenue', value: 5},
                {meta:'Revenue', value: 10},
                {meta:'Revenue', value: 9},
                {meta:'Revenue', value: 14},
                {meta:'Revenue', value: 10}
            ]
        ]
    }, {
        low: 0,
        high: 18,
        fullWidth: true,
        showArea: true,
        showPoint: true,
        showLabel: false,
        axisX: {
            showGrid: false,
            showLabel: false,
            offset: 0
        },
        axisY: {
            showGrid: false,
            showLabel: false,
            offset: 0
        },
        chartPadding: 0,
        plugins: [
            Chartist.plugins.tooltip()
        ]
    }).on('draw', function(data) {
        if (data.type === 'area') {
            data.element.attr({
                'style': 'fill: #FFF; fill-opacity: 0.3'
            });
        }
        if (data.type === 'line') {
            data.element.attr({
                'style': 'fill: transparent; stroke: #FFF; stroke-opacity: 0.4; stroke-width: 2px;'
            });
        }
        if (data.type === 'point') {
            data.element.attr({
                'style': 'stroke: #FFF; stroke-opacity: 0.4; stroke-width: 6px;'
            });
        }
    });

    /********************************
    *       Monthly Sales           *
    ********************************/
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
            'echarts/chart/pie',
            'echarts/chart/funnel'
        ],


        // Charts setup
        function (ec) {
            /****************************************
            *              Monthly Sales            *
            ****************************************/
            // Initialize chart
            // ------------------------------
            var myChart = ec.init(document.getElementById('nightingale-rose-labels'));

            // Chart Options
            // ------------------------------
            var chartOptions = {

                // Add title
                title: {
                    text: 'Monthly Sales',
                    subtext: 'product sales on monthly basis',
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
                    formatter: "{a} <br/>{b}: +{c}$ ({d}%)"
                },


                color: ['#ffd775', '#ff847c', '#e84a5f', '#2a363b', '#7fd5c3', '#61a781', '#f0c75e', '#df8c7d', '#e8ed8a', '#55bcbb', '#e974b9', '#2f9395'],


                // Display toolbox
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    feature: {
                        mark: {
                            show: true,
                            title: {
                                mark: 'Markline switch',
                                markUndo: 'Undo markline',
                                markClear: 'Clear markline'
                            }
                        },
                        dataView: {
                            show: true,
                            readOnly: false,
                            title: 'View data',
                            lang: ['View chart data', 'Close', 'Update']
                        },
                        magicType: {
                            show: true,
                            title: {
                                pie: 'Switch to pies',
                                funnel: 'Switch to funnel',
                            },
                            type: ['pie', 'funnel']
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
                series: [
                    {
                        name: 'Increase (brutto)',
                        type: 'pie',
                        radius: ['15%', '73%'],
                        center: ['50%', '57%'],
                        roseType: 'area',

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

                        // Funnel
                        width: '40%',
                        height: '78%',
                        x: '30%',
                        y: '17.5%',
                        max: 450,
                        sort: 'ascending',

                        data: [
                            {value: 440, name: 'January'},
                            {value: 260, name: 'February'},
                            {value: 350, name: 'March'},
                            {value: 250, name: 'April'},
                            {value: 210, name: 'May'},
                            {value: 350, name: 'June'},
                            {value: 300, name: 'July'},
                            {value: 430, name: 'August'},
                            {value: 400, name: 'September'},
                            {value: 450, name: 'October'},
                            {value: 330, name: 'November'},
                            {value: 200, name: 'December'}
                        ],
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


            /************************************
            *       Top Selling Categories      *
            ************************************/

            // Initialize chart
            // ------------------------------
            var topCategoryChart = ec.init(document.getElementById('doughnut'));

            // Chart Options
            // ------------------------------
            var topCategoryChartOptions = {

                // Add title
                title: {
                    text: 'Top 5 Categories',
                    subtext: 'Top selling mobiles',
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
                        mark: {
                            show: true,
                            title: {
                                mark: 'Markline switch',
                                markUndo: 'Undo markline',
                                markClear: 'Clear markline'
                            }
                        },
                        dataView: {
                            show: true,
                            readOnly: false,
                            title: 'View data',
                            lang: ['View chart data', 'Close', 'Update']
                        },
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
                series: [
                    {
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
                            {value: 335, name: 'Moto Z'},
                            {value: 618, name: 'Galaxy S7 Edge'},
                            {value: 234, name: 'One Plus 3'},
                            {value: 135, name: 'Mi 5'},
                            {value: 956, name: 'iPhone 6s'}
                        ]
                    }
                ]
            };

            // Apply options
            // ------------------------------

            topCategoryChart.setOption(topCategoryChartOptions);


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
                        topCategoryChart.resize();
                    }, 200);
                }
            });


            /************************************
            *       Customer Browser Stats      *
            ************************************/
            // Initialize chart
            // ------------------------------
            var customerBrowerChart = ec.init(document.getElementById('timeline'));

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
                            subtext: 'Based on shared research',
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
                                mark: {
                                    show: true,
                                    title: {
                                        mark: 'Markline switch',
                                        markUndo: 'Undo markline',
                                        markClear: 'Clear markline'
                                    }
                                },
                                dataView: {
                                    show: true,
                                    readOnly: false,
                                    title: 'View data',
                                    lang: ['View chart data', 'Close', 'Update']
                                },
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


    /************************************************************
    *               Social Cards Content Slider                 *
    ************************************************************/
    // RTL Support
    var rtl = false;
    if($('html').data('textdirection') == 'RTL'){
        rtl = true;
    }
    if(rtl === true){
        $(".tweet-slider").attr('dir', 'rtl');
        $(".fb-post-slider").attr('dir', 'rtl');
        $(".linkedin-post-slider").attr('dir', 'rtl');
    }

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

    // LinkedIn Post Slider
    $(".linkedin-post-slider").unslider({
        autoplay: true,
        arrows: false,
        nav: false,
        infinite: true
    });



})(window, document, jQuery);