# graphql-lattice ([www.graphql-lattice.com](https://www.graphql-lattice.com))
![GraphQL Logo](http://www.graphql-lattice.com/assets/lattice/logo_circled_256x256.png)

## About
Lattice for GraphQL is a lightweight implementation pattern/framework that is meant to provide a basis for your applications to fetch exactly the data that your needs demand; be they web, native mobile or desktop applications.

This is especially true for projects where your GraphQL object type definitions are better designed and served by not being muddled down on how to programmatically merge each type and its query and mutation types into a single GraphQL IDL document someplace.

Through the use of GraphQL's provided abstract syntax tree, or AST, toolkit, your object types can be automatically read from disk on server startup. Each type and their associated IDL definitions are calculated and merged for you. This results in a dynamically generated schema string that can be consumed easily by `express-graphql` or other similar libraries.

### _State of Things_

A new website for GraphQL Lattice with full documentation is in the works and should be available within a few days

## What is GraphQL?
Facebook's site on GraphQL states that GraphQL is, "A query language for your API." It goes on to say

> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Facebook provides an excellent source of information on learning GraphQL and interfacing it with various server side language implementations that you might be using. To learn more about this, head over to [their site](https://www.graphql.org).

## Near term roadmap

GraphQL Lattice version map

|Version|Changes|
|-------|-------|
|2.13.0|**Support `"lattice"` package.json entries**|
||&emsp;• `ModuleParser` file extensions and failOnError flag|
||&emsp;• Error handling; die or continue|
||**GQLBase**|
||&emsp;• AutoProps - automatically apply @Properties for fields missing resolvers (1:1 type/model mapping)|
||**`utils/getLatticePrefs` fetches prefs from local package.json**
||**`ModuleParser`**|
||&emsp;• Capture errors as they occur decide whether to die or continue based on prefs|
||&emsp;• Process only registered extensions|
||&emsp;• Capture error for each file processed that throws for later processing|
||**Additional unit tests**|
||**`getProp` in GQLBase to fetch property resolver regardless of type**|
||**`getResolver` in GQLBase to fetch a resolver from class or instance**|
|2.14.0 (Pending)|**ModuleParser module import support**
||*fetch GraphQL Lattice types from a node_modules dependency by name*|
## Examples

Until the new, under construction website is released, you can take a look at some of these quickstart boilerplate setups.

**Server Only**

https://github.com/nyteshade/lattice-quickstart

**React Client with Lattice/Express Backend**

https://github.com/nyteshade/lattice-markdown-server-client
