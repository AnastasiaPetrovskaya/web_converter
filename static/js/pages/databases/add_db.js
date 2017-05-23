$(document).ready(function(){
    $("#export_from_mdb").submit(function(event){
        console.log("submit event");

        event.preventDefault();

        var formData = new FormData();
        formData.append('db', $('#mdb_file')[0].files[0]);
        formData.append('title', $('#mdb_title').val());
        formData.append('description', $('#mdb_description').val());
        formData.append('type', $('#type').val());
        formData.append('note', $('#mdb_note').val());

        $('#submit').prop('disabled', true);
        //$('#submit').html('<i class="fa fa-spin fa-spinner"></i>');

        var res = $.ajax({
            url: '/databases/add',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            async: false,
            enctype: 'multipart/form-data',
            processData: false,
        }).responseText;

        res = JSON.parse(res);

        if (res.success) {
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
        } else {
            console.log('res', res);
            $('#submit').prop('disabled', false);
            bootboxError('Ошибка добавления новой базы данных. ' + res.error);
        }



    /*    $.post('/databases/add', data).done(function() {
            window.location.href = '/';
        }).fail(function(res) {
            window.location.href = '/login';
        });
        */

    });
});
