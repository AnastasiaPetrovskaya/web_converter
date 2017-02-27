'use strict';

require('should');

var async = require('async');
var mongoose = require('mongoose');
var shortIdModule = require('shortid');

var ShortId = require('../index');

var Promise = require('bluebird');

mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;

var defaultSchema = new Schema({
    _id: ShortId,
    num: Number
});

var alphaSchema = new Schema({
    _id: {
        type: ShortId,
        len: 2,
        alphabet: 'abc',
        retries: 10
    },
    num: Number
});

var generatorSchema = new Schema({
    _id: {
        type: ShortId,
        generator: function(options, callback) {
            callback(null, ''+Date.now());
        }
    },
    num: Number
});

var shortIdModuleSchema = new Schema({
    _id: {
        type: ShortId,
        generator: function(options, callback) {
            callback(null, shortIdModule.generate());
        }
    },
    num: Number
});

var retryAlphabet = 'abcde';
var retrySchema = new Schema({
    _id: {
        type: ShortId,
        len: 1,
        alphabet: retryAlphabet,
        retries: 10
    },
    num: Number
});

var DefaultDoc = mongoose.model('defaultdoc', defaultSchema);
var AlphaDoc = mongoose.model('alphadoc', alphaSchema);
var GeneratorDoc = mongoose.model('generatordoc', generatorSchema);
var ShortIdModuleDoc = mongoose.model('shortidmoduledoc', shortIdModuleSchema);
var RetryDoc = mongoose.model('retrydoc', retrySchema);

describe('shortid', function() {

    this.timeout(10000);

    before(function(done) {

        async.each([DefaultDoc, AlphaDoc, GeneratorDoc, ShortIdModuleDoc], function(model, eachNext) {
            model.remove(eachNext);
        }, function(err) {
            done(err);
        });

    });

    describe('defaults', function () {
        it('should generate base 64 unique ids 7 characters long', function (done) {

            var idsToGenerate = 1000;
            var ids = {};
            var i = 0;

            async.whilst(function() {return i++ < idsToGenerate;}, function(whilstNext) {
                var doc = new DefaultDoc({num: i});
                doc.save(function(err, doc) {
                    if (!err) {
                        var currId = doc._id;
                        currId.length.should.equal(7);
                        currId.length.should.match(/^[\w\d\-]+$/);
                        ids[doc._id] = true;
                    }
                    whilstNext(err);
                });
            }, function(err) {
                Object.keys(ids).length.should.equal(idsToGenerate);
                done(err);
            });
        });
    });

    describe('custom length and alphabet', function () {
        it('should respect len and alphabet options', function (done) {

            var idsToGenerate = 20;
            var ids = {};
            var numDups = 0;
            var i = 0;

            async.whilst(function() {return i++ < idsToGenerate;}, function(whilstNext) {
                var doc = new AlphaDoc({num: i});
                doc.save(function(err, doc) {
                    if (!err) {
                        var currId = doc._id;
                        currId.length.should.equal(2);
                        currId.length.should.match(/^[abc]+$/);
                        ids[doc._id] = true;
                    } else if (err.code === 11000) {
                        numDups += 1;
                        err = null;
                    }
                    whilstNext(err);
                });
            }, function(err) {
                Object.keys(ids).length.should.equal(9);
                numDups.should.equal(11);
                done(err);
            });
        });
    });

    describe('custom generator', function () {

        it('should use simple custom generator', function (done) {

            var idsToGenerate = 20;
            var ids = {};
            var lastIdNum = 0;
            var i = 0;

            async.whilst(function() {return i++ < idsToGenerate;}, function(whilstNext) {
                var doc = new GeneratorDoc({num: i});
                doc.save(function(err, doc) {
                    if (!err) {
                        var currId = doc._id;
                        currId.length.should.match(/^\d+$/);
                        ids[doc._id] = true;
                        var currIdNum = parseInt(currId, 10);
                        currIdNum.should.be.greaterThan(lastIdNum);
                        lastIdNum = currIdNum;
                    }
                    whilstNext(err);
                });
            }, function(err) {
                Object.keys(ids).length.should.equal(idsToGenerate);
                if (err) {
                    console.error("ERROR", err);
                }
                done(err);
            });
        });

        it('should work shortid npm module', function (done) {

            var idsToGenerate = 1000;
            var ids = {};
            var i = 0;

            async.whilst(function() {return i++ < idsToGenerate;}, function(whilstNext) {
                var doc = new ShortIdModuleDoc({num: i});
                doc.save(function(err, doc) {
                    if (!err) {
                        var currId = doc._id;
                        currId.length.should.be.lessThan(15);
                        currId.length.should.match(/^[\w\d\-]+$/);
                        ids[doc._id] = true;
                    }
                    whilstNext(err);
                });
            }, function(err) {
                Object.keys(ids).length.should.equal(idsToGenerate);
                done(err);
            });
        });
    });

    describe('retry tests', function () {

        it('should try 20 times, but only succeed 5 times', function (done) {

            var idsToGenerate = 20;
            var expectedToPass = retryAlphabet.length;
            var ids = {};
            var i = 0;

            async.whilst(function () {
                return i++ < idsToGenerate;
            }, function (whilstNext) {
                var doc = new RetryDoc({num: i});
                doc.save(function (err, doc) {
                    if (!err) {
                        var currId = doc._id;
                        currId.length.should.be.equal(1);
                        ids[doc._id] = true;
                    }
                    else {
                        // duplicate key errors are expected
                        if (err.code == 11000) {
                            err = null;
                        }
                    }

                    whilstNext(err);
                });
            }, function (err) {
                Object.keys(ids).length.should.equal(expectedToPass);
                RetryDoc.remove(function () {
                    done(err);
                });
            });
        });

        it('should try 20 times, but only succeed 5 times with promises', function (done) {

            var idsToGenerate = 20;
            var expectedToPass = retryAlphabet.length;
            var ids = {};
            var promises = [];

            for (var i = 0; i < idsToGenerate; i++) {
                var p=RetryDoc.create({num: i}).then(
                    function(doc) {
                        var currId = doc._id;
                        currId.length.should.be.equal(1);
                        ids[doc._id] = true;
                        return doc;
                    },
                    function(err) {
                        if (err.code===11000) {
                            return {code: err.code};
                        }
                        return err;
                    }
                );
                promises.push(p);
            }

            Promise.all(promises)
                .then(function () {
                    Object.keys(ids).length.should.equal(expectedToPass);
                    RetryDoc.remove(function () {
                        done();
                    });
                })
        });

    });


});
