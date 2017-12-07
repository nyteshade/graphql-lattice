'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

exports.Memoize = Memoize;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = new _map2.default();

function isValidKey() {
  return false;
}

function Memoize(target, prop, descriptor) {
  // This won't make sense if we are a class prop; if so, bug out
  if (typeof descriptor.initializer) return descriptor;

  // If we have only a setter, we can skip out
  if (descriptor.set && !descriptor.get && !descriptor.value) return descriptor;

  // If we do not have a get function and value is not a function, jet
  if (typeof descriptor.value !== 'function' && !descriptor.get) {
    return descriptor;
  }

  // Our passed arguments and function make our key
  const key = {
    target,
    prop,
    descriptor,

    func: descriptor.get || descriptor.value,
    args: [],
    validate: isValidKey

    // In order to determine if we have a match on key we must allow execution
    // of a wrapper function that does so
  };const wrapper = (...args) => {
    key.args = args;

    // TODO check for cache hit by comparing objects
    // return the cache if a hit or run the function and store otherwise
    if (key.validate()) {
      return cache.get(key);
    } else {
      let results;

      try {
        let results = key.func.apply(target, key.args);
        cache.set(key, results);
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
//# sourceMappingURL=Memoize.js.map