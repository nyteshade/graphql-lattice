"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdjacentSchema = exports.default = AdjacentSchema;

require("core-js/modules/es7.symbol.async-iterator");

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

    return Object.defineProperties(target, {
      module: {
        get: () => classModule
      },
      SCHEMA: {
        get: () => _GQLBase.GQLBase.ADJACENT_FILE
      },
      [Symbol.for('@adjacentSchema')]: {
        get: () => true
      }
    });
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL0FkamFjZW50U2NoZW1hLmpzIl0sIm5hbWVzIjpbIkFkamFjZW50U2NoZW1hIiwiY2xhc3NNb2R1bGUiLCJ0YXJnZXQiLCJTQ0hFTUEiLCJtb2R1bGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZ2V0IiwiR1FMQmFzZSIsIkFESkFDRU5UX0ZJTEUiLCJTeW1ib2wiLCJmb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUdBOztBQUhBOztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQmUsU0FBU0EsY0FBVCxDQUF3QkMsV0FBeEIsRUFBNkM7QUFDMUQsU0FBTyxVQUFTQyxNQUFULEVBQTBCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBT0EsTUFBTSxDQUFDQyxNQUFkLENBTCtCLENBTS9COztBQUNBLFdBQU9ELE1BQU0sQ0FBQ0UsTUFBZCxDQVArQixDQVMvQjs7QUFDQSxXQUFPQyxNQUFNLENBQUNDLGdCQUFQLENBQXdCSixNQUF4QixFQUFnQztBQUNyQ0UsTUFBQUEsTUFBTSxFQUFFO0FBQ05HLFFBQUFBLEdBQUcsRUFBRSxNQUFNTjtBQURMLE9BRDZCO0FBS3JDRSxNQUFBQSxNQUFNLEVBQUU7QUFDTkksUUFBQUEsR0FBRyxFQUFFLE1BQU1DLGlCQUFRQztBQURiLE9BTDZCO0FBU3JDLE9BQUNDLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLGlCQUFYLENBQUQsR0FBaUM7QUFDL0JKLFFBQUFBLEdBQUcsRUFBRSxNQUFNO0FBRG9CO0FBVEksS0FBaEMsQ0FBUDtBQWFELEdBdkJEO0FBd0JEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBuYW1lc3BhY2UgZGVjb3JhdG9ycyAqL1xuLy8gQGZsb3dcblxuaW1wb3J0IHsgR1FMQmFzZSB9IGZyb20gJy4uL0dRTEJhc2UnXG5cbi8qKlxuICogQSBkZWNvcmF0b3IgdGhhdCBkb2VzIHRocmVlIHRoaW5ncy4gRmlyc3QgaXQgZGVmaW5lcyB0aGVcbiAqIG1vZHVsZSgpIHN0YXRpYyBtZXRob2QgdGhhdCBpcyByZXF1aXJlZCB3aGVuIHVzaW5nIGFkamFjZW50XG4gKiBzY2hlbWEgZmlsZXMuIFNlY29uZGx5LCBpdCBkZWZpbmVzIGEgU0NIRU1BIGdldHRlciB0aGF0XG4gKiByZXR1cm5zIGBHUUxCYXNlLkFESkFDRU5UX0ZJTEVgLiBGaW5hbGx5IGl0IHNldHMgYSBzdGF0aWNcbiAqIGdldHRlciB3aXRoIHRoZSBgU3ltYm9sYCwgYEBhZGphY2VudFNjaGVtYWAgc28gdGhhdCBvdGhlclxuICogY2FuIGRldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0aGUgZGVjb3JhdG9yIHdhcyB1c2VkLlxuICpcbiAqIEBmdW5jdGlvbiDwn4+34qCAQWRqYWNlbnRTY2hlbWFcbiAqIEBtZW1iZXJvZiEgZGVjb3JhdG9yc1xuICogQHNpbmNlIDIuMS4wXG4gKlxuICogQHBhcmFtIHttaXhlZH0gb2JqZWN0IHRoZSBvYmplY3Qgb24gd2hpY2ggdG8gYXBwbHkgdGhlIGRlY29yYXRvclxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5IHRoZSBuYW1lIG9mIHRoZSBvYmplY3Qgb3IgcHJvcGVydHkgdG9cbiAqIHdoaWNoIHRoZSBkZWNvcmF0b3IgaXMgYmVpbmcgYXBwbGllZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yIGEgc3RhbmRhcmQgT2JqZWN0LmRlZmluZVByb3BlcnR5IHN0eWxlXG4gKiBkZXNjcmlwdG9yIG9iamVjdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWRqYWNlbnRTY2hlbWEoY2xhc3NNb2R1bGU6IE9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBHUUxCYXNlKSB7XG4gICAgLy8gQXR0ZW1wdCB0byByZW1vdmUgdGhlIFNDSEVNQSBhbmQgbW9kdWxlIHByb3BlcnRpZXMgb3IgZnVuY3Rpb25zIGZyb21cbiAgICAvLyB0aGUgY2xhc3MgYmVpbmcgZGVjb3JhdGVkLiBUaGlzIGlzIG5vdCBndWFyYW50ZWVkIHRvIHdvcmsgYnV0IHNob3VsZFxuICAgIC8vIGluY3JlYXNlIGNvbXBhdGliaWx0eSBhbmQgc3VjY2VzcyByYXRlcy5cbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgZGVsZXRlIHRhcmdldC5TQ0hFTUE7XG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIGRlbGV0ZSB0YXJnZXQubW9kdWxlO1xuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHtcbiAgICAgIG1vZHVsZToge1xuICAgICAgICBnZXQ6ICgpID0+IGNsYXNzTW9kdWxlXG4gICAgICB9LFxuXG4gICAgICBTQ0hFTUE6IHtcbiAgICAgICAgZ2V0OiAoKSA9PiBHUUxCYXNlLkFESkFDRU5UX0ZJTEVcbiAgICAgIH0sXG5cbiAgICAgIFtTeW1ib2wuZm9yKCdAYWRqYWNlbnRTY2hlbWEnKV06IHtcbiAgICAgICAgZ2V0OiAoKSA9PiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgQWRqYWNlbnRTY2hlbWEgfTtcbiJdfQ==