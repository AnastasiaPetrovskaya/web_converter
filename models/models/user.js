var User = sequelize.define(
    'user',
    {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        login: {type: Sequelize.STRING, allowNull: false, unique: true},
        password: {type: Sequelize.STRING, allowNull: false},
    },
    {
        tableName: 'users',
        //paranoid: true,
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
