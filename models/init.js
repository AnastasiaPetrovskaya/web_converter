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
            title: 'Fake db',
            note: 'ненастоящая база',
            description: 'база созданная при инициализации базы данных',
            type: 'common',
            owner_id: ctx.user.dataValues.id
        });
    }).catch(function(err){
        console.log(err.stack);
        console.log('Err during initing db', err.stack);
    });
};
