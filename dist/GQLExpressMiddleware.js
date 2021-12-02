"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.GQLExpressMiddleware = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
var GQLExpressMiddleware = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(GQLExpressMiddleware, _EventEmitter);

  var _super = _createSuper(GQLExpressMiddleware);

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

    (0, _classCallCheck2["default"])(this, GQLExpressMiddleware);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "cache", new Map());
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


  (0, _createClass2["default"])(GQLExpressMiddleware, [{
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
    key: "rootValue",
    value: function () {
      var _rootValue = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(requestData) {
        var separateByType,
            root,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
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

      function rootValue(_x) {
        return _rootValue.apply(this, arguments);
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
    key: "generateOptions",
    value: function generateOptions() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        graphiql: true
      };
      var patchFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var optsFn = /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, gql) {
          var schema, opts;
          return _regenerator["default"].wrap(function _callee2$(_context2) {
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
          }, _callee2);
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

      var optsFn = /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
          var opts;
          return _regenerator["default"].wrap(function _callee3$(_context3) {
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
          }, _callee3);
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
      return [_bodyParser["default"].json(), _bodyParser["default"].text({
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
      return (0, _expressGraphql["default"])(optsFn);
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
}(_events["default"]);

exports.GQLExpressMiddleware = GQLExpressMiddleware;
var _default = GQLExpressMiddleware;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxFeHByZXNzTWlkZGxld2FyZS5qcyJdLCJuYW1lcyI6WyJHUUxFeHByZXNzTWlkZGxld2FyZSIsImhhbmRsZXJzIiwiTWFwIiwiYXN0IiwiY2FjaGUiLCJjbGVhciIsImNhY2hlZCIsImdldCIsInNjaGVtYSIsIlNjaGVtYVV0aWxzIiwiaW5qZWN0QWxsIiwic2V0IiwiZ2VuZXJhdGVTY2hlbWFTREwiLCJyZXF1ZXN0RGF0YSIsInNlcGFyYXRlQnlUeXBlIiwiY3JlYXRlTWVyZ2VkUm9vdCIsInJvb3QiLCJjdXN0b21NaWRkbGV3YXJlIiwiZ3JhcGhpcWwiLCJvcHRpb25zIiwicGF0Y2hGbiIsIm9wdHNGbiIsInJlcSIsInJlcyIsImdxbCIsInJvb3RWYWx1ZSIsImVycm9yIiwibWVzc2FnZSIsImxvY2F0aW9ucyIsInN0YWNrIiwicGF0aCIsIm9wdHMiLCJmb3JtYXRFcnJvciIsImJpbmQiLCJkZWJ1ZyIsInJlc29sdmVycyIsInR5cGVEZWZzIiwiYXBvbGxvRm4iLCJhcG9sbG9PcHRzIiwiZ2VuZXJhdGVBcG9sbG9PcHRpb25zIiwiYm9keVBhcnNlciIsImpzb24iLCJ0ZXh0IiwidHlwZSIsIm5leHQiLCJpcyIsImJvZHkiLCJxdWVyeSIsImdyYXBocWxIdHRwT3B0aW9ucyIsImdlbmVyYXRlT3B0aW9ucyIsInN0YXR1cyIsInNlbmQiLCJFdmVudEVtaXR0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBVUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ2FBLG9COzs7OztBQVFYO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRSxnQ0FBWUMsUUFB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QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELE9BaEdEO0FBaUdEOzs7RUF6YXVDQyxrQjs7O2VBNGEzQnBELG9CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbi8vIEBtb2R1bGUgR1FMRXhwcmVzc01pZGRsZXdhcmVcblxuaW1wb3J0IHsgU3ludGF4VHJlZSB9IGZyb20gJy4vU3ludGF4VHJlZSdcbmltcG9ydCB7IEdRTEJhc2UgfSBmcm9tICcuL0dRTEJhc2UnXG5pbXBvcnQgeyBHUUxJbnRlcmZhY2UgfSBmcm9tICcuL0dRTEludGVyZmFjZSdcbmltcG9ydCB7IEdRTFNjYWxhciB9IGZyb20gJy4vR1FMU2NhbGFyJ1xuaW1wb3J0IHsgdHlwZU9mIH0gZnJvbSAnbmUtdHlwZXMnXG5pbXBvcnQgeyBTY2hlbWFVdGlscyB9IGZyb20gJy4vU2NoZW1hVXRpbHMnXG5pbXBvcnQgXywgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaCdcbmltcG9ydCB7IG1ha2VFeGVjdXRhYmxlU2NoZW1hIH0gZnJvbSAnZ3JhcGhxbC10b29scydcblxuaW1wb3J0IHtcbiAgcGFyc2UsXG4gIHByaW50LFxuICBidWlsZFNjaGVtYSxcbiAgR3JhcGhRTFNjaGVtYSxcbiAgR3JhcGhRTEludGVyZmFjZVR5cGUsXG4gIEdyYXBoUUxFbnVtVHlwZSxcbiAgR3JhcGhRTFNjYWxhclR5cGVcbn0gZnJvbSAnZ3JhcGhxbCdcblxuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInXG5pbXBvcnQgZ3JhcGhxbEhUVFAgZnJvbSAnZXhwcmVzcy1ncmFwaHFsJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG4vKipcbiAqIEEgaGFuZGxlciB0aGF0IGV4cG9zZXMgYW4gZXhwcmVzcyBtaWRkbGV3YXJlIGZ1bmN0aW9uIHRoYXQgbW91bnRzIGFcbiAqIEdyYXBoUUwgSS9PIGVuZHBvaW50LiBUeXBpY2FsIHVzYWdlIGZvbGxvd3M6XG4gKlxuICogYGBganNcbiAqIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcbiAqIGFwcC51c2UoLy4uLi8sIG5ldyBHUUxFeHByZXNzTWlkZGxld2FyZShbLi4uY2xhc3Nlc10pLm1pZGRsZXdhcmUpO1xuICogYGBgXG4gKlxuICogQGNsYXNzIEdRTEV4cHJlc3NNaWRkbGV3YXJlXG4gKi9cbmV4cG9ydCBjbGFzcyBHUUxFeHByZXNzTWlkZGxld2FyZSBleHRlbmRzIEV2ZW50RW1pdHRlclxue1xuICBoYW5kbGVyczogQXJyYXk8R1FMQmFzZT47XG5cbiAgc2NoZW1hOiBzdHJpbmc7XG5cbiAgY2FjaGU6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKClcblxuICAvKipcbiAgICogRm9yIG5vdywgdGFrZXMgYW4gQXJyYXkgb2YgY2xhc3NlcyBleHRlbmRpbmcgZnJvbSBHUUxCYXNlLiBUaGVzZSBhcmVcbiAgICogcGFyc2VkIGFuZCBhIGNvbWJpbmVkIHNjaGVtYSBvZiBhbGwgdGhlaXIgaW5kaXZpZHVhbCBzY2hlbWFzIGlzIGdlbmVyYXRlZFxuICAgKiB2aWEgdGhlIHVzZSBvZiBBU1RzLiBUaGlzIGlzIHBhc3NlZCBvZmYgdG8gZXhwcmVzcy1ncmFwaHFsLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMRXhwcmVzc01pZGRsZXdhcmVcbiAgICogQG1ldGhvZCDijobioIBjb25zdHJ1Y3RvclxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxHUUxCYXNlPn0gaGFuZGxlcnMgYW4gYXJyYXkgb2YgR1FMQmFzZSBleHRlbmRlZCBjbGFzc2VzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihoYW5kbGVyczogQXJyYXk8R1FMQmFzZT4pIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLmhhbmRsZXJzID0gaGFuZGxlcnNcblxuICAgIC8vIEdlbmVyYXRlIGFuZCBjYWNoZSB0aGUgc2NoZW1hIFNETC9JREwgc3RyaW5nIGFuZCBhc3Qgb2JqIChHcmFwaFFMU2NoZW1hKVxuICAgIHRoaXMuYXN0XG4gIH1cblxuICAvKipcbiAgICogVGhlIFNjaGVtYSBTdHJpbmcgYW5kIFNjaGVtYSBBU1QvR3JhcGhRTFNjaGVtYSBKYXZhU2NyaXB0IG9iamVjdHMgYXJlXG4gICAqIGNhY2hlZCBhZnRlciBiZWluZyBwcm9jZXNzZWQgb25jZS4gSWYgdGhlcmUgaXMgYSBydW50aW1lIG5lZWQgdG8gcmVidWlsZFxuICAgKiB0aGVzZSBvYmplY3RzLCBjYWxsaW5nIGBjbGVhckNhY2hlKClgIHdpbGwgYWxsb3cgdGhlaXIgbmV4dCB1c2FnZSB0b1xuICAgKiByZWJ1aWxkIHRoZW0gZHluYW1pY2FsbHkuXG4gICAqXG4gICAqIEBtZXRob2QgY2xlYXJDYWNoZVxuICAgKiBAbWVtYmVyb2YgR1FMRXhwcmVzc01pZGRsZXdhcmVcbiAgICpcbiAgICogQHJldHVybiB7R1FMRXhwcmVzc01pZGRsZXdhcmV9IHJldHVybnMgdGhpcyBzbyB0aGF0IGl0IGNhbiBiZSBpbmxpbmVkOyBhbGFcbiAgICogYGdxbEV4cHJlc3NNaWRkbGV3YXJlLmNsZWFyQ2FjaGUoKS5hc3RgLCBmb3IgZXhhbXBsZVxuICAgKi9cbiAgY2xlYXJDYWNoZSgpOiBHUUxFeHByZXNzTWlkZGxld2FyZSB7XG4gICAgdGhpcy5jYWNoZS5jbGVhcigpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2NoZW1hIHByb3BlcnR5IHJldHVybnMgdGhlIHRleHR1YWwgU2NoZW1hIGFzIGl0IGlzIGdlbmVyYXRlZCBiYXNlZFxuICAgKiBvbiB0aGUgdmFyaW91cyBMYXR0aWNlIHR5cGVzLCBpbnRlcmZhY2VzIGFuZCBlbnVtcyBkZWZpbmVkIGluIHlvdXJcbiAgICogcHJvamVjdC4gVGhlIGFzdCBwcm9wZXJ0eSByZXR1cm5zIHRoZSBKYXZhU2NyaXB0IEFTVCByZXByZXNlbmF0YXRpb24gb2ZcbiAgICogdGhhdCBzY2hlbWEgd2l0aCBhbGwgaW5qZWN0ZWQgbW9kaWZpY2lhdGlvbnMgZGV0YWlsZWQgaW4geW91ciBjbGFzc2VzLlxuICAgKi9cbiAgZ2V0IGFzdCgpOiBHcmFwaFFMU2NoZW1hIHtcbiAgICBsZXQgY2FjaGVkOiA/R3JhcGhRTFNjaGVtYSA9IHRoaXMuY2FjaGUuZ2V0KCdhc3QnKVxuXG4gICAgaWYgKGNhY2hlZCkge1xuICAgICAgcmV0dXJuIGNhY2hlZFxuICAgIH1cblxuICAgIGxldCBhc3Q6IEdyYXBoUUxTY2hlbWEgPSBidWlsZFNjaGVtYSh0aGlzLnNjaGVtYSlcblxuICAgIFNjaGVtYVV0aWxzLmluamVjdEFsbChhc3QsIHRoaXMuaGFuZGxlcnMpO1xuXG4gICAgdGhpcy5jYWNoZS5zZXQoJ2FzdCcsIGFzdClcblxuICAgIHJldHVybiBhc3Q7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIHRoZSB0ZXh0dWFsIHNjaGVtYSBiYXNlZCBvbiB0aGUgcmVnaXN0ZXJlZCBgR1FMQmFzZWAgaGFuZGxlcnNcbiAgICogdGhpcyBpbnN0YW5jZSByZXByZXNlbnRzLlxuICAgKlxuICAgKiBAbWV0aG9kIEdRTEV4cHJlc3NNaWRkbGV3YXJlI+Ksh++4juKggHNjaGVtYVxuICAgKiBAc2luY2UgMi43LjBcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBhIGdlbmVyYXRlZCBzY2hlbWEgc3RyaW5nIGJhc2VkIG9uIHRoZSBoYW5kbGVycyB0aGF0XG4gICAqIGFyZSByZWdpc3RlcmVkIHdpdGggdGhpcyBgR1FMRXhwcmVzc01pZGRsZXdhcmVgIGluc3RhbmNlLlxuICAgKi9cbiAgZ2V0IHNjaGVtYSgpOiBzdHJpbmcge1xuICAgIGxldCBjYWNoZWQgPSB0aGlzLmNhY2hlLmdldCgnc2NoZW1hJylcbiAgICBsZXQgc2NoZW1hXG5cbiAgICBpZiAoY2FjaGVkKSByZXR1cm4gY2FjaGVkXG5cbiAgICBzY2hlbWEgPSBTY2hlbWFVdGlscy5nZW5lcmF0ZVNjaGVtYVNETCh0aGlzLmhhbmRsZXJzKTtcbiAgICB0aGlzLmNhY2hlLnNldCgnc2NoZW1hJywgc2NoZW1hKVxuXG4gICAgcmV0dXJuIHNjaGVtYVxuICB9XG5cbiAgYXN5bmMgcm9vdFZhbHVlKFxuICAgIHJlcXVlc3REYXRhOiBPYmplY3QsXG4gICAgc2VwYXJhdGVCeVR5cGU6IGJvb2xlYW4gPSBmYWxzZVxuICApOiBPYmplY3Qge1xuICAgIGxldCByb290ID0gYXdhaXQgU2NoZW1hVXRpbHMuY3JlYXRlTWVyZ2VkUm9vdChcbiAgICAgIHRoaXMuaGFuZGxlcnMsIHJlcXVlc3REYXRhLCBzZXBhcmF0ZUJ5VHlwZVxuICAgIClcblxuICAgIHJldHVybiByb290O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzaW5nIHRoZSBleHByZXNzLWdyYXBocWwgbW9kdWxlLCBpdCByZXR1cm5zIGFuIEV4cHJlc3MgNC54IG1pZGRsZXdhcmVcbiAgICogZnVuY3Rpb24uXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgR1FMRXhwcmVzc01pZGRsZXdhcmVcbiAgICogQG1ldGhvZCDirIfvuI7ioIBtaWRkbGV3YXJlXG4gICAqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGZ1bmN0aW9uIHRoYXQgZXhwZWN0cyByZXF1ZXN0LCByZXNwb25zZSBhbmQgbmV4dFxuICAgKiBwYXJhbWV0ZXJzIGFzIGFsbCBFeHByZXNzIG1pZGRsZXdhcmUgZnVuY3Rpb25zLlxuICAgKi9cbiAgZ2V0IG1pZGRsZXdhcmUoKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbU1pZGRsZXdhcmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2luZyB0aGUgZXhwcmVzcy1ncmFwaHFsIG1vZHVsZSwgaXQgcmV0dXJucyBhbiBFeHByZXNzIDQueCBtaWRkbGV3YXJlXG4gICAqIGZ1bmN0aW9uLiBUaGlzIHZlcnNpb24gaG93ZXZlciwgaGFzIGdyYXBoaXFsIGRpc2FibGVkLiBPdGhlcndpc2UgaXQgaXNcbiAgICogaWRlbnRpY2FsIHRvIHRoZSBgbWlkZGxld2FyZWAgcHJvcGVydHlcbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxFeHByZXNzTWlkZGxld2FyZVxuICAgKiBAbWV0aG9kIOKsh++4juKggG1pZGRsZXdhcmVXaXRob3V0R3JhcGhpUUxcbiAgICpcbiAgICogQHJldHVybiB7RnVuY3Rpb259IGEgZnVuY3Rpb24gdGhhdCBleHBlY3RzIHJlcXVlc3QsIHJlc3BvbnNlIGFuZCBuZXh0XG4gICAqIHBhcmFtZXRlcnMgYXMgYWxsIEV4cHJlc3MgbWlkZGxld2FyZSBmdW5jdGlvbnMuXG4gICAqL1xuICBnZXQgbWlkZGxld2FyZVdpdGhvdXRHcmFwaGlRTCgpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VzdG9tTWlkZGxld2FyZSh7Z3JhcGhpcWw6IGZhbHNlfSk7XG4gIH1cblxuICAvKipcbiAgICogSW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgTGF0dGljZSBmdW5jdGlvbnMgcmVjZWl2ZSB0aGUgcmVxdWVzdCBkYXRhLFxuICAgKiBpdCBpcyBpbXBvcnRhbnQgdG8gdXNlIHRoZSBvcHRpb25zIGZ1bmN0aW9uIGZlYXR1cmUgb2YgYm90aFxuICAgKiBgZXhwcmVzcy1ncmFwaHFsYCBhbmQgYGFwb2xsby1zZXJ2ZXItZXhwcmVzc2AuIFRoaXMgZnVuY3Rpb24gd2lsbCBjcmVhdGVcbiAgICogYW4gb3B0aW9ucyBmdW5jdGlvbiB0aGF0IHJlZmxlY3RzIHRoYXQgc2NoZW1hIGFuZCBMYXR0aWNlIHR5cGVzIGRlZmluZWRcbiAgICogaW4geW91ciBwcm9qZWN0LlxuICAgKlxuICAgKiBTaG91bGQgeW91IG5lZWQgdG8gdGFpbG9yIHRoZSByZXNwb25zZSBiZWZvcmUgaXQgaXMgc2VudCBvdXQsIHlvdSBtYXlcbiAgICogc3VwcGx5IGEgZnVuY3Rpb24gYXMgYSBzZWNvbmQgcGFyYW1ldGVyIHRoYXQgdGFrZXMgdHdvIHBhcmFtZXRlcnMgYW5kXG4gICAqIHJldHVybnMgYW4gb3B0aW9ucyBvYmplY3QuIFRoZSBwYXRjaEZuIGNhbGxiYWNrIHNpZ25hdHVyZSBsb29rcyBsaWtlIHRoaXNcbiAgICpcbiAgICogYGBgcGF0Y2hGbihvcHRpb25zLCB7cmVxLCByZXMsIG5leHR8Z3FsfSlgYGBcbiAgICpcbiAgICogV2hlbiB1c2luZyB0aGUgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLCBhZGRpdGlvbmFsIGdyYXBocWwgcmVxdWVzdCBpbmZvXG4gICAqIGNhbiBiZSBvYnRhaW5lZCBpbiBsaWV1IG9mIHRoZSBgbmV4dCgpYCBmdW5jdGlvbiBzbyB0eXBpY2FsbHkgZm91bmQgaW5cbiAgICogRXhwcmVzcyBtaWRkbGV3YXJlLiBBcG9sbG8gU2VydmVyIHNpbXBseSBwcm92aWRlcyB0aGUgbmV4dCBmdW5jdGlvbiBpblxuICAgKiB0aGlzIGxvY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBhbnkgb3B0aW9ucywgdG8gZWl0aGVyIGVuZ2luZSwgdGhhdCBtYWtlIHRoZSBtb3N0XG4gICAqIHNlbnNlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHBhdGNoRm4gc2VlIGFib3ZlXG4gICAqL1xuICBnZW5lcmF0ZU9wdGlvbnMoXG4gICAgb3B0aW9uczogT2JqZWN0ID0geyBncmFwaGlxbDogdHJ1ZSB9LFxuICAgIHBhdGNoRm46ID9GdW5jdGlvbiA9IG51bGxcbiAgKTogRnVuY3Rpb24ge1xuICAgIGNvbnN0IG9wdHNGbiA9IGFzeW5jIChyZXE6IG1peGVkLCByZXM6IG1peGVkLCBncWw6IG1peGVkKSA9PiB7XG4gICAgICBsZXQgc2NoZW1hID0gdGhpcy5hc3Q7XG4gICAgICBsZXQgb3B0cyA9IHtcbiAgICAgICAgc2NoZW1hLFxuICAgICAgICByb290VmFsdWU6IGF3YWl0IHRoaXMucm9vdFZhbHVlKHtyZXEsIHJlcywgZ3FsfSksXG4gICAgICAgIGZvcm1hdEVycm9yOiBlcnJvciA9PiAoe1xuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgbG9jYXRpb25zOiBlcnJvci5sb2NhdGlvbnMsXG4gICAgICAgICAgc3RhY2s6IGVycm9yLnN0YWNrLFxuICAgICAgICAgIHBhdGg6IGVycm9yLnBhdGhcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgbWVyZ2Uob3B0cywgb3B0aW9ucyk7XG4gICAgICBpZiAocGF0Y2hGbiAmJiB0eXBlb2YgcGF0Y2hGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBtZXJnZShcbiAgICAgICAgICBvcHRzLFxuICAgICAgICAgIChwYXRjaEZuLmJpbmQodGhpcykob3B0cywge3JlcSwgcmVzLCBncWx9KSkgfHwgb3B0c1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3B0cztcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0c0ZuXG4gIH1cblxuICAgIC8qKlxuICAgKiBJbiBvcmRlciB0byBlbnN1cmUgdGhhdCBMYXR0aWNlIGZ1bmN0aW9ucyByZWNlaXZlIHRoZSByZXF1ZXN0IGRhdGEsXG4gICAqIGl0IGlzIGltcG9ydGFudCB0byB1c2UgdGhlIG9wdGlvbnMgZnVuY3Rpb24gZmVhdHVyZSBvZiBib3RoXG4gICAqIGBleHByZXNzLWdyYXBocWxgIGFuZCBgYXBvbGxvLXNlcnZlci1leHByZXNzYC4gVGhpcyBmdW5jdGlvbiB3aWxsIGNyZWF0ZVxuICAgKiBhbiBvcHRpb25zIGZ1bmN0aW9uIHRoYXQgcmVmbGVjdHMgdGhhdCBzY2hlbWEgYW5kIExhdHRpY2UgdHlwZXMgZGVmaW5lZFxuICAgKiBpbiB5b3VyIHByb2plY3QuXG4gICAqXG4gICAqIFNob3VsZCB5b3UgbmVlZCB0byB0YWlsb3IgdGhlIHJlc3BvbnNlIGJlZm9yZSBpdCBpcyBzZW50IG91dCwgeW91IG1heVxuICAgKiBzdXBwbHkgYSBmdW5jdGlvbiBhcyBhIHNlY29uZCBwYXJhbWV0ZXIgdGhhdCB0YWtlcyB0d28gcGFyYW1ldGVycyBhbmRcbiAgICogcmV0dXJucyBhbiBvcHRpb25zIG9iamVjdC4gVGhlIHBhdGNoRm4gY2FsbGJhY2sgc2lnbmF0dXJlIGxvb2tzIGxpa2UgdGhpc1xuICAgKlxuICAgKiBgYGBwYXRjaEZuKG9wdGlvbnMsIHtyZXEsIHJlcywgbmV4dHxncWx9KWBgYFxuICAgKlxuICAgKiBXaGVuIHVzaW5nIHRoZSByZWZlcmVuY2UgaW1wbGVtZW50YXRpb24sIGFkZGl0aW9uYWwgZ3JhcGhxbCByZXF1ZXN0IGluZm9cbiAgICogY2FuIGJlIG9idGFpbmVkIGluIGxpZXUgb2YgdGhlIGBuZXh0KClgIGZ1bmN0aW9uIHNvIHR5cGljYWxseSBmb3VuZCBpblxuICAgKiBFeHByZXNzIG1pZGRsZXdhcmUuIEFwb2xsbyBTZXJ2ZXIgc2ltcGx5IHByb3ZpZGVzIHRoZSBuZXh0IGZ1bmN0aW9uIGluXG4gICAqIHRoaXMgbG9jYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIGFueSBvcHRpb25zLCB0byBlaXRoZXIgZW5naW5lLCB0aGF0IG1ha2UgdGhlIG1vc3RcbiAgICogc2Vuc2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcGF0Y2hGbiBzZWUgYWJvdmVcbiAgICovXG4gIGdlbmVyYXRlQXBvbGxvT3B0aW9ucyhcbiAgICBvcHRpb25zOiBPYmplY3QgPSB7XG4gICAgICBmb3JtYXRFcnJvcjogZXJyb3IgPT4gKHtcbiAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgbG9jYXRpb25zOiBlcnJvci5sb2NhdGlvbnMsXG4gICAgICAgIHN0YWNrOiBlcnJvci5zdGFjayxcbiAgICAgICAgcGF0aDogZXJyb3IucGF0aFxuICAgICAgfSksXG4gICAgICBkZWJ1ZzogdHJ1ZVxuICAgIH0sXG4gICAgcGF0Y2hGbjogP0Z1bmN0aW9uID0gbnVsbFxuICApOiBGdW5jdGlvbiB7XG4gICAgY29uc3Qgb3B0c0ZuID0gYXN5bmMgKHJlcTogbWl4ZWQsIHJlczogbWl4ZWQpID0+IHtcbiAgICAgIGxldCBvcHRzID0ge1xuICAgICAgICBzY2hlbWE6IHRoaXMuYXN0LFxuICAgICAgICByZXNvbHZlcnM6IGF3YWl0IHRoaXMucm9vdFZhbHVlKHtyZXEsIHJlc30sIHRydWUpXG4gICAgICB9XG5cbiAgICAgIG9wdHMuc2NoZW1hID0gbWFrZUV4ZWN1dGFibGVTY2hlbWEoe1xuICAgICAgICB0eXBlRGVmczogW3RoaXMuc2NoZW1hXSxcbiAgICAgICAgcmVzb2x2ZXJzOiBvcHRzLnJlc29sdmVyc1xuICAgICAgfSlcblxuICAgICAgU2NoZW1hVXRpbHMuaW5qZWN0QWxsKG9wdHMuc2NoZW1hLCB0aGlzLmhhbmRsZXJzKTtcblxuICAgICAgbWVyZ2Uob3B0cywgb3B0aW9ucyk7XG4gICAgICBpZiAocGF0Y2hGbiAmJiB0eXBlb2YgcGF0Y2hGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBtZXJnZShcbiAgICAgICAgICBvcHRzLFxuICAgICAgICAgIChwYXRjaEZuLmJpbmQodGhpcykob3B0cywge3JlcSwgcmVzfSkpIHx8IG9wdHNcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9wdHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdHNGblxuICB9XG5cbiAgYXBvbGxvTWlkZGxld2FyZShcbiAgICBhcG9sbG9GbjogRnVuY3Rpb24sXG4gICAgYXBvbGxvT3B0czogT2JqZWN0ID0ge30sXG4gICAgcGF0Y2hGbjogP0Z1bmN0aW9uID0gbnVsbFxuICApOiBBcnJheTxGdW5jdGlvbj4ge1xuICAgIGxldCBvcHRzID0gdGhpcy5nZW5lcmF0ZUFwb2xsb09wdGlvbnMoYXBvbGxvT3B0cywgcGF0Y2hGbilcblxuICAgIHJldHVybiBbXG4gICAgICBib2R5UGFyc2VyLmpzb24oKSxcbiAgICAgIGJvZHlQYXJzZXIudGV4dCh7IHR5cGU6ICdhcHBsaWNhdGlvbi9ncmFwaHFsJyB9KSxcbiAgICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgIGlmIChyZXEuaXMoJ2FwcGxpY2F0aW9uL2dyYXBocWwnKSkge1xuICAgICAgICAgICAgICByZXEuYm9keSA9IHsgcXVlcnk6IHJlcS5ib2R5IH07XG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHQoKTtcbiAgICAgIH0sXG4gICAgICBhcG9sbG9GbihvcHRzKVxuICAgIF1cbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB5b3VyIG5lZWRzIHJlcXVpcmUgeW91IHRvIHNwZWNpZnkgZGlmZmVyZW50IHZhbHVlcyB0byBgZ3JhcGhxbEhUVFBgLFxuICAgKiBwYXJ0IG9mIHRoZSBgZXhwcmVzcy1ncmFwaHFsYCBwYWNrYWdlLCB5b3UgY2FuIHVzZSB0aGUgYGN1c3RvbU1pZGRsZXdhcmVgXG4gICAqIGZ1bmN0aW9uIHRvIGRvIHNvLlxuICAgKlxuICAgKiBUaGUgZmlyc3QgcGFyYW1ldGVyIGlzIGFuIG9iamVjdCB0aGF0IHNob3VsZCBjb250YWluIHZhbGlkIGBncmFwaHFsSFRUUGBcbiAgICogb3B0aW9ucy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ncmFwaHFsL2V4cHJlc3MtZ3JhcGhxbCNvcHRpb25zIGZvciBtb3JlXG4gICAqIGRldGFpbHMuIFZhbGlkYXRpb24gaXMgTk9UIHBlcmZvcm1lZC5cbiAgICpcbiAgICogVGhlIHNlY29uZCBwYXJhbWV0ZXIgaXMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIGFmdGVyIGFueSBvcHRpb25zXG4gICAqIGhhdmUgYmVlbiBhcHBsaWVkIGZyb20gdGhlIGZpcnN0IHBhcmFtZXRlciBhbmQgdGhlIHJlc3Qgb2YgdGhlIG1pZGRsZXdhcmVcbiAgICogaGFzIGJlZW4gcGVyZm9ybWVkLiBUaGlzLCBpZiBub3QgbW9kaWZpZWQsIHdpbGwgYmUgdGhlIGZpbmFsIG9wdGlvbnNcbiAgICogcGFzc2VkIGludG8gYGdyYXBocWxIVFRQYC4gSW4geW91ciBjYWxsYmFjaywgaXQgaXMgZXhwZWN0ZWQgdGhhdCB0aGVcbiAgICogc3VwcGxpZWQgb2JqZWN0IGlzIHRvIGJlIG1vZGlmaWVkIGFuZCBUSEVOIFJFVFVSTkVELiBXaGF0ZXZlciBpcyByZXR1cm5lZFxuICAgKiB3aWxsIGJlIHVzZWQgb3IgcGFzc2VkIG9uLiBJZiBub3RoaW5nIGlzIHJldHVybmVkLCB0aGUgb3B0aW9ucyBzdXBwbGllZFxuICAgKiB0byB0aGUgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIGluc3RlYWQuXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAY3VzdG9tTWlkZGxld2FyZVxuICAgKiBAbWVtYmVyb2YgR1FMRXhwcmVzc01pZGRsZXdhcmVcbiAgICogQGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZ3JhcGhxbEh0dHBPcHRpb25zPXtncmFwaGlxbDogdHJ1ZX1dIHN0YW5kYXJkIHNldCBvZlxuICAgKiBgZXhwcmVzcy1ncmFwaHFsYCBvcHRpb25zLiBTZWUgYWJvdmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHBhdGNoRm4gc2VlIGFib3ZlXG5cbiAgICogQHJldHVybiB7RnVuY3Rpb259IGEgbWlkZGxld2FyZSBmdW5jdGlvbiBjb21wYXRpYmxlIHdpdGggRXhwcmVzc1xuICAgKi9cbiAgY3VzdG9tTWlkZGxld2FyZShcbiAgICBncmFwaHFsSHR0cE9wdGlvbnM6IE9iamVjdCA9IHtncmFwaGlxbDogdHJ1ZX0sXG4gICAgcGF0Y2hGbj86IEZ1bmN0aW9uXG4gICk6IEZ1bmN0aW9uIHtcbiAgICBjb25zdCBvcHRzRm4gPSB0aGlzLmdlbmVyYXRlT3B0aW9ucyhncmFwaHFsSHR0cE9wdGlvbnMsIHBhdGNoRm4pXG4gICAgcmV0dXJuIGdyYXBocWxIVFRQKG9wdHNGbilcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBleHByZXNzIG1pZGRsZXdhcmUgZnVuY3Rpb24gdGhhdCBjYW4gYmUgbW91bnRlZCB0byByZXR1cm5cbiAgICogYSBjb3B5IG9mIHRoZSBnZW5lcmF0ZWQgc2NoZW1hIHN0cmluZyBiZWluZyB1c2VkIGJ5IEdRTEV4cHJlc3NNaWRkbGV3YXJlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMRXhwcmVzc01pZGRsZXdhcmVcbiAgICogQG1ldGhvZCBzY2hlbWFNaWRkbGV3YXJlXG4gICAqIEBpbnN0YW5jZVxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgc2NoZW1hTWlkZGxld2FyZSgpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIChyZXE6IE9iamVjdCwgcmVzOiBPYmplY3QsIG5leHQ6ID9GdW5jdGlvbikgPT4ge1xuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQodGhpcy5zY2hlbWEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBleHByZXNzIG1pZGRsZXdhcmUgZnVuY3Rpb24gdGhhdCBjYW4gYmUgbW91bnRlZCB0byByZXR1cm5cbiAgICogdGhlIEpTT04gQVNUIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzY2hlbWEgc3RyaW5nIGJlaW5nIHVzZWQgYnlcbiAgICogR1FMRXhwcmVzc01pZGRsZXdhcmUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxFeHByZXNzTWlkZGxld2FyZVxuICAgKiBAbWV0aG9kIGFzdE1pZGRsZXdhcmVcbiAgICogQGluc3RhbmNlXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIGdldCBhc3RNaWRkbGV3YXJlKCk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gKHJlcTogT2JqZWN0LCByZXM6IE9iamVjdCwgbmV4dDogP0Z1bmN0aW9uKSA9PiB7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCgnVGVtcG9yYXJpbHkgZGlzYWJsZWQgaW4gdGhpcyB2ZXJzaW9uJylcblxuICAgICAgLy8gbGV0IGNhY2hlZE91dHB1dCA9IHRoaXMuY2FjaGUuZ2V0KCdhc3RNaWRkbGV3YXJlT3V0cHV0JylcbiAgICAgIC8vIGlmIChjYWNoZWRPdXRwdXQpIHtcbiAgICAgIC8vICAgcmVzXG4gICAgICAvLyAgICAgLnN0YXR1cygzMDIpXG4gICAgICAvLyAgICAgLnNldCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgICAgLy8gICAgIC5zZW5kKGNhY2hlZE91dHB1dClcbiAgICAgIC8vIH1cbiAgICAgIC8vIGVsc2Uge1xuICAgICAgLy8gICB0aGlzLnJvb3RWYWx1ZSh7cmVxLCByZXMsIG5leHR9LCB0cnVlKVxuICAgICAgLy8gICAgIC50aGVuKHJlc29sdmVycyA9PiB7XG4gICAgICAvLyAgICAgICBsZXQgc2NoZW1hOiBHcmFwaFFMU2NoZW1hID0gYnVpbGRTY2hlbWEodGhpcy5zY2hlbWEpXG5cbiAgICAgIC8vICAgICAgIFNjaGVtYVV0aWxzLmluamVjdEludGVyZmFjZVJlc29sdmVycyhzY2hlbWEsIHRoaXMuaGFuZGxlcnMpO1xuICAgICAgLy8gICAgICAgU2NoZW1hVXRpbHMuaW5qZWN0RW51bXMoc2NoZW1hLCB0aGlzLmhhbmRsZXJzKTtcbiAgICAgIC8vICAgICAgIFNjaGVtYVV0aWxzLmluamVjdFNjYWxhcnMoc2NoZW1hLCB0aGlzLmhhbmRsZXJzKTtcbiAgICAgIC8vICAgICAgIFNjaGVtYVV0aWxzLmluamVjdENvbW1lbnRzKHNjaGVtYSwgdGhpcy5oYW5kbGVycyk7XG5cbiAgICAgIC8vICAgICAgIGZ1bmN0aW9uIGtpbGxUb0pTT04ob2JqOiBhbnksIHBhdGggPSAnb2JqLicpIHtcbiAgICAgIC8vICAgICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgLy8gICAgICAgICAgIHRyeSB7XG4gICAgICAvLyAgICAgICAgICAgICBpZiAoa2V5ID09ICdwcmV2JyB8fCBrZXkgPT0gJ25leHQnIHx8IGtleSA9PSAnb2ZUeXBlJykgY29udGludWU7XG5cbiAgICAgIC8vICAgICAgICAgICAgIGlmIChrZXkgPT0gJ3RvSlNPTicpIHtcbiAgICAgIC8vICAgICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBkZWxldGUgb2JqLnRvSlNPTlxuICAgICAgLy8gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBLaWxsaW5nICR7cGF0aH10b0pTT04uLi4ke3N1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbHVyZSd9YClcbiAgICAgIC8vICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgIC8vICAgICAgICAgICAgIH1cblxuICAgICAgLy8gICAgICAgICAgICAgaWYgKGtleSA9PSAnaW5zcGVjdCcpIHtcbiAgICAgIC8vICAgICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBkZWxldGUgb2JqLmluc3BlY3RcbiAgICAgIC8vICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgS2lsbGluZyAke3BhdGh9aW5zcGVjdC4uLiR7c3VjY2VzcyA/ICdzdWNjZXNzJyA6ICdmYWlsdXJlJ31gKVxuICAgICAgLy8gICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgLy8gICAgICAgICAgICAgfVxuXG4gICAgICAvLyAgICAgICAgICAgICBpZiAoa2V5ID09ICd0b1N0cmluZycpIHtcbiAgICAgIC8vICAgICAgICAgICAgICAgb2JqLnRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuICAgICAgLy8gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBSZXBsYWNpbmcgJHtwYXRofXRvU3RyaW5nIHdpdGggZGVmYXVsdGApXG4gICAgICAvLyAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAvLyAgICAgICAgICAgICB9XG5cbiAgICAgIC8vICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gICAgICAgICAgICAgICBvYmpba2V5XSA9IGBbRnVuY3Rpb24gJHtvYmpba2V5XS5uYW1lfV1gXG4gICAgICAvLyAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAvLyAgICAgICAgICAgICB9XG5cbiAgICAgIC8vICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgIC8vICAgICAgICAgICAgICAgb2JqW2tleV0gPSBraWxsVG9KU09OKG9ialtrZXldLCBgJHtwYXRofSR7a2V5fS5gKVxuICAgICAgLy8gICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgLy8gICAgICAgICAgIH1cbiAgICAgIC8vICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAvLyAgICAgICAgICAgfVxuICAgICAgLy8gICAgICAgICB9XG5cbiAgICAgIC8vICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgLy8gICAgICAgfVxuXG4gICAgICAvLyAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAvLyAgICAgICBzY2hlbWEgPSBraWxsVG9KU09OKHNjaGVtYSlcblxuICAgICAgLy8gICAgICAgLy8gU3RpbGwgZG8gbm90IGtub3cgd2h5L2hvdyB0aGV5IGFyZSBwcmV2ZW50aW5nIEpTT05pZnlpbmcgdGhlXG4gICAgICAvLyAgICAgICAvLyBfdHlwZU1hcCBrZXlzLiBTbyBhZ2dyYXZ0aW5nXG4gICAgICAvLyAgICAgICBmb3IgKGxldCB0eXBlS2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYS5fdHlwZU1hcCkpIHtcbiAgICAgIC8vICAgICAgICAgbGV0IG9iamVjdCA9IHt9XG5cbiAgICAgIC8vICAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgLy8gICAgICAgICBmb3IgKGxldCB2YWxLZXkgb2YgT2JqZWN0LmtleXMoc2NoZW1hLl90eXBlTWFwW3R5cGVLZXldKSkge1xuICAgICAgLy8gICAgICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIC8vICAgICAgICAgICBvYmplY3RbdmFsS2V5XSA9IHNjaGVtYS5fdHlwZU1hcFt0eXBlS2V5XVt2YWxLZXldXG4gICAgICAvLyAgICAgICAgIH1cblxuICAgICAgLy8gICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAvLyAgICAgICAgIHNjaGVtYS5fdHlwZU1hcFt0eXBlS2V5XSA9IG9iamVjdFxuICAgICAgLy8gICAgICAgfVxuXG4gICAgICAvLyAgICAgICBsZXQgb3V0cHV0ID0gSlNPTi5zdHJpbmdpZnkoc2NoZW1hKVxuICAgICAgLy8gICAgICAgdGhpcy5jYWNoZS5kZWxldGUoJ2FzdCcpXG4gICAgICAvLyAgICAgICB0aGlzLmNhY2hlLnNldCgnYXN0TWlkZGxld2FyZU91dHB1dCcsIG91dHB1dClcblxuICAgICAgLy8gICAgICAgcmVzXG4gICAgICAvLyAgICAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgLy8gICAgICAgICAuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpXG4gICAgICAvLyAgICAgICAgIC5zZW5kKG91dHB1dClcbiAgICAgIC8vICAgICB9KVxuICAgICAgLy8gICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAvLyAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuXG4gICAgICAvLyAgICAgICByZXNcbiAgICAgIC8vICAgICAgICAgLnN0YXR1cyg1MDApXG4gICAgICAvLyAgICAgICAgIC5qc29uKGVycm9yKVxuICAgICAgLy8gICAgIH0pXG4gICAgICAvLyB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdRTEV4cHJlc3NNaWRkbGV3YXJlO1xuIl19