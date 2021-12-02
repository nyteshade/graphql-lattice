"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.SETTERS = exports.REQ_DATA_KEY = exports.PROPS = exports.MODEL_KEY = exports.META_KEY = exports.GQLBase = exports.GETTERS = exports.AUTO_PROPS = void 0;
exports.notDefined = notDefined;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _utils = require("./utils");

var _neTypes = require("ne-types");

var _SyntaxTree = require("./SyntaxTree");

var _ModelProperties = require("./decorators/ModelProperties");

var _graphql = require("graphql");

var _IDLFileHandler = require("./IDLFileHandler");

var _lodash = require("lodash");

var _neTagFns = require("ne-tag-fns");

var _AsyncFunctionExecutionError = _interopRequireDefault(require("./errors/AsyncFunctionExecutionError"));

var _FunctionExecutionError = _interopRequireDefault(require("./errors/FunctionExecutionError"));

var _AwaitingPromiseError = _interopRequireDefault(require("./errors/AwaitingPromiseError"));

var _events = _interopRequireDefault(require("events"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/* Internal implementation to detect the existence of proxies. When present
 * additional functionality is enabled. Proxies are native in Node >= 6 */
var hasProxy = typeof global.Proxy !== 'undefined';
/* Internal Symbol referring to real accessor to GQLBase model object */

var _MODEL_KEY = Symbol["for"]('data-model-contents-value');
/* Internal Symbol referring to the static object containing a proxy handler */


var _PROXY_HANDLER = Symbol["for"]('internal-base-proxy-handler');
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


var MODEL_KEY = Symbol["for"]('data-model-contents-key');
/**
 * A `Symbol` used as a key to store the request data for an instance of the
 * GQLBase object in question.
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberof GQLBaseEnv
 */

exports.MODEL_KEY = MODEL_KEY;
var REQ_DATA_KEY = Symbol["for"]('request-data-object-key');
/**
 * A nameless Symbol for use as a key to the internal decorator storage
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberof GQLBaseEnv
 */

exports.REQ_DATA_KEY = REQ_DATA_KEY;
var META_KEY = Symbol();
/**
 * A Symbol used to identify calls to @Properties for properties generated
 * automatically upon instance creation.
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberOf GQLBaseEnv
 */

exports.META_KEY = META_KEY;
var AUTO_PROPS = Symbol["for"]('auto-props');
/**
 * A Symbol used to identify calls to @Getters for properties generated
 * via decorator. These are stored in <class>[META_KEY][GETTERS]
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberOf GQLBaseEnv
 */

exports.AUTO_PROPS = AUTO_PROPS;
var GETTERS = Symbol["for"]('getters');
/**
 * A Symbol used to identify calls to @Setters for properties generated
 * via decorator. These are stored in <class>[META_KEY][SETTERS]
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberOf GQLBaseEnv
 */

exports.GETTERS = GETTERS;
var SETTERS = Symbol["for"]('setters');
/**
 * A Symbol used to identify calls to @Properties for properties generated
 * via decorator. These are stored in <class>[META_KEY][PROPS]
 *
 * @type {Symbol}
 * @const
 * @inner
 * @memberOf GQLBaseEnv
 */

exports.SETTERS = SETTERS;
var PROPS = Symbol["for"]('props');
/**
 * All GraphQL Type objects used in this system are assumed to have extended
 * from this class. An instance of this class can be used to wrap an existing
 * structure if you have one.
 *
 * @class GQLBase
 */

exports.PROPS = PROPS;

var GQLBase = /*#__PURE__*/function (_EventEmitter, _Symbol$toStringTag, _Symbol$toStringTag2) {
  (0, _inherits2["default"])(GQLBase, _EventEmitter);

  var _super = _createSuper(GQLBase);

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
    var _this;

    var modelData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var requestData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      autoProps: true
    };
    (0, _classCallCheck2["default"])(this, GQLBase);
    _this = _super.call(this);
    var Class = _this.constructor;

    var tree = _SyntaxTree.SyntaxTree.from(Class.SCHEMA);

    var outline = tree && tree.outline || null;

    if (!outline) {
      throw new _FunctionExecutionError["default"](new Error((0, _neTagFns.dedent)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n          The SDL is unparsable. Please check your SCHEMA and make sure\n          it is valid GraphQL SDL/IDL. Your SCHEMA is defined as:\n\n          ", "\n        "])), _this.SCHEMA)));
    }

    if (outline && !(Class.name in outline)) {
      throw new _FunctionExecutionError["default"](new Error((0, _neTagFns.dedent)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n          The class name \"", "\" does not match any of the types,\n          enums, scalars, unions or interfaces defined in the SCHEMA for\n          this class (", ").\n\n          \x1B[1mIn most clases this is because your class name and SCHEMA\n          type do not match.\x1B[0m\n        "], ["\n          The class name \"", "\" does not match any of the types,\n          enums, scalars, unions or interfaces defined in the SCHEMA for\n          this class (", ").\n\n          \\x1b[1mIn most clases this is because your class name and SCHEMA\n          type do not match.\\x1b[0m\n        "])), Class.name, Object.keys(outline))));
    }

    GQLBase.setupModel((0, _assertThisInitialized2["default"])(_this));

    _this.setModel(modelData);

    _this.requestData = requestData || {};
    _this.fileHandler = new _IDLFileHandler.IDLFileHandler(_this.constructor);

    if (options && !!options.autoProps !== false) {
      _this.applyAutoProps();
    } // @ComputedType


    return (0, _possibleConstructorReturn2["default"])(_this, hasProxy ? new Proxy((0, _assertThisInitialized2["default"])(_this), GQLBase[_PROXY_HANDLER]) : (0, _assertThisInitialized2["default"])(_this));
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


  (0, _createClass2["default"])(GQLBase, [{
    key: "applyAutoProps",
    value: function applyAutoProps() {
      if (!this.constructor.SCHEMA || !this.constructor.SCHEMA.length) {
        _utils.LatticeLogs.warn((0, _utils.joinLines)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n        There is no SCHEMA for ", "!! This will likely\n        end in an error. Proceed with caution. Skipping `applyAutoProps`\n      "], ["\n        There is no SCHEMA for ", "!! This will likely\n        end in an error. Proceed with caution. Skipping \\`applyAutoProps\\`\n      "])), this.constructor.name));

        return;
      } // Individual property getters do not need to be auto-created for enum
      // types. Potentially do some checks for Interfaces and Unions as well


      if (this.constructor.GQL_TYPE === _graphql.GraphQLEnumType) {
        return;
      }

      var Class = this.constructor;

      var tree = _SyntaxTree.SyntaxTree.from(Class.SCHEMA);

      var outline = tree ? tree.outline : {};
      var props = []; // $FlowFixMe

      for (var _i = 0, _Object$keys = Object.keys(outline[Class.name]); _i < _Object$keys.length; _i++) {
        var propName = _Object$keys[_i];
        // $FlowFixMe
        var desc = Object.getOwnPropertyDescriptor(Class.prototype, propName);
        var hasCustomImpl = !!( // We have a descriptor for the property name
        desc && ( // We have a getter function defined
        typeof desc.get !== 'undefined' || // ...or we have a function, async or not, defined
        typeof desc.value === 'function')); // Only create auto-props for non custom implementations

        if (!hasCustomImpl) {
          props.push(propName);
        }
      }

      if (props.length) {
        _utils.LatticeLogs.info("Creating auto-props for [".concat(Class.name, "]: "), props);

        try {
          _ModelProperties.Properties.apply(void 0, props)(Class, [AUTO_PROPS]);
        } catch (error) {
          var parsed = /Cannot redefine property: (\w+)/.exec(error.message);

          if (parsed) {
            _utils.LatticeLogs.warn("Skipping auto-prop '".concat(Class.name, ".").concat(parsed[1], "'"));
          } else {
            _utils.LatticeLogs.error("Failed to apply auto-properties\nReason: ");

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
    key: "getModel",
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
    key: "setModel",
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
    key: "extendModel",
    value: function extendModel() {
      for (var _len = arguments.length, extensions = new Array(_len), _key = 0; _key < _len; _key++) {
        extensions[_key] = arguments[_key];
      }

      // $FlowFixMe
      _lodash.merge.apply(void 0, [this[MODEL_KEY]].concat(extensions));

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
    key: "requestData",
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
    key: _Symbol$toStringTag,
    get: function get() {
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
     * @param {string|Symbol} propName the name of the property in question
     * @param {boolean} bindGetters true, by default, if the `get` or
     * `initializer` descriptor values should be bound to the current instance
     * or an object of the programmers choice before returning
     * @param {mixed} bindTo the `this` object to use for binding when
     * `bindGetters` is set to true.
     * @return {mixed} the value of the `propName` as a Function or something
     * else when the requested property name exists
     *
     * @throws {Error} errors raised in awaiting results will be thrown
     */

  }, {
    key: "getProp",
    value: function getProp(propName) {
      var bindGetters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var bindTo = arguments.length > 2 ? arguments[2] : undefined;
      // $FlowFixMe
      var proto = Object.getPrototypeOf(this);
      var descriptor = Object.getOwnPropertyDescriptor(proto, propName);
      var result;

      if (!descriptor) {
        return null;
      }

      if (descriptor) {
        if (descriptor.initializer || descriptor.get) {
          var what = descriptor.initializer || descriptor.get;

          if (bindGetters) {
            result = what.bind(bindTo || this);
          } else {
            result = what;
          }
        } else if (descriptor.value) {
          result = descriptor.value;
        }
      }

      return result;
    }
    /**
     * Properties defined for GraphQL types in Lattice can be defined as
     * a getter, a function or an async function. In the case of standard
     * functions, if they return a promise they will be handled as though
     * they were async. In addition to fetching the property, or field
     * resolver, its resulting function or getter will be invoked.
     *
     * Given the variety of things a GraphQL type can actually be, obtaining
     * its value can annoying. This method tends to lessen that boilerplate.
     * Errors raised will be thrown.
     *
     * @instance
     * @memberof GQLBase
     * @method ⌾⠀callProp
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

  }, {
    key: "callProp",
    value: function () {
      var _callProp = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(propName) {
        var _len2,
            args,
            _key2,
            prop,
            result,
            _args = arguments;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                for (_len2 = _args.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = _args[_key2];
                }

                // $FlowFixMe
                prop = this.getProp.apply(this, [propName].concat(args));

                if (!(prop && (0, _neTypes.typeOf)(prop) === 'AsyncFunction')) {
                  _context.next = 14;
                  break;
                }

                _context.prev = 3;
                _context.next = 6;
                return prop.apply(this, args);

              case 6:
                result = _context.sent;
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](3);
                throw new _AsyncFunctionExecutionError["default"](_context.t0, prop, args, result);

              case 12:
                _context.next = 32;
                break;

              case 14:
                if (!(prop && (0, _neTypes.typeOf)(prop) === Function.name)) {
                  _context.next = 32;
                  break;
                }

                _context.prev = 15;
                result = prop.apply(this, args);
                _context.next = 22;
                break;

              case 19:
                _context.prev = 19;
                _context.t1 = _context["catch"](15);
                throw new _FunctionExecutionError["default"](_context.t1, prop, args, result);

              case 22:
                if (!((0, _neTypes.typeOf)(result) === Promise.name)) {
                  _context.next = 32;
                  break;
                }

                _context.prev = 23;
                _context.next = 26;
                return result;

              case 26:
                result = _context.sent;
                _context.next = 32;
                break;

              case 29:
                _context.prev = 29;
                _context.t2 = _context["catch"](23);
                throw new _AwaitingPromiseError["default"](_context.t2).setPromise(result);

              case 32:
                return _context.abrupt("return", result);

              case 33:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 9], [15, 19], [23, 29]]);
      }));

      function callProp(_x) {
        return _callProp.apply(this, arguments);
      }

      return callProp;
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
    key: "getResolver",
    value: function () {
      var _getResolver = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(resolverName, requestData) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.constructor.getResolver(resolverName, requestData || this.requestData);

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getResolver(_x2, _x3) {
        return _getResolver.apply(this, arguments);
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

  }], [{
    key: "getResolver",
    value: function () {
      var _getResolver2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(resolverName, requestData) {
        var reqData, rootObj;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                reqData = requestData || null;
                _context3.next = 3;
                return this.getMergedRoot(reqData);

              case 3:
                rootObj = _context3.sent;
                return _context3.abrupt("return", rootObj[resolverName] || null);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getResolver(_x4, _x5) {
        return _getResolver2.apply(this, arguments);
      }

      return getResolver;
    }()
    /**
     * The static version of getProp reads into the prototype to find the field
     * that is desired. If the field is either a getter or a initializer (see
     * class properties descriptors), then the option to bind that to either the
     * prototype object or one of your choosing is available.
     *
     * @memberof GQLBase
     * @method ⌾⠀getProp
     * @static
     *
     * @param {string|Symbol} propName a string or Symbol denoting the name of
     * the property or field you desire
     * @param {boolean} bindGetters true if a resulting `getter` or `initializer`
     * should be bound to the prototype or other object
     * @param {mixed} bindTo the object to which to bind the `getter` or
     * `initializer` functions to if other than the class prototype.
     * @return {mixed} a `Function` or other mixed value making up the property
     * name requested
     */

  }, {
    key: "getProp",
    value: function getProp(propName) {
      var bindGetters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var bindTo = arguments.length > 2 ? arguments[2] : undefined;
      var descriptor = Object.getOwnPropertyDescriptor(this.prototype, propName);

      if (descriptor) {
        if (descriptor.get || descriptor.initializer) {
          var what = descriptor.initializer || descriptor.get;

          if (bindGetters) {
            bindTo = bindTo || this.prototype;
            return what.bind(bindTo);
          } else {
            return what;
          }
        } else {
          return descriptor.value;
        }
      } else {
        return null;
      }
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

  }, {
    key: "apiDocs",
    value: function apiDocs() {
      var _ref;

      return _ref = {}, (0, _defineProperty2["default"])(_ref, this.DOC_CLASS, (0, _utils.joinLines)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n        GQLBase class implementation. GQLBase is the root class used in\n        graphql-lattice to describe a GraphQLObjectType. If you are reading\n        this, the person using lattice failed to provide documentation for\n        their type. :)\n      "])))), (0, _defineProperty2["default"])(_ref, this.DOC_QUERY, (0, _utils.joinLines)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n        ## Welcome to GraphQL Lattice\n        **Query**\n\n        You will want to define a `DOC_QUERY` apiDoc comment with something\n        more meaningful to your particular Schema here.\n      "], ["\n        ## Welcome to GraphQL Lattice\n        **Query**\n\n        You will want to define a \\`DOC_QUERY\\` apiDoc comment with something\n        more meaningful to your particular Schema here.\n      "])))), (0, _defineProperty2["default"])(_ref, this.DOC_MUTATION, (0, _utils.joinLines)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n        ## Welcome to GraphQL Lattice\n        **Mutation**\n\n        You will want to define a `DOC_MUTATION` apiDoc comment with\n        something more meaningful to your particular Schema here.\n      "], ["\n        ## Welcome to GraphQL Lattice\n        **Mutation**\n\n        You will want to define a \\`DOC_MUTATION\\` apiDoc comment with\n        something more meaningful to your particular Schema here.\n      "])))), (0, _defineProperty2["default"])(_ref, this.DOC_SUBSCRIPTION, (0, _utils.joinLines)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n        ## Welcome to GraphQL Lattice\n        **Subscription**\n\n        You will want to define a `DOC_SUBSCRIPTION` apiDoc comment with\n        something more meaningful to your particular Schema here.\n      "], ["\n        ## Welcome to GraphQL Lattice\n        **Subscription**\n\n        You will want to define a \\`DOC_SUBSCRIPTION\\` apiDoc comment with\n        something more meaningful to your particular Schema here.\n      "])))), (0, _defineProperty2["default"])(_ref, this.DOC_FIELDS, {// fieldName: `fieldDescription`,
      }), (0, _defineProperty2["default"])(_ref, this.DOC_QUERIES, {// queryName: `queryDescription`,
      }), (0, _defineProperty2["default"])(_ref, this.DOC_MUTATORS, {// mutatorName: `mutatorDescription`
      }), (0, _defineProperty2["default"])(_ref, this.DOC_SUBSCRIPTIONS, {// subscriptionName: `subscriptionDescription`
      }), _ref;
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
    key: "SCHEMA",
    get: function get() {
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

  }, {
    key: "MUTATORS",
    value: function () {
      var _MUTATORS = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(requestData) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", {});

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function MUTATORS(_x6) {
        return _MUTATORS.apply(this, arguments);
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
    key: "RESOLVERS",
    value: function () {
      var _RESOLVERS = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(requestData) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", {});

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function RESOLVERS(_x7) {
        return _RESOLVERS.apply(this, arguments);
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
    key: "ADJACENT_FILE",
    get: function get() {
      return Symbol["for"]('.graphql file located adjacent to source');
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
    key: "GQL_TYPE",
    get: function get() {
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

  }, {
    key: "IDLFilePath",
    value: function IDLFilePath(path) {
      var extension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.graphql';
      return Symbol["for"]("Path ".concat(path, " Extension ").concat(extension));
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
    key: "handler",
    get: function get() {
      var key = Symbol["for"]("".concat(_IDLFileHandler.IDLFileHandler.name, ".").concat(this.name)); // @ComputedType

      if (!this[key]) {
        // @ComputedType
        this[key] = new _IDLFileHandler.IDLFileHandler(this);
      } // @ComputedType


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
    key: "module",
    get: function get() {
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

  }, {
    key: "setupModel",
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
         * @method GQLBase~deleteProperty
         * @param {Object} target the `GQLBase` model object
         * @param {string} key the property name
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
       */

      Object.defineProperty(instance, MODEL_KEY, {
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
          this.emit(GQLBase.EVENT_MODEL_WILL_BE_SET, {
            model: model,
            instance: instance
          });
          instance[_MODEL_KEY] = model;
          this.emit(GQLBase.EVENT_MODEL_HAS_BEEN_SET, {
            model: model,
            instance: instance
          });
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
    key: _PROXY_HANDLER,
    get: function get() {
      return {
        get: function get(target, key, lastResult) {
          var model = target[_MODEL_KEY]; // Allow backwards compatibility for 'model' property if one is not
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
    key: _Symbol$toStringTag2,
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
    key: "EVENT_MODEL_WILL_BE_SET",
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
    key: "EVENT_MODEL_HAS_BEEN_SET",
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
    key: "EVENT_MODEL_PROP_CHANGE",
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
    key: "EVENT_MODEL_PROP_DELETE",
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
    key: "DOC_CLASS",
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
    key: "DOC_FIELDS",
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
    key: "DOC_QUERY",
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
    key: "DOC_QUERIES",
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
    key: "DOC_MUTATION",
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
     * @deprecated Use `DOC_MUTATIONS` instead
     *
     * @type {string}
     */

  }, {
    key: "DOC_MUTATORS",
    get: function get() {
      return 'mutators';
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
    key: "DOC_MUTATIONS",
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
    key: "DOC_SUBSCRIPTION",
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
    key: "DOC_SUBSCRIPTIONS",
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
    key: "joinLines",
    get: function get() {
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

  }, {
    key: "getMergedRoot",
    value: function () {
      var _getMergedRoot = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(requestData) {
        var separateByType,
            root,
            Class,
            _,
            convert,
            reduce,
            _args6 = arguments;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                separateByType = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : false;
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
                  var isFactoryClass = function isFactoryClass(c) {
                    return !!Class[META_KEY][Symbol["for"]('Factory Class')];
                  };

                  if (isFactoryClass(Class)) {
                    return (0, _defineProperty2["default"])({}, f.name, function () {
                      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                      }

                      return f.apply(Class, [Class, requestData].concat(args));
                    });
                  } else {
                    return (0, _defineProperty2["default"])({}, f.name, function () {
                      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        args[_key4] = arguments[_key4];
                      }

                      return f.apply(Class, [requestData].concat(args));
                    });
                  }
                };

                reduce = function reduce(p, c) {
                  return (0, _lodash.merge)(p, c);
                };

                _.resolvers = _.resolvers.map(convert).reduce(reduce, {});
                _.mutators = _.mutators.map(convert).reduce(reduce, {});
                _.subscriptors = _.subscriptors.map(convert).reduce(reduce, {});

                if (!separateByType) {
                  _context6.next = 29;
                  break;
                }

                _context6.t0 = _lodash.merge;
                _context6.t1 = root;
                _context6.next = 14;
                return Class.RESOLVERS(requestData);

              case 14:
                _context6.t2 = _context6.sent;
                _context6.t3 = {
                  Query: _context6.t2
                };
                _context6.next = 18;
                return Class.MUTATORS(requestData);

              case 18:
                _context6.t4 = _context6.sent;
                _context6.t5 = {
                  Mutation: _context6.t4
                };
                _context6.t6 = {
                  Query: _.resolvers
                };
                _context6.t7 = {
                  Mutation: _.mutators
                };
                _context6.t8 = {
                  Subscription: _.subscriptors
                };
                (0, _context6.t0)(_context6.t1, _context6.t3, _context6.t5, _context6.t6, _context6.t7, _context6.t8);
                // When using lattice with apollo server, it is quite particular about
                // empty Query, Mutation or Subscription resolver maps.
                if (!Object.keys(root.Query).length) delete root.Query;
                if (!Object.keys(root.Mutation).length) delete root.Mutation;
                if (!Object.keys(root.Subscription).length) delete root.Subscription;
                _context6.next = 41;
                break;

              case 29:
                _context6.t9 = _lodash.merge;
                _context6.t10 = root;
                _context6.next = 33;
                return Class.RESOLVERS(requestData);

              case 33:
                _context6.t11 = _context6.sent;
                _context6.next = 36;
                return Class.MUTATORS(requestData);

              case 36:
                _context6.t12 = _context6.sent;
                _context6.t13 = _.resolvers;
                _context6.t14 = _.mutators;
                _context6.t15 = _.subscriptors;
                (0, _context6.t9)(_context6.t10, _context6.t11, _context6.t12, _context6.t13, _context6.t14, _context6.t15);

              case 41:
                return _context6.abrupt("return", root);

              case 42:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getMergedRoot(_x8) {
        return _getMergedRoot.apply(this, arguments);
      }

      return getMergedRoot;
    }()
    /**
     * An object used to store data used by decorators and other internal
     * proccesses.
     * @ComputedType
     */

  }, {
    key: META_KEY,
    get: function get() {
      var storage = this[Symbol["for"](this.name)];

      if (!storage) {
        storage = this[Symbol["for"](this.name)] = {};
      }

      return storage;
    }
  }]);
  return GQLBase;
}(_events["default"], Symbol.toStringTag, Symbol.toStringTag);

exports.GQLBase = GQLBase;
var _default = GQLBase;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxCYXNlLmpzIl0sIm5hbWVzIjpbImhhc1Byb3h5IiwiZ2xvYmFsIiwiUHJveHkiLCJfTU9ERUxfS0VZIiwiU3ltYm9sIiwiX1BST1hZX0hBTkRMRVIiLCJub3REZWZpbmVkIiwia2V5VG9UZXN0Iiwia2V5U3VwcGxpZWQiLCJpbnN0YW5jZSIsIlJlZ0V4cCIsInRlc3QiLCJ0b1N0cmluZyIsImhhc093blByb3BlcnR5IiwiTU9ERUxfS0VZIiwiUkVRX0RBVEFfS0VZIiwiTUVUQV9LRVkiLCJBVVRPX1BST1BTIiwiR0VUVEVSUyIsIlNFVFRFUlMiLCJQUk9QUyIsIkdRTEJhc2UiLCJtb2RlbERhdGEiLCJyZXF1ZXN0RGF0YSIsIm9wdGlvbnMiLCJhdXRvUHJvcHMiLCJDbGFzcyIsImNvbnN0cnVjdG9yIiwidHJlZSIsIlN5bnRheFRyZWUiLCJmcm9tIiwiU0NIRU1BIiwib3V0bGluZSIsIkZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IiLCJFcnJvciIsImRlZGVudCIsIm5hbWUiLCJPYmplY3QiLCJrZXlzIiwic2V0dXBNb2RlbCIsInNldE1vZGVsIiwiZmlsZUhhbmRsZXIiLCJJRExGaWxlSGFuZGxlciIsImFwcGx5QXV0b1Byb3BzIiwibGVuZ3RoIiwibGwiLCJ3YXJuIiwiam9pbkxpbmVzIiwiR1FMX1RZUEUiLCJHcmFwaFFMRW51bVR5cGUiLCJwcm9wcyIsInByb3BOYW1lIiwiZGVzYyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInByb3RvdHlwZSIsImhhc0N1c3RvbUltcGwiLCJnZXQiLCJ2YWx1ZSIsInB1c2giLCJpbmZvIiwiUHJvcGVydGllcyIsImVycm9yIiwicGFyc2VkIiwiZXhlYyIsIm1lc3NhZ2UiLCJleHRlbnNpb25zIiwibWVyZ2UiLCJiaW5kR2V0dGVycyIsImJpbmRUbyIsInByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJkZXNjcmlwdG9yIiwicmVzdWx0IiwiaW5pdGlhbGl6ZXIiLCJ3aGF0IiwiYmluZCIsImFyZ3MiLCJwcm9wIiwiZ2V0UHJvcCIsImFwcGx5IiwiQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIiwiRnVuY3Rpb24iLCJQcm9taXNlIiwiQXdhaXRpbmdQcm9taXNlRXJyb3IiLCJzZXRQcm9taXNlIiwicmVzb2x2ZXJOYW1lIiwiZ2V0UmVzb2x2ZXIiLCJyZXFEYXRhIiwiZ2V0TWVyZ2VkUm9vdCIsInJvb3RPYmoiLCJET0NfQ0xBU1MiLCJET0NfUVVFUlkiLCJET0NfTVVUQVRJT04iLCJET0NfU1VCU0NSSVBUSU9OIiwiRE9DX0ZJRUxEUyIsIkRPQ19RVUVSSUVTIiwiRE9DX01VVEFUT1JTIiwiRE9DX1NVQlNDUklQVElPTlMiLCJHcmFwaFFMT2JqZWN0VHlwZSIsInBhdGgiLCJleHRlbnNpb24iLCJrZXkiLCJtb2R1bGUiLCJjaGFuZ2VIYW5kbGVyIiwic2V0IiwidGFyZ2V0Iiwib2xkIiwiZW1pdCIsIkVWRU5UX01PREVMX1BST1BfQ0hBTkdFIiwibW9kZWwiLCJkZWxldGVQcm9wZXJ0eSIsImRlbGV0ZWQiLCJFVkVOVF9NT0RFTF9QUk9QX0RFTEVURSIsImRlZmluZVByb3BlcnR5IiwiaGFzTGlzdGVuZXJzIiwibGlzdGVuZXJDb3VudCIsIkVWRU5UX01PREVMX1dJTExfQkVfU0VUIiwiRVZFTlRfTU9ERUxfSEFTX0JFRU5fU0VUIiwibGFzdFJlc3VsdCIsInNlcGFyYXRlQnlUeXBlIiwicm9vdCIsIl8iLCJyZXNvbHZlcnMiLCJtdXRhdG9ycyIsInN1YnNjcmlwdG9ycyIsImNvbnZlcnQiLCJmIiwiaXNGYWN0b3J5Q2xhc3MiLCJjIiwicmVkdWNlIiwicCIsIm1hcCIsIlJFU09MVkVSUyIsIlF1ZXJ5IiwiTVVUQVRPUlMiLCJNdXRhdGlvbiIsIlN1YnNjcmlwdGlvbiIsInN0b3JhZ2UiLCJFdmVudEVtaXR0ZXIiLCJ0b1N0cmluZ1RhZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FB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WkEsUUFBQUEsT0FBTyxHQUFJLEtBQUtySSxNQUFNLE9BQU4sQ0FBVyxLQUFLZ0MsSUFBaEIsQ0FBTCxJQUE4QixFQUF6QztBQUNEOztBQUVELGFBQU9xRyxPQUFQO0FBQ0Q7OztFQTlxQzBCQyxrQixFQWtQdEJ0SSxNQUFNLENBQUN1SSxXLEVBZ3FCQXZJLE1BQU0sQ0FBQ3VJLFc7OztlQStSTnRILE8iLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQG5hbWVzcGFjZSBHUUxCYXNlRW52ICovXG4vLyBAZmxvd1xuXG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5pbXBvcnQgeyBEZWZlcnJlZCwgam9pbkxpbmVzIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7IHR5cGVPZiB9IGZyb20gJ25lLXR5cGVzJ1xuaW1wb3J0IHsgU3ludGF4VHJlZSB9IGZyb20gJy4vU3ludGF4VHJlZSdcbmltcG9ydCB7IFByb3BlcnRpZXMgfSBmcm9tICcuL2RlY29yYXRvcnMvTW9kZWxQcm9wZXJ0aWVzJ1xuaW1wb3J0IHsgR3JhcGhRTE9iamVjdFR5cGUsIEdyYXBoUUxFbnVtVHlwZSB9IGZyb20gJ2dyYXBocWwnXG5pbXBvcnQgeyBJRExGaWxlSGFuZGxlciB9IGZyb20gJy4vSURMRmlsZUhhbmRsZXInXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaCdcbmltcG9ydCB7IExhdHRpY2VMb2dzIGFzIGxsIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7IGRlZGVudCB9IGZyb20gJ25lLXRhZy1mbnMnXG5cbmltcG9ydCBBc3luY0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3IgZnJvbSAnLi9lcnJvcnMvQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yJ1xuaW1wb3J0IEZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IgZnJvbSAnLi9lcnJvcnMvRnVuY3Rpb25FeGVjdXRpb25FcnJvcidcbmltcG9ydCBBd2FpdGluZ1Byb21pc2VFcnJvciBmcm9tICcuL2Vycm9ycy9Bd2FpdGluZ1Byb21pc2VFcnJvcidcblxuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5cbi8qIEludGVybmFsIGltcGxlbWVudGF0aW9uIHRvIGRldGVjdCB0aGUgZXhpc3RlbmNlIG9mIHByb3hpZXMuIFdoZW4gcHJlc2VudFxuICogYWRkaXRpb25hbCBmdW5jdGlvbmFsaXR5IGlzIGVuYWJsZWQuIFByb3hpZXMgYXJlIG5hdGl2ZSBpbiBOb2RlID49IDYgKi9cbmNvbnN0IGhhc1Byb3h5ID0gdHlwZW9mIGdsb2JhbC5Qcm94eSAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8qIEludGVybmFsIFN5bWJvbCByZWZlcnJpbmcgdG8gcmVhbCBhY2Nlc3NvciB0byBHUUxCYXNlIG1vZGVsIG9iamVjdCAqL1xuY29uc3QgX01PREVMX0tFWSA9IFN5bWJvbC5mb3IoJ2RhdGEtbW9kZWwtY29udGVudHMtdmFsdWUnKTtcblxuLyogSW50ZXJuYWwgU3ltYm9sIHJlZmVycmluZyB0byB0aGUgc3RhdGljIG9iamVjdCBjb250YWluaW5nIGEgcHJveHkgaGFuZGxlciAqL1xuY29uc3QgX1BST1hZX0hBTkRMRVIgPSBTeW1ib2wuZm9yKCdpbnRlcm5hbC1iYXNlLXByb3h5LWhhbmRsZXInKVxuXG4vKipcbiAqIFNpbXBsZSBmdW5jdGlvbiB0byBjaGVjayBpZiBhIHN1cHBsaWVkIGtleSBtYXRjaGVzIGEgc3RyaW5nIG9mIHlvdXJcbiAqIGNob29zaW5nIGFuZCB0aGF0IHN0cmluZyBpcyBub3QgYSBkZWZpbmVkIHByb3BlcnR5IG9uIHRoZSBpbnN0YW5jZVxuICogcGFzc2VkIHRvIHRoZSBjaGVjay5cbiAqXG4gKiBAbWV0aG9kIEdRTEJhc2VFbnZ+bm90RGVmaW5lZFxuICogQG1lbWJlcm9mIEdRTEJhc2VFbnZcbiAqIEBzaW5jZSAyLjUuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlUb1Rlc3QgYSBTdHJpbmcgZGVub3RpbmcgdGhlIHByb3BlcnR5IHlvdSB3aXNoIHRvIHRlc3RcbiAqIEBwYXJhbSB7bWl4ZWR9IGtleVN1cHBsaWVkIGEgdmFsdWUsIGNvZXJjZWQgYHRvU3RyaW5nKClgLCB0byBjb21wYXJlIHRvXG4gKiBga2V5VG9UZXN0YFxuICogQHBhcmFtIHttaXhlZH0gaW5zdGFuY2UgYW4gb2JqZWN0IGluc3RhbmNlIHRvIGNoZWNrIGBoYXNPd25Qcm9wZXJ0eWAgb24gZm9yXG4gKiB0aGUgYGtleVRvVGVzdGAgc3VwcGxpZWQuXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBwcm9wZXJ0eSBtYXRjaGVzIHRoZSBzdXBwbGllZCBrZXkgYW5kIHRoYXRcbiAqIHByb3BlcnR5IGlzIG5vdCBhbiBvd25lZFByb3BlcnR5IG9mIHRoZSBpbnN0YW5jZSBzdXBwbGllZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vdERlZmluZWQoXG4gIGtleVRvVGVzdDogc3RyaW5nLFxuICBrZXlTdXBwbGllZDogT2JqZWN0IHwgc3RyaW5nLFxuICBpbnN0YW5jZTogT2JqZWN0XG4pIHtcbiAgcmV0dXJuIChcbiAgICBuZXcgUmVnRXhwKFwiXlwiICsga2V5VG9UZXN0ICsgXCIkXCIpLnRlc3Qoa2V5U3VwcGxpZWQudG9TdHJpbmcoKSlcbiAgICAmJiAhaW5zdGFuY2UuaGFzT3duUHJvcGVydHkoa2V5VG9UZXN0KVxuICApO1xufVxuXG4vKipcbiAqIEEgYFN5bWJvbGAgdXNlZCBhcyBhIGtleSB0byBzdG9yZSB0aGUgYmFja2luZyBtb2RlbCBkYXRhLiBEZXNpZ25lZCBhcyBhXG4gKiB3YXkgdG8gc2VwYXJhdGUgbW9kZWwgZGF0YSBhbmQgR3JhcGhRTCBwcm9wZXJ0eSBhY2Nlc3NvcnMgaW50byBsb2dpY2FsIGJpdHMuXG4gKlxuICogQHR5cGUge1N5bWJvbH1cbiAqIEBtZW1iZXJvZiBHUUxCYXNlRW52XG4gKiBAY29uc3RcbiAqL1xuZXhwb3J0IGNvbnN0IE1PREVMX0tFWSA9IFN5bWJvbC5mb3IoJ2RhdGEtbW9kZWwtY29udGVudHMta2V5Jyk7XG5cbi8qKlxuICogQSBgU3ltYm9sYCB1c2VkIGFzIGEga2V5IHRvIHN0b3JlIHRoZSByZXF1ZXN0IGRhdGEgZm9yIGFuIGluc3RhbmNlIG9mIHRoZVxuICogR1FMQmFzZSBvYmplY3QgaW4gcXVlc3Rpb24uXG4gKlxuICogQHR5cGUge1N5bWJvbH1cbiAqIEBjb25zdFxuICogQGlubmVyXG4gKiBAbWVtYmVyb2YgR1FMQmFzZUVudlxuICovXG5leHBvcnQgY29uc3QgUkVRX0RBVEFfS0VZID0gU3ltYm9sLmZvcigncmVxdWVzdC1kYXRhLW9iamVjdC1rZXknKTtcblxuLyoqXG4gKiBBIG5hbWVsZXNzIFN5bWJvbCBmb3IgdXNlIGFzIGEga2V5IHRvIHRoZSBpbnRlcm5hbCBkZWNvcmF0b3Igc3RvcmFnZVxuICpcbiAqIEB0eXBlIHtTeW1ib2x9XG4gKiBAY29uc3RcbiAqIEBpbm5lclxuICogQG1lbWJlcm9mIEdRTEJhc2VFbnZcbiAqL1xuZXhwb3J0IGNvbnN0IE1FVEFfS0VZID0gU3ltYm9sKCk7XG5cbi8qKlxuICogQSBTeW1ib2wgdXNlZCB0byBpZGVudGlmeSBjYWxscyB0byBAUHJvcGVydGllcyBmb3IgcHJvcGVydGllcyBnZW5lcmF0ZWRcbiAqIGF1dG9tYXRpY2FsbHkgdXBvbiBpbnN0YW5jZSBjcmVhdGlvbi5cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICogQGNvbnN0XG4gKiBAaW5uZXJcbiAqIEBtZW1iZXJPZiBHUUxCYXNlRW52XG4gKi9cbmV4cG9ydCBjb25zdCBBVVRPX1BST1BTID0gU3ltYm9sLmZvcignYXV0by1wcm9wcycpXG5cbi8qKlxuICogQSBTeW1ib2wgdXNlZCB0byBpZGVudGlmeSBjYWxscyB0byBAR2V0dGVycyBmb3IgcHJvcGVydGllcyBnZW5lcmF0ZWRcbiAqIHZpYSBkZWNvcmF0b3IuIFRoZXNlIGFyZSBzdG9yZWQgaW4gPGNsYXNzPltNRVRBX0tFWV1bR0VUVEVSU11cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICogQGNvbnN0XG4gKiBAaW5uZXJcbiAqIEBtZW1iZXJPZiBHUUxCYXNlRW52XG4gKi9cbmV4cG9ydCBjb25zdCBHRVRURVJTID0gU3ltYm9sLmZvcignZ2V0dGVycycpXG5cbi8qKlxuICogQSBTeW1ib2wgdXNlZCB0byBpZGVudGlmeSBjYWxscyB0byBAU2V0dGVycyBmb3IgcHJvcGVydGllcyBnZW5lcmF0ZWRcbiAqIHZpYSBkZWNvcmF0b3IuIFRoZXNlIGFyZSBzdG9yZWQgaW4gPGNsYXNzPltNRVRBX0tFWV1bU0VUVEVSU11cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICogQGNvbnN0XG4gKiBAaW5uZXJcbiAqIEBtZW1iZXJPZiBHUUxCYXNlRW52XG4gKi9cbmV4cG9ydCBjb25zdCBTRVRURVJTID0gU3ltYm9sLmZvcignc2V0dGVycycpXG5cbi8qKlxuICogQSBTeW1ib2wgdXNlZCB0byBpZGVudGlmeSBjYWxscyB0byBAUHJvcGVydGllcyBmb3IgcHJvcGVydGllcyBnZW5lcmF0ZWRcbiAqIHZpYSBkZWNvcmF0b3IuIFRoZXNlIGFyZSBzdG9yZWQgaW4gPGNsYXNzPltNRVRBX0tFWV1bUFJPUFNdXG4gKlxuICogQHR5cGUge1N5bWJvbH1cbiAqIEBjb25zdFxuICogQGlubmVyXG4gKiBAbWVtYmVyT2YgR1FMQmFzZUVudlxuICovXG5leHBvcnQgY29uc3QgUFJPUFMgPSBTeW1ib2wuZm9yKCdwcm9wcycpXG5cbi8qKlxuICogQWxsIEdyYXBoUUwgVHlwZSBvYmplY3RzIHVzZWQgaW4gdGhpcyBzeXN0ZW0gYXJlIGFzc3VtZWQgdG8gaGF2ZSBleHRlbmRlZFxuICogZnJvbSB0aGlzIGNsYXNzLiBBbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGNhbiBiZSB1c2VkIHRvIHdyYXAgYW4gZXhpc3RpbmdcbiAqIHN0cnVjdHVyZSBpZiB5b3UgaGF2ZSBvbmUuXG4gKlxuICogQGNsYXNzIEdRTEJhc2VcbiAqL1xuZXhwb3J0IGNsYXNzIEdRTEJhc2UgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBmaWxlSGFuZGxlcjogP0lETEZpbGVIYW5kbGVyO1xuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IGRhdGEgaXMgcGFzc2VkIHRvIHRoaXMgb2JqZWN0IHdoZW4gY29uc3RydWN0ZWQuIFR5cGljYWxseSB0aGVzZVxuICAgKiBvYmplY3RzLCBhbmQgdGhlaXIgY2hpbGRyZW4sIGFyZSBpbnN0YW50aWF0ZWQgYnkgaXRzIG93biBzdGF0aWMgTVVUQVRPUlNcbiAgICogYW5kIFJFU09MVkVSUy4gVGhleSBzaG91bGQgY29udGFpbiByZXF1ZXN0IHNwZWNpZmljIHN0YXRlIGlmIGFueSBpcyB0b1xuICAgKiBiZSBzaGFyZWQuXG4gICAqXG4gICAqIFRoZXNlIGNhbiBiZSBjb25zaWRlcmVkIHJlcXVlc3Qgc3BlY2lmaWMgY29udHJvbGxlcnMgZm9yIHRoZSBvYmplY3QgaW5cbiAgICogcXVlc3Rpb24uIFRoZSBiYXNlIGNsYXNzIHRha2VzIGEgc2luZ2xlIG9iamVjdCB3aGljaCBzaG91bGQgY29udGFpbiBhbGxcbiAgICogdGhlIEhUVFAvUyByZXF1ZXN0IGRhdGEgYW5kIHRoZSBncmFwaFFMUGFyYW1zIGlzIHByb3ZpZGVkIGFzIHRoZSBvYmplY3RcbiAgICogeyBxdWVyeSwgdmFyaWFibGVzLCBvcGVyYXRpb25OYW1lLCByYXcgfS5cbiAgICpcbiAgICogV2hlbiB1c2VkIHdpdGggZXhwcmVzcy1ncmFwaHFsLCB0aGUgcmVxdWVzdERhdGEgb2JqZWN0IGhhcyB0aGUgZm9ybWF0XG4gICAqIHsgcmVxLCByZXMsIGdxbCB9IHdoZXJlXG4gICAqICAg4oCiIHJlcSBpcyBhbiBFeHByZXNzIDQueCByZXF1ZXN0IG9iamVjdFxuICAgKiAgIOKAoiByZXMgaXMgYW4gRXhwcmVzcyA0LnggcmVzcG9uc2Ugb2JqZWN0XG4gICAqICAg4oCiIGdxbCBpcyB0aGUgZ3JhcGhRTFBhcmFtcyBvYmplY3QgaW4gdGhlIGZvcm1hdCBvZlxuICAgKiAgICAgeyBxdWVyeSwgdmFyaWFibGVzLCBvcGVyYXRpb25OYW1lLCByYXcgfVxuICAgKiAgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ncmFwaHFsL2V4cHJlc3MtZ3JhcGhxbCBmb3IgbW9yZSBpbmZvXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4o6G4qCAY29uc3RydWN0b3JcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7bWl4ZWR9IG1vZGVsRGF0YSB0aGlzLCB0eXBpY2FsbHkgYW4gb2JqZWN0LCBhbHRob3VnaCBhbnl0aGluZ1xuICAgKiByZWFsbHkgaXMgc3VwcG9ydGVkLCByZXByZXNlbnRzIHRoZSBtb2RlbCBkYXRhIGZvciBvdXIgR3JhcGhRTCBvYmplY3RcbiAgICogaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0RGF0YSBzZWUgZGVzY3JpcHRpb24gYWJvdmVcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIG1vZGVsRGF0YTogT2JqZWN0ID0ge30sXG4gICAgcmVxdWVzdERhdGE6ID9PYmplY3QgPSBudWxsLFxuICAgIG9wdGlvbnM6IE9iamVjdCA9IHsgYXV0b1Byb3BzOiB0cnVlIH1cbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IENsYXNzID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICBjb25zdCB0cmVlID0gU3ludGF4VHJlZS5mcm9tKENsYXNzLlNDSEVNQSk7XG4gICAgY29uc3Qgb3V0bGluZSA9IHRyZWUgJiYgdHJlZS5vdXRsaW5lIHx8IG51bGw7XG5cbiAgICBpZiAoIW91dGxpbmUpIHtcbiAgICAgIHRocm93IG5ldyBGdW5jdGlvbkV4ZWN1dGlvbkVycm9yKFxuICAgICAgICBuZXcgRXJyb3IoZGVkZW50YFxuICAgICAgICAgIFRoZSBTREwgaXMgdW5wYXJzYWJsZS4gUGxlYXNlIGNoZWNrIHlvdXIgU0NIRU1BIGFuZCBtYWtlIHN1cmVcbiAgICAgICAgICBpdCBpcyB2YWxpZCBHcmFwaFFMIFNETC9JREwuIFlvdXIgU0NIRU1BIGlzIGRlZmluZWQgYXM6XG5cbiAgICAgICAgICAke3RoaXMuU0NIRU1BfVxuICAgICAgICBgKVxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChvdXRsaW5lICYmICEoQ2xhc3MubmFtZSBpbiBvdXRsaW5lKSkge1xuICAgICAgdGhyb3cgbmV3IEZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IoXG4gICAgICAgIG5ldyBFcnJvcihkZWRlbnRgXG4gICAgICAgICAgVGhlIGNsYXNzIG5hbWUgXCIke0NsYXNzLm5hbWV9XCIgZG9lcyBub3QgbWF0Y2ggYW55IG9mIHRoZSB0eXBlcyxcbiAgICAgICAgICBlbnVtcywgc2NhbGFycywgdW5pb25zIG9yIGludGVyZmFjZXMgZGVmaW5lZCBpbiB0aGUgU0NIRU1BIGZvclxuICAgICAgICAgIHRoaXMgY2xhc3MgKCR7T2JqZWN0LmtleXMob3V0bGluZSl9KS5cblxuICAgICAgICAgIFxceDFiWzFtSW4gbW9zdCBjbGFzZXMgdGhpcyBpcyBiZWNhdXNlIHlvdXIgY2xhc3MgbmFtZSBhbmQgU0NIRU1BXG4gICAgICAgICAgdHlwZSBkbyBub3QgbWF0Y2guXFx4MWJbMG1cbiAgICAgICAgYClcbiAgICAgIClcbiAgICB9XG5cbiAgICBHUUxCYXNlLnNldHVwTW9kZWwodGhpcyk7XG4gICAgdGhpcy5zZXRNb2RlbChtb2RlbERhdGEpO1xuICAgIHRoaXMucmVxdWVzdERhdGEgPSByZXF1ZXN0RGF0YSB8fCB7fTtcbiAgICB0aGlzLmZpbGVIYW5kbGVyID0gbmV3IElETEZpbGVIYW5kbGVyKHRoaXMuY29uc3RydWN0b3IpO1xuXG4gICAgaWYgKG9wdGlvbnMgJiYgISFvcHRpb25zLmF1dG9Qcm9wcyAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuYXBwbHlBdXRvUHJvcHMoKVxuICAgIH1cblxuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICByZXR1cm4gaGFzUHJveHkgPyBuZXcgUHJveHkodGhpcywgR1FMQmFzZVtfUFJPWFlfSEFORExFUl0pIDogdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTaW5jZSByZWFkaW5nIHRoZSBTY2hlbWEgZm9yIGEgZ2l2ZW4gR3JhcGhRTCBMYXR0aWNlIHR5cGUgb3JcbiAgICogaW50ZXJmYWNlIGlzIHNpbXBsZSBlbm91Z2gsIHdlIHNob3VsZCBiZSBhYmxlIHRvIGF1dG9tYXRpY2FsbHlcbiAgICogYXBwbHkgb25lIHRvIG9uZSBHcmFwaFFMOk1vZGVsIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWV0aG9kIOKMvuKggGFwcGx5QXV0b1Byb3BzXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqL1xuICBhcHBseUF1dG9Qcm9wcygpIHtcbiAgICBpZiAoIXRoaXMuY29uc3RydWN0b3IuU0NIRU1BIHx8ICF0aGlzLmNvbnN0cnVjdG9yLlNDSEVNQS5sZW5ndGgpIHtcbiAgICAgIGxsLndhcm4oam9pbkxpbmVzYFxuICAgICAgICBUaGVyZSBpcyBubyBTQ0hFTUEgZm9yICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSEhIFRoaXMgd2lsbCBsaWtlbHlcbiAgICAgICAgZW5kIGluIGFuIGVycm9yLiBQcm9jZWVkIHdpdGggY2F1dGlvbi4gU2tpcHBpbmcgXFxgYXBwbHlBdXRvUHJvcHNcXGBcbiAgICAgIGApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBJbmRpdmlkdWFsIHByb3BlcnR5IGdldHRlcnMgZG8gbm90IG5lZWQgdG8gYmUgYXV0by1jcmVhdGVkIGZvciBlbnVtXG4gICAgLy8gdHlwZXMuIFBvdGVudGlhbGx5IGRvIHNvbWUgY2hlY2tzIGZvciBJbnRlcmZhY2VzIGFuZCBVbmlvbnMgYXMgd2VsbFxuICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLkdRTF9UWVBFID09PSBHcmFwaFFMRW51bVR5cGUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBDbGFzcyA9IHRoaXMuY29uc3RydWN0b3JcbiAgICBsZXQgdHJlZSA9IFN5bnRheFRyZWUuZnJvbShDbGFzcy5TQ0hFTUEpXG4gICAgbGV0IG91dGxpbmUgPSB0cmVlID8gdHJlZS5vdXRsaW5lIDoge31cbiAgICBsZXQgcHJvcHMgPSBbXVxuXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGZvciAobGV0IHByb3BOYW1lIG9mIE9iamVjdC5rZXlzKG91dGxpbmVbQ2xhc3MubmFtZV0pKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBsZXQgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoQ2xhc3MucHJvdG90eXBlLCBwcm9wTmFtZSlcbiAgICAgIGxldCBoYXNDdXN0b21JbXBsID0gISEoXG4gICAgICAgIC8vIFdlIGhhdmUgYSBkZXNjcmlwdG9yIGZvciB0aGUgcHJvcGVydHkgbmFtZVxuICAgICAgICBkZXNjICYmIChcbiAgICAgICAgICAvLyBXZSBoYXZlIGEgZ2V0dGVyIGZ1bmN0aW9uIGRlZmluZWRcbiAgICAgICAgICB0eXBlb2YgZGVzYy5nZXQgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgfHxcbiAgICAgICAgICAvLyAuLi5vciB3ZSBoYXZlIGEgZnVuY3Rpb24sIGFzeW5jIG9yIG5vdCwgZGVmaW5lZFxuICAgICAgICAgIHR5cGVvZiBkZXNjLnZhbHVlID09PSAnZnVuY3Rpb24nXG4gICAgICAgIClcbiAgICAgIClcblxuICAgICAgLy8gT25seSBjcmVhdGUgYXV0by1wcm9wcyBmb3Igbm9uIGN1c3RvbSBpbXBsZW1lbnRhdGlvbnNcbiAgICAgIGlmICghaGFzQ3VzdG9tSW1wbCkge1xuICAgICAgICBwcm9wcy5wdXNoKHByb3BOYW1lKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5sZW5ndGgpIHtcbiAgICAgIGxsLmluZm8oYENyZWF0aW5nIGF1dG8tcHJvcHMgZm9yIFske0NsYXNzLm5hbWV9XTogYCwgcHJvcHMpXG4gICAgICB0cnkge1xuICAgICAgICBQcm9wZXJ0aWVzKC4uLnByb3BzKShDbGFzcywgW0FVVE9fUFJPUFNdKVxuICAgICAgfVxuICAgICAgY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbGV0IHBhcnNlZCA9IC9DYW5ub3QgcmVkZWZpbmUgcHJvcGVydHk6IChcXHcrKS8uZXhlYyhlcnJvci5tZXNzYWdlKVxuICAgICAgICBpZiAocGFyc2VkKSB7XG4gICAgICAgICAgbGwud2FybihgU2tpcHBpbmcgYXV0by1wcm9wICcke0NsYXNzLm5hbWV9LiR7cGFyc2VkWzFdfSdgKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGxsLmVycm9yKGBGYWlsZWQgdG8gYXBwbHkgYXV0by1wcm9wZXJ0aWVzXFxuUmVhc29uOiBgKVxuICAgICAgICAgIGxsLmVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHRoZSBpbnRlcm5hbGx5IHN0b3JlZCBtb2RlbCBkYXRhLiBUaGUgY29udGVudHMgb2YgdGhpc1xuICAgKiBvYmplY3QgYXJlIGFic3RyYWN0ZWQgYXdheSBiZWhpbmQgYSBgU3ltYm9sYCBrZXkgdG8gcHJldmVudCBjb2xsaXNpb25cbiAgICogYmV0d2VlbiB0aGUgdW5kZXJseWluZyBtb2RlbCBhbmQgYW55IEdyYXBoUUwgT2JqZWN0IERlZmluaXRpb24gcHJvcGVydGllcy5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0TW9kZWxcbiAgICogQHNpbmNlIDIuNVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgYW55IG9iamVjdCB5b3Ugd2lzaCB0byB1c2UgYXMgYSBkYXRhIHN0b3JlXG4gICAqL1xuICBnZXRNb2RlbCgpIHtcbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgcmV0dXJuIHRoaXNbTU9ERUxfS0VZXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIHRoZSBpbnRlcm5hbGx5IHN0b3JlZCBtb2RlbCBkYXRhLiBUaGUgY29udGVudHMgb2YgdGhpc1xuICAgKiBvYmplY3QgYXJlIGFic3RyYWN0ZWQgYXdheSBiZWhpbmQgYSBgU3ltYm9sYCBrZXkgdG8gcHJldmVudCBjb2xsaXNpb25cbiAgICogYmV0d2VlbiB0aGUgdW5kZXJseWluZyBtb2RlbCBhbmQgYW55IEdyYXBoUUwgT2JqZWN0IERlZmluaXRpb24gcHJvcGVydGllcy5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4oy+4qCAc2V0TW9kZWxcbiAgICogQHNpbmNlIDIuNVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgYW55IG9iamVjdCB5b3Ugd2lzaCB0byB1c2UgYXMgYSBkYXRhIHN0b3JlXG4gICAqL1xuICBzZXRNb2RlbCh2YWx1ZTogT2JqZWN0KTogR1FMQmFzZSB7XG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIHRoaXNbTU9ERUxfS0VZXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZXMgYF8ubWVyZ2UoKWAgdG8gbW9kaWZ5IHRoZSBpbnRlcm5hbCBiYWNraW5nIGRhdGEgc3RvcmUgZm9yIHRoZVxuICAgKiBvYmplY3QgaW5zdGFuY2UuIFRoaXMgaXMgYSBzaG9ydGN1dCBmb3JcbiAgICogYF8ubWVyZ2UoKShpbnN0YW5jZVtNT0RFTF9LRVldLCAuLi5leHRlbnNpb25zKWBcbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4oy+4qCAZXh0ZW5kTW9kZWxcbiAgICogQHNpbmNlIDIuNVxuICAgKlxuICAgKiBAcGFyYW0ge21peGVkfSBleHRlbnNpb25zIG4tbnVtYmVyIG9mIHZhbGlkIGBfLm1lcmdlKClgIHBhcmFtZXRlcnNcbiAgICogQHJldHVybiB7R1FMQmFzZX0gdGhpcyBpcyByZXR1cm5lZFxuICAgKi9cbiAgZXh0ZW5kTW9kZWwoLi4uZXh0ZW5zaW9uczogQXJyYXk8bWl4ZWQ+KTogR1FMQmFzZSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIG1lcmdlKHRoaXNbTU9ERUxfS0VZXSwgLi4uZXh0ZW5zaW9ucyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQSBnZXR0ZXIgdGhhdCByZXRyaWV2ZXMgdGhlIGlubmVyIHJlcXVlc3QgZGF0YSBvYmplY3QuIFdoZW4gdXNlZCB3aXRoXG4gICAqIEdRTEV4cHJlc3NNaWRkbGV3YXJlLCB0aGlzIGlzIGFuIG9iamVjdCBtYXRjaGluZyB7cmVxLCByZXMsIGdxbH0uXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggHJlcXVlc3REYXRhXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gYW4gb2JqZWN0LCB1c3VhbGx5IG1hdGNoaW5nIHsgcmVxLCByZXMsIGdxbCB9XG4gICAqL1xuICBnZXQgcmVxdWVzdERhdGEoKTogT2JqZWN0IHwgbnVsbCB7XG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIHJldHVybiB0aGlzW1JFUV9EQVRBX0tFWV07XG4gIH1cblxuICAvKipcbiAgICogQSBzZXR0ZXIgdGhhdCBhc3NpZ25zIGEgdmFsdWUgdG8gdGhlIGlubmVyIHJlcXVlc3QgZGF0YSBvYmplY3QuIFdoZW5cbiAgICogdXNlZCB3aXRoIEdRTEV4cHJlc3NNaWRkbGV3YXJlLCB0aGlzIGlzIGFuIG9iamVjdCBtYXRjaGluZyB7cmVxLCByZXMsIGdxbH0uXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKshu+4juKggHJlcXVlc3REYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBhbiBvYmplY3QsIHVzdWFsbHkgbWF0Y2hpbmcgeyByZXEsIHJlcywgZ3FsIH1cbiAgICovXG4gIHNldCByZXF1ZXN0RGF0YSh2YWx1ZTogT2JqZWN0KTogdm9pZCB7XG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIHRoaXNbUkVRX0RBVEFfS0VZXSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBjb25zdHJ1Y3RvcmAgbmFtZS4gSWYgaW52b2tlZCBhcyB0aGUgY29udGV4dCwgb3IgYHRoaXNgLFxuICAgKiBvYmplY3Qgb2YgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBPYmplY3RgJ3MgYHByb3RvdHlwZWAsIHRoZSByZXN1bHRpbmdcbiAgICogdmFsdWUgd2lsbCBiZSBgW29iamVjdCBNeUNsYXNzXWAsIGdpdmVuIGFuIGluc3RhbmNlIG9mIGBNeUNsYXNzYFxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggFtTeW1ib2wudG9TdHJpbmdUYWddXG4gICAqIEBtZW1iZXJvZiBNb2R1bGVQYXJzZXJcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgY2xhc3MgdGhpcyBpcyBhbiBpbnN0YW5jZSBvZlxuICAgKiBAQ29tcHV0ZWRUeXBlXG4gICAqL1xuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7IHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgfVxuXG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIGRlZmluZWQgZm9yIEdyYXBoUUwgdHlwZXMgaW4gTGF0dGljZSBjYW4gYmUgZGVmaW5lZCBhc1xuICAgKiBhIGdldHRlciwgYSBmdW5jdGlvbiBvciBhbiBhc3luYyBmdW5jdGlvbi4gSW4gdGhlIGNhc2Ugb2Ygc3RhbmRhcmRcbiAgICogZnVuY3Rpb25zLCBpZiB0aGV5IHJldHVybiBhIHByb21pc2UgdGhleSB3aWxsIGJlIGhhbmRsZWQgYXMgdGhvdWdoXG4gICAqIHRoZXkgd2VyZSBhc3luY1xuICAgKlxuICAgKiBHaXZlbiB0aGUgdmFyaWV0eSBvZiB0aGluZ3MgYSBHcmFwaFFMIHR5cGUgY2FuIGFjdHVhbGx5IGJlLCBvYnRhaW5pbmdcbiAgICogaXRzIHZhbHVlIGNhbiBhbm5veWluZy4gVGhpcyBtZXRob2QgdGVuZHMgdG8gbGVzc2VuIHRoYXQgYm9pbGVycGxhdGUuXG4gICAqIEVycm9ycyByYWlzZWQgd2lsbCBiZSB0aHJvd24uXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKMvuKggGdldFByb3BcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8U3ltYm9sfSBwcm9wTmFtZSB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgaW4gcXVlc3Rpb25cbiAgICogQHBhcmFtIHtib29sZWFufSBiaW5kR2V0dGVycyB0cnVlLCBieSBkZWZhdWx0LCBpZiB0aGUgYGdldGAgb3JcbiAgICogYGluaXRpYWxpemVyYCBkZXNjcmlwdG9yIHZhbHVlcyBzaG91bGQgYmUgYm91bmQgdG8gdGhlIGN1cnJlbnQgaW5zdGFuY2VcbiAgICogb3IgYW4gb2JqZWN0IG9mIHRoZSBwcm9ncmFtbWVycyBjaG9pY2UgYmVmb3JlIHJldHVybmluZ1xuICAgKiBAcGFyYW0ge21peGVkfSBiaW5kVG8gdGhlIGB0aGlzYCBvYmplY3QgdG8gdXNlIGZvciBiaW5kaW5nIHdoZW5cbiAgICogYGJpbmRHZXR0ZXJzYCBpcyBzZXQgdG8gdHJ1ZS5cbiAgICogQHJldHVybiB7bWl4ZWR9IHRoZSB2YWx1ZSBvZiB0aGUgYHByb3BOYW1lYCBhcyBhIEZ1bmN0aW9uIG9yIHNvbWV0aGluZ1xuICAgKiBlbHNlIHdoZW4gdGhlIHJlcXVlc3RlZCBwcm9wZXJ0eSBuYW1lIGV4aXN0c1xuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gZXJyb3JzIHJhaXNlZCBpbiBhd2FpdGluZyByZXN1bHRzIHdpbGwgYmUgdGhyb3duXG4gICAqL1xuICBnZXRQcm9wKHByb3BOYW1lOiBzdHJpbmcsIGJpbmRHZXR0ZXJzOiBib29sZWFuID0gdHJ1ZSwgYmluZFRvOiBtaXhlZCkge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcylcbiAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIHByb3BOYW1lKVxuICAgIGxldCByZXN1bHRcblxuICAgIGlmICghZGVzY3JpcHRvcikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmluaXRpYWxpemVyIHx8IGRlc2NyaXB0b3IuZ2V0KSB7XG4gICAgICAgIGxldCB3aGF0ID0gZGVzY3JpcHRvci5pbml0aWFsaXplciB8fCBkZXNjcmlwdG9yLmdldFxuXG4gICAgICAgIGlmIChiaW5kR2V0dGVycykge1xuICAgICAgICAgIHJlc3VsdCA9IHdoYXQuYmluZChiaW5kVG8gfHwgdGhpcylcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSB3aGF0XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGRlc2NyaXB0b3IudmFsdWUpIHtcbiAgICAgICAgcmVzdWx0ID0gZGVzY3JpcHRvci52YWx1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIGRlZmluZWQgZm9yIEdyYXBoUUwgdHlwZXMgaW4gTGF0dGljZSBjYW4gYmUgZGVmaW5lZCBhc1xuICAgKiBhIGdldHRlciwgYSBmdW5jdGlvbiBvciBhbiBhc3luYyBmdW5jdGlvbi4gSW4gdGhlIGNhc2Ugb2Ygc3RhbmRhcmRcbiAgICogZnVuY3Rpb25zLCBpZiB0aGV5IHJldHVybiBhIHByb21pc2UgdGhleSB3aWxsIGJlIGhhbmRsZWQgYXMgdGhvdWdoXG4gICAqIHRoZXkgd2VyZSBhc3luYy4gSW4gYWRkaXRpb24gdG8gZmV0Y2hpbmcgdGhlIHByb3BlcnR5LCBvciBmaWVsZFxuICAgKiByZXNvbHZlciwgaXRzIHJlc3VsdGluZyBmdW5jdGlvbiBvciBnZXR0ZXIgd2lsbCBiZSBpbnZva2VkLlxuICAgKlxuICAgKiBHaXZlbiB0aGUgdmFyaWV0eSBvZiB0aGluZ3MgYSBHcmFwaFFMIHR5cGUgY2FuIGFjdHVhbGx5IGJlLCBvYnRhaW5pbmdcbiAgICogaXRzIHZhbHVlIGNhbiBhbm5veWluZy4gVGhpcyBtZXRob2QgdGVuZHMgdG8gbGVzc2VuIHRoYXQgYm9pbGVycGxhdGUuXG4gICAqIEVycm9ycyByYWlzZWQgd2lsbCBiZSB0aHJvd24uXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKMvuKggGNhbGxQcm9wXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wTmFtZSB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgaW4gcXVlc3Rpb25cbiAgICogQHBhcmFtIHtBcnJheTxtaXhlZD59IGFyZ3MgdGhlIGFyZ3VtZW50cyBhcnJheSB0aGF0IHdpbGwgYmUgcGFzc2VkXG4gICAqIHRvIGAuYXBwbHkoKWAgc2hvdWxkIHRoZSBwcm9wZXJ0eSBldmFsdWF0ZSB0byBhIGBmdW5jdGlvbmBcbiAgICogQHJldHVybiB7bWl4ZWR9IHRoZSByZXR1cm4gdmFsdWUgb2YgYW55IHJlc3VsdGluZyBmdW5jdGlvbiBvclxuICAgKiB2YWx1ZSByZXR1cm5lZCBieSBhIGdldHRlcjsgd3JhcHBlZCBpbiBhIHByb21pc2UgYXMgYWxsIGFzeW5jXG4gICAqIGZ1bmN0aW9ucyBkby5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IGVycm9ycyByYWlzZWQgaW4gYXdhaXRpbmcgcmVzdWx0cyB3aWxsIGJlIHRocm93blxuICAgKi9cbiAgYXN5bmMgY2FsbFByb3AocHJvcE5hbWU6IHN0cmluZywgLi4uYXJnczogQXJyYXk8bWl4ZWQ+KSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGxldCBwcm9wID0gdGhpcy5nZXRQcm9wKHByb3BOYW1lLCAuLi5hcmdzKTtcbiAgICBsZXQgcmVzdWx0XG5cbiAgICBpZiAocHJvcCAmJiB0eXBlT2YocHJvcCkgPT09ICdBc3luY0Z1bmN0aW9uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgcHJvcC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yKGVycm9yLCBwcm9wLCBhcmdzLCByZXN1bHQpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHByb3AgJiYgdHlwZU9mKHByb3ApID09PSBGdW5jdGlvbi5uYW1lKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBwcm9wLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IoZXJyb3IsIHByb3AsIGFyZ3MsIHJlc3VsdClcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVPZihyZXN1bHQpID09PSBQcm9taXNlLm5hbWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXN1bHQgPSBhd2FpdCByZXN1bHRcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgQXdhaXRpbmdQcm9taXNlRXJyb3IoZXJyb3IpLnNldFByb21pc2UocmVzdWx0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgLyoqXG4gICAqIEEgcGFzcy10aHJ1IG1ldGhvZCB0byB0aGUgc3RhdGljIGZ1bmN0aW9uIG9mIHRoZSBzYW1lIG5hbWUuIFRoZVxuICAgKiBkaWZmZXJlbmNlIGJlaW5nIHRoYXQgaWYgYHJlcXVlc3REYXRhYCBpcyBub3Qgc3BlY2lmaWVkLCB0aGVcbiAgICogYHJlcXVlc3REYXRhYCBvYmplY3QgZnJvbSB0aGlzIGluc3RhbmNlIHdpbGwgYmUgdXNlZCB0byBidWlsZCB0aGVcbiAgICogcmVzb2x2ZXJzIGluIHF1ZXN0aW9uLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1ldGhvZCDijL7ioIBnZXRSZXNvbHZlclxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzb2x2ZXJOYW1lIHRoZSBuYW1lIG9mIHRoZSByZXNvbHZlciBhcyBhIHN0cmluZ1xuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdERhdGEgdGhlIHJlcXVlc3REYXRhIHVzZWQgdG8gYnVpbGQgdGhlXG4gICAqIHJlc29sdmVyIG1ldGhvZHMgZnJvbSB3aGljaCB0byBjaG9vc2VcbiAgICogQHJldHVybiB7RnVuY3Rpb259IHJldHVybnMgZWl0aGVyIGEgYGZ1bmN0aW9uYCByZXByZXNlbnRpbmcgdGhlXG4gICAqIHJlc29sdmVyIHJlcXVlc3RlZCBvciBudWxsIGlmIHRoZXJlIHdhc24ndCBvbmUgdG8gYmUgZm91bmRcbiAgICovXG4gIGFzeW5jIGdldFJlc29sdmVyKHJlc29sdmVyTmFtZTogc3RyaW5nLCByZXF1ZXN0RGF0YTogT2JqZWN0KSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuY29uc3RydWN0b3IuZ2V0UmVzb2x2ZXIoXG4gICAgICByZXNvbHZlck5hbWUsXG4gICAgICByZXF1ZXN0RGF0YSB8fCB0aGlzLnJlcXVlc3REYXRhXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmVycyBhcmUgY3JlYXRlZCBpbiBhIG51bWJlciBvZiBkaWZmZXJlbnQgd2F5cy4gT09QIGRlc2lnblxuICAgKiBkaWN0YXRlcyB0aGF0IGluc3RhbmNlcyBvZiBhIGNyZWF0ZWQgY2xhc3Mgd2lsbCBoYW5kbGUgZmllbGRcbiAgICogcmVzb2x2ZXJzLCBidXQgcXVlcnksIG11dGF0aW9uIGFuZCBzdWJzY3JpcHRpb24gcmVzb2x2ZXJzIGFyZVxuICAgKiB0eXBpY2FsbHkgd2hhdCBjcmVhdGVzIHRoZXNlIGluc3RhbmNlcy5cbiAgICpcbiAgICogU2luY2UgYSByZXNvbHZlciBjYW4gYmUgY3JlYXRlZCB1c2luZyBgQG11dGF0b3IvQHN1YnNjcmlwdG9yL0ByZXNvbHZlcmBcbiAgICogb3IgdmlhIG1ldGhvZCBvbiBhIG9iamVjdCByZXR1cm5lZCBmcm9tIGBSRVNPTFZFUlMoKWAsIGBNVVRBVE9SUygpYCBvclxuICAgKiBgU1VCU0NSSVBUSU9OUygpYCwgdGhlcmUgc2hvdWxkIGJlIGFuIGVhc3kgdG8gdXNlIHdheSB0byBmZXRjaCBhXG4gICAqIHJlc29sdmVyIGJ5IG5hbWU7IGlmIGZvciBub3RoaW5nIGVsc2UsIGNvZGUgcmV1c2UuXG4gICAqXG4gICAqIFBhc3MgdGhlIG5hbWUgb2YgdGhlIHJlc29sdmVyIHRvIHRoZSBmdW5jdGlvbiBhbmQgb3B0aW9uYWxseSBwYXNzIGFcbiAgICogcmVxdWVzdERhdGEgb2JqZWN0LiBUaGUgYGdldE1lcmdlZFJvb3QoKWAgbWV0aG9kIHdpbGwgYnVpbGQgYW4gb2JqZWN0XG4gICAqIGNvbnRhaW5pbmcgYWxsIHRoZSByb290IHJlc29sdmVycyBmb3IgdGhlIHR5cGUsIGJvdW5kIHRvIHRoZSBzdXBwbGllZFxuICAgKiBgcmVxdWVzdERhdGFgIG9iamVjdC4gSXQgaXMgZnJvbSB0aGlzIG9iamVjdCB0aGF0IGByZXNvbHZlck5hbWVgIHdpbGxcbiAgICogYmUgdXNlZCB0byBmZXRjaCB0aGUgZnVuY3Rpb24gaW4gcXVlc3Rpb24uIElmIG9uZSBleGlzdHMsIGl0IHdpbGwgYmVcbiAgICogcmV0dXJuZWQsIHJlYWR5IGZvciB1c2UuIE90aGVyd2lzZSwgbnVsbCB3aWxsIGJlIHlvdXIgYW5zd2VyLlxuICAgKlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0UmVzb2x2ZXJcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc29sdmVyTmFtZSB0aGUgbmFtZSBvZiB0aGUgcmVzb2x2ZXIgYXMgYSBzdHJpbmdcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3REYXRhIHRoZSByZXF1ZXN0RGF0YSB1c2VkIHRvIGJ1aWxkIHRoZVxuICAgKiByZXNvbHZlciBtZXRob2RzIGZyb20gd2hpY2ggdG8gY2hvb3NlXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSByZXR1cm5zIGVpdGhlciBhIGBmdW5jdGlvbmAgcmVwcmVzZW50aW5nIHRoZVxuICAgKiByZXNvbHZlciByZXF1ZXN0ZWQgb3IgbnVsbCBpZiB0aGVyZSB3YXNuJ3Qgb25lIHRvIGJlIGZvdW5kXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgZ2V0UmVzb2x2ZXIocmVzb2x2ZXJOYW1lOiBzdHJpbmcsIHJlcXVlc3REYXRhOiBPYmplY3QpIHtcbiAgICBjb25zdCByZXFEYXRhID0gcmVxdWVzdERhdGEgfHwgbnVsbFxuICAgIGNvbnN0IHJvb3RPYmogPSBhd2FpdCB0aGlzLmdldE1lcmdlZFJvb3QocmVxRGF0YSlcblxuICAgIHJldHVybiByb290T2JqW3Jlc29sdmVyTmFtZV0gfHwgbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0aWMgdmVyc2lvbiBvZiBnZXRQcm9wIHJlYWRzIGludG8gdGhlIHByb3RvdHlwZSB0byBmaW5kIHRoZSBmaWVsZFxuICAgKiB0aGF0IGlzIGRlc2lyZWQuIElmIHRoZSBmaWVsZCBpcyBlaXRoZXIgYSBnZXR0ZXIgb3IgYSBpbml0aWFsaXplciAoc2VlXG4gICAqIGNsYXNzIHByb3BlcnRpZXMgZGVzY3JpcHRvcnMpLCB0aGVuIHRoZSBvcHRpb24gdG8gYmluZCB0aGF0IHRvIGVpdGhlciB0aGVcbiAgICogcHJvdG90eXBlIG9iamVjdCBvciBvbmUgb2YgeW91ciBjaG9vc2luZyBpcyBhdmFpbGFibGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0UHJvcFxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFN5bWJvbH0gcHJvcE5hbWUgYSBzdHJpbmcgb3IgU3ltYm9sIGRlbm90aW5nIHRoZSBuYW1lIG9mXG4gICAqIHRoZSBwcm9wZXJ0eSBvciBmaWVsZCB5b3UgZGVzaXJlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gYmluZEdldHRlcnMgdHJ1ZSBpZiBhIHJlc3VsdGluZyBgZ2V0dGVyYCBvciBgaW5pdGlhbGl6ZXJgXG4gICAqIHNob3VsZCBiZSBib3VuZCB0byB0aGUgcHJvdG90eXBlIG9yIG90aGVyIG9iamVjdFxuICAgKiBAcGFyYW0ge21peGVkfSBiaW5kVG8gdGhlIG9iamVjdCB0byB3aGljaCB0byBiaW5kIHRoZSBgZ2V0dGVyYCBvclxuICAgKiBgaW5pdGlhbGl6ZXJgIGZ1bmN0aW9ucyB0byBpZiBvdGhlciB0aGFuIHRoZSBjbGFzcyBwcm90b3R5cGUuXG4gICAqIEByZXR1cm4ge21peGVkfSBhIGBGdW5jdGlvbmAgb3Igb3RoZXIgbWl4ZWQgdmFsdWUgbWFraW5nIHVwIHRoZSBwcm9wZXJ0eVxuICAgKiBuYW1lIHJlcXVlc3RlZFxuICAgKi9cbiAgc3RhdGljIGdldFByb3AoXG4gICAgcHJvcE5hbWU6IHN0cmluZyxcbiAgICBiaW5kR2V0dGVyczogYm9vbGVhbiA9IGZhbHNlLFxuICAgIGJpbmRUbzogbWl4ZWRcbiAgKSB7XG4gICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMucHJvdG90eXBlLCBwcm9wTmFtZSlcblxuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5nZXQgfHwgZGVzY3JpcHRvci5pbml0aWFsaXplcikge1xuICAgICAgICBsZXQgd2hhdCA9IGRlc2NyaXB0b3IuaW5pdGlhbGl6ZXIgfHwgZGVzY3JpcHRvci5nZXRcblxuICAgICAgICBpZiAoYmluZEdldHRlcnMpIHtcbiAgICAgICAgICBiaW5kVG8gPSBiaW5kVG8gfHwgdGhpcy5wcm90b3R5cGVcblxuICAgICAgICAgIHJldHVybiB3aGF0LmJpbmQoYmluZFRvKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiB3aGF0XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVudGlsIHN1Y2ggdGltZSBhcyB0aGUgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uIG9mIEZhY2Vib29rJ3MgR3JhcGhRTFxuICAgKiBTREwgQVNUIHBhcnNlciBzdXBwb3J0cyBjb21tZW50cywgb3IgdW50aWwgd2UgdGFrZSBhZHZhbnRhZ2Ugb2YgQXBvbGxvJ3NcbiAgICogQVNUIHBhcnNlciwgdGhpcyBpcyBob3cgY29tbWVudHMgd2lsbCBiZSBhcHBsaWVkIHRvIGEgYnVpbHQgc2NoZW1hLlxuICAgKlxuICAgKiBTZXZlcmFsIGNvbnN0YW50cyBhcmUgZGVmaW5lZCBvbiB0aGUgR1FMQmFzZSBvYmplY3QgaXRzZWxmLCBhbmQgdGhlcmVieVxuICAgKiBhbGwgaXRzIHN1YmNsYXNzZXMuIFRoZXkgcGVydGFpbiB0byBob3cgdG8gZGVmaW5lIGRlc2NyaXB0aW9uIGZpZWxkc1xuICAgKiBmb3IgdmFyaW91cyBwYXJ0cyBvZiB5b3VyIEdRTCBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogYGBgXG4gICAqIC8vIFRvIGRlZmluZSBhIGRlc2NyaXB0aW9uIG9uIHRoZSB0b3AgbGV2ZWwgY2xhc3NcbiAgICogW3RoaXMuRE9DX0NMQVNTXTogc3RyaW5nXG4gICAqXG4gICAqIC8vIFRvIGRlZmluZSBhIGRlc2NyaXB0aW9uIG9uIGEgZmllbGQgKGdldHRlciwgZnVuY3Rpb24gb3IgYXN5bmMgZnVuY3Rpb24pXG4gICAqIFt0aGlzLkRPQ19GSUVMRFNdOiB7XG4gICAqICAgZmllbGROYW1lOiBzdHJpbmdcbiAgICogfVxuICAgKlxuICAgKiAvLyBUbyBkZWZpbmUgYSBkZXNjcmlwdGlvbiBvbiBhIHF1ZXJ5LCBtdXRhdGlvbiBvciBzdWJzY3JpcHRpb24gZmllbGRcbiAgICogW3RoaXMuRE9DX1FVRVJJRVMgfHwgdGhpcy5ET0NfTVVUQVRPUlMgfHwgdGhpcy5ET0NfU1VCU0NSSVBUSU9OU106IHtcbiAgICogICBmaWVsZE5hbWU6IHN0cmluZ1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBUbyBtYWtlIHdyaXRpbmcgY29kZSBlYXNpZXIsIHRoZSBgam9pbkxpbmVzKClgIHRlbXBsYXRlIGZ1bmN0aW9uIGlzXG4gICAqIGF2YWlsYWJsZSBzbyB5b3VyIHNvdXJjZSBjb2RlIGNhbiBsb29rIG5pY2UgYW5kIG5lYXQgYW5kIHlvdXIgZGVzY3JpcHRpb25zXG4gICAqIHdvbid0IGdldCBhbm5veWluZyBsaW5lIGJyZWFrcyBhbmQgc3BhY2VzIGFzIHBhcnQgb2YgdGhhdCBwcm9jZXNzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2QgYXBpRG9jc1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGFuIG9iamVjdCB3aXRoIHZhcmlvdXMga2V5cyBhbmQgdmFsdWVzIGRlbm90aW5nXG4gICAqIGRlc2NyaXB0aW9uIGZpZWxkcyB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoZSBmaW5hbCBzY2hlbWEgb2JqZWN0XG4gICAqL1xuICBzdGF0aWMgYXBpRG9jcygpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5ET0NfQ0xBU1NdOiBqb2luTGluZXNgXG4gICAgICAgIEdRTEJhc2UgY2xhc3MgaW1wbGVtZW50YXRpb24uIEdRTEJhc2UgaXMgdGhlIHJvb3QgY2xhc3MgdXNlZCBpblxuICAgICAgICBncmFwaHFsLWxhdHRpY2UgdG8gZGVzY3JpYmUgYSBHcmFwaFFMT2JqZWN0VHlwZS4gSWYgeW91IGFyZSByZWFkaW5nXG4gICAgICAgIHRoaXMsIHRoZSBwZXJzb24gdXNpbmcgbGF0dGljZSBmYWlsZWQgdG8gcHJvdmlkZSBkb2N1bWVudGF0aW9uIGZvclxuICAgICAgICB0aGVpciB0eXBlLiA6KVxuICAgICAgYCxcblxuICAgICAgW3RoaXMuRE9DX1FVRVJZXTogam9pbkxpbmVzYFxuICAgICAgICAjIyBXZWxjb21lIHRvIEdyYXBoUUwgTGF0dGljZVxuICAgICAgICAqKlF1ZXJ5KipcblxuICAgICAgICBZb3Ugd2lsbCB3YW50IHRvIGRlZmluZSBhIFxcYERPQ19RVUVSWVxcYCBhcGlEb2MgY29tbWVudCB3aXRoIHNvbWV0aGluZ1xuICAgICAgICBtb3JlIG1lYW5pbmdmdWwgdG8geW91ciBwYXJ0aWN1bGFyIFNjaGVtYSBoZXJlLlxuICAgICAgYCxcblxuICAgICAgW3RoaXMuRE9DX01VVEFUSU9OXTogam9pbkxpbmVzYFxuICAgICAgICAjIyBXZWxjb21lIHRvIEdyYXBoUUwgTGF0dGljZVxuICAgICAgICAqKk11dGF0aW9uKipcblxuICAgICAgICBZb3Ugd2lsbCB3YW50IHRvIGRlZmluZSBhIFxcYERPQ19NVVRBVElPTlxcYCBhcGlEb2MgY29tbWVudCB3aXRoXG4gICAgICAgIHNvbWV0aGluZyBtb3JlIG1lYW5pbmdmdWwgdG8geW91ciBwYXJ0aWN1bGFyIFNjaGVtYSBoZXJlLlxuICAgICAgYCxcblxuICAgICAgW3RoaXMuRE9DX1NVQlNDUklQVElPTl06IGpvaW5MaW5lc2BcbiAgICAgICAgIyMgV2VsY29tZSB0byBHcmFwaFFMIExhdHRpY2VcbiAgICAgICAgKipTdWJzY3JpcHRpb24qKlxuXG4gICAgICAgIFlvdSB3aWxsIHdhbnQgdG8gZGVmaW5lIGEgXFxgRE9DX1NVQlNDUklQVElPTlxcYCBhcGlEb2MgY29tbWVudCB3aXRoXG4gICAgICAgIHNvbWV0aGluZyBtb3JlIG1lYW5pbmdmdWwgdG8geW91ciBwYXJ0aWN1bGFyIFNjaGVtYSBoZXJlLlxuICAgICAgYCxcblxuICAgICAgW3RoaXMuRE9DX0ZJRUxEU106IHtcbiAgICAgICAgLy8gZmllbGROYW1lOiBgZmllbGREZXNjcmlwdGlvbmAsXG4gICAgICB9LFxuXG4gICAgICBbdGhpcy5ET0NfUVVFUklFU106IHtcbiAgICAgICAgLy8gcXVlcnlOYW1lOiBgcXVlcnlEZXNjcmlwdGlvbmAsXG4gICAgICB9LFxuXG4gICAgICBbdGhpcy5ET0NfTVVUQVRPUlNdOiB7XG4gICAgICAgIC8vIG11dGF0b3JOYW1lOiBgbXV0YXRvckRlc2NyaXB0aW9uYFxuICAgICAgfSxcblxuICAgICAgW3RoaXMuRE9DX1NVQlNDUklQVElPTlNdOiB7XG4gICAgICAgIC8vIHN1YnNjcmlwdGlvbk5hbWU6IGBzdWJzY3JpcHRpb25EZXNjcmlwdGlvbmBcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lZCBpbiBhIGJhc2UgY2xhc3MsIHRoaXMgZ2V0dGVyIHNob3VsZCByZXR1cm4gZWl0aGVyIGEgU3RyaW5nXG4gICAqIGRldGFpbGluZyB0aGUgZnVsbCBJREwgc2NoZW1hIG9mIGEgR3JhcGhRTCBoYW5kbGVyIG9yIG9uZSBvZiB0d29cbiAgICogdHlwZXMgb2YgU3ltYm9scy5cbiAgICpcbiAgICogVGhlIGZpcnN0IFN5bWJvbCB0eXBlIGlzIHRoZSBjb25zdGFudCBgQURKQUNFTlRfRklMRWAuIElmIHRoaXMgU3ltYm9sIGlzXG4gICAqIHJldHVybmVkLCB0aGUgc3lzdGVtIGFzc3VtZXMgdGhhdCBuZXh0IHRvIHRoZSBzb3VyY2UgZmlsZSBpbiBxdWVzdGlvbiBpc1xuICAgKiBhIGZpbGUgb2YgdGhlIHNhbWUgbmFtZSB3aXRoIGEgLmdyYXBocWwgZXh0ZW5zaW9uLiBUaGlzIGZpbGUgc2hvdWxkIGJlXG4gICAqIG1hZGUgb2YgdGhlIEdyYXBoUUwgSURMIHNjaGVtYSBkZWZpbml0aW9ucyBmb3IgdGhlIG9iamVjdCB0eXBlcyBiZWluZ1xuICAgKiBjcmVhdGVkLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKiBgYGBqc1xuICAgKiAgIHN0YXRpYyBnZXQgU0NIRU1BKCk6IHN0cmluZyB8IFN5bWJvbCB7XG4gICAqICAgICByZXR1cm4gR1FMQmFzZS5BREpBQ0VOVF9GSUxFXG4gICAqICAgfVxuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIHByaW1hcnkgYWR2YW50YWdlIG9mIHRoaXMgYXBwcm9hY2ggaXMgYWxsb3dpbmcgYW4gb3V0c2lkZSBlZGl0b3IgdGhhdFxuICAgKiBwcm92aWRlcyBzeW50YXggaGlnaGxpZ2h0aW5nIHJhdGhlciB0aGFuIHJldHVybmluZyBhIHN0cmluZyBmcm9tIHRoZVxuICAgKiBTQ0hFTUEgZ2V0dGVyLlxuICAgKlxuICAgKiBBbHRlcm5hdGl2ZWx5LCB0aGUgc3RhdGljIG1ldGhvZCBJRExGaWxlUGF0aCBjYW4gYmUgdXNlZCB0byBwb2ludCB0byBhblxuICAgKiBhbHRlcm5hdGUgbG9jYXRpb24gd2hlcmUgdGhlIEdyYXBoUUwgSURMIGZpbGUgcmVzaWRlcy4gVGhlIGV4dGVuc2lvbiBjYW5cbiAgICogYWxzbyBiZSBjaGFuZ2VkIGZyb20gLmdyYXBocWwgdG8gc29tZXRoaW5nIGVsc2UgaWYgbmVlZCBiZSB1c2luZyB0aGlzXG4gICAqIG1ldGhvZC5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICogYGBganNcbiAgICogICBzdGF0aWMgZ2V0IFNDSEVNQSgpOiBzdHJpbmcgfCBTeW1ib2wge1xuICAgKiAgICAgcmV0dXJuIEdRTEJhc2UuSURMRmlsZVBhdGgoJy9wYXRoL3RvL2ZpbGUnLCAnLmlkbCcpXG4gICAqICAgfVxuICAgKiBgYGBcbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAU0NIRU1BXG4gICAqIEByZWFkb25seVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ3xTeW1ib2x9IGEgdmFsaWQgSURMIHN0cmluZyBvciBvbmUgb2YgdGhlIFN5bWJvbHNcbiAgICogZGVzY3JpYmVkIGFib3ZlLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBHUUxCYXNlI0FESkFDRU5UX0ZJTEV9XG4gICAqIEBzZWUge0BsaW5rIEdRTEJhc2UjSURMRmlsZVBhdGh9XG4gICAqL1xuICBzdGF0aWMgZ2V0IFNDSEVNQSgpOiBzdHJpbmcgfCBTeW1ib2wge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gb2JqZWN0IG9mXG4gICAqIGZ1bmN0aW9ucyBtYXRjaGluZyB0aGUgbmFtZXMgb2YgdGhlIG11dGF0aW9uIG9wZXJhdGlvbnMuIFRoZXNlIGFyZSB0byBiZVxuICAgKiBpbmplY3RlZCBpbnRvIHRoZSByb290IG9iamVjdCB3aGVuIHVzZWQgYnkgYEdRTEV4cHJlc3NNaWRkbGV3YXJlYC5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4oy+4qCATVVUQVRPUlNcbiAgICogQHJlYWRvbmx5XG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3REYXRhIHR5cGljYWxseSBhbiBvYmplY3QgY29udGFpbmluZyB0aHJlZVxuICAgKiBwcm9wZXJ0aWVzOyB7cmVxLCByZXMsIGdxbH1cbiAgICogQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gb2JqZWN0OyBzZWUgYWJvdmUgZm9yIG1vcmVcbiAgICogaW5mb3JtYXRpb24uXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgTVVUQVRPUlMocmVxdWVzdERhdGE6IE9iamVjdCk6IFByb21pc2U8T2JqZWN0PiB7XG4gICAgLy8gZGVmaW5lIGluIGJhc2UgY2xhc3NcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3Qgb2ZcbiAgICogZnVuY3Rpb25zIG1hdGNoaW5nIHRoZSBuYW1lcyBvZiB0aGUgcXVlcnkgb3BlcmF0aW9ucy4gVGhlc2UgYXJlIHRvIGJlXG4gICAqIGluamVjdGVkIGludG8gdGhlIHJvb3Qgb2JqZWN0IHdoZW4gdXNlZCBieSBgR1FMRXhwcmVzc01pZGRsZXdhcmVgLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDijL7ioIBSRVNPTFZFUlNcbiAgICogQHJlYWRvbmx5XG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3REYXRhIHR5cGljYWxseSBhbiBvYmplY3QgY29udGFpbmluZyB0aHJlZVxuICAgKiBwcm9wZXJ0aWVzOyB7cmVxLCByZXMsIGdxbH1cbiAgICogQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gb2JqZWN0OyBzZWUgYWJvdmUgZm9yIG1vcmVcbiAgICogaW5mb3JtYXRpb24uXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgUkVTT0xWRVJTKHJlcXVlc3REYXRhOiBPYmplY3QpOiBQcm9taXNlPE9iamVjdD4ge1xuICAgIC8vIGRlZmluZSBpbiBiYXNlIGNsYXNzXG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUge0BsaW5rIEdRTEJhc2UjU0NIRU1BfVxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggEFESkFDRU5UX0ZJTEVcbiAgICogQHN0YXRpY1xuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHJldHVybiB7U3ltYm9sfSB0aGUgU3ltYm9sLCB3aGVuIHJldHVybmVkIGZyb20gU0NIRU1BLCBjYXVzZXNcbiAgICogdGhlIGxvZ2ljIHRvIGxvYWQgYW4gSURMIFNjaGVtYSBmcm9tIGFuIGFzc29jaWF0ZWQgZmlsZSB3aXRoIGEgLmdyYXBocWxcbiAgICogZXh0ZW5zaW9uIGFuZCBiZWFyaW5nIHRoZSBzYW1lIG5hbWUuXG4gICAqL1xuICBzdGF0aWMgZ2V0IEFESkFDRU5UX0ZJTEUoKTogU3ltYm9sIHtcbiAgICByZXR1cm4gU3ltYm9sLmZvcignLmdyYXBocWwgZmlsZSBsb2NhdGVkIGFkamFjZW50IHRvIHNvdXJjZScpXG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgZGVmYXVsdCB0eXBlIHRhcmdldGVkIGJ5IHRoaXMgR1FMQmFzZSBjbGFzcy4gQW55XG4gICAqIHR5cGUgd2lsbCB0ZWNobmljYWxseSBiZSB2YWxpZCBidXQgb25seSB3aWxsIHRyaWdnZXIgc3BlY2lhbCBiZWhhdmlvclxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggEdRTF9UWVBFXG4gICAqIEBzdGF0aWNcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIHR5cGUsIHN1Y2ggYXMgYEdyYXBoUUxPYmplY3RUeXBlYCBvclxuICAgKiBgR3JhcGhRTEludGVyZmFjZVR5cGVgXG4gICAqL1xuICBzdGF0aWMgZ2V0IEdRTF9UWVBFKCk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gR3JhcGhRTE9iamVjdFR5cGU7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhcHByb3ByaWF0ZSBTeW1ib2wgY3JhZnRlZCB3aXRoIHRoZSByaWdodCBkYXRhIGZvciB1c2UgYnlcbiAgICogdGhlIElETEZpbGVIYW5kbGVyIGNsYXNzIGJlbG93LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4oy+4qCASURMRmlsZVBhdGhcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggYSBwYXRoIHRvIHRoZSBJREwgY29udGFpbmluZyBmaWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZXh0ZW5zaW9uPScuZ3JhcGhxbCddIGFuIGV4dGVuc2lvbiwgaW5jbHVkaW5nIHRoZVxuICAgKiBwcmVmaXhlZCBwZXJpb2QsIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgc3VwcGxpZWQgcGF0aCBzaG91bGQgaXQgbm90XG4gICAqIGFscmVhZHkgZXhpc3QuXG4gICAqIEByZXR1cm4gU3ltYm9sXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEdRTEJhc2UjU0NIRU1BfVxuICAgKi9cbiAgc3RhdGljIElETEZpbGVQYXRoKHBhdGg6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcgPSAnLmdyYXBocWwnKTogU3ltYm9sIHtcbiAgICByZXR1cm4gU3ltYm9sLmZvcihgUGF0aCAke3BhdGh9IEV4dGVuc2lvbiAke2V4dGVuc2lvbn1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGZpbGUgaGFuZGxlciBmb3IgZmV0Y2hpbmcgdGhlIElETCBzY2hlbWEgc3RyaW5nIGZyb20gdGhlIGZpbGUgc3lzdGVtXG4gICAqIGZvciB0aG9zZSBgR1FMQmFzZWAgZXh0ZW5kZWQgY2xhc3NlcyB0aGF0IGhhdmUgaW5kaWNhdGVkIHRvIGRvIHNvIGJ5XG4gICAqIHJldHVybmluZyBhIGBTeW1ib2xgIGZvciB0aGVpciBgU0NIRU1BYCBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggGhhbmRsZXJcbiAgICpcbiAgICogQHJldHVybiB7SURMRmlsZUhhbmRsZXJ9IGluc3RhbmNlIG9mIElETEZpbGVIYW5kbGVyLCBjcmVhdGVkIGlmIG9uZSBkb2VzXG4gICAqIG5vdCBhbHJlYWR5IGV4aXN0LCBmb3IgZmV0Y2hpbmcgdGhlIGNvbnRlbnRzIGZyb20gZGlzay5cbiAgICovXG4gIHN0YXRpYyBnZXQgaGFuZGxlcigpOiBJRExGaWxlSGFuZGxlciB7XG4gICAgY29uc3Qga2V5ID0gU3ltYm9sLmZvcihgJHtJRExGaWxlSGFuZGxlci5uYW1lfS4ke3RoaXMubmFtZX1gKTtcblxuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICBpZiAoIXRoaXNba2V5XSkge1xuICAgICAgLy8gQENvbXB1dGVkVHlwZVxuICAgICAgdGhpc1trZXldID0gbmV3IElETEZpbGVIYW5kbGVyKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICByZXR1cm4gdGhpc1trZXldO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1vZHVsZSBvYmplY3Qgd2hlcmUgeW91ciBjbGFzcyBpcyBjcmVhdGVkLiBUaGlzIG5lZWRzIHRvIGJlXG4gICAqIGRlZmluZWQgb24geW91ciBjbGFzcywgYXMgYSBzdGF0aWMgZ2V0dGVyLCBpbiB0aGUgRklMRSB3aGVyZSB5b3UgYXJlXG4gICAqIGRlZmluaW5nIHlvdXIgQ2xhc3MgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggG1vZHVsZVxuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgcmVmZXJlbmNlIHRvIHRoZSBtb2R1bGUgb2JqZWN0IGRlZmluZWQgYW5kIGluamVjdGVkXG4gICAqIGJ5IG5vZGUuanMnIG1vZHVsZSBsb2FkaW5nIHN5c3RlbS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL25vZGVqcy5vcmcvYXBpL21vZHVsZXMuaHRtbFxuICAgKi9cbiAgc3RhdGljIGdldCBtb2R1bGUoKTogT2JqZWN0IHtcbiAgICByZXR1cm4gbW9kdWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRlcm5hbCBkYXRhIG1vZGVsIGhhcyBzb21lIGN1c3RvbSBgRXZlbnRFbWl0dGVyYCBjb2RlIHdyYXBwZWRcbiAgICogaXQgaGVyZS4gV2hlbiB0aGUgZGF0YSBtb2RlbCBpcyBzZXQgdmlhIGBzZXRNb2RlbGAgb3IgYnkgYWNjZXNzaW5nIGl0XG4gICAqIHZpYSBgaW5zdGFuY2VbTU9ERUxfS0VZXWAsIGFuIGV2ZW50IGBFVkVOVF9NT0RFTF9TRVRgIGlzIGVtaXR0ZWQuIEFueVxuICAgKiBsaXN0ZW5lciBsaXN0ZW5pbmcgZm9yIHRoaXMgZXZlbnQgcmVjZWl2ZXMgYW4gb2JqZWN0IHdpdGggdHdvIGtleXNcbiAgICogYGBgXG4gICAqIHtcbiAgICogICBtb2RlbDogVGhlIGFjdHVhbCBtb2RlbCBiZWluZyBzZXQ7IGNoYW5nZXMgYXJlIHBlcnNpc3RlZFxuICAgKiAgIGluc3RhbmNlOiBUaGUgR1FMQmFzZSBpbnN0YW5jZSB0aGUgbW9kZWwgaXMgYXNzb2NpYXRlZCB3aXRoXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFN1YnNlcXVlbnRseSwgdGhlIGV2ZW50cyBgRVZFTlRfTU9ERUxfUFJPUF9DSEFOR0VgIGFuZFxuICAgKiBgRVZFTlRfTU9ERUxfUFJPUF9ERUxFVEVgIGNhbiBiZSBsaXN0ZW5lZCB0byBpZiB5b3VyIHZlcnNpb24gb2Ygbm9kZVxuICAgKiBzdXBwb3J0cyBQcm94eSBvYmplY3RzLiBUaGV5IGFsbG93IHlvdSB0byBiZSBub3RpZmllZCB3aGVuZXZlciB5b3VyXG4gICAqIG1vZGVsIGhhcyBhIHByb3BlcnR5IGNoYW5nZWQgb3IgZGVsZXRlZCwgcmVzcGVjdGl2ZWx5LlxuICAgKlxuICAgKiBUaGUgY2FsbGJhY2sgZm9yIGBjaGFuZ2VgIHJlY2VpdmVzIGFuIG9iamVjdCB3aXRoIGZvdXIgcHJvcGVydGllc1xuICAgKiBgYGBcbiAgICoge1xuICAgKiAgIG1vZGVsOiBUaGUgbW9kZWwgb2JqZWN0IHRoZSB2YWx1ZSBpcyBiZWluZyBjaGFuZ2VkIG9uXG4gICAqICAgb2xkOiBUaGUgb2xkIHZhbHVlIGJlaW5nIHJlcGxhY2VkOyB1bmRlZmluZWQgaWYgaXQgaXMgdGhlIGZpcnN0IHRpbWVcbiAgICogICBrZXk6IFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB2YWx1ZSBiZWluZyBjaGFuZ2VkXG4gICAqICAgdmFsdWU6IFRoZSBuZXcgdmFsdWUgYmVpbmcgc2V0XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBjYWxsYmFjayBmb3IgYGRlbGV0ZWAgcmVjZWl2ZXMgYW4gb2JqZWN0IHdpdGggZm91ciBwcm9wZXJ0aWVzXG4gICAqIGBgYFxuICAgKiB7XG4gICAqICAgbW9kZWw6IFRoZSBtb2RlbCBvYmplY3QgdGhlIHZhbHVlIGlzIGRlbGV0ZWQgZnJvbVxuICAgKiAgIGtleTogVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIGRlbGV0ZWQgdmFsdWVcbiAgICogICBkZWxldGVkOiBUaGUgZGVsZXRlZCB2YWx1ZVxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4oy+4qCAc2V0dXBNb2RlbFxuICAgKlxuICAgKiBAcGFyYW0ge0dRTEJhc2V9IGluc3RhbmNlIHR5cGljYWxseSBgdGhpc2AgYXMgcGFzc2VkIGluIGZyb20gYSBjYWxsIGluXG4gICAqIHRoZSBjb25zdHJ1Y3RvclxuICAgKi9cbiAgc3RhdGljIHNldHVwTW9kZWwoaW5zdGFuY2U6IEdRTEJhc2UpIHtcbiAgICBjb25zdCBjaGFuZ2VIYW5kbGVyOiBPYmplY3QgPSB7XG4gICAgICAvKipcbiAgICAgICAqIFByb3h5IHNldCgpIGhhbmRsZXIuIFRoaXMgaXMgd2hlcmUgdGhlIGNoYW5nZSBldmVudHMgYXJlIGZpcmVkIGZyb21cbiAgICAgICAqXG4gICAgICAgKiBAbWV0aG9kIEdRTEJhc2V+c2V0XG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IHRoZSBgR1FMQmFzZWAgbW9kZWwgb2JqZWN0XG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IHRoZSBwcm9wZXJ0eSBuYW1lXG4gICAgICAgKiBAcGFyYW0ge21peGVkfSB2YWx1ZSB0aGUgbmV3IHByb3BlcnR5IHZhbHVlXG4gICAgICAgKi9cbiAgICAgIHNldCh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qgb2xkID0gdGFyZ2V0W2tleV07XG5cbiAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgaW5zdGFuY2UuZW1pdChHUUxCYXNlLkVWRU5UX01PREVMX1BST1BfQ0hBTkdFLCB7XG4gICAgICAgICAgbW9kZWw6IHRhcmdldCxcbiAgICAgICAgICBvbGQsXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIHZhbHVlXG4gICAgICAgIH0pXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByb3h5IGRlbGV0ZVByb3BlcnR5KCkgaGFuZGxlci4gVGhpcyBpcyB3aGVyZSB0aGUgZGVsZXRlIHByb3BlcnR5XG4gICAgICAgKiBldmVudHMgYXJlIGZpcmVkIGZyb21cbiAgICAgICAqXG4gICAgICAgKiBAbWV0aG9kIEdRTEJhc2V+ZGVsZXRlUHJvcGVydHlcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgdGhlIGBHUUxCYXNlYCBtb2RlbCBvYmplY3RcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdGhlIHByb3BlcnR5IG5hbWVcbiAgICAgICAqL1xuICAgICAgZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcbiAgICAgICAgY29uc3QgZGVsZXRlZCA9IHRhcmdldFtrZXldO1xuXG4gICAgICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcbiAgICAgICAgaW5zdGFuY2UuZW1pdChHUUxCYXNlLkVWRU5UX01PREVMX1BST1BfREVMRVRFLCB7XG4gICAgICAgICAgbW9kZWw6IHRhcmdldCxcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgZGVsZXRlZFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICdQdWJsaWNseScgdGhlIFN5bWJvbCBmb3IgYWNjZXNzaW5nIHRoZSBgR1FMQmFzZWAgbW9kZWwgaXMgYE1PREVMX0tFWWAuXG4gICAgICogSW4gdHJ1dGggaXQgaXMgc3RvcmVkIHVuZGVyIGEgU3ltYm9sIGRlZmluZWQgaW4gYHNldHVwTW9kZWxgIGFuZFxuICAgICAqIHJlZmVycmVkIHRvIGFzIGBfTU9ERUxfS0VZYCBpbiB0aGlzIGNvZGUuIFRoaXMgaXMgZG9uZSBzbyBhIGdldHRlciBhbmRcbiAgICAgKiBzZXR0ZXIgY2FuIGJlIHdyYXBwZWQgYXJvdW5kIHRoZSB1c2FnZSBvZiB0aGUgaW5zdGFuY2UncyBkYXRhIG1vZGVsLlxuICAgICAqXG4gICAgICogV2hlbiBiZWluZyByZWFkLCBpZiBgUHJveHlgIGV4aXN0cyBpbiB0aGUgbm9kZSBlbnZpcm9ubWVudCBhbmQgaWYgdGhlcmVcbiAgICAgKiBhcmUgYW55IHJlZ2lzdGVyZWQgYEVWRU5UX01PREVMX1BST1BfQ0hBTkdFYCBvciBgRVZFTlRfTU9ERUxfUFJPUF9ERUxFVEVgXG4gICAgICogZXZlbnRzLCB0aGVuIHRoZSByZXR1cm5lZCBtb2RlbCBpcyBhIFByb3h5IGFyb3VuZCB0aGUgcmVhbCBtb2RlbCB0aGF0XG4gICAgICogYWxsb3dzIHVzIHRvIGNhcHR1cmUgdGhlIGNoYW5nZXMgYW5kIGRlbGV0aW9uIG9mIGtleXNcbiAgICAgKlxuICAgICAqIFdoZW4gYmVpbmcgYXNzaWduZWQsIHRoZSBldmVudCBgRVZFTlRfTU9ERUxfV0lMTF9CRV9TRVRgIGFuZCB0aGUgZXZlbnRcbiAgICAgKiBgRVZFTlRfTU9ERUxfSEFTX0JFRU5fU0VUYCBhcmUgZW1pdHRlZCB0byBhbGxvdyBsaXN0ZW5lcnMgdG8gbW9kaWZ5IGFuZFxuICAgICAqIHNlZSB0aGUgZmluYWwgZGF0YSBhcm91bmQgdGhlIHNldHRpbmcgb2YgYSBtb2RlbCBvYmplY3QuIEJvdGggZXZlbnRzXG4gICAgICogcmVjZWl2ZSBhbiBvYmplY3Qgd2l0aCB0d28ga2V5c1xuICAgICAqXG4gICAgICogYGBgXG4gICAgICoge1xuICAgICAqICAgbW9kZWw6IFRoZSBvYmplY3QgYmVpbmcgb3IgaGF2aW5nIGJlZW4gc2V0XG4gICAgICogICBpbnN0YW5jZTogVGhlIEdRTEJhc2UgaW5zdGFuY2UgcmVjZWl2aW5nIHRoZSBtb2RlbFxuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5zdGFuY2UsIE1PREVMX0tFWSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IG1vZGVsID0gdGhpc1tfTU9ERUxfS0VZXVxuICAgICAgICBsZXQgaGFzTGlzdGVuZXJzID1cbiAgICAgICAgICB0aGlzLmxpc3RlbmVyQ291bnQoR1FMQmFzZS5FVkVOVF9NT0RFTF9QUk9QX0NIQU5HRSkgK1xuICAgICAgICAgIHRoaXMubGlzdGVuZXJDb3VudChHUUxCYXNlLkVWRU5UX01PREVMX1BST1BfREVMRVRFKVxuXG4gICAgICAgIGlmIChoYXNQcm94eSAmJiBoYXNMaXN0ZW5lcnMpIHtcbiAgICAgICAgICBtb2RlbCA9IG5ldyBQcm94eShtb2RlbCwgY2hhbmdlSGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9kZWxcbiAgICAgIH0sXG5cbiAgICAgIHNldDogZnVuY3Rpb24obW9kZWwpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZW1pdChHUUxCYXNlLkVWRU5UX01PREVMX1dJTExfQkVfU0VULCB7IG1vZGVsLCBpbnN0YW5jZSB9KTtcbiAgICAgICAgaW5zdGFuY2VbX01PREVMX0tFWV0gPSBtb2RlbDtcbiAgICAgICAgdGhpcy5lbWl0KEdRTEJhc2UuRVZFTlRfTU9ERUxfSEFTX0JFRU5fU0VULCB7IG1vZGVsLCBpbnN0YW5jZSB9KVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIEVTNiBQcm94aWVzIGFyZSBzdXBwb3J0ZWQgaW4geW91ciBleGVjdXRpb24gZW52aXJvbm1lbnQsIGFsbCBHUUxCYXNlXG4gICAqIGV4dGVuZGVkIGNsYXNzZXMgYXJlIGFsc28gcHJveGllcy4gQnkgZGVmYXVsdCB0aGUgaW50ZXJuYWwgcHJveHkgaGFuZGxlclxuICAgKiBwcm92aWRlcyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSByZW1vdmFsIG9mIHRoZSBkZWZhdWx0IGdldHRlcnNcbiAgICogYW5kIHNldHRlcnMgZm9yIHRoZSAnbW9kZWwnIHByb3BlcnR5IGFzIGxvbmcgYXMgeW91IGRvIG5vdCBkZWZpbmUgYVxuICAgKiB0b3AgbGV2ZWwgJ21vZGVsJyBwcm9wZXJ0eSBvZiB5b3VyIG93bi5cbiAgICpcbiAgICogQG1ldGhvZCDirIfvuI7ioIBbX1BST1hZX0hBTkRMRVJdXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBzdGF0aWNcbiAgICogQGNvbnN0XG4gICAqIEBzaW5jZSAyLjUuMFxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAQ29tcHV0ZWRUeXBlXG4gICAqL1xuICBzdGF0aWMgZ2V0IFtfUFJPWFlfSEFORExFUl0oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldCh0YXJnZXQsIGtleSwgbGFzdFJlc3VsdCkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHRhcmdldFtfTU9ERUxfS0VZXTtcblxuICAgICAgICAvLyBBbGxvdyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBmb3IgJ21vZGVsJyBwcm9wZXJ0eSBpZiBvbmUgaXMgbm90XG4gICAgICAgIC8vIGV4cGxpY2l0bHkgZGVmaW5lZCBvbiB5b3VyIGluc3RhbmNlLlxuICAgICAgICBpZiAobm90RGVmaW5lZCgnbW9kZWwnLCBrZXksIHRhcmdldCkpIHtcbiAgICAgICAgICAvLyBCZSBzdXJlIHRvIHVzZSB0aGUgcHVibGljIE1PREVMX0tFWSB0byBlbnN1cmUgZXZlbnRzIGZpcmVcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0W01PREVMX0tFWV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0W2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgc2FtZSBsb2dpYyBhcyB7QGxpbmsgI1tTeW1ib2wudG9TdHJpbmdUYWddfSBidXQgb24gYSBzdGF0aWNcbiAgICogc2NhbGUuIFNvLCBpZiB5b3UgcGVyZm9ybSBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKE15Q2xhc3MpYFxuICAgKiB0aGUgcmVzdWx0IHdvdWxkIGJlIGBbb2JqZWN0IE15Q2xhc3NdYC5cbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBbU3ltYm9sLnRvU3RyaW5nVGFnXVxuICAgKiBAbWVtYmVyb2YgTW9kdWxlUGFyc2VyXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGlzIGNsYXNzXG4gICAqIEBDb21wdXRlZFR5cGVcbiAgICovXG4gIHN0YXRpYyBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7IHJldHVybiB0aGlzLm5hbWUgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHVzZWQgdG8gcmVnaXN0ZXIgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHdoZW4gdGhlIGludGVybmFsXG4gICAqIG1vZGVsIG9iamVjdCBpcyBhc3NpZ25lZCBhIG5ldyB2YWx1ZS4gVGhpcyBldmVudCBmaXJlcyBiZWZvcmUgdGhlIG1vZGVsXG4gICAqIGlzIHNldC4gQ2hhbmdlcyB0byB0aGUgbW9kZWwgdmFsdWUgYXQgdGhpcyBwb2ludCB3aWxsIGFmZmVjdCB0aGUgY29udGVudHNcbiAgICogYmVmb3JlIHRoZSB2YWx1ZSBhc3NpZ25tZW50IHRha2VzIHBsYWNlLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCARVZFTlRfTU9ERUxfV0lMTF9CRV9TRVRcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IEVWRU5UX01PREVMX1dJTExfQkVfU0VUKCkgeyByZXR1cm4gJ0U6IEludC4gbW9kZWwgd2lsbCBiZSBzZXQnIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCB1c2VkIHRvIHJlZ2lzdGVyIGFuIGV2ZW50IGxpc3RlbmVyIGZvciB3aGVuIHRoZSBpbnRlcm5hbFxuICAgKiBtb2RlbCBvYmplY3QgaXMgYXNzaWduZWQgYSBuZXcgdmFsdWUuIFRoaXMgZXZlbnQgZmlyZXMgYWZ0ZXIgdGhlIG1vZGVsXG4gICAqIGlzIHNldC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggEVWRU5UX01PREVMX0hBU19CRUVOX1NFVFxuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRVZFTlRfTU9ERUxfSEFTX0JFRU5fU0VUKCkgeyByZXR1cm4gJ0U6IEludC4gbW9kZWwgaGFzIGJlZW4gc2V0JyB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgdXNlZCB0byByZWdpc3RlciBhbiBldmVudCBsaXN0ZW5lciBmb3Igd2hlbiBhIHByb3BlcnR5IG9mIHRoZVxuICAgKiBpbnRlcm5hbCBtb2RlbCBvYmplY3QgaXMgc2V0IHRvIGEgbmV3IG9yIGludGlhbCB2YWx1ZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggEVWRU5UX01PREVMX1BST1BfQ0hBTkdFXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBFVkVOVF9NT0RFTF9QUk9QX0NIQU5HRSgpIHsgcmV0dXJuICdFOiBJbnQuIG1vZGVsIHByb3AgY2hhbmdlZCcgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHVzZWQgdG8gcmVnaXN0ZXIgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHdoZW4gYSBwcm9wZXJ0eSBvZiB0aGVcbiAgICogaW50ZXJuYWwgbW9kZWwgb2JqZWN0IGhhcyBiZWVuIGRlbGV0ZWQuIFRoaXMgZXZlbnQgZmlyZXMgYWZ0ZXIgdGhlIHZhbHVlXG4gICAqIGhhcyBiZWVuIGRlbGV0ZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDirIfvuI7ioIBFVkVOVF9NT0RFTF9QUk9QX0RFTEVURVxuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRVZFTlRfTU9ERUxfUFJPUF9ERUxFVEUoKSB7IHJldHVybiAnRTogSW50LiBtb2RlbCBwcm9wIGRlbGV0ZWQnIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCBrZXkgdXNlZCB0byBpZGVudGlmeSBhIGNvbW1lbnQgZm9yIGEgY2xhc3MgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggERPQ19DTEFTU1xuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRE9DX0NMQVNTKCkgeyByZXR1cm4gJ2NsYXNzJyB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQga2V5IHVzZWQgdG8gaWRlbnRpZnkgYSBjb21tZW50IGZvciBhIHR5cGUgZmllbGQgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggERPQ19GSUVMRFNcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IERPQ19GSUVMRFMoKSB7IHJldHVybiAnZmllbGRzJyB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQga2V5IHVzZWQgdG8gaWRlbnRpZnkgYSBjb21tZW50IGZvciB0aGUgdG9wIGxldmVsIHF1ZXJ5XG4gICAqIGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDirIfvuI7ioIBET0NfUVVFUllcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IERPQ19RVUVSWSgpIHsgcmV0dXJuICdxdWVyeScgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IGtleSB1c2VkIHRvIGlkZW50aWZ5IGEgY29tbWVudCBmb3IgYSBxdWVyeSBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCARE9DX1FVRVJJRVNcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IERPQ19RVUVSSUVTKCkgeyByZXR1cm4gJ3F1ZXJpZXMnIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCBrZXkgdXNlZCB0byBpZGVudGlmeSBhIGNvbW1lbnQgZm9yIHRoZSB0b3AgbGV2ZWwgbXV0YXRpb25cbiAgICogZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggERPQ19NVVRBVElPTlxuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRE9DX01VVEFUSU9OKCkgeyByZXR1cm4gJ211dGF0aW9uJyB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQga2V5IHVzZWQgdG8gaWRlbnRpZnkgYSBjb21tZW50IGZvciBhIG11dGF0b3IgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggERPQ19NVVRBVE9SU1xuICAgKiBAY29uc3RcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBET0NfTVVUQVRJT05TYCBpbnN0ZWFkXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IERPQ19NVVRBVE9SUygpIHsgcmV0dXJuICdtdXRhdG9ycycgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IGtleSB1c2VkIHRvIGlkZW50aWZ5IGEgY29tbWVudCBmb3IgYSBtdXRhdG9yIGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDirIfvuI7ioIBET0NfTVVUQVRPUlNcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IERPQ19NVVRBVElPTlMoKSB7IHJldHVybiAnbXV0YXRvcnMnIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCBrZXkgdXNlZCB0byBpZGVudGlmeSBhIGNvbW1lbnQgZm9yIHRoZSB0b3AgbGV2ZWwgc3Vic2NyaXB0aW9uXG4gICAqIGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDirIfvuI7ioIBET0NfU1VCU0NSSVBUSU9OXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBET0NfU1VCU0NSSVBUSU9OKCkgeyByZXR1cm4gJ3N1YnNjcmlwdGlvbicgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IGtleSB1c2VkIHRvIGlkZW50aWZ5IGEgY29tbWVudCBmb3IgYSBzdWJzY3JpcHRpb24gZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggERPQ19TVUJTQ1JJUFRJT05TXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBET0NfU1VCU0NSSVBUSU9OUygpIHsgcmV0dXJuICdzdWJzY3JpcHRpb25zJyB9XG5cbiAgLyoqXG4gICAqIEEgc2hvcnRjdXQgdG8gdGhlIHV0aWxzL2pvaW5MaW5lcyBmdW5jdGlvbiB0byBtYWtlIGl0IGVhc2llciB0byBnZXRcbiAgICogdGhlIHRvb2xzIHRvIHdyaXRlIGRvY3MgZm9yIHlvdXIgdHlwZXMgaW4gYSBmcmllbmRseSBmYXNoaW9uLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggGpvaW5MaW5lc1xuICAgKiBAc3RhdGljXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBzdGF0aWMgZ2V0IGpvaW5MaW5lcygpOiBGdW5jdGlvbiB7IHJldHVybiBqb2luTGluZXMgfVxuXG4gIC8qKlxuICAgKiBBbiBzaW1wbGUgcGFzcy10aHJ1IG1ldGhvZCBmb3IgZmV0Y2hpbmcgYSB0eXBlcyBtZXJnZWQgcm9vdCBvYmplY3QuXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0TWVyZ2VkUm9vdFxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0RGF0YSBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVxdWVzdCBkYXRhIHN1Y2ggYXNcbiAgICogcmVxdWVzdCwgcmVzcG9uc2Ugb3IgZ3JhcGhxbCBjb250ZXh0IGluZm8gdGhhdCBzaG91bGQgYmUgcGFzc2VkIGFsb25nIHRvXG4gICAqIGVhY2ggb2YgdGhlIHJlc29sdmVyIGNyZWF0b3JzXG4gICAqIEByZXR1cm4ge09iamVjdH0gdGhlIG1lcmdlZCByb290IG9iamVjdCB3aXRoIGFsbCB0aGUgcXVlcnksIG11dGF0aW9uIGFuZFxuICAgKiBzdWJzY3JpcHRpb24gcmVzb2x2ZXJzIGRlZmluZWQgYW5kIGNyZWF0ZWQgd2l0aGluLlxuICAgKi9cbiAgc3RhdGljIGFzeW5jIGdldE1lcmdlZFJvb3QoXG4gICAgcmVxdWVzdERhdGE6IE9iamVjdCxcbiAgICBzZXBhcmF0ZUJ5VHlwZTogYm9vbGVhbiA9IGZhbHNlXG4gICk6IE9iamVjdCB7XG4gICAgY29uc3Qgcm9vdCA9IHt9O1xuICAgIGNvbnN0IENsYXNzID0gdGhpcztcblxuICAgIGxldCBfID0ge1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgcmVzb2x2ZXJzOiBDbGFzc1tNRVRBX0tFWV0ucmVzb2x2ZXJzIHx8IFtdLFxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgbXV0YXRvcnM6IENsYXNzW01FVEFfS0VZXS5tdXRhdG9ycyB8fCBbXSxcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIHN1YnNjcmlwdG9yczogQ2xhc3NbTUVUQV9LRVldLnN1YnNjcmlwdG9ycyB8fCBbXVxuICAgIH1cblxuICAgIGxldCBjb252ZXJ0ID0gZiA9PiB7XG4gICAgICBsZXQgaXNGYWN0b3J5Q2xhc3MgPSAoYykgPT4ge1xuICAgICAgICByZXR1cm4gISFDbGFzc1tNRVRBX0tFWV1bU3ltYm9sLmZvcignRmFjdG9yeSBDbGFzcycpXVxuICAgICAgfVxuXG4gICAgICBpZiAoaXNGYWN0b3J5Q2xhc3MoQ2xhc3MpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgW2YubmFtZV06IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmFwcGx5KENsYXNzLCBbQ2xhc3MsIHJlcXVlc3REYXRhLCAuLi5hcmdzXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFtmLm5hbWVdOiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gZi5hcHBseShDbGFzcywgW3JlcXVlc3REYXRhLCAuLi5hcmdzXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IHJlZHVjZSA9IChwLCBjKSA9PiBtZXJnZShwLCBjKVxuXG4gICAgXy5yZXNvbHZlcnMgPSBfLnJlc29sdmVycy5tYXAoY29udmVydCkucmVkdWNlKHJlZHVjZSwge30pXG4gICAgXy5tdXRhdG9ycyA9IF8ubXV0YXRvcnMubWFwKGNvbnZlcnQpLnJlZHVjZShyZWR1Y2UsIHt9KVxuICAgIF8uc3Vic2NyaXB0b3JzID0gXy5zdWJzY3JpcHRvcnMubWFwKGNvbnZlcnQpLnJlZHVjZShyZWR1Y2UsIHt9KVxuXG4gICAgaWYgKHNlcGFyYXRlQnlUeXBlKSB7XG4gICAgICAvLyBBcG9sbG8gd2FudHMgYWxsIHRoZSByZXNvbHZlcnMgdG8gZ3JvdXBlZCBieSB0b3AgbGV2ZWwgdHlwZS5cbiAgICAgIC8vIFRoZSBmaWVsZCByZXNvbHZlcnMgYXJlbid0IGFuIGlzc3VlIGluIExhdHRpY2UgZGVmaW5lZCB0eXBlc1xuICAgICAgLy8gYnV0IHRoZSByb290IHR5cGVzIGRvIG5lZWQgdG8gYmUgc29ydGVkOyBzbyBsZXQncyBkbyB0aGF0IGhlcmVcbiAgICAgIG1lcmdlKFxuICAgICAgICByb290LFxuICAgICAgICB7IFF1ZXJ5OiBhd2FpdCBDbGFzcy5SRVNPTFZFUlMocmVxdWVzdERhdGEpIH0sXG4gICAgICAgIHsgTXV0YXRpb246IGF3YWl0IENsYXNzLk1VVEFUT1JTKHJlcXVlc3REYXRhKSB9LFxuICAgICAgICB7IFF1ZXJ5OiBfLnJlc29sdmVycyB9LFxuICAgICAgICB7IE11dGF0aW9uOiBfLm11dGF0b3JzIH0sXG4gICAgICAgIHsgU3Vic2NyaXB0aW9uOiBfLnN1YnNjcmlwdG9ycyB9XG4gICAgICApO1xuXG4gICAgICAvLyBXaGVuIHVzaW5nIGxhdHRpY2Ugd2l0aCBhcG9sbG8gc2VydmVyLCBpdCBpcyBxdWl0ZSBwYXJ0aWN1bGFyIGFib3V0XG4gICAgICAvLyBlbXB0eSBRdWVyeSwgTXV0YXRpb24gb3IgU3Vic2NyaXB0aW9uIHJlc29sdmVyIG1hcHMuXG4gICAgICBpZiAoIU9iamVjdC5rZXlzKHJvb3QuUXVlcnkpLmxlbmd0aCkgZGVsZXRlIHJvb3QuUXVlcnlcbiAgICAgIGlmICghT2JqZWN0LmtleXMocm9vdC5NdXRhdGlvbikubGVuZ3RoKSBkZWxldGUgcm9vdC5NdXRhdGlvblxuICAgICAgaWYgKCFPYmplY3Qua2V5cyhyb290LlN1YnNjcmlwdGlvbikubGVuZ3RoKSBkZWxldGUgcm9vdC5TdWJzY3JpcHRpb25cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBtZXJnZShcbiAgICAgICAgcm9vdCxcbiAgICAgICAgYXdhaXQgQ2xhc3MuUkVTT0xWRVJTKHJlcXVlc3REYXRhKSxcbiAgICAgICAgYXdhaXQgQ2xhc3MuTVVUQVRPUlMocmVxdWVzdERhdGEpLFxuICAgICAgICBfLnJlc29sdmVycyxcbiAgICAgICAgXy5tdXRhdG9ycyxcbiAgICAgICAgXy5zdWJzY3JpcHRvcnNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IHVzZWQgdG8gc3RvcmUgZGF0YSB1c2VkIGJ5IGRlY29yYXRvcnMgYW5kIG90aGVyIGludGVybmFsXG4gICAqIHByb2NjZXNzZXMuXG4gICAqIEBDb21wdXRlZFR5cGVcbiAgICovXG4gIHN0YXRpYyBnZXQgW01FVEFfS0VZXSgpIHtcbiAgICBsZXQgc3RvcmFnZSA9IHRoaXNbU3ltYm9sLmZvcih0aGlzLm5hbWUpXVxuXG4gICAgaWYgKCFzdG9yYWdlKSB7XG4gICAgICBzdG9yYWdlID0gKHRoaXNbU3ltYm9sLmZvcih0aGlzLm5hbWUpXSA9IHt9KVxuICAgIH1cblxuICAgIHJldHVybiBzdG9yYWdlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdRTEJhc2U7XG4iXX0=