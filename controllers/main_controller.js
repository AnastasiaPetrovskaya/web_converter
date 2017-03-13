var User = app.User,
    Token = app.Token,
    Role = app.Role;


var get = {
    '/': function(req, res, next) {
        console.log('here');
        res.render('main/index', { current_page: 'main' });
    },

    '/login': function(req, res, next) {
        res.render('login');
    },

    '/logout': function(req, res, next) {
        req.session.destroy();
        res.clearCookie('session');
        res.redirect('/login');
    },
};


var post = {
    '/login': function(req, res, next) {
        var username = req.body.username,
            password = req.body.password,
            ctx = {};


        app.User.findOne({
            where: {login: username},
            include: [app.Role]
        }).then(function(user) {
            if (!user) {
                throw {message: 'AuthError', desc: 'InvalidLogin'};
            } else {
                ctx.user = user.dataValues;
                ctx.role = user.dataValues.role;

                return user.validate_password(password);
            }
        }).then(function(valid) {
            if (!valid) {
                throw {message: 'AuthError', desc: 'InvalidPassword'};
            } else {
                var token = app.Token.build({
                    role_id: ctx.user.role_id,
                    user_id: ctx.user.id
                });

                token.create_token();
                return token.save();
            }
        }).then(function(token) {
            req.session.token = token.token;
            res.success({});
        }).catch(function(err) {
            //req.flash('error', err);
            console.log('err', err);
            req.flash('error', "Неверный логин или пароль");
            res.error('AuthError');
        });

    },
};

module.exports = {
    resource: '',
    methods: {
        get: get,
        post: post
    }
};
