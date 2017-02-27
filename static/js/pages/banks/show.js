$(document).ready(function() {
    $('#btn_add_atm').click(function(e) {
        var that = this,
            options = {
                bank_id: window.bank_id ? window.bank_id : null
            };

        $.ajax({
            type: 'POST',
            url: '/banks/' + bank_id + '/add_atm',
            data: $('#add_atm_form').serialize()
        }).done(function() {
            getTable('/banks/' + bank_id + '/atms', options, '#atms', function() {});
        }).fail(function() {
            console.log('err');
        });
    });


    $('#btn_add_client').click(function(e) {
        var that = this,
            options = {
                bank_id: window.bank_id ? window.bank_id : null
            };

        $.ajax({
            type: 'POST',
            url: '/clients/add',
            data: $('#add_client_form').serialize() + "&bank_id=" + bank_id
        }).success(function() {
            window.location.reload();
            //getTable('/banks/' + bank_id + '/atms', options, '#atms', function() {});
        }).fail(function() {
            console.log('err');
        });
    });

});
