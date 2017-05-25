'use strict'

var express = require('express');
var path = require('path'),
    flash = require('express-flash');
var body_parser = require('body-parser');
var cookie_parser = require('cookie-parser');

//var multer = require('multer');
//var upload = multer({dest: 'uploads/'}).array('db', 12);

var http = express();

module.exports = function (app) {
    //console.log('http', http);

    if(!app.config.express || !app.config.express[process.env.NODE_ENV]) {
        console.log('Not found express config ENV: ' + process.env.NODE_ENV);
        process.exit(1);
    }
    var config = app.config.express[process.env.NODE_ENV];

    var port = config.port,
        host = config.host || '0.0.0.0';


    var check_auth = require('../middleware/check_auth')(config.check_auth);
    //var check_permissions = require('../middleware/check_permissions');

    // parse application/x-www-form-urlencoded
    http.use(body_parser.urlencoded({ extended: false }));
    // parse httplication/json
    http.use(body_parser.json());

    http.use(flash());

    http.use(cookie_parser())

    /* Использование сессии, расположенной в куках пользователя в зашифрованном виде */
    //if (options.client_session) {
        var session = require('client-sessions');
        var secret = 'oversecret';
        var duration = 7 * 24 * 60 * 60 * 1000;

    /*    if (options.client_session.secret) {
            secret = options.client_session.secret;
        }

        if (options.client_session.duration) {
            duration = options.client_session.duration;
        }
*/
        http.use(session({
            secret: secret,
            cookieName: 'session',
            duration: duration
        }));
    //}

    //Middleware for handling multipart/form-data, which is primarily used for uploading files.
  /*  http.use(function(req, res, next) {
        //upload.array('db', 12);
       upload(req,res, function(err) {
            if (err) {
                console.log('err in multer middleware', err)
            }
            next();
        });
    });*/

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

            var error_details = {};
            if (error.sql_err_position) 
                error_details.sql_err_position = error.sql_err_position;

            if (error.sql)
                error_details.sql = error.sql;


            res.status(200);
            res.json(Object.assign({},
                        {success: false, error: out_msg}, error_details));
        };

        next();
    });


    http.server = http.listen(port, host);
    console.log('Express server has been started! Port:' + port);

    http.init_controller = function(urn, routes) {
        var resource = routes.resource;

        if (urn == '/'){
            urn = '';
        }
        //console.log('routes', routes);

        for (var method in routes.methods) {
            Object.keys(routes.methods[method]).forEach(function(path) {
                http[method](
                    urn + path,
                    function(req, res, next) {
                        req.endpoint = resource;
                        next();
                    },
                    check_auth,
                    //check_permissions,
                    routes.methods[method][path]
                );
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
