'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _for = require('babel-runtime/core-js/symbol/for');

var _for2 = _interopRequireDefault(_for);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

exports.resolver = resolver;
exports.mutator = mutator;
exports.subscriptor = subscriptor;

var _GQLBase = require('../GQLBase');

var _neTagFns = require('ne-tag-fns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Since the bulk functionality of @subscriptor, @mutator and
 * @resolver are almost identical, a single function can serve
 * the bulk of the functionality needed since they are so similar
 * in nature.
 *
 * @method decorators~decorate
 * @param {string} metaProperty the name of the meta sub key under which to
 * store the modified decorated function.
 * @param {Object|Function} target either the Class itself, if defined
 * on a static method, or the prototype if defined on an instance method
 * @param {string} key the property name of the function being decorated
 * @param {Object} descriptor a decorator descriptor; see
 * `Object.defineProperty` for more information on descriptors
 */
/** @namespace decorators */
function decorate(metaProperty, target, key, descriptor) {
  var Class = typeof target === 'function' ? target : target.constructor;
  var proto = typeof target === 'function' ? target.prototype : target;
  var isClass = Class === target;
  var fn = descriptor.value;

  if (!Class instanceof _GQLBase.GQLBase) {
    console.warn(_neTagFns.dedent`
      Ignoring the transformation of @resolver for ${fn && fn.name || key}.
      The reason for this is that ${Class.name} is not an instance of GQLBase.
    `);

    return descriptor;
  }

  if (!descriptor.value || descriptor.get || descriptor.set || descriptor.initializer) {
    console.warn(_neTagFns.dedent`
      Ignoring the transformation of @resolver for ${fn && fn.name || key}. The
      reason for this is that it should only be applied to a static or instance
      method of a class. It is not valid to apply this to a getter, setter,
      or property.
    `);

    return descriptor;
  }

  // Remove the function from wherever it happens to be defined.
  delete target[key];
  delete descriptor.value;

  if (isClass) {
    delete proto[key];
  } else {
    delete Class[key];
  }

  // Obtain a reference to the metadata storage area and create the resolver
  // portion if it does not yet exist.
  Class[_GQLBase.META_KEY][metaProperty] = Class[_GQLBase.META_KEY][metaProperty] || [];

  // Ensure that the function name matches the key, if not, wrap it
  // such that future uses of the .name property match the key of the
  // decorated function
  if (fn.name !== key) {
    var s = (0, _symbol2.default)();

    global[s] = fn;
    fn = eval(`(function ${key}(...args) { return global[s](...args) })`);
  }

  // Store the key by name, overwritting if necessary, and assign the function
  Class[_GQLBase.META_KEY][metaProperty].push(fn);

  // Pass the decorated function along for others to consume
  descriptor[(0, _for2.default)(metaProperty)] = fn;

  // Return a new decorator descriptor without the value function
  return descriptor;
}

/**
 * The resolver function should perform the necessary insertion to place
 * the decorated function in question into a place that it can be merged
 * with the final list of query resolvers. Typically a resolver function,
 * as defined in `RESOLVERS()` receives a `requestData` object. Functions
 * decorated with `@resolver` receive this as their first parameter. Code
 * accordingly.
 *
 * @method 🏷⠀decorators~resolver
 * @param {Object|Function} target either the Class itself, if defined
 * on a static method, or the prototype if defined on an instance method
 * @param {string} key the property name of the function being decorated
 * @param {Object} descriptor a decorator descriptor; see
 * `Object.defineProperty` for more information on descriptors
 */
function resolver(target, key, descriptor) {
  return decorate('resolvers', target, key, descriptor);
}

/**
 * The mutator function should perform the necessary insertion to place
 * the decorated function in question into a place that it can be merged
 * with the final list of query resolvers. Typically a mutator function,
 * as defined in `RESOLVERS()` receives a `requestData` object. Functions
 * decorated with `@mutator` receive this as their first parameter. Code
 * accordingly.
 *
 * @method 🏷⠀decorators~mutator
 * @param {Object|Function} target either the Class itself, if defined
 * on a static method, or the prototype if defined on an instance method
 * @param {string} key the property name of the function being decorated
 * @param {Object} descriptor a decorator descriptor; see
 * `Object.defineProperty` for more information on descriptors
 */
function mutator(target, key, descriptor) {
  return decorate('mutators', target, key, descriptor);
}

/**
 * The subscriptor function should perform the necessary insertion to place
 * the decorated function in question into a place that it can be merged
 * with the final list of query resolvers. Typically a subscriptor function,
 * as defined in `RESOLVERS()` receives a `requestData` object. Functions
 * decorated with `@subscriptor` receive this as their first parameter.
 * Code accordingly.
 *
 * @method 🏷⠀decorators~subscriptor
 * @param {Object|Function} target either the Class itself, if defined
 * on a static method, or the prototype if defined on an instance method
 * @param {string} key the property name of the function being decorated
 * @param {Object} descriptor a decorator descriptor; see
 * `Object.defineProperty` for more information on descriptors
 */
function subscriptor(target, key, descriptor) {
  return decorate('subscriptors', target, key, descriptor);
}
//# sourceMappingURL=Resolvers.js.map