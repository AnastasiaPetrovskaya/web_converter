$(document).ready(function() {

    $("#add-bank").click(function(e) {
        var data = {};

        data.name = $('#name').val();
        data.phone = $('#phone').val();
        data.address = $('#address').val();

        var res = $.ajax({
            type: 'POST',
            url: '/banks/add',
            data: data,
            dataType: 'json',
            async: false
        }).responseText;
        res = JSON.parse(res);

        if (res.success) {
            window.location.href = '/banks/' + res.id;
        } else {
            console.log(res);
            //#TODO страницу с ошибкой
            window.location.href = '/error';
        }
    });
});
