"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = Schema;
exports.default = void 0;

/** @namespace decorators */

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
function Schema(schemaString) {
  return function (target) {
    // @ComputedType
    Object.defineProperties(target, {
      SCHEMA: {
        get: function get() {
          return schemaString;
        }
      }
    });
  };
}

var _default = Schema;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL1NjaGVtYS5qcyJdLCJuYW1lcyI6WyJTY2hlbWEiLCJzY2hlbWFTdHJpbmciLCJ0YXJnZXQiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiU0NIRU1BIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCTyxTQUFTQSxNQUFULENBQWdCQyxZQUFoQixFQUFzQztBQUMzQyxTQUFPLFVBQVNDLE1BQVQsRUFBeUI7QUFDOUI7QUFDQUMsSUFBQUEsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QkYsTUFBeEIsRUFBZ0M7QUFDOUJHLE1BQUFBLE1BQU0sRUFBRTtBQUNOQyxRQUFBQSxHQUFHLEVBQUU7QUFBQSxpQkFBTUwsWUFBTjtBQUFBO0FBREM7QUFEc0IsS0FBaEM7QUFLRCxHQVBEO0FBUUQ7O2VBRWNELE0iLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQG5hbWVzcGFjZSBkZWNvcmF0b3JzICovXG4vKiogQGZsb3cgKi9cblxuLyoqXG4gKiBUaGlzIGRlY29yYXRvciBhbGxvd3MgeW91IHRvIHNwZWNpZnkgdGhlIFNDSEVNQSBnZXR0ZXIgYW5kIGFzc29jaWF0ZWRcbiAqIHN0cmluZyBhcyBhIHBhcmFtZXRlciB0byB0aGUgZGVjb3JhdG9yIGl0c2VsZi4gU28sIGZvciBleGFtcGxlOlxuICpcbiAqIDxjb2RlPlxuICogQFNjaGVtYShgXG4gKiAgIHR5cGUgSXRlbSB7XG4gKiAgICAgbmFtZTogU3RyaW5nXG4gKiAgICAgY29zdDogU3RyaW5nXG4gKiAgIH1cbiAqIGApXG4gKiBleHBvcnQgY2xhc3MgSXRlbSBleHRlbmRzIEdRTEJhc2Uge1xuICogICAvLyAuLi5cbiAqIH1cbiAqIDwvY29kZT5cbiAqXG4gKiBAZnVuY3Rpb24g8J+Pt+KggFNjaGVtYVxuICogQG1lbWJlcm9mISBkZWNvcmF0b3JzXG4gKiBAc2luY2UgMi4yLjBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1hU3RyaW5nIGEgR3JhcGhRTCBJREwgY29tcGxpYW50IHN0cmluZyBmb3IgZGVmaW5pbmcgYVxuICogR3JhcGhRTCBPYmplY3QgU2NoZW1hLlxuICovXG5leHBvcnQgZnVuY3Rpb24gU2NoZW1hKHNjaGVtYVN0cmluZzogc3RyaW5nKSB7XG4gIHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IE9iamVjdCkge1xuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHtcbiAgICAgIFNDSEVNQToge1xuICAgICAgICBnZXQ6ICgpID0+IHNjaGVtYVN0cmluZ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVtYTtcbiJdfQ==