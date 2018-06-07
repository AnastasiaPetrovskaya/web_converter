$(document).ready(function() {

    var options = {};
    if (window.db_id){
        db_id: window.db_id;
    };
    var material_id = 0;

    $(document).on('click', '#materials table tbody tr', function(e) {
        $(this).addClass('selected').siblings().removeClass('selected');
        material_id = $(this).data('id');
    });

    $(document).on('click', '#materials ul.pagination a.page-link', function(e) {
        options.page = e.target.innerHTML;
        getTable('/materials/table', options, '#materials');
    });

    getTable('/materials/table', options, '#materials', function() {});

    $('#materials').on('click', '#delete', function(event) {
        var db_id = $(this).parents('tr').attr('data-id');
        console.log (db_id); //идентификатор из БД

        event.preventDefault();
        bootbox.confirm({
            title: '<i class="icon-trash2"></i> Удаление учебного материала',
            message: 'Вы уверены, что хотите удалить данный учебный материал?',
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
                                getTable('/materials/table', options, '#materials', function() {});
                            }
                        })
                        .fail(function(result){});
                }
            }
        });
    });

    $('#materials').on('click', '#download', function(e) {
        var material_name = $(this).parents('tr').attr('data-name');
        event.preventDefault();
        bootbox.alert(function() {
                console.log ('это нужно скачать', material_name);
                $.ajax('/materials/download/' + material_name, {method: 'DOWNLOAD'})
                        .done(function (result) {
                            if (result.success) {
                                var options = {};
                                getTable('/materials/table', options, '#materials', function () {
                                });
                            }
                        })
                        .fail(function (result) {
                        });
                response.writeHead(200, {"Content-Type" : "file_of_material"})
                fs.createReadStream("hello.txt").pipe(response);
            });
    });
});