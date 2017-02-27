var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Timestamp = require('../lib/utils').Timestamp,
    Bank = require('./bank.js'),
    Client = require('./client.js');



//-----Schema------
var MoneyTransactionSchema = new mongoose.Schema({
    atm_uid: {type: Number, required: true},
    type: {type: String, enum: ['cash_in', 'cash_out', 'payment']},
    time: {type: Number, default: Timestamp.now},
    sum: {type: Number, required: true},
    client: {
        uid: {type: ObjectId, required: true},
        name: {type: String}
    },
    bank: {
        uid: {type: ObjectId, required: true},
        name: {type: String}
    }
});


//----Statics-------
MoneyTransactionSchema.statics.make = function make(money_transaction) {
    console.log('in static', money_transaction);
    var ctx = {};

    return new Promise(function(fullfill, reject) {
        Client.findById(money_transaction.client_id).exec()
            .then(function(client) {
                if (!client) {
                    reject({message: 'ClientNotFound'});
                } else {
                    ctx.client = client;
                }
                //поиск терминала
                return Bank.findOne({"atms.id": money_transaction.atm_uid}, {'atms.$': 1}).exec()
            }).then(function(bank) {
                if (!bank) {
                    return reject({message: 'BankNotFound'});
                }

                ctx.bank = bank;

                //проверка свой банкомат или нет
                if (bank.id != money_transaction.bank_id) {
                    money_transaction.sum += Math.round(money_transaction.sum*0.1);
                    console.log('комиссия новая ');
                }

                //проверка что достаточно средств
                if ((ctx.client.current_balance - money_transaction.sum) < ctx.client.min_balance) {
                    return reject({message: 'Нарушено правило наснимаемого лимита'});
                }

                //проверка лимита банкомата
                if (bank.atms[0].limit < money_transaction.sum) {
                    return reject({message: 'Превышен лимит банкомата'});
                }

                //можно менять баланс 
                ctx.client.current_balance -= money_transaction.sum;

                return ctx.client.save();
            }).then(function(client) {
                //сохраняем money transaction
                console.loG('!!!!!!!!!!!!!!!!!!!');
                var options = money_transaction;
                options.bank = {};
                options.bank.uid = money_transaction.bank_id;
                options.bank.name = money_transaction.bank_name;
                
                options.client = {};
                options.client.uid = money_transaction.client_id;
                options.client.name = money_transaction.client_name;

                var mt = new MoneyTransaction(options);

                return mt.save();
            }).then(function(money_transaction){
                ctx.money_transaction = money_transaction;
                fullfill(ctx);
            }).catch(function(err) {
                console.log('err', err);
                res.error(err);
            });

    });
 };

//----Model-------
var MoneyTransaction = mongoose.model('MoneyTransaction', MoneyTransactionSchema, 'MoneyTransactions');


module.exports = MoneyTransaction;
