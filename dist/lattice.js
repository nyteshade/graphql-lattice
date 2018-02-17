'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SETTERS = exports.PROPS = exports.MODEL_KEY = exports.META_KEY = exports.GETTERS = exports.DOC_SUBSCRIPTIONS = exports.DOC_SUBSCRIPTION = exports.DOC_QUERY = exports.DOC_QUERIES = exports.DOC_MUTATORS = exports.DOC_MUTATION = exports.DOC_FIELDS = exports.DOC_CLASS = exports.AUTO_PROPS = exports.types = exports.typeOf = exports.SyntaxTree = exports.subscriptor = exports.Setters = exports.SchemaUtils = exports.Schema = exports.resolver = exports.Properties = exports.promisify = exports.joinLines = exports.mutator = exports.gql = exports.ModuleParser = exports.LatticeLogs = exports.LatticeFactory = exports.IDLFileHandler = exports.GQLScalar = exports.GQLJSON = exports.GQLInterface = exports.GQLExpressMiddleware = exports.GQLEnum = exports.GQLBase = exports.Getters = exports.getLatticePrefs = exports.FileSchema = exports.DirectTypeManager = exports.Deferred = exports.AdjacentSchema = undefined;

var _AdjacentSchema = require('./decorators/AdjacentSchema');

var _utils = require('./utils');

var _FileSchema = require('./decorators/FileSchema');

var _ModelProperties = require('./decorators/ModelProperties');

var _Resolvers = require('./decorators/Resolvers');

var _IDLFileHandler = require('./IDLFileHandler');

var _GQLBase = require('./GQLBase');

var _GQLEnum = require('./GQLEnum');

var _GQLExpressMiddleware = require('./GQLExpressMiddleware');

var _GQLInterface = require('./GQLInterface');

var _GQLJSON = require('./types/GQLJSON');

var _GQLScalar = require('./GQLScalar');

var _LatticeFactory = require('./LatticeFactory');

var _ModuleParser = require('./ModuleParser');

var _Schema = require('./decorators/Schema');

var _SchemaUtils = require('./SchemaUtils');

var _SyntaxTree = require('./SyntaxTree');

var _neTypes = require('ne-types');

var types = _interopRequireWildcard(_neTypes);

var _neTagFns = require('ne-tag-fns');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const { typeOf } = types;
const {
  DOC_CLASS, DOC_FIELDS, DOC_QUERIES, DOC_MUTATORS, DOC_SUBSCRIPTIONS,
  DOC_QUERY, DOC_MUTATION, DOC_SUBSCRIPTION
} = _GQLBase.GQLBase;

const gql = (0, _neTagFns.customDedent)({ dropLowest: true });

/* Create a friendly bundle to export all at once */
const defaultPackage = {
  AdjacentSchema: _AdjacentSchema.AdjacentSchema,
  Deferred: _utils.Deferred,
  DirectTypeManager: _ModelProperties.DirectTypeManager,
  FileSchema: _FileSchema.FileSchema,
  getLatticePrefs: _utils.getLatticePrefs,
  Getters: _ModelProperties.Getters,
  GQLBase: _GQLBase.GQLBase,
  GQLEnum: _GQLEnum.GQLEnum,
  GQLExpressMiddleware: _GQLExpressMiddleware.GQLExpressMiddleware,
  GQLInterface: _GQLInterface.GQLInterface,
  GQLJSON: _GQLJSON.GQLJSON,
  GQLScalar: _GQLScalar.GQLScalar,
  IDLFileHandler: _IDLFileHandler.IDLFileHandler,
  LatticeFactory: _LatticeFactory.LatticeFactory,
  LatticeLogs: _utils.LatticeLogs,
  ModuleParser: _ModuleParser.ModuleParser,
  gql,
  mutator: _Resolvers.mutator,
  joinLines: _utils.joinLines,
  promisify: _utils.promisify,
  Properties: _ModelProperties.Properties,
  resolver: _Resolvers.resolver,
  Schema: _Schema.Schema,
  SchemaUtils: _SchemaUtils.SchemaUtils,
  Setters: _ModelProperties.Setters,
  subscriptor: _Resolvers.subscriptor,
  SyntaxTree: _SyntaxTree.SyntaxTree,
  typeOf,
  types,

  AUTO_PROPS: _GQLBase.AUTO_PROPS,
  DOC_CLASS,
  DOC_FIELDS,
  DOC_MUTATION,
  DOC_MUTATORS,
  DOC_QUERIES,
  DOC_QUERY,
  DOC_SUBSCRIPTION,
  DOC_SUBSCRIPTIONS,
  GETTERS: _GQLBase.GETTERS,
  META_KEY: _GQLBase.META_KEY,
  MODEL_KEY: _GQLBase.MODEL_KEY,
  PROPS: _GQLBase.PROPS,
  SETTERS: _GQLBase.SETTERS
};

/* Also export each of the constructs individually */
exports.AdjacentSchema = _AdjacentSchema.AdjacentSchema;
exports.Deferred = _utils.Deferred;
exports.DirectTypeManager = _ModelProperties.DirectTypeManager;
exports.FileSchema = _FileSchema.FileSchema;
exports.getLatticePrefs = _utils.getLatticePrefs;
exports.Getters = _ModelProperties.Getters;
exports.GQLBase = _GQLBase.GQLBase;
exports.GQLEnum = _GQLEnum.GQLEnum;
exports.GQLExpressMiddleware = _GQLExpressMiddleware.GQLExpressMiddleware;
exports.GQLInterface = _GQLInterface.GQLInterface;
exports.GQLJSON = _GQLJSON.GQLJSON;
exports.GQLScalar = _GQLScalar.GQLScalar;
exports.IDLFileHandler = _IDLFileHandler.IDLFileHandler;
exports.LatticeFactory = _LatticeFactory.LatticeFactory;
exports.LatticeLogs = _utils.LatticeLogs;
exports.ModuleParser = _ModuleParser.ModuleParser;
exports.gql = gql;
exports.mutator = _Resolvers.mutator;
exports.joinLines = _utils.joinLines;
exports.promisify = _utils.promisify;
exports.Properties = _ModelProperties.Properties;
exports.resolver = _Resolvers.resolver;
exports.Schema = _Schema.Schema;
exports.SchemaUtils = _SchemaUtils.SchemaUtils;
exports.Setters = _ModelProperties.Setters;
exports.subscriptor = _Resolvers.subscriptor;
exports.SyntaxTree = _SyntaxTree.SyntaxTree;
exports.typeOf = typeOf;
exports.types = types;
exports.AUTO_PROPS = _GQLBase.AUTO_PROPS;
exports.DOC_CLASS = DOC_CLASS;
exports.DOC_FIELDS = DOC_FIELDS;
exports.DOC_MUTATION = DOC_MUTATION;
exports.DOC_MUTATORS = DOC_MUTATORS;
exports.DOC_QUERIES = DOC_QUERIES;
exports.DOC_QUERY = DOC_QUERY;
exports.DOC_SUBSCRIPTION = DOC_SUBSCRIPTION;
exports.DOC_SUBSCRIPTIONS = DOC_SUBSCRIPTIONS;
exports.GETTERS = _GQLBase.GETTERS;
exports.META_KEY = _GQLBase.META_KEY;
exports.MODEL_KEY = _GQLBase.MODEL_KEY;
exports.PROPS = _GQLBase.PROPS;
exports.SETTERS = _GQLBase.SETTERS;
exports.default = defaultPackage;
//# sourceMappingURL=lattice.js.map