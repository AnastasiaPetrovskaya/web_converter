$(document).ready(function() {

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

        var queries = [],
            query_item = {};

        $("#help_tables_container").find($("form")).each(function () {
            query_item = {
                title: $(this).find('[name="title"] strong').text(),
                alias: $(this).find('[name="alias"]').val(),
                target_list: $(this).find('[name="target_list"]').val(),
                query_body: $(this).find('[name="text"]').val(),
                description: $(this).find('[name="description"]').val()
            }
            queries.push(query_item);
        });

        query_item = {
            title: 'result',
            alias: $('#alias').val(),
            target_list: $('#target_list').val(),
            query_body: $('#text').val(),
            description: $('#description').text(),
        }
        queries.push(query_item);

        //var target_query = $(this).serialize();
        var data = {
            check_point_id: check_point_id,
            question_id: question_id,
            db_id: db_id,
            queries: JSON.stringify(queries)
        };

        $('#submit').prop('disabled', true);
        $('#submit').html('<i class="icon-spinner12"></i>');

        $.ajax({
            url: '/questions_answers/make',
            method: 'POST',
            data: data
        }).done(result => {
            console.log('result', result)
            if(result.success){
                window.location.assign('/check_points/next_question/' + check_point_id);
            } else {
                bootboxError(result.error, function() {
                    window.location.assign('/check_points/next_question/' + check_point_id);
                };);
                return false;
            }
        }).fail(res => {
            console.log('Error in AJAX make: ', res);
            bootboxError(res.statusText);
        });

        //
        // var res = $.ajax({
        //     type: 'POST',
        //     url: '/questions_answers/make',
        //     //contentType: "application/json; charset=utf-8",
        //     //dataType: "json",
        //     data: data,
        //     async: false
        // }).responseText;
        //
        // console.log('POST result : ', res);
        // //res = JSON.parse(res);
        //
        //
        // //window.location.assign('/check_points/next_question/' + check_point_id);
        //

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
