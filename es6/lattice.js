import { GQLBase } from './GQLBase'
import { GQLExpressMiddleware } from './GQLExpressMiddleware'
import { SyntaxTree } from './SyntaxTree'
import { Deferred } from './utils'
import types from './types'

const typeOf = types.typeOf

/* Create a friendly bundle to export all at once */
const defaultPackage = {
  GQLBase,
  GQLExpressMiddleware,
  SyntaxTree,
  Deferred,
  types,
  typeOf
};

/* Also export each of the constructs individually */
export {GQLBase}
export {GQLExpressMiddleware}
export {SyntaxTree}
export {Deferred}
export {typeOf}
export {types}
export default defaultPackage