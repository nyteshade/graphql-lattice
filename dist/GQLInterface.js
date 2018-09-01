"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GQLInterface = void 0;

var _GQLBase = require("./GQLBase");

var _graphql = require("graphql");

/**
 @namespace GQLInterface
 
 */

/**
 * Used by Lattice to implement interface types in the schema when necessary
 *
 * @class GQLInterface
 */
class GQLInterface extends _GQLBase.GQLBase {
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
  static resolveType(model) {
    throw new Error(`
      You must override "resolveType(model)" in your GQLInterface instance
      and determine the implementor type by the contents of the supplied
      model. Returning "null" when nothing matches.
    `);
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


  static get GQL_TYPE() {
    return _graphql.GraphQLInterfaceType;
  }

}

exports.GQLInterface = GQLInterface;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9HUUxJbnRlcmZhY2UuanMiXSwibmFtZXMiOlsiR1FMSW50ZXJmYWNlIiwiR1FMQmFzZSIsInJlc29sdmVUeXBlIiwibW9kZWwiLCJFcnJvciIsIkdRTF9UWVBFIiwiR3JhcGhRTEludGVyZmFjZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7QUFDQTs7QUFOQTs7Ozs7QUFRQTs7Ozs7QUFLTyxNQUFNQSxZQUFOLFNBQTJCQyxnQkFBM0IsQ0FBbUM7QUFFeEM7Ozs7Ozs7Ozs7Ozs7QUFhQSxTQUFPQyxXQUFQLENBQW1CQyxLQUFuQixFQUF5QztBQUN2QyxVQUFNLElBQUlDLEtBQUosQ0FBVzs7OztLQUFYLENBQU47QUFLRDtBQUVEOzs7Ozs7Ozs7Ozs7OztBQVlBLGFBQVdDLFFBQVgsR0FBZ0M7QUFDOUIsV0FBT0MsNkJBQVA7QUFDRDs7QUFyQ3VDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gQG5hbWVzcGFjZSBHUUxJbnRlcmZhY2VcbiBAZmxvd1xuICovXG5cbmltcG9ydCB7IEdRTEJhc2UgfSBmcm9tICcuL0dRTEJhc2UnXG5pbXBvcnQgeyBHcmFwaFFMSW50ZXJmYWNlVHlwZSB9IGZyb20gJ2dyYXBocWwnXG5cbi8qKlxuICogVXNlZCBieSBMYXR0aWNlIHRvIGltcGxlbWVudCBpbnRlcmZhY2UgdHlwZXMgaW4gdGhlIHNjaGVtYSB3aGVuIG5lY2Vzc2FyeVxuICpcbiAqIEBjbGFzcyBHUUxJbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGNsYXNzIEdRTEludGVyZmFjZSBleHRlbmRzIEdRTEJhc2Uge1xuXG4gIC8qKlxuICAgKiBUaGlzIG5lZWRzIHRvIGJlIGFibGUgdG8sIGRlcGVuZGluZyBvbiB5b3VyIGltcGxlbWVudG9ycywgaWRlbnRpZnlcbiAgICogd2hpY2ggb24gdGhlIGRhdGEgYWN0dWFsbHkgaXMgZ2l2ZW4gdGhlIG1vZGVsIHRvIHdvcmsgd2l0aC5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEludGVyZmFjZVxuICAgKiBAbWV0aG9kIOKMvuKggHJlc29sdmVUeXBlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHttaXhlZH0gbW9kZWwgdGhlIGRhdGEgeW91IGNhbiB1c2UgdG8gaW5zdGFudGlhdGUgdGhlIHR5cGUgb2ZcbiAgICogb2JqZWN0IGluIHF1ZXN0aW9uLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGEgc3RyaW5nIG1hdGNoaW5nIHRoZSBuYW1lIG9mIGEgZGVmaW5lZCBHcmFwaFFMIHR5cGVcbiAgICogZm91bmQgZWxzZXdoZXJlIGluIHlvdXIgc2NoZW1hXG4gICAqL1xuICBzdGF0aWMgcmVzb2x2ZVR5cGUobW9kZWw6IG1peGVkKTogc3RyaW5nIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgWW91IG11c3Qgb3ZlcnJpZGUgXCJyZXNvbHZlVHlwZShtb2RlbClcIiBpbiB5b3VyIEdRTEludGVyZmFjZSBpbnN0YW5jZVxuICAgICAgYW5kIGRldGVybWluZSB0aGUgaW1wbGVtZW50b3IgdHlwZSBieSB0aGUgY29udGVudHMgb2YgdGhlIHN1cHBsaWVkXG4gICAgICBtb2RlbC4gUmV0dXJuaW5nIFwibnVsbFwiIHdoZW4gbm90aGluZyBtYXRjaGVzLlxuICAgIGApO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbm90ZXMgdGhhdCB0aGlzIEdRTEJhc2UgZGVzY2VuZGVudCBpcyBkZXNjcmliaW5nIGEgZ3JhcGhxbFxuICAgKiBpbnRlcmZhY2UgdHlwZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIEdRTEludGVyZmFjZVxuICAgKiBAbWV0aG9kIOKsh++4juKggEdRTF9UWVBFXG4gICAqIEBzdGF0aWNcbiAgICogQGNvbnN0XG4gICAqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIHR5cGUsIHN1Y2ggYXMgYEdyYXBoUUxPYmplY3RUeXBlYCBvclxuICAgKiBgR3JhcGhRTEludGVyZmFjZVR5cGVgXG4gICAqL1xuICBzdGF0aWMgZ2V0IEdRTF9UWVBFKCk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gR3JhcGhRTEludGVyZmFjZVR5cGU7XG4gIH1cbn1cbiJdfQ==