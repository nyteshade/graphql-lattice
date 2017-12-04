'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLExpressMiddleware = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

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

var _SyntaxTree = require('./SyntaxTree');

var _GQLBase = require('./GQLBase');

var _GQLInterface = require('./GQLInterface');

var _GQLScalar = require('./GQLScalar');

var _types = require('./types');

var _SchemaUtils = require('./SchemaUtils');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _graphqlTools = require('graphql-tools');

var _graphql = require('graphql');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A handler that exposes an express middleware function that mounts a
 * GraphQL I/O endpoint. Typical usage follows:
 *
 * ```js
 * const app = express();
 * app.use(/.../, new GQLExpressMiddleware([...classes]).middleware);
 * ```
 *
 * @class GQLExpressMiddleware
 */
var GQLExpressMiddleware = exports.GQLExpressMiddleware = function (_EventEmitter) {
  (0, _inherits3.default)(GQLExpressMiddleware, _EventEmitter);

  /**
   * For now, takes an Array of classes extending from GQLBase. These are
   * parsed and a combined schema of all their individual schemas is generated
   * via the use of ASTs. This is passed off to express-graphql.
   *
   * @memberof GQLExpressMiddleware
   * @method ⎆⠀constructor
   * @constructor
   *
   * @param {Array<GQLBase>} handlers an array of GQLBase extended classes
   */
  function GQLExpressMiddleware(handlers) {
    (0, _classCallCheck3.default)(this, GQLExpressMiddleware);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GQLExpressMiddleware.__proto__ || (0, _getPrototypeOf2.default)(GQLExpressMiddleware)).call(this));

    Object.defineProperty(_this, 'cache', {
      enumerable: true,
      writable: true,
      value: new _map2.default()
    });


    _this.handlers = handlers;

    // Generate and cache the schema SDL/IDL string and ast obj (GraphQLSchema)
    _this.ast;
    return _this;
  }

  /**
   * The Schema String and Schema AST/GraphQLSchema JavaScript objects are
   * cached after being processed once. If there is a runtime need to rebuild
   * these objects, calling `clearCache()` will allow their next usage to
   * rebuild them dynamically.
   *
   * @method clearCache
   * @memberof GQLExpressMiddleware
   *
   * @return {GQLExpressMiddleware} returns this so that it can be inlined; ala
   * `gqlExpressMiddleware.clearCache().ast`, for example
   */


  (0, _createClass3.default)(GQLExpressMiddleware, [{
    key: 'clearCache',
    value: function clearCache() {
      this.cache.clear();
      return this;
    }

    /**
     * The schema property returns the textual Schema as it is generated based
     * on the various Lattice types, interfaces and enums defined in your
     * project. The ast property returns the JavaScript AST represenatation of
     * that schema with all injected modificiations detailed in your classes.
     */

  }, {
    key: 'rootValue',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(requestData) {
        var separateByType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var root;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _SchemaUtils.SchemaUtils.createMergedRoot(this.handlers, requestData, separateByType);

              case 2:
                root = _context.sent;
                return _context.abrupt('return', root);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function rootValue(_x2) {
        return _ref.apply(this, arguments);
      }

      return rootValue;
    }()

    /**
     * Using the express-graphql module, it returns an Express 4.x middleware
     * function.
     *
     * @instance
     * @memberof GQLExpressMiddleware
     * @method ⬇︎⠀middleware
     *
     * @return {Function} a function that expects request, response and next
     * parameters as all Express middleware functions.
     */

  }, {
    key: 'generateOptions',


    /**
     * In order to ensure that Lattice functions receive the request data,
     * it is important to use the options function feature of both
     * `express-graphql` and `apollo-server-express`. This function will create
     * an options function that reflects that schema and Lattice types defined
     * in your project.
     *
     * Should you need to tailor the response before it is sent out, you may
     * supply a function as a second parameter that takes two parameters and
     * returns an options object. The patchFn callback signature looks like this
     *
     * ```patchFn(options, {req, res, next|gql})```
     *
     * When using the reference implementation, additional graphql request info
     * can be obtained in lieu of the `next()` function so typically found in
     * Express middleware. Apollo Server simply provides the next function in
     * this location.
     *
     * @param {Object} options any options, to either engine, that make the most
     * sense
     * @param {Function} patchFn see above
     */
    value: function generateOptions() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { graphiql: true };
      var patchFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var optsFn = function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, gql) {
          var schema, opts;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  schema = _this2.ast;
                  _context2.t0 = schema;
                  _context2.next = 4;
                  return _this2.rootValue({ req, res, gql });

                case 4:
                  _context2.t1 = _context2.sent;

                  _context2.t2 = function formatError(error) {
                    return {
                      message: error.message,
                      locations: error.locations,
                      stack: error.stack,
                      path: error.path
                    };
                  };

                  opts = {
                    schema: _context2.t0,
                    rootValue: _context2.t1,
                    formatError: _context2.t2
                  };


                  (0, _lodash.merge)(opts, options);
                  if (patchFn && typeof patchFn === 'function') {
                    (0, _lodash.merge)(opts, patchFn.bind(_this2)(opts, { req, res, gql }) || opts);
                  }

                  return _context2.abrupt('return', opts);

                case 10:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this2);
        }));

        return function optsFn(_x5, _x6, _x7) {
          return _ref2.apply(this, arguments);
        };
      }();

      return optsFn;
    }

    /**
    * In order to ensure that Lattice functions receive the request data,
    * it is important to use the options function feature of both
    * `express-graphql` and `apollo-server-express`. This function will create
    * an options function that reflects that schema and Lattice types defined
    * in your project.
    *
    * Should you need to tailor the response before it is sent out, you may
    * supply a function as a second parameter that takes two parameters and
    * returns an options object. The patchFn callback signature looks like this
    *
    * ```patchFn(options, {req, res, next|gql})```
    *
    * When using the reference implementation, additional graphql request info
    * can be obtained in lieu of the `next()` function so typically found in
    * Express middleware. Apollo Server simply provides the next function in
    * this location.
    *
    * @param {Object} options any options, to either engine, that make the most
    * sense
    * @param {Function} patchFn see above
    */

  }, {
    key: 'generateApolloOptions',
    value: function generateApolloOptions() {
      var _this3 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        formatError: function formatError(error) {
          return {
            message: error.message,
            locations: error.locations,
            stack: error.stack,
            path: error.path
          };
        },
        debug: true
      };
      var patchFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var optsFn = function () {
        var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req) {
          var opts;
          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.t0 = _this3.ast;
                  _context3.next = 3;
                  return _this3.rootValue({ req }, true);

                case 3:
                  _context3.t1 = _context3.sent;
                  opts = {
                    schema: _context3.t0,
                    resolvers: _context3.t1
                  };


                  opts.schema = (0, _graphqlTools.makeExecutableSchema)({
                    typeDefs: [_this3.schema],
                    resolvers: opts.resolvers
                  });

                  _SchemaUtils.SchemaUtils.injectAll(opts.schema, _this3.handlers);

                  (0, _lodash.merge)(opts, options);
                  if (patchFn && typeof patchFn === 'function') {
                    (0, _lodash.merge)(opts, patchFn.bind(_this3)(opts, { req }) || opts);
                  }

                  return _context3.abrupt('return', opts);

                case 10:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this3);
        }));

        return function optsFn(_x10) {
          return _ref3.apply(this, arguments);
        };
      }();

      return optsFn;
    }
  }, {
    key: 'apolloMiddleware',
    value: function apolloMiddleware(apolloFn) {
      var apolloOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var patchFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var opts = this.generateApolloOptions(apolloOpts, patchFn);

      return [_bodyParser2.default.json(), _bodyParser2.default.text({ type: 'application/graphql' }), function (req, res, next) {
        if (req.is('application/graphql')) {
          req.body = { query: req.body };
        }
        next();
      }, apolloFn(opts)];
    }

    /**
     * If your needs require you to specify different values to `graphqlHTTP`,
     * part of the `express-graphql` package, you can use the `customMiddleware`
     * function to do so.
     *
     * The first parameter is an object that should contain valid `graphqlHTTP`
     * options. See https://github.com/graphql/express-graphql#options for more
     * details. Validation is NOT performed.
     *
     * The second parameter is a function that will be called after any options
     * have been applied from the first parameter and the rest of the middleware
     * has been performed. This, if not modified, will be the final options
     * passed into `graphqlHTTP`. In your callback, it is expected that the
     * supplied object is to be modified and THEN RETURNED. Whatever is returned
     * will be used or passed on. If nothing is returned, the options supplied
     * to the function will be used instead.
     *
     * @method ⌾⠀customMiddleware
     * @memberof GQLExpressMiddleware
     * @instance
     *
     * @param {Object} [graphqlHttpOptions={graphiql: true}] standard set of
     * `express-graphql` options. See above.
     * @param {Function} patchFn see above
      * @return {Function} a middleware function compatible with Express
     */

  }, {
    key: 'customMiddleware',
    value: function customMiddleware() {
      var graphqlHttpOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { graphiql: true };
      var patchFn = arguments[1];

      var optsFn = this.generateOptions(graphqlHttpOptions, patchFn);
      return (0, _expressGraphql2.default)(optsFn);
    }

    /**
     * An optional express middleware function that can be mounted to return
     * a copy of the generated schema string being used by GQLExpressMiddleware.
     *
     * @memberof GQLExpressMiddleware
     * @method schemaMiddleware
     * @instance
     *
     * @type {Function}
     */

  }, {
    key: 'ast',
    get: function get() {
      var cached = this.cache.get('ast');

      if (cached) {
        return cached;
      }

      var ast = (0, _graphql.buildSchema)(this.schema);

      _SchemaUtils.SchemaUtils.injectAll(ast, this.handlers);

      this.cache.set('ast', ast);

      return ast;
    }

    /**
     * Generates the textual schema based on the registered `GQLBase` handlers
     * this instance represents.
     *
     * @method GQLExpressMiddleware#⬇︎⠀schema
     * @since 2.7.0
     *
     * @return {string} a generated schema string based on the handlers that
     * are registered with this `GQLExpressMiddleware` instance.
     */

  }, {
    key: 'schema',
    get: function get() {
      var cached = this.cache.get('schema');
      var schema = void 0;

      if (cached) return cached;

      schema = _SchemaUtils.SchemaUtils.generateSchemaSDL(this.handlers);
      this.cache.set('schema', schema);

      return schema;
    }
  }, {
    key: 'middleware',
    get: function get() {
      return this.customMiddleware();
    }

    /**
     * Using the express-graphql module, it returns an Express 4.x middleware
     * function. This version however, has graphiql disabled. Otherwise it is
     * identical to the `middleware` property
     *
     * @instance
     * @memberof GQLExpressMiddleware
     * @method ⬇︎⠀middlewareWithoutGraphiQL
     *
     * @return {Function} a function that expects request, response and next
     * parameters as all Express middleware functions.
     */

  }, {
    key: 'middlewareWithoutGraphiQL',
    get: function get() {
      return this.customMiddleware({ graphiql: false });
    }
  }, {
    key: 'schemaMiddleware',
    get: function get() {
      var _this4 = this;

      return function (req, res, next) {
        res.status(200).send(_this4.schema);
      };
    }

    /**
     * An optional express middleware function that can be mounted to return
     * the JSON AST representation of the schema string being used by
     * GQLExpressMiddleware.
     *
     * @memberof GQLExpressMiddleware
     * @method astMiddleware
     * @instance
     *
     * @type {Function}
     */

  }, {
    key: 'astMiddleware',
    get: function get() {
      return function (req, res, next) {
        res.status(200).send('Temporarily disabled in this version');

        // let cachedOutput = this.cache.get('astMiddlewareOutput')
        // if (cachedOutput) {
        //   res
        //     .status(302)
        //     .set('Content-Type', 'application/json')
        //     .send(cachedOutput)
        // }
        // else {
        //   this.rootValue({req, res, next}, true)
        //     .then(resolvers => {
        //       let schema: GraphQLSchema = buildSchema(this.schema)

        //       SchemaUtils.injectInterfaceResolvers(schema, this.handlers);
        //       SchemaUtils.injectEnums(schema, this.handlers);
        //       SchemaUtils.injectScalars(schema, this.handlers);
        //       SchemaUtils.injectComments(schema, this.handlers);

        //       function killToJSON(obj: any, path = 'obj.') {
        //         for (let key in obj) {
        //           try {
        //             if (key == 'prev' || key == 'next' || key == 'ofType') continue;

        //             if (key == 'toJSON') {
        //               let success = delete obj.toJSON
        //               //console.log(`Killing ${path}toJSON...${success ? 'success' : 'failure'}`)
        //               continue
        //             }

        //             if (key == 'inspect') {
        //               let success = delete obj.inspect
        //               //console.log(`Killing ${path}inspect...${success ? 'success' : 'failure'}`)
        //               continue
        //             }

        //             if (key == 'toString') {
        //               obj.toString = Object.prototype.toString
        //               //console.log(`Replacing ${path}toString with default`)
        //               continue
        //             }

        //             if (typeof obj[key] == 'function') {
        //               obj[key] = `[Function ${obj[key].name}]`
        //               continue
        //             }

        //             if (typeof obj[key] == 'object') {
        //               obj[key] = killToJSON(obj[key], `${path}${key}.`)
        //               continue
        //             }
        //           }
        //           catch (error) {
        //             continue
        //           }
        //         }

        //         return obj
        //       }

        //       // $FlowFixMe
        //       schema = killToJSON(schema)

        //       // Still do not know why/how they are preventing JSONifying the
        //       // _typeMap keys. So aggravting
        //       for (let typeKey of Object.keys(schema._typeMap)) {
        //         let object = {}

        //         // $FlowFixMe
        //         for (let valKey of Object.keys(schema._typeMap[typeKey])) {
        //           // $FlowFixMe
        //           object[valKey] = schema._typeMap[typeKey][valKey]
        //         }

        //         // $FlowFixMe
        //         schema._typeMap[typeKey] = object
        //       }

        //       let output = JSON.stringify(schema)
        //       this.cache.delete('ast')
        //       this.cache.set('astMiddlewareOutput', output)

        //       res
        //         .status(200)
        //         .set('Content-Type', 'application/json')
        //         .send(output)
        //     })
        //     .catch(error => {
        //       console.error(error)

        //       res
        //         .status(500)
        //         .json(error)
        //     })
        // }
      };
    }
  }]);
  return GQLExpressMiddleware;
}(_events2.default);
// @module GQLExpressMiddleware

exports.default = GQLExpressMiddleware;
//# sourceMappingURL=GQLExpressMiddleware.js.map