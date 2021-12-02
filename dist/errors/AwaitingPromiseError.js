"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.AwaitingPromiseError = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _AsyncFunctionExecutionError = require("./AsyncFunctionExecutionError");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
var AwaitingPromiseError = /*#__PURE__*/function (_Error) {
  (0, _inherits2["default"])(AwaitingPromiseError, _Error);

  var _super = _createSuper(AwaitingPromiseError);

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
  function AwaitingPromiseError(error, fileName) {
    var _this;

    var lineNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NaN;
    (0, _classCallCheck2["default"])(this, AwaitingPromiseError);
    var message = error instanceof Error ? error.message : error;
    _this = _super.call(this, message || error, fileName, lineNumber);

    if (error instanceof Error) {
      var columnNumber = error.columnNumber,
          _fileName = error.fileName,
          _lineNumber = error.lineNumber,
          _message = error.message,
          name = error.name,
          stack = error.stack;
      Object.assign((0, _assertThisInitialized2["default"])(_this), {
        columnNumber: columnNumber,
        fileName: _fileName,
        lineNumber: _lineNumber,
        message: _message,
        name: name,
        stack: stack
      });
      _this.error = error;
    }

    return _this;
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


  (0, _createClass2["default"])(AwaitingPromiseError, [{
    key: "setPromise",
    value: function setPromise(promise) {
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

  }], [{
    key: "asyncFn",
    value: function asyncFn(error, fn, args, result, promise) {
      var preciseError = new _AsyncFunctionExecutionError.AsyncFunctionExecutionError(error, fn, args, result);
      var finalError = new AwaitingPromiseError(preciseError);

      if (promise) {
        finalError.setPromise(promise);
      }

      return finalError;
    }
  }]);
  return AwaitingPromiseError;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

exports.AwaitingPromiseError = AwaitingPromiseError;
var _default = AwaitingPromiseError;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9lcnJvcnMvQXdhaXRpbmdQcm9taXNlRXJyb3IuanMiXSwibmFtZXMiOlsiQXdhaXRpbmdQcm9taXNlRXJyb3IiLCJlcnJvciIsImZpbGVOYW1lIiwibGluZU51bWJlciIsIk5hTiIsIm1lc3NhZ2UiLCJFcnJvciIsImNvbHVtbk51bWJlciIsIm5hbWUiLCJzdGFjayIsIk9iamVjdCIsImFzc2lnbiIsInByb21pc2UiLCJmbiIsImFyZ3MiLCJyZXN1bHQiLCJwcmVjaXNlRXJyb3IiLCJBc3luY0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3IiLCJmaW5hbEVycm9yIiwic2V0UHJvbWlzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNhQSxvQjs7Ozs7QUFDWDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0UsZ0NBQ0VDLEtBREYsRUFFRUMsUUFGRixFQUlFO0FBQUE7O0FBQUEsUUFEQUMsVUFDQSx1RUFEcUJDLEdBQ3JCO0FBQUE7QUFDQSxRQUFJQyxPQUFPLEdBQUdKLEtBQUssWUFBWUssS0FBakIsR0FBeUJMLEtBQUssQ0FBQ0ksT0FBL0IsR0FBeUNKLEtBQXZEO0FBRUEsOEJBQU1JLE9BQU8sSUFBSUosS0FBakIsRUFBd0JDLFFBQXhCLEVBQWtDQyxVQUFsQzs7QUFFQSxRQUFJRixLQUFLLFlBQVlLLEtBQXJCLEVBQTRCO0FBQzFCLFVBQU1DLFlBQU4sR0FBbUVOLEtBQW5FLENBQU1NLFlBQU47QUFBQSxVQUFvQkwsU0FBcEIsR0FBbUVELEtBQW5FLENBQW9CQyxRQUFwQjtBQUFBLFVBQThCQyxXQUE5QixHQUFtRUYsS0FBbkUsQ0FBOEJFLFVBQTlCO0FBQUEsVUFBMENFLFFBQTFDLEdBQW1FSixLQUFuRSxDQUEwQ0ksT0FBMUM7QUFBQSxVQUFtREcsSUFBbkQsR0FBbUVQLEtBQW5FLENBQW1ETyxJQUFuRDtBQUFBLFVBQXlEQyxLQUF6RCxHQUFtRVIsS0FBbkUsQ0FBeURRLEtBQXpEO0FBRUFDLE1BQUFBLE1BQU0sQ0FBQ0MsTUFBUCxpREFBb0I7QUFDbEJKLFFBQUFBLFlBQVksRUFBWkEsWUFEa0I7QUFDSkwsUUFBQUEsUUFBUSxFQUFSQSxTQURJO0FBQ01DLFFBQUFBLFVBQVUsRUFBVkEsV0FETjtBQUNrQkUsUUFBQUEsT0FBTyxFQUFQQSxRQURsQjtBQUMyQkcsUUFBQUEsSUFBSSxFQUFKQSxJQUQzQjtBQUNpQ0MsUUFBQUEsS0FBSyxFQUFMQTtBQURqQyxPQUFwQjtBQUlBLFlBQUtSLEtBQUwsR0FBYUEsS0FBYjtBQUNEOztBQWJEO0FBY0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7V0FDRSxvQkFBV1csT0FBWCxFQUEwRDtBQUN4RCxXQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0UsaUJBQ0VYLEtBREYsRUFFRVksRUFGRixFQUdFQyxJQUhGLEVBSUVDLE1BSkYsRUFLRUgsT0FMRixFQU13QjtBQUN0QixVQUFJSSxZQUFZLEdBQUcsSUFBSUMsd0RBQUosQ0FBZ0NoQixLQUFoQyxFQUF1Q1ksRUFBdkMsRUFBMkNDLElBQTNDLEVBQWlEQyxNQUFqRCxDQUFuQjtBQUNBLFVBQUlHLFVBQVUsR0FBRyxJQUFJbEIsb0JBQUosQ0FBeUJnQixZQUF6QixDQUFqQjs7QUFFQSxVQUFJSixPQUFKLEVBQWE7QUFDWE0sUUFBQUEsVUFBVSxDQUFDQyxVQUFYLENBQXNCUCxPQUF0QjtBQUNEOztBQUVELGFBQU9NLFVBQVA7QUFDRDs7O2tEQS9HdUNaLEs7OztlQWtIM0JOLG9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIH0gZnJvbSAnLi9Bc3luY0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3InXG5cbi8qKlxuICogQW4gZXJyb3IgdGhhdCBvY2N1cnMgd2hpbGUgd2FpdGluZyBmb3IgYSBQcm9taXNlIG9yIGFzeW5jaHJvbm91cyBmdW5jdGlvblxuICogdG8gcmVzb2x2ZS4gVHlwaWNhbGx5IGZvdW5kIGluIHRoZSBjYXRjaCgpIGhhbmRsZXIgb2YgYSBwcm9taXNlIG9yIHRoZVxuICogdHJ5L2NhdGNoIGhhbmRsZXIgb2YgYW4gYGF3YWl0IGFzeW5jRm4oKWAgc3RhdGVtZW50LiBJbiBhZGRpdGlvbiB0byBhblxuICogZXJyb3IgbWVzc2FnZSB0aGF0IG9jY3VycmVkIGR1cmluZyB0aGUgYXN5bmNocm9ub3VzIGV2ZW50LCB0aGlzIGVycm9yXG4gKiBjYW4gdHJhY2sgb3RoZXIgcG90ZW50aWFsbHkgcGVydGluZW50IGluZm9ybWF0aW9uIHN1Y2ggYXMgdGhlIHByb21pc2VcbiAqIGluIHF1ZXN0aW9uIGFuZC9vciBhbiBBc3luY0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3Igd3JhcHBpbmcgdGhlIG9yaWdpbmFsbHlcbiAqIHRocm93biBnZW5lcmljIGVycm9yLlxuICpcbiAqIEBjbGFzcyBBd2FpdGluZ1Byb21pc2VFcnJvclxuICovXG5leHBvcnQgY2xhc3MgQXdhaXRpbmdQcm9taXNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKlxuICAgKiBUaGUgcHJvbWlzZSB0aGF0IHRocmV3IGFuIGVycm9yIGlmIGF2YWlsYWJsZS5cbiAgICpcbiAgICogQHR5cGUge1Byb21pc2U8bWl4ZWQ+fVxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlck9mIEF3YWl0aW5nUHJvbWlzZUVycm9yXG4gICAqL1xuICBwcm9taXNlOiBQcm9taXNlPG1peGVkPlxuXG4gIC8qKlxuICAgKiBUaGUgZXJyb3IgdGhhdCBzcGF3bmVkIHRoZSBjcmVhdGlvbiBvZiB0aGlzIEVycm9yIGluc3RhbmNlLiBTcGVjaWZpY2FsbHksXG4gICAqIGl0IGlzIGJldHRlciBpZiB0aGlzIGVycm9yIGlzIGFuIGluc3RhbmNlIG9mIEFzeW5jRnVuY3Rpb25FeGVjdXRpb25FcnJvclxuICAgKlxuICAgKiBAdHlwZSB7RXJyb3J9XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyT2YgQXdhaXRpbmdQcm9taXNlRXJyb3JcbiAgICovXG4gIGVycm9yOiBFcnJvclxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIEF3YWl0aW5nUHJvbWlzZUVycm9yLiBJdCB0YWtlcyB0aGUgc2FtZSBkZWZhdWx0XG4gICAqIHBhcmFtZXRlcnMgb2YgdGhlIGNvcmUgRXJyb3IgY2xhc3MuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0ge0Vycm9yfHN0cmluZ30gZXJyb3IgdGhlIGVycm9yIG9yIG1lc3NhZ2UgdG8gZGVzY3JpYmUgd2hhdCBoYXBwZW5lZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWUgdGhlIG5hbWUgb2YgdGhlIGZpbGUsIHNlZSBFcnJvciBmb3IgbW9yZSBkZXRhaWxcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxpbmVOdW1iZXIgbGluZSBudW1iZXIgb2YgdGhlIGVycm9yLCBzZWUgRXJyb3IgZm9yIG1vcmVcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVycm9yOiA/RXJyb3J8c3RyaW5nLFxuICAgIGZpbGVOYW1lOiA/c3RyaW5nLFxuICAgIGxpbmVOdW1iZXI6IG51bWJlciA9IE5hTlxuICApIHtcbiAgICBsZXQgbWVzc2FnZSA9IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogZXJyb3JcblxuICAgIHN1cGVyKG1lc3NhZ2UgfHwgZXJyb3IsIGZpbGVOYW1lLCBsaW5lTnVtYmVyKVxuXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGxldCB7IGNvbHVtbk51bWJlciwgZmlsZU5hbWUsIGxpbmVOdW1iZXIsIG1lc3NhZ2UsIG5hbWUsIHN0YWNrIH0gPSBlcnJvclxuXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgICAgY29sdW1uTnVtYmVyLCBmaWxlTmFtZSwgbGluZU51bWJlciwgbWVzc2FnZSwgbmFtZSwgc3RhY2tcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZXJyb3IgPSBlcnJvclxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHByb21pc2UgdGhhdCBwb3RlbnRpYWxseSBzcGF3bmVkIHRoZSBlcnJvciBpcyBzb21ldGhpbmcgdGhhdCB0aGlzIHR5cGVcbiAgICogb2YgRXJyb3IgdHJhY2tzLiBZb3UgY2FuIHNldCB0aGlzIGlubGluZSB3aXRoIGEgcmV0dXJuIHN0YXRlbWVudCBieSB1c2luZ1xuICAgKiB0aGlzIGhlbHBlciBmdW5jdGlvbi5cbiAgICpcbiAgICogaS5lLlxuICAgKiBgYGBcbiAgICogbGV0IHByb21pc2U7IC8vIGRlZmluZSBlbHNld2hlcmVcbiAgICogcHJvbWlzZVxuICAgKiAgIC50aGVuKHJlc3VsdCA9PiAoe30pKVxuICAgKiAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAqICAgICB0aHJvdyBuZXcgQXdhaXRpbmdQcm9taXNlRXJyb3IoZXJyb3IpLnNldFByb21pc2UocHJvbWlzZSlcbiAgICogICB9KVxuICAgKiBgYGBcbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBzZXRQcm9taXNlXG4gICAqIEBtZW1iZXJvZiBBd2FpdGluZ1Byb21pc2VFcnJvclxuICAgKiBAaW5zdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIHtQcm9taXNlPG1peGVkPn0gcHJvbWlzZSB0aGUgcHJvbWlzZSB0byBzdG9yZSBhcyBhIGNoYWluZWQgY2FsbFxuICAgKiBAcmV0dXJuIHtBd2FpdGluZ1Byb21pc2VFcnJvcn0gYHRoaXNgIGZvciB1c2UgaW4gYSBjaGFpbmVkIGZ1bmN0aW9uIGNhbGxcbiAgICovXG4gIHNldFByb21pc2UocHJvbWlzZTogUHJvbWlzZTxtaXhlZD4pOiBBd2FpdGluZ1Byb21pc2VFcnJvciB7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogQSBzdGF0aWMgaGVscGVyIG1ldGhvZCB0aGF0IGNyZWF0ZXMgYW4gZXJyb3IgYnV0IGFsc28gdGFrZXMgYW5kIHJlY29yZHNcbiAgICogdGhlIGFkZGl0aW9uYWwgZGF0YSB3aXRoIHJlZ2FyZHMgdG8gdGhlIGFzc29jaWF0ZWQgYXN5bmMgZnVuY3Rpb24gY2FsbFxuICAgKiB0aGF0IGNhdXNlZCB0aGUgZXJyb3IgdG8gb2NjdXIuIE9wdGlvbmFsbHkgYSBwcm9taXNlIGNhbiBiZSBhc3NpZ25lZCBieVxuICAgKiBnaXZpbmcgb25lIGFzIHRoZSBsYXN0IHBhcmFtZXRlci5cbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBhc3luY0ZuXG4gICAqIEBtZW1iZXJvZiBBd2FpdGluZ1Byb21pc2VFcnJvclxuICAgKiBAaW5zdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIHtFcnJvcnxzdHJpbmd9IGVycm9yIGFueSBlcnJvciBwcmVzZW50IGF0IHRoZSB0aW1lIG9mIGZhaWx1cmVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gdGhlIGZ1bmN0aW9uIHRoYXQgZmFpbGVkXG4gICAqIEBwYXJhbSB7QXJyYXk8bWl4ZWQ+fSBhcmdzIGFueSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBmYWlsZWQgZm5cbiAgICogQHBhcmFtIHttaXhlZH0gcmVzdWx0IGFueSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGZhaWxlZCBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1Byb21pc2U8bWl4ZWQ+fSBwcm9taXNlIGFuIGFzc29jaWF0ZWQgcHJvbWlzZSwgaWYgYXZhaWxhYmxlXG4gICAqXG4gICAqIEByZXR1cm4ge0F3YWl0aW5nUHJvbWlzZUVycm9yfSBhIG5ld2x5IG1pbnRlZCBBd2FpdGluZ1Byb21pc2VFcnJvciB3aXRoXG4gICAqIGFsbCB0aGUgc3BlY2lmaWVkIGRhdGFcbiAgICovXG4gIHN0YXRpYyBhc3luY0ZuKFxuICAgIGVycm9yOiAoRXJyb3IgfCBzdHJpbmcpLFxuICAgIGZuOiA/RnVuY3Rpb24sXG4gICAgYXJnczogP0FycmF5PG1peGVkPixcbiAgICByZXN1bHQ6ID9taXhlZCxcbiAgICBwcm9taXNlOiA/UHJvbWlzZTxtaXhlZD5cbiAgKTogQXdhaXRpbmdQcm9taXNlRXJyb3Ige1xuICAgIGxldCBwcmVjaXNlRXJyb3IgPSBuZXcgQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yKGVycm9yLCBmbiwgYXJncywgcmVzdWx0KVxuICAgIGxldCBmaW5hbEVycm9yID0gbmV3IEF3YWl0aW5nUHJvbWlzZUVycm9yKHByZWNpc2VFcnJvcilcblxuICAgIGlmIChwcm9taXNlKSB7XG4gICAgICBmaW5hbEVycm9yLnNldFByb21pc2UocHJvbWlzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gZmluYWxFcnJvclxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF3YWl0aW5nUHJvbWlzZUVycm9yIl19