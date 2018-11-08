// TODO Remove any reliance on RegExp.escape()
if(!RegExp.escape){
    RegExp.escape = function(s){
      return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    };
}

import { AdjacentSchema } from './decorators/AdjacentSchema'
import { Deferred, joinLines, promisify, getLatticePrefs, LatticeLogs } from './utils'
import { FileSchema } from './decorators/FileSchema'
import { Getters, Setters, Properties, DirectTypeManager } from './decorators/ModelProperties'
import { resolver, mutator, subscriptor } from './decorators/Resolvers'
import { IDLFileHandler } from './IDLFileHandler'
import { GQLBase, MODEL_KEY, META_KEY, AUTO_PROPS, GETTERS, SETTERS, PROPS } from './GQLBase'
import { GQLEnum } from './GQLEnum'
import { GQLExpressMiddleware } from './GQLExpressMiddleware'
import { GQLInterface } from './GQLInterface'
import { GQLJSON } from './types/GQLJSON'
import { GQLScalar } from './GQLScalar'
import { LatticeFactory } from './LatticeFactory'
import { ModuleParser, walkSync } from './ModuleParser'
import { Schema } from './decorators/Schema'
import { SchemaUtils } from './SchemaUtils'
import { SyntaxTree } from './SyntaxTree'
import * as types from 'ne-types'
import { customDedent } from 'ne-tag-fns'

const { typeOf } = types;
const {
  DOC_CLASS, DOC_FIELDS, DOC_QUERIES, DOC_MUTATORS, DOC_SUBSCRIPTIONS,
  DOC_QUERY, DOC_MUTATION, DOC_SUBSCRIPTION
} = GQLBase;

const gql = customDedent({ dropLowest: true })

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
  LatticeFactory,
  LatticeLogs,
  ModuleParser,
  gql,
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

  AUTO_PROPS,
  DOC_CLASS,
  DOC_FIELDS,
  DOC_MUTATION,
  DOC_MUTATORS,
  DOC_QUERIES,
  DOC_QUERY,
  DOC_SUBSCRIPTION,
  DOC_SUBSCRIPTIONS,
  GETTERS,
  META_KEY,
  MODEL_KEY,
  PROPS,
  SETTERS
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
  LatticeFactory,
  LatticeLogs,
  ModuleParser,
  gql,
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

  AUTO_PROPS,
  DOC_CLASS,
  DOC_FIELDS,
  DOC_MUTATION,
  DOC_MUTATORS,
  DOC_QUERIES,
  DOC_QUERY,
  DOC_SUBSCRIPTION,
  DOC_SUBSCRIPTIONS,
  GETTERS,
  META_KEY,
  MODEL_KEY,
  PROPS,
  SETTERS
}

export default defaultPackage
