'use strict'
var TestCases = require('../../lib/TestCases');

module.exports = function (models) {
    var CheckPoint = models.CheckPoint;
    var CheckPointGroup = models.CheckPointGroup;
    var TestCase = models.TestCase;
    var TestCaseQuestion = models.TestCaseQuestion;

    CheckPoint.make = function (check_point_data, groups_arr, questions_arr, test_cases_arr) {

        //console.log('groups_arr', groups_arr);
        //console.log('test_cases_arr', test_cases_arr);

        var ctx = {};

        return sequelize.transaction(function (t) {
            return CheckPoint.unscoped().findOne({
                    where: {title: check_point_data.title},
                    transaction: t
                }).then(function (check_point) {
                    if (check_point)
                        throw {message: 'Название контрольного мероприятия уже используется.'};

                    //создание контрольного мероприятия
                    return CheckPoint.create(check_point_data, {transaction: t});
                }).then(function(check_point) {
                    ctx.check_point = check_point.dataValues;

                    console.log('groups_arr', groups_arr);
                    return Promise.all(groups_arr.map(function(group) {
                        return app.CheckPointGroup.create({
                                group_id: group,
                                check_point_id: ctx.check_point.id
                            },
                            {transaction: t}
                        );
                    }));
                }).then(function(result) {

                    //если добавляется тест то необходимо добавить варианты
                    var add_test_case = function(test_case_obj) {
                        var tc_ctx = {};

                        return app.TestCase.create({
                                    title: test_case_obj.title,
                                    check_point_id: ctx.check_point.id,
                                },{
                                    transaction: t
                                }
                            ).then(function(test_case) {
                                tc_ctx.test_case = test_case.dataValues;

                                return Promise.all(test_case_obj.questions.map(function(el) {
                                        return app.TestCaseQuestion.create({
                                                question_id: el.id,
                                                test_case_id: tc_ctx.test_case.id
                                            },
                                            {transaction: t}
                                        );
                                    }));
                            }).catch(function(err) {
                                throw err;
                            });
                    };

                    if (ctx.check_point.type == 'test'|| check_point_data.type == 'RA'|| check_point_data.type == 'TC') {
                        var kostil = [{
                            title: 'Вариант1', 
                            questions: questions_arr
                        }];
                        test_cases_arr = kostil;

                        //TODO попробовать сегенерировать варианты
                        var test_cases = new TestCases(questions_arr, check_point_data.test_config);
                        var test_cases_arr_tes = test_cases.generate();
                        console.log('test_cases_arr_tes', test_cases_arr_tes);

                        return Promise.all(test_cases_arr.map(add_test_case));
                    } else {
                        return;
                    }
                }).then(function(test_cases) {

                    console.log('test_cases', test_cases);
                    return ctx;
                }).catch(function(err) {
                    console.log('make check point method err', err);
                    throw err;
                });
        });
    }

};
