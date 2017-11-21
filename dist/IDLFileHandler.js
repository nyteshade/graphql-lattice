'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IDLFileHandler = undefined;

var _toStringTag = require('babel-runtime/core-js/symbol/to-string-tag');

var _toStringTag2 = _interopRequireDefault(_toStringTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The handler, an instance of which is created for every instance of GQLBase.
 * The handler manages the fetching and decoding of files bearing the IDL
 * schema associated with the class represented by this instance of GQLBase.
 *
 * @class IDLFileHandler
 */
let IDLFileHandler = exports.IDLFileHandler = class IDLFileHandler {

  /**
   * The IDLFileHandler checks the SCHEMA value returned by the class type
   * of the supplied instance. If the resulting value is a Symbol, then the
   * handler's responsibility is to find the file, load it from disk and
   * provide various means of using its contents; i.e. as a Buffer, a String
   * or wrapped in a SyntaxTree instance.
   *
   * @memberof IDLFileHandler
   * @method ⎆⠀constructor
   * @constructor
   *
   * @param {Function} Class a function or class definition that presumably
   * extends from GQLBase were it an instance.
   */
  constructor(Class) {
    // $FlowFixMe
    const symbol = typeof Class.SCHEMA === 'symbol' && Class.SCHEMA || null;
    const pattern = /Symbol\(Path (.*?) Extension (.*?)\)/;

    if (symbol) {
      let symbolString = symbol.toString();

      if (symbol === Class.ADJACENT_FILE) {
        if (Class.module === module) {
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
        const extension = Path.extname(filename);
        const dir = Path.dirname(filename);
        const filefixed = Path.basename(filename, extension);
        const build = Path.resolve(Path.join(dir, `${filefixed}.graphql`));

        this.path = build;
        this.extension = '.graphql';
      } else if (pattern.test(symbolString)) {
        const parsed = pattern.exec(symbolString);
        const extension = parsed[2] || '.graphql';
        const dir = Path.dirname(parsed[1]);
        const file = Path.basename(parsed[1], extension);
        const build = Path.resolve(Path.join(dir, `${file}${extension}`));

        this.path = build;
        this.extension = extension;
      }
    } else {
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
  getFile() {
    return fs.readFileSync(String(this.path));
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
  getSchema() {
    if (!this.path) {
      return null;
    }

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
  getSyntaxTree() {
    const buffer = this.getFile();
    const tree = new SyntaxTree(buffer.toString());

    return tree;
  }

  /**
   * Returns the `constructor` name. If invoked as the context, or `this`,
   * object of the `toString` method of `Object`'s `prototype`, the resulting
   * value will be `[object MyClass]`, given an instance of `MyClass`
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof IDLFileHandler
   *
   * @return {string} the name of the class this is an instance of
   * @ComputedType
   */
  get [_toStringTag2.default]() {
    return this.constructor.name;
  }

  /**
   * Applies the same logic as {@link #[Symbol.toStringTag]} but on a static
   * scale. So, if you perform `Object.prototype.toString.call(MyClass)`
   * the result would be `[object MyClass]`.
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof IDLFileHandler
   * @static
   *
   * @return {string} the name of this class
   * @ComputedType
   */
  static get [_toStringTag2.default]() {
    return this.name;
  }
};
exports.default = IDLFileHandler;
//# sourceMappingURL=IDLFileHandler.js.map