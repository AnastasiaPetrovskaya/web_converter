'use strict';

/**
 * Создание таблицы cashiers_sessions для хранения сессий кассиров
 */
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'students',
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                group_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'groups',
                        key: 'id',
                        onUpdate: 'CASCADE'
                    }
                },
                created: Sequelize.DATE,
                updated: Sequelize.DATE,
                deleted: Sequelize.DATE,
                closed: Sequelize.DATE
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('students');
    }
};
