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

        $('.modal #btn_submit').prop('disabled', true);
        $('.modal #btn_submit').html('<i class="icon-spinner spinner"></i>');

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
        $('#btn_submit').prop('disabled', false);
        $('#btn_submit').html('Создать');

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
