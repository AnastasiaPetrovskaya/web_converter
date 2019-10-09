#!usr/bin/env node
'use strict'

var express = require('express'),
    path = require('path');
var express_config;
express_config = require('./config/express.json');

// var mongo_config =require('./config/mongo.json');

var postgres_config =require('./config/postgres.json')[process.env.NODE_ENV];
//var postgres_config =require('./config/postgres.json')["test"];
//console.log('var', postgres_config);


process.env.NODE_ENV = 'test';


global.app = require('./lib/boot.js')({
    root_dir: __dirname,
    config: {
        // mongo: mongo_config,
        postgres: postgres_config,
        express: express_config,
    }
});


//console.log('app.config', app.config);

var http = app.http;

http.locals.moment = require('moment');

http.set_static(path.join(__dirname, 'static')); /* node-common function */
http.set('views', path.join(__dirname, 'views'));
http.set('view engine', 'jade');

require('./lib/application_helper');
http.require_controller('auth');
http.require_controller('check_points');
http.require_controller('databases');
http.require_controller('questions');
http.require_controller('questions_answers');
http.require_controller('groups');
http.require_controller('students');
http.require_controller('materials');
http.require_controller('main', {is_root: true});
//require('./lib/models.js')(app);
require('./models')(app);

/* catch 404 and forward to error handler */
http.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* middleware для обработки ошибок из api (т.к. ошибка содержится не в err.message, а err.error) */
http.use(function(err, req, res, next) {
    if (err.error === 'InvalidToken') {
        /* Невалидный токен по каким-то неведомым причинам */
        res.redirect('/logout');
    } else if (err.error) {
        /* если есть err.error значит ошибка из api */
        var error = new Error(err.error);
        error.status = err.status || 500;
        next(error);
    } else {
        /* если нет - прокидываем ошибку дальше */
        next(err);
    }
});

http.use(function(err, req, res, next) {
    /* Из-за этого middleware информация об ошибках не выводится в консоль,
     * поэтому пришлось добавлять этот хак.
     */
    if (process.env.NODE_ENV === 'dev')
        console.error(err.stack);

    res.status(err.status || 500);
    res.render('error', {
        status: err.status,
        message: err.message,
        error: (process.env.NODE_ENV  === 'dev') ? err : {}
    });
});
