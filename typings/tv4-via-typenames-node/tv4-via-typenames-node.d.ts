/// <reference path="../es6-promise/es6-promise.d.ts" />
/// <reference path='../tv4/tv4.d.ts' />
/// <reference path='../tv4-via-typenames/tv4-via-typenames.d.ts' />



declare module "tv4-via-typenames-node" {
    
    import tv4vtn = require('tv4-via-typenames');
    
    export interface IConfig {
        schemasDir: string;
    }

    export interface TestFunctions {
        getSchemaFilenameFromTypename: (typename : string) => string;
        getTypenameFromSchemaFilename: (pathname : string) => string;
        hasSchema: (typename : string) => boolean;
        getLoadedSchema: (typename : string) => tv4.JsonSchema;
    }

    // Manages loading schema files via type name
    export class SchemaFiles {
        static DRAFT_SCHEMA_TYPENAME: string;
        schemas: tv4vtn.IndexedSchemas;
        
        // This may only be created once.
        constructor(args: IConfig);
        // Do not use the constructed SchemaFiles object until init() resolves.
        init() : Promise<void>;
        // Loads the schemas for the types you will be using.
        // This walks the dependencies of the provided schema, and loads any referenced schemas.
        // The promise resolves if all of the schema are loaded and registered.
        loadRequiredSchema(query_typenames : string | string[]) : Promise<tv4vtn.LoadSchemaResultIndex>;
        // Validates an instance of a type against its schema which previously loaded via loadRequiredSchema().
        validate(typename, instance) : tv4.MultiResult;
                
        test: TestFunctions;
    }
}
