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
        get: () => schemaString
      }
    });
  };
}

var _default = Schema;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL1NjaGVtYS5qcyJdLCJuYW1lcyI6WyJTY2hlbWEiLCJzY2hlbWFTdHJpbmciLCJ0YXJnZXQiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiU0NIRU1BIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCTyxTQUFTQSxNQUFULENBQWdCQyxZQUFoQixFQUFzQztBQUMzQyxTQUFPLFVBQVNDLE1BQVQsRUFBeUI7QUFDOUI7QUFDQUMsSUFBQUEsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QkYsTUFBeEIsRUFBZ0M7QUFDOUJHLE1BQUFBLE1BQU0sRUFBRTtBQUNOQyxRQUFBQSxHQUFHLEVBQUUsTUFBTUw7QUFETDtBQURzQixLQUFoQztBQUtELEdBUEQ7QUFRRDs7ZUFFY0QsTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAbmFtZXNwYWNlIGRlY29yYXRvcnMgKi9cbi8qKiBAZmxvdyAqL1xuXG4vKipcbiAqIFRoaXMgZGVjb3JhdG9yIGFsbG93cyB5b3UgdG8gc3BlY2lmeSB0aGUgU0NIRU1BIGdldHRlciBhbmQgYXNzb2NpYXRlZFxuICogc3RyaW5nIGFzIGEgcGFyYW1ldGVyIHRvIHRoZSBkZWNvcmF0b3IgaXRzZWxmLiBTbywgZm9yIGV4YW1wbGU6XG4gKlxuICogPGNvZGU+XG4gKiBAU2NoZW1hKGBcbiAqICAgdHlwZSBJdGVtIHtcbiAqICAgICBuYW1lOiBTdHJpbmdcbiAqICAgICBjb3N0OiBTdHJpbmdcbiAqICAgfVxuICogYClcbiAqIGV4cG9ydCBjbGFzcyBJdGVtIGV4dGVuZHMgR1FMQmFzZSB7XG4gKiAgIC8vIC4uLlxuICogfVxuICogPC9jb2RlPlxuICpcbiAqIEBmdW5jdGlvbiDwn4+34qCAU2NoZW1hXG4gKiBAbWVtYmVyb2YhIGRlY29yYXRvcnNcbiAqIEBzaW5jZSAyLjIuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWFTdHJpbmcgYSBHcmFwaFFMIElETCBjb21wbGlhbnQgc3RyaW5nIGZvciBkZWZpbmluZyBhXG4gKiBHcmFwaFFMIE9iamVjdCBTY2hlbWEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTY2hlbWEoc2NoZW1hU3RyaW5nOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogT2JqZWN0KSB7XG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwge1xuICAgICAgU0NIRU1BOiB7XG4gICAgICAgIGdldDogKCkgPT4gc2NoZW1hU3RyaW5nXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NoZW1hO1xuIl19