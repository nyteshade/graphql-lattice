/**
 * The FunctionExecutionError denotes that the error was invoked
 * during a runtime evaluation of a function
 */
export class FunctionExecutionError extends Error {
  /** The error, if any, that prompted the creation of this instance */
  error: Error

  /** The function in question, if available, that caused the error */
  fn: Function

  /** The arguments, if available, that invoked the error */
  args: Array<Mixed>

  /** The result from the function, if any, at the time of Error */
  result: mixed

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
  constructor(
    error: ?(Error | string),
    fn: ?Function,
    args: ?Array<mixed>,
    result: mixed
  ) {
    let message = error instanceof Error ? error.message : error

    super(message)

    if (error instanceof Error) {
      let { columnNumber, fileName, lineNumber, message, name, stack } = error

      Object.assign(this, {
        columnNumber, fileName, lineNumber, message, name, stack
      })

      this.error = error
    }

    Object.assign(this, { error, fn, args, result })
  }
}

export default FunctionExecutionError