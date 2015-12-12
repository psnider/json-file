/// <reference path='../../typings/node/node.d.ts' />
/// <reference path='../../typings/es6-promise/es6-promise.d.ts' />
/// <reference path='../../typings/json-file/json-file.d.ts' />


import fs                               = require('fs');




export function readJSONFile(filename : string) : Promise<{filename: string, contents: any}> {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, {"encoding": "utf-8"}, (error, data) => {
            if (error) {
                reject(error);
            } else {
                try {
                    var obj = JSON.parse(data);
                    resolve({filename: filename, contents: obj});
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}



function convertJSONObjOrArrayToTypedObject(json_obj : any, convertJSONObjToTypedObj? : (json_obj : any) => void) : any {
    if (convertJSONObjToTypedObj != null) {
        if (Array.isArray(json_obj)) {
            for (var i in json_obj) {
                var element = json_obj[i];
                json_obj[i] = convertJSONObjToTypedObj(element);
            }
        } else {
            json_obj = convertJSONObjToTypedObj(json_obj);
        }
    }
    return json_obj;
}



// @arg: typename: The typename for the type in the JSON file.
export function loadDatabaseFromJSONFile(filename : string, convertJSONObjToTypedObj? : (json_obj : any) => void, validate?: JSONFile.Validate, typename?: string): Promise<any> {
    // @throws An error if the object is not valid..
    function checkValidity(obj) {
        if (Array.isArray(obj)) {
            for (var key in obj) {
                var element = obj[key]
                var error : any = validate(typename, element)
                if (error) {
                    return error
                }
            }
        } else {
            error = validate(typename, obj)
            if (error) {
                return error
            }
        }
    }
    var read_promise = readJSONFile(filename)
    return read_promise.then((result) => {
        if (convertJSONObjToTypedObj) {
            convertJSONObjOrArrayToTypedObject(result.contents, convertJSONObjToTypedObj)
        }
        if ((validate != null) && (typename != null)) {
            var validity_error = checkValidity(result.contents)
            if (validity_error) {
                throw validity_error
            }
        }
        return result
    })
}
