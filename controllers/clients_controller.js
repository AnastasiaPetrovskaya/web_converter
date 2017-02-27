var mongoose = require('mongoose'),
ObjectId = require('mongodb').ObjectID;

var Client = require('../models/client.js');
var MoneyTransaction = require('../models/money_transaction.js');

var get = {
    '/table': function(req, res, next) {
        console.log('query.body', req.query);
        var options = {};

        if (req.query.bank_id) {
            options.bank = {};
            options.bank.uid = ObjectId(req.query.bank_id);
        }
        //console.log('options', options)

        var query = Client.find({'bank.uid':req.query.bank_id}).skip(0);
        query.exec()
            .then(function(clients) {
                //console.log('res clients', clients);
                res.render('clients/_table', { clients: clients });
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error');
            });
    },


    '/': function(req, res, next) {
        console.log('query.body', req.query);
        var options = {};

        if (req.query.bank_id) {
            options.bank = {};
            options.bank.uid = ObjectId(req.query.bank_id);
        }
        //console.log('options')

        var query = Client.find(options).skip(0);
        query.exec()
            .then(function(clients) {
                res.render('clients/index', { clients: clients });
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error');
            });
    },

    '/:id': function(req, res, next) {
        var options = {};
        if (req.params.id) {
            options._id = ObjectId(req.params.id);
        }

        Client.findById(req.params.id).exec()
            .then(function(client) {
                //console.log('res', bank);
                //banks/show
                res.render('clients/show', {client: client});
            }).catch(function(err) {
                console.log('err', err);
                res.error(err);
            });

    }
};

var post = {
    '/add': function(req, res, next) {
        //console.log('req.body add', req.body);
        //console.log('client', Client);

        Client.getBankData(req.body.bank_id)
            .then(function(bank) {

                req.body.bank = {};
                req.body.bank.uid = req.body.bank_id;
                req.body.bank.name = bank.name;

                //console.log('req.body', req.body);
                var client = new Client(req.body);

                return client.save()
            }).then(function(client) {
                //console.log('client', client);
                res.success({'id': client.id});
            }).catch(function(err) {
                console.log('err', err);
                res.error(err);
            });
    },

    '/:id/money_transaction': function(req, res, next) {
        //console.log('req.body', req.body);
        var options = req.body;
        options.client_id = req.params.id;

        MoneyTransaction.make(options)
            .then(function(mt) {
                //console.log('in controller res');
                res.success(mt);
            }).catch(function(err) {
                //console.log('in controller err', err);
                res.error(err);
            })

    },


    '/:id/update': function(req, res, next) {
        res.send('partner /id' + req.params.id);
    }
};

module.exports = {
    resource: 'Clients',
    methods: {
        get: get,
        post: post
    }
};
