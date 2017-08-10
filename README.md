# graphql-lattice ([www.graphql-lattice.com](https://www.graphql-lattice.com))
![GraphQL Logo](http://www.graphql-lattice.com/assets/lattice/logo_circled_256x256.png)

## About
Lattice for GraphQL is a lightweight implementation pattern/framework that is meant to provide a basis for your applications to fetch exactly the data that your needs demand; be they web, native mobile or desktop applications.

This is especially true for projects where your GraphQL object type definitions are better designed and served by not being muddled down on how to programmatically merge each type and its query and mutation types into a single GraphQL IDL document someplace.

Through the use of GraphQL's provided abstract syntax tree, or AST, toolkit, your object types can be automatically read from disk on server startup. Each type and their associated IDL definitions are calculated and merged for you. This results in a dynamically generated schema string that can be consumed easily by `express-graphql` or other similar libraries.

### _State of Things_

#### Current Limitations
 * Currently only tested for use with Express 4.x, express-graphql and graphql-js. 

#### TODO List
 - [ ] `GQLExpressMiddleware` to be modified to take a directory containing your projects object type definition sources. These should all descend from `GQLBase` directly. This is in lieu of currently taking references to each class you want to have included manually. *This should be an optional alternative*.
 - [ ] Safely merge more than `ObjectTypeDefinition` AST types. Currently as these exist outside of the default implementation, they have not been fully explored by me.
 - [x] Provide mechanism to specify docs for graphiql
 - [x] Provide support for GraphQLObjectType definitions 
 - [x] Provide support for GraphQLInterfaceType definitions 
 - [ ] Provide support for GraphQLUnionType definitions
 - [ ] Provide support for GraphQL subscriptions
 - [x] Provide emitter support for GQLBase and derivatives
 - [x] Provide decorator support for @Schema 
 - [x] Provide decorator support for @AdjacentSchema
 - [x] Provide decorator support for @Getters, @Setters, @Properties (since 2.1, 2.4 provided alias renaming, 2.5 provides type instantiation)

## What is GraphQL?
Facebook's site on GraphQL states that GraphQL is, "A query language for your API." It goes on to say

> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Facebook provides an excellent source of information on learning GraphQL and interfacing it with various server side language implementations that you might be using. To learn more about this, head over to [their site](https://www.graphql.org).

## Examples
***Coming Soon***
