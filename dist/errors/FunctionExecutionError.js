"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FunctionExecutionError = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

/**
 * The FunctionExecutionError denotes that the error was invoked
 * during a runtime evaluation of a function
 */
var FunctionExecutionError =
/*#__PURE__*/
function (_Error) {
  (0, _inherits2.default)(FunctionExecutionError, _Error);

  /** The error, if any, that prompted the creation of this instance */

  /** The function in question, if available, that caused the error */

  /** The arguments, if available, that invoked the error */

  /** The result from the function, if any, at the time of Error */

  /**
   * Creates a new FunctionExecutionError instance. Any information that
   * can be passed about the error at the time of failure should be captured
   * here if possible. Some values that make sense are any other existing
   * error present at the time this issue cropped up, the function that failed,
   * any arguments passed to it and any resulting value it may have turned up.
   *
   * @param  {Error|string} error any error present at the time of failure
   * @param  {Function} fn the function that failed
   * @param  {Array<mixed>} args any arguments passed to the failed fn
   * @param  {mixed} result any result returned by the failed function
   */
  function FunctionExecutionError(error, fn, args, result) {
    var _this;

    (0, _classCallCheck2.default)(this, FunctionExecutionError);
    var message = error instanceof Error ? error.message : error;
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FunctionExecutionError).call(this, message));

    if (error instanceof Error) {
      var columnNumber = error.columnNumber,
          fileName = error.fileName,
          lineNumber = error.lineNumber,
          _message = error.message,
          name = error.name,
          stack = error.stack;
      Object.assign((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), {
        columnNumber: columnNumber,
        fileName: fileName,
        lineNumber: lineNumber,
        message: _message,
        name: name,
        stack: stack
      });
      _this.error = error;
    }

    Object.assign((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), {
      error: error,
      fn: fn,
      args: args,
      result: result
    });
    return _this;
  }

  return FunctionExecutionError;
}((0, _wrapNativeSuper2.default)(Error));

exports.FunctionExecutionError = FunctionExecutionError;
var _default = FunctionExecutionError;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9lcnJvcnMvRnVuY3Rpb25FeGVjdXRpb25FcnJvci5qcyJdLCJuYW1lcyI6WyJGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIiwiZXJyb3IiLCJmbiIsImFyZ3MiLCJyZXN1bHQiLCJtZXNzYWdlIiwiRXJyb3IiLCJjb2x1bW5OdW1iZXIiLCJmaWxlTmFtZSIsImxpbmVOdW1iZXIiLCJuYW1lIiwic3RhY2siLCJPYmplY3QiLCJhc3NpZ24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0lBSWFBLHNCOzs7OztBQUNYOztBQUdBOztBQUdBOztBQUdBOztBQUdBOzs7Ozs7Ozs7Ozs7QUFZQSxrQ0FDRUMsS0FERixFQUVFQyxFQUZGLEVBR0VDLElBSEYsRUFJRUMsTUFKRixFQUtFO0FBQUE7O0FBQUE7QUFDQSxRQUFJQyxPQUFPLEdBQUdKLEtBQUssWUFBWUssS0FBakIsR0FBeUJMLEtBQUssQ0FBQ0ksT0FBL0IsR0FBeUNKLEtBQXZEO0FBRUEsNEhBQU1JLE9BQU47O0FBRUEsUUFBSUosS0FBSyxZQUFZSyxLQUFyQixFQUE0QjtBQUFBLFVBQ3BCQyxZQURvQixHQUN5Q04sS0FEekMsQ0FDcEJNLFlBRG9CO0FBQUEsVUFDTkMsUUFETSxHQUN5Q1AsS0FEekMsQ0FDTk8sUUFETTtBQUFBLFVBQ0lDLFVBREosR0FDeUNSLEtBRHpDLENBQ0lRLFVBREo7QUFBQSxVQUNnQkosUUFEaEIsR0FDeUNKLEtBRHpDLENBQ2dCSSxPQURoQjtBQUFBLFVBQ3lCSyxJQUR6QixHQUN5Q1QsS0FEekMsQ0FDeUJTLElBRHpCO0FBQUEsVUFDK0JDLEtBRC9CLEdBQ3lDVixLQUR6QyxDQUMrQlUsS0FEL0I7QUFHMUJDLE1BQUFBLE1BQU0sQ0FBQ0MsTUFBUCxvRkFBb0I7QUFDbEJOLFFBQUFBLFlBQVksRUFBWkEsWUFEa0I7QUFDSkMsUUFBQUEsUUFBUSxFQUFSQSxRQURJO0FBQ01DLFFBQUFBLFVBQVUsRUFBVkEsVUFETjtBQUNrQkosUUFBQUEsT0FBTyxFQUFQQSxRQURsQjtBQUMyQkssUUFBQUEsSUFBSSxFQUFKQSxJQUQzQjtBQUNpQ0MsUUFBQUEsS0FBSyxFQUFMQTtBQURqQyxPQUFwQjtBQUlBLFlBQUtWLEtBQUwsR0FBYUEsS0FBYjtBQUNEOztBQUVEVyxJQUFBQSxNQUFNLENBQUNDLE1BQVAsb0ZBQW9CO0FBQUVaLE1BQUFBLEtBQUssRUFBTEEsS0FBRjtBQUFTQyxNQUFBQSxFQUFFLEVBQUZBLEVBQVQ7QUFBYUMsTUFBQUEsSUFBSSxFQUFKQSxJQUFiO0FBQW1CQyxNQUFBQSxNQUFNLEVBQU5BO0FBQW5CLEtBQXBCO0FBZkE7QUFnQkQ7OztpQ0E5Q3lDRSxLOzs7ZUFpRDdCTixzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIEZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IgZGVub3RlcyB0aGF0IHRoZSBlcnJvciB3YXMgaW52b2tlZFxuICogZHVyaW5nIGEgcnVudGltZSBldmFsdWF0aW9uIG9mIGEgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKiBUaGUgZXJyb3IsIGlmIGFueSwgdGhhdCBwcm9tcHRlZCB0aGUgY3JlYXRpb24gb2YgdGhpcyBpbnN0YW5jZSAqL1xuICBlcnJvcjogRXJyb3JcblxuICAvKiogVGhlIGZ1bmN0aW9uIGluIHF1ZXN0aW9uLCBpZiBhdmFpbGFibGUsIHRoYXQgY2F1c2VkIHRoZSBlcnJvciAqL1xuICBmbjogRnVuY3Rpb25cblxuICAvKiogVGhlIGFyZ3VtZW50cywgaWYgYXZhaWxhYmxlLCB0aGF0IGludm9rZWQgdGhlIGVycm9yICovXG4gIGFyZ3M6IEFycmF5PE1peGVkPlxuXG4gIC8qKiBUaGUgcmVzdWx0IGZyb20gdGhlIGZ1bmN0aW9uLCBpZiBhbnksIGF0IHRoZSB0aW1lIG9mIEVycm9yICovXG4gIHJlc3VsdDogbWl4ZWRcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIGluc3RhbmNlLiBBbnkgaW5mb3JtYXRpb24gdGhhdFxuICAgKiBjYW4gYmUgcGFzc2VkIGFib3V0IHRoZSBlcnJvciBhdCB0aGUgdGltZSBvZiBmYWlsdXJlIHNob3VsZCBiZSBjYXB0dXJlZFxuICAgKiBoZXJlIGlmIHBvc3NpYmxlLiBTb21lIHZhbHVlcyB0aGF0IG1ha2Ugc2Vuc2UgYXJlIGFueSBvdGhlciBleGlzdGluZ1xuICAgKiBlcnJvciBwcmVzZW50IGF0IHRoZSB0aW1lIHRoaXMgaXNzdWUgY3JvcHBlZCB1cCwgdGhlIGZ1bmN0aW9uIHRoYXQgZmFpbGVkLFxuICAgKiBhbnkgYXJndW1lbnRzIHBhc3NlZCB0byBpdCBhbmQgYW55IHJlc3VsdGluZyB2YWx1ZSBpdCBtYXkgaGF2ZSB0dXJuZWQgdXAuXG4gICAqXG4gICAqIEBwYXJhbSAge0Vycm9yfHN0cmluZ30gZXJyb3IgYW55IGVycm9yIHByZXNlbnQgYXQgdGhlIHRpbWUgb2YgZmFpbHVyZVxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gdGhlIGZ1bmN0aW9uIHRoYXQgZmFpbGVkXG4gICAqIEBwYXJhbSAge0FycmF5PG1peGVkPn0gYXJncyBhbnkgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgZmFpbGVkIGZuXG4gICAqIEBwYXJhbSAge21peGVkfSByZXN1bHQgYW55IHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZmFpbGVkIGZ1bmN0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBlcnJvcjogPyhFcnJvciB8IHN0cmluZyksXG4gICAgZm46ID9GdW5jdGlvbixcbiAgICBhcmdzOiA/QXJyYXk8bWl4ZWQ+LFxuICAgIHJlc3VsdDogbWl4ZWRcbiAgKSB7XG4gICAgbGV0IG1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IGVycm9yXG5cbiAgICBzdXBlcihtZXNzYWdlKVxuXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGxldCB7IGNvbHVtbk51bWJlciwgZmlsZU5hbWUsIGxpbmVOdW1iZXIsIG1lc3NhZ2UsIG5hbWUsIHN0YWNrIH0gPSBlcnJvclxuXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgICAgY29sdW1uTnVtYmVyLCBmaWxlTmFtZSwgbGluZU51bWJlciwgbWVzc2FnZSwgbmFtZSwgc3RhY2tcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZXJyb3IgPSBlcnJvclxuICAgIH1cblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgeyBlcnJvciwgZm4sIGFyZ3MsIHJlc3VsdCB9KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IiXX0=