$(document).ready(function() {
    // TODO partner_id объявлен в шаблоне!
    getTable('/students/table', { group_id: window.group_id }, '#students_table', function() {});

    $(document).on('click', '#students_table ul.pagination a.page-link', function(e) {
        options.page = e.target.innerHTML;
        getTable('/students/table', options, '#students_table');
    });

    var $editable = $('.editable');

    $editable.editable({
        ajaxOptions: { type:'PUT' },
        type: 'text',
        mode: 'inline',
        url: '/groups/' + group_id,
        pk: 1, //иначе не уходит ajax
        emptytext: 'Не задано',
        params: function(params) {
            var obj = {};

            if (params.value === '') {
                obj[params.name] = '';
            } else {
                obj[params.name] = params.value;
            }

            return obj;
        },
        success: function(res) { 
            //window.location.reload(); 
        },
        error: function(res) { console.log(res); },
        validate: function(value) {
            if (!($(this).data('name') == 'specialty') && $.trim(value) == '') {
                return 'Необходимо заполнить данное поле';
            }
        }
    });

    $editable.editable('toggleDisabled');

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

    });


    var options = {};
    if (window.group_id) {
        options.group_id = window.group_id;
    }

});
