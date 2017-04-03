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

    '/table': function (req, res) {
        console.log('table');
        app.DataBase.findAll()
            .then(function(dbs) {
                res.render('databases/table', { dbs: dbs });
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },

    '/schema/:id': function (req, res) {
        console.log('schema', req.params);
        app.DataBase.get_schema(req.params.id)
            .then(function(filename) {
                console.log('filename', filename);
                res.success({});
                //res.render('databases/table', { dbs: dbs });
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error', err);
            });
    },

    '/:id': function (req, res) {
        var id = Number(req.params.id);

        //check_access(req, id).then(function () {
        app.DataBase.findById(id)
            .then(function (db) {
                if (!db) {
                    throw {message: 'NotFound'};
                } else {
                    //тут необходимо будет сгенерировать схему бд в виде картинки
                    res.render('databases/show', { db: db });
                }
            }).catch(function (err) {
                //log_http_error(req, err.stack);
                console.log('err', err);
                res.error(err);
            });
    }

};

var post = {

    '/add': function (req, res) {
        var res_data = {};

        console.log('in add db controller');

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
                    res.error('Error', err);
                });
        });



        /*if (req.body.user) {
            console.log(req, 'BadRequest');
            res.error('BadRequest');
            return;
        }

        check_access(req, req.body.partner.parent_id)
        .then(function () {
            return Partner.make(req.body.partner, req.body.user)
        })
        .then(function (result) {
            res_data = result;
            return app.cache.partners.add(result.partner.id, result.partner);
        })
        .then(function () {
            res.success(res_data);
        })
        .catch(function (err) {
            log_http_error(req, err.stack);
            res.error(err);
        });*/
    },

    '/': function (req, res) {
        var res_data = {};

        if (req.body.user) {
            console.log(req, 'BadRequest');
            res.error('BadRequest');
            return;
        }

        check_access(req, req.body.partner.parent_id)
        .then(function () {
            return Partner.make(req.body.partner, req.body.user)
        })
        .then(function (result) {
            res_data = result;
            return app.cache.partners.add(result.partner.id, result.partner);
        })
        .then(function () {
            res.success(res_data);
        })
        .catch(function (err) {
            log_http_error(req, err.stack);
            res.error(err);
        });
    }
};


var _delete = {
   '/:id':  function (req, res) {
        var id = Number(req.params.id);

        check_access(req, id)
        .then(function () {
            return Partner.bt_remove(id);
        })
        .then(function () {
            return app.cache.partners.remove(id).then(function () {
                res.success();
            });
        })
        .catch(function (err) {
            log_http_error(req, err);
            res.error(err);
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
