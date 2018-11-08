"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AsyncFunctionExecutionError = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _FunctionExecutionError = require("./FunctionExecutionError");

/**
 * Denotes more sepecifically that the evaluation of the function invoked
 * occurred when running a known asynchronous function rather than a standard
 * synchronous version.
 */
var AsyncFunctionExecutionError =
/*#__PURE__*/
function (_FunctionExecutionErr) {
  (0, _inherits2.default)(AsyncFunctionExecutionError, _FunctionExecutionErr);

  function AsyncFunctionExecutionError() {
    (0, _classCallCheck2.default)(this, AsyncFunctionExecutionError);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(AsyncFunctionExecutionError).apply(this, arguments));
  }

  return AsyncFunctionExecutionError;
}(_FunctionExecutionError.FunctionExecutionError);

exports.AsyncFunctionExecutionError = AsyncFunctionExecutionError;
var _default = AsyncFunctionExecutionError;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9lcnJvcnMvQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yLmpzIl0sIm5hbWVzIjpbIkFzeW5jRnVuY3Rpb25FeGVjdXRpb25FcnJvciIsIkZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7Ozs7O0lBS2FBLDJCOzs7Ozs7Ozs7OztFQUFvQ0MsOEM7OztlQUVsQ0QsMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIH0gZnJvbSAnLi9GdW5jdGlvbkV4ZWN1dGlvbkVycm9yJ1xuXG4vKipcbiAqIERlbm90ZXMgbW9yZSBzZXBlY2lmaWNhbGx5IHRoYXQgdGhlIGV2YWx1YXRpb24gb2YgdGhlIGZ1bmN0aW9uIGludm9rZWRcbiAqIG9jY3VycmVkIHdoZW4gcnVubmluZyBhIGtub3duIGFzeW5jaHJvbm91cyBmdW5jdGlvbiByYXRoZXIgdGhhbiBhIHN0YW5kYXJkXG4gKiBzeW5jaHJvbm91cyB2ZXJzaW9uLlxuICovXG5leHBvcnQgY2xhc3MgQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIGV4dGVuZHMgRnVuY3Rpb25FeGVjdXRpb25FcnJvciB7IH1cblxuZXhwb3J0IGRlZmF1bHQgQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIl19