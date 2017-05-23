"use strict";
var RelationalAlgebraQuery = require('../lib/RelationalAlgebraQuery.js');

var assert = require('assert');

describe('Algebra full convertion', function() {
    describe('union queries', function() {
        it('test1', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X, Студент AS Y",
                target_list: "X.*",
                text: '((X)UNION(Y))'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), '(SELECT DISTINCT * FROM СтудентAS X) UNION (SELECT DISTINCT * FROM СтудентAS Y);'.replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test2', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X, Студент AS Y",
                target_list: "X.*",
                text: '((X[X.Nгр="224"])UNION(Y[Y.Nгр="223"]))'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), ('(SELECT DISTINCT * FROM Студент AS X WHERE X.Nгр="224")' + 
                            ' UNION (SELECT DISTINCT * FROM СтудентAS Y WHERE Y.Nгр="223");').replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test3', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X, Студент AS Y, Успеваемость AS M, Успеваемость AS N",
                target_list: "",
                text: '(((X[X.Nгр="224"])[X.Nз=M.Np](M[M.ВидОтч="Экзамен"ANDM.Оцн = "неуд"]))UNION((Y[Y.Nгр="223"])[Y.Nз=N.Np](N[N.ВидОтч="Экзамен"ANDN.Оцн = "неуд"])))'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), ('(SELECT DISTINCT * FROM Студент AS X, Успеваемость AS M ' +
                                'WHERE M.ВидОтч="Экзамен" AND M.Оцн="неуд" AND X.Nгр="224" AND X.Nз=M.Np) UNION (' + 
                                'SELECT DISTINCT * FROM Студент AS Y, Успеваемость AS N' + 
                                'WHERE N.ВидОтч="Экзамен" AND N.Оцн="неуд" AND Y.Nгр="223" AND Y.Nз=N.Np);').replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test4', function(done) {
            var query = new RelationalAlgebraQuery({
                description: "Кто мог бы сыграть за ЦСКА Ответ (Игра, Клуб, Игрок)",
                title: "test",
                alias: "Календарь AS A, ИгрокиКлубов AS B, Календарь AS C, ИгрокиКлубов AS D, Календарь AS E, ИгрокиКлубов AS F",
                target_list: "*",
                text: '((((A[A.Хозяин="ЦСКА" AND A.Статус=1])[A.Хозяин=B.Клуб]B)' +
                    '[A.Игра, B.Клуб, B.Игрок])UNION' +
                    '(((C[C.Гость="ЦСКА" AND C.Статус=1])[C.Гость=D.Клуб]D)' +
                    '[C.Игра, D.Клуб, D.Игрок]))'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), ('( SELECT DISTINCT A.Игра  ,  B.Клуб  ,  B.Игрок ' +
                        'FROM Календарь AS A  ,  ИгрокиКлубов AS B ' +
                        'WHERE A.Хозяин  =  "ЦСКА"  AND  A.Статус  =  1  AND  A.Хозяин  =  B.Клуб ) UNION ' +
                        '( SELECT DISTINCT C.Игра  ,  D.Клуб  ,  D.Игрок ' +
                        'FROM Календарь AS C  ,  ИгрокиКлубов AS D ' +
                        'WHERE C.Гость  =  "ЦСКА"  AND  C.Статус  =  1  AND  C.Гость  =  D.Клуб );').replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });
    });
});
