/** @namespace decorators */
// @flow

/**
 * When working with `GQLBase` instances that expose properties
 * that have a 1:1 mapping to their own model property of the
 * same name, adding the getters manually can be annoying. This
 * takes an indeterminate amount of strings representing the
 * properties for which getters should be injected.
 *
 * @function Getters
 * @memberof! decorators
 *
 * @param {Array<String>} propertyNames if the model has 'name' and
 * 'age' as properties, then passing those two strings will result
 * in getters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method.s
 */
export function Getters(...propertyNames: Array<String>): Function {
  return function(target: mixed): mixed {
    for (let property of propertyNames) {
      Object.defineProperty(target.prototype, property, {
        get: function() {
          return this.model[property];
        }
      });
    }

    return target;
  }
}

/**
 * When working with `GQLBase` instances that expose properties
 * that have a 1:1 mapping to their own model property of the
 * same name, adding the setters manually can be annoying. This
 * takes an indeterminate amount of strings representing the
 * properties for which setters should be injected.
 *
 * @function Setters
 * @memberof! decorators
 *
 * @param {Array<String>} propertyNames if the model has 'name' and
 * 'age' as properties, then passing those two strings will result
 * in setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
export function Setters(...propertyNames: Array<String>):Function {
  return function(target: mixed): mixed {
    for (let property of propertyNames) {
      Object.defineProperty(target.prototype, property, {
        set: function(value) {
          this.model[property] = value;
        }
      });
    }

    return target;
  }
}

/**
 * When working with `GQLBase` instances that expose properties
 * that have a 1:1 mapping to their own model property of the
 * same name, adding the getters manually can be annoying. This
 * takes an indeterminate amount of strings representing the
 * properties for which getters should be injected.
 *
 * This method creates both getters and setters
 *
 * @function Properties
 * @memberof! decorators
 * @since 2.1.0
 *
 * @param {Array<String>} propertyNames if the model has 'name' and
 * 'age' as properties, then passing those two strings will result
 * in getters and setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
export function Properties(...propertyNames: Array<String>): Function {
  return function(target: mixed): mixed {
    for (let property of propertyNames) {
      Object.defineProperty(target.prototype, property, {
        set: function(value) {
          this.model[property] = value;
        },
        get: function() {
          return this.model[property];
        }
      });
    }

    return target;
  }
}

export default Properties;
