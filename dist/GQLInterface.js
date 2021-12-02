"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLInterface = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _GQLBase2 = require("./GQLBase");

var _graphql = require("graphql");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Used by Lattice to implement interface types in the schema when necessary
 *
 * @class GQLInterface
 */
var GQLInterface = /*#__PURE__*/function (_GQLBase) {
  (0, _inherits2["default"])(GQLInterface, _GQLBase);

  var _super = _createSuper(GQLInterface);

  function GQLInterface() {
    (0, _classCallCheck2["default"])(this, GQLInterface);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(GQLInterface, null, [{
    key: "resolveType",
    value:
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
    function resolveType(model) {
      throw new Error("\n      You must override \"resolveType(model)\" in your GQLInterface instance\n      and determine the implementor type by the contents of the supplied\n      model. Returning \"null\" when nothing matches.\n    ");
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
    key: "GQL_TYPE",
    get: function get() {
      return _graphql.GraphQLInterfaceType;
    }
  }]);
  return GQLInterface;
}(_GQLBase2.GQLBase);

exports.GQLInterface = GQLInterface;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxJbnRlcmZhY2UuanMiXSwibmFtZXMiOlsiR1FMSW50ZXJmYWNlIiwibW9kZWwiLCJFcnJvciIsIkdyYXBoUUxJbnRlcmZhY2VUeXBlIiwiR1FMQmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBOztBQUNBOzs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ2FBLFk7Ozs7Ozs7Ozs7Ozs7QUFFWDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLHlCQUFtQkMsS0FBbkIsRUFBeUM7QUFDdkMsWUFBTSxJQUFJQyxLQUFKLHlOQUFOO0FBS0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7U0FDRSxlQUFnQztBQUM5QixhQUFPQyw2QkFBUDtBQUNEOzs7RUFyQytCQyxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuIEBuYW1lc3BhY2UgR1FMSW50ZXJmYWNlXG4gQGZsb3dcbiAqL1xuXG5pbXBvcnQgeyBHUUxCYXNlIH0gZnJvbSAnLi9HUUxCYXNlJ1xuaW1wb3J0IHsgR3JhcGhRTEludGVyZmFjZVR5cGUgfSBmcm9tICdncmFwaHFsJ1xuXG4vKipcbiAqIFVzZWQgYnkgTGF0dGljZSB0byBpbXBsZW1lbnQgaW50ZXJmYWNlIHR5cGVzIGluIHRoZSBzY2hlbWEgd2hlbiBuZWNlc3NhcnlcbiAqXG4gKiBAY2xhc3MgR1FMSW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBHUUxJbnRlcmZhY2UgZXh0ZW5kcyBHUUxCYXNlIHtcblxuICAvKipcbiAgICogVGhpcyBuZWVkcyB0byBiZSBhYmxlIHRvLCBkZXBlbmRpbmcgb24geW91ciBpbXBsZW1lbnRvcnMsIGlkZW50aWZ5XG4gICAqIHdoaWNoIG9uIHRoZSBkYXRhIGFjdHVhbGx5IGlzIGdpdmVuIHRoZSBtb2RlbCB0byB3b3JrIHdpdGguXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxJbnRlcmZhY2VcbiAgICogQG1ldGhvZCDijL7ioIByZXNvbHZlVHlwZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bWl4ZWR9IG1vZGVsIHRoZSBkYXRhIHlvdSBjYW4gdXNlIHRvIGluc3RhbnRpYXRlIHRoZSB0eXBlIG9mXG4gICAqIG9iamVjdCBpbiBxdWVzdGlvbi5cbiAgICogQHJldHVybiB7c3RyaW5nfSBhIHN0cmluZyBtYXRjaGluZyB0aGUgbmFtZSBvZiBhIGRlZmluZWQgR3JhcGhRTCB0eXBlXG4gICAqIGZvdW5kIGVsc2V3aGVyZSBpbiB5b3VyIHNjaGVtYVxuICAgKi9cbiAgc3RhdGljIHJlc29sdmVUeXBlKG1vZGVsOiBtaXhlZCk6IHN0cmluZyB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgIFlvdSBtdXN0IG92ZXJyaWRlIFwicmVzb2x2ZVR5cGUobW9kZWwpXCIgaW4geW91ciBHUUxJbnRlcmZhY2UgaW5zdGFuY2VcbiAgICAgIGFuZCBkZXRlcm1pbmUgdGhlIGltcGxlbWVudG9yIHR5cGUgYnkgdGhlIGNvbnRlbnRzIG9mIHRoZSBzdXBwbGllZFxuICAgICAgbW9kZWwuIFJldHVybmluZyBcIm51bGxcIiB3aGVuIG5vdGhpbmcgbWF0Y2hlcy5cbiAgICBgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZW5vdGVzIHRoYXQgdGhpcyBHUUxCYXNlIGRlc2NlbmRlbnQgaXMgZGVzY3JpYmluZyBhIGdyYXBocWxcbiAgICogaW50ZXJmYWNlIHR5cGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBHUUxJbnRlcmZhY2VcbiAgICogQG1ldGhvZCDirIfvuI7ioIBHUUxfVFlQRVxuICAgKiBAc3RhdGljXG4gICAqIEBjb25zdFxuICAgKlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSB0eXBlLCBzdWNoIGFzIGBHcmFwaFFMT2JqZWN0VHlwZWAgb3JcbiAgICogYEdyYXBoUUxJbnRlcmZhY2VUeXBlYFxuICAgKi9cbiAgc3RhdGljIGdldCBHUUxfVFlQRSgpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIEdyYXBoUUxJbnRlcmZhY2VUeXBlO1xuICB9XG59XG4iXX0=