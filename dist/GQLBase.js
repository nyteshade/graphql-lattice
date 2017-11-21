'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLBase = exports.META_KEY = exports.REQ_DATA_KEY = exports.MODEL_KEY = undefined;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toStringTag = require('babel-runtime/core-js/symbol/to-string-tag');

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _for = require('babel-runtime/core-js/symbol/for');

var _for2 = _interopRequireDefault(_for);

exports.notDefined = notDefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('./utils');

var _types = require('./types');

var _SyntaxTree = require('./SyntaxTree');

var _ModelProperties = require('./decorators/ModelProperties');

var _graphql = require('graphql');

var _IDLFileHandler = require('./IDLFileHandler');

var _lodash = require('lodash');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Internal implementation to detect the existence of proxies. When present
 * additional functionality is enabled. Proxies are native in Node >= 6 */
const hasProxy = typeof global.Proxy !== 'undefined';

/* Internal Symbol referring to real accessor to GQLBase model object */
/** @namespace GQLBaseEnv */


const _MODEL_KEY = (0, _for2.default)('data-model-contents-value');

/* Internal Symbol referring to the static object containing a proxy handler */
const _PROXY_HANDLER = (0, _for2.default)('internal-base-proxy-handler');

/**
 * Simple function to check if a supplied key matches a string of your
 * choosing and that string is not a defined property on the instance
 * passed to the check.
 *
 * @method GQLBaseEnv~notDefined
 * @memberof GQLBaseEnv
 * @since 2.5.0
 *
 * @param {string} keyToTest a String denoting the property you wish to test
 * @param {mixed} keySupplied a value, coerced `toString()`, to compare to
 * `keyToTest`
 * @param {mixed} instance an object instance to check `hasOwnProperty` on for
 * the `keyToTest` supplied.
 * @return {Boolean} true if the property matches the supplied key and that
 * property is not an ownedProperty of the instance supplied.
 */
function notDefined(keyToTest, keySupplied, instance) {
  return new RegExp("^" + keyToTest + "$").test(keySupplied.toString()) && !instance.hasOwnProperty(keyToTest);
}

/**
 * A `Symbol` used as a key to store the backing model data. Designed as a
 * way to separate model data and GraphQL property accessors into logical bits.
 *
 * @type {Symbol}
 * @memberof GQLBaseEnv
 * @const
 */
const MODEL_KEY = exports.MODEL_KEY = (0, _for2.default)('data-model-contents-key');

/**
 * A `Symbol` used as a key to store the request data for an instance of the
 * GQLBase object in question.
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberof GQLBaseEnv
 */
const REQ_DATA_KEY = exports.REQ_DATA_KEY = (0, _for2.default)('request-data-object-key');

/**
 * A nameless Symbol for use as a key to the internal decorator storage
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberof GQLBaseEnv
 */
const META_KEY = exports.META_KEY = (0, _symbol2.default)();

/**
 * All GraphQL Type objects used in this system are assumed to have extended
 * from this class. An instance of this class can be used to wrap an existing
 * structure if you have one.
 *
 * @class GQLBase
 */
let GQLBase = exports.GQLBase = class GQLBase extends _events2.default {

  /**
   * Request data is passed to this object when constructed. Typically these
   * objects, and their children, are instantiated by its own static MUTATORS
   * and RESOLVERS. They should contain request specific state if any is to
   * be shared.
   *
   * These can be considered request specific controllers for the object in
   * question. The base class takes a single object which should contain all
   * the HTTP/S request data and the graphQLParams is provided as the object
   * { query, variables, operationName, raw }.
   *
   * When used with express-graphql, the requestData object has the format
   * { req, res, gql } where
   *   • req is an Express 4.x request object
   *   • res is an Express 4.x response object
   *   • gql is the graphQLParams object in the format of
   *     { query, variables, operationName, raw }
   *     See https://github.com/graphql/express-graphql for more info
   *
   * @memberof GQLBase
   * @method ⎆⠀constructor
   * @constructor
   *
   * @param {mixed} modelData this, typically an object, although anything
   * really is supported, represents the model data for our GraphQL object
   * instance.
   * @param {Object} requestData see description above
   */
  constructor(modelData = {}, requestData = null, options = { autoProps: true }) {
    super();

    const Class = this.constructor;

    GQLBase.setupModel(this);
    this.setModel(modelData);
    this.requestData = requestData || {};
    this.fileHandler = new _IDLFileHandler.IDLFileHandler(this.constructor);

    if (options && !!options.autoProps !== false) {
      this.applyAutoProps();
    }

    // @ComputedType
    return hasProxy ? new Proxy(this, GQLBase[_PROXY_HANDLER]) : this;
  }

  /**
   * Since reading the Schema for a given GraphQL Lattice type or
   * interface is simple enough, we should be able to automatically
   * apply one to one GraphQL:Model properties.
   *
   * @instance
   * @method ⌾⠀applyAutoProps
   * @memberof GQLBase
   */
  applyAutoProps() {
    if (!this.constructor.SCHEMA || !this.constructor.SCHEMA.length) {
      _utils.LatticeLogs.warn(_utils.joinLines`
        There is no SCHEMA for ${this.constructor.name}!! This will likely
        end in an error. Proceed with caution. Skipping \`applyAutoProps\`
      `);
      return;
    }

    // Individual property getters do not need to be auto-created for enum
    // types. Potentially do some checks for Interfaces and Unions as well
    if (this.constructor.GQL_TYPE === _graphql.GraphQLEnumType) {
      return;
    }

    let Class = this.constructor;
    let tree = _SyntaxTree.SyntaxTree.from(Class.SCHEMA);
    let outline = tree ? tree.outline : {};
    let props = [];

    // $FlowFixMe
    for (let propName of (0, _keys2.default)(outline[Class.name])) {
      // $FlowFixMe
      let hasCustomImpl = typeof this[propName] !== 'undefined';

      if (!hasCustomImpl) {
        props.push(propName);
      }
    }

    if (props.length) {
      _utils.LatticeLogs.info(`Creating auto-props for [${Class.name}]: `, props);
      try {
        (0, _ModelProperties.Properties)(...props)(Class);
      } catch (error) {
        let parsed = /Cannot redefine property: (\w+)/.exec(error.message);
        if (parsed) {
          _utils.LatticeLogs.warn(`Skipping auto-prop '${Class.name}.${parsed[1]}'`);
        } else {
          _utils.LatticeLogs.error(`Failed to apply auto-properties\nReason: `);
          _utils.LatticeLogs.error(error);
        }
      }
    }
  }

  /**
   * Getter for the internally stored model data. The contents of this
   * object are abstracted away behind a `Symbol` key to prevent collision
   * between the underlying model and any GraphQL Object Definition properties.
   *
   * @instance
   * @memberof GQLBase
   * @method ⌾⠀getModel
   * @since 2.5
   *
   * @param {Object} value any object you wish to use as a data store
   */
  getModel() {
    // @ComputedType
    return this[MODEL_KEY];
  }

  /**
   * Setter for the internally stored model data. The contents of this
   * object are abstracted away behind a `Symbol` key to prevent collision
   * between the underlying model and any GraphQL Object Definition properties.
   *
   * @instance
   * @memberof GQLBase
   * @method ⌾⠀setModel
   * @since 2.5
   *
   * @param {Object} value any object you wish to use as a data store
   */
  setModel(value) {
    // @ComputedType
    this[MODEL_KEY] = value;
    return this;
  }

  /**
   * Uses `_.merge()` to modify the internal backing data store for the
   * object instance. This is a shortcut for
   * `_.merge()(instance[MODEL_KEY], ...extensions)`
   *
   * @instance
   * @memberof GQLBase
   * @method ⌾⠀extendModel
   * @since 2.5
   *
   * @param {mixed} extensions n-number of valid `_.merge()` parameters
   * @return {GQLBase} this is returned
   */
  extendModel(...extensions) {
    // $FlowFixMe
    (0, _lodash.merge)(this[MODEL_KEY], ...extensions);
    return this;
  }

  /**
   * A getter that retrieves the inner request data object. When used with
   * GQLExpressMiddleware, this is an object matching {req, res, gql}.
   *
   * @instance
   * @memberof GQLBase
   * @method ⬇︎⠀requestData
   *
   * @return {Object} an object, usually matching { req, res, gql }
   */
  get requestData() {
    // @ComputedType
    return this[REQ_DATA_KEY];
  }

  /**
   * A setter that assigns a value to the inner request data object. When
   * used with GQLExpressMiddleware, this is an object matching {req, res, gql}.
   *
   * @instance
   * @memberof GQLBase
   * @method ⬆︎⠀requestData
   *
   * @param {Object} value an object, usually matching { req, res, gql }
   */
  set requestData(value) {
    // @ComputedType
    this[REQ_DATA_KEY] = value;
  }

  /**
   * Returns the `constructor` name. If invoked as the context, or `this`,
   * object of the `toString` method of `Object`'s `prototype`, the resulting
   * value will be `[object MyClass]`, given an instance of `MyClass`
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof ModuleParser
   *
   * @return {string} the name of the class this is an instance of
   * @ComputedType
   */
  get [_toStringTag2.default]() {
    return this.constructor.name;
  }

  /**
   * Properties defined for GraphQL types in Lattice can be defined as
   * a getter, a function or an async function. In the case of standard
   * functions, if they return a promise they will be handled as though
   * they were async
   *
   * Given the variety of things a GraphQL type can actually be, obtaining
   * its value can annoying. This method tends to lessen that boilerplate.
   * Errors raised will be thrown.
   *
   * @instance
   * @memberof GQLBase
   * @method ⌾⠀getProp
   *
   * @param {string} propName the name of the property in question
   * @param {Array<mixed>} args the arguments array that will be passed
   * to `.apply()` should the property evaluate to a `function`
   * @return {mixed} the return value of any resulting function or
   * value returned by a getter; wrapped in a promise as all async
   * functions do.
   *
   * @throws {Error} errors raised in awaiting results will be thrown
   */
  getProp(propName, ...args) {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      // $FlowFixMe
      let prop = _this[propName];
      let result;

      if (!prop) return null;

      if ((0, _types.typeOf)(prop) === 'AsyncFunction') {
        try {
          result = yield prop.apply(_this, args);
        } catch (error) {
          throw error;
        }
      } else if ((0, _types.typeOf)(prop) === Function.name) {
        result = prop.apply(_this, args);

        if ((0, _types.typeOf)(result) === _promise2.default.name) {
          try {
            result = yield result;
          } catch (error) {
            throw error;
          }
        }
      } else {
        result = prop;
      }

      return result;
    })();
  }

  /**
   * A pass-thru method to the static function of the same name. The
   * difference being that if `requestData` is not specified, the
   * `requestData` object from this instance will be used to build the
   * resolvers in question.
   *
   * @instance
   * @method ⌾⠀getResolver
   * @memberof GQLBase
   *
   * @param {string} resolverName the name of the resolver as a string
   * @param {Object} requestData the requestData used to build the
   * resolver methods from which to choose
   * @return {Function} returns either a `function` representing the
   * resolver requested or null if there wasn't one to be found
   */
  getResolver(resolverName, requestData) {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      return _this2.constructor.getResolver(resolverName, requestData || _this2.requestData);
    })();
  }

  /**
   * Resolvers are created in a number of different ways. OOP design
   * dictates that instances of a created class will handle field
   * resolvers, but query, mutation and subscription resolvers are
   * typically what creates these instances.
   *
   * Since a resolver can be created using `@mutator/@subscriptor/@resolver`
   * or via method on a object returned from `RESOLVERS()`, `MUTATORS()` or
   * `SUBSCRIPTIONS()`, there should be an easy to use way to fetch a
   * resolver by name; if for nothing else, code reuse.
   *
   * Pass the name of the resolver to the function and optionally pass a
   * requestData object. The `getMergedRoot()` method will build an object
   * containing all the root resolvers for the type, bound to the supplied
   * `requestData` object. It is from this object that `resolverName` will
   * be used to fetch the function in question. If one exists, it will be
   * returned, ready for use. Otherwise, null will be your answer.
   *
   *
   * @static
   * @method ⌾⠀getResolver
   * @memberof GQLBase
   *
   * @param {string} resolverName the name of the resolver as a string
   * @param {Object} requestData the requestData used to build the
   * resolver methods from which to choose
   * @return {Function} returns either a `function` representing the
   * resolver requested or null if there wasn't one to be found
   */
  static getResolver(resolverName, requestData) {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const reqData = requestData || null;
      const rootObj = yield _this3.getMergedRoot(reqData);

      return rootObj[resolverName] || null;
    })();
  }

  /**
   * Until such time as the reference implementation of Facebook's GraphQL
   * SDL AST parser supports comments, or until we take advantage of Apollo's
   * AST parser, this is how comments will be applied to a built schema.
   *
   * Several constants are defined on the GQLBase object itself, and thereby
   * all its subclasses. They pertain to how to define description fields
   * for various parts of your GQL implementation.
   *
   * ```
   * // To define a description on the top level class
   * [this.DOC_CLASS]: string
   *
   * // To define a description on a field (getter, function or async function)
   * [this.DOC_FIELDS]: {
   *   fieldName: string
   * }
   *
   * // To define a description on a query, mutation or subscription field
   * [this.DOC_QUERIES || this.DOC_MUTATORS || this.DOC_SUBSCRIPTIONS]: {
   *   fieldName: string
   * }
   * ```
   *
   * To make writing code easier, the `joinLines()` template function is
   * available so your source code can look nice and neat and your descriptions
   * won't get annoying line breaks and spaces as part of that process.
   *
   * @static
   * @memberof GQLBase
   * @method apiDocs
   *
   * @return {Object} an object with various keys and values denoting
   * description fields that should be applied to the final schema object
   */
  static apiDocs() {
    return {
      [this.DOC_CLASS]: _utils.joinLines`
        GQLBase class implementation. GQLBase is the root class used in
        graphql-lattice to describe a GraphQLObjectType. If you are reading
        this, the person using lattice failed to provide documentation for
        their type. :)
      `,

      [this.DOC_QUERY]: _utils.joinLines`
        ## Welcome to GraphQL Lattice
        **Query**

        You will want to define a \`DOC_QUERY\` apiDoc comment with something
        more meaningful to your particular Schema here.
      `,

      [this.DOC_MUTATION]: _utils.joinLines`
        ## Welcome to GraphQL Lattice
        **Mutation**

        You will want to define a \`DOC_MUTATION\` apiDoc comment with
        something more meaningful to your particular Schema here.
      `,

      [this.DOC_SUBSCRIPTION]: _utils.joinLines`
        ## Welcome to GraphQL Lattice
        **Subscription**

        You will want to define a \`DOC_SUBSCRIPTION\` apiDoc comment with
        something more meaningful to your particular Schema here.
      `,

      [this.DOC_FIELDS]: {
        // fieldName: `fieldDescription`,
      },

      [this.DOC_QUERIES]: {
        // queryName: `queryDescription`,
      },

      [this.DOC_MUTATORS]: {
        // mutatorName: `mutatorDescription`
      },

      [this.DOC_SUBSCRIPTIONS]: {
        // subscriptionName: `subscriptionDescription`
      }
    };
  }

  /**
   * Defined in a base class, this getter should return either a String
   * detailing the full IDL schema of a GraphQL handler or one of two
   * types of Symbols.
   *
   * The first Symbol type is the constant `ADJACENT_FILE`. If this Symbol is
   * returned, the system assumes that next to the source file in question is
   * a file of the same name with a .graphql extension. This file should be
   * made of the GraphQL IDL schema definitions for the object types being
   * created.
   *
   * Example:
   * ```js
   *   static get SCHEMA(): string | Symbol {
   *     return GQLBase.ADJACENT_FILE
   *   }
   * ```
   *
   * The primary advantage of this approach is allowing an outside editor that
   * provides syntax highlighting rather than returning a string from the
   * SCHEMA getter.
   *
   * Alternatively, the static method IDLFilePath can be used to point to an
   * alternate location where the GraphQL IDL file resides. The extension can
   * also be changed from .graphql to something else if need be using this
   * method.
   *
   * Example:
   * ```js
   *   static get SCHEMA(): string | Symbol {
   *     return GQLBase.IDLFilePath('/path/to/file', '.idl')
   *   }
   * ```
   *
   * @instance
   * @memberof GQLBase
   * @method ⬇︎⠀SCHEMA
   * @readonly
   * @static
   *
   * @return {string|Symbol} a valid IDL string or one of the Symbols
   * described above.
   *
   * @see {@link GQLBase#ADJACENT_FILE}
   * @see {@link GQLBase#IDLFilePath}
   */
  static get SCHEMA() {
    return '';
  }

  /**
   * This method should return a promise that resolves to an object of
   * functions matching the names of the mutation operations. These are to be
   * injected into the root object when used by `GQLExpressMiddleware`.
   *
   * @instance
   * @memberof GQLBase
   * @method ⌾⠀MUTATORS
   * @readonly
   * @static
   *
   * @param {Object} requestData typically an object containing three
   * properties; {req, res, gql}
   * @return {Promise} a promise that resolves to an object; see above for more
   * information.
   */
  static MUTATORS(requestData) {
    return (0, _asyncToGenerator3.default)(function* () {
      // define in base class
      return {};
    })();
  }

  /**
   * This method should return a promise that resolves to an object of
   * functions matching the names of the query operations. These are to be
   * injected into the root object when used by `GQLExpressMiddleware`.
   *
   * @instance
   * @memberof GQLBase
   * @method ⌾⠀RESOLVERS
   * @readonly
   * @static
   *
   * @param {Object} requestData typically an object containing three
   * properties; {req, res, gql}
   * @return {Promise} a promise that resolves to an object; see above for more
   * information.
   */
  static RESOLVERS(requestData) {
    return (0, _asyncToGenerator3.default)(function* () {
      // define in base class
      return {};
    })();
  }

  /**
   * @see {@link GQLBase#SCHEMA}
   *
   * @memberof GQLBase
   * @method ⬇︎⠀ADJACENT_FILE
   * @static
   * @const
   *
   * @return {Symbol} the Symbol, when returned from SCHEMA, causes
   * the logic to load an IDL Schema from an associated file with a .graphql
   * extension and bearing the same name.
   */
  static get ADJACENT_FILE() {
    return (0, _for2.default)('.graphql file located adjacent to source');
  }

  /**
   * Determines the default type targeted by this GQLBase class. Any
   * type will technically be valid but only will trigger special behavior
   *
   * @memberof GQLBase
   * @method ⬇︎⠀GQL_TYPE
   * @static
   * @const
   *
   * @return {Function} a type, such as `GraphQLObjectType` or
   * `GraphQLInterfaceType`
   */
  static get GQL_TYPE() {
    return _graphql.GraphQLObjectType;
  }

  /**
   * Creates an appropriate Symbol crafted with the right data for use by
   * the IDLFileHandler class below.
   *
   * @static
   * @memberof GQLBase
   * @method ⌾⠀IDLFilePath
   *
   * @param {string} path a path to the IDL containing file
   * @param {string} [extension='.graphql'] an extension, including the
   * prefixed period, that will be added to the supplied path should it not
   * already exist.
   * @return Symbol
   *
   * @see {@link GQLBase#SCHEMA}
   */
  static IDLFilePath(path, extension = '.graphql') {
    return (0, _for2.default)(`Path ${path} Extension ${extension}`);
  }

  /**
   * A file handler for fetching the IDL schema string from the file system
   * for those `GQLBase` extended classes that have indicated to do so by
   * returning a `Symbol` for their `SCHEMA` property.
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀handler
   *
   * @return {IDLFileHandler} instance of IDLFileHandler, created if one does
   * not already exist, for fetching the contents from disk.
   */
  static get handler() {
    const key = (0, _for2.default)(`${_IDLFileHandler.IDLFileHandler.name}.${this.name}`);

    // @ComputedType
    if (!this[key]) {
      // @ComputedType
      this[key] = new _IDLFileHandler.IDLFileHandler(this);
    }

    // @ComputedType
    return this[key];
  }

  /**
   * Returns the module object where your class is created. This needs to be
   * defined on your class, as a static getter, in the FILE where you are
   * defining your Class definition.
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀module
   * @const
   *
   * @return {Object} the reference to the module object defined and injected
   * by node.js' module loading system.
   *
   * @see https://nodejs.org/api/modules.html
   */
  static get module() {
    return module;
  }

  /**
   * The internal data model has some custom `EventEmitter` code wrapped
   * it here. When the data model is set via `setModel` or by accessing it
   * via `instance[MODEL_KEY]`, an event `EVENT_MODEL_SET` is emitted. Any
   * listener listening for this event receives an object with two keys
   * ```
   * {
   *   model: The actual model being set; changes are persisted
   *   instance: The GQLBase instance the model is associated with
   * }
   * ```
   *
   * Subsequently, the events `EVENT_MODEL_PROP_CHANGE` and
   * `EVENT_MODEL_PROP_DELETE` can be listened to if your version of node
   * supports Proxy objects. They allow you to be notified whenever your
   * model has a property changed or deleted, respectively.
   *
   * The callback for `change` receives an object with four properties
   * ```
   * {
   *   model: The model object the value is being changed on
   *   old: The old value being replaced; undefined if it is the first time
   *   key: The property key for the value being changed
   *   value: The new value being set
   * }
   * ```
   *
   * The callback for `delete` receives an object with four properties
   * ```
   * {
   *   model: The model object the value is deleted from
   *   key: The property key for the deleted value
   *   deleted: The deleted value
   * }
   * ```
   *
   * @static
   * @memberof GQLBase
   * @method ⌾⠀setupModel
   *
   * @param {GQLBase} instance typically `this` as passed in from a call in
   * the constructor
   */
  static setupModel(instance) {
    const changeHandler = {
      /**
       * Proxy set() handler. This is where the change events are fired from
       *
       * @method GQLBase~set
       * @param {Object} target the `GQLBase` model object
       * @param {string} key the property name
       * @param {mixed} value the new property value
       */
      set(target, key, value) {
        const old = target[key];

        target[key] = value;
        instance.emit(GQLBase.EVENT_MODEL_PROP_CHANGE, {
          model: target,
          old,
          key,
          value
        });
      },

      /**
       * Proxy deleteProperty() handler. This is where the delete property
       * events are fired from
       *
       * @method GQLBase~deleteProperty
       * @param {Object} target the `GQLBase` model object
       * @param {string} key the property name
       */
      deleteProperty(target, key) {
        const deleted = target[key];

        delete target[key];
        instance.emit(GQLBase.EVENT_MODEL_PROP_DELETE, {
          model: target,
          key,
          deleted
        });
      }
    };

    /**
     * 'Publicly' the Symbol for accessing the `GQLBase` model is `MODEL_KEY`.
     * In truth it is stored under a Symbol defined in `setupModel` and
     * referred to as `_MODEL_KEY` in this code. This is done so a getter and
     * setter can be wrapped around the usage of the instance's data model.
     *
     * When being read, if `Proxy` exists in the node environment and if there
     * are any registered `EVENT_MODEL_PROP_CHANGE` or `EVENT_MODEL_PROP_DELETE`
     * events, then the returned model is a Proxy around the real model that
     * allows us to capture the changes and deletion of keys
     *
     * When being assigned, the event `EVENT_MODEL_WILL_BE_SET` and the event
     * `EVENT_MODEL_HAS_BEEN_SET` are emitted to allow listeners to modify and
     * see the final data around the setting of a model object. Both events
     * receive an object with two keys
     *
     * ```
     * {
     *   model: The object being or having been set
     *   instance: The GQLBase instance receiving the model
     * }
     * ```
     */
    (0, _defineProperty2.default)(instance, MODEL_KEY, {
      get: function () {
        let model = this[_MODEL_KEY];
        let hasListeners = this.listenerCount(GQLBase.EVENT_MODEL_PROP_CHANGE) + this.listenerCount(GQLBase.EVENT_MODEL_PROP_DELETE);

        if (hasProxy && hasListeners) {
          model = new Proxy(model, changeHandler);
        }

        return model;
      },

      set: function (model) {
        const instance = this;

        this.emit(GQLBase.EVENT_MODEL_WILL_BE_SET, { model, instance });
        instance[_MODEL_KEY] = model;
        this.emit(GQLBase.EVENT_MODEL_HAS_BEEN_SET, { model, instance });
      }
    });
  }

  /**
   * If ES6 Proxies are supported in your execution environment, all GQLBase
   * extended classes are also proxies. By default the internal proxy handler
   * provides backwards compatibility with the removal of the default getters
   * and setters for the 'model' property as long as you do not define a
   * top level 'model' property of your own.
   *
   * @method ⬇︎⠀[_PROXY_HANDLER]
   * @memberof GQLBase
   * @static
   * @const
   * @since 2.5.0
   *
   * @type {Object}
   * @ComputedType
   */
  static get [_PROXY_HANDLER]() {
    return {
      get(target, key, lastResult) {
        const model = target[_MODEL_KEY];

        // Allow backwards compatibility for 'model' property if one is not
        // explicitly defined on your instance.
        if (notDefined('model', key, target)) {
          // Be sure to use the public MODEL_KEY to ensure events fire
          return target[MODEL_KEY];
        }

        return target[key];
      }
    };
  }

  /**
   * Applies the same logic as {@link #[Symbol.toStringTag]} but on a static
   * scale. So, if you perform `Object.prototype.toString.call(MyClass)`
   * the result would be `[object MyClass]`.
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof ModuleParser
   * @static
   *
   * @return {string} the name of this class
   * @ComputedType
   */
  static get [_toStringTag2.default]() {
    return this.name;
  }

  /**
   * A constant used to register an event listener for when the internal
   * model object is assigned a new value. This event fires before the model
   * is set. Changes to the model value at this point will affect the contents
   * before the value assignment takes place.
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀EVENT_MODEL_WILL_BE_SET
   * @const
   *
   * @type {string}
   */
  static get EVENT_MODEL_WILL_BE_SET() {
    return 'E: Int. model will be set';
  }

  /**
   * A constant used to register an event listener for when the internal
   * model object is assigned a new value. This event fires after the model
   * is set.
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀EVENT_MODEL_HAS_BEEN_SET
   * @const
   *
   * @type {string}
   */
  static get EVENT_MODEL_HAS_BEEN_SET() {
    return 'E: Int. model has been set';
  }

  /**
   * A constant used to register an event listener for when a property of the
   * internal model object is set to a new or intial value.
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀EVENT_MODEL_PROP_CHANGE
   * @const
   *
   * @type {string}
   */
  static get EVENT_MODEL_PROP_CHANGE() {
    return 'E: Int. model prop changed';
  }

  /**
   * A constant used to register an event listener for when a property of the
   * internal model object has been deleted. This event fires after the value
   * has been deleted.
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀EVENT_MODEL_PROP_DELETE
   * @const
   *
   * @type {string}
   */
  static get EVENT_MODEL_PROP_DELETE() {
    return 'E: Int. model prop deleted';
  }

  /**
   * A constant key used to identify a comment for a class description
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀DOC_CLASS
   * @const
   *
   * @type {string}
   */
  static get DOC_CLASS() {
    return 'class';
  }

  /**
   * A constant key used to identify a comment for a type field description
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀DOC_FIELDS
   * @const
   *
   * @type {string}
   */
  static get DOC_FIELDS() {
    return 'fields';
  }

  /**
   * A constant key used to identify a comment for the top level query
   * description
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀DOC_QUERY
   * @const
   *
   * @type {string}
   */
  static get DOC_QUERY() {
    return 'query';
  }

  /**
   * A constant key used to identify a comment for a query description
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀DOC_QUERIES
   * @const
   *
   * @type {string}
   */
  static get DOC_QUERIES() {
    return 'queries';
  }

  /**
   * A constant key used to identify a comment for the top level mutation
   * description
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀DOC_MUTATION
   * @const
   *
   * @type {string}
   */
  static get DOC_MUTATION() {
    return 'mutation';
  }

  /**
   * A constant key used to identify a comment for a mutator description
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀DOC_MUTATORS
   * @const
   *
   * @type {string}
   */
  static get DOC_MUTATORS() {
    return 'mutators';
  }

  /**
   * A constant key used to identify a comment for the top level subscription
   * description
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀DOC_SUBSCRIPTION
   * @const
   *
   * @type {string}
   */
  static get DOC_SUBSCRIPTION() {
    return 'subscription';
  }

  /**
   * A constant key used to identify a comment for a subscription description
   *
   * @static
   * @memberof GQLBase
   * @method ⬇︎⠀DOC_SUBSCRIPTIONS
   * @const
   *
   * @type {string}
   */
  static get DOC_SUBSCRIPTIONS() {
    return 'subscriptions';
  }

  /**
   * A shortcut to the utils/joinLines function to make it easier to get
   * the tools to write docs for your types in a friendly fashion.
   *
   * @memberof GQLBase
   * @method ⬇︎⠀joinLines
   * @static
   * @const
   *
   * @type {Function}
   */
  static get joinLines() {
    return _utils.joinLines;
  }

  /**
   * An simple pass-thru method for fetching a types merged root object.
   *
   * @method ⌾⠀getMergedRoot
   * @memberof GQLBase
   * @static
   *
   * @param {Object} requestData an object containing the request data such as
   * request, response or graphql context info that should be passed along to
   * each of the resolver creators
   * @return {Object} the merged root object with all the query, mutation and
   * subscription resolvers defined and created within.
   */
  static getMergedRoot(requestData, separateByType = false) {
    var _this4 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      const root = {};
      const Class = _this4;

      let _ = {
        // $FlowFixMe
        resolvers: Class[META_KEY].resolvers || [],
        // $FlowFixMe
        mutators: Class[META_KEY].mutators || [],
        // $FlowFixMe
        subscriptors: Class[META_KEY].subscriptors || []
      };

      let convert = function (f) {
        return { [f.name]: f.bind(Class, requestData) };
      };
      let reduce = function (p, c) {
        return (0, _lodash.merge)(p, c);
      };

      _.resolvers = _.resolvers.map(convert).reduce(reduce, {});
      _.mutators = _.mutators.map(convert).reduce(reduce, {});
      _.subscriptors = _.subscriptors.map(convert).reduce(reduce, {});

      if (separateByType) {
        // Apollo wants all the resolvers to grouped by top level type.
        // The field resolvers aren't an issue in Lattice defined types
        // but the root types do need to be sorted; so let's do that here
        (0, _lodash.merge)(root, { Query: yield Class.RESOLVERS(requestData) }, { Mutation: yield Class.MUTATORS(requestData) }, { Query: _.resolvers }, { Mutation: _.mutators }, { Subscription: _.subscriptors });

        // When using lattice with apollo server, it is quite particular about
        // empty Query, Mutation or Subscription resolver maps.
        if (!(0, _keys2.default)(root.Query).length) delete root.Query;
        if (!(0, _keys2.default)(root.Mutation).length) delete root.Mutation;
        if (!(0, _keys2.default)(root.Subscription).length) delete root.Subscription;
      } else {
        (0, _lodash.merge)(root, (yield Class.RESOLVERS(requestData)), (yield Class.MUTATORS(requestData)), _.resolvers, _.mutators, _.subscriptors);
      }

      return root;
    })();
  }

  /**
   * An object used to store data used by decorators and other internal
   * proccesses.
   * @ComputedType
   */
  static get [META_KEY]() {
    let storage = this[(0, _for2.default)(this.name)];

    if (!storage) {
      storage = this[(0, _for2.default)(this.name)] = {};
    }

    return storage;
  }
};
exports.default = GQLBase;
//# sourceMappingURL=GQLBase.js.map