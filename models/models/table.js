var Table = sequelize.define(
    'table',
    {
        title: {type: Sequelize.STRING, allowNull: false}
    },
    {
        tableName: 'tables',
        //paranoid: true,
        timestamps: false
        //createdAt: 'created',
        //updatedAt: 'updated',
        //deletedAt: 'deleted',
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

