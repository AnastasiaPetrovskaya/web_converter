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
        app.DataBase.findAll()
            .then(function(dbs) {
                //console.log('dbs', dbs);
                res.render('databases/table', { dbs: dbs });
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

    '/:id': function (req, res) {
        var id = Number(req.params.id);

        app.DataBase.find({
            where : {id: id},
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
                res.error(err);
            });
    }

};

var post = {

    '/add': function (req, res) {
        var res_data = {};

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
                    res.error('Error', err);
                });
        });
    },

    '/sql_query/:id': function (req, res) {
        var res_data = {};

        var sql = req.body.sql;
        var db = Number(req.params.id);;

        app.DataBase.execute_sql(db, sql)
            .then(function(data) {
                res.success({data: data});
            }).catch(function(err) {
                //console.log('err', err);
                res.error('Error', err);
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
    resource: 'Partner',
    methods: {
        get: get,
        post: post,
        //put: put,
        delete: _delete
    }
}
