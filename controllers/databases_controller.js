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

var get = {
    '/': function (req, res) {
        //console.log('app', app);
        app.DataBase.findAll()
            .then(function(dbs) {
                res.render('databases/index', { dbs: dbs });
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
