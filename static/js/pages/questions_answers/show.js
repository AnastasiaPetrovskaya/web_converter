$(document).ready(function() {
    // TODO partner_id объявлен в шаблоне!

    $('#schema_card ').innerHeight($('#info_card ').innerHeight());

    $('#recheck').click(function() {
        $.ajax({
            type: 'POST',
            url: '/questions_answers/recheck/' + question_answer_id,
            async: false
        }).done(function(res) {
            if (res.success) {
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
                bootboxError(res.error);
                return false;
            }
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


    $('#edit').click(function() {
        var $this = $(this);

        if ($this.attr('data-edit') === 'enable') {
            //off
            $this.removeClass('active');
            $this.attr('data-edit', 'disable');
        } else {
            //on
            $this.addClass('active');
            $this.attr('data-edit', 'enable');
        }

        $editable.editable('toggleDisabled');
        //$balance.editable('toggleDisabled');

    });


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



    if (window.right_answer_data) {

       if (right_answer_data.length > 0) {
           var fields = [],
               query_data = right_answer_data;

           for (key in query_data[0]) {
               if (key.toLowerCase().indexOf('id') != -1 || key.toLowerCase().indexOf('ид') != -1)
                   fields.push({ name: key, type: "text", editing: false});
               else if (key.toLowerCase().indexOf('date') != -1 || key.toLowerCase().indexOf('дата') != -1)
                   fields.push({ name: key, type: "date"});
               else
                   fields.push({ name: key, type: "text"});
           }

           $('#sql_right_answer_data').jsGrid({
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
           $('#sql_right_answer_data').val('Запрос не дал результатов');
       }
    };


    if (window.answer_data) {

       if (answer_data.length > 0) {
           var fields = [],
               query_data = answer_data;

           for (key in query_data[0]) {
               if (key.toLowerCase().indexOf('id') != -1 || key.toLowerCase().indexOf('ид') != -1)
                   fields.push({ name: key, type: "text", editing: false});
               else if (key.toLowerCase().indexOf('date') != -1 || key.toLowerCase().indexOf('дата') != -1)
                   fields.push({ name: key, type: "date"});
               else
                   fields.push({ name: key, type: "text"});
           }

           $('#sql_answer_data').jsGrid({
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
           $('#sql_answer_data').val('Запрос не дал результатов');
       }
    };


});
