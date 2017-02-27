'use strict'

var express = require('express');
var path = require('path');
var body_parser = require('body-parser');

var http = express();

module.exports = function (app) {
    console.log('http', http);

    if(!app.config.express || !app.config.express[process.env.NODE_ENV]) {
        console.log('Not found express config ENV: ' + process.env.NODE_ENV);
        process.exit(1);
    }
    var config = app.config.express[process.env.NODE_ENV];

    var port = config.port,
        host = config.host || '0.0.0.0';


    // parse application/x-www-form-urlencoded
    http.use(body_parser.urlencoded({ extended: false }));
    // parse httplication/json
    http.use(body_parser.json());

    //Middleware для удобного формирования ответов в формате JSON
    http.use(function(req, res, next) {
        //успешный ответ
        res.success = function(data) {
            data = data || {};

            var response = {success: true};

            if (!data || typeof(data) !== 'object') {
                throw new JSONResponseError('[res.success] data should be a valid object');
            }

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    response[key] = data[key];
                }
            }

            res.status(200);
            res.json(response);
        };

        res.error = function(error) {
            var out_msg = '';

            if (!error) {
                throw JSONResponseError('[res.error] Error message is required');
            }

            if (error instanceof Error) {
                out_msg = 'ServerError';
            } else {
                out_msg = error.message || error;
            }

            res.status(200);
            console.log('middlewae', out_msg);
            res.json({success: false, error: out_msg});
        };

        next();
    });


    http.server = http.listen(port, host);
    console.log('Express server has been started! Port:' + port);

    http.init_controller = function(urn, routes) {
        if (urn == '/'){
            urn = '';
        }
        console.log('routes', routes);

        for (var method in routes.methods) {
            Object.keys(routes.methods[method]).forEach(function(path) {
                http[method](urn + path, routes.methods[method][path]);
            });
        }
    }

    http.require_controller = function(name, options) {
        var options = options || {};
        var urn = options.urn || '/' + name;

        if (options.is_root) {
            urn = '/';
        }

        var routes = require(path.join(app.root_dir, 'controllers', name + '_controller'));
        this.init_controller(urn, routes);
    }

    http.set_static = function(path, route) {
        if (!route) {
            http.use(express.static(path));
        } else {
            http.use(route, express.static(path));
        }
    };

    if (app) {
        app.http = http;
    } else {
        return http;
    }
}
