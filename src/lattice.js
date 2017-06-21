import { GQLBase } from './GQLBase'
import { GQLExpressMiddleware } from './GQLExpressMiddleware'
import { SyntaxTree } from './SyntaxTree'
import { Deferred, typeOf } from './utils'

/* Create a friendly bundle to export all at once */
const defaultPackage = {
  GQLBase,
  GQLExpressMiddleware,
  SyntaxTree,
  Deferred,
  typeOf
};

/* Also export each of the constructs individually */
export {GQLBase}
export {GQLExpressMiddleware}
export {SyntaxTree}
export {Deferred}
export {typeOf}
export default defaultPackage