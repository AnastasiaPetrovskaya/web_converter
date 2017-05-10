
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

    '/table': function (req, res) {
        var limit = 20,
            skip = 0;

        app.Question.findAndCountAll({
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
        question_data.owner_id = req.user.id;

        app.Question.make(question_data)
            .then(function(question) {
                console.log('question created', question);
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
