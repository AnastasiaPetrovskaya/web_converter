//var convert_algebra = require('../lib/re_al_to_sql').convert_algebra_to_sql;
var AlgebraAnswer = require('../lib/RelationalAlgebraAnswer');
var count_pages = ApplicationHelper.count_pages;

var get = {
    '/': function (req, res) {
        res.render('questions/index');
    },

    '/table': function (req, res) {
        console.log('req.query', req.query);
        var options = req.query || {},
            skip = 0,
            limit = 15,
            page = Number(req.query.page) || 1;

        if (page > 1)
            skip = limit * (page - 1);

        //if (req.user.role.role == 'student') {
        //    options.db_type = { 
        //        $or: [
        //            {$eq: 'common'}, 
        //            {$eq: 'prepare'}
        //        ]
        //    };
        //}

        app.QuestionAnswer.findAndCountAll({
                where: options,
                include: [{
                    model: app.Question,
                    include: [{
                        model: app.DataBase, 
                        attributes: ['id', 'title']
                    }]
                }],
                limit: limit,
                offset: skip
            }).then(function(answers) {
                console.log('answers', answers.rows);
                var pages =  count_pages(answers.count, limit),
                    pages_min = (page - 3 < 1) ? 1 : page - 3,
                    pages_max = (pages_min + 6 > pages) ? pages : pages_min + 6;

                res.render('questions_answers/table', { 
                    answers: answers.rows,
                    page: page,
                    pages: pages,
                    pages_min: pages_min,
                    pages_max: pages_max
                });
                //res.render('answers/table', { answers: answers.rows });
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },

    '/:id': function (req, res) {
        var options = {};
        options.id = Number(req.params.id);

        //if (req.user.role.role == 'student') {
        //    options.db_type = { 
        //        $or: [
        //            {$eq: 'common'}, 
        //            {$eq: 'prepare'}
        //        ]
        //    };
        //}

        var ctx = {};

        app.QuestionAnswer.findOne({
                where: options,
                include: [{
                    model: app.Question,
                    include: [{
                        model: app.DataBase, 
                        attributes: ['id', 'title']
                    }]
                }],
            }).then(function (answer) {

                if (!answer) {
                    throw {message: 'NotFound'};
                } else {
                    ctx.answer = answer;
                    return app.DataBase.execute_sql(answer.question.db_id, answer.question.sql_answer);
                }
            }).then(function(sql_res) {

                ctx.answer.right_answer_data = sql_res.result.rows;
                return app.DataBase.execute_sql(ctx.answer.question.db_id, ctx.answer.sql);
            }).then(function(student_sql_res) {
                ctx.answer.data = student_sql_res.result.rows;

                res.render('questions_answers/show', { answer: ctx.answer });
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
