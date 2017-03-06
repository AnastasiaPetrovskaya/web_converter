var fs = require('fs'),
    path = require('path');

var node_validator = require('node-validator');

/**
 * Включение, отключения логирования в sequelize.
 * @param {Object} conf конфиг для Postgres
 */
module.exports.set_logging = function set_logging (conf) {
    if (process.env.NODE_ENV === 'prod')
        return false;

    if (process.env.PG_LOG_ENABLE || conf.logging)
        return true;

    return false;
};


/**
 * Импортирует все, что лежит в директории methods.
 */
module.exports.require_methods = function (models, app) {
    var property_name = null,
        extension = null;

    var files = fs.readdirSync(path.join(__dirname, 'methods'));

    files.forEach(function (file) {
        require(path.join(__dirname, 'methods', file))(models, app);
    });
};


/**
 * Валидация JSON полей для sequelize.
 * Чтобы этот хук работал, нужно в поле с типом JSONB добавить свойтсво json_rules (пример ниже)
 * Доки для node-validator: https://www.npmjs.com/package/node-validator
 *
 * data: {
 *     type: Sequelize.JSONB,
 *     allowNull: false,
 *     json_rules:  sequelize.json_validator.isObject()
 *                  .withRequired('id', node_validator.isNumber())
 * }
 */
module.exports.add_json_validation = function (models) {
    Object.keys(models).forEach(function (modelName) {
        var model = models[modelName];

        model.addHook('beforeValidate', function (instance, options) {
            var fields = Object.keys(model.tableAttributes);

            fields.forEach(function(item) {
                /* Ищем поля с типом JSONB и свойством json_rules  */
                if (model.tableAttributes[item].type.constructor.key === 'JSONB' &&
                    model.tableAttributes[item].json_rules) {

                    node_validator.run(
                        model.tableAttributes[item].json_rules,
                        instance.dataValues[item],
                        function(errorCount, errors) {
                            var err_msg = 'SequelizeJSONValidationError\n';
                            if (errorCount > 0) {
                                err_msg = err_msg + '\n    ' + 'Model: ' + modelName + 
                                          ', column: ' + item + '\n';

                                errors.forEach(function (err) {
                                    err_msg = err_msg + '      ' + 'Key: ' + err.parameter +
                                              ', value: ' + err.value + ', error: ' + err.message+'\n';
                                });

                                throw new Error(err_msg);
                            }
                        }
                    );
                }
            });
        });
    });
};


/*
 * Автоматическое добавление полей с типами JSON, JSONB
 *  в список changed перед сохранением.
 *  Sequalize "beforeUpdate" hook
 */
module.exports.json_auto_changed = function (sequelize, models) {
    var json_fields = {};

    Object.keys(models).forEach(function (model_name) {
        var model_data = models[model_name],
            attrs = model_data.tableAttributes,
            table_name = model_data.tableName;

        Object.keys(attrs).forEach(function (attr_name) {
            var type = attrs[attr_name].type.constructor.key;
            if (type == 'JSON' || type == 'JSONB') {
                if (json_fields[table_name]) {
                    json_fields[table_name].push(attr_name);
                } else {
                    json_fields[table_name] = [attr_name];
                }
            }
        });
    });

    sequelize.addHook('beforeUpdate', function (instance) {
        var table_name = instance.$modelOptions.tableName;
        if (json_fields[table_name]) {
            json_fields[table_name].forEach(function (attr_name) {
                instance.changed(attr_name, true);
            });
        }
    });
}
