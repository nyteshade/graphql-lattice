'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLInterface = undefined;

var _GQLBase = require('./GQLBase');

var _graphql = require('graphql');

/**
 * Used by Lattice to implement interface types in the schema when necessary
 *
 * @class GQLInterface
 */
/**
 @namespace GQLInterface
 
 */

let GQLInterface = exports.GQLInterface = class GQLInterface extends _GQLBase.GQLBase {

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
  static resolveType(model) {
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
  static get GQL_TYPE() {
    return _graphql.GraphQLInterfaceType;
  }
};
//# sourceMappingURL=GQLInterface.js.map