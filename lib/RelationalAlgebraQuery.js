var os = require("os");

function RelationalAlgebraQuery (query_object) {

    this.title = query_object.title;
    this.alias = query_object.alias;
    this.target_list = query_object.target_list;
    this.query_body = query_object.query_body;
    this.description = query_object.description || "";
    this.sql = "";

    //вспомогательные поля
    //таблицы, атрибуты которых попали в целевой список
    this.outer_tables = [];
    //неделимые с точки зрения формирования where элементы
    this.where_elements = [];
    this.tables_multiplication = [];
}

//get last element of array;
Array.prototype.last = function(){
    return this[this.length - 1];
};

//get last element of array;
Array.prototype.includes = function(element) {
    if (this.indexOf(element) != -1)
        return true;
    else
        return false;
};

function only_unique(element, index, array) { 
    return array.indexOf(element) === index;
};

function get_outer_where(inner_tables_arr, element) {
    var flag = true;

    //ищем в элементе наличие таблиц, которые не вошли во внешний select
    inner_tables_arr.forEach(function(el) {
        if (element.indexOf(el + "." ) != -1) {
            flag = false;
            //break;
        }
    });
    return flag;
};

function make_simple_select(select, from, where, distinct) {
    var distinct = distinct || "";

    return "SELECT " + distinct + select + " FROM " + from + 
        (where ? " WHERE " + where : "");
};

RelationalAlgebraQuery.prototype.convert = function() {

    //убрать все пробелы и переносы строк
    //сначала замена пробелов в литералах - временный kostil
    var re = /[\"|\'][.\,-_\@\?!\:\$ a-zA-Z0-9А-Яа-я()]+[\"|\']/;
    if (re.test(this.query_body)) {
        this.query_body = this.query_body.replace(re, replacer_literals);
    }

    this.query_body.replace(/\s/g,'')

    //классификация запроса по признаку вхождения
    //теоретико-множественных операций
    return new Promise(function(resolve, reject) {
        if (this.query_body.indexOf(":") != -1) {
            //есть деление
            this.division_transformation()
                .then(function(res) {
                    this.sql = make_beautifull_sql(res);
                    resolve();
                }.bind(this)).catch(function(err) {
                    reject(err);
                });

        } else if (this.query_body.indexOf("UNION") != -1) {
            //есть объединение
            this.union_transformation()
                .then(function(res) {
                    this.sql = make_beautifull_sql(res);
                    resolve();
                }.bind(this)).catch(function(err) {
                    reject(err);
                });

        } else if (this.query_body.indexOf("EXCEPT") != -1) {
            //есть вычитание
            this.except_intersect_transformation(0)
                .then(function(res) {
                    //console.log('res', res);
                    this.sql = make_beautifull_sql(res);
                    resolve();
                }.bind(this)).catch(function(err) {
                    reject(err);
                });
        } else if (this.query_body.indexOf("INTERSECT") != -1) {
            //есть пересечение
            this.except_intersect_transformation(1)
                .then(function(res) {
                    //console.log('res', res);
                    this.sql = make_beautifull_sql(res);
                    resolve();
                }.bind(this)).catch(function(err) {
                    reject(err);
                });
        } else {
            //иначе обычный запрос
            this.make_sql()
                .then(function(res) {
                    //console.log('res', res);
                    this.sql = make_beautifull_sql(res) + ";";
                    resolve();
                }.bind(this)).catch(function(err) {
                    reject(err);
                });
        }
    }.bind(this));
}


function replacer_literals(match) {
    return match.replace(/\s/g,'secret235');
}

function make_beautifull_sql(sql) {
    //возвращаем пробелы в литералах
    var query = sql.replace(/secret235/g,' ');

    // добавление переводов строк
    query = query.replace(/\(SELECT/g, os.EOL + "$&" + " ");
    query = query.replace(/FROM/g, os.EOL + "$&" + " ");
    query = query.replace(/WHERE/g, os.EOL + "$&" + " ");

    query = query.replace(/AS/g, " " + "$&" + " ");
    query = query.replace(/AND/g, " " + "$&" + " ");
    query = query.replace(/OR/g, " " + "$&" + " ");

    query = query.replace(/  /g, " ");
    query = query.replace(/\"/g, "'");

    return query;
}

//если есть OR не заключенный в скобки, то все ыражение заключаем в скобки
function add_brackets(condition) {
    var cnt = 0;
    for (var i = 0, len = condition.length; i < len -1 ; i++) {
        if (condition.substr(i,1) == "(") {
            cnt++;
        } else if (condition.substr(i,1) == ")") {
            cnt--;
        }

        if (cnt == 0 && condition.substr(i, 2) == "OR" ) { //налши искомое
            condition = "(" + condition + ")";
            break;
        }
    }

    return condition;
}


//обработка запроса с union
RelationalAlgebraQuery.prototype.union_transformation = function() {
    return new Promise(function(resolve, reject) {

        //выделение операндов по регулярному выражению
        var re = /^\((\(.*\))UNION(\(.*\))\)$/;
        if (!re.test(this.query_body)) {
            console.log('err1')
            reject(new Error("Запрос операцией объединения не соответствует необходимому шаблону"));
        }
        var result = re.exec(this.query_body);

        var left_operand = new RelationalAlgebraQuery({
            title: '',
            alias: this.alias,
            target_list: '',
            query_body: result[1]
        });
        var right_operand = new RelationalAlgebraQuery({
            title: '',
            alias: this.alias,
            target_list: '',
            query_body: result[2]
        });
        //console.log('leftOperand', left_operand);
        //console.log('rightOperand', right_operand);

        var ctx = {};
        left_operand.proection_transformation()
            .then(function(proection) {
                //console.log('proection_left' , proection);
                ctx.left_proection = proection.split(",");
                left_operand.target_list = proection;

                return right_operand.proection_transformation();
            }).then(function(proection) {
                //console.log('proection' , proection);
                ctx.right_proection = proection.split(",");
                right_operand.target_list = proection;

                if (ctx.right_proection.length != ctx.left_proection.length ||
                    ctx.right_proection.length == 0 || ctx.left_proection.length == 0) {
                        reject(new Error('Для каждого операнда теоретико-множественных операций '+
                            'самой внешней операцией должна являться проекция. ' + 
                            'При этом теоретико-множественныe операцим могут выполняться ' +
                            'только над структурно идентичными отношениями'));
                }

                return left_operand.make_sql();
            }).then(function(res) {
                //console.log('left operand res', res);
                ctx.left = res;
                return right_operand.make_sql();
            }).then(function(res) {
                //console.log('right operand res', res);
                ctx.right = res;
                var sql = "(" + ctx.left + ") UNION (" + ctx.right + ");";
                resolve(sql);
            }).catch(function(err) {
                reject(err);
            });
    }.bind(this));
}


//обработка запроса с except и intersect
//param type - 0 - except || 1 - intersect
RelationalAlgebraQuery.prototype.except_intersect_transformation = function(type) {
    return new Promise(function(resolve, reject) {

        //выделение операндов по регулярному выражению
        var re;
        if (type == 0)
            re = /^\((\(.*\))EXCEPT(\(.*\))\)$/;
        else
            re = /^\((\(.*\))INTERSECT(\(.*\))\)$/;

        if (!re.test(this.query_body)) {
            console.log('err1')
            reject(new Error("Запрос c операцией вычитания не соответствует необходимому шаблону"));
        }
        var result = re.exec(this.query_body);

        var left_operand = new RelationalAlgebraQuery({
            title: '',
            alias: this.alias,
            target_list: this.target_list,
            query_body: result[1]
        });
        var right_operand = new RelationalAlgebraQuery({
            title: '',
            alias: this.alias,
            target_list: '',
            query_body: result[2]
        });
        //console.log('leftOperand', left_operand);
        //console.log('rightOperand', right_operand);

        var ctx = {};
        left_operand.proection_transformation()
            .then(function(proection) {
                //console.log('proection_left' , proection);
                ctx.left_proection = proection.split(",");

                return right_operand.proection_transformation();
            }).then(function(proection) {
                //console.log('proection' , proection);
                ctx.right_proection = proection.split(",");

                if (ctx.right_proection.length != ctx.left_proection.length ||
                    ctx.right_proection.length == 0 || ctx.left_proection.length == 0) {
                        reject(new Error('Для каждого операнда теоретико-множественных операций '+
                            'самой внешней операцией должна являться проекция. ' + 
                            'При этом теоретико-множественныe операцим могут выполняться ' +
                            'только над структурно идентичными отношениями'));
                }

                ctx.except_condition = "";
                ctx.left_proection.forEach(function(element, index) {
                    ctx.except_condition += element + "=" + ctx.right_proection[index] + "AND"
                });

                ctx.except_condition = ctx.except_condition.slice(0, -3);
                //console.log('ctx.except_condition', ctx.except_condition);

                //? надо ли?
                //right_operand.target_list = proection;

                return left_operand.make_sql()
            }).then(function(res) {
                //console.log('left operand res', res);
                ctx.left = res;
                return right_operand.make_sql();
            }).then(function(res) {
                //console.log('right operand res', res);
                ctx.right = res;

                //сбор итогового sql
                var sql = ctx.left;
                var finish = "";
                var where_position = ctx.left.lastIndexOf('WHERE');
                var select_position = ctx.left.lastIndexOf('SELECT')

                if (where_position == -1) {

                    finish = ")";
                    if (type == 0)
                        sql += 'WHERE NOT EXISTS (';
                    if (type == 1)
                        sql += 'WHERE EXISTS (';
                } else if (where_position != -1 && select_position == 0) {

                    finish = ")";
                    if (type == 0)
                        sql += 'AND NOT EXISTS (';
                    if (type == 1)
                        sql += 'AND EXISTS (';
                } else if (where_position > select_position && select_position != 0) {
                    sql = sql.slice(0, -1);
                    finish = "))";
                    if (type == 0)
                        sql += 'AND NOT EXISTS (';
                    if (type == 1)
                        sql += 'AND EXISTS (';
                } else if (where_position < select_position && select_position != 0) {
                    //вообще быть такого не должно, но пусть
                    sql = sql.slice(0, -1);
                    finish = "))";
                    if (type == 0)
                        sql += 'WHERE NOT EXISTS (';
                    if (type == 1)
                        sql += 'WHERE EXISTS (';
                }

                sql += ctx.right;
                where_position = ctx.right.lastIndexOf('WHERE');
                select_position = ctx.right.lastIndexOf('SELECT')
                //console.log('where_position', where_position);
                //console.log('select_position', select_position);
                if (where_position == -1) {
                    sql += 'WHERE ' + ctx.except_condition + finish + ";";
                } else if (where_position != -1 && select_position == 0) {
                    sql += 'AND ' + ctx.except_condition + finish + ";";
                } else if (where_position > select_position && select_position != 0) {
                    sql = sql.slice(0, -1);
                    finish += ")";
                    sql += 'AND ' + ctx.except_condition + finish + ";";
                } else if (where_position < select_position && select_position != 0) {
                    //djj,ot быть такого не должно, но пусть
                    sql = sql.slice(0, -1);
                    finish += ")";
                    sql += 'WHERE ' + ctx.except_condition + finish + ";";
                }

                console.log('sql', sql);

                resolve(sql);
            }).catch(function(err) {
                reject(err);
            });

        /*var ctx = {};
        left_operand.make_sql()
            .then(function(res) {
                //console.log('left operand res', res);
                ctx.left = res;
                return right_operand.make_sql();
            }).then(function(res) {
                //console.log('right operand res', res);
                ctx.right = res;
                var sql = "(" + ctx.left + ") UNION (" + ctx.right + ");";
                resolve(sql);
            }).catch(function(err) {
                reject(err);
            });*/
    }.bind(this));
}


//обработка запроса с делением
RelationalAlgebraQuery.prototype.division_transformation = function() {
    return new Promise(function(resolve, reject) {

        //выделение операндов по регулярному выражению
        var re;
            re = /^\(([\w]|(?:\(.*\)))\[([^,]+(?:,[^,]+)*):([^,]+(?:,[^,]+)*)\]([\w]|(?:\(.*\)))\)$/;

        if (!re.test(this.query_body)) {
            console.log('err1')
            reject(new Error("Запрос c операцией деления не соответствует необходимому шаблону"));
        }
        var result = re.exec(this.query_body);

        var attr_division_r1 = result[2].split(",");
        var attr_division_r2 = result[3].split(",");
        if (attr_division_r1.length != attr_division_r2.length) {
            reject(new Error("Неверно заданы атрибуты таблиц по которым необходимо выполнить операцию деления"));
        }


        var left_operand = new RelationalAlgebraQuery({
            title: '',
            alias: this.alias,
            //target_list: this.target_list,
            target_list: '*',
            query_body: result[1]
        });
        var right_operand = new RelationalAlgebraQuery({
            title: '',
            alias: this.alias,
            target_list: '*',
            query_body: result[4]
        });
        //var left_operand_copy = left_operand.copy();

        //console.log('leftOperand', left_operand);
        //console.log('rightOperand', right_operand);
        //console.log('left_copy', left_operand_copy);


        var ctx = {};
        ctx.target_list = this.target_list;

        ctx.division_condition = "";
        target_list_arr = this.target_list.split(",");
        target_list_arr.forEach(function(el) {
            el = el.trim();
            ctx.division_condition += el + "=" + el.substr(0, 1) + "1" + el.substr(1) + "AND";
        });

        attr_division_r1.forEach(function(el, index) {
            ctx.division_condition += el.substr(0, 1) + "1" + el.substr(1) + "=" + attr_division_r2[index] + "AND";
        });

        ctx.division_condition = ctx.division_condition.slice(0, -3);


        left_operand.make_sql()
            .then(function(res) {
                //console.log('left operand res', res);
                ctx.left = res.replace(/\*/, ctx.target_list);

                ctx.left_copy = make_copy(left_operand.alias, res);
                return right_operand.make_sql();
            }).then(function(res) {
                //console.log('right operand res', res);
                ctx.right = res;

                //return left_operand_copy.make_sql();
            //}).then(function(res) {

                //ctx.left_copy = res;

                //сбор итогового sql
                var sql = "";
                var finish = "";
                var where_position = ctx.left.lastIndexOf('WHERE');

                if (where_position == -1) {
                    sql += ctx.left + 'WHERE NOT EXISTS (';
                } else if (where_position != -1) {
                    //перед тем как приписать AND нужно удостовериться, что условие состояло не из OR
                    sql += ctx.left.substring(0, where_position + 5) + 
                        add_brackets(ctx.left.substring(where_position + 5)) + 'AND NOT EXISTS (';
                }

                where_position = ctx.right.lastIndexOf('WHERE');
                //console.log('where_position', where_position);
                //console.log('select_position', select_position);
                if (where_position == -1) {
                    sql += ctx.right + 'WHERE NOT EXISTS (';
                } else if (where_position != -1 ) {
                    sql += ctx.right.substring(0, where_position + 5) + 
                        add_brackets(ctx.right.substring(where_position + 5)) + 'AND NOT EXISTS (';
                }

                where_position = ctx.right.lastIndexOf('WHERE');
                if (where_position == -1) {
                    sql += ctx.left_copy + 'WHERE ' + ctx.division_condition  + "));";
                } else if (where_position != -1 ) {
                    sql += ctx.left_copy.substring(0, where_position + 5) + 
                        add_brackets(ctx.left_copy.substring(where_position + 5)) + 
                        'AND ' + ctx.division_condition  + "));";
                }

                console.log('sql', sql);

                resolve(sql);
            }).catch(function(err) {
                reject(err);
            });

    }.bind(this));
}


make_copy = function(alias, sql) {

    var tables = alias.split(",");
    tables.forEach(function(table) {
        table = table.trim();
        var alias = table.substr(-1);

        console.log('alias', alias);
        console.log('sql', sql);

        var re = new RegExp(alias + "\\.", 'g');
        sql = sql.replace(re, alias + "1.");

        console.log('sql', sql);
        //re = new RegExp("AS" + alias , 'g');
        //sql = sql.replace(re, '$&1');
        
        re = new RegExp("AS " + alias , 'g');
        sql = sql.replace(re, 'AS ' + alias + "1");
    });

    return sql;
}



//возвращает копию запроса с переименованием алиасов таблиц с X на X1
RelationalAlgebraQuery.prototype.copy = function() {
    var copy = new RelationalAlgebraQuery(this);
    console.log('copy', copy);

    var tables = copy.alias.split(",");
    tables.forEach(function(table) {
        table = table.trim();
        var alias = table.substr(-1);

        Object.keys(copy).forEach(function(el) {

            var re = new RegExp(alias + ".", 'g');
            el.replace(re, '$&1');
        });
    });

    return copy;
}


RelationalAlgebraQuery.prototype.make_sql = function() {
    var sql = "";

    return new Promise(function(resolve, reject) {
        var ctx;
        this.query_body = this.query_body.replace(/\s/g,'');

        this.proection_transformation()
            .then(function(proection_tl) {

                this.target_list = this.target_list ? this.target_list :
                    (proection_tl ? proection_tl : "*");
                return this.connection_transformation();
            }.bind(this)).then(function() {
                //выделяем список таблиц, атрибуты которых попали в целевой список
                this.outer_tables = this.target_list.split(",");
                this.outer_tables = this.outer_tables.map(el => el.trim().substr(0, 1));
                this.outer_tables = this.outer_tables.filter(only_unique);
                //ctx.outer_tables = this.outer_tables;
                //console.log('this', this);

                var re = /^[\(]{0,1}(?:(\w)|\((\w(?:\*[\w])*)\))(?:\[((?:[^\[\]]+[<>=][^\[\]]+)+)\]\){0,1}){0,1}$/;
                if (!re.test(this.query_body)) {
                    console.log('err1')
                    reject(new Error("После эквивалентных преобразований запрос не соответсвует необходимому шаблону"));
                }

                var result = re.exec(this.query_body)
                    selection = result[3] ? result[3] : "";
                this.tables_multiplication = result[1] ? result[1] : result[2];
                //выделение неделимых частей с точки зрения формирования предложения where
                return this.get_where_elements(selection);
            }.bind(this)).then(function() {
                //выделение таблиц, которые учавствуют в запросе
                var tables_arr = this.tables_multiplication.split("*");
                tables_arr = tables_arr.filter(only_unique);

                //удаляем таблицы, атрибуты которых попали в целевой список
                var inner_tables_arr = tables_arr.filter(function(el) {
                        if (this.outer_tables[0] == "*")
                            return false;
                        else 
                            return (!this.outer_tables.includes(el));
                    }.bind(this));

                //список всех алиасов таблиц
                var alias_arr = this.alias.replace(" ", "").split(",");
                alias_arr = alias_arr.filter(only_unique);
                var outer_alias_arr = alias_arr.filter(function(el) {
                        if (this.outer_tables[0] == "*" && (this.query_body.indexOf(el.substr(-1) + ".") != -1 || 
                                this.query_body.indexOf(el.substr(-1) + "*") != -1 || this.query_body.indexOf(el.substr(-1) + "*") != -1 ||
                                this.query_body == "(" + el.substr(-1) + ")" ||  this.query_body ==  el.substr(-1) ))
                            return true;
                        else 
                            return (this.outer_tables.includes(el.substr(-1)));
                    }.bind(this));

                var inner_alias_arr = alias_arr.filter(function(inner_tables_arr, el) {
                        var name = el.substr(-1);
                        return (!this.outer_tables.includes(name) && inner_tables_arr.includes(name));
                    }.bind(this, inner_tables_arr));

                //составить список элементов предложения where для внешнего select
                var outer_where_arr = this.where_elements.filter(
                        get_outer_where.bind(this, inner_tables_arr));

                this.where_elements = this.where_elements.filter(function(el) {
                        return (!outer_where_arr.includes(el));
                    });


                //формирование sql 
                if (inner_tables_arr.length == 0) {
                    //вложенного select не будет
                    var from = outer_alias_arr.join();
                    var where = outer_where_arr.join("AND");

                    var sql = make_simple_select(this.target_list, from, where, "DISTINCT ");
                    resolve(sql);
                } else {
                    //вложенный запрос есть
                    var from = outer_alias_arr.join();
                    var inner_from = inner_alias_arr.join();

                    outer_where_arr.push(" EXISTS");
                    var where = outer_where_arr.join("AND");
                    var inner_where = this.where_elements.join("AND");

                    var sql = make_simple_select(this.target_list, from, where, "DISTINCT ") + 
                        " (" + make_simple_select("*", inner_from, inner_where) + ")";
                    resolve(sql);
                }

            }.bind(this)).catch(function(err) {
                reject(err);
            }.bind(this));

    }.bind(this));
}


//обработка операций проекции в запросе, метод возвращает целевой список 
//из проекции, которая является самой внешней операцией, если таковая имеется
//при этом все промежуточные проекции удаляются
RelationalAlgebraQuery.prototype.proection_transformation = function() {
    return new Promise(function(resolve, reject) {
        var re = /\[([^\[\]<>=]+)\](?:$|\)$)/,
           proection_tl = "";

        if (re.test(this.query_body))
            var proection_tl = re.exec(this.query_body)[1];

        re = /\[([^\[\]<>=]+)\]/g,
        this.query_body = this.query_body.replace(re, "");

        resolve(proection_tl);
    }.bind(this));
}


//преобразование оединения к декартовому произведению + ограничению
RelationalAlgebraQuery.prototype.connection_transformation = function() {
    //console.log('connection_transformation', this.query_body);
    var old_body = this.query_body;

    return new Promise(function(resolve, reject) {
        //TODO вставить удаление задвоения скобок;
        this.delete_extra_brackets()
            .then(function() {
                return this.delete_double_brackets();
            }.bind(this)).then(function() {
                return this.multiplication_transformation();
            }.bind(this)).then(function() {
                //console.log('this.query_body', this.query_body);
                return this.concatenate_selection();
            }.bind(this)).then(function() {
                //console.log('this.query_body', this.query_body);
                //поиск соединений в запросе (после "]" должна стоять не ")" )
                //var re = /(\[((?:[^\[\]]+[<>=][^\[\]]+)+)\])[^\)]/;
                var re = /(\[([^\[\]]+)\])[^\)]/;

                if (re.test(this.query_body)) {
                    var result = re.exec(this.query_body);
                    var match = result[0];
                    var index = result.index;
                    var input = result.input;

                    //part1 = result.input.substr(0,result.index);
                    //part2 = result.input.substr(result.index + match.length);
                    //console.log('part1', part1);
                    //console.log('part2', part2);

                    //ищем открывающую скобку
                    var open_bracket = -1;
                    var cnt = 0;
                    for (var i = index - 1; i >= 0 ; i--) {
                        if (result.input.substr(i,1) == "(") {
                            cnt++;
                            if (cnt == 1) { //налши искомое
                                open_bracket = i ;
                                //console.log('open_bracket', open_bracket);
                                break;
                            }
                        } else if (result.input.substr(i,1) == ")") {
                            cnt--;
                        }
                    }

                    //ищем закрывающую скобку
                    var close_bracket = -1;
                    var cnt = 0;
                    for (var i = index + match.length - 1, len = input.length; i < len ; i++) {
                        if (result.input.substr(i,1) == "(") {
                            cnt++;
                        } else if (result.input.substr(i,1) == ")") {
                            cnt--;
                            if (cnt == -1 ) { //налши искомое
                                close_bracket = i;
                                //console.log('close_bracket', close_bracket);
                                break;
                            }
                        }
                    }

                    if (close_bracket != -1 && open_bracket != -1) {
                        //выделяем операнды соединения
                        var operand_a = this.query_body.substring(open_bracket + 1, index);
                        var operand_b = this.query_body.substring(index + match.length - 1, close_bracket);
                        //console.log('operand_a', operand_a);
                        //console.log('operand_b', operand_b);

                        this.query_body = this.query_body.substring(0, open_bracket + 1) + "((" +
                            operand_a + ")*(" + operand_b + "))" + match.slice(0,-1) + 
                            this.query_body.substring(close_bracket);

                        resolve(this.connection_transformation());
                    } else {
                        reject({message: "Не удалось определить скобки, в которые заключена операция соединения."});
                    }
                } else if (old_body != this.query_body) {
                    resolve(this.connection_transformation());
                } else {
                    resolve();
                }
            }.bind(this)).catch(function(err) {
                reject(err);
            });
    }.bind(this));
}

//упрощение декартового произведения
RelationalAlgebraQuery.prototype.multiplication_transformation = function() {
    //console.log('multiplication_transformation', this.query_body);
    var old_body = this.query_body;

    return new Promise(function(resolve, reject) {

        //упрощение простейшего декартового произведения ((X*Y)*Z) и (X*(Y*Z))
        //var re = /\((?:([\w])|(?:\(([\w](?:\*[\w])*)\)))\*(?:([\w])|(?:\(([\w](?:\*[\w])*)\)))\)/g;
        var operand = /(?:([\w])|(?:\(([\w](?:\*[\w])*)\)))/;
        var re = new RegExp("\\(" + operand.source + "\\*" + operand.source + "\\)", "g");

        if (re.test(this.query_body)) {
            this.query_body = this.query_body.replace(re, replacer_multiplication);
        }

        //var re2 = /\((?:(?:\((\w|\([\w](?:\*[\w])*\))(?:\[((?:[^\[\]]+[<>=][^\[\]]+)+)\])\))|(?:([\w])|(?:\(([\w](?:\*[\w])*)\))))\*(?:(?:\((\w|\([\w](?:\*[\w])*\))(?:\[((?:[^\[\]]+[<>=][^\[\]]+)+)\])\))|(?:([\w])|(?:\(([\w](?:\*[\w])*)\))))\)/;
        /*var big_operand = /(?:\((\w|\([\w](?:\*[\w])*\))(\[((?:[^\[\]]+[<>=][^\[\]]+)+)\])\))/;
        var re = new RegExp("\\(" + 
            "\(\?\:" + big_operand.source + "\|" + operand.source + "\)\\*" + 
            "\(\?\:" + big_operand.source + "\|" + operand.source + "\)" + 
            "\\)", "g");
        */
        /*var selection = /(?:\[((?:[^\[\]]+[<>=][^\[\]]+)+)\])/;
        re = new RegExp("\\(" + 
            "\(\?\:\(\?\:\\(" + operand.source + selection.source + "\\)\)\|" + operand.source + "\)" +
            "\\*" +
            "\(\?\:\(\?\:\\(" + operand.source + selection.source + "\\)\)\|" + operand.source + "\)" + "\\)","g");
        console.log('re', re.source);*/

        var selection = /(?:\[((?:[^\[\]]+[<>=][^\[\]]+)+)\])/;
        re = new RegExp("\\(" + 
            "\(\?\:\(\?\:\\(" + operand.source + selection.source + "\\)\)\|" + operand.source + "\)" +
            "\\*" +
            "\(\?\:\(\?\:\\(" + operand.source + selection.source + "\\)\)" + "\)" + "\\)","g");
        //console.log('re2', re.source);
        if (re.test(this.query_body)) {
            this.query_body = this.query_body.replace(re, replacer_multiplication_2);
        }

        var selection = /(?:\[((?:[^\[\]]+[<>=][^\[\]]+)+)\])/;
        re = new RegExp("\\(" + 
            "\(\?\:\(\?\:\\(" + operand.source + selection.source + "\\)\)" + "\)" +
            "\\*" +
            "\(\?\:\(\?\:\\(" + operand.source + selection.source + "\\)\)\|" + operand.source + "\)" + "\\)","g");
        //console.log('re3', re.source);
        if (re.test(this.query_body)) {
            this.query_body = this.query_body.replace(re, replacer_multiplication_3);
        }

        if (old_body != this.query_body)
            resolve(this.multiplication_transformation());
        else
            resolve();
    }.bind(this));
}

function replacer_multiplication(match, p1, p2, p3, p4) {
    if (p1 & p3) //совпало с (X*Y) - замена не нужна
        return match;
    else
        return "(" + (p1 ? p1 : p2) + "*" + (p3 ? p3 : p4) + ")";
}

function replacer_multiplication_2(match, p1, p2, p3, p4, p5, p6, p7, p8) {

    return "((" + (p1 ? p1 : (p2 ? p2 : (p4 ? p4 : p5))) + "*" + (p6 ? p6 : p7) + ")" + "[" +
        ((p3 && p8) ? "(" + p3 + ")AND(" + p8 + ")" : (p3 ? p3 : p8)) + "])";
}

function replacer_multiplication_3(match, p1, p2, p3, p4, p5, p6, p7, p8) {

    return "((" + (p1 ? p1 : p2) + "*" + (p4 ? p4 : (p5 ? p5 : (p7 ? p7 : p8))) + ")" + "[" +
        ((p3 && p6) ? "(" + p3 + ")AND(" + p6 + ")" : (p3 ? p3 : p6)) + "])";
}


//слияние подряд стоящих булевских выражений 
//((X[Nгр="224"])[X.Возр>18]) => (X[(Nгр="224")AND(X.Возр>18])
//((X[Nгр="224"])[X.Nгр=Y.Nгр]Y) => (X[(Nгр="224")AND(X.Nгр=Y.Nгр]Y)
RelationalAlgebraQuery.prototype.concatenate_selection = function() {
    //console.log('concatenate_selection', this.query_body);
    var old_body = this.query_body;

    return new Promise(function(resolve, reject) {
        //var re = /\[((?:[^\[\]]+[<>=][^\[\]]+)+)\]\)\[((?:[^\[\]]+[<>=][^\[\]]+)+)\]/;
        //light regexp without bactracking
        var re = /\[([^\[\]]+)\]\)\[([^\[\]]+)\]/;

        if (re.test(this.query_body)) {
            var result = re.exec(this.query_body);
            var match = result[0];
            var index = result.index;
            var input = result.input;

            //part1 = result.input.substr(0,result.index);
            //part2 = result.input.substr(result.index + match.length);

            //console.log('part1', part1);
            //console.log('part2', part2);

            //ищем открывающую скобку
            var open_bracket = -1;
            var cnt = 0;
            for (var i = index - 1; i >= 0 ; i--) {
                if (result.input.substr(i,1) == "(") {
                    cnt++;
                    if (cnt == 1 && result.input.substr(i - 1,1) == "(") { //налши искомое
                        open_bracket = i -1;
                        //console.log('open_bracket', open_bracket);
                        break;
                    }
                } else if (result.input.substr(i,1) == ")") {
                    cnt--;
                }
            }

            //ищем закрывающую скобку
            var close_bracket = -1;
            var cnt = 0;
            for (var i = index + match.length, len = input.length; i < len ; i++) {
                if (result.input.substr(i,1) == "(") {
                    cnt++;

                } else if (result.input.substr(i,1) == ")") {
                    cnt--;
                    if (cnt == -1 ) { //налши искомое
                        close_bracket = i;
                        //console.log('close_bracket', close_bracket);
                        break;
                    }
                }
            }

            if (close_bracket != -1 && open_bracket != -1) {
                this.query_body = this.query_body.replace(re, '[($1)AND($2)]');
                this.query_body = this.query_body.substr(0, open_bracket) + this.query_body.substr(open_bracket + 1);

                resolve(this.concatenate_selection());
            }
        } else {
            resolve('');
        }
    }.bind(this));
}

//удаление завоения скобок
RelationalAlgebraQuery.prototype.delete_double_brackets = function() {
    //console.log('delete_double_brackets', this.query_body);
    var old_body = this.query_body;
    var flag = true;

    return new Promise(function(resolve, reject) {

        loop:
            for (var i = 0, len = this.query_body.length; i < len ; i++) {
                if (this.query_body.substr(i, 2) == "((") {

                    var brackets_arr = [];
                    for (var j = i + 2; j < len; j++) {

                        if (this.query_body.substr(j, 2) == "))" && brackets_arr.length == 0) {
                            //найдено удвоение скобок
                            this.query_body = this.query_body.substring(0, i) +
                                this.query_body.substring(i + 1, j) +
                                this.query_body.substring(j+1);
                            break;
                        } else if (this.query_body.substr(j, 1) == "(") {
                            brackets_arr.push(0);
                        } else if (this.query_body.substr(j, 1) == ")") {
                            if (brackets_arr.length != 0 && brackets_arr.last() == 0)
                                brackets_arr.pop();
                            else
                                brackets_arr.push(1);
                        }

                        if (old_body != this.query_body)
                            break loop;
                    }
                }
            }

        if (old_body != this.query_body)
            resolve(this.delete_double_brackets());
        else
            resolve();
    }.bind(this));
}


//удаление лишних скобок (X) => X
//[(X.Возр>20)AND(X.Nгр=Y.Nгр)] => [X.Возр>20ANDX.Nгр=Y.Nгр]
RelationalAlgebraQuery.prototype.delete_extra_brackets = function() {
    //console.log('delete_extra_brackets', this.query_body);
    var old_body = this.query_body;

    return new Promise(function(resolve, reject) {
        var re = /\(([\w])\)/g;

        if (re.test(this.query_body))
            this.query_body = this.query_body.replace(re, "$1");

        re = /\(([^<>=\(\)\[\]]+[<>=][^<>=\(\)\[\]]+)\)/g;
        if (re.test(this.query_body))
            this.query_body = this.query_body.replace(re, "$1");

        //удаление более сложного варианта лишних скобок
        //[X.Возр>20AND(X.Возр<23ANDX.Nгр=Y.Nгр)] => [X.Возр>20ANDX.Возр<23ANDX.Nгр=Y.Nгр]
        re = /AND\(/g;
        var result = [];
        while ((result = re.exec(this.query_body)) != null) {

            var flag = true,
                cnt = 0,
                start = result.index,
                end = -1;

            for (var i = result.index + 4, len = this.query_body.length; i < len; i++) {
                if (this.query_body.substr(i, 1) == "(") {
                    cnt++;
                } else if (this.query_body.substr(i, 1) == ")") {
                    cnt--;
                    if (cnt == -1) {
                        end = i;
                        break;
                    }
                } else if (cnt == 0 && i < len - 1 && this.query_body.substr(i, 2) == "OR") {
                    flag = false;
                    break;
                }
            }

            if (flag && end && start) {
                //перестановка
                this.query_body = this.query_body.substring(0, start + 3) + 
                    this.query_body.substring(start + 4, end) + this.query_body.substring(end + 1);
            }
            re.lastIndex = re.lastIndex - 1;
        }


        //удаление более сложного варианта лишних скобок
        //[(X.Возр>20ANDX.Возр<23)ANDX.Nгр=Y.Nгр] => [X.Возр>20ANDX.Возр<23ANDX.Nгр=Y.Nгр]
        re = /\)AND/g;
        var result = [];
        while ((result = re.exec(this.query_body)) != null) {

            var flag = true,
                cnt = 0,
                start = -1,
                end = result.index;

            for (var i = result.index -1; i >= 0; i--) {
                if (this.query_body.substr(i, 1) == "(") {
                    cnt++;
                    if (cnt == 1) {
                        start = i;
                        break;
                    }
                } else if (this.query_body.substr(i, 1) == ")") {
                    cnt--;
                } else if (cnt == 0 && this.query_body.substr(i, 2) == "OR") {
                    flag = false;
                    break;
                }
            }

            if (flag && end && start) {
                //перестановка
                this.query_body = this.query_body.substring(0, start) + 
                    this.query_body.substring(start + 1, end) + this.query_body.substring(end + 1);
            }
            re.lastIndex = re.lastIndex - 1;
        }


        //удаление более сложного варианта лишних скобок
        //[X.Возр>20OR(X.Возр<23ORX.Nгр=Y.Nгр)] => [X.Возр>20ORX.Возр<23ORX.Nгр=Y.Nгр]
        re = /OR\(/g;
        result = [];
        while ((result = re.exec(this.query_body)) != null) {

            var flag = true,
                cnt = 0,
                start = result.index,
                end = -1;

            for (var i = result.index + 3, len = this.query_body.length; i < len; i++) {
                if (this.query_body.substr(i, 1) == "(") {
                    cnt++;
                } else if (this.query_body.substr(i, 1) == ")") {
                    cnt--;
                    if (cnt == -1) {
                        end = i;
                        break;
                    }
                } else if (cnt == 0 && i < len - 1 && this.query_body.substr(i, 3) == "AND") {
                    flag = false;
                    break;
                }
            }

            if (flag && end && start) {
                //перестановка
                this.query_body = this.query_body.substring(0, start + 2) + 
                    this.query_body.substring(start + 3, end) + this.query_body.substring(end + 1);
            }
            re.lastIndex = re.lastIndex - 1;
        }


        //удаление более сложного варианта лишних скобок
        //[(X.Возр>20ANDX.Возр<23)ANDX.Nгр=Y.Nгр] => [X.Возр>20ANDX.Возр<23ANDX.Nгр=Y.Nгр]
        re = /\)OR/g;
        var result = [];
        while ((result = re.exec(this.query_body)) != null) {

            var flag = true,
                cnt = 0,
                start = -1,
                end = result.index;

            for (var i = result.index -1; i >= 0; i--) {
                if (this.query_body.substr(i, 1) == "(") {
                    cnt++;
                    if (cnt == 1) {
                        start = i;
                        break;
                    }
                } else if (this.query_body.substr(i, 1) == ")") {
                    cnt--;
                } else if (cnt == 0  && this.query_body.substr(i, 3) == "AND") {
                    flag = false;
                    break;
                }
            }

            if (flag && end && start) {
                //перестановка
                this.query_body = this.query_body.substring(0, start) + 
                    this.query_body.substring(start + 1, end) + this.query_body.substring(end + 1);
            }
            re.lastIndex = re.lastIndex - 1;
        }

        if (old_body != this.query_body)
            resolve(this.delete_extra_brackets());
        else
            resolve();
    }.bind(this));
}


//выделение неделимых элементов с точки зрения формирования предложения where
//так например (Z.ИдКн=X.ИдКн Or Z.ИдКн=Y.ИдКнЧем)
//selection - булево выражение - условие отбора
RelationalAlgebraQuery.prototype.get_where_elements = function(selection) {
    //console.log('get_where_elements_selection', selection);
    var old_selection = selection;
    return new Promise(function(resolve, reject) {

        if (selection != "" && selection.indexOf("(") == -1 && selection.indexOf("OR") == -1) {
            this.where_elements = this.where_elements.concat(selection.split("AND"));
            selection = "";
        } else if (selection.indexOf("AND(") != -1) {
            //если есть элементы в таких скобках их нужно сначала внести в список неделимых элементов
            //затем удалить из рассматриваемой строки
            var cnt = 0,
                start = selection.indexOf("AND(");
            for (var i = start + 3, len = selection.length; i < len; i++) {

                if (selection.substr(i, 1) == "(")
                    cnt++;
                else if (selection.substr(i, 1) == ")")
                    cnt--;

                if (cnt == 0) {
                    //найдена парная скобка
                    this.where_elements.push(selection.substring(start + 3, i + 1));
                    selection = selection.substring(0, start) + selection.substring(i + 1);
                    break;
                }
            }
        } else if (selection.indexOf(")AND") != -1) {
            //если есть элементы в таких скобках их нужно сначала внести в список неделимых элементов
            //затем удалить из рассматриваемой строки
            var cnt = 0,
                end = selection.indexOf(")AND");
            for (var i = end; i <= 0; i--) {

                if (selection.substr(i, 1) == ")")
                    cnt++;
                else if (selection.substr(i, 1) == ")")
                    cnt--;

                if (cnt == 0) {
                    //найдена парная скобка
                    this.where_elements.push(selection.substring(i, end + 1));
                    selection = selection.substring(0, i) + selection.substring(end + 4);
                    break;
                }
            }
        }

        if (old_selection != selection && selection != "") {
            resolve(this.get_where_elements(selection));
        } else if (selection != ""){
            this.where_elements.push(selection);
            resolve();
        } else {
            resolve();
        }
    }.bind(this));
}


module.exports = RelationalAlgebraQuery;


//EsmaScript 6
/*var AlgebraQueries = class {
    constructor(queries_array) {
        this.queries = queries_array;

        var help_tables = []
        if (queries_array.length > 1) {
            queries_array.map(query => {
                if (query.title != 'result')
                    help_tables.push(query.title);
            });
        }
        this.help_tables = help_tables;
    }

    get convert_to_sql() {
        return new Promise(function(resolve, reject) {
            var sql = `SELECT * INTO TEMP test
                FROM Кинотеатры AS X
                WHERE X.Метро = 'Университет';

                SELECT *
                FROM test AS Y
                WHERE Y.НомерСеанса = 2;`;

            resolve(sql);
        });
    }

}*/


/*var make_sql = function() {
    return new Promise(function(resolve, reject) {
        var sql = `SELECT * INTO TEMP test
        FROM Кинотеатры AS X
        WHERE X.Метро = 'Университет';

        SELECT *
        FROM test AS Y
        WHERE Y.НомерСеанса = 2;`;

        resolve(sql);

    });
};


module.exports = {
    convert_algebra_to_sql: make_sql
}*/

