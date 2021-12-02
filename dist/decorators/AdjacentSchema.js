"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdjacentSchema = exports["default"] = AdjacentSchema;

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

    return Object.defineProperties(target, (0, _defineProperty2["default"])({
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
    }, Symbol["for"]('@adjacentSchema'), {
      get: function get() {
        return true;
      }
    }));
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL0FkamFjZW50U2NoZW1hLmpzIl0sIm5hbWVzIjpbIkFkamFjZW50U2NoZW1hIiwiY2xhc3NNb2R1bGUiLCJ0YXJnZXQiLCJTQ0hFTUEiLCJtb2R1bGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZ2V0IiwiR1FMQmFzZSIsIkFESkFDRU5UX0ZJTEUiLCJTeW1ib2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0E7O0FBSEE7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsU0FBU0EsY0FBVCxDQUF3QkMsV0FBeEIsRUFBNkM7QUFDMUQsU0FBTyxVQUFTQyxNQUFULEVBQTBCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBT0EsTUFBTSxDQUFDQyxNQUFkLENBTCtCLENBTS9COztBQUNBLFdBQU9ELE1BQU0sQ0FBQ0UsTUFBZCxDQVArQixDQVMvQjs7QUFDQSxXQUFPQyxNQUFNLENBQUNDLGdCQUFQLENBQXdCSixNQUF4QjtBQUNMRSxNQUFBQSxNQUFNLEVBQUU7QUFDTkcsUUFBQUEsR0FBRyxFQUFFO0FBQUEsaUJBQU1OLFdBQU47QUFBQTtBQURDLE9BREg7QUFLTEUsTUFBQUEsTUFBTSxFQUFFO0FBQ05JLFFBQUFBLEdBQUcsRUFBRTtBQUFBLGlCQUFNQyxpQkFBUUMsYUFBZDtBQUFBO0FBREM7QUFMSCxPQVNKQyxNQUFNLE9BQU4sQ0FBVyxpQkFBWCxDQVRJLEVBUzRCO0FBQy9CSCxNQUFBQSxHQUFHLEVBQUU7QUFBQSxlQUFNLElBQU47QUFBQTtBQUQwQixLQVQ1QixFQUFQO0FBYUQsR0F2QkQ7QUF3QkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQG5hbWVzcGFjZSBkZWNvcmF0b3JzICovXG4vLyBAZmxvd1xuXG5pbXBvcnQgeyBHUUxCYXNlIH0gZnJvbSAnLi4vR1FMQmFzZSdcblxuLyoqXG4gKiBBIGRlY29yYXRvciB0aGF0IGRvZXMgdGhyZWUgdGhpbmdzLiBGaXJzdCBpdCBkZWZpbmVzIHRoZVxuICogbW9kdWxlKCkgc3RhdGljIG1ldGhvZCB0aGF0IGlzIHJlcXVpcmVkIHdoZW4gdXNpbmcgYWRqYWNlbnRcbiAqIHNjaGVtYSBmaWxlcy4gU2Vjb25kbHksIGl0IGRlZmluZXMgYSBTQ0hFTUEgZ2V0dGVyIHRoYXRcbiAqIHJldHVybnMgYEdRTEJhc2UuQURKQUNFTlRfRklMRWAuIEZpbmFsbHkgaXQgc2V0cyBhIHN0YXRpY1xuICogZ2V0dGVyIHdpdGggdGhlIGBTeW1ib2xgLCBgQGFkamFjZW50U2NoZW1hYCBzbyB0aGF0IG90aGVyXG4gKiBjYW4gZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRoZSBkZWNvcmF0b3Igd2FzIHVzZWQuXG4gKlxuICogQGZ1bmN0aW9uIPCfj7fioIBBZGphY2VudFNjaGVtYVxuICogQG1lbWJlcm9mISBkZWNvcmF0b3JzXG4gKiBAc2luY2UgMi4xLjBcbiAqXG4gKiBAcGFyYW0ge21peGVkfSBvYmplY3QgdGhlIG9iamVjdCBvbiB3aGljaCB0byBhcHBseSB0aGUgZGVjb3JhdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgdGhlIG5hbWUgb2YgdGhlIG9iamVjdCBvciBwcm9wZXJ0eSB0b1xuICogd2hpY2ggdGhlIGRlY29yYXRvciBpcyBiZWluZyBhcHBsaWVkLlxuICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgYSBzdGFuZGFyZCBPYmplY3QuZGVmaW5lUHJvcGVydHkgc3R5bGVcbiAqIGRlc2NyaXB0b3Igb2JqZWN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBZGphY2VudFNjaGVtYShjbGFzc01vZHVsZTogT2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IEdRTEJhc2UpIHtcbiAgICAvLyBBdHRlbXB0IHRvIHJlbW92ZSB0aGUgU0NIRU1BIGFuZCBtb2R1bGUgcHJvcGVydGllcyBvciBmdW5jdGlvbnMgZnJvbVxuICAgIC8vIHRoZSBjbGFzcyBiZWluZyBkZWNvcmF0ZWQuIFRoaXMgaXMgbm90IGd1YXJhbnRlZWQgdG8gd29yayBidXQgc2hvdWxkXG4gICAgLy8gaW5jcmVhc2UgY29tcGF0aWJpbHR5IGFuZCBzdWNjZXNzIHJhdGVzLlxuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICBkZWxldGUgdGFyZ2V0LlNDSEVNQTtcbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgZGVsZXRlIHRhcmdldC5tb2R1bGU7XG5cbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwge1xuICAgICAgbW9kdWxlOiB7XG4gICAgICAgIGdldDogKCkgPT4gY2xhc3NNb2R1bGVcbiAgICAgIH0sXG5cbiAgICAgIFNDSEVNQToge1xuICAgICAgICBnZXQ6ICgpID0+IEdRTEJhc2UuQURKQUNFTlRfRklMRVxuICAgICAgfSxcblxuICAgICAgW1N5bWJvbC5mb3IoJ0BhZGphY2VudFNjaGVtYScpXToge1xuICAgICAgICBnZXQ6ICgpID0+IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgeyBBZGphY2VudFNjaGVtYSB9O1xuIl19