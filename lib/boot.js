'use strict'


var express = require('express');
var path = require('path');

var http = express();
/*подключение контроллеров*/

module.exports = function (options) {

    var EventEmitter = require('events').EventEmitter;
    var app = new EventEmitter();
    app.root_dir = options.root_dir;
    app.config = {};
    app.config.mongo = options.config.mongo;
    app.config.express = options.config.express;


    require('./express.js')(app);

    return app;
}
