import { AdjacentSchema } from './decorators/AdjacentSchema'
import { Deferred, joinLines, promisify, getLatticePrefs } from './utils'
import { FileSchema } from './decorators/FileSchema'
import {
  Getters, Setters, Properties, DirectTypeManager
} from './decorators/ModelProperties'
import { resolver, mutator, subscriptor } from './decorators/Resolvers'
import { IDLFileHandler } from './IDLFileHandler'
import { GQLBase, MODEL_KEY, META_KEY } from './GQLBase'
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
  DOC_CLASS, DOC_FIELDS, DOC_QUERIES, DOC_MUTATORS, DOC_SUBSCRIPTIONS,
  DOC_QUERY, DOC_MUTATION, DOC_SUBSCRIPTION
} = GQLBase;

/* Create a friendly bundle to export all at once */
const defaultPackage = {
  AdjacentSchema,
  Deferred,
  DirectTypeManager,
  FileSchema,
  getLatticePrefs,
  Getters,
  GQLBase,
  GQLEnum,
  GQLExpressMiddleware,
  GQLInterface,
  GQLJSON,
  GQLScalar,
  IDLFileHandler,
  ModuleParser,
  mutator,
  joinLines,
  promisify,
  Properties,
  resolver,
  Schema,
  SchemaUtils,
  Setters,
  subscriptor,
  SyntaxTree,
  typeOf,
  types,

  DOC_CLASS,
  DOC_FIELDS,
  DOC_MUTATION,
  DOC_MUTATORS,
  DOC_QUERIES,
  DOC_QUERY,
  DOC_SUBSCRIPTION,
  DOC_SUBSCRIPTIONS,
  META_KEY,
  MODEL_KEY
};

/* Also export each of the constructs individually */
export {
  AdjacentSchema,
  Deferred,
  DirectTypeManager,
  FileSchema,
  getLatticePrefs,
  Getters,
  GQLBase,
  GQLEnum,
  GQLExpressMiddleware,
  GQLInterface,
  GQLJSON,
  GQLScalar,
  IDLFileHandler,
  ModuleParser,
  mutator,
  joinLines,
  promisify,
  Properties,
  resolver,
  Schema,
  SchemaUtils,
  Setters,
  subscriptor,
  SyntaxTree,
  typeOf,
  types,

  DOC_CLASS,
  DOC_FIELDS,
  DOC_MUTATION,
  DOC_MUTATORS,
  DOC_QUERIES,
  DOC_QUERY,
  DOC_SUBSCRIPTION,
  DOC_SUBSCRIPTIONS,
  META_KEY,
  MODEL_KEY
}

export default defaultPackage
