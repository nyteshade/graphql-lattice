import { FunctionExecutionError } from './FunctionExecutionError'

/**
 * Denotes more sepecifically that the evaluation of the function invoked
 * occurred when running a known asynchronous function rather than a standard
 * synchronous version.
 */
export class AsyncFunctionExecutionError extends FunctionExecutionError { }

export default AsyncFunctionExecutionError