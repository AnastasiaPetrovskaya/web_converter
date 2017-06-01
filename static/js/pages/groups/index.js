$(document).ready(function() {

    $("#create_group_from").submit(function(event){
        //console.log("submit event");

        event.preventDefault();

        var data = $(this).serialize();

        $('.modal #btn_submit').prop('disabled', true);
        $('.modal #btn_submit').html('<i class="icon-spinner spinner"></i>');

        var res = $.ajax({
            url: '/groups/add',
            type: 'POST',
            data: data,
            async: false,
            processData: false,
        }).responseText;

        res = JSON.parse(res);
        $('#btn_submit').prop('disabled', false);
        $('#btn_submit').html('Создать');

        if (res.success) {
            $("#create_group_from").modal('hide');
            //$('#mdb_2_psql').modal('toggle'); 
            //alert('success');
            bootbox.alert({
                message: "Новая группа успешно создана",
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
                    getTable('/groups/table', options, '#groups_table', function() {});
                }
            });
        } else {
            console.log('res', res);
            bootboxError('Ошибка добавления новой группы. ' + res.error);
        }

    });

});
