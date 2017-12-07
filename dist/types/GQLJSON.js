'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLJSON = undefined;

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _dec, _class;

var _GQLScalar = require('../GQLScalar');

var _Schema = require('../decorators/Schema');

var _language = require('graphql/language');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let GQLJSON = exports.GQLJSON = (_dec = (0, _Schema.Schema)('scalar JSON'), _dec(_class = class GQLJSON extends _GQLScalar.GQLScalar {
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
  static serialize(value) {
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
  static get name() {
    return 'JSON';
  }

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
  static parseValue(value) {
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
  static parseLiteral(ast) {
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
          const value = (0, _create2.default)(null);
          ast.fields.forEach(field => {
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
  static apiDocs() {
    const { DOC_CLASS, joinLines } = this;

    return joinLines`
      The \`JSON\` scalar type represents JSON values as specified by
      [ECMA-404](http://www.ecma-international.org/publications/files${'ECMA-ST/ECMA-404.pdf'})
    `;
  }
}) || _class);
//# sourceMappingURL=GQLJSON.js.map