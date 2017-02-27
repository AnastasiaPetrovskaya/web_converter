var getTable = function(url, options, selector, callback) {
    console.log('url', url, options);

    $.ajax({
        type: 'GET',
        url: url,
        data: options,
        success: function(res) {
            $(selector).html(res);
            if (callback)
                callback(res);
        },
        fail: function(err) {
            console.log(err);
        }
    });
};
