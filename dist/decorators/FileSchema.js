"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileSchema = exports["default"] = FileSchema;

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
function FileSchema(path) {
  var extension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".graphql";
  return function (target) {
    // Attempt to remove the SCHEMA property or function from the class
    // being decorated. This is not guaranteed to work but should increase
    // compatibilty and success rates.
    delete target.SCHEMA; // @ComputedType

    return Object.defineProperties(target, (0, _defineProperty2["default"])({
      SCHEMA: {
        get: function get() {
          return _GQLBase.GQLBase.IDLFilePath(path, extension);
        }
      }
    }, Symbol["for"]('@fileSchema'), {
      get: function get() {
        return true;
      }
    }));
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL0ZpbGVTY2hlbWEuanMiXSwibmFtZXMiOlsiRmlsZVNjaGVtYSIsInBhdGgiLCJleHRlbnNpb24iLCJ0YXJnZXQiLCJTQ0hFTUEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZ2V0IiwiR1FMQmFzZSIsIklETEZpbGVQYXRoIiwiU3ltYm9sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBOztBQUhBOztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLFNBQVNBLFVBQVQsQ0FDYkMsSUFEYSxFQUdOO0FBQUEsTUFEUEMsU0FDTyx1RUFEYSxVQUNiO0FBQ1AsU0FBTyxVQUFTQyxNQUFULEVBQWlDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLFdBQU9BLE1BQU0sQ0FBQ0MsTUFBZCxDQUpzQyxDQU10Qzs7QUFDQSxXQUFPQyxNQUFNLENBQUNDLGdCQUFQLENBQXdCSCxNQUF4QjtBQUNMQyxNQUFBQSxNQUFNLEVBQUU7QUFDTkcsUUFBQUEsR0FBRyxFQUFFO0FBQUEsaUJBQU1DLGlCQUFRQyxXQUFSLENBQW9CUixJQUFwQixFQUEwQkMsU0FBMUIsQ0FBTjtBQUFBO0FBREM7QUFESCxPQUtKUSxNQUFNLE9BQU4sQ0FBVyxhQUFYLENBTEksRUFLd0I7QUFDM0JILE1BQUFBLEdBQUcsRUFBRTtBQUFBLGVBQU0sSUFBTjtBQUFBO0FBRHNCLEtBTHhCLEVBQVA7QUFTRCxHQWhCRDtBQWlCRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAbmFtZXNwYWNlIGRlY29yYXRvcnMgKi9cbi8vIEBmbG93XG5cbmltcG9ydCB7IEdRTEJhc2UgfSBmcm9tICcuLi9HUUxCYXNlJ1xuXG4vKipcbiAqIEEgZGVjb3JhdG9yIHRoYXQgZG9lcyB0aHJlZSB0aGluZ3MuIEZpcnN0IGl0IGRlZmluZXMgdGhlXG4gKiBtb2R1bGUoKSBzdGF0aWMgbWV0aG9kIHRoYXQgaXMgcmVxdWlyZWQgd2hlbiB1c2luZyBhZGphY2VudFxuICogc2NoZW1hIGZpbGVzLiBTZWNvbmRseSwgaXQgZGVmaW5lcyBhIFNDSEVNQSBnZXR0ZXIgdGhhdFxuICogcmV0dXJucyBgR1FMQmFzZS5BREpBQ0VOVF9GSUxFYC4gRmluYWxseSBpdCBzZXRzIGEgc3RhdGljXG4gKiBnZXR0ZXIgd2l0aCB0aGUgYFN5bWJvbGAsIGBAYWRqYWNlbnRTY2hlbWFgIHNvIHRoYXQgb3RoZXJcbiAqIGNhbiBkZXRlcm1pbmUgd2hldGhlciBvciBub3QgdGhlIGRlY29yYXRvciB3YXMgdXNlZC5cbiAqXG4gKiBAZnVuY3Rpb24g8J+Pt+KggEZpbGVTY2hlbWFcbiAqIEBtZW1iZXJvZiEgZGVjb3JhdG9yc1xuICogQHNpbmNlIDIuMy4wXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggYSByZWxhdGl2ZSBvciBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBmaWxlIGNvbnRhaW5pbmdcbiAqIHlvdXIgR3JhcGhRTCBJREwgc2NoZW1hIHBvcnRpb24gZm9yIHlvdXIgb2JqZWN0IHR5cGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gZXh0ZW5zaW9uIHRoZSBleHRlbnNpb24gb2YgdGhlIGdyYXBocWwgc2NoZW1hIGZpbGUgcG9pbnRlZFxuICogdG8gaW4gdGhlIHByZXZpb3VzIHBhcmFtZXRlci4gQnkgZGVmYXVsdCB0aGVzZSBhcmUgYFwiLmdyYXBocWxcImAgYnV0IHNob3VsZFxuICogeW91ciBwYXRoIHBvaW50IHRvIGEgZmlsZSB3aXRoIGEgZGlmZmVyZW50IGV4dGVuc2lvbiwgeW91IHNob3VsZCBzcGVjaWZ5XG4gKiB0aGF0IGV4dGVuc2lvbiBoZXJlLlxuICogQHJldHVybiB7bWl4ZWR9IGFzIHBlciBhbGwgY2xhc3MgZGVjb3JhdG9ycywgYEZpbGVTY2hlbWFgIHJldHVybnMgdGhlXG4gKiBjbGFzcyBvYmplY3QgYmVpbmcgbW9kaWZpZWRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRmlsZVNjaGVtYShcbiAgcGF0aDogc3RyaW5nLFxuICBleHRlbnNpb246IHN0cmluZyA9IFwiLmdyYXBocWxcIlxuKTogbWl4ZWQge1xuICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBPYmplY3QpOiBPYmplY3Qge1xuICAgIC8vIEF0dGVtcHQgdG8gcmVtb3ZlIHRoZSBTQ0hFTUEgcHJvcGVydHkgb3IgZnVuY3Rpb24gZnJvbSB0aGUgY2xhc3NcbiAgICAvLyBiZWluZyBkZWNvcmF0ZWQuIFRoaXMgaXMgbm90IGd1YXJhbnRlZWQgdG8gd29yayBidXQgc2hvdWxkIGluY3JlYXNlXG4gICAgLy8gY29tcGF0aWJpbHR5IGFuZCBzdWNjZXNzIHJhdGVzLlxuICAgIGRlbGV0ZSB0YXJnZXQuU0NIRU1BO1xuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHtcbiAgICAgIFNDSEVNQToge1xuICAgICAgICBnZXQ6ICgpID0+IEdRTEJhc2UuSURMRmlsZVBhdGgocGF0aCwgZXh0ZW5zaW9uKVxuICAgICAgfSxcblxuICAgICAgW1N5bWJvbC5mb3IoJ0BmaWxlU2NoZW1hJyldOiB7XG4gICAgICAgIGdldDogKCkgPT4gdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7IEZpbGVTY2hlbWEgfTtcbiJdfQ==