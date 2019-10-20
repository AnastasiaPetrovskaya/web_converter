"use strict";
var RelationalAlgebraQuery = require('../lib/RelationalAlgebraQuery.js');

var assert = require('assert');

describe('Algebra full convertion', function() {
    describe('simlest queries', function() {
        it('test00', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X",
                target_list: "*",
                query_body: '(X)'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), 'SELECT DISTINCT * FROM СтудентAS X;'.replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test0', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X",
                target_list: "X.*",
                query_body: '(X)'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), 'SELECT DISTINCT X.* FROM СтудентAS X;'.replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test1', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X",
                target_list: "X.*",
                query_body: '(X[X.Nгр = "K5-224"])'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), "SELECT DISTINCT X.* FROM СтудентAS X WHERE X.Nгр = 'K5-224';".replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test2', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X",
                target_list: "X.Фио, X.Nз",
                query_body: '(X[X.Nгр = "K5-224"])'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), "SELECT DISTINCT X.Фио, X.Nз FROM СтудентAS X WHERE X.Nгр = 'K5-224';".replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test3', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X, Группа AS Y",
                target_list: "X.Фио, X.Nз",
                query_body: '(X[X.Nгр = "K5-224" AND X.Nгр = Y.Nгр]Y)'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), "SELECT DISTINCT X.Фио, X.Nз FROM СтудентAS X WHERE X.Nгр = 'K5-224' AND EXISTS (SELECT * FROM Группа AS Y WHERE X.Nгр = Y.Nгр);".replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test3_fail', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X, Группа AS Y",
                target_list: "X.Фио, X.Nз",
                query_body: 'X[X.Nгр = "K5-224" AND X.Nгр = Y.Nгр]Y'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), "SELECT DISTINCT X.Фио, X.Nз FROM СтудентAS X WHERE X.Nгр = 'K5-224' AND EXISTS (SELECT * FROM Группа AS Y WHERE X.Nгр = Y.Nгр);".replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test4', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студент AS X, Группа AS Y",
                target_list: "X.Фио, X.Nз",
                query_body: '(X[(Y.Спец="04" OR Y.Cпец="05") AND X.Nгр = Y.Nгр]Y)'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), "SELECT DISTINCT X.Фио, X.Nз FROM СтудентAS X WHERE EXISTS (SELECT * FROM Группа AS Y WHERE (Y.Спец='04' OR Y.Cпец='05') AND X.Nгр = Y.Nгр);".replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test5', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Студенты AS X, Успеваемость AS Y",
                target_list: "X.Нз, X.Фио, Y.ИдК",
                query_body: "((X [X.Гр = 'К05-224']) [X.Нз = Y.Нз] (Y [Y.Оцн = 'удовл']))"
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), "SELECT DISTINCT X.Нз, X.Фио, Y.ИдК FROM Студенты AS X, Успеваемость AS Y WHERE Y.Оцн = 'удовл' AND X.Гр = 'К05-224' AND  X.Нз = Y.Нз;".replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test6', function(done) {
            this.timeout(5000);
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Расписание_Среда_5сем AS X,Расписание_Среда_5сем AS Y,Расписание_Среда_5сем AS Z,Расписание_Среда_5сем AS W",
                target_list: "X.НомАуд, X.НомПары, X.Гр, X.ИдК, X.ВидЗан, X.ИдП",
                query_body: '(((X[X.НомПары <> Y.НомПары AND X.НомАуд=Y.НомАуд]Y)[X.НомАуд=Z.НомАуд AND X.НомПары<>Z.НомПары AND Y.НомПары<>Z.НомПары]Z)' +
                    '[X.НомАуд=W.НомАуд AND X.НомПары<>W.НомПары AND Y.НомПары<>W.НомПары AND Z.НомПары<>W.НомПары]W)'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), ('SELECT DISTINCT X.НомАуд, X.НомПары, X.Гр, X.ИдК, X.ВидЗан, X.ИдП FROM Расписание_Среда_5сем AS X WHERE EXISTS (' +
                            'SELECT * FROM Расписание_Среда_5сем AS Y,Расписание_Среда_5сем AS Z,Расписание_Среда_5сем AS W WHERE ' +
                            'X.НомПары<>Y.НомПары AND X.НомАуд=Y.НомАуд AND X.НомАуд=Z.НомАуд AND X.НомПары<>Z.НомПары AND ' +
                            'Y.НомПары<>Z.НомПары AND X.НомАуд=W.НомАуд AND X.НомПары<>W.НомПары AND Y.НомПары<>W.НомПары AND Z.НомПары<>W.НомПары);').replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test7', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Успеваемость AS A,ОтчетГруппы AS B",
                target_list: "A.Нз,A.ИдК,A.Семестр",
                query_body: '(A[A.Гр="К05-221" AND A.Оцн<>"неуд" AND B.ВидОтч="Экзамен" AND A.Гр=B.Гр AND A.ИдК=B.ИдК AND A.УчНед<B.УчНед AND A.ВидОтч="Экзамен"]B)'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), ('SELECT DISTINCT A.Нз, A.ИдК, A.Семестр FROM Успеваемость AS A ' +
                            "WHERE A.Гр='К05-221' AND A.Оцн<>'неуд' AND A.ВидОтч='Экзамен' AND EXISTS (" +
                            'SELECT * FROM ОтчетГруппы AS B WHERE ' +
                            "B.ВидОтч='Экзамен' AND A.Гр=B.Гр AND A.ИдК=B.ИдК AND A.УчНед<B.УчНед);").replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test8', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "Успеваемость AS A,ОтчетГруппы AS B",
                target_list: "A.Нз,A.ИдК,A.Семестр",
                query_body: '(A[A.Гр="К05-221" AND A.Оцн<>"неуд" AND B.ВидОтч="Экзамен" AND A.Гр=B.Гр AND A.ИдК=B.ИдК AND A.УчНед<B.УчНед AND A.ВидОтч="Экзамен"]B)'
            });

            query.convert()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.sql.replace(/\s/g,''), ('SELECT DISTINCT A.Нз, A.ИдК, A.Семестр FROM Успеваемость AS A ' +
                            "WHERE A.Гр='К05-221' AND A.Оцн<>'неуд' AND A.ВидОтч='Экзамен' AND EXISTS (" +
                            'SELECT * FROM ОтчетГруппы AS B WHERE ' +
                            "B.ВидОтч='Экзамен' AND A.Гр=B.Гр AND A.ИдК=B.ИдК AND A.УчНед<B.УчНед);").replace(/\s/g,''));
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });


        it('test9', function(done) {
           var query = new RelationalAlgebraQuery({
               title: "test",
               alias: "Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z",
               target_list: "X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета",
               query_body: "((X[X.Метро='Университет'])[X.ИдКинотеатра=Z.ИдКинотеатра]Z)[Z.ИдФильма=Y.ИдФильма]Y"
           });

           query.convert()
               .then(function(res) {
                   //console.log("res", res);
                   //console.log('query', query);

                   assert.equal(query.sql.replace(/\s/g,''), ('SELECT DISTINCT A.Нз, A.ИдК, A.Семестр FROM Успеваемость AS A ' +
                           "WHERE A.Гр='К05-221' AND A.Оцн<>'неуд' AND A.ВидОтч='Экзамен' AND EXISTS (" +
                           'SELECT * FROM ОтчетГруппы AS B WHERE ' +
                           "B.ВидОтч='Экзамен' AND A.Гр=B.Гр AND A.ИдК=B.ИдК AND A.УчНед<B.УчНед);").replace(/\s/g,''));
                   done();
               }).catch(function(err) {
                   //console.log('err', err);
                   done(err);
               });
        });




    });


});
