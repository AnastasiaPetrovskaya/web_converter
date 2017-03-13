var crypto = require('crypto');


var hmac_sha1 = function(key, text){
    return crypto.createHmac('sha1', key).update(text).digest('hex');
};


var get_required_params = function(req) {
    return {time: req.headers['req-time'], signature: req.headers['req-signature']};
};


var set_signature_error = function(req, res){
    log_http_error(req, 'InvalidSignature');
    res.error('InvalidSignature', 403);
};


/*
 *  Функция проверяет подпись запроса
 */
function check_req_sign(req, res, next) {
    if (req.no_auth) {
        next();
        return;
    }
    
    app.Token.findOne({
        where: {
            token: req.user.token
        },
        include: {model: app.Application, attributes: ['signature_key']},
        attributes: []
    }).then(function (obj) {
        var signature_key = obj.application.signature_key,
            params = get_required_params(req);
        if(!params.signature || !params.time || !signature_key){
            set_signature_error(req, res);
            return;
        }

        var time_delta = Math.round(new Date().getTime() / 1000) - parseInt(params.time, 10);
        /**
         * Если timestamp в запросе больше текущего или мешьше текущего на 120 сек,
         * запрос нужно отклонить.
         */
        if (time_delta < -10 || time_delta > 120) {
            set_signature_error(req, res);
            return;
        }
        
        var hmac_hash = sign_req(signature_key, req.user.token, req.path, req.method, params.time);
        if(hmac_hash !== params.signature){
            set_signature_error(req, res);
            return;
        } else {
            next();
        };
    }).catch(function (err) {
        log_error(err);
    });
};


/*
 * Функция подписывает запрос на основе данных запроса и текущего времени 
 */
function sign_req(key, token, path, method, time) {
    var text = (token + path + method + time).toLowerCase();
    return hmac_sha1(key, text);
}


module.exports = {
    sign_req: sign_req,
    check_req_sign: check_req_sign
}

