var TupleCalculusQuery = require('./TupleCalculusQuery.js');
var os = require("os");

//
function TupleQueries (queries_array) {
    this.queries = queries_array;               //Ответ студента на вопрос

    var help_tables = [];                       //Массив названий вспомогательных таблиц, которые ввел студент.
    if (queries_array.length > 1) {
        queries_array.map(query => {
            if (query.title != 'result')
        help_tables.push(query.title);
    });
    }
    this.help_tables = help_tables;
}


/*Cравнивает результат выполнения правильного SQL запроса и последовательности, сгенерированной предыдущим методом.

Возвращаемое значение — оценка 0 или 1. (1 — результаты совпали, 0 — нет)*/

TupleQueries.prototype.check = function() {
        //console.log('this', this);
    var mark = {mark: 5, comment: ""};

    if (!this.answer_data || !this.right_answer_data) {
        mark = {
            mark: 0,
            comment: 'Ошибка в сравнении выборки данных, ' +
                'полученной в результате выполнения эталонного ответа, ' + 
                'и выборки, полученной в результате выполнения ' +
                'SQL, который был сгенерирован из ответа на исчислении кортежей. ' +
                'Одну из выборок (или обе) не удалось получить или она пуста.'
        };
    } else {
        //TODO перед сравнением стоит отсортировать массивы и объекты массивов

        if (this.answer_data.length != this.right_answer_data.length) {
            mark = {
                mark: 0, 
                comment: 'Количество строк в выборке данных, ' +
                    'полученной в результате выполнения эталонного ответа, ' + 
                    'не совпало с количеством строк в выборке, полученной в результате выполнения ' +
                    'SQL, который был сгенерирован из ответа на исчислении кортежей.'
            };
        } else {
            this.right_answer_data.every(function(row, row_index) {
                //console.log('row', JSON.stringify(row));
                //console.log('row', JSON.stringify(this.teacher_rows[row_index]));

                if (!this.answer_data.contains(row)) {
                    mark = {
                        mark: 0, 
                        comment: 'Ошибка в сравнении выборки данных, ' +
                            'полученной в результате выполнения эталонного ответа, ' + 
                            'и выборки, полученной в результате выполнения ' +
                            'SQL, который был сгенерирован из ответа на исчислении кортежей. ' +
                            'Строка, присутствующая в первой, отсутствует во второй.'
                    };
                    return false;
                }

                //if (JSON.stringify(row) != JSON.stringify(this.teacher_rows[row_index])) {
                //    mark = {mark: 0, comment: ""};
                //    return false;
                //}
            }.bind(this));
        }
    }

    return mark;
}

Array.prototype.contains = function(obj) {
    if (this.some(function(elem) {return (JSON.stringify(elem) == JSON.stringify(obj))})) {
        return true;
    } else {
        return false;
    }
}


TupleQueries.prototype.create_sql_script = function() {           //Данный метод формирует последовательность SQL запросов — осуществляет необходимы замены на SELECT INTO
    return new Promise(function(resolve, reject) {

        Promise.all(this.queries.map(convert_to_sql))
            .then(function(result) {

                var sql = "";

                this.queries.forEach(function(query, index, array) {
                    if (index != array.length -1) {
                        var from_pos = query.sql.indexOf("FROM");
                        sql += query.sql.substring(0, from_pos - 1) +
                            " INTO TEMP " + query.title + " " +
                            query.sql.substring(from_pos - 1) + os.EOL + os.EOL;

                    } else {
                        sql += query.sql;
                    }
                });




                //console.log('result sql script', sql);

                resolve(sql);
            }.bind(this)).catch(function(err) {
                console.log('err', err);
                reject(err);
            });
    }.bind(this));
}


function convert_to_sql(query_object) {
    var query = new TupleCalculusQuery(query_object);

    return new Promise(function(resolve, reject) {
        query.make_sql()
            .then(function() {
                query_object.processed_query_body = query.query_body;
                query_object.sql = query.sql;
                var q=query.sql;
                resolve();
            }).catch(function(err) {
                reject(err);
            });
    });
}


module.exports = TupleQueries;