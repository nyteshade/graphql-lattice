"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLEnum = void 0;

require("core-js/modules/es7.symbol.async-iterator");

var _GQLBase = require("./GQLBase");

var _graphql = require("graphql");

var _ModelProperties = require("./decorators/ModelProperties");

var _utils = require("./utils");

var _dec, _class;

/* Internal Symbol referring to real accessor to GQLBase model object */
const _MODEL_KEY = Symbol.for('data-model-contents-value');
/* Internal Symbol referring to the static object containing a proxy handler */


const _PROXY_HANDLER = Symbol.for('internal-base-proxy-handler');
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

let GQLEnum = (_dec = (0, _ModelProperties.Getters)('symbol'), _dec(_class = class GQLEnum extends _GQLBase.GQLBase {
  constructor(enumValueOrKey, requestData) {
    super({}, requestData);
    const Class = this.constructor;
    const enums = Class.enums;
    let symbol;
    let enumVK = enumValueOrKey || null; // @ComputedType

    symbol = enums[enumVK] || enumVK && enums[enumVK.value] || null;
    Object.assign(this.getModel(), {
      name: symbol ? symbol.name : null,
      value: symbol ? symbol.value : null,
      symbol: symbol ? symbol : null
    });
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
   * @memberof GQLEnum
   * @return {mixed} typically a String but any valid type supplied
   */


  get name() {
    const name = this.getModel().name;
    return name !== undefined && name !== null && name !== NaN ? name : null;
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
    const value = this.getModel().value;
    return value !== undefined && value !== null && value !== NaN ? value : null;
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


  static get GQL_TYPE() {
    return _graphql.GraphQLEnumType;
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


  static get values() {
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


  static valueFor(value, deprecationReason, description) {
    const result = {
      value
    };

    if (deprecationReason) {
      result.deprecationReason = deprecationReason;
    }

    if (description) {
      result.description = description;
    }

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


  static get enums() {
    // @ComputedType
    if (!this[ENUMS]) {
      const map = new Map();
      const ast = (0, _graphql.parse)(this.SCHEMA);
      const array = new Proxy([], GQLEnum.GenerateEnumsProxyHandler(map));
      const values = this.values || {};
      let astValues;

      try {
        // TODO: $FlowFixMe
        astValues = ast.definitions[0].values;
      } catch (error) {
        _utils.LatticeLogs.error('Unable to discern the values from your enums SCHEMA');

        _utils.LatticeLogs.error(error);

        throw error;
      } // Walk the AST for the class' schema and extract the names (same as
      // values when specified in GraphQL SDL) and build an object the has
      // the actual defined value and the AST generated name/value.


      for (let enumDef of astValues) {
        let defKey = enumDef.name.value;
        let symObj = Object(Symbol.for(defKey));
        symObj.value = values[defKey] && values[defKey].value || defKey;
        symObj.name = defKey;
        symObj.sym = symObj.valueOf();
        map.set(symObj.name, symObj);
        map.set(symObj.value, symObj); // This bit of logic allows us to look into the "enums" property and
        // get the generated Object wrapped Symbol with keys and values by
        // supplying either a key or value.

        array.push(symObj);
      } // @ComputedType


      this[ENUMS] = array;
    } // @ComputedType


    return this[ENUMS];
  }
  /**
   * Due to the complexity of being able to access both the keys and values
   * properly for an enum type, a Map is used as the backing store. The handler
   * returned by this method is to be passed to a Proxy.
   *
   * @method GQLEnum#GenerateEnumsProxyHandler
   * @static
   *
   * @param {Map} map the map containing the key<->value and
   * value<->key mappings; the true storage backing the array in question.
   * @return {Object}
   */


  static GenerateEnumsProxyHandler(map) {
    return {
      /**
       * Get handler for the Map backed Array Proxy
       *
       * @memberof! GQLEnum
       * @method get
       *
       * @param {mixed} obj the object targeted by the Proxy
       * @param {string} key `key` of the value being requested
       * @return {mixed} the `value` being requested
       */
      get(obj, key) {
        if (map.has(key)) {
          return map.get(key);
        }

        return obj[key];
      },

      /**
       * Set handler for the Map backed Array Proxy.
       *
       * @memberof! GQLEnum
       * @method set
       *
       * @param {mixed} obj the object the Proxy is targeting
       * @param {string} key a string `key` being set
       * @param {mixed} value the `value` being assigned to `key`
       */
      set(obj, key, value) {
        if (isFinite(key) && value instanceof Symbol) {
          map.set(value.name, value);
          map.set(value.value, value);
        } // Some accessor on the receiving array


        obj[key] = value; // Arrays return length when pushing. Assume value as return
        // otherwise. ¯\_(ツ)_/¯

        return isFinite(key) ? obj.length : obj[key];
      }

    };
  }
  /** @inheritdoc */


  static apiDocs() {
    const {
      DOC_CLASS,
      DOC_FIELDS,
      joinLines
    } = this;
    return {
      [DOC_CLASS]: joinLines`
        GQLEnums allow the definition of enum types with description fields
        and values other than a 1:1 mapping of their types and their type
        names. If you are reading this, the implementor likely did not
        contribute comments for their type.
      `
    };
  }

}) || _class);
exports.GQLEnum = GQLEnum;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxFbnVtLmpzIl0sIm5hbWVzIjpbIl9NT0RFTF9LRVkiLCJTeW1ib2wiLCJmb3IiLCJfUFJPWFlfSEFORExFUiIsIkVOVU1TIiwiR1FMRW51bSIsIkdRTEJhc2UiLCJjb25zdHJ1Y3RvciIsImVudW1WYWx1ZU9yS2V5IiwicmVxdWVzdERhdGEiLCJDbGFzcyIsImVudW1zIiwic3ltYm9sIiwiZW51bVZLIiwidmFsdWUiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRNb2RlbCIsIm5hbWUiLCJ1bmRlZmluZWQiLCJOYU4iLCJHUUxfVFlQRSIsIkdyYXBoUUxFbnVtVHlwZSIsInZhbHVlcyIsInZhbHVlRm9yIiwiZGVwcmVjYXRpb25SZWFzb24iLCJkZXNjcmlwdGlvbiIsInJlc3VsdCIsIm1hcCIsIk1hcCIsImFzdCIsIlNDSEVNQSIsImFycmF5IiwiUHJveHkiLCJHZW5lcmF0ZUVudW1zUHJveHlIYW5kbGVyIiwiYXN0VmFsdWVzIiwiZGVmaW5pdGlvbnMiLCJlcnJvciIsImxsIiwiZW51bURlZiIsImRlZktleSIsInN5bU9iaiIsInN5bSIsInZhbHVlT2YiLCJzZXQiLCJwdXNoIiwiZ2V0Iiwib2JqIiwia2V5IiwiaGFzIiwiaXNGaW5pdGUiLCJsZW5ndGgiLCJhcGlEb2NzIiwiRE9DX0NMQVNTIiwiRE9DX0ZJRUxEUyIsImpvaW5MaW5lcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBS0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTtBQUNBLE1BQU1BLFVBQVUsR0FBR0MsTUFBTSxDQUFDQyxHQUFQLENBQVcsMkJBQVgsQ0FBbkI7QUFFQTs7O0FBQ0EsTUFBTUMsY0FBYyxHQUFHRixNQUFNLENBQUNDLEdBQVAsQ0FBVyw2QkFBWCxDQUF2QjtBQUVBOzs7QUFDQSxNQUFNRSxLQUFLLEdBQUdILE1BQU0sRUFBcEI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztJQWdCYUksTyxXQURaLDhCQUFRLFFBQVIsQyxnQkFBRCxNQUNhQSxPQURiLFNBQzZCQyxn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TixFQUFXO0FBQ1osWUFBSXBCLEdBQUcsQ0FBQ3FCLEdBQUosQ0FBUUQsR0FBUixDQUFKLEVBQWtCO0FBQ2hCLGlCQUFPcEIsR0FBRyxDQUFDa0IsR0FBSixDQUFRRSxHQUFSLENBQVA7QUFDRDs7QUFFRCxlQUFPRCxHQUFHLENBQUNDLEdBQUQsQ0FBVjtBQUNELE9BakJJOztBQW1CTDs7Ozs7Ozs7OztBQVVBSixNQUFBQSxHQUFHLENBQUNHLEdBQUQsRUFBTUMsR0FBTixFQUFXbEMsS0FBWCxFQUFrQjtBQUNuQixZQUFJb0MsUUFBUSxDQUFDRixHQUFELENBQVIsSUFBaUJsQyxLQUFLLFlBQVliLE1BQXRDLEVBQThDO0FBQzVDMkIsVUFBQUEsR0FBRyxDQUFDZ0IsR0FBSixDQUFROUIsS0FBSyxDQUFDSSxJQUFkLEVBQW9CSixLQUFwQjtBQUNBYyxVQUFBQSxHQUFHLENBQUNnQixHQUFKLENBQVE5QixLQUFLLENBQUNBLEtBQWQsRUFBcUJBLEtBQXJCO0FBQ0QsU0FKa0IsQ0FNbkI7OztBQUNBaUMsUUFBQUEsR0FBRyxDQUFDQyxHQUFELENBQUgsR0FBV2xDLEtBQVgsQ0FQbUIsQ0FTbkI7QUFDQTs7QUFDQSxlQUFPb0MsUUFBUSxDQUFDRixHQUFELENBQVIsR0FBZ0JELEdBQUcsQ0FBQ0ksTUFBcEIsR0FBNkJKLEdBQUcsQ0FBQ0MsR0FBRCxDQUF2QztBQUNEOztBQXpDSSxLQUFQO0FBMkNEO0FBRUQ7OztBQUNBLFNBQU9JLE9BQVAsR0FBeUI7QUFDdkIsVUFBTTtBQUFFQyxNQUFBQSxTQUFGO0FBQWFDLE1BQUFBLFVBQWI7QUFBeUJDLE1BQUFBO0FBQXpCLFFBQXVDLElBQTdDO0FBRUEsV0FBTztBQUNMLE9BQUNGLFNBQUQsR0FBYUUsU0FBVTs7Ozs7O0FBRGxCLEtBQVA7QUFRRDs7QUF0UmtDLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiBAbmFtZXNwYWNlIEdRTEludGVyZmFjZVxuIEBmbG93XG4gKi9cblxuaW1wb3J0IHsgR1FMQmFzZSB9IGZyb20gJy4vR1FMQmFzZSdcbmltcG9ydCB7IEdyYXBoUUxFbnVtVHlwZSwgcGFyc2UgfSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IHsgR2V0dGVycyB9IGZyb20gJy4vZGVjb3JhdG9ycy9Nb2RlbFByb3BlcnRpZXMnXG5pbXBvcnQgeyBMYXR0aWNlTG9ncyBhcyBsbCB9IGZyb20gJy4vdXRpbHMnXG5cbi8qIEludGVybmFsIFN5bWJvbCByZWZlcnJpbmcgdG8gcmVhbCBhY2Nlc3NvciB0byBHUUxCYXNlIG1vZGVsIG9iamVjdCAqL1xuY29uc3QgX01PREVMX0tFWSA9IFN5bWJvbC5mb3IoJ2RhdGEtbW9kZWwtY29udGVudHMtdmFsdWUnKTtcblxuLyogSW50ZXJuYWwgU3ltYm9sIHJlZmVycmluZyB0byB0aGUgc3RhdGljIG9iamVjdCBjb250YWluaW5nIGEgcHJveHkgaGFuZGxlciAqL1xuY29uc3QgX1BST1hZX0hBTkRMRVIgPSBTeW1ib2wuZm9yKCdpbnRlcm5hbC1iYXNlLXByb3h5LWhhbmRsZXInKVxuXG4vKiBJbnRlcm5hbCBTeW1ib2wgcHJvcGVydHkgcmVmZXJyaW5nIHRvIHRoZSBtYXBwaW5nIG9mIHZhbHVlcyBvbiB0aGUgR1FMRW51bSAqL1xuY29uc3QgRU5VTVMgPSBTeW1ib2woKTtcblxuLyoqXG4gKiBHcmFwaFFMIEVudW0gdHlwZXMgY2FuIGJlIGEgYml0IHBpY2t5IHdoZW4gaXQgY29tZXMgdG8gaG93IHNjYWxhciB0eXBlc1xuICogZXF1YXRlIHRvIGVudW0gdmFsdWVzLiBMYXR0aWNlIG1ha2VzIHRoaXMgZWFzaWVyIGJ5IGFsbG93aW5nIHlvdSB0byBzcGVjaWZ5XG4gKiBhIHZhbHVlIG9yIHRoZSBrZXkgd2hlbiB5b3VyIGVudW0gaGFzIGEgdmFsdWUgb3RoZXIgdGhhbiB0aGUga2V5OyBHcmFwaFFMXG4gKiBkb2VzIG5vdCBhbGxvdyB0aGlzIGJ5IGRlZmF1bHQuXG4gKlxuICogRnVydGhlciBtb3JlLCB3aGVuIGluc3RhbnRpYXRpbmcgYSBHUUxFbnVtIHR5cGUsIHlvdSBjYW4gcGFzcyBhIHN0cmluZyBvclxuICogdmFsdWUgbWF0Y2hpbmcgdGhlIGVudW0ga2V5IG9yIHZhbHVlIG9yIHlvdSBjYW4gcGFzcyBhbiBvYmplY3Qgd2l0aCBrZXkgb2ZcbiAqIHZhbHVlIGFuZCB0aGUgdmFsdWUgYmVpbmcgZWl0aGVyIHRoZSBlbnVtIGtleSBvciB2YWx1ZS4gSWYgYW55IG9mIHRob3NlXG4gKiB0aGluZ3MgbWF0Y2gsIHRoZW4geW91ciBgaW5zdGFuY2UudmFsdWVgIHdpbGwgZXF1YXRlIHRvIHRoZSBlbnVtJ3Mga2V5LiBJZixcbiAqIG9uIHRoZSBvdGhlciBoYW5kLCB5b3VyIHN1cHBsaWVkIHZhbHVlcyBkbyBub3QgbWF0Y2ggdGhlbiBgaW5zdGFuY2UudmFsdWVgXG4gKiB3aWxsIGJlIGBudWxsYC5cbiAqXG4gKiBAY2xhc3MgR1FMRW51bVxuICovXG5AR2V0dGVycygnc3ltYm9sJylcbmV4cG9ydCBjbGFzcyBHUUxFbnVtIGV4dGVuZHMgR1FMQmFzZSB7XG4gIGNvbnN0cnVjdG9yKGVudW1WYWx1ZU9yS2V5OiA/T2JqZWN0LCByZXF1ZXN0RGF0YTogP09iamVjdCkge1xuICAgIHN1cGVyKHt9LCByZXF1ZXN0RGF0YSlcblxuICAgIGNvbnN0IENsYXNzID0gdGhpcy5jb25zdHJ1Y3RvclxuICAgIGNvbnN0IGVudW1zID0gQ2xhc3MuZW51bXM7XG4gICAgbGV0IHN5bWJvbDtcbiAgICBsZXQgZW51bVZLOiAoT2JqZWN0IHwgc3RyaW5nIHwgbnVsbCkgPSBlbnVtVmFsdWVPcktleSB8fCBudWxsXG5cbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgc3ltYm9sID0gZW51bXNbZW51bVZLXSB8fCBlbnVtVksgJiYgZW51bXNbZW51bVZLLnZhbHVlXSB8fCBudWxsXG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZ2V0TW9kZWwoKSwge1xuICAgICAgbmFtZTogc3ltYm9sID8gc3ltYm9sLm5hbWUgOiBudWxsLFxuICAgICAgdmFsdWU6IHN5bWJvbCA/IHN5bWJvbC52YWx1ZSA6IG51bGwsXG4gICAgICBzeW1ib2w6IHN5bWJvbCA/IHN5bWJvbCA6IG51bGxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgYWN0dWFsIHN5bWJvbCBzdG9yZWQgbmFtZSBwcm9wZXJ0eSBmcm9tIHRoZSBpbnRlcm5hbFxuICAgKiBtb2RlbCBvYmplY3QgZm9yIHRoaXMgZW51bSBpbnN0YW5jZS4gVGhhdCBpcyBhIG1vdXRoZnVsbCwgYnV0IGl0XG4gICAqIGJhc2ljYWxseSBtZWFucyB0aGF0IGlmIHlvdXIgZW51bSBpcyBzb21ldGhpbmcgbGlrZTpcbiAgICpcbiAgICogYGBgXG4gICAqIGVudW0gUGVyc29uIHsgVEFMTCwgU0hPUlQgfVxuICAgKiBgYGBcbiAgICpcbiAgICogYW5kIHlvdSBjcmVhdGUgYW4gaW5zdGFuY2UgdXNpbmcgYW55IG9mIHRoZSBmb2xsb3dpbmdcbiAgICpcbiAgICogYGBgXG4gICAqIHAgPSBuZXcgUGVyc29uKCdUQUxMJylcbiAgICogcCA9IG5ldyBQZXJzb24odmFsdWVGb3IoJ1RBTEwnKSlcbiAgICogcCA9IG5ldyBQZXJzb24oe3ZhbHVlOiAnVEFMTCd9KVxuICAgKiBgYGBcbiAgICpcbiAgICogdGhhdCB5b3VyIHJlc3BvbnNlIHRvIGBwLm5hbWVgIHdpbGwgZXF1YXRlIHRvIGBUQUxMYC5cbiAgICpcbiAgICogQG1ldGhvZCDirIfvuI7ioIBuYW1lXG4gICAqIEBtZW1iZXJvZiBHUUxFbnVtXG4gICAqIEByZXR1cm4ge21peGVkfSB0eXBpY2FsbHkgYSBTdHJpbmcgYnV0IGFueSB2YWxpZCB0eXBlIHN1cHBsaWVkXG4gICAqL1xuICBnZXQgbmFtZSgpOiBtaXhlZCB7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuZ2V0TW9kZWwoKS5uYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgbmFtZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBuYW1lICE9PSBudWxsICYmXG4gICAgICBuYW1lICE9PSBOYU5cbiAgICApID8gbmFtZSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogTXVjaCBsaWtlIHRoZSBgLm5hbWVgIGdldHRlciwgdGhlIGAudmFsdWVgIGdldHRlciB3aWxsIHR5cGljYWxseVxuICAgKiByZXRyZWl2ZSB0aGUgbmFtZSBvZiB0aGUgZW51bSBrZXkgeW91IGFyZSByZXF1ZXN0aW5nLiBJbiByYXJlIGNhc2VzXG4gICAqIHdoZXJlIHlvdSBoYXZlIGRlZmluZWQgdmFsdWVzIHRoYXQgZGlmZmVyIGZyb20gdGhlIG5hbWUsIHRoZSBgLnZhbHVlYFxuICAgKiBnZXR0ZXIgd2lsbCByZXRyaWV2ZSB0aGF0IGN1c3RvbSB2YWx1ZSBmcm9tIHRoZSBgLnZhbHVlYCBwcm9wZXJ0eSBvblxuICAgKiB0aGUgc3ltYm9sIGluIHF1ZXN0aW9uLlxuICAgKlxuICAgKiBUaGlzIHNob3VsZCBkbyB0aGUgcmlnaHQgdGhpbmcgZXZlbiBpZiB5b3UgaW5zdGFudGlhdGVkIHRoZSBpbnN0YW5jZVxuICAgKiB1c2luZyB0aGUgbmFtZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEVudW1cbiAgICogQG1ldGhvZCDirIfvuI7ioIB2YWx1ZVxuICAgKiBAcmV0dXJuIHttaXhlZH0gdGhlIHZhbHVlIG9mIHRoZSBlbnVtIHR5cGU7IHRoaXMgaW4gYWxsIGxpa2lob29kIHNob3VsZFxuICAgKiBiZSBhIFN0cmluZyBvciBwb3RlbnRpYWxseSBhbiBvYmplY3RcbiAgICovXG4gIGdldCB2YWx1ZSgpOiBtaXhlZCB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldE1vZGVsKCkudmFsdWVcblxuICAgIHJldHVybiAoXG4gICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgdmFsdWUgIT09IE5hTlxuICAgICkgPyB2YWx1ZSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgZGVmYXVsdCB0eXBlIHRhcmdldGVkIGJ5IHRoaXMgR1FMQmFzZSBjbGFzcy4gQW55XG4gICAqIHR5cGUgd2lsbCB0ZWNobmljYWxseSBiZSB2YWxpZCBidXQgb25seSB3aWxsIHRyaWdnZXIgc3BlY2lhbCBiZWhhdmlvclxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMRW51bVxuICAgKiBAbWV0aG9kIOKsh++4juKggEdRTF9UWVBFXG4gICAqIEBzdGF0aWNcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIHR5cGUsIHN1Y2ggYXMgYEdyYXBoUUxPYmplY3RUeXBlYCBvclxuICAgKiBgR3JhcGhRTEludGVyZmFjZVR5cGVgXG4gICAqL1xuICBzdGF0aWMgZ2V0IEdRTF9UWVBFKCk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gR3JhcGhRTEVudW1UeXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIEVhY2ggaW5zdGFuY2Ugb2YgR1FMRW51bSBtdXN0IHNwZWNpZnkgYSBtYXAgb2Yga2V5cyBhbmQgdmFsdWVzLiBJZiB0aGlzXG4gICAqIG1ldGhvZCByZXR1cm5zIG51bGwgb3IgaXMgbm90IGRlZmluZWQsIHRoZSB2YWx1ZSBvZiB0aGUgZW51bSB3aWxsIG1hdGNoXG4gICAqIHRoZSBuYW1lIG9mIHRoZSBlbnVtIGFzIHBlciB0aGUgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKiBgYGBcbiAgICogICBzdGF0aWMgZ2V0IHZhbHVlcygpOiA/T2JqZWN0IHtcbiAgICogICAgIGNvbnN0IHsgdmFsdWVPZiB9ID0gdGhpcztcbiAgICpcbiAgICogICAgIHJldHVybiB7XG4gICAqICAgICAgIE5BTUU6IHZhbHVlT2YodmFsdWUpXG4gICAqICAgICB9XG4gICAqICAgfVxuICAgKiBgYGBcbiAgICpcbiAgICogQG1ldGhvZCDirIfvuI7ioIB2YWx1ZXNcbiAgICogQG1lbWJlcm9mIEdRTEVudW1cbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R8TnVsbH0gYW4gb2JqZWN0IG1hcHBpbmcgd2l0aCBlYWNoIGtleSBtYXBwaW5nIHRvIGFuIG9iamVjdFxuICAgKiBwb3NzZXNzaW5nIGF0IGxlYXN0IGEgdmFsdWUgZmllbGQsIHdoaWNoIGluIHR1cm4gbWFwcyB0byB0aGUgZGVzaXJlZCB2YWx1ZVxuICAgKi9cbiAgc3RhdGljIGdldCB2YWx1ZXMoKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogU2hvcnRoYW5kIG1ldGhvZCB0byBnZW5lcmF0ZSBhIEdyYXBoUUxFbnVtVmFsdWVEZWZpbml0aW9uIGltcGxlbWVudGF0aW9uXG4gICAqIG9iamVjdC4gVXNlIHRoaXMgZm9yIGJ1aWxkaW5nIGFuZCBjdXN0b21pemluZyB5b3VyIGB2YWx1ZXNgIGtleS92YWx1ZVxuICAgKiBvYmplY3QgaW4geW91ciBjaGlsZCBjbGFzc2VzLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMRW51bVxuICAgKiBAbWV0aG9kIHZhbHVlRm9yXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHttaXhlZH0gdmFsdWUgYW55IG5vbnN0YW5kYXJkIHZhbHVlIHlvdSB3aXNoIHlvdXIgZW51bSB0byBoYXZlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkZXByZWNhdGlvblJlYXNvbiBhbiBvcHRpb25hbCByZWFzb24gdG8gZGVwcmVjYXRlIGFuIGVudW1cbiAgICogQHBhcmFtIHtTdHJpbmd9IGRlc2NyaXB0aW9uIGEgbm9uIExhdHRpY2Ugc3RhbmRhcmQgd2F5IHRvIHdyaXRlIGEgY29tbWVudFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGFuIG9iamVjdCB0aGF0IGNvbmZvcm1zIHRvIHRoZSBHcmFwaFFMRW51bVZhbHVlRGVmaW5pdGlvblxuICAgKiBkZWZpbmVkIGhlcmUgaHR0cDovL2dyYXBocWwub3JnL2dyYXBocWwtanMvdHlwZS8jZ3JhcGhxbGVudW10eXBlXG4gICAqL1xuICBzdGF0aWMgdmFsdWVGb3IoXG4gICAgdmFsdWU6IG1peGVkLFxuICAgIGRlcHJlY2F0aW9uUmVhc29uOiA/c3RyaW5nLFxuICAgIGRlc2NyaXB0aW9uOiA/c3RyaW5nXG4gICk6IE9iamVjdCB7XG4gICAgY29uc3QgcmVzdWx0OiBPYmplY3QgPSB7IHZhbHVlIH1cblxuICAgIGlmIChkZXByZWNhdGlvblJlYXNvbikgeyByZXN1bHQuZGVwcmVjYXRpb25SZWFzb24gPSBkZXByZWNhdGlvblJlYXNvbiB9XG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7IHJlc3VsdC5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogRm9yIGVhc2llciB1c2Ugd2l0aGluIEphdmFTY3JpcHQsIHRoZSBzdGF0aWMgZW51bXMgbWV0aG9kIHByb3ZpZGVzIGFcbiAgICogU3ltYm9sIGJhY2tlZCBzb2x1dGlvbiBmb3IgZWFjaCBvZiB0aGUgZW51bXMgZGVmaW5lZC4gRWFjaCBgU3ltYm9sYFxuICAgKiBpbnN0YW5jZSBpcyB3cmFwcGVkIGluIE9iamVjdCBzbyBhcyB0byBhbGxvdyBzb21lIGFkZGl0aW9uYWwgcHJvcGVydGllc1xuICAgKiB0byBiZSB3cml0dGVuIHRvIGl0LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMRW51bVxuICAgKiBAbWV0aG9kIOKsh++4juKggGVudW1zXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8U3ltYm9sPn0gYW4gYXJyYXkgb2YgbW9kaWZpZWQgU3ltYm9scyBmb3IgZWFjaCBlbnVtXG4gICAqIHZhcmlhdGlvbiBkZWZpbmVkLlxuICAgKi9cbiAgc3RhdGljIGdldCBlbnVtcygpOiBBcnJheTxTeW1ib2w+IHtcbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgaWYgKCF0aGlzW0VOVU1TXSkge1xuICAgICAgY29uc3QgbWFwOiBNYXA8KiwqPiA9IG5ldyBNYXAoKTtcbiAgICAgIGNvbnN0IGFzdCA9IHBhcnNlKCh0aGlzLlNDSEVNQTogYW55KSk7XG4gICAgICBjb25zdCBhcnJheSA9IG5ldyBQcm94eShbXSwgR1FMRW51bS5HZW5lcmF0ZUVudW1zUHJveHlIYW5kbGVyKG1hcCkpO1xuICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy52YWx1ZXMgfHwge307XG4gICAgICBsZXQgYXN0VmFsdWVzOiBBcnJheTxhbnk+O1xuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBUT0RPOiAkRmxvd0ZpeE1lXG4gICAgICAgIGFzdFZhbHVlcyA9IGFzdC5kZWZpbml0aW9uc1swXS52YWx1ZXM7XG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbGwuZXJyb3IoJ1VuYWJsZSB0byBkaXNjZXJuIHRoZSB2YWx1ZXMgZnJvbSB5b3VyIGVudW1zIFNDSEVNQScpXG4gICAgICAgIGxsLmVycm9yKGVycm9yKVxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgLy8gV2FsayB0aGUgQVNUIGZvciB0aGUgY2xhc3MnIHNjaGVtYSBhbmQgZXh0cmFjdCB0aGUgbmFtZXMgKHNhbWUgYXNcbiAgICAgIC8vIHZhbHVlcyB3aGVuIHNwZWNpZmllZCBpbiBHcmFwaFFMIFNETCkgYW5kIGJ1aWxkIGFuIG9iamVjdCB0aGUgaGFzXG4gICAgICAvLyB0aGUgYWN0dWFsIGRlZmluZWQgdmFsdWUgYW5kIHRoZSBBU1QgZ2VuZXJhdGVkIG5hbWUvdmFsdWUuXG4gICAgICBmb3IgKGxldCBlbnVtRGVmIG9mIGFzdFZhbHVlcykge1xuICAgICAgICBsZXQgZGVmS2V5ID0gZW51bURlZi5uYW1lLnZhbHVlO1xuICAgICAgICBsZXQgc3ltT2JqOiBPYmplY3QgPSBPYmplY3QoU3ltYm9sLmZvcihkZWZLZXkpKTtcblxuICAgICAgICBzeW1PYmoudmFsdWUgPSAodmFsdWVzW2RlZktleV0gJiYgdmFsdWVzW2RlZktleV0udmFsdWUpIHx8IGRlZktleTtcbiAgICAgICAgc3ltT2JqLm5hbWUgPSBkZWZLZXlcbiAgICAgICAgc3ltT2JqLnN5bSA9IHN5bU9iai52YWx1ZU9mKClcblxuICAgICAgICBtYXAuc2V0KHN5bU9iai5uYW1lLCBzeW1PYmopXG4gICAgICAgIG1hcC5zZXQoc3ltT2JqLnZhbHVlLCBzeW1PYmopXG5cbiAgICAgICAgLy8gVGhpcyBiaXQgb2YgbG9naWMgYWxsb3dzIHVzIHRvIGxvb2sgaW50byB0aGUgXCJlbnVtc1wiIHByb3BlcnR5IGFuZFxuICAgICAgICAvLyBnZXQgdGhlIGdlbmVyYXRlZCBPYmplY3Qgd3JhcHBlZCBTeW1ib2wgd2l0aCBrZXlzIGFuZCB2YWx1ZXMgYnlcbiAgICAgICAgLy8gc3VwcGx5aW5nIGVpdGhlciBhIGtleSBvciB2YWx1ZS5cbiAgICAgICAgYXJyYXkucHVzaChzeW1PYmopXG4gICAgICB9XG5cbiAgICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICAgIHRoaXNbRU5VTVNdID0gYXJyYXk7XG4gICAgfVxuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIHJldHVybiB0aGlzW0VOVU1TXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEdWUgdG8gdGhlIGNvbXBsZXhpdHkgb2YgYmVpbmcgYWJsZSB0byBhY2Nlc3MgYm90aCB0aGUga2V5cyBhbmQgdmFsdWVzXG4gICAqIHByb3Blcmx5IGZvciBhbiBlbnVtIHR5cGUsIGEgTWFwIGlzIHVzZWQgYXMgdGhlIGJhY2tpbmcgc3RvcmUuIFRoZSBoYW5kbGVyXG4gICAqIHJldHVybmVkIGJ5IHRoaXMgbWV0aG9kIGlzIHRvIGJlIHBhc3NlZCB0byBhIFByb3h5LlxuICAgKlxuICAgKiBAbWV0aG9kIEdRTEVudW0jR2VuZXJhdGVFbnVtc1Byb3h5SGFuZGxlclxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7TWFwfSBtYXAgdGhlIG1hcCBjb250YWluaW5nIHRoZSBrZXk8LT52YWx1ZSBhbmRcbiAgICogdmFsdWU8LT5rZXkgbWFwcGluZ3M7IHRoZSB0cnVlIHN0b3JhZ2UgYmFja2luZyB0aGUgYXJyYXkgaW4gcXVlc3Rpb24uXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIHN0YXRpYyBHZW5lcmF0ZUVudW1zUHJveHlIYW5kbGVyKG1hcDogTWFwPCosICo+KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogR2V0IGhhbmRsZXIgZm9yIHRoZSBNYXAgYmFja2VkIEFycmF5IFByb3h5XG4gICAgICAgKlxuICAgICAgICogQG1lbWJlcm9mISBHUUxFbnVtXG4gICAgICAgKiBAbWV0aG9kIGdldFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgb2JqZWN0IHRhcmdldGVkIGJ5IHRoZSBQcm94eVxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBga2V5YCBvZiB0aGUgdmFsdWUgYmVpbmcgcmVxdWVzdGVkXG4gICAgICAgKiBAcmV0dXJuIHttaXhlZH0gdGhlIGB2YWx1ZWAgYmVpbmcgcmVxdWVzdGVkXG4gICAgICAgKi9cbiAgICAgIGdldChvYmosIGtleSkge1xuICAgICAgICBpZiAobWFwLmhhcyhrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcC5nZXQoa2V5KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtrZXldXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFNldCBoYW5kbGVyIGZvciB0aGUgTWFwIGJhY2tlZCBBcnJheSBQcm94eS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyb2YhIEdRTEVudW1cbiAgICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBvYmplY3QgdGhlIFByb3h5IGlzIHRhcmdldGluZ1xuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBhIHN0cmluZyBga2V5YCBiZWluZyBzZXRcbiAgICAgICAqIEBwYXJhbSB7bWl4ZWR9IHZhbHVlIHRoZSBgdmFsdWVgIGJlaW5nIGFzc2lnbmVkIHRvIGBrZXlgXG4gICAgICAgKi9cbiAgICAgIHNldChvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGlzRmluaXRlKGtleSkgJiYgdmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgICAgICBtYXAuc2V0KHZhbHVlLm5hbWUsIHZhbHVlKVxuICAgICAgICAgIG1hcC5zZXQodmFsdWUudmFsdWUsIHZhbHVlKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU29tZSBhY2Nlc3NvciBvbiB0aGUgcmVjZWl2aW5nIGFycmF5XG4gICAgICAgIG9ialtrZXldID0gdmFsdWU7XG5cbiAgICAgICAgLy8gQXJyYXlzIHJldHVybiBsZW5ndGggd2hlbiBwdXNoaW5nLiBBc3N1bWUgdmFsdWUgYXMgcmV0dXJuXG4gICAgICAgIC8vIG90aGVyd2lzZS4gwq9cXF8o44OEKV8vwq9cbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKGtleSkgPyBvYmoubGVuZ3RoIDogb2JqW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXRpYyBhcGlEb2NzKCk6IE9iamVjdCB7XG4gICAgY29uc3QgeyBET0NfQ0xBU1MsIERPQ19GSUVMRFMsIGpvaW5MaW5lcyB9ID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBbRE9DX0NMQVNTXTogam9pbkxpbmVzYFxuICAgICAgICBHUUxFbnVtcyBhbGxvdyB0aGUgZGVmaW5pdGlvbiBvZiBlbnVtIHR5cGVzIHdpdGggZGVzY3JpcHRpb24gZmllbGRzXG4gICAgICAgIGFuZCB2YWx1ZXMgb3RoZXIgdGhhbiBhIDE6MSBtYXBwaW5nIG9mIHRoZWlyIHR5cGVzIGFuZCB0aGVpciB0eXBlXG4gICAgICAgIG5hbWVzLiBJZiB5b3UgYXJlIHJlYWRpbmcgdGhpcywgdGhlIGltcGxlbWVudG9yIGxpa2VseSBkaWQgbm90XG4gICAgICAgIGNvbnRyaWJ1dGUgY29tbWVudHMgZm9yIHRoZWlyIHR5cGUuXG4gICAgICBgXG4gICAgfVxuICB9XG59XG4iXX0=