/** @namespace decorators */
// @flow

import { MODEL_KEY } from '../GQLBase'
import { isArray } from '../types'
import { inspect } from 'util'
import { GraphQLEnumType } from 'graphql'

/**
 * For each of the decorators, Getters, Setters, and Properties, we take a 
 * list of property names used to create the appropriate accessor types. In 
 * some cases, however, the instance of GQLBase's data model may have a
 * different name. Finally if the return type for the getter should be wrapped 
 * in a another GQLBase class type, we will need a way to specify those things 
 * too. 
 *
 * The `extractBits()` takes a single argument value from the decorator as it 
 * parses them and converts it into an object, properly sorted, into values that 
 * allow the above described behavior.
 *
 * Examples:
 * 
 * ```
 * // Create a class with a name and age property that map directly to the 
 * // underlying data model
 * @Getters('name', 'age')
 * class MyType extends GQLBase {...}
 *
 * // Create a class with a name property that maps to a different property 
 * // name in the underlying data model 
 * @Getters(['name', '_fake_name'])
 * class MyMockType extends GQLBase {...}
 *
 * // Create a class with an employee property that returns an Employee 
 * @Getters(['employee', Employee])
 * class MyRoleType extends GQLBase {...}
 *
 * // Finally create a class with an employe property that returns an Employee 
 * // with data under a different name in the underlying data model.
 * @Getters(['employee', '_worker', Employee])
 * class MyMockRoleType extends GQLBase {...}
 * ```
 * 
 * @memberof decorators
 * @method ⌾⠀extractBits
 * @since 2.5
 * 
 * @param {String|Array<String|Function>} property name of a property, or list 
 * of property names and a Class. 
 * @return {Object} an object with the following format ```
 * {
 *   typePropertyName: name of root instance property to create 
 *   modelPropertyName: name of its associated internal model property 
 *   typeClass: an optional class to wrap around the results in a getter 
 * }
 * ```
 */
function extractBits(property) {
  let array = isArray(property) ? property : [property, property, null]
  let reply;
  
  if (!property) {
    let error = new Error(
      'Invalid property. Given\n  %o', 
      inspect(property, {depth: 2})
    );
    
    return {
      typePropertyName: 'anErrorOccurred',
      modelPropertyName: 'anErrorOccurred',
      typeClass: null,
      getterMaker: function() { return () => error },
      setterMaker: function() { return (v) => undefined }
    }
  }
  
  //
  if (array.length === 3) {
    reply = {
      typePropertyName: array[0],
      modelPropertyName: array[1],
      typeClass: typeof array[2] === 'function' && array[2] || null        
    }
  }
  
  //
  else if (array.length === 2) {
    reply = {
      typePropertyName: array[0],
      modelPropertyName: typeof array[1] === 'string'
        ? array[1]
        : array[0],
      typeClass: typeof array[1] === 'function' && array[1] || null
    }
  }
  
  //
  else {
    reply = {
      typePropertyName: array[0],
      modelPropertyName: array[0],
      typeClass: array[0]
    }
  }
  
  reply.getterMaker = function() {
    let { modelPropertyName, typeClass } = reply;
    return function() {
      if (typeClass) {
        let args = [this[MODEL_KEY][modelPropertyName], this.requestData];
        let val;

        if (extractBits.DIRECT_TYPES.includes(typeClass.name)) {
          val = typeClass(...args)
        }
        else {
          val = new typeClass(...args)
        }
        
        if (typeClass.GQL_TYPE === GraphQLEnumType) { return val.value; }
        
        return val;
      }
        
      return this[MODEL_KEY][modelPropertyName]
    }
  }
  
  reply.setterMaker = function() {
    let { modelPropertyName } = reply;
    return function (value) {
      this[MODEL_KEY][modelPropertyName] = value;
    }
  }
  
  return reply;
}

extractBits.DIRECT_TYPES = [
  'String',
  'Number'
];

/**
 * When working with `GQLBase` instances that expose properties
 * that have a 1:1 mapping to their own model property of the
 * same name, adding the getters manually can be annoying. This
 * takes an indeterminate amount of strings representing the
 * properties for which getters should be injected.
 *
 * @function 🏷⠀Getters
 * @memberof! decorators
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 'name' 
 * and 'age' as properties, then passing those two strings will result
 * in getters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method.s
 */
export function Getters(
  ...propertyNames: Array<String|Array<String|Function>>
): Function {
  return function(target: mixed): mixed {
    for (let property of propertyNames) {
      let { typePropertyName, getterMaker } = extractBits(property);
        
      Object.defineProperty(target.prototype, typePropertyName, {
        get: getterMaker()
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
 * @function 🏷⠀Setters
 * @memberof! decorators
 * @since 2.1.0
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 
 * 'name' and 'age' as properties, then passing those two strings will 
 * result in setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
export function Setters(
  ...propertyNames: Array<String|Array<String|Function>>
): Function {
  return function(target: mixed): mixed {
    for (let property of propertyNames) {
      let { typePropertyName, setterMaker } = extractBits(property);
        
      Object.defineProperty(target.prototype, typePropertyName, {
        set: setterMaker()
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
 * @function 🏷⠀Properties
 * @memberof! decorators
 * @since 2.1.0
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 'name' 
 * and 'age' as properties, then passing those two strings will result
 * in getters and setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
export function Properties(
  ...propertyNames: Array<String|Array<String|Function>>
): Function {
  return function(target: mixed): mixed {
    for (let property of propertyNames) {
      let { 
        typePropertyName, 
        getterMaker, 
        setterMaker 
      } = extractBits(property);
        
      Object.defineProperty(target.prototype, typePropertyName, {
        set: setterMaker(),
        get: getterMaker()
      });
    }

    return target;
  }
}

export default Properties;
