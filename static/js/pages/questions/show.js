$(document).ready(function() {
    // TODO partner_id объявлен в шаблоне!

    var $editable = $('.editable');

    $editable.editable({
        ajaxOptions: { type:'PUT' },
        type: 'textarea',
        mode: 'inline',
        url: '/questions/' + question_id,
        pk: 1, //иначе не уходит ajax
        params: function(params) {
            var obj = {};

            if (params.value === '') {
                obj[params.name] = [''];
            } else {
                obj[params.name] = params.value;
            }

            return obj;
        },
        success: function(res) { window.location.reload(); },
        error: function(res) { console.log(res); },
        validate: function(value) {
            if($.trim(value) == '') return 'Необходимо заполнить данное поле';
        }
    });

    $editable.editable('toggleDisabled');
    //$balance.editable('toggleDisabled');

    $('#edit').click(function() {
        var $this = $(this);

        if ($this.attr('data-edit') === 'enable') {
            //off
            $this.removeClass('active');
            $this.attr('data-edit', 'disable');
        } else {
            //on
            $this.addClass('active');
            $this.attr('data-edit', 'enable');
        }

        $editable.editable('toggleDisabled');
        //$balance.editable('toggleDisabled');

    });


    $.get('/databases/schema/' + db_id, function(res) {
        $('#db_schema_div').html('<img src="/db_schema/' + res.file +
             '" style="max-height: 100%;max-width: 100%;" alt="">');
    }).fail(function(err) {
        bootbox.alert({
            message: 'err' + err.message,
            className: "slideInDown",
            buttons: {
                ok: {
                    label: "OK",
                    className: "btn-success"
                }
            }
        });
    });

});
