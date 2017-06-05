$(document).ready(function() {

    $("#create_student_from").submit(function(event){
        //console.log("submit event");

        event.preventDefault();

        //var data = $(this).serialize();
        var data = {};
        data.student_data = {
            group_id: $(this).find('[name="group_id"]').val()
        };
        data.user_data = {
            name: $(this).find('[name="name"]').val(),
            phone: $(this).find('[name="phone"]').val(),
            email: $(this).find('[name="email"]').val(),
            login: $(this).find('[name="login"]').val(),
            password: $(this).find('[name="password"]').val()
        };


        $('.modal #btn_submit').prop('disabled', true);
        $('.modal #btn_submit').html('<i class="icon-spinner spinner"></i>');

        var res = $.ajax({
            url: '/students/add',
            type: 'POST',
            data: data,
            async: false,
            dataType: 'json'
            //processData: false,
        }).responseText;

        res = JSON.parse(res);
        $('#btn_submit').prop('disabled', false);
        $('#btn_submit').html('Создать');

        if (res.success) {
            $("#create_group_modal").modal('hide');
            bootbox.alert({
                message: "Новый студент успешно добавлен.",
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
                    getTable('/students/table', options, '#students_table', function() {});
                }
            });
        } else {
            console.log('res', res);
            bootboxError('Ошибка добавления новой группы. ' + res.error);
        }

    });

});
