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
/******/ 	return __webpack_require__(__webpack_require__.s = 87);
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

var global    = __webpack_require__(3)
  , core      = __webpack_require__(0)
  , ctx       = __webpack_require__(10)
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(47)('wks')
  , uid        = __webpack_require__(28)
  , Symbol     = __webpack_require__(3).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

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
module.exports = !__webpack_require__(11)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(6)
  , IE8_DOM_DEFINE = __webpack_require__(63)
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

var isObject = __webpack_require__(7);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(5)
  , createDesc = __webpack_require__(26);
module.exports = __webpack_require__(4) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(44)
  , defined = __webpack_require__(24);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IDLFileHandler = exports.GQLBase = exports.REQ_DATA_KEY = exports.MODEL_KEY = undefined;

var _typeof2 = __webpack_require__(38);

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty = __webpack_require__(34);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _regenerator = __webpack_require__(52);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(74);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _taggedTemplateLiteral2 = __webpack_require__(114);

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _toStringTag = __webpack_require__(80);

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _assign = __webpack_require__(56);

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = __webpack_require__(57);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(20);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(21);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(58);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(59);

var _inherits3 = _interopRequireDefault(_inherits2);

var _for = __webpack_require__(22);

var _for2 = _interopRequireDefault(_for);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n        GQLBase class implementation. GQLBase is the root class used in\n        graphql-lattice to describe a GraphQLObjectType. If you are reading\n        this, the person using lattice failed to provide documentation for\n        their type. :)\n      '], ['\n        GQLBase class implementation. GQLBase is the root class used in\n        graphql-lattice to describe a GraphQLObjectType. If you are reading\n        this, the person using lattice failed to provide documentation for\n        their type. :)\n      ']); /** @namespace GQLBaseEnv */


var _path = __webpack_require__(81);

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(134);

var _fs2 = _interopRequireDefault(_fs);

var _utils = __webpack_require__(82);

var _types = __webpack_require__(15);

var _SyntaxTree = __webpack_require__(60);

var _graphql = __webpack_require__(37);

var _events = __webpack_require__(84);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Constant referring to the nodejs module in which this code is defined.
 *
 * @memberof GQLBaseEnv
 * @type {Object}
 * @const
 */
var GQLBaseModule = module;

/**
 * A `Symbol` used as a key to store the backing model data. Designed as a
 * way to separate model data and GraphQL property accessors into logical bits.
 *
 * @type {Symbol}
 * @memberof GQLBaseEnv
 * @const
 */
var MODEL_KEY = exports.MODEL_KEY = (0, _for2.default)('data-model-contents-key');

/**
 * A `Symbol` used as a key to store the request data for an instance of the
 * GQLBase object in question.
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberof GQLBaseEnv
 */
var REQ_DATA_KEY = exports.REQ_DATA_KEY = (0, _for2.default)('request-data-object-key');

/**
 * All GraphQL Type objects used in this system are assumed to have extended
 * from this class. An instance of this class can be used to wrap an existing
 * structure if you have one.
 *
 * @class GQLBase
 */

var GQLBase = exports.GQLBase = function (_EventEmitter) {
  (0, _inherits3.default)(GQLBase, _EventEmitter);

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
  function GQLBase() {
    var modelData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var requestData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _classCallCheck3.default)(this, GQLBase);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GQLBase.__proto__ || (0, _getPrototypeOf2.default)(GQLBase)).call(this));

    var Class = _this.constructor;

    GQLBase.setupModel(_this);
    _this.setModel(modelData);
    _this.requestData = requestData;
    _this.fileHandler = new IDLFileHandler(_this.constructor);
    return _this;
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


  (0, _createClass3.default)(GQLBase, [{
    key: 'getModel',
    value: function getModel() {
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

  }, {
    key: 'setModel',
    value: function setModel(value) {
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

  }, {
    key: 'extendModel',
    value: function extendModel() {
      for (var _len = arguments.length, extensions = Array(_len), _key = 0; _key < _len; _key++) {
        extensions[_key] = arguments[_key];
      }

      _assign2.default.apply(Object, [this[MODEL_KEY]].concat(extensions));
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

  }, {
    key: 'requestData',
    get: function get() {
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
    ,
    set: function set(value) {
      this[REQ_DATA_KEY] = value;
    }
  }, {
    key: _toStringTag2.default,


    /**
     * Returns the `constructor` name. If invoked as the context, or `this`,
     * object of the `toString` method of `Object`'s `prototype`, the resulting
     * value will be `[object MyClass]`, given an instance of `MyClass`
     *
     * @method ⌾⠀[Symbol.toStringTag]
     * @memberof ModuleParser
     *
     * @return {String} the name of the class this is an instance of
     */
    get: function get() {
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
     * @return {String} the name of this class
     */

  }], [{
    key: 'apiDocs',
    value: function apiDocs() {
      return {
        "class": (0, _utils.lineJoin)(_templateObject),

        "fields": {},

        "queries": {},

        "mutators": {},

        "subscriptions": {}
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
     *   static get SCHEMA(): String | Symbol {
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
     *   static get SCHEMA(): String | Symbol {
     *     return GQLBase.IDLFilePath('/path/to/file', '.idl')
     *   }
     * ```
     *
     * NOTE - Important!
     * When not returning a direct string based IDL schema, the call to super()
     * from a child class must include `module` as the second parameter or an
     * error will be thrown upon object creation.
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

  }, {
    key: 'MUTATORS',


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
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(requestData) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', {});

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function MUTATORS(_x3) {
        return _ref.apply(this, arguments);
      }

      return MUTATORS;
    }()

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

  }, {
    key: 'RESOLVERS',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(requestData) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', {});

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function RESOLVERS(_x4) {
        return _ref2.apply(this, arguments);
      }

      return RESOLVERS;
    }()

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

  }, {
    key: 'IDLFilePath',


    /**
     * Creates an appropriate Symbol crafted with the right data for use by
     * the IDLFileHandler class below.
     *
     * @static
     * @memberof GQLBase
     * @method ⌾⠀IDLFilePath
     *
     * @param {string} path a path to the IDL containing file
     * @param {String} [extension='.graphql'] an extension, including the
     * prefixed period, that will be added to the supplied path should it not
     * already exist.
     * @return Symbol
     *
     * @see {@link GQLBase#SCHEMA}
     */
    value: function IDLFilePath(path) {
      var extension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.graphql';

      return (0, _for2.default)('Path ' + path + ' Extension ' + extension);
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

  }, {
    key: 'setupModel',


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
    value: function setupModel(instance) {
      var _MODEL_KEY = (0, _for2.default)('data-model-contents-value');
      var hasProxy = typeof global.Proxy !== 'undefined';

      var changeHandler = {
        /**
         * Proxy set() handler. This is where the change events are fired from 
         * 
         * @method set
         * @param {Object} target the `GQLBase` model object 
         * @param {String} key the property name
         * @param {mixed} value the new property value
         */
        set: function set(target, key, value) {
          var old = target[key];

          target[key] = value;
          instance.emit(GQLBase.EVENT_MODEL_PROP_CHANGE, {
            model: target,
            old: old,
            key: key,
            value: value
          });
        },


        /**
         * Proxy deleteProperty() handler. This is where the delete property 
         * events are fired from  
         * 
         * @method deleteProperty
         * @param {Object} target the `GQLBase` model object 
         * @param {String} key the property name
         */
        deleteProperty: function deleteProperty(target, key) {
          var deleted = target[key];

          delete target[key];
          instance.emit(GQLBase.EVENT_MODEL_PROP_DELETE, {
            model: target,
            key: key,
            deleted: deleted
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
       * 
       * @type {[type]}
       */
      (0, _defineProperty2.default)(instance, MODEL_KEY, {
        get: function get() {
          var model = this[_MODEL_KEY];
          var hasListeners = this.listenerCount(GQLBase.EVENT_MODEL_PROP_CHANGE) + this.listenerCount(GQLBase.EVENT_MODEL_PROP_DELETE);

          if (hasProxy && hasListeners) {
            model = new Proxy(model, changeHandler);
          }

          return model;
        },

        set: function set(model) {
          var instance = this;

          this.emit(GQLBase.EVENT_MODEL_WILL_BE_SET, { model: model, instance: instance });
          instance[_MODEL_KEY] = model;
          this.emit(GQLBase.EVENT_MODEL_HAS_BEEN_SET, { model: model, instance: instance });
        }
      });
    }
  }, {
    key: 'SCHEMA',
    get: function get() {}
    // define in base class

  }, {
    key: 'ADJACENT_FILE',
    get: function get() {
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

  }, {
    key: 'GQL_TYPE',
    get: function get() {
      return _graphql.GraphQLObjectType;
    }
  }, {
    key: 'handler',
    get: function get() {
      var key = (0, _for2.default)(IDLFileHandler.name + '.' + this.name);

      if (!this[key]) {
        this[key] = new IDLFileHandler(this);
      }

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

  }, {
    key: 'module',
    get: function get() {
      return GQLBaseModule;
    }

    // TODO

  }, {
    key: 'EVENT_MODEL_WILL_BE_SET',
    get: function get() {
      return 'E: Int. model will be set';
    }

    // TODO

  }, {
    key: 'EVENT_MODEL_HAS_BEEN_SET',
    get: function get() {
      return 'E: Int. model has been set';
    }

    // TODO

  }, {
    key: 'EVENT_MODEL_PROP_CHANGE',
    get: function get() {
      return 'E: Int. model prop changed';
    }

    // TODO

  }, {
    key: 'EVENT_MODEL_PROP_DELETE',
    get: function get() {
      return 'E: Int. model prop deleted';
    }
  }, {
    key: _toStringTag2.default,
    get: function get() {
      return this.name;
    }
  }]);
  return GQLBase;
}(_events.EventEmitter);

/**
 * The handler, an instance of which is created for every instance of GQLBase.
 * The handler manages the fetching and decoding of files bearing the IDL
 * schema associated with the class represented by this instance of GQLBase.
 *
 * @class IDLFileHandler
 */


var IDLFileHandler = exports.IDLFileHandler = function () {
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
  function IDLFileHandler(Class) {
    (0, _classCallCheck3.default)(this, IDLFileHandler);

    var symbol = (0, _typeof3.default)(Class.SCHEMA) === 'symbol' && Class.SCHEMA || null;
    var pattern = /Symbol\(Path (.*?) Extension (.*?)\)/;

    if (symbol) {
      var symbolString = symbol.toString();

      if (symbol === Class.ADJACENT_FILE) {
        if (Class.module === GQLBaseModule) {
          throw new Error('\n            The a static getter for \'module\' on ' + Class.name + ' must be present\n            that returns the module object where the Class is defined. Try the\n            following:\n\n            // your ' + Class.name + '.js file\n            import { GQLBase } from \'graphql-lattice\'\n\n            const ' + Class.name + 'Module = module;\n\n            class ' + Class.name + ' extends GQLBase {\n              ...\n\n              static get module() {\n                return ' + Class.name + 'Module;\n              }\n            }\n\n          ');
        }

        var filename = Class.module.filename;
        var extension = _path2.default.extname(filename);
        var dir = _path2.default.dirname(filename);
        var filefixed = _path2.default.basename(filename, extension);
        var build = _path2.default.resolve(_path2.default.join(dir, filefixed + '.graphql'));

        this.path = build;
        this.extension = '.graphql';
      } else if (pattern.test(symbolString)) {
        var parsed = pattern.exec(symbolString);
        var _extension = parsed[2] || '.graphql';
        var _dir = _path2.default.dirname(parsed[1]);
        var file = _path2.default.basename(parsed[1], _extension);
        var _build = _path2.default.resolve(_path2.default.join(_dir, '' + file + _extension));

        this.path = _build;
        this.extension = _extension;
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


  (0, _createClass3.default)(IDLFileHandler, [{
    key: 'getFile',
    value: function getFile() {
      return _fs2.default.readFileSync(this.path);
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

  }, {
    key: 'getSchema',
    value: function getSchema() {
      if (!this.path) {
        return null;
      }

      var tree = this.getSyntaxTree();

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

  }, {
    key: 'getSyntaxTree',
    value: function getSyntaxTree() {
      var buffer = this.getFile();
      var tree = new _SyntaxTree.SyntaxTree(buffer.toString());

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
     * @return {String} the name of the class this is an instance of
     */

  }, {
    key: _toStringTag2.default,
    get: function get() {
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
     * @return {String} the name of this class
     */

  }], [{
    key: _toStringTag2.default,
    get: function get() {
      return this.name;
    }
  }]);
  return IDLFileHandler;
}();

exports.default = GQLBase;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(88)(module)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(66)
  , enumBugKeys = __webpack_require__(48);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PRIMITIVES = exports.NULL = exports.UNDEFINED = exports.isClass = exports.isOfType = exports.isValue = exports.isPrimitive = exports.isUndefined = exports.isNull = exports.isRegExp = exports.isNumber = exports.isString = exports.isObject = exports.isDate = exports.isArray = exports.isFunction = undefined;

var _for = __webpack_require__(22);

var _for2 = _interopRequireDefault(_for);

var _symbol = __webpack_require__(69);

var _symbol2 = _interopRequireDefault(_symbol);

var _set = __webpack_require__(83);

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = __webpack_require__(145);

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
 * @param {any} object any value is acceptable here, including null and 
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
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isFunction = exports.isFunction = function isFunction(obj) {
  return typeOf(obj) === Function.name;
};

/**
 * Returns true if the type supplied evaluates to `[object Array]`
 * 
 * @method ⌾⠀isArray 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isArray = exports.isArray = function isArray(obj) {
  return typeOf(obj) === Array.name;
};

/**
 * Returns true if the type supplied evaluates to `[object Date]`
 * 
 * @method ⌾⠀isDate 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isDate = exports.isDate = function isDate(obj) {
  return typeOf(obj) === Date.name;
};

/**
 * Returns true if the type supplied evaluates to `[object Object]`
 * 
 * @method ⌾⠀isObject 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isObject = exports.isObject = function isObject(obj) {
  return typeOf(obj) === Object.name;
};

/**
 * Returns true if the type supplied evaluates to `[object String]`
 * 
 * @method ⌾⠀isString 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isString = exports.isString = function isString(obj) {
  return typeOf(obj) === String.name;
};

/**
 * Returns true if the type supplied evaluates to `[object Number]`
 * 
 * @method ⌾⠀isNumber 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isNumber = exports.isNumber = function isNumber(obj) {
  return typeOf(obj) === isNumber.name;
};

/**
 * Returns true if the type supplied evaluates to `[object RegExp]`
 * 
 * @method ⌾⠀isRegExp 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isRegExp = exports.isRegExp = function isRegExp(obj) {
  return typeOf(obj) === RegExp.name;
};

/**
 * Returns true if the type supplied evaluates to `[object Null]`
 * 
 * @method ⌾⠀isNull 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isNull = exports.isNull = function isNull(obj) {
  return typeOf(obj) === NULL;
};

/**
 * Returns true if the type supplied evaluates to `[object Undefined]`
 * 
 * @method ⌾⠀isUndefined 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isUndefined = exports.isUndefined = function isUndefined(obj) {
  return typeOf(obj) === UNDEFINED;
};

/**
 * Determines if the resulting type is one of the six types of primitives
 * (according to MDN; https://goo.gl/USmkUU). If it is, true will be returned;
 * otherwise false.
 *
 * @method ⌾⠀isPrimitive
 * @memberof types
 * @inner
 * 
 * @return {Boolean} true if not one of Boolean, Null, Undefined, Number, 
 * String or Symbol. 
 */
var isPrimitive = exports.isPrimitive = function isPrimitive(obj) {
  return PRIMITIVES.has(obj);
};

/**
 * Returns true if the type supplied evaluates to neither `[object Object]`
 * nor `[object Array]`. 
 * 
 * @method ⌾⠀isValue 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isValue = exports.isValue = function isValue(obj) {
  return !isObject(obj) && !isArray(obj);
};

/**
 * A shorthand way to test an object's declared toString type to a supplied 
 * string or Function/Class. Realistically, this checks typeOf(obj) to both 
 * T and T.name. If either are true, then true is returned; false otherwise.
 * 
 * @method ⌾⠀isOfType 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
var isOfType = exports.isOfType = function isOfType(obj, T) {
  return typeOf(obj) === T || typeOf(obj) === T.name;
};

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
var isClass = exports.isClass = function isClass(obj) {
  return isNativeClassByProps(obj) || isNativeClassByString(obj);
};

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
function extendsFrom(TestedClass, RootClass) {
  var enforceClasses = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (parseInt(process.version.substring(1)) < 6) {
    throw new Error('\n      Reflect must be implemented in the JavaScript engine. This cannot be\n      polyfilled and as such, if process.version is less than 6 an error will\n      be thrown. Please try an alternate means of doing what you desire.\n    ');
  }

  if (enforceClasses) {
    if (!isClass(TestedClass) && !isClass(RootClass)) {
      throw new Error('\n        When using extendsFrom() with enforceClasses true, each Function \n        argument supplied must pass the isClass() method testing. See the \n        function isClass to learn more about these requirements.\n      ');
    }
  }

  if (!TestedClass || !RootClass) {
    return false;
  }

  var proto = TestedClass;

  while (true) {
    try {
      if (proto === RootClass) return true;
      if (proto === Function) break;
      proto = (0, _getPrototypeOf2.default)(proto);
    } catch (ignore) {
      return false;
    }
  }

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
var UNDEFINED = exports.UNDEFINED = typeOf(undefined);

/**
 * Programmatic constant defintion of the result of a call to 
 * `typeOf(null)`.
 *
 * @memberof types
 * @type {string}
 * @const 
 */
var NULL = exports.NULL = typeOf(null);

/**
 * Create a base set containing the typeOf representations for each of the 
 * known primitive types. 
 *
 * @type {Set<String>}
 * @memberof types 
 * @inner 
 */
var PRIMITIVES = new _set2.default([NULL, UNDEFINED, Boolean.name, Number.name, String.name, _symbol2.default.name]);

/** Store the original has() method and bind it to PRIMITIVES */
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
PRIMITIVES.has = function (o) {
  return PRIMITIVES[(0, _for2.default)('original_has')](typeOf(o));
};

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
/* 16 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(5).f
  , has = __webpack_require__(12)
  , TAG = __webpack_require__(2)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(34);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(133), __esModule: true };

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(90)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(40)(String, 'String', function(iterated){
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
/* 24 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 26 */
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(6)
  , dPs         = __webpack_require__(65)
  , enumBugKeys = __webpack_require__(48)
  , IE_PROTO    = __webpack_require__(46)('IE_PROTO')
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
  __webpack_require__(67).appendChild(iframe);
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
/* 28 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(24);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(94);
var global        = __webpack_require__(3)
  , hide          = __webpack_require__(8)
  , Iterators     = __webpack_require__(16)
  , TO_STRING_TAG = __webpack_require__(2)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(2);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(28)('meta')
  , isObject = __webpack_require__(7)
  , has      = __webpack_require__(12)
  , setDesc  = __webpack_require__(5).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(11)(function(){
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
/* 33 */
/***/ (function(module, exports) {



/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(102), __esModule: true };

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(10)
  , call        = __webpack_require__(108)
  , isArrayIter = __webpack_require__(109)
  , anObject    = __webpack_require__(6)
  , toLength    = __webpack_require__(45)
  , getIterFn   = __webpack_require__(76)
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(115), __esModule: true };

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(62);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(69);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(25)
  , $export        = __webpack_require__(1)
  , redefine       = __webpack_require__(64)
  , hide           = __webpack_require__(8)
  , has            = __webpack_require__(12)
  , Iterators      = __webpack_require__(16)
  , $iterCreate    = __webpack_require__(91)
  , setToStringTag = __webpack_require__(18)
  , getPrototypeOf = __webpack_require__(49)
  , ITERATOR       = __webpack_require__(2)('iterator')
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
/* 41 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7)
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
var isObject = __webpack_require__(7);
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

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(17);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(39)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(47)('keys')
  , uid    = __webpack_require__(28);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 48 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(12)
  , toObject    = __webpack_require__(29)
  , IE_PROTO    = __webpack_require__(46)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(3)
  , core           = __webpack_require__(0)
  , LIBRARY        = __webpack_require__(25)
  , wksExt         = __webpack_require__(31)
  , defineProperty = __webpack_require__(5).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 51 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(104);


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(17)
  , TAG = __webpack_require__(2)('toStringTag')
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

var hide = __webpack_require__(8);
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(121), __esModule: true };

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(124), __esModule: true };

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(38);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(126);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(130);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(38);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntaxTree = undefined;

var _toStringTag = __webpack_require__(80);

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _escape = __webpack_require__(148);

var _escape2 = _interopRequireDefault(_escape);

var _regenerator = __webpack_require__(52);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _iterator2 = __webpack_require__(62);

var _iterator3 = _interopRequireDefault(_iterator2);

var _getIterator2 = __webpack_require__(61);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = __webpack_require__(83);

var _set2 = _interopRequireDefault(_set);

var _assign = __webpack_require__(56);

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(20);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(21);

var _createClass3 = _interopRequireDefault(_createClass2);

var _for = __webpack_require__(22);

var _for2 = _interopRequireDefault(_for);

var _types = __webpack_require__(15);

var _graphql = __webpack_require__(37);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Shorthand for the key storing the internal AST
// @prop

// @module SyntaxTree

var AST_KEY = (0, _for2.default)('Internal AST Storage Key');

/**
 * A parser and processor of GraphQL IDL Abstract Syntax Trees. Used to combine
 * a set of {@link GQLBase} class instances.
 *
 * @class SyntaxTree
 */

var SyntaxTree = exports.SyntaxTree = function () {
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
  function SyntaxTree(schemaOrASTOrST) {
    (0, _classCallCheck3.default)(this, SyntaxTree);

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


  (0, _createClass3.default)(SyntaxTree, [{
    key: 'setAST',


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
    value: function setAST(schemaOrASTOrST) {
      this[AST_KEY] = {};

      var type = (0, _types.typeOf)(schemaOrASTOrST);
      var schema = void 0;
      var ast = void 0;
      var st = void 0;

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

  }, {
    key: 'updateAST',
    value: function updateAST(ast) {
      if ((0, _types.typeOf)(ast) === Object.name) {
        var newAST = (0, _assign2.default)({}, this.ast, ast);

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

  }, {
    key: 'appendDefinitions',
    value: function appendDefinitions(schemaOrASTOrST) {
      var source = SyntaxTree.from(schemaOrASTOrST);
      var set = new _set2.default();

      this.ast.definitions.map(function (definition) {
        set.add(definition.name.value);
      });

      if (source && source.ast.definitions && this.ast.definitions) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var theirs = _step.value;

            var name = theirs.name.value;
            var ours = this.find(name);
            var index = ours && this.ast.definitions.indexOf(ours) || -1;

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

  }, {
    key: 'consumeDefinition',
    value: function consumeDefinition(astOrSyntaxTree) {
      var definitionType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Query";

      if (!astOrSyntaxTree || !this.ast || !this.ast.definitions) {
        return this;
      }

      var tree = (0, _types.typeOf)(SyntaxTree) === SyntaxTree.name ? astOrSyntaxTree : SyntaxTree.from(astOrSyntaxTree);
      var left = this.find(definitionType);
      var right = tree.find(definitionType);

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
     */

  }, {
    key: _iterator3.default,
    value: _regenerator2.default.mark(function value() {
      return _regenerator2.default.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this[AST_KEY].definitions) {
                _context.next = 5;
                break;
              }

              return _context.delegateYield(this[AST_KEY].definitions, 't0', 2);

            case 2:
              return _context.abrupt('return', _context.t0);

            case 5:
              return _context.delegateYield(this, 't1', 6);

            case 6:
              return _context.abrupt('return', _context.t1);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, value, this);
    })

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

  }, {
    key: 'find',
    value: function find(definitionName) {
      var isRegExp = /RegExp/.test((0, _types.typeOf)(definitionName));
      var regex = !isRegExp ? new RegExp((0, _escape2.default)(definitionName.toString())) : definitionName;
      var flags = regex.flags;
      var source = regex.source;
      var reducer = function reducer(last, cur, i) {
        if (last !== -1) return last;
        return new RegExp(source, flags).test(cur.name.value) ? i : -1;
      };
      var index = this[AST_KEY].definitions.reduce(reducer, -1);

      return ~index ? this[AST_KEY].definitions[index] : null;
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

  }, {
    key: 'toString',
    value: function toString() {
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

  }, {
    key: 'ast',
    get: function get() {
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
    ,
    set: function set(value) {
      this[AST_KEY] = value;
    }
  }, {
    key: _toStringTag2.default,


    /**
     * Returns the `constructor` name. If invoked as the context, or `this`,
     * object of the `toString` method of `Object`'s `prototype`, the resulting
     * value will be `[object MyClass]`, given an instance of `MyClass`
     *
     * @method ⌾⠀[Symbol.toStringTag]
     * @memberof SyntaxTree
     *
     * @return {string} the name of the class this is an instance of
     */
    get: function get() {
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
     */

  }], [{
    key: 'from',


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
    value: function from(mixed) {
      var schema = void 0;
      var ast = void 0;

      switch ((0, _types.typeOf)(mixed)) {
        case String.name:
          schema = mixed;
          try {
            (0, _graphql.parse)(schema);
          } catch (error) {
            console.log(error);return null;
          }

          return SyntaxTree.fromSchema(schema);
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

  }, {
    key: 'fromSchema',
    value: function fromSchema(schema) {
      var ast = (0, _graphql.parse)(schema);
      var tree = new SyntaxTree(ast);

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

  }, {
    key: 'fromAST',
    value: function fromAST(ast) {
      var source = (0, _graphql.parse)((0, _graphql.print)(ast));
      var tree = new SyntaxTree(source);

      return source ? tree : null;
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

  }, {
    key: 'EmptyQuery',
    value: function EmptyQuery() {
      return SyntaxTree.from('type ' + this.QUERY + ' {}');
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

  }, {
    key: 'EmptyMutation',
    value: function EmptyMutation() {
      return SyntaxTree.from('type ' + this.MUTATION + ' {}');
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

  }, {
    key: 'EmptyDocument',
    value: function EmptyDocument(schemaOrASTOrST) {
      var tree = new SyntaxTree();

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
  }, {
    key: 'QUERY',
    get: function get() {
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

  }, {
    key: 'MUTATION',
    get: function get() {
      return 'Mutation';
    }
  }, {
    key: _toStringTag2.default,
    get: function get() {
      return this.name;
    }
  }]);
  return SyntaxTree;
}();

exports.default = SyntaxTree;

// repl testing
// require('./bootstrap'); let typeOf = require('./lib/utils').typeOf, GQL=require('graphql'), ST = require('./lib/GraphQL/SyntaxTree').SyntaxTree, schema = `input MessageInput { content: String author: String } type Message { id: ID! content: String author: String } type Query { getMessage(id: ID!): Message } type Mutation { createMessage(input: MessageInput): Message updateMessage(id: ID!, input: MessageInput): Message }`, ast = GQL.parse(schema), st = ST.fromSchema(schema), query = ST.EmptyQuery(), mutation = ST.EmptyMutation()

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(152), __esModule: true };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(89), __esModule: true };

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(4) && !__webpack_require__(11)(function(){
  return Object.defineProperty(__webpack_require__(42)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(5)
  , anObject = __webpack_require__(6)
  , getKeys  = __webpack_require__(14);

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
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(12)
  , toIObject    = __webpack_require__(9)
  , arrayIndexOf = __webpack_require__(92)(false)
  , IE_PROTO     = __webpack_require__(46)('IE_PROTO');

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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3).document && document.documentElement;

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(96), __esModule: true };

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(3)
  , has            = __webpack_require__(12)
  , DESCRIPTORS    = __webpack_require__(4)
  , $export        = __webpack_require__(1)
  , redefine       = __webpack_require__(64)
  , META           = __webpack_require__(32).KEY
  , $fails         = __webpack_require__(11)
  , shared         = __webpack_require__(47)
  , setToStringTag = __webpack_require__(18)
  , uid            = __webpack_require__(28)
  , wks            = __webpack_require__(2)
  , wksExt         = __webpack_require__(31)
  , wksDefine      = __webpack_require__(50)
  , keyOf          = __webpack_require__(97)
  , enumKeys       = __webpack_require__(98)
  , isArray        = __webpack_require__(71)
  , anObject       = __webpack_require__(6)
  , toIObject      = __webpack_require__(9)
  , toPrimitive    = __webpack_require__(43)
  , createDesc     = __webpack_require__(26)
  , _create        = __webpack_require__(27)
  , gOPNExt        = __webpack_require__(99)
  , $GOPD          = __webpack_require__(73)
  , $DP            = __webpack_require__(5)
  , $keys          = __webpack_require__(14)
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
  __webpack_require__(19).f  = $propertyIsEnumerable;
  __webpack_require__(51).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(25)){
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(17);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(66)
  , hiddenKeys = __webpack_require__(48).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(19)
  , createDesc     = __webpack_require__(26)
  , toIObject      = __webpack_require__(9)
  , toPrimitive    = __webpack_require__(43)
  , has            = __webpack_require__(12)
  , IE8_DOM_DEFINE = __webpack_require__(63)
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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(75);

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
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(106), __esModule: true };

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(53)
  , ITERATOR  = __webpack_require__(2)('iterator')
  , Iterators = __webpack_require__(16);
module.exports = __webpack_require__(0).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(10)
  , invoke             = __webpack_require__(111)
  , html               = __webpack_require__(67)
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
  if(__webpack_require__(17)(process) == 'process'){
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
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(3)
  , core        = __webpack_require__(0)
  , dP          = __webpack_require__(5)
  , DESCRIPTORS = __webpack_require__(4)
  , SPECIES     = __webpack_require__(2)('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(1)
  , core    = __webpack_require__(0)
  , fails   = __webpack_require__(11);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(120), __esModule: true };

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deferred = undefined;

var _promise = __webpack_require__(75);

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = __webpack_require__(20);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(21);

var _createClass3 = _interopRequireDefault(_createClass2);

exports.lineJoin = lineJoin;

var _types = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Deferred is modeled after jQuery's deferred object. It inverts a promise
 * such that its resolve and reject methods can be invoked without wrapping
 * all of the related code within a Promise's function.
 *
 * @memberof utils
 * @class Deferred
 */
var Deferred = exports.Deferred = function () {
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
  function Deferred(resolveWith, rejectWith) {
    var _this = this;

    (0, _classCallCheck3.default)(this, Deferred);

    this.promise = new _promise2.default(function (resolve, reject) {
      _this.complete = false;

      _this.resolve = function () {
        _this.complete = true;
        return resolve.apply(undefined, arguments);
      };

      _this.reject = function () {
        _this.complete = true;
        return reject.apply(undefined, arguments);
      };

      if (resolveWith && !rejectWith) {
        _this.resolve(resolveWith);
      }
      if (rejectWith && !resolveWith) {
        _this.reject(rejectWith);
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


  (0, _createClass3.default)(Deferred, [{
    key: 'pending',
    get: function get() {
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

  }], [{
    key: 'TimedDeferred',
    value: function TimedDeferred(timeOut, proxyPromise) {
      var deferred = new Deferred();

      if (proxyPromise && (0, _types.typeOf)(proxyPromise) === _promise2.default.name) {
        proxyPromise.then(function () {
          return deferred.resolve.apply(deferred, arguments);
        });
        proxyPromise.catch(function (reason) {
          return deferred.reject(reason);
        });
      }

      setTimeout(function () {
        return deferred.reject(new Error('Deferred timed out'), timeOut);
      });

      return deferred;
    }
  }]);
  return Deferred;
}();

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
/** @namespace utils */


function lineJoin(strings) {
  var result = [];

  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < strings.length; i++) {
    var string = strings[i];
    var value = values.length > i && values[i] + ' ' || '';
    result.push(string.replace(/(^\s*)?(.*)(\s*$)?/g, '$2').replace(/\r?\n/g, ' '));
    result.push(value);
  }
  return result.join('');
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(135), __esModule: true };

/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLInterface = undefined;

var _getPrototypeOf = __webpack_require__(57);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(20);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(21);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(58);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(59);

var _inherits3 = _interopRequireDefault(_inherits2);

var _GQLBase2 = __webpack_require__(13);

var _graphql = __webpack_require__(37);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Used by Lattice to implement interface types in the schema when necessary
 *
 * @class GQLInterface
 */
/**
 @namespace GQLInterface
 
 */

var GQLInterface = exports.GQLInterface = function (_GQLBase) {
  (0, _inherits3.default)(GQLInterface, _GQLBase);

  function GQLInterface() {
    (0, _classCallCheck3.default)(this, GQLInterface);
    return (0, _possibleConstructorReturn3.default)(this, (GQLInterface.__proto__ || (0, _getPrototypeOf2.default)(GQLInterface)).apply(this, arguments));
  }

  (0, _createClass3.default)(GQLInterface, null, [{
    key: 'resolveType',


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
     * @return {String} a string matching the name of a defined GraphQL type
     * found elsewhere in your schema
     */
    value: function resolveType(model) {
      throw new Error('\n      You must override "resolveType(model)" in your GQLInterface instance\n      and determine the implementor type by the contents of the supplied\n      model. Returning "null" when nothing matches.\n    ');
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

  }, {
    key: 'GQL_TYPE',
    get: function get() {
      return _graphql.GraphQLInterfaceType;
    }
  }]);
  return GQLInterface;
}(_GQLBase2.GQLBase);

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(34);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileSchema = exports.Schema = exports.Properties = exports.Setters = exports.Getters = exports.AdjacentSchema = exports.typeOf = exports.types = exports.Deferred = exports.SyntaxTree = exports.GQLExpressMiddleware = exports.GQLInterface = exports.GQLBase = undefined;

var _GQLBase = __webpack_require__(13);

var _GQLInterface = __webpack_require__(85);

var _GQLExpressMiddleware = __webpack_require__(154);

var _SyntaxTree = __webpack_require__(60);

var _utils = __webpack_require__(82);

var _AdjacentSchema = __webpack_require__(160);

var _ModelProperties = __webpack_require__(161);

var _Schema = __webpack_require__(163);

var _FileSchema = __webpack_require__(164);

var _types = __webpack_require__(15);

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var typeOf = types.typeOf;

/* Create a friendly bundle to export all at once */

var defaultPackage = {
  GQLBase: _GQLBase.GQLBase,
  GQLInterface: _GQLInterface.GQLInterface,
  GQLExpressMiddleware: _GQLExpressMiddleware.GQLExpressMiddleware,
  SyntaxTree: _SyntaxTree.SyntaxTree,
  Deferred: _utils.Deferred,
  AdjacentSchema: _AdjacentSchema.AdjacentSchema,
  Getters: _ModelProperties.Getters,
  Setters: _ModelProperties.Setters,
  Properties: _ModelProperties.Properties,
  Schema: _Schema.Schema,
  FileSchema: _FileSchema.FileSchema,
  typeOf: typeOf,
  types: types
};

/* Also export each of the constructs individually */
exports.GQLBase = _GQLBase.GQLBase;
exports.GQLInterface = _GQLInterface.GQLInterface;
exports.GQLExpressMiddleware = _GQLExpressMiddleware.GQLExpressMiddleware;
exports.SyntaxTree = _SyntaxTree.SyntaxTree;
exports.Deferred = _utils.Deferred;
exports.types = types;
exports.typeOf = typeOf;
exports.AdjacentSchema = _AdjacentSchema.AdjacentSchema;
exports.Getters = _ModelProperties.Getters;
exports.Setters = _ModelProperties.Setters;
exports.Properties = _ModelProperties.Properties;
exports.Schema = _Schema.Schema;
exports.FileSchema = _FileSchema.FileSchema;
exports.default = defaultPackage;

/***/ }),
/* 88 */
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
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(23);
__webpack_require__(30);
module.exports = __webpack_require__(31).f('iterator');

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(39)
  , defined   = __webpack_require__(24);
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
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(27)
  , descriptor     = __webpack_require__(26)
  , setToStringTag = __webpack_require__(18)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(8)(IteratorPrototype, __webpack_require__(2)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(9)
  , toLength  = __webpack_require__(45)
  , toIndex   = __webpack_require__(93);
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
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(39)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(95)
  , step             = __webpack_require__(68)
  , Iterators        = __webpack_require__(16)
  , toIObject        = __webpack_require__(9);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(40)(Array, 'Array', function(iterated, kind){
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
/* 95 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70);
__webpack_require__(33);
__webpack_require__(100);
__webpack_require__(101);
module.exports = __webpack_require__(0).Symbol;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(14)
  , toIObject = __webpack_require__(9);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(14)
  , gOPS    = __webpack_require__(51)
  , pIE     = __webpack_require__(19);
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
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(9)
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
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(50)('asyncIterator');

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(50)('observable');

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(103);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(4), 'Object', {defineProperty: __webpack_require__(5).f});

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(105);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 105 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(33);
__webpack_require__(23);
__webpack_require__(30);
__webpack_require__(107);
module.exports = __webpack_require__(0).Promise;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY            = __webpack_require__(25)
  , global             = __webpack_require__(3)
  , ctx                = __webpack_require__(10)
  , classof            = __webpack_require__(53)
  , $export            = __webpack_require__(1)
  , isObject           = __webpack_require__(7)
  , aFunction          = __webpack_require__(41)
  , anInstance         = __webpack_require__(54)
  , forOf              = __webpack_require__(35)
  , speciesConstructor = __webpack_require__(110)
  , task               = __webpack_require__(77).set
  , microtask          = __webpack_require__(112)()
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
      , FakePromise = (promise.constructor = {})[__webpack_require__(2)('species')] = function(exec){ exec(empty, empty); };
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
  Internal.prototype = __webpack_require__(55)($Promise.prototype, {
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
__webpack_require__(18)($Promise, PROMISE);
__webpack_require__(78)(PROMISE);
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
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(113)(function(iter){
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
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(6);
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
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(16)
  , ITERATOR   = __webpack_require__(2)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(6)
  , aFunction = __webpack_require__(41)
  , SPECIES   = __webpack_require__(2)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 111 */
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
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , macrotask = __webpack_require__(77).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(17)(process) == 'process';

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
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(2)('iterator')
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
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperties = __webpack_require__(36);

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _freeze = __webpack_require__(117);

var _freeze2 = _interopRequireDefault(_freeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (strings, raw) {
  return (0, _freeze2.default)((0, _defineProperties2.default)(strings, {
    raw: {
      value: (0, _freeze2.default)(raw)
    }
  }));
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(116);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperties(T, D){
  return $Object.defineProperties(T, D);
};

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(4), 'Object', {defineProperties: __webpack_require__(65)});

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(118), __esModule: true };

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(119);
module.exports = __webpack_require__(0).Object.freeze;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(7)
  , meta     = __webpack_require__(32).onFreeze;

__webpack_require__(79)('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(33);
module.exports = __webpack_require__(31).f('toStringTag');

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(122);
module.exports = __webpack_require__(0).Object.assign;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(1);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(123)});

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(14)
  , gOPS     = __webpack_require__(51)
  , pIE      = __webpack_require__(19)
  , toObject = __webpack_require__(29)
  , IObject  = __webpack_require__(44)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(11)(function(){
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
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(125);
module.exports = __webpack_require__(0).Object.getPrototypeOf;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(29)
  , $getPrototypeOf = __webpack_require__(49);

__webpack_require__(79)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(127), __esModule: true };

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(128);
module.exports = __webpack_require__(0).Object.setPrototypeOf;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(1);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(129).set});

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(7)
  , anObject = __webpack_require__(6);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(10)(Function.call, __webpack_require__(73).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(131), __esModule: true };

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(132);
var $Object = __webpack_require__(0).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(27)});

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70);
module.exports = __webpack_require__(0).Symbol['for'];

/***/ }),
/* 134 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(33);
__webpack_require__(23);
__webpack_require__(30);
__webpack_require__(136);
__webpack_require__(142);
module.exports = __webpack_require__(0).Set;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(137);

// 23.2 Set Objects
module.exports = __webpack_require__(138)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP          = __webpack_require__(5).f
  , create      = __webpack_require__(27)
  , redefineAll = __webpack_require__(55)
  , ctx         = __webpack_require__(10)
  , anInstance  = __webpack_require__(54)
  , defined     = __webpack_require__(24)
  , forOf       = __webpack_require__(35)
  , $iterDefine = __webpack_require__(40)
  , step        = __webpack_require__(68)
  , setSpecies  = __webpack_require__(78)
  , DESCRIPTORS = __webpack_require__(4)
  , fastKey     = __webpack_require__(32).fastKey
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
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global         = __webpack_require__(3)
  , $export        = __webpack_require__(1)
  , meta           = __webpack_require__(32)
  , fails          = __webpack_require__(11)
  , hide           = __webpack_require__(8)
  , redefineAll    = __webpack_require__(55)
  , forOf          = __webpack_require__(35)
  , anInstance     = __webpack_require__(54)
  , isObject       = __webpack_require__(7)
  , setToStringTag = __webpack_require__(18)
  , dP             = __webpack_require__(5).f
  , each           = __webpack_require__(139)(0)
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
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = __webpack_require__(10)
  , IObject  = __webpack_require__(44)
  , toObject = __webpack_require__(29)
  , toLength = __webpack_require__(45)
  , asc      = __webpack_require__(140);
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
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(141);

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7)
  , isArray  = __webpack_require__(71)
  , SPECIES  = __webpack_require__(2)('species');

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
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(1);

$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(143)('Set')});

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(53)
  , from    = __webpack_require__(144);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(35);

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(146), __esModule: true };

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(147);
module.exports = __webpack_require__(0).Reflect.getPrototypeOf;

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = __webpack_require__(1)
  , getProto = __webpack_require__(49)
  , anObject = __webpack_require__(6);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(149), __esModule: true };

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(150);
module.exports = __webpack_require__(0).RegExp.escape;

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(1)
  , $re     = __webpack_require__(151)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});


/***/ }),
/* 151 */
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
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(30);
__webpack_require__(23);
module.exports = __webpack_require__(153);

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(6)
  , get      = __webpack_require__(76);
module.exports = __webpack_require__(0).getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLExpressMiddleware = undefined;

var _values = __webpack_require__(155);

var _values2 = _interopRequireDefault(_values);

var _regenerator = __webpack_require__(52);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = __webpack_require__(56);

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = __webpack_require__(61);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = __webpack_require__(74);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = __webpack_require__(57);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(20);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(21);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(58);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(59);

var _inherits3 = _interopRequireDefault(_inherits2);

var _SyntaxTree = __webpack_require__(60);

var _expressGraphql = __webpack_require__(159);

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _graphql = __webpack_require__(37);

var _GQLBase = __webpack_require__(13);

var _GQLInterface = __webpack_require__(85);

var _types = __webpack_require__(15);

var _events = __webpack_require__(84);

var _path = __webpack_require__(81);

var _path2 = _interopRequireDefault(_path);

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

var GQLExpressMiddleware = exports.GQLExpressMiddleware = function (_EventEmitter) {
  (0, _inherits3.default)(GQLExpressMiddleware, _EventEmitter);

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
  function GQLExpressMiddleware(handlers) {
    (0, _classCallCheck3.default)(this, GQLExpressMiddleware);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GQLExpressMiddleware.__proto__ || (0, _getPrototypeOf2.default)(GQLExpressMiddleware)).call(this));

    _this.handlers = handlers;
    return _this;
  }

  /**
   * An asynchronous function used to parse the supplied classes for each
   * ones resolvers and mutators. These are all combined into a single root
   * object passed to express-graphql.
   *
   * @instance
   * @memberof GQLExpressMiddleware
   * @method ⌾⠀makeRoot
   *
   * @param {Request} req an Express 4.x request object
   * @param {Response} res an Express 4.x response object
   * @param {Object} gql an object containing information about the graphql
   * request. It has the format of `{ query, variables, operationName, raw }`
   * as described here: https://github.com/graphql/express-graphql
   * @return {Promise<Object>} a Promise resolving to an Object containing all
   * the functions described in both Query and Mutation types.
   */


  (0, _createClass3.default)(GQLExpressMiddleware, [{
    key: 'makeRoot',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, gql) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, object;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.root = {};

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 4;
                _iterator = (0, _getIterator3.default)(this.handlers);

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 20;
                  break;
                }

                object = _step.value;
                _context.t0 = _assign2.default;
                _context.t1 = this.root;
                _context.next = 12;
                return object.RESOLVERS({ req: req, res: res, gql: gql });

              case 12:
                _context.t2 = _context.sent;
                _context.next = 15;
                return object.MUTATORS({ req: req, res: res, gql: gql });

              case 15:
                _context.t3 = _context.sent;
                (0, _context.t0)(_context.t1, _context.t2, _context.t3);

              case 17:
                _iteratorNormalCompletion = true;
                _context.next = 6;
                break;

              case 20:
                _context.next = 26;
                break;

              case 22:
                _context.prev = 22;
                _context.t4 = _context['catch'](4);
                _didIteratorError = true;
                _iteratorError = _context.t4;

              case 26:
                _context.prev = 26;
                _context.prev = 27;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 29:
                _context.prev = 29;

                if (!_didIteratorError) {
                  _context.next = 32;
                  break;
                }

                throw _iteratorError;

              case 32:
                return _context.finish(29);

              case 33:
                return _context.finish(26);

              case 34:
                return _context.abrupt('return', this.root);

              case 35:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 22, 26, 34], [27,, 29, 33]]);
      }));

      function makeRoot(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return makeRoot;
    }()

    /**
     * A function that combines the IDL schemas of all the supplied classes and
     * returns that value to the middleware getter.
     *
     * @instance
     * @memberof GQLExpressMiddleware
     * @method ⌾⠀makeSchema
     *
     * @return {string} a dynamically generated GraphQL IDL schema string
     */

  }, {
    key: 'makeSchema',
    value: function makeSchema() {
      var schema = _SyntaxTree.SyntaxTree.EmptyDocument();

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this.handlers), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var Class = _step2.value;

          var classSchema = Class.SCHEMA;

          if ((0, _types.typeOf)(classSchema) === 'Symbol') {
            var handler = Class.handler;
            var filename = _path2.default.basename(Class.handler.path);

            classSchema = handler.getSchema();
            console.log('\nRead schema (%s)\n%s\n%s\n', filename, '-'.repeat(14 + filename.length), classSchema.replace(/^/gm, '  '));
          }

          schema.appendDefinitions(classSchema);
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

      console.log('\nGenerated GraphQL Schema\n----------------\n%s', schema);

      return schema.toString();
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

  }, {
    key: 'customMiddleware',


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
    value: function customMiddleware() {
      var _this2 = this;

      var graphqlHttpOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { graphiql: true };
      var patchFinalOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var schema = (0, _graphql.buildSchema)(this.makeSchema());

      // TODO handle scalars, unions and the rest 
      this.injectInterfaceResolvers(schema);
      this.injectComments(schema);

      // See if there is a way abstract the passing req, res, gql to each 
      // makeRoot resolver without invoking makeRoot again every time.
      return (0, _expressGraphql2.default)(function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res, gql) {
          var opts;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.t0 = schema;
                  _context2.next = 3;
                  return _this2.makeRoot(req, res, gql);

                case 3:
                  _context2.t1 = _context2.sent;

                  _context2.t2 = function formatError(error) {
                    return {
                      message: error.message,
                      locations: error.locations,
                      stack: error.stack,
                      path: error.path
                    };
                  };

                  opts = {
                    schema: _context2.t0,
                    rootValue: _context2.t1,
                    formatError: _context2.t2
                  };


                  (0, _assign2.default)(opts, graphqlHttpOptions);
                  if (patchFinalOpts) {
                    (0, _assign2.default)(opts, patchFinalOpts.bind(_this2)(opts) || opts);
                  }

                  return _context2.abrupt('return', opts);

                case 9:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this2);
        }));

        return function (_x6, _x7, _x8) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: 'injectComments',
    value: function injectComments(schema) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(this.handlers), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var handler = _step3.value;
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
  }, {
    key: 'injectInterfaceResolvers',
    value: function injectInterfaceResolvers(schema) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)(this.handlers), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var handler = _step4.value;

          if (handler.GQL_TYPE === _graphql.GraphQLInterfaceType) {
            console.log('Applying ' + handler.name + '\'s resolveType() method');
            schema._typeMap[handler.name].resolveType = schema._typeMap[handler.name]._typeConfig.resolveType = handler.resolveType;
          }
        }

        // TODO remove this
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

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = (0, _getIterator3.default)((0, _values2.default)(schema._typeMap)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var type = _step5.value;

          console.log('\x1b[1m%s\n\x1b[0m%s', type.name);
          console.dir(type);
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
  }, {
    key: 'middleware',
    get: function get() {
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

  }, {
    key: 'middlewareWithoutGraphiQL',
    get: function get() {
      return this.customMiddleware({ graphiql: false });
    }
  }]);
  return GQLExpressMiddleware;
}(_events.EventEmitter);

exports.default = GQLExpressMiddleware;

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(156), __esModule: true };

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(157);
module.exports = __webpack_require__(0).Object.values;

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(1)
  , $values = __webpack_require__(158)(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(14)
  , toIObject = __webpack_require__(9)
  , isEnum    = __webpack_require__(19).f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

/***/ }),
/* 159 */
/***/ (function(module, exports) {

module.exports = require("express-graphql");

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdjacentSchema = undefined;

var _defineProperty2 = __webpack_require__(86);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _for = __webpack_require__(22);

var _for2 = _interopRequireDefault(_for);

var _defineProperties = __webpack_require__(36);

var _defineProperties2 = _interopRequireDefault(_defineProperties);

exports.default = AdjacentSchema;

var _GQLBase = __webpack_require__(13);

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
    delete target.SCHEMA;
    delete target.module;

    return (0, _defineProperties2.default)(target, (0, _defineProperty3.default)({
      module: {
        get: function get() {
          return classModule;
        }
      },

      SCHEMA: {
        get: function get() {
          return _GQLBase.GQLBase.ADJACENT_FILE;
        }
      }

    }, (0, _for2.default)('@adjacentSchema'), {
      get: function get() {
        return true;
      }
    }));
  };
} /** @namespace decorators */


exports.AdjacentSchema = AdjacentSchema;

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty = __webpack_require__(34);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getIterator2 = __webpack_require__(61);

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.Getters = Getters;
exports.Setters = Setters;
exports.Properties = Properties;

var _GQLBase = __webpack_require__(13);

var _types = __webpack_require__(15);

var _util = __webpack_require__(162);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extractBits(property) {
  var array = (0, _types.isArray)(property) ? property : [property, property, null];
  var reply = void 0;

  if (!property) {
    var error = new Error('Invalid property. Given\n  %o', (0, _util.inspect)(property, { depth: 2 }));

    return {
      typePropertyName: 'anErrorOccurred',
      modelPropertyName: 'anErrorOccurred',
      typeClass: null,
      getterMaker: function getterMaker() {
        return function () {
          return error;
        };
      },
      setterMaker: function setterMaker() {
        return function (v) {
          return undefined;
        };
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
    var _reply = reply,
        modelPropertyName = _reply.modelPropertyName,
        typeClass = _reply.typeClass;

    return function () {
      return typeClass ? new typeClass(this[_GQLBase.MODEL_KEY][modelPropertyName]) : this[_GQLBase.MODEL_KEY][modelPropertyName];
    };
  };

  reply.setterMaker = function () {
    var _reply2 = reply,
        modelPropertyName = _reply2.modelPropertyName;

    return function (value) {
      this[_GQLBase.MODEL_KEY][modelPropertyName] = value;
    };
  };

  return reply;
}

/**
 * When working with `GQLBase` instances that expose properties
 * that have a 1:1 mapping to their own model property of the
 * same name, adding the getters manually can be annoying. This
 * takes an indeterminate amount of strings representing the
 * properties for which getters should be injected.
 *
 * @function Getters
 * @memberof! decorators
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 'name' 
 * and 'age' as properties, then passing those two strings will result
 * in getters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method.s
 */
/** @namespace decorators */


function Getters() {
  for (var _len = arguments.length, propertyNames = Array(_len), _key = 0; _key < _len; _key++) {
    propertyNames[_key] = arguments[_key];
  }

  return function (target) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(propertyNames), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var property = _step.value;

        var _extractBits = extractBits(property),
            typePropertyName = _extractBits.typePropertyName,
            getterMaker = _extractBits.getterMaker;

        (0, _defineProperty2.default)(target.prototype, typePropertyName, {
          value: getterMaker()
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
 * @function Setters
 * @memberof! decorators
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 
 * 'name' and 'age' as properties, then passing those two strings will 
 * result in setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
function Setters() {
  for (var _len2 = arguments.length, propertyNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    propertyNames[_key2] = arguments[_key2];
  }

  return function (target) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(propertyNames), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var property = _step2.value;

        var _extractBits2 = extractBits(property),
            typePropertyName = _extractBits2.typePropertyName,
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
 * @function Properties
 * @memberof! decorators
 * @since 2.1.0
 *
 * @param {Array<String|Array<String>>} propertyNames if the model has 'name' 
 * and 'age' as properties, then passing those two strings will result
 * in getters and setters that surface those properties as GraphQL fields.
 * @return {Function} a class decorator method
 */
function Properties() {
  for (var _len3 = arguments.length, propertyNames = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    propertyNames[_key3] = arguments[_key3];
  }

  return function (target) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = (0, _getIterator3.default)(propertyNames), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var property = _step3.value;

        var _extractBits3 = extractBits(property),
            typePropertyName = _extractBits3.typePropertyName,
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
/* 162 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperties = __webpack_require__(36);

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
 * @param {String} schemaString a GraphQL IDL compliant string for defining a 
 * GraphQL Object Schema.
 */
function Schema(schemaString) {
  return function (target) {
    (0, _defineProperties2.default)(target, {
      SCHEMA: {
        get: function get() {
          return schemaString;
        }
      }
    });
  };
}

exports.default = Schema;

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileSchema = undefined;

var _defineProperty2 = __webpack_require__(86);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _for = __webpack_require__(22);

var _for2 = _interopRequireDefault(_for);

var _defineProperties = __webpack_require__(36);

var _defineProperties2 = _interopRequireDefault(_defineProperties);

exports.default = FileSchema;

var _GQLBase = __webpack_require__(13);

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
function FileSchema(path) {
  var extension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".graphql";

  return function (target) {
    // Attempt to remove the SCHEMA property or function from the class 
    // being decorated. This is not guaranteed to work but should increase 
    // compatibilty and success rates.
    delete target.SCHEMA;

    return (0, _defineProperties2.default)(target, (0, _defineProperty3.default)({
      SCHEMA: {
        get: function get() {
          return _GQLBase.GQLBase.IDLFilePath(path, extension);
        }
      }

    }, (0, _for2.default)('@fileSchema'), {
      get: function get() {
        return true;
      }
    }));
  };
} /** @namespace decorators */


exports.FileSchema = FileSchema;

/***/ })
/******/ ])));