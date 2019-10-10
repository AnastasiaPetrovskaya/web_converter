$(document).ready(function() {
    getTable('/questions/table', { db_id: window.db_id }, '#questions_table', function() {});

    $('#schema_card ').innerHeight($('#info_card ').innerHeight());
    /*$('#schema_card a[data-action="expand"]').click(function(e) {
        $('#schema_card .card-body').innerHeight("auto");
    });*/


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


    $('#sql').click(function(event) {
        var db_id = window.db_id;

        event.preventDefault();
        //TODO необходимо провалидировать input
        var sql = $('#sql_query_text').val();

        $('#sql_query_data').html('<div class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>');

        var res = $.ajax({
            type: 'POST',
            url: '/databases/sql_query/' + db_id,
            data: {'sql': sql},
            async: false
        }).responseText;
        res = JSON.parse(res);

        //console.log(res);

        if (res.success) {
            $('#sql_query_text').val(res.data.sql);
            if (res.data.result.rows.length > 0) {

                var fields = [],
                    query_data = res.data.result.rows;

                for (key in query_data[0]) {
                    if (key.toLowerCase().indexOf('id') != -1 || key.toLowerCase().indexOf('ид') != -1)
                        fields.push({ name: key, type: "text", editing: false});
                    else if (key.toLowerCase().indexOf('date') != -1 || key.toLowerCase().indexOf('дата') != -1)
                        fields.push({ name: key, type: "date"});
                    else
                        fields.push({ name: key, type: "text"});
                }
                //fields.push({type: 'control'});

                $('#sql_query_data').jsGrid({
                    width: "100% !important",
 
                    sorting: true,
                    paging: true,
                    pageSize: 15,
                    pagerFormat: "Страницы: {pages}",
                    pageButtonCount: 5,
                    deleteConfirm: "Вы уерены, что хотите удалить данную запись из таблицы?",
 
                    data: query_data,
                    fields: fields,
                });

              } else {
                  $('#sql_query_data').html('<p>Запрос не дал результатов</p>');
              }

        } else {
            console.log(res);
            bootboxError(res.error);
            return false;
        }

    });


});
