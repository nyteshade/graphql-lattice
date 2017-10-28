/** @namespace decorators */
// @flow

import { GQLBase } from '../GQLBase'

/**
 * A decorator that does three things. First it defines the
 * module() static method that is required when using adjacent
 * schema files. Secondly, it defines a SCHEMA getter that
 * returns `GQLBase.ADJACENT_FILE`. Finally it sets a static
 * getter with the `Symbol`, `@adjacentSchema` so that other
 * can determine whether or not the decorator was used.
 *
 * @function 🏷⠀AdjacentSchema
 * @memberof! decorators
 * @since 2.1.0
 *
 * @param {mixed} object the object on which to apply the decorator
 * @param {String} property the name of the object or property to
 * which the decorator is being applied.
 * @param {Object} descriptor a standard Object.defineProperty style
 * descriptor object.
 */
export default function AdjacentSchema(classModule: Object) {
  return function(target: GQLBase) {
    // Attempt to remove the SCHEMA and module properties or functions from
    // the class being decorated. This is not guaranteed to work but should
    // increase compatibilty and success rates.
    // @ComputedType
    delete target.SCHEMA;
    // @ComputedType
    delete target.module;

    // @ComputedType
    return Object.defineProperties(target, {
      module: {
        get: () => classModule
      },

      SCHEMA: {
        get: () => GQLBase.ADJACENT_FILE
      },

      [Symbol.for('@adjacentSchema')]: {
        get: () => true
      }
    });
  }
}

export { AdjacentSchema };
