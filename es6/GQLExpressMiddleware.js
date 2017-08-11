// @flow
// @module GQLExpressMiddleware

import { SyntaxTree } from './SyntaxTree'
import graphqlHTTP from 'express-graphql'
import { parse, print, buildSchema, GraphQLInterfaceType } from 'graphql'
import { GQLBase } from './GQLBase'
import { GQLInterface } from './GQLInterface'
import { typeOf } from './types'
import { EventEmitter } from 'events'
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
   * An asynchronous function used to parse the supplied classes for each
   * ones resolvers and mutators. These are all combined into a single root
   * object passed to express-graphql.
   *
   * @instance
   * @memberof GQLExpressMiddleware
   * @method ⌾⠀makeRoot
   *
   * @param {Request} req an Express 4.x request object
   * @param {Response} res an Express 4.x response object
   * @param {Object} gql an object containing information about the graphql
   * request. It has the format of `{ query, variables, operationName, raw }`
   * as described here: https://github.com/graphql/express-graphql
   * @return {Promise<Object>} a Promise resolving to an Object containing all
   * the functions described in both Query and Mutation types.
   */
  async makeRoot(req: Object, res: Object, gql: Object): Promise<Object> {
    this.root = {};

    for (let object of this.handlers) {
      Object.assign(
        this.root,
        await object.RESOLVERS({req, res, gql}),
        await object.MUTATORS({req, res, gql})
      );
    }

    return this.root;
  }

  /**
   * A function that combines the IDL schemas of all the supplied classes and
   * returns that value to the middleware getter.
   *
   * @instance
   * @memberof GQLExpressMiddleware
   * @method ⌾⠀makeSchema
   *
   * @return {string} a dynamically generated GraphQL IDL schema string
   */
  makeSchema(): string {
    let schema = SyntaxTree.EmptyDocument();

    for (let Class of this.handlers) {
      let classSchema = Class.SCHEMA;

      if (typeOf(classSchema) === 'Symbol') {
        let handler = Class.handler;
        let filename = path.basename(Class.handler.path)

        classSchema = handler.getSchema();
        console.log(
          `\nRead schema (%s)\n%s\n%s\n`,
          filename,
          '-'.repeat(14 + filename.length),
          classSchema.replace(/^/gm, '  ')
        )
      }

      schema.appendDefinitions(classSchema);
    }

    console.log('\nGenerated GraphQL Schema\n----------------\n%s', schema);

    return schema.toString();
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
    patchFinalOpts: Function = null
  ): Function {
    const schema = buildSchema(this.makeSchema());

    // TODO handle scalars, unions and the rest
    this.injectInterfaceResolvers(schema);
    this.injectComments(schema);

    // See if there is a way abstract the passing req, res, gql to each
    // makeRoot resolver without invoking makeRoot again every time.
    return graphqlHTTP(async (req, res, gql) => {
      let opts = {
        schema,
        rootValue: await this.makeRoot(req, res, gql),
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
   * Until such time as I can get the reference Facebook GraphQL AST parser to
   * read and apply descriptions or until such time as I employ the Apollo
   * AST parser, providing a `static get apiDocs()` getter is the way to get
   * your descriptions into the proper fields, post schema creation.
   *
   * This method walks the types in the registered handlers and the supplied
   * schema type. It then injects the written comments such that they can
   * be exposed in graphiql and to applications or code that read the meta
   * fields of a built schema
   *
   * TODO handle argument comments and other outliers
   *
   * @memberof GQLExpressMiddleware
   * @method ⌾⠀injectComments
   * @instance
   *
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   */
  injectComments(schema: Object) {
    const {
      DOC_CLASS, DOC_FIELDS, DOC_QUERIES, DOC_MUTATORS, DOC_SUBSCRIPTIONS
    } = GQLBase;

    for (let handler of this.handlers) {
      const docs = handler.apiDocs();
      const query = schema._typeMap.Query;
      const mutation = schema._typeMap.Mutation;
      const subscription = schema._typeMap.Subscription;
      let type;

      if ((type = schema._typeMap[handler.name])) {
        let fields = type._fields;

        if (docs[DOC_CLASS]) { type.description = docs[DOC_CLASS] }
        for (let field of Object.keys(docs[DOC_FIELDS] || {})) {
          if (field in fields) {
            fields[field].description = docs[DOC_FIELDS][field];
          }
        }
      }

      for (let [_type, _CONST] of [
        [query, DOC_QUERIES],
        [mutation, DOC_MUTATORS],
        [subscription, DOC_SUBSCRIPTIONS]
      ]) {
        if (_type && Object.keys(docs[_CONST] || {}).length) {
          let fields = _type._fields;

          if (docs[_CONST][DOC_CLASS]) {
            _type.description = docs[_CONST][DOC_CLASS]
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
   * `injectInterfaceResolvers` method walks the registered handlers and
   * finds `GQLInterface` types and applies their `resolveType()`
   * implementations.
   *
   * @memberof GQLExpressMiddleware
   * @method ⌾⠀injectInterfaceResolvers
   * @instance
   *
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   */
  injectInterfaceResolvers(schema: Object) {
    for (let handler of this.handlers) {
      if (handler.GQL_TYPE === GraphQLInterfaceType) {
        schema._typeMap[handler.name].resolveType =
        schema._typeMap[handler.name]._typeConfig.resolveType =
          handler.resolveType;
      }
    }
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
    return (req: mixed, res: mixed, next: ?Function) => {
      res.status(200).send(this.makeSchema());
    }
  }
}

export default GQLExpressMiddleware;
