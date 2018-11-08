"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLJSON = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _GQLScalar2 = require("../GQLScalar");

var _Schema = require("../decorators/Schema");

var _language = require("graphql/language");

var _dec, _class;

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n      The `JSON` scalar type represents JSON values as specified by\n      [ECMA-404](http://www.ecma-international.org/publications/files", ")\n    "], ["\n      The \\`JSON\\` scalar type represents JSON values as specified by\n      [ECMA-404](http://www.ecma-international.org/publications/files", ")\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var GQLJSON = (_dec = (0, _Schema.Schema)('scalar JSON'), _dec(_class =
/*#__PURE__*/
function (_GQLScalar) {
  (0, _inherits2.default)(GQLJSON, _GQLScalar);

  function GQLJSON() {
    (0, _classCallCheck2.default)(this, GQLJSON);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GQLJSON).apply(this, arguments));
  }

  (0, _createClass2.default)(GQLJSON, null, [{
    key: "serialize",

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
    key: "parseValue",

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
    key: "parseLiteral",
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
            var value = Object.create(null);
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
    key: "apiDocs",
    value: function apiDocs() {
      var DOC_CLASS = this.DOC_CLASS,
          joinLines = this.joinLines;
      return joinLines(_templateObject(), 'ECMA-ST/ECMA-404.pdf');
    }
  }, {
    key: "name",
    get: function get() {
      return 'JSON';
    }
  }]);
  return GQLJSON;
}(_GQLScalar2.GQLScalar)) || _class);
exports.GQLJSON = GQLJSON;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi90eXBlcy9HUUxKU09OLmpzIl0sIm5hbWVzIjpbIkdRTEpTT04iLCJ2YWx1ZSIsImFzdCIsImtpbmQiLCJLaW5kIiwiU1RSSU5HIiwiQk9PTEVBTiIsIklOVCIsInBhcnNlSW50IiwiRkxPQVQiLCJwYXJzZUZsb2F0IiwiT0JKRUNUIiwiT2JqZWN0IiwiY3JlYXRlIiwiZmllbGRzIiwiZm9yRWFjaCIsImZpZWxkIiwibmFtZSIsInBhcnNlTGl0ZXJhbCIsIkxJU1QiLCJ2YWx1ZXMiLCJtYXAiLCJET0NfQ0xBU1MiLCJqb2luTGluZXMiLCJHUUxTY2FsYXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUdhQSxPLFdBRFosb0JBQU8sYUFBUCxDOzs7Ozs7Ozs7Ozs7O0FBRUM7Ozs7Ozs7Ozs7OzhCQVdpQkMsSyxFQUFxQjtBQUNwQyxhQUFPQSxLQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7Ozs7OzsrQkFXa0JBLEssRUFBdUI7QUFDdkMsYUFBT0EsS0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O2lDQWNvQkMsRyxFQUFxQjtBQUN2QyxjQUFRQSxHQUFHLENBQUNDLElBQVo7QUFDRSxhQUFLQyxlQUFLQyxNQUFWO0FBQ0EsYUFBS0QsZUFBS0UsT0FBVjtBQUNFLGlCQUFPSixHQUFHLENBQUNELEtBQVg7O0FBRUYsYUFBS0csZUFBS0csR0FBVjtBQUNFLGlCQUFPQyxRQUFRLENBQUNOLEdBQUcsQ0FBQ0QsS0FBTCxFQUFZLEVBQVosQ0FBZjs7QUFDRixhQUFLRyxlQUFLSyxLQUFWO0FBQ0UsaUJBQU9DLFVBQVUsQ0FBQ1IsR0FBRyxDQUFDRCxLQUFMLENBQWpCOztBQUVGLGFBQUtHLGVBQUtPLE1BQVY7QUFBa0I7QUFDaEIsZ0JBQU1WLEtBQUssR0FBR1csTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUFkO0FBQ0FYLFlBQUFBLEdBQUcsQ0FBQ1ksTUFBSixDQUFXQyxPQUFYLENBQW1CLFVBQUFDLEtBQUssRUFBSTtBQUMxQmYsY0FBQUEsS0FBSyxDQUFDZSxLQUFLLENBQUNDLElBQU4sQ0FBV2hCLEtBQVosQ0FBTCxHQUEwQkQsT0FBTyxDQUFDa0IsWUFBUixDQUFxQkYsS0FBSyxDQUFDZixLQUEzQixDQUExQjtBQUNELGFBRkQ7QUFJQSxtQkFBT0EsS0FBUDtBQUNEOztBQUVELGFBQUtHLGVBQUtlLElBQVY7QUFDRSxpQkFBT2pCLEdBQUcsQ0FBQ2tCLE1BQUosQ0FBV0MsR0FBWCxDQUFlckIsT0FBTyxDQUFDa0IsWUFBdkIsQ0FBUDs7QUFFRjtBQUNFLGlCQUFPLElBQVA7QUF2Qko7QUF5QkQ7QUFFRDs7Ozs4QkFDeUI7QUFBQSxVQUNmSSxTQURlLEdBQ1UsSUFEVixDQUNmQSxTQURlO0FBQUEsVUFDSkMsU0FESSxHQUNVLElBRFYsQ0FDSkEsU0FESTtBQUd2QixhQUFPQSxTQUFQLG9CQUdFLHNCQUhGO0FBS0Q7Ozt3QkF0RWlCO0FBQ2hCLGFBQU8sTUFBUDtBQUNEOzs7RUEzQjBCQyxxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdRTFNjYWxhciB9IGZyb20gJy4uL0dRTFNjYWxhcidcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gJy4uL2RlY29yYXRvcnMvU2NoZW1hJ1xuaW1wb3J0IHsgS2luZCB9IGZyb20gJ2dyYXBocWwvbGFuZ3VhZ2UnXG5cbkBTY2hlbWEoJ3NjYWxhciBKU09OJylcbmV4cG9ydCBjbGFzcyBHUUxKU09OIGV4dGVuZHMgR1FMU2NhbGFyIHtcbiAgLyoqXG4gICAqIFNpbmNlIEpTT04gc3RhbmRzIGZvciBKYXZhU2NyaXB0IE9iamVjdCBOb3RhdGlvbiwgaXRzIHZhbHVlcyBuZWVkIG5vXG4gICAqIGRpcmVjdCBjb252ZXJzaW9uLiBTaW1wbHkgcGFzcyBiYWNrIHdoYXQgaXMgcGFzc2VkIGluLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMSlNPTlxuICAgKiBAbWV0aG9kIHNlcmlhbGl6ZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bWl4ZWR8TnVsbH0gdmFsdWUgYSB2YWxpZCBKYXZhU2NyaXB0IG9iamVjdFxuICAgKiBAcmV0dXJuIHttaXhlZHxOdWxsfSB0aGUgc2FtZSB2YWx1ZSB0aGF0IHdhcyBwYXNzZWQgaW4uXG4gICAqL1xuICBzdGF0aWMgc2VyaWFsaXplKHZhbHVlOiBtaXhlZCk6IG1peGVkIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBBbGwgcHJvY2Vzc2luZyBieSBHcmFwaFFMIExhdHRpY2UgdXNlcyB0aGUgQ2xhc3MubmFtZSBwcm9wZXJ0eS4gV2Ugd2FudCBcbiAgICogdG8gcmVwb3J0IEpTT04gYW5kIG5vdCBHUUxKU09OIHNvIHRoaXMgaXMgd2hhdCB3ZSBkby5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEpTT05cbiAgICogQG1ldGhvZCBuYW1lIFxuICAgKiBAc3RhdGljXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuICdKU09OJztcbiAgfVxuXG4gIC8qKlxuICAgKiBTaW5jZSBKU09OIHN0YW5kcyBmb3IgSmF2YVNjcmlwdCBPYmplY3QgTm90YXRpb24sIGl0cyB2YWx1ZXMgbmVlZCBub1xuICAgKiBkaXJlY3QgY29udmVyc2lvbi4gU2ltcGx5IHBhc3MgYmFjayB3aGF0IGlzIHBhc3NlZCBpbi5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEpTT05cbiAgICogQG1ldGhvZCBwYXJzZVZhbHVlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHttaXhlZHxOdWxsfSB2YWx1ZSBhIHZhbGlkIEphdmFTY3JpcHQgb2JqZWN0XG4gICAqIEByZXR1cm4ge21peGVkfE51bGx9IHRoZSBzYW1lIHZhbHVlIHRoYXQgd2FzIHBhc3NlZCBpbi5cbiAgICovXG4gIHN0YXRpYyBwYXJzZVZhbHVlKHZhbHVlOiA/bWl4ZWQpOiA/bWl4ZWQge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBsaXRlcmFsIHZhbHVlcywgYHBhcnNlTGl0ZXJhbGAgd2lsbCB3YWxrIHRoZSBvYmplY3QgYW5kIGJ1aWxkXG4gICAqIHVwIGFuIGVxdWl2YWxlbnQgdmVyc2lvbiBvZiBpdHNlbGYgYXMgYW4gb2JqZWN0IHRoYXQgc2hvdWxkIGBwYXJzZSgpYFxuICAgKiBhbmQgYHN0cmluZ2lmeSgpYCBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEpTT05cbiAgICogQG1ldGhvZCBwYXJzZUxpdGVyYWxcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXN0IHRoZSBBYnN0cmFjdCBTeW50YXggVHJlZSByZXByZXNlbnRpbmcgdGhlIEpTT05cbiAgICogdHlwZSB0byBwYXJzZS5cbiAgICogQHJldHVybiB7U3RyaW5nfEFycmF5fE9iamVjdHxOdW1iZXJ8TnVsbH0gdmFsaWQgSlNPTiB0eXBlcyBjb252ZXJ0ZWQgYXNcbiAgICogZXhwZWN0ZWQuXG4gICAqL1xuICBzdGF0aWMgcGFyc2VMaXRlcmFsKGFzdDogT2JqZWN0KTogP21peGVkIHtcbiAgICBzd2l0Y2ggKGFzdC5raW5kKSB7XG4gICAgICBjYXNlIEtpbmQuU1RSSU5HOlxuICAgICAgY2FzZSBLaW5kLkJPT0xFQU46XG4gICAgICAgIHJldHVybiBhc3QudmFsdWU7XG5cbiAgICAgIGNhc2UgS2luZC5JTlQ6XG4gICAgICAgIHJldHVybiBwYXJzZUludChhc3QudmFsdWUsIDEwKTtcbiAgICAgIGNhc2UgS2luZC5GTE9BVDpcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYXN0LnZhbHVlKTtcblxuICAgICAgY2FzZSBLaW5kLk9CSkVDVDoge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGFzdC5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgICAgdmFsdWVbZmllbGQubmFtZS52YWx1ZV0gPSBHUUxKU09OLnBhcnNlTGl0ZXJhbChmaWVsZC52YWx1ZSlcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgS2luZC5MSVNUOlxuICAgICAgICByZXR1cm4gYXN0LnZhbHVlcy5tYXAoR1FMSlNPTi5wYXJzZUxpdGVyYWwpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGF0aWMgYXBpRG9jcygpOiBPYmplY3Qge1xuICAgIGNvbnN0IHsgRE9DX0NMQVNTLCBqb2luTGluZXMgfSA9IHRoaXM7XG5cbiAgICByZXR1cm4gam9pbkxpbmVzYFxuICAgICAgVGhlIFxcYEpTT05cXGAgc2NhbGFyIHR5cGUgcmVwcmVzZW50cyBKU09OIHZhbHVlcyBhcyBzcGVjaWZpZWQgYnlcbiAgICAgIFtFQ01BLTQwNF0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL3B1YmxpY2F0aW9ucy9maWxlcyR7XG4gICAgICAnRUNNQS1TVC9FQ01BLTQwNC5wZGYnfSlcbiAgICBgXG4gIH1cbn1cbiJdfQ==