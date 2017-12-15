/** @namespace decorators */
/** @flow */

import { GQLBase, META_KEY } from '../GQLBase'
import { dedent } from 'ne-tag-fns'

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
function decorate(
  metaProperty: string,
  target: Object | Function,
  key: string,
  descriptor: Object
): Object {
  const Class = typeof target === 'function' ? target : target.constructor;
  const proto = typeof target === 'function' ? target.prototype : target;
  const isClass = Class === target;
  let fn: Function = descriptor.value;

  if (!Class instanceof GQLBase) {
    console.warn(dedent`
      Ignoring the transformation of @resolver for ${fn && fn.name || key}.
      The reason for this is that ${Class.name} is not an instance of GQLBase.
    `)

    return descriptor
  }

  if (
    !descriptor.value
    || (descriptor.get || descriptor.set || descriptor.initializer)
  ) {
    console.warn(dedent`
      Ignoring the transformation of @resolver for ${fn && fn.name || key}. The
      reason for this is that it should only be applied to a static or instance
      method of a class. It is not valid to apply this to a getter, setter,
      or property.
    `)

    return descriptor
  }

  // Remove the function from wherever it happens to be defined.
  delete target[key];
  delete descriptor.value;

  if (isClass) {
    delete proto[key]
  }
  else {
    delete Class[key]
  }

  // Obtain a reference to the metadata storage area and create the resolver
  // portion if it does not yet exist.
  Class[META_KEY][metaProperty] = Class[META_KEY][metaProperty] || []

  // Ensure that the function name matches the key, if not, wrap it
  // such that future uses of the .name property match the key of the
  // decorated function
  if (fn.name !== key) {
    Object.defineProperty(fn, 'name', { get: function() { return key } })
  }

  // Store the key by name, overwritting if necessary, and assign the function
  Class[META_KEY][metaProperty].push(fn)

  // Pass the decorated function along for others to consume
  descriptor[Symbol.for(metaProperty)] = fn

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
export function resolver(
  target: Object | Function,
  key: string,
  descriptor: Object
): Object {
  return decorate('resolvers', target, key, descriptor)
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
export function mutator(
  target: Object | Function,
  key: string,
  descriptor: Object
): Object {
  return decorate('mutators', target, key, descriptor)
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
export function subscriptor(
  target: Object | Function,
  key: string,
  descriptor: Object
): Object {
  return decorate('subscriptors', target, key, descriptor)
}
