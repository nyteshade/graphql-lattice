
import Path from 'path'
import fs from 'fs'

import { typeOf, Deferred } from './utils'
import { SyntaxTree } from './SyntaxTree'

export const REQ_DATA_KEY = Symbol.for('request-data-object-key');

const gqlBaseModule = module;

/**
 * All GraphQL Type objects used in this system are assumed to have extended
 * from this class. An instance of this class can be used to wrap an existing
 * structure if you have one.
 */
export class GQLBase {
  /**
   * Request data is passed to this object when constructed. Typically these
   * objects, and their children, are instantiated by its own static MUTATORS 
   * and RESOLVERS. They should contain request specific state if any is to 
   * be shared. 
   *
   * These can be considered request specific controllers for the object in
   * question. The base class takes a single object which should contain all
   * the HTTP/S request data and the graphQLParams is provided as the object 
   * { query, variables, operationName, raw }.
   *
   * When used with express-graphql, the requestData object has the format
   * { req, res, gql } where 
   *   • req is an Express 4.x request object
   *   • res is an Express 4.x response object 
   *   • gql is the graphQLParams object in the format of
   *     { query, variables, operationName, raw }
   *     See https://github.com/graphql/express-graphql for more info
   * 
   * @method constructor
   * @param {Object} requestData see description above
   */
  constructor(requestData: Object, classModule: Object | undefined) {
    const Class = this.constructor;
    
    this.requestData = requestData;
    this.classModule = classModule;
    this.fileHandler = new IDLFileHandler(this);    
  }
  
  /** @return {Object} an object, typically matching { req, res, gql } */
  get requestData() {
    return this[REQ_DATA_KEY];
  }
  
  /** @param {Object} value an object, typically matching {req, res, gql} */
  set requestData(value) {    
    this[REQ_DATA_KEY] = value;
  }
  
  /**
   * Defined in a base class, this getter should return either a String 
   * detailing the full IDL schema of a GraphQL handler or one of two
   * types of Symbols. 
   * 
   * The first Symbol type is the constant ADJACENT_FILE. If this Symbol is
   * returned, the system assumes that next to the source file in question is
   * a 
   */
  static get SCHEMA(): String | Symbol {
    // define in base class
  }
  
  static async MUTATORS(requestData) {
    // define in base class
    return Promise.resolve({});
  }
  
  static async RESOLVERS(requestData) {
    // define in base class
    return Promise.resolve({});
  }
  
  static get ADJACENT_FILE() {
    return Symbol.for('.graphql file located adjacent to source')
  }
  
  static IDL_FILE_PATH(path, extension = '.graphql') {
    return Symbol.for(`Path ${path} Extension ${extension}`);
  }    
}

export class IDLFileHandler {
  constructor(instance: GQLBase) {
    const Class = instance.constructor;
    const symbol = typeOf(Class.SCHEMA) === Symbol.name && Class.SCHEMA || null;
    const pattern = /Symbol\(Path (.*?) Extension (.*?)\)/;
    
    this.instance = instance;
    
    if (symbol) {  
      let symbolString = symbol.toString();
          
      if (symbol === Class.ADJACENT_FILE) {      
        if (!classModule) {
          throw new Error(`
            The call to super from ${Class.name} must be invoked with 
            module as the second parameter if you wish to use an ADJACENT_FILE
            schema. If requestData is your first parameter, adjust your
            call to super() to look like this: super(requestData, module);
          `);
        }
        
        file = this.classModule.filename;
        this.extension = '.graphql';
        this.path = Path.resolve(Path.join(
          Path.dirname(file),
          Path.basename(file, Path.extname(file)),
          this.extension
        ));
      }
      else if (pattern.test(symbolString)) {
        let parsed = pattern.exec(symbolString);
        this.extension = parsed[2];
        this.path = parsed[1];
        
        // Make sure the resolved filename actually has the extension on it
        // depending on how people setup the data
        if (this.path === Path.basename(this.path, this.extension)) {
          let name = this.path;
          let ext = this.extension;
          
          this.path = Path.format({ name, ext });
        }
        
        // Resolve the absolute path to the file in question
        this.path = Path.resolve(this.path);
      }
    }
    else {
      this.path = this.extension = null;
    }
  }
  
  async getFile(ignoreCache: boolean = false): Promise<Buffer|Error> {
    const deferred = new Deferred();
    
    if (ignoreCache || !this._cached) {
      fs.readFile(this.path, (error, buffer) => {
        if (error) {
          this._cached = null;
          return deferred.reject(error);        
        }
        deferred.resolve((this._cached = buffer));
      });
    }
    else {
      deferred.resolve(this._cached);
    }
    
    return deferred.promise;
  }
  
  async getSchema(): Promise<string> {
    const tree = await this.getSyntaxTree();
    
    return tree.toString();
  }
  
  async getSyntaxTree(): Promise<SyntaxTree> {
    const buffer = await this.getFile();
    const tree = new SyntaxTree(buffer.toString());
    
    return tree;
  }
}

export default GQLBase;