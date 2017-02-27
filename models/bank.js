var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Timestamp = require('../lib/utils').Timestamp;

//-----Schema------
/*var atm_history = new mongoose.Schema({
    atm_uid: {type: ObjectId, required: true},
    type: {type: String, enum: ['cash_in', 'cash_out', 'payment']},
    time: {type: Number, default: Timestamp.now},
    sum
    client: {
        uid: {type: ObjectId, required: true},
        name: {type: String}
    }
});*/

var atmListSchema = new mongoose.Schema({
    id: Number,
    limit: Number,
    name: String,
    address: String
});

var bankSchema = mongoose.Schema({
  name: {type: String, required: true, min: 1},
  phone: {
      type: String,
      required: true
  },
  address: {
      type: String,
      required: true
  },
  atms: [atmListSchema],
  created: {type: Number, default: Timestamp.now},
  updated: {type: Number, default: Timestamp.now}
});



//----Statics-------


//----Model-------
var Bank = mongoose.model('Bank', bankSchema, 'Banks');


module.exports = Bank;
