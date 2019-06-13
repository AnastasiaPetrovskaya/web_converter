'use strict'
var child_process = require('child-process-promise');
var pg = require('pg');
var username = app.config.postgres.user;
var password = app.config.postgres.password;
var database = app.config.postgres.database;
var host = app.config.postgres.host;


module.exports = function (models) {
    var DataBase = models.DataBase;
    var Table = models.Table;

    DataBase.make = function (db_data, filename) {
        var ctx = {};

        return sequelize.transaction(function (t) {
            return DataBase.unscoped().findOne({
                    where: {title: db_data.title},
                    transaction: t
                }).then(function (db) {
                    if (db)
                        throw {message: 'DdExists'};

                    //выполнение скрипта в папке mdb2postgres, котрорый 
                    //отвечает за создание и экспорта базы на сервере
                    return child_process.execFile('./mdb_to_psql.sh', 
                        [filename, db_data.title, username, password],
                         {cwd: "./mdb2postgres"});
                }).then(function(result) {
                    var stdout = result.stdout;
                    var stderr = result.stderr;
                    console.log('stdout', stdout);
                    console.log('stderr', stderr);

                    //если скрипт отработал корректно, то нужно создать базу в бд
                    return DataBase.create(db_data, {transaction: t});
                }).then(function(db){
                    ctx.db = db.dataValues;

                    var conn_str = 'postgres://' + username + ':' + password + '@' +
                        host + '/' +  ctx.db.title;

                    return new Promise(function (resolve, reject) {
                        pg.connect(conn_str, function(err, client, done) {
                            if (err) {
                                reject(err);
                            } else {
                                client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';", function(err, result) {
                                    if (err) {
                                        // console.log('0 init_db error\n', err.stack);
                                        done();
                                        reject(err);
                                    } else {
                                        done();
                                        resolve(result);
                                    }
                                });
                            }
                        });
                        pg.end();
                    });

                }).then(function(result) {
                    //console.log('result query tables', result.rows);
                    var tables = result.rows.map(table => table.table_name);
                    var table_data = { db_id : ctx.db.id};

                    var create_table = function(title) {
                        table_data.title = title;
                        return Table.create(table_data, {transaction: t});
                    };

                    return Promise.all(tables.map(create_table));
                }).then(function(result) {
                    //console.log('result', result);
                    return ctx.db;
                }).catch(function(err) {
                    console.log('make db method err', err);
                    throw err;
                });
        });
    },

    DataBase.get_schema = function (db_id) {
        var ctx = {};
        //console.log('db_id', db_id);

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
                    {cwd: "./schemacrawler-15.04.01-distribution/_schemacrawler"});
            }).then(function(result) {
                var stdout = result.stdout;
                var stderr = result.stderr;

                //console.log('stdout', stdout);
                //console.log('stderr', stderr);
                //если скрипт отработал корректно, то нужно вернуть название файла
                return ctx.filename;
            }).catch(function(err) {
                console.log('get db schema err', err);
                throw {message: err};
            });
    },

    DataBase.execute_sql = function (db_id, sql) {
        var ctx = {};
        //console.log('db_id', db_id);
        //console.log('\n\n Выполняемый sql :\n', sql,'\n----------------------------------------\n');

        return DataBase.findById(db_id)
            .then(function (db) {
                if (!db)
                    throw {message: 'DdNotExists'};
                ctx.db = db.dataValues;

                // подключение к бд для запроса данных из таблиц
                var conn_str = 'postgres://' + username + ':' + password + '@' +
                    host + '/' +  ctx.db.title;

                return new Promise(function (resolve, reject) {
                    pg.connect(conn_str, function(err, client, done) {
                        if (err) {
                            reject(err);
                        } else {
                            //console.log('Executing:', 'DROP DATABASE IF EXISTS ' + db.title);
                            client.query(sql, function(err, result) {
                                if (err) {
                                    done();
                                    reject(err);
                                } else {
                                    done();
                                    resolve(result);
                                }
                            });
                        }
                    });
                    pg.end();
                });

            }).then(function(result) {
                return {result: result, db: ctx.db, sql: sql};
            }).catch(function(err) {
                console.log('execute sql err', err);
                var obj = {};
                if (err.position)
                    obj.sql_err_position = err.position;
                obj.message = err.message;
                obj.sql = sql;

                throw  obj;
            });
    },

    DataBase.tables_data = function (db_id, tables) {
        var ctx = {};
        ctx.tables_data = [];

        return sequelize.transaction(function (t) {
            return DataBase.findOne({
                    where: {id: db_id},
                    include: [{
                        as: 'tables', 
                        model: Table,
                        attributes: ['title']
                    }],
                    transaction: t
                }).then(function (db) {
                    //console.log('db', db.dataValues);
                    if (!db)
                        throw {message: 'DdDoesNotExist'};
                    ctx.db = db.dataValues;
                    var tables = ctx.db.tables.map(table => table.dataValues.title);
                    console.log('tables', tables);

                    var queries = [];

                    // подключение к бд для запроса данных из таблиц
                    var conn_str = 'postgres://' + username + ':' + password + '@' +
                        host + '/' +  ctx.db.title;

                    return new Promise(function (resolve, reject) {
                        pg.connect(conn_str, function(err, client, done) {
                            if (err) {
                                reject(err);
                            } else {
                                var get_table_data = function(table_title) {
                                    return new Promise(function(resolve, reject)  {
                                        client.query("SELECT * FROM " + table_title + ";", function(err, res) {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                ctx.tables_data.push({
                                                    title: table_title,
                                                    data: res.rows
                                                });
                                                resolve(res);
                                            }
                                        });
                                    });
                                };

                                Promise.all(tables.map(get_table_data))
                                    .then(function(res) {
                                        done();
                                        resolve(res);
                                    }).catch(function(err) {
                                        done();
                                        reject(err);
                                    });
                            }
                        });
                    });
                }).then(function(result) {
                    pg.end();
                    console.log('result get tables data', result);
                    return  {tables_data: ctx.tables_data, db_id: ctx.db.id};
                }).catch(function(err) {
                    console.log('get tables data err', err);
                    throw {message: err};
                });
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
                    ctx.db = db;

                    var conn_str = 'postgres://' + username + ':' + password + '@' + host + '/postgres';

                    return new Promise(function (resolve, reject) {
                        pg.connect(conn_str, function(err, client, done) {
                            if (err) {
                                reject(err);
                            } else {
                                console.log('Executing:', 'DROP DATABASE IF EXISTS ' + db.title);
                                client.query('DROP DATABASE IF EXISTS "' + db.title + '";', function(err) {
                                    if (err) {
                                        done();
                                        console.log('0 init_db error\n', err.stack);
                                        reject(err);
                                    } else {
                                        done();
                                        resolve();
                                    }
                                });
                            }
                        });
                    });
                    //выполняем команду dropdb
                    //return child_process.exec('dropdb -U ' + username + ' -W ' + password + 
                    //        ' ' + db.title + ';');
                }).then(function(result) {
                    //если скрипт отработал корректно, то нужно удалить запись о базе из бд
                    return ctx.db.destroy();
                }).catch(function(err) {
                    console.log('remove db method err', err);
                    throw {message: err};
                });
        });
    }


};
