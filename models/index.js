var fs = require("fs"),
   // Umzug = require("umzug"),
    path = require("path"),
    utils = require("./utils"),
    options = {};

require('pg').defaults.parseInt8 = true;
var node_validator = require('node-validator');

module.exports = function (app) {
    var pg_config = app.config.postgres[process.env.NODE_ENV],
        json_fields = {};

    global.Sequelize = require('sequelize');
    global.sequelize = new Sequelize(
        pg_config.database,
        pg_config.user,
        pg_config.password,
        {
            host: pg_config.host,
            dialect: 'postgres',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            transactionType: Sequelize.Transaction.TYPES.DEFERRED,
            /* isolationLevel, возможно, стоит изменить на что попроще */
            isolationLevel: 'SERIALIZABLE',
            timezone: '+03:00',
            logging: false
        }
    );

    sequelize.json_validator = node_validator;

    var models = {
        //Application: require('./models/application'),
        Token: require('./models/user_session_token'),
        //AuthToken: require('./models/auth_token'),
        //Card: require('./models/card'),
        //CardSession: require('./models/card_session'),
        //Game: require('./models/game'),
        //Tape: require('./models/tape'),
        //GameState: require('./models/game_state'),
        //GameBet: require('./models/game_bet'),
        //Invoice: require('./models/invoice'),
        //Message: require('./models/message'),
        //MoneyTransfer: require('./models/money_transfer'),
        //Partner: require('./models/partner'),
        //Payment: require('./models/payment'),
        // Player: require('./models/player'),
        // PlayerSession: require('./models/player_session'),
        Role: require('./models/role'),
        //Sms: require('./models/sms'),
        //Terminal: require('./models/terminal'),
        //TerminalKey: require('./models/terminal_key'),
        //TerminalLog: require('./models/terminal_log'),
        //TerminalSession: require('./models/terminal_session'),
        User: require('./models/user'),
        //UserLog: require('./models/user_log'),
        //MoneyTransaction: require('./models/money_transaction'),
        //CashierSession: require('./models/cashier_session'),
        //Jackpot : require('./models/jackpot'),
        //BillAcceptor : require('./models/bill_acceptor'),
        //Dispenser : require('./models/dispenser'),
        //MoneyEncashment : require('./models/money_encashment')
        CheckPoint: require('./models/check_point'),
        DataBase: require('./models/data_base.js')
    };


    utils.require_methods(models, app);
    //utils.add_json_validation(models);
    //utils.json_auto_changed(sequelize, models);
    require('./associations')(models);

    if (app) {
        app.models_list = Object.keys(models);
        for (var model in models) {
            console.log('models[model]', models[model]);
            app[model] = models[model];
        }

        app.Sequelize = Sequelize;
        app.sequelize = sequelize;
    } else {
        return models;
    }

    /**
     * sync создает таблицы, если их нет в базе, но не делает alter table, если описание
     * модели изменилось.
     */
    var force_sync = false;

    if (process.env.PG_FORCE_SYNC && (process.env.NODE_ENV == 'test'))
        console.log('force sync true');
        force_sync = true;

/*    if (process.env.INIT_GAMES) {
        require('./inits/init.js')(models).init_games()
			.then(function() {log('Init games completed');})
			.catch(function(error) {log('Error', error);log('Stack', error.stack);});
    }

	if (process.env.INIT_JACKPOT) {
		require('./inits/init.js')(models).init_jackpots()
			.then(function() {log('Init jackpots completed');})
			.catch(function(error) {log('Error', error);log('Stack', error.stack);});
	}

	if (process.env.INIT_CASH_UNIT) {
		require('./inits/init.js')(models).init_cash_unit()
			.then(function() {log('Init cash unit completed');})
			.catch(function(error) {log('Error', error);log('Stack', error.stack);});
	}*/

    return sequelize.sync({force: force_sync}).then(function () {

        //запуск миграций это сделано для тестов
/*        if((process.node_env == 'test') || process.env.MIGRATION) {

            var umzug = new Umzug({
                migrations: {
                    params: [ sequelize.getQueryInterface(), Sequelize ],
                    path: __dirname + "/migrations"
                },
                storage: "sequelize",
                storageOptions: {
                    sequelize: sequelize
                },
                logging: console.log
            });

            umzug.pending()
            .then(function (migrations) {
                var mg = [];

                migrations.forEach(function(el) {
                    umzug.execute({
                        migrations: [el.file],
                        method: "up"
                    });
                });

                }).catch(function(err) {
                    console.log("error migrating DB: " + err);
                });
        }*/

    /*    if(process.node_env == 'test' && process.send) {
            process.send('finish');
        } */


        //заполнение базы стартовыми данными
        if (force_sync)
            require('./init')(models);


    }).catch(function(error) {
        console.log('Error', error);
        console.log('Stack', error.stack);
    });
};


