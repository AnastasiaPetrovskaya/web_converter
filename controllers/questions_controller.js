//var convert_algebra = require('../lib/re_al_to_sql').convert_algebra_to_sql;
var AlgebraAnswer = require('../lib/RelationalAlgebraAnswer');
var count_pages = ApplicationHelper.count_pages;

var get = {
    '/': function (req, res) {
        res.render('questions/index');
    },

    '/add': function (req, res) {

        //получение списка всех учебных баз данных
        app.DataBase.findAll({
                attributes: ['id', 'title', 'type']
            }).then(function(dbs) {
                res.render('questions/add', {dbs: dbs});
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },

    '/copy/:id': function (req, res) {
        var id = Number(req.params.id);

        var ctx = {};
        //получение списка всех учебных баз данных
        app.Question.find({
                where : {id: id},
                include: [{model: app.DataBase}]
            }).then(function (question) {
                ctx.question = question;
                return app.DataBase.findAll({
                        attributes: ['id', 'title', 'type']
                });
            }).then(function(dbs) {
                res.render('questions/add', {dbs: dbs, question: ctx.question});
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },

    '/table': function (req, res) {
        console.log('req.query', req.query);
        var options = {},
            skip = 0,
            limit = 15,
            page = Number(req.query.page) || 1;

        if (page > 1)
            skip = limit * (page - 1);

        if (req.query.db_id)
            options.db_id = req.query.db_id;

        if (req.user.role.role == 'student') {
            options.db_type = { 
                $or: [
                    {$eq: 'common'}, 
                    {$eq: 'prepare'}
                ]
            };
        }

        app.Question.findAndCountAll({
                where: options,
                include: [
                    {model: app.DataBase, attributes: ['id', 'title']}
                ],
                limit: limit,
                offset: skip
            }).then(function(questions) {
                //console.log('questions', questions.rows);
                var pages =  count_pages(questions.count, limit),
                    pages_min = (page - 3 < 1) ? 1 : page - 3,
                    pages_max = (pages_min + 6 > pages) ? pages : pages_min + 6;

                res.render('questions/table', { 
                    questions: questions.rows,
                    page: page,
                    pages: pages,
                    pages_min: pages_min,
                    pages_max: pages_max
                });
                //res.render('questions/table', { questions: questions.rows });
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },

    '/trial/:id': function (req, res) {
        var id = Number(req.params.id);

        app.Question.find({
                where : {id: id},
                include: [{model: app.DataBase}]
            }).then(function(question) {
                res.render('questions/trial', { question: question });
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },

    '/:id': function (req, res) {
        var options = {};
        options.id = Number(req.params.id);

        if (req.user.role.role == 'student') {
            options.db_type = { 
                $or: [
                    {$eq: 'common'}, 
                    {$eq: 'prepare'}
                ]
            };
        }

        var ctx = {};

        app.Question.find({
                where : options,
                include: [{model: app.DataBase}]
            }).then(function (question) {

                if (!question) {
                    throw {message: 'NotFound'};
                } else {
                    ctx.question = question;
                    return app.DataBase.execute_sql(question.db_id, question.sql_answer);
                }
            }).then(function(sql_res) {

                ctx.question.right_answer_data = sql_res.result.rows;
                res.render('questions/show', { question: ctx.question });
            }).catch(function (err) {
                console.log('err', err);
                res.error(err);
            });
    }

};

var post = {

    '/add': function (req, res) {
        var res_data = {};
        var question_data = req.body;
        console.log('question_data', question_data);
        question_data.owner_id = req.user.id;
        if (question_data.sql_answer) {
            question_data.sql_answer = question_data.sql_answer.replace(/\"/g, "'");
        }

        app.Question.make(question_data)
            .then(function(question) {
                //console.log('question created', question);
                res.success({
                    id: question.dataValues.id, 
                    title: question.dataValues.title
                });
            }).catch(function(err) {
                console.log('err', err);
                res.error(err);
            });
    },

    '/trial': function(req, res) {
        //console.log('question controller post trial', req.body);
        //console.log('queeries', JSON.parse(req.body.queries));
        queries = JSON.parse(req.body.queries);
        var question_id = req.body.question_id;
        var db_id = req.body.db_id;
        //console.log('el', queries[0].alias);
        //res.success({});
        var algebra_answer = new AlgebraAnswer(queries);
        //console.log('algebra answer', algebra_answer);

        //convert_algebra()
        var ctx = {};
        algebra_answer.create_sql_script()
            .then(function(result) {
                ctx.answer_sql = result;
                //console.log('result', result);

                return app.DataBase.execute_sql(db_id, result);
            }).then(function(sql_res) {
                //console.log('query_res', sql_res.result.rows);
                algebra_answer.answer_data = sql_res.result.rows;
                ctx.answer_data = sql_res.result.rows;

                return app.Question.findById(question_id);
            }).then(function(question) {
                //TODO проверка прав возвращать ли правильный ответ
                ctx.right_answer_sql = question.sql_answer;

                return app.DataBase.execute_sql(db_id, question.sql_answer);
            }).then(function(sql_res) {
                algebra_answer.right_answer_data = sql_res.result.rows;
                ctx.right_answer_data = sql_res.result.rows;
                var mark = algebra_answer.check();

                //console.log('!!!!!!!!!!!!!!!!!!mark', mark);
                console.log('!!!!!!!!!!!!!!!!!!ctx', ctx);
                var result = Object.assign({}, mark, ctx)

                //сверка результатов выполнения двух запросов
                res.success(result);
            }).catch(function(err) {
                console.log('post /trial err', err);
                res.error(err);
            });
    },

};


var _delete = {
   '/remove/:id':  function (req, res) {
        var id = Number(req.params.id);

        app.Question.remove(id)
            .then(function() {
                res.success({});
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
