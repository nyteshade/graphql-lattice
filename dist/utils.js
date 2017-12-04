'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LatticeLogs = exports.Deferred = exports.joinLines = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _neTagFns = require('ne-tag-fns');

Object.defineProperty(exports, 'joinLines', {
  enumerable: true,
  get: function get() {
    return _neTagFns.dedent;
  }
});
exports.promisify = promisify;
exports.getLatticePrefs = getLatticePrefs;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _types = require('./types');

var _readPkgUp = require('read-pkg-up');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Stats = _fs2.default.Stats;

/**
 * Deferred is modeled after jQuery's deferred object. It inverts a promise
 * such that its resolve and reject methods can be invoked without wrapping
 * all of the related code within a Promise's function.
 *
 * @memberof utils
 * @class Deferred
 */

var Deferred = exports.Deferred = function () {

  /**
   * Creates an object with four properties of note; promise, resolve, reject
   * and a flag complete that will be set once either resolve or reject have
   * been called. A Deferred is considered to be pending while complete is set
   * to false.
   *
   * Once constructed, resolve and reject can be called later, at which point,
   * the promise is completed. The promise property is the promise resolved
   * or rejected by the associated properties and can be used with other
   * async/await or Promise based code.
   *
   * @instance
   * @memberof Deferred
   * @method ⎆⠀constructor
   *
   * @param {any} resolveWith a deferred resolved as Promise.resolve() might do
   * @param {any} rejectWith a deferred rejected as Promise.reject() might do
   */


  /**
   * This is the promise wrapped by and inverted in this deferred instance
   *
   * @type {Promise}
   * @memberof Deferred
   * @instance
   */

  /**
   * This property holds a `resolve` function from within the promise this
   * deferred inverts.
   *
   * @type {Function}
   * @memberof Deferred
   * @instance
   */
  function Deferred(resolveWith, rejectWith) {
    var _this = this;

    (0, _classCallCheck3.default)(this, Deferred);

    this.promise = new _promise2.default(function (resolve, reject) {
      _this.complete = false;

      _this.resolve = function () {
        _this.complete = true;
        return resolve.apply(undefined, arguments);
      };

      _this.reject = function () {
        _this.complete = true;
        return reject.apply(undefined, arguments);
      };

      if (resolveWith && !rejectWith) {
        _this.resolve(resolveWith);
      }
      if (rejectWith && !resolveWith) {
        _this.reject(rejectWith);
      }
    });
  }

  /**
   * Shorthand getter that denotes true if the deferred is not yet complete.
   *
   * @instance
   * @memberof Deferred
   * @method ⬇︎⠀pending
   *
   * @return {boolean} true if the promise is not yet complete; false otherwise
   */


  /**
   * An at a glance boolean property that denotes whether or not this
   * deferred has been resolved or rejected yet.
   *
   * @type {boolean}
   * @memberof Deferred
   * @instance
   */


  /**
   * This property holds a `reject` function from within the promise this
   * deferred inverts
   *
   * @type {Function}
   * @memberof Deferred
   * @instance
   */


  (0, _createClass3.default)(Deferred, [{
    key: 'pending',
    get: function get() {
      return !this.complete;
    }

    /**
     * Promises are great but if the code never resolves or rejects a deferred,
     * then things will become eternal; in a bad way. This makes that less likely
     * of an event.
     *
     * If the number of milliseconds elapses before a resolve or reject occur,
     * then the deferred is rejected.
     *
     * @static
     * @memberof Deferred
     * @method ⌾⠀TimedDeferred
     *
     * @param {Number} timeOut a number of milliseconds to wait before rejecting
     * the deferred.
     * @param {Promise} proxyPromise a promise to proxy then/catch through to the
     * deferreds resolve/reject.
     * @return {Deferred} an instance of deferred that will timeout after
     * `timeOut` milliseconds have elapsed. If `proxyPromise` is a `Promise`
     * then the deferred's reject and resolve will be tied to the Promise's
     * catch() and then() methods, respectively.
     */

  }], [{
    key: 'TimedDeferred',
    value: function TimedDeferred(timeOut, proxyPromise) {
      var deferred = new Deferred();

      if (proxyPromise && (0, _types.typeOf)(proxyPromise) === _promise2.default.name) {
        proxyPromise.then(function () {
          return deferred.resolve.apply(deferred, arguments);
        });
        proxyPromise.catch(function (reason) {
          return deferred.reject(reason);
        });
      }

      setTimeout(function () {
        return deferred.reject(new Error('Deferred timed out'), timeOut);
      });

      return deferred;
    }
  }]);
  return Deferred;
}();

/**
 * A simply promisify style function that returns an async function wrapped
 * around a supplied function designed for the standard callback methodology.
 * If the callback is the last parameter, and that callback is in the form of
 * (error, ...results) then this wrapper will do the trick for you.
 *
 * @method utils~⌾⠀promisify
 * @since 2.7.0
 *
 * @param {Function} method a function to wrap in an asynchronous function
 * @param {mixed} context an optional `this` object for use with the supplied
 * function.
 * @return {Function} an asynchronous function, i.e. one that returns a promise
 * containing the contents the callback results, that wraps the supplied
 * function.
 */


function promisify(method, context) {
  return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
              args.push(function (error) {
                if (error) {
                  reject(error);
                } else {
                  for (var _len2 = arguments.length, callbackArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    callbackArgs[_key2 - 1] = arguments[_key2];
                  }

                  resolve.apply(undefined, callbackArgs);
                }
              });

              method.apply(context, args);
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}

/**
 * It may be necessary to read GraphQL Lattice preferences from the nearest
 * `package.json` object to the excuting code. `getLatticePrefs()` does this
 * and merges any subsequently found options in said file on top of the
 * default values specified here in this file.
 *
 * @method utils~⌾⠀getLatticePrefs
 * @since 2.13.0
 *
 * @return {Object} an object containing at least the defaults plus any other
 * values specified in `package.json`
 */
function getLatticePrefs(readPkgUpOpts) {
  var _readPkg = (0, _readPkgUp.sync)(readPkgUpOpts),
      pkg = _readPkg.pkg;

  var options = {
    ModuleParser: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      failOnError: false
    }
  };

  if (pkg.lattice) {
    (0, _lodash.merge)(options, pkg.lattice || {});
  }

  return options;
}

/**
 * A small near pass-thru facility for logging within Lattice such that error
 * objects supplied get mapped to their message unless `LATTICE_ERRORS=STACK`
 * is set in `process.env`.
 *
 * Note the order of log levels for Lattice may be somewhat non-standard. Info
 * has been taken out of flow and placed above error to solve issues with jest
 * logging.
 *
 * @memberof utils
 * @type Object
 * @static
 */
var LatticeLogs = exports.LatticeLogs = {
  get LOG() {
    return 'log';
  },

  get WARN() {
    return 'warn';
  },

  get ERROR() {
    return 'error';
  },

  get INFO() {
    return 'info';
  },

  get TRACE() {
    return 'trace';
  },

  /**
   * Ordering of log levels for LatticeLogs. `INFO` is a non error log level
   * that is non-crucial and appears if LATTICE_LOGLEVEL is set to `INFO` or
   * `TRACE`
   */
  get LEVELS() {
    var ll = LatticeLogs;

    return [ll.LOG, ll.WARN, ll.ERROR, ll.INFO, ll.TRACE];
  },

  equalOrBelow(testedLevel) {
    var lessThan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'error';

    var ll = LatticeLogs;

    return ll.LEVELS.indexOf(testedLevel) <= ll.LEVELS.indexOf(lessThan);
  },

  atLeast(testedLevel, atLeastLevel) {
    var ll = LatticeLogs;

    return ll.LEVELS.indexOf(testedLevel) >= ll.LEVELS.indexOf(atLeastLevel);
  },

  /**
   * All arguments of any logging function in `LatticeLogs` get passed through
   * this function first to modify or alter the type of value being logged.
   *
   * @param {mixed} arg the argument being passed to the `map()` function
   * @param {number} index the index in the array of arguments
   * @param {Array<mixed>} array the array containing this element
   */
  argMapper(arg, index, array) {
    var isError = (0, _types.typeOf)(arg) === Error.name;
    var showStack = /\bSTACK\b/i.test(process.env.LATTICE_ERRORS || '');

    // $FlowFixMe
    return !isError ? arg : showStack ? arg : arg.message;
  },

  /** A function that, when it returns true, will cause logging to be skipped */
  failFast(logLevel, lessThan) {
    var ll = LatticeLogs;

    if (logLevel) {
      var compareTo = lessThan || process.env.LATTICE_LOGLEVEL || ll.ERROR;
      if (!ll.equalOrBelow(logLevel, compareTo)) return true;
    }

    return (/\b(NONE|OFF|NO|0)\b/i.test(process.env.LATTICE_ERRORS || '')
    );
  },

  /** Pass-thru to console.log; arguments parsed via `argMapper` */
  log() {
    var _console;

    if (LatticeLogs.failFast(LatticeLogs.LOG)) return;

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    (_console = console).log.apply(_console, (0, _toConsumableArray3.default)(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.warn; arguments parsed via `argMapper` */
  warn() {
    var _console2;

    if (LatticeLogs.failFast(LatticeLogs.WARN)) return;

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    (_console2 = console).warn.apply(_console2, (0, _toConsumableArray3.default)(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.error; arguments parsed via `argMapper` */
  error() {
    var _console3;

    if (LatticeLogs.failFast(LatticeLogs.ERROR)) return;

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    (_console3 = console).error.apply(_console3, (0, _toConsumableArray3.default)(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.info; arguments parsed via `argMapper` */
  info() {
    var _console4;

    if (LatticeLogs.failFast(LatticeLogs.INFO)) return;

    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    (_console4 = console).info.apply(_console4, (0, _toConsumableArray3.default)(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.trace; arguments parsed via `argMapper` */
  trace() {
    var _console5;

    if (LatticeLogs.failFast(LatticeLogs.TRACE)) return;

    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    (_console5 = console).trace.apply(_console5, (0, _toConsumableArray3.default)(args.map(LatticeLogs.argMapper)));
  },

  outWrite(chunk, encoding, callback) {
    if (LatticeLogs.failFast(LatticeLogs.LOG)) return;
    // $FlowFixMe
    process.stdout.write(chunk, encoding, callback);
  },

  errWrite(chunk, encoding, callback) {
    if (LatticeLogs.failFast(LatticeLogs.ERROR)) return;
    // $FlowFixMe
    process.stderr.write(chunk, encoding, callback);
  }
};
//# sourceMappingURL=utils.js.map