"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperties = require("babel-runtime/core-js/object/define-properties");

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
 * @function 🏷⠀Schema
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
        get: function get() {
          return schemaString;
        }
      }
    });
  };
}

exports.default = Schema;
//# sourceMappingURL=Schema.js.map