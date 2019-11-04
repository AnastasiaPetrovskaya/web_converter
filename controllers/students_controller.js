var count_pages = ApplicationHelper.count_pages;

var get = {
    '/': function (req, res) {

        app.Group.findAll()
            .then(function(groups) {
                res.render('students/index', {groups: groups});
            });
    },


    '/table': function (req, res) {
        var options = {},
            students_options = {},
            skip = 0,
            limit = 20,
            page = Number(req.query.page) || 1;

        if (page > 1) {
            skip = limit * (page - 1);
        }

        if (req.query.group_id) {
            students_options.group_id = req.query.group_id;
        }

        options.student_id = {$ne: null};

        app.User.findAndCountAll({
                where: options,
                include: [{
                    model: app.Student,
                    where: students_options,
                    include: [{
                        model: app.Group
                    }]
                }],
                limit: limit,
                offset: skip
            }).then(function(students) {
                //console.log('students', students.rows);
                var pages =  count_pages(students.count, limit),
                    pages_min = (page - 3 < 1) ? 1 : page - 3,
                    pages_max = (pages_min + 6 > pages) ? pages : pages_min + 6;

                res.render('students/table', { 
                    students: students.rows,
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

        app.User.findOne({
                where: {id: id},
                include: [{
                    model: app.Student,
                    include: [{
                        model: app.Group
                    }]
                }],
            }).then(function (student) {
                //console.log('student', student);

                if (!student) {
                    throw {message: 'NotFound'};
                } else {
                    res.render('students/show', { student: student.dataValues });
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
        var student_data = req.body;
        //console.log('student_data', student_data);

        app.Student.make(student_data)
            .then(function(result) {
                console.log('student created', result);

                res.success({});
                //res.success({
                //    id: student.dataValues.id, 
                //    title: student.dataValues.title
                //});
            }).catch(function(err) {
                console.log('err', err);
                res.error(err);
            });
    }

};


var _delete = {
   '/remove/:id':  function (req, res) {
        var id = Number(req.params.id);
                console.log('hdhdhdhuuuuuu', id);

        app.User.destroy({where: {id: id}})
        .then(function() {
                       console.log('jojojojojojojojojojo', id);

                res.success();
            }).catch(function(err) { 
                     console.log('plplplplplplplpl', id);
                res.error('Error', err);
            });
    }
};

var put = {
   '/:id':  function (req, res) {
       console.log('in student put controller', req.body);
        var id = Number(req.params.id);
        var data = {};

        if (req.body.name && req.body.value)
            data[req.body.name] = req.body.value;
        else
            data = req.body;

        console.log('data', data);
        app.Student.update(
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
    resource: 'Student',
    methods: {
        get: get,
        post: post,
        put: put,
        delete: _delete
    }
}
