var getMessage = function(msg) {
    switch (msg) {
        case 'InvalidIp':
            return 'Неверный IP';
        default:
            return 'Неверный логин или пароль';
    }
};

/*module.exports = function(options) {
    var config = options.config,
        apikey = config.apikey,
        secret = config.secret;
*/
var get = {
    '/login': function(req, res, next) {
        res.render('login');
    },

    '/recover': function(req, res, next) {
        req.flash('info', 'Для восстановления пароля обратитесь к администратору');
        res.redirect('/login');
    },

    '/logout': function(req, res, next) {
        req.session.destroy();
        res.clearCookie('session');
        res.redirect('/login');
    }
};

//var post = {
  //  '/login': [
      /*  app.req_limiter_handlers.auth_limit_handler.getMiddleware({
            key: function(req, res, next) {
                next(req.body.username + req.remote_ip);
            }
        }),
        function(req, res, next) {
            var headers = {'x-forwarded-for': req.remote_ip};
            AUTH_API.authorize({ apikey: apikey, secret: secret }, headers, function(response) {
                if (!response.success) {
                    req.flash('error', getMessage(response.error));
                    res.error('AuthError');
                } else {
                    AUTH_API.access({
                        login: req._params.username,
                        password: req._params.password,
                        app_token: response.token
                    }, headers, function(response) {
                        if (!response.success) {
                            req.flash('error', getMessage(response.error));
                            res.error('AuthError');
                        } else {
                            var user = response.user;
                            req.session.token = user.token;
                            res.success({});
                            /*
                            if (user.role_id === 3)
                                res.success({redirect_to: '/terminals'});
                            else
                                res.success({});
                            */
         /*               }
                    });
                }
            });
        }*/
    //]
//};

module.exports = {
    resource: '',
    methods: {
        get: get
        //post: post
    }
};
