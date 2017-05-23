$(document).ready(function() {

    $('#schema_card ').innerHeight($('#info_card ').innerHeight());
    /*$('#schema_card a[data-action="expand"]').click(function(e) {
        $('#schema_card .card-body').innerHeight("auto");
    });*/


    $.get('/databases/schema/' + db_id, function(res) {
        $('#db_schema_div').html('<img src="/db_schema/' + res.file +
             '" style="max-height: 100%;max-width: 100%;" alt="">');
    }).fail(function(err) {
        bootbox.alert({
            message: 'err' + err.message,
            className: "slideInDown",
            buttons: {
                ok: {
                    label: "OK",
                    className: "btn-success"
                }
            }
        });
    });

});
