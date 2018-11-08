"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdjacentSchema = exports.default = AdjacentSchema;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _GQLBase = require("../GQLBase");

/** @namespace decorators */

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
function AdjacentSchema(classModule) {
  return function (target) {
    // Attempt to remove the SCHEMA and module properties or functions from
    // the class being decorated. This is not guaranteed to work but should
    // increase compatibilty and success rates.
    // @ComputedType
    delete target.SCHEMA; // @ComputedType

    delete target.module; // @ComputedType

    return Object.defineProperties(target, (0, _defineProperty2.default)({
      module: {
        get: function get() {
          return classModule;
        }
      },
      SCHEMA: {
        get: function get() {
          return _GQLBase.GQLBase.ADJACENT_FILE;
        }
      }
    }, Symbol.for('@adjacentSchema'), {
      get: function get() {
        return true;
      }
    }));
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL0FkamFjZW50U2NoZW1hLmpzIl0sIm5hbWVzIjpbIkFkamFjZW50U2NoZW1hIiwiY2xhc3NNb2R1bGUiLCJ0YXJnZXQiLCJTQ0hFTUEiLCJtb2R1bGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZ2V0IiwiR1FMQmFzZSIsIkFESkFDRU5UX0ZJTEUiLCJTeW1ib2wiLCJmb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0E7O0FBSEE7O0FBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCZSxTQUFTQSxjQUFULENBQXdCQyxXQUF4QixFQUE2QztBQUMxRCxTQUFPLFVBQVNDLE1BQVQsRUFBMEI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFPQSxNQUFNLENBQUNDLE1BQWQsQ0FMK0IsQ0FNL0I7O0FBQ0EsV0FBT0QsTUFBTSxDQUFDRSxNQUFkLENBUCtCLENBUy9COztBQUNBLFdBQU9DLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0JKLE1BQXhCO0FBQ0xFLE1BQUFBLE1BQU0sRUFBRTtBQUNORyxRQUFBQSxHQUFHLEVBQUU7QUFBQSxpQkFBTU4sV0FBTjtBQUFBO0FBREMsT0FESDtBQUtMRSxNQUFBQSxNQUFNLEVBQUU7QUFDTkksUUFBQUEsR0FBRyxFQUFFO0FBQUEsaUJBQU1DLGlCQUFRQyxhQUFkO0FBQUE7QUFEQztBQUxILE9BU0pDLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLGlCQUFYLENBVEksRUFTNEI7QUFDL0JKLE1BQUFBLEdBQUcsRUFBRTtBQUFBLGVBQU0sSUFBTjtBQUFBO0FBRDBCLEtBVDVCLEVBQVA7QUFhRCxHQXZCRDtBQXdCRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAbmFtZXNwYWNlIGRlY29yYXRvcnMgKi9cbi8vIEBmbG93XG5cbmltcG9ydCB7IEdRTEJhc2UgfSBmcm9tICcuLi9HUUxCYXNlJ1xuXG4vKipcbiAqIEEgZGVjb3JhdG9yIHRoYXQgZG9lcyB0aHJlZSB0aGluZ3MuIEZpcnN0IGl0IGRlZmluZXMgdGhlXG4gKiBtb2R1bGUoKSBzdGF0aWMgbWV0aG9kIHRoYXQgaXMgcmVxdWlyZWQgd2hlbiB1c2luZyBhZGphY2VudFxuICogc2NoZW1hIGZpbGVzLiBTZWNvbmRseSwgaXQgZGVmaW5lcyBhIFNDSEVNQSBnZXR0ZXIgdGhhdFxuICogcmV0dXJucyBgR1FMQmFzZS5BREpBQ0VOVF9GSUxFYC4gRmluYWxseSBpdCBzZXRzIGEgc3RhdGljXG4gKiBnZXR0ZXIgd2l0aCB0aGUgYFN5bWJvbGAsIGBAYWRqYWNlbnRTY2hlbWFgIHNvIHRoYXQgb3RoZXJcbiAqIGNhbiBkZXRlcm1pbmUgd2hldGhlciBvciBub3QgdGhlIGRlY29yYXRvciB3YXMgdXNlZC5cbiAqXG4gKiBAZnVuY3Rpb24g8J+Pt+KggEFkamFjZW50U2NoZW1hXG4gKiBAbWVtYmVyb2YhIGRlY29yYXRvcnNcbiAqIEBzaW5jZSAyLjEuMFxuICpcbiAqIEBwYXJhbSB7bWl4ZWR9IG9iamVjdCB0aGUgb2JqZWN0IG9uIHdoaWNoIHRvIGFwcGx5IHRoZSBkZWNvcmF0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSB0aGUgbmFtZSBvZiB0aGUgb2JqZWN0IG9yIHByb3BlcnR5IHRvXG4gKiB3aGljaCB0aGUgZGVjb3JhdG9yIGlzIGJlaW5nIGFwcGxpZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzY3JpcHRvciBhIHN0YW5kYXJkIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBzdHlsZVxuICogZGVzY3JpcHRvciBvYmplY3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFkamFjZW50U2NoZW1hKGNsYXNzTW9kdWxlOiBPYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogR1FMQmFzZSkge1xuICAgIC8vIEF0dGVtcHQgdG8gcmVtb3ZlIHRoZSBTQ0hFTUEgYW5kIG1vZHVsZSBwcm9wZXJ0aWVzIG9yIGZ1bmN0aW9ucyBmcm9tXG4gICAgLy8gdGhlIGNsYXNzIGJlaW5nIGRlY29yYXRlZC4gVGhpcyBpcyBub3QgZ3VhcmFudGVlZCB0byB3b3JrIGJ1dCBzaG91bGRcbiAgICAvLyBpbmNyZWFzZSBjb21wYXRpYmlsdHkgYW5kIHN1Y2Nlc3MgcmF0ZXMuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIGRlbGV0ZSB0YXJnZXQuU0NIRU1BO1xuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICBkZWxldGUgdGFyZ2V0Lm1vZHVsZTtcblxuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCB7XG4gICAgICBtb2R1bGU6IHtcbiAgICAgICAgZ2V0OiAoKSA9PiBjbGFzc01vZHVsZVxuICAgICAgfSxcblxuICAgICAgU0NIRU1BOiB7XG4gICAgICAgIGdldDogKCkgPT4gR1FMQmFzZS5BREpBQ0VOVF9GSUxFXG4gICAgICB9LFxuXG4gICAgICBbU3ltYm9sLmZvcignQGFkamFjZW50U2NoZW1hJyldOiB7XG4gICAgICAgIGdldDogKCkgPT4gdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7IEFkamFjZW50U2NoZW1hIH07XG4iXX0=