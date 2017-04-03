$(document).ready(function() {
    var options = {};

    getTable('/databases/table', options, '#databases_table', function() {});

});
