var AlgebraAnswer = require('../lib/RelationalAlgebraAnswer');
var count_pages = ApplicationHelper.count_pages;
var multer  = require('multer')
var upload = multer({ dest: 'file_of_material/' }).array('mt', 12);

var get = {
    '/': function (req, res) {
        res.render('materials/index');
    },

    '/add': function (req, res) {
        app.Material.findAll({
            attributes: ['id', 'title', 'type', 'material_name']
        }).then(function(dbs) {
            console.log('тест тестовый');
            res.render('materials/add_mt', {dbs: dbs});
        }).catch(function(err) {
            console.log('err', err);
            res.error('Error', err);
        });
    },

    '/table': function (req, res) {
        console.log('req.query', req.query);
        var control_col = req.query.control_col || true;
        console.log('control_col', control_col);
        delete req.query.control_col;

        var options = req.query || {},
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

        app.Material.findAndCountAll({
            where: options,
            limit: limit,
            offset: skip,
            logging: console.log
        }).then(function(materials) {
            //console.log('materials', materials.rows);
            var pages =  count_pages(materials.count, limit),
                pages_min = (page - 3 < 1) ? 1 : page - 3,
                pages_max = (pages_min + 6 > pages) ? pages : pages_min + 6;

            console.log('control_col', control_col);
            res.render('materials/table', {
                materials: materials.rows,
                control_col: control_col,
                page: page,
                pages: pages,
                pages_min: pages_min,
                pages_max: pages_max
            });
            //res.render('materials/table', { materials: materials.rows });
        }).catch(function(err) {
            console.log('err', err);
            res.error('Error', err);
        });
    },

    '/trial/:id': function (req, res) {
        var id = Number(req.params.id);

        app.Material.find({
            where : {id: id},
            include: [{model: app.DataBase}]
        }).then(function(material) {
            res.render('materials/trial', { material: material });
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

        app.Material.find({
            where : options,
            include: [{model: app.DataBase}]
        }).then(function (material) {

            if (!material) {
                throw {message: 'NotFound'};
            } else {
                ctx.material = material;
                return app.DataBase.execute_sql(material.db_id, material.sql_answer);
            }
        }).then(function(sql_res) {

            ctx.material.right_answer_data = sql_res.result.rows;
            res.render('materials/show', { material: ctx.material });
        }).catch(function (err) {
            console.log('err', err);
            res.error(err);
        });
    }

};

var post = {

    '/add': function (req, res) {
        //console.log('in materials add controlle',  req.files);
        //var res_data = {};
        //var material_data = req.body;
        //console.log('material_data', material_data);
        //material_data.owner_id = req.user.id;

        upload(req, res, function (err) {
            if (err) {
                console.log('err', err)
            }
            var material_data = req.body;
            material_data.owner_id = req.user.id;
            //console.log('УХАХАХА', material_data);
            console.log(req);
            app.Material.make(material_data, req.files[0].filename)
                .then(function (material) {
                    //console.log('КОНТРОЛЛЕР', material);
                    res.success({});
                }).catch(function (err) {
                console.log('err', err);
                res.error(err);
            });
        });
    }
};

var post = {
    '/download': function (req, res) {
        //console.log('in materials add controlle',  req.files);
        //var res_data = {};
        //var material_data = req.body;
        //console.log('material_data', material_data);
        //material_data.owner_id = req.user.id;

            var body = '';
            var filePath = __dirname + '/file_of_material/hello.txt';
            request.on('data', function(data) {
                body += data;
            });
            request.on('end', function (){
                fs.appendFile(filePath, body, function() {
                    respond.end();
                });
            });
        }
    }

var _delete = {
    '/remove/:id':  function (req, res) {
        var id = Number(req.params.id);

        app.Material.destroy({where: {id: id}})
            .then(function() {
                console.log('here');
                res.success({});
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    }
};

module.exports = {
    resource: 'Material',
    methods: {
        get: get,
        post: post,
        delete: _delete
    }
}