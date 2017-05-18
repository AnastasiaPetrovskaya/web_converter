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
    describe('convertion transformation', function() {
        it('test1', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "X[X.Nгр = Y.Nгр]Y[X.Nгр, X.Фио, Y.Спец]"
            });

            query.convertion_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "X[X.Nгр = Y.Nгр]Y");
                    assert.equal(res, "X.Nгр, X.Фио, Y.Спец");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test2', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "X[X.Nгр = Y.Nгр]Y"
            });

            query.convertion_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "X[X.Nгр = Y.Nгр]Y");
                    assert.equal(res, "*");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test3', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "((Z[Z.Nз, Z.Nгр])[X.Nгр = Z.Nгр])X[X.Nгр = Y.Nгр]Y"
            });

            query.convertion_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((Z)[X.Nгр = Z.Nгр])X[X.Nгр = Y.Nгр]Y");
                    assert.equal(res, "*");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });
    });



    describe('multiplication transformation', function() {
        it('test1', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "((X*Y)*Z)"
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, "(X*Y*Z)");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test2', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "(X*(Y*Z))"
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, "(X*Y*Z)");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test3', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "((X*T)*(Y*Z))"
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, "(X*T*Y*Z)");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test4', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "((X*T)*((Y*Z)*S))"
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, "(X*T*Y*Z*S)");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test4', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "(X*T)"
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, "(X*T)");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test5', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: '(Z*(X[X.Nгр="224"]))'
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, '((Z*X)[X.Nгр="224"])');
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test6', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: '((Z*Y)*(X[X.Nгр="224"]))'
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, '((Z*Y*X)[X.Nгр="224"])');
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test7, no convertation', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: '(((Z*Y)[Y.Nгр="224"])*X)'
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, '((Z*Y*X)[Y.Nгр="224"])');
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test8', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: '((X[X.Nгр="224"])*(Y*Z))'
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, '((X*Y*Z)[X.Nгр="224"])');
                }).catch(function(err) {
                    console.log('err', err);
                });
        });


        it('test9', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: '((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)'
            });

            query.multiplication_transformation()
                .then(function(res) {
                    //console.log('query', query);
                    assert.equal(query.query_body, '((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)');
                }).catch(function(err) {
                    console.log('err', err);
                });
        });
    });


    describe('concatenate selections', function() {
        it('test1', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z))"
            });

            query.concatenate_selection()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((X[X.Возр>18])*(Y[(Y.Boзр<20)AND(Y.Nз=Z.Nз)]Z))");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test2', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)"
            });

            query.concatenate_selection()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "(Y[(Y.Boзр<20)AND(Y.Nз=Z.Nз)]Z)");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test3', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: '(((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z))[Z.Спец="Прикладнаяматематика"])'
            });

            query.concatenate_selection()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, '(((X[X.Возр>18])*(Y[(Y.Boзр<20)AND(Y.Nз=Z.Nз)]Z))[Z.Спец="Прикладнаяматематика"])');
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test4', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "(((Y[X.Nгр=Y.Nгр]X)[Y.Boзр<20])[Y.Nз=Z.Nз]Z)"
            });

            query.concatenate_selection()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((Y[X.Nгр=Y.Nгр]X)[(Y.Boзр<20)AND(Y.Nз=Z.Nз)]Z)");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });
    });


    describe('connection transformation', function() {
        it('test1', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z))"
            });

            query.connection_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((X*Y*Z)[(X.Возр>18)AND((Y.Boзр<20)AND(Y.Nз=Z.Nз))])");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test2', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z)"
            });

            query.connection_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((Y*Z)[(Y.Boзр<20)AND(Y.Nз=Z.Nз)])");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test3', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: '(((X[X.Возр>18])*((Y[Y.Boзр<20])[Y.Nз=Z.Nз]Z))[Z.Спец="Прикладнаяматематика"])'
            });

            query.connection_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, '((X*Y*Z)[((X.Возр>18)AND((Y.Boзр<20)AND(Y.Nз=Z.Nз)))AND(Z.Спец="Прикладнаяматематика")])');
                }).catch(function(err) {
                    console.log('err', err);
                });
        });

        it('test4', function() {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                text: "(((Y[X.Nгр=Y.Nгр]X)[Y.Boзр<20])[Y.Nз=Z.Nз]Z)"
            });

            query.connection_transformation()
                .then(function(res) {
                    //console.log("res", res);
                    //console.log('query', query);

                    assert.equal(query.query_body, "((Y[X.Nгр=Y.Nгр]X)[(Y.Boзр<20)AND(Y.Nз=Z.Nз)]Z)");
                }).catch(function(err) {
                    console.log('err', err);
                });
        });
    });
});
