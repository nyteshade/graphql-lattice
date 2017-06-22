// @flow

import { SyntaxTree } from './SyntaxTree'
import graphqlHTTP from 'express-graphql'
import { parse, print, buildSchema } from 'graphql'

/**
 * A handler that exposes an express middleware function that mounts a 
 * GraphQL I/O endpoint. Typical usage follows:
 *
 * const app = express();
 * app.use(/.../, new GQLExpressMiddleware([...classes]).middleware);
 */
export class GQLExpressMiddleware
{
  /**
   * For now, takes an Array of classes extending from GQLBase. These are 
   * parsed and a combined schema of all their individual schemas is generated 
   * via the use of ASTs. This is passed off to express-graphql.
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
   * @method makeRoot
   * 
   * @param {Request} req an Express 4.x request object
   * @param {Response} res an Express 4.x response object
   * @param {Object} gql an object containing information about the graphql 
   * request. It has the format of { query, variables, operationName, raw } as
   * described here: https://github.com/graphql/express-graphql
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
   * @method makeSchema
   * @return {string} a dynamically generated GraphQL IDL schema string 
   */
  makeSchema(): string {
    let schema = SyntaxTree.EmptyDocument();
    
    for (let object of this.handlers) {
      schema.appendDefinitions(object.SCHEMA);
    }
    
    console.log('\nGenerated GraphQL Schema\n----------------\n%s', schema);
    
    return schema.toString();
  }
  
  /**
   * Using the express-graphql module, it returns an Express 4.x middleware 
   * function. 
   * 
   * @method middleware
   * @return {Function} a function that expects request, response and next 
   * parameters as all Express middleware functions.
   */
  get middleware(): Function {
    const schema = this.makeSchema();
    
    return graphqlHTTP(async (req, res, gql) => ({    
      schema: buildSchema(schema),
      rootValue: await this.makeRoot(req, res, gql),
      graphiql: true
    }));        
  }
}

export default GQLExpressMiddleware;