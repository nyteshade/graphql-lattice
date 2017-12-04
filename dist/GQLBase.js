'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLBase = exports.PROPS = exports.SETTERS = exports.GETTERS = exports.AUTO_PROPS = exports.META_KEY = exports.REQ_DATA_KEY = exports.MODEL_KEY = undefined;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _toStringTag = require('babel-runtime/core-js/symbol/to-string-tag');

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

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
var hasProxy = typeof global.Proxy !== 'undefined';

/* Internal Symbol referring to real accessor to GQLBase model object */
/** @namespace GQLBaseEnv */


var _MODEL_KEY = (0, _for2.default)('data-model-contents-value');

/* Internal Symbol referring to the static object containing a proxy handler */
var _PROXY_HANDLER = (0, _for2.default)('internal-base-proxy-handler');

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
 * A nameless Symbol for use as a key to the internal decorator storage
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberof GQLBaseEnv
 */
var META_KEY = exports.META_KEY = (0, _symbol2.default)();

/**
 * A Symbol used to identify calls to @Properties for properties generated
 * automatically upon instance creation.
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberOf GQLBaseEnv
 */
var AUTO_PROPS = exports.AUTO_PROPS = (0, _for2.default)('auto-props');

/**
 * A Symbol used to identify calls to @Getters for properties generated
 * via decorator. These are stored in <class>[META_KEY][GETTERS]
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberOf GQLBaseEnv
 */
var GETTERS = exports.GETTERS = (0, _for2.default)('getters');

/**
 * A Symbol used to identify calls to @Setters for properties generated
 * via decorator. These are stored in <class>[META_KEY][SETTERS]
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberOf GQLBaseEnv
 */
var SETTERS = exports.SETTERS = (0, _for2.default)('setters');

/**
 * A Symbol used to identify calls to @Properties for properties generated
 * via decorator. These are stored in <class>[META_KEY][PROPS]
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberOf GQLBaseEnv
 */
var PROPS = exports.PROPS = (0, _for2.default)('props');

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

    var _ret;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { autoProps: true };
    (0, _classCallCheck3.default)(this, GQLBase);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GQLBase.__proto__ || (0, _getPrototypeOf2.default)(GQLBase)).call(this));

    var Class = _this.constructor;

    GQLBase.setupModel(_this);
    _this.setModel(modelData);
    _this.requestData = requestData || {};
    _this.fileHandler = new _IDLFileHandler.IDLFileHandler(_this.constructor);

    if (options && !!options.autoProps !== false) {
      _this.applyAutoProps();
    }

    // @ComputedType
    return _ret = hasProxy ? new Proxy(_this, GQLBase[_PROXY_HANDLER]) : _this, (0, _possibleConstructorReturn3.default)(_this, _ret);
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


  (0, _createClass3.default)(GQLBase, [{
    key: 'applyAutoProps',
    value: function applyAutoProps() {
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

      var Class = this.constructor;
      var tree = _SyntaxTree.SyntaxTree.from(Class.SCHEMA);
      var outline = tree ? tree.outline : {};
      var props = [];

      // $FlowFixMe
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(outline[Class.name])), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var propName = _step.value;

          // $FlowFixMe
          var desc = (0, _getOwnPropertyDescriptor2.default)(Class.prototype, propName);
          var hasCustomImpl = !!(
          // We have a descriptor for the property name
          desc && (
          // We have a getter function defined
          typeof desc.get !== 'undefined' ||
          // ...or we have a function, async or not, defined
          typeof desc.value === 'function'));

          // Only create auto-props for non custom implementations
          if (!hasCustomImpl) {
            props.push(propName);
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

      if (props.length) {
        _utils.LatticeLogs.info(`Creating auto-props for [${Class.name}]: `, props);
        try {
          _ModelProperties.Properties.apply(undefined, props)(Class, [AUTO_PROPS]);
        } catch (error) {
          var parsed = /Cannot redefine property: (\w+)/.exec(error.message);
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

  }, {
    key: 'getModel',
    value: function getModel() {
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

  }, {
    key: 'setModel',
    value: function setModel(value) {
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

  }, {
    key: 'extendModel',
    value: function extendModel() {
      for (var _len = arguments.length, extensions = Array(_len), _key = 0; _key < _len; _key++) {
        extensions[_key] = arguments[_key];
      }

      // $FlowFixMe
      _lodash.merge.apply(undefined, [this[MODEL_KEY]].concat(extensions));
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
    key: 'getProp',


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
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(propName) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        var prop, result;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // $FlowFixMe
                prop = this[propName];
                result = void 0;

                if (prop) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', null);

              case 4:
                if (!((0, _types.typeOf)(prop) === 'AsyncFunction')) {
                  _context.next = 16;
                  break;
                }

                _context.prev = 5;
                _context.next = 8;
                return prop.apply(this, args);

              case 8:
                result = _context.sent;
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](5);
                throw _context.t0;

              case 14:
                _context.next = 31;
                break;

              case 16:
                if (!((0, _types.typeOf)(prop) === Function.name)) {
                  _context.next = 30;
                  break;
                }

                result = prop.apply(this, args);

                if (!((0, _types.typeOf)(result) === _promise2.default.name)) {
                  _context.next = 28;
                  break;
                }

                _context.prev = 19;
                _context.next = 22;
                return result;

              case 22:
                result = _context.sent;
                _context.next = 28;
                break;

              case 25:
                _context.prev = 25;
                _context.t1 = _context['catch'](19);
                throw _context.t1;

              case 28:
                _context.next = 31;
                break;

              case 30:
                result = prop;

              case 31:
                return _context.abrupt('return', result);

              case 32:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 11], [19, 25]]);
      }));

      function getProp(_x4) {
        return _ref.apply(this, arguments);
      }

      return getProp;
    }()

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

  }, {
    key: 'getResolver',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(resolverName, requestData) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', this.constructor.getResolver(resolverName, requestData || this.requestData));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getResolver(_x5, _x6) {
        return _ref2.apply(this, arguments);
      }

      return getResolver;
    }()

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

  }, {
    key: 'requestData',
    get: function get() {
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
    ,
    set: function set(value) {
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

  }, {
    key: _toStringTag2.default,
    get: function get() {
      return this.constructor.name;
    }
  }], [{
    key: 'getResolver',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolverName, requestData) {
        var reqData, rootObj;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                reqData = requestData || null;
                _context3.next = 3;
                return this.getMergedRoot(reqData);

              case 3:
                rootObj = _context3.sent;
                return _context3.abrupt('return', rootObj[resolverName] || null);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getResolver(_x7, _x8) {
        return _ref3.apply(this, arguments);
      }

      return getResolver;
    }()

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

  }, {
    key: 'apiDocs',
    value: function apiDocs() {
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
     *
     * @param {Object} requestData typically an object containing three
     * properties; {req, res, gql}
     * @return {Promise} a promise that resolves to an object; see above for more
     * information.
     */
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(requestData) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', {});

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function MUTATORS(_x9) {
        return _ref4.apply(this, arguments);
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
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(requestData) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt('return', {});

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function RESOLVERS(_x10) {
        return _ref5.apply(this, arguments);
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
     * @param {string} [extension='.graphql'] an extension, including the
     * prefixed period, that will be added to the supplied path should it not
     * already exist.
     * @return Symbol
     *
     * @see {@link GQLBase#SCHEMA}
     */
    value: function IDLFilePath(path) {
      var extension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.graphql';

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
      var changeHandler = {
        /**
         * Proxy set() handler. This is where the change events are fired from
         *
         * @method GQLBase~set
         * @param {Object} target the `GQLBase` model object
         * @param {string} key the property name
         * @param {mixed} value the new property value
         */
        set(target, key, value) {
          var old = target[key];

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
          var deleted = target[key];

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
          var model = this[_MODEL_KEY];
          var hasListeners = this.listenerCount(GQLBase.EVENT_MODEL_PROP_CHANGE) + this.listenerCount(GQLBase.EVENT_MODEL_PROP_DELETE);

          if (hasProxy && hasListeners) {
            model = new Proxy(model, changeHandler);
          }

          return model;
        },

        set: function set(model) {
          var instance = this;

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

  }, {
    key: 'getMergedRoot',


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
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(requestData) {
        var separateByType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var root, Class, _, convert, reduce;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                root = {};
                Class = this;
                _ = {
                  // $FlowFixMe
                  resolvers: Class[META_KEY].resolvers || [],
                  // $FlowFixMe
                  mutators: Class[META_KEY].mutators || [],
                  // $FlowFixMe
                  subscriptors: Class[META_KEY].subscriptors || []
                };

                convert = function convert(f) {
                  return { [f.name]: f.bind(Class, requestData) };
                };

                reduce = function reduce(p, c) {
                  return (0, _lodash.merge)(p, c);
                };

                _.resolvers = _.resolvers.map(convert).reduce(reduce, {});
                _.mutators = _.mutators.map(convert).reduce(reduce, {});
                _.subscriptors = _.subscriptors.map(convert).reduce(reduce, {});

                if (!separateByType) {
                  _context6.next = 28;
                  break;
                }

                _context6.t0 = _lodash.merge;
                _context6.t1 = root;
                _context6.next = 13;
                return Class.RESOLVERS(requestData);

              case 13:
                _context6.t2 = _context6.sent;
                _context6.t3 = {
                  Query: _context6.t2
                };
                _context6.next = 17;
                return Class.MUTATORS(requestData);

              case 17:
                _context6.t4 = _context6.sent;
                _context6.t5 = {
                  Mutation: _context6.t4
                };
                _context6.t6 = { Query: _.resolvers };
                _context6.t7 = { Mutation: _.mutators };
                _context6.t8 = { Subscription: _.subscriptors };
                (0, _context6.t0)(_context6.t1, _context6.t3, _context6.t5, _context6.t6, _context6.t7, _context6.t8);


                // When using lattice with apollo server, it is quite particular about
                // empty Query, Mutation or Subscription resolver maps.
                if (!(0, _keys2.default)(root.Query).length) delete root.Query;
                if (!(0, _keys2.default)(root.Mutation).length) delete root.Mutation;
                if (!(0, _keys2.default)(root.Subscription).length) delete root.Subscription;
                _context6.next = 40;
                break;

              case 28:
                _context6.t9 = _lodash.merge;
                _context6.t10 = root;
                _context6.next = 32;
                return Class.RESOLVERS(requestData);

              case 32:
                _context6.t11 = _context6.sent;
                _context6.next = 35;
                return Class.MUTATORS(requestData);

              case 35:
                _context6.t12 = _context6.sent;
                _context6.t13 = _.resolvers;
                _context6.t14 = _.mutators;
                _context6.t15 = _.subscriptors;
                (0, _context6.t9)(_context6.t10, _context6.t11, _context6.t12, _context6.t13, _context6.t14, _context6.t15);

              case 40:
                return _context6.abrupt('return', root);

              case 41:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getMergedRoot(_x13) {
        return _ref6.apply(this, arguments);
      }

      return getMergedRoot;
    }()

    /**
     * An object used to store data used by decorators and other internal
     * proccesses.
     * @ComputedType
     */

  }, {
    key: 'SCHEMA',
    get: function get() {
      return '';
    }
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
      var key = (0, _for2.default)(`${_IDLFileHandler.IDLFileHandler.name}.${this.name}`);

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

  }, {
    key: 'module',
    get: function get() {
      return module;
    }
  }, {
    key: _PROXY_HANDLER,
    get: function get() {
      return {
        get(target, key, lastResult) {
          var model = target[_MODEL_KEY];

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

  }, {
    key: _toStringTag2.default,
    get: function get() {
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

  }, {
    key: 'EVENT_MODEL_WILL_BE_SET',
    get: function get() {
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

  }, {
    key: 'EVENT_MODEL_HAS_BEEN_SET',
    get: function get() {
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

  }, {
    key: 'EVENT_MODEL_PROP_CHANGE',
    get: function get() {
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

  }, {
    key: 'EVENT_MODEL_PROP_DELETE',
    get: function get() {
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

  }, {
    key: 'DOC_CLASS',
    get: function get() {
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

  }, {
    key: 'DOC_FIELDS',
    get: function get() {
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

  }, {
    key: 'DOC_QUERY',
    get: function get() {
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

  }, {
    key: 'DOC_QUERIES',
    get: function get() {
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

  }, {
    key: 'DOC_MUTATION',
    get: function get() {
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

  }, {
    key: 'DOC_MUTATORS',
    get: function get() {
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

  }, {
    key: 'DOC_SUBSCRIPTION',
    get: function get() {
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

  }, {
    key: 'DOC_SUBSCRIPTIONS',
    get: function get() {
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

  }, {
    key: 'joinLines',
    get: function get() {
      return _utils.joinLines;
    }
  }, {
    key: META_KEY,
    get: function get() {
      var storage = this[(0, _for2.default)(this.name)];

      if (!storage) {
        storage = this[(0, _for2.default)(this.name)] = {};
      }

      return storage;
    }
  }]);
  return GQLBase;
}(_events2.default);

exports.default = GQLBase;
//# sourceMappingURL=GQLBase.js.map