'use strict';

/**
 * Добавление поля cashier_session_id в таблицу money_transactions
 */

var table = 'users',
    column = 'name';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            table,
            column,
            {
                type: Sequelize.STRING,
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(table, column);
    }
};
