"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLJSON = void 0;

var _GQLScalar = require("../GQLScalar");

var _Schema = require("../decorators/Schema");

var _language = require("graphql/language");

var _dec, _class;

let GQLJSON = (_dec = (0, _Schema.Schema)('scalar JSON'), _dec(_class = class GQLJSON extends _GQLScalar.GQLScalar {
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
          const value = Object.create(null);
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
    const {
      DOC_CLASS,
      joinLines
    } = this;
    return joinLines`
      The \`JSON\` scalar type represents JSON values as specified by
      [ECMA-404](http://www.ecma-international.org/publications/files${'ECMA-ST/ECMA-404.pdf'})
    `;
  }

}) || _class);
exports.GQLJSON = GQLJSON;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi90eXBlcy9HUUxKU09OLmpzIl0sIm5hbWVzIjpbIkdRTEpTT04iLCJHUUxTY2FsYXIiLCJzZXJpYWxpemUiLCJ2YWx1ZSIsIm5hbWUiLCJwYXJzZVZhbHVlIiwicGFyc2VMaXRlcmFsIiwiYXN0Iiwia2luZCIsIktpbmQiLCJTVFJJTkciLCJCT09MRUFOIiwiSU5UIiwicGFyc2VJbnQiLCJGTE9BVCIsInBhcnNlRmxvYXQiLCJPQkpFQ1QiLCJPYmplY3QiLCJjcmVhdGUiLCJmaWVsZHMiLCJmb3JFYWNoIiwiZmllbGQiLCJMSVNUIiwidmFsdWVzIiwibWFwIiwiYXBpRG9jcyIsIkRPQ19DTEFTUyIsImpvaW5MaW5lcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0lBR2FBLE8sV0FEWixvQkFBTyxhQUFQLEMsZ0JBQUQsTUFDYUEsT0FEYixTQUM2QkMsb0JBRDdCLENBQ3VDO0FBQ3JDOzs7Ozs7Ozs7OztBQVdBLFNBQU9DLFNBQVAsQ0FBaUJDLEtBQWpCLEVBQXNDO0FBQ3BDLFdBQU9BLEtBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7OztBQVNBLGFBQVdDLElBQVgsR0FBa0I7QUFDaEIsV0FBTyxNQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7OztBQVdBLFNBQU9DLFVBQVAsQ0FBa0JGLEtBQWxCLEVBQXlDO0FBQ3ZDLFdBQU9BLEtBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FBY0EsU0FBT0csWUFBUCxDQUFvQkMsR0FBcEIsRUFBeUM7QUFDdkMsWUFBUUEsR0FBRyxDQUFDQyxJQUFaO0FBQ0UsV0FBS0MsZUFBS0MsTUFBVjtBQUNBLFdBQUtELGVBQUtFLE9BQVY7QUFDRSxlQUFPSixHQUFHLENBQUNKLEtBQVg7O0FBRUYsV0FBS00sZUFBS0csR0FBVjtBQUNFLGVBQU9DLFFBQVEsQ0FBQ04sR0FBRyxDQUFDSixLQUFMLEVBQVksRUFBWixDQUFmOztBQUNGLFdBQUtNLGVBQUtLLEtBQVY7QUFDRSxlQUFPQyxVQUFVLENBQUNSLEdBQUcsQ0FBQ0osS0FBTCxDQUFqQjs7QUFFRixXQUFLTSxlQUFLTyxNQUFWO0FBQWtCO0FBQ2hCLGdCQUFNYixLQUFLLEdBQUdjLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsQ0FBZDtBQUNBWCxVQUFBQSxHQUFHLENBQUNZLE1BQUosQ0FBV0MsT0FBWCxDQUFtQkMsS0FBSyxJQUFJO0FBQzFCbEIsWUFBQUEsS0FBSyxDQUFDa0IsS0FBSyxDQUFDakIsSUFBTixDQUFXRCxLQUFaLENBQUwsR0FBMEJILE9BQU8sQ0FBQ00sWUFBUixDQUFxQmUsS0FBSyxDQUFDbEIsS0FBM0IsQ0FBMUI7QUFDRCxXQUZEO0FBSUEsaUJBQU9BLEtBQVA7QUFDRDs7QUFFRCxXQUFLTSxlQUFLYSxJQUFWO0FBQ0UsZUFBT2YsR0FBRyxDQUFDZ0IsTUFBSixDQUFXQyxHQUFYLENBQWV4QixPQUFPLENBQUNNLFlBQXZCLENBQVA7O0FBRUY7QUFDRSxlQUFPLElBQVA7QUF2Qko7QUF5QkQ7QUFFRDs7O0FBQ0EsU0FBT21CLE9BQVAsR0FBeUI7QUFDdkIsVUFBTTtBQUFFQyxNQUFBQSxTQUFGO0FBQWFDLE1BQUFBO0FBQWIsUUFBMkIsSUFBakM7QUFFQSxXQUFPQSxTQUFVOzt1RUFHZixzQkFBdUI7S0FIekI7QUFLRDs7QUEvRm9DLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHUUxTY2FsYXIgfSBmcm9tICcuLi9HUUxTY2FsYXInXG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuLi9kZWNvcmF0b3JzL1NjaGVtYSdcbmltcG9ydCB7IEtpbmQgfSBmcm9tICdncmFwaHFsL2xhbmd1YWdlJ1xuXG5AU2NoZW1hKCdzY2FsYXIgSlNPTicpXG5leHBvcnQgY2xhc3MgR1FMSlNPTiBleHRlbmRzIEdRTFNjYWxhciB7XG4gIC8qKlxuICAgKiBTaW5jZSBKU09OIHN0YW5kcyBmb3IgSmF2YVNjcmlwdCBPYmplY3QgTm90YXRpb24sIGl0cyB2YWx1ZXMgbmVlZCBub1xuICAgKiBkaXJlY3QgY29udmVyc2lvbi4gU2ltcGx5IHBhc3MgYmFjayB3aGF0IGlzIHBhc3NlZCBpbi5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEpTT05cbiAgICogQG1ldGhvZCBzZXJpYWxpemVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge21peGVkfE51bGx9IHZhbHVlIGEgdmFsaWQgSmF2YVNjcmlwdCBvYmplY3RcbiAgICogQHJldHVybiB7bWl4ZWR8TnVsbH0gdGhlIHNhbWUgdmFsdWUgdGhhdCB3YXMgcGFzc2VkIGluLlxuICAgKi9cbiAgc3RhdGljIHNlcmlhbGl6ZSh2YWx1ZTogbWl4ZWQpOiBtaXhlZCB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIFxuICAvKipcbiAgICogQWxsIHByb2Nlc3NpbmcgYnkgR3JhcGhRTCBMYXR0aWNlIHVzZXMgdGhlIENsYXNzLm5hbWUgcHJvcGVydHkuIFdlIHdhbnQgXG4gICAqIHRvIHJlcG9ydCBKU09OIGFuZCBub3QgR1FMSlNPTiBzbyB0aGlzIGlzIHdoYXQgd2UgZG8uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxKU09OXG4gICAqIEBtZXRob2QgbmFtZSBcbiAgICogQHN0YXRpY1xuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBuYW1lKCkge1xuICAgIHJldHVybiAnSlNPTic7XG4gIH1cblxuICAvKipcbiAgICogU2luY2UgSlNPTiBzdGFuZHMgZm9yIEphdmFTY3JpcHQgT2JqZWN0IE5vdGF0aW9uLCBpdHMgdmFsdWVzIG5lZWQgbm9cbiAgICogZGlyZWN0IGNvbnZlcnNpb24uIFNpbXBseSBwYXNzIGJhY2sgd2hhdCBpcyBwYXNzZWQgaW4uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxKU09OXG4gICAqIEBtZXRob2QgcGFyc2VWYWx1ZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bWl4ZWR8TnVsbH0gdmFsdWUgYSB2YWxpZCBKYXZhU2NyaXB0IG9iamVjdFxuICAgKiBAcmV0dXJuIHttaXhlZHxOdWxsfSB0aGUgc2FtZSB2YWx1ZSB0aGF0IHdhcyBwYXNzZWQgaW4uXG4gICAqL1xuICBzdGF0aWMgcGFyc2VWYWx1ZSh2YWx1ZTogP21peGVkKTogP21peGVkIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gbGl0ZXJhbCB2YWx1ZXMsIGBwYXJzZUxpdGVyYWxgIHdpbGwgd2FsayB0aGUgb2JqZWN0IGFuZCBidWlsZFxuICAgKiB1cCBhbiBlcXVpdmFsZW50IHZlcnNpb24gb2YgaXRzZWxmIGFzIGFuIG9iamVjdCB0aGF0IHNob3VsZCBgcGFyc2UoKWBcbiAgICogYW5kIGBzdHJpbmdpZnkoKWAgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxKU09OXG4gICAqIEBtZXRob2QgcGFyc2VMaXRlcmFsXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFzdCB0aGUgQWJzdHJhY3QgU3ludGF4IFRyZWUgcmVwcmVzZW50aW5nIHRoZSBKU09OXG4gICAqIHR5cGUgdG8gcGFyc2UuXG4gICAqIEByZXR1cm4ge1N0cmluZ3xBcnJheXxPYmplY3R8TnVtYmVyfE51bGx9IHZhbGlkIEpTT04gdHlwZXMgY29udmVydGVkIGFzXG4gICAqIGV4cGVjdGVkLlxuICAgKi9cbiAgc3RhdGljIHBhcnNlTGl0ZXJhbChhc3Q6IE9iamVjdCk6ID9taXhlZCB7XG4gICAgc3dpdGNoIChhc3Qua2luZCkge1xuICAgICAgY2FzZSBLaW5kLlNUUklORzpcbiAgICAgIGNhc2UgS2luZC5CT09MRUFOOlxuICAgICAgICByZXR1cm4gYXN0LnZhbHVlO1xuXG4gICAgICBjYXNlIEtpbmQuSU5UOlxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoYXN0LnZhbHVlLCAxMCk7XG4gICAgICBjYXNlIEtpbmQuRkxPQVQ6XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGFzdC52YWx1ZSk7XG5cbiAgICAgIGNhc2UgS2luZC5PQkpFQ1Q6IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBhc3QuZmllbGRzLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICAgIHZhbHVlW2ZpZWxkLm5hbWUudmFsdWVdID0gR1FMSlNPTi5wYXJzZUxpdGVyYWwoZmllbGQudmFsdWUpXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBjYXNlIEtpbmQuTElTVDpcbiAgICAgICAgcmV0dXJuIGFzdC52YWx1ZXMubWFwKEdRTEpTT04ucGFyc2VMaXRlcmFsKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhdGljIGFwaURvY3MoKTogT2JqZWN0IHtcbiAgICBjb25zdCB7IERPQ19DTEFTUywgam9pbkxpbmVzIH0gPSB0aGlzO1xuXG4gICAgcmV0dXJuIGpvaW5MaW5lc2BcbiAgICAgIFRoZSBcXGBKU09OXFxgIHNjYWxhciB0eXBlIHJlcHJlc2VudHMgSlNPTiB2YWx1ZXMgYXMgc3BlY2lmaWVkIGJ5XG4gICAgICBbRUNNQS00MDRdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9wdWJsaWNhdGlvbnMvZmlsZXMke1xuICAgICAgJ0VDTUEtU1QvRUNNQS00MDQucGRmJ30pXG4gICAgYFxuICB9XG59XG4iXX0=