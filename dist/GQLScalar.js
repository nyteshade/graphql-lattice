"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.GQLScalar = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _graphql = require("graphql");

var _GQLBase2 = require("./GQLBase");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * GQLScalars are how one might construct their own types for use within 
 * GraphQL with Lattice. The descriptions below should be sufficient to get 
 * you started with your own types. The SDL for a Scalar looks like this:
 *
 * ```
 * scalar MyType
 * ```
 *
 * @class GQLScalar
 */
var GQLScalar = /*#__PURE__*/function (_GQLBase) {
  (0, _inherits2["default"])(GQLScalar, _GQLBase);

  var _super = _createSuper(GQLScalar);

  function GQLScalar() {
    (0, _classCallCheck2["default"])(this, GQLScalar);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(GQLScalar, null, [{
    key: "GQL_TYPE",
    get:
    /**
     * Determines the default type targeted by this GQLBase class. Any
     * type will technically be valid but only will trigger special behavior
     *
     * @memberof GQLScalar
     * @method ⬇︎⠀GQL_TYPE
     * @static
     * @const
     *
     * @return {Function} a type, such as `GraphQLObjectType` or
     * `GraphQLInterfaceType`
     */
    function get() {
      return _graphql.GraphQLScalarType;
    }
    /**
     * The `serialize` method is called by GraphQL when the type is going to 
     * be sent to the client. Since values on the client are in the form of 
     * JSON, the return value of `serialize` can be any valid JSON value;
     * String, Number, Array, Object, etc...
     *
     * @memberof GQLScalar
     * @method serialize
     * @static 
     *
     * @param {mixed} value the value that needs to be converted for the 
     * downstream JSON client side result.
     * @return {mixed} any valid JSON value
     */

  }, {
    key: "serialize",
    value: function serialize(value) {
      return value;
    }
    /**
     * Parse value handles input from the client. In this form, the value is 
     * taken directly from the sent query. The type of the value can be nearly 
     * anything, but the `parseValue` function's job is to interpret the 
     * input and return the understood value.
     *
     * You could have a ColorBlind scalar type that took in a hexadecimal 
     * color string and converted it to a color scheme as seen by those with 
     * some form of color blindness. The value supplied to `parseValue` would 
     * be the input color. The modified color would be the output value.
     *
     * ```
     * query {
     *   showMe(colorBlind: '#ff0000') {
     *     color 
     *   }
     * }
     *
     * // this might convert to #c65100
     * ```
     *
     * This can also cover input sent in the form of variables. The variable 
     * can be of any valid JSON type. 
     *
     * @memberof GQLScalar
     * @method parseValue
     * @static 
     *
     * @param {mixed} value the input sent from a query that needs to be 
     * converted to an internal value for GraphQL to proceed
     * @return {mixed} the converted output given the input; this will be purely 
     * how you want your scalars to function.
     */

  }, {
    key: "parseValue",
    value: function parseValue(value) {
      return value;
    }
    /**
     * Similar to `parseValue`, but rather than receiving the input values from 
     * a query or from a query variable, the data comes in the form of a parsed 
     * abstract syntax/source tree (AST). It is the job of `parseLiteral` to
     * convert from an AST type to the desired output value. 
     *
     * An example that converts all Strings to Numbers and vice versa
     *
     * ```javascript
     * static parseLiteral(ast) {
     *   const { Kind } = require('graphql/language')
     *
     *   switch (ast.kind) {
     *     case Kind.INT:
     *     case Kind.FLOAT:
     *       return String(ast.value)
     *     case Kind.STRING:
     *       return parseFloat(ast.value)
     *     default:
     *       return null;
     *   }
     * }
     * ```
     *
     * @memberof GQLScalar
     * @method parseLiteral
     * @static 
     *
     * @param {Object} ast the parse value of the type given some literal SDL 
     * syntax. Presumably this is where you can choose to take a String, for
     * example, and convert it to an integer when Kind.STRING is supplied. 
     * @return {mixed} the value of the conversion, given input.
     */

  }, {
    key: "parseLiteral",
    value: function parseLiteral(ast) {}
  }]);
  return GQLScalar;
}(_GQLBase2.GQLBase);

exports.GQLScalar = GQLScalar;
var _default = GQLScalar;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxTY2FsYXIuanMiXSwibmFtZXMiOlsiR1FMU2NhbGFyIiwiR3JhcGhRTFNjYWxhclR5cGUiLCJ2YWx1ZSIsImFzdCIsIkdRTEJhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7QUFDQTs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNhQSxTOzs7Ozs7Ozs7Ozs7O0FBQ1g7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0UsbUJBQWdDO0FBQzlCLGFBQU9DLDBCQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0UsbUJBQWlCQyxLQUFqQixFQUFzQztBQUNwQyxhQUFPQSxLQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSxvQkFBa0JBLEtBQWxCLEVBQXlDO0FBQ3ZDLGFBQU9BLEtBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLHNCQUFvQkMsR0FBcEIsRUFBeUMsQ0FDeEM7OztFQTFHNEJDLGlCOzs7ZUE2R2hCSixTIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHsgR3JhcGhRTFNjYWxhclR5cGUgfSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IHsgR1FMQmFzZSB9IGZyb20gJy4vR1FMQmFzZSdcblxuLyoqXG4gKiBHUUxTY2FsYXJzIGFyZSBob3cgb25lIG1pZ2h0IGNvbnN0cnVjdCB0aGVpciBvd24gdHlwZXMgZm9yIHVzZSB3aXRoaW4gXG4gKiBHcmFwaFFMIHdpdGggTGF0dGljZS4gVGhlIGRlc2NyaXB0aW9ucyBiZWxvdyBzaG91bGQgYmUgc3VmZmljaWVudCB0byBnZXQgXG4gKiB5b3Ugc3RhcnRlZCB3aXRoIHlvdXIgb3duIHR5cGVzLiBUaGUgU0RMIGZvciBhIFNjYWxhciBsb29rcyBsaWtlIHRoaXM6XG4gKlxuICogYGBgXG4gKiBzY2FsYXIgTXlUeXBlXG4gKiBgYGBcbiAqXG4gKiBAY2xhc3MgR1FMU2NhbGFyXG4gKi9cbmV4cG9ydCBjbGFzcyBHUUxTY2FsYXIgZXh0ZW5kcyBHUUxCYXNlIHtcbiAgLyoqXG4gICAqIERldGVybWluZXMgdGhlIGRlZmF1bHQgdHlwZSB0YXJnZXRlZCBieSB0aGlzIEdRTEJhc2UgY2xhc3MuIEFueVxuICAgKiB0eXBlIHdpbGwgdGVjaG5pY2FsbHkgYmUgdmFsaWQgYnV0IG9ubHkgd2lsbCB0cmlnZ2VyIHNwZWNpYWwgYmVoYXZpb3JcbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTFNjYWxhclxuICAgKiBAbWV0aG9kIOKsh++4juKggEdRTF9UWVBFXG4gICAqIEBzdGF0aWNcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIHR5cGUsIHN1Y2ggYXMgYEdyYXBoUUxPYmplY3RUeXBlYCBvclxuICAgKiBgR3JhcGhRTEludGVyZmFjZVR5cGVgXG4gICAqL1xuICBzdGF0aWMgZ2V0IEdRTF9UWVBFKCk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gR3JhcGhRTFNjYWxhclR5cGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGBzZXJpYWxpemVgIG1ldGhvZCBpcyBjYWxsZWQgYnkgR3JhcGhRTCB3aGVuIHRoZSB0eXBlIGlzIGdvaW5nIHRvIFxuICAgKiBiZSBzZW50IHRvIHRoZSBjbGllbnQuIFNpbmNlIHZhbHVlcyBvbiB0aGUgY2xpZW50IGFyZSBpbiB0aGUgZm9ybSBvZiBcbiAgICogSlNPTiwgdGhlIHJldHVybiB2YWx1ZSBvZiBgc2VyaWFsaXplYCBjYW4gYmUgYW55IHZhbGlkIEpTT04gdmFsdWU7XG4gICAqIFN0cmluZywgTnVtYmVyLCBBcnJheSwgT2JqZWN0LCBldGMuLi5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTFNjYWxhclxuICAgKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICAgKiBAc3RhdGljIFxuICAgKlxuICAgKiBAcGFyYW0ge21peGVkfSB2YWx1ZSB0aGUgdmFsdWUgdGhhdCBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgZm9yIHRoZSBcbiAgICogZG93bnN0cmVhbSBKU09OIGNsaWVudCBzaWRlIHJlc3VsdC5cbiAgICogQHJldHVybiB7bWl4ZWR9IGFueSB2YWxpZCBKU09OIHZhbHVlXG4gICAqL1xuICBzdGF0aWMgc2VyaWFsaXplKHZhbHVlOiBtaXhlZCk6IG1peGVkIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgdmFsdWUgaGFuZGxlcyBpbnB1dCBmcm9tIHRoZSBjbGllbnQuIEluIHRoaXMgZm9ybSwgdGhlIHZhbHVlIGlzIFxuICAgKiB0YWtlbiBkaXJlY3RseSBmcm9tIHRoZSBzZW50IHF1ZXJ5LiBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgY2FuIGJlIG5lYXJseSBcbiAgICogYW55dGhpbmcsIGJ1dCB0aGUgYHBhcnNlVmFsdWVgIGZ1bmN0aW9uJ3Mgam9iIGlzIHRvIGludGVycHJldCB0aGUgXG4gICAqIGlucHV0IGFuZCByZXR1cm4gdGhlIHVuZGVyc3Rvb2QgdmFsdWUuXG4gICAqXG4gICAqIFlvdSBjb3VsZCBoYXZlIGEgQ29sb3JCbGluZCBzY2FsYXIgdHlwZSB0aGF0IHRvb2sgaW4gYSBoZXhhZGVjaW1hbCBcbiAgICogY29sb3Igc3RyaW5nIGFuZCBjb252ZXJ0ZWQgaXQgdG8gYSBjb2xvciBzY2hlbWUgYXMgc2VlbiBieSB0aG9zZSB3aXRoIFxuICAgKiBzb21lIGZvcm0gb2YgY29sb3IgYmxpbmRuZXNzLiBUaGUgdmFsdWUgc3VwcGxpZWQgdG8gYHBhcnNlVmFsdWVgIHdvdWxkIFxuICAgKiBiZSB0aGUgaW5wdXQgY29sb3IuIFRoZSBtb2RpZmllZCBjb2xvciB3b3VsZCBiZSB0aGUgb3V0cHV0IHZhbHVlLlxuICAgKlxuICAgKiBgYGBcbiAgICogcXVlcnkge1xuICAgKiAgIHNob3dNZShjb2xvckJsaW5kOiAnI2ZmMDAwMCcpIHtcbiAgICogICAgIGNvbG9yIFxuICAgKiAgIH1cbiAgICogfVxuICAgKlxuICAgKiAvLyB0aGlzIG1pZ2h0IGNvbnZlcnQgdG8gI2M2NTEwMFxuICAgKiBgYGBcbiAgICpcbiAgICogVGhpcyBjYW4gYWxzbyBjb3ZlciBpbnB1dCBzZW50IGluIHRoZSBmb3JtIG9mIHZhcmlhYmxlcy4gVGhlIHZhcmlhYmxlIFxuICAgKiBjYW4gYmUgb2YgYW55IHZhbGlkIEpTT04gdHlwZS4gXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxTY2FsYXJcbiAgICogQG1ldGhvZCBwYXJzZVZhbHVlXG4gICAqIEBzdGF0aWMgXG4gICAqXG4gICAqIEBwYXJhbSB7bWl4ZWR9IHZhbHVlIHRoZSBpbnB1dCBzZW50IGZyb20gYSBxdWVyeSB0aGF0IG5lZWRzIHRvIGJlIFxuICAgKiBjb252ZXJ0ZWQgdG8gYW4gaW50ZXJuYWwgdmFsdWUgZm9yIEdyYXBoUUwgdG8gcHJvY2VlZFxuICAgKiBAcmV0dXJuIHttaXhlZH0gdGhlIGNvbnZlcnRlZCBvdXRwdXQgZ2l2ZW4gdGhlIGlucHV0OyB0aGlzIHdpbGwgYmUgcHVyZWx5IFxuICAgKiBob3cgeW91IHdhbnQgeW91ciBzY2FsYXJzIHRvIGZ1bmN0aW9uLlxuICAgKi9cbiAgc3RhdGljIHBhcnNlVmFsdWUodmFsdWU6ID9taXhlZCk6ID9taXhlZCB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNpbWlsYXIgdG8gYHBhcnNlVmFsdWVgLCBidXQgcmF0aGVyIHRoYW4gcmVjZWl2aW5nIHRoZSBpbnB1dCB2YWx1ZXMgZnJvbSBcbiAgICogYSBxdWVyeSBvciBmcm9tIGEgcXVlcnkgdmFyaWFibGUsIHRoZSBkYXRhIGNvbWVzIGluIHRoZSBmb3JtIG9mIGEgcGFyc2VkIFxuICAgKiBhYnN0cmFjdCBzeW50YXgvc291cmNlIHRyZWUgKEFTVCkuIEl0IGlzIHRoZSBqb2Igb2YgYHBhcnNlTGl0ZXJhbGAgdG9cbiAgICogY29udmVydCBmcm9tIGFuIEFTVCB0eXBlIHRvIHRoZSBkZXNpcmVkIG91dHB1dCB2YWx1ZS4gXG4gICAqXG4gICAqIEFuIGV4YW1wbGUgdGhhdCBjb252ZXJ0cyBhbGwgU3RyaW5ncyB0byBOdW1iZXJzIGFuZCB2aWNlIHZlcnNhXG4gICAqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogc3RhdGljIHBhcnNlTGl0ZXJhbChhc3QpIHtcbiAgICogICBjb25zdCB7IEtpbmQgfSA9IHJlcXVpcmUoJ2dyYXBocWwvbGFuZ3VhZ2UnKVxuICAgKlxuICAgKiAgIHN3aXRjaCAoYXN0LmtpbmQpIHtcbiAgICogICAgIGNhc2UgS2luZC5JTlQ6XG4gICAqICAgICBjYXNlIEtpbmQuRkxPQVQ6XG4gICAqICAgICAgIHJldHVybiBTdHJpbmcoYXN0LnZhbHVlKVxuICAgKiAgICAgY2FzZSBLaW5kLlNUUklORzpcbiAgICogICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYXN0LnZhbHVlKVxuICAgKiAgICAgZGVmYXVsdDpcbiAgICogICAgICAgcmV0dXJuIG51bGw7XG4gICAqICAgfVxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMU2NhbGFyXG4gICAqIEBtZXRob2QgcGFyc2VMaXRlcmFsXG4gICAqIEBzdGF0aWMgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhc3QgdGhlIHBhcnNlIHZhbHVlIG9mIHRoZSB0eXBlIGdpdmVuIHNvbWUgbGl0ZXJhbCBTREwgXG4gICAqIHN5bnRheC4gUHJlc3VtYWJseSB0aGlzIGlzIHdoZXJlIHlvdSBjYW4gY2hvb3NlIHRvIHRha2UgYSBTdHJpbmcsIGZvclxuICAgKiBleGFtcGxlLCBhbmQgY29udmVydCBpdCB0byBhbiBpbnRlZ2VyIHdoZW4gS2luZC5TVFJJTkcgaXMgc3VwcGxpZWQuIFxuICAgKiBAcmV0dXJuIHttaXhlZH0gdGhlIHZhbHVlIG9mIHRoZSBjb252ZXJzaW9uLCBnaXZlbiBpbnB1dC5cbiAgICovXG4gIHN0YXRpYyBwYXJzZUxpdGVyYWwoYXN0OiBPYmplY3QpOiA/bWl4ZWQge1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdRTFNjYWxhciJdfQ==