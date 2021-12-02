"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LatticeLogs = exports.Deferred = void 0;
exports.getLatticePrefs = getLatticePrefs;
Object.defineProperty(exports, "joinLines", {
  enumerable: true,
  get: function get() {
    return _neTagFns.dedent;
  }
});
exports.promisify = promisify;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

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
var Stats = _fs["default"].Stats;
/**
 * Deferred is modeled after jQuery's deferred object. It inverts a promise
 * such that its resolve and reject methods can be invoked without wrapping
 * all of the related code within a Promise's function.
 *
 * @memberof utils
 * @class Deferred
 */

var Deferred = /*#__PURE__*/function () {
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

    (0, _classCallCheck2["default"])(this, Deferred);
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


  (0, _createClass2["default"])(Deferred, [{
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
        proxyPromise["catch"](function (reason) {
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
  return /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _len,
        args,
        _key,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
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
    }, _callee);
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

    (_console = console).log.apply(_console, (0, _toConsumableArray2["default"])(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.warn; arguments parsed via `argMapper` */
  warn: function warn() {
    var _console2;

    if (LatticeLogs.failFast(LatticeLogs.WARN)) return;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    (_console2 = console).warn.apply(_console2, (0, _toConsumableArray2["default"])(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.error; arguments parsed via `argMapper` */
  error: function error() {
    var _console3;

    if (LatticeLogs.failFast(LatticeLogs.ERROR)) return;

    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    (_console3 = console).error.apply(_console3, (0, _toConsumableArray2["default"])(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.info; arguments parsed via `argMapper` */
  info: function info() {
    var _console4;

    if (LatticeLogs.failFast(LatticeLogs.INFO)) return;

    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    (_console4 = console).info.apply(_console4, (0, _toConsumableArray2["default"])(args.map(LatticeLogs.argMapper)));
  },

  /** Pass-thru to console.trace; arguments parsed via `argMapper` */
  trace: function trace() {
    var _console5;

    if (LatticeLogs.failFast(LatticeLogs.TRACE)) return;

    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    (_console5 = console).trace.apply(_console5, (0, _toConsumableArray2["default"])(args.map(LatticeLogs.argMapper)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi91dGlscy5qcyJdLCJuYW1lcyI6WyJTdGF0cyIsImZzIiwiRGVmZXJyZWQiLCJyZXNvbHZlV2l0aCIsInJlamVjdFdpdGgiLCJwcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjb21wbGV0ZSIsInRpbWVPdXQiLCJwcm94eVByb21pc2UiLCJkZWZlcnJlZCIsIm5hbWUiLCJ0aGVuIiwicmVhc29uIiwic2V0VGltZW91dCIsIkVycm9yIiwicHJvbWlzaWZ5IiwibWV0aG9kIiwiY29udGV4dCIsImFyZ3MiLCJwdXNoIiwiZXJyb3IiLCJjYWxsYmFja0FyZ3MiLCJhcHBseSIsImdldExhdHRpY2VQcmVmcyIsInJlYWRQa2dVcE9wdHMiLCJwa2ciLCJvcHRpb25zIiwiTW9kdWxlUGFyc2VyIiwiZXh0ZW5zaW9ucyIsImZhaWxPbkVycm9yIiwibGF0dGljZSIsIkxhdHRpY2VMb2dzIiwiTE9HIiwiV0FSTiIsIkVSUk9SIiwiSU5GTyIsIlRSQUNFIiwiTEVWRUxTIiwibGwiLCJlcXVhbE9yQmVsb3ciLCJ0ZXN0ZWRMZXZlbCIsImxlc3NUaGFuIiwiaW5kZXhPZiIsImF0TGVhc3QiLCJhdExlYXN0TGV2ZWwiLCJhcmdNYXBwZXIiLCJhcmciLCJpbmRleCIsImFycmF5IiwiaXNFcnJvciIsInNob3dTdGFjayIsInRlc3QiLCJwcm9jZXNzIiwiZW52IiwiTEFUVElDRV9FUlJPUlMiLCJtZXNzYWdlIiwiZmFpbEZhc3QiLCJsb2dMZXZlbCIsImNvbXBhcmVUbyIsIkxBVFRJQ0VfTE9HTEVWRUwiLCJsb2ciLCJjb25zb2xlIiwibWFwIiwid2FybiIsImluZm8iLCJ0cmFjZSIsIm91dFdyaXRlIiwiY2h1bmsiLCJlbmNvZGluZyIsImNhbGxiYWNrIiwic3Rkb3V0Iiwid3JpdGUiLCJlcnJXcml0ZSIsInN0ZGVyciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7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WixDQUFxQnpCLFdBQVcsQ0FBQ0ssS0FBakMsQ0FBSixFQUE2Qzs7QUFEbEIsdUNBQXBCbEIsSUFBb0I7QUFBcEJBLE1BQUFBLElBQW9CO0FBQUE7O0FBRTNCLGlCQUFBMkMsT0FBTyxFQUFDSSxLQUFSLHNEQUFpQi9DLElBQUksQ0FBQzRDLEdBQUwsQ0FBUy9CLFdBQVcsQ0FBQ2MsU0FBckIsQ0FBakI7QUFDRCxHQTFGd0I7QUE0RnpCcUIsRUFBQUEsUUE1RnlCLG9CQTZGdkJDLEtBN0Z1QixFQThGdkJDLFFBOUZ1QixFQStGdkJDLFFBL0Z1QixFQWdHdkI7QUFDQSxRQUFJdEMsV0FBVyxDQUFDeUIsUUFBWixDQUFxQnpCLFdBQVcsQ0FBQ0MsR0FBakMsQ0FBSixFQUEyQyxPQUQzQyxDQUVBOztBQUNBb0IsSUFBQUEsT0FBTyxDQUFDa0IsTUFBUixDQUFlQyxLQUFmLENBQXFCSixLQUFyQixFQUE0QkMsUUFBNUIsRUFBc0NDLFFBQXRDO0FBQ0QsR0FwR3dCO0FBc0d6QkcsRUFBQUEsUUF0R3lCLG9CQXVHdkJMLEtBdkd1QixFQXdHdkJDLFFBeEd1QixFQXlHdkJDLFFBekd1QixFQTBHdkI7QUFDQSxRQUFJdEMsV0FBVyxDQUFDeUIsUUFBWixDQUFxQnpCLFdBQVcsQ0FBQ0csS0FBakMsQ0FBSixFQUE2QyxPQUQ3QyxDQUVBOztBQUNBa0IsSUFBQUEsT0FBTyxDQUFDcUIsTUFBUixDQUFlRixLQUFmLENBQXFCSixLQUFyQixFQUE0QkMsUUFBNUIsRUFBc0NDLFFBQXRDO0FBQ0Q7QUE5R3dCLENBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBuYW1lc3BhY2UgdXRpbHMgKi9cbi8vIEBmbG93XG5cbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB1dGlsIGZyb20gJ3V0aWwnXG5pbXBvcnQgeyB0eXBlT2YgfSBmcm9tICduZS10eXBlcydcbmltcG9ydCB7IHN5bmMgYXMgcmVhZFBrZyB9IGZyb20gJ3JlYWQtcGtnLXVwJ1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnXG5cbmV4cG9ydCB7IGRlZGVudCBhcyBqb2luTGluZXMgfSBmcm9tICduZS10YWctZm5zJ1xuXG5jb25zdCB7IFN0YXRzIH0gPSBmcztcblxuLyoqXG4gKiBEZWZlcnJlZCBpcyBtb2RlbGVkIGFmdGVyIGpRdWVyeSdzIGRlZmVycmVkIG9iamVjdC4gSXQgaW52ZXJ0cyBhIHByb21pc2VcbiAqIHN1Y2ggdGhhdCBpdHMgcmVzb2x2ZSBhbmQgcmVqZWN0IG1ldGhvZHMgY2FuIGJlIGludm9rZWQgd2l0aG91dCB3cmFwcGluZ1xuICogYWxsIG9mIHRoZSByZWxhdGVkIGNvZGUgd2l0aGluIGEgUHJvbWlzZSdzIGZ1bmN0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiB1dGlsc1xuICogQGNsYXNzIERlZmVycmVkXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZlcnJlZCB7XG4gIC8qKlxuICAgKiBUaGlzIHByb3BlcnR5IGhvbGRzIGEgYHJlc29sdmVgIGZ1bmN0aW9uIGZyb20gd2l0aGluIHRoZSBwcm9taXNlIHRoaXNcbiAgICogZGVmZXJyZWQgaW52ZXJ0cy5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKiBAbWVtYmVyb2YgRGVmZXJyZWRcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICByZXNvbHZlOiBGdW5jdGlvbjtcblxuICAvKipcbiAgICogVGhpcyBwcm9wZXJ0eSBob2xkcyBhIGByZWplY3RgIGZ1bmN0aW9uIGZyb20gd2l0aGluIHRoZSBwcm9taXNlIHRoaXNcbiAgICogZGVmZXJyZWQgaW52ZXJ0c1xuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqIEBtZW1iZXJvZiBEZWZlcnJlZFxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHJlamVjdDogRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgdGhlIHByb21pc2Ugd3JhcHBlZCBieSBhbmQgaW52ZXJ0ZWQgaW4gdGhpcyBkZWZlcnJlZCBpbnN0YW5jZVxuICAgKlxuICAgKiBAdHlwZSB7UHJvbWlzZX1cbiAgICogQG1lbWJlcm9mIERlZmVycmVkXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgcHJvbWlzZTogYW55O1xuXG4gIC8qKlxuICAgKiBBbiBhdCBhIGdsYW5jZSBib29sZWFuIHByb3BlcnR5IHRoYXQgZGVub3RlcyB3aGV0aGVyIG9yIG5vdCB0aGlzXG4gICAqIGRlZmVycmVkIGhhcyBiZWVuIHJlc29sdmVkIG9yIHJlamVjdGVkIHlldC5cbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBtZW1iZXJvZiBEZWZlcnJlZFxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIGNvbXBsZXRlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIG9iamVjdCB3aXRoIGZvdXIgcHJvcGVydGllcyBvZiBub3RlOyBwcm9taXNlLCByZXNvbHZlLCByZWplY3RcbiAgICogYW5kIGEgZmxhZyBjb21wbGV0ZSB0aGF0IHdpbGwgYmUgc2V0IG9uY2UgZWl0aGVyIHJlc29sdmUgb3IgcmVqZWN0IGhhdmVcbiAgICogYmVlbiBjYWxsZWQuIEEgRGVmZXJyZWQgaXMgY29uc2lkZXJlZCB0byBiZSBwZW5kaW5nIHdoaWxlIGNvbXBsZXRlIGlzIHNldFxuICAgKiB0byBmYWxzZS5cbiAgICpcbiAgICogT25jZSBjb25zdHJ1Y3RlZCwgcmVzb2x2ZSBhbmQgcmVqZWN0IGNhbiBiZSBjYWxsZWQgbGF0ZXIsIGF0IHdoaWNoIHBvaW50LFxuICAgKiB0aGUgcHJvbWlzZSBpcyBjb21wbGV0ZWQuIFRoZSBwcm9taXNlIHByb3BlcnR5IGlzIHRoZSBwcm9taXNlIHJlc29sdmVkXG4gICAqIG9yIHJlamVjdGVkIGJ5IHRoZSBhc3NvY2lhdGVkIHByb3BlcnRpZXMgYW5kIGNhbiBiZSB1c2VkIHdpdGggb3RoZXJcbiAgICogYXN5bmMvYXdhaXQgb3IgUHJvbWlzZSBiYXNlZCBjb2RlLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIERlZmVycmVkXG4gICAqIEBtZXRob2Qg4o6G4qCAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHthbnl9IHJlc29sdmVXaXRoIGEgZGVmZXJyZWQgcmVzb2x2ZWQgYXMgUHJvbWlzZS5yZXNvbHZlKCkgbWlnaHQgZG9cbiAgICogQHBhcmFtIHthbnl9IHJlamVjdFdpdGggYSBkZWZlcnJlZCByZWplY3RlZCBhcyBQcm9taXNlLnJlamVjdCgpIG1pZ2h0IGRvXG4gICAqL1xuICBjb25zdHJ1Y3RvcihyZXNvbHZlV2l0aDogYW55LCByZWplY3RXaXRoOiBhbnkpIHtcbiAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmNvbXBsZXRlID0gZmFsc2U7XG5cbiAgICAgIHRoaXMucmVzb2x2ZSA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMuY29tcGxldGUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSguLi5hcmdzKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMucmVqZWN0ID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIHJldHVybiByZWplY3QoLi4uYXJncyk7XG4gICAgICB9O1xuXG4gICAgICBpZiAocmVzb2x2ZVdpdGggJiYgIXJlamVjdFdpdGgpIHsgdGhpcy5yZXNvbHZlKHJlc29sdmVXaXRoKSB9XG4gICAgICBpZiAocmVqZWN0V2l0aCAmJiAhcmVzb2x2ZVdpdGgpIHsgdGhpcy5yZWplY3QocmVqZWN0V2l0aCkgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCBnZXR0ZXIgdGhhdCBkZW5vdGVzIHRydWUgaWYgdGhlIGRlZmVycmVkIGlzIG5vdCB5ZXQgY29tcGxldGUuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgRGVmZXJyZWRcbiAgICogQG1ldGhvZCDirIfvuI7ioIBwZW5kaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIHByb21pc2UgaXMgbm90IHlldCBjb21wbGV0ZTsgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBnZXQgcGVuZGluZygpOiBib29sZWFuIHsgcmV0dXJuICF0aGlzLmNvbXBsZXRlIH1cblxuICAvKipcbiAgICogUHJvbWlzZXMgYXJlIGdyZWF0IGJ1dCBpZiB0aGUgY29kZSBuZXZlciByZXNvbHZlcyBvciByZWplY3RzIGEgZGVmZXJyZWQsXG4gICAqIHRoZW4gdGhpbmdzIHdpbGwgYmVjb21lIGV0ZXJuYWw7IGluIGEgYmFkIHdheS4gVGhpcyBtYWtlcyB0aGF0IGxlc3MgbGlrZWx5XG4gICAqIG9mIGFuIGV2ZW50LlxuICAgKlxuICAgKiBJZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBlbGFwc2VzIGJlZm9yZSBhIHJlc29sdmUgb3IgcmVqZWN0IG9jY3VyLFxuICAgKiB0aGVuIHRoZSBkZWZlcnJlZCBpcyByZWplY3RlZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgRGVmZXJyZWRcbiAgICogQG1ldGhvZCDijL7ioIBUaW1lZERlZmVycmVkXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lT3V0IGEgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSByZWplY3RpbmdcbiAgICogdGhlIGRlZmVycmVkLlxuICAgKiBAcGFyYW0ge1Byb21pc2V9IHByb3h5UHJvbWlzZSBhIHByb21pc2UgdG8gcHJveHkgdGhlbi9jYXRjaCB0aHJvdWdoIHRvIHRoZVxuICAgKiBkZWZlcnJlZHMgcmVzb2x2ZS9yZWplY3QuXG4gICAqIEByZXR1cm4ge0RlZmVycmVkfSBhbiBpbnN0YW5jZSBvZiBkZWZlcnJlZCB0aGF0IHdpbGwgdGltZW91dCBhZnRlclxuICAgKiBgdGltZU91dGAgbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZC4gSWYgYHByb3h5UHJvbWlzZWAgaXMgYSBgUHJvbWlzZWBcbiAgICogdGhlbiB0aGUgZGVmZXJyZWQncyByZWplY3QgYW5kIHJlc29sdmUgd2lsbCBiZSB0aWVkIHRvIHRoZSBQcm9taXNlJ3NcbiAgICogY2F0Y2goKSBhbmQgdGhlbigpIG1ldGhvZHMsIHJlc3BlY3RpdmVseS5cbiAgICovXG4gIHN0YXRpYyBUaW1lZERlZmVycmVkKHRpbWVPdXQ6IE51bWJlciwgcHJveHlQcm9taXNlOiA/YW55KTogRGVmZXJyZWQge1xuICAgIGNvbnN0IGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XG5cbiAgICBpZiAocHJveHlQcm9taXNlICYmIHR5cGVPZihwcm94eVByb21pc2UpID09PSBQcm9taXNlLm5hbWUpIHtcbiAgICAgIHByb3h5UHJvbWlzZS50aGVuKCguLi5hcmdzKSA9PiBkZWZlcnJlZC5yZXNvbHZlKC4uLmFyZ3MpKVxuICAgICAgcHJveHlQcm9taXNlLmNhdGNoKHJlYXNvbiA9PiBkZWZlcnJlZC5yZWplY3QocmVhc29uKSlcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ0RlZmVycmVkIHRpbWVkIG91dCcpLCB0aW1lT3V0KSlcblxuICAgIHJldHVybiBkZWZlcnJlZDtcbiAgfVxufVxuXG4vKipcbiAqIEEgc2ltcGx5IHByb21pc2lmeSBzdHlsZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gYXN5bmMgZnVuY3Rpb24gd3JhcHBlZFxuICogYXJvdW5kIGEgc3VwcGxpZWQgZnVuY3Rpb24gZGVzaWduZWQgZm9yIHRoZSBzdGFuZGFyZCBjYWxsYmFjayBtZXRob2RvbG9neS5cbiAqIElmIHRoZSBjYWxsYmFjayBpcyB0aGUgbGFzdCBwYXJhbWV0ZXIsIGFuZCB0aGF0IGNhbGxiYWNrIGlzIGluIHRoZSBmb3JtIG9mXG4gKiAoZXJyb3IsIC4uLnJlc3VsdHMpIHRoZW4gdGhpcyB3cmFwcGVyIHdpbGwgZG8gdGhlIHRyaWNrIGZvciB5b3UuXG4gKlxuICogQG1ldGhvZCB1dGlsc37ijL7ioIBwcm9taXNpZnlcbiAqIEBzaW5jZSAyLjcuMFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1ldGhvZCBhIGZ1bmN0aW9uIHRvIHdyYXAgaW4gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge21peGVkfSBjb250ZXh0IGFuIG9wdGlvbmFsIGB0aGlzYCBvYmplY3QgZm9yIHVzZSB3aXRoIHRoZSBzdXBwbGllZFxuICogZnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uLCBpLmUuIG9uZSB0aGF0IHJldHVybnMgYSBwcm9taXNlXG4gKiBjb250YWluaW5nIHRoZSBjb250ZW50cyB0aGUgY2FsbGJhY2sgcmVzdWx0cywgdGhhdCB3cmFwcyB0aGUgc3VwcGxpZWRcbiAqIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvbWlzaWZ5KG1ldGhvZDogRnVuY3Rpb24sIGNvbnRleHQ/OiBtaXhlZCk6IEZ1bmN0aW9uIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgYXJncy5wdXNoKGZ1bmN0aW9uKGVycm9yLCAuLi5jYWxsYmFja0FyZ3MpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKC4uLmNhbGxiYWNrQXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBtZXRob2QuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIEl0IG1heSBiZSBuZWNlc3NhcnkgdG8gcmVhZCBHcmFwaFFMIExhdHRpY2UgcHJlZmVyZW5jZXMgZnJvbSB0aGUgbmVhcmVzdFxuICogYHBhY2thZ2UuanNvbmAgb2JqZWN0IHRvIHRoZSBleGN1dGluZyBjb2RlLiBgZ2V0TGF0dGljZVByZWZzKClgIGRvZXMgdGhpc1xuICogYW5kIG1lcmdlcyBhbnkgc3Vic2VxdWVudGx5IGZvdW5kIG9wdGlvbnMgaW4gc2FpZCBmaWxlIG9uIHRvcCBvZiB0aGVcbiAqIGRlZmF1bHQgdmFsdWVzIHNwZWNpZmllZCBoZXJlIGluIHRoaXMgZmlsZS5cbiAqXG4gKiBAbWV0aG9kIHV0aWxzfuKMvuKggGdldExhdHRpY2VQcmVmc1xuICogQHNpbmNlIDIuMTMuMFxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYXQgbGVhc3QgdGhlIGRlZmF1bHRzIHBsdXMgYW55IG90aGVyXG4gKiB2YWx1ZXMgc3BlY2lmaWVkIGluIGBwYWNrYWdlLmpzb25gXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXR0aWNlUHJlZnMocmVhZFBrZ1VwT3B0czogP09iamVjdCk6IE9iamVjdCB7XG4gIGxldCB7IHBrZyB9ID0gcmVhZFBrZyhyZWFkUGtnVXBPcHRzKVxuICBsZXQgb3B0aW9ucyA9IHtcbiAgICBNb2R1bGVQYXJzZXI6IHtcbiAgICAgIGV4dGVuc2lvbnM6IFsnLmpzJywgJy5qc3gnLCAnLnRzJywgJy50c3gnXSxcbiAgICAgIGZhaWxPbkVycm9yOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlmIChwa2cubGF0dGljZSkge1xuICAgIG1lcmdlKG9wdGlvbnMsIHBrZy5sYXR0aWNlIHx8IHt9KVxuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbi8qKlxuICogQSBzbWFsbCBuZWFyIHBhc3MtdGhydSBmYWNpbGl0eSBmb3IgbG9nZ2luZyB3aXRoaW4gTGF0dGljZSBzdWNoIHRoYXQgZXJyb3JcbiAqIG9iamVjdHMgc3VwcGxpZWQgZ2V0IG1hcHBlZCB0byB0aGVpciBtZXNzYWdlIHVubGVzcyBgTEFUVElDRV9FUlJPUlM9U1RBQ0tgXG4gKiBpcyBzZXQgaW4gYHByb2Nlc3MuZW52YC5cbiAqXG4gKiBOb3RlIHRoZSBvcmRlciBvZiBsb2cgbGV2ZWxzIGZvciBMYXR0aWNlIG1heSBiZSBzb21ld2hhdCBub24tc3RhbmRhcmQuIEluZm9cbiAqIGhhcyBiZWVuIHRha2VuIG91dCBvZiBmbG93IGFuZCBwbGFjZWQgYWJvdmUgZXJyb3IgdG8gc29sdmUgaXNzdWVzIHdpdGggamVzdFxuICogbG9nZ2luZy5cbiAqXG4gKiBAbWVtYmVyb2YgdXRpbHNcbiAqIEB0eXBlIE9iamVjdFxuICogQHN0YXRpY1xuICovXG5leHBvcnQgY29uc3QgTGF0dGljZUxvZ3MgPSB7XG4gIGdldCBMT0coKTogc3RyaW5nIHsgcmV0dXJuICdsb2cnIH0sXG5cbiAgZ2V0IFdBUk4oKTogc3RyaW5nIHsgcmV0dXJuICd3YXJuJyB9LFxuXG4gIGdldCBFUlJPUigpOiBzdHJpbmcgeyByZXR1cm4gJ2Vycm9yJyB9LFxuXG4gIGdldCBJTkZPKCk6IHN0cmluZyB7IHJldHVybiAnaW5mbycgfSxcblxuICBnZXQgVFJBQ0UoKTogc3RyaW5nIHsgcmV0dXJuICd0cmFjZScgfSxcblxuICAvKipcbiAgICogT3JkZXJpbmcgb2YgbG9nIGxldmVscyBmb3IgTGF0dGljZUxvZ3MuIGBJTkZPYCBpcyBhIG5vbiBlcnJvciBsb2cgbGV2ZWxcbiAgICogdGhhdCBpcyBub24tY3J1Y2lhbCBhbmQgYXBwZWFycyBpZiBMQVRUSUNFX0xPR0xFVkVMIGlzIHNldCB0byBgSU5GT2Agb3JcbiAgICogYFRSQUNFYFxuICAgKi9cbiAgZ2V0IExFVkVMUygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICBjb25zdCBsbCA9IExhdHRpY2VMb2dzXG5cbiAgICByZXR1cm4gW2xsLkxPRywgbGwuV0FSTiwgbGwuRVJST1IsIGxsLklORk8sIGxsLlRSQUNFXVxuICB9LFxuXG4gIGVxdWFsT3JCZWxvdyh0ZXN0ZWRMZXZlbDogc3RyaW5nLCBsZXNzVGhhbjogc3RyaW5nID0gJ2Vycm9yJykge1xuICAgIGNvbnN0IGxsID0gTGF0dGljZUxvZ3NcblxuICAgIHJldHVybiBsbC5MRVZFTFMuaW5kZXhPZih0ZXN0ZWRMZXZlbCkgPD0gbGwuTEVWRUxTLmluZGV4T2YobGVzc1RoYW4pXG4gIH0sXG5cbiAgYXRMZWFzdCh0ZXN0ZWRMZXZlbDogc3RyaW5nLCBhdExlYXN0TGV2ZWw6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGxsID0gTGF0dGljZUxvZ3NcblxuICAgIHJldHVybiBsbC5MRVZFTFMuaW5kZXhPZih0ZXN0ZWRMZXZlbCkgPj0gbGwuTEVWRUxTLmluZGV4T2YoYXRMZWFzdExldmVsKVxuICB9LFxuXG4gIC8qKlxuICAgKiBBbGwgYXJndW1lbnRzIG9mIGFueSBsb2dnaW5nIGZ1bmN0aW9uIGluIGBMYXR0aWNlTG9nc2AgZ2V0IHBhc3NlZCB0aHJvdWdoXG4gICAqIHRoaXMgZnVuY3Rpb24gZmlyc3QgdG8gbW9kaWZ5IG9yIGFsdGVyIHRoZSB0eXBlIG9mIHZhbHVlIGJlaW5nIGxvZ2dlZC5cbiAgICpcbiAgICogQHBhcmFtIHttaXhlZH0gYXJnIHRoZSBhcmd1bWVudCBiZWluZyBwYXNzZWQgdG8gdGhlIGBtYXAoKWAgZnVuY3Rpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IHRoZSBpbmRleCBpbiB0aGUgYXJyYXkgb2YgYXJndW1lbnRzXG4gICAqIEBwYXJhbSB7QXJyYXk8bWl4ZWQ+fSBhcnJheSB0aGUgYXJyYXkgY29udGFpbmluZyB0aGlzIGVsZW1lbnRcbiAgICovXG4gIGFyZ01hcHBlcihhcmc6IG1peGVkLCBpbmRleDogbnVtYmVyLCBhcnJheTogQXJyYXk8bWl4ZWQ+KTogbWl4ZWQge1xuICAgIGxldCBpc0Vycm9yID0gdHlwZU9mKGFyZykgPT09IEVycm9yLm5hbWVcbiAgICBsZXQgc2hvd1N0YWNrID0gL1xcYlNUQUNLXFxiL2kudGVzdChwcm9jZXNzLmVudi5MQVRUSUNFX0VSUk9SUyB8fCAnJylcblxuICAgIC8vICRGbG93Rml4TWVcbiAgICByZXR1cm4gIWlzRXJyb3IgPyBhcmcgOiAoc2hvd1N0YWNrID8gYXJnIDogYXJnLm1lc3NhZ2UpXG4gIH0sXG5cbiAgLyoqIEEgZnVuY3Rpb24gdGhhdCwgd2hlbiBpdCByZXR1cm5zIHRydWUsIHdpbGwgY2F1c2UgbG9nZ2luZyB0byBiZSBza2lwcGVkICovXG4gIGZhaWxGYXN0KGxvZ0xldmVsOiA/c3RyaW5nLCBsZXNzVGhhbjogP3N0cmluZykge1xuICAgIGNvbnN0IGxsID0gTGF0dGljZUxvZ3NcblxuICAgIGlmIChsb2dMZXZlbCkge1xuICAgICAgbGV0IGNvbXBhcmVUbyA9IGxlc3NUaGFuIHx8IHByb2Nlc3MuZW52LkxBVFRJQ0VfTE9HTEVWRUwgfHwgbGwuRVJST1JcbiAgICAgIGlmICghbGwuZXF1YWxPckJlbG93KGxvZ0xldmVsLCBjb21wYXJlVG8pKSByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiAvXFxiKE5PTkV8T0ZGfE5PfDApXFxiL2kudGVzdChwcm9jZXNzLmVudi5MQVRUSUNFX0VSUk9SUyB8fCAnJylcbiAgfSxcblxuICAvKiogUGFzcy10aHJ1IHRvIGNvbnNvbGUubG9nOyBhcmd1bWVudHMgcGFyc2VkIHZpYSBgYXJnTWFwcGVyYCAqL1xuICBsb2coLi4uYXJnczogQXJyYXk8bWl4ZWQ+KSB7XG4gICAgaWYgKExhdHRpY2VMb2dzLmZhaWxGYXN0KExhdHRpY2VMb2dzLkxPRykpIHJldHVybjtcbiAgICBjb25zb2xlLmxvZyguLi5hcmdzLm1hcChMYXR0aWNlTG9ncy5hcmdNYXBwZXIpKVxuICB9LFxuXG4gIC8qKiBQYXNzLXRocnUgdG8gY29uc29sZS53YXJuOyBhcmd1bWVudHMgcGFyc2VkIHZpYSBgYXJnTWFwcGVyYCAqL1xuICB3YXJuKC4uLmFyZ3M6IEFycmF5PG1peGVkPikge1xuICAgIGlmIChMYXR0aWNlTG9ncy5mYWlsRmFzdChMYXR0aWNlTG9ncy5XQVJOKSkgcmV0dXJuO1xuICAgIGNvbnNvbGUud2FybiguLi5hcmdzLm1hcChMYXR0aWNlTG9ncy5hcmdNYXBwZXIpKVxuICB9LFxuXG4gIC8qKiBQYXNzLXRocnUgdG8gY29uc29sZS5lcnJvcjsgYXJndW1lbnRzIHBhcnNlZCB2aWEgYGFyZ01hcHBlcmAgKi9cbiAgZXJyb3IoLi4uYXJnczogQXJyYXk8bWl4ZWQ+KSB7XG4gICAgaWYgKExhdHRpY2VMb2dzLmZhaWxGYXN0KExhdHRpY2VMb2dzLkVSUk9SKSkgcmV0dXJuO1xuICAgIGNvbnNvbGUuZXJyb3IoLi4uYXJncy5tYXAoTGF0dGljZUxvZ3MuYXJnTWFwcGVyKSlcbiAgfSxcblxuICAvKiogUGFzcy10aHJ1IHRvIGNvbnNvbGUuaW5mbzsgYXJndW1lbnRzIHBhcnNlZCB2aWEgYGFyZ01hcHBlcmAgKi9cbiAgaW5mbyguLi5hcmdzOiBBcnJheTxtaXhlZD4pIHtcbiAgICBpZiAoTGF0dGljZUxvZ3MuZmFpbEZhc3QoTGF0dGljZUxvZ3MuSU5GTykpIHJldHVybjtcbiAgICBjb25zb2xlLmluZm8oLi4uYXJncy5tYXAoTGF0dGljZUxvZ3MuYXJnTWFwcGVyKSlcbiAgfSxcblxuICAvKiogUGFzcy10aHJ1IHRvIGNvbnNvbGUudHJhY2U7IGFyZ3VtZW50cyBwYXJzZWQgdmlhIGBhcmdNYXBwZXJgICovXG4gIHRyYWNlKC4uLmFyZ3M6IEFycmF5PG1peGVkPikge1xuICAgIGlmIChMYXR0aWNlTG9ncy5mYWlsRmFzdChMYXR0aWNlTG9ncy5UUkFDRSkpIHJldHVybjtcbiAgICBjb25zb2xlLnRyYWNlKC4uLmFyZ3MubWFwKExhdHRpY2VMb2dzLmFyZ01hcHBlcikpXG4gIH0sXG5cbiAgb3V0V3JpdGUoXG4gICAgY2h1bms6IHN0cmluZ3xVaW50OEFycmF5fEJ1ZmZlcixcbiAgICBlbmNvZGluZzogP3N0cmluZyxcbiAgICBjYWxsYmFjazogP0Z1bmN0aW9uXG4gICkge1xuICAgIGlmIChMYXR0aWNlTG9ncy5mYWlsRmFzdChMYXR0aWNlTG9ncy5MT0cpKSByZXR1cm5cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2h1bmssIGVuY29kaW5nLCBjYWxsYmFjaylcbiAgfSxcblxuICBlcnJXcml0ZShcbiAgICBjaHVuazogc3RyaW5nfFVpbnQ4QXJyYXl8QnVmZmVyLFxuICAgIGVuY29kaW5nOiA/c3RyaW5nLFxuICAgIGNhbGxiYWNrOiA/RnVuY3Rpb25cbiAgKSB7XG4gICAgaWYgKExhdHRpY2VMb2dzLmZhaWxGYXN0KExhdHRpY2VMb2dzLkVSUk9SKSkgcmV0dXJuXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spXG4gIH1cbn1cbiJdfQ==