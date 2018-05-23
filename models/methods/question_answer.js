'use strict'
var AlgebraAnswer = require('../../lib/RelationalAlgebraAnswer');

module.exports = function (models) {
    var DataBase = models.DataBase;
    var Question = models.Question;
    var QuestionAnswer = models.QuestionAnswer;

    QuestionAnswer.make = function (user_id, question_id, db_id, queries, check_point_id) {
        var ctx = {};
        var algebra_answer = new AlgebraAnswer(queries);

        console.log('in question answer make check point id', check_point_id);
        var ctx = {};
        return algebra_answer.create_sql_script()
            .then(function(result) {
                ctx.answer_sql = result;
                console.log('result', result);

                return app.DataBase.execute_sql(db_id, result);
            }).then(function(sql_res) {
                console.log('query_res', sql_res.result.rows);
                algebra_answer.answer_data = sql_res.result.rows;
                ctx.answer_data = sql_res.result.rows;

                return app.Question.findById(question_id);
            }).then(function(question) {
                //TODO проверка прав возвращать ли правильный ответ
                ctx.right_answer_sql = question.sql_answer;

                return app.DataBase.execute_sql(db_id, question.sql_answer);
            }).then(function(sql_res) {
                console.log('sql.res !!!!!!!!!!!!!!!!', sql_res.result.rows);
                algebra_answer.right_answer_data = sql_res.result.rows;
                ctx.right_answer_data = sql_res.result.rows;
                //сверка результатов выполнения двух запросов
                var mark = algebra_answer.check();
                ctx = Object.assign({}, mark, ctx)


                console.log('creating question answer!!!!!!!!!!!!!!!!!!!!!!!!!!!');

                return app.QuestionAnswer.create({
                    answer: queries,
                    processed_answer: algebra_answer.queries,
                    user_id: user_id,
                    question_id: question_id,
                    check_point_id: check_point_id,
                    mark: mark.mark,
                    error: mark.comment,
                    sql: ctx.answer_sql
                });
            }).then(function(result) {
                //return result;
                return ctx;
            }).catch(function(err) {
                console.log('post /trial err', err);

                console.log('creating question answer if err!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                app.QuestionAnswer.create({
                    answer: queries,
                    processed_answer: algebra_answer.queries,
                    user_id: user_id,
                    question_id: question_id,
                    check_point_id: check_point_id,
                    mark: 0,
                    error: err.message,
                    sql: (ctx.answer_sql ? ctx.answer_sql : "Не удалось выполнить генерацию SQL.")
                }).then(function(result) {
                    console.log('result', result);
                    //throw err;
                    return ctx;
                }).catch(function(err) {
                    console.log('error creating question answer if err!!!!!!!!!!!!!!!!!!!!!!!!!!!', err);
                    throw err.message;
                });
            }).catch(function(err) {

                console.log('errr while savong incorrect answer');

                throw err;
            });



    }


};
