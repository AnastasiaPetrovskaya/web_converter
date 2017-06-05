$(document).ready(function() {

    //var options = {};
    var options = {
        user_id: window.user_id ? window.user_id : null
    };
    //var question_id = 0;

    //$(document).on('click', '#questions_table table tbody tr', function(e) {
    //    $(this).addClass('selected').siblings().removeClass('selected');
    //    question_id = $(this).data('id');
    //    $("#copy_question").attr("href", "/questions/copy/" + question_id);
    //});

    //$(document).on('click', '#questions_table ul.pagination a.page-link', function(e) {
    //    options.page = e.target.innerHTML;
    //    getTable('/questions/table', options, '#questions_table');
    //});


    //$('#copy_question').click(function(e) {
    //    if (!question_id) {
    //        e.preventDefault()
    //        bootboxError('Необходимо выбрать вопрос, на основе которого вы хотите создать новый. Для этого нажмите на соответствующую строчку в таблице (она должна подсветиться голубым цветом).');
    //    } 
    //});


    getTable('/questions_answers/table', options, '#questions_answers_table', function() {});

    //$('#questions_table').on('click', '#delete', function(event) {
    //    var db_id = $(this).parents('tr').attr('data-id');

    //    event.preventDefault();
    //    bootbox.confirm({
    //        title: '<i class="icon-trash2"></i> Вы уверены, что хотите удалить данный вопрос?',
    //        message: 'Не рекомедуется удалять контрольные вопросы во время проведения контрольных работ и сразу после них',
    //        className: "slideInDown custom-bootbox",
    //        buttons: {
    //            confirm: {
    //                label: "OK",
    //                className: "btn-success"
    //            },
    //            cancel: {
    //                label: " Отмена",
    //                className: "btn-danger mr-1"
    //            }
    //        },
    //        callback: function(result){
    //            if (result) {
    //                $.ajax('/questions/remove/' + db_id, {method: 'DELETE'})
    //                    .done(function(result) {
    //                        if (result.success){
    //                            var options = {};
    //                            getTable('/questions/table', options, '#questions_table', function() {});
    //                        }
    //                    })
    //                   .fail(function(result){});
    //            }
    //        }
    //    });
    //});

});
