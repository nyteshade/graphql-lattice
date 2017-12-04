'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLScalar = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _graphql = require('graphql');

var _GQLBase2 = require('./GQLBase');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var GQLScalar = exports.GQLScalar = function (_GQLBase) {
  (0, _inherits3.default)(GQLScalar, _GQLBase);

  function GQLScalar() {
    (0, _classCallCheck3.default)(this, GQLScalar);
    return (0, _possibleConstructorReturn3.default)(this, (GQLScalar.__proto__ || (0, _getPrototypeOf2.default)(GQLScalar)).apply(this, arguments));
  }

  (0, _createClass3.default)(GQLScalar, null, [{
    key: 'serialize',


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
    key: 'parseValue',
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
    key: 'parseLiteral',
    value: function parseLiteral(ast) {}
  }, {
    key: 'GQL_TYPE',

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

exports.default = GQLScalar;
//# sourceMappingURL=GQLScalar.js.map