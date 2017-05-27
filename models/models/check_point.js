var CheckPoint = sequelize.define(
    'check_point',
    {
        title: {type: Sequelize.STRING, allowNull: false},
        type: {type: Sequelize.STRING, allowNull: false},
        date_from: {type: Sequelize.DATE, allowNull: false, unique: true},
        date_to: {type: Sequelize.DATE, allowNull: false},
        url: {type: Sequelize.STRING, allowNull: true}
    },
    {
        tableName: 'check_point',
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

module.exports = CheckPoint;
