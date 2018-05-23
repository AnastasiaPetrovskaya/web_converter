var CheckPointGroup = sequelize.define(
    'check_point_group',
    { },
    {
        tableName: 'check_points_groups',
        timestamps: false
        //createdAt: 'created',
        //updatedAt: 'updated',
        //deletedAt: 'deleted',
    }
);

module.exports = CheckPointGroup;
