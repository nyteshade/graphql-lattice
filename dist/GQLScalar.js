"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GQLScalar = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _graphql = require("graphql");

var _GQLBase2 = require("./GQLBase");

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
var GQLScalar =
/*#__PURE__*/
function (_GQLBase) {
  (0, _inherits2.default)(GQLScalar, _GQLBase);

  function GQLScalar() {
    (0, _classCallCheck2.default)(this, GQLScalar);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GQLScalar).apply(this, arguments));
  }

  (0, _createClass2.default)(GQLScalar, null, [{
    key: "serialize",

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
  }, {
    key: "GQL_TYPE",

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
    get: function get() {
      return _graphql.GraphQLScalarType;
    }
  }]);
  return GQLScalar;
}(_GQLBase2.GQLBase);

exports.GQLScalar = GQLScalar;
var _default = GQLScalar;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxTY2FsYXIuanMiXSwibmFtZXMiOlsiR1FMU2NhbGFyIiwidmFsdWUiLCJhc3QiLCJHcmFwaFFMU2NhbGFyVHlwZSIsIkdRTEJhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7SUFXYUEsUzs7Ozs7Ozs7Ozs7OztBQWlCWDs7Ozs7Ozs7Ozs7Ozs7OEJBY2lCQyxLLEVBQXFCO0FBQ3BDLGFBQU9BLEtBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBaUNrQkEsSyxFQUF1QjtBQUN2QyxhQUFPQSxLQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lDQWlDb0JDLEcsRUFBcUIsQ0FDeEM7Ozs7QUF6R0Q7Ozs7Ozs7Ozs7Ozt3QkFZZ0M7QUFDOUIsYUFBT0MsMEJBQVA7QUFDRDs7O0VBZjRCQyxpQjs7O2VBNkdoQkosUyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IEdyYXBoUUxTY2FsYXJUeXBlIH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCB7IEdRTEJhc2UgfSBmcm9tICcuL0dRTEJhc2UnXG5cbi8qKlxuICogR1FMU2NhbGFycyBhcmUgaG93IG9uZSBtaWdodCBjb25zdHJ1Y3QgdGhlaXIgb3duIHR5cGVzIGZvciB1c2Ugd2l0aGluIFxuICogR3JhcGhRTCB3aXRoIExhdHRpY2UuIFRoZSBkZXNjcmlwdGlvbnMgYmVsb3cgc2hvdWxkIGJlIHN1ZmZpY2llbnQgdG8gZ2V0IFxuICogeW91IHN0YXJ0ZWQgd2l0aCB5b3VyIG93biB0eXBlcy4gVGhlIFNETCBmb3IgYSBTY2FsYXIgbG9va3MgbGlrZSB0aGlzOlxuICpcbiAqIGBgYFxuICogc2NhbGFyIE15VHlwZVxuICogYGBgXG4gKlxuICogQGNsYXNzIEdRTFNjYWxhclxuICovXG5leHBvcnQgY2xhc3MgR1FMU2NhbGFyIGV4dGVuZHMgR1FMQmFzZSB7XG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHRoZSBkZWZhdWx0IHR5cGUgdGFyZ2V0ZWQgYnkgdGhpcyBHUUxCYXNlIGNsYXNzLiBBbnlcbiAgICogdHlwZSB3aWxsIHRlY2huaWNhbGx5IGJlIHZhbGlkIGJ1dCBvbmx5IHdpbGwgdHJpZ2dlciBzcGVjaWFsIGJlaGF2aW9yXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxTY2FsYXJcbiAgICogQG1ldGhvZCDirIfvuI7ioIBHUUxfVFlQRVxuICAgKiBAc3RhdGljXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSB0eXBlLCBzdWNoIGFzIGBHcmFwaFFMT2JqZWN0VHlwZWAgb3JcbiAgICogYEdyYXBoUUxJbnRlcmZhY2VUeXBlYFxuICAgKi9cbiAgc3RhdGljIGdldCBHUUxfVFlQRSgpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIEdyYXBoUUxTY2FsYXJUeXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBgc2VyaWFsaXplYCBtZXRob2QgaXMgY2FsbGVkIGJ5IEdyYXBoUUwgd2hlbiB0aGUgdHlwZSBpcyBnb2luZyB0byBcbiAgICogYmUgc2VudCB0byB0aGUgY2xpZW50LiBTaW5jZSB2YWx1ZXMgb24gdGhlIGNsaWVudCBhcmUgaW4gdGhlIGZvcm0gb2YgXG4gICAqIEpTT04sIHRoZSByZXR1cm4gdmFsdWUgb2YgYHNlcmlhbGl6ZWAgY2FuIGJlIGFueSB2YWxpZCBKU09OIHZhbHVlO1xuICAgKiBTdHJpbmcsIE51bWJlciwgQXJyYXksIE9iamVjdCwgZXRjLi4uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxTY2FsYXJcbiAgICogQG1ldGhvZCBzZXJpYWxpemVcbiAgICogQHN0YXRpYyBcbiAgICpcbiAgICogQHBhcmFtIHttaXhlZH0gdmFsdWUgdGhlIHZhbHVlIHRoYXQgbmVlZHMgdG8gYmUgY29udmVydGVkIGZvciB0aGUgXG4gICAqIGRvd25zdHJlYW0gSlNPTiBjbGllbnQgc2lkZSByZXN1bHQuXG4gICAqIEByZXR1cm4ge21peGVkfSBhbnkgdmFsaWQgSlNPTiB2YWx1ZVxuICAgKi9cbiAgc3RhdGljIHNlcmlhbGl6ZSh2YWx1ZTogbWl4ZWQpOiBtaXhlZCB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIHZhbHVlIGhhbmRsZXMgaW5wdXQgZnJvbSB0aGUgY2xpZW50LiBJbiB0aGlzIGZvcm0sIHRoZSB2YWx1ZSBpcyBcbiAgICogdGFrZW4gZGlyZWN0bHkgZnJvbSB0aGUgc2VudCBxdWVyeS4gVGhlIHR5cGUgb2YgdGhlIHZhbHVlIGNhbiBiZSBuZWFybHkgXG4gICAqIGFueXRoaW5nLCBidXQgdGhlIGBwYXJzZVZhbHVlYCBmdW5jdGlvbidzIGpvYiBpcyB0byBpbnRlcnByZXQgdGhlIFxuICAgKiBpbnB1dCBhbmQgcmV0dXJuIHRoZSB1bmRlcnN0b29kIHZhbHVlLlxuICAgKlxuICAgKiBZb3UgY291bGQgaGF2ZSBhIENvbG9yQmxpbmQgc2NhbGFyIHR5cGUgdGhhdCB0b29rIGluIGEgaGV4YWRlY2ltYWwgXG4gICAqIGNvbG9yIHN0cmluZyBhbmQgY29udmVydGVkIGl0IHRvIGEgY29sb3Igc2NoZW1lIGFzIHNlZW4gYnkgdGhvc2Ugd2l0aCBcbiAgICogc29tZSBmb3JtIG9mIGNvbG9yIGJsaW5kbmVzcy4gVGhlIHZhbHVlIHN1cHBsaWVkIHRvIGBwYXJzZVZhbHVlYCB3b3VsZCBcbiAgICogYmUgdGhlIGlucHV0IGNvbG9yLiBUaGUgbW9kaWZpZWQgY29sb3Igd291bGQgYmUgdGhlIG91dHB1dCB2YWx1ZS5cbiAgICpcbiAgICogYGBgXG4gICAqIHF1ZXJ5IHtcbiAgICogICBzaG93TWUoY29sb3JCbGluZDogJyNmZjAwMDAnKSB7XG4gICAqICAgICBjb2xvciBcbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogLy8gdGhpcyBtaWdodCBjb252ZXJ0IHRvICNjNjUxMDBcbiAgICogYGBgXG4gICAqXG4gICAqIFRoaXMgY2FuIGFsc28gY292ZXIgaW5wdXQgc2VudCBpbiB0aGUgZm9ybSBvZiB2YXJpYWJsZXMuIFRoZSB2YXJpYWJsZSBcbiAgICogY2FuIGJlIG9mIGFueSB2YWxpZCBKU09OIHR5cGUuIFxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMU2NhbGFyXG4gICAqIEBtZXRob2QgcGFyc2VWYWx1ZVxuICAgKiBAc3RhdGljIFxuICAgKlxuICAgKiBAcGFyYW0ge21peGVkfSB2YWx1ZSB0aGUgaW5wdXQgc2VudCBmcm9tIGEgcXVlcnkgdGhhdCBuZWVkcyB0byBiZSBcbiAgICogY29udmVydGVkIHRvIGFuIGludGVybmFsIHZhbHVlIGZvciBHcmFwaFFMIHRvIHByb2NlZWRcbiAgICogQHJldHVybiB7bWl4ZWR9IHRoZSBjb252ZXJ0ZWQgb3V0cHV0IGdpdmVuIHRoZSBpbnB1dDsgdGhpcyB3aWxsIGJlIHB1cmVseSBcbiAgICogaG93IHlvdSB3YW50IHlvdXIgc2NhbGFycyB0byBmdW5jdGlvbi5cbiAgICovXG4gIHN0YXRpYyBwYXJzZVZhbHVlKHZhbHVlOiA/bWl4ZWQpOiA/bWl4ZWQge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaW1pbGFyIHRvIGBwYXJzZVZhbHVlYCwgYnV0IHJhdGhlciB0aGFuIHJlY2VpdmluZyB0aGUgaW5wdXQgdmFsdWVzIGZyb20gXG4gICAqIGEgcXVlcnkgb3IgZnJvbSBhIHF1ZXJ5IHZhcmlhYmxlLCB0aGUgZGF0YSBjb21lcyBpbiB0aGUgZm9ybSBvZiBhIHBhcnNlZCBcbiAgICogYWJzdHJhY3Qgc3ludGF4L3NvdXJjZSB0cmVlIChBU1QpLiBJdCBpcyB0aGUgam9iIG9mIGBwYXJzZUxpdGVyYWxgIHRvXG4gICAqIGNvbnZlcnQgZnJvbSBhbiBBU1QgdHlwZSB0byB0aGUgZGVzaXJlZCBvdXRwdXQgdmFsdWUuIFxuICAgKlxuICAgKiBBbiBleGFtcGxlIHRoYXQgY29udmVydHMgYWxsIFN0cmluZ3MgdG8gTnVtYmVycyBhbmQgdmljZSB2ZXJzYVxuICAgKlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIHN0YXRpYyBwYXJzZUxpdGVyYWwoYXN0KSB7XG4gICAqICAgY29uc3QgeyBLaW5kIH0gPSByZXF1aXJlKCdncmFwaHFsL2xhbmd1YWdlJylcbiAgICpcbiAgICogICBzd2l0Y2ggKGFzdC5raW5kKSB7XG4gICAqICAgICBjYXNlIEtpbmQuSU5UOlxuICAgKiAgICAgY2FzZSBLaW5kLkZMT0FUOlxuICAgKiAgICAgICByZXR1cm4gU3RyaW5nKGFzdC52YWx1ZSlcbiAgICogICAgIGNhc2UgS2luZC5TVFJJTkc6XG4gICAqICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGFzdC52YWx1ZSlcbiAgICogICAgIGRlZmF1bHQ6XG4gICAqICAgICAgIHJldHVybiBudWxsO1xuICAgKiAgIH1cbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTFNjYWxhclxuICAgKiBAbWV0aG9kIHBhcnNlTGl0ZXJhbFxuICAgKiBAc3RhdGljIFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXN0IHRoZSBwYXJzZSB2YWx1ZSBvZiB0aGUgdHlwZSBnaXZlbiBzb21lIGxpdGVyYWwgU0RMIFxuICAgKiBzeW50YXguIFByZXN1bWFibHkgdGhpcyBpcyB3aGVyZSB5b3UgY2FuIGNob29zZSB0byB0YWtlIGEgU3RyaW5nLCBmb3JcbiAgICogZXhhbXBsZSwgYW5kIGNvbnZlcnQgaXQgdG8gYW4gaW50ZWdlciB3aGVuIEtpbmQuU1RSSU5HIGlzIHN1cHBsaWVkLiBcbiAgICogQHJldHVybiB7bWl4ZWR9IHRoZSB2YWx1ZSBvZiB0aGUgY29udmVyc2lvbiwgZ2l2ZW4gaW5wdXQuXG4gICAqL1xuICBzdGF0aWMgcGFyc2VMaXRlcmFsKGFzdDogT2JqZWN0KTogP21peGVkIHtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHUUxTY2FsYXIiXX0=