'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLExpressMiddleware = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _SyntaxTree = require('./SyntaxTree');

var _GQLBase = require('./GQLBase');

var _GQLInterface = require('./GQLInterface');

var _GQLScalar = require('./GQLScalar');

var _neTypes = require('ne-types');

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
let GQLExpressMiddleware = exports.GQLExpressMiddleware = class GQLExpressMiddleware extends _events2.default {

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
  constructor(handlers) {
    super();

    Object.defineProperty(this, 'cache', {
      enumerable: true,
      writable: true,
      value: new _map2.default()
    });
    this.handlers = handlers;

    // Generate and cache the schema SDL/IDL string and ast obj (GraphQLSchema)
    this.ast;
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
  clearCache() {
    this.cache.clear();
    return this;
  }

  /**
   * The schema property returns the textual Schema as it is generated based
   * on the various Lattice types, interfaces and enums defined in your
   * project. The ast property returns the JavaScript AST represenatation of
   * that schema with all injected modificiations detailed in your classes.
   */
  get ast() {
    let cached = this.cache.get('ast');

    if (cached) {
      return cached;
    }

    let ast = (0, _graphql.buildSchema)(this.schema);

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
  get schema() {
    let cached = this.cache.get('schema');
    let schema;

    if (cached) return cached;

    schema = _SchemaUtils.SchemaUtils.generateSchemaSDL(this.handlers);
    this.cache.set('schema', schema);

    return schema;
  }

  rootValue(requestData, separateByType = false) {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let root = yield _SchemaUtils.SchemaUtils.createMergedRoot(_this.handlers, requestData, separateByType);

      return root;
    })();
  }

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
  get middleware() {
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
  get middlewareWithoutGraphiQL() {
    return this.customMiddleware({ graphiql: false });
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
  generateOptions(options = { graphiql: true }, patchFn = null) {
    var _this2 = this;

    const optsFn = (() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (req, res, gql) {
        let schema = _this2.ast;
        let opts = {
          schema,
          rootValue: yield _this2.rootValue({ req, res, gql }),
          formatError: function (error) {
            return {
              message: error.message,
              locations: error.locations,
              stack: error.stack,
              path: error.path
            };
          }
        };

        (0, _lodash.merge)(opts, options);
        if (patchFn && typeof patchFn === 'function') {
          (0, _lodash.merge)(opts, patchFn.bind(_this2)(opts, { req, res, gql }) || opts);
        }

        return opts;
      });

      return function optsFn(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    })();

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
  generateApolloOptions(options = {
    formatError: error => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack,
      path: error.path
    }),
    debug: true
  }, patchFn = null) {
    var _this3 = this;

    const optsFn = (() => {
      var _ref2 = (0, _asyncToGenerator3.default)(function* (req, res) {
        let opts = {
          schema: _this3.ast,
          resolvers: yield _this3.rootValue({ req, res }, true)
        };

        opts.schema = (0, _graphqlTools.makeExecutableSchema)({
          typeDefs: [_this3.schema],
          resolvers: opts.resolvers
        });

        _SchemaUtils.SchemaUtils.injectAll(opts.schema, _this3.handlers);

        (0, _lodash.merge)(opts, options);
        if (patchFn && typeof patchFn === 'function') {
          (0, _lodash.merge)(opts, patchFn.bind(_this3)(opts, { req, res }) || opts);
        }

        return opts;
      });

      return function optsFn(_x4, _x5) {
        return _ref2.apply(this, arguments);
      };
    })();

    return optsFn;
  }

  apolloMiddleware(apolloFn, apolloOpts = {}, patchFn = null) {
    let opts = this.generateApolloOptions(apolloOpts, patchFn);

    return [_bodyParser2.default.json(), _bodyParser2.default.text({ type: 'application/graphql' }), (req, res, next) => {
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
  customMiddleware(graphqlHttpOptions = { graphiql: true }, patchFn) {
    const optsFn = this.generateOptions(graphqlHttpOptions, patchFn);
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
  get schemaMiddleware() {
    return (req, res, next) => {
      res.status(200).send(this.schema);
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
  get astMiddleware() {
    return (req, res, next) => {
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
};
// @module GQLExpressMiddleware

exports.default = GQLExpressMiddleware;
//# sourceMappingURL=GQLExpressMiddleware.js.map