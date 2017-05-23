$(document).ready(function() {

    $('#form_login').submit(function(event) {

        event.preventDefault();

        var data = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        $('#submit_btn').prop('disabled', true);
        $('#submit_btn').html('<i class="icon-spinner spinner"></i>');

        $.post('/login', data).done(function() {
            window.location.href = '/';
        }).fail(function(res) {
            window.location.href = '/login';
        });
    });

});
