"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.AsyncFunctionExecutionError = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _FunctionExecutionError = require("./FunctionExecutionError");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Denotes more sepecifically that the evaluation of the function invoked
 * occurred when running a known asynchronous function rather than a standard
 * synchronous version.
 */
var AsyncFunctionExecutionError = /*#__PURE__*/function (_FunctionExecutionErr) {
  (0, _inherits2["default"])(AsyncFunctionExecutionError, _FunctionExecutionErr);

  var _super = _createSuper(AsyncFunctionExecutionError);

  function AsyncFunctionExecutionError() {
    (0, _classCallCheck2["default"])(this, AsyncFunctionExecutionError);
    return _super.apply(this, arguments);
  }

  return AsyncFunctionExecutionError;
}(_FunctionExecutionError.FunctionExecutionError);

exports.AsyncFunctionExecutionError = AsyncFunctionExecutionError;
var _default = AsyncFunctionExecutionError;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9lcnJvcnMvQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yLmpzIl0sIm5hbWVzIjpbIkFzeW5jRnVuY3Rpb25FeGVjdXRpb25FcnJvciIsIkZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDYUEsMkI7Ozs7Ozs7Ozs7O0VBQW9DQyw4Qzs7O2VBRWxDRCwyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IgfSBmcm9tICcuL0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3InXG5cbi8qKlxuICogRGVub3RlcyBtb3JlIHNlcGVjaWZpY2FsbHkgdGhhdCB0aGUgZXZhbHVhdGlvbiBvZiB0aGUgZnVuY3Rpb24gaW52b2tlZFxuICogb2NjdXJyZWQgd2hlbiBydW5uaW5nIGEga25vd24gYXN5bmNocm9ub3VzIGZ1bmN0aW9uIHJhdGhlciB0aGFuIGEgc3RhbmRhcmRcbiAqIHN5bmNocm9ub3VzIHZlcnNpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBBc3luY0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3IgZXh0ZW5kcyBGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIHsgfVxuXG5leHBvcnQgZGVmYXVsdCBBc3luY0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3IiXX0=