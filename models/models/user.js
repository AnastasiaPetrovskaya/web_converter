var User = sequelize.define(
    'user',
    {
        email: Sequelize.STRING,
        login: {type: Sequelize.STRING, allowNull: false, unique: true},
        password: {type: Sequelize.STRING, allowNull: false},
        phone: Sequelize.STRING,
    },
    {
        tableName: 'users',
        paranoid: true,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted'
 /*       indexes: [
            {
                name: 'user_partnerid_index',
                method: 'BTREE',
                fields: ['partner_id']
            }
        ]*/
    }
);

module.exports = User;
