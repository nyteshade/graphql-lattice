"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AwaitingPromiseError = void 0;

var _AsyncFunctionExecutionError = require("./AsyncFunctionExecutionError");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
class AwaitingPromiseError extends Error {
  /**
   * The promise that threw an error if available.
   *
   * @type {Promise<mixed>}
   * @instance
   * @memberOf AwaitingPromiseError
   */

  /**
   * The error that spawned the creation of this Error instance. Specifically,
   * it is better if this error is an instance of AsyncFunctionExecutionError
   *
   * @type {Error}
   * @instance
   * @memberOf AwaitingPromiseError
   */

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
  constructor(error, fileName, lineNumber = NaN) {
    let message = error instanceof Error ? error.message : error;
    super(message || error, fileName, lineNumber);

    _defineProperty(this, "promise", void 0);

    _defineProperty(this, "error", void 0);

    if (error instanceof Error) {
      let {
        columnNumber,
        fileName,
        lineNumber,
        message,
        name,
        stack
      } = error;
      Object.assign(this, {
        columnNumber,
        fileName,
        lineNumber,
        message,
        name,
        stack
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

}

exports.AwaitingPromiseError = AwaitingPromiseError;
var _default = AwaitingPromiseError;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9lcnJvcnMvQXdhaXRpbmdQcm9taXNlRXJyb3IuanMiXSwibmFtZXMiOlsiQXdhaXRpbmdQcm9taXNlRXJyb3IiLCJFcnJvciIsImNvbnN0cnVjdG9yIiwiZXJyb3IiLCJmaWxlTmFtZSIsImxpbmVOdW1iZXIiLCJOYU4iLCJtZXNzYWdlIiwiY29sdW1uTnVtYmVyIiwibmFtZSIsInN0YWNrIiwiT2JqZWN0IiwiYXNzaWduIiwic2V0UHJvbWlzZSIsInByb21pc2UiLCJhc3luY0ZuIiwiZm4iLCJhcmdzIiwicmVzdWx0IiwicHJlY2lzZUVycm9yIiwiQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIiwiZmluYWxFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7Ozs7Ozs7O0FBV08sTUFBTUEsb0JBQU4sU0FBbUNDLEtBQW5DLENBQXlDO0FBQzlDOzs7Ozs7OztBQVNBOzs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBQyxFQUFBQSxXQUFXLENBQ1RDLEtBRFMsRUFFVEMsUUFGUyxFQUdUQyxVQUFrQixHQUFHQyxHQUhaLEVBSVQ7QUFDQSxRQUFJQyxPQUFPLEdBQUdKLEtBQUssWUFBWUYsS0FBakIsR0FBeUJFLEtBQUssQ0FBQ0ksT0FBL0IsR0FBeUNKLEtBQXZEO0FBRUEsVUFBTUksT0FBTyxJQUFJSixLQUFqQixFQUF3QkMsUUFBeEIsRUFBa0NDLFVBQWxDOztBQUhBOztBQUFBOztBQUtBLFFBQUlGLEtBQUssWUFBWUYsS0FBckIsRUFBNEI7QUFDMUIsVUFBSTtBQUFFTyxRQUFBQSxZQUFGO0FBQWdCSixRQUFBQSxRQUFoQjtBQUEwQkMsUUFBQUEsVUFBMUI7QUFBc0NFLFFBQUFBLE9BQXRDO0FBQStDRSxRQUFBQSxJQUEvQztBQUFxREMsUUFBQUE7QUFBckQsVUFBK0RQLEtBQW5FO0FBRUFRLE1BQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsRUFBb0I7QUFDbEJKLFFBQUFBLFlBRGtCO0FBQ0pKLFFBQUFBLFFBREk7QUFDTUMsUUFBQUEsVUFETjtBQUNrQkUsUUFBQUEsT0FEbEI7QUFDMkJFLFFBQUFBLElBRDNCO0FBQ2lDQyxRQUFBQTtBQURqQyxPQUFwQjtBQUlBLFdBQUtQLEtBQUwsR0FBYUEsS0FBYjtBQUNEO0FBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBVSxFQUFBQSxVQUFVLENBQUNDLE9BQUQsRUFBZ0Q7QUFDeEQsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLFNBQU9DLE9BQVAsQ0FDRVosS0FERixFQUVFYSxFQUZGLEVBR0VDLElBSEYsRUFJRUMsTUFKRixFQUtFSixPQUxGLEVBTXdCO0FBQ3RCLFFBQUlLLFlBQVksR0FBRyxJQUFJQyx3REFBSixDQUFnQ2pCLEtBQWhDLEVBQXVDYSxFQUF2QyxFQUEyQ0MsSUFBM0MsRUFBaURDLE1BQWpELENBQW5CO0FBQ0EsUUFBSUcsVUFBVSxHQUFHLElBQUlyQixvQkFBSixDQUF5Qm1CLFlBQXpCLENBQWpCOztBQUVBLFFBQUlMLE9BQUosRUFBYTtBQUNYTyxNQUFBQSxVQUFVLENBQUNSLFVBQVgsQ0FBc0JDLE9BQXRCO0FBQ0Q7O0FBRUQsV0FBT08sVUFBUDtBQUNEOztBQS9HNkM7OztlQWtIakNyQixvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzeW5jRnVuY3Rpb25FeGVjdXRpb25FcnJvciB9IGZyb20gJy4vQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yJ1xuXG4vKipcbiAqIEFuIGVycm9yIHRoYXQgb2NjdXJzIHdoaWxlIHdhaXRpbmcgZm9yIGEgUHJvbWlzZSBvciBhc3luY2hyb25vdXMgZnVuY3Rpb25cbiAqIHRvIHJlc29sdmUuIFR5cGljYWxseSBmb3VuZCBpbiB0aGUgY2F0Y2goKSBoYW5kbGVyIG9mIGEgcHJvbWlzZSBvciB0aGVcbiAqIHRyeS9jYXRjaCBoYW5kbGVyIG9mIGFuIGBhd2FpdCBhc3luY0ZuKClgIHN0YXRlbWVudC4gSW4gYWRkaXRpb24gdG8gYW5cbiAqIGVycm9yIG1lc3NhZ2UgdGhhdCBvY2N1cnJlZCBkdXJpbmcgdGhlIGFzeW5jaHJvbm91cyBldmVudCwgdGhpcyBlcnJvclxuICogY2FuIHRyYWNrIG90aGVyIHBvdGVudGlhbGx5IHBlcnRpbmVudCBpbmZvcm1hdGlvbiBzdWNoIGFzIHRoZSBwcm9taXNlXG4gKiBpbiBxdWVzdGlvbiBhbmQvb3IgYW4gQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIHdyYXBwaW5nIHRoZSBvcmlnaW5hbGx5XG4gKiB0aHJvd24gZ2VuZXJpYyBlcnJvci5cbiAqXG4gKiBAY2xhc3MgQXdhaXRpbmdQcm9taXNlRXJyb3JcbiAqL1xuZXhwb3J0IGNsYXNzIEF3YWl0aW5nUHJvbWlzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKipcbiAgICogVGhlIHByb21pc2UgdGhhdCB0aHJldyBhbiBlcnJvciBpZiBhdmFpbGFibGUuXG4gICAqXG4gICAqIEB0eXBlIHtQcm9taXNlPG1peGVkPn1cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJPZiBBd2FpdGluZ1Byb21pc2VFcnJvclxuICAgKi9cbiAgcHJvbWlzZTogUHJvbWlzZTxtaXhlZD5cblxuICAvKipcbiAgICogVGhlIGVycm9yIHRoYXQgc3Bhd25lZCB0aGUgY3JlYXRpb24gb2YgdGhpcyBFcnJvciBpbnN0YW5jZS4gU3BlY2lmaWNhbGx5LFxuICAgKiBpdCBpcyBiZXR0ZXIgaWYgdGhpcyBlcnJvciBpcyBhbiBpbnN0YW5jZSBvZiBBc3luY0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3JcbiAgICpcbiAgICogQHR5cGUge0Vycm9yfVxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlck9mIEF3YWl0aW5nUHJvbWlzZUVycm9yXG4gICAqL1xuICBlcnJvcjogRXJyb3JcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBBd2FpdGluZ1Byb21pc2VFcnJvci4gSXQgdGFrZXMgdGhlIHNhbWUgZGVmYXVsdFxuICAgKiBwYXJhbWV0ZXJzIG9mIHRoZSBjb3JlIEVycm9yIGNsYXNzLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtFcnJvcnxzdHJpbmd9IGVycm9yIHRoZSBlcnJvciBvciBtZXNzYWdlIHRvIGRlc2NyaWJlIHdoYXQgaGFwcGVuZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lIHRoZSBuYW1lIG9mIHRoZSBmaWxlLCBzZWUgRXJyb3IgZm9yIG1vcmUgZGV0YWlsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsaW5lTnVtYmVyIGxpbmUgbnVtYmVyIG9mIHRoZSBlcnJvciwgc2VlIEVycm9yIGZvciBtb3JlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBlcnJvcjogP0Vycm9yfHN0cmluZyxcbiAgICBmaWxlTmFtZTogP3N0cmluZyxcbiAgICBsaW5lTnVtYmVyOiBudW1iZXIgPSBOYU5cbiAgKSB7XG4gICAgbGV0IG1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IGVycm9yXG5cbiAgICBzdXBlcihtZXNzYWdlIHx8IGVycm9yLCBmaWxlTmFtZSwgbGluZU51bWJlcilcblxuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICBsZXQgeyBjb2x1bW5OdW1iZXIsIGZpbGVOYW1lLCBsaW5lTnVtYmVyLCBtZXNzYWdlLCBuYW1lLCBzdGFjayB9ID0gZXJyb3JcblxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XG4gICAgICAgIGNvbHVtbk51bWJlciwgZmlsZU5hbWUsIGxpbmVOdW1iZXIsIG1lc3NhZ2UsIG5hbWUsIHN0YWNrXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmVycm9yID0gZXJyb3JcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBwcm9taXNlIHRoYXQgcG90ZW50aWFsbHkgc3Bhd25lZCB0aGUgZXJyb3IgaXMgc29tZXRoaW5nIHRoYXQgdGhpcyB0eXBlXG4gICAqIG9mIEVycm9yIHRyYWNrcy4gWW91IGNhbiBzZXQgdGhpcyBpbmxpbmUgd2l0aCBhIHJldHVybiBzdGF0ZW1lbnQgYnkgdXNpbmdcbiAgICogdGhpcyBoZWxwZXIgZnVuY3Rpb24uXG4gICAqXG4gICAqIGkuZS5cbiAgICogYGBgXG4gICAqIGxldCBwcm9taXNlOyAvLyBkZWZpbmUgZWxzZXdoZXJlXG4gICAqIHByb21pc2VcbiAgICogICAudGhlbihyZXN1bHQgPT4gKHt9KSlcbiAgICogICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgKiAgICAgdGhyb3cgbmV3IEF3YWl0aW5nUHJvbWlzZUVycm9yKGVycm9yKS5zZXRQcm9taXNlKHByb21pc2UpXG4gICAqICAgfSlcbiAgICogYGBgXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAc2V0UHJvbWlzZVxuICAgKiBAbWVtYmVyb2YgQXdhaXRpbmdQcm9taXNlRXJyb3JcbiAgICogQGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSB7UHJvbWlzZTxtaXhlZD59IHByb21pc2UgdGhlIHByb21pc2UgdG8gc3RvcmUgYXMgYSBjaGFpbmVkIGNhbGxcbiAgICogQHJldHVybiB7QXdhaXRpbmdQcm9taXNlRXJyb3J9IGB0aGlzYCBmb3IgdXNlIGluIGEgY2hhaW5lZCBmdW5jdGlvbiBjYWxsXG4gICAqL1xuICBzZXRQcm9taXNlKHByb21pc2U6IFByb21pc2U8bWl4ZWQ+KTogQXdhaXRpbmdQcm9taXNlRXJyb3Ige1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2VcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RhdGljIGhlbHBlciBtZXRob2QgdGhhdCBjcmVhdGVzIGFuIGVycm9yIGJ1dCBhbHNvIHRha2VzIGFuZCByZWNvcmRzXG4gICAqIHRoZSBhZGRpdGlvbmFsIGRhdGEgd2l0aCByZWdhcmRzIHRvIHRoZSBhc3NvY2lhdGVkIGFzeW5jIGZ1bmN0aW9uIGNhbGxcbiAgICogdGhhdCBjYXVzZWQgdGhlIGVycm9yIHRvIG9jY3VyLiBPcHRpb25hbGx5IGEgcHJvbWlzZSBjYW4gYmUgYXNzaWduZWQgYnlcbiAgICogZ2l2aW5nIG9uZSBhcyB0aGUgbGFzdCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAYXN5bmNGblxuICAgKiBAbWVtYmVyb2YgQXdhaXRpbmdQcm9taXNlRXJyb3JcbiAgICogQGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSB7RXJyb3J8c3RyaW5nfSBlcnJvciBhbnkgZXJyb3IgcHJlc2VudCBhdCB0aGUgdGltZSBvZiBmYWlsdXJlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIHRoZSBmdW5jdGlvbiB0aGF0IGZhaWxlZFxuICAgKiBAcGFyYW0ge0FycmF5PG1peGVkPn0gYXJncyBhbnkgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgZmFpbGVkIGZuXG4gICAqIEBwYXJhbSB7bWl4ZWR9IHJlc3VsdCBhbnkgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBmYWlsZWQgZnVuY3Rpb25cbiAgICogQHBhcmFtIHtQcm9taXNlPG1peGVkPn0gcHJvbWlzZSBhbiBhc3NvY2lhdGVkIHByb21pc2UsIGlmIGF2YWlsYWJsZVxuICAgKlxuICAgKiBAcmV0dXJuIHtBd2FpdGluZ1Byb21pc2VFcnJvcn0gYSBuZXdseSBtaW50ZWQgQXdhaXRpbmdQcm9taXNlRXJyb3Igd2l0aFxuICAgKiBhbGwgdGhlIHNwZWNpZmllZCBkYXRhXG4gICAqL1xuICBzdGF0aWMgYXN5bmNGbihcbiAgICBlcnJvcjogKEVycm9yIHwgc3RyaW5nKSxcbiAgICBmbjogP0Z1bmN0aW9uLFxuICAgIGFyZ3M6ID9BcnJheTxtaXhlZD4sXG4gICAgcmVzdWx0OiA/bWl4ZWQsXG4gICAgcHJvbWlzZTogP1Byb21pc2U8bWl4ZWQ+XG4gICk6IEF3YWl0aW5nUHJvbWlzZUVycm9yIHtcbiAgICBsZXQgcHJlY2lzZUVycm9yID0gbmV3IEFzeW5jRnVuY3Rpb25FeGVjdXRpb25FcnJvcihlcnJvciwgZm4sIGFyZ3MsIHJlc3VsdClcbiAgICBsZXQgZmluYWxFcnJvciA9IG5ldyBBd2FpdGluZ1Byb21pc2VFcnJvcihwcmVjaXNlRXJyb3IpXG5cbiAgICBpZiAocHJvbWlzZSkge1xuICAgICAgZmluYWxFcnJvci5zZXRQcm9taXNlKHByb21pc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbmFsRXJyb3JcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBd2FpdGluZ1Byb21pc2VFcnJvciJdfQ==