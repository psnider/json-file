/// <reference path='../../typings/node/node.d.ts' />
/// <reference path='../../typings/es6-promise/es6-promise.d.ts' />
/// <reference path='../../typings/json-file/json-file.d.ts' />
var fs = require('fs');
function readJSONFile(filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, { "encoding": "utf-8" }, function (error, data) {
            if (error) {
                reject(error);
            }
            else {
                try {
                    var obj = JSON.parse(data);
                    resolve({ filename: filename, contents: obj });
                }
                catch (error) {
                    reject(error);
                }
            }
        });
    });
}
exports.readJSONFile = readJSONFile;
function convertJSONObjOrArrayToTypedObject(json_obj, convertJSONObjToTypedObj) {
    if (convertJSONObjToTypedObj != null) {
        if (Array.isArray(json_obj)) {
            for (var i in json_obj) {
                var element = json_obj[i];
                json_obj[i] = convertJSONObjToTypedObj(element);
            }
        }
        else {
            json_obj = convertJSONObjToTypedObj(json_obj);
        }
    }
    return json_obj;
}
// @arg: typename: The typename for the type in the JSON file.
function loadDatabaseFromJSONFile(filename, convertJSONObjToTypedObj, validate, typename) {
    // @throws An error if the object is not valid..
    function checkValidity(obj) {
        if (Array.isArray(obj)) {
            for (var key in obj) {
                var element = obj[key];
                var error = validate(typename, element);
                if (error) {
                    return error;
                }
            }
        }
        else {
            error = validate(typename, obj);
            if (error) {
                return error;
            }
        }
    }
    var read_promise = readJSONFile(filename);
    return read_promise.then(function (result) {
        if (convertJSONObjToTypedObj) {
            convertJSONObjOrArrayToTypedObject(result.contents, convertJSONObjToTypedObj);
        }
        if ((validate != null) && (typename != null)) {
            var validity_error = checkValidity(result.contents);
            if (validity_error) {
                throw validity_error;
            }
        }
        return result;
    });
}
exports.loadDatabaseFromJSONFile = loadDatabaseFromJSONFile;

//# sourceMappingURL=json-file.js.map
