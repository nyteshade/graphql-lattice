"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLEnum = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _GQLBase2 = require("./GQLBase");

var _graphql = require("graphql");

var _ModelProperties = require("./decorators/ModelProperties");

var _utils = require("./utils");

var _dec, _class;

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        GQLEnums allow the definition of enum types with description fields\n        and values other than a 1:1 mapping of their types and their type\n        names. If you are reading this, the implementor likely did not\n        contribute comments for their type.\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/* Internal Symbol referring to real accessor to GQLBase model object */
var _MODEL_KEY = Symbol.for('data-model-contents-value');
/* Internal Symbol referring to the static object containing a proxy handler */


var _PROXY_HANDLER = Symbol.for('internal-base-proxy-handler');
/* Internal Symbol property referring to the mapping of values on the GQLEnum */


var ENUMS = Symbol();
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

var GQLEnum = (_dec = (0, _ModelProperties.Getters)('symbol'), _dec(_class =
/*#__PURE__*/
function (_GQLBase) {
  (0, _inherits2.default)(GQLEnum, _GQLBase);

  function GQLEnum(enumValueOrKey, requestData) {
    var _this;

    (0, _classCallCheck2.default)(this, GQLEnum);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GQLEnum).call(this, {}, requestData));
    var Class = _this.constructor;
    var enums = Class.enums;
    var symbol;
    var enumVK = enumValueOrKey || null; // @ComputedType

    symbol = enums[enumVK] || enumVK && enums[enumVK.value] || null;
    Object.assign(_this.getModel(), {
      name: symbol ? symbol.name : null,
      value: symbol ? symbol.value : null,
      symbol: symbol ? symbol : null
    });
    return _this;
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


  (0, _createClass2.default)(GQLEnum, [{
    key: "name",
    get: function get() {
      var name = this.getModel().name;
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

  }, {
    key: "value",
    get: function get() {
      var value = this.getModel().value;
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

  }], [{
    key: "valueFor",

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
    value: function valueFor(value, deprecationReason, description) {
      var result = {
        value: value
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

  }, {
    key: "GenerateEnumsProxyHandler",

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
    value: function GenerateEnumsProxyHandler(map) {
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
        get: function get(obj, key) {
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
        set: function set(obj, key, value) {
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

  }, {
    key: "apiDocs",
    value: function apiDocs() {
      var DOC_CLASS = this.DOC_CLASS,
          DOC_FIELDS = this.DOC_FIELDS,
          joinLines = this.joinLines;
      return (0, _defineProperty2.default)({}, DOC_CLASS, joinLines(_templateObject()));
    }
  }, {
    key: "GQL_TYPE",
    get: function get() {
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

  }, {
    key: "values",
    get: function get() {
      return {};
    }
  }, {
    key: "enums",
    get: function get() {
      // @ComputedType
      if (!this[ENUMS]) {
        var map = new Map();
        var ast = (0, _graphql.parse)(this.SCHEMA);
        var array = new Proxy([], GQLEnum.GenerateEnumsProxyHandler(map));
        var values = this.values || {};
        var astValues;

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


        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = astValues[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var enumDef = _step.value;
            var defKey = enumDef.name.value;
            var symObj = Object(Symbol.for(defKey));
            symObj.value = values[defKey] && values[defKey].value || defKey;
            symObj.name = defKey;
            symObj.sym = symObj.valueOf();
            map.set(symObj.name, symObj);
            map.set(symObj.value, symObj); // This bit of logic allows us to look into the "enums" property and
            // get the generated Object wrapped Symbol with keys and values by
            // supplying either a key or value.

            array.push(symObj);
          } // @ComputedType

        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this[ENUMS] = array;
      } // @ComputedType


      return this[ENUMS];
    }
  }]);
  return GQLEnum;
}(_GQLBase2.GQLBase)) || _class);
exports.GQLEnum = GQLEnum;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxFbnVtLmpzIl0sIm5hbWVzIjpbIl9NT0RFTF9LRVkiLCJTeW1ib2wiLCJmb3IiLCJfUFJPWFlfSEFORExFUiIsIkVOVU1TIiwiR1FMRW51bSIsImVudW1WYWx1ZU9yS2V5IiwicmVxdWVzdERhdGEiLCJDbGFzcyIsImNvbnN0cnVjdG9yIiwiZW51bXMiLCJzeW1ib2wiLCJlbnVtVksiLCJ2YWx1ZSIsIk9iamVjdCIsImFzc2lnbiIsImdldE1vZGVsIiwibmFtZSIsInVuZGVmaW5lZCIsIk5hTiIsImRlcHJlY2F0aW9uUmVhc29uIiwiZGVzY3JpcHRpb24iLCJyZXN1bHQiLCJtYXAiLCJnZXQiLCJvYmoiLCJrZXkiLCJoYXMiLCJzZXQiLCJpc0Zpbml0ZSIsImxlbmd0aCIsIkRPQ19DTEFTUyIsIkRPQ19GSUVMRFMiLCJqb2luTGluZXMiLCJHcmFwaFFMRW51bVR5cGUiLCJNYXAiLCJhc3QiLCJTQ0hFTUEiLCJhcnJheSIsIlByb3h5IiwiR2VuZXJhdGVFbnVtc1Byb3h5SGFuZGxlciIsInZhbHVlcyIsImFzdFZhbHVlcyIsImRlZmluaXRpb25zIiwiZXJyb3IiLCJsbCIsImVudW1EZWYiLCJkZWZLZXkiLCJzeW1PYmoiLCJzeW0iLCJ2YWx1ZU9mIiwicHVzaCIsIkdRTEJhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxJQUFNQSxVQUFVLEdBQUdDLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLDJCQUFYLENBQW5CO0FBRUE7OztBQUNBLElBQU1DLGNBQWMsR0FBR0YsTUFBTSxDQUFDQyxHQUFQLENBQVcsNkJBQVgsQ0FBdkI7QUFFQTs7O0FBQ0EsSUFBTUUsS0FBSyxHQUFHSCxNQUFNLEVBQXBCO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQmFJLE8sV0FEWiw4QkFBUSxRQUFSLEM7Ozs7O0FBRUMsbUJBQVlDLGNBQVosRUFBcUNDLFdBQXJD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QTtBQW9CaEIsK0JBQW9CRixTQUFwQiw4SEFBK0I7QUFBQSxnQkFBdEJJLE9BQXNCO0FBQzdCLGdCQUFJQyxNQUFNLEdBQUdELE9BQU8sQ0FBQzdCLElBQVIsQ0FBYUosS0FBMUI7QUFDQSxnQkFBSW1DLE1BQWMsR0FBR2xDLE1BQU0sQ0FBQ2IsTUFBTSxDQUFDQyxHQUFQLENBQVc2QyxNQUFYLENBQUQsQ0FBM0I7QUFFQUMsWUFBQUEsTUFBTSxDQUFDbkMsS0FBUCxHQUFnQjRCLE1BQU0sQ0FBQ00sTUFBRCxDQUFOLElBQWtCTixNQUFNLENBQUNNLE1BQUQsQ0FBTixDQUFlbEMsS0FBbEMsSUFBNENrQyxNQUEzRDtBQUNBQyxZQUFBQSxNQUFNLENBQUMvQixJQUFQLEdBQWM4QixNQUFkO0FBQ0FDLFlBQUFBLE1BQU0sQ0FBQ0MsR0FBUCxHQUFhRCxNQUFNLENBQUNFLE9BQVAsRUFBYjtBQUVBM0IsWUFBQUEsR0FBRyxDQUFDSyxHQUFKLENBQVFvQixNQUFNLENBQUMvQixJQUFmLEVBQXFCK0IsTUFBckI7QUFDQXpCLFlBQUFBLEdBQUcsQ0FBQ0ssR0FBSixDQUFRb0IsTUFBTSxDQUFDbkMsS0FBZixFQUFzQm1DLE1BQXRCLEVBVDZCLENBVzdCO0FBQ0E7QUFDQTs7QUFDQVYsWUFBQUEsS0FBSyxDQUFDYSxJQUFOLENBQVdILE1BQVg7QUFDRCxXQW5DZSxDQXFDaEI7O0FBckNnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXNDaEIsYUFBSzVDLEtBQUwsSUFBY2tDLEtBQWQ7QUFDRCxPQXpDK0IsQ0EyQ2hDOzs7QUFDQSxhQUFPLEtBQUtsQyxLQUFMLENBQVA7QUFDRDs7O0VBOU0wQmdELGlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gQG5hbWVzcGFjZSBHUUxJbnRlcmZhY2VcbiBAZmxvd1xuICovXG5cbmltcG9ydCB7IEdRTEJhc2UgfSBmcm9tICcuL0dRTEJhc2UnXG5pbXBvcnQgeyBHcmFwaFFMRW51bVR5cGUsIHBhcnNlIH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCB7IEdldHRlcnMgfSBmcm9tICcuL2RlY29yYXRvcnMvTW9kZWxQcm9wZXJ0aWVzJ1xuaW1wb3J0IHsgTGF0dGljZUxvZ3MgYXMgbGwgfSBmcm9tICcuL3V0aWxzJ1xuXG4vKiBJbnRlcm5hbCBTeW1ib2wgcmVmZXJyaW5nIHRvIHJlYWwgYWNjZXNzb3IgdG8gR1FMQmFzZSBtb2RlbCBvYmplY3QgKi9cbmNvbnN0IF9NT0RFTF9LRVkgPSBTeW1ib2wuZm9yKCdkYXRhLW1vZGVsLWNvbnRlbnRzLXZhbHVlJyk7XG5cbi8qIEludGVybmFsIFN5bWJvbCByZWZlcnJpbmcgdG8gdGhlIHN0YXRpYyBvYmplY3QgY29udGFpbmluZyBhIHByb3h5IGhhbmRsZXIgKi9cbmNvbnN0IF9QUk9YWV9IQU5ETEVSID0gU3ltYm9sLmZvcignaW50ZXJuYWwtYmFzZS1wcm94eS1oYW5kbGVyJylcblxuLyogSW50ZXJuYWwgU3ltYm9sIHByb3BlcnR5IHJlZmVycmluZyB0byB0aGUgbWFwcGluZyBvZiB2YWx1ZXMgb24gdGhlIEdRTEVudW0gKi9cbmNvbnN0IEVOVU1TID0gU3ltYm9sKCk7XG5cbi8qKlxuICogR3JhcGhRTCBFbnVtIHR5cGVzIGNhbiBiZSBhIGJpdCBwaWNreSB3aGVuIGl0IGNvbWVzIHRvIGhvdyBzY2FsYXIgdHlwZXNcbiAqIGVxdWF0ZSB0byBlbnVtIHZhbHVlcy4gTGF0dGljZSBtYWtlcyB0aGlzIGVhc2llciBieSBhbGxvd2luZyB5b3UgdG8gc3BlY2lmeVxuICogYSB2YWx1ZSBvciB0aGUga2V5IHdoZW4geW91ciBlbnVtIGhhcyBhIHZhbHVlIG90aGVyIHRoYW4gdGhlIGtleTsgR3JhcGhRTFxuICogZG9lcyBub3QgYWxsb3cgdGhpcyBieSBkZWZhdWx0LlxuICpcbiAqIEZ1cnRoZXIgbW9yZSwgd2hlbiBpbnN0YW50aWF0aW5nIGEgR1FMRW51bSB0eXBlLCB5b3UgY2FuIHBhc3MgYSBzdHJpbmcgb3JcbiAqIHZhbHVlIG1hdGNoaW5nIHRoZSBlbnVtIGtleSBvciB2YWx1ZSBvciB5b3UgY2FuIHBhc3MgYW4gb2JqZWN0IHdpdGgga2V5IG9mXG4gKiB2YWx1ZSBhbmQgdGhlIHZhbHVlIGJlaW5nIGVpdGhlciB0aGUgZW51bSBrZXkgb3IgdmFsdWUuIElmIGFueSBvZiB0aG9zZVxuICogdGhpbmdzIG1hdGNoLCB0aGVuIHlvdXIgYGluc3RhbmNlLnZhbHVlYCB3aWxsIGVxdWF0ZSB0byB0aGUgZW51bSdzIGtleS4gSWYsXG4gKiBvbiB0aGUgb3RoZXIgaGFuZCwgeW91ciBzdXBwbGllZCB2YWx1ZXMgZG8gbm90IG1hdGNoIHRoZW4gYGluc3RhbmNlLnZhbHVlYFxuICogd2lsbCBiZSBgbnVsbGAuXG4gKlxuICogQGNsYXNzIEdRTEVudW1cbiAqL1xuQEdldHRlcnMoJ3N5bWJvbCcpXG5leHBvcnQgY2xhc3MgR1FMRW51bSBleHRlbmRzIEdRTEJhc2Uge1xuICBjb25zdHJ1Y3RvcihlbnVtVmFsdWVPcktleTogP09iamVjdCwgcmVxdWVzdERhdGE6ID9PYmplY3QpIHtcbiAgICBzdXBlcih7fSwgcmVxdWVzdERhdGEpXG5cbiAgICBjb25zdCBDbGFzcyA9IHRoaXMuY29uc3RydWN0b3JcbiAgICBjb25zdCBlbnVtcyA9IENsYXNzLmVudW1zO1xuICAgIGxldCBzeW1ib2w7XG4gICAgbGV0IGVudW1WSzogKE9iamVjdCB8IHN0cmluZyB8IG51bGwpID0gZW51bVZhbHVlT3JLZXkgfHwgbnVsbFxuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIHN5bWJvbCA9IGVudW1zW2VudW1WS10gfHwgZW51bVZLICYmIGVudW1zW2VudW1WSy52YWx1ZV0gfHwgbnVsbFxuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmdldE1vZGVsKCksIHtcbiAgICAgIG5hbWU6IHN5bWJvbCA/IHN5bWJvbC5uYW1lIDogbnVsbCxcbiAgICAgIHZhbHVlOiBzeW1ib2wgPyBzeW1ib2wudmFsdWUgOiBudWxsLFxuICAgICAgc3ltYm9sOiBzeW1ib2wgPyBzeW1ib2wgOiBudWxsXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIGFjdHVhbCBzeW1ib2wgc3RvcmVkIG5hbWUgcHJvcGVydHkgZnJvbSB0aGUgaW50ZXJuYWxcbiAgICogbW9kZWwgb2JqZWN0IGZvciB0aGlzIGVudW0gaW5zdGFuY2UuIFRoYXQgaXMgYSBtb3V0aGZ1bGwsIGJ1dCBpdFxuICAgKiBiYXNpY2FsbHkgbWVhbnMgdGhhdCBpZiB5b3VyIGVudW0gaXMgc29tZXRoaW5nIGxpa2U6XG4gICAqXG4gICAqIGBgYFxuICAgKiBlbnVtIFBlcnNvbiB7IFRBTEwsIFNIT1JUIH1cbiAgICogYGBgXG4gICAqXG4gICAqIGFuZCB5b3UgY3JlYXRlIGFuIGluc3RhbmNlIHVzaW5nIGFueSBvZiB0aGUgZm9sbG93aW5nXG4gICAqXG4gICAqIGBgYFxuICAgKiBwID0gbmV3IFBlcnNvbignVEFMTCcpXG4gICAqIHAgPSBuZXcgUGVyc29uKHZhbHVlRm9yKCdUQUxMJykpXG4gICAqIHAgPSBuZXcgUGVyc29uKHt2YWx1ZTogJ1RBTEwnfSlcbiAgICogYGBgXG4gICAqXG4gICAqIHRoYXQgeW91ciByZXNwb25zZSB0byBgcC5uYW1lYCB3aWxsIGVxdWF0ZSB0byBgVEFMTGAuXG4gICAqXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAbmFtZVxuICAgKiBAbWVtYmVyb2YgR1FMRW51bVxuICAgKiBAcmV0dXJuIHttaXhlZH0gdHlwaWNhbGx5IGEgU3RyaW5nIGJ1dCBhbnkgdmFsaWQgdHlwZSBzdXBwbGllZFxuICAgKi9cbiAgZ2V0IG5hbWUoKTogbWl4ZWQge1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmdldE1vZGVsKCkubmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIG5hbWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgbmFtZSAhPT0gbnVsbCAmJlxuICAgICAgbmFtZSAhPT0gTmFOXG4gICAgKSA/IG5hbWUgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIE11Y2ggbGlrZSB0aGUgYC5uYW1lYCBnZXR0ZXIsIHRoZSBgLnZhbHVlYCBnZXR0ZXIgd2lsbCB0eXBpY2FsbHlcbiAgICogcmV0cmVpdmUgdGhlIG5hbWUgb2YgdGhlIGVudW0ga2V5IHlvdSBhcmUgcmVxdWVzdGluZy4gSW4gcmFyZSBjYXNlc1xuICAgKiB3aGVyZSB5b3UgaGF2ZSBkZWZpbmVkIHZhbHVlcyB0aGF0IGRpZmZlciBmcm9tIHRoZSBuYW1lLCB0aGUgYC52YWx1ZWBcbiAgICogZ2V0dGVyIHdpbGwgcmV0cmlldmUgdGhhdCBjdXN0b20gdmFsdWUgZnJvbSB0aGUgYC52YWx1ZWAgcHJvcGVydHkgb25cbiAgICogdGhlIHN5bWJvbCBpbiBxdWVzdGlvbi5cbiAgICpcbiAgICogVGhpcyBzaG91bGQgZG8gdGhlIHJpZ2h0IHRoaW5nIGV2ZW4gaWYgeW91IGluc3RhbnRpYXRlZCB0aGUgaW5zdGFuY2VcbiAgICogdXNpbmcgdGhlIG5hbWUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxFbnVtXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAdmFsdWVcbiAgICogQHJldHVybiB7bWl4ZWR9IHRoZSB2YWx1ZSBvZiB0aGUgZW51bSB0eXBlOyB0aGlzIGluIGFsbCBsaWtpaG9vZCBzaG91bGRcbiAgICogYmUgYSBTdHJpbmcgb3IgcG90ZW50aWFsbHkgYW4gb2JqZWN0XG4gICAqL1xuICBnZXQgdmFsdWUoKTogbWl4ZWQge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRNb2RlbCgpLnZhbHVlXG5cbiAgICByZXR1cm4gKFxuICAgICAgdmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgIHZhbHVlICE9PSBOYU5cbiAgICApID8gdmFsdWUgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgdGhlIGRlZmF1bHQgdHlwZSB0YXJnZXRlZCBieSB0aGlzIEdRTEJhc2UgY2xhc3MuIEFueVxuICAgKiB0eXBlIHdpbGwgdGVjaG5pY2FsbHkgYmUgdmFsaWQgYnV0IG9ubHkgd2lsbCB0cmlnZ2VyIHNwZWNpYWwgYmVoYXZpb3JcbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEVudW1cbiAgICogQG1ldGhvZCDirIfvuI7ioIBHUUxfVFlQRVxuICAgKiBAc3RhdGljXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSB0eXBlLCBzdWNoIGFzIGBHcmFwaFFMT2JqZWN0VHlwZWAgb3JcbiAgICogYEdyYXBoUUxJbnRlcmZhY2VUeXBlYFxuICAgKi9cbiAgc3RhdGljIGdldCBHUUxfVFlQRSgpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIEdyYXBoUUxFbnVtVHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFYWNoIGluc3RhbmNlIG9mIEdRTEVudW0gbXVzdCBzcGVjaWZ5IGEgbWFwIG9mIGtleXMgYW5kIHZhbHVlcy4gSWYgdGhpc1xuICAgKiBtZXRob2QgcmV0dXJucyBudWxsIG9yIGlzIG5vdCBkZWZpbmVkLCB0aGUgdmFsdWUgb2YgdGhlIGVudW0gd2lsbCBtYXRjaFxuICAgKiB0aGUgbmFtZSBvZiB0aGUgZW51bSBhcyBwZXIgdGhlIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICogYGBgXG4gICAqICAgc3RhdGljIGdldCB2YWx1ZXMoKTogP09iamVjdCB7XG4gICAqICAgICBjb25zdCB7IHZhbHVlT2YgfSA9IHRoaXM7XG4gICAqXG4gICAqICAgICByZXR1cm4ge1xuICAgKiAgICAgICBOQU1FOiB2YWx1ZU9mKHZhbHVlKVxuICAgKiAgICAgfVxuICAgKiAgIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAdmFsdWVzXG4gICAqIEBtZW1iZXJvZiBHUUxFbnVtXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fE51bGx9IGFuIG9iamVjdCBtYXBwaW5nIHdpdGggZWFjaCBrZXkgbWFwcGluZyB0byBhbiBvYmplY3RcbiAgICogcG9zc2Vzc2luZyBhdCBsZWFzdCBhIHZhbHVlIGZpZWxkLCB3aGljaCBpbiB0dXJuIG1hcHMgdG8gdGhlIGRlc2lyZWQgdmFsdWVcbiAgICovXG4gIHN0YXRpYyBnZXQgdmFsdWVzKCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCBtZXRob2QgdG8gZ2VuZXJhdGUgYSBHcmFwaFFMRW51bVZhbHVlRGVmaW5pdGlvbiBpbXBsZW1lbnRhdGlvblxuICAgKiBvYmplY3QuIFVzZSB0aGlzIGZvciBidWlsZGluZyBhbmQgY3VzdG9taXppbmcgeW91ciBgdmFsdWVzYCBrZXkvdmFsdWVcbiAgICogb2JqZWN0IGluIHlvdXIgY2hpbGQgY2xhc3Nlcy5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEVudW1cbiAgICogQG1ldGhvZCB2YWx1ZUZvclxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bWl4ZWR9IHZhbHVlIGFueSBub25zdGFuZGFyZCB2YWx1ZSB5b3Ugd2lzaCB5b3VyIGVudW0gdG8gaGF2ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGVwcmVjYXRpb25SZWFzb24gYW4gb3B0aW9uYWwgcmVhc29uIHRvIGRlcHJlY2F0ZSBhbiBlbnVtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkZXNjcmlwdGlvbiBhIG5vbiBMYXR0aWNlIHN0YW5kYXJkIHdheSB0byB3cml0ZSBhIGNvbW1lbnRcbiAgICogQHJldHVybiB7T2JqZWN0fSBhbiBvYmplY3QgdGhhdCBjb25mb3JtcyB0byB0aGUgR3JhcGhRTEVudW1WYWx1ZURlZmluaXRpb25cbiAgICogZGVmaW5lZCBoZXJlIGh0dHA6Ly9ncmFwaHFsLm9yZy9ncmFwaHFsLWpzL3R5cGUvI2dyYXBocWxlbnVtdHlwZVxuICAgKi9cbiAgc3RhdGljIHZhbHVlRm9yKFxuICAgIHZhbHVlOiBtaXhlZCxcbiAgICBkZXByZWNhdGlvblJlYXNvbjogP3N0cmluZyxcbiAgICBkZXNjcmlwdGlvbjogP3N0cmluZ1xuICApOiBPYmplY3Qge1xuICAgIGNvbnN0IHJlc3VsdDogT2JqZWN0ID0geyB2YWx1ZSB9XG5cbiAgICBpZiAoZGVwcmVjYXRpb25SZWFzb24pIHsgcmVzdWx0LmRlcHJlY2F0aW9uUmVhc29uID0gZGVwcmVjYXRpb25SZWFzb24gfVxuICAgIGlmIChkZXNjcmlwdGlvbikgeyByZXN1bHQuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBlYXNpZXIgdXNlIHdpdGhpbiBKYXZhU2NyaXB0LCB0aGUgc3RhdGljIGVudW1zIG1ldGhvZCBwcm92aWRlcyBhXG4gICAqIFN5bWJvbCBiYWNrZWQgc29sdXRpb24gZm9yIGVhY2ggb2YgdGhlIGVudW1zIGRlZmluZWQuIEVhY2ggYFN5bWJvbGBcbiAgICogaW5zdGFuY2UgaXMgd3JhcHBlZCBpbiBPYmplY3Qgc28gYXMgdG8gYWxsb3cgc29tZSBhZGRpdGlvbmFsIHByb3BlcnRpZXNcbiAgICogdG8gYmUgd3JpdHRlbiB0byBpdC5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEVudW1cbiAgICogQG1ldGhvZCDirIfvuI7ioIBlbnVtc1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5PFN5bWJvbD59IGFuIGFycmF5IG9mIG1vZGlmaWVkIFN5bWJvbHMgZm9yIGVhY2ggZW51bVxuICAgKiB2YXJpYXRpb24gZGVmaW5lZC5cbiAgICovXG4gIHN0YXRpYyBnZXQgZW51bXMoKTogQXJyYXk8U3ltYm9sPiB7XG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIGlmICghdGhpc1tFTlVNU10pIHtcbiAgICAgIGNvbnN0IG1hcDogTWFwPCosKj4gPSBuZXcgTWFwKCk7XG4gICAgICBjb25zdCBhc3QgPSBwYXJzZSgodGhpcy5TQ0hFTUE6IGFueSkpO1xuICAgICAgY29uc3QgYXJyYXkgPSBuZXcgUHJveHkoW10sIEdRTEVudW0uR2VuZXJhdGVFbnVtc1Byb3h5SGFuZGxlcihtYXApKTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMudmFsdWVzIHx8IHt9O1xuICAgICAgbGV0IGFzdFZhbHVlczogQXJyYXk8YW55PjtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVE9ETzogJEZsb3dGaXhNZVxuICAgICAgICBhc3RWYWx1ZXMgPSBhc3QuZGVmaW5pdGlvbnNbMF0udmFsdWVzO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxsLmVycm9yKCdVbmFibGUgdG8gZGlzY2VybiB0aGUgdmFsdWVzIGZyb20geW91ciBlbnVtcyBTQ0hFTUEnKVxuICAgICAgICBsbC5lcnJvcihlcnJvcilcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIC8vIFdhbGsgdGhlIEFTVCBmb3IgdGhlIGNsYXNzJyBzY2hlbWEgYW5kIGV4dHJhY3QgdGhlIG5hbWVzIChzYW1lIGFzXG4gICAgICAvLyB2YWx1ZXMgd2hlbiBzcGVjaWZpZWQgaW4gR3JhcGhRTCBTREwpIGFuZCBidWlsZCBhbiBvYmplY3QgdGhlIGhhc1xuICAgICAgLy8gdGhlIGFjdHVhbCBkZWZpbmVkIHZhbHVlIGFuZCB0aGUgQVNUIGdlbmVyYXRlZCBuYW1lL3ZhbHVlLlxuICAgICAgZm9yIChsZXQgZW51bURlZiBvZiBhc3RWYWx1ZXMpIHtcbiAgICAgICAgbGV0IGRlZktleSA9IGVudW1EZWYubmFtZS52YWx1ZTtcbiAgICAgICAgbGV0IHN5bU9iajogT2JqZWN0ID0gT2JqZWN0KFN5bWJvbC5mb3IoZGVmS2V5KSk7XG5cbiAgICAgICAgc3ltT2JqLnZhbHVlID0gKHZhbHVlc1tkZWZLZXldICYmIHZhbHVlc1tkZWZLZXldLnZhbHVlKSB8fCBkZWZLZXk7XG4gICAgICAgIHN5bU9iai5uYW1lID0gZGVmS2V5XG4gICAgICAgIHN5bU9iai5zeW0gPSBzeW1PYmoudmFsdWVPZigpXG5cbiAgICAgICAgbWFwLnNldChzeW1PYmoubmFtZSwgc3ltT2JqKVxuICAgICAgICBtYXAuc2V0KHN5bU9iai52YWx1ZSwgc3ltT2JqKVxuXG4gICAgICAgIC8vIFRoaXMgYml0IG9mIGxvZ2ljIGFsbG93cyB1cyB0byBsb29rIGludG8gdGhlIFwiZW51bXNcIiBwcm9wZXJ0eSBhbmRcbiAgICAgICAgLy8gZ2V0IHRoZSBnZW5lcmF0ZWQgT2JqZWN0IHdyYXBwZWQgU3ltYm9sIHdpdGgga2V5cyBhbmQgdmFsdWVzIGJ5XG4gICAgICAgIC8vIHN1cHBseWluZyBlaXRoZXIgYSBrZXkgb3IgdmFsdWUuXG4gICAgICAgIGFycmF5LnB1c2goc3ltT2JqKVxuICAgICAgfVxuXG4gICAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgICB0aGlzW0VOVU1TXSA9IGFycmF5O1xuICAgIH1cblxuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICByZXR1cm4gdGhpc1tFTlVNU107XG4gIH1cblxuICAvKipcbiAgICogRHVlIHRvIHRoZSBjb21wbGV4aXR5IG9mIGJlaW5nIGFibGUgdG8gYWNjZXNzIGJvdGggdGhlIGtleXMgYW5kIHZhbHVlc1xuICAgKiBwcm9wZXJseSBmb3IgYW4gZW51bSB0eXBlLCBhIE1hcCBpcyB1c2VkIGFzIHRoZSBiYWNraW5nIHN0b3JlLiBUaGUgaGFuZGxlclxuICAgKiByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCBpcyB0byBiZSBwYXNzZWQgdG8gYSBQcm94eS5cbiAgICpcbiAgICogQG1ldGhvZCBHUUxFbnVtI0dlbmVyYXRlRW51bXNQcm94eUhhbmRsZXJcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge01hcH0gbWFwIHRoZSBtYXAgY29udGFpbmluZyB0aGUga2V5PC0+dmFsdWUgYW5kXG4gICAqIHZhbHVlPC0+a2V5IG1hcHBpbmdzOyB0aGUgdHJ1ZSBzdG9yYWdlIGJhY2tpbmcgdGhlIGFycmF5IGluIHF1ZXN0aW9uLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBzdGF0aWMgR2VuZXJhdGVFbnVtc1Byb3h5SGFuZGxlcihtYXA6IE1hcDwqLCAqPikge1xuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIEdldCBoYW5kbGVyIGZvciB0aGUgTWFwIGJhY2tlZCBBcnJheSBQcm94eVxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJvZiEgR1FMRW51bVxuICAgICAgICogQG1ldGhvZCBnZXRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG9iamVjdCB0YXJnZXRlZCBieSB0aGUgUHJveHlcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgYGtleWAgb2YgdGhlIHZhbHVlIGJlaW5nIHJlcXVlc3RlZFxuICAgICAgICogQHJldHVybiB7bWl4ZWR9IHRoZSBgdmFsdWVgIGJlaW5nIHJlcXVlc3RlZFxuICAgICAgICovXG4gICAgICBnZXQob2JqLCBrZXkpIHtcbiAgICAgICAgaWYgKG1hcC5oYXMoa2V5KSkge1xuICAgICAgICAgIHJldHVybiBtYXAuZ2V0KGtleSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmpba2V5XVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgaGFuZGxlciBmb3IgdGhlIE1hcCBiYWNrZWQgQXJyYXkgUHJveHkuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlcm9mISBHUUxFbnVtXG4gICAgICAgKiBAbWV0aG9kIHNldFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgb2JqZWN0IHRoZSBQcm94eSBpcyB0YXJnZXRpbmdcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgYSBzdHJpbmcgYGtleWAgYmVpbmcgc2V0XG4gICAgICAgKiBAcGFyYW0ge21peGVkfSB2YWx1ZSB0aGUgYHZhbHVlYCBiZWluZyBhc3NpZ25lZCB0byBga2V5YFxuICAgICAgICovXG4gICAgICBzZXQob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChpc0Zpbml0ZShrZXkpICYmIHZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICAgICAgbWFwLnNldCh2YWx1ZS5uYW1lLCB2YWx1ZSlcbiAgICAgICAgICBtYXAuc2V0KHZhbHVlLnZhbHVlLCB2YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvbWUgYWNjZXNzb3Igb24gdGhlIHJlY2VpdmluZyBhcnJheVxuICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgIC8vIEFycmF5cyByZXR1cm4gbGVuZ3RoIHdoZW4gcHVzaGluZy4gQXNzdW1lIHZhbHVlIGFzIHJldHVyblxuICAgICAgICAvLyBvdGhlcndpc2UuIMKvXFxfKOODhClfL8KvXG4gICAgICAgIHJldHVybiBpc0Zpbml0ZShrZXkpID8gb2JqLmxlbmd0aCA6IG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGF0aWMgYXBpRG9jcygpOiBPYmplY3Qge1xuICAgIGNvbnN0IHsgRE9DX0NMQVNTLCBET0NfRklFTERTLCBqb2luTGluZXMgfSA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgW0RPQ19DTEFTU106IGpvaW5MaW5lc2BcbiAgICAgICAgR1FMRW51bXMgYWxsb3cgdGhlIGRlZmluaXRpb24gb2YgZW51bSB0eXBlcyB3aXRoIGRlc2NyaXB0aW9uIGZpZWxkc1xuICAgICAgICBhbmQgdmFsdWVzIG90aGVyIHRoYW4gYSAxOjEgbWFwcGluZyBvZiB0aGVpciB0eXBlcyBhbmQgdGhlaXIgdHlwZVxuICAgICAgICBuYW1lcy4gSWYgeW91IGFyZSByZWFkaW5nIHRoaXMsIHRoZSBpbXBsZW1lbnRvciBsaWtlbHkgZGlkIG5vdFxuICAgICAgICBjb250cmlidXRlIGNvbW1lbnRzIGZvciB0aGVpciB0eXBlLlxuICAgICAgYFxuICAgIH1cbiAgfVxufVxuIl19