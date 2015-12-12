/// <reference path='../tv4-via-typenames-node/tv4-via-typenames-node.d.ts' />


declare module JSONFile {
    type Validate = (typename: string, element: any) => Error
}


declare module 'json-file' {
    import tv4vtnNode                       = require('tv4-via-typenames-node')
    import SchemaFiles                      = tv4vtnNode.SchemaFiles

    function readJSONFile(filename: string): Promise<{filename: string, contents: any}>
    function loadDatabaseFromJSONFile(filename: string, convertJSONObjToTypedObj?: (json_obj : any) => void, validate?: JSONFile.Validate, typename?: string)
}
