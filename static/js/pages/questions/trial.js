$(document).ready(function() {
    // TODO partner_id объявлен в шаблоне!

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

    $("#sql_right_answer_btn").click(function() {
        $('#sql_right_answer_card').show();
        get_sql_res(db_id, sql_answer, '#sql_right_answer_data');
    });

    $("#add_table").click(function() {
        var title = $('#help_table_title').val();

        //TODO более серьъезная валидация + отображение сообщения если что-то не так
        if (title == "") 
            return false;

       $('#help_tables').removeClass('hidden-xs-up');



        var new_table_block = $("#new_help_table").html();
        //new_table_block.find("name=title").text(title);
        $("#help_tables_container").find('hr:last').removeClass('hidden-xs-up');
        $("#help_tables_container").append(new_table_block);
        $("#help_tables_container").find('form:last').find('[name="title"] strong').text(title);
    });

    $('#help_tables_container').on('click', '#delete_help_table', function() {
        $(this).parents('form').remove();
    });



    $("#answer").submit(function(event) {
        event.preventDefault();

        console.log("submit event");
        var queries = [],
            query_item = {};

        $("#help_tables_container").find($("form")).each(function () {
            query_item = {
                title: $(this).find('[name="title"] strong').text(),
                alias: $(this).find('[name="alias"]').val(),
                target_list: $(this).find('[name="target_list"]').val(),
                text: $(this).find('[name="text"]').val(),
                description: $(this).find('[name="description"]').val()
            }
            queries.push(query_item);
        });

        query_item = {
            title: 'result',
            alias: $('#alias').val(),
            target_list: $('#target_list').val(),
            text: $('#text').val(),
            description: $('#description').text(),
        }
        queries.push(query_item);

        //var target_query = $(this).serialize();
        var data = {
            question_id: question_id,
            db_id: db_id,
            queries: JSON.stringify(queries)
        };

        $('#submit').prop('disabled', true);
        $('#submit').html('<i class="icon-spinner12"></i>');

        var res = $.ajax({
            type: 'POST',
            url: '/questions/trial',
            //contentType: "application/json; charset=utf-8",
            //dataType: "json",
            data: data,
            async: false
        }).responseText;
        res = JSON.parse(res);

        event.preventDefault();
        console.log(res);

        //return false;

        if (res.success) {
            $('#sql_answer_card').show();
            show_sql_res(res.answer_sql, '#sql_answer_text', res.answer_data, '#sql_answer_data');
            if (res.right_answer_data && res.right_answer_sql) {
                $('#sql_right_answer_card').show();
                show_sql_res(res.right_answer_sql, '#sql_right_answer_text', res.right_answer_data, '#sql_right_answer_data');
            }


            if (res.mark > 0) {
                bootbox.dialog({
                    className: 'slideInDown success mb-2',
                    onEscape: true,
                    backdrop: true,
                    message: 'Правильный ответ!',
                    buttons: {}
                });
            } else {
                var msg = 'Неправильный ответ! ';
                if (res.comment) {
                    msg += res.comment;
                }

                bootbox.dialog({
                    className: 'slideInDown fail mb-2',
                    onEscape: true,
                    backdrop: true,
                    message: msg,
                    buttons: {}
                });
            }
        } else {
            console.log(res);
            //$successButton.html(lang.add).prop('disabled', false);
            bootboxError(res.error);
            return false;
        }
    });


    var show_sql_res = function(sql, sql_selector, rows, rows_selector) {
        $(sql_selector).text(sql);

       if (rows.length > 0) {
           var fields = [],
               query_data = rows;

           for (key in query_data[0]) {
               if (key.toLowerCase().indexOf('id') != -1 || key.toLowerCase().indexOf('ид') != -1)
                   fields.push({ name: key, type: "text", editing: false});
               else if (key.toLowerCase().indexOf('date') != -1 || key.toLowerCase().indexOf('дата') != -1)
                   fields.push({ name: key, type: "date"});
               else
                   fields.push({ name: key, type: "text"});
           }

           $(rows_selector).jsGrid({
               width: "100%",
               sorting: true,
               paging: true,
               pageSize: 15,
               pageButtonCount: 5,
               pagerFormat: "Страницы: {pages}",
               data: query_data,
               fields: fields,
           });

       } else {
           $(rows_selector).val('Запрос не дал результатов');
       }
    };



});
