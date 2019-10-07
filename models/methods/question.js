'use strict'
var pg = require('pg');
var username = app.config.postgres.user;
var password = app.config.postgres.password;
var database = app.config.postgres.database;
var host = app.config.postgres.host;


module.exports = function (models) {
    var DataBase = models.DataBase;
    var Question = models.Question;

    Question.make = function (question_data, filename) {

        return sequelize.transaction(function (t) {
            return DataBase.findOne({
                    where: {id: question_data.db_id},
                    transaction: t
                }).then(function (db) {
                    if (!db)
                        throw {message: 'DdNotExists'};

                    question_data.db_type = db.type;
                    return Question.create(question_data, {transaction: t});
                }).then(function(result) {
                    console.log('result', result);
                    return result;
                });
        });
    },

    Question.remove = function (question_id) {
        console.log('question_id', question_id);

        return sequelize.transaction(function (t) {
            return Question.findOne({
                    where: {id: question_id},
                    transaction: t
                }).then(function (question) {
                    if (!question)
                        throw {message: 'DdDoNotExists'};

                    //если скрипт отработал корректно, то нужно удалить запись о базе из бд
                    return question.destroy();
                }).catch(function(err) {
                    console.log('remove db method err', err);
                    throw {message: err};
                });
        });
    }
};
