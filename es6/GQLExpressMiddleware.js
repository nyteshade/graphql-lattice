// @flow
// @module GQLExpressMiddleware

import { SyntaxTree } from './SyntaxTree'
import { GQLBase } from './GQLBase'
import { GQLInterface } from './GQLInterface'
import { GQLScalar } from './GQLScalar'
import { typeOf } from './types'
import { SchemaUtils } from './SchemaUtils'
import _, { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import {
  parse,
  print,
  buildSchema,
  GraphQLSchema,
  GraphQLInterfaceType,
  GraphQLEnumType,
  GraphQLScalarType
} from 'graphql'

import bodyParser from 'body-parser'
import graphqlHTTP from 'express-graphql'
import EventEmitter from 'events'
import path from 'path'

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
export class GQLExpressMiddleware extends EventEmitter
{
  handlers: Array<GQLBase>;

  schema: string;

  cache: Map<any, any> = new Map()

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
  constructor(handlers: Array<GQLBase>) {
    super()

    this.handlers = handlers

    // Generate and cache the schema SDL/IDL string and ast obj (GraphQLSchema)
    this.ast
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
  clearCache(): GQLExpressMiddleware {
    this.cache.clear()
    return this
  }

  /**
   * The schema property returns the textual Schema as it is generated based
   * on the various Lattice types, interfaces and enums defined in your
   * project. The ast property returns the JavaScript AST represenatation of
   * that schema with all injected modificiations detailed in your classes.
   */
  get ast(): GraphQLSchema {
    let cached: ?GraphQLSchema = this.cache.get('ast')

    if (cached) {
      return cached
    }

    let ast: GraphQLSchema = buildSchema(this.schema)

    SchemaUtils.injectAll(ast, this.handlers);

    this.cache.set('ast', ast)

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
  get schema(): string {
    let cached = this.cache.get('schema')
    let schema

    if (cached) return cached

    schema = SchemaUtils.generateSchemaSDL(this.handlers);
    this.cache.set('schema', schema)

    return schema
  }

  async rootValue(
    requestData: Object,
    separateByType: boolean = false
  ): Object {
    let root = await SchemaUtils.createMergedRoot(
      this.handlers, requestData, separateByType
    )

    return root;
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
  get middleware(): Function {
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
  get middlewareWithoutGraphiQL(): Function {
    return this.customMiddleware({graphiql: false});
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
  generateOptions(
    options: Object = { graphiql: true },
    patchFn: ?Function = null
  ): Function {
    const optsFn = async (req: mixed, res: mixed, gql: mixed) => {
      let schema = this.ast;
      let opts = {
        schema,
        rootValue: await this.rootValue({req, res, gql}),
        formatError: error => ({
          message: error.message,
          locations: error.locations,
          stack: error.stack,
          path: error.path
        })
      }

      merge(opts, options);
      if (patchFn && typeof patchFn === 'function') {
        merge(
          opts,
          (patchFn.bind(this)(opts, {req, res, gql})) || opts
        );
      }

      return opts;
    }

    return optsFn
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
  generateApolloOptions(
    options: Object = {
      formatError: error => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack,
        path: error.path
      }),
      debug: true
    },
    patchFn: ?Function = null
  ): Function {
    const optsFn = async (req: mixed, res: mixed) => {
      let opts = {
        schema: this.ast,
        resolvers: await this.rootValue({req, res}, true)
      }

      opts.schema = makeExecutableSchema({
        typeDefs: [this.schema],
        resolvers: opts.resolvers
      })

      SchemaUtils.injectAll(opts.schema, this.handlers);

      merge(opts, options);
      if (patchFn && typeof patchFn === 'function') {
        merge(
          opts,
          (patchFn.bind(this)(opts, {req, res})) || opts
        );
      }

      return opts;
    }

    return optsFn
  }

  apolloMiddleware(
    apolloFn: Function,
    apolloOpts: Object = {},
    patchFn: ?Function = null
  ): Array<Function> {
    let opts = this.generateApolloOptions(apolloOpts, patchFn)

    return [
      bodyParser.json(),
      bodyParser.text({ type: 'application/graphql' }),
      (req, res, next) => {
          if (req.is('application/graphql')) {
              req.body = { query: req.body };
          }
          next();
      },
      apolloFn(opts)
    ]
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
  customMiddleware(
    graphqlHttpOptions: Object = {graphiql: true},
    patchFn?: Function
  ): Function {
    const optsFn = this.generateOptions(graphqlHttpOptions, patchFn)
    return graphqlHTTP(optsFn)
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
  get schemaMiddleware(): Function {
    return (req: Object, res: Object, next: ?Function) => {
      res.status(200).send(this.schema);
    }
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
  get astMiddleware(): Function {
    return (req: Object, res: Object, next: ?Function) => {
      res.status(200).send('Temporarily disabled in this version')

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
    }
  }
}

export default GQLExpressMiddleware;
