var Group = sequelize.define(
    'group',
    {
        title: {type: Sequelize.STRING, allowNull: false}, //название М15-505
        department: Sequelize.STRING, //кафедра
        specialty: Sequelize.STRING, //специальность
    },
    {
        tableName: 'groups',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted'
    }
);

module.exports = Group;
