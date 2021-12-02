"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.FunctionExecutionError = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * The FunctionExecutionError denotes that the error was invoked
 * during a runtime evaluation of a function
 */
var FunctionExecutionError = /*#__PURE__*/function (_Error) {
  (0, _inherits2["default"])(FunctionExecutionError, _Error);

  var _super = _createSuper(FunctionExecutionError);

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

    (0, _classCallCheck2["default"])(this, FunctionExecutionError);
    var message = error instanceof Error ? error.message : error;
    _this = _super.call(this, message);

    if (error instanceof Error) {
      var columnNumber = error.columnNumber,
          fileName = error.fileName,
          lineNumber = error.lineNumber,
          _message = error.message,
          name = error.name,
          stack = error.stack;
      Object.assign((0, _assertThisInitialized2["default"])(_this), {
        columnNumber: columnNumber,
        fileName: fileName,
        lineNumber: lineNumber,
        message: _message,
        name: name,
        stack: stack
      });
      _this.error = error;
    }

    Object.assign((0, _assertThisInitialized2["default"])(_this), {
      error: error,
      fn: fn,
      args: args,
      result: result
    });
    return _this;
  }

  return FunctionExecutionError;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

exports.FunctionExecutionError = FunctionExecutionError;
var _default = FunctionExecutionError;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9lcnJvcnMvRnVuY3Rpb25FeGVjdXRpb25FcnJvci5qcyJdLCJuYW1lcyI6WyJGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIiwiZXJyb3IiLCJmbiIsImFyZ3MiLCJyZXN1bHQiLCJtZXNzYWdlIiwiRXJyb3IiLCJjb2x1bW5OdW1iZXIiLCJmaWxlTmFtZSIsImxpbmVOdW1iZXIiLCJuYW1lIiwic3RhY2siLCJPYmplY3QiLCJhc3NpZ24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtJQUNhQSxzQjs7Ozs7QUFDWDs7QUFHQTs7QUFHQTs7QUFHQTs7QUFHQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRSxrQ0FDRUMsS0FERixFQUVFQyxFQUZGLEVBR0VDLElBSEYsRUFJRUMsTUFKRixFQUtFO0FBQUE7O0FBQUE7QUFDQSxRQUFJQyxPQUFPLEdBQUdKLEtBQUssWUFBWUssS0FBakIsR0FBeUJMLEtBQUssQ0FBQ0ksT0FBL0IsR0FBeUNKLEtBQXZEO0FBRUEsOEJBQU1JLE9BQU47O0FBRUEsUUFBSUosS0FBSyxZQUFZSyxLQUFyQixFQUE0QjtBQUMxQixVQUFNQyxZQUFOLEdBQW1FTixLQUFuRSxDQUFNTSxZQUFOO0FBQUEsVUFBb0JDLFFBQXBCLEdBQW1FUCxLQUFuRSxDQUFvQk8sUUFBcEI7QUFBQSxVQUE4QkMsVUFBOUIsR0FBbUVSLEtBQW5FLENBQThCUSxVQUE5QjtBQUFBLFVBQTBDSixRQUExQyxHQUFtRUosS0FBbkUsQ0FBMENJLE9BQTFDO0FBQUEsVUFBbURLLElBQW5ELEdBQW1FVCxLQUFuRSxDQUFtRFMsSUFBbkQ7QUFBQSxVQUF5REMsS0FBekQsR0FBbUVWLEtBQW5FLENBQXlEVSxLQUF6RDtBQUVBQyxNQUFBQSxNQUFNLENBQUNDLE1BQVAsaURBQW9CO0FBQ2xCTixRQUFBQSxZQUFZLEVBQVpBLFlBRGtCO0FBQ0pDLFFBQUFBLFFBQVEsRUFBUkEsUUFESTtBQUNNQyxRQUFBQSxVQUFVLEVBQVZBLFVBRE47QUFDa0JKLFFBQUFBLE9BQU8sRUFBUEEsUUFEbEI7QUFDMkJLLFFBQUFBLElBQUksRUFBSkEsSUFEM0I7QUFDaUNDLFFBQUFBLEtBQUssRUFBTEE7QUFEakMsT0FBcEI7QUFJQSxZQUFLVixLQUFMLEdBQWFBLEtBQWI7QUFDRDs7QUFFRFcsSUFBQUEsTUFBTSxDQUFDQyxNQUFQLGlEQUFvQjtBQUFFWixNQUFBQSxLQUFLLEVBQUxBLEtBQUY7QUFBU0MsTUFBQUEsRUFBRSxFQUFGQSxFQUFUO0FBQWFDLE1BQUFBLElBQUksRUFBSkEsSUFBYjtBQUFtQkMsTUFBQUEsTUFBTSxFQUFOQTtBQUFuQixLQUFwQjtBQWZBO0FBZ0JEOzs7a0RBOUN5Q0UsSzs7O2VBaUQ3Qk4sc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIGRlbm90ZXMgdGhhdCB0aGUgZXJyb3Igd2FzIGludm9rZWRcbiAqIGR1cmluZyBhIHJ1bnRpbWUgZXZhbHVhdGlvbiBvZiBhIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKiogVGhlIGVycm9yLCBpZiBhbnksIHRoYXQgcHJvbXB0ZWQgdGhlIGNyZWF0aW9uIG9mIHRoaXMgaW5zdGFuY2UgKi9cbiAgZXJyb3I6IEVycm9yXG5cbiAgLyoqIFRoZSBmdW5jdGlvbiBpbiBxdWVzdGlvbiwgaWYgYXZhaWxhYmxlLCB0aGF0IGNhdXNlZCB0aGUgZXJyb3IgKi9cbiAgZm46IEZ1bmN0aW9uXG5cbiAgLyoqIFRoZSBhcmd1bWVudHMsIGlmIGF2YWlsYWJsZSwgdGhhdCBpbnZva2VkIHRoZSBlcnJvciAqL1xuICBhcmdzOiBBcnJheTxNaXhlZD5cblxuICAvKiogVGhlIHJlc3VsdCBmcm9tIHRoZSBmdW5jdGlvbiwgaWYgYW55LCBhdCB0aGUgdGltZSBvZiBFcnJvciAqL1xuICByZXN1bHQ6IG1peGVkXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgRnVuY3Rpb25FeGVjdXRpb25FcnJvciBpbnN0YW5jZS4gQW55IGluZm9ybWF0aW9uIHRoYXRcbiAgICogY2FuIGJlIHBhc3NlZCBhYm91dCB0aGUgZXJyb3IgYXQgdGhlIHRpbWUgb2YgZmFpbHVyZSBzaG91bGQgYmUgY2FwdHVyZWRcbiAgICogaGVyZSBpZiBwb3NzaWJsZS4gU29tZSB2YWx1ZXMgdGhhdCBtYWtlIHNlbnNlIGFyZSBhbnkgb3RoZXIgZXhpc3RpbmdcbiAgICogZXJyb3IgcHJlc2VudCBhdCB0aGUgdGltZSB0aGlzIGlzc3VlIGNyb3BwZWQgdXAsIHRoZSBmdW5jdGlvbiB0aGF0IGZhaWxlZCxcbiAgICogYW55IGFyZ3VtZW50cyBwYXNzZWQgdG8gaXQgYW5kIGFueSByZXN1bHRpbmcgdmFsdWUgaXQgbWF5IGhhdmUgdHVybmVkIHVwLlxuICAgKlxuICAgKiBAcGFyYW0gIHtFcnJvcnxzdHJpbmd9IGVycm9yIGFueSBlcnJvciBwcmVzZW50IGF0IHRoZSB0aW1lIG9mIGZhaWx1cmVcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuIHRoZSBmdW5jdGlvbiB0aGF0IGZhaWxlZFxuICAgKiBAcGFyYW0gIHtBcnJheTxtaXhlZD59IGFyZ3MgYW55IGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGZhaWxlZCBmblxuICAgKiBAcGFyYW0gIHttaXhlZH0gcmVzdWx0IGFueSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGZhaWxlZCBmdW5jdGlvblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgZXJyb3I6ID8oRXJyb3IgfCBzdHJpbmcpLFxuICAgIGZuOiA/RnVuY3Rpb24sXG4gICAgYXJnczogP0FycmF5PG1peGVkPixcbiAgICByZXN1bHQ6IG1peGVkXG4gICkge1xuICAgIGxldCBtZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvclxuXG4gICAgc3VwZXIobWVzc2FnZSlcblxuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICBsZXQgeyBjb2x1bW5OdW1iZXIsIGZpbGVOYW1lLCBsaW5lTnVtYmVyLCBtZXNzYWdlLCBuYW1lLCBzdGFjayB9ID0gZXJyb3JcblxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XG4gICAgICAgIGNvbHVtbk51bWJlciwgZmlsZU5hbWUsIGxpbmVOdW1iZXIsIG1lc3NhZ2UsIG5hbWUsIHN0YWNrXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmVycm9yID0gZXJyb3JcbiAgICB9XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHsgZXJyb3IsIGZuLCBhcmdzLCByZXN1bHQgfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIl19