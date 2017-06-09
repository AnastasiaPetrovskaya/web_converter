var os = require("os");

function TestCases (questions, test_config) {
    this.questions = JSON.parse(JSON.stringify(questions));
    this.test_config = JSON.parse(JSON.stringify(test_config));
}

TestCases.prototype.generate = function() {
    console.log('this', this);
    //самая элементарная проверка если включена опция уникальных вопросов но их не хватает
    if (this.test_config.unique_questions 
            && this.questions.length < this.test_config.test_cases_amount * this.test_config.questions_amount) {

        throw ({message: 'Вы выбрали варианты без повторений вопросов - каждый вопрос может встречаться толькор в одном варианте. ' + 
                'Однако вы выбрали недостаточно вопросов для формирования ' + this.test_config.test_cases_amount + ' вариантов. ' + 
                'Для формирования вариантов c заданными параметрами выбрано ' + this.questions.length + ' вопросов, необходимо минимум ' +
                (this.test_config.test_cases_amount * this.test_config.questions_amount) + ' вопросов.'});
    }

    //проставляем для каждого вопроса количество его вхождений во варианты - первоначально -0 
    this.questions = this.questions.map(x => x.uses_amount = 0);

    return [];
}


module.exports = TestCases;
