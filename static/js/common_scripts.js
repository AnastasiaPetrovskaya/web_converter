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

var bootboxError = function(err) {
    bootbox.alert({
        className: 'slideInDown',
        title: 'Ошибка',
        message: err.message,
        buttons: {ok: {className: 'btn-danger'}}
    });
};

// codes works on all bootstrap modal windows in application
$('.modal').on('hidden.bs.modal', function(e)
{ 
    $(this).find("input,textarea,select").val('').end();
    $(this).find(".form-group").removeClass('validate').end();
    $(this).find(".form-group").removeClass('error').end();
    $(this).find(".form-group").removeClass('issue').end();
    $(this).find('#submit').prop('disabled', false);
}) ;

$.fn.editableform.buttons = 
  '<button type="submit" class="btn btn-in-table btn-outline-success btn-sm editable-submit">'+
    '<i class="icon-check font-medium-2"></i>'+
  '</button>'+
  '<button type="button" class="btn btn-in-table btn-outline-secondary btn-sm editable-cancel">'+
    '<i class="icon-remove font-medium-2"></i>'+
  '</button>';
