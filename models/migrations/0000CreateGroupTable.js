'use strict';

/**
 * Создание таблицы groups для хранения групп студентов
 */
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'group',
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                title: {type: Sequelize.STRING, allowNull: false}, //название М15-505
                department: Sequelize.STRING, //кафедра
                specialty: Sequelize.STRING, //специальность
                created: Sequelize.DATE,
                updated: Sequelize.DATE,
                deleted: Sequelize.DATE,
                closed: Sequelize.DATE
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('group');
    }
};
