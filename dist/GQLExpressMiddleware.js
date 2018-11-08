"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GQLExpressMiddleware = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _SyntaxTree = require("./SyntaxTree");

var _GQLBase = require("./GQLBase");

var _GQLInterface = require("./GQLInterface");

var _GQLScalar = require("./GQLScalar");

var _neTypes = require("ne-types");

var _SchemaUtils = require("./SchemaUtils");

var _lodash = _interopRequireWildcard(require("lodash"));

var _graphqlTools = require("graphql-tools");

var _graphql = require("graphql");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

var _events = _interopRequireDefault(require("events"));

var _path = _interopRequireDefault(require("path"));

// @module GQLExpressMiddleware

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
var GQLExpressMiddleware =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(GQLExpressMiddleware, _EventEmitter);

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
    var _this;

    (0, _classCallCheck2.default)(this, GQLExpressMiddleware);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GQLExpressMiddleware).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "cache", new Map());
    _this.handlers = handlers; // Generate and cache the schema SDL/IDL string and ast obj (GraphQLSchema)

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


  (0, _createClass2.default)(GQLExpressMiddleware, [{
    key: "clearCache",
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
    key: "rootValue",
    value: function () {
      var _rootValue = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(requestData) {
        var separateByType,
            root,
            _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                separateByType = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
                _context.next = 3;
                return _SchemaUtils.SchemaUtils.createMergedRoot(this.handlers, requestData, separateByType);

              case 3:
                root = _context.sent;
                return _context.abrupt("return", root);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function rootValue(_x) {
        return _rootValue.apply(this, arguments);
      };
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
    key: "generateOptions",

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

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        graphiql: true
      };
      var patchFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var optsFn =
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee2(req, res, gql) {
          var schema, opts;
          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  schema = _this2.ast;
                  _context2.t0 = schema;
                  _context2.next = 4;
                  return _this2.rootValue({
                    req: req,
                    res: res,
                    gql: gql
                  });

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
                    (0, _lodash.merge)(opts, patchFn.bind(_this2)(opts, {
                      req: req,
                      res: res,
                      gql: gql
                    }) || opts);
                  }

                  return _context2.abrupt("return", opts);

                case 10:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        return function optsFn(_x2, _x3, _x4) {
          return _ref.apply(this, arguments);
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
    key: "generateApolloOptions",
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

      var optsFn =
      /*#__PURE__*/
      function () {
        var _ref2 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee3(req, res) {
          var opts;
          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.t0 = _this3.ast;
                  _context3.next = 3;
                  return _this3.rootValue({
                    req: req,
                    res: res
                  }, true);

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
                    (0, _lodash.merge)(opts, patchFn.bind(_this3)(opts, {
                      req: req,
                      res: res
                    }) || opts);
                  }

                  return _context3.abrupt("return", opts);

                case 10:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        return function optsFn(_x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }();

      return optsFn;
    }
  }, {
    key: "apolloMiddleware",
    value: function apolloMiddleware(apolloFn) {
      var apolloOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var patchFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var opts = this.generateApolloOptions(apolloOpts, patchFn);
      return [_bodyParser.default.json(), _bodyParser.default.text({
        type: 'application/graphql'
      }), function (req, res, next) {
        if (req.is('application/graphql')) {
          req.body = {
            query: req.body
          };
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
    key: "customMiddleware",
    value: function customMiddleware() {
      var graphqlHttpOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        graphiql: true
      };
      var patchFn = arguments.length > 1 ? arguments[1] : undefined;
      var optsFn = this.generateOptions(graphqlHttpOptions, patchFn);
      return (0, _expressGraphql.default)(optsFn);
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
    key: "ast",
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
    key: "schema",
    get: function get() {
      var cached = this.cache.get('schema');
      var schema;
      if (cached) return cached;
      schema = _SchemaUtils.SchemaUtils.generateSchemaSDL(this.handlers);
      this.cache.set('schema', schema);
      return schema;
    }
  }, {
    key: "middleware",
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
    key: "middlewareWithoutGraphiQL",
    get: function get() {
      return this.customMiddleware({
        graphiql: false
      });
    }
  }, {
    key: "schemaMiddleware",
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
    key: "astMiddleware",
    get: function get() {
      return function (req, res, next) {
        res.status(200).send('Temporarily disabled in this version'); // let cachedOutput = this.cache.get('astMiddlewareOutput')
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
}(_events.default);

exports.GQLExpressMiddleware = GQLExpressMiddleware;
var _default = GQLExpressMiddleware;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxFeHByZXNzTWlkZGxld2FyZS5qcyJdLCJuYW1lcyI6WyJHUUxFeHByZXNzTWlkZGxld2FyZSIsImhhbmRsZXJzIiwiTWFwIiwiYXN0IiwiY2FjaGUiLCJjbGVhciIsInJlcXVlc3REYXRhIiwic2VwYXJhdGVCeVR5cGUiLCJTY2hlbWFVdGlscyIsImNyZWF0ZU1lcmdlZFJvb3QiLCJyb290Iiwib3B0aW9ucyIsImdyYXBoaXFsIiwicGF0Y2hGbiIsIm9wdHNGbiIsInJlcSIsInJlcyIsImdxbCIsInNjaGVtYSIsInJvb3RWYWx1ZSIsImVycm9yIiwibWVzc2FnZSIsImxvY2F0aW9ucyIsInN0YWNrIiwicGF0aCIsIm9wdHMiLCJmb3JtYXRFcnJvciIsImJpbmQiLCJkZWJ1ZyIsInJlc29sdmVycyIsInR5cGVEZWZzIiwiaW5qZWN0QWxsIiwiYXBvbGxvRm4iLCJhcG9sbG9PcHRzIiwiZ2VuZXJhdGVBcG9sbG9PcHRpb25zIiwiYm9keVBhcnNlciIsImpzb24iLCJ0ZXh0IiwidHlwZSIsIm5leHQiLCJpcyIsImJvZHkiLCJxdWVyeSIsImdyYXBocWxIdHRwT3B0aW9ucyIsImdlbmVyYXRlT3B0aW9ucyIsImNhY2hlZCIsImdldCIsInNldCIsImdlbmVyYXRlU2NoZW1hU0RMIiwiY3VzdG9tTWlkZGxld2FyZSIsInN0YXR1cyIsInNlbmQiLCJFdmVudEVtaXR0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBVUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBeEJBOztBQTBCQTs7Ozs7Ozs7Ozs7SUFXYUEsb0I7Ozs7O0FBUVg7Ozs7Ozs7Ozs7O0FBV0EsZ0NBQVlDLFFBQVosRUFBc0M7QUFBQTs7QUFBQTtBQUNwQztBQURvQyw4SEFiZixJQUFJQyxHQUFKLEVBYWU7QUFHcEMsVUFBS0QsUUFBTCxHQUFnQkEsUUFB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QUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0QsT0FoR0Q7QUFpR0Q7OztFQXphdUNDLGU7OztlQTRhM0JwRCxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vLyBAbW9kdWxlIEdRTEV4cHJlc3NNaWRkbGV3YXJlXG5cbmltcG9ydCB7IFN5bnRheFRyZWUgfSBmcm9tICcuL1N5bnRheFRyZWUnXG5pbXBvcnQgeyBHUUxCYXNlIH0gZnJvbSAnLi9HUUxCYXNlJ1xuaW1wb3J0IHsgR1FMSW50ZXJmYWNlIH0gZnJvbSAnLi9HUUxJbnRlcmZhY2UnXG5pbXBvcnQgeyBHUUxTY2FsYXIgfSBmcm9tICcuL0dRTFNjYWxhcidcbmltcG9ydCB7IHR5cGVPZiB9IGZyb20gJ25lLXR5cGVzJ1xuaW1wb3J0IHsgU2NoZW1hVXRpbHMgfSBmcm9tICcuL1NjaGVtYVV0aWxzJ1xuaW1wb3J0IF8sIHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBtYWtlRXhlY3V0YWJsZVNjaGVtYSB9IGZyb20gJ2dyYXBocWwtdG9vbHMnXG5cbmltcG9ydCB7XG4gIHBhcnNlLFxuICBwcmludCxcbiAgYnVpbGRTY2hlbWEsXG4gIEdyYXBoUUxTY2hlbWEsXG4gIEdyYXBoUUxJbnRlcmZhY2VUeXBlLFxuICBHcmFwaFFMRW51bVR5cGUsXG4gIEdyYXBoUUxTY2FsYXJUeXBlXG59IGZyb20gJ2dyYXBocWwnXG5cbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJ1xuaW1wb3J0IGdyYXBocWxIVFRQIGZyb20gJ2V4cHJlc3MtZ3JhcGhxbCdcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuLyoqXG4gKiBBIGhhbmRsZXIgdGhhdCBleHBvc2VzIGFuIGV4cHJlc3MgbWlkZGxld2FyZSBmdW5jdGlvbiB0aGF0IG1vdW50cyBhXG4gKiBHcmFwaFFMIEkvTyBlbmRwb2ludC4gVHlwaWNhbCB1c2FnZSBmb2xsb3dzOlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhcHAgPSBleHByZXNzKCk7XG4gKiBhcHAudXNlKC8uLi4vLCBuZXcgR1FMRXhwcmVzc01pZGRsZXdhcmUoWy4uLmNsYXNzZXNdKS5taWRkbGV3YXJlKTtcbiAqIGBgYFxuICpcbiAqIEBjbGFzcyBHUUxFeHByZXNzTWlkZGxld2FyZVxuICovXG5leHBvcnQgY2xhc3MgR1FMRXhwcmVzc01pZGRsZXdhcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbntcbiAgaGFuZGxlcnM6IEFycmF5PEdRTEJhc2U+O1xuXG4gIHNjaGVtYTogc3RyaW5nO1xuXG4gIGNhY2hlOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpXG5cbiAgLyoqXG4gICAqIEZvciBub3csIHRha2VzIGFuIEFycmF5IG9mIGNsYXNzZXMgZXh0ZW5kaW5nIGZyb20gR1FMQmFzZS4gVGhlc2UgYXJlXG4gICAqIHBhcnNlZCBhbmQgYSBjb21iaW5lZCBzY2hlbWEgb2YgYWxsIHRoZWlyIGluZGl2aWR1YWwgc2NoZW1hcyBpcyBnZW5lcmF0ZWRcbiAgICogdmlhIHRoZSB1c2Ugb2YgQVNUcy4gVGhpcyBpcyBwYXNzZWQgb2ZmIHRvIGV4cHJlc3MtZ3JhcGhxbC5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEV4cHJlc3NNaWRkbGV3YXJlXG4gICAqIEBtZXRob2Qg4o6G4qCAY29uc3RydWN0b3JcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8R1FMQmFzZT59IGhhbmRsZXJzIGFuIGFycmF5IG9mIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3Nlc1xuICAgKi9cbiAgY29uc3RydWN0b3IoaGFuZGxlcnM6IEFycmF5PEdRTEJhc2U+KSB7XG4gICAgc3VwZXIoKVxuXG4gICAgdGhpcy5oYW5kbGVycyA9IGhhbmRsZXJzXG5cbiAgICAvLyBHZW5lcmF0ZSBhbmQgY2FjaGUgdGhlIHNjaGVtYSBTREwvSURMIHN0cmluZyBhbmQgYXN0IG9iaiAoR3JhcGhRTFNjaGVtYSlcbiAgICB0aGlzLmFzdFxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBTY2hlbWEgU3RyaW5nIGFuZCBTY2hlbWEgQVNUL0dyYXBoUUxTY2hlbWEgSmF2YVNjcmlwdCBvYmplY3RzIGFyZVxuICAgKiBjYWNoZWQgYWZ0ZXIgYmVpbmcgcHJvY2Vzc2VkIG9uY2UuIElmIHRoZXJlIGlzIGEgcnVudGltZSBuZWVkIHRvIHJlYnVpbGRcbiAgICogdGhlc2Ugb2JqZWN0cywgY2FsbGluZyBgY2xlYXJDYWNoZSgpYCB3aWxsIGFsbG93IHRoZWlyIG5leHQgdXNhZ2UgdG9cbiAgICogcmVidWlsZCB0aGVtIGR5bmFtaWNhbGx5LlxuICAgKlxuICAgKiBAbWV0aG9kIGNsZWFyQ2FjaGVcbiAgICogQG1lbWJlcm9mIEdRTEV4cHJlc3NNaWRkbGV3YXJlXG4gICAqXG4gICAqIEByZXR1cm4ge0dRTEV4cHJlc3NNaWRkbGV3YXJlfSByZXR1cm5zIHRoaXMgc28gdGhhdCBpdCBjYW4gYmUgaW5saW5lZDsgYWxhXG4gICAqIGBncWxFeHByZXNzTWlkZGxld2FyZS5jbGVhckNhY2hlKCkuYXN0YCwgZm9yIGV4YW1wbGVcbiAgICovXG4gIGNsZWFyQ2FjaGUoKTogR1FMRXhwcmVzc01pZGRsZXdhcmUge1xuICAgIHRoaXMuY2FjaGUuY2xlYXIoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogVGhlIHNjaGVtYSBwcm9wZXJ0eSByZXR1cm5zIHRoZSB0ZXh0dWFsIFNjaGVtYSBhcyBpdCBpcyBnZW5lcmF0ZWQgYmFzZWRcbiAgICogb24gdGhlIHZhcmlvdXMgTGF0dGljZSB0eXBlcywgaW50ZXJmYWNlcyBhbmQgZW51bXMgZGVmaW5lZCBpbiB5b3VyXG4gICAqIHByb2plY3QuIFRoZSBhc3QgcHJvcGVydHkgcmV0dXJucyB0aGUgSmF2YVNjcmlwdCBBU1QgcmVwcmVzZW5hdGF0aW9uIG9mXG4gICAqIHRoYXQgc2NoZW1hIHdpdGggYWxsIGluamVjdGVkIG1vZGlmaWNpYXRpb25zIGRldGFpbGVkIGluIHlvdXIgY2xhc3Nlcy5cbiAgICovXG4gIGdldCBhc3QoKTogR3JhcGhRTFNjaGVtYSB7XG4gICAgbGV0IGNhY2hlZDogP0dyYXBoUUxTY2hlbWEgPSB0aGlzLmNhY2hlLmdldCgnYXN0JylcblxuICAgIGlmIChjYWNoZWQpIHtcbiAgICAgIHJldHVybiBjYWNoZWRcbiAgICB9XG5cbiAgICBsZXQgYXN0OiBHcmFwaFFMU2NoZW1hID0gYnVpbGRTY2hlbWEodGhpcy5zY2hlbWEpXG5cbiAgICBTY2hlbWFVdGlscy5pbmplY3RBbGwoYXN0LCB0aGlzLmhhbmRsZXJzKTtcblxuICAgIHRoaXMuY2FjaGUuc2V0KCdhc3QnLCBhc3QpXG5cbiAgICByZXR1cm4gYXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyB0aGUgdGV4dHVhbCBzY2hlbWEgYmFzZWQgb24gdGhlIHJlZ2lzdGVyZWQgYEdRTEJhc2VgIGhhbmRsZXJzXG4gICAqIHRoaXMgaW5zdGFuY2UgcmVwcmVzZW50cy5cbiAgICpcbiAgICogQG1ldGhvZCBHUUxFeHByZXNzTWlkZGxld2FyZSPirIfvuI7ioIBzY2hlbWFcbiAgICogQHNpbmNlIDIuNy4wXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYSBnZW5lcmF0ZWQgc2NoZW1hIHN0cmluZyBiYXNlZCBvbiB0aGUgaGFuZGxlcnMgdGhhdFxuICAgKiBhcmUgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgYEdRTEV4cHJlc3NNaWRkbGV3YXJlYCBpbnN0YW5jZS5cbiAgICovXG4gIGdldCBzY2hlbWEoKTogc3RyaW5nIHtcbiAgICBsZXQgY2FjaGVkID0gdGhpcy5jYWNoZS5nZXQoJ3NjaGVtYScpXG4gICAgbGV0IHNjaGVtYVxuXG4gICAgaWYgKGNhY2hlZCkgcmV0dXJuIGNhY2hlZFxuXG4gICAgc2NoZW1hID0gU2NoZW1hVXRpbHMuZ2VuZXJhdGVTY2hlbWFTREwodGhpcy5oYW5kbGVycyk7XG4gICAgdGhpcy5jYWNoZS5zZXQoJ3NjaGVtYScsIHNjaGVtYSlcblxuICAgIHJldHVybiBzY2hlbWFcbiAgfVxuXG4gIGFzeW5jIHJvb3RWYWx1ZShcbiAgICByZXF1ZXN0RGF0YTogT2JqZWN0LFxuICAgIHNlcGFyYXRlQnlUeXBlOiBib29sZWFuID0gZmFsc2VcbiAgKTogT2JqZWN0IHtcbiAgICBsZXQgcm9vdCA9IGF3YWl0IFNjaGVtYVV0aWxzLmNyZWF0ZU1lcmdlZFJvb3QoXG4gICAgICB0aGlzLmhhbmRsZXJzLCByZXF1ZXN0RGF0YSwgc2VwYXJhdGVCeVR5cGVcbiAgICApXG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2luZyB0aGUgZXhwcmVzcy1ncmFwaHFsIG1vZHVsZSwgaXQgcmV0dXJucyBhbiBFeHByZXNzIDQueCBtaWRkbGV3YXJlXG4gICAqIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIEdRTEV4cHJlc3NNaWRkbGV3YXJlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAbWlkZGxld2FyZVxuICAgKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBmdW5jdGlvbiB0aGF0IGV4cGVjdHMgcmVxdWVzdCwgcmVzcG9uc2UgYW5kIG5leHRcbiAgICogcGFyYW1ldGVycyBhcyBhbGwgRXhwcmVzcyBtaWRkbGV3YXJlIGZ1bmN0aW9ucy5cbiAgICovXG4gIGdldCBtaWRkbGV3YXJlKCk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5jdXN0b21NaWRkbGV3YXJlKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNpbmcgdGhlIGV4cHJlc3MtZ3JhcGhxbCBtb2R1bGUsIGl0IHJldHVybnMgYW4gRXhwcmVzcyA0LnggbWlkZGxld2FyZVxuICAgKiBmdW5jdGlvbi4gVGhpcyB2ZXJzaW9uIGhvd2V2ZXIsIGhhcyBncmFwaGlxbCBkaXNhYmxlZC4gT3RoZXJ3aXNlIGl0IGlzXG4gICAqIGlkZW50aWNhbCB0byB0aGUgYG1pZGRsZXdhcmVgIHByb3BlcnR5XG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgR1FMRXhwcmVzc01pZGRsZXdhcmVcbiAgICogQG1ldGhvZCDirIfvuI7ioIBtaWRkbGV3YXJlV2l0aG91dEdyYXBoaVFMXG4gICAqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGZ1bmN0aW9uIHRoYXQgZXhwZWN0cyByZXF1ZXN0LCByZXNwb25zZSBhbmQgbmV4dFxuICAgKiBwYXJhbWV0ZXJzIGFzIGFsbCBFeHByZXNzIG1pZGRsZXdhcmUgZnVuY3Rpb25zLlxuICAgKi9cbiAgZ2V0IG1pZGRsZXdhcmVXaXRob3V0R3JhcGhpUUwoKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbU1pZGRsZXdhcmUoe2dyYXBoaXFsOiBmYWxzZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IExhdHRpY2UgZnVuY3Rpb25zIHJlY2VpdmUgdGhlIHJlcXVlc3QgZGF0YSxcbiAgICogaXQgaXMgaW1wb3J0YW50IHRvIHVzZSB0aGUgb3B0aW9ucyBmdW5jdGlvbiBmZWF0dXJlIG9mIGJvdGhcbiAgICogYGV4cHJlc3MtZ3JhcGhxbGAgYW5kIGBhcG9sbG8tc2VydmVyLWV4cHJlc3NgLiBUaGlzIGZ1bmN0aW9uIHdpbGwgY3JlYXRlXG4gICAqIGFuIG9wdGlvbnMgZnVuY3Rpb24gdGhhdCByZWZsZWN0cyB0aGF0IHNjaGVtYSBhbmQgTGF0dGljZSB0eXBlcyBkZWZpbmVkXG4gICAqIGluIHlvdXIgcHJvamVjdC5cbiAgICpcbiAgICogU2hvdWxkIHlvdSBuZWVkIHRvIHRhaWxvciB0aGUgcmVzcG9uc2UgYmVmb3JlIGl0IGlzIHNlbnQgb3V0LCB5b3UgbWF5XG4gICAqIHN1cHBseSBhIGZ1bmN0aW9uIGFzIGEgc2Vjb25kIHBhcmFtZXRlciB0aGF0IHRha2VzIHR3byBwYXJhbWV0ZXJzIGFuZFxuICAgKiByZXR1cm5zIGFuIG9wdGlvbnMgb2JqZWN0LiBUaGUgcGF0Y2hGbiBjYWxsYmFjayBzaWduYXR1cmUgbG9va3MgbGlrZSB0aGlzXG4gICAqXG4gICAqIGBgYHBhdGNoRm4ob3B0aW9ucywge3JlcSwgcmVzLCBuZXh0fGdxbH0pYGBgXG4gICAqXG4gICAqIFdoZW4gdXNpbmcgdGhlIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbiwgYWRkaXRpb25hbCBncmFwaHFsIHJlcXVlc3QgaW5mb1xuICAgKiBjYW4gYmUgb2J0YWluZWQgaW4gbGlldSBvZiB0aGUgYG5leHQoKWAgZnVuY3Rpb24gc28gdHlwaWNhbGx5IGZvdW5kIGluXG4gICAqIEV4cHJlc3MgbWlkZGxld2FyZS4gQXBvbGxvIFNlcnZlciBzaW1wbHkgcHJvdmlkZXMgdGhlIG5leHQgZnVuY3Rpb24gaW5cbiAgICogdGhpcyBsb2NhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgYW55IG9wdGlvbnMsIHRvIGVpdGhlciBlbmdpbmUsIHRoYXQgbWFrZSB0aGUgbW9zdFxuICAgKiBzZW5zZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXRjaEZuIHNlZSBhYm92ZVxuICAgKi9cbiAgZ2VuZXJhdGVPcHRpb25zKFxuICAgIG9wdGlvbnM6IE9iamVjdCA9IHsgZ3JhcGhpcWw6IHRydWUgfSxcbiAgICBwYXRjaEZuOiA/RnVuY3Rpb24gPSBudWxsXG4gICk6IEZ1bmN0aW9uIHtcbiAgICBjb25zdCBvcHRzRm4gPSBhc3luYyAocmVxOiBtaXhlZCwgcmVzOiBtaXhlZCwgZ3FsOiBtaXhlZCkgPT4ge1xuICAgICAgbGV0IHNjaGVtYSA9IHRoaXMuYXN0O1xuICAgICAgbGV0IG9wdHMgPSB7XG4gICAgICAgIHNjaGVtYSxcbiAgICAgICAgcm9vdFZhbHVlOiBhd2FpdCB0aGlzLnJvb3RWYWx1ZSh7cmVxLCByZXMsIGdxbH0pLFxuICAgICAgICBmb3JtYXRFcnJvcjogZXJyb3IgPT4gKHtcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgIGxvY2F0aW9uczogZXJyb3IubG9jYXRpb25zLFxuICAgICAgICAgIHN0YWNrOiBlcnJvci5zdGFjayxcbiAgICAgICAgICBwYXRoOiBlcnJvci5wYXRoXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIG1lcmdlKG9wdHMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHBhdGNoRm4gJiYgdHlwZW9mIHBhdGNoRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbWVyZ2UoXG4gICAgICAgICAgb3B0cyxcbiAgICAgICAgICAocGF0Y2hGbi5iaW5kKHRoaXMpKG9wdHMsIHtyZXEsIHJlcywgZ3FsfSkpIHx8IG9wdHNcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9wdHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdHNGblxuICB9XG5cbiAgICAvKipcbiAgICogSW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgTGF0dGljZSBmdW5jdGlvbnMgcmVjZWl2ZSB0aGUgcmVxdWVzdCBkYXRhLFxuICAgKiBpdCBpcyBpbXBvcnRhbnQgdG8gdXNlIHRoZSBvcHRpb25zIGZ1bmN0aW9uIGZlYXR1cmUgb2YgYm90aFxuICAgKiBgZXhwcmVzcy1ncmFwaHFsYCBhbmQgYGFwb2xsby1zZXJ2ZXItZXhwcmVzc2AuIFRoaXMgZnVuY3Rpb24gd2lsbCBjcmVhdGVcbiAgICogYW4gb3B0aW9ucyBmdW5jdGlvbiB0aGF0IHJlZmxlY3RzIHRoYXQgc2NoZW1hIGFuZCBMYXR0aWNlIHR5cGVzIGRlZmluZWRcbiAgICogaW4geW91ciBwcm9qZWN0LlxuICAgKlxuICAgKiBTaG91bGQgeW91IG5lZWQgdG8gdGFpbG9yIHRoZSByZXNwb25zZSBiZWZvcmUgaXQgaXMgc2VudCBvdXQsIHlvdSBtYXlcbiAgICogc3VwcGx5IGEgZnVuY3Rpb24gYXMgYSBzZWNvbmQgcGFyYW1ldGVyIHRoYXQgdGFrZXMgdHdvIHBhcmFtZXRlcnMgYW5kXG4gICAqIHJldHVybnMgYW4gb3B0aW9ucyBvYmplY3QuIFRoZSBwYXRjaEZuIGNhbGxiYWNrIHNpZ25hdHVyZSBsb29rcyBsaWtlIHRoaXNcbiAgICpcbiAgICogYGBgcGF0Y2hGbihvcHRpb25zLCB7cmVxLCByZXMsIG5leHR8Z3FsfSlgYGBcbiAgICpcbiAgICogV2hlbiB1c2luZyB0aGUgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLCBhZGRpdGlvbmFsIGdyYXBocWwgcmVxdWVzdCBpbmZvXG4gICAqIGNhbiBiZSBvYnRhaW5lZCBpbiBsaWV1IG9mIHRoZSBgbmV4dCgpYCBmdW5jdGlvbiBzbyB0eXBpY2FsbHkgZm91bmQgaW5cbiAgICogRXhwcmVzcyBtaWRkbGV3YXJlLiBBcG9sbG8gU2VydmVyIHNpbXBseSBwcm92aWRlcyB0aGUgbmV4dCBmdW5jdGlvbiBpblxuICAgKiB0aGlzIGxvY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBhbnkgb3B0aW9ucywgdG8gZWl0aGVyIGVuZ2luZSwgdGhhdCBtYWtlIHRoZSBtb3N0XG4gICAqIHNlbnNlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHBhdGNoRm4gc2VlIGFib3ZlXG4gICAqL1xuICBnZW5lcmF0ZUFwb2xsb09wdGlvbnMoXG4gICAgb3B0aW9uczogT2JqZWN0ID0ge1xuICAgICAgZm9ybWF0RXJyb3I6IGVycm9yID0+ICh7XG4gICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgIGxvY2F0aW9uczogZXJyb3IubG9jYXRpb25zLFxuICAgICAgICBzdGFjazogZXJyb3Iuc3RhY2ssXG4gICAgICAgIHBhdGg6IGVycm9yLnBhdGhcbiAgICAgIH0pLFxuICAgICAgZGVidWc6IHRydWVcbiAgICB9LFxuICAgIHBhdGNoRm46ID9GdW5jdGlvbiA9IG51bGxcbiAgKTogRnVuY3Rpb24ge1xuICAgIGNvbnN0IG9wdHNGbiA9IGFzeW5jIChyZXE6IG1peGVkLCByZXM6IG1peGVkKSA9PiB7XG4gICAgICBsZXQgb3B0cyA9IHtcbiAgICAgICAgc2NoZW1hOiB0aGlzLmFzdCxcbiAgICAgICAgcmVzb2x2ZXJzOiBhd2FpdCB0aGlzLnJvb3RWYWx1ZSh7cmVxLCByZXN9LCB0cnVlKVxuICAgICAgfVxuXG4gICAgICBvcHRzLnNjaGVtYSA9IG1ha2VFeGVjdXRhYmxlU2NoZW1hKHtcbiAgICAgICAgdHlwZURlZnM6IFt0aGlzLnNjaGVtYV0sXG4gICAgICAgIHJlc29sdmVyczogb3B0cy5yZXNvbHZlcnNcbiAgICAgIH0pXG5cbiAgICAgIFNjaGVtYVV0aWxzLmluamVjdEFsbChvcHRzLnNjaGVtYSwgdGhpcy5oYW5kbGVycyk7XG5cbiAgICAgIG1lcmdlKG9wdHMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHBhdGNoRm4gJiYgdHlwZW9mIHBhdGNoRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbWVyZ2UoXG4gICAgICAgICAgb3B0cyxcbiAgICAgICAgICAocGF0Y2hGbi5iaW5kKHRoaXMpKG9wdHMsIHtyZXEsIHJlc30pKSB8fCBvcHRzXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvcHRzO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRzRm5cbiAgfVxuXG4gIGFwb2xsb01pZGRsZXdhcmUoXG4gICAgYXBvbGxvRm46IEZ1bmN0aW9uLFxuICAgIGFwb2xsb09wdHM6IE9iamVjdCA9IHt9LFxuICAgIHBhdGNoRm46ID9GdW5jdGlvbiA9IG51bGxcbiAgKTogQXJyYXk8RnVuY3Rpb24+IHtcbiAgICBsZXQgb3B0cyA9IHRoaXMuZ2VuZXJhdGVBcG9sbG9PcHRpb25zKGFwb2xsb09wdHMsIHBhdGNoRm4pXG5cbiAgICByZXR1cm4gW1xuICAgICAgYm9keVBhcnNlci5qc29uKCksXG4gICAgICBib2R5UGFyc2VyLnRleHQoeyB0eXBlOiAnYXBwbGljYXRpb24vZ3JhcGhxbCcgfSksXG4gICAgICAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgICBpZiAocmVxLmlzKCdhcHBsaWNhdGlvbi9ncmFwaHFsJykpIHtcbiAgICAgICAgICAgICAgcmVxLmJvZHkgPSB7IHF1ZXJ5OiByZXEuYm9keSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXh0KCk7XG4gICAgICB9LFxuICAgICAgYXBvbGxvRm4ob3B0cylcbiAgICBdXG4gIH1cblxuICAvKipcbiAgICogSWYgeW91ciBuZWVkcyByZXF1aXJlIHlvdSB0byBzcGVjaWZ5IGRpZmZlcmVudCB2YWx1ZXMgdG8gYGdyYXBocWxIVFRQYCxcbiAgICogcGFydCBvZiB0aGUgYGV4cHJlc3MtZ3JhcGhxbGAgcGFja2FnZSwgeW91IGNhbiB1c2UgdGhlIGBjdXN0b21NaWRkbGV3YXJlYFxuICAgKiBmdW5jdGlvbiB0byBkbyBzby5cbiAgICpcbiAgICogVGhlIGZpcnN0IHBhcmFtZXRlciBpcyBhbiBvYmplY3QgdGhhdCBzaG91bGQgY29udGFpbiB2YWxpZCBgZ3JhcGhxbEhUVFBgXG4gICAqIG9wdGlvbnMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZ3JhcGhxbC9leHByZXNzLWdyYXBocWwjb3B0aW9ucyBmb3IgbW9yZVxuICAgKiBkZXRhaWxzLiBWYWxpZGF0aW9uIGlzIE5PVCBwZXJmb3JtZWQuXG4gICAqXG4gICAqIFRoZSBzZWNvbmQgcGFyYW1ldGVyIGlzIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBhZnRlciBhbnkgb3B0aW9uc1xuICAgKiBoYXZlIGJlZW4gYXBwbGllZCBmcm9tIHRoZSBmaXJzdCBwYXJhbWV0ZXIgYW5kIHRoZSByZXN0IG9mIHRoZSBtaWRkbGV3YXJlXG4gICAqIGhhcyBiZWVuIHBlcmZvcm1lZC4gVGhpcywgaWYgbm90IG1vZGlmaWVkLCB3aWxsIGJlIHRoZSBmaW5hbCBvcHRpb25zXG4gICAqIHBhc3NlZCBpbnRvIGBncmFwaHFsSFRUUGAuIEluIHlvdXIgY2FsbGJhY2ssIGl0IGlzIGV4cGVjdGVkIHRoYXQgdGhlXG4gICAqIHN1cHBsaWVkIG9iamVjdCBpcyB0byBiZSBtb2RpZmllZCBhbmQgVEhFTiBSRVRVUk5FRC4gV2hhdGV2ZXIgaXMgcmV0dXJuZWRcbiAgICogd2lsbCBiZSB1c2VkIG9yIHBhc3NlZCBvbi4gSWYgbm90aGluZyBpcyByZXR1cm5lZCwgdGhlIG9wdGlvbnMgc3VwcGxpZWRcbiAgICogdG8gdGhlIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLlxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggGN1c3RvbU1pZGRsZXdhcmVcbiAgICogQG1lbWJlcm9mIEdRTEV4cHJlc3NNaWRkbGV3YXJlXG4gICAqIEBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2dyYXBocWxIdHRwT3B0aW9ucz17Z3JhcGhpcWw6IHRydWV9XSBzdGFuZGFyZCBzZXQgb2ZcbiAgICogYGV4cHJlc3MtZ3JhcGhxbGAgb3B0aW9ucy4gU2VlIGFib3ZlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXRjaEZuIHNlZSBhYm92ZVxuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIG1pZGRsZXdhcmUgZnVuY3Rpb24gY29tcGF0aWJsZSB3aXRoIEV4cHJlc3NcbiAgICovXG4gIGN1c3RvbU1pZGRsZXdhcmUoXG4gICAgZ3JhcGhxbEh0dHBPcHRpb25zOiBPYmplY3QgPSB7Z3JhcGhpcWw6IHRydWV9LFxuICAgIHBhdGNoRm4/OiBGdW5jdGlvblxuICApOiBGdW5jdGlvbiB7XG4gICAgY29uc3Qgb3B0c0ZuID0gdGhpcy5nZW5lcmF0ZU9wdGlvbnMoZ3JhcGhxbEh0dHBPcHRpb25zLCBwYXRjaEZuKVxuICAgIHJldHVybiBncmFwaHFsSFRUUChvcHRzRm4pXG4gIH1cblxuICAvKipcbiAgICogQW4gb3B0aW9uYWwgZXhwcmVzcyBtaWRkbGV3YXJlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIG1vdW50ZWQgdG8gcmV0dXJuXG4gICAqIGEgY29weSBvZiB0aGUgZ2VuZXJhdGVkIHNjaGVtYSBzdHJpbmcgYmVpbmcgdXNlZCBieSBHUUxFeHByZXNzTWlkZGxld2FyZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEV4cHJlc3NNaWRkbGV3YXJlXG4gICAqIEBtZXRob2Qgc2NoZW1hTWlkZGxld2FyZVxuICAgKiBAaW5zdGFuY2VcbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IHNjaGVtYU1pZGRsZXdhcmUoKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAocmVxOiBPYmplY3QsIHJlczogT2JqZWN0LCBuZXh0OiA/RnVuY3Rpb24pID0+IHtcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHRoaXMuc2NoZW1hKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQW4gb3B0aW9uYWwgZXhwcmVzcyBtaWRkbGV3YXJlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIG1vdW50ZWQgdG8gcmV0dXJuXG4gICAqIHRoZSBKU09OIEFTVCByZXByZXNlbnRhdGlvbiBvZiB0aGUgc2NoZW1hIHN0cmluZyBiZWluZyB1c2VkIGJ5XG4gICAqIEdRTEV4cHJlc3NNaWRkbGV3YXJlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMRXhwcmVzc01pZGRsZXdhcmVcbiAgICogQG1ldGhvZCBhc3RNaWRkbGV3YXJlXG4gICAqIEBpbnN0YW5jZVxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgYXN0TWlkZGxld2FyZSgpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIChyZXE6IE9iamVjdCwgcmVzOiBPYmplY3QsIG5leHQ6ID9GdW5jdGlvbikgPT4ge1xuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoJ1RlbXBvcmFyaWx5IGRpc2FibGVkIGluIHRoaXMgdmVyc2lvbicpXG5cbiAgICAgIC8vIGxldCBjYWNoZWRPdXRwdXQgPSB0aGlzLmNhY2hlLmdldCgnYXN0TWlkZGxld2FyZU91dHB1dCcpXG4gICAgICAvLyBpZiAoY2FjaGVkT3V0cHV0KSB7XG4gICAgICAvLyAgIHJlc1xuICAgICAgLy8gICAgIC5zdGF0dXMoMzAyKVxuICAgICAgLy8gICAgIC5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJylcbiAgICAgIC8vICAgICAuc2VuZChjYWNoZWRPdXRwdXQpXG4gICAgICAvLyB9XG4gICAgICAvLyBlbHNlIHtcbiAgICAgIC8vICAgdGhpcy5yb290VmFsdWUoe3JlcSwgcmVzLCBuZXh0fSwgdHJ1ZSlcbiAgICAgIC8vICAgICAudGhlbihyZXNvbHZlcnMgPT4ge1xuICAgICAgLy8gICAgICAgbGV0IHNjaGVtYTogR3JhcGhRTFNjaGVtYSA9IGJ1aWxkU2NoZW1hKHRoaXMuc2NoZW1hKVxuXG4gICAgICAvLyAgICAgICBTY2hlbWFVdGlscy5pbmplY3RJbnRlcmZhY2VSZXNvbHZlcnMoc2NoZW1hLCB0aGlzLmhhbmRsZXJzKTtcbiAgICAgIC8vICAgICAgIFNjaGVtYVV0aWxzLmluamVjdEVudW1zKHNjaGVtYSwgdGhpcy5oYW5kbGVycyk7XG4gICAgICAvLyAgICAgICBTY2hlbWFVdGlscy5pbmplY3RTY2FsYXJzKHNjaGVtYSwgdGhpcy5oYW5kbGVycyk7XG4gICAgICAvLyAgICAgICBTY2hlbWFVdGlscy5pbmplY3RDb21tZW50cyhzY2hlbWEsIHRoaXMuaGFuZGxlcnMpO1xuXG4gICAgICAvLyAgICAgICBmdW5jdGlvbiBraWxsVG9KU09OKG9iajogYW55LCBwYXRoID0gJ29iai4nKSB7XG4gICAgICAvLyAgICAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgIC8vICAgICAgICAgICB0cnkge1xuICAgICAgLy8gICAgICAgICAgICAgaWYgKGtleSA9PSAncHJldicgfHwga2V5ID09ICduZXh0JyB8fCBrZXkgPT0gJ29mVHlwZScpIGNvbnRpbnVlO1xuXG4gICAgICAvLyAgICAgICAgICAgICBpZiAoa2V5ID09ICd0b0pTT04nKSB7XG4gICAgICAvLyAgICAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZGVsZXRlIG9iai50b0pTT05cbiAgICAgIC8vICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgS2lsbGluZyAke3BhdGh9dG9KU09OLi4uJHtzdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWx1cmUnfWApXG4gICAgICAvLyAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAvLyAgICAgICAgICAgICB9XG5cbiAgICAgIC8vICAgICAgICAgICAgIGlmIChrZXkgPT0gJ2luc3BlY3QnKSB7XG4gICAgICAvLyAgICAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZGVsZXRlIG9iai5pbnNwZWN0XG4gICAgICAvLyAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coYEtpbGxpbmcgJHtwYXRofWluc3BlY3QuLi4ke3N1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbHVyZSd9YClcbiAgICAgIC8vICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgIC8vICAgICAgICAgICAgIH1cblxuICAgICAgLy8gICAgICAgICAgICAgaWYgKGtleSA9PSAndG9TdHJpbmcnKSB7XG4gICAgICAvLyAgICAgICAgICAgICAgIG9iai50b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAgIC8vICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgUmVwbGFjaW5nICR7cGF0aH10b1N0cmluZyB3aXRoIGRlZmF1bHRgKVxuICAgICAgLy8gICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgLy8gICAgICAgICAgICAgfVxuXG4gICAgICAvLyAgICAgICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vICAgICAgICAgICAgICAgb2JqW2tleV0gPSBgW0Z1bmN0aW9uICR7b2JqW2tleV0ubmFtZX1dYFxuICAgICAgLy8gICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgLy8gICAgICAgICAgICAgfVxuXG4gICAgICAvLyAgICAgICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09ICdvYmplY3QnKSB7XG4gICAgICAvLyAgICAgICAgICAgICAgIG9ialtrZXldID0ga2lsbFRvSlNPTihvYmpba2V5XSwgYCR7cGF0aH0ke2tleX0uYClcbiAgICAgIC8vICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgIC8vICAgICAgICAgICB9XG4gICAgICAvLyAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgLy8gICAgICAgICAgIH1cbiAgICAgIC8vICAgICAgICAgfVxuXG4gICAgICAvLyAgICAgICAgIHJldHVybiBvYmpcbiAgICAgIC8vICAgICAgIH1cblxuICAgICAgLy8gICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgLy8gICAgICAgc2NoZW1hID0ga2lsbFRvSlNPTihzY2hlbWEpXG5cbiAgICAgIC8vICAgICAgIC8vIFN0aWxsIGRvIG5vdCBrbm93IHdoeS9ob3cgdGhleSBhcmUgcHJldmVudGluZyBKU09OaWZ5aW5nIHRoZVxuICAgICAgLy8gICAgICAgLy8gX3R5cGVNYXAga2V5cy4gU28gYWdncmF2dGluZ1xuICAgICAgLy8gICAgICAgZm9yIChsZXQgdHlwZUtleSBvZiBPYmplY3Qua2V5cyhzY2hlbWEuX3R5cGVNYXApKSB7XG4gICAgICAvLyAgICAgICAgIGxldCBvYmplY3QgPSB7fVxuXG4gICAgICAvLyAgICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIC8vICAgICAgICAgZm9yIChsZXQgdmFsS2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYS5fdHlwZU1hcFt0eXBlS2V5XSkpIHtcbiAgICAgIC8vICAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAvLyAgICAgICAgICAgb2JqZWN0W3ZhbEtleV0gPSBzY2hlbWEuX3R5cGVNYXBbdHlwZUtleV1bdmFsS2V5XVxuICAgICAgLy8gICAgICAgICB9XG5cbiAgICAgIC8vICAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgLy8gICAgICAgICBzY2hlbWEuX3R5cGVNYXBbdHlwZUtleV0gPSBvYmplY3RcbiAgICAgIC8vICAgICAgIH1cblxuICAgICAgLy8gICAgICAgbGV0IG91dHB1dCA9IEpTT04uc3RyaW5naWZ5KHNjaGVtYSlcbiAgICAgIC8vICAgICAgIHRoaXMuY2FjaGUuZGVsZXRlKCdhc3QnKVxuICAgICAgLy8gICAgICAgdGhpcy5jYWNoZS5zZXQoJ2FzdE1pZGRsZXdhcmVPdXRwdXQnLCBvdXRwdXQpXG5cbiAgICAgIC8vICAgICAgIHJlc1xuICAgICAgLy8gICAgICAgICAuc3RhdHVzKDIwMClcbiAgICAgIC8vICAgICAgICAgLnNldCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgICAgLy8gICAgICAgICAuc2VuZChvdXRwdXQpXG4gICAgICAvLyAgICAgfSlcbiAgICAgIC8vICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgLy8gICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcblxuICAgICAgLy8gICAgICAgcmVzXG4gICAgICAvLyAgICAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLy8gICAgICAgICAuanNvbihlcnJvcilcbiAgICAgIC8vICAgICB9KVxuICAgICAgLy8gfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHUUxFeHByZXNzTWlkZGxld2FyZTtcbiJdfQ==