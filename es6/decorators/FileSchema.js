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
 * @function 🏷⠀FileSchema
 * @memberof! decorators
 * @since 2.3.0
 *
 * @param {String} path a relative or absolute path to the file containing
 * your GraphQL IDL schema portion for your object type.
 * @param {String} extension the extension of the graphql schema file pointed
 * to in the previous parameter. By default these are `".graphql"` but should
 * your path point to a file with a different extension, you should specify
 * that extension here.
 * @return {mixed} as per all class decorators, `FileSchema` returns the
 * class object being modified
 */
export default function FileSchema(
  path: string,
  extension: string = ".graphql"
): mixed {
  return function(target: Object): Object {
    // Attempt to remove the SCHEMA property or function from the class
    // being decorated. This is not guaranteed to work but should increase
    // compatibilty and success rates.
    delete target.SCHEMA;

    // @ComputedType
    return Object.defineProperties(target, {
      SCHEMA: {
        get: () => GQLBase.IDLFilePath(path, extension)
      },

      [Symbol.for('@fileSchema')]: {
        get: () => true
      }
    });
  }
}

export { FileSchema };
