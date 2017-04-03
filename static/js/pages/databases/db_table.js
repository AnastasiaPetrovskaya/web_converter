$(document).ready(function() {

    $('#databases_table').on('click', '#schema', function(event) {

        event.preventDefault();

        $.get('/databases/schema/' + $(this).parents('tr').attr('data-id'), function(res) {
            bootbox.alert({
                message: 'success',
                className: "slideInDown",
                buttons: {
                    ok: {
                        label: "OK",
                        className: "btn-success"
                    }
                }
            });
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
