var count_pages = ApplicationHelper.count_pages;

var get = {
    '/table': function (req, res) {
        var options = {},
            skip = 0,
            limit = 15,
            page = Number(req.query.page) || 1;

        console.log('here');
        if (page > 1)
            skip = limit * (page - 1);

        ['check_point_id', 'user_id', 'test_case_id'].forEach(function(param) {
            if (req.query[param]) {
                options[param] = req.query[param];
            }
        });

        app.TestAnswer.findAndCountAll({
            where: options,
            distinct : true,
            group: ['test_answer.id', 'user.id', 'check_point.id', 'test_case.id'],
            attributes: ['id', 'total_mark', 'updatedAt'],
            include: [{
                model: app.User,
                attributes: ['id', 'name'],
            }, {
                model: app.CheckPoint,
                attributes : [
                    'id', 'title',
                    [
                        sequelize.fn('COUNT', sequelize.literal('DISTINCT "check_point.answers".id')),
                        'questions_amount'
                    ],[
                        sequelize.fn('COUNT',
                        sequelize.literal('DISTINCT case when "check_point.answers".mark > 0 then "check_point.answers".id else null end')),
                        'right_questions_amount'
                    ]
                ],
                include : {
                    model: app.QuestionAnswer,
                    required: false,
                    where: {user_id : {$col :'user.id'}},
                    as: 'answers',
                    attributes : []}
            }, {
                model: app.TestCase,
                attributes : [
                    'id', 'title',
                    [
                        sequelize.fn('COUNT', sequelize.literal('DISTINCT "test_case.questions".id')),
                        'questions_amount'
                    ]
                ],
                include : {
                    model: app.TestCaseQuestion,
                    as: 'questions',
                    attributes : []}
            }],
            order : 'id DESC',
            logging: console.log,

            //limit: limit,
            //offset: skip
        }).then(function(tests_answers) {
            console.log('tests_answers', tests_answers.rows[0].test_case);
            var pages =  count_pages(tests_answers.count.length, limit),
            pages_min = (page - 3 < 1) ? 1 : page - 3,
            pages_max = (pages_min + 6 > pages) ? pages : pages_min + 6;

            res.render('tests_answers/table', {
                tests_answers: tests_answers.rows,
                page: page,
                pages: pages,
                pages_min: pages_min,
                pages_max: pages_max
            });
        }).catch(function(err) {
            console.log('err', err);
            res.error('Error', err);
        });
    },


    '/:id': function (req, res) {
        var id = Number(req.params.id);
        var ctx = {};

        app.Group.find({
                where : {id: id},
                include: [{model: app.Student, as: 'students'}]
            }).then(function (group) {

                if (!group) {
                    throw {message: 'NotFound'};
                } else {
                    ctx.group = group;
                    res.render('groups/show', { group: ctx.group });
                }
            }).catch(function (err) {
                console.log('err', err);
                res.error(err);
            });
    }

};

var put = {};

var _delete = {
   '/remove/:id':  function (req, res) {
        var id = Number(req.params.id);

        app.TestAnswer.destroy({where: {id: id}}).then(function() {
            res.success();
        }).catch(function(err) {
            res.error('Error', err);
        });
    }
};


module.exports = {
    resource: 'TestAnswer',
    methods: {
        get: get,
        put: put,
        delete: _delete
    }
}
