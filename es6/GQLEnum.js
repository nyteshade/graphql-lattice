/**
 @namespace GQLInterface
 @flow
 */

import { GQLBase } from './GQLBase'
import { GraphQLEnumType, parse } from 'graphql'

const ENUMS = Symbol();

export class GQLEnum extends GQLBase {
  constructor(enumValueOrKey: ?mixed, requestData: ?Object) {
    super({}, requestData)

    const Class = this.constructor
    const enums = Class.enums();
    let symbol;

    if (enums.nameToSymbol.has(enumValueOrKey)) {
      symbol = enums.nameToSymbol.get(enumValueOrKey);
    }
    else if (enums.valueToSymbol.has(enumValueOrKey)) {
      symbol = enums.valueToSymbol.get(enumValueOrKey);
    }

    if (symbol) {
      Object.assign(this.getModel(), {
        name: symbol.name,
        value: symbol.value,
        symbol: symbol
      })
    }

    console.log(this.model)
  }

  [Symbol.toPrimitive]() {
    return this.model.name;
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
   *   static values(): ?Object {
   *     const { valueOf } = this;
   *
   *     return {
   *       NAME: valueOf(value)
   *     }
   *   }
   * ```
   *
   * @method values
   * @memberof GQLEnum
   * @static
   *
   * @return {Object|Null} an object mapping with each key mapping to an object
   * possessing at least a value field, which in turn maps to the desired value
   */
  static values(): Object {
    return {};
  }

  /**
   * Shorthand method to generate a GraphQLEnumValueDefinition implementation
   * object. Use this for building and customizing your `values()` key/value
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
    const result = { value }

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
   * @method enums
   * @static
   *
   * @return {Array<Symbol>} an array of modified Symbols for each enum
   * variation defined.
   */
  static enums(): Array<Symbol> {
    if (!this[ENUMS]) {
      const ast = parse(this.SCHEMA);
      const array = [];

      array.nameToSymbol = new Map();
      array.valueToSymbol = new WeakMap();

      for (let enumDef of ast.definitions[0].values) {
        let symObj = Object(Symbol.for(enumDef.name.value));

        symObj.value = this.values()[enumDef.name.value] || enumDef.name.value;
        symObj.name = enumDef.name.value;
        symObj.sym = symObj.valueOf()

        array.push(symObj)
        array.nameToSymbol.set(symObj.name, symObj)
        array.valueToSymbol.set(symObj.value, symObj)
      }

      this[ENUMS] = array;
    }

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
