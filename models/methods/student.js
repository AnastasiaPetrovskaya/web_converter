'use strict'

var uuid = require('node-uuid'),
    bcrypt = require('bcrypt'),
    gen_pwd = require('password-generator');


module.exports = function (models) {
    var User = models.User,
        Student = models.Student,
        Role = models.Role;

    Student.make = function(data) {
        var ctx = {};

        //return sequelize.transaction(function(t) {

            return Role.findOne({
                    where: {role: 'student'},
                    //transaction: t
                }).then(function(role) {

                    data.user_data.role_id = role.id;
                    ctx.user = User.build(data.user_data);
                    //ctx.user = ctx.user.dataValues;
                    //console.log('user', ctx.user);

                    return ctx.user.generate_salt()
                }).then(function() {
                    return ctx.user.hash_password();
                }).then(function() {
                    return ctx.user.save();
                }).then(function(user) {
                    data.student_data.user_id = user.id;

                    return app.Student.create(data.student_data);
                }).then(function(student) {
                    console.log('student', student.dataValues);
                    ctx.student = student.dataValues;
                    ctx.user.student_id = ctx.student.id;
                    return ctx.user.save();
                }).then(function(user) {
                    ctx.user = user.dataValues;

                    return ctx;
                }).catch(function(err) {
                    console.log('make db method err', err);
                    throw err;
                });
        //});
    }

};
