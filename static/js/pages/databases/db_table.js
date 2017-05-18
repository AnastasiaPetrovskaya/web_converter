$(document).ready(function() {


    $('#databases_table').on('click', '#delete', function(event) {
        var db_id = $(this).parents('tr').attr('data-id');

        event.preventDefault();
        bootbox.confirm({
            title: '<i class="icon-trash2"></i> Вы уверены, что хотите удалить данную базу?',
            message: 'После удаления базы данных ее невозможно будет использовать.' +
                'Кроме того будут удалены тестовые вопросы, которые вы создавали для данной базы.',
            className: "slideInDown custom-bootbox",
            buttons: {
                confirm: {
                    label: "OK",
                    className: "btn-success"
                },
                cancel: {
                    label: " Отмена",
                    className: "btn-danger mr-1"
                }
            },
            callback: function(result){
                if (result) {
                    $.ajax('/databases/remove/' + db_id, {method: 'DELETE'})
                        .done(function(result) {
                            if (result.success){
                                var options = {};
                                getTable('/databases/table', options, '#databases_table', function() {});
                            }
                        })
                       .fail(function(result){});
                }
            }
        });
    });


    $('#databases_table').on('click', '#sql', function(event) {
        var db_id = $(this).parents('tr').attr('data-id');

        event.preventDefault();

        bootbox.dialog({
            title: 'SQL запрос к базе данных',
            message: $('#sql_query_modal').html(),
            //message: '<div id="sql_query_div"><col-lg-8.col-md-12><label for="sql_query_text"></label> <textarea style="width:100%" rows="5" placeholder="SELECT DISTINCT * FROM ...;" id="sql_query_text"></textarea></div>' +
            //    '<div id="sql_query_data"></div>',
            className: "slideInDown  custom-bootbox",
            size: 'large',
            buttons: {
                cancel: {
                    label: "Oтмена",
                    className: "btn-default mr-1"
                },
                execute_sql: {
                    label: "Выполнить SQL",
                    className: "btn-info",
                    callback: function() {
                        //TODO необходимо провалидировать input
                        var sql = $('.bootbox #sql_query_text').val();

                        $('.bootbox #sql_query_data').html('<div class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>');

                        var res = $.ajax({
                            type: 'POST',
                            url: '/databases/sql_query/' + db_id,
                            data: {'sql': sql},
                            async: false
                        }).responseText;
                        res = JSON.parse(res);

                        console.log(res);

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

                                $('.bootbox #sql_query_data').jsGrid({
                                    width: "100% !important",
 
                                    sorting: true,
                                    paging: true,
                                    pageSize: 15,
                                    pagerFormat: "Страницы: {pages}",
                                    pageButtonCount: 5,
                                    deleteConfirm: "Вы уерены, что хотите удалить данную запись из таблицы?",
 
                                    data: query_data,
                                    fields: fields,
                                    controller: {
                                        loadData : function(filter) {
                                            return $.grep(table.data, function(td) {
                                                var flag = true;
                                                var type = "";

                                                for (key in filter) {

                                                    fields.some(function(el) {
                                                        var res = false;

                                                        if (el.name == key) {
                                                            type = el.type;
                                                            res = true;
                                                        }

                                                        return res;
                                                    });

                                                    if (filter[key] && type == "text" && typeof(td[key]) == "string" && 
                                                        td[key].indexOf(filter[key]) == -1) {
                                                            flag = false;
                                                            break;
                                                    } else if (filter[key] && type == "text" && typeof(td[key]) == "number" &&
                                                        td[key] != filter[key]) {
                                                            flag = false;
                                                            break;
                                                    } else if  (filter[key] && type == "date" &&
                                                        moment(td[key]).format("YYYY-MM-DDTHH:mm:ss") != filter[key]) {
                                                            flag = false;
                                                            break;
                                                    }
                                                }

                                                return flag;
                                            });
                                        }
                                    }
                                });

                            } else {
                                $('.bootbox #sql_query_data').html('<p>Запрос не дал результатов</p>');
                            }

                            return false;
                        } else {
                            console.log(res);
                            bootboxError(res.error);
                            return false;
                        }









                    }
                }
            }
        });
    });


    $('#databases_table').on('click', '#schema', function(event) {

        event.preventDefault();
        bootbox.alert({
            title: 'Схема базы данных',
            message: '<div id="db_schema_div" class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>',
            className: "slideInDown largeWidth custom-bootbox",
            //size: 'large',
            buttons: {
                ok: {
                    label: "OK",
                    className: "btn-success"
                }
            }
        });

        $.get('/databases/schema/' + $(this).parents('tr').attr('data-id'), function(res) {
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
