$(document).ready(function() {

    //var options = {};
    var options = {
        db_id: window.db_id ? window.db_id : null
    };
    var check_point_id = 0;

    $(document).on('click', '#check_points_table table tbody tr', function(e) {
        $(this).addClass('selected').siblings().removeClass('selected');
        check_point_id = $(this).data('id');
        $("#copy_check_point").attr("href", "/check_points/copy/" + check_point_id);
    });

    $(document).on('click', '#check_points_table ul.pagination a.page-link', function(e) {
        options.page = e.target.innerHTML;
        getTable('/check_points/table', options, '#check_points_table');
    });


    $('#copy_check_point').click(function(e) {
        if (!check_point_id) {
            e.preventDefault()
            bootboxError('Необходимо выбрать вопрос, на основе которого вы хотите создать новый. Для этого нажмите на соответствующую строчку в таблице (она должна подсветиться голубым цветом).');
        } 
    });


    getTable('/check_points/table', options, '#check_points_table', function() {});

    $('#check_points_table').on('click', '#delete', function(event) {
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
                    $.ajax('/check_points/remove/' + db_id, {method: 'DELETE'})
                        .done(function(result) {
                            if (result.success){
                                var options = {};
                                getTable('/check_points/table', options, '#check_points_table', function() {});
                            }
                        })
                       .fail(function(result){});
                }
            }
        });
    });

});
