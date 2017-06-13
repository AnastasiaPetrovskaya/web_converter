var uuid = require('node-uuid'),
    bcrypt = require('bcrypt'),
    gen_pwd = require('password-generator');


module.exports = function (models) {
    var User = models.User;
    var Role = models.Role;

    User.make_student = function(data) {
        var ctx = {};

        //return sequelize.transaction(function(t) {

            return Role.findOne({
                    where: {role: 'student'},
                    //transaction: t
                }).then(function(role) {
		    if (!role) {
                        throw {message: 'Роль student не найдена в базе данных'};
                    }

                    data.user_data.role_id = role.id;
                    data.user_data.group_id = data.student_data.group_id;
                    ctx.user = User.build(data.user_data);
                    //ctx.user = ctx.user.dataValues;
                    //console.log('user', ctx.user);

                    return ctx.user.generate_salt()
                }).then(function() {
                    return ctx.user.hash_password();
                }).then(function() {
                    return ctx.user.save();
                }).then(function(user) {
                    //data.student_data.user_id = user.id;

                    //return app.Student.create(data.student_data);
                //}).then(function(student) {
                    console.log('student', user.dataValues);
                    //ctx.student = student.dataValues;
                    //ctx.user.student_id = ctx.student.id;
                    //return ctx.user.save();
                //}).then(function(user) {
                    //ctx.user = user.dataValues;

                    return ctx;
                }).catch(function(err) {
                    console.log('make db method err', err);
                    throw err;
                });
        //});
    }



    User.Instance.prototype.generate_salt = function (salt_rounds) {
        if (!salt_rounds)
            salt_rounds = 10;

        var self = this;

        return new Promise(function (resolve, reject) {
            bcrypt.genSalt(salt_rounds, function(_, salt) {
                self.salt = salt;
                resolve();
            });
        });
    },


    User.Instance.prototype.hash_password = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            bcrypt.hash(self.password, self.salt, function(_, hash) {
                self.password = hash;
                resolve();
            });
        });
    },


    User.Instance.prototype.validate_password = function (password) {
        var self = this;

        return new Promise (function (resolve, reject) {
            bcrypt.compare(password, self.password, function(_, res) {
                resolve(res);
            });
        });
    },


    User.Instance.prototype.generate_password = function (length) {
        if (!length)
            length = 10;

        this.password = gen_pwd(length, false);
    };

    User.Instance.prototype.check_ip_access = function (remote_ip) {
        if (this.ip_access_list && this.ip_access_list.filter(function (ip) { return ip.length > 0; }).length > 0) {
            return this.ip_access_list.some(function(ip) { return remote_ip == ip });
        } else {
            return true;
        }
    };
};
