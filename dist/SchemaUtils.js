"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SchemaUtils = void 0;

var _path = _interopRequireDefault(require("path"));

var _SyntaxTree = require("./SyntaxTree");

var _GQLBase = require("./GQLBase");

var _GQLEnum = require("./GQLEnum");

var _GQLInterface = require("./GQLInterface");

var _GQLScalar = require("./GQLScalar");

var _neTypes = require("ne-types");

var _utils = require("./utils");

var _lodash = require("lodash");

var _events = _interopRequireDefault(require("events"));

var _graphql = require("graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The SchemaUtils is used by tools such as GQLExpressMiddleware in order to
 * apply GraphQL Lattice specifics to the build schema.
 *
 * @class SchemaUtils
 */
class SchemaUtils extends _events.default {
  /**
   * Calls all the Lattice post-schema creation routines on a given Schema
   * using data from a supplied array of classes.
   *
   * @param {GraphQLSchema} schema the schema to post-process
   * @param {Array<GQLBase>} Classes the Classes from which to drive post
   * processing data from
   */
  static injectAll(schema, Classes) {
    SchemaUtils.injectInterfaceResolvers(schema, Classes);
    SchemaUtils.injectEnums(schema, Classes);
    SchemaUtils.injectScalars(schema, Classes);
    SchemaUtils.injectComments(schema, Classes);
  }
  /**
   * Until such time as I can get the reference Facebook GraphQL AST parser to
   * read and apply descriptions or until such time as I employ the Apollo
   * AST parser, providing a `static get apiDocs()` getter is the way to get
   * your descriptions into the proper fields, post schema creation.
   *
   * This method walks the types in the registered classes and the supplied
   * schema type. It then injects the written comments such that they can
   * be exposed in graphiql and to applications or code that read the meta
   * fields of a built schema
   *
   * @memberof SchemaUtils
   * @method ⌾⠀injectComments
   * @static
   * @since 2.7.0
   *
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   * @param {Function[]} Classes these are GQLBase extended classes used to
   * manipulate the schema with.
   */


  static injectComments(schema, Classes) {
    const {
      DOC_CLASS,
      DOC_FIELDS,
      DOC_QUERIES,
      DOC_MUTATORS,
      DOC_SUBSCRIPTIONS,
      DOC_QUERY,
      DOC_MUTATION,
      DOC_SUBSCRIPTION
    } = _GQLBase.GQLBase;

    for (let Class of Classes) {
      const docs = Class.apiDocs();
      const query = schema._typeMap.Query;
      const mutation = schema._typeMap.Mutation;
      const subscription = schema._typeMap.Subscription;
      let type;

      if (type = schema._typeMap[Class.name]) {
        let fields = type._fields;
        let values = type._values;

        if (docs[DOC_CLASS]) {
          type.description = docs[DOC_CLASS];
        }

        for (let field of Object.keys(docs[DOC_FIELDS] || {})) {
          if (fields && field in fields) {
            fields[field].description = docs[DOC_FIELDS][field];
          }

          if (values) {
            for (let value of values) {
              if (value.name === field) {
                value.description = docs[DOC_FIELDS][field];
              }
            }
          }
        }
      }

      for (let [_type, _CONST, _topCONST] of [[query, DOC_QUERIES, DOC_QUERY], [mutation, DOC_MUTATORS, DOC_MUTATION], [subscription, DOC_SUBSCRIPTIONS, DOC_SUBSCRIPTION]]) {
        if (_type && (Object.keys(docs[_CONST] || {}).length || docs[_topCONST] && docs[_topCONST].length)) {
          let fields = _type._fields;

          if (docs[_topCONST]) {
            _type.description = docs[_topCONST];
          }

          for (let field of Object.keys(docs[_CONST])) {
            if (field in fields) {
              fields[field].description = docs[_CONST][field];
            }
          }
        }
      }
    }
  }
  /**
   * Somewhat like `injectComments` and other similar methods, the
   * `injectInterfaceResolvers` method walks the registered classes and
   * finds `GQLInterface` types and applies their `resolveType()`
   * implementations.
   *
   * @memberof SchemaUtils
   * @method ⌾⠀injectInterfaceResolvers
   * @static
   *
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   * @param {Function[]} Classes these are GQLBase extended classes used to
   * manipulate the schema with.
   */


  static injectInterfaceResolvers(schema, Classes) {
    for (let Class of Classes) {
      if (Class.GQL_TYPE === _graphql.GraphQLInterfaceType) {
        schema._typeMap[Class.name].resolveType = schema._typeMap[Class.name]._typeConfig.resolveType = Class.resolveType;
      }
    }
  }
  /**
   * Somewhat like `injectComments` and other similar methods, the
   * `injectInterfaceResolvers` method walks the registered classes and
   * finds `GQLInterface` types and applies their `resolveType()`
   * implementations.
   *
   * @memberof SchemaUtils
   * @method ⌾⠀injectEnums
   * @static
   *
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   * @param {Function[]} Classes these are GQLBase extended classes used to
   * manipulate the schema with.
   */


  static injectEnums(schema, Classes) {
    for (let Class of Classes) {
      if (Class.GQL_TYPE === _graphql.GraphQLEnumType) {
        const __enum = schema._typeMap[Class.name];
        const values = Class.values;

        for (let value of __enum._values) {
          if (value.name in values) {
            (0, _lodash.merge)(value, values[value.name]);
          }
        }
      }
    }
  }
  /**
   * GQLScalar types must define three methods to have a valid implementation.
   * They are serialize, parseValue and parseLiteral. See their docs for more
   * info on how to do so.
   *
   * This code finds each scalar and adds their implementation details to the
   * generated schema type config.
   *
   * @memberof SchemaUtils
   * @method ⌾⠀injectScalars
   * @static
   *
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   * @param {Function[]} Classes these are GQLBase extended classes used to
   * manipulate the schema with.
   */


  static injectScalars(schema, Classes) {
    for (let Class of Classes) {
      if (Class.GQL_TYPE === _graphql.GraphQLScalarType) {
        // @ComputedType
        const type = schema._typeMap[Class.name]; // @ComputedType

        const {
          serialize,
          parseValue,
          parseLiteral
        } = Class;

        if (!serialize || !parseValue || !parseLiteral) {
          // @ComputedType
          _utils.LatticeLogs.error(`Scalar type ${Class.name} has invaild impl.`);

          continue;
        }

        (0, _lodash.merge)(type._scalarConfig, {
          serialize,
          parseValue,
          parseLiteral
        });
      }
    }
  }
  /**
   * A function that combines the IDL schemas of all the supplied classes and
   * returns that value to the middleware getter.
   *
   * @static
   * @memberof GQLExpressMiddleware
   * @method ⌾⠀generateSchemaSDL
   *
   * @return {string} a dynamically generated GraphQL IDL schema string
   */


  static generateSchemaSDL(Classes, logOutput = true) {
    let schema = _SyntaxTree.SyntaxTree.EmptyDocument();

    let log = (...args) => {
      if (logOutput) {
        console.log(...args);
      }
    };

    for (let Class of Classes) {
      let classSchema = Class.SCHEMA;

      if ((0, _neTypes.typeOf)(classSchema) === 'Symbol') {
        let handler = Class.handler;

        let filename = _path.default.basename(Class.handler.path);

        classSchema = handler.getSchema();
        log(`\nRead schema (%s)\n%s\n%s\n`, filename, '-'.repeat(14 + filename.length), classSchema.replace(/^/gm, '  '));
      }

      schema.appendDefinitions(classSchema);
    }

    log('\nGenerated GraphQL Schema\n----------------\n%s', schema);
    return schema.toString();
  }
  /**
   * An asynchronous function used to parse the supplied classes for each
   * ones resolvers and mutators. These are all combined into a single root
   * object passed to express-graphql.
   *
   * @static
   * @memberof SchemaUtils
   * @method ⌾⠀createMergedRoot
   *
   * @param {Array<GQLBase>} Classes the GQLBase extended class objects or
   * functions from which to merge the RESOLVERS and MUTATORS functions.
   * @param {Object} requestData for Express apss, this will be an object
   * containing { req, res, gql } where those are the Express request and
   * response object as well as the GraphQL parameters for the request.
   * @return {Promise<Object>} a Promise resolving to an Object containing all
   * the functions described in both Query and Mutation types.
   */


  static async createMergedRoot(Classes, requestData, separateByType = false) {
    const root = {};

    for (let Class of Classes) {
      (0, _lodash.merge)(root, ( // $FlowFixMe
      await Class.getMergedRoot(requestData, separateByType)));
    }

    return root;
  }

}

exports.SchemaUtils = SchemaUtils;
var _default = SchemaUtils;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9TY2hlbWFVdGlscy5qcyJdLCJuYW1lcyI6WyJTY2hlbWFVdGlscyIsIkV2ZW50RW1pdHRlciIsImluamVjdEFsbCIsInNjaGVtYSIsIkNsYXNzZXMiLCJpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnMiLCJpbmplY3RFbnVtcyIsImluamVjdFNjYWxhcnMiLCJpbmplY3RDb21tZW50cyIsIkRPQ19DTEFTUyIsIkRPQ19GSUVMRFMiLCJET0NfUVVFUklFUyIsIkRPQ19NVVRBVE9SUyIsIkRPQ19TVUJTQ1JJUFRJT05TIiwiRE9DX1FVRVJZIiwiRE9DX01VVEFUSU9OIiwiRE9DX1NVQlNDUklQVElPTiIsIkdRTEJhc2UiLCJDbGFzcyIsImRvY3MiLCJhcGlEb2NzIiwicXVlcnkiLCJfdHlwZU1hcCIsIlF1ZXJ5IiwibXV0YXRpb24iLCJNdXRhdGlvbiIsInN1YnNjcmlwdGlvbiIsIlN1YnNjcmlwdGlvbiIsInR5cGUiLCJuYW1lIiwiZmllbGRzIiwiX2ZpZWxkcyIsInZhbHVlcyIsIl92YWx1ZXMiLCJkZXNjcmlwdGlvbiIsImZpZWxkIiwiT2JqZWN0Iiwia2V5cyIsInZhbHVlIiwiX3R5cGUiLCJfQ09OU1QiLCJfdG9wQ09OU1QiLCJsZW5ndGgiLCJHUUxfVFlQRSIsIkdyYXBoUUxJbnRlcmZhY2VUeXBlIiwicmVzb2x2ZVR5cGUiLCJfdHlwZUNvbmZpZyIsIkdyYXBoUUxFbnVtVHlwZSIsIl9fZW51bSIsIkdyYXBoUUxTY2FsYXJUeXBlIiwic2VyaWFsaXplIiwicGFyc2VWYWx1ZSIsInBhcnNlTGl0ZXJhbCIsImxsIiwiZXJyb3IiLCJfc2NhbGFyQ29uZmlnIiwiZ2VuZXJhdGVTY2hlbWFTREwiLCJsb2dPdXRwdXQiLCJTeW50YXhUcmVlIiwiRW1wdHlEb2N1bWVudCIsImxvZyIsImFyZ3MiLCJjb25zb2xlIiwiY2xhc3NTY2hlbWEiLCJTQ0hFTUEiLCJoYW5kbGVyIiwiZmlsZW5hbWUiLCJwYXRoIiwiYmFzZW5hbWUiLCJnZXRTY2hlbWEiLCJyZXBlYXQiLCJyZXBsYWNlIiwiYXBwZW5kRGVmaW5pdGlvbnMiLCJ0b1N0cmluZyIsImNyZWF0ZU1lcmdlZFJvb3QiLCJyZXF1ZXN0RGF0YSIsInNlcGFyYXRlQnlUeXBlIiwicm9vdCIsImdldE1lcmdlZFJvb3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVVBOzs7Ozs7QUFNTyxNQUFNQSxXQUFOLFNBQTBCQyxlQUExQixDQUF1QztBQUM1Qzs7Ozs7Ozs7QUFRQSxTQUFPQyxTQUFQLENBQWlCQyxNQUFqQixFQUF3Q0MsT0FBeEMsRUFBaUU7QUFDL0RKLElBQUFBLFdBQVcsQ0FBQ0ssd0JBQVosQ0FBcUNGLE1BQXJDLEVBQTZDQyxPQUE3QztBQUNBSixJQUFBQSxXQUFXLENBQUNNLFdBQVosQ0FBd0JILE1BQXhCLEVBQWdDQyxPQUFoQztBQUNBSixJQUFBQSxXQUFXLENBQUNPLGFBQVosQ0FBMEJKLE1BQTFCLEVBQWtDQyxPQUFsQztBQUNBSixJQUFBQSxXQUFXLENBQUNRLGNBQVosQ0FBMkJMLE1BQTNCLEVBQW1DQyxPQUFuQztBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBLFNBQU9JLGNBQVAsQ0FBc0JMLE1BQXRCLEVBQXNDQyxPQUF0QyxFQUErRDtBQUM3RCxVQUFNO0FBQ0pLLE1BQUFBLFNBREk7QUFDT0MsTUFBQUEsVUFEUDtBQUNtQkMsTUFBQUEsV0FEbkI7QUFDZ0NDLE1BQUFBLFlBRGhDO0FBQzhDQyxNQUFBQSxpQkFEOUM7QUFFSkMsTUFBQUEsU0FGSTtBQUVPQyxNQUFBQSxZQUZQO0FBRXFCQyxNQUFBQTtBQUZyQixRQUdGQyxnQkFISjs7QUFLQSxTQUFLLElBQUlDLEtBQVQsSUFBa0JkLE9BQWxCLEVBQTJCO0FBQ3pCLFlBQU1lLElBQUksR0FBR0QsS0FBSyxDQUFDRSxPQUFOLEVBQWI7QUFDQSxZQUFNQyxLQUFLLEdBQUdsQixNQUFNLENBQUNt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QVEsQ0FBQ3hCLE1BQXpCLENBSEMsRUFJRHFCLFdBQVcsQ0FBQ1EsT0FBWixDQUFvQixLQUFwQixFQUEyQixJQUEzQixDQUpDLENBQUg7QUFNRDs7QUFFRHBFLE1BQUFBLE1BQU0sQ0FBQ3FFLGlCQUFQLENBQXlCVCxXQUF6QjtBQUNEOztBQUVESCxJQUFBQSxHQUFHLENBQUMsa0RBQUQsRUFBcUR6RCxNQUFyRCxDQUFIO0FBRUEsV0FBT0EsTUFBTSxDQUFDc0UsUUFBUCxFQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxlQUFhQyxnQkFBYixDQUNFdEUsT0FERixFQUVFdUUsV0FGRixFQUdFQyxjQUF1QixHQUFHLEtBSDVCLEVBSW1CO0FBQ2pCLFVBQU1DLElBQUksR0FBRyxFQUFiOztBQUVBLFNBQUssSUFBSTNELEtBQVQsSUFBa0JkLE9BQWxCLEVBQTJCO0FBQ3pCLHlCQUNFeUUsSUFERixJQUVFO0FBQ0EsWUFBTTNELEtBQUssQ0FBQzRELGFBQU4sQ0FBb0JILFdBQXBCLEVBQWlDQyxjQUFqQyxDQUhSO0FBS0Q7O0FBRUQsV0FBT0MsSUFBUDtBQUNEOztBQWhSMkM7OztlQW1SL0I3RSxXIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IFN5bnRheFRyZWUgfSBmcm9tICcuL1N5bnRheFRyZWUnXG5pbXBvcnQgeyBHUUxCYXNlLCBNRVRBX0tFWSB9IGZyb20gJy4vR1FMQmFzZSdcbmltcG9ydCB7IEdRTEVudW0gfSBmcm9tICcuL0dRTEVudW0nXG5pbXBvcnQgeyBHUUxJbnRlcmZhY2UgfSBmcm9tICcuL0dRTEludGVyZmFjZSdcbmltcG9ydCB7IEdRTFNjYWxhciB9IGZyb20gJy4vR1FMU2NhbGFyJ1xuaW1wb3J0IHsgdHlwZU9mIH0gZnJvbSAnbmUtdHlwZXMnXG5pbXBvcnQgeyBMYXR0aWNlTG9ncyBhcyBsbCB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaCdcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHtcbiAgcGFyc2UsXG4gIHByaW50LFxuICBidWlsZFNjaGVtYSxcbiAgR3JhcGhRTEludGVyZmFjZVR5cGUsXG4gIEdyYXBoUUxFbnVtVHlwZSxcbiAgR3JhcGhRTFNjYWxhclR5cGUsXG4gIEdyYXBoUUxTY2hlbWFcbn0gZnJvbSAnZ3JhcGhxbCdcblxuLyoqXG4gKiBUaGUgU2NoZW1hVXRpbHMgaXMgdXNlZCBieSB0b29scyBzdWNoIGFzIEdRTEV4cHJlc3NNaWRkbGV3YXJlIGluIG9yZGVyIHRvXG4gKiBhcHBseSBHcmFwaFFMIExhdHRpY2Ugc3BlY2lmaWNzIHRvIHRoZSBidWlsZCBzY2hlbWEuXG4gKlxuICogQGNsYXNzIFNjaGVtYVV0aWxzXG4gKi9cbmV4cG9ydCBjbGFzcyBTY2hlbWFVdGlscyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDYWxscyBhbGwgdGhlIExhdHRpY2UgcG9zdC1zY2hlbWEgY3JlYXRpb24gcm91dGluZXMgb24gYSBnaXZlbiBTY2hlbWFcbiAgICogdXNpbmcgZGF0YSBmcm9tIGEgc3VwcGxpZWQgYXJyYXkgb2YgY2xhc3Nlcy5cbiAgICpcbiAgICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hfSBzY2hlbWEgdGhlIHNjaGVtYSB0byBwb3N0LXByb2Nlc3NcbiAgICogQHBhcmFtIHtBcnJheTxHUUxCYXNlPn0gQ2xhc3NlcyB0aGUgQ2xhc3NlcyBmcm9tIHdoaWNoIHRvIGRyaXZlIHBvc3RcbiAgICogcHJvY2Vzc2luZyBkYXRhIGZyb21cbiAgICovXG4gIHN0YXRpYyBpbmplY3RBbGwoc2NoZW1hOiBHcmFwaFFMU2NoZW1hLCBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPikge1xuICAgIFNjaGVtYVV0aWxzLmluamVjdEludGVyZmFjZVJlc29sdmVycyhzY2hlbWEsIENsYXNzZXMpO1xuICAgIFNjaGVtYVV0aWxzLmluamVjdEVudW1zKHNjaGVtYSwgQ2xhc3Nlcyk7XG4gICAgU2NoZW1hVXRpbHMuaW5qZWN0U2NhbGFycyhzY2hlbWEsIENsYXNzZXMpO1xuICAgIFNjaGVtYVV0aWxzLmluamVjdENvbW1lbnRzKHNjaGVtYSwgQ2xhc3Nlcyk7XG4gIH1cblxuICAvKipcbiAgICogVW50aWwgc3VjaCB0aW1lIGFzIEkgY2FuIGdldCB0aGUgcmVmZXJlbmNlIEZhY2Vib29rIEdyYXBoUUwgQVNUIHBhcnNlciB0b1xuICAgKiByZWFkIGFuZCBhcHBseSBkZXNjcmlwdGlvbnMgb3IgdW50aWwgc3VjaCB0aW1lIGFzIEkgZW1wbG95IHRoZSBBcG9sbG9cbiAgICogQVNUIHBhcnNlciwgcHJvdmlkaW5nIGEgYHN0YXRpYyBnZXQgYXBpRG9jcygpYCBnZXR0ZXIgaXMgdGhlIHdheSB0byBnZXRcbiAgICogeW91ciBkZXNjcmlwdGlvbnMgaW50byB0aGUgcHJvcGVyIGZpZWxkcywgcG9zdCBzY2hlbWEgY3JlYXRpb24uXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHdhbGtzIHRoZSB0eXBlcyBpbiB0aGUgcmVnaXN0ZXJlZCBjbGFzc2VzIGFuZCB0aGUgc3VwcGxpZWRcbiAgICogc2NoZW1hIHR5cGUuIEl0IHRoZW4gaW5qZWN0cyB0aGUgd3JpdHRlbiBjb21tZW50cyBzdWNoIHRoYXQgdGhleSBjYW5cbiAgICogYmUgZXhwb3NlZCBpbiBncmFwaGlxbCBhbmQgdG8gYXBwbGljYXRpb25zIG9yIGNvZGUgdGhhdCByZWFkIHRoZSBtZXRhXG4gICAqIGZpZWxkcyBvZiBhIGJ1aWx0IHNjaGVtYVxuICAgKlxuICAgKiBAbWVtYmVyb2YgU2NoZW1hVXRpbHNcbiAgICogQG1ldGhvZCDijL7ioIBpbmplY3RDb21tZW50c1xuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAyLjcuMFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gc2NoZW1hIGEgYnVpbHQgR3JhcGhRTFNjaGVtYSBvYmplY3QgY3JlYXRlZCB2aWEgYnVpbGRTY2hlbWFcbiAgICogb3Igc29tZSBvdGhlciBhbHRlcm5hdGl2ZSBidXQgY29tcGF0aWJsZSBtYW5uZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBDbGFzc2VzIHRoZXNlIGFyZSBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzZXMgdXNlZCB0b1xuICAgKiBtYW5pcHVsYXRlIHRoZSBzY2hlbWEgd2l0aC5cbiAgICovXG4gIHN0YXRpYyBpbmplY3RDb21tZW50cyhzY2hlbWE6IE9iamVjdCwgQ2xhc3NlczogQXJyYXk8R1FMQmFzZT4pIHtcbiAgICBjb25zdCB7XG4gICAgICBET0NfQ0xBU1MsIERPQ19GSUVMRFMsIERPQ19RVUVSSUVTLCBET0NfTVVUQVRPUlMsIERPQ19TVUJTQ1JJUFRJT05TLFxuICAgICAgRE9DX1FVRVJZLCBET0NfTVVUQVRJT04sIERPQ19TVUJTQ1JJUFRJT05cbiAgICB9ID0gR1FMQmFzZTtcblxuICAgIGZvciAobGV0IENsYXNzIG9mIENsYXNzZXMpIHtcbiAgICAgIGNvbnN0IGRvY3MgPSBDbGFzcy5hcGlEb2NzKCk7XG4gICAgICBjb25zdCBxdWVyeSA9IHNjaGVtYS5fdHlwZU1hcC5RdWVyeTtcbiAgICAgIGNvbnN0IG11dGF0aW9uID0gc2NoZW1hLl90eXBlTWFwLk11dGF0aW9uO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc2NoZW1hLl90eXBlTWFwLlN1YnNjcmlwdGlvbjtcbiAgICAgIGxldCB0eXBlO1xuXG4gICAgICBpZiAoKHR5cGUgPSBzY2hlbWEuX3R5cGVNYXBbQ2xhc3MubmFtZV0pKSB7XG4gICAgICAgIGxldCBmaWVsZHMgPSB0eXBlLl9maWVsZHM7XG4gICAgICAgIGxldCB2YWx1ZXMgPSB0eXBlLl92YWx1ZXM7XG5cbiAgICAgICAgaWYgKGRvY3NbRE9DX0NMQVNTXSkgeyB0eXBlLmRlc2NyaXB0aW9uID0gZG9jc1tET0NfQ0xBU1NdIH1cblxuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkb2NzW0RPQ19GSUVMRFNdIHx8IHt9KSkge1xuICAgICAgICAgIGlmIChmaWVsZHMgJiYgZmllbGQgaW4gZmllbGRzKSB7XG4gICAgICAgICAgICBmaWVsZHNbZmllbGRdLmRlc2NyaXB0aW9uID0gZG9jc1tET0NfRklFTERTXVtmaWVsZF07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgICBpZiAodmFsdWUubmFtZSA9PT0gZmllbGQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZS5kZXNjcmlwdGlvbiA9IGRvY3NbRE9DX0ZJRUxEU11bZmllbGRdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgW190eXBlLCBfQ09OU1QsIF90b3BDT05TVF0gb2YgW1xuICAgICAgICBbcXVlcnksIERPQ19RVUVSSUVTLCBET0NfUVVFUlldLFxuICAgICAgICBbbXV0YXRpb24sIERPQ19NVVRBVE9SUywgRE9DX01VVEFUSU9OXSxcbiAgICAgICAgW3N1YnNjcmlwdGlvbiwgRE9DX1NVQlNDUklQVElPTlMsIERPQ19TVUJTQ1JJUFRJT05dXG4gICAgICBdKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBfdHlwZVxuICAgICAgICAgICYmIChcbiAgICAgICAgICAgIChPYmplY3Qua2V5cyhkb2NzW19DT05TVF0gfHwge30pLmxlbmd0aClcbiAgICAgICAgICAgIHx8IChkb2NzW190b3BDT05TVF0gJiYgZG9jc1tfdG9wQ09OU1RdLmxlbmd0aClcbiAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgIGxldCBmaWVsZHMgPSBfdHlwZS5fZmllbGRzO1xuXG4gICAgICAgICAgaWYgKGRvY3NbX3RvcENPTlNUXSkge1xuICAgICAgICAgICAgX3R5cGUuZGVzY3JpcHRpb24gPSBkb2NzW190b3BDT05TVF1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkb2NzW19DT05TVF0pKSB7XG4gICAgICAgICAgICBpZiAoZmllbGQgaW4gZmllbGRzKSB7XG4gICAgICAgICAgICAgIGZpZWxkc1tmaWVsZF0uZGVzY3JpcHRpb24gPSBkb2NzW19DT05TVF1bZmllbGRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTb21ld2hhdCBsaWtlIGBpbmplY3RDb21tZW50c2AgYW5kIG90aGVyIHNpbWlsYXIgbWV0aG9kcywgdGhlXG4gICAqIGBpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnNgIG1ldGhvZCB3YWxrcyB0aGUgcmVnaXN0ZXJlZCBjbGFzc2VzIGFuZFxuICAgKiBmaW5kcyBgR1FMSW50ZXJmYWNlYCB0eXBlcyBhbmQgYXBwbGllcyB0aGVpciBgcmVzb2x2ZVR5cGUoKWBcbiAgICogaW1wbGVtZW50YXRpb25zLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgU2NoZW1hVXRpbHNcbiAgICogQG1ldGhvZCDijL7ioIBpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gc2NoZW1hIGEgYnVpbHQgR3JhcGhRTFNjaGVtYSBvYmplY3QgY3JlYXRlZCB2aWEgYnVpbGRTY2hlbWFcbiAgICogb3Igc29tZSBvdGhlciBhbHRlcm5hdGl2ZSBidXQgY29tcGF0aWJsZSBtYW5uZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBDbGFzc2VzIHRoZXNlIGFyZSBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzZXMgdXNlZCB0b1xuICAgKiBtYW5pcHVsYXRlIHRoZSBzY2hlbWEgd2l0aC5cbiAgICovXG4gIHN0YXRpYyBpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnMoc2NoZW1hOiBPYmplY3QsIENsYXNzZXM6IEFycmF5PEdRTEJhc2U+KSB7XG4gICAgZm9yIChsZXQgQ2xhc3Mgb2YgQ2xhc3Nlcykge1xuICAgICAgaWYgKENsYXNzLkdRTF9UWVBFID09PSBHcmFwaFFMSW50ZXJmYWNlVHlwZSkge1xuICAgICAgICBzY2hlbWEuX3R5cGVNYXBbQ2xhc3MubmFtZV0ucmVzb2x2ZVR5cGUgPVxuICAgICAgICBzY2hlbWEuX3R5cGVNYXBbQ2xhc3MubmFtZV0uX3R5cGVDb25maWcucmVzb2x2ZVR5cGUgPVxuICAgICAgICAgIENsYXNzLnJlc29sdmVUeXBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTb21ld2hhdCBsaWtlIGBpbmplY3RDb21tZW50c2AgYW5kIG90aGVyIHNpbWlsYXIgbWV0aG9kcywgdGhlXG4gICAqIGBpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnNgIG1ldGhvZCB3YWxrcyB0aGUgcmVnaXN0ZXJlZCBjbGFzc2VzIGFuZFxuICAgKiBmaW5kcyBgR1FMSW50ZXJmYWNlYCB0eXBlcyBhbmQgYXBwbGllcyB0aGVpciBgcmVzb2x2ZVR5cGUoKWBcbiAgICogaW1wbGVtZW50YXRpb25zLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgU2NoZW1hVXRpbHNcbiAgICogQG1ldGhvZCDijL7ioIBpbmplY3RFbnVtc1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzY2hlbWEgYSBidWlsdCBHcmFwaFFMU2NoZW1hIG9iamVjdCBjcmVhdGVkIHZpYSBidWlsZFNjaGVtYVxuICAgKiBvciBzb21lIG90aGVyIGFsdGVybmF0aXZlIGJ1dCBjb21wYXRpYmxlIG1hbm5lclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IENsYXNzZXMgdGhlc2UgYXJlIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3NlcyB1c2VkIHRvXG4gICAqIG1hbmlwdWxhdGUgdGhlIHNjaGVtYSB3aXRoLlxuICAgKi9cbiAgc3RhdGljIGluamVjdEVudW1zKHNjaGVtYTogT2JqZWN0LCBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPikge1xuICAgIGZvciAobGV0IENsYXNzIG9mIENsYXNzZXMpIHtcbiAgICAgIGlmIChDbGFzcy5HUUxfVFlQRSA9PT0gR3JhcGhRTEVudW1UeXBlKSB7XG4gICAgICAgIGNvbnN0IF9fZW51bSA9IHNjaGVtYS5fdHlwZU1hcFtDbGFzcy5uYW1lXTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gQ2xhc3MudmFsdWVzO1xuXG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIF9fZW51bS5fdmFsdWVzKSB7XG4gICAgICAgICAgaWYgKHZhbHVlLm5hbWUgaW4gdmFsdWVzKSB7XG4gICAgICAgICAgICBtZXJnZSh2YWx1ZSwgdmFsdWVzW3ZhbHVlLm5hbWVdKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHUUxTY2FsYXIgdHlwZXMgbXVzdCBkZWZpbmUgdGhyZWUgbWV0aG9kcyB0byBoYXZlIGEgdmFsaWQgaW1wbGVtZW50YXRpb24uXG4gICAqIFRoZXkgYXJlIHNlcmlhbGl6ZSwgcGFyc2VWYWx1ZSBhbmQgcGFyc2VMaXRlcmFsLiBTZWUgdGhlaXIgZG9jcyBmb3IgbW9yZVxuICAgKiBpbmZvIG9uIGhvdyB0byBkbyBzby5cbiAgICpcbiAgICogVGhpcyBjb2RlIGZpbmRzIGVhY2ggc2NhbGFyIGFuZCBhZGRzIHRoZWlyIGltcGxlbWVudGF0aW9uIGRldGFpbHMgdG8gdGhlXG4gICAqIGdlbmVyYXRlZCBzY2hlbWEgdHlwZSBjb25maWcuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFVdGlsc1xuICAgKiBAbWV0aG9kIOKMvuKggGluamVjdFNjYWxhcnNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gc2NoZW1hIGEgYnVpbHQgR3JhcGhRTFNjaGVtYSBvYmplY3QgY3JlYXRlZCB2aWEgYnVpbGRTY2hlbWFcbiAgICogb3Igc29tZSBvdGhlciBhbHRlcm5hdGl2ZSBidXQgY29tcGF0aWJsZSBtYW5uZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBDbGFzc2VzIHRoZXNlIGFyZSBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzZXMgdXNlZCB0b1xuICAgKiBtYW5pcHVsYXRlIHRoZSBzY2hlbWEgd2l0aC5cbiAgICovXG4gIHN0YXRpYyBpbmplY3RTY2FsYXJzKHNjaGVtYTogT2JqZWN0LCBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPikge1xuICAgIGZvciAobGV0IENsYXNzIG9mIENsYXNzZXMpIHtcbiAgICAgIGlmIChDbGFzcy5HUUxfVFlQRSA9PT0gR3JhcGhRTFNjYWxhclR5cGUpIHtcbiAgICAgICAgLy8gQENvbXB1dGVkVHlwZVxuICAgICAgICBjb25zdCB0eXBlID0gc2NoZW1hLl90eXBlTWFwW0NsYXNzLm5hbWVdO1xuXG4gICAgICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICAgICAgY29uc3QgeyBzZXJpYWxpemUsIHBhcnNlVmFsdWUsIHBhcnNlTGl0ZXJhbCB9ID0gQ2xhc3M7XG5cbiAgICAgICAgaWYgKCFzZXJpYWxpemUgfHwgIXBhcnNlVmFsdWUgfHwgIXBhcnNlTGl0ZXJhbCkge1xuICAgICAgICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICAgICAgICBsbC5lcnJvcihgU2NhbGFyIHR5cGUgJHtDbGFzcy5uYW1lfSBoYXMgaW52YWlsZCBpbXBsLmApO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVyZ2UodHlwZS5fc2NhbGFyQ29uZmlnLCB7XG4gICAgICAgICAgc2VyaWFsaXplLFxuICAgICAgICAgIHBhcnNlVmFsdWUsXG4gICAgICAgICAgcGFyc2VMaXRlcmFsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgY29tYmluZXMgdGhlIElETCBzY2hlbWFzIG9mIGFsbCB0aGUgc3VwcGxpZWQgY2xhc3NlcyBhbmRcbiAgICogcmV0dXJucyB0aGF0IHZhbHVlIHRvIHRoZSBtaWRkbGV3YXJlIGdldHRlci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMRXhwcmVzc01pZGRsZXdhcmVcbiAgICogQG1ldGhvZCDijL7ioIBnZW5lcmF0ZVNjaGVtYVNETFxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGEgZHluYW1pY2FsbHkgZ2VuZXJhdGVkIEdyYXBoUUwgSURMIHNjaGVtYSBzdHJpbmdcbiAgICovXG4gIHN0YXRpYyBnZW5lcmF0ZVNjaGVtYVNETChcbiAgICBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPixcbiAgICBsb2dPdXRwdXQ6IGJvb2xlYW4gPSB0cnVlXG4gICk6IHN0cmluZyB7XG4gICAgbGV0IHNjaGVtYSA9IFN5bnRheFRyZWUuRW1wdHlEb2N1bWVudCgpO1xuICAgIGxldCBsb2cgPSAoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKGxvZ091dHB1dCkge1xuICAgICAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBDbGFzcyBvZiBDbGFzc2VzKSB7XG4gICAgICBsZXQgY2xhc3NTY2hlbWEgPSBDbGFzcy5TQ0hFTUE7XG5cbiAgICAgIGlmICh0eXBlT2YoY2xhc3NTY2hlbWEpID09PSAnU3ltYm9sJykge1xuICAgICAgICBsZXQgaGFuZGxlciA9IENsYXNzLmhhbmRsZXI7XG4gICAgICAgIGxldCBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUoQ2xhc3MuaGFuZGxlci5wYXRoKVxuXG4gICAgICAgIGNsYXNzU2NoZW1hID0gaGFuZGxlci5nZXRTY2hlbWEoKTtcbiAgICAgICAgbG9nKFxuICAgICAgICAgIGBcXG5SZWFkIHNjaGVtYSAoJXMpXFxuJXNcXG4lc1xcbmAsXG4gICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgJy0nLnJlcGVhdCgxNCArIGZpbGVuYW1lLmxlbmd0aCksXG4gICAgICAgICAgY2xhc3NTY2hlbWEucmVwbGFjZSgvXi9nbSwgJyAgJylcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBzY2hlbWEuYXBwZW5kRGVmaW5pdGlvbnMoY2xhc3NTY2hlbWEpO1xuICAgIH1cblxuICAgIGxvZygnXFxuR2VuZXJhdGVkIEdyYXBoUUwgU2NoZW1hXFxuLS0tLS0tLS0tLS0tLS0tLVxcbiVzJywgc2NoZW1hKTtcblxuICAgIHJldHVybiBzY2hlbWEudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhc3luY2hyb25vdXMgZnVuY3Rpb24gdXNlZCB0byBwYXJzZSB0aGUgc3VwcGxpZWQgY2xhc3NlcyBmb3IgZWFjaFxuICAgKiBvbmVzIHJlc29sdmVycyBhbmQgbXV0YXRvcnMuIFRoZXNlIGFyZSBhbGwgY29tYmluZWQgaW50byBhIHNpbmdsZSByb290XG4gICAqIG9iamVjdCBwYXNzZWQgdG8gZXhwcmVzcy1ncmFwaHFsLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFVdGlsc1xuICAgKiBAbWV0aG9kIOKMvuKggGNyZWF0ZU1lcmdlZFJvb3RcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxHUUxCYXNlPn0gQ2xhc3NlcyB0aGUgR1FMQmFzZSBleHRlbmRlZCBjbGFzcyBvYmplY3RzIG9yXG4gICAqIGZ1bmN0aW9ucyBmcm9tIHdoaWNoIHRvIG1lcmdlIHRoZSBSRVNPTFZFUlMgYW5kIE1VVEFUT1JTIGZ1bmN0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3REYXRhIGZvciBFeHByZXNzIGFwc3MsIHRoaXMgd2lsbCBiZSBhbiBvYmplY3RcbiAgICogY29udGFpbmluZyB7IHJlcSwgcmVzLCBncWwgfSB3aGVyZSB0aG9zZSBhcmUgdGhlIEV4cHJlc3MgcmVxdWVzdCBhbmRcbiAgICogcmVzcG9uc2Ugb2JqZWN0IGFzIHdlbGwgYXMgdGhlIEdyYXBoUUwgcGFyYW1ldGVycyBmb3IgdGhlIHJlcXVlc3QuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn0gYSBQcm9taXNlIHJlc29sdmluZyB0byBhbiBPYmplY3QgY29udGFpbmluZyBhbGxcbiAgICogdGhlIGZ1bmN0aW9ucyBkZXNjcmliZWQgaW4gYm90aCBRdWVyeSBhbmQgTXV0YXRpb24gdHlwZXMuXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgY3JlYXRlTWVyZ2VkUm9vdChcbiAgICBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPixcbiAgICByZXF1ZXN0RGF0YTogT2JqZWN0LFxuICAgIHNlcGFyYXRlQnlUeXBlOiBib29sZWFuID0gZmFsc2VcbiAgKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICBjb25zdCByb290ID0ge307XG5cbiAgICBmb3IgKGxldCBDbGFzcyBvZiBDbGFzc2VzKSB7XG4gICAgICBtZXJnZShcbiAgICAgICAgcm9vdCxcbiAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgICBhd2FpdCBDbGFzcy5nZXRNZXJnZWRSb290KHJlcXVlc3REYXRhLCBzZXBhcmF0ZUJ5VHlwZSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NoZW1hVXRpbHNcbiJdfQ==