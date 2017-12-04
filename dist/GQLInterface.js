'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLInterface = undefined;

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

var _GQLBase2 = require('./GQLBase');

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Used by Lattice to implement interface types in the schema when necessary
 *
 * @class GQLInterface
 */
/**
 @namespace GQLInterface
 
 */

var GQLInterface = exports.GQLInterface = function (_GQLBase) {
  (0, _inherits3.default)(GQLInterface, _GQLBase);

  function GQLInterface() {
    (0, _classCallCheck3.default)(this, GQLInterface);
    return (0, _possibleConstructorReturn3.default)(this, (GQLInterface.__proto__ || (0, _getPrototypeOf2.default)(GQLInterface)).apply(this, arguments));
  }

  (0, _createClass3.default)(GQLInterface, null, [{
    key: 'resolveType',


    /**
     * This needs to be able to, depending on your implementors, identify
     * which on the data actually is given the model to work with.
     *
     * @memberof GQLInterface
     * @method ⌾⠀resolveType
     * @static
     *
     * @param {mixed} model the data you can use to instantiate the type of
     * object in question.
     * @return {string} a string matching the name of a defined GraphQL type
     * found elsewhere in your schema
     */
    value: function resolveType(model) {
      throw new Error(`
      You must override "resolveType(model)" in your GQLInterface instance
      and determine the implementor type by the contents of the supplied
      model. Returning "null" when nothing matches.
    `);
    }

    /**
     * Denotes that this GQLBase descendent is describing a graphql
     * interface type.
     *
     * @memberof GQLInterface
     * @method ⬇︎⠀GQL_TYPE
     * @static
     * @const
     *
     * @return {Function} a type, such as `GraphQLObjectType` or
     * `GraphQLInterfaceType`
     */

  }, {
    key: 'GQL_TYPE',
    get: function get() {
      return _graphql.GraphQLInterfaceType;
    }
  }]);
  return GQLInterface;
}(_GQLBase2.GQLBase);
//# sourceMappingURL=GQLInterface.js.map