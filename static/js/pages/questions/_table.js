$(document).ready(function() {

    $('#questions_table').on('click', '#delete', function(event) {
        var db_id = $(this).parents('tr').attr('data-id');

        event.preventDefault();
        bootbox.confirm({
            title: '<i class="icon-trash2"></i> Вы уверены, что хотите удалить данный вопрос?',
            message: 'Не рекомедуется удалять контрольные вопросы во время проведения контрольных работ и сразу после них',
            className: "slideInDown custom-bootbox",
            buttons: {
                confirm: {
                    label: "OK",
                    className: "btn-success"
                },
                cancel: {
                    label: " Отмена",
                    className: "btn-danger mr-1"
                }
            },
            callback: function(result){
                if (result) {
                    $.ajax('/questions/remove/' + db_id, {method: 'DELETE'})
                        .done(function(result) {
                            if (result.success){
                                var options = {};
                                getTable('/questions/table', options, '#questions_table', function() {});
                            }
                        })
                       .fail(function(result){});
                }
            }
        });
    });

});
