/** @namespace utils */
// @flow

import { typeOf } from './types'

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
  static TimedDeferred(timeOut: Number, proxyPromise: ?Promise): Deferred {
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
 * A small helper for multiline template strings that allows you to
 * not worry about new lines and indentations within your code from
 * breaking up the format of the string. 
 *
 * @memberof utils
 * @since 2.5
 * 
 * @param {Array} strings an array of Strings from the template, broken up by
 * where the substitions are to be inserted.
 * @param {Array} values an array of values to be inserted after each string
 * of a matching index.
 * @return {String} a template String without any prefixed or postfixed tabs
 * and other whitespaced characters. 
 */
export function joinLines(strings, ...values) {
  let result = [];
  for (let i = 0; i < strings.length; i++) {
    let string = strings[i];
    let value = values.length > i && `${values[i]} ` || '' 
    result.push(string
      .replace(/(^\s*)?(.*)(\s*$)?/g, '$2')
      .replace(/\r?\n/g, ' ')
    );
    result.push(value);
  }
  return result.join('');
}