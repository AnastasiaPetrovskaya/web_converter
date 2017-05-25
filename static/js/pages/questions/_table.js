$(document).ready(function() {

    //var options = {};
    var options = {
        db_id: window.db_id ? window.db_id : null
    };
    var question_id = 0;

    $(document).on('click', '#questions_table table tbody tr', function(e) {
        $(this).addClass('selected').siblings().removeClass('selected');
        question_id = $(this).data('id');
        $("#copy_question").attr("href", "/questions/copy/" + question_id);
    });

   /* $('#copy_question').click(function() {

        if (!question_id) {
            bootboxError('Необходимо выбрать вопрос, на основе которого вы хотите создать новый. Для этого нажмите на соответствующую строчку в таблице (она должна подсветиться голубым цветом).');
        } else {
            $.ajax({
                type: 'GET',
                url: '/questions/copy',
                data: {copy_id: question_id},
                success: function(res) {
                },
                fail: function(err) {
                    console.log(err);
                }
            });
        }
    });*/


    getTable('/questions/table', options, '#questions_table', function() {});
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
