"use strict";
var RelationalAlgebraQuery = require('../lib/RelationalAlgebraQuery.js');

var assert = require('assert');

describe('relational algebra except convert', function() {
    describe('except queries', function() {
        it('test1', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "ИгрокиКлубов AS X, ИгрокиКлубов AS Y, ИгрокиКлубов AS Z",
                target_list: "X.Клуб, X.Фио, X.ДатаРожд, X.Возраст",
                query_body: '((X[X.Клуб, X.Фио, X.ДатаРожд, X.Возраст])' +
                    'EXCEPT' +
                    '((Z[Z.Клуб = Y.Клуб AND Z.Игрок <> Y.Игрок AND Z.ДатаРожд < Y.ДатаРожд]Y)'+
                    '[Z.Клуб, Z.Фио, Z.ДатаРожд, Z.Возраст]))',
                description: 'Младшие футболисты в клубах Ответ (Клуб, Фио, ДатаРождения, Возраст)'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), ('SELECT DISTINCT  X.Клуб  ,  X.Фио  ,  X.ДатаРожд  ,  X.Возраст ' +
                            'FROM ИгрокиКлубов AS X ' +
                            'WHERE NOT EXISTS ' +
                            '( SELECT DISTINCT * ' +
                            'FROM ИгрокиКлубов AS Y, ИгрокиКлубов AS Z ' +
                            'WHERE Z.Клуб = Y.Клуб AND Z.Игрок  <>  Y.Игрок  AND  Z.ДатаРожд  <  Y.ДатаРожд  AND ' +
                            'X.Клуб  =  Z.Клуб  AND  X.Фио  =  Z.Фио  AND  X.ДатаРожд  =  Z.ДатаРожд  AND  X.Возраст  =  Z.Возраст );').replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test2', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                description: "Определить группы в которых учатся только девочки",
                alias: "Студенты AS X, Студенты AS Y",
                target_list: "X.Нз, X.Фио, X.Гр",
                query_body: '((X[X.Нз, X.Фио, X.Гр])EXCEPT((Y[Y.П = "М"])[Y.Нз, Y.Фио, Y.Гр]))'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), ('SELECT DISTINCT  X.Нз, X.Фио, X.Гр ' +
                            'FROM Студенты AS X ' +
                            'WHERE NOT EXISTS ' +
                            '( SELECT DISTINCT * ' +
                            'FROM Студенты AS Y ' +
                            "WHERE Y.П = 'М' AND X.Нз=Y.Нз AND X.Фио=Y.Фио AND X.Гр=Y.Гр );").replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test3', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                description: "Сформировать список курсов, которые читаются два или менее семестра.",
                alias: "ОтчетГруппы AS X,ОтчетГруппы AS Y,ОтчетГруппы AS Z, ОтчетГруппы AS U",
                target_list: "*",
                query_body: '((U[U.ИдК])' +
                    'EXCEPT(((X[X.ИдК=Y.ИдК AND X.Семестр<>Y.Семестр AND X.Гр=Y.Гр]Y)[X.ИдК=Z.ИдК AND Z.Семестр<>Y.Семестр AND X.Семестр<>Z.Семестр AND X.Гр=Y.Гр AND Z.Гр=Y.Гр]Z)[X.ИдК]))'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), ('SELECT DISTINCT * FROM ОтчетГруппы AS U ' +
                            'WHERE NOT EXISTS ( SELECT DISTINCT * ' +
                            'FROM ОтчетГруппы AS X, ОтчетГруппы AS Y, ОтчетГруппы AS Z WHERE ' +
                            'X.ИдК=Y.ИдК AND X.Семестр<>Y.Семестр AND X.Гр=Y.Гр AND X.ИдК=Z.ИдК AND ' +
                            'Z.Семестр<>Y.Семестр AND X.Семестр<>Z.Семестр AND X.Гр=Y.Гр AND Z.Гр=Y.Гр AND U.ИдК=X.ИдК);').replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });


        it('test4', function(done) {
           var query = new RelationalAlgebraQuery({
               title: "test",
               alias: "Группы AS X, Студенты AS Y",
               target_list: "X.Гр",
               query_body: "((X [X.Гр]) EXCEPT ((Y [Y.П = 'Ж'])[Y.Гр]))"
           });

           query.convert()
               .then(function(res) {

                   assert.equal(query.sql.replace(/\s/g,''), ('SELECT DISTINCT X.Гр ' +
                    'FROM Группы AS XWHERE NOT EXISTS ( SELECT DISTINCT * ' +
                    "FROM Студенты AS Y WHEREY.П='Ж'ANDX.Гр=Y.Гр);").replace(/\s/g,''));
                   done();
               }).catch(function(err) {
                   done(err);
               });
        });

        it('test5', function(done) {
           var query = new RelationalAlgebraQuery({
               title: "test",
               alias: "more_then_1 AS O, Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z",
               target_list: "X.НазвКинотеатра, Y.Название",
               query_body: "((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название]) EXCEPT (O[O.НазвКинотеатра, O.Название]))"
           });

           query.convert()
               .then(function(res) {

                   assert.equal(query.sql.replace(/\s/g,''),
                    ('SELECT DISTINCT X.НазвКинотеатра,Y.Название '  +
                        'FROM Фильмы AS Y, Кинотеатры AS X WHERE EXISTS ' +
                        '(SELECT * FROM ФильмыКинотеатры AS Z WHERE ' +
                        'X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма ' +
                        'AND NOT EXISTS ( SELECT DISTINCT * FROM more_then_1 AS O ' +
                        'WHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название=O.Название));').replace(/\s/g,''));
                   done();
               }).catch(function(err) {
                   done(err);
               });
        });

        it('test6 intersect', function(done) {
           var query = new RelationalAlgebraQuery({
               title: "test",
               alias: "Актер AS D, ФильмыАктер AS F, Актер AS U, ФильмыАктер AS R",
               target_list: "F.ИдФильма",
               query_body: "(((D[D.Имя='Вин Дизель' AND D.ИдАктера=F.ИдАктера]F)[F.ИдФильма]) INTERSECT ((U[U.Имя='Джейсон Стейтем' AND U.ИдАктера=R.ИдАктера]R)[R.ИдФильма]))"
           });

           query.convert()
               .then(function(res) {
                   console.log(query.sql);

                   assert.equal(query.sql.replace(/\s/g,''),
                    ('SELECT DISTINCT X.НазвКинотеатра,Y.Название '  +
                        'FROM Фильмы AS Y, Кинотеатры AS X WHERE EXISTS ' +
                        '(SELECT * FROM ФильмыКинотеатры AS Z WHERE ' +
                        'X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма ' +
                        'AND NOT EXISTS ( SELECT DISTINCT * FROM more_then_1 AS O ' +
                        'WHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название=O.Название));').replace(/\s/g,''));
                   done();
               }).catch(function(err) {
                   done(err);
               });
        });


        it('test7 fail', function(done) {
           var query = new RelationalAlgebraQuery({
               title: "test",
               alias: "ФильмыАктер AS Z, R1 AS R",
               target_list: "Z.ИдАктера",
               query_body: "(Z[Z.ИдФильма=R.ИдФильма]R)"
           });

           query.convert()
               .then(function(res) {
                   console.log(query.sql);

                   assert.equal(query.sql.replace(/\s/g,''),
                    ('SELECT DISTINCT X.НазвКинотеатра,Y.Название '  +
                        'FROM Фильмы AS Y, Кинотеатры AS X WHERE EXISTS ' +
                        '(SELECT * FROM ФильмыКинотеатры AS Z WHERE ' +
                        'X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма ' +
                        'AND NOT EXISTS ( SELECT DISTINCT * FROM more_then_1 AS O ' +
                        'WHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название=O.Название));').replace(/\s/g,''));
                   done();
               }).catch(function(err) {
                   done(err);
               });
        });

    });
});
