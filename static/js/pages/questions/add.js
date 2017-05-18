$(document).ready(function(){
    $("#new_question").submit(function(event){
        console.log("submit event");

        event.preventDefault();
        console.log('1', $(this).serialize);
        console.log('2', $(this).serializeArray);
        var data = $(this).serialize();


        $('#mdb_submit').prop('disabled', true);
        $('#mdb_submit').html('<i class="icon-spinner12"></i>');


        var res = $.ajax({
            type: 'POST',
            url: '/questions/add',
            data: data,
            async: false
        }).responseText;
        res = JSON.parse(res);

        console.log(res);

        if (res.success) {
            bootbox.dialog({
                className: 'slideInDown',
                message: 'Вопрос' + '<a class="alert-link" href="/questions/' + res.id + '"> "' + res.title + '"</a> ' + ' добавлен' +
                '<p>' + '</p>',
                buttons: { 
                    'back_to_list': {
                        label: 'Вернутся к списку вопросов',
                        className: 'btn-default mr-1',
                        callback: function() { window.location.assign('/questions'); }
                    },
                    'create_new_one': {
                        label: 'Создать еще один',
                        className: 'btn-success',
                        callback: function() { window.location.reload(); }
                    }
                }

            });
        } else {
            console.log(res);
            //$successButton.html(lang.add).prop('disabled', false);
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
            // Get all inputs
            //var $allInputs = $form.find("input,textarea,select").not("[type=submit],[type=image]");//.filter(settings.options.filter);
            //var $allControlGroups = $form.find(".form-group");
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


        $('#sql_answer_div').html('<div id="db_schema_div" class="text-xs-center"><i class="fa fa-spin fa-spinner"></i> Подождите...</div>');


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
                //fields.push({type: 'control'});

                $('#sql_answer_div').jsGrid({
                    width: "100%",
                    height: "600px",
 
                    //editing: true,
                    //inserting: true,
                    //filtering: true,
                    sorting: true,
                    paging: true,
                    pageSize: 15,
                    pageButtonCount: 5,
                    deleteConfirm: "Вы уерены, что хотите удалить данную запись из таблицы?",
 
                    data: query_data,
                    fields: fields,
                    controller: {
                        loadData : function(filter) {
                            //console.log('filter', filter);
                            //console.log('this.data', this.data);

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
                $('#sql_answer_div').val('Запрос не дал результатов');
            }
        } else {
            console.log(res);
            //$successButton.html(lang.add).prop('disabled', false);
            bootboxError(res.error);
            return false;
        }
    });
});
