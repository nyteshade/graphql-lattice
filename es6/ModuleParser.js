// @flow

import * as types from './types'

const {
  isString,
  isOfType,
  isPrimitive,
  isArray,
  isObject
} = types;

/**
 * The ModuleParser is a utility class designed to loop through and iterate
 * on a directory and pull out of each .js file found, any classes or exports
 * that extend from GQLBase or a child of GQLBase.
 *
 * @class ModuleParser
 */
export class ModuleParser {
  /**
   * The constructor
   *
   * @constructor
   * @method ⎆⠀constructor
   * @memberof ModuleParser
   * @inner
   *
   * @param {string|mixed} moduleNameOrModule [description]
   */
  constuctor(moduleNameOrModule: string|mixed):ModuleParser {
    let moduleName, moduleContents;

    if (isString(moduleNameOrModule)) {
      try { moduleContents = require(moduleNameOrModule); } catch(ignore) { }
      if (!moduleContents) {
        throw new Error(`
          Unable to require()'${moduleNameOrModule}'). Please check this file
          to make sure it should be part of the load process.
        `);
      }
    }
    else {
      moduleContents = moduleNameOrModule;
    }

    if (!moduleContents) {
      throw new Error(`
        Inspite of being passed ${moduleNameOrModule}, it was determined that
        the value passed in was null or falsey. Please provide a module name
        or an Object that can be iterated over for potential GQLBase classes.
      `);
    }

    this.initWith(moduleContents);
  }

  /**
   * Given an object, typically the result of a `require()` or `import`
   * command, iterate over its contents and find any `GQLBase` derived
   * exports. Continually, and recursively, build this list of classes out
   * so that we can add them to a `GQLExpressMiddleware`.
   *
   * @method ⌾⠀initWith
   * @memberof ModuleParser
   * @inner
   *
   * @param {mixed} contents the object to parse for properties extending
   * from `GQLBase`
   * @param {Array<GQLBase>} gqlDefinitions the results, allowed as a second
   * parameter during recursion as a means to save state between calls
   * @return {Set<mixed>} a unique set of values that are currently being
   * iterated over. Passed in as a third parameter to save state between calls
   * during recursion.
   */
  initWith(
    contents: mixed,
    gqlDefinitions: Array<GQLBase> = [],
    stack: Set<mixed> = new Set()
  ): void {
    // In order to prevent infinite object recursion, we should add the
    // object being iterated over to our Set. At each new recursive level
    // add the item being iterated over to the set and only recurse into
    // if the item does not already exist in the stack itself.
    stack.add(contents)

    for (let key in contents) {
      let value = contents[key];

      if (isPrimitive(value)) { continue }

      if (extendsFrom(value, GQLBase)) {
        gqlDefinitions.push(value);
      }

      if ((isObject(value) || isArray(value)) && !stack.has(value)) {
        gqlDefinitions = this.initWith(value, gqlDefinitions, stack);
      }
    }

    // We remove the current iterable from our set as we leave this current
    // recursive iteration.
    stack.delete(contents)

    return gqlDefinitions
  }

  /**
   * Returns the `constructor` name. If invoked as the context, or `this`,
   * object of the `toString` method of `Object`'s `prototype`, the resulting
   * value will be `[object MyClass]`, given an instance of `MyClass`
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof ModuleParser
   *
   * @return {string} the name of the class this is an instance of
   */
  get [Symbol.toStringTag]() { return this.constructor.name }

  /**
   * Applies the same logic as {@link #[Symbol.toStringTag]} but on a static 
   * scale. So, if you perform `Object.prototype.toString.call(MyClass)` 
   * the result would be `[object MyClass]`.
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof ModuleParser
   * @static
   *
   * @return {string} the name of this class
   */
  static get [Symbol.toStringTag]() { return this.name }
}
