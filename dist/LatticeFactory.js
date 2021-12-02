"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationResults = exports.LatticeFactory = exports.CHECK_SCHEMA = exports.CHECK_RESOLVERS = exports.CHECK_API_DOCS = exports.CHECKLIST = void 0;
exports.getChecklist = getChecklist;
exports.hasChecklist = hasChecklist;
exports.isFactoryClass = void 0;
exports.newChecklist = newChecklist;
exports.setChecklist = setChecklist;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineEnumerableProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/defineEnumerableProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _GQLBase = require("./GQLBase");

var _GQLEnum = require("./GQLEnum");

var _GQLInterface = require("./GQLInterface");

var _GQLScalar = require("./GQLScalar");

var _SyntaxTree = require("./SyntaxTree");

var _neTagFns = require("ne-tag-fns");

var _neTypes = require("ne-types");

var _util = require("util");

var _Resolvers = require("./decorators/Resolvers");

var _ModelProperties = require("./decorators/ModelProperties");

var _utils = require("./utils");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15;

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _i = function _i() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _util.inspect.apply(void 0, args.concat([{
    colors: true,
    depth: 3
  }]));
};
/**
 * The CHECKLIST Symbol is used as a storage key in the metadata staging
 * area for each of the GQLBase extended classes. In the LatticeFactory
 * it is used to determine where in the flow of construction the class
 * currently is.
 *
 * @type {Symbol}
 */


var CHECKLIST = Symbol["for"]('checklist');
/**
 * The CHECK_SCHEMA Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its SCHEMA
 * getter defined.
 *
 * @type {Symbol}
 */

exports.CHECKLIST = CHECKLIST;
var CHECK_SCHEMA = Symbol["for"]('checklist-schema');
/**
 * The CHECK_RESOLVERS Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its instance
 * field resolvers as well as its static Query, Mutation and Subscription
 * resolvers injected and defined.
 *
 * @type {Symbol}
 */

exports.CHECK_SCHEMA = CHECK_SCHEMA;
var CHECK_RESOLVERS = Symbol["for"]('checklist-resolvers');
/**
 * The CHECK_API_DOCS Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its api docs
 * defined, processed and setup on the class in a way that it will be
 * picked up in the build lifecycle.
 *
 * @type {Symbol}
 */

exports.CHECK_RESOLVERS = CHECK_RESOLVERS;
var CHECK_API_DOCS = Symbol["for"]('checklist-api-docs');
/**
 * Peeks into the metadata storage area of a given GQLBase extended
 * class and fetches the factory checklist if one exists.
 *
 * @param {Function} Class a reference to the GQLBase class to peek in
 * @return {Object} an object setup with at least three booleans keyed by
 * the constants CHECK_SCHEMA, CHECK_RESOLVERS, and CHECK_API_DOCS or null
 * if none exists
 */

exports.CHECK_API_DOCS = CHECK_API_DOCS;

function getChecklist(Class) {
  return Class && Class[_GQLBase.META_KEY] && Class[_GQLBase.META_KEY][CHECKLIST] || null;
}
/**
 * Obtains the checklist from the supplied GQLBase extended class. If the
 * class has a checklist, its checklist item is set to true or the boolean
 * value specified.
 *
 * @param {Function} Class a reference to the GQLBase class to set
 * @param {Symbol} item one of CHECK_SCHEMA, CHECK_RESOLVERS, or
 * CHECK_API_DOCS
 * @param {Boolean} value the value for the checklist item to set
 */


function setChecklist(Class, item) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var checklist = getChecklist(Class);

  if (checklist) {
    // $FlowFixMe
    checklist[item] = value;
  }
}
/**
 * This function, when invoked with only a class will return true if the
 * Class has a defined checklist. If one ore more CHECKLIST symbols are
 * passed, the function will only return true if all the supplied symbols
 * are set to truthy values.
 *
 * @param {Function} Class a reference to the GQLBase class to set
 * @param {Array<Symbol>} items any of CHECK_SCHEMA, CHECK_RESOLVERS, or
 * CHECK_API_DOCS
 * @return {Boolean} true if the checklist and/or all items are true and
 * present.
 */


function hasChecklist(Class) {
  var checklist = getChecklist(Class);

  for (var _len2 = arguments.length, items = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    items[_key2 - 1] = arguments[_key2];
  }

  if (checklist && items.length) {
    var _iterator = _createForOfIteratorHelper(items),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;

        if (!checklist[item]) {
          return false;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return true;
  }

  return checklist;
}
/**
 * Injects and creates a new CHECKLIST object on the supplied GQLBase
 * extended class. All items are installed and set to false.
 *
 * @param {Function} Class a reference to the GQLBase class to set
 */


function newChecklist(Class) {
  if (Class) {
    var _keys, _complete, _Class$META_KEY$CHECK, _mutatorMap;

    // $FlowFixMe
    Class[_GQLBase.META_KEY][CHECKLIST] = (_Class$META_KEY$CHECK = {}, (0, _defineProperty2["default"])(_Class$META_KEY$CHECK, CHECK_SCHEMA, false), (0, _defineProperty2["default"])(_Class$META_KEY$CHECK, CHECK_RESOLVERS, false), (0, _defineProperty2["default"])(_Class$META_KEY$CHECK, CHECK_API_DOCS, false), _keys = "keys", _mutatorMap = {}, _mutatorMap[_keys] = _mutatorMap[_keys] || {}, _mutatorMap[_keys].get = function () {
      return [CHECK_SCHEMA, CHECK_RESOLVERS, CHECK_API_DOCS];
    }, _complete = "complete", _mutatorMap[_complete] = _mutatorMap[_complete] || {}, _mutatorMap[_complete].get = function () {
      var _this = this;

      return this.keys.reduce(function (p, c, i, a) {
        if (!p || !_this[c]) {
          return false;
        }
      }, true);
    }, (0, _defineEnumerableProperties2["default"])(_Class$META_KEY$CHECK, _mutatorMap), _Class$META_KEY$CHECK);
  } else {
    throw new Error((0, _neTagFns.customDedent)({
      dropLowest: true
    })(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n      Cannot create new checklist metadata on a non-existent class\n    "]))));
  }
}

var ValidationResults = /*#__PURE__*/function (_Symbol$toStringTag, _Symbol$toStringTag2) {
  function ValidationResults() {
    var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    (0, _classCallCheck2["default"])(this, ValidationResults);
    this.errors = errors;
  }

  (0, _createClass2["default"])(ValidationResults, [{
    key: "valid",
    get: function get() {
      return this.errors.length === 0;
    } // $FlowFixMe

  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return this.constructor.name;
    } // $FlowFixMe

  }], [{
    key: _Symbol$toStringTag2,
    get: function get() {
      return this.name;
    }
  }]);
  return ValidationResults;
}(Symbol.toStringTag, Symbol.toStringTag);

exports.ValidationResults = ValidationResults;

var LatticeFactory = /*#__PURE__*/function (_Symbol$toStringTag3) {
  function LatticeFactory() {
    (0, _classCallCheck2["default"])(this, LatticeFactory);
  }

  (0, _createClass2["default"])(LatticeFactory, null, [{
    key: "validateTemplate",
    value:
    /**
     * Walks through a supplied template object and collects errors with its
     * format before bubbling up an exception if any part of it fails to
     * pass muster. The exception can be prevented from throwing if hide is set
     * to true
     *
     * @param {Object} template an object to be parsed for construction via the
     * Lattice Factory
     * @param {boolean} hide if true, an invalid template will NOT throw errors
     * @return {ValidationResults} a `ValidationResults` object containing the
     * collected errors and a `valid` that is dynamically calculated.
     */
    function validateTemplate(template) {
      var hide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var results = new ValidationResults();

      var indent = function indent(string) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
        var space = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
        return string.split('\n').map(function (s) {
          return s.trim().replace(/(^)/gm, "$1".concat(space.repeat(count)));
        }).join('\n');
      };

      if (typeof template.name === 'undefined') {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n        The `template.name` field must exist or the creation for the Lattice\n        factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.name\\` field must exist or the creation for the Lattice\n        factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "])))));
      }

      if (!(0, _neTypes.extendsFrom)(template.name, String)) {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n        The `template.name` field must be a string.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.name\\` field must be a string.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "])))));
      }

      if (typeof template.schema === 'undefined') {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n        The `template.schema` field must exist or the creation for the\n        Lattice factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.schema\\` field must exist or the creation for the\n        Lattice factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "])))));
      }

      if (!(0, _neTypes.extendsFrom)(template.schema, String)) {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n        The `template.schema` field must be a string of GraphQL SDL/IDL\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.schema\\` field must be a string of GraphQL SDL/IDL\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "])))));
      }

      if (!(0, _neTypes.extendsFrom)(template.resolvers, Object) // Supports 95% of objects
      || (0, _typeof2["default"])(template.resolvers) !== 'object' // Supports Object.create(null)
      ) {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\x1B[91;1m\n        The `template.resolvers` field must be an Object containing the\n        resolver functions. Query, Mutation and Subscription resolvers will\n        take the following signature. Additionally, the keys for these special\n        resolvers must be Query, Mutation or Subscription; respectively\n        \x1B[37;22m\n          Query: { [resolver]: (requestData, resolverParameters) => {} }\n          Mutation: { [resolver]: (requestData, resolverParameters) => {} }\n          Subscription: { [resolver]: (requestData, resolverParameters) => {} }\n\n          where:\n            `requestData` is an object with { req, res, gql|next } depending\n              on the graphql server implementation (FB Reference, Apollo, etc)\n            `resovlerParameters` is an object with keys matching those\n              parameters defined in the SCHEMA for the resolver in question.\n        \x1B[91;1m\n        Field resolvers should be found under the key name of the type\n        or interface in question and must correspond to the following signature\n        \x1B[37;22m\n          [Type]: { [resolver]: (resolverParameters) => {} }\n\n          where:\n            `Type` is the name of the GQL type defined in the schema\n            `resovlerParameters` is an object with keys matching those\n              parameters defined in the SCHEMA for the resolver in question.\n\n          * it is worth noting that the field resolvers are not static and\n            can access the `requestData` object via `this.requestData`\n        \x1B[91;1m\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\x1B[0m\n      "], ["\\x1b[91;1m\n        The \\`template.resolvers\\` field must be an Object containing the\n        resolver functions. Query, Mutation and Subscription resolvers will\n        take the following signature. Additionally, the keys for these special\n        resolvers must be Query, Mutation or Subscription; respectively\n        \\x1b[37;22m\n          Query: { [resolver]: (requestData, resolverParameters) => {} }\n          Mutation: { [resolver]: (requestData, resolverParameters) => {} }\n          Subscription: { [resolver]: (requestData, resolverParameters) => {} }\n\n          where:\n            \\`requestData\\` is an object with { req, res, gql|next } depending\n              on the graphql server implementation (FB Reference, Apollo, etc)\n            \\`resovlerParameters\\` is an object with keys matching those\n              parameters defined in the SCHEMA for the resolver in question.\n        \\x1b[91;1m\n        Field resolvers should be found under the key name of the type\n        or interface in question and must correspond to the following signature\n        \\x1b[37;22m\n          [Type]: { [resolver]: (resolverParameters) => {} }\n\n          where:\n            \\`Type\\` is the name of the GQL type defined in the schema\n            \\`resovlerParameters\\` is an object with keys matching those\n              parameters defined in the SCHEMA for the resolver in question.\n\n          * it is worth noting that the field resolvers are not static and\n            can access the \\`requestData\\` object via \\`this.requestData\\`\n        \\x1b[91;1m\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\\x1b[0m\n      "])))));
      }

      if (typeof template.docs === 'undefined') {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n        The `template.docs` field must exist for the creation of the\n        Lattice factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.docs\\` field must exist for the creation of the\n        Lattice factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "])))));
      }

      if (!(0, _neTypes.extendsFrom)(template.docs, Object) // Supports 95% of objects
      || (0, _typeof2["default"])(template.docs) !== 'object' // Supports Object.create(null)
      ) {
        var dr = '\x1b[31m',
            br = '\x1b[91m';
        var b1 = '\x1b[1m',
            b0 = '\x1b[22m';
        var bb = '\x1b[90m';
        var dg = '\x1b[37m',
            bg = '\x1b[97m';
        var a0 = '\x1b[0m';
        var gr = '\x1b[32m',
            bgr = '\x1b[92m';
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2["default"])(["\x1B[1;91m\n        The `template.docs` field must be an object containing keys and\n        value pairs matching the types, enums, unions and interfaces defined\n        in your schema.\n\n        The special Symbol object TYPE can be used to reference the docs for\n        the named or keyed field describing the documentation to be processed\n        Comments for the `Query`, `Mutation`, and `Subscription` [TYPE]\n        entries will replace any previous one that comes before it. Typically\n        this field is best left undescribed since there will ever only be\n        one of each at most.\n\n        \x1B[22;31mExamples should look something like this:\x1B[22;37m\n          import { TYPE, joinLines } from 'graphql-lattice'\n\n          export default {\n            ", "/* other fields */", "\n\n            ", "schema:", " joinLines", "`\n              type Person { id: ID name: String }\n              type Query { findPerson(id: ID): Person }\n              type Mutation { setPersonName(id: ID, name: String): Person }\n            `", ",\n\n            ", "docs:", " {\n              ", "Person:", " {\n                [TYPE]: ", "'A contrived person type'", ",\n                id: ", "'A unique identifier for a person'", ",\n                name: ", "'A string denoting the name of a person'", "\n              },\n              ", "Query:", " {\n                findPerson: ", "'A query taking an ID, returns a Person'", ",\n              },\n              ", "Mutation:", " {\n                setPersonName: joinLines", "`\n                  A mutation that sets the name of the user identified by an\n                  ID to the new name value supplied\n                `", "\n              }\n            }\n          }\n        \x1B[22;31m\n        Note the usage of `Person`, `Query` and `Mutation` explicitly\n        as keys to the supplied `docs` object.\x1B[0m\n      "], ["\\x1b[1;91m\n        The \\`template.docs\\` field must be an object containing keys and\n        value pairs matching the types, enums, unions and interfaces defined\n        in your schema.\n\n        The special Symbol object TYPE can be used to reference the docs for\n        the named or keyed field describing the documentation to be processed\n        Comments for the \\`Query\\`, \\`Mutation\\`, and \\`Subscription\\` [TYPE]\n        entries will replace any previous one that comes before it. Typically\n        this field is best left undescribed since there will ever only be\n        one of each at most.\n\n        \\x1b[22;31mExamples should look something like this:\\x1b[22;37m\n          import { TYPE, joinLines } from 'graphql-lattice'\n\n          export default {\n            ", "/* other fields */", "\n\n            ", "schema:", " joinLines", "\\`\n              type Person { id: ID name: String }\n              type Query { findPerson(id: ID): Person }\n              type Mutation { setPersonName(id: ID, name: String): Person }\n            \\`", ",\n\n            ", "docs:", " {\n              ", "Person:", " {\n                [TYPE]: ", "'A contrived person type'", ",\n                id: ", "'A unique identifier for a person'", ",\n                name: ", "'A string denoting the name of a person'", "\n              },\n              ", "Query:", " {\n                findPerson: ", "'A query taking an ID, returns a Person'", ",\n              },\n              ", "Mutation:", " {\n                setPersonName: joinLines", "\\`\n                  A mutation that sets the name of the user identified by an\n                  ID to the new name value supplied\n                \\`", "\n              }\n            }\n          }\n        \\x1b[22;31m\n        Note the usage of \\`Person\\`, \\`Query\\` and \\`Mutation\\` explicitly\n        as keys to the supplied \\`docs\\` object.\\x1b[0m\n      "])), bb, dg, b1, b0, gr, dg, b1, b0, b1, b0, gr, dg, gr, dg, gr, dg, b1, b0, gr, dg, b1, b0, gr, dg)));
      }

      if (!results.valid) {
        var errorStrings = [];

        var _iterator2 = _createForOfIteratorHelper(results.errors),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _error = _step2.value;
            var message = _error.message,
                stack = _error.stack;
            stack = stack.trim().split('\n').splice(message.split('\n').length).map(function (s) {
              return s.trim();
            }).join('\n');
            message = message.replace(/(Error:\s)/, '$1\n').trim();
            errorStrings.push("\x1B[31;1m".concat(message, "\x1B[0m\n") + indent(stack));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var error = new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2["default"])(["\n        OOPS!\n\n        An error occurred validating your factory template. The object\n        in question is as follows:\n\n        @template\n\n        The individual errors that occurred are:\n        \n@errors"], ["\n        OOPS!\n\n        An error occurred validating your factory template. The object\n        in question is as follows:\n\n        @template\n\n        The individual errors that occurred are:\n        \\n@errors"]))).replace(/@template/, indent(_i(template))).replace(/@errors/, errorStrings.join('\n\n')));
        error.stack = error.message;
        error.message = '';
        if (!hide) throw error;
      }

      return results;
    }
    /**
     * The starting point of a LatticeFactory object -> class creation. The name
     * of the class and baseClass to use are provided and are created from there.
     * At this point, the generated class is still incomplete. It must complete
     * the entire checklist before being deemed valid.
     *
     * @param {string} name name of the class to create
     * @param {Function} baseClass the Lattice class your new class should extend;
     * while this can be anything, it should be GQLBase, GQLInterface, GQLEnum or
     * GQLUnion. This defaults to GQLBase should nothing be supplied
     * @return {Function} actually this returns the generated class
     */

  }, {
    key: "generateClass",
    value: function generateClass(name) {
      var baseClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _GQLBase.GQLBase;

      if (!name) {
        throw new Error('LatticeFactory.generateClass needs a name!!');
      } // Alright ladies and gentlemen, hold onto your hats; we're entering the
      // meta zone!!! The way the following works is to make sure that our
      // passed in base class `baseClass` is actually in scope as the name of
      // the value it represents. We use the `new Function()` syntax to do that
      // but we do it via eval since we don't know the name of the function
      // at the time we write the code
      //
      // So given a class name of "Car" and baseName equalling GQLBase, the Class
      // instance, fn would look something like the results of calling this
      //
      // let fn = new Function(
      //   "GQLBase",
      //   "class Car extends GQLBase {}; return Car;"
      // )
      //
      // Which in turn sets fn to something that would be the same as
      //
      // function fn(GQLBase) { class Car extends GQLBase {}; return Car }
      //
      // Which means that when we invoke fn(baseClass), which is fn(GQLBase),
      // we get the results we intend; even if GQLBase is not necessarily in
      // the scope of the function at the time of call. Neat. Scary. OMG Thanks
      // for code comments. You're welcome future me.


      var fn = eval("(new Function(\n      \"".concat(baseClass.name, "\",\n      \"class ").concat(name, " extends ").concat(baseClass.name, " {}; return ").concat(name, ";\"\n    ))"));
      var Class = fn(baseClass);
      this.brandClass(Class);
      newChecklist(Class);
      return Class;
    }
    /**
     * Injects the SCHEMA property into the newly defined class. The supplied
     * `schema` string becomes what the new class returns when `.SCHEMA` is
     * gotten.
     *
     * @param {Function} Class this will throw an error if the class is not one
     * generated by the LatticeFactory or if the class itself is null or undefined
     * @param {string} schema the string that the new class should return
     * @return {Function} returns the modified Class with the `CHECK_SCHEMA`
     * portion ticked off internally.
     */

  }, {
    key: "injectSchema",
    value: function injectSchema(Class, schema) {
      if (!Class || !hasChecklist(Class)) {
        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2["default"])(["\n        Either the supplied schema string is invalid\n          SCHEMA: `\n            ", "\n          `\n\n        Or your supplied class ", " is\n        non-existent. Please check your code and try the LatticeFactory\n        again.\n      "], ["\n        Either the supplied schema string is invalid\n          SCHEMA: \\`\n            ", "\n          \\`\n\n        Or your supplied class ", " is\n        non-existent. Please check your code and try the LatticeFactory\n        again.\n      "])), schema, Class && Class.name || 'undefined'));
      } // $FlowFixMe


      Object.defineProperty(Class, 'SCHEMA', {
        get: function get() {
          return schema;
        }
      });
      setChecklist(Class, CHECK_SCHEMA);
      return Class;
    }
    /**
     * Injects the resolvers into appropriate areas. Resolvers keyed by `Query`,
     * `Mutation`, or `Subscription` will be placed into the appropriate area
     * in `Class[META_KEY]` which acts as a staging area originally designed for
     * use with the @resolver, @mutator and @subscriptor decorators. These will
     * be bound in a typical fashion as is done with the decorators making the
     * first parameter becoming the requestData of the object instance and the
     * second being the object containing the parameters for the resolver as
     * passed in by GraphQL. Subsequent parameters will be supplied as is the
     * fashion of the system you're using; Facebook's reference implementation or
     * Apollo or something else.
     *
     * Resolvers keyed by type name are considered to be field resolvers and
     * have a different signature. They can be properties of the key, in
     * which case they will simply be installed as getters. Or they can be
     * functions; synchronous or asynchronous. Function field resolvers are
     * instance methods and can make use of `this.getModel()` or
     * `this.requestData` internally.
     *
     * @param {Function} Class the class, generated by generateClass() lest an
     * error be thrown, to which to add the resolvers from a template
     * @param {Object} resolverObj an object containing the resolvers as dictated
     * by the new format.
     * @return {Function} returns the modified Class with the `CHECK_RESOLVERS`
     * portion ticked off internally.
     */

  }, {
    key: "injectResolvers",
    value: function injectResolvers(Class, resolvers) {
      if (!hasChecklist(Class, CHECK_SCHEMA)) {
        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject11 || (_templateObject11 = (0, _taggedTemplateLiteral2["default"])(["\n        `injectResolvers` cannot be called on a class without a SCHEMA.\n        Please verify your progress in the process and try again.\n      "], ["\n        \\`injectResolvers\\` cannot be called on a class without a SCHEMA.\n        Please verify your progress in the process and try again.\n      "]))));
      }

      var tree = _SyntaxTree.SyntaxTree.from(Class.SCHEMA);

      var outline = tree ? tree.outline : {};

      if (Class.name in outline && Class.name in resolvers) {
        var fields = Object.keys(outline[Class.name]);

        for (var _i2 = 0, _fields = fields; _i2 < _fields.length; _i2++) {
          var fieldResolver = _fields[_i2];

          if (!fieldResolver in resolvers[Class.name]) {
            _utils.LatticeLogs.warn((0, _neTagFns.customDedent)({
              dropLowest: true
            })(_templateObject12 || (_templateObject12 = (0, _taggedTemplateLiteral2["default"])(["\n            ", " not supplied in resolvers for ", "\n          "])), fieldResolver, Class.name));

            continue;
          }

          var prop = resolvers[Class.name][fieldResolver];

          if (prop && typeof prop === 'function') {
            _utils.LatticeLogs.info('Injecting [fn] %s', fieldResolver);

            Object.defineProperty(Class.prototype, fieldResolver, {
              value: prop
            });
          } else {
            _utils.LatticeLogs.info('Injecting [prop] %s', fieldResolver);

            (0, _ModelProperties.Properties)(fieldResolver)(Class, ['factory-props']);
          }
        }
      }

      for (var _i3 = 0, _arr = [['Query', _Resolvers.resolver], ['Mutation', _Resolvers.mutator], ['Subscription', _Resolvers.subscriptor]]; _i3 < _arr.length; _i3++) {
        var _arr$_i = (0, _slicedToArray2["default"])(_arr[_i3], 2),
            type = _arr$_i[0],
            decorator = _arr$_i[1];

        var keys = Object.keys(outline[type] || {}); // $FlowFixMe

        if (!type in outline || !keys.length) {
          continue;
        }

        for (var _i4 = 0, _keys2 = keys; _i4 < _keys2.length; _i4++) {
          var fnName = _keys2[_i4];
          var fn = resolvers[fnName];
          decorator(Class, fnName, {
            value: fn
          });

          _utils.LatticeLogs.info('Adding %s resolver [%s]', type, fnName);
        }
      }

      setChecklist(Class, CHECK_RESOLVERS);
      return Class;
    }
  }, {
    key: "injectDocs",
    value: function injectDocs(Class, docs) {
      if (!hasChecklist(Class, CHECK_SCHEMA, CHECK_RESOLVERS)) {
        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject13 || (_templateObject13 = (0, _taggedTemplateLiteral2["default"])(["\n        `injectDocs` cannot be called on a class without a SCHEMA or\n        RESOLVERS defined. Please verify your progress in the process and try\n        again.\n      "], ["\n        \\`injectDocs\\` cannot be called on a class without a SCHEMA or\n        RESOLVERS defined. Please verify your progress in the process and try\n        again.\n      "]))));
      }

      var copyProp = function copyProp(o, prop, to, as) {
        // $FlowFixMe
        var prototype = o.prototype || Object.getPrototypeOf(o);
        var descriptor = Object.getOwnPropertyDescriptor(prototype, prop);

        if (!as) {
          as = prop;
        }

        if (descriptor) {
          Object.defineProperty(to, as, descriptor);
        } else {
          // $FlowFixMe
          to[as] = o[prop];
        }
      }; // Create an object our future `static apiDocs()` method of our factory
      // generated class will return


      var result = {}; // Setup the constants we will need in this conversion

      var TYPE = this.TYPE;
      var DOC_CLASS = _GQLBase.GQLBase.DOC_CLASS,
          DOC_FIELDS = _GQLBase.GQLBase.DOC_FIELDS,
          DOC_QUERY = _GQLBase.GQLBase.DOC_QUERY,
          DOC_MUTATION = _GQLBase.GQLBase.DOC_MUTATION,
          DOC_SUBSCRIPTION = _GQLBase.GQLBase.DOC_SUBSCRIPTION,
          DOC_QUERIES = _GQLBase.GQLBase.DOC_QUERIES,
          DOC_MUTATIONS = _GQLBase.GQLBase.DOC_MUTATIONS,
          DOC_SUBSCRIPTIONS = _GQLBase.GQLBase.DOC_SUBSCRIPTIONS; // This part might get a little meta, so I have provided comments. You are
      // welcome future me. I hope it helps. This gnarly block should cover all
      // the descriptions for Query, Mutation, Subscription and the Class we
      // are creating. Other superfluous

      for (var _i5 = 0, _arr2 = [['Query', DOC_QUERY, DOC_QUERIES], ['Mutation', DOC_MUTATION, DOC_MUTATIONS], ['Subscription', DOC_SUBSCRIPTION, DOC_SUBSCRIPTIONS], [Class.name, DOC_CLASS, DOC_FIELDS]]; _i5 < _arr2.length; _i5++) {
        var _arr2$_i = (0, _slicedToArray2["default"])(_arr2[_i5], 3),
            Type = _arr2$_i[0],
            TopLevelConstant = _arr2$_i[1],
            FieldConstants = _arr2$_i[2];

        // One of 'Query', 'Mutation', or 'Subscription'
        if (docs[Type]) {
          // If a top level description is present (i.e. Query, Mutation or
          // Subscription description)
          if (docs[Type][TYPE]) {
            copyProp(docs[Type], TYPE, result, TopLevelConstant);
          } // Fetch the properties from the supplied docs object; TYPE Symbols
          // do not show up in a call to entries which is why it is handled above
          // $FlowFixMe


          var entries = Object.entries(docs[Type]); // If we have entries to document, create an object to hold those
          // values; i.e. if we have `{ Query: { getPeople: 'desc' } }`, we need
          // to make sure we have `{ [DOC_QUERIES]: { getPeople: 'desc' } }` in
          // our result. The object holding getPeople in the end there is defined
          // below when we have something to copy.

          if (entries.length) {
            result[FieldConstants] = {};
          } // For each name value pair defined above, copy its descriptor or base
          // value if a descriptor isn't available


          for (var _i6 = 0, _entries = entries; _i6 < _entries.length; _i6++) {
            var _entries$_i = (0, _slicedToArray2["default"])(_entries[_i6], 2),
                prop = _entries$_i[0],
                value = _entries$_i[1];

            copyProp(docs[Type], prop, result[FieldConstants]);
          }
        }
      }

      Object.defineProperty(Class, 'apiDocs', {
        value: function value() {
          return result;
        }
      });
      setChecklist(Class, CHECK_API_DOCS);
      return Class;
    }
  }, {
    key: "build",
    value: function build(template) {
      var validationResults = this.validateTemplate(template);
      var Class = this.generateClass(template.name, template.type || _GQLBase.GQLBase);

      if (!Class) {
        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject14 || (_templateObject14 = (0, _taggedTemplateLiteral2["default"])(["\n        LatticeFactory was unable to build your Class from the name and types\n        supplied in your template. You provided the following template. Please\n        look it over and correct any errors before trying again.\n\n        \x1B[1mTemplate\x1B[0m\n          ", "\n      "], ["\n        LatticeFactory was unable to build your Class from the name and types\n        supplied in your template. You provided the following template. Please\n        look it over and correct any errors before trying again.\n\n        \\x1b[1mTemplate\\x1b[0m\n          ", "\n      "])), _i(template)));
      }

      this.injectSchema(Class, template.schema);
      this.injectResolvers(Class, template.resolvers || {});
      this.injectDocs(Class, template.docs || {}); // Need to fix how auto-props work; for now create one instance...

      new Class({});

      if (!hasChecklist(Class, CHECK_SCHEMA, CHECK_RESOLVERS, CHECK_API_DOCS)) {
        var _schema = hasChecklist(Class, CHECK_SCHEMA) ? '✅' : '❌';

        var _resolvers = hasChecklist(Class, CHECK_RESOLVERS) ? '✅' : '❌';

        var _apiDocs = hasChecklist(Class, CHECK_API_DOCS) ? '✅' : '❌';

        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject15 || (_templateObject15 = (0, _taggedTemplateLiteral2["default"])(["\n        Something went wrong in the process of building the class called\n        ", ",\n        please check the supplied template for errors.\n\n        [ ", " ] Has a SCHEMA defined\n        [ ", " ] Has defined RESOLVERS matching the SCHEMA\n        [ ", " ] Has defined API Docs matching the SCHEMA\n\n        \x1B[1mTemplate\x1B[0m\n        ", "\n\n        \x1B[1mClass\x1B[0m\n        ", "\n      "], ["\n        Something went wrong in the process of building the class called\n        ", ",\n        please check the supplied template for errors.\n\n        [ ", " ] Has a SCHEMA defined\n        [ ", " ] Has defined RESOLVERS matching the SCHEMA\n        [ ", " ] Has defined API Docs matching the SCHEMA\n\n        \\x1b[1mTemplate\\x1b[0m\n        ", "\n\n        \\x1b[1mClass\\x1b[0m\n        ", "\n      "])), Class && Class.name || template && template.name || 'Unknown!', _schema, _resolvers, _apiDocs, _i(template), _i(Class)));
      }

      return Class;
    }
    /**
     * A static helper method to consistently tag, or brand, classes with a
     * symbol that denotes they were created using the LatticeFactory process.
     * This is done by setting a `Symbol` on the root of the class or in the
     * `[META_KEY]` object for classes extending `GQLBase`.
     *
     * @method ⌾⠀brandClass
     * @memberof LatticeFactory
     * @static
     *
     * @param {Function} Class the class to brand with the `FACTORY_CLASS` symbol
     * @return {Function} returns the Class value passed in
     */

  }, {
    key: "brandClass",
    value: function brandClass(Class) {
      if (Class) {
        if ((0, _neTypes.extendsFrom)(Class, _GQLBase.GQLBase)) {
          Class[_GQLBase.META_KEY][this.FACTORY_CLASS] = true;
        } else {
          Class[this.FACTORY_CLASS] = true;
        }
      }

      return Class;
    }
    /**
     * A static helper to check and see if the supplied class or function was
     * branded with the `brandClass()` function. This amounts to storing the
     * boolean true under the property `Class[LatticeFactory.FACTORY_CLASS]` or
     * `Class[META_KEY][LatticeFacatory.FACTORY_CLASS]` for `GQLBase` extended
     * classes.
     *
     * @method ⌾⠀isFactoryClass
     * @memberof LatticeFactory
     * @static
     *
     * @param {Function} Class the class to check for `FACTORY_CLASS` branding
     * @return {boolean} true if the brand exists, false otherwise
     */

  }, {
    key: "isFactoryClass",
    value: function isFactoryClass(Class) {
      if (Class) {
        return (0, _neTypes.extendsFrom)(Class, _GQLBase.GQLBase) ? !!Class[_GQLBase.META_KEY][this.FACTORY_CLASS] : !!Class[this.FACTORY_CLASS];
      }

      return false;
    }
    /**
     * A static helper method to consistently remove any previous tag or brand
     * applied with `brandClass`, this is done by removing a previously set
     * `Symbol` on the root of the class or in the `[META_KEY]` object for
     * classes extending `GQLBase`.
     *
     * @method ⌾⠀removeClassBrand
     * @memberof LatticeFactory
     * @static
     *
     * @param {Function} Class the class to brand with the `FACTORY_CLASS` symbol
     * @return {Function} returns the Class value passed in
     */

  }, {
    key: "removeClassBrand",
    value: function removeClassBrand(Class) {
      if (Class) {
        if ((0, _neTypes.extendsFrom)(Class, _GQLBase.GQLBase)) {
          delete Class[_GQLBase.META_KEY][this.FACTORY_CLASS];
        } else {
          delete Class[this.FACTORY_CLASS];
        }
      }

      return Class;
    }
    /**
     * A constant that reports that this class is `'[object LatticeFactory]'`
     * rather than `'[object Object]'` when introspected with tools such as
     * `Object.prototype.toString.apply(class)`.
     *
     * @memberof LatticeFactory
     * @type {Symbol}
     * @static
     */
    // $FlowFixMe

  }, {
    key: _Symbol$toStringTag3,
    get: function get() {
      return this.name;
    }
    /**
     * A constant exported as part of LatticeFactory that can be used for
     * defining documentation for the type itself.
     *
     * @memberof LatticeFactory
     * @type {Symbol}
     * @static
     */

  }, {
    key: "TYPE",
    get: function get() {
      return Symbol["for"]('API Docs Type Constant');
    }
    /**
     * A constant exported as part of LatticeFactory that can be used for
     * identifying classes that were generated with LatticeFactory.
     *
     * @memberof LatticeFactory
     * @type {Symbol}
     * @static
     */

  }, {
    key: "FACTORY_CLASS",
    get: function get() {
      return Symbol["for"]('Factory Class');
    }
  }]);
  return LatticeFactory;
}(Symbol.toStringTag);

exports.LatticeFactory = LatticeFactory;
var isFactoryClass = LatticeFactory.isFactoryClass; // TESTING REPL

/**
var { LatticeFactory, getChecklist, hasChecklist, CHECKLIST, CHECK_SCHEMA, CHECK_RESOLVERS } = require('./dist/LatticeFactory'); var { GQLBase, META_KEY, joinLines, SyntaxTree, typeOf } = require('./dist/lattice'); var gql = joinLines, LF = LatticeFactory, TYPE = LF.TYPE;
var PersonDef = { name: 'Person', schema: gql` enum StatType { PHYSICAL, MENTAL } type Person { name: String stats(type:StatType): Stat } type Query { findPerson(id: ID): Person } `, resolvers: { Query: { findPerson({req, res, next}, {id}) { console.log('find person') } }, Person: { stats({type}) { let { req, res, next} = this.requestData } } }, docs: { StatType: { [TYPE]: `A type of statistic associated with people`, PHYSICAL: `Physical attributes`, MENTAL: `Mental attributes` }, Person: { [TYPE]: `Represents a person`, personId: `Unique id of the person in question`, name: `The name of the person`, stats: `Allows you to query the stats of a person based on type` }, Query: { [TYPE]: 'Top level query desc.', findPerson: `Searches the system for the specified user` } } };
var Person = LF.build(PersonDef), p = new Person({name: 'Brielle'})
Person.getProp('stats',true,{requestData:{req:1,res:2,next:3}})
var Broke = LF.build({name: 'Broke', schema: gql`type Broke {name: String}`, resolvers:{}, docs:{}})
var t = LF.validateTemplate({name: '',  type: GQLBase, resolvers: {}, docs: {}, schema: ''});
*/

exports.isFactoryClass = isFactoryClass;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9MYXR0aWNlRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJfaSIsImFyZ3MiLCJpbnNwZWN0IiwiY29sb3JzIiwiZGVwdGgiLCJDSEVDS0xJU1QiLCJTeW1ib2wiLCJDSEVDS19TQ0hFTUEiLCJDSEVDS19SRVNPTFZFUlMiLCJDSEVDS19BUElfRE9DUyIsImdldENoZWNrbGlzdCIsIkNsYXNzIiwiTUVUQV9LRVkiLCJzZXRDaGVja2xpc3QiLCJpdGVtIiwidmFsdWUiLCJjaGVja2xpc3QiLCJoYXNDaGVja2xpc3QiLCJpdGVtcyIsImxlbmd0aCIsIm5ld0NoZWNrbGlzdCIsImtleXMiLCJyZWR1Y2UiLCJwIiwiYyIsImkiLCJhIiwiRXJyb3IiLCJkcm9wTG93ZXN0IiwiVmFsaWRhdGlvblJlc3VsdHMiLCJlcnJvcnMiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJ0b1N0cmluZ1RhZyIsIkxhdHRpY2VGYWN0b3J5IiwidGVtcGxhdGUiLCJoaWRlIiwicmVzdWx0cyIsImluZGVudCIsInN0cmluZyIsImNvdW50Iiwic3BhY2UiLCJzcGxpdCIsIm1hcCIsInMiLCJ0cmltIiwicmVwbGFjZSIsInJlcGVhdCIsImpvaW4iLCJwdXNoIiwiU3RyaW5nIiwic2NoZW1hIiwicmVzb2x2ZXJzIiwiT2JqZWN0IiwiZG9jcyIsImRyIiwiYnIiLCJiMSIsImIwIiwiYmIiLCJkZyIsImJnIiwiYTAiLCJnciIsImJnciIsInZhbGlkIiwiZXJyb3JTdHJpbmdzIiwiZXJyb3IiLCJtZXNzYWdlIiwic3RhY2siLCJzcGxpY2UiLCJiYXNlQ2xhc3MiLCJHUUxCYXNlIiwiZm4iLCJldmFsIiwiYnJhbmRDbGFzcyIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwidHJlZSIsIlN5bnRheFRyZWUiLCJmcm9tIiwiU0NIRU1BIiwib3V0bGluZSIsImZpZWxkcyIsImZpZWxkUmVzb2x2ZXIiLCJMTCIsIndhcm4iLCJwcm9wIiwiaW5mbyIsInByb3RvdHlwZSIsInJlc29sdmVyIiwibXV0YXRvciIsInN1YnNjcmlwdG9yIiwidHlwZSIsImRlY29yYXRvciIsImZuTmFtZSIsImNvcHlQcm9wIiwibyIsInRvIiwiYXMiLCJnZXRQcm90b3R5cGVPZiIsImRlc2NyaXB0b3IiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJyZXN1bHQiLCJUWVBFIiwiRE9DX0NMQVNTIiwiRE9DX0ZJRUxEUyIsIkRPQ19RVUVSWSIsIkRPQ19NVVRBVElPTiIsIkRPQ19TVUJTQ1JJUFRJT04iLCJET0NfUVVFUklFUyIsIkRPQ19NVVRBVElPTlMiLCJET0NfU1VCU0NSSVBUSU9OUyIsIlR5cGUiLCJUb3BMZXZlbENvbnN0YW50IiwiRmllbGRDb25zdGFudHMiLCJlbnRyaWVzIiwidmFsaWRhdGlvblJlc3VsdHMiLCJ2YWxpZGF0ZVRlbXBsYXRlIiwiZ2VuZXJhdGVDbGFzcyIsImluamVjdFNjaGVtYSIsImluamVjdFJlc29sdmVycyIsImluamVjdERvY3MiLCJfc2NoZW1hIiwiX3Jlc29sdmVycyIsIl9hcGlEb2NzIiwiRkFDVE9SWV9DTEFTUyIsImlzRmFjdG9yeUNsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxFQUFFLEdBQUcsU0FBTEEsRUFBSztBQUFBLG9DQUFJQyxJQUFKO0FBQUlBLElBQUFBLElBQUo7QUFBQTs7QUFBQSxTQUFhQyw0QkFBV0QsSUFBWCxTQUFpQjtBQUFDRSxJQUFBQSxNQUFNLEVBQUUsSUFBVDtBQUFlQyxJQUFBQSxLQUFLLEVBQUU7QUFBdEIsR0FBakIsR0FBYjtBQUFBLENBQVg7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxJQUFNQyxTQUFTLEdBQUdDLE1BQU0sT0FBTixDQUFXLFdBQVgsQ0FBbEI7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTs7OztXQUNFLDBCQUF3Qm5ILEtBQXhCLEVBQW1EO0FBQ2pELFVBQUlBLEtBQUosRUFBVztBQUNULFlBQUksMEJBQVlBLEtBQVosRUFBbUI2RCxnQkFBbkIsQ0FBSixFQUFpQztBQUMvQixpQkFBTzdELEtBQUssQ0FBQ0MsaUJBQUQsQ0FBTCxDQUFnQixLQUFLa0gsYUFBckIsQ0FBUDtBQUNELFNBRkQsTUFHSztBQUNILGlCQUFPbkgsS0FBSyxDQUFDLEtBQUttSCxhQUFOLENBQVo7QUFDRDtBQUNGOztBQUVELGFBQU9uSCxLQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRTs7OztTQUNBLGVBQWtDO0FBQUUsYUFBTyxLQUFLcUIsSUFBWjtBQUFrQjtBQUV0RDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1NBQ0UsZUFBMEI7QUFBRSxhQUFPMUIsTUFBTSxPQUFOLENBQVcsd0JBQVgsQ0FBUDtBQUE2QztBQUV6RTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1NBQ0UsZUFBbUM7QUFBRSxhQUFPQSxNQUFNLE9BQU4sQ0FBVyxlQUFYLENBQVA7QUFBb0M7OztFQXBCN0RBLE1BQU0sQ0FBQzJCLFc7OztBQXVCZCxJQUFNOEYsY0FBYyxHQUFHN0YsY0FBYyxDQUFDNkYsY0FBdEMsQyxDQUVQOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgeyBHUUxCYXNlLCBNRVRBX0tFWSB9IGZyb20gJy4vR1FMQmFzZSdcbmltcG9ydCB7IEdRTEVudW0gfSBmcm9tICcuL0dRTEVudW0nXG5pbXBvcnQgeyBHUUxJbnRlcmZhY2UgfSBmcm9tICcuL0dRTEludGVyZmFjZSdcbmltcG9ydCB7IEdRTFNjYWxhciB9IGZyb20gJy4vR1FMU2NhbGFyJ1xuLy8gaW1wb3J0IHsgR1FMVW5pb24gfSBmcm9tICcuL0dRTFVuaW9uJ1xuaW1wb3J0IHsgU3ludGF4VHJlZSB9IGZyb20gJy4vU3ludGF4VHJlZSdcbmltcG9ydCB7IGN1c3RvbURlZGVudCB9IGZyb20gJ25lLXRhZy1mbnMnXG5pbXBvcnQgeyB0eXBlT2YsIGV4dGVuZHNGcm9tIH0gZnJvbSAnbmUtdHlwZXMnXG5pbXBvcnQgeyBpbnNwZWN0IH0gZnJvbSAndXRpbCdcbmltcG9ydCB7IHJlc29sdmVyLCBtdXRhdG9yLCBzdWJzY3JpcHRvciB9IGZyb20gJy4vZGVjb3JhdG9ycy9SZXNvbHZlcnMnXG5pbXBvcnQgeyBQcm9wZXJ0aWVzIH0gZnJvbSAnLi9kZWNvcmF0b3JzL01vZGVsUHJvcGVydGllcydcbmltcG9ydCB7IExhdHRpY2VMb2dzIGFzIExMIH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgX2kgPSAoLi4uYXJncykgPT4gaW5zcGVjdCguLi5hcmdzLCB7Y29sb3JzOiB0cnVlLCBkZXB0aDogM30pXG5cblxuLyoqXG4gKiBUaGUgQ0hFQ0tMSVNUIFN5bWJvbCBpcyB1c2VkIGFzIGEgc3RvcmFnZSBrZXkgaW4gdGhlIG1ldGFkYXRhIHN0YWdpbmdcbiAqIGFyZWEgZm9yIGVhY2ggb2YgdGhlIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3Nlcy4gSW4gdGhlIExhdHRpY2VGYWN0b3J5XG4gKiBpdCBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVyZSBpbiB0aGUgZmxvdyBvZiBjb25zdHJ1Y3Rpb24gdGhlIGNsYXNzXG4gKiBjdXJyZW50bHkgaXMuXG4gKlxuICogQHR5cGUge1N5bWJvbH1cbiAqL1xuZXhwb3J0IGNvbnN0IENIRUNLTElTVCA9IFN5bWJvbC5mb3IoJ2NoZWNrbGlzdCcpXG5cbi8qKlxuICogVGhlIENIRUNLX1NDSEVNQSBTeW1ib2wgaXMgcGFydCBvZiB0aGUgQ0hFQ0tMSVNUIGZvciBhIGNvbnN0cnVjdGVkXG4gKiBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzLiBJdCBkZW5vdGVzIHRoYXQgdGhlIGNsYXNzIGhhcyBoYWQgaXRzIFNDSEVNQVxuICogZ2V0dGVyIGRlZmluZWQuXG4gKlxuICogQHR5cGUge1N5bWJvbH1cbiAqL1xuZXhwb3J0IGNvbnN0IENIRUNLX1NDSEVNQSA9IFN5bWJvbC5mb3IoJ2NoZWNrbGlzdC1zY2hlbWEnKVxuXG4vKipcbiAqIFRoZSBDSEVDS19SRVNPTFZFUlMgU3ltYm9sIGlzIHBhcnQgb2YgdGhlIENIRUNLTElTVCBmb3IgYSBjb25zdHJ1Y3RlZFxuICogR1FMQmFzZSBleHRlbmRlZCBjbGFzcy4gSXQgZGVub3RlcyB0aGF0IHRoZSBjbGFzcyBoYXMgaGFkIGl0cyBpbnN0YW5jZVxuICogZmllbGQgcmVzb2x2ZXJzIGFzIHdlbGwgYXMgaXRzIHN0YXRpYyBRdWVyeSwgTXV0YXRpb24gYW5kIFN1YnNjcmlwdGlvblxuICogcmVzb2x2ZXJzIGluamVjdGVkIGFuZCBkZWZpbmVkLlxuICpcbiAqIEB0eXBlIHtTeW1ib2x9XG4gKi9cbmV4cG9ydCBjb25zdCBDSEVDS19SRVNPTFZFUlMgPSBTeW1ib2wuZm9yKCdjaGVja2xpc3QtcmVzb2x2ZXJzJylcblxuLyoqXG4gKiBUaGUgQ0hFQ0tfQVBJX0RPQ1MgU3ltYm9sIGlzIHBhcnQgb2YgdGhlIENIRUNLTElTVCBmb3IgYSBjb25zdHJ1Y3RlZFxuICogR1FMQmFzZSBleHRlbmRlZCBjbGFzcy4gSXQgZGVub3RlcyB0aGF0IHRoZSBjbGFzcyBoYXMgaGFkIGl0cyBhcGkgZG9jc1xuICogZGVmaW5lZCwgcHJvY2Vzc2VkIGFuZCBzZXR1cCBvbiB0aGUgY2xhc3MgaW4gYSB3YXkgdGhhdCBpdCB3aWxsIGJlXG4gKiBwaWNrZWQgdXAgaW4gdGhlIGJ1aWxkIGxpZmVjeWNsZS5cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICovXG5leHBvcnQgY29uc3QgQ0hFQ0tfQVBJX0RPQ1MgPSBTeW1ib2wuZm9yKCdjaGVja2xpc3QtYXBpLWRvY3MnKVxuXG4vKipcbiAqIFBlZWtzIGludG8gdGhlIG1ldGFkYXRhIHN0b3JhZ2UgYXJlYSBvZiBhIGdpdmVuIEdRTEJhc2UgZXh0ZW5kZWRcbiAqIGNsYXNzIGFuZCBmZXRjaGVzIHRoZSBmYWN0b3J5IGNoZWNrbGlzdCBpZiBvbmUgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBHUUxCYXNlIGNsYXNzIHRvIHBlZWsgaW5cbiAqIEByZXR1cm4ge09iamVjdH0gYW4gb2JqZWN0IHNldHVwIHdpdGggYXQgbGVhc3QgdGhyZWUgYm9vbGVhbnMga2V5ZWQgYnlcbiAqIHRoZSBjb25zdGFudHMgQ0hFQ0tfU0NIRU1BLCBDSEVDS19SRVNPTFZFUlMsIGFuZCBDSEVDS19BUElfRE9DUyBvciBudWxsXG4gKiBpZiBub25lIGV4aXN0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hlY2tsaXN0KENsYXNzOiBGdW5jdGlvbikge1xuICByZXR1cm4gKENsYXNzICYmIENsYXNzW01FVEFfS0VZXSAmJiBDbGFzc1tNRVRBX0tFWV1bQ0hFQ0tMSVNUXSkgfHwgbnVsbFxufVxuXG4vKipcbiAqIE9idGFpbnMgdGhlIGNoZWNrbGlzdCBmcm9tIHRoZSBzdXBwbGllZCBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzLiBJZiB0aGVcbiAqIGNsYXNzIGhhcyBhIGNoZWNrbGlzdCwgaXRzIGNoZWNrbGlzdCBpdGVtIGlzIHNldCB0byB0cnVlIG9yIHRoZSBib29sZWFuXG4gKiB2YWx1ZSBzcGVjaWZpZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgYSByZWZlcmVuY2UgdG8gdGhlIEdRTEJhc2UgY2xhc3MgdG8gc2V0XG4gKiBAcGFyYW0ge1N5bWJvbH0gaXRlbSBvbmUgb2YgQ0hFQ0tfU0NIRU1BLCBDSEVDS19SRVNPTFZFUlMsIG9yXG4gKiBDSEVDS19BUElfRE9DU1xuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZSB0aGUgdmFsdWUgZm9yIHRoZSBjaGVja2xpc3QgaXRlbSB0byBzZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldENoZWNrbGlzdChcbiAgQ2xhc3M6IEZ1bmN0aW9uLFxuICBpdGVtOiBTeW1ib2wsXG4gIHZhbHVlOiBib29sZWFuID0gdHJ1ZVxuKSB7XG4gIGxldCBjaGVja2xpc3QgPSBnZXRDaGVja2xpc3QoQ2xhc3MpXG5cbiAgaWYgKGNoZWNrbGlzdCkge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBjaGVja2xpc3RbaXRlbV0gPSB2YWx1ZVxuICB9XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiwgd2hlbiBpbnZva2VkIHdpdGggb25seSBhIGNsYXNzIHdpbGwgcmV0dXJuIHRydWUgaWYgdGhlXG4gKiBDbGFzcyBoYXMgYSBkZWZpbmVkIGNoZWNrbGlzdC4gSWYgb25lIG9yZSBtb3JlIENIRUNLTElTVCBzeW1ib2xzIGFyZVxuICogcGFzc2VkLCB0aGUgZnVuY3Rpb24gd2lsbCBvbmx5IHJldHVybiB0cnVlIGlmIGFsbCB0aGUgc3VwcGxpZWQgc3ltYm9sc1xuICogYXJlIHNldCB0byB0cnV0aHkgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBHUUxCYXNlIGNsYXNzIHRvIHNldFxuICogQHBhcmFtIHtBcnJheTxTeW1ib2w+fSBpdGVtcyBhbnkgb2YgQ0hFQ0tfU0NIRU1BLCBDSEVDS19SRVNPTFZFUlMsIG9yXG4gKiBDSEVDS19BUElfRE9DU1xuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgY2hlY2tsaXN0IGFuZC9vciBhbGwgaXRlbXMgYXJlIHRydWUgYW5kXG4gKiBwcmVzZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzQ2hlY2tsaXN0KENsYXNzOiBGdW5jdGlvbiwgLi4uaXRlbXM6IEFycmF5PFN5bWJvbD4pIHtcbiAgbGV0IGNoZWNrbGlzdCA9IGdldENoZWNrbGlzdChDbGFzcylcblxuICBpZiAoY2hlY2tsaXN0ICYmIGl0ZW1zLmxlbmd0aCkge1xuICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgIGlmICghY2hlY2tsaXN0W2l0ZW1dKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICByZXR1cm4gY2hlY2tsaXN0XG59XG5cbi8qKlxuICogSW5qZWN0cyBhbmQgY3JlYXRlcyBhIG5ldyBDSEVDS0xJU1Qgb2JqZWN0IG9uIHRoZSBzdXBwbGllZCBHUUxCYXNlXG4gKiBleHRlbmRlZCBjbGFzcy4gQWxsIGl0ZW1zIGFyZSBpbnN0YWxsZWQgYW5kIHNldCB0byBmYWxzZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgR1FMQmFzZSBjbGFzcyB0byBzZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5ld0NoZWNrbGlzdChDbGFzczogRnVuY3Rpb24pIHtcbiAgaWYgKENsYXNzKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIENsYXNzW01FVEFfS0VZXVtDSEVDS0xJU1RdID0ge1xuICAgICAgW0NIRUNLX1NDSEVNQV06IGZhbHNlLFxuICAgICAgW0NIRUNLX1JFU09MVkVSU106IGZhbHNlLFxuICAgICAgW0NIRUNLX0FQSV9ET0NTXTogZmFsc2UsXG5cbiAgICAgIGdldCBrZXlzKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIENIRUNLX1NDSEVNQSwgQ0hFQ0tfUkVTT0xWRVJTLCBDSEVDS19BUElfRE9DU1xuICAgICAgICBdXG4gICAgICB9LFxuXG4gICAgICBnZXQgY29tcGxldGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmtleXMucmVkdWNlKChwLGMsaSxhKSA9PiB7XG4gICAgICAgICAgaWYgKCFwIHx8ICF0aGlzW2NdKSB7IHJldHVybiBmYWxzZSB9XG4gICAgICAgIH0sIHRydWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgQ2Fubm90IGNyZWF0ZSBuZXcgY2hlY2tsaXN0IG1ldGFkYXRhIG9uIGEgbm9uLWV4aXN0ZW50IGNsYXNzXG4gICAgYClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvblJlc3VsdHMge1xuICBlcnJvcnM6IEFycmF5PEVycm9yPlxuXG4gIGNvbnN0cnVjdG9yKGVycm9yczogQXJyYXk8RXJyb3I+ID0gW10pIHtcbiAgICB0aGlzLmVycm9ycyA9IGVycm9yc1xuICB9XG5cbiAgZ2V0IHZhbGlkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoID09PSAwIH1cblxuICAvLyAkRmxvd0ZpeE1lXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lIH1cblxuICAvLyAkRmxvd0ZpeE1lXG4gIHN0YXRpYyBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubmFtZSB9XG59XG5cbmV4cG9ydCBjbGFzcyBMYXR0aWNlRmFjdG9yeSB7XG5cbiAgLyoqXG4gICAqIFdhbGtzIHRocm91Z2ggYSBzdXBwbGllZCB0ZW1wbGF0ZSBvYmplY3QgYW5kIGNvbGxlY3RzIGVycm9ycyB3aXRoIGl0c1xuICAgKiBmb3JtYXQgYmVmb3JlIGJ1YmJsaW5nIHVwIGFuIGV4Y2VwdGlvbiBpZiBhbnkgcGFydCBvZiBpdCBmYWlscyB0b1xuICAgKiBwYXNzIG11c3Rlci4gVGhlIGV4Y2VwdGlvbiBjYW4gYmUgcHJldmVudGVkIGZyb20gdGhyb3dpbmcgaWYgaGlkZSBpcyBzZXRcbiAgICogdG8gdHJ1ZVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGUgYW4gb2JqZWN0IHRvIGJlIHBhcnNlZCBmb3IgY29uc3RydWN0aW9uIHZpYSB0aGVcbiAgICogTGF0dGljZSBGYWN0b3J5XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGlkZSBpZiB0cnVlLCBhbiBpbnZhbGlkIHRlbXBsYXRlIHdpbGwgTk9UIHRocm93IGVycm9yc1xuICAgKiBAcmV0dXJuIHtWYWxpZGF0aW9uUmVzdWx0c30gYSBgVmFsaWRhdGlvblJlc3VsdHNgIG9iamVjdCBjb250YWluaW5nIHRoZVxuICAgKiBjb2xsZWN0ZWQgZXJyb3JzIGFuZCBhIGB2YWxpZGAgdGhhdCBpcyBkeW5hbWljYWxseSBjYWxjdWxhdGVkLlxuICAgKi9cbiAgc3RhdGljIHZhbGlkYXRlVGVtcGxhdGUoXG4gICAgdGVtcGxhdGU6IE9iamVjdCxcbiAgICBoaWRlOiBib29sZWFuID0gZmFsc2VcbiAgKTogVmFsaWRhdGlvblJlc3VsdHMge1xuICAgIGxldCByZXN1bHRzID0gbmV3IFZhbGlkYXRpb25SZXN1bHRzKClcbiAgICBsZXQgaW5kZW50ID0gKHN0cmluZzogc3RyaW5nLCBjb3VudDogbnVtYmVyID0gNCwgc3BhY2U6IHN0cmluZyA9ICcgJykgPT4gKFxuICAgICAgc3RyaW5nXG4gICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgLm1hcChzID0+IHMudHJpbSgpLnJlcGxhY2UoLyheKS9nbSwgYCQxJHtzcGFjZS5yZXBlYXQoY291bnQpfWApKVxuICAgICAgICAuam9pbignXFxuJylcbiAgICApXG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLm5hbWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXN1bHRzLmVycm9ycy5wdXNoKG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgICBUaGUgXFxgdGVtcGxhdGUubmFtZVxcYCBmaWVsZCBtdXN0IGV4aXN0IG9yIHRoZSBjcmVhdGlvbiBmb3IgdGhlIExhdHRpY2VcbiAgICAgICAgZmFjdG9yeSBjbGFzcyBnZW5lcmF0aW9uIHRvIHN1Y2NlZWQuXG5cbiAgICAgICAgUGxlYXNlIHJlYWQgdGhlIGRvY3VtZW50YXRpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIGZvcm1hdCBvZlxuICAgICAgICBhIExhdHRpY2VGYWN0b3J5IHRlbXBsYXRlLlxuICAgICAgYCkpXG4gICAgfVxuXG4gICAgaWYgKCFleHRlbmRzRnJvbSh0ZW1wbGF0ZS5uYW1lLCBTdHJpbmcpKSB7XG4gICAgICByZXN1bHRzLmVycm9ycy5wdXNoKG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgICBUaGUgXFxgdGVtcGxhdGUubmFtZVxcYCBmaWVsZCBtdXN0IGJlIGEgc3RyaW5nLlxuXG4gICAgICAgIFBsZWFzZSByZWFkIHRoZSBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHRoZSBmb3JtYXQgb2ZcbiAgICAgICAgYSBMYXR0aWNlRmFjdG9yeSB0ZW1wbGF0ZS5cbiAgICAgIGApKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuc2NoZW1hID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmVzdWx0cy5lcnJvcnMucHVzaChuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgICAgVGhlIFxcYHRlbXBsYXRlLnNjaGVtYVxcYCBmaWVsZCBtdXN0IGV4aXN0IG9yIHRoZSBjcmVhdGlvbiBmb3IgdGhlXG4gICAgICAgIExhdHRpY2UgZmFjdG9yeSBjbGFzcyBnZW5lcmF0aW9uIHRvIHN1Y2NlZWQuXG5cbiAgICAgICAgUGxlYXNlIHJlYWQgdGhlIGRvY3VtZW50YXRpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIGZvcm1hdCBvZlxuICAgICAgICBhIExhdHRpY2VGYWN0b3J5IHRlbXBsYXRlLlxuICAgICAgYCkpXG4gICAgfVxuXG4gICAgaWYgKCFleHRlbmRzRnJvbSh0ZW1wbGF0ZS5zY2hlbWEsIFN0cmluZykpIHtcbiAgICAgIHJlc3VsdHMuZXJyb3JzLnB1c2gobmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICAgIFRoZSBcXGB0ZW1wbGF0ZS5zY2hlbWFcXGAgZmllbGQgbXVzdCBiZSBhIHN0cmluZyBvZiBHcmFwaFFMIFNETC9JRExcblxuICAgICAgICBQbGVhc2UgcmVhZCB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgZm9ybWF0IG9mXG4gICAgICAgIGEgTGF0dGljZUZhY3RvcnkgdGVtcGxhdGUuXG4gICAgICBgKSlcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhZXh0ZW5kc0Zyb20odGVtcGxhdGUucmVzb2x2ZXJzLCBPYmplY3QpICAvLyBTdXBwb3J0cyA5NSUgb2Ygb2JqZWN0c1xuICAgICAgfHwgdHlwZW9mIHRlbXBsYXRlLnJlc29sdmVycyAhPT0gJ29iamVjdCcgLy8gU3VwcG9ydHMgT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgICkge1xuICAgICAgcmVzdWx0cy5lcnJvcnMucHVzaChuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcXHgxYls5MTsxbVxuICAgICAgICBUaGUgXFxgdGVtcGxhdGUucmVzb2x2ZXJzXFxgIGZpZWxkIG11c3QgYmUgYW4gT2JqZWN0IGNvbnRhaW5pbmcgdGhlXG4gICAgICAgIHJlc29sdmVyIGZ1bmN0aW9ucy4gUXVlcnksIE11dGF0aW9uIGFuZCBTdWJzY3JpcHRpb24gcmVzb2x2ZXJzIHdpbGxcbiAgICAgICAgdGFrZSB0aGUgZm9sbG93aW5nIHNpZ25hdHVyZS4gQWRkaXRpb25hbGx5LCB0aGUga2V5cyBmb3IgdGhlc2Ugc3BlY2lhbFxuICAgICAgICByZXNvbHZlcnMgbXVzdCBiZSBRdWVyeSwgTXV0YXRpb24gb3IgU3Vic2NyaXB0aW9uOyByZXNwZWN0aXZlbHlcbiAgICAgICAgXFx4MWJbMzc7MjJtXG4gICAgICAgICAgUXVlcnk6IHsgW3Jlc29sdmVyXTogKHJlcXVlc3REYXRhLCByZXNvbHZlclBhcmFtZXRlcnMpID0+IHt9IH1cbiAgICAgICAgICBNdXRhdGlvbjogeyBbcmVzb2x2ZXJdOiAocmVxdWVzdERhdGEsIHJlc29sdmVyUGFyYW1ldGVycykgPT4ge30gfVxuICAgICAgICAgIFN1YnNjcmlwdGlvbjogeyBbcmVzb2x2ZXJdOiAocmVxdWVzdERhdGEsIHJlc29sdmVyUGFyYW1ldGVycykgPT4ge30gfVxuXG4gICAgICAgICAgd2hlcmU6XG4gICAgICAgICAgICBcXGByZXF1ZXN0RGF0YVxcYCBpcyBhbiBvYmplY3Qgd2l0aCB7IHJlcSwgcmVzLCBncWx8bmV4dCB9IGRlcGVuZGluZ1xuICAgICAgICAgICAgICBvbiB0aGUgZ3JhcGhxbCBzZXJ2ZXIgaW1wbGVtZW50YXRpb24gKEZCIFJlZmVyZW5jZSwgQXBvbGxvLCBldGMpXG4gICAgICAgICAgICBcXGByZXNvdmxlclBhcmFtZXRlcnNcXGAgaXMgYW4gb2JqZWN0IHdpdGgga2V5cyBtYXRjaGluZyB0aG9zZVxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzIGRlZmluZWQgaW4gdGhlIFNDSEVNQSBmb3IgdGhlIHJlc29sdmVyIGluIHF1ZXN0aW9uLlxuICAgICAgICBcXHgxYls5MTsxbVxuICAgICAgICBGaWVsZCByZXNvbHZlcnMgc2hvdWxkIGJlIGZvdW5kIHVuZGVyIHRoZSBrZXkgbmFtZSBvZiB0aGUgdHlwZVxuICAgICAgICBvciBpbnRlcmZhY2UgaW4gcXVlc3Rpb24gYW5kIG11c3QgY29ycmVzcG9uZCB0byB0aGUgZm9sbG93aW5nIHNpZ25hdHVyZVxuICAgICAgICBcXHgxYlszNzsyMm1cbiAgICAgICAgICBbVHlwZV06IHsgW3Jlc29sdmVyXTogKHJlc29sdmVyUGFyYW1ldGVycykgPT4ge30gfVxuXG4gICAgICAgICAgd2hlcmU6XG4gICAgICAgICAgICBcXGBUeXBlXFxgIGlzIHRoZSBuYW1lIG9mIHRoZSBHUUwgdHlwZSBkZWZpbmVkIGluIHRoZSBzY2hlbWFcbiAgICAgICAgICAgIFxcYHJlc292bGVyUGFyYW1ldGVyc1xcYCBpcyBhbiBvYmplY3Qgd2l0aCBrZXlzIG1hdGNoaW5nIHRob3NlXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnMgZGVmaW5lZCBpbiB0aGUgU0NIRU1BIGZvciB0aGUgcmVzb2x2ZXIgaW4gcXVlc3Rpb24uXG5cbiAgICAgICAgICAqIGl0IGlzIHdvcnRoIG5vdGluZyB0aGF0IHRoZSBmaWVsZCByZXNvbHZlcnMgYXJlIG5vdCBzdGF0aWMgYW5kXG4gICAgICAgICAgICBjYW4gYWNjZXNzIHRoZSBcXGByZXF1ZXN0RGF0YVxcYCBvYmplY3QgdmlhIFxcYHRoaXMucmVxdWVzdERhdGFcXGBcbiAgICAgICAgXFx4MWJbOTE7MW1cbiAgICAgICAgUGxlYXNlIHJlYWQgdGhlIGRvY3VtZW50YXRpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIGZvcm1hdCBvZlxuICAgICAgICBhIExhdHRpY2VGYWN0b3J5IHRlbXBsYXRlLlxceDFiWzBtXG4gICAgICBgKSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLmRvY3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXN1bHRzLmVycm9ycy5wdXNoKG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgICBUaGUgXFxgdGVtcGxhdGUuZG9jc1xcYCBmaWVsZCBtdXN0IGV4aXN0IGZvciB0aGUgY3JlYXRpb24gb2YgdGhlXG4gICAgICAgIExhdHRpY2UgZmFjdG9yeSBjbGFzcyBnZW5lcmF0aW9uIHRvIHN1Y2NlZWQuXG5cbiAgICAgICAgUGxlYXNlIHJlYWQgdGhlIGRvY3VtZW50YXRpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIGZvcm1hdCBvZlxuICAgICAgICBhIExhdHRpY2VGYWN0b3J5IHRlbXBsYXRlLlxuICAgICAgYCkpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIWV4dGVuZHNGcm9tKHRlbXBsYXRlLmRvY3MsIE9iamVjdCkgIC8vIFN1cHBvcnRzIDk1JSBvZiBvYmplY3RzXG4gICAgICB8fCB0eXBlb2YgdGVtcGxhdGUuZG9jcyAhPT0gJ29iamVjdCcgLy8gU3VwcG9ydHMgT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgICkge1xuICAgICAgbGV0IGRyID0gJ1xceDFiWzMxbScsIGJyID0gJ1xceDFiWzkxbSdcbiAgICAgIGxldCBiMSA9ICdcXHgxYlsxbScsIGIwID0gJ1xceDFiWzIybSdcbiAgICAgIGxldCBiYiA9ICdcXHgxYls5MG0nXG4gICAgICBsZXQgZGcgPSAnXFx4MWJbMzdtJywgYmcgPSAnXFx4MWJbOTdtJ1xuICAgICAgbGV0IGEwID0gJ1xceDFiWzBtJ1xuICAgICAgbGV0IGdyID0gJ1xceDFiWzMybScsIGJnciA9ICdcXHgxYls5Mm0nXG5cbiAgICAgIHJlc3VsdHMuZXJyb3JzLnB1c2gobmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXFx4MWJbMTs5MW1cbiAgICAgICAgVGhlIFxcYHRlbXBsYXRlLmRvY3NcXGAgZmllbGQgbXVzdCBiZSBhbiBvYmplY3QgY29udGFpbmluZyBrZXlzIGFuZFxuICAgICAgICB2YWx1ZSBwYWlycyBtYXRjaGluZyB0aGUgdHlwZXMsIGVudW1zLCB1bmlvbnMgYW5kIGludGVyZmFjZXMgZGVmaW5lZFxuICAgICAgICBpbiB5b3VyIHNjaGVtYS5cblxuICAgICAgICBUaGUgc3BlY2lhbCBTeW1ib2wgb2JqZWN0IFRZUEUgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIHRoZSBkb2NzIGZvclxuICAgICAgICB0aGUgbmFtZWQgb3Iga2V5ZWQgZmllbGQgZGVzY3JpYmluZyB0aGUgZG9jdW1lbnRhdGlvbiB0byBiZSBwcm9jZXNzZWRcbiAgICAgICAgQ29tbWVudHMgZm9yIHRoZSBcXGBRdWVyeVxcYCwgXFxgTXV0YXRpb25cXGAsIGFuZCBcXGBTdWJzY3JpcHRpb25cXGAgW1RZUEVdXG4gICAgICAgIGVudHJpZXMgd2lsbCByZXBsYWNlIGFueSBwcmV2aW91cyBvbmUgdGhhdCBjb21lcyBiZWZvcmUgaXQuIFR5cGljYWxseVxuICAgICAgICB0aGlzIGZpZWxkIGlzIGJlc3QgbGVmdCB1bmRlc2NyaWJlZCBzaW5jZSB0aGVyZSB3aWxsIGV2ZXIgb25seSBiZVxuICAgICAgICBvbmUgb2YgZWFjaCBhdCBtb3N0LlxuXG4gICAgICAgIFxceDFiWzIyOzMxbUV4YW1wbGVzIHNob3VsZCBsb29rIHNvbWV0aGluZyBsaWtlIHRoaXM6XFx4MWJbMjI7MzdtXG4gICAgICAgICAgaW1wb3J0IHsgVFlQRSwgam9pbkxpbmVzIH0gZnJvbSAnZ3JhcGhxbC1sYXR0aWNlJ1xuXG4gICAgICAgICAgZXhwb3J0IGRlZmF1bHQge1xuICAgICAgICAgICAgJHtiYn0vKiBvdGhlciBmaWVsZHMgKi8ke2RnfVxuXG4gICAgICAgICAgICAke2IxfXNjaGVtYToke2IwfSBqb2luTGluZXMke2dyfVxcYFxuICAgICAgICAgICAgICB0eXBlIFBlcnNvbiB7IGlkOiBJRCBuYW1lOiBTdHJpbmcgfVxuICAgICAgICAgICAgICB0eXBlIFF1ZXJ5IHsgZmluZFBlcnNvbihpZDogSUQpOiBQZXJzb24gfVxuICAgICAgICAgICAgICB0eXBlIE11dGF0aW9uIHsgc2V0UGVyc29uTmFtZShpZDogSUQsIG5hbWU6IFN0cmluZyk6IFBlcnNvbiB9XG4gICAgICAgICAgICBcXGAke2RnfSxcblxuICAgICAgICAgICAgJHtiMX1kb2NzOiR7YjB9IHtcbiAgICAgICAgICAgICAgJHtiMX1QZXJzb246JHtiMH0ge1xuICAgICAgICAgICAgICAgIFtUWVBFXTogJHtncn0nQSBjb250cml2ZWQgcGVyc29uIHR5cGUnJHtkZ30sXG4gICAgICAgICAgICAgICAgaWQ6ICR7Z3J9J0EgdW5pcXVlIGlkZW50aWZpZXIgZm9yIGEgcGVyc29uJyR7ZGd9LFxuICAgICAgICAgICAgICAgIG5hbWU6ICR7Z3J9J0Egc3RyaW5nIGRlbm90aW5nIHRoZSBuYW1lIG9mIGEgcGVyc29uJyR7ZGd9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICR7YjF9UXVlcnk6JHtiMH0ge1xuICAgICAgICAgICAgICAgIGZpbmRQZXJzb246ICR7Z3J9J0EgcXVlcnkgdGFraW5nIGFuIElELCByZXR1cm5zIGEgUGVyc29uJyR7ZGd9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAke2IxfU11dGF0aW9uOiR7YjB9IHtcbiAgICAgICAgICAgICAgICBzZXRQZXJzb25OYW1lOiBqb2luTGluZXMke2dyfVxcYFxuICAgICAgICAgICAgICAgICAgQSBtdXRhdGlvbiB0aGF0IHNldHMgdGhlIG5hbWUgb2YgdGhlIHVzZXIgaWRlbnRpZmllZCBieSBhblxuICAgICAgICAgICAgICAgICAgSUQgdG8gdGhlIG5ldyBuYW1lIHZhbHVlIHN1cHBsaWVkXG4gICAgICAgICAgICAgICAgXFxgJHtkZ31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXFx4MWJbMjI7MzFtXG4gICAgICAgIE5vdGUgdGhlIHVzYWdlIG9mIFxcYFBlcnNvblxcYCwgXFxgUXVlcnlcXGAgYW5kIFxcYE11dGF0aW9uXFxgIGV4cGxpY2l0bHlcbiAgICAgICAgYXMga2V5cyB0byB0aGUgc3VwcGxpZWQgXFxgZG9jc1xcYCBvYmplY3QuXFx4MWJbMG1cbiAgICAgIGApKVxuICAgIH1cblxuICAgIGlmICghcmVzdWx0cy52YWxpZCkge1xuICAgICAgbGV0IGVycm9yU3RyaW5ncyA9IFtdXG5cbiAgICAgIGZvciAobGV0IGVycm9yIG9mIHJlc3VsdHMuZXJyb3JzKSB7XG4gICAgICAgIGxldCB7IG1lc3NhZ2UsIHN0YWNrIH0gPSBlcnJvclxuXG4gICAgICAgIHN0YWNrID0gc3RhY2tcbiAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgIC5zcGxpY2UobWVzc2FnZS5zcGxpdCgnXFxuJykubGVuZ3RoKVxuICAgICAgICAgIC5tYXAocyA9PiBzLnRyaW0oKSlcbiAgICAgICAgICAuam9pbignXFxuJylcbiAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSgvKEVycm9yOlxccykvLCAnJDFcXG4nKS50cmltKClcblxuICAgICAgICBlcnJvclN0cmluZ3MucHVzaChcbiAgICAgICAgICBgXFx4MWJbMzE7MW0ke21lc3NhZ2V9XFx4MWJbMG1cXG5gICsgaW5kZW50KHN0YWNrKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgICBPT1BTIVxuXG4gICAgICAgIEFuIGVycm9yIG9jY3VycmVkIHZhbGlkYXRpbmcgeW91ciBmYWN0b3J5IHRlbXBsYXRlLiBUaGUgb2JqZWN0XG4gICAgICAgIGluIHF1ZXN0aW9uIGlzIGFzIGZvbGxvd3M6XG5cbiAgICAgICAgQHRlbXBsYXRlXG5cbiAgICAgICAgVGhlIGluZGl2aWR1YWwgZXJyb3JzIHRoYXQgb2NjdXJyZWQgYXJlOlxuICAgICAgICBcXG5AZXJyb3JzYFxuICAgICAgICAucmVwbGFjZSgvQHRlbXBsYXRlLywgaW5kZW50KF9pKHRlbXBsYXRlKSkpXG4gICAgICAgIC5yZXBsYWNlKC9AZXJyb3JzLywgZXJyb3JTdHJpbmdzLmpvaW4oJ1xcblxcbicpKVxuICAgICAgKVxuXG4gICAgICBlcnJvci5zdGFjayA9IGVycm9yLm1lc3NhZ2VcbiAgICAgIGVycm9yLm1lc3NhZ2UgPSAnJ1xuXG4gICAgICBpZiAoIWhpZGUpIHRocm93IGVycm9yXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3RhcnRpbmcgcG9pbnQgb2YgYSBMYXR0aWNlRmFjdG9yeSBvYmplY3QgLT4gY2xhc3MgY3JlYXRpb24uIFRoZSBuYW1lXG4gICAqIG9mIHRoZSBjbGFzcyBhbmQgYmFzZUNsYXNzIHRvIHVzZSBhcmUgcHJvdmlkZWQgYW5kIGFyZSBjcmVhdGVkIGZyb20gdGhlcmUuXG4gICAqIEF0IHRoaXMgcG9pbnQsIHRoZSBnZW5lcmF0ZWQgY2xhc3MgaXMgc3RpbGwgaW5jb21wbGV0ZS4gSXQgbXVzdCBjb21wbGV0ZVxuICAgKiB0aGUgZW50aXJlIGNoZWNrbGlzdCBiZWZvcmUgYmVpbmcgZGVlbWVkIHZhbGlkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBjcmVhdGVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gYmFzZUNsYXNzIHRoZSBMYXR0aWNlIGNsYXNzIHlvdXIgbmV3IGNsYXNzIHNob3VsZCBleHRlbmQ7XG4gICAqIHdoaWxlIHRoaXMgY2FuIGJlIGFueXRoaW5nLCBpdCBzaG91bGQgYmUgR1FMQmFzZSwgR1FMSW50ZXJmYWNlLCBHUUxFbnVtIG9yXG4gICAqIEdRTFVuaW9uLiBUaGlzIGRlZmF1bHRzIHRvIEdRTEJhc2Ugc2hvdWxkIG5vdGhpbmcgYmUgc3VwcGxpZWRcbiAgICogQHJldHVybiB7RnVuY3Rpb259IGFjdHVhbGx5IHRoaXMgcmV0dXJucyB0aGUgZ2VuZXJhdGVkIGNsYXNzXG4gICAqL1xuICBzdGF0aWMgZ2VuZXJhdGVDbGFzcyhuYW1lOiBzdHJpbmcsIGJhc2VDbGFzczogRnVuY3Rpb24gPSBHUUxCYXNlKSB7XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xhdHRpY2VGYWN0b3J5LmdlbmVyYXRlQ2xhc3MgbmVlZHMgYSBuYW1lISEnKVxuICAgIH1cblxuICAgIC8vIEFscmlnaHQgbGFkaWVzIGFuZCBnZW50bGVtZW4sIGhvbGQgb250byB5b3VyIGhhdHM7IHdlJ3JlIGVudGVyaW5nIHRoZVxuICAgIC8vIG1ldGEgem9uZSEhISBUaGUgd2F5IHRoZSBmb2xsb3dpbmcgd29ya3MgaXMgdG8gbWFrZSBzdXJlIHRoYXQgb3VyXG4gICAgLy8gcGFzc2VkIGluIGJhc2UgY2xhc3MgYGJhc2VDbGFzc2AgaXMgYWN0dWFsbHkgaW4gc2NvcGUgYXMgdGhlIG5hbWUgb2ZcbiAgICAvLyB0aGUgdmFsdWUgaXQgcmVwcmVzZW50cy4gV2UgdXNlIHRoZSBgbmV3IEZ1bmN0aW9uKClgIHN5bnRheCB0byBkbyB0aGF0XG4gICAgLy8gYnV0IHdlIGRvIGl0IHZpYSBldmFsIHNpbmNlIHdlIGRvbid0IGtub3cgdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uXG4gICAgLy8gYXQgdGhlIHRpbWUgd2Ugd3JpdGUgdGhlIGNvZGVcbiAgICAvL1xuICAgIC8vIFNvIGdpdmVuIGEgY2xhc3MgbmFtZSBvZiBcIkNhclwiIGFuZCBiYXNlTmFtZSBlcXVhbGxpbmcgR1FMQmFzZSwgdGhlIENsYXNzXG4gICAgLy8gaW5zdGFuY2UsIGZuIHdvdWxkIGxvb2sgc29tZXRoaW5nIGxpa2UgdGhlIHJlc3VsdHMgb2YgY2FsbGluZyB0aGlzXG4gICAgLy9cbiAgICAvLyBsZXQgZm4gPSBuZXcgRnVuY3Rpb24oXG4gICAgLy8gICBcIkdRTEJhc2VcIixcbiAgICAvLyAgIFwiY2xhc3MgQ2FyIGV4dGVuZHMgR1FMQmFzZSB7fTsgcmV0dXJuIENhcjtcIlxuICAgIC8vIClcbiAgICAvL1xuICAgIC8vIFdoaWNoIGluIHR1cm4gc2V0cyBmbiB0byBzb21ldGhpbmcgdGhhdCB3b3VsZCBiZSB0aGUgc2FtZSBhc1xuICAgIC8vXG4gICAgLy8gZnVuY3Rpb24gZm4oR1FMQmFzZSkgeyBjbGFzcyBDYXIgZXh0ZW5kcyBHUUxCYXNlIHt9OyByZXR1cm4gQ2FyIH1cbiAgICAvL1xuICAgIC8vIFdoaWNoIG1lYW5zIHRoYXQgd2hlbiB3ZSBpbnZva2UgZm4oYmFzZUNsYXNzKSwgd2hpY2ggaXMgZm4oR1FMQmFzZSksXG4gICAgLy8gd2UgZ2V0IHRoZSByZXN1bHRzIHdlIGludGVuZDsgZXZlbiBpZiBHUUxCYXNlIGlzIG5vdCBuZWNlc3NhcmlseSBpblxuICAgIC8vIHRoZSBzY29wZSBvZiB0aGUgZnVuY3Rpb24gYXQgdGhlIHRpbWUgb2YgY2FsbC4gTmVhdC4gU2NhcnkuIE9NRyBUaGFua3NcbiAgICAvLyBmb3IgY29kZSBjb21tZW50cy4gWW91J3JlIHdlbGNvbWUgZnV0dXJlIG1lLlxuICAgIGxldCBmbiA9IGV2YWwoYChuZXcgRnVuY3Rpb24oXG4gICAgICBcIiR7YmFzZUNsYXNzLm5hbWV9XCIsXG4gICAgICBcImNsYXNzICR7bmFtZX0gZXh0ZW5kcyAke2Jhc2VDbGFzcy5uYW1lfSB7fTsgcmV0dXJuICR7bmFtZX07XCJcbiAgICApKWApO1xuXG4gICAgbGV0IENsYXNzID0gZm4oYmFzZUNsYXNzKVxuXG4gICAgdGhpcy5icmFuZENsYXNzKENsYXNzKVxuICAgIG5ld0NoZWNrbGlzdChDbGFzcylcblxuICAgIHJldHVybiBDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmplY3RzIHRoZSBTQ0hFTUEgcHJvcGVydHkgaW50byB0aGUgbmV3bHkgZGVmaW5lZCBjbGFzcy4gVGhlIHN1cHBsaWVkXG4gICAqIGBzY2hlbWFgIHN0cmluZyBiZWNvbWVzIHdoYXQgdGhlIG5ldyBjbGFzcyByZXR1cm5zIHdoZW4gYC5TQ0hFTUFgIGlzXG4gICAqIGdvdHRlbi5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgdGhpcyB3aWxsIHRocm93IGFuIGVycm9yIGlmIHRoZSBjbGFzcyBpcyBub3Qgb25lXG4gICAqIGdlbmVyYXRlZCBieSB0aGUgTGF0dGljZUZhY3Rvcnkgb3IgaWYgdGhlIGNsYXNzIGl0c2VsZiBpcyBudWxsIG9yIHVuZGVmaW5lZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1hIHRoZSBzdHJpbmcgdGhhdCB0aGUgbmV3IGNsYXNzIHNob3VsZCByZXR1cm5cbiAgICogQHJldHVybiB7RnVuY3Rpb259IHJldHVybnMgdGhlIG1vZGlmaWVkIENsYXNzIHdpdGggdGhlIGBDSEVDS19TQ0hFTUFgXG4gICAqIHBvcnRpb24gdGlja2VkIG9mZiBpbnRlcm5hbGx5LlxuICAgKi9cbiAgc3RhdGljIGluamVjdFNjaGVtYShDbGFzczogRnVuY3Rpb24sIHNjaGVtYTogc3RyaW5nKSB7XG4gICAgaWYgKCFDbGFzcyB8fCAhaGFzQ2hlY2tsaXN0KENsYXNzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICAgIEVpdGhlciB0aGUgc3VwcGxpZWQgc2NoZW1hIHN0cmluZyBpcyBpbnZhbGlkXG4gICAgICAgICAgU0NIRU1BOiBcXGBcbiAgICAgICAgICAgICR7c2NoZW1hfVxuICAgICAgICAgIFxcYFxuXG4gICAgICAgIE9yIHlvdXIgc3VwcGxpZWQgY2xhc3MgJHsoQ2xhc3MgJiYgQ2xhc3MubmFtZSkgfHwgJ3VuZGVmaW5lZCd9IGlzXG4gICAgICAgIG5vbi1leGlzdGVudC4gUGxlYXNlIGNoZWNrIHlvdXIgY29kZSBhbmQgdHJ5IHRoZSBMYXR0aWNlRmFjdG9yeVxuICAgICAgICBhZ2Fpbi5cbiAgICAgIGApXG4gICAgfVxuXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDbGFzcywgJ1NDSEVNQScsIHtcbiAgICAgIGdldCgpIHsgcmV0dXJuIHNjaGVtYSB9XG4gICAgfSlcblxuICAgIHNldENoZWNrbGlzdChDbGFzcywgQ0hFQ0tfU0NIRU1BKVxuXG4gICAgcmV0dXJuIENsYXNzXG4gIH1cblxuICAvKipcbiAgICogSW5qZWN0cyB0aGUgcmVzb2x2ZXJzIGludG8gYXBwcm9wcmlhdGUgYXJlYXMuIFJlc29sdmVycyBrZXllZCBieSBgUXVlcnlgLFxuICAgKiBgTXV0YXRpb25gLCBvciBgU3Vic2NyaXB0aW9uYCB3aWxsIGJlIHBsYWNlZCBpbnRvIHRoZSBhcHByb3ByaWF0ZSBhcmVhXG4gICAqIGluIGBDbGFzc1tNRVRBX0tFWV1gIHdoaWNoIGFjdHMgYXMgYSBzdGFnaW5nIGFyZWEgb3JpZ2luYWxseSBkZXNpZ25lZCBmb3JcbiAgICogdXNlIHdpdGggdGhlIEByZXNvbHZlciwgQG11dGF0b3IgYW5kIEBzdWJzY3JpcHRvciBkZWNvcmF0b3JzLiBUaGVzZSB3aWxsXG4gICAqIGJlIGJvdW5kIGluIGEgdHlwaWNhbCBmYXNoaW9uIGFzIGlzIGRvbmUgd2l0aCB0aGUgZGVjb3JhdG9ycyBtYWtpbmcgdGhlXG4gICAqIGZpcnN0IHBhcmFtZXRlciBiZWNvbWluZyB0aGUgcmVxdWVzdERhdGEgb2YgdGhlIG9iamVjdCBpbnN0YW5jZSBhbmQgdGhlXG4gICAqIHNlY29uZCBiZWluZyB0aGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhcmFtZXRlcnMgZm9yIHRoZSByZXNvbHZlciBhc1xuICAgKiBwYXNzZWQgaW4gYnkgR3JhcGhRTC4gU3Vic2VxdWVudCBwYXJhbWV0ZXJzIHdpbGwgYmUgc3VwcGxpZWQgYXMgaXMgdGhlXG4gICAqIGZhc2hpb24gb2YgdGhlIHN5c3RlbSB5b3UncmUgdXNpbmc7IEZhY2Vib29rJ3MgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uIG9yXG4gICAqIEFwb2xsbyBvciBzb21ldGhpbmcgZWxzZS5cbiAgICpcbiAgICogUmVzb2x2ZXJzIGtleWVkIGJ5IHR5cGUgbmFtZSBhcmUgY29uc2lkZXJlZCB0byBiZSBmaWVsZCByZXNvbHZlcnMgYW5kXG4gICAqIGhhdmUgYSBkaWZmZXJlbnQgc2lnbmF0dXJlLiBUaGV5IGNhbiBiZSBwcm9wZXJ0aWVzIG9mIHRoZSBrZXksIGluXG4gICAqIHdoaWNoIGNhc2UgdGhleSB3aWxsIHNpbXBseSBiZSBpbnN0YWxsZWQgYXMgZ2V0dGVycy4gT3IgdGhleSBjYW4gYmVcbiAgICogZnVuY3Rpb25zOyBzeW5jaHJvbm91cyBvciBhc3luY2hyb25vdXMuIEZ1bmN0aW9uIGZpZWxkIHJlc29sdmVycyBhcmVcbiAgICogaW5zdGFuY2UgbWV0aG9kcyBhbmQgY2FuIG1ha2UgdXNlIG9mIGB0aGlzLmdldE1vZGVsKClgIG9yXG4gICAqIGB0aGlzLnJlcXVlc3REYXRhYCBpbnRlcm5hbGx5LlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyB0aGUgY2xhc3MsIGdlbmVyYXRlZCBieSBnZW5lcmF0ZUNsYXNzKCkgbGVzdCBhblxuICAgKiBlcnJvciBiZSB0aHJvd24sIHRvIHdoaWNoIHRvIGFkZCB0aGUgcmVzb2x2ZXJzIGZyb20gYSB0ZW1wbGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzb2x2ZXJPYmogYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJlc29sdmVycyBhcyBkaWN0YXRlZFxuICAgKiBieSB0aGUgbmV3IGZvcm1hdC5cbiAgICogQHJldHVybiB7RnVuY3Rpb259IHJldHVybnMgdGhlIG1vZGlmaWVkIENsYXNzIHdpdGggdGhlIGBDSEVDS19SRVNPTFZFUlNgXG4gICAqIHBvcnRpb24gdGlja2VkIG9mZiBpbnRlcm5hbGx5LlxuICAgKi9cbiAgc3RhdGljIGluamVjdFJlc29sdmVycyhDbGFzczogRnVuY3Rpb24sIHJlc29sdmVyczogT2JqZWN0KTogRnVuY3Rpb24ge1xuICAgIGlmICghaGFzQ2hlY2tsaXN0KENsYXNzLCBDSEVDS19TQ0hFTUEpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgICAgXFxgaW5qZWN0UmVzb2x2ZXJzXFxgIGNhbm5vdCBiZSBjYWxsZWQgb24gYSBjbGFzcyB3aXRob3V0IGEgU0NIRU1BLlxuICAgICAgICBQbGVhc2UgdmVyaWZ5IHlvdXIgcHJvZ3Jlc3MgaW4gdGhlIHByb2Nlc3MgYW5kIHRyeSBhZ2Fpbi5cbiAgICAgIGApXG4gICAgfVxuXG4gICAgbGV0IHRyZWUgPSBTeW50YXhUcmVlLmZyb20oQ2xhc3MuU0NIRU1BKVxuICAgIGxldCBvdXRsaW5lID0gdHJlZSA/IHRyZWUub3V0bGluZSA6IHt9XG5cbiAgICBpZiAoQ2xhc3MubmFtZSBpbiBvdXRsaW5lICYmIENsYXNzLm5hbWUgaW4gcmVzb2x2ZXJzKSB7XG4gICAgICBsZXQgZmllbGRzID0gT2JqZWN0LmtleXMob3V0bGluZVtDbGFzcy5uYW1lXSlcblxuICAgICAgZm9yIChsZXQgZmllbGRSZXNvbHZlciBvZiBmaWVsZHMpIHtcbiAgICAgICAgaWYgKCFmaWVsZFJlc29sdmVyIGluIHJlc29sdmVyc1tDbGFzcy5uYW1lXSkge1xuICAgICAgICAgIExMLndhcm4oY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OiB0cnVlfSlgXG4gICAgICAgICAgICAke2ZpZWxkUmVzb2x2ZXJ9IG5vdCBzdXBwbGllZCBpbiByZXNvbHZlcnMgZm9yICR7Q2xhc3MubmFtZX1cbiAgICAgICAgICBgKVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByb3AgPSByZXNvbHZlcnNbQ2xhc3MubmFtZV1bZmllbGRSZXNvbHZlcl1cblxuICAgICAgICBpZiAocHJvcCAmJiB0eXBlb2YgcHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIExMLmluZm8oJ0luamVjdGluZyBbZm5dICVzJywgZmllbGRSZXNvbHZlcilcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2xhc3MucHJvdG90eXBlLCBmaWVsZFJlc29sdmVyLCB7XG4gICAgICAgICAgICB2YWx1ZTogcHJvcFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgTEwuaW5mbygnSW5qZWN0aW5nIFtwcm9wXSAlcycsIGZpZWxkUmVzb2x2ZXIpXG4gICAgICAgICAgUHJvcGVydGllcyhmaWVsZFJlc29sdmVyKShDbGFzcywgWydmYWN0b3J5LXByb3BzJ10pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBbdHlwZTogc3RyaW5nLCBkZWNvcmF0b3I6IEZ1bmN0aW9uXSBvZiBbXG4gICAgICBbJ1F1ZXJ5JywgcmVzb2x2ZXJdLFxuICAgICAgWydNdXRhdGlvbicsIG11dGF0b3JdLFxuICAgICAgWydTdWJzY3JpcHRpb24nLCBzdWJzY3JpcHRvcl1cbiAgICBdKSB7XG4gICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG91dGxpbmVbdHlwZV0gfHwge30pXG5cbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGlmICghdHlwZSBpbiBvdXRsaW5lIHx8ICFrZXlzLmxlbmd0aCkgeyBjb250aW51ZTsgfVxuXG4gICAgICBmb3IgKGxldCBmbk5hbWUgb2Yga2V5cykge1xuICAgICAgICBsZXQgZm4gPSByZXNvbHZlcnNbZm5OYW1lXVxuICAgICAgICBkZWNvcmF0b3IoQ2xhc3MsIGZuTmFtZSwge3ZhbHVlOiBmbn0pXG4gICAgICAgIExMLmluZm8oJ0FkZGluZyAlcyByZXNvbHZlciBbJXNdJywgdHlwZSwgZm5OYW1lKVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldENoZWNrbGlzdChDbGFzcywgQ0hFQ0tfUkVTT0xWRVJTKVxuXG4gICAgcmV0dXJuIENsYXNzXG4gIH1cblxuICBzdGF0aWMgaW5qZWN0RG9jcyhDbGFzczogRnVuY3Rpb24sIGRvY3M6IE9iamVjdCk6IEZ1bmN0aW9uIHtcbiAgICBpZiAoIWhhc0NoZWNrbGlzdChDbGFzcywgQ0hFQ0tfU0NIRU1BLCBDSEVDS19SRVNPTFZFUlMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgICAgXFxgaW5qZWN0RG9jc1xcYCBjYW5ub3QgYmUgY2FsbGVkIG9uIGEgY2xhc3Mgd2l0aG91dCBhIFNDSEVNQSBvclxuICAgICAgICBSRVNPTFZFUlMgZGVmaW5lZC4gUGxlYXNlIHZlcmlmeSB5b3VyIHByb2dyZXNzIGluIHRoZSBwcm9jZXNzIGFuZCB0cnlcbiAgICAgICAgYWdhaW4uXG4gICAgICBgKVxuICAgIH1cblxuICAgIGxldCBjb3B5UHJvcCA9IChcbiAgICAgIG86IG1peGVkLFxuICAgICAgcHJvcDogc3RyaW5nIHwgU3ltYm9sLFxuICAgICAgdG86IG1peGVkLFxuICAgICAgYXM6ID8oc3RyaW5nIHwgU3ltYm9sKVxuICAgICk6IG1peGVkID0+IHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGxldCBwcm90b3R5cGUgPSBvLnByb3RvdHlwZSB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YobylcbiAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIHByb3ApXG5cbiAgICAgIGlmICghYXMpIHtcbiAgICAgICAgYXMgPSBwcm9wXG4gICAgICB9XG5cbiAgICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0bywgYXMsIGRlc2NyaXB0b3IpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgICB0b1thc10gPSBvW3Byb3BdXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCBvdXIgZnV0dXJlIGBzdGF0aWMgYXBpRG9jcygpYCBtZXRob2Qgb2Ygb3VyIGZhY3RvcnlcbiAgICAvLyBnZW5lcmF0ZWQgY2xhc3Mgd2lsbCByZXR1cm5cbiAgICBsZXQgcmVzdWx0ID0ge31cblxuICAgIC8vIFNldHVwIHRoZSBjb25zdGFudHMgd2Ugd2lsbCBuZWVkIGluIHRoaXMgY29udmVyc2lvblxuICAgIGNvbnN0IHsgVFlQRSB9ID0gdGhpcztcbiAgICBjb25zdCB7XG4gICAgICBET0NfQ0xBU1MsIERPQ19GSUVMRFMsIERPQ19RVUVSWSwgRE9DX01VVEFUSU9OLCBET0NfU1VCU0NSSVBUSU9OLFxuICAgICAgRE9DX1FVRVJJRVMsIERPQ19NVVRBVElPTlMsIERPQ19TVUJTQ1JJUFRJT05TXG4gICAgfSA9IEdRTEJhc2VcblxuICAgIC8vIFRoaXMgcGFydCBtaWdodCBnZXQgYSBsaXR0bGUgbWV0YSwgc28gSSBoYXZlIHByb3ZpZGVkIGNvbW1lbnRzLiBZb3UgYXJlXG4gICAgLy8gd2VsY29tZSBmdXR1cmUgbWUuIEkgaG9wZSBpdCBoZWxwcy4gVGhpcyBnbmFybHkgYmxvY2sgc2hvdWxkIGNvdmVyIGFsbFxuICAgIC8vIHRoZSBkZXNjcmlwdGlvbnMgZm9yIFF1ZXJ5LCBNdXRhdGlvbiwgU3Vic2NyaXB0aW9uIGFuZCB0aGUgQ2xhc3Mgd2VcbiAgICAvLyBhcmUgY3JlYXRpbmcuIE90aGVyIHN1cGVyZmx1b3VzXG4gICAgZm9yIChsZXQgW1R5cGUsIFRvcExldmVsQ29uc3RhbnQsIEZpZWxkQ29uc3RhbnRzXSBvZiBbXG4gICAgICBbJ1F1ZXJ5JywgRE9DX1FVRVJZLCBET0NfUVVFUklFU10sXG4gICAgICBbJ011dGF0aW9uJywgRE9DX01VVEFUSU9OLCBET0NfTVVUQVRJT05TXSxcbiAgICAgIFsnU3Vic2NyaXB0aW9uJywgRE9DX1NVQlNDUklQVElPTiwgRE9DX1NVQlNDUklQVElPTlNdLFxuICAgICAgW0NsYXNzLm5hbWUsIERPQ19DTEFTUywgRE9DX0ZJRUxEU11cbiAgICBdKSB7XG4gICAgICAvLyBPbmUgb2YgJ1F1ZXJ5JywgJ011dGF0aW9uJywgb3IgJ1N1YnNjcmlwdGlvbidcbiAgICAgIGlmIChkb2NzW1R5cGVdKSB7XG4gICAgICAgIC8vIElmIGEgdG9wIGxldmVsIGRlc2NyaXB0aW9uIGlzIHByZXNlbnQgKGkuZS4gUXVlcnksIE11dGF0aW9uIG9yXG4gICAgICAgIC8vIFN1YnNjcmlwdGlvbiBkZXNjcmlwdGlvbilcbiAgICAgICAgaWYgKGRvY3NbVHlwZV1bVFlQRV0pIHtcbiAgICAgICAgICBjb3B5UHJvcChkb2NzW1R5cGVdLCBUWVBFLCByZXN1bHQsIFRvcExldmVsQ29uc3RhbnQpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGZXRjaCB0aGUgcHJvcGVydGllcyBmcm9tIHRoZSBzdXBwbGllZCBkb2NzIG9iamVjdDsgVFlQRSBTeW1ib2xzXG4gICAgICAgIC8vIGRvIG5vdCBzaG93IHVwIGluIGEgY2FsbCB0byBlbnRyaWVzIHdoaWNoIGlzIHdoeSBpdCBpcyBoYW5kbGVkIGFib3ZlXG4gICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICAgbGV0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhkb2NzW1R5cGVdKVxuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgZW50cmllcyB0byBkb2N1bWVudCwgY3JlYXRlIGFuIG9iamVjdCB0byBob2xkIHRob3NlXG4gICAgICAgIC8vIHZhbHVlczsgaS5lLiBpZiB3ZSBoYXZlIGB7IFF1ZXJ5OiB7IGdldFBlb3BsZTogJ2Rlc2MnIH0gfWAsIHdlIG5lZWRcbiAgICAgICAgLy8gdG8gbWFrZSBzdXJlIHdlIGhhdmUgYHsgW0RPQ19RVUVSSUVTXTogeyBnZXRQZW9wbGU6ICdkZXNjJyB9IH1gIGluXG4gICAgICAgIC8vIG91ciByZXN1bHQuIFRoZSBvYmplY3QgaG9sZGluZyBnZXRQZW9wbGUgaW4gdGhlIGVuZCB0aGVyZSBpcyBkZWZpbmVkXG4gICAgICAgIC8vIGJlbG93IHdoZW4gd2UgaGF2ZSBzb21ldGhpbmcgdG8gY29weS5cbiAgICAgICAgaWYgKGVudHJpZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcmVzdWx0W0ZpZWxkQ29uc3RhbnRzXSA9IHt9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb3IgZWFjaCBuYW1lIHZhbHVlIHBhaXIgZGVmaW5lZCBhYm92ZSwgY29weSBpdHMgZGVzY3JpcHRvciBvciBiYXNlXG4gICAgICAgIC8vIHZhbHVlIGlmIGEgZGVzY3JpcHRvciBpc24ndCBhdmFpbGFibGVcbiAgICAgICAgZm9yIChsZXQgW3Byb3AsIHZhbHVlXSBvZiBlbnRyaWVzKSB7XG4gICAgICAgICAgY29weVByb3AoZG9jc1tUeXBlXSwgcHJvcCwgcmVzdWx0W0ZpZWxkQ29uc3RhbnRzXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDbGFzcywgJ2FwaURvY3MnLCB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7IHJldHVybiByZXN1bHQgfVxuICAgIH0pXG5cbiAgICBzZXRDaGVja2xpc3QoQ2xhc3MsIENIRUNLX0FQSV9ET0NTKVxuXG4gICAgcmV0dXJuIENsYXNzXG4gIH1cblxuICBzdGF0aWMgYnVpbGQodGVtcGxhdGU6IE9iamVjdCk6IEZ1bmN0aW9uIHtcbiAgICBsZXQgdmFsaWRhdGlvblJlc3VsdHMgPSB0aGlzLnZhbGlkYXRlVGVtcGxhdGUodGVtcGxhdGUpXG4gICAgbGV0IENsYXNzID0gdGhpcy5nZW5lcmF0ZUNsYXNzKHRlbXBsYXRlLm5hbWUsIHRlbXBsYXRlLnR5cGUgfHwgR1FMQmFzZSlcblxuICAgIGlmICghQ2xhc3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6IHRydWV9KWBcbiAgICAgICAgTGF0dGljZUZhY3Rvcnkgd2FzIHVuYWJsZSB0byBidWlsZCB5b3VyIENsYXNzIGZyb20gdGhlIG5hbWUgYW5kIHR5cGVzXG4gICAgICAgIHN1cHBsaWVkIGluIHlvdXIgdGVtcGxhdGUuIFlvdSBwcm92aWRlZCB0aGUgZm9sbG93aW5nIHRlbXBsYXRlLiBQbGVhc2VcbiAgICAgICAgbG9vayBpdCBvdmVyIGFuZCBjb3JyZWN0IGFueSBlcnJvcnMgYmVmb3JlIHRyeWluZyBhZ2Fpbi5cblxuICAgICAgICBcXHgxYlsxbVRlbXBsYXRlXFx4MWJbMG1cbiAgICAgICAgICAke19pKHRlbXBsYXRlKX1cbiAgICAgIGApXG4gICAgfVxuXG4gICAgdGhpcy5pbmplY3RTY2hlbWEoQ2xhc3MsIHRlbXBsYXRlLnNjaGVtYSlcbiAgICB0aGlzLmluamVjdFJlc29sdmVycyhDbGFzcywgdGVtcGxhdGUucmVzb2x2ZXJzIHx8IHt9KVxuICAgIHRoaXMuaW5qZWN0RG9jcyhDbGFzcywgdGVtcGxhdGUuZG9jcyB8fCB7fSlcblxuICAgIC8vIE5lZWQgdG8gZml4IGhvdyBhdXRvLXByb3BzIHdvcms7IGZvciBub3cgY3JlYXRlIG9uZSBpbnN0YW5jZS4uLlxuICAgIG5ldyBDbGFzcyh7fSlcblxuICAgIGlmICghaGFzQ2hlY2tsaXN0KENsYXNzLCBDSEVDS19TQ0hFTUEsIENIRUNLX1JFU09MVkVSUywgQ0hFQ0tfQVBJX0RPQ1MpKSB7XG4gICAgICBsZXQgX3NjaGVtYSA9IGhhc0NoZWNrbGlzdChDbGFzcywgQ0hFQ0tfU0NIRU1BKSA/ICfinIUnIDogJ+KdjCdcbiAgICAgIGxldCBfcmVzb2x2ZXJzID0gaGFzQ2hlY2tsaXN0KENsYXNzLCBDSEVDS19SRVNPTFZFUlMpID8gJ+KchScgOiAn4p2MJ1xuICAgICAgbGV0IF9hcGlEb2NzID0gaGFzQ2hlY2tsaXN0KENsYXNzLCBDSEVDS19BUElfRE9DUykgPyAn4pyFJyA6ICfinYwnXG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6IHRydWV9KWBcbiAgICAgICAgU29tZXRoaW5nIHdlbnQgd3JvbmcgaW4gdGhlIHByb2Nlc3Mgb2YgYnVpbGRpbmcgdGhlIGNsYXNzIGNhbGxlZFxuICAgICAgICAke0NsYXNzICYmIENsYXNzLm5hbWUgfHwgdGVtcGxhdGUgJiYgdGVtcGxhdGUubmFtZSB8fCAnVW5rbm93biEnfSxcbiAgICAgICAgcGxlYXNlIGNoZWNrIHRoZSBzdXBwbGllZCB0ZW1wbGF0ZSBmb3IgZXJyb3JzLlxuXG4gICAgICAgIFsgJHtfc2NoZW1hfSBdIEhhcyBhIFNDSEVNQSBkZWZpbmVkXG4gICAgICAgIFsgJHtfcmVzb2x2ZXJzfSBdIEhhcyBkZWZpbmVkIFJFU09MVkVSUyBtYXRjaGluZyB0aGUgU0NIRU1BXG4gICAgICAgIFsgJHtfYXBpRG9jc30gXSBIYXMgZGVmaW5lZCBBUEkgRG9jcyBtYXRjaGluZyB0aGUgU0NIRU1BXG5cbiAgICAgICAgXFx4MWJbMW1UZW1wbGF0ZVxceDFiWzBtXG4gICAgICAgICR7X2kodGVtcGxhdGUpfVxuXG4gICAgICAgIFxceDFiWzFtQ2xhc3NcXHgxYlswbVxuICAgICAgICAke19pKENsYXNzKX1cbiAgICAgIGApXG4gICAgfVxuXG4gICAgcmV0dXJuIENsYXNzXG4gIH1cblxuICAvKipcbiAgICogQSBzdGF0aWMgaGVscGVyIG1ldGhvZCB0byBjb25zaXN0ZW50bHkgdGFnLCBvciBicmFuZCwgY2xhc3NlcyB3aXRoIGFcbiAgICogc3ltYm9sIHRoYXQgZGVub3RlcyB0aGV5IHdlcmUgY3JlYXRlZCB1c2luZyB0aGUgTGF0dGljZUZhY3RvcnkgcHJvY2Vzcy5cbiAgICogVGhpcyBpcyBkb25lIGJ5IHNldHRpbmcgYSBgU3ltYm9sYCBvbiB0aGUgcm9vdCBvZiB0aGUgY2xhc3Mgb3IgaW4gdGhlXG4gICAqIGBbTUVUQV9LRVldYCBvYmplY3QgZm9yIGNsYXNzZXMgZXh0ZW5kaW5nIGBHUUxCYXNlYC5cbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBicmFuZENsYXNzXG4gICAqIEBtZW1iZXJvZiBMYXR0aWNlRmFjdG9yeVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIHRoZSBjbGFzcyB0byBicmFuZCB3aXRoIHRoZSBgRkFDVE9SWV9DTEFTU2Agc3ltYm9sXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSByZXR1cm5zIHRoZSBDbGFzcyB2YWx1ZSBwYXNzZWQgaW5cbiAgICovXG4gIHN0YXRpYyBicmFuZENsYXNzKENsYXNzOiA/RnVuY3Rpb24pOiA/RnVuY3Rpb24ge1xuICAgIGlmIChDbGFzcykge1xuICAgICAgaWYgKGV4dGVuZHNGcm9tKENsYXNzLCBHUUxCYXNlKSkge1xuICAgICAgICBDbGFzc1tNRVRBX0tFWV1bdGhpcy5GQUNUT1JZX0NMQVNTXSA9IHRydWVcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBDbGFzc1t0aGlzLkZBQ1RPUllfQ0xBU1NdID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBDbGFzc1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RhdGljIGhlbHBlciB0byBjaGVjayBhbmQgc2VlIGlmIHRoZSBzdXBwbGllZCBjbGFzcyBvciBmdW5jdGlvbiB3YXNcbiAgICogYnJhbmRlZCB3aXRoIHRoZSBgYnJhbmRDbGFzcygpYCBmdW5jdGlvbi4gVGhpcyBhbW91bnRzIHRvIHN0b3JpbmcgdGhlXG4gICAqIGJvb2xlYW4gdHJ1ZSB1bmRlciB0aGUgcHJvcGVydHkgYENsYXNzW0xhdHRpY2VGYWN0b3J5LkZBQ1RPUllfQ0xBU1NdYCBvclxuICAgKiBgQ2xhc3NbTUVUQV9LRVldW0xhdHRpY2VGYWNhdG9yeS5GQUNUT1JZX0NMQVNTXWAgZm9yIGBHUUxCYXNlYCBleHRlbmRlZFxuICAgKiBjbGFzc2VzLlxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggGlzRmFjdG9yeUNsYXNzXG4gICAqIEBtZW1iZXJvZiBMYXR0aWNlRmFjdG9yeVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIHRoZSBjbGFzcyB0byBjaGVjayBmb3IgYEZBQ1RPUllfQ0xBU1NgIGJyYW5kaW5nXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGJyYW5kIGV4aXN0cywgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBzdGF0aWMgaXNGYWN0b3J5Q2xhc3MoQ2xhc3M6IEZ1bmN0aW9uKTogYm9vbGVhbiB7XG4gICAgaWYgKENsYXNzKSB7XG4gICAgICByZXR1cm4gKGV4dGVuZHNGcm9tKENsYXNzLCBHUUxCYXNlKVxuICAgICAgICA/ICEhQ2xhc3NbTUVUQV9LRVldW3RoaXMuRkFDVE9SWV9DTEFTU11cbiAgICAgICAgOiAhIUNsYXNzW3RoaXMuRkFDVE9SWV9DTEFTU11cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIGNvbnNpc3RlbnRseSByZW1vdmUgYW55IHByZXZpb3VzIHRhZyBvciBicmFuZFxuICAgKiBhcHBsaWVkIHdpdGggYGJyYW5kQ2xhc3NgLCB0aGlzIGlzIGRvbmUgYnkgcmVtb3ZpbmcgYSBwcmV2aW91c2x5IHNldFxuICAgKiBgU3ltYm9sYCBvbiB0aGUgcm9vdCBvZiB0aGUgY2xhc3Mgb3IgaW4gdGhlIGBbTUVUQV9LRVldYCBvYmplY3QgZm9yXG4gICAqIGNsYXNzZXMgZXh0ZW5kaW5nIGBHUUxCYXNlYC5cbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIByZW1vdmVDbGFzc0JyYW5kXG4gICAqIEBtZW1iZXJvZiBMYXR0aWNlRmFjdG9yeVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIHRoZSBjbGFzcyB0byBicmFuZCB3aXRoIHRoZSBgRkFDVE9SWV9DTEFTU2Agc3ltYm9sXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSByZXR1cm5zIHRoZSBDbGFzcyB2YWx1ZSBwYXNzZWQgaW5cbiAgICovXG4gIHN0YXRpYyByZW1vdmVDbGFzc0JyYW5kKENsYXNzOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICBpZiAoQ2xhc3MpIHtcbiAgICAgIGlmIChleHRlbmRzRnJvbShDbGFzcywgR1FMQmFzZSkpIHtcbiAgICAgICAgZGVsZXRlIENsYXNzW01FVEFfS0VZXVt0aGlzLkZBQ1RPUllfQ0xBU1NdXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGVsZXRlIENsYXNzW3RoaXMuRkFDVE9SWV9DTEFTU11cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gQ2xhc3NcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHRoYXQgcmVwb3J0cyB0aGF0IHRoaXMgY2xhc3MgaXMgYCdbb2JqZWN0IExhdHRpY2VGYWN0b3J5XSdgXG4gICAqIHJhdGhlciB0aGFuIGAnW29iamVjdCBPYmplY3RdJ2Agd2hlbiBpbnRyb3NwZWN0ZWQgd2l0aCB0b29scyBzdWNoIGFzXG4gICAqIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KGNsYXNzKWAuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBMYXR0aWNlRmFjdG9yeVxuICAgKiBAdHlwZSB7U3ltYm9sfVxuICAgKiBAc3RhdGljXG4gICAqL1xuICAvLyAkRmxvd0ZpeE1lXG4gIHN0YXRpYyBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7IHJldHVybiB0aGlzLm5hbWUgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IGV4cG9ydGVkIGFzIHBhcnQgb2YgTGF0dGljZUZhY3RvcnkgdGhhdCBjYW4gYmUgdXNlZCBmb3JcbiAgICogZGVmaW5pbmcgZG9jdW1lbnRhdGlvbiBmb3IgdGhlIHR5cGUgaXRzZWxmLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgTGF0dGljZUZhY3RvcnlcbiAgICogQHR5cGUge1N5bWJvbH1cbiAgICogQHN0YXRpY1xuICAgKi9cbiAgc3RhdGljIGdldCBUWVBFKCk6IFN5bWJvbCB7IHJldHVybiBTeW1ib2wuZm9yKCdBUEkgRG9jcyBUeXBlIENvbnN0YW50JykgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IGV4cG9ydGVkIGFzIHBhcnQgb2YgTGF0dGljZUZhY3RvcnkgdGhhdCBjYW4gYmUgdXNlZCBmb3JcbiAgICogaWRlbnRpZnlpbmcgY2xhc3NlcyB0aGF0IHdlcmUgZ2VuZXJhdGVkIHdpdGggTGF0dGljZUZhY3RvcnkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBMYXR0aWNlRmFjdG9yeVxuICAgKiBAdHlwZSB7U3ltYm9sfVxuICAgKiBAc3RhdGljXG4gICAqL1xuICBzdGF0aWMgZ2V0IEZBQ1RPUllfQ0xBU1MoKTogU3ltYm9sIHsgcmV0dXJuIFN5bWJvbC5mb3IoJ0ZhY3RvcnkgQ2xhc3MnKSB9XG59XG5cbmV4cG9ydCBjb25zdCBpc0ZhY3RvcnlDbGFzcyA9IExhdHRpY2VGYWN0b3J5LmlzRmFjdG9yeUNsYXNzXG5cbi8vIFRFU1RJTkcgUkVQTFxuLyoqXG52YXIgeyBMYXR0aWNlRmFjdG9yeSwgZ2V0Q2hlY2tsaXN0LCBoYXNDaGVja2xpc3QsIENIRUNLTElTVCwgQ0hFQ0tfU0NIRU1BLCBDSEVDS19SRVNPTFZFUlMgfSA9IHJlcXVpcmUoJy4vZGlzdC9MYXR0aWNlRmFjdG9yeScpOyB2YXIgeyBHUUxCYXNlLCBNRVRBX0tFWSwgam9pbkxpbmVzLCBTeW50YXhUcmVlLCB0eXBlT2YgfSA9IHJlcXVpcmUoJy4vZGlzdC9sYXR0aWNlJyk7IHZhciBncWwgPSBqb2luTGluZXMsIExGID0gTGF0dGljZUZhY3RvcnksIFRZUEUgPSBMRi5UWVBFO1xudmFyIFBlcnNvbkRlZiA9IHsgbmFtZTogJ1BlcnNvbicsIHNjaGVtYTogZ3FsYCBlbnVtIFN0YXRUeXBlIHsgUEhZU0lDQUwsIE1FTlRBTCB9IHR5cGUgUGVyc29uIHsgbmFtZTogU3RyaW5nIHN0YXRzKHR5cGU6U3RhdFR5cGUpOiBTdGF0IH0gdHlwZSBRdWVyeSB7IGZpbmRQZXJzb24oaWQ6IElEKTogUGVyc29uIH0gYCwgcmVzb2x2ZXJzOiB7IFF1ZXJ5OiB7IGZpbmRQZXJzb24oe3JlcSwgcmVzLCBuZXh0fSwge2lkfSkgeyBjb25zb2xlLmxvZygnZmluZCBwZXJzb24nKSB9IH0sIFBlcnNvbjogeyBzdGF0cyh7dHlwZX0pIHsgbGV0IHsgcmVxLCByZXMsIG5leHR9ID0gdGhpcy5yZXF1ZXN0RGF0YSB9IH0gfSwgZG9jczogeyBTdGF0VHlwZTogeyBbVFlQRV06IGBBIHR5cGUgb2Ygc3RhdGlzdGljIGFzc29jaWF0ZWQgd2l0aCBwZW9wbGVgLCBQSFlTSUNBTDogYFBoeXNpY2FsIGF0dHJpYnV0ZXNgLCBNRU5UQUw6IGBNZW50YWwgYXR0cmlidXRlc2AgfSwgUGVyc29uOiB7IFtUWVBFXTogYFJlcHJlc2VudHMgYSBwZXJzb25gLCBwZXJzb25JZDogYFVuaXF1ZSBpZCBvZiB0aGUgcGVyc29uIGluIHF1ZXN0aW9uYCwgbmFtZTogYFRoZSBuYW1lIG9mIHRoZSBwZXJzb25gLCBzdGF0czogYEFsbG93cyB5b3UgdG8gcXVlcnkgdGhlIHN0YXRzIG9mIGEgcGVyc29uIGJhc2VkIG9uIHR5cGVgIH0sIFF1ZXJ5OiB7IFtUWVBFXTogJ1RvcCBsZXZlbCBxdWVyeSBkZXNjLicsIGZpbmRQZXJzb246IGBTZWFyY2hlcyB0aGUgc3lzdGVtIGZvciB0aGUgc3BlY2lmaWVkIHVzZXJgIH0gfSB9O1xudmFyIFBlcnNvbiA9IExGLmJ1aWxkKFBlcnNvbkRlZiksIHAgPSBuZXcgUGVyc29uKHtuYW1lOiAnQnJpZWxsZSd9KVxuUGVyc29uLmdldFByb3AoJ3N0YXRzJyx0cnVlLHtyZXF1ZXN0RGF0YTp7cmVxOjEscmVzOjIsbmV4dDozfX0pXG52YXIgQnJva2UgPSBMRi5idWlsZCh7bmFtZTogJ0Jyb2tlJywgc2NoZW1hOiBncWxgdHlwZSBCcm9rZSB7bmFtZTogU3RyaW5nfWAsIHJlc29sdmVyczp7fSwgZG9jczp7fX0pXG52YXIgdCA9IExGLnZhbGlkYXRlVGVtcGxhdGUoe25hbWU6ICcnLCAgdHlwZTogR1FMQmFzZSwgcmVzb2x2ZXJzOiB7fSwgZG9jczoge30sIHNjaGVtYTogJyd9KTtcbiovXG4iXX0=