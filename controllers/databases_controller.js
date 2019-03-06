/*var Partner = app.Partner,
    User = app.User,
    Role = app.Role,
    Terminal = app.Terminal,
    TerminalSession = app.TerminalSession,
    MoneyTransfer = app.MoneyTransfer,
    Jackpot = app.Jackpot,
    count_pages = ApplicationHelper.count_pages,
    check_access = ApplicationHelper.check_access,
    PartnersHelper = require('../helpers/partners_helper');
*/
//var multiparty = require('multiparty');
var multer  = require('multer')
var upload = multer({ dest: 'mdb2postgres/' }).array('db', 12);
var count_pages = ApplicationHelper.count_pages;

var get = {
    '/': function (req, res) {
        //console.log('app', app);
        res.render('databases/index');
    },

    '/tables_data/:id': function(req, res) {

        app.DataBase.tables_data(req.params.id)
            .then(function(result) {

                //console.log('result in controller tables_data', result);
                res.render('databases/tables_data', {
                    tables: result.tables_data, 
                    db_id: result.db_id 
                });
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },

    '/table': function (req, res) {
        var options = {},
            skip = 0,
            limit = 15,
            page = Number(req.query.page) || 1;

        if (req.user.role.role == 'student') {
            options.type = { 
                $or: [
                    {$eq: 'common'}, 
                    {$eq: 'prepare'}
                ]
            };
        }

        if (page > 1)
            skip = limit * (page - 1);

         app.DataBase.findAndCountAll({
                where: options,
                limit: limit,
                offset: skip
            }).then(function(dbs) {
                //console.log('dbs', dbs);
                var pages =  count_pages(dbs.count, limit),
                    pages_min = (page - 3 < 1) ? 1 : page - 3,
                    pages_max = (pages_min + 6 > pages) ? pages : pages_min + 6;

                res.render('databases/table', { 
                    dbs: dbs.rows,
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

    '/schema/:id': function (req, res) {
        app.DataBase.get_schema(req.params.id)
            .then(function(filename) {
                //console.log('filename', filename);
                res.success({'file': filename })
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },

    '/:id': function (req, res, next) {
        var options = {};
        options.id = Number(req.params.id);

        if (req.user.role.role == 'student') {
            options.type = { 
                $or: [
                    {$eq: 'common'}, 
                    {$eq: 'prepare'}
                ]
            };
        }

        app.DataBase.find({
            where : options,
            include: [{as: 'tables', model: app.Table}]
            }).then(function (db) {
                if (!db) {
                    throw {message: 'NotFound'};
                } else {
                    //тут необходимо будет сгенерировать схему бд в виде картинки
                    res.render('databases/show', { db: db });
                }
            }).catch(function (err) {
                console.log('err', err);
                next(err);
                //res.error(err);
            });
    }

};

var post = {

    '/add': function (req, res) {
        var res_data = {};

        console.log('rwq.body', req.body);
        var db_data = req.body;
        db_data.owner_id = req.user.id;

        upload(req,res, function(err) {
            if (err) {
                console.log('err', err)
            }
            var db_data = req.body;
            db_data.owner_id = req.user.id;

            app.DataBase.make(db_data, req.files[0].filename)
                .then(function(db) {
                    console.log('db', db);
                    res.success({});
                }).catch(function(err) {
                    console.log('err', err);
                    res.error(err);
                });
        });
    },

    '/sql_query/:id': function (req, res) {
        var res_data = {};

        var sql = req.body.sql;
        sql = sql.replace(/\"/g, "'");
        var db = Number(req.params.id);
        app.DataBase.execute_sql(db, sql)
            .then(function(data) {
                res.success({data: data});
            }).catch(function(err) {
                console.log('err', err);
                res.error(err);
            });
    },
};

var _delete = {
   '/remove/:id':  function (req, res) {
        var id = Number(req.params.id);

        app.DataBase.remove(id)
            .then(function() {
                res.success({});
            }).catch(function(err) {
                res.error('Error', err);
            });
    }
};

module.exports = {
    resource: 'Database',
    methods: {
        get: get,
        post: post,
        //put: put,
        delete: _delete
    }
}