var TestAnswer = sequelize.define(
    'test_answer',
    {
        start: {type: Sequelize.DATE, allowNull: false},
        end: {type: Sequelize.DATE, allowNull: true},
        total_mark: {type: Sequelize.INTEGER, allowNull: true}
    },
    {
        tableName: 'tests_answers',
        //paranoid: true,
        //timestamps: true,
        //createdAt: 'created',
        //updatedAt: 'updated',
        //deletedAt: 'deleted'
    }
);

module.exports = TestAnswer;
