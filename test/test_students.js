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
                alias: "Кинотеатры AS K, Фильмы AS F, ФильмыКинотеатры AS X",
                target_list: "K.НазвКинотеатра, K.Метро, F.Название, X.ЦенаБилета",
                query_body: '((' +
                    '(K[K.Метро="Университет"])[K.ИдКинотеатра])' +
                        'INTERSECT' +
                    '(F[F.ИдКинотеатра])' +
                    ')'
            });

            query.convert()
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



    });





});
