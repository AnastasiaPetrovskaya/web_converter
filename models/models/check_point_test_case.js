var CheckPoint = sequelize.define(
    'check_point_test_case',
    { },
    {
        tableName: 'check_points_test_cases',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
    }
);

module.exports = CheckPoint;
