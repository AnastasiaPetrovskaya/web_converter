$(document).ready(function() {
    $(document).on('click', '#materials_table ul.pagination a.page-link', function(e) {
        options.page = e.target.innerHTML;
        getTable('/materials/table', options, '#materials_table');
    });

        event.preventDefault();
        bootbox.confirm({
            title: '<i class="icon-trash2"></i> Вы уверены, что хотите удалить данный учебный материал?',
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
                    $.ajax('/materials/remove/' + db_id, {method: 'DELETE'})
                        .done(function(result) {
                            if (result.success){
                                var options = {};
                                getTable('/materials/table', options, '#materials_table', function() {});
                            }
                        })
                        .fail(function(result){});
                }
            }
        });
});