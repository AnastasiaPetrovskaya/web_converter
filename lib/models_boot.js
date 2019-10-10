var mongoose = require('mongoose');

module.exports = function(app) {
    var models = {
        Bank: require('../models/bank.js'),
        Client: require('../models/client.js')
    }

    if (app) {
        if(!app.config.mongo || !app.config.mongo[process.env.NODE_ENV]) {
            console.log('Not found mongo config ENV: ' + process.env.NODE_ENV);
            process.exit(1);
        }

        var config = app.config.mongo[process.env.NODE_ENV];
        var connection_string = make_connection_string(config);
        //console.log('connection string', connection_string)

        /*подключение к бд*/
        mongoose.connect(connection_string, config.options);

        mongoose.connection.on('open', function() {
            console.log('Mongo connect');
        });

        mongoose.connection.on('error', function(err) {
            console.log('Mongo connection error!', err);
            process.exit(1);
        });

        for (var key in models) {
            //console.log(models);
            if (models.hasOwnProperty(key)) {
                app[key] = models;
            }
        }
    } else {
        return models;
    }
};

var make_connection_string = function(config) {
    var str = 'mongodb://';

    if (config.username && config.password) {
        str += config.username + ':' + config.password + '@';
    }

    config.hosts.forEach(function(value, i) {
        var host = value[0],
            port = value[1];
        str += host + ':' +  port;

        if (i < config.hosts.length -1 ) {
            str += ',';
        }
    });

    str += '/' + config.database;

    return str;
}

