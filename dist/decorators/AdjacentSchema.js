'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdjacentSchema = undefined;

var _for = require('babel-runtime/core-js/symbol/for');

var _for2 = _interopRequireDefault(_for);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

exports.default = AdjacentSchema;

var _GQLBase = require('../GQLBase');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A decorator that does three things. First it defines the
 * module() static method that is required when using adjacent
 * schema files. Secondly, it defines a SCHEMA getter that
 * returns `GQLBase.ADJACENT_FILE`. Finally it sets a static
 * getter with the `Symbol`, `@adjacentSchema` so that other
 * can determine whether or not the decorator was used.
 *
 * @function 🏷⠀AdjacentSchema
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
        get: function get() {
          return classModule;
        }
      },

      SCHEMA: {
        get: function get() {
          return _GQLBase.GQLBase.ADJACENT_FILE;
        }
      },

      [(0, _for2.default)('@adjacentSchema')]: {
        get: function get() {
          return true;
        }
      }
    });
  };
} /** @namespace decorators */


exports.AdjacentSchema = AdjacentSchema;
//# sourceMappingURL=AdjacentSchema.js.map