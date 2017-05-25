//var convert_algebra = require('../lib/re_al_to_sql').convert_algebra_to_sql;
var AlgebraQueries = require('../lib/re_al_to_sql');

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
        var limit = 20,
            skip = 0,
            options = {};

        if (req.query.db_id)
            options.db_id = req.query.db_id;

        console.log('options', options);

        app.Question.findAndCountAll({
                where: options,
                include: [
                    {model: app.DataBase, attributes: ['id', 'title']}
                ],
                limit: limit,
                offset: skip
            }).then(function(questions) {
                //console.log('questions', questions.rows);
                res.render('questions/table', { questions: questions.rows });
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
        var id = Number(req.params.id);

        app.Question.find({
                where : {id: id},
                include: [{model: app.DataBase}]
            }).then(function (question) {
                //console.log('question', question);
                if (!question) {
                    throw {message: 'NotFound'};
                } else {
                    //тут необходимо будет сгенерировать схему бд в виде картинки
                    res.render('questions/show', { question: question });
                }
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
        console.log('question controller post trial', req.body);
        console.log('queeries', JSON.parse(req.body.queries));
        queries = JSON.parse(req.body.queries);
        //console.log('el', queries[0].alias);
        //res.success({});
        var algebra_answer = new AlgebraQueries(queries);
        //console.log('algebra answer', algebra_answer);

        //convert_algebra()
        algebra_answer.create_sql_script()
            .then(function(result) {
                console.log('result', result);

                return app.DataBase.execute_sql(req.body.db_id, result)
            }).then(function(query_res) {
                console.log('query_res', query_res.result.rows);
                res.success({});
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
    resource: 'Partner',
    methods: {
        get: get,
        post: post,
        put: put,
        delete: _delete
    }
}
