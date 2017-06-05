/**
 * Middleware для проверки прав на доступ к ресурсу.
 * В этом middleware идет только проверка на возможность доступа - можно/нельзя.
 */


/**
 * Возвращает одно из дефолтных действий в зависимости от http метода
 */
var getDefaultAction = function (method) {
    return {
        get: 'read',
        post: 'create',
        put: 'update',
        delete: 'delete'
    }[method];
};

function checkCheckUpdateParams(reqBody, permissions) {
    if (typeof permissions === 'boolean') {
        return permissions;
    }

    /**
     * Если permissions объект, в котором есть аттрибут except значит, пользователь может обновлять
     * все поля за исключением тех, которые указаны в expect. Поэтому проверим, если тело запроса
     * содержит хотябы одно поле из массива except в доступе нужно отказать.
     */
    if (permissions.hasOwnProperty('except')) {
        for (var key in reqBody) {
            if (reqBody.hasOwnProperty(key)) {
                if (permissions.except.indexOf(key) >= 0) {
                    return false;
                }
            }
        }
    return true;
    }

    /**
    * Если permissions объект, в котором есть аттрибут only значит, пользователь может обновлять
    * только поля, которые указаны в only. Поэтому проверим, если тело запроса
    * содержит хотябы одно поле не из массива only в доступе нужно отказать.
    */
    if (permissions.hasOwnProperty('only')) {
        for (var key in reqBody) {
            if (reqBody.hasOwnProperty(key)) {
                if (permissions.only.indexOf(key) < 0) {
                    return false;
                }
            }
        }
    return true;
    }
}


/**
 * Middleware для проверки прав
 */
module.exports = function (req, res, next) {
    var accessDenied = true,
        errMsg = 'AccessDenied';

    if (req.no_auth || !req.endpoint) {
        next();
        return;
    }

    var user = res.locals.profile;

    if (!user) {
        res.error('AccessDenied', 403);
        return;
    }

    if (!req.action) {
        req.action = getDefaultAction(req.method.toLowerCase());
    }

    //console.log('req.action', req.action);
    //console.log('req.endpoint', req.endpoint);
    //console.log('user.permissions', user.permissions);

    if (user.permissions[req.endpoint] && user.permissions[req.endpoint][req.action]) {
        accessDenied = false;
    };

    if (req.route.path === '/users/:id' && (user._id === req.params.id)) {
        accessDenied = false;
    };

    if (accessDenied) {
        var err = new Error('AccessDenied');
        err.status = 403;
        throw err;
        //res.error('AccessDenied', 403);
    } else {
        next();
    }
};
