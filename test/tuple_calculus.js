"use strict";
var TupleCalculusQuery = require('../lib/TupleCalculusQuery.js');

var assert = require('assert');

describe("Tuple full convertion", function (){
    it('test1', function(done) {
        var query = new TupleCalculusQuery({
            title: "test",
            alias: "Кинотеатры AS A",
            target_list: "A.НазвКинотеатра",
            query_body: 'A.Метро="Университет"'
            });

        query.make_sql()
            .then(function(res) {
                //console.log("res", res);
                //console.log('query', query);

                assert.equal(query.sql.replace(/\s/g,''), "SELECT DISTINCT A.НазвКинотеатра FROM Кинотеатры AS A WHERE A.Метро='Университет';".replace(/\s/g,''));
                done();
            }).catch(function(err) {
                done(err);
                    //console.log('err', err);
            });
     });


    it('test2', function(done) {
        var query = new TupleCalculusQuery({
            title: "test",
            alias: "Кинотеатры AS A, ФильмыКинотеатры AS B",
            target_list: "A.НазвКинотеатра, B.*",
            query_body: 'A.Метро="Университет" AND A.ИдКинотеатра=B.ИдКинотеатра'
            });

        query.make_sql()
            .then(function(res) {
                //console.log("res", res);
                //console.log('query', query);

                assert.equal(query.sql.replace(/\s/g,''), "SELECT DISTINCT A.НазвКинотеатра, B.* FROM Кинотеатры AS A, ФильмыКинотеатры AS B WHERE A.Метро='Университет' AND A.ИдКинотеатра=B.ИдКинотеатра;".replace(/\s/g,''));
                done();
            }).catch(function(err) {
                done(err);
                    //console.log('err', err);
            });
     });




})