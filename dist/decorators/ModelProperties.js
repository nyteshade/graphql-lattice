"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DirectTypeAdd = DirectTypeAdd;
exports.applyTags = applyTags;
exports.Getters = Getters;
exports.Setters = Setters;
exports.Properties = Properties;
exports.default = exports.DirectTypeManager = void 0;

require("core-js/modules/es7.symbol.async-iterator");

var _GQLBase = require("../GQLBase");

var _neTypes = require("ne-types");

var _util = require("util");

var _graphql = require("graphql");

var _SyntaxTree = require("../SyntaxTree");

/** @namespace decorators */

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
 *   fieldName: name of root instance property to create
 *   modelName: name of its associated internal model property
 *   typeClass: an optional class to wrap around the results in a getter
 * }
 * ```
 */
function extractBits(property) {
  let array = (0, _neTypes.isArray)(property) ? property : [property, property, null];
  let reply;

  if (!property) {
    let error = new Error('Invalid property. Given\n  %o', (0, _util.inspect)(property, {
      depth: 2
    }));
    return {
      fieldName: 'anErrorOccurred',
      modelName: 'anErrorOccurred',
      typeClass: null,
      getterMaker: function () {
        return () => error;
      },
      setterMaker: function () {
        return v => undefined;
      }
    };
  } //


  if (array.length === 3) {
    reply = {
      fieldName: array[0],
      modelName: array[1],
      typeClass: typeof array[2] === 'function' && array[2] || null
    };
  } //
  else if (array.length === 2) {
      reply = {
        fieldName: array[0],
        modelName: typeof array[1] === 'string' ? array[1] : array[0],
        typeClass: typeof array[1] === 'function' && array[1] || null
      };
    } //
    else {
        reply = {
          fieldName: array[0],
          modelName: array[0],
          typeClass: array[0]
        };
      }

  reply.getterMaker = function () {
    let {
      modelName,
      fieldName,
      typeClass
    } = reply;
    return function () {
      const thisClass = this.constructor;
      const model = this[_GQLBase.MODEL_KEY] || null;
      let val;

      if (!(0, _neTypes.extendsFrom)(thisClass, _GQLBase.GQLBase)) {
        console.error(`${thisClass.name} is not derived from GQLBase`);
        return undefined;
      }

      if (!thisClass.SCHEMA) {
        throw new Error(`
        All GQLBase extended classes should have a defined SCHEMA. Please
        manually define a static get SCHEMA() in your class or use the
        @Schema() decorator to do so.
        `);
      }

      if (typeClass) {
        // If the value of the model is already the type of class we expect
        // we do not need to do any processing and we can just grab it and
        // go.
        if (model[modelName] && (0, _neTypes.extendsFrom)(model[modelName], typeClass)) {
          val = model[modelName];
        } // Otherwise we need to return an instance of the determined typeClass
        // and pass that back instead; as requested.
        else {
            const results = _SyntaxTree.SyntaxTree.findField((0, _graphql.parse)(this.constructor.SCHEMA), this.constructor.name, modelName);

            const {
              meta
            } = results || {
              meta: null
            };
            let args = [model[modelName], this.requestData];

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
              [getter]  : ${fieldName}
              [maps to] : ${modelName}
              [model  ] : ${model}
            `);
            } // If the following is true, it means that despite allowing nulls
            // for this field in the schema, we do have a valid model and should
            // proceed.


            if (model) {
              if (extractBits.DIRECT_TYPES.includes(typeClass.name)) {
                val = typeClass(...args);
              } else {
                val = new typeClass(...args);
              }

              if (typeClass.GQL_TYPE === _graphql.GraphQLEnumType) {
                return val.value;
              }
            }
          }
      } else {
        val = model[modelName];
      }

      if (val === 'undefined' || val === undefined) {
        val = null;
      }

      return val;
    };
  };

  reply.setterMaker = function () {
    let {
      modelName
    } = reply;
    return function (value) {
      this[_GQLBase.MODEL_KEY][modelName] = value;
    };
  };

  return reply;
}
/**
 * An array of proper class names that are used to test for cases where the
 * proper usage of instantiating an instance should preclude the use of `new`
 *
 * @memberof decorators
 * @type {Array<String>}
 */


extractBits.DIRECT_TYPES = [String.name];
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

const DirectTypeManager = {
  /**
   * A getter that retrieves the array of direct types
   *
   * @method DirectTypeManager#types
   * @member {Array<String>} types
   *
   * @return {Array<String>} an array of class name strings.
   */
  get types() {
    return extractBits.DIRECT_TYPES;
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
  add(className) {
    if (typeof className === 'function') {
      className = className.name;
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
  clear() {
    return extractBits.DIRECT_TYPES.splice(0, extractBits.DIRECT_TYPES.length);
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
  reset() {
    return extractBits.DIRECT_TYPES.splice(0, extractBits.DIRECT_TYPES.length, String.name);
  }

};
/**
 * This decorator allows you to add a Class method to the DirectTypeManager
 * as a function that should not be invoked with the `new` keyword. For all
 * intents and purposes the function should be declared `static`.
 *
 * @method DirectTypeAdd
 * @param {Function} target [description]
 * @constructor
 */

exports.DirectTypeManager = DirectTypeManager;

function DirectTypeAdd(target) {
  DirectTypeManager.add(target);
  return target;
}
/**
 * When applying multiple property getters and setters, knowing some info
 * about what was applied elsewhere can be important. "Tags" can be applied
 * that store the fieldName and descriptor applied via one of these decorators.
 *
 * Multiple "tags" are supported to allow for detecting the difference between
 * decorators applied by the developer using lattice and something auto
 * generated such as auto-props.
 *
 * @param  {GQLBase} Class an instance of GQLBase to apply the tags tp
 * @param  {Array<string|Symbol>} addTags an array of Symbols or strings to be
 * wrapped in Symbols that will be used as tag keys
 * @param  {string} fieldName the name of the field being decorated
 * @param  {Object} descriptor the JavaScript descriptor object to associate
 * with this tagged field.
 */


function applyTags(Class, addTags, fieldName, descriptor) {
  let tags = (Array.isArray(addTags) && addTags || []).map(tag => typeof tag === 'string' && Symbol.for(tag) || tag).filter(tag => typeof tag === 'symbol');
  tags.forEach(tag => {
    Class[_GQLBase.META_KEY][tag] = Class[_GQLBase.META_KEY][tag] || {};
    Class[_GQLBase.META_KEY][tag][fieldName] = descriptor;
  });
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


function Getters(...propertyNames) {
  return function (target, addTags = []) {
    for (let property of propertyNames) {
      let {
        fieldName,
        getterMaker
      } = extractBits(property);
      let desc = Object.getOwnPropertyDescriptor(target.prototype, fieldName);
      let hasImpl = desc && (desc.get || typeof desc.value === 'function');
      let tags = [_GQLBase.GETTERS].concat(Array.isArray(addTags) && addTags || []);

      if (!hasImpl) {
        let descriptor = {
          get: getterMaker()
        };
        applyTags(target, tags, fieldName, descriptor);
        Object.defineProperty(target.prototype, fieldName, descriptor);
      } else {
        console.warn(`Skipping getter for ${target.name}.${fieldName}; already exists`);
      }
    }

    return target;
  };
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


function Setters(...propertyNames) {
  return function (target, addTags = []) {
    for (let property of propertyNames) {
      let {
        fieldName,
        setterMaker
      } = extractBits(property);
      let desc = Object.getOwnPropertyDescriptor(target.prototype, fieldName);
      let hasImpl = desc && (desc.get || typeof desc.value === 'function');
      let tags = [_GQLBase.SETTERS].concat(Array.isArray(addTags) && addTags || []);

      if (!hasImpl) {
        let descriptor = {
          set: setterMaker()
        };
        applyTags(target, tags, fieldName, descriptor);
        Object.defineProperty(target.prototype, fieldName, descriptor);
      } else {
        console.warn(`Skipping setter for ${target.name}.${fieldName}; already exists`);
      }
    }

    return target;
  };
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


function Properties(...propertyNames) {
  return function (target, addTags = []) {
    for (let property of propertyNames) {
      let {
        fieldName,
        getterMaker,
        setterMaker
      } = extractBits(property);
      let desc = Object.getOwnPropertyDescriptor(target.prototype, fieldName);
      let hasImpl = desc && (desc.get || typeof desc.value === 'function');
      let tags = [_GQLBase.PROPS].concat(Array.isArray(addTags) && addTags || []);

      if (!hasImpl) {
        let descriptor = {
          set: setterMaker(),
          get: getterMaker()
        };
        applyTags(target, tags, fieldName, descriptor);
        Object.defineProperty(target.prototype, fieldName, descriptor);
      } else {
        console.warn(`Skipping properties for ${target.name}.${fieldName}; already exists`);
      }
    }

    return target;
  };
}

var _default = Properties;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL01vZGVsUHJvcGVydGllcy5qcyJdLCJuYW1lcyI6WyJleHRyYWN0Qml0cyIsInByb3BlcnR5IiwiYXJyYXkiLCJyZXBseSIsImVycm9yIiwiRXJyb3IiLCJkZXB0aCIsImZpZWxkTmFtZSIsIm1vZGVsTmFtZSIsInR5cGVDbGFzcyIsImdldHRlck1ha2VyIiwic2V0dGVyTWFrZXIiLCJ2IiwidW5kZWZpbmVkIiwibGVuZ3RoIiwidGhpc0NsYXNzIiwiY29uc3RydWN0b3IiLCJtb2RlbCIsIk1PREVMX0tFWSIsInZhbCIsIkdRTEJhc2UiLCJjb25zb2xlIiwibmFtZSIsIlNDSEVNQSIsInJlc3VsdHMiLCJTeW50YXhUcmVlIiwiZmluZEZpZWxkIiwibWV0YSIsImFyZ3MiLCJyZXF1ZXN0RGF0YSIsIm51bGxhYmxlIiwidHlwZSIsIkRJUkVDVF9UWVBFUyIsImluY2x1ZGVzIiwiR1FMX1RZUEUiLCJHcmFwaFFMRW51bVR5cGUiLCJ2YWx1ZSIsIlN0cmluZyIsIkRpcmVjdFR5cGVNYW5hZ2VyIiwidHlwZXMiLCJhZGQiLCJjbGFzc05hbWUiLCJwdXNoIiwiY2xlYXIiLCJzcGxpY2UiLCJyZXNldCIsIkRpcmVjdFR5cGVBZGQiLCJ0YXJnZXQiLCJhcHBseVRhZ3MiLCJDbGFzcyIsImFkZFRhZ3MiLCJkZXNjcmlwdG9yIiwidGFncyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsInRhZyIsIlN5bWJvbCIsImZvciIsImZpbHRlciIsImZvckVhY2giLCJNRVRBX0tFWSIsIkdldHRlcnMiLCJwcm9wZXJ0eU5hbWVzIiwiZGVzYyIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInByb3RvdHlwZSIsImhhc0ltcGwiLCJnZXQiLCJHRVRURVJTIiwiY29uY2F0IiwiZGVmaW5lUHJvcGVydHkiLCJ3YXJuIiwiU2V0dGVycyIsIlNFVFRFUlMiLCJzZXQiLCJQcm9wZXJ0aWVzIiwiUFJPUFMiXSwibWFwcGluZ3MiOiI7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R0FBRyxFQUFFM0QsV0FBVztBQUZELFNBQWpCO0FBS0FzQyxRQUFBQSxTQUFTLENBQUNELE1BQUQsRUFBU0ssSUFBVCxFQUFlN0MsU0FBZixFQUEwQjRDLFVBQTFCLENBQVQ7QUFDQWMsUUFBQUEsTUFBTSxDQUFDTyxjQUFQLENBQXNCekIsTUFBTSxDQUFDb0IsU0FBN0IsRUFBd0M1RCxTQUF4QyxFQUFtRDRDLFVBQW5EO0FBQ0QsT0FSRCxNQVNLO0FBQ0g5QixRQUFBQSxPQUFPLENBQUNvRCxJQUFSLENBQ0csMkJBQTBCMUIsTUFBTSxDQUFDekIsSUFBSyxJQUFHZixTQUFVLGtCQUR0RDtBQUdEO0FBQ0Y7O0FBRUQsV0FBT3dDLE1BQVA7QUFDRCxHQXhCRDtBQXlCRDs7ZUFFYzhCLFUiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQG5hbWVzcGFjZSBkZWNvcmF0b3JzICovXG5cbmltcG9ydCB7XG4gIEdRTEJhc2UsIE1PREVMX0tFWSwgTUVUQV9LRVksIEdFVFRFUlMsIFNFVFRFUlMsIFBST1BTLCBBVVRPX1BST1BTXG59IGZyb20gJy4uL0dRTEJhc2UnXG5pbXBvcnQgeyBpc0FycmF5LCBleHRlbmRzRnJvbSB9IGZyb20gJ25lLXR5cGVzJ1xuaW1wb3J0IHsgaW5zcGVjdCB9IGZyb20gJ3V0aWwnXG5pbXBvcnQgeyBHcmFwaFFMRW51bVR5cGUsIHBhcnNlIH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCB7IFN5bnRheFRyZWUgfSBmcm9tICcuLi9TeW50YXhUcmVlJ1xuXG4vKipcbiAqIEZvciBlYWNoIG9mIHRoZSBkZWNvcmF0b3JzLCBHZXR0ZXJzLCBTZXR0ZXJzLCBhbmQgUHJvcGVydGllcywgd2UgdGFrZSBhXG4gKiBsaXN0IG9mIHByb3BlcnR5IG5hbWVzIHVzZWQgdG8gY3JlYXRlIHRoZSBhcHByb3ByaWF0ZSBhY2Nlc3NvciB0eXBlcy4gSW5cbiAqIHNvbWUgY2FzZXMsIGhvd2V2ZXIsIHRoZSBpbnN0YW5jZSBvZiBHUUxCYXNlJ3MgZGF0YSBtb2RlbCBtYXkgaGF2ZSBhXG4gKiBkaWZmZXJlbnQgbmFtZS4gRmluYWxseSBpZiB0aGUgcmV0dXJuIHR5cGUgZm9yIHRoZSBnZXR0ZXIgc2hvdWxkIGJlIHdyYXBwZWRcbiAqIGluIGEgYW5vdGhlciBHUUxCYXNlIGNsYXNzIHR5cGUsIHdlIHdpbGwgbmVlZCBhIHdheSB0byBzcGVjaWZ5IHRob3NlIHRoaW5nc1xuICogdG9vLlxuICpcbiAqIFRoZSBgZXh0cmFjdEJpdHMoKWAgdGFrZXMgYSBzaW5nbGUgYXJndW1lbnQgdmFsdWUgZnJvbSB0aGUgZGVjb3JhdG9yIGFzIGl0XG4gKiBwYXJzZXMgdGhlbSBhbmQgY29udmVydHMgaXQgaW50byBhbiBvYmplY3QsIHByb3Blcmx5IHNvcnRlZCwgaW50byB2YWx1ZXMgdGhhdFxuICogYWxsb3cgdGhlIGFib3ZlIGRlc2NyaWJlZCBiZWhhdmlvci5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiBgYGBcbiAqIC8vIENyZWF0ZSBhIGNsYXNzIHdpdGggYSBuYW1lIGFuZCBhZ2UgcHJvcGVydHkgdGhhdCBtYXAgZGlyZWN0bHkgdG8gdGhlXG4gKiAvLyB1bmRlcmx5aW5nIGRhdGEgbW9kZWxcbiAqIEBHZXR0ZXJzKCduYW1lJywgJ2FnZScpXG4gKiBjbGFzcyBNeVR5cGUgZXh0ZW5kcyBHUUxCYXNlIHsuLi59XG4gKlxuICogLy8gQ3JlYXRlIGEgY2xhc3Mgd2l0aCBhIG5hbWUgcHJvcGVydHkgdGhhdCBtYXBzIHRvIGEgZGlmZmVyZW50IHByb3BlcnR5XG4gKiAvLyBuYW1lIGluIHRoZSB1bmRlcmx5aW5nIGRhdGEgbW9kZWxcbiAqIEBHZXR0ZXJzKFsnbmFtZScsICdfZmFrZV9uYW1lJ10pXG4gKiBjbGFzcyBNeU1vY2tUeXBlIGV4dGVuZHMgR1FMQmFzZSB7Li4ufVxuICpcbiAqIC8vIENyZWF0ZSBhIGNsYXNzIHdpdGggYW4gZW1wbG95ZWUgcHJvcGVydHkgdGhhdCByZXR1cm5zIGFuIEVtcGxveWVlXG4gKiBAR2V0dGVycyhbJ2VtcGxveWVlJywgRW1wbG95ZWVdKVxuICogY2xhc3MgTXlSb2xlVHlwZSBleHRlbmRzIEdRTEJhc2Ugey4uLn1cbiAqXG4gKiAvLyBGaW5hbGx5IGNyZWF0ZSBhIGNsYXNzIHdpdGggYW4gZW1wbG95ZSBwcm9wZXJ0eSB0aGF0IHJldHVybnMgYW4gRW1wbG95ZWVcbiAqIC8vIHdpdGggZGF0YSB1bmRlciBhIGRpZmZlcmVudCBuYW1lIGluIHRoZSB1bmRlcmx5aW5nIGRhdGEgbW9kZWwuXG4gKiBAR2V0dGVycyhbJ2VtcGxveWVlJywgJ193b3JrZXInLCBFbXBsb3llZV0pXG4gKiBjbGFzcyBNeU1vY2tSb2xlVHlwZSBleHRlbmRzIEdRTEJhc2Ugey4uLn1cbiAqIGBgYFxuICpcbiAqIEBtZW1iZXJvZiBkZWNvcmF0b3JzXG4gKiBAbWV0aG9kIOKMvuKggGV4dHJhY3RCaXRzXG4gKiBAc2luY2UgMi41XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXk8U3RyaW5nfEZ1bmN0aW9uPn0gcHJvcGVydHkgbmFtZSBvZiBhIHByb3BlcnR5LCBvciBsaXN0XG4gKiBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgYSBDbGFzcy5cbiAqIEByZXR1cm4ge09iamVjdH0gYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBmb3JtYXQgYGBgXG4gKiB7XG4gKiAgIGZpZWxkTmFtZTogbmFtZSBvZiByb290IGluc3RhbmNlIHByb3BlcnR5IHRvIGNyZWF0ZVxuICogICBtb2RlbE5hbWU6IG5hbWUgb2YgaXRzIGFzc29jaWF0ZWQgaW50ZXJuYWwgbW9kZWwgcHJvcGVydHlcbiAqICAgdHlwZUNsYXNzOiBhbiBvcHRpb25hbCBjbGFzcyB0byB3cmFwIGFyb3VuZCB0aGUgcmVzdWx0cyBpbiBhIGdldHRlclxuICogfVxuICogYGBgXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RCaXRzKHByb3BlcnR5KSB7XG4gIGxldCBhcnJheSA9IGlzQXJyYXkocHJvcGVydHkpID8gcHJvcGVydHkgOiBbcHJvcGVydHksIHByb3BlcnR5LCBudWxsXVxuICBsZXQgcmVwbHk7XG5cbiAgaWYgKCFwcm9wZXJ0eSkge1xuICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICdJbnZhbGlkIHByb3BlcnR5LiBHaXZlblxcbiAgJW8nLFxuICAgICAgaW5zcGVjdChwcm9wZXJ0eSwge2RlcHRoOiAyfSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZpZWxkTmFtZTogJ2FuRXJyb3JPY2N1cnJlZCcsXG4gICAgICBtb2RlbE5hbWU6ICdhbkVycm9yT2NjdXJyZWQnLFxuICAgICAgdHlwZUNsYXNzOiBudWxsLFxuICAgICAgZ2V0dGVyTWFrZXI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gKCkgPT4gZXJyb3IgfSxcbiAgICAgIHNldHRlck1ha2VyOiBmdW5jdGlvbigpIHsgcmV0dXJuICh2KSA9PiB1bmRlZmluZWQgfVxuICAgIH1cbiAgfVxuXG4gIC8vXG4gIGlmIChhcnJheS5sZW5ndGggPT09IDMpIHtcbiAgICByZXBseSA9IHtcbiAgICAgIGZpZWxkTmFtZTogYXJyYXlbMF0sXG4gICAgICBtb2RlbE5hbWU6IGFycmF5WzFdLFxuICAgICAgdHlwZUNsYXNzOiB0eXBlb2YgYXJyYXlbMl0gPT09ICdmdW5jdGlvbicgJiYgYXJyYXlbMl0gfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8vXG4gIGVsc2UgaWYgKGFycmF5Lmxlbmd0aCA9PT0gMikge1xuICAgIHJlcGx5ID0ge1xuICAgICAgZmllbGROYW1lOiBhcnJheVswXSxcbiAgICAgIG1vZGVsTmFtZTogdHlwZW9mIGFycmF5WzFdID09PSAnc3RyaW5nJ1xuICAgICAgICA/IGFycmF5WzFdXG4gICAgICAgIDogYXJyYXlbMF0sXG4gICAgICB0eXBlQ2xhc3M6IHR5cGVvZiBhcnJheVsxXSA9PT0gJ2Z1bmN0aW9uJyAmJiBhcnJheVsxXSB8fCBudWxsXG4gICAgfVxuICB9XG5cbiAgLy9cbiAgZWxzZSB7XG4gICAgcmVwbHkgPSB7XG4gICAgICBmaWVsZE5hbWU6IGFycmF5WzBdLFxuICAgICAgbW9kZWxOYW1lOiBhcnJheVswXSxcbiAgICAgIHR5cGVDbGFzczogYXJyYXlbMF1cbiAgICB9XG4gIH1cblxuICByZXBseS5nZXR0ZXJNYWtlciA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCB7IG1vZGVsTmFtZSwgZmllbGROYW1lLCB0eXBlQ2xhc3MgfSA9IHJlcGx5O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdGhpc0NsYXNzID0gdGhpcy5jb25zdHJ1Y3RvclxuICAgICAgY29uc3QgbW9kZWwgPSB0aGlzW01PREVMX0tFWV0gfHwgbnVsbFxuICAgICAgbGV0IHZhbFxuXG4gICAgICBpZiAoIWV4dGVuZHNGcm9tKHRoaXNDbGFzcywgR1FMQmFzZSkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHt0aGlzQ2xhc3MubmFtZX0gaXMgbm90IGRlcml2ZWQgZnJvbSBHUUxCYXNlYCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzQ2xhc3MuU0NIRU1BKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICAgIEFsbCBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzZXMgc2hvdWxkIGhhdmUgYSBkZWZpbmVkIFNDSEVNQS4gUGxlYXNlXG4gICAgICAgIG1hbnVhbGx5IGRlZmluZSBhIHN0YXRpYyBnZXQgU0NIRU1BKCkgaW4geW91ciBjbGFzcyBvciB1c2UgdGhlXG4gICAgICAgIEBTY2hlbWEoKSBkZWNvcmF0b3IgdG8gZG8gc28uXG4gICAgICAgIGApXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlQ2xhc3MpIHtcbiAgICAgICAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBtb2RlbCBpcyBhbHJlYWR5IHRoZSB0eXBlIG9mIGNsYXNzIHdlIGV4cGVjdFxuICAgICAgICAvLyB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnkgcHJvY2Vzc2luZyBhbmQgd2UgY2FuIGp1c3QgZ3JhYiBpdCBhbmRcbiAgICAgICAgLy8gZ28uXG4gICAgICAgIGlmIChtb2RlbFttb2RlbE5hbWVdICYmIGV4dGVuZHNGcm9tKG1vZGVsW21vZGVsTmFtZV0sIHR5cGVDbGFzcykpIHtcbiAgICAgICAgICB2YWwgPSBtb2RlbFttb2RlbE5hbWVdXG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgbmVlZCB0byByZXR1cm4gYW4gaW5zdGFuY2Ugb2YgdGhlIGRldGVybWluZWQgdHlwZUNsYXNzXG4gICAgICAgIC8vIGFuZCBwYXNzIHRoYXQgYmFjayBpbnN0ZWFkOyBhcyByZXF1ZXN0ZWQuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBTeW50YXhUcmVlLmZpbmRGaWVsZChcbiAgICAgICAgICAgIHBhcnNlKHRoaXMuY29uc3RydWN0b3IuU0NIRU1BKSxcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IubmFtZSxcbiAgICAgICAgICAgIG1vZGVsTmFtZVxuICAgICAgICAgIClcbiAgICAgICAgICBjb25zdCB7IG1ldGEgfSA9IHJlc3VsdHMgfHwgeyBtZXRhOiBudWxsIH07XG5cbiAgICAgICAgICBsZXQgYXJncyA9IFttb2RlbFttb2RlbE5hbWVdLCB0aGlzLnJlcXVlc3REYXRhXTtcblxuICAgICAgICAgIGlmIChtZXRhICYmICFtZXRhLm51bGxhYmxlICYmICFtb2RlbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgICAgICAgICAgVXNpbmcgQEdldHRlcnMgb3IgQFByb3BlcnRpZXMgZGVjb3JhdG9ycyB3aXRoIGEgbnVsbCBvclxuICAgICAgICAgICAgICB1bmRlZmluZWQgbW9kZWwgd2hlbiB0aGUgc2NoZW1hIHN0YXRlcyB0aGF0IHRoaXMgZmllbGRcbiAgICAgICAgICAgICAgY2Fubm90IGJlIG51bGwuXG5cbiAgICAgICAgICAgICAgVHlwZSAgICAgIDogJHt0eXBlQ2xhc3MubmFtZX1cbiAgICAgICAgICAgICAgRmllbGQgKEFTVCBkYXRhKVxuICAgICAgICAgICAgICAgIG5hbWUgICAgOiAke21ldGEubmFtZX1cbiAgICAgICAgICAgICAgICB0eXBlICAgIDogJHttZXRhLnR5cGV9XG4gICAgICAgICAgICAgICAgbnVsbGFibGU6ICR7bWV0YS5udWxsYWJsZX1cbiAgICAgICAgICAgICAgW2dldHRlcl0gIDogJHtmaWVsZE5hbWV9XG4gICAgICAgICAgICAgIFttYXBzIHRvXSA6ICR7bW9kZWxOYW1lfVxuICAgICAgICAgICAgICBbbW9kZWwgIF0gOiAke21vZGVsfVxuICAgICAgICAgICAgYClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgZm9sbG93aW5nIGlzIHRydWUsIGl0IG1lYW5zIHRoYXQgZGVzcGl0ZSBhbGxvd2luZyBudWxsc1xuICAgICAgICAgIC8vIGZvciB0aGlzIGZpZWxkIGluIHRoZSBzY2hlbWEsIHdlIGRvIGhhdmUgYSB2YWxpZCBtb2RlbCBhbmQgc2hvdWxkXG4gICAgICAgICAgLy8gcHJvY2VlZC5cbiAgICAgICAgICBpZiAobW9kZWwpIHtcbiAgICAgICAgICAgIGlmIChleHRyYWN0Qml0cy5ESVJFQ1RfVFlQRVMuaW5jbHVkZXModHlwZUNsYXNzLm5hbWUpKSB7XG4gICAgICAgICAgICAgIHZhbCA9IHR5cGVDbGFzcyguLi5hcmdzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHZhbCA9IG5ldyB0eXBlQ2xhc3MoLi4uYXJncylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVDbGFzcy5HUUxfVFlQRSA9PT0gR3JhcGhRTEVudW1UeXBlKSB7IHJldHVybiB2YWwudmFsdWU7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YWwgPSBtb2RlbFttb2RlbE5hbWVdO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsID09PSAndW5kZWZpbmVkJyB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgfVxuXG4gIHJlcGx5LnNldHRlck1ha2VyID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHsgbW9kZWxOYW1lIH0gPSByZXBseTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB0aGlzW01PREVMX0tFWV1bbW9kZWxOYW1lXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXBseTtcbn1cblxuLyoqXG4gKiBBbiBhcnJheSBvZiBwcm9wZXIgY2xhc3MgbmFtZXMgdGhhdCBhcmUgdXNlZCB0byB0ZXN0IGZvciBjYXNlcyB3aGVyZSB0aGVcbiAqIHByb3BlciB1c2FnZSBvZiBpbnN0YW50aWF0aW5nIGFuIGluc3RhbmNlIHNob3VsZCBwcmVjbHVkZSB0aGUgdXNlIG9mIGBuZXdgXG4gKlxuICogQG1lbWJlcm9mIGRlY29yYXRvcnNcbiAqIEB0eXBlIHtBcnJheTxTdHJpbmc+fVxuICovXG5leHRyYWN0Qml0cy5ESVJFQ1RfVFlQRVMgPSBbXG4gIFN0cmluZy5uYW1lXG5dO1xuXG4vKipcbiAqIEEgc21hbGwgc3VpdGUgb2YgZnVuY3Rpb25zIGEgZ2V0dGVyIHRoYXQgYWxsb3dzIGVhc3kgbWFuaXB1bGF0aW9uIG9mIHRoZVxuICogdGhlIERJUkVDVF9UWVBFUyB3b3JrYXJvdW5kIG5lZWRlZCBmb3Igc29tZSB0eXBlcyBvZiBjb21wbGV4IGNsYXNzXG4gKiB3cmFwcGluZyBhbGxvd2VkIGJ5IHRoZSBAR2V0dGVycyBhbmQgQFByb3BlcnRpZXMgZGVjb3JhdG9ycy4gTmFtZWx5IHRoZVxuICogYWJpbGl0eSB0byBkbyBzb21ldGhpbmcgbGlrZSBAR2V0dGVycygnbmFtZScsIFN0cmluZykgd2hpY2ggd291bGQgd3JhcCB0aGVcbiAqIGNvbnRlbnRzIG9mIHdoYXRldmVyIGlzIGluIHRoZSBvYmplY3RzIG1vZGVsIGluIGEgU3RyaW5nIGNhbGwuXG4gKlxuICogRGlyZWN0IHR5cGVzIGFyZSB0aG9zZSB0aGF0IG5lZWQgdG8gYmUgY2FsbGVkIHdpdGhvdXQgYG5ld2AgaW4gb3JkZXIgZm9yIHRoZVxuICogZGVzaXJlZCBiZWhhdmlvciB0byBwcmVzZW50IGl0c2VsZi5cbiAqXG4gKiBAbWVtYmVyb2YgZGVjb3JhdG9yc1xuICogQHR5cGUge09iamVjdH1cbiAqIEBzaW5jZSAyLjcuMFxuICovXG5leHBvcnQgY29uc3QgRGlyZWN0VHlwZU1hbmFnZXIgPSB7XG4gIC8qKlxuICAgKiBBIGdldHRlciB0aGF0IHJldHJpZXZlcyB0aGUgYXJyYXkgb2YgZGlyZWN0IHR5cGVzXG4gICAqXG4gICAqIEBtZXRob2QgRGlyZWN0VHlwZU1hbmFnZXIjdHlwZXNcbiAgICogQG1lbWJlciB7QXJyYXk8U3RyaW5nPn0gdHlwZXNcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8U3RyaW5nPn0gYW4gYXJyYXkgb2YgY2xhc3MgbmFtZSBzdHJpbmdzLlxuICAgKi9cbiAgZ2V0IHR5cGVzKCk6IEFycmF5PFN0cmluZz4ge1xuICAgIHJldHVybiBleHRyYWN0Qml0cy5ESVJFQ1RfVFlQRVNcbiAgfSxcblxuICAvKipcbiAgICogQXBwZW5kcyB0aGUgc3VwcGxpZWQgY2xhc3MgbmFtZSB0byB0aGUgbGlzdCBvZiByZWdpc3RlcmVkIGRpcmVjdCB0eXBlcy4gSWZcbiAgICogYSBjbGFzcyBvciBmdW5jdGlvbiBpcyBwYXNzZWQsIHJhdGhlciB0aGFuIGEgU3RyaW5nLFxuICAgKlxuICAgKiBAbWV0aG9kIERpcmVjdFR5cGVNYW5hZ2VyI3R5cGVzXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfFJlZ0V4cH0gY2xhc3NOYW1lIHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBhcHBlbmQuXG4gICAqIFR5cGljYWxseSBpdCBpcyBiZXN0IHRvIHBhc3MgdGhlIG5hbWUgcHJvcGVydHkgb2YgdGhlIGNsYXNzIGluIHF1ZXN0aW9uXG4gICAqIHN1Y2ggYXMgYFJlZ0V4cC5uYW1lYCBvciBgTXlDbGFzcy5uYW1lYC5cbiAgICovXG4gIGFkZChjbGFzc05hbWU6IHN0cmluZyB8IFJlZ0V4cCB8IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBjbGFzc05hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5uYW1lXG4gICAgfVxuXG4gICAgZXh0cmFjdEJpdHMuRElSRUNUX1RZUEVTLnB1c2goY2xhc3NOYW1lKTtcbiAgfSxcblxuICAvKipcbiAgICogRm9yaWNibHkgZW1wdGllcyB0aGUgY29udGVudHMgb2YgdGhlIGV4dHJhY3RCaXRzLkRJUkVDVF9UWVBFUyBhcnJheS4gVGhpc1xuICAgKiBpcyBub3QgcmVjb21tZW5kZWQgYXMgaXQgY2FuIGhhdmUgdW5pbnRlbmRlZCBjb25zZXF1ZW5jZXMuIEl0IGlzXG4gICAqIHJlY29tbWVuZGVkIHRvIHVzZSBgcmVzZXRgIGluc3RlYWRcbiAgICpcbiAgICogQG1ldGhvZCBEaXJlY3RUeXBlTWFuYWdlciNjbGVhclxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheTxzdHJpbmc+fSBhbiBhcnJheSBvZiBjbGFzcyBuYW1lIFN0cmluZ3MgdGhhdCB3ZXJlIHJlbW92ZWRcbiAgICogd2hlbiBjbGVhcmVkLlxuICAgKi9cbiAgY2xlYXIoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgcmV0dXJuIGV4dHJhY3RCaXRzLkRJUkVDVF9UWVBFUy5zcGxpY2UoMCwgZXh0cmFjdEJpdHMuRElSRUNUX1RZUEVTLmxlbmd0aClcbiAgfSxcblxuICAvKipcbiAgICogVGhlIHJlY29tbWVuZGVkIHdheSB0byByZXNldCB0aGUgRElSRUNUX1RZUEVTIGxpc3QuIFRoaXMgcmVtb3ZlcyBhbGxcbiAgICogY2hhbmdlZCB2YWx1ZXMsIHJldHVybnMgdGhlIHJlbW92ZWQgYml0cywgYW5kIGFkZHMgYmFjayBpbiB0aGUgZGVmYXVsdHMuXG4gICAqXG4gICAqIEBtZXRob2QgRGlyZWN0VHlwZU1hbmFnZXIjcmVzZXRcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8c3RyaW5nPn0gYW4gYXJyYXkgb2YgY2xhc3MgbmFtZSBTdHJpbmdzIHRoYXQgd2VyZSByZW1vdmVkXG4gICAqIGR1cmluZyB0aGUgcmVzZXQgcHJvY2Vzcy5cbiAgICovXG4gIHJlc2V0KCk6IEFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiBleHRyYWN0Qml0cy5ESVJFQ1RfVFlQRVMuc3BsaWNlKFxuICAgICAgMCxcbiAgICAgIGV4dHJhY3RCaXRzLkRJUkVDVF9UWVBFUy5sZW5ndGgsXG4gICAgICBTdHJpbmcubmFtZVxuICAgIClcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgZGVjb3JhdG9yIGFsbG93cyB5b3UgdG8gYWRkIGEgQ2xhc3MgbWV0aG9kIHRvIHRoZSBEaXJlY3RUeXBlTWFuYWdlclxuICogYXMgYSBmdW5jdGlvbiB0aGF0IHNob3VsZCBub3QgYmUgaW52b2tlZCB3aXRoIHRoZSBgbmV3YCBrZXl3b3JkLiBGb3IgYWxsXG4gKiBpbnRlbnRzIGFuZCBwdXJwb3NlcyB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGRlY2xhcmVkIGBzdGF0aWNgLlxuICpcbiAqIEBtZXRob2QgRGlyZWN0VHlwZUFkZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gdGFyZ2V0IFtkZXNjcmlwdGlvbl1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgZnVuY3Rpb24gRGlyZWN0VHlwZUFkZCh0YXJnZXQpIHtcbiAgRGlyZWN0VHlwZU1hbmFnZXIuYWRkKHRhcmdldCk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogV2hlbiBhcHBseWluZyBtdWx0aXBsZSBwcm9wZXJ0eSBnZXR0ZXJzIGFuZCBzZXR0ZXJzLCBrbm93aW5nIHNvbWUgaW5mb1xuICogYWJvdXQgd2hhdCB3YXMgYXBwbGllZCBlbHNld2hlcmUgY2FuIGJlIGltcG9ydGFudC4gXCJUYWdzXCIgY2FuIGJlIGFwcGxpZWRcbiAqIHRoYXQgc3RvcmUgdGhlIGZpZWxkTmFtZSBhbmQgZGVzY3JpcHRvciBhcHBsaWVkIHZpYSBvbmUgb2YgdGhlc2UgZGVjb3JhdG9ycy5cbiAqXG4gKiBNdWx0aXBsZSBcInRhZ3NcIiBhcmUgc3VwcG9ydGVkIHRvIGFsbG93IGZvciBkZXRlY3RpbmcgdGhlIGRpZmZlcmVuY2UgYmV0d2VlblxuICogZGVjb3JhdG9ycyBhcHBsaWVkIGJ5IHRoZSBkZXZlbG9wZXIgdXNpbmcgbGF0dGljZSBhbmQgc29tZXRoaW5nIGF1dG9cbiAqIGdlbmVyYXRlZCBzdWNoIGFzIGF1dG8tcHJvcHMuXG4gKlxuICogQHBhcmFtICB7R1FMQmFzZX0gQ2xhc3MgYW4gaW5zdGFuY2Ugb2YgR1FMQmFzZSB0byBhcHBseSB0aGUgdGFncyB0cFxuICogQHBhcmFtICB7QXJyYXk8c3RyaW5nfFN5bWJvbD59IGFkZFRhZ3MgYW4gYXJyYXkgb2YgU3ltYm9scyBvciBzdHJpbmdzIHRvIGJlXG4gKiB3cmFwcGVkIGluIFN5bWJvbHMgdGhhdCB3aWxsIGJlIHVzZWQgYXMgdGFnIGtleXNcbiAqIEBwYXJhbSAge3N0cmluZ30gZmllbGROYW1lIHRoZSBuYW1lIG9mIHRoZSBmaWVsZCBiZWluZyBkZWNvcmF0ZWRcbiAqIEBwYXJhbSAge09iamVjdH0gZGVzY3JpcHRvciB0aGUgSmF2YVNjcmlwdCBkZXNjcmlwdG9yIG9iamVjdCB0byBhc3NvY2lhdGVcbiAqIHdpdGggdGhpcyB0YWdnZWQgZmllbGQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVRhZ3MoXG4gIENsYXNzOkdRTEJhc2UsXG4gIGFkZFRhZ3M6IEFycmF5PHN0cmluZ3xTeW1ib2w+LFxuICBmaWVsZE5hbWU6IHN0cmluZyxcbiAgZGVzY3JpcHRvcjogT2JqZWN0XG4pIHtcbiAgbGV0IHRhZ3MgPSAoQXJyYXkuaXNBcnJheShhZGRUYWdzKSAmJiBhZGRUYWdzIHx8IFtdKVxuICAgIC5tYXAodGFnID0+IHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnICYmIFN5bWJvbC5mb3IodGFnKSB8fCB0YWcpXG4gICAgLmZpbHRlcih0YWcgPT4gdHlwZW9mIHRhZyA9PT0gJ3N5bWJvbCcpXG5cbiAgdGFncy5mb3JFYWNoKHRhZyA9PiB7XG4gICAgQ2xhc3NbTUVUQV9LRVldW3RhZ10gPSBDbGFzc1tNRVRBX0tFWV1bdGFnXSB8fCB7fVxuICAgIENsYXNzW01FVEFfS0VZXVt0YWddW2ZpZWxkTmFtZV0gPSBkZXNjcmlwdG9yXG4gIH0pXG59XG5cbi8qKlxuICogV2hlbiB3b3JraW5nIHdpdGggYEdRTEJhc2VgIGluc3RhbmNlcyB0aGF0IGV4cG9zZSBwcm9wZXJ0aWVzXG4gKiB0aGF0IGhhdmUgYSAxOjEgbWFwcGluZyB0byB0aGVpciBvd24gbW9kZWwgcHJvcGVydHkgb2YgdGhlXG4gKiBzYW1lIG5hbWUsIGFkZGluZyB0aGUgZ2V0dGVycyBtYW51YWxseSBjYW4gYmUgYW5ub3lpbmcuIFRoaXNcbiAqIHRha2VzIGFuIGluZGV0ZXJtaW5hdGUgYW1vdW50IG9mIHN0cmluZ3MgcmVwcmVzZW50aW5nIHRoZVxuICogcHJvcGVydGllcyBmb3Igd2hpY2ggZ2V0dGVycyBzaG91bGQgYmUgaW5qZWN0ZWQuXG4gKlxuICogQGZ1bmN0aW9uIPCfj7fioIBHZXR0ZXJzXG4gKiBAbWVtYmVyb2YhIGRlY29yYXRvcnNcbiAqXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZ3xBcnJheTxTdHJpbmc+Pn0gcHJvcGVydHlOYW1lcyBpZiB0aGUgbW9kZWwgaGFzICduYW1lJ1xuICogYW5kICdhZ2UnIGFzIHByb3BlcnRpZXMsIHRoZW4gcGFzc2luZyB0aG9zZSB0d28gc3RyaW5ncyB3aWxsIHJlc3VsdFxuICogaW4gZ2V0dGVycyB0aGF0IHN1cmZhY2UgdGhvc2UgcHJvcGVydGllcyBhcyBHcmFwaFFMIGZpZWxkcy5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGNsYXNzIGRlY29yYXRvciBtZXRob2Quc1xuICovXG5leHBvcnQgZnVuY3Rpb24gR2V0dGVycyhcbiAgLi4ucHJvcGVydHlOYW1lczogQXJyYXk8U3RyaW5nfEFycmF5PFN0cmluZ3xGdW5jdGlvbj4+XG4pOiBGdW5jdGlvbiB7XG4gIHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IG1peGVkLCBhZGRUYWdzOiBBcnJheTxzdHJpbmd8U3ltYm9sPiA9IFtdKTogbWl4ZWQge1xuICAgIGZvciAobGV0IHByb3BlcnR5IG9mIHByb3BlcnR5TmFtZXMpIHtcbiAgICAgIGxldCB7IGZpZWxkTmFtZSwgZ2V0dGVyTWFrZXIgfSA9IGV4dHJhY3RCaXRzKHByb3BlcnR5KTtcbiAgICAgIGxldCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQucHJvdG90eXBlLCBmaWVsZE5hbWUpXG4gICAgICBsZXQgaGFzSW1wbCA9IGRlc2MgJiYgKGRlc2MuZ2V0IHx8IHR5cGVvZiBkZXNjLnZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgbGV0IHRhZ3MgPSBbR0VUVEVSU10uY29uY2F0KEFycmF5LmlzQXJyYXkoYWRkVGFncykgJiYgYWRkVGFncyB8fCBbXSlcblxuICAgICAgaWYgKCFoYXNJbXBsKSB7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0ge1xuICAgICAgICAgIGdldDogZ2V0dGVyTWFrZXIoKVxuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHlUYWdzKHRhcmdldCwgdGFncywgZmllbGROYW1lLCBkZXNjcmlwdG9yKVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LnByb3RvdHlwZSwgZmllbGROYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYFNraXBwaW5nIGdldHRlciBmb3IgJHt0YXJnZXQubmFtZX0uJHtmaWVsZE5hbWV9OyBhbHJlYWR5IGV4aXN0c2BcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBXaGVuIHdvcmtpbmcgd2l0aCBgR1FMQmFzZWAgaW5zdGFuY2VzIHRoYXQgZXhwb3NlIHByb3BlcnRpZXNcbiAqIHRoYXQgaGF2ZSBhIDE6MSBtYXBwaW5nIHRvIHRoZWlyIG93biBtb2RlbCBwcm9wZXJ0eSBvZiB0aGVcbiAqIHNhbWUgbmFtZSwgYWRkaW5nIHRoZSBzZXR0ZXJzIG1hbnVhbGx5IGNhbiBiZSBhbm5veWluZy4gVGhpc1xuICogdGFrZXMgYW4gaW5kZXRlcm1pbmF0ZSBhbW91bnQgb2Ygc3RyaW5ncyByZXByZXNlbnRpbmcgdGhlXG4gKiBwcm9wZXJ0aWVzIGZvciB3aGljaCBzZXR0ZXJzIHNob3VsZCBiZSBpbmplY3RlZC5cbiAqXG4gKiBAZnVuY3Rpb24g8J+Pt+KggFNldHRlcnNcbiAqIEBtZW1iZXJvZiEgZGVjb3JhdG9yc1xuICogQHNpbmNlIDIuMS4wXG4gKlxuICogQHBhcmFtIHtBcnJheTxTdHJpbmd8QXJyYXk8U3RyaW5nPj59IHByb3BlcnR5TmFtZXMgaWYgdGhlIG1vZGVsIGhhc1xuICogJ25hbWUnIGFuZCAnYWdlJyBhcyBwcm9wZXJ0aWVzLCB0aGVuIHBhc3NpbmcgdGhvc2UgdHdvIHN0cmluZ3Mgd2lsbFxuICogcmVzdWx0IGluIHNldHRlcnMgdGhhdCBzdXJmYWNlIHRob3NlIHByb3BlcnRpZXMgYXMgR3JhcGhRTCBmaWVsZHMuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBjbGFzcyBkZWNvcmF0b3IgbWV0aG9kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTZXR0ZXJzKFxuICAuLi5wcm9wZXJ0eU5hbWVzOiBBcnJheTxTdHJpbmd8QXJyYXk8U3RyaW5nfEZ1bmN0aW9uPj5cbik6IEZ1bmN0aW9uIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogbWl4ZWQsIGFkZFRhZ3M6IEFycmF5PFN0cmluZ3xTeW1ib2w+ID0gW10pOiBtaXhlZCB7XG4gICAgZm9yIChsZXQgcHJvcGVydHkgb2YgcHJvcGVydHlOYW1lcykge1xuICAgICAgbGV0IHsgZmllbGROYW1lLCBzZXR0ZXJNYWtlciB9ID0gZXh0cmFjdEJpdHMocHJvcGVydHkpO1xuICAgICAgbGV0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldC5wcm90b3R5cGUsIGZpZWxkTmFtZSlcbiAgICAgIGxldCBoYXNJbXBsID0gZGVzYyAmJiAoZGVzYy5nZXQgfHwgdHlwZW9mIGRlc2MudmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICBsZXQgdGFncyA9IFtTRVRURVJTXS5jb25jYXQoQXJyYXkuaXNBcnJheShhZGRUYWdzKSAmJiBhZGRUYWdzIHx8IFtdKVxuXG4gICAgICBpZiAoIWhhc0ltcGwpIHtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSB7XG4gICAgICAgICAgc2V0OiBzZXR0ZXJNYWtlcigpXG4gICAgICAgIH1cblxuICAgICAgICBhcHBseVRhZ3ModGFyZ2V0LCB0YWdzLCBmaWVsZE5hbWUsIGRlc2NyaXB0b3IpXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQucHJvdG90eXBlLCBmaWVsZE5hbWUsIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgU2tpcHBpbmcgc2V0dGVyIGZvciAke3RhcmdldC5uYW1lfS4ke2ZpZWxkTmFtZX07IGFscmVhZHkgZXhpc3RzYFxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxufVxuXG4vKipcbiAqIFdoZW4gd29ya2luZyB3aXRoIGBHUUxCYXNlYCBpbnN0YW5jZXMgdGhhdCBleHBvc2UgcHJvcGVydGllc1xuICogdGhhdCBoYXZlIGEgMToxIG1hcHBpbmcgdG8gdGhlaXIgb3duIG1vZGVsIHByb3BlcnR5IG9mIHRoZVxuICogc2FtZSBuYW1lLCBhZGRpbmcgdGhlIGdldHRlcnMgbWFudWFsbHkgY2FuIGJlIGFubm95aW5nLiBUaGlzXG4gKiB0YWtlcyBhbiBpbmRldGVybWluYXRlIGFtb3VudCBvZiBzdHJpbmdzIHJlcHJlc2VudGluZyB0aGVcbiAqIHByb3BlcnRpZXMgZm9yIHdoaWNoIGdldHRlcnMgc2hvdWxkIGJlIGluamVjdGVkLlxuICpcbiAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYm90aCBnZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gKlxuICogQGZ1bmN0aW9uIPCfj7fioIBQcm9wZXJ0aWVzXG4gKiBAbWVtYmVyb2YhIGRlY29yYXRvcnNcbiAqIEBzaW5jZSAyLjEuMFxuICpcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nfEFycmF5PFN0cmluZz4+fSBwcm9wZXJ0eU5hbWVzIGlmIHRoZSBtb2RlbCBoYXMgJ25hbWUnXG4gKiBhbmQgJ2FnZScgYXMgcHJvcGVydGllcywgdGhlbiBwYXNzaW5nIHRob3NlIHR3byBzdHJpbmdzIHdpbGwgcmVzdWx0XG4gKiBpbiBnZXR0ZXJzIGFuZCBzZXR0ZXJzIHRoYXQgc3VyZmFjZSB0aG9zZSBwcm9wZXJ0aWVzIGFzIEdyYXBoUUwgZmllbGRzLlxuICogQHJldHVybiB7RnVuY3Rpb259IGEgY2xhc3MgZGVjb3JhdG9yIG1ldGhvZFxuICovXG5leHBvcnQgZnVuY3Rpb24gUHJvcGVydGllcyhcbiAgLi4ucHJvcGVydHlOYW1lczogQXJyYXk8U3RyaW5nfEFycmF5PFN0cmluZ3xGdW5jdGlvbj4+XG4pOiBGdW5jdGlvbiB7XG4gIHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IG1peGVkLCBhZGRUYWdzOiBBcnJheTxTdHJpbmd8U3ltYm9sPiA9IFtdKTogbWl4ZWQge1xuICAgIGZvciAobGV0IHByb3BlcnR5IG9mIHByb3BlcnR5TmFtZXMpIHtcbiAgICAgIGxldCB7ZmllbGROYW1lLCBnZXR0ZXJNYWtlciwgc2V0dGVyTWFrZXIgfSA9IGV4dHJhY3RCaXRzKHByb3BlcnR5KTtcbiAgICAgIGxldCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQucHJvdG90eXBlLCBmaWVsZE5hbWUpXG4gICAgICBsZXQgaGFzSW1wbCA9IGRlc2MgJiYgKGRlc2MuZ2V0IHx8IHR5cGVvZiBkZXNjLnZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgbGV0IHRhZ3MgPSBbUFJPUFNdLmNvbmNhdChBcnJheS5pc0FycmF5KGFkZFRhZ3MpICYmIGFkZFRhZ3MgfHwgW10pXG5cbiAgICAgIGlmICghaGFzSW1wbCkge1xuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IHtcbiAgICAgICAgICBzZXQ6IHNldHRlck1ha2VyKCksXG4gICAgICAgICAgZ2V0OiBnZXR0ZXJNYWtlcigpXG4gICAgICAgIH1cblxuICAgICAgICBhcHBseVRhZ3ModGFyZ2V0LCB0YWdzLCBmaWVsZE5hbWUsIGRlc2NyaXB0b3IpXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQucHJvdG90eXBlLCBmaWVsZE5hbWUsIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgU2tpcHBpbmcgcHJvcGVydGllcyBmb3IgJHt0YXJnZXQubmFtZX0uJHtmaWVsZE5hbWV9OyBhbHJlYWR5IGV4aXN0c2BcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvcGVydGllcztcbiJdfQ==