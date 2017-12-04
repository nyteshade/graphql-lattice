'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleParser = undefined;

var _toStringTag = require('babel-runtime/core-js/symbol/to-string-tag');

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _types = require('./types');

var types = _interopRequireWildcard(_types);

var _GQLBase = require('./GQLBase');

var _GQLJSON = require('./types/GQLJSON');

var _lodash = require('lodash');

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Promisify some bits
var readdirAsync = (0, _utils.promisify)(_fs2.default.readdir);

var statAsync = (0, _utils.promisify)(_fs2.default.stat);

// Fetch some type checking bits from 'types'
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

var ModuleParser = exports.ModuleParser = function () {

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


  /**
   * A boolean value denoting whether or not the `ModuleParser` instance is
   * valid; i.e. the directory it points to actually exists and is a directory
   *
   * @type {boolean}
   */


  /**
   * A map of skipped items on the last pass and the associated error that
   * accompanies it.
   */
  function ModuleParser(directory) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { addLatticeTypes: true };
    (0, _classCallCheck3.default)(this, ModuleParser);
    Object.defineProperty(this, 'options', {
      enumerable: true,
      writable: true,
      value: {}
    });

    this.directory = _path2.default.resolve(directory);
    this.classes = [];
    this.skipped = new _map2.default();

    (0, _lodash.merge)(this.options, options);

    try {
      this.valid = _fs2.default.statSync(directory).isDirectory();
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


  /**
   * An object, optionally added during construction, that specifies some
   * configuration about the ModuleParser and how it should do its job.
   *
   * Initially, the
   *
   * @type {Object}
   */


  /**
   * A string denoting the directory on disk where `ModuleParser` should be
   * searching for its classes.
   *
   * @memberof ModuleParser
   * @type {string}
   */

  /**
   * An internal array of `GQLBase` extended classes found during either a
   * `parse()` or `parseSync()` call.
   *
   * @memberof ModuleParser
   * @type {Array<GQLBase>}
   */


  (0, _createClass3.default)(ModuleParser, [{
    key: 'importClass',
    value: function importClass(filePath) {
      var moduleContents = {};
      var yellow = '\x1b[33m';
      var clear = '\x1b[0m';

      try {
        moduleContents = require(filePath);
      } catch (ignore) {
        _utils.LatticeLogs.log(`${yellow}Skipping${clear} ${filePath}`);
        _utils.LatticeLogs.trace(ignore);
        this.skipped.set(filePath, ignore);
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
    key: 'findGQLBaseClasses',
    value: function findGQLBaseClasses(contents) {
      var gqlDefinitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var stack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _set2.default();

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
      }

      // We remove the current iterable from our set as we leave this current
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
    key: 'parse',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var _this = this;

        var modules, files, set, opts;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                modules = void 0;
                files = void 0;
                set = new _set2.default();
                opts = (0, _utils.getLatticePrefs)();

                if (this.valid) {
                  _context.next = 6;
                  break;
                }

                throw new Error(`
        ModuleParser instance is invalid for use with ${this.directory}.
        The path is either a non-existent path or it does not represent a
        directory.
      `);

              case 6:

                this.skipped.clear();

                // @ComputedType
                _context.next = 9;
                return this.constructor.walk(this.directory);

              case 9:
                files = _context.sent;

                modules = files.map(function (file) {
                  return _this.importClass(file);
                })

                // @ComputedType
                (modules.map(function (mod) {
                  return _this.findGQLBaseClasses(mod);
                }).reduce(function (last, cur) {
                  return (last || []).concat(cur || []);
                }, []).forEach(function (Class) {
                  return set.add(Class);
                }));

                // Convert the set back into an array
                this.classes = (0, _from2.default)(set);

                // We can ignore equality since we came from a set; @ComputedType
                this.classes.sort(function (l, r) {
                  return l.name < r.name ? -1 : 1;
                });

                // Add in any GraphQL Lattice types requested
                if (this.options.addLatticeTypes) {
                  this.classes.push(_GQLJSON.GQLJSON);
                }

                // Stop flow and throw an error if some files failed to load and settings
                // declare we should do so. After Lattice 3.x we should expect this to be
                // the new default

                if (!(opts.ModuleParser.failOnError && this.skipped.size)) {
                  _context.next = 17;
                  break;
                }

                this.printSkipped();
                throw new Error('Some files skipped due to errors');

              case 17:
                return _context.abrupt('return', this.classes);

              case 18:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function parse() {
        return _ref.apply(this, arguments);
      }

      return parse;
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
    key: 'parseSync',
    value: function parseSync() {
      var _this2 = this;

      var modules = void 0;
      var files = void 0;
      var set = new _set2.default();
      var opts = (0, _utils.getLatticePrefs)();

      if (!this.valid) {
        throw new Error(`
        ModuleParser instance is invalid for use with ${this.directory}.
        The path is either a non-existent path or it does not represent a
        directory.
      `);
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
      });

      // Convert the set back into an array
      this.classes = (0, _from2.default)(set);

      // We can ignore equality since we came from a set; @ComputedType
      this.classes.sort(function (l, r) {
        return l.name < r.name ? -1 : 1;
      });

      // Add in any GraphQL Lattice types requested
      if (this.options.addLatticeTypes) {
        this.classes.push(_GQLJSON.GQLJSON);
      }

      // Stop flow and throw an error if some files failed to load and settings
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
    key: 'printSkipped',
    value: function printSkipped() {
      if (this.skipped.size) {
        _utils.LatticeLogs.outWrite('\x1b[1;91m');
        _utils.LatticeLogs.outWrite('Skipped\x1b[0;31m the following files\n');

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(this.skipped), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref2 = _step.value;

            var _ref3 = (0, _slicedToArray3.default)(_ref2, 2);

            var key = _ref3[0];
            var value = _ref3[1];

            _utils.LatticeLogs.log(`${_path2.default.basename(key)}: ${value.message}`);
            if (value.stack) _utils.LatticeLogs.log(value.stack.replace(/(^)/m, '$1  '));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
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
    key: _toStringTag2.default,
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
    key: 'walk',


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
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(dir) {
        var filelist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var extensions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['.js', '.jsx', '.ts', '.tsx'];

        var files, exts, pattern, stats, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, file;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return readdirAsync(dir);

              case 2:
                files = _context2.sent;
                exts = ModuleParser.checkForPackageExtensions() || extensions;
                pattern = ModuleParser.arrayToPattern(exts);
                stats = void 0;


                files = files.map(function (file) {
                  return _path2.default.resolve(_path2.default.join(dir, file));
                });

                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 10;
                _iterator2 = (0, _getIterator3.default)(files);

              case 12:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context2.next = 27;
                  break;
                }

                file = _step2.value;
                _context2.next = 16;
                return statAsync(file);

              case 16:
                stats = _context2.sent;

                if (!stats.isDirectory()) {
                  _context2.next = 23;
                  break;
                }

                _context2.next = 20;
                return this.walk(file, filelist);

              case 20:
                filelist = _context2.sent;
                _context2.next = 24;
                break;

              case 23:
                if (pattern.test(_path2.default.extname(file))) filelist = filelist.concat(file);

              case 24:
                _iteratorNormalCompletion2 = true;
                _context2.next = 12;
                break;

              case 27:
                _context2.next = 33;
                break;

              case 29:
                _context2.prev = 29;
                _context2.t0 = _context2['catch'](10);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 33:
                _context2.prev = 33;
                _context2.prev = 34;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 36:
                _context2.prev = 36;

                if (!_didIteratorError2) {
                  _context2.next = 39;
                  break;
                }

                throw _iteratorError2;

              case 39:
                return _context2.finish(36);

              case 40:
                return _context2.finish(33);

              case 41:
                return _context2.abrupt('return', filelist);

              case 42:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[10, 29, 33, 41], [34,, 36, 40]]);
      }));

      function walk(_x6) {
        return _ref4.apply(this, arguments);
      }

      return walk;
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
    key: 'walkSync',
    value: function walkSync(dir) {
      var filelist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var extensions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['.js', '.jsx', '.ts', '.tsx'];

      var files = (0, _fs.readdirSync)(dir);
      var exts = ModuleParser.checkForPackageExtensions() || extensions;
      var pattern = ModuleParser.arrayToPattern(exts);
      var stats = void 0;

      files = files.map(function (file) {
        return _path2.default.resolve(_path2.default.join(dir, file));
      });

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(files), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var file = _step3.value;

          stats = (0, _fs.statSync)(file);
          if (stats.isDirectory()) {
            filelist = this.walkSync(file, filelist);
          } else {
            if (pattern.test(_path2.default.extname(file))) filelist = filelist.concat(file);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
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
    key: 'arrayToPattern',
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
    key: 'checkForPackageExtensions',
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
    key: _toStringTag2.default,
    get: function get() {
      return this.name;
    }
  }]);
  return ModuleParser;
}();

exports.default = ModuleParser;
//# sourceMappingURL=ModuleParser.js.map