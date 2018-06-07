'use strict'
var child_process = require('child-process-promise');
var pg = require('pg');
var username = app.config.postgres.user;
var password = app.config.postgres.password;
var database = app.config.postgres.database;
var host = app.config.postgres.host;

module.exports = function (models) {
    var Material = models.Material;

    Material.make = function (material_data, filename) {
        var ctx = {};
        console.log ('ВОТ ОН ЗДЕСЬ', filename);
        console.log ('КОРОЧЕ ТАКИЕ ДАННЫЕ', material_data);
        material_data.material_name = filename;
        console.log ('ну пожалуйста', material_data);
        return sequelize.transaction(function (t) {
            return Material.unscoped().findOne({
                where: {title: material_data.title},
                transaction: t
            }).then(function (material) {
                if (material)
                    throw {message: 'MaterialExists'};
                return Material.create(material_data, {transaction: t});
            }).then(function(material){
                //console.log ('здесь должен быть файлнейм', material_data);
                return material.dataValues;
            }).catch(function(err) {
                console.log('make material method err', err);
                throw err;
            });
        });
    }

    Material.download = function (material_data) {
        var ctx = {};
        console.log ('ну пожалуйста', material_data.material_name);
        return sequelize.transaction(function (t) {
            return Material.unscoped().findOne({
                where: {title: material_data.material_name},
                transaction: t
            }).then(function (material) {
                if (material)
                    throw {message: 'MaterialExists'};
                return Material.create(material_data, {transaction: t});
            }).then(function(material){
                //console.log ('здесь должен быть файлнейм', material_data);
                return material.dataValues;
            }).catch(function(err) {
                console.log('make material method err', err);
                throw err;
            });
        });
    }
};