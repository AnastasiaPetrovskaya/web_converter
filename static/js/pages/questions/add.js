$(document).ready(function(){
    $("#new_question").submit(function(event){
        console.log("submit event");

        event.preventDefault();
        console.log('1', $(this).serialize);
        console.log('2', $(this).serializeArray);
        var data = $(this).serialize();


        $('#mdb_submit').prop('disabled', true);
        $('#mdb_submit').html('<i class="icon-spinner12"></i>');


        var res = $.ajax({
            type: 'POST',
            url: '/questions/add',
            data: data,
            async: false
        }).responseText;
        res = JSON.parse(res);

        console.log(res);

        if (res.success) {
            bootbox.dialog({
                className: 'slideInDown',
                message: 'Вопрос' + '<a class="alert-link" href="/questions/' + res.id + '"> "' + res.title + '"</a> ' + ' добавлен' +
                '<p>' + '</p>',
                buttons: { 
                    'back_to_list': {
                        label: 'Вернутся к списку вопросов',
                        className: 'btn-default mr-1',
                        callback: function() { window.location.assign('/questions'); }
                    },
                    'create_new_one': {
                        label: 'Создать еще один',
                        className: 'btn-success',
                        callback: function() { window.location.reload(); }
                    }
                }

            });
        } else {
            console.log(res);
            //$successButton.html(lang.add).prop('disabled', false);
            bootboxError(res.error);
            return false;
        }
    });

    $("#db_id").change(function() {
        console.log($(this).val());
        $('#db_schema_div').html('<div id="db_schema_div" class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>');

        $.get('/databases/schema/' + $(this).val(), function(res) {
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

    $("#sql_answer_btn").change(function() {
        console.log($(this).val());
        var db_id = $('#db_id').val(),
            sql = $('#sql_answer').val();

        $('#sql_answer_div').html('<div id="db_schema_div" class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>');


        var res = $.ajax({
            type: 'POST',
            url: '/databases/sql_query/' + db_id,
            data: {'sql': sql},
            async: false
        }).responseText;
        res = JSON.parse(res);

        console.log(res);

        if (res.success) {
            bootbox.dialog({
                className: 'slideInDown',
                message: 'Вопрос' + '<a class="alert-link" href="/questions/' + res.id + '"> "' + res.title + '"</a> ' + ' добавлен' +
                '<p>' + '</p>',
                buttons: { 
                    'back_to_list': {
                        label: 'Вернутся к списку вопросов',
                        className: 'btn-default mr-1',
                        callback: function() { window.location.assign('/questions'); }
                    },
                    'create_new_one': {
                        label: 'Создать еще один',
                        className: 'btn-success',
                        callback: function() { window.location.reload(); }
                    }
                }

            });
        } else {
            console.log(res);
            //$successButton.html(lang.add).prop('disabled', false);
            bootboxError(res.error);
            return false;
        }



        $.get('/databases/schema/' + $(this).val(), function(res) {
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
});
