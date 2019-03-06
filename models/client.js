var mongoose = require('mongoose'),
    ShortId = require('mongoose-shortid-nodeps'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Timestamp = require('../lib/utils').Timestamp,
    Bank = require('./bank.js');

var atmListSchema = new mongoose.Schema({
    id: Number,
    limit: Number,
    name: String,
    address: String
});

var clientSchema = mongoose.Schema({
    name: {type: String, required: true, min: 1},
    phone: {type: String,required: true},
    account_number: {
        type: ShortId,
        len: 20,
        alphabet: '0123456789',
        index: true
    },
    current_balance: {
        type: Number, 
        validate: {
            validator: function(v) {
                if (v >= 0) {
                    return true;
                } else {
                    return false;
                }
            },
            message: 'invalid balance'
        }
    },
    min_balance: {
        type: Number, 
        validate: {
            validator: function(v) {
                if (v >= 0) {
                    return true;
                } else {
                    return false;
                }
            },
            message: 'invalid balance'
        }
    },
    card_number: {
        type: ShortId,
        len: 16,
        alphabet: '0123456789',
        index: true
    },
    bank: {
        uid: {type: ObjectId, ref: 'Bank'},
        name: String
    },
    created: {type: Number, default: Timestamp.now},
    updated: {type: Number, default: Timestamp.now}
});



//----Statics-------
clientSchema.statics.getBankData = function getBankData(bank_id) {
    //console.log('in static', bank_id);
    return new Promise(function(fullfill, reject) {
        Bank.findById(bank_id).exec()
            .then(function(bank) {
                if (!bank){
                    reject('BankNotFound');
                } else {
                    var bank = {
                        uid: ObjectId(bank_id),
                        name: bank.name
                    };
                    fullfill(bank);
                }
            }).catch(function(err) {
                console.log('err in : ', err);
                reject(err);
            });
    });
 };

//----Model-------
var Client = mongoose.model('Client', clientSchema, 'Clients');


module.exports = Client;
