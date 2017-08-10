import { GQLBase, MODEL_KEY } from './GQLBase'
import { GQLInterface } from './GQLInterface'
import { GQLExpressMiddleware } from './GQLExpressMiddleware'
import { SyntaxTree } from './SyntaxTree'
import { Deferred, joinLines } from './utils'
import { AdjacentSchema } from './decorators/AdjacentSchema'
import { Getters, Setters, Properties } from './decorators/ModelProperties'
import { Schema } from './decorators/Schema'
import { FileSchema } from './decorators/FileSchema'
import * as types from './types'

const { typeOf } = types;
const {
  DOC_CLASS, DOC_FIELDS, DOC_QUERIES, DOC_MUTATORS, DOC_SUBSCRIPTIONS
} = GQLBase;

/* Create a friendly bundle to export all at once */
const defaultPackage = {
  AdjacentSchema,
  Deferred,
  FileSchema,
  Getters,
  GQLBase,
  GQLExpressMiddleware,
  GQLInterface,
  joinLines,
  Properties,
  Schema,
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
  FileSchema,
  Getters,
  GQLBase,
  GQLExpressMiddleware,
  GQLInterface,
  joinLines,
  Properties,
  Schema,
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
