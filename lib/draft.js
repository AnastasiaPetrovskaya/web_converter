
function RelationalAlgebraQuery (query_object) {

    this.title = query_object.title;
    this.alias = query_object.alias;
    this.target_list = query_object.target_list;
    this.query_body = query_object.text;
    this.sql = "";
}


RelationalAlgebraQuery.prototype.convert = function() {
    //классификация запроса по признаку вхождения
    //теоретико-множественных операций
    if (this.query_body.indexOf(":") != -1) {
        //есть деление
        return('ok');
    } else if (this.query_body.indexOf("UNION") != -1) {
        //есть объединение
        return('ok');
    } else if (this.query_body.indexOf("EXCEPT") != -1) {
        //есть вычитание
        return('ok');
    } else if (this.query_body.indexOf("INTERSECT") != -1) {
        //есть пересечение
        return('ok');
    } else {
        //иначе обычный запрос
        return this.make_sql();
    }
}




RelationalAlgebraQuery.prototype.make_sql = function() {
    return new Promise(function(resolve, reject) {
        resolve('sql');

    });
}


//обработка операций проекции в запросе, метод возвращает целевой список 
//из проекции, которая является самой внешней операцией, если таковая имеется
//при этом все промежуточные проекции удаляются
RelationalAlgebraQuery.prototype.convertion_transformation = function() {
    return new Promise(function(resolve, reject) {
        var re = /\[([^\[\]<>=]+)\]$/,
           proection_tl = "*";

        //concatenate literal reg
        //var a = /\[([^\[\]<>=]+)\]/;
        //var b = /$/;
        //var re = new RegExp(a.source + b.source);

        //использование конструктора
        //var pattern = "\\[\(\[\^\\[\\]<>=\]\+\)\\]\$";
        //var re = new RegExp(pattern);

        if (re.test(this.query_body))
            var proection_tl = re.exec(this.query_body)[1];

        re = /\[([^\[\]<>=]+)\]/g,
        this.query_body = this.query_body.replace(re, "");

        resolve(proection_tl);
    }.bind(this));
}


//преобразование оединения к декартовому произведению + ограничению
RelationalAlgebraQuery.prototype.connection_transformation = function() {
    var old_body = this.query_body;

    return new Promise(function(resolve, reject) {
        this.multiplication_transformation()
            .then(function() {
                return this.concatenate_selection();
            }.bind(this)).then(function() {
                //console.log('this query body', this.query_body);
                //поиск соединений в запросе (после "]" должна стоять не ")" )
                var re = /(\[((?:[^\[\]]+[<>=][^\[\]]+)+)\])[^\)]/;

                if (re.test(this.query_body)) {
                    var result = re.exec(this.query_body);
                    var match = result[0];
                    var index = result.index;
                    var input = result.input;
                    //console.log('index', index);

                    part1 = result.input.substr(0,result.index);
                    part2 = result.input.substr(result.index + match.length);

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
    var old_body = this.query_body;

    return new Promise(function(resolve, reject) {

        //упрощение простейшего декартового произведения ((X*Y)*Z) и (X*(Y*Z))
        //var re = /\((?:([\w])|(?:\(([\w](?:\*[\w])*)\)))\*(?:([\w])|(?:\(([\w](?:\*[\w])*)\)))\)/g;
        var operand = /(?:([\w])|(?:\(([\w](?:\*[\w])*)\)))/;
        var re = new RegExp("\\(" + operand.source + "\\*" + operand.source + "\\)", "g");
        
        //console.log('re1', re.source);
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
    var old_body = this.query_body;

    return new Promise(function(resolve, reject) {
        //var re = /\[((?:[^\[\]]+[<>=][^\[\]]+)+)\]\)\[((?:[^\[\]]+[<>=][^\[\]]+)+)\]/;
        var re = /\[((?:[^\[\]]+[<>=][^\[\]]+)+)\]\)\[((?:[^\[\]]+[<>=][^\[\]]+)+)\]/;
        //concatenate literal reg
        //var a = /\[([^\[\]<>=]+)\]/;
        //var b = /$/;
        //var re = new RegExp(a.source + b.source);

        //использование конструктора
        //var pattern = "\\[\(\[\^\\[\\]<>=\]\+\)\\]\$";
        //var re = new RegExp(pattern);

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

