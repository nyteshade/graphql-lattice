/** @namespace decorators */
/** @flow */

/**
 * This decorator allows you to specify the SCHEMA getter and associated
 * string as a parameter to the decorator itself. So, for example:
 *
 * <code>
 * @Schema(`
 *   type Item {
 *     name: String
 *     cost: String
 *   }
 * `)
 * export class Item extends GQLBase {
 *   // ...
 * }
 * </code>
 *
 * @function 🏷⠀Schema
 * @memberof! decorators
 * @since 2.2.0
 *
 * @param {string} schemaString a GraphQL IDL compliant string for defining a
 * GraphQL Object Schema.
 */
export function Schema(schemaString: string) {
  return function(target: Object) {
    // @ComputedType
    Object.defineProperties(target, {
      SCHEMA: {
        get: () => schemaString
      }
    });
  }
}

export default Schema;
