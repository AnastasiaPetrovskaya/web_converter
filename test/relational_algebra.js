"use strict";
var RelationalAlgebraQuery = require('../lib/RelationalAlgebraQuery.js');

var assert = require('assert');
/*describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
*/

describe('Algebra', function() {
    describe('proection transformation', function() {
        it('test1', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "X[X.Nгр = Y.Nгр]Y[X.Nгр, X.Фио, Y.Спец]"
            });

            query.proection_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "X[X.Nгр = Y.Nгр]Y");
                    assert.equal(res, "X.Nгр, X.Фио, Y.Спец");
                    done();
                }).catch(function(err) {
                    done(err);
                    //console.log('err', err);
                });
        });

        it('test2', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "X[X.Nгр = Y.Nгр]Y"
            });

            query.proection_transformation()
            .then(function(res) {
                //console.log("res", res);
                //console.log('query', query);

                assert.equal(query.query_body, "X[X.Nгр = Y.Nгр]Y");
                assert.equal(res, "");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                    done(err);
                });
        });

        it('test3', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "((Z[Z.Nз, Z.Nгр])[X.Nгр = Z.Nгр])X[X.Nгр = Y.Nгр]Y"
            });

            query.proection_transformation()
            .then(function(res) {
                //console.log("res", res);
                //console.log('query', query);

                assert.equal(query.query_body, "((Z)[X.Nгр = Z.Nгр])X[X.Nгр = Y.Nгр]Y");
                assert.equal(res, "");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });
    });


    describe('multiplication transformation', function() {
        it('test1', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "((X*Y)*Z)"
            });

            query.multiplication_transformation()
            .then(function(res) {
                //console.log('query', query);
                assert.equal(query.query_body, "(X*Y*Z)");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });

        it('test2', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "(X*(Y*Z))"
            });

            query.multiplication_transformation()
            .then(function(res) {
                //console.log('query', query);
                assert.equal(query.query_body, "(X*Y*Z)");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });

        it('test3', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "((X*T)*(Y*Z))"
            });

            query.multiplication_transformation()
            .then(function(res) {
                //console.log('query', query);
                assert.equal(query.query_body, "(X*T*Y*Z)");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });

        it('test4', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "((X*T)*((Y*Z)*S))"
            });

            query.multiplication_transformation()
            .then(function(res) {
                //console.log('query', query);
                assert.equal(query.query_body, "(X*T*Y*Z*S)");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });

        it('test4', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "(X*T)"
            });

            query.multiplication_transformation()
            .then(function(res) {
                //console.log('query', query);
                assert.equal(query.query_body, "(X*T)");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });

        it('test5', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "(Z*(X[X.Nгр='224']))"
            });

            query.multiplication_transformation()
            .then(function(res) {
                //console.log('query', query);
                assert.equal(query.query_body, "((Z*X)[X.Nгр='224'])");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });

        it('test6', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "((Z*Y)*(X[X.Nгр='224']))"
            });

            query.multiplication_transformation()
            .then(function(res) {
                //console.log('query', query);
                assert.equal(query.query_body, "((Z*Y*X)[X.Nгр='224'])");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });

        it('test7, no convertation', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "(((Z*Y)[Y.Nгр='224'])*X)"
            });

            query.multiplication_transformation()
            .then(function(res) {
                //console.log('query', query);
                assert.equal(query.query_body, "((Z*Y*X)[Y.Nгр='224'])");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });

        it('test8', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "((X[X.Nгр='224'])*(Y*Z))"
            });

            query.multiplication_transformation()
            .then(function(res) {
                //console.log('query', query);
                assert.equal(query.query_body, "((X*Y*Z)[X.Nгр='224'])");
                done();
            }).catch(function(err) {
                //console.log('err', err);
                done(err);
            });
        });

        it('test9', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: '((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)'
                    });

                query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, '((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)');
                        done();
                        }).catch(function(err) {
                            //console.log('err', err);
                            done(err);
                        });
                    });
                });


        describe('concatenate selections', function(done) {
            it('test1', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z))"
                });

                query.concatenate_selection()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((X[X.Возр>18])*(Y[(Y.Boзр<20)AND(Y.Nз=Z.Nз)]Z))");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test2', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)"
                });

                query.concatenate_selection()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "(Y[(Y.Boзр<20)AND(Y.Nз=Z.Nз)]Z)");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test3', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "(((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z))[Z.Спец='Прикладнаяматематика'])"
                });

                query.concatenate_selection()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "(((X[X.Возр>18])*(Y[(Y.Boзр<20)AND(Y.Nз=Z.Nз)]Z))[Z.Спец='Прикладнаяматематика'])");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test4', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "(((Y[X.Nгр=Y.Nгр]X)[Y.Boзр<20])[Y.Nз=Z.Nз]Z)"
                });

                query.concatenate_selection()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((Y[X.Nгр=Y.Nгр]X)[(Y.Boзр<20)AND(Y.Nз=Z.Nз)]Z)");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });
        });


        describe('delete double brackets', function() {
            it('test1', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "((((Y*X))*(Z))[(X.Nгр=Y.Nгр)AND((Y.Boзр<20)AND(Y.Nз=Z.Nз))])"
                });

                query.delete_double_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "(((Y*X)*(Z))[(X.Nгр=Y.Nгр)AND((Y.Boзр<20)AND(Y.Nз=Z.Nз))])");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test2, no convertation', function() {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)"
                });

                query.delete_double_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)");
                }).catch(function(err) {
                    //console.log('err', err);
                });
            });

            it('test3', function() {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "(((X*((Y[Y.Boзр<20]))))[Z.Спец='Прикладная математика'])"
                });

                query.delete_double_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((X*(Y[Y.Boзр<20]))[Z.Спец='Прикладная математика'])");
                }).catch(function(err) {
                    //console.log('err', err);
                });
            });

            it('test4', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "((((Y[X.Nгр=Y.Nгр]X))))"
                });

                query.delete_double_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "(Y[X.Nгр=Y.Nгр]X)");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test5', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "((((Y[Y.Спец='Прикладнаяматематика']))))"
                });

                query.delete_double_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "(Y[Y.Спец='Прикладнаяматематика'])");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });
        });


        describe('delete extra brackets', function() {
            it('test1', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "((((Y*X))*(Z))[(X.Nгр=Y.Nгр)AND((Y.Boзр<20)AND(Y.Nз=Z.Nз))])"
                });

                query.delete_extra_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((((Y*X))*Z)[X.Nгр=Y.NгрANDY.Boзр<20ANDY.Nз=Z.Nз])");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test2', function() {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: '((X*Y*Z)[((X.Возр>18)AND(Y.Boзр<20ANDY.Nз=Z.Nз))AND(Z.Спец="Прикладнаяматематика")])'
                });

                query.delete_extra_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, '((X*Y*Z)[(X.Возр>18ANDY.Boзр<20ANDY.Nз=Z.Nз)ANDZ.Спец="Прикладнаяматематика"])');
                }).catch(function(err) {
                    //console.log('err', err);
                });
            });

            it('test3', function() {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: '(Y[X.Nгр=Y.Nгр]X)'
                });

                query.delete_extra_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, '(Y[X.Nгр=Y.Nгр]X)');
                }).catch(function(err) {
                    //console.log('err', err);
                });
            });

            it('test4', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "[(X.Возр>20ORX.Возр<23)ORX.Nгр=Y.Nгр]"
                });

                query.delete_extra_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "[X.Возр>20ORX.Возр<23ORX.Nгр=Y.Nгр]");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test5', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: "[X.Возр>20OR(X.Возр<23ORX.Nгр=Y.Nгр)]"
                });

                query.delete_extra_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "[X.Возр>20ORX.Возр<23ORX.Nгр=Y.Nгр]");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test6', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: '[(X.Возр>20ANDX.Возр<23)ANDX.Nгр=Y.Nгр]'
                });

                query.delete_extra_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, '[X.Возр>20ANDX.Возр<23ANDX.Nгр=Y.Nгр]');
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test7', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: '(X.Nгр="5"AND((X.Спец="04"ORX.Спец="05")ANDX.ГодВыпуска="2016")AND(X.Возр>23ANDX.Возр<25))'
                });

                query.delete_extra_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, '(X.Nгр="5"AND(X.Спец="04"ORX.Спец="05")ANDX.ГодВыпуска="2016"ANDX.Возр>23ANDX.Возр<25)');
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
            });

            it('test8', function(done) {
                var query = new RelationalAlgebraQuery({
                    title: "test",
                    alias: "",
                    target_list: "",
                    query_body: '(X.Nгр="5"AND(((X.Спец="04"AND(X.ГодВыпуска="2015"OR(X.ГодВыпуска="2013"ORX.ГодВыпуска="2011")))OR(X.Спец="05"AND(X.ГодВыпуска="2014"ANDX.ФИО="Петров")))ORX.ГодВыпуска="2016")AND(X.Возр>23ANDX.Возр<25))'

                });

            query.delete_extra_brackets()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, '(X.Nгр="5"AND((X.Спец="04"AND(X.ГодВыпуска="2015"ORX.ГодВыпуска="2013"ORX.ГодВыпуска="2011"))OR(X.Спец="05"ANDX.ГодВыпуска="2014"ANDX.ФИО="Петров")ORX.ГодВыпуска="2016")ANDX.Возр>23ANDX.Возр<25)');
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });
    });


    describe('connection transformation', function(done) {
        it('test1', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z))"
            });

            query.connection_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((X*Y*Z)[X.Возр>18ANDY.Boзр<20ANDY.Nз=Z.Nз])");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });

        it('test2', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)"
            });

            query.connection_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((Y*Z)[Y.Boзр<20ANDY.Nз=Z.Nз])");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });

        it('test3', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: '(((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z))[Z.Спец="Прикладнаяматематика"])'
            });

            query.connection_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, '((X*Y*Z)[X.Возр>18ANDY.Boзр<20ANDY.Nз=Z.NзANDZ.Спец="Прикладнаяматематика"])');
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });

        it('test4', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "(((Y[X.Nгр=Y.Nгр]X)[Y.Boзр<20])[Y.Nз=Z.Nз]Z)"
            });

            query.connection_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((Y*X*Z)[X.Nгр=Y.NгрANDY.Boзр<20ANDY.Nз=Z.Nз])");
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });
    });


    describe('get where elements', function(done) {
        it('test1', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: '(X[X.Nгр="5"AND(X.Спец="04"ORX.Спец="05")ANDX.ГодВыпуска="2016"ANDX.Возр>23ANDX.Возр<25])'
            });
            var selection = 'X.Nгр="5"AND(X.Спец="04"ORX.Спец="05")ANDX.ГодВыпуска="2016"ANDX.Возр>23ANDX.Возр<25';

            query.get_where_elements(selection)
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.where_elements.length, 5);
                    assert.notEqual(query.where_elements.indexOf('(X.Спец="04"ORX.Спец="05")'), -1);
                    assert.notEqual(query.where_elements.indexOf('X.ГодВыпуска="2016"'), -1);
                    assert.notEqual(query.where_elements.indexOf('X.Возр<25'), -1);
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });

        it('test2', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: '(X[X.Nгр="5"AND(((X.Спец="04"AND(X.ГодВыпуска="2015"OR(X.ГодВыпуска="2013"ORX.ГодВыпуска="2011")))OR(X.Спец="05"AND(X.ГодВыпуска="2014"ANDX.ФИО="Петров")))ORX.ГодВыпуска="2016")AND(X.Возр>23ANDX.Возр<25)])'
            });
            var selection = 'X.Nгр="5"AND((X.Спец="04"AND(X.ГодВыпуска="2015"ORX.ГодВыпуска="2013"ORX.ГодВыпуска="2011"))OR(X.Спец="05"ANDX.ГодВыпуска="2014"ANDX.ФИО="Петров")ORX.ГодВыпуска="2016")ANDX.Возр>23ANDX.Возр<25';

            query.get_where_elements(selection)
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.where_elements.length, 4);
                    assert.notEqual(query.where_elements.indexOf('((X.Спец="04"AND(X.ГодВыпуска="2015"ORX.ГодВыпуска="2013"ORX.ГодВыпуска="2011"))OR(X.Спец="05"ANDX.ГодВыпуска="2014"ANDX.ФИО="Петров")ORX.ГодВыпуска="2016")'), -1);
                    assert.notEqual(query.where_elements.indexOf('X.Возр<25'), -1);
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });

        it('test3', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: '((Y*Z)[Y.Boзр<20ANDY.Nз=Z.Nз])'
            });
            var selection = 'Y.Boзр<20ANDY.Nз=Z.Nз';

            query.get_where_elements(selection)
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.where_elements.length, 2);
                    assert.notEqual(query.where_elements.indexOf('Y.Boзр<20'), -1);
                    assert.notEqual(query.where_elements.indexOf('Y.Nз=Z.Nз'), -1);
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });

        it('test4', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: '((Y*Z)[X.Возр>20ORX.Возр<23ORX.Nгр=Y.Nгр])'
            });
            var selection = 'X.Возр>20ORX.Возр<23ORX.Nгр=Y.Nгр';

            query.get_where_elements(selection)
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.where_elements.length, 1);
                    assert.notEqual(query.where_elements.indexOf('X.Возр>20ORX.Возр<23ORX.Nгр=Y.Nгр'), -1);
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });

        it('test5', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: '(Y*Z)'
            });
            var selection = '';

            query.get_where_elements(selection)
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.where_elements.length, 0);
                    done();
                }).catch(function(err) {
                    //console.log('err', err);
                    done(err);
                });
        });

    });

});
