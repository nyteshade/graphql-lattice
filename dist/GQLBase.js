"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notDefined = notDefined;
exports.default = exports.GQLBase = exports.PROPS = exports.SETTERS = exports.GETTERS = exports.AUTO_PROPS = exports.META_KEY = exports.REQ_DATA_KEY = exports.MODEL_KEY = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

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

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        ## Welcome to GraphQL Lattice\n        **Subscription**\n\n        You will want to define a `DOC_SUBSCRIPTION` apiDoc comment with\n        something more meaningful to your particular Schema here.\n      "], ["\n        ## Welcome to GraphQL Lattice\n        **Subscription**\n\n        You will want to define a \\`DOC_SUBSCRIPTION\\` apiDoc comment with\n        something more meaningful to your particular Schema here.\n      "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        ## Welcome to GraphQL Lattice\n        **Mutation**\n\n        You will want to define a `DOC_MUTATION` apiDoc comment with\n        something more meaningful to your particular Schema here.\n      "], ["\n        ## Welcome to GraphQL Lattice\n        **Mutation**\n\n        You will want to define a \\`DOC_MUTATION\\` apiDoc comment with\n        something more meaningful to your particular Schema here.\n      "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        ## Welcome to GraphQL Lattice\n        **Query**\n\n        You will want to define a `DOC_QUERY` apiDoc comment with something\n        more meaningful to your particular Schema here.\n      "], ["\n        ## Welcome to GraphQL Lattice\n        **Query**\n\n        You will want to define a \\`DOC_QUERY\\` apiDoc comment with something\n        more meaningful to your particular Schema here.\n      "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        GQLBase class implementation. GQLBase is the root class used in\n        graphql-lattice to describe a GraphQLObjectType. If you are reading\n        this, the person using lattice failed to provide documentation for\n        their type. :)\n      "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        There is no SCHEMA for ", "!! This will likely\n        end in an error. Proceed with caution. Skipping `applyAutoProps`\n      "], ["\n        There is no SCHEMA for ", "!! This will likely\n        end in an error. Proceed with caution. Skipping \\`applyAutoProps\\`\n      "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n          The class name \"", "\" does not match any of the types,\n          enums, scalars, unions or interfaces defined in the SCHEMA for\n          this class (", ").\n\n          \x1B[1mIn most clases this is because your class name and SCHEMA\n          type do not match.\x1B[0m\n        "], ["\n          The class name \"", "\" does not match any of the types,\n          enums, scalars, unions or interfaces defined in the SCHEMA for\n          this class (", ").\n\n          \\x1b[1mIn most clases this is because your class name and SCHEMA\n          type do not match.\\x1b[0m\n        "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n          The SDL is unparsable. Please check your SCHEMA and make sure\n          it is valid GraphQL SDL/IDL. Your SCHEMA is defined as:\n\n          ", "\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/* Internal implementation to detect the existence of proxies. When present
 * additional functionality is enabled. Proxies are native in Node >= 6 */
var hasProxy = typeof global.Proxy !== 'undefined';
/* Internal Symbol referring to real accessor to GQLBase model object */

var _MODEL_KEY = Symbol.for('data-model-contents-value');
/* Internal Symbol referring to the static object containing a proxy handler */


var _PROXY_HANDLER = Symbol.for('internal-base-proxy-handler');
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


var MODEL_KEY = Symbol.for('data-model-contents-key');
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
var REQ_DATA_KEY = Symbol.for('request-data-object-key');
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
var AUTO_PROPS = Symbol.for('auto-props');
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
var GETTERS = Symbol.for('getters');
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
var SETTERS = Symbol.for('setters');
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
var PROPS = Symbol.for('props');
/**
 * All GraphQL Type objects used in this system are assumed to have extended
 * from this class. An instance of this class can be used to wrap an existing
 * structure if you have one.
 *
 * @class GQLBase
 */

exports.PROPS = PROPS;

var GQLBase =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(GQLBase, _EventEmitter);

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
    (0, _classCallCheck2.default)(this, GQLBase);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GQLBase).call(this));
    var Class = _this.constructor;

    var tree = _SyntaxTree.SyntaxTree.from(Class.SCHEMA);

    var outline = tree && tree.outline || null;

    if (!outline) {
      throw new _FunctionExecutionError.default(new Error((0, _neTagFns.dedent)(_templateObject(), _this.SCHEMA)));
    }

    if (outline && !(Class.name in outline)) {
      throw new _FunctionExecutionError.default(new Error((0, _neTagFns.dedent)(_templateObject2(), Class.name, Object.keys(outline))));
    }

    GQLBase.setupModel((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));

    _this.setModel(modelData);

    _this.requestData = requestData || {};
    _this.fileHandler = new _IDLFileHandler.IDLFileHandler(_this.constructor);

    if (options && !!options.autoProps !== false) {
      _this.applyAutoProps();
    } // @ComputedType


    return (0, _possibleConstructorReturn2.default)(_this, hasProxy ? new Proxy((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), GQLBase[_PROXY_HANDLER]) : (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
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


  (0, _createClass2.default)(GQLBase, [{
    key: "applyAutoProps",
    value: function applyAutoProps() {
      if (!this.constructor.SCHEMA || !this.constructor.SCHEMA.length) {
        _utils.LatticeLogs.warn((0, _utils.joinLines)(_templateObject3(), this.constructor.name));

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

      var _arr = Object.keys(outline[Class.name]);

      for (var _i = 0; _i < _arr.length; _i++) {
        var propName = _arr[_i];
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
    key: "getProp",

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
      var _callProp = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(propName) {
        var _len2,
            args,
            _key2,
            prop,
            result,
            _args = arguments;

        return _regenerator.default.wrap(function _callee$(_context) {
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
                throw new _AsyncFunctionExecutionError.default(_context.t0, prop, args, result);

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
                throw new _FunctionExecutionError.default(_context.t1, prop, args, result);

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
                throw new _AwaitingPromiseError.default(_context.t2).setPromise(result);

              case 32:
                return _context.abrupt("return", result);

              case 33:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 9], [15, 19], [23, 29]]);
      }));

      return function callProp(_x) {
        return _callProp.apply(this, arguments);
      };
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
      var _getResolver = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(resolverName, requestData) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
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

      return function getResolver(_x2, _x3) {
        return _getResolver.apply(this, arguments);
      };
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
    key: Symbol.toStringTag,
    get: function get() {
      return this.constructor.name;
    }
  }], [{
    key: "getResolver",
    value: function () {
      var _getResolver2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(resolverName, requestData) {
        var reqData, rootObj;
        return _regenerator.default.wrap(function _callee3$(_context3) {
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

      return function getResolver(_x4, _x5) {
        return _getResolver2.apply(this, arguments);
      };
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

      return _ref = {}, (0, _defineProperty2.default)(_ref, this.DOC_CLASS, (0, _utils.joinLines)(_templateObject4())), (0, _defineProperty2.default)(_ref, this.DOC_QUERY, (0, _utils.joinLines)(_templateObject5())), (0, _defineProperty2.default)(_ref, this.DOC_MUTATION, (0, _utils.joinLines)(_templateObject6())), (0, _defineProperty2.default)(_ref, this.DOC_SUBSCRIPTION, (0, _utils.joinLines)(_templateObject7())), (0, _defineProperty2.default)(_ref, this.DOC_FIELDS, {// fieldName: `fieldDescription`,
      }), (0, _defineProperty2.default)(_ref, this.DOC_QUERIES, {// queryName: `queryDescription`,
      }), (0, _defineProperty2.default)(_ref, this.DOC_MUTATORS, {// mutatorName: `mutatorDescription`
      }), (0, _defineProperty2.default)(_ref, this.DOC_SUBSCRIPTIONS, {// subscriptionName: `subscriptionDescription`
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
    key: "MUTATORS",

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
      var _MUTATORS = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(requestData) {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", {});

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function MUTATORS(_x6) {
        return _MUTATORS.apply(this, arguments);
      };
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
      var _RESOLVERS = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee5(requestData) {
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", {});

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function RESOLVERS(_x7) {
        return _RESOLVERS.apply(this, arguments);
      };
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
    key: "IDLFilePath",

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
      return Symbol.for("Path ".concat(path, " Extension ").concat(extension));
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
    key: "setupModel",

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
    key: "getMergedRoot",

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
      var _getMergedRoot = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee6(requestData) {
        var separateByType,
            root,
            Class,
            _,
            convert,
            reduce,
            _args6 = arguments;

        return _regenerator.default.wrap(function _callee6$(_context6) {
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
                    return !!Class[META_KEY][Symbol.for('Factory Class')];
                  };

                  if (isFactoryClass(Class)) {
                    return (0, _defineProperty2.default)({}, f.name, function () {
                      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                      }

                      return f.apply(Class, [Class, requestData].concat(args));
                    });
                  } else {
                    return (0, _defineProperty2.default)({}, f.name, function () {
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

      return function getMergedRoot(_x8) {
        return _getMergedRoot.apply(this, arguments);
      };
    }()
    /**
     * An object used to store data used by decorators and other internal
     * proccesses.
     * @ComputedType
     */

  }, {
    key: "SCHEMA",
    get: function get() {
      return '';
    }
  }, {
    key: "ADJACENT_FILE",
    get: function get() {
      return Symbol.for('.graphql file located adjacent to source');
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
  }, {
    key: "handler",
    get: function get() {
      var key = Symbol.for("".concat(_IDLFileHandler.IDLFileHandler.name, ".").concat(this.name)); // @ComputedType

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
    key: Symbol.toStringTag,
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
  }, {
    key: META_KEY,
    get: function get() {
      var storage = this[Symbol.for(this.name)];

      if (!storage) {
        storage = this[Symbol.for(this.name)] = {};
      }

      return storage;
    }
  }]);
  return GQLBase;
}(_events.default);

exports.GQLBase = GQLBase;
var _default = GQLBase;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxCYXNlLmpzIl0sIm5hbWVzIjpbImhhc1Byb3h5IiwiZ2xvYmFsIiwiUHJveHkiLCJfTU9ERUxfS0VZIiwiU3ltYm9sIiwiZm9yIiwiX1BST1hZX0hBTkRMRVIiLCJub3REZWZpbmVkIiwia2V5VG9UZXN0Iiwia2V5U3VwcGxpZWQiLCJpbnN0YW5jZSIsIlJlZ0V4cCIsInRlc3QiLCJ0b1N0cmluZyIsImhhc093blByb3BlcnR5IiwiTU9ERUxfS0VZIiwiUkVRX0RBVEFfS0VZIiwiTUVUQV9LRVkiLCJBVVRPX1BST1BTIiwiR0VUVEVSUyIsIlNFVFRFUlMiLCJQUk9QUyIsIkdRTEJhc2UiLCJtb2RlbERhdGEiLCJyZXF1ZXN0RGF0YSIsIm9wdGlvbnMiLCJhdXRvUHJvcHMiLCJDbGFzcyIsImNvbnN0cnVjdG9yIiwidHJlZSIsIlN5bnRheFRyZWUiLCJmcm9tIiwiU0NIRU1BIiwib3V0bGluZSIsIkZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IiLCJFcnJvciIsImRlZGVudCIsIm5hbWUiLCJPYmplY3QiLCJrZXlzIiwic2V0dXBNb2RlbCIsInNldE1vZGVsIiwiZmlsZUhhbmRsZXIiLCJJRExGaWxlSGFuZGxlciIsImFwcGx5QXV0b1Byb3BzIiwibGVuZ3RoIiwibGwiLCJ3YXJuIiwiam9pbkxpbmVzIiwiR1FMX1RZUEUiLCJHcmFwaFFMRW51bVR5cGUiLCJwcm9wcyIsInByb3BOYW1lIiwiZGVzYyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInByb3RvdHlwZSIsImhhc0N1c3RvbUltcGwiLCJnZXQiLCJ2YWx1ZSIsInB1c2giLCJpbmZvIiwiUHJvcGVydGllcyIsImVycm9yIiwicGFyc2VkIiwiZXhlYyIsIm1lc3NhZ2UiLCJleHRlbnNpb25zIiwibWVyZ2UiLCJiaW5kR2V0dGVycyIsImJpbmRUbyIsInByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJkZXNjcmlwdG9yIiwicmVzdWx0IiwiaW5pdGlhbGl6ZXIiLCJ3aGF0IiwiYmluZCIsImFyZ3MiLCJwcm9wIiwiZ2V0UHJvcCIsImFwcGx5IiwiQXN5bmNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIiwiRnVuY3Rpb24iLCJQcm9taXNlIiwiQXdhaXRpbmdQcm9taXNlRXJyb3IiLCJzZXRQcm9taXNlIiwicmVzb2x2ZXJOYW1lIiwiZ2V0UmVzb2x2ZXIiLCJ0b1N0cmluZ1RhZyIsInJlcURhdGEiLCJnZXRNZXJnZWRSb290Iiwicm9vdE9iaiIsIkRPQ19DTEFTUyIsIkRPQ19RVUVSWSIsIkRPQ19NVVRBVElPTiIsIkRPQ19TVUJTQ1JJUFRJT04iLCJET0NfRklFTERTIiwiRE9DX1FVRVJJRVMiLCJET0NfTVVUQVRPUlMiLCJET0NfU1VCU0NSSVBUSU9OUyIsInBhdGgiLCJleHRlbnNpb24iLCJjaGFuZ2VIYW5kbGVyIiwic2V0IiwidGFyZ2V0Iiwia2V5Iiwib2xkIiwiZW1pdCIsIkVWRU5UX01PREVMX1BST1BfQ0hBTkdFIiwibW9kZWwiLCJkZWxldGVQcm9wZXJ0eSIsImRlbGV0ZWQiLCJFVkVOVF9NT0RFTF9QUk9QX0RFTEVURSIsImRlZmluZVByb3BlcnR5IiwiaGFzTGlzdGVuZXJzIiwibGlzdGVuZXJDb3VudCIsIkVWRU5UX01PREVMX1dJTExfQkVfU0VUIiwiRVZFTlRfTU9ERUxfSEFTX0JFRU5fU0VUIiwic2VwYXJhdGVCeVR5cGUiLCJyb290IiwiXyIsInJlc29sdmVycyIsIm11dGF0b3JzIiwic3Vic2NyaXB0b3JzIiwiY29udmVydCIsImYiLCJpc0ZhY3RvcnlDbGFzcyIsImMiLCJyZWR1Y2UiLCJwIiwibWFwIiwiUkVTT0xWRVJTIiwiUXVlcnkiLCJNVVRBVE9SUyIsIk11dGF0aW9uIiwiU3Vic2NyaXB0aW9uIiwiR3JhcGhRTE9iamVjdFR5cGUiLCJtb2R1bGUiLCJsYXN0UmVzdWx0Iiwic3RvcmFnZSIsIkV2ZW50RW1pdHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FB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cUM7QUFFNUU7Ozs7Ozs7Ozs7Ozs7Ozt3QkFZcUM7QUFBRSxhQUFPLDRCQUFQO0FBQXFDO0FBRTVFOzs7Ozs7Ozs7Ozs7O3dCQVV1QjtBQUFFLGFBQU8sT0FBUDtBQUFnQjtBQUV6Qzs7Ozs7Ozs7Ozs7Ozt3QkFVd0I7QUFBRSxhQUFPLFFBQVA7QUFBaUI7QUFFM0M7Ozs7Ozs7Ozs7Ozs7O3dCQVd1QjtBQUFFLGFBQU8sT0FBUDtBQUFnQjtBQUV6Qzs7Ozs7Ozs7Ozs7Ozt3QkFVeUI7QUFBRSxhQUFPLFNBQVA7QUFBa0I7QUFFN0M7Ozs7Ozs7Ozs7Ozs7O3dCQVcwQjtBQUFFLGFBQU8sVUFBUDtBQUFtQjtBQUUvQzs7Ozs7Ozs7Ozs7Ozs7d0JBVzBCO0FBQUUsYUFBTyxVQUFQO0FBQW1CO0FBRS9DOzs7Ozs7Ozs7Ozs7O3dCQVUyQjtBQUFFLGFBQU8sVUFBUDtBQUFtQjtBQUVoRDs7Ozs7Ozs7Ozs7Ozs7d0JBVzhCO0FBQUUsYUFBTyxjQUFQO0FBQXVCO0FBRXZEOzs7Ozs7Ozs7Ozs7O3dCQVUrQjtBQUFFLGFBQU8sZUFBUDtBQUF3QjtBQUV6RDs7Ozs7Ozs7Ozs7Ozs7d0JBV2lDO0FBQUUsYUFBT1csZ0JBQVA7QUFBa0I7O1NBK0Z6Qy9CLFE7d0JBQVk7QUFDdEIsVUFBSTBILE9BQU8sR0FBRyxLQUFLdkksTUFBTSxDQUFDQyxHQUFQLENBQVcsS0FBS2dDLElBQWhCLENBQUwsQ0FBZDs7QUFFQSxVQUFJLENBQUNzRyxPQUFMLEVBQWM7QUFDWkEsUUFBQUEsT0FBTyxHQUFJLEtBQUt2SSxNQUFNLENBQUNDLEdBQVAsQ0FBVyxLQUFLZ0MsSUFBaEIsQ0FBTCxJQUE4QixFQUF6QztBQUNEOztBQUVELGFBQU9zRyxPQUFQO0FBQ0Q7OztFQTlxQzBCQyxlOzs7ZUFpckNkdEgsTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAbmFtZXNwYWNlIEdRTEJhc2VFbnYgKi9cbi8vIEBmbG93XG5cbmltcG9ydCBQYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5cbmltcG9ydCB7IERlZmVycmVkLCBqb2luTGluZXMgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IHsgdHlwZU9mIH0gZnJvbSAnbmUtdHlwZXMnXG5pbXBvcnQgeyBTeW50YXhUcmVlIH0gZnJvbSAnLi9TeW50YXhUcmVlJ1xuaW1wb3J0IHsgUHJvcGVydGllcyB9IGZyb20gJy4vZGVjb3JhdG9ycy9Nb2RlbFByb3BlcnRpZXMnXG5pbXBvcnQgeyBHcmFwaFFMT2JqZWN0VHlwZSwgR3JhcGhRTEVudW1UeXBlIH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCB7IElETEZpbGVIYW5kbGVyIH0gZnJvbSAnLi9JRExGaWxlSGFuZGxlcidcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHsgTGF0dGljZUxvZ3MgYXMgbGwgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IHsgZGVkZW50IH0gZnJvbSAnbmUtdGFnLWZucydcblxuaW1wb3J0IEFzeW5jRnVuY3Rpb25FeGVjdXRpb25FcnJvciBmcm9tICcuL2Vycm9ycy9Bc3luY0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3InXG5pbXBvcnQgRnVuY3Rpb25FeGVjdXRpb25FcnJvciBmcm9tICcuL2Vycm9ycy9GdW5jdGlvbkV4ZWN1dGlvbkVycm9yJ1xuaW1wb3J0IEF3YWl0aW5nUHJvbWlzZUVycm9yIGZyb20gJy4vZXJyb3JzL0F3YWl0aW5nUHJvbWlzZUVycm9yJ1xuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cydcblxuLyogSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gdG8gZGV0ZWN0IHRoZSBleGlzdGVuY2Ugb2YgcHJveGllcy4gV2hlbiBwcmVzZW50XG4gKiBhZGRpdGlvbmFsIGZ1bmN0aW9uYWxpdHkgaXMgZW5hYmxlZC4gUHJveGllcyBhcmUgbmF0aXZlIGluIE5vZGUgPj0gNiAqL1xuY29uc3QgaGFzUHJveHkgPSB0eXBlb2YgZ2xvYmFsLlByb3h5ICE9PSAndW5kZWZpbmVkJztcblxuLyogSW50ZXJuYWwgU3ltYm9sIHJlZmVycmluZyB0byByZWFsIGFjY2Vzc29yIHRvIEdRTEJhc2UgbW9kZWwgb2JqZWN0ICovXG5jb25zdCBfTU9ERUxfS0VZID0gU3ltYm9sLmZvcignZGF0YS1tb2RlbC1jb250ZW50cy12YWx1ZScpO1xuXG4vKiBJbnRlcm5hbCBTeW1ib2wgcmVmZXJyaW5nIHRvIHRoZSBzdGF0aWMgb2JqZWN0IGNvbnRhaW5pbmcgYSBwcm94eSBoYW5kbGVyICovXG5jb25zdCBfUFJPWFlfSEFORExFUiA9IFN5bWJvbC5mb3IoJ2ludGVybmFsLWJhc2UtcHJveHktaGFuZGxlcicpXG5cbi8qKlxuICogU2ltcGxlIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIGEgc3VwcGxpZWQga2V5IG1hdGNoZXMgYSBzdHJpbmcgb2YgeW91clxuICogY2hvb3NpbmcgYW5kIHRoYXQgc3RyaW5nIGlzIG5vdCBhIGRlZmluZWQgcHJvcGVydHkgb24gdGhlIGluc3RhbmNlXG4gKiBwYXNzZWQgdG8gdGhlIGNoZWNrLlxuICpcbiAqIEBtZXRob2QgR1FMQmFzZUVudn5ub3REZWZpbmVkXG4gKiBAbWVtYmVyb2YgR1FMQmFzZUVudlxuICogQHNpbmNlIDIuNS4wXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleVRvVGVzdCBhIFN0cmluZyBkZW5vdGluZyB0aGUgcHJvcGVydHkgeW91IHdpc2ggdG8gdGVzdFxuICogQHBhcmFtIHttaXhlZH0ga2V5U3VwcGxpZWQgYSB2YWx1ZSwgY29lcmNlZCBgdG9TdHJpbmcoKWAsIHRvIGNvbXBhcmUgdG9cbiAqIGBrZXlUb1Rlc3RgXG4gKiBAcGFyYW0ge21peGVkfSBpbnN0YW5jZSBhbiBvYmplY3QgaW5zdGFuY2UgdG8gY2hlY2sgYGhhc093blByb3BlcnR5YCBvbiBmb3JcbiAqIHRoZSBga2V5VG9UZXN0YCBzdXBwbGllZC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHByb3BlcnR5IG1hdGNoZXMgdGhlIHN1cHBsaWVkIGtleSBhbmQgdGhhdFxuICogcHJvcGVydHkgaXMgbm90IGFuIG93bmVkUHJvcGVydHkgb2YgdGhlIGluc3RhbmNlIHN1cHBsaWVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm90RGVmaW5lZChcbiAga2V5VG9UZXN0OiBzdHJpbmcsXG4gIGtleVN1cHBsaWVkOiBPYmplY3QgfCBzdHJpbmcsXG4gIGluc3RhbmNlOiBPYmplY3Rcbikge1xuICByZXR1cm4gKFxuICAgIG5ldyBSZWdFeHAoXCJeXCIgKyBrZXlUb1Rlc3QgKyBcIiRcIikudGVzdChrZXlTdXBwbGllZC50b1N0cmluZygpKVxuICAgICYmICFpbnN0YW5jZS5oYXNPd25Qcm9wZXJ0eShrZXlUb1Rlc3QpXG4gICk7XG59XG5cbi8qKlxuICogQSBgU3ltYm9sYCB1c2VkIGFzIGEga2V5IHRvIHN0b3JlIHRoZSBiYWNraW5nIG1vZGVsIGRhdGEuIERlc2lnbmVkIGFzIGFcbiAqIHdheSB0byBzZXBhcmF0ZSBtb2RlbCBkYXRhIGFuZCBHcmFwaFFMIHByb3BlcnR5IGFjY2Vzc29ycyBpbnRvIGxvZ2ljYWwgYml0cy5cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICogQG1lbWJlcm9mIEdRTEJhc2VFbnZcbiAqIEBjb25zdFxuICovXG5leHBvcnQgY29uc3QgTU9ERUxfS0VZID0gU3ltYm9sLmZvcignZGF0YS1tb2RlbC1jb250ZW50cy1rZXknKTtcblxuLyoqXG4gKiBBIGBTeW1ib2xgIHVzZWQgYXMgYSBrZXkgdG8gc3RvcmUgdGhlIHJlcXVlc3QgZGF0YSBmb3IgYW4gaW5zdGFuY2Ugb2YgdGhlXG4gKiBHUUxCYXNlIG9iamVjdCBpbiBxdWVzdGlvbi5cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICogQGNvbnN0XG4gKiBAaW5uZXJcbiAqIEBtZW1iZXJvZiBHUUxCYXNlRW52XG4gKi9cbmV4cG9ydCBjb25zdCBSRVFfREFUQV9LRVkgPSBTeW1ib2wuZm9yKCdyZXF1ZXN0LWRhdGEtb2JqZWN0LWtleScpO1xuXG4vKipcbiAqIEEgbmFtZWxlc3MgU3ltYm9sIGZvciB1c2UgYXMgYSBrZXkgdG8gdGhlIGludGVybmFsIGRlY29yYXRvciBzdG9yYWdlXG4gKlxuICogQHR5cGUge1N5bWJvbH1cbiAqIEBjb25zdFxuICogQGlubmVyXG4gKiBAbWVtYmVyb2YgR1FMQmFzZUVudlxuICovXG5leHBvcnQgY29uc3QgTUVUQV9LRVkgPSBTeW1ib2woKTtcblxuLyoqXG4gKiBBIFN5bWJvbCB1c2VkIHRvIGlkZW50aWZ5IGNhbGxzIHRvIEBQcm9wZXJ0aWVzIGZvciBwcm9wZXJ0aWVzIGdlbmVyYXRlZFxuICogYXV0b21hdGljYWxseSB1cG9uIGluc3RhbmNlIGNyZWF0aW9uLlxuICpcbiAqIEB0eXBlIHtTeW1ib2x9XG4gKiBAY29uc3RcbiAqIEBpbm5lclxuICogQG1lbWJlck9mIEdRTEJhc2VFbnZcbiAqL1xuZXhwb3J0IGNvbnN0IEFVVE9fUFJPUFMgPSBTeW1ib2wuZm9yKCdhdXRvLXByb3BzJylcblxuLyoqXG4gKiBBIFN5bWJvbCB1c2VkIHRvIGlkZW50aWZ5IGNhbGxzIHRvIEBHZXR0ZXJzIGZvciBwcm9wZXJ0aWVzIGdlbmVyYXRlZFxuICogdmlhIGRlY29yYXRvci4gVGhlc2UgYXJlIHN0b3JlZCBpbiA8Y2xhc3M+W01FVEFfS0VZXVtHRVRURVJTXVxuICpcbiAqIEB0eXBlIHtTeW1ib2x9XG4gKiBAY29uc3RcbiAqIEBpbm5lclxuICogQG1lbWJlck9mIEdRTEJhc2VFbnZcbiAqL1xuZXhwb3J0IGNvbnN0IEdFVFRFUlMgPSBTeW1ib2wuZm9yKCdnZXR0ZXJzJylcblxuLyoqXG4gKiBBIFN5bWJvbCB1c2VkIHRvIGlkZW50aWZ5IGNhbGxzIHRvIEBTZXR0ZXJzIGZvciBwcm9wZXJ0aWVzIGdlbmVyYXRlZFxuICogdmlhIGRlY29yYXRvci4gVGhlc2UgYXJlIHN0b3JlZCBpbiA8Y2xhc3M+W01FVEFfS0VZXVtTRVRURVJTXVxuICpcbiAqIEB0eXBlIHtTeW1ib2x9XG4gKiBAY29uc3RcbiAqIEBpbm5lclxuICogQG1lbWJlck9mIEdRTEJhc2VFbnZcbiAqL1xuZXhwb3J0IGNvbnN0IFNFVFRFUlMgPSBTeW1ib2wuZm9yKCdzZXR0ZXJzJylcblxuLyoqXG4gKiBBIFN5bWJvbCB1c2VkIHRvIGlkZW50aWZ5IGNhbGxzIHRvIEBQcm9wZXJ0aWVzIGZvciBwcm9wZXJ0aWVzIGdlbmVyYXRlZFxuICogdmlhIGRlY29yYXRvci4gVGhlc2UgYXJlIHN0b3JlZCBpbiA8Y2xhc3M+W01FVEFfS0VZXVtQUk9QU11cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICogQGNvbnN0XG4gKiBAaW5uZXJcbiAqIEBtZW1iZXJPZiBHUUxCYXNlRW52XG4gKi9cbmV4cG9ydCBjb25zdCBQUk9QUyA9IFN5bWJvbC5mb3IoJ3Byb3BzJylcblxuLyoqXG4gKiBBbGwgR3JhcGhRTCBUeXBlIG9iamVjdHMgdXNlZCBpbiB0aGlzIHN5c3RlbSBhcmUgYXNzdW1lZCB0byBoYXZlIGV4dGVuZGVkXG4gKiBmcm9tIHRoaXMgY2xhc3MuIEFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgY2FuIGJlIHVzZWQgdG8gd3JhcCBhbiBleGlzdGluZ1xuICogc3RydWN0dXJlIGlmIHlvdSBoYXZlIG9uZS5cbiAqXG4gKiBAY2xhc3MgR1FMQmFzZVxuICovXG5leHBvcnQgY2xhc3MgR1FMQmFzZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGZpbGVIYW5kbGVyOiA/SURMRmlsZUhhbmRsZXI7XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgZGF0YSBpcyBwYXNzZWQgdG8gdGhpcyBvYmplY3Qgd2hlbiBjb25zdHJ1Y3RlZC4gVHlwaWNhbGx5IHRoZXNlXG4gICAqIG9iamVjdHMsIGFuZCB0aGVpciBjaGlsZHJlbiwgYXJlIGluc3RhbnRpYXRlZCBieSBpdHMgb3duIHN0YXRpYyBNVVRBVE9SU1xuICAgKiBhbmQgUkVTT0xWRVJTLiBUaGV5IHNob3VsZCBjb250YWluIHJlcXVlc3Qgc3BlY2lmaWMgc3RhdGUgaWYgYW55IGlzIHRvXG4gICAqIGJlIHNoYXJlZC5cbiAgICpcbiAgICogVGhlc2UgY2FuIGJlIGNvbnNpZGVyZWQgcmVxdWVzdCBzcGVjaWZpYyBjb250cm9sbGVycyBmb3IgdGhlIG9iamVjdCBpblxuICAgKiBxdWVzdGlvbi4gVGhlIGJhc2UgY2xhc3MgdGFrZXMgYSBzaW5nbGUgb2JqZWN0IHdoaWNoIHNob3VsZCBjb250YWluIGFsbFxuICAgKiB0aGUgSFRUUC9TIHJlcXVlc3QgZGF0YSBhbmQgdGhlIGdyYXBoUUxQYXJhbXMgaXMgcHJvdmlkZWQgYXMgdGhlIG9iamVjdFxuICAgKiB7IHF1ZXJ5LCB2YXJpYWJsZXMsIG9wZXJhdGlvbk5hbWUsIHJhdyB9LlxuICAgKlxuICAgKiBXaGVuIHVzZWQgd2l0aCBleHByZXNzLWdyYXBocWwsIHRoZSByZXF1ZXN0RGF0YSBvYmplY3QgaGFzIHRoZSBmb3JtYXRcbiAgICogeyByZXEsIHJlcywgZ3FsIH0gd2hlcmVcbiAgICogICDigKIgcmVxIGlzIGFuIEV4cHJlc3MgNC54IHJlcXVlc3Qgb2JqZWN0XG4gICAqICAg4oCiIHJlcyBpcyBhbiBFeHByZXNzIDQueCByZXNwb25zZSBvYmplY3RcbiAgICogICDigKIgZ3FsIGlzIHRoZSBncmFwaFFMUGFyYW1zIG9iamVjdCBpbiB0aGUgZm9ybWF0IG9mXG4gICAqICAgICB7IHF1ZXJ5LCB2YXJpYWJsZXMsIG9wZXJhdGlvbk5hbWUsIHJhdyB9XG4gICAqICAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2dyYXBocWwvZXhwcmVzcy1ncmFwaHFsIGZvciBtb3JlIGluZm9cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDijobioIBjb25zdHJ1Y3RvclxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHttaXhlZH0gbW9kZWxEYXRhIHRoaXMsIHR5cGljYWxseSBhbiBvYmplY3QsIGFsdGhvdWdoIGFueXRoaW5nXG4gICAqIHJlYWxseSBpcyBzdXBwb3J0ZWQsIHJlcHJlc2VudHMgdGhlIG1vZGVsIGRhdGEgZm9yIG91ciBHcmFwaFFMIG9iamVjdFxuICAgKiBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3REYXRhIHNlZSBkZXNjcmlwdGlvbiBhYm92ZVxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgbW9kZWxEYXRhOiBPYmplY3QgPSB7fSxcbiAgICByZXF1ZXN0RGF0YTogP09iamVjdCA9IG51bGwsXG4gICAgb3B0aW9uczogT2JqZWN0ID0geyBhdXRvUHJvcHM6IHRydWUgfVxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgY29uc3QgQ2xhc3MgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgIGNvbnN0IHRyZWUgPSBTeW50YXhUcmVlLmZyb20oQ2xhc3MuU0NIRU1BKTtcbiAgICBjb25zdCBvdXRsaW5lID0gdHJlZSAmJiB0cmVlLm91dGxpbmUgfHwgbnVsbDtcblxuICAgIGlmICghb3V0bGluZSkge1xuICAgICAgdGhyb3cgbmV3IEZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IoXG4gICAgICAgIG5ldyBFcnJvcihkZWRlbnRgXG4gICAgICAgICAgVGhlIFNETCBpcyB1bnBhcnNhYmxlLiBQbGVhc2UgY2hlY2sgeW91ciBTQ0hFTUEgYW5kIG1ha2Ugc3VyZVxuICAgICAgICAgIGl0IGlzIHZhbGlkIEdyYXBoUUwgU0RML0lETC4gWW91ciBTQ0hFTUEgaXMgZGVmaW5lZCBhczpcblxuICAgICAgICAgICR7dGhpcy5TQ0hFTUF9XG4gICAgICAgIGApXG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKG91dGxpbmUgJiYgIShDbGFzcy5uYW1lIGluIG91dGxpbmUpKSB7XG4gICAgICB0aHJvdyBuZXcgRnVuY3Rpb25FeGVjdXRpb25FcnJvcihcbiAgICAgICAgbmV3IEVycm9yKGRlZGVudGBcbiAgICAgICAgICBUaGUgY2xhc3MgbmFtZSBcIiR7Q2xhc3MubmFtZX1cIiBkb2VzIG5vdCBtYXRjaCBhbnkgb2YgdGhlIHR5cGVzLFxuICAgICAgICAgIGVudW1zLCBzY2FsYXJzLCB1bmlvbnMgb3IgaW50ZXJmYWNlcyBkZWZpbmVkIGluIHRoZSBTQ0hFTUEgZm9yXG4gICAgICAgICAgdGhpcyBjbGFzcyAoJHtPYmplY3Qua2V5cyhvdXRsaW5lKX0pLlxuXG4gICAgICAgICAgXFx4MWJbMW1JbiBtb3N0IGNsYXNlcyB0aGlzIGlzIGJlY2F1c2UgeW91ciBjbGFzcyBuYW1lIGFuZCBTQ0hFTUFcbiAgICAgICAgICB0eXBlIGRvIG5vdCBtYXRjaC5cXHgxYlswbVxuICAgICAgICBgKVxuICAgICAgKVxuICAgIH1cblxuICAgIEdRTEJhc2Uuc2V0dXBNb2RlbCh0aGlzKTtcbiAgICB0aGlzLnNldE1vZGVsKG1vZGVsRGF0YSk7XG4gICAgdGhpcy5yZXF1ZXN0RGF0YSA9IHJlcXVlc3REYXRhIHx8IHt9O1xuICAgIHRoaXMuZmlsZUhhbmRsZXIgPSBuZXcgSURMRmlsZUhhbmRsZXIodGhpcy5jb25zdHJ1Y3Rvcik7XG5cbiAgICBpZiAob3B0aW9ucyAmJiAhIW9wdGlvbnMuYXV0b1Byb3BzICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5hcHBseUF1dG9Qcm9wcygpXG4gICAgfVxuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIHJldHVybiBoYXNQcm94eSA/IG5ldyBQcm94eSh0aGlzLCBHUUxCYXNlW19QUk9YWV9IQU5ETEVSXSkgOiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNpbmNlIHJlYWRpbmcgdGhlIFNjaGVtYSBmb3IgYSBnaXZlbiBHcmFwaFFMIExhdHRpY2UgdHlwZSBvclxuICAgKiBpbnRlcmZhY2UgaXMgc2ltcGxlIGVub3VnaCwgd2Ugc2hvdWxkIGJlIGFibGUgdG8gYXV0b21hdGljYWxseVxuICAgKiBhcHBseSBvbmUgdG8gb25lIEdyYXBoUUw6TW9kZWwgcHJvcGVydGllcy5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZXRob2Qg4oy+4qCAYXBwbHlBdXRvUHJvcHNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICovXG4gIGFwcGx5QXV0b1Byb3BzKCkge1xuICAgIGlmICghdGhpcy5jb25zdHJ1Y3Rvci5TQ0hFTUEgfHwgIXRoaXMuY29uc3RydWN0b3IuU0NIRU1BLmxlbmd0aCkge1xuICAgICAgbGwud2Fybihqb2luTGluZXNgXG4gICAgICAgIFRoZXJlIGlzIG5vIFNDSEVNQSBmb3IgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9ISEgVGhpcyB3aWxsIGxpa2VseVxuICAgICAgICBlbmQgaW4gYW4gZXJyb3IuIFByb2NlZWQgd2l0aCBjYXV0aW9uLiBTa2lwcGluZyBcXGBhcHBseUF1dG9Qcm9wc1xcYFxuICAgICAgYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIEluZGl2aWR1YWwgcHJvcGVydHkgZ2V0dGVycyBkbyBub3QgbmVlZCB0byBiZSBhdXRvLWNyZWF0ZWQgZm9yIGVudW1cbiAgICAvLyB0eXBlcy4gUG90ZW50aWFsbHkgZG8gc29tZSBjaGVja3MgZm9yIEludGVyZmFjZXMgYW5kIFVuaW9ucyBhcyB3ZWxsXG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3IuR1FMX1RZUEUgPT09IEdyYXBoUUxFbnVtVHlwZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IENsYXNzID0gdGhpcy5jb25zdHJ1Y3RvclxuICAgIGxldCB0cmVlID0gU3ludGF4VHJlZS5mcm9tKENsYXNzLlNDSEVNQSlcbiAgICBsZXQgb3V0bGluZSA9IHRyZWUgPyB0cmVlLm91dGxpbmUgOiB7fVxuICAgIGxldCBwcm9wcyA9IFtdXG5cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgZm9yIChsZXQgcHJvcE5hbWUgb2YgT2JqZWN0LmtleXMob3V0bGluZVtDbGFzcy5uYW1lXSkpIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGxldCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihDbGFzcy5wcm90b3R5cGUsIHByb3BOYW1lKVxuICAgICAgbGV0IGhhc0N1c3RvbUltcGwgPSAhIShcbiAgICAgICAgLy8gV2UgaGF2ZSBhIGRlc2NyaXB0b3IgZm9yIHRoZSBwcm9wZXJ0eSBuYW1lXG4gICAgICAgIGRlc2MgJiYgKFxuICAgICAgICAgIC8vIFdlIGhhdmUgYSBnZXR0ZXIgZnVuY3Rpb24gZGVmaW5lZFxuICAgICAgICAgIHR5cGVvZiBkZXNjLmdldCAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICB8fFxuICAgICAgICAgIC8vIC4uLm9yIHdlIGhhdmUgYSBmdW5jdGlvbiwgYXN5bmMgb3Igbm90LCBkZWZpbmVkXG4gICAgICAgICAgdHlwZW9mIGRlc2MudmFsdWUgPT09ICdmdW5jdGlvbidcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgICAvLyBPbmx5IGNyZWF0ZSBhdXRvLXByb3BzIGZvciBub24gY3VzdG9tIGltcGxlbWVudGF0aW9uc1xuICAgICAgaWYgKCFoYXNDdXN0b21JbXBsKSB7XG4gICAgICAgIHByb3BzLnB1c2gocHJvcE5hbWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmxlbmd0aCkge1xuICAgICAgbGwuaW5mbyhgQ3JlYXRpbmcgYXV0by1wcm9wcyBmb3IgWyR7Q2xhc3MubmFtZX1dOiBgLCBwcm9wcylcbiAgICAgIHRyeSB7XG4gICAgICAgIFByb3BlcnRpZXMoLi4ucHJvcHMpKENsYXNzLCBbQVVUT19QUk9QU10pXG4gICAgICB9XG4gICAgICBjYXRjaChlcnJvcikge1xuICAgICAgICBsZXQgcGFyc2VkID0gL0Nhbm5vdCByZWRlZmluZSBwcm9wZXJ0eTogKFxcdyspLy5leGVjKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIGlmIChwYXJzZWQpIHtcbiAgICAgICAgICBsbC53YXJuKGBTa2lwcGluZyBhdXRvLXByb3AgJyR7Q2xhc3MubmFtZX0uJHtwYXJzZWRbMV19J2ApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbGwuZXJyb3IoYEZhaWxlZCB0byBhcHBseSBhdXRvLXByb3BlcnRpZXNcXG5SZWFzb246IGApXG4gICAgICAgICAgbGwuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdGhlIGludGVybmFsbHkgc3RvcmVkIG1vZGVsIGRhdGEuIFRoZSBjb250ZW50cyBvZiB0aGlzXG4gICAqIG9iamVjdCBhcmUgYWJzdHJhY3RlZCBhd2F5IGJlaGluZCBhIGBTeW1ib2xgIGtleSB0byBwcmV2ZW50IGNvbGxpc2lvblxuICAgKiBiZXR3ZWVuIHRoZSB1bmRlcmx5aW5nIG1vZGVsIGFuZCBhbnkgR3JhcGhRTCBPYmplY3QgRGVmaW5pdGlvbiBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDijL7ioIBnZXRNb2RlbFxuICAgKiBAc2luY2UgMi41XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBhbnkgb2JqZWN0IHlvdSB3aXNoIHRvIHVzZSBhcyBhIGRhdGEgc3RvcmVcbiAgICovXG4gIGdldE1vZGVsKCkge1xuICAgIC8vIEBDb21wdXRlZFR5cGVcbiAgICByZXR1cm4gdGhpc1tNT0RFTF9LRVldO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgdGhlIGludGVybmFsbHkgc3RvcmVkIG1vZGVsIGRhdGEuIFRoZSBjb250ZW50cyBvZiB0aGlzXG4gICAqIG9iamVjdCBhcmUgYWJzdHJhY3RlZCBhd2F5IGJlaGluZCBhIGBTeW1ib2xgIGtleSB0byBwcmV2ZW50IGNvbGxpc2lvblxuICAgKiBiZXR3ZWVuIHRoZSB1bmRlcmx5aW5nIG1vZGVsIGFuZCBhbnkgR3JhcGhRTCBPYmplY3QgRGVmaW5pdGlvbiBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDijL7ioIBzZXRNb2RlbFxuICAgKiBAc2luY2UgMi41XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBhbnkgb2JqZWN0IHlvdSB3aXNoIHRvIHVzZSBhcyBhIGRhdGEgc3RvcmVcbiAgICovXG4gIHNldE1vZGVsKHZhbHVlOiBPYmplY3QpOiBHUUxCYXNlIHtcbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgdGhpc1tNT0RFTF9LRVldID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVXNlcyBgXy5tZXJnZSgpYCB0byBtb2RpZnkgdGhlIGludGVybmFsIGJhY2tpbmcgZGF0YSBzdG9yZSBmb3IgdGhlXG4gICAqIG9iamVjdCBpbnN0YW5jZS4gVGhpcyBpcyBhIHNob3J0Y3V0IGZvclxuICAgKiBgXy5tZXJnZSgpKGluc3RhbmNlW01PREVMX0tFWV0sIC4uLmV4dGVuc2lvbnMpYFxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDijL7ioIBleHRlbmRNb2RlbFxuICAgKiBAc2luY2UgMi41XG4gICAqXG4gICAqIEBwYXJhbSB7bWl4ZWR9IGV4dGVuc2lvbnMgbi1udW1iZXIgb2YgdmFsaWQgYF8ubWVyZ2UoKWAgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtHUUxCYXNlfSB0aGlzIGlzIHJldHVybmVkXG4gICAqL1xuICBleHRlbmRNb2RlbCguLi5leHRlbnNpb25zOiBBcnJheTxtaXhlZD4pOiBHUUxCYXNlIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgbWVyZ2UodGhpc1tNT0RFTF9LRVldLCAuLi5leHRlbnNpb25zKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGdldHRlciB0aGF0IHJldHJpZXZlcyB0aGUgaW5uZXIgcmVxdWVzdCBkYXRhIG9iamVjdC4gV2hlbiB1c2VkIHdpdGhcbiAgICogR1FMRXhwcmVzc01pZGRsZXdhcmUsIHRoaXMgaXMgYW4gb2JqZWN0IG1hdGNoaW5nIHtyZXEsIHJlcywgZ3FsfS5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAcmVxdWVzdERhdGFcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBhbiBvYmplY3QsIHVzdWFsbHkgbWF0Y2hpbmcgeyByZXEsIHJlcywgZ3FsIH1cbiAgICovXG4gIGdldCByZXF1ZXN0RGF0YSgpOiBPYmplY3QgfCBudWxsIHtcbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgcmV0dXJuIHRoaXNbUkVRX0RBVEFfS0VZXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNldHRlciB0aGF0IGFzc2lnbnMgYSB2YWx1ZSB0byB0aGUgaW5uZXIgcmVxdWVzdCBkYXRhIG9iamVjdC4gV2hlblxuICAgKiB1c2VkIHdpdGggR1FMRXhwcmVzc01pZGRsZXdhcmUsIHRoaXMgaXMgYW4gb2JqZWN0IG1hdGNoaW5nIHtyZXEsIHJlcywgZ3FsfS5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyG77iO4qCAcmVxdWVzdERhdGFcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIGFuIG9iamVjdCwgdXN1YWxseSBtYXRjaGluZyB7IHJlcSwgcmVzLCBncWwgfVxuICAgKi9cbiAgc2V0IHJlcXVlc3REYXRhKHZhbHVlOiBPYmplY3QpOiB2b2lkIHtcbiAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgdGhpc1tSRVFfREFUQV9LRVldID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYGNvbnN0cnVjdG9yYCBuYW1lLiBJZiBpbnZva2VkIGFzIHRoZSBjb250ZXh0LCBvciBgdGhpc2AsXG4gICAqIG9iamVjdCBvZiB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYE9iamVjdGAncyBgcHJvdG90eXBlYCwgdGhlIHJlc3VsdGluZ1xuICAgKiB2YWx1ZSB3aWxsIGJlIGBbb2JqZWN0IE15Q2xhc3NdYCwgZ2l2ZW4gYW4gaW5zdGFuY2Ugb2YgYE15Q2xhc3NgXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAW1N5bWJvbC50b1N0cmluZ1RhZ11cbiAgICogQG1lbWJlcm9mIE1vZHVsZVBhcnNlclxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0aGlzIGlzIGFuIGluc3RhbmNlIG9mXG4gICAqIEBDb21wdXRlZFR5cGVcbiAgICovXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHsgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSB9XG5cbiAgLyoqXG4gICAqIFByb3BlcnRpZXMgZGVmaW5lZCBmb3IgR3JhcGhRTCB0eXBlcyBpbiBMYXR0aWNlIGNhbiBiZSBkZWZpbmVkIGFzXG4gICAqIGEgZ2V0dGVyLCBhIGZ1bmN0aW9uIG9yIGFuIGFzeW5jIGZ1bmN0aW9uLiBJbiB0aGUgY2FzZSBvZiBzdGFuZGFyZFxuICAgKiBmdW5jdGlvbnMsIGlmIHRoZXkgcmV0dXJuIGEgcHJvbWlzZSB0aGV5IHdpbGwgYmUgaGFuZGxlZCBhcyB0aG91Z2hcbiAgICogdGhleSB3ZXJlIGFzeW5jXG4gICAqXG4gICAqIEdpdmVuIHRoZSB2YXJpZXR5IG9mIHRoaW5ncyBhIEdyYXBoUUwgdHlwZSBjYW4gYWN0dWFsbHkgYmUsIG9idGFpbmluZ1xuICAgKiBpdHMgdmFsdWUgY2FuIGFubm95aW5nLiBUaGlzIG1ldGhvZCB0ZW5kcyB0byBsZXNzZW4gdGhhdCBib2lsZXJwbGF0ZS5cbiAgICogRXJyb3JzIHJhaXNlZCB3aWxsIGJlIHRocm93bi5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4oy+4qCAZ2V0UHJvcFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xTeW1ib2x9IHByb3BOYW1lIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBpbiBxdWVzdGlvblxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJpbmRHZXR0ZXJzIHRydWUsIGJ5IGRlZmF1bHQsIGlmIHRoZSBgZ2V0YCBvclxuICAgKiBgaW5pdGlhbGl6ZXJgIGRlc2NyaXB0b3IgdmFsdWVzIHNob3VsZCBiZSBib3VuZCB0byB0aGUgY3VycmVudCBpbnN0YW5jZVxuICAgKiBvciBhbiBvYmplY3Qgb2YgdGhlIHByb2dyYW1tZXJzIGNob2ljZSBiZWZvcmUgcmV0dXJuaW5nXG4gICAqIEBwYXJhbSB7bWl4ZWR9IGJpbmRUbyB0aGUgYHRoaXNgIG9iamVjdCB0byB1c2UgZm9yIGJpbmRpbmcgd2hlblxuICAgKiBgYmluZEdldHRlcnNgIGlzIHNldCB0byB0cnVlLlxuICAgKiBAcmV0dXJuIHttaXhlZH0gdGhlIHZhbHVlIG9mIHRoZSBgcHJvcE5hbWVgIGFzIGEgRnVuY3Rpb24gb3Igc29tZXRoaW5nXG4gICAqIGVsc2Ugd2hlbiB0aGUgcmVxdWVzdGVkIHByb3BlcnR5IG5hbWUgZXhpc3RzXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBlcnJvcnMgcmFpc2VkIGluIGF3YWl0aW5nIHJlc3VsdHMgd2lsbCBiZSB0aHJvd25cbiAgICovXG4gIGdldFByb3AocHJvcE5hbWU6IHN0cmluZywgYmluZEdldHRlcnM6IGJvb2xlYW4gPSB0cnVlLCBiaW5kVG86IG1peGVkKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGxldCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKVxuICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgcHJvcE5hbWUpXG4gICAgbGV0IHJlc3VsdFxuXG4gICAgaWYgKCFkZXNjcmlwdG9yKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKGRlc2NyaXB0b3IuaW5pdGlhbGl6ZXIgfHwgZGVzY3JpcHRvci5nZXQpIHtcbiAgICAgICAgbGV0IHdoYXQgPSBkZXNjcmlwdG9yLmluaXRpYWxpemVyIHx8IGRlc2NyaXB0b3IuZ2V0XG5cbiAgICAgICAgaWYgKGJpbmRHZXR0ZXJzKSB7XG4gICAgICAgICAgcmVzdWx0ID0gd2hhdC5iaW5kKGJpbmRUbyB8fCB0aGlzKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IHdoYXRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZGVzY3JpcHRvci52YWx1ZSkge1xuICAgICAgICByZXN1bHQgPSBkZXNjcmlwdG9yLnZhbHVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgLyoqXG4gICAqIFByb3BlcnRpZXMgZGVmaW5lZCBmb3IgR3JhcGhRTCB0eXBlcyBpbiBMYXR0aWNlIGNhbiBiZSBkZWZpbmVkIGFzXG4gICAqIGEgZ2V0dGVyLCBhIGZ1bmN0aW9uIG9yIGFuIGFzeW5jIGZ1bmN0aW9uLiBJbiB0aGUgY2FzZSBvZiBzdGFuZGFyZFxuICAgKiBmdW5jdGlvbnMsIGlmIHRoZXkgcmV0dXJuIGEgcHJvbWlzZSB0aGV5IHdpbGwgYmUgaGFuZGxlZCBhcyB0aG91Z2hcbiAgICogdGhleSB3ZXJlIGFzeW5jLiBJbiBhZGRpdGlvbiB0byBmZXRjaGluZyB0aGUgcHJvcGVydHksIG9yIGZpZWxkXG4gICAqIHJlc29sdmVyLCBpdHMgcmVzdWx0aW5nIGZ1bmN0aW9uIG9yIGdldHRlciB3aWxsIGJlIGludm9rZWQuXG4gICAqXG4gICAqIEdpdmVuIHRoZSB2YXJpZXR5IG9mIHRoaW5ncyBhIEdyYXBoUUwgdHlwZSBjYW4gYWN0dWFsbHkgYmUsIG9idGFpbmluZ1xuICAgKiBpdHMgdmFsdWUgY2FuIGFubm95aW5nLiBUaGlzIG1ldGhvZCB0ZW5kcyB0byBsZXNzZW4gdGhhdCBib2lsZXJwbGF0ZS5cbiAgICogRXJyb3JzIHJhaXNlZCB3aWxsIGJlIHRocm93bi5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4oy+4qCAY2FsbFByb3BcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BOYW1lIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBpbiBxdWVzdGlvblxuICAgKiBAcGFyYW0ge0FycmF5PG1peGVkPn0gYXJncyB0aGUgYXJndW1lbnRzIGFycmF5IHRoYXQgd2lsbCBiZSBwYXNzZWRcbiAgICogdG8gYC5hcHBseSgpYCBzaG91bGQgdGhlIHByb3BlcnR5IGV2YWx1YXRlIHRvIGEgYGZ1bmN0aW9uYFxuICAgKiBAcmV0dXJuIHttaXhlZH0gdGhlIHJldHVybiB2YWx1ZSBvZiBhbnkgcmVzdWx0aW5nIGZ1bmN0aW9uIG9yXG4gICAqIHZhbHVlIHJldHVybmVkIGJ5IGEgZ2V0dGVyOyB3cmFwcGVkIGluIGEgcHJvbWlzZSBhcyBhbGwgYXN5bmNcbiAgICogZnVuY3Rpb25zIGRvLlxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gZXJyb3JzIHJhaXNlZCBpbiBhd2FpdGluZyByZXN1bHRzIHdpbGwgYmUgdGhyb3duXG4gICAqL1xuICBhc3luYyBjYWxsUHJvcChwcm9wTmFtZTogc3RyaW5nLCAuLi5hcmdzOiBBcnJheTxtaXhlZD4pIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgbGV0IHByb3AgPSB0aGlzLmdldFByb3AocHJvcE5hbWUsIC4uLmFyZ3MpO1xuICAgIGxldCByZXN1bHRcblxuICAgIGlmIChwcm9wICYmIHR5cGVPZihwcm9wKSA9PT0gJ0FzeW5jRnVuY3Rpb24nKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBhd2FpdCBwcm9wLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBBc3luY0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3IoZXJyb3IsIHByb3AsIGFyZ3MsIHJlc3VsdClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAocHJvcCAmJiB0eXBlT2YocHJvcCkgPT09IEZ1bmN0aW9uLm5hbWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IHByb3AuYXBwbHkodGhpcywgYXJncylcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRnVuY3Rpb25FeGVjdXRpb25FcnJvcihlcnJvciwgcHJvcCwgYXJncywgcmVzdWx0KVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZU9mKHJlc3VsdCkgPT09IFByb21pc2UubmFtZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IHJlc3VsdFxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHRocm93IG5ldyBBd2FpdGluZ1Byb21pc2VFcnJvcihlcnJvcikuc2V0UHJvbWlzZShyZXN1bHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICAvKipcbiAgICogQSBwYXNzLXRocnUgbWV0aG9kIHRvIHRoZSBzdGF0aWMgZnVuY3Rpb24gb2YgdGhlIHNhbWUgbmFtZS4gVGhlXG4gICAqIGRpZmZlcmVuY2UgYmVpbmcgdGhhdCBpZiBgcmVxdWVzdERhdGFgIGlzIG5vdCBzcGVjaWZpZWQsIHRoZVxuICAgKiBgcmVxdWVzdERhdGFgIG9iamVjdCBmcm9tIHRoaXMgaW5zdGFuY2Ugd2lsbCBiZSB1c2VkIHRvIGJ1aWxkIHRoZVxuICAgKiByZXNvbHZlcnMgaW4gcXVlc3Rpb24uXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWV0aG9kIOKMvuKggGdldFJlc29sdmVyXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXNvbHZlck5hbWUgdGhlIG5hbWUgb2YgdGhlIHJlc29sdmVyIGFzIGEgc3RyaW5nXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0RGF0YSB0aGUgcmVxdWVzdERhdGEgdXNlZCB0byBidWlsZCB0aGVcbiAgICogcmVzb2x2ZXIgbWV0aG9kcyBmcm9tIHdoaWNoIHRvIGNob29zZVxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gcmV0dXJucyBlaXRoZXIgYSBgZnVuY3Rpb25gIHJlcHJlc2VudGluZyB0aGVcbiAgICogcmVzb2x2ZXIgcmVxdWVzdGVkIG9yIG51bGwgaWYgdGhlcmUgd2Fzbid0IG9uZSB0byBiZSBmb3VuZFxuICAgKi9cbiAgYXN5bmMgZ2V0UmVzb2x2ZXIocmVzb2x2ZXJOYW1lOiBzdHJpbmcsIHJlcXVlc3REYXRhOiBPYmplY3QpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jb25zdHJ1Y3Rvci5nZXRSZXNvbHZlcihcbiAgICAgIHJlc29sdmVyTmFtZSxcbiAgICAgIHJlcXVlc3REYXRhIHx8IHRoaXMucmVxdWVzdERhdGFcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXJzIGFyZSBjcmVhdGVkIGluIGEgbnVtYmVyIG9mIGRpZmZlcmVudCB3YXlzLiBPT1AgZGVzaWduXG4gICAqIGRpY3RhdGVzIHRoYXQgaW5zdGFuY2VzIG9mIGEgY3JlYXRlZCBjbGFzcyB3aWxsIGhhbmRsZSBmaWVsZFxuICAgKiByZXNvbHZlcnMsIGJ1dCBxdWVyeSwgbXV0YXRpb24gYW5kIHN1YnNjcmlwdGlvbiByZXNvbHZlcnMgYXJlXG4gICAqIHR5cGljYWxseSB3aGF0IGNyZWF0ZXMgdGhlc2UgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBTaW5jZSBhIHJlc29sdmVyIGNhbiBiZSBjcmVhdGVkIHVzaW5nIGBAbXV0YXRvci9Ac3Vic2NyaXB0b3IvQHJlc29sdmVyYFxuICAgKiBvciB2aWEgbWV0aG9kIG9uIGEgb2JqZWN0IHJldHVybmVkIGZyb20gYFJFU09MVkVSUygpYCwgYE1VVEFUT1JTKClgIG9yXG4gICAqIGBTVUJTQ1JJUFRJT05TKClgLCB0aGVyZSBzaG91bGQgYmUgYW4gZWFzeSB0byB1c2Ugd2F5IHRvIGZldGNoIGFcbiAgICogcmVzb2x2ZXIgYnkgbmFtZTsgaWYgZm9yIG5vdGhpbmcgZWxzZSwgY29kZSByZXVzZS5cbiAgICpcbiAgICogUGFzcyB0aGUgbmFtZSBvZiB0aGUgcmVzb2x2ZXIgdG8gdGhlIGZ1bmN0aW9uIGFuZCBvcHRpb25hbGx5IHBhc3MgYVxuICAgKiByZXF1ZXN0RGF0YSBvYmplY3QuIFRoZSBgZ2V0TWVyZ2VkUm9vdCgpYCBtZXRob2Qgd2lsbCBidWlsZCBhbiBvYmplY3RcbiAgICogY29udGFpbmluZyBhbGwgdGhlIHJvb3QgcmVzb2x2ZXJzIGZvciB0aGUgdHlwZSwgYm91bmQgdG8gdGhlIHN1cHBsaWVkXG4gICAqIGByZXF1ZXN0RGF0YWAgb2JqZWN0LiBJdCBpcyBmcm9tIHRoaXMgb2JqZWN0IHRoYXQgYHJlc29sdmVyTmFtZWAgd2lsbFxuICAgKiBiZSB1c2VkIHRvIGZldGNoIHRoZSBmdW5jdGlvbiBpbiBxdWVzdGlvbi4gSWYgb25lIGV4aXN0cywgaXQgd2lsbCBiZVxuICAgKiByZXR1cm5lZCwgcmVhZHkgZm9yIHVzZS4gT3RoZXJ3aXNlLCBudWxsIHdpbGwgYmUgeW91ciBhbnN3ZXIuXG4gICAqXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1ldGhvZCDijL7ioIBnZXRSZXNvbHZlclxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzb2x2ZXJOYW1lIHRoZSBuYW1lIG9mIHRoZSByZXNvbHZlciBhcyBhIHN0cmluZ1xuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdERhdGEgdGhlIHJlcXVlc3REYXRhIHVzZWQgdG8gYnVpbGQgdGhlXG4gICAqIHJlc29sdmVyIG1ldGhvZHMgZnJvbSB3aGljaCB0byBjaG9vc2VcbiAgICogQHJldHVybiB7RnVuY3Rpb259IHJldHVybnMgZWl0aGVyIGEgYGZ1bmN0aW9uYCByZXByZXNlbnRpbmcgdGhlXG4gICAqIHJlc29sdmVyIHJlcXVlc3RlZCBvciBudWxsIGlmIHRoZXJlIHdhc24ndCBvbmUgdG8gYmUgZm91bmRcbiAgICovXG4gIHN0YXRpYyBhc3luYyBnZXRSZXNvbHZlcihyZXNvbHZlck5hbWU6IHN0cmluZywgcmVxdWVzdERhdGE6IE9iamVjdCkge1xuICAgIGNvbnN0IHJlcURhdGEgPSByZXF1ZXN0RGF0YSB8fCBudWxsXG4gICAgY29uc3Qgcm9vdE9iaiA9IGF3YWl0IHRoaXMuZ2V0TWVyZ2VkUm9vdChyZXFEYXRhKVxuXG4gICAgcmV0dXJuIHJvb3RPYmpbcmVzb2x2ZXJOYW1lXSB8fCBudWxsXG4gIH1cblxuICAvKipcbiAgICogVGhlIHN0YXRpYyB2ZXJzaW9uIG9mIGdldFByb3AgcmVhZHMgaW50byB0aGUgcHJvdG90eXBlIHRvIGZpbmQgdGhlIGZpZWxkXG4gICAqIHRoYXQgaXMgZGVzaXJlZC4gSWYgdGhlIGZpZWxkIGlzIGVpdGhlciBhIGdldHRlciBvciBhIGluaXRpYWxpemVyIChzZWVcbiAgICogY2xhc3MgcHJvcGVydGllcyBkZXNjcmlwdG9ycyksIHRoZW4gdGhlIG9wdGlvbiB0byBiaW5kIHRoYXQgdG8gZWl0aGVyIHRoZVxuICAgKiBwcm90b3R5cGUgb2JqZWN0IG9yIG9uZSBvZiB5b3VyIGNob29zaW5nIGlzIGF2YWlsYWJsZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDijL7ioIBnZXRQcm9wXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8U3ltYm9sfSBwcm9wTmFtZSBhIHN0cmluZyBvciBTeW1ib2wgZGVub3RpbmcgdGhlIG5hbWUgb2ZcbiAgICogdGhlIHByb3BlcnR5IG9yIGZpZWxkIHlvdSBkZXNpcmVcbiAgICogQHBhcmFtIHtib29sZWFufSBiaW5kR2V0dGVycyB0cnVlIGlmIGEgcmVzdWx0aW5nIGBnZXR0ZXJgIG9yIGBpbml0aWFsaXplcmBcbiAgICogc2hvdWxkIGJlIGJvdW5kIHRvIHRoZSBwcm90b3R5cGUgb3Igb3RoZXIgb2JqZWN0XG4gICAqIEBwYXJhbSB7bWl4ZWR9IGJpbmRUbyB0aGUgb2JqZWN0IHRvIHdoaWNoIHRvIGJpbmQgdGhlIGBnZXR0ZXJgIG9yXG4gICAqIGBpbml0aWFsaXplcmAgZnVuY3Rpb25zIHRvIGlmIG90aGVyIHRoYW4gdGhlIGNsYXNzIHByb3RvdHlwZS5cbiAgICogQHJldHVybiB7bWl4ZWR9IGEgYEZ1bmN0aW9uYCBvciBvdGhlciBtaXhlZCB2YWx1ZSBtYWtpbmcgdXAgdGhlIHByb3BlcnR5XG4gICAqIG5hbWUgcmVxdWVzdGVkXG4gICAqL1xuICBzdGF0aWMgZ2V0UHJvcChcbiAgICBwcm9wTmFtZTogc3RyaW5nLFxuICAgIGJpbmRHZXR0ZXJzOiBib29sZWFuID0gZmFsc2UsXG4gICAgYmluZFRvOiBtaXhlZFxuICApIHtcbiAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcy5wcm90b3R5cGUsIHByb3BOYW1lKVxuXG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmdldCB8fCBkZXNjcmlwdG9yLmluaXRpYWxpemVyKSB7XG4gICAgICAgIGxldCB3aGF0ID0gZGVzY3JpcHRvci5pbml0aWFsaXplciB8fCBkZXNjcmlwdG9yLmdldFxuXG4gICAgICAgIGlmIChiaW5kR2V0dGVycykge1xuICAgICAgICAgIGJpbmRUbyA9IGJpbmRUbyB8fCB0aGlzLnByb3RvdHlwZVxuXG4gICAgICAgICAgcmV0dXJuIHdoYXQuYmluZChiaW5kVG8pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHdoYXRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVW50aWwgc3VjaCB0aW1lIGFzIHRoZSByZWZlcmVuY2UgaW1wbGVtZW50YXRpb24gb2YgRmFjZWJvb2sncyBHcmFwaFFMXG4gICAqIFNETCBBU1QgcGFyc2VyIHN1cHBvcnRzIGNvbW1lbnRzLCBvciB1bnRpbCB3ZSB0YWtlIGFkdmFudGFnZSBvZiBBcG9sbG8nc1xuICAgKiBBU1QgcGFyc2VyLCB0aGlzIGlzIGhvdyBjb21tZW50cyB3aWxsIGJlIGFwcGxpZWQgdG8gYSBidWlsdCBzY2hlbWEuXG4gICAqXG4gICAqIFNldmVyYWwgY29uc3RhbnRzIGFyZSBkZWZpbmVkIG9uIHRoZSBHUUxCYXNlIG9iamVjdCBpdHNlbGYsIGFuZCB0aGVyZWJ5XG4gICAqIGFsbCBpdHMgc3ViY2xhc3Nlcy4gVGhleSBwZXJ0YWluIHRvIGhvdyB0byBkZWZpbmUgZGVzY3JpcHRpb24gZmllbGRzXG4gICAqIGZvciB2YXJpb3VzIHBhcnRzIG9mIHlvdXIgR1FMIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBgYGBcbiAgICogLy8gVG8gZGVmaW5lIGEgZGVzY3JpcHRpb24gb24gdGhlIHRvcCBsZXZlbCBjbGFzc1xuICAgKiBbdGhpcy5ET0NfQ0xBU1NdOiBzdHJpbmdcbiAgICpcbiAgICogLy8gVG8gZGVmaW5lIGEgZGVzY3JpcHRpb24gb24gYSBmaWVsZCAoZ2V0dGVyLCBmdW5jdGlvbiBvciBhc3luYyBmdW5jdGlvbilcbiAgICogW3RoaXMuRE9DX0ZJRUxEU106IHtcbiAgICogICBmaWVsZE5hbWU6IHN0cmluZ1xuICAgKiB9XG4gICAqXG4gICAqIC8vIFRvIGRlZmluZSBhIGRlc2NyaXB0aW9uIG9uIGEgcXVlcnksIG11dGF0aW9uIG9yIHN1YnNjcmlwdGlvbiBmaWVsZFxuICAgKiBbdGhpcy5ET0NfUVVFUklFUyB8fCB0aGlzLkRPQ19NVVRBVE9SUyB8fCB0aGlzLkRPQ19TVUJTQ1JJUFRJT05TXToge1xuICAgKiAgIGZpZWxkTmFtZTogc3RyaW5nXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFRvIG1ha2Ugd3JpdGluZyBjb2RlIGVhc2llciwgdGhlIGBqb2luTGluZXMoKWAgdGVtcGxhdGUgZnVuY3Rpb24gaXNcbiAgICogYXZhaWxhYmxlIHNvIHlvdXIgc291cmNlIGNvZGUgY2FuIGxvb2sgbmljZSBhbmQgbmVhdCBhbmQgeW91ciBkZXNjcmlwdGlvbnNcbiAgICogd29uJ3QgZ2V0IGFubm95aW5nIGxpbmUgYnJlYWtzIGFuZCBzcGFjZXMgYXMgcGFydCBvZiB0aGF0IHByb2Nlc3MuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCBhcGlEb2NzXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gYW4gb2JqZWN0IHdpdGggdmFyaW91cyBrZXlzIGFuZCB2YWx1ZXMgZGVub3RpbmdcbiAgICogZGVzY3JpcHRpb24gZmllbGRzIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhlIGZpbmFsIHNjaGVtYSBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBhcGlEb2NzKCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLkRPQ19DTEFTU106IGpvaW5MaW5lc2BcbiAgICAgICAgR1FMQmFzZSBjbGFzcyBpbXBsZW1lbnRhdGlvbi4gR1FMQmFzZSBpcyB0aGUgcm9vdCBjbGFzcyB1c2VkIGluXG4gICAgICAgIGdyYXBocWwtbGF0dGljZSB0byBkZXNjcmliZSBhIEdyYXBoUUxPYmplY3RUeXBlLiBJZiB5b3UgYXJlIHJlYWRpbmdcbiAgICAgICAgdGhpcywgdGhlIHBlcnNvbiB1c2luZyBsYXR0aWNlIGZhaWxlZCB0byBwcm92aWRlIGRvY3VtZW50YXRpb24gZm9yXG4gICAgICAgIHRoZWlyIHR5cGUuIDopXG4gICAgICBgLFxuXG4gICAgICBbdGhpcy5ET0NfUVVFUlldOiBqb2luTGluZXNgXG4gICAgICAgICMjIFdlbGNvbWUgdG8gR3JhcGhRTCBMYXR0aWNlXG4gICAgICAgICoqUXVlcnkqKlxuXG4gICAgICAgIFlvdSB3aWxsIHdhbnQgdG8gZGVmaW5lIGEgXFxgRE9DX1FVRVJZXFxgIGFwaURvYyBjb21tZW50IHdpdGggc29tZXRoaW5nXG4gICAgICAgIG1vcmUgbWVhbmluZ2Z1bCB0byB5b3VyIHBhcnRpY3VsYXIgU2NoZW1hIGhlcmUuXG4gICAgICBgLFxuXG4gICAgICBbdGhpcy5ET0NfTVVUQVRJT05dOiBqb2luTGluZXNgXG4gICAgICAgICMjIFdlbGNvbWUgdG8gR3JhcGhRTCBMYXR0aWNlXG4gICAgICAgICoqTXV0YXRpb24qKlxuXG4gICAgICAgIFlvdSB3aWxsIHdhbnQgdG8gZGVmaW5lIGEgXFxgRE9DX01VVEFUSU9OXFxgIGFwaURvYyBjb21tZW50IHdpdGhcbiAgICAgICAgc29tZXRoaW5nIG1vcmUgbWVhbmluZ2Z1bCB0byB5b3VyIHBhcnRpY3VsYXIgU2NoZW1hIGhlcmUuXG4gICAgICBgLFxuXG4gICAgICBbdGhpcy5ET0NfU1VCU0NSSVBUSU9OXTogam9pbkxpbmVzYFxuICAgICAgICAjIyBXZWxjb21lIHRvIEdyYXBoUUwgTGF0dGljZVxuICAgICAgICAqKlN1YnNjcmlwdGlvbioqXG5cbiAgICAgICAgWW91IHdpbGwgd2FudCB0byBkZWZpbmUgYSBcXGBET0NfU1VCU0NSSVBUSU9OXFxgIGFwaURvYyBjb21tZW50IHdpdGhcbiAgICAgICAgc29tZXRoaW5nIG1vcmUgbWVhbmluZ2Z1bCB0byB5b3VyIHBhcnRpY3VsYXIgU2NoZW1hIGhlcmUuXG4gICAgICBgLFxuXG4gICAgICBbdGhpcy5ET0NfRklFTERTXToge1xuICAgICAgICAvLyBmaWVsZE5hbWU6IGBmaWVsZERlc2NyaXB0aW9uYCxcbiAgICAgIH0sXG5cbiAgICAgIFt0aGlzLkRPQ19RVUVSSUVTXToge1xuICAgICAgICAvLyBxdWVyeU5hbWU6IGBxdWVyeURlc2NyaXB0aW9uYCxcbiAgICAgIH0sXG5cbiAgICAgIFt0aGlzLkRPQ19NVVRBVE9SU106IHtcbiAgICAgICAgLy8gbXV0YXRvck5hbWU6IGBtdXRhdG9yRGVzY3JpcHRpb25gXG4gICAgICB9LFxuXG4gICAgICBbdGhpcy5ET0NfU1VCU0NSSVBUSU9OU106IHtcbiAgICAgICAgLy8gc3Vic2NyaXB0aW9uTmFtZTogYHN1YnNjcmlwdGlvbkRlc2NyaXB0aW9uYFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVkIGluIGEgYmFzZSBjbGFzcywgdGhpcyBnZXR0ZXIgc2hvdWxkIHJldHVybiBlaXRoZXIgYSBTdHJpbmdcbiAgICogZGV0YWlsaW5nIHRoZSBmdWxsIElETCBzY2hlbWEgb2YgYSBHcmFwaFFMIGhhbmRsZXIgb3Igb25lIG9mIHR3b1xuICAgKiB0eXBlcyBvZiBTeW1ib2xzLlxuICAgKlxuICAgKiBUaGUgZmlyc3QgU3ltYm9sIHR5cGUgaXMgdGhlIGNvbnN0YW50IGBBREpBQ0VOVF9GSUxFYC4gSWYgdGhpcyBTeW1ib2wgaXNcbiAgICogcmV0dXJuZWQsIHRoZSBzeXN0ZW0gYXNzdW1lcyB0aGF0IG5leHQgdG8gdGhlIHNvdXJjZSBmaWxlIGluIHF1ZXN0aW9uIGlzXG4gICAqIGEgZmlsZSBvZiB0aGUgc2FtZSBuYW1lIHdpdGggYSAuZ3JhcGhxbCBleHRlbnNpb24uIFRoaXMgZmlsZSBzaG91bGQgYmVcbiAgICogbWFkZSBvZiB0aGUgR3JhcGhRTCBJREwgc2NoZW1hIGRlZmluaXRpb25zIGZvciB0aGUgb2JqZWN0IHR5cGVzIGJlaW5nXG4gICAqIGNyZWF0ZWQuXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqIGBgYGpzXG4gICAqICAgc3RhdGljIGdldCBTQ0hFTUEoKTogc3RyaW5nIHwgU3ltYm9sIHtcbiAgICogICAgIHJldHVybiBHUUxCYXNlLkFESkFDRU5UX0ZJTEVcbiAgICogICB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgcHJpbWFyeSBhZHZhbnRhZ2Ugb2YgdGhpcyBhcHByb2FjaCBpcyBhbGxvd2luZyBhbiBvdXRzaWRlIGVkaXRvciB0aGF0XG4gICAqIHByb3ZpZGVzIHN5bnRheCBoaWdobGlnaHRpbmcgcmF0aGVyIHRoYW4gcmV0dXJuaW5nIGEgc3RyaW5nIGZyb20gdGhlXG4gICAqIFNDSEVNQSBnZXR0ZXIuXG4gICAqXG4gICAqIEFsdGVybmF0aXZlbHksIHRoZSBzdGF0aWMgbWV0aG9kIElETEZpbGVQYXRoIGNhbiBiZSB1c2VkIHRvIHBvaW50IHRvIGFuXG4gICAqIGFsdGVybmF0ZSBsb2NhdGlvbiB3aGVyZSB0aGUgR3JhcGhRTCBJREwgZmlsZSByZXNpZGVzLiBUaGUgZXh0ZW5zaW9uIGNhblxuICAgKiBhbHNvIGJlIGNoYW5nZWQgZnJvbSAuZ3JhcGhxbCB0byBzb21ldGhpbmcgZWxzZSBpZiBuZWVkIGJlIHVzaW5nIHRoaXNcbiAgICogbWV0aG9kLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKiBgYGBqc1xuICAgKiAgIHN0YXRpYyBnZXQgU0NIRU1BKCk6IHN0cmluZyB8IFN5bWJvbCB7XG4gICAqICAgICByZXR1cm4gR1FMQmFzZS5JRExGaWxlUGF0aCgnL3BhdGgvdG8vZmlsZScsICcuaWRsJylcbiAgICogICB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDirIfvuI7ioIBTQ0hFTUFcbiAgICogQHJlYWRvbmx5XG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfFN5bWJvbH0gYSB2YWxpZCBJREwgc3RyaW5nIG9yIG9uZSBvZiB0aGUgU3ltYm9sc1xuICAgKiBkZXNjcmliZWQgYWJvdmUuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEdRTEJhc2UjQURKQUNFTlRfRklMRX1cbiAgICogQHNlZSB7QGxpbmsgR1FMQmFzZSNJRExGaWxlUGF0aH1cbiAgICovXG4gIHN0YXRpYyBnZXQgU0NIRU1BKCk6IHN0cmluZyB8IFN5bWJvbCB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3Qgb2ZcbiAgICogZnVuY3Rpb25zIG1hdGNoaW5nIHRoZSBuYW1lcyBvZiB0aGUgbXV0YXRpb24gb3BlcmF0aW9ucy4gVGhlc2UgYXJlIHRvIGJlXG4gICAqIGluamVjdGVkIGludG8gdGhlIHJvb3Qgb2JqZWN0IHdoZW4gdXNlZCBieSBgR1FMRXhwcmVzc01pZGRsZXdhcmVgLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDijL7ioIBNVVRBVE9SU1xuICAgKiBAcmVhZG9ubHlcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdERhdGEgdHlwaWNhbGx5IGFuIG9iamVjdCBjb250YWluaW5nIHRocmVlXG4gICAqIHByb3BlcnRpZXM7IHtyZXEsIHJlcywgZ3FsfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3Q7IHNlZSBhYm92ZSBmb3IgbW9yZVxuICAgKiBpbmZvcm1hdGlvbi5cbiAgICovXG4gIHN0YXRpYyBhc3luYyBNVVRBVE9SUyhyZXF1ZXN0RGF0YTogT2JqZWN0KTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICAvLyBkZWZpbmUgaW4gYmFzZSBjbGFzc1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIG9iamVjdCBvZlxuICAgKiBmdW5jdGlvbnMgbWF0Y2hpbmcgdGhlIG5hbWVzIG9mIHRoZSBxdWVyeSBvcGVyYXRpb25zLiBUaGVzZSBhcmUgdG8gYmVcbiAgICogaW5qZWN0ZWQgaW50byB0aGUgcm9vdCBvYmplY3Qgd2hlbiB1c2VkIGJ5IGBHUUxFeHByZXNzTWlkZGxld2FyZWAuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKMvuKggFJFU09MVkVSU1xuICAgKiBAcmVhZG9ubHlcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdERhdGEgdHlwaWNhbGx5IGFuIG9iamVjdCBjb250YWluaW5nIHRocmVlXG4gICAqIHByb3BlcnRpZXM7IHtyZXEsIHJlcywgZ3FsfVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBvYmplY3Q7IHNlZSBhYm92ZSBmb3IgbW9yZVxuICAgKiBpbmZvcm1hdGlvbi5cbiAgICovXG4gIHN0YXRpYyBhc3luYyBSRVNPTFZFUlMocmVxdWVzdERhdGE6IE9iamVjdCk6IFByb21pc2U8T2JqZWN0PiB7XG4gICAgLy8gZGVmaW5lIGluIGJhc2UgY2xhc3NcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogQHNlZSB7QGxpbmsgR1FMQmFzZSNTQ0hFTUF9XG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAQURKQUNFTlRfRklMRVxuICAgKiBAc3RhdGljXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAcmV0dXJuIHtTeW1ib2x9IHRoZSBTeW1ib2wsIHdoZW4gcmV0dXJuZWQgZnJvbSBTQ0hFTUEsIGNhdXNlc1xuICAgKiB0aGUgbG9naWMgdG8gbG9hZCBhbiBJREwgU2NoZW1hIGZyb20gYW4gYXNzb2NpYXRlZCBmaWxlIHdpdGggYSAuZ3JhcGhxbFxuICAgKiBleHRlbnNpb24gYW5kIGJlYXJpbmcgdGhlIHNhbWUgbmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgQURKQUNFTlRfRklMRSgpOiBTeW1ib2wge1xuICAgIHJldHVybiBTeW1ib2wuZm9yKCcuZ3JhcGhxbCBmaWxlIGxvY2F0ZWQgYWRqYWNlbnQgdG8gc291cmNlJylcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHRoZSBkZWZhdWx0IHR5cGUgdGFyZ2V0ZWQgYnkgdGhpcyBHUUxCYXNlIGNsYXNzLiBBbnlcbiAgICogdHlwZSB3aWxsIHRlY2huaWNhbGx5IGJlIHZhbGlkIGJ1dCBvbmx5IHdpbGwgdHJpZ2dlciBzcGVjaWFsIGJlaGF2aW9yXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAR1FMX1RZUEVcbiAgICogQHN0YXRpY1xuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHJldHVybiB7RnVuY3Rpb259IGEgdHlwZSwgc3VjaCBhcyBgR3JhcGhRTE9iamVjdFR5cGVgIG9yXG4gICAqIGBHcmFwaFFMSW50ZXJmYWNlVHlwZWBcbiAgICovXG4gIHN0YXRpYyBnZXQgR1FMX1RZUEUoKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBHcmFwaFFMT2JqZWN0VHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFwcHJvcHJpYXRlIFN5bWJvbCBjcmFmdGVkIHdpdGggdGhlIHJpZ2h0IGRhdGEgZm9yIHVzZSBieVxuICAgKiB0aGUgSURMRmlsZUhhbmRsZXIgY2xhc3MgYmVsb3cuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDijL7ioIBJRExGaWxlUGF0aFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBhIHBhdGggdG8gdGhlIElETCBjb250YWluaW5nIGZpbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtleHRlbnNpb249Jy5ncmFwaHFsJ10gYW4gZXh0ZW5zaW9uLCBpbmNsdWRpbmcgdGhlXG4gICAqIHByZWZpeGVkIHBlcmlvZCwgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBzdXBwbGllZCBwYXRoIHNob3VsZCBpdCBub3RcbiAgICogYWxyZWFkeSBleGlzdC5cbiAgICogQHJldHVybiBTeW1ib2xcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgR1FMQmFzZSNTQ0hFTUF9XG4gICAqL1xuICBzdGF0aWMgSURMRmlsZVBhdGgocGF0aDogc3RyaW5nLCBleHRlbnNpb246IHN0cmluZyA9ICcuZ3JhcGhxbCcpOiBTeW1ib2wge1xuICAgIHJldHVybiBTeW1ib2wuZm9yKGBQYXRoICR7cGF0aH0gRXh0ZW5zaW9uICR7ZXh0ZW5zaW9ufWApO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgZmlsZSBoYW5kbGVyIGZvciBmZXRjaGluZyB0aGUgSURMIHNjaGVtYSBzdHJpbmcgZnJvbSB0aGUgZmlsZSBzeXN0ZW1cbiAgICogZm9yIHRob3NlIGBHUUxCYXNlYCBleHRlbmRlZCBjbGFzc2VzIHRoYXQgaGF2ZSBpbmRpY2F0ZWQgdG8gZG8gc28gYnlcbiAgICogcmV0dXJuaW5nIGEgYFN5bWJvbGAgZm9yIHRoZWlyIGBTQ0hFTUFgIHByb3BlcnR5LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAaGFuZGxlclxuICAgKlxuICAgKiBAcmV0dXJuIHtJRExGaWxlSGFuZGxlcn0gaW5zdGFuY2Ugb2YgSURMRmlsZUhhbmRsZXIsIGNyZWF0ZWQgaWYgb25lIGRvZXNcbiAgICogbm90IGFscmVhZHkgZXhpc3QsIGZvciBmZXRjaGluZyB0aGUgY29udGVudHMgZnJvbSBkaXNrLlxuICAgKi9cbiAgc3RhdGljIGdldCBoYW5kbGVyKCk6IElETEZpbGVIYW5kbGVyIHtcbiAgICBjb25zdCBrZXkgPSBTeW1ib2wuZm9yKGAke0lETEZpbGVIYW5kbGVyLm5hbWV9LiR7dGhpcy5uYW1lfWApO1xuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIGlmICghdGhpc1trZXldKSB7XG4gICAgICAvLyBAQ29tcHV0ZWRUeXBlXG4gICAgICB0aGlzW2tleV0gPSBuZXcgSURMRmlsZUhhbmRsZXIodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gQENvbXB1dGVkVHlwZVxuICAgIHJldHVybiB0aGlzW2tleV07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbW9kdWxlIG9iamVjdCB3aGVyZSB5b3VyIGNsYXNzIGlzIGNyZWF0ZWQuIFRoaXMgbmVlZHMgdG8gYmVcbiAgICogZGVmaW5lZCBvbiB5b3VyIGNsYXNzLCBhcyBhIHN0YXRpYyBnZXR0ZXIsIGluIHRoZSBGSUxFIHdoZXJlIHlvdSBhcmVcbiAgICogZGVmaW5pbmcgeW91ciBDbGFzcyBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAbW9kdWxlXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSByZWZlcmVuY2UgdG8gdGhlIG1vZHVsZSBvYmplY3QgZGVmaW5lZCBhbmQgaW5qZWN0ZWRcbiAgICogYnkgbm9kZS5qcycgbW9kdWxlIGxvYWRpbmcgc3lzdGVtLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvbW9kdWxlcy5odG1sXG4gICAqL1xuICBzdGF0aWMgZ2V0IG1vZHVsZSgpOiBPYmplY3Qge1xuICAgIHJldHVybiBtb2R1bGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludGVybmFsIGRhdGEgbW9kZWwgaGFzIHNvbWUgY3VzdG9tIGBFdmVudEVtaXR0ZXJgIGNvZGUgd3JhcHBlZFxuICAgKiBpdCBoZXJlLiBXaGVuIHRoZSBkYXRhIG1vZGVsIGlzIHNldCB2aWEgYHNldE1vZGVsYCBvciBieSBhY2Nlc3NpbmcgaXRcbiAgICogdmlhIGBpbnN0YW5jZVtNT0RFTF9LRVldYCwgYW4gZXZlbnQgYEVWRU5UX01PREVMX1NFVGAgaXMgZW1pdHRlZC4gQW55XG4gICAqIGxpc3RlbmVyIGxpc3RlbmluZyBmb3IgdGhpcyBldmVudCByZWNlaXZlcyBhbiBvYmplY3Qgd2l0aCB0d28ga2V5c1xuICAgKiBgYGBcbiAgICoge1xuICAgKiAgIG1vZGVsOiBUaGUgYWN0dWFsIG1vZGVsIGJlaW5nIHNldDsgY2hhbmdlcyBhcmUgcGVyc2lzdGVkXG4gICAqICAgaW5zdGFuY2U6IFRoZSBHUUxCYXNlIGluc3RhbmNlIHRoZSBtb2RlbCBpcyBhc3NvY2lhdGVkIHdpdGhcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogU3Vic2VxdWVudGx5LCB0aGUgZXZlbnRzIGBFVkVOVF9NT0RFTF9QUk9QX0NIQU5HRWAgYW5kXG4gICAqIGBFVkVOVF9NT0RFTF9QUk9QX0RFTEVURWAgY2FuIGJlIGxpc3RlbmVkIHRvIGlmIHlvdXIgdmVyc2lvbiBvZiBub2RlXG4gICAqIHN1cHBvcnRzIFByb3h5IG9iamVjdHMuIFRoZXkgYWxsb3cgeW91IHRvIGJlIG5vdGlmaWVkIHdoZW5ldmVyIHlvdXJcbiAgICogbW9kZWwgaGFzIGEgcHJvcGVydHkgY2hhbmdlZCBvciBkZWxldGVkLCByZXNwZWN0aXZlbHkuXG4gICAqXG4gICAqIFRoZSBjYWxsYmFjayBmb3IgYGNoYW5nZWAgcmVjZWl2ZXMgYW4gb2JqZWN0IHdpdGggZm91ciBwcm9wZXJ0aWVzXG4gICAqIGBgYFxuICAgKiB7XG4gICAqICAgbW9kZWw6IFRoZSBtb2RlbCBvYmplY3QgdGhlIHZhbHVlIGlzIGJlaW5nIGNoYW5nZWQgb25cbiAgICogICBvbGQ6IFRoZSBvbGQgdmFsdWUgYmVpbmcgcmVwbGFjZWQ7IHVuZGVmaW5lZCBpZiBpdCBpcyB0aGUgZmlyc3QgdGltZVxuICAgKiAgIGtleTogVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHZhbHVlIGJlaW5nIGNoYW5nZWRcbiAgICogICB2YWx1ZTogVGhlIG5ldyB2YWx1ZSBiZWluZyBzZXRcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIGNhbGxiYWNrIGZvciBgZGVsZXRlYCByZWNlaXZlcyBhbiBvYmplY3Qgd2l0aCBmb3VyIHByb3BlcnRpZXNcbiAgICogYGBgXG4gICAqIHtcbiAgICogICBtb2RlbDogVGhlIG1vZGVsIG9iamVjdCB0aGUgdmFsdWUgaXMgZGVsZXRlZCBmcm9tXG4gICAqICAga2V5OiBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgZGVsZXRlZCB2YWx1ZVxuICAgKiAgIGRlbGV0ZWQ6IFRoZSBkZWxldGVkIHZhbHVlXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDijL7ioIBzZXR1cE1vZGVsXG4gICAqXG4gICAqIEBwYXJhbSB7R1FMQmFzZX0gaW5zdGFuY2UgdHlwaWNhbGx5IGB0aGlzYCBhcyBwYXNzZWQgaW4gZnJvbSBhIGNhbGwgaW5cbiAgICogdGhlIGNvbnN0cnVjdG9yXG4gICAqL1xuICBzdGF0aWMgc2V0dXBNb2RlbChpbnN0YW5jZTogR1FMQmFzZSkge1xuICAgIGNvbnN0IGNoYW5nZUhhbmRsZXI6IE9iamVjdCA9IHtcbiAgICAgIC8qKlxuICAgICAgICogUHJveHkgc2V0KCkgaGFuZGxlci4gVGhpcyBpcyB3aGVyZSB0aGUgY2hhbmdlIGV2ZW50cyBhcmUgZmlyZWQgZnJvbVxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2QgR1FMQmFzZX5zZXRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgdGhlIGBHUUxCYXNlYCBtb2RlbCBvYmplY3RcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdGhlIHByb3BlcnR5IG5hbWVcbiAgICAgICAqIEBwYXJhbSB7bWl4ZWR9IHZhbHVlIHRoZSBuZXcgcHJvcGVydHkgdmFsdWVcbiAgICAgICAqL1xuICAgICAgc2V0KHRhcmdldCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBvbGQgPSB0YXJnZXRba2V5XTtcblxuICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuICAgICAgICBpbnN0YW5jZS5lbWl0KEdRTEJhc2UuRVZFTlRfTU9ERUxfUFJPUF9DSEFOR0UsIHtcbiAgICAgICAgICBtb2RlbDogdGFyZ2V0LFxuICAgICAgICAgIG9sZCxcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgfSlcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUHJveHkgZGVsZXRlUHJvcGVydHkoKSBoYW5kbGVyLiBUaGlzIGlzIHdoZXJlIHRoZSBkZWxldGUgcHJvcGVydHlcbiAgICAgICAqIGV2ZW50cyBhcmUgZmlyZWQgZnJvbVxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2QgR1FMQmFzZX5kZWxldGVQcm9wZXJ0eVxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCB0aGUgYEdRTEJhc2VgIG1vZGVsIG9iamVjdFxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSB0aGUgcHJvcGVydHkgbmFtZVxuICAgICAgICovXG4gICAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICAgICAgICBjb25zdCBkZWxldGVkID0gdGFyZ2V0W2tleV07XG5cbiAgICAgICAgZGVsZXRlIHRhcmdldFtrZXldO1xuICAgICAgICBpbnN0YW5jZS5lbWl0KEdRTEJhc2UuRVZFTlRfTU9ERUxfUFJPUF9ERUxFVEUsIHtcbiAgICAgICAgICBtb2RlbDogdGFyZ2V0LFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICBkZWxldGVkXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogJ1B1YmxpY2x5JyB0aGUgU3ltYm9sIGZvciBhY2Nlc3NpbmcgdGhlIGBHUUxCYXNlYCBtb2RlbCBpcyBgTU9ERUxfS0VZYC5cbiAgICAgKiBJbiB0cnV0aCBpdCBpcyBzdG9yZWQgdW5kZXIgYSBTeW1ib2wgZGVmaW5lZCBpbiBgc2V0dXBNb2RlbGAgYW5kXG4gICAgICogcmVmZXJyZWQgdG8gYXMgYF9NT0RFTF9LRVlgIGluIHRoaXMgY29kZS4gVGhpcyBpcyBkb25lIHNvIGEgZ2V0dGVyIGFuZFxuICAgICAqIHNldHRlciBjYW4gYmUgd3JhcHBlZCBhcm91bmQgdGhlIHVzYWdlIG9mIHRoZSBpbnN0YW5jZSdzIGRhdGEgbW9kZWwuXG4gICAgICpcbiAgICAgKiBXaGVuIGJlaW5nIHJlYWQsIGlmIGBQcm94eWAgZXhpc3RzIGluIHRoZSBub2RlIGVudmlyb25tZW50IGFuZCBpZiB0aGVyZVxuICAgICAqIGFyZSBhbnkgcmVnaXN0ZXJlZCBgRVZFTlRfTU9ERUxfUFJPUF9DSEFOR0VgIG9yIGBFVkVOVF9NT0RFTF9QUk9QX0RFTEVURWBcbiAgICAgKiBldmVudHMsIHRoZW4gdGhlIHJldHVybmVkIG1vZGVsIGlzIGEgUHJveHkgYXJvdW5kIHRoZSByZWFsIG1vZGVsIHRoYXRcbiAgICAgKiBhbGxvd3MgdXMgdG8gY2FwdHVyZSB0aGUgY2hhbmdlcyBhbmQgZGVsZXRpb24gb2Yga2V5c1xuICAgICAqXG4gICAgICogV2hlbiBiZWluZyBhc3NpZ25lZCwgdGhlIGV2ZW50IGBFVkVOVF9NT0RFTF9XSUxMX0JFX1NFVGAgYW5kIHRoZSBldmVudFxuICAgICAqIGBFVkVOVF9NT0RFTF9IQVNfQkVFTl9TRVRgIGFyZSBlbWl0dGVkIHRvIGFsbG93IGxpc3RlbmVycyB0byBtb2RpZnkgYW5kXG4gICAgICogc2VlIHRoZSBmaW5hbCBkYXRhIGFyb3VuZCB0aGUgc2V0dGluZyBvZiBhIG1vZGVsIG9iamVjdC4gQm90aCBldmVudHNcbiAgICAgKiByZWNlaXZlIGFuIG9iamVjdCB3aXRoIHR3byBrZXlzXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiB7XG4gICAgICogICBtb2RlbDogVGhlIG9iamVjdCBiZWluZyBvciBoYXZpbmcgYmVlbiBzZXRcbiAgICAgKiAgIGluc3RhbmNlOiBUaGUgR1FMQmFzZSBpbnN0YW5jZSByZWNlaXZpbmcgdGhlIG1vZGVsXG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0YW5jZSwgTU9ERUxfS0VZLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgbW9kZWwgPSB0aGlzW19NT0RFTF9LRVldXG4gICAgICAgIGxldCBoYXNMaXN0ZW5lcnMgPVxuICAgICAgICAgIHRoaXMubGlzdGVuZXJDb3VudChHUUxCYXNlLkVWRU5UX01PREVMX1BST1BfQ0hBTkdFKSArXG4gICAgICAgICAgdGhpcy5saXN0ZW5lckNvdW50KEdRTEJhc2UuRVZFTlRfTU9ERUxfUFJPUF9ERUxFVEUpXG5cbiAgICAgICAgaWYgKGhhc1Byb3h5ICYmIGhhc0xpc3RlbmVycykge1xuICAgICAgICAgIG1vZGVsID0gbmV3IFByb3h5KG1vZGVsLCBjaGFuZ2VIYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb2RlbFxuICAgICAgfSxcblxuICAgICAgc2V0OiBmdW5jdGlvbihtb2RlbCkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5lbWl0KEdRTEJhc2UuRVZFTlRfTU9ERUxfV0lMTF9CRV9TRVQsIHsgbW9kZWwsIGluc3RhbmNlIH0pO1xuICAgICAgICBpbnN0YW5jZVtfTU9ERUxfS0VZXSA9IG1vZGVsO1xuICAgICAgICB0aGlzLmVtaXQoR1FMQmFzZS5FVkVOVF9NT0RFTF9IQVNfQkVFTl9TRVQsIHsgbW9kZWwsIGluc3RhbmNlIH0pXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSWYgRVM2IFByb3hpZXMgYXJlIHN1cHBvcnRlZCBpbiB5b3VyIGV4ZWN1dGlvbiBlbnZpcm9ubWVudCwgYWxsIEdRTEJhc2VcbiAgICogZXh0ZW5kZWQgY2xhc3NlcyBhcmUgYWxzbyBwcm94aWVzLiBCeSBkZWZhdWx0IHRoZSBpbnRlcm5hbCBwcm94eSBoYW5kbGVyXG4gICAqIHByb3ZpZGVzIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggdGhlIHJlbW92YWwgb2YgdGhlIGRlZmF1bHQgZ2V0dGVyc1xuICAgKiBhbmQgc2V0dGVycyBmb3IgdGhlICdtb2RlbCcgcHJvcGVydHkgYXMgbG9uZyBhcyB5b3UgZG8gbm90IGRlZmluZSBhXG4gICAqIHRvcCBsZXZlbCAnbW9kZWwnIHByb3BlcnR5IG9mIHlvdXIgb3duLlxuICAgKlxuICAgKiBAbWV0aG9kIOKsh++4juKggFtfUFJPWFlfSEFORExFUl1cbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQHN0YXRpY1xuICAgKiBAY29uc3RcbiAgICogQHNpbmNlIDIuNS4wXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBDb21wdXRlZFR5cGVcbiAgICovXG4gIHN0YXRpYyBnZXQgW19QUk9YWV9IQU5ETEVSXSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0KHRhcmdldCwga2V5LCBsYXN0UmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gdGFyZ2V0W19NT0RFTF9LRVldO1xuXG4gICAgICAgIC8vIEFsbG93IGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGZvciAnbW9kZWwnIHByb3BlcnR5IGlmIG9uZSBpcyBub3RcbiAgICAgICAgLy8gZXhwbGljaXRseSBkZWZpbmVkIG9uIHlvdXIgaW5zdGFuY2UuXG4gICAgICAgIGlmIChub3REZWZpbmVkKCdtb2RlbCcsIGtleSwgdGFyZ2V0KSkge1xuICAgICAgICAgIC8vIEJlIHN1cmUgdG8gdXNlIHRoZSBwdWJsaWMgTU9ERUxfS0VZIHRvIGVuc3VyZSBldmVudHMgZmlyZVxuICAgICAgICAgIHJldHVybiB0YXJnZXRbTU9ERUxfS0VZXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzYW1lIGxvZ2ljIGFzIHtAbGluayAjW1N5bWJvbC50b1N0cmluZ1RhZ119IGJ1dCBvbiBhIHN0YXRpY1xuICAgKiBzY2FsZS4gU28sIGlmIHlvdSBwZXJmb3JtIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoTXlDbGFzcylgXG4gICAqIHRoZSByZXN1bHQgd291bGQgYmUgYFtvYmplY3QgTXlDbGFzc11gLlxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggFtTeW1ib2wudG9TdHJpbmdUYWddXG4gICAqIEBtZW1iZXJvZiBNb2R1bGVQYXJzZXJcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBuYW1lIG9mIHRoaXMgY2xhc3NcbiAgICogQENvbXB1dGVkVHlwZVxuICAgKi9cbiAgc3RhdGljIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgdXNlZCB0byByZWdpc3RlciBhbiBldmVudCBsaXN0ZW5lciBmb3Igd2hlbiB0aGUgaW50ZXJuYWxcbiAgICogbW9kZWwgb2JqZWN0IGlzIGFzc2lnbmVkIGEgbmV3IHZhbHVlLiBUaGlzIGV2ZW50IGZpcmVzIGJlZm9yZSB0aGUgbW9kZWxcbiAgICogaXMgc2V0LiBDaGFuZ2VzIHRvIHRoZSBtb2RlbCB2YWx1ZSBhdCB0aGlzIHBvaW50IHdpbGwgYWZmZWN0IHRoZSBjb250ZW50c1xuICAgKiBiZWZvcmUgdGhlIHZhbHVlIGFzc2lnbm1lbnQgdGFrZXMgcGxhY2UuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDirIfvuI7ioIBFVkVOVF9NT0RFTF9XSUxMX0JFX1NFVFxuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRVZFTlRfTU9ERUxfV0lMTF9CRV9TRVQoKSB7IHJldHVybiAnRTogSW50LiBtb2RlbCB3aWxsIGJlIHNldCcgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHVzZWQgdG8gcmVnaXN0ZXIgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHdoZW4gdGhlIGludGVybmFsXG4gICAqIG1vZGVsIG9iamVjdCBpcyBhc3NpZ25lZCBhIG5ldyB2YWx1ZS4gVGhpcyBldmVudCBmaXJlcyBhZnRlciB0aGUgbW9kZWxcbiAgICogaXMgc2V0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCARVZFTlRfTU9ERUxfSEFTX0JFRU5fU0VUXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBFVkVOVF9NT0RFTF9IQVNfQkVFTl9TRVQoKSB7IHJldHVybiAnRTogSW50LiBtb2RlbCBoYXMgYmVlbiBzZXQnIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCB1c2VkIHRvIHJlZ2lzdGVyIGFuIGV2ZW50IGxpc3RlbmVyIGZvciB3aGVuIGEgcHJvcGVydHkgb2YgdGhlXG4gICAqIGludGVybmFsIG1vZGVsIG9iamVjdCBpcyBzZXQgdG8gYSBuZXcgb3IgaW50aWFsIHZhbHVlLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCARVZFTlRfTU9ERUxfUFJPUF9DSEFOR0VcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IEVWRU5UX01PREVMX1BST1BfQ0hBTkdFKCkgeyByZXR1cm4gJ0U6IEludC4gbW9kZWwgcHJvcCBjaGFuZ2VkJyB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgdXNlZCB0byByZWdpc3RlciBhbiBldmVudCBsaXN0ZW5lciBmb3Igd2hlbiBhIHByb3BlcnR5IG9mIHRoZVxuICAgKiBpbnRlcm5hbCBtb2RlbCBvYmplY3QgaGFzIGJlZW4gZGVsZXRlZC4gVGhpcyBldmVudCBmaXJlcyBhZnRlciB0aGUgdmFsdWVcbiAgICogaGFzIGJlZW4gZGVsZXRlZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggEVWRU5UX01PREVMX1BST1BfREVMRVRFXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBFVkVOVF9NT0RFTF9QUk9QX0RFTEVURSgpIHsgcmV0dXJuICdFOiBJbnQuIG1vZGVsIHByb3AgZGVsZXRlZCcgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IGtleSB1c2VkIHRvIGlkZW50aWZ5IGEgY29tbWVudCBmb3IgYSBjbGFzcyBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCARE9DX0NMQVNTXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBET0NfQ0xBU1MoKSB7IHJldHVybiAnY2xhc3MnIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCBrZXkgdXNlZCB0byBpZGVudGlmeSBhIGNvbW1lbnQgZm9yIGEgdHlwZSBmaWVsZCBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCARE9DX0ZJRUxEU1xuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRE9DX0ZJRUxEUygpIHsgcmV0dXJuICdmaWVsZHMnIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCBrZXkgdXNlZCB0byBpZGVudGlmeSBhIGNvbW1lbnQgZm9yIHRoZSB0b3AgbGV2ZWwgcXVlcnlcbiAgICogZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggERPQ19RVUVSWVxuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRE9DX1FVRVJZKCkgeyByZXR1cm4gJ3F1ZXJ5JyB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQga2V5IHVzZWQgdG8gaWRlbnRpZnkgYSBjb21tZW50IGZvciBhIHF1ZXJ5IGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIEdRTEJhc2VcbiAgICogQG1ldGhvZCDirIfvuI7ioIBET0NfUVVFUklFU1xuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRE9DX1FVRVJJRVMoKSB7IHJldHVybiAncXVlcmllcycgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IGtleSB1c2VkIHRvIGlkZW50aWZ5IGEgY29tbWVudCBmb3IgdGhlIHRvcCBsZXZlbCBtdXRhdGlvblxuICAgKiBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCARE9DX01VVEFUSU9OXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBET0NfTVVUQVRJT04oKSB7IHJldHVybiAnbXV0YXRpb24nIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCBrZXkgdXNlZCB0byBpZGVudGlmeSBhIGNvbW1lbnQgZm9yIGEgbXV0YXRvciBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCARE9DX01VVEFUT1JTXG4gICAqIEBjb25zdFxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYERPQ19NVVRBVElPTlNgIGluc3RlYWRcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRE9DX01VVEFUT1JTKCkgeyByZXR1cm4gJ211dGF0b3JzJyB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQga2V5IHVzZWQgdG8gaWRlbnRpZnkgYSBjb21tZW50IGZvciBhIG11dGF0b3IgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggERPQ19NVVRBVE9SU1xuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZXQgRE9DX01VVEFUSU9OUygpIHsgcmV0dXJuICdtdXRhdG9ycycgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IGtleSB1c2VkIHRvIGlkZW50aWZ5IGEgY29tbWVudCBmb3IgdGhlIHRvcCBsZXZlbCBzdWJzY3JpcHRpb25cbiAgICogZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgR1FMQmFzZVxuICAgKiBAbWV0aG9kIOKsh++4juKggERPQ19TVUJTQ1JJUFRJT05cbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IERPQ19TVUJTQ1JJUFRJT04oKSB7IHJldHVybiAnc3Vic2NyaXB0aW9uJyB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQga2V5IHVzZWQgdG8gaWRlbnRpZnkgYSBjb21tZW50IGZvciBhIHN1YnNjcmlwdGlvbiBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCARE9DX1NVQlNDUklQVElPTlNcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0IERPQ19TVUJTQ1JJUFRJT05TKCkgeyByZXR1cm4gJ3N1YnNjcmlwdGlvbnMnIH1cblxuICAvKipcbiAgICogQSBzaG9ydGN1dCB0byB0aGUgdXRpbHMvam9pbkxpbmVzIGZ1bmN0aW9uIHRvIG1ha2UgaXQgZWFzaWVyIHRvIGdldFxuICAgKiB0aGUgdG9vbHMgdG8gd3JpdGUgZG9jcyBmb3IgeW91ciB0eXBlcyBpbiBhIGZyaWVuZGx5IGZhc2hpb24uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAam9pbkxpbmVzXG4gICAqIEBzdGF0aWNcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHN0YXRpYyBnZXQgam9pbkxpbmVzKCk6IEZ1bmN0aW9uIHsgcmV0dXJuIGpvaW5MaW5lcyB9XG5cbiAgLyoqXG4gICAqIEFuIHNpbXBsZSBwYXNzLXRocnUgbWV0aG9kIGZvciBmZXRjaGluZyBhIHR5cGVzIG1lcmdlZCByb290IG9iamVjdC5cbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBnZXRNZXJnZWRSb290XG4gICAqIEBtZW1iZXJvZiBHUUxCYXNlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3REYXRhIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSByZXF1ZXN0IGRhdGEgc3VjaCBhc1xuICAgKiByZXF1ZXN0LCByZXNwb25zZSBvciBncmFwaHFsIGNvbnRleHQgaW5mbyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgYWxvbmcgdG9cbiAgICogZWFjaCBvZiB0aGUgcmVzb2x2ZXIgY3JlYXRvcnNcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgbWVyZ2VkIHJvb3Qgb2JqZWN0IHdpdGggYWxsIHRoZSBxdWVyeSwgbXV0YXRpb24gYW5kXG4gICAqIHN1YnNjcmlwdGlvbiByZXNvbHZlcnMgZGVmaW5lZCBhbmQgY3JlYXRlZCB3aXRoaW4uXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgZ2V0TWVyZ2VkUm9vdChcbiAgICByZXF1ZXN0RGF0YTogT2JqZWN0LFxuICAgIHNlcGFyYXRlQnlUeXBlOiBib29sZWFuID0gZmFsc2VcbiAgKTogT2JqZWN0IHtcbiAgICBjb25zdCByb290ID0ge307XG4gICAgY29uc3QgQ2xhc3MgPSB0aGlzO1xuXG4gICAgbGV0IF8gPSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICByZXNvbHZlcnM6IENsYXNzW01FVEFfS0VZXS5yZXNvbHZlcnMgfHwgW10sXG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBtdXRhdG9yczogQ2xhc3NbTUVUQV9LRVldLm11dGF0b3JzIHx8IFtdLFxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgc3Vic2NyaXB0b3JzOiBDbGFzc1tNRVRBX0tFWV0uc3Vic2NyaXB0b3JzIHx8IFtdXG4gICAgfVxuXG4gICAgbGV0IGNvbnZlcnQgPSBmID0+IHtcbiAgICAgIGxldCBpc0ZhY3RvcnlDbGFzcyA9IChjKSA9PiB7XG4gICAgICAgIHJldHVybiAhIUNsYXNzW01FVEFfS0VZXVtTeW1ib2wuZm9yKCdGYWN0b3J5IENsYXNzJyldXG4gICAgICB9XG5cbiAgICAgIGlmIChpc0ZhY3RvcnlDbGFzcyhDbGFzcykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBbZi5uYW1lXTogZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIGYuYXBwbHkoQ2xhc3MsIFtDbGFzcywgcmVxdWVzdERhdGEsIC4uLmFyZ3NdKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgW2YubmFtZV06IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmFwcGx5KENsYXNzLCBbcmVxdWVzdERhdGEsIC4uLmFyZ3NdKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgcmVkdWNlID0gKHAsIGMpID0+IG1lcmdlKHAsIGMpXG5cbiAgICBfLnJlc29sdmVycyA9IF8ucmVzb2x2ZXJzLm1hcChjb252ZXJ0KS5yZWR1Y2UocmVkdWNlLCB7fSlcbiAgICBfLm11dGF0b3JzID0gXy5tdXRhdG9ycy5tYXAoY29udmVydCkucmVkdWNlKHJlZHVjZSwge30pXG4gICAgXy5zdWJzY3JpcHRvcnMgPSBfLnN1YnNjcmlwdG9ycy5tYXAoY29udmVydCkucmVkdWNlKHJlZHVjZSwge30pXG5cbiAgICBpZiAoc2VwYXJhdGVCeVR5cGUpIHtcbiAgICAgIC8vIEFwb2xsbyB3YW50cyBhbGwgdGhlIHJlc29sdmVycyB0byBncm91cGVkIGJ5IHRvcCBsZXZlbCB0eXBlLlxuICAgICAgLy8gVGhlIGZpZWxkIHJlc29sdmVycyBhcmVuJ3QgYW4gaXNzdWUgaW4gTGF0dGljZSBkZWZpbmVkIHR5cGVzXG4gICAgICAvLyBidXQgdGhlIHJvb3QgdHlwZXMgZG8gbmVlZCB0byBiZSBzb3J0ZWQ7IHNvIGxldCdzIGRvIHRoYXQgaGVyZVxuICAgICAgbWVyZ2UoXG4gICAgICAgIHJvb3QsXG4gICAgICAgIHsgUXVlcnk6IGF3YWl0IENsYXNzLlJFU09MVkVSUyhyZXF1ZXN0RGF0YSkgfSxcbiAgICAgICAgeyBNdXRhdGlvbjogYXdhaXQgQ2xhc3MuTVVUQVRPUlMocmVxdWVzdERhdGEpIH0sXG4gICAgICAgIHsgUXVlcnk6IF8ucmVzb2x2ZXJzIH0sXG4gICAgICAgIHsgTXV0YXRpb246IF8ubXV0YXRvcnMgfSxcbiAgICAgICAgeyBTdWJzY3JpcHRpb246IF8uc3Vic2NyaXB0b3JzIH1cbiAgICAgICk7XG5cbiAgICAgIC8vIFdoZW4gdXNpbmcgbGF0dGljZSB3aXRoIGFwb2xsbyBzZXJ2ZXIsIGl0IGlzIHF1aXRlIHBhcnRpY3VsYXIgYWJvdXRcbiAgICAgIC8vIGVtcHR5IFF1ZXJ5LCBNdXRhdGlvbiBvciBTdWJzY3JpcHRpb24gcmVzb2x2ZXIgbWFwcy5cbiAgICAgIGlmICghT2JqZWN0LmtleXMocm9vdC5RdWVyeSkubGVuZ3RoKSBkZWxldGUgcm9vdC5RdWVyeVxuICAgICAgaWYgKCFPYmplY3Qua2V5cyhyb290Lk11dGF0aW9uKS5sZW5ndGgpIGRlbGV0ZSByb290Lk11dGF0aW9uXG4gICAgICBpZiAoIU9iamVjdC5rZXlzKHJvb3QuU3Vic2NyaXB0aW9uKS5sZW5ndGgpIGRlbGV0ZSByb290LlN1YnNjcmlwdGlvblxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG1lcmdlKFxuICAgICAgICByb290LFxuICAgICAgICBhd2FpdCBDbGFzcy5SRVNPTFZFUlMocmVxdWVzdERhdGEpLFxuICAgICAgICBhd2FpdCBDbGFzcy5NVVRBVE9SUyhyZXF1ZXN0RGF0YSksXG4gICAgICAgIF8ucmVzb2x2ZXJzLFxuICAgICAgICBfLm11dGF0b3JzLFxuICAgICAgICBfLnN1YnNjcmlwdG9yc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgdXNlZCB0byBzdG9yZSBkYXRhIHVzZWQgYnkgZGVjb3JhdG9ycyBhbmQgb3RoZXIgaW50ZXJuYWxcbiAgICogcHJvY2Nlc3Nlcy5cbiAgICogQENvbXB1dGVkVHlwZVxuICAgKi9cbiAgc3RhdGljIGdldCBbTUVUQV9LRVldKCkge1xuICAgIGxldCBzdG9yYWdlID0gdGhpc1tTeW1ib2wuZm9yKHRoaXMubmFtZSldXG5cbiAgICBpZiAoIXN0b3JhZ2UpIHtcbiAgICAgIHN0b3JhZ2UgPSAodGhpc1tTeW1ib2wuZm9yKHRoaXMubmFtZSldID0ge30pXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0b3JhZ2U7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR1FMQmFzZTtcbiJdfQ==