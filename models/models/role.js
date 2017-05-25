var Role = sequelize.define(
    'role',
    {
        role: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        permissions: {type: Sequelize.JSON, allowNull: false}
    },
    {
        tableName: 'roles',
        //paranoid: false,
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
    }
);

module.exports = Role;
