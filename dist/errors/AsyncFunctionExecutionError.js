'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AsyncFunctionExecutionError = undefined;

var _FunctionExecutionError = require('./FunctionExecutionError');

/**
 * Denotes more sepecifically that the evaluation of the function invoked
 * occurred when running a known asynchronous function rather than a standard
 * synchronous version.
 */
let AsyncFunctionExecutionError = exports.AsyncFunctionExecutionError = class AsyncFunctionExecutionError extends _FunctionExecutionError.FunctionExecutionError {};
exports.default = AsyncFunctionExecutionError;
//# sourceMappingURL=AsyncFunctionExecutionError.js.map