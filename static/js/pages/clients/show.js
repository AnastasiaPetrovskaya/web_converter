$(document).ready(function() {

    //обработка формы создания новой транзакции
    $('#btn_add_money_transction').click(function(e) {
        var that = this,
            options = {
                client_id: window.client_id ? window.client_id : null
            };

        $.ajax({
            type: 'POST',
            url: '/clients/' + client_id + '/money_transaction',
            data: $('#add_money_transaction').serialize()
        }).done(function(res) {
            if (res.error) {
                console.log('err', res.error);
                alert(res.error);
            } else {
                window.location.reload();
            }
            //console.log('succes', res);
            //getTable('/banks/' + bank_id + '/atms', options, '#atms', function() {});
        }).fail(function(err) {
            console.log('err', err);
        });
    });


});
