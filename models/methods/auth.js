var uuid = require('node-uuid');


module.exports = function (models) {
    var Token = models.Token,
        AuthToken = models.AuthToken,
        User = models.User,
        Role = models.Role,
        Partner = models.Partner,
        CashierSession = models.CashierSession;


    Token.find_token = function (token, remote_ip, callback) {
        var result = {};

        return sequelize.transaction(function (t) {
            return Token.findOne({
                where: {
                    token: token
                },
                include: [
                    {model: User, required: true, include: {model: Partner}},
                    {model: Role, required: true}
                ],
                transaction: t
            }).then(function (token) {
                if (token) {
                    if (!token.user.check_ip_access(remote_ip)) {
                        throw {message: 'InvalidIp'};   
                    }

                    token = token.dataValues;

                    result = token.user.dataValues;
                    result.permissions = token.role.dataValues.permissions;
                    result.token = token.token;
                    result.role = token.role.dataValues;
                    delete result.role.permissions;
                } else {
                    callback(null, null);
                    return;
                }
            }).then(function () {
                if (result.id) {
                    return CashierSession.findOne({
                        where: {
                            user_id: result.id,
                            partner_id: result.partner_id,
                            closed: null
                        },
                        transaction: t
                    });
                } else {
                    return;
                }
            }).then(function (cashier_session) {
                if (cashier_session)
                    result.cashier_session_id = cashier_session.dataValues.id;

                callback(null, result);
            }).catch(function (err) {
                callback(err, null);
            });
        });
    };


    Token.Instance.prototype.create_token = function () {
        this.token = uuid.v4().replace(/-/g, '');
    };


    AuthToken.Instance.prototype.prepare = function () {
        this.token = uuid.v4();
    };
};
