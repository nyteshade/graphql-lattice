"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLInterface = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _GQLBase2 = require("./GQLBase");

var _graphql = require("graphql");

/**
 @namespace GQLInterface
 
 */

/**
 * Used by Lattice to implement interface types in the schema when necessary
 *
 * @class GQLInterface
 */
var GQLInterface =
/*#__PURE__*/
function (_GQLBase) {
  (0, _inherits2.default)(GQLInterface, _GQLBase);

  function GQLInterface() {
    (0, _classCallCheck2.default)(this, GQLInterface);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GQLInterface).apply(this, arguments));
  }

  (0, _createClass2.default)(GQLInterface, null, [{
    key: "resolveType",

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
    value: function resolveType(model) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxJbnRlcmZhY2UuanMiXSwibmFtZXMiOlsiR1FMSW50ZXJmYWNlIiwibW9kZWwiLCJFcnJvciIsIkdyYXBoUUxJbnRlcmZhY2VUeXBlIiwiR1FMQmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBOztBQUNBOztBQU5BOzs7OztBQVFBOzs7OztJQUthQSxZOzs7Ozs7Ozs7Ozs7O0FBRVg7Ozs7Ozs7Ozs7Ozs7Z0NBYW1CQyxLLEVBQXNCO0FBQ3ZDLFlBQU0sSUFBSUMsS0FBSix5TkFBTjtBQUtEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozt3QkFZZ0M7QUFDOUIsYUFBT0MsNkJBQVA7QUFDRDs7O0VBckMrQkMsaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiBAbmFtZXNwYWNlIEdRTEludGVyZmFjZVxuIEBmbG93XG4gKi9cblxuaW1wb3J0IHsgR1FMQmFzZSB9IGZyb20gJy4vR1FMQmFzZSdcbmltcG9ydCB7IEdyYXBoUUxJbnRlcmZhY2VUeXBlIH0gZnJvbSAnZ3JhcGhxbCdcblxuLyoqXG4gKiBVc2VkIGJ5IExhdHRpY2UgdG8gaW1wbGVtZW50IGludGVyZmFjZSB0eXBlcyBpbiB0aGUgc2NoZW1hIHdoZW4gbmVjZXNzYXJ5XG4gKlxuICogQGNsYXNzIEdRTEludGVyZmFjZVxuICovXG5leHBvcnQgY2xhc3MgR1FMSW50ZXJmYWNlIGV4dGVuZHMgR1FMQmFzZSB7XG5cbiAgLyoqXG4gICAqIFRoaXMgbmVlZHMgdG8gYmUgYWJsZSB0bywgZGVwZW5kaW5nIG9uIHlvdXIgaW1wbGVtZW50b3JzLCBpZGVudGlmeVxuICAgKiB3aGljaCBvbiB0aGUgZGF0YSBhY3R1YWxseSBpcyBnaXZlbiB0aGUgbW9kZWwgdG8gd29yayB3aXRoLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMSW50ZXJmYWNlXG4gICAqIEBtZXRob2Qg4oy+4qCAcmVzb2x2ZVR5cGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge21peGVkfSBtb2RlbCB0aGUgZGF0YSB5b3UgY2FuIHVzZSB0byBpbnN0YW50aWF0ZSB0aGUgdHlwZSBvZlxuICAgKiBvYmplY3QgaW4gcXVlc3Rpb24uXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYSBzdHJpbmcgbWF0Y2hpbmcgdGhlIG5hbWUgb2YgYSBkZWZpbmVkIEdyYXBoUUwgdHlwZVxuICAgKiBmb3VuZCBlbHNld2hlcmUgaW4geW91ciBzY2hlbWFcbiAgICovXG4gIHN0YXRpYyByZXNvbHZlVHlwZShtb2RlbDogbWl4ZWQpOiBzdHJpbmcge1xuICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICBZb3UgbXVzdCBvdmVycmlkZSBcInJlc29sdmVUeXBlKG1vZGVsKVwiIGluIHlvdXIgR1FMSW50ZXJmYWNlIGluc3RhbmNlXG4gICAgICBhbmQgZGV0ZXJtaW5lIHRoZSBpbXBsZW1lbnRvciB0eXBlIGJ5IHRoZSBjb250ZW50cyBvZiB0aGUgc3VwcGxpZWRcbiAgICAgIG1vZGVsLiBSZXR1cm5pbmcgXCJudWxsXCIgd2hlbiBub3RoaW5nIG1hdGNoZXMuXG4gICAgYCk7XG4gIH1cblxuICAvKipcbiAgICogRGVub3RlcyB0aGF0IHRoaXMgR1FMQmFzZSBkZXNjZW5kZW50IGlzIGRlc2NyaWJpbmcgYSBncmFwaHFsXG4gICAqIGludGVyZmFjZSB0eXBlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgR1FMSW50ZXJmYWNlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAR1FMX1RZUEVcbiAgICogQHN0YXRpY1xuICAgKiBAY29uc3RcbiAgICpcbiAgICogQHJldHVybiB7RnVuY3Rpb259IGEgdHlwZSwgc3VjaCBhcyBgR3JhcGhRTE9iamVjdFR5cGVgIG9yXG4gICAqIGBHcmFwaFFMSW50ZXJmYWNlVHlwZWBcbiAgICovXG4gIHN0YXRpYyBnZXQgR1FMX1RZUEUoKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBHcmFwaFFMSW50ZXJmYWNlVHlwZTtcbiAgfVxufVxuIl19