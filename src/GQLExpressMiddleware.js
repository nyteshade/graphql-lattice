import { SyntaxTree } from './SyntaxTree'
import graphqlHTTP from 'express-graphql'
import { parse, print, buildSchema } from 'graphql'

export class GQLExpressMiddleware
{
  constructor(handlers) {
    this.handlers = handlers;
  }
  
  async makeRoot(req, res, gql) {
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
  
  makeSchema() {
    let schema = SyntaxTree.EmptyDocument();
    
    for (let object of this.handlers) {
      schema.appendDefinitions(object.SCHEMA);
    }
    
    console.log('\nGenerated GraphQL Schema\n----------------\n%s', schema);
    
    return schema.toString();
  }
  
  get middleware() {
    const schema = this.makeSchema();
    
    return graphqlHTTP(async (req, res, gql) => ({    
      schema: buildSchema(schema),
      rootValue: await this.makeRoot(req, res, gql),
      graphiql: true
    }));        
  }
  
}

export default GQLExpressMiddleware;