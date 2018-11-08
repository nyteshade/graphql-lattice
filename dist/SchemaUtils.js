"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SchemaUtils = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

/**
 * The SchemaUtils is used by tools such as GQLExpressMiddleware in order to
 * apply GraphQL Lattice specifics to the build schema.
 *
 * @class SchemaUtils
 */
var SchemaUtils =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(SchemaUtils, _EventEmitter);

  function SchemaUtils() {
    (0, _classCallCheck2.default)(this, SchemaUtils);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SchemaUtils).apply(this, arguments));
  }

  (0, _createClass2.default)(SchemaUtils, null, [{
    key: "injectAll",

    /**
     * Calls all the Lattice post-schema creation routines on a given Schema
     * using data from a supplied array of classes.
     *
     * @param {GraphQLSchema} schema the schema to post-process
     * @param {Array<GQLBase>} Classes the Classes from which to drive post
     * processing data from
     */
    value: function injectAll(schema, Classes) {
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

  }, {
    key: "injectComments",
    value: function injectComments(schema, Classes) {
      var DOC_CLASS = _GQLBase.GQLBase.DOC_CLASS,
          DOC_FIELDS = _GQLBase.GQLBase.DOC_FIELDS,
          DOC_QUERIES = _GQLBase.GQLBase.DOC_QUERIES,
          DOC_MUTATORS = _GQLBase.GQLBase.DOC_MUTATORS,
          DOC_SUBSCRIPTIONS = _GQLBase.GQLBase.DOC_SUBSCRIPTIONS,
          DOC_QUERY = _GQLBase.GQLBase.DOC_QUERY,
          DOC_MUTATION = _GQLBase.GQLBase.DOC_MUTATION,
          DOC_SUBSCRIPTION = _GQLBase.GQLBase.DOC_SUBSCRIPTION;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Classes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var Class = _step.value;
          var docs = Class.apiDocs();
          var query = schema._typeMap.Query;
          var mutation = schema._typeMap.Mutation;
          var subscription = schema._typeMap.Subscription;
          var type = void 0;

          if (type = schema._typeMap[Class.name]) {
            var fields = type._fields;
            var values = type._values;

            if (docs[DOC_CLASS]) {
              type.description = docs[DOC_CLASS];
            }

            var _arr = Object.keys(docs[DOC_FIELDS] || {});

            for (var _i = 0; _i < _arr.length; _i++) {
              var field = _arr[_i];

              if (fields && field in fields) {
                fields[field].description = docs[DOC_FIELDS][field];
              }

              if (values) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var value = _step2.value;

                    if (value.name === field) {
                      value.description = docs[DOC_FIELDS][field];
                    }
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                      _iterator2.return();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }
              }
            }
          }

          var _arr2 = [[query, DOC_QUERIES, DOC_QUERY], [mutation, DOC_MUTATORS, DOC_MUTATION], [subscription, DOC_SUBSCRIPTIONS, DOC_SUBSCRIPTION]];

          for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
            var _arr2$_i = (0, _slicedToArray2.default)(_arr2[_i2], 3),
                _type = _arr2$_i[0],
                _CONST = _arr2$_i[1],
                _topCONST = _arr2$_i[2];

            if (_type && (Object.keys(docs[_CONST] || {}).length || docs[_topCONST] && docs[_topCONST].length)) {
              var _fields = _type._fields;

              if (docs[_topCONST]) {
                _type.description = docs[_topCONST];
              }

              var _arr3 = Object.keys(docs[_CONST]);

              for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
                var _field = _arr3[_i3];

                if (_field in _fields) {
                  _fields[_field].description = docs[_CONST][_field];
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
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

  }, {
    key: "injectInterfaceResolvers",
    value: function injectInterfaceResolvers(schema, Classes) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Classes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var Class = _step3.value;

          if (Class.GQL_TYPE === _graphql.GraphQLInterfaceType) {
            schema._typeMap[Class.name].resolveType = schema._typeMap[Class.name]._typeConfig.resolveType = Class.resolveType;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
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
     * @method ⌾⠀injectEnums
     * @static
     *
     * @param {Object} schema a built GraphQLSchema object created via buildSchema
     * or some other alternative but compatible manner
     * @param {Function[]} Classes these are GQLBase extended classes used to
     * manipulate the schema with.
     */

  }, {
    key: "injectEnums",
    value: function injectEnums(schema, Classes) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = Classes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var Class = _step4.value;

          if (Class.GQL_TYPE === _graphql.GraphQLEnumType) {
            var __enum = schema._typeMap[Class.name];
            var values = Class.values;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = __enum._values[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var value = _step5.value;

                if (value.name in values) {
                  (0, _lodash.merge)(value, values[value.name]);
                }
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
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

  }, {
    key: "injectScalars",
    value: function injectScalars(schema, Classes) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = Classes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var Class = _step6.value;

          if (Class.GQL_TYPE === _graphql.GraphQLScalarType) {
            // @ComputedType
            var type = schema._typeMap[Class.name]; // @ComputedType

            var serialize = Class.serialize,
                parseValue = Class.parseValue,
                parseLiteral = Class.parseLiteral;

            if (!serialize || !parseValue || !parseLiteral) {
              // @ComputedType
              _utils.LatticeLogs.error("Scalar type ".concat(Class.name, " has invaild impl."));

              continue;
            }

            (0, _lodash.merge)(type._scalarConfig, {
              serialize: serialize,
              parseValue: parseValue,
              parseLiteral: parseLiteral
            });
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
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

  }, {
    key: "generateSchemaSDL",
    value: function generateSchemaSDL(Classes) {
      var logOutput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var schema = _SyntaxTree.SyntaxTree.EmptyDocument();

      var log = function log() {
        if (logOutput) {
          var _console;

          (_console = console).log.apply(_console, arguments);
        }
      };

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = Classes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var Class = _step7.value;
          var classSchema = Class.SCHEMA;

          if ((0, _neTypes.typeOf)(classSchema) === 'Symbol') {
            var handler = Class.handler;

            var filename = _path.default.basename(Class.handler.path);

            classSchema = handler.getSchema();
            log("\nRead schema (%s)\n%s\n%s\n", filename, '-'.repeat(14 + filename.length), classSchema.replace(/^/gm, '  '));
          }

          schema.appendDefinitions(classSchema);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
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

  }, {
    key: "createMergedRoot",
    value: function () {
      var _createMergedRoot = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(Classes, requestData) {
        var separateByType,
            root,
            _iteratorNormalCompletion8,
            _didIteratorError8,
            _iteratorError8,
            _iterator8,
            _step8,
            Class,
            _args = arguments;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                separateByType = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
                root = {};
                _iteratorNormalCompletion8 = true;
                _didIteratorError8 = false;
                _iteratorError8 = undefined;
                _context.prev = 5;
                _iterator8 = Classes[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                  _context.next = 18;
                  break;
                }

                Class = _step8.value;
                _context.t0 = _lodash.merge;
                _context.t1 = root;
                _context.next = 13;
                return Class.getMergedRoot(requestData, separateByType);

              case 13:
                _context.t2 = _context.sent;
                (0, _context.t0)(_context.t1, _context.t2);

              case 15:
                _iteratorNormalCompletion8 = true;
                _context.next = 7;
                break;

              case 18:
                _context.next = 24;
                break;

              case 20:
                _context.prev = 20;
                _context.t3 = _context["catch"](5);
                _didIteratorError8 = true;
                _iteratorError8 = _context.t3;

              case 24:
                _context.prev = 24;
                _context.prev = 25;

                if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                  _iterator8.return();
                }

              case 27:
                _context.prev = 27;

                if (!_didIteratorError8) {
                  _context.next = 30;
                  break;
                }

                throw _iteratorError8;

              case 30:
                return _context.finish(27);

              case 31:
                return _context.finish(24);

              case 32:
                return _context.abrupt("return", root);

              case 33:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 20, 24, 32], [25,, 27, 31]]);
      }));

      return function createMergedRoot(_x, _x2) {
        return _createMergedRoot.apply(this, arguments);
      };
    }()
  }]);
  return SchemaUtils;
}(_events.default);

exports.SchemaUtils = SchemaUtils;
var _default = SchemaUtils;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9TY2hlbWFVdGlscy5qcyJdLCJuYW1lcyI6WyJTY2hlbWFVdGlscyIsInNjaGVtYSIsIkNsYXNzZXMiLCJpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnMiLCJpbmplY3RFbnVtcyIsImluamVjdFNjYWxhcnMiLCJpbmplY3RDb21tZW50cyIsIkRPQ19DTEFTUyIsIkdRTEJhc2UiLCJET0NfRklFTERTIiwiRE9DX1FVRVJJRVMiLCJET0NfTVVUQVRPUlMiLCJET0NfU1VCU0NSSVBUSU9OUyIsIkRPQ19RVUVSWSIsIkRPQ19NVVRBVElPTiIsIkRPQ19TVUJTQ1JJUFRJT04iLCJDbGFzcyIsImRvY3MiLCJhcGlEb2NzIiwicXVlcnkiLCJfdHlwZU1hcCIsIlF1ZXJ5IiwibXV0YXRpb24iLCJNdXRhdGlvbiIsInN1YnNjcmlwdGlvbiIsIlN1YnNjcmlwdGlvbiIsInR5cGUiLCJuYW1lIiwiZmllbGRzIiwiX2ZpZWxkcyIsInZhbHVlcyIsIl92YWx1ZXMiLCJkZXNjcmlwdGlvbiIsIk9iamVjdCIsImtleXMiLCJmaWVsZCIsInZhbHVlIiwiX3R5cGUiLCJfQ09OU1QiLCJfdG9wQ09OU1QiLCJsZW5ndGgiLCJHUUxfVFlQRSIsIkdyYXBoUUxJbnRlcmZhY2VUeXBlIiwicmVzb2x2ZVR5cGUiLCJfdHlwZUNvbmZpZyIsIkdyYXBoUUxFbnVtVHlwZSIsIl9fZW51bSIsIkdyYXBoUUxTY2FsYXJUeXBlIiwic2VyaWFsaXplIiwicGFyc2VWYWx1ZSIsInBhcnNlTGl0ZXJhbCIsImxsIiwiZXJyb3IiLCJfc2NhbGFyQ29uZmlnIiwibG9nT3V0cHV0IiwiU3ludGF4VHJlZSIsIkVtcHR5RG9jdW1lbnQiLCJsb2ciLCJjb25zb2xlIiwiY2xhc3NTY2hlbWEiLCJTQ0hFTUEiLCJoYW5kbGVyIiwiZmlsZW5hbWUiLCJwYXRoIiwiYmFzZW5hbWUiLCJnZXRTY2hlbWEiLCJyZXBlYXQiLCJyZXBsYWNlIiwiYXBwZW5kRGVmaW5pdGlvbnMiLCJ0b1N0cmluZyIsInJlcXVlc3REYXRhIiwic2VwYXJhdGVCeVR5cGUiLCJyb290IiwibWVyZ2UiLCJnZXRNZXJnZWRSb290IiwiRXZlbnRFbWl0dGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBVUE7Ozs7OztJQU1hQSxXOzs7Ozs7Ozs7Ozs7O0FBQ1g7Ozs7Ozs7OzhCQVFpQkMsTSxFQUF1QkMsTyxFQUF5QjtBQUMvREYsTUFBQUEsV0FBVyxDQUFDRyx3QkFBWixDQUFxQ0YsTUFBckMsRUFBNkNDLE9BQTdDO0FBQ0FGLE1BQUFBLFdBQVcsQ0FBQ0ksV0FBWixDQUF3QkgsTUFBeEIsRUFBZ0NDLE9BQWhDO0FBQ0FGLE1BQUFBLFdBQVcsQ0FBQ0ssYUFBWixDQUEwQkosTUFBMUIsRUFBa0NDLE9BQWxDO0FBQ0FGLE1BQUFBLFdBQVcsQ0FBQ00sY0FBWixDQUEyQkwsTUFBM0IsRUFBbUNDLE9BQW5DO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQXFCc0JELE0sRUFBZ0JDLE8sRUFBeUI7QUFBQSxVQUUzREssU0FGMkQsR0FJekRDLGdCQUp5RCxDQUUzREQsU0FGMkQ7QUFBQSxVQUVoREUsVUFGZ0QsR0FJekRELGdCQUp5RCxDQUVoREMsVUFGZ0Q7QUFBQSxVQUVwQ0MsV0FGb0MsR0FJekRGLGdCQUp5RCxDQUVwQ0UsV0FGb0M7QUFBQSxVQUV2QkMsWUFGdUIsR0FJekRILGdCQUp5RCxDQUV2QkcsWUFGdUI7QUFBQSxVQUVUQyxpQkFGUyxHQUl6REosZ0JBSnlELENBRVRJLGlCQUZTO0FBQUEsVUFHM0RDLFNBSDJELEdBSXpETCxnQkFKeUQsQ0FHM0RLLFNBSDJEO0FBQUEsVUFHaERDLFlBSGdELEdBSXpETixnQkFKeUQsQ0FHaERNLFlBSGdEO0FBQUEsVUFHbENDLGdCQUhrQyxHQUl6RFAsZ0JBSnlELENBR2xDTyxnQkFIa0M7QUFBQTtBQUFBO0FBQUE7O0FBQUE7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TztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQTJCUkYsTUFBQUEsR0FBRyxDQUFDLGtEQUFELEVBQXFEeEQsTUFBckQsQ0FBSDtBQUVBLGFBQU9BLE1BQU0sQ0FBQ29FLFFBQVAsRUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lEQWtCRW5FLE8sRUFDQW9FLFc7Ozs7Ozs7Ozs7Ozs7OztBQUNBQyxnQkFBQUEsYywyREFBMEIsSztBQUVwQkMsZ0JBQUFBLEksR0FBTyxFOzs7Ozs2QkFFS3RFLE87Ozs7Ozs7O0FBQVRjLGdCQUFBQSxLOzhCQUNQeUQsYTs4QkFDRUQsSTs7dUJBRU14RCxLQUFLLENBQUMwRCxhQUFOLENBQW9CSixXQUFwQixFQUFpQ0MsY0FBakMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpREFJSEMsSTs7Ozs7Ozs7Ozs7Ozs7OztFQS9Rc0JHLGU7OztlQW1SbEIzRSxXIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IFN5bnRheFRyZWUgfSBmcm9tICcuL1N5bnRheFRyZWUnXG5pbXBvcnQgeyBHUUxCYXNlLCBNRVRBX0tFWSB9IGZyb20gJy4vR1FMQmFzZSdcbmltcG9ydCB7IEdRTEVudW0gfSBmcm9tICcuL0dRTEVudW0nXG5pbXBvcnQgeyBHUUxJbnRlcmZhY2UgfSBmcm9tICcuL0dRTEludGVyZmFjZSdcbmltcG9ydCB7IEdRTFNjYWxhciB9IGZyb20gJy4vR1FMU2NhbGFyJ1xuaW1wb3J0IHsgdHlwZU9mIH0gZnJvbSAnbmUtdHlwZXMnXG5pbXBvcnQgeyBMYXR0aWNlTG9ncyBhcyBsbCB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaCdcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHtcbiAgcGFyc2UsXG4gIHByaW50LFxuICBidWlsZFNjaGVtYSxcbiAgR3JhcGhRTEludGVyZmFjZVR5cGUsXG4gIEdyYXBoUUxFbnVtVHlwZSxcbiAgR3JhcGhRTFNjYWxhclR5cGUsXG4gIEdyYXBoUUxTY2hlbWFcbn0gZnJvbSAnZ3JhcGhxbCdcblxuLyoqXG4gKiBUaGUgU2NoZW1hVXRpbHMgaXMgdXNlZCBieSB0b29scyBzdWNoIGFzIEdRTEV4cHJlc3NNaWRkbGV3YXJlIGluIG9yZGVyIHRvXG4gKiBhcHBseSBHcmFwaFFMIExhdHRpY2Ugc3BlY2lmaWNzIHRvIHRoZSBidWlsZCBzY2hlbWEuXG4gKlxuICogQGNsYXNzIFNjaGVtYVV0aWxzXG4gKi9cbmV4cG9ydCBjbGFzcyBTY2hlbWFVdGlscyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDYWxscyBhbGwgdGhlIExhdHRpY2UgcG9zdC1zY2hlbWEgY3JlYXRpb24gcm91dGluZXMgb24gYSBnaXZlbiBTY2hlbWFcbiAgICogdXNpbmcgZGF0YSBmcm9tIGEgc3VwcGxpZWQgYXJyYXkgb2YgY2xhc3Nlcy5cbiAgICpcbiAgICogQHBhcmFtIHtHcmFwaFFMU2NoZW1hfSBzY2hlbWEgdGhlIHNjaGVtYSB0byBwb3N0LXByb2Nlc3NcbiAgICogQHBhcmFtIHtBcnJheTxHUUxCYXNlPn0gQ2xhc3NlcyB0aGUgQ2xhc3NlcyBmcm9tIHdoaWNoIHRvIGRyaXZlIHBvc3RcbiAgICogcHJvY2Vzc2luZyBkYXRhIGZyb21cbiAgICovXG4gIHN0YXRpYyBpbmplY3RBbGwoc2NoZW1hOiBHcmFwaFFMU2NoZW1hLCBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPikge1xuICAgIFNjaGVtYVV0aWxzLmluamVjdEludGVyZmFjZVJlc29sdmVycyhzY2hlbWEsIENsYXNzZXMpO1xuICAgIFNjaGVtYVV0aWxzLmluamVjdEVudW1zKHNjaGVtYSwgQ2xhc3Nlcyk7XG4gICAgU2NoZW1hVXRpbHMuaW5qZWN0U2NhbGFycyhzY2hlbWEsIENsYXNzZXMpO1xuICAgIFNjaGVtYVV0aWxzLmluamVjdENvbW1lbnRzKHNjaGVtYSwgQ2xhc3Nlcyk7XG4gIH1cblxuICAvKipcbiAgICogVW50aWwgc3VjaCB0aW1lIGFzIEkgY2FuIGdldCB0aGUgcmVmZXJlbmNlIEZhY2Vib29rIEdyYXBoUUwgQVNUIHBhcnNlciB0b1xuICAgKiByZWFkIGFuZCBhcHBseSBkZXNjcmlwdGlvbnMgb3IgdW50aWwgc3VjaCB0aW1lIGFzIEkgZW1wbG95IHRoZSBBcG9sbG9cbiAgICogQVNUIHBhcnNlciwgcHJvdmlkaW5nIGEgYHN0YXRpYyBnZXQgYXBpRG9jcygpYCBnZXR0ZXIgaXMgdGhlIHdheSB0byBnZXRcbiAgICogeW91ciBkZXNjcmlwdGlvbnMgaW50byB0aGUgcHJvcGVyIGZpZWxkcywgcG9zdCBzY2hlbWEgY3JlYXRpb24uXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHdhbGtzIHRoZSB0eXBlcyBpbiB0aGUgcmVnaXN0ZXJlZCBjbGFzc2VzIGFuZCB0aGUgc3VwcGxpZWRcbiAgICogc2NoZW1hIHR5cGUuIEl0IHRoZW4gaW5qZWN0cyB0aGUgd3JpdHRlbiBjb21tZW50cyBzdWNoIHRoYXQgdGhleSBjYW5cbiAgICogYmUgZXhwb3NlZCBpbiBncmFwaGlxbCBhbmQgdG8gYXBwbGljYXRpb25zIG9yIGNvZGUgdGhhdCByZWFkIHRoZSBtZXRhXG4gICAqIGZpZWxkcyBvZiBhIGJ1aWx0IHNjaGVtYVxuICAgKlxuICAgKiBAbWVtYmVyb2YgU2NoZW1hVXRpbHNcbiAgICogQG1ldGhvZCDijL7ioIBpbmplY3RDb21tZW50c1xuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAyLjcuMFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gc2NoZW1hIGEgYnVpbHQgR3JhcGhRTFNjaGVtYSBvYmplY3QgY3JlYXRlZCB2aWEgYnVpbGRTY2hlbWFcbiAgICogb3Igc29tZSBvdGhlciBhbHRlcm5hdGl2ZSBidXQgY29tcGF0aWJsZSBtYW5uZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBDbGFzc2VzIHRoZXNlIGFyZSBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzZXMgdXNlZCB0b1xuICAgKiBtYW5pcHVsYXRlIHRoZSBzY2hlbWEgd2l0aC5cbiAgICovXG4gIHN0YXRpYyBpbmplY3RDb21tZW50cyhzY2hlbWE6IE9iamVjdCwgQ2xhc3NlczogQXJyYXk8R1FMQmFzZT4pIHtcbiAgICBjb25zdCB7XG4gICAgICBET0NfQ0xBU1MsIERPQ19GSUVMRFMsIERPQ19RVUVSSUVTLCBET0NfTVVUQVRPUlMsIERPQ19TVUJTQ1JJUFRJT05TLFxuICAgICAgRE9DX1FVRVJZLCBET0NfTVVUQVRJT04sIERPQ19TVUJTQ1JJUFRJT05cbiAgICB9ID0gR1FMQmFzZTtcblxuICAgIGZvciAobGV0IENsYXNzIG9mIENsYXNzZXMpIHtcbiAgICAgIGNvbnN0IGRvY3MgPSBDbGFzcy5hcGlEb2NzKCk7XG4gICAgICBjb25zdCBxdWVyeSA9IHNjaGVtYS5fdHlwZU1hcC5RdWVyeTtcbiAgICAgIGNvbnN0IG11dGF0aW9uID0gc2NoZW1hLl90eXBlTWFwLk11dGF0aW9uO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc2NoZW1hLl90eXBlTWFwLlN1YnNjcmlwdGlvbjtcbiAgICAgIGxldCB0eXBlO1xuXG4gICAgICBpZiAoKHR5cGUgPSBzY2hlbWEuX3R5cGVNYXBbQ2xhc3MubmFtZV0pKSB7XG4gICAgICAgIGxldCBmaWVsZHMgPSB0eXBlLl9maWVsZHM7XG4gICAgICAgIGxldCB2YWx1ZXMgPSB0eXBlLl92YWx1ZXM7XG5cbiAgICAgICAgaWYgKGRvY3NbRE9DX0NMQVNTXSkgeyB0eXBlLmRlc2NyaXB0aW9uID0gZG9jc1tET0NfQ0xBU1NdIH1cblxuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkb2NzW0RPQ19GSUVMRFNdIHx8IHt9KSkge1xuICAgICAgICAgIGlmIChmaWVsZHMgJiYgZmllbGQgaW4gZmllbGRzKSB7XG4gICAgICAgICAgICBmaWVsZHNbZmllbGRdLmRlc2NyaXB0aW9uID0gZG9jc1tET0NfRklFTERTXVtmaWVsZF07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgICBpZiAodmFsdWUubmFtZSA9PT0gZmllbGQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZS5kZXNjcmlwdGlvbiA9IGRvY3NbRE9DX0ZJRUxEU11bZmllbGRdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgW190eXBlLCBfQ09OU1QsIF90b3BDT05TVF0gb2YgW1xuICAgICAgICBbcXVlcnksIERPQ19RVUVSSUVTLCBET0NfUVVFUlldLFxuICAgICAgICBbbXV0YXRpb24sIERPQ19NVVRBVE9SUywgRE9DX01VVEFUSU9OXSxcbiAgICAgICAgW3N1YnNjcmlwdGlvbiwgRE9DX1NVQlNDUklQVElPTlMsIERPQ19TVUJTQ1JJUFRJT05dXG4gICAgICBdKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBfdHlwZVxuICAgICAgICAgICYmIChcbiAgICAgICAgICAgIChPYmplY3Qua2V5cyhkb2NzW19DT05TVF0gfHwge30pLmxlbmd0aClcbiAgICAgICAgICAgIHx8IChkb2NzW190b3BDT05TVF0gJiYgZG9jc1tfdG9wQ09OU1RdLmxlbmd0aClcbiAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgIGxldCBmaWVsZHMgPSBfdHlwZS5fZmllbGRzO1xuXG4gICAgICAgICAgaWYgKGRvY3NbX3RvcENPTlNUXSkge1xuICAgICAgICAgICAgX3R5cGUuZGVzY3JpcHRpb24gPSBkb2NzW190b3BDT05TVF1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkb2NzW19DT05TVF0pKSB7XG4gICAgICAgICAgICBpZiAoZmllbGQgaW4gZmllbGRzKSB7XG4gICAgICAgICAgICAgIGZpZWxkc1tmaWVsZF0uZGVzY3JpcHRpb24gPSBkb2NzW19DT05TVF1bZmllbGRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTb21ld2hhdCBsaWtlIGBpbmplY3RDb21tZW50c2AgYW5kIG90aGVyIHNpbWlsYXIgbWV0aG9kcywgdGhlXG4gICAqIGBpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnNgIG1ldGhvZCB3YWxrcyB0aGUgcmVnaXN0ZXJlZCBjbGFzc2VzIGFuZFxuICAgKiBmaW5kcyBgR1FMSW50ZXJmYWNlYCB0eXBlcyBhbmQgYXBwbGllcyB0aGVpciBgcmVzb2x2ZVR5cGUoKWBcbiAgICogaW1wbGVtZW50YXRpb25zLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgU2NoZW1hVXRpbHNcbiAgICogQG1ldGhvZCDijL7ioIBpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gc2NoZW1hIGEgYnVpbHQgR3JhcGhRTFNjaGVtYSBvYmplY3QgY3JlYXRlZCB2aWEgYnVpbGRTY2hlbWFcbiAgICogb3Igc29tZSBvdGhlciBhbHRlcm5hdGl2ZSBidXQgY29tcGF0aWJsZSBtYW5uZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBDbGFzc2VzIHRoZXNlIGFyZSBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzZXMgdXNlZCB0b1xuICAgKiBtYW5pcHVsYXRlIHRoZSBzY2hlbWEgd2l0aC5cbiAgICovXG4gIHN0YXRpYyBpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnMoc2NoZW1hOiBPYmplY3QsIENsYXNzZXM6IEFycmF5PEdRTEJhc2U+KSB7XG4gICAgZm9yIChsZXQgQ2xhc3Mgb2YgQ2xhc3Nlcykge1xuICAgICAgaWYgKENsYXNzLkdRTF9UWVBFID09PSBHcmFwaFFMSW50ZXJmYWNlVHlwZSkge1xuICAgICAgICBzY2hlbWEuX3R5cGVNYXBbQ2xhc3MubmFtZV0ucmVzb2x2ZVR5cGUgPVxuICAgICAgICBzY2hlbWEuX3R5cGVNYXBbQ2xhc3MubmFtZV0uX3R5cGVDb25maWcucmVzb2x2ZVR5cGUgPVxuICAgICAgICAgIENsYXNzLnJlc29sdmVUeXBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTb21ld2hhdCBsaWtlIGBpbmplY3RDb21tZW50c2AgYW5kIG90aGVyIHNpbWlsYXIgbWV0aG9kcywgdGhlXG4gICAqIGBpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnNgIG1ldGhvZCB3YWxrcyB0aGUgcmVnaXN0ZXJlZCBjbGFzc2VzIGFuZFxuICAgKiBmaW5kcyBgR1FMSW50ZXJmYWNlYCB0eXBlcyBhbmQgYXBwbGllcyB0aGVpciBgcmVzb2x2ZVR5cGUoKWBcbiAgICogaW1wbGVtZW50YXRpb25zLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgU2NoZW1hVXRpbHNcbiAgICogQG1ldGhvZCDijL7ioIBpbmplY3RFbnVtc1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzY2hlbWEgYSBidWlsdCBHcmFwaFFMU2NoZW1hIG9iamVjdCBjcmVhdGVkIHZpYSBidWlsZFNjaGVtYVxuICAgKiBvciBzb21lIG90aGVyIGFsdGVybmF0aXZlIGJ1dCBjb21wYXRpYmxlIG1hbm5lclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IENsYXNzZXMgdGhlc2UgYXJlIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3NlcyB1c2VkIHRvXG4gICAqIG1hbmlwdWxhdGUgdGhlIHNjaGVtYSB3aXRoLlxuICAgKi9cbiAgc3RhdGljIGluamVjdEVudW1zKHNjaGVtYTogT2JqZWN0LCBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPikge1xuICAgIGZvciAobGV0IENsYXNzIG9mIENsYXNzZXMpIHtcbiAgICAgIGlmIChDbGFzcy5HUUxfVFlQRSA9PT0gR3JhcGhRTEVudW1UeXBlKSB7XG4gICAgICAgIGNvbnN0IF9fZW51bSA9IHNjaGVtYS5fdHlwZU1hcFtDbGFzcy5uYW1lXTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gQ2xhc3MudmFsdWVzO1xuXG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIF9fZW51bS5fdmFsdWVzKSB7XG4gICAgICAgICAgaWYgKHZhbHVlLm5hbWUgaW4gdmFsdWVzKSB7XG4gICAgICAgICAgICBtZXJnZSh2YWx1ZSwgdmFsdWVzW3ZhbHVlLm5hbWVdKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHUUxTY2FsYXIgdHlwZXMgbXVzdCBkZWZpbmUgdGhyZWUgbWV0aG9kcyB0byBoYXZlIGEgdmFsaWQgaW1wbGVtZW50YXRpb24uXG4gICAqIFRoZXkgYXJlIHNlcmlhbGl6ZSwgcGFyc2VWYWx1ZSBhbmQgcGFyc2VMaXRlcmFsLiBTZWUgdGhlaXIgZG9jcyBmb3IgbW9yZVxuICAgKiBpbmZvIG9uIGhvdyB0byBkbyBzby5cbiAgICpcbiAgICogVGhpcyBjb2RlIGZpbmRzIGVhY2ggc2NhbGFyIGFuZCBhZGRzIHRoZWlyIGltcGxlbWVudGF0aW9uIGRldGFpbHMgdG8gdGhlXG4gICAqIGdlbmVyYXRlZCBzY2hlbWEgdHlwZSBjb25maWcuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFVdGlsc1xuICAgKiBAbWV0aG9kIOKMvuKggGluamVjdFNjYWxhcnNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gc2NoZW1hIGEgYnVpbHQgR3JhcGhRTFNjaGVtYSBvYmplY3QgY3JlYXRlZCB2aWEgYnVpbGRTY2hlbWFcbiAgICogb3Igc29tZSBvdGhlciBhbHRlcm5hdGl2ZSBidXQgY29tcGF0aWJsZSBtYW5uZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBDbGFzc2VzIHRoZXNlIGFyZSBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzZXMgdXNlZCB0b1xuICAgKiBtYW5pcHVsYXRlIHRoZSBzY2hlbWEgd2l0aC5cbiAgICovXG4gIHN0YXRpYyBpbmplY3RTY2FsYXJzKHNjaGVtYTogT2JqZWN0LCBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPikge1xuICAgIGZvciAobGV0IENsYXNzIG9mIENsYXNzZXMpIHtcbiAgICAgIGlmIChDbGFzcy5HUUxfVFlQRSA9PT0gR3JhcGhRTFNjYWxhclR5cGUpIHtcbiAgICAgICAgLy8gQENvbXB1dGVkVHlwZVxuICAgICAgICBjb25zdCB0eXBlID0gc2NoZW1hLl90eXBlTWFwW0NsYXNzLm5hbWVdO1xuXG4gICAgICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICAgICAgY29uc3QgeyBzZXJpYWxpemUsIHBhcnNlVmFsdWUsIHBhcnNlTGl0ZXJhbCB9ID0gQ2xhc3M7XG5cbiAgICAgICAgaWYgKCFzZXJpYWxpemUgfHwgIXBhcnNlVmFsdWUgfHwgIXBhcnNlTGl0ZXJhbCkge1xuICAgICAgICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICAgICAgICBsbC5lcnJvcihgU2NhbGFyIHR5cGUgJHtDbGFzcy5uYW1lfSBoYXMgaW52YWlsZCBpbXBsLmApO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVyZ2UodHlwZS5fc2NhbGFyQ29uZmlnLCB7XG4gICAgICAgICAgc2VyaWFsaXplLFxuICAgICAgICAgIHBhcnNlVmFsdWUsXG4gICAgICAgICAgcGFyc2VMaXRlcmFsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgY29tYmluZXMgdGhlIElETCBzY2hlbWFzIG9mIGFsbCB0aGUgc3VwcGxpZWQgY2xhc3NlcyBhbmRcbiAgICogcmV0dXJucyB0aGF0IHZhbHVlIHRvIHRoZSBtaWRkbGV3YXJlIGdldHRlci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMRXhwcmVzc01pZGRsZXdhcmVcbiAgICogQG1ldGhvZCDijL7ioIBnZW5lcmF0ZVNjaGVtYVNETFxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGEgZHluYW1pY2FsbHkgZ2VuZXJhdGVkIEdyYXBoUUwgSURMIHNjaGVtYSBzdHJpbmdcbiAgICovXG4gIHN0YXRpYyBnZW5lcmF0ZVNjaGVtYVNETChcbiAgICBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPixcbiAgICBsb2dPdXRwdXQ6IGJvb2xlYW4gPSB0cnVlXG4gICk6IHN0cmluZyB7XG4gICAgbGV0IHNjaGVtYSA9IFN5bnRheFRyZWUuRW1wdHlEb2N1bWVudCgpO1xuICAgIGxldCBsb2cgPSAoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKGxvZ091dHB1dCkge1xuICAgICAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBDbGFzcyBvZiBDbGFzc2VzKSB7XG4gICAgICBsZXQgY2xhc3NTY2hlbWEgPSBDbGFzcy5TQ0hFTUE7XG5cbiAgICAgIGlmICh0eXBlT2YoY2xhc3NTY2hlbWEpID09PSAnU3ltYm9sJykge1xuICAgICAgICBsZXQgaGFuZGxlciA9IENsYXNzLmhhbmRsZXI7XG4gICAgICAgIGxldCBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUoQ2xhc3MuaGFuZGxlci5wYXRoKVxuXG4gICAgICAgIGNsYXNzU2NoZW1hID0gaGFuZGxlci5nZXRTY2hlbWEoKTtcbiAgICAgICAgbG9nKFxuICAgICAgICAgIGBcXG5SZWFkIHNjaGVtYSAoJXMpXFxuJXNcXG4lc1xcbmAsXG4gICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgJy0nLnJlcGVhdCgxNCArIGZpbGVuYW1lLmxlbmd0aCksXG4gICAgICAgICAgY2xhc3NTY2hlbWEucmVwbGFjZSgvXi9nbSwgJyAgJylcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBzY2hlbWEuYXBwZW5kRGVmaW5pdGlvbnMoY2xhc3NTY2hlbWEpO1xuICAgIH1cblxuICAgIGxvZygnXFxuR2VuZXJhdGVkIEdyYXBoUUwgU2NoZW1hXFxuLS0tLS0tLS0tLS0tLS0tLVxcbiVzJywgc2NoZW1hKTtcblxuICAgIHJldHVybiBzY2hlbWEudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhc3luY2hyb25vdXMgZnVuY3Rpb24gdXNlZCB0byBwYXJzZSB0aGUgc3VwcGxpZWQgY2xhc3NlcyBmb3IgZWFjaFxuICAgKiBvbmVzIHJlc29sdmVycyBhbmQgbXV0YXRvcnMuIFRoZXNlIGFyZSBhbGwgY29tYmluZWQgaW50byBhIHNpbmdsZSByb290XG4gICAqIG9iamVjdCBwYXNzZWQgdG8gZXhwcmVzcy1ncmFwaHFsLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFVdGlsc1xuICAgKiBAbWV0aG9kIOKMvuKggGNyZWF0ZU1lcmdlZFJvb3RcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxHUUxCYXNlPn0gQ2xhc3NlcyB0aGUgR1FMQmFzZSBleHRlbmRlZCBjbGFzcyBvYmplY3RzIG9yXG4gICAqIGZ1bmN0aW9ucyBmcm9tIHdoaWNoIHRvIG1lcmdlIHRoZSBSRVNPTFZFUlMgYW5kIE1VVEFUT1JTIGZ1bmN0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3REYXRhIGZvciBFeHByZXNzIGFwc3MsIHRoaXMgd2lsbCBiZSBhbiBvYmplY3RcbiAgICogY29udGFpbmluZyB7IHJlcSwgcmVzLCBncWwgfSB3aGVyZSB0aG9zZSBhcmUgdGhlIEV4cHJlc3MgcmVxdWVzdCBhbmRcbiAgICogcmVzcG9uc2Ugb2JqZWN0IGFzIHdlbGwgYXMgdGhlIEdyYXBoUUwgcGFyYW1ldGVycyBmb3IgdGhlIHJlcXVlc3QuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn0gYSBQcm9taXNlIHJlc29sdmluZyB0byBhbiBPYmplY3QgY29udGFpbmluZyBhbGxcbiAgICogdGhlIGZ1bmN0aW9ucyBkZXNjcmliZWQgaW4gYm90aCBRdWVyeSBhbmQgTXV0YXRpb24gdHlwZXMuXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgY3JlYXRlTWVyZ2VkUm9vdChcbiAgICBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPixcbiAgICByZXF1ZXN0RGF0YTogT2JqZWN0LFxuICAgIHNlcGFyYXRlQnlUeXBlOiBib29sZWFuID0gZmFsc2VcbiAgKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICBjb25zdCByb290ID0ge307XG5cbiAgICBmb3IgKGxldCBDbGFzcyBvZiBDbGFzc2VzKSB7XG4gICAgICBtZXJnZShcbiAgICAgICAgcm9vdCxcbiAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgICBhd2FpdCBDbGFzcy5nZXRNZXJnZWRSb290KHJlcXVlc3REYXRhLCBzZXBhcmF0ZUJ5VHlwZSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NoZW1hVXRpbHNcbiJdfQ==