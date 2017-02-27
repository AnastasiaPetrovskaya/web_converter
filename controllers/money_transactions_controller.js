var mongoose = require('mongoose'),
ObjectId = require('mongodb').ObjectID;

var Bank = require('../models/bank.js');
var MoneyTransaction = require('../models/money_transaction.js');


var get = {
    '/': function(req, res, next) {
        console.log('req.query', req.query);
        var options = {};

        if (req.query.bank_id) {
            options.bank = {};
            options= {"bank.uid"  : ObjectId(req.query.bank_id)};
        } else if (req.query.client_id) {
            options.client = {};
            options = {"client.uid" : ObjectId(req.query.client_id)};
        }
        console.log(options)

        MoneyTransaction.find(options).exec()
            .then(function(mts) {
                //console.log('res', mts);
                res.render('money_transactions/_table.jade', {mts: mts});
            }).catch(function(err) {
                console.log('err', err);
                res.error('Error');
            });

    }


};


module.exports = {
    resource: 'Banks',
    methods: {
        get: get
    }
};
