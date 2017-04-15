$(document).ready(function() {


    $('#databases_table').on('click', '#delete', function(event) {
        var db_id = $(this).parents('tr').attr('data-id');

        event.preventDefault();
        bootbox.confirm({
            title: '<i class="icon-trash2"></i> Вы уверены, что хотите удалить данную базу?',
            message: 'После удаления базы данных ее невозможно будет использовать.' +
                'Кроме того будут удалены тестовые вопросы, которые вы создавали для данной базы.',
            className: "slideInDown custom-bootbox",
            buttons: {
                confirm: {
                    label: "OK",
                    className: "btn-success"
                },
                cancel: {
                    label: " Отмена",
                    className: "btn-danger mr-1"
                }
            },
            callback: function(result){
                if (result) {
                    $.ajax('/databases/remove/' + db_id, {method: 'DELETE'})
                        .done(function(result) {
                            if (result.success){
                                var options = {};
                                getTable('/databases/table', options, '#databases_table', function() {});
                            }
                        })
                       .fail(function(result){});
                }
            }
        });
    });

    $('#databases_table').on('click', '#schema', function(event) {

        event.preventDefault();
        bootbox.alert({
            title: 'Схема базы данных',
            message: '<div id="db_schema_div" class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>',
            className: "slideInDown largeWidth custom-bootbox",
            //size: 'large',
            buttons: {
                ok: {
                    label: "OK",
                    className: "btn-success"
                }
            }
        });

        $.get('/databases/schema/' + $(this).parents('tr').attr('data-id'), function(res) {
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

        /*var formData = new FormData();
        formData.append('db', $('#mdb_file')[0].files[0]);
        formData.append('title', $('#mdb_title').val());
        formData.append('description', $('#mdb_description').val());
        formData.append('type', $('#type').val());

        $('#mdb_submit').prop('disabled', true);
        $('#mdb_submit').html('<i class="icon-spinner12"></i>');

        $.ajax({
            url: '/databases/add',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            success: function (response) {
                $("#mdb_2_psql").modal('hide');
                //$('#mdb_2_psql').modal('toggle'); 
                //alert('success');
                bootbox.alert({
                    message: "Новая база данных успешно создана",
                    className: "slideInDown",
                    buttons: {
                        ok: {
                            label: "OK",
                            className: "btn-success"
                        }
                    },
                    callback: function() { 
                        //location.reload(); 
                        var options = {};
                        getTable('/databases/table', options, '#databases_table', function() {});
                    }
                });

            }
        });*/


    /*    $.post('/databases/add', data).done(function() {
            window.location.href = '/';
        }).fail(function(res) {
            window.location.href = '/login';
        });
        */

    });

});
