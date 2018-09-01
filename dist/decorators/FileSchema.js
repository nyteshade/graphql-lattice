"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileSchema = exports.default = FileSchema;

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
function FileSchema(path, extension = ".graphql") {
  return function (target) {
    // Attempt to remove the SCHEMA property or function from the class
    // being decorated. This is not guaranteed to work but should increase
    // compatibilty and success rates.
    delete target.SCHEMA; // @ComputedType

    return Object.defineProperties(target, {
      SCHEMA: {
        get: () => _GQLBase.GQLBase.IDLFilePath(path, extension)
      },
      [Symbol.for('@fileSchema')]: {
        get: () => true
      }
    });
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL0ZpbGVTY2hlbWEuanMiXSwibmFtZXMiOlsiRmlsZVNjaGVtYSIsInBhdGgiLCJleHRlbnNpb24iLCJ0YXJnZXQiLCJTQ0hFTUEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZ2V0IiwiR1FMQmFzZSIsIklETEZpbGVQYXRoIiwiU3ltYm9sIiwiZm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFHQTs7QUFIQTs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJlLFNBQVNBLFVBQVQsQ0FDYkMsSUFEYSxFQUViQyxTQUFpQixHQUFHLFVBRlAsRUFHTjtBQUNQLFNBQU8sVUFBU0MsTUFBVCxFQUFpQztBQUN0QztBQUNBO0FBQ0E7QUFDQSxXQUFPQSxNQUFNLENBQUNDLE1BQWQsQ0FKc0MsQ0FNdEM7O0FBQ0EsV0FBT0MsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QkgsTUFBeEIsRUFBZ0M7QUFDckNDLE1BQUFBLE1BQU0sRUFBRTtBQUNORyxRQUFBQSxHQUFHLEVBQUUsTUFBTUMsaUJBQVFDLFdBQVIsQ0FBb0JSLElBQXBCLEVBQTBCQyxTQUExQjtBQURMLE9BRDZCO0FBS3JDLE9BQUNRLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLGFBQVgsQ0FBRCxHQUE2QjtBQUMzQkosUUFBQUEsR0FBRyxFQUFFLE1BQU07QUFEZ0I7QUFMUSxLQUFoQyxDQUFQO0FBU0QsR0FoQkQ7QUFpQkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQG5hbWVzcGFjZSBkZWNvcmF0b3JzICovXG4vLyBAZmxvd1xuXG5pbXBvcnQgeyBHUUxCYXNlIH0gZnJvbSAnLi4vR1FMQmFzZSdcblxuLyoqXG4gKiBBIGRlY29yYXRvciB0aGF0IGRvZXMgdGhyZWUgdGhpbmdzLiBGaXJzdCBpdCBkZWZpbmVzIHRoZVxuICogbW9kdWxlKCkgc3RhdGljIG1ldGhvZCB0aGF0IGlzIHJlcXVpcmVkIHdoZW4gdXNpbmcgYWRqYWNlbnRcbiAqIHNjaGVtYSBmaWxlcy4gU2Vjb25kbHksIGl0IGRlZmluZXMgYSBTQ0hFTUEgZ2V0dGVyIHRoYXRcbiAqIHJldHVybnMgYEdRTEJhc2UuQURKQUNFTlRfRklMRWAuIEZpbmFsbHkgaXQgc2V0cyBhIHN0YXRpY1xuICogZ2V0dGVyIHdpdGggdGhlIGBTeW1ib2xgLCBgQGFkamFjZW50U2NoZW1hYCBzbyB0aGF0IG90aGVyXG4gKiBjYW4gZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRoZSBkZWNvcmF0b3Igd2FzIHVzZWQuXG4gKlxuICogQGZ1bmN0aW9uIPCfj7fioIBGaWxlU2NoZW1hXG4gKiBAbWVtYmVyb2YhIGRlY29yYXRvcnNcbiAqIEBzaW5jZSAyLjMuMFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIGEgcmVsYXRpdmUgb3IgYWJzb2x1dGUgcGF0aCB0byB0aGUgZmlsZSBjb250YWluaW5nXG4gKiB5b3VyIEdyYXBoUUwgSURMIHNjaGVtYSBwb3J0aW9uIGZvciB5b3VyIG9iamVjdCB0eXBlLlxuICogQHBhcmFtIHtTdHJpbmd9IGV4dGVuc2lvbiB0aGUgZXh0ZW5zaW9uIG9mIHRoZSBncmFwaHFsIHNjaGVtYSBmaWxlIHBvaW50ZWRcbiAqIHRvIGluIHRoZSBwcmV2aW91cyBwYXJhbWV0ZXIuIEJ5IGRlZmF1bHQgdGhlc2UgYXJlIGBcIi5ncmFwaHFsXCJgIGJ1dCBzaG91bGRcbiAqIHlvdXIgcGF0aCBwb2ludCB0byBhIGZpbGUgd2l0aCBhIGRpZmZlcmVudCBleHRlbnNpb24sIHlvdSBzaG91bGQgc3BlY2lmeVxuICogdGhhdCBleHRlbnNpb24gaGVyZS5cbiAqIEByZXR1cm4ge21peGVkfSBhcyBwZXIgYWxsIGNsYXNzIGRlY29yYXRvcnMsIGBGaWxlU2NoZW1hYCByZXR1cm5zIHRoZVxuICogY2xhc3Mgb2JqZWN0IGJlaW5nIG1vZGlmaWVkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZpbGVTY2hlbWEoXG4gIHBhdGg6IHN0cmluZyxcbiAgZXh0ZW5zaW9uOiBzdHJpbmcgPSBcIi5ncmFwaHFsXCJcbik6IG1peGVkIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogT2JqZWN0KTogT2JqZWN0IHtcbiAgICAvLyBBdHRlbXB0IHRvIHJlbW92ZSB0aGUgU0NIRU1BIHByb3BlcnR5IG9yIGZ1bmN0aW9uIGZyb20gdGhlIGNsYXNzXG4gICAgLy8gYmVpbmcgZGVjb3JhdGVkLiBUaGlzIGlzIG5vdCBndWFyYW50ZWVkIHRvIHdvcmsgYnV0IHNob3VsZCBpbmNyZWFzZVxuICAgIC8vIGNvbXBhdGliaWx0eSBhbmQgc3VjY2VzcyByYXRlcy5cbiAgICBkZWxldGUgdGFyZ2V0LlNDSEVNQTtcblxuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCB7XG4gICAgICBTQ0hFTUE6IHtcbiAgICAgICAgZ2V0OiAoKSA9PiBHUUxCYXNlLklETEZpbGVQYXRoKHBhdGgsIGV4dGVuc2lvbilcbiAgICAgIH0sXG5cbiAgICAgIFtTeW1ib2wuZm9yKCdAZmlsZVNjaGVtYScpXToge1xuICAgICAgICBnZXQ6ICgpID0+IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgeyBGaWxlU2NoZW1hIH07XG4iXX0=