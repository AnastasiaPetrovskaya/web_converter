/**
 * Middleware для проверки аутентификации пользователя
 */


module.exports = function(options) {

    /* Редирект, если пользователь не аутентифицирован */
    function redirect(req, res, next) {
        var path = options.redirect;
        //console.log("rediresct", req.route.path !== path,  req.route.path, path);
        if(options.redirect && req.route.path !== path){
            res.redirect(path);
        } else {
            if (req.route.path === path) {
                //console.log("no redirect");
                next();
            } else {
                res.error('AccessDenied');
            }
        }
    }

    function cache(session, user) {
        if (options.cache && session) {
            session['user'] = user;
        }
    }

    function reset_session(req) {
        if (req.session) {
            console.log('reset!!!!!!!!!')
            req.session.reset();
        }
    }

    return function (req, res, next) {
        if (req.no_auth) {
            next();
            return;
        }

        var token = null;

        if (req.headers['x-auth-token']) {
            console.log('t1');
            token = req.headers['x-auth-token'];
        } else if (req.session && req.session.token) {
            console.log('t2', req.session);
            token = req.session.token;
        } else if (req.query.token) {
            console.log('t3');
            token = req.query.token;
            delete req.query.token;
        } else if (req.body.token) {
            console.log('t4');
            token = req.body.token;
            delete req.body.token;
        };

        if(token) {
            var user = null;

            /* Ищем пользователя по токену
             */

            console.log("here 0 token", token);
            app.Token.find_token(token, function(err, data) {
                console.log("here 1", err, data);

                if (err) {
                    console.log("here 2", err);
                    reset_session(req);
                    redirect(req, res, next);
                } else if (!data || data == {}) {
                    console.log("here 3");
                    reset_session(req);
                    redirect(req, res, next);
                } else {
                    console.log("find token user data in req", data);
                    req.user = data;
                    res.locals.profile = data;
                    next();
                }
            });
        } else {
            //log_http_error(req, 'RequestHasNoToken');
            redirect(req, res, next);
        }
    }
}
