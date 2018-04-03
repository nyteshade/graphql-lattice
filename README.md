# graphql-lattice ([www.graphql-lattice.com](https://www.graphql-lattice.com))

[![Build Status](https://travis-ci.org/nyteshade/graphql-lattice.svg?branch=master)](https://travis-ci.org/nyteshade/graphql-lattice) [![dependencies Status](https://david-dm.org/nyteshade/graphql-lattice/status.svg)](https://david-dm.org/nyteshade/graphql-lattice) [![devDependencies Status](https://david-dm.org/nyteshade/graphql-lattice/dev-status.svg)](https://david-dm.org/nyteshade/graphql-lattice?type=dev) [![greenkeeper enabled](https://badges.greenkeeper.io/nyteshade/graphql-lattice.svg)](https://greenkeeper.io/) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) ![package version](https://img.shields.io/badge/dynamic/json.svg?label=version&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fnyteshade%2Fgraphql-lattice%2Fmaster%2Fpackage.json&query=version&colorB=1d7ebe)

![GraphQL Logo](http://www.graphql-lattice.com/assets/lattice/logo_circled_256x256.png)

## 🚧 Work in Progress 🚨
Understand that GraphQL Lattice is still a work in progress and no assumptions about permanent usability should be made. Feedback and pull requests are welcome as is any desire to contribute. Documentation is noticeably sparse. It is a **known issue**, please be patient while this is worked on. Please feel free ask me or the contributors to the project should you have any specific questions. The source code should be well documented, as are the example apps listed below.

### _What is GraphQL?_
Facebook's site on GraphQL states that GraphQL is, "A query language for your API." It goes on to say

> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Facebook provides an excellent source of information on learning GraphQL and interfacing it with various server side language implementations that you might be using. To learn more about this, head over to [their site](https://www.graphql.org).

### _What is Lattice?_
Lattice for GraphQL is predominantly aimed to be a tool for managing and organizing your Schema and resolvers. It is somewhat Object Oriented but very much in same way that one might use `class Component extends React.Component`. Extensive inheritance and any over abundance of abstraction will likely lead you to a hole that will be hard to get out of, nor is the recommended way to use GraphQL Lattice.

The primary goals of Lattice are

 * Provide a consistent method of logically keeping your Schema for a given type next to the resolvers and implementation that make it up.
 * Provide an easy way to add documentation to every level of your Schema, programmatically, while still using GraphQL SDL/IDL to define the structure of your Schema.
 * Prevent any manual labor involved in merging the Query or Mutation types you've defined for all the GraphQL Object types you've put together in your application.
   * _*Uses ASTs, not string parsing, in order to make this happen*_

Much of the newer Lattice code emphasizes the usage of ES7 Decorators and other advanced JavaScript features such as Proxies. While ES7 Decorators are **not required**, their usage reduces a lot of boilerplate and are the recommended way to write Lattice code.

### _Optionally Opininated Features_
Some features of Lattice, while optional, are opininated and can make your life easier if you like the idea of how they work. One such feature is the `ModuleParser`. The `ModuleParser`, given a directory of `GQLBase` extended, or Lattice, classes, will automatically extract and build your Schema from this extraction. So, if you have a directory structure such as this

```sh
gql
├── enums
├── interfaces
└── types
    ├── Job.js
    └── Person.js
```

You could write code like like the following and no matter how many types, enums, interfaces or more that you ended up writing in the future, as long as that code was placed under the `./src/gql` directory path passed to `ModuleParser`, it would automatically be loaded and ready for use going forward.

The idea of JavaScript dynamically loading this code on startup is contentious to some and this is why it is optional, but Lattice is focused on removing unnecessary boilerplate so that you can focus on getting your work done. This is one way that it can do so.

```js
import { Router } from 'express'
import { GQLExpressMiddleware, ModuleParser } from 'graphql-lattice'

const router = Router();
const parser = new ModuleParser('./src/gql')
const lattice = new GQLExpressMiddleware(parser.parseSync())

router.use('/graphql', lattice.middleware)
```

## _Roadmap 🛣_
GraphQL Lattice version map

|Version| 🚧 |Changes|
|-------|---|-------|
|2.13.0|✅|**Support `"lattice"` package.json entries**|
||✅|&emsp;• `ModuleParser` file extensions and failOnError flag|
||✅|&emsp;• Error handling; die or continue|
||✅|**GQLBase**|
||✅|&emsp;• AutoProps - automatically apply @Properties for fields missing resolvers (1:1 type/model mapping)|
||✅|**`utils/getLatticePrefs` fetches prefs from local package.json**
||✅|**`ModuleParser`**|
||✅|&emsp;• Capture errors as they occur decide whether to die or continue based on prefs|
||✅|&emsp;• Process only registered extensions|
||✅|&emsp;• Capture error for each file processed that throws for later processing|
||✅|**Additional unit tests**|
||✅|**`getProp` in GQLBase to fetch property resolver regardless of type**|
||✅|**`getResolver` in GQLBase to fetch a resolver from class or instance**|
|2.13.1|✅|**Fix overzealous auto-prop creation**|
||✅|&emsp;• AutoProps were being created when they shouldn't due to how existing property existence was being tested|
||✅|&emsp;• Fixed the usage of `target[key]` to `descriptor.value` for @resolver/@mutator/@subscriptor usage|
|2.13.6|✅|**Refactor `types.js` into its own repo `ne-types`**|

## _Example projects_

Until the new, under construction website is released, you can take a look at some of these quickstart boilerplate setups.

**Server Only**

https://github.com/nyteshade/lattice-quickstart

**React Client with Lattice/Express Backend**

https://github.com/nyteshade/lattice-markdown-server-client
