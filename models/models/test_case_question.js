var CheckPoint = sequelize.define(
    'test_case_question',
    { },
    {
        tableName: 'test_cases_questions',
        timestamps: false
        //createdAt: 'created',
        //updatedAt: 'updated',
        //deletedAt: 'deleted',
    }
);

module.exports = CheckPoint;
