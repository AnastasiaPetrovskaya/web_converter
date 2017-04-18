$(document).ready(function() {
    console.log(tables_data);

    tables_data.forEach(function(table) {
        var fields = [],
            data = [];

        for (key in table.data[0]) {
            fields.push({ name: key, type: "text"});
        }
        //fields.push({type: 'text', name: 'table_title', editing: false, visible: false});
        fields.push({type: 'control'});

        /*table.data.map(function(el) {
            el.table_title = table.title;
            console.log('el', el);
        });*/


        console.log('data1', data);

        $('#' + table.title).jsGrid({
            width: "100%",
            height: "600px",
 
            editing: true,
            inserting: true,
            filtering: true,
            sorting: true,
            paging: true,
            pageSize: 15,
            pageButtonCount: 5,
            deleteConfirm: "Вы уерены, что хотите удалить данную запись из таблицы?",
 
            data: table.data,
            fields: fields,
            controller: {
                loadData : function(filter) {
                    console.log('filter', filter);
                    console.log('this.data', this.data);
                    //return {data: data, itemsCount: data.length };
                    return $.grep(table.data, function(td) {

                        var flag = true;

                        for (key in filter) {
                            if (filter[key] && typeof(td[key]) == "string" && 
                                td[key].indexOf(filter[key]) == -1) {
                                    flag = false;
                                    break;
                            } else if (filter[key] && typeof(td[key]) == "number" &&
                                td[key] != filter[key]) {
                                    flag = false;
                                    break;
                            }
                        }

                        return flag;
                    });
                },

                insertItem: function(item) {
                    //var d = $.Deferred();
                    console.log('item', item);
                    var options = {},
                        values = "",
                        columns = "";

                    for (key in item) {
                        columns += key + ",";
                        values += item[key] + ",";
                    }
                    values = values.slice(0, -1);
                    columns = columns.slice(0, -1);

                    var sql_query = 'INSERT INTO ' + table.title + ' (' + columns +
                            ') VALUES (' + values + ');';
                    console.log('sql_query', sql_query);

                    return true;
                    //$.post('/databases/sql_query/' + db_id, 
                }
            }
 
        });
    });
})
