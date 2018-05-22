var count_pages = ApplicationHelper.count_pages;

var get = {
    '/': function (req, res) {
        res.render('groups/index');
    },


    '/table': function (req, res) {
        //console.log('req.query', req.query);
        var options = {},
            skip = 0,
            limit = 15,
            page = Number(req.query.page) || 1;

        if (page > 1)
            skip = limit * (page - 1);

        if (req.query.db_id)
            options.db_id = req.query.db_id;

        app.Group.findAndCountAll({
                attributes: ['group.*',  [sequelize.fn('COUNT', sequelize.col('students.id')), 'students_count']],
                where: options,
                include: [{
                    model: app.Student, 
                    as: 'students', 
                    attributes: [], 
                    duplicating: false}],
                group: ['group.id'],
                raw: true,
                limit: limit,
                offset: skip
            }).then(function(groups) {
                console.log('groups', groups);
                var pages =  count_pages(groups.count.length, limit),
                    pages_min = (page - 3 < 1) ? 1 : page - 3,
                    pages_max = (pages_min + 6 > pages) ? pages : pages_min + 6;

                res.render('groups/table', { 
                    groups: groups.rows,
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

var post = {

    '/add': function (req, res) {
        var res_data = {};
        var group_data = req.body;
        console.log('group_data', group_data);

        app.Group.create(group_data)
            .then(function(group) {
                //console.log('group created', group);
                res.success({
                    id: group.dataValues.id, 
                    title: group.dataValues.title
                });
            }).catch(function(err) {
                console.log('err', err);
                res.error(err);
            });
    }

};


var _delete = {
   '/remove/:id':  function (req, res) {
        var id = Number(req.params.id);
        console.log('ывывывывыв', id);

        app.Group.destroy({where: {id: id}}).then(function() {
                res.success();
            }).catch(function(err) {
                res.error('Error', err);
            });
    }
};

var put = {
   '/:id':  function (req, res) {
       console.log('in group put controller', req.body);
        var id = Number(req.params.id);
        var data = {};

        if (req.body.name && req.body.value)
            data[req.body.name] = req.body.value;
        else
            data = req.body;

        console.log('data', data);
        app.Group.update(
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
    resource: 'Group',
    methods: {
        get: get,
        post: post,
        put: put,
        delete: _delete
    }
}
