import { AdjacentSchema } from './decorators/AdjacentSchema'
import { Deferred, joinLines, promisify } from './utils'
import { FileSchema } from './decorators/FileSchema'
import { 
  Getters, Setters, Properties, DirectTypeManager 
} from './decorators/ModelProperties'
import { GQLBase, MODEL_KEY } from './GQLBase'
import { GQLEnum } from './GQLEnum'
import { GQLExpressMiddleware } from './GQLExpressMiddleware'
import { GQLInterface } from './GQLInterface'
import { GQLJSON } from './types/GQLJSON'
import { GQLScalar } from './GQLScalar'
import { ModuleParser, walkSync } from './ModuleParser'
import { Schema } from './decorators/Schema'
import { SchemaUtils } from './SchemaUtils'
import { SyntaxTree } from './SyntaxTree'
import * as types from './types'

const { typeOf } = types;
const {
  DOC_CLASS, DOC_FIELDS, DOC_QUERIES, DOC_MUTATORS, DOC_SUBSCRIPTIONS
} = GQLBase;

/* Create a friendly bundle to export all at once */
const defaultPackage = {
  AdjacentSchema,
  Deferred,
  DirectTypeManager,
  FileSchema,
  Getters,
  GQLBase,
  GQLEnum,
  GQLExpressMiddleware,
  GQLInterface,
  GQLJSON,
  GQLScalar,
  ModuleParser,
  joinLines,
  promisify,
  Properties,
  Schema,
  SchemaUtils,
  Setters,
  SyntaxTree,
  typeOf,
  types,

  MODEL_KEY,
  DOC_CLASS,
  DOC_FIELDS,
  DOC_QUERIES,
  DOC_MUTATORS,
  DOC_SUBSCRIPTIONS
};

/* Also export each of the constructs individually */
export {
  AdjacentSchema,
  Deferred,
  DirectTypeManager,
  FileSchema,
  Getters,
  GQLBase,
  GQLEnum,
  GQLExpressMiddleware,
  GQLInterface,
  GQLJSON,
  GQLScalar,
  ModuleParser,
  joinLines,
  promisify,
  Properties,
  Schema,
  SchemaUtils,
  Setters,
  SyntaxTree,
  typeOf,
  types,

  MODEL_KEY,
  DOC_CLASS,
  DOC_FIELDS,
  DOC_QUERIES,
  DOC_MUTATORS,
  DOC_SUBSCRIPTIONS
}

export default defaultPackage
