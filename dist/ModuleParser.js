"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ModuleParser = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = _interopRequireWildcard(require("fs"));

var _path = _interopRequireDefault(require("path"));

var types = _interopRequireWildcard(require("ne-types"));

var _GQLBase = require("./GQLBase");

var _GQLJSON = require("./types/GQLJSON");

var _lodash = require("lodash");

var _utils = require("./utils");

// Promisify some bits
var readdirAsync = (0, _utils.promisify)(_fs.default.readdir);
var statAsync = (0, _utils.promisify)(_fs.default.stat); // Fetch some type checking bits from 'types'

var typeOf = types.typeOf,
    isString = types.isString,
    isOfType = types.isOfType,
    isPrimitive = types.isPrimitive,
    isArray = types.isArray,
    isObject = types.isObject,
    extendsFrom = types.extendsFrom;
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

var ModuleParser =
/*#__PURE__*/
function () {
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
  function ModuleParser(directory) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      addLatticeTypes: true
    };
    (0, _classCallCheck2.default)(this, ModuleParser);
    (0, _defineProperty2.default)(this, "looseGraphQL", []);
    (0, _defineProperty2.default)(this, "options", {});
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


  (0, _createClass2.default)(ModuleParser, [{
    key: "importClass",
    value: function importClass(filePath) {
      var moduleContents = {};
      var yellow = '\x1b[33m';
      var clear = '\x1b[0m';

      try {
        moduleContents = require(filePath);
      } catch (ignore) {
        if (/\.graphql/i.test(_path.default.extname(filePath))) {
          _utils.LatticeLogs.log("Ingesting .graphql file ".concat(filePath));

          var buffer = _fs.default.readFileSync(filePath);

          this.looseGraphQL.push(_fs.default.readFileSync(filePath).toString());
        } else {
          _utils.LatticeLogs.log("".concat(yellow, "Skipping").concat(clear, " ").concat(filePath));

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

  }, {
    key: "findGQLBaseClasses",
    value: function findGQLBaseClasses(contents) {
      var gqlDefinitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var stack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();
      // In order to prevent infinite object recursion, we should add the
      // object being iterated over to our Set. At each new recursive level
      // add the item being iterated over to the set and only recurse into
      // if the item does not already exist in the stack itself.
      stack.add(contents);

      for (var key in contents) {
        var value = contents[key];

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

  }, {
    key: "parse",
    value: function () {
      var _parse = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var _this = this;

        var modules, files, set, opts;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                set = new Set();
                opts = (0, _utils.getLatticePrefs)();

                if (this.valid) {
                  _context.next = 4;
                  break;
                }

                throw new Error("\n        ModuleParser instance is invalid for use with ".concat(this.directory, ".\n        The path is either a non-existent path or it does not represent a\n        directory.\n      "));

              case 4:
                this.skipped.clear(); // @ComputedType

                _context.next = 7;
                return this.constructor.walk(this.directory);

              case 7:
                files = _context.sent;
                modules = files.map(function (file) {
                  return _this.importClass(file);
                }) // @ComputedType
                (modules.map(function (mod) {
                  return _this.findGQLBaseClasses(mod);
                }).reduce(function (last, cur) {
                  return (last || []).concat(cur || []);
                }, []).forEach(function (Class) {
                  return set.add(Class);
                })); // Convert the set back into an array

                this.classes = Array.from(set); // We can ignore equality since we came from a set; @ComputedType

                this.classes.sort(function (l, r) {
                  return l.name < r.name ? -1 : 1;
                }); // Add in any GraphQL Lattice types requested

                if (this.options.addLatticeTypes) {
                  this.classes.push(_GQLJSON.GQLJSON);
                } // Stop flow and throw an error if some files failed to load and settings
                // declare we should do so. After Lattice 3.x we should expect this to be
                // the new default


                if (!(opts.ModuleParser.failOnError && this.skipped.size)) {
                  _context.next = 15;
                  break;
                }

                this.printSkipped();
                throw new Error('Some files skipped due to errors');

              case 15:
                return _context.abrupt("return", this.classes);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function parse() {
        return _parse.apply(this, arguments);
      };
    }()
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

  }, {
    key: "parseSync",
    value: function parseSync() {
      var _this2 = this;

      var modules;
      var files;
      var set = new Set();
      var opts = (0, _utils.getLatticePrefs)();

      if (!this.valid) {
        throw new Error("\n        ModuleParser instance is invalid for use with ".concat(this.directory, ".\n        The path is either a non-existent path or it does not represent a\n        directory.\n      "));
      }

      this.skipped.clear();
      files = this.constructor.walkSync(this.directory);
      modules = files.map(function (file) {
        return _this2.importClass(file);
      });
      modules.map(function (mod) {
        return _this2.findGQLBaseClasses(mod);
      }).reduce(function (last, cur) {
        return (last || []).concat(cur || []);
      }, []).forEach(function (Class) {
        return set.add(Class);
      }); // Convert the set back into an array

      this.classes = Array.from(set); // We can ignore equality since we came from a set; @ComputedType

      this.classes.sort(function (l, r) {
        return l.name < r.name ? -1 : 1;
      }); // Add in any GraphQL Lattice types requested

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

  }, {
    key: "printSkipped",
    value: function printSkipped() {
      if (this.skipped.size) {
        _utils.LatticeLogs.outWrite('\x1b[1;91m');

        _utils.LatticeLogs.outWrite('Skipped\x1b[0;31m the following files\n');

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.skipped[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            _utils.LatticeLogs.log("".concat(_path.default.basename(key), ": ").concat(value.message));

            if (value.stack) _utils.LatticeLogs.log(value.stack.replace(/(^)/m, '$1  '));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
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
     * @memberof ModuleParser
     * @static
     *
     * @return {string} the name of this class
     * @ComputedType
     */

  }], [{
    key: "walk",

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
    value: function () {
      var _walk = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(dir) {
        var filelist,
            extensions,
            files,
            exts,
            pattern,
            stats,
            _iteratorNormalCompletion2,
            _didIteratorError2,
            _iteratorError2,
            _iterator2,
            _step2,
            file,
            _args2 = arguments;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                filelist = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : [];
                extensions = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : ['.js', '.jsx', '.ts', '.tsx'];
                _context2.next = 4;
                return readdirAsync(dir);

              case 4:
                files = _context2.sent;
                exts = ModuleParser.checkForPackageExtensions() || extensions;
                pattern = ModuleParser.arrayToPattern(exts);
                files = files.map(function (file) {
                  return _path.default.resolve(_path.default.join(dir, file));
                });
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 11;
                _iterator2 = files[Symbol.iterator]();

              case 13:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context2.next = 28;
                  break;
                }

                file = _step2.value;
                _context2.next = 17;
                return statAsync(file);

              case 17:
                stats = _context2.sent;

                if (!stats.isDirectory()) {
                  _context2.next = 24;
                  break;
                }

                _context2.next = 21;
                return this.walk(file, filelist);

              case 21:
                filelist = _context2.sent;
                _context2.next = 25;
                break;

              case 24:
                if (pattern.test(_path.default.extname(file))) filelist = filelist.concat(file);

              case 25:
                _iteratorNormalCompletion2 = true;
                _context2.next = 13;
                break;

              case 28:
                _context2.next = 34;
                break;

              case 30:
                _context2.prev = 30;
                _context2.t0 = _context2["catch"](11);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 34:
                _context2.prev = 34;
                _context2.prev = 35;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 37:
                _context2.prev = 37;

                if (!_didIteratorError2) {
                  _context2.next = 40;
                  break;
                }

                throw _iteratorError2;

              case 40:
                return _context2.finish(37);

              case 41:
                return _context2.finish(34);

              case 42:
                return _context2.abrupt("return", filelist);

              case 43:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[11, 30, 34, 42], [35,, 37, 41]]);
      }));

      return function walk(_x) {
        return _walk.apply(this, arguments);
      };
    }()
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

  }, {
    key: "walkSync",
    value: function walkSync(dir) {
      var filelist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var extensions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['.js', '.jsx', '.ts', '.tsx'];
      var files = (0, _fs.readdirSync)(dir);
      var exts = ModuleParser.checkForPackageExtensions() || extensions;
      var pattern = ModuleParser.arrayToPattern(exts);
      var stats;
      files = files.map(function (file) {
        return _path.default.resolve(_path.default.join(dir, file));
      });
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = files[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var file = _step3.value;
          stats = (0, _fs.statSync)(file);

          if (stats.isDirectory()) {
            filelist = this.walkSync(file, filelist);
          } else {
            if (pattern.test(_path.default.extname(file))) filelist = filelist.concat(file);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
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

  }, {
    key: "arrayToPattern",
    value: function arrayToPattern() {
      var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['.js', '.jsx', '.ts', '.tsx'];
      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'i';
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

  }, {
    key: "checkForPackageExtensions",
    value: function checkForPackageExtensions() {
      var toString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var pkg = (0, _utils.getLatticePrefs)();
      var extensions = null;

      if (pkg.ModuleParser && pkg.ModuleParser.extensions) {
        var packageExts = pkg.ModuleParser.extensions;

        if (Array.isArray(packageExts)) {
          extensions = packageExts;
        } else {
          extensions = [toString ? packageExts.toString() : packageExts];
        }
      }

      return extensions;
    }
  }, {
    key: _Symbol$toStringTag2,
    get: function get() {
      return this.name;
    }
  }]);
  return ModuleParser;
}();

exports.ModuleParser = ModuleParser;
var _default = ModuleParser;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9Nb2R1bGVQYXJzZXIuanMiXSwibmFtZXMiOlsicmVhZGRpckFzeW5jIiwiZnMiLCJyZWFkZGlyIiwic3RhdEFzeW5jIiwic3RhdCIsInR5cGVPZiIsInR5cGVzIiwiaXNTdHJpbmciLCJpc09mVHlwZSIsImlzUHJpbWl0aXZlIiwiaXNBcnJheSIsImlzT2JqZWN0IiwiZXh0ZW5kc0Zyb20iLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsIk1vZHVsZVBhcnNlciIsImRpcmVjdG9yeSIsIm9wdGlvbnMiLCJhZGRMYXR0aWNlVHlwZXMiLCJwYXRoIiwicmVzb2x2ZSIsImNsYXNzZXMiLCJza2lwcGVkIiwiTWFwIiwidmFsaWQiLCJzdGF0U3luYyIsImlzRGlyZWN0b3J5IiwiZXJyb3IiLCJmaWxlUGF0aCIsIm1vZHVsZUNvbnRlbnRzIiwieWVsbG93IiwiY2xlYXIiLCJyZXF1aXJlIiwiaWdub3JlIiwidGVzdCIsImV4dG5hbWUiLCJsbCIsImxvZyIsImJ1ZmZlciIsInJlYWRGaWxlU3luYyIsImxvb3NlR3JhcGhRTCIsInB1c2giLCJ0b1N0cmluZyIsInRyYWNlIiwic2V0IiwiY29udGVudHMiLCJncWxEZWZpbml0aW9ucyIsInN0YWNrIiwiU2V0IiwiYWRkIiwia2V5IiwidmFsdWUiLCJHUUxCYXNlIiwiaGFzIiwiZmluZEdRTEJhc2VDbGFzc2VzIiwiZGVsZXRlIiwib3B0cyIsIkVycm9yIiwiY29uc3RydWN0b3IiLCJ3YWxrIiwiZmlsZXMiLCJtb2R1bGVzIiwibWFwIiwiZmlsZSIsImltcG9ydENsYXNzIiwibW9kIiwicmVkdWNlIiwibGFzdCIsImN1ciIsImNvbmNhdCIsImZvckVhY2giLCJDbGFzcyIsIkFycmF5IiwiZnJvbSIsInNvcnQiLCJsIiwiciIsIm5hbWUiLCJHUUxKU09OIiwiZmFpbE9uRXJyb3IiLCJzaXplIiwicHJpbnRTa2lwcGVkIiwid2Fsa1N5bmMiLCJvdXRXcml0ZSIsImJhc2VuYW1lIiwibWVzc2FnZSIsInJlcGxhY2UiLCJkaXIiLCJmaWxlbGlzdCIsImV4dGVuc2lvbnMiLCJleHRzIiwiY2hlY2tGb3JQYWNrYWdlRXh0ZW5zaW9ucyIsInBhdHRlcm4iLCJhcnJheVRvUGF0dGVybiIsImpvaW4iLCJzdGF0cyIsImZsYWdzIiwiUmVnRXhwIiwicGtnIiwicGFja2FnZUV4dHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBT0E7QUFDQSxJQUFNQSxZQUFZLEdBQUcsc0JBQVVDLFlBQUdDLE9BQWIsQ0FBckI7QUFDQSxJQUFNQyxTQUFTLEdBQUcsc0JBQVVGLFlBQUdHLElBQWIsQ0FBbEIsQyxDQUVBOztJQUVFQyxNLEdBT0VDLEssQ0FQRkQsTTtJQUNBRSxRLEdBTUVELEssQ0FORkMsUTtJQUNBQyxRLEdBS0VGLEssQ0FMRkUsUTtJQUNBQyxXLEdBSUVILEssQ0FKRkcsVztJQUNBQyxPLEdBR0VKLEssQ0FIRkksTztJQUNBQyxRLEdBRUVMLEssQ0FGRkssUTtJQUNBQyxXLEdBQ0VOLEssQ0FERk0sVztBQUdGOzs7Ozs7Ozs7MEJBcVVPQyxNQUFNLENBQUNDLFc7MkJBY0FELE1BQU0sQ0FBQ0MsVzs7SUEzVVJDLFk7OztBQUNYOzs7Ozs7OztBQVNBOzs7Ozs7O0FBK0JBOzs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7QUFXQSx3QkFBWUMsU0FBWixFQUEwRTtBQUFBLFFBQTNDQyxPQUEyQyx1RUFBekI7QUFBQ0MsTUFBQUEsZUFBZSxFQUFFO0FBQWxCLEtBQXlCO0FBQUE7QUFBQSx3REE5QzVDLEVBOEM0QztBQUFBLG1EQWJ4RCxFQWF3RDtBQUN4RSxTQUFLRixTQUFMLEdBQWlCRyxjQUFLQyxPQUFMLENBQWFKLFNBQWIsQ0FBakI7QUFDQSxTQUFLSyxPQUFMLEdBQWUsRUFBZjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFJQyxHQUFKLEVBQWY7QUFFQSx1QkFBTSxLQUFLTixPQUFYLEVBQW9CQSxPQUFwQjs7QUFFQSxRQUFJO0FB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QixRQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBMEJFO0FBQUEsVUFGQUMsVUFFQSx1RUFGNEIsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixLQUFoQixFQUF1QixNQUF2QixDQUU1QjtBQUFBLFVBREFPLEtBQ0EsdUVBRGdCLEdBQ2hCO0FBQ0EsYUFBTyxJQUFJQyxNQUFKLENBQ0xSLFVBQVUsQ0FDUEssSUFESCxDQUNRLEdBRFIsRUFFR1IsT0FGSCxDQUVXLEtBRlgsRUFFa0IsS0FGbEIsRUFHR0EsT0FISCxDQUdXLFVBSFgsRUFHdUIsT0FIdkIsQ0FESyxFQUtMVSxLQUxLLENBQVA7QUFPRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0RBcUIyRTtBQUFBLFVBQTFDdEQsUUFBMEMsdUVBQXRCLElBQXNCO0FBQ3pFLFVBQUl3RCxHQUFHLEdBQUcsNkJBQVY7QUFDQSxVQUFJVCxVQUFVLEdBQUcsSUFBakI7O0FBRUEsVUFBSVMsR0FBRyxDQUFDbkYsWUFBSixJQUFvQm1GLEdBQUcsQ0FBQ25GLFlBQUosQ0FBaUIwRSxVQUF6QyxFQUFxRDtBQUNuRCxZQUFJVSxXQUFXLEdBQUdELEdBQUcsQ0FBQ25GLFlBQUosQ0FBaUIwRSxVQUFuQzs7QUFFQSxZQUFJakIsS0FBSyxDQUFDOUQsT0FBTixDQUFjeUYsV0FBZCxDQUFKLEVBQWdDO0FBQzlCVixVQUFBQSxVQUFVLEdBQUdVLFdBQWI7QUFDRCxTQUZELE1BR0s7QUFDSFYsVUFBQUEsVUFBVSxHQUFHLENBQUMvQyxRQUFRLEdBQUd5RCxXQUFXLENBQUN6RCxRQUFaLEVBQUgsR0FBNEJ5RCxXQUFyQyxDQUFiO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPVixVQUFQO0FBQ0Q7Ozt3QkE1SmlDO0FBQUUsYUFBTyxLQUFLWixJQUFaO0FBQWtCOzs7Ozs7ZUErSnpDOUQsWSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBmcywgeyByZWFkZGlyU3luYywgc3RhdFN5bmMgfSBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICduZS10eXBlcydcbmltcG9ydCB7IEdRTEJhc2UgfSBmcm9tICcuL0dRTEJhc2UnXG5pbXBvcnQgeyBHUUxKU09OIH0gZnJvbSAnLi90eXBlcy9HUUxKU09OJ1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnXG5pbXBvcnQge1xuICBwcm9taXNpZnksXG4gIERlZmVycmVkLFxuICBnZXRMYXR0aWNlUHJlZnMsXG4gIExhdHRpY2VMb2dzIGFzIGxsXG59IGZyb20gJy4vdXRpbHMnXG5cbi8vIFByb21pc2lmeSBzb21lIGJpdHNcbmNvbnN0IHJlYWRkaXJBc3luYyA9IHByb21pc2lmeShmcy5yZWFkZGlyKVxuY29uc3Qgc3RhdEFzeW5jID0gcHJvbWlzaWZ5KGZzLnN0YXQpXG5cbi8vIEZldGNoIHNvbWUgdHlwZSBjaGVja2luZyBiaXRzIGZyb20gJ3R5cGVzJ1xuY29uc3Qge1xuICB0eXBlT2YsXG4gIGlzU3RyaW5nLFxuICBpc09mVHlwZSxcbiAgaXNQcmltaXRpdmUsXG4gIGlzQXJyYXksXG4gIGlzT2JqZWN0LFxuICBleHRlbmRzRnJvbVxufSA9IHR5cGVzO1xuXG4vKipcbiAqIFRoZSBNb2R1bGVQYXJzZXIgaXMgYSB1dGlsaXR5IGNsYXNzIGRlc2lnbmVkIHRvIGxvb3AgdGhyb3VnaCBhbmQgaXRlcmF0ZVxuICogb24gYSBkaXJlY3RvcnkgYW5kIHB1bGwgb3V0IG9mIGVhY2ggLmpzIGZpbGUgZm91bmQsIGFueSBjbGFzc2VzIG9yIGV4cG9ydHNcbiAqIHRoYXQgZXh0ZW5kIGZyb20gR1FMQmFzZSBvciBhIGNoaWxkIG9mIEdRTEJhc2UuXG4gKlxuICogQGNsYXNzIE1vZHVsZVBhcnNlclxuICogQHNpbmNlIDIuNy4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNb2R1bGVQYXJzZXIge1xuICAvKipcbiAgICogQW4gaW50ZXJuYWwgYXJyYXkgb2YgYEdRTEJhc2VgIGV4dGVuZGVkIGNsYXNzZXMgZm91bmQgZHVyaW5nIGVpdGhlciBhXG4gICAqIGBwYXJzZSgpYCBvciBgcGFyc2VTeW5jKClgIGNhbGwuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2R1bGVQYXJzZXJcbiAgICogQHR5cGUge0FycmF5PEdRTEJhc2U+fVxuICAgKi9cbiAgY2xhc3NlczogQXJyYXk8R1FMQmFzZT47XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIHN0cmluZ3MgaG9sZGluZyBsb29zZSBHcmFwaFFMIHNjaGVtYSBkb2N1bWVudHMuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2R1bGVQYXJzZXJcbiAgICogQHR5cGUge0FycmF5PHN0cmluZz59XG4gICAqL1xuICBsb29zZUdyYXBoUUw6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICAvKipcbiAgICogQSBtYXAgb2Ygc2tpcHBlZCBpdGVtcyBvbiB0aGUgbGFzdCBwYXNzIGFuZCB0aGUgYXNzb2NpYXRlZCBlcnJvciB0aGF0XG4gICAqIGFjY29tcGFuaWVzIGl0LlxuICAgKi9cbiAgc2tpcHBlZDogTWFwPHN0cmluZywgRXJyb3I+O1xuXG4gIC8qKlxuICAgKiBBIHN0cmluZyBkZW5vdGluZyB0aGUgZGlyZWN0b3J5IG9uIGRpc2sgd2hlcmUgYE1vZHVsZVBhcnNlcmAgc2hvdWxkIGJlXG4gICAqIHNlYXJjaGluZyBmb3IgaXRzIGNsYXNzZXMuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2R1bGVQYXJzZXJcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIGRpcmVjdG9yeTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4gdmFsdWUgZGVub3Rpbmcgd2hldGhlciBvciBub3QgdGhlIGBNb2R1bGVQYXJzZXJgIGluc3RhbmNlIGlzXG4gICAqIHZhbGlkOyBpLmUuIHRoZSBkaXJlY3RvcnkgaXQgcG9pbnRzIHRvIGFjdHVhbGx5IGV4aXN0cyBhbmQgaXMgYSBkaXJlY3RvcnlcbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICB2YWxpZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQW4gb2JqZWN0LCBvcHRpb25hbGx5IGFkZGVkIGR1cmluZyBjb25zdHJ1Y3Rpb24sIHRoYXQgc3BlY2lmaWVzIHNvbWVcbiAgICogY29uZmlndXJhdGlvbiBhYm91dCB0aGUgTW9kdWxlUGFyc2VyIGFuZCBob3cgaXQgc2hvdWxkIGRvIGl0cyBqb2IuXG4gICAqXG4gICAqIEluaXRpYWxseSwgdGhlXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBvcHRpb25zOiBPYmplY3QgPSB7fTtcblxuICAvKipcbiAgICogVGhlIGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAbWV0aG9kIOKOhuKggGNvbnN0cnVjdG9yXG4gICAqIEBtZW1iZXJvZiBNb2R1bGVQYXJzZXJcbiAgICogQGlubmVyXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3RvcnkgYSBzdHJpbmcgcGF0aCB0byBhIGRpcmVjdG9yeSBjb250YWluaW5nIHRoZVxuICAgKiB2YXJpb3VzIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3NlcyB0aGF0IHNob3VsZCBiZSBnYXRoZXJlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRpcmVjdG9yeTogc3RyaW5nLCBvcHRpb25zOiBPYmplY3QgPSB7YWRkTGF0dGljZVR5cGVzOiB0cnVlfSkge1xuICAgIHRoaXMuZGlyZWN0b3J5ID0gcGF0aC5yZXNvbHZlKGRpcmVjdG9yeSk7XG4gICAgdGhpcy5jbGFzc2VzID0gW107XG4gICAgdGhpcy5za2lwcGVkID0gbmV3IE1hcCgpO1xuXG4gICAgbWVyZ2UodGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnZhbGlkID0gZnMuc3RhdFN5bmMoZGlyZWN0b3J5KS5pc0RpcmVjdG9yeSgpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMudmFsaWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYSBmaWxlIHBhdGgsIHRoaXMgbWV0aG9kIHdpbGwgYXR0ZW1wdCB0byBpbXBvcnQvcmVxdWlyZSB0aGVcbiAgICogZmlsZSBpbiBxdWVzdGlvbiBhbmQgcmV0dXJuIHRoZSBvYmplY3QgaXQgZXhwb3J0ZWQ7IHdoYXRldmVyIHRoYXRcbiAgICogbWF5IGJlLlxuICAgKlxuICAgKiBAbWV0aG9kIE1vZHVsZVBhcnNlciPijL7ioIBpbXBvcnRDbGFzc1xuICAgKiBAc2luY2UgMi43LjBcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIGEgcGF0aCB0byBwYXNzIHRvIGByZXF1aXJlKClgXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gdGhlIG9iamVjdCwgb3IgdW5kZWZpbmVkLCB0aGF0IHdhcyByZXR1cm5lZCB3aGVuXG4gICAqIGl0IHdhcyBgcmVxdWlyZSgpYCdlZC5cbiAgICovXG4gIGltcG9ydENsYXNzKGZpbGVQYXRoOiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIGxldCBtb2R1bGVDb250ZW50czogT2JqZWN0ID0ge307XG4gICAgbGV0IHllbGxvdzogc3RyaW5nID0gJ1xceDFiWzMzbSdcbiAgICBsZXQgY2xlYXI6IHN0cmluZyA9ICdcXHgxYlswbSdcblxuICAgIHRyeSB7XG4gICAgICBtb2R1bGVDb250ZW50cyA9IHJlcXVpcmUoZmlsZVBhdGgpXG4gICAgfVxuICAgIGNhdGNoKGlnbm9yZSkge1xuICAgICAgaWYgKC9cXC5ncmFwaHFsL2kudGVzdChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKSkge1xuICAgICAgICBsbC5sb2coYEluZ2VzdGluZyAuZ3JhcGhxbCBmaWxlICR7ZmlsZVBhdGh9YClcbiAgICAgICAgbGV0IGJ1ZmZlciA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aClcbiAgICAgICAgdGhpcy5sb29zZUdyYXBoUUwucHVzaChmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgpLnRvU3RyaW5nKCkpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbGwubG9nKGAke3llbGxvd31Ta2lwcGluZyR7Y2xlYXJ9ICR7ZmlsZVBhdGh9YClcbiAgICAgICAgbGwudHJhY2UoaWdub3JlKVxuICAgICAgICB0aGlzLnNraXBwZWQuc2V0KGZpbGVQYXRoLCBpZ25vcmUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZHVsZUNvbnRlbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGFuIG9iamVjdCwgdHlwaWNhbGx5IHRoZSByZXN1bHQgb2YgYSBgcmVxdWlyZSgpYCBvciBgaW1wb3J0YFxuICAgKiBjb21tYW5kLCBpdGVyYXRlIG92ZXIgaXRzIGNvbnRlbnRzIGFuZCBmaW5kIGFueSBgR1FMQmFzZWAgZGVyaXZlZFxuICAgKiBleHBvcnRzLiBDb250aW51YWxseSwgYW5kIHJlY3Vyc2l2ZWx5LCBidWlsZCB0aGlzIGxpc3Qgb2YgY2xhc3NlcyBvdXRcbiAgICogc28gdGhhdCB3ZSBjYW4gYWRkIHRoZW0gdG8gYSBgR1FMRXhwcmVzc01pZGRsZXdhcmVgLlxuICAgKlxuICAgKiBAbWV0aG9kIE1vZHVsZVBhcnNlciPijL7ioIBmaW5kR1FMQmFzZUNsYXNzZXNcbiAgICogQHNpbmNlIDIuNy4wXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50cyB0aGUgb2JqZWN0IHRvIHBhcnNlIGZvciBwcm9wZXJ0aWVzIGV4dGVuZGluZ1xuICAgKiBmcm9tIGBHUUxCYXNlYFxuICAgKiBAcGFyYW0ge0FycmF5PEdRTEJhc2U+fSBncWxEZWZpbml0aW9ucyB0aGUgcmVzdWx0cywgYWxsb3dlZCBhcyBhIHNlY29uZFxuICAgKiBwYXJhbWV0ZXIgZHVyaW5nIHJlY3Vyc2lvbiBhcyBhIG1lYW5zIHRvIHNhdmUgc3RhdGUgYmV0d2VlbiBjYWxsc1xuICAgKiBAcmV0dXJuIHtTZXQ8bWl4ZWQ+fSBhIHVuaXF1ZSBzZXQgb2YgdmFsdWVzIHRoYXQgYXJlIGN1cnJlbnRseSBiZWluZ1xuICAgKiBpdGVyYXRlZCBvdmVyLiBQYXNzZWQgaW4gYXMgYSB0aGlyZCBwYXJhbWV0ZXIgdG8gc2F2ZSBzdGF0ZSBiZXR3ZWVuIGNhbGxzXG4gICAqIGR1cmluZyByZWN1cnNpb24uXG4gICAqL1xuICBmaW5kR1FMQmFzZUNsYXNzZXMoXG4gICAgY29udGVudHM6IE9iamVjdCxcbiAgICBncWxEZWZpbml0aW9ucz86IEFycmF5PEdRTEJhc2U+ID0gW10sXG4gICAgc3RhY2s/OiBTZXQ8R1FMQmFzZT4gPSBuZXcgU2V0KClcbiAgKTogQXJyYXk8R1FMQmFzZT4ge1xuICAgIC8vIEluIG9yZGVyIHRvIHByZXZlbnQgaW5maW5pdGUgb2JqZWN0IHJlY3Vyc2lvbiwgd2Ugc2hvdWxkIGFkZCB0aGVcbiAgICAvLyBvYmplY3QgYmVpbmcgaXRlcmF0ZWQgb3ZlciB0byBvdXIgU2V0LiBBdCBlYWNoIG5ldyByZWN1cnNpdmUgbGV2ZWxcbiAgICAvLyBhZGQgdGhlIGl0ZW0gYmVpbmcgaXRlcmF0ZWQgb3ZlciB0byB0aGUgc2V0IGFuZCBvbmx5IHJlY3Vyc2UgaW50b1xuICAgIC8vIGlmIHRoZSBpdGVtIGRvZXMgbm90IGFscmVhZHkgZXhpc3QgaW4gdGhlIHN0YWNrIGl0c2VsZi5cbiAgICBzdGFjay5hZGQoY29udGVudHMpXG5cbiAgICBmb3IgKGxldCBrZXkgaW4gY29udGVudHMpIHtcbiAgICAgIGxldCB2YWx1ZSA9IGNvbnRlbnRzW2tleV07XG5cbiAgICAgIGlmIChpc1ByaW1pdGl2ZSh2YWx1ZSkpIHsgY29udGludWUgfVxuXG4gICAgICBpZiAoZXh0ZW5kc0Zyb20odmFsdWUsIEdRTEJhc2UpKSB7XG4gICAgICAgIGdxbERlZmluaXRpb25zLnB1c2godmFsdWUpXG4gICAgICB9XG5cbiAgICAgIGlmICgoaXNPYmplY3QodmFsdWUpIHx8IGlzQXJyYXkodmFsdWUpKSAmJiAhc3RhY2suaGFzKHZhbHVlKSkge1xuICAgICAgICBncWxEZWZpbml0aW9ucyA9IHRoaXMuZmluZEdRTEJhc2VDbGFzc2VzKHZhbHVlLCBncWxEZWZpbml0aW9ucywgc3RhY2spO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIHJlbW92ZSB0aGUgY3VycmVudCBpdGVyYWJsZSBmcm9tIG91ciBzZXQgYXMgd2UgbGVhdmUgdGhpcyBjdXJyZW50XG4gICAgLy8gcmVjdXJzaXZlIGl0ZXJhdGlvbi5cbiAgICBzdGFjay5kZWxldGUoY29udGVudHMpXG5cbiAgICByZXR1cm4gZ3FsRGVmaW5pdGlvbnNcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyBhIGluc3RhbmNlIG9mIE1vZHVsZVBhcnNlciwgaW5pdGlhbGl6ZWQgd2l0aCBhIGRpcmVjdG9yeSxcbiAgICogYW5kIHdhbGtzIGl0cyBjb250ZW50cywgaW1wb3J0aW5nIGZpbGVzIGFzIHRoZXkgYXJlIGZvdW5kLCBhbmQgc29ydGluZ1xuICAgKiBhbnkgZXhwb3J0cyB0aGF0IGV4dGVuZCBmcm9tIEdRTEJhc2UgaW50byBhbiBhcnJheSBvZiBzdWNoIGNsYXNzZXNcbiAgICogaW4gYSByZXNvbHZlZCBwcm9taXNlLlxuICAgKlxuICAgKiBAbWV0aG9kIE1vZHVsZVBhcnNlciPijL7ioIBwYXJzZVxuICAgKiBAYXN5bmNcbiAgICogQHNpbmNlIDIuNy4wXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2U8QXJyYXk8R1FMQmFzZT4+fSBhbiBhcnJheSBHUUxCYXNlIGNsYXNzZXMsIG9yIGFuIGVtcHR5XG4gICAqIGFycmF5IGlmIG5vbmUgY291bGQgYmUgaWRlbnRpZmllZC5cbiAgICovXG4gIGFzeW5jIHBhcnNlKCk6IFByb21pc2U8QXJyYXk8R1FMQmFzZT4+IHtcbiAgICBsZXQgbW9kdWxlc1xuICAgIGxldCBmaWxlc1xuICAgIGxldCBzZXQgPSBuZXcgU2V0KCk7XG4gICAgbGV0IG9wdHMgPSBnZXRMYXR0aWNlUHJlZnMoKVxuXG4gICAgaWYgKCF0aGlzLnZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgICBNb2R1bGVQYXJzZXIgaW5zdGFuY2UgaXMgaW52YWxpZCBmb3IgdXNlIHdpdGggJHt0aGlzLmRpcmVjdG9yeX0uXG4gICAgICAgIFRoZSBwYXRoIGlzIGVpdGhlciBhIG5vbi1leGlzdGVudCBwYXRoIG9yIGl0IGRvZXMgbm90IHJlcHJlc2VudCBhXG4gICAgICAgIGRpcmVjdG9yeS5cbiAgICAgIGApXG4gICAgfVxuXG4gICAgdGhpcy5za2lwcGVkLmNsZWFyKClcblxuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICBmaWxlcyA9IGF3YWl0IHRoaXMuY29uc3RydWN0b3Iud2Fsayh0aGlzLmRpcmVjdG9yeSlcbiAgICBtb2R1bGVzID0gZmlsZXMubWFwKGZpbGUgPT4gdGhpcy5pbXBvcnRDbGFzcyhmaWxlKSlcblxuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICAobW9kdWxlc1xuICAgICAgLm1hcChtb2QgPT4gdGhpcy5maW5kR1FMQmFzZUNsYXNzZXMobW9kKSlcbiAgICAgIC5yZWR1Y2UoKGxhc3QsIGN1cikgPT4gKGxhc3QgfHwgW10pLmNvbmNhdChjdXIgfHwgW10pLCBbXSlcbiAgICAgIC5mb3JFYWNoKENsYXNzID0+IHNldC5hZGQoQ2xhc3MpKSlcblxuICAgIC8vIENvbnZlcnQgdGhlIHNldCBiYWNrIGludG8gYW4gYXJyYXlcbiAgICB0aGlzLmNsYXNzZXMgPSBBcnJheS5mcm9tKHNldCk7XG5cbiAgICAvLyBXZSBjYW4gaWdub3JlIGVxdWFsaXR5IHNpbmNlIHdlIGNhbWUgZnJvbSBhIHNldDsgQENvbXB1dGVkVHlwZVxuICAgIHRoaXMuY2xhc3Nlcy5zb3J0KChsLHIpID0+IGwubmFtZSA8IHIubmFtZSA/IC0xIDogMSlcblxuICAgIC8vIEFkZCBpbiBhbnkgR3JhcGhRTCBMYXR0aWNlIHR5cGVzIHJlcXVlc3RlZFxuICAgIGlmICh0aGlzLm9wdGlvbnMuYWRkTGF0dGljZVR5cGVzKSB7XG4gICAgICB0aGlzLmNsYXNzZXMucHVzaChHUUxKU09OKVxuICAgIH1cblxuICAgIC8vIFN0b3AgZmxvdyBhbmQgdGhyb3cgYW4gZXJyb3IgaWYgc29tZSBmaWxlcyBmYWlsZWQgdG8gbG9hZCBhbmQgc2V0dGluZ3NcbiAgICAvLyBkZWNsYXJlIHdlIHNob3VsZCBkbyBzby4gQWZ0ZXIgTGF0dGljZSAzLnggd2Ugc2hvdWxkIGV4cGVjdCB0aGlzIHRvIGJlXG4gICAgLy8gdGhlIG5ldyBkZWZhdWx0XG4gICAgaWYgKG9wdHMuTW9kdWxlUGFyc2VyLmZhaWxPbkVycm9yICYmIHRoaXMuc2tpcHBlZC5zaXplKSB7XG4gICAgICB0aGlzLnByaW50U2tpcHBlZCgpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbWUgZmlsZXMgc2tpcHBlZCBkdWUgdG8gZXJyb3JzJylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jbGFzc2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGEgaW5zdGFuY2Ugb2YgTW9kdWxlUGFyc2VyLCBpbml0aWFsaXplZCB3aXRoIGEgZGlyZWN0b3J5LFxuICAgKiBhbmQgd2Fsa3MgaXRzIGNvbnRlbnRzLCBpbXBvcnRpbmcgZmlsZXMgYXMgdGhleSBhcmUgZm91bmQsIGFuZCBzb3J0aW5nXG4gICAqIGFueSBleHBvcnRzIHRoYXQgZXh0ZW5kIGZyb20gR1FMQmFzZSBpbnRvIGFuIGFycmF5IG9mIHN1Y2ggY2xhc3Nlc1xuICAgKlxuICAgKiBAbWV0aG9kIE1vZHVsZVBhcnNlciPijL7ioIBwYXJzZVN5bmNcbiAgICogQGFzeW5jXG4gICAqIEBzaW5jZSAyLjcuMFxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheTxHUUxCYXNlPn0gYW4gYXJyYXkgR1FMQmFzZSBjbGFzc2VzLCBvciBhbiBlbXB0eVxuICAgKiBhcnJheSBpZiBub25lIGNvdWxkIGJlIGlkZW50aWZpZWQuXG4gICAqL1xuICBwYXJzZVN5bmMoKTogQXJyYXk8R1FMQmFzZT4ge1xuICAgIGxldCBtb2R1bGVzOiBBcnJheTxPYmplY3Q+O1xuICAgIGxldCBmaWxlczogQXJyYXk8c3RyaW5nPjtcbiAgICBsZXQgc2V0ID0gbmV3IFNldCgpO1xuICAgIGxldCBvcHRzID0gZ2V0TGF0dGljZVByZWZzKClcblxuICAgIGlmICghdGhpcy52YWxpZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgICAgTW9kdWxlUGFyc2VyIGluc3RhbmNlIGlzIGludmFsaWQgZm9yIHVzZSB3aXRoICR7dGhpcy5kaXJlY3Rvcnl9LlxuICAgICAgICBUaGUgcGF0aCBpcyBlaXRoZXIgYSBub24tZXhpc3RlbnQgcGF0aCBvciBpdCBkb2VzIG5vdCByZXByZXNlbnQgYVxuICAgICAgICBkaXJlY3RvcnkuXG4gICAgICBgKVxuICAgIH1cblxuICAgIHRoaXMuc2tpcHBlZC5jbGVhcigpXG5cbiAgICBmaWxlcyA9IHRoaXMuY29uc3RydWN0b3Iud2Fsa1N5bmModGhpcy5kaXJlY3RvcnkpXG4gICAgbW9kdWxlcyA9IGZpbGVzLm1hcChmaWxlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmltcG9ydENsYXNzKGZpbGUpXG4gICAgfSlcblxuICAgIG1vZHVsZXNcbiAgICAgIC5tYXAobW9kID0+IHRoaXMuZmluZEdRTEJhc2VDbGFzc2VzKG1vZCkpXG4gICAgICAucmVkdWNlKChsYXN0LCBjdXIpID0+IChsYXN0IHx8IFtdKS5jb25jYXQoY3VyIHx8IFtdKSwgW10pXG4gICAgICAuZm9yRWFjaChDbGFzcyA9PiBzZXQuYWRkKENsYXNzKSlcblxuICAgIC8vIENvbnZlcnQgdGhlIHNldCBiYWNrIGludG8gYW4gYXJyYXlcbiAgICB0aGlzLmNsYXNzZXMgPSBBcnJheS5mcm9tKHNldCk7XG5cbiAgICAvLyBXZSBjYW4gaWdub3JlIGVxdWFsaXR5IHNpbmNlIHdlIGNhbWUgZnJvbSBhIHNldDsgQENvbXB1dGVkVHlwZVxuICAgIHRoaXMuY2xhc3Nlcy5zb3J0KChsLHIpID0+IGwubmFtZSA8IHIubmFtZSA/IC0xIDogMSlcblxuICAgIC8vIEFkZCBpbiBhbnkgR3JhcGhRTCBMYXR0aWNlIHR5cGVzIHJlcXVlc3RlZFxuICAgIGlmICh0aGlzLm9wdGlvbnMuYWRkTGF0dGljZVR5cGVzKSB7XG4gICAgICB0aGlzLmNsYXNzZXMucHVzaChHUUxKU09OKVxuICAgIH1cblxuICAgIC8vIFN0b3AgZmxvdyBhbmQgdGhyb3cgYW4gZXJyb3IgaWYgc29tZSBmaWxlcyBmYWlsZWQgdG8gbG9hZCBhbmQgc2V0dGluZ3NcbiAgICAvLyBkZWNsYXJlIHdlIHNob3VsZCBkbyBzby4gQWZ0ZXIgTGF0dGljZSAzLnggd2Ugc2hvdWxkIGV4cGVjdCB0aGlzIHRvIGJlXG4gICAgLy8gdGhlIG5ldyBkZWZhdWx0XG4gICAgaWYgKG9wdHMuTW9kdWxlUGFyc2VyLmZhaWxPbkVycm9yICYmIHRoaXMuc2tpcHBlZC5zaXplKSB7XG4gICAgICB0aGlzLnByaW50U2tpcHBlZCgpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbWUgZmlsZXMgc2tpcHBlZCBkdWUgdG8gZXJyb3JzJylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jbGFzc2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIFByaW50cyB0aGUgbGlzdCBvZiBza2lwcGVkIGZpbGVzLCB0aGVpciBzdGFjayB0cmFjZXMsIGFuZCB0aGUgZXJyb3JzXG4gICAqIGRlbm90aW5nIHRoZSByZWFzb25zIHRoZSBmaWxlcyB3ZXJlIHNraXBwZWQuXG4gICAqL1xuICBwcmludFNraXBwZWQoKSB7XG4gICAgaWYgKHRoaXMuc2tpcHBlZC5zaXplKSB7XG4gICAgICBsbC5vdXRXcml0ZSgnXFx4MWJbMTs5MW0nKVxuICAgICAgbGwub3V0V3JpdGUoJ1NraXBwZWRcXHgxYlswOzMxbSB0aGUgZm9sbG93aW5nIGZpbGVzXFxuJylcblxuICAgICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHRoaXMuc2tpcHBlZCkge1xuICAgICAgICBsbC5sb2coYCR7cGF0aC5iYXNlbmFtZShrZXkpfTogJHt2YWx1ZS5tZXNzYWdlfWApXG4gICAgICAgIGlmICh2YWx1ZS5zdGFjaylcbiAgICAgICAgICBsbC5sb2codmFsdWUuc3RhY2sucmVwbGFjZSgvKF4pL20sICckMSAgJykpXG4gICAgICB9XG5cbiAgICAgIGxsLm91dFdyaXRlKCdcXHgxYlswbScpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGwubG9nKCdcXHgxYlsxOzMybU5vIGZpbGVzIHNraXBwZWRcXHgxYlswbScpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBjb25zdHJ1Y3RvcmAgbmFtZS4gSWYgaW52b2tlZCBhcyB0aGUgY29udGV4dCwgb3IgYHRoaXNgLFxuICAgKiBvYmplY3Qgb2YgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBPYmplY3RgJ3MgYHByb3RvdHlwZWAsIHRoZSByZXN1bHRpbmdcbiAgICogdmFsdWUgd2lsbCBiZSBgW29iamVjdCBNeUNsYXNzXWAsIGdpdmVuIGFuIGluc3RhbmNlIG9mIGBNeUNsYXNzYFxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggFtTeW1ib2wudG9TdHJpbmdUYWddXG4gICAqIEBtZW1iZXJvZiBNb2R1bGVQYXJzZXJcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgY2xhc3MgdGhpcyBpcyBhbiBpbnN0YW5jZSBvZlxuICAgKiBAQ29tcHV0ZWRUeXBlXG4gICAqL1xuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7IHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzYW1lIGxvZ2ljIGFzIHtAbGluayAjW1N5bWJvbC50b1N0cmluZ1RhZ119IGJ1dCBvbiBhIHN0YXRpY1xuICAgKiBzY2FsZS4gU28sIGlmIHlvdSBwZXJmb3JtIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoTXlDbGFzcylgXG4gICAqIHRoZSByZXN1bHQgd291bGQgYmUgYFtvYmplY3QgTXlDbGFzc11gLlxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggFtTeW1ib2wudG9TdHJpbmdUYWddXG4gICAqIEBtZW1iZXJvZiBNb2R1bGVQYXJzZXJcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBuYW1lIG9mIHRoaXMgY2xhc3NcbiAgICogQENvbXB1dGVkVHlwZVxuICAgKi9cbiAgc3RhdGljIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IHdhbGtzIGEgZGlyZWN0b3J5IGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFzYm9sdXRlIGZpbGUgcGF0aHNcbiAgICogdG8gdGhlIGZpbGVzIHVuZGVyIHRoZSBzcGVjaWZpZWQgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAbWV0aG9kIE1vZHVsZVBhcnNlcn7ijL7ioIB3YWxrXG4gICAqIEBhc3luY1xuICAgKiBAc2luY2UgMi43LjBcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRpciBzdHJpbmcgcGF0aCB0byB0aGUgdG9wIGxldmVsIGRpcmVjdG9yeSB0byBwYXJzZVxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGZpbGVsaXN0IGFuIGFycmF5IG9mIGV4aXN0aW5nIGFic29sdXRlIGZpbGUgcGF0aHMsXG4gICAqIG9yIGlmIG5vdCBwYXJhbWV0ZXIgaXMgc3VwcGxpZWQgYSBkZWZhdWx0IGVtcHR5IGFycmF5IHdpbGwgYmUgdXNlZC5cbiAgICogQHJldHVybiB7UHJvbWlzZTxBcnJheTxzdHJpbmc+Pn0gYW4gYXJyYXkgb2YgZXhpc3RpbmcgYWJzb2x1dGUgZmlsZSBwYXRoc1xuICAgKiBmb3VuZCB1bmRlciB0aGUgc3VwcGxpZWQgYGRpcmAgZGlyZWN0b3J5LlxuICAgKi9cbiAgc3RhdGljIGFzeW5jIHdhbGsoXG4gICAgZGlyOiBzdHJpbmcsXG4gICAgZmlsZWxpc3Q6IEFycmF5PHN0cmluZz4gPSBbXSxcbiAgICBleHRlbnNpb25zOiBBcnJheTxzdHJpbmc+ID0gWycuanMnLCAnLmpzeCcsICcudHMnLCAnLnRzeCddXG4gICk6IFByb21pc2U8QXJyYXk8c3RyaW5nPj4ge1xuICAgIGxldCBmaWxlcyA9IGF3YWl0IHJlYWRkaXJBc3luYyhkaXIpO1xuICAgIGxldCBleHRzID0gTW9kdWxlUGFyc2VyLmNoZWNrRm9yUGFja2FnZUV4dGVuc2lvbnMoKSB8fCBleHRlbnNpb25zXG4gICAgbGV0IHBhdHRlcm4gPSBNb2R1bGVQYXJzZXIuYXJyYXlUb1BhdHRlcm4oZXh0cylcbiAgICBsZXQgc3RhdHNcblxuICAgIGZpbGVzID0gZmlsZXMubWFwKGZpbGUgPT4gcGF0aC5yZXNvbHZlKHBhdGguam9pbihkaXIsIGZpbGUpKSlcblxuICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgIHN0YXRzID0gYXdhaXQgc3RhdEFzeW5jKGZpbGUpXG4gICAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICBmaWxlbGlzdCA9IGF3YWl0IHRoaXMud2FsayhmaWxlLCBmaWxlbGlzdClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAocGF0dGVybi50ZXN0KHBhdGguZXh0bmFtZShmaWxlKSkpXG4gICAgICAgICAgZmlsZWxpc3QgPSBmaWxlbGlzdC5jb25jYXQoZmlsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbGVsaXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IHdhbGtzIGEgZGlyZWN0b3J5IGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFzYm9sdXRlIGZpbGUgcGF0aHNcbiAgICogdG8gdGhlIGZpbGVzIHVuZGVyIHRoZSBzcGVjaWZpZWQgZGlyZWN0b3J5LiBUaGlzIHZlcnNpb24gZG9lcyB0aGlzIGluIGFcbiAgICogc3luY2hyb25vdXMgZmFzaGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBNb2R1bGVQYXJzZXJ+4oy+4qCAd2Fsa1N5bmNcbiAgICogQGFzeW5jXG4gICAqIEBzaW5jZSAyLjcuMFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGlyIHN0cmluZyBwYXRoIHRvIHRoZSB0b3AgbGV2ZWwgZGlyZWN0b3J5IHRvIHBhcnNlXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZmlsZWxpc3QgYW4gYXJyYXkgb2YgZXhpc3RpbmcgYWJzb2x1dGUgZmlsZSBwYXRocyxcbiAgICogb3IgaWYgbm90IHBhcmFtZXRlciBpcyBzdXBwbGllZCBhIGRlZmF1bHQgZW1wdHkgYXJyYXkgd2lsbCBiZSB1c2VkLlxuICAgKiBAcmV0dXJuIHtBcnJheTxzdHJpbmc+fSBhbiBhcnJheSBvZiBleGlzdGluZyBhYnNvbHV0ZSBmaWxlIHBhdGhzIGZvdW5kXG4gICAqIHVuZGVyIHRoZSBzdXBwbGllZCBgZGlyYCBkaXJlY3RvcnkuXG4gICAqL1xuICBzdGF0aWMgd2Fsa1N5bmMoXG4gICAgZGlyOiBzdHJpbmcsXG4gICAgZmlsZWxpc3Q6IEFycmF5PHN0cmluZz4gPSBbXSxcbiAgICBleHRlbnNpb25zOiBBcnJheTxzdHJpbmc+ID0gWycuanMnLCAnLmpzeCcsICcudHMnLCAnLnRzeCddXG4gICk6IEFycmF5PHN0cmluZz4ge1xuICAgIGxldCBmaWxlcyA9IHJlYWRkaXJTeW5jKGRpcilcbiAgICBsZXQgZXh0cyA9IE1vZHVsZVBhcnNlci5jaGVja0ZvclBhY2thZ2VFeHRlbnNpb25zKCkgfHwgZXh0ZW5zaW9uc1xuICAgIGxldCBwYXR0ZXJuID0gTW9kdWxlUGFyc2VyLmFycmF5VG9QYXR0ZXJuKGV4dHMpXG4gICAgbGV0IHN0YXRzXG5cbiAgICBmaWxlcyA9IGZpbGVzLm1hcChmaWxlID0+IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oZGlyLCBmaWxlKSkpXG5cbiAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBzdGF0cyA9IHN0YXRTeW5jKGZpbGUpXG4gICAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICBmaWxlbGlzdCA9IHRoaXMud2Fsa1N5bmMoZmlsZSwgZmlsZWxpc3QpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKHBhdHRlcm4udGVzdChwYXRoLmV4dG5hbWUoZmlsZSkpKVxuICAgICAgICAgIGZpbGVsaXN0ID0gZmlsZWxpc3QuY29uY2F0KGZpbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmaWxlbGlzdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgTW9kdWxlUGFyc2VyIHNob3VsZCBvbmx5IHBhcnNlIGZpbGVzIHRoYXQgbWF0Y2ggdGhlIGRlZmF1bHQgb3JcbiAgICogc3VwcGxpZWQgZmlsZSBleHRlbnNpb25zLiBUaGUgZGVmYXVsdCBsaXN0IGNvbnRhaW5zIC5qcywgLmpzeCwgLnRzXG4gICAqIGFuZCAudHN4OyBzbyBKYXZhU2NyaXB0IG9yIFR5cGVTY3JpcHQgZmlsZXMgYW5kIHRoZWlyIEpTWCBSZWFjdFxuICAgKiBjb3VudGVycGFydHNcbiAgICpcbiAgICogU2luY2UgdGhlIGxpc3QgaXMgY3VzdG9taXphYmxlIGZvciBhIHVzYWdlLCBob3dldmVyLCBpdCBtYWtlcyBzZW5zZVxuICAgKiB0byBoYXZlIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG1hdGNoIHdoYXQgaXMgc3VwcGxpZWQgcmF0aGVyIHRoYW5cbiAgICogY3JlYXRpbmcgYSBjb25zdGFudCBleHByZXNzaW9uIHRvIHVzZSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBNb2R1bGVQYXJzZXJcbiAgICogQGZ1bmN0aW9uIOKMvuKggGFycmF5VG9QYXR0ZXJuXG4gICAqIEBzaW5jZSAyLjEzLjBcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBleHRlbnNpb25zIGFuIGFycmF5IG9mIGV4dGVuc2lvbnMgdG9cbiAgICogY29udmVydCB0byBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IHdvdWxkIHBhc3MgZm9yIGVhY2hcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZsYWdzIHRoZSB2YWx1ZSBwYXNzZWQgdG8gYSBuZXcgUmVnRXhwIGRlbm90aW5nIHRoZVxuICAgKiBmbGFncyB1c2VkIGluIHRoZSBwYXR0ZXJuOyBkZWZhdWx0cyB0byAnaScgZm9yIGNhc2UgaW5zZW5zaXRpdml0eVxuICAgKiBAcmV0dXJuIHtSZWdFeHB9IGEgcmVndWxhciBleHByZXNzaW9uIG9iamVjdCBtYXRjaGluZyB0aGUgY29udGVudHNcbiAgICogb2YgdGhlIGFycmF5IG9mIGV4dGVuc2lvbnMgb3IgdGhlIGRlZmF1bHQgZXh0ZW5zaW9ucyBhbmQgdGhhdCB3aWxsXG4gICAqIGFsc28gbWF0Y2ggdGhvc2UgdmFsdWVzIGluIGEgY2FzZSBpbnNlbnNpdGl2ZSBtYW5uZXJcbiAgICovXG4gIHN0YXRpYyBhcnJheVRvUGF0dGVybihcbiAgICBleHRlbnNpb25zOiBBcnJheTxzdHJpbmc+ID0gWycuanMnLCAnLmpzeCcsICcudHMnLCAnLnRzeCddLFxuICAgIGZsYWdzOiBzdHJpbmcgPSAnaSdcbiAgKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoXG4gICAgICBleHRlbnNpb25zXG4gICAgICAgIC5qb2luKCd8JylcbiAgICAgICAgLnJlcGxhY2UoL1xcLi9nLCAnXFxcXC4nKVxuICAgICAgICAucmVwbGFjZSgvKFtcXHwkXSkvZywgJ1xcXFxiJDEnKSxcbiAgICAgIGZsYWdzXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFVzaW5nIHRoZSBtb2R1bGUgYHJlYWQtcGtnLXVwYCwgZmluZHMgdGhlIG5lYXJlc3QgcGFja2FnZS5qc29uIGZpbGVcbiAgICogYW5kIGNoZWNrcyB0byBzZWUgaWYgaXQgaGFzIGEgYC5sYXR0aWNlLm1vZHVsZVBhcnNlci5leHRlbnNpb25zJ1xuICAgKiBwcmVmZXJlbmNlLiBJZiBzbywgaWYgdGhlIHZhbHVlIGlzIGFuIGFycmF5LCB0aGF0IHZhbHVlIGlzIHVzZWQsXG4gICAqIG90aGVyd2lzZSB0aGUgdmFsdWUgaXMgd3JhcHBlZCBpbiBhbiBhcnJheS4gSWYgdGhlIG9wdGlvbmFsIHBhcmFtZXRlclxuICAgKiBgdG9TdHJpbmdgIGlzIGB0cnVlYCB0aGVuIGAudG9TdHJpbmcoKWAgd2lsbCBiZSBpbnZva2VkIG9uIGFueSBub25cbiAgICogQXJyYXkgdmFsdWVzIGZvdW5kOyB0aGlzIGJlaGF2aW9yIGlzIHRoZSBkZWZhdWx0XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIE1vZHVsZVBhcnNlclxuICAgKiBAbWV0aG9kIOKMvuKggGNoZWNrRm9yUGFja2FnZUV4dGVuc2lvbnNcbiAgICogQHNpbmNlIDIuMTMuMFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRvU3RyaW5nIHRydWUgaWYgYW55IG5vbi1hcnJheSB2YWx1ZXMgc2hvdWxkIGhhdmVcbiAgICogdGhlaXIgYC50b1N0cmluZygpYCBtZXRob2QgaW52b2tlZCBiZWZvcmUgYmVpbmcgd3JhcHBlZCBpbiBhbiBBcnJheTtcbiAgICogZGVmYXVsdHMgdG8gdHJ1ZVxuICAgKiBAcmV0dXJuIHs/QXJyYXk8c3RyaW5nPn0gbnVsbCBpZiBubyB2YWx1ZSBpcyBzZXQgZm9yIHRoZSBwcm9wZXJ0eVxuICAgKiBgbGF0dGljZS5Nb2R1bGVQYXJzZXIuZXh0ZW5zaW9uc2AgaW4gYHBhY2thZ2UuanNvbmAgb3IgdGhlIHZhbHVlXG4gICAqIG9mIHRoZSBzZXR0aW5nIGlmIGl0IGlzIGFuIGFycmF5LiBGaW5hbGx5IGlmIHRoZSB2YWx1ZSBpcyBzZXQgYnV0IGlzXG4gICAqIG5vdCBhbiBhcnJheSwgdGhlIHNwZWNpZmllZCB2YWx1ZSB3cmFwcGVkIGluIGFuIGFycmF5IGlzIHJldHVybmVkXG4gICAqL1xuICBzdGF0aWMgY2hlY2tGb3JQYWNrYWdlRXh0ZW5zaW9ucyh0b1N0cmluZzogYm9vbGVhbiA9IHRydWUpOiA/QXJyYXk8c3RyaW5nPiB7XG4gICAgbGV0IHBrZyA9IGdldExhdHRpY2VQcmVmcygpXG4gICAgbGV0IGV4dGVuc2lvbnMgPSBudWxsXG5cbiAgICBpZiAocGtnLk1vZHVsZVBhcnNlciAmJiBwa2cuTW9kdWxlUGFyc2VyLmV4dGVuc2lvbnMpIHtcbiAgICAgIGxldCBwYWNrYWdlRXh0cyA9IHBrZy5Nb2R1bGVQYXJzZXIuZXh0ZW5zaW9uc1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYWNrYWdlRXh0cykpIHtcbiAgICAgICAgZXh0ZW5zaW9ucyA9IHBhY2thZ2VFeHRzXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZXh0ZW5zaW9ucyA9IFt0b1N0cmluZyA/IHBhY2thZ2VFeHRzLnRvU3RyaW5nKCkgOiBwYWNrYWdlRXh0c11cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZXh0ZW5zaW9uc1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZHVsZVBhcnNlcjtcbiJdfQ==