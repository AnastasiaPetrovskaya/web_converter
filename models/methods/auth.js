var uuid = require('node-uuid');


module.exports = function (models) {
    var Token = models.Token,
        User = models.User,
        Student = models.Student,
        Group = models.Group,
        Role = models.Role;


    Token.find_token = function (token, callback) {
        var result = {};
        //console.log("model token find_token", token);

        return sequelize.transaction(function (t) {
            return Token.findOne({
                where: {
                    token: token
                },
                include: [
                    {
                        model: User, 
                        required: true,
                        include: [{
                            model: Student,
                            include: [Group]
                        }]
                    },
                    {model: Role, required: true}
                ],
                transaction: t
            }).then(function (token) {
                //console.log(11, token);
                if (token) {
                   /* if (!token.user.check_ip_access(remote_ip)) {
                        throw {message: 'InvalidIp'};   
                    }*/

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
                //console.log(22);
                /*if (cashier_session)
                    result.cashier_session_id = cashier_session.dataValues.id;*/

                callback(null, result);
            }).catch(function (err) {
                //console.log(33);
                callback(err, null);
            });
        });
    };


    Token.Instance.prototype.create_token = function () {
        //this.token = uuid.v4().replace(/-/g, '');
        this.token = uuid.v4();
    };
};
