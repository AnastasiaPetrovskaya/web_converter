var Table = sequelize.define(
    'table',
    {
        title: {type: Sequelize.STRING, allowNull: false}
    },
    {
        tableName: 'table',
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

module.exports = Table;

