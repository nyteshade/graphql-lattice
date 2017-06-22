// @flow
// @module utils
// @namespace utils

/**
 * One common way to determine the type of class that you are working with, 
 * in a fairly compatible manner, is to use .call or .apply on the function 
 * toString of the Object.prototype.
 *
 * Calling `Object.prototype.toString.call('hello')` will yield 
 * `"[object String]"` as an answer. This technique is fairly sound but is 
 * also fairly verbose to use often. This function extracts the detected value 
 * name from the above string; so "String" from "[object String]" and so forth. 
 *
 * The added advantage of using this method is that it works well with direct 
 * name comparisons, such as `typeOf("asdfas") === String.name`. The new 
 * `Symbol.toStringTag` allows you to define custom values that are 
 * reflected in this manner.
 * 
 * @method typeOf
 * @memberof utils
 * 
 * @param {any} object any value is acceptable here, including null and 
 * undefined
 * @return {string} for objects of type [object String] the value "String"
 * will be returned.
 */
export function typeOf(object: any): string { 
  return /(\b\w+\b)\]/.exec(Object.prototype.toString.call(object))[1];
}

/**
 * Deferred is modeled after jQuery's deferred object. It inverts a promise 
 * such that its resolve and reject methods can be invoked without wrapping 
 * all of the related code within a Promise's function. 
 *
 * @class Deferred
 * @memberof utils
 */
export class Deferred {
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
   * @method constructor
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
   * @method pending
   * 
   * @return {boolean} true if the promise is not yet complete; false otherwise
   */
  get pending(): boolean { return !this.complete }
}
