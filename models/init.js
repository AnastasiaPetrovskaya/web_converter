const crypto = require('crypto');

module.exports = function (models) {
    var permissions = {},
            ctx = {};

    Object.keys(models).forEach(function (m) {
        permissions[m] = {'read' : true, 'create' : true, 'update' : true, 'delete' : true};
    });

    models.Role.create({
        role: 'root',
        permissions: permissions
    }).then(function (role) {
        ctx.role = role;

        return models.User.create({
            login: 'user',
            password: '$2a$10$cGW2Zj.kD5OfaIHW49unbedNuB/GDR9xxH5tRhKhGWEaJk34aL/LW',
            role_id: ctx.role.id,
        });
    }).then(function (user) {
        ctx.user = user;
        console.log('user', ctx.user.dataValues.id);

        return models.DataBase.create({
            title: 'Fake_db',
            note: 'ненастоящая база',
            description: 'база созданная при инициализации базы данных',
            type: 'common',
            owner_id: ctx.user.dataValues.id
        });
    }).then(function (db) {
        ctx.db = db;
        console.log('db', ctx.db.dataValues.id);

        return models.Question.create({
            title: 'Fake_question_1',
            query_type: 'RA',
            text: 'Это тестовы вопрос по реляционной алгебре, который не привязан к реальной базе данных',
            sql_answer: 'SELECT * FROM STUDENTS;',
            owner_id: ctx.user.dataValues.id,
            db_id: ctx.db.dataValues.id,
            db_type: ctx.db.dataValues.type
        });
    }).then(function (question) {
        ctx.questionRA = question;
        console.log('question1', ctx.questionRA.dataValues.id);

        return models.Question.create({
            title: 'Fake_question_2',
            query_type: 'TC',
            text: 'Это тестовы вопрос по исчислению на кортежах, который не привязан к реальной базе данных',
            sql_answer: 'SELECT * FROM STUDENTS;',
            owner_id: ctx.user.dataValues.id,
            db_id: ctx.db.dataValues.id,
            db_type: ctx.db.dataValues.type
        });
    }).catch(function(err){
        console.log(err.stack);
        console.log('Err during initing db', err.stack);
    });
};
