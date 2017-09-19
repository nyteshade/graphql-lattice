/** @namespace decorators */

import { GQLBase, MODEL_KEY } from '../GQLBase'
import { isArray, extendsFrom } from '../types'
import { inspect } from 'util'
import { GraphQLEnumType, parse } from 'graphql'
import { SyntaxTree } from '../SyntaxTree'

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
    let { modelPropertyName, typePropertyName, typeClass } = reply;
    
    return function() {
      const thisClass = this.constructor
      const model = this[MODEL_KEY] || null
      
      if (!extendsFrom(thisClass, GQLBase)) {
        console.error(`${thisClass.name} is not derived from GQLBase`);
        return undefined
      }

      if (!thisClass.SCHEMA) {
        throw new Error(`
        All GQLBase extended classes should have a defined SCHEMA. Please
        manually define a static get SCHEMA() in your class or use the 
        @Schema() decorator to do so.
        `)
      }
            
      if (typeClass) {
        const { meta } = SyntaxTree.findField(
          parse(this.constructor.SCHEMA),
          this.constructor.name,
          modelPropertyName
        );
        
        let args = [model[modelPropertyName], this.requestData];
        let val;
        
        if (meta && !meta.nullable && !model) {
          throw new Error(`
            Using @Getters or @Properties decorators with a null or 
            undefined model when the schema states that this field 
            cannot be null.
            
            Type      : ${typeClass.name}
            Field (AST data)
              name    : ${meta.name}
              type    : ${meta.type}
              nullable: ${meta.nullable}
            [getter]  : ${typePropertyName}
            [maps to] : ${modelPropertyName}
            [model  ] : ${model}            
          `)
        }

        // If the following is true, it means that despite allowing nulls 
        // for this field in the schema, we do have a valid model and should 
        // proceed.
        if (model) {
          if (extractBits.DIRECT_TYPES.includes(typeClass.name)) {
            val = typeClass(...args)
          }
          else {
            val = new typeClass(...args)
          }
          
          if (typeClass.GQL_TYPE === GraphQLEnumType) { return val.value; }
        }
        
        return val;
      }
      else {
        return model[modelPropertyName];
      }        
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
 * An array of proper class names that are used to test for cases where the 
 * proper usage of instantiating an instance should preclude the use of `new`
 *
 * @memberof decorators
 * @type {Array<String>}
 */
extractBits.DIRECT_TYPES = [
  String.name
];

/**
 * A small suite of functions a getter that allows easy manipulation of the 
 * the DIRECT_TYPES workaround needed for some types of complex class 
 * wrapping allowed by the @Getters and @Properties decorators. Namely the 
 * ability to do something like @Getters('name', String) which would wrap the 
 * contents of whatever is in the objects model in a String call. 
 *
 * Direct types are those that need to be called without `new` in order for the 
 * desired behavior to present itself. 
 *
 * @memberof decorators 
 * @type {Object}
 * @since 2.7.0
 */
export const DirectTypeManager = {
  /**
   * A getter that retrieves the array of direct types 
   *
   * @method DirectTypeManager#types
   * @member {Array<String>} types
   * 
   * @return {Array<String>} an array of class name strings. 
   */
  get types(): Array<String> { 
    return extractBits.DIRECT_TYPES 
  },
  
  /**
   * Appends the supplied class name to the list of registered direct types. If 
   * a class or function is passed, rather than a String, 
   *
   * @method DirectTypeManager#types
   *
   * @param {Function|string|RegExp} className the name of the class to append. 
   * Typically it is best to pass the name property of the class in question 
   * such as `RegExp.name` or `MyClass.name`.
   */
  add(className: string | RegExp | Function): void {
    if (typeof className === 'function') { 
      className = className.name 
    }
    
    extractBits.DIRECT_TYPES.push(className);
  },
  
  /**
   * Foricbly empties the contents of the extractBits.DIRECT_TYPES array. This 
   * is not recommended as it can have unintended consequences. It is 
   * recommended to use `reset` instead
   *
   * @method DirectTypeManager#clear
   *
   * @return {Array<string>} an array of class name Strings that were removed 
   * when cleared.
   */
  clear(): Array<string> {
    return extractBits.DIRECT_TYPES.splice(0, extractBits.DIRECT_TYPES.length)
  },
  
  /**
   * The recommended way to reset the DIRECT_TYPES list. This removes all 
   * changed values, returns the removed bits, and adds back in the defaults.
   *
   * @method DirectTypeManager#reset 
   *
   * @return {Array<string>} an array of class name Strings that were removed 
   * during the reset process.
   */
  reset(): Array<string> {
    return extractBits.DIRECT_TYPES.splice(
      0, 
      extractBits.DIRECT_TYPES.length,
      String.name
    )
  }
}

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
