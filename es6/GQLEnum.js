/**
 @namespace GQLInterface
 @flow
 */

import { GQLBase } from './GQLBase'
import { GraphQLEnumType, parse } from 'graphql'
import { Getters } from './decorators/ModelProperties'

/* Internal Symbol referring to real accessor to GQLBase model object */
const _MODEL_KEY = Symbol.for('data-model-contents-value');

/* Internal Symbol referring to the static object containing a proxy handler */
const _PROXY_HANDLER = Symbol.for('internal-base-proxy-handler')

/* Internal Symbol property referring to the mapping of values on the GQLEnum */
const ENUMS = Symbol();

/**
 * TODO finish comment
 *
 * @class GQLEnum
 */
@Getters(['value', String])
export class GQLEnum extends GQLBase {
  constructor(enumValueOrKey: ?Object, requestData: ?Object) {
    super({}, requestData)

    const Class = this.constructor
    const enums = Class.enums;
    let symbol;
    let enumVK: (Object | string) = enumValueOrKey || 'undefined'

    for (let property of [
      enumVK,
      String(enumVK && enumVK.value && enumVK.value),
      String(enumVK)
    ]) {      
      // @ComputedType
      if (property in enums) {        
        // @ComputedType
        symbol = enums[property]
        break;
      }
    }

    if (symbol) {
      Object.assign(this.getModel(), {
        name: symbol.name,
        value: symbol.value,
        symbol: symbol
      })
    }
  }

  /**
   * Determines the default type targeted by this GQLBase class. Any
   * type will technically be valid but only will trigger special behavior
   *
   * @memberof GQLEnum
   * @method ⬇︎⠀GQL_TYPE
   * @static
   * @const
   *
   * @return {Function} a type, such as `GraphQLObjectType` or
   * `GraphQLInterfaceType`
   */
  static get GQL_TYPE(): Function {
    return GraphQLEnumType;
  }

  /**
   * Each instance of GQLEnum must specify a map of keys and values. If this
   * method returns null or is not defined, the value of the enum will match
   * the name of the enum as per the reference implementation.
   *
   * Example:
   * ```
   *   static get values(): ?Object {
   *     const { valueOf } = this;
   *
   *     return {
   *       NAME: valueOf(value)
   *     }
   *   }
   * ```
   *
   * @method ⬇︎⠀values
   * @memberof GQLEnum
   * @static
   *
   * @return {Object|Null} an object mapping with each key mapping to an object
   * possessing at least a value field, which in turn maps to the desired value
   */
  static get values(): Object {
    return {};
  }

  /**
   * Shorthand method to generate a GraphQLEnumValueDefinition implementation
   * object. Use this for building and customizing your `values` key/value
   * object in your child classes.
   *
   * @memberof GQLEnum
   * @method valueFor
   * @static
   *
   * @param {mixed} value any nonstandard value you wish your enum to have
   * @param {String} deprecationReason an optional reason to deprecate an enum
   * @param {String} description a non Lattice standard way to write a comment
   * @return {Object} an object that conforms to the GraphQLEnumValueDefinition
   * defined here http://graphql.org/graphql-js/type/#graphqlenumtype
   */
  static valueFor(
    value: mixed,
    deprecationReason: ?string,
    description: ?string
  ): Object {
    const result: Object = { value }

    if (deprecationReason) { result.deprecationReason = deprecationReason }
    if (description) { result.description = description }

    return result;
  }

  /**
   * For easier use within JavaScript, the static enums method provides a
   * Symbol backed solution for each of the enums defined. Each `Symbol`
   * instance is wrapped in Object so as to allow some additional properties
   * to be written to it.
   *
   * @memberof GQLEnum
   * @method ⬇︎⠀enums
   * @static
   *
   * @return {Array<Symbol>} an array of modified Symbols for each enum
   * variation defined.
   */
  static get enums(): Array<Symbol> {
    // @ComputedType
    if (!this[ENUMS]) {
      const ast = parse((this.SCHEMA: any));
      const array = [];
      const values = this.values || {};      
      let astValues: Array<any>;
      
      try {
        // TODO: $FlowFixMe
        astValues = ast.definitions[0].values; 
      }
      catch (error) {
        console.error('Unable to discern the values from your enums SCHEMA')
        throw error;
      }

      // Walk the AST for the class' schema and extract the names (same as 
      // values when specified in GraphQL SDL) and build an object the has 
      // the actual defined value and the AST generated name/value. 
      for (let enumDef of astValues) {
        let defKey = enumDef.name.value;
        let symObj: Object = Object(Symbol.for(defKey));

        symObj.value = (values[defKey] && values[defKey].value) || defKey;
        symObj.name = defKey;
        symObj.sym = symObj.valueOf()

        // This bit of logic allows us to look into the "enums" property and 
        // get the generated Object wrapped Symbol with keys and values by 
        // supplying either a key or value.
        array.push(symObj)
        
        // @ComputedType
        array[defKey] = symObj;
        
        // @ComputedType
        array[symObj.value] = symObj;
      }
      
      // @ComputedType
      this[ENUMS] = array;
    }

    // @ComputedType
    return this[ENUMS];
  }

  /** @inheritdoc */
  static apiDocs(): Object {
    const { DOC_CLASS, DOC_FIELDS, joinLines } = this;

    return {
      [DOC_CLASS]: joinLines`
        GQLEnums allow the definition of enum types with description fields
        and values other than a 1:1 mapping of their types and their type
        names. If you are reading this, the implementor likely did not
        contribute comments for their type.
      `
    }
  }
}
