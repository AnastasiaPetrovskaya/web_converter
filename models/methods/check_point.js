'use strict'

module.exports = function (models) {
    var CheckPoint = models.CheckPoint;
    var TestCase = models.TestCase;
    var TestCaseQuestion = models.TestCaseQuestion;

    CheckPoint.make = function (check_point_data, test_cases_arr) {
        var ctx = {};

        return sequelize.transaction(function (t) {
            return CheckPoint.unscoped().findOne({
                    where: {title: check_point_data.title},
                    transaction: t
                }).then(function (db) {
                    if (db)
                        throw {message: 'Название контрольного мероприятия уже используется.'};

                    //создание контрольного мероприятия
                    return CheckPoint.create(check_point_data, {transaction: t});
                }).then(function(check_point) {
                    ctx.check_point = db.check_point;

                    //если добавляется тест то необходимо добавить варианты
                    var add_test_case = function(test_case) {
                        var tc_ctx = {};

                        return app.TestCase.create({title: test_case.title}, {transaction: t})
                            .then(function(test_case) {
                                tc_ctx.test_case = test_case;

                                return Promise.all(test_case.questions.map(function(el) {
                                        return app.TestCaseQuestion.create({
                                            question_id: el,
                                            test_case_id: tc_ctx.test_case.id
                                        });
                                    }));
                            }).catch(function(err) {
                                reject(err);
                            });
                    };

                    if (ctx.check_point.type == 'test') {
                        return Promise.all(test_cases_arr.map(add_test_case));
                    } else {
                        return;
                    }
                }).then(function(test_cases) {

                    console.log('test_cases', test_cases);
                    resolve(ctx);
                }).catch(function(err) {
                    console.log('make db method err', err);
                    throw err;
                });
        });
    }

};
