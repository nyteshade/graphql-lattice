"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.IDLFileHandler = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/**
 * The handler, an instance of which is created for every instance of GQLBase.
 * The handler manages the fetching and decoding of files bearing the IDL
 * schema associated with the class represented by this instance of GQLBase.
 *
 * @class IDLFileHandler
 */
var IDLFileHandler =
/*#__PURE__*/
function () {
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
  function IDLFileHandler(Class) {
    (0, _classCallCheck2.default)(this, IDLFileHandler);
    // $FlowFixMe
    var symbol = (0, _typeof2.default)(Class.SCHEMA) === 'symbol' && Class.SCHEMA || null;
    var pattern = /Symbol\(Path (.*?) Extension (.*?)\)/;

    if (symbol) {
      var symbolString = symbol.toString();

      if (symbol === Class.ADJACENT_FILE) {
        if (Class.module === module) {
          throw new Error("\n            The a static getter for 'module' on ".concat(Class.name, " must be present\n            that returns the module object where the Class is defined. Try the\n            following:\n\n            // your ").concat(Class.name, ".js file\n            import { GQLBase } from 'graphql-lattice'\n\n            const ").concat(Class.name, "Module = module;\n\n            class ").concat(Class.name, " extends GQLBase {\n              ...\n\n              static get module() {\n                return ").concat(Class.name, "Module;\n              }\n            }\n\n          "));
        }

        var filename = Class.module.filename;
        var extension = Path.extname(filename);
        var dir = Path.dirname(filename);
        var filefixed = Path.basename(filename, extension);
        var build = Path.resolve(Path.join(dir, "".concat(filefixed, ".graphql")));
        this.path = build;
        this.extension = '.graphql';
      } else if (pattern.test(symbolString)) {
        var parsed = pattern.exec(symbolString);

        var _extension = parsed[2] || '.graphql';

        var _dir = Path.dirname(parsed[1]);

        var file = Path.basename(parsed[1], _extension);

        var _build = Path.resolve(Path.join(_dir, "".concat(file).concat(_extension)));

        this.path = _build;
        this.extension = _extension;
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


  (0, _createClass2.default)(IDLFileHandler, [{
    key: "getFile",
    value: function getFile() {
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

  }, {
    key: "getSchema",
    value: function getSchema() {
      if (!this.path) {
        return null;
      }

      var tree = this.getSyntaxTree();
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

  }, {
    key: "getSyntaxTree",
    value: function getSyntaxTree() {
      var buffer = this.getFile();
      var tree = new SyntaxTree(buffer.toString());
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

  }, {
    key: Symbol.toStringTag,
    get: function get() {
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

  }], [{
    key: Symbol.toStringTag,
    get: function get() {
      return this.name;
    }
  }]);
  return IDLFileHandler;
}();

exports.IDLFileHandler = IDLFileHandler;
var _default = IDLFileHandler;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9JRExGaWxlSGFuZGxlci5qcyJdLCJuYW1lcyI6WyJJRExGaWxlSGFuZGxlciIsIkNsYXNzIiwic3ltYm9sIiwiU0NIRU1BIiwicGF0dGVybiIsInN5bWJvbFN0cmluZyIsInRvU3RyaW5nIiwiQURKQUNFTlRfRklMRSIsIm1vZHVsZSIsIkVycm9yIiwibmFtZSIsImZpbGVuYW1lIiwiZXh0ZW5zaW9uIiwiUGF0aCIsImV4dG5hbWUiLCJkaXIiLCJkaXJuYW1lIiwiZmlsZWZpeGVkIiwiYmFzZW5hbWUiLCJidWlsZCIsInJlc29sdmUiLCJqb2luIiwicGF0aCIsInRlc3QiLCJwYXJzZWQiLCJleGVjIiwiZmlsZSIsImZzIiwicmVhZEZpbGVTeW5jIiwiU3RyaW5nIiwidHJlZSIsImdldFN5bnRheFRyZWUiLCJidWZmZXIiLCJnZXRGaWxlIiwiU3ludGF4VHJlZSIsIlN5bWJvbCIsInRvU3RyaW5nVGFnIiwiY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7O0lBT2FBLGM7OztBQUtYOzs7Ozs7Ozs7Ozs7OztBQWNBLDBCQUFZQyxLQUFaLEVBQTZCO0FBQUE7QUFDM0I7QUFDQSxRQUFNQyxNQUFNLEdBQUcsc0JBQU9ELEtBQUssQ0FBQ0UsTUFBYixNQUF3QixRQUF4QixJQUFvQ0YsS0FBSyxDQUFDRSxNQUExQyxJQUFvRCxJQUFuRTtBQUNBLFFBQU1DLE9BQU8sR0FBRyxzQ0FBaEI7O0FBRUEsUUFBSUYsTUFBSixFQUFZO0FBQ1YsVUFBSUcsWUFBWSxHQUFHSCxNQUFNLENBQUNJLFFBQVAsRUFBbkI7O0FBRUEsVUFBSUosTUFBTSxLQUFLRCxLQUFLLENBQUNNLGFBQXJCLEVBQW9DO0FBQ2xDLFlBQUlOLEtBQUssQ0FBQ08sTUFBTixLQUFpQkEsTUFBckIsRUFBNkI7QUFDM0IsZ0JBQU0sSUFBSUMsS0FBSiw2REFDa0NSLEtBQUssQ0FBQ1MsSUFEeEMsNkpBS01ULEtBQUssQ0FBQ1MsSUFMWixrR0FRSVQsS0FBSyxDQUFDUyxJQVJWLG1EQVVJVCxLQUFLLENBQUNTLElBVlYsa0hBY1NULEtBQUssQ0FBQ1MsSUFkZiwyREFBTjtBQW1CRDs7QUFFRCxZQUFNQyxRQUFRLEdBQUdWLEtBQUssQ0FBQ08sTUFBTixDQUFhRyxRQUE5QjtBQUNBLFlBQU1DLFNBQVMsR0FBR0MsSUFBSSxDQUFDQyxPQUFMLENBQWFILFFBQWIsQ0FBbEI7QUFDQSxZQUFNSSxHQUFHLEdBQUdGLElBQUksQ0FBQ0csT0FBTCxDQUFhTCxRQUFiLENBQVo7QUFDQSxZQUFNTSxTQUFTLEdBQUdKLElBQUksQ0FBQ0ssUUFBTCxDQUFjUCxRQUFkLEVBQXdCQyxTQUF4QixDQUFsQjtBQUNBLFlBQU1PLEtBQUssR0FBR04sSUFBSSxDQUFDTyxPQUFMLENBQWFQLElBQUksQ0FBQ1EsSUFBTCxDQUFVTixHQUFWLFlBQWtCRSxTQUFsQixjQUFiLENBQWQ7QUFFQSxhQUFLSyxJQUFMLEdBQVlILEtBQVo7QUFDQSxhQUFLUCxTQUFMLEdBQWlCLFVBQWpCO0FBQ0QsT0EvQkQsTUFnQ0ssSUFBSVIsT0FBTyxDQUFDbUIsSUFBUixDQUFhbEIsWUFBYixDQUFKLEVBQWdDO0FBQ25DLFlBQU1tQixNQUFNLEdBQUdwQixPQUFPLENBQUNxQixJQUFSLENBQWFwQixZQUFiLENBQWY7O0FBQ0EsWUFBTU8sVUFBUyxHQUFHWSxNQUFNLENBQUMsQ0FBRCxDQUFOLElBQWEsVUFBL0I7O0FBQ0EsWUFBTVQsSUFBRyxHQUFHRixJQUFJLENBQUNHLE9BQUwsQ0FBYVEsTUFBTSxDQUFDLENBQUQsQ0FBbkIsQ0FBWjs7QUFDQSxZQUFNRSxJQUFJLEdBQUdiLElBQUksQ0FBQ0ssUUFBTCxDQUFjTSxNQUFNLENBQUMsQ0FBRCxDQUFwQixFQUF5QlosVUFBekIsQ0FBYjs7QUFDQSxZQUFNTyxNQUFLLEdBQUdOLElBQUksQ0FBQ08sT0FBTCxDQUFhUCxJQUFJLENBQUNRLElBQUwsQ0FBVU4sSUFBVixZQUFrQlcsSUFBbEIsU0FBeUJkLFVBQXpCLEVBQWIsQ0FBZDs7QUFFQSxhQUFLVSxJQUFMLEdBQVlILE1BQVo7QUFDQSxhQUFLUCxTQUFMLEdBQWlCQSxVQUFqQjtBQUNEO0FBQ0YsS0E3Q0QsTUE4Q0s7QUFDSCxXQUFLVSxJQUFMLEdBQVksS0FBS1YsU0FBTCxHQUFpQixJQUE3QjtBQUNEO0FBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBYWtCO0FBQ2hCLGFBQU9lLEVBQUUsQ0FBQ0MsWUFBSCxDQUFnQkMsTUFBTSxDQUFDLEtBQUtQLElBQU4sQ0FBdEIsQ0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7OztnQ0FZcUI7QUFDbkIsVUFBSSxDQUFDLEtBQUtBLElBQVYsRUFBZ0I7QUFBRSxlQUFPLElBQVA7QUFBYzs7QUFFaEMsVUFBTVEsSUFBSSxHQUFHLEtBQUtDLGFBQUwsRUFBYjtBQUVBLGFBQU9ELElBQUksQ0FBQ3hCLFFBQUwsRUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7OztvQ0FZNEI7QUFDMUIsVUFBTTBCLE1BQU0sR0FBRyxLQUFLQyxPQUFMLEVBQWY7QUFDQSxVQUFNSCxJQUFJLEdBQUcsSUFBSUksVUFBSixDQUFlRixNQUFNLENBQUMxQixRQUFQLEVBQWYsQ0FBYjtBQUVBLGFBQU93QixJQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7OztTQVdLSyxNQUFNLENBQUNDLFc7d0JBQWU7QUFBRSxhQUFPLEtBQUtDLFdBQUwsQ0FBaUIzQixJQUF4QjtBQUE4QjtBQUUzRDs7Ozs7Ozs7Ozs7Ozs7U0FZWXlCLE1BQU0sQ0FBQ0MsVzt3QkFBZTtBQUFFLGFBQU8sS0FBSzFCLElBQVo7QUFBa0I7Ozs7OztlQUd6Q1YsYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGhhbmRsZXIsIGFuIGluc3RhbmNlIG9mIHdoaWNoIGlzIGNyZWF0ZWQgZm9yIGV2ZXJ5IGluc3RhbmNlIG9mIEdRTEJhc2UuXG4gKiBUaGUgaGFuZGxlciBtYW5hZ2VzIHRoZSBmZXRjaGluZyBhbmQgZGVjb2Rpbmcgb2YgZmlsZXMgYmVhcmluZyB0aGUgSURMXG4gKiBzY2hlbWEgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbGFzcyByZXByZXNlbnRlZCBieSB0aGlzIGluc3RhbmNlIG9mIEdRTEJhc2UuXG4gKlxuICogQGNsYXNzIElETEZpbGVIYW5kbGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBJRExGaWxlSGFuZGxlciB7XG4gIHBhdGg6ID9zdHJpbmc7XG5cbiAgZXh0ZW5zaW9uOiA/c3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSURMRmlsZUhhbmRsZXIgY2hlY2tzIHRoZSBTQ0hFTUEgdmFsdWUgcmV0dXJuZWQgYnkgdGhlIGNsYXNzIHR5cGVcbiAgICogb2YgdGhlIHN1cHBsaWVkIGluc3RhbmNlLiBJZiB0aGUgcmVzdWx0aW5nIHZhbHVlIGlzIGEgU3ltYm9sLCB0aGVuIHRoZVxuICAgKiBoYW5kbGVyJ3MgcmVzcG9uc2liaWxpdHkgaXMgdG8gZmluZCB0aGUgZmlsZSwgbG9hZCBpdCBmcm9tIGRpc2sgYW5kXG4gICAqIHByb3ZpZGUgdmFyaW91cyBtZWFucyBvZiB1c2luZyBpdHMgY29udGVudHM7IGkuZS4gYXMgYSBCdWZmZXIsIGEgU3RyaW5nXG4gICAqIG9yIHdyYXBwZWQgaW4gYSBTeW50YXhUcmVlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgSURMRmlsZUhhbmRsZXJcbiAgICogQG1ldGhvZCDijobioIBjb25zdHJ1Y3RvclxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgYSBmdW5jdGlvbiBvciBjbGFzcyBkZWZpbml0aW9uIHRoYXQgcHJlc3VtYWJseVxuICAgKiBleHRlbmRzIGZyb20gR1FMQmFzZSB3ZXJlIGl0IGFuIGluc3RhbmNlLlxuICAgKi9cbiAgY29uc3RydWN0b3IoQ2xhc3M6IEZ1bmN0aW9uKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGNvbnN0IHN5bWJvbCA9IHR5cGVvZiBDbGFzcy5TQ0hFTUEgPT09ICdzeW1ib2wnICYmIENsYXNzLlNDSEVNQSB8fCBudWxsO1xuICAgIGNvbnN0IHBhdHRlcm4gPSAvU3ltYm9sXFwoUGF0aCAoLio/KSBFeHRlbnNpb24gKC4qPylcXCkvO1xuXG4gICAgaWYgKHN5bWJvbCkge1xuICAgICAgbGV0IHN5bWJvbFN0cmluZyA9IHN5bWJvbC50b1N0cmluZygpO1xuXG4gICAgICBpZiAoc3ltYm9sID09PSBDbGFzcy5BREpBQ0VOVF9GSUxFKSB7XG4gICAgICAgIGlmIChDbGFzcy5tb2R1bGUgPT09IG1vZHVsZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICAgICAgICBUaGUgYSBzdGF0aWMgZ2V0dGVyIGZvciAnbW9kdWxlJyBvbiAke0NsYXNzLm5hbWV9IG11c3QgYmUgcHJlc2VudFxuICAgICAgICAgICAgdGhhdCByZXR1cm5zIHRoZSBtb2R1bGUgb2JqZWN0IHdoZXJlIHRoZSBDbGFzcyBpcyBkZWZpbmVkLiBUcnkgdGhlXG4gICAgICAgICAgICBmb2xsb3dpbmc6XG5cbiAgICAgICAgICAgIC8vIHlvdXIgJHtDbGFzcy5uYW1lfS5qcyBmaWxlXG4gICAgICAgICAgICBpbXBvcnQgeyBHUUxCYXNlIH0gZnJvbSAnZ3JhcGhxbC1sYXR0aWNlJ1xuXG4gICAgICAgICAgICBjb25zdCAke0NsYXNzLm5hbWV9TW9kdWxlID0gbW9kdWxlO1xuXG4gICAgICAgICAgICBjbGFzcyAke0NsYXNzLm5hbWV9IGV4dGVuZHMgR1FMQmFzZSB7XG4gICAgICAgICAgICAgIC4uLlxuXG4gICAgICAgICAgICAgIHN0YXRpYyBnZXQgbW9kdWxlKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAke0NsYXNzLm5hbWV9TW9kdWxlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gQ2xhc3MubW9kdWxlLmZpbGVuYW1lO1xuICAgICAgICBjb25zdCBleHRlbnNpb24gPSBQYXRoLmV4dG5hbWUoZmlsZW5hbWUpXG4gICAgICAgIGNvbnN0IGRpciA9IFBhdGguZGlybmFtZShmaWxlbmFtZSlcbiAgICAgICAgY29uc3QgZmlsZWZpeGVkID0gUGF0aC5iYXNlbmFtZShmaWxlbmFtZSwgZXh0ZW5zaW9uKVxuICAgICAgICBjb25zdCBidWlsZCA9IFBhdGgucmVzb2x2ZShQYXRoLmpvaW4oZGlyLCBgJHtmaWxlZml4ZWR9LmdyYXBocWxgKSlcblxuICAgICAgICB0aGlzLnBhdGggPSBidWlsZDtcbiAgICAgICAgdGhpcy5leHRlbnNpb24gPSAnLmdyYXBocWwnO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocGF0dGVybi50ZXN0KHN5bWJvbFN0cmluZykpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gcGF0dGVybi5leGVjKHN5bWJvbFN0cmluZyk7XG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IHBhcnNlZFsyXSB8fCAnLmdyYXBocWwnXG4gICAgICAgIGNvbnN0IGRpciA9IFBhdGguZGlybmFtZShwYXJzZWRbMV0pXG4gICAgICAgIGNvbnN0IGZpbGUgPSBQYXRoLmJhc2VuYW1lKHBhcnNlZFsxXSwgZXh0ZW5zaW9uKVxuICAgICAgICBjb25zdCBidWlsZCA9IFBhdGgucmVzb2x2ZShQYXRoLmpvaW4oZGlyLCBgJHtmaWxlfSR7ZXh0ZW5zaW9ufWApKVxuXG4gICAgICAgIHRoaXMucGF0aCA9IGJ1aWxkO1xuICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IGV4dGVuc2lvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnBhdGggPSB0aGlzLmV4dGVuc2lvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBjYWxjdWxhdGVkIGZpbGUgZGV0ZXJtaW5lZCBieSB0aGUgZGVjb2Rpbmcgb2YgdGhlIG1lYW5pbmcgb2ZcbiAgICogdGhlIFN5bWJvbCByZXR1cm5lZCBieSB0aGUgU0NIRU1BIHByb3BlcnR5IG9mIHRoZSBpbnN0YW5jZSBzdXBwbGllZCB0b1xuICAgKiB0aGUgSURMRmlsZUhhbmRsZXIgdXBvbiBjcmVhdGlvbi5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBJRExGaWxlSGFuZGxlclxuICAgKiBAbWV0aG9kIOKMvuKggGdldEZpbGVcbiAgICpcbiAgICogQHJldHVybiB7QnVmZmVyfG51bGx9IHJldHVybnMgdGhlIEJ1ZmZlciBjb250YWluaW5nIHRoZSBmaWxlIGJhc2UgSURMXG4gICAqIHNjaGVtYSBvciBudWxsIGlmIG5vbmUgd2FzIGZvdW5kIG9yIGEgZGlyZWN0IHN0cmluZyBzY2hlbWEgaXMgcmV0dXJuZWRcbiAgICogYnkgdGhlIFNDSEVNQSBwcm9wZXJ0eVxuICAgKi9cbiAgZ2V0RmlsZSgpOiBCdWZmZXIge1xuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoU3RyaW5nKHRoaXMucGF0aCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIGdldEZpbGUoKSByZXR1cm5zIGEgQnVmZmVyLCB0aGlzIGlzIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlXG4gICAqIHVuZGVybHlpbmcgZmlsZSBjb250ZW50cy4gQXMgYSBtZWFucyBvZiB2YWxpZGF0aW5nIHRoZSBjb250ZW50cyBvZiB0aGVcbiAgICogZmlsZSwgdGhlIHN0cmluZyBjb250ZW50cyBhcmUgcGFyc2VkIGludG8gYW4gQVNUIGFuZCBiYWNrIHRvIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIElETEZpbGVIYW5kbGVyXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0U2NoZW1hXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ3xudWxsfSB0aGUgc3RyaW5nIGNvbnRlbnRzIG9mIHRoZSBCdWZmZXIgY29udGFpbmluZyB0aGVcbiAgICogZmlsZSBiYXNlZCBJREwgc2NoZW1hLlxuICAgKi9cbiAgZ2V0U2NoZW1hKCk6ID9zdHJpbmcge1xuICAgIGlmICghdGhpcy5wYXRoKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBjb25zdCB0cmVlID0gdGhpcy5nZXRTeW50YXhUcmVlKCk7XG5cbiAgICByZXR1cm4gdHJlZS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIGdldEZpbGUoKSByZXR1cm5zIGEgQnVmZmVyLCB0aGUgc3RyaW5nIGNvbnRlbnRzIGFyZSBwYXNzZWQgdG8gYSBuZXdcbiAgICogaW5zdGFuY2Ugb2YgU3ludGF4VHJlZSB3aGljaCBwYXJzZXMgdGhpcyBpbnRvIGFuIEFTVCBmb3IgbWFuaXB1bGF0aW9uLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIElETEZpbGVIYW5kbGVyXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0U3ludGF4VHJlZVxuICAgKlxuICAgKiBAcmV0dXJuIHtTeW50YXhUcmVlfG51bGx9IGEgU3ludGF4VHJlZSBpbnN0YW5jZSBjb25zdHJ1Y3RlZCBmcm9tIHRoZSBJRExcbiAgICogc2NoZW1hIGNvbnRlbnRzIGxvYWRlZCBmcm9tIGRpc2suIE51bGwgaXMgcmV0dXJuZWQgaWYgYSBjYWxjdWxhdGVkIHBhdGhcbiAgICogY2Fubm90IGJlIGZvdW5kOyBhbHdheXMgb2NjdXJzIHdoZW4gU0NIRU1BIHJldHVybnMgYSBzdHJpbmcuXG4gICAqL1xuICBnZXRTeW50YXhUcmVlKCk6IFN5bnRheFRyZWUge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuZ2V0RmlsZSgpO1xuICAgIGNvbnN0IHRyZWUgPSBuZXcgU3ludGF4VHJlZShidWZmZXIudG9TdHJpbmcoKSk7XG5cbiAgICByZXR1cm4gdHJlZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgY29uc3RydWN0b3JgIG5hbWUuIElmIGludm9rZWQgYXMgdGhlIGNvbnRleHQsIG9yIGB0aGlzYCxcbiAgICogb2JqZWN0IG9mIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgT2JqZWN0YCdzIGBwcm90b3R5cGVgLCB0aGUgcmVzdWx0aW5nXG4gICAqIHZhbHVlIHdpbGwgYmUgYFtvYmplY3QgTXlDbGFzc11gLCBnaXZlbiBhbiBpbnN0YW5jZSBvZiBgTXlDbGFzc2BcbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBbU3ltYm9sLnRvU3RyaW5nVGFnXVxuICAgKiBAbWVtYmVyb2YgSURMRmlsZUhhbmRsZXJcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgY2xhc3MgdGhpcyBpcyBhbiBpbnN0YW5jZSBvZlxuICAgKiBAQ29tcHV0ZWRUeXBlXG4gICAqL1xuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7IHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzYW1lIGxvZ2ljIGFzIHtAbGluayAjW1N5bWJvbC50b1N0cmluZ1RhZ119IGJ1dCBvbiBhIHN0YXRpY1xuICAgKiBzY2FsZS4gU28sIGlmIHlvdSBwZXJmb3JtIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoTXlDbGFzcylgXG4gICAqIHRoZSByZXN1bHQgd291bGQgYmUgYFtvYmplY3QgTXlDbGFzc11gLlxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggFtTeW1ib2wudG9TdHJpbmdUYWddXG4gICAqIEBtZW1iZXJvZiBJRExGaWxlSGFuZGxlclxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIG5hbWUgb2YgdGhpcyBjbGFzc1xuICAgKiBAQ29tcHV0ZWRUeXBlXG4gICAqL1xuICBzdGF0aWMgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSURMRmlsZUhhbmRsZXIiXX0=