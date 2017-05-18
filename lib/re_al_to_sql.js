var RelationalAlgebraQuery = require('./RelationalAlgebraQuery.js');

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
        console.log('this.queries type of', typeof this.queries);
        Promise.all(this.queries.map(convert_to_sql))
            .then(function(result) {
                console.log('result', result);
                var sql = `SELECT * INTO TEMP test
                    FROM Кинотеатры AS X
                    WHERE X.Метро = 'Университет';

                    SELECT *
                    FROM test AS Y
                    WHERE Y.НомерСеанса = 2;`;

                resolve(sql);
            }).catch(function(err) {
                console.log('err', err);
                reject(err);
            });
    });
}

function convert_to_sql(query_object) {
    console.log('here');

    var query = new RelationalAlgebraQuery(query_object);

    return new Promise(function(resolve, reject) {
        query.convert()
            .then(function(res) {
                resolve(res);
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

