/** @namespace GQLBaseEnv */
// @flow

import Path from 'path'
import fs from 'fs'

import { Deferred } from './utils'
import { typeOf } from './types'
import { SyntaxTree } from './SyntaxTree'

/**
 * Constant referring to the nodejs module in which this code is defined.
 *
 * @memberof GQLBaseEnv
 * @type {Object}
 * @const
 */
const GQLBaseModule = module;

/**
 * A `Symbol` used as a key to store the backing model data. Designed as a
 * way to separate model data and GraphQL property accessors into logical bits.
 *
 * @type {Symbol}
 * @memberof GQLBaseEnv
 * @const
 */
export const MODEL_KEY = Symbol.for('data-model-contents-key');

/**
 * A `Symbol` used as a key to store the request data for an instance of the
 * GQLBase object in question.
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberof GQLBaseEnv
 */
export const REQ_DATA_KEY = Symbol.for('request-data-object-key');

/**
 * All GraphQL Type objects used in this system are assumed to have extended
 * from this class. An instance of this class can be used to wrap an existing
 * structure if you have one.
 *
 * @class GQLBase
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
   * @instance
   * @memberof GQLBase
   * @method ⎆⠀constructor
   * @constructor
   *
   * @param {mixed} modelData this, typically an object, although anything
   * really is supported, represents the model data for our GraphQL object
   * instance.
   * @param {Object} requestData see description above
   */
  constructor(modelData: Object = {}, requestData: Object = null) {
    const Class = this.constructor;

    this.model = modelData;
    this.requestData = requestData;
    this.fileHandler = new IDLFileHandler(this.constructor);
  }

  /**
   * Getter for the internally stored model data. The contents of this
   * object are abstracted away behind a `Symbol` key to prevent collision
   * between the underlying model and any GraphQL Object Definition properties.
   *
   * @instance
   * @memberof GQLBase
   * @method ⬇︎⠀model
   *
   * @param {Object} value any object you wish to use as a data store
   */
  get model() {
    return this[MODEL_KEY];
  }

  /**
   * Setter for the internally stored model data. The contents of this
   * object are abstracted away behind a `Symbol` key to prevent collision
   * between the underlying model and any GraphQL Object Definition properties.
   *
   * @instance
   * @memberof GQLBase
   * @method ⬆︎⠀model
   *
   * @param {Object} value any object you wish to use as a data store
   */
  set model(value: Object) {
    this[MODEL_KEY] = value;
  }

  /**
   * A getter that retrieves the inner request data object. When used with
   * GQLExpressMiddleware, this is an object matching {req, res, gql}.
   *
   * @instance
   * @memberof GQLBase
   * @method ⬇︎⠀requestData
   *
   * @return {Object} an object, usually matching { req, res, gql }
   */
  get requestData(): Object {
    return this[REQ_DATA_KEY];
  }

  /**
   * A setter that assigns a value to the inner request data object. When
   * used with GQLExpressMiddleware, this is an object matching {req, res, gql}.
   *
   * @instance
   * @memberof GQLBase
   * @method ⬆︎⠀requestData
   *
   * @param {Object} value an object, usually matching { req, res, gql }
   */
  set requestData(value: Object): void {
    this[REQ_DATA_KEY] = value;
  }

  /**
   * Defined in a base class, this getter should return either a String
   * detailing the full IDL schema of a GraphQL handler or one of two
   * types of Symbols.
   *
   * The first Symbol type is the constant `ADJACENT_FILE`. If this Symbol is
   * returned, the system assumes that next to the source file in question is
   * a file of the same name with a .graphql extension. This file should be
   * made of the GraphQL IDL schema definitions for the object types being
   * created.
   *
   * Example:
   * ```js
   *   static get SCHEMA(): String | Symbol {
   *     return GQLBase.ADJACENT_FILE
   *   }
   * ```
   *
   * The primary advantage of this approach is allowing an outside editor that
   * provides syntax highlighting rather than returning a string from the
   * SCHEMA getter.
   *
   * Alternatively, the static method IDLFilePath can be used to point to an
   * alternate location where the GraphQL IDL file resides. The extension can
   * also be changed from .graphql to something else if need be using this
   * method.
   *
   * Example:
   * ```js
   *   static get SCHEMA(): String | Symbol {
   *     return GQLBase.IDLFilePath('/path/to/file', '.idl')
   *   }
   * ```
   *
   * NOTE - Important!
   * When not returning a direct string based IDL schema, the call to super()
   * from a child class must include `module` as the second parameter or an
   * error will be thrown upon object creation.
   *
   * @instance
   * @memberof GQLBase
   * @method ⬇︎⠀SCHEMA
   * @readonly
   * @static
   *
   * @return {string|Symbol} a valid IDL string or one of the Symbols
   * described above.
   *
   * @see {@link GQLBase#ADJACENT_FILE}
   * @see {@link GQLBase#IDLFilePath}
   */
  static get SCHEMA(): string | Symbol {
    // define in base class
  }

  /**
   * This method should return a promise that resolves to an object of
   * functions matching the names of the mutation operations. These are to be
   * injected into the root object when used by `GQLExpressMiddleware`.
   *
   * @instance
   * @memberof GQLBase
   * @method ⬇︎⠀MUTATORS
   * @readonly
   * @static
   *
   * @param {Object} requestData typically an object containing three
   * properties; {req, res, gql}
   * @return {Promise} a promise that resolves to an object; see above for more
   * information.
   */
  static async MUTATORS(requestData: Object): Promise<Object> {
    // define in base class
    return Promise.resolve({});
  }

  /**
   * This method should return a promise that resolves to an object of
   * functions matching the names of the query operations. These are to be
   * injected into the root object when used by `GQLExpressMiddleware`.
   *
   * @instance
   * @memberof GQLBase
   * @method ⬇︎⠀RESOLVERS
   * @readonly
   * @static
   *
   * @param {Object} requestData typically an object containing three
   * properties; {req, res, gql}
   * @return {Promise} a promise that resolves to an object; see above for more
   * information.
   */
  static async RESOLVERS(requestData: Object): Promise<Object> {
    // define in base class
    return Promise.resolve({});
  }

  /**
   * @see {@link GQLBase#SCHEMA}
   *
   * @memberof GQLBase
   * @method ⬇︎⠀ADJACENT_FILE
   * @static
   * @const
   *
   * @return {Symbol} the Symbol, when returned from SCHEMA, causes
   * the logic to load an IDL Schema from an associated file with a .graphql
   * extension and bearing the same name.
   */
  static get ADJACENT_FILE(): Symbol {
    return Symbol.for('.graphql file located adjacent to source')
  }

  /**
   * Creates an appropriate Symbol crafted with the right data for use by
   * the IDLFileHandler class below.
   *
   * @static
   * @memberof GQLBase
   * @method ⌾⠀IDLFilePath
   *
   * @param {string} path a path to the IDL containing file
   * @param {String} [extension='.graphql'] an extension, including the
   * prefixed period, that will be added to the supplied path should it not
   * already exist.
   * @return Symbol
   *
   * @see {@link GQLBase#SCHEMA}
   */
  static IDLFilePath(path: string, extension: string = '.graphql'): Symbol {
    return Symbol.for(`Path ${path} Extension ${extension}`);
  }

  /**
   * A file handler for fetching the IDL schema string from the file system
   * for those `GQLBase` extended classes that have indicated to do so by
   * returning a `Symbol` for their `SCHEMA` property.
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀handler
   *
   * @return {IDLFileHandler} instance of IDLFileHandler, created if one does
   * not already exist, for fetching the contents from disk.
   */
  static get handler(): IDLFileHandler {
    const key = Symbol.for(`${IDLFileHandler.name}.${this.name}`);

    if (!this[key]) {
      this[key] = new IDLFileHandler(this);
    }

    return this[key];
  }

  /**
   * Returns the module object where your class is created. This needs to be
   * defined on your class, as a static getter, in the FILE where you are
   * defining your Class definition.
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀module
   * @const
   *
   * @return {Object} the reference to the module object defined and injected
   * by node.js' module loading system.
   *
   * @see https://nodejs.org/api/modules.html
   */
  static get module(): Object {
    return GQLBaseModule;
  }
}

/**
 * The handler, an instance of which is created for every instance of GQLBase.
 * The handler manages the fetching and decoding of files bearing the IDL
 * schema associated with the class represented by this instance of GQLBase.
 *
 * @class IDLFileHandler
 */
export class IDLFileHandler {
  /**
   * The IDLFileHandler checks the SCHEMA value returned by the class type
   * of the supplied instance. If the resulting value is a Symbol, then the
   * handler's responsibility is to find the file, load it from disk and
   * provide various means of using its contents; i.e. as a Buffer, a String
   * or wrapped in a SyntaxTree instance.
   *
   * @instance
   * @memberof IDLFileHandler
   * @method ⎆⠀constructor
   *
   * @param {Function} Class a function or class definition that presumably
   * extends from GQLBase were it an instance.
   */
  constructor(Class: Function) {
    const symbol = typeof Class.SCHEMA === 'symbol' && Class.SCHEMA || null;
    const pattern = /Symbol\(Path (.*?) Extension (.*?)\)/;

    if (symbol) {
      let symbolString = symbol.toString();

      if (symbol === Class.ADJACENT_FILE) {
        if (Class.module === GQLBaseModule) {
          throw new Error(`
            The a static getter for 'module' on ${Class.name} must be present
            that returns the module object where the Class is defined. Try the
            following:

            // your ${Class.name}.js file
            import { GQLBase } from 'graphql-lattice'

            const ${Class.name}Module = module;

            class ${Class.name} extends GQLBase {
              ...

              static get module() {
                return ${Class.name}Module;
              }
            }

          `);
        }

        const filename = Class.module.filename;
        const extension = Path.extname(filename)
        const dir = Path.dirname(filename)
        const filefixed = Path.basename(filename, extension)
        const build = Path.resolve(Path.join(dir, `${filefixed}.graphql`))

        this.path = build;
        this.extension = '.graphql';
      }
      else if (pattern.test(symbolString)) {
        const parsed = pattern.exec(symbolString);
        const extension = parsed[2] || '.graphql'
        const dir = Path.dirname(parsed[1])
        const file = Path.basename(parsed[1], extension)
        const build = Path.resolve(Path.join(dir, `${file}${extension}`))

        this.path = build;
        this.extension = extension;

        console.log(`Path ${this.path} Ext ${this.extension}`)
        console.log(`Resolved ${Path.resolve(this.path)}`)
      }
    }
    else {
      this.path = this.extension = null;
    }
  }

  /**
   * Loads the calculated file determined by the decoding of the meaning of
   * the Symbol returned by the SCHEMA property of the instance supplied to
   * the IDLFileHandler upon creation.
   *
   * @instance
   * @memberof IDLFileHandler
   * @method ⌾⠀getFile
   *
   * @return {Buffer|null} returns the Buffer containing the file base IDL
   * schema or null if none was found or a direct string schema is returned
   * by the SCHEMA property
   */
  getFile(): Buffer {
    return fs.readFileSync(this.path);
  }

  /**
   * If getFile() returns a Buffer, this is the string representation of the
   * underlying file contents. As a means of validating the contents of the
   * file, the string contents are parsed into an AST and back to a string.
   *
   * @instance
   * @memberof IDLFileHandler
   * @method ⌾⠀getSchema
   *
   * @return {string|null} the string contents of the Buffer containing the
   * file based IDL schema.
   */
  getSchema(): string {
    if (!this.path) { return null; }

    const tree = this.getSyntaxTree();

    return tree.toString();
  }

  /**
   * If getFile() returns a Buffer, the string contents are passed to a new
   * instance of SyntaxTree which parses this into an AST for manipulation.
   *
   * @instance
   * @memberof IDLFileHandler
   * @method ⌾⠀getSyntaxTree
   *
   * @return {SyntaxTree|null} a SyntaxTree instance constructed from the IDL
   * schema contents loaded from disk. Null is returned if a calculated path
   * cannot be found; always occurs when SCHEMA returns a string.
   */
  getSyntaxTree(): SyntaxTree {
    const buffer = this.getFile();
    const tree = new SyntaxTree(buffer.toString());

    return tree;
  }
}

export default GQLBase;
