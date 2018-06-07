$(document).ready(function() {
    $(document).on('click', '#materials_table ul.pagination a.page-link', function(e) {
        options.page = e.target.innerHTML;
        getTable('/materials/table', options, '#materials_table');
    });

        event.preventDefault();
        bootbox.confirm({
            callback: function(result){
                if (result) {
                    $.ajax('/materials/download/' + material-name, {method: 'DOWNLOAD'})
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