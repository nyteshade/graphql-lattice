/** @namespace decorators */
// @flow

import { MODEL_KEY } from '../GQLBase'
import { isArray } from '../types'
import { inspect } from 'util'

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
      return typeClass 
        ? new typeClass(this[MODEL_KEY][modelPropertyName])
        : this[MODEL_KEY][modelPropertyName]
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
 * @param {Array<String|Array<String>>} propertyNames if the model has 'name' 
 * and 'age' as properties, then passing those two strings will result
 * in getters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method.s
 */
export function Getters(
  ...propertyNames: Array<String|Array<String>>
): Function {
  return function(target: mixed): mixed {
    for (let property of propertyNames) {
      let { typePropertyName, getterMaker } = extractBits(property);
        
      Object.defineProperty(target.prototype, typePropertyName, {
        value: getterMaker()
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
 * @param {Array<String|Array<String>>} propertyNames if the model has 
 * 'name' and 'age' as properties, then passing those two strings will 
 * result in setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
export function Setters(
  ...propertyNames: Array<String|Array<String>>
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
 * @function Properties
 * @memberof! decorators
 * @since 2.1.0
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 'name' 
 * and 'age' as properties, then passing those two strings will result
 * in getters and setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
export function Properties(
  ...propertyNames: Array<String|Array<String>>
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
