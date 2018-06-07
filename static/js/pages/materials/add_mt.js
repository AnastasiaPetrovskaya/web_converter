$(document).ready(function(){
    $("#create_material_form").submit(function(event){
        console.log("submit event");

        event.preventDefault();

        var formData = new FormData();
        formData.append('mt', $('#mt_file')[0].files[0]); //имя файла
        formData.append('title', $('#mt_title').val()); //название
        formData.append('material_type', $('#mt_type').val()); //тип материала
        formData.append('text', $('#mt_text').val()); //комментарий
        formData.append('material_name', $('#mt_name').val()); //имя файла на сервере

        $('.modal #btn_submit').prop('disabled', true);
        $('.modal #btn_submit').html('<i class="icon-spinner spinner"></i>');

        var res = $.ajax({
            url: '/materials/add',
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
            $("#mt_2_psql").modal('hide');
            //$('#mdb_2_psql').modal('toggle');
            //alert('success');
            bootbox.alert({
                message: "Новый материал успешно создан",
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
                    getTable('/materials/table', options, '#materials', function() {});
                }
            });
        } else {
            console.log('res', res);
            bootboxError('Ошибка добавления нового материала. ' + res.error);
        }



        /*    $.post('/databases/add', data).done(function() {
                window.location.href = '/';
            }).fail(function(res) {
                window.location.href = '/login';
            });
            */

    });
});
