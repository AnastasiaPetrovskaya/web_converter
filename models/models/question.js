var Question = sequelize.define(
    'question',
    {
        title: {type: Sequelize.STRING, allowNull: false},
        tag: {type: Sequelize.STRING, allowNull: true},
        query_type: {type: Sequelize.ENUM('RA', 'TC'), allowNull: false},
        complexity: {type: Sequelize.INTEGER, allowNull: false},
        text: {type: Sequelize.TEXT, allowNull: false},
        sql_answer: {type: Sequelize.TEXT, allowNull: false},
        help: {type: Sequelize.STRING, allowNull: true},
        last_using: {type: Sequelize.DATE , allowNull: true},
        db_type: {type: Sequelize.ENUM('test', 'prepare', 'common', 'private'), allowNull: false}
    },
    {
        tableName: 'questions',
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

module.exports = Question;
