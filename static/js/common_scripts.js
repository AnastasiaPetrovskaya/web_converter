var getTable = function(url, options, selector, callback) {
    console.log('url', url, options);

    $.ajax({
        type: 'GET',
        url: url,
        data: options,
        success: function(res) {
            $(selector).html(res);
            if (callback)
                callback(res);
        },
        fail: function(err) {
            console.log(err);
        }
    });
};

var get_sql_res = function(db_id, sql, selector, callback) {
    $(selector).html('<div class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>');

    var res = $.ajax({
        type: 'POST',
        url: '/databases/sql_query/' + db_id,
        data: {'sql': sql},
        async: false
    }).responseText;
    res = JSON.parse(res);

    console.log(res);

    if (res.success) {
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

            $(selector).jsGrid({
                width: "100%",
                //height: "600px",
 
                //editing: true,
                //inserting: true,
                //filtering: true,
                sorting: true,
                paging: true,
                pageSize: 15,
                pageButtonCount: 5,
                pagerFormat: "Страницы: {pages}",
                deleteConfirm: "Вы уерены, что хотите удалить данную запись из таблицы?",
 
                data: query_data,
                fields: fields,
                controller: {
                    loadData : function(filter) {
                        //console.log('filter', filter);
                        //console.log('this.data', this.data);

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
            $('selector').val('Запрос не дал результатов');
        }
    } else {
        console.log(res);
        $(selector).html('<div class="text-xs-center">' + res.error + '</div>');
        //$successButton.html(lang.add).prop('disabled', false);
        bootboxError(res.error);
        return false;
    }
};


var bootboxError = function(err) {
    bootbox.alert({
        className: 'slideInDown',
        title: 'Ошибка',
        message: err.message ? err.message : err,
        buttons: {ok: {className: 'btn-danger'}}
    });
};

// codes works on all bootstrap modal windows in application
$('.modal').on('hidden.bs.modal', function(e)
{ 
    $(this).find("input,textarea,select").val('').end();
    $(this).find(".form-group").removeClass('validate').end();
    $(this).find(".form-group").removeClass('error').end();
    $(this).find(".form-group").removeClass('issue').end();
    $(this).find('#submit').prop('disabled', false);
}) ;

$.fn.editableform.buttons = 
  '<button type="submit" class="btn btn-in-table btn-outline-success btn-sm editable-submit">'+
    '<i class="icon-check font-medium-2"></i>'+
  '</button>'+
  '<button type="button" class="btn btn-in-table btn-outline-secondary btn-sm editable-cancel">'+
    '<i class="icon-remove font-medium-2"></i>'+
  '</button>';
