"use strict";
var RelationalAlgebraQuery = require('../lib/RelationalAlgebraQuery.js');

var assert = require('assert');

describe('Algebra Answers from students', function() {

    describe('answers2019', function() {

        it('test1', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Кинотеатры AS X, Фильмы AS Y,  ФильмыАктер AS Z,  Актер AS U, ФильмыКинотеатры AS W",
                target_list: "Y.Название, X.НазвКинотеатра",
                query_body: '((' +
                    '(' +
                        '(Z[Z.ИдАктера = U.ИдАктера AND Z.Имя = "Скарлетт Йоханссон"]U)' +
                        '[Z.ИдФильма = Y.ИдФильма]Y' +
                     ')' +
                     '[Y.ИдФильма = W.ИдФильма]W)[W.ИдКинотеатра = X.ИдКинотеатра]X)'
            });

            query.convert()
                .then(function(res) {

                    assert.equal(query.query_body, '((Z*U*Y*W*X)[Z.ИдАктера=U.ИдАктераANDZ.Имя="Скарлеттsecret235Йоханссон"ANDZ.ИдФильма=Y.ИдФильмаANDY.ИдФильма=W.ИдФильмаANDW.ИдКинотеатра=X.ИдКинотеатра])');
                    done();
                }).catch(function(err) {
                    done(err);
                });
        });

        it('test2', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "ФильмыВинДизель AS X, ФильмыДжейсонСтейтем AS Y",
                target_list: "Y.Название, Y.Режиссер, Y.Год",
                query_body: '(X[X.ИдФильма=Y.ИдФильма)Y)'
            });

            query.convert()
                .then(function(res) {

                    done({"message":"Expected error"});

                }).catch(function(err) {

                    assert.equal(err.message, "После эквивалентных преобразований запрос не соответсвует необходимому шаблону");
                    done();
                });
        });

        it('test3', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Кинотеатры AS Z, ФильмыКинотеатры AS X, ФильмыКинотеатры AS Y, ФильмыКинотеатры AS U",
                target_list: "Z.*",
                query_body: '((Z[X.ИдКинотеатра = Z.ИдКинотеатра]X) EXCEPT ((((Z[X.ИдКинотеатра = Z.ИдКинотеатра]X)[ X.ИдКинотеатра = Y.ИдКинотеатра AND X.ИдФильма<>Y.ИдФильма]Y)[  Y.ИдКинотеатра = U.ИдКинотеатра AND Y.ИдФильма<>U.ИдФильма AND X.ИдФильма<>U.ИдФильма]U))?'
            });

            query.convert()
                .then(function(res) {

                    done({"message":"Expected error"});
                }).catch(function(err) {

                    assert.equal(err.message, "Запрос c операцией вычитания не соответствует необходимому шаблону");
                    done();
                });
        });

        it('test4 long query, fix bug in mult multiplication_transformation', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Кинотеатры AS Z, ФильмыКинотеатры AS X, ФильмыКинотеатры AS Y, ФильмыКинотеатры AS U",
                target_list: "Z.*",
                query_body: '(((((Y*Z*A))*B)[Y.ИдКинотеатра=Z.ИдКинотеатраANDY.ИдФильма<>Z.ИдФильмаANDY.ИдКинотеатра=A.ИдКинотеатраANDY.ИдФильма<>A.ИдФильмаANDZ.ИдФильма<>A.ИдФильмаANDY.ИдКинотеатра=B.ИдКинотеатраANDY.ИдФильма<>B.ИдФильмаANDA.ИдФильма<>B.ИдФильмаANDZ.ИдФильма<>B.ИдФильма])[B.ИдКинотеатра=X.ИдКинотеатра]X)'
            });

            query.convert()
                .then(function(res) {

                    assert.equal(query.query_body, "((Y*Z*A*B*X)[Y.ИдКинотеатра=Z.ИдКинотеатраANDY.ИдФильма<>Z.ИдФильмаANDY.ИдКинотеатра=A.ИдКинотеатраANDY.ИдФильма<>A.ИдФильмаANDZ.ИдФильма<>A.ИдФильмаANDY.ИдКинотеатра=B.ИдКинотеатраANDY.ИдФильма<>B.ИдФильмаANDA.ИдФильма<>B.ИдФильмаANDZ.ИдФильма<>B.ИдФильмаANDB.ИдКинотеатра=X.ИдКинотеатра])");

                    done();
                }).catch(function(err) {
                    done(err);
                });
        });

    });





});
