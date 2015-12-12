/// <reference path='../../typings/es6-promise/es6-promise.d.ts' />


declare module JSONFile {
    type Validate = (typename: string, element: any) => Error
}


declare module 'json-file' {

    /* Read a JSON file.
     * @return a Promise that resolves if the file contains valid JSON.
     */
    function readJSONFile(filename: string): Promise<{filename: string, contents: any}>
    /* Read a data-set from a JSON file.
     * @param convertJSONObjToTypedObj Optional function to convert JSON fields to equivalent objects.
     *        For example, to convert strings to Dates.
     * @param validate Optional function to validate that JSON has expected contents.
     *        For example, to validate contents against schema.
     * @return a Promise that resolves if the file contains valid JSON.
     *         That is, both JSON.parse() and validate() don't find errors.
     */
    function loadDatabaseFromJSONFile(filename: string, convertJSONObjToTypedObj?: (json_obj : any) => void, validate?: JSONFile.Validate, typename?: string): Promise<{filename: string, contents: any}>
}
