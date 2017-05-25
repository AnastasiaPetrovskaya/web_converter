var RelationalAlgebraQuery = require('./RelationalAlgebraQuery.js');
var os = require("os");

function AlgebraQueries (queries_array) {
    this.queries = queries_array;

    var help_tables = [];
    if (queries_array.length > 1) {
        queries_array.map(query => {
            if (query.title != 'result')
                help_tables.push(query.title);
        });
    }

    this.help_tables = help_tables;
}

AlgebraQueries.prototype.create_sql_script = function() {
    return new Promise(function(resolve, reject) {
        console.log('this.queries', this.queries);
        //console.log('this.queries type of', typeof this.queries);
        Promise.all(this.queries.map(convert_to_sql))
            .then(function(result) {
                //console.log('result!!!!!!!!!!convert_all', this.queries);
                /*var sql = `SELECT * INTO TEMP test
                    FROM Кинотеатры AS X
                    WHERE X.Метро = 'Университет';

                    SELECT *
                    FROM test AS Y
                    WHERE Y.НомерСеанса = 2;`;*/
                var sql = "";

                this.queries.forEach(query, index, array) {
                    if (index != array.length -1) {
                        var from_pos = query.sql.indexOf("FROM");
                        sql += query.sql.substring(0, from_pos) +
                            "INTO TEMP " + query.title + " " +
                            query.sql.substring(from_pos) + os.EOL;

                    } else {
                        sql += query.sql;
                    }
                });

                console.log(

                resolve(sql);
            }).catch(function(err) {
                console.log('err', err);
                reject(err);
            });
    });
}

function convert_to_sql(query_object) {
    //console.log('here');
    var query = new RelationalAlgebraQuery(query_object);

    return new Promise(function(resolve, reject) {
        query.convert()
            .then(function() {
                //console.log('res convert to sql res', res);
                console.log('query after finish convert', query);
                query_object.sql = query.sql;
                resolve();
            }).catch(function(err) {
                reject(err);
            });
    });
}



module.exports = AlgebraQueries;


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

