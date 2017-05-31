'use strict';

/**
 * Добавление поля cashier_session_id в таблицу money_transactions
 */

var table = 'users',
    column = 'student_id';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            table,
            column,
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'students',
                    key: 'id',
                    onUpdate: 'CASCADE',
                },
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(table, column);
    }
};
