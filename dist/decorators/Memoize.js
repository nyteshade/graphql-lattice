"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Memoize = Memoize;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var cache = new Map();

function isValidKey() {
  return false;
}

function Memoize(target, prop, descriptor) {
  // This won't make sense if we are a class prop; if so, bug out
  if ((0, _typeof2.default)(descriptor.initializer)) return descriptor; // If we have only a setter, we can skip out

  if (descriptor.set && !descriptor.get && !descriptor.value) return descriptor; // If we do not have a get function and value is not a function, jet

  if (typeof descriptor.value !== 'function' && !descriptor.get) {
    return descriptor;
  } // Our passed arguments and function make our key


  var key = {
    target: target,
    prop: prop,
    descriptor: descriptor,
    func: descriptor.get || descriptor.value,
    args: [],
    validate: isValidKey // In order to determine if we have a match on key we must allow execution
    // of a wrapper function that does so

  };

  var wrapper = function wrapper() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    key.args = args; // TODO check for cache hit by comparing objects
    // return the cache if a hit or run the function and store otherwise

    if (key.validate()) {
      return cache.get(key);
    } else {
      var results;

      try {
        var _results = key.func.apply(target, key.args);

        cache.set(key, _results);
      } catch (error) {
        results = error;
      }
    }
  };

  if (descriptor.get) {
    descriptor.get = wrapper;
  } else {
    descriptor.value = wrapper;
  }

  return descriptor;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL01lbW9pemUuanMiXSwibmFtZXMiOlsiY2FjaGUiLCJNYXAiLCJpc1ZhbGlkS2V5IiwiTWVtb2l6ZSIsInRhcmdldCIsInByb3AiLCJkZXNjcmlwdG9yIiwiaW5pdGlhbGl6ZXIiLCJzZXQiLCJnZXQiLCJ2YWx1ZSIsImtleSIsImZ1bmMiLCJhcmdzIiwidmFsaWRhdGUiLCJ3cmFwcGVyIiwicmVzdWx0cyIsImFwcGx5IiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHLElBQUlDLEdBQUosRUFBZDs7QUFFQSxTQUFTQyxVQUFULEdBQStCO0FBQzdCLFNBQU8sS0FBUDtBQUNEOztBQUVNLFNBQVNDLE9BQVQsQ0FDTEMsTUFESyxFQUVMQyxJQUZLLEVBR0xDLFVBSEssRUFJSTtBQUNUO0FBQ0EsNEJBQVdBLFVBQVUsQ0FBQ0MsV0FBdEIsR0FBbUMsT0FBT0QsVUFBUCxDQUYxQixDQUlUOztBQUNBLE1BQUlBLFVBQVUsQ0FBQ0UsR0FBWCxJQUFrQixDQUFDRixVQUFVLENBQUNHLEdBQTlCLElBQXFDLENBQUNILFVBQVUsQ0FBQ0ksS0FBckQsRUFBNEQsT0FBT0osVUFBUCxDQUxuRCxDQU9UOztBQUNBLE1BQ0UsT0FBT0EsVUFBVSxDQUFDSSxLQUFsQixLQUE0QixVQUE1QixJQUNHLENBQUNKLFVBQVUsQ0FBQ0csR0FGakIsRUFHRTtBQUNBLFdBQU9ILFVBQVA7QUFDRCxHQWJRLENBZVQ7OztBQUNBLE1BQU1LLEdBQUcsR0FBRztBQUNWUCxJQUFBQSxNQUFNLEVBQU5BLE1BRFU7QUFFVkMsSUFBQUEsSUFBSSxFQUFKQSxJQUZVO0FBR1ZDLElBQUFBLFVBQVUsRUFBVkEsVUFIVTtBQUtWTSxJQUFBQSxJQUFJLEVBQUVOLFVBQVUsQ0FBQ0csR0FBWCxJQUFrQkgsVUFBVSxDQUFDSSxLQUx6QjtBQU1WRyxJQUFBQSxJQUFJLEVBQUUsRUFOSTtBQU9WQyxJQUFBQSxRQUFRLEVBQUVaLFVBUEEsQ0FVWjtBQUNBOztBQVhZLEdBQVo7O0FBWUEsTUFBTWEsT0FBTyxHQUFHLFNBQVZBLE9BQVUsR0FBYTtBQUFBLHNDQUFURixJQUFTO0FBQVRBLE1BQUFBLElBQVM7QUFBQTs7QUFDM0JGLElBQUFBLEdBQUcsQ0FBQ0UsSUFBSixHQUFXQSxJQUFYLENBRDJCLENBRzNCO0FBQ0E7O0FBQ0EsUUFBSUYsR0FBRyxDQUFDRyxRQUFKLEVBQUosRUFBb0I7QUFDbEIsYUFBT2QsS0FBSyxDQUFDUyxHQUFOLENBQVVFLEdBQVYsQ0FBUDtBQUNELEtBRkQsTUFHSztBQUNILFVBQUlLLE9BQUo7O0FBRUEsVUFBSTtBQUNGLFlBQUlBLFFBQU8sR0FBR0wsR0FBRyxDQUFDQyxJQUFKLENBQVNLLEtBQVQsQ0FBZWIsTUFBZixFQUF1Qk8sR0FBRyxDQUFDRSxJQUEzQixDQUFkOztBQUNBYixRQUFBQSxLQUFLLENBQUNRLEdBQU4sQ0FBVUcsR0FBVixFQUFlSyxRQUFmO0FBQ0QsT0FIRCxDQUlBLE9BQU9FLEtBQVAsRUFBYztBQUNaRixRQUFBQSxPQUFPLEdBQUdFLEtBQVY7QUFDRDtBQUNGO0FBQ0YsR0FuQkQ7O0FBcUJBLE1BQUlaLFVBQVUsQ0FBQ0csR0FBZixFQUFvQjtBQUNsQkgsSUFBQUEsVUFBVSxDQUFDRyxHQUFYLEdBQWlCTSxPQUFqQjtBQUNELEdBRkQsTUFHSztBQUNIVCxJQUFBQSxVQUFVLENBQUNJLEtBQVgsR0FBbUJLLE9BQW5CO0FBQ0Q7O0FBRUQsU0FBT1QsVUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuY29uc3QgY2FjaGUgPSBuZXcgTWFwKClcblxuZnVuY3Rpb24gaXNWYWxpZEtleSgpOiBib29sZWFuIHtcbiAgcmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBNZW1vaXplKFxuICB0YXJnZXQ6IG1peGVkLFxuICBwcm9wOiBzdHJpbmcsXG4gIGRlc2NyaXB0b3I6IE9iamVjdFxuKTogP09iamVjdCB7XG4gIC8vIFRoaXMgd29uJ3QgbWFrZSBzZW5zZSBpZiB3ZSBhcmUgYSBjbGFzcyBwcm9wOyBpZiBzbywgYnVnIG91dFxuICBpZiAodHlwZW9mIGRlc2NyaXB0b3IuaW5pdGlhbGl6ZXIpIHJldHVybiBkZXNjcmlwdG9yXG5cbiAgLy8gSWYgd2UgaGF2ZSBvbmx5IGEgc2V0dGVyLCB3ZSBjYW4gc2tpcCBvdXRcbiAgaWYgKGRlc2NyaXB0b3Iuc2V0ICYmICFkZXNjcmlwdG9yLmdldCAmJiAhZGVzY3JpcHRvci52YWx1ZSkgcmV0dXJuIGRlc2NyaXB0b3JcblxuICAvLyBJZiB3ZSBkbyBub3QgaGF2ZSBhIGdldCBmdW5jdGlvbiBhbmQgdmFsdWUgaXMgbm90IGEgZnVuY3Rpb24sIGpldFxuICBpZiAoXG4gICAgdHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgIT09ICdmdW5jdGlvbidcbiAgICAmJiAhZGVzY3JpcHRvci5nZXRcbiAgKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3JcbiAgfVxuXG4gIC8vIE91ciBwYXNzZWQgYXJndW1lbnRzIGFuZCBmdW5jdGlvbiBtYWtlIG91ciBrZXlcbiAgY29uc3Qga2V5ID0ge1xuICAgIHRhcmdldCxcbiAgICBwcm9wLFxuICAgIGRlc2NyaXB0b3IsXG5cbiAgICBmdW5jOiBkZXNjcmlwdG9yLmdldCB8fCBkZXNjcmlwdG9yLnZhbHVlLFxuICAgIGFyZ3M6IFtdLFxuICAgIHZhbGlkYXRlOiBpc1ZhbGlkS2V5XG4gIH1cblxuICAvLyBJbiBvcmRlciB0byBkZXRlcm1pbmUgaWYgd2UgaGF2ZSBhIG1hdGNoIG9uIGtleSB3ZSBtdXN0IGFsbG93IGV4ZWN1dGlvblxuICAvLyBvZiBhIHdyYXBwZXIgZnVuY3Rpb24gdGhhdCBkb2VzIHNvXG4gIGNvbnN0IHdyYXBwZXIgPSAoLi4uYXJncykgPT4ge1xuICAgIGtleS5hcmdzID0gYXJncztcblxuICAgIC8vIFRPRE8gY2hlY2sgZm9yIGNhY2hlIGhpdCBieSBjb21wYXJpbmcgb2JqZWN0c1xuICAgIC8vIHJldHVybiB0aGUgY2FjaGUgaWYgYSBoaXQgb3IgcnVuIHRoZSBmdW5jdGlvbiBhbmQgc3RvcmUgb3RoZXJ3aXNlXG4gICAgaWYgKGtleS52YWxpZGF0ZSgpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgcmVzdWx0c1xuXG4gICAgICB0cnkge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IGtleS5mdW5jLmFwcGx5KHRhcmdldCwga2V5LmFyZ3MpXG4gICAgICAgIGNhY2hlLnNldChrZXksIHJlc3VsdHMpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVzdWx0cyA9IGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChkZXNjcmlwdG9yLmdldCkge1xuICAgIGRlc2NyaXB0b3IuZ2V0ID0gd3JhcHBlclxuICB9XG4gIGVsc2Uge1xuICAgIGRlc2NyaXB0b3IudmFsdWUgPSB3cmFwcGVyXG4gIH1cblxuICByZXR1cm4gZGVzY3JpcHRvclxufVxuIl19