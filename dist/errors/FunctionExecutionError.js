"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FunctionExecutionError = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * The FunctionExecutionError denotes that the error was invoked
 * during a runtime evaluation of a function
 */
class FunctionExecutionError extends Error {
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
  constructor(error, fn, args, result) {
    let message = error instanceof Error ? error.message : error;
    super(message);

    _defineProperty(this, "error", void 0);

    _defineProperty(this, "fn", void 0);

    _defineProperty(this, "args", void 0);

    _defineProperty(this, "result", void 0);

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

    Object.assign(this, {
      error,
      fn,
      args,
      result
    });
  }

}

exports.FunctionExecutionError = FunctionExecutionError;
var _default = FunctionExecutionError;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9lcnJvcnMvRnVuY3Rpb25FeGVjdXRpb25FcnJvci5qcyJdLCJuYW1lcyI6WyJGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsImVycm9yIiwiZm4iLCJhcmdzIiwicmVzdWx0IiwibWVzc2FnZSIsImNvbHVtbk51bWJlciIsImZpbGVOYW1lIiwibGluZU51bWJlciIsIm5hbWUiLCJzdGFjayIsIk9iamVjdCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFJTyxNQUFNQSxzQkFBTixTQUFxQ0MsS0FBckMsQ0FBMkM7QUFDaEQ7O0FBR0E7O0FBR0E7O0FBR0E7O0FBR0E7Ozs7Ozs7Ozs7OztBQVlBQyxFQUFBQSxXQUFXLENBQ1RDLEtBRFMsRUFFVEMsRUFGUyxFQUdUQyxJQUhTLEVBSVRDLE1BSlMsRUFLVDtBQUNBLFFBQUlDLE9BQU8sR0FBR0osS0FBSyxZQUFZRixLQUFqQixHQUF5QkUsS0FBSyxDQUFDSSxPQUEvQixHQUF5Q0osS0FBdkQ7QUFFQSxVQUFNSSxPQUFOOztBQUhBOztBQUFBOztBQUFBOztBQUFBOztBQUtBLFFBQUlKLEtBQUssWUFBWUYsS0FBckIsRUFBNEI7QUFDMUIsVUFBSTtBQUFFTyxRQUFBQSxZQUFGO0FBQWdCQyxRQUFBQSxRQUFoQjtBQUEwQkMsUUFBQUEsVUFBMUI7QUFBc0NILFFBQUFBLE9BQXRDO0FBQStDSSxRQUFBQSxJQUEvQztBQUFxREMsUUFBQUE7QUFBckQsVUFBK0RULEtBQW5FO0FBRUFVLE1BQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsRUFBb0I7QUFDbEJOLFFBQUFBLFlBRGtCO0FBQ0pDLFFBQUFBLFFBREk7QUFDTUMsUUFBQUEsVUFETjtBQUNrQkgsUUFBQUEsT0FEbEI7QUFDMkJJLFFBQUFBLElBRDNCO0FBQ2lDQyxRQUFBQTtBQURqQyxPQUFwQjtBQUlBLFdBQUtULEtBQUwsR0FBYUEsS0FBYjtBQUNEOztBQUVEVSxJQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLEVBQW9CO0FBQUVYLE1BQUFBLEtBQUY7QUFBU0MsTUFBQUEsRUFBVDtBQUFhQyxNQUFBQSxJQUFiO0FBQW1CQyxNQUFBQTtBQUFuQixLQUFwQjtBQUNEOztBQTlDK0M7OztlQWlEbkNOLHNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgRnVuY3Rpb25FeGVjdXRpb25FcnJvciBkZW5vdGVzIHRoYXQgdGhlIGVycm9yIHdhcyBpbnZva2VkXG4gKiBkdXJpbmcgYSBydW50aW1lIGV2YWx1YXRpb24gb2YgYSBmdW5jdGlvblxuICovXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25FeGVjdXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqIFRoZSBlcnJvciwgaWYgYW55LCB0aGF0IHByb21wdGVkIHRoZSBjcmVhdGlvbiBvZiB0aGlzIGluc3RhbmNlICovXG4gIGVycm9yOiBFcnJvclxuXG4gIC8qKiBUaGUgZnVuY3Rpb24gaW4gcXVlc3Rpb24sIGlmIGF2YWlsYWJsZSwgdGhhdCBjYXVzZWQgdGhlIGVycm9yICovXG4gIGZuOiBGdW5jdGlvblxuXG4gIC8qKiBUaGUgYXJndW1lbnRzLCBpZiBhdmFpbGFibGUsIHRoYXQgaW52b2tlZCB0aGUgZXJyb3IgKi9cbiAgYXJnczogQXJyYXk8TWl4ZWQ+XG5cbiAgLyoqIFRoZSByZXN1bHQgZnJvbSB0aGUgZnVuY3Rpb24sIGlmIGFueSwgYXQgdGhlIHRpbWUgb2YgRXJyb3IgKi9cbiAgcmVzdWx0OiBtaXhlZFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IEZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IgaW5zdGFuY2UuIEFueSBpbmZvcm1hdGlvbiB0aGF0XG4gICAqIGNhbiBiZSBwYXNzZWQgYWJvdXQgdGhlIGVycm9yIGF0IHRoZSB0aW1lIG9mIGZhaWx1cmUgc2hvdWxkIGJlIGNhcHR1cmVkXG4gICAqIGhlcmUgaWYgcG9zc2libGUuIFNvbWUgdmFsdWVzIHRoYXQgbWFrZSBzZW5zZSBhcmUgYW55IG90aGVyIGV4aXN0aW5nXG4gICAqIGVycm9yIHByZXNlbnQgYXQgdGhlIHRpbWUgdGhpcyBpc3N1ZSBjcm9wcGVkIHVwLCB0aGUgZnVuY3Rpb24gdGhhdCBmYWlsZWQsXG4gICAqIGFueSBhcmd1bWVudHMgcGFzc2VkIHRvIGl0IGFuZCBhbnkgcmVzdWx0aW5nIHZhbHVlIGl0IG1heSBoYXZlIHR1cm5lZCB1cC5cbiAgICpcbiAgICogQHBhcmFtICB7RXJyb3J8c3RyaW5nfSBlcnJvciBhbnkgZXJyb3IgcHJlc2VudCBhdCB0aGUgdGltZSBvZiBmYWlsdXJlXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiB0aGUgZnVuY3Rpb24gdGhhdCBmYWlsZWRcbiAgICogQHBhcmFtICB7QXJyYXk8bWl4ZWQ+fSBhcmdzIGFueSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBmYWlsZWQgZm5cbiAgICogQHBhcmFtICB7bWl4ZWR9IHJlc3VsdCBhbnkgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBmYWlsZWQgZnVuY3Rpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVycm9yOiA/KEVycm9yIHwgc3RyaW5nKSxcbiAgICBmbjogP0Z1bmN0aW9uLFxuICAgIGFyZ3M6ID9BcnJheTxtaXhlZD4sXG4gICAgcmVzdWx0OiBtaXhlZFxuICApIHtcbiAgICBsZXQgbWVzc2FnZSA9IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogZXJyb3JcblxuICAgIHN1cGVyKG1lc3NhZ2UpXG5cbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgbGV0IHsgY29sdW1uTnVtYmVyLCBmaWxlTmFtZSwgbGluZU51bWJlciwgbWVzc2FnZSwgbmFtZSwgc3RhY2sgfSA9IGVycm9yXG5cbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xuICAgICAgICBjb2x1bW5OdW1iZXIsIGZpbGVOYW1lLCBsaW5lTnVtYmVyLCBtZXNzYWdlLCBuYW1lLCBzdGFja1xuICAgICAgfSlcblxuICAgICAgdGhpcy5lcnJvciA9IGVycm9yXG4gICAgfVxuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7IGVycm9yLCBmbiwgYXJncywgcmVzdWx0IH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRnVuY3Rpb25FeGVjdXRpb25FcnJvciJdfQ==