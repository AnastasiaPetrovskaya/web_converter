var QuestionAnswer = sequelize.define(
    'question_answer',
    {
        answer: {type: Sequelize.JSON, allowNull: false},
        processed_answer: {type: Sequelize.JSON, allowNull: true},
        sql: {type: Sequelize.TEXT},
        error: {type: Sequelize.TEXT},
        mark: {type: Sequelize.INTEGER, allowNull: false},
    },
    {
        tableName: 'questions_answers',
        //paranoid: true,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted'
    }
);

module.exports = QuestionAnswer;
