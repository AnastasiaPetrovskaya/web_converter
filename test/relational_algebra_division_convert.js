"use strict";
var RelationalAlgebraQuery = require('../lib/RelationalAlgebraQuery.js');

var assert = require('assert');

describe('Algebra division convert', function() {
    describe('division queries', function() {
        it('test1', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Кинотеатры AS X, КиноСеансФильм AS Y, Фильмы AS Z, Фильмы AS M",
                target_list: "X.НазвКинотеатра",
                query_body: '(((X[X.ИдКинотеатра=Y.ИдКинотеатра]Y)[Y.ИдФильма=Z.ИдФильма]Z)[Z.Название:M.Название](M[M.Название="Люси"ORM.Название="Форсаж 1"]))'
            });

            query.convert()
                .then(function(res) {

                    assert.equal(query.sql.replace(/\s/g,''), ("SELECT DISTINCT X.НазвКинотеатра " +
                        "FROM Кинотеатры AS X, КиноСеансФильм AS Y, Фильмы AS Z " +
                        "WHERE X.ИдКинотеатра=Y.ИдКинотеатра AND Y.ИдФильма=Z.ИдФильма AND NOT EXISTS " +
                        "(SELECT DISTINCT * " +
                        "FROM Фильмы AS M " +
                        "WHERE (M.Название='Люси' OR M.Название='Форсаж 1') AND NOT EXISTS " +
                        "(SELECT DISTINCT * " +
                        "FROM Кинотеатры AS X1, КиноСеансФильм AS Y1, Фильмы AS Z1 " +
                        "WHERE X1.ИдКинотеатра=Y1.ИдКинотеатра AND Y1.ИдФильма=Z1.ИдФильма AND X.НазвКинотеатра = X1.НазвКинотеатра AND " +
                        "Z1.Название = M.Название));").replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test2', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Кинотеатры AS X, ФильмыКинотеатры AS Y, Фильмы AS Z",
                target_list: "X.НазвКинотеатра, X.Метро",
                query_body: '(' +
                    '((X[X.ИдКинотеатра=Y.ИдКинотеатра]Y))' +
                    '[Y.ИдФильма:Z.ИдФильма]' +
                    '(Z)' +
                    ')'
            });

            query.convert()
                .then(function(res) {
                    assert.equal(query.sql.replace(/\s/g,''), ("SELECT DISTINCT X.НазвКинотеатра, X.Метро" +
                        'FROM Кинотеатры AS X,ФильмыКинотеатры AS Y' +
                        'WHERE X.ИдКинотеатра=Y.ИдКинотеатра AND NOT EXISTS ' +
                            '(SELECT DISTINCT *' +
                            'FROM Фильмы AS Z' +
                            'WHERE NOT EXISTS' +
                                '(SELECT DISTINCT *' +
                                'FROM Кинотеатры AS X1,ФильмыКинотеатры AS Y1' +
                                'WHERE X1.ИдКинотеатра=Y1.ИдКинотеатра AND ' +
                                'X.НазвКинотеатра=X1.НазвКинотеатра AND X.Метро=X1.Метро' +
                                'AND Y1.ИдФильма=Z.ИдФильма));').replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });



    });
});
