var Token = sequelize.define('token',
    {
        token: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        }
    },
    {
        tableName: 'tokens',
        paranoid: true,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        indexes: [
            {
                name: 'token_roleid_index',
                method: 'BTREE',
                fields: ['role_id']
            }
        ]
    }
);


module.exports = Token;
