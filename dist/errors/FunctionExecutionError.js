"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionExecutionError = undefined;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The FunctionExecutionError denotes that the error was invoked
 * during a runtime evaluation of a function
 */
let FunctionExecutionError = exports.FunctionExecutionError = class FunctionExecutionError extends Error {

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


  /** The arguments, if available, that invoked the error */

  /** The error, if any, that prompted the creation of this instance */
  constructor(error, fn, args, result) {
    let message = error instanceof Error ? error.message : error;

    super(message);

    if (error instanceof Error) {
      let { columnNumber, fileName, lineNumber, message, name, stack } = error;

      (0, _assign2.default)(this, {
        columnNumber, fileName, lineNumber, message, name, stack
      });

      this.error = error;
    }

    (0, _assign2.default)(this, { error, fn, args, result });
  }

  /** The result from the function, if any, at the time of Error */


  /** The function in question, if available, that caused the error */
};
exports.default = FunctionExecutionError;
//# sourceMappingURL=FunctionExecutionError.js.map