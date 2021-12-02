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
  if ((0, _typeof2["default"])(descriptor.initializer)) return descriptor; // If we have only a setter, we can skip out

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
    validate: isValidKey
  }; // In order to determine if we have a match on key we must allow execution
  // of a wrapper function that does so

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL01lbW9pemUuanMiXSwibmFtZXMiOlsiY2FjaGUiLCJNYXAiLCJpc1ZhbGlkS2V5IiwiTWVtb2l6ZSIsInRhcmdldCIsInByb3AiLCJkZXNjcmlwdG9yIiwiaW5pdGlhbGl6ZXIiLCJzZXQiLCJnZXQiLCJ2YWx1ZSIsImtleSIsImZ1bmMiLCJhcmdzIiwidmFsaWRhdGUiLCJ3cmFwcGVyIiwicmVzdWx0cyIsImFwcGx5IiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHLElBQUlDLEdBQUosRUFBZDs7QUFFQSxTQUFTQyxVQUFULEdBQStCO0FBQzdCLFNBQU8sS0FBUDtBQUNEOztBQUVNLFNBQVNDLE9BQVQsQ0FDTEMsTUFESyxFQUVMQyxJQUZLLEVBR0xDLFVBSEssRUFJSTtBQUNUO0FBQ0EsK0JBQVdBLFVBQVUsQ0FBQ0MsV0FBdEIsR0FBbUMsT0FBT0QsVUFBUCxDQUYxQixDQUlUOztBQUNBLE1BQUlBLFVBQVUsQ0FBQ0UsR0FBWCxJQUFrQixDQUFDRixVQUFVLENBQUNHLEdBQTlCLElBQXFDLENBQUNILFVBQVUsQ0FBQ0ksS0FBckQsRUFBNEQsT0FBT0osVUFBUCxDQUxuRCxDQU9UOztBQUNBLE1BQ0UsT0FBT0EsVUFBVSxDQUFDSSxLQUFsQixLQUE0QixVQUE1QixJQUNHLENBQUNKLFVBQVUsQ0FBQ0csR0FGakIsRUFHRTtBQUNBLFdBQU9ILFVBQVA7QUFDRCxHQWJRLENBZVQ7OztBQUNBLE1BQU1LLEdBQUcsR0FBRztBQUNWUCxJQUFBQSxNQUFNLEVBQU5BLE1BRFU7QUFFVkMsSUFBQUEsSUFBSSxFQUFKQSxJQUZVO0FBR1ZDLElBQUFBLFVBQVUsRUFBVkEsVUFIVTtBQUtWTSxJQUFBQSxJQUFJLEVBQUVOLFVBQVUsQ0FBQ0csR0FBWCxJQUFrQkgsVUFBVSxDQUFDSSxLQUx6QjtBQU1WRyxJQUFBQSxJQUFJLEVBQUUsRUFOSTtBQU9WQyxJQUFBQSxRQUFRLEVBQUVaO0FBUEEsR0FBWixDQWhCUyxDQTBCVDtBQUNBOztBQUNBLE1BQU1hLE9BQU8sR0FBRyxTQUFWQSxPQUFVLEdBQWE7QUFBQSxzQ0FBVEYsSUFBUztBQUFUQSxNQUFBQSxJQUFTO0FBQUE7O0FBQzNCRixJQUFBQSxHQUFHLENBQUNFLElBQUosR0FBV0EsSUFBWCxDQUQyQixDQUczQjtBQUNBOztBQUNBLFFBQUlGLEdBQUcsQ0FBQ0csUUFBSixFQUFKLEVBQW9CO0FBQ2xCLGFBQU9kLEtBQUssQ0FBQ1MsR0FBTixDQUFVRSxHQUFWLENBQVA7QUFDRCxLQUZELE1BR0s7QUFDSCxVQUFJSyxPQUFKOztBQUVBLFVBQUk7QUFDRixZQUFJQSxRQUFPLEdBQUdMLEdBQUcsQ0FBQ0MsSUFBSixDQUFTSyxLQUFULENBQWViLE1BQWYsRUFBdUJPLEdBQUcsQ0FBQ0UsSUFBM0IsQ0FBZDs7QUFDQWIsUUFBQUEsS0FBSyxDQUFDUSxHQUFOLENBQVVHLEdBQVYsRUFBZUssUUFBZjtBQUNELE9BSEQsQ0FJQSxPQUFPRSxLQUFQLEVBQWM7QUFDWkYsUUFBQUEsT0FBTyxHQUFHRSxLQUFWO0FBQ0Q7QUFDRjtBQUNGLEdBbkJEOztBQXFCQSxNQUFJWixVQUFVLENBQUNHLEdBQWYsRUFBb0I7QUFDbEJILElBQUFBLFVBQVUsQ0FBQ0csR0FBWCxHQUFpQk0sT0FBakI7QUFDRCxHQUZELE1BR0s7QUFDSFQsSUFBQUEsVUFBVSxDQUFDSSxLQUFYLEdBQW1CSyxPQUFuQjtBQUNEOztBQUVELFNBQU9ULFVBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmNvbnN0IGNhY2hlID0gbmV3IE1hcCgpXG5cbmZ1bmN0aW9uIGlzVmFsaWRLZXkoKTogYm9vbGVhbiB7XG4gIHJldHVybiBmYWxzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gTWVtb2l6ZShcbiAgdGFyZ2V0OiBtaXhlZCxcbiAgcHJvcDogc3RyaW5nLFxuICBkZXNjcmlwdG9yOiBPYmplY3Rcbik6ID9PYmplY3Qge1xuICAvLyBUaGlzIHdvbid0IG1ha2Ugc2Vuc2UgaWYgd2UgYXJlIGEgY2xhc3MgcHJvcDsgaWYgc28sIGJ1ZyBvdXRcbiAgaWYgKHR5cGVvZiBkZXNjcmlwdG9yLmluaXRpYWxpemVyKSByZXR1cm4gZGVzY3JpcHRvclxuXG4gIC8vIElmIHdlIGhhdmUgb25seSBhIHNldHRlciwgd2UgY2FuIHNraXAgb3V0XG4gIGlmIChkZXNjcmlwdG9yLnNldCAmJiAhZGVzY3JpcHRvci5nZXQgJiYgIWRlc2NyaXB0b3IudmFsdWUpIHJldHVybiBkZXNjcmlwdG9yXG5cbiAgLy8gSWYgd2UgZG8gbm90IGhhdmUgYSBnZXQgZnVuY3Rpb24gYW5kIHZhbHVlIGlzIG5vdCBhIGZ1bmN0aW9uLCBqZXRcbiAgaWYgKFxuICAgIHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlICE9PSAnZnVuY3Rpb24nXG4gICAgJiYgIWRlc2NyaXB0b3IuZ2V0XG4gICkge1xuICAgIHJldHVybiBkZXNjcmlwdG9yXG4gIH1cblxuICAvLyBPdXIgcGFzc2VkIGFyZ3VtZW50cyBhbmQgZnVuY3Rpb24gbWFrZSBvdXIga2V5XG4gIGNvbnN0IGtleSA9IHtcbiAgICB0YXJnZXQsXG4gICAgcHJvcCxcbiAgICBkZXNjcmlwdG9yLFxuXG4gICAgZnVuYzogZGVzY3JpcHRvci5nZXQgfHwgZGVzY3JpcHRvci52YWx1ZSxcbiAgICBhcmdzOiBbXSxcbiAgICB2YWxpZGF0ZTogaXNWYWxpZEtleVxuICB9XG5cbiAgLy8gSW4gb3JkZXIgdG8gZGV0ZXJtaW5lIGlmIHdlIGhhdmUgYSBtYXRjaCBvbiBrZXkgd2UgbXVzdCBhbGxvdyBleGVjdXRpb25cbiAgLy8gb2YgYSB3cmFwcGVyIGZ1bmN0aW9uIHRoYXQgZG9lcyBzb1xuICBjb25zdCB3cmFwcGVyID0gKC4uLmFyZ3MpID0+IHtcbiAgICBrZXkuYXJncyA9IGFyZ3M7XG5cbiAgICAvLyBUT0RPIGNoZWNrIGZvciBjYWNoZSBoaXQgYnkgY29tcGFyaW5nIG9iamVjdHNcbiAgICAvLyByZXR1cm4gdGhlIGNhY2hlIGlmIGEgaGl0IG9yIHJ1biB0aGUgZnVuY3Rpb24gYW5kIHN0b3JlIG90aGVyd2lzZVxuICAgIGlmIChrZXkudmFsaWRhdGUoKSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHJlc3VsdHNcblxuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBrZXkuZnVuYy5hcHBseSh0YXJnZXQsIGtleS5hcmdzKVxuICAgICAgICBjYWNoZS5zZXQoa2V5LCByZXN1bHRzKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlc3VsdHMgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZGVzY3JpcHRvci5nZXQpIHtcbiAgICBkZXNjcmlwdG9yLmdldCA9IHdyYXBwZXJcbiAgfVxuICBlbHNlIHtcbiAgICBkZXNjcmlwdG9yLnZhbHVlID0gd3JhcHBlclxuICB9XG5cbiAgcmV0dXJuIGRlc2NyaXB0b3Jcbn1cbiJdfQ==