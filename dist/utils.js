"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisify = promisify;
exports.getLatticePrefs = getLatticePrefs;
Object.defineProperty(exports, "joinLines", {
  enumerable: true,
  get: function get() {
    return _neTagFns.dedent;
  }
});
exports.LatticeLogs = exports.Deferred = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _neTypes = require("ne-types");

var _readPkgUp = require("read-pkg-up");

var _lodash = require("lodash");

var _neTagFns = require("ne-tag-fns");

/** @namespace utils */
var Stats = _fs.default.Stats;
/**
 * Deferred is modeled after jQuery's deferred object. It inverts a promise
 * such that its resolve and reject methods can be invoked without wrapping
 * all of the related code within a Promise's function.
 *
 * @memberof utils
 * @class Deferred
 */

var Deferred =
/*#__PURE__*/
function () {
  /**
   * This property holds a `resolve` function from within the promise this
   * deferred inverts.
   *
   * @type {Function}
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

  /**
   * This is the promise wrapped by and inverted in this deferred instance
   *
   * @type {Promise}
   * @memberof Deferred
   * @instance
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
  function Deferred(resolveWith, rejectWith) {
    var _this = this;

    (0, _classCallCheck2.default)(this, Deferred);
    this.promise = new Promise(function (resolve, reject) {
      _this.complete = false;

      _this.resolve = function () {
        _this.complete = true;
        return resolve.apply(void 0, arguments);
      };

      _this.reject = function () {
        _this.complete = true;
        return reject.apply(void 0, arguments);
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


  (0, _createClass2.default)(Deferred, [{
    key: "pending",
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
    key: "TimedDeferred",
    value: function TimedDeferred(timeOut, proxyPromise) {
      var deferred = new Deferred();

      if (proxyPromise && (0, _neTypes.typeOf)(proxyPromise) === Promise.name) {
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


exports.Deferred = Deferred;

function promisify(method, context) {
  return (
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var _len,
          args,
          _key,
          _args = arguments;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = _args[_key];
              }

              return _context.abrupt("return", new Promise(function (resolve, reject) {
                args.push(function (error) {
                  if (error) {
                    reject(error);
                  } else {
                    for (var _len2 = arguments.length, callbackArgs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                      callbackArgs[_key2 - 1] = arguments[_key2];
                    }

                    resolve.apply(void 0, callbackArgs);
                  }
                });
                method.apply(context, args);
              }));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }))
  );
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


var LatticeLogs = {
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

  equalOrBelow: function equalOrBelow(testedLevel) {
    var lessThan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'error';
    var ll = LatticeLogs;
    return ll.LEVELS.indexOf(testedLevel) <= ll.LEVELS.indexOf(lessThan);
  },
  atLeast: function atLeast(testedLevel, atLeastLevel) {
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
  argMapper: function argMapper(arg, index, array) {
    var isError = (0, _neTypes.typeOf)(arg) === Error.name;
    var showStack = /\bSTACK\b/i.test(process.env.LATTICE_ERRORS || ''); // $FlowFixMe

    return !isError ? arg : showStack ? arg : arg.message;
  },

  /** A function that, when it returns true, will cause logging to be skipped */
  failFast: function failFast(logLevel, lessThan) {
    var ll = LatticeLogs;

    if (logLevel) {
      var compareTo = lessThan || process.env.LATTICE_LOGLEVEL || ll.ERROR;
      if (!ll.equalOrBelow(logLevel, compareTo)) return true;
    }

    return /\b(NONE|OFF|NO|0)\b/i.test(process.env.LATTICE_ERRORS || '');
  },

  /** Pass-thru to console.log; arguments parsed via `argMapper` */
  log: function log() {
    var _console;

    if (LatticeLogs.failFast(LatticeLogs.LOG)) return;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    (_console = console).log.apply(_console, (0, _toConsumableArray2.default)(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.warn; arguments parsed via `argMapper` */
  warn: function warn() {
    var _console2;

    if (LatticeLogs.failFast(LatticeLogs.WARN)) return;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    (_console2 = console).warn.apply(_console2, (0, _toConsumableArray2.default)(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.error; arguments parsed via `argMapper` */
  error: function error() {
    var _console3;

    if (LatticeLogs.failFast(LatticeLogs.ERROR)) return;

    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    (_console3 = console).error.apply(_console3, (0, _toConsumableArray2.default)(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.info; arguments parsed via `argMapper` */
  info: function info() {
    var _console4;

    if (LatticeLogs.failFast(LatticeLogs.INFO)) return;

    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    (_console4 = console).info.apply(_console4, (0, _toConsumableArray2.default)(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.trace; arguments parsed via `argMapper` */
  trace: function trace() {
    var _console5;

    if (LatticeLogs.failFast(LatticeLogs.TRACE)) return;

    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    (_console5 = console).trace.apply(_console5, (0, _toConsumableArray2.default)(args.map(LatticeLogs.argMapper)));
  },
  outWrite: function outWrite(chunk, encoding, callback) {
    if (LatticeLogs.failFast(LatticeLogs.LOG)) return; // $FlowFixMe

    process.stdout.write(chunk, encoding, callback);
  },
  errWrite: function errWrite(chunk, encoding, callback) {
    if (LatticeLogs.failFast(LatticeLogs.ERROR)) return; // $FlowFixMe

    process.stderr.write(chunk, encoding, callback);
  }
};
exports.LatticeLogs = LatticeLogs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi91dGlscy5qcyJdLCJuYW1lcyI6WyJTdGF0cyIsImZzIiwiRGVmZXJyZWQiLCJyZXNvbHZlV2l0aCIsInJlamVjdFdpdGgiLCJwcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjb21wbGV0ZSIsInRpbWVPdXQiLCJwcm94eVByb21pc2UiLCJkZWZlcnJlZCIsIm5hbWUiLCJ0aGVuIiwiY2F0Y2giLCJyZWFzb24iLCJzZXRUaW1lb3V0IiwiRXJyb3IiLCJwcm9taXNpZnkiLCJtZXRob2QiLCJjb250ZXh0IiwiYXJncyIsInB1c2giLCJlcnJvciIsImNhbGxiYWNrQXJncyIsImFwcGx5IiwiZ2V0TGF0dGljZVByZWZzIiwicmVhZFBrZ1VwT3B0cyIsInBrZyIsIm9wdGlvbnMiLCJNb2R1bGVQYXJzZXIiLCJleHRlbnNpb25zIiwiZmFpbE9uRXJyb3IiLCJsYXR0aWNlIiwiTGF0dGljZUxvZ3MiLCJMT0ciLCJXQVJOIiwiRVJST1IiLCJJTkZPIiwiVFJBQ0UiLCJMRVZFTFMiLCJsbCIsImVxdWFsT3JCZWxvdyIsInRlc3RlZExldmVsIiwibGVzc1RoYW4iLCJpbmRleE9mIiwiYXRMZWFzdCIsImF0TGVhc3RMZXZlbCIsImFyZ01hcHBlciIsImFyZyIsImluZGV4IiwiYXJyYXkiLCJpc0Vycm9yIiwic2hvd1N0YWNrIiwidGVzdCIsInByb2Nlc3MiLCJlbnYiLCJMQVRUSUNFX0VSUk9SUyIsIm1lc3NhZ2UiLCJmYWlsRmFzdCIsImxvZ0xldmVsIiwiY29tcGFyZVRvIiwiTEFUVElDRV9MT0dMRVZFTCIsImxvZyIsImNvbnNvbGUiLCJtYXAiLCJ3YXJuIiwiaW5mbyIsInRyYWNlIiwib3V0V3JpdGUiLCJjaHVuayIsImVuY29kaW5nIiwiY2FsbGJhY2siLCJzdGRvdXQiLCJ3cml0ZSIsImVycldyaXRlIiwic3RkZXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQTs7QUFDQTs7QUFDQTs7QUFD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QXpHdUIsRUEwR3ZCO0FBQ0EsUUFBSXRDLFdBQVcsQ0FBQ3lCLFFBQVosQ0FBcUJ6QixXQUFXLENBQUNHLEtBQWpDLENBQUosRUFBNkMsT0FEN0MsQ0FFQTs7QUFDQWtCLElBQUFBLE9BQU8sQ0FBQ3FCLE1BQVIsQ0FBZUYsS0FBZixDQUFxQkosS0FBckIsRUFBNEJDLFFBQTVCLEVBQXNDQyxRQUF0QztBQUNEO0FBOUd3QixDQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAbmFtZXNwYWNlIHV0aWxzICovXG4vLyBAZmxvd1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgdXRpbCBmcm9tICd1dGlsJ1xuaW1wb3J0IHsgdHlwZU9mIH0gZnJvbSAnbmUtdHlwZXMnXG5pbXBvcnQgeyBzeW5jIGFzIHJlYWRQa2cgfSBmcm9tICdyZWFkLXBrZy11cCdcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJ1xuXG5leHBvcnQgeyBkZWRlbnQgYXMgam9pbkxpbmVzIH0gZnJvbSAnbmUtdGFnLWZucydcblxuY29uc3QgeyBTdGF0cyB9ID0gZnM7XG5cbi8qKlxuICogRGVmZXJyZWQgaXMgbW9kZWxlZCBhZnRlciBqUXVlcnkncyBkZWZlcnJlZCBvYmplY3QuIEl0IGludmVydHMgYSBwcm9taXNlXG4gKiBzdWNoIHRoYXQgaXRzIHJlc29sdmUgYW5kIHJlamVjdCBtZXRob2RzIGNhbiBiZSBpbnZva2VkIHdpdGhvdXQgd3JhcHBpbmdcbiAqIGFsbCBvZiB0aGUgcmVsYXRlZCBjb2RlIHdpdGhpbiBhIFByb21pc2UncyBmdW5jdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgdXRpbHNcbiAqIEBjbGFzcyBEZWZlcnJlZFxuICovXG5leHBvcnQgY2xhc3MgRGVmZXJyZWQge1xuICAvKipcbiAgICogVGhpcyBwcm9wZXJ0eSBob2xkcyBhIGByZXNvbHZlYCBmdW5jdGlvbiBmcm9tIHdpdGhpbiB0aGUgcHJvbWlzZSB0aGlzXG4gICAqIGRlZmVycmVkIGludmVydHMuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIERlZmVycmVkXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgcmVzb2x2ZTogRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIFRoaXMgcHJvcGVydHkgaG9sZHMgYSBgcmVqZWN0YCBmdW5jdGlvbiBmcm9tIHdpdGhpbiB0aGUgcHJvbWlzZSB0aGlzXG4gICAqIGRlZmVycmVkIGludmVydHNcbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgRGVmZXJyZWRcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICByZWplY3Q6IEZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBwcm9taXNlIHdyYXBwZWQgYnkgYW5kIGludmVydGVkIGluIHRoaXMgZGVmZXJyZWQgaW5zdGFuY2VcbiAgICpcbiAgICogQHR5cGUge1Byb21pc2V9XG4gICAqIEBtZW1iZXJvZiBEZWZlcnJlZFxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHByb21pc2U6IGFueTtcblxuICAvKipcbiAgICogQW4gYXQgYSBnbGFuY2UgYm9vbGVhbiBwcm9wZXJ0eSB0aGF0IGRlbm90ZXMgd2hldGhlciBvciBub3QgdGhpc1xuICAgKiBkZWZlcnJlZCBoYXMgYmVlbiByZXNvbHZlZCBvciByZWplY3RlZCB5ZXQuXG4gICAqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAbWVtYmVyb2YgRGVmZXJyZWRcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBjb21wbGV0ZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYmplY3Qgd2l0aCBmb3VyIHByb3BlcnRpZXMgb2Ygbm90ZTsgcHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0XG4gICAqIGFuZCBhIGZsYWcgY29tcGxldGUgdGhhdCB3aWxsIGJlIHNldCBvbmNlIGVpdGhlciByZXNvbHZlIG9yIHJlamVjdCBoYXZlXG4gICAqIGJlZW4gY2FsbGVkLiBBIERlZmVycmVkIGlzIGNvbnNpZGVyZWQgdG8gYmUgcGVuZGluZyB3aGlsZSBjb21wbGV0ZSBpcyBzZXRcbiAgICogdG8gZmFsc2UuXG4gICAqXG4gICAqIE9uY2UgY29uc3RydWN0ZWQsIHJlc29sdmUgYW5kIHJlamVjdCBjYW4gYmUgY2FsbGVkIGxhdGVyLCBhdCB3aGljaCBwb2ludCxcbiAgICogdGhlIHByb21pc2UgaXMgY29tcGxldGVkLiBUaGUgcHJvbWlzZSBwcm9wZXJ0eSBpcyB0aGUgcHJvbWlzZSByZXNvbHZlZFxuICAgKiBvciByZWplY3RlZCBieSB0aGUgYXNzb2NpYXRlZCBwcm9wZXJ0aWVzIGFuZCBjYW4gYmUgdXNlZCB3aXRoIG90aGVyXG4gICAqIGFzeW5jL2F3YWl0IG9yIFByb21pc2UgYmFzZWQgY29kZS5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBEZWZlcnJlZFxuICAgKiBAbWV0aG9kIOKOhuKggGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7YW55fSByZXNvbHZlV2l0aCBhIGRlZmVycmVkIHJlc29sdmVkIGFzIFByb21pc2UucmVzb2x2ZSgpIG1pZ2h0IGRvXG4gICAqIEBwYXJhbSB7YW55fSByZWplY3RXaXRoIGEgZGVmZXJyZWQgcmVqZWN0ZWQgYXMgUHJvbWlzZS5yZWplY3QoKSBtaWdodCBkb1xuICAgKi9cbiAgY29uc3RydWN0b3IocmVzb2x2ZVdpdGg6IGFueSwgcmVqZWN0V2l0aDogYW55KSB7XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5jb21wbGV0ZSA9IGZhbHNlO1xuXG4gICAgICB0aGlzLnJlc29sdmUgPSAoLi4uYXJncykgPT4ge1xuICAgICAgICB0aGlzLmNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoLi4uYXJncyk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnJlamVjdCA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMuY29tcGxldGUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVqZWN0KC4uLmFyZ3MpO1xuICAgICAgfTtcblxuICAgICAgaWYgKHJlc29sdmVXaXRoICYmICFyZWplY3RXaXRoKSB7IHRoaXMucmVzb2x2ZShyZXNvbHZlV2l0aCkgfVxuICAgICAgaWYgKHJlamVjdFdpdGggJiYgIXJlc29sdmVXaXRoKSB7IHRoaXMucmVqZWN0KHJlamVjdFdpdGgpIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGhhbmQgZ2V0dGVyIHRoYXQgZGVub3RlcyB0cnVlIGlmIHRoZSBkZWZlcnJlZCBpcyBub3QgeWV0IGNvbXBsZXRlLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIERlZmVycmVkXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAcGVuZGluZ1xuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBwcm9taXNlIGlzIG5vdCB5ZXQgY29tcGxldGU7IGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgZ2V0IHBlbmRpbmcoKTogYm9vbGVhbiB7IHJldHVybiAhdGhpcy5jb21wbGV0ZSB9XG5cbiAgLyoqXG4gICAqIFByb21pc2VzIGFyZSBncmVhdCBidXQgaWYgdGhlIGNvZGUgbmV2ZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cyBhIGRlZmVycmVkLFxuICAgKiB0aGVuIHRoaW5ncyB3aWxsIGJlY29tZSBldGVybmFsOyBpbiBhIGJhZCB3YXkuIFRoaXMgbWFrZXMgdGhhdCBsZXNzIGxpa2VseVxuICAgKiBvZiBhbiBldmVudC5cbiAgICpcbiAgICogSWYgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgZWxhcHNlcyBiZWZvcmUgYSByZXNvbHZlIG9yIHJlamVjdCBvY2N1cixcbiAgICogdGhlbiB0aGUgZGVmZXJyZWQgaXMgcmVqZWN0ZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIERlZmVycmVkXG4gICAqIEBtZXRob2Qg4oy+4qCAVGltZWREZWZlcnJlZFxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZU91dCBhIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgcmVqZWN0aW5nXG4gICAqIHRoZSBkZWZlcnJlZC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm94eVByb21pc2UgYSBwcm9taXNlIHRvIHByb3h5IHRoZW4vY2F0Y2ggdGhyb3VnaCB0byB0aGVcbiAgICogZGVmZXJyZWRzIHJlc29sdmUvcmVqZWN0LlxuICAgKiBAcmV0dXJuIHtEZWZlcnJlZH0gYW4gaW5zdGFuY2Ugb2YgZGVmZXJyZWQgdGhhdCB3aWxsIHRpbWVvdXQgYWZ0ZXJcbiAgICogYHRpbWVPdXRgIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQuIElmIGBwcm94eVByb21pc2VgIGlzIGEgYFByb21pc2VgXG4gICAqIHRoZW4gdGhlIGRlZmVycmVkJ3MgcmVqZWN0IGFuZCByZXNvbHZlIHdpbGwgYmUgdGllZCB0byB0aGUgUHJvbWlzZSdzXG4gICAqIGNhdGNoKCkgYW5kIHRoZW4oKSBtZXRob2RzLCByZXNwZWN0aXZlbHkuXG4gICAqL1xuICBzdGF0aWMgVGltZWREZWZlcnJlZCh0aW1lT3V0OiBOdW1iZXIsIHByb3h5UHJvbWlzZTogP2FueSk6IERlZmVycmVkIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xuXG4gICAgaWYgKHByb3h5UHJvbWlzZSAmJiB0eXBlT2YocHJveHlQcm9taXNlKSA9PT0gUHJvbWlzZS5uYW1lKSB7XG4gICAgICBwcm94eVByb21pc2UudGhlbigoLi4uYXJncykgPT4gZGVmZXJyZWQucmVzb2x2ZSguLi5hcmdzKSlcbiAgICAgIHByb3h5UHJvbWlzZS5jYXRjaChyZWFzb24gPT4gZGVmZXJyZWQucmVqZWN0KHJlYXNvbikpXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKCdEZWZlcnJlZCB0aW1lZCBvdXQnKSwgdGltZU91dCkpXG5cbiAgICByZXR1cm4gZGVmZXJyZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHNpbXBseSBwcm9taXNpZnkgc3R5bGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFzeW5jIGZ1bmN0aW9uIHdyYXBwZWRcbiAqIGFyb3VuZCBhIHN1cHBsaWVkIGZ1bmN0aW9uIGRlc2lnbmVkIGZvciB0aGUgc3RhbmRhcmQgY2FsbGJhY2sgbWV0aG9kb2xvZ3kuXG4gKiBJZiB0aGUgY2FsbGJhY2sgaXMgdGhlIGxhc3QgcGFyYW1ldGVyLCBhbmQgdGhhdCBjYWxsYmFjayBpcyBpbiB0aGUgZm9ybSBvZlxuICogKGVycm9yLCAuLi5yZXN1bHRzKSB0aGVuIHRoaXMgd3JhcHBlciB3aWxsIGRvIHRoZSB0cmljayBmb3IgeW91LlxuICpcbiAqIEBtZXRob2QgdXRpbHN+4oy+4qCAcHJvbWlzaWZ5XG4gKiBAc2luY2UgMi43LjBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2QgYSBmdW5jdGlvbiB0byB3cmFwIGluIGFuIGFzeW5jaHJvbm91cyBmdW5jdGlvblxuICogQHBhcmFtIHttaXhlZH0gY29udGV4dCBhbiBvcHRpb25hbCBgdGhpc2Agb2JqZWN0IGZvciB1c2Ugd2l0aCB0aGUgc3VwcGxpZWRcbiAqIGZ1bmN0aW9uLlxuICogQHJldHVybiB7RnVuY3Rpb259IGFuIGFzeW5jaHJvbm91cyBmdW5jdGlvbiwgaS5lLiBvbmUgdGhhdCByZXR1cm5zIGEgcHJvbWlzZVxuICogY29udGFpbmluZyB0aGUgY29udGVudHMgdGhlIGNhbGxiYWNrIHJlc3VsdHMsIHRoYXQgd3JhcHMgdGhlIHN1cHBsaWVkXG4gKiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2lmeShtZXRob2Q6IEZ1bmN0aW9uLCBjb250ZXh0PzogbWl4ZWQpOiBGdW5jdGlvbiB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGFyZ3MucHVzaChmdW5jdGlvbihlcnJvciwgLi4uY2FsbGJhY2tBcmdzKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSguLi5jYWxsYmFja0FyZ3MpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbWV0aG9kLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiBJdCBtYXkgYmUgbmVjZXNzYXJ5IHRvIHJlYWQgR3JhcGhRTCBMYXR0aWNlIHByZWZlcmVuY2VzIGZyb20gdGhlIG5lYXJlc3RcbiAqIGBwYWNrYWdlLmpzb25gIG9iamVjdCB0byB0aGUgZXhjdXRpbmcgY29kZS4gYGdldExhdHRpY2VQcmVmcygpYCBkb2VzIHRoaXNcbiAqIGFuZCBtZXJnZXMgYW55IHN1YnNlcXVlbnRseSBmb3VuZCBvcHRpb25zIGluIHNhaWQgZmlsZSBvbiB0b3Agb2YgdGhlXG4gKiBkZWZhdWx0IHZhbHVlcyBzcGVjaWZpZWQgaGVyZSBpbiB0aGlzIGZpbGUuXG4gKlxuICogQG1ldGhvZCB1dGlsc37ijL7ioIBnZXRMYXR0aWNlUHJlZnNcbiAqIEBzaW5jZSAyLjEzLjBcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFuIG9iamVjdCBjb250YWluaW5nIGF0IGxlYXN0IHRoZSBkZWZhdWx0cyBwbHVzIGFueSBvdGhlclxuICogdmFsdWVzIHNwZWNpZmllZCBpbiBgcGFja2FnZS5qc29uYFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGF0dGljZVByZWZzKHJlYWRQa2dVcE9wdHM6ID9PYmplY3QpOiBPYmplY3Qge1xuICBsZXQgeyBwa2cgfSA9IHJlYWRQa2cocmVhZFBrZ1VwT3B0cylcbiAgbGV0IG9wdGlvbnMgPSB7XG4gICAgTW9kdWxlUGFyc2VyOiB7XG4gICAgICBleHRlbnNpb25zOiBbJy5qcycsICcuanN4JywgJy50cycsICcudHN4J10sXG4gICAgICBmYWlsT25FcnJvcjogZmFsc2VcbiAgICB9XG4gIH1cblxuICBpZiAocGtnLmxhdHRpY2UpIHtcbiAgICBtZXJnZShvcHRpb25zLCBwa2cubGF0dGljZSB8fCB7fSlcbiAgfVxuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG4vKipcbiAqIEEgc21hbGwgbmVhciBwYXNzLXRocnUgZmFjaWxpdHkgZm9yIGxvZ2dpbmcgd2l0aGluIExhdHRpY2Ugc3VjaCB0aGF0IGVycm9yXG4gKiBvYmplY3RzIHN1cHBsaWVkIGdldCBtYXBwZWQgdG8gdGhlaXIgbWVzc2FnZSB1bmxlc3MgYExBVFRJQ0VfRVJST1JTPVNUQUNLYFxuICogaXMgc2V0IGluIGBwcm9jZXNzLmVudmAuXG4gKlxuICogTm90ZSB0aGUgb3JkZXIgb2YgbG9nIGxldmVscyBmb3IgTGF0dGljZSBtYXkgYmUgc29tZXdoYXQgbm9uLXN0YW5kYXJkLiBJbmZvXG4gKiBoYXMgYmVlbiB0YWtlbiBvdXQgb2YgZmxvdyBhbmQgcGxhY2VkIGFib3ZlIGVycm9yIHRvIHNvbHZlIGlzc3VlcyB3aXRoIGplc3RcbiAqIGxvZ2dpbmcuXG4gKlxuICogQG1lbWJlcm9mIHV0aWxzXG4gKiBAdHlwZSBPYmplY3RcbiAqIEBzdGF0aWNcbiAqL1xuZXhwb3J0IGNvbnN0IExhdHRpY2VMb2dzID0ge1xuICBnZXQgTE9HKCk6IHN0cmluZyB7IHJldHVybiAnbG9nJyB9LFxuXG4gIGdldCBXQVJOKCk6IHN0cmluZyB7IHJldHVybiAnd2FybicgfSxcblxuICBnZXQgRVJST1IoKTogc3RyaW5nIHsgcmV0dXJuICdlcnJvcicgfSxcblxuICBnZXQgSU5GTygpOiBzdHJpbmcgeyByZXR1cm4gJ2luZm8nIH0sXG5cbiAgZ2V0IFRSQUNFKCk6IHN0cmluZyB7IHJldHVybiAndHJhY2UnIH0sXG5cbiAgLyoqXG4gICAqIE9yZGVyaW5nIG9mIGxvZyBsZXZlbHMgZm9yIExhdHRpY2VMb2dzLiBgSU5GT2AgaXMgYSBub24gZXJyb3IgbG9nIGxldmVsXG4gICAqIHRoYXQgaXMgbm9uLWNydWNpYWwgYW5kIGFwcGVhcnMgaWYgTEFUVElDRV9MT0dMRVZFTCBpcyBzZXQgdG8gYElORk9gIG9yXG4gICAqIGBUUkFDRWBcbiAgICovXG4gIGdldCBMRVZFTFMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3QgbGwgPSBMYXR0aWNlTG9nc1xuXG4gICAgcmV0dXJuIFtsbC5MT0csIGxsLldBUk4sIGxsLkVSUk9SLCBsbC5JTkZPLCBsbC5UUkFDRV1cbiAgfSxcblxuICBlcXVhbE9yQmVsb3codGVzdGVkTGV2ZWw6IHN0cmluZywgbGVzc1RoYW46IHN0cmluZyA9ICdlcnJvcicpIHtcbiAgICBjb25zdCBsbCA9IExhdHRpY2VMb2dzXG5cbiAgICByZXR1cm4gbGwuTEVWRUxTLmluZGV4T2YodGVzdGVkTGV2ZWwpIDw9IGxsLkxFVkVMUy5pbmRleE9mKGxlc3NUaGFuKVxuICB9LFxuXG4gIGF0TGVhc3QodGVzdGVkTGV2ZWw6IHN0cmluZywgYXRMZWFzdExldmVsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBsbCA9IExhdHRpY2VMb2dzXG5cbiAgICByZXR1cm4gbGwuTEVWRUxTLmluZGV4T2YodGVzdGVkTGV2ZWwpID49IGxsLkxFVkVMUy5pbmRleE9mKGF0TGVhc3RMZXZlbClcbiAgfSxcblxuICAvKipcbiAgICogQWxsIGFyZ3VtZW50cyBvZiBhbnkgbG9nZ2luZyBmdW5jdGlvbiBpbiBgTGF0dGljZUxvZ3NgIGdldCBwYXNzZWQgdGhyb3VnaFxuICAgKiB0aGlzIGZ1bmN0aW9uIGZpcnN0IHRvIG1vZGlmeSBvciBhbHRlciB0aGUgdHlwZSBvZiB2YWx1ZSBiZWluZyBsb2dnZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bWl4ZWR9IGFyZyB0aGUgYXJndW1lbnQgYmVpbmcgcGFzc2VkIHRvIHRoZSBgbWFwKClgIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCB0aGUgaW5kZXggaW4gdGhlIGFycmF5IG9mIGFyZ3VtZW50c1xuICAgKiBAcGFyYW0ge0FycmF5PG1peGVkPn0gYXJyYXkgdGhlIGFycmF5IGNvbnRhaW5pbmcgdGhpcyBlbGVtZW50XG4gICAqL1xuICBhcmdNYXBwZXIoYXJnOiBtaXhlZCwgaW5kZXg6IG51bWJlciwgYXJyYXk6IEFycmF5PG1peGVkPik6IG1peGVkIHtcbiAgICBsZXQgaXNFcnJvciA9IHR5cGVPZihhcmcpID09PSBFcnJvci5uYW1lXG4gICAgbGV0IHNob3dTdGFjayA9IC9cXGJTVEFDS1xcYi9pLnRlc3QocHJvY2Vzcy5lbnYuTEFUVElDRV9FUlJPUlMgfHwgJycpXG5cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgcmV0dXJuICFpc0Vycm9yID8gYXJnIDogKHNob3dTdGFjayA/IGFyZyA6IGFyZy5tZXNzYWdlKVxuICB9LFxuXG4gIC8qKiBBIGZ1bmN0aW9uIHRoYXQsIHdoZW4gaXQgcmV0dXJucyB0cnVlLCB3aWxsIGNhdXNlIGxvZ2dpbmcgdG8gYmUgc2tpcHBlZCAqL1xuICBmYWlsRmFzdChsb2dMZXZlbDogP3N0cmluZywgbGVzc1RoYW46ID9zdHJpbmcpIHtcbiAgICBjb25zdCBsbCA9IExhdHRpY2VMb2dzXG5cbiAgICBpZiAobG9nTGV2ZWwpIHtcbiAgICAgIGxldCBjb21wYXJlVG8gPSBsZXNzVGhhbiB8fCBwcm9jZXNzLmVudi5MQVRUSUNFX0xPR0xFVkVMIHx8IGxsLkVSUk9SXG4gICAgICBpZiAoIWxsLmVxdWFsT3JCZWxvdyhsb2dMZXZlbCwgY29tcGFyZVRvKSkgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gL1xcYihOT05FfE9GRnxOT3wwKVxcYi9pLnRlc3QocHJvY2Vzcy5lbnYuTEFUVElDRV9FUlJPUlMgfHwgJycpXG4gIH0sXG5cbiAgLyoqIFBhc3MtdGhydSB0byBjb25zb2xlLmxvZzsgYXJndW1lbnRzIHBhcnNlZCB2aWEgYGFyZ01hcHBlcmAgKi9cbiAgbG9nKC4uLmFyZ3M6IEFycmF5PG1peGVkPikge1xuICAgIGlmIChMYXR0aWNlTG9ncy5mYWlsRmFzdChMYXR0aWNlTG9ncy5MT0cpKSByZXR1cm47XG4gICAgY29uc29sZS5sb2coLi4uYXJncy5tYXAoTGF0dGljZUxvZ3MuYXJnTWFwcGVyKSlcbiAgfSxcblxuICAvKiogUGFzcy10aHJ1IHRvIGNvbnNvbGUud2FybjsgYXJndW1lbnRzIHBhcnNlZCB2aWEgYGFyZ01hcHBlcmAgKi9cbiAgd2FybiguLi5hcmdzOiBBcnJheTxtaXhlZD4pIHtcbiAgICBpZiAoTGF0dGljZUxvZ3MuZmFpbEZhc3QoTGF0dGljZUxvZ3MuV0FSTikpIHJldHVybjtcbiAgICBjb25zb2xlLndhcm4oLi4uYXJncy5tYXAoTGF0dGljZUxvZ3MuYXJnTWFwcGVyKSlcbiAgfSxcblxuICAvKiogUGFzcy10aHJ1IHRvIGNvbnNvbGUuZXJyb3I7IGFyZ3VtZW50cyBwYXJzZWQgdmlhIGBhcmdNYXBwZXJgICovXG4gIGVycm9yKC4uLmFyZ3M6IEFycmF5PG1peGVkPikge1xuICAgIGlmIChMYXR0aWNlTG9ncy5mYWlsRmFzdChMYXR0aWNlTG9ncy5FUlJPUikpIHJldHVybjtcbiAgICBjb25zb2xlLmVycm9yKC4uLmFyZ3MubWFwKExhdHRpY2VMb2dzLmFyZ01hcHBlcikpXG4gIH0sXG5cbiAgLyoqIFBhc3MtdGhydSB0byBjb25zb2xlLmluZm87IGFyZ3VtZW50cyBwYXJzZWQgdmlhIGBhcmdNYXBwZXJgICovXG4gIGluZm8oLi4uYXJnczogQXJyYXk8bWl4ZWQ+KSB7XG4gICAgaWYgKExhdHRpY2VMb2dzLmZhaWxGYXN0KExhdHRpY2VMb2dzLklORk8pKSByZXR1cm47XG4gICAgY29uc29sZS5pbmZvKC4uLmFyZ3MubWFwKExhdHRpY2VMb2dzLmFyZ01hcHBlcikpXG4gIH0sXG5cbiAgLyoqIFBhc3MtdGhydSB0byBjb25zb2xlLnRyYWNlOyBhcmd1bWVudHMgcGFyc2VkIHZpYSBgYXJnTWFwcGVyYCAqL1xuICB0cmFjZSguLi5hcmdzOiBBcnJheTxtaXhlZD4pIHtcbiAgICBpZiAoTGF0dGljZUxvZ3MuZmFpbEZhc3QoTGF0dGljZUxvZ3MuVFJBQ0UpKSByZXR1cm47XG4gICAgY29uc29sZS50cmFjZSguLi5hcmdzLm1hcChMYXR0aWNlTG9ncy5hcmdNYXBwZXIpKVxuICB9LFxuXG4gIG91dFdyaXRlKFxuICAgIGNodW5rOiBzdHJpbmd8VWludDhBcnJheXxCdWZmZXIsXG4gICAgZW5jb2Rpbmc6ID9zdHJpbmcsXG4gICAgY2FsbGJhY2s6ID9GdW5jdGlvblxuICApIHtcbiAgICBpZiAoTGF0dGljZUxvZ3MuZmFpbEZhc3QoTGF0dGljZUxvZ3MuTE9HKSkgcmV0dXJuXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spXG4gIH0sXG5cbiAgZXJyV3JpdGUoXG4gICAgY2h1bms6IHN0cmluZ3xVaW50OEFycmF5fEJ1ZmZlcixcbiAgICBlbmNvZGluZzogP3N0cmluZyxcbiAgICBjYWxsYmFjazogP0Z1bmN0aW9uXG4gICkge1xuICAgIGlmIChMYXR0aWNlTG9ncy5mYWlsRmFzdChMYXR0aWNlTG9ncy5FUlJPUikpIHJldHVyblxuICAgIC8vICRGbG93Rml4TWVcbiAgICBwcm9jZXNzLnN0ZGVyci53cml0ZShjaHVuaywgZW5jb2RpbmcsIGNhbGxiYWNrKVxuICB9XG59XG4iXX0=