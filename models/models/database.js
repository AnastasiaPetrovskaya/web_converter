var DataBase = sequelize.define(
    'database',
    {
        title: {type: Sequelize.STRING, allowNull: false},
        description: {type: Sequelize.STRING, allowNull: false},
        type: {type: Sequelize.ENUM('test', 'prepare', 'common', 'private'), allowNull: false},
        note: {type: Sequelize.STRING}
    },
    {
        tableName: 'databases',
        //paranoid: true,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
       /* indexes: [
            {
               name: 'user_partnerid_index',
                method: 'BTREE',
                fields: ['partner_id']
            }
        ]*/
    }
);

module.exports = DataBase;

