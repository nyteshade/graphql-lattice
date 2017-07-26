import { GQLBase } from './GQLBase'
import { GQLExpressMiddleware } from './GQLExpressMiddleware'
import { SyntaxTree } from './SyntaxTree'
import { Deferred } from './utils'
import { AdjacentSchema } from './decorators/AdjacentSchema'
import { Getters, Setters, Properties } from './decorators/ModelProperties'
import * as types from './types'

const { typeOf } = types;

/* Create a friendly bundle to export all at once */
const defaultPackage = {
  GQLBase,
  GQLExpressMiddleware,
  SyntaxTree,
  Deferred,
  AdjacentSchema,
  Getters,
  Setters,
  Properties,
  typeOf,
  types
};

/* Also export each of the constructs individually */
export {GQLBase}
export {GQLExpressMiddleware}
export {SyntaxTree}
export {Deferred}
export {types}
export {typeOf}
export {AdjacentSchema}
export {Getters}
export {Setters}
export {Properties}
export default defaultPackage
