import { GQLBase } from './GQLBase'
import { GQLExpressMiddleware } from './GQLExpressMiddleware'
import { SyntaxTree } from './SyntaxTree'
import { Deferred } from './utils'
import * as types from './types'

const { typeOf } = types;

/* Create a friendly bundle to export all at once */
const defaultPackage = {
  GQLBase,
  GQLExpressMiddleware,
  SyntaxTree,
  Deferred,
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
export default defaultPackage