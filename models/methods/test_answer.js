'use strict'

module.exports = function (models) {
    var CheckPoint = models.CheckPoint;
    var CheckPointGroup = models.CheckPointGroup;
    var TestAnswer = models.TestAnswer;
    var TestCase = models.TestCase;
    var TestCaseQuestion = models.TestCaseQuestion;
    const Op = Sequelize.Op;

    TestAnswer.make = function (check_point_id, user_id) {

        //найти вариант для заданной контрольной работы, который использовался меньше всего раз
        //и выдать его пользователю
        var ctx = {};
        var options = {};
        options.check_point_id = check_point_id;

        return new Promise(function(resolve, reject) {

            return sequelize.transaction(function (t) {
                return app.TestCase.findAll({
                        where: options,
                        attributes: ['id', [sequelize.fn('COUNT', sequelize.col('tests_answers.id')), 'usage_amount']],
                        include: [{
                            model: app.TestAnswer,
                            as: 'tests_answers',
                            attributes: [],
                            duplicating: false
                        }],
                        raw: true,
                        group: ['test_case.id'],
                        transaction: t,
                        order: [sequelize.fn('min', 'usage_amount')]
                    })
                    .then(function(result) {
                        console.log('result', result);
                        ctx.test_case_id = result[0].id;

                        //TODO создать TestAnswer и вернуть вопрос для выполнения
                        return app.TestAnswer.create(
                            {
                                user_id: user_id, 
                                check_point_id: check_point_id,
                                test_case_id: result[0].id,
                                start: new Date()
                            }, {
                                transaction: t
                            });
                    })
                    .catch(function(err) {
                        console.log('make test answer method err', err);
                        throw err;
                    });
            }).then(function() {
                return app.TestAnswer.next_question(check_point_id, user_id);
            }).then(function(next_question) {

                resolve(next_question);
                //return ctx;
            }).catch(function(err) {
                console.log('make test answer method err', err);
                throw err;
            });
        });

    },

    TestAnswer.makeDynamic = function(check_point_id, user_id){
        //Получить параметры контрольного мероприятия и найти подходящий вопрос для отображения
        //получить количество ответов для этой кр и юзера
        /*
        получить конфиг теста +
        получить вопросы +
        получить список отвеченных вопросов для check_point_id, из них выборку по user_id, зафиксировать кол-во
            ответов.
        получить список не использовавшихся или меньшее кол-во раз. Если их несколько, то выбор рандомом
        отправить вопрос

         */
        let testCaseId, questionPrim;
        return new Promise(function (resolve, reject) {
            return sequelize.transaction(function (t) {
                return app.CheckPoint.findById(check_point_id)
                    .then(check_point => {
                        console.log('\n\nCheckpoint requested data \n-----------------\n', check_point.dataValues.test_config.start_complexity);
                        //Получить конфиг теста
                        return {
                            start_comp: check_point.dataValues.test_config.start_complexity,
                            great_comp: check_point.dataValues.test_config.great_complexity,
                            less_comp: check_point.dataValues.test_config.less_complexity,
                            type: check_point.dataValues.type,
                        }
                    })
                    .then(function (config) {
                        //Найти вопрос
                        return app.Question.findAll(
                            {
                                where : {
                                    query_type : config.type,
                                    complexity : config.start_comp
                                }
                            }
                        )
                            .then(questions => {
                                //вопросы из диапазона
                                //console.log('\nQuestions first\n', questions[0].dataValues);
                                //создать вариант
                                return app.TestCase.create(
                                    {
                                        title : 'Dynamic case',
                                        check_point_id : check_point_id
                                    },
                                    {
                                        transaction : t
                                    }
                                )
                                    .then(test_case => {
                                        console.log('\nCase created with id : ', test_case.dataValues.id, '\n');

                                        testCaseId = test_case.dataValues.id;
                                        questionPrim = questions[0].dataValues;
                                        return test_case
                                        // //В вариант добавить вопрос
                                        // return app.TestCaseQuestion.create(
                                        //     {
                                        //         question_id : questions[0].dataValues.id,
                                        //         test_case_id : test_case.dataValues.id
                                        //     },
                                        //     {
                                        //         transaction : t
                                        //     }
                                        // )
                                        //     .then(test_case_question => {
                                        //         console.log('\nTestCaseQuestion created with id : ', test_case_question.dataValues.id);
                                        //     })
                                        //     .catch(err => {
                                        //         console.log('\nAddin question to case failed. Error :\n', err);
                                        //         throw err
                                        //     })
                                    })
                                    .catch(err => {
                                        console.log('\nCase creating failed. Error :\n', err);
                                        throw err
                                    })
                            })
                            .then(function (question) {
                                return app.TestAnswer.create(
                                    {
                                        user_id : user_id,
                                        check_point_id : check_point_id,
                                        test_case_id : testCaseId,
                                        start : new Date()
                                    },
                                    {
                                        transaction : t
                                    }
                                )
                            })
                            .catch(err => {
                                console.log('\nError\n', err)
                            })
                    })
            })
                .then(function () {
                    return app.TestAnswer.next_question_dynamic(check_point_id, user_id)
                })
                .then(next_question => {
                    resolve(next_question)
                })
                .catch(error => {
                    console.log('\n\nError in make_dyn transaction with:\n', error)
                    throw error
                })
        })
    },

    TestAnswer.next_question_dynamic = function(check_point_id, user_id){
        /*
        получить конфиг теста
        посмотреть сколько вопросов должно быть
        посмотреть сколько ответов дал user_id в check_point_id
        если есть отвеченный, то посмотреть его оценку если правильно, то дать вопрос большей сложности
            если не правильно, то дать меньшей сложности.
        если нет отвеченных, то выдать вопрос с начальной сложностью
        если ответов достаточно, то завершить
         */
        console.log('\n NQD called\n');
        return new Promise(function(resolve,reject){
            //получаем конфиг теста
            app.CheckPoint.findById(check_point_id)
                .then(check_point => {
                    console.log('\nCheck point look\n',check_point);
                    return check_point.dataValues
                })
                .then(check_point_config => {
                    //Ищем все ответы для этого юзера и теста
                    return app.QuestionAnswer.findAll(
                        {
                            where : {
                                user_id : user_id,
                                check_point_id : check_point_id
                            }
                        }
                    )
                        .then(answers => {
                            if (answers.length > 0){
                                //найти последний отвеченный, посмотреть его оценку и сложность и найти подходящий вопрос

                            } else {
                                //вернуть вопрос стартовой сложности
                                //TODO убирать уже ранее отвеченные вопросы
                                console.log('\n\nDataValues\n');
                                console.log(check_point_config);
                                return app.Question.findAll(
                                    {
                                        where : {
                                            query_type : check_point_config.type,
                                            complexity : check_point_config.test_config.start_complexity
                                        }
                                    }
                                )
                                    .then(questions => {
                                        //выбрать случайный вопрос
                                        let index = Math.floor(Math.random() * questions.length);
                                        resolve(questions[index].dataValues)
                                    })
                                    .catch(err => {
                                        console.log('\nError in search questions : \n', err);
                                        throw err
                                    })
                            }
                        })
                })
        })
    },

    TestAnswer.next_question = function(check_point_id, user_id) {
        /* TODO. Что делает этот запрос
         * select distinct - выбрать уникальные
         * d.title as db_title, - названия бд
         * d.description as db_description - описания бд
         *
         * from - из таблиц
         * databases as d - Базы Данных как "д" ( таблица загруженных баз данных )
         * questions as x - Вопросы как "х" ( таблица вопросов к базам )
         * test_cases as y - Тестоый вариант как "у" ( таблицы вариантов тестов )
         * tests_answers as z - Ответ на тест как "з" ( таблица прохождения теста )
         * test_cases_questions as m - Вопросы тестового варианта как "м" ( таблица вопросов вариантов )
         *
         * where - где
         * d.id = x.db_id - айди бд = вопрос.бд_айди
         * and z.check_point_id = :check_point_id: - и Прохождение_теста.Ид_Теста = ИД_ТЕСТА
         * and z.user_id = :user_id: - и Прохождение_теста.Ид_пользователя = ИД_ПОЛЬЗОВАТЕЛЯ
         * and z.test_case_id = m.test_case_id - и Прохождение.Ид_варианта = Вопросы_варианта.Ид_варианта
         * and m.question_id = x.id - и Вопросы_варианта.Ид_вопроса = Вопросы.Ид
         * and not exists - и НЕ существует
         *      select * - такой выборка
         *
         *      from - из
         *      questions_answers as n - таблицы ответов на вопросы, как "н"
         *
         *      where - где
         *      n.question_id = x.id - Ответы.Ид_вопроса = Вопросы.Ид
         *      and n.check_point_id = :check_point_id: - и Ответы.Ид_теста = ИД_ТЕСТА
         *      and n.user_id = :user_id: - и ОтветыюИд_пользователя = ИД_ПОЛЬЗОВАТЕЛЯ
         *
         */
        var query = `
            select distinct x.*, d.title as db_title, d.description as db_description
            from databases as d, questions as x, test_cases as y, tests_answers as z, test_cases_questions as m
            where d.id = x.db_id and z.check_point_id = :check_point_id: and z.user_id = :user_id: and
                z.test_case_id = m.test_case_id and m.question_id = x.id and not exists 
                ( select * 
                  from questions_answers as n 
                  where n.question_id = x.id and n.check_point_id = :check_point_id: and
                    n.user_id = :user_id:
                );
            `;
        query = query.replace_all(':user_id:', user_id).replace_all(':check_point_id:', check_point_id);

        //console.log('query', query);


        return sequelize.query(
            query,
            {
                type: sequelize.QueryTypes.SELECT,
                raw: true,
                //logging: console.log
            }
        ).catch(function(err) {
            console.log('next question method err', err);
            throw err;
        });
    }


};



String.prototype.replace_all = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
