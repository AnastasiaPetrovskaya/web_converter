var Material = sequelize.define(
    'material',
    {
        title: {type: Sequelize.STRING, allowNull: false},
        text: {type: Sequelize.TEXT, allowNull: false},
        material_type: {type: Sequelize.TEXT, allowNull: false},
        material_name: {type: Sequelize.TEXT, allowNull: false},
    },
    {
        tableName: 'materials',
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

module.exports = Material;