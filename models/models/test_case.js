var CheckPoint = sequelize.define(
    'test_case',
    {
        title: {type: Sequelize.STRING, allowNull: false},
    },
    {
        tableName: 'test_cases',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
    }
);

module.exports = CheckPoint;
