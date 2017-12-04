'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileSchema = undefined;

var _for = require('babel-runtime/core-js/symbol/for');

var _for2 = _interopRequireDefault(_for);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

exports.default = FileSchema;

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
 * @function 🏷⠀FileSchema
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

    // @ComputedType
    return (0, _defineProperties2.default)(target, {
      SCHEMA: {
        get: function get() {
          return _GQLBase.GQLBase.IDLFilePath(path, extension);
        }
      },

      [(0, _for2.default)('@fileSchema')]: {
        get: function get() {
          return true;
        }
      }
    });
  };
} /** @namespace decorators */


exports.FileSchema = FileSchema;
//# sourceMappingURL=FileSchema.js.map