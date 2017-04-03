var DataBase = sequelize.define(
    'data_base',
    {
        title: {type: Sequelize.STRING, allowNull: false},
        description: {type: Sequelize.STRING, allowNull: false},
        type: {type: Sequelize.STRING, allowNull: false},
        note: {type: Sequelize.STRING}
    },
    {
        tableName: 'data_base',
        paranoid: true,
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

