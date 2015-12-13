/// <reference path='../../../typings/node/node.d.ts' />
/// <reference path='../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../typings/chai/chai.d.ts' />
/// <reference path='../../../typings/json-file/json-file.d.ts' />


import CHAI                     = require('chai')
const expect                    = CHAI.expect
import fs                       = require('fs')
import PATH                     = require('path')
import json_file                = require('json-file')



describe('json-file', function() {

    const VALID_JSON_FILENAME = 'test/data/test-w-Dates.json'
    const NONEXISTANT_JSON_FILENAME = 'test/data/test-doesnt-exist.json'
    const INVALID_JSON_FILENAME = 'test/data/test-invalid-content.json'


    describe('readJSONFile', function() {

        it('should read a JSON file', function(done) {
            var promise = json_file.readJSONFile(VALID_JSON_FILENAME)
            promise.then(
                (result) => {
                    expect(result.filename).to.eql(VALID_JSON_FILENAME)
                    expect(result.contents.obj.f.g).to.eql(13)
                    done()
                },
                (error) => {
                    done(error)
                }
            )
        })


        it('should report an error for a non-existant file', function(done) {
            var promise = json_file.readJSONFile(NONEXISTANT_JSON_FILENAME)
            promise.then(
                (result) => {
                    done(new Error('promise resolved'))
                },
                (error) => {
                    expect(error.message).to.equal("ENOENT: no such file or directory, open 'test/data/test-doesnt-exist.json'")
                    done()
                }
            )
        })


        it('should report an error for a file that contains invalid json', function(done) {
            var promise = json_file.readJSONFile(INVALID_JSON_FILENAME)
            promise.then(
                (result) => {
                    done(new Error('promise resolved'))
                },
                (error) => {
                    expect(error.message).to.equal("Unexpected token }")
                    done()
                }
            )
        })

    })


    describe('loadDatabaseFromJSONFile', function() {

        function convertJSONObjToTypedObj(obj) {
            obj.date = new Date(obj.date)
        }


        it('should convert fields from strings, by calling convertJSONObjToTypedObj', function(done) {
            var promise = json_file.loadDatabaseFromJSONFile(VALID_JSON_FILENAME, convertJSONObjToTypedObj)
            promise.then(
                (result) => {
                    expect(result.contents.date).to.be.an.instanceof(Date)
                    done()
                },
                (error) => {
                    done(error)
                }
            )
        })


        describe('validate against schema by typename', function() {

            function test_should_resolve_with_valid_data_when_json_validates(convertJSONObjToTypedObj, done) {
                function validate() {return undefined}
                var promise = json_file.loadDatabaseFromJSONFile(VALID_JSON_FILENAME, convertJSONObjToTypedObj, validate, 'A')
                promise.then(
                    (result) => {
                        expect(result.contents.arr[0]).equal(1)
                        if (convertJSONObjToTypedObj) {
                            expect(result.contents.date).to.be.an.instanceof(Date)
                        }
                        done()
                    },
                    (error) => {
                        done(error)
                    }
                )
            }


            function test_should_reject_with_an_error_when_json_doesnt_validate(convertJSONObjToTypedObj, done) {
                function validate() {return new Error('not a valid A')}
                var promise = json_file.loadDatabaseFromJSONFile(VALID_JSON_FILENAME, convertJSONObjToTypedObj, validate, 'A')
                promise.then(
                    (result) => {
                        done(new Error('resolved unexpectedly'))
                    },
                    (error) => {
                        expect(error.message).to.equal('not a valid A')
                        done()
                    }
                )
            }


            describe('when convertJSONObjToTypedObj is not called', function() {

                it('should resolve with valid data when json validates', function(done) {
                    test_should_resolve_with_valid_data_when_json_validates(undefined, done)
                })


                it('should reject with an error when json doesnt validate', function(done) {
                    test_should_reject_with_an_error_when_json_doesnt_validate(undefined, done)
                })

            })


            describe('when convertJSONObjToTypedObj is called', function() {

                it('should resolve with valid data when json validates', function(done) {
                    test_should_resolve_with_valid_data_when_json_validates(convertJSONObjToTypedObj, done)
                })


                it('should reject with an error when json doesnt validate', function(done) {
                    test_should_reject_with_an_error_when_json_doesnt_validate(convertJSONObjToTypedObj, done)
                })

            })

        })

    })

})
