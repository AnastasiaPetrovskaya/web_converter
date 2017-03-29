var execFile = require('child-process-promise').execFile;


module.exports = function (models) {
    var DataBase = models.DataBase;

    DataBase.make = function (db_data, filename) {
        var ctx = {};
        console.log('db_data', db_data);
        console.log('filename', filename);

        return sequelize.transaction(function (t) {
            return DataBase.findOne({
                    where: {title: db_data.title},
                    transaction: t
                }).then(function (db) {
                    if (db)
                        throw {message: 'DdExists'};

                    //выполнение скрипта в папке mdb2postgres, котрорый 
                    //отвечает за создание и экспорта базы на сервере
                    return execFile('./mdb_to_psql.sh', [filename, db_data.title], {cwd: "./mdb2postgres"});
                }).then(function(result) {
                    var stdout = result.stdout;
                    var stderr = result.stderr;

                    console.log('stdout', stdout);
                    console.log('stderr', stderr);
                    //если скрипт отработал корректно, то нужно создать базу в бд
                    return DataBase.
                }).catch(function(err) {
                    console.log('make db method err', err);
                    throw {message: err};
                });
        });
    }

};
