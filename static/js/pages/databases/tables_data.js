$(document).ready(function() {
    console.log(tables_data);

    tables_data.forEach(function(table) {
        var fields = [],
            data = [];

        for (key in table.data[0]) {
            fields.push({ name: key, type: "text"});
        }
        fields.push({type: 'control'});

       /* table.data.map(function(el) {
            console.log('el', el);
            var row = {};
            for (var key in el) {
                console.log('key', key);
            }
            data.push(el[key]);
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
                }
            }
 
        });
    });
})
