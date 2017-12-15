'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AwaitingPromiseError = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _AsyncFunctionExecutionError = require('./AsyncFunctionExecutionError');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An error that occurs while waiting for a Promise or asynchronous function
 * to resolve. Typically found in the catch() handler of a promise or the
 * try/catch handler of an `await asyncFn()` statement. In addition to an
 * error message that occurred during the asynchronous event, this error
 * can track other potentially pertinent information such as the promise
 * in question and/or an AsyncFunctionExecutionError wrapping the originally
 * thrown generic error.
 *
 * @class AwaitingPromiseError
 */
let AwaitingPromiseError = exports.AwaitingPromiseError = class AwaitingPromiseError extends Error {

  /**
   * Creates a new instance of AwaitingPromiseError. It takes the same default
   * parameters of the core Error class.
   *
   * @constructor
   *
   * @param {Error|string} error the error or message to describe what happened
   * @param {string} fileName the name of the file, see Error for more detail
   * @param {number} lineNumber line number of the error, see Error for more
   */

  /**
   * The promise that threw an error if available.
   *
   * @type {Promise<mixed>}
   * @instance
   * @memberOf AwaitingPromiseError
   */
  constructor(error, fileName, lineNumber = NaN) {
    let message = error instanceof Error ? error.message : error;

    super(message || error, fileName, lineNumber);

    if (error instanceof Error) {
      let { columnNumber, fileName, lineNumber, message, name, stack } = error;

      (0, _assign2.default)(this, {
        columnNumber, fileName, lineNumber, message, name, stack
      });

      this.error = error;
    }
  }

  /**
   * A promise that potentially spawned the error is something that this type
   * of Error tracks. You can set this inline with a return statement by using
   * this helper function.
   *
   * i.e.
   * ```
   * let promise; // define elsewhere
   * promise
   *   .then(result => ({}))
   *   .catch(error => {
   *     throw new AwaitingPromiseError(error).setPromise(promise)
   *   })
   * ```
   *
   * @method ⌾⠀setPromise
   * @memberof AwaitingPromiseError
   * @instance
   *
   * @param {Promise<mixed>} promise the promise to store as a chained call
   * @return {AwaitingPromiseError} `this` for use in a chained function call
   */


  /**
   * The error that spawned the creation of this Error instance. Specifically,
   * it is better if this error is an instance of AsyncFunctionExecutionError
   *
   * @type {Error}
   * @instance
   * @memberOf AwaitingPromiseError
   */
  setPromise(promise) {
    this.promise = promise;
    return this;
  }

  /**
   * A static helper method that creates an error but also takes and records
   * the additional data with regards to the associated async function call
   * that caused the error to occur. Optionally a promise can be assigned by
   * giving one as the last parameter.
   *
   * @method ⌾⠀asyncFn
   * @memberof AwaitingPromiseError
   * @instance
   *
   * @param {Error|string} error any error present at the time of failure
   * @param {Function} fn the function that failed
   * @param {Array<mixed>} args any arguments passed to the failed fn
   * @param {mixed} result any result returned by the failed function
   * @param {Promise<mixed>} promise an associated promise, if available
   *
   * @return {AwaitingPromiseError} a newly minted AwaitingPromiseError with
   * all the specified data
   */
  static asyncFn(error, fn, args, result, promise) {
    let preciseError = new _AsyncFunctionExecutionError.AsyncFunctionExecutionError(error, fn, args, result);
    let finalError = new AwaitingPromiseError(preciseError);

    if (promise) {
      finalError.setPromise(promise);
    }

    return finalError;
  }
};
exports.default = AwaitingPromiseError;
//# sourceMappingURL=AwaitingPromiseError.js.map