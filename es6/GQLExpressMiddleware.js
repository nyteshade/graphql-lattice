// @flow
// @module GQLExpressMiddleware

import { SyntaxTree } from './SyntaxTree'
import graphqlHTTP from 'express-graphql'
import { parse, print, buildSchema } from 'graphql'
import { GQLBase } from './GQLBase'
import { typeOf } from './types'

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
export class GQLExpressMiddleware
{
  /**
   * For now, takes an Array of classes extending from GQLBase. These are 
   * parsed and a combined schema of all their individual schemas is generated 
   * via the use of ASTs. This is passed off to express-graphql.
   *
   * @instance
   * @memberof GQLExpressMiddleware
   * @method ⎆⠀constructor
   * 
   * @param {Array<GQLBase>} handlers an array of GQLBase extended classes
   */
  constructor(handlers: Array<GQLBase>) {
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
        
        console.log(handler);
        console.log(handler.path,'\n',handler.extension)
        console.log(handler.getFile())
        classSchema = handler.getSchema();
        console.log('Loaded schema\n%s\n', classSchema)
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
    graphqlHttpOptions = {graphiql: true},
    patchFinalOpts: Function = null
  ): Function {
    const schema = buildSchema(this.makeSchema());
        
    return graphqlHTTP(async (req, res, gql) => {      
      const opts = {
        schema,
        rootValue: await this.makeRoot(req, res, gql)
      };
      
      Object.assign(opts, graphqlHttpOptions);
      if (patchFinalOpts) {
        Object.assign(opts, patchFinalOpts(opts) || opts);
      }
      
      return opts;
    });
  }
}

export default GQLExpressMiddleware;