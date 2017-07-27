import { GQLBase } from './GQLBase'
import { GQLExpressMiddleware } from './GQLExpressMiddleware'
import { SyntaxTree } from './SyntaxTree'
import { Deferred } from './utils'
import { AdjacentSchema } from './decorators/AdjacentSchema'
import { Getters, Setters, Properties } from './decorators/ModelProperties'
import { Schema } from './decorators/Schema'
import { FileSchema } from './decorators/FileSchema'
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
  Schema,
  FileSchema,
  typeOf,
  types
};

/* Also export each of the constructs individually */
export {
  GQLBase,
  GQLExpressMiddleware,
  SyntaxTree,
  Deferred,
  types,
  typeOf,
  AdjacentSchema,
  Getters,
  Setters,
  Properties,
  Schema,
  FileSchema
}

export default defaultPackage
