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
 * GraphQL Enum types can be a bit picky when it comes to how scalar types 
 * equate to enum values. Lattice makes this easier by allowing you to specify 
 * a value or the key when your enum has a value other than the key; GraphQL 
 * does not allow this by default.
 *
 * Further more, when instantiating a GQLEnum type, you can pass a string or 
 * value matching the enum key or value or you can pass an object with key of 
 * value and the value being either the enum key or value. If any of those
 * things match, then your `instance.value` will equate to the enum's key. If,
 * on the other hand, your supplied values do not match then `instance.value` 
 * will be `null`.
 *
 * @class GQLEnum
 */
@Getters('symbol')
export class GQLEnum extends GQLBase {
  constructor(enumValueOrKey: ?Object, requestData: ?Object) {
    super({}, requestData)

    const Class = this.constructor
    const enums = Class.enums;
    let symbol;
    let enumVK: (Object | string) = enumValueOrKey || null

    symbol = enums[enumVK] || enumVK && enums[enumVK.value] || null

    Object.assign(this.getModel(), {
      name: symbol ? symbol.name : null,
      value: symbol ? symbol.value : null,
      symbol: symbol ? symbol : null
    })
  }
  
  /**
   * Retrieves the actual symbol stored name property from the internal 
   * model object for this enum instance. That is a mouthfull, but it 
   * basically means that if your enum is something like:
   * 
   * ```
   * enum Person { TALL, SHORT }
   * ```
   * 
   * and you create an instance using any of the following
   * 
   * ```
   * p = new Person('TALL')
   * p = new Person(valueFor('TALL'))
   * p = new Person({value: 'TALL'})
   * ```
   * 
   * that your response to `p.name` will equate to `TALL`.
   *
   * @method ⬇︎⠀name
   * @return {mixed} typically a String but any valid type supplied
   */
  get name() {
    const name = this.getModel().name
    
    return (
      name !== undefined &&
      name !== null && 
      name !== NaN 
    ) ? name : null;
  }

  /**
   * Much like the `.name` getter, the `.value` getter will typically 
   * retreive the name of the enum key you are requesting. In rare cases 
   * where you have defined values that differ from the name, the `.value`
   * getter will retrieve that custom value from the `.value` property on 
   * the symbol in question.
   *
   * This should do the right thing even if you instantiated the instance 
   * using the name. 
   *
   * @memberof GQLEnum
   * @method ⬇︎⠀value
   * @return {mixed} the value of the enum type; this in all likihood should 
   * be a String or potentially an object
   */
  get value() {
    const value = this.getModel().value
    
    return (
      value !== undefined &&
      value !== null && 
      value !== NaN 
    ) ? value : null;
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
      const map = new Map();
      const ast = parse((this.SCHEMA: any));
      const array = new Proxy([], GQLEnum.GenerateEnumsProxyHandler(map));
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
        symObj.name = defKey
        symObj.sym = symObj.valueOf()
        
        map.set(symObj.name, symObj)
        map.set(symObj.value, symObj)
        
        // This bit of logic allows us to look into the "enums" property and 
        // get the generated Object wrapped Symbol with keys and values by 
        // supplying either a key or value.
        array.push(symObj)
      }
      
      // @ComputedType
      this[ENUMS] = array;
    }

    // @ComputedType
    return this[ENUMS];
  }
  
  /**
   * Due to the complexity of being able to access both the keys and values 
   * properly for an enum type, a Map is used as the backing store. The handler 
   * returned by this method is to be passed to a Proxy.
   *
   * @method GenerateEnumsProxyHandler
   * @static 
   * 
   * @param {Map} map the map containing the key<->value and 
   * value<->key mappings; the true storage backing the array in question.
   * @return {Object}
   */
  static GenerateEnumsProxyHandler(map: Map) {
    return {
      get(obj, key) {
        if (map.has(key)) {
          return map.get(key)
        }

        return obj[key]
      } 
    }
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
