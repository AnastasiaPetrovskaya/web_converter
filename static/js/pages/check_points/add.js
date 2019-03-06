$(document).ready(function() {
    var start,
        end;
    //new block for choosing type of generating algorithm
    const buttonTestConfig = document.querySelector('#dropTestConfig'),
        configButtons = document.querySelectorAll('.dropdown-item'),
        testCaseAmount = document.querySelector('#test_cases_amount_row');

    configButtons.forEach((btn,i) => {
       btn.addEventListener('click', () => {
           buttonTestConfig.textContent = btn.textContent;
           if(btn.textContent == "Динамическая") {
               testCaseAmount.style.display = 'none';
           } else if (btn.textContent == "Случайная") {
               testCaseAmount.style.display = 'block';
           } else if (btn.textContent == "Ручная") {
               testCaseAmount.style.display = 'block';
           }

       })
    });

    $dates = $('#start, #end');
    $dates.datetimepicker({
        format: 'DD.MM.YYYY HH:mm',
        locale: 'ru',
        icons: {
            time: 'icon-alarm',
            date: 'icon-calendar3',
            up: 'icon-chevron-up',
            down: 'icon-chevron-down',
            previous: 'icon-chevron-left',
            next: 'icon-chevron-right',
            today: 'icon-crosshairs',
            clear: 'icon-bin',
            close: 'icon-close'
        }
    });

    $('.select2').select2({
        containerCssClass: 'select',
        language: {
            maximumSelected: function() {
                return "Вы не можете выбрать более одного элемента";
            },
            noResult: function() {
                return "Нет данных для выбранных фильтров";
            }
        },
    });

    $('#start').data('DateTimePicker').date(moment().startOf('day').add(7, 'd'));
    $('#end').data('DateTimePicker').date(moment().startOf('day').add(8, 'd'));

    start = moment($('#start').data('DateTimePicker').date()).format("YYYY-MM-DD HH:mm:ss");
    end = moment($('#end').data('DateTimePicker').date()).format("YYYY-MM-DD HH:mm:ss");

    $('#start').on('dp.change', function(e) {
        start = moment(new Date($('#start').data('DateTimePicker').date())).format("YYYY-MM-DD HH:mm:ss");
    });

    $('#end').on('dp.change', function(e) {
        end = moment(new Date ($('#end').data('DateTimePicker').date())).format("YYYY-MM-DD HH:mm:ss");
    });




    $('#type').change(function(e) {
        if ($(this).val() == 'test'|| $(this).val() == 'RA'|| $(this).val() == 'TC') {

            var options = {};
            options.db_type = { 
                $or: [
                    {$eq: 'common'}, 
                    {$eq: 'test'}
                ] 
            };
            options.control_col = false;

            if ($(this).val() == 'RA'){

                options.query_type = {$eq: 'RA'};
            } 
            else {

              options.query_type = {$eq: 'TC'};  
            }
            

            getTable('/questions/table', options, '#questions_table');

            $('#settings_card').show();
            $('#select_db_card').show();
            $('#select_questions_card').show();
            $('#selected_questions_card').show();
            $('#gen_test_cases_and_save').show();
            $('#save').hide();
        } else {
            $('#settings_card').hide();
            $('#select_db_card').hide();
            $('#select_questions_card').hide();
            $('#selected_questions_card').hide();
            $('#gen_test_cases_and_save').hide();
            $('#save').show();
        }
    });

    $('#selectdb').change(function(){
        var options = {};
        var ctx = {};
        // ctx.db_title = $(this).val();
        options.db_id =$(this).val();
        options.query_type =$(type).val();
        getTable('/questions/table', options, '#questions_table');
    });

    $('#time_limit').change(function() {
        var $this = $(this);
        var checked = $this.prop('checked');

        if (checked) {
            $('#minutes_amount').removeAttr('disabled');
        } else {
            $('#minutes_amount').prop('disabled', true);;
        }
    });

    $(document).on('click', '#check_points_table ul.pagination a.page-link', function(e) {
        options.page = e.target.innerHTML;
        getTable('/check_points/table', options, '#check_points_table');
    });


    $(document).on('click', '#questions_table table tbody tr', function(e) {
        //$(this).addClass('selected').siblings().removeClass('selected');
        $(this).addClass('selected');
        question_id = $(this).data('id');
        question_complexity = $(this).data('complexity');
        question_title = $(this).data('title');

        $('#selected_questions_list').append('<li class="list-group-item py-0 pr-0" data-id="' + question_id + 
            '" data-complexity="' + question_complexity + '" data-title="' + question_title + '">' + 
            question_title + ' (Сложность: '+ question_complexity + ')' + 
            '<a class="float-xs-right bg-danger" data-action="remove-from-selected"><i class=" mx-1 white icon-cross2"></i></a>' + '</li>');
    });


    $(document).on('click', 'a[data-action="remove-from-selected"]', function(e) {
        //$(this).addClass('selected').siblings().removeClass('selected');
        //TODO зазвыделять строки в таблице, если нужно
        $(this).parent().remove();
    });






    var $form = $("#new_check_point");

    //обработка копирования
    if (question) {
        $form.find('#title').val(question.title + '(копия)');
        $form.find('#tag').val(question.tag);
        $form.find('#text').val(question.text);
        $form.find('#sql_answer').val(question.sql_answer);
        $form.find('#help').val(question.help);
        $form.find('#query_type').val(question.query_type);
        // $form.find('#db_id').val(question.db_id);
        //console.log(question);

        $('#db_schema_div').html('<div id="db_schema_div" class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>');

        $.get('/databases/schema/' + question.db_id, function(res) {
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
    }


    $form.submit(function(event){
        var data = {};
        var question_set = {};

        event.preventDefault();
        var type = $(this).find('#type').val();

        data.groups_set = $('.select2').val();
        data.check_point_data = get_form_data($(this));
        data.check_point_data.start = start;
        data.check_point_data.end = end;
        // data.check_point_data.

        if (type == 'test' || type == 'RA' || type == 'TC') {
            data.check_point_data.test_config = get_form_data($('#test_config'));

            // добавить про базу данных!!!!!!!!!!!!!!!!

            var questions_set = [];
            $('#questions_table table tbody tr').each(function(index) {
                var question = {};
                question.id = $(this).data('id');
                question.complexity = $(this).data('complexity');
                questions_set.push(question);
            });

            data.questions_set = questions_set;
        }

        $('#submit').prop('disabled', true);
        $('#submit').html('<i class="icon-spinner12"></i>');

        var res = $.ajax({
            type: 'POST',
            url: '/check_points/add',
            data: data,
            dataType: 'json',
            async: false
        }).responseText;
        res = JSON.parse(res);

        console.log(res);

        if (res.success) {
            bootbox.dialog({
                className: 'slideInDown',
                message: 'Контрольное мероприятие ' + '<a class="alert-link" href="/check_points/' + res.check_point.id + '"> "' + res.check_point.title + '"</a> ' + ' добавлено.' +
                '<p>' + '</p>',
                buttons: { 
                    'back_to_list': {
                        label: 'Вернутся к списку контрольных мероприятий',
                        className: 'btn-default mr-1',
                        callback: function() { window.location.assign('/check_points'); }
                    },
                    'create_new_one': {
                        label: 'Создать еще одно',
                        className: 'btn-success',
                        callback: function() {
                            bootbox.hideAll();
                            return false;
                        }
                    }
                }

            });
        } else {
            bootboxError(res.error);
            return false;
        }
    });

    $("#db_id").change(function() {
        console.log($(this).val());
        $('#db_schema_div').html('<div id="db_schema_div" class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>');

        $.get('/databases/schema/' + $(this).val(), function(res) {
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

    $("#sql_answer_btn").click(function() {
        console.log($(this).val());
        var db_id = $('#db_id').val(),
            sql = $('#sql_answer').val();

        if (db_id == "" || sql == "") {
            //manual trigger validation of two fields

            var $form = $("#new_question");

            var $allInputs = $form.find("#sql_answer ,#db_id");
            var $allControlGroups = $form.find(".form-group > #sql_answer ,.form-group > #db_id ");

            // Only trigger validation on the ones that actually _have_ validation
            var $inputsWithValidators = $allInputs.filter(function () {
                return $(this).triggerHandler("getValidatorCount.validation") > 0;
            });
            $inputsWithValidators.trigger("submit.validation");

            // But all of them are out-of-focus now, because we're submitting.
            $allInputs.trigger("validationLostFocus.validation");

            // Okay, now check each controlgroup for errors (or warnings)
            $allControlGroups.each(function (i, el) {
                var $controlGroup = $(el);
                if ($controlGroup.hasClass("issue") || $controlGroup.hasClass("error")) {
                    $controlGroup.removeClass("issue").addClass("error");
                    warningsFound++;
                }
            });

            return;
        }


        $('#sql_answer_div').html('<div class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>');


        var res = $.ajax({
            type: 'POST',
            url: '/databases/sql_query/' + db_id,
            data: {'sql': sql},
            async: false
        }).responseText;
        res = JSON.parse(res);

        console.log(res);

        if (res.success) {
            $('#sql_query_text').val(res.data.sql);
            if (res.data.result.rows.length > 0) {

                var fields = [],
                    query_data = res.data.result.rows;

                for (key in query_data[0]) {
                    if (key.toLowerCase().indexOf('id') != -1 || key.toLowerCase().indexOf('ид') != -1)
                        fields.push({ name: key, type: "text", editing: false});
                    else if (key.toLowerCase().indexOf('date') != -1 || key.toLowerCase().indexOf('дата') != -1)
                        fields.push({ name: key, type: "date"});
                    else
                        fields.push({ name: key, type: "text"});
                }

                $('#sql_answer_div').jsGrid({
                    width: "100%",
                    sorting: true,
                    paging: true,
                    pageSize: 15,
                    pageButtonCount: 5,
                    deleteConfirm: "Вы уерены, что хотите удалить данную запись из таблицы?",
 
                    data: query_data,
                    fields: fields,
                    controller: {
                        loadData : function(filter) {

                            return $.grep(table.data, function(td) {

                                var flag = true;
                                var type = "";

                                for (key in filter) {

                                    fields.some(function(el) {
                                        var res = false;

                                        if (el.name == key) {
                                            type = el.type;
                                            res = true;
                                        }

                                        return res;
                                    });

                                    if (filter[key] && type == "text" && typeof(td[key]) == "string" && 
                                        td[key].indexOf(filter[key]) == -1) {
                                            flag = false;
                                            break;
                                    } else if (filter[key] && type == "text" && typeof(td[key]) == "number" &&
                                        td[key] != filter[key]) {
                                            flag = false;
                                            break;
                                    } else if  (filter[key] && type == "date" &&
                                        moment(td[key]).format("YYYY-MM-DDTHH:mm:ss") != filter[key]) {
                                            flag = false;
                                            break;
                                    }
                                }

                                return flag;
                            });
                        }
                    }
                });

            } else {
                $('#sql_answer_div').html('<div class="text-xs-center"> Ваш запрос не дал результатов</div>');
            }
        } else {
            var err_html = '<p>'+ res.error + '</p><p>' + 
                        res.sql.substring(0, res.sql_err_position - 1) + 
                        '<kbd>' + res.sql.substr(+res.sql_err_position - 1, 1) +
                        '</kbd>' + res.sql.substr(+res.sql_err_position) + '</p>';
            $('#sql_answer_div').html(err_html);

            if (res.sql && res.sql_err_position) {
                bootboxError(err_html);
            } else {
                bootboxError(res.error);
            }
            return false;
        }
    });
});
