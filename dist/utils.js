"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisify = promisify;
exports.getLatticePrefs = getLatticePrefs;
Object.defineProperty(exports, "joinLines", {
  enumerable: true,
  get: function () {
    return _neTagFns.dedent;
  }
});
exports.LatticeLogs = exports.Deferred = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _neTypes = require("ne-types");

var _readPkgUp = require("read-pkg-up");

var _lodash = require("lodash");

var _neTagFns = require("ne-tag-fns");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  Stats
} = _fs.default;
/**
 * Deferred is modeled after jQuery's deferred object. It inverts a promise
 * such that its resolve and reject methods can be invoked without wrapping
 * all of the related code within a Promise's function.
 *
 * @memberof utils
 * @class Deferred
 */

class Deferred {
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
  constructor(resolveWith, rejectWith) {
    _defineProperty(this, "resolve", void 0);

    _defineProperty(this, "reject", void 0);

    _defineProperty(this, "promise", void 0);

    _defineProperty(this, "complete", void 0);

    this.promise = new Promise((resolve, reject) => {
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

    if (proxyPromise && (0, _neTypes.typeOf)(proxyPromise) === Promise.name) {
      proxyPromise.then((...args) => deferred.resolve(...args));
      proxyPromise.catch(reason => deferred.reject(reason));
    }

    setTimeout(() => deferred.reject(new Error('Deferred timed out'), timeOut));
    return deferred;
  }

}
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
  return async function (...args) {
    return new Promise((resolve, reject) => {
      args.push(function (error, ...callbackArgs) {
        if (error) {
          reject(error);
        } else {
          resolve(...callbackArgs);
        }
      });
      method.apply(context, args);
    });
  };
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
  let {
    pkg
  } = (0, _readPkgUp.sync)(readPkgUpOpts);
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


const LatticeLogs = {
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
    let isError = (0, _neTypes.typeOf)(arg) === Error.name;
    let showStack = /\bSTACK\b/i.test(process.env.LATTICE_ERRORS || ''); // $FlowFixMe

    return !isError ? arg : showStack ? arg : arg.message;
  },

  /** A function that, when it returns true, will cause logging to be skipped */
  failFast(logLevel, lessThan) {
    const ll = LatticeLogs;

    if (logLevel) {
      let compareTo = lessThan || process.env.LATTICE_LOGLEVEL || ll.ERROR;
      if (!ll.equalOrBelow(logLevel, compareTo)) return true;
    }

    return /\b(NONE|OFF|NO|0)\b/i.test(process.env.LATTICE_ERRORS || '');
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
    if (LatticeLogs.failFast(LatticeLogs.LOG)) return; // $FlowFixMe

    process.stdout.write(chunk, encoding, callback);
  },

  errWrite(chunk, encoding, callback) {
    if (LatticeLogs.failFast(LatticeLogs.ERROR)) return; // $FlowFixMe

    process.stderr.write(chunk, encoding, callback);
  }

};
exports.LatticeLogs = LatticeLogs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi91dGlscy5qcyJdLCJuYW1lcyI6WyJTdGF0cyIsImZzIiwiRGVmZXJyZWQiLCJjb25zdHJ1Y3RvciIsInJlc29sdmVXaXRoIiwicmVqZWN0V2l0aCIsInByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNvbXBsZXRlIiwiYXJncyIsInBlbmRpbmciLCJUaW1lZERlZmVycmVkIiwidGltZU91dCIsInByb3h5UHJvbWlzZSIsImRlZmVycmVkIiwibmFtZSIsInRoZW4iLCJjYXRjaCIsInJlYXNvbiIsInNldFRpbWVvdXQiLCJFcnJvciIsInByb21pc2lmeSIsIm1ldGhvZCIsImNvbnRleHQiLCJwdXNoIiwiZXJyb3IiLCJjYWxsYmFja0FyZ3MiLCJhcHBseSIsImdldExhdHRpY2VQcmVmcyIsInJlYWRQa2dVcE9wdHMiLCJwa2ciLCJvcHRpb25zIiwiTW9kdWxlUGFyc2VyIiwiZXh0ZW5zaW9ucyIsImZhaWxPbkVycm9yIiwibGF0dGljZSIsIkxhdHRpY2VMb2dzIiwiTE9HIiwiV0FSTiIsIkVSUk9SIiwiSU5GTyIsIlRSQUNFIiwiTEVWRUxTIiwibGwiLCJlcXVhbE9yQmVsb3ciLCJ0ZXN0ZWRMZXZlbCIsImxlc3NUaGFuIiwiaW5kZXhPZiIsImF0TGVhc3QiLCJhdExlYXN0TGV2ZWwiLCJhcmdNYXBwZXIiLCJhcmciLCJpbmRleCIsImFycmF5IiwiaXNFcnJvciIsInNob3dTdGFjayIsInRlc3QiLCJwcm9jZXNzIiwiZW52IiwiTEFUVElDRV9FUlJPUlMiLCJtZXNzYWdlIiwiZmFpbEZhc3QiLCJsb2dMZXZlbCIsImNvbXBhcmVUbyIsIkxBVFRJQ0VfTE9HTEVWRUwiLCJsb2ciLCJjb25zb2xlIiwibWFwIiwid2FybiIsImluZm8iLCJ0cmFjZSIsIm91dFdyaXRlIiwiY2h1bmsiLCJlbmNvZGluZyIsImNhbGxiYWNrIiwic3Rkb3V0Iiwid3JpdGUiLCJlcnJXcml0ZSIsInN0ZGVyciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7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QUFDRyxJQUFSLENBQWEsR0FBRzVELElBQUksQ0FBQzBELEdBQUwsQ0FBUy9CLFdBQVcsQ0FBQ2MsU0FBckIsQ0FBaEI7QUFDRCxHQXBGd0I7O0FBc0Z6QjtBQUNBb0IsRUFBQUEsS0FBSyxDQUFDLEdBQUc3RCxJQUFKLEVBQXdCO0FBQzNCLFFBQUkyQixXQUFXLENBQUN5QixRQUFaLENBQXFCekIsV0FBVyxDQUFDSyxLQUFqQyxDQUFKLEVBQTZDO0FBQzdDeUIsSUFBQUEsT0FBTyxDQUFDSSxLQUFSLENBQWMsR0FBRzdELElBQUksQ0FBQzBELEdBQUwsQ0FBUy9CLFdBQVcsQ0FBQ2MsU0FBckIsQ0FBakI7QUFDRCxHQTFGd0I7O0FBNEZ6QnFCLEVBQUFBLFFBQVEsQ0FDTkMsS0FETSxFQUVOQyxRQUZNLEVBR05DLFFBSE0sRUFJTjtBQUNBLFFBQUl0QyxXQUFXLENBQUN5QixRQUFaLENBQXFCekIsV0FBVyxDQUFDQyxHQUFqQyxDQUFKLEVBQTJDLE9BRDNDLENBRUE7O0FBQ0FvQixJQUFBQSxPQUFPLENBQUNrQixNQUFSLENBQWVDLEtBQWYsQ0FBcUJKLEtBQXJCLEVBQTRCQyxRQUE1QixFQUFzQ0MsUUFBdEM7QUFDRCxHQXBHd0I7O0FBc0d6QkcsRUFBQUEsUUFBUSxDQUNOTCxLQURNLEVBRU5DLFFBRk0sRUFHTkMsUUFITSxFQUlOO0FBQ0EsUUFBSXRDLFdBQVcsQ0FBQ3lCLFFBQVosQ0FBcUJ6QixXQUFXLENBQUNHLEtBQWpDLENBQUosRUFBNkMsT0FEN0MsQ0FFQTs7QUFDQWtCLElBQUFBLE9BQU8sQ0FBQ3FCLE1BQVIsQ0FBZUYsS0FBZixDQUFxQkosS0FBckIsRUFBNEJDLFFBQTVCLEVBQXNDQyxRQUF0QztBQUNEOztBQTlHd0IsQ0FBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQG5hbWVzcGFjZSB1dGlscyAqL1xuLy8gQGZsb3dcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCdcbmltcG9ydCB7IHR5cGVPZiB9IGZyb20gJ25lLXR5cGVzJ1xuaW1wb3J0IHsgc3luYyBhcyByZWFkUGtnIH0gZnJvbSAncmVhZC1wa2ctdXAnXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaCdcblxuZXhwb3J0IHsgZGVkZW50IGFzIGpvaW5MaW5lcyB9IGZyb20gJ25lLXRhZy1mbnMnXG5cbmNvbnN0IHsgU3RhdHMgfSA9IGZzO1xuXG4vKipcbiAqIERlZmVycmVkIGlzIG1vZGVsZWQgYWZ0ZXIgalF1ZXJ5J3MgZGVmZXJyZWQgb2JqZWN0LiBJdCBpbnZlcnRzIGEgcHJvbWlzZVxuICogc3VjaCB0aGF0IGl0cyByZXNvbHZlIGFuZCByZWplY3QgbWV0aG9kcyBjYW4gYmUgaW52b2tlZCB3aXRob3V0IHdyYXBwaW5nXG4gKiBhbGwgb2YgdGhlIHJlbGF0ZWQgY29kZSB3aXRoaW4gYSBQcm9taXNlJ3MgZnVuY3Rpb24uXG4gKlxuICogQG1lbWJlcm9mIHV0aWxzXG4gKiBAY2xhc3MgRGVmZXJyZWRcbiAqL1xuZXhwb3J0IGNsYXNzIERlZmVycmVkIHtcbiAgLyoqXG4gICAqIFRoaXMgcHJvcGVydHkgaG9sZHMgYSBgcmVzb2x2ZWAgZnVuY3Rpb24gZnJvbSB3aXRoaW4gdGhlIHByb21pc2UgdGhpc1xuICAgKiBkZWZlcnJlZCBpbnZlcnRzLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqIEBtZW1iZXJvZiBEZWZlcnJlZFxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIHJlc29sdmU6IEZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGlzIHByb3BlcnR5IGhvbGRzIGEgYHJlamVjdGAgZnVuY3Rpb24gZnJvbSB3aXRoaW4gdGhlIHByb21pc2UgdGhpc1xuICAgKiBkZWZlcnJlZCBpbnZlcnRzXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIERlZmVycmVkXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgcmVqZWN0OiBGdW5jdGlvbjtcblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgcHJvbWlzZSB3cmFwcGVkIGJ5IGFuZCBpbnZlcnRlZCBpbiB0aGlzIGRlZmVycmVkIGluc3RhbmNlXG4gICAqXG4gICAqIEB0eXBlIHtQcm9taXNlfVxuICAgKiBAbWVtYmVyb2YgRGVmZXJyZWRcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBwcm9taXNlOiBhbnk7XG5cbiAgLyoqXG4gICAqIEFuIGF0IGEgZ2xhbmNlIGJvb2xlYW4gcHJvcGVydHkgdGhhdCBkZW5vdGVzIHdoZXRoZXIgb3Igbm90IHRoaXNcbiAgICogZGVmZXJyZWQgaGFzIGJlZW4gcmVzb2x2ZWQgb3IgcmVqZWN0ZWQgeWV0LlxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQG1lbWJlcm9mIERlZmVycmVkXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgY29tcGxldGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb2JqZWN0IHdpdGggZm91ciBwcm9wZXJ0aWVzIG9mIG5vdGU7IHByb21pc2UsIHJlc29sdmUsIHJlamVjdFxuICAgKiBhbmQgYSBmbGFnIGNvbXBsZXRlIHRoYXQgd2lsbCBiZSBzZXQgb25jZSBlaXRoZXIgcmVzb2x2ZSBvciByZWplY3QgaGF2ZVxuICAgKiBiZWVuIGNhbGxlZC4gQSBEZWZlcnJlZCBpcyBjb25zaWRlcmVkIHRvIGJlIHBlbmRpbmcgd2hpbGUgY29tcGxldGUgaXMgc2V0XG4gICAqIHRvIGZhbHNlLlxuICAgKlxuICAgKiBPbmNlIGNvbnN0cnVjdGVkLCByZXNvbHZlIGFuZCByZWplY3QgY2FuIGJlIGNhbGxlZCBsYXRlciwgYXQgd2hpY2ggcG9pbnQsXG4gICAqIHRoZSBwcm9taXNlIGlzIGNvbXBsZXRlZC4gVGhlIHByb21pc2UgcHJvcGVydHkgaXMgdGhlIHByb21pc2UgcmVzb2x2ZWRcbiAgICogb3IgcmVqZWN0ZWQgYnkgdGhlIGFzc29jaWF0ZWQgcHJvcGVydGllcyBhbmQgY2FuIGJlIHVzZWQgd2l0aCBvdGhlclxuICAgKiBhc3luYy9hd2FpdCBvciBQcm9taXNlIGJhc2VkIGNvZGUuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgRGVmZXJyZWRcbiAgICogQG1ldGhvZCDijobioIBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0ge2FueX0gcmVzb2x2ZVdpdGggYSBkZWZlcnJlZCByZXNvbHZlZCBhcyBQcm9taXNlLnJlc29sdmUoKSBtaWdodCBkb1xuICAgKiBAcGFyYW0ge2FueX0gcmVqZWN0V2l0aCBhIGRlZmVycmVkIHJlamVjdGVkIGFzIFByb21pc2UucmVqZWN0KCkgbWlnaHQgZG9cbiAgICovXG4gIGNvbnN0cnVjdG9yKHJlc29sdmVXaXRoOiBhbnksIHJlamVjdFdpdGg6IGFueSkge1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZTtcblxuICAgICAgdGhpcy5yZXNvbHZlID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIHJldHVybiByZXNvbHZlKC4uLmFyZ3MpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5yZWplY3QgPSAoLi4uYXJncykgPT4ge1xuICAgICAgICB0aGlzLmNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHJlamVjdCguLi5hcmdzKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChyZXNvbHZlV2l0aCAmJiAhcmVqZWN0V2l0aCkgeyB0aGlzLnJlc29sdmUocmVzb2x2ZVdpdGgpIH1cbiAgICAgIGlmIChyZWplY3RXaXRoICYmICFyZXNvbHZlV2l0aCkgeyB0aGlzLnJlamVjdChyZWplY3RXaXRoKSB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2hvcnRoYW5kIGdldHRlciB0aGF0IGRlbm90ZXMgdHJ1ZSBpZiB0aGUgZGVmZXJyZWQgaXMgbm90IHlldCBjb21wbGV0ZS5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBEZWZlcnJlZFxuICAgKiBAbWV0aG9kIOKsh++4juKggHBlbmRpbmdcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgcHJvbWlzZSBpcyBub3QgeWV0IGNvbXBsZXRlOyBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIGdldCBwZW5kaW5nKCk6IGJvb2xlYW4geyByZXR1cm4gIXRoaXMuY29tcGxldGUgfVxuXG4gIC8qKlxuICAgKiBQcm9taXNlcyBhcmUgZ3JlYXQgYnV0IGlmIHRoZSBjb2RlIG5ldmVyIHJlc29sdmVzIG9yIHJlamVjdHMgYSBkZWZlcnJlZCxcbiAgICogdGhlbiB0aGluZ3Mgd2lsbCBiZWNvbWUgZXRlcm5hbDsgaW4gYSBiYWQgd2F5LiBUaGlzIG1ha2VzIHRoYXQgbGVzcyBsaWtlbHlcbiAgICogb2YgYW4gZXZlbnQuXG4gICAqXG4gICAqIElmIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGVsYXBzZXMgYmVmb3JlIGEgcmVzb2x2ZSBvciByZWplY3Qgb2NjdXIsXG4gICAqIHRoZW4gdGhlIGRlZmVycmVkIGlzIHJlamVjdGVkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBEZWZlcnJlZFxuICAgKiBAbWV0aG9kIOKMvuKggFRpbWVkRGVmZXJyZWRcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVPdXQgYSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIHJlamVjdGluZ1xuICAgKiB0aGUgZGVmZXJyZWQuXG4gICAqIEBwYXJhbSB7UHJvbWlzZX0gcHJveHlQcm9taXNlIGEgcHJvbWlzZSB0byBwcm94eSB0aGVuL2NhdGNoIHRocm91Z2ggdG8gdGhlXG4gICAqIGRlZmVycmVkcyByZXNvbHZlL3JlamVjdC5cbiAgICogQHJldHVybiB7RGVmZXJyZWR9IGFuIGluc3RhbmNlIG9mIGRlZmVycmVkIHRoYXQgd2lsbCB0aW1lb3V0IGFmdGVyXG4gICAqIGB0aW1lT3V0YCBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkLiBJZiBgcHJveHlQcm9taXNlYCBpcyBhIGBQcm9taXNlYFxuICAgKiB0aGVuIHRoZSBkZWZlcnJlZCdzIHJlamVjdCBhbmQgcmVzb2x2ZSB3aWxsIGJlIHRpZWQgdG8gdGhlIFByb21pc2Unc1xuICAgKiBjYXRjaCgpIGFuZCB0aGVuKCkgbWV0aG9kcywgcmVzcGVjdGl2ZWx5LlxuICAgKi9cbiAgc3RhdGljIFRpbWVkRGVmZXJyZWQodGltZU91dDogTnVtYmVyLCBwcm94eVByb21pc2U6ID9hbnkpOiBEZWZlcnJlZCB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcblxuICAgIGlmIChwcm94eVByb21pc2UgJiYgdHlwZU9mKHByb3h5UHJvbWlzZSkgPT09IFByb21pc2UubmFtZSkge1xuICAgICAgcHJveHlQcm9taXNlLnRoZW4oKC4uLmFyZ3MpID0+IGRlZmVycmVkLnJlc29sdmUoLi4uYXJncykpXG4gICAgICBwcm94eVByb21pc2UuY2F0Y2gocmVhc29uID0+IGRlZmVycmVkLnJlamVjdChyZWFzb24pKVxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4gZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignRGVmZXJyZWQgdGltZWQgb3V0JyksIHRpbWVPdXQpKVxuXG4gICAgcmV0dXJuIGRlZmVycmVkO1xuICB9XG59XG5cbi8qKlxuICogQSBzaW1wbHkgcHJvbWlzaWZ5IHN0eWxlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBhc3luYyBmdW5jdGlvbiB3cmFwcGVkXG4gKiBhcm91bmQgYSBzdXBwbGllZCBmdW5jdGlvbiBkZXNpZ25lZCBmb3IgdGhlIHN0YW5kYXJkIGNhbGxiYWNrIG1ldGhvZG9sb2d5LlxuICogSWYgdGhlIGNhbGxiYWNrIGlzIHRoZSBsYXN0IHBhcmFtZXRlciwgYW5kIHRoYXQgY2FsbGJhY2sgaXMgaW4gdGhlIGZvcm0gb2ZcbiAqIChlcnJvciwgLi4ucmVzdWx0cykgdGhlbiB0aGlzIHdyYXBwZXIgd2lsbCBkbyB0aGUgdHJpY2sgZm9yIHlvdS5cbiAqXG4gKiBAbWV0aG9kIHV0aWxzfuKMvuKggHByb21pc2lmeVxuICogQHNpbmNlIDIuNy4wXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWV0aG9kIGEgZnVuY3Rpb24gdG8gd3JhcCBpbiBhbiBhc3luY2hyb25vdXMgZnVuY3Rpb25cbiAqIEBwYXJhbSB7bWl4ZWR9IGNvbnRleHQgYW4gb3B0aW9uYWwgYHRoaXNgIG9iamVjdCBmb3IgdXNlIHdpdGggdGhlIHN1cHBsaWVkXG4gKiBmdW5jdGlvbi5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhbiBhc3luY2hyb25vdXMgZnVuY3Rpb24sIGkuZS4gb25lIHRoYXQgcmV0dXJucyBhIHByb21pc2VcbiAqIGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIHRoZSBjYWxsYmFjayByZXN1bHRzLCB0aGF0IHdyYXBzIHRoZSBzdXBwbGllZFxuICogZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9taXNpZnkobWV0aG9kOiBGdW5jdGlvbiwgY29udGV4dD86IG1peGVkKTogRnVuY3Rpb24ge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24oLi4uYXJncykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBhcmdzLnB1c2goZnVuY3Rpb24oZXJyb3IsIC4uLmNhbGxiYWNrQXJncykge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoLi4uY2FsbGJhY2tBcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG1ldGhvZC5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9KVxuICB9XG59XG5cbi8qKlxuICogSXQgbWF5IGJlIG5lY2Vzc2FyeSB0byByZWFkIEdyYXBoUUwgTGF0dGljZSBwcmVmZXJlbmNlcyBmcm9tIHRoZSBuZWFyZXN0XG4gKiBgcGFja2FnZS5qc29uYCBvYmplY3QgdG8gdGhlIGV4Y3V0aW5nIGNvZGUuIGBnZXRMYXR0aWNlUHJlZnMoKWAgZG9lcyB0aGlzXG4gKiBhbmQgbWVyZ2VzIGFueSBzdWJzZXF1ZW50bHkgZm91bmQgb3B0aW9ucyBpbiBzYWlkIGZpbGUgb24gdG9wIG9mIHRoZVxuICogZGVmYXVsdCB2YWx1ZXMgc3BlY2lmaWVkIGhlcmUgaW4gdGhpcyBmaWxlLlxuICpcbiAqIEBtZXRob2QgdXRpbHN+4oy+4qCAZ2V0TGF0dGljZVByZWZzXG4gKiBAc2luY2UgMi4xMy4wXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBhbiBvYmplY3QgY29udGFpbmluZyBhdCBsZWFzdCB0aGUgZGVmYXVsdHMgcGx1cyBhbnkgb3RoZXJcbiAqIHZhbHVlcyBzcGVjaWZpZWQgaW4gYHBhY2thZ2UuanNvbmBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExhdHRpY2VQcmVmcyhyZWFkUGtnVXBPcHRzOiA/T2JqZWN0KTogT2JqZWN0IHtcbiAgbGV0IHsgcGtnIH0gPSByZWFkUGtnKHJlYWRQa2dVcE9wdHMpXG4gIGxldCBvcHRpb25zID0ge1xuICAgIE1vZHVsZVBhcnNlcjoge1xuICAgICAgZXh0ZW5zaW9uczogWycuanMnLCAnLmpzeCcsICcudHMnLCAnLnRzeCddLFxuICAgICAgZmFpbE9uRXJyb3I6IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaWYgKHBrZy5sYXR0aWNlKSB7XG4gICAgbWVyZ2Uob3B0aW9ucywgcGtnLmxhdHRpY2UgfHwge30pXG4gIH1cblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuLyoqXG4gKiBBIHNtYWxsIG5lYXIgcGFzcy10aHJ1IGZhY2lsaXR5IGZvciBsb2dnaW5nIHdpdGhpbiBMYXR0aWNlIHN1Y2ggdGhhdCBlcnJvclxuICogb2JqZWN0cyBzdXBwbGllZCBnZXQgbWFwcGVkIHRvIHRoZWlyIG1lc3NhZ2UgdW5sZXNzIGBMQVRUSUNFX0VSUk9SUz1TVEFDS2BcbiAqIGlzIHNldCBpbiBgcHJvY2Vzcy5lbnZgLlxuICpcbiAqIE5vdGUgdGhlIG9yZGVyIG9mIGxvZyBsZXZlbHMgZm9yIExhdHRpY2UgbWF5IGJlIHNvbWV3aGF0IG5vbi1zdGFuZGFyZC4gSW5mb1xuICogaGFzIGJlZW4gdGFrZW4gb3V0IG9mIGZsb3cgYW5kIHBsYWNlZCBhYm92ZSBlcnJvciB0byBzb2x2ZSBpc3N1ZXMgd2l0aCBqZXN0XG4gKiBsb2dnaW5nLlxuICpcbiAqIEBtZW1iZXJvZiB1dGlsc1xuICogQHR5cGUgT2JqZWN0XG4gKiBAc3RhdGljXG4gKi9cbmV4cG9ydCBjb25zdCBMYXR0aWNlTG9ncyA9IHtcbiAgZ2V0IExPRygpOiBzdHJpbmcgeyByZXR1cm4gJ2xvZycgfSxcblxuICBnZXQgV0FSTigpOiBzdHJpbmcgeyByZXR1cm4gJ3dhcm4nIH0sXG5cbiAgZ2V0IEVSUk9SKCk6IHN0cmluZyB7IHJldHVybiAnZXJyb3InIH0sXG5cbiAgZ2V0IElORk8oKTogc3RyaW5nIHsgcmV0dXJuICdpbmZvJyB9LFxuXG4gIGdldCBUUkFDRSgpOiBzdHJpbmcgeyByZXR1cm4gJ3RyYWNlJyB9LFxuXG4gIC8qKlxuICAgKiBPcmRlcmluZyBvZiBsb2cgbGV2ZWxzIGZvciBMYXR0aWNlTG9ncy4gYElORk9gIGlzIGEgbm9uIGVycm9yIGxvZyBsZXZlbFxuICAgKiB0aGF0IGlzIG5vbi1jcnVjaWFsIGFuZCBhcHBlYXJzIGlmIExBVFRJQ0VfTE9HTEVWRUwgaXMgc2V0IHRvIGBJTkZPYCBvclxuICAgKiBgVFJBQ0VgXG4gICAqL1xuICBnZXQgTEVWRUxTKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IGxsID0gTGF0dGljZUxvZ3NcblxuICAgIHJldHVybiBbbGwuTE9HLCBsbC5XQVJOLCBsbC5FUlJPUiwgbGwuSU5GTywgbGwuVFJBQ0VdXG4gIH0sXG5cbiAgZXF1YWxPckJlbG93KHRlc3RlZExldmVsOiBzdHJpbmcsIGxlc3NUaGFuOiBzdHJpbmcgPSAnZXJyb3InKSB7XG4gICAgY29uc3QgbGwgPSBMYXR0aWNlTG9nc1xuXG4gICAgcmV0dXJuIGxsLkxFVkVMUy5pbmRleE9mKHRlc3RlZExldmVsKSA8PSBsbC5MRVZFTFMuaW5kZXhPZihsZXNzVGhhbilcbiAgfSxcblxuICBhdExlYXN0KHRlc3RlZExldmVsOiBzdHJpbmcsIGF0TGVhc3RMZXZlbDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbGwgPSBMYXR0aWNlTG9nc1xuXG4gICAgcmV0dXJuIGxsLkxFVkVMUy5pbmRleE9mKHRlc3RlZExldmVsKSA+PSBsbC5MRVZFTFMuaW5kZXhPZihhdExlYXN0TGV2ZWwpXG4gIH0sXG5cbiAgLyoqXG4gICAqIEFsbCBhcmd1bWVudHMgb2YgYW55IGxvZ2dpbmcgZnVuY3Rpb24gaW4gYExhdHRpY2VMb2dzYCBnZXQgcGFzc2VkIHRocm91Z2hcbiAgICogdGhpcyBmdW5jdGlvbiBmaXJzdCB0byBtb2RpZnkgb3IgYWx0ZXIgdGhlIHR5cGUgb2YgdmFsdWUgYmVpbmcgbG9nZ2VkLlxuICAgKlxuICAgKiBAcGFyYW0ge21peGVkfSBhcmcgdGhlIGFyZ3VtZW50IGJlaW5nIHBhc3NlZCB0byB0aGUgYG1hcCgpYCBmdW5jdGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggdGhlIGluZGV4IGluIHRoZSBhcnJheSBvZiBhcmd1bWVudHNcbiAgICogQHBhcmFtIHtBcnJheTxtaXhlZD59IGFycmF5IHRoZSBhcnJheSBjb250YWluaW5nIHRoaXMgZWxlbWVudFxuICAgKi9cbiAgYXJnTWFwcGVyKGFyZzogbWl4ZWQsIGluZGV4OiBudW1iZXIsIGFycmF5OiBBcnJheTxtaXhlZD4pOiBtaXhlZCB7XG4gICAgbGV0IGlzRXJyb3IgPSB0eXBlT2YoYXJnKSA9PT0gRXJyb3IubmFtZVxuICAgIGxldCBzaG93U3RhY2sgPSAvXFxiU1RBQ0tcXGIvaS50ZXN0KHByb2Nlc3MuZW52LkxBVFRJQ0VfRVJST1JTIHx8ICcnKVxuXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHJldHVybiAhaXNFcnJvciA/IGFyZyA6IChzaG93U3RhY2sgPyBhcmcgOiBhcmcubWVzc2FnZSlcbiAgfSxcblxuICAvKiogQSBmdW5jdGlvbiB0aGF0LCB3aGVuIGl0IHJldHVybnMgdHJ1ZSwgd2lsbCBjYXVzZSBsb2dnaW5nIHRvIGJlIHNraXBwZWQgKi9cbiAgZmFpbEZhc3QobG9nTGV2ZWw6ID9zdHJpbmcsIGxlc3NUaGFuOiA/c3RyaW5nKSB7XG4gICAgY29uc3QgbGwgPSBMYXR0aWNlTG9nc1xuXG4gICAgaWYgKGxvZ0xldmVsKSB7XG4gICAgICBsZXQgY29tcGFyZVRvID0gbGVzc1RoYW4gfHwgcHJvY2Vzcy5lbnYuTEFUVElDRV9MT0dMRVZFTCB8fCBsbC5FUlJPUlxuICAgICAgaWYgKCFsbC5lcXVhbE9yQmVsb3cobG9nTGV2ZWwsIGNvbXBhcmVUbykpIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIC9cXGIoTk9ORXxPRkZ8Tk98MClcXGIvaS50ZXN0KHByb2Nlc3MuZW52LkxBVFRJQ0VfRVJST1JTIHx8ICcnKVxuICB9LFxuXG4gIC8qKiBQYXNzLXRocnUgdG8gY29uc29sZS5sb2c7IGFyZ3VtZW50cyBwYXJzZWQgdmlhIGBhcmdNYXBwZXJgICovXG4gIGxvZyguLi5hcmdzOiBBcnJheTxtaXhlZD4pIHtcbiAgICBpZiAoTGF0dGljZUxvZ3MuZmFpbEZhc3QoTGF0dGljZUxvZ3MuTE9HKSkgcmV0dXJuO1xuICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MubWFwKExhdHRpY2VMb2dzLmFyZ01hcHBlcikpXG4gIH0sXG5cbiAgLyoqIFBhc3MtdGhydSB0byBjb25zb2xlLndhcm47IGFyZ3VtZW50cyBwYXJzZWQgdmlhIGBhcmdNYXBwZXJgICovXG4gIHdhcm4oLi4uYXJnczogQXJyYXk8bWl4ZWQ+KSB7XG4gICAgaWYgKExhdHRpY2VMb2dzLmZhaWxGYXN0KExhdHRpY2VMb2dzLldBUk4pKSByZXR1cm47XG4gICAgY29uc29sZS53YXJuKC4uLmFyZ3MubWFwKExhdHRpY2VMb2dzLmFyZ01hcHBlcikpXG4gIH0sXG5cbiAgLyoqIFBhc3MtdGhydSB0byBjb25zb2xlLmVycm9yOyBhcmd1bWVudHMgcGFyc2VkIHZpYSBgYXJnTWFwcGVyYCAqL1xuICBlcnJvciguLi5hcmdzOiBBcnJheTxtaXhlZD4pIHtcbiAgICBpZiAoTGF0dGljZUxvZ3MuZmFpbEZhc3QoTGF0dGljZUxvZ3MuRVJST1IpKSByZXR1cm47XG4gICAgY29uc29sZS5lcnJvciguLi5hcmdzLm1hcChMYXR0aWNlTG9ncy5hcmdNYXBwZXIpKVxuICB9LFxuXG4gIC8qKiBQYXNzLXRocnUgdG8gY29uc29sZS5pbmZvOyBhcmd1bWVudHMgcGFyc2VkIHZpYSBgYXJnTWFwcGVyYCAqL1xuICBpbmZvKC4uLmFyZ3M6IEFycmF5PG1peGVkPikge1xuICAgIGlmIChMYXR0aWNlTG9ncy5mYWlsRmFzdChMYXR0aWNlTG9ncy5JTkZPKSkgcmV0dXJuO1xuICAgIGNvbnNvbGUuaW5mbyguLi5hcmdzLm1hcChMYXR0aWNlTG9ncy5hcmdNYXBwZXIpKVxuICB9LFxuXG4gIC8qKiBQYXNzLXRocnUgdG8gY29uc29sZS50cmFjZTsgYXJndW1lbnRzIHBhcnNlZCB2aWEgYGFyZ01hcHBlcmAgKi9cbiAgdHJhY2UoLi4uYXJnczogQXJyYXk8bWl4ZWQ+KSB7XG4gICAgaWYgKExhdHRpY2VMb2dzLmZhaWxGYXN0KExhdHRpY2VMb2dzLlRSQUNFKSkgcmV0dXJuO1xuICAgIGNvbnNvbGUudHJhY2UoLi4uYXJncy5tYXAoTGF0dGljZUxvZ3MuYXJnTWFwcGVyKSlcbiAgfSxcblxuICBvdXRXcml0ZShcbiAgICBjaHVuazogc3RyaW5nfFVpbnQ4QXJyYXl8QnVmZmVyLFxuICAgIGVuY29kaW5nOiA/c3RyaW5nLFxuICAgIGNhbGxiYWNrOiA/RnVuY3Rpb25cbiAgKSB7XG4gICAgaWYgKExhdHRpY2VMb2dzLmZhaWxGYXN0KExhdHRpY2VMb2dzLkxPRykpIHJldHVyblxuICAgIC8vICRGbG93Rml4TWVcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShjaHVuaywgZW5jb2RpbmcsIGNhbGxiYWNrKVxuICB9LFxuXG4gIGVycldyaXRlKFxuICAgIGNodW5rOiBzdHJpbmd8VWludDhBcnJheXxCdWZmZXIsXG4gICAgZW5jb2Rpbmc6ID9zdHJpbmcsXG4gICAgY2FsbGJhY2s6ID9GdW5jdGlvblxuICApIHtcbiAgICBpZiAoTGF0dGljZUxvZ3MuZmFpbEZhc3QoTGF0dGljZUxvZ3MuRVJST1IpKSByZXR1cm5cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgcHJvY2Vzcy5zdGRlcnIud3JpdGUoY2h1bmssIGVuY29kaW5nLCBjYWxsYmFjaylcbiAgfVxufVxuIl19