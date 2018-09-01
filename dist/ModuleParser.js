"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ModuleParser = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.array.sort");

var _fs = _interopRequireWildcard(require("fs"));

var _path = _interopRequireDefault(require("path"));

var types = _interopRequireWildcard(require("ne-types"));

var _GQLBase = require("./GQLBase");

var _GQLJSON = require("./types/GQLJSON");

var _lodash = require("lodash");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Promisify some bits
const readdirAsync = (0, _utils.promisify)(_fs.default.readdir);
const statAsync = (0, _utils.promisify)(_fs.default.stat); // Fetch some type checking bits from 'types'

const {
  typeOf,
  isString,
  isOfType,
  isPrimitive,
  isArray,
  isObject,
  extendsFrom
} = types;
/**
 * The ModuleParser is a utility class designed to loop through and iterate
 * on a directory and pull out of each .js file found, any classes or exports
 * that extend from GQLBase or a child of GQLBase.
 *
 * @class ModuleParser
 * @since 2.7.0
 */

var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$toStringTag2 = Symbol.toStringTag;

class ModuleParser {
  /**
   * An internal array of `GQLBase` extended classes found during either a
   * `parse()` or `parseSync()` call.
   *
   * @memberof ModuleParser
   * @type {Array<GQLBase>}
   */

  /**
   * An array of strings holding loose GraphQL schema documents.
   *
   * @memberof ModuleParser
   * @type {Array<string>}
   */

  /**
   * A map of skipped items on the last pass and the associated error that
   * accompanies it.
   */

  /**
   * A string denoting the directory on disk where `ModuleParser` should be
   * searching for its classes.
   *
   * @memberof ModuleParser
   * @type {string}
   */

  /**
   * A boolean value denoting whether or not the `ModuleParser` instance is
   * valid; i.e. the directory it points to actually exists and is a directory
   *
   * @type {boolean}
   */

  /**
   * An object, optionally added during construction, that specifies some
   * configuration about the ModuleParser and how it should do its job.
   *
   * Initially, the
   *
   * @type {Object}
   */

  /**
   * The constructor
   *
   * @constructor
   * @method ⎆⠀constructor
   * @memberof ModuleParser
   * @inner
   *
   * @param {string} directory a string path to a directory containing the
   * various GQLBase extended classes that should be gathered.
   */
  constructor(directory, options = {
    addLatticeTypes: true
  }) {
    _defineProperty(this, "classes", void 0);

    _defineProperty(this, "looseGraphQL", []);

    _defineProperty(this, "skipped", void 0);

    _defineProperty(this, "directory", void 0);

    _defineProperty(this, "valid", void 0);

    _defineProperty(this, "options", {});

    this.directory = _path.default.resolve(directory);
    this.classes = [];
    this.skipped = new Map();
    (0, _lodash.merge)(this.options, options);

    try {
      this.valid = _fs.default.statSync(directory).isDirectory();
    } catch (error) {
      this.valid = false;
    }
  }
  /**
   * Given a file path, this method will attempt to import/require the
   * file in question and return the object it exported; whatever that
   * may be.
   *
   * @method ModuleParser#⌾⠀importClass
   * @since 2.7.0
   *
   * @param {string} filePath a path to pass to `require()`
   *
   * @return {Object} the object, or undefined, that was returned when
   * it was `require()`'ed.
   */


  importClass(filePath) {
    let moduleContents = {};
    let yellow = '\x1b[33m';
    let clear = '\x1b[0m';

    try {
      moduleContents = require(filePath);
    } catch (ignore) {
      if (/\.graphql/i.test(_path.default.extname(filePath))) {
        _utils.LatticeLogs.log(`Ingesting .graphql file ${filePath}`);

        let buffer = _fs.default.readFileSync(filePath);

        this.looseGraphQL.push(_fs.default.readFileSync(filePath).toString());
      } else {
        _utils.LatticeLogs.log(`${yellow}Skipping${clear} ${filePath}`);

        _utils.LatticeLogs.trace(ignore);

        this.skipped.set(filePath, ignore);
      }
    }

    return moduleContents;
  }
  /**
   * Given an object, typically the result of a `require()` or `import`
   * command, iterate over its contents and find any `GQLBase` derived
   * exports. Continually, and recursively, build this list of classes out
   * so that we can add them to a `GQLExpressMiddleware`.
   *
   * @method ModuleParser#⌾⠀findGQLBaseClasses
   * @since 2.7.0
   *
   * @param {Object} contents the object to parse for properties extending
   * from `GQLBase`
   * @param {Array<GQLBase>} gqlDefinitions the results, allowed as a second
   * parameter during recursion as a means to save state between calls
   * @return {Set<mixed>} a unique set of values that are currently being
   * iterated over. Passed in as a third parameter to save state between calls
   * during recursion.
   */


  findGQLBaseClasses(contents, gqlDefinitions = [], stack = new Set()) {
    // In order to prevent infinite object recursion, we should add the
    // object being iterated over to our Set. At each new recursive level
    // add the item being iterated over to the set and only recurse into
    // if the item does not already exist in the stack itself.
    stack.add(contents);

    for (let key in contents) {
      let value = contents[key];

      if (isPrimitive(value)) {
        continue;
      }

      if (extendsFrom(value, _GQLBase.GQLBase)) {
        gqlDefinitions.push(value);
      }

      if ((isObject(value) || isArray(value)) && !stack.has(value)) {
        gqlDefinitions = this.findGQLBaseClasses(value, gqlDefinitions, stack);
      }
    } // We remove the current iterable from our set as we leave this current
    // recursive iteration.


    stack.delete(contents);
    return gqlDefinitions;
  }
  /**
   * This method takes a instance of ModuleParser, initialized with a directory,
   * and walks its contents, importing files as they are found, and sorting
   * any exports that extend from GQLBase into an array of such classes
   * in a resolved promise.
   *
   * @method ModuleParser#⌾⠀parse
   * @async
   * @since 2.7.0
   *
   * @return {Promise<Array<GQLBase>>} an array GQLBase classes, or an empty
   * array if none could be identified.
   */


  async parse() {
    let modules;
    let files;
    let set = new Set();
    let opts = (0, _utils.getLatticePrefs)();

    if (!this.valid) {
      throw new Error(`
        ModuleParser instance is invalid for use with ${this.directory}.
        The path is either a non-existent path or it does not represent a
        directory.
      `);
    }

    this.skipped.clear(); // @ComputedType

    files = await this.constructor.walk(this.directory);
    modules = files.map(file => this.importClass(file)) // @ComputedType
    (modules.map(mod => this.findGQLBaseClasses(mod)).reduce((last, cur) => (last || []).concat(cur || []), []).forEach(Class => set.add(Class))); // Convert the set back into an array

    this.classes = Array.from(set); // We can ignore equality since we came from a set; @ComputedType

    this.classes.sort((l, r) => l.name < r.name ? -1 : 1); // Add in any GraphQL Lattice types requested

    if (this.options.addLatticeTypes) {
      this.classes.push(_GQLJSON.GQLJSON);
    } // Stop flow and throw an error if some files failed to load and settings
    // declare we should do so. After Lattice 3.x we should expect this to be
    // the new default


    if (opts.ModuleParser.failOnError && this.skipped.size) {
      this.printSkipped();
      throw new Error('Some files skipped due to errors');
    }

    return this.classes;
  }
  /**
   * This method takes a instance of ModuleParser, initialized with a directory,
   * and walks its contents, importing files as they are found, and sorting
   * any exports that extend from GQLBase into an array of such classes
   *
   * @method ModuleParser#⌾⠀parseSync
   * @async
   * @since 2.7.0
   *
   * @return {Array<GQLBase>} an array GQLBase classes, or an empty
   * array if none could be identified.
   */


  parseSync() {
    let modules;
    let files;
    let set = new Set();
    let opts = (0, _utils.getLatticePrefs)();

    if (!this.valid) {
      throw new Error(`
        ModuleParser instance is invalid for use with ${this.directory}.
        The path is either a non-existent path or it does not represent a
        directory.
      `);
    }

    this.skipped.clear();
    files = this.constructor.walkSync(this.directory);
    modules = files.map(file => {
      return this.importClass(file);
    });
    modules.map(mod => this.findGQLBaseClasses(mod)).reduce((last, cur) => (last || []).concat(cur || []), []).forEach(Class => set.add(Class)); // Convert the set back into an array

    this.classes = Array.from(set); // We can ignore equality since we came from a set; @ComputedType

    this.classes.sort((l, r) => l.name < r.name ? -1 : 1); // Add in any GraphQL Lattice types requested

    if (this.options.addLatticeTypes) {
      this.classes.push(_GQLJSON.GQLJSON);
    } // Stop flow and throw an error if some files failed to load and settings
    // declare we should do so. After Lattice 3.x we should expect this to be
    // the new default


    if (opts.ModuleParser.failOnError && this.skipped.size) {
      this.printSkipped();
      throw new Error('Some files skipped due to errors');
    }

    return this.classes;
  }
  /**
   * Prints the list of skipped files, their stack traces, and the errors
   * denoting the reasons the files were skipped.
   */


  printSkipped() {
    if (this.skipped.size) {
      _utils.LatticeLogs.outWrite('\x1b[1;91m');

      _utils.LatticeLogs.outWrite('Skipped\x1b[0;31m the following files\n');

      for (let [key, value] of this.skipped) {
        _utils.LatticeLogs.log(`${_path.default.basename(key)}: ${value.message}`);

        if (value.stack) _utils.LatticeLogs.log(value.stack.replace(/(^)/m, '$1  '));
      }

      _utils.LatticeLogs.outWrite('\x1b[0m');
    } else {
      _utils.LatticeLogs.log('\x1b[1;32mNo files skipped\x1b[0m');
    }
  }
  /**
   * Returns the `constructor` name. If invoked as the context, or `this`,
   * object of the `toString` method of `Object`'s `prototype`, the resulting
   * value will be `[object MyClass]`, given an instance of `MyClass`
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof ModuleParser
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
   * @memberof ModuleParser
   * @static
   *
   * @return {string} the name of this class
   * @ComputedType
   */


  static get [_Symbol$toStringTag2]() {
    return this.name;
  }
  /**
   * Recursively walks a directory and returns an array of asbolute file paths
   * to the files under the specified directory.
   *
   * @method ModuleParser~⌾⠀walk
   * @async
   * @since 2.7.0
   *
   * @param {string} dir string path to the top level directory to parse
   * @param {Array<string>} filelist an array of existing absolute file paths,
   * or if not parameter is supplied a default empty array will be used.
   * @return {Promise<Array<string>>} an array of existing absolute file paths
   * found under the supplied `dir` directory.
   */


  static async walk(dir, filelist = [], extensions = ['.js', '.jsx', '.ts', '.tsx']) {
    let files = await readdirAsync(dir);
    let exts = ModuleParser.checkForPackageExtensions() || extensions;
    let pattern = ModuleParser.arrayToPattern(exts);
    let stats;
    files = files.map(file => _path.default.resolve(_path.default.join(dir, file)));

    for (let file of files) {
      stats = await statAsync(file);

      if (stats.isDirectory()) {
        filelist = await this.walk(file, filelist);
      } else {
        if (pattern.test(_path.default.extname(file))) filelist = filelist.concat(file);
      }
    }

    return filelist;
  }
  /**
   * Recursively walks a directory and returns an array of asbolute file paths
   * to the files under the specified directory. This version does this in a
   * synchronous fashion.
   *
   * @method ModuleParser~⌾⠀walkSync
   * @async
   * @since 2.7.0
   *
   * @param {string} dir string path to the top level directory to parse
   * @param {Array<string>} filelist an array of existing absolute file paths,
   * or if not parameter is supplied a default empty array will be used.
   * @return {Array<string>} an array of existing absolute file paths found
   * under the supplied `dir` directory.
   */


  static walkSync(dir, filelist = [], extensions = ['.js', '.jsx', '.ts', '.tsx']) {
    let files = (0, _fs.readdirSync)(dir);
    let exts = ModuleParser.checkForPackageExtensions() || extensions;
    let pattern = ModuleParser.arrayToPattern(exts);
    let stats;
    files = files.map(file => _path.default.resolve(_path.default.join(dir, file)));

    for (let file of files) {
      stats = (0, _fs.statSync)(file);

      if (stats.isDirectory()) {
        filelist = this.walkSync(file, filelist);
      } else {
        if (pattern.test(_path.default.extname(file))) filelist = filelist.concat(file);
      }
    }

    return filelist;
  }
  /**
   * The ModuleParser should only parse files that match the default or
   * supplied file extensions. The default list contains .js, .jsx, .ts
   * and .tsx; so JavaScript or TypeScript files and their JSX React
   * counterparts
   *
   * Since the list is customizable for a usage, however, it makes sense
   * to have a function that will match what is supplied rather than
   * creating a constant expression to use instead.
   *
   * @static
   * @memberof ModuleParser
   * @function ⌾⠀arrayToPattern
   * @since 2.13.0
   *
   * @param {Array<string>} extensions an array of extensions to
   * convert to a regular expression that would pass for each
   * @param {string} flags the value passed to a new RegExp denoting the
   * flags used in the pattern; defaults to 'i' for case insensitivity
   * @return {RegExp} a regular expression object matching the contents
   * of the array of extensions or the default extensions and that will
   * also match those values in a case insensitive manner
   */


  static arrayToPattern(extensions = ['.js', '.jsx', '.ts', '.tsx'], flags = 'i') {
    return new RegExp(extensions.join('|').replace(/\./g, '\\.').replace(/([\|$])/g, '\\b$1'), flags);
  }
  /**
   * Using the module `read-pkg-up`, finds the nearest package.json file
   * and checks to see if it has a `.lattice.moduleParser.extensions'
   * preference. If so, if the value is an array, that value is used,
   * otherwise the value is wrapped in an array. If the optional parameter
   * `toString` is `true` then `.toString()` will be invoked on any non
   * Array values found; this behavior is the default
   *
   * @static
   * @memberof ModuleParser
   * @method ⌾⠀checkForPackageExtensions
   * @since 2.13.0
   *
   * @param {boolean} toString true if any non-array values should have
   * their `.toString()` method invoked before being wrapped in an Array;
   * defaults to true
   * @return {?Array<string>} null if no value is set for the property
   * `lattice.ModuleParser.extensions` in `package.json` or the value
   * of the setting if it is an array. Finally if the value is set but is
   * not an array, the specified value wrapped in an array is returned
   */


  static checkForPackageExtensions(toString = true) {
    let pkg = (0, _utils.getLatticePrefs)();
    let extensions = null;

    if (pkg.ModuleParser && pkg.ModuleParser.extensions) {
      let packageExts = pkg.ModuleParser.extensions;

      if (Array.isArray(packageExts)) {
        extensions = packageExts;
      } else {
        extensions = [toString ? packageExts.toString() : packageExts];
      }
    }

    return extensions;
  }

}

exports.ModuleParser = ModuleParser;
var _default = ModuleParser;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9Nb2R1bGVQYXJzZXIuanMiXSwibmFtZXMiOlsicmVhZGRpckFzeW5jIiwiZnMiLCJyZWFkZGlyIiwic3RhdEFzeW5jIiwic3RhdCIsInR5cGVPZiIsImlzU3RyaW5nIiwiaXNPZlR5cGUiLCJpc1ByaW1pdGl2ZSIsImlzQXJyYXkiLCJpc09iamVjdCIsImV4dGVuZHNGcm9tIiwidHlwZXMiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsIk1vZHVsZVBhcnNlciIsImNvbnN0cnVjdG9yIiwiZGlyZWN0b3J5Iiwib3B0aW9ucyIsImFkZExhdHRpY2VUeXBlcyIsInBhdGgiLCJyZXNvbHZlIiwiY2xhc3NlcyIsInNraXBwZWQiLCJNYXAiLCJ2YWxpZCIsInN0YXRTeW5jIiwiaXNEaXJlY3RvcnkiLCJlcnJvciIsImltcG9ydENsYXNzIiwiZmlsZVBhdGgiLCJtb2R1bGVDb250ZW50cyIsInllbGxvdyIsImNsZWFyIiwicmVxdWlyZSIsImlnbm9yZSIsInRlc3QiLCJleHRuYW1lIiwibGwiLCJsb2ciLCJidWZmZXIiLCJyZWFkRmlsZVN5bmMiLCJsb29zZUdyYXBoUUwiLCJwdXNoIiwidG9TdHJpbmciLCJ0cmFjZSIsInNldCIsImZpbmRHUUxCYXNlQ2xhc3NlcyIsImNvbnRlbnRzIiwiZ3FsRGVmaW5pdGlvbnMiLCJzdGFjayIsIlNldCIsImFkZCIsImtleSIsInZhbHVlIiwiR1FMQmFzZSIsImhhcyIsImRlbGV0ZSIsInBhcnNlIiwibW9kdWxlcyIsImZpbGVzIiwib3B0cyIsIkVycm9yIiwid2FsayIsIm1hcCIsImZpbGUiLCJtb2QiLCJyZWR1Y2UiLCJsYXN0IiwiY3VyIiwiY29uY2F0IiwiZm9yRWFjaCIsIkNsYXNzIiwiQXJyYXkiLCJmcm9tIiwic29ydCIsImwiLCJyIiwibmFtZSIsIkdRTEpTT04iLCJmYWlsT25FcnJvciIsInNpemUiLCJwcmludFNraXBwZWQiLCJwYXJzZVN5bmMiLCJ3YWxrU3luYyIsIm91dFdyaXRlIiwiYmFzZW5hbWUiLCJtZXNzYWdlIiwicmVwbGFjZSIsImRpciIsImZpbGVsaXN0IiwiZXh0ZW5zaW9ucyIsImV4dHMiLCJjaGVja0ZvclBhY2thZ2VFeHRlbnNpb25zIiwicGF0dGVybiIsImFycmF5VG9QYXR0ZXJuIiwic3RhdHMiLCJqb2luIiwiZmxhZ3MiLCJSZWdFeHAiLCJwa2ciLCJwYWNrYWdlRXh0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFPQTtBQUNBLE1BQU1BLFlBQVksR0FBRyxzQkFBVUMsWUFBR0MsT0FBYixDQUFyQjtBQUNBLE1BQU1DLFNBQVMsR0FBRyxzQkFBVUYsWUFBR0csSUFBYixDQUFsQixDLENBRUE7O0FBQ0EsTUFBTTtBQUNKQyxFQUFBQSxNQURJO0FBRUpDLEVBQUFBLFFBRkk7QUFHSkMsRUFBQUEsUUFISTtBQUlKQyxFQUFBQSxXQUpJO0FBS0pDLEVBQUFBLE9BTEk7QUFNSkMsRUFBQUEsUUFOSTtBQU9KQyxFQUFBQTtBQVBJLElBUUZDLEtBUko7QUFVQTs7Ozs7Ozs7OzBCQXFVT0MsTUFBTSxDQUFDQyxXOzJCQWNBRCxNQUFNLENBQUNDLFc7O0FBM1VkLE1BQU1DLFlBQU4sQ0FBbUI7QUFDeEI7Ozs7Ozs7O0FBU0E7Ozs7Ozs7QUFRQTs7Ozs7QUFNQTs7Ozs7Ozs7QUFTQTs7Ozs7OztBQVFBOzs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7QUFXQUMsRUFBQUEsV0FBVyxDQUFDQyxTQUFELEVBQW9CQyxPQUFlLEdBQUc7QUFBQ0MsSUFBQUEsZUFBZSxFQUFFO0FBQWxCLEdBQXRDLEVBQStEO0FBQUE7O0FBQUEsMENBOUM1QyxFQThDNEM7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEscUNBYnhELEVBYXdEOztBQUN4RSxTQUFLRixTQUFMLEdBQWlCRyxjQUFLQyxPQUFMLENBQWFKLFNBQWIsQ0FBakI7QUFDQSxTQUFLSyxPQUFMLEdBQWUsRUFBZjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFJQyxHQUFK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QU9LLGNBQVAsQ0FDRUosVUFBeUIsR0FBRyxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLEtBQWhCLEVBQXVCLE1BQXZCLENBRDlCLEVBRUVPLEtBQWEsR0FBRyxHQUZsQixFQUdFO0FBQ0EsV0FBTyxJQUFJQyxNQUFKLENBQ0xSLFVBQVUsQ0FDUE0sSUFESCxDQUNRLEdBRFIsRUFFR1QsT0FGSCxDQUVXLEtBRlgsRUFFa0IsS0FGbEIsRUFHR0EsT0FISCxDQUdXLFVBSFgsRUFHdUIsT0FIdkIsQ0FESyxFQUtMVSxLQUxLLENBQVA7QUFPRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxTQUFPTCx5QkFBUCxDQUFpQ2pELFFBQWlCLEdBQUcsSUFBckQsRUFBMkU7QUFDekUsUUFBSXdELEdBQUcsR0FBRyw2QkFBVjtBQUNBLFFBQUlULFVBQVUsR0FBRyxJQUFqQjs7QUFFQSxRQUFJUyxHQUFHLENBQUNyRixZQUFKLElBQW9CcUYsR0FBRyxDQUFDckYsWUFBSixDQUFpQjRFLFVBQXpDLEVBQXFEO0FBQ25ELFVBQUlVLFdBQVcsR0FBR0QsR0FBRyxDQUFDckYsWUFBSixDQUFpQjRFLFVBQW5DOztBQUVBLFVBQUlsQixLQUFLLENBQUNoRSxPQUFOLENBQWM0RixXQUFkLENBQUosRUFBZ0M7QUFDOUJWLFFBQUFBLFVBQVUsR0FBR1UsV0FBYjtBQUNELE9BRkQsTUFHSztBQUNIVixRQUFBQSxVQUFVLEdBQUcsQ0FBQy9DLFFBQVEsR0FBR3lELFdBQVcsQ0FBQ3pELFFBQVosRUFBSCxHQUE0QnlELFdBQXJDLENBQWI7QUFDRDtBQUNGOztBQUVELFdBQU9WLFVBQVA7QUFDRDs7QUF2ZXVCOzs7ZUEwZVg1RSxZIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGZzLCB7IHJlYWRkaXJTeW5jLCBzdGF0U3luYyB9IGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJ25lLXR5cGVzJ1xuaW1wb3J0IHsgR1FMQmFzZSB9IGZyb20gJy4vR1FMQmFzZSdcbmltcG9ydCB7IEdRTEpTT04gfSBmcm9tICcuL3R5cGVzL0dRTEpTT04nXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaCdcbmltcG9ydCB7XG4gIHByb21pc2lmeSxcbiAgRGVmZXJyZWQsXG4gIGdldExhdHRpY2VQcmVmcyxcbiAgTGF0dGljZUxvZ3MgYXMgbGxcbn0gZnJvbSAnLi91dGlscydcblxuLy8gUHJvbWlzaWZ5IHNvbWUgYml0c1xuY29uc3QgcmVhZGRpckFzeW5jID0gcHJvbWlzaWZ5KGZzLnJlYWRkaXIpXG5jb25zdCBzdGF0QXN5bmMgPSBwcm9taXNpZnkoZnMuc3RhdClcblxuLy8gRmV0Y2ggc29tZSB0eXBlIGNoZWNraW5nIGJpdHMgZnJvbSAndHlwZXMnXG5jb25zdCB7XG4gIHR5cGVPZixcbiAgaXNTdHJpbmcsXG4gIGlzT2ZUeXBlLFxuICBpc1ByaW1pdGl2ZSxcbiAgaXNBcnJheSxcbiAgaXNPYmplY3QsXG4gIGV4dGVuZHNGcm9tXG59ID0gdHlwZXM7XG5cbi8qKlxuICogVGhlIE1vZHVsZVBhcnNlciBpcyBhIHV0aWxpdHkgY2xhc3MgZGVzaWduZWQgdG8gbG9vcCB0aHJvdWdoIGFuZCBpdGVyYXRlXG4gKiBvbiBhIGRpcmVjdG9yeSBhbmQgcHVsbCBvdXQgb2YgZWFjaCAuanMgZmlsZSBmb3VuZCwgYW55IGNsYXNzZXMgb3IgZXhwb3J0c1xuICogdGhhdCBleHRlbmQgZnJvbSBHUUxCYXNlIG9yIGEgY2hpbGQgb2YgR1FMQmFzZS5cbiAqXG4gKiBAY2xhc3MgTW9kdWxlUGFyc2VyXG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IGNsYXNzIE1vZHVsZVBhcnNlciB7XG4gIC8qKlxuICAgKiBBbiBpbnRlcm5hbCBhcnJheSBvZiBgR1FMQmFzZWAgZXh0ZW5kZWQgY2xhc3NlcyBmb3VuZCBkdXJpbmcgZWl0aGVyIGFcbiAgICogYHBhcnNlKClgIG9yIGBwYXJzZVN5bmMoKWAgY2FsbC5cbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZHVsZVBhcnNlclxuICAgKiBAdHlwZSB7QXJyYXk8R1FMQmFzZT59XG4gICAqL1xuICBjbGFzc2VzOiBBcnJheTxHUUxCYXNlPjtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2Ygc3RyaW5ncyBob2xkaW5nIGxvb3NlIEdyYXBoUUwgc2NoZW1hIGRvY3VtZW50cy5cbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZHVsZVBhcnNlclxuICAgKiBAdHlwZSB7QXJyYXk8c3RyaW5nPn1cbiAgICovXG4gIGxvb3NlR3JhcGhRTDogQXJyYXk8c3RyaW5nPiA9IFtdO1xuXG4gIC8qKlxuICAgKiBBIG1hcCBvZiBza2lwcGVkIGl0ZW1zIG9uIHRoZSBsYXN0IHBhc3MgYW5kIHRoZSBhc3NvY2lhdGVkIGVycm9yIHRoYXRcbiAgICogYWNjb21wYW5pZXMgaXQuXG4gICAqL1xuICBza2lwcGVkOiBNYXA8c3RyaW5nLCBFcnJvcj47XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIGRlbm90aW5nIHRoZSBkaXJlY3Rvcnkgb24gZGlzayB3aGVyZSBgTW9kdWxlUGFyc2VyYCBzaG91bGQgYmVcbiAgICogc2VhcmNoaW5nIGZvciBpdHMgY2xhc3Nlcy5cbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZHVsZVBhcnNlclxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgZGlyZWN0b3J5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiB2YWx1ZSBkZW5vdGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgYE1vZHVsZVBhcnNlcmAgaW5zdGFuY2UgaXNcbiAgICogdmFsaWQ7IGkuZS4gdGhlIGRpcmVjdG9yeSBpdCBwb2ludHMgdG8gYWN0dWFsbHkgZXhpc3RzIGFuZCBpcyBhIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHZhbGlkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QsIG9wdGlvbmFsbHkgYWRkZWQgZHVyaW5nIGNvbnN0cnVjdGlvbiwgdGhhdCBzcGVjaWZpZXMgc29tZVxuICAgKiBjb25maWd1cmF0aW9uIGFib3V0IHRoZSBNb2R1bGVQYXJzZXIgYW5kIGhvdyBpdCBzaG91bGQgZG8gaXRzIGpvYi5cbiAgICpcbiAgICogSW5pdGlhbGx5LCB0aGVcbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIG9wdGlvbnM6IE9iamVjdCA9IHt9O1xuXG4gIC8qKlxuICAgKiBUaGUgY29uc3RydWN0b3JcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBtZXRob2Qg4o6G4qCAY29uc3RydWN0b3JcbiAgICogQG1lbWJlcm9mIE1vZHVsZVBhcnNlclxuICAgKiBAaW5uZXJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRpcmVjdG9yeSBhIHN0cmluZyBwYXRoIHRvIGEgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhlXG4gICAqIHZhcmlvdXMgR1FMQmFzZSBleHRlbmRlZCBjbGFzc2VzIHRoYXQgc2hvdWxkIGJlIGdhdGhlcmVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGlyZWN0b3J5OiBzdHJpbmcsIG9wdGlvbnM6IE9iamVjdCA9IHthZGRMYXR0aWNlVHlwZXM6IHRydWV9KSB7XG4gICAgdGhpcy5kaXJlY3RvcnkgPSBwYXRoLnJlc29sdmUoZGlyZWN0b3J5KTtcbiAgICB0aGlzLmNsYXNzZXMgPSBbXTtcbiAgICB0aGlzLnNraXBwZWQgPSBuZXcgTWFwKCk7XG5cbiAgICBtZXJnZSh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudmFsaWQgPSBmcy5zdGF0U3luYyhkaXJlY3RvcnkpLmlzRGlyZWN0b3J5KCk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy52YWxpZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhIGZpbGUgcGF0aCwgdGhpcyBtZXRob2Qgd2lsbCBhdHRlbXB0IHRvIGltcG9ydC9yZXF1aXJlIHRoZVxuICAgKiBmaWxlIGluIHF1ZXN0aW9uIGFuZCByZXR1cm4gdGhlIG9iamVjdCBpdCBleHBvcnRlZDsgd2hhdGV2ZXIgdGhhdFxuICAgKiBtYXkgYmUuXG4gICAqXG4gICAqIEBtZXRob2QgTW9kdWxlUGFyc2VyI+KMvuKggGltcG9ydENsYXNzXG4gICAqIEBzaW5jZSAyLjcuMFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggYSBwYXRoIHRvIHBhc3MgdG8gYHJlcXVpcmUoKWBcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgb2JqZWN0LCBvciB1bmRlZmluZWQsIHRoYXQgd2FzIHJldHVybmVkIHdoZW5cbiAgICogaXQgd2FzIGByZXF1aXJlKClgJ2VkLlxuICAgKi9cbiAgaW1wb3J0Q2xhc3MoZmlsZVBhdGg6IHN0cmluZyk6IE9iamVjdCB7XG4gICAgbGV0IG1vZHVsZUNvbnRlbnRzOiBPYmplY3QgPSB7fTtcbiAgICBsZXQgeWVsbG93OiBzdHJpbmcgPSAnXFx4MWJbMzNtJ1xuICAgIGxldCBjbGVhcjogc3RyaW5nID0gJ1xceDFiWzBtJ1xuXG4gICAgdHJ5IHtcbiAgICAgIG1vZHVsZUNvbnRlbnRzID0gcmVxdWlyZShmaWxlUGF0aClcbiAgICB9XG4gICAgY2F0Y2goaWdub3JlKSB7XG4gICAgICBpZiAoL1xcLmdyYXBocWwvaS50ZXN0KHBhdGguZXh0bmFtZShmaWxlUGF0aCkpKSB7XG4gICAgICAgIGxsLmxvZyhgSW5nZXN0aW5nIC5ncmFwaHFsIGZpbGUgJHtmaWxlUGF0aH1gKVxuICAgICAgICBsZXQgYnVmZmVyID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKVxuICAgICAgICB0aGlzLmxvb3NlR3JhcGhRTC5wdXNoKGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsbC5sb2coYCR7eWVsbG93fVNraXBwaW5nJHtjbGVhcn0gJHtmaWxlUGF0aH1gKVxuICAgICAgICBsbC50cmFjZShpZ25vcmUpXG4gICAgICAgIHRoaXMuc2tpcHBlZC5zZXQoZmlsZVBhdGgsIGlnbm9yZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kdWxlQ29udGVudHM7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYW4gb2JqZWN0LCB0eXBpY2FsbHkgdGhlIHJlc3VsdCBvZiBhIGByZXF1aXJlKClgIG9yIGBpbXBvcnRgXG4gICAqIGNvbW1hbmQsIGl0ZXJhdGUgb3ZlciBpdHMgY29udGVudHMgYW5kIGZpbmQgYW55IGBHUUxCYXNlYCBkZXJpdmVkXG4gICAqIGV4cG9ydHMuIENvbnRpbnVhbGx5LCBhbmQgcmVjdXJzaXZlbHksIGJ1aWxkIHRoaXMgbGlzdCBvZiBjbGFzc2VzIG91dFxuICAgKiBzbyB0aGF0IHdlIGNhbiBhZGQgdGhlbSB0byBhIGBHUUxFeHByZXNzTWlkZGxld2FyZWAuXG4gICAqXG4gICAqIEBtZXRob2QgTW9kdWxlUGFyc2VyI+KMvuKggGZpbmRHUUxCYXNlQ2xhc3Nlc1xuICAgKiBAc2luY2UgMi43LjBcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnRzIHRoZSBvYmplY3QgdG8gcGFyc2UgZm9yIHByb3BlcnRpZXMgZXh0ZW5kaW5nXG4gICAqIGZyb20gYEdRTEJhc2VgXG4gICAqIEBwYXJhbSB7QXJyYXk8R1FMQmFzZT59IGdxbERlZmluaXRpb25zIHRoZSByZXN1bHRzLCBhbGxvd2VkIGFzIGEgc2Vjb25kXG4gICAqIHBhcmFtZXRlciBkdXJpbmcgcmVjdXJzaW9uIGFzIGEgbWVhbnMgdG8gc2F2ZSBzdGF0ZSBiZXR3ZWVuIGNhbGxzXG4gICAqIEByZXR1cm4ge1NldDxtaXhlZD59IGEgdW5pcXVlIHNldCBvZiB2YWx1ZXMgdGhhdCBhcmUgY3VycmVudGx5IGJlaW5nXG4gICAqIGl0ZXJhdGVkIG92ZXIuIFBhc3NlZCBpbiBhcyBhIHRoaXJkIHBhcmFtZXRlciB0byBzYXZlIHN0YXRlIGJldHdlZW4gY2FsbHNcbiAgICogZHVyaW5nIHJlY3Vyc2lvbi5cbiAgICovXG4gIGZpbmRHUUxCYXNlQ2xhc3NlcyhcbiAgICBjb250ZW50czogT2JqZWN0LFxuICAgIGdxbERlZmluaXRpb25zPzogQXJyYXk8R1FMQmFzZT4gPSBbXSxcbiAgICBzdGFjaz86IFNldDxHUUxCYXNlPiA9IG5ldyBTZXQoKVxuICApOiBBcnJheTxHUUxCYXNlPiB7XG4gICAgLy8gSW4gb3JkZXIgdG8gcHJldmVudCBpbmZpbml0ZSBvYmplY3QgcmVjdXJzaW9uLCB3ZSBzaG91bGQgYWRkIHRoZVxuICAgIC8vIG9iamVjdCBiZWluZyBpdGVyYXRlZCBvdmVyIHRvIG91ciBTZXQuIEF0IGVhY2ggbmV3IHJlY3Vyc2l2ZSBsZXZlbFxuICAgIC8vIGFkZCB0aGUgaXRlbSBiZWluZyBpdGVyYXRlZCBvdmVyIHRvIHRoZSBzZXQgYW5kIG9ubHkgcmVjdXJzZSBpbnRvXG4gICAgLy8gaWYgdGhlIGl0ZW0gZG9lcyBub3QgYWxyZWFkeSBleGlzdCBpbiB0aGUgc3RhY2sgaXRzZWxmLlxuICAgIHN0YWNrLmFkZChjb250ZW50cylcblxuICAgIGZvciAobGV0IGtleSBpbiBjb250ZW50cykge1xuICAgICAgbGV0IHZhbHVlID0gY29udGVudHNba2V5XTtcblxuICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbHVlKSkgeyBjb250aW51ZSB9XG5cbiAgICAgIGlmIChleHRlbmRzRnJvbSh2YWx1ZSwgR1FMQmFzZSkpIHtcbiAgICAgICAgZ3FsRGVmaW5pdGlvbnMucHVzaCh2YWx1ZSlcbiAgICAgIH1cblxuICAgICAgaWYgKChpc09iamVjdCh2YWx1ZSkgfHwgaXNBcnJheSh2YWx1ZSkpICYmICFzdGFjay5oYXModmFsdWUpKSB7XG4gICAgICAgIGdxbERlZmluaXRpb25zID0gdGhpcy5maW5kR1FMQmFzZUNsYXNzZXModmFsdWUsIGdxbERlZmluaXRpb25zLCBzdGFjayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2UgcmVtb3ZlIHRoZSBjdXJyZW50IGl0ZXJhYmxlIGZyb20gb3VyIHNldCBhcyB3ZSBsZWF2ZSB0aGlzIGN1cnJlbnRcbiAgICAvLyByZWN1cnNpdmUgaXRlcmF0aW9uLlxuICAgIHN0YWNrLmRlbGV0ZShjb250ZW50cylcblxuICAgIHJldHVybiBncWxEZWZpbml0aW9uc1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGEgaW5zdGFuY2Ugb2YgTW9kdWxlUGFyc2VyLCBpbml0aWFsaXplZCB3aXRoIGEgZGlyZWN0b3J5LFxuICAgKiBhbmQgd2Fsa3MgaXRzIGNvbnRlbnRzLCBpbXBvcnRpbmcgZmlsZXMgYXMgdGhleSBhcmUgZm91bmQsIGFuZCBzb3J0aW5nXG4gICAqIGFueSBleHBvcnRzIHRoYXQgZXh0ZW5kIGZyb20gR1FMQmFzZSBpbnRvIGFuIGFycmF5IG9mIHN1Y2ggY2xhc3Nlc1xuICAgKiBpbiBhIHJlc29sdmVkIHByb21pc2UuXG4gICAqXG4gICAqIEBtZXRob2QgTW9kdWxlUGFyc2VyI+KMvuKggHBhcnNlXG4gICAqIEBhc3luY1xuICAgKiBAc2luY2UgMi43LjBcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxBcnJheTxHUUxCYXNlPj59IGFuIGFycmF5IEdRTEJhc2UgY2xhc3Nlcywgb3IgYW4gZW1wdHlcbiAgICogYXJyYXkgaWYgbm9uZSBjb3VsZCBiZSBpZGVudGlmaWVkLlxuICAgKi9cbiAgYXN5bmMgcGFyc2UoKTogUHJvbWlzZTxBcnJheTxHUUxCYXNlPj4ge1xuICAgIGxldCBtb2R1bGVzXG4gICAgbGV0IGZpbGVzXG4gICAgbGV0IHNldCA9IG5ldyBTZXQoKTtcbiAgICBsZXQgb3B0cyA9IGdldExhdHRpY2VQcmVmcygpXG5cbiAgICBpZiAoIXRoaXMudmFsaWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICAgIE1vZHVsZVBhcnNlciBpbnN0YW5jZSBpcyBpbnZhbGlkIGZvciB1c2Ugd2l0aCAke3RoaXMuZGlyZWN0b3J5fS5cbiAgICAgICAgVGhlIHBhdGggaXMgZWl0aGVyIGEgbm9uLWV4aXN0ZW50IHBhdGggb3IgaXQgZG9lcyBub3QgcmVwcmVzZW50IGFcbiAgICAgICAgZGlyZWN0b3J5LlxuICAgICAgYClcbiAgICB9XG5cbiAgICB0aGlzLnNraXBwZWQuY2xlYXIoKVxuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIGZpbGVzID0gYXdhaXQgdGhpcy5jb25zdHJ1Y3Rvci53YWxrKHRoaXMuZGlyZWN0b3J5KVxuICAgIG1vZHVsZXMgPSBmaWxlcy5tYXAoZmlsZSA9PiB0aGlzLmltcG9ydENsYXNzKGZpbGUpKVxuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIChtb2R1bGVzXG4gICAgICAubWFwKG1vZCA9PiB0aGlzLmZpbmRHUUxCYXNlQ2xhc3Nlcyhtb2QpKVxuICAgICAgLnJlZHVjZSgobGFzdCwgY3VyKSA9PiAobGFzdCB8fCBbXSkuY29uY2F0KGN1ciB8fCBbXSksIFtdKVxuICAgICAgLmZvckVhY2goQ2xhc3MgPT4gc2V0LmFkZChDbGFzcykpKVxuXG4gICAgLy8gQ29udmVydCB0aGUgc2V0IGJhY2sgaW50byBhbiBhcnJheVxuICAgIHRoaXMuY2xhc3NlcyA9IEFycmF5LmZyb20oc2V0KTtcblxuICAgIC8vIFdlIGNhbiBpZ25vcmUgZXF1YWxpdHkgc2luY2Ugd2UgY2FtZSBmcm9tIGEgc2V0OyBAQ29tcHV0ZWRUeXBlXG4gICAgdGhpcy5jbGFzc2VzLnNvcnQoKGwscikgPT4gbC5uYW1lIDwgci5uYW1lID8gLTEgOiAxKVxuXG4gICAgLy8gQWRkIGluIGFueSBHcmFwaFFMIExhdHRpY2UgdHlwZXMgcmVxdWVzdGVkXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hZGRMYXR0aWNlVHlwZXMpIHtcbiAgICAgIHRoaXMuY2xhc3Nlcy5wdXNoKEdRTEpTT04pXG4gICAgfVxuXG4gICAgLy8gU3RvcCBmbG93IGFuZCB0aHJvdyBhbiBlcnJvciBpZiBzb21lIGZpbGVzIGZhaWxlZCB0byBsb2FkIGFuZCBzZXR0aW5nc1xuICAgIC8vIGRlY2xhcmUgd2Ugc2hvdWxkIGRvIHNvLiBBZnRlciBMYXR0aWNlIDMueCB3ZSBzaG91bGQgZXhwZWN0IHRoaXMgdG8gYmVcbiAgICAvLyB0aGUgbmV3IGRlZmF1bHRcbiAgICBpZiAob3B0cy5Nb2R1bGVQYXJzZXIuZmFpbE9uRXJyb3IgJiYgdGhpcy5za2lwcGVkLnNpemUpIHtcbiAgICAgIHRoaXMucHJpbnRTa2lwcGVkKClcbiAgICAgIHRocm93IG5ldyBFcnJvcignU29tZSBmaWxlcyBza2lwcGVkIGR1ZSB0byBlcnJvcnMnKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNsYXNzZXM7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgYSBpbnN0YW5jZSBvZiBNb2R1bGVQYXJzZXIsIGluaXRpYWxpemVkIHdpdGggYSBkaXJlY3RvcnksXG4gICAqIGFuZCB3YWxrcyBpdHMgY29udGVudHMsIGltcG9ydGluZyBmaWxlcyBhcyB0aGV5IGFyZSBmb3VuZCwgYW5kIHNvcnRpbmdcbiAgICogYW55IGV4cG9ydHMgdGhhdCBleHRlbmQgZnJvbSBHUUxCYXNlIGludG8gYW4gYXJyYXkgb2Ygc3VjaCBjbGFzc2VzXG4gICAqXG4gICAqIEBtZXRob2QgTW9kdWxlUGFyc2VyI+KMvuKggHBhcnNlU3luY1xuICAgKiBAYXN5bmNcbiAgICogQHNpbmNlIDIuNy4wXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5PEdRTEJhc2U+fSBhbiBhcnJheSBHUUxCYXNlIGNsYXNzZXMsIG9yIGFuIGVtcHR5XG4gICAqIGFycmF5IGlmIG5vbmUgY291bGQgYmUgaWRlbnRpZmllZC5cbiAgICovXG4gIHBhcnNlU3luYygpOiBBcnJheTxHUUxCYXNlPiB7XG4gICAgbGV0IG1vZHVsZXM6IEFycmF5PE9iamVjdD47XG4gICAgbGV0IGZpbGVzOiBBcnJheTxzdHJpbmc+O1xuICAgIGxldCBzZXQgPSBuZXcgU2V0KCk7XG4gICAgbGV0IG9wdHMgPSBnZXRMYXR0aWNlUHJlZnMoKVxuXG4gICAgaWYgKCF0aGlzLnZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgICBNb2R1bGVQYXJzZXIgaW5zdGFuY2UgaXMgaW52YWxpZCBmb3IgdXNlIHdpdGggJHt0aGlzLmRpcmVjdG9yeX0uXG4gICAgICAgIFRoZSBwYXRoIGlzIGVpdGhlciBhIG5vbi1leGlzdGVudCBwYXRoIG9yIGl0IGRvZXMgbm90IHJlcHJlc2VudCBhXG4gICAgICAgIGRpcmVjdG9yeS5cbiAgICAgIGApXG4gICAgfVxuXG4gICAgdGhpcy5za2lwcGVkLmNsZWFyKClcblxuICAgIGZpbGVzID0gdGhpcy5jb25zdHJ1Y3Rvci53YWxrU3luYyh0aGlzLmRpcmVjdG9yeSlcbiAgICBtb2R1bGVzID0gZmlsZXMubWFwKGZpbGUgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW1wb3J0Q2xhc3MoZmlsZSlcbiAgICB9KVxuXG4gICAgbW9kdWxlc1xuICAgICAgLm1hcChtb2QgPT4gdGhpcy5maW5kR1FMQmFzZUNsYXNzZXMobW9kKSlcbiAgICAgIC5yZWR1Y2UoKGxhc3QsIGN1cikgPT4gKGxhc3QgfHwgW10pLmNvbmNhdChjdXIgfHwgW10pLCBbXSlcbiAgICAgIC5mb3JFYWNoKENsYXNzID0+IHNldC5hZGQoQ2xhc3MpKVxuXG4gICAgLy8gQ29udmVydCB0aGUgc2V0IGJhY2sgaW50byBhbiBhcnJheVxuICAgIHRoaXMuY2xhc3NlcyA9IEFycmF5LmZyb20oc2V0KTtcblxuICAgIC8vIFdlIGNhbiBpZ25vcmUgZXF1YWxpdHkgc2luY2Ugd2UgY2FtZSBmcm9tIGEgc2V0OyBAQ29tcHV0ZWRUeXBlXG4gICAgdGhpcy5jbGFzc2VzLnNvcnQoKGwscikgPT4gbC5uYW1lIDwgci5uYW1lID8gLTEgOiAxKVxuXG4gICAgLy8gQWRkIGluIGFueSBHcmFwaFFMIExhdHRpY2UgdHlwZXMgcmVxdWVzdGVkXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hZGRMYXR0aWNlVHlwZXMpIHtcbiAgICAgIHRoaXMuY2xhc3Nlcy5wdXNoKEdRTEpTT04pXG4gICAgfVxuXG4gICAgLy8gU3RvcCBmbG93IGFuZCB0aHJvdyBhbiBlcnJvciBpZiBzb21lIGZpbGVzIGZhaWxlZCB0byBsb2FkIGFuZCBzZXR0aW5nc1xuICAgIC8vIGRlY2xhcmUgd2Ugc2hvdWxkIGRvIHNvLiBBZnRlciBMYXR0aWNlIDMueCB3ZSBzaG91bGQgZXhwZWN0IHRoaXMgdG8gYmVcbiAgICAvLyB0aGUgbmV3IGRlZmF1bHRcbiAgICBpZiAob3B0cy5Nb2R1bGVQYXJzZXIuZmFpbE9uRXJyb3IgJiYgdGhpcy5za2lwcGVkLnNpemUpIHtcbiAgICAgIHRoaXMucHJpbnRTa2lwcGVkKClcbiAgICAgIHRocm93IG5ldyBFcnJvcignU29tZSBmaWxlcyBza2lwcGVkIGR1ZSB0byBlcnJvcnMnKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNsYXNzZXM7XG4gIH1cblxuICAvKipcbiAgICogUHJpbnRzIHRoZSBsaXN0IG9mIHNraXBwZWQgZmlsZXMsIHRoZWlyIHN0YWNrIHRyYWNlcywgYW5kIHRoZSBlcnJvcnNcbiAgICogZGVub3RpbmcgdGhlIHJlYXNvbnMgdGhlIGZpbGVzIHdlcmUgc2tpcHBlZC5cbiAgICovXG4gIHByaW50U2tpcHBlZCgpIHtcbiAgICBpZiAodGhpcy5za2lwcGVkLnNpemUpIHtcbiAgICAgIGxsLm91dFdyaXRlKCdcXHgxYlsxOzkxbScpXG4gICAgICBsbC5vdXRXcml0ZSgnU2tpcHBlZFxceDFiWzA7MzFtIHRoZSBmb2xsb3dpbmcgZmlsZXNcXG4nKVxuXG4gICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgdGhpcy5za2lwcGVkKSB7XG4gICAgICAgIGxsLmxvZyhgJHtwYXRoLmJhc2VuYW1lKGtleSl9OiAke3ZhbHVlLm1lc3NhZ2V9YClcbiAgICAgICAgaWYgKHZhbHVlLnN0YWNrKVxuICAgICAgICAgIGxsLmxvZyh2YWx1ZS5zdGFjay5yZXBsYWNlKC8oXikvbSwgJyQxICAnKSlcbiAgICAgIH1cblxuICAgICAgbGwub3V0V3JpdGUoJ1xceDFiWzBtJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsbC5sb2coJ1xceDFiWzE7MzJtTm8gZmlsZXMgc2tpcHBlZFxceDFiWzBtJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYGNvbnN0cnVjdG9yYCBuYW1lLiBJZiBpbnZva2VkIGFzIHRoZSBjb250ZXh0LCBvciBgdGhpc2AsXG4gICAqIG9iamVjdCBvZiB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYE9iamVjdGAncyBgcHJvdG90eXBlYCwgdGhlIHJlc3VsdGluZ1xuICAgKiB2YWx1ZSB3aWxsIGJlIGBbb2JqZWN0IE15Q2xhc3NdYCwgZ2l2ZW4gYW4gaW5zdGFuY2Ugb2YgYE15Q2xhc3NgXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAW1N5bWJvbC50b1N0cmluZ1RhZ11cbiAgICogQG1lbWJlcm9mIE1vZHVsZVBhcnNlclxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0aGlzIGlzIGFuIGluc3RhbmNlIG9mXG4gICAqIEBDb21wdXRlZFR5cGVcbiAgICovXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHsgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHNhbWUgbG9naWMgYXMge0BsaW5rICNbU3ltYm9sLnRvU3RyaW5nVGFnXX0gYnV0IG9uIGEgc3RhdGljXG4gICAqIHNjYWxlLiBTbywgaWYgeW91IHBlcmZvcm0gYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChNeUNsYXNzKWBcbiAgICogdGhlIHJlc3VsdCB3b3VsZCBiZSBgW29iamVjdCBNeUNsYXNzXWAuXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAW1N5bWJvbC50b1N0cmluZ1RhZ11cbiAgICogQG1lbWJlcm9mIE1vZHVsZVBhcnNlclxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIG5hbWUgb2YgdGhpcyBjbGFzc1xuICAgKiBAQ29tcHV0ZWRUeXBlXG4gICAqL1xuICBzdGF0aWMgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgd2Fsa3MgYSBkaXJlY3RvcnkgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgYXNib2x1dGUgZmlsZSBwYXRoc1xuICAgKiB0byB0aGUgZmlsZXMgdW5kZXIgdGhlIHNwZWNpZmllZCBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBtZXRob2QgTW9kdWxlUGFyc2VyfuKMvuKggHdhbGtcbiAgICogQGFzeW5jXG4gICAqIEBzaW5jZSAyLjcuMFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGlyIHN0cmluZyBwYXRoIHRvIHRoZSB0b3AgbGV2ZWwgZGlyZWN0b3J5IHRvIHBhcnNlXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZmlsZWxpc3QgYW4gYXJyYXkgb2YgZXhpc3RpbmcgYWJzb2x1dGUgZmlsZSBwYXRocyxcbiAgICogb3IgaWYgbm90IHBhcmFtZXRlciBpcyBzdXBwbGllZCBhIGRlZmF1bHQgZW1wdHkgYXJyYXkgd2lsbCBiZSB1c2VkLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPEFycmF5PHN0cmluZz4+fSBhbiBhcnJheSBvZiBleGlzdGluZyBhYnNvbHV0ZSBmaWxlIHBhdGhzXG4gICAqIGZvdW5kIHVuZGVyIHRoZSBzdXBwbGllZCBgZGlyYCBkaXJlY3RvcnkuXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgd2FsayhcbiAgICBkaXI6IHN0cmluZyxcbiAgICBmaWxlbGlzdDogQXJyYXk8c3RyaW5nPiA9IFtdLFxuICAgIGV4dGVuc2lvbnM6IEFycmF5PHN0cmluZz4gPSBbJy5qcycsICcuanN4JywgJy50cycsICcudHN4J11cbiAgKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gICAgbGV0IGZpbGVzID0gYXdhaXQgcmVhZGRpckFzeW5jKGRpcik7XG4gICAgbGV0IGV4dHMgPSBNb2R1bGVQYXJzZXIuY2hlY2tGb3JQYWNrYWdlRXh0ZW5zaW9ucygpIHx8IGV4dGVuc2lvbnNcbiAgICBsZXQgcGF0dGVybiA9IE1vZHVsZVBhcnNlci5hcnJheVRvUGF0dGVybihleHRzKVxuICAgIGxldCBzdGF0c1xuXG4gICAgZmlsZXMgPSBmaWxlcy5tYXAoZmlsZSA9PiBwYXRoLnJlc29sdmUocGF0aC5qb2luKGRpciwgZmlsZSkpKVxuXG4gICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgc3RhdHMgPSBhd2FpdCBzdGF0QXN5bmMoZmlsZSlcbiAgICAgIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIGZpbGVsaXN0ID0gYXdhaXQgdGhpcy53YWxrKGZpbGUsIGZpbGVsaXN0KVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChwYXR0ZXJuLnRlc3QocGF0aC5leHRuYW1lKGZpbGUpKSlcbiAgICAgICAgICBmaWxlbGlzdCA9IGZpbGVsaXN0LmNvbmNhdChmaWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZWxpc3Q7XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgd2Fsa3MgYSBkaXJlY3RvcnkgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgYXNib2x1dGUgZmlsZSBwYXRoc1xuICAgKiB0byB0aGUgZmlsZXMgdW5kZXIgdGhlIHNwZWNpZmllZCBkaXJlY3RvcnkuIFRoaXMgdmVyc2lvbiBkb2VzIHRoaXMgaW4gYVxuICAgKiBzeW5jaHJvbm91cyBmYXNoaW9uLlxuICAgKlxuICAgKiBAbWV0aG9kIE1vZHVsZVBhcnNlcn7ijL7ioIB3YWxrU3luY1xuICAgKiBAYXN5bmNcbiAgICogQHNpbmNlIDIuNy4wXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgc3RyaW5nIHBhdGggdG8gdGhlIHRvcCBsZXZlbCBkaXJlY3RvcnkgdG8gcGFyc2VcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBmaWxlbGlzdCBhbiBhcnJheSBvZiBleGlzdGluZyBhYnNvbHV0ZSBmaWxlIHBhdGhzLFxuICAgKiBvciBpZiBub3QgcGFyYW1ldGVyIGlzIHN1cHBsaWVkIGEgZGVmYXVsdCBlbXB0eSBhcnJheSB3aWxsIGJlIHVzZWQuXG4gICAqIEByZXR1cm4ge0FycmF5PHN0cmluZz59IGFuIGFycmF5IG9mIGV4aXN0aW5nIGFic29sdXRlIGZpbGUgcGF0aHMgZm91bmRcbiAgICogdW5kZXIgdGhlIHN1cHBsaWVkIGBkaXJgIGRpcmVjdG9yeS5cbiAgICovXG4gIHN0YXRpYyB3YWxrU3luYyhcbiAgICBkaXI6IHN0cmluZyxcbiAgICBmaWxlbGlzdDogQXJyYXk8c3RyaW5nPiA9IFtdLFxuICAgIGV4dGVuc2lvbnM6IEFycmF5PHN0cmluZz4gPSBbJy5qcycsICcuanN4JywgJy50cycsICcudHN4J11cbiAgKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgbGV0IGZpbGVzID0gcmVhZGRpclN5bmMoZGlyKVxuICAgIGxldCBleHRzID0gTW9kdWxlUGFyc2VyLmNoZWNrRm9yUGFja2FnZUV4dGVuc2lvbnMoKSB8fCBleHRlbnNpb25zXG4gICAgbGV0IHBhdHRlcm4gPSBNb2R1bGVQYXJzZXIuYXJyYXlUb1BhdHRlcm4oZXh0cylcbiAgICBsZXQgc3RhdHNcblxuICAgIGZpbGVzID0gZmlsZXMubWFwKGZpbGUgPT4gcGF0aC5yZXNvbHZlKHBhdGguam9pbihkaXIsIGZpbGUpKSlcblxuICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgIHN0YXRzID0gc3RhdFN5bmMoZmlsZSlcbiAgICAgIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIGZpbGVsaXN0ID0gdGhpcy53YWxrU3luYyhmaWxlLCBmaWxlbGlzdClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAocGF0dGVybi50ZXN0KHBhdGguZXh0bmFtZShmaWxlKSkpXG4gICAgICAgICAgZmlsZWxpc3QgPSBmaWxlbGlzdC5jb25jYXQoZmlsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbGVsaXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBNb2R1bGVQYXJzZXIgc2hvdWxkIG9ubHkgcGFyc2UgZmlsZXMgdGhhdCBtYXRjaCB0aGUgZGVmYXVsdCBvclxuICAgKiBzdXBwbGllZCBmaWxlIGV4dGVuc2lvbnMuIFRoZSBkZWZhdWx0IGxpc3QgY29udGFpbnMgLmpzLCAuanN4LCAudHNcbiAgICogYW5kIC50c3g7IHNvIEphdmFTY3JpcHQgb3IgVHlwZVNjcmlwdCBmaWxlcyBhbmQgdGhlaXIgSlNYIFJlYWN0XG4gICAqIGNvdW50ZXJwYXJ0c1xuICAgKlxuICAgKiBTaW5jZSB0aGUgbGlzdCBpcyBjdXN0b21pemFibGUgZm9yIGEgdXNhZ2UsIGhvd2V2ZXIsIGl0IG1ha2VzIHNlbnNlXG4gICAqIHRvIGhhdmUgYSBmdW5jdGlvbiB0aGF0IHdpbGwgbWF0Y2ggd2hhdCBpcyBzdXBwbGllZCByYXRoZXIgdGhhblxuICAgKiBjcmVhdGluZyBhIGNvbnN0YW50IGV4cHJlc3Npb24gdG8gdXNlIGluc3RlYWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIE1vZHVsZVBhcnNlclxuICAgKiBAZnVuY3Rpb24g4oy+4qCAYXJyYXlUb1BhdHRlcm5cbiAgICogQHNpbmNlIDIuMTMuMFxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGV4dGVuc2lvbnMgYW4gYXJyYXkgb2YgZXh0ZW5zaW9ucyB0b1xuICAgKiBjb252ZXJ0IHRvIGEgcmVndWxhciBleHByZXNzaW9uIHRoYXQgd291bGQgcGFzcyBmb3IgZWFjaFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmxhZ3MgdGhlIHZhbHVlIHBhc3NlZCB0byBhIG5ldyBSZWdFeHAgZGVub3RpbmcgdGhlXG4gICAqIGZsYWdzIHVzZWQgaW4gdGhlIHBhdHRlcm47IGRlZmF1bHRzIHRvICdpJyBmb3IgY2FzZSBpbnNlbnNpdGl2aXR5XG4gICAqIEByZXR1cm4ge1JlZ0V4cH0gYSByZWd1bGFyIGV4cHJlc3Npb24gb2JqZWN0IG1hdGNoaW5nIHRoZSBjb250ZW50c1xuICAgKiBvZiB0aGUgYXJyYXkgb2YgZXh0ZW5zaW9ucyBvciB0aGUgZGVmYXVsdCBleHRlbnNpb25zIGFuZCB0aGF0IHdpbGxcbiAgICogYWxzbyBtYXRjaCB0aG9zZSB2YWx1ZXMgaW4gYSBjYXNlIGluc2Vuc2l0aXZlIG1hbm5lclxuICAgKi9cbiAgc3RhdGljIGFycmF5VG9QYXR0ZXJuKFxuICAgIGV4dGVuc2lvbnM6IEFycmF5PHN0cmluZz4gPSBbJy5qcycsICcuanN4JywgJy50cycsICcudHN4J10sXG4gICAgZmxhZ3M6IHN0cmluZyA9ICdpJ1xuICApIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChcbiAgICAgIGV4dGVuc2lvbnNcbiAgICAgICAgLmpvaW4oJ3wnKVxuICAgICAgICAucmVwbGFjZSgvXFwuL2csICdcXFxcLicpXG4gICAgICAgIC5yZXBsYWNlKC8oW1xcfCRdKS9nLCAnXFxcXGIkMScpLFxuICAgICAgZmxhZ3NcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogVXNpbmcgdGhlIG1vZHVsZSBgcmVhZC1wa2ctdXBgLCBmaW5kcyB0aGUgbmVhcmVzdCBwYWNrYWdlLmpzb24gZmlsZVxuICAgKiBhbmQgY2hlY2tzIHRvIHNlZSBpZiBpdCBoYXMgYSBgLmxhdHRpY2UubW9kdWxlUGFyc2VyLmV4dGVuc2lvbnMnXG4gICAqIHByZWZlcmVuY2UuIElmIHNvLCBpZiB0aGUgdmFsdWUgaXMgYW4gYXJyYXksIHRoYXQgdmFsdWUgaXMgdXNlZCxcbiAgICogb3RoZXJ3aXNlIHRoZSB2YWx1ZSBpcyB3cmFwcGVkIGluIGFuIGFycmF5LiBJZiB0aGUgb3B0aW9uYWwgcGFyYW1ldGVyXG4gICAqIGB0b1N0cmluZ2AgaXMgYHRydWVgIHRoZW4gYC50b1N0cmluZygpYCB3aWxsIGJlIGludm9rZWQgb24gYW55IG5vblxuICAgKiBBcnJheSB2YWx1ZXMgZm91bmQ7IHRoaXMgYmVoYXZpb3IgaXMgdGhlIGRlZmF1bHRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgTW9kdWxlUGFyc2VyXG4gICAqIEBtZXRob2Qg4oy+4qCAY2hlY2tGb3JQYWNrYWdlRXh0ZW5zaW9uc1xuICAgKiBAc2luY2UgMi4xMy4wXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdG9TdHJpbmcgdHJ1ZSBpZiBhbnkgbm9uLWFycmF5IHZhbHVlcyBzaG91bGQgaGF2ZVxuICAgKiB0aGVpciBgLnRvU3RyaW5nKClgIG1ldGhvZCBpbnZva2VkIGJlZm9yZSBiZWluZyB3cmFwcGVkIGluIGFuIEFycmF5O1xuICAgKiBkZWZhdWx0cyB0byB0cnVlXG4gICAqIEByZXR1cm4gez9BcnJheTxzdHJpbmc+fSBudWxsIGlmIG5vIHZhbHVlIGlzIHNldCBmb3IgdGhlIHByb3BlcnR5XG4gICAqIGBsYXR0aWNlLk1vZHVsZVBhcnNlci5leHRlbnNpb25zYCBpbiBgcGFja2FnZS5qc29uYCBvciB0aGUgdmFsdWVcbiAgICogb2YgdGhlIHNldHRpbmcgaWYgaXQgaXMgYW4gYXJyYXkuIEZpbmFsbHkgaWYgdGhlIHZhbHVlIGlzIHNldCBidXQgaXNcbiAgICogbm90IGFuIGFycmF5LCB0aGUgc3BlY2lmaWVkIHZhbHVlIHdyYXBwZWQgaW4gYW4gYXJyYXkgaXMgcmV0dXJuZWRcbiAgICovXG4gIHN0YXRpYyBjaGVja0ZvclBhY2thZ2VFeHRlbnNpb25zKHRvU3RyaW5nOiBib29sZWFuID0gdHJ1ZSk6ID9BcnJheTxzdHJpbmc+IHtcbiAgICBsZXQgcGtnID0gZ2V0TGF0dGljZVByZWZzKClcbiAgICBsZXQgZXh0ZW5zaW9ucyA9IG51bGxcblxuICAgIGlmIChwa2cuTW9kdWxlUGFyc2VyICYmIHBrZy5Nb2R1bGVQYXJzZXIuZXh0ZW5zaW9ucykge1xuICAgICAgbGV0IHBhY2thZ2VFeHRzID0gcGtnLk1vZHVsZVBhcnNlci5leHRlbnNpb25zXG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhY2thZ2VFeHRzKSkge1xuICAgICAgICBleHRlbnNpb25zID0gcGFja2FnZUV4dHNcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBleHRlbnNpb25zID0gW3RvU3RyaW5nID8gcGFja2FnZUV4dHMudG9TdHJpbmcoKSA6IHBhY2thZ2VFeHRzXVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBleHRlbnNpb25zXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kdWxlUGFyc2VyO1xuIl19