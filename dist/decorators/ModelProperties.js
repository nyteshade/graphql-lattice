"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DirectTypeAdd = DirectTypeAdd;
exports.DirectTypeManager = void 0;
exports.Getters = Getters;
exports.Properties = Properties;
exports.Setters = Setters;
exports.applyTags = applyTags;
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _GQLBase = require("../GQLBase");

var _neTypes = require("ne-types");

var _util = require("util");

var _graphql = require("graphql");

var _SyntaxTree = require("../SyntaxTree");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
 *   fieldName: name of root instance property to create
 *   modelName: name of its associated internal model property
 *   typeClass: an optional class to wrap around the results in a getter
 * }
 * ```
 */
function extractBits(property) {
  var array = (0, _neTypes.isArray)(property) ? property : [property, property, null];
  var reply;

  if (!property) {
    var error = new Error('Invalid property. Given\n  %o', (0, _util.inspect)(property, {
      depth: 2
    }));
    return {
      fieldName: 'anErrorOccurred',
      modelName: 'anErrorOccurred',
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
  } //


  if (array.length === 3) {
    reply = {
      fieldName: array[0],
      modelName: array[1],
      typeClass: typeof array[2] === 'function' && array[2] || null
    };
  } //
  else if (array.length === 2) {
    reply = {
      fieldName: array[0],
      modelName: typeof array[1] === 'string' ? array[1] : array[0],
      typeClass: typeof array[1] === 'function' && array[1] || null
    };
  } //
  else {
    reply = {
      fieldName: array[0],
      modelName: array[0],
      typeClass: array[0]
    };
  }

  reply.getterMaker = function () {
    var _reply = reply,
        modelName = _reply.modelName,
        fieldName = _reply.fieldName,
        typeClass = _reply.typeClass;
    return function () {
      var thisClass = this.constructor;
      var model = this[_GQLBase.MODEL_KEY] || null;
      var val;

      if (!(0, _neTypes.extendsFrom)(thisClass, _GQLBase.GQLBase)) {
        console.error("".concat(thisClass.name, " is not derived from GQLBase"));
        return undefined;
      }

      if (!thisClass.SCHEMA) {
        throw new Error("\n        All GQLBase extended classes should have a defined SCHEMA. Please\n        manually define a static get SCHEMA() in your class or use the\n        @Schema() decorator to do so.\n        ");
      }

      if (typeClass) {
        // If the value of the model is already the type of class we expect
        // we do not need to do any processing and we can just grab it and
        // go.
        if (model[modelName] && (0, _neTypes.extendsFrom)(model[modelName], typeClass)) {
          val = model[modelName];
        } // Otherwise we need to return an instance of the determined typeClass
        // and pass that back instead; as requested.
        else {
          var results = _SyntaxTree.SyntaxTree.findField((0, _graphql.parse)(this.constructor.SCHEMA), this.constructor.name, modelName);

          var _ref = results || {
            meta: null
          },
              meta = _ref.meta;

          var args = [model[modelName], this.requestData];

          if (meta && !meta.nullable && !model) {
            throw new Error("\n              Using @Getters or @Properties decorators with a null or\n              undefined model when the schema states that this field\n              cannot be null.\n\n              Type      : ".concat(typeClass.name, "\n              Field (AST data)\n                name    : ").concat(meta.name, "\n                type    : ").concat(meta.type, "\n                nullable: ").concat(meta.nullable, "\n              [getter]  : ").concat(fieldName, "\n              [maps to] : ").concat(modelName, "\n              [model  ] : ").concat(model, "\n            "));
          } // If the following is true, it means that despite allowing nulls
          // for this field in the schema, we do have a valid model and should
          // proceed.


          if (model) {
            if (extractBits.DIRECT_TYPES.includes(typeClass.name)) {
              val = typeClass.apply(void 0, args);
            } else {
              val = (0, _construct2["default"])(typeClass, args);
            }

            if (typeClass.GQL_TYPE === _graphql.GraphQLEnumType) {
              return val.value;
            }
          }
        }
      } else {
        val = model[modelName];
      }

      if (val === 'undefined' || val === undefined) {
        val = null;
      }

      return val;
    };
  };

  reply.setterMaker = function () {
    var _reply2 = reply,
        modelName = _reply2.modelName;
    return function (value) {
      this[_GQLBase.MODEL_KEY][modelName] = value;
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

var DirectTypeManager = {
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
  add: function add(className) {
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
  clear: function clear() {
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
  reset: function reset() {
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

exports.DirectTypeManager = DirectTypeManager;

function DirectTypeAdd(target) {
  DirectTypeManager.add(target);
  return target;
}
/**
 * When applying multiple property getters and setters, knowing some info
 * about what was applied elsewhere can be important. "Tags" can be applied
 * that store the fieldName and descriptor applied via one of these decorators.
 *
 * Multiple "tags" are supported to allow for detecting the difference between
 * decorators applied by the developer using lattice and something auto
 * generated such as auto-props.
 *
 * @param  {GQLBase} Class an instance of GQLBase to apply the tags tp
 * @param  {Array<string|Symbol>} addTags an array of Symbols or strings to be
 * wrapped in Symbols that will be used as tag keys
 * @param  {string} fieldName the name of the field being decorated
 * @param  {Object} descriptor the JavaScript descriptor object to associate
 * with this tagged field.
 */


function applyTags(Class, addTags, fieldName, descriptor) {
  var tags = (Array.isArray(addTags) && addTags || []).map(function (tag) {
    return typeof tag === 'string' && Symbol["for"](tag) || tag;
  }).filter(function (tag) {
    return (0, _typeof2["default"])(tag) === 'symbol';
  });
  tags.forEach(function (tag) {
    Class[_GQLBase.META_KEY][tag] = Class[_GQLBase.META_KEY][tag] || {};
    Class[_GQLBase.META_KEY][tag][fieldName] = descriptor;
  });
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


function Getters() {
  for (var _len = arguments.length, propertyNames = new Array(_len), _key = 0; _key < _len; _key++) {
    propertyNames[_key] = arguments[_key];
  }

  return function (target) {
    var addTags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var _iterator = _createForOfIteratorHelper(propertyNames),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var property = _step.value;

        var _extractBits = extractBits(property),
            fieldName = _extractBits.fieldName,
            getterMaker = _extractBits.getterMaker;

        var desc = Object.getOwnPropertyDescriptor(target.prototype, fieldName);
        var hasImpl = desc && (desc.get || typeof desc.value === 'function');
        var tags = [_GQLBase.GETTERS].concat(Array.isArray(addTags) && addTags || []);

        if (!hasImpl) {
          var descriptor = {
            get: getterMaker()
          };
          applyTags(target, tags, fieldName, descriptor);
          Object.defineProperty(target.prototype, fieldName, descriptor);
        } else {
          console.warn("Skipping getter for ".concat(target.name, ".").concat(fieldName, "; already exists"));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
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


function Setters() {
  for (var _len2 = arguments.length, propertyNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    propertyNames[_key2] = arguments[_key2];
  }

  return function (target) {
    var addTags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var _iterator2 = _createForOfIteratorHelper(propertyNames),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var property = _step2.value;

        var _extractBits2 = extractBits(property),
            fieldName = _extractBits2.fieldName,
            setterMaker = _extractBits2.setterMaker;

        var desc = Object.getOwnPropertyDescriptor(target.prototype, fieldName);
        var hasImpl = desc && (desc.get || typeof desc.value === 'function');
        var tags = [_GQLBase.SETTERS].concat(Array.isArray(addTags) && addTags || []);

        if (!hasImpl) {
          var descriptor = {
            set: setterMaker()
          };
          applyTags(target, tags, fieldName, descriptor);
          Object.defineProperty(target.prototype, fieldName, descriptor);
        } else {
          console.warn("Skipping setter for ".concat(target.name, ".").concat(fieldName, "; already exists"));
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
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


function Properties() {
  for (var _len3 = arguments.length, propertyNames = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    propertyNames[_key3] = arguments[_key3];
  }

  return function (target) {
    var addTags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var _iterator3 = _createForOfIteratorHelper(propertyNames),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var property = _step3.value;

        var _extractBits3 = extractBits(property),
            fieldName = _extractBits3.fieldName,
            getterMaker = _extractBits3.getterMaker,
            setterMaker = _extractBits3.setterMaker;

        var desc = Object.getOwnPropertyDescriptor(target.prototype, fieldName);
        var hasImpl = desc && (desc.get || typeof desc.value === 'function');
        var tags = [_GQLBase.PROPS].concat(Array.isArray(addTags) && addTags || []);

        if (!hasImpl) {
          var descriptor = {
            set: setterMaker(),
            get: getterMaker()
          };
          applyTags(target, tags, fieldName, descriptor);
          Object.defineProperty(target.prototype, fieldName, descriptor);
        } else {
          console.warn("Skipping properties for ".concat(target.name, ".").concat(fieldName, "; already exists"));
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return target;
  };
}

var _default = Properties;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9kZWNvcmF0b3JzL01vZGVsUHJvcGVydGllcy5qcyJdLCJuYW1lcyI6WyJleHRyYWN0Qml0cyIsInByb3BlcnR5IiwiYXJyYXkiLCJyZXBseSIsImVycm9yIiwiRXJyb3IiLCJkZXB0aCIsImZpZWxkTmFtZSIsIm1vZGVsTmFtZSIsInR5cGVDbGFzcyIsImdldHRlck1ha2VyIiwic2V0dGVyTWFrZXIiLCJ2IiwidW5kZWZpbmVkIiwibGVuZ3RoIiwidGhpc0NsYXNzIiwiY29uc3RydWN0b3IiLCJtb2RlbCIsIk1PREVMX0tFWSIsInZhbCIsIkdRTEJhc2UiLCJjb25zb2xlIiwibmFtZSIsIlNDSEVNQSIsInJlc3VsdHMiLCJTeW50YXhUcmVlIiwiZmluZEZpZWxkIiwibWV0YSIsImFyZ3MiLCJyZXF1ZXN0RGF0YSIsIm51bGxhYmxlIiwidHlwZSIsIkRJUkVDVF9UWVBFUyIsImluY2x1ZGVzIiwiR1FMX1RZUEUiLCJHcmFwaFFMRW51bVR5cGUiLCJ2YWx1ZSIsIlN0cmluZyIsIkRpcmVjdFR5cGVNYW5hZ2VyIiwidHlwZXMiLCJhZGQiLCJjbGFzc05hbWUiLCJwdXNoIiwiY2xlYXIiLCJzcGxpY2UiLCJyZXNldCIsIkRpcmVjdFR5cGVBZGQiLCJ0YXJnZXQiLCJhcHBseVRhZ3MiLCJDbGFzcyIsImFkZFRhZ3MiLCJkZXNjcmlwdG9yIiwidGFncyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsInRhZyIsIlN5bWJvbCIsImZpbHRlciIsImZvckVhY2giLCJNRVRBX0tFWSIsIkdldHRlcnMiLCJwcm9wZXJ0eU5hbWVzIiwiZGVzYyIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInByb3RvdHlwZSIsImhhc0ltcGwiLCJnZXQiLCJHRVRURVJTIiwiY29uY2F0IiwiZGVmaW5lUHJvcGVydHkiLCJ3YXJuIiwiU2V0dGVycyIsIlNFVFRFUlMiLCJzZXQiLCJQcm9wZXJ0aWVzIiwiUFJPUFMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7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LE9BQTFCLElBQXFDLEVBQXBELENBQVg7O0FBRUEsWUFBSSxDQUFDaUIsT0FBTCxFQUFjO0FBQ1osY0FBSWhCLFVBQVUsR0FBRztBQUNmd0IsWUFBQUEsR0FBRyxFQUFFaEUsV0FBVyxFQUREO0FBRWZ5RCxZQUFBQSxHQUFHLEVBQUUxRCxXQUFXO0FBRkQsV0FBakI7QUFLQXNDLFVBQUFBLFNBQVMsQ0FBQ0QsTUFBRCxFQUFTSyxJQUFULEVBQWU3QyxTQUFmLEVBQTBCNEMsVUFBMUIsQ0FBVDtBQUNBYSxVQUFBQSxNQUFNLENBQUNPLGNBQVAsQ0FBc0J4QixNQUFNLENBQUNtQixTQUE3QixFQUF3QzNELFNBQXhDLEVBQW1ENEMsVUFBbkQ7QUFDRCxTQVJELE1BU0s7QUFDSDlCLFVBQUFBLE9BQU8sQ0FBQ21ELElBQVIsbUNBQzZCekIsTUFBTSxDQUFDekIsSUFEcEMsY0FDNENmLFNBRDVDO0FBR0Q7QUFDRjtBQXJCdUU7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUF1QnhFLFdBQU93QyxNQUFQO0FBQ0QsR0F4QkQ7QUF5QkQ7O2VBRWM2QixVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBuYW1lc3BhY2UgZGVjb3JhdG9ycyAqL1xuXG5pbXBvcnQge1xuICBHUUxCYXNlLCBNT0RFTF9LRVksIE1FVEFfS0VZLCBHRVRURVJTLCBTRVRURVJTLCBQUk9QUywgQVVUT19QUk9QU1xufSBmcm9tICcuLi9HUUxCYXNlJ1xuaW1wb3J0IHsgaXNBcnJheSwgZXh0ZW5kc0Zyb20gfSBmcm9tICduZS10eXBlcydcbmltcG9ydCB7IGluc3BlY3QgfSBmcm9tICd1dGlsJ1xuaW1wb3J0IHsgR3JhcGhRTEVudW1UeXBlLCBwYXJzZSB9IGZyb20gJ2dyYXBocWwnXG5pbXBvcnQgeyBTeW50YXhUcmVlIH0gZnJvbSAnLi4vU3ludGF4VHJlZSdcblxuLyoqXG4gKiBGb3IgZWFjaCBvZiB0aGUgZGVjb3JhdG9ycywgR2V0dGVycywgU2V0dGVycywgYW5kIFByb3BlcnRpZXMsIHdlIHRha2UgYVxuICogbGlzdCBvZiBwcm9wZXJ0eSBuYW1lcyB1c2VkIHRvIGNyZWF0ZSB0aGUgYXBwcm9wcmlhdGUgYWNjZXNzb3IgdHlwZXMuIEluXG4gKiBzb21lIGNhc2VzLCBob3dldmVyLCB0aGUgaW5zdGFuY2Ugb2YgR1FMQmFzZSdzIGRhdGEgbW9kZWwgbWF5IGhhdmUgYVxuICogZGlmZmVyZW50IG5hbWUuIEZpbmFsbHkgaWYgdGhlIHJldHVybiB0eXBlIGZvciB0aGUgZ2V0dGVyIHNob3VsZCBiZSB3cmFwcGVkXG4gKiBpbiBhIGFub3RoZXIgR1FMQmFzZSBjbGFzcyB0eXBlLCB3ZSB3aWxsIG5lZWQgYSB3YXkgdG8gc3BlY2lmeSB0aG9zZSB0aGluZ3NcbiAqIHRvby5cbiAqXG4gKiBUaGUgYGV4dHJhY3RCaXRzKClgIHRha2VzIGEgc2luZ2xlIGFyZ3VtZW50IHZhbHVlIGZyb20gdGhlIGRlY29yYXRvciBhcyBpdFxuICogcGFyc2VzIHRoZW0gYW5kIGNvbnZlcnRzIGl0IGludG8gYW4gb2JqZWN0LCBwcm9wZXJseSBzb3J0ZWQsIGludG8gdmFsdWVzIHRoYXRcbiAqIGFsbG93IHRoZSBhYm92ZSBkZXNjcmliZWQgYmVoYXZpb3IuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogYGBgXG4gKiAvLyBDcmVhdGUgYSBjbGFzcyB3aXRoIGEgbmFtZSBhbmQgYWdlIHByb3BlcnR5IHRoYXQgbWFwIGRpcmVjdGx5IHRvIHRoZVxuICogLy8gdW5kZXJseWluZyBkYXRhIG1vZGVsXG4gKiBAR2V0dGVycygnbmFtZScsICdhZ2UnKVxuICogY2xhc3MgTXlUeXBlIGV4dGVuZHMgR1FMQmFzZSB7Li4ufVxuICpcbiAqIC8vIENyZWF0ZSBhIGNsYXNzIHdpdGggYSBuYW1lIHByb3BlcnR5IHRoYXQgbWFwcyB0byBhIGRpZmZlcmVudCBwcm9wZXJ0eVxuICogLy8gbmFtZSBpbiB0aGUgdW5kZXJseWluZyBkYXRhIG1vZGVsXG4gKiBAR2V0dGVycyhbJ25hbWUnLCAnX2Zha2VfbmFtZSddKVxuICogY2xhc3MgTXlNb2NrVHlwZSBleHRlbmRzIEdRTEJhc2Ugey4uLn1cbiAqXG4gKiAvLyBDcmVhdGUgYSBjbGFzcyB3aXRoIGFuIGVtcGxveWVlIHByb3BlcnR5IHRoYXQgcmV0dXJucyBhbiBFbXBsb3llZVxuICogQEdldHRlcnMoWydlbXBsb3llZScsIEVtcGxveWVlXSlcbiAqIGNsYXNzIE15Um9sZVR5cGUgZXh0ZW5kcyBHUUxCYXNlIHsuLi59XG4gKlxuICogLy8gRmluYWxseSBjcmVhdGUgYSBjbGFzcyB3aXRoIGFuIGVtcGxveWUgcHJvcGVydHkgdGhhdCByZXR1cm5zIGFuIEVtcGxveWVlXG4gKiAvLyB3aXRoIGRhdGEgdW5kZXIgYSBkaWZmZXJlbnQgbmFtZSBpbiB0aGUgdW5kZXJseWluZyBkYXRhIG1vZGVsLlxuICogQEdldHRlcnMoWydlbXBsb3llZScsICdfd29ya2VyJywgRW1wbG95ZWVdKVxuICogY2xhc3MgTXlNb2NrUm9sZVR5cGUgZXh0ZW5kcyBHUUxCYXNlIHsuLi59XG4gKiBgYGBcbiAqXG4gKiBAbWVtYmVyb2YgZGVjb3JhdG9yc1xuICogQG1ldGhvZCDijL7ioIBleHRyYWN0Qml0c1xuICogQHNpbmNlIDIuNVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5PFN0cmluZ3xGdW5jdGlvbj59IHByb3BlcnR5IG5hbWUgb2YgYSBwcm9wZXJ0eSwgb3IgbGlzdFxuICogb2YgcHJvcGVydHkgbmFtZXMgYW5kIGEgQ2xhc3MuXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgZm9ybWF0IGBgYFxuICoge1xuICogICBmaWVsZE5hbWU6IG5hbWUgb2Ygcm9vdCBpbnN0YW5jZSBwcm9wZXJ0eSB0byBjcmVhdGVcbiAqICAgbW9kZWxOYW1lOiBuYW1lIG9mIGl0cyBhc3NvY2lhdGVkIGludGVybmFsIG1vZGVsIHByb3BlcnR5XG4gKiAgIHR5cGVDbGFzczogYW4gb3B0aW9uYWwgY2xhc3MgdG8gd3JhcCBhcm91bmQgdGhlIHJlc3VsdHMgaW4gYSBnZXR0ZXJcbiAqIH1cbiAqIGBgYFxuICovXG5mdW5jdGlvbiBleHRyYWN0Qml0cyhwcm9wZXJ0eSkge1xuICBsZXQgYXJyYXkgPSBpc0FycmF5KHByb3BlcnR5KSA/IHByb3BlcnR5IDogW3Byb3BlcnR5LCBwcm9wZXJ0eSwgbnVsbF1cbiAgbGV0IHJlcGx5O1xuXG4gIGlmICghcHJvcGVydHkpIHtcbiAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAnSW52YWxpZCBwcm9wZXJ0eS4gR2l2ZW5cXG4gICVvJyxcbiAgICAgIGluc3BlY3QocHJvcGVydHksIHtkZXB0aDogMn0pXG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICBmaWVsZE5hbWU6ICdhbkVycm9yT2NjdXJyZWQnLFxuICAgICAgbW9kZWxOYW1lOiAnYW5FcnJvck9jY3VycmVkJyxcbiAgICAgIHR5cGVDbGFzczogbnVsbCxcbiAgICAgIGdldHRlck1ha2VyOiBmdW5jdGlvbigpIHsgcmV0dXJuICgpID0+IGVycm9yIH0sXG4gICAgICBzZXR0ZXJNYWtlcjogZnVuY3Rpb24oKSB7IHJldHVybiAodikgPT4gdW5kZWZpbmVkIH1cbiAgICB9XG4gIH1cblxuICAvL1xuICBpZiAoYXJyYXkubGVuZ3RoID09PSAzKSB7XG4gICAgcmVwbHkgPSB7XG4gICAgICBmaWVsZE5hbWU6IGFycmF5WzBdLFxuICAgICAgbW9kZWxOYW1lOiBhcnJheVsxXSxcbiAgICAgIHR5cGVDbGFzczogdHlwZW9mIGFycmF5WzJdID09PSAnZnVuY3Rpb24nICYmIGFycmF5WzJdIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICAvL1xuICBlbHNlIGlmIChhcnJheS5sZW5ndGggPT09IDIpIHtcbiAgICByZXBseSA9IHtcbiAgICAgIGZpZWxkTmFtZTogYXJyYXlbMF0sXG4gICAgICBtb2RlbE5hbWU6IHR5cGVvZiBhcnJheVsxXSA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBhcnJheVsxXVxuICAgICAgICA6IGFycmF5WzBdLFxuICAgICAgdHlwZUNsYXNzOiB0eXBlb2YgYXJyYXlbMV0gPT09ICdmdW5jdGlvbicgJiYgYXJyYXlbMV0gfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8vXG4gIGVsc2Uge1xuICAgIHJlcGx5ID0ge1xuICAgICAgZmllbGROYW1lOiBhcnJheVswXSxcbiAgICAgIG1vZGVsTmFtZTogYXJyYXlbMF0sXG4gICAgICB0eXBlQ2xhc3M6IGFycmF5WzBdXG4gICAgfVxuICB9XG5cbiAgcmVwbHkuZ2V0dGVyTWFrZXIgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgeyBtb2RlbE5hbWUsIGZpZWxkTmFtZSwgdHlwZUNsYXNzIH0gPSByZXBseTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHRoaXNDbGFzcyA9IHRoaXMuY29uc3RydWN0b3JcbiAgICAgIGNvbnN0IG1vZGVsID0gdGhpc1tNT0RFTF9LRVldIHx8IG51bGxcbiAgICAgIGxldCB2YWxcblxuICAgICAgaWYgKCFleHRlbmRzRnJvbSh0aGlzQ2xhc3MsIEdRTEJhc2UpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7dGhpc0NsYXNzLm5hbWV9IGlzIG5vdCBkZXJpdmVkIGZyb20gR1FMQmFzZWApO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpc0NsYXNzLlNDSEVNQSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgICBBbGwgR1FMQmFzZSBleHRlbmRlZCBjbGFzc2VzIHNob3VsZCBoYXZlIGEgZGVmaW5lZCBTQ0hFTUEuIFBsZWFzZVxuICAgICAgICBtYW51YWxseSBkZWZpbmUgYSBzdGF0aWMgZ2V0IFNDSEVNQSgpIGluIHlvdXIgY2xhc3Mgb3IgdXNlIHRoZVxuICAgICAgICBAU2NoZW1hKCkgZGVjb3JhdG9yIHRvIGRvIHNvLlxuICAgICAgICBgKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZUNsYXNzKSB7XG4gICAgICAgIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbW9kZWwgaXMgYWxyZWFkeSB0aGUgdHlwZSBvZiBjbGFzcyB3ZSBleHBlY3RcbiAgICAgICAgLy8gd2UgZG8gbm90IG5lZWQgdG8gZG8gYW55IHByb2Nlc3NpbmcgYW5kIHdlIGNhbiBqdXN0IGdyYWIgaXQgYW5kXG4gICAgICAgIC8vIGdvLlxuICAgICAgICBpZiAobW9kZWxbbW9kZWxOYW1lXSAmJiBleHRlbmRzRnJvbShtb2RlbFttb2RlbE5hbWVdLCB0eXBlQ2xhc3MpKSB7XG4gICAgICAgICAgdmFsID0gbW9kZWxbbW9kZWxOYW1lXVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIG5lZWQgdG8gcmV0dXJuIGFuIGluc3RhbmNlIG9mIHRoZSBkZXRlcm1pbmVkIHR5cGVDbGFzc1xuICAgICAgICAvLyBhbmQgcGFzcyB0aGF0IGJhY2sgaW5zdGVhZDsgYXMgcmVxdWVzdGVkLlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjb25zdCByZXN1bHRzID0gU3ludGF4VHJlZS5maW5kRmllbGQoXG4gICAgICAgICAgICBwYXJzZSh0aGlzLmNvbnN0cnVjdG9yLlNDSEVNQSksXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsXG4gICAgICAgICAgICBtb2RlbE5hbWVcbiAgICAgICAgICApXG4gICAgICAgICAgY29uc3QgeyBtZXRhIH0gPSByZXN1bHRzIHx8IHsgbWV0YTogbnVsbCB9O1xuXG4gICAgICAgICAgbGV0IGFyZ3MgPSBbbW9kZWxbbW9kZWxOYW1lXSwgdGhpcy5yZXF1ZXN0RGF0YV07XG5cbiAgICAgICAgICBpZiAobWV0YSAmJiAhbWV0YS5udWxsYWJsZSAmJiAhbW9kZWwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICAgICAgICAgIFVzaW5nIEBHZXR0ZXJzIG9yIEBQcm9wZXJ0aWVzIGRlY29yYXRvcnMgd2l0aCBhIG51bGwgb3JcbiAgICAgICAgICAgICAgdW5kZWZpbmVkIG1vZGVsIHdoZW4gdGhlIHNjaGVtYSBzdGF0ZXMgdGhhdCB0aGlzIGZpZWxkXG4gICAgICAgICAgICAgIGNhbm5vdCBiZSBudWxsLlxuXG4gICAgICAgICAgICAgIFR5cGUgICAgICA6ICR7dHlwZUNsYXNzLm5hbWV9XG4gICAgICAgICAgICAgIEZpZWxkIChBU1QgZGF0YSlcbiAgICAgICAgICAgICAgICBuYW1lICAgIDogJHttZXRhLm5hbWV9XG4gICAgICAgICAgICAgICAgdHlwZSAgICA6ICR7bWV0YS50eXBlfVxuICAgICAgICAgICAgICAgIG51bGxhYmxlOiAke21ldGEubnVsbGFibGV9XG4gICAgICAgICAgICAgIFtnZXR0ZXJdICA6ICR7ZmllbGROYW1lfVxuICAgICAgICAgICAgICBbbWFwcyB0b10gOiAke21vZGVsTmFtZX1cbiAgICAgICAgICAgICAgW21vZGVsICBdIDogJHttb2RlbH1cbiAgICAgICAgICAgIGApXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhlIGZvbGxvd2luZyBpcyB0cnVlLCBpdCBtZWFucyB0aGF0IGRlc3BpdGUgYWxsb3dpbmcgbnVsbHNcbiAgICAgICAgICAvLyBmb3IgdGhpcyBmaWVsZCBpbiB0aGUgc2NoZW1hLCB3ZSBkbyBoYXZlIGEgdmFsaWQgbW9kZWwgYW5kIHNob3VsZFxuICAgICAgICAgIC8vIHByb2NlZWQuXG4gICAgICAgICAgaWYgKG1vZGVsKSB7XG4gICAgICAgICAgICBpZiAoZXh0cmFjdEJpdHMuRElSRUNUX1RZUEVTLmluY2x1ZGVzKHR5cGVDbGFzcy5uYW1lKSkge1xuICAgICAgICAgICAgICB2YWwgPSB0eXBlQ2xhc3MoLi4uYXJncylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB2YWwgPSBuZXcgdHlwZUNsYXNzKC4uLmFyZ3MpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlQ2xhc3MuR1FMX1RZUEUgPT09IEdyYXBoUUxFbnVtVHlwZSkgeyByZXR1cm4gdmFsLnZhbHVlOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFsID0gbW9kZWxbbW9kZWxOYW1lXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbCA9PT0gJ3VuZGVmaW5lZCcgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gIH1cblxuICByZXBseS5zZXR0ZXJNYWtlciA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCB7IG1vZGVsTmFtZSB9ID0gcmVwbHk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdGhpc1tNT0RFTF9LRVldW21vZGVsTmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVwbHk7XG59XG5cbi8qKlxuICogQW4gYXJyYXkgb2YgcHJvcGVyIGNsYXNzIG5hbWVzIHRoYXQgYXJlIHVzZWQgdG8gdGVzdCBmb3IgY2FzZXMgd2hlcmUgdGhlXG4gKiBwcm9wZXIgdXNhZ2Ugb2YgaW5zdGFudGlhdGluZyBhbiBpbnN0YW5jZSBzaG91bGQgcHJlY2x1ZGUgdGhlIHVzZSBvZiBgbmV3YFxuICpcbiAqIEBtZW1iZXJvZiBkZWNvcmF0b3JzXG4gKiBAdHlwZSB7QXJyYXk8U3RyaW5nPn1cbiAqL1xuZXh0cmFjdEJpdHMuRElSRUNUX1RZUEVTID0gW1xuICBTdHJpbmcubmFtZVxuXTtcblxuLyoqXG4gKiBBIHNtYWxsIHN1aXRlIG9mIGZ1bmN0aW9ucyBhIGdldHRlciB0aGF0IGFsbG93cyBlYXN5IG1hbmlwdWxhdGlvbiBvZiB0aGVcbiAqIHRoZSBESVJFQ1RfVFlQRVMgd29ya2Fyb3VuZCBuZWVkZWQgZm9yIHNvbWUgdHlwZXMgb2YgY29tcGxleCBjbGFzc1xuICogd3JhcHBpbmcgYWxsb3dlZCBieSB0aGUgQEdldHRlcnMgYW5kIEBQcm9wZXJ0aWVzIGRlY29yYXRvcnMuIE5hbWVseSB0aGVcbiAqIGFiaWxpdHkgdG8gZG8gc29tZXRoaW5nIGxpa2UgQEdldHRlcnMoJ25hbWUnLCBTdHJpbmcpIHdoaWNoIHdvdWxkIHdyYXAgdGhlXG4gKiBjb250ZW50cyBvZiB3aGF0ZXZlciBpcyBpbiB0aGUgb2JqZWN0cyBtb2RlbCBpbiBhIFN0cmluZyBjYWxsLlxuICpcbiAqIERpcmVjdCB0eXBlcyBhcmUgdGhvc2UgdGhhdCBuZWVkIHRvIGJlIGNhbGxlZCB3aXRob3V0IGBuZXdgIGluIG9yZGVyIGZvciB0aGVcbiAqIGRlc2lyZWQgYmVoYXZpb3IgdG8gcHJlc2VudCBpdHNlbGYuXG4gKlxuICogQG1lbWJlcm9mIGRlY29yYXRvcnNcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAc2luY2UgMi43LjBcbiAqL1xuZXhwb3J0IGNvbnN0IERpcmVjdFR5cGVNYW5hZ2VyID0ge1xuICAvKipcbiAgICogQSBnZXR0ZXIgdGhhdCByZXRyaWV2ZXMgdGhlIGFycmF5IG9mIGRpcmVjdCB0eXBlc1xuICAgKlxuICAgKiBAbWV0aG9kIERpcmVjdFR5cGVNYW5hZ2VyI3R5cGVzXG4gICAqIEBtZW1iZXIge0FycmF5PFN0cmluZz59IHR5cGVzXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5PFN0cmluZz59IGFuIGFycmF5IG9mIGNsYXNzIG5hbWUgc3RyaW5ncy5cbiAgICovXG4gIGdldCB0eXBlcygpOiBBcnJheTxTdHJpbmc+IHtcbiAgICByZXR1cm4gZXh0cmFjdEJpdHMuRElSRUNUX1RZUEVTXG4gIH0sXG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgdGhlIHN1cHBsaWVkIGNsYXNzIG5hbWUgdG8gdGhlIGxpc3Qgb2YgcmVnaXN0ZXJlZCBkaXJlY3QgdHlwZXMuIElmXG4gICAqIGEgY2xhc3Mgb3IgZnVuY3Rpb24gaXMgcGFzc2VkLCByYXRoZXIgdGhhbiBhIFN0cmluZyxcbiAgICpcbiAgICogQG1ldGhvZCBEaXJlY3RUeXBlTWFuYWdlciN0eXBlc1xuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ3xSZWdFeHB9IGNsYXNzTmFtZSB0aGUgbmFtZSBvZiB0aGUgY2xhc3MgdG8gYXBwZW5kLlxuICAgKiBUeXBpY2FsbHkgaXQgaXMgYmVzdCB0byBwYXNzIHRoZSBuYW1lIHByb3BlcnR5IG9mIHRoZSBjbGFzcyBpbiBxdWVzdGlvblxuICAgKiBzdWNoIGFzIGBSZWdFeHAubmFtZWAgb3IgYE15Q2xhc3MubmFtZWAuXG4gICAqL1xuICBhZGQoY2xhc3NOYW1lOiBzdHJpbmcgfCBSZWdFeHAgfCBGdW5jdGlvbik6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgY2xhc3NOYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUubmFtZVxuICAgIH1cblxuICAgIGV4dHJhY3RCaXRzLkRJUkVDVF9UWVBFUy5wdXNoKGNsYXNzTmFtZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvcmljYmx5IGVtcHRpZXMgdGhlIGNvbnRlbnRzIG9mIHRoZSBleHRyYWN0Qml0cy5ESVJFQ1RfVFlQRVMgYXJyYXkuIFRoaXNcbiAgICogaXMgbm90IHJlY29tbWVuZGVkIGFzIGl0IGNhbiBoYXZlIHVuaW50ZW5kZWQgY29uc2VxdWVuY2VzLiBJdCBpc1xuICAgKiByZWNvbW1lbmRlZCB0byB1c2UgYHJlc2V0YCBpbnN0ZWFkXG4gICAqXG4gICAqIEBtZXRob2QgRGlyZWN0VHlwZU1hbmFnZXIjY2xlYXJcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8c3RyaW5nPn0gYW4gYXJyYXkgb2YgY2xhc3MgbmFtZSBTdHJpbmdzIHRoYXQgd2VyZSByZW1vdmVkXG4gICAqIHdoZW4gY2xlYXJlZC5cbiAgICovXG4gIGNsZWFyKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiBleHRyYWN0Qml0cy5ESVJFQ1RfVFlQRVMuc3BsaWNlKDAsIGV4dHJhY3RCaXRzLkRJUkVDVF9UWVBFUy5sZW5ndGgpXG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSByZWNvbW1lbmRlZCB3YXkgdG8gcmVzZXQgdGhlIERJUkVDVF9UWVBFUyBsaXN0LiBUaGlzIHJlbW92ZXMgYWxsXG4gICAqIGNoYW5nZWQgdmFsdWVzLCByZXR1cm5zIHRoZSByZW1vdmVkIGJpdHMsIGFuZCBhZGRzIGJhY2sgaW4gdGhlIGRlZmF1bHRzLlxuICAgKlxuICAgKiBAbWV0aG9kIERpcmVjdFR5cGVNYW5hZ2VyI3Jlc2V0XG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5PHN0cmluZz59IGFuIGFycmF5IG9mIGNsYXNzIG5hbWUgU3RyaW5ncyB0aGF0IHdlcmUgcmVtb3ZlZFxuICAgKiBkdXJpbmcgdGhlIHJlc2V0IHByb2Nlc3MuXG4gICAqL1xuICByZXNldCgpOiBBcnJheTxzdHJpbmc+IHtcbiAgICByZXR1cm4gZXh0cmFjdEJpdHMuRElSRUNUX1RZUEVTLnNwbGljZShcbiAgICAgIDAsXG4gICAgICBleHRyYWN0Qml0cy5ESVJFQ1RfVFlQRVMubGVuZ3RoLFxuICAgICAgU3RyaW5nLm5hbWVcbiAgICApXG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGRlY29yYXRvciBhbGxvd3MgeW91IHRvIGFkZCBhIENsYXNzIG1ldGhvZCB0byB0aGUgRGlyZWN0VHlwZU1hbmFnZXJcbiAqIGFzIGEgZnVuY3Rpb24gdGhhdCBzaG91bGQgbm90IGJlIGludm9rZWQgd2l0aCB0aGUgYG5ld2Aga2V5d29yZC4gRm9yIGFsbFxuICogaW50ZW50cyBhbmQgcHVycG9zZXMgdGhlIGZ1bmN0aW9uIHNob3VsZCBiZSBkZWNsYXJlZCBgc3RhdGljYC5cbiAqXG4gKiBAbWV0aG9kIERpcmVjdFR5cGVBZGRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRhcmdldCBbZGVzY3JpcHRpb25dXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIERpcmVjdFR5cGVBZGQodGFyZ2V0KSB7XG4gIERpcmVjdFR5cGVNYW5hZ2VyLmFkZCh0YXJnZXQpO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vKipcbiAqIFdoZW4gYXBwbHlpbmcgbXVsdGlwbGUgcHJvcGVydHkgZ2V0dGVycyBhbmQgc2V0dGVycywga25vd2luZyBzb21lIGluZm9cbiAqIGFib3V0IHdoYXQgd2FzIGFwcGxpZWQgZWxzZXdoZXJlIGNhbiBiZSBpbXBvcnRhbnQuIFwiVGFnc1wiIGNhbiBiZSBhcHBsaWVkXG4gKiB0aGF0IHN0b3JlIHRoZSBmaWVsZE5hbWUgYW5kIGRlc2NyaXB0b3IgYXBwbGllZCB2aWEgb25lIG9mIHRoZXNlIGRlY29yYXRvcnMuXG4gKlxuICogTXVsdGlwbGUgXCJ0YWdzXCIgYXJlIHN1cHBvcnRlZCB0byBhbGxvdyBmb3IgZGV0ZWN0aW5nIHRoZSBkaWZmZXJlbmNlIGJldHdlZW5cbiAqIGRlY29yYXRvcnMgYXBwbGllZCBieSB0aGUgZGV2ZWxvcGVyIHVzaW5nIGxhdHRpY2UgYW5kIHNvbWV0aGluZyBhdXRvXG4gKiBnZW5lcmF0ZWQgc3VjaCBhcyBhdXRvLXByb3BzLlxuICpcbiAqIEBwYXJhbSAge0dRTEJhc2V9IENsYXNzIGFuIGluc3RhbmNlIG9mIEdRTEJhc2UgdG8gYXBwbHkgdGhlIHRhZ3MgdHBcbiAqIEBwYXJhbSAge0FycmF5PHN0cmluZ3xTeW1ib2w+fSBhZGRUYWdzIGFuIGFycmF5IG9mIFN5bWJvbHMgb3Igc3RyaW5ncyB0byBiZVxuICogd3JhcHBlZCBpbiBTeW1ib2xzIHRoYXQgd2lsbCBiZSB1c2VkIGFzIHRhZyBrZXlzXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGZpZWxkTmFtZSB0aGUgbmFtZSBvZiB0aGUgZmllbGQgYmVpbmcgZGVjb3JhdGVkXG4gKiBAcGFyYW0gIHtPYmplY3R9IGRlc2NyaXB0b3IgdGhlIEphdmFTY3JpcHQgZGVzY3JpcHRvciBvYmplY3QgdG8gYXNzb2NpYXRlXG4gKiB3aXRoIHRoaXMgdGFnZ2VkIGZpZWxkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlUYWdzKFxuICBDbGFzczpHUUxCYXNlLFxuICBhZGRUYWdzOiBBcnJheTxzdHJpbmd8U3ltYm9sPixcbiAgZmllbGROYW1lOiBzdHJpbmcsXG4gIGRlc2NyaXB0b3I6IE9iamVjdFxuKSB7XG4gIGxldCB0YWdzID0gKEFycmF5LmlzQXJyYXkoYWRkVGFncykgJiYgYWRkVGFncyB8fCBbXSlcbiAgICAubWFwKHRhZyA9PiB0eXBlb2YgdGFnID09PSAnc3RyaW5nJyAmJiBTeW1ib2wuZm9yKHRhZykgfHwgdGFnKVxuICAgIC5maWx0ZXIodGFnID0+IHR5cGVvZiB0YWcgPT09ICdzeW1ib2wnKVxuXG4gIHRhZ3MuZm9yRWFjaCh0YWcgPT4ge1xuICAgIENsYXNzW01FVEFfS0VZXVt0YWddID0gQ2xhc3NbTUVUQV9LRVldW3RhZ10gfHwge31cbiAgICBDbGFzc1tNRVRBX0tFWV1bdGFnXVtmaWVsZE5hbWVdID0gZGVzY3JpcHRvclxuICB9KVxufVxuXG4vKipcbiAqIFdoZW4gd29ya2luZyB3aXRoIGBHUUxCYXNlYCBpbnN0YW5jZXMgdGhhdCBleHBvc2UgcHJvcGVydGllc1xuICogdGhhdCBoYXZlIGEgMToxIG1hcHBpbmcgdG8gdGhlaXIgb3duIG1vZGVsIHByb3BlcnR5IG9mIHRoZVxuICogc2FtZSBuYW1lLCBhZGRpbmcgdGhlIGdldHRlcnMgbWFudWFsbHkgY2FuIGJlIGFubm95aW5nLiBUaGlzXG4gKiB0YWtlcyBhbiBpbmRldGVybWluYXRlIGFtb3VudCBvZiBzdHJpbmdzIHJlcHJlc2VudGluZyB0aGVcbiAqIHByb3BlcnRpZXMgZm9yIHdoaWNoIGdldHRlcnMgc2hvdWxkIGJlIGluamVjdGVkLlxuICpcbiAqIEBmdW5jdGlvbiDwn4+34qCAR2V0dGVyc1xuICogQG1lbWJlcm9mISBkZWNvcmF0b3JzXG4gKlxuICogQHBhcmFtIHtBcnJheTxTdHJpbmd8QXJyYXk8U3RyaW5nPj59IHByb3BlcnR5TmFtZXMgaWYgdGhlIG1vZGVsIGhhcyAnbmFtZSdcbiAqIGFuZCAnYWdlJyBhcyBwcm9wZXJ0aWVzLCB0aGVuIHBhc3NpbmcgdGhvc2UgdHdvIHN0cmluZ3Mgd2lsbCByZXN1bHRcbiAqIGluIGdldHRlcnMgdGhhdCBzdXJmYWNlIHRob3NlIHByb3BlcnRpZXMgYXMgR3JhcGhRTCBmaWVsZHMuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBjbGFzcyBkZWNvcmF0b3IgbWV0aG9kLnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEdldHRlcnMoXG4gIC4uLnByb3BlcnR5TmFtZXM6IEFycmF5PFN0cmluZ3xBcnJheTxTdHJpbmd8RnVuY3Rpb24+PlxuKTogRnVuY3Rpb24ge1xuICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBtaXhlZCwgYWRkVGFnczogQXJyYXk8c3RyaW5nfFN5bWJvbD4gPSBbXSk6IG1peGVkIHtcbiAgICBmb3IgKGxldCBwcm9wZXJ0eSBvZiBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgICBsZXQgeyBmaWVsZE5hbWUsIGdldHRlck1ha2VyIH0gPSBleHRyYWN0Qml0cyhwcm9wZXJ0eSk7XG4gICAgICBsZXQgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LnByb3RvdHlwZSwgZmllbGROYW1lKVxuICAgICAgbGV0IGhhc0ltcGwgPSBkZXNjICYmIChkZXNjLmdldCB8fCB0eXBlb2YgZGVzYy52YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGxldCB0YWdzID0gW0dFVFRFUlNdLmNvbmNhdChBcnJheS5pc0FycmF5KGFkZFRhZ3MpICYmIGFkZFRhZ3MgfHwgW10pXG5cbiAgICAgIGlmICghaGFzSW1wbCkge1xuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IHtcbiAgICAgICAgICBnZXQ6IGdldHRlck1ha2VyKClcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5VGFncyh0YXJnZXQsIHRhZ3MsIGZpZWxkTmFtZSwgZGVzY3JpcHRvcilcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldC5wcm90b3R5cGUsIGZpZWxkTmFtZSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIGBTa2lwcGluZyBnZXR0ZXIgZm9yICR7dGFyZ2V0Lm5hbWV9LiR7ZmllbGROYW1lfTsgYWxyZWFkeSBleGlzdHNgXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG59XG5cbi8qKlxuICogV2hlbiB3b3JraW5nIHdpdGggYEdRTEJhc2VgIGluc3RhbmNlcyB0aGF0IGV4cG9zZSBwcm9wZXJ0aWVzXG4gKiB0aGF0IGhhdmUgYSAxOjEgbWFwcGluZyB0byB0aGVpciBvd24gbW9kZWwgcHJvcGVydHkgb2YgdGhlXG4gKiBzYW1lIG5hbWUsIGFkZGluZyB0aGUgc2V0dGVycyBtYW51YWxseSBjYW4gYmUgYW5ub3lpbmcuIFRoaXNcbiAqIHRha2VzIGFuIGluZGV0ZXJtaW5hdGUgYW1vdW50IG9mIHN0cmluZ3MgcmVwcmVzZW50aW5nIHRoZVxuICogcHJvcGVydGllcyBmb3Igd2hpY2ggc2V0dGVycyBzaG91bGQgYmUgaW5qZWN0ZWQuXG4gKlxuICogQGZ1bmN0aW9uIPCfj7fioIBTZXR0ZXJzXG4gKiBAbWVtYmVyb2YhIGRlY29yYXRvcnNcbiAqIEBzaW5jZSAyLjEuMFxuICpcbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nfEFycmF5PFN0cmluZz4+fSBwcm9wZXJ0eU5hbWVzIGlmIHRoZSBtb2RlbCBoYXNcbiAqICduYW1lJyBhbmQgJ2FnZScgYXMgcHJvcGVydGllcywgdGhlbiBwYXNzaW5nIHRob3NlIHR3byBzdHJpbmdzIHdpbGxcbiAqIHJlc3VsdCBpbiBzZXR0ZXJzIHRoYXQgc3VyZmFjZSB0aG9zZSBwcm9wZXJ0aWVzIGFzIEdyYXBoUUwgZmllbGRzLlxuICogQHJldHVybiB7RnVuY3Rpb259IGEgY2xhc3MgZGVjb3JhdG9yIG1ldGhvZFxuICovXG5leHBvcnQgZnVuY3Rpb24gU2V0dGVycyhcbiAgLi4ucHJvcGVydHlOYW1lczogQXJyYXk8U3RyaW5nfEFycmF5PFN0cmluZ3xGdW5jdGlvbj4+XG4pOiBGdW5jdGlvbiB7XG4gIHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IG1peGVkLCBhZGRUYWdzOiBBcnJheTxTdHJpbmd8U3ltYm9sPiA9IFtdKTogbWl4ZWQge1xuICAgIGZvciAobGV0IHByb3BlcnR5IG9mIHByb3BlcnR5TmFtZXMpIHtcbiAgICAgIGxldCB7IGZpZWxkTmFtZSwgc2V0dGVyTWFrZXIgfSA9IGV4dHJhY3RCaXRzKHByb3BlcnR5KTtcbiAgICAgIGxldCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQucHJvdG90eXBlLCBmaWVsZE5hbWUpXG4gICAgICBsZXQgaGFzSW1wbCA9IGRlc2MgJiYgKGRlc2MuZ2V0IHx8IHR5cGVvZiBkZXNjLnZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgbGV0IHRhZ3MgPSBbU0VUVEVSU10uY29uY2F0KEFycmF5LmlzQXJyYXkoYWRkVGFncykgJiYgYWRkVGFncyB8fCBbXSlcblxuICAgICAgaWYgKCFoYXNJbXBsKSB7XG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0ge1xuICAgICAgICAgIHNldDogc2V0dGVyTWFrZXIoKVxuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHlUYWdzKHRhcmdldCwgdGFncywgZmllbGROYW1lLCBkZXNjcmlwdG9yKVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LnByb3RvdHlwZSwgZmllbGROYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYFNraXBwaW5nIHNldHRlciBmb3IgJHt0YXJnZXQubmFtZX0uJHtmaWVsZE5hbWV9OyBhbHJlYWR5IGV4aXN0c2BcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBXaGVuIHdvcmtpbmcgd2l0aCBgR1FMQmFzZWAgaW5zdGFuY2VzIHRoYXQgZXhwb3NlIHByb3BlcnRpZXNcbiAqIHRoYXQgaGF2ZSBhIDE6MSBtYXBwaW5nIHRvIHRoZWlyIG93biBtb2RlbCBwcm9wZXJ0eSBvZiB0aGVcbiAqIHNhbWUgbmFtZSwgYWRkaW5nIHRoZSBnZXR0ZXJzIG1hbnVhbGx5IGNhbiBiZSBhbm5veWluZy4gVGhpc1xuICogdGFrZXMgYW4gaW5kZXRlcm1pbmF0ZSBhbW91bnQgb2Ygc3RyaW5ncyByZXByZXNlbnRpbmcgdGhlXG4gKiBwcm9wZXJ0aWVzIGZvciB3aGljaCBnZXR0ZXJzIHNob3VsZCBiZSBpbmplY3RlZC5cbiAqXG4gKiBUaGlzIG1ldGhvZCBjcmVhdGVzIGJvdGggZ2V0dGVycyBhbmQgc2V0dGVyc1xuICpcbiAqIEBmdW5jdGlvbiDwn4+34qCAUHJvcGVydGllc1xuICogQG1lbWJlcm9mISBkZWNvcmF0b3JzXG4gKiBAc2luY2UgMi4xLjBcbiAqXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZ3xBcnJheTxTdHJpbmc+Pn0gcHJvcGVydHlOYW1lcyBpZiB0aGUgbW9kZWwgaGFzICduYW1lJ1xuICogYW5kICdhZ2UnIGFzIHByb3BlcnRpZXMsIHRoZW4gcGFzc2luZyB0aG9zZSB0d28gc3RyaW5ncyB3aWxsIHJlc3VsdFxuICogaW4gZ2V0dGVycyBhbmQgc2V0dGVycyB0aGF0IHN1cmZhY2UgdGhvc2UgcHJvcGVydGllcyBhcyBHcmFwaFFMIGZpZWxkcy5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGNsYXNzIGRlY29yYXRvciBtZXRob2RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFByb3BlcnRpZXMoXG4gIC4uLnByb3BlcnR5TmFtZXM6IEFycmF5PFN0cmluZ3xBcnJheTxTdHJpbmd8RnVuY3Rpb24+PlxuKTogRnVuY3Rpb24ge1xuICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBtaXhlZCwgYWRkVGFnczogQXJyYXk8U3RyaW5nfFN5bWJvbD4gPSBbXSk6IG1peGVkIHtcbiAgICBmb3IgKGxldCBwcm9wZXJ0eSBvZiBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgICBsZXQge2ZpZWxkTmFtZSwgZ2V0dGVyTWFrZXIsIHNldHRlck1ha2VyIH0gPSBleHRyYWN0Qml0cyhwcm9wZXJ0eSk7XG4gICAgICBsZXQgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LnByb3RvdHlwZSwgZmllbGROYW1lKVxuICAgICAgbGV0IGhhc0ltcGwgPSBkZXNjICYmIChkZXNjLmdldCB8fCB0eXBlb2YgZGVzYy52YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGxldCB0YWdzID0gW1BST1BTXS5jb25jYXQoQXJyYXkuaXNBcnJheShhZGRUYWdzKSAmJiBhZGRUYWdzIHx8IFtdKVxuXG4gICAgICBpZiAoIWhhc0ltcGwpIHtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSB7XG4gICAgICAgICAgc2V0OiBzZXR0ZXJNYWtlcigpLFxuICAgICAgICAgIGdldDogZ2V0dGVyTWFrZXIoKVxuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHlUYWdzKHRhcmdldCwgdGFncywgZmllbGROYW1lLCBkZXNjcmlwdG9yKVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LnByb3RvdHlwZSwgZmllbGROYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYFNraXBwaW5nIHByb3BlcnRpZXMgZm9yICR7dGFyZ2V0Lm5hbWV9LiR7ZmllbGROYW1lfTsgYWxyZWFkeSBleGlzdHNgXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb3BlcnRpZXM7XG4iXX0=