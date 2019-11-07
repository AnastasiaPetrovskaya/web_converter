'use strict'
var AlgebraAnswer = require('../../lib/RelationalAlgebraAnswer');
var TupleAnswer = require('../../lib/TupleCalculusAnswer');

module.exports = function (models) {
    var DataBase = models.DataBase;
    var Question = models.Question;
    var QuestionAnswer = models.QuestionAnswer;

    QuestionAnswer.make = function (user_id, question_id, db_id, queries, check_point_id) {
        var ctx = {};
        console.log('[' + new Date() + '] user ' + user_id, ' question: ', question_id, ' Вызвана QuestionAnswer.make');

        return app.Question.findById(question_id).then((result) => {
            return result.dataValues;
        }).then(question => {

                if (question.query_type == "RA") {
                    ctx.query_answer = new AlgebraAnswer(queries);
                } else {
                    ctx.query_answer = new TupleAnswer(queries);
                }

                return ctx.query_answer.create_sql_script();

        }).then(function(result) {
            ctx.answer_sql = result;
            console.log('[' + new Date() + '] user ' + user_id, ' question: ', question_id, 'sql generated:\n', result);
            return app.DataBase.execute_sql(db_id, result);

        }).then(function(sql_res) {
            console.log('[' + new Date() + '] user ' + user_id, ' question: ', question_id, 'has result rows(N)\n', sql_res.result.rows.length);
            ctx.query_answer.answer_data = sql_res.result.rows;
            ctx.answer_data = sql_res.result.rows;

            return app.Question.findById(question_id);
        }).then(function(question) {

            ctx.right_answer_sql = question.sql_answer;
            return app.DataBase.execute_sql(db_id, question.sql_answer);
        }).then(function(sql_res) {

            ctx.query_answer.right_answer_data = sql_res.result.rows;
            ctx.right_answer_data = sql_res.result.rows;
            //сверка результатов выполнения двух запросов
            console.log('[' + new Date() + '] user ' + user_id, ' question: ', question_id, 'compare answers');
            var mark = ctx.query_answer.check();
            ctx = Object.assign({}, mark, ctx);

            return app.QuestionAnswer.create({
                answer: queries,
                processed_answer: ctx.query_answer.queries,
                user_id: user_id,
                question_id: question_id,
                check_point_id: check_point_id,
                mark: mark.mark,
                error: mark.comment,
                sql: ctx.answer_sql,
                created: new Date(),
                updated: new Date(),
            }).catch((err) => {
                console.log('QA create error', err);
                throw err;
            });

        }).then(function(result) {

            console.log('[' + new Date() + '] ', 'Answer created with data:\n', result.dataValues);
            //Обновить общую оценку
            return app.TestAnswer.findOne({
                where : {
                    check_point_id : check_point_id,
                    user_id : user_id
                }
            }).then(test_answer => {
                if (!test_answer) {
                    return  { message: 'Нельзя обновить оценку для тренировочного вопроса'};
                } else {
                    test_answer.total_mark = test_answer.dataValues.total_mark + result.dataValues.mark;

                    return test_answer.save();
                }
            }).then(() => {
                return result;
            }).catch(err => {
                console.log('\nError in total mark finding and upd. Error:\n', err);
                throw err;
            });
        }).catch(function(err) {
            return app.QuestionAnswer.create({
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
                throw err;
            })
            .catch(function(err_saving_log) {
                throw err;
            });
        });
    };


};
