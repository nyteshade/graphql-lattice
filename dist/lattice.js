(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 96);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(45)('wks')
  , uid        = __webpack_require__(30)
  , Symbol     = __webpack_require__(3).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , core      = __webpack_require__(0)
  , ctx       = __webpack_require__(13)
  , hide      = __webpack_require__(8)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(12)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(7)
  , IE8_DOM_DEFINE = __webpack_require__(66)
  , toPrimitive    = __webpack_require__(43)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(4) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IDLFileHandler = exports.GQLBase = exports.REQ_DATA_KEY = exports.MODEL_KEY = undefined;

var _defineProperty = __webpack_require__(73);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _asyncToGenerator2 = __webpack_require__(25);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toStringTag = __webpack_require__(57);

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _assign = __webpack_require__(28);

var _assign2 = _interopRequireDefault(_assign);

var _for = __webpack_require__(17);

var _for2 = _interopRequireDefault(_for);

exports.notDefined = notDefined;

var _path = __webpack_require__(39);

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(58);

var _fs2 = _interopRequireDefault(_fs);

var _utils = __webpack_require__(59);

var _types = __webpack_require__(9);

var _SyntaxTree = __webpack_require__(29);

var _graphql = __webpack_require__(10);

var _events = __webpack_require__(61);

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
  constructor(modelData = {}, requestData = null) {
    super();

    const Class = this.constructor;

    GQLBase.setupModel(this);
    this.setModel(modelData);
    this.requestData = requestData || {};
    this.fileHandler = new IDLFileHandler(this.constructor);

    // @ComputedType
    return hasProxy ? new Proxy(this, GQLBase[_PROXY_HANDLER]) : this;
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
   * Uses `Object.assign` to modify the internal backing data store for the
   * object instance. This is a shortcut for
   * `Object.assign(instance[MODEL_KEY], ...extensions)`
   *
   * @instance
   * @memberof GQLBase
   * @method ⌾⠀extendModel
   * @since 2.5
   *
   * @param {mixed} extensions n-number of valid `Object.assign` parameters
   * @return {GQLBase} this is returned
   */
  extendModel(...extensions) {
    // $FlowFixMe
    (0, _assign2.default)(this[MODEL_KEY], ...extensions);
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
   * @deprecated Place all resolvers in RESOLVERS()
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
    const key = (0, _for2.default)(`${IDLFileHandler.name}.${this.name}`);

    // @ComputedType
    if (!this[key]) {
      // @ComputedType
      this[key] = new IDLFileHandler(this);
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
       * @method set
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
       * @method deleteProperty
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
      get: function get() {
        let model = this[_MODEL_KEY];
        let hasListeners = this.listenerCount(GQLBase.EVENT_MODEL_PROP_CHANGE) + this.listenerCount(GQLBase.EVENT_MODEL_PROP_DELETE);

        if (hasProxy && hasListeners) {
          model = new Proxy(model, changeHandler);
        }

        return model;
      },

      set: function set(model) {
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
};

/**
 * The handler, an instance of which is created for every instance of GQLBase.
 * The handler manages the fetching and decoding of files bearing the IDL
 * schema associated with the class represented by this instance of GQLBase.
 *
 * @class IDLFileHandler
 */

let IDLFileHandler = exports.IDLFileHandler = class IDLFileHandler {

  /**
   * The IDLFileHandler checks the SCHEMA value returned by the class type
   * of the supplied instance. If the resulting value is a Symbol, then the
   * handler's responsibility is to find the file, load it from disk and
   * provide various means of using its contents; i.e. as a Buffer, a String
   * or wrapped in a SyntaxTree instance.
   *
   * @memberof IDLFileHandler
   * @method ⎆⠀constructor
   * @constructor
   *
   * @param {Function} Class a function or class definition that presumably
   * extends from GQLBase were it an instance.
   */
  constructor(Class) {
    // $FlowFixMe
    const symbol = typeof Class.SCHEMA === 'symbol' && Class.SCHEMA || null;
    const pattern = /Symbol\(Path (.*?) Extension (.*?)\)/;

    if (symbol) {
      let symbolString = symbol.toString();

      if (symbol === Class.ADJACENT_FILE) {
        if (Class.module === module) {
          throw new Error(`
            The a static getter for 'module' on ${Class.name} must be present
            that returns the module object where the Class is defined. Try the
            following:

            // your ${Class.name}.js file
            import { GQLBase } from 'graphql-lattice'

            const ${Class.name}Module = module;

            class ${Class.name} extends GQLBase {
              ...

              static get module() {
                return ${Class.name}Module;
              }
            }

          `);
        }

        const filename = Class.module.filename;
        const extension = _path2.default.extname(filename);
        const dir = _path2.default.dirname(filename);
        const filefixed = _path2.default.basename(filename, extension);
        const build = _path2.default.resolve(_path2.default.join(dir, `${filefixed}.graphql`));

        this.path = build;
        this.extension = '.graphql';
      } else if (pattern.test(symbolString)) {
        const parsed = pattern.exec(symbolString);
        const extension = parsed[2] || '.graphql';
        const dir = _path2.default.dirname(parsed[1]);
        const file = _path2.default.basename(parsed[1], extension);
        const build = _path2.default.resolve(_path2.default.join(dir, `${file}${extension}`));

        this.path = build;
        this.extension = extension;
      }
    } else {
      this.path = this.extension = null;
    }
  }

  /**
   * Loads the calculated file determined by the decoding of the meaning of
   * the Symbol returned by the SCHEMA property of the instance supplied to
   * the IDLFileHandler upon creation.
   *
   * @instance
   * @memberof IDLFileHandler
   * @method ⌾⠀getFile
   *
   * @return {Buffer|null} returns the Buffer containing the file base IDL
   * schema or null if none was found or a direct string schema is returned
   * by the SCHEMA property
   */
  getFile() {
    return _fs2.default.readFileSync(String(this.path));
  }

  /**
   * If getFile() returns a Buffer, this is the string representation of the
   * underlying file contents. As a means of validating the contents of the
   * file, the string contents are parsed into an AST and back to a string.
   *
   * @instance
   * @memberof IDLFileHandler
   * @method ⌾⠀getSchema
   *
   * @return {string|null} the string contents of the Buffer containing the
   * file based IDL schema.
   */
  getSchema() {
    if (!this.path) {
      return null;
    }

    const tree = this.getSyntaxTree();

    return tree.toString();
  }

  /**
   * If getFile() returns a Buffer, the string contents are passed to a new
   * instance of SyntaxTree which parses this into an AST for manipulation.
   *
   * @instance
   * @memberof IDLFileHandler
   * @method ⌾⠀getSyntaxTree
   *
   * @return {SyntaxTree|null} a SyntaxTree instance constructed from the IDL
   * schema contents loaded from disk. Null is returned if a calculated path
   * cannot be found; always occurs when SCHEMA returns a string.
   */
  getSyntaxTree() {
    const buffer = this.getFile();
    const tree = new _SyntaxTree.SyntaxTree(buffer.toString());

    return tree;
  }

  /**
   * Returns the `constructor` name. If invoked as the context, or `this`,
   * object of the `toString` method of `Object`'s `prototype`, the resulting
   * value will be `[object MyClass]`, given an instance of `MyClass`
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof IDLFileHandler
   *
   * @return {string} the name of the class this is an instance of
   * @ComputedType
   */
  get [_toStringTag2.default]() {
    return this.constructor.name;
  }

  /**
   * Applies the same logic as {@link #[Symbol.toStringTag]} but on a static
   * scale. So, if you perform `Object.prototype.toString.call(MyClass)`
   * the result would be `[object MyClass]`.
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof IDLFileHandler
   * @static
   *
   * @return {string} the name of this class
   * @ComputedType
   */
  static get [_toStringTag2.default]() {
    return this.name;
  }
};
exports.default = GQLBase;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(107)(module)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(5)
  , createDesc = __webpack_require__(22);
module.exports = __webpack_require__(4) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PRIMITIVES = exports.NULL = exports.UNDEFINED = exports.isClass = exports.isOfType = exports.isValue = exports.isPrimitive = exports.isUndefined = exports.isNull = exports.isRegExp = exports.isNumber = exports.isString = exports.isObject = exports.isDate = exports.isArray = exports.isFunction = undefined;

var _for = __webpack_require__(17);

var _for2 = _interopRequireDefault(_for);

var _symbol = __webpack_require__(82);

var _symbol2 = _interopRequireDefault(_symbol);

var _set = __webpack_require__(60);

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = __webpack_require__(133);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

exports.typeOf = typeOf;
exports.isNativeClassByProps = isNativeClassByProps;
exports.isNativeClassByString = isNativeClassByString;
exports.extendsFrom = extendsFrom;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @namespace types */


/**
 * One common way to determine the type of class that you are working with, 
 * in a fairly compatible manner, is to use .call or .apply on the function 
 * toString of the Object.prototype.
 *
 * Calling `Object.prototype.toString.call('hello')` will yield 
 * `"[object String]"` as an answer. This technique is fairly sound but is 
 * also fairly verbose to use often. This function extracts the detected value 
 * name from the above string; so "String" from "[object String]" and so forth. 
 *
 * The added advantage of using this method is that it works well with direct 
 * name comparisons, such as `typeOf("asdfas") === String.name`. The new 
 * `Symbol.toStringTag` allows you to define custom values that are 
 * reflected in this manner.
 * 
 * @method ⌾⠀typeOf
 * @memberof types
 * @inner
 * 
 * @param {mixed} object any value is acceptable here, including null and 
 * undefined
 * @return {string} for objects of type [object String] the value "String"
 * will be returned.
 */
function typeOf(object) {
  return (/(\b\w+\b)\]/.exec(Object.prototype.toString.call(object))[1]
  );
}

/**
 * Returns true if the type supplied evaluates to `[object Function]`
 * 
 * @method ⌾⠀isFunction 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isFunction = exports.isFunction = obj => typeOf(obj) === Function.name;

/**
 * Returns true if the type supplied evaluates to `[object Array]`
 * 
 * @method ⌾⠀isArray 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isArray = exports.isArray = obj => typeOf(obj) === Array.name;

/**
 * Returns true if the type supplied evaluates to `[object Date]`
 * 
 * @method ⌾⠀isDate 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isDate = exports.isDate = obj => typeOf(obj) === Date.name;

/**
 * Returns true if the type supplied evaluates to `[object Object]`
 * 
 * @method ⌾⠀isObject 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isObject = exports.isObject = obj => typeOf(obj) === Object.name;

/**
 * Returns true if the type supplied evaluates to `[object String]`
 * 
 * @method ⌾⠀isString 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isString = exports.isString = obj => typeOf(obj) === String.name;

/**
 * Returns true if the type supplied evaluates to `[object Number]`
 * 
 * @method ⌾⠀isNumber 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isNumber = exports.isNumber = obj => typeOf(obj) === isNumber.name;

/**
 * Returns true if the type supplied evaluates to `[object RegExp]`
 * 
 * @method ⌾⠀isRegExp 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isRegExp = exports.isRegExp = obj => typeOf(obj) === RegExp.name;

/**
 * Returns true if the type supplied evaluates to `[object Null]`
 * 
 * @method ⌾⠀isNull 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isNull = exports.isNull = obj => typeOf(obj) === NULL;

/**
 * Returns true if the type supplied evaluates to `[object Undefined]`
 * 
 * @method ⌾⠀isUndefined 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isUndefined = exports.isUndefined = obj => typeOf(obj) === UNDEFINED;

/**
 * Determines if the resulting type is one of the six types of primitives
 * (according to MDN; https://goo.gl/USmkUU). If it is, true will be returned;
 * otherwise false.
 *
 * @method ⌾⠀isPrimitive
 * @memberof types
 * @inner
 *
 * @param {mixed} obj given any value, it will return true if it is a primitive 
 * @return {Boolean} true if not one of Boolean, Null, Undefined, Number, 
 * String or Symbol. 
 */
// $ComputedType
const isPrimitive = exports.isPrimitive = obj => PRIMITIVES.has(obj);

/**
 * Returns true if the type supplied evaluates to neither `[object Object]`
 * nor `[object Array]`. 
 * 
 * @method ⌾⠀isValue 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isValue = exports.isValue = obj => !isObject(obj) && !isArray(obj);

/**
 * A shorthand way to test an object's declared toString type to a supplied 
 * string or Function/Class. Realistically, this checks typeOf(obj) to both 
 * T and T.name. If either are true, then true is returned; false otherwise.
 * 
 * @method ⌾⠀isOfType 
 * @memberof types
 * @inner
 * 
 * @param {mixed} obj any object that can be passed to Object.prototype.toString
 * @param {Function} T the type you wish to test for. Ideally this should be 
 * a class/function 
 * @return {Boolean} true if it passes the test, false otherwise
 */
const isOfType = exports.isOfType = (obj, T) => typeOf(obj) === T || typeOf(obj) === T.name;

/**
 * Returns true if the supplied obj is a ECMAScript class definition. It first 
 * checks by examining the properties of the supplied class. Secondly it checks 
 * by searching the toString() method of the 'function' for the term class. If 
 * either are true, then true is returned; false is returned otherwise.
 *
 * NOTE Relying on this strictly, especially when used with other libraries
 * can cause some problems down the line, especially if the code wraps a class 
 * instance like react-jss or other similar use cases. Use at your own peril.
 *
 * @method ⌾⠀isClass
 * @memberof types
 * @inner
 *
 * @param {mixed} obj any object who's type is to be compared as a class
 * @return {boolean} true if the obj is an ECMAScript class object; not an 
 * instance. False otherwise. 
 *
 * @see #isNativeClassByProps
 * @see #isNativeClassByString
 */
const isClass = exports.isClass = obj => isNativeClassByProps(obj) || isNativeClassByString(obj);

/**
 * isNativeClass method taken from code submitted on stackoverflow. Logic and 
 * basis for the test appears there. See URL below for follow up if desired.
 *
 * @see  https://stackoverflow.com/questions/29093396/how-do-you-check-the-difference-between-an-ecmascript-6-class-and-function#32235645
 * 
 * @method ⌾⠀isNativeClassByProps
 * @memberof types
 * @inner
 * 
 * @param {mixed} thing any type of JavaScript value to test
 * @return {boolean} true if it is a ECMAScript class by testing properties;
 * false otherwise
 */
function isNativeClassByProps(thing) {
  return typeof thing === 'function' && thing.hasOwnProperty('prototype') && !thing.hasOwnProperty('arguments');
}

/**
 * isNativeClass method taken from code submitted on stackoverflow. Logic and 
 * basis for the test appears there. See URL below for follow up if desired.
 *
 * @see  https://stackoverflow.com/questions/29093396/how-do-you-check-the-difference-between-an-ecmascript-6-class-and-function#32235645
 * 
 * @method ⌾⠀isNativeClassByString
 * @memberof types
 * @inner
 * 
 * @param {mixed} thing any type of JavaScript value to test
 * @return {Boolean} true if it is a ECMAScript class by testing properties;
 * false otherwise
 */
function isNativeClassByString(value) {
  return typeof value === 'function' && value.toString().indexOf('class') === 0;
}

/**
 * NOTE This function will not work on nodejs versions less than 6 as Reflect 
 * is needed natively.
 * 
 * The instanceof keyword only works on instances of an object and not on 
 * the class objects the instances are created from.
 *
 * ```js
 * class A {}
 * class B extends A {}
 *
 * let a = new A();
 * let b = new B();
 *
 * b instanceof A; // true
 * a instanceof A; // true
 * B instanceof A; // false
 * ```
 *
 * Therefore the extendsFrom function checks this relationship at the class 
 * level and not at the instance level.
 *
 * ```js
 * import { extendsFrom } from '...'
 * 
 * class A {}
 * class B extends A {}
 * class C extends B {}
 *
 * extendsFrom(A, A); // true
 * extendsFrom(B, A); // true
 * extendsFrom(C, A); // true
 * extendsFrom(C, 1); // false
 * extendsFrom(B, null); // false
 * ```
 * 
 * @method ⌾⠀extendsFrom
 * @memberof types
 * @inner
 * 
 * @param {Function} TestedClass the class of which to test heredity 
 * @param {Function} RootClass the ancestor to test for
 * @param {Boolean} enforceClasses if true, false by default, an additional 
 * runtime check for the type of the supplied Class objects will be made. If 
 * either is not a Function, an error is thrown. 
 * @return {Boolean} true if the lineage exists; false otherwise 
 *
 * @see types#isClass 
 */
function extendsFrom(TestedClass, RootClass, enforceClasses = false) {
  TestedClass = TestedClass.constructor && typeof TestedClass !== 'function' ? TestedClass.constructor : TestedClass;

  RootClass = RootClass.constructor && typeof RootClass !== 'function' ? RootClass.constructor : RootClass;

  let ParentClass = TestedClass;

  if (parseInt(process.version.substring(1)) < 6) {
    throw new Error(`
      Reflect must be implemented in the JavaScript engine. This cannot be
      polyfilled and as such, if process.version is less than 6 an error will
      be thrown. Please try an alternate means of doing what you desire.
    `);
  }

  if (enforceClasses) {
    if (!isClass(TestedClass) && !isClass(RootClass)) {
      throw new Error(`
        When using extendsFrom() with enforceClasses true, each Function 
        argument supplied must pass the isClass() method testing. See the 
        function isClass to learn more about these requirements.
      `);
    }
  }

  if (!TestedClass || !RootClass) {
    return false;
  }
  if (TestedClass === RootClass) {
    return true;
  }

  do {
    ParentClass = (0, _getPrototypeOf2.default)(ParentClass);

    if (ParentClass === RootClass) {
      return true;
    }
  } while (ParentClass);

  return false;
}

/**
 * Programmatic constant defintion of the result of a call to 
 * `typeOf(undefined)`.
 *
 * @memberof types
 * @type {string}
 * @const 
 */
const UNDEFINED = exports.UNDEFINED = typeOf(undefined);

/**
 * Programmatic constant defintion of the result of a call to 
 * `typeOf(null)`.
 *
 * @memberof types
 * @type {string}
 * @const 
 */
const NULL = exports.NULL = typeOf(null);

/**
 * Create a base set containing the typeOf representations for each of the 
 * known primitive types. 
 *
 * @type {Set<String>}
 * @memberof types 
 * @inner 
 */
const PRIMITIVES = new _set2.default([NULL, UNDEFINED, Boolean.name, Number.name, String.name, _symbol2.default.name]);

/** Store the original has() method and bind it to PRIMITIVES; $ComputedType */
PRIMITIVES[(0, _for2.default)('original_has')] = PRIMITIVES.has.bind(PRIMITIVES);

/**
 * Modify the PRIMITIVES `has()` method to invoke `typeOf()` on the argument 
 * before passing it to the underlying has() method originally passed down from 
 * the Set.prototype. 
 * 
 * @method has
 * @memberof PRIMITIVES
 * @inner
 * 
 * @param {mixed} o any value to test to see if it qualifies as a primitive
 * @return {Boolean} true if the supplied value is a primitive, false otherwise
 */
// $ComputedType
PRIMITIVES.has = o => PRIMITIVES[(0, _for2.default)('original_has')](typeOf(o));

/**
 * When testing if a type is a primitive, it is often easier to simply verify 
 * that with a list of known types. To make this dead simple, a modified `Set`
 * containing the `typeOf` results for each of the six known JavaScript 
 * primitive types is exported.
 *
 * The modifications are such that a call to `has()`, on this Set only, first 
 * converts the supplied values to their resulting `typeOf()` representations.
 * So, `PRIMITIVES.has(4)` would be the same as `PRIMITIVES.has('Number')`.
 *
 * @memberof types
 * @type {Set<string>}
 * @const 
 */
exports.PRIMITIVES = PRIMITIVES;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(41);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(47)
  , defined = __webpack_require__(33);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(111)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(53)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(98), __esModule: true };

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(68)
  , enumBugKeys = __webpack_require__(50);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(113);
var global        = __webpack_require__(3)
  , hide          = __webpack_require__(8)
  , Iterators     = __webpack_require__(19)
  , TO_STRING_TAG = __webpack_require__(1)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(142), __esModule: true };

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(5).f
  , has = __webpack_require__(11)
  , TAG = __webpack_require__(1)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(74);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {



/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(33);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(120), __esModule: true };

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntaxTree = undefined;

var _escape = __webpack_require__(136);

var _escape2 = _interopRequireDefault(_escape);

var _toStringTag = __webpack_require__(57);

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _iterator2 = __webpack_require__(140);

var _iterator3 = _interopRequireDefault(_iterator2);

var _getIterator2 = __webpack_require__(21);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = __webpack_require__(60);

var _set2 = _interopRequireDefault(_set);

var _assign = __webpack_require__(28);

var _assign2 = _interopRequireDefault(_assign);

var _for = __webpack_require__(17);

var _for2 = _interopRequireDefault(_for);

var _types = __webpack_require__(9);

var _graphql = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Shorthand for the key storing the internal AST
// @prop

// @module SyntaxTree

const AST_KEY = (0, _for2.default)('Internal AST Storage Key');

/**
 * A parser and processor of GraphQL IDL Abstract Syntax Trees. Used to combine
 * a set of {@link GQLBase} class instances.
 *
 * @class SyntaxTree
 */
let SyntaxTree = exports.SyntaxTree = class SyntaxTree {
  /**
   * Constructs a new `SyntaxTree` object. If a string schema is supplied or
   * an already parsed AST object, either of which is valid GraphQL IDL, then
   * its parsed AST will be the internals of this object.
   *
   * @constructor
   * @memberof SyntaxTree
   * @method ⎆⠀constructor
   *
   * @param {string|Object|SyntaxTree} schemaOrASTOrST if supplied the tree
   * will be constructed with the contents of the data. If a string of IDL is
   * given, it will be parsed. If an AST is given, it will be verified. If a
   * SyntaxTree is supplied, it will be copied.
   */
  constructor(schemaOrASTOrST) {
    // $ComputedType
    this[AST_KEY] = {};

    if (schemaOrASTOrST) {
      this.setAST(schemaOrASTOrST);
    }
  }

  /**
   * Getter that retrieves the abstract syntax tree created by `graphql.parse`
   * when it is presented with a valid string of IDL.
   *
   * @instance
   * @memberof SyntaxTree
   * @method ⬇︎⠀ast
   *
   * @return {Object} a GraphQL AST object
   */
  get ast() {
    // $ComputedType
    return this[AST_KEY];
  }

  /**
   * Setter that assigns the abstract syntax tree, typically created by
   * `graphql.parse` when given a valid string of IDL.
   *
   * @instance
   * @memberof SyntaxTree
   * @method ⬆︎⠀ast
   *
   * @param {Object} value a valid AST object. Other operations will act
   * in an undefined manner should this object not be a valid AST
   */
  set ast(value) {
    // $ComputedType
    this[AST_KEY] = value;
  }

  /**
   * Sets the underlying AST object with either schema which will be parsed
   * into a valid AST or an existing AST. Previous ast values will be erased.
   *
   * @instance
   * @memberof SyntaxTree
   * @method ⌾⠀setAST
   *
   * @param {string|Object} schemaOrAST a valid GraphQL IDL schema or a
   * previosuly parsed or compatible GraphQL IDL AST object.
   * @return {SyntaxTree} this for inlining.
   */
  setAST(schemaOrASTOrST) {
    // $ComputedType
    this[AST_KEY] = {};

    const type = (0, _types.typeOf)(schemaOrASTOrST);
    let ast;
    let st;

    switch (type) {
      case String.name:
        try {
          ast = (0, _graphql.parse)(schemaOrASTOrST);

          (0, _assign2.default)(this.ast, ast);
        } catch (ignore) {/* Ignore this error */}

        break;
      case Object.name:
        ast = schemaOrASTOrST;

        try {
          ast = (0, _graphql.parse)((0, _graphql.print)(ast));
          (0, _assign2.default)(this.ast, ast);
        } catch (ignore) {/* Ignore this error */}

        break;
      case SyntaxTree.name:
        st = schemaOrASTOrST;

        (0, _assign2.default)(this.ast, st.ast);

        break;
    }

    return this;
  }

  /**
   * As passthru update method that works on the internal AST object. If
   * an error occurs, the update is skipped. An error can occur if adding the
   * changes would make the AST invalid. In such a case, the error is logged
   * to the error console.
   *
   * @instance
   * @memberof SyntaxTree
   * @method ⌾⠀updateAST
   *
   * @param {Object} ast an existing GraphQL IDL AST object that will be
   * merged on top of the existing tree using Object.assign()
   * @return {SyntaxTree} this for inlining.
   */
  updateAST(ast) {
    if ((0, _types.typeOf)(ast) === Object.name) {
      let newAST = (0, _assign2.default)({}, this.ast, ast);

      try {
        (0, _graphql.print)(newAST);
        this.ast = (0, _assign2.default)(this.ast, ast);
      } catch (error) {
        console.error('[SyntaxTree] Failed to updateAST with %o', ast);
        console.error('Resulting object would be %o', newAST);
        console.error(error.message);
        console.error(error.stack);
      }
    }

    return this;
  }

  /**
   * Appends all definitions from another AST to this one. The method will
   * actually create a copy using SyntaxTree.from() so the input types can
   * be any one of a valid GraphQL IDL schema string, a GraphQL IDL AST or
   * another SyntaxTree object instance.
   *
   * Definitions of the same name but different kinds will be replaced by the
   * new copy. Those of the same kind and name will be merged (TODO handle more
   * than ObjectTypeDefinition kinds when merging; currently other types are
   * overwritten).
   *
   * @instance
   * @memberof SyntaxTree
   * @method ⌾⠀appendDefinitions
   *
   * @param {string|Object|SyntaxTree} schemaOrASTOrST an instance of one of
   * the valid types for SyntaxTree.from() that can be used to create or
   * duplicate the source from which to copy definitions.
   * @return {SyntaxTree} this for inlining
   */
  appendDefinitions(schemaOrASTOrST) {
    const source = SyntaxTree.from(schemaOrASTOrST);
    const set = new _set2.default();

    this.ast.definitions.map(definition => {
      set.add(definition.name.value);
    });

    if (source && source.ast.definitions && this.ast.definitions) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let theirs = _step.value;

          let name = theirs.name.value;
          let ours = this.find(name);
          let index = ours && this.ast.definitions.indexOf(ours) || -1;

          if (!ours) {
            console.error('Cannot find `ours`');
            console.error(new Error('`ours` missing'));
            continue;
          }

          // We don't yet have one with that name
          if (!set.has(name)) {
            set.add(name);
            this.ast.definitions.push(theirs);
          }

          // We do have one with that name
          else {
              // The kinds aren't the same, just replace theirs with ours
              if (theirs.kind !== ours.kind) {
                // replace with the new one
                this.ast.definitions[index] = theirs;
              }

              // The kinds are the same, lets just merge their fields
              else {
                  // merge the properties of the same types.
                  switch (theirs.kind) {
                    case 'ObjectTypeDefinition':
                      ours.interfaces = [].concat(ours.interfaces, theirs.interfaces);
                      ours.directives = [].concat(ours.directives, theirs.directives);
                      ours.fields = [].concat(ours.fields, theirs.fields);
                      break;
                    default:
                      // Since we don't support other types yet. Let's replace
                      this.ast.definitions[index] = theirs;
                      break;
                  }
                }
            }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    return this;
  }

  /**
   * This method finds the Query type definitions in the supplied AST or
   * SyntaxTree objects, takes its defined fields and adds it to the current
   * instances. If this instance does not have a Query type defined but the
   * supplied object does, then the supplied one is moved over. If neither
   * has a query handler, then nothing happens.
   *
   * NOTE this *removes* the Query type definition from the supplied AST or
   * SyntaxTree object.
   *
   * @instance
   * @memberof SyntaxTree
   * @method ⌾⠀consumeDefinition
   *
   * @param {Object|SyntaxTree} astOrSyntaxTree a valid GraphQL IDL AST or
   * an instance of SyntaxTree that represents one.
   * @param {string|RegExp} definitionType a valid search input as would be
   * accepted for the #find() method of this object.
   * @return {SyntaxTree} returns this for inlining
   */
  consumeDefinition(astOrSyntaxTree, definitionType = "Query") {
    if (!astOrSyntaxTree || !this.ast || !this.ast.definitions) {
      return this;
    }

    const tree = (0, _types.typeOf)(SyntaxTree) === SyntaxTree.name ? astOrSyntaxTree : SyntaxTree.from(astOrSyntaxTree);
    let left = this.find(definitionType);
    let right = tree && tree.find(definitionType) || null;

    if (!tree) {
      console.error('There seems to be something wrong with your tree');
      console.error(new Error('Missing tree; continuing...'));
      return this;
    }

    if (!right) {
      return this;
    }

    if (!left) {
      this.ast.definitions.push(right);

      // Remove the copied definition from the source
      tree.ast.definitions.splice(tree.ast.definitions.indexOf(right), 1);

      return this;
    }

    // TODO support other types aside from ObjectTypeDefinitions
    // TODO see if there is a better way to achieve this with built-in
    // graphql code someplace
    switch (left.kind) {
      case 'ObjectTypeDefinition':
        if (left.interfaces && right.interfaces) {
          left.interfaces = [].concat(left.interfaces, right.interfaces);
        }

        if (left.directives && right.directives) {
          left.directives = [].concat(left.directives, right.directives);
        }

        if (left.fields && right.fields) {
          left.fields = [].concat(left.fields, right.fields);
        }

        break;
      default:
        break;
    }

    // Remove the copied definition from the source
    tree.ast.definitions.splice(tree.ast.definitions.indexOf(right), 1);

    return this;
  }

  /**
   * When iterating over an instance of SyntaxTree, you are actually
   * iterating over the definitions of the SyntaxTree if there are any;
   *
   * @instance
   * @memberof SyntaxTree
   * @method *[Symbol.iterator]
   * @ComputedType
   */
  *[_iterator3.default]() {
    if (this[AST_KEY].definitions) {
      return yield* this[AST_KEY].definitions;
    } else {
      return yield* this;
    }
  }

  /**
   * Iterate through the definitions of the AST if there are any. For each
   * definition the name property's value field is compared to the supplied
   * definitionName. The definitionName can be a string or a regular
   * expression if finer granularity is desired.
   *
   * @instance
   * @memberof SyntaxTree
   * @method ⌾⠀find
   *
   * @param {string|RegExp} definitionName a string or regular expression used
   * to match against the definition name field in a given AST.
   * @return {Object|null} a reference to the internal definition field or
   * null if one with a matching name could not be found.
   */
  find(definitionName) {
    // $ComputedType
    return SyntaxTree.findDefinition(this[AST_KEY], definitionName);
  }

  /**
   * SyntaxTree instances that are toString()'ed will have the graphql method
   * print() called on them to convert their internal structures back to a
   * GraphQL IDL schema syntax. If the object is in an invalid state, it WILL
   * throw an error.
   *
   * @instance
   * @memberof SyntaxTree
   * @method ⌾⠀toString
   *
   * @return {string} the AST for the tree parsed back into a string
   */
  toString() {
    // $ComputedType
    return (0, _graphql.print)(this[AST_KEY]);
  }

  /**
   * A runtime constant denoting a query type.
   *
   * @type {string}
   * @static
   * @memberof SyntaxTree
   * @method ⬇︎⠀QUERY
   * @readonly
   * @const
   */
  static get QUERY() {
    return 'Query';
  }

  /**
   * A runtime constant denoting a mutation type.
   *
   * @type {string}
   * @static
   * @memberof SyntaxTree
   * @method ⬇︎⠀MUTATION
   * @readonly
   * @const
   */
  static get MUTATION() {
    return 'Mutation';
  }

  /**
   * Returns the `constructor` name. If invoked as the context, or `this`,
   * object of the `toString` method of `Object`'s `prototype`, the resulting
   * value will be `[object MyClass]`, given an instance of `MyClass`
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof SyntaxTree
   *
   * @return {string} the name of the class this is an instance of
   * @ComputedType
   */
  get [_toStringTag2.default]() {
    return this.constructor.name;
  }

  /**
   * Applies the same logic as {@link #[Symbol.toStringTag]} but on a static 
   * scale. So, if you perform `Object.prototype.toString.call(MyClass)` 
   * the result would be `[object MyClass]`.
   *
   * @method ⌾⠀[Symbol.toStringTag]
   * @memberof SyntaxTree
   * @static
   *
   * @return {string} the name of this class
   * @ComputedType
   */
  static get [_toStringTag2.default]() {
    return this.name;
  }

  /**
   * Given one of, a valid GraphQL IDL schema string, a valid GraphQL AST or
   * an instance of SyntaxTree, the static from() method will create a new
   * instance of the SyntaxTree with the values you provide.
   *
   * @static
   * @memberof SyntaxTree
   * @method ⌾⠀from
   *
   * @param {String|Object|SyntaxTree} mixed an instance of one of the valid
   * types specified above. Everything else will result in a null value.
   * @return {SyntaxTree} a newly created and populated instance of SyntaxTree
   * or null if an invalid type was supplied for mixed.
   */
  static from(mixed) {
    let schema;
    let ast;

    switch ((0, _types.typeOf)(mixed)) {
      case String.name:
        schema = mixed;
        try {
          (0, _graphql.parse)(schema);
        } catch (error) {
          console.log(error);return null;
        }

        return SyntaxTree.fromSchema(String(schema));
      case Object.name:
        ast = mixed;
        try {
          (0, _graphql.print)(ast);
        } catch (error) {
          return null;
        }

        return SyntaxTree.fromAST(ast);
      case SyntaxTree.name:
        schema = mixed.toString();

        return SyntaxTree.from(schema);
      default:
        return null;
    }
  }

  /**
   * Generates a new instance of SyntaxTree from the supplied, valid, GraphQL
   * schema. This method does not perform try/catch validation and if an
   * invalid GraphQL schema is supplied an error will be thrown.
   *
   * @static
   * @memberof SyntaxTree
   * @method ⌾⠀fromSchema
   *
   * @param {string} schema a valid GraphQL IDL schema string.
   * @return {SyntaxTree} a new instance of SyntaxTree initialized with a
   * parsed response from require('graphql').parse().
   */
  static fromSchema(schema) {
    const ast = (0, _graphql.parse)(schema);
    let tree = new SyntaxTree(ast);

    return tree;
  }

  /**
   * Generates a new instance of SyntaxTree from the supplied, valid, GraphQL
   * schema. This method does not perform try/catch validation and if an
   * invalid GraphQL schema is supplied an error will be thrown.
   *
   * @static
   * @memberof SyntaxTree
   * @method ⌾⠀fromAST
   *
   * @param {object} ast a valid GraphQL AST object.
   * @return {SyntaxTree} a new instance of SyntaxTree initialized with a
   * supplied abstract syntax tree generated by require('graphql').parse() or
   * other compatible method.
   */
  static fromAST(ast) {
    const source = (0, _graphql.parse)((0, _graphql.print)(ast));
    let tree = new SyntaxTree(source);

    return source ? tree : null;
  }

  /**
   * Iterate through the definitions of the AST if there are any. For each
   * definition the name property's value field is compared to the supplied
   * definitionName. The definitionName can be a string or a regular
   * expression if finer granularity is desired.
   *
   * @static
   * @memberof SyntaxTree
   * @method ⌾⠀findDefinition
   *
   * @param {Object} ast an abstract syntax tree object created from a GQL SDL 
   * @param {string|RegExp} definitionName a string or regular expression used
   * to match against the definition name field in a given AST.
   * @return {Object|null} a reference to the internal definition field or
   * null if one with a matching name could not be found.
   */
  static findDefinition(ast, definitionName) {
    return this.findInASTArrayByNameValue(ast.definitions, definitionName);
  }

  /**
   * Iterate through the fields of a definition AST if there are any. For each
   * field, the name property's value field is compared to the supplied
   * fieldName. The fieldName can be a string or a regular expression if 
   * finer granularity is desired.
   *
   * Before iterating over the fields, however, the definition is found using 
   * `SyntaxTree#findDefinition`. If either the field or definition are not 
   * found, null is returned.
   *
   * @static
   * @memberof SyntaxTree
   * @method ⌾⠀findField
   * @since 2.7.0
   *
   * @param {Object} ast an abstract syntax tree object created from a GQL SDL 
   * @param {string|RegExp} definitionName a string or regular expression used
   * to match against the definition name field in a given AST.
   * @param {string|RegExp} fieldName a string or regular expression used
   * to match against the field name field in a given AST.
   * @return {Object|null} an object containing two keys, the first being 
   * `field` which points to the requested AST definition field. The second 
   * being `meta` which contains three commonly requested bits of data; `name`,
   * `type` and `nullable`. Non-nullable fields have their actual type wrapped 
   * in a `NonNullType` GraphQL construct. The actual field type is contained 
   * within. The meta object surfaces those values for easy use.
   */
  static findField(ast, definitionName, fieldName) {
    const definition = this.findDefinition(ast, definitionName);
    let meta;

    if (!definition || !definition.fields) {
      return null;
    }

    const field = this.findInASTArrayByNameValue(definition.fields, fieldName);

    if (field) {
      meta = {
        name: field.name && field.name.value || null,
        type: field.type && field.type.kind === 'NonNullType' ? field.type.type.name.value : field.type && field.type.name && field.type.name.value || null,
        nullable: !!(field.type && field.type.kind !== 'NonNullType')
      };
    }

    return { field, meta };
  }

  /**
   * Enum AST definitions operate differently than object type definitions
   * do. Namely, they do not have a `fields` array but instead have a `values`
   * array. This wrapper method, first finds the enum definition in the ast 
   * and then searches the values for the named node desired and returns that 
   * or null, if one could not be found.
   *
   * @method SyntaxTree#⌾⠀findEnumDefinition
   * @since 2.7.0
   * 
   * @param {Object} ast the abstract syntax tree parsed by graphql 
   * @param {string|RegExp} enumDefinitionName a string or regular expression 
   * used to locate the enum definition in the AST. 
   * @param {string|RegExp} enumValueName a string or regular expression used 
   * to locate the value by name in the values of the enum definition.
   * @return {Object|null} the desired AST node or null if one does not exist
   */
  static findEnumDefinition(ast, enumDefinitionName, enumValueName) {
    // Fetch the enum definition 
    const definition = this.findDefinition(ast, enumDefinitionName);

    // Ensure we have one or that it has a values array
    if (!definition || !definition.values) {
      return null;
    }

    // Return the results of an `findInASTArrayByNameValue()` search of the 
    // aforementioned 'values' array.
    return this.findInASTArrayByNameValue(definition.values, enumValueName);
  }

  /**
   * A lot of searching in ASTs is filtering through arrays and matching on 
   * subobject properties on each iteration. A common theme is find something 
   * by its `.name.value`. This method simplifies that by taking an array of 
   * AST nodes and searching them for a `.name.value` property that exists 
   * within.
   * 
   * @static
   * @memberof SyntaxTree
   * @method ⌾⠀findInASTArrayByNameValue
   * @since 2.7.0
   *
   * @param {Array} array of mixed AST object nodes containing `name.value`s
   * @param {string|RegExp} name a string or regular expression used
   * to match against the node name value
   * @return {Object|null} the AST leaf if one matches or null otherwise.
   */
  static findInASTArrayByNameValue(array, name) {
    const isRegExp = /RegExp/.test((0, _types.typeOf)(name));
    const regex = !isRegExp
    // $FlowFixMe
    ? new RegExp((0, _escape2.default)(name.toString()))
    // $FlowFixMe
    : name;
    const flags = regex.flags;
    const source = regex.source;
    const reducer = (last, cur, i) => {
      if (last !== -1) return last;
      if (!cur || !cur.name || !cur.name.value) return -1;
      return new RegExp(source, flags).test(cur.name.value) ? i : -1;
    };
    const index = array.reduce(reducer, -1);

    return ~index ? array[index] : null;
  }

  /**
   * Query types in GraphQL are an ObjectTypeDefinition of importance for
   * placement on the root object. There is utility in creating an empty
   * one that can be injected with the fields of other GraphQL object query
   * entries.
   *
   * @static
   * @memberof SyntaxTree
   * @method ⌾⠀EmptyQuery
   *
   * @return {SyntaxTree} an instance of SyntaxTree with a base AST generated
   * by parsing the graph query, "type Query {}"
   */
  static EmptyQuery() {
    return SyntaxTree.from(`type ${this.QUERY} {}`);
  }

  /**
   * Mutation types in GraphQL are an ObjectTypeDefinition of importance for
   * placement on the root object. There is utility in creating an empty
   * one that can be injected with the fields of other GraphQL object mutation
   * entries.
   *
   * @static
   * @memberof SyntaxTree
   * @method ⌾⠀EmptyMutation
   *
   * @return {SyntaxTree} an instance of SyntaxTree with a base AST generated
   * by parsing the graph query, "type Mutation {}"
   */
  static EmptyMutation() {
    return SyntaxTree.from(`type ${this.MUTATION} {}`);
  }

  /**
   * The starting point for a SyntaxTree that will be built up programmatically.
   *
   * @static
   * @memberof SyntaxTree
   * @method ⌾⠀EmptyDocument
   *
   * @param {string|Object|SyntaxTree} schemaOrASTOrST any valid type taken by
   * SyntaxTree.from() used to further populate the new empty document
   * @return {SyntaxTree} an instance of SyntaxTree with no definitions and a
   * kind set to 'Document'
   */
  static EmptyDocument(schemaOrASTOrST) {
    let tree = new SyntaxTree();

    // Due to normal validation methods with ASTs (i.e. converting to string
    // and then back to an AST object), doing this with an empty document
    // fails. Therefore, we manually set the document contents here. This allows
    // toString(), consumeDefinition() and similar methods to still work.
    tree.ast = {
      kind: 'Document',
      definitions: [],
      loc: { start: 0, end: 0 }
    };

    if (schemaOrASTOrST) {
      tree.appendDefinitions(schemaOrASTOrST);
    }

    return tree;
  }
};
exports.default = SyntaxTree;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(1);

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(48)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(7)
  , dPs         = __webpack_require__(70)
  , enumBugKeys = __webpack_require__(50)
  , IE_PROTO    = __webpack_require__(49)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(42)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(71).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(24)
  , TAG = __webpack_require__(1)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(13)
  , call        = __webpack_require__(77)
  , isArrayIter = __webpack_require__(78)
  , anObject    = __webpack_require__(7)
  , toLength    = __webpack_require__(34)
  , getIterFn   = __webpack_require__(55)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLScalar = undefined;

var _graphql = __webpack_require__(10);

var _GQLBase = __webpack_require__(6);

/**
 * GQLScalars are how one might construct their own types for use within 
 * GraphQL with Lattice. The descriptions below should be sufficient to get 
 * you started with your own types. The SDL for a Scalar looks like this:
 *
 * ```
 * scalar MyType
 * ```
 *
 * @class GQLScalar
 */
let GQLScalar = exports.GQLScalar = class GQLScalar extends _GQLBase.GQLBase {
  /**
   * Determines the default type targeted by this GQLBase class. Any
   * type will technically be valid but only will trigger special behavior
   *
   * @memberof GQLScalar
   * @method ⬇︎⠀GQL_TYPE
   * @static
   * @const
   *
   * @return {Function} a type, such as `GraphQLObjectType` or
   * `GraphQLInterfaceType`
   */
  static get GQL_TYPE() {
    return _graphql.GraphQLScalarType;
  }

  /**
   * The `serialize` method is called by GraphQL when the type is going to 
   * be sent to the client. Since values on the client are in the form of 
   * JSON, the return value of `serialize` can be any valid JSON value;
   * String, Number, Array, Object, etc...
   *
   * @memberof GQLScalar
   * @method serialize
   * @static 
   *
   * @param {mixed} value the value that needs to be converted for the 
   * downstream JSON client side result.
   * @return {mixed} any valid JSON value
   */
  static serialize(value) {
    return value;
  }

  /**
   * Parse value handles input from the client. In this form, the value is 
   * taken directly from the sent query. The type of the value can be nearly 
   * anything, but the `parseValue` function's job is to interpret the 
   * input and return the understood value.
   *
   * You could have a ColorBlind scalar type that took in a hexadecimal 
   * color string and converted it to a color scheme as seen by those with 
   * some form of color blindness. The value supplied to `parseValue` would 
   * be the input color. The modified color would be the output value.
   *
   * ```
   * query {
   *   showMe(colorBlind: '#ff0000') {
   *     color 
   *   }
   * }
   *
   * // this might convert to #c65100
   * ```
   *
   * This can also cover input sent in the form of variables. The variable 
   * can be of any valid JSON type. 
   *
   * @memberof GQLScalar
   * @method parseValue
   * @static 
   *
   * @param {mixed} value the input sent from a query that needs to be 
   * converted to an internal value for GraphQL to proceed
   * @return {mixed} the converted output given the input; this will be purely 
   * how you want your scalars to function.
   */
  static parseValue(value) {
    return value;
  }

  /**
   * Similar to `parseValue`, but rather than receiving the input values from 
   * a query or from a query variable, the data comes in the form of a parsed 
   * abstract syntax/source tree (AST). It is the job of `parseLiteral` to
   * convert from an AST type to the desired output value. 
   *
   * An example that converts all Strings to Numbers and vice versa
   *
   * ```javascript
   * static parseLiteral(ast) {
   *   const { Kind } = require('graphql/language')
   *
   *   switch (ast.kind) {
   *     case Kind.INT:
   *     case Kind.FLOAT:
   *       return String(ast.value)
   *     case Kind.STRING:
   *       return parseFloat(ast.value)
   *     default:
   *       return null;
   *   }
   * }
   * ```
   *
   * @memberof GQLScalar
   * @method parseLiteral
   * @static 
   *
   * @param {Object} ast the parse value of the type given some literal SDL 
   * syntax. Presumably this is where you can choose to take a String, for
   * example, and convert it to an integer when Kind.STRING is supplied. 
   * @return {mixed} the value of the conversion, given input.
   */
  static parseLiteral(ast) {}
};
exports.default = GQLScalar;

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14)
  , document = __webpack_require__(3).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(14);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(30)('meta')
  , isObject = __webpack_require__(14)
  , has      = __webpack_require__(11)
  , setDesc  = __webpack_require__(5).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(12)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(3)
  , core           = __webpack_require__(0)
  , LIBRARY        = __webpack_require__(32)
  , wksExt         = __webpack_require__(31)
  , defineProperty = __webpack_require__(5).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(24);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 48 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(45)('keys')
  , uid    = __webpack_require__(30);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 50 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 51 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(105), __esModule: true };

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(32)
  , $export        = __webpack_require__(2)
  , redefine       = __webpack_require__(67)
  , hide           = __webpack_require__(8)
  , has            = __webpack_require__(11)
  , Iterators      = __webpack_require__(19)
  , $iterCreate    = __webpack_require__(112)
  , setToStringTag = __webpack_require__(23)
  , getPrototypeOf = __webpack_require__(75)
  , ITERATOR       = __webpack_require__(1)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(37)
  , ITERATOR  = __webpack_require__(1)('iterator')
  , Iterators = __webpack_require__(19);
module.exports = __webpack_require__(0).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(8);
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(119), __esModule: true };

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deferred = undefined;

var _asyncToGenerator2 = __webpack_require__(25);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = __webpack_require__(74);

var _promise2 = _interopRequireDefault(_promise);

exports.joinLines = joinLines;
exports.promisify = promisify;

var _types = __webpack_require__(9);

var _fs = __webpack_require__(58);

var _fs2 = _interopRequireDefault(_fs);

var _util = __webpack_require__(86);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Stats = _fs2.default.Stats;

/**
 * Deferred is modeled after jQuery's deferred object. It inverts a promise
 * such that its resolve and reject methods can be invoked without wrapping
 * all of the related code within a Promise's function.
 *
 * @memberof utils
 * @class Deferred
 */
/** @namespace utils */

let Deferred = exports.Deferred = class Deferred {

  /**
   * Creates an object with four properties of note; promise, resolve, reject
   * and a flag complete that will be set once either resolve or reject have
   * been called. A Deferred is considered to be pending while complete is set
   * to false.
   *
   * Once constructed, resolve and reject can be called later, at which point,
   * the promise is completed. The promise property is the promise resolved
   * or rejected by the associated properties and can be used with other
   * async/await or Promise based code.
   *
   * @instance
   * @memberof Deferred
   * @method ⎆⠀constructor
   *
   * @param {any} resolveWith a deferred resolved as Promise.resolve() might do
   * @param {any} rejectWith a deferred rejected as Promise.reject() might do
   */


  /**
   * This is the promise wrapped by and inverted in this deferred instance
   *
   * @type {Promise}
   * @memberof Deferred
   * @instance 
   */

  /**
   * This property holds a `resolve` function from within the promise this
   * deferred inverts.
   *
   * @type {Function}
   * @memberof Deferred
   * @instance
   */
  constructor(resolveWith, rejectWith) {
    this.promise = new _promise2.default((resolve, reject) => {
      this.complete = false;

      this.resolve = (...args) => {
        this.complete = true;
        return resolve(...args);
      };

      this.reject = (...args) => {
        this.complete = true;
        return reject(...args);
      };

      if (resolveWith && !rejectWith) {
        this.resolve(resolveWith);
      }
      if (rejectWith && !resolveWith) {
        this.reject(rejectWith);
      }
    });
  }

  /**
   * Shorthand getter that denotes true if the deferred is not yet complete.
   *
   * @instance
   * @memberof Deferred
   * @method ⬇︎⠀pending
   *
   * @return {boolean} true if the promise is not yet complete; false otherwise
   */


  /**
   * An at a glance boolean property that denotes whether or not this 
   * deferred has been resolved or rejected yet.
   *
   * @type {boolean}
   * @memberof Deferred
   * @instance
   */


  /**
   * This property holds a `reject` function from within the promise this 
   * deferred inverts
   *
   * @type {Function}
   * @memberof Deferred
   * @instance
   */
  get pending() {
    return !this.complete;
  }

  /**
   * Promises are great but if the code never resolves or rejects a deferred,
   * then things will become eternal; in a bad way. This makes that less likely
   * of an event.
   *
   * If the number of milliseconds elapses before a resolve or reject occur,
   * then the deferred is rejected.
   *
   * @static
   * @memberof Deferred
   * @method ⌾⠀TimedDeferred
   *
   * @param {Number} timeOut a number of milliseconds to wait before rejecting
   * the deferred.
   * @param {Promise} proxyPromise a promise to proxy then/catch through to the
   * deferreds resolve/reject.
   * @return {Deferred} an instance of deferred that will timeout after
   * `timeOut` milliseconds have elapsed. If `proxyPromise` is a `Promise`
   * then the deferred's reject and resolve will be tied to the Promise's
   * catch() and then() methods, respectively.
   */
  static TimedDeferred(timeOut, proxyPromise) {
    const deferred = new Deferred();

    if (proxyPromise && (0, _types.typeOf)(proxyPromise) === _promise2.default.name) {
      proxyPromise.then((...args) => deferred.resolve(...args));
      proxyPromise.catch(reason => deferred.reject(reason));
    }

    setTimeout(() => deferred.reject(new Error('Deferred timed out'), timeOut));

    return deferred;
  }
};

/**
 * A small helper for multiline template strings that allows you to
 * not worry about new lines and indentations within your code from
 * breaking up the format of the string. 
 *
 * @memberof utils
 * @since 2.5
 * 
 * @param {Array} strings an array of Strings from the template, broken up by
 * where the substitions are to be inserted.
 * @param {Array} values an array of values to be inserted after each string
 * of a matching index.
 * @return {String} a template String without any prefixed or postfixed tabs
 * and other whitespaced characters. 
 */

function joinLines(strings, ...values) {
  let result = [];
  for (let i = 0; i < strings.length; i++) {
    let string = String(strings[i]).trim();
    let value = values.length > i && `${String(values[i]).trim()} ` || '';
    result.push(string.replace(/(\s+)/g, ' ').replace(/$/g, ' '));
    result.push(value);
  }
  return result.join('').trim();
}

/**
 * A simply promisify style function that returns an async function wrapped 
 * around a supplied function designed for the standard callback methodology. 
 * If the callback is the last parameter, and that callback is in the form of 
 * (error, ...results) then this wrapper will do the trick for you.
 *
 * @method utils~promisify
 * @since 2.7.0
 * 
 * @param {Function} method a function to wrap in an asynchronous function 
 * @param {mixed} context an optional `this` object for use with the supplied 
 * function.
 * @return {Function} an asynchronous function, i.e. one that returns a promise 
 * containing the contents the callback results, that wraps the supplied 
 * function.
 */
function promisify(method, context) {
  return (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (...args) {
      return new _promise2.default(function (resolve, reject) {
        args.push(function (error, ...callbackArgs) {
          if (error) {
            reject(error);
          } else {
            resolve(...callbackArgs);
          }
        });

        method.apply(context, args);
      });
    });

    return function () {
      return _ref.apply(this, arguments);
    };
  })();
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(126), __esModule: true };

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLInterface = undefined;

var _GQLBase = __webpack_require__(6);

var _graphql = __webpack_require__(10);

/**
 * Used by Lattice to implement interface types in the schema when necessary
 *
 * @class GQLInterface
 */
/**
 @namespace GQLInterface
 
 */

let GQLInterface = exports.GQLInterface = class GQLInterface extends _GQLBase.GQLBase {

  /**
   * This needs to be able to, depending on your implementors, identify
   * which on the data actually is given the model to work with.
   *
   * @memberof GQLInterface
   * @method ⌾⠀resolveType
   * @static
   *
   * @param {mixed} model the data you can use to instantiate the type of
   * object in question.
   * @return {string} a string matching the name of a defined GraphQL type
   * found elsewhere in your schema
   */
  static resolveType(model) {
    throw new Error(`
      You must override "resolveType(model)" in your GQLInterface instance
      and determine the implementor type by the contents of the supplied
      model. Returning "null" when nothing matches.
    `);
  }

  /**
   * Denotes that this GQLBase descendent is describing a graphql
   * interface type.
   *
   * @memberof GQLInterface
   * @method ⬇︎⠀GQL_TYPE
   * @static
   * @const
   *
   * @return {Function} a type, such as `GraphQLObjectType` or
   * `GraphQLInterfaceType`
   */
  static get GQL_TYPE() {
    return _graphql.GraphQLInterfaceType;
  }
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocation = getLocation;


/**
 * Takes a Source and a UTF-8 character offset, and returns the corresponding
 * line and column as a SourceLocation.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function getLocation(source, position) {
  var lineRegexp = /\r\n|[\n\r]/g;
  var line = 1;
  var column = position + 1;
  var match = void 0;
  while ((match = lineRegexp.exec(source.body)) && match.index < position) {
    line += 1;
    column = position + 1 - (match.index + match[0].length);
  }
  return { line: line, column: column };
}

/**
 * Represents a location in a Source.
 */

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphQLError = GraphQLError;

var _location = __webpack_require__(63);

/**
 * A GraphQLError describes an Error found during the parse, validate, or
 * execute phases of performing a GraphQL operation. In addition to a message
 * and stack trace, it also includes information about the locations in a
 * GraphQL document and/or execution result that correspond to the Error.
 */
function GraphQLError( // eslint-disable-line no-redeclare
message, nodes, source, positions, path, originalError) {
  // Compute locations in the source for the given nodes/positions.
  var _source = source;
  if (!_source && nodes && nodes.length > 0) {
    var node = nodes[0];
    _source = node && node.loc && node.loc.source;
  }

  var _positions = positions;
  if (!_positions && nodes) {
    _positions = nodes.filter(function (node) {
      return Boolean(node.loc);
    }).map(function (node) {
      return node.loc.start;
    });
  }
  if (_positions && _positions.length === 0) {
    _positions = undefined;
  }

  var _locations = void 0;
  var _source2 = _source; // seems here Flow need a const to resolve type.
  if (_source2 && _positions) {
    _locations = _positions.map(function (pos) {
      return (0, _location.getLocation)(_source2, pos);
    });
  }

  Object.defineProperties(this, {
    message: {
      value: message,
      // By being enumerable, JSON.stringify will include `message` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: true,
      writable: true
    },
    locations: {
      // Coercing falsey values to undefined ensures they will not be included
      // in JSON.stringify() when not provided.
      value: _locations || undefined,
      // By being enumerable, JSON.stringify will include `locations` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: true
    },
    path: {
      // Coercing falsey values to undefined ensures they will not be included
      // in JSON.stringify() when not provided.
      value: path || undefined,
      // By being enumerable, JSON.stringify will include `path` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: true
    },
    nodes: {
      value: nodes || undefined
    },
    source: {
      value: _source || undefined
    },
    positions: {
      value: _positions || undefined
    },
    originalError: {
      value: originalError
    }
  });

  // Include (non-enumerable) stack trace.
  if (originalError && originalError.stack) {
    Object.defineProperty(this, 'stack', {
      value: originalError.stack,
      writable: true,
      configurable: true
    });
  } else if (Error.captureStackTrace) {
    Error.captureStackTrace(this, GraphQLError);
  } else {
    Object.defineProperty(this, 'stack', {
      value: Error().stack,
      writable: true,
      configurable: true
    });
  }
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

GraphQLError.prototype = Object.create(Error.prototype, {
  constructor: { value: GraphQLError },
  name: { value: 'GraphQLError' }
});

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(3)
  , has            = __webpack_require__(11)
  , DESCRIPTORS    = __webpack_require__(4)
  , $export        = __webpack_require__(2)
  , redefine       = __webpack_require__(67)
  , META           = __webpack_require__(44).KEY
  , $fails         = __webpack_require__(12)
  , shared         = __webpack_require__(45)
  , setToStringTag = __webpack_require__(23)
  , uid            = __webpack_require__(30)
  , wks            = __webpack_require__(1)
  , wksExt         = __webpack_require__(31)
  , wksDefine      = __webpack_require__(46)
  , keyOf          = __webpack_require__(99)
  , enumKeys       = __webpack_require__(102)
  , isArray        = __webpack_require__(69)
  , anObject       = __webpack_require__(7)
  , toIObject      = __webpack_require__(15)
  , toPrimitive    = __webpack_require__(43)
  , createDesc     = __webpack_require__(22)
  , _create        = __webpack_require__(36)
  , gOPNExt        = __webpack_require__(103)
  , $GOPD          = __webpack_require__(104)
  , $DP            = __webpack_require__(5)
  , $keys          = __webpack_require__(18)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(72).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(35).f  = $propertyIsEnumerable;
  __webpack_require__(51).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(32)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(8)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(4) && !__webpack_require__(12)(function(){
  return Object.defineProperty(__webpack_require__(42)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(11)
  , toIObject    = __webpack_require__(15)
  , arrayIndexOf = __webpack_require__(100)(false)
  , IE_PROTO     = __webpack_require__(49)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(24);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(5)
  , anObject = __webpack_require__(7)
  , getKeys  = __webpack_require__(18);

module.exports = __webpack_require__(4) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3).document && document.documentElement;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(68)
  , hiddenKeys = __webpack_require__(50).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(108), __esModule: true };

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(110), __esModule: true };

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(11)
  , toObject    = __webpack_require__(27)
  , IE_PROTO    = __webpack_require__(49)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(7);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(19)
  , ITERATOR   = __webpack_require__(1)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(13)
  , invoke             = __webpack_require__(117)
  , html               = __webpack_require__(71)
  , cel                = __webpack_require__(42)
  , global             = __webpack_require__(3)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(24)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(3)
  , core        = __webpack_require__(0)
  , dP          = __webpack_require__(5)
  , DESCRIPTORS = __webpack_require__(4)
  , SPECIES     = __webpack_require__(1)('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(1)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(123), __esModule: true };

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP          = __webpack_require__(5).f
  , create      = __webpack_require__(36)
  , redefineAll = __webpack_require__(56)
  , ctx         = __webpack_require__(13)
  , anInstance  = __webpack_require__(54)
  , defined     = __webpack_require__(33)
  , forOf       = __webpack_require__(38)
  , $iterDefine = __webpack_require__(53)
  , step        = __webpack_require__(76)
  , setSpecies  = __webpack_require__(80)
  , DESCRIPTORS = __webpack_require__(4)
  , fastKey     = __webpack_require__(44).fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global         = __webpack_require__(3)
  , $export        = __webpack_require__(2)
  , meta           = __webpack_require__(44)
  , fails          = __webpack_require__(12)
  , hide           = __webpack_require__(8)
  , redefineAll    = __webpack_require__(56)
  , forOf          = __webpack_require__(38)
  , anInstance     = __webpack_require__(54)
  , isObject       = __webpack_require__(14)
  , setToStringTag = __webpack_require__(23)
  , dP             = __webpack_require__(5).f
  , each           = __webpack_require__(128)(0)
  , DESCRIPTORS    = __webpack_require__(4);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function(target, iterable){
      anInstance(target, C, NAME, '_c');
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)dP(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(37)
  , from    = __webpack_require__(132);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DirectTypeManager = undefined;

var _defineProperty = __webpack_require__(73);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getIterator2 = __webpack_require__(21);

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.DirectTypeAdd = DirectTypeAdd;
exports.Getters = Getters;
exports.Setters = Setters;
exports.Properties = Properties;

var _GQLBase = __webpack_require__(6);

var _types = __webpack_require__(9);

var _util = __webpack_require__(86);

var _graphql = __webpack_require__(10);

var _SyntaxTree = __webpack_require__(29);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * For each of the decorators, Getters, Setters, and Properties, we take a 
 * list of property names used to create the appropriate accessor types. In 
 * some cases, however, the instance of GQLBase's data model may have a
 * different name. Finally if the return type for the getter should be wrapped 
 * in a another GQLBase class type, we will need a way to specify those things 
 * too. 
 *
 * The `extractBits()` takes a single argument value from the decorator as it 
 * parses them and converts it into an object, properly sorted, into values that 
 * allow the above described behavior.
 *
 * Examples:
 * 
 * ```
 * // Create a class with a name and age property that map directly to the 
 * // underlying data model
 * @Getters('name', 'age')
 * class MyType extends GQLBase {...}
 *
 * // Create a class with a name property that maps to a different property 
 * // name in the underlying data model 
 * @Getters(['name', '_fake_name'])
 * class MyMockType extends GQLBase {...}
 *
 * // Create a class with an employee property that returns an Employee 
 * @Getters(['employee', Employee])
 * class MyRoleType extends GQLBase {...}
 *
 * // Finally create a class with an employe property that returns an Employee 
 * // with data under a different name in the underlying data model.
 * @Getters(['employee', '_worker', Employee])
 * class MyMockRoleType extends GQLBase {...}
 * ```
 * 
 * @memberof decorators
 * @method ⌾⠀extractBits
 * @since 2.5
 * 
 * @param {String|Array<String|Function>} property name of a property, or list 
 * of property names and a Class. 
 * @return {Object} an object with the following format ```
 * {
 *   typePropertyName: name of root instance property to create 
 *   modelPropertyName: name of its associated internal model property 
 *   typeClass: an optional class to wrap around the results in a getter 
 * }
 * ```
 */
function extractBits(property) {
  let array = (0, _types.isArray)(property) ? property : [property, property, null];
  let reply;

  if (!property) {
    let error = new Error('Invalid property. Given\n  %o', (0, _util.inspect)(property, { depth: 2 }));

    return {
      typePropertyName: 'anErrorOccurred',
      modelPropertyName: 'anErrorOccurred',
      typeClass: null,
      getterMaker: function getterMaker() {
        return () => error;
      },
      setterMaker: function setterMaker() {
        return v => undefined;
      }
    };
  }

  //
  if (array.length === 3) {
    reply = {
      typePropertyName: array[0],
      modelPropertyName: array[1],
      typeClass: typeof array[2] === 'function' && array[2] || null
    };
  }

  //
  else if (array.length === 2) {
      reply = {
        typePropertyName: array[0],
        modelPropertyName: typeof array[1] === 'string' ? array[1] : array[0],
        typeClass: typeof array[1] === 'function' && array[1] || null
      };
    }

    //
    else {
        reply = {
          typePropertyName: array[0],
          modelPropertyName: array[0],
          typeClass: array[0]
        };
      }

  reply.getterMaker = function () {
    var _reply = reply;
    let modelPropertyName = _reply.modelPropertyName,
        typePropertyName = _reply.typePropertyName,
        typeClass = _reply.typeClass;


    return function () {
      const thisClass = this.constructor;
      const model = this[_GQLBase.MODEL_KEY] || null;
      let val;

      if (!(0, _types.extendsFrom)(thisClass, _GQLBase.GQLBase)) {
        console.error(`${thisClass.name} is not derived from GQLBase`);
        return undefined;
      }

      if (!thisClass.SCHEMA) {
        throw new Error(`
        All GQLBase extended classes should have a defined SCHEMA. Please
        manually define a static get SCHEMA() in your class or use the 
        @Schema() decorator to do so.
        `);
      }

      if (typeClass) {
        const results = _SyntaxTree.SyntaxTree.findField((0, _graphql.parse)(this.constructor.SCHEMA), this.constructor.name, modelPropertyName);

        var _ref = results || { meta: null };

        const meta = _ref.meta;


        let args = [model[modelPropertyName], this.requestData];

        if (meta && !meta.nullable && !model) {
          throw new Error(`
            Using @Getters or @Properties decorators with a null or 
            undefined model when the schema states that this field 
            cannot be null.
            
            Type      : ${typeClass.name}
            Field (AST data)
              name    : ${meta.name}
              type    : ${meta.type}
              nullable: ${meta.nullable}
            [getter]  : ${typePropertyName}
            [maps to] : ${modelPropertyName}
            [model  ] : ${model}            
          `);
        }

        // If the following is true, it means that despite allowing nulls 
        // for this field in the schema, we do have a valid model and should 
        // proceed.
        if (model) {
          if (extractBits.DIRECT_TYPES.includes(typeClass.name)) {
            val = typeClass(...args);
          } else {
            val = new typeClass(...args);
          }

          if (typeClass.GQL_TYPE === _graphql.GraphQLEnumType) {
            return val.value;
          }
        }
      } else {
        val = model[modelPropertyName];
      }

      if (val === 'undefined' || val === undefined) {
        val = null;
      }

      return val;
    };
  };

  reply.setterMaker = function () {
    var _reply2 = reply;
    let modelPropertyName = _reply2.modelPropertyName;

    return function (value) {
      this[_GQLBase.MODEL_KEY][modelPropertyName] = value;
    };
  };

  return reply;
}

/**
 * An array of proper class names that are used to test for cases where the 
 * proper usage of instantiating an instance should preclude the use of `new`
 *
 * @memberof decorators
 * @type {Array<String>}
 */
/** @namespace decorators */

extractBits.DIRECT_TYPES = [String.name];

/**
 * A small suite of functions a getter that allows easy manipulation of the 
 * the DIRECT_TYPES workaround needed for some types of complex class 
 * wrapping allowed by the @Getters and @Properties decorators. Namely the 
 * ability to do something like @Getters('name', String) which would wrap the 
 * contents of whatever is in the objects model in a String call. 
 *
 * Direct types are those that need to be called without `new` in order for the 
 * desired behavior to present itself. 
 *
 * @memberof decorators 
 * @type {Object}
 * @since 2.7.0
 */
const DirectTypeManager = exports.DirectTypeManager = {
  /**
   * A getter that retrieves the array of direct types 
   *
   * @method DirectTypeManager#types
   * @member {Array<String>} types
   * 
   * @return {Array<String>} an array of class name strings. 
   */
  get types() {
    return extractBits.DIRECT_TYPES;
  },

  /**
   * Appends the supplied class name to the list of registered direct types. If 
   * a class or function is passed, rather than a String, 
   *
   * @method DirectTypeManager#types
   *
   * @param {Function|string|RegExp} className the name of the class to append. 
   * Typically it is best to pass the name property of the class in question 
   * such as `RegExp.name` or `MyClass.name`.
   */
  add(className) {
    if (typeof className === 'function') {
      className = className.name;
    }

    extractBits.DIRECT_TYPES.push(className);
  },

  /**
   * Foricbly empties the contents of the extractBits.DIRECT_TYPES array. This 
   * is not recommended as it can have unintended consequences. It is 
   * recommended to use `reset` instead
   *
   * @method DirectTypeManager#clear
   *
   * @return {Array<string>} an array of class name Strings that were removed 
   * when cleared.
   */
  clear() {
    return extractBits.DIRECT_TYPES.splice(0, extractBits.DIRECT_TYPES.length);
  },

  /**
   * The recommended way to reset the DIRECT_TYPES list. This removes all 
   * changed values, returns the removed bits, and adds back in the defaults.
   *
   * @method DirectTypeManager#reset 
   *
   * @return {Array<string>} an array of class name Strings that were removed 
   * during the reset process.
   */
  reset() {
    return extractBits.DIRECT_TYPES.splice(0, extractBits.DIRECT_TYPES.length, String.name);
  }
};

/**
 * This decorator allows you to add a Class method to the DirectTypeManager 
 * as a function that should not be invoked with the `new` keyword. For all 
 * intents and purposes the function should be declared `static`.
 *
 * @method DirectTypeAdd
 * @param {Function} target [description]
 * @constructor
 */
function DirectTypeAdd(target) {
  DirectTypeManager.add(target);
  return target;
}

/**
 * When working with `GQLBase` instances that expose properties
 * that have a 1:1 mapping to their own model property of the
 * same name, adding the getters manually can be annoying. This
 * takes an indeterminate amount of strings representing the
 * properties for which getters should be injected.
 *
 * @function 🏷⠀Getters
 * @memberof! decorators
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 'name' 
 * and 'age' as properties, then passing those two strings will result
 * in getters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method.s
 */
function Getters(...propertyNames) {
  return function (target) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(propertyNames), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let property = _step.value;

        var _extractBits = extractBits(property);

        let typePropertyName = _extractBits.typePropertyName,
            getterMaker = _extractBits.getterMaker;


        (0, _defineProperty2.default)(target.prototype, typePropertyName, {
          get: getterMaker()
        });
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return target;
  };
}

/**
 * When working with `GQLBase` instances that expose properties
 * that have a 1:1 mapping to their own model property of the
 * same name, adding the setters manually can be annoying. This
 * takes an indeterminate amount of strings representing the
 * properties for which setters should be injected.
 *
 * @function 🏷⠀Setters
 * @memberof! decorators
 * @since 2.1.0
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 
 * 'name' and 'age' as properties, then passing those two strings will 
 * result in setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
function Setters(...propertyNames) {
  return function (target) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(propertyNames), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        let property = _step2.value;

        var _extractBits2 = extractBits(property);

        let typePropertyName = _extractBits2.typePropertyName,
            setterMaker = _extractBits2.setterMaker;


        (0, _defineProperty2.default)(target.prototype, typePropertyName, {
          set: setterMaker()
        });
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return target;
  };
}

/**
 * When working with `GQLBase` instances that expose properties
 * that have a 1:1 mapping to their own model property of the
 * same name, adding the getters manually can be annoying. This
 * takes an indeterminate amount of strings representing the
 * properties for which getters should be injected.
 *
 * This method creates both getters and setters
 *
 * @function 🏷⠀Properties
 * @memberof! decorators
 * @since 2.1.0
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 'name' 
 * and 'age' as properties, then passing those two strings will result
 * in getters and setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
function Properties(...propertyNames) {
  return function (target) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = (0, _getIterator3.default)(propertyNames), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        let property = _step3.value;

        var _extractBits3 = extractBits(property);

        let typePropertyName = _extractBits3.typePropertyName,
            getterMaker = _extractBits3.getterMaker,
            setterMaker = _extractBits3.setterMaker;


        (0, _defineProperty2.default)(target.prototype, typePropertyName, {
          set: setterMaker(),
          get: getterMaker()
        });
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return target;
  };
}

exports.default = Properties;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLEnum = undefined;

var _getIterator2 = __webpack_require__(21);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = __webpack_require__(145);

var _map2 = _interopRequireDefault(_map);

var _assign = __webpack_require__(28);

var _assign2 = _interopRequireDefault(_assign);

var _symbol = __webpack_require__(82);

var _symbol2 = _interopRequireDefault(_symbol);

var _for = __webpack_require__(17);

var _for2 = _interopRequireDefault(_for);

var _dec, _class; /**
                   @namespace GQLInterface
                   
                   */

var _GQLBase = __webpack_require__(6);

var _graphql = __webpack_require__(10);

var _ModelProperties = __webpack_require__(87);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Internal Symbol referring to real accessor to GQLBase model object */
const _MODEL_KEY = (0, _for2.default)('data-model-contents-value');

/* Internal Symbol referring to the static object containing a proxy handler */
const _PROXY_HANDLER = (0, _for2.default)('internal-base-proxy-handler');

/* Internal Symbol property referring to the mapping of values on the GQLEnum */
const ENUMS = (0, _symbol2.default)();

/**
 * GraphQL Enum types can be a bit picky when it comes to how scalar types 
 * equate to enum values. Lattice makes this easier by allowing you to specify 
 * a value or the key when your enum has a value other than the key; GraphQL 
 * does not allow this by default.
 *
 * Further more, when instantiating a GQLEnum type, you can pass a string or 
 * value matching the enum key or value or you can pass an object with key of 
 * value and the value being either the enum key or value. If any of those
 * things match, then your `instance.value` will equate to the enum's key. If,
 * on the other hand, your supplied values do not match then `instance.value` 
 * will be `null`.
 *
 * @class GQLEnum
 */
let GQLEnum = exports.GQLEnum = (_dec = (0, _ModelProperties.Getters)('symbol'), _dec(_class = class GQLEnum extends _GQLBase.GQLBase {
  constructor(enumValueOrKey, requestData) {
    super({}, requestData);

    const Class = this.constructor;
    const enums = Class.enums;
    let symbol;
    let enumVK = enumValueOrKey || null;

    symbol = enums[enumVK] || enumVK && enums[enumVK.value] || null;

    (0, _assign2.default)(this.getModel(), {
      name: symbol ? symbol.name : null,
      value: symbol ? symbol.value : null,
      symbol: symbol ? symbol : null
    });
  }

  /**
   * Retrieves the actual symbol stored name property from the internal 
   * model object for this enum instance. That is a mouthfull, but it 
   * basically means that if your enum is something like:
   * 
   * ```
   * enum Person { TALL, SHORT }
   * ```
   * 
   * and you create an instance using any of the following
   * 
   * ```
   * p = new Person('TALL')
   * p = new Person(valueFor('TALL'))
   * p = new Person({value: 'TALL'})
   * ```
   * 
   * that your response to `p.name` will equate to `TALL`.
   *
   * @method ⬇︎⠀name
   * @return {mixed} typically a String but any valid type supplied
   */
  get name() {
    const name = this.getModel().name;

    return name !== undefined && name !== null && name !== NaN ? name : null;
  }

  /**
   * Much like the `.name` getter, the `.value` getter will typically 
   * retreive the name of the enum key you are requesting. In rare cases 
   * where you have defined values that differ from the name, the `.value`
   * getter will retrieve that custom value from the `.value` property on 
   * the symbol in question.
   *
   * This should do the right thing even if you instantiated the instance 
   * using the name. 
   *
   * @memberof GQLEnum
   * @method ⬇︎⠀value
   * @return {mixed} the value of the enum type; this in all likihood should 
   * be a String or potentially an object
   */
  get value() {
    const value = this.getModel().value;

    return value !== undefined && value !== null && value !== NaN ? value : null;
  }

  /**
   * Determines the default type targeted by this GQLBase class. Any
   * type will technically be valid but only will trigger special behavior
   *
   * @memberof GQLEnum
   * @method ⬇︎⠀GQL_TYPE
   * @static
   * @const
   *
   * @return {Function} a type, such as `GraphQLObjectType` or
   * `GraphQLInterfaceType`
   */
  static get GQL_TYPE() {
    return _graphql.GraphQLEnumType;
  }

  /**
   * Each instance of GQLEnum must specify a map of keys and values. If this
   * method returns null or is not defined, the value of the enum will match
   * the name of the enum as per the reference implementation.
   *
   * Example:
   * ```
   *   static get values(): ?Object {
   *     const { valueOf } = this;
   *
   *     return {
   *       NAME: valueOf(value)
   *     }
   *   }
   * ```
   *
   * @method ⬇︎⠀values
   * @memberof GQLEnum
   * @static
   *
   * @return {Object|Null} an object mapping with each key mapping to an object
   * possessing at least a value field, which in turn maps to the desired value
   */
  static get values() {
    return {};
  }

  /**
   * Shorthand method to generate a GraphQLEnumValueDefinition implementation
   * object. Use this for building and customizing your `values` key/value
   * object in your child classes.
   *
   * @memberof GQLEnum
   * @method valueFor
   * @static
   *
   * @param {mixed} value any nonstandard value you wish your enum to have
   * @param {String} deprecationReason an optional reason to deprecate an enum
   * @param {String} description a non Lattice standard way to write a comment
   * @return {Object} an object that conforms to the GraphQLEnumValueDefinition
   * defined here http://graphql.org/graphql-js/type/#graphqlenumtype
   */
  static valueFor(value, deprecationReason, description) {
    const result = { value };

    if (deprecationReason) {
      result.deprecationReason = deprecationReason;
    }
    if (description) {
      result.description = description;
    }

    return result;
  }

  /**
   * For easier use within JavaScript, the static enums method provides a
   * Symbol backed solution for each of the enums defined. Each `Symbol`
   * instance is wrapped in Object so as to allow some additional properties
   * to be written to it.
   *
   * @memberof GQLEnum
   * @method ⬇︎⠀enums
   * @static
   *
   * @return {Array<Symbol>} an array of modified Symbols for each enum
   * variation defined.
   */
  static get enums() {
    // @ComputedType
    if (!this[ENUMS]) {
      const map = new _map2.default();
      const ast = (0, _graphql.parse)(this.SCHEMA);
      const array = new Proxy([], GQLEnum.GenerateEnumsProxyHandler(map));
      const values = this.values || {};
      let astValues;

      try {
        // TODO: $FlowFixMe
        astValues = ast.definitions[0].values;
      } catch (error) {
        console.error('Unable to discern the values from your enums SCHEMA');
        throw error;
      }

      // Walk the AST for the class' schema and extract the names (same as 
      // values when specified in GraphQL SDL) and build an object the has 
      // the actual defined value and the AST generated name/value. 
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(astValues), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let enumDef = _step.value;

          let defKey = enumDef.name.value;
          let symObj = Object((0, _for2.default)(defKey));

          symObj.value = values[defKey] && values[defKey].value || defKey;
          symObj.name = defKey;
          symObj.sym = symObj.valueOf();

          map.set(symObj.name, symObj);
          map.set(symObj.value, symObj);

          // This bit of logic allows us to look into the "enums" property and 
          // get the generated Object wrapped Symbol with keys and values by 
          // supplying either a key or value.
          array.push(symObj);
        }

        // @ComputedType
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this[ENUMS] = array;
    }

    // @ComputedType
    return this[ENUMS];
  }

  /**
   * Due to the complexity of being able to access both the keys and values 
   * properly for an enum type, a Map is used as the backing store. The handler 
   * returned by this method is to be passed to a Proxy.
   *
   * @method GenerateEnumsProxyHandler
   * @static 
   * 
   * @param {Map} map the map containing the key<->value and 
   * value<->key mappings; the true storage backing the array in question.
   * @return {Object}
   */
  static GenerateEnumsProxyHandler(map) {
    return {
      get(obj, key) {
        if (map.has(key)) {
          return map.get(key);
        }

        return obj[key];
      },

      set(obj, key, value) {
        if (isFinite(key) && value instanceof _symbol2.default) {
          map.set(value.name, value);
          map.set(value.value, value);
        }

        // Some accessor on the receiving array 
        obj[key] = value;

        // Arrays return length when pushing. Assume value as return 
        // otherwise. ¯\_(ツ)_/¯
        return isFinite(key) ? obj.length : obj[key];
      }
    };
  }

  /** @inheritdoc */
  static apiDocs() {
    const DOC_CLASS = this.DOC_CLASS,
          DOC_FIELDS = this.DOC_FIELDS,
          joinLines = this.joinLines;


    return {
      [DOC_CLASS]: joinLines`
        GQLEnums allow the definition of enum types with description fields
        and values other than a 1:1 mapping of their types and their type
        names. If you are reading this, the implementor likely did not
        contribute comments for their type.
      `
    };
  }
}) || _class);

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchemaUtils = undefined;

var _asyncToGenerator2 = __webpack_require__(25);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = __webpack_require__(28);

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = __webpack_require__(151);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = __webpack_require__(155);

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = __webpack_require__(21);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _path = __webpack_require__(39);

var _path2 = _interopRequireDefault(_path);

var _SyntaxTree = __webpack_require__(29);

var _GQLBase = __webpack_require__(6);

var _GQLEnum = __webpack_require__(88);

var _GQLInterface = __webpack_require__(62);

var _GQLScalar = __webpack_require__(40);

var _types = __webpack_require__(9);

var _events = __webpack_require__(61);

var _events2 = _interopRequireDefault(_events);

var _graphql = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The SchemaUtils is used by tools such as GQLExpressMiddleware in order to
 * apply GraphQL Lattice specifics to the build schema.
 *
 * @class SchemaUtils
 */
let SchemaUtils = exports.SchemaUtils = class SchemaUtils extends _events2.default {
  /**
   * Until such time as I can get the reference Facebook GraphQL AST parser to
   * read and apply descriptions or until such time as I employ the Apollo
   * AST parser, providing a `static get apiDocs()` getter is the way to get
   * your descriptions into the proper fields, post schema creation.
   *
   * This method walks the types in the registered classes and the supplied
   * schema type. It then injects the written comments such that they can
   * be exposed in graphiql and to applications or code that read the meta
   * fields of a built schema
   *
   * @memberof SchemaUtils
   * @method ⌾⠀injectComments
   * @static
   * @since 2.7.0
   *
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   * @param {Function[]} Classes these are GQLBase extended classes used to 
   * manipulate the schema with.
   */
  static injectComments(schema, Classes) {
    const DOC_CLASS = _GQLBase.GQLBase.DOC_CLASS,
          DOC_FIELDS = _GQLBase.GQLBase.DOC_FIELDS,
          DOC_QUERIES = _GQLBase.GQLBase.DOC_QUERIES,
          DOC_MUTATORS = _GQLBase.GQLBase.DOC_MUTATORS,
          DOC_SUBSCRIPTIONS = _GQLBase.GQLBase.DOC_SUBSCRIPTIONS;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {

      for (var _iterator = (0, _getIterator3.default)(Classes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let Class = _step.value;

        const docs = Class.apiDocs();
        const query = schema._typeMap.Query;
        const mutation = schema._typeMap.Mutation;
        const subscription = schema._typeMap.Subscription;
        let type;

        if (type = schema._typeMap[Class.name]) {
          let fields = type._fields;
          let values = type._values;

          if (docs[DOC_CLASS]) {
            type.description = docs[DOC_CLASS];
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(docs[DOC_FIELDS] || {})), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              let field = _step2.value;

              if (fields && field in fields) {
                fields[field].description = docs[DOC_FIELDS][field];
              }
              if (values) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = (0, _getIterator3.default)(values), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    let value = _step3.value;

                    if (value.name === field) {
                      value.description = docs[DOC_FIELDS][field];
                    }
                  }
                } catch (err) {
                  _didIteratorError3 = true;
                  _iteratorError3 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                      _iterator3.return();
                    }
                  } finally {
                    if (_didIteratorError3) {
                      throw _iteratorError3;
                    }
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        var _arr = [[query, DOC_QUERIES], [mutation, DOC_MUTATORS], [subscription, DOC_SUBSCRIPTIONS]];
        for (var _i = 0; _i < _arr.length; _i++) {
          let _ref = _arr[_i];

          var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

          let _type = _ref2[0];
          let _CONST = _ref2[1];

          if (_type && (0, _keys2.default)(docs[_CONST] || {}).length) {
            let fields = _type._fields;

            if (docs[_CONST][DOC_CLASS]) {
              _type.description = docs[_CONST][DOC_CLASS];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = (0, _getIterator3.default)((0, _keys2.default)(docs[_CONST])), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                let field = _step4.value;

                if (field in fields) {
                  fields[field].description = docs[_CONST][field];
                }
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  /**
   * Somewhat like `injectComments` and other similar methods, the
   * `injectInterfaceResolvers` method walks the registered classes and
   * finds `GQLInterface` types and applies their `resolveType()`
   * implementations.
   *
   * @memberof SchemaUtils
   * @method ⌾⠀injectInterfaceResolvers
   * @static
   *
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   * @param {Function[]} Classes these are GQLBase extended classes used to 
   * manipulate the schema with.
   */
  static injectInterfaceResolvers(schema, Classes) {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = (0, _getIterator3.default)(Classes), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        let Class = _step5.value;

        if (Class.GQL_TYPE === _graphql.GraphQLInterfaceType) {
          schema._typeMap[Class.name].resolveType = schema._typeMap[Class.name]._typeConfig.resolveType = Class.resolveType;
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }

  /**
   * Somewhat like `injectComments` and other similar methods, the
   * `injectInterfaceResolvers` method walks the registered classes and
   * finds `GQLInterface` types and applies their `resolveType()`
   * implementations.
   *
   * @memberof SchemaUtils
   * @method ⌾⠀injectEnums
   * @static
   *
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   * @param {Function[]} Classes these are GQLBase extended classes used to 
   * manipulate the schema with.
   */
  static injectEnums(schema, Classes) {
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = (0, _getIterator3.default)(Classes), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        let Class = _step6.value;

        if (Class.GQL_TYPE === _graphql.GraphQLEnumType) {
          const __enum = schema._typeMap[Class.name];
          const values = Class.values;

          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = (0, _getIterator3.default)(__enum._values), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              let value = _step7.value;

              if (value.name in values) {
                (0, _assign2.default)(value, values[value.name]);
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  }

  /**
   * GQLScalar types must define three methods to have a valid implementation.
   * They are serialize, parseValue and parseLiteral. See their docs for more 
   * info on how to do so.
   *
   * This code finds each scalar and adds their implementation details to the 
   * generated schema type config.
   *
   * @memberof SchemaUtils
   * @method ⌾⠀injectScalars
   * @static
   * 
   * @param {Object} schema a built GraphQLSchema object created via buildSchema
   * or some other alternative but compatible manner
   * @param {Function[]} Classes these are GQLBase extended classes used to 
   * manipulate the schema with.
   */
  static injectScalars(schema, Classes) {
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = (0, _getIterator3.default)(Classes), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        let Class = _step8.value;

        if (Class.GQL_TYPE === _graphql.GraphQLScalarType) {
          // @ComputedType
          const type = schema._typeMap[Class.name];

          // @ComputedType
          const serialize = Class.serialize,
                parseValue = Class.parseValue,
                parseLiteral = Class.parseLiteral;

          // @ComputedType

          console.dir(Class.name, type);

          if (!serialize || !parseValue || !parseLiteral) {
            // @ComputedType
            console.error(`Scalar type ${Class.name} has invaild impl.`);
            continue;
          }

          (0, _assign2.default)(type._scalarConfig, {
            serialize,
            parseValue,
            parseLiteral
          });
        }
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }
  }

  /**
   * A function that combines the IDL schemas of all the supplied classes and
   * returns that value to the middleware getter.
   *
   * @static
   * @memberof GQLExpressMiddleware
   * @method ⌾⠀generateSchemaSDL
   *
   * @return {string} a dynamically generated GraphQL IDL schema string
   */
  static generateSchemaSDL(Classes, logOutput = true) {
    let schema = _SyntaxTree.SyntaxTree.EmptyDocument();
    let log = (...args) => {
      if (logOutput) {
        console.log(...args);
      }
    };

    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = (0, _getIterator3.default)(Classes), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        let Class = _step9.value;

        let classSchema = Class.SCHEMA;

        if ((0, _types.typeOf)(classSchema) === 'Symbol') {
          let handler = Class.handler;
          let filename = _path2.default.basename(Class.handler.path);

          classSchema = handler.getSchema();
          log(`\nRead schema (%s)\n%s\n%s\n`, filename, '-'.repeat(14 + filename.length), classSchema.replace(/^/gm, '  '));
        }

        schema.appendDefinitions(classSchema);
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9.return) {
          _iterator9.return();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
        }
      }
    }

    log('\nGenerated GraphQL Schema\n----------------\n%s', schema);

    return schema.toString();
  }

  /**
   * An asynchronous function used to parse the supplied classes for each
   * ones resolvers and mutators. These are all combined into a single root
   * object passed to express-graphql.
   *
   * @static
   * @memberof SchemaUtils
   * @method ⌾⠀createMergedRoot
   *
   * @param {Function[]} Classes the GQLBase extended class objects or 
   * functions from which to merge the RESOLVERS and MUTATORS functions.
   * @param {Object} requestData for Express apss, this will be an object 
   * containing { req, res, gql } where those are the Express request and 
   * response object as well as the GraphQL parameters for the request. 
   * @return {Promise<Object>} a Promise resolving to an Object containing all
   * the functions described in both Query and Mutation types.
   */
  static createMergedRoot(Classes, requestData) {
    return (0, _asyncToGenerator3.default)(function* () {
      const root = {};

      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = (0, _getIterator3.default)(Classes), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          let Class = _step10.value;

          (0, _assign2.default)(root, (yield Class.RESOLVERS(requestData)), (yield Class.MUTATORS(requestData)));
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }

      return root;
    })();
  }
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperties = __webpack_require__(52);

var _defineProperties2 = _interopRequireDefault(_defineProperties);

exports.Schema = Schema;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @namespace decorators */


/**
 * This decorator allows you to specify the SCHEMA getter and associated 
 * string as a parameter to the decorator itself. So, for example:
 * 
 * <code>
 * @Schema(`
 *   type Item {
 *     name: String 
 *     cost: String 
 *   }
 * `)
 * export class Item extends GQLBase {
 *   // ...
 * }
 * </code>
 * 
 * @function Schema
 * @memberof! decorators
 * @since 2.2.0
 * 
 * @param {string} schemaString a GraphQL IDL compliant string for defining a 
 * GraphQL Object Schema.
 */
function Schema(schemaString) {
  return function (target) {
    // @ComputedType
    (0, _defineProperties2.default)(target, {
      SCHEMA: {
        get: () => schemaString
      }
    });
  };
}

exports.default = Schema;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenKind = undefined;
exports.createLexer = createLexer;
exports.getTokenDesc = getTokenDesc;

var _error = __webpack_require__(92);

/**
 * Given a Source object, this returns a Lexer for that source.
 * A Lexer is a stateful stream generator in that every time
 * it is advanced, it returns the next token in the Source. Assuming the
 * source lexes, the final Token emitted by the lexer will be of kind
 * EOF, after which the lexer will repeatedly return the same EOF token
 * whenever called.
 */
function createLexer(source, options) {
  var startOfFileToken = new Tok(SOF, 0, 0, 0, 0, null);
  var lexer = {
    source: source,
    options: options,
    lastToken: startOfFileToken,
    token: startOfFileToken,
    line: 1,
    lineStart: 0,
    advance: advanceLexer
  };
  return lexer;
} /*  /
  /**
   *  Copyright (c) 2015, Facebook, Inc.
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree. An additional grant
   *  of patent rights can be found in the PATENTS file in the same directory.
   */

function advanceLexer() {
  var token = this.lastToken = this.token;
  if (token.kind !== EOF) {
    do {
      token = token.next = readToken(this, token);
    } while (token.kind === COMMENT);
    this.token = token;
  }
  return token;
}

/**
 * The return type of createLexer.
 */


// Each kind of token.
var SOF = '<SOF>';
var EOF = '<EOF>';
var BANG = '!';
var DOLLAR = '$';
var PAREN_L = '(';
var PAREN_R = ')';
var SPREAD = '...';
var COLON = ':';
var EQUALS = '=';
var AT = '@';
var BRACKET_L = '[';
var BRACKET_R = ']';
var BRACE_L = '{';
var PIPE = '|';
var BRACE_R = '}';
var NAME = 'Name';
var INT = 'Int';
var FLOAT = 'Float';
var STRING = 'String';
var COMMENT = 'Comment';

/**
 * An exported enum describing the different kinds of tokens that the
 * lexer emits.
 */
var TokenKind = exports.TokenKind = {
  SOF: SOF,
  EOF: EOF,
  BANG: BANG,
  DOLLAR: DOLLAR,
  PAREN_L: PAREN_L,
  PAREN_R: PAREN_R,
  SPREAD: SPREAD,
  COLON: COLON,
  EQUALS: EQUALS,
  AT: AT,
  BRACKET_L: BRACKET_L,
  BRACKET_R: BRACKET_R,
  BRACE_L: BRACE_L,
  PIPE: PIPE,
  BRACE_R: BRACE_R,
  NAME: NAME,
  INT: INT,
  FLOAT: FLOAT,
  STRING: STRING,
  COMMENT: COMMENT
};

/**
 * A helper function to describe a token as a string for debugging
 */
function getTokenDesc(token) {
  var value = token.value;
  return value ? token.kind + ' "' + value + '"' : token.kind;
}

var charCodeAt = String.prototype.charCodeAt;
var slice = String.prototype.slice;

/**
 * Helper function for constructing the Token object.
 */
function Tok(kind, start, end, line, column, prev, value) {
  this.kind = kind;
  this.start = start;
  this.end = end;
  this.line = line;
  this.column = column;
  this.value = value;
  this.prev = prev;
  this.next = null;
}

// Print a simplified form when appearing in JSON/util.inspect.
Tok.prototype.toJSON = Tok.prototype.inspect = function toJSON() {
  return {
    kind: this.kind,
    value: this.value,
    line: this.line,
    column: this.column
  };
};

function printCharCode(code) {
  return (
    // NaN/undefined represents access beyond the end of the file.
    isNaN(code) ? EOF :
    // Trust JSON for ASCII.
    code < 0x007F ? JSON.stringify(String.fromCharCode(code)) :
    // Otherwise print the escaped form.
    '"\\u' + ('00' + code.toString(16).toUpperCase()).slice(-4) + '"'
  );
}

/**
 * Gets the next token from the source starting at the given position.
 *
 * This skips over whitespace and comments until it finds the next lexable
 * token, then lexes punctuators immediately or calls the appropriate helper
 * function for more complicated tokens.
 */
function readToken(lexer, prev) {
  var source = lexer.source;
  var body = source.body;
  var bodyLength = body.length;

  var position = positionAfterWhitespace(body, prev.end, lexer);
  var line = lexer.line;
  var col = 1 + position - lexer.lineStart;

  if (position >= bodyLength) {
    return new Tok(EOF, bodyLength, bodyLength, line, col, prev);
  }

  var code = charCodeAt.call(body, position);

  // SourceCharacter
  if (code < 0x0020 && code !== 0x0009 && code !== 0x000A && code !== 0x000D) {
    throw (0, _error.syntaxError)(source, position, 'Cannot contain the invalid character ' + printCharCode(code) + '.');
  }

  switch (code) {
    // !
    case 33:
      return new Tok(BANG, position, position + 1, line, col, prev);
    // #
    case 35:
      return readComment(source, position, line, col, prev);
    // $
    case 36:
      return new Tok(DOLLAR, position, position + 1, line, col, prev);
    // (
    case 40:
      return new Tok(PAREN_L, position, position + 1, line, col, prev);
    // )
    case 41:
      return new Tok(PAREN_R, position, position + 1, line, col, prev);
    // .
    case 46:
      if (charCodeAt.call(body, position + 1) === 46 && charCodeAt.call(body, position + 2) === 46) {
        return new Tok(SPREAD, position, position + 3, line, col, prev);
      }
      break;
    // :
    case 58:
      return new Tok(COLON, position, position + 1, line, col, prev);
    // =
    case 61:
      return new Tok(EQUALS, position, position + 1, line, col, prev);
    // @
    case 64:
      return new Tok(AT, position, position + 1, line, col, prev);
    // [
    case 91:
      return new Tok(BRACKET_L, position, position + 1, line, col, prev);
    // ]
    case 93:
      return new Tok(BRACKET_R, position, position + 1, line, col, prev);
    // {
    case 123:
      return new Tok(BRACE_L, position, position + 1, line, col, prev);
    // |
    case 124:
      return new Tok(PIPE, position, position + 1, line, col, prev);
    // }
    case 125:
      return new Tok(BRACE_R, position, position + 1, line, col, prev);
    // A-Z _ a-z
    case 65:case 66:case 67:case 68:case 69:case 70:case 71:case 72:
    case 73:case 74:case 75:case 76:case 77:case 78:case 79:case 80:
    case 81:case 82:case 83:case 84:case 85:case 86:case 87:case 88:
    case 89:case 90:
    case 95:
    case 97:case 98:case 99:case 100:case 101:case 102:case 103:case 104:
    case 105:case 106:case 107:case 108:case 109:case 110:case 111:
    case 112:case 113:case 114:case 115:case 116:case 117:case 118:
    case 119:case 120:case 121:case 122:
      return readName(source, position, line, col, prev);
    // - 0-9
    case 45:
    case 48:case 49:case 50:case 51:case 52:
    case 53:case 54:case 55:case 56:case 57:
      return readNumber(source, position, code, line, col, prev);
    // "
    case 34:
      return readString(source, position, line, col, prev);
  }

  throw (0, _error.syntaxError)(source, position, unexpectedCharacterMessage(code));
}

/**
 * Report a message that an unexpected character was encountered.
 */
function unexpectedCharacterMessage(code) {
  if (code === 39) {
    // '
    return 'Unexpected single quote character (\'), did you mean to use ' + 'a double quote (")?';
  }

  return 'Cannot parse the unexpected character ' + printCharCode(code) + '.';
}

/**
 * Reads from body starting at startPosition until it finds a non-whitespace
 * or commented character, then returns the position of that character for
 * lexing.
 */
function positionAfterWhitespace(body, startPosition, lexer) {
  var bodyLength = body.length;
  var position = startPosition;
  while (position < bodyLength) {
    var code = charCodeAt.call(body, position);
    // tab | space | comma | BOM
    if (code === 9 || code === 32 || code === 44 || code === 0xFEFF) {
      ++position;
    } else if (code === 10) {
      // new line
      ++position;
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 13) {
      // carriage return
      if (charCodeAt.call(body, position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }
      ++lexer.line;
      lexer.lineStart = position;
    } else {
      break;
    }
  }
  return position;
}

/**
 * Reads a comment token from the source file.
 *
 * #[\u0009\u0020-\uFFFF]*
 */
function readComment(source, start, line, col, prev) {
  var body = source.body;
  var code = void 0;
  var position = start;

  do {
    code = charCodeAt.call(body, ++position);
  } while (code !== null && (
  // SourceCharacter but not LineTerminator
  code > 0x001F || code === 0x0009));

  return new Tok(COMMENT, start, position, line, col, prev, slice.call(body, start + 1, position));
}

/**
 * Reads a number token from the source file, either a float
 * or an int depending on whether a decimal point appears.
 *
 * Int:   -?(0|[1-9][0-9]*)
 * Float: -?(0|[1-9][0-9]*)(\.[0-9]+)?((E|e)(+|-)?[0-9]+)?
 */
function readNumber(source, start, firstCode, line, col, prev) {
  var body = source.body;
  var code = firstCode;
  var position = start;
  var isFloat = false;

  if (code === 45) {
    // -
    code = charCodeAt.call(body, ++position);
  }

  if (code === 48) {
    // 0
    code = charCodeAt.call(body, ++position);
    if (code >= 48 && code <= 57) {
      throw (0, _error.syntaxError)(source, position, 'Invalid number, unexpected digit after 0: ' + printCharCode(code) + '.');
    }
  } else {
    position = readDigits(source, position, code);
    code = charCodeAt.call(body, position);
  }

  if (code === 46) {
    // .
    isFloat = true;

    code = charCodeAt.call(body, ++position);
    position = readDigits(source, position, code);
    code = charCodeAt.call(body, position);
  }

  if (code === 69 || code === 101) {
    // E e
    isFloat = true;

    code = charCodeAt.call(body, ++position);
    if (code === 43 || code === 45) {
      // + -
      code = charCodeAt.call(body, ++position);
    }
    position = readDigits(source, position, code);
  }

  return new Tok(isFloat ? FLOAT : INT, start, position, line, col, prev, slice.call(body, start, position));
}

/**
 * Returns the new position in the source after reading digits.
 */
function readDigits(source, start, firstCode) {
  var body = source.body;
  var position = start;
  var code = firstCode;
  if (code >= 48 && code <= 57) {
    // 0 - 9
    do {
      code = charCodeAt.call(body, ++position);
    } while (code >= 48 && code <= 57); // 0 - 9
    return position;
  }
  throw (0, _error.syntaxError)(source, position, 'Invalid number, expected digit but got: ' + printCharCode(code) + '.');
}

/**
 * Reads a string token from the source file.
 *
 * "([^"\\\u000A\u000D]|(\\(u[0-9a-fA-F]{4}|["\\/bfnrt])))*"
 */
function readString(source, start, line, col, prev) {
  var body = source.body;
  var position = start + 1;
  var chunkStart = position;
  var code = 0;
  var value = '';

  while (position < body.length && (code = charCodeAt.call(body, position)) !== null &&
  // not LineTerminator
  code !== 0x000A && code !== 0x000D &&
  // not Quote (")
  code !== 34) {
    // SourceCharacter
    if (code < 0x0020 && code !== 0x0009) {
      throw (0, _error.syntaxError)(source, position, 'Invalid character within String: ' + printCharCode(code) + '.');
    }

    ++position;
    if (code === 92) {
      // \
      value += slice.call(body, chunkStart, position - 1);
      code = charCodeAt.call(body, position);
      switch (code) {
        case 34:
          value += '"';break;
        case 47:
          value += '/';break;
        case 92:
          value += '\\';break;
        case 98:
          value += '\b';break;
        case 102:
          value += '\f';break;
        case 110:
          value += '\n';break;
        case 114:
          value += '\r';break;
        case 116:
          value += '\t';break;
        case 117:
          // u
          var charCode = uniCharCode(charCodeAt.call(body, position + 1), charCodeAt.call(body, position + 2), charCodeAt.call(body, position + 3), charCodeAt.call(body, position + 4));
          if (charCode < 0) {
            throw (0, _error.syntaxError)(source, position, 'Invalid character escape sequence: ' + ('\\u' + body.slice(position + 1, position + 5) + '.'));
          }
          value += String.fromCharCode(charCode);
          position += 4;
          break;
        default:
          throw (0, _error.syntaxError)(source, position, 'Invalid character escape sequence: \\' + String.fromCharCode(code) + '.');
      }
      ++position;
      chunkStart = position;
    }
  }

  if (code !== 34) {
    // quote (")
    throw (0, _error.syntaxError)(source, position, 'Unterminated string.');
  }

  value += slice.call(body, chunkStart, position);
  return new Tok(STRING, start, position + 1, line, col, prev, value);
}

/**
 * Converts four hexidecimal chars to the integer that the
 * string represents. For example, uniCharCode('0','0','0','f')
 * will return 15, and uniCharCode('0','0','f','f') returns 255.
 *
 * Returns a negative number on error, if a char was invalid.
 *
 * This is implemented by noting that char2hex() returns -1 on error,
 * which means the result of ORing the char2hex() will also be negative.
 */
function uniCharCode(a, b, c, d) {
  return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
}

/**
 * Converts a hex character to its integer value.
 * '0' becomes 0, '9' becomes 9
 * 'A' becomes 10, 'F' becomes 15
 * 'a' becomes 10, 'f' becomes 15
 *
 * Returns -1 on error.
 */
function char2hex(a) {
  return a >= 48 && a <= 57 ? a - 48 : // 0-9
  a >= 65 && a <= 70 ? a - 55 : // A-F
  a >= 97 && a <= 102 ? a - 87 : // a-f
  -1;
}

/**
 * Reads an alphanumeric + underscore name from the source.
 *
 * [_A-Za-z][_0-9A-Za-z]*
 */
function readName(source, position, line, col, prev) {
  var body = source.body;
  var bodyLength = body.length;
  var end = position + 1;
  var code = 0;
  while (end !== bodyLength && (code = charCodeAt.call(body, end)) !== null && (code === 95 || // _
  code >= 48 && code <= 57 || // 0-9
  code >= 65 && code <= 90 || // A-Z
  code >= 97 && code <= 122 // a-z
  )) {
    ++end;
  }
  return new Tok(NAME, position, end, line, col, prev, slice.call(body, position, end));
}

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GraphQLError = __webpack_require__(64);

Object.defineProperty(exports, 'GraphQLError', {
  enumerable: true,
  get: function get() {
    return _GraphQLError.GraphQLError;
  }
});

var _syntaxError = __webpack_require__(164);

Object.defineProperty(exports, 'syntaxError', {
  enumerable: true,
  get: function get() {
    return _syntaxError.syntaxError;
  }
});

var _locatedError = __webpack_require__(165);

Object.defineProperty(exports, 'locatedError', {
  enumerable: true,
  get: function get() {
    return _locatedError.locatedError;
  }
});

var _formatError = __webpack_require__(166);

Object.defineProperty(exports, 'formatError', {
  enumerable: true,
  get: function get() {
    return _formatError.formatError;
  }
});

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * A representation of source input to GraphQL. The name is optional,
 * but is mostly useful for clients who store GraphQL documents in
 * source files; for example, if the GraphQL input is in a file Foo.graphql,
 * it might be useful for name to be "Foo.graphql".
 */
var Source = exports.Source = function Source(body, name) {
  _classCallCheck(this, Source);

  this.body = body;
  this.name = name || 'GraphQL request';
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Name

var NAME = exports.NAME = 'Name';

// Document

var DOCUMENT = exports.DOCUMENT = 'Document';
var OPERATION_DEFINITION = exports.OPERATION_DEFINITION = 'OperationDefinition';
var VARIABLE_DEFINITION = exports.VARIABLE_DEFINITION = 'VariableDefinition';
var VARIABLE = exports.VARIABLE = 'Variable';
var SELECTION_SET = exports.SELECTION_SET = 'SelectionSet';
var FIELD = exports.FIELD = 'Field';
var ARGUMENT = exports.ARGUMENT = 'Argument';

// Fragments

var FRAGMENT_SPREAD = exports.FRAGMENT_SPREAD = 'FragmentSpread';
var INLINE_FRAGMENT = exports.INLINE_FRAGMENT = 'InlineFragment';
var FRAGMENT_DEFINITION = exports.FRAGMENT_DEFINITION = 'FragmentDefinition';

// Values

var INT = exports.INT = 'IntValue';
var FLOAT = exports.FLOAT = 'FloatValue';
var STRING = exports.STRING = 'StringValue';
var BOOLEAN = exports.BOOLEAN = 'BooleanValue';
var NULL = exports.NULL = 'NullValue';
var ENUM = exports.ENUM = 'EnumValue';
var LIST = exports.LIST = 'ListValue';
var OBJECT = exports.OBJECT = 'ObjectValue';
var OBJECT_FIELD = exports.OBJECT_FIELD = 'ObjectField';

// Directives

var DIRECTIVE = exports.DIRECTIVE = 'Directive';

// Types

var NAMED_TYPE = exports.NAMED_TYPE = 'NamedType';
var LIST_TYPE = exports.LIST_TYPE = 'ListType';
var NON_NULL_TYPE = exports.NON_NULL_TYPE = 'NonNullType';

// Type System Definitions

var SCHEMA_DEFINITION = exports.SCHEMA_DEFINITION = 'SchemaDefinition';
var OPERATION_TYPE_DEFINITION = exports.OPERATION_TYPE_DEFINITION = 'OperationTypeDefinition';

// Type Definitions

var SCALAR_TYPE_DEFINITION = exports.SCALAR_TYPE_DEFINITION = 'ScalarTypeDefinition';
var OBJECT_TYPE_DEFINITION = exports.OBJECT_TYPE_DEFINITION = 'ObjectTypeDefinition';
var FIELD_DEFINITION = exports.FIELD_DEFINITION = 'FieldDefinition';
var INPUT_VALUE_DEFINITION = exports.INPUT_VALUE_DEFINITION = 'InputValueDefinition';
var INTERFACE_TYPE_DEFINITION = exports.INTERFACE_TYPE_DEFINITION = 'InterfaceTypeDefinition';
var UNION_TYPE_DEFINITION = exports.UNION_TYPE_DEFINITION = 'UnionTypeDefinition';
var ENUM_TYPE_DEFINITION = exports.ENUM_TYPE_DEFINITION = 'EnumTypeDefinition';
var ENUM_VALUE_DEFINITION = exports.ENUM_VALUE_DEFINITION = 'EnumValueDefinition';
var INPUT_OBJECT_TYPE_DEFINITION = exports.INPUT_OBJECT_TYPE_DEFINITION = 'InputObjectTypeDefinition';

// Type Extensions

var TYPE_EXTENSION_DEFINITION = exports.TYPE_EXTENSION_DEFINITION = 'TypeExtensionDefinition';

// Directive Definitions

var DIRECTIVE_DEFINITION = exports.DIRECTIVE_DEFINITION = 'DirectiveDefinition';

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visit = visit;
exports.visitInParallel = visitInParallel;
exports.visitWithTypeInfo = visitWithTypeInfo;
exports.getVisitFn = getVisitFn;
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var QueryDocumentKeys = exports.QueryDocumentKeys = {
  Name: [],

  Document: ['definitions'],
  OperationDefinition: ['name', 'variableDefinitions', 'directives', 'selectionSet'],
  VariableDefinition: ['variable', 'type', 'defaultValue'],
  Variable: ['name'],
  SelectionSet: ['selections'],
  Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
  Argument: ['name', 'value'],

  FragmentSpread: ['name', 'directives'],
  InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
  FragmentDefinition: ['name', 'typeCondition', 'directives', 'selectionSet'],

  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ['values'],
  ObjectValue: ['fields'],
  ObjectField: ['name', 'value'],

  Directive: ['name', 'arguments'],

  NamedType: ['name'],
  ListType: ['type'],
  NonNullType: ['type'],

  SchemaDefinition: ['directives', 'operationTypes'],
  OperationTypeDefinition: ['type'],

  ScalarTypeDefinition: ['name', 'directives'],
  ObjectTypeDefinition: ['name', 'interfaces', 'directives', 'fields'],
  FieldDefinition: ['name', 'arguments', 'type', 'directives'],
  InputValueDefinition: ['name', 'type', 'defaultValue', 'directives'],
  InterfaceTypeDefinition: ['name', 'directives', 'fields'],
  UnionTypeDefinition: ['name', 'directives', 'types'],
  EnumTypeDefinition: ['name', 'directives', 'values'],
  EnumValueDefinition: ['name', 'directives'],
  InputObjectTypeDefinition: ['name', 'directives', 'fields'],

  TypeExtensionDefinition: ['definition'],

  DirectiveDefinition: ['name', 'arguments', 'locations']
};

var BREAK = exports.BREAK = {};

/**
 * visit() will walk through an AST using a depth first traversal, calling
 * the visitor's enter function at each node in the traversal, and calling the
 * leave function after visiting that node and all of its child nodes.
 *
 * By returning different values from the enter and leave functions, the
 * behavior of the visitor can be altered, including skipping over a sub-tree of
 * the AST (by returning false), editing the AST by returning a value or null
 * to remove the value, or to stop the whole traversal by returning BREAK.
 *
 * When using visit() to edit an AST, the original AST will not be modified, and
 * a new version of the AST with the changes applied will be returned from the
 * visit function.
 *
 *     const editedAST = visit(ast, {
 *       enter(node, key, parent, path, ancestors) {
 *         // @return
 *         //   undefined: no action
 *         //   false: skip visiting this node
 *         //   visitor.BREAK: stop visiting altogether
 *         //   null: delete this node
 *         //   any value: replace this node with the returned value
 *       },
 *       leave(node, key, parent, path, ancestors) {
 *         // @return
 *         //   undefined: no action
 *         //   false: no action
 *         //   visitor.BREAK: stop visiting altogether
 *         //   null: delete this node
 *         //   any value: replace this node with the returned value
 *       }
 *     });
 *
 * Alternatively to providing enter() and leave() functions, a visitor can
 * instead provide functions named the same as the kinds of AST nodes, or
 * enter/leave visitors at a named key, leading to four permutations of
 * visitor API:
 *
 * 1) Named visitors triggered when entering a node a specific kind.
 *
 *     visit(ast, {
 *       Kind(node) {
 *         // enter the "Kind" node
 *       }
 *     })
 *
 * 2) Named visitors that trigger upon entering and leaving a node of
 *    a specific kind.
 *
 *     visit(ast, {
 *       Kind: {
 *         enter(node) {
 *           // enter the "Kind" node
 *         }
 *         leave(node) {
 *           // leave the "Kind" node
 *         }
 *       }
 *     })
 *
 * 3) Generic visitors that trigger upon entering and leaving any node.
 *
 *     visit(ast, {
 *       enter(node) {
 *         // enter any node
 *       },
 *       leave(node) {
 *         // leave any node
 *       }
 *     })
 *
 * 4) Parallel visitors for entering and leaving nodes of a specific kind.
 *
 *     visit(ast, {
 *       enter: {
 *         Kind(node) {
 *           // enter the "Kind" node
 *         }
 *       },
 *       leave: {
 *         Kind(node) {
 *           // leave the "Kind" node
 *         }
 *       }
 *     })
 */
function visit(root, visitor, keyMap) {
  var visitorKeys = keyMap || QueryDocumentKeys;

  var stack = void 0;
  var inArray = Array.isArray(root);
  var keys = [root];
  var index = -1;
  var edits = [];
  var parent = void 0;
  var path = [];
  var ancestors = [];
  var newRoot = root;

  do {
    index++;
    var isLeaving = index === keys.length;
    var key = void 0;
    var node = void 0;
    var isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path.pop();
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray) {
          node = node.slice();
        } else {
          var clone = {};
          for (var k in node) {
            if (node.hasOwnProperty(k)) {
              clone[k] = node[k];
            }
          }
          node = clone;
        }
        var editOffset = 0;
        for (var ii = 0; ii < edits.length; ii++) {
          var editKey = edits[ii][0];
          var editValue = edits[ii][1];
          if (inArray) {
            editKey -= editOffset;
          }
          if (inArray && editValue === null) {
            node.splice(editKey, 1);
            editOffset++;
          } else {
            node[editKey] = editValue;
          }
        }
      }
      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? inArray ? index : keys[index] : undefined;
      node = parent ? parent[key] : newRoot;
      if (node === null || node === undefined) {
        continue;
      }
      if (parent) {
        path.push(key);
      }
    }

    var result = void 0;
    if (!Array.isArray(node)) {
      if (!isNode(node)) {
        throw new Error('Invalid AST Node: ' + JSON.stringify(node));
      }
      var visitFn = getVisitFn(visitor, node.kind, isLeaving);
      if (visitFn) {
        result = visitFn.call(visitor, node, key, parent, path, ancestors);

        if (result === BREAK) {
          break;
        }

        if (result === false) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== undefined) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (isNode(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
    }

    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }

    if (!isLeaving) {
      stack = { inArray: inArray, index: index, keys: keys, edits: edits, prev: stack };
      inArray = Array.isArray(node);
      keys = inArray ? node : visitorKeys[node.kind] || [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== undefined);

  if (edits.length !== 0) {
    newRoot = edits[edits.length - 1][1];
  }

  return newRoot;
}

function isNode(maybeNode) {
  return maybeNode && typeof maybeNode.kind === 'string';
}

/**
 * Creates a new visitor instance which delegates to many visitors to run in
 * parallel. Each visitor will be visited for each node before moving on.
 *
 * If a prior visitor edits a node, no following visitors will see that node.
 */
function visitInParallel(visitors) {
  var skipping = new Array(visitors.length);

  return {
    enter: function enter(node) {
      for (var i = 0; i < visitors.length; i++) {
        if (!skipping[i]) {
          var fn = getVisitFn(visitors[i], node.kind, /* isLeaving */false);
          if (fn) {
            var result = fn.apply(visitors[i], arguments);
            if (result === false) {
              skipping[i] = node;
            } else if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== undefined) {
              return result;
            }
          }
        }
      }
    },
    leave: function leave(node) {
      for (var i = 0; i < visitors.length; i++) {
        if (!skipping[i]) {
          var fn = getVisitFn(visitors[i], node.kind, /* isLeaving */true);
          if (fn) {
            var result = fn.apply(visitors[i], arguments);
            if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== undefined && result !== false) {
              return result;
            }
          }
        } else if (skipping[i] === node) {
          skipping[i] = null;
        }
      }
    }
  };
}

/**
 * Creates a new visitor instance which maintains a provided TypeInfo instance
 * along with visiting visitor.
 */
function visitWithTypeInfo(typeInfo, visitor) {
  return {
    enter: function enter(node) {
      typeInfo.enter(node);
      var fn = getVisitFn(visitor, node.kind, /* isLeaving */false);
      if (fn) {
        var result = fn.apply(visitor, arguments);
        if (result !== undefined) {
          typeInfo.leave(node);
          if (isNode(result)) {
            typeInfo.enter(result);
          }
        }
        return result;
      }
    },
    leave: function leave(node) {
      var fn = getVisitFn(visitor, node.kind, /* isLeaving */true);
      var result = void 0;
      if (fn) {
        result = fn.apply(visitor, arguments);
      }
      typeInfo.leave(node);
      return result;
    }
  };
}

/**
 * Given a visitor instance, if it is leaving or not, and a node kind, return
 * the function the visitor runtime should call.
 */
function getVisitFn(visitor, kind, isLeaving) {
  var kindVisitor = visitor[kind];
  if (kindVisitor) {
    if (!isLeaving && typeof kindVisitor === 'function') {
      // { Kind() {} }
      return kindVisitor;
    }
    var kindSpecificVisitor = isLeaving ? kindVisitor.leave : kindVisitor.enter;
    if (typeof kindSpecificVisitor === 'function') {
      // { Kind: { enter() {}, leave() {} } }
      return kindSpecificVisitor;
    }
  } else {
    var specificVisitor = isLeaving ? visitor.leave : visitor.enter;
    if (specificVisitor) {
      if (typeof specificVisitor === 'function') {
        // { enter() {}, leave() {} }
        return specificVisitor;
      }
      var specificKindVisitor = specificVisitor[kind];
      if (typeof specificKindVisitor === 'function') {
        // { enter: { Kind() {} }, leave: { Kind() {} } }
        return specificKindVisitor;
      }
    }
  }
}

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOC_SUBSCRIPTIONS = exports.DOC_MUTATORS = exports.DOC_QUERIES = exports.DOC_FIELDS = exports.DOC_CLASS = exports.MODEL_KEY = exports.types = exports.typeOf = exports.SyntaxTree = exports.Setters = exports.SchemaUtils = exports.Schema = exports.Properties = exports.promisify = exports.joinLines = exports.ModuleParser = exports.GQLScalar = exports.GQLJSON = exports.GQLInterface = exports.GQLExpressMiddleware = exports.GQLEnum = exports.GQLBase = exports.Getters = exports.FileSchema = exports.DirectTypeManager = exports.Deferred = exports.AdjacentSchema = undefined;

var _AdjacentSchema = __webpack_require__(97);

var _utils = __webpack_require__(59);

var _FileSchema = __webpack_require__(144);

var _ModelProperties = __webpack_require__(87);

var _GQLBase = __webpack_require__(6);

var _GQLEnum = __webpack_require__(88);

var _GQLExpressMiddleware = __webpack_require__(149);

var _GQLInterface = __webpack_require__(62);

var _GQLJSON = __webpack_require__(159);

var _GQLScalar = __webpack_require__(40);

var _ModuleParser = __webpack_require__(170);

var _Schema = __webpack_require__(90);

var _SchemaUtils = __webpack_require__(89);

var _SyntaxTree = __webpack_require__(29);

var _types = __webpack_require__(9);

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const typeOf = types.typeOf;
const DOC_CLASS = _GQLBase.GQLBase.DOC_CLASS,
      DOC_FIELDS = _GQLBase.GQLBase.DOC_FIELDS,
      DOC_QUERIES = _GQLBase.GQLBase.DOC_QUERIES,
      DOC_MUTATORS = _GQLBase.GQLBase.DOC_MUTATORS,
      DOC_SUBSCRIPTIONS = _GQLBase.GQLBase.DOC_SUBSCRIPTIONS;

/* Create a friendly bundle to export all at once */

const defaultPackage = {
  AdjacentSchema: _AdjacentSchema.AdjacentSchema,
  Deferred: _utils.Deferred,
  DirectTypeManager: _ModelProperties.DirectTypeManager,
  FileSchema: _FileSchema.FileSchema,
  Getters: _ModelProperties.Getters,
  GQLBase: _GQLBase.GQLBase,
  GQLEnum: _GQLEnum.GQLEnum,
  GQLExpressMiddleware: _GQLExpressMiddleware.GQLExpressMiddleware,
  GQLInterface: _GQLInterface.GQLInterface,
  GQLJSON: _GQLJSON.GQLJSON,
  GQLScalar: _GQLScalar.GQLScalar,
  ModuleParser: _ModuleParser.ModuleParser,
  joinLines: _utils.joinLines,
  promisify: _utils.promisify,
  Properties: _ModelProperties.Properties,
  Schema: _Schema.Schema,
  SchemaUtils: _SchemaUtils.SchemaUtils,
  Setters: _ModelProperties.Setters,
  SyntaxTree: _SyntaxTree.SyntaxTree,
  typeOf,
  types,

  MODEL_KEY: _GQLBase.MODEL_KEY,
  DOC_CLASS,
  DOC_FIELDS,
  DOC_QUERIES,
  DOC_MUTATORS,
  DOC_SUBSCRIPTIONS
};

/* Also export each of the constructs individually */
exports.AdjacentSchema = _AdjacentSchema.AdjacentSchema;
exports.Deferred = _utils.Deferred;
exports.DirectTypeManager = _ModelProperties.DirectTypeManager;
exports.FileSchema = _FileSchema.FileSchema;
exports.Getters = _ModelProperties.Getters;
exports.GQLBase = _GQLBase.GQLBase;
exports.GQLEnum = _GQLEnum.GQLEnum;
exports.GQLExpressMiddleware = _GQLExpressMiddleware.GQLExpressMiddleware;
exports.GQLInterface = _GQLInterface.GQLInterface;
exports.GQLJSON = _GQLJSON.GQLJSON;
exports.GQLScalar = _GQLScalar.GQLScalar;
exports.ModuleParser = _ModuleParser.ModuleParser;
exports.joinLines = _utils.joinLines;
exports.promisify = _utils.promisify;
exports.Properties = _ModelProperties.Properties;
exports.Schema = _Schema.Schema;
exports.SchemaUtils = _SchemaUtils.SchemaUtils;
exports.Setters = _ModelProperties.Setters;
exports.SyntaxTree = _SyntaxTree.SyntaxTree;
exports.typeOf = typeOf;
exports.types = types;
exports.MODEL_KEY = _GQLBase.MODEL_KEY;
exports.DOC_CLASS = DOC_CLASS;
exports.DOC_FIELDS = DOC_FIELDS;
exports.DOC_QUERIES = DOC_QUERIES;
exports.DOC_MUTATORS = DOC_MUTATORS;
exports.DOC_SUBSCRIPTIONS = DOC_SUBSCRIPTIONS;
exports.default = defaultPackage;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdjacentSchema = undefined;

var _for = __webpack_require__(17);

var _for2 = _interopRequireDefault(_for);

var _defineProperties = __webpack_require__(52);

var _defineProperties2 = _interopRequireDefault(_defineProperties);

exports.default = AdjacentSchema;

var _GQLBase = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A decorator that does three things. First it defines the
 * module() static method that is required when using adjacent
 * schema files. Secondly, it defines a SCHEMA getter that
 * returns `GQLBase.ADJACENT_FILE`. Finally it sets a static
 * getter with the `Symbol`, `@adjacentSchema` so that other
 * can determine whether or not the decorator was used.
 *
 * @function AdjacentSchema
 * @memberof! decorators
 * @since 2.1.0
 *
 * @param {mixed} object the object on which to apply the decorator
 * @param {String} property the name of the object or property to
 * which the decorator is being applied.
 * @param {Object} descriptor a standard Object.defineProperty style
 * descriptor object.
 */
function AdjacentSchema(classModule) {
  return function (target) {
    // Attempt to remove the SCHEMA and module properties or functions from 
    // the class being decorated. This is not guaranteed to work but should 
    // increase compatibilty and success rates.
    // @ComputedType
    delete target.SCHEMA;
    // @ComputedType
    delete target.module;

    // @ComputedType
    return (0, _defineProperties2.default)(target, {
      module: {
        get: () => classModule
      },

      SCHEMA: {
        get: () => _GQLBase.GQLBase.ADJACENT_FILE
      },

      [(0, _for2.default)('@adjacentSchema')]: {
        get: () => true
      }
    });
  };
} /** @namespace decorators */


exports.AdjacentSchema = AdjacentSchema;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(65);
module.exports = __webpack_require__(0).Symbol['for'];

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(18)
  , toIObject = __webpack_require__(15);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(15)
  , toLength  = __webpack_require__(34)
  , toIndex   = __webpack_require__(101);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(48)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(18)
  , gOPS    = __webpack_require__(51)
  , pIE     = __webpack_require__(35);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(15)
  , gOPN      = __webpack_require__(72).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(35)
  , createDesc     = __webpack_require__(22)
  , toIObject      = __webpack_require__(15)
  , toPrimitive    = __webpack_require__(43)
  , has            = __webpack_require__(11)
  , IE8_DOM_DEFINE = __webpack_require__(66)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(4) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(106);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperties(T, D){
  return $Object.defineProperties(T, D);
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(2);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(4), 'Object', {defineProperties: __webpack_require__(70)});

/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(109);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(2);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(4), 'Object', {defineProperty: __webpack_require__(5).f});

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26);
__webpack_require__(16);
__webpack_require__(20);
__webpack_require__(115);
module.exports = __webpack_require__(0).Promise;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(48)
  , defined   = __webpack_require__(33);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(36)
  , descriptor     = __webpack_require__(22)
  , setToStringTag = __webpack_require__(23)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(8)(IteratorPrototype, __webpack_require__(1)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(114)
  , step             = __webpack_require__(76)
  , Iterators        = __webpack_require__(19)
  , toIObject        = __webpack_require__(15);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(53)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 114 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY            = __webpack_require__(32)
  , global             = __webpack_require__(3)
  , ctx                = __webpack_require__(13)
  , classof            = __webpack_require__(37)
  , $export            = __webpack_require__(2)
  , isObject           = __webpack_require__(14)
  , aFunction          = __webpack_require__(41)
  , anInstance         = __webpack_require__(54)
  , forOf              = __webpack_require__(38)
  , speciesConstructor = __webpack_require__(116)
  , task               = __webpack_require__(79).set
  , microtask          = __webpack_require__(118)()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(56)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
__webpack_require__(23)($Promise, PROMISE);
__webpack_require__(80)(PROMISE);
Wrapper = __webpack_require__(0)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(81)(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(7)
  , aFunction = __webpack_require__(41)
  , SPECIES   = __webpack_require__(1)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 117 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , macrotask = __webpack_require__(79).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(24)(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26);
module.exports = __webpack_require__(31).f('toStringTag');

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(121);
module.exports = __webpack_require__(0).Object.assign;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(2);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(122)});

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(18)
  , gOPS     = __webpack_require__(51)
  , pIE      = __webpack_require__(35)
  , toObject = __webpack_require__(27)
  , IObject  = __webpack_require__(47)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(12)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(65);
__webpack_require__(26);
__webpack_require__(124);
__webpack_require__(125);
module.exports = __webpack_require__(0).Symbol;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(46)('asyncIterator');

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(46)('observable');

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26);
__webpack_require__(16);
__webpack_require__(20);
__webpack_require__(127);
__webpack_require__(131);
module.exports = __webpack_require__(0).Set;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(83);

// 23.2 Set Objects
module.exports = __webpack_require__(84)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = __webpack_require__(13)
  , IObject  = __webpack_require__(47)
  , toObject = __webpack_require__(27)
  , toLength = __webpack_require__(34)
  , asc      = __webpack_require__(129);
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(130);

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14)
  , isArray  = __webpack_require__(69)
  , SPECIES  = __webpack_require__(1)('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(2);

$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(85)('Set')});

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(38);

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(134), __esModule: true };

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(135);
module.exports = __webpack_require__(0).Reflect.getPrototypeOf;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = __webpack_require__(2)
  , getProto = __webpack_require__(75)
  , anObject = __webpack_require__(7);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(137), __esModule: true };

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(138);
module.exports = __webpack_require__(0).RegExp.escape;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(2)
  , $re     = __webpack_require__(139)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});


/***/ }),
/* 139 */
/***/ (function(module, exports) {

module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(141), __esModule: true };

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
__webpack_require__(20);
module.exports = __webpack_require__(31).f('iterator');

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20);
__webpack_require__(16);
module.exports = __webpack_require__(143);

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(7)
  , get      = __webpack_require__(55);
module.exports = __webpack_require__(0).getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileSchema = undefined;

var _for = __webpack_require__(17);

var _for2 = _interopRequireDefault(_for);

var _defineProperties = __webpack_require__(52);

var _defineProperties2 = _interopRequireDefault(_defineProperties);

exports.default = FileSchema;

var _GQLBase = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A decorator that does three things. First it defines the
 * module() static method that is required when using adjacent
 * schema files. Secondly, it defines a SCHEMA getter that
 * returns `GQLBase.ADJACENT_FILE`. Finally it sets a static
 * getter with the `Symbol`, `@adjacentSchema` so that other
 * can determine whether or not the decorator was used.
 *
 * @function FileSchema
 * @memberof! decorators
 * @since 2.3.0
 *
 * @param {String} path a relative or absolute path to the file containing 
 * your GraphQL IDL schema portion for your object type.
 * @param {String} extension the extension of the graphql schema file pointed 
 * to in the previous parameter. By default these are `".graphql"` but should 
 * your path point to a file with a different extension, you should specify 
 * that extension here.
 * @return {mixed} as per all class decorators, `FileSchema` returns the 
 * class object being modified
 */
function FileSchema(path, extension = ".graphql") {
  return function (target) {
    // Attempt to remove the SCHEMA property or function from the class 
    // being decorated. This is not guaranteed to work but should increase 
    // compatibilty and success rates.
    delete target.SCHEMA;

    // @ComputedType
    return (0, _defineProperties2.default)(target, {
      SCHEMA: {
        get: () => _GQLBase.GQLBase.IDLFilePath(path, extension)
      },

      [(0, _for2.default)('@fileSchema')]: {
        get: () => true
      }
    });
  };
} /** @namespace decorators */


exports.FileSchema = FileSchema;

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(146), __esModule: true };

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26);
__webpack_require__(16);
__webpack_require__(20);
__webpack_require__(147);
__webpack_require__(148);
module.exports = __webpack_require__(0).Map;

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(83);

// 23.1 Map Objects
module.exports = __webpack_require__(84)('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(2);

$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(85)('Map')});

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLExpressMiddleware = undefined;

var _assign = __webpack_require__(28);

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = __webpack_require__(25);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _SyntaxTree = __webpack_require__(29);

var _expressGraphql = __webpack_require__(150);

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _GQLBase = __webpack_require__(6);

var _GQLInterface = __webpack_require__(62);

var _GQLScalar = __webpack_require__(40);

var _types = __webpack_require__(9);

var _events = __webpack_require__(61);

var _events2 = _interopRequireDefault(_events);

var _SchemaUtils = __webpack_require__(89);

var _path = __webpack_require__(39);

var _path2 = _interopRequireDefault(_path);

var _graphql = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A handler that exposes an express middleware function that mounts a
 * GraphQL I/O endpoint. Typical usage follows:
 *
 * ```js
 * const app = express();
 * app.use(/.../, new GQLExpressMiddleware([...classes]).middleware);
 * ```
 *
 * @class GQLExpressMiddleware
 */

// @module GQLExpressMiddleware

let GQLExpressMiddleware = exports.GQLExpressMiddleware = class GQLExpressMiddleware extends _events2.default {

  /**
   * For now, takes an Array of classes extending from GQLBase. These are
   * parsed and a combined schema of all their individual schemas is generated
   * via the use of ASTs. This is passed off to express-graphql.
   *
   * @memberof GQLExpressMiddleware
   * @method ⎆⠀constructor
   * @constructor
   *
   * @param {Array<GQLBase>} handlers an array of GQLBase extended classes
   */
  constructor(handlers) {
    super();
    this.handlers = handlers;
  }

  /**
   * Generates the textual schema based on the registered `GQLBase` handlers 
   * this instance represents.
   * 
   * @method GQLExpressMiddleware#⬇︎⠀schema
   * @since 2.7.0
   *
   * @return {string} a generated schema string based on the handlers that 
   * are registered with this `GQLExpressMiddleware` instance.
   */
  get schema() {
    return _SchemaUtils.SchemaUtils.generateSchemaSDL(this.handlers);
  }

  /**
   * Using the express-graphql module, it returns an Express 4.x middleware
   * function.
   *
   * @instance
   * @memberof GQLExpressMiddleware
   * @method ⬇︎⠀middleware
   *
   * @return {Function} a function that expects request, response and next
   * parameters as all Express middleware functions.
   */
  get middleware() {
    return this.customMiddleware();
  }

  /**
   * Using the express-graphql module, it returns an Express 4.x middleware
   * function. This version however, has graphiql disabled. Otherwise it is
   * identical to the `middleware` property
   *
   * @instance
   * @memberof GQLExpressMiddleware
   * @method ⬇︎⠀middlewareWithoutGraphiQL
   *
   * @return {Function} a function that expects request, response and next
   * parameters as all Express middleware functions.
   */
  get middlewareWithoutGraphiQL() {
    return this.customMiddleware({ graphiql: false });
  }

  /**
   * If your needs require you to specify different values to `graphqlHTTP`,
   * part of the `express-graphql` package, you can use the `customMiddleware`
   * function to do so.
   *
   * The first parameter is an object that should contain valid `graphqlHTTP`
   * options. See https://github.com/graphql/express-graphql#options for more
   * details. Validation is NOT performed.
   *
   * The second parameter is a function that will be called after any options
   * have been applied from the first parameter and the rest of the middleware
   * has been performed. This, if not modified, will be the final options
   * passed into `graphqlHTTP`. In your callback, it is expected that the
   * supplied object is to be modified and THEN RETURNED. Whatever is returned
   * will be used or passed on. If nothing is returned, the options supplied
   * to the function will be used instead.
   *
   * @method ⌾⠀customMiddleware
   * @memberof GQLExpressMiddleware
   * @instance
   *
   * @param {Object} [graphqlHttpOptions={graphiql: true}] standard set of
   * `express-graphql` options. See above.
   * @param {Function} patchFinalOpts see above
    * @return {Function} a middleware function compatible with Express
   */
  customMiddleware(graphqlHttpOptions = { graphiql: true }, patchFinalOpts) {
    var _this = this;

    const schema = (0, _graphql.buildSchema)(this.schema);

    _SchemaUtils.SchemaUtils.injectInterfaceResolvers(schema, this.handlers);
    _SchemaUtils.SchemaUtils.injectEnums(schema, this.handlers);
    _SchemaUtils.SchemaUtils.injectScalars(schema, this.handlers);
    _SchemaUtils.SchemaUtils.injectComments(schema, this.handlers);

    // See if there is a way abstract the passing req, res, gql to each
    // makeRoot resolver without invoking makeRoot again every time.
    return (0, _expressGraphql2.default)((() => {
      var _ref = (0, _asyncToGenerator3.default)(function* (req, res, gql) {
        let opts = {
          schema,
          rootValue: yield _SchemaUtils.SchemaUtils.createMergedRoot(_this.handlers, { req, res, gql }),
          formatError: function formatError(error) {
            return {
              message: error.message,
              locations: error.locations,
              stack: error.stack,
              path: error.path
            };
          }
        };

        (0, _assign2.default)(opts, graphqlHttpOptions);
        if (patchFinalOpts) {
          (0, _assign2.default)(opts, patchFinalOpts.bind(_this)(opts) || opts);
        }

        return opts;
      });

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    })());
  }

  /**
   * An optional express middleware function that can be mounted to return
   * a copy of the generated schema string being used by GQLExpressMiddleware.
   *
   * @memberof GQLExpressMiddleware
   * @method schemaMiddleware
   * @instance
   *
   * @type {Function}
   */
  get schemaMiddleware() {
    return (req, res, next) => {
      res.status(200).send(this.schema);
    };
  }
};
exports.default = GQLExpressMiddleware;

/***/ }),
/* 150 */
/***/ (function(module, exports) {

module.exports = require("express-graphql");

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__(152);

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__(21);

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(153), __esModule: true };

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20);
__webpack_require__(16);
module.exports = __webpack_require__(154);

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(37)
  , ITERATOR  = __webpack_require__(1)('iterator')
  , Iterators = __webpack_require__(19);
module.exports = __webpack_require__(0).isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(156), __esModule: true };

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(157);
module.exports = __webpack_require__(0).Object.keys;

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(27)
  , $keys    = __webpack_require__(18);

__webpack_require__(158)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(2)
  , core    = __webpack_require__(0)
  , fails   = __webpack_require__(12);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLJSON = undefined;

var _create = __webpack_require__(160);

var _create2 = _interopRequireDefault(_create);

var _dec, _class;

var _GQLScalar = __webpack_require__(40);

var _Schema = __webpack_require__(90);

var _language = __webpack_require__(163);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let GQLJSON = exports.GQLJSON = (_dec = (0, _Schema.Schema)('scalar JSON'), _dec(_class = class GQLJSON extends _GQLScalar.GQLScalar {
  /**
   * Since JSON stands for JavaScript Object Notation, its values need no
   * direct conversion. Simply pass back what is passed in.
   *
   * @memberof GQLJSON
   * @method serialize
   * @static
   *
   * @param {mixed|Null} value a valid JavaScript object
   * @return {mixed|Null} the same value that was passed in.
   */
  static serialize(value) {
    return value;
  }

  /**
   * All processing by GraphQL Lattice uses the Class.name property. We want 
   * to report JSON and not GQLJSON so this is what we do.
   *
   * @memberof GQLJSON
   * @method name 
   * @static
   * @type {String}
   */
  static get name() {
    return 'JSON';
  }

  /**
   * Since JSON stands for JavaScript Object Notation, its values need no
   * direct conversion. Simply pass back what is passed in.
   *
   * @memberof GQLJSON
   * @method parseValue
   * @static
   *
   * @param {mixed|Null} value a valid JavaScript object
   * @return {mixed|Null} the same value that was passed in.
   */
  static parseValue(value) {
    return value;
  }

  /**
   * Given literal values, `parseLiteral` will walk the object and build
   * up an equivalent version of itself as an object that should `parse()`
   * and `stringify()` accordingly.
   *
   * @memberof GQLJSON
   * @method parseLiteral
   * @static
   *
   * @param {Object} ast the Abstract Syntax Tree representing the JSON
   * type to parse.
   * @return {String|Array|Object|Number|Null} valid JSON types converted as
   * expected.
   */
  static parseLiteral(ast) {
    switch (ast.kind) {
      case _language.Kind.STRING:
      case _language.Kind.BOOLEAN:
        return ast.value;

      case _language.Kind.INT:
        return parseInt(ast.value, 10);
      case _language.Kind.FLOAT:
        return parseFloat(ast.value);

      case _language.Kind.OBJECT:
        {
          const value = (0, _create2.default)(null);
          ast.fields.forEach(field => {
            value[field.name.value] = GQLJSON.parseLiteral(field.value);
          });

          return value;
        }

      case _language.Kind.LIST:
        return ast.values.map(GQLJSON.parseLiteral);

      default:
        return null;
    }
  }

  /** @inheritdoc */
  static apiDocs() {
    const DOC_CLASS = this.DOC_CLASS,
          joinLines = this.joinLines;


    return joinLines`
      The \`JSON\` scalar type represents JSON values as specified by
      [ECMA-404](http://www.ecma-international.org/publications/files${'ECMA-ST/ECMA-404.pdf'})
    `;
  }
}) || _class);

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(161), __esModule: true };

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(162);
var $Object = __webpack_require__(0).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(2)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(36)});

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BREAK = exports.getVisitFn = exports.visitWithTypeInfo = exports.visitInParallel = exports.visit = exports.Source = exports.print = exports.parseType = exports.parseValue = exports.parse = exports.TokenKind = exports.createLexer = exports.Kind = exports.getLocation = undefined;

var _location = __webpack_require__(63);

Object.defineProperty(exports, 'getLocation', {
  enumerable: true,
  get: function get() {
    return _location.getLocation;
  }
});

var _lexer = __webpack_require__(91);

Object.defineProperty(exports, 'createLexer', {
  enumerable: true,
  get: function get() {
    return _lexer.createLexer;
  }
});
Object.defineProperty(exports, 'TokenKind', {
  enumerable: true,
  get: function get() {
    return _lexer.TokenKind;
  }
});

var _parser = __webpack_require__(168);

Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _parser.parse;
  }
});
Object.defineProperty(exports, 'parseValue', {
  enumerable: true,
  get: function get() {
    return _parser.parseValue;
  }
});
Object.defineProperty(exports, 'parseType', {
  enumerable: true,
  get: function get() {
    return _parser.parseType;
  }
});

var _printer = __webpack_require__(169);

Object.defineProperty(exports, 'print', {
  enumerable: true,
  get: function get() {
    return _printer.print;
  }
});

var _source = __webpack_require__(93);

Object.defineProperty(exports, 'Source', {
  enumerable: true,
  get: function get() {
    return _source.Source;
  }
});

var _visitor = __webpack_require__(95);

Object.defineProperty(exports, 'visit', {
  enumerable: true,
  get: function get() {
    return _visitor.visit;
  }
});
Object.defineProperty(exports, 'visitInParallel', {
  enumerable: true,
  get: function get() {
    return _visitor.visitInParallel;
  }
});
Object.defineProperty(exports, 'visitWithTypeInfo', {
  enumerable: true,
  get: function get() {
    return _visitor.visitWithTypeInfo;
  }
});
Object.defineProperty(exports, 'getVisitFn', {
  enumerable: true,
  get: function get() {
    return _visitor.getVisitFn;
  }
});
Object.defineProperty(exports, 'BREAK', {
  enumerable: true,
  get: function get() {
    return _visitor.BREAK;
  }
});

var _kinds = __webpack_require__(94);

var Kind = _interopRequireWildcard(_kinds);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.Kind = Kind;

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syntaxError = syntaxError;

var _location = __webpack_require__(63);

var _GraphQLError = __webpack_require__(64);

/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function syntaxError(source, position, description) {
  var location = (0, _location.getLocation)(source, position);
  var error = new _GraphQLError.GraphQLError('Syntax Error ' + source.name + ' (' + location.line + ':' + location.column + ') ' + description + '\n\n' + highlightSourceAtLocation(source, location), undefined, source, [position]);
  return error;
}

/**
 * Render a helpful description of the location of the error in the GraphQL
 * Source document.
 */
function highlightSourceAtLocation(source, location) {
  var line = location.line;
  var prevLineNum = (line - 1).toString();
  var lineNum = line.toString();
  var nextLineNum = (line + 1).toString();
  var padLen = nextLineNum.length;
  var lines = source.body.split(/\r\n|[\n\r]/g);
  return (line >= 2 ? lpad(padLen, prevLineNum) + ': ' + lines[line - 2] + '\n' : '') + lpad(padLen, lineNum) + ': ' + lines[line - 1] + '\n' + Array(2 + padLen + location.column).join(' ') + '^\n' + (line < lines.length ? lpad(padLen, nextLineNum) + ': ' + lines[line] + '\n' : '');
}

function lpad(len, str) {
  return Array(len - str.length + 1).join(' ') + str;
}

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locatedError = locatedError;

var _GraphQLError = __webpack_require__(64);

/**
 * Given an arbitrary Error, presumably thrown while attempting to execute a
 * GraphQL operation, produce a new GraphQLError aware of the location in the
 * document responsible for the original Error.
 */
function locatedError(originalError, nodes, path) {
  // Note: this uses a brand-check to support GraphQL errors originating from
  // other contexts.
  if (originalError && originalError.path) {
    return originalError;
  }

  var message = originalError ? originalError.message || String(originalError) : 'An unknown error occurred.';
  return new _GraphQLError.GraphQLError(message, originalError && originalError.nodes || nodes, originalError && originalError.source, originalError && originalError.positions, path, originalError);
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatError = formatError;

var _invariant = __webpack_require__(167);

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification.
 */
function formatError(error) {
  (0, _invariant2.default)(error, 'Received null or undefined error.');
  return {
    message: error.message,
    locations: error.locations,
    path: error.path
  };
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = invariant;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.parseValue = parseValue;
exports.parseType = parseType;
exports.parseConstValue = parseConstValue;
exports.parseTypeReference = parseTypeReference;
exports.parseNamedType = parseNamedType;

var _source = __webpack_require__(93);

var _error = __webpack_require__(92);

var _lexer = __webpack_require__(91);

var _kinds = __webpack_require__(94);

/**
 * Given a GraphQL source, parses it into a Document.
 * Throws GraphQLError if a syntax error is encountered.
 */


/**
 * Configuration options to control parser behavior
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function parse(source, options) {
  var sourceObj = typeof source === 'string' ? new _source.Source(source) : source;
  if (!(sourceObj instanceof _source.Source)) {
    throw new TypeError('Must provide Source. Received: ' + String(sourceObj));
  }
  var lexer = (0, _lexer.createLexer)(sourceObj, options || {});
  return parseDocument(lexer);
}

/**
 * Given a string containing a GraphQL value (ex. `[42]`), parse the AST for
 * that value.
 * Throws GraphQLError if a syntax error is encountered.
 *
 * This is useful within tools that operate upon GraphQL Values directly and
 * in isolation of complete GraphQL documents.
 *
 * Consider providing the results to the utility function: valueFromAST().
 */
function parseValue(source, options) {
  var sourceObj = typeof source === 'string' ? new _source.Source(source) : source;
  var lexer = (0, _lexer.createLexer)(sourceObj, options || {});
  expect(lexer, _lexer.TokenKind.SOF);
  var value = parseValueLiteral(lexer, false);
  expect(lexer, _lexer.TokenKind.EOF);
  return value;
}

/**
 * Given a string containing a GraphQL Type (ex. `[Int!]`), parse the AST for
 * that type.
 * Throws GraphQLError if a syntax error is encountered.
 *
 * This is useful within tools that operate upon GraphQL Types directly and
 * in isolation of complete GraphQL documents.
 *
 * Consider providing the results to the utility function: typeFromAST().
 */
function parseType(source, options) {
  var sourceObj = typeof source === 'string' ? new _source.Source(source) : source;
  var lexer = (0, _lexer.createLexer)(sourceObj, options || {});
  expect(lexer, _lexer.TokenKind.SOF);
  var type = parseTypeReference(lexer);
  expect(lexer, _lexer.TokenKind.EOF);
  return type;
}

/**
 * Converts a name lex token into a name parse node.
 */
function parseName(lexer) {
  var token = expect(lexer, _lexer.TokenKind.NAME);
  return {
    kind: _kinds.NAME,
    value: token.value,
    loc: loc(lexer, token)
  };
}

// Implements the parsing rules in the Document section.

/**
 * Document : Definition+
 */
function parseDocument(lexer) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.SOF);
  var definitions = [];
  do {
    definitions.push(parseDefinition(lexer));
  } while (!skip(lexer, _lexer.TokenKind.EOF));

  return {
    kind: _kinds.DOCUMENT,
    definitions: definitions,
    loc: loc(lexer, start)
  };
}

/**
 * Definition :
 *   - OperationDefinition
 *   - FragmentDefinition
 *   - TypeSystemDefinition
 */
function parseDefinition(lexer) {
  if (peek(lexer, _lexer.TokenKind.BRACE_L)) {
    return parseOperationDefinition(lexer);
  }

  if (peek(lexer, _lexer.TokenKind.NAME)) {
    switch (lexer.token.value) {
      // Note: subscription is an experimental non-spec addition.
      case 'query':
      case 'mutation':
      case 'subscription':
        return parseOperationDefinition(lexer);

      case 'fragment':
        return parseFragmentDefinition(lexer);

      // Note: the Type System IDL is an experimental non-spec addition.
      case 'schema':
      case 'scalar':
      case 'type':
      case 'interface':
      case 'union':
      case 'enum':
      case 'input':
      case 'extend':
      case 'directive':
        return parseTypeSystemDefinition(lexer);
    }
  }

  throw unexpected(lexer);
}

// Implements the parsing rules in the Operations section.

/**
 * OperationDefinition :
 *  - SelectionSet
 *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
 */
function parseOperationDefinition(lexer) {
  var start = lexer.token;
  if (peek(lexer, _lexer.TokenKind.BRACE_L)) {
    return {
      kind: _kinds.OPERATION_DEFINITION,
      operation: 'query',
      name: null,
      variableDefinitions: null,
      directives: [],
      selectionSet: parseSelectionSet(lexer),
      loc: loc(lexer, start)
    };
  }
  var operation = parseOperationType(lexer);
  var name = void 0;
  if (peek(lexer, _lexer.TokenKind.NAME)) {
    name = parseName(lexer);
  }
  return {
    kind: _kinds.OPERATION_DEFINITION,
    operation: operation,
    name: name,
    variableDefinitions: parseVariableDefinitions(lexer),
    directives: parseDirectives(lexer),
    selectionSet: parseSelectionSet(lexer),
    loc: loc(lexer, start)
  };
}

/**
 * OperationType : one of query mutation subscription
 */
function parseOperationType(lexer) {
  var operationToken = expect(lexer, _lexer.TokenKind.NAME);
  switch (operationToken.value) {
    case 'query':
      return 'query';
    case 'mutation':
      return 'mutation';
    // Note: subscription is an experimental non-spec addition.
    case 'subscription':
      return 'subscription';
  }

  throw unexpected(lexer, operationToken);
}

/**
 * VariableDefinitions : ( VariableDefinition+ )
 */
function parseVariableDefinitions(lexer) {
  return peek(lexer, _lexer.TokenKind.PAREN_L) ? many(lexer, _lexer.TokenKind.PAREN_L, parseVariableDefinition, _lexer.TokenKind.PAREN_R) : [];
}

/**
 * VariableDefinition : Variable : Type DefaultValue?
 */
function parseVariableDefinition(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds.VARIABLE_DEFINITION,
    variable: parseVariable(lexer),
    type: (expect(lexer, _lexer.TokenKind.COLON), parseTypeReference(lexer)),
    defaultValue: skip(lexer, _lexer.TokenKind.EQUALS) ? parseValueLiteral(lexer, true) : null,
    loc: loc(lexer, start)
  };
}

/**
 * Variable : $ Name
 */
function parseVariable(lexer) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.DOLLAR);
  return {
    kind: _kinds.VARIABLE,
    name: parseName(lexer),
    loc: loc(lexer, start)
  };
}

/**
 * SelectionSet : { Selection+ }
 */
function parseSelectionSet(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds.SELECTION_SET,
    selections: many(lexer, _lexer.TokenKind.BRACE_L, parseSelection, _lexer.TokenKind.BRACE_R),
    loc: loc(lexer, start)
  };
}

/**
 * Selection :
 *   - Field
 *   - FragmentSpread
 *   - InlineFragment
 */
function parseSelection(lexer) {
  return peek(lexer, _lexer.TokenKind.SPREAD) ? parseFragment(lexer) : parseField(lexer);
}

/**
 * Field : Alias? Name Arguments? Directives? SelectionSet?
 *
 * Alias : Name :
 */
function parseField(lexer) {
  var start = lexer.token;

  var nameOrAlias = parseName(lexer);
  var alias = void 0;
  var name = void 0;
  if (skip(lexer, _lexer.TokenKind.COLON)) {
    alias = nameOrAlias;
    name = parseName(lexer);
  } else {
    alias = null;
    name = nameOrAlias;
  }

  return {
    kind: _kinds.FIELD,
    alias: alias,
    name: name,
    arguments: parseArguments(lexer),
    directives: parseDirectives(lexer),
    selectionSet: peek(lexer, _lexer.TokenKind.BRACE_L) ? parseSelectionSet(lexer) : null,
    loc: loc(lexer, start)
  };
}

/**
 * Arguments : ( Argument+ )
 */
function parseArguments(lexer) {
  return peek(lexer, _lexer.TokenKind.PAREN_L) ? many(lexer, _lexer.TokenKind.PAREN_L, parseArgument, _lexer.TokenKind.PAREN_R) : [];
}

/**
 * Argument : Name : Value
 */
function parseArgument(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds.ARGUMENT,
    name: parseName(lexer),
    value: (expect(lexer, _lexer.TokenKind.COLON), parseValueLiteral(lexer, false)),
    loc: loc(lexer, start)
  };
}

// Implements the parsing rules in the Fragments section.

/**
 * Corresponds to both FragmentSpread and InlineFragment in the spec.
 *
 * FragmentSpread : ... FragmentName Directives?
 *
 * InlineFragment : ... TypeCondition? Directives? SelectionSet
 */
function parseFragment(lexer) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.SPREAD);
  if (peek(lexer, _lexer.TokenKind.NAME) && lexer.token.value !== 'on') {
    return {
      kind: _kinds.FRAGMENT_SPREAD,
      name: parseFragmentName(lexer),
      directives: parseDirectives(lexer),
      loc: loc(lexer, start)
    };
  }
  var typeCondition = null;
  if (lexer.token.value === 'on') {
    lexer.advance();
    typeCondition = parseNamedType(lexer);
  }
  return {
    kind: _kinds.INLINE_FRAGMENT,
    typeCondition: typeCondition,
    directives: parseDirectives(lexer),
    selectionSet: parseSelectionSet(lexer),
    loc: loc(lexer, start)
  };
}

/**
 * FragmentDefinition :
 *   - fragment FragmentName on TypeCondition Directives? SelectionSet
 *
 * TypeCondition : NamedType
 */
function parseFragmentDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'fragment');
  return {
    kind: _kinds.FRAGMENT_DEFINITION,
    name: parseFragmentName(lexer),
    typeCondition: (expectKeyword(lexer, 'on'), parseNamedType(lexer)),
    directives: parseDirectives(lexer),
    selectionSet: parseSelectionSet(lexer),
    loc: loc(lexer, start)
  };
}

/**
 * FragmentName : Name but not `on`
 */
function parseFragmentName(lexer) {
  if (lexer.token.value === 'on') {
    throw unexpected(lexer);
  }
  return parseName(lexer);
}

// Implements the parsing rules in the Values section.

/**
 * Value[Const] :
 *   - [~Const] Variable
 *   - IntValue
 *   - FloatValue
 *   - StringValue
 *   - BooleanValue
 *   - NullValue
 *   - EnumValue
 *   - ListValue[?Const]
 *   - ObjectValue[?Const]
 *
 * BooleanValue : one of `true` `false`
 *
 * NullValue : `null`
 *
 * EnumValue : Name but not `true`, `false` or `null`
 */
function parseValueLiteral(lexer, isConst) {
  var token = lexer.token;
  switch (token.kind) {
    case _lexer.TokenKind.BRACKET_L:
      return parseList(lexer, isConst);
    case _lexer.TokenKind.BRACE_L:
      return parseObject(lexer, isConst);
    case _lexer.TokenKind.INT:
      lexer.advance();
      return {
        kind: _kinds.INT,
        value: token.value,
        loc: loc(lexer, token)
      };
    case _lexer.TokenKind.FLOAT:
      lexer.advance();
      return {
        kind: _kinds.FLOAT,
        value: token.value,
        loc: loc(lexer, token)
      };
    case _lexer.TokenKind.STRING:
      lexer.advance();
      return {
        kind: _kinds.STRING,
        value: token.value,
        loc: loc(lexer, token)
      };
    case _lexer.TokenKind.NAME:
      if (token.value === 'true' || token.value === 'false') {
        lexer.advance();
        return {
          kind: _kinds.BOOLEAN,
          value: token.value === 'true',
          loc: loc(lexer, token)
        };
      } else if (token.value === 'null') {
        lexer.advance();
        return {
          kind: _kinds.NULL,
          loc: loc(lexer, token)
        };
      }
      lexer.advance();
      return {
        kind: _kinds.ENUM,
        value: token.value,
        loc: loc(lexer, token)
      };
    case _lexer.TokenKind.DOLLAR:
      if (!isConst) {
        return parseVariable(lexer);
      }
      break;
  }
  throw unexpected(lexer);
}

function parseConstValue(lexer) {
  return parseValueLiteral(lexer, true);
}

function parseValueValue(lexer) {
  return parseValueLiteral(lexer, false);
}

/**
 * ListValue[Const] :
 *   - [ ]
 *   - [ Value[?Const]+ ]
 */
function parseList(lexer, isConst) {
  var start = lexer.token;
  var item = isConst ? parseConstValue : parseValueValue;
  return {
    kind: _kinds.LIST,
    values: any(lexer, _lexer.TokenKind.BRACKET_L, item, _lexer.TokenKind.BRACKET_R),
    loc: loc(lexer, start)
  };
}

/**
 * ObjectValue[Const] :
 *   - { }
 *   - { ObjectField[?Const]+ }
 */
function parseObject(lexer, isConst) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.BRACE_L);
  var fields = [];
  while (!skip(lexer, _lexer.TokenKind.BRACE_R)) {
    fields.push(parseObjectField(lexer, isConst));
  }
  return {
    kind: _kinds.OBJECT,
    fields: fields,
    loc: loc(lexer, start)
  };
}

/**
 * ObjectField[Const] : Name : Value[?Const]
 */
function parseObjectField(lexer, isConst) {
  var start = lexer.token;
  return {
    kind: _kinds.OBJECT_FIELD,
    name: parseName(lexer),
    value: (expect(lexer, _lexer.TokenKind.COLON), parseValueLiteral(lexer, isConst)),
    loc: loc(lexer, start)
  };
}

// Implements the parsing rules in the Directives section.

/**
 * Directives : Directive+
 */
function parseDirectives(lexer) {
  var directives = [];
  while (peek(lexer, _lexer.TokenKind.AT)) {
    directives.push(parseDirective(lexer));
  }
  return directives;
}

/**
 * Directive : @ Name Arguments?
 */
function parseDirective(lexer) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.AT);
  return {
    kind: _kinds.DIRECTIVE,
    name: parseName(lexer),
    arguments: parseArguments(lexer),
    loc: loc(lexer, start)
  };
}

// Implements the parsing rules in the Types section.

/**
 * Type :
 *   - NamedType
 *   - ListType
 *   - NonNullType
 */
function parseTypeReference(lexer) {
  var start = lexer.token;
  var type = void 0;
  if (skip(lexer, _lexer.TokenKind.BRACKET_L)) {
    type = parseTypeReference(lexer);
    expect(lexer, _lexer.TokenKind.BRACKET_R);
    type = {
      kind: _kinds.LIST_TYPE,
      type: type,
      loc: loc(lexer, start)
    };
  } else {
    type = parseNamedType(lexer);
  }
  if (skip(lexer, _lexer.TokenKind.BANG)) {
    return {
      kind: _kinds.NON_NULL_TYPE,
      type: type,
      loc: loc(lexer, start)
    };
  }
  return type;
}

/**
 * NamedType : Name
 */
function parseNamedType(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds.NAMED_TYPE,
    name: parseName(lexer),
    loc: loc(lexer, start)
  };
}

// Implements the parsing rules in the Type Definition section.

/**
 * TypeSystemDefinition :
 *   - SchemaDefinition
 *   - TypeDefinition
 *   - TypeExtensionDefinition
 *   - DirectiveDefinition
 *
 * TypeDefinition :
 *   - ScalarTypeDefinition
 *   - ObjectTypeDefinition
 *   - InterfaceTypeDefinition
 *   - UnionTypeDefinition
 *   - EnumTypeDefinition
 *   - InputObjectTypeDefinition
 */
function parseTypeSystemDefinition(lexer) {
  if (peek(lexer, _lexer.TokenKind.NAME)) {
    switch (lexer.token.value) {
      case 'schema':
        return parseSchemaDefinition(lexer);
      case 'scalar':
        return parseScalarTypeDefinition(lexer);
      case 'type':
        return parseObjectTypeDefinition(lexer);
      case 'interface':
        return parseInterfaceTypeDefinition(lexer);
      case 'union':
        return parseUnionTypeDefinition(lexer);
      case 'enum':
        return parseEnumTypeDefinition(lexer);
      case 'input':
        return parseInputObjectTypeDefinition(lexer);
      case 'extend':
        return parseTypeExtensionDefinition(lexer);
      case 'directive':
        return parseDirectiveDefinition(lexer);
    }
  }

  throw unexpected(lexer);
}

/**
 * SchemaDefinition : schema Directives? { OperationTypeDefinition+ }
 *
 * OperationTypeDefinition : OperationType : NamedType
 */
function parseSchemaDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'schema');
  var directives = parseDirectives(lexer);
  var operationTypes = many(lexer, _lexer.TokenKind.BRACE_L, parseOperationTypeDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.SCHEMA_DEFINITION,
    directives: directives,
    operationTypes: operationTypes,
    loc: loc(lexer, start)
  };
}

function parseOperationTypeDefinition(lexer) {
  var start = lexer.token;
  var operation = parseOperationType(lexer);
  expect(lexer, _lexer.TokenKind.COLON);
  var type = parseNamedType(lexer);
  return {
    kind: _kinds.OPERATION_TYPE_DEFINITION,
    operation: operation,
    type: type,
    loc: loc(lexer, start)
  };
}

/**
 * ScalarTypeDefinition : scalar Name Directives?
 */
function parseScalarTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'scalar');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  return {
    kind: _kinds.SCALAR_TYPE_DEFINITION,
    name: name,
    directives: directives,
    loc: loc(lexer, start)
  };
}

/**
 * ObjectTypeDefinition :
 *   - type Name ImplementsInterfaces? Directives? { FieldDefinition+ }
 */
function parseObjectTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'type');
  var name = parseName(lexer);
  var interfaces = parseImplementsInterfaces(lexer);
  var directives = parseDirectives(lexer);
  var fields = any(lexer, _lexer.TokenKind.BRACE_L, parseFieldDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.OBJECT_TYPE_DEFINITION,
    name: name,
    interfaces: interfaces,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}

/**
 * ImplementsInterfaces : implements NamedType+
 */
function parseImplementsInterfaces(lexer) {
  var types = [];
  if (lexer.token.value === 'implements') {
    lexer.advance();
    do {
      types.push(parseNamedType(lexer));
    } while (peek(lexer, _lexer.TokenKind.NAME));
  }
  return types;
}

/**
 * FieldDefinition : Name ArgumentsDefinition? : Type Directives?
 */
function parseFieldDefinition(lexer) {
  var start = lexer.token;
  var name = parseName(lexer);
  var args = parseArgumentDefs(lexer);
  expect(lexer, _lexer.TokenKind.COLON);
  var type = parseTypeReference(lexer);
  var directives = parseDirectives(lexer);
  return {
    kind: _kinds.FIELD_DEFINITION,
    name: name,
    arguments: args,
    type: type,
    directives: directives,
    loc: loc(lexer, start)
  };
}

/**
 * ArgumentsDefinition : ( InputValueDefinition+ )
 */
function parseArgumentDefs(lexer) {
  if (!peek(lexer, _lexer.TokenKind.PAREN_L)) {
    return [];
  }
  return many(lexer, _lexer.TokenKind.PAREN_L, parseInputValueDef, _lexer.TokenKind.PAREN_R);
}

/**
 * InputValueDefinition : Name : Type DefaultValue? Directives?
 */
function parseInputValueDef(lexer) {
  var start = lexer.token;
  var name = parseName(lexer);
  expect(lexer, _lexer.TokenKind.COLON);
  var type = parseTypeReference(lexer);
  var defaultValue = null;
  if (skip(lexer, _lexer.TokenKind.EQUALS)) {
    defaultValue = parseConstValue(lexer);
  }
  var directives = parseDirectives(lexer);
  return {
    kind: _kinds.INPUT_VALUE_DEFINITION,
    name: name,
    type: type,
    defaultValue: defaultValue,
    directives: directives,
    loc: loc(lexer, start)
  };
}

/**
 * InterfaceTypeDefinition : interface Name Directives? { FieldDefinition+ }
 */
function parseInterfaceTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'interface');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  var fields = any(lexer, _lexer.TokenKind.BRACE_L, parseFieldDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.INTERFACE_TYPE_DEFINITION,
    name: name,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}

/**
 * UnionTypeDefinition : union Name Directives? = UnionMembers
 */
function parseUnionTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'union');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  expect(lexer, _lexer.TokenKind.EQUALS);
  var types = parseUnionMembers(lexer);
  return {
    kind: _kinds.UNION_TYPE_DEFINITION,
    name: name,
    directives: directives,
    types: types,
    loc: loc(lexer, start)
  };
}

/**
 * UnionMembers :
 *   - `|`? NamedType
 *   - UnionMembers | NamedType
 */
function parseUnionMembers(lexer) {
  // Optional leading pipe
  skip(lexer, _lexer.TokenKind.PIPE);
  var members = [];
  do {
    members.push(parseNamedType(lexer));
  } while (skip(lexer, _lexer.TokenKind.PIPE));
  return members;
}

/**
 * EnumTypeDefinition : enum Name Directives? { EnumValueDefinition+ }
 */
function parseEnumTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'enum');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  var values = many(lexer, _lexer.TokenKind.BRACE_L, parseEnumValueDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.ENUM_TYPE_DEFINITION,
    name: name,
    directives: directives,
    values: values,
    loc: loc(lexer, start)
  };
}

/**
 * EnumValueDefinition : EnumValue Directives?
 *
 * EnumValue : Name
 */
function parseEnumValueDefinition(lexer) {
  var start = lexer.token;
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  return {
    kind: _kinds.ENUM_VALUE_DEFINITION,
    name: name,
    directives: directives,
    loc: loc(lexer, start)
  };
}

/**
 * InputObjectTypeDefinition : input Name Directives? { InputValueDefinition+ }
 */
function parseInputObjectTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'input');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  var fields = any(lexer, _lexer.TokenKind.BRACE_L, parseInputValueDef, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.INPUT_OBJECT_TYPE_DEFINITION,
    name: name,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}

/**
 * TypeExtensionDefinition : extend ObjectTypeDefinition
 */
function parseTypeExtensionDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'extend');
  var definition = parseObjectTypeDefinition(lexer);
  return {
    kind: _kinds.TYPE_EXTENSION_DEFINITION,
    definition: definition,
    loc: loc(lexer, start)
  };
}

/**
 * DirectiveDefinition :
 *   - directive @ Name ArgumentsDefinition? on DirectiveLocations
 */
function parseDirectiveDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'directive');
  expect(lexer, _lexer.TokenKind.AT);
  var name = parseName(lexer);
  var args = parseArgumentDefs(lexer);
  expectKeyword(lexer, 'on');
  var locations = parseDirectiveLocations(lexer);
  return {
    kind: _kinds.DIRECTIVE_DEFINITION,
    name: name,
    arguments: args,
    locations: locations,
    loc: loc(lexer, start)
  };
}

/**
 * DirectiveLocations :
 *   - `|`? Name
 *   - DirectiveLocations | Name
 */
function parseDirectiveLocations(lexer) {
  // Optional leading pipe
  skip(lexer, _lexer.TokenKind.PIPE);
  var locations = [];
  do {
    locations.push(parseName(lexer));
  } while (skip(lexer, _lexer.TokenKind.PIPE));
  return locations;
}

// Core parsing utility functions

/**
 * Returns a location object, used to identify the place in
 * the source that created a given parsed object.
 */
function loc(lexer, startToken) {
  if (!lexer.options.noLocation) {
    return new Loc(startToken, lexer.lastToken, lexer.source);
  }
}

function Loc(startToken, endToken, source) {
  this.start = startToken.start;
  this.end = endToken.end;
  this.startToken = startToken;
  this.endToken = endToken;
  this.source = source;
}

// Print a simplified form when appearing in JSON/util.inspect.
Loc.prototype.toJSON = Loc.prototype.inspect = function toJSON() {
  return { start: this.start, end: this.end };
};

/**
 * Determines if the next token is of a given kind
 */
function peek(lexer, kind) {
  return lexer.token.kind === kind;
}

/**
 * If the next token is of the given kind, return true after advancing
 * the lexer. Otherwise, do not change the parser state and return false.
 */
function skip(lexer, kind) {
  var match = lexer.token.kind === kind;
  if (match) {
    lexer.advance();
  }
  return match;
}

/**
 * If the next token is of the given kind, return that token after advancing
 * the lexer. Otherwise, do not change the parser state and throw an error.
 */
function expect(lexer, kind) {
  var token = lexer.token;
  if (token.kind === kind) {
    lexer.advance();
    return token;
  }
  throw (0, _error.syntaxError)(lexer.source, token.start, 'Expected ' + kind + ', found ' + (0, _lexer.getTokenDesc)(token));
}

/**
 * If the next token is a keyword with the given value, return that token after
 * advancing the lexer. Otherwise, do not change the parser state and return
 * false.
 */
function expectKeyword(lexer, value) {
  var token = lexer.token;
  if (token.kind === _lexer.TokenKind.NAME && token.value === value) {
    lexer.advance();
    return token;
  }
  throw (0, _error.syntaxError)(lexer.source, token.start, 'Expected "' + value + '", found ' + (0, _lexer.getTokenDesc)(token));
}

/**
 * Helper function for creating an error when an unexpected lexed token
 * is encountered.
 */
function unexpected(lexer, atToken) {
  var token = atToken || lexer.token;
  return (0, _error.syntaxError)(lexer.source, token.start, 'Unexpected ' + (0, _lexer.getTokenDesc)(token));
}

/**
 * Returns a possibly empty list of parse nodes, determined by
 * the parseFn. This list begins with a lex token of openKind
 * and ends with a lex token of closeKind. Advances the parser
 * to the next lex token after the closing token.
 */
function any(lexer, openKind, parseFn, closeKind) {
  expect(lexer, openKind);
  var nodes = [];
  while (!skip(lexer, closeKind)) {
    nodes.push(parseFn(lexer));
  }
  return nodes;
}

/**
 * Returns a non-empty list of parse nodes, determined by
 * the parseFn. This list begins with a lex token of openKind
 * and ends with a lex token of closeKind. Advances the parser
 * to the next lex token after the closing token.
 */
function many(lexer, openKind, parseFn, closeKind) {
  expect(lexer, openKind);
  var nodes = [parseFn(lexer)];
  while (!skip(lexer, closeKind)) {
    nodes.push(parseFn(lexer));
  }
  return nodes;
}

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.print = print;

var _visitor = __webpack_require__(95);

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */
function print(ast) {
  return (0, _visitor.visit)(ast, { leave: printDocASTReducer });
} /**
   *  Copyright (c) 2015, Facebook, Inc.
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree. An additional grant
   *  of patent rights can be found in the PATENTS file in the same directory.
   */

var printDocASTReducer = {
  Name: function Name(node) {
    return node.value;
  },
  Variable: function Variable(node) {
    return '$' + node.name;
  },

  // Document

  Document: function Document(node) {
    return join(node.definitions, '\n\n') + '\n';
  },

  OperationDefinition: function OperationDefinition(node) {
    var op = node.operation;
    var name = node.name;
    var varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
    var directives = join(node.directives, ' ');
    var selectionSet = node.selectionSet;
    // Anonymous queries with no directives or variable definitions can use
    // the query short form.
    return !name && !directives && !varDefs && op === 'query' ? selectionSet : join([op, join([name, varDefs]), directives, selectionSet], ' ');
  },


  VariableDefinition: function VariableDefinition(_ref) {
    var variable = _ref.variable,
        type = _ref.type,
        defaultValue = _ref.defaultValue;
    return variable + ': ' + type + wrap(' = ', defaultValue);
  },

  SelectionSet: function SelectionSet(_ref2) {
    var selections = _ref2.selections;
    return block(selections);
  },

  Field: function Field(_ref3) {
    var alias = _ref3.alias,
        name = _ref3.name,
        args = _ref3.arguments,
        directives = _ref3.directives,
        selectionSet = _ref3.selectionSet;
    return join([wrap('', alias, ': ') + name + wrap('(', join(args, ', '), ')'), join(directives, ' '), selectionSet], ' ');
  },

  Argument: function Argument(_ref4) {
    var name = _ref4.name,
        value = _ref4.value;
    return name + ': ' + value;
  },

  // Fragments

  FragmentSpread: function FragmentSpread(_ref5) {
    var name = _ref5.name,
        directives = _ref5.directives;
    return '...' + name + wrap(' ', join(directives, ' '));
  },

  InlineFragment: function InlineFragment(_ref6) {
    var typeCondition = _ref6.typeCondition,
        directives = _ref6.directives,
        selectionSet = _ref6.selectionSet;
    return join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' ');
  },

  FragmentDefinition: function FragmentDefinition(_ref7) {
    var name = _ref7.name,
        typeCondition = _ref7.typeCondition,
        directives = _ref7.directives,
        selectionSet = _ref7.selectionSet;
    return 'fragment ' + name + ' on ' + typeCondition + ' ' + wrap('', join(directives, ' '), ' ') + selectionSet;
  },

  // Value

  IntValue: function IntValue(_ref8) {
    var value = _ref8.value;
    return value;
  },
  FloatValue: function FloatValue(_ref9) {
    var value = _ref9.value;
    return value;
  },
  StringValue: function StringValue(_ref10) {
    var value = _ref10.value;
    return JSON.stringify(value);
  },
  BooleanValue: function BooleanValue(_ref11) {
    var value = _ref11.value;
    return JSON.stringify(value);
  },
  NullValue: function NullValue() {
    return 'null';
  },
  EnumValue: function EnumValue(_ref12) {
    var value = _ref12.value;
    return value;
  },
  ListValue: function ListValue(_ref13) {
    var values = _ref13.values;
    return '[' + join(values, ', ') + ']';
  },
  ObjectValue: function ObjectValue(_ref14) {
    var fields = _ref14.fields;
    return '{' + join(fields, ', ') + '}';
  },
  ObjectField: function ObjectField(_ref15) {
    var name = _ref15.name,
        value = _ref15.value;
    return name + ': ' + value;
  },

  // Directive

  Directive: function Directive(_ref16) {
    var name = _ref16.name,
        args = _ref16.arguments;
    return '@' + name + wrap('(', join(args, ', '), ')');
  },

  // Type

  NamedType: function NamedType(_ref17) {
    var name = _ref17.name;
    return name;
  },
  ListType: function ListType(_ref18) {
    var type = _ref18.type;
    return '[' + type + ']';
  },
  NonNullType: function NonNullType(_ref19) {
    var type = _ref19.type;
    return type + '!';
  },

  // Type System Definitions

  SchemaDefinition: function SchemaDefinition(_ref20) {
    var directives = _ref20.directives,
        operationTypes = _ref20.operationTypes;
    return join(['schema', join(directives, ' '), block(operationTypes)], ' ');
  },

  OperationTypeDefinition: function OperationTypeDefinition(_ref21) {
    var operation = _ref21.operation,
        type = _ref21.type;
    return operation + ': ' + type;
  },

  ScalarTypeDefinition: function ScalarTypeDefinition(_ref22) {
    var name = _ref22.name,
        directives = _ref22.directives;
    return join(['scalar', name, join(directives, ' ')], ' ');
  },

  ObjectTypeDefinition: function ObjectTypeDefinition(_ref23) {
    var name = _ref23.name,
        interfaces = _ref23.interfaces,
        directives = _ref23.directives,
        fields = _ref23.fields;
    return join(['type', name, wrap('implements ', join(interfaces, ', ')), join(directives, ' '), block(fields)], ' ');
  },

  FieldDefinition: function FieldDefinition(_ref24) {
    var name = _ref24.name,
        args = _ref24.arguments,
        type = _ref24.type,
        directives = _ref24.directives;
    return name + wrap('(', join(args, ', '), ')') + ': ' + type + wrap(' ', join(directives, ' '));
  },

  InputValueDefinition: function InputValueDefinition(_ref25) {
    var name = _ref25.name,
        type = _ref25.type,
        defaultValue = _ref25.defaultValue,
        directives = _ref25.directives;
    return join([name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')], ' ');
  },

  InterfaceTypeDefinition: function InterfaceTypeDefinition(_ref26) {
    var name = _ref26.name,
        directives = _ref26.directives,
        fields = _ref26.fields;
    return join(['interface', name, join(directives, ' '), block(fields)], ' ');
  },

  UnionTypeDefinition: function UnionTypeDefinition(_ref27) {
    var name = _ref27.name,
        directives = _ref27.directives,
        types = _ref27.types;
    return join(['union', name, join(directives, ' '), '= ' + join(types, ' | ')], ' ');
  },

  EnumTypeDefinition: function EnumTypeDefinition(_ref28) {
    var name = _ref28.name,
        directives = _ref28.directives,
        values = _ref28.values;
    return join(['enum', name, join(directives, ' '), block(values)], ' ');
  },

  EnumValueDefinition: function EnumValueDefinition(_ref29) {
    var name = _ref29.name,
        directives = _ref29.directives;
    return join([name, join(directives, ' ')], ' ');
  },

  InputObjectTypeDefinition: function InputObjectTypeDefinition(_ref30) {
    var name = _ref30.name,
        directives = _ref30.directives,
        fields = _ref30.fields;
    return join(['input', name, join(directives, ' '), block(fields)], ' ');
  },

  TypeExtensionDefinition: function TypeExtensionDefinition(_ref31) {
    var definition = _ref31.definition;
    return 'extend ' + definition;
  },

  DirectiveDefinition: function DirectiveDefinition(_ref32) {
    var name = _ref32.name,
        args = _ref32.arguments,
        locations = _ref32.locations;
    return 'directive @' + name + wrap('(', join(args, ', '), ')') + ' on ' + join(locations, ' | ');
  }
};

/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */
function join(maybeArray, separator) {
  return maybeArray ? maybeArray.filter(function (x) {
    return x;
  }).join(separator || '') : '';
}

/**
 * Given array, print each item on its own line, wrapped in an
 * indented "{ }" block.
 */
function block(array) {
  return array && array.length !== 0 ? indent('{\n' + join(array, '\n')) + '\n}' : '{}';
}

/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise
 * print an empty string.
 */
function wrap(start, maybeString, end) {
  return maybeString ? start + maybeString + (end || '') : '';
}

function indent(maybeString) {
  return maybeString && maybeString.replace(/\n/g, '\n  ');
}

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleParser = undefined;

var _getIterator2 = __webpack_require__(21);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toStringTag = __webpack_require__(57);

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _from = __webpack_require__(171);

var _from2 = _interopRequireDefault(_from);

var _asyncToGenerator2 = __webpack_require__(25);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _set = __webpack_require__(60);

var _set2 = _interopRequireDefault(_set);

var _fs = __webpack_require__(58);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(39);

var _path2 = _interopRequireDefault(_path);

var _types = __webpack_require__(9);

var types = _interopRequireWildcard(_types);

var _GQLBase = __webpack_require__(6);

var _utils = __webpack_require__(59);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Promisify some bits
const readdirAsync = (0, _utils.promisify)(_fs2.default.readdir);

const statAsync = (0, _utils.promisify)(_fs2.default.stat);

// Fetch some type checking bits from 'types'
const typeOf = types.typeOf,
      isString = types.isString,
      isOfType = types.isOfType,
      isPrimitive = types.isPrimitive,
      isArray = types.isArray,
      isObject = types.isObject,
      extendsFrom = types.extendsFrom;

/**
 * The ModuleParser is a utility class designed to loop through and iterate
 * on a directory and pull out of each .js file found, any classes or exports
 * that extend from GQLBase or a child of GQLBase.
 *
 * @class ModuleParser
 * @since 2.7.0
 */

let ModuleParser = exports.ModuleParser = class ModuleParser {

  /**
   * The constructor
   *
   * @constructor
   * @method ⎆⠀constructor
   * @memberof ModuleParser
   * @inner
   *
   * @param {string} directory a string path to a directory containing the 
   * various GQLBase extended classes that should be gathered.
   */


  /**
   * A string denoting the directory on disk where `ModuleParser` should be
   * searching for its classes.
   * 
   * @memberof ModuleParser
   * @type {string}
   */
  constructor(directory) {
    this.directory = _path2.default.resolve(directory);
    this.classes = [];

    try {
      this.valid = _fs2.default.statSync(directory).isDirectory();
    } catch (error) {
      this.valid = false;
    }
  }

  /**
   * Given a file path, this method will attempt to import/require the
   * file in question and return the object it exported; whatever that 
   * may be. 
   *
   * @method ModuleParser#⌾⠀importClass
   * @since 2.7.0
   * 
   * @param {string} filePath a path to pass to `require()` 
   * 
   * @return {Object} the object, or undefined, that was returned when 
   * it was `require()`'ed.
   */


  /**
   * A boolean value denoting whether or not the `ModuleParser` instance is
   * valid; i.e. the directory it points to actually exists and is a directory
   *
   * @type {boolean}
   */

  /**
   * An internal array of `GQLBase` extended classes found during either a 
   * `parse()` or `parseSync()` call.
   *
   * @memberof ModuleParser
   * @type {Array<GQLBase>}
   */
  importClass(filePath) {
    let moduleContents = {};

    try {
      // Long story short; webpack makes this somewhat difficult but since 
      // we are targeting node, we can make this work with eval. Webpack 
      // does funny things with require which, in most cases, is the right 
      // thing to do.
      moduleContents = eval(`(require("${filePath}"))`);
    } catch (ignore) {
      console.log(`Skipping ${filePath}`, ignore);
    }

    return moduleContents;
  }

  /**
   * Given an object, typically the result of a `require()` or `import`
   * command, iterate over its contents and find any `GQLBase` derived
   * exports. Continually, and recursively, build this list of classes out
   * so that we can add them to a `GQLExpressMiddleware`.
   *
   * @method ModuleParser#⌾⠀findGQLBaseClasses
   * @since 2.7.0
   *
   * @param {Object} contents the object to parse for properties extending
   * from `GQLBase`
   * @param {Array<GQLBase>} gqlDefinitions the results, allowed as a second
   * parameter during recursion as a means to save state between calls
   * @return {Set<mixed>} a unique set of values that are currently being
   * iterated over. Passed in as a third parameter to save state between calls
   * during recursion.
   */
  findGQLBaseClasses(contents, gqlDefinitions = [], stack = new _set2.default()) {
    // In order to prevent infinite object recursion, we should add the
    // object being iterated over to our Set. At each new recursive level
    // add the item being iterated over to the set and only recurse into
    // if the item does not already exist in the stack itself.
    stack.add(contents);

    for (let key in contents) {
      let value = contents[key];

      if (isPrimitive(value)) {
        continue;
      }

      if (extendsFrom(value, _GQLBase.GQLBase)) {
        gqlDefinitions.push(value);
      }

      if ((isObject(value) || isArray(value)) && !stack.has(value)) {
        gqlDefinitions = this.findGQLBaseClasses(value, gqlDefinitions, stack);
      }
    }

    // We remove the current iterable from our set as we leave this current
    // recursive iteration.
    stack.delete(contents);

    return gqlDefinitions;
  }

  /**
   * This method takes a instance of ModuleParser, initialized with a directory,
   * and walks its contents, importing files as they are found, and sorting 
   * any exports that extend from GQLBase into an array of such classes 
   * in a resolved promise. 
   *
   * @method ModuleParser#⌾⠀parse
   * @async 
   * @since 2.7.0
   * 
   * @return {Promise<Array<GQLBase>>} an array GQLBase classes, or an empty 
   * array if none could be identified.
   */
  parse() {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let modules;
      let files;
      let set = new _set2.default();

      if (!_this.valid) {
        throw new Error(`
        ModuleParser instance is invalid for use with ${_this.directory}. 
        The path is either a non-existent path or it does not represent a
        directory.
      `);
      }

      // @ComputedType
      files = yield _this.constructor.walk(_this.directory);
      modules = files.map(function (file) {
        return _this.importClass(file);
      })

      // @ComputedType
      (modules.map(function (mod) {
        return _this.findGQLBaseClasses(mod);
      }).reduce(function (last, cur) {
        return (last || []).concat(cur || []);
      }, []).forEach(function (Class) {
        return set.add(Class);
      }));

      // Convert the set back into an array
      _this.classes = (0, _from2.default)(set);

      // We can ignore equality since we came from a set; @ComputedType
      _this.classes.sort(function (l, r) {
        return l.name < r.name ? -1 : 1;
      });

      return _this.classes;
    })();
  }

  /**
   * This method takes a instance of ModuleParser, initialized with a directory,
   * and walks its contents, importing files as they are found, and sorting 
   * any exports that extend from GQLBase into an array of such classes
   *
   * @method ModuleParser#⌾⠀parseSync
   * @async 
   * @since 2.7.0
   * 
   * @return {Array<GQLBase>} an array GQLBase classes, or an empty 
   * array if none could be identified.
   */
  parseSync() {
    let modules;
    let files;
    let set = new _set2.default();

    if (!this.valid) {
      throw new Error(`
        ModuleParser instance is invalid for use with ${this.directory}. 
        The path is either a non-existent path or it does not represent a
        directory.
      `);
    }

    files = this.constructor.walkSync(this.directory);
    modules = files.map(file => {
      return this.importClass(file);
    });

    modules.map(mod => this.findGQLBaseClasses(mod)).reduce((last, cur) => (last || []).concat(cur || []), []).forEach(Class => set.add(Class));

    // Convert the set back into an array
    this.classes = (0, _from2.default)(set);

    // We can ignore equality since we came from a set; @ComputedType
    this.classes.sort((l, r) => l.name < r.name ? -1 : 1);

    return this.classes;
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
   * Recursively walks a directory and returns an array of asbolute file paths 
   * to the files under the specified directory.
   *
   * @method ModuleParser~walk
   * @async
   * @since 2.7.0
   * 
   * @param {string} dir string path to the top level directory to parse
   * @param {Array<string>} filelist an array of existing absolute file paths, 
   * or if not parameter is supplied a default empty array will be used.
   * @return {Promise<Array<string>>} an array of existing absolute file paths 
   * found under the supplied `dir` directory.
   */
  static walk(dir, filelist = []) {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let files = yield readdirAsync(dir);
      let stats;

      files = files.map(function (file) {
        return _path2.default.resolve(_path2.default.join(dir, file));
      });

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let file = _step.value;

          stats = yield statAsync(file);
          if (stats.isDirectory()) {
            filelist = yield _this2.walk(file, filelist);
          } else {
            filelist = filelist.concat(file);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return filelist;
    })();
  }

  /**
   * Recursively walks a directory and returns an array of asbolute file paths 
   * to the files under the specified directory. This version does this in a 
   * synchronous fashion.
   *
   * @method ModuleParser~walkSync
   * @async
   * @since 2.7.0
   * 
   * @param {string} dir string path to the top level directory to parse
   * @param {Array<string>} filelist an array of existing absolute file paths, 
   * or if not parameter is supplied a default empty array will be used.
   * @return {Array<string>} an array of existing absolute file paths found 
   * under the supplied `dir` directory.
   */
  static walkSync(dir, filelist = []) {
    let files = (0, _fs.readdirSync)(dir);
    let stats;

    files = files.map(file => _path2.default.resolve(_path2.default.join(dir, file)));

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(files), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        let file = _step2.value;

        stats = (0, _fs.statSync)(file);
        if (stats.isDirectory()) {
          filelist = this.walkSync(file, filelist);
        } else {
          filelist = filelist.concat(file);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return filelist;
  }
};
exports.default = ModuleParser;

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(172), __esModule: true };

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
__webpack_require__(173);
module.exports = __webpack_require__(0).Array.from;

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(13)
  , $export        = __webpack_require__(2)
  , toObject       = __webpack_require__(27)
  , call           = __webpack_require__(77)
  , isArrayIter    = __webpack_require__(78)
  , toLength       = __webpack_require__(34)
  , createProperty = __webpack_require__(174)
  , getIterFn      = __webpack_require__(55);

$export($export.S + $export.F * !__webpack_require__(81)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(5)
  , createDesc      = __webpack_require__(22);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ })
/******/ ])));
//# sourceMappingURL=lattice.js.map