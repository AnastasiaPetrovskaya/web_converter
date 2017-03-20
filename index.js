'use strict'

var express = require('express'),
    path = require('path');
var express_config =require('./config/express.json');
var mongo_config =require('./config/mongo.json');
var postgres_config =require('./config/postgres.json');
console.log('var', postgres_config);

global.app = require('./lib/boot.js')({
    root_dir: __dirname,
    config: {
        mongo: mongo_config,
        postgres: postgres_config,
        express: express_config,
    }
});

console.log('app.config', app.config);

var http = app.http;

http.set_static(path.join(__dirname, 'static')); /* node-common function */
http.set('views', path.join(__dirname, 'views'));
http.set('view engine', 'jade');
http.require_controller('auth');
http.require_controller('banks');
http.require_controller('clients');
http.require_controller('money_transactions');
http.require_controller('databases');
http.require_controller('main', {is_root: true});
require('./lib/models.js')(app);
require('./models')(app);
