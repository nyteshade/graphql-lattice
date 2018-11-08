"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileSchema = exports.default = FileSchema;

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

    return Object.defineProperties(target, (0, _defineProperty2.default)({
      SCHEMA: {
        get: function get() {
          return _GQLBase.GQLBase.IDLFilePath(path, extension);
        }
      }
    }, Symbol.for('@fileSchema'), {
      get: function get() {
        return true;
      }
    }));
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL0ZpbGVTY2hlbWEuanMiXSwibmFtZXMiOlsiRmlsZVNjaGVtYSIsInBhdGgiLCJleHRlbnNpb24iLCJ0YXJnZXQiLCJTQ0hFTUEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZ2V0IiwiR1FMQmFzZSIsIklETEZpbGVQYXRoIiwiU3ltYm9sIiwiZm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBOztBQUhBOztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQmUsU0FBU0EsVUFBVCxDQUNiQyxJQURhLEVBR047QUFBQSxNQURQQyxTQUNPLHVFQURhLFVBQ2I7QUFDUCxTQUFPLFVBQVNDLE1BQVQsRUFBaUM7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsV0FBT0EsTUFBTSxDQUFDQyxNQUFkLENBSnNDLENBTXRDOztBQUNBLFdBQU9DLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0JILE1BQXhCO0FBQ0xDLE1BQUFBLE1BQU0sRUFBRTtBQUNORyxRQUFBQSxHQUFHLEVBQUU7QUFBQSxpQkFBTUMsaUJBQVFDLFdBQVIsQ0FBb0JSLElBQXBCLEVBQTBCQyxTQUExQixDQUFOO0FBQUE7QUFEQztBQURILE9BS0pRLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLGFBQVgsQ0FMSSxFQUt3QjtBQUMzQkosTUFBQUEsR0FBRyxFQUFFO0FBQUEsZUFBTSxJQUFOO0FBQUE7QUFEc0IsS0FMeEIsRUFBUDtBQVNELEdBaEJEO0FBaUJEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBuYW1lc3BhY2UgZGVjb3JhdG9ycyAqL1xuLy8gQGZsb3dcblxuaW1wb3J0IHsgR1FMQmFzZSB9IGZyb20gJy4uL0dRTEJhc2UnXG5cbi8qKlxuICogQSBkZWNvcmF0b3IgdGhhdCBkb2VzIHRocmVlIHRoaW5ncy4gRmlyc3QgaXQgZGVmaW5lcyB0aGVcbiAqIG1vZHVsZSgpIHN0YXRpYyBtZXRob2QgdGhhdCBpcyByZXF1aXJlZCB3aGVuIHVzaW5nIGFkamFjZW50XG4gKiBzY2hlbWEgZmlsZXMuIFNlY29uZGx5LCBpdCBkZWZpbmVzIGEgU0NIRU1BIGdldHRlciB0aGF0XG4gKiByZXR1cm5zIGBHUUxCYXNlLkFESkFDRU5UX0ZJTEVgLiBGaW5hbGx5IGl0IHNldHMgYSBzdGF0aWNcbiAqIGdldHRlciB3aXRoIHRoZSBgU3ltYm9sYCwgYEBhZGphY2VudFNjaGVtYWAgc28gdGhhdCBvdGhlclxuICogY2FuIGRldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0aGUgZGVjb3JhdG9yIHdhcyB1c2VkLlxuICpcbiAqIEBmdW5jdGlvbiDwn4+34qCARmlsZVNjaGVtYVxuICogQG1lbWJlcm9mISBkZWNvcmF0b3JzXG4gKiBAc2luY2UgMi4zLjBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBhIHJlbGF0aXZlIG9yIGFic29sdXRlIHBhdGggdG8gdGhlIGZpbGUgY29udGFpbmluZ1xuICogeW91ciBHcmFwaFFMIElETCBzY2hlbWEgcG9ydGlvbiBmb3IgeW91ciBvYmplY3QgdHlwZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBleHRlbnNpb24gdGhlIGV4dGVuc2lvbiBvZiB0aGUgZ3JhcGhxbCBzY2hlbWEgZmlsZSBwb2ludGVkXG4gKiB0byBpbiB0aGUgcHJldmlvdXMgcGFyYW1ldGVyLiBCeSBkZWZhdWx0IHRoZXNlIGFyZSBgXCIuZ3JhcGhxbFwiYCBidXQgc2hvdWxkXG4gKiB5b3VyIHBhdGggcG9pbnQgdG8gYSBmaWxlIHdpdGggYSBkaWZmZXJlbnQgZXh0ZW5zaW9uLCB5b3Ugc2hvdWxkIHNwZWNpZnlcbiAqIHRoYXQgZXh0ZW5zaW9uIGhlcmUuXG4gKiBAcmV0dXJuIHttaXhlZH0gYXMgcGVyIGFsbCBjbGFzcyBkZWNvcmF0b3JzLCBgRmlsZVNjaGVtYWAgcmV0dXJucyB0aGVcbiAqIGNsYXNzIG9iamVjdCBiZWluZyBtb2RpZmllZFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGaWxlU2NoZW1hKFxuICBwYXRoOiBzdHJpbmcsXG4gIGV4dGVuc2lvbjogc3RyaW5nID0gXCIuZ3JhcGhxbFwiXG4pOiBtaXhlZCB7XG4gIHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IE9iamVjdCk6IE9iamVjdCB7XG4gICAgLy8gQXR0ZW1wdCB0byByZW1vdmUgdGhlIFNDSEVNQSBwcm9wZXJ0eSBvciBmdW5jdGlvbiBmcm9tIHRoZSBjbGFzc1xuICAgIC8vIGJlaW5nIGRlY29yYXRlZC4gVGhpcyBpcyBub3QgZ3VhcmFudGVlZCB0byB3b3JrIGJ1dCBzaG91bGQgaW5jcmVhc2VcbiAgICAvLyBjb21wYXRpYmlsdHkgYW5kIHN1Y2Nlc3MgcmF0ZXMuXG4gICAgZGVsZXRlIHRhcmdldC5TQ0hFTUE7XG5cbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwge1xuICAgICAgU0NIRU1BOiB7XG4gICAgICAgIGdldDogKCkgPT4gR1FMQmFzZS5JRExGaWxlUGF0aChwYXRoLCBleHRlbnNpb24pXG4gICAgICB9LFxuXG4gICAgICBbU3ltYm9sLmZvcignQGZpbGVTY2hlbWEnKV06IHtcbiAgICAgICAgZ2V0OiAoKSA9PiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgRmlsZVNjaGVtYSB9O1xuIl19