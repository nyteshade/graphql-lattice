'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLJSON = undefined;

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

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

var _dec, _class;

var _GQLScalar2 = require('../GQLScalar');

var _Schema = require('../decorators/Schema');

var _language = require('graphql/language');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GQLJSON = exports.GQLJSON = (_dec = (0, _Schema.Schema)('scalar JSON'), _dec(_class = function (_GQLScalar) {
  (0, _inherits3.default)(GQLJSON, _GQLScalar);

  function GQLJSON() {
    (0, _classCallCheck3.default)(this, GQLJSON);
    return (0, _possibleConstructorReturn3.default)(this, (GQLJSON.__proto__ || (0, _getPrototypeOf2.default)(GQLJSON)).apply(this, arguments));
  }

  (0, _createClass3.default)(GQLJSON, null, [{
    key: 'serialize',

    /**
     * Since JSON stands for JavaScript Object Notation, its values need no
     * direct conversion. Simply pass back what is passed in.
     *
     * @memberof GQLJSON
     * @method serialize
     * @static
     *
     * @param {mixed|Null} value a valid JavaScript object
     * @return {mixed|Null} the same value that was passed in.
     */
    value: function serialize(value) {
      return value;
    }

    /**
     * All processing by GraphQL Lattice uses the Class.name property. We want 
     * to report JSON and not GQLJSON so this is what we do.
     *
     * @memberof GQLJSON
     * @method name 
     * @static
     * @type {String}
     */

  }, {
    key: 'parseValue',


    /**
     * Since JSON stands for JavaScript Object Notation, its values need no
     * direct conversion. Simply pass back what is passed in.
     *
     * @memberof GQLJSON
     * @method parseValue
     * @static
     *
     * @param {mixed|Null} value a valid JavaScript object
     * @return {mixed|Null} the same value that was passed in.
     */
    value: function parseValue(value) {
      return value;
    }

    /**
     * Given literal values, `parseLiteral` will walk the object and build
     * up an equivalent version of itself as an object that should `parse()`
     * and `stringify()` accordingly.
     *
     * @memberof GQLJSON
     * @method parseLiteral
     * @static
     *
     * @param {Object} ast the Abstract Syntax Tree representing the JSON
     * type to parse.
     * @return {String|Array|Object|Number|Null} valid JSON types converted as
     * expected.
     */

  }, {
    key: 'parseLiteral',
    value: function parseLiteral(ast) {
      switch (ast.kind) {
        case _language.Kind.STRING:
        case _language.Kind.BOOLEAN:
          return ast.value;

        case _language.Kind.INT:
          return parseInt(ast.value, 10);
        case _language.Kind.FLOAT:
          return parseFloat(ast.value);

        case _language.Kind.OBJECT:
          {
            var value = (0, _create2.default)(null);
            ast.fields.forEach(function (field) {
              value[field.name.value] = GQLJSON.parseLiteral(field.value);
            });

            return value;
          }

        case _language.Kind.LIST:
          return ast.values.map(GQLJSON.parseLiteral);

        default:
          return null;
      }
    }

    /** @inheritdoc */

  }, {
    key: 'apiDocs',
    value: function apiDocs() {
      var DOC_CLASS = this.DOC_CLASS,
          joinLines = this.joinLines;


      return joinLines`
      The \`JSON\` scalar type represents JSON values as specified by
      [ECMA-404](http://www.ecma-international.org/publications/files${'ECMA-ST/ECMA-404.pdf'})
    `;
    }
  }, {
    key: 'name',
    get: function get() {
      return 'JSON';
    }
  }]);
  return GQLJSON;
}(_GQLScalar2.GQLScalar)) || _class);
//# sourceMappingURL=GQLJSON.js.map