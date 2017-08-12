import { GQLScalar } from 'graphql-lattice'
import { Kind } from 'graphql/language'

@Schema('scalar JSON')
export class GQLJSON extends GQLScalar {
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
  static serialize(value: mixed): mixed {
    return value;
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
  static parseValue(value: ?mixed): ?mixed {
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
  static parseLiteral(ast: Object): ?mixed {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;

      case Kind.INT:
        return parseInt(ast.value, 10);
      case Kind.FLOAT:
        return parseFloat(ast.value);

      case Kind.OBJECT: {
        const value = Object.create(null);
        ast.fields.forEach(field => {
          value[field.name.value] = GQLJSON.parseLiteral(field.value)
        })

        return value;
      }

      case Kind.LIST:
        return ast.values.map(GQLJSON.parseLiteral)

      default:
        return null;
    }
  }

  /** @inheritdoc */
  static apiDocs(): Object {
    const { DOC_CLASS, joinLines } = this;

    return joinLines`
      The \`JSON\` scalar type represents JSON values as specified by
      [ECMA-404](http://www.ecma-international.org/publications/files${
      'ECMA-ST/ECMA-404.pdf'})
    `
  }
}
