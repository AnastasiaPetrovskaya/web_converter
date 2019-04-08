var os = require("os");

function TestCases (questions, test_config) {
    this.questions = JSON.parse(JSON.stringify(questions));
    this.test_config = JSON.parse(JSON.stringify(test_config));
}

TestCases.prototype.generate = function() {
    //console.log('this', this);
    //самая элементарная проверка если включена опция уникальных вопросов но их не хватает
    if (this.test_config.unique_questions 
            && this.questions.length < this.test_config.test_cases_amount * this.test_config.questions_amount) {

        throw ({message: 'Вы выбрали варианты без повторений вопросов - каждый вопрос может встречаться толькор в одном варианте. ' + 
                'Однако вы выбрали недостаточно вопросов для формирования ' + this.test_config.test_cases_amount + ' вариантов. ' + 
                'Для формирования вариантов c заданными параметрами выбрано ' + this.questions.length + ' вопросов, необходимо минимум ' +
                (this.test_config.test_cases_amount * this.test_config.questions_amount) + ' вопросов.'});
    }


    var test_case = [];
    var test_cases = [];
    var questions_set = this.questions;

    var questions_number = this.questions.length;
    var current_question = 0;
    var current_test_case = 0;
    var questions_amount = this.test_config.questions_amount;

    var test_cases_amount = this.test_config.test_cases_amount;


    var a = current_question;
    var i,j,k;

    for (i = 1; i <= test_cases_amount; i++) {


        test_case = {
                            title: 'Вариант' + i, 
                            questions: []
                        };

        for (j = a; j < a + questions_amount; j++) {

            if (current_question < questions_number){

                test_case.questions.push(questions_set[j]);
                current_question += 1;

             }
             
             else{

                current_question = 0;
                k = 0;
                test_case.questions.push(questions_set[k]);
                current_question += 1;

             }
        
        }

        test_cases.push(test_case);

    }


    //проставляем для каждого вопроса количество его вхождений во варианты - первоначально -0 
    this.questions = this.questions.map(x => x.uses_amount = 0);

    return test_cases;
}


module.exports = TestCases;
