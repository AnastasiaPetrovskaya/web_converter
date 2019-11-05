'use strict'
var TestCases = require('../../lib/TestCases');

module.exports = function (models) {
    var CheckPoint = models.CheckPoint;
    var CheckPointGroup = models.CheckPointGroup;
    var TestCase = models.TestCase;
    var TestCaseQuestion = models.TestCaseQuestion;

    CheckPoint.make = function (check_point_data, groups_arr, questions_arr) {

        var ctx = {};
        console.log('\nMake test common inputs\n\n\n');
        console.log('Check point data\n', check_point_data, '\n');
        console.log('Groups_arr\n', groups_arr,'\n');
        console.log('Question array\n', questions_arr, '\n');

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

                    //console.log('groups_arr', groups_arr);
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

                        //TODO попробовать сегенерировать варианты

                        var test_cases = new TestCases(questions_arr, check_point_data.test_config);
                        var test_cases_arr_tes = test_cases.generate();


                        return Promise.all(test_cases_arr_tes.map(add_test_case));
                    } else {

                    }
                }).then(function(test_cases) {
                    return ctx;
                }).catch(function(err) {
                    console.log('make check point method err', err);
                    throw err;
                });
        });
    };

    CheckPoint.make_experimental = function (check_point_data, groups_arr, questions_arr) {

        //Перемешивает массив
        function shuffle(array) {
            var tmp, current, top = array.length;
            if(top) while(--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
            return array;
        };

        //функция поиска вхождения объекта в массив
        function in_array(arr, elem) {
            let is_in_array = false
            arr.forEach((arr_element, index) => {
                let ident_obj = true
                Object.keys(elem).forEach(key => {
                    if (arr_element[key] !== elem[key]) {
                        ident_obj = false;
                    }
                });
                if (ident_obj) is_in_array = true;
            });
            return is_in_array;
        }

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
                return Promise.all(groups_arr.map(function(group) {
                    return app.CheckPointGroup.create({
                            group_id: group,
                            check_point_id: ctx.check_point.id
                        },
                        {transaction: t}
                    );
                })).then(() => {
                    return check_point;
                }).catch((err) => {
                    console.log(err);
                });
            }).then(function(check_point) {

                var mean_complexity = Number(check_point_data.test_config.mean_complexity);
                var questions_amount = Number(check_point_data.test_config.questions_amount);
                var test_cases_amount = Number(check_point_data.test_config.test_cases_amount);
                console.log(mean_complexity, questions_amount, test_cases_amount);
                let test_cases = [];
                for (let i = 0; i < test_cases_amount; i++) {
                    test_cases.push([]);
                }

                //Берем вопросы со сложностью, равной средней
                var question_to_cases = questions_arr.filter(question => {return Number(question.complexity) === mean_complexity;});

                //находим минимум и максимум сложности вопросов
                let max_complexity = Number(questions_arr[0].complexity);
                let min_complexity = Number(questions_arr[0].complexity);
                questions_arr.forEach(elem => {
                    if (Number(elem.complexity) > max_complexity) {
                        max_complexity = Number(elem.complexity);
                    }
                    if (Number(elem.complexity) < min_complexity) {
                        min_complexity = Number(elem.complexity);
                    }
                });

                //раскидываем вопросы по вариантам
                //Кладем по одному в вариант, пока не закончатся
                let ind = 0;
                question_to_cases.forEach((question) => {
                    if (test_cases[ind].length < questions_amount) {
                        test_cases[ind].push(question);
                        ind++;
                        if (ind === test_cases_amount) {
                            ind = 0;
                        }
                    }
                });

                //Дополняем варианты вопросами
                let diff_pos = 1; //положительное отклонение от средней сложности
                let diff_neg = 1; //отрицательное

                //Пока все варианты не заполнены, пытаемся их заполнить
                while (test_cases.some((v_case) => {return v_case.length < questions_amount})) {
                    //Пытаемся каждый вариант сначала усложнить, потом урпостить
                    test_cases.forEach((t_case) => {
                        if (t_case.length < questions_amount && (mean_complexity + diff_pos) <= max_complexity) {
                            let to_add = questions_arr.find((quest_in) => {
                                return !in_array(question_to_cases, quest_in) && Number(quest_in.complexity) === (mean_complexity + diff_pos);
                            });
                            if (to_add) {
                                question_to_cases.push(to_add);
                                t_case.push(to_add);
                            } else {
                                diff_pos++;
                            }
                        }
                        if (t_case.length < questions_amount && (mean_complexity - diff_neg) >= min_complexity) {
                            let to_add = questions_arr.find((quest_in) => {
                                return !in_array(question_to_cases, quest_in) && Number(quest_in.complexity) === (mean_complexity - diff_neg);
                            });
                            if (to_add) {
                                question_to_cases.push(to_add);
                                t_case.push(to_add);
                            } else {
                                diff_neg++;
                            }
                        }

                        //Если использовали все вопросы, но так и не заполнили варианты, то ...
                        if ((mean_complexity - diff_neg) < min_complexity && (mean_complexity + diff_pos) > max_complexity) {
                            //Если без повторений, то возвращаем ошибку
                            //Иначе обнуляем добавленные вопросы и снова дополняем
                            if (check_point_data.test_config.unique_questions === 'on') {
                                throw { message: 'Недостаточно вопросов для сбаллансированного формирования вариантов' };
                            } else {
                                //Перемешиваем вопросы для большей однородности
                                questions_arr = shuffle(questions_arr);
                                question_to_cases = questions_arr.filter(question => {return Number(question.complexity) === mean_complexity;});
                                diff_pos = 1;
                                diff_neg = 1;
                            }
                        }
                    });
                }

                console.log('CASES\n', test_cases);

                test_cases.forEach((case_questions, index) => {

                    //Создаем вариант теста
                    app.TestCase.create({
                        check_point_id: check_point.id,
                        title: `Вариант №${index + 1}`,
                    }).then((test_case) => {
                        case_questions.forEach((question) => {

                            //Добавляем вопросы к варианту
                            app.TestCaseQuestion.create({
                                test_case_id: test_case.id,
                                question_id: question.id,
                            }).catch((error) => {
                                console.log('add question to case error : ', error);
                            });
                        });
                    }).catch((error) => {
                        console.log('case creadion error : ', error);
                    });
                });
                return test_cases;
            }).then(function() {
                return ctx;
            }).catch(function(err) {
                console.log('make check point method err', err);
                throw err;
            });
        });
    };

    CheckPoint.make_hand = function (check_point_data, groups_arr, questions_arr) {
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
                return Promise.all(groups_arr.map(function(group) {
                    return app.CheckPointGroup.create({
                            group_id: group,
                            check_point_id: ctx.check_point.id
                        },
                        {transaction: t}
                    );
                })).then(() => {
                    return check_point;
                });
            }).then(function(check_point) {
                var questions_amount = Number(check_point_data.test_config.questions_amount);
                var test_cases_amount = Number(check_point_data.test_config.test_cases_amount);
                let test_cases = [];
                for (let i = 0; i < test_cases_amount; i++) {
                    test_cases.push([]);
                }


                //раскидываем вопросы по вариантам
                let ind = 0;

                questions_arr.forEach((question, index) => {
                    test_cases[ind].push(question);
                    if ((index + 1) % questions_amount === 0) {
                        ind++;
                    }
                });

                test_cases.forEach((case_questions, index) => {

                    //Создаем вариант теста
                    app.TestCase.create({
                        check_point_id: check_point.id,
                        title: `Вариант №${index + 1}`,
                    }).then((test_case) => {
                        case_questions.forEach((question) => {

                            //Добавляем вопросы к варианту
                            app.TestCaseQuestion.create({
                                test_case_id: test_case.id,
                                question_id: question.id,
                            }).catch((error) => {
                                console.log('add question to case error : ', error);
                            });
                        });
                    }).catch((error) => {
                        console.log('case creadion error : ', error);
                    });
                });
                return test_cases;
            }).then(function() {
                return ctx;
            }).catch(function(err) {
                console.log('make check point method err', err);
                throw  err;
            });
        });
    };

    CheckPoint.makeDynamic = function (check_point_data, groups_arr, questions_arr) {

        var ctx = {};

        console.log('\nMake test dynamic inputs\n\n\n');
        console.log('Check point data\n', check_point_data, '\n');
        console.log('Groups_arr\n', groups_arr,'\n');
        console.log('Question array\n', questions_arr, '\n');

        return sequelize.transaction(function (t) {
            return CheckPoint.unscoped().findOne({
                where: {title: check_point_data.title},
                transaction: t
                })
                .then(function (check_point) {
                if (check_point)
                    throw {message: 'Название контрольного мероприятия уже используется.'};

                //создание контрольного мероприятия
                //Это оставляем
                    return CheckPoint.create(check_point_data, {transaction: t});
                })
                .then(function(check_point) {
                    ctx.check_point = check_point.dataValues;
                    console.log('\nCheckpoint data values:\n', ctx.check_point);
                    //console.log('groups_arr', groups_arr);
                    return Promise.all(groups_arr.map(function(group) {
                        return app.CheckPointGroup.create({
                                group_id: group,
                                check_point_id: ctx.check_point.id
                            },
                            {transaction: t}
                        );
                    }));
                })
                .then(function(test_cases) {
                    return ctx;
                })
                .catch(function(err) {
                    console.log('make check point method err', err);
                    throw err;
                });
            });
        };
    };
