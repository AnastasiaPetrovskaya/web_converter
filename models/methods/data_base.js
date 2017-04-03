var child_process = require('child-process-promise');
var username = app.config.postgres.user;
var password = app.config.postgres.password;

module.exports = function (models) {
    var DataBase = models.DataBase;

    DataBase.make = function (db_data, filename) {
        var ctx = {};
        console.log('db_data', db_data);
        console.log('filename', filename);

        return sequelize.transaction(function (t) {
            return DataBase.unscoped().findOne({
                    where: {title: db_data.title},
                    transaction: t
                }).then(function (db) {
                    if (db)
                        throw {message: 'DdExists'};

                    //выполнение скрипта в папке mdb2postgres, котрорый 
                    //отвечает за создание и экспорта базы на сервере
                    console.log('app.config.postgres', app.config.postgres)
                    return child_process.execFile('./mdb_to_psql.sh', 
                        [filename, db_data.title, username, password],
                         {cwd: "./mdb2postgres"});
                }).then(function(result) {
                    var stdout = result.stdout;
                    var stderr = result.stderr;

                    console.log('stdout', stdout);
                    console.log('stderr', stderr);
                    //если скрипт отработал корректно, то нужно создать базу в бд
                    return DataBase.create(db_data);
                }).then(function(db){
                    return db.dataValues;
                }).catch(function(err) {
                    console.log('make db method err', err);
                    throw {message: err};
                });
        });
    },

    DataBase.get_schema = function (db_id) {
        var ctx = {};
        console.log('db_id', db_id);

        return DataBase.findById(db_id)
            .then(function (db) {
                if (!db)
                    throw {message: 'DdNotExists'};

                //выполнение команды по генерации схемы
                ctx.filename = db.id + Date.now() + '.png';
                return child_process.exec('./schemacrawler.sh -url="jdbc:postgresql://localhost/' 
                    + db.title + '" -u="' + username + '" -password="' + password + 
                    '" -i=maximum -c=schema -fmt=png -outputfile=../../static/db_schema/' 
                    + ctx.filename + ' -weakassociations=true', 
                    {cwd: "./schemacrawler-14.15.03-main/_schemacrawler"});
            }).then(function(result) {
                var stdout = result.stdout;
                var stderr = result.stderr;

                console.log('stdout', stdout);
                console.log('stderr', stderr);
                //если скрипт отработал корректно, то нужно вернуть название файла
                return ctx.filename;
            }).catch(function(err) {
                console.log('get db schema err', err);
                throw {message: err};
            });
    },

    DataBase.remove = function (db_id) {
        var ctx = {};
        console.log('db_id', db_id);

        return sequelize.transaction(function (t) {
            return DataBase.findOne({
                    where: {id: db_id},
                    transaction: t
                }).then(function (db) {
                    if (!db)
                        throw {message: 'DdDoNotExists'};

                    //выполняем команду dropdb
                    return execFile('./mdb_to_psql.sh', [filename, db_data.title], {cwd: "./mdb2postgres"});
                }).then(function(result) {
                    var stdout = result.stdout;
                    var stderr = result.stderr;

                    console.log('stdout', stdout);
                    console.log('stderr', stderr);
                    //если скрипт отработал корректно, то нужно создать базу в бд
                    return DataBase.create(db_data);
                }).then(function(db){
                    return db.dataValues();
                }).catch(function(err) {
                    console.log('make db method err', err);
                    throw {message: err};
                });
        });
    }


};
