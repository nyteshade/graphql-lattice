"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.SchemaUtils = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * The SchemaUtils is used by tools such as GQLExpressMiddleware in order to
 * apply GraphQL Lattice specifics to the build schema.
 *
 * @class SchemaUtils
 */
var SchemaUtils = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(SchemaUtils, _EventEmitter);

  var _super = _createSuper(SchemaUtils);

  function SchemaUtils() {
    (0, _classCallCheck2["default"])(this, SchemaUtils);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(SchemaUtils, null, [{
    key: "injectAll",
    value:
    /**
     * Calls all the Lattice post-schema creation routines on a given Schema
     * using data from a supplied array of classes.
     *
     * @param {GraphQLSchema} schema the schema to post-process
     * @param {Array<GQLBase>} Classes the Classes from which to drive post
     * processing data from
     */
    function injectAll(schema, Classes) {
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

      var _iterator = _createForOfIteratorHelper(Classes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
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

            for (var _i = 0, _Object$keys = Object.keys(docs[DOC_FIELDS] || {}); _i < _Object$keys.length; _i++) {
              var field = _Object$keys[_i];

              if (fields && field in fields) {
                fields[field].description = docs[DOC_FIELDS][field];
              }

              if (values) {
                var _iterator2 = _createForOfIteratorHelper(values),
                    _step2;

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var value = _step2.value;

                    if (value.name === field) {
                      value.description = docs[DOC_FIELDS][field];
                    }
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
              }
            }
          }

          for (var _i2 = 0, _arr = [[query, DOC_QUERIES, DOC_QUERY], [mutation, DOC_MUTATORS, DOC_MUTATION], [subscription, DOC_SUBSCRIPTIONS, DOC_SUBSCRIPTION]]; _i2 < _arr.length; _i2++) {
            var _arr$_i = (0, _slicedToArray2["default"])(_arr[_i2], 3),
                _type = _arr$_i[0],
                _CONST = _arr$_i[1],
                _topCONST = _arr$_i[2];

            if (_type && (Object.keys(docs[_CONST] || {}).length || docs[_topCONST] && docs[_topCONST].length)) {
              var _fields = _type._fields;

              if (docs[_topCONST]) {
                _type.description = docs[_topCONST];
              }

              for (var _i3 = 0, _Object$keys2 = Object.keys(docs[_CONST]); _i3 < _Object$keys2.length; _i3++) {
                var _field = _Object$keys2[_i3];

                if (_field in _fields) {
                  _fields[_field].description = docs[_CONST][_field];
                }
              }
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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
      var _iterator3 = _createForOfIteratorHelper(Classes),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var Class = _step3.value;

          if (Class.GQL_TYPE === _graphql.GraphQLInterfaceType) {
            schema._typeMap[Class.name].resolveType = schema._typeMap[Class.name]._typeConfig.resolveType = Class.resolveType;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
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
      var _iterator4 = _createForOfIteratorHelper(Classes),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var Class = _step4.value;

          if (Class.GQL_TYPE === _graphql.GraphQLEnumType) {
            var __enum = schema._typeMap[Class.name];
            var values = Class.values;

            var _iterator5 = _createForOfIteratorHelper(__enum._values),
                _step5;

            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                var value = _step5.value;

                if (value.name in values) {
                  (0, _lodash.merge)(value, values[value.name]);
                }
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
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
      var _iterator6 = _createForOfIteratorHelper(Classes),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
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
        _iterator6.e(err);
      } finally {
        _iterator6.f();
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

      var _iterator7 = _createForOfIteratorHelper(Classes),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var Class = _step7.value;
          var classSchema = Class.SCHEMA;

          if ((0, _neTypes.typeOf)(classSchema) === 'Symbol') {
            var handler = Class.handler;

            var filename = _path["default"].basename(Class.handler.path);

            classSchema = handler.getSchema();
            log("\nRead schema (%s)\n%s\n%s\n", filename, '-'.repeat(14 + filename.length), classSchema.replace(/^/gm, '  '));
          }

          schema.appendDefinitions(classSchema);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
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
      var _createMergedRoot = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(Classes, requestData) {
        var separateByType,
            root,
            _iterator8,
            _step8,
            Class,
            _args = arguments;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                separateByType = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
                root = {};
                _iterator8 = _createForOfIteratorHelper(Classes);
                _context.prev = 3;

                _iterator8.s();

              case 5:
                if ((_step8 = _iterator8.n()).done) {
                  _context.next = 15;
                  break;
                }

                Class = _step8.value;
                _context.t0 = _lodash.merge;
                _context.t1 = root;
                _context.next = 11;
                return Class.getMergedRoot(requestData, separateByType);

              case 11:
                _context.t2 = _context.sent;
                (0, _context.t0)(_context.t1, _context.t2);

              case 13:
                _context.next = 5;
                break;

              case 15:
                _context.next = 20;
                break;

              case 17:
                _context.prev = 17;
                _context.t3 = _context["catch"](3);

                _iterator8.e(_context.t3);

              case 20:
                _context.prev = 20;

                _iterator8.f();

                return _context.finish(20);

              case 23:
                return _context.abrupt("return", root);

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 17, 20, 23]]);
      }));

      function createMergedRoot(_x, _x2) {
        return _createMergedRoot.apply(this, arguments);
      }

      return createMergedRoot;
    }()
  }]);
  return SchemaUtils;
}(_events["default"]);

exports.SchemaUtils = SchemaUtils;
var _default = SchemaUtils;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9TY2hlbWFVdGlscy5qcyJdLCJuYW1lcyI6WyJTY2hlbWFVdGlscyIsInNjaGVtYSIsIkNsYXNzZXMiLCJpbmplY3RJbnRlcmZhY2VSZXNvbHZlcnMiLCJpbmplY3RFbnVtcyIsImluamVjdFNjYWxhcnMiLCJpbmplY3RDb21tZW50cyIsIkRPQ19DTEFTUyIsIkdRTEJhc2UiLCJET0NfRklFTERTIiwiRE9DX1FVRVJJRVMiLCJET0NfTVVUQVRPUlMiLCJET0NfU1VCU0NSSVBUSU9OUyIsIkRPQ19RVUVSWSIsIkRPQ19NVVRBVElPTiIsIkRPQ19TVUJTQ1JJUFRJT04iLCJDbGFzcyIsImRvY3MiLCJhcGlEb2NzIiwicXVlcnkiLCJfdHlwZU1hcCIsIlF1ZXJ5IiwibXV0YXRpb24iLCJNdXRhdGlvbiIsInN1YnNjcmlwdGlvbiIsIlN1YnNjcmlwdGlvbiIsInR5cGUiLCJuYW1lIiwiZmllbGRzIiwiX2ZpZWxkcyIsInZhbHVlcyIsIl92YWx1ZXMiLCJkZXNjcmlwdGlvbiIsIk9iamVjdCIsImtleXMiLCJmaWVsZCIsInZhbHVlIiwiX3R5cGUiLCJfQ09OU1QiLCJfdG9wQ09OU1QiLCJsZW5ndGgiLCJHUUxfVFlQRSIsIkdyYXBoUUxJbnRlcmZhY2VUeXBlIiwicmVzb2x2ZVR5cGUiLCJfdHlwZUNvbmZpZyIsIkdyYXBoUUxFbnVtVHlwZSIsIl9fZW51bSIsIkdyYXBoUUxTY2FsYXJUeXBlIiwic2VyaWFsaXplIiwicGFyc2VWYWx1ZSIsInBhcnNlTGl0ZXJhbCIsImxsIiwiZXJyb3IiLCJfc2NhbGFyQ29uZmlnIiwibG9nT3V0cHV0IiwiU3ludGF4VHJlZSIsIkVtcHR5RG9jdW1lbnQiLCJsb2ciLCJjb25zb2xlIiwiY2xhc3NTY2hlbWEiLCJTQ0hFTUEiLCJoYW5kbGVyIiwiZmlsZW5hbWUiLCJwYXRoIiwiYmFzZW5hbWUiLCJnZXRTY2hlbWEiLCJyZXBlYXQiLCJyZXBsYWNlIiwiYXBwZW5kRGVmaW5pdGlvbnMiLCJ0b1N0cmluZyIsInJlcXVlc3REYXRhIiwic2VwYXJhdGVCeVR5cGUiLCJyb290IiwibWVyZ2UiLCJnZXRNZXJnZWRSb290IiwiRXZlbnRFbWl0dGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNhQSxXOzs7Ozs7Ozs7Ozs7O0FBQ1g7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLHVCQUFpQkMsTUFBakIsRUFBd0NDLE9BQXhDLEVBQWlFO0FBQy9ERixNQUFBQSxXQUFXLENBQUNHLHdCQUFaLENBQXFDRixNQUFyQyxFQUE2Q0MsT0FBN0M7QUFDQUYsTUFBQUEsV0FBVyxDQUFDSSxXQUFaLENBQXdCSCxNQUF4QixFQUFnQ0MsT0FBaEM7QUFDQUYsTUFBQUEsV0FBVyxDQUFDSyxhQUFaLENBQTBCSixNQUExQixFQUFrQ0MsT0FBbEM7QUFDQUYsTUFBQUEsV0FBVyxDQUFDTSxjQUFaLENBQTJCTCxNQUEzQixFQUFtQ0MsT0FBbkM7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLHdCQUFzQkQsTUFBdEIsRUFBc0NDLE9BQXRDLEVBQStEO0FBQzdELFVBQ0VLLFNBREYsR0FHSUMsZ0JBSEosQ0FDRUQsU0FERjtBQUFBLFVBQ2FFLFVBRGIsR0FHSUQsZ0JBSEosQ0FDYUMsVUFEYjtBQUFBLFVBQ3lCQyxXQUR6QixHQUdJRixnQkFISixDQUN5QkUsV0FEekI7QUFBQSxVQUNzQ0MsWUFEdEMsR0FHSUgsZ0JBSEosQ0FDc0NHLFlBRHRDO0FBQUEsVUFDb0RDLGlCQURwRCxHQUdJSixnQkFISixDQUNvREksaUJBRHBEO0FBQUEsVUFF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QixDQUpDLENBQUg7QUFNRDs7QUFFRGxFLFVBQUFBLE1BQU0sQ0FBQ21FLGlCQUFQLENBQXlCVCxXQUF6QjtBQUNEO0FBekJPO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBMkJSRixNQUFBQSxHQUFHLENBQUMsa0RBQUQsRUFBcUR4RCxNQUFyRCxDQUFIO0FBRUEsYUFBT0EsTUFBTSxDQUFDb0UsUUFBUCxFQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs0R0FDRSxpQkFDRW5FLE9BREYsRUFFRW9FLFdBRkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHRUMsZ0JBQUFBLGNBSEYsMkRBRzRCLEtBSDVCO0FBS1FDLGdCQUFBQSxJQUxSLEdBS2UsRUFMZjtBQUFBLHdEQU9vQnRFLE9BUHBCO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFPV2MsZ0JBQUFBLEtBUFg7QUFBQSw4QkFRSXlELGFBUko7QUFBQSw4QkFTTUQsSUFUTjtBQUFBO0FBQUEsdUJBV1l4RCxLQUFLLENBQUMwRCxhQUFOLENBQW9CSixXQUFwQixFQUFpQ0MsY0FBakMsQ0FYWjs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTtBQUFBLGlEQWVTQyxJQWZUOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE87Ozs7Ozs7Ozs7RUFoUStCRyxrQjs7O2VBbVJsQjNFLFciLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgU3ludGF4VHJlZSB9IGZyb20gJy4vU3ludGF4VHJlZSdcbmltcG9ydCB7IEdRTEJhc2UsIE1FVEFfS0VZIH0gZnJvbSAnLi9HUUxCYXNlJ1xuaW1wb3J0IHsgR1FMRW51bSB9IGZyb20gJy4vR1FMRW51bSdcbmltcG9ydCB7IEdRTEludGVyZmFjZSB9IGZyb20gJy4vR1FMSW50ZXJmYWNlJ1xuaW1wb3J0IHsgR1FMU2NhbGFyIH0gZnJvbSAnLi9HUUxTY2FsYXInXG5pbXBvcnQgeyB0eXBlT2YgfSBmcm9tICduZS10eXBlcydcbmltcG9ydCB7IExhdHRpY2VMb2dzIGFzIGxsIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5pbXBvcnQge1xuICBwYXJzZSxcbiAgcHJpbnQsXG4gIGJ1aWxkU2NoZW1hLFxuICBHcmFwaFFMSW50ZXJmYWNlVHlwZSxcbiAgR3JhcGhRTEVudW1UeXBlLFxuICBHcmFwaFFMU2NhbGFyVHlwZSxcbiAgR3JhcGhRTFNjaGVtYVxufSBmcm9tICdncmFwaHFsJ1xuXG4vKipcbiAqIFRoZSBTY2hlbWFVdGlscyBpcyB1c2VkIGJ5IHRvb2xzIHN1Y2ggYXMgR1FMRXhwcmVzc01pZGRsZXdhcmUgaW4gb3JkZXIgdG9cbiAqIGFwcGx5IEdyYXBoUUwgTGF0dGljZSBzcGVjaWZpY3MgdG8gdGhlIGJ1aWxkIHNjaGVtYS5cbiAqXG4gKiBAY2xhc3MgU2NoZW1hVXRpbHNcbiAqL1xuZXhwb3J0IGNsYXNzIFNjaGVtYVV0aWxzIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENhbGxzIGFsbCB0aGUgTGF0dGljZSBwb3N0LXNjaGVtYSBjcmVhdGlvbiByb3V0aW5lcyBvbiBhIGdpdmVuIFNjaGVtYVxuICAgKiB1c2luZyBkYXRhIGZyb20gYSBzdXBwbGllZCBhcnJheSBvZiBjbGFzc2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge0dyYXBoUUxTY2hlbWF9IHNjaGVtYSB0aGUgc2NoZW1hIHRvIHBvc3QtcHJvY2Vzc1xuICAgKiBAcGFyYW0ge0FycmF5PEdRTEJhc2U+fSBDbGFzc2VzIHRoZSBDbGFzc2VzIGZyb20gd2hpY2ggdG8gZHJpdmUgcG9zdFxuICAgKiBwcm9jZXNzaW5nIGRhdGEgZnJvbVxuICAgKi9cbiAgc3RhdGljIGluamVjdEFsbChzY2hlbWE6IEdyYXBoUUxTY2hlbWEsIENsYXNzZXM6IEFycmF5PEdRTEJhc2U+KSB7XG4gICAgU2NoZW1hVXRpbHMuaW5qZWN0SW50ZXJmYWNlUmVzb2x2ZXJzKHNjaGVtYSwgQ2xhc3Nlcyk7XG4gICAgU2NoZW1hVXRpbHMuaW5qZWN0RW51bXMoc2NoZW1hLCBDbGFzc2VzKTtcbiAgICBTY2hlbWFVdGlscy5pbmplY3RTY2FsYXJzKHNjaGVtYSwgQ2xhc3Nlcyk7XG4gICAgU2NoZW1hVXRpbHMuaW5qZWN0Q29tbWVudHMoc2NoZW1hLCBDbGFzc2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnRpbCBzdWNoIHRpbWUgYXMgSSBjYW4gZ2V0IHRoZSByZWZlcmVuY2UgRmFjZWJvb2sgR3JhcGhRTCBBU1QgcGFyc2VyIHRvXG4gICAqIHJlYWQgYW5kIGFwcGx5IGRlc2NyaXB0aW9ucyBvciB1bnRpbCBzdWNoIHRpbWUgYXMgSSBlbXBsb3kgdGhlIEFwb2xsb1xuICAgKiBBU1QgcGFyc2VyLCBwcm92aWRpbmcgYSBgc3RhdGljIGdldCBhcGlEb2NzKClgIGdldHRlciBpcyB0aGUgd2F5IHRvIGdldFxuICAgKiB5b3VyIGRlc2NyaXB0aW9ucyBpbnRvIHRoZSBwcm9wZXIgZmllbGRzLCBwb3N0IHNjaGVtYSBjcmVhdGlvbi5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgd2Fsa3MgdGhlIHR5cGVzIGluIHRoZSByZWdpc3RlcmVkIGNsYXNzZXMgYW5kIHRoZSBzdXBwbGllZFxuICAgKiBzY2hlbWEgdHlwZS4gSXQgdGhlbiBpbmplY3RzIHRoZSB3cml0dGVuIGNvbW1lbnRzIHN1Y2ggdGhhdCB0aGV5IGNhblxuICAgKiBiZSBleHBvc2VkIGluIGdyYXBoaXFsIGFuZCB0byBhcHBsaWNhdGlvbnMgb3IgY29kZSB0aGF0IHJlYWQgdGhlIG1ldGFcbiAgICogZmllbGRzIG9mIGEgYnVpbHQgc2NoZW1hXG4gICAqXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFVdGlsc1xuICAgKiBAbWV0aG9kIOKMvuKggGluamVjdENvbW1lbnRzXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDIuNy4wXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzY2hlbWEgYSBidWlsdCBHcmFwaFFMU2NoZW1hIG9iamVjdCBjcmVhdGVkIHZpYSBidWlsZFNjaGVtYVxuICAgKiBvciBzb21lIG90aGVyIGFsdGVybmF0aXZlIGJ1dCBjb21wYXRpYmxlIG1hbm5lclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IENsYXNzZXMgdGhlc2UgYXJlIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3NlcyB1c2VkIHRvXG4gICAqIG1hbmlwdWxhdGUgdGhlIHNjaGVtYSB3aXRoLlxuICAgKi9cbiAgc3RhdGljIGluamVjdENvbW1lbnRzKHNjaGVtYTogT2JqZWN0LCBDbGFzc2VzOiBBcnJheTxHUUxCYXNlPikge1xuICAgIGNvbnN0IHtcbiAgICAgIERPQ19DTEFTUywgRE9DX0ZJRUxEUywgRE9DX1FVRVJJRVMsIERPQ19NVVRBVE9SUywgRE9DX1NVQlNDUklQVElPTlMsXG4gICAgICBET0NfUVVFUlksIERPQ19NVVRBVElPTiwgRE9DX1NVQlNDUklQVElPTlxuICAgIH0gPSBHUUxCYXNlO1xuXG4gICAgZm9yIChsZXQgQ2xhc3Mgb2YgQ2xhc3Nlcykge1xuICAgICAgY29uc3QgZG9jcyA9IENsYXNzLmFwaURvY3MoKTtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gc2NoZW1hLl90eXBlTWFwLlF1ZXJ5O1xuICAgICAgY29uc3QgbXV0YXRpb24gPSBzY2hlbWEuX3R5cGVNYXAuTXV0YXRpb247XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzY2hlbWEuX3R5cGVNYXAuU3Vic2NyaXB0aW9uO1xuICAgICAgbGV0IHR5cGU7XG5cbiAgICAgIGlmICgodHlwZSA9IHNjaGVtYS5fdHlwZU1hcFtDbGFzcy5uYW1lXSkpIHtcbiAgICAgICAgbGV0IGZpZWxkcyA9IHR5cGUuX2ZpZWxkcztcbiAgICAgICAgbGV0IHZhbHVlcyA9IHR5cGUuX3ZhbHVlcztcblxuICAgICAgICBpZiAoZG9jc1tET0NfQ0xBU1NdKSB7IHR5cGUuZGVzY3JpcHRpb24gPSBkb2NzW0RPQ19DTEFTU10gfVxuXG4gICAgICAgIGZvciAobGV0IGZpZWxkIG9mIE9iamVjdC5rZXlzKGRvY3NbRE9DX0ZJRUxEU10gfHwge30pKSB7XG4gICAgICAgICAgaWYgKGZpZWxkcyAmJiBmaWVsZCBpbiBmaWVsZHMpIHtcbiAgICAgICAgICAgIGZpZWxkc1tmaWVsZF0uZGVzY3JpcHRpb24gPSBkb2NzW0RPQ19GSUVMRFNdW2ZpZWxkXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZS5uYW1lID09PSBmaWVsZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlLmRlc2NyaXB0aW9uID0gZG9jc1tET0NfRklFTERTXVtmaWVsZF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBbX3R5cGUsIF9DT05TVCwgX3RvcENPTlNUXSBvZiBbXG4gICAgICAgIFtxdWVyeSwgRE9DX1FVRVJJRVMsIERPQ19RVUVSWV0sXG4gICAgICAgIFttdXRhdGlvbiwgRE9DX01VVEFUT1JTLCBET0NfTVVUQVRJT05dLFxuICAgICAgICBbc3Vic2NyaXB0aW9uLCBET0NfU1VCU0NSSVBUSU9OUywgRE9DX1NVQlNDUklQVElPTl1cbiAgICAgIF0pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIF90eXBlXG4gICAgICAgICAgJiYgKFxuICAgICAgICAgICAgKE9iamVjdC5rZXlzKGRvY3NbX0NPTlNUXSB8fCB7fSkubGVuZ3RoKVxuICAgICAgICAgICAgfHwgKGRvY3NbX3RvcENPTlNUXSAmJiBkb2NzW190b3BDT05TVF0ubGVuZ3RoKVxuICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgbGV0IGZpZWxkcyA9IF90eXBlLl9maWVsZHM7XG5cbiAgICAgICAgICBpZiAoZG9jc1tfdG9wQ09OU1RdKSB7XG4gICAgICAgICAgICBfdHlwZS5kZXNjcmlwdGlvbiA9IGRvY3NbX3RvcENPTlNUXVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAobGV0IGZpZWxkIG9mIE9iamVjdC5rZXlzKGRvY3NbX0NPTlNUXSkpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZCBpbiBmaWVsZHMpIHtcbiAgICAgICAgICAgICAgZmllbGRzW2ZpZWxkXS5kZXNjcmlwdGlvbiA9IGRvY3NbX0NPTlNUXVtmaWVsZF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNvbWV3aGF0IGxpa2UgYGluamVjdENvbW1lbnRzYCBhbmQgb3RoZXIgc2ltaWxhciBtZXRob2RzLCB0aGVcbiAgICogYGluamVjdEludGVyZmFjZVJlc29sdmVyc2AgbWV0aG9kIHdhbGtzIHRoZSByZWdpc3RlcmVkIGNsYXNzZXMgYW5kXG4gICAqIGZpbmRzIGBHUUxJbnRlcmZhY2VgIHR5cGVzIGFuZCBhcHBsaWVzIHRoZWlyIGByZXNvbHZlVHlwZSgpYFxuICAgKiBpbXBsZW1lbnRhdGlvbnMuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFVdGlsc1xuICAgKiBAbWV0aG9kIOKMvuKggGluamVjdEludGVyZmFjZVJlc29sdmVyc1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzY2hlbWEgYSBidWlsdCBHcmFwaFFMU2NoZW1hIG9iamVjdCBjcmVhdGVkIHZpYSBidWlsZFNjaGVtYVxuICAgKiBvciBzb21lIG90aGVyIGFsdGVybmF0aXZlIGJ1dCBjb21wYXRpYmxlIG1hbm5lclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IENsYXNzZXMgdGhlc2UgYXJlIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3NlcyB1c2VkIHRvXG4gICAqIG1hbmlwdWxhdGUgdGhlIHNjaGVtYSB3aXRoLlxuICAgKi9cbiAgc3RhdGljIGluamVjdEludGVyZmFjZVJlc29sdmVycyhzY2hlbWE6IE9iamVjdCwgQ2xhc3NlczogQXJyYXk8R1FMQmFzZT4pIHtcbiAgICBmb3IgKGxldCBDbGFzcyBvZiBDbGFzc2VzKSB7XG4gICAgICBpZiAoQ2xhc3MuR1FMX1RZUEUgPT09IEdyYXBoUUxJbnRlcmZhY2VUeXBlKSB7XG4gICAgICAgIHNjaGVtYS5fdHlwZU1hcFtDbGFzcy5uYW1lXS5yZXNvbHZlVHlwZSA9XG4gICAgICAgIHNjaGVtYS5fdHlwZU1hcFtDbGFzcy5uYW1lXS5fdHlwZUNvbmZpZy5yZXNvbHZlVHlwZSA9XG4gICAgICAgICAgQ2xhc3MucmVzb2x2ZVR5cGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNvbWV3aGF0IGxpa2UgYGluamVjdENvbW1lbnRzYCBhbmQgb3RoZXIgc2ltaWxhciBtZXRob2RzLCB0aGVcbiAgICogYGluamVjdEludGVyZmFjZVJlc29sdmVyc2AgbWV0aG9kIHdhbGtzIHRoZSByZWdpc3RlcmVkIGNsYXNzZXMgYW5kXG4gICAqIGZpbmRzIGBHUUxJbnRlcmZhY2VgIHR5cGVzIGFuZCBhcHBsaWVzIHRoZWlyIGByZXNvbHZlVHlwZSgpYFxuICAgKiBpbXBsZW1lbnRhdGlvbnMuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBTY2hlbWFVdGlsc1xuICAgKiBAbWV0aG9kIOKMvuKggGluamVjdEVudW1zXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHNjaGVtYSBhIGJ1aWx0IEdyYXBoUUxTY2hlbWEgb2JqZWN0IGNyZWF0ZWQgdmlhIGJ1aWxkU2NoZW1hXG4gICAqIG9yIHNvbWUgb3RoZXIgYWx0ZXJuYXRpdmUgYnV0IGNvbXBhdGlibGUgbWFubmVyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gQ2xhc3NlcyB0aGVzZSBhcmUgR1FMQmFzZSBleHRlbmRlZCBjbGFzc2VzIHVzZWQgdG9cbiAgICogbWFuaXB1bGF0ZSB0aGUgc2NoZW1hIHdpdGguXG4gICAqL1xuICBzdGF0aWMgaW5qZWN0RW51bXMoc2NoZW1hOiBPYmplY3QsIENsYXNzZXM6IEFycmF5PEdRTEJhc2U+KSB7XG4gICAgZm9yIChsZXQgQ2xhc3Mgb2YgQ2xhc3Nlcykge1xuICAgICAgaWYgKENsYXNzLkdRTF9UWVBFID09PSBHcmFwaFFMRW51bVR5cGUpIHtcbiAgICAgICAgY29uc3QgX19lbnVtID0gc2NoZW1hLl90eXBlTWFwW0NsYXNzLm5hbWVdO1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBDbGFzcy52YWx1ZXM7XG5cbiAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgX19lbnVtLl92YWx1ZXMpIHtcbiAgICAgICAgICBpZiAodmFsdWUubmFtZSBpbiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIG1lcmdlKHZhbHVlLCB2YWx1ZXNbdmFsdWUubmFtZV0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdRTFNjYWxhciB0eXBlcyBtdXN0IGRlZmluZSB0aHJlZSBtZXRob2RzIHRvIGhhdmUgYSB2YWxpZCBpbXBsZW1lbnRhdGlvbi5cbiAgICogVGhleSBhcmUgc2VyaWFsaXplLCBwYXJzZVZhbHVlIGFuZCBwYXJzZUxpdGVyYWwuIFNlZSB0aGVpciBkb2NzIGZvciBtb3JlXG4gICAqIGluZm8gb24gaG93IHRvIGRvIHNvLlxuICAgKlxuICAgKiBUaGlzIGNvZGUgZmluZHMgZWFjaCBzY2FsYXIgYW5kIGFkZHMgdGhlaXIgaW1wbGVtZW50YXRpb24gZGV0YWlscyB0byB0aGVcbiAgICogZ2VuZXJhdGVkIHNjaGVtYSB0eXBlIGNvbmZpZy5cbiAgICpcbiAgICogQG1lbWJlcm9mIFNjaGVtYVV0aWxzXG4gICAqIEBtZXRob2Qg4oy+4qCAaW5qZWN0U2NhbGFyc1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzY2hlbWEgYSBidWlsdCBHcmFwaFFMU2NoZW1hIG9iamVjdCBjcmVhdGVkIHZpYSBidWlsZFNjaGVtYVxuICAgKiBvciBzb21lIG90aGVyIGFsdGVybmF0aXZlIGJ1dCBjb21wYXRpYmxlIG1hbm5lclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IENsYXNzZXMgdGhlc2UgYXJlIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3NlcyB1c2VkIHRvXG4gICAqIG1hbmlwdWxhdGUgdGhlIHNjaGVtYSB3aXRoLlxuICAgKi9cbiAgc3RhdGljIGluamVjdFNjYWxhcnMoc2NoZW1hOiBPYmplY3QsIENsYXNzZXM6IEFycmF5PEdRTEJhc2U+KSB7XG4gICAgZm9yIChsZXQgQ2xhc3Mgb2YgQ2xhc3Nlcykge1xuICAgICAgaWYgKENsYXNzLkdRTF9UWVBFID09PSBHcmFwaFFMU2NhbGFyVHlwZSkge1xuICAgICAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgICAgIGNvbnN0IHR5cGUgPSBzY2hlbWEuX3R5cGVNYXBbQ2xhc3MubmFtZV07XG5cbiAgICAgICAgLy8gQENvbXB1dGVkVHlwZVxuICAgICAgICBjb25zdCB7IHNlcmlhbGl6ZSwgcGFyc2VWYWx1ZSwgcGFyc2VMaXRlcmFsIH0gPSBDbGFzcztcblxuICAgICAgICBpZiAoIXNlcmlhbGl6ZSB8fCAhcGFyc2VWYWx1ZSB8fCAhcGFyc2VMaXRlcmFsKSB7XG4gICAgICAgICAgLy8gQENvbXB1dGVkVHlwZVxuICAgICAgICAgIGxsLmVycm9yKGBTY2FsYXIgdHlwZSAke0NsYXNzLm5hbWV9IGhhcyBpbnZhaWxkIGltcGwuYCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBtZXJnZSh0eXBlLl9zY2FsYXJDb25maWcsIHtcbiAgICAgICAgICBzZXJpYWxpemUsXG4gICAgICAgICAgcGFyc2VWYWx1ZSxcbiAgICAgICAgICBwYXJzZUxpdGVyYWxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdGhhdCBjb21iaW5lcyB0aGUgSURMIHNjaGVtYXMgb2YgYWxsIHRoZSBzdXBwbGllZCBjbGFzc2VzIGFuZFxuICAgKiByZXR1cm5zIHRoYXQgdmFsdWUgdG8gdGhlIG1pZGRsZXdhcmUgZ2V0dGVyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxFeHByZXNzTWlkZGxld2FyZVxuICAgKiBAbWV0aG9kIOKMvuKggGdlbmVyYXRlU2NoZW1hU0RMXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYSBkeW5hbWljYWxseSBnZW5lcmF0ZWQgR3JhcGhRTCBJREwgc2NoZW1hIHN0cmluZ1xuICAgKi9cbiAgc3RhdGljIGdlbmVyYXRlU2NoZW1hU0RMKFxuICAgIENsYXNzZXM6IEFycmF5PEdRTEJhc2U+LFxuICAgIGxvZ091dHB1dDogYm9vbGVhbiA9IHRydWVcbiAgKTogc3RyaW5nIHtcbiAgICBsZXQgc2NoZW1hID0gU3ludGF4VHJlZS5FbXB0eURvY3VtZW50KCk7XG4gICAgbGV0IGxvZyA9ICguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAobG9nT3V0cHV0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IENsYXNzIG9mIENsYXNzZXMpIHtcbiAgICAgIGxldCBjbGFzc1NjaGVtYSA9IENsYXNzLlNDSEVNQTtcblxuICAgICAgaWYgKHR5cGVPZihjbGFzc1NjaGVtYSkgPT09ICdTeW1ib2wnKSB7XG4gICAgICAgIGxldCBoYW5kbGVyID0gQ2xhc3MuaGFuZGxlcjtcbiAgICAgICAgbGV0IGZpbGVuYW1lID0gcGF0aC5iYXNlbmFtZShDbGFzcy5oYW5kbGVyLnBhdGgpXG5cbiAgICAgICAgY2xhc3NTY2hlbWEgPSBoYW5kbGVyLmdldFNjaGVtYSgpO1xuICAgICAgICBsb2coXG4gICAgICAgICAgYFxcblJlYWQgc2NoZW1hICglcylcXG4lc1xcbiVzXFxuYCxcbiAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAnLScucmVwZWF0KDE0ICsgZmlsZW5hbWUubGVuZ3RoKSxcbiAgICAgICAgICBjbGFzc1NjaGVtYS5yZXBsYWNlKC9eL2dtLCAnICAnKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHNjaGVtYS5hcHBlbmREZWZpbml0aW9ucyhjbGFzc1NjaGVtYSk7XG4gICAgfVxuXG4gICAgbG9nKCdcXG5HZW5lcmF0ZWQgR3JhcGhRTCBTY2hlbWFcXG4tLS0tLS0tLS0tLS0tLS0tXFxuJXMnLCBzY2hlbWEpO1xuXG4gICAgcmV0dXJuIHNjaGVtYS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFzeW5jaHJvbm91cyBmdW5jdGlvbiB1c2VkIHRvIHBhcnNlIHRoZSBzdXBwbGllZCBjbGFzc2VzIGZvciBlYWNoXG4gICAqIG9uZXMgcmVzb2x2ZXJzIGFuZCBtdXRhdG9ycy4gVGhlc2UgYXJlIGFsbCBjb21iaW5lZCBpbnRvIGEgc2luZ2xlIHJvb3RcbiAgICogb2JqZWN0IHBhc3NlZCB0byBleHByZXNzLWdyYXBocWwuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFNjaGVtYVV0aWxzXG4gICAqIEBtZXRob2Qg4oy+4qCAY3JlYXRlTWVyZ2VkUm9vdFxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PEdRTEJhc2U+fSBDbGFzc2VzIHRoZSBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzIG9iamVjdHMgb3JcbiAgICogZnVuY3Rpb25zIGZyb20gd2hpY2ggdG8gbWVyZ2UgdGhlIFJFU09MVkVSUyBhbmQgTVVUQVRPUlMgZnVuY3Rpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdERhdGEgZm9yIEV4cHJlc3MgYXBzcywgdGhpcyB3aWxsIGJlIGFuIG9iamVjdFxuICAgKiBjb250YWluaW5nIHsgcmVxLCByZXMsIGdxbCB9IHdoZXJlIHRob3NlIGFyZSB0aGUgRXhwcmVzcyByZXF1ZXN0IGFuZFxuICAgKiByZXNwb25zZSBvYmplY3QgYXMgd2VsbCBhcyB0aGUgR3JhcGhRTCBwYXJhbWV0ZXJzIGZvciB0aGUgcmVxdWVzdC5cbiAgICogQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fSBhIFByb21pc2UgcmVzb2x2aW5nIHRvIGFuIE9iamVjdCBjb250YWluaW5nIGFsbFxuICAgKiB0aGUgZnVuY3Rpb25zIGRlc2NyaWJlZCBpbiBib3RoIFF1ZXJ5IGFuZCBNdXRhdGlvbiB0eXBlcy5cbiAgICovXG4gIHN0YXRpYyBhc3luYyBjcmVhdGVNZXJnZWRSb290KFxuICAgIENsYXNzZXM6IEFycmF5PEdRTEJhc2U+LFxuICAgIHJlcXVlc3REYXRhOiBPYmplY3QsXG4gICAgc2VwYXJhdGVCeVR5cGU6IGJvb2xlYW4gPSBmYWxzZVxuICApOiBQcm9taXNlPE9iamVjdD4ge1xuICAgIGNvbnN0IHJvb3QgPSB7fTtcblxuICAgIGZvciAobGV0IENsYXNzIG9mIENsYXNzZXMpIHtcbiAgICAgIG1lcmdlKFxuICAgICAgICByb290LFxuICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgIGF3YWl0IENsYXNzLmdldE1lcmdlZFJvb3QocmVxdWVzdERhdGEsIHNlcGFyYXRlQnlUeXBlKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY2hlbWFVdGlsc1xuIl19