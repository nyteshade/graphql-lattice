"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.IDLFileHandler = void 0;

require("core-js/modules/es7.symbol.async-iterator");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$toStringTag2 = Symbol.toStringTag;

/**
 * The handler, an instance of which is created for every instance of GQLBase.
 * The handler manages the fetching and decoding of files bearing the IDL
 * schema associated with the class represented by this instance of GQLBase.
 *
 * @class IDLFileHandler
 */
class IDLFileHandler {
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
    _defineProperty(this, "path", void 0);

    _defineProperty(this, "extension", void 0);

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


  get [_Symbol$toStringTag]() {
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


  static get [_Symbol$toStringTag2]() {
    return this.name;
  }

}

exports.IDLFileHandler = IDLFileHandler;
var _default = IDLFileHandler;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9JRExGaWxlSGFuZGxlci5qcyJdLCJuYW1lcyI6WyJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsIklETEZpbGVIYW5kbGVyIiwiY29uc3RydWN0b3IiLCJDbGFzcyIsInN5bWJvbCIsIlNDSEVNQSIsInBhdHRlcm4iLCJzeW1ib2xTdHJpbmciLCJ0b1N0cmluZyIsIkFESkFDRU5UX0ZJTEUiLCJtb2R1bGUiLCJFcnJvciIsIm5hbWUiLCJmaWxlbmFtZSIsImV4dGVuc2lvbiIsIlBhdGgiLCJleHRuYW1lIiwiZGlyIiwiZGlybmFtZSIsImZpbGVmaXhlZCIsImJhc2VuYW1lIiwiYnVpbGQiLCJyZXNvbHZlIiwiam9pbiIsInBhdGgiLCJ0ZXN0IiwicGFyc2VkIiwiZXhlYyIsImZpbGUiLCJnZXRGaWxlIiwiZnMiLCJyZWFkRmlsZVN5bmMiLCJTdHJpbmciLCJnZXRTY2hlbWEiLCJ0cmVlIiwiZ2V0U3ludGF4VHJlZSIsImJ1ZmZlciIsIlN5bnRheFRyZWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzBCQXFKT0EsTUFBTSxDQUFDQyxXOzJCQWNBRCxNQUFNLENBQUNDLFc7O0FBbktyQjs7Ozs7OztBQU9PLE1BQU1DLGNBQU4sQ0FBcUI7QUFLMUI7Ozs7Ozs7Ozs7Ozs7O0FBY0FDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFrQjtBQUFBOztBQUFBOztBQUMzQjtBQUNBLFVBQU1DLE1BQU0sR0FBRyxPQUFPRCxLQUFLLENBQUNFLE1BQWIsS0FBd0IsUUFBeEIsSUFBb0NGLEtBQUssQ0FBQ0UsTUFBMUMsSUFBb0QsSUFBbkU7QUFDQSxVQUFNQyxPQUFPLEdBQUcsc0NBQWhCOztBQUVBLFFBQUlGLE1BQUosRUFBWTtBQUNWLFVBQUlHLFlBQVksR0FBR0gsTUFBTSxDQUFDSSxRQUFQLEVBQW5COztBQUVBLFVBQUlKLE1BQU0sS0FBS0QsS0FBSyxDQUFDTSxhQUFyQixFQUFvQztBQUNsQyxZQUFJTixLQUFLLENBQUNPLE1BQU4sS0FBaUJBLE1BQXJCLEVB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IGNyZWF0ZWQgZm9yIGV2ZXJ5IGluc3RhbmNlIG9mIEdRTEJhc2UuXG4gKiBUaGUgaGFuZGxlciBtYW5hZ2VzIHRoZSBmZXRjaGluZyBhbmQgZGVjb2Rpbmcgb2YgZmlsZXMgYmVhcmluZyB0aGUgSURMXG4gKiBzY2hlbWEgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbGFzcyByZXByZXNlbnRlZCBieSB0aGlzIGluc3RhbmNlIG9mIEdRTEJhc2UuXG4gKlxuICogQGNsYXNzIElETEZpbGVIYW5kbGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBJRExGaWxlSGFuZGxlciB7XG4gIHBhdGg6ID9zdHJpbmc7XG5cbiAgZXh0ZW5zaW9uOiA/c3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSURMRmlsZUhhbmRsZXIgY2hlY2tzIHRoZSBTQ0hFTUEgdmFsdWUgcmV0dXJuZWQgYnkgdGhlIGNsYXNzIHR5cGVcbiAgICogb2YgdGhlIHN1cHBsaWVkIGluc3RhbmNlLiBJZiB0aGUgcmVzdWx0aW5nIHZhbHVlIGlzIGEgU3ltYm9sLCB0aGVuIHRoZVxuICAgKiBoYW5kbGVyJ3MgcmVzcG9uc2liaWxpdHkgaXMgdG8gZmluZCB0aGUgZmlsZSwgbG9hZCBpdCBmcm9tIGRpc2sgYW5kXG4gICAqIHByb3ZpZGUgdmFyaW91cyBtZWFucyBvZiB1c2luZyBpdHMgY29udGVudHM7IGkuZS4gYXMgYSBCdWZmZXIsIGEgU3RyaW5nXG4gICAqIG9yIHdyYXBwZWQgaW4gYSBTeW50YXhUcmVlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgSURMRmlsZUhhbmRsZXJcbiAgICogQG1ldGhvZCDijobioIBjb25zdHJ1Y3RvclxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgYSBmdW5jdGlvbiBvciBjbGFzcyBkZWZpbml0aW9uIHRoYXQgcHJlc3VtYWJseVxuICAgKiBleHRlbmRzIGZyb20gR1FMQmFzZSB3ZXJlIGl0IGFuIGluc3RhbmNlLlxuICAgKi9cbiAgY29uc3RydWN0b3IoQ2xhc3M6IEZ1bmN0aW9uKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGNvbnN0IHN5bWJvbCA9IHR5cGVvZiBDbGFzcy5TQ0hFTUEgPT09ICdzeW1ib2wnICYmIENsYXNzLlNDSEVNQSB8fCBudWxsO1xuICAgIGNvbnN0IHBhdHRlcm4gPSAvU3ltYm9sXFwoUGF0aCAoLio/KSBFeHRlbnNpb24gKC4qPylcXCkvO1xuXG4gICAgaWYgKHN5bWJvbCkge1xuICAgICAgbGV0IHN5bWJvbFN0cmluZyA9IHN5bWJvbC50b1N0cmluZygpO1xuXG4gICAgICBpZiAoc3ltYm9sID09PSBDbGFzcy5BREpBQ0VOVF9GSUxFKSB7XG4gICAgICAgIGlmIChDbGFzcy5tb2R1bGUgPT09IG1vZHVsZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICAgICAgICBUaGUgYSBzdGF0aWMgZ2V0dGVyIGZvciAnbW9kdWxlJyBvbiAke0NsYXNzLm5hbWV9IG11c3QgYmUgcHJlc2VudFxuICAgICAgICAgICAgdGhhdCByZXR1cm5zIHRoZSBtb2R1bGUgb2JqZWN0IHdoZXJlIHRoZSBDbGFzcyBpcyBkZWZpbmVkLiBUcnkgdGhlXG4gICAgICAgICAgICBmb2xsb3dpbmc6XG5cbiAgICAgICAgICAgIC8vIHlvdXIgJHtDbGFzcy5uYW1lfS5qcyBmaWxlXG4gICAgICAgICAgICBpbXBvcnQgeyBHUUxCYXNlIH0gZnJvbSAnZ3JhcGhxbC1sYXR0aWNlJ1xuXG4gICAgICAgICAgICBjb25zdCAke0NsYXNzLm5hbWV9TW9kdWxlID0gbW9kdWxlO1xuXG4gICAgICAgICAgICBjbGFzcyAke0NsYXNzLm5hbWV9IGV4dGVuZHMgR1FMQmFzZSB7XG4gICAgICAgICAgICAgIC4uLlxuXG4gICAgICAgICAgICAgIHN0YXRpYyBnZXQgbW9kdWxlKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAke0NsYXNzLm5hbWV9TW9kdWxlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gQ2xhc3MubW9kdWxlLmZpbGVuYW1lO1xuICAgICAgICBjb25zdCBleHRlbnNpb24gPSBQYXRoLmV4dG5hbWUoZmlsZW5hbWUpXG4gICAgICAgIGNvbnN0IGRpciA9IFBhdGguZGlybmFtZShmaWxlbmFtZSlcbiAgICAgICAgY29uc3QgZmlsZWZpeGVkID0gUGF0aC5iYXNlbmFtZShmaWxlbmFtZSwgZXh0ZW5zaW9uKVxuICAgICAgICBjb25zdCBidWlsZCA9IFBhdGgucmVzb2x2ZShQYXRoLmpvaW4oZGlyLCBgJHtmaWxlZml4ZWR9LmdyYXBocWxgKSlcblxuICAgICAgICB0aGlzLnBhdGggPSBidWlsZDtcbiAgICAgICAgdGhpcy5leHRlbnNpb24gPSAnLmdyYXBocWwnO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocGF0dGVybi50ZXN0KHN5bWJvbFN0cmluZykpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gcGF0dGVybi5leGVjKHN5bWJvbFN0cmluZyk7XG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IHBhcnNlZFsyXSB8fCAnLmdyYXBocWwnXG4gICAgICAgIGNvbnN0IGRpciA9IFBhdGguZGlybmFtZShwYXJzZWRbMV0pXG4gICAgICAgIGNvbnN0IGZpbGUgPSBQYXRoLmJhc2VuYW1lKHBhcnNlZFsxXSwgZXh0ZW5zaW9uKVxuICAgICAgICBjb25zdCBidWlsZCA9IFBhdGgucmVzb2x2ZShQYXRoLmpvaW4oZGlyLCBgJHtmaWxlfSR7ZXh0ZW5zaW9ufWApKVxuXG4gICAgICAgIHRoaXMucGF0aCA9IGJ1aWxkO1xuICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IGV4dGVuc2lvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnBhdGggPSB0aGlzLmV4dGVuc2lvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBjYWxjdWxhdGVkIGZpbGUgZGV0ZXJtaW5lZCBieSB0aGUgZGVjb2Rpbmcgb2YgdGhlIG1lYW5pbmcgb2ZcbiAgICogdGhlIFN5bWJvbCByZXR1cm5lZCBieSB0aGUgU0NIRU1BIHByb3BlcnR5IG9mIHRoZSBpbnN0YW5jZSBzdXBwbGllZCB0b1xuICAgKiB0aGUgSURMRmlsZUhhbmRsZXIgdXBvbiBjcmVhdGlvbi5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBJRExGaWxlSGFuZGxlclxuICAgKiBAbWV0aG9kIOKMvuKggGdldEZpbGVcbiAgICpcbiAgICogQHJldHVybiB7QnVmZmVyfG51bGx9IHJldHVybnMgdGhlIEJ1ZmZlciBjb250YWluaW5nIHRoZSBmaWxlIGJhc2UgSURMXG4gICAqIHNjaGVtYSBvciBudWxsIGlmIG5vbmUgd2FzIGZvdW5kIG9yIGEgZGlyZWN0IHN0cmluZyBzY2hlbWEgaXMgcmV0dXJuZWRcbiAgICogYnkgdGhlIFNDSEVNQSBwcm9wZXJ0eVxuICAgKi9cbiAgZ2V0RmlsZSgpOiBCdWZmZXIge1xuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoU3RyaW5nKHRoaXMucGF0aCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIGdldEZpbGUoKSByZXR1cm5zIGEgQnVmZmVyLCB0aGlzIGlzIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlXG4gICAqIHVuZGVybHlpbmcgZmlsZSBjb250ZW50cy4gQXMgYSBtZWFucyBvZiB2YWxpZGF0aW5nIHRoZSBjb250ZW50cyBvZiB0aGVcbiAgICogZmlsZSwgdGhlIHN0cmluZyBjb250ZW50cyBhcmUgcGFyc2VkIGludG8gYW4gQVNUIGFuZCBiYWNrIHRvIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIElETEZpbGVIYW5kbGVyXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0U2NoZW1hXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ3xudWxsfSB0aGUgc3RyaW5nIGNvbnRlbnRzIG9mIHRoZSBCdWZmZXIgY29udGFpbmluZyB0aGVcbiAgICogZmlsZSBiYXNlZCBJREwgc2NoZW1hLlxuICAgKi9cbiAgZ2V0U2NoZW1hKCk6ID9zdHJpbmcge1xuICAgIGlmICghdGhpcy5wYXRoKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBjb25zdCB0cmVlID0gdGhpcy5nZXRTeW50YXhUcmVlKCk7XG5cbiAgICByZXR1cm4gdHJlZS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIGdldEZpbGUoKSByZXR1cm5zIGEgQnVmZmVyLCB0aGUgc3RyaW5nIGNvbnRlbnRzIGFyZSBwYXNzZWQgdG8gYSBuZXdcbiAgICogaW5zdGFuY2Ugb2YgU3ludGF4VHJlZSB3aGljaCBwYXJzZXMgdGhpcyBpbnRvIGFuIEFTVCBmb3IgbWFuaXB1bGF0aW9uLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIElETEZpbGVIYW5kbGVyXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0U3ludGF4VHJlZVxuICAgKlxuICAgKiBAcmV0dXJuIHtTeW50YXhUcmVlfG51bGx9IGEgU3ludGF4VHJlZSBpbnN0YW5jZSBjb25zdHJ1Y3RlZCBmcm9tIHRoZSBJRExcbiAgICogc2NoZW1hIGNvbnRlbnRzIGxvYWRlZCBmcm9tIGRpc2suIE51bGwgaXMgcmV0dXJuZWQgaWYgYSBjYWxjdWxhdGVkIHBhdGhcbiAgICogY2Fubm90IGJlIGZvdW5kOyBhbHdheXMgb2NjdXJzIHdoZW4gU0NIRU1BIHJldHVybnMgYSBzdHJpbmcuXG4gICAqL1xuICBnZXRTeW50YXhUcmVlKCk6IFN5bnRheFRyZWUge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuZ2V0RmlsZSgpO1xuICAgIGNvbnN0IHRyZWUgPSBuZXcgU3ludGF4VHJlZShidWZmZXIudG9TdHJpbmcoKSk7XG5cbiAgICByZXR1cm4gdHJlZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgY29uc3RydWN0b3JgIG5hbWUuIElmIGludm9rZWQgYXMgdGhlIGNvbnRleHQsIG9yIGB0aGlzYCxcbiAgICogb2JqZWN0IG9mIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgT2JqZWN0YCdzIGBwcm90b3R5cGVgLCB0aGUgcmVzdWx0aW5nXG4gICAqIHZhbHVlIHdpbGwgYmUgYFtvYmplY3QgTXlDbGFzc11gLCBnaXZlbiBhbiBpbnN0YW5jZSBvZiBgTXlDbGFzc2BcbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBbU3ltYm9sLnRvU3RyaW5nVGFnXVxuICAgKiBAbWVtYmVyb2YgSURMRmlsZUhhbmRsZXJcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgY2xhc3MgdGhpcyBpcyBhbiBpbnN0YW5jZSBvZlxuICAgKiBAQ29tcHV0ZWRUeXBlXG4gICAqL1xuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7IHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzYW1lIGxvZ2ljIGFzIHtAbGluayAjW1N5bWJvbC50b1N0cmluZ1RhZ119IGJ1dCBvbiBhIHN0YXRpY1xuICAgKiBzY2FsZS4gU28sIGlmIHlvdSBwZXJmb3JtIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoTXlDbGFzcylgXG4gICAqIHRoZSByZXN1bHQgd291bGQgYmUgYFtvYmplY3QgTXlDbGFzc11gLlxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggFtTeW1ib2wudG9TdHJpbmdUYWddXG4gICAqIEBtZW1iZXJvZiBJRExGaWxlSGFuZGxlclxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIG5hbWUgb2YgdGhpcyBjbGFzc1xuICAgKiBAQ29tcHV0ZWRUeXBlXG4gICAqL1xuICBzdGF0aWMgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSURMRmlsZUhhbmRsZXIiXX0=