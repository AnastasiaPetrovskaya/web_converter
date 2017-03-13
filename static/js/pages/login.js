$(document).ready(function() {

    $('#form_login').submit(function(event) {

        event.preventDefault();

        var data = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        $('#submit_btn').prop('disabled', true);
        $('#submit_btn').html('<i class="fa fa-spinner fa-spin"></i>');


        $.post('/login', data).done(function() {
            window.location.href = '/';
        }).fail(function(res) {
            window.location.href = '/login';
        });
    });

});
