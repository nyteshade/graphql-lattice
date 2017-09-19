// @flow
// @module GQLExpressMiddleware

import { SyntaxTree } from './SyntaxTree'
import graphqlHTTP from 'express-graphql'
import { GQLBase } from './GQLBase'
import { GQLInterface } from './GQLInterface'
import { GQLScalar } from './GQLScalar'
import { typeOf } from './types'
import EventEmitter from 'events'
import { SchemaUtils } from './SchemaUtils'
import path from 'path'
import {
  parse,
  print,
  buildSchema,
  GraphQLInterfaceType,
  GraphQLEnumType,
  GraphQLScalarType
} from 'graphql'

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
    super();
    this.handlers = handlers;
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
    return SchemaUtils.generateSchemaSDL(this.handlers);
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
   * @param {Function} patchFinalOpts see above

   * @return {Function} a middleware function compatible with Express
   */
  customMiddleware(
    graphqlHttpOptions: Object = {graphiql: true},
    patchFinalOpts?: Function
  ): Function {
    const schema = buildSchema(this.schema)
  
    SchemaUtils.injectInterfaceResolvers(schema, this.handlers);
    SchemaUtils.injectEnums(schema, this.handlers);
    SchemaUtils.injectScalars(schema, this.handlers);
    SchemaUtils.injectComments(schema, this.handlers);

    // See if there is a way abstract the passing req, res, gql to each
    // makeRoot resolver without invoking makeRoot again every time.
    return graphqlHTTP(async (req, res, gql) => {
      let opts = {
        schema,
        rootValue: await SchemaUtils.createMergedRoot(
          this.handlers, {req, res, gql}
        ),
        formatError: error => ({
          message: error.message,
          locations: error.locations,
          stack: error.stack,
          path: error.path
        })
      };

      Object.assign(opts, graphqlHttpOptions);
      if (patchFinalOpts) {
        Object.assign(opts, patchFinalOpts.bind(this)(opts) || opts);
      }

      return opts;
    });
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
}

export default GQLExpressMiddleware;
