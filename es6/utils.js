/** @namespace utils */
// @flow

import { typeOf } from './types'
import fs from 'fs'
import util from 'util'
export { dedent as joinLines } from 'ne-tag-fns'

const { Stats } = fs;

/**
 * Deferred is modeled after jQuery's deferred object. It inverts a promise
 * such that its resolve and reject methods can be invoked without wrapping
 * all of the related code within a Promise's function.
 *
 * @memberof utils
 * @class Deferred
 */
export class Deferred {
  /**
   * This property holds a `resolve` function from within the promise this
   * deferred inverts.
   *
   * @type {Function}
   * @memberof Deferred
   * @instance
   */
  resolve: Function;
  
  /**
   * This property holds a `reject` function from within the promise this 
   * deferred inverts
   *
   * @type {Function}
   * @memberof Deferred
   * @instance
   */
  reject: Function;
  
  /**
   * This is the promise wrapped by and inverted in this deferred instance
   *
   * @type {Promise}
   * @memberof Deferred
   * @instance 
   */
  promise: any;
  
  /**
   * An at a glance boolean property that denotes whether or not this 
   * deferred has been resolved or rejected yet.
   *
   * @type {boolean}
   * @memberof Deferred
   * @instance
   */
  complete: boolean;
  
  /**
   * Creates an object with four properties of note; promise, resolve, reject
   * and a flag complete that will be set once either resolve or reject have
   * been called. A Deferred is considered to be pending while complete is set
   * to false.
   *
   * Once constructed, resolve and reject can be called later, at which point,
   * the promise is completed. The promise property is the promise resolved
   * or rejected by the associated properties and can be used with other
   * async/await or Promise based code.
   *
   * @instance
   * @memberof Deferred
   * @method ⎆⠀constructor
   *
   * @param {any} resolveWith a deferred resolved as Promise.resolve() might do
   * @param {any} rejectWith a deferred rejected as Promise.reject() might do
   */
  constructor(resolveWith: any, rejectWith: any) {
    this.promise = new Promise((resolve, reject) => {
      this.complete = false;

      this.resolve = (...args) => {
        this.complete = true;
        return resolve(...args);
      };

      this.reject = (...args) => {
        this.complete = true;
        return reject(...args);
      };

      if (resolveWith && !rejectWith) { this.resolve(resolveWith) }
      if (rejectWith && !resolveWith) { this.reject(rejectWith) }
    });
  }

  /**
   * Shorthand getter that denotes true if the deferred is not yet complete.
   *
   * @instance
   * @memberof Deferred
   * @method ⬇︎⠀pending
   *
   * @return {boolean} true if the promise is not yet complete; false otherwise
   */
  get pending(): boolean { return !this.complete }

  /**
   * Promises are great but if the code never resolves or rejects a deferred,
   * then things will become eternal; in a bad way. This makes that less likely
   * of an event.
   *
   * If the number of milliseconds elapses before a resolve or reject occur,
   * then the deferred is rejected.
   *
   * @static
   * @memberof Deferred
   * @method ⌾⠀TimedDeferred
   *
   * @param {Number} timeOut a number of milliseconds to wait before rejecting
   * the deferred.
   * @param {Promise} proxyPromise a promise to proxy then/catch through to the
   * deferreds resolve/reject.
   * @return {Deferred} an instance of deferred that will timeout after
   * `timeOut` milliseconds have elapsed. If `proxyPromise` is a `Promise`
   * then the deferred's reject and resolve will be tied to the Promise's
   * catch() and then() methods, respectively.
   */
  static TimedDeferred(timeOut: Number, proxyPromise: ?any): Deferred {
    const deferred = new Deferred();

    if (proxyPromise && typeOf(proxyPromise) === Promise.name) {
      proxyPromise.then((...args) => deferred.resolve(...args))
      proxyPromise.catch(reason => deferred.reject(reason))
    }

    setTimeout(() => deferred.reject(new Error('Deferred timed out'), timeOut))

    return deferred;
  }
}

/**
 * A simply promisify style function that returns an async function wrapped 
 * around a supplied function designed for the standard callback methodology. 
 * If the callback is the last parameter, and that callback is in the form of 
 * (error, ...results) then this wrapper will do the trick for you.
 *
 * @method utils~promisify
 * @since 2.7.0
 * 
 * @param {Function} method a function to wrap in an asynchronous function 
 * @param {mixed} context an optional `this` object for use with the supplied 
 * function.
 * @return {Function} an asynchronous function, i.e. one that returns a promise 
 * containing the contents the callback results, that wraps the supplied 
 * function.
 */
export function promisify(method: Function, context?: mixed): Function {
  return async function(...args) {
    return new Promise((resolve, reject) => {
      args.push(function(error, ...callbackArgs) {
        if (error) {
          reject(error);
        }
        else {
          resolve(...callbackArgs);
        }
      });
      
      method.apply(context, args);
    })
  }
}