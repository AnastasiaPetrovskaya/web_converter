"use strict";
var RelationalAlgebraQuery = require('../lib/RelationalAlgebraQuery.js');
var AlgebraAnswer = require('../lib/RelationalAlgebraAnswer');

var assert = require('assert');

describe('AlgebraAnswer', function() {
    describe('full tests', function() {
        it('test1 fail todo', function(done) {
            var query = new RelationalAlgebraQuery({
                title: "test",
                alias: "",
                target_list: "",
                query_body: "X[X.Nгр = Y.Nгр]Y[X.Nгр, X.Фио, Y.Спец]"
            });

            var queries = [
                {
                    "title":"U",
                    "alias":"Актер AS X, ФильмыАктер AS Z ",
                    "target_list":"Z.ИдФильма",
                    "query_body":"(X[X.Имя=\"Юрий Яковлев\" AND X.ИдАктера = Z.ИдАктера]Z)",
                    "description":"",
                    "processed_query_body":"((X*Z)[X.Имя=\"Юрийsecret235Яковлев\"ANDX.ИдАктера=Z.ИдАктера])",
                    "sql":"SELECT DISTINCT Z.ИдФильма \nFROM  \nWHERE  EXISTS \n(SELECT * \nFROM Актер AS X \nWHERE X.Имя='Юрий Яковлев' AND X.ИдАктера=Z.ИдАктера);"
                }, {
                    "title":"K",
                    "alias":"U AS U , Фильмы AS W",
                    "target_list":"W.Название, W.ИдФильма",
                    "query_body":"(U[U.ИдФильма=W.ИдФильма]W)","description":"","processed_query_body":"((U*W)[U.ИдФильма=W.ИдФильма])","sql":"SELECT DISTINCT W.Название, W.ИдФильма \nFROM  Фильмы AS W \nWHERE  EXISTS \n(SELECT * \nFROM U AS U \nWHERE U.ИдФильма=W.ИдФильма);"},{"title":"P","alias":"K AS K, ФильмыКинотеатры AS R","target_list":"K.Название, R.ИдКинотеатра","query_body":"(K[K.ИдФильма=R.ИдФильма]R)","description":"","processed_query_body":"((K*R)[K.ИдФильма=R.ИдФильма])","sql":"SELECT DISTINCT K.Название, R.ИдКинотеатра \nFROM K AS K, ФильмыКинотеатры AS R \nWHERE K.ИдФильма=R.ИдФильма;"},{"title":"result","alias":"P AS P, Кинотеатры AS T","target_list":"P.Название, T.НазвКинотеатра","query_body":"(P[P.ИдКинотеатра=T.ИдКинотеатра]T)","description":"В каких кинотеатрах показывают фильмы с участием актера \"Юрий Яковлев\"?\nОтвет (Название(Фильма), НазвКинотеатра)","processed_query_body":"((P*T)[P.ИдКинотеатра=T.ИдКинотеатра])","sql":"SELECT DISTINCT P.Название, T.НазвКинотеатра \nFROM P AS P, Кинотеатры AS T \nWHERE P.ИдКинотеатра=T.ИдКинотеатра;"}]


            var query_answer = new AlgebraAnswer(queries);

            return query_answer.create_sql_script()
                .then(function(res) {
                    console.log("res", res);
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
