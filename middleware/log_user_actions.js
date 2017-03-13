/**
 * Middleware для логирования действий пользователей node-api
 */


module.exports = function () {
    return function (req, res, next) {
        if (!req.user || !global.app || !global.app.UserLog) {
            next();
        } else {
            app.UserLog.create({
                path: req.path,
                method: req.method,
                query: req.query,
                body: req.body,
                user_id: req.user.id
            })
            .then(function () {
                next();
            })
            .catch(function (err) {
                log_http_error(req, err.stack);
                res.error('ServerError');
            })
        }
    };
}
