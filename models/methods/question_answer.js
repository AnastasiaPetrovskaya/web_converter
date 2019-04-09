'use strict'
var AlgebraAnswer = require('../../lib/RelationalAlgebraAnswer');
var TupleAnswer = require('../../lib/TupleCalculusAnswer');

module.exports = function (models) {
    var DataBase = models.DataBase;
    var Question = models.Question;
    var QuestionAnswer = models.QuestionAnswer;

    QuestionAnswer.make = function (user_id, question_id, db_id, queries, check_point_id) {
        var ctx = {};
        console.log('Вызвана QuestionAnswer.make\n\n-------------------------------------\n\n');

        return app.Question.findById(question_id)
            .then((result) => {//take only question data
                //console.log('\n\nИщем вопрос по его id\n\n------------------------------------\n\n');
                return result.dataValues;
                })
            .then(question => {//make answer by queries

                if (question.query_type == "RA") {
                    ctx.query_answer = new AlgebraAnswer(queries);
                }
                else {
                    ctx.query_answer = new TupleAnswer(queries);
                }
                //console.log('\n\nЗаписали в ctx преобразованный ответ\n', ctx.query_answer,'\n\n------------------------------\n\n')
                return ctx;
                })
            .then(ctx => {//generate SQL request to DB

                return ctx.query_answer.create_sql_script()
                    .then(function(result) {
                        //console.log('\n\n\nSQL created\n', result, '\n----------------------------------------------\n');
                        ctx.answer_sql = result;
                        return app.DataBase.execute_sql(db_id, result);
                        })
                    .then(function(sql_res) {
                        //console.log('\n\nРезультат выполнения SQL есть\n------------------------------------\n');
                        ctx.query_answer.answer_data = sql_res.result.rows;
                        ctx.answer_data = sql_res.result.rows;

                        return app.Question.findById(question_id);
                        })
                    .then(function(question) {
                        ctx.right_answer_sql = question.sql_answer;
                        //console.log();
                        return app.DataBase.execute_sql(db_id, question.sql_answer);
                        })
                    .then(function(sql_res) {
                        //console.log('\n\n\nSQL exeqted!');
                        ctx.query_answer.right_answer_data = sql_res.result.rows;
                        ctx.right_answer_data = sql_res.result.rows;
                        //сверка результатов выполнения двух запросов
                        var mark = ctx.query_answer.check();
                        //console.log('\n\n\nОценка за вопрос : ', mark,'\n------------------------------------------\n');
                        ctx = Object.assign({}, mark, ctx);

                        return app.QuestionAnswer.create({
                            answer: queries,
                            processed_answer: ctx.query_answer.queries,
                            user_id: user_id,
                            question_id: question_id,
                            check_point_id: check_point_id,
                            mark: mark.mark,
                            error: mark.comment,
                            sql: ctx.answer_sql
                        });
                        })
                    .then(function(result) {
                        console.log('\n\n\nAnswer created with data:\n', result.dataValues, '\n------------------------------\n');
                        //Обновить общую оценку
                        app.TestAnswer.findOne(
                            {
                                where : {
                                    check_point_id : check_point_id,
                                    user_id : user_id
                                }
                            }
                        )
                            .then(test_answer => {
                                app.TestAnswer.update(
                                    {total_mark : test_answer.dataValues.total_mark + result.dataValues.mark},
                                    {
                                        where : {
                                            id : test_answer.dataValues.id
                                        }
                                    }
                                )
                                    .catch(err => {
                                        console.log('\nTotal mark not upd. Error:\n', err);
                                        throw err
                                    })
                            })
                            .catch(error => {
                                console.log('\nError in total mark finding and upd. Error:\n', error);
                                throw error
                            });
                        return result;
                        })
                    .catch(function(err) {
                        app.QuestionAnswer.create({
                            answer: queries,
                            processed_answer: ctx.query_answer.queries,
                            user_id: user_id,
                            question_id: question_id,
                            check_point_id: check_point_id,
                            mark: 0,
                            error: err.message,
                            sql: (ctx.answer_sql ? ctx.answer_sql : "Не удалось выполнить генерацию SQL.")
                            })
                            .then(function(result) {
                                //console.log('\n\n\nQA create result :\n', result.dataValues,'\n+=+=+=+=+=+=+=++=+=+=+=+=+=+=++=+=+=+=+=+=+=++=+=+=+=+=+=+=+')
                                throw err;
                                })
                            .catch(function(err_saving_log) {
                                //console.log('\n\n\nerror creating question answer if err!!!!!!!!!!!!!!!!!!!!!!!!!!!', err_saving_log);
                                throw err;
                                });
                        })
                    .catch(function(err) {

                        //console.log('\n\n\nerrr while saving incorrect answer');

                        throw err;
                        });
                    });

    }


};
