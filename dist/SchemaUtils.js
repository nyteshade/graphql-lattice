'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchemaUtils = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _SyntaxTree = require('./SyntaxTree');

var _GQLBase = require('./GQLBase');

var _GQLEnum = require('./GQLEnum');

var _GQLInterface = require('./GQLInterface');

var _GQLScalar = require('./GQLScalar');

var _types = require('./types');

var _utils = require('./utils');

var _lodash = require('lodash');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The SchemaUtils is used by tools such as GQLExpressMiddleware in order to
 * apply GraphQL Lattice specifics to the build schema.
 *
 * @class SchemaUtils
 */
var SchemaUtils = exports.SchemaUtils = function (_EventEmitter) {
  (0, _inherits3.default)(SchemaUtils, _EventEmitter);

  function SchemaUtils() {
    (0, _classCallCheck3.default)(this, SchemaUtils);
    return (0, _possibleConstructorReturn3.default)(this, (SchemaUtils.__proto__ || (0, _getPrototypeOf2.default)(SchemaUtils)).apply(this, arguments));
  }

  (0, _createClass3.default)(SchemaUtils, null, [{
    key: 'injectAll',

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
    key: 'injectComments',
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

        for (var _iterator = (0, _getIterator3.default)(Classes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(docs[DOC_FIELDS] || {})), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var field = _step2.value;

                if (fields && field in fields) {
                  fields[field].description = docs[DOC_FIELDS][field];
                }
                if (values) {
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = (0, _getIterator3.default)(values), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var value = _step3.value;

                      if (value.name === field) {
                        value.description = docs[DOC_FIELDS][field];
                      }
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }

          var _arr = [[query, DOC_QUERIES, DOC_QUERY], [mutation, DOC_MUTATORS, DOC_MUTATION], [subscription, DOC_SUBSCRIPTIONS, DOC_SUBSCRIPTION]];
          for (var _i = 0; _i < _arr.length; _i++) {
            var _ref = _arr[_i];

            var _ref2 = (0, _slicedToArray3.default)(_ref, 3);

            var _type = _ref2[0];
            var _CONST = _ref2[1];
            var _topCONST = _ref2[2];

            if (_type && ((0, _keys2.default)(docs[_CONST] || {}).length || docs[_topCONST] && docs[_topCONST].length)) {
              var _fields = _type._fields;

              if (docs[_topCONST]) {
                _type.description = docs[_topCONST];
              }

              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = (0, _getIterator3.default)((0, _keys2.default)(docs[_CONST])), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var _field = _step4.value;

                  if (_field in _fields) {
                    _fields[_field].description = docs[_CONST][_field];
                  }
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
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
          if (!_iteratorNormalCompletion && _iterator.return) {
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
    key: 'injectInterfaceResolvers',
    value: function injectInterfaceResolvers(schema, Classes) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = (0, _getIterator3.default)(Classes), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var Class = _step5.value;

          if (Class.GQL_TYPE === _graphql.GraphQLInterfaceType) {
            schema._typeMap[Class.name].resolveType = schema._typeMap[Class.name]._typeConfig.resolveType = Class.resolveType;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
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
    key: 'injectEnums',
    value: function injectEnums(schema, Classes) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = (0, _getIterator3.default)(Classes), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var Class = _step6.value;

          if (Class.GQL_TYPE === _graphql.GraphQLEnumType) {
            var __enum = schema._typeMap[Class.name];
            var values = Class.values;

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = (0, _getIterator3.default)(__enum._values), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var value = _step7.value;

                if (value.name in values) {
                  (0, _lodash.merge)(value, values[value.name]);
                }
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
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
    key: 'injectScalars',
    value: function injectScalars(schema, Classes) {
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = (0, _getIterator3.default)(Classes), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var Class = _step8.value;

          if (Class.GQL_TYPE === _graphql.GraphQLScalarType) {
            // @ComputedType
            var type = schema._typeMap[Class.name];

            // @ComputedType
            var serialize = Class.serialize,
                parseValue = Class.parseValue,
                parseLiteral = Class.parseLiteral;


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
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
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
    key: 'generateSchemaSDL',
    value: function generateSchemaSDL(Classes) {
      var logOutput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var schema = _SyntaxTree.SyntaxTree.EmptyDocument();
      var log = function log() {
        if (logOutput) {
          var _console;

          (_console = console).log.apply(_console, arguments);
        }
      };

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = (0, _getIterator3.default)(Classes), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var Class = _step9.value;

          var classSchema = Class.SCHEMA;

          if ((0, _types.typeOf)(classSchema) === 'Symbol') {
            var handler = Class.handler;
            var filename = _path2.default.basename(Class.handler.path);

            classSchema = handler.getSchema();
            log(`\nRead schema (%s)\n%s\n%s\n`, filename, '-'.repeat(14 + filename.length), classSchema.replace(/^/gm, '  '));
          }

          schema.appendDefinitions(classSchema);
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
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
    key: 'createMergedRoot',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(Classes, requestData) {
        var separateByType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var root, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, Class;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                root = {};
                _iteratorNormalCompletion10 = true;
                _didIteratorError10 = false;
                _iteratorError10 = undefined;
                _context.prev = 4;
                _iterator10 = (0, _getIterator3.default)(Classes);

              case 6:
                if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                  _context.next = 17;
                  break;
                }

                Class = _step10.value;
                _context.t0 = _lodash.merge;
                _context.t1 = root;
                _context.next = 12;
                return Class.getMergedRoot(requestData, separateByType);

              case 12:
                _context.t2 = _context.sent;
                (0, _context.t0)(_context.t1, _context.t2);

              case 14:
                _iteratorNormalCompletion10 = true;
                _context.next = 6;
                break;

              case 17:
                _context.next = 23;
                break;

              case 19:
                _context.prev = 19;
                _context.t3 = _context['catch'](4);
                _didIteratorError10 = true;
                _iteratorError10 = _context.t3;

              case 23:
                _context.prev = 23;
                _context.prev = 24;

                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                  _iterator10.return();
                }

              case 26:
                _context.prev = 26;

                if (!_didIteratorError10) {
                  _context.next = 29;
                  break;
                }

                throw _iteratorError10;

              case 29:
                return _context.finish(26);

              case 30:
                return _context.finish(23);

              case 31:
                return _context.abrupt('return', root);

              case 32:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 19, 23, 31], [24,, 26, 30]]);
      }));

      function createMergedRoot(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return createMergedRoot;
    }()
  }]);
  return SchemaUtils;
}(_events2.default);

exports.default = SchemaUtils;
//# sourceMappingURL=SchemaUtils.js.map