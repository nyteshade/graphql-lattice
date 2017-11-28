'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LatticeLogs = exports.Deferred = exports.joinLines = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _neTagFns = require('ne-tag-fns');

Object.defineProperty(exports, 'joinLines', {
  enumerable: true,
  get: function () {
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

const { Stats } = _fs2.default;

/**
 * Deferred is modeled after jQuery's deferred object. It inverts a promise
 * such that its resolve and reject methods can be invoked without wrapping
 * all of the related code within a Promise's function.
 *
 * @memberof utils
 * @class Deferred
 */
let Deferred = exports.Deferred = class Deferred {

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
  constructor(resolveWith, rejectWith) {
    this.promise = new _promise2.default((resolve, reject) => {
      this.complete = false;

      this.resolve = (...args) => {
        this.complete = true;
        return resolve(...args);
      };

      this.reject = (...args) => {
        this.complete = true;
        return reject(...args);
      };

      if (resolveWith && !rejectWith) {
        this.resolve(resolveWith);
      }
      if (rejectWith && !resolveWith) {
        this.reject(rejectWith);
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
  get pending() {
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
  static TimedDeferred(timeOut, proxyPromise) {
    const deferred = new Deferred();

    if (proxyPromise && (0, _types.typeOf)(proxyPromise) === _promise2.default.name) {
      proxyPromise.then((...args) => deferred.resolve(...args));
      proxyPromise.catch(reason => deferred.reject(reason));
    }

    setTimeout(() => deferred.reject(new Error('Deferred timed out'), timeOut));

    return deferred;
  }
};

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
  return (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (...args) {
      return new _promise2.default(function (resolve, reject) {
        args.push(function (error, ...callbackArgs) {
          if (error) {
            reject(error);
          } else {
            resolve(...callbackArgs);
          }
        });

        method.apply(context, args);
      });
    });

    return function () {
      return _ref.apply(this, arguments);
    };
  })();
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
  let { pkg } = (0, _readPkgUp.sync)(readPkgUpOpts);
  let options = {
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
const LatticeLogs = exports.LatticeLogs = {
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
    const ll = LatticeLogs;

    return [ll.LOG, ll.WARN, ll.ERROR, ll.INFO, ll.TRACE];
  },

  equalOrBelow(testedLevel, lessThan = 'error') {
    const ll = LatticeLogs;

    return ll.LEVELS.indexOf(testedLevel) <= ll.LEVELS.indexOf(lessThan);
  },

  atLeast(testedLevel, atLeastLevel) {
    const ll = LatticeLogs;

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
    let isError = (0, _types.typeOf)(arg) === Error.name;
    let showStack = /\bSTACK\b/i.test(process.env.LATTICE_ERRORS || '');

    // $FlowFixMe
    return !isError ? arg : showStack ? arg : arg.message;
  },

  /** A function that, when it returns true, will cause logging to be skipped */
  failFast(logLevel, lessThan) {
    const ll = LatticeLogs;

    if (logLevel) {
      let compareTo = lessThan || process.env.LATTICE_LOGLEVEL || ll.ERROR;
      if (!ll.equalOrBelow(logLevel, compareTo)) return true;
    }

    return (/\b(NONE|OFF|NO|0)\b/i.test(process.env.LATTICE_ERRORS || '')
    );
  },

  /** Pass-thru to console.log; arguments parsed via `argMapper` */
  log(...args) {
    if (LatticeLogs.failFast(LatticeLogs.LOG)) return;
    console.log(...args.map(LatticeLogs.argMapper));
  },

  /** Pass-thru to console.warn; arguments parsed via `argMapper` */
  warn(...args) {
    if (LatticeLogs.failFast(LatticeLogs.WARN)) return;
    console.warn(...args.map(LatticeLogs.argMapper));
  },

  /** Pass-thru to console.error; arguments parsed via `argMapper` */
  error(...args) {
    if (LatticeLogs.failFast(LatticeLogs.ERROR)) return;
    console.error(...args.map(LatticeLogs.argMapper));
  },

  /** Pass-thru to console.info; arguments parsed via `argMapper` */
  info(...args) {
    if (LatticeLogs.failFast(LatticeLogs.INFO)) return;
    console.info(...args.map(LatticeLogs.argMapper));
  },

  /** Pass-thru to console.trace; arguments parsed via `argMapper` */
  trace(...args) {
    if (LatticeLogs.failFast(LatticeLogs.TRACE)) return;
    console.trace(...args.map(LatticeLogs.argMapper));
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