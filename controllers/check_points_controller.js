var AlgebraAnswer = require('../lib/RelationalAlgebraAnswer');
var TupleAnswer = require('../lib/TupleCalculusAnswer');
var TestCases = require('../lib/TestCases');
var count_pages = ApplicationHelper.count_pages;
var moment = require('moment');

var get = {
    '/': function (req, res) {
        res.render('check_points/index');
    },

    '/add':  function (req, res) { 
    var ctx = {};
    app.Group.findAll()
        .then (function(groups){
            ctx.group = groups;

            return app.DataBase.findAll()
        }).then (function (database){
                res.render('check_points/add', {groups: ctx.group, databases:database});
        });   
    },



    '/copy/:id': function (req, res) {
        var id = Number(req.params.id);

        var ctx = {};
        app.CheckPoint.findOne({
                where : {id: id},
            }).then(function (check_point) {
                res.render('check_points/add', {check_point: check_point});
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },


    '/table': function (req, res) {
        console.log('req.query', req.query);
        var options = {},
            groups_options = {},
            skip = 0,
            limit = 15,
            page = Number(req.query.page) || 1;

        if (page > 1)
            skip = limit * (page - 1);

        if (req.query.db_id)
            options.db_id = req.query.db_id;


        if (req.user.role.role == 'student') {
            groups_options = { group_id: req.user.student.group.id };
        }

        console.log('groups options', groups_options);

        app.CheckPoint.findAndCountAll({
                where: options,
                include: [{
                    model: app.CheckPointGroup, 
                    as: 'groups',
                    where: groups_options
                }],
                limit: limit,
                offset: skip
            }).then(function(check_points) {
                //console.log('check_points', check_points.rows);
                var pages =  count_pages(check_points.count, limit),
                    pages_min = (page - 3 < 1) ? 1 : page - 3,
                    pages_max = (pages_min + 6 > pages) ? pages : pages_min + 6;

                res.render('check_points/table', { 
                    check_points: check_points.rows,
                    page: page,
                    pages: pages,
                    pages_min: pages_min,
                    pages_max: pages_max
                });
                //res.render('check_points/table', { check_points: check_points.rows });
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },
    
    '/next_question/:id': function (req, res) {
        var id = Number(req.params.id);

        //найти следующий вопрос или закончить тестирование
        app.TestAnswer.next_question(id, req.user.id)
            .then(function(questions) {
                console.log('\n\n\nReturned next question\n', questions,'\n++++++++++++++++++++++++++++++++++++++');
                //TODO если следующий вопрос не нашелся, то нужно завершить тестирование
                if (questions.length > 0) {
                    res.render('questions/answer', { question: questions[0], check_point_id : id });
                } else {
                    //сделать запись об окончании контрольной работы
                    return app.TestAnswer.findOne({
                            where: {
                                check_point_id: id,
                                user_id: req.user.id
                            }
                        }).then(function(test_answer) {
                            if (!test_answer.end) {
                                test_answer.end = new Date();
                            }

                            return test_answer.save();
                        }).then(function (result) {
                            return app.CheckPoint.find({
                                where : {id: id},
                                include: [{
                                        model: app.TestAnswer,
                                        as: 'tests_answers',
                                        where: {user_id : req.user.id}
                                    },{
                                        model: app.TestCase,
                                        as: 'test_cases',
                                        include: [{
                                            model: app.TestCaseQuestion,
                                            as: 'questions',
                                            include: [{
                                                model: app.Question,
                                                include: [{
                                                    model: app.QuestionAnswer,
                                                    as: 'answers'
                                                }]
                                            }]
                                        }]
                                    }]
                            });
                        }).then(function (check_point) {
                            res.render('check_points/tests_results/show', { check_point: check_point});
                        }).catch(function(err) {
                            //найти следующий вопрос или закончить тестирование
                            console.log('err', err);
                            res.error('Error', err);
                        });
                }
            }).catch(function(err) {
                //найти следующий вопрос или закончить тестирование
                console.log('err', err);
                res.error('Error', err);
            });
    },

//Это вывод первого вопроса
    '/start_test/:id': function (req, res) {
        var id = Number(req.params.id);
        app.CheckPoint.findById(id).then(check_point => {
            console.log('\nCP values\n\n', check_point.dataValues);
            console.log('\nComplexity values\n\n', check_point.dataValues.test_config);
            if (check_point.dataValues.test_config.less_complexity > 0) {
                //nextQuestionDynamic
                app.TestAnswer.makeDynamic(id, req.user.id)
                    .then(function (question) {
                        res.render('questions/answer', { question : question, check_point_id : id});
                    })
                    .catch(function (err) {
                        console.log('\nmakeDynamic error:\n', err);
                        res.error('Error', err);
                    })
            } else {
                app.TestAnswer.make(id, req.user.id)
                    .then(function(questions) {
                        res.render('questions/answer', { question: questions[0], check_point_id : id });
                    })
                    .catch(function(err) {
                        console.log('err', err);
                        res.error('Error', err);
                    });
            }
        });


    },

    '/:id': function (req, res) {
        var options = {};
        options.id = Number(req.params.id);

        var ctx = {};

        app.CheckPoint.find({
                where : options,
                include: [{
                        model: app.CheckPointGroup,
                        as: 'groups',
                        include: [app.Group]
                    },{
                        model: app.TestCase,
                        as: 'test_cases',
                        include: [{
                            model: app.TestCaseQuestion, 
                            as: 'questions',
                            include: [app.Question]
                        }]
                    }]
            }).then(function (check_point) {
                console.log('check_point', check_point);

                if (!check_point) {
                    throw {message: 'NotFound'};
                }

                ctx.check_point = check_point.dataValues;

                //console.log('ctx.check_point', ctx.check_point);
                res.render('check_points/show', { check_point: ctx.check_point });
            }).catch(function (err) {
                console.log('err', err);
                res.error(err);
            });
    }

};

var post = {

        '/add': function (req, res) {
        console.log('\n\nreq.body.check_point_data\n', req.body.check_point_data);
        var check_point_data = req.body.check_point_data,
            test_cases_arr = [],
            groups = [];

        groups = req.body.groups_set;

        check_point_data.owner_id = req.user.id;
        let generationType = check_point_data.generation_type,
            testConfig = check_point_data.test_config;
        if (generationType == 'DYN') {
            //dynamic generation here
            let testComplexities = {
                start : testConfig.start_complexity,
                great : testConfig.great_complexity,
                less : testConfig.less_complexity
            };

            app.CheckPoint.makeDynamic(check_point_data, groups, req.body.questions_set)
                .then(function(result) {

                    //console.log('result add check point', result);
                    res.success(result);
                })
                .catch(function(err) {
                    console.log('err add check point', err);
                    res.error(err);
                });

        } else if (generationType == 'RND') {
            if (check_point_data.type == 'test'|| check_point_data.type == 'RA'|| check_point_data.type == 'TC') {
                var kostil = [{     //называть переменные костылями, ммм...
                    title: 'Вариант1',
                    questions: req.body.questions_set
                }];
                test_cases_arr = kostil;

                //TODO попробовать сегенерировать варианты
            }

            console.log('\n req.body.questions_set\n',  req.body.questions_set);

            app.CheckPoint.make(check_point_data, groups, req.body.questions_set)
                .then(function(result) {

                    //console.log('result add check point', result);
                    res.success(result);
                }).catch(function(err) {
                console.log('err add check point', err);
                res.error(err);
            });
        } else {

        }

        //TODO попробовать сегенерировать варианты
        //после генерации заполнить массив test_cases

    },


    '/trial': function(req, res) {
        var queries = JSON.parse(req.body.queries);
        var question_id = req.body.question_id;
        var db_id = req.body.db_id;
         var ctx = {};
         ctx.question = question;

            if(question.query_type == "RA"){
                    ctx.query_answer = new AlgebraAnswer(JSON.parse(req.body.queries));
            }
            else {
                    ctx.query_answer = new TupleAnswer(JSON.parse(req.body.queries));
            }
        var algebra_answer = new AlgebraAnswer(JSON.parse(req.body.queries));

         ctx.query_answer.create_sql_script()
            .then(function(result) {
                ctx.answer_sql = result;

                return app.DataBase.execute_sql(db_id, result);
            }).then(function(sql_res) {
                 ctx.query_answer.answer_data = sql_res.result.rows;
                ctx.answer_data = sql_res.result.rows;

                return app.Question.findById(question_id);
            }).then(function(question) {
                //TODO проверка прав возвращать ли правильный ответ
                ctx.right_answer_sql = question.sql_answer;

                return app.DataBase.execute_sql(db_id, question.sql_answer);
            }).then(function(sql_res) {
                 ctx.query_answer.right_answer_data = sql_res.result.rows;
                ctx.right_answer_data = sql_res.result.rows;
                //сверка результатов выполнения двух запросов
                var mark =  ctx.query_answer.check();
                ctx = Object.assign({}, mark, ctx)

                if (req.user.role.role == 'student') {
                    return app.QuestionAnswer.create({
                        answer: queries,
                        processed_answer:  ctx.query_answer.queries,
                        user_id: req.user.id,
                        question_id: question_id,
                        mark: mark.mark,
                        error: mark.comment,
                        sql: ctx.answer_sql
                    });
                } else {
                    return new Promise(function(resolve, reject) {
                        resolve();
                    });
                }
            }).then(function(result) {
                res.success(ctx);
            }).catch(function(err) {

                return app.QuestionAnswer.create({
                    answer: queries,
                    processed_answer:  ctx.query_answer.queries,
                    user_id: req.user.id,
                    question_id: question_id,
                    mark: 0,
                    error: err,
                    sql: (ctx.answer_sql ? ctx.answer_sql : "Не удалось выполнить генерацию SQL.")
                }).then(function(result) {
                    res.error(err);
                }).catch(function(err_saving_log) {
                    res.error(err);
                });
            });
    },

};


var _delete = {
   '/remove/:id':  function (req, res) {
        var id = Number(req.params.id);

        app.CheckPoint.destroy({where: {id: id}})
            .then(function () {
                 res.success();
            }).catch(function(err) {
                res.error('Error', err);
            });
    }
};

var put = {
   '/:id':  function (req, res) {
       console.log('in question put controller', req.body);
        var id = Number(req.params.id);
        var data = {};

        if (req.body.name && req.body.value)
            data[req.body.name] = req.body.value;
        else
            data = req.body;

        // нельзя для вопроса менять поля
        delete data.query_type;
        delete data.db_id;
        delete data.db_title;
        delete data.deleted;

        if (data.sql_answer) {
            data.sql_answer = data.sql_answer.replace(/\"/g, "'");
        }

        console.log('data', data);
        app.Question.update(
                data, 
                {where: {id: id}}
            ).then(function() {
                res.success({});
            }).catch(function(err) {
                res.error('Error', err);
            });
    }
};

module.exports = {
    resource: 'Question',
    methods: {
        get: get,
        post: post,
        put: put,
        delete: _delete
    }
}

