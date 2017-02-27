$(document).ready(function() {
    var bank_uid = window.bank_id ? window.bank_id : null;
    var client_uid = window.client_id ? window.client_id : null;
    var options = {
        bank_id : bank_uid,
        client_id : client_uid
    };

    getTable('/money_transactions', options, '#transaction_history', function() {});


});
