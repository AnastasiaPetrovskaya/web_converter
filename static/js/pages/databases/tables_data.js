$(document).ready(function() {
    //console.log(tables_data);

    tables_data.forEach(function(table) {
        var fields = [],
            data = [];

        for (key in table.data[0]) {
            if (key.toLowerCase().indexOf('id') != -1 || key.toLowerCase().indexOf('ид') != -1)
                fields.push({ name: key, type: "text", editing: false});
            else if (key.toLowerCase().indexOf('date') != -1 || key.toLowerCase().indexOf('дата') != -1)
                fields.push({ name: key, type: "date"});
            else
                fields.push({ name: key, type: "text"});
        }
        fields.push({type: 'control'});

        $('.' + table.title).jsGrid({
            width: "100%",
            //height: "600px",
 
            editing: true,
            inserting: true,
            filtering: true,
            sorting: true,
            paging: true,
            pageSize: 15,
            pageButtonCount: 5,
            pagerFormat: "Страницы: {pages}",
            deleteConfirm: "Вы уерены, что хотите удалить данную запись из таблицы?",
 
            data: table.data,
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
                },

                insertItem: function(item) {
                    //console.log('item', item);
                    var options = {},
                        values = "",
                        columns = "";

                    for (key in item) {
                        columns += key + ",";
                        values += "'" + item[key] + "',";
                    }
                    values = values.slice(0, -1);
                    columns = columns.slice(0, -1);

                    var sql_query = 'INSERT INTO ' + table.title + ' (' + columns +
                            ') VALUES (' + values + ');';
                    //console.log('sql_query', sql_query);

                    //отправка на сервер
                    var d = $.Deferred();

                    var res = $.ajax({
                        url: "/databases/sql_query/" + db_id,
                        dataType: "json",
                        method: 'POST',
                        data: {sql: sql_query},
                        async: false
                    }).responseText;
                    res = JSON.parse(res);

                    if (res.success) {
                        //console.log('response', res);
                        d.resolve();
                    } else {
                        console.log('err', res.err);
                        d.reject(res.err);
                    }
                    return d.promise();
                },

                updateItem: function(item) {
                    //console.log('item', item);
                    var options = {},
                        condition = "",
                        new_values = "";

                    for (key in item) {
                        if (key.toLowerCase().indexOf('id') != -1 || key.toLowerCase().indexOf('ид') != -1)
                            condition += key + "='" + item[key] + "' AND ";
                        else
                            new_values += key + "='" + item[key] + "' , ";
                    }
                    condition = condition.slice(0, -4);
                    new_values = new_values.slice(0, -2);


                    var sql_query = 'UPDATE  ' + table.title +' SET ' + new_values + ' WHERE ' + condition + ';';
                    //console.log('sql_query', sql_query);

                    //отправка на сервер
                    var d = $.Deferred();
                    var res = $.ajax({
                        url: "/databases/sql_query/" + db_id,
                        dataType: "json",
                        method: 'POST',
                        data: {sql: sql_query},
                        async: false
                    }).responseText;
                    res = JSON.parse(res);

                    if (res.success) {
                        //console.log('response', res);
                        d.resolve();
                    } else {
                        //console.log('err', res.err);
                        d.reject(res.err);
                    }
                    return d.promise();

                },

                deleteItem: function(item) {
                    //console.log('item', item);
                    var options = {},
                        condition = "";

                    for (key in item) {
                        condition += key + "='" + item[key] + "' AND ";
                    }
                    condition = condition.slice(0, -4);

                    var sql_query = 'DELETE FROM ' + table.title + ' WHERE ' + condition + ';';
                    //console.log('sql_query', sql_query);

                    //отправка на сервер
                    var d = $.Deferred();
                    var res = $.ajax({
                        url: "/databases/sql_query/" + db_id,
                        dataType: "json",
                        method: 'POST',
                        data: {sql: sql_query},
                        async: false
                    }).responseText;
                    res = JSON.parse(res);

                    if (res.success) {
                        //console.log('response', res);
                        d.resolve();
                    } else {
                        //console.log('err', res.err);
                        d.reject(res.err);
                    }
                    return d.promise();
                }
            }
        });
    });

    //для вкладок
    //#TODO отображение данных таблиц в виде вкладок
    //$( "#jsGrid" ).find( "table.jsgrid-table" ).removeAttr('style');
    //$( "#jsGrid" ).find( "table.jsgrid-table" ).css('style', '100%');
})
