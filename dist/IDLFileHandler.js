"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.IDLFileHandler = void 0;

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
var IDLFileHandler = /*#__PURE__*/function (_Symbol$toStringTag, _Symbol$toStringTag2) {
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
    (0, _classCallCheck2["default"])(this, IDLFileHandler);
    // $FlowFixMe
    var symbol = (0, _typeof2["default"])(Class.SCHEMA) === 'symbol' && Class.SCHEMA || null;
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


  (0, _createClass2["default"])(IDLFileHandler, [{
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
    key: _Symbol$toStringTag,
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
    key: _Symbol$toStringTag2,
    get: function get() {
      return this.name;
    }
  }]);
  return IDLFileHandler;
}(Symbol.toStringTag, Symbol.toStringTag);

exports.IDLFileHandler = IDLFileHandler;
var _default = IDLFileHandler;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9JRExGaWxlSGFuZGxlci5qcyJdLCJuYW1lcyI6WyJJRExGaWxlSGFuZGxlciIsIkNsYXNzIiwic3ltYm9sIiwiU0NIRU1BIiwicGF0dGVybiIsInN5bWJvbFN0cmluZyIsInRvU3RyaW5nIiwiQURKQUNFTlRfRklMRSIsIm1vZHVsZSIsIkVycm9yIiwibmFtZSIsImZpbGVuYW1lIiwiZXh0ZW5zaW9uIiwiUGF0aCIsImV4dG5hbWUiLCJkaXIiLCJkaXJuYW1lIiwiZmlsZWZpeGVkIiwiYmFzZW5hbWUiLCJidWlsZCIsInJlc29sdmUiLCJqb2luIiwicGF0aCIsInRlc3QiLCJwYXJzZWQiLCJleGVjIiwiZmlsZSIsImZzIiwicmVhZEZpbGVTeW5jIiwiU3RyaW5nIiwidHJlZSIsImdldFN5bnRheFRyZWUiLCJidWZmZXIiLCJnZXRGaWxlIiwiU3ludGF4VHJlZSIsImNvbnN0cnVjdG9yIiwiU3ltYm9sIiwidG9TdHJpbmdUYWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ2FBLGM7QUFLWDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0UsMEJBQVlDLEtBQVosRUFBNkI7QUFBQTtBQUMzQjtBQUNBLFFBQU1DLE1BQU0sR0FBRyx5QkFBT0QsS0FBSyxDQUFDRSxNQUFiLE1BQXdCLFFBQXhCLElBQW9DRixLQUFLLENBQUNFLE1BQTFDLElBQW9ELElBQW5FO0FBQ0EsUUFBTUMsT0FBTyxHQUFHLHNDQUFoQjs7QUFFQSxRQUFJRixNQUFKLEVBQVk7QUFDVixVQUFJRyxZQUFZLEdBQUdILE1BQU0sQ0FBQ0ksUUFBUCxFQUFuQjs7QUFFQSxVQUFJSixNQUFNLEtBQUtELEtBQUssQ0FBQ00sYUFBckIsRUFBb0M7QUFDbEMsWUFBSU4sS0FBSyxDQUFDTyxNQUFOLEtBQWlCQSxNQUFyQixFQUE2QjtBQUMz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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7U0FDRSxlQUFrQztBQUFFLGFBQU8sS0FBS0EsSUFBWjtBQUFrQjs7O0VBZGpEMEIsTUFBTSxDQUFDQyxXLEVBY0FELE1BQU0sQ0FBQ0MsVzs7O2VBR05yQyxjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgaGFuZGxlciwgYW4gaW5zdGFuY2Ugb2Ygd2hpY2ggaXMgY3JlYXRlZCBmb3IgZXZlcnkgaW5zdGFuY2Ugb2YgR1FMQmFzZS5cbiAqIFRoZSBoYW5kbGVyIG1hbmFnZXMgdGhlIGZldGNoaW5nIGFuZCBkZWNvZGluZyBvZiBmaWxlcyBiZWFyaW5nIHRoZSBJRExcbiAqIHNjaGVtYSBhc3NvY2lhdGVkIHdpdGggdGhlIGNsYXNzIHJlcHJlc2VudGVkIGJ5IHRoaXMgaW5zdGFuY2Ugb2YgR1FMQmFzZS5cbiAqXG4gKiBAY2xhc3MgSURMRmlsZUhhbmRsZXJcbiAqL1xuZXhwb3J0IGNsYXNzIElETEZpbGVIYW5kbGVyIHtcbiAgcGF0aDogP3N0cmluZztcblxuICBleHRlbnNpb246ID9zdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJRExGaWxlSGFuZGxlciBjaGVja3MgdGhlIFNDSEVNQSB2YWx1ZSByZXR1cm5lZCBieSB0aGUgY2xhc3MgdHlwZVxuICAgKiBvZiB0aGUgc3VwcGxpZWQgaW5zdGFuY2UuIElmIHRoZSByZXN1bHRpbmcgdmFsdWUgaXMgYSBTeW1ib2wsIHRoZW4gdGhlXG4gICAqIGhhbmRsZXIncyByZXNwb25zaWJpbGl0eSBpcyB0byBmaW5kIHRoZSBmaWxlLCBsb2FkIGl0IGZyb20gZGlzayBhbmRcbiAgICogcHJvdmlkZSB2YXJpb3VzIG1lYW5zIG9mIHVzaW5nIGl0cyBjb250ZW50czsgaS5lLiBhcyBhIEJ1ZmZlciwgYSBTdHJpbmdcbiAgICogb3Igd3JhcHBlZCBpbiBhIFN5bnRheFRyZWUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBJRExGaWxlSGFuZGxlclxuICAgKiBAbWV0aG9kIOKOhuKggGNvbnN0cnVjdG9yXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyBhIGZ1bmN0aW9uIG9yIGNsYXNzIGRlZmluaXRpb24gdGhhdCBwcmVzdW1hYmx5XG4gICAqIGV4dGVuZHMgZnJvbSBHUUxCYXNlIHdlcmUgaXQgYW4gaW5zdGFuY2UuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihDbGFzczogRnVuY3Rpb24pIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgY29uc3Qgc3ltYm9sID0gdHlwZW9mIENsYXNzLlNDSEVNQSA9PT0gJ3N5bWJvbCcgJiYgQ2xhc3MuU0NIRU1BIHx8IG51bGw7XG4gICAgY29uc3QgcGF0dGVybiA9IC9TeW1ib2xcXChQYXRoICguKj8pIEV4dGVuc2lvbiAoLio/KVxcKS87XG5cbiAgICBpZiAoc3ltYm9sKSB7XG4gICAgICBsZXQgc3ltYm9sU3RyaW5nID0gc3ltYm9sLnRvU3RyaW5nKCk7XG5cbiAgICAgIGlmIChzeW1ib2wgPT09IENsYXNzLkFESkFDRU5UX0ZJTEUpIHtcbiAgICAgICAgaWYgKENsYXNzLm1vZHVsZSA9PT0gbW9kdWxlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgICAgICAgIFRoZSBhIHN0YXRpYyBnZXR0ZXIgZm9yICdtb2R1bGUnIG9uICR7Q2xhc3MubmFtZX0gbXVzdCBiZSBwcmVzZW50XG4gICAgICAgICAgICB0aGF0IHJldHVybnMgdGhlIG1vZHVsZSBvYmplY3Qgd2hlcmUgdGhlIENsYXNzIGlzIGRlZmluZWQuIFRyeSB0aGVcbiAgICAgICAgICAgIGZvbGxvd2luZzpcblxuICAgICAgICAgICAgLy8geW91ciAke0NsYXNzLm5hbWV9LmpzIGZpbGVcbiAgICAgICAgICAgIGltcG9ydCB7IEdRTEJhc2UgfSBmcm9tICdncmFwaHFsLWxhdHRpY2UnXG5cbiAgICAgICAgICAgIGNvbnN0ICR7Q2xhc3MubmFtZX1Nb2R1bGUgPSBtb2R1bGU7XG5cbiAgICAgICAgICAgIGNsYXNzICR7Q2xhc3MubmFtZX0gZXh0ZW5kcyBHUUxCYXNlIHtcbiAgICAgICAgICAgICAgLi4uXG5cbiAgICAgICAgICAgICAgc3RhdGljIGdldCBtb2R1bGUoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICR7Q2xhc3MubmFtZX1Nb2R1bGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBDbGFzcy5tb2R1bGUuZmlsZW5hbWU7XG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IFBhdGguZXh0bmFtZShmaWxlbmFtZSlcbiAgICAgICAgY29uc3QgZGlyID0gUGF0aC5kaXJuYW1lKGZpbGVuYW1lKVxuICAgICAgICBjb25zdCBmaWxlZml4ZWQgPSBQYXRoLmJhc2VuYW1lKGZpbGVuYW1lLCBleHRlbnNpb24pXG4gICAgICAgIGNvbnN0IGJ1aWxkID0gUGF0aC5yZXNvbHZlKFBhdGguam9pbihkaXIsIGAke2ZpbGVmaXhlZH0uZ3JhcGhxbGApKVxuXG4gICAgICAgIHRoaXMucGF0aCA9IGJ1aWxkO1xuICAgICAgICB0aGlzLmV4dGVuc2lvbiA9ICcuZ3JhcGhxbCc7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwYXR0ZXJuLnRlc3Qoc3ltYm9sU3RyaW5nKSkge1xuICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXR0ZXJuLmV4ZWMoc3ltYm9sU3RyaW5nKTtcbiAgICAgICAgY29uc3QgZXh0ZW5zaW9uID0gcGFyc2VkWzJdIHx8ICcuZ3JhcGhxbCdcbiAgICAgICAgY29uc3QgZGlyID0gUGF0aC5kaXJuYW1lKHBhcnNlZFsxXSlcbiAgICAgICAgY29uc3QgZmlsZSA9IFBhdGguYmFzZW5hbWUocGFyc2VkWzFdLCBleHRlbnNpb24pXG4gICAgICAgIGNvbnN0IGJ1aWxkID0gUGF0aC5yZXNvbHZlKFBhdGguam9pbihkaXIsIGAke2ZpbGV9JHtleHRlbnNpb259YCkpXG5cbiAgICAgICAgdGhpcy5wYXRoID0gYnVpbGQ7XG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uID0gZXh0ZW5zaW9uO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMucGF0aCA9IHRoaXMuZXh0ZW5zaW9uID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgdGhlIGNhbGN1bGF0ZWQgZmlsZSBkZXRlcm1pbmVkIGJ5IHRoZSBkZWNvZGluZyBvZiB0aGUgbWVhbmluZyBvZlxuICAgKiB0aGUgU3ltYm9sIHJldHVybmVkIGJ5IHRoZSBTQ0hFTUEgcHJvcGVydHkgb2YgdGhlIGluc3RhbmNlIHN1cHBsaWVkIHRvXG4gICAqIHRoZSBJRExGaWxlSGFuZGxlciB1cG9uIGNyZWF0aW9uLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIElETEZpbGVIYW5kbGVyXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0RmlsZVxuICAgKlxuICAgKiBAcmV0dXJuIHtCdWZmZXJ8bnVsbH0gcmV0dXJucyB0aGUgQnVmZmVyIGNvbnRhaW5pbmcgdGhlIGZpbGUgYmFzZSBJRExcbiAgICogc2NoZW1hIG9yIG51bGwgaWYgbm9uZSB3YXMgZm91bmQgb3IgYSBkaXJlY3Qgc3RyaW5nIHNjaGVtYSBpcyByZXR1cm5lZFxuICAgKiBieSB0aGUgU0NIRU1BIHByb3BlcnR5XG4gICAqL1xuICBnZXRGaWxlKCk6IEJ1ZmZlciB7XG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhTdHJpbmcodGhpcy5wYXRoKSk7XG4gIH1cblxuICAvKipcbiAgICogSWYgZ2V0RmlsZSgpIHJldHVybnMgYSBCdWZmZXIsIHRoaXMgaXMgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAgICogdW5kZXJseWluZyBmaWxlIGNvbnRlbnRzLiBBcyBhIG1lYW5zIG9mIHZhbGlkYXRpbmcgdGhlIGNvbnRlbnRzIG9mIHRoZVxuICAgKiBmaWxlLCB0aGUgc3RyaW5nIGNvbnRlbnRzIGFyZSBwYXJzZWQgaW50byBhbiBBU1QgYW5kIGJhY2sgdG8gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgSURMRmlsZUhhbmRsZXJcbiAgICogQG1ldGhvZCDijL7ioIBnZXRTY2hlbWFcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfG51bGx9IHRoZSBzdHJpbmcgY29udGVudHMgb2YgdGhlIEJ1ZmZlciBjb250YWluaW5nIHRoZVxuICAgKiBmaWxlIGJhc2VkIElETCBzY2hlbWEuXG4gICAqL1xuICBnZXRTY2hlbWEoKTogP3N0cmluZyB7XG4gICAgaWYgKCF0aGlzLnBhdGgpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIGNvbnN0IHRyZWUgPSB0aGlzLmdldFN5bnRheFRyZWUoKTtcblxuICAgIHJldHVybiB0cmVlLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogSWYgZ2V0RmlsZSgpIHJldHVybnMgYSBCdWZmZXIsIHRoZSBzdHJpbmcgY29udGVudHMgYXJlIHBhc3NlZCB0byBhIG5ld1xuICAgKiBpbnN0YW5jZSBvZiBTeW50YXhUcmVlIHdoaWNoIHBhcnNlcyB0aGlzIGludG8gYW4gQVNUIGZvciBtYW5pcHVsYXRpb24uXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgSURMRmlsZUhhbmRsZXJcbiAgICogQG1ldGhvZCDijL7ioIBnZXRTeW50YXhUcmVlXG4gICAqXG4gICAqIEByZXR1cm4ge1N5bnRheFRyZWV8bnVsbH0gYSBTeW50YXhUcmVlIGluc3RhbmNlIGNvbnN0cnVjdGVkIGZyb20gdGhlIElETFxuICAgKiBzY2hlbWEgY29udGVudHMgbG9hZGVkIGZyb20gZGlzay4gTnVsbCBpcyByZXR1cm5lZCBpZiBhIGNhbGN1bGF0ZWQgcGF0aFxuICAgKiBjYW5ub3QgYmUgZm91bmQ7IGFsd2F5cyBvY2N1cnMgd2hlbiBTQ0hFTUEgcmV0dXJucyBhIHN0cmluZy5cbiAgICovXG4gIGdldFN5bnRheFRyZWUoKTogU3ludGF4VHJlZSB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5nZXRGaWxlKCk7XG4gICAgY29uc3QgdHJlZSA9IG5ldyBTeW50YXhUcmVlKGJ1ZmZlci50b1N0cmluZygpKTtcblxuICAgIHJldHVybiB0cmVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBjb25zdHJ1Y3RvcmAgbmFtZS4gSWYgaW52b2tlZCBhcyB0aGUgY29udGV4dCwgb3IgYHRoaXNgLFxuICAgKiBvYmplY3Qgb2YgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBPYmplY3RgJ3MgYHByb3RvdHlwZWAsIHRoZSByZXN1bHRpbmdcbiAgICogdmFsdWUgd2lsbCBiZSBgW29iamVjdCBNeUNsYXNzXWAsIGdpdmVuIGFuIGluc3RhbmNlIG9mIGBNeUNsYXNzYFxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggFtTeW1ib2wudG9TdHJpbmdUYWddXG4gICAqIEBtZW1iZXJvZiBJRExGaWxlSGFuZGxlclxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0aGlzIGlzIGFuIGluc3RhbmNlIG9mXG4gICAqIEBDb21wdXRlZFR5cGVcbiAgICovXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHsgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHNhbWUgbG9naWMgYXMge0BsaW5rICNbU3ltYm9sLnRvU3RyaW5nVGFnXX0gYnV0IG9uIGEgc3RhdGljXG4gICAqIHNjYWxlLiBTbywgaWYgeW91IHBlcmZvcm0gYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChNeUNsYXNzKWBcbiAgICogdGhlIHJlc3VsdCB3b3VsZCBiZSBgW29iamVjdCBNeUNsYXNzXWAuXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAW1N5bWJvbC50b1N0cmluZ1RhZ11cbiAgICogQG1lbWJlcm9mIElETEZpbGVIYW5kbGVyXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGlzIGNsYXNzXG4gICAqIEBDb21wdXRlZFR5cGVcbiAgICovXG4gIHN0YXRpYyBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7IHJldHVybiB0aGlzLm5hbWUgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJRExGaWxlSGFuZGxlciJdfQ==